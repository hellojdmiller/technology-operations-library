# Microsoft 365: a baseline for VC operations

I would treat this as a set of connected operating decisions: who can administer the firm, how staff and guests get access, where information can travel, and how we recover when a control or service fails. A long list of green settings is less useful than evidence that those paths work as intended.

The [twenty control assertions](desired-state.json) and [evidence worksheet](evidence-worksheet.csv) are configuration planning assets, not Microsoft policy exports. Each assertion includes an evidence requirement, review gate, and official reference. Sources were reviewed on **2026-09-17**.

## Choose the identity design before adding policies

Inventory the actual Entra, Microsoft 365, Intune, Defender, and Purview entitlements by affected population. Business product names do not establish every feature right. Conditional Access generally requires Entra ID P1; risk-based policies require P2. Microsoft 365 Business Premium includes Conditional Access capability, while related products have their own licensing conditions. [Conditional Access licensing](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview).

Security defaults provide a basic identity-protection option without premium identity licensing. They are an on/off design rather than a customizable exception framework. For a licensed Conditional Access design, plan equivalent protection before the transition so disabling defaults does not leave a gap. [Security defaults](https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults). The baseline does not require purchasing a particular bundle; it requires an explicit protection and entitlement decision.

## Privilege, MFA, and emergency access: controls 02–06

Map administrative tasks to roles and accountable operators. Keep ordinary collaboration separate from privileged activity and review standing access. [Microsoft identity security guidance](https://learn.microsoft.com/en-us/azure/security/fundamentals/steps-secure-identity).

For the licensed design, pilot a phishing-resistant authentication strength for privileged roles. Registration of a passkey is not proof that policy requires its use. Validate effective assignments and actual sign-ins. [Phishing-resistant admin policy](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa).

Microsoft's emergency model uses at least two cloud-only accounts with phishing-resistant credentials, permanent active privileged access, monitoring, and periodic tests. Exclude them from policies that could block/restrict emergency sign-in, while retaining their strong authentication protection. Their custody should not depend on one employee's phone. [Emergency access design](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access).

Inventory legacy-client dependencies before blocking them. A user-targeted policy does not cover every service principal or automation. [Legacy-authentication control](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication). A service dependency needs an owner and migration plan, not a permanent unexplained exception.

## Devices: controls 07–08

Agree platform-specific requirements before choosing the access gate: enrollment, encryption, supported OS, screen lock, device reporting, and user recovery. An investment team may combine managed laptops, mobile devices, browser-only external access, and travel; test the paths actually used.

Intune compliance must exist and have working assignments before Conditional Access requires a compliant device. Begin with representative enrolled devices and report-only evaluation where supported. [Device-compliance access planning](https://learn.microsoft.com/en-us/mem/intune/protect/create-conditional-access-intune).

Review the tenant setting for devices with **no compliance policy assigned**. Microsoft's default can consider them compliant; the proposed target here is not compliant after assignment coverage is ready. [Compliance-policy behavior](https://learn.microsoft.com/en-us/intune/device-security/compliance/overview). Requiring compliance and establishing the underlying device standard are separate checks.

## Collaboration and integrations: controls 09–12

Make sensitive deal/finance workspaces deliberate collaboration boundaries. Use authenticated sharing and an appropriate default link type; assign an owner to external access. Consider the entire path through Entra B2B, Teams/Groups, SharePoint, OneDrive, and the resource itself. The organization-level sharing setting alone does not describe every site. [Organization sharing](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off), [site sharing](https://learn.microsoft.com/en-us/sharepoint/change-external-sharing-site).

A guest account being present does not prove that access is still justified. Keep sponsor, purpose, expiry/review date, and a revocation result. Native access reviews require applicable Governance/Suite licensing, with some capabilities available under P2. A manual sponsor review is a reasonable process alternative when it produces evidence and follow-through. [Access-review capabilities and licensing](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview).

Application consent needs a similar decision. Choose an explicit user-consent policy and an approval route; then periodically inspect permissions already granted. An application can retain powerful application permissions separately from a person's group membership. [Consent settings](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent), [application-permission review](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions).

For an AI assistant or workflow engine, I want a short record of data access, permissions, the accountable owner, and how to remove it. Use synthetic data to test both the successful workflow and the revocation path before introducing confidential material.

## Email authentication: controls 13–15

Build a domain-and-sender inventory before editing DNS. Include investor notices, CRM mail, fund administration, and systems that send under the firm's brand. Validate SPF, DKIM, and DMARC together using received headers from each legitimate sender class.

SPF is configured at the DNS host, not through a Microsoft 365 SPF settings command. [SPF configuration](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-spf-configure). For DKIM, obtain the actual selector values from the tenant: Microsoft's newer selector format differs from many older examples. [DKIM configuration](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dkim-configure). Move DMARC from monitoring through sender remediation to reviewed enforcement; keep a saved DNS rollback record. [DMARC configuration](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure).

## Logs, records, and restores: controls 16–19

Keep identity investigation logs separate from Microsoft 365 audit and records retention. Entra audit/sign-in native retention is generally seven days for Free and thirty for P1/P2; expired records do not reappear after a license upgrade. [Entra retention](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/reference-reports-data-retention).

Purview Audit has different licensing and retention behavior. Standard generally retains audit records for 180 days, while Premium and additional retention options depend on the relevant user/event/license coverage. Verify an actual workload event and retrieval window. [Purview audit search and retention](https://learn.microsoft.com/en-us/purview/audit-search).

A records owner should decide how long to retain each data class and when deletion is allowed. Test policy/label and hold interactions before changes that could purge data. [Retention policies and labels](https://learn.microsoft.com/en-us/purview/retention). This guide does not prescribe a legal retention duration.

Recovery is another design. Microsoft 365 Backup is a separate consumption-billed option for supported workloads; protection must cover the actual units needed. [Backup overview](https://learn.microsoft.com/en-us/microsoft-365/backup/backup-overview?view=o365-worldwide). Whatever method the firm selects, measure a restore with content and permission checks against agreed business recovery objectives. A configured retention label is not a restore exercise.

## Make a change reviewable

For each proposed access policy, capture scope, exclusions, user experience, and the rollback route. Pilot using real business scenarios and synthetic content. Include a traveling user, finance delegate, external collaborator, new device, and lost-factor scenario where relevant. [Conditional Access deployment planning](https://learn.microsoft.com/en-us/entra/identity/conditional-access/plan-conditional-access).

Try the [fictional observations](observed.example.json) using the [local tool instructions](../README.md), then use the [change and exception record](../rollout-and-exceptions.md) for a private operational copy. A recorded unknown is useful: it says precisely what evidence the next review must obtain.
