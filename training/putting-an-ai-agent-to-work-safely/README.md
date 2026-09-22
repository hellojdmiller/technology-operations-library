<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Putting an AI Agent to Work Safely

Three lessons for putting an AI agent that can act to work at a small high-trust firm: scope its authority, isolate and broker what it touches, and plan how to watch it and stop it.

An assistant that only drafts text can embarrass you. An agent that reads files, sends messages, and runs tools can act for you, and that changes the job from protecting information to protecting authority. This course is for the operator asked to deploy one, and for the manager who has to say yes.

I built it around one request most small firms will hear this year: a partner wants an assistant to reconcile a spreadsheet across shared drives and email the results. You will write the authority statement, sketch the deployment with its tests, and plan how to watch the agent and stop it.

The practice comes from three pieces I published on deploying an agent safely, on securing agency, and on observing agents after a public incident report. They are at https://hellojdmiller.com/articles/how-i-would-deploy-openclaw-safely, https://hellojdmiller.com/articles/openclaw-how-do-we-secure-agency, and https://hellojdmiller.com/articles/observing-agents-after-the-openai-hugging-face-incident. The articles argue; this course makes you do the work on a packet.

No agent, account, or tool is required. Work on paper or in a document, try each task before opening the example answer, then explain your choice. The suggested 20–25 minutes per lesson is a starting point. Nothing in the exercise deploys, approves, or changes a real system.

**Format:** Course · **Track:** Technology operations · **For:** The technology operator or small IT team at a high-trust firm asked to deploy an AI agent that can act (read files, send messages, run tools), and the manager who approves it. · **Before this course:** AI at Work; Using AI Without Leaking

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Scope the task and the authority](01-scope-the-task-and-the-authority.md) | Write a one-page authority statement for the partner's request: reads, writes, sends, human steps, identity, expiry. | 20–25 minutes |
| [2. Isolate, broker, and allowlist](02-isolate-broker-and-allowlist.md) | Produce a deployment sketch with each control named and the test that proves it. | 20–25 minutes |
| [3. Observe and stop](03-observe-and-stop.md) | Write an observation and stop plan with the kill-switch drill as steps and a place for the time. | 20–25 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/putting-an-ai-agent-to-work-safely
node training/lib/build-course.mjs training/putting-an-ai-agent-to-work-safely --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
