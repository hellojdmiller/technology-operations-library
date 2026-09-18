# Change-management tabletop: three decisions under pressure

> Fictional facilitator pack. All service descriptions, records, evidence labels, dialogue, and timeline events are invented. No approval, production access, vendor contact, rollout, rollback, or notification is authorized or performed by this exercise.

Use the [SOP](sop.md), [blank record](change-record-template.csv), and [worked examples](worked-examples.csv). Read the answer key after each discussion. The facilitator supplies simulated facts; participants explain decisions and record missing information rather than operating any system.

## Prepare and set boundaries

Assign an internal change owner, technical reviewer, change authority, implementer, verifier/business acceptance owner, and facilitator. One participant may play multiple roles but must state when the role changes. Use fictional IDs only. Keep real credentials, configuration exports, investor/employee information, and production screenshots out of the session.

Decide which adopted authority and escalation rules the exercise represents, or label them unknown. The examples assume review time `2026-09-17T12:00:00Z`. Timeline markers are relative exercise time, not an SLA. Do not send test alerts, open support cases, or use live maintenance calendars. Draft communications locally and label them **Exercise—do not send**.

For every inject, record the fact, remaining uncertainty, decision, authority needed, next owner, evidence expected, and what would stop the action. Distinguish a scenario's claimed evidence from a check of that evidence.

## Scenario 1: a standard change stops matching

**Starting card — EX-CHG-001:** A fictional managed application patch matches a current standard model for a defined device group and version range. The model's simulated authority, reusable validation evidence, rollback instructions, verification method, and maintenance window all match. Its fictional validity ends after the review date. The expected metadata outcome is `packet_complete_for_review`; this does not verify the evidence or authorize an actual rollout.

| Exercise time | Inject | Decision and evidence to request |
|---|---|---|
| T+0 | The operator asks whether another approval meeting is necessary. | Check exact model validity, operator authority, and conditions; identify whether standing authorization applies. |
| T+5 | The requested package includes a newly enabled connector outside the model. Use EX-CHG-002 for this changed proposal. | Decide whether the change remains standard; identify new permissions, data use, and dependencies. |
| T+10 | A reviewer suggests leaving `standardModelMatch=true` because the product name is unchanged. | Explain the match failure; correct the proposed flag and preserve the earlier assessment. |
| T+15 | The service owner offers to exclude the connector but cannot establish that the package can install without it. | Decide whether the smaller scope is verified or still unknown; name the necessary package/configuration evidence. |

### Answer key

The original hypothetical EX-CHG-001 can use the standard route if a human verifies all current conditions and standing authority. A new meeting is not automatically required. It is still a planned exercise, with no actual approval or execution.

EX-CHG-002 is `needs_review`: scope changed and exact model match is false. Product familiarity is insufficient. Route the expansion through normal review unless a real emergency basis is established. If the desired smaller scope cannot be demonstrated, keep it unknown and hold that implementation. Do not edit the standard model or reuse its approval merely to preserve the planned window. Only a verified, independently bounded request that actually matches can return to the standard path.

Expected evidence: current model/version and authority; package/version and feature behavior; population/dependencies; changed data/permission assessment; new or matching validation; window and recovery decision. Remediation should improve the model's exclusions and intake check, not merely instruct operators to be more careful.

## Scenario 2: normal change, incomplete scope, and a timeout

**Starting card — EX-CHG-003:** A fictional shared-service configuration change has pilot, recovery, and verification references, but the downstream service owner has not confirmed all dependencies and the maintenance window is unresolved. `scopeConfirmed`, `windowConfirmed`, and execution authorization are unknown; scope and authorization evidence fields are blank. Expected outcome: `needs_review`.

| Exercise time | Inject | Decision and evidence to request |
|---|---|---|
| T+0 | A sponsor says the change should proceed because the technical test passed. | Explain why a successful bounded test does not establish complete scope or a conflict-free window. |
| T+5 | A maintenance conflict is discovered with another provider's change. | Identify the coordination owner and revised decision; preserve the conflict rather than call the check complete. |
| T+10 | The facilitator advances to a separate hypothetical future in which scope/window/authority were properly resolved and execution began. The first operation times out. | State what evidence is needed before retrying and how to coordinate in-flight work. This is a discussion branch, not a claim the original packet was sufficient. |
| T+15 | The destination shows the new setting on half the targets, while the remaining targets have uncertain state. The operator proposes repeating the whole batch. | Separate completed from unknown actions; define stop, inspection, and bounded recovery decisions. |

