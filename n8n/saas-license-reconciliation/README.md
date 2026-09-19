# SaaS license reconciliation

Compare purchased seats, application assignments, workforce status, and usage to prepare a license review. The output separates spare capacity from unused or departed-user candidates and keeps technical accounts out of automatic reclamation.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. Inspect the fictional [sample](sample-input.json) and readable [evaluator](evaluate.js).

The sample returns `needs_review`, `totalAssignmentRecords: 4`, `attentionCount: 3`, and `candidateCount: 2`:

- `assignment-002`: unused human license candidate.
- `assignment-003`: leaver license candidate.
- `assignment-004`: service account requiring dependency review; no reclamation candidate is generated.
- `sku-research`: five purchased seats, three distinct assigned people, and two unassigned seats.

Candidate counts and spare capacity are not guaranteed savings. No license is removed.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier and restricted snapshot evidence reference |
| `asOf` | Real `YYYY-MM-DD` date |
| `unusedDays` | Positive integer; inactivity at this threshold becomes a review candidate |
| `snapshotComplete` | Boolean covering the declared billing, assignment, workforce, and usage scope |
| `workforce` | Unique `personId` and `status` (`active` or `leaver`) |
| `subscriptions` | Unique `skuId`, `service`, and integer `purchasedSeats` of zero or greater |
| `assignments` | Unique `assignmentId`, `skuId`, `personId`, `lastUsedOn`, boolean `isServiceAccount`, and `ownerRole` |

`lastUsedOn` is a real date no later than `asOf`, or explicit `null` when activity is unknown. Stable IDs are matched exactly, including case and whitespace. Use the same identity and SKU namespace across sources.

One distinct person–SKU pair counts as one assigned seat. Repeated pairs with different export-row IDs are flagged, counted once for capacity, and excluded from candidate counts until reconciled. Repeated primary IDs make the whole packet `invalid_input`. Unknown people, unknown SKUs, missing owners, unknown usage, and service-account dependencies remain visible.

`subscriptionReview` separates `unassignedSeats` from `overassignedSeats`. A candidate is an unambiguous human assignment with a known SKU and a matched leaver or sufficiently old usage. Human decisions remain pending for every assignment.

`review_ready` means no automated findings. `needs_review` also covers incomplete snapshots, missing evidence, and empty scope. Malformed dates, negative/noninteger seat counts, wrong types, and duplicate primary IDs return `invalid_input`.

## Failure exercises

Duplicate an assignment with a new row ID; the unique seat count must stay unchanged and the candidate must be withheld. Change a SKU to an unknown value; the row must remain visible. Lower purchased seats below distinct assignments; overassignment must appear separately from spare capacity. Remove activity from a service account; it must remain a dependency review, not an unused-seat candidate.

## Connect to real sources

Collect read-only billing/subscription, application assignment, authoritative workforce, and application-specific usage exports. Map direct/group-based assignment records into the same seat-counting unit. This contract does not model consumption, concurrent licensing, guest entitlements, pooled capacity, device licensing, or multiple units per person–SKU pair; use a separate model for those products.

Check reporting lag, excluded applications, users with recent leave, service dependencies, retention/hold requirements, and reassignment rules before deciding. Confirm whether the agreement allows quantity reductions and when they take effect. Keep detailed source exports outside the repository and restrict n8n execution access. A later removal step requires a separate authorized change and an independent post-change check.

Implementation reference: [n8n data structure](https://docs.n8n.io/build/work-with-data/understand-n8ns-data-structure), checked 2026-09-17. Local evaluator tests and the pinned runtime lab cover this example.

## Runtime evidence

On September 19, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8**. The [isolated runtime lab](../../labs/n8n-runtime/README.md) records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
