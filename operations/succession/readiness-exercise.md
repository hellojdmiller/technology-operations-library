# Test whether another operator can perform the work

**Status:** Unexecuted exercise design. All scenarios below are fictional. No result, readiness approval, or current environment capability is claimed.

The exercise should expose what an authorized alternate can do from the documented process, where they need help, and what prevents completion. Keep the result tied to the actual sample and test mode. A tabletop, a lab demonstration, and a live service observation provide different evidence.

## Set the boundary and the decision

Use synthetic inputs and an isolated lab by default. Begin with a tabletop if the lab, product-specific procedures, or authority are unavailable. Live tenant testing, real provider calls, account changes, and destructive recovery are outside this default exercise. They require a separately approved plan with appropriate environment protection and participants.

The sponsor defines the operating decision the exercise should inform: for example, whether the receiving team can take a defined service scope, whether additional coverage is needed, or which work must remain restricted. The exercise cannot appoint the owner or change a transition agreement by implication.

Agree the service population, chosen sample and reason, exclusions, capability expectations, critical failures, business targets, participants, evidence location, and stop rule before starting. An unset target does not prevent recording the observed duration; it does prevent claiming that the target was met.

## Prepare the exercise packet

Create a fictional packet containing a continuity control record, a service inventory, a routine procedure, an escalation route, a calendar of duties, a sample change record, and a limited evidence index. Use invented role labels and synthetic data only. Define the authoritative revision and deliberately mark unresolved fields; do not populate them from memory about a real firm.

The receiving operator performs the exercise. The coordinator controls the scenario and stops unsafe activity. The reviewer observes results and limitations. The procedure author may observe but should not supply missing operational steps during the independent portion. If the author must help, record the interruption and evaluate that attempt as assisted. Training and a later independent retest can follow.

For lab cases, prepare allowed and excluded test identities, harmless sample objects, logging where available, and a reviewed cleanup method. Keep secrets out of captured evidence. Schedule contact exercises with participants in advance and label them as tests; do not create a false security incident or unexpectedly wake a provider.

## Exercise cases

The times and thresholds are set locally before execution. These cases intentionally do not reuse a fixed schedule or assume a particular technology stack.

| Case and mode | Starting condition and task | Expected observable result | Negative or failure case | Evidence and accountable follow-up |
|---|---|---|---|---|
| **Navigation — tabletop** | Supply a current index and a superseded procedure. Ask the alternate to choose the route for a planned transfer that becomes an unexpected absence. | Selects the current emergency path, identifies the governing record, and preserves the separate planned-transfer decisions. | A stale link or conflicting revision must be reported rather than silently trusted. | Document/revision selected, reasoning, broken reference; documentation owner resolves. |
| **Authority — tabletop** | A provider proposes an urgent scope expansion and asks the operator to approve its charge. | Identifies the recorded business approver and limits; no implied approval from urgency or technical competence. | Primary approver is unavailable; the alternate must use the authorized escalation or leave the reserved decision pending. | Decision and authority reference, rejected assumption, interim approach; sponsor decides. |
| **Incoming request — tabletop or isolated workflow** | Submit a fictional support request to the exercise queue. | A named receiving role recognizes it, assigns priority using the supplied criteria, and establishes the next action. | The queue accepts the request but nobody acknowledges ownership. | Submission and receipt are recorded separately; operations owner fixes routing. |
| **Emergency capability — tabletop, then optional lab** | Normal operator is unavailable. Follow the approved lab recovery procedure and read a restricted synthetic configuration record. | Alternate uses the allowed identity and capability; required observations and closure are recorded. | One required dependency is unavailable, or the excluded test identity attempts the same read. | Actual access and denial results, assistance, logs, closure; access owner resolves. Use [access readiness](emergency-access-readiness.md). |
| **Data recovery — tabletop, then optional lab** | Restore a small synthetic object set into an isolated destination using the supplied procedure. | Exact objects, required metadata, usable content, allowed access, denied access, and elapsed time are checked. | Job says complete but an attachment is missing, or a restricted object becomes readable by the excluded identity. | Manifest comparison, business-user check, access results; recovery owner and data owner resolve. Use the [recovery exercise](../../documentation/recovery-exercise-example.md). |
| **Monitoring and escalation — tabletop or coordinated lab** | Introduce a harmless test event that should follow the defined notification route. | Records event, routing, receipt, triage, and ownership separately. | The alert is generated but reaches an unattended destination. | Correlated timestamps and acknowledged disposition; monitoring owner fixes and retests. No real malicious payload is required. |
| **Operating obligation — tabletop** | A calendar task references a service record that lacks a confirmed decision date. | Surfaces the uncertainty and consults the actual authority and source before committing work. | An old reminder and the current source disagree. | Source comparison and pending decision; responsible business owner reconciles. |
| **Knowledge transfer — tabletop** | Ask the receiving operator to explain one routine task and one failure path from the supplied runbook. | Identifies trigger, scope, expected outcome, stop condition, and escalation without private knowledge. | A needed destination or command is absent. | Exact question and affected step; procedure owner updates and retests. |
| **Access closeout — tabletop; optional isolated identity lab** | A synthetic transition reaches its approved access-change point while a delivery receipt remains open. | Keeps record preservation, access removal, delivery acknowledgment, and readiness results distinct. | A participant suggests leaving access active indefinitely to wait for a signature. | Correctly bounded change plan and unresolved-item owner; personnel/access decision owners review. Destructive steps stay on paper. |
| **Continuity decision — tabletop** | A critical capability remains unproven after the exercise. | Sponsor identifies a restricted operating scope, additional coverage, or another explicit contingency. | A participant proposes declaring readiness because most other rows passed. | Actual proposed decision, remaining risk, next owner, review trigger; sponsor resolves. No average score overrides a critical boundary. |

