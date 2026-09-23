# Market signals

Where capital and attention went across the technology landscape between 2024-09-01 and 2026-09-22, by quarter, category, and layer. Generated from [signals.json](signals.json) by `lib/build-signals.mjs` on 2026-09-22; the per-category numbers are in [signals-by-category.json](signals-by-category.json). Quarters marked * are partial (2024-Q3: 2024-09-01 to 2024-09-30; 2026-Q3: 2026-07-01 to 2026-09-22).

Read this with the limits in mind: Form D amounts are what issuers reported as sold in exempt offerings, not what companies banked, and only US filers appear; announcements are self-reported; stars, downloads, and Hacker News stories measure attention, not revenue. Nothing here is a valuation or a market share. Category totals split each vendor equally across its categories, and every table marks a total that rests on one or two filings.

## Capital raised per layer per quarter

USD millions counted from Form D filings and verified announcements (see Methods for the counting rule). Filings is the number of counted records; vendors is how many distinct vendors they belong to.

| Layer | 2024-Q3* | 2024-Q4 | 2025-Q1 | 2025-Q2 | 2025-Q3 | 2025-Q4 | 2026-Q1 | 2026-Q2 | 2026-Q3* | Total | Filings | Vendors |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| [Identity and devices](vault/Layers/Identity and devices.md) | 0.0 | 0.0 | 0.0 | 225.0 | 27.9 | 143.0 | 0.0 | 100.0 | 0.0 | 495.8 | 5 | 5 |
| [Collaboration and content](vault/Layers/Collaboration and content.md) | 0.0 | 0.0 | 0.0 | 0.0 | 16.2 | 0.0 | 0.0 | 0.0 | 0.0 | 16.2 | 1 | 1 |
| [Security operations](vault/Layers/Security operations.md) | 0.0 | 60.5 | 10.0 | 30.0 | 16.2 | 78.8 | 198.3 | 59.4 | 0.0 | 453.2 | 9 | 7 |
| [Network and edge](vault/Layers/Network and edge.md) | 0.0 | 0.0 | 0.0 | 160.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 160.0 | 1 | 1 |
| [Infrastructure and cloud](vault/Layers/Infrastructure and cloud.md) | 0.0 | 103.2 | 0.0 | 502.0 | 252.3 | 48.1 | 545.0 | 440.0 | 210.0 | 2,100.6 | 15 | 9 |
| [Data and AI](vault/Layers/Data and AI.md) | 0.0 | 3,266.5 | 12,737.5 | 558.0 | 18,333.1 | 4,560.9 | 8,876.1 | 699.8 | 5,674.7 | 54,706.6 | 40 | 20 |
| [Business systems](vault/Layers/Business systems.md) | 0.0 | 205.5 | 166.8 | 474.0 | 1,275.5 | 689.7 | 0.0 | 982.0 | 0.0 | 3,793.5 | 24 | 16 |
| [Developer tools and automation](vault/Layers/Developer tools and automation.md) | 0.0 | 0.0 | 396.2 | 1,050.0 | 280.2 | 2,898.0 | 0.0 | 0.0 | 382.5 | 5,006.8 | 16 | 11 |
| [Personal technology](vault/Layers/Personal technology.md) | 0.0 | 3,000.0 | 13.8 | 0.0 | 2,659.3 | 0.0 | 8,300.0 | 0.0 | 0.0 | 13,973.1 | 4 | 1 |

All layers: 2024-Q3* 0.0; 2024-Q4 6,635.7; 2025-Q1 13,324.3; 2025-Q2 2,999.1; 2025-Q3 22,860.6; 2025-Q4 8,418.5; 2026-Q1 17,919.4; 2026-Q2 2,281.1; 2026-Q3* 6,267.2; total 80,706.0 across 78 Form D filings and 29 counted announcements.

## Top fifteen categories by two-year capital

Concentration says when a total rests on one or two filings or on a single vendor.

