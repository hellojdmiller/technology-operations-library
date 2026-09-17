# Joiner, mover, and leaver operations

Give people the access their work requires, remove access when its purpose ends, and preserve the business records and dependencies that need to survive a role change. Work from an approved request and a current service inventory rather than a short application list copied into a document.

This is an adapted generic procedure with fictional examples. Platform actions must follow the adopted tenant-specific runbook. No account, device, or production workflow has been changed or tested for this example.

This guide supplies the common lifecycle boundaries and the role-change path. Use the detailed [employee onboarding](employee-onboarding.md) and [employee offboarding](employee-offboarding.md) SOPs and their checklists when handling those events. Keep actual task records in one protected case rather than completing parallel trackers.

## Trigger, inputs, and authority

The trigger is a recorded personnel or contract change from the authorized people owner, with a verified identity, event type, manager or sponsor, effective time and time zone, and scope. The manager recommends the role's access; each business owner approves access to their service. The IT owner coordinates execution, with the authorized provider or administrator making changes. A reviewer verifies the outcomes; records and legal owners decide preservation and disclosure requirements.

Before work starts, confirm the request's authenticity through the approved internal route, service inventory, role access profile, device inventory, license requirements, approved bootstrap method, and exception process. A ticket alone does not prove the sender has authority. A contractor needs a sponsor and access end date.

Use a restricted case record. Store account IDs and evidence internally, never in this example repository or a general onboarding announcement.

## Joiner procedure

1. **Confirm the start conditions.** Record authorized start time, role, device ownership, required approvals, and who may receive status updates. Resolve name or identity mismatches before creating an account.
2. **Plan access.** Compare the approved role with the service inventory. Record which applications provision automatically, which require a business owner, and which are not needed. Do not copy another employee's permissions wholesale.
3. **Prepare the identity.** Use the approved secure bootstrap method and verify the recipient before delivery. Let the user enroll their own approved authentication methods; never collect their password or factor to complete orientation.
4. **Prepare the device.** Follow the maintained build standard. Check enrollment, required controls, encryption and recovery-key custody, updates, and intended application access. Device registration alone is insufficient evidence of readiness. Use the [device training modules](../../training/README.md) for practice structure.
5. **Provision approved services.** Confirm actual downstream accounts, group scope, data access, and any approved communications-capture requirements. An assignment at the identity provider does not prove every target application completed provisioning.
6. **Complete orientation.** Explain reporting routes, approved data locations, account recovery, AI use, and the approved policies that apply to the role. Record acknowledgments of the actual approved versions without representing them as proof of comprehension.
7. **Verify with the user.** Check that the user can perform a representative authorized task, and that a representative excluded resource remains inaccessible. Record which checks were performed, who observed them, and unresolved gaps.
8. **Accept or limit the handover.** The manager acknowledges work readiness. Keep incomplete access or device work as owned exceptions with a safe interim arrangement. A delayed start or cancellation needs a fresh authorized disposition, including access and licensing review.

## Mover procedure

A role change is a difference review. Capture the current entitlements and compare them with the approved destination role. The former and receiving business owners identify what must end, what transfers, and any time-limited overlap. Complete ownership transfers for workflows, shared resources, records, and pending business activity.

Apply the approved changes at the coordinated time. Verify the new work succeeds and former restricted access is removed. For approved overlap, record its purpose, end time, owner, and removal check. Leaving the old role indefinitely is an unresolved exception, not a completed move.

## Leaver procedure

1. **Confirm timing and preservation.** Obtain the authorized cutoff and records instructions. Route a suspected compromise or sensitive departure through the appropriate incident and people processes. Do not postpone required containment to finish a handover checklist.
2. **Map dependencies before a planned cutoff.** Identify personal ownership of integrations, automations, approval queues, service credentials, vendor requester authority, billing contacts, and recovery routes. The [planned handover guide](../succession/planned-handover.md) covers privileged roles. Assign and test replacements where authorized.
3. **Remove access at the cutoff.** Block or suspend access, revoke applicable sessions, and address direct application access, delegated permissions, tokens, physical access, and remote support. Record per-system results. Do not keep a person's access active after the cutoff merely because a transfer is incomplete; escalate the continuity gap and use approved alternative administration.
4. **Preserve and transfer under approved instructions.** Record the required record classes, destinations, recipients, and confirmation evidence. Shared mailbox access, forwarding, exports, and ownership transfers require their own authorized scope. A manager does not automatically receive unrestricted access to all content.
5. **Recover assets and credentials.** Reconcile devices, keys, and other assigned property. Preserve required evidence and local-only business data before an authorized wipe or disposal. Record issued, queued, completed, and independently checked outcomes separately. Follow the provider's completion requirements before removing management records.
6. **Resolve licensing and account disposition.** Confirm the preservation method, applicable license dependencies, and service consequences before reclaiming licenses or deleting an account. Treat deletion as a separate approved action. A restore window is not a preservation strategy.
7. **Verify coverage.** Compare the inventory and discovered dependencies with the case record. Review administrative state and attributable logs, plus safe authorized tests where needed; do not impersonate the person using their credentials. A directory block does not by itself prove every application session ended.
8. **Close with exceptions visible.** Record execution, review, transferred ownership, asset status, and the receiving owners' acceptance. Failed removals and unknown session state require prompt escalation under the local incident criteria, not an arbitrary waiting period.

## Stop conditions and partial failure

Stop the affected change when the identity, authority, preservation instruction, or target environment is unclear. Do not remove a license, wipe a device, or delete a resource while its preservation requirements are unresolved. Keep authorized access containment moving through the incident route where required.

If one application fails to deprovision, record it separately, limit exposure using an approved control, and escalate to its owner. If a transfer fails, preserve the source under appropriate controls and verify the destination before retrying. If the event is cancelled, use new authorization to restore only approved access from the recorded prior state; do not blindly undo every security action.

## Completion record

For each service record the request ID, scope, approval reference, intended time, operator, action/result time, expected result, observed result, evidence reference, reviewer, and exception reference. Overall status must distinguish **in progress**, **completed and verified**, and **incomplete with owned exceptions**. A signed checklist cannot substitute for missing results.

**Fictional case:** an operations analyst changes teams. A reporting role is approved, but access to the former team's restricted workspace should end. Provision the new role, verify the reporting task, remove the previous workspace grant, and check the removal. A temporary month-end dependency requires a separately approved expiry and follow-up; it must not disappear inside the word “done.”

## Current platform notes

Microsoft's offboarding guidance treats blocking access, preservation, delegation, licensing, and account deletion as distinct steps. Select and validate the preservation method in the applicable environment. [Microsoft 365 offboarding overview](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee?view=o365-worldwide).

Application sessions can require application-specific revocation; an identity-provider action is not universal proof of immediate termination. [Microsoft Entra access revocation](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access).

Google documents transfer and preservation choices before account deletion, including calendar ownership. An organizational unit's name does not itself demonstrate account suspension; verify account status explicitly. [Google Workspace user removal](https://knowledge.workspace.google.com/admin/users/delete-or-remove-a-user-from-your-organization).

References reviewed September 17, 2026. Exact actions, licensing, retention, and service behavior must be checked again before internal adoption. This procedure sets no universal retention period or employment-law requirement.
