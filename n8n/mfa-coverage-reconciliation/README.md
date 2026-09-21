# MFA coverage reconciliation

Reconcile a fictional identity export (users, registered MFA methods, last sign-in) against an HR roster and a privileged-role list. The output is a review queue, not a score: accounts with no method or only weak methods, privileged accounts without a phishing-resistant method, enabled accounts with no roster match or a terminated roster status, dormant enabled accounts, active workers with no account, and every unknown. Registration is not enforcement. A registered security key does not prove that any policy requires it. The workflow reads three snapshots and changes nothing.

## Try it

Import [workflow.json](workflow.json) using the [shared setup instructions](../README.md), then execute manually. [sample-input.json](sample-input.json) is fictional (Northwind Ledger Partners, domain `northwind-ledger.example`); [evaluate.js](evaluate.js) is the readable logic. [expected-output.json](expected-output.json) is the exact fixture result; the local tests compare the evaluator output against it.

The sample returns `needs_review` with `counts.identityUsers: 8`, `counts.rosterMembers: 8`, `counts.privilegedAssignments: 4`, and nine queue rows in this order:

| Row | Queues | Why |
|---|---|---|
| `tol-usr-001` | `privileged_without_phishing_resistant` | Two privileged roles; only `microsoftAuthenticatorPush` registered (acceptable, not phishing resistant) |
| `tol-usr-007` | `active_account_terminated_in_roster`, `dormant_enabled_account` | Roster says terminated; last sign-in 60 whole days before `asOf` against a 45 day threshold |
| `tol-usr-006` | `active_account_no_roster_match` | Enabled member whose `employeeId` is not in the roster |
| `tol-usr-003` | `not_enrolled` | Enabled member with no registered method |
| `tol-usr-004` | `not_enrolled` (finding `weak_methods_only`) | Only `sms` registered |
| `tol-usr-005` | `unknown` | Blank `employeeId`; `legacyHardwareToken` is outside the policy vocabulary; the tier stays `acceptable` because `softwareOath` is also registered |
| `tol-usr-990` | `unknown` (finding `privileged_member_not_found`) | Listed in a privileged role but absent from the identity export |
| `tol-emp-1006` | `roster_member_no_account` | Active worker with no identity account |
| `tol-usr-008` | `non_member_account_review` | Guest with no methods; reported separately, not as a roster mismatch |

`tol-usr-002` (privileged, `fido2SecurityKey`) has no findings and does not appear in the queue. Coverage is reported as counts: `coverage.privileged` is `inScope: 3, phishingResistant: 1, unknown: 1`, with the unknown member listed rather than excluded. Every row has `decision: pending_human_review`.

## Input contract

Supply one n8n item per review packet.

| Field | Contract |
|---|---|
| `reviewId`, `evidenceRef` | Nonblank review identifier and restricted export evidence reference (`fixture://` in the sample) |
| `asOf` | Review date, `YYYY-MM-DD`; day arithmetic uses UTC calendar days |
| `snapshotComplete` | Boolean stating that collectors reconciled scope and pagination for all three sources |
| `dormantAfterDays` | Positive integer; the threshold is inclusive |
| `matching` | `{ "key": "employeeId" }`; any other key is `invalid_input` |
| `methodPolicy` | `phishingResistant`, `acceptable`, and `weak` arrays of unique nonblank method names; the three arrays must be disjoint |
| `identityUsers` | Array with unique `userId` values |
| `hrRoster` | Array with unique `employeeId` values |
| `privilegedRoles` | Array with unique `roleId` values |

Each identity user needs `userId`, `userPrincipalName`, boolean `accountEnabled`, `userType` (`member`, `guest`, `service`, or another nonblank label), `lastSignInAt` (ISO 8601 UTC timestamp ending in `Z`, no later than `asOf`, or explicit `null`), `registeredMethods` (array of unique nonblank strings, possibly empty), `mfaCapable` (boolean or `null`), and `employeeId` (string; blank when unknown).

