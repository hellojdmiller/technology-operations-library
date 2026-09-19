# Automation result review

Compare an intended set of record IDs with an observed set. This is a small component of an acceptance review, useful after a migration or automation run.

Related reading: [When an AI task is actually finished](https://hellojdmiller.com/articles/when-an-ai-task-is-actually-finished) and [What to verify before a CRM migration is complete](https://hellojdmiller.com/articles/what-to-verify-before-a-crm-migration-is-complete).

## Try it

Follow the [import instructions](../README.md), using [workflow.json](workflow.json). The included fictional example returns:

```json
{
  "status": "needs_review",
  "expectedCount": 3,
  "observedCount": 3,
  "missingIds": ["record-002"],
  "unexpectedIds": ["record-004"]
}
```

Equal totals can conceal different records. The output also contains duplicate lists, issue descriptions, and the supplied evidence reference.

## Input contract

Supply one n8n item per run. Each item needs `runId`, `expectedIds`, `observedIds`, and `evidenceRef`. IDs are nonblank strings, compared exactly, including case and whitespace. Use the same ID namespace on both sides; map destination IDs to source IDs upstream when necessary.

- `invalid_input`: the run ID or ID arrays are malformed.
- `needs_review`: scope is empty, evidence is missing, or there are missing, unexpected, or duplicate IDs.
- `matched`: the supplied nonempty ID sets match, contain no duplicates, and include an evidence reference.

The workflow treats an empty expected scope as unresolved, even if both arrays are empty. If no output is the intended result, record that explicitly in the surrounding acceptance process.

`matched` does not approve a migration or verify the referenced evidence. This example does not read a source system, fetch evidence, compare field values, test permissions, or confirm usable relationships. Replace the sample node with independently collected observations and keep those checks in the acceptance record.

## Before real use

Confirm the counting unit and ID mapping, then try missing IDs, duplicates, unexpected IDs, malformed values, and empty input. Review the example’s output locally before attaching a downstream action. No downstream action is included.

## Runtime evidence

On September 19, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8**. The [isolated runtime lab](../../labs/n8n-runtime/README.md) records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
