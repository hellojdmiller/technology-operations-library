# 100 training sites for people at work

Useful learning often already exists in the tools a team uses. I would start there, give people a small task to practice, and check whether they can explain the result. Buying another training subscription is a separate decision.

This directory brings together **100 learning destinations** for employees, operators, developers and managers. They offer public learning, free learner accounts, or training included for existing customers. **Reviewed September 19, 2026.** The free scope and access conditions are recorded for every entry.

**[Browse all 100 sites](DIRECTORY.md)** · **[Download or view the CSV](training-sites.csv)** · **[Structured source data](sites.json)**

## What “free” means here

| Access label | Meaning | What to confirm before assigning it |
|---|---|---|
| Public learning | The specified reading, tutorial or video material is publicly accessible without a paid learning subscription. | Accounts may still be needed for saved progress, exercises or linked services. |
| Free learner account | The specified learning is available through a no-cost account or free catalog tier. | Select the free course; check quotas, enrollment windows and any separate assessment fees. |
| Included for customers | The specified training has no additional training fee for eligible existing customers. | Confirm the organization's product subscription, learner eligibility and access route. This is not free to every organization. |

The label applies to the **learning scope**, not to the entire vendor catalog or product. Exams, instructor time, cloud consumption, product licenses, advanced labs, team dashboards and LMS integrations may cost extra. A free course does not establish free organization-wide reporting. Temporary trials, conference vouchers and student-only benefits are not the basis for inclusion.

Employees can use the applicable individual or customer learning route. Linking people to a course does not establish permission to copy its videos, slides or quizzes into an internal LMS. This directory contains original summaries and proposed exercises, with links to the publishers' material.

## Start with the work

These are suggested starting routes, not mandatory curricula. Pick the services your organization actually uses; use the directory to check access before assigning a course.

| Learner | Start here | Ask them to demonstrate |
|---|---|---|
| New employee | Microsoft 365 or Google Workspace, the team's collaboration tool, then its password-manager learning | Find the right document, explain sharing scope and describe where to report an access problem. |
| Team coordinator | The team's project-management academy, HP LIFE and OpenLearn | Write a clear request with an owner, intended result and next decision. |
| AI champion | OpenAI Academy or Claude Academy; add Google ML Crash Course for evaluation concepts | Improve a fictional prompt, check its output and explain when human review is needed. |
| Service-desk operator | Microsoft Learn, the relevant device-management learning, and the library's vendor task cards | Explain the intended target, scope, recovery step and evidence needed for a change. |
| Automation builder | n8n public tutorials, the team's automation academy, GitHub Skills and Postman | Diagram a fictional workflow, identify permissions and distinguish execution status from the intended result. |
| Security practitioner | Cisco Networking Academy, Fortinet Training Institute or PortSwigger, according to role | Explain a risk, a proposed control and the observation that would test it. |
| Developer or analyst | MDN, freeCodeCamp, Full Stack Open or the relevant data-platform university | Produce a small working example with synthetic inputs and explain a failure case. |
| Content owner | W3C WAI tutorials, Google Skillshop and Semrush Academy | Improve a fictional page's accessibility and measurement plan without overstating what metrics prove. |

Use the [vendor task cards](../vendor-walkthroughs/README.md) for guided practice and the [delivery pack](../delivery/README.md) for coaching and later follow-up. Record watched/read material, vendor completion, practice evidence and independent performance separately in the [training record](../training-record-template.md). A course badge does not itself grant production access or prove job competence.

## Turn the list into an organization resource

1. Import the CSV into your approved spreadsheet or catalog. It contains no learner records.
2. Filter by audience, category and access model. Choose a small starter set rather than assigning all 100 destinations.
3. Add local fields for the training owner, approved account route, product edition, required or optional status, accessibility needs, and review date. Keep employee progress in the organization's protected system.
4. Choose one relevant lesson and an original starter task. Use fictional data; keep live tenant actions outside a basic learning exercise.
5. Review the work, then revisit it with a changed scenario. Measure time, corrections and explanation quality before claiming a productivity benefit.

The proposed starter tasks are this library's adaptations. They are not vendor exam questions, answer keys, verified lab instructions or evidence of a completed course. Where practice needs software or a lab, confirm its prerequisites or use a paper walkthrough.

## Selection and research method

“100” is a curated collection, not a scored ranking. Selection favored practical relevance to work, an official source with an identifiable free learning scope, a useful starting path and a clear boundary around paid services. Broad academic portals are included where they build transferable computing, communication or quantitative skills.

The unit is a distinct learning destination or program, not a separate row for every course, language or video channel. A publisher may appear more than once when it runs materially different programs—for example, employee productivity training and an administrator learning platform. Renamed portals are counted once.

Each entry records the publisher, direct destination, audience, access model, free scope, limits, proposed exercise, review date and source evidence. A source's publication or update date is recorded when identifiable; **unknown** means it was not established, not that it is current. Review dates record our inspection and do not change the publisher's date. Public sources were read; authenticated enrollment, full video playback, captions, organization entitlement and learner outcomes were not tested.

Excluded from this edition: New Relic University and Asana Academy where older free-training announcements did not establish current enrollment access; JumpCloud University where the current enrollment route led to product-admin sign-in and ongoing independent free learning access remained unclear; uncertain customer/partner-only entitlements; restricted government learning portals; and expiring event promotions. An omission is not a judgment on teaching quality. No source establishes that these 100 are universally the best or that completing them improves productivity by a particular amount.

Before assigning learning, reopen its destination and evidence links. Revisit an entry when a portal moves, a publisher changes its free tier, enrollment requires payment or an unavailable license, a course is retired, or the instructions no longer match the product. Mark unresolved access as unknown and suspend the assignment until checked. As a proposed maintenance cadence, review organization-used entries quarterly and unused entries before adoption; no automated monitoring is configured.

## Files and maintenance

| File | Purpose |
|---|---|
| [sites.json](sites.json) | Canonical records and per-entry evidence; edit this first. |
| [DIRECTORY.md](DIRECTORY.md) | Generated category index and 100 readable detail cards. |
| [training-sites.csv](training-sites.csv) | Generated, quoted CSV for filtering and catalog imports. |
| [build.mjs](build.mjs) | Dependency-free schema/count/uniqueness check and deterministic exporter. |

From the repository root, use Node.js 22 or later:

```sh
node training/free-training-directory/build.mjs
node training/free-training-directory/build.mjs --check
node scripts/build-catalog.mjs
git diff --check
```

The generator verifies data structure and generated-file agreement. It does not crawl vendor pages or prove that a learner can enroll. Follow the repository's [research requirements](../../CONTRIBUTING.md) when changing an entry, preserve source dates and access limits, and record observed checks in [VALIDATION.md](../../VALIDATION.md).
