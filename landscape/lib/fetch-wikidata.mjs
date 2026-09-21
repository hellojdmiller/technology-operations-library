#!/usr/bin/env node
// Refreshes Wikidata-derived vendor facts in landscape.json.
//
//   node landscape/lib/fetch-wikidata.mjs            # use lib/cache/wikidata.json, fetch only what is missing
//   node landscape/lib/fetch-wikidata.mjs --refresh  # ignore the cache and query Wikidata again
//   node landscape/lib/fetch-wikidata.mjs --offline  # never touch the network; fail if the cache lacks an entity
//
// For every vendor it resolves a Wikidata item (an explicit `wikidata` QID wins; otherwise a
// wbsearchentities lookup whose official website host matches the vendor website, or whose label
// matches exactly, whose website shares the vendor's registrable domain, and whose class is a
// business or software class), then reads official website
// (P856), inception (P571) or publication date (P577), country (P17) or headquarters (P159),
// instance of (P31), legal form (P1454), stock exchange (P414), parent organization (P749),
// developer (P178), manufacturer (P176), and owned by (P127) with start-time qualifiers.
// It writes wikidata, website (only when null), hqCountry, founded, and businessType, adds the
// entity URL to sources, and adds part-of / acquired-by relations between vendors in the graph.
// Fields Wikidata does not have stay null. Nothing else in the file is touched.
//
// Wikidata content is CC0. Requests carry a descriptive User-Agent and run one at a time.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const landscapePath = join(directory, '..', 'landscape.json');
const cachePath = join(directory, 'cache', 'wikidata.json');
const flags = new Set(process.argv.slice(2));
for (const flag of flags) if (!['--refresh', '--offline'].includes(flag)) throw new Error('Usage: fetch-wikidata.mjs [--refresh] [--offline]');
const USER_AGENT = 'TechnologyOperationsLibrary-landscape/1.0 (https://github.com/hellojdmiller/technology-operations-library; Node.js fetch)';
const SPARQL = 'https://query.wikidata.org/sparql';
const API = 'https://www.wikidata.org/w/api.php';
const WD = 'http://www.wikidata.org/entity/';
const BUSINESS_CLASSES = new Set(['Q4830453', 'Q891723', 'Q6881511', 'Q783794', 'Q1058914', 'Q18388277', 'Q1589009', 'Q163740', 'Q157031', 'Q708676', 'Q7397', 'Q1668024', 'Q1371849', 'Q35127', 'Q341', 'Q506883', 'Q1130645', 'Q1254596', 'Q9135', 'Q2088273', 'Q1639024', 'Q21127166', 'Q19541']);
const NONPROFIT = new Set(['Q163740', 'Q157031', 'Q708676', 'Q79913', 'Q4686302', 'Q1092755']);

const landscape = JSON.parse(await readFile(landscapePath, 'utf8'));
let cache = { searches: {}, entities: {}, countries: {}, locations: {} };
if (!flags.has('--refresh')) cache = await readFile(cachePath, 'utf8').then(JSON.parse).catch(() => cache);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function request(url, accept) {
  if (flags.has('--offline')) throw new Error(`offline mode, cannot fetch ${url}`);
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: accept } });
    if (response.ok) { await sleep(200); return response.json(); }
    if (response.status === 429 || response.status >= 500) { await sleep(2000 * attempt); continue; }
    throw new Error(`${response.status} for ${url}`);
  }
  throw new Error(`gave up on ${url}`);
}
const sparql = (query) => request(`${SPARQL}?query=${encodeURIComponent(query)}`, 'application/sparql-results+json');
const qid = (uri) => uri.replace(WD, '');
const domain = (url) => { const h = host(url); return h ? h.split('.').slice(-2).join('.') : null; };
const host = (url) => { try { return new URL(url).hostname.replace(/^www\./u, '').toLowerCase(); } catch { return null; } };

async function search(name) {
  if (!cache.searches[name]) {
    const data = await request(`${API}?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=7&format=json`, 'application/json');
    cache.searches[name] = data.search.map((hit) => ({ id: hit.id, label: (hit.label ?? '').replace(/\u2014/gu, '-') }));
  }
  return cache.searches[name];
}

