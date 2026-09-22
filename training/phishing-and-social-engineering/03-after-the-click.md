<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 3. After the click

Tell someone fast, preserve everything, and let the technology team direct the fix.

Suggested time: 15–20 minutes. Work on paper or in a document.

**Outcome:** Write a short incident note the technology team could act on without seeing your screen.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

The first ten minutes after a click are for telling someone, not fixing it. Nothing dramatic: I do not shut down, wipe, or unplug anything, I do not delete the message, and I leave the tab open. I tell the technology team by the D4 route. [S1](sources.md#s1), [S4](sources.md#s4)

Passwords come second. Microsoft and Google say to change the password on an affected account; I add a sequence: only when the team says so, and from a device they trust. The team revokes sessions, resets the password, and checks forwarding rules and sign-in methods. [S4](sources.md#s4), [S5](sources.md#s5)

No blame, as a working rule rather than a kindness. The NCSC says no training package can teach users to spot every phishing attempt, and that people who fear reprisals will not report mistakes promptly. A late report is what makes a click worse. [S3](sources.md#s3)

## Worked example: From an apology to a usable note

**Before**

Sorry, I clicked something dodgy in that document email, but I closed it and changed my password straight away. I deleted the email so nobody else clicks it.

**After**

14:07, 21 September. Sam Okafor, ext 218, desk 4. At about 13:50 I opened the link in the Ridgeway binder notice on my work laptop, office network, and entered my password. The tab and message are untouched; I have changed nothing.

**Why:** The note gives time, device, network, account, what was entered, and what is preserved. The apology destroyed the evidence and may have handed over the new password.

## Your turn

Write the incident note: at 13:50 Sam opened the D1 link on the work laptop, entered his password, then approved a sign-in prompt on his phone. Write it for the technology team in under 120 words.

**Deliverable:** A short incident note someone could act on without seeing your screen.

- [ ] Give the time of the click and the time of the note.
- [ ] Name the device, the network, and the account.
- [ ] Say exactly what was entered and that a sign-in prompt was approved.
- [ ] State what you have not done, and how the team can reach you.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Write for someone who cannot see your screen and cannot call you back. Every sentence should state a fact or name what you did not touch.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

14:07, 21 September 2026. Sam Okafor, ext 218, desk 4. At about 13:50 I opened the link in the 'Ridgeway binder' notice from share@harbourline-docs.example.net on my work laptop, office network, and entered my work email and password. A minute later I approved a sign-in prompt on my phone.

The message is in my inbox and the tab is open. I have not changed my password, deleted anything, or signed out. I am at my desk and will not touch the laptop until you say which device to use. The approved prompt probably means the sign-in completed.

</details>

## Explain your choice

Which single detail in your note most changes what the technology team does first, and why?

## Try a changed case

Same events, but at 22:30 on a Friday, on your personal phone over home Wi-Fi, and nobody answers extension 220. What changes?

<details>
<summary>Changed-case answer</summary>

Report tonight: email techhelp@harbourline.example.com and call the Technology on-call number in the directory. Keep the phone on and the message intact. If nobody responds within 30 minutes, D4 allows one exception: change the password from a different trusted device, not the phone, and say what you did.

</details>

## Check one decision

Sam has entered his password on the D1 page. Which first step fits D4?

- **A.** Delete the email and clear the browser history so nobody clicks again, then tell the team on Monday.
- **B.** Tell the technology team now on extension 220 or in person, leave the message and tab alone, and change nothing until told which device to use.
- **C.** Change the password immediately on the same laptop, then power it off so nothing can spread.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** Deleting removes the sender, link, and headers the team needs, and the account is at risk now, not Monday. D4 says do not delete and report immediately.

**B:** This is the D4 sequence: report immediately, preserve everything, take direction on the password and the device.

**C:** Changing the password on the same machine may hand the new one over, and powering off destroys what the team can inspect. D4 says shut down nothing and wait for the device instruction.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: Verify out of band](02-verify-out-of-band.md) · [Course overview](README.md) · [Research and limits](sources.md)
