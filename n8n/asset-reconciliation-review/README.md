# Asset reconciliation review

Compare an asset register with supplied management and custody observations. Surface missing assets, unexpected records, stale evidence, and conflicting custodians without modifying an inventory or authorizing retirement. Management enrollment, physical custody, security configuration, and legal ownership are different claims.

Use the [asset-lifecycle pack](../../operations/packs/asset-lifecycle/README.md) for decisions and procedures. Follow the [import instructions](../README.md) for [workflow.json](workflow.json). The [source](evaluate.js) and [sample](sample-input.json) are included.

## Included example

Three inventory records and three observation records produce **four distinct asset IDs**, with three requiring attention:

| Asset | Expected finding |
|---|---|
| EX-ASSET-001 | Supplied records consistent; no operational approval implied |
| EX-ASSET-002 | Management observation is 16.125 days old, management status unknown, and custodian differs; custody evidence is only 0.125 days old |
| EX-ASSET-003 | Inventory asset has no corresponding observation |
| EX-ASSET-004 | Observation is absent from the supplied inventory |

The packet returns `needs_review`, `totalRows: 4`, `attentionCount: 3`. Equal input counts do not establish equal populations. The fictional freshness threshold of seven days is a fixture parameter, not a recommended universal review interval.

## Input contract

One item contains `reviewId` (nonblank string), `asOf` (UTC timestamp), `snapshotComplete` (boolean), `evidenceRef` (string/null), `maxAgeDays` (positive finite number), `inventory` (array), and `observations` (array). Timestamps must be real and end in `Z`.

Inventory rows require:

| Field | Meaning |
|---|---|
| `assetId` | Nonblank unique identity in the reconciled namespace |
| `lifecycle` | `assigned`, `stock`, `repair`, or `retired` |
| `ownerRole` | String/null; accountable owner, separate from physical custodian |
| `custodianId` | String/null; expected custodian where known, with a value required for assigned assets |
| `requiresManagement` | Boolean; the locally adopted requirement for this asset type |

Observation rows require `assetId`, `managed` (boolean/null), `custodianId` (string/null), `managementObservedAt`, `custodyObservedAt` (UTC timestamp/null), `managementEvidenceRef`, and `custodyEvidenceRef` (string/null). Times cannot be later than `asOf`.

Management and custody ages are calculated separately. A fresh receipt must not replace an old management timestamp. Record the actual observation time, not when an export was downloaded. Evidence pointers are required independently for each relevant claim. This flow does not inspect their contents.

Map device IDs to the asset ID namespace upstream using verified mappings. Do not join by employee name or assume a serial number identifies an entire virtual or multi-component asset. IDs are exact and case-sensitive, including whitespace. Duplicates within either array invalidate the packet so conflicting observations cannot silently overwrite each other. Reconcile duplicates with retained evidence before retrying.

## Decision rules

The output covers the union of inventory and observed IDs. Missing matches are always visible. Required management must have a literal true assertion, timestamp, and evidence. A missing timestamp remains unknown. Age strictly greater than `maxAgeDays` is stale; equality is within the fixture threshold.

Assigned assets need a known custodian in both records. Differing known custodians require review. A known observed custodian with no expected custodian is also flagged. Non-retired assets require current custody evidence even when no person is assigned; use an approved location/custody observation and record its meaning upstream. Retired assets with any observation are flagged for reconciliation; that flag alone does not prove the device is active or should be deleted.

Malformed or duplicate data yields `invalid_input`. Unresolved rows, incomplete collection, missing source evidence, or empty inventory produce `needs_review`. Otherwise the packet is `review_ready` and rows say `supplied_records_consistent`. All decisions remain `pending_human_review`.

This review does not verify encryption, recovery-key custody, security-agent health, finance records, retention holds, title, wipe success, or sanitization. It does not remove management, release enrollment ownership, or update depreciation. A clean comparison is not authorization to sell or dispose of an asset.

## Failure exercises and integration

Try an observation-only ID, duplicate IDs, missing management evidence, null custodian, future date, stale management with fresh custody, and a retired asset still present. Keep missing-source failures distinct from observations of a real unmanaged device.

For a real collector, reconcile pages and source scopes, retain unmapped IDs, preserve both observation timestamps, and emit an explicit incomplete packet when collection fails. Store private identifiers and custody records in the approved restricted system. No collector or external write is included.

Local evaluator and exported-graph tests pass; n8n import/runtime and actual inventory collection remain untested. Manual execution uses the documented [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/) and [Manual Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualworkflowtrigger/), reviewed September 17, 2026.
