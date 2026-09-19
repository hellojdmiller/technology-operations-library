# Run cyber risk as an operating process

I start with the work the firm needs to keep doing: make decisions, protect deal information, communicate with investors, and move money through authorized processes. The useful question is what could interrupt that work, what would limit the damage, and what evidence supports the answer.

This is a proposed operating model for a small organization. Cadences, owners, and examples require local adoption. It is not an assessment of a real organization.

## Start with business scenarios

| Business activity | Plausible failure | Evidence worth asking for |
|---|---|---|
| Investor and fund operations | A convincing payment-change request bypasses verification | A synthetic exception test showing the finance owner follows the independent verification route |
| Deal collaboration | Former participants retain access to a restricted workspace | An access population reconciled to decisions, followed by allowed and denied access checks |
| Partner travel | Lost equipment or an identity lockout interrupts a time-sensitive decision | A tested recovery route with a reachable alternate and usable replacement access |
| Knowledge and AI | A connector sends restricted material beyond the approved workspace | A data-flow review and synthetic tests of access, destination, and action restrictions |
| Core SaaS | A provider or identity outage prevents normal work | A dependency map, alternate communications, and a business recovery exercise |

Keep the management company, funds, fund administrator, and portfolio companies distinct. An investment relationship does not establish operating authority over another company. Record contractual dependencies and explicit support agreements. See [portfolio boundaries](../library/portfolio-support-boundaries.md).

## Give the decisions an owner

The business sponsor decides which activities are critical and the tolerable interruption. A risk owner decides among treatment options within delegated authority. The technology owner proposes and implements controls. A reviewer checks the evidence; use a second person for consequential changes where practical. Legal/Compliance interprets applicable obligations. Outside providers supply evidence and operate their assigned services; outsourcing does not assign every business decision to them.

One person may hold several roles in a small firm. Record the overlap and arrange a compensating review instead of creating fictional separation. A control owner cannot quietly accept a risk reserved for the sponsor.

## Keep four records connected

1. A service inventory defines the boundary, owner, dependencies, and information involved.
2. A risk record describes a scenario, consequence, evidence, uncertainty, and treatment decision.
3. A control test records the expected behavior and observed result for a specific scope and version.
4. An exception records the unresolved condition, compensating measures, decision authority, expiry, and trigger for reconsideration.

Use [the existing assessment example](../documentation/cyber-risk/risk-assessment-and-treatment.md), the [control library](controls/README.md), and [working templates](templates/README.md). Link protected evidence by internal reference; do not copy tenant exports, live weaknesses, or approval records into this repository.

## Move from a finding to a decision

Describe the failure condition before choosing a product. Compare a process change, a configuration change, a purchased capability, and a reduced operating scope where each is feasible. State the burden on the operator and the recovery path if the treatment fails. Implementation can be complete while effectiveness remains unknown.

Use qualitative priorities with a rationale, or the approved scoring method. A count of tools, passed questions, or framework tags is not a risk score. Missing evidence increases uncertainty; it does not prove either safety or compromise. Preserve inherent and residual risk separately and record why a tested control changes the scenario.

## Keep a small review rhythm

Hold an operational review for current exceptions and changed services, and a leadership review for decisions, overdue exposure, and business tradeoffs. The [recurring checklist](checklists/recurring-review.md) proposes a starting cadence. Event-driven review after a new integration, permission expansion, incident, or ownership change matters as much as the calendar.

Use NIST's [CSF 2.0](https://www.nist.gov/cyberframework) functions as coverage prompts and [Current and Target Profiles](https://www.nist.gov/cyberframework/profiles) to structure improvement. These resources organize outcomes; they do not certify this collection or prescribe its operating schedule. References reviewed September 17, 2026.
