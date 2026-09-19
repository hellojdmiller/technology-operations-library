import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { reconcileInventory, renderText, runCli } from '../reconcile.mjs';

const AS_OF = '2026-09-19T12:00:00Z';
const DIR = new URL('../', import.meta.url);
const fixture = JSON.parse(readFileSync(new URL('inventory.example.json', DIR), 'utf8'));
const copy = object => structuredClone(object);
const codes = report => report.review_queue.map(record => record.code);
const delivery = (report, id = 'DELIVERY-001') => report.deliveries.find(record => record.delivery_id === id);
function sample() {
  const input = copy(fixture);
  input.batch_state_claim = 'completed';
  input.expected_deliveries = input.expected_deliveries.slice(0, 1);
  input.entitlements = input.entitlements.slice(0, 1);
  input.attempts = input.attempts.slice(0, 1);
  input.verifications = input.verifications.slice(0, 1);
  return input;
}
function sentRetry(input, id = 'ATTEMPT-RETRY') {
  input.attempts.push({ ...input.attempts[0], attempt_id: id, retry_of: input.attempts[0].attempt_id, attempted_at: '2026-09-19T10:10:00Z', evidence_ref: 'EX-SEND-RETRY' });
  input.verifications.push({ ...input.verifications[0], verification_id: 'VERIFY-RETRY', attempt_id: id, evidence_ref: 'EX-RECEIPT-RETRY' });
}

test('exact eligible supplied records support a scoped completion without claiming independent verification', () => {
  const input = sample();
  const original = copy(input);
  const report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).completion_state, 'support_recorded');
  assert.equal(delivery(report).review_required, false);
  assert.equal(report.summary.review_items, 0);
  assert.match(report.assurance_limit, /not independently verified/);
  assert.match(report.assurance_limit, /No send, retry, release, or compliance decision is authorized/);
  assert.deepEqual(input, original);
});

test('canonical fixture matches both checked-in expected reports and preserves nine scenario outcomes', () => {
  const report = reconcileInventory(copy(fixture), AS_OF);
  assert.deepEqual(report, JSON.parse(readFileSync(new URL('expected-report.example.json', DIR), 'utf8')));
  assert.equal(renderText(report), readFileSync(new URL('expected-report.example.txt', DIR), 'utf8'));
  assert.equal(report.summary.expected_deliveries, 9);
  assert.equal(report.summary.supplied_attempts, 10);
  assert.equal(report.summary.completion_support_recorded, 4);
  assert.equal(delivery(report, 'DELIVERY-004').completion_state, 'missing');
  assert.equal(delivery(report, 'DELIVERY-008').completion_state, 'conflicting');
  assert.equal(delivery(report, 'DELIVERY-009').entitlement.state, 'adverse_claim');
  assert.equal(delivery(report, 'DELIVERY-009').completion_state, 'support_recorded');
  assert.ok(codes(report).includes('batch_not_complete'));
});

test('wrong recipient, fund, entity, document and version are independently surfaced', () => {
  const input = sample();
  for (const field of ['recipient_id', 'fund_id', 'entity_id', 'document_id', 'version']) input.attempts[0][field] = 'WRONG';
  const report = reconcileInventory(input, AS_OF);
  for (const field of ['recipient_id', 'fund_id', 'entity_id', 'document_id', 'version']) assert.ok(codes(report).includes(`wrong_${field}`));
  assert.equal(delivery(report).completion_state, 'unverified');
  assert.ok(codes(report).includes('attempt_approval_missing_claim'));
  assert.ok(codes(report).includes('attempt_entitlement_missing_claim'));
});

test('denied entitlement remains adverse when the actual destination receipt is recorded', () => {
  const input = sample(); input.entitlements[0].status = 'denied';
  const report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).completion_state, 'support_recorded');
  assert.equal(delivery(report).entitlement.state, 'adverse_claim');
  assert.equal(delivery(report).review_required, true);
});

test('approval is exact to entity/document/version and is never inferred from an expected row', () => {
  const input = sample(); input.version_approvals = [];
  const report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).approval.state, 'missing_claim');
  assert.equal(delivery(report).review_required, true);
});

test('conflicting authority claims stay conflicting even when the adverse record lacks metadata', () => {
  const input = sample();
  input.version_approvals.push({ ...input.version_approvals[0], approval_id: 'APPROVAL-OTHER', status: 'revoked', evidence_ref: null });
  input.entitlements.push({ ...input.entitlements[0], entitlement_id: 'ENTITLEMENT-OTHER', status: 'denied', recorded_at: null });
  const report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).approval.state, 'conflicting_claims');
  assert.equal(delivery(report).entitlement.state, 'conflicting_claims');
  assert.ok(codes(report).includes('evidence_reference_missing'));
  assert.ok(codes(report).includes('record_time_missing'));
});

