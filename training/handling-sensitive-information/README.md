<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Sharing Without Leaking

Three practical lessons for deciding what is sensitive, sharing it on purpose, and correcting a mis-share in the first hour rather than the first week.

Most leaks I have dealt with were not attacks. They were a folder link that never expired, a spreadsheet forwarded to be helpful, or autocomplete picking the wrong Marcus. Small firms run on trust and speed, and both make it easy to share one step further than anyone intended.

This course follows one deal week at a fictional firm. You will classify what sits in a diligence folder, answer a counterparty who wants all of it through one open link, and write the correction note for an email that reached the wrong person.

No tool account is needed. Work on paper or in a document, try each task before opening the example answer, then explain your choice in your own words. Where I name a product setting, it is because the setting's behavior matters, not because I am selling it.

Fifteen to twenty minutes per lesson is a starting estimate. If your firm has its own data handling standard, keep it beside the fictional one in the packet and note where they differ. Those differences are worth raising with whoever owns your standard.

**Format:** Course · **Track:** Security awareness · **For:** Everyone at a small, high-trust firm that handles client, investor, deal, and personal information; no technical background is needed.

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Know what is sensitive](01-know-what-is-sensitive.md) | Classify six items from the diligence folder into D3's four levels, with one sentence of reasoning each. | 15–20 minutes |
| [2. Share deliberately](02-share-deliberately.md) | Write a sharing decision for the request in D1, with every setting spelled out in words. | 15–20 minutes |
| [3. Fix mistakes fast](03-fix-mistakes-fast.md) | Write a three-step correction note for the misdirected email in D4 that a colleague could act on today. | 15–20 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/handling-sensitive-information
node training/lib/build-course.mjs training/handling-sensitive-information --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
