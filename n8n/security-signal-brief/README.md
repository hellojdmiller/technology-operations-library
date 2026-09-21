# Security signal brief

Draft a daily security brief from four collector exports: identity risk events, endpoint and mail alerts, GitHub Dependabot and secret scanning alerts, and Cloudflare audit events. The node normalizes each record, applies a small routing table for severity and owner, and sorts every signal into exactly one of the four sections from the [leadership risk brief](../../cyber-risk/reporting/leadership-risk-brief.md): what changed, needs decision, unknown, closed. It is deterministic. An optional model drafting aid exists only as prompt text, is disabled by default, and is never required for the brief to be complete.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. The [sample](sample-input.json) is fictional (org "Northwind Ledger Partners", domain `northwind-ledger.example`); inspect [evaluate.js](evaluate.js) to review the logic. [expected-output.json](expected-output.json) is the fixture result; the local tests compare the evaluator output against it byte for byte.

The sample returns `needs_review` with `counts.total: 11` (10 records plus one synthetic row), `needsDecision: 3`, `whatChanged: 1`, `unknown: 4`, `closed: 3`, and no `issues`:

- `identityRiskEvents:idr-1001`: `confirmedCompromised`, routed by the first matching rule to `critical` and "Identity owner" even though a later `riskLevel: high` rule also matches. Needs decision.
- `githubAlerts:gh-3001`: open Dependabot `critical` on `northwind-ledger/ledger-api`, routed to "Platform lead". Needs decision.
- `cloudflareAuditEvents:cf-4001`: `waf.rule.disable` by an actor, routed `high` to "Edge and DNS owner". Needs decision. Audit events have no state, so they stay open until listed in `closedSince`.
- `endpointAndMailAlerts:ep-2002`: `informational` alert with status `new`, routed `medium` by category. What changed; it needs no decision.
- `identityRiskEvents:idr-1003`: blank `user`. Unknown with `subject_missing:user`, even though a rule routed it.
- `githubAlerts:gh-3002`: secret scanning alert whose `secretType` has no rule. Unknown with `owner_unknown`, `severity: null`.
- `cloudflareAuditEvents:cf-4002`: `account.member.add` with no rule. Unknown with `owner_unknown`.
- `githubAlerts:gh-2999`: a `closedSince` entry that matches no record. Synthetic unknown row with `closed_id_not_found`.
- `identityRiskEvents:idr-1002` (`remediated`) and `endpointAndMailAlerts:ep-2001` (`resolved`): closed via source state. `endpointAndMailAlerts:ep-2003` is still `inProgress` in the export but closed via `closedSince`.

`decisionRequested` has one line per needs-decision row naming the owner role (or "unassigned"). `narrativeDraftingAid.status` is `disabled` and `prompt` is `null`.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier (`tol-` prefix in fixtures) and export evidence reference. Blank `evidenceRef` is an issue. |
| `asOf`, `snapshotComplete` | Real `YYYY-MM-DD` date and boolean completeness statement for all four exports |
| `previousBriefRef` | String reference to the prior brief. Blank is allowed and produces the issue "prior brief reference missing". |
| `decisionAfterDays` | Required whole number of days, zero or more. Open items older than this move to `needsDecision`. There is no default. |
| `sources` | Object with the four arrays below. Each may be empty. |
| `routing` | Ordered array of rules; first match wins. Each rule: unique `ruleId`, `source` (one of the four keys), `match: { field, equals }` (exact `===` on one raw record field), `severity` (`low`, `medium`, `high`, `critical`), `ownerRole`. |
| `closedSince` | Array of unique signal ids in the form `source:id` that the team recorded as closed since the prior brief |
| `aiDrafting` | `{ enabled: boolean }`. Fixture: `false`. |

Every record needs a nonblank string `id`, unique within its source. Its timestamp, when present, must be ISO 8601 with a zone (`Z` or `+hh:mm`); a garbage timestamp is `invalid_input`, an absent one keeps the record and marks it unknown. Field names are simplified for the fixture and are not the vendors' exact schemas.

