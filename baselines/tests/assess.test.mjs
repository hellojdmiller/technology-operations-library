import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { assess } from '../scripts/assess.mjs';

const load = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const baseline = load('../google-workspace/desired-state.json');
const example = load('../google-workspace/observed.example.json');
const run = (b, o, date = '2026-09-17') => assess(b, o, { asOf: date });
function fixture() {
  const b = structuredClone(baseline);
  b.controls = [b.controls[0]];
  const o = structuredClone(example);
  o.observations = [o.observations[0]];
  return [b, o, o.observations[0]];
}

// Each fictional example yields the same mixed picture: 7 aligned, 3 gaps, 1 scoped not-applicable, and the rest unknown.
// The refreshed Google and Microsoft catalogs added controls without example observations, so their unknown count grows by that number.
const CATALOGS = [
  { provider: 'google-workspace', controls: 24, unknown: 13, asOf: '2026-09-17' },
  { provider: 'microsoft-365', controls: 25, unknown: 14, asOf: '2026-09-17' },
  { provider: 'cloudflare', controls: 20, unknown: 9, asOf: '2026-09-20' },
  { provider: 'aws', controls: 20, unknown: 9, asOf: '2026-09-20' },
  { provider: 'github', controls: 20, unknown: 9, asOf: '2026-09-20' },
];
test('every catalog produces the intended mixed fictional result', () => {
  for (const { provider, controls, unknown, asOf } of CATALOGS) {
    const b = load(`../${provider}/desired-state.json`);
    const o = load(`../${provider}/observed.example.json`);
    const result = run(b, o, asOf);
    assert.deepEqual(result.counts, { aligned: 7, gap: 3, unknown, not_applicable: 1 });
    assert.equal(result.results.length, controls);
    assert.equal(result.fictional, true);
  }
});
test('every catalog ships a matching worksheet and a risk-assessment template', () => {
  const csv = name => readFileSync(new URL(name, import.meta.url), 'utf8').trim().split('\n');
  for (const { provider, controls } of CATALOGS) {
    const worksheet = csv(`../${provider}/evidence-worksheet.csv`);
    assert.equal(worksheet[0], csv('../google-workspace/evidence-worksheet.csv')[0], `${provider}: worksheet header`);
    const ids = new Set(load(`../${provider}/desired-state.json`).controls.map(c => c.id));
    const worksheetIds = worksheet.slice(1).map(line => line.split(',')[0]);
    assert.deepEqual(new Set(worksheetIds), ids, `${provider}: worksheet ids`);
    assert.equal(worksheetIds.length, controls);
    const risks = csv(`../${provider}/risk-assessment.csv`);
    assert.equal(risks[0], 'risk_id,scenario,threat_source,affected_assets,related_controls,inherent_likelihood,inherent_impact,inherent_rating,residual_likelihood,residual_impact,residual_rating,status,owner_role,treatment,target_date,verification_evidence,acceptance_authority,review_date', `${provider}: risk header`);
    assert.ok(risks.length >= 11, `${provider}: at least ten risk scenarios`);
  }
});

