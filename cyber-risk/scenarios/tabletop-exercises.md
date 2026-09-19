# Four cyber incident tabletop exercises for an investment firm

> Original fictional exercises for review and adaptation. Version 0.1; researched 2026-09-17. No incident, test result, bank action, notification, containment, or recovery described below has occurred. All entities, records, service names, and timelines are invented.

A useful tabletop exposes the decision that becomes difficult when the normal process stops working. These exercises focus on the boundaries between investment operations, IT, external providers, and leadership. They are facilitated discussions using printed or local synthetic inject cards; they are not penetration tests or live incident simulations.

For a shorter first session, the [45-minute workshop pack](../workshops/incident-readiness/README.md) wraps Exercise 3 below with a timed agenda, participant worksheet, observer record and improvement plan. It narrows the discussion; it does not shorten the fictional incident timeline or establish recovery performance.

## Run the exercise

Allow about 60–90 minutes for one scenario, including debrief. This is a suggested workshop duration, not a response target. Choose a facilitator, a scribe, an observer, and one person for each decision role. In a small team, one participant may cover several roles, but record which authority they are exercising.

Use the existing [incident response record](../../documentation/cyber-risk/incident-response-record.md), [BCP](../../documentation/continuity/business-continuity-plan.md), [recovery playbook](../../documentation/continuity/disaster-recovery-playbook.md), and [incident-readiness checklist](../checklists/incident-readiness.md). Bring redacted evidence references or synthetic stand-ins. Do not bring actual payment details, investor records, credentials, security weaknesses, or provider contact lists into this example package.

The facilitator controls the injects. Participants distinguish **known**, **reported**, **assumed**, and **unknown** facts. Every proposed action needs an owner, authority, intended outcome, and verification method. A discussion decision is recorded as “proposed in exercise,” never “implemented.” The facilitator may advance or pause the fictional clock; T+ times sequence discussion and are not service-level or legal deadlines.

### Simulation boundaries

- Announce “EXERCISE” at the start and on every inject. Use role cards instead of impersonating actual staff or providers.
- Do not send phishing, make bank calls, initiate or recall a payment, contact regulators, revoke sessions, alter access, restore production data, or disable a service.
- Do not execute malware, attack payloads, or connector instructions. A card stating that something happened is sufficient.
- Do not paste real logs, prompts, files, or screenshots into an AI tool. The [AI policy](../../documentation/policies/ai-acceptable-use.md) prohibits Confidential information; this exercise grants no exception.
- If a real incident or unexpected live action occurs, stop the exercise, identify it as real, and follow the organization's actual response process. Keep exercise records distinguishable from incident evidence.

### Shared scoring method

Score each scenario's five criteria **0, 1, or 2**: 0 = missed or unsafe decision; 1 = discussed, but ownership, authority, evidence, or verification is missing; 2 = a complete proposed decision and evidence requirement were recorded. Maximum: 10 per scenario. Leave scores blank until the workshop. This is an internal learning measure, not a NIST score, certification, readiness percentage, or proof of technical effectiveness.

Record a separate **critical gap** if participants would release an unverified payment, declare containment or recovery without evidence, use a compromised channel as the only command channel, expose real Confidential data to AI, or take an unauthorized destructive action. A high total cannot cancel that gap. Record what was not exercised; do not award assumed credit.

## Exercise 1 — Changed payment instructions at the fund-operation boundary

**Purpose:** Establish who can pause a payment, verify a changed instruction independently, and coordinate investigation across separate organizations without confusing request, execution, and confirmation.

**Fictional starting point:** A management-company operations team is coordinating a payment for a fictional fund. A separate fund administrator prepares the instruction, two authorized approvers release it, and a bank executes it. An email thread appears to contain a last-minute change to the destination. No real beneficiary, account number, amount, or bank is used.

