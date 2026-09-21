<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Phishing and Social Engineering

Three practical lessons on reading a message for the pressure it carries, verifying it through a channel it did not supply, and reporting a click without fear.

Most of the messages that cause real damage at small firms are not clever. They are ordinary requests, sent at a busy moment, from someone who appears to have the right to ask. This course is about noticing the pressure inside a message before you act on the request it carries.

You will work from one fictional packet: a shared-document notice, a text message claiming to be the managing partner, a genuine security notice, and the firm's own one-page reporting instructions. Two of the four are malicious. The point is not to guess which; it is to practice habits that make guessing unnecessary.

No technical background is needed and no tool account is required. Work on paper or in a document. Try each task before opening the example answer, then explain your choice in your own words. The examples are comparisons to learn from, not scripts to memorise or wording to reuse.

Nobody spots every message, and the guidance I lean on says so plainly. What protects a firm is that people report quickly, verify through a channel the message did not supply, and say so without fear when they have clicked. Those three habits are the three lessons that follow.

**Format:** Course · **Track:** Security awareness · **For:** Everyone at a small, high-trust firm: administration, finance, investment, and operations colleagues with no technical background.

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Spot the pressure](01-spot-the-pressure.md) | Mark up two messages with their specific signals and say what each wants the reader to do. | 15–20 minutes |
| [2. Verify out of band](02-verify-out-of-band.md) | Write a verification plan for one message that a colleague could follow unaided. | 15–20 minutes |
| [3. After the click](03-after-the-click.md) | Write a short incident note the technology team could act on without seeing your screen. | 15–20 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/phishing-and-social-engineering
node training/lib/build-course.mjs training/phishing-and-social-engineering --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
