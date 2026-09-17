# Implementation work samples

Adapted work samples and new runnable demonstrations of project design, infrastructure, administration, and evidence review. The adapted examples omit organization-specific identities, environments, operational history, and source document metadata. New demonstrations use synthetic records. Each sample explains what is included and what has actually been validated.

| Sample | Demonstrates | Current limit |
|---|---|---|
| [MCP service design template](mcp-template/README.md) | Problem definition, tool contracts, identity boundaries, failure cases, and handover | Design template; no runnable application included |
| [Runnable MCP service catalog](mcp-service-catalog/README.md) | Two read-only tools over a fixed synthetic catalog, strict input schemas, pagination, and SDK-client tests | Local stdio demonstration; no remote transport, authentication, tenant access, or client-app installation |
| [Azure Container Apps Bicep](azure-container-app/README.md) | Environment isolation, managed identity, registry access, secret references, and staged deployment | Compiles locally; no Azure deployment or runtime test |
| [Configuration scripts](config-scripts/README.md) | Parameterized administration and configuration review using fictional examples | Check the sample's validation record before use |
| [Control-evidence review](control-evidence-review/README.md) | An offline review queue for evidence freshness, scope, unresolved tests, and exceptions | Evaluates supplied records; does not collect or authenticate real evidence |

Use the [cloud baselines](../baselines/README.md) to decide the desired controls before adapting a script. Use the [documentation examples](../documentation/README.md) to capture ownership and acceptance. Keep actual deployment parameters, tenant exports, secrets, and evidence outside this repository.
