// n8n Code node: Run Once for All Items. No backup jobs or restores are launched.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const timestamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return null;
  const valueMs = Date.parse(value);
  if (!Number.isFinite(valueMs)) return null;
  return new Date(valueMs).toISOString() === (value.includes('.') ? value : value.replace('Z', '.000Z')) ? valueMs : null;
};
const nonnegative = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No backup review packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = timestamp(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real UTC timestamp ending in Z.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  if (!Array.isArray(input.workloads)) issues.push('workloads must be an array.');
  else {
    const seen = new Set();
    for (const [row, workload] of input.workloads.entries()) {
      if (!workload || !text(workload.workloadId)) { issues.push(`workloads[${row}] needs workloadId.`); continue; }
      if (seen.has(workload.workloadId)) issues.push(`Duplicate workloadId: ${workload.workloadId}.`);
      seen.add(workload.workloadId);
      for (const field of ['rpoHours', 'rtoHours', 'restoreTestMaxAgeDays']) if (!nonnegative(workload[field]) || workload[field] === 0) issues.push(`workloads[${row}].${field} must be a finite positive number.`);
      if (!['success', 'failed', 'unknown'].includes(workload.backup?.state)) issues.push(`workloads[${row}].backup.state must be success, failed, or unknown.`);
      if (!['passed', 'failed', 'not_tested'].includes(workload.restoreTest?.outcome)) issues.push(`workloads[${row}].restoreTest.outcome must be passed, failed, or not_tested.`);
      for (const [name, value] of [['backup.recoveryPointAt', workload.backup?.recoveryPointAt], ['backup.lastJobAt', workload.backup?.lastJobAt], ['restoreTest.completedAt', workload.restoreTest?.completedAt]]) {
        if (value !== null && (timestamp(value) === null || timestamp(value) > asOf)) issues.push(`workloads[${row}].${name} must be null or a real timestamp no later than asOf.`);
      }
      for (const field of ['recoveryDurationMinutes', 'dataLossMinutes']) {
        const value = workload.restoreTest?.[field];
        if (value !== null && !nonnegative(value)) issues.push(`workloads[${row}].restoreTest.${field} must be null or a finite nonnegative number.`);
      }
      if (timestamp(workload.backup?.recoveryPointAt) !== null && timestamp(workload.backup?.lastJobAt) !== null && timestamp(workload.backup.recoveryPointAt) > timestamp(workload.backup.lastJobAt)) issues.push(`workloads[${row}] recovery point cannot be later than backup completion.`);
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Snapshot is incomplete; reconcile protected and unprotected workloads.');
  if (!text(input.evidenceRef)) issues.push('Missing inventory evidence reference.');
  if (!input.workloads.length) issues.push('Empty workload scope requires confirmation.');
  const rows = input.workloads.map(workload => {
    const findings = [];
    if (!text(workload.ownerRole)) findings.push('recovery_owner_missing');
    if (workload.backup.state !== 'success') findings.push(`backup_${workload.backup.state}`);
    if (workload.backup.lastJobAt === null) findings.push('backup_job_time_missing');
    if (!text(workload.backup.evidenceRef)) findings.push('backup_evidence_missing');
    const recoveryPointAgeHours = workload.backup.recoveryPointAt === null ? null : (asOf - timestamp(workload.backup.recoveryPointAt)) / 3600000;
    if (recoveryPointAgeHours === null) findings.push('recovery_point_unknown');
    else if (recoveryPointAgeHours > workload.rpoHours) findings.push('recovery_point_exceeds_rpo');
    const restoreTestAgeDays = workload.restoreTest.completedAt === null ? null : (asOf - timestamp(workload.restoreTest.completedAt)) / 86400000;
    if (workload.restoreTest.outcome !== 'passed') findings.push(`restore_${workload.restoreTest.outcome}`);
    if (restoreTestAgeDays === null) findings.push('restore_test_date_missing');
    else if (restoreTestAgeDays > workload.restoreTestMaxAgeDays) findings.push('restore_test_stale');
    if (!text(workload.restoreTest.evidenceRef)) findings.push('restore_evidence_missing');
    if (workload.restoreTest.recoveryDurationMinutes === null) findings.push('restore_duration_unknown');
    else if (workload.restoreTest.recoveryDurationMinutes > workload.rtoHours * 60) findings.push('restore_duration_exceeds_rto');
    if (workload.restoreTest.dataLossMinutes === null) findings.push('restore_data_loss_unknown');
    else if (workload.restoreTest.dataLossMinutes > workload.rpoHours * 60) findings.push('restore_data_loss_exceeds_rpo');
    return {
      workloadId: workload.workloadId, ownerRole: text(workload.ownerRole) ? workload.ownerRole : null,
      status: findings.length ? 'needs_review' : 'evidence_current', findings,
      rpoHours: workload.rpoHours, rtoHours: workload.rtoHours, recoveryPointAgeHours, restoreTestAgeDays,
      recoveryDurationMinutes: workload.restoreTest.recoveryDurationMinutes, dataLossMinutes: workload.restoreTest.dataLossMinutes,
      backupEvidenceRef: text(workload.backup.evidenceRef) ? workload.backup.evidenceRef : null,
      restoreEvidenceRef: text(workload.restoreTest.evidenceRef) ? workload.restoreTest.evidenceRef : null
    };
  });
  const attentionCount = rows.filter(row => row.findings.length).length;
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, status: issues.length || attentionCount ? 'needs_review' : 'review_ready',
      totalWorkloads: rows.length, attentionCount, issues, rows, evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Fresh backup evidence is not proof of recoverability. Supplied recovery points, objectives, test scope, integrity, application usability, dependencies, and evidence still need independent verification.'
    }, pairedItem: { item: index }
  };
});
