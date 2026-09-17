# Write an SOP another operator can use

Start with the event that makes somebody open the document. Then explain what they need, what they may do, how they know it worked, and where they stop. A good SOP reduces the number of things the reader must infer.

This is a proposed authoring and review guide. The template below is reusable; its blank fields do not establish approval or operational readiness.

## Decide the scope before writing steps

Use one procedure for one meaningful outcome. A network triage SOP should establish impact, collect evidence, route the issue, and verify recovery. Product-specific remediation that changes shared infrastructure belongs in a separately authorized procedure with its own recovery plan.

Describe the intended operator's knowledge and access. An administrator guide, a user help article, and an emergency leadership card have different readers. Link between them instead of hiding every audience in one long document.

## Copyable procedure structure

```text
Title and document ID:
Status / version / effective date / approval reference:
Document owner / backup / review trigger:
Content reviewed / configuration observed / procedure exercised:

Purpose and observable outcome:
Trigger and intended operator:
In-scope services and exclusions:
Authoritative inventory and current-facts references:

Required inputs:
Required access and how authorization is confirmed:
Recommendation / approval / execution / verification roles:
Preflight checks, affected population, and protected evidence location:

Steps:
  1. Action, actor, expected observation, evidence to retain.
  2. Branch if the expected observation is absent or contradictory.
  3. Change or escalation only within the documented authority.

Stop conditions and urgent escalation route:
Partial failure: known state, unknown state, safe next action:
Recovery: authorized method, prerequisites, limits, result check:
Closure criteria and receiving business-owner acceptance:
Unresolved exceptions, owner, due date, interim safeguard:

Revision history and official platform references:
Exercise scenario / actual result / limitations:
```

## Make the steps executable

Write “compare the requested role with the recorded approval; stop if they differ” instead of “check permissions.” Name the relevant evidence, not just “take a screenshot.” Record the service, time, scope, result, and version; protect or redact identifiers according to the evidence location's rules.

Distinguish these states throughout: requested, authorized, queued, executed, observed, verified, and accepted. A remote command marked queued is not a completed action. A provider ticket marked resolved still needs the outcome check required by the procedure.

Keep exact admin commands and UI paths in a maintained platform annex when they are necessary. Specify product, version or edition, role prerequisites, expected output, and failure behavior. Check vendor documentation before updating the annex; do not turn old source text into a current technical instruction without review.

## Design for an uncertain result

Before a retry, ask whether the first attempt may already have changed something. Inspect the source system using the request ID or other stable reference. Reconcile completed and pending work, and replay only the missing authorized portion. An unanswered API call is not proof that the action failed.

State rollback limits. Reinstating a permission may be possible; recovering deleted data may not be. If the procedure has no tested recovery method, say so before the change step and require an appropriate decision on that risk.

## Review with a second operator

Use a fictional case first. Give the receiving operator the starting inputs and document access, then let them explain the next action without the author filling gaps. Record where they needed undocumented knowledge. A tabletop checks reasoning and navigation; a sandbox exercise checks the specific tested behavior. Neither proves all production cases.

| Review question | A useful answer |
|---|---|
| Can the operator recognize the trigger? | A concrete event with an identifiable source |
| Is the scope bounded? | Service, population, environment, and authority are explicit |
| Is there a success check? | An observation that demonstrates the intended business outcome |
| Can the operator handle a mismatch? | A branch, stop condition, and named escalation role |
| Is recovery realistic? | An authorized method with known prerequisites and limits |
| Does closure leave unfinished work visible? | Every exception retains an owner, next action, and review date |

Use the [readiness exercise](succession/readiness-exercise.md) for a broader handover rehearsal, and the [notes-to-runbook skill](../skills/notes-to-runbook/SKILL.md) for a provider-neutral drafting aid.
