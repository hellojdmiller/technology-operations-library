// n8n Code node: Run Once for All Items. Drafts a deterministic security signal brief from supplied exports; never queries a collector, closes an alert, calls a model, or sends the brief.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
const timestamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(value) || date(value.slice(0, 10)) === null) return null;
  const valueMs = Date.parse(value);
  return Number.isFinite(valueMs) ? valueMs : null;
};
const missing = value => value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0);
const unique = values => new Set(values).size === values.length;
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const SOURCES = {
  identityRiskEvents: { timeField: 'detectedAt', subjectField: 'user', stateField: 'riskState', states: ['atRisk', 'confirmedCompromised', 'remediated', 'dismissed'], closedStates: ['remediated', 'dismissed'], topicField: 'detectionType' },
  endpointAndMailAlerts: { timeField: 'createdAt', subjectField: 'assetOrMailbox', stateField: 'status', states: ['new', 'inProgress', 'resolved'], closedStates: ['resolved'], topicField: 'title' },
  githubAlerts: { timeField: 'createdAt', subjectField: 'repository', stateField: 'state', states: ['open', 'dismissed', 'fixed', 'resolved'], closedStates: ['dismissed', 'fixed', 'resolved'], topicField: 'kind' },
  cloudflareAuditEvents: { timeField: 'when', subjectField: 'resourceId', stateField: null, states: [], closedStates: [], topicField: 'action' },
};
const SOURCE_KEYS = Object.keys(SOURCES);
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const GITHUB_KINDS = ['dependabot', 'secret_scanning'];
const DRAFTING_LABEL = 'Drafting aid only. A model may rephrase the deterministic brief for readability; a human reviews the output before it is sent. It must not add, remove, or reprioritize items.';
const summarize = (source, get) => {
  if (source === 'identityRiskEvents') return `${get('detectionType') ?? 'unspecified detection'} at ${get('riskLevel') ?? 'unspecified'} risk`;
  if (source === 'endpointAndMailAlerts') return `${get('title') ?? 'untitled alert'} (${get('category') ?? 'no category'}, ${get('severity') ?? 'no severity'})`;
  if (source === 'githubAlerts') return get('kind') === 'secret_scanning' ? `secret_scanning ${get('secretType') ?? 'unspecified secret type'}` : `${get('kind') ?? 'unspecified kind'} ${get('severity') ?? 'unspecified severity'}`;
  return `${get('action') ?? 'unspecified action'} by ${get('actorEmail') ?? 'unknown actor'} on ${get('resourceType') ?? 'unspecified resource type'} via ${get('interface') ?? 'unspecified interface'}`;
};
const detailOf = (source, get) => {
  if (source === 'identityRiskEvents') return { riskLevel: get('riskLevel'), riskState: get('riskState'), detectionType: get('detectionType') };
  if (source === 'endpointAndMailAlerts') return { title: get('title'), severity: get('severity'), status: get('status'), category: get('category') };
  if (source === 'githubAlerts') return { kind: get('kind'), severity: get('severity'), secretType: get('secretType'), state: get('state') };
  return { actorEmail: get('actorEmail'), action: get('action'), resourceType: get('resourceType'), interface: get('interface') };
};
const briefLine = row => `- ${row.signalId} | severity ${row.severity ?? 'unrouted'} | owner ${row.ownerRole ?? 'unassigned'} | ${row.summary} | state ${row.rawState ?? 'none'} | findings ${row.findings.join(', ') || 'none'}`;
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No security signal packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOfMs = date(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOfMs === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (typeof input.snapshotComplete !== 'boolean') issues.push('snapshotComplete must be a boolean.');
  if (!Number.isInteger(input.decisionAfterDays) || input.decisionAfterDays < 0) issues.push('decisionAfterDays must be a whole number of days, zero or more; there is no default.');
  if (typeof input.previousBriefRef !== 'string') issues.push('previousBriefRef must be a string (blank when there is no prior brief).');
  if (!isObject(input.aiDrafting) || typeof input.aiDrafting.enabled !== 'boolean') issues.push('aiDrafting.enabled must be a boolean.');
  if (!isObject(input.sources)) issues.push(`sources must be an object with the arrays ${SOURCE_KEYS.join(', ')}.`);
  else {
    for (const source of SOURCE_KEYS) {
      const records = input.sources[source];
      if (!Array.isArray(records)) { issues.push(`sources.${source} must be an array (empty when the collector returned nothing).`); continue; }
      const ids = [];
      for (const [row, record] of records.entries()) {
        if (!isObject(record)) { issues.push(`sources.${source}[${row}] must be an object.`); continue; }
        if (!text(record.id)) issues.push(`sources.${source}[${row}].id must be a nonblank string.`);
        else ids.push(record.id);
        const time = record[SOURCES[source].timeField];
        if (!missing(time) && timestamp(time) === null) issues.push(`sources.${source}[${row}].${SOURCES[source].timeField} must be an ISO 8601 timestamp with a zone, or absent.`);
      }
      if (!unique(ids)) issues.push(`sources.${source} contains duplicate ids; the same record cannot appear twice in one export.`);
    }
  }
  if (!Array.isArray(input.routing)) issues.push('routing must be an array of rules (empty when nothing is routed).');
  else {
    const ruleIds = [];
    for (const [row, rule] of input.routing.entries()) {
      if (!isObject(rule) || !text(rule.ruleId)) { issues.push(`routing[${row}] needs a nonblank ruleId.`); continue; }
      ruleIds.push(rule.ruleId);
      if (!SOURCE_KEYS.includes(rule.source)) issues.push(`routing[${row}].source must be one of ${SOURCE_KEYS.join(', ')}.`);
      if (!isObject(rule.match) || !text(rule.match.field) || !['string', 'number', 'boolean'].includes(typeof rule.match.equals)) issues.push(`routing[${row}].match needs a field name and an equals value (string, number, or boolean).`);
      if (!SEVERITIES.includes(rule.severity)) issues.push(`routing[${row}].severity must be one of ${SEVERITIES.join(', ')}.`);
      if (!text(rule.ownerRole)) issues.push(`routing[${row}].ownerRole must be a nonblank role name.`);
    }
    if (!unique(ruleIds)) issues.push('routing contains duplicate ruleIds.');
  }
  if (!Array.isArray(input.closedSince) || input.closedSince.some(entry => !text(entry))) issues.push('closedSince must be an array of nonblank signal ids in the form source:id.');
  else if (!unique(input.closedSince)) issues.push('closedSince contains duplicate entries.');
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.snapshotComplete) issues.push('Signal snapshot is incomplete; confirm every collector export finished before relying on this brief.');
  if (!text(input.evidenceRef)) issues.push('Missing signal export evidence reference.');
  if (!text(input.previousBriefRef)) issues.push('prior brief reference missing; newness cannot be checked against an earlier brief.');
  const recordTotal = SOURCE_KEYS.reduce((sum, source) => sum + input.sources[source].length, 0);
  if (!recordTotal) issues.push('No source records supplied; confirm the export window and collector scope.');

  const closedSince = new Set(input.closedSince);
  const matchedClosed = new Set();
  const rows = [];
  for (const source of SOURCE_KEYS) {
    const spec = SOURCES[source];
    for (const record of input.sources[source]) {
      const get = name => (text(record[name]) ? record[name] : null);
      const findings = [];
      const observedMs = missing(record[spec.timeField]) ? null : timestamp(record[spec.timeField]);
      const observedAt = observedMs === null ? null : new Date(observedMs).toISOString();
      const ageDays = observedAt === null ? null : Math.floor((asOfMs - date(observedAt.slice(0, 10))) / 86400000);
      const subject = get(spec.subjectField);
      const rawState = spec.stateField ? get(spec.stateField) : null;
      if (observedAt === null) findings.push(`observed_at_missing:${spec.timeField}`);
      else if (ageDays < 0) findings.push(`observed_after_asOf:${spec.timeField}`);
      if (subject === null) findings.push(`subject_missing:${spec.subjectField}`);
      if (spec.stateField && !spec.states.includes(rawState)) findings.push(`state_unknown:${spec.stateField}`);
      if (source === 'githubAlerts' && !GITHUB_KINDS.includes(get('kind'))) findings.push('kind_unknown:kind');
      const rule = input.routing.find(candidate => candidate.source === source && record[candidate.match.field] === candidate.match.equals);
      if (!rule) findings.push('owner_unknown');
      const signalId = `${source}:${record.id}`;
      let closedVia = spec.closedStates.includes(rawState) ? 'source_state' : null;
      if (closedSince.has(signalId)) { matchedClosed.add(signalId); closedVia = closedVia ?? 'closedSince'; }
      const topic = get(spec.topicField);
      rows.push({
        signalId, source, id: record.id, observedAt, ageDays, subject, summary: summarize(source, get), rawState, detail: detailOf(source, get),
        severity: rule ? rule.severity : null, ownerRole: rule ? rule.ownerRole : null, routedBy: rule ? rule.ruleId : null,
        relatedTo: [], closed: closedVia !== null, closedVia, findings, section: null,
        relationKey: subject !== null && topic !== null && observedAt !== null ? `${subject}|${topic}|${observedAt.slice(0, 10)}` : null,
      });
    }
  }
  for (const row of rows) {
    if (row.relationKey !== null) row.relatedTo = rows.filter(other => other.source !== row.source && other.relationKey === row.relationKey).map(other => other.signalId);
  }
  for (const row of rows) {
    delete row.relationKey;
    if (row.closed) row.section = 'closed';
    else if (row.findings.length) row.section = 'unknown';
    else if (['high', 'critical'].includes(row.severity) || row.ageDays > input.decisionAfterDays) row.section = 'needsDecision';
    else row.section = 'whatChanged';
  }
  for (const entry of input.closedSince) {
    if (matchedClosed.has(entry)) continue;
    const separator = entry.indexOf(':');
    const prefix = separator > 0 ? entry.slice(0, separator) : '';
    rows.push({
      signalId: entry, source: SOURCE_KEYS.includes(prefix) ? prefix : null, id: SOURCE_KEYS.includes(prefix) ? entry.slice(separator + 1) : null,
      observedAt: null, ageDays: null, subject: null, summary: 'closedSince entry matches no supplied record.', rawState: null, detail: null,
      severity: null, ownerRole: null, routedBy: null, relatedTo: [], closed: false, closedVia: null, findings: ['closed_id_not_found'], section: 'unknown',
    });
  }

  const section = name => rows.filter(row => row.section === name);
  const whatChanged = section('whatChanged');
  const needsDecision = section('needsDecision');
  const unknown = section('unknown');
  const closed = section('closed');
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, unassigned: 0 };
  for (const row of rows) bySeverity[row.severity ?? 'unassigned'] += 1;
  const counts = { total: rows.length, whatChanged: whatChanged.length, needsDecision: needsDecision.length, unknown: unknown.length, closed: closed.length, bySeverity };
  const sourcesSummary = {};
  for (const source of SOURCE_KEYS) {
    const observed = rows.filter(row => row.source === source && row.observedAt !== null).map(row => row.observedAt).sort();
    sourcesSummary[source] = { recordCount: input.sources[source].length, oldest: observed[0] ?? null, newest: observed[observed.length - 1] ?? null };
  }
  const allObserved = SOURCE_KEYS.map(source => sourcesSummary[source].oldest).filter(value => value !== null).sort();
  const periodAndScope = `As of ${input.asOf}. Period ${allObserved.length ? allObserved[0].slice(0, 10) : 'undated'} to ${input.asOf} (oldest supplied record to asOf). ${recordTotal} records: ${SOURCE_KEYS.map(source => `${source} ${input.sources[source].length}`).join(', ')}. Prior brief ${text(input.previousBriefRef) ? input.previousBriefRef : 'missing'}. Snapshot complete ${input.snapshotComplete}. Decision threshold ${input.decisionAfterDays} whole days.`;
  const decisionRequested = needsDecision.map(row => `${row.ownerRole ?? 'unassigned'}: decide treatment for ${row.signalId} (${row.severity} severity; ${row.summary}; whole UTC days open as of ${input.asOf}: ${row.ageDays}). Deferral keeps it in needsDecision at the next brief.`);
  const enabled = input.aiDrafting.enabled;
  const prompt = enabled ? [
    'Rephrase this deterministic security brief for readability. Keep every signal id and every item. Do not add, remove, merge, reorder, or reprioritize items. Do not change severities, owners, states, or counts. Return plain text with the same headings.',
    `Period and scope: ${periodAndScope}`,
    'Decision requested:', ...(decisionRequested.length ? decisionRequested.map(line => `- ${line}`) : ['- none']),
    'Needs decision:', ...(needsDecision.length ? needsDecision.map(briefLine) : ['- none']),
    'What changed:', ...(whatChanged.length ? whatChanged.map(briefLine) : ['- none']),
    'Unknown:', ...(unknown.length ? unknown.map(briefLine) : ['- none']),
    'Closed:', ...(closed.length ? closed.map(briefLine) : ['- none']),
  ].join('\n') : null;

  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf,
      status: issues.length || needsDecision.length || unknown.length ? 'needs_review' : 'review_ready',
      issues, counts,
      brief: { periodAndScope, decisionRequested, whatChanged, needsDecision, unknown, closed, counts, sourcesSummary },
      narrativeDraftingAid: { enabled, status: enabled ? 'prompt_ready' : 'disabled', label: DRAFTING_LABEL, prompt },
      evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      previousBriefRef: text(input.previousBriefRef) ? input.previousBriefRef : null,
      limitation: 'Reads the supplied exports, routing table, and closedSince list only. It cannot confirm that an export is complete or current, that a closedSince entry was verified, or that a routed owner accepted the item. Whether a record is new since the prior brief depends on the collector export window. Ages use whole UTC days. The drafting aid is prompt text for a separate, human-reviewed model step; this node never calls a model.'
    }, pairedItem: { item: index }
  };
});
