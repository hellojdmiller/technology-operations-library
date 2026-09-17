# Employee onboarding: from approved request to usable access

**Status:** Proposed SOP for a fictional investment firm. No person, account, device, approval, or completed test is represented. Product references reviewed September 17, 2026.

Use this procedure to coordinate a new employee or sponsored contractor across identity, applications, devices, and orientation. It expands the [joiner, mover, and leaver guide](joiner-mover-leaver.md); role changes use that guide's difference review. Configure actual platform steps in a maintained internal runbook rather than copying a fixed application list into this SOP.

**Working record:** [onboarding checklist](../checklists/onboarding-checklist.csv). Copy it into the protected case system, expand repeated service checks into service-specific tasks, and replace the fictional role assignments. The CSV is an execution aid, not evidence that its proposed steps were performed.

In the CSV, `depends_on` lists proposed prerequisite check IDs separated by semicolons; apply only the relevant prerequisites and document a not-applicable decision. `proposed_target` is a planning condition, not an actual deadline or SLA. Set real case deadlines explicitly. Named operators, reviewers, actual results, evidence references, and event times belong in the initially empty actual fields. A cancellation can interrupt the normal sequence immediately.

## Trigger and responsibilities

Begin from an authenticated personnel or sponsor request identifying the person through a stable internal reference, engagement type, manager, intended start time and time zone, work location, approved role, and required work. For contractors and other temporary access, include the accountable sponsor, end time, and removal owner. An email display name or a forwarded ticket is insufficient identity or authority verification.

| Role | Responsibility |
|---|---|
| People owner or authorized sponsor | Confirms the engagement, start or cancellation, identity record, and personnel prerequisites without placing unnecessary personnel information in the IT case. |
| Manager | Defines the work the person needs to perform and prioritizes a limited first-day scope if preparation is incomplete. |
| System or data owner | Approves the exact access, restricted-data scope, duration, and any delegated or elevated capability. |
| IT coordinator | Owns the case, dependencies, schedule, communication, and unresolved tasks. |
| Authorized operator | Implements approved changes through named access and records actual results. |
| Security, records, and purchasing owners | Review the matters assigned to them, including privileged access, records controls, exceptions, and new spend. |
| Reviewer and receiving manager | Reviewer checks technical evidence; manager acknowledges the stated work capability. Neither acknowledgment substitutes for the other's check. |

Follow the [identity policy](../../documentation/policies/identity-and-access.md). For sensitive access, requester and approver must differ. Where execution and review overlap because of staffing, record the limitation and arrange a second-person review. A provider executes within assigned scope; it does not approve its own charge or infer a new delegation.

## Before provisioning

Confirm the request's current revision, approved activation time, identity naming rules, authoritative directory source, access profile, service inventory, device eligibility/build standard, license availability, secure bootstrap method, and support coverage. Resolve rehire, duplicate-name, existing guest, or pre-existing account conflicts before creating another identity. Do not merge accounts solely because their names resemble each other.

Separate permission to prepare from permission to activate. Preparing a device or staging an identity need not expose working credentials or grant live data access. Identify any automatic grants, invitations, groups, or synchronization that could activate access earlier than intended. Use the adopted platform-specific method to prevent premature access; this SOP does not assume every service has a staging mode.

Set realistic internal checkpoints from the approved start, procurement lead time, business priorities, and service dependencies. No fixed lead time in this example is an SLA or employment condition.

## Decision gates

| Gate | Required before proceeding | If missing |
|---|---|---|
| Prepare | Verified request, identity, preparation authority, and accountable coordinator | Keep the affected task pending and obtain a corrected request. |
| Grant access | System-owner scope, required security approval, licensing, and an approved activation condition | Do not clone a colleague's access or silently broaden the default role. |
| Hand over equipment and bootstrap access | Verified recipient, recorded custody, applicable device controls, and supported authentication setup | Use an approved limited alternative or postpone the affected capability. |
| Accept readiness | Observed user tasks and access boundaries, support route, required acknowledgments, reviewer result | Record incomplete scope and its explicit interim arrangement. |

