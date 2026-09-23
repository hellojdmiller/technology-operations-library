#!/usr/bin/env node
// Collects two years of open market signals for the vendors in landscape.json and writes landscape/signals.json.
//
//   node landscape/lib/fetch-signals.mjs                       # every source, using lib/cache/signals/ and fetching only what is missing
//   node landscape/lib/fetch-signals.mjs --source form-d       # one source: form-d | announcements | stars | hn | adoption | surveys | events | all
//   node landscape/lib/fetch-signals.mjs --dry-run             # report what would be fetched and rebuild signals.json from the cache only
//   node landscape/lib/fetch-signals.mjs --refresh             # ignore the cache for the selected sources
//
// Sources, all open and citable (see landscape/README.md, "Market signals"):
//   form-d         SEC Form D quarterly data sets plus EDGAR submissions for the current quarter (public domain)
//   announcements  Vendor newsroom posts listed in lib/signals-manual.json, fetched and checked for the stated amount
//   stars          GitHub stargazer history per repository through the OSS Insight API (GH Archive), GitHub star API as fallback
//   hn             Hacker News story counts per vendor through the Algolia HN Search API
//   adoption       npm, pypistats.org, Homebrew analytics, and Docker Hub pull counts for mapped packages; OSS Insight pull-request creators
//   surveys        Stack Overflow Developer Survey public results (ODbL), 2024 and 2025
//   events         Wikidata ownership, parent, name, and dissolution statements; EDGAR former names; landscape maturity changes; verified vendor announcements
//
// Every fetch is cached under lib/cache/signals/ with the retrieval date, so a rerun is idempotent and resumable.
// Conference directories are fetched by fetch-conferences.mjs into the same cache directory; the assembly below reads that
// cache so a full rebuild keeps the conferences block (see conferences.mjs).
// Large raw downloads (Form D zips, survey CSVs) go to lib/cache/signals/raw/, which is not committed.
// No token is ever written: a GitHub token is read from GITHUB_TOKEN or from `gh auth token` at run time only.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleConferences } from './conferences.mjs';

const directory = dirname(fileURLToPath(import.meta.url));
const root = join(directory, '..');
const cacheDir = join(directory, 'cache', 'signals');
const rawDir = join(cacheDir, 'raw');
const SOURCES = ['form-d', 'announcements', 'stars', 'hn', 'adoption', 'surveys', 'events'];
const args = process.argv.slice(2);
const flags = { source: 'all', dryRun: false, refresh: false, quiet: false };
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--source') { flags.source = args[i + 1]; i += 1; }
  else if (args[i] === '--dry-run') flags.dryRun = true;
  else if (args[i] === '--refresh') flags.refresh = true;
  else throw new Error(`Usage: fetch-signals.mjs [--source ${SOURCES.join('|')}|all] [--dry-run] [--refresh]`);
}
if (flags.source !== 'all' && !SOURCES.includes(flags.source)) throw new Error(`Unknown source ${flags.source}`);
const selected = (name) => flags.source === 'all' || flags.source === name;

const CONTACT = 'hellojdmiller@gmail.com';
const USER_AGENT = `TechnologyOperationsLibrary-signals/1.0 (https://github.com/hellojdmiller/technology-operations-library; ${CONTACT})`;
const WINDOW = { start: '2024-09-01', end: '2026-09-22' };
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = localDate();

// ---------- quarters ----------
function quarterOf(date) { const [y, m] = date.split('-').map(Number); return `${y}-Q${Math.ceil(m / 3)}`; }
function quarterBounds(id) {
  const [y, q] = id.split('-Q').map(Number);
  const start = `${y}-${String((q - 1) * 3 + 1).padStart(2, '0')}-01`;
  const endMonth = q * 3;
  const end = `${y}-${String(endMonth).padStart(2, '0')}-${new Date(Date.UTC(y, endMonth, 0)).getUTCDate()}`;
  return { start, end };
}
const QUARTERS = [];
for (let id = quarterOf(WINDOW.start); ; ) {
  const b = quarterBounds(id);
  QUARTERS.push({ id, start: b.start < WINDOW.start ? WINDOW.start : b.start, end: b.end > WINDOW.end ? WINDOW.end : b.end, partial: b.start < WINDOW.start || b.end > WINDOW.end });
  if (b.end >= WINDOW.end) break;
  const [y, q] = id.split('-Q').map(Number);
  id = q === 4 ? `${y + 1}-Q1` : `${y}-Q${q + 1}`;
}
const QUARTER_IDS = QUARTERS.map((q) => q.id);
const inWindow = (date) => date >= WINDOW.start && date <= WINDOW.end;
const emptyByQuarter = () => Object.fromEntries(QUARTER_IDS.map((q) => [q, 0]));
const monthsOf = (id) => { const { start, end } = quarterBounds(id); const out = []; for (let m = start.slice(0, 7); m <= end.slice(0, 7); ) { out.push(m); const [y, mm] = m.split('-').map(Number); m = mm === 12 ? `${y + 1}-01` : `${y}-${String(mm + 1).padStart(2, '0')}`; } return out; };

// ---------- inputs ----------
const landscape = JSON.parse(await readFile(join(root, 'landscape.json'), 'utf8'));
const manual = JSON.parse(await readFile(join(directory, 'signals-manual.json'), 'utf8'));
const surveyMapping = JSON.parse(await readFile(join(directory, 'signals-survey-mapping.json'), 'utf8'));
const wikidataCache = JSON.parse(await readFile(join(directory, 'cache', 'wikidata.json'), 'utf8'));
const landscapesCache = JSON.parse(await readFile(join(directory, 'cache', 'landscapes.json'), 'utf8'));
const vendorById = new Map(landscape.vendors.map((v) => [v.id, v]));
const knownVendor = (id, where) => { if (!vendorById.has(id)) throw new Error(`${where}: unknown vendor id ${id}`); };
for (const id of Object.keys(manual.formD.aliases)) knownVendor(id, 'formD.aliases');
for (const id of Object.keys(manual.formD.accept)) knownVendor(id, 'formD.accept');
for (const id of Object.keys(manual.formD.reject)) knownVendor(id, 'formD.reject');
for (const id of Object.keys(manual.repos)) knownVendor(id, 'repos');
for (const id of Object.keys(manual.reposSkipped)) knownVendor(id, 'reposSkipped');
for (const id of Object.keys(manual.packages)) knownVendor(id, 'packages');
for (const id of Object.keys(manual.hn.skip)) knownVendor(id, 'hn.skip');
for (const id of manual.hn.domainQueries) knownVendor(id, 'hn.domainQueries');
for (const id of Object.keys(manual.hn.customQueries)) knownVendor(id, 'hn.customQueries');
for (const id of Object.keys(manual.hn.ambiguousKept)) knownVendor(id, 'hn.ambiguousKept');
for (const a of manual.announcements) knownVendor(a.vendor, 'announcements');
for (const e of manual.events) knownVendor(e.vendor, 'events');
for (const q of surveyMapping.questions) { for (const v of Object.values(q.options)) if (v) knownVendor(v, `survey question ${q.id}`); for (const c of q.categories) if (!landscape.categories.some((x) => x.id === c)) throw new Error(`survey question ${q.id}: unknown category ${c}`); }

const say = (...parts) => { if (!flags.quiet) console.log(...parts); };
// ---------- http with per-host pacing, retries, and accounting ----------
const stats = {};
const lastCallAt = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function request(url, { headers = {}, minGap = 250, timeout = 60000, retries = 3, binary = false, method = 'GET' } = {}) {
  const host = new URL(url).host;
  const s = stats[host] ??= { requests: 0, ms: 0, errors: 0 };
  for (let attempt = 1; ; attempt += 1) {
    const wait = (lastCallAt.get(host) ?? 0) + minGap - Date.now();
    if (wait > 0) await sleep(wait);
    lastCallAt.set(host, Date.now());
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { method, redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT, Accept: 'application/json, text/html;q=0.9, */*;q=0.8', ...headers } });
      s.requests += 1; s.ms += Date.now() - started;
      const secThrottled = response.status === 403 && host.endsWith('sec.gov');
      if ((response.status === 429 || secThrottled || response.status === 403 && host.endsWith('github.com') && response.headers.get('x-ratelimit-remaining') === '0' || response.status >= 500) && attempt <= retries) {
        const reset = Number(response.headers.get('x-ratelimit-reset') || 0) * 1000;
        const delay = secThrottled ? 65000 : reset > Date.now() ? Math.min(reset - Date.now() + 1000, 120000) : 3000 * attempt;
        if (secThrottled) say(`  sec.gov asked us to slow down; waiting ${delay / 1000} s before retrying ${url}`);
        await sleep(delay); continue;
      }
      const body = binary ? Buffer.from(await response.arrayBuffer()) : await response.text();
      return { status: response.status, body, finalUrl: response.url, headers: response.headers };
    } catch (error) {
      s.requests += 1; s.ms += Date.now() - started; s.errors += 1;
      if (attempt <= retries) { await sleep(2000 * attempt); continue; }
      return { status: 0, body: '', error: error.name === 'AbortError' ? 'timeout' : String(error.cause?.code ?? error.message) };
    } finally { clearTimeout(timer); }
  }
}
const json = (r) => { try { return JSON.parse(r.body); } catch { return null; } };
const alive = (status) => (status >= 200 && status < 400) || [401, 403, 405, 406, 429, 999].includes(status);

