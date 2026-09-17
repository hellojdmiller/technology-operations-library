# Disaster recovery playbook

> Adapted example for a fictional investment firm. Version 0.1. This is a vendor-neutral example structure. It omits live architecture, credentials, system inventories, contact details, and incident history. It is not an executable production runbook.

Use this playbook with the [business continuity plan](business-continuity-plan.md). The goal is to restore an agreed business capability and verify that people can use it safely. Restoring a file or receiving a successful job status is only part of recovery.

## Before an incident

Maintain a protected service register with the owner and alternate, purpose, dependencies, approved RTO and RPO, backup or alternate process, recovery permissions, vendor support route, current procedure, and last test evidence. Keep secrets in the approved vault; reference them through the internal access procedure.

Test access to recovery instructions and emergency credentials while ordinary sign-in is unavailable. A second account on the same failed identity service may not provide an independent recovery path.

## Choose the correct path

| Observation | First decision |
|---|---|
| Many services fail from one location | Check local power, connectivity, and shared dependencies |
| One provider is unavailable | Confirm provider status and activate the approved business workaround |
| Application works but records are missing or corrupted | Preserve evidence and assess a bounded data restore |
| Sign-in fails broadly | Assess identity and authentication dependencies before changing applications |
| Compromise is suspected | Coordinate containment and evidence preservation with the incident lead |

Do not restore into a still-compromised environment. Do not bypass network security or disable access controls as a default recovery technique. Escalate an unplanned workaround with its risks and limits.

## Recovery order

Use the impact analysis and actual dependencies to set the order. A typical planning sequence is responder communications and recovery access, connectivity and identity dependencies, critical business applications and records, and then lower-priority services. The incident lead may change this order for safety, compromise, or an imminent business deadline.

## Example recovery card for a document workspace

**Business capability:** Authorized staff can read the approved current decision pack and record controlled changes.

**Example targets:** Restore capability within six hours, using data no more than two hours old. These are fictional targets from the companion BCP and require proof before adoption.

**Prerequisites:** Authorized operator; current service record; reachable recovery destination; available backup or version history; application owner; incident approval; and known permissions baseline.

1. Determine whether the failure is provider availability, access, configuration, or data integrity. If the provider itself is unavailable, restoring into that same provider may be impossible.
2. Record the affected objects and time range. Preserve relevant evidence and identify the most recent known-good recovery point.
3. Confirm recovery-point availability, expected data loss, destination, scope, retention constraints, and authorization. Escalate a gap against RPO before proceeding.
4. Restore a representative sample into an isolated destination. Keep the current source intact where possible.
5. Verify file content, versions needed for the task, permissions, sharing restrictions, and required metadata. Test as an authorized business user and an unauthorized test identity.
6. Obtain the application owner's acceptance of the sample. Approve the expanded restore or stop and select another path.
7. Execute the approved scope and record job status, completion evidence, errors, and exceptions.
8. Reconcile changes made after the recovery point. Prevent duplicate processing or accidental overwrite of newer valid work.
9. Obtain business-owner acceptance, remove temporary access, and update the incident record.

**Stop conditions:** Uncertain destination, missing authorization, questionable backup integrity, unexplained permission changes, signs of compromise, or a restore that would overwrite unpreserved evidence.

**Fallback:** Continue the separately approved minimum business process or escalate the outage. Do not invent a replacement system during the incident and assume it preserves confidentiality or records obligations.

## Other recovery cards to complete internally

| Service | Capability to demonstrate | Key limitation to resolve |
|---|---|---|
| Identity and emergency access | Authorized responder can access the required administration path | Emergency access depends on platform availability and tested configuration |
| Business communications | Users can send, receive, and retain required records | Alternate channels may have different retention and approval controls |
| Office connectivity | Approved devices regain connectivity with security controls intact | Redundant equipment or a second circuit needs tested failover |
| Business application | Owner can complete the critical transaction or reporting step | Provider resilience, data export, and application recovery are different capabilities |

## Verification record

Record incident or exercise ID, scope, operator, approver, target RTO/RPO, start time, usable-service time, recovered-data time, measured interruption, data gap, evidence references, business acceptance, and unresolved issues. Use time zones consistently.

A vendor status page, backup completion, and successful administrator login each establish different facts. None alone proves end-to-end recovery.

Review after material service changes and every exercise. Use the [recovery exercise example](../recovery-exercise-example.md) for a bounded rehearsal and the [risk assessment](../cyber-risk/risk-assessment-and-treatment.md) for unresolved gaps.
