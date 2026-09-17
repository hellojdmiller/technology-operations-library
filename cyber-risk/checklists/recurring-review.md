# A recurring cyber-risk review checklist

Use a predictable review to catch drift, ownership gaps, and evidence that no longer describes the environment. These are suggested frequencies to adapt to the business, threat exposure, obligations, and staffing; they are not framework requirements or a substitute for event monitoring.

Maintain a private queue with item, accountable owner, population and sample, last evidence date, outcome, action, and next due date. Every review should show what could not be observed.

| Rhythm | Review | Evidence and decision |
|---|---|---|
| During normal operations | Triage alerts and suspected incidents according to the approved coverage model | Case disposition, unanswered alerts, route failures, and escalation; do not imply 24-hour coverage if it does not exist |
| Weekly | New privileged access, unusual grants, emergency account use, failed jobs, and overdue high-priority work | Change context and owner decisions; separate expected maintenance from unresolved changes |
| Weekly | Joiner, mover, and leaver completion across critical systems | Reconciled source population, unfinished downstream tasks, and verified removals; tickets marked done are inputs to review |
| Monthly | Service and integration ownership; support accounts and unused permissions | Named owner, justified scope, review date, and approved cleanup plan |
| Monthly | Device and workload exposure | Supported-version and patch evidence, missing populations, known exploited exposure relevant to actual assets, and approved remediation windows |
| Monthly | Evidence freshness, security-event retrieval, and alert routes | Current sources, gaps, usable retrieval, and a bounded synthetic route test where appropriate |
| Monthly | AI use cases and changed capabilities | Newly enabled connectors, writable tools, destinations, model changes, and evaluation results |
| Quarterly | Business-owner access certification and sensitive external collaboration | Full population basis, review decisions, implementation evidence, and allowed/denied checks |
| Quarterly | Critical-service recovery and dependency rotation | A selected recovery exercise with measured outcomes; rotate services so scope does not silently exclude difficult systems |
| Quarterly | Critical vendors and exceptions | Material changes, current attestations where relevant, unresolved findings, approved exceptions and approaching expiry |
| Quarterly | Leadership risk decisions | Changed business scenarios, overdue exposure, accepted risks due for reconsideration, and funded actions |
| At least annually as a planning example | Program scope, policy adoption, contracts, and major scenario exercises | Updated ownership, business priorities, documented obligations, and tested decisions; repeat sooner after material change |

## Event-driven triggers

- A new application, AI model, connector, skill, or tool changes the accessible data or possible actions.
- A fund launch, acquisition, office change, or new administrator changes operating responsibilities.
- An identity, domain, integration secret, backup path, or security provider changes.
- A critical vendor incident or dependency failure changes assumptions.
- An exception expires, a test fails, or a control owner departs.

For each trigger, decide whether existing evidence still applies. Reusing a screenshot after policy scope changed is not current assurance. Keep the old record for history and mark the new scope pending.

## A useful review output

Record: “Two material gaps need decisions; three evidence sources are stale; one scope is unknown.” Then state owners, business impact, and next actions. Avoid a single green percentage that hides the unresolved populations. Close actions only against their acceptance criteria, and record the failed case that was retested.

Use the [control test record](../templates/control-test-record.md) and [leadership brief](../reporting/leadership-risk-brief.md). NIST's [Organizational Profiles](https://www.nist.gov/cyberframework/profiles) support reviewing current and target outcomes; the schedule above is a proposed operating choice. Reviewed September 17, 2026.
