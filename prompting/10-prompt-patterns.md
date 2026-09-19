# Copyable prompt patterns for technology operations

Replace bracketed placeholders with approved information. These patterns are drafts to evaluate, not installed skills or guarantees of a correct result. Use synthetic material while learning. None of the prompts grants permission to change a production system, send a message, or upload private data.

## 1. Clarify a rough operating idea

```text
Turn this idea into a bounded operating proposal for [audience]: [idea].
Explain the problem, intended result, affected services, owner roles, key
dependencies, and a small test that would tell us whether it works.
Separate supplied facts from assumptions. Ask only for missing information
that materially changes the design; leave other unresolved fields visible.
```

Review: the proposal has a measurable result, a realistic owner, and visible unknowns.

## 2. Build versus buy

```text
Compare building, buying, and a limited hybrid approach for [capability].
Use these facts and constraints: [packet]. Evaluate operating ownership,
integration, security, ongoing cost, support, failure recovery, and exit.
Do not invent prices or capabilities. Recommend a bounded next step and state
what evidence would change it. Use the build-buy-review skill if available.
```

Review: the comparison includes work after launch, with unsupported facts labeled.

## 3. Research a current technical decision

```text
Research [decision] for [scope] as of [date]. Use current primary sources and
open the pages supporting material claims. Distinguish final guidance from
drafts and documented features from proposed operating choices.
Return a concise recommendation, alternatives, prerequisites, uncertainty,
and direct source links. If browsing is unavailable, say what is unverified.
```

Review: citations support the decision-driving claims and version/date limits remain clear.

## 4. Draft an article as a thought process

```text
Write a first-person article for technology leaders in [audience or operating context] about [question].
Use my approved voice examples and the verified source packet below.
Develop the question, tradeoffs, evidence I would want, and a proposed solution.
Do not invent personal achievements, metrics, deployments, or client stories.
Keep employer identities and private circumstances out. End with a practical
decision the reader can make. [voice examples and source packet]
```

Review: first person expresses judgment rather than unsupported biography.

## 5. Turn notes into a runbook

```text
Turn these synthetic notes into a draft runbook: [notes]. Include purpose,
scope, prerequisites, operator role, procedure, expected results, verification,
failure handling, and escalation. Preserve unknown commands and destinations
as unresolved; do not fill them with guesses. Do not execute any step.
```

Review: another operator can see both what to do and where execution must wait.

## 6. Review a control's evidence

```text
Review this synthetic control packet: [control, scope, evidence, dates].
Separate design, implementation, and operating effectiveness. State which
claim each artifact supports and which remains unknown. Identify stale or
mismatched evidence, the next test, and the accountable role. Do not call a
control effective merely because a setting exists or a vendor report mentions it.
```

Review: conclusions are limited to the observed scope and evidence type.

## 7. Draft a leadership risk update

```text
Using these fictional findings, draft a one-page leadership risk brief.
Lead with the decision requested and the business consequence of deferral.
Show verified progress, material gaps, unknown populations, and expiring
exceptions separately. Preserve owners and dates exactly as supplied.
Do not translate missing evidence into either a pass or a confirmed incident.
[findings]
```

Review: counts reconcile and the reader knows what decision is needed.

## 8. Review an AI use case

```text
Review this proposed AI use case under the supplied example policy: [packet].
Map inputs, model/provider, retrieval sources, tools, outputs, and destinations.
Identify data and action boundaries, misuse/failure scenarios, enforced controls,
synthetic evaluation cases, a stop mechanism, and unresolved approval questions.
The example policy prohibits Confidential data; an exception cannot override it.
Recommend a permitted pilot or explain which design changes are necessary.
```

Review: prompt wording is not presented as the only permission or data-leakage control.

## 9. Create a vendor evidence request

```text
Draft a proportionate evidence request for [service and intended use].
We need to decide [decision]. Prioritize questions about [material dependencies].
For each question explain the decision it informs and an acceptable limited
evidence form. Do not request credentials, unrelated customer records, or raw
incident material. Draft only; do not contact the vendor.
```

Review: the request is scoped, useful, and suitable for a protected exchange.

## 10. Design an n8n sample

```text
Design a manually triggered n8n sample for [review task] using only synthetic
input. Define the input schema, validation, exact identifier matching, unknown
states, review output, and error behavior. Provide readable logic, an export,
fixtures, and meaningful local checks. State the n8n version assumptions and
which import/runtime checks remain unperformed. No credentials or external actions.
```

Review: exported JSON, local logic, and runtime validation are reported distinctly.

## 11. Make a bounded code change

```text
In this local repository, implement [behavior] within [scope]. Inspect the
existing instructions and relevant code first. Preserve unrelated changes.
Use existing patterns and dependencies where practical. Verify [acceptance
cases], including [important failure case], and report actual results.
Do not deploy, change tenant settings, or add unrelated features.
```

Review: the diff matches the request and tests address behavior rather than cosmetic coverage.

## 12. Review an infrastructure proposal

```text
Review this synthetic infrastructure template as code only. Identify exposed
endpoints, identities, role scopes, secret handling, dependencies, cleanup
constraints, and application behavior the template does not implement.
Separate compilation findings from deployment and runtime unknowns.
Propose the smallest relevant changes and a validation sequence. Do not deploy.
```

Review: a successful compile is not represented as proof of authentication or readiness.

## 13. Build a tabletop exercise

```text
Create a fictional tabletop for [scenario] involving [roles]. Provide staged
injects, the decision each inject tests, expected evidence, and a debrief rubric.
Keep all accounts, recipients, data, and actions synthetic. Define a stop rule
if the exercise touches real operations. Do not infer legal notification
deadlines; route applicability questions to the responsible reviewer.
```

Review: the exercise tests decisions and handoffs without causing a live incident.

## 14. Challenge a recommendation

```text
Review this proposed recommendation against the supplied evidence: [packet].
Identify unsupported claims, the strongest practical alternative, hidden
operating work, and the assumptions most likely to change the decision.
Do not manufacture objections for balance. Return specific revisions and
the smallest additional evidence needed to resolve a material uncertainty.
```

Review: critique is tied to the actual evidence and practical consequences.

## 15. Resume a long task

```text
Continue from this handoff: [objective, constraints, decisions, completed work,
evidence, unresolved items, next action]. Check the current state before making
changes. Preserve the original objective and accepted constraints. Complete
the remaining authorized work and report what changed or remains blocked.
Do not redo verified work unless new evidence makes that necessary.
```

Review: the assistant reconciles state and does not turn an old proposal into assumed authorization.

## 16. Design an evaluation

```text
Create a synthetic evaluation set for this prompt and intended use: [packet].
Include ordinary, missing-data, conflicting-source, unsupported-question, and
scope-boundary cases. Define expected observable behavior, critical failures,
and a reviewer rubric. Keep the test set distinct from tuning examples.
Do not invent model outputs or claim that the cases have been executed.
```

Review: each case can distinguish a meaningful success from a plausible-looking failure.
