#!/usr/bin/env node
/** Runs local tests/scenarios and records the exact source bytes behind the result. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { runCase, cases } from './cases.mjs';

if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22 or later required');
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--output')) throw new Error('Usage: node validate.mjs [--output new-file.json]');
const root = dirname(fileURLToPath(import.meta.url)), repo = resolve(root, '../..');
const startedAt = new Date().toISOString();
const testFiles = readdirSync(resolve(root, 'tests')).filter((name) => name.endsWith('.test.mjs')).sort().map((name) => `labs/agent-security/tests/${name}`);
const testArgs = ['--test', '--test-reporter=tap', ...testFiles];
const tests = spawnSync(process.execPath, testArgs, { cwd: repo, encoding: 'utf8', timeout: 30_000 });
const git = (gitArgs) => {
  const result = spawnSync('git', gitArgs, { cwd: repo, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
};
const sourceFiles = ['fixtures.mjs', 'harness.mjs', 'cases.mjs', 'run.mjs', 'validate.mjs', 'README.md', 'MODEL-TRIAL.md', ...testFiles.map((path) => relative('labs/agent-security', path))];
let scenarios = [], scenarioError = null;
try { scenarios = cases.map((entry) => runCase(entry.id)); } catch (error) { scenarioError = error.message; }
const passed = tests.status === 0 && !tests.error && scenarioError === null;
const dirty = git(['status', '--porcelain', '--', 'labs/agent-security']);
const report = {
  schema_version: 1, started_at: startedAt, finished_at: new Date().toISOString(),
  status: passed ? 'passed' : 'failed', node_version: process.version, platform: process.platform, architecture: process.arch,
  scope: 'Offline deterministic mock-control tests with synthetic fixtures and scripted tool proposals. No actual model, provider, tenant or network-tool integration was run.',
  source_revision: git(['rev-parse', 'HEAD']), source_tree_dirty: dirty === null ? 'unknown' : dirty.length > 0,
  source_hashes: sourceFiles.map((path) => ({ path: `labs/agent-security/${path}`, sha256: createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex') })),
  commands: { tests: ['node', ...testArgs].join(' '), scenarios: 'node labs/agent-security/run.mjs all --json', validator: 'node labs/agent-security/validate.mjs' },
  tests: { exit_code: tests.status, error: tests.error?.message ?? null, stdout: tests.stdout, stderr: tests.stderr },
  scenario_error: scenarioError, scenarios,
  limitations: ['No model behavior measured.', 'No OS/process sandbox or network egress enforcement tested.', 'No OAuth, MCP transport, real approval UI or provider integration tested.', 'Single process, in-memory mock destination; no concurrency, durability or cross-restart idempotency guarantee.', 'Scenario outcomes establish only the stated fixture behavior, not general prompt-injection resistance or production readiness.'],
};
const serialized = JSON.stringify(report, null, 2) + '\n';
if (args.length) {
  // Never silently replace an observed run. Choose a fresh filename for each observation.
  writeFileSync(resolve(args[1]), serialized, { flag: 'wx' });
  console.log(`${report.status.toUpperCase()}: ${cases.length} scenarios; test exit ${tests.status}; new record written to ${args[1]}`);
} else process.stdout.write(serialized);
if (!passed) process.exitCode = 1;
