# Secret exposure response

Turn a batch of secret-scanning alerts into a per-alert rotation checklist, a time-to-revoke status, and a ticket draft. The evaluator classifies each alert with a supplied secret-type policy, finds the owning service in a supplied catalog, and keeps anything it cannot match visible as unknown. It never revokes, rotates, purges, or notifies. It never reads a secret value. All data is fictional.

## Try it

Import `workflow.json` using the [shared setup instructions](../README.md), then execute manually. The [sample](sample-input.json) is fictional; inspect [evaluate.js](evaluate.js) to review the logic. [expected-output.json](expected-output.json) is the fixture result, and the local tests compare the evaluator output against it exactly.

The sample returns `needs_review` with `counts: { total: 5, open: 3, overdue: 1, due: 1, revokedWithinTarget: 1, revokedAfterTarget: 0, unknown: 2, ownerUnknown: 1 }`:

- Alert 7 (`northwind-ledger/ledger-api`, `aws_access_key_id`): open, validity active, push protection bypassed. The 4-hour policy deadline passed on 2026-09-19T12:00:00Z, so the status is `overdue` with finding `revocation_overdue`. Ticket priority `p1`, assignee "Platform lead".
- Alert 3 (`ledger-api`, `github_personal_access_token`): resolved as revoked 2.5 hours after creation, inside the 24-hour target. Status `revoked_within_target`; the `revoke_or_disable` step is `complete`, every other step stays `pending`. Priority `p3` because validity is inactive.
- Alert 2 (`northwind-ledger/intranet-scripts`, `slack_webhook_url`): the repository is not in the catalog. `ownerRole`, `service`, and `ticket.assignee` are `null`, the finding is `owner_unknown`, and the ticket body says `UNASSIGNED: owner unknown`. Status `due` (deadline 2026-09-21T06:15:00Z). It appears in `unknownRows`.
- Alert 5 (`ledger-api`, `generic_private_key`): resolved as `false_positive` while validity is `active`. Status `not_applicable_resolution` with findings `non_revocation_resolution_needs_review` and `active_secret_not_revoked`. Nothing in the checklist is marked complete. Priority `p1`.
- Alert 11 (`northwind-ledger/billing-sync`, `acme_billing_api_token`): no policy row. Finding `secret_type_unclassified`; `class`, `revokeWithinHours`, `revokeDeadline`, and `ticket.priority` are `null`, status `unknown`. The owner is known ("Finance systems lead") and is kept. It appears in `unknownRows`.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier and a reference to the restricted alert export used as evidence |
| `asOf`, `snapshotComplete` | Real `YYYY-MM-DD` date and boolean statement that every in-scope repository was collected |
| `alerts` | Array of simplified alerts; `alertNumber` plus `repository` must be unique together |
| `serviceCatalog` | Array of repository ownership rows; `repository` must be unique |
| `secretTypePolicy` | Array of classification rows; `secretType` must be unique |

Each alert needs `alertNumber` (integer), `repository` (`owner/name`), `secretType`, `secretTypeDisplayName` (string), `state` (`open` or `resolved`), `resolution` (`null` for open alerts; for resolved alerts one of `false_positive`, `wont_fix`, `revoked`, `used_in_tests`, `pattern_edited`, `pattern_deleted`), `createdAt` (`YYYY-MM-DDTHH:MM:SSZ`), `resolvedAt` (`null` or the same timestamp form, never on an open alert), `pushProtectionBypassed` (boolean or `null`), `validity` (`active`, `inactive`, `unknown`), `locations` (array of `{ type, ref }` where `type` is `commit`, `issue`, `pull_request`, or `wiki` and `ref` is the path or reference string), and `htmlUrl`. Timestamps later than the end of the `asOf` day are invalid. These field names are a simplified subset of the GitHub alert object; the fixture carries no secret value, and the evaluator never reads one.

Each catalog row needs `repository`, `service`, `ownerRole` (string or `null`; blank means unknown), `escalationRole` (string or `null`), `environment` (`production`, `staging`, `development`, `unknown`), and `rotationRunbookRef` (string, blank when absent). Repository matching is exact, case and whitespace included.

