# Assign ownership and make escalation work

**Status:** Proposed operating model. Roles and examples require local adoption. Listing a role here does not appoint anyone or delegate authority.

Technical knowledge, credentials, business authority, and provider execution are different things. A capable operator can recommend and perform work within scope without becoming the person who accepts business risk or approves a new commercial commitment.

## Keep changing facts in one controlled record

Maintain a protected **continuity control record** as the current reference for this collection. The guides describe the process; the record resolves current facts. Keep one authoritative value for each field. Where another system already owns a value, the record points to that governed source rather than maintaining an independently edited duplicate.

The [operational facts register](../templates/operational-facts-register.csv) and linked [working records](../templates/README.md) can supply this controlled view. They can also map to the firm's existing records. “Continuity control record” describes the governed reference, not a requirement to create another tracker or duplicate the five CSVs. Keep canonical values and their evidence in one place and use references for other views.

| Record area | Minimum fields | Verification to retain |
|---|---|---|
| Roles and coverage | Role, current holder, alternate, coverage boundaries, effective period, protected contact route | Assignment and acknowledgment references; actual route-check result |
| Decision rights | Decision class, permitted scope, approver, delegation or standing-procedure reference, limits, expiry | Current authorized decision; unresolved or disputed scope |
| Service ownership | Service reference, business owner, operator, backup, dependency and criticality references | Service-owner confirmation plus current inventory basis |
| Provider execution | Service scope, recognized requesters, verified route, coverage, verification method, support entitlement source | Provider acknowledgment and observed test; contractual claim separately supported |
| Commitments and calendar | Obligation reference, action owner, business deadline, time zone, review trigger | Governing source and current reconciliation |
| Access and evidence | Restricted procedure, approved custody metadata, evidence location, alternate retrieval route | Allowed/denied access results; no credentials or recovery material |
| Current disposition | Delivery state, readiness state, outstanding decisions, risk-record references | Actual decision and test references, with scope and dates |

Give entries stable, unambiguous identifiers and record their maintainer, revision, verification date, evidence basis, and review trigger. Use **supported by identified evidence**, **participant statement**, **unverified**, or **superseded** as appropriate. State exactly which fact the evidence supports. A directory entry can support a person's identity without proving their spending authority.

Change a value once, then check affected procedures and links. Do not silently override a conflict involving authority, policy, retention, or an agreement just because the record is newer. Refer the conflict to the responsible owner and identify the governing source before the dependent decision proceeds. Missing evidence is uncertainty, not proof that a service, agreement, or control does not exist.

Keep full contacts, actual account identifiers, architecture, live gaps, and sensitive evidence out of this resource repository. Never put passwords, authentication factors, recovery codes, tokens, or private keys in the continuity record. A separately controlled offline or alternate-access copy should have a revision, distribution list, reconciliation method, and retirement process.

## Assign the roles the work actually needs

| Role | Accountable work | Boundary to make explicit |
|---|---|---|
| Sponsor or delegated business decision-maker | Priorities, resources, operating scope, and material risk decisions | Does not automatically supply specialist legal judgment or perform technical verification. |
| Receiving operational owner | Day-to-day coordination, work assignment, service visibility, and escalation | Acts within recorded authority; does not acquire every unassigned business decision. |
| Outgoing contributor | Agreed knowledge transfer, supplied records, and disclosure of known unresolved items | Scope and availability follow the actual arrangement; unfinished work creates no implied extension. |
| Service or data owner | Business use, access decisions, impact, and acceptance of usable service | An investment relationship or provider contract does not automatically grant authority over another entity. |
| Technical operator or provider | Execute approved work, preserve attributable records, report actual outcomes | Technical access is not permission to expand scope, accept the firm's risk, or approve the provider's own charges. |
| Reviewer | Check the evidence and challenge material gaps | Record any overlap with execution; a second job title held by the same person is not an independent check. |
| Specialist decision owner | Relevant personnel, legal, records, privacy, or finance decisions | Use the actual approved role and delegation; do not assign these duties by inference. |

Small teams may combine roles. Record the overlap and decide the compensating review appropriate to the consequence. For a high-impact action, arrange a separate approver or reviewer where required by the adopted procedure. A provider-supplied receiving owner remains subject to the same limits and conflict handling as anyone else.

## Record decisions at the level people can use

For each consequential decision, state the trigger, who recommends, who approves, who executes, who verifies, and what happens if the decision-maker is unavailable. Resolve these in advance for emergency access, identity changes, disruptive recovery, new spend, external communication, and accepted operating restrictions.

Avoid a single label such as “IT owns it” where several decisions are involved. The technology team might recommend a recovery sequence; a business owner sets the tolerable interruption; an authorized operator executes; a reviewer checks restored access. Record each contribution without shifting all accountability to the operator.

A delegated limit must state its scope and source. If no applicable delegation is recorded, route the reserved decision to the authorized alternate or sponsor. Silence, repeated failed contact attempts, an urgent ticket, or possession of a credential does not create authority. Already approved incident procedures may authorize immediate protective action; continue that work and escalation in parallel.

## Build routes around observed response

Keep routine intake, urgent technical escalation, commercial escalation, security response, and business approval distinguishable. They can share a tool or contact, but the record must say which function each route serves.

For each route, record the supported business hours and time zone, expected response, alternate, caller verification, permitted actions, and escalation trigger. Treat an internal response target as an operating choice. Call it a contractual commitment only when the applicable executed terms support that claim.

When escalation is needed:

1. State the affected capability, observed impact, start time, known uncertainty, and immediate action already taken.
2. Use the verified channel suited to the urgency and failure. If ordinary identity or messaging is impaired, use the approved independent route.
3. Provide the necessary protected service reference and establish requester identity through the provider's verified process. Do not send secrets into a ticket to prove who you are.
4. Ask for an accountable recipient, case reference, next action, and next contact time. A delivered message does not establish that someone accepted the work.
5. Escalate at the adopted trigger while retaining the same incident or work reference. Avoid uncoordinated parallel changes by multiple providers.
6. If the next role resolves to the same unavailable or conflicted person, follow the documented alternate. Record the concentration as a gap rather than calling it a second review.

Use the incident process for active compromise, fraud, or critical interruption. Specialist reviewers determine actual legal and contractual obligations; this guide does not establish privilege, waive notification requirements, or prescribe universal notification timing.

## Test the route without creating a false incident

Coordinate a labeled exercise with the relevant participants. A tabletop can test how the operator chooses the route. A scheduled contact test can establish whether the route reached the expected team at that time. Confirming an after-hours procedure during daytime does not prove after-hours reachability; scope the evidence honestly and arrange an authorized test if that assurance is required.

Record test mode, time and zone, route reference and revision, caller, respondent role, verification method, elapsed time, recognized authority, observed result, and limitations. Keep personal contact values in their authoritative protected record. No answer, the wrong team, or an inability to verify the requester is a useful finding requiring an owner and retest.

For wider context, use the [cyber-risk operating model](../../cyber-risk/operating-model.md), [vendor review checklist](../../cyber-risk/checklists/deal-and-vendor-review.md), and [SaaS ownership lesson](../../training/saas-ownership-and-handover.md). Completed route tests establish bounded observations, not a guarantee of future availability.
