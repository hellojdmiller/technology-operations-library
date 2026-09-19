# Reconcile an investor-reporting release

> Proposed SOP, version 0.1. Reviewed September 19, 2026. Adopt with named owners and supported provider procedures before operational use. This document and its offline companion do not send reports, grant access, approve financial content, or authorize a payment.

## Scope, roles, and release boundary

Use for a bounded reporting cycle, a delivery exception, or recovery after an interrupted distribution. Identify reporting period, fund, legal entity, report type, release version, intended delivery channel, and authorized population. IT supports the technical process; the reporting/data owner and fund administrator establish the approved business facts.

| Role | Responsibility |
|---|---|
| Reporting owner and alternate | Defines the release, expected population, delivery criterion, deadline with time zone, and unresolved business decisions. |
| Content and entitlement reviewers | Approve the exact document version and exact fund/entity/recipient relationship under delegated authority. Record when different people own these decisions. |
| Reconciliation operator | Collects scoped metadata, checks source completeness, runs the offline review, and recommends a disposition. Read access does not confer sending or remediation authority. |
| Release/recovery authority | Approves the specific release or recovery action, conditions, and permitted timing. A supplier's completed task is not this approval. |
| Execution operator and independent verifier | The operator performs only separately authorized actions; the verifier checks authoritative outcome evidence rather than relying on the operator's submission message. |
| Incident lead and specialist reviewers | Own suspected disclosure response and any external communication or notification decision through the existing incident process. |

Keep [recommendation, approval, execution, and verification](reconciliation-record-template.md) as separate entries, even when local policy permits role overlap. Record that overlap; do not label a repeated self-check independent. Assign the required second review or leave independent verification pending.

## 1. Establish a complete expected population

Record the approved population source, export/query scope, collection time, source version, filtering, pagination, and excluded entities. Reconcile it to the release owner’s expected population. A successful API request, nonempty file, or equal row count does not establish completeness.

Use exact stable identifiers for recipients, funds, entities, documents, and logical deliveries. Verify how an account maps to the authorized person or organization. Do not infer an entitlement from a display name, email resemblance, parent-company relationship, or access to another fund. Changes to contacts or entitlement must return to the appropriate owner before use.

Define the expected set independently from observed delivery logs. Building the expected list from successful attempts would hide omissions. Confirm unexpected recipients and missing intended recipients separately; equal totals can conceal both.

## 2. Freeze the approved version and permitted access

Link the content approval to the exact report identity, period, fund/entity scope, version, and protected artifact reference. Record a checksum where the platform supports a stable byte comparison. A matching digest identifies bytes; it does not approve their contents or prove they are correct. A changed artifact requires the relevant new review even if the filename is unchanged.

Confirm the approved recipient scope and access method independently of the report's approval. In a synthetic preflight, test an entitled identity, an excluded identity, and any relevant entity boundary using the supported platform process. Inspect alternative access paths, such as preexisting group membership, when evaluating effective permissions.

