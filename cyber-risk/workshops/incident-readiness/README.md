# A 45-minute incident-readiness workshop

**EXERCISE ONLY.** Original facilitation pack, version 0.1; researched September 19, 2026. This workshop has not been facilitated or technically executed. Its example debrief is fictional.

Use this pack to rehearse decisions when normal access and recovery evidence are unreliable. It wraps **Exercise 3 — Destructive outage with an uncertain recovery point** in the existing [tabletop scenarios](../../scenarios/tabletop-exercises.md). Keep that document open: it is the canonical narrative, six injects and five assessment criteria. This pack adds a short agenda and working records without creating another incident story.

## Three objectives

1. Identify the decision owner, alternate and independent coordination route.
2. Distinguish proposed containment/recovery actions from evidence of their effects.
3. Define acceptance criteria and leave material evidence gaps with an owner and next check.

The 45 minutes are workshop wall time. Scenario times such as **T+65** are fictional inject references; neither clock is a response target, legal deadline, demonstrated RTO or service commitment. Preparation occurs before the session. If discussion needs more time, mark unfinished items **not exercised** and use the fuller 60–90 minute scenario later.

## Prepare

- Record the repository revision, selected scenario and facilitator. Assign a scribe/observer and the scenario's decision roles. A small group may combine roles, but must state which authority it is exercising. The facilitator can represent the managed provider; no provider is actually contacted.
- Open the six canonical Scenario 3 injects at T+0, T+10, T+22, T+35, T+48 and T+65. Reveal them in the order below. Do not distribute later injects or answer guidance to participants early.
- Prepare the blank [worksheet](participant-worksheet.md), [decision log](decision-log.csv), [observer scorecard](observer-scorecard.md), [holding update](holding-update-template.md) and [improvement plan](improvement-plan.csv). Keep the [facilitator guide](facilitator-guide.md) and [illustrative debrief](example-debrief.md) separate from participant materials.
- Use fictional references to contacts, access methods and evidence. The linked BCP contains illustrative targets; no target becomes an approved real requirement by appearing in this packet. If the scenario does not supply a precise value, record the missing input.

## Run the session

| Wall time | Minutes | Activity | Canonical scenario reference |
|---|---:|---|---|
| 00:00–05:00 | 5 | Brief roles, objectives and exercise boundaries | Starting point |
| 05:00–12:00 | 7 | Round 1: scope, authority and independent coordination | T+0, then T+10 |
| 12:00–20:00 | 8 | Round 2: recovery point and business requirement | T+22 |
| 20:00–28:00 | 8 | Round 3: destination and acceptance evidence | T+35, then T+48 |
| 28:00–34:00 | 6 | Round 4: disclosure uncertainty, continuity and update | T+65 |
| 34:00–41:00 | 7 | Immediate debrief against evidence and objectives | No additional inject |
| 41:00–45:00 | 4 | Assign up to three priority improvements and close | No additional inject |
| **Total** | **45** | | |

Record what participants actually discuss. A complete proposed decision includes an owner, authority, scope, expected outcome and verification method. It remains a proposal. A facilitator-supplied synthetic observation is part of the exercise facts, not a real system result. Missing, stale or conflicting information stays visible.

## Use the records

| Artifact | Purpose |
|---|---|
| [Facilitator guide](facilitator-guide.md) | Prompts, six-inject sequence and answer boundaries |
| [Participant worksheet](participant-worksheet.md) | Four rounds of decisions and acceptance questions |
| [Decision log CSV](decision-log.csv) | Blank editable timeline; one row per observation, decision or gap |
| [Observer scorecard](observer-scorecard.md) | Five source criteria, assistance, unexercised scope and critical gaps |
| [Holding update template](holding-update-template.md) | Draft an exercise-only status update; nothing is sent |
| [Improvement plan CSV](improvement-plan.csv) | Blank editable owner, approval, verification and retest record |
| [Illustrative debrief](example-debrief.md) | Show an honestly incomplete outcome; do not reuse it as session evidence |

