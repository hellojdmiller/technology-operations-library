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
  errorsForRows(input.inventory, 'inventory', 'assetId', (r, p, e) => {
    if (!['assigned', 'stock', 'repair', 'retired'].includes(r.lifecycle)) e.push(`${p}.lifecycle is invalid.`);
    if (!ref(r.ownerRole) || !ref(r.custodianId)) e.push(`${p} ownerRole/custodianId must be string or null.`);
    if (typeof r.requiresManagement !== 'boolean') e.push(`${p}.requiresManagement must be boolean.`);
  }, errors);
  errorsForRows(input.observations, 'observations', 'assetId', (r, p, e) => {
    for (const f of ['managementObservedAt', 'custodyObservedAt']) if (r[f] !== null && (stamp(r[f]) === null || stamp(r[f]) > asOf)) e.push(`${p}.${f} must be null or a real UTC timestamp no later than asOf.`);
    if (!tri(r.managed)) e.push(`${p}.managed must be boolean or null.`);
    for (const f of ['custodianId', 'managementEvidenceRef', 'custodyEvidenceRef']) if (!ref(r[f])) e.push(`${p}.${f} must be string or null.`);
  }, errors);
  if (errors.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues: errors }, pairedItem: { item: index } };
  const issues = [];
  if (!input.snapshotComplete) issues.push('Snapshot is incomplete; reconcile scope before relying on the review.');
  if (!text(input.evidenceRef)) issues.push('Source evidence reference is missing.');
  if (!input.inventory.length) issues.push('Empty inventory scope requires confirmation.');
  const inv = new Map(input.inventory.map(r => [r.assetId, r]));
  const obs = new Map(input.observations.map(r => [r.assetId, r]));
  const ids = [...new Set([...inv.keys(), ...obs.keys()])];
  const rows = ids.map(assetId => {
    const r = inv.get(assetId), o = obs.get(assetId), findings = [];
    const managementAgeDays = o?.managementObservedAt ? (asOf - stamp(o.managementObservedAt)) / 86400000 : null;
    const custodyAgeDays = o?.custodyObservedAt ? (asOf - stamp(o.custodyObservedAt)) / 86400000 : null;
    if (!r) findings.push('observation_not_in_inventory');
    if (!o) findings.push('observation_missing');
    if (r && !text(r.ownerRole)) findings.push('asset_owner_missing');
    if (r?.lifecycle === 'assigned' && !text(r.custodianId)) findings.push('assigned_custodian_unknown');
    if (o) {
      if (r?.requiresManagement || !r) {
        if (managementAgeDays === null) findings.push('management_observation_missing');
        else if (managementAgeDays > input.maxAgeDays) findings.push('management_observation_stale');
        if (!text(o.managementEvidenceRef)) findings.push('management_evidence_missing');
      }
      if (r?.lifecycle !== 'retired') {
        if (custodyAgeDays === null) findings.push('custody_observation_missing');
        else if (custodyAgeDays > input.maxAgeDays) findings.push('custody_observation_stale');
        if (!text(o.custodyEvidenceRef)) findings.push('custody_evidence_missing');
      }
      if (r?.requiresManagement && o.managed !== true) findings.push('required_management_unconfirmed');
      if (r?.lifecycle === 'assigned' && !text(o.custodianId)) findings.push('observed_custodian_unknown');
      if (r && text(r.custodianId) && text(o.custodianId) && r.custodianId !== o.custodianId) findings.push('custodian_mismatch');
      if (r && !text(r.custodianId) && text(o.custodianId)) findings.push('unexpected_custodian');
      if (r?.lifecycle === 'retired') findings.push('retired_asset_has_observation');
    }
    return { assetId, lifecycle: r?.lifecycle ?? null, managementAgeDays, custodyAgeDays,
      findings, status: findings.length ? 'needs_review' : 'supplied_records_consistent', decision: 'pending_human_review' };
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
