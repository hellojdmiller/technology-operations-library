#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const DAY = 86_400_000;
export const CONTROL_IDS = Array.from({ length: 36 }, (_, i) => `VCIT-${String(i + 1).padStart(3, '0')}`);
const knownControls = new Set(CONTROL_IDS);
const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = v => typeof v === 'string' && v.trim().length > 0;
function requireThat(condition, message) { if (!condition) throw new Error(message); }
function dateOnly(value, label) {
  requireThat(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value), `${label}: expected YYYY-MM-DD`);
  const time = Date.parse(`${value}T00:00:00Z`);
  requireThat(Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value, `${label}: invalid calendar date`);
  return time;
}
function fields(obj, names, label) {
  requireThat(isObject(obj), `${label}: expected an object`);
  for (const name of names) requireThat(isText(obj[name]), `${label}.${name}: nonempty text required`);
}
function oneOf(value, values, label) { requireThat(values.includes(value), `${label}: unsupported value ${value}`); }
function nullableText(value, label) { requireThat(value === null || isText(value), `${label}: text or explicit null required`); }
function uniqueTextArray(values, label) {
  requireThat(Array.isArray(values) && values.every(isText), `${label}: expected a text array`);
  requireThat(new Set(values).size === values.length, `${label}: duplicate references`);
}

export function validateInventory(input, asOf) {
  dateOnly(asOf, 'as-of');
  requireThat(isObject(input) && input.schema_version === 1, 'Unsupported inventory schema_version');
  requireThat(typeof input.fictional === 'boolean', 'fictional must be an explicit boolean');
  requireThat(Array.isArray(input.assessments) && input.assessments.length > 0, 'assessments must be a nonempty array');
  requireThat(Array.isArray(input.evidence), 'evidence must be an array');
  const assessments = new Set();
  for (const record of input.assessments) {
    fields(record, ['assessment_id', 'control_id', 'owner_role'], 'assessment');
    requireThat(!assessments.has(record.assessment_id), `Duplicate assessment_id: ${record.assessment_id}`);
    assessments.add(record.assessment_id);
    requireThat(knownControls.has(record.control_id), `Unknown control_id: ${record.control_id}`);
    fields(record.scope, ['id', 'label', 'version'], `${record.assessment_id}.scope`);
    requireThat(isObject(record.intended_state), `${record.assessment_id}: intended_state required`);
    oneOf(record.intended_state.status, ['approved', 'draft', 'not_defined', 'unknown'], 'intended_state.status');
    nullableText(record.intended_state.reference, 'intended_state.reference');
    oneOf(record.implementation_claim, ['present', 'partial', 'absent', 'unknown', 'not_applicable'], 'implementation_claim');
    oneOf(record.operating_effectiveness_claim, ['effective_for_tested_scope', 'partially_effective', 'ineffective', 'not_tested', 'unknown', 'not_applicable'], 'operating_effectiveness_claim');
    requireThat(isObject(record.applicability), 'applicability required');
    oneOf(record.applicability.status, ['applicable', 'unknown', 'not_applicable'], 'applicability.status');
    nullableText(record.applicability.rationale, 'applicability.rationale');
    requireThat(Number.isSafeInteger(record.max_evidence_age_days) && record.max_evidence_age_days >= 0 && record.max_evidence_age_days <= 36500, 'max_evidence_age_days: integer from 0 to 36500 required');
    uniqueTextArray(record.evidence_refs, 'evidence_refs');
    requireThat(isObject(record.exception), 'exception required');
    oneOf(record.exception.status, ['none', 'proposed', 'approved', 'expired'], 'exception.status');
    if (record.exception.status !== 'none') {
      fields(record.exception, ['owner_role', 'reason', 'scope_id', 'compensating_measures'], 'exception');
      nullableText(record.exception.expires_on, 'exception.expires_on');
      nullableText(record.exception.approval_reference, 'exception.approval_reference');
      if (record.exception.expires_on !== null) dateOnly(record.exception.expires_on, 'exception.expires_on');
    }
  }
  const evidence = new Set();
  for (const item of input.evidence) {
    fields(item, ['evidence_id', 'control_id', 'scope_id', 'scope_version', 'population', 'sample', 'limitations'], 'evidence');
    requireThat(!evidence.has(item.evidence_id), `Duplicate evidence_id: ${item.evidence_id}`);
    evidence.add(item.evidence_id);
    requireThat(knownControls.has(item.control_id), `Unknown evidence control_id: ${item.control_id}`);
    oneOf(item.kind, ['implementation', 'operating_test', 'scope_review'], 'evidence.kind');
    oneOf(item.result, ['supports_intended_state', 'contradicts_intended_state', 'inconclusive'], 'evidence.result');
    nullableText(item.observed_on, 'evidence.observed_on');
    nullableText(item.reviewer_role, 'evidence.reviewer_role');
    nullableText(item.private_reference, 'evidence.private_reference');
    if (item.observed_on !== null) dateOnly(item.observed_on, 'evidence.observed_on');
  }
}

