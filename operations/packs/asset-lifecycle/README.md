# Asset lifecycle resource pack

**Proposed operating example.** The organization, assets, observations and decisions in the examples are fictional. No purchase, transfer, wipe, disposal, reconciliation or exercise has been performed. Product references reviewed September 17, 2026.

Use this pack to answer four different questions: what the firm owns or is allowed to manage, who physically has it, what management/security evidence supports, and what action is authorized next. A match between two inventories answers none of these completely.

| Need | Start here |
|---|---|
| Run procurement through return, reuse or disposal | [Lifecycle SOP](sop.md) |
| Establish a protected operating register | [Header-only asset register](asset-register-template.csv) |
| See how conflicting observations change the next decision | [Four fictional worked examples](worked-examples.csv) |
| Practice decisions without accessing a device or tenant | [Three-case exercise and answer key](exercise.md) |
| Prepare candidate discrepancies from synthetic observations | [Asset reconciliation review workflow](../../../n8n/asset-reconciliation-review/README.md) |
| Handle a joiner, leaver or missing device | [Onboarding](../../sops/employee-onboarding.md), [offboarding](../../sops/employee-offboarding.md), [lost-device response](../../../documentation/procedures/lost-device-response.md) |

## Choose the right path

- **New or replacement equipment:** approve the need and transaction, establish ownership, inspect receipt, then verify the build and recipient handover.
- **Loaner, repair or internal transfer:** record temporary custody and return conditions; recheck the intended user's access and the device's controls. A repair shipment is not a disposal.
- **Missing or conflicting evidence:** open a review with the source scope, observation times and owner. Investigate; do not merge identities or erase records to make reports agree.
- **Return, sale, donation, lease return or recycling:** resolve preservation, choose the approved technical process, validate its result, and obtain the separate transaction/release authority. A low book value or a successful wipe does not authorize a gift.
- **Lost, stolen or suspected compromised:** use the incident path immediately. Inventory reconciliation must not delay protective actions already authorized under that path.

Keep one authoritative register and link its protected cases. The CSV is not a vendor import format or a replacement for the finance ledger, custody history, MDM console or sanitization record. Review permissions and spreadsheet import behavior before use; treat imported free text as text to prevent formula interpretation.

## Register dictionary

The blank template contains only the header. Add one row per physical asset, or per separately tracked storage item. A linked case contains the history and detailed media/components. Do not put secrets, recovery keys, personnel narratives, purchase prices or live device identifiers in a public copy.

