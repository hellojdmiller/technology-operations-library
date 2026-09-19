# Backup and recovery evidence review

Compare supplied recovery evidence with each workload's objectives. This separates the time a backup job finished from the age of the data it protects, and separates backup evidence from measured restore performance.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md) and execute manually. See [sample-input.json](sample-input.json) and [evaluate.js](evaluate.js).

The fictional sample returns `needs_review`, `totalWorkloads: 3`, and `attentionCount: 2`:

| Workload | Expected result |
|---|---|
| `workload-001` | `evidence_current`; supplied values are within the example objectives |
| `workload-002` | Recovery point is 48 hours old despite a recent completed job; restore test is stale, and measured recovery duration/data loss exceed the objectives |
| `workload-003` | Backup and restore evidence remain unknown or untested |

## Input contract

Supply one n8n item per review packet with `reviewId`, `asOf`, boolean `snapshotComplete`, `evidenceRef`, and `workloads`.

Use explicit UTC timestamps such as `2026-09-17T12:00:00Z` or `2026-09-17T12:00:00.000Z`. Numeric offset timestamps and date-only strings are rejected; normalize upstream without losing the original observation. Evidence timestamps must not be later than `asOf`.

Each workload needs a unique `workloadId`, `ownerRole`, finite positive `rpoHours`, `rtoHours`, `restoreTestMaxAgeDays`, and these nested objects:

| Object | Fields |
|---|---|
| `backup` | `state` (`success`, `failed`, `unknown`), `recoveryPointAt`, `lastJobAt`, `evidenceRef` |
| `restoreTest` | `outcome` (`passed`, `failed`, `not_tested`), `completedAt`, `recoveryDurationMinutes`, `dataLossMinutes`, `evidenceRef` |

Unknown timestamps and measurements must be explicit `null`. Known measurements are finite nonnegative numbers. `recoveryPointAt` is the protected data point; it cannot be later than `lastJobAt`, the corresponding backup completion time. Blank evidence references and unknown fields remain findings rather than becoming zero.

The recovery point's age is compared with the recovery point objective (RPO). Test duration is compared with the recovery time objective (RTO). Measured data loss is compared with RPO. Equality at a threshold passes; greater values flag review. Restore-test age is evaluated separately. Zero-objective workloads need a different contract; this example rejects a zero RPO/RTO instead of pretending a periodic sample proves continuous availability.

`invalid_input` means malformed or contradictory observations. `needs_review` means a finding, incomplete snapshot, missing inventory evidence, or empty scope. `review_ready` means no automated findings in supplied evidence, not recoverability certification.

## Failure exercises

Keep a recent successful job but move its recovery point two days earlier. Remove restore duration instead of setting it to zero. Set an observation in the future or a recovery point after its backup completion. Mark a restore failed even if its measured time is short. The workflow must preserve the gap or reject the contradictory packet.

## Connect to real sources

Reconcile a service/workload inventory with backup coverage first; a backup console alone cannot identify every unprotected system. Collect the last job, its actual recovery point, and the latest relevant restore exercise using read-only exports or API calls. Reconcile pagination, reporting delay, exclusions, and the observation timestamp before marking the snapshot complete.

Verify that the restore exercise covered the current workload, data integrity, permissions, application use, dependent services, and the agreed start/end of the recovery clock. Store evidence in a restricted location. This workflow references that evidence; it does not fetch it, launch jobs, perform restores, or verify the business outcome.

Implementation reference: [n8n Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), checked 2026-09-17. Local evaluator tests and the pinned runtime lab cover this example.

## Runtime evidence

On September 19, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8**. The [isolated runtime lab](../../labs/n8n-runtime/README.md) records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
