# MCP service design brief

> Adapted template. Replace bracketed fields. No production project, identity, or permission is implied.

## Problem and intended outcome

[Who loses time or encounters errors today, what task is affected, and what measurable improvement would help?]

## Users and boundaries

[Who may use the service? Which records may each audience access? Who must be excluded? Which data classes and actions are out of scope?]

## Proposed tools

| Tool | User task | Read or write | Permission boundary | Result limit | Failure behavior |
|---|---|---|---|---|---|
| [Name] | [Task] | [Mode] | [Scope] | [Limit] | [Behavior] |

For every write tool, identify the authority, confirmation or review mechanism, idempotency behavior, audit evidence, recovery path, and consequences of a partial failure. A boolean confirmation argument is not a substitute for authorization.

## Identity and data flow

[Describe the client, server, authorization service, and backend. Whose identity calls the backend? Where is the authorization decision enforced? What can a compromised server access? Which tokens are intended for which resource?]

Choose an authentication design supported by the intended clients and current MCP specification. List the actual client versions to test. Do not assume a shared bearer or custom flow works in every assistant.

## Operating requirements

[Record owner and alternate, secrets lifecycle, rate limits, pagination, logging exclusions, monitoring, support hours, recovery target, costs, and retirement plan. Keep actual credentials and account identifiers outside the example.]

## Implementation and acceptance

[Select SDK/runtime and protocol version. Define the smallest useful release. List functional, access-denial, input-validation, failure, and logging tests with expected results. Identify what must be independently reviewed before external exposure.]

## Deployment decisions

[Choose region, environment isolation, networking, identity permissions, image provenance, secret references, staged rollout, health checks, and rollback. Explain decisions; do not assume the companion Bicep's defaults fit the environment.]

## Decision record

| Decision | Proposed choice | Reason | Approver | Status or unresolved question |
|---|---|---|---|---|
| [Decision] | [Choice] | [Reason] | [Role] | [State] |

## Handover

[Link the protected service record, approved tool map, test evidence, deployment record, operational runbook, and review date once they exist. A link to a planned document is not completion evidence.]
