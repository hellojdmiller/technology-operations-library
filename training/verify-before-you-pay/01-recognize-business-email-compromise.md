<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Recognize business email compromise

One pattern sits behind most payment fraud: change the destination, keep everything else normal.

Suggested time: 15–20 minutes. Work on paper or in a document.

**Outcome:** Mark up two payment-related messages with what is being changed and what is creating the pressure.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

Business email compromise is a plain crime with a technical name: someone who legitimately moves money is asked to move it somewhere new. The FBI's Internet Crime Complaint Center counted 305,033 incidents and over 55 billion dollars in exposed losses between October 2013 and December 2023. [S1](sources.md#s1)

The pattern is change the destination, keep everything else normal. The invoice number matches, the amount matches, the sign-off is familiar; only the account, payee, or counterparty is new. Vendor bank changes, executive requests, and hijacked threads are the same trick in three costumes.

I do not use the sender address or the writing quality as the test. A mailbox under someone else's control sends from the real address, and email authentication checks the sending server, not who is typing. [S5](sources.md#s5) Pressure does the rest: a closing, a capital call, a cutoff tomorrow, a colleague who cannot be reached.

## Worked example: Reading D1 for what matters

**Before**

A colleague forwards D1: 'Ben's usual address, invoice number and amount match the quote, his usual sign-off. Updating the bank details now so the 25th is not missed.'

**After**

Changed: the bank and account for NAV-2291. Unchanged: sender address, invoice number, amount, tone, signature. Pressure: the old account 'will reject incoming payments after 22 September' and the installation may move. Decision: hold the change and verify by callback before anything is updated.

**Why:** Every reassuring detail is one a diverter keeps intact on purpose. Only the destination moved, and the deadline exists to stop anyone checking that one thing.

## Your turn

Read D1 and D2. For each, write three lines: what is being changed, what has been kept normal, and what is creating the pressure. Add one sentence on who benefits if you act today without checking.

**Deliverable:** A markup of two messages, six to eight lines, readable in under a minute.

- [ ] Name the exact thing that changed: account, payee, counterparty, or approval path.
- [ ] List two normal-looking details and say why they prove nothing about the destination.
- [ ] Quote the phrase in each message that creates the urgency.
- [ ] Change no record, send no reply, release no payment.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Cover the sender line and read for two questions only: where does the money go, and why today?

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

D1. Changed: the destination bank and account for NAV-2291. Normal: the address on the vendor record, the invoice number, the quoted amount, Ben's sign-off. Pressure: the old account rejects payments after 22 September and the installation 'may need to move'. The mobile number offered is inside the message, so it verifies nothing.

D2. Changed: a new counterparty and account, requested by email outside the procedure; Priya's agreement is claimed, not shown, and she is off the copy line. Normal: Marcus's real address, a genuine thread, his short style. Pressure: a 5 pm cutoff, confidentiality, 'email is the best way to reach me'. Speed benefits whoever controls the new accounts.

</details>

## Explain your choice

Which detail in D2 convinced you most, and why does it say nothing about where the money would go?

## Try a changed case

Suppose D1 had three spelling mistakes and came from an address one letter off the vendor record. Does your markup change?

<details>
<summary>Changed-case answer</summary>

The clues get easier; the test does not change. The destination moved and a deadline is pushing, so mark and verify it the same way. Train yourself on typos and the clean message from the real mailbox gets through.

</details>

## Check one decision

D2 came from Marcus's real address inside a thread you remember. What does that tell you?

- **A.** The request is genuine; a real thread cannot be faked.
- **B.** Nothing about where the money would go; the new payee and the cutoff need verifying.
- **C.** It is a scam; partners never email about wires.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** A hijacked mailbox replies inside real threads from the real address. In this packet the earlier D2 messages are genuine; the final one adds a new payee, drops Priya, and sets a cutoff. That is what needs verifying.

**B:** Supported. The address and thread show which mailbox sent the message, not who was typing or where the account leads. Lesson 2 covers how to check.

**C:** Partners at small firms email about payments constantly, and D2 could be a hurried genuine request. The decision is not 'scam or not' from the header; it is 'verify the new destination before anything moves'.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Next: Verify through a second channel](02-verify-through-a-second-channel.md) · [Research and limits](sources.md)
