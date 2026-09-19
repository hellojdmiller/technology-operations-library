# Investor-reporting exercise: release, interruption, and exposure

> Fictional facilitator pack. No actual approval, report distribution, portal access change, investor contact, or payment action is authorized. The discussion has not been run with a team. Use only the canonical synthetic fixture and locally written exercise notes; do not bring investor records into this repository.

## Prepare

Use the [SOP](sop.md), [blank decision record](reconciliation-record-template.md), and [offline sample](../../../work-samples/investor-reporting-reconciliation/README.md). Follow the sample's commands to inspect its single canonical fixture and expected report. The local program reviews metadata and makes no external calls or changes. A successful program run is evidence of that computation, not a reporting release.

Assign reporting owner, entitlement/content reviewer, operator, independent verifier, incident lead, and facilitator. People may act in several simulated roles if they say which role they are representing. Choose an approved fictional release, then use the case prompts below to discuss deviations. These prompts are hypothetical decision branches, not additional input records or claimed observations from the CLI.

For each branch, record the known facts, material unknowns, affected scope, proposed action, required authority, next owner, and evidence needed. Keep recommendation, approval, execution, and verification in separate rows. Any drafted message must say **Exercise—do not send**.

## Read the canonical fixture

At `2026-09-19T12:00:00Z`, the [single canonical fixture](../../../work-samples/investor-reporting-reconciliation/inventory.example.json) produces the [expected readable report](../../../work-samples/investor-reporting-reconciliation/expected-report.example.txt). Its nine expected deliveries and ten supplied attempts produce four `support_recorded` completion states and 25 review items. All nine deliveries require review because the supplied batch state is `interrupted`. The snapshot set is complete/current according to supplied metadata; the program does not verify the collection process.

| Canonical delivery | Completion state | Operator interpretation |
|---|---|---|
| `DELIVERY-001` | `support_recorded` | Exact target and usable confirmation are recorded; the interrupted batch still needs reconciliation. |
| `DELIVERY-002` | `unverified` | Attempt targets the wrong recipient; expected entitlement does not authorize the actual target. |
| `DELIVERY-003` | `unverified` | Fund, entity, document, and version differ from the intended release. |
| `DELIVERY-004` | `missing` | No attempt in the supplied complete/current snapshot; changing coverage to incomplete must not preserve that inference. |
| `DELIVERY-005` | `support_recorded` | Two sent attempts create duplicate risk despite a retry link and completion support. |
| `DELIVERY-006` | `support_recorded` | A failed attempt remains visible after a supported retry; the failed-to-sent sequence is not itself counted as two sent effects. |
| `DELIVERY-007` | `unverified` | Sent claim without usable confirmation does not substantiate completion. |
| `DELIVERY-008` | `conflicting` | Contrary verification records remain unresolved; do not select only the favorable one. |
| `DELIVERY-009` | `support_recorded` | Completion support coexists with `entitlement=adverse_claim`; an observed effect does not authorize it. |

Four supported completions is not four accepted releases. The sample's confirmation means a supplied claim of the scoped package at the intended recipient destination; it does not prove that a recipient opened, read, or understood it. The discussion branches below develop the operator decisions around these distinctions without changing the fixture or claiming that those decisions were executed.

## Case 1: the familiar recipient and the newer report

The release owner approved one version for a particular fund and legal entity. A distribution record shows a different version sent to a familiar contact. The contact appears in a CRM, but their entitlement for this entity has not been established.

| Inject | Discuss |
|---|---|
| The operator says the new version is probably more accurate. | Does recency establish approval? Which artifact and approval record must match? |
| The contact receives reports for another fund. | What exact entitlement is needed? Does a successful login prove it? |
| An approver suggests changing the expected list to match what was sent. | How do you preserve the approved baseline and incorrect attempt? |
| A reviewer can verify the new document's digest but cannot locate approval. | What does the digest establish, and what stays unresolved? |

### Answer key

Neither familiarity nor recency resolves the mismatch. Preserve the approved release/version and independently defined expected population. Obtain the scoped recipient/fund/entity entitlement and the exact content approval. A digest can establish matching bytes; it cannot create approval or prove financial accuracy.

Do not rewrite history to turn observed delivery into the expected list. A separately approved correction can change future intent, but the original attempt and its consequences remain visible. Recommend holding affected further distribution and escalating a possible wrong-version or wrong-recipient disclosure under the SOP. The appropriate authority chooses containment and any correction. The operator cannot assume approval to resend, delete, revoke, or contact the recipient.

