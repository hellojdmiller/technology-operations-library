#!/usr/bin/env node
// Fetches the public exhibitor, sponsor, vendor, and village directories listed in conferences.mjs, caches what each host
// answered under lib/cache/signals/conferences.json, matches the entries to landscape vendors, and writes the result into
// landscape/signals.json (the `conferences` block, `methods.conferences`, the attribution rows, and each vendor's
// `conferences` list). fetch-signals.mjs reads the same cache, so a full rebuild keeps this source.
//
//   node landscape/lib/fetch-conferences.mjs             # fetch pages not yet cached, then patch signals.json
//   node landscape/lib/fetch-conferences.mjs --refresh   # fetch every page again
//   node landscape/lib/fetch-conferences.mjs --dry-run   # report from the cache only; no network, no write
//
// The fetcher identifies itself with the library's user agent and contact address, reads robots.txt first, and records a
// refusal (403, a block page, an unreadable robots.txt) instead of retrying with a browser identity.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EVENTS, PARSERS, USER_AGENT, assembleConferences, robotsRule } from './conferences.mjs';

const directory = dirname(fileURLToPath(import.meta.url));
const root = join(directory, '..');
const cacheDir = join(directory, 'cache', 'signals');
const cachePath = join(cacheDir, 'conferences.json');
const flags = new Set(process.argv.slice(2));
for (const flag of flags) if (!['--refresh', '--dry-run'].includes(flag)) throw new Error('Usage: fetch-conferences.mjs [--refresh] [--dry-run]');
const dryRun = flags.has('--dry-run'), refresh = flags.has('--refresh');
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = localDate();

