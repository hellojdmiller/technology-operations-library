#!/usr/bin/env node
// Matches vendors against the CNCF landscape and the LF AI and Data landscape (both Apache-2.0 data
// on GitHub) by website host and item name, skipping member listings. A match adds the landscape file as a source, records the landscape
// category and subcategory in lib/cache/landscapes.json, and sets openSource to true when the
// landscape lists the item as a foundation project.
//
//   node landscape/lib/fetch-landscapes.mjs            # fetch both files, update landscape.json
//   node landscape/lib/fetch-landscapes.mjs --dry-run  # report matches without writing
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const landscapePath = join(directory, '..', 'landscape.json');
const cachePath = join(directory, 'cache', 'landscapes.json');
const dryRun = process.argv.includes('--dry-run');
const SOURCES = {
  cncf: 'https://github.com/cncf/landscape/blob/master/landscape.yml',
  lfai: 'https://github.com/lfai/lfai-landscape/blob/main/landscape.yml',
};
const RAW = {
  cncf: 'https://raw.githubusercontent.com/cncf/landscape/master/landscape.yml',
  lfai: 'https://raw.githubusercontent.com/lfai/lfai-landscape/main/landscape.yml',
};
const USER_AGENT = 'TechnologyOperationsLibrary-landscape/1.0 (https://github.com/hellojdmiller/technology-operations-library)';

// The landscape files use one regular shape, so a small line parser is enough.
function parseLandscape(text) {
  const items = [];
  let category = null, subcategory = null, item = null;
  for (const line of text.split('\n')) {
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();
    if (indent === 2 && trimmed.startsWith('- category:')) { category = null; continue; }
    if (indent === 4 && trimmed.startsWith('name:') && category === null) { category = trimmed.slice(5).trim().replace(/^['"]|['"]$/gu, ''); continue; }
    if (indent === 6 && trimmed.startsWith('- subcategory:')) { subcategory = null; continue; }
    if (indent === 8 && trimmed.startsWith('name:') && subcategory === null) { subcategory = trimmed.slice(5).trim().replace(/^['"]|['"]$/gu, ''); continue; }
    if (indent === 10 && trimmed.startsWith('- item:')) { item = { category, subcategory }; items.push(item); continue; }
    if (indent === 12 && item) {
      const [key, ...rest] = trimmed.split(':');
      const value = rest.join(':').trim().replace(/^['"]|['"]$/gu, '');
      if (['name', 'homepage_url', 'repo_url', 'project'].includes(key)) item[key] = value;
    }
  }
  return items.filter((i) => i.name && i.homepage_url);
}
const norm = (name) => name.toLowerCase().replace(/\(.*?\)/gu, '').replace(/[^a-z0-9]/gu, '');
const host = (url) => { try { return new URL(url).hostname.replace(/^www\./u, '').toLowerCase(); } catch { return null; } };

const landscape = JSON.parse(await readFile(landscapePath, 'utf8'));
const matches = {};
for (const [key, url] of Object.entries(RAW)) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  const items = parseLandscape(await response.text());
  const byHost = new Map();
  for (const item of items) { const h = host(item.homepage_url); if (h && !/member/iu.test(item.category)) (byHost.get(h) ?? byHost.set(h, []).get(h)).push(item); }
  for (const vendor of landscape.vendors) {
    const candidates = (vendor.website && byHost.get(host(vendor.website))) ?? [];
    const target = norm(vendor.name);
    const hit = candidates.find((c) => norm(c.name) === target) ?? candidates.find((c) => target.length >= 5 && norm(c.name).includes(target));
    if (!hit) continue;
    (matches[vendor.id] ??= []).push({ landscape: key, name: hit.name, category: hit.category, subcategory: hit.subcategory, project: hit.project ?? null, repo: hit.repo_url ?? null });
    if (!vendor.sources.includes(SOURCES[key])) vendor.sources.push(SOURCES[key]);
    if (hit.project && !vendor.openSource) vendor.openSource = true;
  }
  console.log(`${key}: ${items.length} items, ${Object.values(matches).filter((m) => m.some((x) => x.landscape === key)).length} vendors matched`);
}
if (!dryRun) {
  await mkdir(dirname(cachePath), { recursive: true });
  await writeFile(cachePath, JSON.stringify({ fetchedOn: new Date().toISOString().slice(0, 10), sources: SOURCES, matches }, null, 1) + '\n');
  await writeFile(landscapePath, JSON.stringify(landscape, null, 2) + '\n');
}
for (const [id, hits] of Object.entries(matches)) console.log(`  ${id}: ${hits.map((h) => `${h.landscape} ${h.category} / ${h.subcategory}${h.project ? ` (${h.project})` : ''}`).join('; ')}`);
