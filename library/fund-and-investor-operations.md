# Technology support for fund and investor operations

The useful starting point is the workflow between people and systems. A correct application configuration does not by itself ensure that the right investor receives the right document or that a changed payment instruction is independently verified.

This guide addresses technology ownership and control design. Finance, fund administration, Legal, and Compliance determine the actual transaction, reporting, and records requirements.

## Map a sensitive workflow end to end

For an investor-reporting cycle, identify the authoritative inputs, preparer, reviewer, approved final version, recipient source, delivery method, access expiry, and evidence of completion. Record which party owns each stage when an external fund administrator or portal provider is involved.

Make version transitions explicit. A working spreadsheet, an approved report, and the copy distributed to recipients may be different artifacts. Keep enough evidence to reconstruct what was approved and delivered without spreading the underlying sensitive data through support tickets.

## Control the recipient boundary

Verify how investor contacts and entitlements are established and changed. A contact's presence in a CRM does not necessarily authorize access to every fund or entity. Test access with synthetic recipients that should and should not see a sample document.

For external sharing, define who can approve a recipient, how access expires, how changes are reconciled, and who investigates a delivery error. Apply the [data handling policy](../documentation/policies/data-classification-and-handling.md).

## Separate payment authority from technology support

IT may maintain secure accounts, logging, access controls, and workflow tooling. The finance owner controls transaction approval. Define independent verification for changes to sensitive instructions through an established channel; do not let a help-desk request or an AI-generated message serve as transaction authorization.

Document how a suspected account compromise, unavailable approver, or failed integration pauses the workflow. Avoid informal bypasses during a deadline.

## Prepare for deadline-sensitive failure

Ask what happens if sign-in, the reporting workspace, a provider, or a key reviewer is unavailable during the reporting window. Define the minimum approved process and how work will be reconciled afterward. Keep protected copies or exports only where their confidentiality, currency, and access are controlled.

Use the [BCP](../documentation/continuity/business-continuity-plan.md) to establish targets and the [recovery playbook](../documentation/continuity/disaster-recovery-playbook.md) to prove the technical path.

## Acceptance exercise

Use a synthetic reporting pack and fictional recipients. Demonstrate source-to-final version control, independent review, correct recipient access, denied access, delivery failure handling, and reconciliation after an interruption. Record what was tested and which provider dependencies remain unverified.

The [investor-reporting operating pack](../operations/packs/investor-reporting/README.md) provides the SOP, blank decision record, and exercise. Its [offline reconciliation sample](../work-samples/investor-reporting-reconciliation/README.md) compares nine fictional expected deliveries with ten attempts and supplied observations. Use it to inspect unresolved evidence and retry history; actual access and delivery still need independent verification.

Do not use real investor records in a training library. Store actual procedures and evidence in the firm's restricted system.
