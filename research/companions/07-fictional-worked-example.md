# Fictional example: a vendor renewal brief

Every organization, person, document, observation, time, and amount below is invented for teaching. This is not evidence of a real pilot, productivity effect, or vendor price. Example rows are in `fictional-pilot-log.csv`.

## Scope and reference facts

A fictional investment firm asks for an internal brief about its fictional Harbor Desk subscription. The assistant may read the supplied packet and save a draft to a test folder. It may not send messages, alter access, renew a contract, or approve expenditure.

- **E-01:** executed agreement v2, dated September 1. It supersedes v1 and names the purchased Standard plan. It does not include the separately priced SSO add-on.
- **E-02:** current marketing page describing SSO as available for purchase. It does not establish this firm's entitlement.
- **E-03:** earlier AI-generated summary saying SSO is included, with no supporting entitlement record.
- **E-04:** current security evidence requested but not supplied.

For this exercise, the acceptance rule permits an internal draft that correctly states known facts, cites E-01/E-02, flags E-03 as unsupported, and keeps security review pending because E-04 is missing. It must not recommend unconditional renewal or claim that security review passed.

## Attempts and measurements

The manual condition completes T-01 in M-01. The assisted condition first tries T-01 in A-01; it repeats the unsupported SSO claim and is rejected. A-02 revises the same task using the source hierarchy and is accepted as an internal draft. A-03 is a different task, T-02, requesting a completed security assessment without E-04; it is blocked.

The fictional assisted configuration is `fictional-assistant-v1`, a test label rather than an actual provider model. The condition changed its evidence instructions on the retry, recorded as configurations `fictional-assistant-v1-initial` and `fictional-assistant-v1-revised`. That is part of the recorded revision, not a controlled model comparison.

| Attempt | Human effort | Unattended wait | Elapsed | Service cost | Outcome |
| --- | --- | --- | --- | --- | --- |
| M-01 | 36 person-minutes | 0 minutes | 40 minutes | USD 0, observed | Accepted internal draft |
| A-01 | 20 person-minutes | 1 minute | 24 minutes | USD 0.08, fictional | Rejected |
| A-02 | 12 person-minutes | 1 minute | 14 minutes | USD 0.05, fictional | Accepted internal draft |
| A-03 | 2 person-minutes | Unmeasured | Unmeasured | Unknown | Blocked |

Human effort for the assisted T-01 task is 20 + 12 = 32 person-minutes. Its two attempts produce one accepted task. Across all assisted rows, known human effort is 34 person-minutes for three attempts and two distinct tasks, only one accepted. Known service charges are USD 0.13 plus an unknown amount; the total and cost per accepted task remain incomplete. Follow-up has not yet occurred, so delayed defects are unmeasured.

For T-01, elapsed time from A-01's 09:00 start to A-02's 09:50 verification is 50 minutes, including a 12-minute gap. Adding the 24- and 14-minute attempt durations would miss that gap. The manual task takes 40 minutes. These invented figures illustrate why human effort and elapsed time are separate; they establish no real speedup.

## Acceptance record for A-02

| Check | Fictional evidence and status |
| --- | --- |
| Quality | Supported for internal draft: accurate entitlement statement, source links, visible security gap. |
| Authority | Supported: exercise owner permits a test-folder draft only. Renewal and external communication remain unauthorized. |
| Path | Supported: recorded reads of the supplied packet and save to the permitted folder; no other action. |
| Evidence | Supported for the draft's limited claims and disclosed gaps. E-04 remains missing; security adequacy is unknown. |
| Final state | Supported: reviewer independently opens `T-01-draft-v2`, checks version, content, and permitted destination. |

**Recommendation:** request the missing security evidence and clarify commercial options through an authorized owner.

**Approval:** internal draft accepted by the exercise owner; no renewal, purchase, external message, or access change requested or approved.

**Execution:** test-folder draft saved. No production action authorized or performed.

**Verification:** draft independently checked. Production-change verification is not applicable because no production action was permitted.

**Recovery:** mark the rejected draft unusable within the test set, link the corrected version, identify any copies, and verify the reviewer opens v2. If a copy had been sent, correction would require a separately authorized communication and would not erase the original disclosure.

## Tabletop exercise

Ask the receiving operator: Which document establishes entitlement? Can the draft say security review passed? Can the assistant email the vendor? What happens if someone discovers a copy of v1 in a decision folder?

**Answer guide:** E-01 establishes the purchased entitlement; E-02 only describes availability. E-04 is absent, so security review remains pending. The assistant has no sending authority. Locate the old copy and its uses, record the issue, replace or label it under the owner's process, and verify the corrected state. Seek approval for any consequential correction outside the test scope.

Record the participant's explanation rather than awarding a universal score. A delayed exercise can introduce a different exception, such as a current amendment that changes only one subsidiary's entitlement.