const landscape = JSON.parse(await readFile(join(root, 'landscape.json'), 'utf8'));
const cache = await readFile(cachePath, 'utf8').then(JSON.parse).catch(() => ({ retrieved: null, userAgent: USER_AGENT, robots: {}, events: {} }));
cache.userAgent = USER_AGENT;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const lastCallAt = new Map();
async function request(url, { timeout = 45000 } = {}) {
  const host = new URL(url).host;
  const wait = (lastCallAt.get(host) ?? 0) + 1500 - Date.now();
  if (wait > 0) await sleep(wait);
  lastCallAt.set(host, Date.now());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,text/plain;q=0.9,*/*;q=0.8' } });
    const body = await response.text();
    return { status: response.status, body, finalUrl: response.url, server: response.headers.get('server') ?? null };
  } catch (error) {
    return { status: 0, body: '', finalUrl: null, server: null, error: error.name === 'AbortError' ? 'timeout' : String(error.cause?.code ?? error.message) };
  } finally { clearTimeout(timer); }
}
const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const blockPage = (body) => /Attention Required!\s*\|\s*Cloudflare|you have been blocked|Access Denied|Just a moment\.\.\./iu.test(body);

for (const spec of EVENTS) {
  const existing = cache.events[spec.id];
  if (existing && !refresh) { console.log(`${spec.id}: cached (${existing.refused ? `refused: ${existing.refused}` : `${existing.entries.length} entries`})`); continue; }
  if (dryRun) { console.log(`${spec.id}: would fetch ${spec.url}`); continue; }
  const origin = new URL(spec.url).origin;
  const robotsUrl = `${origin}/robots.txt`;
  let robots = cache.robots[robotsUrl];
  if (!robots || refresh) {
    const r = await request(robotsUrl);
    robots = { url: robotsUrl, status: r.status, retrieved: today, sha256: r.status ? sha256(r.body) : null, body: r.status === 200 && !/^\s*</u.test(r.body) ? r.body : null, error: r.error ?? null };
    cache.robots[robotsUrl] = robots;
  }
  const rule = robots.status === 200 && robots.body ? robotsRule(robots.body, new URL(spec.url).pathname) : { rule: robots.status === 404 ? 'no robots.txt' : 'unreadable', matchedGroup: null };
  const record = { retrieved: today, robots: { url: robotsUrl, status: robots.status, rule: rule.rule, matchedGroup: rule.matchedGroup }, page: null, entries: [], refused: null };
  if (rule.rule === 'disallowed') record.refused = `robots.txt disallows ${new URL(spec.url).pathname} for ${rule.matchedGroup}`;
  else if (rule.rule === 'unreadable') record.refused = `robots.txt could not be read (status ${robots.status}${robots.error ? `, ${robots.error}` : ''}${robots.status === 403 ? ', an HTML error page' : ''}); the directory was not fetched because the site's rules for automated reading are unknown`;
  if (!record.refused) {
    const r = await request(spec.url);
    record.page = { url: spec.url, status: r.status, finalUrl: r.finalUrl, server: r.server, sha256: r.status ? sha256(r.body) : null, bytes: r.body.length, error: r.error ?? null };
    if (r.status !== 200) record.refused = `the server answered ${r.status || r.error} to the identified fetcher${blockPage(r.body) ? ' with a security-service block page' : ''}; no browser identity was tried`;
    else if (blockPage(r.body)) record.refused = 'the server answered 200 with a security-service block page instead of the directory';
    else {
      record.entries = PARSERS[spec.parser](r.body);
      if (!record.entries.length) record.refused = 'the page answered but no directory entries could be read from its HTML (the list is likely rendered by scripts from a data source the page does not expose)';
    }
  }
  cache.events[spec.id] = record;
  console.log(`${spec.id}: ${record.refused ? `refused: ${record.refused}` : `${record.entries.length} entries (robots: ${rule.rule})`}`);
}
cache.retrieved = Object.values(cache.events).map((e) => e.retrieved).filter(Boolean).sort().at(-1) ?? null;
if (!dryRun) { await mkdir(cacheDir, { recursive: true }); await writeFile(cachePath, JSON.stringify(cache, null, 1) + '\n'); }

// ---------- patch signals.json ----------
const { block, byVendor, method, attributions } = assembleConferences(cache, landscape);
const signalsPath = join(root, 'signals.json');
const signals = JSON.parse(await readFile(signalsPath, 'utf8'));
const insertAfter = (obj, afterKey, key, value) => { const out = {}; let placed = false; for (const [k, v] of Object.entries(obj)) { if (k === key) continue; out[k] = v; if (k === afterKey) { out[key] = value; placed = true; } } if (!placed) out[key] = value; return out; };
let next = insertAfter(signals, 'surveys', 'conferences', block);
next.methods = insertAfter(next.methods, 'events', 'conferences', method);
next.attributions = [...next.attributions.filter((a) => !/(RSAC|Black Hat|DEF CON)/u.test(a.dataset)), ...attributions];
next.coverage = insertAfter(next.coverage, 'withEvents', 'withConferences', Object.keys(byVendor).length);
for (const [id, v] of Object.entries(next.vendors)) next.vendors[id] = insertAfter(v, 'events', 'conferences', byVendor[id] ?? []);
next.generatedOn = today;
const out = JSON.stringify(next, null, 1) + '\n';
if (out.includes(String.fromCharCode(8212))) throw new Error('signals.json must not contain em dashes');
const changed = out !== JSON.stringify(signals, null, 1) + '\n';
if (!dryRun && changed) await writeFile(signalsPath, out);
const fetched = block.events.filter((e) => !e.refused);
const matchedVendors = new Set(Object.keys(byVendor));
console.log(`conferences: ${fetched.length} of ${block.events.length} directory pages readable (${fetched.reduce((n, e) => n + e.exhibitorCount, 0)} entries), ${fetched.reduce((n, e) => n + e.matched.length, 0)} entries matched to ${matchedVendors.size} landscape vendors; ${block.events.length - fetched.length} refused. signals.json ${dryRun ? 'not written (dry run)' : changed ? 'updated' : 'unchanged'}.`);
for (const e of block.events) if (!e.refused) console.log(`  ${e.id}: ${e.exhibitorCount} listed, ${e.matched.length} matched${e.matched.length ? ` (${e.matched.map((m) => `${m.vendor}:${m.confidence}`).join(', ')})` : ''}`);