Microsoft documents that a SharePoint/OneDrive **Specific people** link requires authentication as a specified recipient. That describes the link mechanism; the business owner must still establish which recipients belong on it. The documentation also notes that other permissions can preserve access when a link expires. [Microsoft sharing-link behavior](https://learn.microsoft.com/en-us/sharepoint/shareable-links-anyone-specific-people-organization).

Record what “delivered” means for this release. A portal upload, a notification accepted by an email service, and a recipient viewing the document are different states. Do not upgrade one into another. If acknowledgement is required, define its evidence and owner rather than assume every platform can prove it.

## 3. Preserve attempts and reconcile observations

Keep one logical delivery identity for the intended recipient/document/version relationship and separate identifiers for every attempt. Preserve timestamps with zones, operation/correlation identifiers, provider status references, and the observation time. Keep actual payloads and addresses in protected systems rather than general logs or this library.

Use the [canonical offline sample](../../../work-samples/investor-reporting-reconciliation/README.md) to review supplied metadata. Read its findings alongside the underlying records. A no-gap result covers only its documented checks; it does not establish approval authority, source authenticity, financial correctness, effective access, or recipient receipt.

For each logical delivery, compare the approved document and entitlement with intended delivery and available observations. Preserve missing, unexpected, duplicate, wrong-version, conflicting, stale, and unknown facts. Reconcile attempts rather than counting every retry as a recipient. A later correct attempt does not erase an earlier incorrect disclosure or prove that a duplicate was harmless.

## 4. Decide what an interruption permits

Before recovery, coordinate automatic retries, queued work, in-flight operations, the fund administrator, and manual operators. Under existing authority, pause the affected scope where needed and verify the pause. Inspect the provider's authoritative operation history and destination state; a timeout can occur after an effect was committed.

| Observed state | Decision to prepare |
|---|---|
| Correct effect verified; local tracking is stale | Propose an audited tracking correction without repeating the delivery. |
| Failure without effect reliably established | Propose a bounded retry only after validating current version, entitlement, release authority, and duplicate protection. |
| Outcome unknown or logs incomplete | Hold the affected replay; obtain evidence or an explicit owner-approved manual recovery plan. |
| Some recipients complete; others failed or unknown | Preserve completed evidence; scope further work to individually reconciled outcomes. Do not replay the entire batch. |
| Wrong version, recipient, or entity observed | Stop dependent work within authority and use the disclosure/error response below. A resend alone cannot resolve the earlier event. |

Follow the existing [pipeline-recovery SOP](../../sops/request-pipeline-recovery.md) for operation keys, concurrency, and supported retry behavior. The same intended effect may reuse a supported idempotency key; an attempt gets its own ID. A changed report or recipient is a changed intent that needs a new decision and correctly defined operation identity. A correlation ID alone is not duplicate protection. AWS explains that safe retries depend on an API's implemented idempotency contract, including the meaning of repeated client request identifiers. [AWS safe-retry design](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

Approval to investigate is not approval to resend, revoke access, delete a record, or contact an investor. Execute recovery only through the authorized provider-specific process and preserve both the original and recovery attempt records.

## 5. Handle a possible wrong-recipient or wrong-version disclosure

Escalate promptly through [security alert triage](../../sops/security-alert-triage.md) and the reporting owner when material may be accessible outside the approved scope. Preserve the report/version reference, recipient and entity mapping, affected interval, available access/delivery evidence, and the source of uncertainty. Do not wait for a complete access history to raise a suspected incident.

Use established containment authority for a scoped pause or access restriction; record the authority and observed outcome. Where that authority is absent or unclear, reach the incident lead and alternate rather than invent it. Preserve necessary evidence before avoidable destructive changes. Keep external contact and notification decisions with the designated incident/business specialists.

A revoked link, recall request, recipient's verbal assurance, or deleted portal item does not prove all downloaded copies are gone. Separate current access containment from previous exposure and potential downstream use. Keep inaccessible or unavailable logs explicit, and record who owns each follow-up.

If an earlier report version must be restored, use the approved document-control process and independently verify the resulting release identity. SharePoint restoration, for example, copies the selected earlier version into the latest version; it does not remove that earlier version. Recheck approval and the distributed artifact after restoration. This pack does not treat restoration as evidence that earlier recipients lost copies. [Microsoft version restoration](https://support.microsoft.com/en-us/sharepoint/documents-and-library/restore-a-previous-version-of-an-item-or-file-in-sharepoint).

## 6. Verify and close the bounded outcome

The verifier compares the authorized release population with authoritative destination observations, identifies discrepancies, and checks intended and excluded access within the approved scope. Record evidence, observation time, limitations, and whether the observation is independent of the execution report. When independent verification is required but unavailable, leave it pending and escalate the gap.

Report expected logical deliveries, verified outcomes, and unresolved cases separately; define overlap if a case has several findings. Do not subtract unknowns from the denominator to improve completion. Preserve original deadlines and actual times; a recovery cannot retroactively make a late delivery timely.

The reporting owner may accept the verified scope, defer acceptance, or assign an explicitly acknowledged unresolved transfer. A transferred exception remains unresolved and cannot be described as delivered. Link any open incident and record who owns it. Store the completed [decision record](reconciliation-record-template.md), source/export versions, evidence references, and follow-up owners under the adopted retention and access rules.

## Source notes

The three linked official pages were reviewed on **2026-09-19**. They support only the stated sharing, version-restoration, and retry mechanics. The role assignments, record model, decision table, and exercise are original proposed operating practices. They neither prescribe legal requirements nor establish compatibility with a particular investor portal. Use the existing [data-handling policy](../../../documentation/policies/data-classification-and-handling.md) and [incident record](../../../documentation/cyber-risk/incident-response-record.md) for related governance.
