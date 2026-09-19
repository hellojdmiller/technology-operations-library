# Check Google Workspace user scope before changing access

**Task card:** 4 of 8 · **Suggested practice:** 25 minutes, excluding vendor study · **Mode:** tabletop; optional existing isolated Workspace lab.

**Research reviewed:** September 19, 2026. Original, unexecuted practice. Continue with [Google Workspace operator](../google-workspace-operator.md) for the full organizational-unit and 2SV lesson.

## Watch or read

The official [manage-users webinar](https://knowledge.workspace.google.com/admin/support/google-workspace-videos-and-webinars#meet-the-expert---how-to-manage-users-for-your-google-workspace-account) is listed as **31:50**. Use it for user-management orientation, not as an exact 2SV procedure. The official hub embeds video ID `PGvxTmolKGc`; the hub was updated September 18, 2026, but the video's publication date was not established. Playback, captions and transcript availability were not verified.

Reading alternative and task authority: Google's [Deploy 2-Step Verification](https://knowledge.workspace.google.com/admin/security/deploy-2-step-verification), reviewed on the date above. The public pages require no authenticated training session to read. A separate Workspace subscription/domain and appropriate administrative rights are needed for the optional parent lab. The video hub contains older material elsewhere; reopen task documentation instead of assuming every portal example is current.

## Predict before studying

Will moving a user to a pilot organizational unit necessarily make the pilot setting their effective setting? State what else you would inspect.

## Practice with the fictional readiness sheet

The goal is to prepare an enrollment-readiness review. **No enforcement change is proposed by this card.** There are two dummy users and one unchanged administrator outside the pilot.

| Fact | Supplied evidence |
|---|---|
| Scope | `ops-learner` belongs to `Training/Training-Pilot`; `control-user` remains outside |
| Pilot setting | Pilot unit allows enrollment; inherited setting was captured |
| Additional scope | `ops-learner` belongs to a configuration group; its relevant settings have not been inspected |
| Enrollment | User-security observation at exercise 14:10 reports enrollment complete |
| Report | Enrollment report generated at exercise 13:30 does not list the learner |
| Admin log | Unit move recorded at exercise 14:00 |
| Authentication | No user sign-in observation has been collected |

1. Draw the unit hierarchy and group membership. Mark the effective-setting question unresolved until the relevant group precedence is checked.
2. Classify each observation as configuration, administrative action, enrollment or authentication evidence. Preserve the different times.
3. Draft a readiness update in three sentences: confirmed facts, unresolved facts, next check/owner. Keep it unsent.
4. If the parent lab is available, use its permitted enrollment/scope checks. Retain inherited enforcement and administrator recovery arrangements; do not weaken them for the exercise.

## Verify your answer

| Check | Answer guidance |
|---|---|
| Effective scope | Unit membership alone is insufficient; inspect applicable configuration-group settings and inheritance. |
| Report mismatch | A 13:30 report cannot disprove a 14:10 observation. Record freshness and request an appropriately timed report. |
| Admin log | It supports the recorded administrative move, not enrollment or successful sign-in. |
| Readiness update | It must not say enforcement succeeded or that the user can sign in. Those observations were not supplied. |

## Teach back and transfer

Explain enrollment versus enforcement and why the administrator log answers a different question. Then the learner moves to another unit after the report is generated: identify which earlier conclusion needs reassessment.

Record viewing/reading and reasoning separately in the [training record](../training-record-template.md). Revisit after Google changes group precedence, 2SV methods, reporting behavior, privileges or UI. This task sends no enrollment notice and changes no live account.
