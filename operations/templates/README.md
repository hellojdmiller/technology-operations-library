# Working records for an operational handover

Use these five small registers together to answer different questions: what is being handed over, what is known, who may decide or act, what has been demonstrated, and what remains an exception. Their separation prevents a delivered document or signed receipt from being mistaken for a working control.

Every included row is an **original fictional example**. No activity, approval, transfer, test, evidence review, or risk acceptance has occurred. Dates and evidence references are deliberately empty. The proposed roles are example responsibilities, not appointed people. Copy the templates into a controlled workspace and replace or remove the examples before operational use.

| Register | One row represents | Example rows / columns |
| --- | --- | --- |
| [handover-register.csv](handover-register.csv) | A bounded workstream and its delivery, receipt, authority, and proof states | 3 / 17 |
| [readiness-test-record.csv](readiness-test-record.csv) | One planned or performed test attempt | 3 / 18 |
| [operational-facts-register.csv](operational-facts-register.csv) | One scoped claim with its source, review, and freshness limitations | 3 / 18 |
| [decision-and-action-log.csv](decision-and-action-log.csv) | One recommendation, approval, execution, or verification event | 4 / 15 |
| [exception-register.csv](exception-register.csv) | One proposed or decided deviation and its expiry, action, and retest needs | 2 / 16 |

## Relationships and use

`OPS-HO-*`, `OPS-TST-*`, `OPS-FACT-*`, `OPS-EVT-*`, and `OPS-EX-*` are distinct ID namespaces. `OPS-WORK-*` groups related decision/action events; it is not a separate record or approval. `SYN-SCOPE-*` names the entirely fictional example scopes. Choose your own stable namespaces in a private working copy; never reuse a retired ID for a different record.

Start with a handover row. Link its current test, action, and exception where relevant. Add separate fact rows for mutable information instead of repeating values in procedures. Record a recommendation, approval, execution, and verification as different event rows under the same work ID. Link an event's prerequisite to the earlier event without treating that link as evidence that the earlier step happened. The example's approval is still pending, so the linked execution cannot proceed.

Record a receiving party's acknowledgement only for its stated scope: receipt of a document, a custody item, an open question, or an assigned responsibility. Acknowledgement does not create technical access, confer authority beyond a recorded decision, certify readiness, or silently adopt somebody else's conclusions. An authority assignment needs its own decision and scope. The example rehearsal approval explicitly would not transfer ownership.

Plan test criteria and safe prerequisites before running a test. Keep `not_run` and `blocked` distinct from an observed failure; none is a passing result. An authorized alternate should follow the procedure without the author supplying missing steps. Record any prompting as a limitation. For a retest, create a new test ID and retain the earlier result, then update the handover's current-test pointer. Do not overwrite failures with later successes.

Handover completion and operational readiness are separate decisions. Record them as separate approval events with their own evidence and exceptions. Neither a pending signature nor an elapsed target date resolves an exception or silently extends a person's duties or access. An explicit operating and escalation arrangement is needed for unresolved work; this register is not itself an agreement or delegation.

## Common field rules

| Field or pattern | Meaning |
| --- | --- |
| Primary `*_id` | Unique immutable row identifier. |
| `scope` | Specific service, environment, population, and boundary covered by the row. Expand the example labels before use; similar labels do not establish equal scope. |
| Role fields | Role accountable for or assigned to that step. Map to current authorized people in a restricted role register; do not treat a proposed role as appointed. |
| `*_ref` | Opaque pointer to a controlled artifact, source, acknowledgement, authority decision, or evidence record. A nonempty reference is not proof that its contents were reviewed or are sufficient. |
| `*_at_utc` | Actual timestamp in `YYYY-MM-DDTHH:MM:SSZ` format. Leave blank when it has not happened or is unknown; never insert a planned date as an actual observation. |
| `due_at_utc`, `retest_due_at_utc` | Approved target timestamps, distinct from actual completion. Blank means a target still needs a decision. |
| `fictional` | `true` for examples; set accurately in a working copy. This is a label, not a redaction safeguard. |
| Empty cell | Unknown, not yet recorded, or not applicable only when another field explicitly explains why. Empty never means complete, accepted, or zero risk. |

Keep secrets, recovery material, personal contact details, payment credentials, and sensitive evidence out of these templates. Store actual evidence under suitable access controls and link it. When opening third-party CSV content in spreadsheet software, import free-text fields as text and review unexpected formulas before enabling calculation. These example cells contain no formulas.

## Handover register dictionary