### Answer key

Initially hold the dependent action. The missing facts are not false assurance supplied by a pilot. The change owner resolves the dependency and calendar conflict with the relevant owners; new decisions must precede the hypothetical execution branch.

After the simulated timeout, halt expansion and inspect authoritative action history and current target state. Preserve the original attempt and correlation. A reference string is not an idempotency control. Do not replay the full batch, infer failure from a missing response, or undo targets whose state is unknown. Confirm duplicate protection, ordering, and supported recovery before any bounded retry. Use the [pipeline-recovery SOP](../../sops/request-pipeline-recovery.md).

Expected evidence: per-target state, attempted/committed operations, in-flight workers, current authority/window, last safe recovery point, and preserved data/configuration. Decide rollback versus forward recovery based on actual compatibility and consequences; neither is automatic. Closure requires the eventual verified outcome and explicit owners for any remainder. Assign a follow-up to make partial-state reporting usable.

## Scenario 3: emergency action with reduced testing

**Starting card — EX-CHG-004:** A fictional incident threatens a critical service. The scenario assumes an appropriately scoped emergency authority and recovery/verification plans have been identified, but no pilot evidence is available. The metadata result is `manual_emergency_review`, with the missing pilot retained as a gap. The CSV's authority flag is a hypothetical input, not proof of a real approval.

| Exercise time | Inject | Decision and evidence to request |
|---|---|---|
| T+0 | The operator says “emergency means approved.” | Identify the actual incident/change authority and permissible action; reject the implied approval. |
| T+5 | The normal approver is unreachable. An alternate exists in the exercise authority record but has not yet acknowledged. | Follow the verified emergency route and established standing authority, if applicable; distinguish notification from authorization. |
| T+10 | The simulated emergency authority accepts a smaller action with reduced testing. The operator wants to place that decision in `pilotEvidenceRef`. | Keep pilot evidence absent; record the separate exception, compensating checks, and acceptance of uncertainty. |
| T+15 | A possible reversal would remove a new record format; a forward repair is possible but needs a second decision. | Stop expansion, preserve state, and choose an authorized recovery path accounting for data compatibility. |

### Answer key

Every emergency requires the manual route. Apply already authorized protective action when its conditions genuinely match; absence of an individual approver does not revoke valid standing authority, and it does not create new authority. If no applicable authority exists, escalate to its authorized alternate rather than assume consent from silence.

A reduced-test decision must identify the consequence of waiting, smaller scope, omitted checks, available compensating validation, recovery risk, verifier, and retrospective owner. It is not pilot evidence and must not turn a metadata gap into a completed check. Subsequent recording confirms what was decided; a retrospective cannot retroactively authorize an action.

The simulated schema limitation makes blind rollback unsafe. Require the documented forward-recovery decision or another supported safe stabilization path. Verify business capability and data integrity separately. Preserve the incident's original clocks, user impact, and uncertainty while linking the change. Schedule the post-change review and suspend any standard model whose assumptions were invalidated.

## Score the reasoning and assign remediation

Score each scenario against the five criteria below: **0** absent/unsafe, **1** partially addressed or evidence missing, **2** explicit decision with correct owner and evidence. Maximum is 10 per scenario and 30 for the session. This is a learning rubric, not a readiness score or compliance certification.

| Criterion | Full-credit observation |
|---|---|
| Route and scope | Correct change type; exact standard-model match; material unknowns remain visible. |
| Authority and ownership | Recommendation, approval/standing authority, execution, and verification distinguished; alternate path identified. |
| Evidence and timing | Current scope, representative validation, window/conflicts, and update obligations are addressed. |
| Stop and recovery | Concrete stop criteria, state inspection before retry, and justified rollback/forward-recovery choice. |
| Verification and learning | Actual versus expected outcome separated; residual ownership, retrospective, and model recertification considered. |

Any assumed approval, concealed missing evidence, uncontrolled replay, or unsafe rollback is a critical gap regardless of score. Record the gap, affected instruction, proposed correction, owner, and observable retest. Repeat the failed decision branch with fresh fictional facts after correction. No score from discussion establishes that access, paging, restore, or execution works in production.

The answer keys apply the pack's [researched SOP](sop.md) and linked primary references; no additional external technical claims or numerical service targets are introduced here.
