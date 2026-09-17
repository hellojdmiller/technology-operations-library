# Incident response record

> Adapted template. Version 0.1. All fields are blank unless explicitly marked as a fictional example. This file is not an incident report about a real event. Store completed operational records in a protected incident system, not this resource repository.

Use this record to preserve the facts, decisions, actions, and verification associated with an incident. Update it as the investigation changes; identify assumptions and superseded conclusions rather than silently replacing them.

## Incident identification

| Field | Entry |
|---|---|
| Incident ID | [Internal reference] |
| Reported time and time zone | [Timestamp] |
| First known occurrence and confidence | [Timestamp or unknown; basis] |
| Reporter and verified contact reference | [Protected directory reference] |
| Incident lead and alternate | [Role and internal assignment] |
| Current phase | [Triage / response / recovery / review] |
| Current status and next update | [Status; owner; timestamp] |

## Situation and impact

Describe what was observed, who observed it, the affected business function, the suspected scope, and what remains unknown. Separate a reported symptom from a confirmed cause.

| Dimension | Record |
|---|---|
| Functional impact | Which capability is unavailable or impaired, for whom, and against which deadline |
| Information impact | Known or suspected confidentiality, integrity, or availability effect; classification of affected data |
| Recovery effort | Available recovery path, required help, dependencies, and uncertainty |
| Current priority | Rationale, assessor, and time; reassessment trigger |

Do not record “no exposure” merely because none has yet been detected. State the investigation scope and evidence supporting the conclusion.

## Event and decision timeline

| Time and zone | Type | Observation or decision | Actor or authority | Evidence reference | Status |
|---|---|---|---|---|---|
| [Timestamp] | [Report / action / decision / verification] | [Concise entry] | [Internal reference] | [Protected reference] | [Confirmed / reported / pending] |

**Fictional illustration:** At exercise time T+12 minutes, an operator submits a device lock command. The console reports Pending. Record “lock requested; device execution unconfirmed.” Do not record “device secured.”

## Response and recovery actions

| Action | Purpose and scope | Authorization | Expected result | Observed result and evidence | Remaining issue |
|---|---|---|---|---|---|
| [Action] | [What it contains or restores] | [Approver or standing authority] | [Acceptance check] | [State and reference] | [Owner and next step] |

Coordinate containment with evidence preservation and business continuity. Record significant tradeoffs. Destructive actions require the appropriate incident authority and consideration of preservation needs. Restoration requires a suitable known-good state and a safe destination.

## Evidence handling

For each artifact, record the source, collector, collection time and time zone, collection method, protected storage reference, access restriction, and integrity information where applicable. Record transfers or transformations that matter to interpretation. Preserve originals under the applicable process.

Do not paste secrets, private messages, or unredacted screenshots into this reusable template. The internal incident system should control access to actual evidence.

## Communications and notification decisions

| Audience | Decision and trigger | Responsible reviewer | Approver | Due time and basis | Sent time and evidence |
|---|---|---|---|---|---|
| [Internal / provider / affected party / authority] | [Notify / pending assessment / not required with rationale] | [Role] | [Role] | [Determined by appropriate specialist] | [Confirmed reference or pending] |

Legal or Compliance determines applicable obligations, recipients, and deadlines for the actual facts and jurisdiction. Keep the basis for a decision and its reassessment triggers. This template supplies no universal notification deadline.

## Recovery acceptance and closure

Record the capability restored, technical checks, business-owner acceptance, unresolved risks, ongoing monitoring, and temporary access or workarounds to remove. Distinguish service restoration from completion of the investigation.

| Closure field | Entry |
|---|---|
| Service restored at | [Timestamp and business verification] |
| Investigation conclusion | [Supported conclusion and uncertainty] |
| Residual work | [Action, owner, due date, tracking reference] |
| Closure authority | [Decision and date] |
| Post-incident review | [Owner and planned date] |

## Lessons and follow-up

Review detection, reporting, coordination, evidence, controls, and recovery. Identify what worked, what delayed the response, and what should change. Assign each improvement an owner and a way to verify completion. Update the relevant policy or runbook and test the revised process.

Related: [risk assessment](risk-assessment-and-treatment.md), [lost device procedure](../procedures/lost-device-response.md), [BCP](../continuity/business-continuity-plan.md).
