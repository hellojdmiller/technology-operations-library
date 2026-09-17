# Access review preparation

Prepare a review queue by matching human application grants to an authoritative workforce snapshot. This helps an IT operator separate routine decisions from leaver access, unknown identities, dormant grants, privilege, and missing ownership. It is especially useful before reviewing research, deal, finance, and collaboration workspaces.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. [sample-input.json](sample-input.json) contains fictional inputs; [evaluate.js](evaluate.js) is the readable logic.

The sample returns `needs_review`, `totalGrants: 3`, and `exceptionCount: 2`:

| Grant | Expected result |
|---|---|
| `grant-001` | No automated findings; human decision remains pending |
| `grant-002` | Leaver has privileged access; usage unknown |
| `grant-003` | Application owner missing; access unused for 139 days |

`review_ready` means the supplied packet has no automated findings. It does not approve access. Every row has `decision: pending_human_review`.

## Input contract

Supply one n8n item per review packet, using the sample's nested structure.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Nonblank review identifier and restricted snapshot evidence reference |
| `asOf` | Review date, `YYYY-MM-DD`; comparisons use UTC calendar days |
| `dormantDays` | Positive integer chosen for the application; threshold is inclusive |
| `snapshotComplete` | Boolean indicating that collectors reconciled scope and pagination |
| `workforce` | Array of unique `personId`, `status` (`active` or `leaver`), and `managerRole` |
| `grants` | Array of unique `grantId`, `personId`, `application`, `accessRole`, boolean `privileged`, `lastUsedOn`, and `ownerRole` |

Use exact, stable IDs in the same namespace; comparison preserves case and whitespace. `lastUsedOn` is a real date no later than `asOf`, or explicit `null` for unknown activity. Missing owner/reviewer roles and evidence become review findings. Malformed fields, duplicate workforce IDs, duplicate grant IDs, and future activity dates return `invalid_input`.

An incomplete snapshot, empty workforce/grant scope, or missing snapshot evidence prevents `review_ready`. A clean packet still cannot reveal grants absent from the source export. Exclude service principals and shared technical accounts from this human-grant contract and review them through a separate ownership/dependency process.

## Failure exercises

Change a `personId` to an unknown ID; the grant must remain visible. Set activity exactly 90 days before the sample review date; it must flag dormant access. Duplicate a workforce ID; the packet must be invalid rather than choosing an arbitrary person. Remove the evidence reference; the review must remain unresolved.

## Connect to real sources

Replace the sample-data node with read-only workforce and application-grant collectors, then map them into one packet. Keep the source timestamp, collection scope, export totals, and exceptions in the referenced evidence. A group's direct membership export may omit inherited or nested access; flatten or explicitly identify the entitlement basis before matching. Reconcile each application separately and resolve ambiguous identities before sending the packet for human decisions.

Configure credentials in n8n's credential store, restrict execution-data retention, and use a test workspace first. The evaluator does not fetch evidence or take action. If adding tickets later, gate on both packet status and individual findings, assign an owner, and keep authorization and verified removal separate.

Implementation reference: [n8n Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), checked 2026-09-17. Local tests cover the evaluator; n8n import and runtime execution are not yet verified.
