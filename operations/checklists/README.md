# Service-desk checklists and measurement examples

Six CSV working aids connect everyday IT work to a specific owner, expected result, and reviewable evidence. Copy the needed file into an approved protected workspace. The lifecycle and handoff checklists are unexecuted; the software rows and service-level targets are fictional proposals; the clock cases are synthetic calculations.

## Choose a working aid

| File | Contents | Companion procedure |
|---|---|---|
| [Onboarding checklist](onboarding-checklist.csv) | 16 proposed checks covering approval, identity, device, access, orientation, and readiness | [Employee onboarding](../sops/employee-onboarding.md) |
| [Offboarding checklist](offboarding-checklist.csv) | 18 proposed checks covering cutoff, sessions, records, ownership, assets, and disposition | [Employee offboarding](../sops/employee-offboarding.md) |
| [Software request register](software-request-register.csv) | Three fictional request routes, with approval and execution evidence blank | [Software fulfillment](../sops/software-request-fulfillment.md) |
| [Ticket handoff checklist](ticket-handoff.csv) | 24 blank checks for one transfer, from scope and evidence through acceptance and verification | [Ticket escalation](../sops/ticket-escalation.md) |
| [Service-level target matrix](service-level-targets.csv) | Four unadopted P1–P4 goals, with calendars and staffing prerequisites | [Service-level management](../service-level-management.md) |
| [SLA measurement cases](sla-measurement-cases.csv) | Six worked examples for weekends, pauses, reassignment, missing response, reopen, and priority change | [Clock definitions and arithmetic](../service-level-management.md#worked-clock-cases-and-csv-dictionary) |

These are portable CSVs, not ready-made import definitions for a particular ticketing platform. Map columns, types, permissions, states, and relationships deliberately. Preserve the authoritative case rather than maintaining a second contradictory tracker.

## Shared handling rules

- Use one protected case reference for the person, request, or handoff. Replace fictional examples rather than treating them as actual work.
- Assign a named person or accepted duty role internally. Generic role labels in these files are placeholders, not current ownership.
- Keep expected evidence separate from actual results. Blank actual fields mean nothing has been observed or recorded; they do not mean passed or not applicable.
- Preserve original events, corrections, and scope. Record timestamps with a zone; the SLA fixtures use UTC exclusively.
- Record a justified not-applicable result explicitly. A failed or inconclusive verification stays visible even if an exception is approved.
- Link to protected evidence rather than placing passwords, tokens, personnel narratives, or unrestricted logs in the CSV. Completed records remain outside this repository.
- Import external free text as text. Spreadsheet software can interpret leading `=`, `+`, `-`, or `@` as formulas; inspect and neutralize untrusted cell content using the destination's supported import controls. Preserve the original evidence separately if transformation is required.

A row labeled complete cannot establish that a control worked. Use the companion procedure to define the observation, scope, reviewer, and closure conditions.

## Lifecycle checklists

Both files separate the requested action, responsible roles, timing/dependencies, expected evidence, execution state, verification state, and actual evidence fields. Keep one row per meaningful service-level result when expanding them; an all-applications row cannot support a claim about an inventory that was never reconciled.

| Fields | Meaning |
|---|---|
| `check_id`, `phase`, `check` | Stable step reference, work stage, and required action; retain IDs when linking dependencies |
| `owner_role`, `approval_required` | Proposed executor/coordinator and the authority needed; fill actual assignments and decision references internally |
| `depends_on`, `proposed_target` | Semicolon-separated prerequisite IDs and timing condition; a justified not-applicable prerequisite needs a recorded reason |
| `expected_evidence` | The planned observation or record needed to support the result |
| `result_state`, `actual_result`, `evidence_ref` | Execution state, actual observation, and protected evidence reference |
| `performed_by`, `performed_at_utc` | Actual operator and action time; initially empty |
| `verifier_role`, `verification_state`, `verification_result` | Proposed reviewer, separate review state, and actual verification outcome |
| `verified_by`, `verified_at_utc` | Actual reviewer and review time; initially empty |
| `exception_id`, `notes`, `fictional` | Linked approved deviation where applicable, context/limits, and explicit example marker |

Execution states are `not_started`, `pending`, `in_progress`, `blocked`, `performed`, `failed`, `cancelled`, or `not_applicable`. Verification states are `not_run`, `pending`, `supported_for_scope`, `failed`, `inconclusive`, or `not_applicable`. A performed action can still have failed or inconclusive verification. State the approved scope and basis for any exception.

For onboarding, distinguish preparation from activation and technical readiness from the manager's acceptance of usable work. For offboarding, track access containment, records/ownership transfer, asset disposition, and final account/license disposition independently. A pending asset return or records decision must not silently delay authorized access removal.

## Software request register dictionary

| Fields | Meaning |
|---|---|
| `request_id`, `fictional` | Synthetic request reference and explicit example flag; replace with the protected case reference in an internal copy |
| `route` | Proposed catalog candidate, new product, or expanded use; eligibility is not yet established |
| `requested_outcome`, `proposed_scope`, `data_classification` | Work to enable, population and capabilities, and proposed data boundary; validate before decision |
| `business_sponsor_role` | Role responsible for confirming business need, not implied purchase or security authority |
| `decision_state`, `approval_reference` | Actual decision and protected scope reference; all examples start `not_reviewed` with no approval |
| `fulfillment_state` | Execution status; all examples start `not_started` |
| `expected_verification`, `actual_result`, `evidence_reference` | Planned check, observed outcome, and evidence location; the last two start empty |
| `next_action`, `next_action_owner_role` | The immediate unresolved work and role that must take ownership |
| `review_or_expiry_rule` | Required review, trial stop, renewal, or exception condition; populate the actual date and owner internally |

This compact register routes the work. Keep the detailed commercial, data, approval, deployment, and support packet in the authoritative case. It is not a complete contract, access inventory, or license ledger.

## Ticket handoff dictionary

`handoff_ref` and `ticket_ref` start blank for one actual transfer. `check_id` identifies each of the 24 checks; `phase` orders the work. `check`, `owner_role`, `expected_evidence`, and `missing_information_action` state what must be established and who must respond if it is absent.

`status` starts **Not run**. Replace it only with an evidenced result, **Blocked**, or **Not applicable** with a reason. `observed_result` and `evidence_ref` remain empty until there is an observation and its protected reference. Retain unaccepted work and the named internal coordinator; a new assignment or automated provider case number is not accepted ownership.

## Service-level matrix and clock dictionary

The matrix holds priority and label, impact/urgency, clock basis, calendar, zone, service window, synthetic holiday list, response/update/restoration durations in minutes, staffing prerequisites, scope, target type, adoption status, and the fictional flag. All targets are **proposed internal objectives**, and all are **not adopted**. They are not supplier promises or measured team performance.

The clock cases hold metric, calendar, start/end, end type, gross wall time, scheduled time, approved pause overlap, measured time, target history, outcome, event history, and manual calculation. An `open_as_of` end is an observation cutoff with no completed event. Empty `previous_target_minutes` means no earlier target is modeled, not zero. The invented holiday applies only to these fixtures.

The [service-level guide](../service-level-management.md) is the single definition of calendars, pause rules, event qualification, and outcome calculations. The CSVs do not automatically configure those rules in any product.

## Review and related records

The [quality review guide](../service-desk-quality-review.md) shows how to sample cases without claiming the sample represents the entire desk. The separate [succession template pack](../templates/README.md) covers handover, readiness tests, operational facts, decisions, and exceptions. Link those existing records where needed instead of duplicating their ownership or approval claims.

Reviewed September 17, 2026. Structural checks and synthetic arithmetic do not demonstrate live execution, staffing capacity, effective access removal, or fulfillment of an adopted SLA.
