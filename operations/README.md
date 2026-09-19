# IT operations and service desk

Practical procedures for running an organization's service desk, managing employee and software requests, and handing the IT function to another operator. Start with the situation you need to handle, then use the linked working records.

These are newly written generic derivatives of authorized operating material, supplemented by original guidance and current vendor references. They use fictional circumstances. They are proposed resources for private review, not approved policies, completed exercises, or statements about a particular organization.

## Choose an entry point

| Situation | Start here | Result to work toward |
|---|---|---|
| A system or service needs to change | [Change-management pack](packs/change-management/README.md) | A scoped decision, controlled implementation, recovery plan, and verified outcome |
| Equipment needs to be received, assigned, returned, or retired | [Asset-lifecycle pack](packs/asset-lifecycle/README.md) | Reconciled custody and management evidence with separate disposition authority |
| Vulnerabilities or updates need action | [Patching pack](packs/patching/README.md) | Locally prioritized remediation, staged rollout, verified results, and visible exceptions |
| Investor-report distribution needs to be reconciled | [Investor-reporting pack](packs/investor-reporting/README.md) | Exact versions and recipients, preserved attempt history, and separately reviewed completion evidence |
| A new employee or contractor needs to start | [Employee onboarding](sops/employee-onboarding.md) | Approved access and equipment, verified before the person needs them |
| Someone is leaving | [Employee offboarding](sops/employee-offboarding.md) | Timely access removal, protected information, and tracked residual work |
| Someone needs software or broader application access | [Software request fulfillment](sops/software-request-fulfillment.md) | An explicit decision, controlled delivery, and a verified user outcome |
| Requests are arriving without clear ownership | [Ticket intake and triage](sops/ticket-intake-and-triage.md) | A protected case with justified priority, owner, and next action |
| A ticket needs another team or provider | [Ticket escalation](sops/ticket-escalation.md) | An accepted task, preserved history, and continuing internal coordination |
| Support expectations are unclear | [Service-level management](service-level-management.md) | Measurable response, update, and restoration goals tied to actual coverage |
| Ticket closure is hiding unfinished work | [Service-desk quality review](service-desk-quality-review.md) | Evidence-based case review and owned improvement actions |
| The primary operator is unexpectedly unavailable | [Emergency start here](succession/emergency-start-here.md) | Establish coverage, authority, service status, and next actions |
| A departure or provider transition is planned | [Planned handover](succession/planned-handover.md) | Separate delivery, acknowledged ownership, and demonstrated operation |
| Nobody is sure who can decide or instruct a provider | [Ownership and escalation](succession/ownership-and-escalation.md) | A current authority record and a usable escalation route |
| Administrative recovery depends on one person | [Emergency access readiness](succession/emergency-access-readiness.md) | An authorized, independent recovery path with test evidence |
| The package looks complete but has not been exercised | [Readiness exercise](succession/readiness-exercise.md) | Record what a receiving operator can actually demonstrate |
| Routine work is drifting | [Operating cadence](operating-cadence.md) | A review schedule that produces owners, decisions, and evidence |
| Documents disagree or links have gone stale | [Document control](document-control.md) | Current instructions with explicit status and trustworthy references |
| A procedure needs to be written or improved | [SOP writing guide](sop-writing-guide.md) | Clear actions, expected results, failure handling, and closure |

## Technical and lifecycle companion procedures

| Procedure | Use it for |
|---|---|
| [Joiner, mover, and leaver](sops/joiner-mover-leaver.md) | Coordinate people changes, service access, preservation, and ownership |
| [Security alert triage](sops/security-alert-triage.md) | Establish impact and evidence; route authorized containment and closure |
| [Application alert review](sops/application-alert-review.md) | Assess an app's actual use, permissions, owner, and response |
| [Mailbox and calendar access](sops/mailbox-calendar-access.md) | Grant the approved scope, verify it, and remove it when its purpose ends |
| [Network triage](sops/network-triage.md) | Isolate the affected service and hand over a useful evidence package |
| [Device escalation to a vendor](sops/device-vendor-escalation.md) | Escalate with evidence, coordinate the repair, and verify the outcome |
| [Request pipeline recovery](sops/request-pipeline-recovery.md) | Reconcile interrupted work and avoid duplicate or unauthorized replay |

