<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# The First Hour

Three lessons on the first hour of a cyber incident at a small firm: a plan that names people, a triage record that separates facts from assumptions, and a communication plan with the first sentence each person hears.

The first hour of an incident is decided before it starts. When an alert lands at 07:42 on a Monday, the questions are simple: who is in charge, who can pause an account, who calls the bank. If those answers live in a committee charter, the hour goes to finding people instead of acting.

This course follows one fictional morning at a small firm: a phished password, an unfamiliar sign-in, and a forwarding rule quietly copying mail outside. You will fill a one-page plan from a flawed one, write a triage record for the alert, and plan who hears what, and when.

Nothing here needs a tool account. Work on paper or in a document, and do not touch a live system as part of the exercise. Deciding is the practice; doing happens later, with the right authority. The example answers are comparisons, not scripts, and I want you to argue with them.

Each lesson takes about 20–25 minutes. When you finish, the 45-minute incident-readiness workshop in this library's cyber-risk section is the rehearsal that makes the plan a habit. Run it with the same people who appear in your skeleton, and update the plan afterward.

**Format:** Course · **Track:** Technology operations · **For:** The people who would be in the room when something goes wrong at a small, high-trust firm: the technology lead, the operations or finance lead, a partner or executive, and whoever answers the phone.

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Before anything happens](01-before-anything-happens.md) | A one-page plan skeleton filled from the packet, with gaps marked and owned. | 20–25 minutes |
| [2. Triage and contain](02-triage-and-contain.md) | A triage record for the packet's alert with each decision and its owner. | 20–25 minutes |
| [3. Communicate and recover](03-communicate-and-recover.md) | A communication plan with recipients, timing, and the one sentence each hears first. | 20–25 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/the-first-hour
node training/lib/build-course.mjs training/the-first-hour --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
