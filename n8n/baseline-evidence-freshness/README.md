# Baseline evidence freshness

Read an observations document in the [baselines schema](../../baselines/README.md), compare each control's `observed_at` against its `max_evidence_age_days`, and produce reminders grouped by control owner. The useful question is who needs to collect or refresh evidence before the next assessment, and which approved exceptions are about to lapse. The workflow reminds; it does not assess alignment or verify evidence.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. The [sample](sample-input.json) is fictional; inspect [evaluate.js](evaluate.js) to review the logic. [expected-output.json](expected-output.json) is the fixture result, and the local tests compare the evaluator output against it.

The sample embeds the 20 Cloudflare controls (id, title, category, `max_evidence_age_days` copied from [desired-state.json](../../baselines/cloudflare/desired-state.json)) and the fictional [observed.example.json](../../baselines/cloudflare/observed.example.json) verbatim. Fifteen controls have a fictional owner role; five are deliberately unassigned. The fixture returns `needs_review`, `controls: 20`, `fresh: 17`, `remindersTotal: 13`:

- `CF-08`: `evidence_stale`. Observed 2026-03-01, 202 whole days before `asOf` and past the 90-day window. Also `owner_unassigned`.
- `CF-09`: `evidence_reference_missing`. The observation is dated but `evidence_ref` is `null`.
- `CF-04`: `scope_incomplete`. Fresh evidence that covers only part of the declared scope.
- `CF-07`: `exception_expiring_soon`. The fixture exception expires 2026-10-20, exactly 30 days after `asOf` 2026-09-20; the warning window is inclusive, so no second exception was added to the fixture. `dueBy` is the expiry date.
- `CF-18`, `CF-20`: `observation_date_missing`, `evidence_reference_missing`, `owner_unassigned`. No `observed_at`, so no age can be computed.
- `CF-16`, `CF-17`: `owner_unassigned` only. They are fresh but nobody is named to act.
- `CF-11`, `CF-14`, `CF-16`, `CF-17`: `assessStatusHint: would_be_unknown` because `applicable` or `value` is `null`. That is a hint about how [assess.mjs](../../baselines/scripts/assess.mjs) would treat the same record, not a recomputed status.

`remindersByOwner` lists "Edge and DNS owner" (2 controls), "Identity owner" (1), and the `null` owner group (5 controls, 10 reminders) last.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier and evidence reference for the observations document itself |
| `asOf`, `snapshotComplete` | Real `YYYY-MM-DD` date and boolean completeness statement for the observation collection |
| `exceptionWarningDays` | Non-negative integer; exceptions expiring within this many days of `asOf` get `exception_expiring_soon` |
| `baseline` | `{ id, version, controls }`; each control needs `id`, `title`, `category`, and positive integer `max_evidence_age_days`; ids unique |
| `controlOwners` | Array of `{ controlId, ownerRole }`; each `controlId` must exist in `baseline.controls` and appear once |
| `observations` | The observations document in the baselines schema, unchanged |