| Field | Meaning and allowed states |
| --- | --- |
| `handover_id`, `scope` | Workstream ID and bounded scope. |
| `workstream` | Short description of the responsibility or material being transferred. |
| `outgoing_role`, `receiving_role` | Proposed or assigned sender and recipient responsibilities; appointment must be evidenced separately. |
| `delivery_state` | `not_delivered`, `partial`, `delivered`, `unknown`. Delivery says nothing about recipient acknowledgement or usability. |
| `artifact_ref` | Versioned manifest or item delivered; keep detailed inventories outside this table. |
| `acknowledgment_state` | `pending`, `received_only`, `acknowledged_with_limits`, `declined`, `unknown`. Record the exact receipt boundary in the referenced acknowledgement. |
| `acknowledgment_ref` | Attributable receipt showing who acknowledged what and when, including limitations. |
| `authority_state` | `pending`, `approved_scoped`, `declined`, `expired`, `unknown`. Acknowledgement alone cannot change this field. |
| `authority_record_ref` | Actual scoped authority decision, with holder, effective period, decision rights, and exclusions. |
| `readiness_test_id` | Current associated test ID; use an evidence/relationship index for additional tests. |
| `operating_proof_state` | `not_tested`, `blocked`, `supported_for_tested_scope`, `failed`, `unknown`. A delivery or acknowledgement cannot substantiate this value. |
| `open_question` | Concrete uncertainty preventing a bounded conclusion. |
| `action_event_id`, `exception_id` | Related event and exception IDs, where present. Blank leaves a follow-up to assign. |
| `fictional` | Example marker. |

## Readiness test dictionary

| Field | Meaning and allowed states |
| --- | --- |
| `test_id`, `handover_id`, `scope` | Unique attempt, related handover, and test boundary. |
| `scenario` | Business situation being exercised. |
| `success_criteria` | Behavior agreed before the run; include useful failure or denied cases. A missing criterion is a blocker, not a retrospective pass threshold. |
| `method` | Tabletop, isolated practical exercise, or other authorized method and its procedural reference. A tabletop does not prove live system behavior. |
| `operator_role`, `verifier_role` | Executor and reviewer responsibilities. Record actual people in the controlled evidence. Identify independence limits rather than implying independent review where none exists. |
| `authorization_record_id` | Approval event ID for this test's exact scope. A pending event is not authority to run. |
| `result_state` | `not_run`, `blocked`, `in_progress`, `supported_for_tested_scope`, `failed`, `inconclusive`. An exception is recorded separately, never as a test result. |
| `actual_result` | What occurred and how it differed from expectation; blank until observed. Describe a blocker in `limitations` if no execution occurred. |
| `performed_at_utc` | Actual execution timestamp, not the preparation or documentation-review date. |
| `evidence_ref` | Attributable record of method, timing, observed result, and relevant logs or artifacts. |
| `limitations` | Missing prerequisites, excluded populations, prompting, untested paths, or weak evidence. |
| `retest_trigger` | A change or unresolved result that invalidates reliance on the prior observation. |
| `action_event_id`, `exception_id` | Related follow-up event and explicit deviation record. |
| `fictional` | Example marker. |

## Operational facts dictionary

| Field | Meaning and allowed states |
| --- | --- |
| `fact_id`, `scope` | One claim and the boundary within which it is asserted. |
| `claim` | Precise statement; split a document claim, configuration observation, and behavioral result into separate rows rather than merging them. |
| `claim_type` | `documented_statement`, `owner_statement`, `assumption`, `recommendation`, `observed_configuration`, `demonstrated_test`. The type describes the evidence category, not its trustworthiness. |
| `knowledge_state` | `unknown`, `unverified`, `proposed`, `supported_for_scope`, `disputed`, `superseded`. Preserve contrary evidence and reasons for changes in the controlled source history. |
| `owner_role`, `source_ref` | Owner of the factual record and attributable source. A missing document is not proof that a service, approval, or arrangement does not exist. |
| `source_observed_at_utc` | When the source statement or specific observation occurred. A recently opened old export remains an old observation. |
| `documentation_reviewed_at_utc` | When someone checked the wording or referenced documentation. This is not configuration verification or a new operating test. |
| `evidence_reviewed_at_utc`, `evidence_reviewer_role` | When and by whom the underlying supporting evidence was reviewed for this claim. This does not reset its observation date. |
| `evidence_scope` | Population, environment, period, and sample actually supported, including exclusions. |
| `freshness_state` | `unknown`, `current_for_decision`, `stale`, `invalidated_by_change`. `current_for_decision` requires a documented relevance/freshness judgement, not just a recent file timestamp. |
| `review_trigger` | A specified event or approved review cadence requiring re-examination. There is no universal freshness interval in these templates. |
| `related_handover_id`, `action_event_id` | Related workstream and follow-up event. |
| `limitations`, `fictional` | Evidence limits and example marker. |

