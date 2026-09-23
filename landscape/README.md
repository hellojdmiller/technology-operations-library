# Technology landscape

A knowledge graph of the tools and companies that make up a firm's technology stack, across enterprise, small business, and personal use. It has three kinds of nodes and one kind of edge:

- **Layers** (9) group the stack: identity and devices, collaboration and content, security operations, network and edge, infrastructure and cloud, data and AI, business systems, developer tools and automation, and personal technology.
- **Categories** (67) are the parts of the stack a firm buys or runs, such as identity provider, MDM, data rooms, portfolio monitoring, or vector databases.
- **Vendors** (825) are the products, companies, and open-source projects in those categories, tagged by segment (enterprise, SMB, personal) and sector.
- **Relations** (2228) are typed edges between vendors: `integrates-with`, `alternative-to`, `built-on`, `part-of`, `acquired-by`, `complements`, and `secured-by`. Every relation carries the URL that documents it.

The graph is deliberately dense: it records as many sourced vendors per category as could be verified, so that crowded and thin areas of the market are visible. Category notes carry a `vendorCount` and vendor notes a `degree` (sourced relations in and out) so you can filter by either metric.

Two outputs come from one canonical file:

| Output | Path | Use |
|---|---|---|
| Graph data | [landscape.json](landscape.json) | Machine-readable graph; load it into any tool that reads JSON |
| Obsidian vault | [vault/](vault/README.md) | One Markdown note per layer, category, vendor, segment, and sector, linked with `[[wikilinks]]`; open the folder in Obsidian for the graph view |

## How it was sourced

Only open, citable sources were used. Each vendor's `sources` array lists the URLs that were actually opened for it.

