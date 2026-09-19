# Investor-reporting decision and reconciliation record

> Blank template. Populate only in the approved protected records system. Underscores mean unrecorded, not approval, failure, zero, or not applicable. This human decision record is not an importer for the offline sample. Use fictional data for practice.

## Release and evidence boundary

| Field | Record |
|---|---|
| Record ID, revision, record type (exercise or operational) | ___ |
| Reporting period; fund; legal entity; report type | ___ |
| Reporting owner and alternate | ___ |
| Document ID, approved version, approval reference and scope | ___ |
| Protected artifact reference; digest algorithm/value if used | ___ |
| Entitlement source/version, approver, validity, protected reference | ___ |
| Expected-population source/version; query/filter/pagination; exclusions | ___ |
| Completeness decision, reviewer, evidence and unresolved gaps | ___ |
| Required delivery outcome and acceptable evidence | ___ |
| Deadline and time zone; consequence of delay; next update | ___ |
| Source observations: as-of time, collection interval, freshness requirement | ___ |
| Evidence destination, authorized viewers, retention/hold decision | ___ |
| Linked request, release, recovery, and incident records | ___ |

## Logical-delivery reconciliation

Repeat one row per logical delivery. Keep attempts in the separate timeline below. Use exact IDs that map to protected records; do not paste investor names, email addresses, report contents, or secrets into this repository.

| Logical delivery ID | Exact recipient ID | Fund/entity | Document/version | Expected basis | Attempts and provider references | Observed outcome and time | Unresolved findings | Evidence and verifier | Next owner/action |
|---|---|---|---|---|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |

Record whether outcome evidence establishes submission, acceptance, portal availability, delivery, or access. Do not substitute one for another. A finding may overlap several categories; record the unique delivery population separately from total findings. Missing evidence remains unknown.

## Recommendation, approval, execution, and verification

| Stage | Status and scoped decision | Owner/person and time | Evidence, conditions, expiry, and open gaps |
|---|---|---|---|
| Recommendation | ___ | ___ | ___ |
| Approval | ___ | ___ | ___ |
| Execution | ___ | ___ | ___ |
| Independent verification | ___ | ___ | ___ |
| Reporting-owner acceptance | ___ | ___ | ___ |

Use descriptive states: approval may be not requested, pending, approved for stated scope, declined, or expired; execution may be not authorized, not started, attempted, partial, completed, or unknown; verification may be pending, partial, verified for stated scope, failed, or unknown. Record who had authority for the actual action. A claimed provider completion does not fill the independent-verification row.

## Attempt and recovery timeline

| Time and zone | Logical delivery and attempt IDs | Intended effect/version | Authority and operator | Submitted operation/reference | Observed effect and source | Concurrency/retry decision | Remaining uncertainty |
|---|---|---|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |

- Workers, queued attempts, automatic retries, and other operators checked: ___
- Supported idempotency contract, key scope/retention, same-intent check: ___
- Actual pause/containment state and independent observation: ___
- Incorrect recipient/version findings; incident lead and case reference: ___
- Original effect, recovery effect, and residual exposure kept separate: ___
- External communications decision and authorized owner, if applicable: ___

## Acceptance and follow-up

| Outcome | Record |
|---|---|
| Expected logical-delivery count and completeness basis | ___ |
| Verified required outcomes, scoped count and references | ___ |
| Unresolved logical deliveries and overlapping findings | ___ |
| Missed deadline or unmeasured timing; reason and owner | ___ |
| Open incident, incomplete access containment, or unavailable logs | ___ |
| Accepted scope and reporting-owner rationale | ___ |
| Explicit unresolved transfer and accepting owner | ___ |
| Next review date, correction owner, and observable retest | ___ |

Do not enter zero because a measurement is missing. State when a count is unknown or incomplete. Acceptance of a verified subset does not imply acceptance of the rest. Learning or administrative closure cannot retroactively approve a release or erase an incorrect disclosure.

Return to the [SOP](sop.md) or [pack index](README.md).
