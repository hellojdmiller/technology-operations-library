# Helping people build capability with AI

> Public-library copy of the September 19, 2026 published edition. Original evidence-review dates are preserved. See [source and sync notes](SYNC.md).

I want an AI rollout to leave people able to do more, explain more, and make better decisions. Completing today's task matters. So does whether the person can handle a different version of that task next month, recognize a bad answer, or help a colleague through an exception.

This is the third companion to [Beyond the model frontier](beyond-the-model-frontier.md). The [acceptance concept](ai-acceptance.md) asks what makes generated work usable. The [review guide](acceptance-review.md) tests the workflow. This guide asks how the person using it develops. I would design those outcomes together.

The practical resources are an editable [development plan](companions/09-user-development-plan.md), a blank [progress log](companions/user-progress-log.csv), and a [fictional example log](companions/fictional-user-progress-log.csv). They are also in the [complete companion pack](companions/README.md).

## Start with a capability someone wants to build

“Use AI more” is an activity target. I would begin with a capability that matters to the person and the team: explain a renewal recommendation, diagnose an access problem, distinguish an investment claim from its supporting evidence, or produce a procedure that another operator can follow.

Then make the next step small enough to practice. A person learning access troubleshooting might first distinguish authentication from authorization using a fictional ticket. Later, they could compare explanations against logs, recognize an exception, and write a clear escalation. Each step has something observable to discuss.

I would agree on the goal with the learner, ask what they already know, and use a short starting exercise. Prior experience, language, accessibility needs, and familiarity with the tool all affect the support that will be useful. A capable operator learning a new system needs a different starting point from someone learning the underlying concept.

## What the research gives me reason to try

Research supports taking the design of assistance seriously. It does not establish a universal ladder for workplace development.

In an undergraduate physics experiment, a purpose-built AI tutor produced stronger immediate learning results than the study's active-learning classroom condition. That is encouraging evidence for carefully designed tutoring, within two lessons and one course. It does not establish durable workplace competence or that any chatbot will teach equally well. [Kestin and colleagues, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)

A high-school mathematics experiment found that ordinary answer-oriented assistance improved practice performance while harming subsequent unassisted exam performance. A tutor designed around teacher-provided guidance largely avoided that harm, without demonstrating an unassisted learning advantage over the control group. I read this as a reason to distinguish successful practice from learning. [Bastani and colleagues, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/)

Anthropic's coding experiment found lower immediate mastery with AI assistance overall. Its analysis of how participants interacted with the assistant suggested that engagement with explanations mattered. Those interaction patterns were not separately randomized interventions, so they suggest approaches to test rather than prove a particular coaching method works. [Coding-skill study, January 2026](https://www.anthropic.com/research/AI-assistance-coding-skills)

The progression below is my proposed application of those questions to operating work. I would evaluate it locally and change it when the observations disagree. The [evidence notes](companions/08-evidence-and-limitations.md) record the studies and their limits.

## Change the kind of assistance as the person progresses

I would use four stages for a particular capability. They describe the support needed for that task, not a person's overall ability or job level.

| Stage | How AI can assist | What I would look for before trying the next step |
| --- | --- | --- |
| Understand | Explain terms, connect them to a familiar example, and walk through a checked reference case. | The learner explains the goal, a key distinction, and where to verify an answer. |
| Practice | Offer a hint, critique an attempt against a rubric, and give specific feedback. | The learner completes varied practice cases and explains corrections with the agreed support. |
| Transfer | Introduce an unfamiliar exception; challenge assumptions after the learner proposes a response. | The learner recognizes what changed, checks evidence, and knows when to ask for help. |
| Improve and teach | Help compare approaches, draft a better procedure, and prepare a handoff exercise. | Another person can use the explanation, and the original learner can defend its limits. |

Progress need not be linear. Someone may be ready to teach a familiar process and need a worked example for a new tool. A changed policy may justify returning to practice. I would reduce support when the evidence supports it and restore support when the task changes or the person gets stuck.

Moving to another learning stage never grants production access or approval authority. Those remain separate decisions under the [acceptance review](acceptance-review.md).

## Give each interaction a clear purpose

I would distinguish three modes and let the person choose deliberately.

**Learn:** build understanding through examples, prediction, practice, and feedback. Keep the next question manageable. If the learner is missing a prerequisite, explain it instead of prolonging a guessing exercise.

**Work:** help finish an authorized task efficiently. Show the important assumptions, sources, and verification steps. An urgent incident is a poor place to insist on a tutoring dialogue; record the concept to revisit after the immediate work is stable.

