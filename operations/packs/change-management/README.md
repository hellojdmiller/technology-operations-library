# Change management pack

Use this pack to make a change small enough to understand, explicitly authorized, recoverable where possible, and verifiable. It suits an internal IT lead working with a managed provider; it does not require a standing meeting for every routine action.

**Status:** Proposed resources for local adoption. All worked cases are fictional and unexecuted. No template, example flag, or automation result grants approval or demonstrates a live control. Store populated records and evidence in protected operational systems, outside this library.

## Choose the next step

| Situation | Route |
|---|---|
| Exact match to a current, authorized standard model | Confirm every admission condition and standing authority; follow the model's execution and verification instructions. |
| Planned change without an exact valid model | Normal change: proportionate review by the actual decision owner, with a scoped pilot and recovery/verification plan. |
| Immediate action needed to address an incident or material threat | Emergency route: use the authorized incident/change authority, document reduced testing and risk, and perform retrospective review. |
| Scope, authority, evidence, recovery, or timing is unknown | Hold dependent action and obtain the missing decision/evidence. An emergency still goes to a person with the appropriate authority. |

Start with the [SOP](sop.md), capture a record using the [blank template](change-record-template.csv), and compare the [worked cases](worked-examples.csv). Use the [three-scenario exercise](exercise.md) to check another operator's reasoning. The [offline n8n readiness review](../../../n8n/change-readiness-review/README.md) checks supplied metadata; it does not approve or execute a change.

Atlassian describes standard, normal, and emergency change paths and fast-tracked assessment for emergencies. The exact admission and decision rules in this pack are proposed local operating choices. [Official change definitions](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-changes/), reviewed 2026-09-17.

## Keep readiness, authority, and results distinct

The offline flow uses these row outcomes:

- `packet_complete_for_review`: required metadata is present according to the evaluator; a human still checks the evidence, current state, scope, and authority.
- `needs_review`: a required gate is false, unknown, missing, expired, or otherwise invalid. Do not infer approval from partial completeness.
- `manual_emergency_review`: every emergency follows human emergency review, including cases with apparently complete fields. Missing evidence remains a gap.

The aggregate `review_ready` label describes packet metadata only. The flow cannot establish that a reference exists, its contents are accurate, the approver had authority, the scope remains current, or the service can recover. A model-approved operator may apply standing authorization when all conditions match; the readiness label neither supplies nor replaces that authorization.

## CSV dictionary

Both CSVs use the same 32 columns. `change-record-template.csv` has a header and **zero data rows**. `worked-examples.csv` has four fictional scenarios. No import mapping is configured.

| Columns | Meaning |
|---|---|
| `requestId`, `recordKind`, `changeType`, `summary` | Stable change ID, record purpose, `standard`/`normal`/`emergency`, and bounded intent. Examples use `fictional_scenario`; an adopted copy must identify its own real record type. |
| `serviceScopeRef`, `populationAndDependenciesRef`, `riskAssessmentRef` | Protected scope, affected population/dependency map, and risk decision. Risk is separate from incident priority. |
| `internalOwnerRole`, `approverRole`, `implementerRole`, `verifierRole` | Role placeholders only. Populate actual named assignments and alternates in the protected record; note combined roles. |
| `scopeConfirmed`, `scopeEvidenceRef` | Explicit claim that targets, population, dependencies, and exclusions are established; evidence of that determination. |
| `authorizationVerified`, `authorizationEvidenceRef` | Claim and evidence that the correct current authority covers this action and scope. A reference string is not verification. |
| `pilotEvidenceRef` | Evidence of completed relevant bounded validation, or the applicable current model-validation evidence when the standard model permits reuse. Never put a no-pilot waiver here. |
| `recoveryPlanRef`, `verificationPlanRef` | Current plans with decision points, owners, expected observations, timing, limitations, and evidence destinations. |
| `windowConfirmed`, `maintenanceWindowRef` | Claim that the authorized window, conflicts, coverage, and recovery allowance are resolved; protected calendar decision. |
| `standardModelMatch`, `standardModelRef`, `standardModelValidUntil` | Exact-match claim, authorized model/version reference, and validity end in UTC. All are required for the standard route; they do not apply to normal/emergency classification. |
| `stopCriteriaRef`, `currentStateRef` | Observable stop thresholds and preflight baseline/operation-state evidence. |
| `executionEvidenceRef`, `verificationEvidenceRef`, `retrospectiveRef` | Actual execution timeline, checked outcome, and follow-up record; blank in all scenarios. |
| `actualApprovalStatus`, `actualExecutionStatus` | Observed status, never inferred from a route or readiness score. All worked rows say `not_performed`. |
| `expectedReviewOutcome`, `expectedDecisionReason` | Fictional answer key only. Leave blank in an actual record or replace with separately labeled review results; expected outcomes are not observed outcomes. |

The CSV gates use `true`, `false`, or an empty cell. An empty cell means **unknown/unrecorded**, never false or not applicable by inference. For a flow input, explicitly parse the literals to JSON booleans; map blanks to `null`. Never convert every nonempty string to true. Non-standard rows may leave model fields blank because that particular gate is inapplicable; other required gates remain mandatory.

The flow wrapper uses `reviewId`, `asOf`, `snapshotComplete`, `evidenceRef`, and `changes[]`. The CSV does not provide that wrapper. Confirm the extracted population is complete before setting `snapshotComplete`; an empty or partial export is not a complete review. These worked cases assume a fictional `asOf` of `2026-09-17T12:00:00Z`; model validity must be evaluated at the chosen review time. Every `EX-CHG-*` reference is an imaginary evidence label and resolves to no actual operational record.

## Local adoption and companion procedures

Assign authority and coverage using [ownership and escalation](../../succession/ownership-and-escalation.md). Maintain versions through [document control](../../document-control.md). Link relevant requests, incidents, and outcome clocks through [service-level management](../../service-level-management.md); a maintenance window does not erase existing incident delay or a breach. Use [security alert triage](../../sops/security-alert-triage.md) for suspected compromise and [pipeline recovery](../../sops/request-pipeline-recovery.md) before uncertain retries.

Research informs the linked narrow claims; the detailed procedure and exercise are original proposed practices. Static file checks and tabletop discussion do not demonstrate operational readiness. No production change, approval, rollback, or exercise has been performed by this pack.
