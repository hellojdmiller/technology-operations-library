# Google Workspace: a baseline for VC operations

I would start with the work the firm cannot afford to lose: identity access, investment material, investor communications, finance approvals, and the evidence needed to understand an incident. A useful baseline protects those paths while allowing collaboration with portfolio teams, counsel, fund administrators, and outside advisers.

This guide is a proposed operating standard. [Twenty control assertions](desired-state.json) and the [evidence worksheet](evidence-worksheet.csv) make it reviewable. They are not settings to import. The linked Google documentation was reviewed on **2026-09-17**; each control carries its own source and prerequisite gate.

## Make the scope explicit

Before rating any setting, record the primary identity provider, Workspace edition by user population, active services, mobile/desktop management products, shared-drive structure, external collaboration types, and domain/DNS ownership. Keep the actual details outside this repository.

Use three example populations when designing a pilot: an administrator, an investment professional who travels, and a finance/operations user who works with external advisers. Include an external collaborator with a non-Google account if that is an actual requirement. The purpose is to expose a business dependency before an organization-wide restriction does.

## Identity and recovery: controls 01–04

Google's administration model calls for individually accountable administrators and more than one super administrator. It is not the same as copying a shared emergency-account pattern from Microsoft. Define who can recover whom and which separate dependency is available during an outage. [Google administrator guidance](https://knowledge.workspace.google.com/admin/users/security-best-practices-for-administrator-accounts).

Test a lost-key scenario before enforcing a narrower sign-in method. Google's **Only security key** policy also supports passkeys; its recovery behavior requires careful review. Check effective OU/group settings and the current user's enrollment, not just an aggregate report. [2SV deployment and method behavior](https://knowledge.workspace.google.com/admin/security/deploy-2-step-verification).

The acceptance test is practical: the administrator can complete the approved method, the ordinary account cannot perform privileged work, and the recovery operator can restore access without depending on the missing device. Store only the exercise result and an evidence reference in an assessment, never spare keys or recovery codes.

## Sharing and ownership: controls 05–06, 19–20

I would separate working spaces by the people who need to collaborate. A firm-internal operations repository has a different sharing requirement from a folder used with external diligence counsel. Record the exception as a purposeful collaboration boundary with an owner and review date.

Google's external-sharing controls can apply by OU or configuration group, and group settings can override an OU. Test actual recipient access with synthetic content. [External sharing controls](https://knowledge.workspace.google.com/admin/drive/manage-external-sharing-for-your-organization).

A restriction may leave the underlying external permission in place. Re-enabling sharing can therefore restore access. Review membership and individual-item grants, and prove removal at the resource. [Shared-drive access behavior](https://support.google.com/a/users/answer/12380484?hl=en).

Use a synthetic leaver exercise: identity access ends, the service owner still reaches critical records, external app access is reviewed, and the retention decision precedes deletion. [Account suspension behavior](https://knowledge.workspace.google.com/admin/users/suspend-a-user-temporarily). The process assertion is our proposed operational check; suspension alone is not a full offboarding workflow.

## Integrations: controls 07–08

Treat a calendar assistant, CRM connector, workflow engine, and AI note-taking tool as data-access decisions. Record the owner, business purpose, data categories, delegated/application access model, credentials, and end-of-use procedure. An app's convenient sign-in experience should not determine its access level.

Review effective OAuth app controls and scopes. [Google app-access controls](https://knowledge.workspace.google.com/admin/apps/control-which-apps-access-google-workspace-data). Domain-wide delegation deserves a separate record because it can bypass user consent; use it only when the business case requires it and keep scopes narrow. [Delegation guidance](https://knowledge.workspace.google.com/admin/apps/domain-wide-delegation-best-practices).

For a new automation, use a synthetic mailbox/calendar/file where possible, document the minimum scope, and show that revoking the integration actually ends access. Do not install a powerful collection tool just to complete the worksheet.

## Device posture: controls 09–10

Define what a trustworthy device means for each supported platform: ownership, enrollment, supported operating system, encryption, screen lock, lost-device response, and a way to recover the user. Map each requirement to a product that actually enforces or observes it. Basic and advanced Google endpoint management have different capabilities. [Endpoint-management overview](https://knowledge.workspace.google.com/admin/devices/overview-manage-devices-with-google-endpoint-management).

Context-Aware Access is edition-limited: Google's supported list includes Enterprise Standard/Plus and Cloud Identity Premium, among other specific editions. A user without a supported license is not protected merely because the user's OU has a policy. Browser/platform and API/service-account coverage also need explicit review. [Supported editions and access paths](https://knowledge.workspace.google.com/admin/security/protect-your-business-with-context-aware-access).

If the desired native control is unavailable, leave it unknown or document a verified gap and an alternative decision. Do not call a missing entitlement "not applicable." A compensating manual process can satisfy an operational review control; it cannot make an unavailable native enforcement feature active.

## Email authentication: controls 11–13

Start with the sender inventory: people, CRM campaigns, investor notices, expense systems, ticketing, and any delegated sender. Make a record per sending domain and per sender class. Validate received-message headers as well as DNS.

The configuration sequence is sender inventory and [SPF](https://support.google.com/a/answer/33786?hl=en), actual generated keys and [DKIM](https://knowledge.workspace.google.com/admin/security/set-up-dkim), then staged [DMARC](https://knowledge.workspace.google.com/admin/security/set-up-dmarc) monitoring, remediation, and enforcement. The catalog's target is approved enforcement; a monitoring-only policy is useful progress but does not meet that final assertion. Keep old DNS values and a propagation-aware rollback plan before changes.

## Monitoring, retention, and recovery: controls 14–17

Make three separate inventories: investigation logs, records retention, and restoration coverage. Give each an owner and a retrieval test. Many Google audit sources have six-month availability, while Email Log Search has a different window; data also arrives with source-specific delays. Do not infer "no activity" from a report that has not caught up. [Current retention/lag matrix](https://knowledge.workspace.google.com/admin/reports/data-retention-and-lag-times).

Vault requires the appropriate user/admin licenses and actual retention rules. It is an information-governance service, and deleting a user or required license can affect preservation. Ask the records owner to approve scope and duration. [Vault overview](https://knowledge.workspace.google.com/vault/getting-started/vault-overview).

Restoration needs its own test. Google's administrator Drive recovery has a limited post-deletion window, and a Vault export does not directly restore content to a user's Drive. [Drive recovery limits](https://knowledge.workspace.google.com/admin/drive/recover-deleted-files-and-folders-for-drive-users). Select recovery tooling based on the firm's required data loss and recovery time, then measure a restore—including permissions—rather than assuming a successful backup job settles the question.

## The first review session

Run the [fictional example](observed.example.json) with the [local assessment tool](../README.md). For a real review, copy the worksheet outside the repo and choose five priority questions: who can recover administrator access, where confidential files leave the firm, which apps can read them, whether a needed event can be found, and whether an important file can be restored. Record uncertainty. Then use the [staged rollout plan](../rollout-and-exceptions.md) to turn evidence into specific changes.
