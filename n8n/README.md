# n8n workflows

Two small examples to test before connecting a workflow to real systems.

| Workflow | Input | Output |
|---|---|---|
| [Automation result review](automation-result-review/README.md) | Expected and observed record IDs, plus an evidence reference | Missing, unexpected, or duplicate IDs and a review status |
| [Operations brief](operations-brief/README.md) | Service observations with status, owner, and evidence reference | A draft brief with exceptions and unknowns visible |

Each folder contains a `workflow.json` import, readable `evaluate.js`, and `sample-input.json`. The JSON includes a manual trigger and a sample-data node, so no credentials are needed to try it.

## Import and try

1. In an n8n workspace, create a workflow and choose **Import from File** from the workflow menu.
2. Select the example’s `workflow.json`.
3. Execute the workflow manually. Inspect the final node’s output against its README.
4. Change the sample-data node to exercise the failure cases before replacing it with real input.

These examples use Manual Trigger version 1 and Code version 2, with **Run Once for All Items** selected. They have no schedule, webhook, credentials, or external action. A completed n8n execution only means the nodes ran; inspect the returned review status to understand the result.

Local tests exercise the JavaScript, input handling, and exported graph. They do not establish compatibility with an installed n8n version. Record the version and observed import/execution result in [VALIDATION.md](../VALIDATION.md) when tested.

References: [n8n import/export](https://docs.n8n.io/workflows/export-import/), [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/).
