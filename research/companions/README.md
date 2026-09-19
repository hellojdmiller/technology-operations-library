# Beyond the model frontier — working companions

JD Miller · Release edition · September 19, 2026

These are editable proposals for testing the ideas in [Beyond the model frontier](../beyond-the-model-frontier.md). This edition includes the September 18 research and learning companions plus a September 19 agent-security addendum informed by ISACA guidance. Original source review dates remain visible in the evidence ledger. The pack does not report experiments performed by the author or certify a model, vendor, or workflow.

## Start with the question

| Your question | Start here |
| --- | --- |
| Does a better or faster service improve this task? | [Model and serving comparison](01-model-and-serving-comparison.md) |
| Is more context helping, and are sources current? | [Context and evidence review](02-context-and-evidence-review.md) |
| Can people still explain and recover the work? | [Learning and oversight](03-learning-and-oversight-exercise.md) |
| How can assistance help someone develop over time? | [User development plan](09-user-development-plan.md) |
| Are we measuring useful productivity? | [Productivity pilot](04-productivity-pilot.md) |
| Can this specific output or action be accepted? | [Acceptance and recovery record](05-acceptance-and-recovery-record.md) |
| Which claim are we actually testing? | [Proposition test plan](06-proposition-test-plan.md) |
| What would a completed record look like? | [Fictional example and exercise](07-fictional-worked-example.md) |
| What research supports the discussion? | [Evidence and limitations](08-evidence-and-limitations.md) |

The [quick checklist](acceptance-checklist.txt) is a reminder to collect evidence. It cannot substitute for the decision record.

## Files to fill in

- `model-service-comparison.csv`: one row per tested configuration. Join its `configuration_id` to the pilot log.
- `evidence-register.csv`: one row per source/version. Record status and conflicting or superseding sources explicitly.
- `pilot-log.csv`: one row per attempt. Retries retain the task ID and receive a new attempt ID.
- `fictional-pilot-log.csv`: synthetic arithmetic examples, separated from the blank template. Never import these as observed results.
- `user-progress-log.csv`: one row per scheduled learning check, recording capability, aid conditions, evidence, and the next development decision.
- `fictional-user-progress-log.csv`: three completed fictional checks and a pending delayed check; never import these as actual learner observations.

Blank templates contain headers only. Fill in local thresholds before testing. Unknown or unmeasured values remain blank in numeric fields with a stated status or note; they are not zero. Zero means it was observed to be zero. Use ISO dates and include time zones for timestamps.

Configuration IDs identify the complete tested setup, including instruction and source versions. Give a changed setup a new ID even when the model stays the same. Evidence IDs identify one source/version, not a permanent assertion that it is current.

In the pilot log, `start_at` and `end_at` bound that attempt; the productivity worksheet explains how to measure a task spanning retries. `cost_status` is recorded, partial, unknown, or not applicable with a reason. `followup_status` is not_yet_due, completed, missed, or not_planned with a reason. Only enter zero delayed defects after a completed check found none. `understanding_ref` points to the separate learning exercise; use not_observed if none occurred. State the scope of approvals and verification in `measurement_notes` and link the full acceptance record through `evidence_ref`.

## Keep the decisions separate

A recommendation is a proposal. Approval permits a defined action. Execution records what was attempted. Verification records what was independently observed. Preserve each state and its evidence even when one person performs several roles.

For every acceptance check use supported, unsupported, unknown, or not applicable with a reason. Missing, stale, conflicting, partial, and inaccessible evidence must remain visible. A draft can be accepted for internal review while its recommendation remains undecided and execution is prohibited.

Use approved or fictional material for pilots. Record who may view results, where evidence belongs, retention needs, and who can stop or recover the workflow. The worksheets do not grant new permissions.

The [acceptance guide](../acceptance-review.md) provides the operating sequence. The third companion, [Helping people build capability with AI](../building-capability-with-ai.md), develops coaching and user progression. These repository links open the matching pinned revision. See the [research index](../README.md) and [source and sync notes](../SYNC.md).
