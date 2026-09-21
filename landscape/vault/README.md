# Technology landscape vault

An Obsidian vault generated from [landscape.json](../landscape.json): 9 layers, 67 categories, 825 vendors, and 2228 typed relations. 465 vendors carry a Wikidata item. Every vendor note lists the sources behind it.

## Open it

1. Install [Obsidian](https://obsidian.md) and choose **Open folder as vault**.
2. Select this `vault` folder (the one containing this README).
3. Open the graph view (Ctrl/Cmd+G). Vendors, categories, layers, segments, and sectors are separate notes, so category hubs show the shape of the stack and vendor-to-vendor edges show integrations and alternatives.

## Graph view tips

- **Filter by layer**: type `tag:#identity-and-devices` (any layer id) in the graph filter to isolate one part of the stack, or `path:Vendors` to hide index notes.
- **Find crowded categories**: sort by the `vendorCount` property on category notes (see the table below), or open a category note and read the per-segment lists.
- **Find hubs**: vendor notes carry a `degree` property (inbound plus outbound sourced relations). High-degree vendors sit at the center of the graph.
- **Color groups**: in graph settings add groups such as `tag:#open-source`, `tag:#segment/personal`, or `path:Categories` to color nodes by role.
- **Local graph**: open a vendor note and use the local graph with depth 2 to see its neighbourhood of integrations and alternatives.

## Categories by vendor count

| Category | Layer | Vendors | Open source |
|---|---|---:|---:|
| [[Observability and incident response]] | [[Infrastructure and cloud]] | 31 | 14 |
| [[Hosting and web platforms]] | [[Infrastructure and cloud]] | 27 | 8 |
| [[Databases]] | [[Infrastructure and cloud]] | 25 | 16 |
| [[Network infrastructure]] | [[Network and edge]] | 25 | 4 |
| [[AI coding tools]] | [[Developer tools and automation]] | 24 | 9 |
| [[CRM and relationship intelligence]] | [[Business systems]] | 24 | 2 |
| [[HR, payroll, and recruiting]] | [[Business systems]] | 24 | 0 |
| [[ITSM, ticketing, and asset management]] | [[Business systems]] | 24 | 4 |
| [[Model providers and inference]] | [[Data and AI]] | 24 | 4 |
| [[Business intelligence and analytics]] | [[Data and AI]] | 23 | 7 |
| [[Low-code and internal tools]] | [[Developer tools and automation]] | 23 | 8 |
| [[Agent frameworks and MCP]] | [[Developer tools and automation]] | 22 | 21 |
| [[Cloud and SaaS security posture]] | [[Security operations]] | 21 | 5 |
| [[Workflow automation]] | [[Developer tools and automation]] | 21 | 8 |
| [[AI assistants]] | [[Data and AI]] | 20 | 0 |
| [[Backup and recovery]] | [[Security operations]] | 20 | 3 |
| [[GRC and compliance]] | [[Business systems]] | 20 | 2 |
| [[Market and company data]] | [[Business systems]] | 20 | 0 |
| [[Patching and remote management]] | [[Identity and devices]] | 20 | 3 |
| [[Personal devices]] | [[Personal technology]] | 20 | 0 |
| [[Accounting and ERP]] | [[Business systems]] | 19 | 2 |
| [[AI agents and automation platforms]] | [[Data and AI]] | 19 | 4 |
| [[CI CD]] | [[Developer tools and automation]] | 19 | 10 |
| [[Data integration and orchestration]] | [[Data and AI]] | 19 | 9 |
| [[Fund administration and investor reporting]] | [[Business systems]] | 19 | 0 |
| [[SIEM, logging, and detection]] | [[Security operations]] | 19 | 4 |
| [[Work management]] | [[Collaboration and content]] | 19 | 3 |
| [[Containers and orchestration]] | [[Infrastructure and cloud]] | 18 | 17 |
| [[Endpoint protection]] | [[Identity and devices]] | 18 | 3 |
| [[AI evaluation, gateways, and monitoring]] | [[Data and AI]] | 17 | 11 |
| [[Portfolio monitoring]] | [[Business systems]] | 17 | 0 |
| [[Zero trust access and SASE]] | [[Network and edge]] | 17 | 3 |
| [[Code and supply-chain security]] | [[Security operations]] | 16 | 8 |
| [[Identity provider]] | [[Identity and devices]] | 16 | 3 |
| [[Procurement and SaaS management]] | [[Business systems]] | 16 | 0 |
| [[Vulnerability management]] | [[Security operations]] | 16 | 4 |
| [[Cloud storage]] | [[Collaboration and content]] | 15 | 3 |
| [[Data warehouse and lakehouse]] | [[Data and AI]] | 15 | 6 |
| [[DNS, domains, CDN, and WAF]] | [[Network and edge]] | 15 | 1 |
| [[E-learning]] | [[Business systems]] | 15 | 1 |
| [[Hyperscale cloud]] | [[Infrastructure and cloud]] | 15 | 0 |
| [[Infrastructure as code]] | [[Infrastructure and cloud]] | 15 | 8 |
| [[Device management (MDM)]] | [[Identity and devices]] | 14 | 1 |
| [[Expense and spend management]] | [[Business systems]] | 14 | 0 |
| [[Personal cloud and backup]] | [[Personal technology]] | 14 | 3 |
| [[Personal communication]] | [[Personal technology]] | 14 | 4 |
| [[Privileged access and identity governance]] | [[Identity and devices]] | 14 | 1 |
| [[VPN]] | [[Network and edge]] | 14 | 6 |
| [[Email security]] | [[Security operations]] | 13 | 0 |
| [[Knowledge base]] | [[Collaboration and content]] | 13 | 5 |
| [[Password manager]] | [[Identity and devices]] | 13 | 4 |
| [[Secrets management]] | [[Security operations]] | 13 | 6 |
| [[Vector databases]] | [[Data and AI]] | 13 | 9 |
| [[Document management]] | [[Collaboration and content]] | 12 | 3 |
| [[Note-taking]] | [[Collaboration and content]] | 12 | 5 |
| [[MFA and passkeys]] | [[Identity and devices]] | 11 | 1 |
| [[Security awareness]] | [[Security operations]] | 11 | 1 |
| [[Consumer AI]] | [[Personal technology]] | 10 | 0 |
| [[Data rooms]] | [[Collaboration and content]] | 10 | 1 |
| [[DNS and web filtering]] | [[Security operations]] | 9 | 1 |
| [[Source control]] | [[Developer tools and automation]] | 9 | 5 |
| [[Team chat]] | [[Collaboration and content]] | 9 | 4 |
| [[E-signature and contracts]] | [[Collaboration and content]] | 8 | 2 |
| [[Productivity suite]] | [[Collaboration and content]] | 8 | 3 |
| [[Video meetings]] | [[Collaboration and content]] | 8 | 1 |
| [[Scheduling]] | [[Collaboration and content]] | 7 | 1 |
| [[Cap table and equity management]] | [[Business systems]] | 6 | 0 |

## Most connected vendors

- [[Microsoft Entra ID]] (360)
- [[Rippling]] (203)
- [[Make]] (169)
- [[Zapier]] (161)
- [[Okta]] (156)
- [[Yubico]] (138)
- [[Terraform]] (120)
- [[n8n]] (118)
- [[Drata]] (108)
- [[Vanta]] (95)
- [[Datadog]] (90)
- [[Airbyte]] (45)
- [[PagerDuty]] (40)
- [[Notion]] (37)
- [[LangChain]] (35)
- [[Langfuse]] (31)
- [[Microsoft]] (28)
- [[Sentry]] (26)
- [[Linear]] (25)
- [[GitHub]] (24)
- [[Cloudflare]] (23)
- [[LiteLLM]] (23)
- [[dbt Labs]] (22)
- [[OpenAI]] (22)
- [[1Password]] (20)

## Folders

- `Layers/`: one note per layer with its categories.
- `Categories/`: one note per category with vendors grouped by segment and the open-source options.
- `Vendors/`: one note per vendor with frontmatter fields, categories, relations by type, and sources.
- `Segments/`: Enterprise, SMB, and Personal index notes.
- `Sectors/`: index notes for sector tags.

_Generated from landscape.json by lib/build-landscape.mjs on 2026-09-21. Edit the JSON and rebuild._
