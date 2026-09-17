# Security alert triage

> Adapted operational example, version 0.1. Roles, cases, and identifiers below are fictional. Review the procedure against your authorized operating model before adoption. Completed records belong in a restricted incident system, not this repository. No live investigation or response was performed to create this example.

## Trigger and scope

Start when a security platform or a person reports suspected account misuse, phishing, unexpected forwarding, malware, or suspicious application activity. The outcome is a supported disposition or an accepted handoff to the incident lead. This SOP covers initial triage; it does not authorize forensic acquisition, broad searches of personal content, destructive remediation, or external notification.

Escalate immediately for suspected credential submission, unauthorized successful access, active destructive activity, suspicious data transfer, or a newly discovered external forwarding mechanism. Gather evidence while escalation proceeds; do not wait for a complete ticket. A low vendor severity does not override business impact.

## Preconditions and decision boundaries

Have a named responder and alternate, a restricted case record, an independently verified escalation route, and scoped read access to relevant evidence. Identify the affected legal entity and service owner; a firm-operated service and a portfolio company's service may have different response authorities. If access or ownership is missing, record that gap and escalate it.

| Boundary | Responsible role and permitted outcome |
|---|---|
| Recommendation | Triage analyst proposes severity, scope, and next action with supporting evidence and uncertainty. |
| Approval | Incident lead authorizes containment under recorded authority; business and specialist reviewers resolve service impact and disclosure decisions. Existing emergency authority may be used and cited. |
| Execution | Authorized operator performs only the approved action on verified targets. Analyst access does not imply permission to reset, isolate, revoke, delete, or tune alerts. |
| Verification | A reviewer checks current platform state and relevant activity; for a small team, record when the same person must execute and verify. |

## Procedure

1. **Establish the case.** Record alert and incident references, observed time and time zone, affected identity/device/application references, detection source, reporter, current owner, and next update. Open the platform through a trusted route. Link duplicate alerts to the parent case without discarding their original timestamps.
2. **Check immediate impact.** Determine whether access is continuing, a device is unavailable, payments or fund operations are affected, or sensitive information may be involved. State what is reported versus confirmed. Notify the incident lead through a trusted route, especially if the normal mailbox or chat identity may be compromised.
3. **Capture evidence before avoidable changes.** Preserve the alert details, timeline, relevant log references, observed rule or consent configuration, and automated-action status. Capture only the necessary content. Record collector, collection time, query interval, time zone, and access restrictions. Preserve originals using the incident process; screenshots supplement logs rather than replacing them.
4. **Correlate the signal.** Review related alerts and activity before and after the reported event. For identity cases, distinguish failed attempts from successful authentication and subsequent resource access. For endpoint cases, correlate device identity, process timeline, protection health, and last contact. For mail cases, review forwarding, rules, delegates, and application consent within the authorized scope. Missing telemetry is an investigation gap, not evidence of no activity.
5. **Obtain user context safely.** Use a known contact route to ask about the action, device, and timing. Never request a password, MFA code, or reproduction of a suspected phishing flow. Travel or an IP-location match is context, not proof of legitimacy. Record how identity was verified and any inconsistencies.
6. **Recommend a disposition and response.** Choose expected activity with evidence, false detection with evidence, suspected/confirmed incident, or unresolved. Describe the smallest response that addresses the observed risk, its business consequences, evidence-preservation needs, and rollback or recovery requirements. Alert suppression requires a separate scoped decision and review date.
7. **Track any approved action to its outcome.** Record the approver, target, operator, action reference, submission time, and status. Re-read the relevant platform and audit history. Pending, failed, and successful actions remain distinct. Microsoft documents both alert correlation and separate remediation results; an alert marked resolved is not itself proof of complete containment. [Alert investigation](https://learn.microsoft.com/en-us/defender-xdr/investigate-alerts), [investigation and remediation results](https://learn.microsoft.com/en-us/defender-xdr/m365d-autoir-results).
8. **Check remaining access and recurrence.** If credentials or sessions were changed, verify application-specific sessions, grants, and alternative access paths within the incident scope. Microsoft Entra cannot directly revoke a session token issued by another application; local data and application sessions require separate consideration. [Emergency access revocation](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access).

## Stop conditions and partial failure

Stop routine troubleshooting and involve the incident lead when evidence suggests broader compromise, physical danger, preservation obligations, uncertain identity, or an action beyond current authority. Do not continue using a suspected compromised endpoint to administer the response.

If an isolation or revocation request times out, inspect its action history and target state before retrying. If the device is offline or a provider cannot confirm an outcome, record containment as unconfirmed and assign an alternate containment decision. A provider outage or unavailable log window must stay visible in the handoff. Do not delete a suspicious object merely to make the alert disappear; preserve the necessary evidence and obtain the response decision first.

## Expected evidence and closure

Use the [incident response record](../../documentation/cyber-risk/incident-response-record.md). Minimum evidence is the case/alert linkage, scoped timeline, impact rationale, evidence references, decision authority, action results, residual unknowns, and named next owner. Capture expected activity and false detection as different conclusions.

Close triage only when the disposition is supported and any incident handoff is acknowledged. A resolved triage ticket may link to an open incident; it must not imply investigation or recovery is complete. For benign closure, record the evidence and recurrence trigger. For containment, keep monitoring and business recovery under the incident lead. Notification obligations are assessed by the relevant specialist for actual facts, not inferred from this SOP.

## Synthetic example

Case EX-SEC-031 reports an unexpected sign-in followed by a forwarding change. The fictional user confirms travel but does not recognize the forwarding change. The analyst escalates, preserves the rule reference, and recommends containment. The operator's session-revocation action succeeds, but a connected application's session state remains unknown. The handoff says **identity action verified; application containment pending**, with the application owner assigned. Travel does not close the case.

## Reviewed sources and adoption checks

The three linked Microsoft sources were reviewed on 2026-09-17. Check current product licensing, supported response actions, evidence retention, and your tenant's permissions before adoption. Microsoft notes changes to the Defender for Endpoint automated-investigation experience effective September 1, 2026; do not assume every product exposes the same investigation controls. The role boundaries and closure criteria here are proposed operating practices, not vendor certification.
