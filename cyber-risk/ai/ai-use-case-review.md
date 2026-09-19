# Review an AI use case before connecting it to firm work

> Proposed operating guidance and fictional examples for technology operations. No provider, product, or use case has been approved or tested by this document. Source review: September 17, 2026.

Start with the work the firm wants to improve. “Use AI” is not a sufficiently bounded request. “Draft a weekly summary of public vendor release notes, with links and a reviewer, without sending anything” is a use case that can be reviewed and tested.

Use the [AI use-case record](templates/ai-use-case-record.md) to capture a decision. Pair it with [agent and MCP controls](agent-and-mcp-controls.md) for connected tools and the [evaluation playbook](evaluation-playbook.md) for evidence. The [prompting guide](../../prompting/README.md) helps structure tasks; prompt wording does not create a permission boundary.

## Apply the existing data policy first

The repository’s [AI acceptable-use policy](../../documentation/policies/ai-acceptable-use.md) permits Public or fictional material in an approved workspace, permits Internal material only when explicitly within the approved scope, and **prohibits Confidential material**. A use-case approval, vendor assurance, training opt-out, or exception form cannot override that prohibition. Allowing Confidential data requires an approved revision of both that policy and its companion [data handling policy](../../documentation/policies/data-classification-and-handling.md) before use.

Apply the boundary to prompts, screenshots, recordings, attachments, retrieved documents, connector previews, indexes, tool results, logs, and outputs. Sanitizing a document after uploading it does not undo the initial disclosure. Do not relabel Confidential material as Internal because a proposed tool would be useful. When classification is uncertain, resolve it with the data owner or use reviewed synthetic material.

## Define the smallest useful scope

| Proposed use | Starting scope | Decision that remains outside the workflow |
|---|---|---|
| Public vendor research | Summarize dated official product documentation; identify unsupported claims and licensing questions | Procurement approval, contractual interpretation, purchase |
| Operating runbook drafting | Work from approved Internal notes or synthetic procedures; leave missing prerequisites visible | Executing changes or asserting a restore was verified |
| Service reporting | Prepare a draft from explicitly approved observations with their times and owners | Declaring an outage resolved or sending the report |
| Public market-source digest | Organize public facts with source links and contradictory evidence | Investment selection, recommendations treated as decisions, trading, or execution |
| Meeting-note assistance | Begin with a fictional transcript; determine classification before proposing real input | Processing Confidential deal or investor material under the current policy |

These are proposed boundaries, not an approved-tool list. Do not automate investment or personnel decisions through these examples. The responsible people retain decision authority, and the workflow should not produce a ranking or action that quietly substitutes for that authority.

Write the allowed output and prohibited effects in plain terms. Identify whether the workflow merely drafts text, reads a bounded collection, writes a draft into a test system, or can create an external effect. Review each capability separately; an approved summarizer does not inherit permission to send mail or change CRM records.

## Review the whole data path

Draw a simple path from source to model to destination, including intermediary services. A provider name alone hides too much. Record each place content can be read, stored, transformed, copied, or acted upon.

| Review question | Evidence to obtain | Owner |
|---|---|---|
| Which exact product, account type, workspace, model, and feature are in scope? | Product record, relevant contract/order, settings snapshot, feature inventory | Technical owner |
| What data reaches each service, including retrieval and diagnostics? | Field-level flow diagram and synthetic trace | Technical owner + data owner |
| Can inputs, outputs, feedback, or logs be used for training or service improvement? | Applicable terms and account settings, with document date and unresolved differences | Procurement / Legal + technical reviewer |
| Who else handles the content? | Current subprocessor and hosting information; connector/MCP operator inventory | Vendor owner |
| What remains after the user deletes a chat or file? | Separate retention/deletion answers for history, files, indexes, operational logs, backups, and support records | Data owner + vendor owner |
| Who can access content or change settings? | Role model, support-access process, sharing configuration, audit capability | Identity/security owner |
| Can the firm stop, export, and exit? | Tested stop procedure, export sample, dependency and ownership record | Service owner |
| Which contractual or records requirements apply? | Decision by the appropriate internal owner; no invented legal conclusion | Legal / Compliance |

