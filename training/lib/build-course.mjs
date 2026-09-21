#!/usr/bin/env node
// Generic course builder. Each course directory holds one canonical course.json;
// this script checks its structure and generates the Markdown exports beside it.
//
//   node training/lib/build-course.mjs training/<course>            generate exports
//   node training/lib/build-course.mjs training/<course> --check    fail if exports drift
//   node training/lib/build-course.mjs --all [--check]              every training/*/course.json that declares a track
//
// The AI at Work course predates this schema and keeps its own build.mjs.
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { basename, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TRACKS = ['security-awareness', 'ai-at-work', 'technology-operations'];
const here = dirname(fileURLToPath(import.meta.url));
const trainingRoot = resolve(here, '..');
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const all = args.includes('--all');
const positional = args.filter((value) => !value.startsWith('--'));
if ((all && positional.length) || (!all && positional.length !== 1) || args.some((value) => value.startsWith('--') && !['--check', '--all'].includes(value))) {
  throw new Error('Usage: node training/lib/build-course.mjs <course-dir> [--check] | --all [--check]');
}

function requireCondition(condition, message) { if (!condition) throw new Error(message); }
function shape(value, keys, label) {
  requireCondition(value && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
  requireCondition(Object.keys(value).sort().join('|') === [...keys].sort().join('|'), `${label}: unexpected or missing fields (have ${Object.keys(value).sort().join(', ')})`);
}
function text(value, label) { requireCondition(typeof value === 'string' && value.trim().length > 0, `${label}: expected nonempty text`); }
function strings(value, label, min = 1) {
  requireCondition(Array.isArray(value) && value.length >= min, `${label}: expected an array of at least ${min}`);
  value.forEach((item, index) => text(item, `${label}[${index}]`));
}
function unique(values, label) { requireCondition(new Set(values).size === values.length, `${label}: duplicate value`); }
function date(value, label) {
  requireCondition(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(value), `${label}: expected ISO date`);
  const parsed = new Date(`${value}T00:00:00Z`);
  requireCondition(!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value, `${label}: invalid date`);
}
const noDashes = (value, label) => requireCondition(!/[—]/u.test(value), `${label}: em dash found; use a comma, colon, or period`);

function validate(course, directory) {
  shape(course, ['version', 'slug', 'title', 'track', 'audience', 'prerequisites', 'description', 'introduction', 'reviewedOn', 'scenario', 'lessons', 'sources'], 'course');
  requireCondition(/^\d+\.\d+\.\d+$/u.test(course.version), 'version: expected semver');
  requireCondition(course.slug === basename(directory), `slug ${course.slug} must match the directory name ${basename(directory)}`);
  requireCondition(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(course.slug), 'slug: lowercase words joined by hyphens');
  text(course.title, 'title');
  requireCondition(TRACKS.includes(course.track), `track: expected one of ${TRACKS.join(', ')}`);
  text(course.audience, 'audience');
  requireCondition(Array.isArray(course.prerequisites), 'prerequisites: expected an array (may be empty)');
  course.prerequisites.forEach((item, index) => text(item, `prerequisites[${index}]`));
  text(course.description, 'description');
  strings(course.introduction, 'introduction', 2);
  date(course.reviewedOn, 'reviewedOn');
  shape(course.scenario, ['title', 'description', 'documents'], 'scenario');
  text(course.scenario.title, 'scenario.title');
  text(course.scenario.description, 'scenario.description');
  requireCondition(Array.isArray(course.scenario.documents) && course.scenario.documents.length >= 3 && course.scenario.documents.length <= 6, 'scenario.documents: expected three to six documents');
  course.scenario.documents.forEach((document, index) => {
    shape(document, ['id', 'title', 'date', 'kind', 'body'], `document ${index + 1}`);
    requireCondition(document.id === `D${index + 1}`, `document ${index + 1}: id must be D${index + 1}`);
    ['title', 'kind'].forEach((key) => text(document[key], `document ${document.id}.${key}`));
    date(document.date, `document ${document.id} date`);
    strings(document.body, `document ${document.id} body`);
  });
  requireCondition(Array.isArray(course.sources) && course.sources.length >= 3, 'sources: expected at least three');
  course.sources.forEach((source, index) => {
    const keys = ['id', 'title', 'publisher', 'url', 'publishedOrUpdated', 'reviewedOn', 'support', 'application', 'limits', 'revisit'];
    shape(source, keys, `source ${index + 1}`);
    keys.forEach((key) => text(source[key], `source ${source.id}.${key}`));
    requireCondition(source.id === `S${index + 1}`, `source ${index + 1}: id must be S${index + 1}`);
    requireCondition(new URL(source.url).protocol === 'https:', `source ${source.id}: expected HTTPS`);
    date(source.reviewedOn, `source ${source.id} reviewedOn`);
    requireCondition(source.reviewedOn === course.reviewedOn, `source ${source.id}: review date differs from course`);
  });
  const sourceIds = new Set(course.sources.map((source) => source.id));
  for (const match of JSON.stringify(course).matchAll(/\[(S\d+(?:,\s*S\d+)*)\]/gu)) {
    for (const id of match[1].split(/,\s*/u)) requireCondition(sourceIds.has(id), `Unknown source reference ${id}`);
  }
  requireCondition(Array.isArray(course.lessons) && course.lessons.length >= 3 && course.lessons.length <= 5, 'lessons: expected three to five');
  const wordCounts = [];
  course.lessons.forEach((lesson, index) => {
    shape(lesson, ['slug', 'number', 'title', 'summary', 'duration', 'outcome', 'explanation', 'workedExample', 'task', 'hint', 'modelAnswer', 'reflection', 'transfer', 'check'], `lesson ${index + 1}`);
    requireCondition(lesson.number === index + 1, `lesson ${index + 1}: number must be ${index + 1}`);
    requireCondition(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(lesson.slug), `lesson ${index + 1}: slug must be lowercase words joined by hyphens`);
    ['title', 'summary', 'outcome', 'hint', 'reflection'].forEach((key) => text(lesson[key], `${lesson.slug}.${key}`));
    requireCondition(/^\d+–\d+ minutes$/u.test(lesson.duration), `${lesson.slug}: duration like "15–20 minutes"`);
    strings(lesson.explanation, `${lesson.slug}.explanation`, 2);
    strings(lesson.modelAnswer, `${lesson.slug}.modelAnswer`);
    shape(lesson.workedExample, ['title', 'before', 'after', 'why'], `${lesson.slug}.workedExample`);
    Object.entries(lesson.workedExample).forEach(([key, value]) => text(value, `${lesson.slug}.workedExample.${key}`));
    shape(lesson.task, ['prompt', 'deliverable', 'checklist'], `${lesson.slug}.task`);
    text(lesson.task.prompt, `${lesson.slug}.task.prompt`);
    text(lesson.task.deliverable, `${lesson.slug}.task.deliverable`);
    strings(lesson.task.checklist, `${lesson.slug}.task.checklist`, 3);
    shape(lesson.transfer, ['prompt', 'answer'], `${lesson.slug}.transfer`);
    text(lesson.transfer.prompt, `${lesson.slug}.transfer.prompt`);
    text(lesson.transfer.answer, `${lesson.slug}.transfer.answer`);
    shape(lesson.check, ['question', 'options', 'answerId'], `${lesson.slug}.check`);
    text(lesson.check.question, `${lesson.slug}.check.question`);
    requireCondition(Array.isArray(lesson.check.options) && lesson.check.options.length === 3, `${lesson.slug}: expected three check options`);
    lesson.check.options.forEach((option) => {
      shape(option, ['id', 'label', 'feedback'], `${lesson.slug}.option`);
      Object.entries(option).forEach(([key, value]) => text(value, `${lesson.slug}.option.${key}`));
    });
    unique(lesson.check.options.map((option) => option.id), `${lesson.slug} option IDs`);
    requireCondition(lesson.check.options.some((option) => option.id === lesson.check.answerId), `${lesson.slug}: answer ID is not an option`);
    const readable = [lesson.title, lesson.summary, lesson.outcome, ...lesson.explanation, ...Object.values(lesson.workedExample), lesson.task.prompt, lesson.task.deliverable, ...lesson.task.checklist, lesson.hint, ...lesson.modelAnswer, lesson.reflection, ...Object.values(lesson.transfer), lesson.check.question, ...lesson.check.options.flatMap((option) => [option.label, option.feedback])];
    const words = readable.join(' ').split(/\s+/u).filter(Boolean).length;
    requireCondition(words >= 350 && words <= 750, `${lesson.slug}: ${words} words, expected 350–750`);
    wordCounts.push(`${lesson.number}: ${words}`);
  });
  unique(course.lessons.map((lesson) => lesson.slug), 'lesson slugs');
  noDashes(JSON.stringify(course), 'course');
  return wordCounts;
}

function exportsFor(course) {
  const generated = '<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->';
  const researchLinks = (value) => value.replace(/\[(S\d+(?:,\s*S\d+)*)\]/gu, (_, ids) => ids.split(/,\s*/u).map((id) => `[${id}](sources.md#${id.toLowerCase()})`).join(', '));
  const paragraphs = (values) => values.map(researchLinks).join('\n\n');
  const details = (label, content) => `<details>\n<summary>${label}</summary>\n\n${content}\n\n</details>`;
  const lessonFile = (lesson) => `${String(lesson.number).padStart(2, '0')}-${lesson.slug}.md`;
  const trackLabel = { 'security-awareness': 'Security awareness', 'ai-at-work': 'AI at work', 'technology-operations': 'Technology operations' }[course.track];
  const out = new Map();

  out.set('README.md', `${generated}\n\n# ${course.title}\n\n${course.description}\n\n${paragraphs(course.introduction)}\n\n**Track:** ${trackLabel} · **For:** ${course.audience}${course.prerequisites.length ? ` · **Before this course:** ${course.prerequisites.join('; ')}` : ''}\n\n## Start here\n\nRead the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.\n\n| Lesson | What you will make | Suggested time |\n| --- | --- | --- |\n${course.lessons.map((lesson) => `| [${lesson.number}. ${lesson.title}](${lessonFile(lesson)}) | ${lesson.outcome} | ${lesson.duration} |`).join('\n')}\n\nUse the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.\n\n## Research and status\n\nSources were reviewed **${course.reviewedOn}**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.\n\nEverything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.\n\n## Maintain the content\n\n[course.json](course.json) is the canonical source. Edit it and regenerate:\n\n\`\`\`sh\nnode training/lib/build-course.mjs training/${course.slug}\nnode training/lib/build-course.mjs training/${course.slug} --check\n\`\`\`\n\nThe check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.\n\n[All training](../README.md)\n`);

  out.set('source-packet.md', `${generated}\n\n# ${course.scenario.title}\n\n${course.scenario.description}\n\n${course.scenario.documents.map((document) => `## ${document.id}: ${document.title}\n\nDate: ${document.date} · ${document.kind}\n\n${paragraphs(document.body)}`).join('\n\n')}\n\n[Back to the course](README.md)\n`);

  for (const lesson of course.lessons) {
    const options = lesson.check.options.map((option) => `- **${option.id.toUpperCase()}.** ${option.label}`).join('\n');
    const feedback = lesson.check.options.map((option) => `**${option.id.toUpperCase()}:** ${option.feedback}`).join('\n\n');
    const previous = course.lessons[lesson.number - 2];
    const next = course.lessons[lesson.number];
    const nav = [previous ? `[Previous: ${previous.title}](${lessonFile(previous)})` : '[Course overview](README.md)', next ? `[Next: ${next.title}](${lessonFile(next)})` : '[Course overview](README.md)', '[Research and limits](sources.md)'].join(' · ');
    out.set(lessonFile(lesson), `${generated}\n\n# ${lesson.number}. ${lesson.title}\n\n${lesson.summary}\n\nSuggested time: ${lesson.duration}. Work on paper or in a document.\n\n**Outcome:** ${lesson.outcome}\n\nRead the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.\n\n${paragraphs(lesson.explanation)}\n\n## Worked example: ${lesson.workedExample.title}\n\n**Before**\n\n${researchLinks(lesson.workedExample.before)}\n\n**After**\n\n${researchLinks(lesson.workedExample.after)}\n\n**Why:** ${researchLinks(lesson.workedExample.why)}\n\n## Your turn\n\n${lesson.task.prompt}\n\n**Deliverable:** ${lesson.task.deliverable}\n\n${lesson.task.checklist.map((item) => `- [ ] ${item}`).join('\n')}\n\nUse the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.\n\n${details('Optional hint', lesson.hint)}\n\n${details('Compare with an example answer after your attempt', paragraphs(lesson.modelAnswer))}\n\n## Explain your choice\n\n${lesson.reflection}\n\n## Try a changed case\n\n${lesson.transfer.prompt}\n\n${details('Changed-case answer', lesson.transfer.answer)}\n\n## Check one decision\n\n${lesson.check.question}\n\n${options}\n\n${details('Answer and feedback', `The supported choice is **${lesson.check.answerId.toUpperCase()}**.\n\n${feedback}`)}\n\nFeedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.\n\n${nav}\n`);
  }

  out.set('worksheet.md', `${generated}\n\n# ${course.title}: worksheet\n\nKeep your first attempt separate from any revision, and write down what you would still need to check. Everything in the [packet](source-packet.md) is fictional.\n\n**Name (optional):** \n\n**Date:** \n\n${course.lessons.map((lesson) => `## Lesson ${lesson.number}: ${lesson.title}\n\n**Outcome:** ${lesson.outcome}\n\n**Task:** ${lesson.task.prompt}\n\n**Deliverable:** ${lesson.task.deliverable}\n\n${lesson.task.checklist.map((item) => `- [ ] ${item}`).join('\n')}\n\n**First attempt**\n\n\n\n**Revision after comparing with the example**\n\n\n\n**What I would still check, and with whom**\n\n\n\n**Changed case (${lesson.transfer.prompt.length > 80 ? 'see lesson' : lesson.transfer.prompt}):** \n\n`).join('\n')}\n[Back to the course](README.md)\n`);

  const totalMinutes = course.lessons.map((lesson) => lesson.duration.match(/^(\d+)–(\d+)/u)).reduce((sum, m) => [sum[0] + Number(m[1]), sum[1] + Number(m[2])], [0, 0]);
  out.set('facilitator.md', `${generated}\n\n# ${course.title}: facilitator guide\n\nA colleague can run this course as one session of about ${totalMinutes[0] + 15}–${totalMinutes[1] + 25} minutes, or as ${course.lessons.length} short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.\n\n## Before the session\n\n- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).\n- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.\n- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.\n\n## Ground rules\n\n- Try the task before opening the example answer. The example is a comparison, not a mark scheme.\n- Explaining a choice matters more than matching the wording.\n- A first attempt with honest gaps is more useful than a polished copy of the example.\n\n${course.lessons.map((lesson) => `## Lesson ${lesson.number}: ${lesson.title} (${lesson.duration})\n\n**Outcome:** ${lesson.outcome}\n\n**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.\n\n**Discussion prompt:** ${lesson.reflection}\n\n**Changed case:** ${lesson.transfer.prompt}\n\n${details('Changed-case answer', lesson.transfer.answer)}\n\n**Check:** ${lesson.check.question} The supported choice is **${lesson.check.answerId.toUpperCase()}**.\n\n${details('Why the other options fall short', lesson.check.options.filter((option) => option.id !== lesson.check.answerId).map((option) => `**${option.id.toUpperCase()}:** ${option.feedback}`).join('\n\n'))}`).join('\n\n')}\n\n## After the session\n\n- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.\n- Record attendance and the date in your own training record, not in this repository.\n- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.\n\n[Back to the course](README.md)\n`);

  out.set('sources.md', `${generated}\n\n# Research behind ${course.title}\n\nResearch reviewed: ${course.reviewedOn}. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.\n\n${course.sources.map((source) => `## ${source.id}\n\n**[${source.title}](${source.url})**\n\nPublisher: ${source.publisher}\n\nPublished or updated: ${source.publishedOrUpdated}\n\nReviewed: ${source.reviewedOn}\n\n**Supports:** ${source.support}\n\n**Our application:** ${source.application}\n\n**Limits:** ${source.limits}\n\n**Revisit when:** ${source.revisit}`).join('\n\n')}\n\n[Back to the course](README.md)\n`);
  return out;
}

async function run(directory) {
  const course = JSON.parse(await readFile(join(directory, 'course.json'), 'utf8'));
  const wordCounts = validate(course, directory);
  const out = exportsFor(course);
  const stale = [];
  for (const [name, expected] of out) {
    const location = join(directory, name);
    if (checkOnly) {
      const actual = await readFile(location, 'utf8').catch((error) => { if (error.code === 'ENOENT') return null; throw error; });
      if (actual !== expected) stale.push(name);
    } else {
      await writeFile(location, expected, 'utf8');
    }
  }
  requireCondition(stale.length === 0, `${course.slug}: generated exports differ or are missing: ${stale.join(', ')}. Run the builder without --check.`);
  console.log(`${course.slug}: structure and ${out.size} exports ${checkOnly ? 'checked' : 'generated'}. Lesson words: ${wordCounts.join('; ')}.`);
}

const directories = [];
if (all) {
  for (const entry of await readdir(trainingRoot)) {
    const dir = join(trainingRoot, entry);
    if (!(await stat(dir)).isDirectory()) continue;
    const raw = await readFile(join(dir, 'course.json'), 'utf8').catch(() => null);
    if (raw && JSON.parse(raw).track !== undefined) directories.push(dir);
  }
  requireCondition(directories.length > 0, 'No course directories with a track found under training/');
} else {
  directories.push(resolve(positional[0]));
}
for (const directory of directories.sort()) await run(directory);
console.log('This checks content structure and export consistency, not factual correctness or learning outcomes.');
