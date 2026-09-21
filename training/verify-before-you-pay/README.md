<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Verify Before You Pay

Three practical lessons on spotting business email compromise, verifying payment changes through a second channel, and writing a procedure a small firm can actually follow.

Most payment fraud I have seen up close did not involve a hacker in the technical sense. Someone asked a busy person to send money somewhere new, gave a good reason, and asked for it today. The request looked ordinary because almost everything in it was ordinary.

This course follows one fictional firm through a week of payment requests: a vendor changing bank details, a partner asking for a confidential wire, a phone call that sounds like the finance lead, and a procedure with a hole in it. You will mark up, verify, and redesign; you will not pay anything.

No technical background is needed. Work on paper or in a document, try each task before opening the example, and keep the packet open. The habit I want you to leave with is small: when the destination of money changes, stop and verify through a channel the request did not give you.

The suggested 15–20 minutes per lesson is a starting estimate. Take longer if you want, answer aloud or in writing, and bring your own firm's procedure alongside D4. The example answers are comparisons, not scripts.

**Track:** Security awareness · **For:** Anyone who requests, approves, or processes payments or vendor changes at a small firm: finance, operations, executive assistants, and partners. No technical background is needed.

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Recognise business email compromise](01-recognise-business-email-compromise.md) | Mark up two payment-related messages with what is being changed and what is creating the pressure. | 15–20 minutes |
| [2. Verify through a second channel](02-verify-through-a-second-channel.md) | Write a verification plan for one change request that names the channel, the person, and the record kept. | 15–20 minutes |
| [3. Design the procedure and the response](03-design-the-procedure-and-the-response.md) | Draft a one-page payment-change procedure and first-hour response that a small firm could adopt. | 15–20 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/verify-before-you-pay
node training/lib/build-course.mjs training/verify-before-you-pay --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
