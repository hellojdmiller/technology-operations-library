<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Passwords, Passkeys, and MFA

Three practical lessons on keeping one password per account, choosing a second factor that resists phishing, and recovering safely when something goes wrong.

Most account takeovers I have dealt with did not involve a clever attacker. Someone reused a password, a personal service leaked it, and the attacker tried it at work. Or a prompt arrived at night and a tired person tapped approve. This course is about closing those two doors.

You do not need a technical background. The three lessons follow one colleague, Priya, through a breach notice, a night of unexpected prompts, and a chat message from someone claiming to be support. Everything in the packet is fictional. Work on paper or in a document; no tool account is needed.

Each lesson names one habit, shows it once, then asks you to apply it to the packet and compare your answer with an example. The examples are comparisons, not scripts. Take the time you need, keep the packet open, and try each task before you read its answer.

**Format:** Course · **Track:** Security awareness · **For:** Everyone at a small, high-trust firm, with no technical background assumed.

## Start here

Read the [shared fictional packet](source-packet.md), then work through the lessons in order. Keep the packet open. Each lesson has a worked example, your own task, an optional hint, an example answer to compare against, a changed case, and one check.

| Lesson | What you will make | Suggested time |
| --- | --- | --- |
| [1. One password per account](01-one-password-per-account.md) | A personal plan for moving three accounts to unique, managed passwords, in order of risk. | 15–20 minutes |
| [2. Choose a stronger second factor](02-choose-a-stronger-second-factor.md) | An annotated decision about which factor to use for which account, and what to do with an unexpected prompt. | 15–20 minutes |
| [3. Recover safely](03-recover-safely.md) | A short recovery note for one scenario, including who to call and what not to do. | 15–20 minutes |

Use the [blank worksheet](worksheet.md) to keep a first attempt separate from any revision. The example answers are comparisons, not wording to memorize. The [facilitator guide](facilitator.md) helps a colleague run the course as a session.

## Research and status

Sources were reviewed **2026-09-21**. The [research notes](sources.md) list what each source supports, how the course applies it, and its limits. The packet, tasks, hints, answer keys, and timing are original learning proposals. No learner trial has been performed for this course.

Everything in the packet is fictional. Never use real client, investor, employee, or credential data as training material.

## Maintain the content

[course.json](course.json) is the canonical source. Edit it and regenerate:

```sh
node training/lib/build-course.mjs training/sign-in-security
node training/lib/build-course.mjs training/sign-in-security --check
```

The check validates structure, dates, source references, and export consistency, not factual correctness or learning outcomes.

[All training](../README.md)
