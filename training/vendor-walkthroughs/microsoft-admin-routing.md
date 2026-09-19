# Route a Microsoft 365 request to the right owner

**Task card:** 1 of 8 · **Suggested practice:** 20 minutes, excluding vendor study · **Mode:** tabletop; optional read-only inspection in a separate lab.

**Research reviewed:** September 19, 2026. This is an original, unexecuted exercise. Continue with [SaaS ownership and handover](../saas-ownership-and-handover.md) for the full service record.

## Watch or read

Use Microsoft's [admin-center overview](https://learn.microsoft.com/en-us/microsoft-365/admin/admin-overview/admin-center-overview?view=o365-worldwide), updated February 2, 2026. The page contains videos for simplified and dashboard views with accompanying explanatory text. Read that text if video is unavailable; it is not identified here as a verified full transcript. Playback, duration and caption languages were not verified.

The [Microsoft Learn FAQ](https://learn.microsoft.com/en-us/training/support/faq) says reading training content is free without a profile; progress features use a profile. This does not provide an administrative role or product subscription. Available admin centers depend on plan and region, and your interface can differ. No login is needed for this tabletop.

## Predict before studying

A service owner says, “I can open the admin center, so I can approve every change.” Write one reason that statement is insufficient before opening the vendor page.

## Practice with this fictional queue

All requests are fictional and **unapproved**. Your task is to route them and identify evidence, not perform them.

| Ticket | Request | Supplied evidence |
|---|---|---|
| LAB-101 | Give `learner-a` the same apps as the operations team | Manager request exists; exact product entitlement and approval are missing |
| LAB-102 | Let an external reviewer read one project folder | Folder owner known; reviewer identity and permitted material unresolved |
| LAB-103 | Explain why `learner-b` cannot sign in | Screenshot of an error; no timestamp or correlation information |
| LAB-104 | Change the payment method for a subscription | Second administrator can see users; billing authority unknown |

1. Create four routing rows: business decision owner, likely administration surface, least necessary operator role **to verify**, missing evidence, and next permitted read-only check.
2. Use the vendor overview to distinguish common user/license work from specialist SharePoint, Entra and billing work. Do not invent the exact role entitlement from a menu label.
3. Choose LAB-102. Draft the question the data owner must answer before a sharing proposal can be assessed. Keep the draft local.
4. Optional lab: inspect only the surfaces your separate test role can already read. Record an inaccessible surface as a permission observation, not permission to elevate yourself.

## Verify your answer

| Required evidence | Answer guidance |
|---|---|
| Four routing rows with separate business and technical responsibilities | User/license, content access, identity investigation and billing are different tasks. One administrator is not automatically the approver for all four. |
| An explicit uncertainty for every ticket | LAB-101 lacks entitlement/approval; 102 lacks identity/data scope; 103 lacks diagnostic context; 104 lacks billing authority. None is ready to execute. |
| A bounded LAB-102 evidence request | Identify exact folder/content, intended recipient and access duration, with data-owner approval and later allowed/denied access checks. A broad “share the drive” request expands scope. |
| Read-only result, if attempted | Note the actual lab role, page and observation time. A visible button establishes neither authorization nor successful execution. |

## Teach back and transfer

Explain how a support provider could administer accounts while the business owner retains approval authority. Then change LAB-104: the usual billing approver is unavailable. Identify the escalation gap without assuming that technical access grants financial authority.

Use the [training record](../training-record-template.md) to record study, practice and independent explanation separately. Revisit this card when admin-center navigation, roles or licensing change. No role assignment, purchase, sharing change or message is part of this exercise.
