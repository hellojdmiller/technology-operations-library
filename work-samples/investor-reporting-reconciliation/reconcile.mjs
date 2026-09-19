#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const HOUR = 3_600_000;
const COLLECTIONS = ['expectations', 'approvals', 'entitlements', 'attempts', 'verifications'];
const TARGET = ['recipient_id', 'fund_id', 'entity_id', 'document_id', 'version'];
const DOCUMENT = ['fund_id', 'entity_id', 'document_id', 'version'];
const ENTITLEMENT = ['recipient_id', 'fund_id', 'entity_id', 'document_id'];
function need(condition, message) { if (!condition) throw new Error(message); }
function exact(object, fields, label) {
  need(object !== null && typeof object === 'object' && !Array.isArray(object), `${label}: object required`);
  need(Object.keys(object).length === fields.length && fields.every(key => Object.hasOwn(object, key)), `${label}: expected exactly ${fields.join(', ')}`);
}
function id(value, label) { need(typeof value === 'string' && /^[A-Z][A-Z0-9_-]{0,63}$/.test(value), `${label}: exact uppercase stable ID required`); }
function nullableText(value, label) { need(value === null || (typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= 500), `${label}: nonempty trimmed text or explicit null required`); }
function oneOf(value, values, label) { need(values.includes(value), `${label}: expected ${values.join(' / ')}`); }
function timestamp(value, label, nullable = false) {
  if (nullable && value === null) return null;
  need(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value), `${label}: UTC timestamp YYYY-MM-DDTHH:mm:ssZ required`);
  const time = Date.parse(value);
  need(Number.isFinite(time) && new Date(time).toISOString().replace('.000Z', 'Z') === value, `${label}: invalid calendar timestamp`);
  return time;
}
const same = (a, b, fields) => fields.every(key => a[key] === b[key]);
const keyFor = (record, fields) => fields.map(key => record[key]).join('|');

export function validateInventory(input, asOf) {
  timestamp(asOf, 'as-of');
  exact(input, ['schema_version', 'fictional', 'batch_id', 'scope_id', 'max_snapshot_age_hours', 'batch_state_claim', 'snapshots', 'expected_deliveries', 'version_approvals', 'entitlements', 'attempts', 'verifications'], 'inventory');
  need(input.schema_version === 1, 'schema_version: only 1 is supported');
  need(typeof input.fictional === 'boolean', 'fictional: explicit boolean required');
  id(input.batch_id, 'batch_id'); id(input.scope_id, 'scope_id');
  need(Number.isSafeInteger(input.max_snapshot_age_hours) && input.max_snapshot_age_hours >= 0 && input.max_snapshot_age_hours <= 8760, 'max_snapshot_age_hours: integer 0..8760 required');
  oneOf(input.batch_state_claim, ['completed', 'interrupted', 'running', 'unknown'], 'batch_state_claim');
  exact(input.snapshots, COLLECTIONS, 'snapshots');
  const snapshotIds = new Set();
  for (const name of COLLECTIONS) {
    const record = input.snapshots[name];
    exact(record, ['snapshot_id', 'scope_id', 'batch_id', 'captured_at', 'coverage'], `snapshots.${name}`);
    for (const field of ['snapshot_id', 'scope_id', 'batch_id']) id(record[field], `snapshots.${name}.${field}`);
    need(!snapshotIds.has(record.snapshot_id), `Duplicate snapshot_id: ${record.snapshot_id}`); snapshotIds.add(record.snapshot_id);
    timestamp(record.captured_at, `${name}.captured_at`, true);
    oneOf(record.coverage, ['complete', 'partial', 'unknown'], `${name}.coverage`);
  }
  const definitions = [
    ['expected_deliveries', 'delivery_id', ['delivery_id', ...TARGET]],
    ['version_approvals', 'approval_id', ['approval_id', ...DOCUMENT, 'status', 'recorded_at', 'evidence_ref']],
    ['entitlements', 'entitlement_id', ['entitlement_id', ...ENTITLEMENT, 'status', 'recorded_at', 'evidence_ref']],
    ['attempts', 'attempt_id', ['attempt_id', 'delivery_id', ...TARGET, 'retry_of', 'attempted_at', 'result', 'evidence_ref']],
    ['verifications', 'verification_id', ['verification_id', 'attempt_id', 'result', 'observed_at', 'method', 'observer_role', 'evidence_ref']],
  ];
  for (const [name, identity, fields] of definitions) {
    need(Array.isArray(input[name]), `${name}: array required`);
    const ids = new Set();
    for (const record of input[name]) {
      exact(record, fields, name);
      for (const field of fields.filter(field => field.endsWith('_id') || field === 'version')) id(record[field], `${name}.${field}`);
      need(!ids.has(record[identity]), `Duplicate ${identity}: ${record[identity]}`); ids.add(record[identity]);
      if ('evidence_ref' in record) nullableText(record.evidence_ref, `${identity}.evidence_ref`);
      if ('recorded_at' in record) timestamp(record.recorded_at, `${identity}.recorded_at`, true);
      if (name === 'version_approvals') oneOf(record.status, ['approved', 'pending', 'revoked', 'unknown'], 'approval.status');
      if (name === 'entitlements') oneOf(record.status, ['allowed', 'denied', 'unknown'], 'entitlement.status');
      if (name === 'attempts') {
        if (record.retry_of !== null) id(record.retry_of, 'retry_of');
        timestamp(record.attempted_at, 'attempted_at', true);
        oneOf(record.result, ['sent', 'failed', 'unknown'], 'attempt.result');
      }
      if (name === 'verifications') {
        timestamp(record.observed_at, 'observed_at', true);
        nullableText(record.observer_role, 'observer_role');
        oneOf(record.result, ['confirmed', 'not_confirmed', 'inconclusive'], 'verification.result');
        oneOf(record.method, ['recipient_receipt', 'destination_record', 'sender_log', 'unknown'], 'verification.method');
      }
    }
  }
  const expectedTuples = input.expected_deliveries.map(record => keyFor(record, TARGET));
  need(new Set(expectedTuples).size === expectedTuples.length, 'Duplicate expected target tuple: use one delivery_id per exact recipient/fund/entity/document/version');
  const attempts = new Map(input.attempts.map(record => [record.attempt_id, record]));
  for (const attempt of input.attempts) {
    const seen = new Set([attempt.attempt_id]);
    let prior = attempt.retry_of;
    while (prior !== null && attempts.has(prior)) {
      need(!seen.has(prior), `Cyclic retry ancestry: ${attempt.attempt_id}`);
      seen.add(prior); prior = attempts.get(prior).retry_of;
    }
  }
}

