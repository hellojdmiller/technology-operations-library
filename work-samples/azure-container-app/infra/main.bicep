// Adapted infrastructure work sample. See README for prerequisites and untested limits.

targetScope = 'resourceGroup'

@description('Project slug used in tags and defaults, e.g. example-mcp.')
param project string

@description('Short name prefix used in all resource names. Lowercase, 3-10 chars.')
@minLength(3)
@maxLength(10)
param namePrefix string

@description('Azure region.')
param location string = resourceGroup().location

@description('Environment: dev or prod.')
@allowed([ 'dev', 'prod' ])
param env string = 'dev'

@description('Full container image reference from THIS project\'s dedicated ACR, e.g. exampleacr123.azurecr.io/example-mcp:abc1234')
param containerImage string

@description('Resource ID of this project\'s dedicated ACR (in rg-example-<project>-shared-<region>).')
param acrResourceId string

@description('Env-var prefix the server reads, e.g. EXAMPLE_MCP. No trailing underscore.')
param envVarPrefix string

@description('Auth archetype: oauth-proxy (per-user OAuth 2.1, needs Entra params + state tables), entra-jwt (validate Entra bearers, needs Entra params), shared-bearer (static token from Key Vault, no Entra params).')
@allowed([ 'oauth-proxy', 'entra-jwt', 'shared-bearer' ])
param authMode string

@description('Enable externally reachable ingress only after application authentication and authorization are implemented and tested.')
param externalIngress bool = false

@description('Application-specific OAuth reset feature. Enable only after reviewing the implementation, authorization, and exposure.')
param enableAuthReset bool = false

@description('Entra tenant ID. Required for oauth-proxy and entra-jwt.')
param entraTenantId string = ''

@description('Entra application (client) ID. Required for oauth-proxy and entra-jwt.')
param entraClientId string = ''

@description('App ID URI, e.g. api://example-mcp. Required for oauth-proxy and entra-jwt.')
param entraAppIdUri string = ''

@description('Required scope for incoming tokens.')
param requiredScope string = 'access_as_user'

@description('Minimum replicas. Default: scale-to-zero on dev, always-on in prod.')
param minReplicas int = env == 'prod' ? 1 : 0

@description('Maximum replicas.')
param maxReplicas int = 3

@description('Concurrent HTTP requests per replica before scaling out.')
param concurrentRequests string = '50'

@description('CPU cores per replica (string, applied via json()).')
param cpu string = '0.5'

@description('Memory per replica.')
param memory string = '1Gi'

@description('Stage-1 switch: skip the Container App so secrets can be seeded into the fresh Key Vault first.')
param skipContainerApp bool = false

@description('Custom domain hostname (e.g. mcp.example.com). Used as PUBLIC_BASE_URL and bound to ingress when the certificate ID is also set.')
param customDomain string = ''

@description('Resource ID of the managed certificate for customDomain.')
param customDomainCertificateId string = ''

@description('CORS allowed origins. Explicit by default — widen deliberately, not by default.')
param corsAllowedOrigins array = []

@description('Illustrative log retention; determine the required setting for your environment.')
param logRetentionDays int = 90

@description('Apply CanNotDelete locks to the vault and storage account. Defaults on in prod.')
param enableDeleteLocks bool = env == 'prod'

@description('Infrastructure subnet resource ID for a VNet-injected, zone-redundant environment. Empty = public consumption environment (no zone redundancy).')
param infrastructureSubnetId string = ''

@description('Extra app-specific env vars, e.g. [ { name: \'EXAMPLE_MCP_THING\', value: \'x\' } ].')
param extraEnv array = []

@description('Tags applied to every resource.')
param tags object = {
  project: project
  environment: env
  managedBy: 'bicep'
  owner: 'example-service-owner'
}

var suffix = uniqueString(resourceGroup().id, env)
var names = {
  logAnalytics: '${namePrefix}-log-${env}-${suffix}'
  appInsights: '${namePrefix}-ai-${env}-${suffix}'
  keyVault: take('${namePrefix}kv${env}${suffix}', 24)
  storage: take('${namePrefix}st${env}${suffix}', 24)
  identity: '${namePrefix}-id-${env}-${suffix}'
  environment: '${namePrefix}-env-${env}-${suffix}'
  containerApp: '${namePrefix}-app-${env}'
}

var needsEntra = authMode != 'shared-bearer'
var needsStateTables = authMode == 'oauth-proxy'

