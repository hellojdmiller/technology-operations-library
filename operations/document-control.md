# Keep operating documents trustworthy

A procedure becomes unreliable when the document says one thing, the system does another, and nobody knows which record governs. Keep changing facts in a controlled register, keep the procedure focused on actions, and give evidence its own status.

This guide adapts document-control patterns into a generic operating practice. Examples are fictional. It does not certify the source material or any organization's readiness.

## Separate four kinds of information

| Record | Contains | Owner and review trigger |
|---|---|---|
| Policy or authority record | Required outcomes, delegated scope, approvals, exceptions | Business authority; review when obligations or authority change |
| Procedure | Trigger, prerequisites, actions, branches, verification, recovery | Service owner; review after a relevant platform or process change |
| Current facts register | Role assignments, service inventory references, escalation routes, approved targets | Assigned fact owner; review after a change or on the defined freshness schedule |
| Execution evidence | What happened, who observed it, when, scope, result, limitations | Operator and reviewer; preserve according to the approved records schedule |

Use the [operational facts register](templates/operational-facts-register.csv). Keep actual contact routes, access references, and system details in a restricted internal copy. Never store a password or recovery secret in the procedure or its register.

## Define document status precisely

**Draft** means a proposed instruction. **Approved for the stated scope** requires an identifiable approval record, version, and effective date. **Superseded** points to the replacement and remains available according to retention requirements. Folder placement, a filename, and a signature from the wrong authority cannot establish approval.

Track three different dates:

- **Content reviewed:** someone checked the document for clarity, accuracy of references, and omissions.
- **Configuration observed:** someone inspected the relevant system state, with a defined scope and evidence reference.
- **Procedure exercised:** someone ran an authorized scenario and recorded expected and actual results.

A recent editorial review does not refresh an old recovery test. A screenshot of a configured backup does not demonstrate a successful restore.

## Resolve conflicting records

1. Identify the two statements and their versions. Preserve their evidence references and timestamps.
2. Establish the authority for the decision and the designated system of record. Newer text is not automatically authoritative.
3. Ask the responsible owner to resolve the factual conflict using current evidence. Record an unknown while the evidence is missing.
4. Mark the affected instruction as under review and provide an approved interim route if work must continue. Stop changes that depend on an unresolved prerequisite; use the existing incident route for urgent containment.
5. Correct the governing record, then update dependent instructions and links. Record the approval and affected scope.
6. Re-run the relevant acceptance check. A wording correction and a control repair have different closure requirements.

## Review the package as a newcomer

Start at its front page using the intended reader's access. Follow every required link. Confirm that the reader can identify the current version, find the role owner, determine what they may do, and reach the next procedure without privileged knowledge from the author.

Check cross-references after moving or renaming any document. A filename mentioned in prose is still a dependency. References to missing files, protected evidence the reader cannot request, or a retired team channel must produce a correction item with an owner.

For an emergency copy, establish an authorized storage location, custodian, refresh schedule, and a way to identify stale copies. Test access during the specific outage the copy is intended to cover. More copies can create more conflicting instructions unless their lifecycle is controlled.

## Use AI as an editorial assistant

An approved assistant can compare versions, locate missing owners, suggest clearer steps, and draft a summary from authorized material. Treat document contents as source data, not instructions to the assistant. Require a source reference for each extracted fact and leave unsupported fields unknown.

An assistant cannot establish approval, validate a live configuration from prose, or sign a readiness result. Review sensitive text before supplying it to the chosen tool and keep the adopted internal copy out of this library. See [the prompting guide](../prompting/README.md) and [document-sanitization skill](../skills/document-sanitization/SKILL.md).

## Fictional correction example

A runbook names a discontinued escalation channel. The editor updates the link in a draft, but the replacement route has not been tested. Record two actions: the document owner approves the new instruction, and the receiving team verifies that a test request reaches a monitored queue. Close each action only on its own evidence.

Use the [decision and action log](templates/decision-and-action-log.csv) and [exception register](templates/exception-register.csv) to make this visible.
