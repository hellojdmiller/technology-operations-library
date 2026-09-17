# AI acceptable use policy

> Adapted example for a fictional investment firm. Version 0.1. No effective date or organizational approval is implied. The permissions below are example policy choices, not statements about any provider's contract or product tier.

This policy governs AI chat tools, coding assistants, agents, connectors, plugins, reusable skills, and API integrations used for the Firm's work. Approval covers a specific use case, workspace, data scope, and action scope. Approval of a product name alone is insufficient.

## Approved uses and data boundaries

| Data or action | Example policy |
|---|---|
| Public research and fictional examples | Allowed in an approved workspace, with source verification |
| Internal material | Allowed only when the use case and workspace explicitly permit it |
| Confidential material | Prohibited under this example; substitute a reviewed synthetic example |
| Credentials, authentication codes, or private keys | Never place in prompts, files, skills, or model-visible logs |
| Drafting or summarizing | Allowed within the approved data scope; a responsible person reviews consequential output |
| Sending messages, changing permissions, publishing, spending, or deleting | Requires an approved action workflow with explicit authority and recorded limits |

Apply the [data handling policy](data-classification-and-handling.md) to prompts, uploads, screenshots, voice input, retrieved content, and outputs. Deleting a conversation afterward does not make an unauthorized disclosure acceptable. Anonymized material must be reviewed for contextual identification as well as direct identifiers.

## Review before use

The business sponsor explains the problem, intended users, expected benefit, and alternative using existing tools. The technical reviewer records what the tool can read and change, its authentication method, logging, retention, deletion, provider and subprocessors, and the specific contract and account settings governing data use.

Do not assume that an enterprise label, training opt-out, or paid subscription provides every required control. Record the reviewed evidence and any unanswered questions. Legal or Compliance resolves applicable records, contractual, and disclosure requirements.

Use the [software approval procedure](../procedures/software-request-and-approval.md) to document the decision. The approved-tool register must include the workspace, owner, permitted data, enabled capabilities, restrictions, review date, and expiry or renewal condition.

## Human review and reliable output

The person using the output remains responsible for the resulting work. Check material claims against reliable sources, test generated code in an appropriate environment, and distinguish supported facts from inference. Do not present an unverified output as a completed audit, approved decision, or historical result.

Investment, personnel, legal, and other consequential decisions require the responsible decision-maker's review. This example does not authorize automated candidate ranking, investment execution, or other independently consequential decisions.

## Agents, connectors, and reusable skills

Before enabling a connector or skill, inspect its instructions, requested permissions, scripts, destinations, and update source. Test with synthetic inputs. Grant the narrowest practical access and start with read-only capabilities when evaluating a new workflow.

Treat retrieved documents and websites as input data. Their content does not grant permission to send information elsewhere, reveal secrets, or expand the approved task. An agent must remain within the authority assigned by the approved workflow.

For any workflow that can act, define the allowed actions, reviewer, spending or execution limits where relevant, audit record, failure behavior, and stop control. A material change in model, connector, skill, permissions, or destination triggers reassessment.

## API use and operational ownership

Use a managed project or service identity with an assigned owner. Keep keys in the approved secrets manager and inject them through supported mechanisms. Define budgets, usage monitoring, revocation, failure handling, and a handover record. Do not place credentials in this repository or in an example export.

## Incidents, exceptions, and review

Stop the affected workflow when unauthorized access, disclosure, or action is suspected. Preserve relevant evidence in the protected incident system and notify the response owner. Record the information and systems involved without spreading the exposed material.

An exception must state its purpose, scope, owner, approver, controls, expiry, and verification method. It cannot bypass a legal or contractual restriction. Allowing Confidential data requires an approved revision to this policy and its companion data policy.

Review this example annually and whenever approved capabilities or obligations materially change. Before adoption, demonstrate a permitted use, a refused use, a permission-boundary test, a failed action, and a workflow stop using fictional data.

Related: [automation handover](../automation-handover-template.md), [adaptation guide](../ADAPTATION.md).