test('pending or unknown authorization stays unresolved and cannot become support', () => {
  const input = sample(); input.version_approvals[0].status = 'pending'; input.entitlements[0].status = 'unknown';
  const report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).approval.state, 'unresolved_claim');
  assert.equal(delivery(report).entitlement.state, 'unresolved_claim');
});

test('authority records created after the attempt do not establish authority at send time', () => {
  const input = sample(); input.version_approvals[0].recorded_at = '2026-09-19T10:30:00Z'; input.entitlements[0].recorded_at = '2026-09-19T10:30:00Z';
  const report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('approval_recorded_after_attempt'));
  assert.ok(codes(report).includes('entitlement_recorded_after_attempt'));
  assert.equal(delivery(report).review_required, true);
});

test('no attempt means missing only within a current complete expected/attempt population', () => {
  const input = sample(); input.attempts = []; input.verifications = [];
  let report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).completion_state, 'missing');
  assert.ok(codes(report).includes('missing_delivery'));
  input.snapshots.attempts.coverage = 'partial';
  report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).completion_state, 'unknown');
  assert.ok(codes(report).includes('delivery_coverage_unknown'));
  assert.equal(codes(report).includes('missing_delivery'), false);
});

test('sender-only evidence and unobserved completion never substitute for a recipient/destination record', () => {
  const input = sample(); input.verifications[0].method = 'sender_log';
  let report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).completion_state, 'unverified');
  assert.ok(codes(report).includes('verification_method_insufficient'));
  input.verifications = [];
  report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('sent_without_usable_confirmation'));
});

test('destination record is an eligible method but still only supplied metadata', () => {
  const input = sample(); input.verifications[0].method = 'destination_record';
  assert.equal(delivery(reconcileInventory(input, AS_OF)).completion_state, 'support_recorded');
});

test('positive and negative or inconclusive verification results conflict, even when a record is unusable', () => {
  for (const result of ['not_confirmed', 'inconclusive']) {
    const input = sample(); input.verifications.push({ ...input.verifications[0], verification_id: 'VERIFY-OTHER', result, evidence_ref: null });
    const report = reconcileInventory(input, AS_OF);
    assert.equal(delivery(report).completion_state, 'conflicting');
    assert.ok(codes(report).includes('completion_conflict'));
  }
});

test('a failed/unknown send plus a confirmed receipt remains a conflict', () => {
  for (const result of ['failed', 'unknown']) {
    const input = sample(); input.attempts[0].result = result;
    const report = reconcileInventory(input, AS_OF);
    assert.equal(delivery(report).completion_state, 'conflicting');
    assert.ok(codes(report).includes(result === 'failed' ? 'attempt_failed' : 'attempt_result_unknown'));
  }
});

test('retries after a failed attempt preserve history without an invented duplicate-send finding', () => {
  const input = sample(); sentRetry(input); input.attempts[0].result = 'failed'; input.verifications.shift();
  const report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).completion_state, 'support_recorded');
  assert.ok(codes(report).includes('attempt_failed'));
  assert.equal(codes(report).includes('multiple_sent_attempts'), false);
  assert.equal(codes(report).includes('duplicate_target_sends'), false);
  assert.equal(report.attempts.length, 2);
});

test('sent retries remain multiple possible effects, never silently deduplicated', () => {
  const input = sample(); sentRetry(input);
  const report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('retry_after_uncertain_or_sent'));
  assert.ok(codes(report).includes('multiple_sent_attempts'));
  assert.equal(codes(report).filter(code => code === 'duplicate_target_sends').length, 2);
  assert.equal(report.attempts.length, 2);
});

test('retries after unknown outcomes remain a duplicate-risk review even without two sent claims', () => {
  const input = sample(); sentRetry(input); input.attempts[0].result = 'unknown'; input.verifications.shift();
  const report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('retry_after_uncertain_or_sent'));
  assert.equal(codes(report).includes('multiple_sent_attempts'), false);
});

test('unlinked repeats and duplicate actual targets across different delivery IDs are retained', () => {
  const input = sample(); sentRetry(input); input.attempts[1].retry_of = null;
  let report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('unlinked_repeat_attempts'));
  input.attempts[1].delivery_id = 'DELIVERY-UNEXPECTED';
  report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('unexpected_delivery_id'));
  assert.ok(codes(report).includes('duplicate_target_sends'));
  assert.equal(report.attempts.length, 2);
});

