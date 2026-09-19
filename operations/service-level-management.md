# Service levels that describe what the team can deliver

A useful service level tells the business what happens next, when someone will communicate, and what the team is working toward. Agree the service boundary and operating capacity before publishing a number. A timer cannot supply coverage, decision authority, a spare device, or a provider escalation route.

This guide proposes an operating method for a fictional technology function. The target matrix and timestamp cases are original **fictional, unadopted examples**. They establish no customer commitment, supplier guarantee, actual incident result, or current staffing capability.

## Keep the agreement, objective, and dependency separate

| Record | Purpose | What must be explicit |
| --- | --- | --- |
| Customer-facing service-level agreement (SLA) | Agreed service expectations and what happens when they are missed | Parties, service scope, measurement, exclusions, responsibilities, escalation, review, and applicable consequences. Only authorized parties can commit the organization. |
| Internal service-level objective (SLO) | A measurable operating goal used to improve service | Metric, target, measurement period, accountable owner, and the decision made when performance falls short. A proposed goal is not a guarantee. |
| Operational-level agreement (OLA) | Coordination between internal teams supporting an outcome | Which team receives the handoff, prerequisite information, acceptance, response, coverage, and escalation. It must leave time for the other steps in the customer outcome. |
| Supplier support commitment | The actual provider obligation supporting the service | Executed terms, entitled service and region, recognized requester, hours, severity definitions, exclusions, and escalation. A vendor's initial-response promise is not a restoration promise. |