**Roles:** Finance/payment owner; management-company operations lead; fund administrator represented by the facilitator; bank represented by the facilitator; IT/security lead; executive sponsor; Legal/Compliance; scribe. Participants must identify the legal entity, account owner, release authority, and technical system owner as separate fields rather than assuming IT controls the funds.

| Exercise clock | Facilitator inject | Decision and role expected | Evidence or record expected |
|---|---|---|---|
| T+0 | An apparent administrator email says the usual destination has changed and the investment deadline is close. | Payment owner chooses whether to pause release and identifies the approved instruction-change process. | Proposed hold; who can impose it; affected instruction ID; facts versus assumptions. |
| T+8 | An executive appears to endorse the change within the same thread. The message includes a new callback number. | Operations chooses an independently established verification route, not the number or reply chain supplied with the change. | Protected contact-source reference; person/role to verify; dual-approval requirements. |
| T+18 | The facilitator says the administrator portal shows “approved,” but nobody knows whether that means prepared, released, or settled. | Finance and administrator roles define the status needed from the executing party. IT investigates account activity without declaring the payment safe. | Separate states for instruction preparation, approval, release, bank acceptance, and settlement; unresolved status owner. |
| T+28 | A role card says one release may already have occurred. The bank role has not confirmed the destination or result. | Payment owner proposes immediate escalation through the established bank process and asks what recovery steps the authorized bank contact can attempt. | Proposed contact/recall request, authority, required transaction facts, confirmation still pending; no promise of recovery. |
| T+40 | IT receives a synthetic observation of a suspicious mailbox rule. The administrator says its own investigation is separate. | Incident lead coordinates parallel identity and payment investigation; each party retains responsibility for its own environment. | Evidence-preservation request; scope and timestamp; provider case-owner placeholder; cross-organization handoff. |
| T+55 | Leadership asks, “Was any money lost, and can the next payment go out?” | Finance states confirmed versus unresolved transaction facts. Sponsor decides the conditions for resuming payments; Legal/Compliance evaluates applicable notifications. | Concise situation statement; restart criteria; open decision register; notification assessment with no invented deadline. |

**Facilitator branch:** If the group assumes “approved” means settled, provide a synthetic status legend showing those as different stages. If it identifies the ambiguity, instead make the normal payment owner unavailable and ask the alternate to demonstrate authority. The bank role may report “request received” but must not invent successful recovery.

**Score these five criteria:** (1) payment authority and entity boundaries; (2) independently verified instruction change; (3) accurate transaction/recovery status; (4) coordinated evidence and provider handoff; (5) defined restart and communication decisions.

**Debrief:** Which control would still work if both the email sender and the reply thread were compromised? Who can pause the instruction when the primary owner is absent? What evidence distinguishes a submitted recall from recovered funds? Did the operations deadline pressure anyone to bypass dual control?

**Remediation example:** Assign the finance process owner to document and rehearse an independently sourced callback and alternate approval path using a synthetic instruction. The verifier checks the full process, not just the existence of a policy. Preserve a test record and remaining gaps. Bank/provider access and payment permissions require their own authorized testing outside this tabletop.

