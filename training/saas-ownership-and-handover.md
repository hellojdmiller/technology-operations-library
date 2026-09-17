# SaaS ownership and handover: can someone else operate it?

**Audience:** a firm technology lead, service owner, finance operator, or outside support provider.

**Mode:** tabletop; an optional isolated demo service can be inspected read-only.

**Source review:** September 17, 2026. No ownership transfer or account removal is performed by this lesson.

## What you will learn

- Separate business ownership, administrative access, data ownership, billing, and integration dependencies.
- Turn an incomplete handover into a bounded plan with evidence and named responsibilities.
- Identify vendor-specific transfer requirements instead of assuming all administrator roles are equivalent.
- Design a continuity exercise that tests the incoming operator’s access.

## Prerequisites

Use the [training record](training-record-template.md), a copy of the blank service record below, and only the synthetic scenario. No subscription or vendor administrator access is needed for the tabletop. An optional demo inspection requires a separately provisioned service and a read-only role where supported; identify the actual edition because ownership and audit features differ by product.

The lesson does not request real passwords, support PINs, recovery codes, contracts, or employee mailbox access. A knowledge check is not authorization to access another person’s data.

## Scenario

The fictional firm has a 12-person team and an outside IT provider. A departing operator is the only named owner of a demo collaboration service. Renewal is in 45 days. A second administrator exists, but nobody has checked whether that role can transfer ownership, change billing, export data, or repair the nightly integration.

Supplied fictional facts:

| Known fact | Gap to resolve |
|---|---|
| Business sponsor: Operations Lead | Who accepts service risk and signs off changes? |
| Administrative backup: Support Provider | What exact role and permitted actions does it have? |
| Annual subscription; renewal in 45 days | Notice deadline, purchasing owner, and support entitlement unknown |
| Nightly export uses a connection created by the departing operator | Credential ownership, scope, expiration, and replacement method unknown |
| Two team folders and one private workspace contain synthetic records | Data owners and access expectations need mapping |
| Last “backup succeeded” message was yesterday | Restore capability and completeness unverified |

## Service record to complete

| Field | Evidence required |
|---|---|
| Service purpose and critical workflow | A concrete business activity and acceptable interruption |
| Business owner / technical operator / backup | Named roles, decision boundaries, and acceptance |
| Product, edition, tenant/workspace boundary | Protected system record, with a fictional label in shared examples |
| Admin, primary owner, billing, support roles | Vendor role names and observed abilities; no passwords |
| Identity and provisioning dependencies | Login source, group mapping, offboarding path, and exceptions |
| Integrations | Purpose, owner, credential reference, permissions, schedule, and failure route |
| Data and recovery | Data classes, export location, retention decision, restore test, and owner |
| Renewal and exit | Dates verified from the contract, notice owner, export format, and exit dependencies |
| Escalation | Severity definition, business contact role, vendor route, and out-of-hours plan |
| Acceptance | Tests performed by the incoming operator, exceptions, and decision date |

## Exercise

1. Complete the record using the supplied facts. Mark missing facts **unknown**; do not supply plausible-looking values. Distinguish the person recommending a change from the person authorized to approve and perform it.
2. Build a dependency map: identity provider → service account → integration → destination → business consumer. Circle each dependency tied to the departing operator. Propose an independently owned replacement where the vendor supports it, with least necessary access and a verification plan.
3. Write a sequence that establishes incoming access, validates backup administration, reviews data/retention needs, plans integration replacement, tests a synthetic transaction, and only then closes out the old access under an authorized offboarding plan. Record rollback points and unresolved dependencies.
4. Compare two vendor examples. In Slack, primary ownership is a specific role and its transfer has particular requirements; ordinary administrator access is not interchangeable. Read [Slack ownership transfer](https://slack.com/help/articles/204401633-Transfer-ownership-of-a-workspace-or-org). For Microsoft 365, review the distinct access, mailbox, OneDrive, licensing, and account tasks in [Remove a former employee](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee?view=o365-worldwide). Do not apply one vendor’s transfer or retention rules to another.
5. Prepare a 15-minute teach-back: the incoming operator explains how to identify the system of record, find the runbook, recognize a failure, and escalate without asking the departing operator. In a demo environment, verify only harmless read access and synthetic content visibility. Ownership transfer, account disabling, deletion, and credential rotation remain paper steps.

## Failure and recovery exercise

At the midpoint, the instructor adds: “The second administrator can see users but cannot access billing or the integration. The scheduled job reports success, but yesterday’s synthetic record is absent from the destination.”

The learner must keep the handover incomplete, assign owners to the access and result gaps, preserve evidence, and propose a controlled rerun only after understanding duplicate effects. For recovery, specify a known-good connection or rollback arrangement and a destination reconciliation check. Do not mark recovery verified until an independent observation supports it. A vendor support request or a successful login is an intermediate event, not acceptance.

Use the [automation handover example](../documentation/automation-handover-template.md) for the integration record. Workflow exports can retain identifying credential metadata and embedded headers, so a shared handover attachment requires review; see [n8n export guidance](https://docs.n8n.io/build/manage-workflows/export-and-import).

## Expected evidence

Provide a completed service record, dependency map, role/ability matrix, ordered handover plan, proposed synthetic verification, failure response, and a one-paragraph acceptance decision. The decision should say which work is verified, which is only planned, and who owns each unresolved issue.

## Assessment and answer guide

| Question | Full-credit answer |
|---|---|
| 1. Why is “we have another admin” insufficient? **Scope criterion** | Different roles cover ownership, billing, support, data, and integrations; the learner verifies required abilities within the actual product and edition. |
| 2. What is wrong with using the departing person’s password for continuity? | It preserves dependency, weakens attribution, and bypasses a supported ownership/access design; plan authorized replacement access instead. |
| 3. Does a backup-success message establish recoverability? | No. A bounded restore and usability check must show what can actually be recovered. |
| 4. What completes integration recovery? **Recovery criterion** | An observed successful synthetic transaction, destination reconciliation, duplicate checks, and documented ownership after the change. |
| 5. Who accepts unresolved service risk? | The designated business decision-maker, with the issue and operational consequences documented; the operator does not silently assume that authority. |

## Limits

This is an operating exercise, not legal advice, a contract interpretation, or an approved offboarding procedure. Actual retention, litigation holds, vendor terms, and access approvals need the appropriate owners. Follow the [collection rubric](README.md). A complete document is useful evidence of planning, not proof that a transfer has occurred.
