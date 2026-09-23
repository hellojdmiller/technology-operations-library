// Conference presence: which landscape vendors exhibit at the large security conferences, read from each event's own
// public exhibitor, vendor, or village directory. Shared by fetch-conferences.mjs (which fetches and caches the pages and
// patches signals.json) and fetch-signals.mjs (which rebuilds signals.json from every cache, this one included).
//
// Rules. Only a public page that lists the names is read, after its robots.txt is read for the fetcher's own user agent;
// a server that refuses the identified fetcher is recorded as refused, never retried with a browser identity. Names are
// matched to landscape vendors by normalized name or by the registrable domain of the linked website; an exhibitor that
// matches nothing, or matches two vendors, stays unmatched and is listed in the cache for review. Nothing is forced.

export const CONTACT = 'hellojdmiller@gmail.com';
export const USER_AGENT = `TechnologyOperationsLibrary-signals/1.0 (https://github.com/hellojdmiller/technology-operations-library; ${CONTACT})`;
export const AGENT_TOKEN = 'TechnologyOperationsLibrary-signals';

// One entry per directory page. `list` says what the page lists; `parser` names the extractor in PARSERS.
export const EVENTS = [
  { id: 'rsac-2025-exhibitors', event: 'RSAC 2025', year: 2025, list: 'exhibitors', url: 'https://www.rsaconference.com/usa/expo-and-sponsors/exhibitor-list', parser: 'rsac', note: 'RSAC serves one exhibitor directory for the current year; a 2025 archive page could not be identified because the site refused every request.' },
  { id: 'rsac-2026-exhibitors', event: 'RSAC 2026', year: 2026, list: 'exhibitors', url: 'https://www.rsaconference.com/usa/expo-and-sponsors/exhibitor-list', parser: 'rsac', note: null },
  { id: 'blackhat-usa-2025-sponsors', event: 'Black Hat USA 2025', year: 2025, list: 'sponsors', url: 'https://www.blackhat.com/us-25/sponsors.html', parser: 'blackhat', note: null },
  { id: 'blackhat-usa-2026-sponsors', event: 'Black Hat USA 2026', year: 2026, list: 'sponsors', url: 'https://www.blackhat.com/us-26/sponsors.html', parser: 'blackhat', note: null },
  { id: 'defcon-33-vendors', event: 'DEF CON 33', year: 2025, list: 'vendors', url: 'https://defcon.org/html/defcon-33/dc-33-vendors.html', parser: 'defcon', note: null },
  { id: 'defcon-33-villages', event: 'DEF CON 33', year: 2025, list: 'villages', url: 'https://defcon.org/html/defcon-33/dc-33-villages.html', parser: 'defcon', note: null },
  { id: 'defcon-34-vendors', event: 'DEF CON 34', year: 2026, list: 'vendors', url: 'https://defcon.org/html/defcon-34/dc-34-vendors.html', parser: 'defcon', note: null },
  { id: 'defcon-34-villages', event: 'DEF CON 34', year: 2026, list: 'villages', url: 'https://defcon.org/html/defcon-34/dc-34-villages.html', parser: 'defcon', note: null },
];

