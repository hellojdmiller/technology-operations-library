<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Keep the device trustworthy

Check the five things that make a laptop or phone safe to hold firm information.

Suggested time: 15–20 minutes. Work on paper or in a document.

**Outcome:** Complete a five-point self-check for one described device and name what must change first.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

I call a device trustworthy when five things are true: updates current, automatic lock, strong unlock, encrypted disk, and only approved apps holding firm information. None of this needs technical skill, only a few minutes and the habit of checking rather than assuming.

Updates come first because they close holes attackers know about. The NCSC advises installing them promptly, ideally within a few days, with automatic updates on and unsupported devices replaced. It also advises keeping corporate data off devices that are not current: an unpatched personal laptop reading firm mail is the firm's exposure. [S1](sources.md#s1)

Encryption turns a lost laptop into a lost asset instead of a breach. FileVault keeps anyone from reading a Mac's disk without the login password. On Windows, Device Encryption switches on with a Microsoft or work account but not with a local account, so check rather than assume. [S2](sources.md#s2), [S3](sources.md#s3)

## Worked example: A self-check that says what to fix

**Before**

My laptop is fine. It's fairly new, I have a password, and I install updates when I get round to it.

**After**

Personal MacBook, 2022. Updates: six weeks ago, automatic off; fails D1's seven days. Lock: five minutes, password plus Touch ID; passes. Encryption: FileVault confirmed on; passes. Ownership: personal, unmanaged; enrollled mail and chat only. Apps: a personal cloud drive syncs Downloads; move firm attachments out today.

**Why:** It names the device, tests each point against D1's numbers, and ends with the first change. 'Fairly new' cannot be checked by anyone, including the owner.

## Your turn

Use your own device, or this one: a year-old Windows laptop, local account, firm mail in a browser, four-digit PIN, updates on 'remind me later' for a month. Write the five-point self-check against D1.

**Deliverable:** Five pass-or-fail lines against D1, plus one sentence on the first change and who makes it.

- [ ] Compare each point to D1's numbers, not to a feeling.
- [ ] Say whether encryption is confirmed on or only assumed.
- [ ] State managed or personal, and what D1 lets the device carry.
- [ ] End with the first change and who does it.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

For the Windows example, check the account type first. S3 says what a local account means for Device Encryption.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Windows laptop, personal, local account. Updates: deferred a month, fails D1's seven days; turn automatic updates on today. Lock: locks on idle, but a four-digit PIN is below D1's six digits; lengthen it. Encryption: unknown, and not automatic with a local account, so open Settings and confirm. [S3](sources.md#s3)

Ownership: personal and unmanaged, so enrollled mail and chat only, never client files. Apps: only the browser touches firm information. First change: install the updates and confirm encryption, because an unpatched, possibly unencrypted laptop reading firm mail is the firm's exposure, not only mine.

</details>

## Explain your choice

Which point was hardest to verify on a real device, and what would the technology team need to give you?

## Try a changed case

Same laptop, but now firm-managed and enrollled, with the local account replaced by a work account. Which lines change?

<details>
<summary>Changed-case answer</summary>

Encryption very likely passes: a work account turns Device Encryption on and attaches the recovery key to it, though I would still confirm in Settings. Management passes, so client files are allowed. The missed updates and four-digit PIN still fail until fixed. [S3]

</details>

## Check one decision

A colleague's personal laptop, two months behind on updates, only opens firm mail in a browser. Under D1, what is the right reading?

- **A.** It is fine; browser-only mail puts no firm information on the device.
- **B.** It fails; updates go on before it opens firm mail again, and if it cannot update, ask the technology team.
- **C.** It fails, so the colleague should wipe the laptop today and buy a replacement.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** Mail is firm information and D1 covers any device that opens it. Two months is far past seven days, and the NCSC advises keeping corporate data off devices that are not current. [S1]

**B:** This applies D1 as written. Two months fails the seven-day rule, and a device that cannot update may be out of support, which D1 excludes from firm information entirely.

**C:** D1 asks for updates within seven days, or removal from firm information if unsupported; it never asks for a wipe or a purchase. Install the updates, then re-check the other four points.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Next: Work away from the office](02-work-away-from-the-office.md) · [Research and limits](sources.md)
