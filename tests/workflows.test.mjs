import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const evaluate = (slug, rows) => {
  const code = file(`n8n/${slug}/evaluate.js`);
  // Execute our own checked-in Code-node source with n8n's input interface.
  return new Function('$input', code)({ all: () => rows.map(json => ({ json })) });
};
const review = rows => evaluate('automation-result-review', rows);
const brief = rows => evaluate('operations-brief', rows)[0].json;
const validRun = { runId: 'test-run', expectedIds: ['a', 'b'], observedIds: ['b', 'a'], evidenceRef: 'fixture://test-run' };
const observation = { service: 'Test service', status: 'healthy', summary: 'Fictional observation.', owner: 'Test owner', evidenceRef: 'fixture://test-service' };

test('equal ID sets match regardless of ordering', () => {
  const result = review([validRun])[0].json;
  assert.equal(result.status, 'matched');
  assert.deepEqual(result.missingIds, []);
  assert.deepEqual(result.unexpectedIds, []);
});

test('equal totals cannot hide missing and unexpected records', () => {
  const result = review([{ ...validRun, observedIds: ['a', 'c'] }])[0].json;
  assert.equal(result.status, 'needs_review');
  assert.deepEqual(result.missingIds, ['b']);
  assert.deepEqual(result.unexpectedIds, ['c']);
});

test('duplicates on either side remain visible', () => {
  const result = review([{ ...validRun, expectedIds: ['a', 'a'], observedIds: ['a', 'a'] }])[0].json;
  assert.equal(result.status, 'needs_review');
  assert.deepEqual(result.duplicateExpectedIds, ['a']);
  assert.deepEqual(result.duplicateObservedIds, ['a']);
});

test('empty scope or missing evidence is not a match', () => {
  for (const input of [{ ...validRun, expectedIds: [], observedIds: [] }, { ...validRun, evidenceRef: '' }]) {
    assert.equal(review([input])[0].json.status, 'needs_review');
  }
  assert.equal(review([])[0].json.status, 'invalid_input');
});

test('malformed run fields fail without inventing a result', () => {
  for (const input of [null, {}, { ...validRun, runId: '' }, { ...validRun, observedIds: 'a' }, { ...validRun, observedIds: [1] }, { ...validRun, expectedIds: [' '] }]) {
    assert.equal(review([input])[0].json.status, 'invalid_input');
  }
});

test('ID case and whitespace are exact; multiple runs retain their linkage', () => {
  const results = review([validRun, { ...validRun, observedIds: ['A', ' b'] }]);
  assert.equal(results[0].json.status, 'matched');
  assert.equal(results[1].json.status, 'needs_review');
  assert.deepEqual(results[1].json.missingIds, ['a', 'b']);
  assert.deepEqual(results[1].pairedItem, { item: 1 });
});

test('operations sample retains action and watch items in a draft', () => {
  const result = brief(JSON.parse(file('n8n/operations-brief/sample-input.json')));
  assert.equal(result.status, 'draft_ready');
  assert.equal(result.total, 3);
  assert.deepEqual(result.counts, { healthy: 1, watch: 1, action: 1, unknown: 0 });
  assert.equal(result.attention.length, 2);
});

test('incomplete or invalid observations become unknown and stay visible', () => {
  for (const input of [{ ...observation, owner: '' }, { ...observation, evidenceRef: '' }, { ...observation, status: 'success' }, null]) {
    const result = brief([input]);
    assert.equal(result.status, 'needs_input');
    assert.equal(result.counts.unknown, 1);
    assert.equal(result.attention.length, 1);
    assert.ok(result.attention[0].issues.length > 0);
  }
});

test('an explicitly unknown observation or empty batch is not healthy', () => {
  assert.equal(brief([{ ...observation, status: 'unknown' }]).status, 'needs_input');
  const empty = brief([]);
  assert.equal(empty.status, 'needs_input');
  assert.equal(empty.total, 0);
  assert.equal(empty.counts.healthy, 0);
});

for (const slug of ['automation-result-review', 'operations-brief']) {
  test(`${slug}: export contains the tested code, connected graph, and runnable sample`, () => {
    const workflow = JSON.parse(file(`n8n/${slug}/workflow.json`));
    assert.equal(workflow.active, false);
    assert.equal(workflow.settings.executionOrder, 'v1');
    assert.equal(workflow.nodes.length, 3);
    assert.equal(workflow.nodes[0].type, 'n8n-nodes-base.manualTrigger');
    const names = new Set(workflow.nodes.map(node => node.name));
    for (const [source, connections] of Object.entries(workflow.connections)) {
      assert.ok(names.has(source));
      for (const outputs of connections.main) for (const target of outputs) assert.ok(names.has(target.node));
    }
    for (const node of workflow.nodes) assert.equal(node.credentials, undefined);
    const [sampleNode, evaluationNode] = workflow.nodes.slice(1);
    assert.equal(evaluationNode.parameters.jsCode, file(`n8n/${slug}/evaluate.js`));
    for (const node of [sampleNode, evaluationNode]) {
      assert.equal(node.type, 'n8n-nodes-base.code');
      assert.equal(node.typeVersion, 2);
      assert.equal(node.parameters.mode, 'runOnceForAllItems');
    }
    const sampleItems = new Function(sampleNode.parameters.jsCode)();
    const output = new Function('$input', evaluationNode.parameters.jsCode)({ all: () => sampleItems });
    assert.ok(output.length > 0);
    assert.ok(output.every(item => item.json && typeof item.json.status === 'string'));
  });
}
