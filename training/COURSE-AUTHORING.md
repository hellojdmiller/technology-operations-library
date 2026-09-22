# Authoring a course

Every course in this directory is one folder with a canonical `course.json`. Everything a learner reads (README, lessons, packet, worksheet, facilitator guide, research notes) is generated from that file by `training/lib/build-course.mjs`. Edit the JSON, regenerate, and commit both.

```sh
node training/lib/build-course.mjs training/<course>          # generate
node training/lib/build-course.mjs training/<course> --check  # CI runs this for every course
node training/lib/build-course.mjs --all --check
```

## Shape

Top level: `version` (semver), `slug` (matches the folder), `title`, `track` (`security-awareness`, `ai-at-work`, or `technology-operations`), `audience` (one sentence: who this is for), `prerequisites` (array of course titles or short phrases; may be empty), `description` (one sentence), `introduction` (two to four first-person paragraphs), `reviewedOn` (ISO date), `scenario`, `lessons` (three to five), `sources` (three or more).

`scenario`: `title`, `description` (say plainly that everything is fictional and give the exercise reference date), `documents` (three to six, ids `D1`..`Dn`, each with `title`, `date`, `kind`, `body` paragraphs). The packet is what learners work from. At least one document should be a realistic artefact of the threat or task (a suspicious message, a change request, a policy excerpt, a log extract). Where a document is deliberately flawed or malicious, say so in the scenario description, not inside the document.

Each lesson: `slug`, `number`, `title`, `summary`, `duration` (like `15–20 minutes`, en dash), `outcome`, `explanation` (two to five paragraphs, first person, cite sources as `[S1]` or `[S1, S2]` at the end of a sentence), `workedExample` (`title`, `before`, `after`, `why`), `task` (`prompt`, `deliverable`, `checklist` of three to six items), `hint`, `modelAnswer` (paragraphs), `reflection` (one question), `transfer` (`prompt`, `answer`), `check` (`question`, three `options` with `id` a/b/c, `label`, `feedback`; `answerId`). Readable words per lesson: 350 to 1,000. Most lessons sit between 600 and 800; use the room above that for a fuller example answer or a fourth explanation paragraph, not for a longer lecture.

Each source: `id` `S1`..`Sn`, `title`, `publisher`, `url` (HTTPS, a real page you opened), `publishedOrUpdated` (as the page states it, or "month only" / "undated" when that is the truth), `reviewedOn` (equal to the course date), `support` (what the source actually says), `application` (how the lessons use it), `limits` (what it does not prove), `revisit` (when to recheck).

## Voice and rules

- First person, JD Miller, an operator writing for colleagues at small high-trust firms. Plain words, short paragraphs (35 to 55 words), one idea per paragraph. Say what to do and why; no scare tactics, no marketing, no vendor pitches. Vendors are named only when the reader needs the product's actual behaviour.
- No em dashes anywhere. Use commas, colons, periods, or parentheses. The builder rejects them.
- Everything in the packet is fictional: people, firms, domains, amounts, dates. Use `example.com`-style domains and invented names. Never reference a real client, investor, colleague, firm, or credential. Never write the author's employer's name.
- Sources are real and current. Open every URL before citing it. Prefer primary guidance (CISA, NIST, NCSC, FTC, FBI IC3, Microsoft, Google, Apple documentation, peer-reviewed studies). Describe what the page says, not what you wish it said. If guidance conflicts, say so in `limits`.
- Example answers are comparisons, not scripts. Feedback explains the reasoning, and every wrong option's feedback says specifically why it falls short in this packet.
- Separate deciding from doing: a learner drafts, flags, reports, or verifies; they do not send, pay, approve, or change production systems inside the exercise.
- Accessibility: tasks can be done on paper, spoken, or typed. No lesson depends on a tool account.

## What a good lesson does

It names one habit, shows it once (before and after), makes the learner do it once on the packet, lets them compare against an example, asks them to explain their choice, changes one condition to see if the habit transfers, and checks one decision. If a lesson cannot fit that pattern, it is two lessons or none.
