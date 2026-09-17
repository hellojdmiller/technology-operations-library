# Ticket escalation and accepted handoff

> Proposed procedure, version 0.1. Assign local owners, routes, coverage, and escalation triggers before use. All examples are fictional and unexecuted. No live ticket transfer, provider contact, contract commitment, or change approval is represented here.

## Trigger, scope, and authority

Escalate when the current operator lacks required skill/access, business impact increases, progress stalls, ownership is disputed, a provider is needed, or a service-level trigger approaches or is breached. Suspected compromise uses [security alert triage](security-alert-triage.md) immediately. Escalation can occur before diagnosis is complete; urgency does not authorize uncontrolled remediation.

Keep a **named internal case owner** for coordination and requester updates. A receiving specialist or vendor owns an accepted action, not automatically the firm's business risk. The sender recommends the route and supplies evidence; the designated authority approves reserved changes or spending; the recipient executes within scope; the reviewer verifies results. Record overlaps. Use the current protected [ownership and escalation record](../succession/ownership-and-escalation.md), not old contact details copied into a ticket.

## Choose the escalation path

| Path | Purpose and expected response |
|---|---|
| Functional | Reach the person with the skill or system access needed. Ask for a specific diagnosis or action and acceptance. |
| Management | Resolve capacity, priority, ownership, commercial scope, business risk, or failed response. Ask for a decision, responsible owner, and next checkpoint. |
| Vendor | Obtain product/service expertise or entitled repair. Retain an internal owner, vendor case reference, coverage limits, and verification plan. |

Paths can run together. Management attention does not replace technical work, and opening a vendor case does not transfer requester communication. Atlassian distinguishes skill-based functional escalation from hierarchical escalation; the decision and evidence requirements below are this library's proposed operating practice. [Escalation policies](https://www.atlassian.com/incident-management/on-call/escalation-policies).

## Operational steps

1. **State the reason and deadline.** Link the original ticket; describe affected capability, observed impact, urgency, safe workaround, current P1–P4 priority, and why the present owner cannot proceed. Use P1 Critical, P2 High, P3 Normal, and P4 Low as defined in [service-level management](../service-level-management.md). Base any change on impact and urgency, not seniority or the escalation itself.
2. **Preserve the timeline.** Carry forward `received_at_utc`, `human_response_at_utc`, assignment history, priority changes, last update, next update, gross wall time, measured service time, and applicable calendar/clock references. Include prior breaches and authorized pauses with reasons. Reassignment, a new vendor reference, or a reopened case does not erase history. Report discrepancies between measured timers and the approved definition to the service owner; do not edit timestamps to make performance appear compliant.
3. **Prepare a concise transfer packet.** State the requested action, verified facts, hypotheses, tests and results, completed changes, pending jobs, approvals, dependencies, unknowns, and protected evidence references. Identify who can authorize further changes. Include an expected verification result and recovery limits. A recipient should not need to ask the user to repeat the entire story. Use the [blank handoff checklist](../checklists/ticket-handoff.csv) in a protected copy.
4. **Check access and disclosure.** Confirm the recipient's identity, scope, ability to read evidence, and need to know. Share sanitized vendor diagnostics rather than whole internal tickets. Keep personnel, investment, incident, and credential material out of general queues and broad email copies. If the recipient cannot access evidence, provide an approved protected route; do not relax the ticket's visibility indiscriminately.
5. **Contact the right route.** For urgent work use the verified live/on-call route specified by the service definition, not an assumed monitored mailbox. Record the attempt and response. For vendors verify entitlement, recognized requester, service region, remote versus onsite scope, and any approval required for charges. Apply the [device/vendor SOP](device-vendor-escalation.md) for repair logistics and [network SOP](network-triage.md) for connectivity evidence.
6. **Obtain explicit acceptance.** Request a named recipient, accepted task and scope, first action, next update time, and any missing prerequisite. Record acceptance time and evidence. “Assigned,” a delivery receipt, or an automated case number is not acceptance by a responsible operator. For urgent or complex cases, use a brief live handoff or an explicit written read-back. The sender/current duty owner keeps coordination until accepted cover is recorded.
7. **Manage non-response and scope disputes.** At the adopted trigger, use the verified alternate and management route; escalate sooner when impact worsens. Preserve unsuccessful attempts. If the MSP and vendor disagree about responsibility, the internal owner convenes a decision and assigns a bounded diagnostic action; the requester should not mediate provider boundaries. For shift end or absence, the duty manager arranges coverage. This procedure does not extend an outgoing person's availability beyond their agreed coverage.
8. **Coordinate execution and updates.** Identify one person controlling changes and track in-flight actions across providers. Prevent simultaneous conflicting fixes. Before retrying an uncertain operation, check actual state using [request pipeline recovery](request-pipeline-recovery.md). Keep the requester informed of impact, work underway, known constraints, and next update even when the provider has supplied no new diagnosis. Do not promise a repair time based solely on a vendor estimate.
9. **Review the response and next ownership.** Check the result against the requested action and evidence, not the vendor's status label. If a specialist returns a recommendation, obtain required authorization before execution. If they return completed work, verify the affected system and user task. Document who owns residual work; require an accepted return handoff when coordination moves again.