async function loadEntities(ids) {
  const missing = [...new Set(ids)].filter((id) => !cache.entities[id]);
  for (let index = 0; index < missing.length; index += 40) {
    const batch = missing.slice(index, index + 40);
    const values = batch.map((id) => `wd:${id}`).join(' ');
    const facts = await sparql(`SELECT ?item ?prop ?value WHERE { VALUES ?item { ${values} } VALUES ?prop { wdt:P856 wdt:P571 wdt:P577 wdt:P17 wdt:P159 wdt:P31 wdt:P1454 wdt:P414 wdt:P749 wdt:P178 wdt:P176 } ?item ?prop ?value . }`);
    const owners = await sparql(`SELECT ?item ?owner ?start WHERE { VALUES ?item { ${values} } ?item p:P127 ?statement . ?statement ps:P127 ?owner . OPTIONAL { ?statement pq:P580 ?start } }`);
    for (const id of batch) cache.entities[id] = { P856: [], P571: [], P577: [], P17: [], P159: [], P31: [], P1454: [], P414: [], P749: [], P178: [], P176: [], P127: [] };
    for (const row of facts.results.bindings) {
      const entity = cache.entities[qid(row.item.value)];
      const prop = row.prop.value.split('/').pop();
      const value = row.value.type === 'uri' && row.value.value.startsWith(WD) ? qid(row.value.value) : row.value.value;
      if (!entity[prop].includes(value)) entity[prop].push(value);
    }
    for (const row of owners.results.bindings) {
      cache.entities[qid(row.item.value)].P127.push({ owner: qid(row.owner.value), start: row.start?.value ?? null });
    }
  }
}

async function loadCountries(entityIds) {
  const locations = [...new Set(entityIds.flatMap((id) => cache.entities[id].P159))].filter((id) => !cache.locations[id]);
  for (let index = 0; index < locations.length; index += 60) {
    const batch = locations.slice(index, index + 60);
    const rows = await sparql(`SELECT ?item ?country WHERE { VALUES ?item { ${batch.map((id) => `wd:${id}`).join(' ')} } ?item wdt:P17 ?country . }`);
    for (const id of batch) cache.locations[id] = null;
    for (const row of rows.results.bindings) cache.locations[qid(row.item.value)] ??= qid(row.country.value);
  }
  const countries = [...new Set(entityIds.flatMap((id) => [...cache.entities[id].P17, ...cache.entities[id].P159.map((loc) => cache.locations[loc])]))].filter((id) => id && !cache.countries[id]);
  for (let index = 0; index < countries.length; index += 60) {
    const batch = countries.slice(index, index + 60);
    const rows = await sparql(`SELECT ?item ?iso WHERE { VALUES ?item { ${batch.map((id) => `wd:${id}`).join(' ')} } ?item wdt:P297 ?iso . }`);
    for (const id of batch) cache.countries[id] = null;
    for (const row of rows.results.bindings) cache.countries[qid(row.item.value)] ??= row.iso.value;
  }
}

// 1. Resolve a QID for every vendor.
const resolved = new Map();
const review = [];
const searched = new Map();
for (const vendor of landscape.vendors) if (!vendor.wikidata) searched.set(vendor.id, await search(vendor.name));
await mkdir(dirname(cachePath), { recursive: true });
await writeFile(cachePath, JSON.stringify(cache) + '\n');
await loadEntities([...searched.values()].flat().map((c) => c.id));
await writeFile(cachePath, JSON.stringify(cache) + '\n');
for (const vendor of landscape.vendors) {
  if (vendor.wikidata) { resolved.set(vendor.id, { id: vendor.wikidata, by: 'explicit' }); continue; }
  const candidates = searched.get(vendor.id);
  const vendorHost = host(vendor.website);
  const byHost = candidates.find((c) => cache.entities[c.id].P856.some((site) => host(site) === vendorHost));
  if (byHost) { resolved.set(vendor.id, { id: byHost.id, by: 'website' }); continue; }
  const byLabel = candidates.find((c) => c.label.toLowerCase() === vendor.name.toLowerCase() && cache.entities[c.id].P856.some((site) => domain(site) && domain(site) === domain(vendor.website)) && [...cache.entities[c.id].P31, ...cache.entities[c.id].P1454].some((cls) => BUSINESS_CLASSES.has(cls)));
  if (byLabel) { resolved.set(vendor.id, { id: byLabel.id, by: 'label' }); review.push(`${vendor.id} -> ${byLabel.id} (${byLabel.label})`); }
}
await loadEntities([...resolved.values()].map((r) => r.id));
// Developers and parents of resolved items, for product business types and relations.
const related = [...resolved.values()].flatMap((r) => { const e = cache.entities[r.id]; return [...e.P749, ...e.P178, ...e.P176, ...e.P127.map((o) => o.owner)]; });
await loadEntities(related);
await loadCountries([...new Set([...[...resolved.values()].map((r) => r.id), ...related])]);
await mkdir(dirname(cachePath), { recursive: true });
await writeFile(cachePath, JSON.stringify(cache) + '\n');

