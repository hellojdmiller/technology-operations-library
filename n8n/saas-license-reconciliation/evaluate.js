// n8n Code node: Run Once for All Items. Prepares candidates; never removes licenses.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No license packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (!Number.isInteger(input.unusedDays) || input.unusedDays < 1) issues.push('unusedDays must be a positive integer.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  const contracts = [
    ['workforce', 'personId', row => ['active', 'leaver'].includes(row.status)],
    ['subscriptions', 'skuId', row => text(row.service) && Number.isInteger(row.purchasedSeats) && row.purchasedSeats >= 0],
    ['assignments', 'assignmentId', row => text(row.skuId) && text(row.personId) && typeof row.isServiceAccount === 'boolean']
  ];
  for (const [field, idField, validate] of contracts) {
    if (!Array.isArray(input[field])) { issues.push(`${field} must be an array.`); continue; }
    const seen = new Set();
    for (const [rowIndex, row] of input[field].entries()) {
      if (!row || !text(row[idField]) || !validate(row)) { issues.push(`${field}[${rowIndex}] has missing or invalid fields; check the input contract.`); continue; }
      if (seen.has(row[idField])) issues.push(`Duplicate ${field} ${idField}: ${row[idField]}.`);
      seen.add(row[idField]);
      if (field === 'assignments' && row.lastUsedOn !== null && (date(row.lastUsedOn) === null || date(row.lastUsedOn) > asOf)) issues.push(`assignments[${rowIndex}].lastUsedOn must be null or a real date no later than asOf.`);
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Snapshot is incomplete; reconcile billing, application assignments, workforce, and usage scope.');
  if (!text(input.evidenceRef)) issues.push('Missing snapshot evidence reference.');
  if (!input.workforce.length || !input.subscriptions.length || !input.assignments.length) issues.push('Empty workforce, subscription, or assignment scope requires confirmation.');
  const people = new Map(input.workforce.map(person => [person.personId, person]));
  const skus = new Map(input.subscriptions.map(sku => [sku.skuId, sku]));
  // JSON tuple keys avoid collisions when identifiers contain punctuation.
  const pairKey = row => JSON.stringify([row.skuId, row.personId]);
  const pairCounts = new Map();
  for (const assignment of input.assignments) pairCounts.set(pairKey(assignment), (pairCounts.get(pairKey(assignment)) ?? 0) + 1);
  const rows = input.assignments.map(assignment => {
    const findings = [];
    const person = people.get(assignment.personId);
    const knownSku = skus.has(assignment.skuId);
    const daysSinceUse = assignment.lastUsedOn === null ? null : Math.floor((asOf - date(assignment.lastUsedOn)) / 86400000);
    const duplicatePair = pairCounts.get(pairKey(assignment)) > 1;
    if (!knownSku) findings.push('sku_not_in_subscription_register');
    if (duplicatePair) findings.push('duplicate_person_sku_assignment');
    if (!text(assignment.ownerRole)) findings.push('assignment_owner_missing');
    if (assignment.isServiceAccount) findings.push('service_account_dependency_review');
    else if (!person) findings.push('identity_not_in_workforce');
    else if (person.status === 'leaver') findings.push('leaver_license_review');
    if (daysSinceUse === null) findings.push('usage_unknown');
    else if (!assignment.isServiceAccount && daysSinceUse >= input.unusedDays) findings.push('unused_license_review');
    const candidateReason = !assignment.isServiceAccount && person && knownSku && !duplicatePair
      ? person.status === 'leaver' ? 'leaver' : daysSinceUse !== null && daysSinceUse >= input.unusedDays ? 'unused' : null
      : null;
    return {
      assignmentId: assignment.assignmentId, skuId: assignment.skuId, personId: assignment.personId,
      isServiceAccount: assignment.isServiceAccount, ownerRole: text(assignment.ownerRole) ? assignment.ownerRole : null,
      daysSinceUse, candidateReason, findings, decision: 'pending_human_review'
    };
  });
  const subscriptionReview = input.subscriptions.map(sku => {
    const assignments = input.assignments.filter(row => row.skuId === sku.skuId);
    const uniqueAssignedSeats = new Set(assignments.map(row => row.personId)).size;
    const unassignedSeats = Math.max(0, sku.purchasedSeats - uniqueAssignedSeats);
    const overassignedSeats = Math.max(0, uniqueAssignedSeats - sku.purchasedSeats);
    const findings = [];
    if (overassignedSeats) findings.push('assigned_count_exceeds_purchased');
    if (unassignedSeats) findings.push('unassigned_capacity_review');
    if (assignments.length !== uniqueAssignedSeats) findings.push('duplicate_assignment_records');
    return {
      skuId: sku.skuId, service: sku.service, purchasedSeats: sku.purchasedSeats,
      assignmentRecordCount: assignments.length, uniqueAssignedSeats, unassignedSeats, overassignedSeats,
      reviewCandidateCount: rows.filter(row => row.skuId === sku.skuId && row.candidateReason).length,
      findings
    };
  });
  const attentionCount = rows.filter(row => row.findings.length).length;
  const candidateCount = rows.filter(row => row.candidateReason).length;
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf,
      status: issues.length || attentionCount || subscriptionReview.some(row => row.findings.length) ? 'needs_review' : 'review_ready',
      totalAssignmentRecords: rows.length, attentionCount, candidateCount, issues, rows, subscriptionReview,
      evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Assumes one seat per distinct person and SKU. Usage gaps, service identities, holds, retention, dependencies, assignment methods, and contract terms need human review. Unassigned capacity and review candidates are not guaranteed savings. No licenses are changed.'
    }, pairedItem: { item: index }
  };
});
