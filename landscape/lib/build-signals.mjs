#!/usr/bin/env node
// signals.json is the canonical market-signal file (written by fetch-signals.mjs). This script validates it against the
// landscape, aggregates per category and layer per quarter into signals-by-category.json, and writes SIGNALS.md.
//   node landscape/lib/build-signals.mjs          # validate and regenerate signals-by-category.json and SIGNALS.md
//   node landscape/lib/build-signals.mjs --check  # validate and fail if the generated files differ (used in CI)
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const root = join(directory, '..');
const argumentsList = process.argv.slice(2);
if (argumentsList.some((value) => value !== '--check') || argumentsList.length > 1) throw new Error('Usage: node landscape/lib/build-signals.mjs [--check]');
const checkOnly = argumentsList.includes('--check');
const rawSignals = await readFile(join(root, 'signals.json'), 'utf8');
const signals = JSON.parse(rawSignals);
const landscape = JSON.parse(await readFile(join(root, 'landscape.json'), 'utf8'));

// ---------- validation ----------
const EM_DASH = String.fromCharCode(8212);
function requireCondition(condition, message) { if (!condition) throw new Error(message); }
const shape = (value, keys, label) => {
  requireCondition(value && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
  requireCondition(Object.keys(value).join('|') === keys.join('|'), `${label}: keys must be exactly ${keys.join(', ')} in that order (got ${Object.keys(value).join(', ')})`);
};
const text = (value, label) => requireCondition(typeof value === 'string' && value.trim().length > 0, `${label}: expected nonempty text`);
const optionalText = (value, label) => requireCondition(value === null || (typeof value === 'string' && value.trim().length > 0), `${label}: expected text or null`);
const isoDate = (value, label) => requireCondition(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(value) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value), `${label}: expected ISO date (got ${value})`);
const https = (value, label) => { text(value, label); let url; try { url = new URL(value); } catch { throw new Error(`${label}: invalid URL ${value}`); } requireCondition(url.protocol === 'https:', `${label}: expected HTTPS (${value})`); };
const nonNegative = (value, label) => requireCondition(Number.isFinite(value) && value >= 0, `${label}: expected a non-negative number (got ${value})`);
const optionalNonNegative = (value, label) => { if (value !== null) nonNegative(value, label); };

