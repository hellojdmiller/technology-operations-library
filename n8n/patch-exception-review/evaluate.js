// n8n Code node: Run Once for All Items. Review supplied metadata only; no external actions.
const items = $input.all();
const text = v => typeof v === 'string' && v.trim().length > 0;
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const tri = v => v === true || v === false || v === null;
const ref = v => v === null || typeof v === 'string';
const stamp = v => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v)) return null;
  const n = Date.parse(v);
  return Number.isFinite(n) && new Date(n).toISOString() === (v.includes('.') ? v : v.replace('Z', '.000Z')) ? n : null;
};
const errorsForRows = (rows, name, id, validate, errors) => {
  if (!Array.isArray(rows)) { errors.push(`${name} must be an array.`); return; }
  const seen = new Set();
  rows.forEach((r, i) => {
    if (!object(r) || !text(r[id])) { errors.push(`${name}[${i}] requires ${id}.`); return; }
    if (seen.has(r[id])) errors.push(`Duplicate ${id} in ${name}: ${r[id]}.`);
    seen.add(r[id]);
    validate(r, `${name}[${i}]`, errors);
  });
};
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No review packets supplied.'] } }];
return items.map((item, index) => {
  const input = object(item.json) ? item.json : {};
  const errors = [];
  const asOf = stamp(input.asOf);
  if (!text(input.reviewId)) errors.push('reviewId must be nonblank.');
  if (asOf === null) errors.push('asOf must be a real UTC timestamp ending in Z.');
  if (typeof input.snapshotComplete !== 'boolean') errors.push('snapshotComplete must be boolean.');
  if (!ref(input.evidenceRef)) errors.push('evidenceRef must be string or null.');
  if (!Number.isFinite(input.maxAgeDays) || input.maxAgeDays <= 0) errors.push('maxAgeDays must be a positive number.');
  errorsForRows(input.findings, 'findings', 'findingId', (r, p, e) => {
    if (!text(r.assetId) || !ref(r.ownerRole)) e.push(`${p} needs assetId and string/null ownerRole.`);
    if (!['affected', 'not_affected', 'unknown'].includes(r.applicability)) e.push(`${p}.applicability is invalid.`);
    if (!ref(r.applicabilityEvidenceRef) || !tri(r.exploited)) e.push(`${p} applicability evidence or exploitation flag is invalid.`);
    if (r.dueAt !== null && stamp(r.dueAt) === null) e.push(`${p}.dueAt must be a UTC timestamp or null.`);
    const o = r.observation;
    if (!object(o) || !['vulnerable', 'fixed', 'unknown'].includes(o.state) || !ref(o.evidenceRef)) e.push(`${p}.observation is invalid.`);
    else if (o.observedAt !== null && (stamp(o.observedAt) === null || stamp(o.observedAt) > asOf)) e.push(`${p}.observation.observedAt is invalid or future.`);
    const x = r.exception;
    if (x !== null) {
      if (!object(x) || !tri(x.approvalVerified) || !tri(x.scopeConfirmed) || !ref(x.approvalRef) || !ref(x.mitigationEvidenceRef)) e.push(`${p}.exception is invalid.`);
      else if (stamp(x.effectiveAt) === null || stamp(x.expiresAt) === null || stamp(x.expiresAt) <= stamp(x.effectiveAt)) e.push(`${p}.exception dates must form a valid nonempty UTC interval.`);
    }
  }, errors);
  if (errors.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues: errors }, pairedItem: { item: index } };
  const issues = [];
  if (!input.snapshotComplete) issues.push('Snapshot is incomplete; reconcile scope before relying on the review.');
  if (!text(input.evidenceRef)) issues.push('Source evidence reference is missing.');
  if (!input.findings.length) issues.push('Empty finding scope requires confirmation.');
  const rows = input.findings.map(r => {
    const findings = [], o = r.observation, x = r.exception;
    const ageDays = o.observedAt === null ? null : (asOf - stamp(o.observedAt)) / 86400000;
    const fresh = ageDays !== null && ageDays <= input.maxAgeDays && text(o.evidenceRef);
    const scopeSupported = text(r.applicabilityEvidenceRef);
    let exceptionState = 'none';
    if (!text(r.ownerRole)) findings.push('remediation_owner_missing');
    if (!scopeSupported) findings.push('applicability_evidence_missing');
    if (r.applicability === 'unknown') findings.push('applicability_unknown');
    if (r.exploited === null) findings.push('exploitation_status_unknown');
    if (r.exploited === true) findings.push('exploitation_assessment_required');
    if (ageDays === null) findings.push('observation_time_unknown');
    else if (!fresh) findings.push('observation_stale_or_unsupported');
    if (!text(o.evidenceRef)) findings.push('observation_evidence_missing');
    if (r.applicability === 'not_affected' && o.state === 'vulnerable') findings.push('contradictory_applicability_and_observation');
    const unresolved = !(scopeSupported && fresh && ((r.applicability === 'affected' && o.state === 'fixed') || (r.applicability === 'not_affected' && o.state !== 'vulnerable')));
    if (unresolved) {
      if (r.dueAt === null) findings.push('remediation_target_missing');
      else if (stamp(r.dueAt) < asOf) findings.push('remediation_overdue');
      else if (stamp(r.dueAt) === asOf) findings.push('remediation_due_now');
      findings.push('remediation_or_applicability_review_open');
    }
    if (x) {
      exceptionState = x.approvalVerified === true && x.scopeConfirmed === true && text(x.approvalRef) && text(x.mitigationEvidenceRef) && stamp(x.effectiveAt) <= asOf && stamp(x.expiresAt) > asOf ? 'documented_exception_for_review' : 'unsupported_or_expired_exception';
      findings.push(exceptionState);
    }
    return { findingId: r.findingId, assetId: r.assetId, findings, exceptionState,
      observationAgeDays: ageDays, targetDatePassed: r.dueAt !== null && stamp(r.dueAt) < asOf,
      status: findings.length ? 'needs_review' : 'supplied_evidence_ready', decision: 'pending_human_review' };
  });
  const attentionCount = rows.filter(r => r.findings.length).length;
  return { json: {
    reviewId: input.reviewId, asOf: input.asOf,
    status: issues.length || attentionCount ? 'needs_review' : 'review_ready',
    totalRows: rows.length, attentionCount, issues, rows,
    evidenceRef: input.evidenceRef,
    limitation: 'Supplied metadata and evidence pointers are not independently verified. This review neither authorizes nor performs any operational action.'
  }, pairedItem: { item: index } };
});
