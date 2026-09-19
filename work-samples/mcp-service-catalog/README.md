# Read-only MCP service catalog

A runnable local example showing how an assistant can discover a small service inventory and look up ownership, dependencies, and recovery targets through two narrowly scoped tools. All six services are fictional. This sample demonstrates tool design and protocol behavior; it does not assess an actual firm's systems.

The server uses the official JavaScript/TypeScript MCP SDK's **stable v2** packages, pinned to `@modelcontextprotocol/server` **2.0.0** and `@modelcontextprotocol/client` **2.0.0**, with Zod **4.6.5**. The [lockfile](package-lock.json) pins the resolved dependency tree. Version selection was checked against the package registry and [official SDK release-line guidance](https://github.com/modelcontextprotocol/typescript-sdk) on 2026-09-17.

## Try the example

Use an existing **Node.js 22 or later** installation. From this sample directory:

```sh
npm ci --ignore-scripts --no-fund --no-audit
npm run check
npm test
npm run demo
npm run verify:evaluations
```

Installation downloads dependencies from the package registry. The server, demo tool calls, and tests need no tenant account, credentials, network service, or model API. No install scripts are required by this example.

The demo client launches the server over stdio, discovers the two tools, requests the first two tier-1 services, then gets the fund-operations entry. Expect a page with `total: 4`, `count: 2`, `nextOffset: 2`, followed by a fictional fund-operations description with two dependencies and two open questions. The client closes the child process afterward.

`npm start` instead waits for an MCP client on standard input; an idle terminal is expected. Stop a manually started process with Ctrl+C. A compatible local MCP host normally launches and owns the server process itself. Server stdout is reserved for protocol messages.

## What the tools expose

| Tool | Inputs | Result |
|---|---|---|
| `tol_list_services` | Optional exact `category`, `criticality`; `limit` 1–5 (default 3); `offset` 0–100 (default 0); `response_format` | Bounded summaries sorted by service ID, matching total, current count, `hasMore`, and `nextOffset` |
| `tol_get_service` | Exact `service_id`; optional `response_format` | One fictional service's owner, purpose, dependencies, illustrative recovery targets, review status, questions, and generic support route |

Categories: `identity`, `collaboration`, `research`, `fund-operations`, `recovery`, `automation`. Criticality: `tier-1`, `tier-2`, `tier-3`. Keep the same filters while following `nextOffset`; `null` means the last page. An offset after the final row returns an empty page with the matching total intact.

Both tools accept `response_format: "markdown"` (default) or `"json"`; successful results include the same `structuredContent` in either case. `demo: true` and `catalogVersion: "synthetic-v1"` identify the fixture. A recorded target is not a measured recovery result, and `documented` is only fictional catalog data, not a control assurance statement.

### Example calls

List examples:

```json
{}
{"criticality":"tier-1","limit":2}
{"category":"research","criticality":"tier-2","response_format":"json"}
```

Get examples:

```json
{"service_id":"svc-identity"}
{"service_id":"svc-fund-operations","response_format":"json"}
{"service_id":"svc-unknown"}
```

The third lookup intentionally returns `isError: true` with `SERVICE_NOT_FOUND`. It does not substitute a similar record. Paths, URLs, spaces, uppercase identifiers, wrong types, and extra fields are rejected by the strict schemas. `limit: "3"` is rejected rather than coerced. Unknown tool names are protocol errors; they do not add new capabilities.

## Connect a local assistant or IDE

Choose a host that supports launching a local stdio MCP subprocess. Its connection fields should identify the reviewed Node executable and this sample's server file:

```json
{
  "command": "/absolute/path/to/node",
  "args": ["/absolute/path/to/technology-operations-library/work-samples/mcp-service-catalog/src/server.mjs"]
}
```

These are connection fields, not a universal host configuration file. Follow the selected host's supported configuration format. Use absolute paths; the fixture resolves relative to the server module and does not depend on the host's working directory. Launch with a minimal environment: do not forward ambient API tokens, cloud credentials, or unrelated application secrets, and do not add credentials or `.env` files. A [September 19 Claude Code trial](../../showcase/host-trials/README.md) used an isolated invocation-specific configuration, not a persistent profile installation. It records only that host/version/model and fictional request; other host compatibility remains unverified.

