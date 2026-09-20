#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const DAY = 86400000;
// Official vendor documentation hosts accepted as control sources. Marketing, blog, and community hosts are deliberately excluded.
export const OFFICIAL_DOC_HOSTS = ['knowledge.workspace.google.com', 'support.google.com', 'cloud.google.com', 'docs.cloud.google.com', 'learn.microsoft.com', 'developers.cloudflare.com', 'docs.aws.amazon.com', 'docs.github.com'];
const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const boolOrNull = value => typeof value === 'boolean' || value === null;
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}
function dateOnly(value, label) {
  requireThat(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value), `${label} must be YYYY-MM-DD`);
  const n = Date.parse(`${value}T00:00:00Z`);
  requireThat(Number.isFinite(n) && new Date(n).toISOString().slice(0, 10) === value, `${label} is not a real date`);
  return n;
}
function timestamp(value, label) {
  requireThat(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value), `${label} must be a UTC timestamp with seconds`);
  const n = Date.parse(value);
  requireThat(Number.isFinite(n) && new Date(n).toISOString() === value.replace('Z', '.000Z'), `${label} is not a real timestamp`);
  return n;
}

export function validateInputs(baseline, observed) {
  requireThat(object(baseline) && baseline.schema_version === 1, 'Unsupported baseline schema');
  requireThat(text(baseline.id) && text(baseline.version), 'Baseline id and version are required');
  requireThat(Array.isArray(baseline.controls) && baseline.controls.length > 0, 'Baseline must contain controls');
  const ids = new Set();
  for (const control of baseline.controls) {
    requireThat(object(control) && text(control.id), 'Each control needs an id');
    requireThat(!ids.has(control.id), `Duplicate control: ${control.id}`);
    ids.add(control.id);
    requireThat(text(control.title) && text(control.assertion), `${control.id}: title and assertion required`);
    requireThat(control.value_type === 'boolean' && typeof control.target === 'boolean', `${control.id}: only boolean targets are supported`);
    requireThat(Number.isInteger(control.max_evidence_age_days) && control.max_evidence_age_days >= 1, `${control.id}: positive evidence age required`);
    requireThat(Array.isArray(control.implementation_modes) && control.implementation_modes.length > 0 && control.implementation_modes.every(v => ['native', 'manual'].includes(v)), `${control.id}: invalid implementation modes`);
    requireThat(Array.isArray(control.sources) && control.sources.length > 0, `${control.id}: sources required`);
    for (const source of control.sources) {
      requireThat(object(source) && text(source.title) && text(source.url), `${control.id}: invalid source`);
      const url = new URL(source.url);
      requireThat(url.protocol === 'https:' && OFFICIAL_DOC_HOSTS.includes(url.hostname), `${control.id}: source must be an official vendor HTTPS reference`);
      dateOnly(source.reviewed_on, `${control.id}: source reviewed_on`);
    }
  }
  requireThat(object(observed) && observed.schema_version === 1, 'Unsupported observations schema');
  requireThat(observed.baseline_id === baseline.id && observed.baseline_version === baseline.version, 'Observation baseline id/version mismatch');
  requireThat(typeof observed.fictional === 'boolean', 'Observations must explicitly identify fictional status');
  requireThat(object(observed.environment) && text(observed.environment.scope), 'Observation environment scope is required');
  requireThat(Array.isArray(observed.observations), 'Observations must be an array');
  const seen = new Set();
  for (const entry of observed.observations) {
    requireThat(object(entry) && ids.has(entry.id), `Unknown observation control: ${entry?.id}`);
    requireThat(!seen.has(entry.id), `Duplicate observation: ${entry.id}`);
    seen.add(entry.id);
    requireThat(boolOrNull(entry.applicable) && boolOrNull(entry.value), `${entry.id}: applicable and value must be boolean or null`);
    requireThat(['native', 'manual', 'unsupported', 'unknown'].includes(entry.implementation), `${entry.id}: invalid implementation`);
    requireThat(typeof entry.scope_complete === 'boolean', `${entry.id}: scope_complete must be boolean`);
    for (const key of ['reviewer', 'evidence_ref', 'observed_at']) {
      requireThat(entry[key] === null || text(entry[key]), `${entry.id}: ${key} must be nonempty text or null`);
    }
    if (entry.observed_at !== null) timestamp(entry.observed_at, `${entry.id}: observed_at`);
    if (entry.exception !== undefined) {
      requireThat(object(entry.exception), `${entry.id}: invalid exception`);
      for (const key of ['owner', 'reason', 'compensating_control']) requireThat(text(entry.exception[key]), `${entry.id}: exception ${key} required`);
      dateOnly(entry.exception.expires_on, `${entry.id}: exception expires_on`);
    }
  }
}

