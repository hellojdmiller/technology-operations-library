# Investor-reporting reconciliation pack

Help an operator answer a narrow question: did the approved report version reach the intended recipients for the correct fund and entity, and what remains unresolved?

**Status:** Proposed operating resources for private review. Exercises are fictional. No report has been distributed, investor contacted, entitlement changed, or payment authorized by this pack. Actual investor information, completed records, and evidence belong in protected operational systems outside this repository.

This expands the [fund and investor operations guide](../../../library/fund-and-investor-operations.md). It addresses distribution metadata and operational decisions. Finance, fund administration, and the designated reviewers retain ownership of financial accuracy, investor entitlements, release approval, and applicable obligations.

## Start here

| Resource | Purpose |
|---|---|
| [Operating procedure](sop.md) | Establish approved scope, reconcile attempts and outcomes, and manage interrupted or incorrect distribution. |
| [Blank decision and reconciliation record](reconciliation-record-template.md) | Keep recommendation, approval, execution, and independent verification separate. |
| [Exercise and answer key](exercise.md) | Practice an approved-version mismatch, an uncertain retry, and a possible wrong-recipient disclosure. |
| [Offline reconciliation sample](../../../work-samples/investor-reporting-reconciliation/README.md) | Inspect the canonical schema, fictional fixture, CLI, tests, and actual validation status. |

The sample owns the machine-readable schema and fixture. This pack does not maintain a second dataset or implement a delivery service. Its human record adds decisions and evidence references; it is not an automatic JSON importer.

The canonical fictional fixture describes nine expected logical deliveries and ten attempts. At its fixed review time, `2026-09-19T12:00:00Z`, the local output records completion support for four deliveries, but all nine still require review because the supplied batch is interrupted. The [exercise's fixture map](exercise.md#read-the-canonical-fixture) explains why a supported completion can coexist with duplicates or a denied entitlement. Neither `support_recorded` nor `complete_current_snapshot_set` independently verifies the supplied claims.

## The distinctions that matter

- An approved document and an approved recipient list are separate records. Both must cover the exact reporting period, fund, entity, and release version.
- A contact in a CRM, a portal account, or a successful sign-in does not establish entitlement to this report.
- A logical delivery is different from its attempts. Retries can increase attempts without increasing intended recipients.
- Submission, provider acceptance, portal availability, message delivery, and recipient access are different observations. Define which outcome this release requires before comparing results.
- A reconciliation result based on supplied metadata does not independently verify source completeness, approval authority, actual access, or receipt.
- A failed or interrupted run can have completed side effects. Preserve uncertainty and inspect destination evidence before deciding to repeat anything.

The operating record names the evidence source for each distinction. An unavailable log stays unavailable; it does not become zero deliveries or proof that nobody accessed a file. A person must resolve material findings before accepting the affected scope.

## Adoption and verification

Use the existing [data-handling policy](../../../documentation/policies/data-classification-and-handling.md), [document-control process](../../document-control.md), [ownership and escalation record](../../succession/ownership-and-escalation.md), and [pipeline-recovery SOP](../../sops/request-pipeline-recovery.md). The pack's [source notes](sop.md#source-notes) support specific technical distinctions; the workflow and decision rules are proposed local practices.

Read the sample's validation record for executed code checks. An offline fixture run or tabletop does not demonstrate portal integration, actual investor delivery, retention, incident recovery, or production readiness. No tabletop or live distribution exercise is claimed here.
