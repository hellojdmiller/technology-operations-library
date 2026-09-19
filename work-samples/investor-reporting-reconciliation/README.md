# Offline investor-reporting reconciliation

A batch can be marked sent while a recipient received the wrong version, another recipient is missing, and a retry created a second delivery. This sample compares an independently supplied expected population with scoped version approvals, entitlements, send attempts, and completion observations. It produces a review queue while preserving each supplied claim.

This is a dependency-free **Node.js 22+** CLI and library. It reads one local JSON file and writes text or JSON to standard output. It performs no network calls, sends no documents or messages, makes no payments, opens no evidence references, and grants no authorization. All included records, IDs, evidence labels, and circumstances are fictional. This sample does not establish legal, investment, or regulatory compliance.

## Try the fictional example

From the repository root:

```sh
node work-samples/investor-reporting-reconciliation/reconcile.mjs \
  --input work-samples/investor-reporting-reconciliation/inventory.example.json \
  --as-of 2026-09-19T12:00:00Z

node work-samples/investor-reporting-reconciliation/reconcile.mjs \
  --input work-samples/investor-reporting-reconciliation/inventory.example.json \
  --as-of 2026-09-19T12:00:00Z --format json

node --test work-samples/investor-reporting-reconciliation/tests/reconcile.test.mjs
```

No package installation is needed. The as-of timestamp is required for reproducibility; the tool never silently chooses the current time. Valid input exits `0` even with findings. Invalid input, unsupported or duplicate arguments, and unreadable files exit `1`. Inspect `summary.review_required` and `review_queue`; an exit code of zero does not authorize release or retry. `--help` describes the command.

| File | Purpose |
| --- | --- |
| [reconcile.mjs](reconcile.mjs) | Validator, reconciliation library, readable renderer, and CLI. |
| [inventory.example.json](inventory.example.json) | The canonical fictional dataset: nine expected deliveries and ten attempts. |
| [expected-report.example.txt](expected-report.example.txt) | Readable result at the example as-of time. |
| [expected-report.example.json](expected-report.example.json) | Same result with all supplied records, metadata eligibility, and findings. |
| [tests/reconcile.test.mjs](tests/reconcile.test.mjs) | Behavioral, malformed-input, and CLI checks. |

The CLI creates no output files. If you redirect output, choose a location appropriate for the actual input's sensitivity. Keep real recipients, investor or portfolio information, completed reviews, contracts, evidence contents, credentials, and actual reporting files outside this repository. `fictional: true` labels an input; it neither redacts the records nor proves they are safe to share.

## What the fixture demonstrates

The snapshots claim complete coverage at the as-of time, while the batch claims it was interrupted. Those statements describe different things: a complete observation of an interrupted batch can still reveal missing work. The example produces **9 expected deliveries, 10 attempts, 4 completion-support records, 9 deliveries requiring review, and 25 review items**. Counts are neither risk scores nor readiness ratings.

| Delivery | Supplied circumstances | Result to notice |
| --- | --- | --- |
| DELIVERY-001 | Exact target and recipient confirmation. | `support_recorded` for completion, with batch interruption still requiring review. |
| DELIVERY-002 | Attempt targets RECIPIENT-099 instead of RECIPIENT-002. | Wrong-recipient finding and no matching entitlement for the actual target; expected completion is `unverified`. |
| DELIVERY-003 | Attempt uses a different fund, entity, document, and version. | Each mismatch remains visible; a receipt for that target does not complete the expected delivery. |
| DELIVERY-004 | No attempt appears in the complete current attempt snapshot. | `missing`; incomplete or stale expected/attempt snapshots would instead produce `unknown`. |
| DELIVERY-005 | A second sent attempt explicitly retries an already sent attempt. | Both effects remain in the record. Retry ancestry does not deduplicate sends. |
| DELIVERY-006 | A failed attempt is followed by a confirmed sent retry. | Completion support and earlier failure both remain visible; the tool does not invent two sent effects. |
| DELIVERY-007 | Send claim without a completion observation. | `unverified`; sending is not recipient/destination confirmation. |
| DELIVERY-008 | Positive and negative observations refer to the same attempt. | `conflicting`; favorable evidence does not clear the contrary observation. |
| DELIVERY-009 | Completion is recorded for a recipient whose entitlement is denied. | `support_recorded` completion and `adverse_claim` entitlement coexist. An observed effect does not make it authorized. |

The [operating pack](../../operations/packs/investor-reporting/README.md) supplies a procedure, decision record, and exercise using this same fixture. It handles recommendation, approval, execution, and verification as separate stages.

## Bounded input contract