export function reconcileInventory(input, asOf) {
  validateInventory(input, asOf);
  const asOfTime = timestamp(asOf, 'as-of');
  const reviewQueue = [];
  const add = (code, recordId, deliveryId, detail) => reviewQueue.push({ code, record_id: recordId, delivery_id: deliveryId, detail });
  const snapshots = {};
  for (const name of COLLECTIONS) {
    const record = input.snapshots[name];
    const issues = [];
    if (record.scope_id !== input.scope_id) issues.push('snapshot_scope_mismatch');
    if (record.batch_id !== input.batch_id) issues.push('snapshot_batch_mismatch');
    if (record.coverage !== 'complete') issues.push('snapshot_incomplete');
    const age = record.captured_at === null ? null : (asOfTime - timestamp(record.captured_at, 'captured_at')) / HOUR;
    if (age === null) issues.push('snapshot_time_missing');
    else if (age < 0) issues.push('snapshot_future');
    else if (age > input.max_snapshot_age_hours) issues.push('snapshot_stale');
    for (const code of issues) add(code, record.snapshot_id, null, `${name}: supplied coverage=${record.coverage}; captured_at=${record.captured_at}`);
    snapshots[name] = { ...record, age_hours: age, usable_for_summary: issues.length === 0, issues };
  }
  if (input.expected_deliveries.length === 0) add('empty_expected_population', input.batch_id, null, 'No expected population is supplied; independently establish the intended scope, including a deliberate empty-batch decision if appropriate. Complete extraction metadata alone does not establish readiness.');
  if (input.batch_state_claim !== 'completed') add('batch_not_complete', input.batch_id, null, `Supplied batch state is ${input.batch_state_claim}; reconcile remaining and attempted work before any resume decision.`);
  const attemptsById = new Map(input.attempts.map(record => [record.attempt_id, record]));
  const expectedById = new Map(input.expected_deliveries.map(record => [record.delivery_id, record]));
  const metadata = (record, collection, timeField, recordId, deliveryId) => {
    const problems = [];
    if (!snapshots[collection].usable_for_summary) problems.push('source_snapshot_unusable');
    if (record.evidence_ref === null) problems.push('evidence_reference_missing');
    const time = record[timeField] === null ? null : timestamp(record[timeField], timeField);
    if (time === null) problems.push('record_time_missing');
    else {
      if (time > asOfTime) problems.push('record_future');
      if (snapshots[collection].captured_at !== null && time > timestamp(snapshots[collection].captured_at, 'captured_at')) problems.push('record_after_snapshot');
    }
    for (const code of problems) add(code, recordId, deliveryId, `${collection} metadata does not substantiate this record for the supplied as-of time.`);
    return problems.length === 0;
  };
  const evaluatedApprovals = input.version_approvals.map(record => ({ ...record, metadata_eligible: metadata(record, 'approvals', 'recorded_at', record.approval_id, null) }));
  const evaluatedEntitlements = input.entitlements.map(record => ({ ...record, metadata_eligible: metadata(record, 'entitlements', 'recorded_at', record.entitlement_id, null) }));
  const authority = (target, records, fields, allowed, adverse, kind, recordId, deliveryId) => {
    const matches = records.filter(record => same(record, target, fields));
    const statuses = new Set(matches.map(record => record.status));
    let state;
    if (matches.length === 0) state = 'missing_claim';
    else if (statuses.size > 1) state = 'conflicting_claims';
    else if (statuses.has(adverse)) state = 'adverse_claim';
    else if (statuses.has(allowed) && matches.every(record => record.metadata_eligible)) state = 'support_recorded';
    else state = 'unresolved_claim';
    if (state !== 'support_recorded') add(`${kind}_${state}`, recordId, deliveryId, `Exact target ${kind} remains ${state}; no authorization is inferred.`);
    return { state, record_ids: matches.map(record => record.approval_id ?? record.entitlement_id) };
  };
  const evaluatedAttempts = input.attempts.map(record => {
    const expected = expectedById.get(record.delivery_id);
    const mismatches = expected ? TARGET.filter(field => record[field] !== expected[field]) : [];
    if (!expected) add('unexpected_delivery_id', record.attempt_id, record.delivery_id, 'Attempt is outside the supplied expected-delivery IDs; retain it for investigation.');
    for (const field of mismatches) add(`wrong_${field}`, record.attempt_id, record.delivery_id, `Expected ${expected[field]}; supplied attempt targets ${record[field]}.`);
    const eligible = metadata(record, 'attempts', 'attempted_at', record.attempt_id, record.delivery_id);
    const approval = authority(record, evaluatedApprovals, DOCUMENT, 'approved', 'revoked', 'attempt_approval', record.attempt_id, record.delivery_id);
    const entitlement = authority(record, evaluatedEntitlements, ENTITLEMENT, 'allowed', 'denied', 'attempt_entitlement', record.attempt_id, record.delivery_id);
    if (record.result === 'failed') add('attempt_failed', record.attempt_id, record.delivery_id, 'Failed attempt remains in the history even if a later retry succeeds.');
    if (record.result === 'unknown') add('attempt_result_unknown', record.attempt_id, record.delivery_id, 'Unknown send outcome must be reconciled before retrying.');
    if (record.retry_of !== null) {
      const prior = attemptsById.get(record.retry_of);
      if (!prior) add('retry_predecessor_missing', record.attempt_id, record.delivery_id, `Referenced attempt ${record.retry_of} is absent; retry history is incomplete.`);
      else {
        if (prior.delivery_id !== record.delivery_id) add('retry_crosses_delivery', record.attempt_id, record.delivery_id, 'Retry references a different expected delivery.');
        if (prior.attempted_at === null || record.attempted_at === null) add('retry_order_unknown', record.attempt_id, record.delivery_id, 'Missing timestamps prevent ordering the retry.');
        else if (record.attempted_at <= prior.attempted_at) add('retry_order_invalid', record.attempt_id, record.delivery_id, 'Retry must occur after its referenced attempt.');
        if (prior.result !== 'failed') add('retry_after_uncertain_or_sent', record.attempt_id, record.delivery_id, 'A sent or unknown prior outcome creates duplicate-delivery risk; an explicit retry link does not clear it.');
      }
    }
    for (const [kind, records, fields] of [['approval', evaluatedApprovals, DOCUMENT], ['entitlement', evaluatedEntitlements, ENTITLEMENT]]) {
      const positive = records.filter(item => same(item, record, fields) && item.metadata_eligible && item.status === (kind === 'approval' ? 'approved' : 'allowed'));
      if (record.attempted_at !== null && positive.length && positive.every(item => item.recorded_at > record.attempted_at)) add(`${kind}_recorded_after_attempt`, record.attempt_id, record.delivery_id, 'Supplied authority records all postdate the attempt; they do not establish authority when it occurred.');
    }
    return { ...record, metadata_eligible: eligible, expected_target_matches: !!expected && mismatches.length === 0, approval, entitlement };
  });
  const sentTargets = new Map();
  for (const attempt of evaluatedAttempts.filter(record => record.result === 'sent')) {
    const key = keyFor(attempt, TARGET);
    if (!sentTargets.has(key)) sentTargets.set(key, []);
    sentTargets.get(key).push(attempt);
  }
  for (const attempts of sentTargets.values()) {
    if (attempts.length > 1) for (const attempt of attempts) add('duplicate_target_sends', attempt.attempt_id, attempt.delivery_id, `Same actual target appears in sent attempts ${attempts.map(record => record.attempt_id).join(', ')}; different delivery IDs or retry links do not establish a single effect.`);
  }
  const evaluatedVerifications = input.verifications.map(record => {
    const attempt = attemptsById.get(record.attempt_id);
    const deliveryId = attempt?.delivery_id ?? null;
    let eligible = metadata(record, 'verifications', 'observed_at', record.verification_id, deliveryId);
    if (!attempt) { add('verification_attempt_missing', record.verification_id, null, `Attempt ${record.attempt_id} is absent; verification cannot be associated.`); eligible = false; }
    if (record.observer_role === null) { add('verification_observer_missing', record.verification_id, deliveryId, 'No observer role is recorded.'); eligible = false; }
    if (!['recipient_receipt', 'destination_record'].includes(record.method)) { add('verification_method_insufficient', record.verification_id, deliveryId, 'Sender logs and unknown methods do not substantiate recipient/destination completion.'); eligible = false; }
    if (attempt && (attempt.attempted_at === null || record.observed_at === null || record.observed_at < attempt.attempted_at)) { add('verification_order_unresolved', record.verification_id, deliveryId, 'Verification must have a known time at or after the associated attempt.'); eligible = false; }
    if (record.result !== 'confirmed') add('verification_not_confirmed', record.verification_id, deliveryId, `Supplied observation is ${record.result}; retain it even if another record is positive.`);
    return { ...record, metadata_eligible: eligible };
  });
  const deliveries = input.expected_deliveries.map(expected => {
    const deliveryId = expected.delivery_id;
    const approval = authority(expected, evaluatedApprovals, DOCUMENT, 'approved', 'revoked', 'expected_approval', deliveryId, deliveryId);
    const entitlement = authority(expected, evaluatedEntitlements, ENTITLEMENT, 'allowed', 'denied', 'expected_entitlement', deliveryId, deliveryId);
    const attempts = evaluatedAttempts.filter(record => record.delivery_id === deliveryId);
    const sent = attempts.filter(record => record.result === 'sent');
    if (sent.length > 1) add('multiple_sent_attempts', deliveryId, deliveryId, `${sent.length} supplied sent attempts; retry ancestry does not prove only one delivery effect.`);
    if (attempts.length > 1 && attempts.filter(record => record.retry_of === null).length > 1) add('unlinked_repeat_attempts', deliveryId, deliveryId, 'Multiple root attempts need reconciliation; stable IDs are not silently collapsed.');
    let completion = 'unverified';
    const exactAttempts = attempts.filter(record => record.expected_target_matches);
    let supported = false;
    let conflict = false;
    for (const attempt of exactAttempts) {
      const verification = evaluatedVerifications.filter(record => record.attempt_id === attempt.attempt_id);
      const statuses = new Set(verification.map(record => record.result));
      if ((statuses.has('confirmed') && statuses.size > 1) || (attempt.result !== 'sent' && statuses.has('confirmed'))) {
        conflict = true; add('completion_conflict', attempt.attempt_id, deliveryId, 'Supplied send and/or verification outcomes conflict; do not select only a favorable record.');
      }
      if (attempt.result === 'sent' && attempt.metadata_eligible && verification.length && verification.every(record => record.metadata_eligible && record.result === 'confirmed')) supported = true;
      else if (attempt.result === 'sent') add('sent_without_usable_confirmation', attempt.attempt_id, deliveryId, 'A send claim alone does not substantiate delivery completion.');
    }
    const coverageUsable = ['expectations', 'attempts', 'verifications'].every(name => snapshots[name].usable_for_summary);
    if (!attempts.length) {
      completion = snapshots.expectations.usable_for_summary && snapshots.attempts.usable_for_summary ? 'missing' : 'unknown';
      add(completion === 'missing' ? 'missing_delivery' : 'delivery_coverage_unknown', deliveryId, deliveryId, completion === 'missing' ? 'No attempt exists in the supplied complete, current snapshot for this expected delivery.' : 'No attempt is supplied, but snapshot gaps prevent treating that as confirmed absence.');
    } else if (conflict) completion = 'conflicting';
    else if (!coverageUsable) completion = 'unknown';
    else if (supported) completion = 'support_recorded';
    if (completion !== 'support_recorded' && attempts.length) add('completion_unresolved', deliveryId, deliveryId, `Expected-delivery completion is ${completion}.`);
    return { ...expected, approval, entitlement, attempt_ids: attempts.map(record => record.attempt_id), completion_state: completion };
  });
  // Scope-level metadata gaps affect every row; an adverse observation is never discarded because its metadata is unusable.
  for (const delivery of deliveries) delivery.review_required = reviewQueue.some(item => item.delivery_id === null || item.delivery_id === delivery.delivery_id);
  return {
    schema_version: 1, fictional: input.fictional, batch_id: input.batch_id, scope_id: input.scope_id, as_of: asOf,
    assurance_limit: 'Offline metadata reconciliation only. Approvals, entitlements, snapshot completeness, observations, identities, content, and recipient receipt are supplied claims, not independently verified. No send, retry, release, or compliance decision is authorized.',
    batch_state_claim: input.batch_state_claim, snapshots,
    summary: { expected_deliveries: deliveries.length, supplied_attempts: input.attempts.length, completion_support_recorded: deliveries.filter(record => record.completion_state === 'support_recorded').length, deliveries_requiring_review: deliveries.filter(record => record.review_required).length, review_items: reviewQueue.length, complete_current_snapshot_set: Object.values(snapshots).every(record => record.usable_for_summary), review_required: reviewQueue.length > 0 },
    deliveries, version_approvals: evaluatedApprovals, entitlements: evaluatedEntitlements, attempts: evaluatedAttempts, verifications: evaluatedVerifications, review_queue: reviewQueue,
  };
}