export function assess(baseline, observed, { asOf } = {}) {
  const reviewDay = dateOnly(asOf, 'asOf');
  // Assess the complete UTC calendar day, so same-day evidence is accepted.
  const endOfReviewDay = reviewDay + DAY - 1;
  validateInputs(baseline, observed);
  const entries = new Map(observed.observations.map(entry => [entry.id, entry]));
  const results = baseline.controls.map(control => {
    const entry = entries.get(control.id);
    const reasons = [];
    let status = 'unknown';
    if (!entry) {
      reasons.push('No observation supplied');
    } else {
      if (entry.applicable === null) reasons.push('Applicability not established');
      if (!entry.scope_complete) reasons.push('Evidence does not cover the complete declared scope');
      if (!text(entry.reviewer) || !text(entry.evidence_ref) || !text(entry.observed_at)) reasons.push('Reviewer, evidence reference, or observation date missing');
      if (entry.observed_at !== null) {
        const observedTime = timestamp(entry.observed_at, `${entry.id}: observed_at`);
        if (observedTime > endOfReviewDay) reasons.push('Evidence is later than the review date');
        if (reviewDay - observedTime > control.max_evidence_age_days * DAY) reasons.push('Evidence is older than the accepted review window');
      }
      if (entry.applicable === false) {
        if (!text(entry.not_applicable_reason)) reasons.push('Not-applicable reason missing');
        if (reasons.length === 0) {
          status = 'not_applicable';
          reasons.push(entry.not_applicable_reason);
        }
      } else if (entry.applicable === true) {
        if (!control.implementation_modes.includes(entry.implementation)) reasons.push('Implementation capability is unsupported or not established for this control');
        if (entry.value === null) reasons.push('Observed value is unknown');
        if (reasons.length === 0) {
          status = entry.value === control.target ? 'aligned' : 'gap';
          reasons.push(status === 'aligned' ? 'Fresh complete reviewer assertion matches target; evidence not independently verified' : 'Reviewer assertion does not meet the target');
        }
      }
    }
    const exception = entry?.exception ? {
      ...entry.exception,
      state: dateOnly(entry.exception.expires_on, 'expires_on') < reviewDay ? 'expired' : 'active',
    } : null;
    return {
      id: control.id,
      title: control.title,
      status,
      reasons,
      target: control.target,
      observed_value: entry?.value ?? null,
      evidence_ref: entry?.evidence_ref ?? null,
      exception,
    };
  });
  const counts = { aligned: 0, gap: 0, unknown: 0, not_applicable: 0 };
  for (const result of results) counts[result.status] += 1;
  return {
    baseline_id: baseline.id,
    baseline_version: baseline.version,
    as_of: asOf,
    fictional: observed.fictional,
    scope: observed.environment.scope,
    method: 'Local comparison of reviewer assertions; no tenant access or independent evidence verification',
    counts,
    results,
  };
}

export function formatText(report) {
  const lines = [
    `${report.baseline_id} v${report.baseline_version} | ${report.as_of}`,
    report.fictional ? 'FICTIONAL TRAINING ASSESSMENT' : 'REVIEWER-SUPPLIED ASSESSMENT; NOT INDEPENDENTLY VERIFIED',
    report.method,
    Object.entries(report.counts).map(([name, count]) => `${name}: ${count}`).join(' | '),
    '',
  ];
  for (const item of report.results) {
    lines.push(`${item.id} ${item.status.toUpperCase()} — ${item.title}`);
    lines.push(`  ${item.reasons.join('; ')}`);
    if (item.exception) lines.push(`  Exception ${item.exception.state}, expires ${item.exception.expires_on}; status remains ${item.status}`);
  }
  return `${lines.join('\n')}\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    requireThat(args.length === 4 || args.length === 5, 'Usage: assess.mjs BASELINE.json OBSERVATIONS.json --as-of YYYY-MM-DD [--json]');
    requireThat(args[2] === '--as-of' && (args.length === 4 || args[4] === '--json'), 'Expected --as-of YYYY-MM-DD and optional --json');
    const report = assess(JSON.parse(readFileSync(args[0], 'utf8')), JSON.parse(readFileSync(args[1], 'utf8')), { asOf: args[3] });
    process.stdout.write(args[4] === '--json' ? `${JSON.stringify(report, null, 2)}\n` : formatText(report));
  } catch (error) {
    process.stderr.write(`Assessment failed: ${error.message}\n`);
    process.exitCode = 2;
  }
}
