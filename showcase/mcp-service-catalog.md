# Explore service dependencies through two MCP tools

**Walkthrough · runnable local sample · fictional data.** [Canonical sample](../work-samples/mcp-service-catalog/README.md) · [Source](../work-samples/mcp-service-catalog/src/server.mjs) · [Fixture](../work-samples/mcp-service-catalog/fixtures/services.json)

## The problem and the intended user

An assistant needs a useful view of a service inventory without gaining general file, shell, or change access. This example is for an IT operator or developer learning how to give a local assistant a narrow lookup capability.

The fictional fund-operations workspace depends on the sign-in directory and collaboration workspace. An operator wants its owner, dependencies, and unresolved handoff questions. The catalog can supply those records; it cannot prove the service is healthy or approve a workaround.

## Run it

Use Node.js **22 or later** and a shell such as zsh or bash. From the repository root, run this block. The parentheses keep the directory change local to the block.

```sh
(
  cd work-samples/mcp-service-catalog
  npm ci --ignore-scripts --no-fund --no-audit &&
  npm run check &&
  npm test &&
  npm run demo &&
  npm run verify:evaluations
)
```

The installation uses the checked-in lockfile and downloads packages. The demo and tests themselves require no tenant credentials, model API, or remote service. The demo launches the real stdio server through the SDK client, calls its tools, and closes the child process.

## What to expect

The beginning of the observed demo output was:

```text
Available tools: tol_list_services, tol_get_service
```

The first result carries `demo: true` and `catalogVersion: "synthetic-v1"`. It lists two tier-1 services with `total: 4`, `count: 2`, `hasMore: true`, and `nextOffset: 2`. Four is the filtered total, not the six-service fixture's full size.

The detail lookup includes these observed lines:

```text
## Fund operations workspace (svc-fund-operations)
Fictional demonstration record; no live operational status.
Dependencies: svc-identity, svc-collaboration
Illustrative targets: RTO 6 hours; RPO 2 hours. Targets are not measured results.
```

## Inspect the boundary

1. Open the fixture and follow the exact dependency IDs. A name that looks similar is not the same record.
2. Inspect the list result's paging fields. A client must follow `nextOffset` with the same filters before describing all matches.
3. Read the two open questions in the fund-operations result. They remain questions, even when the lookup succeeds.
4. Read the [integration tests](../work-samples/mcp-service-catalog/tests/catalog.test.mjs): they exercise wrong types, extra fields, unknown IDs, unknown tools, and repeated read-only lookups through the actual client/server boundary.

## Validation and next step

On September 18, 2026, Node.js v26.7.0 passed syntax checks, **12 integration tests**, the demo, and **10/10 deterministic answer keys**. The integration review then reran a locked installation with `npm ci --ignore-scripts` and repeated the syntax, test, and answer-key checks successfully. Those same checks also passed in an isolated Node.js v22.23.2 container with networking disabled. The answer-key check calls tools directly; it is not a model evaluation.

The next useful trial is the canonical sample's [assistant/IDE connection exercise](../work-samples/mcp-service-catalog/README.md#connect-a-local-assistant-or-ide), with a chosen host and recorded version. Host installation and model behavior remain unverified. This local sample has no remote authentication, per-user authorization, production inventory, or measured recovery result. It is also not an operating-system sandbox.

[Choose another example](README.md).
