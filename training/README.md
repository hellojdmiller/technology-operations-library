# Workplace and technology training

Training I would assign at a small, high-trust firm, written so a colleague can run it without me. Short modules and courses that everyone can do on paper, a longer path for the person who runs the platforms, and the directory, delivery pack, and record that make a first session possible. Everything uses fictional packets and needs no tool account. None of it has been tested with learners yet; every module says so on its own page.

## What is here

| Part | What it holds | Start at |
|---|---|---|
| Three tracks | 21 modules built from `course.json`: 12 short modules of 8 to 15 minutes and 9 three-lesson courses of 45 to 75 minutes | [Training catalog](CATALOG.md) |
| Five learning journeys | Ordered sequences of those modules for new joiners, finance, AI users, managers, and technology operators | [Learning journeys](CATALOG.md#learning-journeys) |
| Operator path | 6 longer modules on SaaS ownership, Microsoft 365 and Entra, Google Workspace, Intune, Jamf, and n8n, each with a tabletop mode and an isolated-lab mode | [Operator path](#operator-path-six-platform-modules) |
| Vendor walkthroughs | 8 task cards that pair official Microsoft, Google, Jamf, and n8n material with a 20- to 30-minute original exercise | [Vendor walkthroughs](vendor-walkthroughs/README.md) |
| Free training directory | 100 learning sites with their free scope and access conditions, and a CSV for an internal catalog | [Directory](free-training-directory/README.md) |
| Delivery pack | A proposed 60-minute first session around one task card and the records for 30 days of follow-up | [Delivery pack](delivery/README.md) |
| Training record | A blank record for operator modules and task cards | [Template](training-record-template.md) |

## Three tracks, 21 modules

A **short module** has one lesson of 8 to 15 minutes. A **course** has three lessons of 15 to 25 minutes each, 45 to 75 minutes in all. (The schema allows a second lesson in a short module and up to five in a course; none uses them yet.) Every lesson follows the same pattern: it names one habit, shows it once in a worked example, has you do it once on the fictional packet, gives an example answer to compare against, changes one condition to see whether the habit transfers, and checks one decision. The example answers are authored comparisons, not assessments of the reader.

The [catalog](CATALOG.md) carries the full table for each track: audience, lesson count, time, and source review date. Sources for AI at Work were reviewed September 19, 2026; sources for the other 20 modules were reviewed September 21, 2026.

### Security awareness: 13 modules for everyone

The habits that stop most incidents. Five courses and eight short modules; none assumes another module first.

| Module | Format | Time |
|---|---|---|
| [Sharing Without Leaking](handling-sensitive-information/README.md) | Course | 45–60 min |
| [Phishing and Social Engineering](phishing-and-social-engineering/README.md) | Course | 45–60 min |
| [Passwords, Passkeys, and MFA](sign-in-security/README.md) | Course | 45–60 min |
| [Verify Before You Pay](verify-before-you-pay/README.md) | Course | 45–60 min |
| [Working Securely Anywhere](working-securely-anywhere/README.md) | Course | 45–60 min |
| [Email Habits That Hold](email-security-habits/README.md) | Short module | 8–10 min |
| [Insider Risk Without Suspicion](insider-threat-awareness/README.md) | Short module | 10–12 min |
| [Before You Scan](qr-code-scams/README.md) | Short module | 8–10 min |
| [Ransomware: What Everyone Can Do](ransomware-awareness/README.md) | Short module | 10–12 min |
| [Downloads, Extensions, and Pop-ups](secure-browsing-and-downloads/README.md) | Short module | 8–10 min |
| [What Your Profile Gives Away](social-media-security/README.md) | Short module | 8–10 min |
| [Personal Information in Plain Words](understanding-personal-information/README.md) | Short module | 8–10 min |
| [Calls That Want Something](voice-phishing/README.md) | Short module | 8–10 min |

### AI at work: 4 modules for everyone who uses an assistant

Framing, context, checking, and not leaking. Two courses and two short modules.

[AI at Work](ai-at-work/README.md) is the starting point: a three-lesson course for employees across departments. Practice giving a clear assignment, choosing the right context, and checking a draft before sharing it. One fictional workshop packet connects the lessons; no AI account or technical background is needed. Includes examples, hints, answer guidance, a blank worksheet, and a facilitator guide. [Take the lessons on hellojdmiller.com](https://hellojdmiller.com/learn/ai), or use the editable files here. Sources were reviewed September 19, 2026; the course has not yet been tested with learners. The other three modules assume you have taken it.

| Module | Format | Time | Before it |
|---|---|---|---|
| [AI at Work](ai-at-work/README.md) | Course | 45–60 min | |
| [Using AI Without Leaking](safe-ai-use-at-work/README.md) | Course | 45–60 min | AI at Work |
| [When the Assistant Is Confidently Wrong](ai-hallucinations-and-misinformation/README.md) | Short module | 9–12 min | AI at Work |
| [AI in People Decisions](ai-in-people-decisions/README.md) | Short module | 9–12 min | AI at Work |

### Technology operations: 4 modules for the operator and the room

For the technology lead, the small IT and security team, and the people who would be in the room when something goes wrong. Two courses and two short modules. The six longer [operator modules](#operator-path-six-platform-modules) below continue this track for someone who runs the platforms.

| Module | Format | Time | Before it |
|---|---|---|---|
| [What a Safeguards Program Actually Contains](safeguards-for-a-small-investment-firm/README.md) | Short module | 12–15 min | |
| [Putting an AI Agent to Work Safely](putting-an-ai-agent-to-work-safely/README.md) | Course | 60–75 min | AI at Work; Using AI Without Leaking |
| [Where AI Helps a Small Security Team](ai-in-the-security-program/README.md) | Short module | 12–15 min | AI at Work |
| [The First Hour](the-first-hour/README.md) | Course | 60–75 min | |

The First Hour hands off to the [45-minute incident-readiness workshop](../cyber-risk/workshops/incident-readiness/README.md) in the cyber-risk collection, which rehearses the plan with the same people.

## Five learning journeys

A journey is an ordered list of modules for one kind of person. They live in [journeys.json](journeys.json); the [catalog](CATALOG.md#learning-journeys) lists each one's modules in order with times.

| Journey | For | Modules | Total time |
|---|---|---|---|
| [Everyone: the first month](CATALOG.md#everyone-the-first-month) | Every new joiner, and everyone else once a year | 7: four courses, then three short modules | 204–270 min |
| [Finance and payments](CATALOG.md#finance-and-payments) | Anyone who requests, verifies, approves, or processes a payment or a vendor change | 5, from Verify Before You Pay to The First Hour | 166–215 min |
| [Working with AI](CATALOG.md#working-with-ai) | Everyone who uses an AI assistant for writing, summarizing, research, or analysis | 4: the whole AI at work track, in order | 108–144 min |
| [Managers and team leads](CATALOG.md#managers-and-team-leads) | Anyone who approves access, hires, offboards, or would be called when something goes wrong | 4, from Insider Risk Without Suspicion to The First Hour | 87–109 min |
| [Technology operators](CATALOG.md#technology-operators) | The technology lead or small IT and security team at a high-trust firm | 6, from What a Safeguards Program Actually Contains to The First Hour | 162–202 min |

## How a module is built and edited

Each module folder holds a canonical `course.json` and the files generated from it: `README.md`, one file per lesson, `source-packet.md`, `worksheet.md`, `facilitator.md`, and `sources.md`. Edit the JSON, regenerate, and commit both. [COURSE-AUTHORING.md](COURSE-AUTHORING.md) gives the schema, the voice rules (first person, plain words, no em dashes, everything in the packet fictional, every source real and opened), and what a good lesson does.

```sh
node training/lib/build-course.mjs training/<module>     # regenerate one module
node training/lib/build-course.mjs --all --check         # every module: structure, dates, sources, export drift
node training/lib/build-catalog.mjs                      # rebuild catalog.json and CATALOG.md
node training/lib/build-catalog.mjs --check              # fail on catalog drift
```

The builder rejects a lesson outside 350 to 1,000 readable words, a source without HTTPS, a source review date that differs from the course date, a reference to a source that does not exist, and any em dash. It checks structure and consistency, not factual correctness or learning outcomes. AI at Work predates the shared schema and keeps its own builder (`node training/ai-at-work/build.mjs --check`); the catalog reads its `course.json` like the others. CI runs all of these on every push and pull request.

[catalog.json](catalog.json) is the machine-readable index and [CATALOG.md](CATALOG.md) is generated from it. The same generator reads the operator modules and task cards below from their own header lines, so they appear in the catalog too. Do not hand-edit either file; change a module, `journeys.json`, or a module header, then regenerate.

## Operator path: six platform modules

Practical lessons for the person who has to explain a decision, make a bounded change, and prove the result. The setting is a fictional investment firm: a small internal team, outside specialists, sensitive deal material, and people who need access while traveling.

These are independent practice resources. They are not vendor courses, certifications, or records of training already completed. Product references were checked on **September 17, 2026**; record the version and edition used when you run a lab.

Start with ownership, then choose your identity platform and device platform. Finish with workflow operations. A firm using both ecosystems can complete all six modules.

| Order | Module | Practice outcome | Suggested time |
|---|---|---|---|
| 1 | [SaaS ownership and handover](saas-ownership-and-handover.md) | A service record that another operator can use | 60–90 minutes |
| 2A | [Microsoft 365 and Entra operator](microsoft-365-entra-operator.md) | A scoped identity change and a defensible interpretation of sign-in evidence | 75–120 minutes |
| 2B | [Google Workspace operator](google-workspace-operator.md) | A test-unit change, a coverage check, and a recovery plan | 75–120 minutes |
| 3A | [Intune device operations](intune-device-operations.md) | A pilot compliance result with its assignment and freshness checked | 75–120 minutes |
| 3B | [Jamf device operations](jamf-device-operations.md) | A narrowly scoped inventory policy and verified execution | 60–90 minutes |
| 4 | [n8n workflow operator](n8n-workflow-operator.md) | A workflow trial that checks the business result as well as execution status | 60–90 minutes |

Time estimates exclude purchasing, creating, and enrolling a lab environment. Use the [training record](training-record-template.md) to capture evidence, unresolved questions, and a reviewer's decision.

### Two ways to complete an operator module

**Tabletop** is the default. Work through the fictional scenario, draft the proposed configuration, interpret supplied records, and complete the assessment. It requires no tenant changes. Mark results as *simulated*; screenshots copied from documentation are not execution evidence.

**Isolated lab** adds hands-on practice in a separately provisioned test tenant, test service, or disposable device. A test group inside a live firm tenant is not isolation. The module lists the permissions, licenses, accounts, and hardware that must exist first. If those prerequisites are missing, complete the tabletop and record the lab as not attempted.

Never use investor data, deal documents, employee records, live credentials, actual recovery codes, or production exports as training material. Use fictional identifiers and synthetic content. Destructive actions such as wiping devices, deleting users, or rotating a live integration's credentials remain paper walkthroughs in this collection.

### What counts as completion

Each operator module has five assessment criteria, scored 0–2 each: 0 for missing or incorrect, 1 for a partly supported answer, and 2 for a correct answer supported by the requested evidence. The suggested threshold is **8/10**, with no zero on scope or recovery. This is an internal practice rubric, not a vendor passing score. The 21 modules in the tracks are not scored this way; each ends with one checked decision and an example answer to argue with.

For a tabletop, provide the completed scenario and an honest list of untested assumptions. For an isolated lab, also provide the intended target, actual target, before/after observation, failure observation, and recovery observation. Record elapsed time and unknowns; a green status without context is insufficient.

Keep actual lab evidence in your protected training workspace. Commit only sanitized example records to this repository. A reviewer should be able to distinguish **planned**, **simulated**, **executed**, and **verified** at a glance.

## Task-focused vendor walkthroughs

The [eight vendor walkthroughs](vendor-walkthroughs/README.md) connect official Microsoft, Google Workspace, Jamf and n8n learning material to short, original practice tasks. Each includes a fictional fixture, answer guidance and a changed-scenario question. Sources were reviewed September 19, 2026; publication dates, access requirements and unverified playback/caption details remain visible on the cards.

Use them before or alongside the full modules. Record what was watched or read, any separately verified vendor course completion, and demonstrated task evidence independently in the [training record](training-record-template.md). Completing a video is not evidence that a tenant change or recovery worked.

## Find free learning for your team

The [100-site training directory](free-training-directory/README.md) covers workplace tools, security, cloud, AI and transferable digital skills. Each entry identifies its free scope, account or customer requirements, official evidence and a proposed starter task. Use the CSV to curate an organization-specific list; product licenses, paid exams and team reporting remain separate. Sources were reviewed September 19, 2026.

## Deliver a first session

The [training delivery pack](delivery/README.md) turns one card into a proposed 60-minute session for an internal coach or service provider. Start with Microsoft request routing without a tenant, then use the coach rubric and blank progress log to plan checks around days 7, 14 and 30. Other cards can use the same format with their own prerequisites and answer guidance.

Keep first answers, coached corrections and later independent explanations separate. The pack includes a fictional, incomplete example and accessible reading/response alternatives. Its timing and progression are proposals; no learner sessions, durable learning result or production authority are established. Research was reviewed September 19, 2026.

## Operating exercises

The three operating packs add facilitated scenarios and answer keys; a separate incident-readiness workshop provides a shorter cyber-response rehearsal. Use them after the relevant platform lesson or as a team discussion with your provider. They are fictional paper exercises and authorize no system changes.

| Exercise | Practice |
|---|---|
| [Change management](../operations/packs/change-management/exercise.md) | Model mismatch, partial execution, and emergency authority |
| [Asset lifecycle](../operations/packs/asset-lifecycle/exercise.md) | Custody, evidence conflicts, holds, and disposition boundaries |
| [Patching and remediation](../operations/packs/patching/exercise.md) | Applicability, deployment failure, and expiring exceptions |
| [45-minute incident readiness](../cyber-risk/workshops/incident-readiness/README.md) | Decision authority, uncertain recovery points, access checks and owned follow-up gaps |

Use each exercise's own answer key and scoring rules; do not translate a tabletop score into a claim of production capability.

## Keep your own record

The [operator training record](training-record-template.md) is a blank template for the operator modules and task cards. It keeps what was watched or read, any separately verified vendor course completion, and demonstrated task evidence apart. Completing it does not itself establish competence or authorize production access. For the 21 modules, each facilitator guide says the same thing more simply: record attendance and the date in your own training record, not in this repository.

## How this connects to the library

- Use the [n8n examples](../n8n/README.md) for the automation module and the two n8n task cards.
- Use the [documentation examples](../documentation/README.md) when turning a lab into an operating procedure.
- Use the [reusable skills](../skills/README.md) to draft a runbook or review a decision, then verify the resulting work against the source system.
- Use the [cyber-risk pack](../cyber-risk/README.md) after The First Hour and the safeguards module; its tabletop scenarios, checklists, and control proposals are the next step.

Before repeating a lesson, reopen its official sources. If a control, license requirement, or interface has changed, record the difference instead of forcing an old instruction to fit.