requireCondition(!rawSignals.includes(EM_DASH), 'signals.json must not contain em dashes');
shape(signals, ['version', 'generatedOn', 'license', 'window', 'methods', 'attributions', 'coverage', 'surveys', 'conferences', 'vendors'], 'signals');
requireCondition(signals.version === '1.0.0', 'Unexpected version');
isoDate(signals.generatedOn, 'generatedOn');
text(signals.license, 'license');
shape(signals.window, ['start', 'end', 'quarters'], 'window');
isoDate(signals.window.start, 'window.start'); isoDate(signals.window.end, 'window.end');
requireCondition(signals.window.start < signals.window.end, 'window: start must precede end');
requireCondition(Array.isArray(signals.window.quarters) && signals.window.quarters.length > 0, 'window.quarters: expected array');
for (const q of signals.window.quarters) { shape(q, ['id', 'start', 'end', 'partial'], `quarter ${q.id}`); requireCondition(/^\d{4}-Q[1-4]$/u.test(q.id), `quarter id ${q.id}`); isoDate(q.start, `${q.id} start`); isoDate(q.end, `${q.id} end`); requireCondition(typeof q.partial === 'boolean', `${q.id} partial`); }
const QUARTERS = signals.window.quarters.map((q) => q.id);
const quarterOf = (date) => { const [y, m] = date.split('-').map(Number); return `${y}-Q${Math.ceil(m / 3)}`; };
const inWindow = (date) => date >= signals.window.start && date <= signals.window.end;
const byQuarterShape = (value, label, allowNull = true) => {
  shape(value, QUARTERS, label);
  for (const q of QUARTERS) requireCondition((allowNull && value[q] === null) || (Number.isFinite(value[q]) && value[q] >= 0), `${label}.${q}: expected non-negative number${allowNull ? ' or null' : ''}`);
};
shape(signals.methods, ['formD', 'announcements', 'stars', 'hnMentions', 'adoption', 'surveys', 'events', 'conferences', 'aggregation', 'shareAlike', 'rejectedDatasets', 'kaggleCandidates'], 'methods');
for (const key of ['formD', 'announcements', 'stars', 'hnMentions', 'adoption', 'surveys', 'events', 'conferences', 'aggregation', 'shareAlike']) text(signals.methods[key], `methods.${key}`);
for (const r of signals.methods.rejectedDatasets) { shape(r, ['dataset', 'reason'], 'rejected dataset'); text(r.dataset, 'rejected dataset'); text(r.reason, 'rejected reason'); }
for (const k of signals.methods.kaggleCandidates) { shape(k, ['title', 'url', 'license', 'note'], 'kaggle candidate'); https(k.url, `kaggle candidate ${k.title}`); }
requireCondition(Array.isArray(signals.attributions) && signals.attributions.length > 0, 'attributions: expected array');
for (const a of signals.attributions) { shape(a, ['dataset', 'publisher', 'license', 'licenseUrl', 'url', 'retrieved', 'credit', 'shareAlike'], `attribution ${a.dataset}`); text(a.dataset, 'attribution dataset'); text(a.publisher, `${a.dataset} publisher`); text(a.license, `${a.dataset} license`); if (a.licenseUrl !== null) https(a.licenseUrl, `${a.dataset} licenseUrl`); if (a.url !== null) https(a.url, `${a.dataset} url`); if (a.retrieved !== null) isoDate(a.retrieved, `${a.dataset} retrieved`); text(a.credit, `${a.dataset} credit`); requireCondition(typeof a.shareAlike === 'boolean', `${a.dataset} shareAlike`); }
requireCondition(signals.coverage && typeof signals.coverage === 'object' && Object.values(signals.coverage).every((v) => Number.isInteger(v) && v >= 0), 'coverage: expected integer counts');
shape(signals.surveys, ['survey', 'publisher', 'license', 'licenseUrl', 'years', 'questions'], 'surveys');
const categoryIds = new Set(landscape.categories.map((c) => c.id));
const vendorIds = landscape.vendors.map((v) => v.id);
const vendorSet = new Set(vendorIds);
for (const [year, y] of Object.entries(signals.surveys.years)) { shape(y, ['retrieved', 'file', 'page', 'fielded', 'respondents'], `survey year ${year}`); isoDate(y.retrieved, `survey ${year} retrieved`); https(y.file, `survey ${year} file`); nonNegative(y.respondents, `survey ${year} respondents`); }
for (const q of signals.surveys.questions) {
  shape(q, ['id', 'label', 'comparable', 'note', 'columns', 'categories', 'results'], `survey question ${q.id}`);
  for (const c of q.categories) requireCondition(categoryIds.has(c), `survey question ${q.id}: unknown category ${c}`);
  for (const [year, r] of Object.entries(q.results)) {
    shape(r, ['answered', 'vendorShares', 'categoryShares', 'optionCounts', 'unmappedOptions'], `survey ${q.id} ${year}`);
    for (const [v, share] of Object.entries(r.vendorShares)) { requireCondition(vendorSet.has(v), `survey ${q.id} ${year}: unknown vendor ${v}`); requireCondition(share >= 0 && share <= 1, `survey ${q.id} ${year} ${v}: share out of range`); }
    for (const [c, share] of Object.entries(r.categoryShares)) { requireCondition(categoryIds.has(c), `survey ${q.id} ${year}: unknown category ${c}`); requireCondition(share >= 0 && share <= 1, `survey ${q.id} ${year} ${c}: share out of range`); }
  }
}
// Conference presence: one record per directory page attempted, readable or refused; matches name landscape vendors.
shape(signals.conferences, ['userAgent', 'retrieved', 'events'], 'conferences');
text(signals.conferences.userAgent, 'conferences.userAgent');
if (signals.conferences.retrieved !== null) isoDate(signals.conferences.retrieved, 'conferences.retrieved');
const CONFERENCE_EVENT_KEYS = ['id', 'event', 'year', 'list', 'url', 'robotsUrl', 'robotsStatus', 'robotsRule', 'status', 'finalUrl', 'retrieved', 'sha256', 'exhibitorCount', 'matched', 'unmatchedCount', 'unmatched', 'refused', 'note'];
const CONFERENCE_LISTS = ['exhibitors', 'sponsors', 'vendors', 'villages'];
const CONFERENCE_CONFIDENCE = ['domain-and-name', 'domain', 'name'];
const CONFERENCE_VENDOR_KEYS = ['event', 'year', 'list', 'url', 'confidence'];
const webUrl = (value, label) => requireCondition(value === null || (typeof value === 'string' && /^https?:\/\/\S+$/u.test(value)), `${label}: expected an http(s) URL or null`);
requireCondition(Array.isArray(signals.conferences.events), 'conferences.events: expected array');
requireCondition(new Set(signals.conferences.events.map((e) => e.id)).size === signals.conferences.events.length, 'conferences.events: ids must be unique');
for (const e of signals.conferences.events) {
  const el = `conference ${e.id}`;
  shape(e, CONFERENCE_EVENT_KEYS, el); text(e.id, `${el}.id`); text(e.event, `${el}.event`);
  requireCondition(Number.isInteger(e.year) && e.year >= 2024 && e.year <= 2027, `${el}.year`); requireCondition(CONFERENCE_LISTS.includes(e.list), `${el}.list ${e.list}`);
  https(e.url, `${el}.url`); https(e.robotsUrl, `${el}.robotsUrl`);
  requireCondition(e.robotsStatus === null || Number.isInteger(e.robotsStatus), `${el}.robotsStatus`); optionalText(e.robotsRule, `${el}.robotsRule`);
  requireCondition(e.status === null || Number.isInteger(e.status), `${el}.status`); webUrl(e.finalUrl, `${el}.finalUrl`);
  if (e.retrieved !== null) isoDate(e.retrieved, `${el}.retrieved`); requireCondition(e.sha256 === null || /^[0-9a-f]{64}$/u.test(e.sha256), `${el}.sha256`);
  optionalText(e.refused, `${el}.refused`); optionalText(e.note, `${el}.note`);
  requireCondition(Array.isArray(e.matched) && Array.isArray(e.unmatched), `${el}: matched and unmatched must be arrays`);
  if (e.refused !== null) requireCondition(e.exhibitorCount === null && e.unmatchedCount === null && e.matched.length === 0 && e.unmatched.length === 0, `${el}: a refused page carries no entries`);
  else {
    requireCondition(e.status === 200 && e.retrieved !== null && e.sha256 !== null, `${el}: a readable page needs status 200, a retrieval date, and a hash`);
    requireCondition(Number.isInteger(e.exhibitorCount) && e.exhibitorCount >= 0 && Number.isInteger(e.unmatchedCount) && e.matched.length + e.unmatchedCount === e.exhibitorCount && e.unmatched.length === e.unmatchedCount, `${el}: matched plus unmatched must equal the listed count`);
    for (const [i, m] of e.matched.entries()) { const ml = `${el}.matched[${i}]`; shape(m, ['vendor', 'name', 'website', 'confidence'], ml); requireCondition(vendorSet.has(m.vendor), `${ml}: unknown vendor ${m.vendor}`); text(m.name, `${ml}.name`); webUrl(m.website, `${ml}.website`); requireCondition(CONFERENCE_CONFIDENCE.includes(m.confidence), `${ml}.confidence ${m.confidence}`); }
    for (const [i, u] of e.unmatched.entries()) { const ul = `${el}.unmatched[${i}]`; shape(u, ['name', 'website', 'reason', 'nearMisses'], ul); text(u.name, `${ul}.name`); webUrl(u.website, `${ul}.website`); optionalText(u.reason, `${ul}.reason`); requireCondition(Array.isArray(u.nearMisses) && u.nearMisses.every((id) => vendorSet.has(id)), `${ul}.nearMisses`); }
  }
}
const FUNDING_KEYS = ['date', 'quarter', 'amountUsd', 'kind', 'round', 'confidence', 'source', 'issuer', 'cik', 'accession', 'amendment', 'offeringTotalUsd', 'amountSoldUsd', 'industryGroup', 'saleDate', 'investors', 'dataset', 'retrieved', 'note'];
const KINDS = ['form-d', 'announcement', 'wikidata'];
const CONFIDENCE = ['exact', 'normalized', 'manual', 'vendor-stated'];
const STARS_KEYS = ['repo', 'url', 'discovery', 'discoverySource', 'method', 'byQuarter', 'latestMonth', 'currentStars', 'capped', 'source', 'retrieved', 'note'];
const DISCOVERY = ['manual', 'website-link', 'cncf-landscape', 'wikidata', 'website'];
const STAR_METHODS = ['ossinsight', 'github-star-api', 'none'];
const HN_KEYS = ['query', 'mode', 'method', 'byQuarter', 'total', 'capped', 'source', 'retrieved', 'note'];
const ADOPTION_KEYS = ['source', 'package', 'unit', 'kind', 'byQuarter', 'days', 'snapshot', 'url', 'retrieved', 'note'];
const ADOPTION_SOURCES = ['ossinsight', 'npm', 'pypistats', 'homebrew', 'dockerhub'];
const EVENT_KEYS = ['date', 'type', 'detail', 'source', 'retrieved', 'method'];
const EVENT_TYPES = ['acquired', 'shut-down', 'renamed', 'parent-changed', 'listed', 'maturity-changed'];
requireCondition(Object.keys(signals.vendors).join('|') === vendorIds.join('|'), 'vendors: keys must be exactly the landscape vendor ids in landscape order');
for (const [id, v] of Object.entries(signals.vendors)) {
  const label = `vendor ${id}`;
  shape(v, ['funding', 'stars', 'repoNote', 'hnMentions', 'hnSkipped', 'adoption', 'events', 'conferences'], label);
  requireCondition(Array.isArray(v.funding), `${label}.funding: expected array`);
  for (const [i, f] of v.funding.entries()) {
    const fl = `${label}.funding[${i}]`;
    shape(f, FUNDING_KEYS, fl);
    isoDate(f.date, `${fl}.date`); requireCondition(inWindow(f.date), `${fl}: date ${f.date} outside the window`);
    requireCondition(f.quarter === quarterOf(f.date) && QUARTERS.includes(f.quarter), `${fl}: quarter ${f.quarter} does not match ${f.date}`);
    optionalNonNegative(f.amountUsd, `${fl}.amountUsd`); optionalNonNegative(f.amountSoldUsd, `${fl}.amountSoldUsd`);
    requireCondition(f.offeringTotalUsd === null || f.offeringTotalUsd === 'indefinite' || (Number.isFinite(f.offeringTotalUsd) && f.offeringTotalUsd >= 0), `${fl}.offeringTotalUsd`);
    requireCondition(KINDS.includes(f.kind), `${fl}: unknown kind ${f.kind}`);
    requireCondition(CONFIDENCE.includes(f.confidence), `${fl}: unknown confidence ${f.confidence}`);
    https(f.source, `${fl}.source`); if (f.dataset !== null) https(f.dataset, `${fl}.dataset`);
    requireCondition(typeof f.amendment === 'boolean', `${fl}.amendment`);
    if (f.kind === 'form-d') { text(f.issuer, `${fl}.issuer`); requireCondition(/^\d{10}$/u.test(f.cik), `${fl}.cik`); text(f.accession, `${fl}.accession`); requireCondition(f.round === null, `${fl}: Form D records carry no round name`); }
    else { requireCondition(f.issuer === null && f.cik === null && f.accession === null, `${fl}: announcement records carry no issuer`); optionalText(f.round, `${fl}.round`); }
    if (f.saleDate !== null) isoDate(f.saleDate, `${fl}.saleDate`);
    requireCondition(f.investors === null || (Number.isInteger(f.investors) && f.investors >= 0), `${fl}.investors`);
    isoDate(f.retrieved, `${fl}.retrieved`); optionalText(f.note, `${fl}.note`);
    if (f.amountUsd !== null && f.kind === 'form-d') requireCondition(f.amountSoldUsd !== null && f.amountUsd <= f.amountSoldUsd + 1, `${fl}: counted amount exceeds amount sold`);
  }
  if (v.stars !== null) {
    const sl = `${label}.stars`;
    shape(v.stars, STARS_KEYS, sl);
    requireCondition(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(v.stars.repo), `${sl}.repo`);
    https(v.stars.url, `${sl}.url`); requireCondition(DISCOVERY.includes(v.stars.discovery), `${sl}.discovery ${v.stars.discovery}`); if (v.stars.discoverySource !== null) https(v.stars.discoverySource, `${sl}.discoverySource`);
    requireCondition(STAR_METHODS.includes(v.stars.method), `${sl}.method`);
    if (v.stars.byQuarter !== null) byQuarterShape(v.stars.byQuarter, `${sl}.byQuarter`); else requireCondition(v.stars.capped, `${sl}: byQuarter may be null only when capped`);
    requireCondition(typeof v.stars.capped === 'boolean', `${sl}.capped`); optionalNonNegative(v.stars.currentStars, `${sl}.currentStars`); https(v.stars.source, `${sl}.source`); isoDate(v.stars.retrieved, `${sl}.retrieved`);
  }
  optionalText(v.repoNote, `${label}.repoNote`);
  if (v.hnMentions !== null) {
    const hl = `${label}.hnMentions`;
    shape(v.hnMentions, HN_KEYS, hl);
    text(v.hnMentions.query, `${hl}.query`); requireCondition(['name', 'domain', 'custom'].includes(v.hnMentions.mode), `${hl}.mode`); requireCondition(['single-query', 'per-quarter-counts'].includes(v.hnMentions.method), `${hl}.method`);
    byQuarterShape(v.hnMentions.byQuarter, `${hl}.byQuarter`); nonNegative(v.hnMentions.total, `${hl}.total`); requireCondition(typeof v.hnMentions.capped === 'boolean', `${hl}.capped`); https(v.hnMentions.source, `${hl}.source`); isoDate(v.hnMentions.retrieved, `${hl}.retrieved`); optionalText(v.hnMentions.note, `${hl}.note`);
  }
  optionalText(v.hnSkipped, `${label}.hnSkipped`);
  requireCondition(v.hnMentions !== null || v.hnSkipped !== null, `${label}: every vendor has Hacker News counts or a skip reason`);
  requireCondition(Array.isArray(v.adoption), `${label}.adoption`);
  for (const [i, a] of v.adoption.entries()) {
    const al = `${label}.adoption[${i}]`;
    shape(a, ADOPTION_KEYS, al);
    requireCondition(ADOPTION_SOURCES.includes(a.source), `${al}.source ${a.source}`); text(a.package, `${al}.package`); text(a.unit, `${al}.unit`);
    requireCondition(['series', 'snapshot'].includes(a.kind), `${al}.kind`);
    if (a.kind === 'series') { requireCondition(a.byQuarter && typeof a.byQuarter === 'object', `${al}.byQuarter`); for (const [q, n] of Object.entries(a.byQuarter)) { requireCondition(QUARTERS.includes(q), `${al}.byQuarter: unknown quarter ${q}`); optionalNonNegative(n, `${al}.byQuarter.${q}`); } requireCondition(a.snapshot === null, `${al}: series carries no snapshot`); }
    else { requireCondition(a.byQuarter === null && a.snapshot && typeof a.snapshot === 'object', `${al}: snapshot shape`); }
    https(a.url, `${al}.url`); isoDate(a.retrieved, `${al}.retrieved`); optionalText(a.note, `${al}.note`);
  }
  requireCondition(Array.isArray(v.events), `${label}.events`);
  for (const [i, e] of v.events.entries()) {
    const el = `${label}.events[${i}]`;
    shape(e, EVENT_KEYS, el);
    isoDate(e.date, `${el}.date`); requireCondition(e.date >= signals.window.start && e.date <= signals.generatedOn, `${el}: date ${e.date} outside the window`);
    requireCondition(EVENT_TYPES.includes(e.type), `${el}: unknown type ${e.type}`); text(e.detail, `${el}.detail`); https(e.source, `${el}.source`); isoDate(e.retrieved, `${el}.retrieved`);
    requireCondition(['wikidata', 'edgar', 'announcement', 'landscape-history'].includes(e.method), `${el}.method`);
  }
  requireCondition(Array.isArray(v.conferences), `${label}.conferences: expected array`);
  for (const [i, c] of v.conferences.entries()) {
    const cl = `${label}.conferences[${i}]`;
    shape(c, CONFERENCE_VENDOR_KEYS, cl); text(c.event, `${cl}.event`); requireCondition(Number.isInteger(c.year), `${cl}.year`); requireCondition(CONFERENCE_LISTS.includes(c.list), `${cl}.list`); https(c.url, `${cl}.url`); requireCondition(CONFERENCE_CONFIDENCE.includes(c.confidence), `${cl}.confidence`);
    requireCondition(signals.conferences.events.some((e) => e.event === c.event && e.year === c.year && e.list === c.list && e.url === c.url && e.matched.some((m) => m.vendor === id && m.confidence === c.confidence)), `${cl}: no matching entry in the conferences block`);
  }
}
for (const e of signals.conferences.events) for (const m of e.matched) requireCondition(signals.vendors[m.vendor].conferences.some((c) => c.url === e.url && c.year === e.year), `conference ${e.id}: ${m.vendor} matched but its vendor record does not list the event`);

