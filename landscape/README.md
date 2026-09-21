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

## License

The graph data in `landscape.json` and the generated vault are released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Wikidata content is CC0. The CNCF and LF AI landscape data is Apache-2.0. Vendor names, summaries, and documentation URLs point at material that stays under each vendor's own terms; only facts and links are recorded here. The build scripts are part of this repository and carry its GPL-3.0 license.

## Not included

- **Vendors without a verifiable website or documentation page.** Several candidate vendors were dropped because neither a Wikidata item nor a reachable official page could be confirmed at build time; they can be re-added with a source.
- **Relations without a documentation URL.** Integration claims from review sites, marketplaces that only expose opaque ids, or memory were not recorded. This is why some well-known pairings are missing: no page could be cited for them at build time.
- **Licensed company-data platforms as sources.** Harmonic, Crunchbase, PitchBook, G2, StackShare, and similar datasets were not queried. Where they appear, they are nodes sourced from Wikidata and their own sites.
- **Pricing, headcount, funding, revenue, and ratings.** These change quickly and would need a licensed source.
- **Consumer entertainment, gaming, smart home beyond network hardware, and industry-specific line-of-business systems** (clinical, manufacturing, retail point of sale). They sit outside a firm's operating stack as this library frames it.
- **Managed service providers, consultancies, and auditors.** The graph maps software and hardware, not services firms.
- **Alternative-to edges derived only from shared category membership.** Two vendors in the same category are visibly alternatives in the category note; an explicit `alternative-to` edge is recorded only when one vendor's own page positions it against the other.

Facts were reviewed on the `generatedOn` date. Ownership changes and product renames are frequent in this market; re-run the two helpers before relying on a specific fact.
