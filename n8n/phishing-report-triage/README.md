# Phishing report triage

Triage user-reported messages from a supplied summary: a header subset, sender fields, URL strings, and attachment names. The node parses SPF, DKIM, and DMARC results from an `Authentication-Results` string, checks the sender domain against the organization's own domains, an allowlist, and explicit lookalike rules, decodes and classifies each URL, and returns a rule-based verdict with a response template for the reporter. It makes no network calls, never fetches a URL, never opens an attachment, and changes nothing in the mail system. The verdict is a triage aid for a human, not a determination.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. The [sample](sample-input.json) is fictional; inspect [evaluate.js](evaluate.js) to review the logic. [expected-output.json](expected-output.json) is the fixture result; the local tests compare the evaluator's output for the sample against it exactly.

The sample returns `needs_review` with counts `reports: 4`, `maliciousLikely: 1`, `suspicious: 1`, `undetermined: 1`, `likelyLegitimate: 1`, `urlsChecked: 4`, `urlsSuspicious: 3`:

- `tol-phish-001`: `malicious_likely`, owner `Security owner`. The sender domain `northwind-ledger-secure.example` matches the added-hyphenated-word lookalike rule, DMARC fails, the display name imitates internal IT, one URL is a defanged shortener link, and a redirect parameter percent-decodes to a login page on `northwlnd-ledger.example` (edit distance 1 from the organization domain).
- `tol-phish-002`: `likely_legitimate`, owner `Service desk`. Allowlisted sender, SPF/DKIM/DMARC pass, DKIM signing domain aligned, one https URL to the allowlisted domain, no reply-to mismatch. Recommended action `no_action`.
- `tol-phish-003`: `suspicious`. External vendor with `dkim=none` and `dmarc=none`, a reply-to on a different domain, a query parameter whose base64 value decodes to `https://evil.example/login`, and a `.zip` attachment.
- `tol-phish-004`: `undetermined`. Blank `Authentication-Results` header, so SPF, DKIM, and DMARC stay `unknown`; blank reporter role. The display name says "IT Support" but the address is on the organization domain, so it is not counted as impersonation.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Review identifier and evidence reference for the report mailbox export |
| `asOf`, `snapshotComplete` | Real `YYYY-MM-DD` date and boolean completeness statement |
| `organizationDomains` | Nonempty array of the organization's own domains |
| `allowlistedSenderDomains` | Array of exact sender domains treated as known senders (include the organization domains) |
| `knownUrlShorteners` | Array of hostnames treated as URL shorteners |
| `routing` | Object with nonblank `malicious` and `other` owner roles; missing routing is `invalid_input` |
| `reports` | Array with unique `reportId` values |

Each report needs `reportId`, `reportedAt` (ISO UTC timestamp ending in `Z`), `fromHeader` (display name and address, for example `Payroll Team <notices@payroll-portal.example>`), `urls` (array of strings, possibly empty), and `attachments` (array of `{ name, extension }`, possibly empty). `reporterRole`, `subject`, `replyTo`, `returnPath`, and `authenticationResultsHeader` are strings; use blank strings when absent. A blank `reporterRole` becomes `reporterRole: null` with the finding `reporter_unknown`. A blank `authenticationResultsHeader` leaves every method `unknown` with the finding `authentication_results_missing`; it is never read as a pass.

Findings per report:

