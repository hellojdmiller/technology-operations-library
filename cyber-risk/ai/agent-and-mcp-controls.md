# Controls for agents, connectors, MCP servers, and skills

> Proposed controls for a fictional technology operations environment. Review date: September 17, 2026. This document has not configured or tested a product, connector, MCP server, or tenant.

An agent can turn a mistaken interpretation into an action. Review the combination of what it can read, what it can invoke, and where it can write. A good instruction reduces ambiguity; it cannot replace authorization enforced by the application and the connected service.

Follow the [use-case review](ai-use-case-review.md) first. The current [example policy](../../documentation/policies/ai-acceptable-use.md) prohibits Confidential data, including retrieval through connectors. These controls do not create an exception to that prohibition.

## Record the authority at each boundary

For every enabled tool, capture the initiating user or service, the credential owner, permitted resource set, allowed operations, output destination, and audit record. Avoid describing a connector as simply “read-only”: a read can still disclose content to the model, its operator, logs, or another tool.

| Boundary | Proposed control | Evidence and owner |
|---|---|---|
| User request → task | Record the task and allowed effects; identify whether it is a draft or executable workflow | Business sponsor: approved use-case record |
| Source → retrieval | Enforce collection and user access at retrieval, with tenant/user separation | Data/identity owner: allowed and denied read tests |
| Model → tool | Use narrow operations and validated arguments; reject out-of-scope calls in application code | Integration owner: schema/policy tests and tool-call ledger |
| Tool → downstream service | Apply the actual caller’s authorized resource scope, not a broad shared administrator by convenience | Service owner: permission inventory and service-side logs |
| Result → display/export | Validate content and permitted destinations; prevent active output from silently fetching or sending data | Application owner: rendered-output and egress tests |
| Workflow → next run | Control persistent memory, saved instructions, indexes, and cached permissions | Operator: change history, clearing/revocation tests |

OWASP’s 2026 LLM guidance separates prompt injection, excessive agency, supply-chain risk, misinformation, and improper output handling. The important design implication here is to examine both the model input and the downstream effect, even when the generated output has valid syntax. [OWASP LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/).

## Keep untrusted material from becoming authority

Retrieved pages, emails, tickets, PDFs, images, repositories, tool descriptions, and tool results can contain instructions the user did not authorize. Label their provenance and constrain their use, but assume a model might still follow misleading content. A second model’s review or a keyword filter is also a fallible control.

For a public-research assistant, a practical starting design is: bounded retrieval, no access to firm content, no sending tools, and a draft-only destination. For an approved Internal-document assistant, narrow the collection and remove unrelated web/file access and external delivery capabilities. Select the combination based on the task; do not claim that any particular prompt makes a broadly connected agent safe.

Test both the response and the effect. If the assistant says “I ignored the instruction” but a hidden tool call sends data, the boundary failed. If the application blocks the call but the assistant falsely claims it succeeded, the permission control worked while the reporting behavior failed. Both observations belong in the [evaluation record](evaluation-playbook.md).

## Review MCP according to transport and implementation

MCP is an integration protocol, not an assurance that a server is safe. Record the negotiated protocol version and the client/server versions. The current official authorization specification describes HTTP transport; local STDIO credentials follow a different path. Do not assume every MCP connection uses OAuth or that protocol support establishes downstream resource authorization. [MCP authorization, current draft](https://modelcontextprotocol.io/specification/draft/basic/authorization).

For protected HTTP integrations, have the implementer demonstrate intended-audience token validation, appropriate scopes, rejected expired/invalid tokens, and authorization on each request. Tokens belong in supported authentication mechanisms, not URL query strings, prompts, or model-visible traces. Do not accept a downstream service token as a substitute for one issued for the MCP server. These checks follow the referenced authorization specification; validate them against the version actually implemented.

Review proxy consent and redirect handling, credential separation, discovery-URL egress restrictions, and local server launch commands. Official MCP guidance addresses confused-deputy behavior, token passthrough, SSRF, and local server compromise. A proxy must not silently reuse one client’s consent for another, and an OAuth discovery fetch must not become unrestricted access to internal endpoints. [MCP security best practices, current draft](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices).

The cited draft can change. A technical reviewer must resolve version differences before adopting a requirement; this document is not an OAuth implementation guide or a protocol-compliance result. Test authorization failures with a mock or isolated test authority, never by probing unrelated services.

## Treat installation and updates as software changes

Before enabling a skill, connector, package, or local MCP server, record its publisher, source, exact revision, requested permissions, startup command where applicable, executable files, dependency/update path, and data destinations. Inspect tool descriptions and instruction files as well as code. A familiar display name or a marketplace listing is not evidence of the reviewed implementation.

Use a versioned copy and a change review. Pinning helps identify what was assessed; it does not make malicious code benign or detect a remote description change. Grant filesystem, process, and network access only for the use case. Keep credentials outside skill files and review logs. An instruction-only skill still changes behavior, so test it with the tools the host actually exposes.

OWASP describes supplier, model, package, and data dependencies as part of the AI supply chain; the 2026 Agentic Top 10 further calls out tool misuse, identity/privilege abuse, agentic supply-chain vulnerabilities, memory/context poisoning, and insecure inter-agent communication. [OWASP supply-chain explanation, labeled 2025](https://genai.owasp.org/llmrisk/llm032025-supply-chain/), [OWASP Agentic Top 10 release and categories](https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/).

## Make action approval concrete

The example policy requires explicit authority for sending, publishing, spending, deletion, and permission changes. An implementation should bind that authority to an inspectable action: tool, target, exact payload or diff, recipient/destination, quantity, timing, and relevant limit. Revalidate authorization when executing; content fetched later must not change the approved effect.

For a draft-to-CRM example, permit the agent to propose a task in a staging record. A trusted application checks permitted fields and the destination, presents the exact task, and records the authorized reviewer’s decision. The destination write uses a bounded identity and an idempotency/reconciliation mechanism. A chat response saying “approved” inside a retrieved document cannot satisfy that mechanism.

For bulk or repeated work, define what the approved batch contains and which changes require a new decision. Cap item count, retries, runtime, and spend where applicable. Use a durable operation identifier and reconcile after timeouts before retrying a write. Do not interpret a timeout as proof that nothing happened.

## Observe, stop, and recover

Keep a protected record of the workflow revision, initiating identity, resource scope, relevant input/output references, tool calls, decisions, outcomes, and stop events. Redact credentials and minimize payload retention. An opaque “success” line does not prove which records changed or who authorized them.

Define a stop path that disables future execution and prevents further privileged calls. Distinguish cancellation of queued work, interruption of in-flight work, and reversal of completed effects; they are separate capabilities. If revocation cannot be immediate, document the exposure window and the additional application-side deny control. Reconcile state before resuming.

Use synthetic test markers and mock destinations to check exfiltration paths, including URLs, rendered media, logs, caches, and delegated tools. Cross-agent delegation must preserve the same scope and identity boundary; a subagent is not a path around denied access. A new tool, broadened scope, unknown package revision, or unexplained destination is a reason to pause the affected workflow and reassess.

## Minimum review output

Produce an inventory of enabled tools and revisions; a data/authority diagram; the relevant permission evidence; applicable test results from the [evaluation playbook](evaluation-playbook.md); a concrete approval design for actions; and the stop/recovery record. Leave untested claims visible. No combination of these example controls proves complete resistance to prompt injection or all possible failures.