The existing [software approval](../documentation/procedures/software-request-and-approval.md), [lost device](../documentation/procedures/lost-device-response.md), [incident record](../documentation/cyber-risk/incident-response-record.md), and [disaster recovery](../documentation/continuity/disaster-recovery-playbook.md) examples remain companion procedures.

## Complete operating packs

Each pack combines a decision guide, detailed SOP, blank working record, fictional cases, an exercise with an answer key, and a read-only review tool. The change, asset, and patching packs use CSV records and n8n flows; the investor-reporting pack uses a Markdown decision record and an offline CLI.

| Pack | Main decisions | Review automation |
|---|---|---|
| [Change management](packs/change-management/README.md) | Exact standard-model match, normal/emergency authority, rollout, stop, recovery, and verification | [Change readiness](../n8n/change-readiness-review/README.md) |
| [Asset lifecycle](packs/asset-lifecycle/README.md) | Acquisition, custody, inventory reconciliation, return, holds, sanitization, and disposition | [Asset reconciliation](../n8n/asset-reconciliation-review/README.md) |
| [Patching and remediation](packs/patching/README.md) | Applicability, exposure, local target, pilot/rings, failed updates, and exceptions | [Patch exceptions](../n8n/patch-exception-review/README.md) |
| [Investor reporting](packs/investor-reporting/README.md) | Approved versions, recipient entitlements, interrupted batches, uncertain retries, and completion evidence | [Offline reconciliation](../work-samples/investor-reporting-reconciliation/README.md) |

Exercises use fictional facts; the automations review supplied metadata only. Neither a worked answer nor a clear metadata result is an actual approval or proof of completed work.

## Working records

The [service-desk checklist pack](checklists/README.md) adds six CSVs for onboarding, offboarding, software requests, ticket handoffs, proposed service targets, and worked timing cases. The examples are unexecuted; the timing cases are synthetic arithmetic fixtures.

The [succession template pack](templates/README.md) explains five CSVs: handover register, readiness tests, current operational facts, decisions and actions, and exceptions. Example rows are synthetic and pending or not run. Populate protected internal copies with actual identities and evidence.

Keep a procedure separate from the changing contact, inventory, and authority records it depends on. Keep evidence separate from the claim it supports. Receipt of documentation, acceptance of responsibility, and a successful operating test each need their own recorded result.

## Adopt a small slice first

1. Choose one repeatable request or critical service. Identify its owner, backup, business approver, and provider; define the supported outcome and hours.
2. Populate the required facts and evidence references in a protected copy. Resolve authority and access prerequisites.
3. Use a fictional tabletop to identify missing instructions, then plan an appropriately authorized isolated test.
4. Record expected and actual results separately. Assign every unresolved dependency and exception.
5. Approve the adopted version and its scope; set review triggers and a retest schedule. Review a small case sample with the [quality guide](service-desk-quality-review.md) before expanding.

The collection contains 22 standalone guides and procedures, four complete operating packs, and 17 CSV working aids across those packs and the service-desk/succession records, plus the investor-reporting Markdown decision record. Sample service targets require local staffing and agreement; they are not contractual promises.

The [vendor training modules](../training/README.md), [Technology operations field guide](../library/README.md), [cyber-risk pack](../cyber-risk/README.md), and [prompting guide](../prompting/README.md) provide supporting paths. Drafting help from an assistant does not supply missing approval or operational evidence.

## Adaptation and review boundaries

Original documents, comments, embedded objects, extracted source text, source locations, and the private source mapping are excluded from this repository. The derivatives omit employer and personal identities, real contact routes, infrastructure inventories, incident narratives, commercial terms, and historical approval claims. Read the [adaptation guide](../documentation/ADAPTATION.md) before creating an internal copy or considering external publication.

Content review and local file checks do not demonstrate live control effectiveness. No exercise in this collection has been run against a real environment. The repository remains private.
