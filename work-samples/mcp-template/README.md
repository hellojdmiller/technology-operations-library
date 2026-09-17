# MCP service design template

An adapted work sample for designing an MCP service and preparing its deployment contract. It keeps the useful structure of a project template while removing internal service inventories, organization naming, deployment identities, and operational history.

This directory is a **design template, not a runnable MCP server**. The companion [Azure sample](../azure-container-app/README.md) supplies infrastructure scaffolding. Application code, authentication, tool implementations, SDK selection, and client configuration remain project work.

## Start with the problem

Complete the [design brief](design-brief.md) before selecting authentication or deployment options. Identify the user's task, information boundary, approved actions, and owner. A narrow read-only tool can be more useful than an integration with a large unreviewed action surface.

## Application contract

- Provide an MCP HTTP endpoint at `/mcp` on container port `8000` if using the companion infrastructure.
- Provide a `/health` endpoint that returns only minimal health information. Do not include secrets, tenant details, dependency credentials, or sensitive payloads.
- Read configuration from a project-specific environment-variable prefix; resolve necessary secrets through the chosen secret-management mechanism.
- Authorize each tool and underlying resource for the caller. A valid sign-in does not imply access to every backend record.
- Return bounded results, handle pagination explicitly, distinguish missing data from denied access, and honor upstream throttling.
- Log operation metadata and correlation references without recording tokens or full sensitive input/output bodies.

The infrastructure's authentication-mode parameter only passes configuration and provisions dependencies. It does not implement the protocol. Select an SDK and protocol revision deliberately, then follow the [official MCP specification](https://modelcontextprotocol.io/specification/latest) and its authorization requirements for the selected transport.

## Reviewable tool contract example

| Field | Fictional design |
|---|---|
| Tool | `lookup_service_owner` |
| Purpose | Find the role accountable for a service in an approved catalog |
| Input | Stable service identifier with a bounded length |
| Output | Service label, owner role, support route reference, evidence date |
| Access | Caller may read only catalogs they are authorized to access |
| Exclusions | No credential retrieval, private contact export, or configuration changes |
| Failure | Explicit not-found, denied, unavailable, and incomplete-data responses |
| Audit | Correlation ID, caller reference, tool name, result category, duration |

## Verification cases

| Case | Expected evidence |
|---|---|
| Authorized request | Only the permitted record and documented fields returned |
| Missing or invalid authentication | Request rejected at the appropriate boundary |
| Wrong token audience or insufficient permission | Rejection; no upstream read performed |
| Another user's resource identifier | Access denied even when the identifier is known |
| Malformed or excessive input | Bounded validation failure; no unbounded upstream request |
| Upstream throttling or outage | Explicit retryable/unavailable result; no false success |
| Untrusted text in a backend record | Returned as data without granting new actions or authority |
| Logs inspected after a failure | No tokens, secret values, or sensitive body contents |

Use synthetic fixtures and a mock backend first. Then test in an isolated authorized environment. These cases are a test plan; no application implementation or MCP runtime test is included in this work sample.

For handover, record the service owner, client compatibility actually tested, SDK/protocol versions, backend permissions, deployment version, recovery procedure, limits, and evidence of completed checks.