## Add two cross-cutting injects

First, make a source statement stronger than its evidence: “The provider says the job completed,” while the destination result is unavailable. The operator should record the reported completion and the missing independent observation. The statement is evidence of what was reported, not sufficient evidence of the business outcome.

Second, make a role or dependency change after a prior successful exercise. The operator should identify which evidence may no longer apply and propose an affected-scope retest. A prior pass is not erased, but it must not be presented as proof for a materially different configuration or receiving team.

## Record actual results

| Field | Record |
|---|---|
| Test identity | Unique case, run number, date/time and zone, mode, environment, procedure and packet revisions |
| People and authority | Operator, coordinator, observer/reviewer, actual authority reference; disclose role overlap |
| Expected behavior | Capability, boundary, target if approved, critical failure, and intended evidence |
| Observed behavior | Steps attempted, response, duration, assistance, differences, and unintended effects |
| Evidence | Protected reference, source, collection method, scope, and important limitations |
| Outcome | Not run / blocked / passed for stated scope / failed; explain the result |
| Follow-up | Gap owner, interim restriction, next action, decision owner, and retest trigger |

Use the [readiness test CSV](../templates/readiness-test-record.csv) and [field dictionary](../templates/README.md), or equivalent records in the protected test system. The prose “passed for stated scope” maps to `supported_for_tested_scope`, “not run” to `not_run`, and blocked or failed results to their matching enums. Use `inconclusive` when the observation cannot settle the criterion. Keep one canonical attempt record; the prose table is a readable view, not another required tracker. [The control test record](../../cyber-risk/templates/control-test-record.md) is an optional fuller evidence format.

A screenshot may support an observation when its context is clear; pair it with logs, job records, or an independent check where these are available and material. Neither a screenshot nor an operator's statement should be dismissed automatically, and neither should be stretched beyond what it demonstrates.

## Make the readiness decision without averaging away failures

**Demonstrated for the tested scope:** required cases meet their defined criteria with sufficient evidence and no unresolved critical failure. State the sample, mode, environment, configuration, and limits. A tabletop-only result demonstrates decisions and navigation, not technical operation.

**Permitted operation with restrictions:** the authorized sponsor explicitly chooses a narrower scope or contingency. A temporary exception needs identified safeguards, an owner, explicit expiry, earlier review triggers, and follow-up tests in the [exception register](../templates/exception-register.csv) or equivalent protected record. A permanent scope change instead needs its own authorized decision and updated requirements. Failed, blocked, and not-run cases keep those outcomes. This is a risk decision, not a technical pass.

**Readiness not demonstrated:** a required boundary or capability lacks sufficient evidence, a critical case fails, or prerequisites prevent the demonstration. State what can be established and what remains unknown. Do not relabel the delivery acknowledgment or extend someone's transition duties to make the result appear complete.

Stop the exercise for an ambiguous target, production impact, unexpected sensitive data, missing execution authority, unplanned disruptive action, or an uncontrolled access path. Preserve a restricted record, use the approved cleanup or recovery method, and move any real incident into the incident process.

## Improve and repeat

Assign every material gap an operating owner and an observable completion criterion. Correct missing instructions in their canonical home, then retest the affected behavior and any changed dependencies. Record the new run separately. Review whether the issue changes the [planned handover](planned-handover.md), [ownership record](ownership-and-escalation.md), or [continuity plan](../../documentation/continuity/business-continuity-plan.md).

Schedule future reviews according to exposure and material change. This exercise supplies a method and test cases; it does not certify a firm, satisfy every assurance requirement, or establish that any current environment is ready.
