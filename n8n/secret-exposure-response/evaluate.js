// n8n Code node: Run Once for All Items. Classifies fictional secret-scanning alerts into a rotation checklist and ticket draft; never revokes, rotates, reads secret values, or notifies anyone.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const timestamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return null;
  const valueMs = Date.parse(value);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString() === `${value.slice(0, -1)}.000Z` ? valueMs : null;
};
const iso = ms => new Date(ms).toISOString().replace('.000Z', 'Z');
const unique = values => new Set(values).size === values.length;
const HOUR = 3600000;
const STATES = ['open', 'resolved'];
const RESOLUTIONS = ['false_positive', 'wont_fix', 'revoked', 'used_in_tests', 'pattern_edited', 'pattern_deleted'];
const VALIDITY = ['active', 'inactive', 'unknown'];
const LOCATION_TYPES = ['commit', 'issue', 'pull_request', 'wiki'];
const ENVIRONMENTS = ['production', 'staging', 'development', 'unknown'];
const CLASSES = ['cloud_credential', 'source_control_token', 'messaging_webhook', 'private_key', 'database_credential', 'third_party_api_key'];
const P1_CLASSES = ['cloud_credential', 'private_key', 'database_credential'];
const SEVERITY = { p1: 'Critical', p2: 'High', p3: 'Low' };
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No secret exposure review packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  const asOfEnd = asOf === null ? null : asOf + 86399000;
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  if (!Array.isArray(input.serviceCatalog)) issues.push('serviceCatalog must be an array.');
  else {
    if (!unique(input.serviceCatalog.map(entry => entry?.repository))) issues.push('Duplicate serviceCatalog repositories make ownership ambiguous.');
    for (const [row, entry] of input.serviceCatalog.entries()) {
      if (!entry || !text(entry.repository) || !text(entry.service)) { issues.push(`serviceCatalog[${row}] needs a nonblank repository and service.`); continue; }
      if (entry.ownerRole !== null && typeof entry.ownerRole !== 'string') issues.push(`serviceCatalog[${row}].ownerRole must be a string or null.`);
      if (entry.escalationRole !== null && typeof entry.escalationRole !== 'string') issues.push(`serviceCatalog[${row}].escalationRole must be a string or null.`);
      if (!ENVIRONMENTS.includes(entry.environment)) issues.push(`serviceCatalog[${row}].environment must be production, staging, development, or unknown.`);
      if (typeof entry.rotationRunbookRef !== 'string') issues.push(`serviceCatalog[${row}].rotationRunbookRef must be a string (blank when absent).`);
    }
  }
  if (!Array.isArray(input.secretTypePolicy)) issues.push('secretTypePolicy must be an array.');
  else {
    if (!unique(input.secretTypePolicy.map(policy => policy?.secretType))) issues.push('Duplicate secretTypePolicy secretTypes make classification ambiguous.');
    for (const [row, policy] of input.secretTypePolicy.entries()) {
      if (!policy || !text(policy.secretType)) { issues.push(`secretTypePolicy[${row}] needs a nonblank secretType.`); continue; }
      if (!CLASSES.includes(policy.class)) issues.push(`secretTypePolicy[${row}].class must be one of ${CLASSES.join(', ')}.`);
      if (!Number.isInteger(policy.revokeWithinHours) || policy.revokeWithinHours < 1) issues.push(`secretTypePolicy[${row}].revokeWithinHours must be a positive integer.`);
      if (!Array.isArray(policy.rotationSteps) || !policy.rotationSteps.length || policy.rotationSteps.some(step => !text(step))) issues.push(`secretTypePolicy[${row}].rotationSteps must be a nonempty array of nonblank strings.`);
    }
  }
  if (!Array.isArray(input.alerts)) issues.push('alerts must be an array.');
  else {
    if (!unique(input.alerts.map(alert => `${alert?.repository}#${alert?.alertNumber}`))) issues.push('Duplicate alertNumber and repository pairs make alert matching ambiguous.');
    for (const [row, alert] of input.alerts.entries()) {
      if (!alert || !Number.isInteger(alert.alertNumber) || !text(alert.repository) || !/^[^\s/]+\/[^\s/]+$/.test(alert.repository)) { issues.push(`alerts[${row}] needs an integer alertNumber and an owner/name repository.`); continue; }
      if (!text(alert.secretType)) issues.push(`alerts[${row}].secretType must be a nonblank string.`);
      if (typeof alert.secretTypeDisplayName !== 'string') issues.push(`alerts[${row}].secretTypeDisplayName must be a string.`);
      if (!STATES.includes(alert.state)) issues.push(`alerts[${row}].state must be open or resolved.`);
      if (alert.resolution !== null && !RESOLUTIONS.includes(alert.resolution)) issues.push(`alerts[${row}].resolution must be null or one of ${RESOLUTIONS.join(', ')}.`);
      if (alert.state === 'open' && alert.resolution !== null) issues.push(`alerts[${row}] is open but carries a resolution.`);
      if (alert.state === 'resolved' && alert.resolution === null) issues.push(`alerts[${row}] is resolved without a resolution.`);
      const created = timestamp(alert.createdAt);
      if (created === null) issues.push(`alerts[${row}].createdAt must be an ISO UTC timestamp (YYYY-MM-DDTHH:MM:SSZ).`);
      else if (asOfEnd !== null && created > asOfEnd) issues.push(`alerts[${row}].createdAt is later than the end of the asOf day.`);
      if (alert.resolvedAt !== null) {
        const resolved = timestamp(alert.resolvedAt);
        if (resolved === null) issues.push(`alerts[${row}].resolvedAt must be null or an ISO UTC timestamp.`);
        else {
          if (created !== null && resolved < created) issues.push(`alerts[${row}].resolvedAt is earlier than createdAt.`);
          if (asOfEnd !== null && resolved > asOfEnd) issues.push(`alerts[${row}].resolvedAt is later than the end of the asOf day.`);
          if (alert.state === 'open') issues.push(`alerts[${row}] is open but carries resolvedAt.`);
        }
      }
      if (alert.pushProtectionBypassed !== null && typeof alert.pushProtectionBypassed !== 'boolean') issues.push(`alerts[${row}].pushProtectionBypassed must be a boolean or null.`);
      if (!VALIDITY.includes(alert.validity)) issues.push(`alerts[${row}].validity must be active, inactive, or unknown.`);
      if (!Array.isArray(alert.locations) || alert.locations.some(location => !location || !LOCATION_TYPES.includes(location.type) || !text(location.ref))) issues.push(`alerts[${row}].locations must be an array of { type: commit | issue | pull_request | wiki, ref } with a nonblank ref.`);
      if (!text(alert.htmlUrl)) issues.push(`alerts[${row}].htmlUrl must be a nonblank string.`);
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Alert snapshot is incomplete; reconcile it with the secret scanning alert list for every in-scope repository.');
  if (!text(input.evidenceRef)) issues.push('Missing alert snapshot evidence reference.');
  if (!input.alerts.length) issues.push('Empty alert scope requires confirmation.');
  const catalog = new Map(input.serviceCatalog.map(entry => [entry.repository, entry]));
  const policies = new Map(input.secretTypePolicy.map(policy => [policy.secretType, policy]));
  const rows = input.alerts.map(alert => {
    const findings = [];
    const policy = policies.get(alert.secretType) ?? null;
    const entry = catalog.get(alert.repository) ?? null;
    const secretClass = policy?.class ?? null;
    const revokeWithinHours = policy?.revokeWithinHours ?? null;
    const ownerRole = text(entry?.ownerRole) ? entry.ownerRole : null;
    if (!policy) findings.push('secret_type_unclassified');
    if (ownerRole === null) findings.push('owner_unknown');
    const createdMs = timestamp(alert.createdAt);
    const resolvedMs = alert.resolvedAt === null ? null : timestamp(alert.resolvedAt);
    const deadlineMs = policy ? createdMs + revokeWithinHours * HOUR : null;
    const ageHours = Math.floor((asOfEnd - createdMs) / HOUR);
    let timeToRevokeStatus = 'unknown';
    if (policy) {
      if (alert.state === 'open') timeToRevokeStatus = asOfEnd > deadlineMs ? 'overdue' : 'due';
      else if (alert.resolution !== 'revoked') timeToRevokeStatus = 'not_applicable_resolution';
      else if (resolvedMs !== null) timeToRevokeStatus = resolvedMs <= deadlineMs ? 'revoked_within_target' : 'revoked_after_target';
      else findings.push('revocation_time_unknown');
    }
    if (alert.state === 'resolved' && alert.resolution !== 'revoked') {
      findings.push('non_revocation_resolution_needs_review');
      if (alert.validity === 'active') findings.push('active_secret_not_revoked');
    }
    if (timeToRevokeStatus === 'overdue') findings.push('revocation_overdue');
    const classText = secretClass === null ? 'unclassified secret' : secretClass.replace(/_/g, ' ');
    const ownerText = ownerRole ?? 'UNASSIGNED: owner unknown';
    const deadlineText = deadlineMs === null ? 'deadline unknown (secret type unclassified)' : `deadline ${iso(deadlineMs)} (${revokeWithinHours}h policy)`;
    const locationTypes = [...new Set(alert.locations.map(location => location.type))];
    const step = (name, detail, state = 'pending') => ({ step: name, detail, owner: ownerRole, state, evidenceRef: null });
    const checklist = [
      step('confirm_exposure_scope', `${alert.locations.length} location(s): ${locationTypes.join(', ') || 'none listed'}. Confirm forks, clones, CI logs, and other copies are covered.`),
      step('revoke_or_disable', `Revoke or disable the exposed ${classText}; ${deadlineText}.`, alert.resolution === 'revoked' && resolvedMs !== null ? 'complete' : 'pending'),
      step('rotate_and_redeploy', policy ? `Policy rotation steps: ${policy.rotationSteps.join('; ')}.` : 'No policy row for this secret type; rotation steps unknown.'),
      step('purge_from_history_or_accept', 'Decide whether to rewrite history or accept the exposed content as compromised; record the decision. Not automated.'),
      step('verify_no_use_after_exposure', `Review provider and application logs for use after ${alert.createdAt}; ${ownerText} signs off.`),
      step('close_alert_with_resolution_revoked', 'Close the alert with resolution revoked only after the previous steps have evidence.')
    ];
    const priority = secretClass === null ? null : alert.validity === 'inactive' ? 'p3' : P1_CLASSES.includes(secretClass) ? 'p1' : 'p2';
    const ticket = {
      title: `[${priority === null ? 'Unclassified' : SEVERITY[priority]}] Exposed ${classText} in ${alert.repository}`,
      body: [
        `Alert: ${alert.repository} #${alert.alertNumber} (${alert.htmlUrl})`,
        `Secret type: ${alert.secretType} (${alert.secretTypeDisplayName || 'no display name'}); class: ${secretClass ?? 'unclassified'}`,
        `Validity: ${alert.validity}`,
        `Push protection bypassed: ${alert.pushProtectionBypassed === null ? 'unknown' : alert.pushProtectionBypassed ? 'yes' : 'no'}`,
        `Exposure locations (${alert.locations.length}): ${alert.locations.map(location => `${location.type}:${location.ref}`).join(', ') || 'none listed'}`,
        `Owner: ${ownerText}${entry ? ` (${entry.service}, ${entry.environment})` : ''}`,
        `Revoke deadline: ${deadlineMs === null ? 'unknown' : iso(deadlineMs)}; time-to-revoke status: ${timeToRevokeStatus}`,
        `Alert state: ${alert.state}${alert.resolution ? ` (${alert.resolution})` : ''}`,
        'Checklist:',
        ...checklist.map(entryStep => `- [${entryStep.state}] ${entryStep.step}: ${entryStep.detail}`)
      ].join('\n'),
      assignee: ownerRole,
      priority
    };
    return {
      alertNumber: alert.alertNumber, repository: alert.repository, htmlUrl: alert.htmlUrl,
      secretType: alert.secretType, secretTypeDisplayName: alert.secretTypeDisplayName, class: secretClass,
      state: alert.state, resolution: alert.resolution, validity: alert.validity, pushProtectionBypassed: alert.pushProtectionBypassed,
      createdAt: alert.createdAt, resolvedAt: alert.resolvedAt, ageHours, revokeWithinHours,
      revokeDeadline: deadlineMs === null ? null : iso(deadlineMs), timeToRevokeStatus,
      service: entry?.service ?? null, ownerRole, escalationRole: text(entry?.escalationRole) ? entry.escalationRole : null,
      environment: entry?.environment ?? null, rotationRunbookRef: text(entry?.rotationRunbookRef) ? entry.rotationRunbookRef : null,
      rotationSteps: policy ? [...policy.rotationSteps] : null,
      locationCount: alert.locations.length, locationTypes, findings, checklist, ticket
    };
  });
  const count = predicate => rows.filter(predicate).length;
  const unknownRows = rows.filter(row => row.ownerRole === null || row.class === null || row.timeToRevokeStatus === 'unknown');
  const counts = {
    total: rows.length, open: count(row => row.state === 'open'),
    overdue: count(row => row.timeToRevokeStatus === 'overdue'), due: count(row => row.timeToRevokeStatus === 'due'),
    revokedWithinTarget: count(row => row.timeToRevokeStatus === 'revoked_within_target'),
    revokedAfterTarget: count(row => row.timeToRevokeStatus === 'revoked_after_target'),
    unknown: unknownRows.length, ownerUnknown: count(row => row.ownerRole === null)
  };
  const reviewReady = !issues.length && rows.every(row => row.timeToRevokeStatus === 'revoked_within_target' && !row.findings.length);
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, status: reviewReady ? 'review_ready' : 'needs_review', issues, counts, rows, unknownRows,
      evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Classifies alerts against the supplied policy and catalog only. It cannot confirm secret validity, verify revocation or rotation in any provider, inspect repositories or forks, or purge history. Deadlines use the supplied timestamps with whole hours to the end of the asOf day. The workflow neither revokes nor rotates anything and never reads or echoes a secret value.'
    }, pairedItem: { item: index }
  };
});
