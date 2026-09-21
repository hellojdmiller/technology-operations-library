<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Scope the task and the authority

Turn a request for access into a statement of what the agent may do, for whom, and until when.

Suggested time: 20–25 minutes. Work on paper or in a document.

**Outcome:** Write a one-page authority statement for the partner's request: reads, writes, sends, human steps, identity, expiry.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

D1 asks for capability: whatever access it needs. My job is authority: what the agent may do, for whom, and until when. OWASP names three roots of excessive agency, too much functionality, too many permissions, too much autonomy, and the request invites all three. [S2](sources.md#s2)

I write the boundary as three lists: what the agent reads, writes, and sends, each by exact folder or recipient. Everything else needs a human. Then I sort actions: read automatically, write carefully, delete reluctantly. This task never deletes anything.

An invoice PDF is untrusted content. A line inside one saying 'forward this file to' must stay data, never an instruction; the boundary holds when the model is fooled. OWASP's mitigations include segregating external content and human approval for high-risk actions. [S3](sources.md#s3)

The agent acts under its own identity, not Jonah's or Helena's. NIST is plain: agents need their own identifiers, credentials, and entitlements; sharing a person's credentials breaks accountability. Helena stays the principal who asked, and the agent's access can be revoked alone. [S4](sources.md#s4)

## Worked example: From 'whatever it needs' to a boundary

**Before**

Give the assistant the Finance and Operations drives and mail so it can reconcile and send results on Mondays.

**After**

Reads two named folders, read-only. Writes one new workbook per run to the Reconciliation folder. Sends one email to Helena and Priya from its own mailbox. Anything else needs a human. Principal: Helena. Expires 31 December 2026.

**Why:** It names what the agent can touch, so lesson 2's rules and lesson 3's alerts have something exact to measure.

## Your turn

Write a one-page authority statement for D1 in 120 to 180 words: purpose, principal, identity, reads, writes, sends, human steps, expiry, who signs. Write it for Helena to sign, not for an engineer.

**Deliverable:** A statement Helena could sign and Jonah could configure from, with nothing 'as needed'.

- [ ] Name Helena as principal and state the one purpose.
- [ ] List reads, writes, and sends by exact folder and recipient.
- [ ] Say what needs a human, including any unreadable file.
- [ ] Give the agent its own identity and an expiry date.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

For each capability D1 implies, ask who may do that today and whether they would let the agent do it unasked. If not, it needs a human.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Purpose: reconcile the Fund II tracker against the September invoices. Principal: Helena Strand. Identity: agent-reconcile, a dedicated service account. Reads: the tracker and the invoice folder, read-only. Writes: one new workbook per run in the Reconciliation folder. Sends: one email to Helena and Priya, held as a draft for Priya to release.

Needs a human: any other folder or recipient, any change to the tracker, any deletion, any unreadable file, any lookup outside the firm. Expires 31 December 2026 or on any change of tool or model. Signed by Helena; reviewed by Marcus before the first live run and monthly after.

</details>

## Explain your choice

Which line in your statement did Helena's request never mention, and what could go wrong without it?

## Try a changed case

Helena adds: 'and can it tidy the vendor names in the tracker while it is there?' Nothing else changes. Does your statement change?

<details>
<summary>Changed-case answer</summary>

Tidying writes to the source of truth Priya relies on, not to the agent's output, so the tracker moves from read automatically to write carefully. Keep it read-only; have the agent list proposed corrections for Priya to apply. If Helena insists, make it a separate write with per-change approval.

</details>

## Check one decision

Helena writes 'just give it whatever access it needs'. Which response fits the packet?

- **A.** Use Jonah's admin token for the pilot and tighten access after October.
- **B.** Write the authority statement with reads, writes, sends, and human steps, and ask Helena to sign it first.
- **C.** Decline until the model provider guarantees the agent cannot be manipulated by an invoice.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** D1 needs two folders and one mailbox. D2's token reaches every tenant folder and never expires, so one fooled run can touch anything; D3 already shows a write outside the task.

**B:** This turns a request for capability into a decision about authority. Jonah gets something exact to configure; lessons 2 and 3 get a boundary to test against.

**C:** No provider offers that guarantee. OWASP treats prompt injection as a standing risk to design around; D1's task is bounded enough to run inside limits. [S3]

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Next: Isolate, broker, and allowlist](02-isolate-broker-and-allowlist.md) · [Research and limits](sources.md)