Schema version `1` requires exactly the documented object fields. Unknown fields are rejected so misspelled fields cannot silently disappear. The fixture is the complete shape example. Arrays may be empty, but their snapshot metadata must still be supplied. A missing source cannot be represented as a fabricated complete, current empty export. An empty expected population always creates an `empty_expected_population` review item, including when every supplied snapshot claims complete coverage; independently establish whether an empty batch was intended.

All IDs and versions are exact, case-sensitive stable identifiers: uppercase letters, digits, underscores, and hyphens, beginning with a letter, maximum 64 characters. The tool does not normalize names or resolve identities. Use opaque recipient IDs, not email addresses. Duplicate record IDs, duplicate snapshot IDs, duplicate expected target tuples, and retry cycles are invalid input. Separate approval/entitlement records may describe the same target; differing statuses are conflicting claims rather than a last-write-wins update.

All timestamps use real UTC calendar values in `YYYY-MM-DDTHH:mm:ssZ` form, with no fractional seconds or offsets. Convert legitimate timestamps explicitly before using the sample. `null` is the required representation for an unknown allowed timestamp or evidence reference; absence of the field is an input error. Future observations and records dated after their source snapshot are retained but cannot support a summary. Non-null evidence references and observer roles must be nonempty trimmed text, at most 500 characters. References are opaque private labels, never fetched.

### Batch and snapshots

Top-level fields are `schema_version`, `fictional`, `batch_id`, `scope_id`, `max_snapshot_age_hours`, `batch_state_claim`, `snapshots`, `expected_deliveries`, `version_approvals`, `entitlements`, `attempts`, and `verifications`.

- `batch_id` identifies this reporting run; `scope_id` identifies its expressly defined population. Define the batch population independently of delivery logs. These IDs are labels, not proof that the supplied exports cover it.
- `batch_state_claim` is `completed`, `interrupted`, `running`, or `unknown`. A completed claim never substitutes for reconciliation or completion observations.
- `max_snapshot_age_hours` is the reviewer's nonnegative integer freshness limit, bounded to 8,760 hours for input sanity. The fixture's 24 hours demonstrates behavior; it is not a recommended reporting standard.
- `snapshots` contains exactly `expectations`, `approvals`, `entitlements`, `attempts`, and `verifications`. Each requires `snapshot_id`, `scope_id`, `batch_id`, `captured_at`, and `coverage` (`complete`, `partial`, or `unknown`). `captured_at` may be `null`.

A snapshot is usable for the metadata summary only if it claims complete coverage, matches both scope and batch, has a timestamp no later than as-of, and is no older than the chosen limit. The exact age boundary is eligible. The program cannot prove completeness or source authenticity. A fresh snapshot does not prove that an underlying approval remains legally effective or that a document's contents match its label.

### Expected population and authority records

| Array | Required fields and interpretation |
| --- | --- |
| `expected_deliveries` | `delivery_id`, `recipient_id`, `fund_id`, `entity_id`, `document_id`, `version`. One row per unique exact target tuple. Inclusion describes intended work; it grants no authority. |
| `version_approvals` | `approval_id`, `fund_id`, `entity_id`, `document_id`, `version`, `status`, `recorded_at`, `evidence_ref`. Status is `approved`, `pending`, `revoked`, or `unknown`; it is a supplied claim about the exact document/version scope. |
| `entitlements` | `entitlement_id`, `recipient_id`, `fund_id`, `entity_id`, `document_id`, `status`, `recorded_at`, `evidence_ref`. Status is `allowed`, `denied`, or `unknown`. Version release approval remains a separate required consideration. |

Current support requires matching affirmative records, usable metadata, and no conflicting status. Missing references, times, records, or usable snapshots do not become permission. A revoked or denied claim remains adverse even with unusable metadata; a positive claim cannot silently erase it. The sample intentionally has no automatic supersession or exception mechanism. Reconcile a legitimately superseded claim through the evidence process before changing the supplied snapshot.

Both the expected tuple and each attempt's actual tuple are checked. Authority records dated after an attempt produce a separate finding because they do not establish authority when it occurred. The model does not encode historical validity intervals, signer powers, delegated authority, or legal interpretation; even an earlier record does not establish those facts.

### Attempts and observations

Each `attempts` row requires `attempt_id`, `delivery_id`, the actual `recipient_id`, `fund_id`, `entity_id`, `document_id`, `version`, plus `retry_of`, `attempted_at`, `result`, and `evidence_ref`. Results are `sent`, `failed`, or `unknown`. A sent claim describes the sender's event, not recipient completion. Each distinct attempt retains its ID and row. Do not create a new ID for another copy of the same source event.