## Using the handoff checklist

Copy the CSV into the protected case workspace for one transfer. Fill `handoff_ref` and `ticket_ref`; retain all 24 checks. Replace **Not run** only with an evidenced result, **Blocked**, or **Not applicable** with a reason. Record actual observations and evidence references. This is a transfer checklist, not a completed handoff or a substitute for explicit acceptance.

## After-hours and incomplete handoffs

A remotely available engineer may be unable to inspect cabling, receive hardware, or enter a building. Record the physical action, safe local resource, access authority, and earliest supported attendance separately. If no authorized onsite resource exists, the internal owner chooses an approved workaround or continuity escalation; do not send an untrained person into electrical or security-sensitive work.

If the receiving party accepts only part of the request, list accepted and unaccepted tasks separately. If the portal is unavailable, use the approved fallback record and later reconcile references and timestamps. If nobody responds, retain the unresolved state under the internal duty owner and escalate the coverage gap. Silence grants neither approval nor permission to disable protections, disclose data, or buy services.

Waiting for a provider does not automatically pause a clock. Apply the service-level guide's actual rules and retain elapsed wall time, pause basis, update obligation, and breach history. Atlassian documents configurable conditions and calendars for SLA measurement; those settings need to match the adopted agreement. [SLA measurement](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-slas/).

## Verification, closure, and recurrence

Distinguish restored usable service (`restored_at_utc`), verified agreed remedy (`resolved_at_utc`), and administrative closure (`closed_at_utc`). An accepted workaround can restore service while a problem record investigates its cause. ServiceNow supports distinct resolution/closure handling and links to problem/change work; map your platform's states to the library definitions rather than assuming label equivalence. [Resolution and closure](https://www.servicenow.com/docs/r/it-service-management/incident-management/c_IncidentResolutionAndRecovery.html).

Close only under the adopted acceptance policy, with verification, requester update, residual owners, temporary-access cleanup, and a clear reopen route. User silence is not evidence of repair. For recurrence, reopen or link the new incident while preserving earlier history, reassess impact, and assign problem follow-up with an owner and review point. A new case must not conceal a failed prior remedy.

**Fictional example:** EX-ESC-062 needs local inspection after remote network checks. The specialist accepts log analysis but has no onsite coverage. The internal owner records partial acceptance, keeps the physical task open, and seeks an authorized local resource. No restoration or complete transfer is claimed. This example has not been executed.

The three linked vendor sources were reviewed on 2026-09-17. This SOP and its checklist are proposed process aids; no vendor platform configuration or operational effectiveness has been tested.