Each roster row needs `employeeId`, `workerStatus` (`active`, `leave`, `terminated`, or another nonblank label), and string `managerRole` and `department` (blank allowed). Each privileged role needs `roleId`, `roleName`, and `memberUserIds` (unique nonblank `userId` values).

Method names are matched exactly against `methodPolicy`. The fixture vocabulary is simplified; map your source's names into it before matching. Roster matching uses `employeeId` only. `userPrincipalName` matching is deliberately not used: names are renamed, reassigned, and shared across tenants, so a name match is not an identity match.

Per-user results:

| Field | Values |
|---|---|
| `enrollment` | `phishing_resistant` (any phishing-resistant method), `acceptable` (any acceptable method, none phishing resistant), `weak_only`, `not_enrolled` (no methods, `mfaCapable` stated), `unknown` (only unrecognized methods, or no methods with `mfaCapable: null`) |
| `rosterMatch` | `matched`, `no_roster_match`, or `employee_id_missing` (blank id; never treated as matched or unmatched) |
| `privilegedRoles` | Role ids that list the user |
| `dormant` | Enabled account whose last sign-in is at least `dormantAfterDays` whole UTC days before `asOf` |

An unrecognized method beside recognized ones adds the finding `method_unrecognized` and queues the row under `unknown`, but does not change the tier. Queue categories in priority order: `privileged_without_phishing_resistant`, `active_account_terminated_in_roster`, `active_account_no_roster_match`, `not_enrolled` (members only; weak-only rows carry `weak_methods_only`), `dormant_enabled_account`, `unknown`, `roster_member_no_account`, `non_member_account_review` (enabled guests and service accounts). A row lists every category it belongs to and sorts by its highest.

`review_ready` means the packet has no queue rows and no issues. It does not mean MFA is enforced. `needs_review` covers any queue row, an incomplete snapshot, blank evidence, or empty identity or roster scope.

## Failure exercises

Put `softwareOath` in `weak` as well as `acceptable`; the packet must be `invalid_input`. Set `matching.key` to `userPrincipalName`; same result. Blank a privileged user's `employeeId`; the row must land in `unknown`, not `matched`. Give a member `registeredMethods: []` and `mfaCapable: null`; the enrollment must be `unknown`, not `not_enrolled`. Set a last sign-in exactly 45 days before `asOf`; it must be dormant. Duplicate a `userId`, an `employeeId`, or a `roleId`; the packet must be invalid rather than picking one. Set `snapshotComplete: false` and `evidenceRef: ""`; both must appear in `issues`.

## Connect to real sources

Replace the sample-data node with read-only collectors: a registration-details report (for example Microsoft Graph `userRegistrationDetails`, which exposes `methodsRegistered`, `isMfaCapable`, and `userType`), a sign-in activity export, the HR roster, and a directory-role membership export. Map each source's method names into `methodPolicy` explicitly; leave anything you cannot classify out of every tier so it surfaces as `method_unrecognized`. Keep source timestamps, export totals, and page counts in the referenced evidence and set `snapshotComplete` only after reconciling them.

Registration is only half the question. Whether a phishing-resistant method is required for privileged access is a Conditional Access (or equivalent) policy question; review those policies separately and record the result alongside this queue. Do not present a coverage percentage: report `inScope`, `phishingResistant`, and `unknown` counts and list unresolved accounts, as the [leadership brief guidance](../../cyber-risk/reporting/leadership-risk-brief.md) on privileged-access coverage describes.

Configure credentials in n8n's credential store, restrict execution-data retention (this packet carries sign-in data and HR status), and use a test workspace first. If a downstream step creates tickets, gate on packet status and individual findings, keep unknowns separate from failures, and leave account or policy changes to a person with authority.

## Limits

