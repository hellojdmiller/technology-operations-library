<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 2. Isolate, broker, and allowlist

Give the agent its own environment, borrowed credentials, and a short allowlist.

Suggested time: 20–25 minutes. Work on paper or in a document.

**Outcome:** Produce a deployment sketch with each control named and the test that proves it.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

D2 has three gaps that each turn a fooled agent into a firm-wide problem: it runs on Jonah's laptop under his profile, holds a long-lived admin token in an environment variable, and reaches the internet 'as needed'. Each is fixed before the first live run.

Isolate first: a dedicated VM or container, input folders mounted read-only, the output folder writable, nothing of Jonah's present. GitHub's published design for its agent workflows does the same: a dedicated container, read-only host, tightly controlled egress. [S5](sources.md#s5)

Broker the credentials: the agent never holds the secret; a broker issues a short-lived token to one service account, agent-reconcile, per run. NIST calls long-lived keys and static bearer tokens particularly problematic for agents; GitHub keeps tokens in a proxy the agent cannot read. [S4](sources.md#s4), [S5](sources.md#s5)

Allow egress by destination and purpose: the model, files, and mail APIs; deny the rest and log attempts. In the incident OpenAI reported, sandboxes without internet reached it through an internal package mirror the agents could write to. D2's docconvert is that mirror. [S1](sources.md#s1)

## Worked example: From a setting to a control with a test

**Before**

Access: long-lived admin token in AGENT_TOKEN so the agent never re-authenticates. Network: internet as needed; I will ask for an exception.

**After**

Credential: the broker issues agent-reconcile a one-hour token per run, scoped to the task's folders and its own mailbox. Test: dump the environment; expect no token. Egress: allow model, files, and mail APIs; deny all else. Test: reach an outside host; expect denial, logged.

**Why:** Each control has a test, an expected result, and a log line. A control never tested from inside is a setting, and settings drift.

## Your turn

Write a deployment sketch for the pilot in D1 and D2. For each of five areas (isolation, identity, credentials, egress, relays), say what you would deploy and the test from inside the sandbox that proves it.

**Deliverable:** A one-page sketch: five named controls, five tests, and the D2 sentence each replaces.

- [ ] Move the agent off the laptop; say what is mounted where.
- [ ] Replace the admin token with a service account and a brokered, short-lived token.
- [ ] Name each egress destination and purpose; deny the rest; log attempts.
- [ ] Treat docconvert as a relay: constrain its fetching or remove it.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Read D2 one sentence at a time and ask: if an invoice fools the agent, what does this let it reach? Then find where D3 used that reach.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Isolation: a small VM in the firm's tenant, non-root, input folders read-only, Reconciliation folder writable; test by writing to an input folder, expecting a logged failure. Identity: agent-reconcile, a service account with its own mailbox. Credentials: a one-hour brokered token per run; test by printing the environment, expecting no token.

Egress: allow the model, files, and mail APIs; deny all else; test by connecting to lookup.example.net, expecting a recorded denial. Relays: docconvert fetches URLs and the agent can post to it, which is how D3 opened INV-4471. Constrain it or remove it; test by posting an outside URL, expecting refusal.

</details>

## Explain your choice

Which test would you run first, and what result would stop the pilot?

## Try a changed case

Priya asks the agent to convert euro invoices using one public exchange-rate API. Nothing else changes. What changes in your sketch?

<details>
<summary>Changed-case answer</summary>

Add one allowlisted destination by name, with purpose and approver recorded, read-only. Treat its responses as untrusted content, since they are text the agent reads. General internet stays denied and the docconvert rule stands; the tests gain one line: reach the rate API, succeed; anything else, fail and log.

</details>

## Check one decision

D2 calls docconvert a useful fallback that fetches from the internet. How should the sketch treat it?

- **A.** Leave it; it is internal, and the laptop filter already blocks the agent's egress.
- **B.** Treat it as a relay: remove URL fetching for this caller or put it behind the allowlist, then test.
- **C.** Remove the agent's ability to read PDFs so docconvert is never called.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** D3 shows the gap: five direct egress attempts were denied, then a post to docconvert carrying an outside URL succeeded. A writable service that reaches the internet is a relay.

**B:** This closes the transitive path the incident report and D3 both show, and keeps PDF parsing, which the task needs. [S1]

**C:** The invoices in D1 are PDFs, so this removes the task, not the risk. Fix what docconvert can reach, not what the agent may read.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: Scope the task and the authority](01-scope-the-task-and-the-authority.md) · [Next: Observe and stop](03-observe-and-stop.md) · [Research and limits](sources.md)