Each policy row needs `secretType`, `class` (`cloud_credential`, `source_control_token`, `messaging_webhook`, `private_key`, `database_credential`, `third_party_api_key`), `revokeWithinHours` (positive integer), and `rotationSteps` (nonempty array of strings).

Per alert the output row carries the alert fields plus `class`, `ageHours` (whole hours from `createdAt` to `asOf` 23:59:59Z), `revokeDeadline` (`createdAt` plus `revokeWithinHours`), `timeToRevokeStatus`, the matched `service`, `ownerRole`, `escalationRole`, `environment`, `rotationRunbookRef`, `rotationSteps`, `locationCount`, `locationTypes`, `findings`, a six-step `checklist`, and a `ticket` (`title`, multiline `body`, `assignee`, `priority`).

| `timeToRevokeStatus` | Meaning |
|---|---|
| `revoked_within_target` | Resolution `revoked` and `resolvedAt` is at or before the deadline |
| `revoked_after_target` | Resolution `revoked` and `resolvedAt` is after the deadline |
| `overdue` | Open and the end of the `asOf` day is past the deadline (finding `revocation_overdue`) |
| `due` | Open and still inside the window |
| `not_applicable_resolution` | Resolved with a non-revoked resolution; always adds `non_revocation_resolution_needs_review`, and `active_secret_not_revoked` when validity is `active` |
| `unknown` | No policy row, or resolution `revoked` without `resolvedAt` (finding `revocation_time_unknown`) |

Checklist steps, in order: `confirm_exposure_scope`, `revoke_or_disable`, `rotate_and_redeploy`, `purge_from_history_or_accept`, `verify_no_use_after_exposure`, `close_alert_with_resolution_revoked`. Each step has `owner` (the catalog `ownerRole` or `null`), `state`, and `evidenceRef: null`. Only `revoke_or_disable` can be `complete`, and only when the resolution is `revoked` and `resolvedAt` exists. Every other step stays `pending` until a person attaches evidence; the closing step stays pending even on a resolved alert because the alert state alone does not show the preceding steps were done.

Ticket priority: `p1` for `cloud_credential`, `private_key`, or `database_credential` with validity `active` or `unknown`; `p2` for the other classes with validity `active` or `unknown`; `p3` when validity is `inactive`; `null` when the secret type is unclassified. The title severity word is `Critical`, `High`, `Low`, or `Unclassified`.

`unknownRows` lists rows whose owner is unknown, whose class is unknown, or whose `timeToRevokeStatus` is `unknown`; `counts.unknown` is its length. `review_ready` requires no issues and every alert `revoked_within_target` with no findings. Anything else, including an open alert, an incomplete snapshot, or a blank `evidenceRef`, is `needs_review`. Duplicate alert keys, duplicate catalog or policy keys, bad timestamps, an unsupported `state`, `resolution`, `validity`, or location type, or an open alert carrying a resolution returns `invalid_input`.

## Failure exercises

Remove a catalog row and confirm the alert becomes `owner_unknown` rather than inheriting a default owner. Remove a policy row and confirm `class`, deadline, and priority become `null`. Set `resolvedAt` to `null` on a revoked alert and confirm the revoke step stays pending and the status is `unknown`. Change a `false_positive` alert's validity to `active` and confirm `active_secret_not_revoked` appears. Move `resolvedAt` one second past the deadline and confirm `revoked_after_target`. Duplicate an `alertNumber` within one repository and confirm `invalid_input`; the same number in two repositories stays valid. Set `snapshotComplete: false` and `evidenceRef: ""` and confirm both problems appear in `issues`.

## Connect to real sources

Collect alerts read-only from the secret scanning alerts API or the `secret_scanning_alert` webhook, paginate fully, and record the collection time and the repository list you queried; set `snapshotComplete: false` when any repository or page was skipped. Map `number`, `state`, `resolution`, `created_at`, `resolved_at`, `secret_type`, `secret_type_display_name`, `validity`, `push_protection_bypassed`, `html_url`, and the locations list into this contract. Use `hide_secret` or drop the `secret` field before the payload enters n8n; never store or log a secret value in execution data.

