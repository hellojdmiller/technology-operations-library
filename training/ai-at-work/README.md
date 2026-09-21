# AI at Work

Three practical lessons for turning everyday information into a useful draft, and knowing what still needs checking.

I would start with a task people already recognize: take meeting notes, a follow-up email, and a short policy, then prepare a clear team update. The useful skill is knowing what to ask for, which details to trust, and how to repair an answer before sharing it.

This course is for employees across administration, finance, marketing, HR, project teams, and other everyday roles. No coding, specialist background, or AI account is required. Work on paper or in a document. Optional tool practice uses only the fictional packet in an organization-approved AI tool.

## Start here

Read the [shared workshop packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson includes a worked example, your own task, an optional hint, an example answer, a changed case, and a short check with authored feedback.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. Give AI a useful job](01-frame-the-task.md) | A clear assignment for the update and action list | 15–20 minutes |
| [2. Give the right information](02-build-the-context.md) | A context note separating current facts from open questions | 15–20 minutes |
| [3. Check it before you share it](03-review-the-answer.md) | A corrected update, action list, and explanation | 15–20 minutes |

Use the [blank worksheet](worksheet.md) to keep an initial attempt and any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the proposed 45–60-minute pilot and plan a later check. Adjust the time and response format to the learner.

## Research and status

Sources were reviewed **September 19, 2026**. The [research notes](sources.md) connect current Microsoft and Google prompting guidance with primary studies on AI assistance and learning. The studies have different tasks and populations; they do not establish the effectiveness of this course.

The packet, prompts, examples, hints, answer keys, and timing are original learning proposals. D4 was deliberately written with errors; it is not an observed model response. No learner trial, model trial, video playback, workplace productivity result, or retained-skill outcome is reported here. The course does not award a certification or grant work permissions. Real employee observations belong in an agreed private location, not this public repository.

The course builds on [the prompting guide](https://github.com/hellojdmiller/technology-operations-library/blob/main/prompting/README.md), [Helping people build capability with AI](https://github.com/hellojdmiller/technology-operations-library/blob/main/research/building-capability-with-ai.md), and the [training delivery pack](https://github.com/hellojdmiller/technology-operations-library/blob/main/training/delivery/README.md). Those remain broader references; this first course provides a small complete practice sequence for employees.

## Maintain the content

[course.json](course.json) is the canonical course source, including the shared packet, all lesson text, checks, and research records. The public website can consume an exact copy. Change the canonical file first and regenerate the Markdown; avoid separate edits that let the examples or answer keys drift.

From this directory, using Node.js 22 or later:

```sh
node build.mjs
node build.mjs --check
```

From the repository root, the equivalent check is `node training/ai-at-work/build.mjs --check`.

The dependency-free script checks the agreed JSON shape, lesson identities and word bounds, dates, unique option/source/document IDs, answer references, research references, and exact generated-file consistency. It generates the three lesson exports, source packet, and research notes. It cannot judge whether a quiz is substantively unambiguous or an answer is accurate; review those against the packet.

Recheck source guidance and answer keys when a scenario, tool assumption, or lesson changes. Keep dates, source roles, open questions, and the difference between drafting and sending consistent across the packet and all exercises. This directory needs no credentials, network service, or package installation to build its exports.
