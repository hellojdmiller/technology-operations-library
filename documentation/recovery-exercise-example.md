# Runbook: recover a sample document workspace

**Status:** Fictional exercise design; not an executable production procedure.

**Purpose:** Establish whether a recovered workspace supports a small set of user tasks, including attachments and appropriate access.

## Before the exercise

Use a dedicated test destination and fictional sample files. Identify an exercise owner, an operator, and a reviewer acting as an ordinary user. Record the selected recovery point, authorized destination, expected objects, and intended access before starting.

The environment-specific restore procedure and cleanup procedure must be supplied and reviewed first. If either is absent, stop at planning; this example does not invent a restore command.

## Procedure and observations

| Step | Operator action | Evidence to capture |
|---|---|---|
| 1 | Confirm the source snapshot and isolated test destination | Recovery point, destination identifier, expected sample manifest |
| 2 | Follow the approved restore procedure into that destination | Job identifier, start/end time, errors, and result |
| 3 | Compare restored sample objects with the manifest | Missing, extra, or mismatched items; do not rely on total count alone |
| 4 | Open the agreed documents and attachments as the test user | Task results and readable content, including any errors |
| 5 | Attempt the agreed restricted action as the restricted test user | Evidence that unauthorized access is denied |
| 6 | Ask the reviewer to perform the sample workflow | Whether the recovered workspace is usable without administrator-only access |
| 7 | Record the exercise decision and follow the approved cleanup procedure | Outstanding gaps, follow-up owner, and disposition of the test destination |

## Stop and recovery conditions

Stop if the destination is ambiguous, production data could be overwritten, access differs from the agreed scope, or the approved procedure cannot be followed. Preserve the execution evidence and ask the exercise owner to resolve the issue. Do not retry a restore over an existing destination without understanding its effects.

## Acceptance record

| Check | Expected result | Observed result |
|---|---|---|
| Sample objects | All agreed objects accounted for | Not run |
| Attachments | Selected attachments open correctly | Not run |
| User tasks | Reviewer can complete agreed tasks | Not run |
| Restricted access | Test user is denied the restricted action | Not run |
| Elapsed recovery | Within the exercise's agreed target | Target not yet set; not run |

A completed restore job is one observation. The exercise remains incomplete until the user-task and access checks are recorded and unresolved gaps have owners.