| Category | Layer | USD m | Filings | Vendors | Largest vendor | Concentration |
|---|---|---:|---:|---:|---|---|
| [Model providers and inference](vault/Categories/Model providers and inference.md) | Data and AI | 32,908.0 | 19 | 8 | xAI (42.5%) |  |
| [Consumer AI](vault/Categories/Consumer AI.md) | Personal technology | 13,973.1 | 4 | 1 | xAI (100.0%) | one vendor is more than 80 percent of the total |
| [AI assistants](vault/Categories/AI assistants.md) | Data and AI | 10,582.4 | 12 | 3 | Anthropic (78.0%) |  |
| [Data warehouse and lakehouse](vault/Categories/Data warehouse and lakehouse.md) | Data and AI | 10,529.4 | 10 | 3 | Databricks (92.9%) | one vendor is more than 80 percent of the total |
| [AI coding tools](vault/Categories/AI coding tools.md) | Developer tools and automation | 4,512.8 | 10 | 5 | Cursor (73.2%) |  |
| [Expense and spend management](vault/Categories/Expense and spend management.md) | Business systems | 1,216.4 | 7 | 3 | Ramp (74.3%) |  |
| [Procurement and SaaS management](vault/Categories/Procurement and SaaS management.md) | Business systems | 1,093.9 | 5 | 2 | Ramp (82.6%) | one vendor is more than 80 percent of the total |
| [Databases](vault/Categories/Databases.md) | Infrastructure and cloud | 914.0 | 8 | 2 | Supabase (59.0%) |  |
| [Hosting and web platforms](vault/Categories/Hosting and web platforms.md) | Infrastructure and cloud | 819.0 | 9 | 4 | Supabase (65.8%) |  |
| [HR, payroll, and recruiting](vault/Categories/HR, payroll, and recruiting.md) | Business systems | 442.9 | 5 | 3 | Deel (68.8%) |  |
| [GRC and compliance](vault/Categories/GRC and compliance.md) | Business systems | 427.5 | 4 | 4 | Vanta (35.1%) |  |
| [Workflow automation](vault/Categories/Workflow automation.md) | Developer tools and automation | 381.5 | 4 | 4 | Temporal (38.3%) |  |
| [Observability and incident response](vault/Categories/Observability and incident response.md) | Infrastructure and cloud | 347.0 | 3 | 3 | Grafana Labs (72.0%) |  |
| [Backup and recovery](vault/Categories/Backup and recovery.md) | Security operations | 302.5 | 4 | 3 | Veeam (68.9%) |  |
| [AI agents and automation platforms](vault/Categories/AI agents and automation platforms.md) | Data and AI | 281.2 | 3 | 3 | ServiceNow (46.1%) |  |

## Top fifteen categories by star growth

GitHub stars gained by the open-source vendors in each category over the window (OSS Insight over GH Archive; GitHub star API where OSS Insight had no history). Repos is the number of vendors with a star series in the category.

| Category | Layer | Stars gained | Repos | 2024-Q3* | 2024-Q4 | 2025-Q1 | 2025-Q2 | 2025-Q3 | 2025-Q4 | 2026-Q1 | 2026-Q2 | 2026-Q3* | Largest gainer |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [Agent frameworks and MCP](vault/Categories/Agent frameworks and MCP.md) | Developer tools and automation | 392,313 | 21 | 12,072 | 48,214 | 110,495 | 100,340 | 59,021 | 24,696 | 17,206 | 7,139 | 13,131 | Langflow |
| [AI coding tools](vault/Categories/AI coding tools.md) | Developer tools and automation | 242,339 | 8 | 7,118 | 17,233 | 36,443 | 54,917 | 42,304 | 20,717 | 38,748 | 10,307 | 14,552 | OpenCode |
| [Model providers and inference](vault/Categories/Model providers and inference.md) | Data and AI | 156,483 | 4 | 8,987 | 26,961 | 51,071 | 22,521 | 15,654 | 9,078 | 8,511 | 4,548 | 9,152 | Ollama |
| [AI agents and automation platforms](vault/Categories/AI agents and automation platforms.md) | Data and AI | 120,920 | 4 | 2,441 | 11,859 | 43,449 | 28,540 | 13,840 | 7,026 | 5,762 | 2,144 | 5,862 | n8n |
| [AI evaluation, gateways, and monitoring](vault/Categories/AI evaluation, gateways, and monitoring.md) | Data and AI | 81,753 | 11 | 3,270 | 12,270 | 16,046 | 15,211 | 11,359 | 6,543 | 8,073 | 3,060 | 5,922 | LangChain |
| [Workflow automation](vault/Categories/Workflow automation.md) | Developer tools and automation | 79,712 | 8 | 2,975 | 8,950 | 15,529 | 22,653 | 13,083 | 7,074 | 4,435 | 1,359 | 3,655 | n8n |
| [Databases](vault/Categories/Databases.md) | Infrastructure and cloud | 73,309 | 16 | 4,160 | 18,439 | 13,238 | 13,183 | 8,875 | 6,071 | 4,431 | 1,412 | 3,502 | Supabase |
| [Hosting and web platforms](vault/Categories/Hosting and web platforms.md) | Infrastructure and cloud | 69,191 | 8 | 5,937 | 12,650 | 17,213 | 10,737 | 7,868 | 5,734 | 4,093 | 1,447 | 3,514 | Supabase |
| [Containers and orchestration](vault/Categories/Containers and orchestration.md) | Infrastructure and cloud | 63,674 | 17 | 5,915 | 11,831 | 13,045 | 10,259 | 7,134 | 5,601 | 3,762 | 1,266 | 4,864 | Kubernetes |
| [Observability and incident response](vault/Categories/Observability and incident response.md) | Infrastructure and cloud | 57,725 | 14 | 4,087 | 12,942 | 11,966 | 9,729 | 6,771 | 4,970 | 3,433 | 1,188 | 2,640 | Uptime Kuma |
| [Low-code and internal tools](vault/Categories/Low-code and internal tools.md) | Developer tools and automation | 45,946 | 8 | 4,424 | 12,300 | 9,210 | 6,433 | 5,793 | 2,644 | 2,605 | 638 | 1,900 | NocoDB |
| [Personal cloud and backup](vault/Categories/Personal cloud and backup.md) | Personal technology | 44,759 | 3 | 4,314 | 9,512 | 8,085 | 6,112 | 5,747 | 4,781 | 2,791 | 1,048 | 2,369 | Immich |
| [Vector databases](vault/Categories/Vector databases.md) | Data and AI | 44,553 | 9 | 2,541 | 8,158 | 10,386 | 7,208 | 6,367 | 4,335 | 2,824 | 1,003 | 1,731 | Milvus |
| [Knowledge base](vault/Categories/Knowledge base.md) | Collaboration and content | 37,034 | 5 | 2,662 | 6,825 | 11,204 | 5,945 | 4,214 | 2,417 | 1,930 | 579 | 1,260 | AFFiNE |
| [Patching and remote management](vault/Categories/Patching and remote management.md) | Identity and devices | 36,235 | 3 | 2,391 | 5,980 | 7,765 | 6,356 | 5,073 | 2,806 | 2,070 | 931 | 2,863 | RustDesk |

