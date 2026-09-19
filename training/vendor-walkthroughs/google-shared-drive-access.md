# Verify access to a Google shared drive

**Task card:** 5 of 8 · **Suggested practice:** 25 minutes, excluding vendor study · **Mode:** tabletop by default.

**Research reviewed:** September 19, 2026. This original exercise has not been executed. It extends [Google Workspace operator](../google-workspace-operator.md) from identity scope to a distinct content-access task.

## Watch or read

The official [shared-drives webinar](https://knowledge.workspace.google.com/admin/support/google-workspace-videos-and-webinars#meet-the-expert---how-to-use-shared-drives-in-google-workspace) is listed as **20:44** and covers drive creation, membership, access levels and files. The hub's observed embed ID is `HXkFgMUkjaI`. Its September 18, 2026 page update is not the video's publication date, which remains unknown. Playback, captions and transcripts were not verified.

Reading alternative: [Set up shared drives for your organization](https://support.google.com/a/answer/7337469?hl=en-CA). This official page describes edition-dependent access and controls, including Business Starter exceptions. Its publication date was not displayed. Read the current edition details before any lab; a public webinar does not supply a subscription, admin privileges or permission to move data. Use the text if media is unavailable.

## Predict before studying

Would a successful “add member” operation prove that the user can open every intended file and that everyone else is denied?

## Practice with this fictional request

A project owner proposes a new `LAB-Project-Docs` shared drive containing only two synthetic files: `agenda.txt` and `summary.txt`. `reader-a` should read both; `outsider-b` should read neither. No external sharing, migration or bulk membership change is requested.

| Supplied observation | What still needs an answer |
|---|---|
| Owner approved the two-file scope | Actual tenant edition and relevant policy constraints are unknown |
| Membership screen lists `reader-a` as Viewer | No ordinary-user file-open result supplied |
| An administrator can open both files | Does the intended reader have usable access? |
| `outsider-b` is not a drive member | Direct shares and other applicable access paths have not been checked |
| A previous setup note says “sharing complete” | Note has no timestamp, object IDs or test evidence |

1. Draft an access matrix with rows for both users and columns for each file. Mark **expected** read/deny results separately from **observed: not tested**.
2. List the minimum evidence needed: exact drive/file identities, edition, saved membership/role, applicable sharing restrictions, and the two users' actual outcomes.
3. On paper, handle this new observation: `reader-a` opens only `agenda.txt`. Keep acceptance partial and propose a targeted investigation of the file's effective access; do not broaden access to everyone.
4. Optional isolated lab requires a separately provisioned supported Workspace tenant, appropriate owner/operator rights, two dummy accounts, two synthetic files and an agreed cleanup procedure. Confirm these before creating anything. Inspect the current vendor procedure, create only the approved test scope, then perform positive and negative reads. If prerequisites are missing, remain in tabletop mode.

## Verify your answer

| Check | Answer guidance |
|---|---|
| Four matrix cells | `reader-a`: read/read; `outsider-b`: deny/deny. Each actual result stays untested until observed as that identity. |
| Scope evidence | Use stable object identity, membership and relevant effective policy; display names alone are not enough. |
| Partial access | One successful file read does not accept both files. Record the specific failed object and investigate rather than increasing the role by default. |
| Negative test | Absence from drive membership does not by itself prove all access paths are denied. The intended denied user must actually fail the agreed reads in a lab. |

## Teach back and transfer

Explain how membership, policy and observed access answer different questions. Then `reader-a` requests edit access: identify the new owner decision and new expected tests before altering the matrix.

Use the [training record](../training-record-template.md). Revisit when shared-drive editions, sharing behavior, roles or controls change. No existing drive, real file, retention rule or external recipient is modified by this card.
