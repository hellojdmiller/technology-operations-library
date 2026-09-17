# Request pipeline reconciliation and recovery

> Adapted operational example, version 0.1. The systems, references, and scenario below are fictional and deliberately vendor-neutral. This SOP does not activate a workflow or authorize replay in any real environment. Keep operational payloads, identities, and incident evidence in protected systems.

## Trigger and scope

Start when a submitted request is missing, duplicated, stalled, routed incorrectly, or inconsistent with its downstream result. Cover intake, approval handoff, execution tracking, and completion reporting. Examples include access requests, service changes, procurement intake, and engineering work.

The goal is to reconcile one logical request with its authorized outcomes and recover only the incomplete work. A successful automation run does not necessarily prove a business change succeeded; a failed run does not prove the change never happened. Approval is a business decision and must not be recreated by retry logic.

## Preconditions and decision boundaries

Identify the pipeline owner, execution operator, business request owner, approved evidence location, and authoritative record for each kind of fact. Document current architecture in the protected runbook; this example assumes no particular products or queue technology. Have read access to intake, execution history, downstream audit state, and relevant approval references. If a log is missing or outside retention, record the gap before deciding a replay is safe.

| Boundary | Responsible role and output |
|---|---|
| Recommendation | Analyst reconciles evidence and proposes no-op, state repair, scoped retry, compensation, or manual resolution. |
| Approval | Pipeline/service owner authorizes recovery scope and interruption; business approver revalidates expired or changed authorization; incident lead governs suspected compromise. |
| Execution | Authorized operator performs the approved recovery once, coordinating with automatic workers and other operators. |
| Verification | Reviewer checks downstream results and authoritative request state, including duplicate and unintended side effects. |

## Establish the record model

Keep these references distinct. A correlation identifier helps trace activity; it does not itself prevent duplicate writes.

| Reference | Meaning and source of truth |
|---|---|
| Logical request ID | Stable identity of the user's intended request in the approved request record. |
| Approval reference and version | Decision for a specific target, scope, conditions, and validity; authoritative approval record. |
| Correlation ID | Trace link across components. Link multiple correlations if an implementation creates new ones per delivery. |
| Operation/deduplication key | Stable identity for one intended side effect, with documented uniqueness scope and retention. It must not be regenerated merely to force a retry. |
| Attempt/execution ID | One actual invocation, including retry count, timestamps, version, and result. |
| Downstream object/action ID | The resource or operation actually created or changed, verified in the system that owns it. |

Store only metadata and protected payload references in the recovery ledger. Where payload integrity matters, compare approved versions or protected digests. Do not put secrets into IDs, URLs, or general-purpose logs.

## Procedure

1. **Open a recovery record and assign ownership.** Link the affected logical request(s), symptom, first observed time and zone, business impact, operator, and next update. Record the last known good transition and current uncertainty. If several requests are affected, bound the affected interval and population instead of assuming every run failed.
2. **Control competing execution.** Identify schedules, automatic retries, queued work, manual operators, and provider retries. Under approved authority, hold only the affected processing scope or use the system's supported coordination mechanism. Confirm whether in-flight work can still complete. A pause request is not proof that workers stopped; record the actual state before starting recovery.
3. **Reconstruct the request.** Link intake receipt, authoritative request record, approval/version, execution attempts, error details, and downstream records using stable identifiers. Determine whether an informal report was ever accepted into the approved intake system. Search metadata rather than collecting unnecessary request contents. Confirm the requester still needs the outcome.
4. **Check the destination before retrying.** Read current downstream state and audit history for every side effect, including notifications. If the original operation returned a timeout or connection error, check whether it committed despite the missing response. Where an API is eventually consistent, apply its documented read/operation-status checks and visibility interval; one empty search is not enough. If the destination remains unavailable, keep the outcome unknown.
5. **Classify each operation.** Use the decision table below. A multi-step request can contain completed, pending, and failed steps at once. Record evidence per step rather than assigning one misleading success/failure state to the entire request.
6. **Validate recovery eligibility.** Confirm target, approval validity, current data version, prerequisites, authorization scope, duplicate protection, key-retention window, ordering requirements, and cost/notification effects. A new scope or changed request needs a new decision. An expired deduplication window or unknown implementation means automatic replay is not proven safe. If no safe idempotency mechanism exists, use a coordinated manual reconciliation plan approved by the owner.
7. **Execute a bounded recovery.** Follow the approved operation plan, not a whole-pipeline rerun by default. Reuse the logical request and supported operation key for the same intended effect; record a new attempt ID. If content legitimately changed, have the owner define a new version/operation rather than reuse a key with different semantics. Respect provider retry guidance and rate limits, cap attempts, and stop on repeated failure. Avoid nested retry loops and bulk replay before one representative recovery is verified.
8. **Verify from both ends.** Re-read the downstream object/action state and the authoritative request record. Confirm the intended target, scope, approval linkage, side-effect count, and any notification delivery status available. Update state to reflect evidence; do not invent a successful execution log for a change completed elsewhere. Separate functional completion from pending communications.
9. **Resume deliberately and reconcile the backlog.** Confirm stale queued attempts cannot apply an obsolete or duplicate change before releasing them. Resume only the approved scope, monitor initial results, and compare the bounded affected population with reconciled outcomes. Quarantine invalid or unresolved entries with owners; an empty error queue is not proof that all requests were fulfilled.