// ---------- robots.txt ----------
// Minimal RFC 9309 reading: the group whose user-agent token matches ours wins, else the * group, else no rule applies.
export function robotsRule(body, path) {
  if (typeof body !== 'string' || !body.trim() || /^\s*</u.test(body)) return { rule: 'unreadable', matchedGroup: null };
  const groups = [];
  let current = null;
  for (const raw of body.split(/\r?\n/u)) {
    const line = raw.replace(/#.*$/u, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/u);
    if (!m) continue;
    const field = m[1].toLowerCase(), value = m[2].trim();
    if (field === 'user-agent') {
      if (!current || current.rules.length) { current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(value.toLowerCase());
    } else if ((field === 'disallow' || field === 'allow') && current) current.rules.push({ allow: field === 'allow', path: value });
  }
  const own = groups.filter((g) => g.agents.some((a) => a !== '*' && AGENT_TOKEN.toLowerCase().includes(a)));
  const star = groups.filter((g) => g.agents.includes('*'));
  const applicable = own.length ? own : star;
  if (!applicable.length) return { rule: 'no rule for this agent', matchedGroup: null };
  let best = null;
  for (const g of applicable) for (const r of g.rules) {
    if (r.path === '' ) { if (!best) best = { ...r, length: -1, allow: true }; continue; }
    const pattern = new RegExp(`^${r.path.split('*').map((s) => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')).join('.*').replace(/\\\$$/u, '$')}`, 'u');
    if (pattern.test(path) && (!best || r.path.length > best.length)) best = { ...r, length: r.path.length };
  }
  return { rule: !best || best.allow ? 'allowed' : 'disallowed', matchedGroup: own.length ? AGENT_TOKEN : '*' };
}

// ---------- page parsers ----------
const decode = (s) => s.replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/&#38;/gu, '&').replace(/&nbsp;|&#160;/gu, ' ').replace(/&quot;/gu, '"').replace(/&#39;|&rsquo;|&#8217;/gu, "'").replace(/&lt;/gu, '<').replace(/&gt;/gu, '>').replace(/\s+/gu, ' ').trim();
const SOCIAL_HOSTS = ['defcon.social', 'twitter.com', 'x.com', 'bsky.app', 'linkedin.com', 'instagram.com', 'youtube.com', 'youtu.be', 'discord.gg', 'discord.com', 'facebook.com', 'infosec.exchange', 'mastodon.social', 'github.com', 'gitlab.com', 'tiktok.com', 'twitch.tv', 'reddit.com', 'linktr.ee', 'medium.com', 'eventbrite.com', 'defcon.org', 'forum.defcon.org', 'threads.net', 'substack.com', 'meetup.com'];
export function hostOf(url) { try { return new URL(url).hostname.toLowerCase().replace(/^www\./u, ''); } catch { return null; } }
export function registrable(host) {
  if (!host) return null;
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const second = parts.at(-2), tld = parts.at(-1);
  if (tld.length === 2 && ['co', 'com', 'org', 'net', 'ac', 'gov', 'edu', 'or', 'ne'].includes(second)) return parts.slice(-3).join('.');
  return parts.slice(-2).join('.');
}
const isSocial = (url) => { const h = hostOf(url); return !h || SOCIAL_HOSTS.some((s) => h === s || h.endsWith(`.${s}`)); };

function parseDefcon(html) {
  const entries = [];
  for (const m of html.matchAll(/<article[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/article>/gu)) {
    const block = m[2];
    const nameMatch = block.match(/<h[1-6][^>]*class="vendor-name"[^>]*>([\s\S]*?)<\/h[1-6]>/u);
    if (!nameMatch) continue;
    const name = decode(nameMatch[1]);
    if (!name) continue;
    const details = block.match(/<p class="details">([\s\S]*?)<\/p>/u)?.[1] ?? '';
    const links = [...details.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gu)].map((l) => ({ url: l[1], label: decode(l[2]) }));
    const website = links.find((l) => /^web\s*site$/iu.test(l.label))?.url ?? links.find((l) => !isSocial(l.url))?.url ?? null;
    entries.push({ name, website, anchor: m[1] });
  }
  return entries;
}
// RSAC and Black Hat never answered with a page (see the refusal notes), so their parsers only guard against a future run
// that receives HTML: anchors that look like exhibitor names inside a list are collected, and the run reports how many.
function parseAnchorList(html, selectorHint) {
  const entries = [];
  for (const m of html.matchAll(new RegExp(`<a[^>]*class="[^"]*${selectorHint}[^"]*"[^>]*href="([^"]*)"[^>]*>([\\s\\S]*?)<\\/a>`, 'gu'))) {
    const name = decode(m[2]);
    if (name) entries.push({ name, website: /^https?:/u.test(m[1]) && !isSocial(m[1]) ? m[1] : null, anchor: null });
  }
  return entries;
}
export const PARSERS = { defcon: parseDefcon, rsac: (html) => parseAnchorList(html, 'exhibitor'), blackhat: (html) => parseAnchorList(html, 'sponsor') };

// ---------- matching ----------
const STOP = new Set(['inc', 'incorporated', 'corp', 'corporation', 'co', 'company', 'llc', 'ltd', 'limited', 'plc', 'holdings', 'holding', 'group', 'technologies', 'technology', 'tech', 'labs', 'lab', 'software', 'systems', 'solutions', 'international', 'usa', 'the', 'ag', 'gmbh', 'sa', 'bv', 'pbc', 'lp', 'llp', 'se']);
export function normalizeName(s) {
  return s.normalize('NFKD').replace(/[̀-ͯ]/gu, '').toLowerCase().replace(/&/gu, ' and ').replace(/[^a-z0-9]+/gu, ' ').trim().split(' ').filter((w) => w && !STOP.has(w)).join(' ');
}
export function buildVendorIndex(landscape) {
  const byName = new Map(), byDomain = new Map();
  const push = (map, key, id) => { if (!key) return; const list = map.get(key) ?? []; if (!list.includes(id)) list.push(id); map.set(key, list); };
  for (const v of landscape.vendors) {
    push(byName, normalizeName(v.name), v.id);
    push(byDomain, registrable(hostOf(v.website)), v.id);
  }
  return { byName, byDomain };
}
// Returns { vendor, confidence } or { vendor: null, reason } for one exhibitor entry. Never guesses.
export function matchEntry(entry, index) {
  const nameKey = normalizeName(entry.name);
  const domainKey = registrable(hostOf(entry.website));
  const byDomain = domainKey ? index.byDomain.get(domainKey) ?? [] : [];
  const byName = nameKey ? index.byName.get(nameKey) ?? [] : [];
  if (byDomain.length === 1 && byName.length === 1 && byDomain[0] === byName[0]) return { vendor: byDomain[0], confidence: 'domain-and-name' };
  if (byDomain.length === 1 && (byName.length === 0 || byName[0] === byDomain[0])) return { vendor: byDomain[0], confidence: 'domain' };
  if (byName.length === 1 && byDomain.length === 0) return { vendor: byName[0], confidence: 'name' };
  if (byDomain.length > 1 || byName.length > 1) return { vendor: null, reason: `ambiguous: ${[...new Set([...byDomain, ...byName])].join(', ')}` };
  if (byDomain.length === 1 && byName.length === 1) return { vendor: null, reason: `domain says ${byDomain[0]} but name says ${byName[0]}` };
  return { vendor: null, reason: null };
}
// Near misses for the review list: one normalized name contains the other as whole words (never used to match).
export function nearMisses(entry, landscape) {
  const key = normalizeName(entry.name);
  if (key.length < 4) return [];
  return landscape.vendors.filter((v) => { const k = normalizeName(v.name); return k.length >= 4 && k !== key && (` ${k} `.includes(` ${key} `) || ` ${key} `.includes(` ${k} `)); }).map((v) => v.id).slice(0, 5);
}

// ---------- assembly ----------
// From the cache (written by fetch-conferences.mjs) build the signals.json block, the per-vendor lists, the method text,
// and the attribution rows. Works with a null cache so a rebuild without this source still validates.
export function assembleConferences(cache, landscape) {
  const index = buildVendorIndex(landscape);
  const vendorById = new Map(landscape.vendors.map((v) => [v.id, v]));
  const events = [];
  const byVendor = {};
  for (const spec of EVENTS) {
    const c = cache?.events?.[spec.id] ?? null;
    const robots = c?.robots ?? null;
    const page = c?.page ?? null;
    const refused = c?.refused ?? (c ? null : 'not fetched yet');
    const matched = [];
    const unmatched = [];
    if (!refused && page?.status === 200) {
      for (const entry of c.entries) {
        const m = matchEntry(entry, index);
        if (m.vendor) matched.push({ vendor: m.vendor, name: entry.name, website: entry.website, confidence: m.confidence });
        else unmatched.push({ name: entry.name, website: entry.website, reason: m.reason, nearMisses: nearMisses(entry, landscape) });
      }
    }
    matched.sort((a, b) => a.vendor.localeCompare(b.vendor));
    for (const m of matched) (byVendor[m.vendor] ??= []).push({ event: spec.event, year: spec.year, list: spec.list, url: spec.url, confidence: m.confidence });
    events.push({
      id: spec.id, event: spec.event, year: spec.year, list: spec.list, url: spec.url,
      robotsUrl: robots?.url ?? `${new URL(spec.url).origin}/robots.txt`, robotsStatus: robots?.status ?? null, robotsRule: robots?.rule ?? null,
      status: page?.status ?? null, finalUrl: page?.finalUrl ?? null, retrieved: c?.retrieved ?? null, sha256: page?.sha256 ?? null,
      exhibitorCount: refused ? null : c.entries.length, matched, unmatchedCount: refused ? null : unmatched.length, unmatched,
      refused, note: spec.note,
    });
  }
  for (const list of Object.values(byVendor)) list.sort((a, b) => a.year - b.year || a.event.localeCompare(b.event) || a.list.localeCompare(b.list));
  const fetched = events.filter((e) => !e.refused);
  const refused = events.filter((e) => e.refused);
  const retrievedDates = fetched.map((e) => e.retrieved).filter(Boolean).sort();
  const block = { userAgent: USER_AGENT, retrieved: retrievedDates.at(-1) ?? null, events };
  const method = `Conference presence reads each event's own public directory page: exhibitor and sponsor lists for RSAC and Black Hat USA, vendor and village lists for DEF CON, for 2025 and 2026. Before a page is read the host's robots.txt is fetched and applied to the fetcher's own user agent (${AGENT_TOKEN}); a host that refuses the identified fetcher is recorded as refused with the status it returned and is never retried under a browser identity. ${fetched.length ? `Readable at retrieval: ${[...new Set(fetched.map((e) => e.event))].join(', ')}.` : 'No directory was readable at retrieval.'} ${refused.length ? `Refused or unreadable: ${[...new Set(refused.map((e) => e.event))].join(', ')} (reasons per page in the conferences block).` : ''} Entries are matched to landscape vendors by the registrable domain of the linked website, by normalized name (corporate suffixes and words such as Labs or Technologies removed), or both; an entry that matches nothing or more than one vendor stays unmatched and is listed with its near misses. Only names, linked websites, and the retrieval date are recorded from each page; presence measures who paid or applied for a table, not adoption, revenue, or quality. A vendor in two categories counts toward both when categories are aggregated.`.replace(/\s+/gu, ' ').trim();
  const attributions = [];
  const defconPages = fetched.filter((e) => e.id.startsWith('defcon-'));
  if (defconPages.length) attributions.push({ dataset: 'DEF CON vendor and village directories', publisher: 'DEF CON Communications, Inc.', license: 'Copyright DEF CON Communications, Inc.; public pages, no terms on reading; only names, linked websites, and the retrieval date are recorded', licenseUrl: 'https://defcon.org/html/links/dc-policy.html', url: 'https://defcon.org/', retrieved: defconPages.map((e) => e.retrieved).sort().at(-1), credit: `Vendor and village listings from the DEF CON conference site (${defconPages.map((e) => `${e.event} ${e.list}`).join(', ')}), read on the retrieval date; each event record links the page it came from.`, shareAlike: false });
  const rsacPages = fetched.filter((e) => e.id.startsWith('rsac-'));
  if (rsacPages.length) attributions.push({ dataset: 'RSAC exhibitor directory', publisher: 'RSA Conference LLC', license: 'Each page\'s own terms; only names, linked websites, and the retrieval date are recorded', licenseUrl: null, url: 'https://www.rsaconference.com/', retrieved: rsacPages.map((e) => e.retrieved).sort().at(-1), credit: 'Exhibitor listings from the RSA Conference site, read on the retrieval date.', shareAlike: false });
  const bhPages = fetched.filter((e) => e.id.startsWith('blackhat-'));
  if (bhPages.length) attributions.push({ dataset: 'Black Hat USA sponsor directory', publisher: 'Informa Tech (Black Hat)', license: 'Each page\'s own terms; only names, linked websites, and the retrieval date are recorded', licenseUrl: null, url: 'https://www.blackhat.com/', retrieved: bhPages.map((e) => e.retrieved).sort().at(-1), credit: 'Sponsor listings from the Black Hat site, read on the retrieval date.', shareAlike: false });
  for (const id of Object.keys(byVendor)) if (!vendorById.has(id)) throw new Error(`conferences: unknown vendor ${id}`);
  return { block, byVendor, method, attributions };
}