// ---------- caches ----------
await mkdir(rawDir, { recursive: true });
async function loadCache(name, fallback) {
  if (flags.refresh) return fallback;
  return readFile(join(cacheDir, `${name}.json`), 'utf8').then(JSON.parse).catch(() => fallback);
}
async function saveCache(name, data) { await writeFile(join(cacheDir, `${name}.json`), JSON.stringify(data) + '\n'); }
const exists = (path) => stat(path).then(() => true, () => false);
const urlCache = await readFile(join(cacheDir, 'urls.json'), 'utf8').then(JSON.parse).catch(() => ({}));
// Fetches a page once and records whether each evidence phrase appears in its text.
async function verifyUrl(url, evidence) {
  const key = url;
  if (!urlCache[key] || flags.refresh) {
    if (flags.dryRun) return { status: null, verified: null, retrieved: null, dryRun: true };
    const r = await request(url, { minGap: 500, timeout: 30000 });
    const text = r.body.replace(/<script[\s\S]*?<\/script>/giu, ' ').replace(/<style[\s\S]*?<\/style>/giu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&nbsp;|&#160;/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');
    const matched = evidence.filter((phrase) => text.toLowerCase().includes(phrase.toLowerCase()));
    urlCache[key] = { status: r.status, finalUrl: r.finalUrl ?? null, error: r.error ?? null, matched, evidence, retrieved: today };
    await writeFile(join(cacheDir, 'urls.json'), JSON.stringify(urlCache, null, 1) + '\n');
  }
  const entry = urlCache[key];
  return { ...entry, verified: alive(entry.status) && entry.matched.length > 0 };
}
let githubToken = process.env.GITHUB_TOKEN ?? null;
if (!githubToken) { try { githubToken = execSync('gh auth token --user hellojdmiller', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null; } catch { githubToken = null; } }
const githubHeaders = () => ({ Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}) });

// ---------- shared name normalisation ----------
const STOP = new Set(['inc', 'incorporated', 'corp', 'corporation', 'co', 'company', 'llc', 'ltd', 'limited', 'plc', 'holdings', 'holding', 'group', 'technologies', 'technology', 'tech', 'labs', 'lab', 'software', 'systems', 'solutions', 'international', 'usa', 'the', 'ag', 'gmbh', 'sa', 'bv', 'pbc', 'lp', 'llp', 'se', 'ii', 'iii', 'iv']);
const normalizeName = (s) => s.toLowerCase().replace(/&/gu, ' and ').replace(/[^a-z0-9]+/gu, ' ').split(' ').filter((w) => w && !STOP.has(w)).join(' ');
const host = (url) => { try { return new URL(url).hostname.replace(/^www\./u, '').toLowerCase(); } catch { return null; } };
const registrable = (url) => { const h = host(url); return h ? h.split('.').slice(-2).join('.') : null; };