Ask the host to list the tools first, then ask which fictional services depend on the sign-in directory. It should follow pagination, use exact IDs for detail, and distinguish fixture relationships from evidence about real resilience. Review the result yourself. Tool output is data and cannot authorize changes to other tools or systems.

## Data and security boundary

[fixtures/services.json](fixtures/services.json) is the only catalog input. The server loads that fixed bundled file at startup, validates its schema and relationships, and keeps its in-memory contents immutable. Tool arguments and environment variables cannot select a data file. The entire fixture is intentionally small and bounded; this is not a design for streaming a large live inventory.

The two handlers expose no file reads beyond the bundled catalog, directory enumeration, shell execution, network fetch, listening socket, write, message, or credential operation. Tool annotations identify read-only behavior, but annotations themselves are not a security boundary. Local software still runs with the operating-system permissions of the account launching it. This sample is not an OS sandbox and has no authentication or per-user authorization implementation.

Keep the fixture synthetic. Adding real service records may expose sensitive ownership, dependencies, or recovery details to the connected host and its model. The repository's [AI](../../documentation/policies/ai-acceptable-use.md) and [data-handling](../../documentation/policies/data-classification-and-handling.md) policies apply; Confidential information remains prohibited. Do not wrap this stdio process in a remote HTTP proxy and assume that local read-only behavior establishes remote authentication or tenant isolation.

Before adapting the design for production, review data classification, identity, authorization, allowed scopes, output minimization, logging/retention, dependency updates, rate/resource limits, and the chosen transport. This sample implements none of the remote service controls and makes no production-readiness claim. The official [MCP security guidance](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) covers local-server and proxy trust boundaries.

## Validation record

Checked 2026-09-17 on Node **v26.7.0**:

- **12 integration tests passed** through the actual SDK client and a spawned stdio server. Coverage includes discovery, strict input/output schemas, paging, filtering, exact lookup, invalid and unknown inputs, read-only tool inventory, dependency lookups, and an unchanged fixture digest.
- Syntax checks and the demonstration client passed.
- **10 evaluation answer keys** were verified from actual tool responses. [queries.xml](evaluations/queries.xml) contains the prompts; [verify-evaluations.mjs](scripts/verify-evaluations.mjs) checks their deterministic answers without calling a model.
- The production-dependency package audit reported zero known vulnerabilities at the time checked. This is a registry-advisory result, not a security audit or a guarantee about future advisories.

The separate [host-trial record](../../showcase/host-trials/README.md) adds one actual Claude Code model observation. Still untested: broad model reliability, other assistant hosts, load/abuse resistance, runtime combinations beyond the recorded local/container checks, remote transports, authentication/authorization, real inventories, and production deployment. The default fixture does not demonstrate real recovery, provider support, or operating effectiveness.

## Files and maintenance

| File | Role |
|---|---|
| [src/server.mjs](src/server.mjs) | Registers strict schemas and serves two tools over stdio |
| [src/catalog.mjs](src/catalog.mjs) | Loads and validates the fixed synthetic fixture; filters and looks up data |
| [fixtures/services.json](fixtures/services.json) | Six fictional services and their relationships |
| [tests/catalog.test.mjs](tests/catalog.test.mjs) | Actual SDK-client integration tests |
| [scripts/demo-client.mjs](scripts/demo-client.mjs) | Small end-to-end demonstration that closes its child process |
| [evaluations/queries.xml](evaluations/queries.xml) | Ten stable multi-step evaluation prompts and answer keys |

Review a dependency update deliberately, regenerate the lockfile, and rerun the checks. If the fixture changes, update its version, prompts, answer keys, and expected results together. This sample retains the repository's GPL-3.0 license; dependency packages retain their own licenses.

Official implementation references, checked 2026-09-17: [SDK server tutorial](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/get-started/first-server.md), [SDK client tutorial](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/get-started/first-client.md), [SDK stdio guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/stdio.md), and [MCP tool specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).