| Source array | Timestamp | Subject | State and closed values | Other fields |
|---|---|---|---|---|
| `identityRiskEvents` | `detectedAt` | `user` | `riskState`: `atRisk`, `confirmedCompromised`, `remediated`, `dismissed`; closed when `remediated` or `dismissed` | `riskLevel` (`low`, `medium`, `high`), `detectionType` (for example `unfamiliarFeatures`, `anomalousToken`) |
| `endpointAndMailAlerts` | `createdAt` | `assetOrMailbox` | `status`: `new`, `inProgress`, `resolved`; closed when `resolved` | `title`, `severity` (`informational`, `low`, `medium`, `high`), `category` |
| `githubAlerts` | `createdAt` | `repository` | `state`: `open`, `dismissed`, `fixed`, `resolved`; closed unless `open` | `kind` (`dependabot` or `secret_scanning`), `severity` for Dependabot, `secretType` for secret scanning |
| `cloudflareAuditEvents` | `when` | `resourceId` | none; closed only through `closedSince` | `actorEmail`, `action`, `resourceType`, `interface` |

Normalized rows carry `signalId` (`source:id`), `observedAt` (UTC ISO), `ageDays` (whole UTC days to `asOf`), `subject`, `summary`, `rawState`, `detail`, `severity`, `ownerRole`, `routedBy`, `relatedTo`, `closed`, `closedVia`, `findings`, and `section`. Two records from the same source with the same `id` make the packet `invalid_input`. Records from different sources with the same subject, the same topic field (`detectionType`, `title`, `kind`, or `action`), and the same UTC day are kept and list each other in `relatedTo`.

Section rules, in order of precedence: `closed` (source state or `closedSince`), then `unknown` (any finding: `owner_unknown`, `subject_missing:<field>`, `observed_at_missing:<field>`, `observed_after_asOf:<field>`, `state_unknown:<field>`, `kind_unknown:kind`), then `needsDecision` (open and `high` or `critical`, or open longer than `decisionAfterDays` whole days), then `whatChanged`. A closed row keeps any findings visible but does not force review. A `closedSince` entry that matches nothing becomes a synthetic `unknown` row with `closed_id_not_found`; it counts in `counts.unknown` and `counts.total` but not in `sourcesSummary.recordCount`. This keeps a stale closure list visible in the brief rather than buried in `issues`.

The output holds `brief` (`periodAndScope`, `decisionRequested`, the four sections, `counts` with `bySeverity`, `sourcesSummary` with `recordCount`, `oldest`, `newest` per source), `counts` repeated at the root for the shared review contract, `narrativeDraftingAid`, `evidenceRef`, `previousBriefRef`, and `limitation`. Rows appear in source order (identity, endpoint and mail, GitHub, Cloudflare), then input order; sort downstream if a different order is wanted.

`review_ready` means no issues, nothing in `needsDecision`, nothing in `unknown`, a complete snapshot, and an evidence reference. `whatChanged` may be nonempty: a brief with only routed, informational changes still needs no decision. `needs_review` covers everything else, including a blank prior brief reference and an export with zero records.

### Optional drafting aid

`narrativeDraftingAid` is `{ enabled, status, label, prompt }`. With `aiDrafting.enabled: false` (the default and the fixture), `status` is `disabled` and `prompt` is `null`. With `true`, `status` is `prompt_ready` and `prompt` is a deterministic string built from the brief sections that names every signal id. To use it, add an n8n model node after this evaluator that reads `narrativeDraftingAid.prompt` only when `status === 'prompt_ready'`. Keep it disabled by default. Compare the model's draft against the deterministic sections before anyone sends it: same signal ids, same counts, same severities and owners. The label states the boundary: the model may rephrase for readability and must not add, remove, or reprioritize items. This node never calls a model.

## Failure exercises

Duplicate an `id` inside one source. Replace a timestamp with `yesterday`. Remove `decisionAfterDays`. Give a routing rule the severity `urgent`. Each returns `invalid_input` with the field named. Blank a `user`, drop a `detectedAt`, set a `riskState` outside the vocabulary, or add an alert whose fields match no rule: each lands in `unknown`, never in a default severity. Move a record's timestamp four days before `asOf`: it moves to `needsDecision` by age. Add a `closedSince` id that matches nothing: a `closed_id_not_found` row appears. Set `aiDrafting.enabled: true` and confirm the prompt contains every signal id. Set `snapshotComplete: false` and `evidenceRef: ""`: both issues appear and the status is `needs_review`.

## Connect to real sources