## Top fifteen categories by Hacker News attention growth

Stories on Hacker News that name a vendor in the category, comparing the first three full quarters (2024-Q4, 2025-Q1, 2025-Q2) with the last three full quarters (2025-Q4, 2026-Q1, 2026-Q2). Common-word vendor names were queried by domain and undercount; see Methods.

| Category | Layer | First half | Second half | Change | Vendors | Most mentioned |
|---|---|---:|---:|---:|---:|---|
| [AI coding tools](vault/Categories/AI coding tools.md) | Developer tools and automation | 1,987 | 8,142 | +6,155 | 23 | Claude Code |
| [AI assistants](vault/Categories/AI assistants.md) | Data and AI | 3,478 | 9,140 | +5,662 | 20 | Claude |
| [Consumer AI](vault/Categories/Consumer AI.md) | Personal technology | 2,648 | 6,411 | +3,763 | 10 | Claude |
| [CI/CD](vault/Categories/CI/CD.md) | Developer tools and automation | 2,378 | 5,034 | +2,656 | 19 | GitHub |
| [Source control](vault/Categories/Source control.md) | Developer tools and automation | 2,138 | 4,751 | +2,613 | 8 | GitHub |
| [Model providers and inference](vault/Categories/Model providers and inference.md) | Data and AI | 4,773 | 7,010 | +2,237 | 24 | Google |
| [Databases](vault/Categories/Databases.md) | Infrastructure and cloud | 1,823 | 3,255 | +1,432 | 25 | PostgreSQL |
| [Containers and orchestration](vault/Categories/Containers and orchestration.md) | Infrastructure and cloud | 1,196 | 2,090 | +894 | 18 | Docker |
| [Personal communication](vault/Categories/Personal communication.md) | Personal technology | 1,730 | 2,518 | +788 | 14 | Meta |
| [Team chat](vault/Categories/Team chat.md) | Collaboration and content | 628 | 1,199 | +571 | 9 | Slack |
| [Hosting and web platforms](vault/Categories/Hosting and web platforms.md) | Infrastructure and cloud | 1,471 | 2,003 | +532 | 27 | Cloudflare |
| [Personal devices](vault/Categories/Personal devices.md) | Personal technology | 3,636 | 4,101 | +465 | 20 | Google |
| [Hyperscale cloud](vault/Categories/Hyperscale cloud.md) | Infrastructure and cloud | 2,903 | 3,346 | +443 | 15 | Google |
| [AI evaluation, gateways, and monitoring](vault/Categories/AI evaluation, gateways, and monitoring.md) | Data and AI | 171 | 450 | +279 | 17 | OpenRouter |
| [Productivity suite](vault/Categories/Productivity suite.md) | Collaboration and content | 1,988 | 2,264 | +276 | 8 | Google |

## Where adoption grew

Two views of adoption: stars gained (above) and npm registry downloads for the categories whose vendors map to an npm package, comparing the same two halves. Download counts include CI systems and bots. PyPI is not shown because pypistats.org exposes only the last 180 days.

