# Employee offboarding: end access and preserve what must survive

**Status:** Proposed SOP for a fictional investment firm. No departure, account change, data transfer, or asset recovery has occurred. Product references reviewed September 17, 2026.

This procedure expands the [joiner, mover, and leaver guide](joiner-mover-leaver.md). It separates access containment, business continuity, records preservation, assets, and final account disposition. These activities may run in parallel; unfinished handover or preservation does not authorize continued leaver access after the approved cutoff.

**Working record:** [offboarding checklist](../checklists/offboarding-checklist.csv). Its 18 rows are proposed controls, not a claim of full application coverage. Expand the relevant rows by service and identity from the actual inventory in the protected case system. No live action is authorized by this reusable example.

In the CSV, `depends_on` lists proposed prerequisite check IDs separated by semicolons; a justified not-applicable result can resolve a conditional prerequisite. The cutoff rows deliberately do not depend on finished discovery, handover, preservation, or asset return. `proposed_target` is a planning condition, not an actual deadline or SLA. Set real case deadlines explicitly and fill the actual-result, operator, reviewer, evidence, and timestamp fields only from events that occurred.

## Trigger, timing, and authority

Accept a verified personnel or sponsor notice giving a stable person reference, engagement type, manager, authorized cutoff with time zone, permitted communication audience, and known constraints. Contractor expiry is a scheduled trigger even if the sponsor has not replied. An approved extension or cancellation must be explicit; do not infer it from continued business demand.

The people owner or sponsor confirms the event and timing. The IT coordinator manages execution and coverage. System owners identify their applications and business dependencies. Authorized administrators or providers execute scoped changes. Records, privacy, or legal owners determine preservation and disclosure. A reviewer assesses actual results; the designated business authority decides residual risk and continuity restrictions.

Separate request, approval, execution, and verification even when a small team combines roles. Apply the [identity policy](../../documentation/policies/identity-and-access.md), including sensitive-access approval and review requirements. Providers cannot expand scope or accept the firm's risk merely because they hold technical access.

For suspected compromise, fraud, or a sensitive departure, use the incident and personnel processes immediately. Do not wait for this checklist or routine paperwork before taking protective action already authorized by the incident procedure. Conversely, uncertainty about retention is a reason to hold deletion or license removal, not a reason to leave access active.

## Establish the operating record

Create a restricted case with the notice, current identity references, operator and reviewer, cutoff, source inventory, authorized actions, preservation decisions, and service-level tasks. Store private details and evidence there. Record legal or personnel instructions by protected reference rather than copying sensitive narratives into broad support tickets.

Reconcile the population from the identity directory, service inventory, application ownership, device/asset records, and business-owner input. Include alternate administrative identities, guests, direct application logins, delegated access, API or personal tokens, remote-support tools, vendor requester authority, physical access, and business records. State discovery limits; a directory account list is not proof that no other access exists.

## Phase 1: prepare the coordinated plan

For a planned departure, map dependencies while access and knowledge are still available. Identify owned workflows, shared resources, approval queues, credentials, recovery contacts, billing notifications, scheduled work, and business correspondence. Assign replacements and verify them before cutoff where feasible. Use [planned handover](../succession/planned-handover.md) for the receiving ownership record.

Obtain preservation instructions covering the record classes, approved method and destination, recipient, retention authority, applicable hold, verification, and future disposition. Do not invent a universal retention period. Retaining content does not automatically authorize a manager to read all of it. Mailbox delegation, forwarding, exports, and ownership transfers need defined business scope and appropriate approval.

Prepare separate execution groups:

| Work group | Required basis | Dependency boundary |
|---|---|---|
| Cutoff access changes | Verified identity, actual cutoff, authority, known target scope | Does not wait for complete handover, asset return, or data transfer. |
| Preservation and transfer | Records direction, permitted recipient/destination, supported method | Must be resolved before a dependent deletion or license change. |
| Business replacement | Receiving owner, service-specific authority, tested replacement where feasible | A gap requires contingency, not indefinite continued personal access. |
| Wipe, deletion, license or subscription disposition | Explicit action approval and demonstrated preservation/technical prerequisites | These are distinct decisions; completion of access blocking is insufficient. |

## Phase 2: end access at the authorized cutoff

