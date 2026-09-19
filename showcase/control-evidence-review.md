# Turn control evidence into a review queue

**Walkthrough · offline CLI · fictional data.** [Canonical sample](../work-samples/control-evidence-review/README.md) · [Source](../work-samples/control-evidence-review/review.mjs) · [Fixture](../work-samples/control-evidence-review/inventory.example.json)

## The problem and the intended user

A control register can record that a setting exists and still lack evidence that it works. This example helps an IT or cyber-risk operator inspect those differences before presenting a control assessment.

In the fictional identity pilot, `REVIEW-001` claims an effective control but references configuration evidence only. In the fictional diligence workspace, `REVIEW-002` includes a removed collaborator who can still open a document, alongside an approved exception. The review must retain both the adverse result and the exception.

## Run it

From the repository root, using Node.js with its built-in test runner:

```sh
node work-samples/control-evidence-review/review.mjs \
  --input work-samples/control-evidence-review/inventory.example.json \
  --as-of 2026-09-17

node --test work-samples/control-evidence-review/tests/review.test.mjs
```

No installation, account, or credentials are needed. The program reads the supplied local JSON and writes to standard output. The fixed review date is intentional: it reproduces the fixture's stale and future evidence cases. It is not a claim that the evidence was collected on the date this walkthrough was checked.

For the structured report:

```sh
node work-samples/control-evidence-review/review.mjs \
  --input work-samples/control-evidence-review/inventory.example.json \
  --as-of 2026-09-17 --format json
```

## What to expect

The observed report begins:

```text
Control evidence review | 2026-09-17 | FICTIONAL INPUT
Reviews supplied metadata only. Evidence contents, scope completeness, approval authority, tenant state, and actual control effectiveness are not verified.
8 assessments; 6 require review; 28 review items.
```

It also lists `E-UNLINKED` as evidence not counted toward an assessment. A valid report exits **0 even when review items exist**. Exit status describes whether the program could produce the report; the report contains the operational findings.

## Inspect the reasoning

| Look at | What should stay visible |
|---|---|
| `REVIEW-001` | `support_recorded` for implementation, but `no_usable_evidence` for operation and an unsupported effectiveness claim |
| `REVIEW-002` | The adverse test result and active exception as separate items |
| `REVIEW-004` | Support limited to the documented synthetic restore sample |
| `REVIEW-007` | Conflicting test results; a positive record does not clear the contrary result |

Compare the complete result with the canonical [expected text report](../work-samples/control-evidence-review/expected-report.example.txt) or [expected JSON](../work-samples/control-evidence-review/expected-report.example.json). Review items are reasons to investigate. Twenty-eight items is neither a risk score nor twenty-eight unique risks.

## Validation and next step

On September 18, 2026, Node.js v26.7.0 passed **26 tests**, including exact expected reports, malformed input, dates, evidence associations, exceptions, conflicting observations, and CLI behavior. The fixture was also run directly and produced the counts above.

The next step is to use the [evidence register](../cyber-risk/templates/evidence-register.csv) and [control test record](../cyber-risk/templates/control-test-record.md) to understand what a reviewer would need. This program does not open the evidence pointers, assess their contents, verify approvers, or inspect tenant configuration. A synthetic metadata result establishes no real control assurance.

[Choose another example](README.md).
