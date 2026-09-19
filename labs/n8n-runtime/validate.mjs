import assert from 'node:assert/strict';
import { failureMessage } from './cases.mjs';

// n8n logs startup messages even with --rawOutput. Accept exactly one execution
// object, never a status-looking line or a successful process exit alone.
export function parseExecution(text) {
  const found = [];
  for (const match of text.matchAll(/^\{/gm)) {
    let depth = 0, quoted = false, escaped = false;
    for (let i = match.index; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') quoted = false;
      } else if (ch === '"') quoted = true;
      else if (ch === '{') depth++;
      else if (ch === '}' && --depth === 0) {
        const value = JSON.parse(text.slice(match.index, i + 1));
        if (value?.data?.resultData) found.push(value);
        break;
      }
    }
  }
  assert.equal(found.length, 1, 'Expected exactly one structured n8n execution result');
  return found[0];
}

export function validateExecution(testCase, execution, reference) {
  assert.equal(execution.mode, 'cli');
  const result = execution.data.resultData;
  const runData = result.runData;
  assert.ok(runData['Run example']?.[0], 'Manual trigger did not run');
  assert.equal(runData['Run example'][0].executionStatus, 'success');
  assert.equal(runData['Fictional sample data']?.[0]?.executionStatus, 'success');
  const final = runData[testCase.finalNode]?.[0];
  if (testCase.kind === 'technical-failure') {
    assert.equal(execution.status, 'error');
    assert.equal(final?.executionStatus, 'error');
    assert.ok(result.error?.message?.includes(failureMessage));
    return { observed: 'expected_technical_failure', output_items: 0 };
  }
  assert.equal(execution.status, 'success');
  assert.equal(execution.finished, true);
  assert.ok(!result.error, 'Workflow reported an execution error');
  if (testCase.kind === 'zero-items') {
    assert.equal(final, undefined, 'A zero-item source should leave the evaluator unexecuted');
    assert.equal(result.lastNodeExecuted, 'Fictional sample data');
    return { observed: 'evaluator_not_executed', output_items: 0 };
  }
  assert.equal(final?.executionStatus, 'success', 'Evaluator did not succeed');
  assert.equal(result.lastNodeExecuted, testCase.finalNode);
  const values = final.data.main[0].map(item => item.json);
  assert.ok(values.length > 0, 'Missing review output is not a valid result');
  assert.deepEqual(values, reference, 'n8n payload differs from the local evaluator reference');
  assert.ok(values.every(value => value.status === testCase.expectedStatus));
  if (testCase.kind === 'incomplete') {
    const issues = testCase.slug === 'operations-brief'
      ? values[0].observations[0].issues : values[0].issues;
    assert.ok(issues.some(issue => /missing|unassigned/i.test(issue)), 'Missing evidence must be explicit');
    if (!['operations-brief', 'automation-result-review'].includes(testCase.slug)) {
      assert.ok(issues.some(issue => /incomplete/i.test(issue)), 'Incomplete scope must be explicit');
    }
  }
  return { observed: values[0].status, output_items: values.length };
}
