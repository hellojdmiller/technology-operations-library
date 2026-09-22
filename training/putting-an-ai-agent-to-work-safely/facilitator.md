<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Putting an AI Agent to Work Safely: facilitator guide

A colleague can run this course as one session of about 75–100 minutes, or as 3 short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.

## Before the session

- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).
- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.
- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.

## Ground rules

- Try the task before opening the example answer. The example is a comparison, not a mark scheme.
- Explaining a choice matters more than matching the wording.
- A first attempt with honest gaps is more useful than a polished copy of the example.

## Lesson 1: Scope the task and the authority (20–25 minutes)

**Outcome:** Write a one-page authority statement for the partner's request: reads, writes, sends, human steps, identity, expiry.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which line in your statement did Helena's request never mention, and what could go wrong without it?

**Changed case:** Helena adds: 'and can it tidy the vendor names in the tracker while it is there?' Nothing else changes. Does your statement change?

<details>
<summary>Changed-case answer</summary>

Tidying writes to the source of truth Priya relies on, not to the agent's output, so the tracker moves from read automatically to write carefully. Keep it read-only; have the agent list proposed corrections for Priya to apply. If Helena insists, make it a separate write with per-change approval.

</details>

**Check:** Helena writes 'just give it whatever access it needs'. Which response fits the packet? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** D1 needs two folders and one mailbox. D2's token reaches every tenant folder and never expires, so one fooled run can touch anything; D3 already shows a write outside the task.

**C:** No provider offers that guarantee. OWASP treats prompt injection as a standing risk to design around; D1's task is bounded enough to run inside limits. [S3]

</details>

## Lesson 2: Isolate, broker, and allowlist (20–25 minutes)

**Outcome:** Produce a deployment sketch with each control named and the test that proves it.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which test would you run first, and what result would stop the pilot?

**Changed case:** Priya asks the agent to convert euro invoices using one public exchange-rate API. Nothing else changes. What changes in your sketch?

<details>
<summary>Changed-case answer</summary>

Add one allowlisted destination by name, with purpose and approver recorded, read-only. Treat its responses as untrusted content, since they are text the agent reads. General internet stays denied and the docconvert rule stands; the tests gain one line: reach the rate API, succeed; anything else, fail and log.

</details>

**Check:** D2 calls docconvert a useful fallback that fetches from the internet. How should the sketch treat it? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** D3 shows the gap: five direct egress attempts were denied, then a post to docconvert carrying an outside URL succeeded. A writable service that reaches the internet is a relay.

**C:** The invoices in D1 are PDFs, so this removes the task, not the risk. Fix what docconvert can reach, not what the agent may read.

</details>

## Lesson 3: Observe and stop (20–25 minutes)

**Outcome:** Write an observation and stop plan with the kill-switch drill as steps and a place for the time.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which D3 line would you page on, and which would you only count? What separates them?

**Changed case:** Suppose run seven had shown no denied egress, only the 06:11 write. Does your plan still catch it?

<details>
<summary>Changed-case answer</summary>

It should. The write is outside the authority statement's write list, so a plan that alerts on boundary crossings pages regardless of noise. A plan that alerts only on denials misses it, and that quiet crossing is what the plan exists for.

</details>

**Check:** At 06:11 in D3 the agent writes to a deal folder. Under D1 and D4, what should happen? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** A delivered output does not explain a write to a folder the task never named. Under D4 6.1 an uncleared alert pauses the system after 30 minutes; a happy sponsor is no classification.

**C:** D4 6.4 forbids deleting anything that could explain the alert during the observation window. Removing the file and log destroys the record; 'delete reluctantly' binds operators too.

</details>

## After the session

- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.
- Record attendance and the date in your own training record, not in this repository.
- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.

[Back to the course](README.md)