function assessEvidence(item, record, asOfTime) {
  const issues = [];
  if (item.control_id !== record.control_id) issues.push('control_mismatch');
  if (item.scope_id !== record.scope.id) issues.push('scope_mismatch');
  if (item.scope_version !== record.scope.version) issues.push('scope_version_mismatch');
  let ageDays = null;
  if (item.observed_on === null) issues.push('missing_observation_date');
  else {
    ageDays = (asOfTime - dateOnly(item.observed_on, 'evidence.observed_on')) / DAY;
    if (ageDays < 0) issues.push('future_evidence');
    else if (ageDays > record.max_evidence_age_days) issues.push('stale_evidence');
  }
  if (item.reviewer_role === null) issues.push('missing_reviewer');
  if (item.private_reference === null) issues.push('missing_private_reference');
  return { ...item, age_days: ageDays, eligible_for_summary: issues.length === 0, issues };
}

function summarizeKind(items, kind) {
  const eligible = items.filter(item => item.kind === kind && item.eligible_for_summary);
  const positive = eligible.filter(item => item.result === 'supports_intended_state');
  const negative = eligible.filter(item => item.result === 'contradicts_intended_state');
  const unclear = eligible.filter(item => item.result === 'inconclusive');
  let state = 'no_usable_evidence';
  if (positive.length && negative.length) state = 'conflicting_results';
  else if (negative.length) state = 'adverse_result_recorded';
  else if (unclear.length) state = positive.length ? 'support_with_unresolved_results' : 'inconclusive';
  else if (positive.length) state = kind === 'operating_test' ? 'support_for_documented_sample' : 'support_recorded';
  return { state, usable_evidence_ids: eligible.map(item => item.evidence_id) };
}

const actions = {
  missing_evidence: 'Obtain the referenced record or correct the reference; retain the unknown state.',
  control_mismatch: 'Link evidence for this control; do not reuse a different control claim without review.',
  scope_mismatch: 'Obtain evidence for this service scope or formally change the assessment scope.',
  scope_version_mismatch: 'Reassess evidence after the scope change; do not silently relabel old evidence.',
  missing_observation_date: 'Establish when the observation occurred before relying on freshness.',
  future_evidence: 'Check the recorded date and clock; future observations cannot support this review date.',
  stale_evidence: 'Obtain a current observation or explicitly review the freshness requirement.',
  missing_reviewer: 'Assign a reviewer who can interpret the evidence and its limitations.',
  missing_private_reference: 'Record an access-controlled evidence reference; the tool does not fetch it.',
};

