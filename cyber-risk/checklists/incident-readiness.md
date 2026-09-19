# Incident-readiness checklist for technology operations

> Reusable review checklist. Version 0.1; researched 2026-09-17. No organization has been assessed by this document. A blank field or missing evidence is unresolved, not a passing control. Keep completed records and sensitive evidence in a protected internal system.

The practical question is whether the right person can make and verify the next decision when normal systems are unavailable or untrusted. Review the management company, fund-operation providers, and portfolio-company boundaries explicitly. Access to information does not automatically give IT authority over another entity's payments, systems, or notifications.

Use this with the [incident response record](../../documentation/cyber-risk/incident-response-record.md), [BCP](../../documentation/continuity/business-continuity-plan.md), [recovery playbook](../../documentation/continuity/disaster-recovery-playbook.md), and [tabletop exercises](../scenarios/tabletop-exercises.md).

For a bounded team discussion, use the [45-minute workshop](../workshops/incident-readiness/README.md). It maps selected checklist items to the existing outage scenario and retains technical checks as untested.

## How to record a result

For each row record **status, accountable owner and alternate, evidence reference, observation date, scope, gap, escalation owner, and next action**. The roles below are suggested assignments, not named staff. A policy statement is design evidence; a scoped observation or rehearsal establishes something different.

Use **Demonstrated** only when the expected check has been observed for its recorded scope. Use **Partial** for a material gap, **Unknown** for missing information, **Not demonstrated** for a failed check, and **Not applicable** only with a documented rationale and approver. Expired or materially changed evidence requires reassessment. This checklist sets no universal expiry interval.

Do not run a live account lockout, bank call, recovery, notification, or destructive command merely to complete the checklist. A tabletop can demonstrate decision-making. Technical claims require separately authorized, bounded verification.

## Authority, activation, and business scope

| ID | Check and observable evidence | Accountable role | When evidence is missing |
|---|---|---|---|
| IR-01 | An incident lead and alternate can identify declaration/priority criteria and their decision authority. Evidence: approved role record plus a rehearsal decision log. | Executive sponsor | Escalate the authority gap to the sponsor; do not assume the available operator owns every decision. |
| IR-02 | Containment, expenditure, provider engagement, restoration, and closure each have a defined approver or standing authority. Evidence: decision matrix and scenario walkthrough. | Incident lead | Record the unassigned decision and interim escalation route before relying on it. |
| IR-03 | Business owners can identify the function, deadline, minimum viable operation, dependencies, and recovery objectives. Evidence: approved impact analysis with technical validation limits stated. | Continuity coordinator | Escalate absent or infeasible objectives; do not turn a backup setting into a business-approved target. |
| IR-04 | Management company, fund, administrator, bank, and portfolio-company responsibilities are distinguishable. Evidence: scoped entity/provider handoff map. | Operations lead | Identify the affected entity and authority before directing another party's actions. |
| IR-05 | A staff member and an external provider can describe how to report a suspected incident, including when the usual help desk is down. Evidence: documented routes and a synthetic reporting rehearsal. | IT operations lead | Establish an alternate route and owner; an unpublished mailbox alone is insufficient. |

## Independent coordination and access

| ID | Check and observable evidence | Accountable role | When evidence is missing |
|---|---|---|---|
| IR-06 | Response coordination works without the primary email/chat/identity service. Evidence: dependency map and approved rehearsal of an independent channel. | Communications owner | Escalate shared failure dependencies; a second application using the same sign-in may not be independent. |
| IR-07 | Responders can verify participants and find primary/alternate contacts without trusting a suspect email thread. Evidence: protected contact source and verification procedure. | Incident lead | Use the established escalation chain; do not adopt replacement numbers supplied in the suspicious request. |
| IR-08 | A usable copy of the response and recovery instructions is accessible during ordinary sign-in loss. Evidence: controlled alternate-copy location and retrieval rehearsal. | Continuity coordinator | Record what becomes inaccessible and assign an independent access solution. Keep secrets out of the plan. |
| IR-09 | Emergency administrative access has an owner, restricted storage, an alternate, monitoring, and a documented verification result. Evidence: protected access procedure and test reference. | Identity owner | Record access as unverified; avoid broadening permissions or exposing recovery material as a quick test. |
| IR-10 | A replacement responder has an approved device/access path that does not depend entirely on the affected endpoint or operator. Evidence: dependency walkthrough and bounded access check. | Endpoint/IT owner | Escalate the single point of failure and specify a controlled interim response path. |

## Providers and external obligations

| ID | Check and observable evidence | Accountable role | When evidence is missing |
|---|---|---|---|
| IR-11 | Each critical provider has a verified escalation route, account-ownership proof process, support entitlement, incident responsibilities, and an alternate contact. Evidence: internal service register and current agreement references. | Vendor/service owner | Identify the inaccessible portal, missing entitlement, or unresolved support promise; escalate to the service sponsor. |
| IR-12 | Provider contacts remain usable if the provider or primary identity service is unavailable. Evidence: separate contact/access route and a synthetic handoff exercise. | Vendor/service owner | Record the shared dependency; do not claim an alternate based only on a second portal URL. |
| IR-13 | Log availability, export scope, retention, reporting delay, preservation requests, and permitted recipients are understood for key services. Evidence: provider capability record and a scoped export observation. | Security/service owner | Preserve available evidence and assign the missing interval/scope to a named investigator and provider case owner. |
| IR-14 | Applicable notification, insurer, counsel, records, and law-enforcement engagement decisions have an owner and a maintained assessment process. Evidence: obligations register, contract references, and decision template. | Legal/Compliance | Escalate uncertainty promptly to the appropriate specialist; record trigger, facts, jurisdiction, and pending determination. Never invent a deadline. |