resource logWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: names.logAnalytics
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: logRetentionDays
    features: { enableLogAccessUsingOnlyResourcePermissions: true }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: names.appInsights
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logWorkspace.id
  }
}

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: names.identity
  location: location
  tags: tags
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: names.keyVault
  location: location
  tags: tags
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
  }
}

var kvSecretsUserRoleId = '4633458b-17de-408a-b874-0445c86b69e6'
var needsSecretWrite = authMode == 'oauth-proxy'

resource kvSecretWriterRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' = if (needsSecretWrite) {
  name: guid(resourceGroup().id, 'kv-secret-writer', namePrefix, env)
  properties: {
    roleName: 'KV Secret Writer (${namePrefix}-${env})'
    description: 'Get/list/set/delete Key Vault secrets — delete is recoverable (soft-delete + purge protection); purge still denied. For the OAuth-proxy DCR endpoint and the client-prune sweep (example application contract).'
    type: 'CustomRole'
    assignableScopes: [ resourceGroup().id ]
    permissions: [
      {
        actions: []
        notActions: []
        dataActions: [
          'Microsoft.KeyVault/vaults/secrets/getSecret/action'
          'Microsoft.KeyVault/vaults/secrets/readMetadata/action'
          'Microsoft.KeyVault/vaults/secrets/setSecret/action'
          'Microsoft.KeyVault/vaults/secrets/delete'
        ]
        notDataActions: []
      }
    ]
  }
}

var kvRoleId = needsSecretWrite ? kvSecretWriterRole.id : subscriptionResourceId('Microsoft.Authorization/roleDefinitions', kvSecretsUserRoleId)
resource kvRbac 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, identity.id, kvRoleId)
  scope: keyVault
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: kvRoleId
  }
}

resource kvLock 'Microsoft.Authorization/locks@2020-05-01' = if (enableDeleteLocks) {
  name: 'protect-from-deletion'
  scope: keyVault
  properties: {
    level: 'CanNotDelete'
    notes: 'Accidental-deletion guard (mcp-template-example).'
  }
}

var acrIdParts = split(acrResourceId, '/')
module acrPullRoleAssignment 'modules/acr-pull-role.bicep' = {
  scope: resourceGroup(acrIdParts[2], acrIdParts[4])
  name: 'acr-pull-${namePrefix}-${env}'
  params: {
    registryName: acrIdParts[8]
    principalId: identity.properties.principalId
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = if (needsStateTables) {
  name: names.storage
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    accessTier: 'Hot'
  }
}

resource storageBlobPolicy 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = if (needsStateTables) {
  parent: storage
  name: 'default'
  properties: {
    deleteRetentionPolicy: { enabled: true, days: 7 }
  }
}

resource storageTables 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = if (needsStateTables) {
  parent: storage
  name: 'default'
}

resource tablePending 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = if (needsStateTables) {
  parent: storageTables
  name: 'oauthpending'
}

resource tableCodes 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = if (needsStateTables) {
  parent: storageTables
  name: 'oauthcodes'
}

resource tableSessions 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = if (needsStateTables) {
  parent: storageTables
  name: 'oauthsessions'
}

var storageTableContributorRoleId = '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'
resource storageRbac 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (needsStateTables) {
  name: guid(names.storage, identity.id, storageTableContributorRoleId)
  scope: storage
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageTableContributorRoleId)
  }
}

resource storageLock 'Microsoft.Authorization/locks@2020-05-01' = if (needsStateTables && enableDeleteLocks) {
  name: 'protect-from-deletion'
  scope: storage
  properties: {
    level: 'CanNotDelete'
    notes: 'Accidental-deletion guard (mcp-template-example).'
  }
}

resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: names.environment
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logWorkspace.properties.customerId
        sharedKey: logWorkspace.listKeys().primarySharedKey
      }
    }
    vnetConfiguration: !empty(infrastructureSubnetId) ? {
      infrastructureSubnetId: infrastructureSubnetId
    } : null
    zoneRedundant: !empty(infrastructureSubnetId)
  }
}

