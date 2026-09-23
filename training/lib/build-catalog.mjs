#!/usr/bin/env node
// Builds training/catalog.json and training/CATALOG.md from every course.json that declares a track,
// plus the learning journeys in training/journeys.json (optional), the hand-written operator modules
// (training/*.md), the vendor task cards (training/vendor-walkthroughs/*.md), and the supporting
// directory, delivery pack, and record template. --check fails on drift.
//
//   node training/lib/build-catalog.mjs [--check]
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const checkOnly = process.argv.includes('--check');
const TRACKS = [
  ['security-awareness', 'Security awareness', 'For everyone at the firm. Short modules and three-lesson courses on the habits that stop most incidents.'],
  ['ai-at-work', 'AI at work', 'For everyone who uses an AI assistant. Framing, context, checking, and not leaking.'],
  ['technology-operations', 'Technology operations', 'For the operator and the people in the room when something goes wrong.'],
];
// The operator path in learning order, as training/README.md presents it. Every top-level module file must be listed here.
const OPERATOR_ORDER = ['saas-ownership-and-handover', 'microsoft-365-entra-operator', 'google-workspace-operator', 'intune-device-operations', 'jamf-device-operations', 'n8n-workflow-operator'];
const NOT_MODULES = new Set(['README.md', 'CATALOG.md', 'COURSE-AUTHORING.md', 'training-record-template.md']);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function minutes(lessons) {
  return lessons.map((lesson) => lesson.duration.match(/^(\d+)–(\d+)/u)).reduce((sum, m) => [sum[0] + Number(m[1]), sum[1] + Number(m[2])], [0, 0]);
}
function field(text, label, file) {
  const match = text.match(new RegExp(`^\\*\\*${label}:\\*\\* (.+)$`, 'mu'));
  if (!match) throw new Error(`${file}: missing "**${label}:**" line`);
  return match[1].trim();
}
function isoDate(value, file) {
  const match = value.match(/^([A-Z][a-z]+) (\d{1,2}), (\d{4})/u);
  const month = match ? MONTHS.indexOf(match[1]) : -1;
  if (month < 0) throw new Error(`${file}: expected a date like "September 17, 2026" in "${value}"`);
  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[2].padStart(2, '0')}`;
}
function title(text, file) {
  const match = text.match(/^# (.+)$/mu);
  if (!match) throw new Error(`${file}: missing title`);
  return match[1].trim();
}
const sentence = (value) => value.replace(/\.$/u, '').replace(/^[a-z]/u, (c) => c.toUpperCase());

const entries = [];
for (const name of (await readdir(root)).sort()) {
  const dir = join(root, name);
  if (!(await stat(dir)).isDirectory()) continue;
  const raw = await readFile(join(dir, 'course.json'), 'utf8').catch(() => null);
  if (!raw) continue;
  const course = JSON.parse(raw);
  const track = course.track ?? (course.slug === 'ai-at-work' ? 'ai-at-work' : undefined);
  if (!track) continue;
  const [min, max] = minutes(course.lessons);
  entries.push({
    slug: course.slug, title: course.title, track, format: course.format ?? 'course',
    audience: course.audience ?? 'Employees across administration, finance, marketing, HR, project teams, and other everyday roles.',
    prerequisites: course.prerequisites ?? [], description: course.description, reviewedOn: course.reviewedOn,
    lessons: course.lessons.map((lesson) => ({ number: lesson.number, title: lesson.title, duration: lesson.duration })),
    minutes: { min, max }, path: `${course.slug}/README.md`,
  });
}
if (entries.length === 0) throw new Error('No courses found');

const journeysRaw = await readFile(join(root, 'journeys.json'), 'utf8').catch(() => null);
const journeys = journeysRaw ? JSON.parse(journeysRaw) : [];
const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
for (const journey of journeys) {
  for (const key of ['id', 'title', 'audience', 'description']) if (typeof journey[key] !== 'string' || !journey[key]) throw new Error(`journey ${journey.id ?? '?'}: missing ${key}`);
  if (!Array.isArray(journey.steps) || journey.steps.length < 2) throw new Error(`journey ${journey.id}: expected at least two steps`);
  for (const slug of journey.steps) if (!bySlug.has(slug)) throw new Error(`journey ${journey.id}: unknown course ${slug}`);
}

// Operator modules: hand-written top-level Markdown files with Audience, Mode, and Source review header lines.
const moduleFiles = (await readdir(root)).filter((name) => name.endsWith('.md') && !NOT_MODULES.has(name)).map((name) => name.replace(/\.md$/u, '')).sort();
const listed = [...OPERATOR_ORDER].sort();
if (JSON.stringify(moduleFiles) !== JSON.stringify(listed)) throw new Error(`Operator modules on disk (${moduleFiles.join(', ')}) differ from OPERATOR_ORDER (${listed.join(', ')}); update the list or the files.`);
const operatorModules = [];
for (const slug of OPERATOR_ORDER) {
  const file = `${slug}.md`;
  const text = await readFile(join(root, file), 'utf8');
  operatorModules.push({ slug, title: title(text, file), path: file, audience: sentence(field(text, 'Audience', file)), mode: sentence(field(text, 'Mode', file)), reviewedOn: isoDate(field(text, 'Source review', file), file) });
}

// Vendor task cards: each states its number, suggested practice time, mode, and research review date.
const cardDir = join(root, 'vendor-walkthroughs');
const vendorWalkthroughs = [];
for (const name of (await readdir(cardDir)).filter((n) => n.endsWith('.md') && n !== 'README.md')) {
  const file = `vendor-walkthroughs/${name}`;
  const text = await readFile(join(cardDir, name), 'utf8');
  const header = text.match(/^\*\*Task card:\*\* (\d+) of (\d+) · \*\*Suggested practice:\*\* (\d+) minutes[^·]*· \*\*Mode:\*\* (.+)$/mu);
  if (!header) throw new Error(`${file}: missing "**Task card:** n of N · **Suggested practice:** n minutes ... · **Mode:** ..." line`);
  vendorWalkthroughs.push({ number: Number(header[1]), of: Number(header[2]), title: title(text, file), path: file, practiceMinutes: Number(header[3]), mode: sentence(header[4]), reviewedOn: isoDate(field(text, 'Research reviewed', file), file) });
}
vendorWalkthroughs.sort((a, b) => a.number - b.number);
vendorWalkthroughs.forEach((card, index) => {
  if (card.number !== index + 1 || card.of !== vendorWalkthroughs.length) throw new Error(`${card.path}: task card numbering does not match the ${vendorWalkthroughs.length} cards on disk`);
});

// Supporting resources: the directory (counted from its data), the delivery pack (counted from its files), and the record template.
const sites = JSON.parse(await readFile(join(root, 'free-training-directory', 'sites.json'), 'utf8'));
const deliveryFiles = (await readdir(join(root, 'delivery'))).filter((name) => name !== 'README.md').sort();
const supporting = [
  { id: 'directory', title: title(await readFile(join(root, 'free-training-directory', 'README.md'), 'utf8'), 'free-training-directory/README.md'), path: 'free-training-directory/README.md', count: sites.length, summary: `${sites.length} learning destinations with their free scope, access conditions, official evidence, and a proposed starter task, plus a CSV for an internal catalog.` },
  { id: 'delivery', title: title(await readFile(join(root, 'delivery', 'README.md'), 'utf8'), 'delivery/README.md'), path: 'delivery/README.md', count: deliveryFiles.length, summary: `a proposed 60-minute first session around one task card and the records for follow-up checks over 30 days (${deliveryFiles.join(', ')}).` },
  { id: 'record', title: title(await readFile(join(root, 'training-record-template.md'), 'utf8'), 'training-record-template.md'), path: 'training-record-template.md', summary: 'the blank record for an operator module or task card: planned, simulated, executed, and verified kept apart.' },
];

const catalog = { generatedFrom: 'training/*/course.json, training/journeys.json, training/*.md, training/vendor-walkthroughs/*.md', tracks: TRACKS.map(([id, title, description]) => ({ id, title, description })), courses: entries, journeys, operatorModules, vendorWalkthroughs, supporting };
const json = JSON.stringify(catalog, null, 2) + '\n';

const time = (entry) => `${entry.minutes.min}–${entry.minutes.max} min`;
const row = (entry) => `| [${entry.title}](${entry.path}) | ${entry.format === 'bite' ? 'Short module' : 'Course'} | ${entry.audience} | ${entry.lessons.length} | ${time(entry)} | ${entry.reviewedOn} |`;
const table = (rows) => `| Module | Format | For | Lessons | Time | Sources reviewed |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}`;
const journeyBlock = (journey) => {
  const steps = journey.steps.map((slug) => bySlug.get(slug));
  const total = steps.reduce((sum, entry) => [sum[0] + entry.minutes.min, sum[1] + entry.minutes.max], [0, 0]);
  return `### ${journey.title}\n\n${journey.description}\n\n**For:** ${journey.audience} · **Total time:** ${total[0]}–${total[1]} minutes\n\n${steps.map((entry, index) => `${index + 1}. [${entry.title}](${entry.path}) (${time(entry)})`).join('\n')}`;
};
const operatorTable = `| Operator module | Audience | Mode | Sources reviewed |\n| --- | --- | --- | --- |\n${operatorModules.map((m) => `| [${m.title}](${m.path}) | ${m.audience} | ${m.mode} | ${m.reviewedOn} |`).join('\n')}`;
const cardTable = `| Task card | Suggested practice | Mode | Sources reviewed |\n| --- | --- | --- | --- |\n${vendorWalkthroughs.map((c) => `| ${c.number}. [${c.title}](${c.path}) | ${c.practiceMinutes} min | ${c.mode} | ${c.reviewedOn} |`).join('\n')}`;
const md = `<!-- Generated by training/lib/build-catalog.mjs from every course.json, journeys.json, the operator modules, and the vendor task cards. Edit those and regenerate. -->

# Training catalog

${entries.length} modules across three tracks: ${entries.filter((entry) => entry.format === 'bite').length} short modules of one or two lessons, and ${entries.filter((entry) => entry.format !== 'bite').length} courses of three lessons or more. Every module works on paper or in a document, uses a fictional packet, and needs no tool account. Suggested times are starting estimates. For the person who runs the platforms, ${operatorModules.length} longer operator modules and ${vendorWalkthroughs.length} vendor task cards are listed [after the journeys](#operator-modules-and-vendor-task-cards).

Filter by track below, or start from a [learning journey](#learning-journeys). Facilitators: each module has its own facilitator guide and worksheet.

${TRACKS.map(([id, title, description]) => `## ${title}\n\n${description}\n\n${table(entries.filter((entry) => entry.track === id).map(row))}`).join('\n\n')}