test('missing observations remain unknown, including an empty assessment', () => {
  const [b, o] = fixture(); o.observations = [];
  assert.equal(run(b, o).results[0].status, 'unknown');
});
test('an explicit false assertion is a gap, not missing evidence', () => {
  const [b, o, e] = fixture(); e.value = false;
  assert.equal(run(b, o).results[0].status, 'gap');
});
test('stale, future, and partial evidence cannot produce alignment', () => {
  for (const update of [{ observed_at: '2026-01-01T00:00:00Z' }, { observed_at: '2026-09-18T00:00:00Z' }, { scope_complete: false }]) {
    const [b, o, e] = fixture(); Object.assign(e, update);
    assert.equal(run(b, o).results[0].status, 'unknown');
  }
});
test('same-day observations are accepted through the end of UTC review day', () => {
  const [b, o, e] = fixture(); e.observed_at = '2026-09-17T23:59:59Z';
  assert.equal(run(b, o).results[0].status, 'aligned');
});
test('unknown value and missing evidence remain unknown', () => {
  for (const update of [{ value: null }, { evidence_ref: null }, { reviewer: null }, { applicable: null }]) {
    const [b, o, e] = fixture(); Object.assign(e, update);
    assert.equal(run(b, o).results[0].status, 'unknown');
  }
});
test('unsupported or unverified capabilities cannot produce alignment', () => {
  for (const implementation of ['unsupported', 'unknown']) {
    const [b, o, e] = fixture(); e.implementation = implementation;
    assert.equal(run(b, o).results[0].status, 'unknown');
  }
});
test('manual process cannot satisfy a control requiring native enforcement', () => {
  const [b, o, e] = fixture(); b.controls[0].implementation_modes = ['native']; e.implementation = 'manual';
  assert.equal(run(b, o).results[0].status, 'unknown');
});
test('non-applicable requires a current scoped reason and evidence', () => {
  const [b, o, e] = fixture(); e.applicable = false; e.value = null;
  assert.equal(run(b, o).results[0].status, 'unknown');
  e.not_applicable_reason = 'Workload absent in documented scope';
  assert.equal(run(b, o).results[0].status, 'not_applicable');
  e.evidence_ref = null;
  assert.equal(run(b, o).results[0].status, 'unknown');
});
test('an active or expired exception never hides a gap', () => {
  const [b, o, e] = fixture(); e.value = false;
  e.exception = { owner: 'Example owner', reason: 'Example dependency', compensating_control: 'Example review', expires_on: '2026-09-17' };
  assert.equal(run(b, o).results[0].status, 'gap');
  assert.equal(run(b, o).results[0].exception.state, 'active');
  assert.equal(run(b, o, '2026-09-18').results[0].exception.state, 'expired');
});
test('duplicate or unknown observations are rejected instead of overwritten', () => {
  const [b, o, e] = fixture(); o.observations.push({ ...e });
  assert.throws(() => run(b, o), /Duplicate observation/);
  o.observations.pop(); e.id = 'TYPO';
  assert.throws(() => run(b, o), /Unknown observation/);
});
test('duplicate controls and baseline-version mismatch are rejected', () => {
  const [b, o] = fixture(); b.controls.push({ ...b.controls[0] });
  assert.throws(() => run(b, o), /Duplicate control/);
  b.controls.pop(); o.baseline_version = '2.0.0';
  assert.throws(() => run(b, o), /mismatch/);
});
test('strings cannot masquerade as boolean evidence or target values', () => {
  const [b, o, e] = fixture(); e.value = 'true';
  assert.throws(() => run(b, o), /boolean or null/);
  e.value = true; b.controls[0].target = 'true';
  assert.throws(() => run(b, o), /boolean targets/);
});
test('invalid dates and timestamps are rejected rather than rolled forward', () => {
  const [b, o, e] = fixture();
  assert.throws(() => run(b, o, '2026-02-30'), /real date/);
  e.observed_at = '2026-02-30T00:00:00Z';
  assert.throws(() => run(b, o), /real timestamp/);
});
test('the CLI is read-only and emits a parseable fictional report', () => {
  const result = spawnSync(process.execPath, [
    new URL('../scripts/assess.mjs', import.meta.url).pathname,
    new URL('../google-workspace/desired-state.json', import.meta.url).pathname,
    new URL('../google-workspace/observed.example.json', import.meta.url).pathname,
    '--as-of', '2026-09-17', '--json',
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).fictional, true);
  const code = readFileSync(new URL('../scripts/assess.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /writeFile|fetch\(|https\.request|execSync|spawnSync/);
});
test('the CLI rejects missing assessment date and malformed arguments', () => {
  const result = spawnSync(process.execPath, [new URL('../scripts/assess.mjs', import.meta.url).pathname], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Usage:/);
});
