# n8n workflows

Ten practical examples to test before connecting a workflow to real systems. They prepare review outputs from supplied evidence and fictional data.

| Workflow | Input | Output |
|---|---|---|
| [Change readiness review](change-readiness-review/README.md) | Scoped change assertions and plan references | Missing metadata, expired standard models, and mandatory manual emergency review |
| [Asset reconciliation review](asset-reconciliation-review/README.md) | Inventory plus separately dated management and custody observations | Missing/unexpected assets, stale evidence, and custodian conflicts |
| [Patch and exception review](patch-exception-review/README.md) | Applicability, observations, local targets, and exception records | Unresolved remediation, overdue targets, and unsupported or expired exceptions |
| [Automation result review](automation-result-review/README.md) | Expected and observed record IDs, plus an evidence reference | Missing, unexpected, or duplicate IDs and a review status |
| [Operations brief](operations-brief/README.md) | Service observations with status, owner, and evidence reference | A draft brief with exceptions and unknowns visible |
| [Access review preparation](access-review-preparation/README.md) | Workforce snapshot and human application grants | Leaver, privileged, dormant, unknown, and ownerless grants for human decisions |
| [Vendor renewal triage](vendor-renewal-triage/README.md) | Contract register, notice periods, decisions, and delivery evidence | An ordered queue based on decision/notice deadlines |
| [Joiner, mover, and leaver review](joiner-mover-leaver-review/README.md) | Approved task catalog and lifecycle case evidence | Missing tasks, unsupported completion, and unresolved exceptions |
| [Backup evidence review](backup-evidence-review/README.md) | Workload objectives, recovery points, and restore-test measurements | Stale data protection, missing tests, and RPO/RTO gaps |
| [SaaS license reconciliation](saas-license-reconciliation/README.md) | Purchased seats, assignments, workforce, and usage | Capacity mismatches and human review candidates |

Each folder contains a `workflow.json` import, readable `evaluate.js`, and `sample-input.json`. The JSON includes a manual trigger and a sample-data node, so no credentials are needed to try it.

## Import and try

1. In an n8n workspace, create a workflow and choose **Import from File** from the workflow menu.
2. Select the example’s `workflow.json`.
3. Execute the workflow manually. Inspect the final node’s output against its README.
4. Change the sample-data node to exercise the failure cases before replacing it with real input.

These examples use Manual Trigger version 1 and Code version 2, with **Run Once for All Items** selected. They have no schedule, webhook, credentials, or external action. A completed n8n execution only means the nodes ran; inspect the returned review status to understand the result.

Local tests exercise the JavaScript, input handling, and exported graph. The [pinned runtime lab](../labs/n8n-runtime/README.md) additionally passed 32 CLI import/execution cases across all ten examples on n8n 2.39.8. Its report records source hashes and the exact image. Editor/UI import, other n8n versions, real collectors, and production integrations need their own trials. Record those observations separately in [VALIDATION.md](../VALIDATION.md).

## Review packets and results

The eight operational reviews take one item per review packet, with nested arrays defined in each README. An explicit `asOf` makes results reproducible; the fixture dates are illustrative and do not silently advance to today. Stable IDs are compared exactly. Unknowns must remain unknown rather than becoming success, zero, or an empty source.

The sample-data node always emits a packet, including when a nested array is empty. If a real collector emits zero n8n items, the next node may not execute; ensure the mapping step still emits a packet with the expected arrays and `snapshotComplete: false` (or `registerComplete: false`). Do not infer completeness from a successful HTTP response or a successful workflow execution.

`invalid_input`, `needs_review`, and `review_ready` are returned as data. They do not throw execution errors. If adding a downstream process, branch explicitly on status; operational findings and technical execution failures need separate handling. The two original examples retain their own documented statuses.

Evidence references are pointers, not fetched or verified by these workflows. The fixture references begin with `fixture://` and refer to no real system. No sample is an approved control or a complete operational standard.

## Integration sequence

1. Import and run the unchanged fixture in a test workspace, then compare the documented results.
2. Run the failure exercises and record the installed n8n version and observations.
3. Add read-only collection, pagination, source timestamps, stable ID mapping, and scope reconciliation. Configure credentials through n8n, never in workflow JSON.
4. Review execution-data access and retention before using workforce, access, vendor, or recovery evidence. Keep source data and generated reports out of this repository.
5. Add technical failure handling and an explicit internal review destination. Test unavailable sources, partial pages, stale observations, retries, and duplicate delivery.
6. Add scheduling or approved changes only after someone owns operation, exceptions, and independent verification. These exports include neither.

To regenerate the exports and run the local checks from the repository root:

```sh
node scripts/build-workflows.mjs
node --test tests/*.test.mjs
```

References checked 2026-09-17: [import/export](https://docs.n8n.io/build/manage-workflows/export-and-import), [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), [Manual Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualworkflowtrigger/), [error handling](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully).
