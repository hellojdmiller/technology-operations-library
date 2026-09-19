# A working cadence for technology operations

A useful operations review answers three questions: can people do their work, what needs a decision, and who is following through? Use this cadence to connect the ticket queue, service owners, providers, and upcoming business deadlines.

This is a proposed schedule for a fictional firm. Frequencies and response targets require local agreement. It is not evidence that the activities occurred or a substitute for contracted service terms.

## Set up the operating record

Keep one work record per issue, with a stable ID, business impact, accountable owner, next action, due time and time zone, evidence reference, and next update. Link related changes, incidents, and decisions instead of copying their contents into a second tracker.

The operations lead runs the review. The provider reports its work and unresolved dependencies. Business owners confirm impact and acceptance. The sponsor decides priorities, funding, and risks outside delegated authority. Assign a backup for the review itself.

Use the [service catalog](../library/templates/service-catalog.csv), [decision and action log](templates/decision-and-action-log.csv), and [exception register](templates/exception-register.csv). Store actual records in a protected internal system, outside this example repository.

## Daily: establish the next safe action

1. **Check intake and coverage.** Confirm that requests and alerts are reaching the monitored queue and that a named person is covering it. A quiet queue can mean a broken integration; compare it with the intake source and a safe test where authorized.
2. **Review consequential exceptions first.** Identify service disruption, suspicious access, failed protection jobs, overdue removals, and time-sensitive access requests. Use the relevant response procedure; the daily meeting must not delay incident escalation.
3. **Look ahead at business events.** Confirm support for joiners, departures, investment committee meetings, investor events, reporting deadlines, and office activity. Ask who accepts service readiness for each event.
4. **Review outstanding changes.** For a completed change, ask for observed results and outstanding side effects. For a planned change, check scope, authorization, recovery approach, and provider coverage.
5. **Assign the next action.** Record a single accountable owner, a due time, and the next update. If waiting for another party, retain an internal owner and a follow-up deadline.

Daily evidence should be a short exception list with links. Avoid collecting complete employee or investor records in a general operations brief.

## Weekly: clear ownership and recurring problems

| Review | Decision or output | Evidence that makes it useful |
|---|---|---|
| Aging work | Escalate, schedule, resolve, or explicitly defer | Age, business impact, prior attempts, next responsible party |
| Repeat failures | Investigate a common cause or accept a bounded workaround | Related cases and verified recurrence; no assumed root cause |
| Joiner, mover, leaver work | Confirm upcoming readiness and close removal exceptions | Authorized population compared with recorded application outcomes |
| Changes and automation | Continue, pause, repair, or retire a failing process | Expected versus observed results; safe replay and rollback limits |
| Documentation | Assign corrections for procedures that failed in use | Exact step, observed behavior, version, and interim instruction |
| Capacity and cover | Assign absence cover or escalate a single-person dependency | Named backup, scope, access evidence, unresolved authority |

Reserve a short decision list for the sponsor. Include the recommendation, alternatives, consequence of delay, approver, and deadline. A provider estimate is an input to that decision.

## Monthly: connect operations to ownership and cost

Review renewals before notice periods expire, unused entitlements, provider scope, open risk treatments, emergency contact currency, restore-test follow-up, and the next month's business events. Reconcile the service inventory with new purchases, integrations, departures, and decommissions.

For each recurring obligation, record its basis: policy, contract, approved business requirement, or proposed practice. Keep an internal target separate from a vendor commitment. Identify who will do the work during an absence and where the completion evidence belongs.

The [vendor lifecycle guide](../library/vendor-lifecycle.md) covers renewal decisions. The [cyber-risk recurring checklist](../cyber-risk/checklists/recurring-review.md) supplies security review detail; do not duplicate its control register here.

## Periodic and event-triggered reviews

Set the interval with the owner based on impact and change rate. Rehearse succession and emergency access after material personnel or dependency changes. Revisit service recovery assumptions after platform migrations. Review external access when a deal room closes, a service engagement ends, or its approved purpose changes.

Connect the review to actual business cycles. A quarterly reporting period may require a readiness check before it begins, even if the normal review date falls later. A signed annual calendar does not establish that this period's systems work.

## Five measures to start with

| Measure | Definition | Interpretation |
|---|---|---|
| Overdue critical actions | Open high-impact actions past their recorded due time | Show age and mitigation; do not hide them by changing the due date |
| Verified completion rate | Items whose required verification supports the stated closure criteria divided by items claimed complete | Report missing evidence and failed results separately |
| Service coverage | In-scope critical services with an acknowledged owner and tested backup path divided by all in-scope critical services | State inventory completeness and test dates |
| Repeat disruption | Recurring incidents by service over a stated period | Investigate causes before judging team performance |
| Decision delay | Time between a complete decision request and recorded disposition | Separate missing inputs from approver response time |

These measures are proposed management tools, not industry benchmarks. If the population is incomplete, label the measure partial.

## Fictional weekly brief

**Service:** collaboration access. **Observed:** the help queue shows three requests waiting for a business owner; no service outage is established. **Decision needed:** designate an alternate approver for planned leave. **Next action:** operations lead confirms the approved alternate and routes the requests. **Verification:** each request receives a decision and an access outcome check. **Remaining uncertainty:** one request lacks a purpose and end date.

The brief ends with owners and next updates. It does not turn waiting work into a technical failure or an unapproved workaround.

## Service-desk review companions

Use [service-level management](service-level-management.md) to define response, updates, restoration, calendars, and reporting populations. Use [service-desk quality review](service-desk-quality-review.md) to inspect a small case sample for authority, accepted ownership, communications, outcome evidence, and residual work. Report aged open cases beside completed work; improving a ticket status alone does not improve the user outcome.

## Change, asset, and remediation reviews

Use the [change pack](packs/change-management/README.md) for upcoming windows, conflicting work, failed changes, and model recertification. Use the [asset pack](packs/asset-lifecycle/README.md) to reconcile custody and management observations and review held or retired equipment. Use the [patching pack](packs/patching/README.md) for applicability, deployment failures, overdue remediation, and expiring exceptions. Keep each finding attached to an owner and the next evidence needed.
