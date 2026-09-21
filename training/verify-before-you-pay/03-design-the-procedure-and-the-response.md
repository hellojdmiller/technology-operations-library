<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 3. Design the procedure and the response

Turn the habit into a one-page control and decide now what the first hour looks like.

Suggested time: 15–20 minutes. Work on paper or in a document.

**Outcome:** Draft a one-page payment-change procedure and first-hour response that a small firm could adopt.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

A payment-change control names who requests, who verifies, who approves, and how it is recorded; roles stay separate however small the team. D4 fails where the attacker aims: section 4 accepts bank details from letterhead or a known email address, which a compromised mailbox supplies; section 5 lets any partner approve urgent payments by phone.

If money moves, the first hour is recall, not blame. Call the bank and request a recall; IC3 lists contacting your financial institution, requesting a recall, and filing at ic3.gov as the immediate steps. [S1](sources.md#s1) Tell leadership and the technology team, preserve every message, and report; the FTC also names local law enforcement. [S2](sources.md#s2)

The no-blame rule is speed, not kindness. The NCSC is direct: blaming users does not work, and people who fear reprisals will not report mistakes promptly, if at all. [S4](sources.md#s4) A recall attempted at 10:40 has a chance; one attempted after a quiet weekend usually does not.

## Worked example: Rewriting section 4 of D4

**Before**

Finance will update vendor bank details on receipt of written notice from the vendor on company letterhead or from the vendor's known email address. Effective immediately.

**After**

Vendor bank details change only after a written request, a callback by someone other than the recipient to the number on the vendor record, a second approval, a two-business-day hold, and a log entry. Payments due during the hold use the old details.

**Why:** Letterhead and the known address are what a compromised mailbox already has, so the old clause verified nothing. The rewrite moves the check to a channel the attacker does not hold.

## Your turn

Using D4 and the first two lessons, write a one-page procedure with four headed parts: the payment-change control; urgency and exceptions; the first hour if money moved; the reporting rule. Name roles, not people.

**Deliverable:** One page of headings and short lines that a new hire could follow on day one.

- [ ] Closes D4 section 4 with a callback to a number on file and a hold.
- [ ] Separates requester, verifier, and approver, even at a small headcount.
- [ ] Bank call first, reporting route named, prompt report never punished.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Write it for someone who joined on Monday and has never met Marcus or Priya.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Control. Request in writing, logged. Verify: someone other than the recipient calls the number on the vendor record or directory and logs it. Approve: a second person who did not receive the request; above $10,000, the finance lead or a partner who is not the requester. Urgency: no fast lane; new details still wait two business days.

First hour. One: call the bank and request a recall. Two: tell the managing partner and the technology team, who check the mailbox for forwarding rules and unfamiliar sign-ins. Three: preserve every message and call note. Four: file with IC3. Reporting rule: a prompt report counts as the procedure working.

</details>

## Explain your choice

Which step would the busiest partner most want to skip, and what will you say when they ask?

## Try a changed case

The firm has three people. The finance lead is also a partner and today the only approver. What changes?

<details>
<summary>Changed-case answer</summary>

Roles stay separate even when the people do not. Whoever receives a request cannot be its sole approver, so the third person verifies by callback and the partner approves. If only two are available, the change waits. The bank's dual-authorization feature can be the second control.

</details>

## Check one decision

On Monday at 10:40 Dana learns Friday's $240,000 wire from D2 went to an unverified account. What comes first?

- **A.** Email Marcus to ask whether he really sent D2.
- **B.** Call the bank and request a recall, then tell leadership and the technology team and preserve the messages.
- **C.** Delete the D2 thread so nobody acts on it, then investigate quietly.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** Worth knowing, but it uses the mailbox that may still be compromised and spends minutes the recall needs. In this packet who sent D2 does not change the first action.

**B:** Supported. Recall odds fall by the hour, leadership must know before anyone else acts on D2, the technology team checks the mailbox, and the messages are evidence.

**C:** Deleting destroys what the bank, the technology team, and law enforcement will ask for, and quiet investigation is the delay the no-blame rule exists to prevent. The thread holds the account details the bank needs.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: Verify through a second channel](02-verify-through-a-second-channel.md) · [Course overview](README.md) · [Research and limits](sources.md)
