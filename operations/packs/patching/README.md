# Patching and vulnerability remediation pack

Use this pack to turn a finding into an owned, evidence-supported decision across endpoints, servers, appliances, applications, and supplier-managed services. It covers incomplete inventory and uncertain results as well as successful updates.

> Proposed operating example, version 0.1. No update, scan, exception approval, or tenant change was performed. All worked cases are fictional. Adopt the roles, local targets, supported platforms, and evidence requirements before use. Store completed records in a restricted operational system, not this repository.

## Choose the next step

| What you know | Next decision | What cannot be concluded yet |
|---|---|---|
| A finding exists but product, version, or asset identity is uncertain | Establish applicability and inventory coverage; assign an investigation owner and due date | Unknown does not mean unaffected |
| Affected service has a credible exploitation signal or significant exposure | Review urgency and interim protection with the security and service owners; use emergency authority where applicable | A severity score alone does not select the response |
| A supported update is available | Plan dependencies, pilot, rollout, restart, recovery, and verification through change management | Availability does not prove compatibility or permission to deploy |
| Update failed, device is offline, or support has ended | Preserve the open finding; decide repair, replacement, isolation, or a scoped exception | An empty scan or missing device is not a fix |
| Installation is reported successful | Check current installed state, required restart, the original finding, and service function | A deployment job result is not remediation verification |
| An exception was approved | Check its scope, expiry, safeguards, and retest; keep the finding visible | Approval does not make the vulnerability absent |

## Files and use

1. Read the [SOP](sop.md), especially the authority and closure gates.
2. Copy the [header-only remediation register](remediation-register-template.csv) into your restricted system. It deliberately contains **zero example records**.
3. Compare your proposed decisions with the four [fictional worked cases](worked-examples.csv). Those rows are training inputs, not a remediation inventory or scanner output.
4. Run the three-case [exercise and answer key](exercise.md) before relying on the procedure.
5. Use the [patch exception review workflow](../../../n8n/patch-exception-review/README.md) to flag supplied records for human review. Its output does not inspect devices, approve exceptions, apply patches, or prove a finding fixed.

Coordinate deployment through the [change management pack](../change-management/sop.md), suspected compromise through [security alert triage](../../sops/security-alert-triage.md), customer communication through [service-level management](../../service-level-management.md), and accepted residual risk through the [exception register](../../templates/exception-register.csv) and its [dictionary](../../templates/README.md). The related control is `VCIT-011` in the [cyber control library](../../../cyber-risk/controls/README.md).

## Register dictionary

One row represents **one finding for one identified asset or explicitly bounded homogeneous scope** within a remediation campaign. Split a group when applicability, due date, rollout result, evidence, or exception differs. Never use one representative device to assert that an entire fleet is fixed. The register is an index; linked decision, change, observation, and exception records hold the detail.

| Field | Meaning and completion rule |
|---|---|
| `record_id` | Stable unique remediation record ID. Keep it through reassignment and rework. |
| `campaign_id` | Shared campaign/update reference; several findings or assets may link to it. |
| `asset_scope_ref` | Restricted inventory reference and precise scope; no secrets or unnecessary personal data. |
| `finding_ref` | Original scanner/advisory finding reference, preserving detection history. |
| `applicability` | `unknown`, `applicable`, or `not_applicable_supported`. The last requires scoped evidence. |
| `exposure` | `unknown`, `internet_reachable`, `restricted_reachable`, or `isolated_verified`. Link the observation establishing reachability; network location alone is insufficient. |
| `priority` | `undetermined`, `urgent_review`, `expedited`, or `scheduled`; locally adopted labels, not a vendor score or ticket priority. |
| `decision_ref` | Record of rationale, exploitation source/check time, business dependencies, authority, priority, original/revised due dates, and reviewer. |
| `owner_role` | Accountable remediation owner; the restricted record resolves the role to a person and alternate. |
| `due_at_utc` | Approved remediation/verification target in ISO 8601 UTC, such as `2026-09-18T17:00:00Z`. Blank means target missing, never unlimited. Preserve target history in `decision_ref`. |
| `change_ref` | Approved change or applicable preauthorized procedure/version; also links operator and rollout results. |
| `deployment_state` | `not_started`, `planned`, `in_progress`, `install_reported`, `reboot_pending`, `failed`, or `unreachable`. This is separate from verification. |
| `observed_at_utc` | When the underlying asset state was observed, not when someone opened a report. Blank means unknown. |
| `observation_ref` | Evidence index for asset identity, installed version/build, support status, coverage/scan health, collector, time, and source. Record contradictions and missing data. |
| `verification_state` | `not_run`, `incomplete`, `failed`, `remediated_supported`, `mitigated_only`, or `not_applicable_supported`. A scanner result alone may be insufficient. |
| `verification_ref` | Scoped post-change technical and service checks, observer, times, results, and limitations. Required for any supported disposition. |
| `exception_ref` | Link to the separate exception record, including approval authority, scope, safeguards, retest, and decision history. |
| `exception_state` | `none`, `proposed`, `approved_scoped`, `rejected`, `expired`, or `closed`. This summarizes the authoritative exception record; it is not approval itself. |
| `exception_expires_at_utc` | Explicit approved expiry, copied from the exception record. Missing or inconsistent expiry needs review. Never silently renew it. |
| `next_action` | Specific proposed action or decision, with unresolved blockers visible. Avoid “follow up” without a concrete outcome. |
| `next_review_at_utc` | Next checkpoint; it does not extend the remediation due date or exception expiry. |
| `closure_ref` | Reviewer-supported disposition and residual work. Blank while open. An approved exception alone does not close a finding as remediated. |

Before comparing timestamps, choose an explicit assessment time and a locally approved evidence freshness rule appropriate to the finding and asset. Future, missing, stale, mismatched, and conflicting evidence remain visible. An import time never replaces an observation time. None of the vocabulary is a vendor API enumeration or an importable policy configuration.

The n8n reviewer has its own documented JSON contract. These CSVs are not directly importable workflow inputs: an approved adapter must map asset/finding identity, applicability, observations, and the authoritative exception record without inventing missing values. A passed target date alone cannot reconstruct historical attainment; retain the actual completion and deadline history for that report.

The worked-case CSV uses a smaller teaching schema: `case_id` links to the exercise; `as_of_utc` fixes the comparison time; `scenario`, `asset_ref`, and `campaign_ref` identify fictional context; `fictional_observation` is supplied case information; `due_at_utc` is an invented local target; `exception_state` and `exception_expires_at_utc` describe the supplied exception; `evidence_limitation` states uncertainty; `expected_decision` and `expected_owner` are an answer proposal; `actual_action_performed` is always `none`. These fields do not record successful operational work.

## Adoption check

Name the service and security owners, patch operators, exception approver, and verifier; agree approved intake sources, inventory reconciliation, support checks, local targets, and escalation coverage. Rehearse a failed pilot and an unavailable device. Confirm that the ticket system can retain old deadlines and contradictory evidence. Review current vendor support and management capabilities before selecting any deployment or recovery method.