export function renderText(report) {
  const lines = ['Offline investor-reporting reconciliation', `Fictional: ${report.fictional}; batch: ${report.batch_id}; scope: ${report.scope_id}; as of: ${report.as_of}`, report.assurance_limit, '', `Expected deliveries: ${report.summary.expected_deliveries}; attempts: ${report.summary.supplied_attempts}; completion support recorded: ${report.summary.completion_support_recorded}`, `Complete current snapshot set: ${report.summary.complete_current_snapshot_set}; supplied batch state: ${report.batch_state_claim}`, `Deliveries requiring review: ${report.summary.deliveries_requiring_review}; review items: ${report.summary.review_items}`, ''];
  for (const delivery of report.deliveries) lines.push(`${delivery.delivery_id}: completion=${delivery.completion_state}; approval=${delivery.approval.state}; entitlement=${delivery.entitlement.state}; review_required=${delivery.review_required}`);
  lines.push('', 'Review queue:');
  if (!report.review_queue.length) lines.push('No mismatch identified in supplied records. Independent evidence review and authority decisions remain outside this tool.');
  for (const item of report.review_queue) lines.push(`- ${item.code} | ${item.record_id} | ${item.delivery_id ?? 'batch/snapshot'} | ${item.detail}`);
  return lines.join('\n') + '\n';
}

