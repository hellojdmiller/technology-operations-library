# Plan a handover that transfers work and exposes the remaining gaps

**Status:** Proposed operating guide using fictional examples. It is not an employment instrument, contract amendment, approval, release, or statement that any transfer has occurred.

A useful handover answers two different questions: what was delivered and received, and what the receiving team can demonstrate it can operate. Record those conclusions separately. A delivery can be acknowledged while a service remains unproven; a successful service test does not establish that every required record or asset was transferred.

## Define the assignment

The sponsor, outgoing contributor, receiving operational owner, and relevant service owners agree the scope and record it in the protected [continuity control record](ownership-and-escalation.md#keep-changing-facts-in-one-controlled-record). Include the business boundary, intended transfer point and time zone, overlap arrangements, deliverables, receiving roles, decision authority, and contingency if a prerequisite is unavailable.

Keep any personnel or contractual terms in their authorized system. This guide does not create those terms. An unanswered request, a delayed acknowledgment, an unfinished remediation task, or a failed readiness test does not imply an extension of access, duties, provider scope, or post-transition assistance. Any change needs an explicit decision through the applicable process and, where required, a separate agreement.

## Maintain one delivery register

List what another operator needs to understand or operate the agreed scope. Link canonical procedures and source records rather than copying them into a second active library.

| Delivery area | Minimum useful content | Receiving check |
|---|---|---|
| Service boundary | Purpose, business owner, operator, alternate, dependencies, excluded scope | Recipient can identify what the team is responsible for. |
| Routine work | Intake, prioritization, recurring duties, upcoming commitments, failure routes | Recipient can locate the current procedure and scheduled task owner. |
| Administrative relationships | Required capabilities, named access, provider requester status, recovery procedure reference | Recipient distinguishes a listed account from demonstrated capability. |
| Changes and automations | Current projects, pending decisions, integrations, expected results, recovery and stop methods | Recipient can explain what failure looks like and who decides the response. |
| Commercial dependencies | Contract and entitlement references, notice owner, billing route, payment responsibility | Authorized business reviewer reconciles the source; no sensitive payment detail enters the register. |
| Records and custody | Canonical locations, permitted audience, retention direction, asset and custody references | Recipient confirms receipt and ability to reach the material within approved scope. |
| Known uncertainty | Missing, disputed, stale, or unavailable information with a next owner | Unknowns remain explicit and attributable. |

Use the [handover register](../templates/handover-register.csv) and [field dictionary](../templates/README.md), or equivalent fields in the existing protected system. Its delivery states are `not_delivered`, `partial`, `delivered`, and `unknown`; acknowledgment is recorded separately as `pending`, `received_only`, `acknowledged_with_limits`, `declined`, or `unknown`. Link the versioned material, actual receipt, unresolved question, next owner, and evidence. Receipt disputes belong in that attributable record. None of these states means the operating test passed, and a separate prose inventory is not required alongside an existing canonical register.

## Transfer knowledge through a demonstration and a repeat

For each material process, have the contributor explain the trigger, decision boundaries, required inputs, normal outcome, failure indicators, and escalation path. The recipient then explains it back and uses the procedure on an approved synthetic case.

Keep a question register with the question, answer, source, confidence, and recipient. Distinguish a participant's recollection from a current observed result. A knowledgeable statement can be useful evidence, but do not silently promote it into proof of present configuration, coverage, contract terms, or recoverability.

Separate coached learning from independent validation. During training, explanations are expected. During the [readiness exercise](readiness-exercise.md), record any assistance needed and which step it affected. A corrected runbook can be retested; changing the document does not rewrite the earlier result.

## Plan dependency changes before the transfer point

Review identities, service connections, scheduled tasks, recovery routes, provider authorization, business ownership, billing notifications, and asset custody that depend on the outgoing role. Confirm the whole population used for the review and any excluded systems. A directory export alone may not capture local accounts or separately administered services.

Use supported transfer methods and named access. Keep secrets in the approved secret-management process. A custody receipt records who received what class of material through which protected reference; it does not establish that the recipient can use it or is authorized to do so.

For each change, define the approver, executor, service impact, expected result, rollback or alternate route, and verification. Replacement of an integration identity should include a synthetic transaction and destination reconciliation, not merely a successful connection test. A billing-contact change should be checked in the authoritative service record; an email request is an intermediate step.

The library's [automation handover](../../documentation/automation-handover-template.md) and [SaaS ownership lesson](../../training/saas-ownership-and-handover.md) provide additional exercises. Product-specific transfer requirements need current vendor guidance for the actual service and edition.

## Review delivery and readiness separately

| Review | Question | Evidence | Result language |
|---|---|---|---|
| Delivery review | Was the agreed material or custody transferred, and did the designated recipient acknowledge it? | Versioned register, actual receipts, disputed or unavailable items, remaining owner assignments | Delivered and acknowledged; acknowledged with specified open items; incomplete |
| Operating readiness review | Can the authorized receiving team perform the defined work and recover from the tested failures? | Independent demonstrations, source coverage, expected and actual results, failed or blocked tests | Demonstrated for stated scope; permitted operation with specified restrictions; readiness not demonstrated |

The sponsor reviews material gaps and approves a bounded operating decision within their authority. Receiving operators acknowledge only what they received, observed, or are assigned to do. They do not certify every historical assertion by acknowledging a packet. Preserve contributor and reviewer attribution where interpretations differ.

An accepted risk stays a failed, blocked, or untested control result where that is what the evidence shows. The decision permits a stated scope under specified conditions; it does not turn the test into a pass. Record a temporary deviation in the [exception register](../templates/exception-register.csv), with explicit expiry, earlier review triggers, safeguards, and a retest plan. Unavailable approval is not automatic acceptance.

## Make the transfer point executable

Before the transition window, confirm the authorized access-change plan, records preservation direction, support coverage, ownership of incomplete work, and who can stop the change. Arrange the sequence so necessary preservation and replacement access are established where feasible before the old path ends.

At the authorized time, the responsible operator performs the approved identity and authority changes. Verify the actual outcomes across the agreed systems, including active sessions, delegated access, provider requester records, and dependent work where applicable. Do not treat a submitted deprovisioning job as independently verified removal.

Keep business-record retention separate from continued sign-in and from deletion. Apply the relevant records, personnel, and incident processes. If an urgent security event changes the sequence, use the incident path and document why. A missing handover receipt must not become a blanket instruction to keep risky access alive.

## Give every unresolved item a receiving owner

| Open item | Consequence and uncertainty | Interim operating limit | Owner and decision authority | Next evidence or action | Due/review trigger |
|---|---|---|---|---|---|
| [Specific unresolved condition] | [Business effect; what is known] | [Approved safeguard or paused scope] | [Protected role references] | [Observable completion criterion] | [Actual decision, not a guessed date] |

If the handover cannot be completed as planned, the sponsor chooses an explicit contingency: narrow the service scope, assign additional authorized coverage, defer a discretionary change, or approve another bounded arrangement. Do not silently make the departing contributor the permanent escalation route.

**Fictional example:** A recipient confirms that the current runbook and service inventory were received. A restore exercise remains blocked because its isolated destination is unavailable. Record delivery acknowledgment and the blocked restore separately. Assign the destination issue and decide the interim business restriction. Do not report the service as recoverable or treat the block as an automatic extension of the outgoing role.

After the transfer, review missed requests, failed jobs, unresolved ownership, and late-discovered dependencies. Reconcile them to the receiving team's backlog and retest affected procedures. Store the actual records in the protected operating system; keep this repository's examples free of live contacts, identifiers, exceptions, and access material.
