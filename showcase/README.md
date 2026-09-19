# Start with something you can run

**Private review edition · September 18, 2026.** These walkthroughs make three existing examples easier to inspect. They do not publish the repository or authorize a change in visibility.

I want operational tooling to answer a few practical questions: what do we know, what is still missing, who needs to decide, and how will we verify the result? These examples show that approach using fictional data and small, inspectable programs.

| Start here | What you will see | Requirements |
|---|---|---|
| [Control evidence review](control-evidence-review.md) | Configuration, test evidence, gaps, and exceptions become a human review queue | Node.js; no dependencies or accounts |
| [MCP service catalog](mcp-service-catalog.md) | An actual local MCP client discovers two read-only tools and looks up service dependencies | Node.js 22+; local npm dependencies |
| [Change readiness review](change-readiness-review.md) | A complete-looking change packet still separates missing evidence and pending decisions | Node.js for the local demo; an n8n test workspace for the separate import trial |

The quickest starting point is the evidence review: one command produces a readable report. Choose the MCP example to inspect a working protocol boundary, or the change review to follow the reasoning from a supplied packet to a decision queue.

All commands assume a checkout of this private repository and start at its root. The walkthroughs link to canonical source, fixtures, and tests rather than maintaining a second implementation. Keep the example inputs fictional. Each page distinguishes observed local results from work still to be tested in a host or platform.

## What has been checked

Checks were rerun on September 18, 2026, using Node.js **v26.7.0**, against canonical sample code at commit **24bffafa731d59bb652f3a7c5283851406254f28**:

- MCP: syntax, 12 SDK-client integration tests, the demo, and 10 deterministic evaluation answer keys passed. The final integration review also repeated the syntax, tests, and answer keys after a locked dependency installation and in an isolated Node.js v22.23.2 container.
- Evidence review: all 26 tests passed; the fictional fixture returned 8 assessments, 6 requiring review, and 28 review items.
- n8n examples: all 67 local evaluator/export tests passed; the change fixture returned 3 changes, 2 needing attention, and no approved decisions.

These checks establish the listed local behavior. They do not establish assistant-host compatibility, an n8n import result, the quality of a model's answers, or control effectiveness in a real environment. See the [repository validation record](../VALIDATION.md) for the wider collection.

## Proposed public presentation

[Profile and showcase copy](profile-draft.md) is a private editorial draft. It describes the work in first person and proposes a small set of examples to feature. No public profile, repository, pin, or visibility setting has been changed by this packaging work.

Return to the [resource library](../README.md), [work samples](../work-samples/README.md), or [n8n collection](../n8n/README.md).
