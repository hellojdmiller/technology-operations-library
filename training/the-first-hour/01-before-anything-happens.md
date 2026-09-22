<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Before anything happens

Turn a plan that names committees into one that names people.

Suggested time: 20–25 minutes. Work on paper or in a document.

**Outcome:** A one-page plan skeleton filled from the packet, with gaps marked and owned.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

My plan fits on one page and names people. A committee must be convened; a person can be called. D3 promises a meeting within four hours while the rule in D1 keeps forwarding. NIST makes roles, responsibilities, and authorities, including who may shut down assets, core to incident response policy. [S1](sources.md#s1)

Two decisions belong in the plan before anyone is stressed. The observation window: how long we watch before acting, and who may cut it short; NIST frames this as balancing quick recovery against observing the attacker. Pause authority: who may revoke sessions, disable an account, or stop an automation without waiting for a meeting. [S1](sources.md#s1)

The contact list is the part people skip: insurer with policy number, counsel, the bank relationship manager, the provider's 24-hour line, the identity provider's support route. NCSC tells small firms to assign roles, record who owns each responsibility and how to reach them, and check contacts every couple of months. [S3](sources.md#s3)

## Worked example: From a committee to a name

**Before**

The Incident Response Committee comprises the Chief Technology Officer, the Chief Operating Officer, the General Counsel, and a Managing Partner, and convenes within four hours.

**After**

Lead: Dana Okafor. Deputy: Marcus Ellery. Pause authority: either may revoke sessions, disable an account, and stop an automation at once; shutting down a shared system needs a call to Ingrid Solano first. Observation window: 30 minutes at most; zero if money is moving.

**Why:** Every line has a person and a limit. The times are this firm's choices, not a standard, decided before the alert.

## Your turn

Using D3 and the people in the scenario, draft a one-page skeleton with five headings: roles; decision authority (who decides, who may pause or shut down, alone or after a call); observation window; contacts; review date. Where the packet gives no answer, write GAP and name who fills it.

**Deliverable:** A skeleton where every role names a person and every gap has an owner.

- [ ] Every role names a person and a backup, not a title or committee.
- [ ] Pause authority covers sessions, accounts, and systems, and says whether a call comes first; the window has a maximum.
- [ ] Contacts cover insurer, counsel, bank, managed IT, and identity provider, each with a named person or line, or GAP.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Read D3 sentence by sentence and ask: who would I call at 07:45 on Monday? A title or meeting is a gap.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Roles: lead Dana Okafor, deputy Marcus Ellery, scribe Theo Baptiste. D3's Chief Technology Officer does not exist: GAP, closed by naming Dana. Pause authority: Dana or Marcus may revoke sessions, disable an account, and stop an automation at once; shutting down a shared system needs a call to Ingrid Solano first.

Observation window: GAP; proposed 30 minutes maximum, zero once money or data is leaving. Contacts: insurer Orrery Insurance, policy TL-CY-4471, and counsel Corwin Larkin have no named person; the bank manager has no out-of-hours number; the identity provider route is missing; Appendix B and the annual review are overdue. All GAP, owners Marcus and Dana.

</details>

## Explain your choice

Which D3 gap would have cost the most time this morning, and why?

## Try a changed case

Suppose there is no COO, and a fractional finance lead in two days a week does Marcus's work. What changes?

<details>
<summary>Changed-case answer</summary>

Pause authority cannot rest on someone unreachable three days a week. Name a second internal person, Ingrid or a senior associate, as deputy with pause authority; keep the fractional lead as insurer and bank contact owner; note their unavailable days.

</details>

## Check one decision

D3 says the Committee convenes within four hours. Which change best closes the gap in this packet?

- **A.** Shorten the convening time to one hour.
- **B.** Name a lead and deputy with pause authority, and set a maximum observation window.
- **C.** Delegate containment decisions to the managed IT provider's 24-hour line.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** A faster meeting is still a meeting. D1 shows the rule forwarding from 07:38 with the session active; whoever reads D1 needs authority to revoke that session now, not a shorter wait.

**B:** This gives whoever reads D1 at 07:42 someone to call and a decision they may make. It closes both D3 gaps: the missing window and the missing named authority.

**C:** Bluefold can act, but D3 gives it no authority and the firm keeps the consequences. In this packet, disabling Rowan's account before a bank call is the firm's decision, not the provider's.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Next: Triage and contain](02-triage-and-contain.md) · [Research and limits](sources.md)
