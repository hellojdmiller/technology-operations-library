// n8n Code node: Run Once for All Items. Prepares review; never changes access.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const duplicates = values => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No review packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (!Number.isInteger(input.dormantDays) || input.dormantDays < 1) issues.push('dormantDays must be a positive integer.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  for (const field of ['workforce', 'grants']) if (!Array.isArray(input[field])) issues.push(`${field} must be an array.`);
  if (Array.isArray(input.workforce)) {
    for (const [row, person] of input.workforce.entries()) {
      if (!person || !text(person.personId) || !['active', 'leaver'].includes(person.status)) issues.push(`workforce[${row}] needs personId and status active or leaver.`);
    }
    if (duplicates(input.workforce.map(person => person?.personId)).length) issues.push('Duplicate workforce personIds make identity matching ambiguous.');
  }
  if (Array.isArray(input.grants)) {
    for (const [row, grant] of input.grants.entries()) {
      if (!grant || ['grantId', 'personId', 'application', 'accessRole'].some(field => !text(grant[field])) || typeof grant.privileged !== 'boolean') {
        issues.push(`grants[${row}] needs grantId, personId, application, accessRole, and boolean privileged.`);
        continue;
      }
      if (grant.lastUsedOn !== null && (date(grant.lastUsedOn) === null || date(grant.lastUsedOn) > asOf)) issues.push(`grants[${row}].lastUsedOn must be null or a real date no later than asOf.`);
    }
    if (duplicates(input.grants.map(grant => grant?.grantId)).length) issues.push('Duplicate grantIds make grant matching ambiguous.');
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Snapshot is incomplete; reconcile source scope and pagination before review.');
  if (!text(input.evidenceRef)) issues.push('Missing snapshot evidence reference.');
  if (!input.workforce.length || !input.grants.length) issues.push('Empty workforce or grant scope requires confirmation.');
  const people = new Map(input.workforce.map(person => [person.personId, person]));
  const rows = input.grants.map(grant => {
    const person = people.get(grant.personId);
    const findings = [];
    const daysSinceUse = grant.lastUsedOn === null ? null : Math.floor((asOf - date(grant.lastUsedOn)) / 86400000);
    if (!person) findings.push('identity_not_in_workforce');
    if (person?.status === 'leaver') findings.push('leaver_has_access');
    if (grant.privileged) findings.push('privileged_access_review');
    if (!text(grant.ownerRole)) findings.push('application_owner_missing');
    if (!text(person?.managerRole)) findings.push('workforce_reviewer_missing');
    if (daysSinceUse === null) findings.push('usage_unknown');
    else if (daysSinceUse >= input.dormantDays) findings.push('dormant_access_review');
    return {
      grantId: grant.grantId, personId: grant.personId, application: grant.application,
      accessRole: grant.accessRole, ownerRole: text(grant.ownerRole) ? grant.ownerRole : null,
      reviewerRole: text(person?.managerRole) ? person.managerRole : null,
      workforceStatus: person?.status ?? 'unknown', daysSinceUse, findings,
      decision: 'pending_human_review'
    };
  });
  const exceptionCount = rows.filter(row => row.findings.length).length;
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf,
      status: issues.length || exceptionCount ? 'needs_review' : 'review_ready',
      totalGrants: rows.length, exceptionCount, issues, rows,
      evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Compares supplied snapshots only. All grants still require a human decision; usage and evidence are not independently verified. No access is changed.'
    }, pairedItem: { item: index }
  };
});