// ======================================================================
// form-d
// ======================================================================
const FORM_D_INDEX = 'https://www.sec.gov/data-research/sec-markets-data/form-d-data-sets';
// The SEC edge rejects User-Agent strings that contain a URL, so its requests carry the plain name-and-contact form it asks for.
const SEC_USER_AGENT = `TechnologyOperationsLibrary-signals/1.0 (${CONTACT})`;
const SEC_OPTIONS = { minGap: 150, headers: { Accept: '*/*', 'User-Agent': SEC_USER_AGENT } };
const US_STATES = new Set(['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'PR', 'VI', 'GU', 'AS', 'X1']);
// EDGAR two-character codes for the countries that appear among matched issuers (the full table is at
// https://www.sec.gov/submit-filings/filer-support-resources/edgar-state-country-codes).
const EDGAR_COUNTRY = { X0: 'GB', U0: 'SG', P7: 'NL', C3: 'AU', '2M': 'DE', A0: 'CA', A1: 'CA', A6: 'CA', Z4: 'CA', L3: 'IL', L2: 'IE', G7: 'DK', F4: 'CN', K3: 'HK', K7: 'IN', M0: 'JP', N4: 'LU', E9: 'KY', I0: 'FR', V7: 'SE', V8: 'CH', E1: 'CY', D0: 'BM', D8: 'VG', J1: 'GI', Q8: 'NO', T0: 'SA', W8: 'TR', 'B8': 'AT', 'C9': 'BE', 'H2': 'EG', 'K2': 'HU', 'M6': 'KR', 'N2': 'LI', 'R9': 'PL', 'S6': 'PT', 'U3': 'ES', 'X4': 'AE' };
const issuerCountry = (code) => (US_STATES.has(code) ? 'US' : EDGAR_COUNTRY[code] ?? null);
const parseAmount = (s) => (s === undefined || s === '' ? null : s.toLowerCase() === 'indefinite' ? 'indefinite' : Number.isFinite(Number(s)) ? Number(s) : null);

function readZip(buffer) {
  const eocd = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('not a zip file');
  const count = buffer.readUInt16LE(eocd + 10);
  let p = buffer.readUInt32LE(eocd + 16);
  const entries = {};
  for (let i = 0; i < count; i += 1) {
    const method = buffer.readUInt16LE(p + 10), compSize = buffer.readUInt32LE(p + 20);
    const nameLen = buffer.readUInt16LE(p + 28), extraLen = buffer.readUInt16LE(p + 30), commentLen = buffer.readUInt16LE(p + 32);
    const local = buffer.readUInt32LE(p + 42);
    const name = buffer.toString('utf8', p + 46, p + 46 + nameLen);
    const dataStart = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
    const data = buffer.subarray(dataStart, dataStart + compSize);
    entries[name.split('/').pop()] = method === 8 ? inflateRawSync(data) : Buffer.from(data);
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}
function parseTsv(buffer) {
  const lines = buffer.toString('latin1').split('\n');
  const header = lines[0].replace(/\r$/u, '').split('\t');
  const rows = [];
  for (const line of lines.slice(1)) { if (!line.trim()) continue; const cells = line.replace(/\r$/u, '').split('\t'); rows.push(Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').trim()]))); }
  return rows;
}
const secDate = (s) => { const m = s.match(/^(\d{2})-([A-Z]{3})-(\d{4})$/u); if (!m) return s; const months = { JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06', JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12' }; return `${m[3]}-${months[m[2]]}-${m[1]}`; };
const filingIndexUrl = (cik, accession) => `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replace(/-/gu, '')}/`;

// Location labels for the Wikidata headquarters items in the landscape cache, used to grade a match as exact.
async function hqLabels() {
  const cache = await loadCache('wikidata-locations', { retrieved: null, labels: {} });
  const wanted = [...new Set(landscape.vendors.filter((v) => v.wikidata).flatMap((v) => wikidataCache.entities[v.wikidata]?.P159 ?? []))].filter((q) => !(q in cache.labels));
  if (wanted.length && !flags.dryRun) {
    for (let i = 0; i < wanted.length; i += 100) {
      const batch = wanted.slice(i, i + 100);
      const query = `SELECT ?item ?itemLabel WHERE { VALUES ?item { ${batch.map((q) => `wd:${q}`).join(' ')} } SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`;
      const r = await request(`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`, { minGap: 400, headers: { Accept: 'application/sparql-results+json' } });
      const data = json(r);
      for (const q of batch) cache.labels[q] = null;
      for (const row of data?.results?.bindings ?? []) cache.labels[row.item.value.split('/').pop()] = row.itemLabel.value;
    }
    cache.retrieved = today;
    await saveCache('wikidata-locations', cache);
  }
  return cache.labels;
}

async function fetchFormD() {
  const cache = await loadCache('form-d', { retrieved: null, index: null, datasets: {}, filings: [], review: [], submissions: {} });
  const labels = await hqLabels();
  // 1. Which quarterly data sets cover the window.
  if (!cache.index || flags.refresh) {
    if (flags.dryRun) { say('form-d: would fetch the data set index'); return cache; }
    const r = await request(FORM_D_INDEX, SEC_OPTIONS);
    if (!alive(r.status)) throw new Error(`Form D index ${r.status}`);
    const zips = {};
    for (const m of r.body.matchAll(/href="(\/files\/[^"]*form-d-data-sets\/(\d{4})q(\d)_d[^"]*\.zip)"/gu)) zips[`${m[2]}-Q${m[3]}`] ??= `https://www.sec.gov${m[1]}`;
    if (!Object.keys(zips).length) throw new Error(`Form D index parsed no data set links (status ${r.status}); not caching`);
    cache.index = { url: FORM_D_INDEX, retrieved: today, zips };
  }
  const wanted = QUARTER_IDS.filter((q) => cache.index.zips[q]);
  say(`form-d: data sets available for ${wanted.join(', ')}`);
  // 2. Download and parse each data set, matching primary issuers to vendors.
  const aliasIndex = new Map();
  for (const vendor of landscape.vendors) (aliasIndex.get(normalizeName(vendor.name)) ?? aliasIndex.set(normalizeName(vendor.name), []).get(normalizeName(vendor.name))).push({ vendor: vendor.id, via: 'name' });
  for (const [vendorId, names] of Object.entries(manual.formD.aliases)) for (const name of names) { const key = normalizeName(name); const list = aliasIndex.get(key) ?? aliasIndex.set(key, []).get(key); if (!list.some((x) => x.vendor === vendorId)) list.push({ vendor: vendorId, via: 'alias' }); }
  const filings = new Map(cache.filings.map((f) => [`${f.vendor}|${f.accession}`, f]));
  const review = new Map(cache.review.map((r) => [`${r.vendor}|${r.cik}|${r.accession}`, r]));
  for (const quarter of wanted) {
    if (cache.datasets[quarter]?.parsed && !flags.refresh) continue;
    const url = cache.index.zips[quarter];
    const zipPath = join(rawDir, 'form-d', `${quarter}.zip`);
    if (!(await exists(zipPath))) {
      if (flags.dryRun) { say(`form-d: would download ${url}`); continue; }
      const r = await request(url, { ...SEC_OPTIONS, binary: true, timeout: 180000 });
      if (r.status !== 200) throw new Error(`${r.status} for ${url}`);
      await mkdir(dirname(zipPath), { recursive: true });
      await writeFile(zipPath, r.body);
    }
    const entries = readZip(await readFile(zipPath));
    const submissions = new Map(parseTsv(entries['FORMDSUBMISSION.tsv']).map((s) => [s.ACCESSIONNUMBER, s]));
    const offerings = new Map(parseTsv(entries['OFFERING.tsv']).map((o) => [o.ACCESSIONNUMBER, o]));
    let primaries = 0;
    for (const issuer of parseTsv(entries['ISSUERS.tsv'])) {
      if (issuer.IS_PRIMARYISSUER_FLAG !== 'YES') continue;
      primaries += 1;
      const candidates = aliasIndex.get(normalizeName(issuer.ENTITYNAME));
      if (!candidates) continue;
      const offering = offerings.get(issuer.ACCESSIONNUMBER) ?? {};
      const submission = submissions.get(issuer.ACCESSIONNUMBER) ?? {};
      const pooled = offering.INDUSTRYGROUPTYPE === 'Pooled Investment Fund' || Boolean(offering.INVESTMENTFUNDTYPE);
      for (const { vendor: vendorId, via } of candidates) {
        const vendor = vendorById.get(vendorId);
        const cik = issuer.CIK;
        const key = `${vendorId}|${cik}|${issuer.ACCESSIONNUMBER}`;
        const rejectReason = manual.formD.reject[vendorId]?.[cik];
        const acceptReason = manual.formD.accept[vendorId]?.[cik];
        const country = issuerCountry(issuer.STATEORCOUNTRY);
        const hq = (wikidataCache.entities[vendor.wikidata]?.P159 ?? []).map((q) => labels[q]).filter(Boolean);
        const cityMatch = hq.some((label) => label.toLowerCase() === (issuer.CITY || '').toLowerCase());
        const countryConflict = vendor.hqCountry && country && vendor.hqCountry !== country && !acceptReason;
        let confidence = via === 'alias' || acceptReason ? 'manual' : cityMatch ? 'exact' : 'normalized';
        const base = { vendor: vendorId, cik, issuer: issuer.ENTITYNAME, city: issuer.CITY, stateOrCountry: issuer.STATEORCOUNTRY, accession: issuer.ACCESSIONNUMBER, quarterSet: quarter };
        if (pooled) { review.set(key, { ...base, decision: 'excluded', reason: 'pooled investment fund' }); continue; }
        if (rejectReason) { review.set(key, { ...base, decision: 'rejected', reason: rejectReason }); continue; }
        if (countryConflict) { review.set(key, { ...base, decision: 'held', reason: `issuer country ${country} differs from vendor headquarters ${vendor.hqCountry}; add to accept or reject in signals-manual.json` }); continue; }
        filings.set(`${vendorId}|${issuer.ACCESSIONNUMBER}`, {
          vendor: vendorId, cik, issuer: issuer.ENTITYNAME, city: issuer.CITY || null, stateOrCountry: issuer.STATEORCOUNTRY || null, country,
          accession: issuer.ACCESSIONNUMBER, filingDate: secDate(submission.FILING_DATE ?? ''), submissionType: submission.SUBMISSIONTYPE ?? null,
          amendment: offering.ISAMENDMENT === 'true', previousAccession: offering.PREVIOUSACCESSIONNUMBER || null,
          industryGroup: offering.INDUSTRYGROUPTYPE || null, saleDate: offering.SALE_DATE || null, yetToOccur: offering.YETTOOCCUR === 'true',
          offeringTotal: parseAmount(offering.TOTALOFFERINGAMOUNT), amountSold: parseAmount(offering.TOTALAMOUNTSOLD), investors: Number(offering.TOTALNUMBERALREADYINVESTED) || 0,
          equity: offering.ISEQUITYTYPE === 'true', debt: offering.ISDEBTTYPE === 'true', confidence, matchedBy: via === 'alias' ? 'alias' : acceptReason ? 'accepted' : 'normalized-name',
          reason: acceptReason ?? null, source: filingIndexUrl(cik, issuer.ACCESSIONNUMBER), dataset: url, retrieved: today,
        });
      }
    }
    cache.datasets[quarter] = { url, retrieved: today, parsed: true, primaryIssuers: primaries };
    say(`form-d: ${quarter} parsed, ${primaries} primary issuers`);
  }
  // 3. Filings after the last data set: EDGAR submissions for each matched CIK, then the primary XML document.
  const lastCovered = wanted.length ? quarterBounds(wanted[wanted.length - 1]).end : null;
  const ciks = [...new Set([...filings.values()].map((f) => f.cik))];
  for (const cik of ciks) {
    if (cache.submissions[cik] && !flags.refresh) continue;
    if (flags.dryRun) { say(`form-d: would fetch EDGAR submissions for CIK ${cik}`); continue; }
    const r = await request(`https://data.sec.gov/submissions/CIK${cik}.json`, SEC_OPTIONS);
    const data = json(r);
    if (!data) { cache.submissions[cik] = { retrieved: today, status: r.status, name: null, formerNames: [], filings: [] }; continue; }
    const recent = data.filings?.recent ?? {};
    const list = (recent.form ?? []).map((form, i) => ({ form, filingDate: recent.filingDate[i], accession: recent.accessionNumber[i], primaryDocument: recent.primaryDocument[i] })).filter((f) => (f.form === 'D' || f.form === 'D/A') && lastCovered && f.filingDate > lastCovered && f.filingDate <= WINDOW.end);
    cache.submissions[cik] = { retrieved: today, status: r.status, name: data.name ?? null, website: data.website || null, formerNames: (data.formerNames ?? []).map((n) => ({ name: n.name, from: n.from?.slice(0, 10) ?? null, to: n.to?.slice(0, 10) ?? null })), filings: list, source: `https://data.sec.gov/submissions/CIK${cik}.json` };
  }
  for (const [cik, sub] of Object.entries(cache.submissions)) {
    const vendorIds = [...new Set([...filings.values()].filter((f) => f.cik === cik).map((f) => f.vendor))];
    for (const f of sub.filings) {
      if ([...filings.values()].some((x) => x.accession === f.accession)) continue;
      if (flags.dryRun) { say(`form-d: would fetch ${f.accession} for CIK ${cik}`); continue; }
      const docUrl = `${filingIndexUrl(cik, f.accession)}${f.primaryDocument.replace(/^xsl[^/]*\//u, '')}`;
      const r = await request(docUrl, SEC_OPTIONS);
      if (r.status !== 200) continue;
      const tag = (name) => { const m = r.body.match(new RegExp(`<${name}>([^<]*)</${name}>`, 'u')); return m ? m[1].trim() : ''; };
      const saleDate = r.body.match(/<dateOfFirstSale>\s*<value>([^<]*)<\/value>/u)?.[1]?.trim() ?? '';
      const yetToOccur = /<dateOfFirstSale>\s*<yetToOccur>\s*true/u.test(r.body);
      const stateOrCountry = tag('stateOrCountry');
      const template = filings.get(`${vendorIds[0]}|${[...filings.values()].find((x) => x.cik === cik).accession}`);
      for (const vendorId of vendorIds) {
        filings.set(`${vendorId}|${f.accession}`, {
          ...template, vendor: vendorId, issuer: tag('entityName') || template.issuer, city: tag('city') || null, stateOrCountry: stateOrCountry || null, country: issuerCountry(stateOrCountry),
          accession: f.accession, filingDate: f.filingDate, submissionType: f.form, amendment: f.form === 'D/A', previousAccession: tag('previousAccessionNumber') || null,
          industryGroup: tag('industryGroupType') || null, saleDate: saleDate || null, yetToOccur,
          offeringTotal: parseAmount(tag('totalOfferingAmount')), amountSold: parseAmount(tag('totalAmountSold')), investors: Number(tag('totalNumberAlreadyInvested')) || 0,
          equity: tag('isEquityType') === 'true', debt: tag('isDebtType') === 'true', source: filingIndexUrl(cik, f.accession), dataset: null, retrieved: today,
        });
      }
    }
  }
  cache.filings = [...filings.values()].sort((a, b) => a.vendor.localeCompare(b.vendor) || a.filingDate.localeCompare(b.filingDate) || a.accession.localeCompare(b.accession));
  cache.review = [...review.values()].sort((a, b) => a.vendor.localeCompare(b.vendor) || a.accession.localeCompare(b.accession));
  cache.retrieved = today;
  if (!flags.dryRun) await saveCache('form-d', cache);
  say(`form-d: ${cache.filings.length} matched filings across ${new Set(cache.filings.map((f) => f.vendor)).size} vendors; ${cache.review.length} candidates excluded, rejected, or held`);
  return cache;
}

// ======================================================================
// announcements (vendor newsroom posts, verified for the stated amount)
// ======================================================================
async function fetchAnnouncements() {
  const results = [];
  for (const a of manual.announcements) {
    const v = await verifyUrl(a.url, a.evidence);
    results.push({ ...a, status: v.status ?? null, verified: v.verified ?? null, matched: v.matched ?? [], retrieved: v.retrieved ?? null });
  }
  const verified = results.filter((r) => r.verified).length;
  say(`announcements: ${verified} of ${results.length} verified (URL answered and the stated amount appears on the page)`);
  for (const r of results.filter((x) => x.verified === false)) say(`  unverified: ${r.vendor} ${r.url} (${r.status})`);
  return results;
}

// ======================================================================
// repositories (shared by stars and adoption)
// ======================================================================
const CNCF_FILES = landscapesCache.sources;
const repoFromUrl = (url) => { const m = (url ?? '').match(/^https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/u); return m && m[1] !== 'orgs' ? `${m[1]}/${m[2]}` : null; };
async function discoverRepos() {
  const wd = await loadCache('wikidata-repos', { retrieved: null, byQid: {} });
  const qids = landscape.vendors.filter((v) => v.wikidata && v.openSource).map((v) => v.wikidata).filter((q) => !(q in wd.byQid));
  if (qids.length && !flags.dryRun) {
    for (let i = 0; i < qids.length; i += 80) {
      const batch = qids.slice(i, i + 80);
      const r = await request(`https://query.wikidata.org/sparql?query=${encodeURIComponent(`SELECT ?item ?repo WHERE { VALUES ?item { ${batch.map((q) => `wd:${q}`).join(' ')} } ?item wdt:P1324 ?repo . }`)}`, { minGap: 400, headers: { Accept: 'application/sparql-results+json' } });
      for (const q of batch) wd.byQid[q] = [];
      for (const row of json(r)?.results?.bindings ?? []) wd.byQid[row.item.value.split('/').pop()].push(row.repo.value);
    }
    wd.retrieved = today;
    await saveCache('wikidata-repos', wd);
  }
  const repos = new Map();
  for (const vendor of landscape.vendors) {
    if (!vendor.openSource) continue;
    if (manual.reposSkipped[vendor.id]) { repos.set(vendor.id, { repo: null, discovery: 'skipped', citation: null, note: manual.reposSkipped[vendor.id] }); continue; }
    const cncf = (landscapesCache.matches[vendor.id] ?? []).find((m) => repoFromUrl(m.repo));
    const wikidata = (wd.byQid[vendor.wikidata] ?? []).map(repoFromUrl).filter(Boolean)[0];
    const site = repoFromUrl(vendor.website);
    if (manual.repos[vendor.id]) repos.set(vendor.id, { repo: manual.repos[vendor.id], discovery: 'manual', citation: vendor.website, note: 'Repository named in signals-manual.json; the fetcher confirms the vendor website links to its GitHub owner' });
    else if (cncf) repos.set(vendor.id, { repo: repoFromUrl(cncf.repo), discovery: 'cncf-landscape', citation: CNCF_FILES[cncf.landscape], note: `repo_url in the ${cncf.landscape.toUpperCase()} landscape entry` });
    else if (wikidata) repos.set(vendor.id, { repo: wikidata, discovery: 'wikidata', citation: `https://www.wikidata.org/wiki/${vendor.wikidata}`, note: 'Wikidata source code repository (P1324)' });
    else if (site) repos.set(vendor.id, { repo: site, discovery: 'website', citation: vendor.website, note: 'The vendor website is the repository' });
    else repos.set(vendor.id, { repo: null, discovery: 'none', citation: null, note: 'No repository found through the landscape files, Wikidata, the website, or the manual list' });
  }
  return repos;
}
async function githubRepoMeta(repo, cache) {
  if (cache.repos[repo] && !flags.refresh) return cache.repos[repo];
  if (flags.dryRun) return null;
  const r = await request(`https://api.github.com/repos/${repo}`, { minGap: 100, headers: githubHeaders() });
  const data = json(r);
  cache.repos[repo] = { retrieved: today, status: r.status, fullName: data?.full_name ?? null, stars: data?.stargazers_count ?? null, htmlUrl: data?.html_url ?? null, createdAt: data?.created_at?.slice(0, 10) ?? null, archived: data?.archived ?? null };
  await saveCache('github', cache);
  return cache.repos[repo];
}

// ======================================================================
// stars
// ======================================================================
const STAR_CAP = 40000;
function gainsFromMonthly(rows, valueKey) {
  const cumulative = new Map(rows.map((row) => [row.date.slice(0, 7), Number(row[valueKey])]));
  const months = [...cumulative.keys()].sort();
  if (!months.length) return null;
  const at = (month) => { let value = null; for (const m of months) { if (m <= month) value = cumulative.get(m); else break; } return value; };
  const byQuarter = {};
  for (const q of QUARTERS) {
    const ms = monthsOf(q.id).filter((m) => m >= q.start.slice(0, 7) && m <= q.end.slice(0, 7));
    const endValue = at(ms[ms.length - 1]);
    const [y, m] = ms[0].split('-').map(Number);
    const before = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
    const startValue = at(before) ?? 0;
    byQuarter[q.id] = endValue === null || months[months.length - 1] < ms[0] ? null : Math.max(0, endValue - startValue);
  }
  return { byQuarter, latestMonth: months[months.length - 1] };
}
async function fetchStars() {
  const repos = await discoverRepos();
  const github = await loadCache('github', { repos: {} });
  const insight = await loadCache('ossinsight', { repos: {} });
  const starPages = await loadCache('github-stars', { repos: {} });
  const out = {};
  for (const [vendorId, info] of repos) {
    if (!info.repo) { out[vendorId] = { ...info, stars: null }; continue; }
    const meta = await githubRepoMeta(info.repo, github);
    if (!meta) { say(`stars: would fetch ${info.repo}`); continue; }
    if (meta.status === 404 || !meta.fullName) { out[vendorId] = { ...info, stars: null, note: `${info.note}; GitHub returned ${meta.status}` }; continue; }
    if (info.discovery === 'manual' && vendorById.get(vendorId).website) {
      const v = await verifyUrl(vendorById.get(vendorId).website, [`github.com/${info.repo.split('/')[0]}`]);
      info.discovery = v.verified ? 'website-link' : 'manual';
      info.note = v.verified ? 'Repository linked from the vendor website' : `${info.note}; the website did not link the GitHub owner when fetched`;
    }
    const repo = meta.fullName;
    if (!insight.repos[repo] || flags.refresh) {
      if (flags.dryRun) { say(`stars: would fetch OSS Insight history for ${repo}`); continue; }
      const s = await request(`https://api.ossinsight.io/v1/repos/${repo}/stargazers/history?per=month`, { minGap: 350 });
      const p = await request(`https://api.ossinsight.io/v1/repos/${repo}/pull_request_creators/history?per=month`, { minGap: 350 });
      insight.repos[repo] = { retrieved: today, starsStatus: s.status, stars: json(s)?.data?.rows ?? [], prStatus: p.status, prCreators: json(p)?.data?.rows ?? [] };
      await saveCache('ossinsight', insight);
    }
    const entry = insight.repos[repo];
    const url = `https://api.ossinsight.io/v1/repos/${repo}/stargazers/history?per=month`;
    let stars = null;
    const gains = gainsFromMonthly(entry.stars, 'stargazers');
    if (gains && Object.values(gains.byQuarter).some((v) => v !== null)) {
      stars = { repo, url: meta.htmlUrl, discovery: info.discovery, discoverySource: info.citation, method: 'ossinsight', byQuarter: gains.byQuarter, latestMonth: gains.latestMonth, currentStars: meta.stars, capped: false, source: url, retrieved: entry.retrieved, note: info.note };
    } else if (meta.stars > STAR_CAP) {
      stars = { repo, url: meta.htmlUrl, discovery: info.discovery, discoverySource: info.citation, method: 'none', byQuarter: null, latestMonth: null, currentStars: meta.stars, capped: true, source: `https://api.github.com/repos/${repo}`, retrieved: meta.retrieved, note: `OSS Insight returned no history and the repository has more than ${STAR_CAP} stars, so the star API was not paged` };
    } else {
      if (!starPages.repos[repo] || flags.refresh) {
        if (flags.dryRun) { say(`stars: would page the GitHub star API for ${repo}`); continue; }
        const byQuarter = emptyByQuarter();
        const pages = Math.max(1, Math.ceil((meta.stars ?? 0) / 100));
        let fetched = 0;
        for (let page = pages; page >= 1; page -= 1) {
          const r = await request(`https://api.github.com/repos/${repo}/stargazers?per_page=100&page=${page}`, { minGap: 100, headers: { ...githubHeaders(), Accept: 'application/vnd.github.star+json' } });
          fetched += 1;
          const parsed = json(r);
          if (!Array.isArray(parsed)) { say(`stars: star API returned ${r.status} for ${repo} page ${page}; stopping the fallback`); break; }
          const list = parsed;
          let oldest = null;
          for (const item of list) { const d = item.starred_at?.slice(0, 10); if (!d) continue; oldest = oldest === null || d < oldest ? d : oldest; if (inWindow(d)) byQuarter[quarterOf(d)] += 1; }
          if (!list.length || (oldest && oldest < WINDOW.start)) break;
        }
        starPages.repos[repo] = { retrieved: today, byQuarter, pagesFetched: fetched };
        await saveCache('github-stars', starPages);
      }
      const paged = starPages.repos[repo];
      stars = { repo, url: meta.htmlUrl, discovery: info.discovery, discoverySource: info.citation, method: 'github-star-api', byQuarter: paged.byQuarter, latestMonth: today.slice(0, 7), currentStars: meta.stars, capped: false, source: `https://api.github.com/repos/${repo}/stargazers`, retrieved: paged.retrieved, note: `${info.note}; OSS Insight had no history, so starred_at timestamps were paged (${paged.pagesFetched} pages)` };
    }
    out[vendorId] = { ...info, repo, stars, prCreators: gainsFromMonthly(entry.prCreators, 'pull_request_creators')?.byQuarter ?? null, prSource: `https://api.ossinsight.io/v1/repos/${repo}/pull_request_creators/history?per=month`, retrieved: entry.retrieved };
  }
  await saveCache('github', github);
  const withStars = Object.values(out).filter((o) => o.stars?.byQuarter).length;
  say(`stars: ${withStars} vendors with a star series, ${Object.values(out).filter((o) => o.stars?.capped).length} capped, ${Object.values(out).filter((o) => !o.repo).length} without a repository`);
  return out;
}

// ======================================================================
// hn (Algolia Hacker News Search)
// ======================================================================
async function fetchHn() {
  const cache = await loadCache('hn', { vendors: {} });
  const startEpoch = Math.floor(Date.parse(`${WINDOW.start}T00:00:00Z`) / 1000);
  const endEpoch = Math.floor(Date.parse(`${WINDOW.end}T23:59:59Z`) / 1000);
  const domainSet = new Set(manual.hn.domainQueries);
  for (const vendor of landscape.vendors) {
    if (manual.hn.skip[vendor.id]) continue;
    const query = manual.hn.customQueries[vendor.id] ?? (domainSet.has(vendor.id) ? `"${host(vendor.website)}"` : `"${vendor.name}"`);
    const mode = manual.hn.customQueries[vendor.id] ? 'custom' : domainSet.has(vendor.id) ? 'domain' : 'name';
    // Name and custom queries are matched against the story title and text only, so that a story whose URL merely
    // sits on the vendor's domain does not count; domain queries also match the URL field by design.
    const restrict = mode === 'domain' ? 'title,story_text,url' : 'title,story_text';
    const existing = cache.vendors[vendor.id];
    if (existing && existing.query === query && existing.method && existing.restrict === restrict && !flags.refresh) continue;
    if (flags.dryRun) { say(`hn: would query ${query}`); continue; }
    // One query returns up to 1000 dated hits, which is enough to bucket most vendors. Algolia does not page past
    // 1000 hits, so busier names get one count-only query per quarter instead (nbHits is exhaustive).
    const filter = (from, to) => encodeURIComponent(`created_at_i>=${from},created_at_i<=${to}`);
    const byQuarter = emptyByQuarter();
    let nbHits = 0, method = 'single-query';
    const first = json(await request(`https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=${filter(startEpoch, endEpoch)}&restrictSearchableAttributes=${restrict}&hitsPerPage=1000&attributesToRetrieve=created_at_i`, { minGap: 300 }));
    if (!first) continue;
    nbHits = first.nbHits;
    if (nbHits <= 1000) {
      for (const hit of first.hits) { const d = new Date(hit.created_at_i * 1000).toISOString().slice(0, 10); if (inWindow(d)) byQuarter[quarterOf(d)] += 1; }
    } else {
      method = 'per-quarter-counts';
      for (const q of QUARTERS) {
        const from = Math.floor(Date.parse(`${q.start}T00:00:00Z`) / 1000), to = Math.floor(Date.parse(`${q.end}T23:59:59Z`) / 1000);
        const data = json(await request(`https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=${filter(from, to)}&restrictSearchableAttributes=${restrict}&hitsPerPage=0`, { minGap: 300 }));
        byQuarter[q.id] = data?.nbHits ?? null;
      }
    }
    cache.vendors[vendor.id] = { query, mode, method, restrict, byQuarter, total: nbHits, capped: false, source: `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i%3E%3D${startEpoch}%2Ccreated_at_i%3C%3D${endEpoch}&restrictSearchableAttributes=${restrict}`, retrieved: today };
    if (Object.keys(cache.vendors).length % 50 === 0) await saveCache('hn', cache);
  }
  if (!flags.dryRun) await saveCache('hn', cache);
  say(`hn: ${Object.keys(cache.vendors).length} vendors queried`);
  return cache.vendors;
}

// ======================================================================
// adoption (package downloads and installs)
// ======================================================================
function sumDaily(daily) {
  const byQuarter = {}; const days = {};
  for (const [day, n] of Object.entries(daily)) { if (!inWindow(day)) continue; const q = quarterOf(day); byQuarter[q] = (byQuarter[q] ?? 0) + n; days[q] = (days[q] ?? 0) + 1; }
  return { byQuarter, days };
}
async function fetchAdoption() {
  const cache = await loadCache('packages', { npm: {}, pypi: {}, homebrew: {}, dockerhub: {} });
  const out = {};
  for (const [vendorId, spec] of Object.entries(manual.packages)) {
    const entries = [];
    for (const pkg of spec.npm ?? []) {
      if (!cache.npm[pkg] || flags.refresh) {
        if (flags.dryRun) { say(`adoption: would fetch npm ${pkg}`); continue; }
        const daily = {};
        let status = 200;
        for (const [from, to] of [[WINDOW.start, '2025-08-31'], ['2025-09-01', WINDOW.end]]) {
          const r = await request(`https://api.npmjs.org/downloads/range/${from}:${to}/${encodeURIComponent(pkg)}`, { minGap: 200 });
          status = r.status;
          for (const d of json(r)?.downloads ?? []) daily[d.day] = d.downloads;
        }
        cache.npm[pkg] = { retrieved: today, status, ...sumDaily(daily) };
        await saveCache('packages', cache);
      }
      const e = cache.npm[pkg];
      if (e.status === 200) entries.push({ source: 'npm', package: pkg, unit: 'downloads', kind: 'series', byQuarter: e.byQuarter, days: e.days, snapshot: null, url: `https://api.npmjs.org/downloads/range/${WINDOW.start}:${WINDOW.end}/${pkg}`, retrieved: e.retrieved, note: 'Registry download counts include mirrors, CI, and bots; quarter sums cover the days listed' });
    }
    for (const pkg of spec.pypi ?? []) {
      if (!cache.pypi[pkg] || flags.refresh) {
        if (flags.dryRun) { say(`adoption: would fetch pypistats ${pkg}`); continue; }
        const r = await request(`https://pypistats.org/api/packages/${encodeURIComponent(pkg)}/overall?mirrors=false`, { minGap: 1200 });
        const daily = {};
        for (const d of json(r)?.data ?? []) if (d.category === 'without_mirrors') daily[d.date] = d.downloads;
        cache.pypi[pkg] = { retrieved: today, status: r.status, ...sumDaily(daily) };
        await saveCache('packages', cache);
      }
      const e = cache.pypi[pkg];
      if (e.status === 200) entries.push({ source: 'pypistats', package: pkg, unit: 'downloads without mirrors', kind: 'series', byQuarter: e.byQuarter, days: e.days, snapshot: null, url: `https://pypistats.org/api/packages/${pkg}/overall?mirrors=false`, retrieved: e.retrieved, note: 'pypistats.org exposes only the last 180 days, so earlier quarters are absent and the first covered quarter is partial' });
    }
    if (spec.homebrew) {
      const kind = spec.homebrew.formula ? 'formula' : 'cask';
      const name = spec.homebrew.formula ?? spec.homebrew.cask;
      const key = `${kind}/${name}`;
      if (!cache.homebrew[key] || flags.refresh) {
        if (flags.dryRun) { say(`adoption: would fetch Homebrew ${key}`); continue; }
        const r = await request(`https://formulae.brew.sh/api/${kind}/${encodeURIComponent(name)}.json`, { minGap: 200 });
        const data = json(r);
        const install = data?.analytics?.install ?? {};
        cache.homebrew[key] = { retrieved: today, status: r.status, snapshot: Object.fromEntries(Object.entries(install).map(([period, values]) => [period, Object.values(values)[0] ?? null])) };
        await saveCache('packages', cache);
      }
      const e = cache.homebrew[key];
      if (e.status === 200 && Object.keys(e.snapshot).length) entries.push({ source: 'homebrew', package: key, unit: 'installs', kind: 'snapshot', byQuarter: null, days: null, snapshot: e.snapshot, url: `https://formulae.brew.sh/api/${kind}/${name}.json`, retrieved: e.retrieved, note: 'Homebrew analytics publish rolling 30, 90, and 365 day install counts, not a dated series' });
    }
    if (spec.dockerhub) {
      const key = spec.dockerhub;
      if (!cache.dockerhub[key] || flags.refresh) {
        if (flags.dryRun) { say(`adoption: would fetch Docker Hub ${key}`); continue; }
        const r = await request(`https://hub.docker.com/v2/repositories/${key}/`, { minGap: 300 });
        const data = json(r);
        cache.dockerhub[key] = { retrieved: today, status: r.status, pulls: data?.pull_count ?? null, stars: data?.star_count ?? null };
        await saveCache('packages', cache);
      }
      const e = cache.dockerhub[key];
      if (e.status === 200 && e.pulls !== null) entries.push({ source: 'dockerhub', package: key, unit: 'cumulative pulls', kind: 'snapshot', byQuarter: null, days: null, snapshot: { total: e.pulls, stars: e.stars }, url: `https://hub.docker.com/v2/repositories/${key}/`, retrieved: e.retrieved, note: 'Docker Hub exposes a lifetime pull count on the day of retrieval, not a series' });
    }
    out[vendorId] = entries;
  }
  say(`adoption: ${Object.values(out).flat().length} package entries across ${Object.keys(out).length} vendors`);
  return out;
}

// ======================================================================
// surveys (Stack Overflow Developer Survey)
// ======================================================================
function parseCsv(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 1; } else quoted = false; } else field += c; }
    else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}
async function fetchSurveys() {
  const cache = await loadCache('stackoverflow', { years: {}, probes: {} });
  for (const [year, meta] of Object.entries(surveyMapping.years)) {
    if (cache.years[year] && !flags.refresh) continue;
    const path = join(rawDir, 'stackoverflow', `${year}-results.csv`);
    if (!(await exists(path))) {
      if (flags.dryRun) { say(`surveys: would download ${meta.file}`); continue; }
      const r = await request(meta.file, { minGap: 500, binary: true, timeout: 600000 });
      if (r.status !== 200) throw new Error(`${r.status} for ${meta.file}`);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, r.body);
    }
    const rows = parseCsv((await readFile(path, 'utf8')).replace(/^﻿/u, ''));
    const header = rows[0];
    const respondents = rows.length - 1;
    const questions = {};
    for (const q of surveyMapping.questions) {
      const column = q.columns[year];
      if (!column) continue;
      const index = header.indexOf(column);
      if (index < 0) { questions[q.id] = { column, missing: true }; continue; }
      const optionCounts = {}, vendorCounts = {}, categoryCounts = {};
      let answered = 0;
      for (const row of rows.slice(1)) {
        const value = row[index];
        if (value === undefined || value === '' || value === 'NA') continue;
        answered += 1;
        const vendors = new Set(), categories = new Set();
        for (const option of value.split(';')) {
          optionCounts[option] = (optionCounts[option] ?? 0) + 1;
          const vendorId = q.options[option];
          if (vendorId) { vendors.add(vendorId); for (const c of vendorById.get(vendorId).categories) if (q.categories.includes(c)) categories.add(c); }
        }
        for (const v of vendors) vendorCounts[v] = (vendorCounts[v] ?? 0) + 1;
        for (const c of categories) categoryCounts[c] = (categoryCounts[c] ?? 0) + 1;
      }
      const unmapped = Object.keys(optionCounts).filter((o) => !(o in q.options));
      questions[q.id] = { column, answered, optionCounts, vendorCounts, categoryCounts, unmapped };
    }
    cache.years[year] = { retrieved: today, file: meta.file, page: meta.page, respondents, questions };
    await saveCache('stackoverflow', cache);
    say(`surveys: ${year} parsed, ${respondents} respondents`);
  }
  const next = String(Number(Object.keys(surveyMapping.years).at(-1)) + 1);
  if (!cache.probes[next] || flags.refresh) {
    if (!flags.dryRun) {
      const r = await request(`https://github.com/StackExchange/Survey/raw/refs/heads/main/packages/archive/${next}/results.csv`, { method: 'HEAD', minGap: 500 });
      cache.probes[next] = { retrieved: today, status: r.status };
      await saveCache('stackoverflow', cache);
    }
  }
  return cache;
}

// ======================================================================
// events
// ======================================================================
const LANDSCAPE_REPOS = { cncf: 'cncf/landscape', lfai: 'lfai/lfai-landscape', cdf: 'cdfoundation/cdf-landscape' };
function parseLandscapeYaml(text) {
  const items = []; let category = null, subcategory = null, item = null;
  for (const line of text.split('\n')) {
    const indent = line.length - line.trimStart().length; const trimmed = line.trim();
    if (indent === 2 && trimmed.startsWith('- category:')) { category = null; continue; }
    if (indent === 4 && trimmed.startsWith('name:') && category === null) { category = trimmed.slice(5).trim().replace(/^['"]|['"]$/gu, ''); continue; }
    if (indent === 6 && trimmed.startsWith('- subcategory:')) { subcategory = null; continue; }
    if (indent === 8 && trimmed.startsWith('name:') && subcategory === null) { subcategory = trimmed.slice(5).trim().replace(/^['"]|['"]$/gu, ''); continue; }
    if (indent === 10 && trimmed.startsWith('- item:')) { item = { category, subcategory }; items.push(item); continue; }
    if (indent === 12 && item) { const [key, ...rest] = trimmed.split(':'); const value = rest.join(':').trim().replace(/^['"]|['"]$/gu, ''); if (['name', 'homepage_url', 'repo_url', 'project'].includes(key)) item[key] = value; }
  }
  return items.filter((i) => i.name && i.homepage_url);
}
async function fetchEvents() {
  const cache = await loadCache('wikidata-events', { retrieved: null, statements: null });
  const qids = landscape.vendors.filter((v) => v.wikidata).map((v) => v.wikidata);
  if ((!cache.statements || flags.refresh) && !flags.dryRun) {
    const statements = [];
    for (let i = 0; i < qids.length; i += 80) {
      const batch = qids.slice(i, i + 80).map((q) => `wd:${q}`).join(' ');
      const query = `SELECT ?item ?prop ?value ?valueLabel ?start ?precision WHERE { VALUES ?item { ${batch} } VALUES (?p ?ps ?prop) { (p:P127 ps:P127 "owned-by") (p:P749 ps:P749 "parent") (p:P1448 ps:P1448 "official-name") } ?item ?p ?st . ?st ?ps ?value . OPTIONAL { ?st pqv:P580 ?startNode . ?startNode wikibase:timeValue ?start ; wikibase:timePrecision ?precision } SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`;
      const r = await request(`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`, { minGap: 500, headers: { Accept: 'application/sparql-results+json' } });
      for (const row of json(r)?.results?.bindings ?? []) statements.push({ item: row.item.value.split('/').pop(), prop: row.prop.value, value: row.value.value.replace('http://www.wikidata.org/entity/', ''), label: row.valueLabel?.value ?? null, start: row.start?.value?.slice(0, 10) ?? null, precision: row.precision ? Number(row.precision.value) : null });
      const dissolved = await request(`https://query.wikidata.org/sparql?query=${encodeURIComponent(`SELECT ?item ?date ?precision WHERE { VALUES ?item { ${batch} } ?item p:P576 ?st . ?st psv:P576 ?node . ?node wikibase:timeValue ?date ; wikibase:timePrecision ?precision }`)}`, { minGap: 500, headers: { Accept: 'application/sparql-results+json' } });
      for (const row of json(dissolved)?.results?.bindings ?? []) statements.push({ item: row.item.value.split('/').pop(), prop: 'dissolved', value: null, label: null, start: row.date.value.slice(0, 10), precision: Number(row.precision.value) });
    }
    cache.statements = statements; cache.retrieved = today;
    await saveCache('wikidata-events', cache);
  }
  const byQid = new Map(landscape.vendors.filter((v) => v.wikidata).map((v) => [v.wikidata, v.id]));
  const events = [];
  const typeOf = { 'owned-by': 'acquired', parent: 'parent-changed', 'official-name': 'renamed', dissolved: 'shut-down' };
  for (const s of cache.statements ?? []) {
    if (!s.start || !inWindow(s.start) || (s.precision !== null && s.precision < 10)) continue;
    const vendorId = byQid.get(s.item);
    const target = s.prop === 'dissolved' ? '' : ` ${byQid.has(s.value) ? vendorById.get(byQid.get(s.value)).name : s.label ?? s.value}`;
    const detail = { 'owned-by': `Wikidata records a new owner:${target} (start time of the owned-by statement)`, parent: `Wikidata records a new parent organization:${target}`, 'official-name': `Wikidata records a new official name:${target}`, dissolved: 'Wikidata records a dissolution date' }[s.prop];
    events.push({ vendor: vendorId, date: s.start, type: typeOf[s.prop], detail: `${detail}${s.precision === 9 ? '; the date has year precision only' : s.precision === 10 ? '; the date has month precision only' : ''}`, source: `https://www.wikidata.org/wiki/${s.item}`, retrieved: cache.retrieved, method: 'wikidata' });
  }
  // EDGAR former names of matched Form D filers.
  const formD = await loadCache('form-d', { submissions: {}, filings: [] });
  for (const [cik, sub] of Object.entries(formD.submissions ?? {})) {
    const vendorIds = [...new Set((formD.filings ?? []).filter((f) => f.cik === cik).map((f) => f.vendor))];
    for (const former of sub.formerNames ?? []) {
      if (!former.to || !inWindow(former.to)) continue;
      for (const vendorId of vendorIds) events.push({ vendor: vendorId, date: former.to, type: 'renamed', detail: `EDGAR former name ${former.name} replaced by ${sub.name}`, source: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}`, retrieved: sub.retrieved, method: 'edgar' });
    }
  }
  // Verified vendor announcements.
  for (const e of manual.events) {
    const v = await verifyUrl(e.url, e.evidence);
    if (v.verified) events.push({ vendor: e.vendor, date: e.date, type: e.type, detail: e.detail, source: e.url, retrieved: v.retrieved, method: 'announcement' });
    else say(`events: unverified ${e.vendor} ${e.url} (${v.status})`);
  }
  // Landscape maturity changes between the window start and now.
  const history = await loadCache('landscapes-history', { landscapes: {} });
  for (const [key, repo] of Object.entries(LANDSCAPE_REPOS)) {
    if (!history.landscapes[key] || flags.refresh) {
      if (flags.dryRun) { say(`events: would fetch ${repo} history`); continue; }
      const commits = json(await request(`https://api.github.com/repos/${repo}/commits?path=landscape.yml&until=${WINDOW.start}T00:00:00Z&per_page=1`, { minGap: 200, headers: githubHeaders() }));
      const sha = commits?.[0]?.sha ?? null;
      const branch = json(await request(`https://api.github.com/repos/${repo}`, { minGap: 200, headers: githubHeaders() }))?.default_branch ?? 'main';
      const then = sha ? await request(`https://raw.githubusercontent.com/${repo}/${sha}/landscape.yml`, { minGap: 200, timeout: 120000 }) : null;
      const now = await request(`https://raw.githubusercontent.com/${repo}/${branch}/landscape.yml`, { minGap: 200, timeout: 120000 });
      const compact = (items) => Object.fromEntries(items.map((i) => [host(i.homepage_url) + '|' + i.name.toLowerCase().replace(/[^a-z0-9]/gu, ''), i.project ?? null]));
      history.landscapes[key] = { retrieved: today, repo, sha, branch, then: then?.status === 200 ? compact(parseLandscapeYaml(then.body)) : null, now: now.status === 200 ? compact(parseLandscapeYaml(now.body)) : null };
      await saveCache('landscapes-history', history);
    }
    const h = history.landscapes[key];
    if (!h?.then || !h?.now) continue;
    for (const vendor of landscape.vendors) {
      const hit = (landscapesCache.matches[vendor.id] ?? []).find((m) => m.landscape === key);
      if (!hit) continue;
      const k = host(vendor.website) + '|' + hit.name.toLowerCase().replace(/[^a-z0-9]/gu, '');
      const before = h.then[k], after = h.now[k];
      if (before === undefined || after === undefined || (before ?? 'none') === (after ?? 'none')) continue;
      events.push({ vendor: vendor.id, date: h.retrieved, type: 'maturity-changed', detail: `${key.toUpperCase()} landscape maturity moved from ${before ?? 'none'} to ${after ?? 'none'} between ${WINDOW.start} (commit ${h.sha.slice(0, 7)}) and the retrieval date`, source: `https://github.com/${repo}/blob/${h.branch}/landscape.yml`, retrieved: h.retrieved, method: 'landscape-history' });
    }
  }
  events.sort((a, b) => a.vendor.localeCompare(b.vendor) || a.date.localeCompare(b.date) || a.type.localeCompare(b.type));
  say(`events: ${events.length} events (${events.filter((e) => e.method === 'wikidata').length} Wikidata, ${events.filter((e) => e.method === 'edgar').length} EDGAR, ${events.filter((e) => e.method === 'announcement').length} announcements, ${events.filter((e) => e.method === 'landscape-history').length} landscape maturity)`);
  return events;
}

// ======================================================================
// run the selected sources, then assemble signals.json from the caches
// ======================================================================
const started = Date.now();
if (selected('form-d')) await fetchFormD();
const announcements = selected('announcements') || flags.source === 'all' ? await fetchAnnouncements() : null;
if (selected('stars')) await fetchStars();
if (selected('hn')) await fetchHn();
if (selected('adoption')) await fetchAdoption();
if (selected('surveys')) await fetchSurveys();
const events = selected('events') ? await fetchEvents() : null;

// Assembly always runs from the cache so that signals.json reflects every source, whichever was refreshed.
flags.refresh = false;
const formD = await loadCache('form-d', { filings: [], review: [], datasets: {}, index: null, submissions: {} });
const starsOut = await (async () => { const saved = flags.refresh; flags.refresh = false; const dry = flags.dryRun; flags.dryRun = true; flags.quiet = true; const r = await fetchStars(); flags.dryRun = dry; flags.refresh = saved; flags.quiet = false; return r; })();
const hn = (await loadCache('hn', { vendors: {} })).vendors;
const adoption = await (async () => { const saved = flags.refresh; flags.refresh = false; const dry = flags.dryRun; flags.dryRun = true; flags.quiet = true; const r = await fetchAdoption(); flags.dryRun = dry; flags.refresh = saved; flags.quiet = false; return r; })();
const survey = await loadCache('stackoverflow', { years: {}, probes: {} });
const eventList = events ?? await (async () => { const saved = flags.refresh; flags.refresh = false; const dry = flags.dryRun; flags.dryRun = true; flags.quiet = true; const r = await fetchEvents(); flags.dryRun = dry; flags.refresh = saved; flags.quiet = false; return r; })();
const conferences = assembleConferences(await loadCache('conferences', null), landscape);
const announcementList = announcements ?? await (async () => { const saved = flags.refresh; flags.refresh = false; const dry = flags.dryRun; flags.dryRun = true; flags.quiet = true; const r = await fetchAnnouncements(); flags.dryRun = dry; flags.refresh = saved; flags.quiet = false; return r; })();

// Counting rule for Form D: an original filing counts its amount sold when the first sale is within a quarter of the window
// start or later; an amendment counts the increase over the previous filing in its chain when that filing is known (the
// increase happened between two in-window filings), and otherwise follows the same first-sale rule. amountSoldUsd always
// keeps the reported figure.
const COUNT_FROM = '2024-06-01';
const byAccession = new Map(formD.filings.map((f) => [f.accession, f]));
function countedAmount(f) {
  const sold = typeof f.amountSold === 'number' ? f.amountSold : null;
  if (sold === null) return { amount: null, note: f.amountSold === 'indefinite' ? 'amount sold reported as indefinite' : 'no amount sold reported' };
  const beforeWindow = f.saleDate && !f.yetToOccur && f.saleDate < COUNT_FROM;
  if (f.amendment) {
    const previous = f.previousAccession ? byAccession.get(f.previousAccession) : null;
    if (previous && typeof previous.amountSold === 'number') return { amount: Math.max(0, sold - previous.amountSold), note: `amendment; counted as the increase over ${previous.accession}` };
    if (beforeWindow) return { amount: null, note: `amendment restating an offering whose first sale (${f.saleDate}) predates the window and whose earlier filing is not in the loaded data; recorded but not counted` };
    return { amount: sold, note: 'amendment whose original filing is not in the loaded data; counted in full because the first sale is inside the window' };
  }
  if (beforeWindow) return { amount: null, note: `first sale ${f.saleDate} predates the window, so the amount is recorded but not counted` };
  return { amount: sold, note: null };
}
const vendors = {};
for (const vendor of landscape.vendors) {
  const funding = [];
  for (const f of formD.filings.filter((x) => x.vendor === vendor.id)) {
    if (!inWindow(f.filingDate)) continue;
    const counted = countedAmount(f);
    funding.push({ date: f.filingDate, quarter: quarterOf(f.filingDate), amountUsd: counted.amount, kind: 'form-d', round: null, confidence: f.confidence, source: f.source, issuer: f.issuer, cik: f.cik, accession: f.accession, amendment: f.amendment, offeringTotalUsd: f.offeringTotal, amountSoldUsd: typeof f.amountSold === 'number' ? f.amountSold : null, industryGroup: f.industryGroup, saleDate: f.saleDate, investors: f.investors, dataset: f.dataset, retrieved: f.retrieved, note: counted.note });
  }
  for (const a of announcementList.filter((x) => x.vendor === vendor.id && x.verified)) {
    const q = quarterOf(a.date);
    const near = funding.some((f) => f.kind === 'form-d' && f.amountUsd && Math.abs(Date.parse(f.date) - Date.parse(a.date)) < 120 * 86400000);
    funding.push({ date: a.date, quarter: q, amountUsd: near ? null : a.amountUsd, kind: 'announcement', round: a.round, confidence: 'vendor-stated', source: a.url, issuer: null, cik: null, accession: null, amendment: false, offeringTotalUsd: null, amountSoldUsd: a.amountUsd, industryGroup: null, saleDate: null, investors: null, dataset: null, retrieved: a.retrieved, note: near ? 'announcement within 120 days of a counted Form D filing by the same vendor; recorded for the round name but not counted again' : a.amountNote ?? 'amount as stated by the vendor; the page was fetched and the figure found on it' });
  }
  funding.sort((a, b) => a.date.localeCompare(b.date) || a.kind.localeCompare(b.kind));
  const s = starsOut[vendor.id];
  const stars = s?.stars ?? null;
  const adoptionEntries = [...(adoption[vendor.id] ?? [])];
  if (s?.prCreators && Object.values(s.prCreators).some((v) => v)) adoptionEntries.unshift({ source: 'ossinsight', package: s.repo, unit: 'new pull request creators', kind: 'series', byQuarter: s.prCreators, days: null, snapshot: null, url: s.prSource, retrieved: s.retrieved, note: 'Monthly count of first-time pull request authors from GH Archive events, summed per quarter' });
  const h = hn[vendor.id] ?? null;
  vendors[vendor.id] = {
    funding,
    stars,
    repoNote: s && !stars ? s.note : null,
    hnMentions: h ? { query: h.query, mode: h.mode, method: h.method ?? 'single-query', byQuarter: h.byQuarter, total: h.total, capped: h.capped, source: h.source, retrieved: h.retrieved, note: manual.hn.ambiguousKept[vendor.id] ?? (h.mode === 'domain' ? 'Common-word name; the query is the vendor domain, which undercounts' : null) } : null,
    hnSkipped: manual.hn.skip[vendor.id] ?? null,
    adoption: adoptionEntries,
    events: eventList.filter((e) => e.vendor === vendor.id).map(({ vendor: _v, ...rest }) => rest),
    conferences: conferences.byVendor[vendor.id] ?? [],
  };
}

// Attribution list: one entry per dataset actually used, with the credit line each license asks for.
const retrievedOf = (name) => name;
const attributions = [
  { dataset: 'Form D data sets', publisher: 'U.S. Securities and Exchange Commission', license: 'Public domain (U.S. government work)', licenseUrl: 'https://www.sec.gov/privacy#dissemination', url: FORM_D_INDEX, retrieved: formD.index?.retrieved ?? null, credit: 'Source: U.S. Securities and Exchange Commission, Form D data sets and EDGAR filings. Aggregated by quarter and by landscape category in this repository.', shareAlike: false },
  { dataset: 'EDGAR submissions API and filing documents', publisher: 'U.S. Securities and Exchange Commission', license: 'Public domain (U.S. government work)', licenseUrl: 'https://www.sec.gov/privacy#dissemination', url: 'https://www.sec.gov/search-filings/edgar-application-programming-interfaces', retrieved: Object.values(formD.submissions ?? {})[0]?.retrieved ?? null, credit: 'Source: U.S. Securities and Exchange Commission, EDGAR.', shareAlike: false },
  { dataset: 'OSS Insight API over GH Archive', publisher: 'PingCAP (OSS Insight); GH Archive by Ilya Grigorik', license: 'GH Archive: public GitHub event data; OSS Insight pipeline Apache-2.0; API for non-commercial use per its documentation', licenseUrl: 'https://ossinsight.io/docs/api', url: 'https://api.ossinsight.io/', retrieved: Object.values(starsOut).map((x) => x.retrieved).filter(Boolean).sort().at(-1) ?? null, credit: 'Stargazer and pull-request-creator histories from OSS Insight (https://ossinsight.io), built on GH Archive (https://www.gharchive.org). Figures were aggregated per quarter.', shareAlike: false },
  { dataset: 'GitHub REST API', publisher: 'GitHub', license: 'GitHub Terms of Service; factual repository metadata', licenseUrl: 'https://docs.github.com/en/site-policy/github-terms/github-terms-of-service', url: 'https://api.github.com/', retrieved: Object.values(starsOut).map((x) => x.stars?.retrieved).filter(Boolean).sort().at(-1) ?? null, credit: 'Repository metadata and, where OSS Insight had no history, starred_at timestamps from the GitHub REST API.', shareAlike: false },
  { dataset: 'Hacker News Search API', publisher: 'Algolia (index of Hacker News, Y Combinator)', license: 'Free API for Hacker News data per Algolia terms; story counts only are recorded', licenseUrl: 'https://hn.algolia.com/api', url: 'https://hn.algolia.com/api', retrieved: Object.values(hn).map((x) => x.retrieved).filter(Boolean).sort().at(-1) ?? null, credit: 'Story counts from the Hacker News Search API by Algolia (https://hn.algolia.com/api). Aggregated per quarter; no story text is redistributed.', shareAlike: false },
  { dataset: 'npm registry download counts', publisher: 'npm, Inc. (GitHub)', license: 'Public API; npm Terms of Use', licenseUrl: 'https://github.com/npm/registry/blob/main/docs/download-counts.md', url: 'https://api.npmjs.org/', retrieved: Object.values(adoption).flat().filter((e) => e.source === 'npm').map((e) => e.retrieved).sort().at(-1) ?? null, credit: 'Package download counts from the npm registry API. Summed per quarter.', shareAlike: false },
  { dataset: 'pypistats.org', publisher: 'pypistats.org (Christopher Flynn), from the PyPI BigQuery public dataset', license: 'MIT (pypistats code); PyPI download data is public', licenseUrl: 'https://github.com/crflynn/pypistats.org', url: 'https://pypistats.org/api/', retrieved: Object.values(adoption).flat().filter((e) => e.source === 'pypistats').map((e) => e.retrieved).sort().at(-1) ?? null, credit: 'PyPI download counts (without mirrors) from pypistats.org. Summed per quarter for the 180 days the API exposes.', shareAlike: false },
  { dataset: 'Homebrew analytics', publisher: 'Homebrew', license: 'BSD-2-Clause (Homebrew); analytics published openly at formulae.brew.sh', licenseUrl: 'https://docs.brew.sh/Analytics', url: 'https://formulae.brew.sh/analytics/', retrieved: Object.values(adoption).flat().filter((e) => e.source === 'homebrew').map((e) => e.retrieved).sort().at(-1) ?? null, credit: 'Install counts from Homebrew analytics (https://formulae.brew.sh/analytics/), rolling 30, 90, and 365 day windows on the retrieval date.', shareAlike: false },
  { dataset: 'Docker Hub repository metadata', publisher: 'Docker, Inc.', license: 'Public API; Docker Terms of Service', licenseUrl: 'https://docs.docker.com/docker-hub/api/latest/', url: 'https://hub.docker.com/v2/', retrieved: Object.values(adoption).flat().filter((e) => e.source === 'dockerhub').map((e) => e.retrieved).sort().at(-1) ?? null, credit: 'Lifetime pull counts from the Docker Hub API on the retrieval date.', shareAlike: false },
  { dataset: 'Stack Overflow Annual Developer Survey results (2024, 2025)', publisher: 'Stack Exchange Inc.', license: 'ODbL 1.0 (database), DbCL 1.0 (contents)', licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/', url: 'https://survey.stackoverflow.co/', retrieved: Object.values(survey.years).map((y) => y.retrieved).sort().at(-1) ?? null, credit: 'Contains information from the Stack Overflow Developer Survey, Stack Exchange Inc., which is made available here under the Open Database License (ODbL), https://opendatacommons.org/licenses/odbl/1-0/. Shares were computed from the public results files; figures were aggregated and transformed.', shareAlike: true },
  { dataset: 'Wikidata', publisher: 'Wikimedia Foundation and contributors', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', url: 'https://query.wikidata.org/', retrieved: eventList.find((e) => e.method === 'wikidata')?.retrieved ?? null, credit: 'Ownership, parent organization, official name, dissolution, headquarters, and source code repository statements from Wikidata (CC0).', shareAlike: false },
  { dataset: 'CNCF, LF AI and Data, and CD Foundation landscapes', publisher: 'The Linux Foundation and its foundations', license: 'Apache-2.0 (landscape data)', licenseUrl: 'https://github.com/cncf/landscape/blob/master/LICENSE', url: 'https://github.com/cncf/landscape', retrieved: eventList.find((e) => e.method === 'landscape-history')?.retrieved ?? null, credit: 'Project maturity levels from the landscape.yml files of the CNCF, LF AI and Data, and CD Foundation landscapes, compared between two commits.', shareAlike: false },
  { dataset: 'Vendor newsroom and blog posts', publisher: 'Each vendor', license: 'Each vendor\'s own terms; only the URL, date, and stated figure are recorded', licenseUrl: null, url: null, retrieved: announcementList.map((a) => a.retrieved).filter(Boolean).sort().at(-1) ?? null, credit: 'Funding rounds and corporate events as announced by each vendor on its own site; each record links the page it came from.', shareAlike: false },
  ...conferences.attributions,
];

const coverage = {
  vendors: landscape.vendors.length,
  withFunding: Object.values(vendors).filter((v) => v.funding.length).length,
  withCountedFunding: Object.values(vendors).filter((v) => v.funding.some((f) => f.amountUsd)).length,
  withFormD: Object.values(vendors).filter((v) => v.funding.some((f) => f.kind === 'form-d')).length,
  withAnnouncement: Object.values(vendors).filter((v) => v.funding.some((f) => f.kind === 'announcement')).length,
  withStars: Object.values(vendors).filter((v) => v.stars?.byQuarter).length,
  openSource: landscape.vendors.filter((v) => v.openSource).length,
  withHn: Object.values(vendors).filter((v) => v.hnMentions).length,
  withHnMentions: Object.values(vendors).filter((v) => v.hnMentions && v.hnMentions.total > 0).length,
  withAdoption: Object.values(vendors).filter((v) => v.adoption.length).length,
  withEvents: Object.values(vendors).filter((v) => v.events.length).length,
  withConferences: Object.values(vendors).filter((v) => v.conferences.length).length,
  withAnySignal: Object.values(vendors).filter((v) => v.funding.length || v.stars?.byQuarter || (v.hnMentions && v.hnMentions.total > 0) || v.adoption.length || v.events.length).length,
  formDFilings: Object.values(vendors).reduce((n, v) => n + v.funding.filter((f) => f.kind === 'form-d').length, 0),
  formDCandidatesReviewed: formD.review.length,
};

const methods = {
  formD: `SEC Form D covers exempt (mostly Regulation D) securities offerings by issuers that choose to file it. Quarterly data sets (${Object.keys(formD.datasets).join(', ')}) were parsed and primary issuers matched to vendors by normalized legal name (corporate suffixes and words such as Labs or Technologies removed) plus a short alias list; pooled investment funds were excluded; conflicting matches were held or rejected by hand and every decision is listed in lib/signals-manual.json. Confidence is exact when the issuer city equals the vendor's Wikidata headquarters, normalized when only the name matches, and manual for aliases and hand-accepted matches. For the current quarter, EDGAR submissions of the matched filers were read and each new Form D document parsed. Amounts are what the filing reports as sold, not what the company banked: many offerings are open-ended (indefinite), amounts include option exercises and secondary sales, and non-US companies appear only when a US entity files. Amendments count the increase over the previous filing in their chain when that filing is in the loaded data; other offerings whose first sale predates ${COUNT_FROM} are recorded but not counted. Form D says nothing about companies that rely on other exemptions or file late, so absence is not evidence of no funding.`,
  announcements: `For vendors outside Form D, a hand-picked list of vendor newsroom posts was fetched; a round is recorded only when the page answered and the stated amount appears in its text. Amounts are self-reported by the vendor. An announcement within 120 days of a counted Form D filing by the same vendor is recorded for its round name but not counted a second time. Amounts stated in other currencies are kept as text and not converted.`,
  stars: `For open-source vendors a GitHub repository was taken from the CNCF or LF AI landscape entry, from the Wikidata source code repository statement, from the vendor website, or from a hand list that the fetcher checks against the website. Monthly cumulative stargazer counts came from the OSS Insight API, which is built on the public GH Archive event stream, in one call per repository; quarterly gains are differences of the month-end cumulative counts. Where OSS Insight had no history the GitHub star API was paged with starred_at timestamps, skipping repositories above ${STAR_CAP} stars. OSS Insight's most recent months lag GH Archive ingestion and its latest month reconciles to the live total, so the last two quarters redistribute between themselves as the data catches up; treat them as provisional. Stars measure attention from developers, not deployments or revenue, and star campaigns and bots inflate some repositories.`,
  hnMentions: `Story counts per quarter from the Algolia Hacker News Search API, exact-phrase query on the vendor name matched against story titles and text (not URLs), stories only. Names that are common words use the vendor domain as the query instead (undercounting) or a custom phrase; a few ambiguous names were kept with a note, and two were skipped. Ten thousand hits per query was the paging cap. Mentions measure attention, including negative attention, not adoption.`,
  adoption: `Package series for vendors whose product maps to one package: npm registry daily downloads summed per quarter (two years), PyPI downloads without mirrors from pypistats.org (only the last 180 days are exposed, so the first covered quarter is partial), Homebrew install counts (rolling 30, 90, and 365 day snapshots), Docker Hub lifetime pull counts (a snapshot), and OSS Insight monthly first-time pull request creators summed per quarter. Downloads include CI systems, mirrors, and bots.`,
  surveys: `Stack Overflow Developer Survey public results for 2024 and 2025 (ODbL). Multi-select tool questions were mapped to landscape vendors in lib/signals-survey-mapping.json; a vendor's share is the share of respondents who answered the question and named it, and a category's share is the share who named any mapped vendor in that category, counting only the categories each question speaks to. Only the database question kept the same option list in both years; other questions changed and are reported without a year-over-year difference. The 2026 results were ${survey.probes?.['2026']?.status === 200 ? 'available but not yet mapped' : 'not published at retrieval time'}.`,
  events: `Acquisitions, parent changes, renames, and dissolutions from Wikidata statements whose start time falls in the window (year-precision dates are flagged), renames from EDGAR former names of matched Form D filers, maturity changes between the CNCF, LF AI and Data, and CD Foundation landscape files at the window start and at retrieval, and vendor announcements verified by fetching the page and finding the counterpart's name in it.`,
  conferences: conferences.method,
  aggregation: `Category and layer totals split each vendor's figure equally across its landscape categories so that a vendor in two categories is not counted twice; a layer total sums its categories. Every table in SIGNALS.md marks category totals that rest on one or two filings.`,
  shareAlike: `The Stack Overflow survey shares are the only share-alike (ODbL) input. They appear in signals-by-category.json under surveys and in the Survey trend table of SIGNALS.md, so that derived database is offered under ODbL 1.0 as well; every other figure in these files is under CC0 like the rest of the landscape.`,
  rejectedDatasets: manual.rejectedDatasets,
  kaggleCandidates: manual.kaggleCandidates,
};

// Survey shares per question, year, vendor, and category (share of respondents who answered the question).
const surveys = {
  survey: surveyMapping.survey, publisher: surveyMapping.publisher, license: surveyMapping.license, licenseUrl: surveyMapping.licenseUrl,
  years: Object.fromEntries(Object.entries(survey.years).map(([year, y]) => [year, { retrieved: y.retrieved, file: y.file, page: y.page, fielded: surveyMapping.years[year]?.fielded ?? null, respondents: y.respondents }])),
  questions: surveyMapping.questions.map((q) => ({
    id: q.id, label: q.label, comparable: q.comparable, note: q.note ?? null, columns: q.columns, categories: q.categories,
    results: Object.fromEntries(Object.entries(survey.years).filter(([year]) => q.columns[year] && survey.years[year].questions[q.id] && !survey.years[year].questions[q.id].missing).map(([year, y]) => {
      const r = y.questions[q.id];
      const share = (n) => Math.round((n / r.answered) * 10000) / 10000;
      return [year, { answered: r.answered, vendorShares: Object.fromEntries(Object.entries(r.vendorCounts).sort().map(([v, n]) => [v, share(n)])), categoryShares: Object.fromEntries(Object.entries(r.categoryCounts).sort().map(([c, n]) => [c, share(n)])), optionCounts: r.optionCounts, unmappedOptions: r.unmapped.sort() }];
    })),
  })),
};

const signals = {
  version: '1.0.0',
  generatedOn: today,
  license: 'CC0-1.0 for the signal data, except the Stack Overflow survey shares which stay under ODbL 1.0; each source keeps its own license (see attributions)',
  window: { start: WINDOW.start, end: WINDOW.end, quarters: QUARTERS },
  methods,
  attributions,
  coverage,
  surveys,
  conferences: conferences.block,
  vendors,
};
const out = JSON.stringify(signals, null, 1) + '\n';
if (out.includes(String.fromCharCode(8212))) throw new Error('signals.json must not contain em dashes');
await writeFile(join(root, 'signals.json'), out);
console.log(`signals.json written: ${coverage.withFunding} vendors with funding records (${coverage.formDFilings} Form D filings), ${coverage.withStars} with a star series, ${coverage.withHn} with Hacker News counts, ${coverage.withAdoption} with package data, ${coverage.withEvents} with events; ${coverage.withAnySignal} of ${coverage.vendors} have at least one signal.`);
console.log(`Requests by host (${Math.round((Date.now() - started) / 1000)} s total): ${Object.entries(stats).map(([h, s]) => `${h} ${s.requests} in ${Math.round(s.ms / 1000)} s${s.errors ? ` (${s.errors} errors)` : ''}`).join('; ') || 'none'}`);
