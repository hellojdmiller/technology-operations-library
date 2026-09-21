<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 3. Communicate and recover

Decide who hears what and when, then restore and write it down.

Suggested time: 20–25 minutes. Work on paper or in a document.

**Outcome:** A communication plan with recipients, timing, and the one sentence each hears first.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

Who is told when is a plan decision. NIST separates coordination, notification, public communication, and information sharing, and says the mechanisms should exist in advance. My order: leadership, affected people, the bank if money is exposed, insurer and counsel, then regulators where the firm's obligations require; counsel confirms that last step. [S1](sources.md#s1)

Cadence beats volume: say what is known, what is being done, and when the next update comes, then keep that time even with no news. NIST recommends regular status updates; the FTC says do not make misleading statements or withhold what people need to protect themselves. [S1](sources.md#s1), [S4](sources.md#s4)

Recover from known-good state: confirm rules, delegates, and multi-factor methods match what the firm set, and check the devices used, before trusting the account. NIST's recovery criteria include verifying restoration assets before use, then an after-action report; NCSC says review, learn, and update the plan. [S1](sources.md#s1), [S3](sources.md#s3)

## Worked example: One sentence, the right one first

**Before**

All staff, 08:30, email: 'We are experiencing a security incident. IT is investigating.'

**After**

Ingrid, 08:15, phone from Dana: 'Rowan's mailbox was accessed by an outsider; access is cut, wire on hold, update 09:00.' Bank manager, 08:30, known number from Marcus: 'No instruction from Rowan's address today; changes by phone only.'

**Why:** Each sentence gives the recipient one thing to do or not do. Staff hear after Rowan and the bank, and hear what happened, not 'an incident'.

## Your turn

Plan day one in D4's communication log. For leadership, Rowan, the bank, insurer, counsel, staff, and any regulator or outside party the firm's obligations may require, give time, channel, speaker, first sentence, and next update. Add three lines: what known-good means here, who verifies it, and what the after-action note covers.

**Deliverable:** A communication log with six or more recipients and first sentences, plus recovery and after-action lines.

- [ ] Leadership and Rowan hear before staff; the bank before 15:00 by a known number.
- [ ] Insurer and counsel are called within hours with the policy number; counsel confirms regulatory duties.
- [ ] Every entry has a next update; recovery names what is checked before the account is trusted.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Ask, for each recipient: what will they do wrong in the next hour if I say nothing?

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Ingrid and the bank: see the example. 08:15 Rowan, phone: 'Account disabled on purpose; call from a firm device when you land.' 08:45 Orrery Insurance claims line, Marcus, policy TL-CY-4471: 'Suspected mailbox compromise; requesting panel contacts.' 09:00 Corwin Larkin, Marcus: 'Mail forwarded externally for 22 minutes; advise on notification duties for client or personal data.'

09:00 staff, chat, Theo: 'One mailbox was accessed and is contained; if you received an odd message from Rowan since 07:30, do not act on it; tell me.' Regulators and affected outside parties: only on counsel's advice; Marcus decides by end of day. Cadence: leadership 09:00, 12:00, 17:00; staff 17:00; bank 12:00.

Recovery: known-good means no rules, delegates, or forwarding beyond the firm's standard; multi-factor re-registered on a firm device; devices checked; no other account showing the same sign-in pattern. Dana verifies. After-action note: Dana, due 2026-09-28; what happened and when, what we did in what order, what the plan changes; then the tabletop.

</details>

## Explain your choice

Which first sentence was hardest to write, and why?

## Try a changed case

Change one condition: the log shows the attacker downloaded three client statements with personal data before sessions were revoked. What changes?

<details>
<summary>Changed-case answer</summary>

Counsel moves up and is asked about duties to those clients and, where the firm's obligations require, a regulator. The insurer hears exposure is confirmed, not suspected. The clients join the list with a first sentence counsel drafts. Other timings hold.

</details>

## Check one decision

It is 08:20. Who hears next in this packet, and how?

- **A.** All staff, by email.
- **B.** The bank manager, by a known number: accept no changes from Rowan's address today.
- **C.** Nobody yet; wait for the review.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** It tells staff nothing specific to do, and in this packet the bank, the likeliest to act wrongly this hour, has not yet heard.

**B:** The 15:00 wire call and the searches for 'wire' and 'capital call' make the bank the likeliest to act on a false instruction; use a known number, not one from an email.

**C:** Waiting leaves the bank exposed during the window the attacker prepared for. Its first sentence needs only the fact of access, which D1 already shows.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: Triage and contain](02-triage-and-contain.md) · [Course overview](README.md) · [Research and limits](sources.md)
