<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Access, pressure, and the quiet exit

Separate what you saw from what it might mean, then take it to the one person whose job it is.

Suggested time: 10–12 minutes. Work on paper or in a document.

**Outcome:** A short note separating what the packet shows from what it might mean, naming the one person to raise it with.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

Most insider incidents I have seen were not malicious. Someone shared a login to save a day. Someone copied files to a personal drive before leaving because it felt like their work. A contractor kept access because nobody set an end date. Guidance treats unintentional cases as a category of their own. [S1](sources.md#s1), [S2](sources.md#s2)

The few deliberate cases usually show as access that does not match the job: an account still active after its contract ended, a night-time sign-in from someone who works days, a read-only user pulling whole folders. You do not need to know intent. You need to notice the mismatch. [S3](sources.md#s3)

The answer is deliberately boring: good offboarding, least privilege, and a way to raise concerns without accusation. SEI lists a termination procedure and least privilege as practices; the NCSC puts joiners, movers, and leavers processes before new tools. Managers: submit leaver forms early, give contractors end dates, and make questions safe. [S2](sources.md#s2), [S3](sources.md#s3), [S4](sources.md#s4)

If someone asks you to share a password or skip a control 'just this once', say no kindly, offer the sanctioned route, and tell the technology lead. The ask is usually convenience, and the control exists because convenience is how most incidents begin. Declining accuses nobody.

## Worked example: From a hunch to a note

**Before**

Dev is stealing client data before he leaves, and the agency still has someone inside our systems at night. I need to warn Ravi and the partners today.

**After**

What I saw: Dev asked me to copy a shared-drive folder to a personal link (D1). A contractor account is active past its end date, with a sign-in last Wednesday night (D2). What it might mean: convenience, a missed end date, or something else. Raising with Ines.

**Why:** The first version decides guilt and spreads it to three people. The second records checkable facts, keeps the meaning open, and goes to the one person D3 names.

## Your turn

You are Maya on Monday evening. From D1 to D3, write up to 90 words under 'What the packet shows' and 'What it might mean', ending with the one person you take it to.

**Deliverable:** A short note that separates facts from interpretation and names one person.

- [ ] Every fact traceable to D1 or D2.
- [ ] At least two possible meanings left open.
- [ ] One person, chosen from D3's concern route.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Write the facts as if Dev and the contractor were reading over your shoulder; anything that feels like an accusation is interpretation.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

What the packet shows: Dev asked me to zip the 'Dev working' folder from the Deals drive to a personal link, and not to involve Ravi (D1). Account c.okafor is active with a contract end of 31 July and a sign-in on 16 September at 22:41 (D2).

What it might mean: Dev wants his templates for a portfolio, and D3 routes that through Ravi. The contractor account may be an unrecorded extension or a missed end date; I cannot tell. Raising both with Ines tomorrow, as questions.

</details>

## Explain your choice

Which sentence in your note was hardest to keep as a fact rather than a meaning?

## Try a changed case

Change one condition: Ravi, your manager, asks you to share your password so a temp can cover your inbox during your leave.

<details>
<summary>Changed-case answer</summary>

The habit holds when the asker is senior. Decline kindly, offer the sanctioned route (Ines can set up delegated inbox access), and if pressed, take it to Ines as a question. D3 has no seniority exception.

</details>

## Check one decision

Dev asks you to copy the folder to his personal link, quietly. What fits D3?

- **A.** Do it. It is his own work and he leaves Friday.
- **B.** Decline kindly, point Dev to Ravi, and mention it to Ines.
- **C.** Report Dev to the operations partner as a suspected data thief.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** D3 says shared-drive files stay with the firm, personal copies are not permitted even for a portfolio, and releases go through the manager, busy or not.

**B:** This follows D3: the manager decides releases, access questions go to Ines first, nobody is accused, and Dev keeps a route to what he may have.

**C:** The packet shows a request, not a theft, and D3 names the technology lead, not the operations partner, as the first stop. Deciding guilt is interpretation, not fact.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Course overview](README.md) · [Research and limits](sources.md)
