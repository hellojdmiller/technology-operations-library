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
  errorsForRows(input.changes, 'changes', 'requestId', (r, p, e) => {
    if (!['standard', 'normal', 'emergency'].includes(r.changeType)) e.push(`${p}.changeType is invalid.`);
    for (const f of ['scopeConfirmed', 'authorizationVerified', 'windowConfirmed', 'standardModelMatch']) if (!tri(r[f])) e.push(`${p}.${f} must be boolean or null.`);
    for (const f of ['scopeEvidenceRef', 'authorizationEvidenceRef', 'pilotEvidenceRef', 'recoveryPlanRef', 'verificationPlanRef', 'standardModelRef']) if (!ref(r[f])) e.push(`${p}.${f} must be string or null.`);
    if (r.standardModelValidUntil !== null && stamp(r.standardModelValidUntil) === null) e.push(`${p}.standardModelValidUntil must be a UTC timestamp or null.`);
  }, errors);
  if (errors.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues: errors }, pairedItem: { item: index } };
  const issues = [];
  if (!input.snapshotComplete) issues.push('Snapshot is incomplete; reconcile scope before relying on the review.');
  if (!text(input.evidenceRef)) issues.push('Source evidence reference is missing.');
  if (!input.changes.length) issues.push('Empty change scope requires confirmation.');
  const rows = input.changes.map(r => {
    const findings = [];
    for (const f of ['scopeConfirmed', 'authorizationVerified', 'windowConfirmed']) if (r[f] !== true) findings.push(`${f}_not_confirmed`);
    for (const f of ['scopeEvidenceRef', 'authorizationEvidenceRef', 'pilotEvidenceRef', 'recoveryPlanRef', 'verificationPlanRef']) if (!text(r[f])) findings.push(`${f}_missing`);
    if (r.changeType === 'standard') {
      if (r.standardModelMatch !== true) findings.push('standard_model_not_matched');
      if (!text(r.standardModelRef)) findings.push('standard_model_reference_missing');
      if (r.standardModelValidUntil === null) findings.push('standard_model_validity_unknown');
      else if (stamp(r.standardModelValidUntil) <= asOf) findings.push('standard_model_expired');
    }
    if (r.changeType === 'emergency') findings.push('manual_emergency_review');
    return { requestId: r.requestId, changeType: r.changeType, findings,
      status: r.changeType === 'emergency' ? 'manual_emergency_review' : findings.length ? 'needs_review' : 'packet_complete_for_review',
      decision: 'pending_human_review' };
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