## Phase 1: approve the access and preparation plan

1. Build a service-by-service plan from the approved role and the current inventory. Distinguish automatically provisioned, manually provisioned, business-owner-operated, and excluded applications. Include file spaces, collaboration groups, physical access, and role-specific resources where applicable.
2. Record approval of each sensitive grant and any privileged identity separately. An executive title or a manager's request does not justify administrator access. Specify scope, duration, recovery method, and review for an approved elevated role.
3. Confirm licenses and any purchase authorization before committing spend. Record the edition and service features actually required; a free account or an available seat does not establish that the required control is licensed.
4. Assign device preparation, delivery, identity work, application tasks, and orientation to named roles in the protected case. Record the dependencies that determine the first-day capability. The manager should see the actual blocker and permitted alternative, not a generic “IT pending” message.

**Expected evidence:** authenticated request, approved access matrix, purchase decision where needed, inventory scope, preparation plan, and actual target times. Until observed, completion and verification fields remain blank or pending.

## Phase 2: prepare identity, services, and equipment

1. Create or reconcile the identity in the correct authoritative system using the adopted runbook. Record immutable identifiers internally and verify the intended environment before changes. Reopen the result to confirm attributes and approved access state.
2. Apply the approved service assignments and groups. Observe each target application's provisioning result. A source assignment, an accepted job, and a usable target account are different states; record each material dependency instead of assuming synchronization succeeded.
3. Prepare equipment from the current build standard. Verify the actual device, enrollment, required security controls, encryption and protected recovery capability, updates, and intended work applications. Registration in an inventory alone does not establish these outcomes. Keep recovery secrets out of the case.
4. Confirm approved data locations and any role-specific records or communications-capture requirement with the responsible owner. Verify applicable configuration and a harmless test outcome where required. Do not assert that every employee or every channel has the same capture requirement.
5. Record the asset assignment and authorized delivery method. A shipping label is not receipt. Confirm custody with the intended recipient before treating delivery as complete. Personal-device access follows the approved ownership and management model; it is not a default workaround for unavailable equipment.

Microsoft's add-user flow includes location and product-license selection; synchronized identity creation does not itself assign the Microsoft 365 licenses needed for the service. Check the actual user and entitlement rather than the provisioning task title. [Microsoft: add users and assign licenses](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/add-users?view=o365-worldwide).

Google's setup distinguishes domain-verified account creation from email-verified invitations. Select the route for the actual organization. A newly created account may not have all Google services immediately available, so verify the required service before claiming readiness. [Google: add an account for a new user](https://knowledge.workspace.google.com/admin/users/add-an-account-for-a-new-user).

## Phase 3: verify the recipient and establish authentication

Use the approved identity-checking and credential-delivery process. The user enrolls their own permitted methods; the technician must not ask for the user's password, authentication approval, factor seed, or recovery codes. Store necessary bootstrap material only through the approved protected method, with limited validity and audience. Do not put it in the ticket, meeting recording, checklist, or ordinary welcome message.

For a missed enrollment window, establish what expired or was consumed, re-verify the recipient, and issue a replacement through the supported procedure. Do not disable the organization's authentication requirements to get one user through setup.

Where adopted, Microsoft Temporary Access Pass can bootstrap authentication methods. Its policy must include the user, and creation requires the relevant administrator permissions. TAP lifetime is not a general guarantee that every established session ends at that time. Use the actual tenant's supported enrollment and session controls. [Microsoft: Temporary Access Pass](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-temporary-access-pass).

For Google, record enrollment and enforcement separately, including applicable organizational-unit and configuration-group settings. Group settings can override the organizational unit, and reports may lag. Do not treat a friendly OU name, an enrollment reminder, or a saved setting as proof of the user's effective authentication behavior. [Google: deploy 2-Step Verification](https://knowledge.workspace.google.com/admin/security/deploy-2-step-verification).

