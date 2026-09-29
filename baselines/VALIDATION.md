# Baseline validation record

Checked locally on **2026-09-20**; the Azure, Google Cloud, OpenAI, and Anthropic catalogs were added and the checks rerun on **2026-09-29**.

| Check | Result |
|---|---|
| Control catalogs | Nine valid JSON catalogs (Google Workspace 24, Microsoft 365 25, Cloudflare 20, AWS 20, GitHub 20, Microsoft Azure 99, Google Cloud 109, OpenAI 80, Anthropic 80; 477 assertions); every control has an official vendor reference on an accepted documentation host and a review gate |
| Worksheets | Nine CSV worksheets sharing one header; IDs match their catalogs. Nine risk-assessment templates sharing one 18-column header with ten to twelve generic scenarios each, every referenced control id present in its catalog |
| Fictional assessments | Every example produces 7 aligned assertions, 3 gaps, and 1 scoped non-applicable control at its documented review date; unknowns are 9 for Cloudflare, AWS, and GitHub, 13 and 14 for the refreshed Google and Microsoft catalogs, 88 and 98 for Microsoft Azure and Google Cloud, and 69 each for OpenAI and Anthropic, whose examples observe 20 of 80 controls |
| Local comparison | 17 Node.js tests passed: incomplete, stale/future, unsupported, invalid, duplicate, exception, version, and date cases; CLI JSON and invalid-input behavior |
| Local links | All relative Markdown links in the baseline subtree resolve |
| Azure and Google Cloud catalogs (2026-09-29) | Microsoft Azure 99 and Google Cloud 109 controls on learn.microsoft.com and docs.cloud.google.com; worksheets and twelve-scenario risk templates match their catalogs; each fictional example yields 7 aligned, 3 gaps, and 1 scoped non-applicable control at 2026-09-29, with 88 and 98 unknowns; every source URL was retrieved during review |
| Tenant activity | None: no authentication, tenant collection, tenant changes, installations, or live configuration tests |

The assertions are a proposed operating baseline, not an exhaustive vendor benchmark, audit opinion, or regulatory certification. The JSON is library-specific data; it is not importable into either vendor's policy system.

The comparison tool validates input structure and compares reviewer assertions. It does not open evidence references, confirm licenses, inspect policy inheritance, authenticate a reviewer, or independently determine whether a control actually works. Unknowns and exceptions remain visible; no security percentage is produced.

Before treating a resource as operationally accepted, review the actual licensing and current vendor documentation, agree population and business requirements, collect real evidence privately, pilot relevant changes, and record effective behavior and recovery tests. Those checks have not been performed here.

Re-run local tests from the repository root:

```sh
node --test baselines/tests/assess.test.mjs
```
