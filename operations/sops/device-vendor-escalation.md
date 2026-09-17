# Device troubleshooting and vendor escalation

> Adapted operational example, version 0.1. All assets, cases, and repair events illustrated here are fictional. Verify the applicable support entitlement and local authority before adoption. This procedure records no actual repair, diagnostic run, or data transfer.

## Trigger and scope

Use for a managed device with repeatable hardware symptoms, physical damage, unexplained instability, or a persistent application fault requiring vendor help. The outcome is verified restoration or an accepted support case with a continuity plan. Separate suspected hardware failure from application, sync, account, and network problems; an unresolved software error does not establish a hardware defect.

Signs of battery swelling, smoke, unusual heat, liquid damage, or electrical damage interrupt ordinary troubleshooting. Stop use and charging when safe and obtain the manufacturer's safety and service instructions through the local safety owner. Do not ask an untrained user to open, compress, puncture, or ship a potentially unsafe battery. Lost or suspected compromised devices follow the [lost device response](../../documentation/procedures/lost-device-response.md) and incident process.

## Preconditions and decision boundaries

Establish an internal case, verified device ownership, the affected user's availability, approved remote-support method, current backup/sync evidence, and a responsible local contact if physical work is needed. Confirm entitlement for this exact device and service region; do not assume fleet-wide coverage or a particular repair turnaround.

| Boundary | Responsible role and output |
|---|---|
| Recommendation | Support analyst supplies the symptom, evidence, safe diagnostics, likely next owner, and repair/continuity options. |
| Approval | Device/service owner approves disruption and repair; security/data owner approves data handling and any erase, unlock, or protection change; budget owner approves charges. |
| Execution | Authorized support operator or approved repair provider performs the agreed steps. Physical steps require a competent local person. |
| Verification | Internal reviewer verifies returned-device health, management and protection state, data availability, and user functionality. Vendor case closure alone is insufficient. |

## Procedure

1. **Capture the symptom and safety state.** Record sanitized asset reference, model, OS/app versions, first occurrence, reproducibility, error/reference codes, recent changes, peripheral context, and work impact. Keep actual serial numbers and shipping details in protected records. If physical damage is evident, avoid repetitive software troubleshooting that adds risk without useful evidence.
2. **Preserve work and check recovery options.** Determine whether current work is saved locally, synchronized, backed up, or only present in an application cache. Record the last known successful backup and an available restore check; do not equate a sync icon or a backup schedule with recoverability. Unknown backup status must be part of the repair decision.
3. **Run the smallest appropriate diagnostic.** With agreed interruption, isolate an optional peripheral or compare a known-good accessory where safe. Use supported model-specific diagnostics and record the exact test and result. Apple Diagnostics startup differs between Apple silicon and Intel models; use the current instructions rather than a generic key sequence. [Apple Diagnostics](https://support.apple.com/en-us/102550). Lenovo provides platform-specific diagnostic tools; verify compatibility and approved provenance before use. [Lenovo diagnostics](https://support.lenovo.com/us/en/solutions/ht506581-lenovo-diagnostic-solutions-downloads).
4. **Separate application and sync faults.** Check service health, account identity, version support, storage constraints, observed sync errors, and browser access to the service. Protect any unsynchronized changes before a reset or relink. For OneDrive on macOS, Microsoft documents targeted sync troubleshooting and a supported reset path; a reset disconnects existing sync connections and causes resynchronization. That behavior does not prove every local edit had reached the cloud. Do not delete broad sets of credential-store entries or use an archived third-party reset utility. [Mac sync troubleshooting](https://support.microsoft.com/en-us/onedrive/fix-onedrive-sync-problems-on-mac), [OneDrive reset behavior](https://support.microsoft.com/en-us/onedrive/reset-onedrive).
5. **Avoid blanket changes.** Do not run all pending updates, reset firmware settings, erase the device, remove management, or reset credentials simply because the cause is unclear. Propose a version-specific change with evidence, approval, recovery plan, and a check for business compatibility. If diagnosis is inconclusive, a precise escalation is preferable to a destructive guess.
6. **Build the vendor packet.** Include device model, protected identifier, entitlement, reproducible symptom, relevant diagnostic codes, steps already attempted and results, sanitized logs, and continuity requirements. Remove secrets, unrelated user content, and unnecessary identifiers from diagnostic bundles. Verify the support portal/contact through the approved directory or manufacturer website; vendor impersonation is a separate risk.
7. **Open and coordinate the authorized case.** Record vendor case reference, named internal coordinator, confirmed next action, costs/approval, and the next agreed update. The vendor's proposed time is a forecast until confirmed. If physical custody changes, record the item, custodian, transfer time, tracking reference, and approved data-protection preparation. Apple warns service may erase or replace storage; use a verified backup and an explicit data-handling decision. [Prepare a Mac for service](https://support.apple.com/en-us/116942).
8. **Provide continuity within policy.** If a loaner is authorized, verify enrollment, identity access, protection, recovery-key handling, and required applications before handover. Transfer only approved data through a protected route. Track loaner custody and eventual return. Do not use a personal unmanaged device as an assumed fallback for sensitive work.
9. **Validate return to service.** Inspect custody and repair notes; confirm identity of the returned or replacement asset. Check enrollment, encryption, protection health, approved configuration, current patch state, required apps, data access, and the original failing task. Record limitations of a clean diagnostic result for an intermittent fault. Reconcile the asset register and remove temporary access or loaner data through the approved process.

## Stop conditions and partial failure

Stop when safety is uncertain, backup/recovery evidence is missing for a proposed destructive step, a preservation requirement exists, identity/custody cannot be verified, or the provider asks for an unapproved credential or protection change. A request for a recovery key, management removal, or persistent remote access needs explicit security review.

If a reset/relink is partially complete, document which account and connection changed before doing anything else. Preserve unsynchronized files and do not relink to a guessed destination. If repair returns a device with missing data or management, keep it out of normal use and invoke the recovery owner. If the vendor closes its case while the symptom persists, retain the internal case and request a continuation or new linked case.

## Expected evidence and closure

The case should show symptom/safety assessment, approved tests and results, recovery evidence and gaps, vendor packet, approvals, custody events, repair status, continuity plan, and technical plus user acceptance. Close only after the original issue is verified resolved or an explicitly accepted alternative is working and residual work has an owner. Record an intermittent problem as unconfirmed if the verification window is insufficient.

## Synthetic example

EX-DEVICE-043 reports intermittent display failure. The diagnostic returns no fault, but a harmless repeat test still fails with a known-good accessory. The analyst opens a vendor case after approval and documents uncertainty. A managed loaner supports work while repair proceeds. The internal case stays open until the returned device passes the original task and its management state is checked.

## Reviewed sources and adoption checks

The five linked vendor pages were reviewed on 2026-09-17. Use the latest model/OS-specific instructions and actual entitlement. These sources support diagnostic and preparation choices; they do not confirm a particular organization's coverage, backup, warranty, or readiness.
