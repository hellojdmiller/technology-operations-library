# Joiner, mover, and leaver completeness review

Check lifecycle cases against a declared task catalog and case-specific additions. The useful question is whether approved scope has corresponding completion evidence, including removal of prior access after a move and handover after a departure.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. The [sample](sample-input.json) is fictional; inspect [evaluate.js](evaluate.js) to review the logic.

The sample returns `needs_review`, `totalCases: 2`, and `openCaseCount: 1`:

- `case-001`: two incomplete tasks. Application access is marked complete without evidence, and data handover is absent. The effective date has passed.
- `case-002`: `evidence_complete`. Its additional deal-workspace task has a documented not-applicable exception. Human approval remains pending.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier and restricted lifecycle-register evidence reference |
| `asOf`, `snapshotComplete` | Real `YYYY-MM-DD` date and boolean completeness statement |
| `requiredTasks` | Object with nonempty `joiner`, `mover`, and `leaver` arrays of unique task IDs |
| `cases` | Array with unique `caseId` values |

Each case needs `caseId`, `type` (`joiner`, `mover`, or `leaver`), real `effectiveOn`, `ownerRole`, boolean `scopeApproved`, `scopeApprovalRef`, `additionalRequiredTaskIds` (array, possibly empty), and `tasks` (array).

Each task needs a unique `taskId`, a `state`, and `verifiedOn` (real date no later than `asOf`, or explicit `null`). The supported states are:

| State | Evidence needed to close the automated gap |
|---|---|
| `complete` | Nonblank `evidenceRef` and a verification date |
| `not_applicable` | Nonblank `exceptionRef` for the approved exception |
| `pending` / `blocked` | Always an open gap |

Use `evidenceRef` and `exceptionRef` as blank strings when absent. A required task missing from `tasks` remains visible. Supplied tasks outside the declared scope are flagged. Duplicate case/task IDs, invalid states/dates, and empty task catalogs return `invalid_input`.

`review_ready` means the supplied packet has complete evidence references and no automated findings. It does not verify their contents or approve access. `needs_review` covers case gaps, missing owner/scope approval, incomplete input collection, missing packet evidence, or empty case scope.

## Failure exercises

Mark a task complete but remove its evidence. Omit a required task entirely. Use `not_applicable` without an exception. Add an unapproved task or duplicate a task ID. Remove scope approval. Each must remain visible or make the packet invalid, as appropriate.

## Connect to real sources

Collect the authoritative workforce-change roster and ticket/checklist records read-only. Reconcile case counts first, then map stable case and task IDs into this contract. Adapt the example task catalog to the firm's actual identity, endpoint, SaaS, physical-access, data-handover, retention, and investment-information scope. It is intentionally a small fixture, not a complete onboarding or offboarding standard.

Record who approved scope, who executed each change, and who independently verified the system result. A closed ticket is only one observation. Effective dates here use whole UTC days; access revocation needs an exact agreed deadline, time zone, exception handling, and escalation outside this report. The workflow does not provision, disable, remove, or notify anyone.

Implementation reference: [n8n data structure](https://docs.n8n.io/build/work-with-data/understand-n8ns-data-structure), checked 2026-09-17. Local tests cover the evaluator; n8n import and runtime execution are not yet verified.
