# Software requests: from intake to verified delivery

Turn a software request into an explicit decision and a usable, supported result. Route an eligible request for an approved catalog item through its standard fulfillment path; route a new product or expanded use through a bounded review before anyone buys, connects, or deploys it.

This is a proposed service-desk procedure. The sample records are fictional and unexecuted. It complements the [software assessment and approval procedure](../../documentation/procedures/software-request-and-approval.md), which owns the detailed vendor assessment and trial criteria. Neither document authorizes a purchase or a real deployment.

## Trigger, scope, and accountable roles

Use for a subscription seat, installed application, extension, plugin, API service, AI tool, data connector, paid tier, or additional capability. A broken existing service starts in [ticket triage](ticket-intake-and-triage.md); an unrecognized installation or grant starts in [application alert review](application-alert-review.md). Link those records if the eventual solution requires a new request.

The requester describes the work; the sponsor confirms the business need; the service owner approves eligible users and support; the budget owner authorizes spending; designated technical and specialist reviewers resolve security, data, and contractual questions. The operator implements the approved scope and the reviewer checks the result. One person's role can cover several steps only within the actual authority record.

## Required intake

| Field | What the desk needs |
|---|---|
| Work and outcome | Task that is blocked or being improved; observable success condition |
| Scope | Product identity, edition, feature, users, environment, device ownership, and requested duration |
| Data and connectivity | Data class, source and destination, requested permissions, integrations, and ability to take actions |
| Commercial request | Estimated quantity and cost, trial terms, renewal and notice conditions, sponsor, budget route |
| Timing | Requested date and reason; distinguish an external deadline from preference |
| Ownership | Service owner, support route, implementation owner, and user acceptance contact |
| Existing alternatives | Current approved tool and the specific unmet need |

Use [software-request-register.csv](../checklists/software-request-register.csv) as a small routing register and link the protected request packet. Keep credentials, full agreements, personal data, and actual restricted sample documents outside the ticket's general description.

## Choose the route

| Route | Conditions | Required decision |
|---|---|---|
| Standard catalog fulfillment | Exact approved product, edition, eligible role, permitted data/use, deployment method, support, and quantity/spend authority match | Apply the documented standing approval or required entitlement approval; record the catalog revision and eligibility |
| New software or expansion | New vendor, tier, connector, AI capability, permission, data class, or use outside the existing decision | Assessment and, where needed, bounded trial and separate production approval |
| Temporary or urgent need | A real deadline cannot meet the normal review lead time | Explicit scoped exception and safe alternative; urgency supplies no permission |
| Duplicate or unnecessary purchase | Existing entitlement or approved tool meets the need | Sponsor confirms the alternative or withdraws the request; no silent substitution |

The presence of an app in a catalog does not authorize every employee, feature, connection, or contract amendment. A previously approved free tier does not establish approval for its paid renewal or new AI feature.

## Procedure