## Phase 4: demonstrate the approved work

At the authorized activation point, have the user complete a small set of harmless representative tasks. For example, access the assigned workspace, create a synthetic note in the approved location, open an authorized application, and reach the support route. Do not use real investment, investor, or personnel records merely to make the test realistic.

Confirm a representative excluded resource remains unavailable using an authorized test method. The positive test proves a bounded capability; the negative test checks a particular boundary. Neither proves every entitlement is correct. Record the full access population reviewed and the sampled behaviors.

Explain approved data handling, lost-device and suspicious-message reporting, account recovery, AI use, and request channels. Record acknowledgment of the actual approved policy version. Ask the user to explain how they would report a suspicious request; a signed acknowledgment alone does not demonstrate understanding.

The reviewer compares expected and actual identity, device, application, and access results. The receiving manager confirms the defined work scope is usable or accepts a specifically limited start within their authority. An unresolved security or access exception needs its own authorized decision.

## Late requests, changes, and failure handling

| Condition | Response and recovery |
|---|---|
| Late start request or equipment delay | Reprioritize the approved minimum work with the manager; identify blocked services, owner, and next update. Use only an approved managed alternative. Urgency does not waive access approval. |
| Duplicate identity or ambiguous provisioning response | Inspect the authoritative state and existing job before retrying. Resolve the identity conflict; do not create a second account to make the task appear successful. |
| A service remains pending or fails | Record the affected target, job state, error, elapsed time, and next check. Escalate against the actual impact and service procedure. Do not report the account ready or repeatedly reassign licenses without understanding the effect. |
| Required authentication or device control cannot be established | Stop the affected release; use the documented recovery or an approved restricted capability. Record a temporary exception with owner, safeguard, explicit expiry, earlier review triggers, and follow-up verification. |
| Start is postponed | Authenticate the change; update scheduled activation, invitations, bootstrap material, access exposure, asset custody, and the next review. Check downstream services already provisioned. License changes remain subject to data and service consequences. |
| Start is cancelled after preparation | Confirm cancellation, prevent authorized access from persisting, and use the [offboarding SOP](employee-offboarding.md) for existing identities, records, issued assets, and commitments. Do not delete blindly because the person never started. |
| Contractor end date arrives without an approved extension | Follow the scheduled access-removal process. Silence is not renewal. An extension requires a new authorized scope and end time before changing the removal plan. |

## Close the case with evidence

For each checklist item, record the approved target, actual event time, expected evidence, actual result, evidence reference, operator, reviewer result, and any exception. Operator reports are attributable evidence; independent console observations, logs, or user-task checks support stronger claims. Do not mark an entire case verified from one screenshot.

Use `not_started`, `pending`, `in_progress`, `blocked`, `performed`, `failed`, `cancelled`, or `not_applicable` for execution state. Verification is separate: `not_run`, `pending`, `supported_for_scope`, `failed`, `inconclusive`, or `not_applicable`. A not-applicable result requires a reason. `performed` means the action occurred; it does not establish successful verification.

Close as **completed and verified for stated scope** only when the required results are supported. Otherwise keep **in progress** or **limited start with owned exceptions**, with the manager's scope decision and the relevant risk approval. Link [exception records](../templates/exception-register.csv) and [decision/action records](../templates/decision-and-action-log.csv) rather than creating competing trackers. Review early-use issues at the agreed checkpoint and retest affected tasks after a material correction.

The checklist contains 16 proposed rows, not 16 completed actions. All actual evidence and timestamps are initially empty. Keep completed operational copies outside this repository. See [Microsoft identity training](../../training/microsoft-365-entra-operator.md) and [Google Workspace training](../../training/google-workspace-operator.md) for synthetic practice; neither is a production prerequisite certificate.