export function reviewInventory(input, asOf) {
  validateInventory(input, asOf);
  const asOfTime = dateOnly(asOf, 'as-of');
  const evidenceById = new Map(input.evidence.map(item => [item.evidence_id, item]));
  const referencedIds = new Set();
  const queue = [];
  const records = input.assessments.map(record => {
    const add = (code, nextAction, evidenceId = null) => queue.push({ assessment_id: record.assessment_id, control_id: record.control_id, scope_id: record.scope.id, owner_role: record.owner_role, code, evidence_id: evidenceId, next_action: nextAction });
    const evidence = record.evidence_refs.map(id => {
      referencedIds.add(id);
      const item = evidenceById.get(id);
      if (!item) {
        add('missing_evidence', actions.missing_evidence, id);
        return { evidence_id: id, eligible_for_summary: false, issues: ['missing_evidence'] };
      }
      const assessed = assessEvidence(item, record, asOfTime);
      for (const code of assessed.issues) add(code, actions[code], id);
      // An old or mismatched adverse record stays visible; this never declares it remediated.
      if (item.result === 'contradicts_intended_state' && !assessed.eligible_for_summary) add('excluded_adverse_record', 'Resolve or explicitly scope out the adverse record; exclusion for freshness or association is not remediation.', id);
      return assessed;
    });
    const implementation = summarizeKind(evidence, 'implementation');
    const operation = summarizeKind(evidence, 'operating_test');
    const applicability = summarizeKind(evidence, 'scope_review');

    if (record.intended_state.status !== 'approved') add('intended_state_not_approved', 'Have the decision owner define or approve the intended state and boundaries.');
    else if (record.intended_state.reference === null) add('missing_intended_state_reference', 'Link the approved requirement before relying on the recorded approval claim.');

    if (record.applicability.status === 'unknown') add('applicability_unknown', 'Determine the applicable service and population before concluding on coverage.');
    if (record.applicability.status === 'not_applicable') {
      if (record.applicability.rationale === null || applicability.state !== 'support_recorded') add('unsupported_inapplicability', 'Record the absence of applicable scope and a current scope review; missing capability is not inapplicability.');
      if (record.implementation_claim !== 'not_applicable' || record.operating_effectiveness_claim !== 'not_applicable') add('inconsistent_inapplicability_claims', 'Reconcile the applicability decision with the implementation and operating claims.');
      if (evidence.some(item => item.eligible_for_summary && ['implementation', 'operating_test'].includes(item.kind))) add('inapplicability_with_control_evidence', 'Review whether the control actually applies; current control evidence exists beside the inapplicability claim.');
    } else {
      if (record.implementation_claim === 'not_applicable' || record.operating_effectiveness_claim === 'not_applicable') add('inconsistent_inapplicability_claims', 'Document an inapplicability decision or use an applicable-state claim.');
      if (implementation.state === 'no_usable_evidence') add('implementation_evidence_gap', 'Obtain a current implementation observation for this scope; do not infer it from an operating claim.');
      if (operation.state === 'no_usable_evidence') add('operating_evidence_gap', 'Plan an authorized behavioral test; implementation evidence alone cannot establish operation.');
    }

    for (const [kind, summary] of [['implementation', implementation], ['operating', operation]]) {
      if (['conflicting_results', 'adverse_result_recorded', 'inconclusive', 'support_with_unresolved_results'].includes(summary.state)) add(`${kind}_${summary.state}`, 'Review the recorded results, limitations, and unresolved failures; preserve contrary evidence until disposition.');
    }
    if (record.implementation_claim === 'present' && implementation.state !== 'support_recorded') add('unsupported_implementation_claim', 'Reconcile the claimed implementation with the usable evidence; a claim alone is not support.');
    if (record.operating_effectiveness_claim === 'effective_for_tested_scope' && operation.state !== 'support_for_documented_sample') add('unsupported_effectiveness_claim', 'Revise or substantiate the operating claim with a current test for the stated sample and scope.');
    if (record.implementation_claim === 'absent' || record.implementation_claim === 'partial') add('recorded_implementation_gap', 'Review the reported gap and assign treatment or a scoped risk decision; positive evidence does not silently close it.');
    if (['ineffective', 'partially_effective'].includes(record.operating_effectiveness_claim)) add('recorded_operating_gap', 'Retain the reported operating gap until a reviewer resolves it using appropriate retest evidence.');
    if (record.implementation_claim === 'unknown') add('implementation_claim_unknown', 'Have a reviewer resolve the unknown implementation claim against the supplied evidence.');
    if (['unknown', 'not_tested'].includes(record.operating_effectiveness_claim)) add('operating_claim_unresolved', 'Have a reviewer decide the operating conclusion; supplied evidence does not automatically update the claim.');

    let exceptionState = record.exception.status;
    if (exceptionState !== 'none') {
      const expiry = record.exception.expires_on;
      const expiredByDate = expiry !== null && dateOnly(expiry, 'exception.expires_on') < asOfTime;
      if (record.exception.scope_id !== record.scope.id) add('exception_scope_mismatch', 'Obtain a decision for the assessed scope; a different scope exception does not apply.');
      if (exceptionState === 'approved' && (expiry === null || record.exception.approval_reference === null)) {
        exceptionState = 'incomplete_approval_record';
        add('exception_approval_incomplete', 'Establish approval evidence and expiry; the recorded approval is incomplete.');
      }
      if (record.exception.status === 'expired' || expiredByDate) {
        exceptionState = 'expired';
        add('exception_expired', 'Escalate removal or a new explicit risk decision; do not extend the exception automatically.');
      }
      if (record.exception.status === 'proposed') add('exception_not_approved', 'Obtain an authorized decision; a proposal does not approve a deviation.');
      if (exceptionState === 'approved') add('exception_active', 'Review the approved deviation and compensating measures with its risk owner; underlying gaps remain visible.');
    }

    return {
      assessment_id: record.assessment_id,
      control_id: record.control_id,
      scope: record.scope,
      owner_role: record.owner_role,
      max_evidence_age_days: record.max_evidence_age_days,
      intended_state: record.intended_state,
      applicability: record.applicability,
      implementation_claim: record.implementation_claim,
      operating_effectiveness_claim: record.operating_effectiveness_claim,
      implementation_evidence: implementation,
      operating_evidence: operation,
      scope_evidence: applicability,
      exception: { ...record.exception, reviewed_state: exceptionState },
      evidence,
      review_required: queue.some(item => item.assessment_id === record.assessment_id),
    };
  });
  const unlinked = input.evidence.filter(item => !referencedIds.has(item.evidence_id)).map(item => item.evidence_id);
  return {
    schema_version: 1,
    as_of: asOf,
    fictional: input.fictional,
    assurance_limit: 'Reviews supplied metadata only. Evidence contents, scope completeness, approval authority, tenant state, and actual control effectiveness are not verified.',
    summary: { assessments: records.length, assessments_requiring_review: records.filter(item => item.review_required).length, review_items: queue.length, unlinked_evidence_records: unlinked.length },
    assessments: records,
    review_queue: queue,
    unlinked_evidence_ids: unlinked,
  };
}

