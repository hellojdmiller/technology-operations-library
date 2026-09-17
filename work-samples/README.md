# Implementation work samples

Adapted examples of project design, infrastructure, and administration code. Organization-specific identities, environments, operational history, and source document metadata have been removed. Each sample explains what is included and what has actually been validated.

| Sample | Demonstrates | Current limit |
|---|---|---|
| [MCP service design template](mcp-template/README.md) | Problem definition, tool contracts, identity boundaries, failure cases, and handover | Design template; no runnable application included |
| [Azure Container Apps Bicep](azure-container-app/README.md) | Environment isolation, managed identity, registry access, secret references, and staged deployment | Compiles locally; no Azure deployment or runtime test |
| [Configuration scripts](config-scripts/README.md) | Parameterized administration and configuration review using fictional examples | Check the sample's validation record before use |

Use the [cloud baselines](../baselines/README.md) to decide the desired controls before adapting a script. Use the [documentation examples](../documentation/README.md) to capture ownership and acceptance. Keep actual deployment parameters, tenant exports, secrets, and evidence outside this repository.
