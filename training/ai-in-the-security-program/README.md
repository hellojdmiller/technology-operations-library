<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Where AI Helps a Small Security Team

One short lesson on which security tasks an assistant does well, which decisions stay with a person, what never enters a tool without a data agreement, and how every claim gets verified.

A two-person security function has more alerts, questionnaires, and log lines than hours. An assistant genuinely helps with the reading and writing parts of that work. It summarizes, drafts, explains, and gives a first opinion faster than I can, and I use it for exactly those things.

What it must not do is decide. Declaring an alert a false positive, closing an incident, or granting access are decisions someone is accountable for, and the tool can be confidently wrong or steered by the text it is reading. This module draws that line on a fictional packet, use by use.

It assumes you have taken AI at Work, so the habit of checking a draft against its sources is already there. Here the sources are your own systems. No tool account is needed; work on paper or in a document, and treat the example answer as a comparison, not a script.

**Format:** Short module · **Track:** Technology operations · **For:** The technology lead or small IT and security team at a high-trust firm who want an assistant's help with security work without handing it the decisions. · **Before this course:** AI at Work

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lesson. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Assistant, not analyst of record](01-assistant-not-analyst-of-record.md) | D1's eight uses sorted into assist, assist then verify, and not the tool's decision, with a verification step for each middle-column item. | 12–15 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/ai-in-the-security-program
node training/lib/build-course.mjs training/ai-in-the-security-program --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
