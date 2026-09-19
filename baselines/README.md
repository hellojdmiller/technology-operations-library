# Cloud baselines for technology operations

A baseline should answer three questions: what do we want, what have we actually checked, and what would changing it interrupt? These resources turn that discussion into an assessment and a staged configuration plan.

| Platform | Start here | Working files |
|---|---|---|
| Google Workspace | [Configuration and evidence guide](google-workspace/README.md) | [Desired state](google-workspace/desired-state.json), [fictional observations](google-workspace/observed.example.json), [evidence worksheet](google-workspace/evidence-worksheet.csv) |
| Microsoft 365 | [Configuration and evidence guide](microsoft-365/README.md) | [Desired state](microsoft-365/desired-state.json), [fictional observations](microsoft-365/observed.example.json), [evidence worksheet](microsoft-365/evidence-worksheet.csv) |

These are **configuration planning templates**, not vendor policy exports or importable API payloads. Control IDs belong to this library. The assessment tool compares locally supplied, reviewer-recorded assertions; it cannot inspect a tenant, verify evidence, or certify compliance. No credentials, network calls, tenant writes, or dependencies are required.

## Try a complete example

From the repository root, with Node.js 22 or later:

```sh
node baselines/scripts/assess.mjs baselines/google-workspace/desired-state.json baselines/google-workspace/observed.example.json --as-of 2026-09-17
node baselines/scripts/assess.mjs baselines/microsoft-365/desired-state.json baselines/microsoft-365/observed.example.json --as-of 2026-09-17 --json
node --test baselines/tests/assess.test.mjs
```

The supplied observations are deliberately mixed and **entirely fictional**. They include gaps, missing evidence, an unsupported feature, an expired observation, and a scoped non-applicable workload. No example result describes a real firm. Pinning the assessment date makes the examples reproducible; choose the actual review date for an actual assessment.

## Use it in an environment

1. Copy the desired-state file and evidence worksheet into an approved private working location outside this repository. Agree the tenant, workloads, populations, geography, licensing, and evidence age with the service owner.
2. Read every assertion and linked vendor reference. Set environment-specific fields in the copy. The 90-day freshness limit is a proposed review cadence, not a vendor retention setting or regulatory requirement.
3. Collect evidence with an appropriately scoped read-only role where possible. Inspect inheritance, exclusions, effective assignments, and representative sign-ins or sharing tests. A screenshot of the top-level setting alone may not establish effective coverage.
4. Record observations against the exact baseline ID and version. A boolean `true` means the reviewer found evidence for the entire assertion and scope. `false` means a documented gap; `null` means unknown. Leave absent observations absent.
5. Run the comparison locally. Keep raw exports and identifying evidence in your firm's evidence store, using opaque references in the observations. Do not commit completed real-tenant assessments here.
6. Turn gaps into [reviewed change plans](rollout-and-exceptions.md). Apply changes through the vendor's supported administration tools after environment-specific review, then collect fresh evidence.

## Reading the result

| Result | Meaning |
|---|---|
| `aligned` | A fresh, complete, supported reviewer assertion matches the proposed target. This is not an independent tenant check. |
| `gap` | A fresh, complete reviewer assertion contradicts the target. An approved exception remains a gap and is shown separately. |
| `unknown` | Evidence is absent, stale, incomplete, future-dated, unsupported, or the reviewer has not established applicability. |
| `not_applicable` | A reviewer has supplied current scope evidence and a reason the workload/control does not apply. Missing licenses alone are not a reason to exclude a risk. |

The tool intentionally does not calculate a security percentage. Ten easy settings should not hide one untested recovery path. Exit code `0` means the comparison ran, even with gaps; `2` means the input or command was invalid. Use the result statuses, not the exit code, for triage.

## Observation contract

Both files use `schema_version: 1`. The observations must identify the same `baseline_id` and `baseline_version`, set `fictional` explicitly, and describe their environment scope. Each recorded control has an `id`, `applicable` (boolean or null), `value` (boolean or null), `implementation` (`native`, `manual`, `unsupported`, or `unknown`), `scope_complete`, `reviewer`, `observed_at` (UTC timestamp), and `evidence_ref`. Unknowns may leave evidence fields null. An inapplicable assertion needs `not_applicable_reason` plus current evidence. Optional exceptions require `owner`, `reason`, `compensating_control`, and `expires_on`; they never produce an aligned result.

Current vendor documentation was reviewed on **2026-09-17**. Product capabilities, names, and license bundles change; recheck the linked reference for each control before configuring it. [Validation and limits](VALIDATION.md) record what has actually been checked.
