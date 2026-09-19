# n8n workflow operator: a successful run is only one observation

**Audience:** an operator who inherits automations or approves their results.

**Mode:** tabletop or an isolated n8n instance with synthetic data.

**Source review:** September 17, 2026. The lesson has not been executed in an n8n runtime.

The task cards [Import an n8n example](vendor-walkthroughs/n8n-import-and-result.md) and [Recover an n8n example](vendor-walkthroughs/n8n-failure-and-recovery.md) connect current vendor learning to the synthetic examples below. Keep their study and practice records separate from the repository's existing CLI runtime evidence.

## What you will learn

- Inspect an imported workflow before running it.
- Compare expected records with observed records rather than relying on totals.
- Separate a business exception from a runtime failure.
- Capture version, inputs, results, and recovery evidence for another operator.

## Prerequisites

Use the [training record](training-record-template.md) and the repository’s [automation result review](../n8n/automation-result-review/README.md). For hands-on work, use a separate n8n workspace or instance without production credentials. Record the n8n version, hosting model, and available plan features. The basic exercise uses Manual Trigger and Code nodes; it does not require paid integrations, an AI model, external modules, a schedule, or a webhook. An installed n8n version must be verified against the import; local JavaScript tests are not that verification.

Before import, inspect the JSON and confirm that the only connected nodes are the manual trigger, synthetic input, and local evaluator. A manual trigger does not make arbitrary imported nodes safe. n8n warns that workflow exports can include credential names/IDs and authentication headers; inspect any imported or shared file. See [Export and import](https://docs.n8n.io/build/manage-workflows/export-and-import).

## Scenario

A fictional CRM migration expects three record IDs. Its completion email says “3 imported,” but the operator wants to know whether the same three records arrived. No migration service is connected in this lab.

| Test case | Expected IDs | Observed IDs | Expected review |
|---|---|---|---|
| Included fixture | `record-001, record-002, record-003` | `record-001, record-003, record-004` | `needs_review`; missing 002 and unexpected 004 |
| Matching set | `record-001, record-002` | `record-002, record-001` | `matched`, with a supplied evidence reference |
| Duplicate | `record-001, record-002` | `record-001, record-002, record-002` | `needs_review`; duplicate 002 |
| Empty scope | empty | empty | `needs_review` |
| Malformed | an array of IDs | a string instead of an array | `invalid_input` |

All identifiers and the fixture evidence reference are synthetic. The evaluator does not fetch the referenced evidence.

## Exercise

1. Read the workflow README, input contract, and readable evaluator. Draw the data path and list every possible external action; the expected list is empty. Compare the exported graph with that drawing.
2. In isolated n8n, use **Import from File** to import the example JSON. Inspect the Code nodes and their mode. These examples use **Run Once for All Items**; the distinction from per-item execution is explained in [Code node documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code).
3. Leave the workflow unpublished and execute it manually. Record both the engine execution status and the returned business status. The included fixture should complete its computation while returning `needs_review`.
4. Change only the synthetic input and run every row of the test table. Preserve a nonblank run ID and evidence reference except when deliberately testing those inputs. Record exact differences, duplicates, issue descriptions, and whether the workflow ran.
5. Remove the evidence reference from a matching set. Explain why identity agreement is now insufficient for this example’s acceptance check. Restore the original sample before ending the session.
6. Have a second operator reproduce one test without verbal coaching using your record. Missing setup detail becomes a documentation defect to correct.

## Failure and recovery exercise

Create a separate copy of the lab workflow, and make its evaluator throw a deliberate error such as `throw new Error('Synthetic lab failure');`. Run it manually, identify the failing node, and capture the error without private payloads. Restore the original evaluator from the repository, run the included fixture again, and verify its expected `needs_review` output.

An error workflow is a separate topic. It begins with an Error Trigger and is assigned in workflow settings; see [Handle errors gracefully](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully). **A manual failure does not test Error Trigger delivery**: n8n documents that Error Trigger runs for automatic workflow failures, not manual executions. See [Error Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.errortrigger). Design that test on paper here; no schedule, public webhook, email, or chat delivery is added by this lesson.

Also explain why replaying a real workflow might duplicate an external side effect. Before adding such an action, define an idempotency key, authoritative completion check, retry boundary, and reconciliation method. Those are design requirements to test later, not features this evaluator provides.

## Expected evidence

Record the repository revision, n8n version, imported node graph, absence of credentials/actions, all five test cases, engine status versus returned status, deliberate failure, and recovered result. Label local-only or tabletop results accurately. n8n’s [execution types](https://docs.n8n.io/build/understand-workflows/understand-executions/types-of-executions) distinguish manual testing from automatic production execution; pinned test data also does not establish production behavior.

## Assessment and answer guide

| Question | Full-credit answer |
|---|---|
| 1. What establishes the safe execution boundary? **Scope criterion** | Inspect every connected node, credential, trigger, and action, and use an isolated environment with synthetic input. |
| 2. Why can three expected and three observed records still fail review? | The IDs can differ even when counts match; the included fixture is missing 002 and adds 004. |
| 3. Does `matched` verify field values or permissions? | No. It compares supplied IDs and requires a reference; it does not retrieve evidence or validate destination usability. |
| 4. How do you prove recovery after a runtime error? **Recovery criterion** | Restore the known evaluator and rerun a known fixture, then compare the actual output with its contract. |
| 5. Did the manual failure validate automatic error notification? | No. Error Trigger requires an automatic failing execution, and no notification was configured or sent in this lesson. |

## Limits

This does not test real credentials, API pagination, rate limits, publishing, automatic triggers, external notifications, retention, or idempotent writes. Use the [collection rubric](README.md) and the [automation handover record](../documentation/automation-handover-template.md) before proposing a connected pilot.