1. Reconfirm the person, target identity, environment, and cutoff immediately before execution. For synchronized identities, use the source and change route established by the internal runbook so synchronization does not undo the intended result.
2. Block or suspend the relevant identity using the supported account-state control. Record the saved state, action time, operator, and evidence. Do not delete the identity as the default containment step.
3. Revoke applicable sessions and refresh tokens, then address application-owned sessions, direct logins, delegated access, personal tokens, and remote support through each service's procedure. Record the actual result and any remaining exposure separately.
4. Remove or expire relevant entitlements and external requester authority. Capture the prior state where permitted and useful for evidence, recovery, or an authorized cancellation. Do not let a failed removal in one application delay authorized removal in others.
5. Coordinate physical access, issued authentication material, and device actions with their responsible owners. A suspended cloud identity does not establish that a recovered device or an offline local copy is inaccessible.

Microsoft documents separate account disabling and session revocation. Applications can hold their own session tokens, and effective revocation can depend on application behavior. Check application-specific deprovisioning and session controls instead of promising that a directory block instantly ends every session. [Microsoft: revoke user access](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access).

For Google Workspace, use the actual suspension control and verify account status. Moving someone into an OU named “Suspended” is not that action. Suspension keeps account data but affects service access and incoming mail; it is not a cost-free archive. Google also documents an ongoing Chat-session caveat. Plan the required mail and session handling separately. [Google: suspend a user temporarily](https://knowledge.workspace.google.com/admin/users/suspend-a-user-temporarily).

If an action remains queued, fails, or returns an ambiguous result, keep its state visible. Confirm the current system state before retrying, apply an authorized alternate containment measure where available, and escalate promptly according to impact. Do not adopt an arbitrary grace period during which known active leaver access is considered acceptable.

## Phase 3: preserve records and transfer the business work

Execute the approved preservation method and record scope, source, operator, time, destination, errors, and the evidence of completion. Test retrieval and permissions for representative items with the approved recipient. Keep the source protected until the required transfer or preservation checks support the next disposition; a submitted transfer job is not a verified result.

Reassign service-owned work through supported mechanisms: shared resources, document ownership where applicable, business records, calendars and pending meetings, automations, approval queues, and provider contacts. Verify the resulting business task, not just a new owner name. Do not log in as the former employee to perform the work.

Use the [mailbox/calendar access SOP](mailbox-calendar-access.md) for disclosure and delegation boundaries. Routine forwarding is not a substitute for a retention decision, and retaining records does not require unrestricted manager access. Any export needs a protected destination, controlled recipients, and the approved records process.

Microsoft's offboarding overview treats preservation, delegation, license changes, and deletion as separate tasks. Choose the supported method for the actual environment; the example is not a command sequence to delete every account. [Microsoft 365: former-employee process](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee?view=o365-worldwide).

If converting a Microsoft mailbox to shared, verify the prerequisites before removing a license. Microsoft documents size and feature-related licensing, including hold requirements, and says to retain the account that anchors the shared mailbox. Conversion does not itself prevent the former user from signing in. Check the actual mailbox, required features, and access state; never assume every shared mailbox needs no license. [Microsoft: convert a mailbox to shared](https://learn.microsoft.com/en-us/microsoft-365/admin/email/convert-user-mailbox-to-shared-mailbox?view=o365-worldwide).

For Google, review transfer requirements before deletion, including secondary calendars. Google's deletion guidance warns that deleting a Vault user can end retention/hold protection and cause unrecoverable loss. Do not lift a hold to make the checklist easier or treat a deletion-recovery window as preservation. Verify the required licensed preservation method with the records owner before changing the account's disposition. [Google: delete or remove a user](https://knowledge.workspace.google.com/admin/users/delete-or-remove-a-user-from-your-organization).

## Privileged departures need a second workstream

Apply this workstream when the person held administrative access, service secrets, emergency custody, recovery authority, provider requester status, or sole ownership of a critical integration.

Map the person-to-identity and identity-to-service dependencies. Identify an authorized replacement capable of the necessary operation, with an independent recovery route appropriate to the service. A listed backup administrator is not proof of capability. Check [emergency access readiness](../succession/emergency-access-readiness.md) where relevant.

Plan replacement or revocation of exposed shared secrets, signing material, personal tokens, and recovery paths according to actual access and risk. Inventory dependent consumers, select the supported change method, define monitoring and recovery, and verify the replacement task. Do not blindly rotate unrelated credentials or retain a departing person's account because a service secretly depends on it.

At cutoff, revoke the person's access within the authorized scope even if replacement work is incomplete. Escalate the continuity gap to the sponsor and use approved alternate administration or a restricted business process. Keep receipt of handover material, reassignment of authority, technical capability, and the underlying readiness test as distinct records. No delayed receipt or signature extends duties or access by implication.

## Phase 4: recover assets and authorize disposition

Reconcile assigned devices, keys, badges, authentication devices, and other property against the actual register. Record received, in transit, missing, held, or pending states separately. Confirm identifiers and custody at receipt; a courier tracking status alone does not prove the correct asset arrived.

Before wipe, disposal, or reassignment, resolve local-only business data, evidence needs, holds, device ownership, and the approved destruction or recovery method. A personal device requires the permitted company-data action, not an assumed right to erase the whole device. Destructive steps require their own authorization.

For an authorized remote action, track requested, accepted, pending, completed, and verified results. An offline device or missing execution confirmation remains unresolved. Follow the applicable device runbook's ordering before removing its management record; early removal can obstruct further control or verification. Use the approved alternative if remote cleanup cannot finish and keep the residual exposure owned.

Remove licenses, delete accounts, or cancel subscriptions only after their specific preservation, technical, financial, and approval dependencies are satisfied. A hold on one disposition does not prevent verified access removal. Record approved continued licensing or account retention with its purpose, owner, cost responsibility, and review trigger.

## Exceptions, cancellation, and recovery

| Condition | Required response |
|---|---|
| App owner is unavailable or a removal fails | Escalate immediately according to the exposure; use approved compensating containment. Record exactly which access remains unverified. |
| Transfer fails or destination is wrong | Preserve the controlled source, restrict the mistaken destination where authorized, determine what moved, and reconcile before retrying. No duplicate blind transfers. |
| Records direction is incomplete | Keep deletion, wipe, and affected licensing changes pending; escalate to the records decision-maker while authorized containment continues. |
| Departure is cancelled | Authenticate the cancellation and reassess current security status. Re-enable only newly approved access; do not automatically restore every former privilege, token, or exception. Verify services and records remain usable. |
| Contractor extension arrives late | Obtain explicit approval for the new scope and end time. Treat any reactivation as an authorized change with verification, not a retroactive justification for missed expiry. |
| Asset is not returned | Follow the people/asset escalation route and assess data exposure. Record custody uncertainty and available authorized controls; do not mark a queued wipe as asset recovery. |

Temporary exceptions require a decision, precise scope, accountable owner, implemented safeguard or explicit gap, expiry, earlier review triggers, and retest plan in the [exception register](../templates/exception-register.csv). An accepted deviation does not change a failed test into a pass. For a real incident, maintain the [incident record](../../documentation/cyber-risk/incident-response-record.md) and its actual command/notification process.

## Verify and close without hiding remaining work

Reconcile each known identity, application, permission class, record set, and asset to a result or justified not-applicable entry. Use administrative state, logs, provider confirmation, and approved safe checks. Do not test with the former person's password or impersonate them. State what session termination or offline exposure could not be independently verified.

Operator statements are evidence of their reported action; independent corroboration supports the consequential completion claim. Record the reviewer, coverage, actual observation time, and limitations. Checklists must distinguish execution from verification:

- Execution: `not_started`, `pending`, `in_progress`, `blocked`, `performed`, `failed`, `cancelled`, or `not_applicable`.
- Verification: `not_run`, `pending`, `supported_for_scope`, `failed`, `inconclusive`, or `not_applicable`.

Keep separate summaries for **access containment**, **records/ownership transfer**, **asset disposition**, and **final account/license disposition**. A case with unresolved tasks is **incomplete with owned exceptions**, even if access removal is verified. If local practice closes the access case separately, link every remaining case, owner, decision, and review date and clearly limit the completion claim.

The coordinator records coverage and remaining work; the reviewer confirms the evidence; receiving service/data owners acknowledge their assigned scope. The appropriate business authority decides residual risk. A signature is not a substitute for missing results. Keep actual timestamps, evidence, and approvals empty until they exist; all 18 example rows begin unperformed and unverified.