| Category | Layer | npm packages | Downloads first half | Downloads second half | Change | Stars gained |
|---|---|---:|---:|---:|---:|---:|
| [AI coding tools](vault/Categories/AI coding tools.md) | Developer tools and automation | 7 | 9,525,744 | 692,891,397 | +7174% | 242,339 |
| [Model providers and inference](vault/Categories/Model providers and inference.md) | Data and AI | 1 | 598,137 | 12,644,656 | +2014% | 156,483 |
| [Agent frameworks and MCP](vault/Categories/Agent frameworks and MCP.md) | Developer tools and automation | 7 | 97,276,868 | 1,320,647,170 | +1258% | 392,313 |
| [Hosting and web platforms](vault/Categories/Hosting and web platforms.md) | Infrastructure and cloud | 3 | 24,563,013 | 245,575,858 | +900% | 69,191 |
| [Databases](vault/Categories/Databases.md) | Infrastructure and cloud | 6 | 45,036,750 | 330,460,375 | +634% | 73,309 |
| [AI agents and automation platforms](vault/Categories/AI agents and automation platforms.md) | Data and AI | 3 | 8,752,317 | 46,452,508 | +431% | 120,920 |
| [Password manager](vault/Categories/Password manager.md) | Identity and devices | 1 | 150,386 | 750,882 | +399% | 21,708 |
| [Business intelligence and analytics](vault/Categories/Business intelligence and analytics.md) | Data and AI | 1 | 16,874,772 | 82,736,184 | +390% | 24,887 |
| [AI evaluation, gateways, and monitoring](vault/Categories/AI evaluation, gateways, and monitoring.md) | Data and AI | 4 | 20,064,914 | 83,632,608 | +317% | 81,753 |
| [Workflow automation](vault/Categories/Workflow automation.md) | Developer tools and automation | 5 | 21,310,453 | 83,881,918 | +294% | 79,712 |
| [Data warehouse and lakehouse](vault/Categories/Data warehouse and lakehouse.md) | Data and AI | 1 | 1,922,725 | 5,022,873 | +161% | 15,310 |
| [Observability and incident response](vault/Categories/Observability and incident response.md) | Infrastructure and cloud | 4 | 902,135,697 | 2,104,895,429 | +133% | 57,725 |
| [Secrets management](vault/Categories/Secrets management.md) | Security operations | 3 | 15,943,446 | 30,405,572 | +91% | 17,482 |
| [Infrastructure as code](vault/Categories/Infrastructure as code.md) | Infrastructure and cloud | 1 | 15,348,025 | 26,794,341 | +75% | 16,257 |
| [Low-code and internal tools](vault/Categories/Low-code and internal tools.md) | Developer tools and automation | 1 | 399,779 | 632,453 | +58% | 45,946 |

## Survey trend

Stack Overflow Annual Developer Survey (Stack Exchange Inc., ODbL 1.0 (database) and DbCL 1.0 (contents)): share of respondents who answered a tool question and named at least one landscape vendor in the category. Only questions with the same option list in both years are differenced; the others are shown per year because the survey changed the question.

