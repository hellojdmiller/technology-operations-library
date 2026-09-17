import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const fixture = slug => JSON.parse(file(`n8n/${slug}/sample-input.json`))[0];
const evaluate = (slug, packets) => new Function('$input', file(`n8n/${slug}/evaluate.js`))({ all: () => packets.map(json => ({ json })) });
const run = (slug, packet) => evaluate(slug, [packet])[0].json;
const slugs = ['access-review-preparation', 'vendor-renewal-triage', 'joiner-mover-leaver-review', 'backup-evidence-review', 'saas-license-reconciliation'];

for (const slug of slugs) {
  test(`${slug}: malformed input fails explicitly and packet linkage survives`, () => {
    for (const input of [null, {}, { ...fixture(slug), asOf: '2026-02-30' }, { ...fixture(slug), reviewId: '' }]) assert.equal(run(slug, input).status, 'invalid_input');
    assert.equal(evaluate(slug, [])[0].json.status, 'invalid_input');
    const output = evaluate(slug, [fixture(slug), fixture(slug)]);
    assert.equal(output.length, 2);
    assert.deepEqual(output[1].pairedItem, { item: 1 });
  });

  test(`${slug}: incomplete snapshots and missing evidence remain visible`, () => {
    const input = fixture(slug);
    input[slug === 'vendor-renewal-triage' ? 'registerComplete' : 'snapshotComplete'] = false;
    input.evidenceRef = '';
    const result = run(slug, input);
    assert.equal(result.status, 'needs_review');
    assert.ok(result.issues.some(issue => /incomplete/i.test(issue)));
    assert.ok(result.issues.some(issue => /evidence/i.test(issue)));
  });
}

test('access: leavers, privilege, and inactivity are distinct review reasons', () => {
  const output = run('access-review-preparation', fixture('access-review-preparation'));
  assert.equal(output.totalGrants, 3);
  assert.equal(output.exceptionCount, 2);
  assert.deepEqual(output.rows[0].findings, []);
  assert.ok(output.rows[1].findings.includes('leaver_has_access'));
  assert.ok(output.rows[1].findings.includes('privileged_access_review'));
  assert.ok(output.rows[1].findings.includes('usage_unknown'));
  assert.ok(output.rows[2].findings.includes('dormant_access_review'));
  assert.ok(output.rows.every(row => row.decision === 'pending_human_review'));
});

test('access: exact identity matching does not join unknown accounts by resemblance', () => {
  const input = fixture('access-review-preparation');
  input.grants[0].personId = 'Person-001';
  const output = run('access-review-preparation', input);
  assert.ok(output.rows[0].findings.includes('identity_not_in_workforce'));
  assert.equal(output.rows[0].reviewerRole, null);
});

test('access: inactivity threshold is inclusive, and future use or duplicate identity is invalid', () => {
  const input = fixture('access-review-preparation');
  input.grants = [input.grants[0]];
  input.grants[0].lastUsedOn = '2026-06-19';
  assert.ok(run('access-review-preparation', input).rows[0].findings.includes('dormant_access_review'));
  input.grants[0].lastUsedOn = '2026-09-18';
  assert.equal(run('access-review-preparation', input).status, 'invalid_input');
  input.grants[0].lastUsedOn = '2026-09-17';
  input.workforce.push(input.workforce[0]);
  assert.equal(run('access-review-preparation', input).status, 'invalid_input');
});

test('renewals: triage uses the notice deadline, not just the renewal date', () => {
  const result = run('vendor-renewal-triage', fixture('vendor-renewal-triage'));
  assert.equal(result.attentionCount, 2);
  assert.equal(result.rows[0].decisionDeadline, '2026-09-01');
  assert.equal(result.rows[0].daysToDeadline, -16);
  assert.equal(result.rows[0].queue, 'deadline_passed');
  assert.equal(result.rows[1].decisionDeadline, '2026-10-02');
  assert.equal(result.rows[1].queue, 'decision_due');
  assert.equal(result.rows[2].queue, 'decision_recorded');
  assert.equal(result.rows[1].currency, 'EUR');
});