// ---------- aggregation ----------
const layerById = new Map(landscape.layers.map((l) => [l.id, l]));
const categoryById = new Map(landscape.categories.map((c) => [c.id, c]));
const vendorById = new Map(landscape.vendors.map((v) => [v.id, v]));
const zeroQuarters = () => Object.fromEntries(QUARTERS.map((q) => [q, 0]));
const add = (target, quarter, value) => { if (value === null || value === undefined) return; target[quarter] = (target[quarter] ?? 0) + value; };
const round = (n, digits = 0) => { const f = 10 ** digits; return Math.round(n * f) / f; };
const roundAll = (obj, digits = 0) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, round(v, digits)]));
const sumValues = (obj) => Object.values(obj).reduce((n, v) => n + (v ?? 0), 0);
const byName = (a, b) => a.name.localeCompare(b.name, 'en');
const fullQuarters = QUARTERS.filter((q) => !signals.window.quarters.find((x) => x.id === q).partial);
const FIRST_HALF = fullQuarters.slice(0, 3), SECOND_HALF = fullQuarters.slice(-3);
const half = (byQuarter, quarters) => quarters.reduce((n, q) => n + (byQuarter?.[q] ?? 0), 0);

const categories = {};
for (const category of landscape.categories) {
  const vendors = landscape.vendors.filter((v) => v.categories.includes(category.id));
  const capital = zeroQuarters(), stars = zeroQuarters(), hn = zeroQuarters(), prCreators = zeroQuarters(), npm = zeroQuarters(), pypi = zeroQuarters();
  const capitalByVendor = {}, starsByVendor = {}, hnByVendor = {};
  let countedFilings = 0, starVendors = 0, hnVendors = 0, npmPackages = 0, pypiPackages = 0, prVendors = 0;
  const fundedVendors = new Set(), fundingRecords = [];
  for (const vendor of vendors) {
    const s = signals.vendors[vendor.id];
    const w = 1 / vendor.categories.length;
    for (const f of s.funding) {
      if (f.amountUsd === null || f.amountUsd === 0) continue;
      add(capital, f.quarter, f.amountUsd * w); capitalByVendor[vendor.id] = (capitalByVendor[vendor.id] ?? 0) + f.amountUsd * w; countedFilings += 1; fundedVendors.add(vendor.id);
      fundingRecords.push({ vendor: vendor.id, date: f.date, quarter: f.quarter, amountUsd: f.amountUsd, kind: f.kind, confidence: f.confidence, source: f.source });
    }
    if (s.stars?.byQuarter) { starVendors += 1; for (const q of QUARTERS) add(stars, q, (s.stars.byQuarter[q] ?? 0) * w); starsByVendor[vendor.id] = sumValues(s.stars.byQuarter); }
    if (s.hnMentions) { hnVendors += 1; for (const q of QUARTERS) add(hn, q, (s.hnMentions.byQuarter[q] ?? 0) * w); hnByVendor[vendor.id] = s.hnMentions.total; }
    for (const a of s.adoption) {
      if (a.kind !== 'series') continue;
      const target = a.source === 'ossinsight' ? prCreators : a.source === 'npm' ? npm : a.source === 'pypistats' ? pypi : null;
      if (!target) continue;
      if (a.source === 'npm') npmPackages += 1; if (a.source === 'pypistats') pypiPackages += 1; if (a.source === 'ossinsight') prVendors += 1;
      for (const [q, n] of Object.entries(a.byQuarter)) add(target, q, n * w);
    }
  }
  const capitalTotal = sumValues(capital);
  const topVendor = Object.entries(capitalByVendor).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ?? null;
  const surveys = [];
  for (const q of signals.surveys.questions) for (const [year, r] of Object.entries(q.results)) {
    if (!(category.id in r.categoryShares)) continue;
    const vendorShares = Object.fromEntries(Object.entries(r.vendorShares).filter(([v]) => vendorById.get(v).categories.includes(category.id) && q.categories.includes(category.id)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
    surveys.push({ survey: signals.surveys.survey, question: q.id, label: q.label, year: Number(year), share: r.categoryShares[category.id], answered: r.answered, comparable: q.comparable, vendors: vendorShares, mapping: `Share of respondents who answered the ${q.columns[year]} question and named at least one landscape vendor in this category (${Object.keys(vendorShares).length} mapped); ${q.note ?? 'same option list in both years'}`, source: signals.surveys.years[year].page, license: signals.surveys.license });
  }
  categories[category.id] = {
    id: category.id, name: category.name, layer: category.layer, vendorCount: vendors.length,
    capitalUsd: roundAll(capital), capitalTotalUsd: round(capitalTotal), countedFilings, fundedVendors: [...fundedVendors].sort(),
    topFundedVendor: topVendor ? { id: topVendor[0], shareOfCategory: round(topVendor[1] / capitalTotal, 3) } : null,
    concentration: countedFilings === 0 ? null : countedFilings === 1 ? 'rests on one filing' : countedFilings === 2 ? 'rests on two filings' : topVendor && topVendor[1] / capitalTotal > 0.8 ? 'one vendor is more than 80 percent of the total' : null,
    fundingRecords: fundingRecords.sort((a, b) => a.date.localeCompare(b.date) || a.vendor.localeCompare(b.vendor)),
    starsGained: roundAll(stars), starsGainedTotal: round(sumValues(stars)), starVendors, topStarVendor: Object.entries(starsByVendor).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null,
    hnMentions: roundAll(hn), hnMentionsTotal: round(sumValues(hn)), hnVendors, hnFirstHalf: round(half(hn, FIRST_HALF)), hnSecondHalf: round(half(hn, SECOND_HALF)), topHnVendor: Object.entries(hnByVendor).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null,
    pullRequestCreators: roundAll(prCreators), pullRequestCreatorVendors: prVendors,
    npmDownloads: roundAll(npm), npmPackages, pypiDownloads: roundAll(pypi), pypiPackages,
    surveys,
  };
}
const layers = {};
for (const layer of landscape.layers) {
  const cats = landscape.categories.filter((c) => c.layer === layer.id).map((c) => categories[c.id]);
  const sum = (key) => { const out = zeroQuarters(); for (const c of cats) for (const q of QUARTERS) add(out, q, c[key][q]); return roundAll(out); };
  const ids = new Set(cats.map((c) => c.id));
  const layerVendors = landscape.vendors.filter((v) => v.categories.some((c) => ids.has(c)));
  const records = new Set(layerVendors.flatMap((v) => signals.vendors[v.id].funding.filter((f) => f.amountUsd).map((f) => `${v.id}|${f.date}|${f.source}`)));
  layers[layer.id] = { id: layer.id, name: layer.name, categoryCount: cats.length, vendorCount: layerVendors.length, capitalUsd: sum('capitalUsd'), capitalTotalUsd: round(cats.reduce((n, c) => n + c.capitalTotalUsd, 0)), countedFilings: records.size, fundedVendors: layerVendors.filter((v) => signals.vendors[v.id].funding.some((f) => f.amountUsd)).length, starsGained: sum('starsGained'), starVendors: layerVendors.filter((v) => signals.vendors[v.id].stars?.byQuarter).length, hnMentions: sum('hnMentions'), npmDownloads: sum('npmDownloads') };
}
// Conference presence per category: a vendor in two categories counts toward both; the share of the floor is the matched
// vendors in the category over every entry the page lists, so a floor with no map vendor reads as zero, not missing.
const conferencePages = signals.conferences.events.filter((e) => e.refused === null);
const conferenceYears = [...new Set(conferencePages.map((e) => e.year))].sort();
for (const c of Object.values(categories)) {
  const inCategory = new Set(landscape.vendors.filter((v) => v.categories.includes(c.id)).map((v) => v.id));
  c.conferences = conferencePages.map((e) => { const ids = [...new Set(e.matched.map((m) => m.vendor).filter((id) => inCategory.has(id)))].sort(); return { id: e.id, event: e.event, year: e.year, list: e.list, url: e.url, listed: e.exhibitorCount, exhibitors: ids.length, shareOfFloor: e.exhibitorCount ? round(ids.length / e.exhibitorCount, 4) : null, vendors: ids }; });
  c.conferencesByYear = Object.fromEntries(conferenceYears.map((y) => { const pages = c.conferences.filter((x) => x.year === y); const ids = new Set(pages.flatMap((x) => x.vendors)); const listed = pages.reduce((n, x) => n + x.listed, 0); return [String(y), { pages: pages.length, listed, exhibitors: ids.size, shareOfFloor: listed ? round(ids.size / listed, 4) : null }]; }));
  const ys = conferenceYears.map(String);
  c.conferencesChange = ys.length >= 2 ? { from: ys.at(-2), to: ys.at(-1), exhibitors: c.conferencesByYear[ys.at(-1)].exhibitors - c.conferencesByYear[ys.at(-2)].exhibitors, shareOfFloor: round((c.conferencesByYear[ys.at(-1)].shareOfFloor ?? 0) - (c.conferencesByYear[ys.at(-2)].shareOfFloor ?? 0), 4) } : null;
}
const conferenceSummary = {
  retrieved: signals.conferences.retrieved,
  years: conferenceYears,
  readable: conferencePages.map((e) => ({ id: e.id, event: e.event, year: e.year, list: e.list, url: e.url, retrieved: e.retrieved, listed: e.exhibitorCount, matched: [...new Set(e.matched.map((m) => m.vendor))].sort() })),
  refused: signals.conferences.events.filter((e) => e.refused !== null).map((e) => ({ id: e.id, event: e.event, year: e.year, list: e.list, url: e.url, robotsUrl: e.robotsUrl, robotsStatus: e.robotsStatus, status: e.status, retrieved: e.retrieved, reason: e.refused, note: e.note })),
  vendorsWithPresence: Object.values(signals.vendors).filter((v) => v.conferences.length).length,
  categoriesWithPresence: Object.values(categories).filter((c) => c.conferences.some((x) => x.exhibitors > 0)).length,
};
const blindSpots = landscape.categories.filter((c) => categories[c.id].countedFilings === 0 && categories[c.id].starVendors === 0).map((c) => c.id);
const byCategory = {
  version: signals.version, generatedOn: signals.generatedOn, license: signals.license,
  window: signals.window, halves: { first: FIRST_HALF, second: SECOND_HALF },
  note: signals.methods.aggregation,
  coverage: { ...signals.coverage, categoriesWithFunding: Object.values(categories).filter((c) => c.countedFilings > 0).length, categoriesWithStars: Object.values(categories).filter((c) => c.starVendors > 0).length, categoriesWithSurveyShare: Object.values(categories).filter((c) => c.surveys.length > 0).length, blindSpots },
  conferences: conferenceSummary,
  layers, categories,
};

// ---------- SIGNALS.md ----------
const usdM = (n) => (n / 1e6).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const int = (n) => Math.round(n).toLocaleString('en-US');
const pct = (share) => `${(share * 100).toFixed(1)}%`;
const link = (name, url) => `[${name}](${url})`;
const vendorName = (id) => vendorById.get(id).name;
const catName = (id) => categoryById.get(id).name;
const layerName = (id) => layerById.get(id).name;
const partialMark = (q) => (signals.window.quarters.find((x) => x.id === q).partial ? '*' : '');
const numericCell = (cell) => /^[+-]?[\d,.]+%?( pp)?$/u.test(cell);
const table = (header, rows) => [`| ${header.join(' | ')} |`, `|${header.map((h, i) => (i > 0 && rows.some((r) => r[i] !== '') && rows.every((r) => r[i] === '' || numericCell(r[i])) ? '---:' : '---')).join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
const top = (list, key, n = 15) => [...list].filter((c) => c[key] > 0).sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name)).slice(0, n);
const catList = Object.values(categories);
const lines = [];
lines.push('# Market signals', '', `Where capital and attention went across the technology landscape between ${signals.window.start} and ${signals.window.end}, by quarter, category, and layer. Generated from [signals.json](signals.json) by \`lib/build-signals.mjs\` on ${signals.generatedOn}; the per-category numbers are in [signals-by-category.json](signals-by-category.json). Quarters marked * are partial (${signals.window.quarters.filter((q) => q.partial).map((q) => `${q.id}: ${q.start} to ${q.end}`).join('; ')}).`, '');
lines.push('Read this with the limits in mind: Form D amounts are what issuers reported as sold in exempt offerings, not what companies banked, and only US filers appear; announcements are self-reported; stars, downloads, and Hacker News stories measure attention, not revenue. Nothing here is a valuation or a market share. Category totals split each vendor equally across its categories, and every table marks a total that rests on one or two filings.', '');
lines.push('## Capital raised per layer per quarter', '', 'USD millions counted from Form D filings and verified announcements (see Methods for the counting rule). Filings is the number of counted records; vendors is how many distinct vendors they belong to.', '');
lines.push(table(['Layer', ...QUARTERS.map((q) => `${q}${partialMark(q)}`), 'Total', 'Filings', 'Vendors'], landscape.layers.map((l) => { const L = layers[l.id]; return [link(l.name, `vault/Layers/${l.name}.md`), ...QUARTERS.map((q) => usdM(L.capitalUsd[q])), usdM(L.capitalTotalUsd), String(L.countedFilings), String(L.fundedVendors)]; })), '');
const totalRow = QUARTERS.map((q) => Object.values(layers).reduce((n, L) => n + L.capitalUsd[q], 0));
lines.push(`All layers: ${totalRow.map((v, i) => `${QUARTERS[i]}${partialMark(QUARTERS[i])} ${usdM(v)}`).join('; ')}; total ${usdM(totalRow.reduce((a, b) => a + b, 0))} across ${signals.coverage.formDFilings} Form D filings and ${Object.values(signals.vendors).reduce((n, v) => n + v.funding.filter((f) => f.kind === 'announcement' && f.amountUsd).length, 0)} counted announcements.`, '');
lines.push('## Top fifteen categories by two-year capital', '', 'Concentration says when a total rests on one or two filings or on a single vendor.', '');
lines.push(table(['Category', 'Layer', 'USD m', 'Filings', 'Vendors', 'Largest vendor', 'Concentration'], top(catList, 'capitalTotalUsd').map((c) => [link(c.name, `vault/Categories/${c.name}.md`), layerName(c.layer), usdM(c.capitalTotalUsd), String(c.countedFilings), String(c.fundedVendors.length), c.topFundedVendor ? `${vendorName(c.topFundedVendor.id)} (${pct(c.topFundedVendor.shareOfCategory)})` : '', c.concentration ?? ''])), '');
lines.push('## Top fifteen categories by star growth', '', 'GitHub stars gained by the open-source vendors in each category over the window (OSS Insight over GH Archive; GitHub star API where OSS Insight had no history). Repos is the number of vendors with a star series in the category.', '');
lines.push(table(['Category', 'Layer', 'Stars gained', 'Repos', ...QUARTERS.map((q) => `${q}${partialMark(q)}`), 'Largest gainer'], top(catList, 'starsGainedTotal').map((c) => [link(c.name, `vault/Categories/${c.name}.md`), layerName(c.layer), int(c.starsGainedTotal), String(c.starVendors), ...QUARTERS.map((q) => int(c.starsGained[q])), c.topStarVendor ? vendorName(c.topStarVendor) : ''])), '');
lines.push('## Top fifteen categories by Hacker News attention growth', '', `Stories on Hacker News that name a vendor in the category, comparing the first three full quarters (${FIRST_HALF.join(', ')}) with the last three full quarters (${SECOND_HALF.join(', ')}). Common-word vendor names were queried by domain and undercount; see Methods.`, '');
const hnGrowth = catList.map((c) => ({ ...c, hnDelta: c.hnSecondHalf - c.hnFirstHalf })).filter((c) => c.hnSecondHalf > 0);
lines.push(table(['Category', 'Layer', 'First half', 'Second half', 'Change', 'Vendors', 'Most mentioned'], [...hnGrowth].sort((a, b) => b.hnDelta - a.hnDelta || a.name.localeCompare(b.name)).slice(0, 15).map((c) => [link(c.name, `vault/Categories/${c.name}.md`), layerName(c.layer), int(c.hnFirstHalf), int(c.hnSecondHalf), `${c.hnDelta >= 0 ? '+' : ''}${int(c.hnDelta)}`, String(c.hnVendors), c.topHnVendor ? vendorName(c.topHnVendor) : ''])), '');
lines.push('## Where adoption grew', '', `Two views of adoption: stars gained (above) and npm registry downloads for the categories whose vendors map to an npm package, comparing the same two halves. Download counts include CI systems and bots. PyPI is not shown because pypistats.org exposes only the last 180 days.`, '');
const npmGrowth = catList.filter((c) => c.npmPackages > 0).map((c) => ({ ...c, npmFirst: half(c.npmDownloads, FIRST_HALF), npmSecond: half(c.npmDownloads, SECOND_HALF) })).filter((c) => c.npmFirst > 0).map((c) => ({ ...c, npmChange: c.npmSecond / c.npmFirst - 1 }));
lines.push(table(['Category', 'Layer', 'npm packages', 'Downloads first half', 'Downloads second half', 'Change', 'Stars gained'], [...npmGrowth].sort((a, b) => b.npmChange - a.npmChange || a.name.localeCompare(b.name)).slice(0, 15).map((c) => [link(c.name, `vault/Categories/${c.name}.md`), layerName(c.layer), String(c.npmPackages), int(c.npmFirst), int(c.npmSecond), `${c.npmChange >= 0 ? '+' : ''}${(c.npmChange * 100).toFixed(0)}%`, int(c.starsGainedTotal)])), '');
lines.push('## Survey trend', '', `${signals.surveys.survey} (${signals.surveys.publisher}, ${signals.surveys.license}): share of respondents who answered a tool question and named at least one landscape vendor in the category. Only questions with the same option list in both years are differenced; the others are shown per year because the survey changed the question.`, '');
const surveyRows = [];
for (const c of catList) {
  const byQuestion = new Map();
  for (const s of c.surveys) (byQuestion.get(s.question) ?? byQuestion.set(s.question, []).get(s.question)).push(s);
  for (const [question, list] of byQuestion) {
    const y24 = list.find((s) => s.year === 2024), y25 = list.find((s) => s.year === 2025);
    const comparable = list[0].comparable;
    const latest = y25 ?? y24;
    const topVendors = Object.entries(latest.vendors).slice(0, 3).map(([v, share]) => `${vendorName(v)} ${pct(share)}`).join(', ');
    surveyRows.push({ sort: latest.share, row: [link(c.name, `vault/Categories/${c.name}.md`), question, y24 ? pct(y24.share) : '', y25 ? pct(y25.share) : '', comparable && y24 && y25 ? `${y25.share - y24.share >= 0 ? '+' : ''}${((y25.share - y24.share) * 100).toFixed(1)} pp` : 'question changed', topVendors] });
  }
}
lines.push(table(['Category', 'Question', '2024', '2025', 'Change', 'Leading vendors (latest year)'], surveyRows.sort((a, b) => b.sort - a.sort || a.row[0].localeCompare(b.row[0])).map((r) => r.row)), '');
lines.push('## Acquisitions and other events in the window', '', 'Acquisitions, take-privates, mergers, listings, renames, parent changes, and dissolutions with a dated source. Announced deals are marked as announced in the detail; a closing is recorded only when the source says so.', '');
const events = Object.entries(signals.vendors).flatMap(([id, v]) => v.events.filter((e) => e.type !== 'maturity-changed').map((e) => ({ vendor: id, ...e }))).sort((a, b) => a.date.localeCompare(b.date) || a.vendor.localeCompare(b.vendor));
lines.push(events.length ? table(['Date', 'Vendor', 'Type', 'Detail', 'Source'], events.map((e) => [e.date, link(vendorName(e.vendor), `vault/Vendors/${vendorName(e.vendor).replace(/[\\/:*?"<>|#^[\]]/gu, ' ').replace(/\s+/gu, ' ').trim()}.md`), e.type, e.detail.replace(/\|/gu, ','), `[${e.method}](${e.source})`])) : 'No events recorded.', '');
const maturity = Object.entries(signals.vendors).flatMap(([id, v]) => v.events.filter((e) => e.type === 'maturity-changed').map((e) => ({ vendor: id, ...e }))).sort((a, b) => a.vendor.localeCompare(b.vendor));
lines.push('### Open-source maturity changes', '', maturity.length ? table(['Vendor', 'Detail', 'Source'], maturity.map((e) => [vendorName(e.vendor), e.detail, `[landscape](${e.source})`])) : 'No maturity changes were found for landscape vendors between the window start and the retrieval date.', '');
lines.push('## Conference presence', '', 'Which landscape vendors held a table or a sponsorship at the large security conferences, read from each event\'s own public directory after its robots.txt. Presence measures who paid or applied for a place on the floor, not adoption or revenue; a directory that refused the identified fetcher is listed below as not yet available rather than guessed.', '');
lines.push(table(['Event', 'Year', 'List', 'Listed', 'Matched to the map', 'Retrieved', 'Source'], conferencePages.length ? conferencePages.map((e) => [e.event, String(e.year), e.list, String(e.exhibitorCount), e.matched.length ? [...new Set(e.matched.map((m) => vendorName(m.vendor)))].sort().join(', ') : '0', e.retrieved, `[${new URL(e.url).host}](${e.url})`]) : [['none readable', '', '', '', '', '', '']]), '');
const presentCategories = catList.filter((c) => c.conferences.some((x) => x.exhibitors > 0));
if (presentCategories.length) {
  const y = conferenceYears.map(String);
  lines.push(table(['Category', 'Layer', ...y.map((yy) => `Exhibitors ${yy}`), ...y.map((yy) => `Share of floor ${yy}`), 'Change', 'Vendors'], presentCategories.sort((a, b) => b.conferencesByYear[y.at(-1)].exhibitors - a.conferencesByYear[y.at(-1)].exhibitors || a.name.localeCompare(b.name)).map((c) => [link(c.name, `vault/Categories/${c.name}.md`), layerName(c.layer), ...y.map((yy) => String(c.conferencesByYear[yy].exhibitors)), ...y.map((yy) => (c.conferencesByYear[yy].shareOfFloor === null ? '' : pct(c.conferencesByYear[yy].shareOfFloor))), c.conferencesChange ? `${c.conferencesChange.exhibitors >= 0 ? '+' : ''}${c.conferencesChange.exhibitors}` : '', [...new Set(c.conferences.flatMap((x) => x.vendors))].map(vendorName).sort().join(', ')])), '');
} else if (conferencePages.length) {
  lines.push(`No landscape vendor appears on a readable directory: the ${conferencePages.reduce((n, e) => n + e.exhibitorCount, 0)} entries across ${conferencePages.length} pages (${[...new Set(conferencePages.map((e) => `${e.event} ${e.list}`))].join(', ')}) are hardware and merchandise sellers, publishers, nonprofits, and community villages, none of which the map lists. Every entry, its linked website, and its near misses are in signals.json under conferences.events[].unmatched, so the zero is checkable.`, '');
}
const refusedPages = signals.conferences.events.filter((e) => e.refused !== null);
if (refusedPages.length) {
  lines.push('### Conference presence: not yet available', '', 'Directories that were attempted and could not be read. The fetcher identified itself with the library\'s user agent and contact address, read robots.txt first, and did not retry under a browser identity; each row records what the host answered and why the page was not used.', '');
  lines.push(table(['Event', 'Year', 'List', 'Directory', 'robots.txt', 'Page', 'Attempted', 'Why not used'], refusedPages.map((e) => [e.event, String(e.year), e.list, `[${new URL(e.url).host}](${e.url})`, e.robotsStatus === null ? 'not fetched' : `[${e.robotsStatus}](${e.robotsUrl})`, e.status === null ? 'not fetched' : String(e.status), e.retrieved ?? '', `${e.refused}${e.note ? ` ${e.note}` : ''}`.replace(/\|/gu, ',')])), '');
}
lines.push('## Coverage', '', 'How many of the vendors carry each signal. A vendor with no signal has an empty record in signals.json, never a guess.', '');
const cov = signals.coverage;
lines.push(table(['Signal', 'Vendors', 'Of'], [
  ['At least one signal (funding, stars, Hacker News stories, package data, or event)', String(cov.withAnySignal), String(cov.vendors)],
  ['Funding record (Form D or verified announcement)', String(cov.withFunding), String(cov.vendors)],
  ['Counted funding amount', String(cov.withCountedFunding), String(cov.vendors)],
  ['Form D filing matched', String(cov.withFormD), String(cov.vendors)],
  ['Verified vendor announcement', String(cov.withAnnouncement), String(cov.vendors)],
  ['GitHub star series', String(cov.withStars), `${cov.openSource} open-source vendors`],
  ['Hacker News counts (any)', String(cov.withHn), String(cov.vendors)],
  ['Hacker News counts above zero', String(cov.withHnMentions), String(cov.vendors)],
  ['Package download or install data', String(cov.withAdoption), String(cov.vendors)],
  ['Event in the window', String(cov.withEvents), String(cov.vendors)],
  ['Conference presence (a readable directory lists the vendor)', String(conferenceSummary.vendorsWithPresence), String(cov.vendors)],
  ['Categories with counted capital', String(byCategory.coverage.categoriesWithFunding), String(landscape.categories.length)],
  ['Categories with a star series', String(byCategory.coverage.categoriesWithStars), String(landscape.categories.length)],
  ['Categories with a survey share', String(byCategory.coverage.categoriesWithSurveyShare), String(landscape.categories.length)],
  ['Categories with a conference presence', String(conferenceSummary.categoriesWithPresence), String(landscape.categories.length)],
]), '');
lines.push(`Blind spots (no counted capital and no star series): ${blindSpots.length ? blindSpots.map((id) => link(catName(id), `vault/Categories/${catName(id)}.md`)).join(', ') : 'none'}. These categories still have Hacker News counts where the vendor name is distinctive.`, '');
lines.push(`Form D candidates reviewed by hand: ${cov.formDCandidatesReviewed} name matches were excluded (pooled funds), rejected (different company), or held; the decisions and reasons are in lib/signals-manual.json and lib/cache/signals/form-d.json.`, '');
lines.push('## Methods and limits', '');
for (const [key, label] of [['formD', 'SEC Form D'], ['announcements', 'Vendor announcements'], ['stars', 'GitHub stars'], ['hnMentions', 'Hacker News'], ['adoption', 'Package downloads and installs'], ['surveys', 'Developer survey'], ['events', 'Events'], ['conferences', 'Conference presence'], ['aggregation', 'Aggregation'], ['shareAlike', 'Share-alike terms']]) lines.push(`**${label}.** ${signals.methods[key]}`, '');
lines.push('### Datasets considered and not used', '', ...signals.methods.rejectedDatasets.map((r) => `- ${r.dataset}: ${r.reason}`), '');
lines.push('### Candidates that would need a Kaggle or cloud token', '', ...signals.methods.kaggleCandidates.map((k) => `- [${k.title}](${k.url}) (${k.license}): ${k.note}`), '');
lines.push('## Attribution', '', 'Every dataset used, with the credit line its license asks for. Retrieval dates are the days the fetcher last read the source.', '');
lines.push(table(['Dataset', 'Publisher', 'License', 'Retrieved', 'Credit'], signals.attributions.map((a) => [a.url ? link(a.dataset, a.url) : a.dataset, a.publisher, a.licenseUrl ? link(a.license, a.licenseUrl) : a.license, a.retrieved ?? '', a.credit.replace(/\|/gu, ',')])), '');
lines.push(`Share-alike: ${signals.methods.shareAlike}`, '');
lines.push(`_Generated from signals.json by lib/build-signals.mjs on ${signals.generatedOn}. Edit the fetch inputs in lib/signals-manual.json and lib/signals-survey-mapping.json, rerun lib/fetch-signals.mjs (and lib/fetch-conferences.mjs for the conference directories), then rebuild._`, '');
const markdown = lines.join('\n');
const byCategoryJson = JSON.stringify(byCategory, null, 1) + '\n';
requireCondition(!markdown.includes(EM_DASH) && !byCategoryJson.includes(EM_DASH), 'Generated files must not contain em dashes');

// ---------- write or check ----------
const outputs = [['signals-by-category.json', byCategoryJson], ['SIGNALS.md', markdown]];
const stale = [];
for (const [name, expected] of outputs) {
  const location = join(root, name);
  if (checkOnly) { const actual = await readFile(location, 'utf8').catch(() => null); if (actual !== expected) stale.push(name); }
  else await writeFile(location, expected, 'utf8');
}
if (checkOnly) requireCondition(stale.length === 0, `Generated signal files differ from signals.json: ${stale.join(', ')}. Run build-signals.mjs without --check.`);
console.log(`Signals ${checkOnly ? 'checked' : 'built'}: ${cov.withFunding} vendors with funding, ${cov.withStars} with stars, ${cov.withHn} with Hacker News counts, ${cov.withAdoption} with package data, ${cov.withEvents} with events, ${conferenceSummary.vendorsWithPresence} with a conference presence (${conferencePages.length} of ${signals.conferences.events.length} directory pages readable); ${byCategory.coverage.categoriesWithFunding} of ${landscape.categories.length} categories carry counted capital; ${blindSpots.length} blind-spot categories.`);
console.log('This checks structure, referential integrity, and export consistency, not the accuracy of any source figure.');