| Fields | Meaning and evidence boundary |
|---|---|
| `asset_id`, `record_kind`, `asset_class` | Stable internal asset key; `operational` or `synthetic`; adopted asset category. A synthetic row is never a live asset. |
| `device_identifier_ref` | Protected reference to manufacturer/device identity used to corroborate matches; a hostname alone is insufficient. |
| `ownership_model`, `owner_ref` | `owned`, `leased`, `personal`, `third_party` or `unknown`; party with ownership rights, distinct from the custodian. |
| `finance_record_ref`, `procurement_case_ref` | Links to accounting and approved acquisition records; neither an MDM label nor this register determines legal title or financial treatment. |
| `lifecycle_state` | Current operational stage using the states below, supported by the linked case. |
| `custodian_ref`, `location_ref` | Current accountable custody and protected location reference; a proposed recipient is not yet the custodian. |
| `custody_state`, `custody_observed_at_utc`, `custody_evidence_ref` | `confirmed`, `reported`, `in_transit`, `disputed`, `missing` or `unknown`; actual observation time and evidence. A carrier scan does not prove item identity at receipt. |
| `management_id`, `management_state` | Matched management object and `unknown`, `not_expected`, `pending_enrollment`, `managed`, `stale`, `missing_record`, `multiple_records` or `retired_record`. Describe conflicts in the case; do not force one winner. |
| `management_observed_at_utc`, `management_last_checkin_at_utc`, `management_evidence_ref` | Snapshot/observation time, device's reported last check-in, and protected source reference. A fresh export can contain an old check-in. |
| `security_state`, `security_observed_at_utc`, `security_evidence_ref` | `unknown`, `review_required`, `supported_for_scope`, `failed` or `not_applicable`; bounded control result, its observation time and evidence. State actual controls/limits in the case. |
| `preservation_state`, `preservation_case_ref` | `unknown`, `hold`, `pending_preservation` or `cleared_for_defined_action`; accountable records decision and scope. Clearance is action-specific and can change. |
| `warranty_ref`, `warranty_review_due_utc`, `refresh_review_due_utc` | Protected entitlement reference and next review times; not assumed repair coverage or an automatic replacement date. |
| `loan_due_utc` | Approved temporary-custody return checkpoint, when applicable; expiry creates follow-up, not automatic wipe authority. |
| `last_reconciled_at_utc`, `reconciliation_state`, `review_case_ref` | Actual completed review time, `not_reviewed`, `matched_for_scope`, `review_required` or `inconclusive`, and source/coverage/findings record. |
| `disposition_intent` | `none`, `internal_reuse`, `repair_return`, `lease_return`, `sale`, `donation`, `recycling` or `destruction`. Intent is not authorization. |
| `transaction_authorization_ref` | Approved physical/financial transaction, scope and conditions; separate from technical authority in the sanitization plan. |
| `sanitization_plan_ref`, `sanitization_execution_state`, `sanitization_evidence_ref` | Approved technical plan, `not_planned`, `not_started`, `pending`, `performed`, `failed` or `not_applicable`, and actual operation evidence. `performed` does not mean accepted. |
| `sanitization_validation_state`, `sanitization_validation_ref` | `not_reviewed`, `accepted_for_scope`, `rejected`, `inconclusive` or `not_applicable`; documented assessment against the approved requirement. |
| `enrollment_release_state`, `enrollment_release_evidence_ref` | `not_requested`, `pending`, `verified`, `failed` or `not_applicable`; relevant enrollment-program release result, distinct from MDM retirement and sanitization. |
| `transfer_receipt_ref`, `closed_at_utc` | Actual final recipient/provider receipt and closure time; leave blank while unobserved or incomplete. |
| `next_action`, `next_action_owner_ref`, `next_review_due_utc` | Specific remaining task, accepted owner and next checkpoint. No owner means an open assignment gap. |

Lifecycle states: `requested`, `ordered`, `received_unready`, `ready_stock`, `assigned`, `loaned`, `in_repair`, `return_pending`, `returned_review`, `held`, `disposition_pending`, `disposed`, `missing` or `unknown`. These are labels, not commands. A state transition requires its SOP evidence. Keep prior events rather than replacing the custody or approval history.

Use ISO 8601 UTC timestamps ending in `Z`. Blank means not recorded, never success or zero age. `unknown` and `not_applicable` differ; the latter requires a case rationale. Assess evidence freshness against an adopted control-specific threshold and an explicit evaluation time. Future or malformed observation times require correction, not an assumed pass.

## Worked-example dictionary and automation boundary

`worked-examples.csv` has four hypothetical observation sets, not completed register rows. `fictional=true` applies to every cell. `example_id`/`asset_id` identify the case; `as_of_utc` sets its calculation time. Custody, management-record count/check-in, security, preservation, requested disposition, transaction-authority and sanitization columns describe the supplied fiction. `expected_*` columns are the answer key; every `actual_*` field is blank.

For these examples only, a check-in/security observation older than seven days is stale; custody older than thirty days is stale. Exact equality is within the illustrative limit. Missing, conflicting or future observations remain review items. These are teaching thresholds, not recommended SLAs. The [exercise](exercise.md) explains source completeness and negative cases.

The reconciliation workflow prepares review candidates. It cannot establish physical possession, approve a disposal, satisfy a hold, prove data destruction, or authorize spending. Its own fixture schema is authoritative for running it; do not feed these narrative rows into it without an explicit field mapping and validation.