`retry_of` is an earlier attempt ID or explicit `null`. Missing predecessors, cross-delivery ancestry, missing timestamps, and reversed ordering remain findings. Retry cycles or self-references are invalid. A changed target is still checked against the expected tuple; correcting a later retry does not erase an earlier wrong send. The tool creates no retry plan or action and does not choose an idempotency key.

Each `verifications` row requires `verification_id`, `attempt_id`, `result`, `observed_at`, `method`, `observer_role`, and `evidence_ref`:

- `result` is `confirmed`, `not_confirmed`, or `inconclusive`. For this sample, **confirmed means a supplied observation that the exact scoped package is present at the associated intended recipient destination**. It does not mean opened, read, understood, acknowledged, or used. If that definition does not fit the real workflow, adapt the schema and tests before using it.
- `method` is `recipient_receipt`, `destination_record`, `sender_log`, or `unknown`. Only the first two can support this completion definition, with eligible timestamps, observer role, reference, and matching attempt. An uploaded file or notification alone is not a qualifying destination record unless it establishes the defined recipient-specific package outcome.
- The program does not inspect the record, authenticate the observer, verify reviewer independence, follow the reference, check payload hashes, or establish recipient identity. Those are human/source-system checks. The verification name denotes a supplied observation record, not a verification performed by this CLI.

A confirmation before the attempt, for an absent attempt, or with missing metadata cannot support completion. Contrary and inconclusive records remain visible even when their metadata is unusable. A failed or unknown attempt paired with a confirmed observation is a conflict to reconcile, not a success to select.

## Read the output without collapsing decisions

The report preserves the input records and adds metadata eligibility, associations, findings, and summaries. It never emits a blanket `approved`, `compliant`, or `safe_to_send` result.

| Output | Meaning |
| --- | --- |
| Authority `support_recorded` | Matching affirmative supplied claims passed local metadata checks. Authority itself has not been independently verified. |
| `missing_claim`, `unresolved_claim`, `adverse_claim`, `conflicting_claims` | Different limitations remain distinct; none becomes authorization. |
| Completion `support_recorded` | An exact-target sent claim and eligible positive observations support this narrow completion assertion. It does not resolve authorization, duplication, failed history, or batch status. |
| Completion `missing` | No attempt was supplied within current, complete expected/attempt snapshots. This is relative to those claims, not independently established absence. |
| Completion `unknown` | Coverage/freshness gaps prevent a completion conclusion. |
| Completion `unverified` | Supplied attempts do not provide usable confirmation of the expected result. |
| Completion `conflicting` | Supplied send/observation outcomes conflict. |
| `review_required` | There is a local finding or batch/snapshot gap affecting the record. False means no mismatch was identified in the supplied metadata, not release approval. |

Multiple `sent` rows for one expected delivery generate `multiple_sent_attempts`; repeated exact actual targets also generate `duplicate_target_sends`, even across different delivery IDs. These are possible duplicate effects to investigate, not proof that a recipient saw two distinct objects. Retries after a sent or unknown result remain risky even if the explicit link looks orderly. A failed-to-sent retry preserves the failure without inventing a second sent event. Multiple independent root attempts generate `unlinked_repeat_attempts`.

Snapshot/record gaps remain in `review_queue` instead of being converted to zero or an empty success. Source records are not silently discarded. Findings with `delivery_id: null` concern scope-level evidence and conservatively mark all expected deliveries for review. Attempts with unknown delivery IDs and orphaned verification records remain in the report. The overall `summary.review_required` also captures those out-of-population findings.

Library consumers can import `validateInventory`, `reconcileInventory`, `renderText`, and `runCli` from `reconcile.mjs`. The reconciliation function leaves its input unchanged. Report order follows supplied array order; preserve that ordering when reproducing a report.

## Validation and limitations

Validated on September 19, 2026: **33 tests passed** on local Node.js v26.7.0 and in an isolated Node.js v22.23.2 container with networking disabled. The test suite covers exact matching, wrong and unauthorized targets, version approvals, authority timing and conflicts, absent deliveries, send-versus-completion evidence, retries, duplicate possible effects, missing/orphan records, partial/stale/future/mismatched snapshots, empty expected populations, freshness boundaries, strict timestamps and types, duplicate IDs, retry cycles, input immutability, canonical output, and CLI errors.

This code was exercised only with fictional local metadata. No investor portal, mailbox, administrator system, document contents, real recipient, evidence reference, or live batch was accessed. The fixture and tests demonstrate behavior, not production readiness. Use the operating procedure and independent records to decide what to do next; this tool does not execute the decision.