export function runCli(args, io = { stdout: process.stdout, stderr: process.stderr }) {
  try {
    if (args.length === 1 && args[0] === '--help') { io.stdout.write('Usage: node reconcile.mjs --input FILE --as-of YYYY-MM-DDTHH:mm:ssZ [--format text|json]\nReads one local JSON file; no network or writes. Findings exit 0; invalid input exits 1.\n'); return 0; }
    const options = {};
    for (let index = 0; index < args.length; index += 2) {
      const flag = args[index];
      need(['--input', '--as-of', '--format'].includes(flag), `Unknown argument: ${flag}`);
      need(!Object.hasOwn(options, flag), `Duplicate argument: ${flag}`);
      need(typeof args[index + 1] === 'string' && !args[index + 1].startsWith('--'), `Missing value: ${flag}`);
      options[flag] = args[index + 1];
    }
    need(options['--input'] && options['--as-of'], '--input and --as-of are required');
    oneOf(options['--format'] ?? 'text', ['text', 'json'], 'format');
    const report = reconcileInventory(JSON.parse(readFileSync(options['--input'], 'utf8')), options['--as-of']);
    io.stdout.write(options['--format'] === 'json' ? JSON.stringify(report, null, 2) + '\n' : renderText(report));
    return 0;
  } catch (error) { io.stderr.write(`Error: ${error.message}\n`); return 1; }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = runCli(process.argv.slice(2));
