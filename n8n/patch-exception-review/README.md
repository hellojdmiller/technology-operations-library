# Patch and exception review

Build a review queue from supplied remediation observations, local deadlines, and exception records. Keep uncertain applicability, stale verification, exploitation concerns, and overdue work visible. An exception is a decision to manage risk for a defined period; it is not evidence that a vulnerability was fixed.

Use the [patching pack](../../operations/packs/patching/README.md) to decide scope, urgency, deployment, and closure. Follow the [import instructions](../README.md) for [workflow.json](workflow.json); [evaluator](evaluate.js) and [fictional sample](sample-input.json) are included.

## Included example

The packet returns `needs_review`, three findings, and two needing attention:

| Finding | Expected result |
|---|---|
| EX-FIND-001 | Supplied applicability and recent fixed-state evidence are ready for human review |
| EX-FIND-002 | Still vulnerable, original deadline passed, exploitation assessment required, and exception expires exactly at the review time |
| EX-FIND-003 | Applicability, exploitation status, observation, and target are unknown |

The seven-day freshness parameter and all dates are fictional. The sample asserts no real CVE, active exploitation event, adopted remediation deadline, or completed patch.

## Input contract

Each item contains `reviewId`, `asOf` (real UTC timestamp ending in `Z`), `snapshotComplete` (boolean), `evidenceRef` (string/null), `maxAgeDays` (positive finite number), and `findings` (array). Every finding requires:

| Fields | Type and meaning |
|---|---|
| `findingId`, `assetId` | Nonblank strings; finding ID uniquely identifies this asset-specific finding instance |
| `ownerRole` | String/null; accountable remediation owner |
| `applicability`, `applicabilityEvidenceRef` | `affected`, `not_affected`, or `unknown`; string/null evidence pointer |
| `exploited` | Boolean/null supplied intelligence flag; true requests assessment, not a claim that this asset was compromised |
| `dueAt` | UTC timestamp/null; locally determined target, never invented by this evaluator |
| `observation` | Object containing `state` (`vulnerable`, `fixed`, or `unknown`), `observedAt` (UTC/null), and `evidenceRef` (string/null) |
| `exception` | Null or the complete object described below |

Exception objects require `approvalVerified`, `scopeConfirmed` (boolean/null), `effectiveAt`, `expiresAt` (UTC timestamps), `approvalRef`, and `mitigationEvidenceRef` (string/null). Expiry must be strictly later than its start. Actual observation time cannot be later than `asOf`. Supply null for unknown optional values; strings masquerading as booleans or missing required fields are invalid.

Exceptions whose assertion, scope, or references are incomplete remain unsupported. A structurally documented exception must have begun and must expire strictly after `asOf`; at the exact expiry it is expired. Even a current exception stays in the human-review queue. Its pointers and actual mitigating controls still need verification.

## Interpretation

The evaluator requires current observation evidence and supported applicability before treating an affected/fixed finding as ready. A supported `not_affected` assertion also needs a fresh noncontradictory observation packet; the observation may be unknown because an applicability decision, rather than a repair, is being reviewed. A vulnerable observation contradicting `not_affected` is flagged.

Unresolved work with a target before `asOf` is `remediation_overdue`; exact equality is `remediation_due_now`. A null target is missing, not unlimited time. Exception status does not suppress those findings or advance the deadline. Unsupported or stale “fixed” assertions remain unresolved.

`targetDatePassed` only compares the target date to the review time. It cannot establish a historical breach: a fix might have completed before that date. Historical attainment needs immutable event history and is outside this evaluator. A true exploitation flag remains a separate assessment finding even with a recent fixed observation; patching alone does not establish whether compromise occurred.

Packet statuses are `invalid_input`, `needs_review`, or `review_ready`. A row without findings is only `supplied_evidence_ready`, never automatically closed. All decisions remain `pending_human_review`. No patch, exception approval, notification, or ticket update is performed.

## Failure exercises and adoption

Test a current exception on overdue work, exact exception expiry, future exception start, false approval, stale fixed observation, contradictory applicability, missing due date, duplicate finding ID, and future/invalid dates. An empty scope or incomplete snapshot must remain unresolved.

Before real integration, verify source coverage, asset/finding mapping, applicability, local deadline authority, intelligence freshness, observation meaning, and exception scope. Preserve original deadlines and observed history. Reference actual campaign and change records in the protected system. Do not use absence from a partial scanner result as proof of repair.

Local tests exercise the evaluator and export. Import/runtime behavior in a selected n8n version and real collectors remain untested. See official [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/) and [Manual Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualworkflowtrigger/) guidance, reviewed September 17, 2026.