Google SRE distinguishes a measured service indicator, its target objective, and an agreement containing consequences. Use that distinction even when the ticketing tool calls every timer an “SLA.” [Google SRE: service-level objectives](https://sre.google/sre-book/service-level-objectives/).

An internal target can be more ambitious than supplier terms, but name the gap and the funded contingency. Do not represent that aspiration as a supplier promise. The internal service owner stays accountable for coordination while another team or supplier works; assignment changes do not transfer away the customer relationship automatically.

## Agree the measurement boundary first

Record the supported entities, services, users, locations, channels, request types, exclusions, and business outcomes. Separate incidents that need restoration from requests that need approval, procurement, development, or scheduled fulfillment. A new laptop delivery or a complex project needs its own agreed scope and due date; an incident restoration target is not a universal fulfillment promise.

Specify the business calendar, named time zone, working intervals, holidays, closure dates, and owner of calendar updates. Use an IANA zone such as `America/Los_Angeles` when local daylight-saving behavior matters. Store events in UTC and display their zone; a reader's display preference must not silently change the measurement calendar. Explain coverage for traveling staff and other offices rather than assuming headquarters hours fit everyone.

Atlassian supports SLA calendars with time zones, daily working intervals, and holidays. Its configuration is a mechanism for the adopted schedule, not evidence that anyone is staffing those hours. [Atlassian: SLA calendars](https://support.atlassian.com/jira-service-management-cloud/docs/set-up-sla-calendars/).

Define the service's intake event. For these examples, `received_at_utc` is when the supported intake channel first receives the request, even if triage or ticket creation happens later. Preserve both timestamps if an integration is delayed. Unsupported-channel reports need a recorded routing rule, not an invented earlier or later start chosen to improve the result.

Agree each metric's start, qualifying event, pause policy, calendar, evidence source, reopen behavior, priority-change policy, and reporting cohort before configuration. Version the definition and retain its history. Adopt an aggregate attainment objective only after observing workload and capacity; the starter matrix below supplies per-case durations, not an asserted aggregate success percentage.

## Use words that correspond to different events

| Event or clock | Definition in this guide |
| --- | --- |
| Automated receipt | Confirms submission reached a system. Record it separately; it does not satisfy the human-response objective. |
| Human response / meaningful acknowledgement | An accountable human communicates understanding of the issue, ownership or next responsible party, the next action, and when to expect another update through the agreed channel. Opening the ticket or sending an empty “looking into it” macro is insufficient. |
| Update interval | Maximum counted time between meaningful status updates while restoration is outstanding. State progress or current uncertainty, next action, owner, and next update. Repeating an unchanged status is useful if it provides an honest checkpoint. |
| Restoration or accepted workaround | Evidence shows the agreed business capability is usable again, including any accepted restrictions. A safe workaround can restore service while permanent remediation remains open. |
| Resolution | The agreed remedy or disposition is verified, with remaining problem/change work explicitly linked. It need not mean every underlying cause has been permanently eliminated. |
| Closure | Administrative completion under the adopted acceptance process. A closure state or automatic timeout is not evidence of restoration or resolution. |

Use `received_at_utc`, `human_response_at_utc`, `restored_at_utc`, `resolved_at_utc`, and `closed_at_utc` separately. Keep update events, assignment history, priority history, pause/resume events, and evidence references. Record when the impact began if known; an availability/outage measurement can start before the ticket was received.

For the starter rules, response and restoration start at original receipt. Response never pauses. Update cadence starts at the first meaningful response, continues during a restoration hold, and stops at substantiated restoration or an explicitly agreed replacement communication plan. A missed update stays a miss even after a later update starts the next interval. Resolution follow-up after restoration needs a named owner and communication plan.

## Prioritize impact and urgency

**Impact** describes the affected business capability, population, material data exposure, and available fallback. **Urgency** describes how long the business can tolerate the condition and any real deadline. Record the reason for the combination. Executive seniority, a loud requester, or an old ticket alone does not determine priority. A single affected person can still represent a critical shared business dependency.

| Priority | Definition | Fictional scope example |
| --- | --- | --- |
| **P1 Critical** | Critical business capability unavailable or materially unsafe, with immediate impact and no acceptable fallback | A critical shared process cannot operate and the approved contingency is unavailable. |
| **P2 High** | Major impairment or an urgent business deadline, with limited fallback | A time-sensitive workflow is materially constrained but a bounded temporary method exists. |
| **P3 Normal** | Bounded impact, a usable workaround, and a non-immediate deadline | A limited group can continue through an approved alternate while the service is repaired. |
| **P4 Low** | Minor impact or planned work with flexible timing | A low-impact defect or planned improvement can be scheduled without immediate business disruption. |

These definitions are proposed local choices, not universal industry mappings. Confirm priority with business impact and revise it when facts change. Suspected compromise, fraud, urgent access removal, or a safety concern follows its authorized incident/personnel process immediately. A scheduled leaver's access cutoff is the authorized event time; a routine P3 target must never become permission to leave access active afterward.

## Fictional starter matrix — goals requiring staffing

The matching [target CSV](checklists/service-level-targets.csv) is a planning fixture, not an importable platform configuration. All rows are `not_adopted` and `proposed_internal_objective`.

| Priority | Meaningful human response | Update interval | Restore / acceptable-workaround objective | Required coverage |
| --- | --- | --- | --- | --- |
| P1 Critical | 30 elapsed minutes | 60 elapsed minutes | 4 elapsed hours | Funded 24×7 primary/backup response, incident authority, tested paging and supplier escalation |
| P2 High | 2 business hours | 4 business hours | 16 business hours | Staffed queue, alternate, and a usable specialist/provider handoff during the service window |
| P3 Normal | 4 business hours | 8 business hours | 24 business hours | Staffed queue, daily review, service owner, and planned specialist capacity |
| P4 Low | 8 business hours | 16 business hours | 40 business hours | Staffed queue, scheduled backlog capacity, and a progress owner |

Fixture calendars: `EX-CONTINUOUS-UTC` counts all minutes, including weekends and holidays. `EX-BUSINESS-UTC` counts **Monday–Friday 09:00–17:00 UTC**, with no lunch exclusion and one deliberately invented closure day: **2026-09-16**. That date is not presented as a real public holiday. All business-hour values mean counted hours; “24 business hours” here spans three full eight-hour working days, not one calendar day.

Do not adopt P1 continuous targets without continuous staffing and tested reachability. If the actual model has limited coverage, disclose that limitation, define the urgent route, and obtain a business decision on additional coverage or a different offering. A person informally checking a phone is not a funded on-call arrangement. Test load, absence cover, authority, provider delays, and realistic workaround capability before treating any restoration objective as achievable.

## Pause carefully, with an audit trail

The following are proposed rules for the examples; actual customer and supplier agreements may use different exclusions. Atlassian exposes separate start, optional pause, and finish conditions, so conditions need deliberate configuration and validation. [Atlassian: SLA conditions](https://support.atlassian.com/jira-service-management-cloud/docs/set-up-sla-conditions/).

| Waiting state | Starter restoration-clock treatment | Record and action |
| --- | --- | --- |
| Specific essential customer input is unavailable | A non-P1 restoration clock may pause after meaningful contact, only if the pre-agreed rule applies and useful work truly cannot continue | Missing input, requester notification, reason, pause time, accountable owner, next review, resume event, and approver/rule reference. |
| Supplier is investigating or supplying parts | Continue the internal/customer-facing clock by default | Keep supplier case and its own contract clock separate; escalate the dependency and seek a workable contingency. |
| Internal queue, reassignment, staff absence, approval delay, or unclear ownership | Continue counting | Assign the internal blocker; do not reclassify it as customer waiting. |
| Outside the agreed business calendar | Excluded by that calendar, not a discretionary pause | Preserve the calendar/version and still show gross elapsed wait. P1 continuous coverage keeps counting. |
| Active P1 condition | No pause in these fixtures | Continue incident coordination and communication; a missing input is a risk to manage. |

Resume at the actual qualifying event, not when an agent later notices it. Do not backdate a pause to hide already elapsed time. A factual correction needs evidence, original and corrected values, reviewer, and reason. Subtract only the union of approved pause intervals that overlaps the counted calendar; never double-subtract overlapping pauses or out-of-hours periods.

Keep three values distinct: **gross wall time** from receipt to event/cutoff, **scheduled time** within the adopted calendar, and **measured time** after eligible pauses. Some product labels are surprising: ServiceNow's Task SLA documentation defines its “Actual Elapsed Time” after pause subtraction. Therefore map the platform field to the adopted metric; do not assume it is unadjusted customer wait. [ServiceNow: Task SLA timing fields](https://www.servicenow.com/docs/r/it-service-management/service-level-management/r_TaskSLATable.html).

## Preserve the clock through lifecycle changes

| Change | Measurement rule for this guide |
| --- | --- |
| Reassignment or team handoff | Preserve original receipt and all elapsed time. An internal acceptance timer can be additional; it does not replace the customer clock. |
| Priority change | Retain old/new priority, reason, approver, time, targets, and computed deadlines. Here the revised deadline is recomputed from original receipt using the revised calendar and valid event/pause history. Report original and revised results separately; an immediate revised-target breach is not a claim that the earlier priority already carried that obligation. A downgrade cannot erase a historical breach. A separate incident activation clock may begin at escalation without replacing either. |
| Reopened after unsupported restoration or premature closure | Preserve the earlier marker and correction; use the first substantiated outcome for the original clock. Record the reopen/quality defect. A status change earns no “restored” interval without evidence. |
| Genuinely restored, then a distinct recurrence | Preserve the completed episode and link a new episode with its own impact/start evidence. Report recurrence and cumulative user impact. Do not invent a new incident merely to reset a difficult case. |
| Duplicate request | Link to the primary and preserve both receipts and each requester's communication history. Deduplicate restoration episodes under the agreed rule; retain separate eligible response obligations unless the agreement defines grouped notification. Duplicate classification is not a restoration result. |
| Cancellation or withdrawn request | Record who authorized it, why, and the actual time. Report separately from fulfilled/restored work; preserve any breach that occurred before cancellation. Cancellation must not turn a missed target into a met one. |

Tool behavior must match the policy. Atlassian documents that priority changes can retain tracked time, while changes to SLA start/stop conditions can alter open cycles. Version definitions, inspect the history, and test representative cases before rollout. [Atlassian: creating and editing SLAs](https://support.atlassian.com/jira-service-management-cloud/docs/create-an-sla/).

ServiceNow supports schedule, time-zone, retroactive-start, pause, and reset conditions. It also treats a configured “day” duration as a 24-hour block, which can span several business days. These mechanics are a reason to use explicit counted minutes and inspect timelines, not permission to reset on reassignment. [ServiceNow: SLA definitions](https://www.servicenow.com/docs/r/it-service-management/service-level-management/t_CreateAnSLADefinition.html).

## Escalate before the target becomes a surprise

Assign a named case owner, backup, escalation recipient, and coverage interval. Escalate when impact warrants it, a needed capability or decision is unavailable, an update is missed, or the remaining time is insufficient for the next dependency. A pending breach is a planning signal; an actual breach needs an owner and revised business expectation, not a quieter dashboard color.

The receiving team must acknowledge the handoff. Record the provider's recognized requester, correct support route, entitlement, next action, and agreed update. Provider priority labels may differ; translate the business impact explicitly. Keep the firm's coordinator responsible for communication and contingencies. A supplier response within its contract can coexist with a missed internal restoration objective.

Use [ticket intake and triage](sops/ticket-intake-and-triage.md), [ticket escalation](sops/ticket-escalation.md), and [ownership and escalation](succession/ownership-and-escalation.md) for the associated workflow. Numerical targets never replace authorization, incident severity assessment, or a legally or contractually determined event deadline.

## Report a fixed population without hiding unfinished work

For the default operational report, choose an **intake cohort** using original receipt within a stated period. Freeze the cohort definition, metric version, calendar, priority treatment, exclusions, and report-as-of time. Evaluate response and restoration separately; they have different outcomes and clocks. Do not blend a closure-month cohort with an intake-month denominator.

Show all of these counts for each priority and metric:

- **Met:** a qualifying event is evidenced within its applicable target.
- **Breached:** the event occurred late, or an open case has already exceeded its counted allowance. Preserve original/revised results and any historical breach separately.
- **Open, not yet due:** no qualifying event and the allowance is not yet exceeded. This is pending, not met.
- **Unverifiable:** event/history evidence is missing or contradictory. A blank response field can mean “no response observed” only when the event source is reliable; otherwise show unknown.
- **Excluded with reason:** duplicates, cancelled/withdrawn items, outside-scope records, and genuinely inapplicable metrics under the agreed rule. Report counts and any pre-exclusion breaches; do not silently remove them.

When reporting `met / (met + breached)`, label it **attainment among decided outcomes** and publish pending, unverifiable, and excluded counts beside it. It is not final attainment for the full intake cohort. Show how much of the cohort has a decided outcome, then revisit the same cohort after more cases mature. Small P1 populations should show counts and cases, not a reassuring percentage alone.

Show gross elapsed wait, counted wait, approved pause totals, age of open breaches, reopens, priority changes, supplier dependency time, and quality defects. Report median and tail duration only with their population and units. Completed-case durations omit ongoing cases; open cases are **right-censored** at the report time, meaning their final duration is still unknown. Do not insert their current age as a completed duration or omit their aged backlog from the accompanying report. Use an appropriate time-to-event analysis if a combined distribution is needed.

Review patterns that can game the measure: bot acknowledgements counted as responses, empty updates, premature closure, downgrade after a miss, cancellation of old work, customer-hold misuse, and calendar edits that erase elapsed time. Keep immutable events and corrections; investigate the process rather than rewarding ticket state changes.

## Keep availability separate

Response speed describes the support experience. It does not measure whether the business service works. Define a separate availability or successful-transaction indicator around the user's critical action, supported population, observation coverage, measurement window, and missing-data handling. Report affected-user impact and outages even if no ticket was created. A supplier status page or uptime promise is only one input to the firm's end-to-end experience.

Google's SRE workbook recommends user-centered indicators with explicit event populations and documented measurement implementations. That supports keeping service reliability distinct from ticket throughput; it does not prescribe the fictional desk targets here. [Google SRE: implementing SLOs](https://sre.google/workbook/implementing-slos/).

## Worked clock cases and CSV dictionary

[sla-measurement-cases.csv](checklists/sla-measurement-cases.csv) contains six **synthetic calculations**, not operational evidence. All timestamps use UTC and the fixture calendars above. Friday is 2026-09-11; Monday is 2026-09-14; the invented closure day is Wednesday 2026-09-16. Exactly at the target counts as met if the event occurs then; an open case becomes breached once its allowance is exceeded.

| Case | Manual counted-time calculation | Result |
| --- | --- | --- |
| SLA-EX-001: P3 response over a weekend | Friday 16:30–17:00 = 30 min; Monday 09:00–10:00 = 60; total **90** | Met 240-min goal. Gross wait is 3,930 min, or 65h30m. |
| SLA-EX-002: P2 restoration with a documented customer hold | Monday 10:00–17:00 = 420; Tuesday 09:00–15:00 = 360. Subtract hold overlap of 300 + 120 = 420; measured **360** | Met 960-min goal. Gross wait 1,740 min; updates continue during the hold. |
| SLA-EX-003: P2 response after two assignments | Monday 09:15–11:45 = **150**; assignments at 10:00 and 10:45 subtract nothing | Missed 120-min goal by 30 min. |
| SLA-EX-004: P1 has only a bot receipt | Saturday 18:00 to report cutoff 19:15 = **75** elapsed min | Open breach, at least 45 min late against a 30-min goal. This is open age, not a completed response duration. |
| SLA-EX-005: P3 unsupported early restoration and reopen | Monday 09:00–17:00 = 480; Tuesday 09:00–11:00 = 120; total **600**. The unproven Monday 11:00 marker earns no deduction. | First substantiated restoration meets 1,440-min goal; reopen and verification defect remain reportable. |
| SLA-EX-006: P3 raised to P2 across the invented holiday | Tuesday 16:00–17:00 = 60; Wednesday = 0; Thursday 09:00–11:00 = 120; total **180** | Original P3 240-min goal met; revised P2 120-min goal missed by 60. The revised deadline was Thursday 10:00. |

The target CSV records priority/label, impact-and-urgency definition, clock basis, calendar/time zone/service window/holiday list, response/update/restoration minutes, target type, staffing prerequisites, scope notes, adoption status, and `fictional`. Durations are numeric minutes on the specified calendar. No row supplies an adopted contractual term or aggregate attainment percentage.

The case CSV records case/priority/metric/calendar, start/end timestamps, end type, gross/scheduled/paused/measured minutes, current and previous target minutes, outcome, event history, manual arithmetic, and `fictional`. `end_type=open_as_of` is an observation cutoff with no completed event. An empty `previous_target_minutes` means no prior target is modeled, not a zero-minute goal. These are single-metric cases; they do not assert that response, updates, restoration, and resolution all succeeded on the same ticket.

Primary sources were reviewed on **2026-09-17**. They support the cited definitions and platform mechanics. The priority mapping, example targets, lifecycle rules, reporting method, and fixtures are proposed original operating choices that require local review and platform validation. No live SLA configuration was read or changed.
