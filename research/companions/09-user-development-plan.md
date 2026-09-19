# User development plan: building capability with AI

Review edition · September 18, 2026

Use this plan with the third research companion, [Helping people build capability with AI](../building-capability-with-ai.md). This is a proposed learning process, not a validated competence test.

## Agree on the goal and starting point

**Plan ID / learner reference / coach or reviewer / date:** [fill in]

**Capability the learner wants to build / why it matters:** [fill in]

**Specific work they should be able to explain and perform:** [fill in]

**Existing experience / learning preferences / accessible format / allowed aids:** [fill in]

**Starting exercise / checked reference / observed support needs:** [fill in]

**Who can view the record / learner correction process / review or deletion date:** [fill in]

Use an agreed learner reference rather than unnecessary personal details. Keep sensitive data out of prompts and examples. Prefer approved or fictional training material. A skill observation does not grant permission to act in production.

## Choose the next stage for this capability

| Stage | Practice to arrange | Evidence for a next step |
| --- | --- | --- |
| Understand | Explain one idea through a checked example, then ask for a short explanation. | Learner identifies the objective, key distinction, and verification source. |
| Practice | Attempt varied cases; use hints or a worked explanation as needed. | Learner corrects the attempt and explains why, with support recorded. |
| Transfer | Use a different exception with agreed aids and no unannounced restrictions. | Learner adapts, checks evidence, and identifies the limit of their authority. |
| Improve and teach | Improve a procedure and ask another person to use it. | Recipient can follow it, and the learner explains exceptions and recovery. |

Stages describe support for one capability. They are not job grades. An unfamiliar system or changed policy may require more support again.

**Current stage / evidence / next stage proposed:** [fill in]

**Cases, criteria, and support conditions agreed before review:** [fill in]

**What would support reducing help / retaining help / changing the exercise:** [fill in]

## Run a practice cycle

1. Choose learn, work, or review mode. In work mode, meet the immediate task and schedule any needed practice separately.
2. State the objective and check the reference answer or rubric.
3. Invite an attempt or prediction; provide an example first if the prerequisite is unfamiliar.
4. Offer targeted feedback, starting with a hint when useful. Give a fuller explanation when requested or when the learner remains stuck.
5. Have the learner revise and explain the correction. Check the tutor's feedback against the reference.
6. Choose a varied next case and a later transfer check. Record the support actually used.

**Coaching prompt / model configuration / reference version:** [fill in]

**Feedback checked by / incorrect feedback found / correction:** [fill in]

**Learner effort / coach-reviewer effort / usable work produced:** [fill in]

## Record observations without overstating them

Use `user-progress-log.csv`, one row per scheduled check. Update a pending check when it happens, keeping its record ID; make a new record for a retry. Keep the earlier result. The separate fictional log shows three completed checks and one pending delayed check.

- `check_type`: baseline, practice, transfer, delayed_transfer, or handoff.
- `check_status`: completed, pending, missed, or cancelled. A pending/missed check has no observed date or measured effort until evidence exists.
- `support_used`: describe the actual aids, hints, answer assistance, and human coaching. No answer assistance can still allow approved reference documents; state that explicitly.
- `output_result` and `understanding_result`: demonstrated, partial, not_demonstrated, or not_observed, judged against the local criteria. Record feedback and supporting evidence.
- `stage_before` and `stage_proposed`: understand, practice, transfer, or improve_and_teach. Leave the proposal blank if undecided. A proposed stage is not an observed outcome.
- `progression_decision`: advance, continue_practice, revise_plan, or pending, with a named reviewer, rationale, and decision date. Pending keeps `decision_by` and `decision_date` blank until a decision is made.
- `learner_minutes` and `coach_reviewer_minutes`: measured person-minutes. Blank means unmeasured; zero requires an observation.

Compare cases of comparable difficulty and aid conditions. Review progress for the same capability over time; do not combine task-specific results into a universal user score. A correct output after a worked answer is evidence of assisted performance, not independent mastery. Delayed retention remains unmeasured until a delayed check is completed.

## Fictional coaching example and answer guide

All entries in `fictional-user-progress-log.csv` are invented training records for learner F-01 and reviewer Coach-01. The capability is distinguishing purchased entitlement from advertised availability. Packet versions and evidence references are fictional labels, not missing real attachments.

- **G-01, baseline:** the learner claims an advertised feature is included. They can identify the vendor but cannot support entitlement. Understanding is partial. Continue with guided practice.
- **G-02, practice:** a hint directs attention to the executed agreement. The corrected draft and explanation meet the practice criteria with that hint. Advance to a transfer exercise; this does not establish independent mastery.
- **G-03, transfer:** with approved reference documents but no answer assistance, the learner identifies that an amendment covers only one entity. A reviewer checks the explanation. Continue varied transfer practice; delayed retention and teaching remain unobserved.
- **G-04, delayed transfer:** a different case is scheduled but has not happened. Results remain not_observed, effort stays blank, and the progression decision is pending.

**Discussion:** Does G-02 justify granting contract approval authority? What can G-03 establish? Is G-04 a failed assessment?

**Answer guide:** G-02 supports trying a learning exercise under different aid conditions; it grants no operating authority. G-03 demonstrates the recorded capability on that case under its stated conditions, not durable mastery across all cases. G-04 has not been observed and is neither a success nor a failure.

## Review and next step

**Learner's view / useful support / remaining confusion:** [fill in]

**Observed strengths / unresolved gaps / evidence coverage:** [fill in]

**Next practice case / support to change / owner / date:** [fill in]

**Progression decision / reviewer / rationale / date:** [fill in]

**Any separately requested change to work scope / approval status:** [fill in]

Keep development decisions separate from recommendation, approval, execution, and verification for an operating task. Use `05-acceptance-and-recovery-record.md` for that history and `04-productivity-pilot.md` for complete workflow costs.
