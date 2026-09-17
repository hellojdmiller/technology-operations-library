// Adapted infrastructure work sample. See README for prerequisites and untested limits.

targetScope = 'resourceGroup'

@description('Project slug, e.g. example-mcp.')
param project string

@description('Registry name: lowercase alphanumeric, globally unique, e.g. exampleacr<uniq>. Defaults to a deterministic name.')
param registryName string = take('${replace(project, '-', '')}acr${uniqueString(resourceGroup().id)}', 50)

@description('Azure region.')
param location string = resourceGroup().location

@description('Registry SKU. Standard gives storage/throughput headroom and webhooks; Basic is fine for low-traffic dev-only projects.')
@allowed([ 'Basic', 'Standard', 'Premium' ])
param sku string = 'Standard'

@description('Apply a CanNotDelete lock. Every prod project should keep this on.')
param enableDeleteLock bool = true

@description('Tags applied to the registry.')
param tags object = {
  project: project
  managedBy: 'bicep'
  owner: 'example-service-owner'
}

resource registry 'Microsoft.ContainerRegistry/registries@2025-04-01' = {
  name: registryName
  location: location
  tags: tags
  sku: { name: sku }
  properties: {
    adminUserEnabled: false
    anonymousPullEnabled: false
  }
}

resource registryLock 'Microsoft.Authorization/locks@2020-05-01' = if (enableDeleteLock) {
  name: 'protect-from-deletion'
  scope: registry
  properties: {
    level: 'CanNotDelete'
    notes: 'Accidental-deletion guard (mcp-template-example).'
  }
}

output registryId string = registry.id
output registryLoginServer string = registry.properties.loginServer
output registryName string = registry.name
