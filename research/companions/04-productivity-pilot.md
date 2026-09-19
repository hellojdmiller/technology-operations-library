# Productivity pilot and measurement rules

**Workflow / owner / intended use / pilot period:** [fill in]

**Hypothesis / baseline / conditions / assignment method:** [fill in]

**Acceptance criteria / material errors / local decision thresholds:** [fill in]

**Task sample / prior experience / known biases:** [fill in]

Define the task and thresholds before testing. Use matched tasks or random assignment where practical. Repeated work creates learning effects. Newly feasible work belongs in a separate cohort from familiar tasks used for a baseline comparison.

## Log every attempt

Use `pilot-log.csv`. One row is one attempt; retries keep the task ID but receive a new attempt ID. Configuration IDs refer to the model/service register. Preserve the source set and artifact/evidence references.

Allowed attempt states: accepted_draft, accepted_action, rejected, blocked, abandoned, pending_verification. Accepted states require the evidence defined for that unit of work. An approved but unverified action remains pending_verification. A rejected attempt followed by an accepted retry does not become two delivered tasks.

Numeric blanks mean unmeasured or unavailable. Use `measurement_notes`, `cost_status`, and `followup_status` to explain them. Zero means observed zero. Record currency; do not add different currencies without a dated conversion method. Example amounts in this pack are fictional, not vendor prices.

## Keep the measures distinct

| Measure | Definition and counting rule |
| --- | --- |
| Human effort | Preparation + production/prompting + supervision + review + correction + recovery person-minutes. Include every attempt. Count each person's interval once; sum separate contributors. |
| Machine wait | Unattended wait, separately recorded. Active supervision belongs in human effort, not both categories. |
| Elapsed time | Wall-clock time from start to the defined endpoint, including queues. For a delivered task, measure first start to final verification; do not infer it by adding overlapping attempt times. |
| Accepted-attempt rate | Accepted attempts divided by all attempts in the condition. Report state counts, including pending, and distinguish this from task completion. |
| Accepted tasks | Unique task IDs within each condition/cohort with a verified accepted result, counted once. State the unit: draft, decision record, or action. |
| Accepted throughput | Accepted tasks per stated period. Use comparable work and quality criteria. |
| Effort per accepted task | All attempt effort in the condition divided by accepted tasks, if effort coverage is complete and accepted count is nonzero. Keep setup/support separate or state an allocation. |
| Cost per accepted task | All attempt service costs plus any explicit labor/setup allocation, divided by accepted tasks. If a required cost is unknown, mark the total incomplete. |
| Delayed defects | Material defects found by the agreed follow-up date. A missed or not-yet-due review is unknown, not zero defects. |
| Retained understanding | Results of the separate immediate and delayed exercise, with coverage and conditions. Never infer this from output quality. |

Use an undefined/not computable result when a denominator is zero. Show coverage for every measure. Summaries of complete rows alone must be labelled as such, with missing rows and selection effects disclosed. Do not present a partial sum as the total.

## Review record

**Attempt and task counts by state / measurement coverage:** [fill in]

**Quality and follow-up results / understanding observations:** [fill in]

**Effort / elapsed-time distribution / cost / setup and support:** [fill in]

**Constraint observed / alternative explanations:** [fill in]

**Recommendation:** expand tested scope / revise / gather evidence / stop

**Approver / decision / conditions / next review:** [fill in]

An apparent speedup with a lower quality threshold is not an equivalent comparison. A small exploratory pilot can identify a useful next experiment without establishing a general productivity effect.