The CSV files contain headers only. In `decision-log.csv`, use `record_type` values such as fact, proposal, decision or gap. `fact_status` records known-in-scenario, reported, assumed or unknown. `simulation_state` distinguishes **supplied synthetic observation**, **proposed in exercise**, **discussion observed** and **not exercised**. An observed discussion is not an executed containment or restore.

In `improvement-plan.csv`, leave dates and owners unresolved until agreed. Suggested `status` values are proposed, awaiting approval, authorized, implementation reported, verification pending, verified for recorded scope, or deferred with risk decision. Keep `retest_result` not run until an actual bounded retest occurs. Store real follow-up evidence in the appropriate protected system, not this public repository.

## Connect to the operating documents

- [Incident-readiness checklist](../../checklists/incident-readiness.md): use the selected IR IDs in the facilitator guide. A decision rehearsal can support that narrow capability; it cannot establish a live control's effectiveness.
- [Incident response record](../../../documentation/cyber-risk/incident-response-record.md): carry fuller timeline, evidence, authorization and closure records into the actual internal process when appropriate.
- [BCP](../../../documentation/continuity/business-continuity-plan.md) and [recovery playbook](../../../documentation/continuity/disaster-recovery-playbook.md): distinguish business targets, recovery points, usable service and acceptance.
- [Bounded recovery exercise](../../../documentation/recovery-exercise-example.md): plan a separately authorized technical follow-up when the tabletop exposes a recovery gap.
- [Risk and treatment record](../../../documentation/cyber-risk/risk-assessment-and-treatment.md): preserve unresolved consequences and their acceptance owner.

## Keep the exercise contained

Announce EXERCISE at the start and label every working record. No phishing, bank/provider call, notification, message, account change, isolation command or restore is part of the session. Use no real private evidence or credentials and do not submit Confidential information to AI. If a real incident or unintended live action appears, stop the exercise and follow the organization's actual response process; keep the records separate.

## Research basis and limits

Sources below informed the design; the timings, prompts and forms are our adaptation. They establish no participant result, vendor capability, compliance score or complete standards implementation.

| Source and date | Support and application |
|---|---|
| [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final), final April 3, 2025; printed pp. 19–20, 27–28, 34–35 | Exercise improvement (ID.IM-02), response/continuity alignment (ID.IM-04), incident decisions (RS.MA) and recovery criteria (RC.RP) inform the three objectives and separate acceptance records. |
| [CISA CTEP package documents](https://www.cisa.gov/resources-tools/resources/ctep-package-documents), page revised February 2, 2023; [Planner Handbook](https://www.cisa.gov/sites/default/files/2023-01/2_-_ctep_exercise_planner_handbook_2021_final_508.pdf), 2021 file edition, Appendix A | Objectives, questions and duration can be adapted. Our 45-minute agenda narrows the discussion; it is not CISA's recommended example agenda. |
| [CISA Facilitator/Evaluator Handbook](https://www.cisa.gov/sites/default/files/publications/3%20-%20CTEP%20Facilitator%20Evaluator%20Handbook%20%282020%29%20FINAL_508_2.pdf), 2020 file edition, pp. 3–4 and 7 | Objective-focused facilitation, decision observations, immediate debrief and owned improvements inform separate facilitator, observer and follow-up records. |
| [CISA StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide), [publication record](https://www.cisa.gov/resources-tools/resources/stopransomware-guide) revised October 19, 2023 | Independent coordination, preservation tradeoffs and clean recovery support the existing Scenario 3 decisions. The exercise does not execute incident commands. |

Research review: September 19, 2026. Relevant NIST text and CISA handbook/response sections were read from official sources. No third-party exercise narrative or form is copied. Revisit after source revisions, changed response authority, service dependencies, recovery procedures, or the first actual workshop. Editorial checks cannot establish that 45 minutes will suit every group. These Markdown/CSV sources are editable; no fixed pagination or print rendering has been validated.
