# Vendor renewal triage

Turn a vendor register into a dated review queue. A renewal 60 days away can already have a missed cancellation deadline, so this workflow orders work by the supplied notice period. It keeps business dependency, decision evidence, exit preparation, and notice delivery visible.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md) and execute manually. Inspect [sample-input.json](sample-input.json) and [evaluate.js](evaluate.js).

The sample returns `needs_review`, `totalVendors: 3`, and `attentionCount: 2`:

| Vendor | Deadline | Queue |
|---|---|---|
| `vendor-001` | 2026-09-01; passed 16 days before review | `deadline_passed` |
| `vendor-002` | 2026-10-02; 15 days after review | `decision_due` |
| `vendor-003` | 2027-01-30; documented renewal decision | `decision_recorded` |

The first vendor also needs business-dependency review. Annual costs remain in their original currencies and are not summed.

## Input contract

Supply one n8n item per register review.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier and restricted register evidence reference |
| `asOf` | Real `YYYY-MM-DD` review date |
| `planningWindowDays` | Positive integer; an unresolved deadline within this many days becomes due |
| `registerComplete` | Boolean confirming the declared vendor scope has been reconciled |
| `vendors` | Array of the vendor records below; `vendorId` must be unique |

Each vendor needs `vendorId`, `service`, `ownerRole`, real `renewalOn`, integer `noticeDays` from 0–3650, boolean `autoRenews`, finite nonnegative `annualCost`, three-letter uppercase `currency`, `criticality` (`critical` or `standard`), `decision` (`undecided`, `renew`, or `exit`), `decisionEvidenceRef`, boolean `exitPlanReady`, boolean `noticeSent`, `noticeDeliveredOn` (real date no later than `asOf`, or explicit `null`), and `noticeEvidenceRef`. Currency shape is checked, not membership of an ISO currency list.

The calculated deadline is `renewalOn - noticeDays` in UTC calendar days. A same-day deadline is still due. An exit decision remains exposed when notice is unverified, even if the internal decision is documented. Delivery after the calculated deadline remains a finding. Missing ownership, decision evidence, an exit plan, a delivery date, or notice evidence stays visible. A past renewal date flags the need to confirm the current contract term.

`invalid_input` means the packet is malformed. `needs_review` means a packet issue or vendor finding exists. `review_ready` means the supplied register has no automated findings; it does not approve a purchase or terminate a contract. Empty or incomplete registers do not pass.

## Failure exercises

Change a decision to `exit` and add decision evidence but leave `noticeSent: false`; the missed deadline must remain exposed. Set the review date equal to a notice deadline; the row must be due. Change `noticeDays` to the string `"60"`; the packet must be invalid. Remove the owner or use a past renewal date; the finding must remain visible.

## Connect to real sources

Use read-only contract-register and procurement exports. Have the responsible owner extract the relevant deadline from the actual agreement and verify calendar versus business days, notice method, receipt requirements, time zone, amendments, and current term. This example performs date arithmetic; it does not interpret contract language.

Add usage, dependency, data export, alternative cost, and exit effort to the surrounding decision record. Test source pagination and stale-register handling before scheduling reviews. A later ticket or email step should create an internal review task only after its destination and owner are configured. No messages, orders, cancellations, or renewals occur in this workflow.

Implementation reference: [n8n Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), checked 2026-09-17. Local evaluator tests and the pinned runtime lab cover this example.

## Runtime evidence

On September 19, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8**. The [isolated runtime lab](../../labs/n8n-runtime/README.md) records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
