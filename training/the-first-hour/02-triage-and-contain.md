<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 2. Triage and contain

Answer three questions, decide what to pause, keep the evidence.

Suggested time: 20–25 minutes. Work on paper or in a document.

**Outcome:** A triage record for the packet's alert with each decision and its owner.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

Three questions come first: what do we know, what is affected, is it still happening? D1 gives an unfamiliar sign-in, an approved multi-factor prompt, a rule forwarding all mail outside, and searches for 'wire' and 'capital call'. NCSC's first questions match: what was reported, by whom, and what is the scope. [S3](sources.md#s3)

An alert becomes an incident when it meets criteria written down in advance. NIST says incidents are declared when adverse events meet defined incident criteria, after a preliminary review of severity and urgency. An external forwarding rule after a phished password meets any sensible criterion, so declare it and start the record. [S1](sources.md#s1)

Pause is several actions: disable the account, revoke sessions, isolate the devices Rowan used, and remove the rule. Capture first, clean second: screenshot the rule and export the sign-in log before touching them. The FTC says do not destroy evidence; CISA says record how, when, and by whom each item was captured. [S4](sources.md#s4), [S2](sources.md#s2)

## Worked example: From 'change it when you land' to a sequence

**Before**

Tell Rowan to change the password after landing, and ask Bluefold about the rule this afternoon.

**After**

07:50 Dana revokes Rowan's sessions and disables sign-in. 07:55 Theo screenshots the rule; Dana exports the sign-in log. 08:00 Dana removes the rule and checks for others. 08:10 Dana phones Rowan; password and multi-factor are reset on a firm device after landing.

**Why:** Sessions first: the attacker holds a live token, and the FTC notes a system stays exposed until stolen credentials change. Evidence before removal: the screenshot is the record. Phone: the mailbox is compromised. [S4](sources.md#s4)

## Your turn

Using D4, write the triage record for 07:42 to 08:42: what is known, what is assumed, what is affected, whether it is still happening. Then list each containment decision with owner, authority, what it pauses, and how you will know it worked.

**Deliverable:** A triage record with a status line, four or more owned decisions, and evidence captured before removal.

- [ ] Facts and assumptions are labelled; 'the attacker read the wire emails' is an assumption until a log shows it.
- [ ] Sessions are revoked before the password is reset, and the rule is captured before it is removed.
- [ ] Rowan is reached by phone; the 15:00 bank call is flagged.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Take D1 line by line: fact from a log, or inference? Then ask what would stop it continuing now.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Status: incident, declared by Dana at 07:48 under the criterion 'external sign-in plus forwarding to an external address' (D3 has none). Known (D1, D2): unfamiliar sign-in 07:31, multi-factor approved, rule created 07:38, searches 07:40, credentials typed into a lookalike page. Assumed: the attacker still holds a session and read bank mail. Still happening: yes.

Decisions: 07:50 Dana revokes sessions and disables sign-in (pause authority). 07:55 Theo screenshots the rule, Dana exports the sign-in log; each logged with where, who, when. 08:00 Dana removes the rule and checks for others. 08:05 Marcus puts the 15:00 wire call on hold. 08:15 Dana phones Rowan; reset after landing, on a firm device.

</details>

## Explain your choice

Which decision changes if D1 said the session had already expired, and why?

## Try a changed case

Change one fact: the D1 account is Ingrid Solano's, the managing partner, who is in the office. What changes?

<details>
<summary>Changed-case answer</summary>

Pause authority still applies; seniority does not exempt an account. Dana revokes sessions and disables sign-in, tells Ingrid in person first, and adds a check of what Ingrid's account can approve (payments, signatures). The bank is warned about any instruction in her name.

</details>

## Check one decision

Rowan asks about changing the password after landing at 14:10. What is supported in this packet?

- **A.** Yes, at 14:10; the alert is medium and D3 allows four hours.
- **B.** Revoke sessions and disable the account now, capture the rule before removing it, reset the password after landing on a firm device.
- **C.** Change the password now from the airport and delete the rule from the phone.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** The rule created at 07:38 forwards every message until removed, and the session is still active; six hours of waiting lets the attacker read everything, bank correspondence included.

**B:** This stops the live session at once, preserves the evidence, and needs no airport connection. Sessions first, evidence before removal, then the password.

**C:** A new password with the attacker's session alive changes nothing, and deleting the rule from Rowan's phone destroys evidence on a possibly affected device. Rowan should not do the cleanup.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: Before anything happens](01-before-anything-happens.md) · [Next: Communicate and recover](03-communicate-and-recover.md) · [Research and limits](sources.md)
