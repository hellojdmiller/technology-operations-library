# Baseline validation record

Checked locally on **2026-09-20**.

| Check | Result |
|---|---|
| Control catalogs | Five valid JSON catalogs (Google Workspace 24, Microsoft 365 25, Cloudflare 20, AWS 20, GitHub 20); every control has an official vendor reference on an accepted documentation host and a review gate |
| Worksheets | Five CSV worksheets sharing one header; IDs match their catalogs. Five risk-assessment templates sharing one 18-column header with ten to twelve generic scenarios each, every referenced control id present in its catalog |
| Fictional assessments | Every example produces 7 aligned assertions, 3 gaps, and 1 scoped non-applicable control at its documented review date; unknowns are 9 for the three new catalogs and 13 and 14 for the refreshed Google and Microsoft catalogs, whose added controls carry no example observation |
| Local comparison | 17 Node.js tests passed: incomplete, stale/future, unsupported, invalid, duplicate, exception, version, and date cases; CLI JSON and invalid-input behavior |
| Local links | All relative Markdown links in the baseline subtree resolve |
| Tenant activity | None: no authentication, tenant collection, tenant changes, installations, or live configuration tests |

The assertions are a proposed operating baseline, not an exhaustive vendor benchmark, audit opinion, or regulatory certification. The JSON is library-specific data; it is not importable into either vendor's policy system.

The comparison tool validates input structure and compares reviewer assertions. It does not open evidence references, confirm licenses, inspect policy inheritance, authenticate a reviewer, or independently determine whether a control actually works. Unknowns and exceptions remain visible; no security percentage is produced.

Before treating a resource as operationally accepted, review the actual licensing and current vendor documentation, agree population and business requirements, collect real evidence privately, pilot relevant changes, and record effective behavior and recovery tests. Those checks have not been performed here.

Re-run local tests from the repository root:

```sh
node --test baselines/tests/assess.test.mjs
```
