# Asset lifecycle SOP

**Status:** Proposed procedure for a fictional investment firm. No asset transaction, device action or verification is asserted. Reviewed September 17, 2026. Use the [register dictionary](README.md#register-dictionary), [blank register](asset-register-template.csv) and [fictional examples](worked-examples.csv) together.

## Scope and authority

Apply to organization-owned and leased endpoints, removable storage, spare/loan equipment and other tracked technology. Record personal or third-party equipment only to the authorized extent, keeping ownership and management rights explicit. Cloud subscriptions belong in the service inventory; a cloud console entry does not establish ownership of physical equipment.

The asset coordinator owns the operating record and reconciliation. The budget/finance owner authorizes acquisition and financial disposition. The service owner defines suitability and continuity. The custodian accepts actual possession and return duties. Authorized device operators perform the scoped technical work; security/records owners determine preservation and data-handling requirements. A reviewer assesses the resulting evidence. An external provider's scope, custody, expected evidence and escalation contact belong in the approved work order.

Separate recommendation, approval, execution and verification. Combining roles in a small team must be visible, with a second-person review for consequential changes. A register update, a suggested automation result or an IT administrator's technical capability is not transaction authority.

## Keep four records consistent without confusing them

| Record | What it supports | What it does not establish alone |
|---|---|---|
| Asset/finance record | Identified item, stated ownership and acquisition/disposition references | Who currently holds it or whether it is protected |
| Custody history | Attributed possession, shipping and receipt observations | Enrollment, encryption or data removal |
| Management record | Device/service identity, reported state and last contact | Legal title, current physical location or complete security coverage |
| Security and action evidence | Observed control or operation within a stated scope/time | All future behavior, every storage component or authority to sell |

Link the authoritative sources and their timestamps. Do not overwrite a conflict with the most convenient value. Record source coverage, owner and the next decision in the protected case; never store recovery material or raw sensitive logs in the reusable CSV.

## 1. Approve need and acquire

Start from a verified need: joiner, failure, role change, capacity, supported refresh or approved spare stock. Check existing suitable inventory before proposing a purchase. Record the work requirement, compatibility, supportability, ownership model, expected service life review, delivery constraints, approved configuration and recovery approach. Include required accessories and separately handled storage.

Obtain the budget and purchasing decision before committing spend. Reconcile the order, intended owner, support entitlement and supplier route. A manager asking for a laptop does not authorize a change of supplier, a personal reimbursement or a gift of surplus equipment. Route valuation, sale terms, write-off, tax and accounting treatment to the authorized finance process; this SOP sets none of those rules.

Create an `ordered` asset record or a linked order line until the exact item is known. Prevent duplicate orders on retries by checking the existing purchase state. A submitted order is not delivery; an invoice is not receipt. If the start is late, identify an approved managed loaner or constrained work plan rather than bypassing acquisition or security decisions.

**Evidence to retain:** approved requirement, purchase reference, supplier/order confirmation and unresolved availability/ownership questions. No receipt, custodian acceptance or control result is recorded until observed.

## 2. Receive and identify

At receipt, an authorized recipient matches the actual items to the shipment and order, checks visible condition and accessories, and records custody. Verify a stable asset identifier against a protected device identifier. Resolve substituted models, duplicate identifiers, damaged packaging, unexpected activation/ownership restrictions and count differences before ordinary release.

Place unready or disputed items in a controlled location and use `received_unready`. Quarantine suspect equipment under the incident process; do not connect it merely to identify it. Potential battery or electrical hazards follow the manufacturer's safety route through a qualified person, not an improvised diagnostic or shipping step.

Reconcile the receiving record with procurement and finance. The operator can report a discrepancy but cannot silently amend ownership or accept an unapproved charge. Protect actual serials and locations in the operational system. If a replacement unit arrives, keep its relationship to the old asset rather than reusing the old physical identity.

## 3. Prepare and assign

Use the current approved build runbook for the exact platform, ownership and enrollment mode. Verify the intended management object, appropriate configuration, relevant protection controls, supported updates, recovery capability, approved applications and harmless work tests. List the scope of the security observation; a generic green dashboard is insufficient detail for a readiness claim.

Record preparation results and a reviewer decision before `ready_stock` or assignment. For a recipient, link the [onboarding SOP](../../sops/employee-onboarding.md), approved service access and secure authentication setup. The person accepts the identified asset, accessories and custody responsibilities through a verified handover. Shipping remains `in_transit` until receipt is established. Record an actual custody timestamp; do not use the device's most recent user field as a receipt.

An assignment updates custody, not ownership. A personal-device exception needs its own approved scope and privacy boundaries. An unresolved control gap needs an explicit temporary exception with safeguards, owner, expiry, earlier review triggers and verification plan; it is not a passing control result.

## 4. Control loaners and transfers

A loaner has an approved recipient, purpose, return checkpoint, supporting case and expected data handling at return. Verify its readiness for that recipient. Keep both the primary and loaner asset visible during repair or transition; do not make the primary disappear because a substitute works.

For an internal transfer, confirm release by the current custodian and acceptance by the next one. Reassess access, local data, condition and suitability before reassignment. The incoming person does not inherit the previous person's sessions or privileged access. If both parties disagree, use `disputed`, preserve the evidence and assign a coordinator; do not select whichever custodian matches MDM.

An overdue loan triggers contact and escalation against the actual exposure. It does not automatically authorize data destruction, payroll deduction or a personal sale. A cancellation before handover should cancel pending shipment/assignment where possible, confirm any actual receipt and reconcile the current state.

## 5. Reconcile inventory and evidence

Set a risk-based review cadence and event triggers: new receipt, transfer, repair return, leaver, missing report and proposed disposal. Define the source population, evaluation time, control-specific freshness limits and known exclusions before comparing records. Distinguish the time an export was retrieved from the device's last reported check-in.

1. Match stable identifiers across approved inventory, custody and management sources. Normalize formats deliberately; do not join only on hostname or user display name.
2. Identify records present in only one source, duplicate/ambiguous matches, contradictory custody, missing observations, stale reports and invalid/future timestamps. A partial or failed export means coverage is unknown, not that every absent device is missing.
3. Inspect control evidence separately. A current management check-in does not refresh an old encryption or recovery observation. A device outside the expected management population needs an applicability decision, not an automatic failure or pass.
4. Assign each finding to a person or accepted duty role with a specific next check. Protect the source snapshot and correction history. Obtain fresh evidence before correcting the register; retain the original observation and reason.
5. Re-run the relevant comparison after correction and record coverage and remaining exceptions. `matched_for_scope` means the reviewed observations agree within the declared limits. It is neither a readiness certificate nor disposal permission.

Use the [asset reconciliation review](../../../n8n/asset-reconciliation-review/README.md) to prepare candidates within its documented scope. Keep review separate from action execution. It must not buy equipment, send wipe commands, erase inventory rows, release enrollment, approve transactions or label a hold cleared.

For a credible missing-device report, switch immediately to [lost-device response](../../../documentation/procedures/lost-device-response.md). Do not wait for the next inventory cycle or for a stale device to check in.

## 6. Maintain, repair and review refresh

Track the actual warranty/support entitlement and relevant review point, supported operating-system/application horizon, observed performance and repair history. Warranty expiry is a planning input, not proof the device is unsafe or an automatic purchase authorization. Evaluate continued use, repair, extension or replacement against the work requirement and actual support constraints.

Use [device/vendor escalation](../../sops/device-vendor-escalation.md) for diagnosis and repair. Before external custody, verify data handling, recovery needs, protection changes, service scope, costs and the named recipient. Record shipping and receiving events. On return, verify the same or replacement identity, repair result, enrollment, security controls and the original work task. A closed provider ticket is not internal acceptance.

Apple's current organizational release guidance says not to release devices sent to Apple for repair. It also warns that Activation Lock management through Apple Business is unavailable after release and requires erase/restore after release. Treat release as a separate, planned enrollment decision, with the documented dependencies resolved; do not use it as a repair-preparation shortcut. [Apple: release devices](https://support.apple.com/guide/business/release-devices-axmec4d28461/1/web/1).

## 7. Return and determine preservation

For a leaver, follow the [offboarding SOP](../../sops/employee-offboarding.md). Access cutoff continues independently of asset return. Confirm the returned asset and custody; inspect condition and record missing items without asserting blame from an inventory discrepancy alone. Use `returned_review`, not `ready_stock`, until required work is done.

Before reset, wipe, parts replacement, reassignment or transfer outside the firm's control, determine whether there is local-only business data, a record-preservation requirement or an investigation/hold. Obtain the accountable records decision for the exact action and media. An unknown or active hold blocks the destructive step. Preserve through the approved route, verify retrieval where required and record the scope. Do not lift a hold merely to meet a return or resale deadline.

Keep held equipment restricted and traceable. Set an owner and review trigger without inventing a retention period. Ordinary incident containment can continue within its authority, but coordinate any action that could destroy needed evidence with the incident/records decision-maker.

## 8. Plan sanitization and decommission dependencies

NIST identifies **SP 800-88 Revision 2**, published in September 2025, as the current final revision superseding Revision 1. [NIST publication record](https://csrc.nist.gov/pubs/sp/800/88/r2/final).

The revision distinguishes clear, purge and destroy; select the method for the information and intended disposition, then the technique for the actual media and approved standard. It distinguishes verification of the operation's result from validation that the result is adequate. A completed command is not automatically an accepted sanitization result. This pack provides no overwrite count, destruction size or universal factory-reset prescription. [NIST SP 800-88r2, sections 3–4](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r2.pdf).

The current NIST FAQ reinforces that the publication does not endorse product-specific commands. Its verification/validation distinction requires inspection of results and a separate adequacy decision. Keep the approved technical plan and assessment linked to the identified media; a certificate for an unrelated batch is insufficient. [NIST FAQ, questions 7 and 12](https://csrc.nist.gov/files/pubs/sp/800/88/r2/final/docs/sp800-88r2-faq.pdf).

Before execution, document the intended next use, applicable media/components, preservation clearance, technical approver, operator/provider, supported procedure/version, validation criteria and failure route. Identify which enrollment, identity, recovery and management dependencies must remain available until each step finishes. The transaction approval identifies the intended recipient and terms separately.

Do not impose one universal order for deleting MDM, identity and enrollment objects. Use a platform-specific plan with explicit preconditions and confirmation points. Preserve the ability to execute and observe needed actions; keep protected recovery capability where the approved procedure needs it. Remove it only at its justified point, not as a general cleanup shortcut.

For Microsoft Intune, Delete can hide an MDM device immediately while initiating Retire; server-side `Completed` does not establish client-side completion. Do not treat disappearance from the portal as data-removal evidence. [Microsoft: Delete action](https://learn.microsoft.com/en-us/intune/device-management/actions/delete).

Microsoft also documents platform-specific Retire behavior and warns that retiring/deleting certain Entra-joined, BitLocker-protected device objects can affect key protectors. Review the exact platform procedure and protected recovery prerequisites before choosing an action. Retire is not a universal full-device sanitization operation. [Microsoft: Retire action](https://learn.microsoft.com/en-us/intune/device-management/actions/retire).

## 9. Execute, assess and release only within scope

Reconfirm target, hold status, scope and authority immediately before any irreversible action. Record actual operator, time, method/tool version, errors, outcome and protected evidence in the technical case. The reviewer records the acceptance or rejection against the plan. Pending, failed or inconclusive work stays visible and under controlled custody; do not retry an uncertain command blindly.

If the selected method cannot be completed or supported, obtain a revised technical plan or retain the asset under control. An offline device with a queued operation is unresolved. A screen showing initial setup or an absent management row is not, by itself, a confidentiality assessment. No example here claims that data is unrecoverable.

For reuse, verify the new build and custody before putting the device back into service. For sale, donation, lease return, recycling or destruction, confirm the separate transaction decision, recipient/provider, agreed custody route and applicable property/financial requirements. Confirm enrollment-release and activation/reuse conditions at the correct platform-specific stage. Record the actual recipient receipt, relevant provider evidence and any mismatch in the delivered population.

Technical sanitization does not transfer title. Physical shipment does not settle the finance ledger. Update each system from the event it actually records, link the evidence, and retain a closed history according to the adopted records policy. Do not delete the asset row merely to remove it from the active count.

## 10. Close or retain an owned exception

Close only the supported scope: custody, controls/actions, preservation, enrollment release where applicable, final recipient and transaction reconciliation each need their result or justified non-applicability. If any remains open, state the gap, owner, next review and consequence. Do not label the asset fully disposed because the external provider issued a generic certificate.

Sample review measures include assets with unresolved ownership, disputed custody, stale required evidence, overdue loans, unverified returns and disposition work lacking a decision. Define the population and age calculation for each. Lower exception counts caused by deleted records are not an operational improvement.
