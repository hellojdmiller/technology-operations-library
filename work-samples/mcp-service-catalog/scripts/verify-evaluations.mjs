import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

// This checks answer keys using actual MCP results; it does not call or evaluate a model.
const xml = readFileSync(new URL('../evaluations/queries.xml', import.meta.url), 'utf8');
const answers = new Map([...xml.matchAll(/<qa_pair id="(Q\d+)">[\s\S]*?<answer>([^<]+)<\/answer>[\s\S]*?<\/qa_pair>/g)].map(match => [match[1], match[2]]));
assert.equal(answers.size, 10, 'Expected ten fixed evaluation answer keys.');
const client = new Client({ name: 'vcpeit-catalog-evaluation-client', version: '0.1.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../src/server.mjs', import.meta.url))], stderr: 'pipe' });

async function tool(name, arguments_) {
  const result = await client.callTool({ name, arguments: arguments_ });
  assert.notEqual(result.isError, true, JSON.stringify(result.content));
  assert.equal(result.structuredContent.catalogVersion, 'synthetic-v1');
  return result.structuredContent;
}

try {
  await client.connect(transport);
  const services = [];
  let offset = 0;
  do {
    const page = await tool('vcpeit_list_services', { offset, limit: 2 });
    for (const summary of page.services) services.push((await tool('vcpeit_get_service', { service_id: summary.serviceId })).service);
    offset = page.nextOffset;
  } while (offset !== null);
  const byId = new Map(services.map(service => [service.serviceId, service]));
  const allDependencies = id => {
    const found = new Set();
    const visit = current => {
      for (const dependency of byId.get(current).dependencyIds) {
        if (!found.has(dependency)) { found.add(dependency); visit(dependency); }
      }
    };
    visit(id);
    return found;
  };
  const sortBy = (records, value) => records.toSorted((a, b) => value(a) - value(b));
  const identity = services.find(service => service.category === 'identity');
  const shortestRto = Math.min(...services.map(service => service.recoveryTargets.rtoHours));
  const computed = new Map([
    ['Q01', sortBy(services.filter(service => !service.dependencyIds.length), service => service.recoveryTargets.rpoHours)[0].name],
    ['Q02', services.find(service => service.criticality === 'tier-1' && service.reviewStatus === 'not-reviewed').ownerRole],
    ['Q03', String([...allDependencies(services.find(service => service.criticality === 'tier-3').serviceId)].filter(id => byId.get(id).criticality === 'tier-1').length)],
    ['Q04', services.find(service => service.dependencyIds.length === 2 && service.recoveryTargets.rtoHours === 6).ownerRole],
    ['Q05', sortBy(services, service => -services.filter(other => other.dependencyIds.includes(service.serviceId)).length)[0].name],
    ['Q06', String(Math.max(...services.filter(service => service.reviewStatus === 'documented').map(service => service.recoveryTargets.rpoHours)))],
    ['Q07', sortBy(services.filter(service => service.criticality === 'tier-1'), service => -service.openQuestions.length)[0].name],
    ['Q08', services.find(service => service.serviceId !== identity.serviceId && service.criticality === 'tier-1' && !allDependencies(service.serviceId).has(identity.serviceId)).name],
    ['Q09', sortBy(services.filter(service => service.recoveryTargets.rtoHours === shortestRto), service => -service.recoveryTargets.rpoHours)[0].name],
    ['Q10', services.find(service => service.reviewStatus === 'documented' && service.criticality === 'tier-2' && service.dependencyIds.some(id => byId.get(id).category === 'collaboration')).name]
  ]);
  for (const [id, answer] of answers) assert.equal(computed.get(id), answer, `${id} answer differs from the actual SDK tool results.`);
  console.log('10/10 answer keys verified against actual SDK-client calls. No model evaluation was run.');
} finally {
  await client.close();
}
