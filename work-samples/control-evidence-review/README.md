# Offline control evidence review

An evidence register can look complete while its records are old, cover the wrong service, or describe configuration without testing behavior. This sample turns a supplied inventory into a review queue while keeping the original claims and evidence limitations visible.

It reads **one local JSON file**, performs no network calls, and writes text or JSON to standard output. It does not open evidence references, inspect evidence contents, verify approvals, assess tenant settings, change controls, or assign a compliance score. All included records and evidence labels are fictional.

## Run the example

From the repository root, using Node.js with its built-in test runner; no packages or installation step are needed:

```sh
node work-samples/control-evidence-review/review.mjs \
  --input work-samples/control-evidence-review/inventory.example.json \
  --as-of 2026-09-17

node work-samples/control-evidence-review/review.mjs \
  --input work-samples/control-evidence-review/inventory.example.json \
  --as-of 2026-09-17 --format json

node --test work-samples/control-evidence-review/tests/review.test.mjs
```

The review date is required so results are reproducible. The default format is text. A valid review exits `0` even when it identifies issues; inspect `summary` and `review_queue`. Malformed inputs, unsupported arguments, or unreadable files exit `1`. `--help` describes the interface. The CLI creates no files; save its output only to a destination appropriate for the input's sensitivity.

Files:

| File | Purpose |
| --- | --- |
| [review.mjs](review.mjs) | Dependency-free metadata reviewer and CLI. |
| [inventory.example.json](inventory.example.json) | Eight fictional assessments and 13 fictional evidence records. |
| [expected-report.example.txt](expected-report.example.txt) | Reproducible readable output at the example review date. |
| [expected-report.example.json](expected-report.example.json) | Same result with complete observations and structured review tasks. |
| [tests/review.test.mjs](tests/review.test.mjs) | Behavioral and command-line tests. |

## What the example shows

| Assessment | Example | Result to notice |
| --- | --- | --- |
| REVIEW-001 / VCIT-005 | An authentication configuration exists, but no behavior test is supplied. | The effectiveness claim is unsupported. Configuration never substitutes for an operating test. |
| REVIEW-002 / VCIT-015 | A removed collaborator retains access in the fictional test. An exception is approved. | The adverse result and exception remain separate review items. |
| REVIEW-003 / VCIT-026 | Logging evidence is stale, future-dated, or missing. | None of those records can substantiate the current claim. |
| REVIEW-004 / VCIT-030 | Current metadata describes an isolated synthetic restore exercise. | Support applies to the documented sample; production recovery is not established. |
| REVIEW-005 / VCIT-034 | Evidence identifies a different control, scope, and version. The exception has expired. | All mismatches remain visible and expiry is escalated. |
| REVIEW-006 / VCIT-032 | An AI proposal is still a draft and its exception has only been proposed. | Neither is treated as an approval. |
| REVIEW-007 / VCIT-035 | Positive and adverse AI evaluation records coexist. | A positive record does not automatically clear a contrary result. |
| REVIEW-008 / VCIT-009 | A fictional manual-only workspace records no automation identities. | Inapplicability needs a rationale and current scope-review metadata. |

The example also includes one unlinked evidence record. It is listed explicitly and contributes to no assessment. The expected output has **8 assessments, 6 requiring review, 28 review items, and 1 unlinked evidence record**. Review items are reasons to investigate, not unique risks or a severity score.

## Input contract

The schema version is `1`. Copy the fictional input as a shape example, then keep any actual inventory outside this repository. Set `fictional` accurately. This marker labels the report; it is not a privacy filter or proof that the file is safe to share.

Each assessment needs:

- A unique `assessment_id`, a `control_id` from `VCIT-001` through `VCIT-036`, and an accountable `owner_role`.
- A `scope` with `id`, human-readable `label`, and `version`. Use a different version after a material change; old evidence must not silently carry forward.
- `intended_state.status` (`approved`, `draft`, `not_defined`, or `unknown`) and `reference` (a label or explicit `null`). An approved claim without a reference is queued for review.
- Separate `implementation_claim` and `operating_effectiveness_claim`, using the [control library vocabulary](../../cyber-risk/controls/README.md). The tool never rewrites these supplied claims.
- `applicability.status` (`applicable`, `unknown`, or `not_applicable`) and `rationale` (text or `null`). Inapplicability requires a rationale, matching `scope_review` evidence, and consistent claims.
- `max_evidence_age_days`, a nonnegative integer chosen by the reviewer, and an array of unique `evidence_refs`. The example uses 30 days solely to demonstrate behavior; this is not a security standard or recommended universal cadence. The parser rejects values above 36,500 days as an input sanity bound.
- An `exception` with `status` (`none`, `proposed`, `approved`, or `expired`). Non-`none` records also need `owner_role`, `reason`, `scope_id`, `compensating_measures`, `expires_on` (date or `null`), and `approval_reference` (text or `null`). Incomplete approval records and scope mismatches create review items. The field records a claim; the tool does not verify approval authority or compensating measures.

Each evidence item needs a unique `evidence_id`, `control_id`, `scope_id`, `scope_version`, `kind`, `result`, `observed_on`, `reviewer_role`, `private_reference`, `population`, `sample`, and `limitations`. Use opaque evidence labels instead of sensitive file contents or broadly accessible URLs. `observed_on`, `reviewer_role`, and `private_reference` can be explicit `null`; this produces a visible evidence gap. Other required text must be present.

`kind` distinguishes `implementation`, `operating_test`, and `scope_review`. `result` is the supplied observation: `supports_intended_state`, `contradicts_intended_state`, or `inconclusive`. These are assertions supplied by a person or upstream process, not outcomes independently verified by this program. A real control test record should document expected behavior, actual behavior, authorization, population, sample, and limitations.

Dates must be real `YYYY-MM-DD` calendar dates. Age uses whole UTC calendar days; evidence exactly at the supplied age limit remains eligible. Future evidence is ineligible. An exception remains active through its stated expiry date and is expired on the following day. Use a more precise timestamp-based process if your decisions require same-day time boundaries.

## Reading the result

Implementation, operating-test, and scope evidence are summarized independently. A positive implementation record produces `support_recorded`. A positive operating test produces `support_for_documented_sample`; the CLI never emits a blanket finding that the control is effective. Negative, conflicting, and inconclusive results have distinct states. Metadata eligibility establishes only that required fields, dates, and associations passed these local checks.

Missing, stale, future-dated, incomplete, or mismatched records remain in the report but cannot support the current summary. Excluded adverse records receive an additional action: exclusion is not remediation. An old failure needs an explicit disposition or appropriate retest in the evidence process. This small sample intentionally does not automate failure closure or supersession.

The queue retains reported implementation gaps, operating failures, and unknown claims even when other records appear supportive. It also retains exception reviews instead of converting approvals into passes. A record with no metadata review issues still requires a human to inspect the underlying evidence, judge sample coverage, and make the actual risk decision. No issue count is a risk score, maturity rating, or certification result.

Use the [evidence register](../../cyber-risk/templates/evidence-register.csv) and [control test record](../../cyber-risk/templates/control-test-record.md) to collect a reviewable record. This JSON shape is an intentionally small example, not an automatic importer for those templates. Use the [platform baselines](../../baselines/README.md) separately for desired-state setting comparisons; this sample evaluates cross-service evidence metadata and the review work it leaves unresolved.

## Validation and limits

Validated locally on **2026-09-17 with Node.js v26.7.0**: 26 tests cover configuration-only claims, freshness boundaries, future/missing evidence, scope and control mismatches, contrary results, exception lifecycle, unknown claims, inapplicability, duplicate/invalid input, deterministic reports, and CLI errors. The test also checks the allowed control IDs against the 36-row source library.

No dependencies were installed. No external APIs, evidence links, tenants, real accounts, or production data were accessed. The code was exercised only with synthetic local metadata. Adapting it for actual evidence requires a private storage/access process and human review; this example intentionally makes no live-control assertion.