const clean = value => String(value).replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ');
export function renderText(report) {
  const lines = [
    `Control evidence review | ${report.as_of} | ${report.fictional ? 'FICTIONAL INPUT' : 'USER-SUPPLIED INPUT'}`,
    report.assurance_limit,
    `${report.summary.assessments} assessments; ${report.summary.assessments_requiring_review} require review; ${report.summary.review_items} review items.`,
    '',
  ];
  for (const record of report.assessments) {
    lines.push(`${record.assessment_id} / ${record.control_id} / ${record.scope.label} (${record.scope.version})`);
    lines.push(`  Intended: ${record.intended_state.status}; applicability: ${record.applicability.status}`);
    lines.push(`  Implementation claim: ${record.implementation_claim}; evidence: ${record.implementation_evidence.state}`);
    lines.push(`  Operating claim: ${record.operating_effectiveness_claim}; evidence: ${record.operating_evidence.state}`);
    lines.push(`  Exception: ${record.exception.reviewed_state}; evidence age limit: ${record.max_evidence_age_days} days (supplied choice)`);
    for (const item of record.evidence) {
      lines.push(`  Evidence ${item.evidence_id}: ${item.eligible_for_summary ? 'eligible metadata' : item.issues.join(', ')}${item.result ? `; ${item.kind}; ${item.result}` : ''}`);
      if (item.sample) lines.push(`    Sample: ${item.sample}; limits: ${item.limitations}`);
    }
    const tasks = report.review_queue.filter(item => item.assessment_id === record.assessment_id);
    for (const task of tasks) lines.push(`  REVIEW ${task.code}${task.evidence_id ? ` [${task.evidence_id}]` : ''}: ${task.next_action} Owner: ${task.owner_role}`);
    if (tasks.length === 0) lines.push('  No metadata review issues identified; a human still needs to interpret the actual evidence.');
    lines.push('');
  }
  if (report.unlinked_evidence_ids.length) lines.push(`Unlinked evidence (not counted toward an assessment): ${report.unlinked_evidence_ids.join(', ')}`);
  return lines.map(clean).join('\n') + '\n';
}

const HELP = 'Usage: node review.mjs --input inventory.json --as-of YYYY-MM-DD [--format text|json]\nOffline metadata review only; reads a local JSON file and writes the report to stdout.\n';
export function runCli(argv) {
  if (argv.length === 1 && argv[0] === '--help') return HELP;
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    requireThat(['--input', '--as-of', '--format'].includes(key), `Unknown argument: ${key}`);
    requireThat(!Object.hasOwn(options, key), `Duplicate argument: ${key}`);
    requireThat(isText(argv[i + 1]) && !argv[i + 1].startsWith('--'), `Missing value for ${key}`);
    options[key] = argv[i + 1];
  }
  requireThat(isText(options['--input']) && isText(options['--as-of']), HELP.trim());
  const format = options['--format'] ?? 'text';
  oneOf(format, ['text', 'json'], '--format');
  const input = JSON.parse(readFileSync(options['--input'], 'utf8'));
  const report = reviewInventory(input, options['--as-of']);
  return format === 'json' ? JSON.stringify(report, null, 2) + '\n' : renderText(report);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.stdout.write(runCli(process.argv.slice(2))); }
  catch (error) { process.stderr.write(`Review failed: ${clean(error.message)}\n`); process.exitCode = 1; }
}