test('missing, cross-delivery and time-reversed retry ancestry stay explicit gaps', () => {
  const input = sample(); input.attempts[0].retry_of = 'ATTEMPT-MISSING';
  assert.ok(codes(reconcileInventory(input, AS_OF)).includes('retry_predecessor_missing'));
  input.attempts[0].retry_of = null; sentRetry(input);
  input.attempts[1].delivery_id = 'DELIVERY-OTHER'; input.attempts[1].attempted_at = input.attempts[0].attempted_at;
  const report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('retry_crosses_delivery'));
  assert.ok(codes(report).includes('retry_order_invalid'));
});

test('retry cycles and self-references are rejected rather than traversed forever', () => {
  const input = sample(); input.attempts[0].retry_of = input.attempts[0].attempt_id;
  assert.throws(() => reconcileInventory(input, AS_OF), /Cyclic retry/);
  input.attempts[0].retry_of = null; sentRetry(input); input.attempts[0].retry_of = input.attempts[1].attempt_id;
  assert.throws(() => reconcileInventory(input, AS_OF), /Cyclic retry/);
});

test('freshness accepts the exact age boundary and rejects an older snapshot', () => {
  const input = sample();
  for (const snapshot of Object.values(input.snapshots)) snapshot.captured_at = '2026-09-18T12:00:00Z';
  // Remove observations later than the boundary snapshot; this test isolates snapshot freshness.
  input.attempts = []; input.verifications = []; input.version_approvals = []; input.entitlements = [];
  let report = reconcileInventory(input, AS_OF);
  assert.equal(report.summary.complete_current_snapshot_set, true);
  input.snapshots.attempts.captured_at = '2026-09-18T11:59:59Z';
  report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('snapshot_stale'));
  assert.equal(delivery(report).completion_state, 'unknown');
});

test('all incomplete/future/missing/mismatched snapshot metadata remains unusable', () => {
  const mutations = [
    ['coverage', 'partial', 'snapshot_incomplete'], ['coverage', 'unknown', 'snapshot_incomplete'],
    ['captured_at', null, 'snapshot_time_missing'], ['captured_at', '2026-09-19T12:00:01Z', 'snapshot_future'],
    ['scope_id', 'OTHER', 'snapshot_scope_mismatch'], ['batch_id', 'OTHER', 'snapshot_batch_mismatch'],
  ];
  for (const [field, value, code] of mutations) {
    const input = sample(); input.snapshots.attempts[field] = value;
    const report = reconcileInventory(input, AS_OF);
    assert.ok(codes(report).includes(code));
    assert.equal(delivery(report).completion_state, 'unknown');
    assert.equal(report.summary.complete_current_snapshot_set, false);
  }
});

test('stale authority snapshots do not wash away adverse claims or support positive authority', () => {
  const input = sample(); input.snapshots.entitlements.captured_at = '2026-09-17T12:00:00Z';
  let report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).entitlement.state, 'unresolved_claim');
  input.entitlements[0].status = 'denied';
  report = reconcileInventory(input, AS_OF);
  assert.equal(delivery(report).entitlement.state, 'adverse_claim');
});

test('missing evidence reference, observer, or time prevents completion support', () => {
  for (const field of ['evidence_ref', 'observer_role', 'observed_at']) {
    const input = sample(); input.verifications[0][field] = null;
    assert.equal(delivery(reconcileInventory(input, AS_OF)).completion_state, 'unverified');
  }
});

test('future records and records newer than their snapshots remain ineligible', () => {
  const input = sample(); input.verifications[0].observed_at = '2026-09-19T12:00:01Z';
  let report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('record_future'));
  assert.ok(codes(report).includes('record_after_snapshot'));
  assert.equal(delivery(report).completion_state, 'unverified');
  input.verifications[0].observed_at = '2026-09-19T11:00:00Z'; input.snapshots.verifications.captured_at = '2026-09-19T10:30:00Z';
  report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('record_after_snapshot'));
});

test('verification before an attempt and orphaned verification stay unresolved', () => {
  const input = sample(); input.verifications[0].observed_at = '2026-09-19T09:00:00Z';
  assert.ok(codes(reconcileInventory(input, AS_OF)).includes('verification_order_unresolved'));
  input.verifications[0].attempt_id = 'ATTEMPT-MISSING';
  const report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('verification_attempt_missing'));
  assert.equal(delivery(report).completion_state, 'unverified');
});

test('an interrupted/running/unknown batch remains a review item even with a supported row', () => {
  for (const state of ['interrupted', 'running', 'unknown']) {
    const input = sample(); input.batch_state_claim = state;
    const report = reconcileInventory(input, AS_OF);
    assert.equal(delivery(report).completion_state, 'support_recorded');
    assert.equal(delivery(report).review_required, true);
    assert.ok(codes(report).includes('batch_not_complete'));
  }
});