The `observations` document follows the [observation contract](../../baselines/README.md#observation-contract) and is validated with the same rules `assess.mjs` applies: `schema_version: 1`; `baseline_id` and `baseline_version` equal to the embedded baseline; boolean `fictional`; nonblank `environment.scope`; an `observations` array whose entries each carry a known, unique `id`, `applicable` and `value` as boolean or `null`, `implementation` in `native`, `manual`, `unsupported`, `unknown`, boolean `scope_complete`, and `reviewer`, `evidence_ref`, `observed_at` as nonblank text or `null`. `observed_at` must be a real `YYYY-MM-DDTHH:MM:SSZ` timestamp. An `exception`, if present, needs nonblank `owner`, `reason`, `compensating_control`, and a real `expires_on` date. Violations return `invalid_input` with one issue per problem.

Every baseline control produces one row, observed or not:

| Row field | Values |
|---|---|
| `freshness` | `fresh`, `stale`, `missing_observation`, `missing_observation_date`, `future_dated` |
| `evidenceAgeDays` | Whole UTC days from `observed_at` to `asOf` midnight, or `null` when there is no date |
| `evidenceReference` | `present` or `missing` |
| `scopeComplete` | Boolean from the observation, or `null` when there is no observation |
| `exception` | `null` or `{ owner, expires_on, state: active or expired, daysToExpiry, expiringSoon }` |
| `reminders` | Any of `evidence_stale`, `evidence_reference_missing`, `observation_missing`, `observation_date_missing`, `evidence_future_dated`, `scope_incomplete`, `exception_expiring_soon`, `exception_expired`, `owner_unassigned` |
| `assessStatusHint` | `would_be_unknown` when freshness is not `fresh`, the evidence reference is missing, scope is incomplete, `applicable` is `null`, or an applicable control has `value: null` or an `unsupported`/`unknown` implementation; otherwise `evaluable` |

Stale uses the `assess.mjs` arithmetic: `asOf midnight - observed_at > max_evidence_age_days * 1 day`. Future-dated means `observed_at` is after the end of the `asOf` UTC day. `evidence_reference_missing` is raised only when an observation exists; a missing observation gets `observation_missing` alone. `ownerRole` is `null` and `owner_unassigned` is raised when no `controlOwners` row names the control; no default owner is assigned.

`remindersByOwner` contains only controls with at least one reminder, ordered by `ownerRole` with the `null` group last. `dueBy` is the exception `expires_on` when the only reminder is `exception_expiring_soon`; every other reminder is due on `asOf`.

`counts` reports `controls`, `observed`, `fresh`, `stale`, `missingObservation`, `missingObservationDate`, `missingEvidenceReference`, `futureDated`, `scopeIncomplete`, `exceptionsActive`, `exceptionsExpiringSoon`, `exceptionsExpired`, `ownerUnassigned`, and `remindersTotal`.

`review_ready` means every control has a fresh, referenced observation, no expiring or expired exception, an owner, and the packet itself is complete. `needs_review` covers any reminder, an incomplete snapshot, or a blank packet `evidenceRef`. The workflow does not compute `aligned`, `gap`, or `not_applicable`; run `assess.mjs` for that.

## Failure exercises

Move one `observed_at` more than 90 days before `asOf`, or after it. Set an `evidence_ref` to `null`. Remove an observation entirely. Delete a `controlOwners` row. Set an exception `expires_on` before `asOf`, or within the warning window. Duplicate an observation id, use a timestamp without seconds, or change `baseline_version`. Each must remain visible as a reminder or make the packet `invalid_input`, as appropriate.

## Connect to real sources

Keep the observations document in the firm's private evidence store and read it into the packet unchanged; the embedded `baseline` is a reduced copy of the desired-state file, so keep both at the same version. Maintain `controlOwners` as a small owned table rather than in the workflow. One evidence source for several Cloudflare controls is the account audit log; export it read-only and record an opaque `evidence_ref`, never the log content.

Send `remindersByOwner` to an internal review destination only after someone owns the cadence. The 90-day evidence window in the baselines and the 30-day exception warning here are proposed local cadences, not vendor retention settings or regulatory requirements. Adjust `max_evidence_age_days` in the private copy of the desired state, not in this repository.

## Limits

The workflow reads reviewer-recorded assertions. It cannot inspect a tenant, open an evidence reference, confirm that evidence supports the assertion, or tell whether a fresh observation is aligned. Ages are whole UTC days against `asOf` midnight; local time zones and partial days are not modeled. `assessStatusHint` is a lower bound: `assess.mjs` may report additional unknowns (missing reviewer, missing not-applicable reason, unsupported implementation mode for a specific control) that this workflow does not model. Everything in the sample is fictional.

## Source notes

Research reviewed: 2026-09-20.

| Source | Support | Application | Limits | Revisit trigger |
|---|---|---|---|---|
| Library baselines guide, [baselines/README.md](../../baselines/README.md), reviewed 2026-09-20 | Observation contract, `unknown` meaning, 90-day window as a proposed cadence | Packet validation rules and the `fresh`/`stale` vocabulary | Local convention, not an external standard | Schema version change or new status values |
| Library assessment tool, [baselines/scripts/assess.mjs](../../baselines/scripts/assess.mjs), reviewed 2026-09-20 | Exact stale, future-dated, and exception-state arithmetic | Reused the same comparisons so hints line up with assessment results; a local test runs the fixture through it | The workflow does not recompute `aligned`, `gap`, `not_applicable` | Any change to `assess.mjs` status logic |
| NIST, [Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework), version 2.0 published 2024-02-26 | Govern and Identify functions expect assigned roles and current knowledge of assets and controls | Owner grouping and `owner_unassigned` reminders | NIST does not prescribe an evidence review interval; the cadence here is local | New CSF version or profile guidance |
| Cloudflare Developers, [Review audit logs](https://developers.cloudflare.com/fundamentals/account/account-security/review-audit-logs/), date unknown | Audit logs exist per account and can be reviewed or exported as evidence | Named as one example evidence source in "Connect to real sources" | Retention and export options vary by plan; the workflow never reads logs | Cloudflare changes audit log retention or access |
| n8n, [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), date unknown | Run Once for All Items, `$input.all()`, `pairedItem` behavior | Evaluator structure and item linkage | Runtime lab has not run for this workflow; UI import untested | n8n Code node version or sandbox changes |

## Runtime evidence

On September 20, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8** through the [isolated runtime lab](../../labs/n8n-runtime/README.md), which records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