Treat “not used for training,” “zero retention,” “enterprise,” and “encrypted” as separate claims with a defined scope. None alone answers every row. When evidence is missing, narrow the pilot to synthetic data and record the missing check rather than marking it passed.

NIST’s voluntary AI RMF organizes risk management around Govern, Map, Measure, and Manage. Those functions help keep ownership, context, evaluation, and continuing operation connected; they are not a certification or a mandatory checklist. [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/).

## Describe risks as scenarios

“Hallucination risk” is too vague to assign. Describe the event, consequence, relevant control, and evidence still needed.

| Fictional scenario | Proposed treatment | Evidence before relying on it |
|---|---|---|
| The research draft invents a product’s retention guarantee | Require the claim’s exact supporting source and applicable plan; keep uncertainty visible | Reviewer checks material claims against current source passages |
| A connector retrieves material outside the approved collection | Limit authorization and retrieval scope in the source system and application | Negative access test plus source-system denial record |
| A retrieved page tells the assistant to send the report elsewhere | Separate untrusted content from instructions; remove send capability and constrain destinations | Tool-call and destination logs identify attempts and show that unauthorized effects are denied |
| A changed skill asks for broader file access | Review source/version, instructions, executable content, and permissions before enabling the update | Reviewed difference, integrity record, repeated boundary tests |
| An agent repeatedly retries a failed write | Cap attempts and reconcile destination state before retry | Duplicate-event fixture and final state comparison |

The NIST Generative AI Profile addresses risks including confabulation, data privacy, information security, and third-party component integration. It also recommends checking sources and citations and avoiding broad capability conclusions from narrow tests. Our review and tests apply those ideas to small-firm operations; they are not NIST-prescribed test thresholds. [NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

## Make a bounded launch decision

Use four possible outcomes: **declined**, **synthetic pilot only**, **approved within recorded scope**, or **paused pending evidence**. “Approved with conditions” should identify which conditions must be completed before launch, not imply that all conditions are optional follow-up.

The following are proposed launch gates for this library:

1. The use case fits the current data policy; product terms and the permitted data/action boundary are documented.
2. A business sponsor, technical operator, reviewer, incident owner, and backup are assigned. Unassigned roles remain a blocker for connected operation.
3. Retrieval, tool permissions, outputs, and destinations match the recorded scope. Connected systems enforce access independently of the model’s response.
4. The applicable evaluation cases have observed results, including negative cases, failure recovery, and stop behavior. Untested controls are not marked effective.
5. The reviewer can identify source support, uncertainty, and the proposed action from the output. There is enough review capacity at the intended volume.
6. The stop method, evidence location, fallback procedure, and review trigger are usable by the backup operator.

A passed synthetic pilot supports a next decision only within its tested conditions. It does not establish confidentiality guarantees, comprehensive prompt-injection resistance, or readiness for a different model, connector, data class, or action.

## Monitor the operating arrangement

Agree on a review window, expected volume, error signals, cost limits, and sample-review method before launch. Stop the affected workflow for suspected unauthorized disclosure/access/action, unexpected destinations, changed permissions, missing audit evidence, or a disabled stop mechanism. Preserve the minimum needed evidence in the protected incident system and assign a responder; do not spread suspect payloads into general chat.

Reassess material changes to the model, prompts, retrieval corpus, skills, tool schemas, permissions, provider terms, retention, recipients, or action scope. Record the revised boundary and repeat affected tests. The [software approval procedure](../../documentation/procedures/software-request-and-approval.md) and [risk assessment example](../../documentation/cyber-risk/risk-assessment-and-treatment.md) provide the surrounding governance record.

## Source and version notes

As of the review date, NIST states that AI RMF 1.0 is being revised; this guide references the published 1.0 framework and 2024 Generative AI Profile rather than assuming a replacement is final. [NIST AI RMF status](https://www.nist.gov/itl/ai-risk-management-framework). Product-specific contractual conclusions and actual control effectiveness remain to be established for each use case.
