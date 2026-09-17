import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const fixtureUrl = new URL('../fixtures/services.json', import.meta.url);
const digest = () => createHash('sha256').update(readFileSync(fixtureUrl)).digest('hex');
const originalDigest = digest();
const client = new Client({ name: 'vcpeit-catalog-test-client', version: '0.1.0' });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('../src/server.mjs', import.meta.url))],
  cwd: tmpdir(), // Fixture loading must not depend on a host's working directory.
  stderr: 'pipe'
});

before(async () => { await client.connect(transport); });
after(async () => {
  await client.close();
  assert.equal(digest(), originalDigest, 'MCP calls must not change the catalog fixture');
});

const call = (name, args = {}) => client.callTool({ name, arguments: args });
const list = args => call('vcpeit_list_services', args);
const get = args => call('vcpeit_get_service', args);
const data = result => {
  assert.notEqual(result.isError, true, JSON.stringify(result.content));
  assert.equal(result.structuredContent.demo, true);
  assert.equal(result.structuredContent.catalogVersion, 'synthetic-v1');
  return result.structuredContent;
};

test('real stdio tool discovery advertises only the two read-only catalog tools', async () => {
  const result = await client.listTools();
  assert.deepEqual(result.tools.map(tool => tool.name).sort(), ['vcpeit_get_service', 'vcpeit_list_services']);
  for (const tool of result.tools) {
    assert.equal(tool.inputSchema.additionalProperties, false);
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.annotations.destructiveHint, false);
    assert.equal(tool.annotations.idempotentHint, true);
    assert.equal(tool.annotations.openWorldHint, false);
    assert.ok(tool.outputSchema);
  }
});

test('default list is bounded and deterministic with a usable next-page offset', async () => {
  const first = data(await list({}));
  assert.equal(first.total, 6);
  assert.equal(first.count, 3);
  assert.deepEqual(first.services.map(service => service.serviceId), ['svc-automation', 'svc-collaboration', 'svc-fund-operations']);
  assert.equal(first.nextOffset, 3);
  assert.equal(first.hasMore, true);
  const second = data(await list({ offset: first.nextOffset }));
  assert.deepEqual(second.services.map(service => service.serviceId), ['svc-identity', 'svc-recovery', 'svc-research']);
  assert.equal(second.hasMore, false);
  assert.equal(second.nextOffset, null);
  assert.equal(new Set([...first.services, ...second.services].map(service => service.serviceId)).size, 6);
});

test('filters apply before pagination and cannot broaden each other', async () => {
  const filtered = data(await list({ criticality: 'tier-1', limit: 2, offset: 2 }));
  assert.equal(filtered.total, 4);
  assert.equal(filtered.count, 2);
  assert.deepEqual(filtered.services.map(service => service.serviceId), ['svc-identity', 'svc-recovery']);
  const exact = data(await list({ category: 'research', criticality: 'tier-2' }));
  assert.equal(exact.total, 1);
  assert.equal(exact.services[0].serviceId, 'svc-research');
  const empty = data(await list({ category: 'research', criticality: 'tier-1' }));
  assert.equal(empty.total, 0);
  assert.equal(empty.count, 0);
  assert.equal(empty.nextOffset, null);
});

test('offset beyond the last result returns an explicit empty terminal page', async () => {
  const result = data(await list({ offset: 100 }));
  assert.equal(result.total, 6);
  assert.equal(result.count, 0);
  assert.equal(result.hasMore, false);
  assert.equal(result.nextOffset, null);
});

test('get exposes the expected fictional dependencies and targets with no live-status claim', async () => {
  const result = await get({ service_id: 'svc-fund-operations' });
  const entry = data(result).service;
  assert.deepEqual(entry.dependencyIds, ['svc-identity', 'svc-collaboration']);
  assert.equal(entry.ownerRole, 'Finance systems owner');
  assert.deepEqual(entry.recoveryTargets, { rtoHours: 6, rpoHours: 2 });
  assert.equal(entry.reviewStatus, 'gap');
  assert.equal(entry.openQuestions.length, 2);
  assert.match(result.content[0].text, /fictional|Fictional/);
  assert.match(result.content[0].text, /not measured results/);
});

test('JSON and Markdown text formats retain the same structured meaning', async () => {
  for (const [name, args] of [['vcpeit_list_services', { category: 'identity' }], ['vcpeit_get_service', { service_id: 'svc-identity' }]]) {
    const markdown = await call(name, { ...args, response_format: 'markdown' });
    const json = await call(name, { ...args, response_format: 'json' });
    assert.deepEqual(data(markdown), data(json));
    assert.deepEqual(JSON.parse(json.content[0].text), json.structuredContent);
  }
});

test('unknown well-formed service ID gives an actionable tool error, not another record', async () => {
  const result = await get({ service_id: 'svc-unknown' });
  assert.equal(result.isError, true);
  assert.equal(result.structuredContent, undefined);
  assert.match(result.content[0].text, /SERVICE_NOT_FOUND/);
  assert.match(result.content[0].text, /vcpeit_list_services/);
});

test('get rejects paths, URLs, wrong case, whitespace, long IDs, wrong types, and missing input', async () => {
  const invalid = [
    {}, { service_id: '../../secrets' }, { service_id: '/etc/passwd' }, { service_id: 'https://example.invalid' },
    { service_id: 'SVC-identity' }, { service_id: ' svc-identity' }, { service_id: 'svc-' + 'a'.repeat(50) },
    { service_id: 42 }, { service_id: ['svc-identity'] }
  ];
  for (const args of invalid) assert.equal((await get(args)).isError, true, JSON.stringify(args));
});

test('both tools reject extra fields, including path, URL, and action requests', async () => {
  for (const args of [{ path: '/etc/passwd' }, { url: 'https://example.invalid' }, { action: 'delete' }]) {
    assert.equal((await list(args)).isError, true);
    assert.equal((await get({ service_id: 'svc-identity', ...args })).isError, true);
  }
});

test('list rejects unbounded, fractional, coerced, and unknown filter values', async () => {
  for (const args of [
    { limit: 0 }, { limit: 6 }, { limit: 1.5 }, { limit: '3' }, { offset: -1 }, { offset: 101 },
    { offset: 0.5 }, { category: 'all' }, { criticality: 'critical' }, { response_format: 'xml' }
  ]) assert.equal((await list(args)).isError, true, JSON.stringify(args));
});

test('unknown tools cannot provide write or arbitrary-file capabilities', async () => {
  await assert.rejects(call('vcpeit_delete_service', { service_id: 'svc-identity' }));
  await assert.rejects(call('read_file', { path: '/etc/passwd' }));
  const stillPresent = data(await get({ service_id: 'svc-identity' }));
  assert.equal(stillPresent.service.serviceId, 'svc-identity');
});

test('repeated lookups are identical and all advertised dependency IDs resolve through the client', async () => {
  const first = data(await get({ service_id: 'svc-research' }));
  const second = data(await get({ service_id: 'svc-research' }));
  assert.deepEqual(first, second);
  const pageOne = data(await list({ limit: 5 }));
  const pageTwo = data(await list({ limit: 5, offset: pageOne.nextOffset }));
  for (const service of [...pageOne.services, ...pageTwo.services]) {
    const detail = data(await get({ service_id: service.serviceId })).service;
    for (const dependencyId of detail.dependencyIds) assert.equal(data(await get({ service_id: dependencyId })).service.serviceId, dependencyId);
  }
});