Maintain the service catalog and secret-type policy in a reviewed source, not in the workflow. The policy hours here are illustrative; set targets your incident process can actually meet and document who owns each class. The ticket draft is text for a human to file, not an API call. Configure any downstream ticketing or messaging through n8n credentials, and keep alert exports and generated tickets out of this repository.

## Limits

The evaluator trusts the supplied `validity`; it cannot test whether a secret still works. It cannot confirm that revocation or rotation happened in any provider, that history was purged, or that forks and clones were checked. Deadlines are computed from `createdAt`, not from the time the secret was first pushed, and `ageHours` uses the end of the `asOf` day, so a real incident clock needs exact timestamps and a named time zone. Fixture `secretType` values are illustrative and do not all match GitHub pattern identifiers exactly. Review execution-data retention before running this on real alert exports. The workflow neither revokes nor rotates anything.

## Source notes

Research reviewed: 2026-09-20. Official documentation only; each page was confirmed to exist on that date.

| Source | Support | Application | Limits | Revisit trigger |
|---|---|---|---|---|
| GitHub Docs, [REST API endpoints for secret scanning](https://docs.github.com/en/rest/secret-scanning/secret-scanning), date unknown | Alert object fields: `number`, `state` (open/resolved), `resolution`, `created_at`, `resolved_at`, `secret_type`, `secret_type_display_name`, `validity` (active/inactive/unknown), `push_protection_bypassed`, `html_url`; the object can include a `secret` field with a `hide_secret` option | Fixture field names and enumerations; the fixture omits `secret` and the evaluator never reads it | The REST reference lists four resolution values plus null; the fixture also accepts `pattern_edited` and `pattern_deleted`, confirm against the current schema before relying on them | Schema change to the alert object or new resolution or validity values |
| GitHub Docs, [Webhook events and payloads: secret_scanning_alert](https://docs.github.com/en/webhooks/webhook-events-and-payloads#secret_scanning_alert), date unknown | Event actions include `created`, `resolved`, `reopened`, `validated`, `publicly_leaked`, `assigned`; payload carries an `alert` object | Alternative collection path in "Connect to real sources"; one webhook delivery is one alert, not a complete snapshot | Webhooks can be missed or delivered twice; completeness must come from a list call | New event actions or payload changes |
| GitHub Docs, [Supported secret scanning patterns](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns), date unknown | Provider patterns such as `aws_access_key_id` and `github_personal_access_token` exist; validity checks are not supported for generic patterns and depend on plan | Policy keyed by `secretType`; `validity: unknown` treated as unconfirmed, not safe | Fixture types like `generic_private_key` and `slack_webhook_url` are illustrative, real identifiers differ (for example `rsa_private_key`) | Pattern list or validity-check coverage changes |
| GitHub Docs, [Resolving alerts from secret scanning](https://docs.github.com/en/code-security/secret-scanning/managing-alerts-from-secret-scanning/resolving-alerts), date unknown | Treat a committed secret as compromised; revoke and reissue; check provider security logs for unauthorized activity | Checklist order (revoke, rotate, verify no use) and the `non_revocation_resolution_needs_review` finding | Page shows the close-as menu as a screenshot; resolution reason names taken from the REST reference | Changes to the resolution workflow or guidance |
| GitHub Docs, [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection), date unknown | Users with write access can bypass push protection with a reason; a bypass creates an alert and an audit-log event | `pushProtectionBypassed` surfaced in the ticket body so a reviewer sees a deliberate bypass | Bypass reason is not in the fixture; the field can be `null` | Bypass behavior or delegated-bypass changes |
| NIST, [SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final), April 2025 | Incident handling as a managed lifecycle with defined roles, evidence, and lessons learned aligned to CSF 2.0 | Separate pending, complete, and not-applicable states; named owner per step; time-to-revoke tracking as a measurable outcome | The publication does not define secret-specific deadlines; the hours here are local policy choices | New revision or CSF profile update |
| n8n Docs, [Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), date unknown | Run Once for All Items executes the code once for the whole input | Evaluator structure and `pairedItem` on every output | `$input.all()` is documented on the built-in methods page rather than this one; runtime behavior confirmed only by local tests, not yet by the runtime lab | n8n Code node version change |

## Runtime evidence

On September 20, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8** through the [isolated runtime lab](../../labs/n8n-runtime/README.md), which records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