| Evidence state | Recovery decision |
|---|---|
| Downstream effect verified; request status stale | Repair linkage/status through an authorized audited method; do not repeat the effect. |
| No effect confirmed after reliable checks; transient cause resolved | Retry only if current approval and duplicate safety are established. |
| Effect unknown because of timeout, unavailable destination, or incomplete logs | Hold replay; obtain authoritative evidence or an owner-approved manual resolution. |
| Some effects complete, later step failed | Continue only the incomplete authorized step or approve a compensating action; retain completed evidence. |
| Duplicate effect exists | Identify the authoritative outcome and assess consequences; repair duplicates only with approval. |
| Invalid target, schema, scope, authorization, or expired approval | Quarantine and correct through intake/review; repeated retries cannot fix a policy decision. |

## Stop conditions and partial failure

Stop recovery for suspected credential disclosure, unauthorized scope, ambiguous target, unavailable source of truth, conflicting operators, or unverified duplicate protection. Use [security alert triage](security-alert-triage.md) for security concerns. Do not generate a replacement credential or widen permissions just to get a stalled run moving.

For a partial request, record exactly which effects exist and which remain pending. Compensation is a new authorized action, not an automatic erasure of history: deleting an account or cancelling an order may have further consequences. If a notification failed after the business change succeeded, verify delivery history before a separately approved resend. If the platform cannot prove delivery, report that uncertainty and avoid claiming that the requester was notified.

## Expected evidence and closure

The recovery ledger should include request and approval references, correlations, operation keys, all relevant attempts, downstream identifiers, before/after observations, concurrency controls, recovery authority, operator, verifier, and residual work. Record a review date for recurring defects and an owner for root-cause correction.

Close when every affected request in the bounded population is reconciled as completed and verified, deliberately cancelled/rejected, or explicitly transferred as unresolved to an accepting owner. Report unresolved cases separately; a closed recovery task must not describe them as fulfilled. Restore intended scheduling and remove temporary recovery access after verification.

## Synthetic example

EX-REQ-052 requested one fictional training-space membership. Attempt EX-ATT-01 timed out, but the downstream audit shows the membership exists with the expected request reference. The operator repairs the stale request linkage under approval and does not replay provisioning. A separate notification is still unconfirmed, so the record states **membership verified; notification unresolved** until its owner resolves it.

## Reviewed technical guidance

Microsoft's [Retry pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry) explains that a service may process a request successfully even when its response fails, and that repeated non-idempotent operations can cause unintended effects. AWS documents [at-least-once delivery](https://docs.aws.amazon.com/en_gb/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html), including possible message redelivery. Both were reviewed on 2026-09-17. These examples support duplicate-safe recovery principles; they do not imply this library uses either platform or that queue deduplication guarantees an end-to-end business transaction.

Related: [software request and approval](../../documentation/procedures/software-request-and-approval.md), [automation result review example](../../n8n/automation-result-review/README.md).