## Decision and action dictionary

| Field | Meaning and allowed states |
| --- | --- |
| `event_id`, `work_id` | Unique event and group for related stages. |
| `related_record_id`, `scope` | Primary handover, test, fact, exception, or event affected and its boundary. |
| `event_type` | `recommendation`, `approval`, `execution`, `verification`. Keep these separate even if one person holds several roles; document any needed independent check. |
| `assigned_role` | Person's role for this particular stage, not an implied decision right across every stage. |
| `state` | Recommendation: `proposed`, `withdrawn`. Approval: `pending`, `approved_scoped`, `declined`, `expired`. Execution: `not_started`, `blocked`, `in_progress`, `performed`. Verification: `not_run`, `blocked`, `supported_for_scope`, `failed`, `inconclusive`. |
| `statement_or_result` | Exact proposal, decision, executed action, or verification finding. A planned action must remain visibly planned. |
| `prerequisite_event_id` | Earlier event required before this stage; validate its status, scope, and evidence rather than assuming the ID grants authority. |
| `evidence_ref` | Decision record, execution result, or verification evidence supporting the particular event. |
| `event_at_utc`, `due_at_utc` | Actual event time and separately agreed target time. |
| `decision_boundary` | Limits, exclusions, effective conditions, and matters requiring a different decision. No event authorizes its own scope expansion. |
| `successor_event_id` | Next linked stage; do not mark it completed merely because this stage is complete. |
| `fictional` | Example marker. |

For multiple follow-ups, create additional events and reference their common prerequisite. Do not replace this chain with one generic `complete` checkbox. An independent-verification gap stays open even when execution is recorded as performed.

## Exception dictionary

| Field | Meaning and allowed states |
| --- | --- |
| `exception_id`, `related_record_id`, `scope` | Unique deviation, affected record, and exact boundary. |
| `unresolved_condition` | What remains unsatisfied and why it matters. |
| `interim_safeguard` | Proposed or implemented temporary protection, explicitly distinguished. Link proof of an implemented measure through the decision or evidence record. |
| `owner_role` | Accountable owner of treatment and review, distinct from the approval authority if needed. |
| `decision_state` | `decision_required`, `proposed`, `approved_scoped`, `declined`, `expired`, `withdrawn`. Silence and a passed date never create approval. |
| `decision_record_id` | Explicit approval/disposition event ID covering this deviation; approval of a related test is insufficient. |
| `expires_at_utc`, `expiry_state` | Decision's exact expiry and `not_set`, `scheduled`, or `expired`. Do not calculate an expiry from a generic example cadence. |
| `retest_id`, `retest_due_at_utc` | Associated test and agreed target. After a completed attempt, create and link a new test row for the retest. |
| `review_trigger` | Change, failed safeguard, missed target, or other event requiring earlier re-evaluation. |
| `closure_state` | `open`, `treatment_pending`, `awaiting_retest`, `closed_verified`, `withdrawn_with_reason`. Expiry is not verified closure. |
| `closure_evidence_ref` | Evidence and decision supporting closure or a documented reason for withdrawal. |
| `fictional` | Example marker. |

Before using `approved_scoped`, record the authorized decision, scoped condition, accountable owner, safeguard, expiry, review trigger, and retest plan. A compensating measure that has only been proposed is not an implemented control. Before `closed_verified`, inspect the closure evidence and retest result; an accepted deviation does not make the underlying test pass.

## Validation and scope

The included files have 15 example data rows in total. CSV parsing checks confirmed consistent widths, unique IDs, valid linked IDs and matching example scopes. All actual event, observation, review, expiry, due-date, and evidence fields remain empty; no completion or approval is asserted. The four event rows preserve the recommendation → approval → execution → verification sequence while leaving every operational step pending.

These registers complement the [cyber control test record](../../cyber-risk/templates/control-test-record.md) and [evidence register](../../cyber-risk/templates/evidence-register.csv). They do not replace an organization's authority model, actual evidence repository, system inventory, or records-preservation process. No source organization, provider, operational architecture, contact, contract term, or actual transition outcome is embedded in the examples.
