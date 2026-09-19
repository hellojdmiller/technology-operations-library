# Change readiness review

Review a supplied change packet for missing scope, authority, testing, recovery, and verification metadata. This helps a coordinator identify what needs a decision before scheduling work. It cannot grant approval or establish that a referenced test passed.

Use the [change-management pack](../../operations/packs/change-management/README.md) for the operating process. Follow the [n8n import instructions](../README.md) with [workflow.json](workflow.json); inspect the readable [evaluator](evaluate.js) and [fictional input](sample-input.json) before adapting it.

## Included example

The three supplied changes return `needs_review` for the packet and `attentionCount: 2`:

| Change | Expected result |
|---|---|
| EX-CHG-001 | Normal change has the required metadata: `packet_complete_for_review`, with its decision still pending |
| EX-CHG-002 | Standard model does not match and its stated validity expired: `needs_review` |
| EX-CHG-003 | Emergency route, with missing pilot evidence: `manual_emergency_review`; all other gaps remain visible |

These fixture IDs and facts belong to this workflow; the companion pack has separate worked scenarios. Neither set represents performed work.

## Input contract

One n8n item contains one packet. Required fields are `reviewId` (nonblank string), `asOf` (real UTC timestamp ending in `Z`), `snapshotComplete` (boolean), `evidenceRef` (string or null), and `changes` (array). Completeness must come from reconciled collection, not HTTP success. An empty array requires review. Multiple packets return linked results separately.

Every change needs:

| Fields | Type and meaning |
|---|---|
| `requestId`, `changeType` | Unique nonblank ID; `standard`, `normal`, or `emergency` |
| `scopeConfirmed`, `authorizationVerified`, `windowConfirmed` | Boolean or null; only literal `true` satisfies the supplied assertion |
| `scopeEvidenceRef`, `authorizationEvidenceRef` | String or null; pointers to the scoped basis for the assertions |
| `pilotEvidenceRef` | String or null; relevant current pilot result or the qualified standard model's applicable test evidence |
| `recoveryPlanRef`, `verificationPlanRef` | String or null; recovery and outcome-check plans |
| `standardModelMatch` | Boolean or null; exact match to the model's scope and conditions, not name resemblance |
| `standardModelRef`, `standardModelValidUntil` | String/null model reference and UTC timestamp/null validity limit |

Supply all columns even where null. Normal and emergency changes may use null standard-model fields. For standard changes, the match must be true, the reference nonblank, and validity strictly later than `asOf`. At expiry it is no longer current. Null assertions are unknown; strings such as `"true"` are invalid.

An authorized standard model can supply standing approval and applicable test evidence; the operator still needs an exact match and evidence that local conditions allow this execution. An emergency with no conventional pilot stays in manual review. Do not fabricate a test pointer to clear a gate.

## Results and limits

- `invalid_input`: malformed fields, invalid dates, duplicate request IDs, or no incoming packet. No partial success is returned for a malformed packet.
- `needs_review`: incomplete collection, empty scope, missing source evidence, or at least one unresolved change.
- `review_ready`: the supplied packet has no detected metadata gaps. Each clean row is only `packet_complete_for_review` and every decision remains `pending_human_review`.
- `manual_emergency_review`: a row-level route for every emergency, even with complete metadata. It is not permission to bypass an incident or change authority.

References are not fetched. The evaluator does not check approval identity, evidence contents, actual pilot scope, window conflicts, dependencies, authorizer absence, budget, or current target state. It does not calculate a risk score. Do not connect its “ready” label directly to deployment.

Before integrating, add source freshness, pagination, exact target mapping, versioned model checks, and separately verified authority. Use the approved change record as the system of record. Review data handling and execution retention before supplying private details.

## Failure exercises

Remove an approval pointer while leaving the assertion true; use an expired standard model; change a boolean into text; duplicate an ID; supply an empty scope; and route an otherwise complete change as emergency. Compare the returned findings with the rules above. These exercises and the companion tabletop are not records of actual training.

Local Node tests cover the evaluator and generated graph. CLI import and execution passed in the pinned runtime lab. This manual export contains no credentials, schedule, notification, or deployment action. n8n documents [Code node modes](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/) and [manual execution](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualworkflowtrigger/); reviewed September 17, 2026.

## Runtime evidence

On September 19, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8**. The [isolated runtime lab](../../labs/n8n-runtime/README.md) records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