test('renewals: a cancellation decision does not prove the notice was sent', () => {
  const input = fixture('vendor-renewal-triage');
  input.vendors = [input.vendors[0]];
  Object.assign(input.vendors[0], { decision: 'exit', decisionEvidenceRef: 'fixture://decision', exitPlanReady: true });
  let result = run('vendor-renewal-triage', input);
  assert.equal(result.rows[0].queue, 'deadline_passed');
  assert.ok(result.rows[0].findings.includes('exit_notice_unverified'));
  Object.assign(input.vendors[0], { noticeSent: true, noticeDeliveredOn: '2026-09-01', noticeEvidenceRef: 'fixture://notice-delivery' });
  result = run('vendor-renewal-triage', input);
  assert.equal(result.rows[0].queue, 'decision_recorded');
  assert.ok(!result.rows[0].findings.includes('exit_notice_unverified'));
});

test('renewals: a documented notice delivered after the deadline still requires review', () => {
  const input = fixture('vendor-renewal-triage');
  input.vendors = [input.vendors[0]];
  Object.assign(input.vendors[0], { criticality: 'standard', decision: 'exit', decisionEvidenceRef: 'fixture://decision', exitPlanReady: true, noticeSent: true, noticeDeliveredOn: '2026-09-02', noticeEvidenceRef: 'fixture://late-delivery' });
  const result = run('vendor-renewal-triage', input);
  assert.equal(result.status, 'needs_review');
  assert.ok(result.rows[0].findings.includes('notice_delivery_after_deadline'));
});

test('renewals: same-day deadline stays due; malformed numbers cannot become zero', () => {
  const input = fixture('vendor-renewal-triage');
  input.vendors = [input.vendors[1]];
  input.asOf = '2026-10-02';
  assert.equal(run('vendor-renewal-triage', input).rows[0].queue, 'decision_due');
  input.vendors[0].noticeDays = '60';
  assert.equal(run('vendor-renewal-triage', input).status, 'invalid_input');
  input.vendors[0].noticeDays = 60;
  input.vendors[0].annualCost = -1;
  assert.equal(run('vendor-renewal-triage', input).status, 'invalid_input');
});

test('lifecycle: done without evidence and omitted tasks remain open', () => {
  const result = run('joiner-mover-leaver-review', fixture('joiner-mover-leaver-review'));
  assert.equal(result.openCaseCount, 1);
  assert.equal(result.rows[0].incompleteTaskCount, 2);
  assert.ok(result.rows[0].taskReview[1].gaps.includes('completion_evidence_missing'));
  assert.ok(result.rows[0].taskReview[2].gaps.includes('task_missing'));
  assert.ok(result.rows[0].findings.includes('effective_date_reached_with_open_review'));
  assert.equal(result.rows[1].status, 'evidence_complete');
  assert.equal(result.rows[1].approval, 'pending_human_review');
});

test('lifecycle: not applicable requires an exception; duplicate tasks are invalid', () => {
  const input = fixture('joiner-mover-leaver-review');
  input.cases = [input.cases[1]];
  input.cases[0].tasks[2].exceptionRef = '';
  assert.ok(run('joiner-mover-leaver-review', input).rows[0].taskReview[2].gaps.includes('exception_approval_missing'));
  input.cases[0].tasks.push(input.cases[0].tasks[0]);
  assert.equal(run('joiner-mover-leaver-review', input).status, 'invalid_input');
});

test('lifecycle: empty catalog, absent scope approval, and extra tasks cannot disappear', () => {
  const input = fixture('joiner-mover-leaver-review');
  input.cases = [input.cases[1]];
  input.cases[0].scopeApproved = false;
  input.cases[0].tasks.push({ taskId: 'unapproved-task', state: 'pending', verifiedOn: null });
  const result = run('joiner-mover-leaver-review', input);
  assert.ok(result.rows[0].findings.includes('scope_approval_missing'));
  assert.deepEqual(result.rows[0].outOfScopeTaskIds, ['unapproved-task']);
  input.requiredTasks.leaver = [];
  assert.equal(run('joiner-mover-leaver-review', input).status, 'invalid_input');
});

