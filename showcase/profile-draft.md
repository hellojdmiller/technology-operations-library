# Proposed profile and showcase copy

**Private editorial draft · September 18, 2026.** The following copy is for review. It has not been added to a public profile or repository. The linked examples are private today; publication, repository naming, visibility, and pinning remain separate decisions.

## Profile introduction

I'm JD Miller. I work on the operating side of technology: the systems, decisions, and everyday procedures that help people get useful work done.

My focus is IT and security for investment firms, with an interest in where AI and automation improve the work. I build small tools, practical guides, and examples that make the reasoning visible: what is known, what is missing, who needs to decide, and how the result will be checked.

I like a useful starting point more than a large pile of templates. The work here connects code to the operating process around it, with fictional examples, reproducible checks, and clear limits.

I write about these questions at [hellojdmiller.com](https://hellojdmiller.com/).

## Three proposed feature cards

### An assistant that can look things up without changing them

A local MCP service catalog with two read-only tools, strict schemas, pagination, and six fictional services. Follow a working SDK client/server exchange, then inspect what an assistant would still need to ask a person.

**Evidence:** 12 local protocol integration tests and 10 deterministic answer keys passed. Assistant-host and model behavior still need their own trial.

[Private walkthrough](mcp-service-catalog.md)

### Evidence that keeps the unanswered questions visible

An offline control-evidence reviewer that separates configuration from observed behavior. Stale records, conflicting tests, unsupported claims, and exceptions become a review queue.

**Evidence:** 26 local tests passed against synthetic metadata. The tool does not inspect a tenant or verify underlying evidence.

[Private walkthrough](control-evidence-review.md)

### A change packet that knows when a person needs to decide

A small n8n example that checks supplied change metadata and exposes missing evidence, expired standard models, and emergency review routes. A complete packet stays separate from approval to execute.

**Evidence:** Its evaluator and export are covered by the collection's 67 passing local tests. Its three CLI import/execution cases also passed in the pinned n8n 2.39.8 lab; live integrations remain untested.

[Private walkthrough](change-readiness-review.md)

## Editorial notes before sharing

Use a small showcase page with one clear path into each example. Keep the current validation limits next to the demo rather than asking readers to infer readiness from a test badge. Add actual screenshots or recordings only after the selected host or platform has been exercised; these drafts do not stand in for those trials.

If individual examples are later published separately, preserve the applicable license, dependencies, attribution, tests, fixtures, and canonical context. Replace private links with verified public destinations only after that release decision. This draft makes no claim about client outcomes, production deployments, upstream contributions, or measured business impact.
