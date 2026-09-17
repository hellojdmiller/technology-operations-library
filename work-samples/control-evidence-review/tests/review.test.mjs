import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { CONTROL_IDS, reviewInventory, renderText, runCli } from '../review.mjs';

const directory = new URL('../', import.meta.url);
const fixturePath = fileURLToPath(new URL('inventory.example.json', directory));
const scriptPath = fileURLToPath(new URL('review.mjs', directory));
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
const asOf = '2026-09-17';
const clone = value => structuredClone(value);
const codes = report => report.review_queue.map(item => item.code);
function sample() {
  const assessment = clone(fixture.assessments[3]);
  const evidence = clone(fixture.evidence.filter(item => assessment.evidence_refs.includes(item.evidence_id)));
  return { schema_version: 1, fictional: true, assessments: [assessment], evidence };
}
function exception(status = 'approved', expires = '2026-10-01') {
  return { status, expires_on: expires, owner_role: 'Fictional risk owner', reason: 'Synthetic deviation', scope_id: 'EX-RESTORE', compensating_measures: 'Synthetic manual check', approval_reference: status === 'approved' ? 'EX-APPROVAL' : null };
}

test('control IDs match the 36-row source library', () => {
  const csv = readFileSync(new URL('../../cyber-risk/controls/control-library.csv', directory), 'utf8');
  const ids = csv.trim().split(/\r?\n/).slice(1).map(line => line.split(',')[0]);
  assert.deepEqual(CONTROL_IDS, ids);
});

test('usable operating metadata supports the documented sample, never universal effectiveness', () => {
  const report = reviewInventory(sample(), asOf);
  assert.equal(report.assessments[0].operating_evidence.state, 'support_for_documented_sample');
  assert.match(report.assessments[0].evidence[1].limitations, /does not assert production/);
  assert.equal(report.summary.review_items, 0);
  assert.match(report.assurance_limit, /not verified/);
});

test('configuration evidence cannot substantiate an operating-effectiveness claim', () => {
  const input = sample();
  input.assessments[0].evidence_refs.pop();
  input.evidence.pop();
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].implementation_evidence.state, 'support_recorded');
  assert.equal(report.assessments[0].operating_evidence.state, 'no_usable_evidence');
  assert.ok(codes(report).includes('unsupported_effectiveness_claim'));
  assert.ok(codes(report).includes('operating_evidence_gap'));
});

test('freshness uses the supplied inclusive age boundary in UTC calendar days', () => {
  const input = sample();
  input.evidence[1].observed_on = '2026-08-18';
  assert.equal(reviewInventory(input, asOf).assessments[0].evidence[1].eligible_for_summary, true);
  input.evidence[1].observed_on = '2026-08-17';
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].evidence[1].age_days, 31);
  assert.ok(codes(report).includes('stale_evidence'));
  assert.equal(report.assessments[0].operating_evidence.state, 'no_usable_evidence');
});

test('future evidence remains visible and cannot support a claim', () => {
  const input = sample();
  input.evidence[1].observed_on = '2026-09-18';
  const report = reviewInventory(input, asOf);
  assert.ok(codes(report).includes('future_evidence'));
  assert.equal(report.assessments[0].evidence[1].age_days, -1);
  assert.equal(report.assessments[0].operating_evidence.state, 'no_usable_evidence');
});

test('missing evidence references are review items instead of silent omissions', () => {
  const input = sample();
  input.evidence.pop();
  const report = reviewInventory(input, asOf);
  assert.ok(codes(report).includes('missing_evidence'));
  assert.deepEqual(report.assessments[0].evidence[1].issues, ['missing_evidence']);
});

test('absent dates, reviewer, and private reference keep metadata ineligible', () => {
  const input = sample();
  Object.assign(input.evidence[1], { observed_on: null, reviewer_role: null, private_reference: null });
  const report = reviewInventory(input, asOf);
  for (const code of ['missing_observation_date', 'missing_reviewer', 'missing_private_reference']) assert.ok(codes(report).includes(code));
  assert.equal(report.assessments[0].evidence[1].eligible_for_summary, false);
});

