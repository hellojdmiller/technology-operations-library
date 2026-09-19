import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buildCases, failureMessage } from '../cases.mjs';
import { parseExecution, validateExecution } from '../validate.mjs';

const bundle = buildCases(fileURLToPath(new URL('../../../', import.meta.url)));
const normal = bundle.cases.find(item => item.kind === 'fixture');
const reference = [{ status: 'needs_review', issues: ['Example gap'] }];
function completed() {
  return { mode: 'cli', status: 'success', finished: true, data: { resultData: {
    lastNodeExecuted: normal.finalNode,
    runData: {
      'Run example': [{ executionStatus: 'success' }],
      'Fictional sample data': [{ executionStatus: 'success' }],
      [normal.finalNode]: [{ executionStatus: 'success', data: { main: [reference.map(json => ({ json }))] } }],
    },
  } } };
}
test('each of ten exports has normal, malformed, and incomplete coverage; all staged copies stay inactive', () => {
  assert.equal(bundle.sources.length, 10);
  assert.equal(bundle.cases.length, 32);
  assert.equal(new Set(bundle.cases.map(item => item.id)).size, 32);
  for (const { slug } of bundle.sources) {
    for (const kind of ['fixture', 'malformed', 'incomplete']) assert.equal(bundle.cases.filter(item => item.slug === slug && item.kind === kind).length, 1);
  }
  assert.ok(bundle.cases.every(item => item.workflow.active === false));
});
test('execution parser handles log text and braces inside quoted data', () => {
  const result = completed();
  result.data.resultData.note = 'quoted { brace } and "quote"';
  assert.deepEqual(parseExecution('Startup\n' + JSON.stringify(result, null, 2) + '\nShutdown'), result);
});
test('exit text, absent/truncated JSON, and ambiguous duplicate executions cannot pass', () => {
  for (const output of ['Execution was successful', '{}', '{"data":', JSON.stringify(completed()) + '\n' + JSON.stringify(completed())]) assert.throws(() => parseExecution(output));
});
test('successful execution with exact payload passes even when business status needs review', () => {
  assert.deepEqual(validateExecution(normal, completed(), reference), { observed: 'needs_review', output_items: 1 });
});
test('missing evaluator, missing trigger, empty output, and different payload cannot masquerade as success', () => {
  for (const modify of [
    value => { delete value.data.resultData.runData[normal.finalNode]; },
    value => { delete value.data.resultData.runData['Run example']; },
    value => { value.data.resultData.runData[normal.finalNode][0].data.main = [[]]; },
    value => { value.data.resultData.runData[normal.finalNode][0].data.main = [[{ json: { status: 'matched' } }]]; },
    value => { value.finished = false; },
    value => { value.status = 'error'; },
    value => { value.data.resultData.error = { message: 'unexpected' }; },
  ]) {
    const value = completed(); modify(value);
    assert.throws(() => validateExecution(normal, value, reference));
  }
});
test('zero-item execution records the evaluator as unexecuted, without producing a review status', () => {
  const item = bundle.cases.find(item => item.kind === 'zero-items');
  const value = completed();
  delete value.data.resultData.runData[normal.finalNode];
  value.data.resultData.lastNodeExecuted = 'Fictional sample data';
  assert.deepEqual(validateExecution(item, value), { observed: 'evaluator_not_executed', output_items: 0 });
  assert.throws(() => validateExecution(normal, value, reference));
});
test('technical-failure exercise requires the expected node and sentinel error', () => {
  const item = bundle.cases.find(item => item.kind === 'technical-failure');
  const value = completed();
  assert.throws(() => validateExecution(item, value));
  value.status = 'error';
  value.data.resultData.error = { message: failureMessage };
  value.data.resultData.runData[normal.finalNode][0].executionStatus = 'error';
  assert.equal(validateExecution(item, value).observed, 'expected_technical_failure');
  value.data.resultData.error.message = 'Unexpected infrastructure error';
  assert.throws(() => validateExecution(item, value));
});
