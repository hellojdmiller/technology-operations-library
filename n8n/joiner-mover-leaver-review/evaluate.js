// n8n Code node: Run Once for All Items. Reviews evidence; never provisions accounts.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const unique = values => new Set(values).size === values.length;
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No lifecycle review packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  for (const type of ['joiner', 'mover', 'leaver']) {
    const tasks = input.requiredTasks?.[type];
    if (!Array.isArray(tasks) || !tasks.length || tasks.some(task => !text(task)) || !unique(tasks)) issues.push(`requiredTasks.${type} must contain unique nonblank task IDs and cannot be empty.`);
  }
  if (!Array.isArray(input.cases)) issues.push('cases must be an array.');
  else {
    if (!unique(input.cases.map(record => record?.caseId))) issues.push('Duplicate caseIds make lifecycle matching ambiguous.');
    for (const [row, record] of input.cases.entries()) {
      if (!record || !text(record.caseId) || !['joiner', 'mover', 'leaver'].includes(record.type)) { issues.push(`cases[${row}] needs caseId and type joiner, mover, or leaver.`); continue; }
      if (date(record.effectiveOn) === null) issues.push(`cases[${row}].effectiveOn must be a real date.`);
      if (typeof record.scopeApproved !== 'boolean') issues.push(`cases[${row}].scopeApproved must be a boolean.`);
      if (!Array.isArray(record.additionalRequiredTaskIds) || record.additionalRequiredTaskIds.some(task => !text(task)) || !unique(record.additionalRequiredTaskIds)) issues.push(`cases[${row}].additionalRequiredTaskIds must contain unique nonblank strings.`);
      if (!Array.isArray(record.tasks)) { issues.push(`cases[${row}].tasks must be an array.`); continue; }
      if (!unique(record.tasks.map(task => task?.taskId))) issues.push(`cases[${row}] contains duplicate taskIds.`);
      for (const [taskIndex, task] of record.tasks.entries()) {
        if (!task || !text(task.taskId) || !['complete', 'pending', 'blocked', 'not_applicable'].includes(task.state)) { issues.push(`cases[${row}].tasks[${taskIndex}] needs taskId and a supported state.`); continue; }
        if (task.verifiedOn !== null && (date(task.verifiedOn) === null || date(task.verifiedOn) > asOf)) issues.push(`cases[${row}].tasks[${taskIndex}].verifiedOn must be null or a real date no later than asOf.`);
      }
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Lifecycle snapshot is incomplete; reconcile it with the authoritative change roster.');
  if (!text(input.evidenceRef)) issues.push('Missing lifecycle snapshot evidence reference.');
  if (!input.cases.length) issues.push('Empty case scope requires confirmation.');
  const rows = input.cases.map(record => {
    const findings = [];
    if (!text(record.ownerRole)) findings.push('case_owner_missing');
    if (!record.scopeApproved || !text(record.scopeApprovalRef)) findings.push('scope_approval_missing');
    const requiredTaskIds = [...new Set([...input.requiredTasks[record.type], ...record.additionalRequiredTaskIds])];
    const supplied = new Map(record.tasks.map(task => [task.taskId, task]));
    const taskReview = requiredTaskIds.map(taskId => {
      const task = supplied.get(taskId);
      const gaps = [];
      if (!task) gaps.push('task_missing');
      else if (task.state === 'complete') {
        if (!text(task.evidenceRef)) gaps.push('completion_evidence_missing');
        if (task.verifiedOn === null) gaps.push('verification_date_missing');
      } else if (task.state === 'not_applicable') {
        if (!text(task.exceptionRef)) gaps.push('exception_approval_missing');
      } else gaps.push(task.state === 'blocked' ? 'task_blocked' : 'task_pending');
      return { taskId, state: task?.state ?? 'missing', gaps, verifiedOn: task?.verifiedOn ?? null, evidenceRef: text(task?.evidenceRef) ? task.evidenceRef : null, exceptionRef: text(task?.exceptionRef) ? task.exceptionRef : null };
    });
    const outOfScopeTaskIds = record.tasks.filter(task => !requiredTaskIds.includes(task.taskId)).map(task => task.taskId);
    if (outOfScopeTaskIds.length) findings.push('tasks_outside_approved_scope');
    const incompleteTaskCount = taskReview.filter(task => task.gaps.length).length;
    if (incompleteTaskCount) findings.push('required_task_evidence_incomplete');
    const daysToEffective = Math.round((date(record.effectiveOn) - asOf) / 86400000);
    if (findings.length && daysToEffective <= 0) findings.push('effective_date_reached_with_open_review');
    return {
      caseId: record.caseId, type: record.type, effectiveOn: record.effectiveOn, daysToEffective,
      ownerRole: text(record.ownerRole) ? record.ownerRole : null,
      scopeApprovalRef: text(record.scopeApprovalRef) ? record.scopeApprovalRef : null,
      status: findings.length ? 'open' : 'evidence_complete', findings,
      requiredTaskCount: requiredTaskIds.length, incompleteTaskCount, taskReview, outOfScopeTaskIds,
      approval: 'pending_human_review'
    };
  });
  const openCaseCount = rows.filter(row => row.status === 'open').length;
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, status: issues.length || openCaseCount ? 'needs_review' : 'review_ready',
      totalCases: rows.length, openCaseCount, issues, rows, evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Checks the supplied task catalog and evidence references only. It cannot detect missing case-specific scope, inspect systems, or verify execution. Effective dates use whole UTC days; time-critical access actions need exact local deadlines and independent verification.'
    }, pairedItem: { item: index }
  };
});
