# Mailbox and calendar access requests

> Adapted operational example, version 0.1. Identities and events below are fictional. This procedure does not grant access or authorize sending messages. Complete operational records in the protected request system. Assign local approval roles before use.

## Trigger and scope

Use for a new, changed, temporary, or removed delegation to a mailbox or calendar. Typical purposes include scheduling coverage and managing a shared service mailbox. Define the resource, delegate, business purpose, capability, and duration precisely. Access to sensitive personnel, legal, investment, or executive material may require additional review.

Investigations, legal discovery, departing-user data transfer, emergency access, and cross-organization sharing require their appropriate authority and retention process. Do not treat an ordinary delegation request as authorization to bypass those processes.

## Preconditions and decision boundaries

Verify requester and delegate identities through the approved directory, the resource owner or authorized custodian, the correct organization, and the operator's assigned role. Obtain the request, explicit scope approval, expiry or review date, current-state evidence, and removal plan. A manager's request alone is not proof of authority over another person's mailbox.

| Boundary | Responsible role and output |
|---|---|
| Recommendation | Service desk proposes the minimum capability required, with alternatives and existing access identified. |
| Approval | Resource owner or documented custodian approves scope; designated access approver authorizes the implementation. Specialist reviewers resolve sensitive or exceptional access. |
| Execution | Authorized messaging operator makes a scoped change using a supported method and records the result. |
| Verification | Operator or reviewer re-reads permission state; delegate and resource owner verify the intended behavior using approved synthetic content. |

## Choose the capability before changing it

For Exchange Online, mailbox access and sending permissions are separate. Full Access permits reading and managing mailbox contents; it is not a read-only role and does not itself permit sending. Send As presents the mailbox as sender, while Send on Behalf identifies the delegate relationship; neither alone grants mailbox reading. If both sending rights exist, Send As takes precedence. [Exchange Online permission definitions](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients).

Calendar viewing, editing, and delegation have different effects. A delegate can manage meeting activity beyond basic editing. Document private-item visibility and meeting-request routing separately. Do not rely on a Private flag as a security boundary; evaluate other grants that could expose the content. Outlook clients offer different controls. [Calendar editing and delegation](https://support.microsoft.com/en-us/outlook/sharing/share-and-access-a-calendar-with-edit-or-delegate-permissions-in-outlook).

## Procedure

1. **Complete the request.** Record the target resource, delegate, business purpose, required actions, organizational boundary, start date, expiry or review date, and whether coverage is temporary. Ask for the capability needed, not merely a broad permission label. For example, scheduling coverage may not require reading the mailbox.
2. **Read existing access.** Capture current direct permissions, relevant group memberships, calendar settings, and pending requests. Identify broader existing access and any conflicts with the requested outcome. Store protected references rather than copies of mailbox content. If the resource or person is ambiguous, stop before selecting an object.
3. **Recommend the least sufficient scope.** Specify mailbox versus calendar, read versus edit, sending identity, meeting routing, private-item handling, allowed delegate population, and removal method. Explain any reason the desired restriction cannot be achieved with the proposed permissions. Do not substitute Full Access for a calendar-only request to make setup easier.
4. **Record approvals.** Capture the decision, authority, exact scope, duration, and any exclusions. Link specialist review when required. Separate access approval from approval for a test message or meeting invitation; controlled test recipients must be agreed before anything is sent.
5. **Prepare the change.** Confirm the operator role, supported platform/client method, target identity, and intended difference from current state. Preserve unrelated delegates. If a method replaces an entire list rather than adding one member, account for existing entries and concurrent changes before proceeding. Do not copy commands from old tickets.
6. **Apply only the approved difference.** Record what was attempted, by whom, and when. Keep any audit or operation reference. Do not collect the owner's password or sign in as them. A successful save is recorded as submission until the result is checked.
7. **Verify configuration and behavior.** Re-read the relevant permissions and compare with the approved difference. Have the delegate use their own account and the agreed client to confirm the intended capability. Where practical, check an unapproved capability is unavailable, using harmless test content and an authorized method. For calendar-only access, review mailbox grants as well as calendar settings. Never test by browsing unrelated real messages.
8. **Schedule removal or review.** Assign an owner and tracked task. An expiry written in a ticket does not make a native permission expire automatically. If expiry automation is used, verify it exists and covers this grant; otherwise plan a manual removal and subsequent check.

## Stop conditions and partial failure

Stop for missing authority, object ambiguity, unexpected external recipients, a conflict with a preservation requirement, or an unexplained broader grant. A user cannot approve access on another person's behalf without documented authority.

If permissions save but behavior fails, re-read configuration, relevant group access, supported-client requirements, and service health before attempting another grant. Account for platform propagation without expanding rights. If one part of a multi-part change succeeds, record that part and decide whether to complete or roll back the approved difference. Do not remove pre-existing unrelated access during rollback. If removal is verified but old content remains locally cached, record the limitation; revocation does not prove copies were erased.

## Expected evidence and closure

Retain request and approval references, verified object references, permission scope, current-state snapshot, applied difference, audit reference, configuration verification, user acceptance, exclusions, and removal/review owner. Close implementation only after the intended state is verified or a clearly identified exception is accepted. For access removal, verify the grant and relevant alternative access paths within scope, then record remaining data-copy limitations.

## Synthetic example

EX-ACCESS-018 requests scheduling coverage for a fictional operations lead. The approved scope is calendar delegation with defined meeting routing, without mailbox access or private-item visibility. A check finds a pre-existing mailbox grant. The operator pauses the restricted-access claim and asks the access owner to resolve it; adding a narrower calendar permission would not remove the broader access.

## Reviewed sources and adoption checks

The two linked Microsoft sources were reviewed on 2026-09-17. Validate mailbox type, supported client, role, and actual permission behavior before local adoption. For another platform, map its capabilities explicitly rather than assuming Exchange names have equivalent effects. Related: [identity and access policy](../../documentation/policies/identity-and-access.md).