test('duplicate IDs in every record collection and duplicate expected tuples are rejected', () => {
  for (const field of ['expected_deliveries', 'version_approvals', 'entitlements', 'attempts', 'verifications']) {
    const input = sample(); input[field].push(copy(input[field][0]));
    assert.throws(() => reconcileInventory(input, AS_OF), /Duplicate/);
  }
  const input = sample(); input.expected_deliveries.push({ ...input.expected_deliveries[0], delivery_id: 'DELIVERY-OTHER' });
  assert.throws(() => reconcileInventory(input, AS_OF), /Duplicate expected target tuple/);
  const snapshots = sample(); snapshots.snapshots.attempts.snapshot_id = snapshots.snapshots.approvals.snapshot_id;
  assert.throws(() => reconcileInventory(snapshots, AS_OF), /Duplicate snapshot_id/);
});

test('strict calendar timestamps reject rollover, offsets, missing UTC and invalid as-of', () => {
  for (const value of ['2026-02-30T12:00:00Z', '2026-09-19T25:00:00Z', '2026-09-19T12:00:00+00:00', '2026-09-19', 'not-a-date']) {
    assert.throws(() => reconcileInventory(sample(), value), /timestamp/);
    const input = sample(); input.attempts[0].attempted_at = value;
    assert.throws(() => reconcileInventory(input, AS_OF), /timestamp/);
  }
});

test('strict schema/types reject missing fields, unknown fields, malformed IDs and unsupported statuses', () => {
  const mutations = [
    input => { delete input.snapshots; }, input => { input.extra = true; }, input => { input.fictional = 'true'; },
    input => { input.max_snapshot_age_hours = -1; }, input => { input.max_snapshot_age_hours = 1.5; },
    input => { input.expected_deliveries[0].recipient_id = 'recipient-001'; },
    input => { input.attempts[0].result = 'delivered'; }, input => { delete input.verifications[0].evidence_ref; },
    input => { input.version_approvals[0].recorded_at = 123; }, input => { input.entitlements[0].evidence_ref = ''; },
    input => { input.attempts = {}; }, input => { input.verifications[0].extra = true; },
  ];
  for (const mutate of mutations) { const input = sample(); mutate(input); assert.throws(() => reconcileInventory(input, AS_OF)); }
});

test('CLI returns deterministic JSON and invalid invocations exit 1', () => {
  const script = fileURLToPath(new URL('reconcile.mjs', DIR));
  const input = fileURLToPath(new URL('inventory.example.json', DIR));
  const result = spawnSync(process.execPath, [script, '--input', input, '--as-of', AS_OF, '--format', 'json'], { encoding: 'utf8' });
  assert.equal(result.status, 0); assert.equal(result.stderr, '');
  assert.deepEqual(JSON.parse(result.stdout), reconcileInventory(copy(fixture), AS_OF));
  for (const args of [[], ['--input'], ['--wat'], ['--input', input, '--as-of', AS_OF, '--format', 'yaml'], ['--input', input, '--input', input, '--as-of', AS_OF], ['--input', '/nonexistent-inventory.json', '--as-of', AS_OF]]) {
    const failed = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    assert.equal(failed.status, 1); assert.equal(failed.stdout, ''); assert.match(failed.stderr, /^Error:/);
  }
});

test('CLI help requires no input and text renderer warns even when there are no findings', () => {
  let output = ''; let errors = '';
  const io = { stdout: { write: value => { output += value; } }, stderr: { write: value => { errors += value; } } };
  assert.equal(runCli(['--help'], io), 0); assert.match(output, /no network or writes/); assert.equal(errors, '');
  assert.match(renderText(reconcileInventory(sample(), AS_OF)), /Independent evidence review and authority decisions remain outside this tool/);
});

test('a completely empty extraction still requires an explicit population decision', () => {
  const input = sample();
  for (const field of ['expected_deliveries', 'version_approvals', 'entitlements', 'attempts', 'verifications']) input[field] = [];
  const report = reconcileInventory(input, AS_OF);
  assert.equal(report.summary.complete_current_snapshot_set, true);
  assert.equal(report.summary.review_required, true);
  assert.ok(codes(report).includes('empty_expected_population'));
  assert.equal(report.summary.expected_deliveries, 0);
  assert.equal(report.summary.completion_support_recorded, 0);
});

test('empty expectations do not hide stray attempted effects or fabricate a matched delivery', () => {
  const input = sample(); input.expected_deliveries = [];
  const report = reconcileInventory(input, AS_OF);
  assert.ok(codes(report).includes('empty_expected_population'));
  assert.ok(codes(report).includes('unexpected_delivery_id'));
  assert.equal(report.attempts.length, 1);
  assert.equal(report.verifications.length, 1);
  assert.equal(report.deliveries.length, 0);
  assert.equal(report.summary.review_required, true);
});