Collect each export read-only with pagination and record the export window and time zone. Map the vendor fields into this contract in a separate mapping node: Entra ID Protection risk detections (`riskEventType`, `riskLevel`, `riskState`), Microsoft Graph security alerts (`createdDateTime`, `severity`, `status`, `title`), GitHub Dependabot alerts (`state`, `security_advisory.severity`) and secret scanning alerts (`state`, `secret_type`), and Cloudflare audit log entries (actor, action, resource). Real vocabularies differ from the fixture: Dependabot also has `auto_dismissed`, secret scanning uses `open` and `resolved` only, and Graph alert severity includes `unknown`. Extend the state lists in `evaluate.js` deliberately; do not let unmapped values fall into `whatChanged`.

Keep the routing table in version control and review it with the owners it names. Record who marked each `closedSince` entry and how they verified it. The brief reports; it does not close alerts, rotate secrets, change WAF rules, or notify anyone. Send it to a person who owns the review before any distribution.

## Limits

The node cannot tell a record first seen this period from one carried over; that depends on the collector's export window and on `closedSince`. It cannot confirm that an export finished, that a source state is current, or that a routed owner accepted an item. Related grouping is exact and narrow (same subject, same topic string, same UTC day); vendors rarely share topic vocabularies, so most relationships still need a human reader. Ages use whole UTC days. The drafting aid is text; any model step, its review, and its data handling are outside this node.

## Source notes

Research reviewed: 2026-09-20. Official documentation only. Field names in the fixture are simplified and are not the vendors' exact schemas.

| Source | Support | Application | Limits | Revisit trigger |
|---|---|---|---|---|
| Microsoft Entra ID Protection, [What are risk detections?](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks), Microsoft Learn, updated 2026-04-22 | Lists `riskEventType` values such as `unfamiliarFeatures` and `anomalousToken`; describes risk levels | `detectionType` and `riskLevel` vocabulary in the identity source; `confirmedCompromised` routed as critical in the sample | Page covers detections; `riskState` values come from the riskyUsers API and are simplified here. License tier changes which detections appear. | Changes to detection names, risk levels, or the riskyUsers resource |
| Microsoft Graph, [alert resource type (v1.0)](https://learn.microsoft.com/en-us/graph/api/resources/security-alert), Microsoft Learn, updated 2026-08-28 | `createdDateTime`, `severity` (`informational`, `low`, `medium`, `high`, `unknown`), `status`, `title` properties | Endpoint and mail source fields and severity vocabulary | Fixture drops `unknown` and `unknownFutureValue`; `assetOrMailbox` is a simplification of the evidence collection | Graph alert schema or enum changes |
| GitHub REST, [Dependabot alerts](https://docs.github.com/en/rest/dependabot/alerts), GitHub Docs, date unknown | `state` values `open`, `dismissed`, `fixed`, `auto_dismissed`; severity `low`, `medium`, `high`, `critical` | GitHub source `kind: dependabot`, `severity`, closed states | Fixture omits `auto_dismissed` and uses a flat `severity` field | REST schema or state vocabulary changes |
| GitHub REST, [secret scanning alerts](https://docs.github.com/en/rest/secret-scanning/secret-scanning), GitHub Docs, date unknown | `state` values `open`, `resolved`; `secret_type` field | GitHub source `kind: secret_scanning`, `secretType` routing match, `owner_unknown` when unrouted | Fixture shares one `state` list across both kinds for simplicity | Secret type names or alert states change |
| Cloudflare, [Review audit logs](https://developers.cloudflare.com/fundamentals/account/account-security/review-audit-logs/), Cloudflare Docs, updated 2026-04-22 | Audit logs record account and zone configuration actions; retained 18 months | Cloudflare source as stateless events closed only through `closedSince`; action strings like `waf.rule.disable` | Page does not enumerate entry fields or action names; fixture field names are illustrative | Audit log schema, retention, or the v2 audit log rollout |
| n8n, [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), n8n Docs, date unknown | Run Once for All Items mode; Cloud restricts external modules | Evaluator shape, `$input.all()`, no imports or modules | Behavior across n8n versions is not verified here; the runtime lab has not run for this workflow | Code node version or sandbox changes |
| This library, [A leadership brief that leads to a risk decision](../../cyber-risk/reporting/leadership-risk-brief.md), reviewed 2026-09-17 | One-page structure: period and scope, decision requested, what changed, owner or "unassigned" | Section names, `periodAndScope`, `decisionRequested` lines, `unassigned` owner label | The brief structure is an original proposal, not a standard | Changes to the brief template |

## Runtime evidence

On September 20, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8** through the [isolated runtime lab](../../labs/n8n-runtime/README.md), which records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
