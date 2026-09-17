# Review service-desk quality and improve the next week

A fast ticket response is useful when it leads to owned work and a verified outcome. Review speed alongside accuracy, communication, access boundaries, and recurring failure. This guide proposes a small review a VC or PE IT lead can run with an internal team or managed provider.

The measures and examples below are original proposed practices. They are not benchmarks, contractual service levels, or evidence of a completed service review. Use the [service-level management guide](service-level-management.md) for clock definitions, sample targets, and reporting rules.

## Define the review population

Agree the period, services, queues, entities, and providers in scope. Export or inspect records through an authorized route and keep personal and sensitive case material in its protected system. Preserve an internal evidence reference for the review, including extraction time and known gaps.

Inspect all materially serious or breached cases and a stated sample of routine completed work. Include a selection of reopened, transferred, paused, declined, and still-open cases. Record why the sample was chosen. A targeted sample can reveal a defect; it does not establish the defect rate across the whole population.

## Review the work itself

| Question | Evidence to inspect | Follow-up if it fails |
|---|---|---|
| Was the request correctly understood? | Business impact, required outcome, classification and priority rationale | Correct intake guidance and the affected case |
| Was authority appropriate? | Approved scope, identity checks, current delegation or standing procedure | Review the unauthorized or ambiguous action through its proper process |
| Did a person own the next step? | Named coordinator, receiving-team acceptance, checkpoint | Repair the handoff and assign coverage |
| Were updates useful? | What changed, next action, owner, uncertainty, next update time | Improve the update standard; avoid generic “working on it” messages |
| Did the outcome actually work? | Current-state result, business-task verification, limitations | Reopen or link a follow-up; preserve the earlier closure history |
| Was unfinished work visible? | Accepted workarounds, open assets, vendor follow-up, exception expiry | Assign the remaining work and correct misleading closure |
| Were the clocks trustworthy? | Original timestamps, calendar, pause basis, reassignment/reopen history | Correct the measurement with an audit trail; do not overwrite inconvenient history |
| Did the case create reusable learning? | Corrected knowledge article, problem record, or tested improvement | Assign a proportionate improvement with an observable check |

Use pass, needs correction, not applicable with reason, or evidence insufficient for each sampled criterion. Keep material access or security failures visible individually rather than averaging them into a quality score.

## Read metrics with their limits

Pair the adopted response and restoration measures with these supporting views:

- **Open work:** age by priority and work type, oldest unresolved items, current owner, next action, and overdue checkpoints. Completed-ticket averages exclude work that never reached completion.
- **Reopened work:** a defined cohort, the observation window, why the case reopened, and whether it reflects incomplete repair, a new issue, or premature closure. New closures without the full observation window need a separate label.
- **Transfers:** count handoffs and time without accepted ownership. Transfers can be appropriate; repeated bouncing without a new diagnostic contribution is the issue.
- **Approval and supplier waits:** show the reason, accountable internal owner, wall-clock age, and service-level clock treatment. A paused contractual metric does not make the user's delay disappear.
- **Requester feedback:** show responses received and invitations sent, plus the main themes. A high rating from a small responding group is not an assessment of every user.
- **Repeated service impact:** link related incidents to a problem or improvement record, preserving uncertainty about cause. Similar symptoms are not proof of a shared cause.

Separate incident, standard request, new-software review, planned personnel event, and project work. A delayed contract review and a failed emergency response should not disappear into the same average. State denominators and exclusions beside every percentage.

## Turn a review into changes somebody owns

Use a short action record: defect observed, supporting case references, proposed correction, owner, due date, affected procedure, and effectiveness check. Choose a few consequential improvements that the team can complete. Editing a knowledge article counts as an editorial action; demonstrating that another operator can use it is a separate check.

Atlassian's postmortem guidance emphasizes learning from actions, impact, and the information available at the time. Apply that approach to consequential incidents without treating individual blame as the explanation. [Incident postmortem guidance](https://www.atlassian.com/incident-management/postmortem), reviewed September 17, 2026.

For repeated incidents, distinguish the restored service from the unresolved cause investigation. A problem record needs an owner and decision path; it must not keep every related ticket open indefinitely or hide a recurrence. A proposed technical repair may require a change record and an appropriate test before release.

## Fictional review example

A sample of eight closed routine requests finds two cases without the required outcome evidence. Report **six of eight sampled cases met this closure-evidence criterion; two need review**. Do not report a 75% success rate for the entire desk, and do not call the two services broken without investigating their actual state.

One case was marked delivered when the app was assigned; the user could not launch it. Reopen the case, repair its immediate outcome, and update the [software fulfillment procedure](sops/software-request-fulfillment.md). Test the revised verification step on a later approved sample. Preserve the initial incorrect closure in the measurement history.

## A concise service-review agenda

1. Confirm coverage and measurement limitations.
2. Review ongoing serious impacts and decisions required now.
3. Examine breaches, aging work, and sampled quality defects.
4. Agree improvements, owners, and acceptance evidence.
5. Revisit earlier actions and verify whether they changed the outcome.

Use [ticket escalation](sops/ticket-escalation.md) for work that cannot wait for this meeting, and the [operating cadence](operating-cadence.md) for the wider service calendar. Actual completed reviews and provider performance records stay outside this repository.
