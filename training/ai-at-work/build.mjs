#!/usr/bin/env node
// course.json is the canonical content. This script checks structure and export drift.
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const argumentsList = process.argv.slice(2);
if (argumentsList.some((value) => value !== '--check') || argumentsList.length > 1) {
  throw new Error('Usage: node training/ai-at-work/build.mjs [--check]');
}
const checkOnly = argumentsList.includes('--check');
const course = JSON.parse(await readFile(join(directory, 'course.json'), 'utf8'));

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}
function shape(value, keys, label) {
  requireCondition(value && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
  requireCondition(Object.keys(value).sort().join('|') === [...keys].sort().join('|'), `${label}: unexpected or missing fields`);
}
function text(value, label) {
  requireCondition(typeof value === 'string' && value.trim().length > 0, `${label}: expected nonempty text`);
}
function strings(value, label) {
  requireCondition(Array.isArray(value) && value.length > 0, `${label}: expected nonempty array`);
  value.forEach((item, index) => text(item, `${label}[${index}]`));
}
function unique(values, label) {
  requireCondition(new Set(values).size === values.length, `${label}: duplicate value`);
}
function date(value, label) {
  requireCondition(/^\d{4}-\d{2}-\d{2}$/u.test(value), `${label}: expected ISO date`);
  const parsed = new Date(`${value}T00:00:00Z`);
  requireCondition(!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value, `${label}: invalid date`);
}

shape(course, ['version', 'slug', 'title', 'description', 'introduction', 'reviewedOn', 'scenario', 'lessons', 'sources'], 'course');
requireCondition(course.version === '1.0.0' && course.slug === 'ai-at-work' && course.title === 'AI at Work', 'Unexpected course identity');
text(course.description, 'description');
strings(course.introduction, 'introduction');
date(course.reviewedOn, 'reviewedOn');
shape(course.scenario, ['title', 'description', 'documents'], 'scenario');
text(course.scenario.title, 'scenario.title');
text(course.scenario.description, 'scenario.description');
requireCondition(Array.isArray(course.scenario.documents) && course.scenario.documents.length === 4, 'Expected the four shared documents');
for (const document of course.scenario.documents) {
  shape(document, ['id', 'title', 'date', 'kind', 'body'], 'document');
  ['id', 'title', 'kind'].forEach((key) => text(document[key], `document.${key}`));
  date(document.date, `document ${document.id} date`);
  strings(document.body, `document ${document.id} body`);
}
unique(course.scenario.documents.map((document) => document.id), 'Document IDs');
requireCondition(Array.isArray(course.sources) && course.sources.length >= 3, 'Expected at least three sources');
for (const source of course.sources) {
  const keys = ['id', 'title', 'publisher', 'url', 'publishedOrUpdated', 'reviewedOn', 'support', 'application', 'limits', 'revisit'];
  shape(source, keys, 'source');
  keys.forEach((key) => text(source[key], `source ${source.id}.${key}`));
  requireCondition(new URL(source.url).protocol === 'https:', `Source ${source.id}: expected HTTPS`);
  date(source.reviewedOn, `source ${source.id} reviewedOn`);
  requireCondition(source.reviewedOn === course.reviewedOn, `Source ${source.id}: review date differs from course`);
}
unique(course.sources.map((source) => source.id), 'Source IDs');
const sourceIds = new Set(course.sources.map((source) => source.id));
for (const match of JSON.stringify(course).matchAll(/\[(S\d+(?:,\s*S\d+)*)\]/gu)) {
  for (const id of match[1].split(/,\s*/u)) requireCondition(sourceIds.has(id), `Unknown source reference ${id}`);
}

const expectedSlugs = ['frame-the-task', 'build-the-context', 'review-the-answer'];
requireCondition(Array.isArray(course.lessons) && course.lessons.length === 3, 'Expected three lessons');
const wordCounts = [];
for (const [index, lesson] of course.lessons.entries()) {
  shape(lesson, ['slug', 'number', 'title', 'summary', 'duration', 'outcome', 'explanation', 'workedExample', 'task', 'hint', 'modelAnswer', 'reflection', 'transfer', 'check'], `lesson ${index + 1}`);
  requireCondition(lesson.slug === expectedSlugs[index] && lesson.number === index + 1, 'Lesson order or identity mismatch');
  ['title', 'summary', 'outcome', 'hint', 'reflection'].forEach((key) => text(lesson[key], `${lesson.slug}.${key}`));
  requireCondition(lesson.duration === '15–20 minutes', `${lesson.slug}: unexpected suggested duration`);
  strings(lesson.explanation, `${lesson.slug}.explanation`);
  strings(lesson.modelAnswer, `${lesson.slug}.modelAnswer`);
  shape(lesson.workedExample, ['title', 'before', 'after', 'why'], `${lesson.slug}.workedExample`);
  Object.entries(lesson.workedExample).forEach(([key, value]) => text(value, `${lesson.slug}.workedExample.${key}`));
  shape(lesson.task, ['prompt', 'deliverable', 'checklist'], `${lesson.slug}.task`);
  text(lesson.task.prompt, `${lesson.slug}.task.prompt`);
  text(lesson.task.deliverable, `${lesson.slug}.task.deliverable`);
  strings(lesson.task.checklist, `${lesson.slug}.task.checklist`);
  shape(lesson.transfer, ['prompt', 'answer'], `${lesson.slug}.transfer`);
  text(lesson.transfer.prompt, `${lesson.slug}.transfer.prompt`);
  text(lesson.transfer.answer, `${lesson.slug}.transfer.answer`);
  shape(lesson.check, ['question', 'options', 'answerId'], `${lesson.slug}.check`);
  text(lesson.check.question, `${lesson.slug}.check.question`);
  requireCondition(Array.isArray(lesson.check.options) && lesson.check.options.length === 3, `${lesson.slug}: expected three check options`);
  for (const option of lesson.check.options) {
    shape(option, ['id', 'label', 'feedback'], `${lesson.slug}.option`);
    Object.entries(option).forEach(([key, value]) => text(value, `${lesson.slug}.option.${key}`));
  }
  unique(lesson.check.options.map((option) => option.id), `${lesson.slug} option IDs`);
  requireCondition(lesson.check.options.some((option) => option.id === lesson.check.answerId), `${lesson.slug}: answer ID is not an option`);
  const readable = [lesson.title, lesson.summary, lesson.outcome, ...lesson.explanation, ...Object.values(lesson.workedExample), lesson.task.prompt, lesson.task.deliverable, ...lesson.task.checklist, lesson.hint, ...lesson.modelAnswer, lesson.reflection, ...Object.values(lesson.transfer), lesson.check.question, ...lesson.check.options.flatMap((option) => [option.label, option.feedback])];
  const words = readable.join(' ').split(/\s+/u).filter(Boolean).length;
  requireCondition(words >= 350 && words <= 600, `${lesson.slug}: ${words} words, expected 350–600`);
  wordCounts.push(`${lesson.number}: ${words}`);
}

const generated = '<!-- Generated from course.json by build.mjs. Edit the JSON and regenerate. -->';
const researchLinks = (value) => value.replace(/\[(S\d+(?:,\s*S\d+)*)\]/gu, (_, ids) => ids.split(/,\s*/u).map((id) => `[${id}](sources.md#${id.toLowerCase()})`).join(', '));
const paragraphs = (values) => values.map(researchLinks).join('\n\n');
const details = (label, content) => `<details>\n<summary>${label}</summary>\n\n${content}\n\n</details>`;
const exports = new Map();
exports.set('source-packet.md', `${generated}\n\n# ${course.scenario.title}\n\n${course.scenario.description}\n\n${course.scenario.documents.map((document) => `## ${document.id}: ${document.title}\n\nDate: ${document.date} · ${document.kind}\n\n${paragraphs(document.body)}`).join('\n\n')}\n\n[Back to the course](README.md)\n`);
for (const lesson of course.lessons) {
  const options = lesson.check.options.map((option) => `- **${option.id.toUpperCase()}.** ${option.label}`).join('\n');
  const feedback = lesson.check.options.map((option) => `**${option.id.toUpperCase()}:** ${option.feedback}`).join('\n\n');
  exports.set(`${String(lesson.number).padStart(2, '0')}-${lesson.slug}.md`, `${generated}\n\n# ${lesson.number}. ${lesson.title}\n\n${lesson.summary}\n\nSuggested time: ${lesson.duration}. Work on paper or in a document; an AI account is optional.\n\n**Outcome:** ${lesson.outcome}\n\nRead the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.\n\n${paragraphs(lesson.explanation)}\n\n## Worked example: ${lesson.workedExample.title}\n\n**Before**\n\n${researchLinks(lesson.workedExample.before)}\n\n**After**\n\n${researchLinks(lesson.workedExample.after)}\n\n**Why:** ${researchLinks(lesson.workedExample.why)}\n\n## Your turn\n\n${lesson.task.prompt}\n\n**Deliverable:** ${lesson.task.deliverable}\n\n${lesson.task.checklist.map((item) => `- [ ] ${item}`).join('\n')}\n\nUse the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.\n\n${details('Optional hint', lesson.hint)}\n\n${details('Compare with an example answer after your attempt', paragraphs(lesson.modelAnswer))}\n\n## Explain your choice\n\n${lesson.reflection}\n\n## Try a changed case\n\n${lesson.transfer.prompt}\n\n${details('Changed-case answer', lesson.transfer.answer)}\n\n## Check one decision\n\n${lesson.check.question}\n\n${options}\n\n${details('Answer and feedback', `The supported choice is **${lesson.check.answerId.toUpperCase()}**.\n\n${feedback}`)}\n\nFeedback is authored for this exercise. It is not an AI evaluation or evidence of retained skill.\n\n[Course overview](README.md) · [Research and limits](sources.md)\n`);
}
exports.set('sources.md', `${generated}\n\n# Research behind AI at Work\n\nResearch reviewed: ${course.reviewedOn}. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial or model comparison has been performed for this course.\n\n${course.sources.map((source) => `## ${source.id}\n\n**[${source.title}](${source.url})**\n\nPublisher: ${source.publisher}\n\nPublished or updated: ${source.publishedOrUpdated}\n\nReviewed: ${source.reviewedOn}\n\n**Supports:** ${source.support}\n\n**Our application:** ${source.application}\n\n**Limits:** ${source.limits}\n\n**Revisit when:** ${source.revisit}`).join('\n\n')}\n\nThe proposed approach builds on the library's [capability guide](https://github.com/hellojdmiller/technology-operations-library/blob/main/research/building-capability-with-ai.md) and [prompting guide](https://github.com/hellojdmiller/technology-operations-library/blob/main/prompting/README.md). Those resources provide broader context; their source-review dates remain separate from this course.\n\n[Back to the course](README.md)\n`);

const stale = [];
for (const [name, expected] of exports) {
  const location = join(directory, name);
  if (checkOnly) {
    const actual = await readFile(location, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (actual !== expected) stale.push(name);
  } else {
    await writeFile(location, expected, 'utf8');
  }
}
requireCondition(stale.length === 0, `Generated exports differ or are missing: ${stale.join(', ')}. Run build.mjs without --check.`);
console.log(`Course structure and ${exports.size} exports ${checkOnly ? 'checked' : 'generated'}. Lesson words: ${wordCounts.join('; ')}.`);
console.log('This checks content structure and export consistency, not factual correctness, model behavior, or learning outcomes.');