test('backup: a recent successful job cannot conceal an old recovery point', () => {
  const result = run('backup-evidence-review', fixture('backup-evidence-review'));
  assert.equal(result.attentionCount, 2);
  assert.equal(result.rows[0].status, 'evidence_current');
  assert.equal(result.rows[1].recoveryPointAgeHours, 48);
  for (const reason of ['recovery_point_exceeds_rpo', 'restore_test_stale', 'restore_duration_exceeds_rto', 'restore_data_loss_exceeds_rpo']) assert.ok(result.rows[1].findings.includes(reason));
  assert.ok(result.rows[2].findings.includes('restore_not_tested'));
});

test('backup: equal objective boundaries pass, but missing measurements stay unknown', () => {
  const input = fixture('backup-evidence-review');
  input.workloads = [input.workloads[0]];
  const workload = input.workloads[0];
  workload.backup.recoveryPointAt = '2026-09-16T12:00:00Z';
  workload.restoreTest.recoveryDurationMinutes = 240;
  workload.restoreTest.dataLossMinutes = 1440;
  assert.equal(run('backup-evidence-review', input).status, 'review_ready');
  workload.restoreTest.recoveryDurationMinutes = null;
  assert.ok(run('backup-evidence-review', input).rows[0].findings.includes('restore_duration_unknown'));
});

test('backup: future or impossible timestamps and impossible event ordering are invalid', () => {
  for (const timestamp of ['2026-09-18T12:00:00Z', '2026-02-30T12:00:00Z', '2026-09-17T25:00:00Z']) {
    const input = fixture('backup-evidence-review');
    input.workloads[0].backup.recoveryPointAt = timestamp;
    assert.equal(run('backup-evidence-review', input).status, 'invalid_input');
  }
  const input = fixture('backup-evidence-review');
  input.workloads[0].backup.recoveryPointAt = '2026-09-17T07:00:00Z';
  assert.equal(run('backup-evidence-review', input).status, 'invalid_input');
});

test('licenses: unused and leaver seats become candidates; service accounts do not', () => {
  const result = run('saas-license-reconciliation', fixture('saas-license-reconciliation'));
  assert.equal(result.candidateCount, 2);
  assert.equal(result.rows[1].candidateReason, 'unused');
  assert.equal(result.rows[2].candidateReason, 'leaver');
  assert.equal(result.rows[3].candidateReason, null);
  assert.ok(result.rows[3].findings.includes('service_account_dependency_review'));
  assert.equal(result.subscriptionReview[0].unassignedSeats, 2);
});

test('licenses: duplicate export rows are flagged, counted once, and excluded from candidates', () => {
  const input = fixture('saas-license-reconciliation');
  input.assignments.push({ ...input.assignments[1], assignmentId: 'assignment-duplicate' });
  const result = run('saas-license-reconciliation', input);
  assert.equal(result.subscriptionReview[0].assignmentRecordCount, 4);
  assert.equal(result.subscriptionReview[0].uniqueAssignedSeats, 3);
  assert.equal(result.subscriptionReview[0].unassignedSeats, 2);
  assert.equal(result.candidateCount, 1);
  assert.ok(result.rows[1].findings.includes('duplicate_person_sku_assignment'));
});

test('licenses: unknown people and SKUs stay visible; overassignment is separate from free capacity', () => {
  const input = fixture('saas-license-reconciliation');
  input.subscriptions[0].purchasedSeats = 1;
  input.assignments[0].personId = 'unknown-person';
  input.assignments[3].skuId = 'unknown-sku';
  const result = run('saas-license-reconciliation', input);
  assert.equal(result.subscriptionReview[0].overassignedSeats, 2);
  assert.equal(result.subscriptionReview[0].unassignedSeats, 0);
  assert.ok(result.rows[0].findings.includes('identity_not_in_workforce'));
  assert.ok(result.rows[3].findings.includes('sku_not_in_subscription_register'));
});

test('all review packets require deliberate confirmation of empty scope', () => {
  for (const [slug, field] of [
    ['access-review-preparation', 'grants'], ['vendor-renewal-triage', 'vendors'],
    ['joiner-mover-leaver-review', 'cases'], ['backup-evidence-review', 'workloads'],
    ['saas-license-reconciliation', 'assignments']
  ]) {
    const input = fixture(slug);
    input[field] = [];
    const output = run(slug, input);
    assert.equal(output.status, 'needs_review');
    assert.ok(output.issues.some(issue => /empty/i.test(issue)));
  }
});
