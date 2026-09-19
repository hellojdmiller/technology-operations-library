# Deliver one useful training session, then check what carries forward

Start with one operator, one coach and one task the operator needs to understand. Use the existing vendor walkthrough as the lesson; this pack supplies the delivery and follow-up records. It works for an internal coach or a service provider training a customer's team.

**Research reviewed:** September 19, 2026. **Status:** original, unexecuted delivery proposal. The 60-minute session and 30-day cadence are planning choices, not measured learning results, vendor course requirements or a certification program.

## Choose a path

The first session uses [Microsoft 365 request routing](../vendor-walkthroughs/microsoft-admin-routing.md), a tabletop that needs no tenant. For a different capability, substitute one card, its original fixture, answer guidance and transfer question. Do not try to cover all eight in one session.

| Capability | Existing card | What the coach reviews |
|---|---|---|
| Route requests across owners | [Microsoft 365 routing](../vendor-walkthroughs/microsoft-admin-routing.md) | Responsibility, missing evidence and next permitted check |
| Explain an access decision | [Entra](../vendor-walkthroughs/entra-access-decision.md) | Policy scope, report-only meaning and enforcement limits |
| Investigate device compliance | [Intune](../vendor-walkthroughs/intune-compliance-evidence.md) | Assignment, evaluation and evidence freshness |
| Explain user-setting scope | [Google user scope](../vendor-walkthroughs/google-user-scope.md) | Units, groups and unresolved effective settings |
| Verify file access | [Google shared drives](../vendor-walkthroughs/google-shared-drive-access.md) | Intended and observed allowed/denied access |
| Interpret endpoint results | [Jamf](../vendor-walkthroughs/jamf-inventory-policy.md) | Scope, execution and inventory evidence |
| Inspect an automation result | [n8n import](../vendor-walkthroughs/n8n-import-and-result.md) | Expected versus actual fixture results |
| Explain automation failure | [n8n recovery](../vendor-walkthroughs/n8n-failure-and-recovery.md) | Failure class, recovery limits and handoff |

For the proposed learning stages and AI coaching rationale, use [Building capability with AI](../../research/building-capability-with-ai.md) and its [development plan](../../research/companions/09-user-development-plan.md). Keep one plan ID across the records. This pack does not replace those evidence notes or the fuller [operator training record](../training-record-template.md).

## Prepare before the clock starts

Agree on the task, learner's starting experience, communication needs and one observable objective. For the default card: **route the four fictional requests, distinguish technical access from business approval, and explain a safe next step when the usual approver is unavailable**. The coach checks the card's answer guidance before teaching it.

Use the blank [coach review](coach-review.md) to record the selected reference and conditions. Keep the original first answer; corrections should remain distinguishable from it. Agree who can view the learner's record, how the learner can correct it, and a review/deletion date. Keep real records and evidence in a protected workspace, outside this public repository.

| Prerequisite | Tabletop path | Optional technical path |
|---|---|---|
| Source and access | Reopen the chosen card's official links and select a short section | Also check current product version, subscription, roles and lab instructions |
| Vendor portal | Use public reading where available; record account or enrollment barriers | Portal enrollment does not supply a product tenant or operator authority |
| Environment | Fictional fixture and local worksheet only | Use a separately authorized isolated lab under the card's parent module; schedule setup outside this session |
| Media and accessibility | Agree written, spoken or other accessible response format; use the card's text alternative if video is unavailable | Check actual captions, keyboard access and reading access; unverified availability stays unknown |
| Assistance | Decide permitted references, accommodations, coach hints and optional AI use in advance | Do not expand permissions or connect production data to make an exercise work |

Microsoft Learn's [FAQ](https://learn.microsoft.com/en-us/training/support/faq) describes free reading and profile-based progress features; its current sandbox section says the former Learn sandboxes are no longer available. Do not assume a free sandbox or subscription exists. Other vendors' portal and product prerequisites remain in the [walkthrough index](../vendor-walkthroughs/README.md) and individual cards. Video playback, enrolled course access and caption availability have not been tested for this pack.

A reading alternative is not a verified video transcript. Offer a written response instead of an oral teach-back, allow agreed assistive technology, and extend the session when needed. Record a changed duration rather than treating it as weaker performance. If an essential reference cannot be accessed, mark the affected check not attempted and reschedule; do not invent its content.

## Run and revisit

| Proposed point | Activity | Evidence to retain |
|---|---|---|
| Day 1 | Run the [60-minute session](session-guide.md) | First answer, revised artifact, assistance and immediate explanation |
| Around day 7 | Revisit one incomplete criterion; allow targeted coaching, then a fresh attempt | Correction and what support was still needed |
| Around day 14 | Present one coach-checked changed case without answer assistance | Initial decision, rationale, uncertainty and escalation; record any later hints separately |
| Around day 30 | Revisit a different case and ask for a short handoff to another operator | Delayed explanation, remaining gaps and whether the handoff can be followed |

