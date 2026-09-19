# Import an n8n example and explain its actual result

**Task card:** 7 of 8 · **Suggested practice:** 30 minutes, excluding vendor study/setup · **Mode:** tabletop; optional isolated n8n editor.

**Research reviewed:** September 19, 2026. This task card has not been executed. The underlying example has separate [n8n 2.39.8 CLI evidence](../../labs/n8n-runtime/README.md); that does not establish editor import or learner performance.

## Watch or read

Start at the official [n8n education portal](https://n8n.io/education/) and [N8N101 Essentials, 2026H2](https://learn.n8n.io/courses/course-v1:n8n%2BN8N101%2B2026H2/about). The public outline covers canvas, nodes, execution and data flow. It was inspected; enrolled lessons, video playback, captions and transcripts were not. Publication date was not displayed.

For an optional video introduction, n8n's [Introduction to Automation](https://www.youtube.com/watch?v=4BVTkqbn_tY) is dated June 19, 2024. Treat it as older conceptual material, not current editor instructions. Reading alternative: current [export/import documentation](https://docs.n8n.io/build/manage-workflows/export-and-import.md) and the example's [input/output contract](../../n8n/automation-result-review/README.md).

The Academy describes its courses as free. Its own exercises require an instance and describe public reachability; our local-only evaluator requires neither a public webhook nor external credentials. An Academy enrollment or n8n Cloud trial is not needed to read this card. If your isolated instance requires owner setup or other unavailable access, record the editor exercise as **not attempted**; use the tabletop rather than an unrelated live instance.

## Predict before studying

Can three expected records and three observed records still produce a failed acceptance review?

## Practice with the existing fictional fixture

Open the example's [workflow JSON](../../n8n/automation-result-review/workflow.json), [sample input](../../n8n/automation-result-review/sample-input.json), and [readable evaluator](../../n8n/automation-result-review/evaluate.js). Supply one item per run.

| Case | Expected IDs | Observed IDs | Evidence reference |
|---|---|---|---|
| A | 001, 002, 003 | 001, 003, 004 | Present |
| B | 001, 002 | 002, 001 | Present |
| C | 001, 002 | 001, 002, 002 | Present |
| D | Empty array | Empty array | Present |

Use full `record-001` style IDs in the actual input, retain a nonblank run ID, and use only the existing fictional evidence reference. The evaluator does not retrieve that reference.

1. Draw the graph before importing. Confirm the connected manual trigger, fixture and evaluator nodes; inspect code, credentials and possible external actions. A manual trigger alone does not make arbitrary JSON safe.
2. Tabletop: calculate each expected result and exact discrepancy. Optional isolated editor: use **Import from File**, inspect the imported graph, retain manual execution, and record version and import result before running anything.
3. Run A–D only if the isolated editor is available. Change synthetic inputs only. Record engine execution status separately from the returned business status. Restore the original fixture afterward.

## Verify your answer

| Case | Expected evaluator result |
|---|---|
| A | `needs_review`: missing `record-002`, unexpected `record-004`; equal counts hide different identities. |
| B | `matched`: supplied nonempty ID sets agree without duplicates and have an evidence reference. Field values and permissions remain unverified. |
| C | `needs_review`: duplicate observed `record-002`. |
| D | `needs_review`: empty expected scope is unresolved, not automatic success. |

## Teach back and transfer

Explain why `matched` is not migration acceptance. Then remove B's evidence reference and predict the result: it becomes `needs_review` even though the IDs agree.

Record study, import, execution and reasoning separately using the [training record](../training-record-template.md). Continue to [failure and recovery](n8n-failure-and-recovery.md) and the full [operator module](../n8n-workflow-operator.md). Revisit after n8n version, node, import or contract changes. No connected service or scheduled workflow is part of this card.
