# Facilitator guide

**EXERCISE ONLY.** Original prompts for the [45-minute workshop](README.md). Read the [canonical Scenario 3](../../scenarios/tabletop-exercises.md) before starting. Its six injects and facts remain authoritative; this guide does not supply a second scenario.

## Before the clock starts

Record the revision and assign the scenario's roles: incident lead; endpoint/security owner; recovery operator; identity owner; business/application owner; continuity coordinator; managed provider (played by facilitator); Legal/Compliance; communications owner; scribe. Combine roles explicitly if needed. Confirm who acts as an alternate.

Ask the observer to record the first answer and any later assistance. Keep evaluation notes separate from prompts. Participants may consult the linked operating documents; record when a facilitator hint changes the answer. Do not supply a fictional fact merely to rescue an incomplete decision. Unknown is a useful result.

For each inject, read only its canonical **Facilitator inject** cell. Keep expected decisions and evidence columns as facilitator guidance. Reveal the next inject only after recording the preceding decision. The compressed wall clock does not change the scenario's T+ times.

## 00:00–05:00: briefing

Read the canonical starting point, then the three [objectives](README.md#three-objectives). Ask each participant to identify their role and authority. State that all operational actions remain proposed and all supplied evidence is synthetic. A real event interrupts the exercise.

Have the scribe start the [worksheet](participant-worksheet.md) and [log](decision-log.csv). If the group asks for an unsupplied fact, record the request, why it affects a decision and who would obtain it. Never answer with invented certainty.

## 05:00–12:00: Round 1 — establish scope and independent coordination

**Reveal:** Scenario 3 **T+0**, discuss briefly, then **T+10**. Related checklist: IR-01, IR-02, IR-06, IR-08, IR-16 and IR-18.

Ask:

- Which statements are reports, which are observations supplied by the scenario, and which are assumptions about cause or scope?
- Who can declare the event, approve proposed containment, and decide preservation tradeoffs? Who is the alternate?
- Where could responders find instructions and verified contact references if the normal identity service is unavailable? What evidence would show that route is independent?

**Evidence expected:** D1 records an affected/unknown scope, an authority path and preservation owner. A coordination reference identifies dependencies and its verification gap. A second application that uses the affected sign-in is not sufficient independence.

**Answer boundary:** The apparently unaffected fourth system has a limited observation, not a clean forensic bill of health. The supplied encryption claim does not establish the full cause. Proposed containment is not confirmed containment.

Use only the source scenario's optional branch if useful: ask about preservation if participants propose routine power-off, or make the recovery operator unavailable if their initial reasoning is sound. Record which branch was used. This is an optional discussion branch from the source, not a seventh default inject.

## 12:00–20:00: Round 2 — distinguish the recovery point from the job

**Reveal:** Scenario 3 **T+22**. Related checklist: IR-03 and IR-21.

Ask:

- Which timestamp describes completion of a backup job, and which describes the data actually available for recovery?
- Where does the business requirement come from? Is it approved, illustrative or unknown?
- What is needed to assess known-good status and the intervening work that may be missing?

**Evidence expected:** D2 keeps job time and protected data time separate, identifies the requirement source and assigns the unresolved data gap. Link the [BCP](../../../documentation/continuity/business-continuity-plan.md) and [recovery playbook](../../../documentation/continuity/disaster-recovery-playbook.md).

**Answer boundary:** The inject provides no exact absolute protected-data timestamp or approved numerical target. Participants must not invent an exact RPO variance. The BCP's numbers are fictional examples. Request the missing inputs and retain uncertainty; a recent completion notice does not prove suitably recent data.

## 20:00–28:00: Round 3 — choose a destination and withhold premature acceptance

**Reveal:** Scenario 3 **T+35**, record the proposed decision, then **T+48**. Related checklist: IR-18, IR-21 and IR-22.

Ask:

- What must be established before restoring into any destination? Who owns that decision?
- What bounded sample, preservation steps and stop conditions would make a later authorized technical test interpretable?
- After the second inject, what does administrator access establish? What does the excluded role's access mean for acceptance?

**Evidence expected:** D3 identifies a suitable destination as a prerequisite, a known-good basis to establish, a sample scope, authority and stop conditions. The business owner withholds acceptance after the supplied failed negative-access check. Record required allowed/denied tests and an ordinary user's business task.

**Answer boundary:** No actual restore happened here. Do not turn the synthetic restored-pack observation into a claim about the organization's backups or permissions. A corrected proposal or disabled share is not proof of successful recovery. Use the [bounded recovery exercise](../../../documentation/recovery-exercise-example.md) to plan follow-up, not execute it during this session.

## 28:00–34:00: Round 4 — communicate uncertainty and preserve separate closure states

**Reveal:** Scenario 3 **T+65**. Related checklist: IR-14, IR-23 and IR-24.

Ask:

- What is confirmed within the scenario, what is merely claimed, and what remains unbounded?
- Which minimum business process could be proposed, with what owner, restriction and reconciliation need?
- What can leadership be told now without implying that disclosure is disproved or the incident is closed?

**Evidence expected:** D4 and the [holding update](holding-update-template.md) distinguish outage restoration, possible disclosure, investigation and closure. Identify the Legal/Compliance role that would assess actual obligations and the evidence they would need. Keep the update unsent.

**Answer boundary:** There is no universal notification deadline in this pack. The theft claim is not proof of theft, and restoration is not proof of no theft. Participants can identify a pending determination without manufacturing a definitive answer.

## 34:00–41:00: immediate debrief

Ask each role for one supported strength and one gap. The observer relates them to the five [source criteria](observer-scorecard.md), citing D1–D4 or a more precise log row. Preserve the first answer and whether prompting was needed.

Use these questions:

- Where did the group replace an observation with an assumption?
- Which important decision lacked an owner, authority or usable evidence?
- Which proposed check could change the acceptance decision?
- Which objective or source criterion was not actually exercised?

Do not rate individual employees. Use the source process rubric and report critical gaps separately. If time prevented examination, mark **not exercised**, not zero or assumed success.

## 41:00–45:00: improvements and close

Choose up to three gaps by business consequence. Complete the [improvement plan](improvement-plan.csv): proposed fix, accountable owner, approval owner, agreed review/due date, verification method, independent verifier and retest scope. Unagreed assignments remain unresolved and go to the sponsor; no date is invented to fill the form.

Restate the outcome: decisions rehearsed, technical results untested, open gaps and next review. Preserve the session record internally. Do not submit the illustrative debrief as evidence, and do not mark a gap closed because a document was revised.

See the [README research record](README.md#research-basis-and-limits) for dated source support and limits. These timings and prompts are original facilitation choices, not validated response targets.