Full-credit reasoning identifies both content and entitlement gaps, names their separate owners, preserves the original attempt, and asks for independent outcome evidence. Simply producing the right file now does not resolve prior exposure.

## Case 2: an interrupted run and a tempting retry

One delivery attempt has an unknown outcome after an interrupted run. Another logical delivery has two recorded attempts. The operator proposes rerunning the whole batch because its overall execution status was unsuccessful.

| Inject | Discuss |
|---|---|
| A sender log says the request was accepted, but the destination cannot currently be queried. | Which outcome does the log support? Is a resend justified? |
| The observed count equals the expected count. | Could missing and unexpected recipients, or duplicate attempts, explain the equality? |
| An automatic retry worker may still be active. | Who coordinates execution, and what proves the worker stopped? |
| Later evidence supports the correct effect for one logical delivery. | What should happen to its stale tracking record? What remains unresolved elsewhere? |

### Answer key

The missing response does not establish no effect. Preserve the attempt as unknown and hold dependent replay while obtaining authoritative provider/destination evidence or the designated owner's manual recovery decision. A sender acceptance record is not automatically recipient receipt, access, or the independently verified outcome required by the release.

Reconcile exact logical deliveries and all attempts, not just totals. Multiple attempts linked as retries still need their possible side effects examined. A `retry_of` relationship or correlation ID is not proof that the provider prevented duplicates. Coordinate in-flight and automatic work under authority before recovery.

For a verified effect with stale tracking, propose an audited tracking repair without resending. For a confirmed failure without effect, assess a bounded retry against current entitlement, approved version, release authority, provider idempotency behavior, and key validity. Unknown outcomes remain unknown. A corrected later attempt does not erase an earlier unknown or duplicated attempt.

Full-credit reasoning distinguishes the logical delivery from its attempts, avoids whole-batch replay, records concurrency controls, and defines the required independent verification. No proposed recovery occurs during the discussion.

## Case 3: the incorrect recipient and the incomplete audit export

A record indicates a report may have reached someone outside its approved entity scope. The audit export is partial. A colleague suggests declaring the issue resolved after removing a sharing link.

| Inject | Discuss |
|---|---|
| Nobody appears in the available access log. | What can a partial export establish? Who owns the missing interval/pages? |
| The sharing link is reported revoked. | Is revocation verified? Could other permissions or downloaded copies matter? |
| The reporting deadline is near and the business owner asks IT to email a correction immediately. | Which authority covers the message, recipients, content, and timing? |
| The administrator asks to close the reconciliation ticket while investigation continues. | What limited closure or acknowledged transfer would avoid implying completion? |

### Answer key

Escalate the suspected disclosure through the incident lead and reporting owner while preserving scoped evidence. An incomplete log does not prove non-access. Record the missing coverage, collector, time range, and next evidence owner. Follow established containment authority where applicable; record the actual state observed rather than equating a submitted request with completed revocation.

Separate future access containment from previous exposure. Inspect other permission paths within authorized scope. Do not assert that downloaded copies disappeared or that a recall succeeded without the relevant evidence. The incident and business specialists decide external communications; a reporting deadline does not create permission for IT to send an unsanctioned message or make a disclosure determination.

A reconciliation record may document a verified subset and explicitly transfer unresolved work to an accepting owner, with a linked open incident. It cannot report the affected release fully delivered or the incident resolved. Keep the original deadline and actual times; recovery does not remove lateness or unresolved evidence.

Full-credit reasoning names the incident/communication authority, preserves uncertainty, verifies the supported containment outcome, and records residual ownership without inventing a pass.

## Debrief and next exercise

For each criterion, mark **demonstrated**, **partial**, or **not observed**, with an example of what the participant said or recorded:

| Criterion | Useful observation |
|---|---|
| Scope and version | Exact recipient/fund/entity/document/version; approved expected population stays separate from observed results. |
| Evidence | Source completeness, timestamps, conflicting claims, and outcome meaning remain explicit. |
| Decisions | Recommendation, approval, execution, and independent verification remain separate. |
| Recovery | Attempt history, concurrent workers, duplicate risk, and limits on rollback/resend are addressed. |
| Handoff | Correct owners, escalation, accepted scope, unresolved transfer, and observable follow-up are recorded. |

An assumed approval, hidden unknown, uncontrolled replay, or unsupported declaration of containment requires correction regardless of the other observations. Assign an owner and an observable retest, then repeat that branch with a changed fictional version, entitlement, or evidence gap. These learning observations are not certification, actual portal verification, or proof that the team can meet a production reporting deadline.

The answer key applies the [SOP and its reviewed primary references](sop.md#source-notes). It introduces no universal service targets or legal notification deadlines.