// 2. Derive fields.
function businessType(id) {
  const entity = cache.entities[id];
  if (!entity) return null;
  const classes = [...entity.P31, ...entity.P1454];
  if (classes.some((cls) => NONPROFIT.has(cls))) return 'nonprofit';
  if (entity.P749.length) return 'subsidiary';
  if (entity.P414.length || classes.includes('Q891723')) return 'public-company';
  if (classes.some((cls) => BUSINESS_CLASSES.has(cls) && cls !== 'Q7397' && cls !== 'Q341' && cls !== 'Q506883')) return 'private-company';
  return null;
}
function country(id) {
  const entity = cache.entities[id];
  if (!entity) return null;
  for (const c of entity.P17) if (cache.countries[c]) return cache.countries[c];
  for (const loc of entity.P159) { const c = cache.locations[loc]; if (c && cache.countries[c]) return cache.countries[c]; }
  return null;
}
const year = (values) => { const years = values.map((v) => Number(v.slice(0, 4))).filter((y) => y > 1800); return years.length ? Math.min(...years) : null; };
const byQid = new Map();
for (const [vendorId, r] of resolved) byQid.set(r.id, vendorId);
const added = [];
let withQid = 0;
for (const vendor of landscape.vendors) {
  const r = resolved.get(vendor.id);
  if (!r) { vendor.wikidata = null; continue; }
  withQid += 1;
  const entity = cache.entities[r.id];
  const entityUrl = `https://www.wikidata.org/wiki/${r.id}`;
  vendor.wikidata = r.id;
  if (!vendor.website && entity.P856[0]) vendor.website = entity.P856[0];
  const maker = vendor.kind === 'product' ? [...entity.P178, ...entity.P176][0] : null;
  vendor.hqCountry = country(r.id) ?? (maker ? country(maker) : null);
  vendor.founded = year([...entity.P571, ...entity.P577]);
  if (vendor.kind === 'open-source-project') vendor.businessType = 'open-source';
  else vendor.businessType = businessType(r.id) ?? (maker ? businessType(maker) : null);
  if (!vendor.sources.includes(entityUrl)) vendor.sources.push(entityUrl);
  const link = (target, type) => {
    const to = byQid.get(target);
    if (!to || to === vendor.id) return;
    if (landscape.relations.some((rel) => rel.from === vendor.id && rel.to === to && rel.type === type)) return;
    landscape.relations.push({ from: vendor.id, to, type, source: entityUrl });
    added.push(`${vendor.id} ${type} ${to}`);
  };
  for (const parent of [...entity.P749, ...entity.P178, ...entity.P176]) link(parent, 'part-of');
  for (const owner of entity.P127) link(owner.owner, owner.start ? 'acquired-by' : 'part-of');
}
await writeFile(landscapePath, JSON.stringify(landscape, null, 2) + '\n');
console.log(`Resolved ${withQid} of ${landscape.vendors.length} vendors to Wikidata items; added ${added.length} relations.`);
if (review.length) console.log(`Label-only matches to review:\n  ${review.join('\n  ')}`);
if (added.length) console.log(`Relations from Wikidata:\n  ${added.join('\n  ')}`);
