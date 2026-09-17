# Application discovery and permission alert review

> Adapted operational example, version 0.1. All sample requests and decisions are fictional. Adopt only after assigning local owners and authority. Completed app inventories, user lists, and evidence belong in protected operational systems. This document records no actual app approval or block.

## Trigger and scope

Start when discovery, endpoint inventory, consent monitoring, or a user report identifies a new application, unusual adoption, or changed permissions. Cover web services, installed applications, browser extensions, and connected applications. The outcome is a scoped disposition and a verified handoff or enforcement result.

Popularity, a familiar name, publisher verification, or a positive reputation score does not establish business approval. A product may be approved for one use while a new connector or data scope remains unapproved. Suspected compromise follows [security alert triage](security-alert-triage.md) immediately.

## Preconditions and decision boundaries

Access the alert and application register through trusted routes. Obtain scoped read access to discovery and identity records, a current data-classification policy, and the responsible service owner. Capture the specific tenant/account context before comparing records; display names alone can collide.

| Boundary | Responsible role and output |
|---|---|
| Recommendation | Service desk and technical reviewer identify the app, business purpose, permissions, gaps, and proposed disposition. |
| Approval | Business owner and designated security approver approve a defined use or restriction; specialist review resolves applicable data and contract concerns. |
| Execution | Authorized platform operator applies approved settings, consent changes, or removal. A support analyst does not implicitly approve software by closing an alert. |
| Verification | Reviewer checks the actual consent, installation, or enforcement state and its intended scope; requester confirms the approved business capability where relevant. |

## Procedure

1. **Identify what was detected.** Record detection source, time range, app/product name, publisher, domain or package reference, application identifier where available, affected population count, and protected references to affected accounts. Distinguish a visited website from installed software and a granted connector. A single discovery record may not establish all three.
2. **Check immediate risk.** Look for unexplained high-privilege consent, a lookalike publisher, unexpected mailbox or file access, suspicious downloads, or a user who denies the activity. Escalate suspected compromise without waiting for vendor diligence. Preserve available consent and activity references before any approved revocation.
3. **Match the approval record.** Compare the actual app identity, features, account type, data classes, permissions, users, and environment with the register. Record approval owner, conditions, and review date. Treat new AI features, data connectors, or broader permissions as a scope change, even when the base product is familiar.
4. **Research the product safely.** Read official product, privacy, security, and permission documentation through a trusted browser route. Do not install it, authorize it, or visit a suspicious sign-in link to find out what it does. Record the source date and unresolved questions. A benign background component needs an identified parent product and evidence of its role; an unknown name is not enough to label it harmless.
5. **Clarify business use.** Ask the user and service owner whether the activity was intentional, what problem it solves, and what data has been connected or uploaded. Do not ask them to repeat consent. Record claimed use separately from observed activity and compare with existing approved alternatives.
6. **Review effective permissions.** Have the authorized reviewer inspect granted permissions, who consented, the relevant resource scope, recent activity, and available revocation paths. Separate the rights requested by a product from rights actually granted in this environment. OAuth grants can enable data access without sharing the user's password. [Microsoft's OAuth investigation guidance](https://learn.microsoft.com/en-us/defender-cloud-apps/investigate-risky-oauth) supports reviewing consent, publisher identity, activity, and whether permissions fit the purpose.
7. **Make a scoped recommendation.** Use the decision table below. Include the evidence, owner, data scope, unresolved questions, business effect, and proposed verification. A new or expanded business use follows the [software request and approval procedure](../../documentation/procedures/software-request-and-approval.md); alert closure is not an onboarding shortcut.
8. **Execute and verify approved changes.** Record separate results for classification, endpoint enforcement, consent removal, installed-software removal, and vendor-side account/data handling as applicable. In Microsoft Defender for Cloud Apps, a sanction label alone does not prove blocking: enforcement depends on configured integrations and prerequisites. Verify the relevant managed population and surface using an approved harmless check or enforcement evidence. Do not upload real data to test a block. [Discovered-app governance](https://learn.microsoft.com/en-us/defender-cloud-apps/governance-discovery).

| Evidence-based disposition | Required next step |
|---|---|
| Approved identity and use match current scope | Document the match; verify any alert-specific concern before closure. |
| Legitimate purpose, missing approval or expanded scope | Route to review; record interim restrictions and accountable owner. |
| Identified background component with explained behavior | Record parent product and technical evidence; escalate unexplained data access. |
| Suspected malicious or unrecognized consent/activity | Incident handoff and authorized containment decision. |
| Insufficient identity, telemetry, or business context | Keep unresolved; name the missing evidence and next owner. |

## Stop conditions and partial failure

Stop changes when app identity is ambiguous, affected dependencies are unknown, approval is missing, or proposed restrictions would cross entity or tenant boundaries. Escalate critical business dependencies rather than silently blocking them.

If a label saves but endpoint enforcement is absent, report **classified; blocking unverified**. If consent is removed but vendor-held data or active sessions are unresolved, track them separately. Before retrying an action with an uncertain result, read its audit and current object state. If a restriction breaks an approved process, preserve the failure, obtain the scoped rollback decision, and recheck both functionality and the original risk. Never restore broader rights merely to suppress user errors.

## Expected evidence and closure

Keep the alert reference, exact app identity, approval comparison, research links, observed permissions, user context, disposition authority, before/after state, verification scope, and any follow-up. Update the application register only with the actual decision and state. Close when the concern is supported as resolved or an accountable reviewer has accepted the next phase; record incomplete enforcement as an open exception, not success.

## Synthetic example

EX-APP-022 flags a fictional meeting helper. The base product is approved for manual notes, but the discovered consent can read calendars. The reviewer opens an expansion request and recommends removal of the unapproved grant. After approval, consent removal is verified. Vendor retention remains a separate question; the record does not claim that previously transferred information was deleted.

## Reviewed sources and adoption checks

Linked Microsoft documentation was reviewed on 2026-09-17. Confirm current integration support and enforcement scope in the actual environment. For AI-enabled tools apply the [AI acceptable use policy](../../documentation/policies/ai-acceptable-use.md), including its prohibition on Confidential information in AI tools. These steps propose operational controls; they do not rate or approve a real vendor.
