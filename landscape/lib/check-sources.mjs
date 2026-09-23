#!/usr/bin/env node
// Checks every URL in landscape.json (vendor websites, vendor sources, relation sources) and
// records the HTTP result in lib/cache/urls.json so the check is repeatable without re-fetching.
//
//   node landscape/lib/check-sources.mjs            # check URLs not yet in the cache, report dead ones
//   node landscape/lib/check-sources.mjs --refresh  # re-check everything
//   node landscape/lib/check-sources.mjs --prune    # also remove relations and vendor sources whose URL is dead
//
// When landscape/signals.json exists its citable page URLs are checked as well and reported, never pruned.
//
// A URL counts as alive when the final response is 2xx or 3xx, or when the host answered 401, 403,
// 405, or 429 (the page exists but refused an automated client). 404, 410, DNS failures, and
// timeouts count as dead. A vendor's own website is never pruned; it is reported instead.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const landscapePath = join(directory, '..', 'landscape.json');
const cachePath = join(directory, 'cache', 'urls.json');
const flags = new Set(process.argv.slice(2));
for (const flag of flags) if (!['--refresh', '--prune'].includes(flag)) throw new Error('Usage: check-sources.mjs [--refresh] [--prune]');
const USER_AGENT = 'Mozilla/5.0 (compatible; TechnologyOperationsLibrary-landscape/1.0; +https://github.com/hellojdmiller/technology-operations-library)';
const ALIVE_BLOCKED = new Set([401, 403, 405, 406, 429, 999]);

const landscape = JSON.parse(await readFile(landscapePath, 'utf8'));
let cache = flags.has('--refresh') ? {} : await readFile(cachePath, 'utf8').then(JSON.parse).catch(() => ({}));
const urls = new Set();
for (const vendor of landscape.vendors) { if (vendor.website) urls.add(vendor.website); vendor.sources.forEach((s) => urls.add(s)); }
for (const relation of landscape.relations) urls.add(relation.source);
// Market-signal sources (landscape/signals.json) are checked too when the file exists: filing indexes, announcement and
// event pages, repository pages, and attribution pages. Query-style API endpoints are skipped because a HEAD request
// there says nothing about the page a reader would open.
const signalUrls = new Set();
const API_HOSTS = ['hn.algolia.com', 'api.ossinsight.io', 'api.npmjs.org', 'pypistats.org', 'formulae.brew.sh', 'hub.docker.com', 'api.github.com', 'data.sec.gov', 'query.wikidata.org', 'raw.githubusercontent.com'];
const signals = await readFile(join(directory, '..', 'signals.json'), 'utf8').then(JSON.parse).catch(() => null);
if (signals) {
  const consider = (url) => { if (url && !API_HOSTS.includes(new URL(url).host) && !url.startsWith('https://www.wikidata.org/')) signalUrls.add(url); };
  for (const a of signals.attributions) { consider(a.url); consider(a.licenseUrl); }
  for (const v of Object.values(signals.vendors)) {
    for (const f of v.funding) consider(f.source);
    if (v.stars) { consider(v.stars.url); consider(v.stars.discoverySource); }
    for (const e of v.events) consider(e.source);
  }
  for (const k of signals.methods.kaggleCandidates) consider(k.url);
  for (const u of signalUrls) urls.add(u);
}
const pending = [...urls].filter((url) => !cache[url] && !url.startsWith('https://www.wikidata.org/'));

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' } });
    if (response.status === 405 || response.status === 404 || response.status >= 500) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' } });
    }
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    return { status: 0, error: error.name === 'AbortError' ? 'timeout' : String(error.cause?.code ?? error.message) };
  } finally { clearTimeout(timer); }
}
const alive = (entry) => entry && ((entry.status >= 200 && entry.status < 400) || ALIVE_BLOCKED.has(entry.status));

let index = 0;
const checkedOn = new Date().toISOString().slice(0, 10);
async function worker() {
  while (index < pending.length) {
    const url = pending[index++];
    cache[url] = { ...(await probe(url)), checkedOn };
    if (index % 100 === 0) { console.log(`${index}/${pending.length}`); await mkdir(dirname(cachePath), { recursive: true }); await writeFile(cachePath, JSON.stringify(cache) + '\n'); }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
await mkdir(dirname(cachePath), { recursive: true });
await writeFile(cachePath, JSON.stringify(cache) + '\n');

const dead = [...urls].filter((url) => !url.startsWith('https://www.wikidata.org/') && !alive(cache[url]));
const deadSet = new Set(dead);
const deadWebsites = landscape.vendors.filter((v) => v.website && deadSet.has(v.website)).map((v) => `${v.id} ${v.website} (${cache[v.website].status || cache[v.website].error})`);
const deadRelations = landscape.relations.filter((r) => deadSet.has(r.source));
const deadSources = landscape.vendors.flatMap((v) => v.sources.filter((s) => deadSet.has(s) && s !== v.website).map((s) => `${v.id} ${s}`));
const deadSignals = [...signalUrls].filter((u) => deadSet.has(u));
console.log(`Checked ${urls.size} URLs (${pending.length} fetched now). Dead: ${dead.length} URLs, ${deadRelations.length} relations, ${deadSources.length} vendor sources, ${deadWebsites.length} vendor websites, ${deadSignals.length} of ${signalUrls.size} signal sources.`);
if (deadSignals.length) console.log(`Signal sources to review by hand (signals.json is regenerated by fetch-signals.mjs, not pruned here):\n  ${deadSignals.map((u) => `${u} (${cache[u].status || cache[u].error})`).join('\n  ')}`);
if (deadWebsites.length) console.log(`Vendor websites to review by hand:\n  ${deadWebsites.join('\n  ')}`);
if (flags.has('--prune')) {
  landscape.relations = landscape.relations.filter((r) => !deadSet.has(r.source));
  for (const vendor of landscape.vendors) vendor.sources = vendor.sources.filter((s) => !deadSet.has(s) || s === vendor.website);
  await writeFile(landscapePath, JSON.stringify(landscape, null, 2) + '\n');
  console.log(`Pruned ${deadRelations.length} relations and ${deadSources.length} vendor sources.`);
} else if (deadRelations.length) {
  console.log(`Relations with dead sources (run with --prune to remove):\n  ${deadRelations.slice(0, 40).map((r) => `${r.from} ${r.type} ${r.to} ${r.source} (${cache[r.source].status || cache[r.source].error})`).join('\n  ')}${deadRelations.length > 40 ? `\n  ... ${deadRelations.length - 40} more` : ''}`);
}