## Learning journeys

${journeys.length ? journeys.map(journeyBlock).join('\n\n') : 'No journeys defined yet.'}

## Operator modules and vendor task cards

These are written by hand rather than built from \`course.json\`, so they do not appear in the track tables. An operator module runs as a tabletop by default, with an optional isolated lab, and takes 60 to 120 minutes; the [training index](README.md) gives the learning order, the two modes, and the scoring rubric. A task card pairs official vendor material with a short original exercise and names its parent module. Completing a video is not evidence that a tenant change or recovery worked.

${operatorTable}

${cardTable}

Also in this directory:

${supporting.map((item) => `- [${item.title}](${item.path}): ${item.summary}`).join('\n')}

## How to use this catalog

- **Onboarding:** assign the "everyone" journey in the first month, one module a week.
- **Refreshers:** a short module takes less than fifteen minutes; rotate one a month.
- **After an incident or a near miss:** run the closest module as a session using its facilitator guide, then the relevant tabletop.
- **Operators:** finish the technology operators journey, then take the operator modules for the platforms your firm actually runs, with a task card as the warm-up for each.
- **Records:** keep completion evidence in your own training record, not in this repository. Every module says plainly that its answer keys are authored comparisons, not assessments of the reader.

Maintain: edit a course's \`course.json\`, run its builder, then \`node training/lib/build-catalog.mjs\`. Operator modules and task cards are read from their own header lines. CI checks all of it.
`;

const outputs = new Map([[join(root, 'catalog.json'), json], [join(root, 'CATALOG.md'), md]]);
const stale = [];
for (const [location, expected] of outputs) {
  if (checkOnly) {
    const actual = await readFile(location, 'utf8').catch(() => null);
    if (actual !== expected) stale.push(location);
  } else {
    await writeFile(location, expected, 'utf8');
  }
}
if (stale.length) throw new Error(`Catalog drift: ${stale.map((p) => p.replace(root + '/', '')).join(', ')}. Run build-catalog.mjs.`);
console.log(`Catalog: ${entries.length} modules, ${journeys.length} journeys, ${operatorModules.length} operator modules, ${vendorWalkthroughs.length} task cards ${checkOnly ? 'checked' : 'generated'}.`);
