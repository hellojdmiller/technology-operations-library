// n8n Code node: Run Once for All Items. Reconciles MFA registration against an HR roster and privileged roles; never changes accounts, methods, or policy.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const timestamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(value)) return null;
  const valueMs = Date.parse(value);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 19) === value.slice(0, 19) ? valueMs : null;
};
const unique = values => new Set(values).size === values.length;
const idList = values => Array.isArray(values) && values.every(text) && unique(values);
const DAY = 86400000;
const TIERS = ['phishingResistant', 'acceptable', 'weak'];
const ENROLLED = ['phishing_resistant', 'acceptable', 'weak_only'];
const UNKNOWN_FINDINGS = ['employee_id_missing', 'enrollment_unknown', 'method_unrecognized', 'last_sign_in_unknown', 'privileged_member_not_found'];
const PRIORITY = ['privileged_without_phishing_resistant', 'active_account_terminated_in_roster', 'active_account_no_roster_match', 'not_enrolled', 'dormant_enabled_account', 'unknown', 'roster_member_no_account', 'non_member_account_review'];
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No MFA coverage packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  const policy = input.methodPolicy;
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  if (!Number.isInteger(input.dormantAfterDays) || input.dormantAfterDays < 1) issues.push('dormantAfterDays must be a positive integer.');
  if (input.matching?.key !== 'employeeId') issues.push("matching.key must be 'employeeId'; userPrincipalName matching is deliberately unsupported.");
  if (!policy || typeof policy !== 'object' || TIERS.some(tier => !idList(policy[tier]))) issues.push('methodPolicy needs phishingResistant, acceptable, and weak arrays of unique nonblank method names.');
  else if (!unique(TIERS.flatMap(tier => policy[tier]))) issues.push('methodPolicy tiers must be disjoint; a method name cannot appear in two tiers.');
  for (const field of ['identityUsers', 'hrRoster', 'privilegedRoles']) if (!Array.isArray(input[field])) issues.push(`${field} must be an array.`);
  if (Array.isArray(input.identityUsers)) {
    for (const [row, user] of input.identityUsers.entries()) {
      if (!user || !text(user.userId) || !text(user.userPrincipalName) || typeof user.accountEnabled !== 'boolean' || !text(user.userType)) { issues.push(`identityUsers[${row}] needs userId, userPrincipalName, boolean accountEnabled, and userType.`); continue; }
      if (user.lastSignInAt !== null && (timestamp(user.lastSignInAt) === null || date(user.lastSignInAt.slice(0, 10)) > asOf)) issues.push(`identityUsers[${row}].lastSignInAt must be null or an ISO 8601 UTC timestamp no later than asOf.`);
      if (!idList(user.registeredMethods)) issues.push(`identityUsers[${row}].registeredMethods must be an array of unique nonblank method names.`);
      if (user.mfaCapable !== null && typeof user.mfaCapable !== 'boolean') issues.push(`identityUsers[${row}].mfaCapable must be a boolean or null.`);
      if (typeof user.employeeId !== 'string') issues.push(`identityUsers[${row}].employeeId must be a string; use a blank string when unknown.`);
    }
    if (!unique(input.identityUsers.map(user => user?.userId))) issues.push('Duplicate userIds make identity matching ambiguous.');
  }
  if (Array.isArray(input.hrRoster)) {
    for (const [row, worker] of input.hrRoster.entries()) {
      if (!worker || !text(worker.employeeId) || !text(worker.workerStatus) || typeof worker.managerRole !== 'string' || typeof worker.department !== 'string') issues.push(`hrRoster[${row}] needs employeeId, workerStatus, and string managerRole and department.`);
    }
    if (!unique(input.hrRoster.map(worker => worker?.employeeId))) issues.push('Duplicate roster employeeIds make roster matching ambiguous.');
  }
  if (Array.isArray(input.privilegedRoles)) {
    for (const [row, role] of input.privilegedRoles.entries()) {
      if (!role || !text(role.roleId) || !text(role.roleName) || !idList(role.memberUserIds)) issues.push(`privilegedRoles[${row}] needs roleId, roleName, and memberUserIds as unique nonblank strings.`);
    }
    if (!unique(input.privilegedRoles.map(role => role?.roleId))) issues.push('Duplicate roleIds make role matching ambiguous.');
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Identity snapshot is incomplete; reconcile collection scope and pagination before review.');
  if (!text(input.evidenceRef)) issues.push('Missing identity snapshot evidence reference.');
  if (!input.identityUsers.length || !input.hrRoster.length) issues.push('Empty identity or roster scope requires confirmation.');
  const roster = new Map(input.hrRoster.map(worker => [worker.employeeId, worker]));
  const knownUserIds = new Set(input.identityUsers.map(user => user.userId));
  const accountEmployeeIds = new Set(input.identityUsers.map(user => user.employeeId).filter(text));
  const inTier = tier => method => policy[tier].includes(method);
  const rolesOf = userId => input.privilegedRoles.filter(role => role.memberUserIds.includes(userId)).map(role => role.roleId);
  const pending = 'pending_human_review';
  const rows = input.identityUsers.map(user => {
    const findings = [];
    const queues = [];
    const methods = user.registeredMethods;
    const unrecognizedMethods = methods.filter(method => !TIERS.some(tier => inTier(tier)(method)));
    let enrollment = 'unknown';
    if (methods.some(inTier('phishingResistant'))) enrollment = 'phishing_resistant';
    else if (methods.some(inTier('acceptable'))) enrollment = 'acceptable';
    else if (methods.some(inTier('weak'))) enrollment = 'weak_only';
    else if (!methods.length && user.mfaCapable !== null) enrollment = 'not_enrolled';
    const isMember = user.userType === 'member';
    const worker = text(user.employeeId) ? roster.get(user.employeeId) : undefined;
    const rosterMatch = !text(user.employeeId) ? 'employee_id_missing' : worker ? 'matched' : 'no_roster_match';
    const rosterStatus = worker?.workerStatus ?? null;
    const privilegedRoles = rolesOf(user.userId);
    const daysSinceSignIn = user.lastSignInAt === null ? null : (asOf - date(user.lastSignInAt.slice(0, 10))) / DAY;
    const dormant = user.accountEnabled && daysSinceSignIn !== null && daysSinceSignIn >= input.dormantAfterDays;
    if (privilegedRoles.length && enrollment !== 'phishing_resistant') { queues.push('privileged_without_phishing_resistant'); findings.push('privileged_without_phishing_resistant'); }
    if (user.accountEnabled && rosterStatus === 'terminated') { queues.push('active_account_terminated_in_roster'); findings.push('active_account_terminated_in_roster'); }
    if (user.accountEnabled && isMember && rosterMatch === 'no_roster_match') { queues.push('active_account_no_roster_match'); findings.push('active_account_no_roster_match'); }
    if (user.accountEnabled && isMember && (enrollment === 'not_enrolled' || enrollment === 'weak_only')) { queues.push('not_enrolled'); findings.push(enrollment === 'weak_only' ? 'weak_methods_only' : 'not_enrolled'); }
    if (dormant) { queues.push('dormant_enabled_account'); findings.push('dormant_enabled_account'); }
    if (isMember && rosterMatch === 'employee_id_missing') findings.push('employee_id_missing');
    if (enrollment === 'unknown') findings.push('enrollment_unknown');
    if (unrecognizedMethods.length) findings.push('method_unrecognized');
    if (user.accountEnabled && user.lastSignInAt === null) findings.push('last_sign_in_unknown');
    if (findings.some(finding => UNKNOWN_FINDINGS.includes(finding))) queues.push('unknown');
    if (user.accountEnabled && !isMember) { queues.push('non_member_account_review'); findings.push('non_member_account'); }
    return {
      userId: user.userId, employeeId: text(user.employeeId) ? user.employeeId : null, userPrincipalName: user.userPrincipalName,
      accountEnabled: user.accountEnabled, userType: user.userType, queues, findings, enrollment, unrecognizedMethods,
      privilegedRoles, rosterMatch, rosterStatus, lastSignInAt: user.lastSignInAt, daysSinceSignIn, dormant, decision: pending
    };
  });
  const privilegedIds = [...new Set(input.privilegedRoles.flatMap(role => role.memberUserIds))];
  for (const memberId of privilegedIds.filter(id => !knownUserIds.has(id))) {
    rows.push({
      userId: memberId, employeeId: null, userPrincipalName: null, accountEnabled: null, userType: null,
      queues: ['unknown'], findings: ['privileged_member_not_found'], enrollment: 'unknown', unrecognizedMethods: [],
      privilegedRoles: rolesOf(memberId), rosterMatch: null, rosterStatus: null, lastSignInAt: null, daysSinceSignIn: null, dormant: null, decision: pending
    });
  }
  for (const worker of input.hrRoster.filter(worker => worker.workerStatus === 'active' && !accountEmployeeIds.has(worker.employeeId))) {
    rows.push({
      userId: null, employeeId: worker.employeeId, userPrincipalName: null, accountEnabled: null, userType: null,
      queues: ['roster_member_no_account'], findings: ['roster_member_no_account'], enrollment: null, unrecognizedMethods: [],
      privilegedRoles: [], rosterMatch: 'no_account', rosterStatus: worker.workerStatus, lastSignInAt: null, daysSinceSignIn: null, dormant: null, decision: pending
    });
  }
  const rank = row => Math.min(...row.queues.map(queue => PRIORITY.indexOf(queue)));
  const queue = rows.map((row, order) => ({ row, order })).filter(({ row }) => row.queues.length)
    .sort((a, b) => rank(a.row) - rank(b.row) || a.order - b.order)
    .map(({ row }) => ({ ...row, queues: [...row.queues].sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b)) }));
  const userRows = rows.slice(0, input.identityUsers.length);
  const tierCount = tier => userRows.filter(row => row.enrollment === tier).length;
  const queueCount = name => queue.filter(row => row.queues.includes(name)).length;
  const privilegedRows = privilegedIds.map(id => rows.find(row => row.userId === id));
  const enabledMembers = userRows.filter(row => row.accountEnabled && row.userType === 'member');
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, status: issues.length || queue.length ? 'needs_review' : 'review_ready', issues,
      counts: {
        identityUsers: input.identityUsers.length, rosterMembers: input.hrRoster.length,
        privilegedAssignments: input.privilegedRoles.reduce((sum, role) => sum + role.memberUserIds.length, 0),
        enrolledPhishingResistant: tierCount('phishing_resistant'), enrolledAcceptable: tierCount('acceptable'), weakOnly: tierCount('weak_only'),
        notEnrolled: tierCount('not_enrolled'), enrollmentUnknown: tierCount('unknown'),
        privilegedWithoutPhishingResistant: queueCount('privileged_without_phishing_resistant'),
        activeNoRosterMatch: queueCount('active_account_no_roster_match'), rosterNoAccount: queueCount('roster_member_no_account'),
        dormant: queueCount('dormant_enabled_account'), unknown: queueCount('unknown')
      },
      coverage: {
        privileged: {
          inScope: privilegedRows.length,
          phishingResistant: privilegedRows.filter(row => row.enrollment === 'phishing_resistant').length,
          unknown: privilegedRows.filter(row => row.enrollment === 'unknown').length,
          note: 'Counts, not a percentage; unknown accounts are listed, not excluded.'
        },
        allEnabledMembers: {
          inScope: enabledMembers.length,
          enrolledAnyRecognizedMethod: enabledMembers.filter(row => ENROLLED.includes(row.enrollment)).length,
          notEnrolled: enabledMembers.filter(row => row.enrollment === 'not_enrolled').length,
          unknown: enabledMembers.filter(row => row.enrollment === 'unknown').length
        }
      },
      queue, evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Compares the supplied identity export, HR roster, and privileged-role list only. Registration is not enforcement: a registered method does not prove that a Conditional Access or equivalent policy requires it, and no policy is read here. Method names are matched exactly against the packet methodPolicy; anything outside it stays unknown. Roster matching uses employeeId only. Sign-in recency uses whole UTC calendar days. Every row still needs a human decision. No account, method, role, or policy is changed.'
    }, pairedItem: { item: index }
  };
});
