// n8n Code node: Run Once for All Items. Reminds control owners about stale, missing, or expiring baseline evidence; never assesses alignment or verifies evidence.
const items = $input.all();
const DAY = 86400000;
const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const boolOrNull = value => typeof value === 'boolean' || value === null;
const unique = values => new Set(values).size === values.length;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const timestamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return null;
  const valueMs = Date.parse(value);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString() === value.replace('Z', '.000Z') ? valueMs : null;
};
const IMPLEMENTATIONS = ['native', 'manual', 'unsupported', 'unknown'];
const EXCEPTION_REMINDERS = ['exception_expiring_soon', 'exception_expired'];
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No baseline evidence packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  if (!Number.isInteger(input.exceptionWarningDays) || input.exceptionWarningDays < 0) issues.push('exceptionWarningDays must be a non-negative integer.');
  const baseline = input.baseline;
  const controlIds = new Set();
  if (!object(baseline) || !text(baseline.id) || !text(baseline.version) || !Array.isArray(baseline.controls) || !baseline.controls.length) issues.push('baseline needs id, version, and a nonempty controls array.');
  else {
    if (!unique(baseline.controls.map(control => control?.id))) issues.push('Duplicate baseline control ids make matching ambiguous.');
    for (const [row, control] of baseline.controls.entries()) {
      if (!object(control) || !text(control.id) || !text(control.title) || !text(control.category)) { issues.push(`baseline.controls[${row}] needs id, title, and category.`); continue; }
      if (!Number.isInteger(control.max_evidence_age_days) || control.max_evidence_age_days < 1) issues.push(`baseline.controls[${row}].max_evidence_age_days must be a positive integer.`);
      controlIds.add(control.id);
    }
  }
  if (!Array.isArray(input.controlOwners)) issues.push('controlOwners must be an array.');
  else {
    if (!unique(input.controlOwners.map(owner => owner?.controlId))) issues.push('Duplicate controlOwners rows make ownership ambiguous.');
    for (const [row, owner] of input.controlOwners.entries()) {
      if (!object(owner) || !text(owner.controlId) || !text(owner.ownerRole)) issues.push(`controlOwners[${row}] needs controlId and ownerRole.`);
      else if (controlIds.size && !controlIds.has(owner.controlId)) issues.push(`controlOwners[${row}] names unknown control ${owner.controlId}.`);
    }
  }
  const observed = input.observations;
  if (!object(observed)) issues.push('observations must be an object in the baselines observation schema.');
  else {
    if (observed.schema_version !== 1) issues.push('observations.schema_version must be 1.');
    if (object(baseline) && (observed.baseline_id !== baseline.id || observed.baseline_version !== baseline.version)) issues.push('observations baseline_id/baseline_version must match the embedded baseline.');
    if (typeof observed.fictional !== 'boolean') issues.push('observations.fictional must be a boolean.');
    if (!object(observed.environment) || !text(observed.environment.scope)) issues.push('observations.environment.scope must be nonblank text.');
    if (!Array.isArray(observed.observations)) issues.push('observations.observations must be an array.');
    else {
      if (!unique(observed.observations.map(entry => entry?.id))) issues.push('Duplicate observation ids make matching ambiguous.');
      for (const [row, entry] of observed.observations.entries()) {
        if (!object(entry) || !text(entry.id)) { issues.push(`observations[${row}] needs an id.`); continue; }
        if (controlIds.size && !controlIds.has(entry.id)) issues.push(`observations[${row}] names unknown control ${entry.id}.`);
        if (!boolOrNull(entry.applicable) || !boolOrNull(entry.value)) issues.push(`${entry.id}: applicable and value must be boolean or null.`);
        if (!IMPLEMENTATIONS.includes(entry.implementation)) issues.push(`${entry.id}: implementation must be native, manual, unsupported, or unknown.`);
        if (typeof entry.scope_complete !== 'boolean') issues.push(`${entry.id}: scope_complete must be a boolean.`);
        for (const key of ['reviewer', 'evidence_ref', 'observed_at']) if (entry[key] !== null && !text(entry[key])) issues.push(`${entry.id}: ${key} must be nonblank text or null.`);
        if (text(entry.observed_at) && timestamp(entry.observed_at) === null) issues.push(`${entry.id}: observed_at must be a real UTC timestamp YYYY-MM-DDTHH:MM:SSZ.`);
        if (entry.exception !== undefined) {
          if (!object(entry.exception)) { issues.push(`${entry.id}: exception must be an object.`); continue; }
          for (const key of ['owner', 'reason', 'compensating_control']) if (!text(entry.exception[key])) issues.push(`${entry.id}: exception ${key} must be nonblank text.`);
          if (date(entry.exception.expires_on) === null) issues.push(`${entry.id}: exception expires_on must be a real YYYY-MM-DD date.`);
        }
      }
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Observation snapshot is incomplete; reconcile it with the evidence store before relying on reminders.');
  if (!text(input.evidenceRef)) issues.push('Missing observations document evidence reference.');
  const endOfReviewDay = asOf + DAY - 1;
  const owners = new Map(input.controlOwners.map(owner => [owner.controlId, owner.ownerRole]));
  const entries = new Map(observed.observations.map(entry => [entry.id, entry]));
  const rows = baseline.controls.map(control => {
    const entry = entries.get(control.id);
    const reminders = [];
    const ownerRole = owners.get(control.id) ?? null;
    let freshness = 'fresh';
    let evidenceAgeDays = null;
    if (!entry) { freshness = 'missing_observation'; reminders.push('observation_missing'); }
    else if (entry.observed_at === null) { freshness = 'missing_observation_date'; reminders.push('observation_date_missing'); }
    else {
      const observedTime = timestamp(entry.observed_at);
      evidenceAgeDays = Math.floor((asOf - observedTime) / DAY);
      if (observedTime > endOfReviewDay) { freshness = 'future_dated'; reminders.push('evidence_future_dated'); }
      else if (asOf - observedTime > control.max_evidence_age_days * DAY) { freshness = 'stale'; reminders.push('evidence_stale'); }
    }
    const evidenceReference = entry && text(entry.evidence_ref) ? 'present' : 'missing';
    if (entry && evidenceReference === 'missing') reminders.push('evidence_reference_missing');
    const scopeComplete = entry ? entry.scope_complete : null;
    if (scopeComplete === false) reminders.push('scope_incomplete');
    let exception = null;
    if (entry?.exception) {
      const expiresDay = date(entry.exception.expires_on);
      const state = expiresDay < asOf ? 'expired' : 'active';
      const daysToExpiry = Math.round((expiresDay - asOf) / DAY);
      const expiringSoon = state === 'active' && daysToExpiry <= input.exceptionWarningDays;
      exception = { owner: entry.exception.owner, expires_on: entry.exception.expires_on, state, daysToExpiry, expiringSoon };
      if (state === 'expired') reminders.push('exception_expired');
      else if (expiringSoon) reminders.push('exception_expiring_soon');
    }
    if (ownerRole === null) reminders.push('owner_unassigned');
    // Lower bound on what assess.mjs would report as unknown; it never claims alignment.
    const wouldBeUnknown = freshness !== 'fresh' || evidenceReference === 'missing' || scopeComplete === false
      || entry.applicable === null || (entry.applicable === true && entry.value === null)
      || (entry.applicable === true && ['unsupported', 'unknown'].includes(entry.implementation));
    return {
      controlId: control.id, title: control.title, category: control.category, ownerRole,
      maxEvidenceAgeDays: control.max_evidence_age_days, observedAt: entry?.observed_at ?? null, evidenceAgeDays,
      evidenceRef: evidenceReference === 'present' ? entry.evidence_ref : null,
      freshness, evidenceReference, scopeComplete, exception, reminders,
      assessStatusHint: wouldBeUnknown ? 'would_be_unknown' : 'evaluable'
    };
  });
  const groups = new Map();
  for (const row of rows) {
    if (!row.reminders.length) continue;
    const dueBy = row.reminders.every(reason => reason === 'exception_expiring_soon') ? row.exception.expires_on : input.asOf;
    const key = row.ownerRole ?? '';
    if (!groups.has(key)) groups.set(key, { ownerRole: row.ownerRole, controlCount: 0, reminderCount: 0, controls: [] });
    const group = groups.get(key);
    group.controlCount += 1;
    group.reminderCount += row.reminders.length;
    group.controls.push({ controlId: row.controlId, title: row.title, reminders: row.reminders, dueBy });
  }
  const remindersByOwner = [...groups.values()].sort((a, b) => a.ownerRole === null ? 1 : b.ownerRole === null ? -1 : a.ownerRole < b.ownerRole ? -1 : a.ownerRole > b.ownerRole ? 1 : 0);
  const count = predicate => rows.filter(predicate).length;
  const counts = {
    controls: rows.length,
    observed: count(row => row.freshness !== 'missing_observation'),
    fresh: count(row => row.freshness === 'fresh'),
    stale: count(row => row.freshness === 'stale'),
    missingObservation: count(row => row.freshness === 'missing_observation'),
    missingObservationDate: count(row => row.freshness === 'missing_observation_date'),
    missingEvidenceReference: count(row => row.reminders.includes('evidence_reference_missing')),
    futureDated: count(row => row.freshness === 'future_dated'),
    scopeIncomplete: count(row => row.scopeComplete === false),
    exceptionsActive: count(row => row.exception?.state === 'active'),
    exceptionsExpiringSoon: count(row => row.exception?.expiringSoon === true),
    exceptionsExpired: count(row => row.exception?.state === 'expired'),
    ownerUnassigned: count(row => row.ownerRole === null),
    remindersTotal: rows.reduce((sum, row) => sum + row.reminders.length, 0)
  };
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, baselineId: baseline.id, baselineVersion: baseline.version,
      fictional: observed.fictional, scope: observed.environment.scope,
      status: issues.length || counts.remindersTotal ? 'needs_review' : 'review_ready',
      issues, counts, rows, remindersByOwner,
      evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Reports evidence age, missing references, and exception expiry from reviewer-recorded observations only. It does not recompute aligned, gap, or not_applicable results, inspect any tenant, open evidence references, or verify that evidence supports the assertion. Ages use whole UTC days against the asOf date; the evidence window and warning period are local cadence choices, not vendor or regulatory requirements.'
    }, pairedItem: { item: index }
  };
});
