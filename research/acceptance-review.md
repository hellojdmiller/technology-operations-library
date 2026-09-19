# A practical acceptance review for enterprise AI

> Private-library copy of the September 18, 2026 review edition. See [source and sync notes](SYNC.md); this copy does not assert live publication.

I would use this review to answer a concrete question: does the configured workflow produce useful work that we can check, authorize, understand, and recover at a sustainable cost?

This guide puts [Beyond the model frontier](beyond-the-model-frontier.md) into practice. The [concept companion](ai-acceptance.md) explains the distinctions. Start with one bounded workflow, then investigate the constraint that matters. The records support a decision; they do not authorize an action on their own.

The third companion, [Helping people build capability with AI](building-capability-with-ai.md), develops the learning side: coaching, practice, transfer, and evidence of progress over time.

## Get the working documents

[Browse the complete editable pack](companions/README.md), or start with the [acceptance checklist](companions/acceptance-checklist.txt).

| Companion | Use it to |
| --- | --- |
| [Model and serving comparison](companions/01-model-and-serving-comparison.md) | Compare capability, latency, service availability, and cost under stated conditions. |
| [Context and evidence review](companions/02-context-and-evidence-review.md) | Test full context, curation, retrieval, contradictions, and memory freshness. |
| [Learning and oversight exercise](companions/03-learning-and-oversight-exercise.md) | Examine immediate understanding, later transfer, and recovery. |
| [Productivity pilot](companions/04-productivity-pilot.md) | Define baselines and count effort, failures, queues, cost, and delayed defects. |
| [Acceptance and recovery record](companions/05-acceptance-and-recovery-record.md) | Keep the five checks and recommendation, approval, execution, and verification separate. |
| [Proposition test plan](companions/06-proposition-test-plan.md) | Choose one of the paper's nine propositions and state what would weaken it. |
| [Fictional worked example](companions/07-fictional-worked-example.md) | Follow a vendor brief through failure, revision, acceptance, and a handoff exercise. |
| [Evidence and limitations](companions/08-evidence-and-limitations.md) | Check the source basis and distinguish findings from proposed practices. |
| [User development plan](companions/09-user-development-plan.md) | Agree on a capability, adapt assistance, and record progress through practice and transfer. |

The pack includes blank [comparison](companions/model-service-comparison.csv), [source](companions/evidence-register.csv), and [pilot](companions/pilot-log.csv) registers, plus explicitly fictional [example rows](companions/fictional-pilot-log.csv). Edit Markdown and CSV files in your preferred tools. Print this guide for a working reference.

Use the separate [user progress log](companions/user-progress-log.csv) and [fictional learning records](companions/fictional-user-progress-log.csv) to track a person's development without confusing it with task completion.

## 1. Define the work before choosing the tool

Name the input, expected result, permitted use, destination, owner, and consequence of being wrong. Specify the quality threshold before inspecting a favored model's output. Record which decisions remain with a person and which actions, if any, are permitted.

For a first pilot, I would use approved or fictional documents and a test environment. A vendor brief can be accepted as an internal draft while its recommendation remains undecided. That distinction gives the experiment a clear stopping point.

Define ordinary cases and inconvenient ones: missing evidence, conflicting dates, inaccessible files, misleading instructions inside source material, partial tool failure, and an incorrect final-state report. Decide what a correct unresolved answer looks like.

## 2. Record the system being compared

Record provider, product, resolved model/version where available, alias, reasoning configuration, prompt version, tools, permissions, context strategy, and source versions. If the resolved version is unavailable, mark it unknown and retain the request time and available provider identifiers.

The chip or serving platform may influence latency and cost. It does not establish completed-task quality. Distinguish a vendor announcement, benchmark result, trial access, and the service the firm can actually use. Record limits and the date checked.

Compare services using the same acceptance criteria and matched tasks. If the model and hardware both change, label the result a system comparison. Include preparation, queues, failed attempts, and tool delays. A fast demonstration is one observation, not a release decision.

