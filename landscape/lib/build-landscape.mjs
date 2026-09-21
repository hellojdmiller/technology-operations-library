#!/usr/bin/env node
// landscape.json is the canonical graph. This script validates it and generates the Obsidian vault.
//   node landscape/lib/build-landscape.mjs          # validate and regenerate landscape/vault
//   node landscape/lib/build-landscape.mjs --check  # validate and fail if the vault differs from the JSON
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const root = join(directory, '..');
const vault = join(root, 'vault');
const argumentsList = process.argv.slice(2);
if (argumentsList.some((value) => value !== '--check') || argumentsList.length > 1) throw new Error('Usage: node landscape/lib/build-landscape.mjs [--check]');
const checkOnly = argumentsList.includes('--check');
const raw = await readFile(join(root, 'landscape.json'), 'utf8');
const landscape = JSON.parse(raw);

// ---------- validation ----------
const EM_DASH = String.fromCharCode(8212);
function requireCondition(condition, message) { if (!condition) throw new Error(message); }
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const SEGMENTS = ['enterprise', 'smb', 'personal'];
const KINDS = ['product', 'company', 'open-source-project'];
const BUSINESS = ['public-company', 'private-company', 'subsidiary', 'open-source', 'nonprofit'];
const RELATIONS = ['integrates-with', 'alternative-to', 'built-on', 'part-of', 'acquired-by', 'complements', 'secured-by'];
const shape = (value, keys, label) => {
  requireCondition(value && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
  requireCondition(Object.keys(value).join('|') === keys.join('|'), `${label}: keys must be exactly ${keys.join(', ')} in that order (got ${Object.keys(value).join(', ')})`);
};
const text = (value, label) => requireCondition(typeof value === 'string' && value.trim().length > 0, `${label}: expected nonempty text`);
const https = (value, label) => { text(value, label); let url; try { url = new URL(value); } catch { throw new Error(`${label}: invalid URL ${value}`); } requireCondition(url.protocol === 'https:', `${label}: expected HTTPS (${value})`); };
const unique = (values, label) => requireCondition(new Set(values).size === values.length, `${label}: duplicate value`);
const subset = (values, allowed, label) => { requireCondition(Array.isArray(values) && values.length > 0, `${label}: expected nonempty array`); for (const v of values) requireCondition(allowed.includes(v), `${label}: unknown value ${v}`); unique(values, label); };

shape(landscape, ['version', 'generatedOn', 'license', 'layers', 'categories', 'vendors', 'relations'], 'landscape');
requireCondition(landscape.version === '1.0.0', 'Unexpected version');
requireCondition(/^\d{4}-\d{2}-\d{2}$/u.test(landscape.generatedOn) && new Date(`${landscape.generatedOn}T00:00:00Z`).toISOString().startsWith(landscape.generatedOn), 'generatedOn: expected ISO date');
text(landscape.license, 'license');
requireCondition(!raw.includes(EM_DASH), 'landscape.json must not contain em dashes');
for (const layer of landscape.layers) { shape(layer, ['id', 'name'], 'layer'); requireCondition(KEBAB.test(layer.id), `layer id ${layer.id}`); text(layer.name, `layer ${layer.id} name`); }
unique(landscape.layers.map((l) => l.id), 'layer ids');
const layerIds = new Set(landscape.layers.map((l) => l.id));
for (const category of landscape.categories) {
  shape(category, ['id', 'name', 'layer', 'summary', 'segments'], `category ${category.id}`);
  requireCondition(KEBAB.test(category.id), `category id ${category.id}`);
  text(category.name, `category ${category.id} name`); text(category.summary, `category ${category.id} summary`);
  requireCondition(layerIds.has(category.layer), `category ${category.id}: unknown layer ${category.layer}`);
  subset(category.segments, SEGMENTS, `category ${category.id} segments`);
}
unique(landscape.categories.map((c) => c.id), 'category ids');
const categoryIds = new Set(landscape.categories.map((c) => c.id));
const VENDOR_KEYS = ['id', 'name', 'kind', 'wikidata', 'website', 'summary', 'categories', 'segments', 'sectors', 'businessType', 'hqCountry', 'founded', 'openSource', 'sources'];
for (const vendor of landscape.vendors) {
  const label = `vendor ${vendor.id}`;
  shape(vendor, VENDOR_KEYS, label);
  requireCondition(KEBAB.test(vendor.id), `${label}: id must be kebab-case`);
  text(vendor.name, `${label} name`); text(vendor.summary, `${label} summary`);
  requireCondition(KINDS.includes(vendor.kind), `${label}: unknown kind ${vendor.kind}`);
  requireCondition(vendor.wikidata === null || /^Q\d+$/u.test(vendor.wikidata), `${label}: wikidata must be a QID or null`);
  if (vendor.website !== null) https(vendor.website, `${label} website`);
  subset(vendor.categories, [...categoryIds], `${label} categories`);
  subset(vendor.segments, SEGMENTS, `${label} segments`);
  requireCondition(Array.isArray(vendor.sectors) && vendor.sectors.length > 0 && vendor.sectors.every((s) => KEBAB.test(s)), `${label}: sectors must be nonempty kebab-case`);
  requireCondition(vendor.businessType === null || BUSINESS.includes(vendor.businessType), `${label}: unknown businessType ${vendor.businessType}`);
  requireCondition(vendor.hqCountry === null || /^[A-Z]{2}$/u.test(vendor.hqCountry), `${label}: hqCountry must be ISO 3166-1 alpha-2 or null`);
  requireCondition(vendor.founded === null || (Number.isInteger(vendor.founded) && vendor.founded >= 1800 && vendor.founded <= Number(landscape.generatedOn.slice(0, 4))), `${label}: founded out of range`);
  requireCondition(typeof vendor.openSource === 'boolean', `${label}: openSource must be boolean`);
  if (vendor.kind === 'open-source-project') requireCondition(vendor.openSource && vendor.businessType === 'open-source', `${label}: open-source projects must have openSource true and businessType open-source`);
  requireCondition(Array.isArray(vendor.sources) && vendor.sources.length > 0, `${label}: at least one source`);
  vendor.sources.forEach((s, i) => https(s, `${label} sources[${i}]`));
  unique(vendor.sources, `${label} sources`);
}
unique(landscape.vendors.map((v) => v.id), 'vendor ids');
const vendorById = new Map(landscape.vendors.map((v) => [v.id, v]));
for (const [index, relation] of landscape.relations.entries()) {
  const label = `relation ${index} (${relation.from} ${relation.type} ${relation.to})`;
  shape(relation, ['from', 'to', 'type', 'source'], label);
  requireCondition(vendorById.has(relation.from), `${label}: unknown from`);
  requireCondition(vendorById.has(relation.to), `${label}: unknown to`);
  requireCondition(relation.from !== relation.to, `${label}: self reference`);
  requireCondition(RELATIONS.includes(relation.type), `${label}: unknown type`);
  https(relation.source, `${label} source`);
}
unique(landscape.relations.map((r) => `${r.from}|${r.to}|${r.type}`), 'relations');
const sortedIds = (list) => list.map((x) => x.id).every((id, i, arr) => i === 0 || arr[i - 1].localeCompare(id) < 0);
requireCondition(sortedIds(landscape.vendors), 'vendors must be sorted by id');
for (const category of landscape.categories) requireCondition(landscape.vendors.some((v) => v.categories.includes(category.id)), `category ${category.id} has no vendors`);

// ---------- vault generation ----------
const noteName = (name) => name.replace(/[\\/:*?"<>|#^[\]]/gu, ' ').replace(/\s+/gu, ' ').trim();
const link = (name) => `[[${noteName(name)}]]`;
const byName = (a, b) => a.name.localeCompare(b.name, 'en');
const yaml = (value) => Array.isArray(value) ? `[${value.map(yaml).join(', ')}]` : value === null ? 'null' : typeof value === 'string' ? JSON.stringify(value) : String(value);
const frontmatter = (fields) => `---\n${Object.entries(fields).map(([k, v]) => `${k}: ${yaml(v)}`).join('\n')}\n---\n`;
const generated = `Generated from landscape.json by lib/build-landscape.mjs on ${landscape.generatedOn}. Edit the JSON and rebuild.`;
const segmentName = { enterprise: 'Enterprise', smb: 'SMB', personal: 'Personal' };
const sectorName = (id) => id.split('-').map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
const typeLabel = { 'integrates-with': 'Integrates with', 'alternative-to': 'Alternative to', 'built-on': 'Built on', 'part-of': 'Part of', 'acquired-by': 'Acquired by', complements: 'Complements', 'secured-by': 'Secured by' };
const inverseLabel = { 'integrates-with': 'Integrated by', 'alternative-to': 'Alternatives', 'built-on': 'Foundation for', 'part-of': 'Includes', 'acquired-by': 'Acquired', complements: 'Complemented by', 'secured-by': 'Secures' };
const layerById = new Map(landscape.layers.map((l) => [l.id, l]));
const categoryById = new Map(landscape.categories.map((c) => [c.id, c]));
const outgoing = new Map(landscape.vendors.map((v) => [v.id, []]));
const incoming = new Map(landscape.vendors.map((v) => [v.id, []]));
for (const r of landscape.relations) { outgoing.get(r.from).push(r); incoming.get(r.to).push(r); }
const degree = (id) => outgoing.get(id).length + incoming.get(id).length;
const vendorsIn = (categoryId) => landscape.vendors.filter((v) => v.categories.includes(categoryId)).sort(byName);
const sectors = [...new Set(landscape.vendors.flatMap((v) => v.sectors))].sort();
const notes = new Map();
const names = new Map();
const register = (name, kind) => { const n = noteName(name); requireCondition(!names.has(n), `Note name clash: "${n}" used by ${names.get(n)} and ${kind}`); names.set(n, kind); return n; };
for (const l of landscape.layers) register(l.name, `layer ${l.id}`);
for (const c of landscape.categories) register(c.name, `category ${c.id}`);
for (const v of landscape.vendors) register(v.name, `vendor ${v.id}`);
for (const s of SEGMENTS) register(segmentName[s], `segment ${s}`);
for (const s of sectors) register(sectorName(s), `sector ${s}`);
const escapeText = (s) => s.replace(/\[\[/gu, '[ [');

for (const vendor of landscape.vendors) {
  const cats = vendor.categories.map((id) => categoryById.get(id));
  const tags = [...cats.map((c) => `${c.layer}/${c.id}`), ...vendor.segments.map((s) => `segment/${s}`), ...vendor.sectors.map((s) => `sector/${s}`), vendor.kind, ...(vendor.openSource ? ['open-source'] : [])];
  const lines = [frontmatter({ id: vendor.id, name: vendor.name, kind: vendor.kind, wikidata: vendor.wikidata, website: vendor.website, businessType: vendor.businessType, hqCountry: vendor.hqCountry, founded: vendor.founded, openSource: vendor.openSource, categories: vendor.categories, segments: vendor.segments, sectors: vendor.sectors, degree: degree(vendor.id), tags })];
  lines.push(`# ${noteName(vendor.name)}`, '', escapeText(vendor.summary), '');
  const facts = [];
  if (vendor.website) facts.push(`Website: <${vendor.website}>`);
  if (vendor.wikidata) facts.push(`Wikidata: [${vendor.wikidata}](https://www.wikidata.org/wiki/${vendor.wikidata})`);
  facts.push(`Kind: ${vendor.kind}`);
  if (vendor.businessType) facts.push(`Business type: ${vendor.businessType}`);
  if (vendor.hqCountry) facts.push(`Headquarters country: ${vendor.hqCountry}`);
  if (vendor.founded) facts.push(`Founded or first released: ${vendor.founded}`);
  facts.push(`Open source: ${vendor.openSource ? 'yes' : 'no'}`);
  lines.push(facts.map((f) => `- ${f}`).join('\n'), '', '## Categories', '');
  for (const c of cats) lines.push(`- ${link(c.name)} (${link(layerById.get(c.layer).name)})`);
  lines.push('', `Segments: ${vendor.segments.map((s) => link(segmentName[s])).join(', ')}. Sectors: ${vendor.sectors.map((s) => link(sectorName(s))).join(', ')}.`, '');
  lines.push('## Relations', '');
  const out = outgoing.get(vendor.id), inn = incoming.get(vendor.id);
  if (!out.length && !inn.length) lines.push('No sourced relations yet.', '');
  for (const type of RELATIONS) {
    const rows = out.filter((r) => r.type === type).sort((a, b) => byName(vendorById.get(a.to), vendorById.get(b.to)));
    if (rows.length) lines.push(`### ${typeLabel[type]}`, '', ...rows.map((r) => `- ${link(vendorById.get(r.to).name)} ([source](${r.source}))`), '');
  }
  for (const type of RELATIONS) {
    const rows = inn.filter((r) => r.type === type).sort((a, b) => byName(vendorById.get(a.from), vendorById.get(b.from)));
    if (rows.length) lines.push(`### ${inverseLabel[type]}`, '', ...rows.map((r) => `- ${link(vendorById.get(r.from).name)} ([source](${r.source}))`), '');
  }
  lines.push('## Sources', '', ...vendor.sources.map((s) => `- <${s}>`), '', `_${generated}_`, '');
  notes.set(`Vendors/${noteName(vendor.name)}.md`, lines.join('\n'));
}
for (const category of landscape.categories) {
  const vendors = vendorsIn(category.id);
  const layer = layerById.get(category.layer);
  const lines = [frontmatter({ id: category.id, name: category.name, layer: category.layer, segments: category.segments, vendorCount: vendors.length, openSourceCount: vendors.filter((v) => v.openSource).length, tags: [`layer/${category.layer}`, 'category'] })];
  lines.push(`# ${noteName(category.name)}`, '', escapeText(category.summary), '', `Layer: ${link(layer.name)}. Segments: ${category.segments.map((s) => link(segmentName[s])).join(', ')}. Vendors: ${vendors.length}.`, '');
  for (const segment of SEGMENTS) {
    const rows = vendors.filter((v) => v.segments.includes(segment));
    if (!rows.length) continue;
    lines.push(`## ${segmentName[segment]} (${rows.length})`, '', ...rows.map((v) => `- ${link(v.name)}${v.openSource ? ' (open source)' : ''}: ${escapeText(v.summary)}`), '');
  }
  const oss = vendors.filter((v) => v.openSource);
  lines.push('## Open-source options', '', ...(oss.length ? oss.map((v) => `- ${link(v.name)}`) : ['None recorded in this category yet.']), '', `_${generated}_`, '');
  notes.set(`Categories/${noteName(category.name)}.md`, lines.join('\n'));
}
for (const layer of landscape.layers) {
  const cats = landscape.categories.filter((c) => c.layer === layer.id).sort(byName);
  const ids = new Set(cats.map((c) => c.id));
  const count = landscape.vendors.filter((v) => v.categories.some((c) => ids.has(c))).length;
  const lines = [frontmatter({ id: layer.id, name: layer.name, categoryCount: cats.length, vendorCount: count, tags: ['layer'] }), `# ${noteName(layer.name)}`, '', `${cats.length} categories and ${count} vendors.`, '', '## Categories', '', ...cats.map((c) => `- ${link(c.name)} (${vendorsIn(c.id).length}): ${escapeText(c.summary)}`), '', `_${generated}_`, ''];
  notes.set(`Layers/${noteName(layer.name)}.md`, lines.join('\n'));
}
for (const segment of SEGMENTS) {
  const lines = [frontmatter({ id: segment, name: segmentName[segment], tags: ['segment'] }), `# ${segmentName[segment]}`, '', `Vendors that serve the ${segmentName[segment]} segment, grouped by category.`, ''];
  for (const layer of landscape.layers) {
    for (const c of landscape.categories.filter((x) => x.layer === layer.id).sort(byName)) {
      const rows = vendorsIn(c.id).filter((v) => v.segments.includes(segment));
      if (rows.length) lines.push(`## ${link(c.name)} (${rows.length})`, '', rows.map((v) => link(v.name)).join(', '), '');
    }
  }
  lines.push(`_${generated}_`, '');
  notes.set(`Segments/${segmentName[segment]}.md`, lines.join('\n'));
}
for (const sector of sectors) {
  const rows = landscape.vendors.filter((v) => v.sectors.includes(sector)).sort(byName);
  const lines = [frontmatter({ id: sector, name: sectorName(sector), vendorCount: rows.length, tags: ['sector'] }), `# ${sectorName(sector)}`, '', `${rows.length} vendors tagged with the ${sectorName(sector)} sector.`, '', ...rows.map((v) => `- ${link(v.name)}: ${v.categories.map((id) => link(categoryById.get(id).name)).join(', ')}`), '', `_${generated}_`, ''];
  notes.set(`Sectors/${noteName(sectorName(sector))}.md`, lines.join('\n'));
}
const withQid = landscape.vendors.filter((v) => v.wikidata).length;
const density = landscape.categories.map((c) => ({ c, n: vendorsIn(c.id).length })).sort((a, b) => b.n - a.n || byName(a.c, b.c));
const hubs = [...landscape.vendors].sort((a, b) => degree(b.id) - degree(a.id) || byName(a, b)).slice(0, 25);
notes.set('README.md', [
  '# Technology landscape vault', '',
  `An Obsidian vault generated from [landscape.json](../landscape.json): ${landscape.layers.length} layers, ${landscape.categories.length} categories, ${landscape.vendors.length} vendors, and ${landscape.relations.length} typed relations. ${withQid} vendors carry a Wikidata item. Every vendor note lists the sources behind it.`, '',
  '## Open it', '',
  '1. Install [Obsidian](https://obsidian.md) and choose **Open folder as vault**.', `2. Select this \`vault\` folder (the one containing this README).`, '3. Open the graph view (Ctrl/Cmd+G). Vendors, categories, layers, segments, and sectors are separate notes, so category hubs show the shape of the stack and vendor-to-vendor edges show integrations and alternatives.', '',
  '## Graph view tips', '',
  '- **Filter by layer**: type `tag:#identity-and-devices` (any layer id) in the graph filter to isolate one part of the stack, or `path:Vendors` to hide index notes.', '- **Find crowded categories**: sort by the `vendorCount` property on category notes (see the table below), or open a category note and read the per-segment lists.', '- **Find hubs**: vendor notes carry a `degree` property (inbound plus outbound sourced relations). High-degree vendors sit at the center of the graph.', '- **Color groups**: in graph settings add groups such as `tag:#open-source`, `tag:#segment/personal`, or `path:Categories` to color nodes by role.', '- **Local graph**: open a vendor note and use the local graph with depth 2 to see its neighbourhood of integrations and alternatives.', '',
  '## Categories by vendor count', '', '| Category | Layer | Vendors | Open source |', '|---|---|---:|---:|',
  ...density.map(({ c, n }) => `| ${link(c.name)} | ${link(layerById.get(c.layer).name)} | ${n} | ${vendorsIn(c.id).filter((v) => v.openSource).length} |`), '',
  '## Most connected vendors', '', ...hubs.map((v) => `- ${link(v.name)} (${degree(v.id)})`), '',
  '## Folders', '', '- `Layers/`: one note per layer with its categories.', '- `Categories/`: one note per category with vendors grouped by segment and the open-source options.', '- `Vendors/`: one note per vendor with frontmatter fields, categories, relations by type, and sources.', '- `Segments/`: Enterprise, SMB, and Personal index notes.', '- `Sectors/`: index notes for sector tags.', '',
  `_${generated}_`, '',
].join('\n'));
const palette = [0xc0392b, 0x2980b9, 0x27ae60, 0x8e44ad, 0xd35400, 0x16a085, 0x7f8c8d, 0xf39c12, 0x2c3e50];
notes.set('.obsidian/graph.json', JSON.stringify({ 'collapse-filter': false, search: '', showTags: false, showAttachments: false, hideUnresolved: true, showOrphans: true, 'collapse-color-groups': false, colorGroups: [...landscape.layers.map((l, i) => ({ query: `tag:#${l.id}`, color: { a: 1, rgb: palette[i % palette.length] } })), { query: 'path:Categories', color: { a: 1, rgb: 0x111111 } }], 'collapse-display': true, showArrow: true, textFadeMultiplier: 0, nodeSizeMultiplier: 1, lineSizeMultiplier: 1, 'collapse-forces': true, centerStrength: 0.5, repelStrength: 10, linkStrength: 1, linkDistance: 250, scale: 1, close: true }, null, 2) + '\n');
for (const [, content] of notes) requireCondition(!content.includes(EM_DASH), 'Generated notes must not contain em dashes');

// ---------- write or check ----------
async function listFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error) => { if (error.code === 'ENOENT') return []; throw error; });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(full, base)); else files.push(relative(base, full));
  }
  return files;
}
const existing = new Set(await listFiles(vault));
const stale = [];
for (const [name, expected] of notes) {
  const location = join(vault, name);
  if (checkOnly) {
    const actual = await readFile(location, 'utf8').catch((error) => { if (error.code === 'ENOENT') return null; throw error; });
    if (actual !== expected) stale.push(name);
  } else {
    await mkdir(dirname(location), { recursive: true });
    await writeFile(location, expected, 'utf8');
  }
}
const extra = [...existing].filter((f) => !notes.has(f) && !f.startsWith('.obsidian/'));
if (checkOnly) requireCondition(stale.length === 0 && extra.length === 0, `Vault differs from landscape.json. Stale or missing: ${stale.slice(0, 10).join(', ')}${stale.length > 10 ? ` and ${stale.length - 10} more` : ''}. Unexpected files: ${extra.slice(0, 10).join(', ')}. Run build-landscape.mjs without --check.`);
else for (const f of extra) await rm(join(vault, f));
console.log(`Landscape ${checkOnly ? 'checked' : 'built'}: ${landscape.layers.length} layers, ${landscape.categories.length} categories, ${landscape.vendors.length} vendors (${withQid} with Wikidata), ${landscape.relations.length} relations, ${notes.size} vault files.`);
console.log('This checks structure, referential integrity, and export consistency, not the accuracy of any vendor fact.');
