# Prove a Jamf inventory policy reached the intended Mac

**Task card:** 6 of 8 · **Suggested practice:** 25 minutes, excluding vendor study · **Mode:** tabletop; optional existing isolated Jamf lab.

**Research reviewed:** September 19, 2026. Original, unexecuted exercise. Use [Jamf device operations](../jamf-device-operations.md) for the complete single-device lab and cleanup boundaries.

## Watch or read

Use the public Jamf 100 lessons: [17 — Device Scope](https://learn.jamf.com/r/en-US/jamf-100-course-current/Lesson_17), [22 — Deploy a Policy](https://learn.jamf.com/r/en-US/jamf-100-course-current/Lesson_22), and [23 — Policies and Jamf Self Service](https://learn.jamf.com/r/en-US/jamf-100-course-current/Lesson_23). Each page has video plus written key points, review and practice material. Use the written material as the reading alternative; it is not a verified transcript. Current page publication dates and video durations were not displayed in the inspected text.

[Jamf's training page](https://www.jamf.com/training/) states that Jamf 100 is free and its exam is separate. Reading these lessons does not provide a Jamf Pro instance, managed Mac or certification. The observed embeds request captions, but playback, caption availability/languages and transcripts were not verified. Recheck the current lesson against the lab's actual Jamf/OS versions.

## Predict before studying

A Mac is in the target group and also explicitly excluded. Will targeting alone make the policy available?

## Practice with a fictional policy card

`LAB-Refresh-Inventory` has **Update Inventory only**, a single-Mac static target group, Self Service availability and once-per-computer frequency. No package, script, account, restart or recurring trigger is included.

| Case | Supplied record |
|---|---|
| A: before first run | `LAB-MAC-01` is targeted and excluded; item is unavailable |
| B: after removal of test exclusion | Saved scope has one Mac, no exclusion; item appears; no run attempted |
| C: first run | Policy log says completed at exercise 10:05; device inventory still shows exercise 09:00 |
| D: later observation | Same device identity; inventory advances to exercise 10:06; observed at exercise 10:08 |

1. Write the intended target count, payload and execution boundary before reading the outcomes.
2. For each case, state what is supported and what remains unresolved. Keep eligibility, execution log and inventory freshness separate.
3. Draft a response to C that requests a later device-specific observation and relevant diagnostics. Do not blindly rerun a once-per-computer policy.
4. If the parent lab is available, follow its exclusion test **before** first execution, then its single inventory run and final disable step. A completed run must not be treated as a fresh exclusion test; frequency could obscure eligibility.

## Verify your answer

| Case / question | Answer guidance |
|---|---|
| A | Exclusion takes precedence over the target; absence is consistent with that configured scope. |
| B | Availability supports eligibility, not policy execution or refreshed inventory. |
| C | The log and inventory disagree about the requested outcome. Keep inventory refresh unverified pending investigation. |
| D | The later timestamp on the same Mac supports a fresh inventory observation when correlated with the run; it does not prove unrelated device settings. |
| Cleanup | Disabling a test policy prevents future eligible execution; it does not reverse already-applied payloads. Record the final saved state. |

## Teach back and transfer

Explain why scope, policy execution and inventory evidence are separate. Then a smart group includes a Mac whose inventory is three weeks old: describe the freshness limit before trusting membership for deployment.

Use the [training record](../training-record-template.md). Revisit after Jamf/OS changes, scope semantics or Self Service behavior changes. No production device is enrolled, wiped or otherwise managed by this exercise.