## 3. Test evidence and context deliberately

Compare a curated packet, the full authorized document set, and retrieval where appropriate. All conditions must have access to the evidence needed for a correct answer; record what was actually supplied or retrieved. Count preparation time for each condition.

Include a superseded document, a contradictory current claim, and a plausible but unsupported generated summary. Require the result to identify conflicts and cite the source that determines the answer. An inaccessible source stays a visible gap.

For saved memory, record source, date, permitted scope, and correction path. Replace an authoritative document and test whether the workflow stops relying on the old interpretation. A context experiment evaluates information use; it does not reproduce a model-training experiment.

## 4. Examine understanding as well as output

Tell participants about the learning check before the task. Ask them to explain a consequential choice and recognize a planted error in fictional material. Later, use a different but related exception to examine transfer. Record the assistance allowed in each exercise and prior familiarity.

Separate an assisted operating task from an unaided understanding check. Compare task-oriented assistance with an explanation-and-practice approach if that is the research question. Agree on the rubric and follow-up window in advance.

Use results to improve training and workflow design. A small pilot cannot establish permanent skill loss, diagnose a person, or justify treating one score as general competence.

## 5. Apply all five acceptance checks

For each check, record **supported**, **unsupported**, **unknown**, or **not applicable with a reason**. Missing, stale, or conflicting evidence cannot count as supported.

| Check | Required record |
| --- | --- |
| Quality | Expected result, criteria, observed defects, unresolved statements, and intended use. |
| Authority | Decision owner, approval reference where required, acting identity, permitted actions and recipients. |
| Path | Data and tools actually used, observed actions, and any scope deviation. |
| Evidence | Source and test references sufficient to inspect the decision; gaps, retention location, and access limits. |
| Final state | Independent observation of the intended destination, verifier, time, and remaining effects. |

For a draft, verify the stored artifact and its permitted use. For an action, verify destination state after execution. Approval may support starting an action, but final acceptance waits for required verification. If a required check is unknown, leave the relevant decision pending or narrow the authorized scope; uncertainty is not a pass.

Define containment and recovery before permitting consequences. Identify who can stop the workflow, revoke access, locate affected outputs, reconcile partial changes, and verify recovery. Reversing a technical change may not undo a message already sent or a decision already acted on.

## 6. Measure the complete pilot

Use one log row per attempt, linked to a task and condition. Preserve rejected, abandoned, blocked, and pending attempts. Record human preparation, production, supervision, review, correction, and recovery separately from unattended machine wait. Sum person-minutes across contributors without counting the same person's overlapping interval twice.

Report accepted tasks, attempted tasks, active effort, elapsed time, cost, and follow-up defects separately. A retry can add cost without adding another accepted task. Define the unit before counting; distinguish an accepted document from an approved recommendation or a verified system action.

Blank and unknown measurements are missing data, not zeros. Show measurement coverage and limits. Keep newly feasible tasks separate from the old task mix. Report setup and recurring support costs separately unless a stated allocation includes them.

## 7. Make the decision and preserve its limits

Choose among **expand the tested scope**, **revise**, **gather evidence**, or **stop**, with a named owner and rationale. Set local thresholds before the pilot and explain any later change. No numeric score in this pack automatically approves a workflow.

Record recommendation, approval, execution, and verification separately. For example, recommending a larger trial does not mean approved for production; an approved change does not mean a verified change. A draft-only pilot can finish without granting execution authority.

Reassess when the model, alias routing, prompt, evidence, permissions, tools, recipients, or consequence changes, and when a delayed defect challenges an acceptance rule. A handoff should leave another operator able to locate the evidence and explain remaining uncertainty.

The [worked example](companions/07-fictional-worked-example.md) demonstrates the record without claiming an actual experiment. If the review costs more than the consequence justifies, simplify it. If it cannot expose a consequential error, redesign the workflow before expanding its use.