1. **Record and acknowledge.** Establish one request ID, intake time, accountable desk owner, requested outcome, and next update. Ask only for information needed to choose the route. Keep the original receipt time when missing details arrive; measure validation and approval delay separately using the adopted [service-level rules](../service-level-management.md).
2. **Validate identity and match the catalog.** Verify the requester and sponsor. Compare the exact product and use with the current decision. Check existing seats and entitlements without removing another person's license by assumption. Record why the request qualifies for standard fulfillment or requires review.
3. **Resolve assessment and decision dependencies.** For a new or expanded use, follow the companion assessment procedure. Obtain decisions from the actual business, budget, security, and specialist owners. Identify each unresolved question and who will answer it. Procurement approval, data-use approval, and administrator consent are separate decisions even if the same person performs them.
4. **Record the authorized scope.** Include the approved product/version or edition, users, data, permissions, environment, cost/quantity limit, conditions, effective period, trial end, renewal owner, and decision references. A changed quote, permission set, or target population returns the affected scope to review. Silence is pending; an email saying “sounds useful” is not an unlimited approval.
5. **Prepare delivery.** Identify the supported package or publisher source, deployment method, compatible environment, license availability, required identity settings, and removal method. Set an appropriate pilot population and success/denial checks. For a standard catalog item, use its maintained implementation instructions; do not invent a new installation recipe in the ticket.
6. **Coordinate the change.** Set the authorized implementation window, impact, recovery method, named operator, reviewer, and user contact. Use the applicable change process for shared configuration or a disruptive rollout. Keep a stable operation reference for correlation. Use verified idempotency or duplicate protection where supported, and inspect the authoritative order or provisioning state before retrying an uncertain action. A reference alone does not prevent duplicates.
7. **Deliver only what was approved.** Purchase through the authorized procurement route, provision the intended users, and apply the reviewed settings and integrations. Record the vendor order, entitlement, deployment, and access results separately. No operator should enter a user's password or collect their authentication factor to complete setup.
8. **Verify the result.** Inspect the destination system and confirm the expected edition, entitlement, version where relevant, population, and permissions. Have the user complete a representative permitted task using approved synthetic data. Check an excluded capability where it is safe and meaningful. An installation status does not establish that the application works for the user's task or that its data access is correctly scoped.
9. **Hand over support.** Give the user the permitted use, support route, known limitations, and instructions for reporting failure. Update the service/asset/license records, renewal and review ownership, and trial-expiry task. Record what support is available and where a vendor dependency limits it.
10. **Record a specific disposition.** Close delivered and verified, declined with reason, or withdrawn requests under the adopted acceptance policy. Keep incomplete fulfillment open with assigned follow-up. If the desk closes its coordination record after transfer, require explicit acceptance in a linked case and preserve the unfulfilled status and remaining scope. A paid order with failed provisioning remains unresolved. At trial expiry, follow the agreed stop, approved extension, or production review path; track revocation, billing, data export/deletion evidence, and retention limits separately.

## Approval workflow implementation notes

Atlassian documents approval steps as part of a request workflow. When configuring one, test the actual paths through that workflow and ensure the required decision is retained with its scope; a status label alone cannot establish authorization. [Jira Service Management approvals](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-approvals/).

Microsoft Entra's admin-consent workflow allows users to request an administrator's review when they cannot grant consent themselves. That technical workflow must be connected to the firm's software decision; it does not replace business or spending approval. [Microsoft Entra consent workflow](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/admin-consent-workflow-overview).

Intune reports assignment and installation information, including failures and pending results, with reporting limitations for some app and deployment types. Inspect the relevant result and its freshness rather than treating assignment as successful installation. [Intune application monitoring](https://learn.microsoft.com/en-us/intune/app-management/monitor-assignments).

These references were reviewed September 17, 2026. The procedure is platform-neutral; verify the implementation for the selected tenant, app type, version, and edition before adoption.

## Stop conditions, uncertain outcomes, and recovery

Stop the affected fulfillment step if the product identity, authority, cost, data scope, or target environment differs from the decision. Unexpected consent or a suspicious package requires security review. A user deadline does not justify disabling endpoint protection or granting permanent administrator rights to install a tool.

If a purchase or provisioning call times out, inspect the authoritative order/account record before retrying. If only some users or devices succeeded, reconcile them individually and recover the incomplete authorized portion. Do not replay the entire request or create another subscription to clear an error. Use [request pipeline recovery](request-pipeline-recovery.md).

If a package must be removed, confirm local data and dependencies before the approved removal. Reversing an assignment, uninstalling software, revoking a connector, cancelling billing, and deleting vendor-held data are different actions. Check the required outcome for each.

## Fictional example

A researcher requests an extra seat for an approved reading tool. The existing approval covers manual uploads of public documents; the request also includes a mailbox connector. The seat and connector need different scope decisions. The desk can fulfill the seat only if the user confirms the approved use is still useful and all applicable standing conditions are met. It leaves the connector unprovisioned and routes that expansion to review. The record does not describe the original full request as complete.
