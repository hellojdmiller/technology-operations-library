import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const folder = path.dirname(fileURLToPath(import.meta.url));
const sites = JSON.parse(fs.readFileSync(path.join(folder, 'sites.json'), 'utf8'));
const categories = [
  'Workplace and business tools',
  'Security and IT operations',
  'Cloud, development and data',
  'AI and automation',
  'Digital and professional foundations',
];
const access = {
  public: 'Public learning',
  'free-account': 'Free learner account',
  'customer-included': 'Included for customers',
};
const textFields = ['id', 'name', 'publisher', 'url', 'category', 'access_model', 'free_scope', 'access_notes', 'starter_task', 'reviewed_on'];
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const isHttps = (value) => { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; };
const ids = new Set();
const urls = new Set();
assert(Array.isArray(sites) && sites.length === 100, 'Directory must contain exactly 100 sites');
for (const site of sites) {
  for (const field of textFields) assert(nonempty(site[field]), `${site.id}: missing ${field}`);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.id), `Invalid id: ${site.id}`);
  assert(!ids.has(site.id), `Duplicate id: ${site.id}`);
  assert(isHttps(site.url), `${site.id}: invalid destination URL`);
  const normalized = new URL(site.url); normalized.hash = ''; normalized.search = '';
  const destination = normalized.href.replace(/\/$/, '');
  assert(!urls.has(destination), `${site.id}: duplicate destination`);
  ids.add(site.id); urls.add(destination);
  assert(categories.includes(site.category), `${site.id}: unknown category`);
  assert(Object.hasOwn(access, site.access_model), `${site.id}: unknown access model`);
  assert(Array.isArray(site.audience) && site.audience.length > 0 && site.audience.every(nonempty), `${site.id}: invalid audience`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(site.reviewed_on) && new Date(site.reviewed_on).toISOString().slice(0, 10) === site.reviewed_on, `${site.id}: invalid review date`);
  assert(Array.isArray(site.evidence) && site.evidence.length > 0, `${site.id}: missing evidence`);
  for (const source of site.evidence) {
    for (const key of ['title', 'url', 'support', 'published_or_updated']) assert(nonempty(source[key]), `${site.id}: missing source ${key}`);
    assert(isHttps(source.url), `${site.id}: invalid source URL`);
  }
}

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, '-');
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(/[|[\]*_`]/g, '\\$&').replace(/\s*\n\s*/g, ' ');
const link = (label, url) => `[${escape(label)}](<${url}>)`;
const ordered = categories.flatMap((category) => sites.filter((site) => site.category === category).sort((a, b) => a.name.localeCompare(b.name, 'en')));
const lines = [
  '# 100 training sites: directory', '',
  'Curated learning destinations for people at work. Numbers are navigation aids, not ranks. Free access applies to the stated scope; product licenses, exams, labs and team reporting can be separate.', '',
  '[Access legend, starter paths and research method](README.md) · [CSV](training-sites.csv) · [JSON](sites.json)', '',
  'Sources were reviewed on the dates shown. Enrollment, playback and learner outcomes were not tested. Starter tasks are original proposals using fictional data.', '',
  '| Category | Sites |', '|---|---:|',
  ...categories.map((category) => `| [${category}](#${slug(category)}) | ${sites.filter((site) => site.category === category).length} |`), '',
];
let number = 0;
for (const category of categories) {
  const selected = ordered.filter((site) => site.category === category);
  lines.push(`## ${category}`, '', '| Site | Audience | Access |', '|---|---|---|');
  for (const site of selected) lines.push(`| [${escape(site.name)}](#${site.id}) | ${escape(site.audience.join(', '))} | ${access[site.access_model]} |`);
  lines.push('');
  for (const site of selected) {
    lines.push(`<a id="${site.id}"></a>`, '', `### ${++number}. ${escape(site.name)}`, '',
      `${link('Open learning site', site.url)} · **${access[site.access_model]}** · ${escape(site.publisher)}`, '',
      `**For:** ${escape(site.audience.join(', '))}.`, '',
      `**Free scope:** ${escape(site.free_scope)}`, '',
      `**Access and limits:** ${escape(site.access_notes)}`, '',
      `**Suggested starter task:** ${escape(site.starter_task)}`, '',
      `**Evidence reviewed ${site.reviewed_on}:**`, '');
    for (const source of site.evidence) lines.push(`- ${link(source.title, source.url)}. Publication/update: ${escape(source.published_or_updated)}. Supports: ${escape(source.support)}`);
    lines.push('', '[Back to category index](#' + slug(category) + ')', '');
  }
}
const columns = [...textFields.slice(0, 5), 'audience', ...textFields.slice(5), 'source_titles', 'source_urls', 'source_dates', 'source_support'];
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const rows = ordered.map((site) => {
  const flat = { ...site, audience: site.audience.join('; '), source_titles: site.evidence.map((s) => s.title).join(' | '), source_urls: site.evidence.map((s) => s.url).join(' | '), source_dates: site.evidence.map((s) => s.published_or_updated).join(' | '), source_support: site.evidence.map((s) => s.support).join(' | ') };
  return columns.map((column) => csv(flat[column])).join(',');
});
const outputs = { 'DIRECTORY.md': lines.join('\n'), 'training-sites.csv': [columns.map(csv).join(','), ...rows].join('\n') + '\n' };
for (const [filename, content] of Object.entries(outputs)) {
  const file = path.join(folder, filename);
  if (process.argv.includes('--check')) assert.equal(fs.readFileSync(file, 'utf8'), content, `${filename} differs from sites.json; run build.mjs`);
  else fs.writeFileSync(file, content);
}
console.log(JSON.stringify({ sites: sites.length, evidence: sites.reduce((n, site) => n + site.evidence.length, 0), access: Object.fromEntries(Object.keys(access).map((key) => [key, sites.filter((site) => site.access_model === key).length])), mode: process.argv.includes('--check') ? 'checked' : 'generated' }));
