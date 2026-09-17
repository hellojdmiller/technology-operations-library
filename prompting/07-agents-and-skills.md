# Give agents authority and reusable instructions deliberately

An agent can combine reasoning with tools, but the available host determines what it can actually read or change. Describe the outcome and authority together so the assistant can make useful progress inside the intended boundary.

## Use three explicit scopes

**Information scope:** which files, accounts, services, records, and data classes may be read. **Action scope:** which changes may be made and which require a separate decision. **Completion scope:** the evidence required before the result can be called complete.

```text
Prepare an access-review packet from the supplied synthetic records.
You may read these files and create local draft outputs in the designated folder.
Do not connect to a tenant or change any account. Reconcile exact record IDs,
show missing owners and incomplete source coverage, and propose review actions.
Finish when the packet, discrepancy list, and source-coverage statement exist
and have been checked against the input. Record any unresolved scope question.
```

The host should enforce permissions that match the task. A sentence telling an agent to be read-only is insufficient if its tools still permit unrestricted writes. For live actions, bind authorization to the actual scope, destination, and operation, and verify the result independently.

## Choose where recurring instructions belong

| Mechanism | Good use | Limitation |
|---|---|---|
| Task prompt | This request's outcome and constraints | Not automatically persistent elsewhere |
| Project or repository instructions | Shared conventions and operating context | Host discovery and precedence differ; stale rules can conflict |
| Skill | A repeatable procedure with inputs, boundaries, and checks | Must be loaded through a supported route; instruction text does not install tools |
| Tool or MCP server | A typed capability to retrieve or act | Requires separate review of implementation, permissions, and data flow |

Keep the portable procedure independent of one provider's tool names. Put installation paths and client differences in a separate guide. See [the platform guide](../skills/platform-guide.md). Do not assume a local stdio MCP server can be attached directly to every cloud chat product.

## Delegate only where independence helps

For parallel work, give each agent a bounded deliverable, allowed files, sources, acceptance checks, and a handoff format. Keep shared decisions with one integrator. For example, one agent can draft control tests while another reviews AI threats; neither should silently rewrite the same catalog file.

A second agent is not automatically independent evidence. If both use the same bad source or assumption, agreement does not fix the error. Assign a reviewer to challenge specific failure modes or verify source support, and inspect the actual result.

## Treat incoming text as data

Retrieved web pages, documents, tool descriptions, and repository files can contain instructions. They should not grant new authority to export data, install software, reveal secrets, or change the task. Review skills and dependencies before loading them, and reassess after changes. Technical permission and destination controls belong outside model-generated prose.

For long tasks, preserve a compact handoff: original objective, accepted decisions, completed actions with evidence, unresolved items, and next steps. Avoid repeatedly asking the agent to start over; ask it to check the current state and continue from it.

Use [agent and MCP controls](../cyber-risk/ai/agent-and-mcp-controls.md) for the security review and [the MCP sample](../work-samples/mcp-service-catalog/README.md) for a local demonstration. Neither a successful tool call nor a model's statement of completion proves the business outcome.