var baseEnv = [
  { name: '${envVarPrefix}_TRANSPORT', value: 'http' }
  { name: '${envVarPrefix}_HOST', value: '0.0.0.0' }
  { name: '${envVarPrefix}_PORT', value: '8000' }
  { name: '${envVarPrefix}_LOG_LEVEL', value: 'INFO' }
  { name: '${envVarPrefix}_PUBLIC_BASE_URL', value: !empty(customDomain) ? 'https://${customDomain}' : 'https://${names.containerApp}${externalIngress ? '' : '.internal'}.${environment.properties.defaultDomain}' }
  { name: '${envVarPrefix}_KEY_VAULT_URL', value: keyVault.properties.vaultUri }
  { name: '${envVarPrefix}_MANAGED_IDENTITY_CLIENT_ID', value: identity.properties.clientId }
  { name: '${envVarPrefix}_APP_INSIGHTS_CONNECTION_STRING', secretRef: 'appinsights-connection-string' }
]

var entraEnv = needsEntra ? [
  { name: '${envVarPrefix}_TENANT_ID', value: entraTenantId }
  { name: '${envVarPrefix}_CLIENT_ID', value: entraClientId }
  { name: '${envVarPrefix}_APP_ID_URI', value: entraAppIdUri }
  { name: '${envVarPrefix}_REQUIRED_SCOPE', value: requiredScope }
  { name: '${envVarPrefix}_CLIENT_SECRET', secretRef: 'entra-client-secret' }
] : []

var oauthProxyEnv = needsStateTables ? [
  { name: '${envVarPrefix}_TABLE_STORAGE_URL', value: storage!.properties.primaryEndpoints.table }
  { name: '${envVarPrefix}_CLIENT_PRUNE_ENABLED', value: 'true' }
  { name: '${envVarPrefix}_CLIENT_PRUNE_MAX_AGE_DAYS', value: env == 'prod' ? '30' : '90' }
  { name: '${envVarPrefix}_SESSION_TTL_SECONDS', value: env == 'prod' ? '604800' : '1209600' }
  { name: '${envVarPrefix}_ENABLE_AUTH_RESET', value: string(enableAuthReset) }
] : []

var sharedBearerEnv = authMode == 'shared-bearer' ? [
  { name: '${envVarPrefix}_SHARED_BEARER_SECRET_NAME', value: 'mcp-shared-bearer' }
] : []

var entraSecrets = needsEntra ? [
  {
    name: 'entra-client-secret'
    keyVaultUrl: '${keyVault.properties.vaultUri}secrets/entra-client-secret'
    identity: identity.id
  }
] : []

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = if (!skipContainerApp) {
  name: names.containerApp
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: externalIngress
        targetPort: 8000
        transport: 'auto'
        allowInsecure: false
        customDomains: (!empty(customDomain) && !empty(customDomainCertificateId)) ? [
          {
            name: customDomain
            certificateId: customDomainCertificateId
            bindingType: 'SniEnabled'
          }
        ] : []
        corsPolicy: {
          allowedOrigins: corsAllowedOrigins
          allowCredentials: false
        }
      }
      registries: [
        {
          server: split(containerImage, '/')[0]
          identity: identity.id
        }
      ]
      secrets: concat(entraSecrets, [
        {
          name: 'appinsights-connection-string'
          value: appInsights.properties.ConnectionString
        }
      ])
    }
    template: {
      containers: [
        {
          name: project
          image: containerImage
          resources: {
            cpu: json(cpu)
            memory: memory
          }
          env: concat(baseEnv, entraEnv, oauthProxyEnv, sharedBearerEnv, extraEnv)
          probes: [
            {
              type: 'Liveness'
              httpGet: { path: '/health', port: 8000 }
              initialDelaySeconds: 10
              periodSeconds: 30
            }
            {
              type: 'Readiness'
              httpGet: { path: '/health', port: 8000 }
              initialDelaySeconds: 5
              periodSeconds: 10
            }
          ]
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scale'
            http: { metadata: { concurrentRequests: concurrentRequests } }
          }
        ]
      }
    }
  }
  dependsOn: [ kvRbac, storageRbac, acrPullRoleAssignment, tablePending, tableCodes, tableSessions ]
}

output containerAppFqdn string = skipContainerApp ? '' : containerApp!.properties.configuration.ingress.fqdn
output mcpEndpoint string = skipContainerApp ? '' : 'https://${containerApp!.properties.configuration.ingress.fqdn}/mcp'
output keyVaultName string = keyVault.name
output storageAccountName string = needsStateTables ? names.storage : ''
output managedIdentityId string = identity.id
output managedIdentityPrincipalId string = identity.properties.principalId
output appInsightsName string = appInsights.name
