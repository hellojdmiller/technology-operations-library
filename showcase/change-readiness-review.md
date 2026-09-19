# Review a change packet before scheduling work

**Private review · local evaluator verified · n8n runtime trial pending.** [Canonical workflow](../n8n/change-readiness-review/README.md) · [Evaluator](../n8n/change-readiness-review/evaluate.js) · [Import file](../n8n/change-readiness-review/workflow.json)

## The problem and the intended user

A coordinator needs to see which change requests have missing evidence or require a decision. A completed checklist cannot approve a deployment on its own. This example is for IT operators and automation builders connecting intake data to a human review process.

The fictional packet contains three requests: a normal change with complete metadata, a standard change whose model is expired and does not match, and an emergency without pilot evidence. Every decision remains pending human review.

## Run the local demonstration

From the repository root, with Node.js, paste this complete block into zsh or bash:

```sh
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs';
const base = 'n8n/change-readiness-review/';
const packets = JSON.parse(readFileSync(`${base}sample-input.json`, 'utf8'));
const code = readFileSync(`${base}evaluate.js`, 'utf8');
const result = new Function('$input', code)({
  all: () => packets.map(json => ({ json })),
});
console.log(JSON.stringify(result, null, 2));
NODE

node --test tests/*.test.mjs
```

The small wrapper runs this repository's reviewed Code-node source against its fictional fixture using the same input shape as the local tests. It is not an n8n runtime. Do not substitute arbitrary downloaded code into this wrapper. No packages, credentials, or network calls are needed.

## What to expect

The observed packet result has `status: "needs_review"`, `totalRows: 3`, and `attentionCount: 2`.

| Request | Observed status | Findings |
|---|---|---|
| `EX-CHG-001` | `packet_complete_for_review` | No detected metadata gaps |
| `EX-CHG-002` | `needs_review` | `standard_model_not_matched`, `standard_model_expired` |
| `EX-CHG-003` | `manual_emergency_review` | `pilotEvidenceRef_missing`, `manual_emergency_review` |

Every row has `decision: "pending_human_review"`. An empty packet-level `issues` array does not clear the row-level findings. The evaluator returns findings as data; a successful execution is not a successful change.

## Inspect and try the platform separately

Read the [fixture](../n8n/change-readiness-review/sample-input.json) alongside its result. The `fixture://` pointers are fictional labels, not fetched evidence. Inspect the exported graph: it contains a manual trigger, sample-data Code node, and evaluation Code node, with no deployment or notification action.

For an n8n trial, follow the [canonical import instructions](../n8n/README.md#import-and-try) in an authorized test workspace. Import the linked JSON, run the unchanged fixture manually, and compare the final node's output with the table above. Record the installed n8n version, workflow revision, and actual result. Keep the workflow inactive.

Then remove an authorization pointer, replace a boolean with text, and route an otherwise complete request as emergency, one case at a time. Compare results with the [failure exercises](../n8n/change-readiness-review/README.md#failure-exercises). Do not fabricate evidence to clear a result.

## Validation and limits

On September 18, 2026, Node.js v26.7.0 passed **67 local tests across all ten workflow examples**, including evaluator behavior and generated graph/source consistency. The local change demo produced the results above. This count is the collection's suite, not 67 tests of this workflow alone.

Import and execution in an identified n8n version remain unverified. Evidence contents, actual authorization, source completeness, scheduling conflicts, collectors, and production actions are outside this evaluator. Use the [change-management pack](../operations/packs/change-management/README.md) for the separate recommendation, approval, execution, and verification process.

[Choose another example](README.md).