test('control, service scope, and version must all match independently', () => {
  const input = sample();
  Object.assign(input.evidence[1], { control_id: 'VCIT-029', scope_id: 'EX-OTHER', scope_version: 'old-scope' });
  const report = reviewInventory(input, asOf);
  for (const code of ['control_mismatch', 'scope_mismatch', 'scope_version_mismatch']) assert.ok(codes(report).includes(code));
  assert.equal(report.assessments[0].operating_evidence.state, 'no_usable_evidence');
});

test('excluded adverse results remain unresolved rather than disappearing', () => {
  const input = sample();
  Object.assign(input.evidence[1], { observed_on: '2026-06-01', result: 'contradicts_intended_state' });
  const report = reviewInventory(input, asOf);
  assert.ok(codes(report).includes('excluded_adverse_record'));
  assert.equal(report.assessments[0].evidence[1].result, 'contradicts_intended_state');
});

test('a newer positive result does not overwrite a still-current contrary result', () => {
  const input = sample();
  input.evidence.push({ ...input.evidence[1], evidence_id: 'E-ADVERSE', observed_on: '2026-09-14', result: 'contradicts_intended_state' });
  input.assessments[0].evidence_refs.push('E-ADVERSE');
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].operating_evidence.state, 'conflicting_results');
  assert.ok(codes(report).includes('unsupported_effectiveness_claim'));
});

test('positive and inconclusive results require review together', () => {
  const input = sample();
  input.evidence.push({ ...input.evidence[1], evidence_id: 'E-UNCLEAR', result: 'inconclusive' });
  input.assessments[0].evidence_refs.push('E-UNCLEAR');
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].operating_evidence.state, 'support_with_unresolved_results');
  assert.ok(codes(report).includes('operating_support_with_unresolved_results'));
});

test('approved exceptions do not convert adverse results or incomplete claims into support', () => {
  const input = sample();
  input.assessments[0].exception = exception();
  input.assessments[0].operating_effectiveness_claim = 'ineffective';
  input.evidence[1].result = 'contradicts_intended_state';
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].exception.reviewed_state, 'approved');
  assert.equal(report.assessments[0].operating_evidence.state, 'adverse_result_recorded');
  for (const code of ['exception_active', 'recorded_operating_gap', 'operating_adverse_result_recorded']) assert.ok(codes(report).includes(code));
});

test('exception expiry is visible and does not auto-renew; expiry date itself is inclusive', () => {
  const input = sample();
  input.assessments[0].exception = exception('approved', asOf);
  assert.equal(reviewInventory(input, asOf).assessments[0].exception.reviewed_state, 'approved');
  const report = reviewInventory(input, '2026-09-18');
  assert.equal(report.assessments[0].exception.reviewed_state, 'expired');
  assert.ok(codes(report).includes('exception_expired'));
});

test('incomplete exception approval and wrong scope remain visible together with expiry', () => {
  const input = sample();
  input.assessments[0].exception = { ...exception('approved', '2026-09-01'), approval_reference: null, scope_id: 'EX-OTHER' };
  const report = reviewInventory(input, asOf);
  for (const code of ['exception_scope_mismatch', 'exception_approval_incomplete', 'exception_expired']) assert.ok(codes(report).includes(code));
});

test('a proposed exception is not an approved deviation', () => {
  const input = sample();
  input.assessments[0].exception = exception('proposed', null);
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].exception.reviewed_state, 'proposed');
  assert.ok(codes(report).includes('exception_not_approved'));
  assert.ok(!codes(report).includes('exception_active'));
});

test('intended state needs recorded approval and an approval reference', () => {
  const input = sample();
  input.assessments[0].intended_state.status = 'draft';
  assert.ok(codes(reviewInventory(input, asOf)).includes('intended_state_not_approved'));
  input.assessments[0].intended_state = { status: 'approved', reference: null };
  assert.ok(codes(reviewInventory(input, asOf)).includes('missing_intended_state_reference'));
});

test('unknown claims are retained even when supplied metadata appears supportive', () => {
  const input = sample();
  input.assessments[0].implementation_claim = 'unknown';
  input.assessments[0].operating_effectiveness_claim = 'unknown';
  const report = reviewInventory(input, asOf);
  assert.equal(report.assessments[0].operating_effectiveness_claim, 'unknown');
  assert.ok(codes(report).includes('operating_claim_unresolved'));
  assert.ok(codes(report).includes('implementation_claim_unknown'));
});

