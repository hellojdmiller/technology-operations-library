# Asset lifecycle decision exercise

**Tabletop only.** All observations, identifiers and times are synthetic. No exercise has been run, and no transfer, approval, command or disposal is recorded. Use paper or a local copy of the examples; no credentials, live data, device or vendor tenant is needed.

## Audience, preparation and output

For service-desk operators, asset coordinators, device administrators, finance/service owners and reviewers. Read the [SOP](sop.md) and [dictionary](README.md#register-dictionary). One participant proposes the decision; another challenges its evidence and authority. A single learner can record both passes as self-review, with that assurance limitation visible.

Produce a short decision record for each case: known facts and unknowns; custody/ownership/management/security/preservation distinctions; permitted next step; prohibited shortcut; accountable role; required evidence; unresolved exposure and next checkpoint. State what would change the decision. Leave real approvals, execution results and timestamps blank.

All cases use the fictional evaluation instant **2030-01-15T12:00:00Z**. For arithmetic only, MDM check-in and security evidence are fresh through seven days inclusive; custody evidence through thirty days inclusive. These are arbitrary fixture settings, not deployment recommendations. The worked CSV describes the supplied observations; it is not the reconciliation workflow's input schema.

## Case 1: returned loaner with stale management evidence

Use `EX-ASSET-01`. A protected receiving observation confirms the identified loaner was returned at 11:00 on the fixture date. The management export retrieved at noon contains one matching object, but its last check-in and security observation are January 1 at noon. A coordinator wants to mark it ready stock because the export is fresh and the recipient signed for return. Preservation requirements are not yet assessed.

Decide whether the asset is missing, whether it is ready for another person, and what must happen next. Calculate evidence age from the underlying observations rather than export retrieval time. Explain how a harmless fresh check would change only the claims it supports.

**Answer key:** custody is supported by the supplied receipt; the device is not established missing. Management and security observations are fourteen days old, exceeding the example limit. Record `returned_review`, investigate the stale check-in and obtain current bounded control evidence through the approved runbook. Resolve prior-user data/preservation and approve preparation before reuse. Do not infer readiness from physical receipt or an old green result. A fresh check-in alone would not prove sanitization, current encryption or a new user's successful work. Asset coordinator owns the record; device operator and reviewer supply technical results; records owner resolves preservation.

**Failure/recovery prompt:** the refreshed export is partial and has no row for this device. Expected response: record unknown coverage, preserve the last known match, obtain the correct scope or a direct approved observation. Do not label it disposed or remove the register row.

## Case 2: conflicting transfer and duplicate management matches

Use `EX-ASSET-02`. The inventory names `SYN-CUSTODIAN-A`. A current transfer report says the device went to `SYN-CUSTODIAN-B`, but there is no receiving acknowledgment. Two management objects match the same protected device reference and disagree on assignment. One operator proposes keeping the newest row and deleting the older one automatically.

Decide whether to change the custodian and whether either MDM row can be discarded. List evidence needed to distinguish a legitimate re-enrollment from an identity or join error. Explain why the current timestamp does not resolve the conflict.

**Answer key:** flag ambiguous management identity and disputed/unconfirmed custody. Do not choose a record solely by timestamp, hostname or most recent user. Reconcile stable device identity, re-enrollment/repair history, source completeness and each object's function with the authorized device owner. Obtain an identified item receipt from the receiving role; the transferring party's statement remains evidence, but is not the missing receiving observation. Preserve both objects and history until a scoped correction is approved and its impact understood. Correct the authoritative record and rerun the comparison; no automated deletion or command is authorized by the discrepancy.

**Failure/recovery prompt:** the receiving role denies possession. Expected response: retain the disputed state, verify the report and actual custody through approved channels, and engage lost-device/incident response if a credible loss emerges. Do not wait for routine reconciliation or assume theft from the discrepancy alone.

## Case 3: one held return and one proposed sale

Use `EX-ASSET-03` and `EX-ASSET-04` as two different items in a proposed disposition batch.

- `03` has a confirmed return and current management/control observations. An active preservation hold is recorded. A hypothetical console observation says an erase request is queued; no execution is confirmed. The disposal coordinator wants to continue because the asset register says returned.
- `04` has mutually consistent recent inventory/custody/management observations and a scoped records clearance. A sale has been suggested, but neither a sale decision nor a sanitization plan/result is supplied. A reviewer argues that a clean reconciliation should let the sale proceed.

Separate the decision for each item. Identify what to do about the queued command, which approvals cannot be substituted for one another, and how the batch should be reported.

**Answer key:** `03` cannot proceed through destructive disposition while the hold is active. Escalate the queued command promptly to the incident/records lead and authorized operator, preserve its status, and use only supported authorized cancellation/containment if available. Do not promise that cancellation will work or that no data was affected. Confirm actual state, exposure and preservation needs. Current control evidence does not clear a hold.

For `04`, the observations may be matched for their stated scope, but sale and technical disposition are unapproved/unperformed. Obtain ownership/finance transaction authority, the approved media-specific technical plan and its accepted result, then the remaining release and recipient conditions. Records clearance is limited to its defined action and must still be current. Do not convert a reconciliation result into a gift, sale or wipe approval.

Report the two assets separately: held/urgent command review versus pending transaction and technical planning. Keep both out of an unqualified disposed total. Batch shipping, a provider invoice or a generic certificate cannot fill either missing decision.

**Failure/recovery prompt:** the console now shows a Delete action as `Completed` and no MDM row. Expected response: establish the exact product/action semantics and device-side outcome from the supported runbook; do not assert a wipe completed. See the SOP's [Intune evidence boundary](sop.md#8-plan-sanitization-and-decommission-dependencies).

## Review rubric

Score each dimension 0, 1 or 2 for each case: 0 is absent/wrong, 1 is partly correct with an unresolved material omission, and 2 is correct and tied to the case evidence. Maximum: 10 per case, 30 total. For Case 3, both items must be addressed for a 2.

| Dimension | A score of 2 requires |
|---|---|
| State distinctions | Separates physical custody, ownership, management, security, preservation and action authority where relevant. |
| Evidence reasoning | Uses the supplied times/population correctly, preserves ambiguity and states what is not proven. |
| Safe sequencing | Resolves prerequisites before destructive work; does not delay pre-authorized incident containment. |
| Ownership and recovery | Assigns the next role/task/evidence and handles the failure prompt without fabricated completion. |
| Completion claim | Gives a scoped decision with outstanding work; no reconciliation-to-disposal shortcut. |

A proposed learning threshold is **24/30**, with no critical error. Critical errors include proceeding through a known hold, treating a pending command as verified removal, authorizing a sale from an inventory match, deleting conflicting records without review, or presenting fictional evidence as real. A high total does not compensate for these. Review the missed concept and repeat an altered case. This is a local learning rubric, not certification or proof of readiness to operate a tenant.

## Optional evaluator challenge

Use the [reconciliation workflow](../../../n8n/asset-reconciliation-review/README.md) only with its own independent synthetic fixture dataset and schema. It matches exact asset IDs and rejects duplicate IDs in either source as invalid input. The multiple management objects in Case 2 describe a separate human investigation; they are not permission to send duplicate source IDs. Map only fields the evaluator supports. The human companion review must preserve context, such as a records hold, that is outside the comparison schema.

A useful combined evaluator and human-review test set should preserve these expectations:

| Synthetic condition | Expected observable output |
|---|---|
| One stable match; all required observations within declared limits | Scoped match result; no transaction or disposal authorization |
| Old check-in in a newly retrieved export | Stale-evidence review reason, using check-in time |
| Duplicate source IDs or conflicting custody | Duplicate IDs yield `invalid_input`; conflicting known custodians yield review findings. No automatic merge, deletion or reassignment. |
| Missing/future/invalid timestamp | Null required observation yields a review finding; future or malformed timestamps yield `invalid_input`. No zero-age substitution. |
| Failed or partial source collection | Explicit incomplete coverage; absence does not prove missing property |
| Held asset with otherwise fresh observations | Human companion review retains the hold; a comparison match cannot authorize destruction |
| Corrected observation after review | New bounded result linked to prior evidence, without erasing history |

Capture expected versus actual output and failures only if someone actually runs the optional test. This pack records no such run. A rule passing these cases still cannot verify a real asset, account for every enrollment type or decide an organization's disposal policy.
