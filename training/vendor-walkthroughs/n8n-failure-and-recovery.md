# Recover an n8n example without confusing failure states

**Task card:** 8 of 8 · **Suggested practice:** 30 minutes, excluding vendor study/setup · **Mode:** tabletop; optional isolated local evaluator.

**Research reviewed:** September 19, 2026. Original, unexecuted task card. Complete [import and result review](n8n-import-and-result.md) first; the [n8n operator module](../n8n-workflow-operator.md) supplies the full exercise boundaries.

## Watch or read

Use the official [N8N102 Integrations](https://learn.n8n.io/courses/course-v1:n8n%2BN8N102%2B2026H2/about) and [N8N103 In Practice](https://learn.n8n.io/courses/course-v1:n8n%2BN8N103%2B2026H2/about) outlines, edition **2026H2**, for error handling, debugging and maintenance topics. Their publication dates were not displayed. The public outlines were reviewed; enrolled lessons, videos, captions and transcripts were not inspected. No exact video chapter is claimed.

Reading alternative: the [local evaluator](../../n8n/automation-result-review/evaluate.js), its [contract](../../n8n/automation-result-review/README.md), and the official error-handling/Error Trigger references in the parent module. The [education portal](https://n8n.io/education/) describes free courses; N8N103's AI section requires a provider API key. Our exercise uses no AI provider, webhook, scheduled trigger or external account. Optional editor access/setup must already exist in an isolated instance.

## Predict before studying

Which needs code recovery: an evaluator returning `invalid_input`, or a node throwing an exception? Can a successful retry prove that an earlier external action did not happen?

## Practice: separate four failure states

All entries are fictional. Start from the previous card's known fixture and record its repository revision.

| Case | Supplied condition | Expected interpretation |
|---|---|---|
| A | Replace `observedIds` array with a string | Contract-invalid input; evaluator can return `invalid_input` without a runtime exception |
| B | In a disposable copy only, replace evaluator code with `throw new Error('Synthetic lab failure');` | Runtime failure at the evaluator |
| C | Restore the original evaluator and included fixture from the recorded revision | Engine can complete while business result remains `needs_review` |
| D: paper only | A hypothetical connected ticket action times out after submission | External result unknown; this local evaluator cannot establish whether a ticket exists |

1. For A–C, write the expected engine state, returned status if any, evidence and recovery action before attempting the optional lab.
2. If isolated editor access is available, create a disposable copy for B; do not modify the repository export or a connected workflow. Record the failing node and sanitized error, restore the recorded evaluator, then compare the recovered result with the original fixture contract.
3. Treat D only as a design exercise. Identify an authoritative destination query, stable operation reference, duplicate-prevention design and escalation owner that would be needed before a real retry. None is implemented by this example.
4. Hand your record to another learner. Ask them to reproduce C or explain why prerequisites prevent it, without verbal coaching.

## Verify your answer

| Check | Answer guidance |
|---|---|
| A versus B | A is a handled input result; B is a runtime exception. Recording both as “automation failed” loses the diagnostic boundary. |
| C recovery | Restore known code and input, observe a completed evaluation, then confirm missing `record-002` and unexpected `record-004`. `needs_review` is correct for this fixture. |
| Automatic notification | A manual failure does not validate Error Trigger delivery. No automatic failing execution or notification is configured by this card. |
| D | Timeout is not proof of failure or success. Reconcile the destination before choosing a retry; retain unknown when it cannot be checked. |
| Handover | A second learner needs version, graph, input, expected output, failure detail, restored revision and final observation. Missing setup becomes an explicit documentation gap. |

## Teach back and transfer

Explain engine success, business acceptance and external completion separately. Then the restored code is correct but the fixture has changed: explain why the previous expected output cannot be reused without checking the input.

Use the [training record](../training-record-template.md). Revisit when execution modes, error behavior, source revisions or downstream effects change. Existing [CLI runtime evidence](../../labs/n8n-runtime/README.md) covers its stated cases only; this lesson supplies no new editor, notification or learning result.
