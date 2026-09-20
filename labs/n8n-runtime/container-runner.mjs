import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { arch } from 'node:os';
import { parseExecution, validateExecution } from './validate.mjs';

const bundle = JSON.parse(readFileSync('/input/cases.json', 'utf8'));
const report = {
  schema_version: 1, started_at: new Date().toISOString(), status: 'failed',
  n8n_version: bundle.version, image: bundle.image, node_version: process.version,
  architecture: arch(), execution_mode: 'cli', runner_mode: 'internal',
  source_revision: bundle.source_revision, source_tree_dirty: bundle.source_tree_dirty,
  sources: bundle.sources, harness: bundle.harness, imported_inactive_workflows: 0, results: [], warnings: [],
};

function cli(args, timeout = 90000) {
  const result = spawnSync('n8n', args, { encoding: 'utf8', timeout, maxBuffer: 32 * 1024 * 1024 });
  const text = (result.stdout || '') + '\n' + (result.stderr || '');
  if (text.includes('Python 3 is missing')) report.warnings.push('Python runner unavailable; this lab exercises JavaScript nodes only.');
  if (text.includes('localStorage is not available')) report.warnings.push('Node emitted its experimental localStorage warning.');
  if (result.error) throw result.error;
  return { code: result.status, text };
}

try {
  const version = cli(['--version']);
  assert.equal(version.code, 0);
  assert.equal(version.text.trim(), bundle.version, 'Image version differs from the pin');
  const imported = cli(['import:workflow', '--input=/input/workflows.json']);
  assert.equal(imported.code, 0, imported.text.slice(-3000));
  const exported = cli(['export:workflow', '--all', '--output=/tmp/imported.json']);
  assert.equal(exported.code, 0, exported.text.slice(-3000));
  const workflows = JSON.parse(readFileSync('/tmp/imported.json', 'utf8'));
  assert.equal(workflows.length, bundle.cases.length);
  for (const item of bundle.cases) {
    const saved = workflows.find(workflow => workflow.id === item.id);
    assert.ok(saved, `Import missing: ${item.id}`);
    assert.equal(saved.active, false, 'An imported workflow became active');
    assert.deepEqual(saved.nodes, item.workflow.nodes);
    assert.deepEqual(saved.connections, item.workflow.connections);
  }
  report.imported_inactive_workflows = workflows.length;
  for (const item of bundle.cases) {
    const record = { id: item.id, slug: item.slug, case: item.kind, passed: false };
    report.results.push(record);
    try {
      const run = cli(['execute', `--id=${item.id}`, '--rawOutput']);
      // A CLI can exit zero after catching an error. Inspect actual run data.
      const execution = parseExecution(run.text);
      if (item.kind !== 'technical-failure') assert.equal(run.code, 0);
      let reference;
      if (!['technical-failure', 'zero-items'].includes(item.kind)) {
        // Only our staged evaluator runs here, inside the isolated container.
        // Parity is an integration check, not an independent business oracle.
        const code = item.workflow.nodes[2].parameters.jsCode;
        reference = new Function('$input', code)({ all: () => item.input.map(json => ({ json })) }).map(result => result.json);
      }
      Object.assign(record, validateExecution(item, execution, reference), {
        passed: true, execution_status: execution.status, cli_exit_code: run.code,
      });
      console.log(`PASS ${item.slug} / ${item.kind}: ${record.observed}`);
    } catch (error) {
      record.error = error.message;
      console.log(`FAIL ${item.slug} / ${item.kind}: ${error.message}`);
    }
  }
  report.status = report.results.length === bundle.cases.length && report.results.every(item => item.passed) ? 'passed' : 'failed';
} catch (error) {
  report.setup_error = error.message;
} finally {
  report.warnings = [...new Set(report.warnings)];
  report.finished_at = new Date().toISOString();
  console.log('TOL_REPORT ' + JSON.stringify(report));
  process.exitCode = report.status === 'passed' ? 0 : 1;
}