| Category | Question | 2024 | 2025 | Change | Leading vendors (latest year) |
|---|---|---:|---:|---|---|
| [Model providers and inference](vault/Categories/Model providers and inference.md) | ai-models-2025 |  | 99.7% | question changed | OpenAI 85.3%, Anthropic 43.4%, Google Gemini 42.4% |
| [Databases](vault/Categories/Databases.md) | databases | 97.9% | 98.4% | +0.5 pp | PostgreSQL 56.9%, MySQL 41.4%, SQLite 38.4% |
| [AI assistants](vault/Categories/AI assistants.md) | ai-models-2025 |  | 97.1% | question changed | OpenAI 85.3%, Anthropic 43.4%, Google Gemini 42.4% |
| [Team chat](vault/Categories/Team chat.md) | sync-collaboration-2024 | 94.2% |  | question changed | Microsoft Teams 53.6%, Slack 44.4%, Zoom 40.4% |
| [Source control](vault/Categories/Source control.md) | async-collaboration | 32.6% | 92.2% | question changed | GitHub 81.8%, GitLab 35.9%, Azure DevOps 16.8% |
| [AI coding tools](vault/Categories/AI coding tools.md) | editors | 87.3% | 92.1% | question changed | Visual Studio Code 76.4%, JetBrains 42.5%, Cursor 18.0% |
| [AI assistants](vault/Categories/AI assistants.md) | ai-tools-2024 | 89.8% |  | question changed | ChatGPT 85.3%, Google Gemini 24.9%, Microsoft Copilot 16.4% |
| [Consumer AI](vault/Categories/Consumer AI.md) | ai-tools-2024 | 89.8% |  | question changed | ChatGPT 85.3%, Google Gemini 24.9%, Microsoft Copilot 16.4% |
| [Video meetings](vault/Categories/Video meetings.md) | sync-collaboration-2024 | 84.5% |  | question changed | Microsoft Teams 53.6%, Zoom 40.4%, Google Meet 37.6% |
| [Containers and orchestration](vault/Categories/Containers and orchestration.md) | platforms | 2.6% | 75.0% | question changed | Docker 71.8%, Kubernetes 28.8%, Podman 11.3% |
| [Work management](vault/Categories/Work management.md) | async-collaboration | 81.6% | 71.8% | question changed | Jira 46.8%, Azure DevOps 16.8%, Notion 16.6% |
| [Hyperscale cloud](vault/Categories/Hyperscale cloud.md) | platforms | 85.5% | 70.7% | question changed | Amazon Web Services 43.8%, Microsoft Azure 26.6%, Google Cloud 24.8% |
| [Personal communication](vault/Categories/Personal communication.md) | sync-collaboration-2024 | 61.1% |  | question changed | Discord 38.8%, WhatsApp 31.7%, Telegram 20.9% |
| [Consumer AI](vault/Categories/Consumer AI.md) | ai-models-2025 |  | 59.6% | question changed | Google Gemini 42.4%, DeepSeek 27.0%, xAI 11.3% |
| [Containers and orchestration](vault/Categories/Containers and orchestration.md) | tools-2024 | 58.9% |  | question changed | Docker 55.7%, Kubernetes 20.0%, Podman 5.1% |
| [Knowledge base](vault/Categories/Knowledge base.md) | async-collaboration | 52.9% | 52.4% | question changed | Confluence 33.0%, Notion 16.6%, Obsidian 16.2% |
| [Vector databases](vault/Categories/Vector databases.md) | databases | 43.0% | 48.3% | +5.3 pp | Redis 28.6%, MongoDB 24.5%, Elastic 17.0% |
| [AI coding tools](vault/Categories/AI coding tools.md) | ai-tools-2024 | 46.1% |  | question changed | GitHub Copilot 42.8%, Tabnine 5.2%, Sourcegraph 1.4% |
| [Hosting and web platforms](vault/Categories/Hosting and web platforms.md) | platforms | 50.5% | 41.6% | question changed | Cloudflare 20.3%, Firebase 13.2%, DigitalOcean 10.8% |
| [Model providers and inference](vault/Categories/Model providers and inference.md) | ai-tools-2024 | 29.0% |  | question changed | Google Gemini 24.9%, Perplexity 5.5%, Meta 3.3% |
| [Note-taking](vault/Categories/Note-taking.md) | async-collaboration | 28.3% | 28.4% | question changed | Notion 16.6%, Obsidian 16.2% |
| [Patching and remote management](vault/Categories/Patching and remote management.md) | platforms |  | 25.9% | question changed | Homebrew 25.9% |
| [Infrastructure as code](vault/Categories/Infrastructure as code.md) | platforms | 2.6% | 25.0% | question changed | Terraform 17.9%, Ansible 11.9% |
| [Observability and incident response](vault/Categories/Observability and incident response.md) | platforms |  | 24.0% | question changed | Prometheus 11.9%, Datadog 8.9%, Splunk 4.6% |
| [Patching and remote management](vault/Categories/Patching and remote management.md) | tools-2024 | 23.0% |  | question changed | Homebrew 23.0% |
| [DNS, domains, CDN, and WAF](vault/Categories/DNS, domains, CDN, and WAF.md) | platforms | 18.6% | 20.3% | question changed | Cloudflare 20.3% |
| [Infrastructure as code](vault/Categories/Infrastructure as code.md) | tools-2024 | 17.4% |  | question changed | Terraform 11.0%, Ansible 8.1%, Puppet 1.2% |
| [Data warehouse and lakehouse](vault/Categories/Data warehouse and lakehouse.md) | databases | 10.7% | 16.7% | +6.0 pp | Google BigQuery 6.7%, Snowflake 4.2%, Databricks 3.5% |
| [Databases](vault/Categories/Databases.md) | platforms | 17.7% | 16.3% | question changed | Firebase 13.2%, Supabase 5.4% |
| [Productivity suite](vault/Categories/Productivity suite.md) | async-collaboration |  | 15.3% | question changed | Google Workspace 15.3% |
| [SIEM, logging, and detection](vault/Categories/SIEM, logging, and detection.md) | platforms |  | 12.7% | question changed | Datadog 8.9%, Splunk 4.6% |
| [CRM and relationship intelligence](vault/Categories/CRM and relationship intelligence.md) | async-collaboration | 2.5% | 2.6% | question changed | monday.com 2.6% |
| [Low-code and internal tools](vault/Categories/Low-code and internal tools.md) | async-collaboration | 2.4% | 2.5% | question changed | Airtable 2.5% |
| [CI/CD](vault/Categories/CI/CD.md) | tools-2024 | 1.2% |  | question changed | Dagger 1.2% |

## Acquisitions and other events in the window

Acquisitions, take-privates, mergers, listings, renames, parent changes, and dissolutions with a dated source. Announced deals are marked as announced in the detail; a closing is recorded only when the source says so.