test('inapplicability requires rationale and current scope evidence', () => {
  const input = sample();
  input.assessments[0].applicability = { status: 'not_applicable', rationale: null };
  input.assessments[0].implementation_claim = 'not_applicable';
  input.assessments[0].operating_effectiveness_claim = 'not_applicable';
  const report = reviewInventory(input, asOf);
  assert.ok(codes(report).includes('unsupported_inapplicability'));
  assert.ok(codes(report).includes('inapplicability_with_control_evidence'));
});

test('unlinked evidence is reported and never counted toward the assessment', () => {
  const input = sample();
  input.evidence.push({ ...input.evidence[0], evidence_id: 'E-ORPHAN', result: 'contradicts_intended_state' });
  const report = reviewInventory(input, asOf);
  assert.deepEqual(report.unlinked_evidence_ids, ['E-ORPHAN']);
  assert.equal(report.assessments[0].implementation_evidence.state, 'support_recorded');
  assert.match(renderText(report), /Unlinked evidence/);
});

test('duplicate evidence IDs, assessment IDs, references, and unknown controls fail validation', () => {
  let input = sample(); input.evidence.push(clone(input.evidence[0]));
  assert.throws(() => reviewInventory(input, asOf), /Duplicate evidence_id/);
  input = sample(); input.assessments.push(clone(input.assessments[0]));
  assert.throws(() => reviewInventory(input, asOf), /Duplicate assessment_id/);
  input = sample(); input.assessments[0].evidence_refs.push(input.assessments[0].evidence_refs[0]);
  assert.throws(() => reviewInventory(input, asOf), /duplicate references/);
  input = sample(); input.assessments[0].control_id = 'VCIT-999';
  assert.throws(() => reviewInventory(input, asOf), /Unknown control_id/);
});

test('invalid dates, unsupported schema, and invalid age limits fail rather than becoming unknown', () => {
  for (const date of ['2026-02-30', '2026-9-17', 'not-a-date']) assert.throws(() => reviewInventory(sample(), date), /date|YYYY/);
  let input = sample(); input.evidence[0].observed_on = '2026-02-30';
  assert.throws(() => reviewInventory(input, asOf), /calendar date/);
  input = sample(); input.schema_version = 2;
  assert.throws(() => reviewInventory(input, asOf), /schema_version/);
  for (const age of [-1, 1.5, null, 36501]) {
    input = sample(); input.assessments[0].max_evidence_age_days = age;
    assert.throws(() => reviewInventory(input, asOf), /max_evidence_age_days/);
  }
});

test('review does not mutate its inventory input', () => {
  const input = sample(); const before = clone(input);
  reviewInventory(input, asOf);
  assert.deepEqual(input, before);
});

test('readable reports neutralize control characters in supplied text', () => {
  const input = sample(); input.assessments[0].scope.label = 'Synthetic\u001b[31m\nInjected';
  const report = reviewInventory(input, asOf);
  assert.ok(!renderText(report).includes('\u001b'));
  assert.ok(!renderText(report).includes('\nInjected'));
});

test('fixture produces reproducible JSON and readable reports including the review queue', () => {
  const report = reviewInventory(fixture, asOf);
  assert.deepEqual(report, JSON.parse(readFileSync(new URL('expected-report.example.json', directory), 'utf8')));
  assert.equal(renderText(report), readFileSync(new URL('expected-report.example.txt', directory), 'utf8'));
  assert.equal(report.summary.assessments, 8);
  assert.equal(report.summary.unlinked_evidence_records, 1);
});

test('CLI emits JSON with exit zero for a valid inventory that requires review', () => {
  const result = spawnSync(process.execPath, [scriptPath, '--input', fixturePath, '--as-of', asOf, '--format', 'json'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.ok(JSON.parse(result.stdout).summary.review_items > 0);
});

test('CLI rejects ambiguous flags and reports input errors with a nonzero exit', () => {
  assert.throws(() => runCli(['--input', fixturePath, '--as-of', asOf, '--as-of', asOf]), /Duplicate argument/);
  assert.throws(() => runCli(['--input', fixturePath, '--as-of']), /Missing value/);
  assert.throws(() => runCli(['--network', 'yes']), /Unknown argument/);
  const result = spawnSync(process.execPath, [scriptPath, '--input', fixturePath, '--as-of', '2026-02-30'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Review failed/);
  assert.equal(result.stdout, '');
});
