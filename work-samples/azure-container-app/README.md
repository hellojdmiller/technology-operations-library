# Azure Container Apps deployment pattern

An adapted Bicep work sample showing a project-specific registry, separate development and production environments, managed identity, Key Vault references, monitoring, and an optional shared-state store for an MCP application.

This is infrastructure scaffolding. It does not include an MCP application, implement authentication, register an identity application, or prove deployment readiness. No resources were deployed while preparing this sample.

## Files and architecture

| File | Purpose |
|---|---|
| [shared-acr.bicep](infra/shared-acr.bicep) | Dedicated registry shared by this project's environments |
| [main.bicep](infra/main.bicep) | One environment: identity, vault, monitoring, Container Apps environment, and optional application/state storage |
| [ACR role module](infra/modules/acr-pull-role.bicep) | Registry-scoped image-pull permission for the workload identity |
| [Parameter example](infra/parameters.example.json) | Deliberately incomplete identifiers and image reference to replace outside Git |
| [MCP design template](../mcp-template/README.md) | Application contract and design decisions this infrastructure expects |

The sample defaults to internal app ingress, no allowed browser origins, and INFO logging. The generated application base URL includes the internal hostname segment in that mode. Internal ingress limits the app's reachability; it does not make the registry, vault, storage, or managed environment a complete private-network design. Review those services' networking separately. See Microsoft's [app-to-app addressing](https://learn.microsoft.com/en-us/azure/container-apps/connect-apps).

## Authentication modes are application contracts

| Parameter | Infrastructure supplied | Application work still required |
|---|---|---|
| `entra-jwt` | Identity configuration and vault secret reference | Validate incoming access tokens for this resource, issuer, audience, lifetime, and required permission; enforce tool authorization |
| `oauth-proxy` | Identity configuration, shared state tables, and a custom vault secret-writing role | Implement and test the complete authorization flow, state protections, downstream delegation, and registration/session lifecycle |
| `shared-bearer` | Vault access and expected secret-name configuration | Implement secure comparison, access bounds, rotation, and client support; this is not an OAuth implementation |

The inherited `entra-jwt` application contract includes a client-secret reference. A pure resource server may not need a confidential-client secret: remove that reference and the associated environment variable if your reviewed implementation does not use one. Do not create a credential simply to satisfy unused scaffolding.

The OAuth mode grants secret get/list/set/delete at the example vault and table-data access for shared state. Reassess that scope for the actual implementation; do not use it for an application that only needs secret reads. No purge permission is granted by the custom role.

The application-specific authentication reset feature defaults to disabled in every environment. Set `enableAuthReset=true` only after reviewing the implementation's authorization and exposure; the template cannot establish those safeguards.

## Local compilation

From this directory, with Azure CLI and Bicep already installed:

```sh
az bicep build --file infra/main.bicep --outfile /tmp/vcpeit-main.json
az bicep build --file infra/shared-acr.bicep --outfile /tmp/vcpeit-registry.json
```

Compilation checks syntax and resource schemas. It does not validate resource availability, permissions, policies, quotas, network reachability, app authentication, or runtime behavior.

## Deployment sequence to adapt

1. Select a nonproduction subscription, project-specific resource groups, region, owner, budget, and cleanup plan. Check supported region/network features and required deployment/RBAC permissions.
2. Review the registry template and its cost. Run an Azure **what-if** for `shared-acr.bicep`, review the result, and deploy the registry after authorization. Confirm its resource ID and login server.
3. Build and scan the application image, push it to the deployed registry, and record an immutable digest.
4. Store a completed environment parameter file outside the repository. Confirm the selected subscription and resource group explicitly. Do not use the unchanged example file.
5. Run an Azure **what-if** for the stage-one environment. Review changes and resolve errors. Stage one uses `skipContainerApp=true` so vault and identity resources can exist before referenced secrets are provisioned.
6. After an authorized stage-one deployment, seed only the secrets required by the reviewed application through the approved secret-management process. Account for role-assignment propagation.
7. Preview and, after review, deploy stage two with `skipContainerApp=false`. Test the app from within its Container Apps environment, where internal ingress is reachable.
8. Test unauthenticated, expired-token, wrong-audience, and insufficient-permission rejection as well as a permitted request. Verify logs omit tokens and sensitive payloads. A successful health probe does not prove authorization.
9. Review external ingress, exact CORS origins, domain/certificate configuration, monitoring, and production access before any external exposure. Record recovery and image rollback procedures.

Example preview command after replacing all placeholders and reviewing the active account:

```sh
az deployment group what-if \
  --subscription '<reviewed-subscription-id>' \
  --resource-group '<existing-development-resource-group>' \
  --template-file infra/main.bicep \
  --parameters @/absolute/protected/path/development.parameters.json \
  --parameters skipContainerApp=true
```

What-if contacts Azure and requires deployment-related permissions, even though it previews changes. It has not been run for this sample.

## Limits and maintenance

Validate resource naming, image registry consistency, subnet requirements, role permissions, allowed CPU/memory combinations, replica limits, and environment-specific configuration. Extra environment variables must not contain plaintext secrets. The sample's delete locks and purge protection affect cleanup; account for them before allocating resources. Log retention is illustrative, and blob soft delete does not establish recovery for state tables.

The registry schema was updated to `2025-04-01` to support the explicit anonymous-pull setting. Both templates compile with Bicep 0.42.1 after that change. No Azure validation, what-if, image build, deployment, or authenticated MCP smoke test has been completed.

References: [registry schema](https://learn.microsoft.com/en-us/azure/templates/microsoft.containerregistry/2025-04-01/registries), [managed-identity image pulls](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity-image-pull), [Key Vault secret references](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets), and [deployment preview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-what-if).