Provider ownership should cover identity, collaboration, endpoint/security, backup, critical business SaaS, fund administration, and banking where relevant. A support subscription is not proof that the provider will lead the incident, retain the needed logs, approve a payment recall, or meet the business recovery target.

## Investigation and containment

| ID | Check and observable evidence | Accountable role | When evidence is missing |
|---|---|---|---|
| IR-15 | Investigators can connect sign-in, SaaS access, endpoint, sharing, and relevant automation observations using consistent timestamps and stable IDs. Evidence: synthetic event reconstruction plus documented coverage limits. | Security lead | State the uncovered systems/periods and confidence; do not infer “no compromise” from absent records. |
| IR-16 | Evidence handling preserves source, collector, time zone, method, access controls, and transformations. Evidence: a completed synthetic evidence entry and authorized storage path. | Investigation lead | Protect existing artifacts and resolve collection/preservation authority; avoid copying evidence into informal chats or AI. |
| IR-17 | Identity containment distinguishes password changes, sessions, application grants, service identities, and app-specific access. Evidence: service-specific action/verification matrix. | Identity and SaaS owners | Mark residual access paths unknown; an accepted command is not proof of revoked access. |
| IR-18 | Endpoint/network containment and destructive-action tradeoffs have standing authority or a known escalation route. Evidence: incident procedure and a tabletop decision record addressing preservation. | Security/incident lead | Escalate the scope and tradeoff; this checklist does not authorize mass isolation, power-off, or wiping. |
| IR-19 | The payment process can pause an instruction, independently verify a change, and establish actual transaction/recovery status. Evidence: synthetic finance/administrator/bank walkthrough. | Finance/payment owner | Escalate through established finance and bank channels under actual incident authority; preserve “requested” versus “confirmed.” |
| IR-20 | AI/connector owners can identify approved data/action scope, actual permissions, source and output destinations, stop controls, and provider dependencies. Evidence: current register and synthetic permitted/denied tests. | AI/connector owner | Stop the affected use under the incident process when unauthorized disclosure is suspected; maintain the Confidential-data prohibition and investigate outside AI. |

## Recovery, communications, and improvement

| ID | Check and observable evidence | Accountable role | When evidence is missing |
|---|---|---|---|
| IR-21 | A recovery operator can identify the actual protected data point, known-good basis, destination, measured restore result, and unresolved data gap. Evidence: bounded recovery record, not just job success. | Recovery owner | Escalate target variance and unknown integrity; retain “recovery unverified.” |
| IR-22 | Business acceptance includes usable content, authorized and denied access, required relationships/metadata, and reconciliation of intervening work. Evidence: recorded positive/negative checks and business sign-off. | Application/business owner | Keep the service or scope unaccepted; specify the missing check and temporary business limitation. |
| IR-23 | Updates distinguish confirmed impact, current limits, estimates, actions, owners, and next update. Audience and external release authority are clear. Evidence: approved synthetic holding update. | Communications owner | Obtain the authorized reviewer and record unresolved facts; do not imply that an investigation has finished. |
| IR-24 | Service restoration, investigation completion, incident closure, and follow-up remediation are separate states. Evidence: closure criteria and risk/action records with accountable owners and retest evidence. | Incident lead and risk owner | Carry unresolved issues forward; neither a document revision nor a tabletop score demonstrates a technical fix. |

## Missing-information escalation record

Use one record per material gap: **unknown fact → decision it affects → current evidence/limit → assigned owner → escalation authority → interim operating constraint → next evidence request → agreed review time**. If nobody can own the gap, escalate to the sponsor and state that explicitly. During a real event, follow the organization's actual incident priorities; do not wait for completion of this entire checklist before authorized response.

For example, a provider's uncertain log coverage affects the ability to bound disclosure. Record the missing period and requested export; assign the service owner and investigator; keep exposure scope unresolved; let Legal/Compliance evaluate obligations from the known facts. Do not fill the gap with an unsupported clean bill of health.

## Review outcome

Summarize demonstrated capabilities, critical gaps, unknown dependencies, what was not tested, decisions needed from leadership, and the next bounded verification. Avoid a single readiness percentage that hides a missing response authority or inaccessible recovery path. Link remediation to the [risk assessment and treatment record](../../documentation/cyber-risk/risk-assessment-and-treatment.md) and retest the actual failure condition.

## Primary guidance and interpretation

[NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final), April 2025, provides the current incident-response risk-management framing used here. The checklist is an original operational aid, not a complete profile implementation or certification.

CISA's [StopRansomware guide](https://www.cisa.gov/stopransomware/ransomware-guide) informs independent communications, evidence-aware response, and tested recovery. The [FBI BEC guidance](https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise) informs independent verification of payment changes and prompt financial-institution escalation. The [CISA JCDC AI collaboration playbook](https://www.cisa.gov/news-events/alerts/2025/01/14/cisa-releases-jcdc-ai-cybersecurity-collaboration-playbook-and-fact-sheet) provides context for voluntary information sharing about AI incidents.

Sources reviewed 2026-09-17. Roles, evidence tests, and escalation choices above are adaptation recommendations. They do not establish actual provider capabilities, legal obligations, incident history, or successful operational testing. The repository's [AI acceptable use](../../documentation/policies/ai-acceptable-use.md) and [data-handling](../../documentation/policies/data-classification-and-handling.md) restrictions continue to apply.