| Area | Findings |
|---|---|
| Sender fields | `reply_to_domain_differs`, `return_path_domain_differs`, `display_name_impersonates_internal` (display name contains an organization label such as `northwind` or `northwind-ledger`, or the word `IT`, `Payroll`, `HR`, or `CEO`, while the address domain is neither an organization domain nor allowlisted), `from_address_unparseable` |
| Authentication | `dmarc_fail`, `dmarc_missing` (header present, no usable `dmarc=` token), `dmarc_not_pass` (softfail, neutral, none, temperror, permerror, policy), `spf_not_pass`, `dkim_not_pass`, `dkim_domain_not_aligned` (`header.d` and the From domain are not equal and neither is a subdomain of the other), `authentication_results_missing` |
| Sender domain | `sender_allowlisted` (informational), `sender_not_allowlisted`, `lookalike_domain` |
| URLs | `url_host_is_ip`, `url_shortener`, `url_credential_in_userinfo`, `url_lookalike_host`, `url_redirect_parameter`, `url_base64_parameter`, `url_non_https`, `url_unparseable`, `url_org_domain` (informational) |
| Attachments | `attachment_executable_or_macro` (exe, js, vbs, scr, bat, cmd, hta, iso, img, docm, xlsm, pptm, lnk), `attachment_archive` (zip, 7z, rar) |

Lookalike rules, applied to the sender domain and to every URL host against each organization domain and allowlisted domain. The registrable label is the label before the last one (`northwind-ledger` in `northwind-ledger.example`). A domain equal to or under a reference domain is never a lookalike.

1. `edit_distance_1_or_2`: Levenshtein distance between the registrable labels is 1 or 2.
2. `digit_or_glyph_substitution`: the labels match after replacing `0` with `o`, `1` with `l`, and `rn` with `m`.
3. `added_hyphenated_word`: the candidate label is the reference label with a hyphenated word added at either end or in the middle (`northwind-ledger-secure`).
4. `same_label_different_suffix`: the same registrable label under a different suffix (`northwind-ledger.test`).

URL handling: trim, turn `hxxp`/`hxxps` into `http`/`https`, replace `[.]` and `[:]`, then parse scheme, host, path, and query. Query values are percent-decoded up to three rounds. A value that starts with `http://` or `https://` after decoding is a redirect parameter; its target is evaluated once (depth 1) and the target's non-informational findings roll up to the URL row, which also keeps the target under `redirectTarget`. A value of 16 or more base64 characters that decodes to printable text containing `http` or `@` is recorded under `base64Decoded`, truncated to 80 characters. Each URL is classified `internal`, `allowlisted`, `suspicious` (any non-informational finding), or `external_unclassified`.

Verdict per report, in precedence order:

| Verdict | Rule |
|---|---|
| `malicious_likely` | Any of `dmarc_fail`, `lookalike_domain`, `url_credential_in_userinfo`, `url_lookalike_host`, `attachment_executable_or_macro` |
| `suspicious` | Any other finding that is not informational and not in the undetermined set |
| `undetermined` | Only findings from the undetermined set remain (`authentication_results_missing`, `reporter_unknown`, `sender_not_allowlisted`, `dmarc_not_pass`), or the legitimate conditions are not all met |
| `likely_legitimate` | Sender allowlisted, DMARC pass, DKIM pass and aligned, no non-informational URL finding, no reply-to mismatch |

Every row carries `confidence: 'rule_based'`, `verdictBasis` (the findings or conditions that decided it), `ownerRole` from `routing` (`malicious` for `malicious_likely`, `other` for everything else), `recommendedActions`, and `responseToReporter`, a deterministic multiline text addressed to the reporter role.

Output: `{ reviewId, asOf, status, issues, counts: { reports, maliciousLikely, suspicious, undetermined, likelyLegitimate, urlsChecked, urlsSuspicious }, rows, evidenceRef, limitation }`. `urlsChecked` counts top-level URLs; redirect targets appear inside their URL row. `review_ready` only when every report is `likely_legitimate` and there are no issues. `needs_review` when any report has another verdict, the snapshot is incomplete, the evidence reference is blank, or the report scope is empty.

## Failure exercises

Blank the `Authentication-Results` header and confirm the methods read `unknown` and the verdict is `undetermined`, not `likely_legitimate`. Change one letter in the organization domain of a sender and confirm `lookalike_domain`. Wrap a URL in `hxxps://` and `[.]` and confirm it parses. Percent-encode a redirect target twice and confirm `decodeRounds: 2`. Put `user@` before a host. Add an `.xlsm` attachment. Duplicate a `reportId`, remove `routing`, or pass `urls` as a string; each must return `invalid_input`.