The evaluator compares three supplied snapshots. It does not read policy, verify that any method works, or detect accounts absent from the export. `mfaCapable` is passed through, not derived; a `true` value with an empty method list is reported as `not_enrolled` on the evidence of the method list, so reconcile the two in your collector. A disabled account is never queued for enrollment, roster, or dormancy reasons, and a roster member whose only account is disabled is not listed as `roster_member_no_account`. Guests and service accounts are reported for separate review rather than judged against the member rules. Whole-day arithmetic is coarse; incident timelines need exact timestamps. Nothing here is an approved control or a complete MFA standard.

## Source notes

Research reviewed: 2026-09-20. Every external source is official documentation from its publisher. Dates are those shown on the page; where the page shows none, the date is marked unknown.

| Source | Support | Application | Limits | Revisit trigger |
|---|---|---|---|---|
| [NIST SP 800-63B Rev. 4, Digital Identity Guidelines: Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html), page updated 2025-08-26 | Phishing resistance is the protocol's ability to keep secrets and authenticator outputs from an impostor verifier without relying on claimant vigilance; manually entered OTP and out-of-band outputs do not qualify | Three-tier `methodPolicy`; OTP, push, and temporary access pass sit in `acceptable`, never `phishingResistant` | The revision seen is Rev. 4 on the NIST pages site; section numbers were not pinned | NIST revises 800-63B or its phishing-resistance definition |
| [CISA, Implementing Phishing-Resistant MFA (fact sheet)](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf), October 2022 | Not all MFA is equal: SMS and voice codes can be intercepted, push can be bombed, and FIDO/WebAuthn or PKI-based methods are the phishing-resistant forms; prioritize high-value accounts | `weak` tier for `sms`, `voice`, `email`; privileged rows queued first | Written for US agencies; the PDF carries no machine-readable title metadata and only part of its text was extracted during review | CISA supersedes the fact sheet |
| [Microsoft Entra authentication overview](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-methods), article date 2026-04-30 (the cited URL resolves to `overview-authentication`) | Lists supported methods and names Windows Hello for Business, platform credential, passkeys (FIDO2), FIDO2 security keys, passkeys in Authenticator, and certificate-based authentication as phishing resistant | Fixture vocabulary and the sample `phishingResistant` list | Fixture names are simplified and do not match Graph or portal strings one to one | Method list or phishing-resistant designations change |
| [Conditional Access authentication strengths](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths), 2025-03-04 (updated 2026-06-26) | The built-in phishing-resistant MFA strength allows FIDO2 security key, Windows Hello for Business or platform credential, and multifactor certificate-based authentication; strengths are Conditional Access controls evaluated after initial authentication | README statement that registration is not enforcement and that policy review is a separate check | Requires Entra ID P1; external authentication methods are not covered by strengths | Built-in strength definitions change |
| [Microsoft Graph `userRegistrationDetails` (v1.0)](https://learn.microsoft.com/en-us/graph/api/resources/userregistrationdetails), 2024-07-22 (updated 2025-12-03) | Exposes `methodsRegistered`, `isMfaCapable`, `isMfaRegistered`, `isAdmin`, `userType`, and `lastUpdatedDateTime`; `isMfaCapable` depends on the authentication methods policy | `registeredMethods`, `mfaCapable`, and `userType` fields; mapping advice in "Connect to real sources" | Report freshness is `lastUpdatedDateTime`, not real time; licensing applies; sign-in activity comes from a different resource | Property list or method name enumeration changes |
| [Leadership risk brief](../../cyber-risk/reporting/leadership-risk-brief.md), library document reviewed 2026-09-17 | Privileged-access coverage must define in-scope accounts, enforcement, exceptions, and evidence date; excluding unobserved accounts makes a percentage look stronger | `coverage` block reports counts with explicit `unknown` and no percentage | Library guidance, not an external standard | Brief structure or metric guidance changes |
| [n8n Code node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), date unknown | Run Once for All Items executes the code once for every input item | Node mode and the `$input.all()` packet loop | Page shows no update date; version behavior belongs to the runtime lab, not this README | Code node modes or input API change |

## Runtime evidence

On September 20, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8** through the [isolated runtime lab](../../labs/n8n-runtime/README.md), which records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
