import { spawn, spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { buildCases, sha256 } from './cases.mjs';

const lab = dirname(fileURLToPath(import.meta.url));
const root = resolve(lab, '../..');
const pin = JSON.parse(readFileSync(join(lab, 'image.json'), 'utf8'));
if (process.argv.length !== 2) {
  console.error('Usage: node labs/n8n-runtime/run.mjs');
  process.exit(2);
}
function docker(args) {
  return spawnSync('docker', args, { encoding: 'utf8', timeout: 30000 });
}
const inspection = docker(['image', 'inspect', pin.image]);
if (inspection.error || inspection.status !== 0) {
  console.error(`Pinned image unavailable or Docker not running. Start Docker, then run:\ndocker pull ${pin.image}`);
  process.exit(1);
}
const { cases, sources } = buildCases(root);
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
const input = mkdtempSync(join(tmpdir(), 'vcpeit-n8n-input-'));
if (input.includes(',')) throw new Error('Docker mount path cannot contain a comma');
const container = 'vcpeit-n8n-lab-' + randomUUID();
const runId = new Date().toISOString().replaceAll(':', '-') + '-' + randomUUID().slice(0, 8);
const destination = join(root, 'local-results/n8n-runtime', runId);
mkdirSync(destination, { recursive: true });
const bundle = {
  ...pin, sources, cases,
  harness: Object.fromEntries(['image.json', 'cases.mjs', 'validate.mjs', 'container-runner.mjs', 'run.mjs'].map(file => [file, sha256(readFileSync(join(lab, file)))])),
  source_revision: revision.status === 0 ? revision.stdout.trim() : null,
  source_tree_dirty: dirty.status === 0 ? Boolean(dirty.stdout.trim()) : null,
};
writeFileSync(join(input, 'cases.json'), JSON.stringify(bundle));
writeFileSync(join(input, 'workflows.json'), JSON.stringify(cases.map(item => item.workflow)));
for (const file of ['container-runner.mjs', 'validate.mjs', 'cases.mjs']) copyFileSync(join(lab, file), join(input, file));
// Linux bind mounts retain host ownership; the image's node user may have a different UID.
// Only fictional inputs and lab code are staged, and the container mount stays read-only.
for (const file of ['cases.json', 'workflows.json', 'container-runner.mjs', 'validate.mjs', 'cases.mjs']) chmodSync(join(input, file), 0o444);
chmodSync(input, 0o755);
const args = [
  'run', '--rm', '--init', '--name', container,
  '--network', 'none', '--read-only', '--cap-drop', 'ALL',
  '--security-opt', 'no-new-privileges', '--memory', '2g', '--cpus', '2', '--pids-limit', '256',
  '--tmpfs', '/home/node/.n8n:rw,nosuid,uid=1000,gid=1000,size=256m',
  '--tmpfs', '/tmp:rw,nosuid,size=256m',
  '--mount', `type=bind,src=${input},dst=/input,readonly`,
  '--env', 'N8N_DIAGNOSTICS_ENABLED=false', '--env', 'N8N_VERSION_NOTIFICATIONS_ENABLED=false',
  '--env', 'N8N_TEMPLATES_ENABLED=false', '--env', 'N8N_LICENSE_AUTO_RENEW_ENABLED=false',
  '--env', 'N8N_RUNNERS_MODE=internal', '--env', 'N8N_LOG_LEVEL=info',
  '--entrypoint', 'node', pin.image, '/input/container-runner.mjs',
];
let output = '';
let errors = '';
const cleanup = () => {
  docker(['rm', '--force', container]);
  const remaining = docker(['container', 'ls', '--all', '--filter', `name=^/${container}$`, '--format', '{{.ID}}']);
  const removed = !remaining.error && remaining.status === 0 && remaining.stdout.trim() === '';
  if (removed) rmSync(input, { recursive: true, force: true });
  writeFileSync(join(destination, 'cleanup.json'), JSON.stringify({ container, removed, staged_input_removed: removed }, null, 2) + '\n');
  if (!removed) {
    console.error(`Cleanup not verified for ${container}. Staged input retained at ${input}. Inspect Docker, then remove this lab container.`);
    process.exitCode = 1;
  }
  return removed;
};
const interrupt = () => { cleanup(); process.exit(130); };
process.once('SIGINT', interrupt);
process.once('SIGTERM', interrupt);
console.log(`Running ${cases.length} cases in n8n ${pin.version}. No ports, external network, or tenant credentials.`);
try {
  const status = await new Promise((resolveExit, reject) => {
    const child = spawn('docker', args);
    let killTimer;
    const timer = setTimeout(() => {
      docker(['stop', '--time', '2', container]);
      child.kill('SIGTERM');
      killTimer = setTimeout(() => child.kill('SIGKILL'), 5000);
    }, 15 * 60 * 1000);
    child.on('error', error => { clearTimeout(timer); clearTimeout(killTimer); reject(error); });
    child.stdout.on('data', chunk => {
      output += chunk;
      // Keep console output compact; full structured output is saved locally.
      for (const line of chunk.toString().split('\n')) if (/^(PASS|FAIL) /.test(line)) console.log(line);
    });
    child.stderr.on('data', chunk => { errors += chunk; });
    child.on('close', code => { clearTimeout(timer); clearTimeout(killTimer); resolveExit(code); });
  });
  writeFileSync(join(destination, 'runner.log'), output + '\n' + errors);
  const lines = output.split('\n').filter(line => line.startsWith('VCPEIT_REPORT '));
  if (lines.length !== 1) throw new Error('Container did not return one complete report; inspect runner.log');
  const report = JSON.parse(lines[0].slice('VCPEIT_REPORT '.length));
  report.docker_image_id = JSON.parse(inspection.stdout)[0].Id;
  writeFileSync(join(destination, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`Report: ${join(destination, 'report.json')}`);
  if (status !== 0 || report.status !== 'passed' || report.results.length !== cases.length) throw new Error('Runtime validation failed; inspect the report');
  console.log(`PASS: ${report.results.length} cases, ${sources.length} source workflows, n8n ${report.n8n_version}.`);
} catch (error) {
  console.error(error.message);
  if (errors.trim()) console.error(errors.trim());
  process.exitCode = 1;
} finally {
  cleanup();
  process.removeListener('SIGINT', interrupt);
  process.removeListener('SIGTERM', interrupt);
}