| Source | Used for | License or terms |
|---|---|---|
| [Wikidata](https://www.wikidata.org) through the [SPARQL endpoint](https://query.wikidata.org/sparql) | Item id, official website, headquarters country, inception or release year, business type (public, subsidiary, nonprofit, private), and parent, developer, and owner relations | CC0 |
| Vendor documentation and integration directories | `integrates-with`, `built-on`, `secured-by`, `complements`, `alternative-to`, and `part-of` relations; product summaries | Each vendor's own terms; only the URL is recorded |
| [CNCF landscape](https://landscape.cncf.io) and [LF AI and Data landscape](https://landscape.lfai.foundation) | Category membership and open-source status of infrastructure and AI projects | Apache-2.0 data |
| This library's [platform baselines](../baselines/README.md) and operating guides | Which categories a small high-trust firm actually touches | GPL-3.0 |

Rules that were followed and that contributors should keep:

- A vendor is resolved to a Wikidata item only when the item's official website matches the vendor's website (or its label and registrable domain both match). Vendors without a confident match have `wikidata: null`, and their Wikidata-derived fields stay null rather than being guessed. 486 of 825 vendors currently carry an item.
- Every relation URL was fetched by `lib/check-sources.mjs` and kept only if the server returned a page (2xx or 3xx, or a 401, 403, 405, or 429 that shows the page exists behind an automated-client block). Candidates whose URL returned 404 or failed to resolve were dropped.
- Summaries are one neutral sentence describing what the vendor does. No marketing language, no rankings, no pricing.
- No licensed datasets. Commercial company-data products appear as vendor nodes because operators use them, but none of them was used as a source; their facts come from Wikidata and their own websites.

## Schema

`landscape.json` has exactly these top-level keys:

```json
{
  "version": "1.0.0",
  "generatedOn": "2026-09-21",
  "license": "CC0-1.0 for the graph data; sources retain their own licenses",
  "layers": [{ "id": "identity-and-devices", "name": "Identity and devices" }],
  "categories": [{ "id": "identity-provider", "name": "Identity provider", "layer": "identity-and-devices", "summary": "One sentence.", "segments": ["enterprise", "smb"] }],
  "vendors": [{
    "id": "okta", "name": "Okta", "kind": "company", "wikidata": "Q7082304", "website": "https://www.okta.com",
    "summary": "One sentence.", "categories": ["identity-provider"], "segments": ["enterprise", "smb"], "sectors": ["horizontal"],
    "businessType": "public-company", "hqCountry": "US", "founded": 2009, "openSource": false,
    "sources": ["https://www.okta.com", "https://www.wikidata.org/wiki/Q7082304"]
  }],
  "relations": [{ "from": "cloudflare", "to": "okta", "type": "integrates-with", "source": "https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/okta/" }]
}
```

Field rules, enforced by `lib/build-landscape.mjs`:

- Ids are lowercase kebab-case and unique across their list. Vendors are sorted by id.
- `kind` is `product`, `company`, or `open-source-project`. `businessType` is `public-company`, `private-company`, `subsidiary`, `open-source`, `nonprofit`, or null. `hqCountry` is ISO 3166-1 alpha-2 or null. `founded` is a year or null.
- Every vendor has at least one category, one segment, one sector, and one HTTPS source. Every category has at least one vendor.
- Both ends of every relation exist, no relation points at itself, and `from`, `to`, `type` triples are unique.
- Note names derived from `name` must be unique across layers, categories, vendors, segments, and sectors so that `[[wikilinks]]` resolve unambiguously.
- No em dashes anywhere in the JSON or the generated notes.

## Build and check

```sh
node landscape/lib/build-landscape.mjs          # validate and regenerate vault/
node landscape/lib/build-landscape.mjs --check  # validate and fail on drift (used in CI)
```

The build is deterministic: the same JSON always produces the same vault, and files that the JSON no longer describes are removed. CI runs the `--check` form, so commit the regenerated vault with any change to the JSON.

Two network helpers refresh the sourced fields. Neither runs in CI.

```sh
node landscape/lib/fetch-wikidata.mjs   # resolve items, refresh Wikidata fields, add part-of and acquired-by relations
node landscape/lib/check-sources.mjs    # fetch every URL and report dead ones; add --prune to remove relations whose source died
```

Both keep their raw responses in `lib/cache/` (`wikidata.json` and `urls.json`) so a rerun only fetches what changed; pass `--refresh` to start over. The Wikidata helper identifies itself with a descriptive User-Agent, queries in batches of 40 items, and waits between requests.

## Add a vendor

1. Add an object to `vendors` in `landscape.json`, keeping the key order shown above and the list sorted by id. Set `wikidata` to null unless you know the item; set `businessType`, `hqCountry`, and `founded` to null unless you have a source. Put the vendor's official website in `website` and in `sources`.
2. Add relations with a URL that documents each one. Integration directories, vendor docs pages, and a project's own README are all acceptable. Do not add a relation you cannot point at.
3. Run `node landscape/lib/fetch-wikidata.mjs` to fill the Wikidata fields, then `node landscape/lib/check-sources.mjs` to confirm the URLs answer.
4. Run `node landscape/lib/build-landscape.mjs`, review the new note under `vault/Vendors/`, and commit the JSON, the vault, and the cache together.

To add a category, add it to `categories` with an existing `layer`, give it at least one vendor, and rebuild.

## Market signals

[signals.json](signals.json) adds two years of open market signals to the graph: where capital and adoption went, by vendor, category, and layer, per quarter from 2024-09-01 to 2026-09-22 (2024-Q3 and 2026-Q3 are partial). [signals-by-category.json](signals-by-category.json) holds the per-category and per-layer aggregates and [SIGNALS.md](SIGNALS.md) the tables: capital raised per layer per quarter, the top categories by capital, by star growth, by Hacker News attention growth, and by download growth, the survey trend, acquisitions and other events, coverage, methods, and attribution.

| Signal | Source | What it measures | Limit |
|---|---|---|---|
| Funding | [SEC Form D data sets](https://www.sec.gov/data-research/sec-markets-data/form-d-data-sets) and EDGAR filings (public domain) | Amounts issuers reported as sold in exempt offerings, per filing, matched to vendors | US filers only; amounts are often open-ended or include option exercises and secondary sales; companies that rely on other exemptions do not appear |
| Funding | Vendor newsroom posts, fetched and checked for the stated figure | Announced rounds for vendors outside Form D | Self-reported; non-USD amounts are kept as text and not counted |
| Stars | [OSS Insight](https://ossinsight.io/docs/api) over [GH Archive](https://www.gharchive.org/); GitHub star API as fallback | Stars gained per quarter per repository | Attention, not deployments; campaigns and bots inflate some repositories |
| Attention | [Hacker News Search API](https://hn.algolia.com/api) by Algolia | Stories per quarter whose title or text names the vendor | Includes negative attention; common-word names are queried by domain and undercount |
| Adoption | npm, [pypistats.org](https://pypistats.org/api/), [Homebrew analytics](https://formulae.brew.sh/analytics/), Docker Hub | Downloads or installs for vendors that map to one package | Counts include CI and bots; pypistats exposes 180 days; Homebrew and Docker Hub are snapshots |
| Survey | [Stack Overflow Developer Survey](https://survey.stackoverflow.co/) 2024 and 2025 (ODbL) | Share of respondents naming a vendor or any vendor in a category | Question option lists changed between years for most questions, so only databases are differenced |
| Events | Wikidata, EDGAR former names, the CNCF, LF AI, and CD Foundation landscape files over time, verified vendor announcements | Acquisitions, listings, renames, parent changes, dissolutions, and open-source maturity changes | Announced deals are recorded as announced; closings only when the source says so |
| Conference presence | Each event's own public directory, read after its robots.txt: RSAC exhibitors, Black Hat USA sponsors, DEF CON vendors and villages, 2025 and 2026 | Which landscape vendors held a table or a sponsorship, per event and year, aggregated per category as exhibitors and share of the floor | RSAC and Black Hat refused the identified fetcher (403), so those floors are not yet available; DEF CON's four lists were readable and hold none of the map's vendors; presence measures who paid for a place, not adoption |

How vendors were matched. Form D issuers were matched by normalized legal name (corporate suffixes and words such as Labs or Technologies removed) plus a short alias list; pooled investment funds were excluded; a match whose country disagrees with the vendor's headquarters is held until accepted or rejected by hand, and every decision with its reason sits in [lib/signals-manual.json](lib/signals-manual.json). Confidence is `exact` when the issuer city equals the vendor's Wikidata headquarters, `normalized` when only the name matches, `manual` for aliases and hand-accepted matches, and `vendor-stated` for announcements. Repositories come from the landscape files, Wikidata (P1324), the vendor website, or a hand list that the fetcher checks against the website. Survey options are mapped in [lib/signals-survey-mapping.json](lib/signals-survey-mapping.json).

Conference presence. `lib/fetch-conferences.mjs` reads the exhibitor, sponsor, vendor, and village directories listed in `lib/conferences.mjs` (RSAC 2025 and 2026, Black Hat USA 2025 and 2026, DEF CON 33 and 34), fetching each host's robots.txt first and applying it to the fetcher's own user agent; a host that refuses the identified fetcher is recorded with the status it returned and is never retried under a browser identity. Entries are matched to vendors by the registrable domain of the linked website, by normalized name, or both; an entry that matches nothing or two vendors stays unmatched and is kept in `signals.json` with its near misses so a zero is checkable. On 2026-09-23 the RSAC site answered 403 to every request including robots.txt and the Black Hat sponsor pages answered 403 with a security-service block page, so those directories are listed in SIGNALS.md under "Conference presence: not yet available"; the four DEF CON pages (139 entries) were readable and matched none of the 825 vendors, because that floor is hardware and merchandise sellers, publishers, nonprofits, and community villages. Per category, `signals-by-category.json` carries exhibitors and share of the floor per year and the year-over-year change under `conferences`; only names, linked websites, and the retrieval date are recorded from any page.

What the numbers are not. Nothing here is a valuation, a market share, or revenue. A Form D amount is what the filing reports, not what the company banked. A category total that rests on one or two filings is marked in every table. Category totals split each vendor equally across its categories so that a vendor in two categories is not counted twice. Vendors with no signal have an empty record, never a guess. Licensed company-data products (the same list as in "Not included") were not used; datasets that were considered and rejected, and Kaggle or cloud-hosted candidates that would need a token, are listed in SIGNALS.md.

Coverage on 2026-09-22: 676 of 825 vendors carry at least one signal. 64 have a funding record (40 matched to 78 Form D filings, 28 with a verified announcement; 58 with a counted amount), 231 of 239 open-source vendors have a star series, 823 have Hacker News counts (650 above zero), 263 have package download or install data, 26 have a dated event, and 0 have a conference presence (4 of 8 directory pages were readable). 38 of 67 categories carry counted capital and 55 have a star series; the 4 categories with neither (Email security, Hyperscale cloud, Cap table and equity management, Personal devices) are the blind spots, mostly the investment-specific and enterprise categories where vendors are private, non-US, or closed-source.

Build and refresh:

```sh
node landscape/lib/fetch-signals.mjs                     # every source, cached under lib/cache/signals/, resumable
node landscape/lib/fetch-signals.mjs --source form-d     # one source: form-d | announcements | stars | hn | adoption | surveys | events
node landscape/lib/fetch-signals.mjs --dry-run           # report what would be fetched and rebuild signals.json from the cache
node landscape/lib/fetch-conferences.mjs                 # conference directories: robots.txt first, cached, matched, patched into signals.json
node landscape/lib/build-signals.mjs                     # validate signals.json, write signals-by-category.json and SIGNALS.md
node landscape/lib/build-signals.mjs --check             # fail on drift (used in CI)
```

The fetcher identifies itself with a descriptive User-Agent that carries a contact address, stays well under the SEC's ten requests per second, and reads a GitHub token from `GITHUB_TOKEN` or `gh auth token` at run time only; no token is stored. Raw downloads (Form D zips and survey CSVs, about 350 MB) go to `lib/cache/signals/raw/`, which is not committed; everything derived from them is in the committed caches, so a rebuild needs the network only for sources whose cache is missing. `check-sources.mjs` also probes the citable page URLs in signals.json and reports dead ones.

### Attribution

Every dataset behind the signals, with the credit its license asks for. The same list is machine-readable in `signals.json` under `attributions`.

| Dataset | Publisher | License | Retrieved | Credit |
|---|---|---|---|---|
| [Form D data sets](https://www.sec.gov/data-research/sec-markets-data/form-d-data-sets) | U.S. Securities and Exchange Commission | [Public domain (U.S. government work)](https://www.sec.gov/privacy#dissemination) | 2026-09-22 | Source: U.S. Securities and Exchange Commission, Form D data sets and EDGAR filings. Aggregated by quarter and by landscape category in this repository. |
| [EDGAR submissions API and filing documents](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) | U.S. Securities and Exchange Commission | [Public domain (U.S. government work)](https://www.sec.gov/privacy#dissemination) | 2026-09-22 | Source: U.S. Securities and Exchange Commission, EDGAR. |
| [OSS Insight API over GH Archive](https://api.ossinsight.io/) | PingCAP (OSS Insight); GH Archive by Ilya Grigorik | [GH Archive: public GitHub event data; OSS Insight pipeline Apache-2.0; API for non-commercial use per its documentation](https://ossinsight.io/docs/api) | 2026-09-22 | Stargazer and pull-request-creator histories from OSS Insight (https://ossinsight.io), built on GH Archive (https://www.gharchive.org). Figures were aggregated per quarter. |
| [GitHub REST API](https://api.github.com/) | GitHub | [GitHub Terms of Service; factual repository metadata](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) | 2026-09-22 | Repository metadata and, where OSS Insight had no history, starred_at timestamps from the GitHub REST API. |
| [Hacker News Search API](https://hn.algolia.com/api) | Algolia (index of Hacker News, Y Combinator) | [Free API for Hacker News data per Algolia terms; story counts only are recorded](https://hn.algolia.com/api) | 2026-09-22 | Story counts from the Hacker News Search API by Algolia (https://hn.algolia.com/api). Aggregated per quarter; no story text is redistributed. |
| [npm registry download counts](https://api.npmjs.org/) | npm, Inc. (GitHub) | [Public API; npm Terms of Use](https://github.com/npm/registry/blob/main/docs/download-counts.md) | 2026-09-22 | Package download counts from the npm registry API. Summed per quarter. |
| [pypistats.org](https://pypistats.org/api/) | pypistats.org (Christopher Flynn), from the PyPI BigQuery public dataset | [MIT (pypistats code); PyPI download data is public](https://github.com/crflynn/pypistats.org) | 2026-09-22 | PyPI download counts (without mirrors) from pypistats.org. Summed per quarter for the 180 days the API exposes. |
| [Homebrew analytics](https://formulae.brew.sh/analytics/) | Homebrew | [BSD-2-Clause (Homebrew); analytics published openly at formulae.brew.sh](https://docs.brew.sh/Analytics) | 2026-09-22 | Install counts from Homebrew analytics (https://formulae.brew.sh/analytics/), rolling 30, 90, and 365 day windows on the retrieval date. |
| [Docker Hub repository metadata](https://hub.docker.com/v2/) | Docker, Inc. | [Public API; Docker Terms of Service](https://docs.docker.com/docker-hub/api/latest/) | 2026-09-22 | Lifetime pull counts from the Docker Hub API on the retrieval date. |
| [Stack Overflow Annual Developer Survey results (2024, 2025)](https://survey.stackoverflow.co/) | Stack Exchange Inc. | [ODbL 1.0 (database), DbCL 1.0 (contents)](https://opendatacommons.org/licenses/odbl/1-0/) | 2026-09-22 | Contains information from the Stack Overflow Developer Survey, Stack Exchange Inc., which is made available here under the Open Database License (ODbL), https://opendatacommons.org/licenses/odbl/1-0/. Shares were computed from the public results files; figures were aggregated and transformed. |
| [Wikidata](https://query.wikidata.org/) | Wikimedia Foundation and contributors | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 2026-09-22 | Ownership, parent organization, official name, dissolution, headquarters, and source code repository statements from Wikidata (CC0). |
| [CNCF, LF AI and Data, and CD Foundation landscapes](https://github.com/cncf/landscape) | The Linux Foundation and its foundations | [Apache-2.0 (landscape data)](https://github.com/cncf/landscape/blob/master/LICENSE) | 2026-09-22 | Project maturity levels from the landscape.yml files of the CNCF, LF AI and Data, and CD Foundation landscapes, compared between two commits. |
| Vendor newsroom and blog posts | Each vendor | Each vendor's own terms; only the URL, date, and stated figure are recorded | 2026-09-22 | Funding rounds and corporate events as announced by each vendor on its own site; each record links the page it came from. |
| [DEF CON vendor and village directories](https://defcon.org/) | DEF CON Communications, Inc. | [Copyright DEF CON Communications, Inc.; public pages, no terms on reading; only names, linked websites, and the retrieval date are recorded](https://defcon.org/html/links/dc-policy.html) | 2026-09-23 | Vendor and village listings from the DEF CON conference site (DEF CON 33 vendors, DEF CON 33 villages, DEF CON 34 vendors, DEF CON 34 villages), read on the retrieval date; each event record links the page it came from. |

The Stack Overflow survey shares are the only share-alike input (ODbL 1.0). They appear in `signals-by-category.json` under `surveys` and in the Survey trend table of SIGNALS.md, so that derived database is offered under ODbL 1.0 as well; every other signal figure is CC0 like the rest of the landscape.

## License

The graph data in `landscape.json` and the generated vault are released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Wikidata content is CC0. The CNCF and LF AI landscape data is Apache-2.0. Vendor names, summaries, and documentation URLs point at material that stays under each vendor's own terms; only facts and links are recorded here. The build scripts are part of this repository and carry its GPL-3.0 license.

## Not included

- **Vendors without a verifiable website or documentation page.** Several candidate vendors were dropped because neither a Wikidata item nor a reachable official page could be confirmed at build time; they can be re-added with a source.
- **Relations without a documentation URL.** Integration claims from review sites, marketplaces that only expose opaque ids, or memory were not recorded. This is why some well-known pairings are missing: no page could be cited for them at build time.
- **Licensed company-data platforms as sources.** Harmonic, Crunchbase, PitchBook, G2, StackShare, and similar datasets were not queried. Where they appear, they are nodes sourced from Wikidata and their own sites.
- **Pricing, headcount, revenue, and ratings.** These change quickly and would need a licensed source. Funding appears only as the open Form D and announcement records in signals.json, with their limits.
- **Consumer entertainment, gaming, smart home beyond network hardware, and industry-specific line-of-business systems** (clinical, manufacturing, retail point of sale). They sit outside a firm's operating stack as this library frames it.
- **Managed service providers, consultancies, and auditors.** The graph maps software and hardware, not services firms.
- **Alternative-to edges derived only from shared category membership.** Two vendors in the same category are visibly alternatives in the category note; an explicit `alternative-to` edge is recorded only when one vendor's own page positions it against the other.

Facts were reviewed on the `generatedOn` date. Ownership changes and product renames are frequent in this market; re-run the two helpers before relying on a specific fact.
