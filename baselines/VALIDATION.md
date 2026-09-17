# Baseline validation record

Checked locally on **2026-09-17**.

| Check | Result |
|---|---|
| Control catalogs | Two valid JSON catalogs, 20 uniquely identified controls each; every control has an official vendor reference and review gate |
| Worksheets | Two CSV worksheets with 20 controls each; IDs match their catalogs |
| Fictional assessments | Both examples produce 7 aligned assertions, 3 gaps, 9 unknowns, and 1 scoped non-applicable control at the documented review date |
| Local comparison | 16 Node.js tests passed: incomplete, stale/future, unsupported, invalid, duplicate, exception, version, and date cases; CLI JSON and invalid-input behavior |
| Local links | All relative Markdown links in the baseline subtree resolve |
| Tenant activity | None: no authentication, tenant collection, tenant changes, installations, or live configuration tests |

The assertions are a proposed operating baseline, not an exhaustive Microsoft/Google benchmark, audit opinion, or regulatory certification. The JSON is library-specific data; it is not importable into either vendor's policy system.

The comparison tool validates input structure and compares reviewer assertions. It does not open evidence references, confirm licenses, inspect policy inheritance, authenticate a reviewer, or independently determine whether a control actually works. Unknowns and exceptions remain visible; no security percentage is produced.

Before treating a resource as operationally accepted, review the actual licensing and current vendor documentation, agree population and business requirements, collect real evidence privately, pilot relevant changes, and record effective behavior and recovery tests. Those checks have not been performed here.

Re-run local tests from the repository root:

```sh
node --test baselines/tests/assess.test.mjs
```