The independent verification and urgent financial-institution escalation concepts are supported by the [FBI's BEC guidance](https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise). The fund-operation arrangement above is an original fictional scenario, not an assertion about any firm's payment process.

## Exercise 2 — Identity and SaaS compromise with uncertain session scope

**Purpose:** Separate account containment from confirmed loss of access across identity, email, SaaS sessions, delegated applications, and external sharing.

**Fictional starting point:** A user reports unexpected authentication prompts. A synthetic sign-in report shows a questionable session, and a collaboration workspace reports access to a restricted project folder. The folder represents fictional deal material; no actual data is displayed.

**Roles:** Incident lead; identity administrator; SaaS/workspace owner; managed security provider represented by the facilitator; data owner; business continuity coordinator; Legal/Compliance; communications owner; scribe.

| Exercise clock | Facilitator inject | Decision and role expected | Evidence or record expected |
|---|---|---|---|
| T+0 | A user reports an unexpected prompt and is uncertain whether they approved it. | Incident lead establishes a case and confidence level; identity owner determines the authorized containment scope. | Reported symptom, timestamp/time zone, scope, authority, and next evidence request. |
| T+10 | The synthetic identity record shows an unfamiliar session. The response chat uses the same identity provider. | Lead selects an established independent coordination path and verifies participant identity. | Alternate channel and contact-source references; access route if ordinary sign-in fails. |
| T+20 | A card says “password reset submitted.” A SaaS session and an application grant remain listed. | Identity/SaaS owners distinguish submission from effect, identify each access path, and propose relevant revocation and verification. | Action-to-result table for account, sessions, delegated app access, and SaaS-specific access; unresolved paths visible. |
| T+32 | A file audit export covers only part of the suspected interval. The provider reports a collection delay. | Investigator preserves what exists, defines the missing period and escalation, and avoids a “no exposure” conclusion. | Collection scope, availability/retention limits, provider request and owner, current exposure hypothesis. |
| T+45 | A project owner says an external shared link is business critical and asks that it remain active. | Data owner and incident lead assess scope, containment, and a controlled continuity alternative. | Risk decision, temporary restrictions, acceptance authority, expiry/review trigger, business workaround. |
| T+60 | The user can sign in again. Leadership asks whether the incident is closed. | Lead requires negative access checks and a scoped investigation conclusion; business owner confirms usable authorized access. | Distinct account recovery, service restoration, investigation, and incident closure statuses. |

**Facilitator branch:** If the team treats the password reset as universal revocation, keep a fictional SaaS session active. If it checks separate access paths, instead make the SaaS provider's support portal unavailable through the same compromised identity. Ask for the prearranged alternate route.

**Score these five criteria:** (1) scope and confidence; (2) independent coordination; (3) multiple access paths and verified containment; (4) missing-log/provider escalation; (5) defensible restoration and closure criteria.

**Debrief:** What would prove the affected identity cannot reuse a session? Who can obtain logs when the normal administrator is unavailable? Did a restored login get mistaken for a completed investigation? Which shared access mechanisms sit outside ordinary employee account removal?

**Remediation example:** Identity and SaaS owners produce a service-specific containment matrix showing the action, prerequisite, expected propagation/limitations, verification method, and alternate operator. A separate approved test uses dedicated test identities and synthetic content. Track unresolved log coverage as risk; a new checklist alone does not close it.

## Exercise 3 — Destructive outage with an uncertain recovery point

**Purpose:** Decide how to preserve evidence, maintain minimum business capability, and accept a clean recovery when successful backup jobs do not establish current, usable data.

**Fictional starting point:** Several endpoints cannot open working files and a shared repository is unavailable. A synthetic screen card claims encryption. The cause and scope are not yet established. A deadline-sensitive reporting pack is needed later in the fictional business day.

**Roles:** Incident lead; endpoint/security owner; recovery operator; identity owner; application/business owner; continuity coordinator; managed provider represented by the facilitator; Legal/Compliance; communications owner; scribe.

| Exercise clock | Facilitator inject | Decision and role expected | Evidence or record expected |
|---|---|---|---|
| T+0 | Three synthetic support reports describe unreadable files; a fourth system appears unaffected. | Incident lead coordinates proposed containment and evidence collection, records uncertainty, and identifies critical dependencies. | Affected/unknown/unaffected scope with evidence basis; authorized action plan, tradeoffs, and preservation owner. |
| T+10 | The ordinary response document and provider portal require the affected sign-in service. | Continuity lead selects independent instructions, contacts, and coordination. | Demonstrated reference location in the exercise packet; primary and alternate role assignments. |
| T+22 | A backup card says “job completed 20 minutes ago,” but the protected data point is from the prior fictional day. | Recovery owner distinguishes job completion from the actual recoverable data point and compares the latter with the approved business requirement. | Recovery-point age, known-good assessment, expected data gap, target source, and unresolved RPO variance. |
| T+35 | The facilitator proposes restoring into the original environment because it is fastest. Evidence does not show that compromise is contained. | Lead decides whether the destination is suitable and proposes an isolated bounded validation before broader restoration. | Destination decision, containment prerequisites, authorization, sample scope, stop conditions. |
| T+48 | A synthetic restored pack opens for an administrator, but one excluded role can also read it. | Application owner rejects acceptance until permission and business-use checks pass. | Failed negative-access test; corrected access baseline requirement; revised recovery estimate and owner. |
| T+65 | A fictional data-theft claim arrives while the clean sample is being assessed. | Lead separates outage restoration from possible disclosure investigation. Continuity owner chooses the minimum approved business process. | Evidence confidence, communications draft, provider/counsel escalation, reconciliation plan, and separate closure criteria. |

**Facilitator branch:** If the group proposes routine power-off before discussing containment and evidence, ask what volatile evidence might be lost and which authorized responder can choose the tradeoff. If it handles that decision well, make the recovery operator unavailable and require the alternate to identify the necessary access dependencies. Do not power off or isolate an actual device.

**Score these five criteria:** (1) coordinated scope, containment, and preservation; (2) independent recovery access; (3) correct interpretation of recovery point and data loss; (4) clean destination plus allowed/denied business-use tests; (5) continuity, disclosure uncertainty, and reconciliation.

**Debrief:** Which target is a business requirement and which result has actually been demonstrated? Can a provider restore data when identity is unavailable? How will work performed during the outage be reconciled? Did anyone assume successful recovery disproves exfiltration?

**Remediation example:** Recovery and business owners define a bounded synthetic restore test with explicit permission checks, a timed usable-service result, measured data loss, and reconciliation evidence. The actual test requires separate authorization and isolation. Until then, record “tabletop decision rehearsed; technical recovery untested.”

CISA's [StopRansomware guide](https://www.cisa.gov/stopransomware/ransomware-guide) supports coordinated isolation, independent communications, evidence-aware response, and tested recovery. This exercise adds fictional investment-operations decisions; it does not authorize incident commands or ransom negotiation.

## Exercise 4 — AI connector retrieves and discloses out-of-scope information

**Purpose:** Stop an unauthorized data route, establish what the connector and downstream services actually handled, and determine conditions for any restart without weakening the data policy.

**Fictional starting point:** A pilot assistant is approved to summarize public research and synthetic training records. A facilitator card says its connector retrieved a folder outside the approved scope and a response displayed a fictional sensitive excerpt. The labels and content are synthetic. In a real case, Confidential information must never be submitted to the assistant for investigation.

**Roles:** Incident lead; AI/connector owner; identity administrator; source data owner; platform provider represented by the facilitator; Legal/Compliance and records owner; business sponsor; scribe.

| Exercise clock | Facilitator inject | Decision and role expected | Evidence or record expected |
|---|---|---|---|
| T+0 | A synthetic assistant response includes content outside the approved pilot dataset. | Owner proposes stopping the affected workflow and preventing further retrieval or sharing under incident authority. | Stop scope, identity/connector involved, observed result, action owner, and verification method. |
| T+10 | A connector card shows broader delegated access than the pilot description implied. | Identity and source owners identify the actual grant, source permissions, affected workspaces, and separate downstream actions. | Data-route diagram, permission basis, collection scope, relevant service identities, and unknowns. |
| T+20 | An inert source-document card contains instructions to forward information. A participant suggests the retrieved document authorized that action. | Lead distinguishes source content from user/organizational authority and preserves it as untrusted evidence. | Approved task/action scope; suspected instruction source; decision refusing authority expansion. |
| T+32 | The provider role says deleting the visible conversation does not yet confirm the status of logs, exports, caches, or other retained copies. | Records owner and Legal/Compliance define preservation and provider questions before disposal decisions. | Requested data categories, retention/deletion basis, provider case owner, pending answers, and evidence location outside AI. |
| T+45 | Sponsor asks to reconnect with “enterprise settings” because the pilot is useful. | Data owner maintains the Confidential-data prohibition and requires a reviewed synthetic/public scope with independently checked permissions. | Explicit no-go or bounded restart conditions, approved scope, negative tests, rollback/stop owner. |
| T+60 | A card says connector revocation was accepted, but no observation confirms that a new retrieval fails. | Technical owner distinguishes a submitted change from a verified boundary. Lead keeps containment unconfirmed. | Planned denied-retrieval test using synthetic material, observed result placeholder, and provider follow-up. |

**Facilitator branch:** If the group assumes deleting the chat removes every copy, reveal an unconfirmed export destination. If it investigates the data route, instead make the connector owner unavailable and test whether the alternate knows the administrative stop path. Do not create exports or enable an actual connector.

**Score these five criteria:** (1) bounded stop and verified containment; (2) complete source-to-destination scope; (3) refusal of instructions embedded in retrieved content; (4) preservation/provider/records decisions; (5) policy-consistent restart criteria and negative tests.

**Debrief:** What evidence would distinguish retrieved, displayed, exported, and retained content? Can the source owner and AI owner see different parts of that route? Did the team investigate without resubmitting potentially exposed data to AI? Does the approved scope survive a connector or permission change?

**Remediation example:** Connector and data owners replace broad access with a reviewed synthetic/public dataset, demonstrate one permitted retrieval and one denied retrieval, and record the stop control. Independently verify the tested identity and destination. A training opt-out, paid tier, or policy exception request does not by itself authorize Confidential data; the current [AI](../../documentation/policies/ai-acceptable-use.md) and [data-handling](../../documentation/policies/data-classification-and-handling.md) policies continue to apply.

## Debrief and remediation record

Capture a concise result for each exercise before discussing improvements. Avoid scoring individual employees. Score the process demonstrated by the group and the evidence available.

| Field | Record |
|---|---|
| Exercise ID, date, participants, scope | Internal record; fictional scenario selected; components deliberately not tested |
| Five criterion scores and evidence | Each score with the decision/evidence reference supporting it; total out of 10 |
| Critical gaps | Decision failure and business consequence; never hidden by total score |
| Strengths | Specific demonstrated process, not a general assurance claim |
| Remediation | Gap; accountable owner; decision authority; agreed due date; expected evidence; independent verifier |
| Retest | Scenario or bounded technical check; prerequisites; scope; expected and observed result |
| Residual risk | Remaining uncertainty, risk owner, acceptance/next-review decision if applicable |

Classify follow-ups as procedure, access/authority, technology, provider dependency, training, or evidence coverage. Choose the next action based on the exposed business consequence. Do not assign an invented deadline or close an issue merely because a document was updated. A completed discussion, implemented fix, and verified outcome are different states.

## Research basis and limits

[NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final), published April 2025, integrates incident response across CSF 2.0 risk management. These exercises use that framing to connect preparation, decisions, detection, response, recovery, and improvement; they are not a complete NIST control mapping.

CISA's [JCDC AI cybersecurity collaboration playbook announcement](https://www.cisa.gov/news-events/alerts/2025/01/14/cisa-releases-jcdc-ai-cybersecurity-collaboration-playbook-and-fact-sheet) describes voluntary AI incident information-sharing processes. Voluntary sharing does not replace an organization's own notification assessment or authorize sending sensitive evidence to a model.

The scenario cards, scoring rubric, roles, and timings are original design choices. Source guidance informs the response principles, not fictional results. All sources were reviewed on 2026-09-17. Legal/Compliance must determine any actual contractual, legal, insurance, or regulatory obligations from the facts and jurisdiction; this package supplies no universal notification deadline and sends no report.