| Date | Vendor | Type | Detail | Source |
|---|---|---|---|---|
| 2024-10-17 | [Squarespace](vault/Vendors/Squarespace.md) | acquired | Wikidata records a new owner: Permira (start time of the owned-by statement) | [wikidata](https://www.wikidata.org/wiki/Q7582097) |
| 2024-12-17 | [Coda](vault/Vendors/Coda.md) | acquired | Grammarly announced the acquisition of Coda | [announcement](https://www.grammarly.com/blog/company/grammarly-to-acquire-coda/) |
| 2025-01-22 | [Smartsheet](vault/Vendors/Smartsheet.md) | acquired | Smartsheet completed its acquisition by Blackstone and Vista Equity Partners | [announcement](https://www.smartsheet.com/content-center/news/blackstone-and-vista-equity-partners-complete-acquisition-smartsheet) |
| 2025-02-27 | [HashiCorp](vault/Vendors/HashiCorp.md) | acquired | IBM completed its acquisition of HashiCorp | [announcement](https://newsroom.ibm.com/2025-02-27-ibm-completes-acquisition-of-hashicorp,-creates-comprehensive,-end-to-end-hybrid-cloud-platform) |
| 2025-03-03 | [Preqin](vault/Vendors/Preqin.md) | acquired | BlackRock completed its acquisition of Preqin | [announcement](https://www.blackrock.com/corporate/newsroom/media/press-releases/blackrock-completes-preqin-acquisition) |
| 2025-03-18 | [Wiz](vault/Vendors/Wiz.md) | acquired | Google announced an agreement to acquire Wiz for $32 billion | [announcement](https://blog.google/inside-google/company-announcements/google-agreement-acquire-wiz/) |
| 2025-05-05 | [Weights & Biases](vault/Vendors/Weights & Biases.md) | acquired | CoreWeave completed its acquisition of Weights & Biases (announced 2025-03-04) | [announcement](https://www.coreweave.com/news/coreweave-completes-acquisition-of-weights-biases-2) |
| 2025-05-14 | [Neon](vault/Vendors/Neon.md) | acquired | Databricks announced an agreement to acquire Neon | [announcement](https://www.databricks.com/blog/databricks-neon) |
| 2025-06-20 | [Couchbase](vault/Vendors/Couchbase.md) | acquired | Couchbase announced an agreement to be acquired by Haveli Investments | [announcement](https://www.couchbase.com/press-releases/couchbase-to-be-acquired-by-haveli-investments/) |
| 2025-07-01 | [Superhuman](vault/Vendors/Superhuman.md) | acquired | Grammarly announced the acquisition of Superhuman | [announcement](https://www.grammarly.com/blog/company/grammarly-to-acquire-superhuman/) |
| 2025-07-30 | [Grammarly](vault/Vendors/Grammarly.md) | renamed | EDGAR former name Grammarly, Inc. replaced by Superhuman Platform Inc. | [edgar](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002033975) |
| 2025-08-01 | [Red Canary](vault/Vendors/Red Canary.md) | acquired | Zscaler completed its acquisition of Red Canary (announced 2025-05-27) | [announcement](https://www.zscaler.com/press/zscaler-completes-acquisition-red-canary-accelerate-innovations-agentic-ai-driven-security) |
| 2025-09-16 | [Lakera](vault/Vendors/Lakera.md) | acquired | Check Point announced an agreement to acquire Lakera | [announcement](https://www.checkpoint.com/press-releases/check-point-acquires-lakera-to-deliver-end-to-end-ai-security-for-enterprises/) |
| 2025-09-18 | [Netskope](vault/Vendors/Netskope.md) | listed | Netskope began trading on Nasdaq after its initial public offering | [announcement](https://www.netskope.com/press-releases/netskope-announces-pricing-of-initial-public-offering) |
| 2025-10-29 | [Grammarly](vault/Vendors/Grammarly.md) | renamed | Grammarly announced that the company is renamed Superhuman | [announcement](https://www.grammarly.com/blog/company/announcing-company-rebrand-to-superhuman/) |
| 2025-10-29 | [Jamf](vault/Vendors/Jamf.md) | acquired | Jamf announced an agreement to be acquired by Francisco Partners | [announcement](https://www.jamf.com/resources/press-releases/jamf-enters-into-definitive-agreement-to-be-acquired-by-francisco-partners-in-2-2-billion-transaction/) |
| 2025-10-30 | [Navan](vault/Vendors/Navan.md) | listed | Navan priced its initial public offering on 2025-10-29 and began trading on Nasdaq on 2025-10-30 | [announcement](https://investors.navan.com/news-releases/news-release-details/navan-announces-pricing-initial-public-offering) |
| 2025-11-01 | [Perforce](vault/Vendors/Perforce.md) | renamed | Wikidata records a new official name: Perforce P4; the date has month precision only | [wikidata](https://www.wikidata.org/wiki/Q1681038) |
| 2025-11-12 | [Informatica](vault/Vendors/Informatica.md) | acquired | Salesforce completed its acquisition of Informatica | [announcement](https://www.salesforce.com/news/press-releases/2025/11/12/salesforce-completes-acquisition-of-informatica/) |
| 2026-01-02 | [Stripe](vault/Vendors/Stripe.md) | parent-changed | Wikidata records a new parent organization: Q140991293 | [wikidata](https://www.wikidata.org/wiki/Q7624104) |
| 2026-01-03 | [Stripe](vault/Vendors/Stripe.md) | renamed | Wikidata records a new official name: Stripe, LLC | [wikidata](https://www.wikidata.org/wiki/Q7624104) |
| 2026-01-29 | [Chronosphere](vault/Vendors/Chronosphere.md) | acquired | Palo Alto Networks completed its acquisition of Chronosphere (announced 2025-11-19) | [announcement](https://www.paloaltonetworks.com/company/press/2026/palo-alto-networks-completes-chronosphere-acquisition--unifying-observability-and-security-for-the-ai-era) |
| 2026-02-04 | [Dayforce](vault/Vendors/Dayforce.md) | acquired | Thoma Bravo completed its acquisition of Dayforce (agreement announced 2025-08-21) | [announcement](https://www.dayforce.com/who-we-are/newsroom/thoma-bravo-completes-acquisition-of-dayforce) |
| 2026-02-11 | [CyberArk](vault/Vendors/CyberArk.md) | acquired | Palo Alto Networks completed its acquisition of CyberArk (announced 2025-07-30) | [announcement](https://www.paloaltonetworks.com/company/press/2026/palo-alto-networks-completes-acquisition-of-cyberark-to-secure-the-ai-era) |
| 2026-06-01 | [dbt Labs](vault/Vendors/dbt Labs.md) | acquired | dbt Labs and Fivetran completed their merger (agreement announced 2025-10-13) | [announcement](https://www.fivetran.com/press/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents) |

### Open-source maturity changes

| Vendor | Detail | Source |
|---|---|---|
| Crossplane | CNCF landscape maturity moved from incubating to graduated between 2024-09-01 (commit 8a3cb0f) and the retrieval date | [landscape](https://github.com/cncf/landscape/blob/master/landscape.yml) |
| OpenTelemetry | CNCF landscape maturity moved from incubating to graduated between 2024-09-01 (commit 8a3cb0f) and the retrieval date | [landscape](https://github.com/cncf/landscape/blob/master/landscape.yml) |
| OpenTofu | CNCF landscape maturity moved from none to sandbox between 2024-09-01 (commit 8a3cb0f) and the retrieval date | [landscape](https://github.com/cncf/landscape/blob/master/landscape.yml) |

## Coverage

How many of the vendors carry each signal. A vendor with no signal has an empty record in signals.json, never a guess.

| Signal | Vendors | Of |
|---|---:|---|
| At least one signal (funding, stars, Hacker News stories, package data, or event) | 676 | 825 |
| Funding record (Form D or verified announcement) | 64 | 825 |
| Counted funding amount | 58 | 825 |
| Form D filing matched | 40 | 825 |
| Verified vendor announcement | 28 | 825 |
| GitHub star series | 231 | 239 open-source vendors |
| Hacker News counts (any) | 823 | 825 |
| Hacker News counts above zero | 650 | 825 |
| Package download or install data | 263 | 825 |
| Event in the window | 26 | 825 |
| Categories with counted capital | 38 | 67 |
| Categories with a star series | 55 | 67 |
| Categories with a survey share | 26 | 67 |

Blind spots (no counted capital and no star series): [Email security](vault/Categories/Email security.md), [Hyperscale cloud](vault/Categories/Hyperscale cloud.md), [Cap table and equity management](vault/Categories/Cap table and equity management.md), [Personal devices](vault/Categories/Personal devices.md). These categories still have Hacker News counts where the vendor name is distinctive.

Form D candidates reviewed by hand: 19 name matches were excluded (pooled funds), rejected (different company), or held; the decisions and reasons are in lib/signals-manual.json and lib/cache/signals/form-d.json.

## Methods and limits

**SEC Form D.** SEC Form D covers exempt (mostly Regulation D) securities offerings by issuers that choose to file it. Quarterly data sets (2024-Q3, 2024-Q4, 2025-Q1, 2025-Q2, 2025-Q3, 2025-Q4, 2026-Q1, 2026-Q2) were parsed and primary issuers matched to vendors by normalized legal name (corporate suffixes and words such as Labs or Technologies removed) plus a short alias list; pooled investment funds were excluded; conflicting matches were held or rejected by hand and every decision is listed in lib/signals-manual.json. Confidence is exact when the issuer city equals the vendor's Wikidata headquarters, normalized when only the name matches, and manual for aliases and hand-accepted matches. For the current quarter, EDGAR submissions of the matched filers were read and each new Form D document parsed. Amounts are what the filing reports as sold, not what the company banked: many offerings are open-ended (indefinite), amounts include option exercises and secondary sales, and non-US companies appear only when a US entity files. Amendments count the increase over the previous filing in their chain when that filing is in the loaded data; other offerings whose first sale predates 2024-06-01 are recorded but not counted. Form D says nothing about companies that rely on other exemptions or file late, so absence is not evidence of no funding.

**Vendor announcements.** For vendors outside Form D, a hand-picked list of vendor newsroom posts was fetched; a round is recorded only when the page answered and the stated amount appears in its text. Amounts are self-reported by the vendor. An announcement within 120 days of a counted Form D filing by the same vendor is recorded for its round name but not counted a second time. Amounts stated in other currencies are kept as text and not converted.

**GitHub stars.** For open-source vendors a GitHub repository was taken from the CNCF or LF AI landscape entry, from the Wikidata source code repository statement, from the vendor website, or from a hand list that the fetcher checks against the website. Monthly cumulative stargazer counts came from the OSS Insight API, which is built on the public GH Archive event stream, in one call per repository; quarterly gains are differences of the month-end cumulative counts. Where OSS Insight had no history the GitHub star API was paged with starred_at timestamps, skipping repositories above 40000 stars. OSS Insight's most recent months lag GH Archive ingestion and its latest month reconciles to the live total, so the last two quarters redistribute between themselves as the data catches up; treat them as provisional. Stars measure attention from developers, not deployments or revenue, and star campaigns and bots inflate some repositories.

**Hacker News.** Story counts per quarter from the Algolia Hacker News Search API, exact-phrase query on the vendor name matched against story titles and text (not URLs), stories only. Names that are common words use the vendor domain as the query instead (undercounting) or a custom phrase; a few ambiguous names were kept with a note, and two were skipped. Ten thousand hits per query was the paging cap. Mentions measure attention, including negative attention, not adoption.

**Package downloads and installs.** Package series for vendors whose product maps to one package: npm registry daily downloads summed per quarter (two years), PyPI downloads without mirrors from pypistats.org (only the last 180 days are exposed, so the first covered quarter is partial), Homebrew install counts (rolling 30, 90, and 365 day snapshots), Docker Hub lifetime pull counts (a snapshot), and OSS Insight monthly first-time pull request creators summed per quarter. Downloads include CI systems, mirrors, and bots.

**Developer survey.** Stack Overflow Developer Survey public results for 2024 and 2025 (ODbL). Multi-select tool questions were mapped to landscape vendors in lib/signals-survey-mapping.json; a vendor's share is the share of respondents who answered the question and named it, and a category's share is the share who named any mapped vendor in that category, counting only the categories each question speaks to. Only the database question kept the same option list in both years; other questions changed and are reported without a year-over-year difference. The 2026 results were not published at retrieval time.

**Events.** Acquisitions, parent changes, renames, and dissolutions from Wikidata statements whose start time falls in the window (year-precision dates are flagged), renames from EDGAR former names of matched Form D filers, maturity changes between the CNCF, LF AI and Data, and CD Foundation landscape files at the window start and at retrieval, and vendor announcements verified by fetching the page and finding the counterpart's name in it.

**Aggregation.** Category and layer totals split each vendor's figure equally across its landscape categories so that a vendor in two categories is not counted twice; a layer total sums its categories. Every table in SIGNALS.md marks category totals that rest on one or two filings.

**Share-alike terms.** The Stack Overflow survey shares are the only share-alike (ODbL) input. They appear in signals-by-category.json under surveys and in the Survey trend table of SIGNALS.md, so that derived database is offered under ODbL 1.0 as well; every other figure in these files is under CC0 like the rest of the landscape.

### Datasets considered and not used

- Kaggle: Startup Investments (Crunchbase export): Derived from Crunchbase, a licensed dataset; the Kaggle license label does not change the upstream terms
- Kaggle: Unicorn companies and CB Insights lists: Derived from CB Insights, a licensed dataset
- Kaggle and GitHub: tech-stack datasets scraped from StackShare or BuiltWith: Scrapes of licensed sites whose terms forbid redistribution
- Kaggle and GitHub: LinkedIn company headcount datasets: Scrapes of LinkedIn, whose terms forbid scraping
- Kaggle: Tech layoffs (layoffs.fyi): Compiled from press reports without an open license and republished without one
- Kaggle: G2 and Capterra review datasets: Scrapes of licensed review sites
- PitchBook, Dealroom, Harmonic, and Specter exports: Licensed products; excluded by the brief
- Devographics State of JS and State of CSS results: Not used in this run: the data license could not be confirmed from the repository at retrieval time; revisit if a clear license statement is found
- DORA State of DevOps: Report only; no openly licensed respondent data

### Candidates that would need a Kaggle or cloud token

- [Stack Overflow Annual Developer Survey (Kaggle mirrors)](https://www.kaggle.com/search?q=stack+overflow+developer+survey) (ODbL 1.0 at the upstream): Upstream used directly from the Stack Overflow archive; no token needed
- [Hacker News (BigQuery public dataset mirrored on Kaggle)](https://www.kaggle.com/datasets/hacker-news/hacker-news) (CC0 as labelled on Kaggle; confirm before use): Would add comment-level mentions and the full story text for every vendor, not just story counts
- [PyPI download statistics (BigQuery public dataset)](https://console.cloud.google.com/marketplace/product/gcp-public-data-pypi/pypi) (Public dataset, terms per Google Cloud): Needs Google Cloud credentials rather than Kaggle; would extend the PyPI series past the 180 days pypistats.org exposes
- [GH Archive on BigQuery (githubarchive)](https://www.gharchive.org/) (Public event data; Google Cloud terms): Needs Google Cloud credentials; would allow forks, issues, and contributors per quarter for every repository instead of the OSS Insight stargazer and pull-request-creator series

## Attribution

Every dataset used, with the credit line its license asks for. Retrieval dates are the days the fetcher last read the source.

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

Share-alike: The Stack Overflow survey shares are the only share-alike (ODbL) input. They appear in signals-by-category.json under surveys and in the Survey trend table of SIGNALS.md, so that derived database is offered under ODbL 1.0 as well; every other figure in these files is under CC0 like the rest of the landscape.

_Generated from signals.json by lib/build-signals.mjs on 2026-09-22. Edit the fetch inputs in lib/signals-manual.json and lib/signals-survey-mapping.json, rerun lib/fetch-signals.mjs, then rebuild._
