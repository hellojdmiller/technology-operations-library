# Exercise: decide what the patch record actually proves

> Fictional tabletop only. No devices, products, advisory identifiers, approvals, evidence files, or actions below are real. Use the supplied timestamps as training facts. This is a discussion exercise, not certification or permission to patch.

## Run the exercise

Use the [SOP](sop.md) and [blank register](remediation-register-template.csv). The assessment time for all cases is **2026-09-17T12:00:00Z**. Fictional local due dates are supplied, not recommended targets. No universal evidence-freshness limit is assumed: judge whether each observation can support the specific claim and identify the missing local rule.

For each case, draft a register entry and a short decision note. Identify the accountable owner, authorized next action, evidence needed, business consequence, change/incident route, and next review. Separate the analyst's recommendation, approval, execution, and verification. Do not invent completed checks. Compare with rows `PATCH-EX-001` through `PATCH-EX-003` in [worked examples](worked-examples.csv); the fourth row is an optional discussion extension.

## Case 1 — Reachable service, missed target

`SYN-ASSET-A` provides a fictional external collaboration service. Its affected component and external reachability were observed at 2026-09-17T10:00:00Z. A supplied fictional advisory reports exploitation of `SYN-FINDING-A`; this is not a real CVE or KEV entry. The local service/security owners had set a remediation target of 2026-09-17T08:00:00Z. The operator has not started, no exception exists, and the service supports an important business workflow. A supported fix is available in the scenario; pilot and recovery checks are not yet complete. No evidence of actual compromise has been supplied.

Decide whether the missed target permits immediate unapproved deployment, what needs urgent review, and whether to claim an incident, a fix, or neither. Preserve both the missed commitment and the remaining uncertainty.

## Case 2 — Pilot failure and a proposed exception

`SYN-ASSET-B` represents a fictional workstation pilot. An update job reported installation at 2026-09-17T09:00:00Z, but the required business application then failed its acceptance check. A proposed broad rollout has not started. The original local verification target is 2026-09-18T17:00:00Z. Someone proposes waiting until a later maintenance window, with no approval or expiry yet recorded. A technician says that every update can simply be uninstalled. The actual supported recovery method and whether the vulnerable component is fixed remain unverified.

Decide the rollout gate, business recovery route, exception status, and what evidence is needed before a new deployment or rollback. Do not assume that pausing or deleting a policy instantly changes every device.

## Case 3 — Offline asset, expired exception, empty report

`SYN-ASSET-C` last reported at 2026-09-01T08:00:00Z. The supplied inventory identifies its affected component as unsupported. Its local due date was 2026-09-10T17:00:00Z. A fictional scoped exception had an explicit expiry of 2026-09-16T17:00:00Z. The device is now absent from the latest scanner report, and the safeguard evidence has not been refreshed. Its owner has not confirmed retirement or the current exposure. An administrator proposes deleting the remediation record to improve the campaign percentage.

Decide current verification/exception states, owner and escalation needs, and what a safe reconnection or retirement decision would require. Explain the denominator treatment.

## Answer key

| Case | Supported conclusion | Expected next decision and evidence |
|---|---|---|
| `PATCH-EX-001` | Applicable exposure and a missed local target; remediation not started. The fictional exploitation signal supports urgent review, not a claim of compromise on this asset. | Escalate to security/service owners now. Use existing emergency authority if applicable; decide interim protection and the quickest authorized, supportable change with pilot/recovery/verification gates proportionate to the risk. Record the original missed due date and any revised decision. Start incident triage if indicators emerge. A containment request or patch job will still require observed results. |
| `PATCH-EX-002` | Pilot acceptance failed. Installation reporting does not establish an accepted service or a fixed finding. Exception remains proposed; the supplied due date is not yet missed. | Stop expansion under the change's stop conditions, preserve results, and involve change/service owners. Establish the exact supported recovery method and its security consequences. Decide repair, alternate service, replacement, or other authorized recovery. If deferral is needed, obtain scoped approval, safeguards, explicit expiry, retest, and an exit plan. No automatic uninstall promise and no self-approved exception. |
| `PATCH-EX-003` | Unsupported last-known component, unknown current state, overdue target, expired exception, and incomplete verification. Empty scan results do not establish repair or retirement. | Escalate the expired risk decision and missing evidence. Assign a service/asset owner to verify ownership and a safe assessment/retirement path; obtain security authority for any access constraint. Consider upgrade/replacement/removal with a change decision. Keep the asset in the declared campaign population until verified scope removal; retain overdue and unknown reporting. Do not renew the exception or force reconnection automatically. |

For optional `PATCH-EX-004`, a reported installation with restart pending and an unmatched scan result remains incomplete. Match asset identity, complete the approved restart, check current fixed state and the original finding, then test the service before proposing closure. Its future due date does not make current evidence sufficient.

## Review rubric

Score each dimension 0–2 across the proposed answers: 0 missing/unsafe, 1 partial, 2 explicit and supported. This is a coaching aid; a total is not operating authorization.

| Dimension | A strong answer does this |
|---|---|
| Evidence | Separates supplied observations, stale/missing evidence, and new checks; never treats a job or empty report as proof. |
| Prioritization | Uses applicability, exposure, exploitation, service dependency, and uncertainty; preserves missed local targets without inventing federal deadlines. |
| Authority | Names recommendation, approval, execution, and verification; cites emergency authority rather than assuming it. |
| Safe change | Defines pilot/stop/recovery and restart checks; does not promise universal rollback or broad reconnection. |
| Exceptions and closure | Keeps proposed/expired exceptions visible, requires scoped approval and expiry, and closes only the supported claim. |

Any answer that deletes an unresolved asset to improve a percentage, records a proposed exception as approved, equates missing findings with a fix, or orders an unsupported rollback needs revision regardless of its score. Record one procedure improvement and the owner of each unresolved adoption decision after the exercise.
