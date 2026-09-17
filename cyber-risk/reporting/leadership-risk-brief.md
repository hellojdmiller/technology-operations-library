# A leadership brief that leads to a risk decision

Report the exposure, evidence, and decision needed. Counts of completed work help explain progress, but they should not obscure a serious unresolved dependency.

## A one-page structure to reuse

**Period and scope:** [Dates, business services, populations, and exclusions.]

**Decision requested:** [Who needs to decide what, by when, and the consequence of deferral.]

**What changed:** [New exposure, independently verified improvement, or changed confidence since the prior period.]

| Business scenario | Current evidence and uncertainty | Proposed next step | Owner and decision date |
|---|---|---|---|
| [Plausible event and consequence] | [Observed condition, scope, evidence date, and unresolved information] | [Treatment or bounded operating restriction] | [Accountable role; unassigned if unknown] |

**Exceptions:** [Accepted residual risks, approving authority, expiry, and changes since acceptance.]

**Resources and tradeoffs:** [Operating effort, implementation cost basis, dependencies, alternatives, and expected risk reduction.]

**Verification next period:** [Specific tests that would establish improvement and the reviewer.]

## Metrics with honest denominators

| Signal | Define before using | How it can mislead |
|---|---|---|
| Privileged-access coverage | In-scope accounts, supported enforcement, exceptions, evidence date | Excluding service identities or unobserved accounts makes a percentage look stronger |
| Control evidence freshness | Applicable controls with evidence within the locally approved review interval | Fresh configuration evidence can still lack operating-effectiveness testing |
| Recovery coverage | Critical services with a valid test for the agreed content, permissions, and business use | One successful file restore does not validate every service or an outage workaround |
| Treatment aging | Open actions by business priority, owner, and time past the approved date | Closing tickets can hide unverified outcomes or risk acceptance without authority |
| AI permission changes | Approved use cases with changed data, destinations, tools, or model configuration | Counting licenses does not capture the authority granted to agents |

Use counts alongside percentages. Identify missing populations, not-applicable items, and failed tests separately. Do not present a blended maturity score as a probability of loss.

## Fictional worked example

The following figures are illustrative only; no real review occurred.

“Four critical services were in scope. Two have current recovery evidence covering content and permissions; one has an outdated test; one has no usable test record. The current-evidence count is 2/4, with the remaining services visible. We have not established whether the recovery objectives can be met for either unresolved service.

The proposed decision is to fund a bounded recovery exercise and assign a business verifier before widening the affected workspace. A provider availability commitment does not answer the missing recovery questions. The service owner will return with measured results and any remaining dependency.”

This wording makes the limitation actionable without claiming the unresolved services have failed. Use the [risk assessment example](../../documentation/cyber-risk/risk-assessment-and-treatment.md) for rating and treatment fields.

Reference: [NIST CSF 2.0 Profiles](https://www.nist.gov/cyberframework/profiles) for current and target outcomes. The measures and worked example here are original proposals. Reviewed September 17, 2026.