Plan about 15–20 minutes for each follow-up, adjusting by agreement. These dates are a proposed first-month pilot, not a guaranteed progression ladder. A missed check leaves retention unobserved. The day-1 card question is a rehearsal if the learner has seen it; use a new, reviewed variation for later transfer checks. Change one consequential fact, retain similar difficulty, and write the expected reasoning before delivery. Do not convert an ambiguous new case into a wrong answer.

NIST's guidance discusses later workplace-behavior follow-up, usually at three to six months. Our shorter schedule only gathers early, bounded observations; it cannot establish durable workplace impact. Longer follow-up remains a separate decision. See the research record below.

## Keep the records useful

- [learner-progress.csv](learner-progress.csv): blank header-only log, one row per scheduled check or distinct attempt, with a unique `check_id`. Preserve earlier attempts when help is added and link related checks in `notes`.
- [coach-review.md](coach-review.md): blank evidence rubric and decisions for one check.
- [worked-example.md](worked-example.md): fictional, incomplete progression showing how to describe limits; never import it as observed data.

In the CSV, `check_status` is **scheduled / observed / not_attempted / not_observed**. Use `not_attempted` when the planned task did not happen; use `not_observed` when it may have happened but the reviewer has no usable evidence. A learner's report alone stays reported in `notes`. Neither state is a zero or a failed task. Leave unknown dates and minutes blank; explain the gap.

For assessed result fields, use **demonstrated / partial / not_demonstrated / not_observed** and state the bounded scope in the evidence reference. An unattempted check has `not_observed` result fields, not invented scores. `study_status` records actual selected-material coverage, not a whole course. `vendor_completion_status` is **not_attempted / in_progress / learner_reported / independently_verified**, with credential/course and evidence details in the linked review. Do not infer an award from this pack.

`practice_artifact_result` concerns the exercise output. `real_work_outcome` remains **not_in_scope** here; a useful fictional routing map is not a resolved customer ticket. `production_authority_ref` remains **not_granted_by_training** unless it references a separate, existing authorization record. Training progress cannot supply that authorization. Distinguish proposal, approval, execution and verification in any later operational record.

Compare checks only with their case difficulty, reference version, permitted aids and actual assistance visible. “Unaided” here means **no answer assistance from AI, coach, peer, answer key or prior worked response**. A fixture, agreed reference document and accessibility support may remain available; record them. This is independent reasoning with permitted references, not necessarily closed-book recall. Do not average incomplete checks into a competence percentage or use the log as an automatic employment ranking.

## Research basis and limits

The source facts below inform the design; they do not validate this pack or any learner. Sources were reopened September 19, 2026.

| Primary source and date | Relevant guidance / fact | Our application and limit |
|---|---|---|
| NIST, [SP 800-50r1: Building a Cybersecurity and Privacy Learning Program](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-50r1.pdf), published September 12, 2024; sections 3 and 5.2.3 | Align learning needs, objectives and assessment; distinguish learning from workplace behavior and organizational results. | One task, separate evidence fields and follow-up. Federal cybersecurity/privacy program guidance informs this broader operator adaptation; it does not prescribe our timing or prove effectiveness. |
| Microsoft, [Learn FAQ](https://learn.microsoft.com/en-us/training/support/faq), displayed update October 27, 2025 | Reading and progress features have different access conditions; former sandboxes are no longer available. | Check actual source and lab access before scheduling. Public-page inspection only; no profile, subscription or lab created. |
| Microsoft, [Microsoft 365 admin center overview](https://learn.microsoft.com/en-us/microsoft-365/admin/admin-overview/admin-center-overview?view=o365-worldwide), displayed update February 2, 2026 | Explains administration surfaces and plan-dependent availability. | Reading for the existing routing card. It does not establish a fictional request's approval or an operator's exact role entitlement. |
| Microsoft, [Practice Assessments for Microsoft Certifications](https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications), displayed update August 31, 2026 | Practice assessments help identify preparation gaps and do not replace training or product experience. | Keep our exercise evidence separate from vendor achievements. This pack is not an official Practice Assessment and supplies no exam questions. |

The [capability companion](../../research/building-capability-with-ai.md) supplies the existing proposed coaching loop and its study limitations. No new claim about AI tutoring effectiveness is made here. Optional AI feedback must be checked by the human coach against the selected card; an AI score is not the assessment record.

Revisit this pack after a source or card changes, a prerequisite blocks delivery, learner feedback identifies an accessibility gap, or the first session exposes unsuitable timing or criteria. Record the revision used before changing the next attempt.