**Review:** examine an attempt against an agreed reference or rubric. Explain which observation supports each piece of feedback. The assistant's praise or score is a suggestion to check, not proof that a person has mastered the task.

That distinction also respects experienced users. They may want a direct explanation of an unfamiliar detail, then return to work. A learning design should offer useful support without making every interaction slower.

## A coaching loop I would pilot

I would try a short cycle: agree on the objective, ask for an initial attempt or prediction, provide targeted help, let the learner revise, and ask them to explain what changed. Finish by choosing a different case to revisit later.

Use an approved reference answer, policy, or test fixture. Check the assistant's feedback against it. Otherwise, a confident but incorrect tutor can turn a misunderstanding into a lesson. AI can propose additional examples; a knowledgeable reviewer should check consequential examples and answer keys before use.

Here is a reusable prompt for a practice session:

> Help me learn [specific capability] using this approved or fictional reference: [material]. My current experience is [description]. Begin with one short task to see where I need help. Let me attempt it. Offer the smallest useful hint, then more explanation if I ask or remain stuck. Check feedback against the reference and identify anything it does not resolve. Ask me to explain my correction and give me one different example. Keep claims about my progress tied to what you observed. Do not take actions in external systems.

For an experienced person, I would use a different prompt:

> Review my proposed approach against [reference and criteria]. Identify the most consequential assumption, an exception I may have missed, and how I could verify each. Let me revise the approach before showing an alternative. Separate an error in my explanation from missing information in the reference.

These prompts are starting points. Test whether they produce useful feedback with the selected model and reference material. Keep the learner's explanation and reference evidence with the observation.

## Make progression concrete in a small firm

| Role and capability | Starting exercise | Later transfer or handoff |
| --- | --- | --- |
| IT operator: access troubleshooting | Explain a fictional sign-in failure and identify the next permitted diagnostic check. | Handle a different failure without copying the first fix; explain escalation and verify a test outcome. |
| Operations colleague: vendor review | Separate a marketing feature from a purchased entitlement using a fictional document packet. | Handle a dated amendment, preserve missing security evidence, and explain the open decision to a colleague. |
| Analyst: source-based research | Distinguish an issuer claim, a primary fact, and an inference in a synthetic company brief. | Reconcile conflicting dates or definitions and explain what additional evidence would change the conclusion. |

For a worked example, consider a fictional learner practicing the vendor-review task. A baseline exercise shows that they treat an advertised feature as included in the contract. In guided practice with another packet, a hint helps them find the relevant agreement, and they revise the draft. That is successful assisted practice; independent handling of a new case remains unobserved.

In a later transfer case, they identify an amendment that applies only to one entity and explain the limit without an answer or hint from AI. A reviewer checks the explanation against the exercise key. A delayed case and a handoff are still needed to understand how far the learning carries. The [example log](companions/fictional-user-progress-log.csv) keeps those observations separate, including a delayed check that has not occurred.

## Measure growth alongside useful work

I would review four things together: whether the output met its requirements, what assistance was needed, whether the learner could explain and transfer the idea, and what it cost the team to support the process.

Keep the task, difficulty, permitted aids, reference version, and review conditions with each observation. Fewer hints on an easier case do not establish progress. More questions can be useful if the person is noticing a consequential gap. Confidence is worth discussing, but it should not substitute for demonstrated understanding.

Use descriptive results: demonstrated, partial, not demonstrated, or not observed. State whether the result was achieved with hints, a worked answer, a human coach, or no answer assistance. Schedule a later unfamiliar case. A missed check leaves retention unknown; it does not turn into a failure or a pass.

I would also record learner effort, coach/reviewer effort, and useful work completed. A training approach can improve learning while requiring more time initially. A faster workflow can be valuable while leaving the learning question unanswered. Comparing repeated matched tasks, with the same criteria and recorded support, gives the team a better basis for choosing what to continue.

## Start with one capability and revisit the arrangement

My starting plan would be one learner, one coach or reviewer, and one useful capability. Agree on a baseline case, a few varied practice cases, a later transfer check, and what would support changing the level of help. Set the schedule around real opportunities to practice rather than a promise that everyone progresses in a fixed number of days.

Give the learner access to the record and a way to correct it. Retain only the observations needed for the agreed development purpose, with named viewers and a review or deletion date. A development log should help decide the next exercise; it is not an automatic ranking or promotion system.

The outcome I would look for is a person who can tackle a wider range of useful work, explain their decisions, and recognize the limits of both their own understanding and the assistant's output. The [development plan](companions/09-user-development-plan.md) turns that into a next step that can be observed and revised.