## Connect to real sources

Collect reports read-only from the reporting mailbox or the mail platform's user-report queue. Map the original message's `From`, `Reply-To`, `Return-Path`, and the `Authentication-Results` header written by the organization's own gateway (identified by its authserv-id) into this contract, and record which gateway wrote the header. Extract URLs and attachment names from the message body without rendering it. Supply `organizationDomains`, the sender allowlist, shortener hostnames, and `routing` from maintained configuration, not from the message.

Keep the response template as a draft for the service desk. Do not send it automatically, and do not block, purge, or reset anything from this node; the recommended actions are for the named owner to decide. The evaluator is a Code node; see the [n8n Code node documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/) for runtime constraints.

## Limits

The parser reads a supplied header string. It cannot detect a forged `Authentication-Results` header added by a sender before the message reached the organization's own gateway; the collector must supply only the gateway's header. Lookalike rules are heuristics and can miss homoglyphs outside the listed substitutions or over-flag short labels. URLs are never fetched, so redirect chains beyond depth 1, shortener destinations, and page content are unknown. Attachment checks use the extension only. Verdicts are triage aids for a human reviewer, not a determination, and `likely_legitimate` still requires the reporter to verify unexpected payment requests out of band.

## Source notes

Research reviewed: 2026-09-20. All sources are official documentation; the HTTP responses of the URLs were checked on that date.

| Source | Support | Application | Limits | Revisit trigger |
|---|---|---|---|---|
| [RFC 7489, DMARC](https://www.rfc-editor.org/rfc/rfc7489), IETF, March 2015 | DMARC result semantics and identifier alignment with the RFC5322.From domain | `dmarc_fail`, `dmarc_missing`, `dmarc_not_pass`; From domain used as the alignment anchor | Informational RFC; the node reads a reported result and does not evaluate policy itself | DMARCbis publication or a change in result vocabulary |
| [RFC 7208, SPF](https://www.rfc-editor.org/rfc/rfc7208), IETF, April 2014 | SPF result names (pass, fail, softfail, neutral, none, temperror, permerror) | Accepted `spf=` values; `spf_not_pass` | The node does not check DNS records or the connecting IP | Update to the SPF result set |
| [RFC 6376, DKIM](https://www.rfc-editor.org/rfc/rfc6376), IETF, September 2011 | Signing domain `d=` identifies who signed | `header.d` capture; relaxed alignment for `dkim_domain_not_aligned` | Signature validity is taken from the reported result, not verified | DKIM update or new alignment guidance |
| [RFC 8601, Authentication-Results header](https://www.rfc-editor.org/rfc/rfc8601), IETF, May 2019 | Header layout: authserv-id, then `;`-separated method results with properties such as `smtp.mailfrom`, `header.d`, `header.from` | Parser splits on `;`, strips comments, reads `method=result` and property tokens; blank header stays `unknown` | The parser trusts that the supplied header was written by the organization's gateway | Header syntax revision or a gateway that emits a different format |
| [RFC 2606, reserved example domains](https://www.rfc-editor.org/rfc/rfc2606), IETF, June 1999 | `.example`, `.test`, `.invalid` are reserved and never resolve | All fixture domains use these suffixes | None | Change to reserved names |
| [CISA, recognize and report phishing](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing), CISA, date unknown | Reporters should not click links, should report suspected messages, and should verify unexpected requests | Response template wording and recommended actions | General guidance, not a triage standard | Page revision |
| [n8n Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), n8n, date unknown | Run Once for All Items mode, `$input.all()`, item and `pairedItem` shape | Evaluator structure and output items | The lab has not yet run this workflow; UI import is untested | n8n Code node version change |

## Runtime evidence

On September 20, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8** through the [isolated runtime lab](../../labs/n8n-runtime/README.md), which records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
