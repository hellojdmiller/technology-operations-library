// Security-operations workflow evaluators. Each block executes the checked-in Code-node source with n8n's input interface
// and compares the fictional sample against its expected-output.json fixture.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assess } from '../baselines/scripts/assess.mjs';

// ---- security-signal-brief ----
{
const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const evaluate = (slug, rows) => {
  const code = file(`n8n/${slug}/evaluate.js`);
  // Execute our own checked-in Code-node source with n8n's input interface.
  return new Function('$input', code)({ all: () => rows.map(json => ({ json })) });
};
const slug = 'security-signal-brief';
const brief = rows => evaluate(slug, rows);
const sample = () => JSON.parse(file(`n8n/${slug}/sample-input.json`));
const packet = overrides => ({ ...sample()[0], ...overrides });
const identity = overrides => ({ id: 'idr-9001', detectedAt: '2026-09-20T05:00:00Z', user: 'ops@northwind-ledger.example', riskLevel: 'medium', riskState: 'atRisk', detectionType: 'unfamiliarFeatures', ...overrides });
const mediumRule = { ruleId: 'r-test-medium', source: 'identityRiskEvents', match: { field: 'riskLevel', equals: 'medium' }, severity: 'medium', ownerRole: 'Identity owner' };
const clean = () => packet({
  sources: { identityRiskEvents: [identity()], endpointAndMailAlerts: [], githubAlerts: [], cloudflareAuditEvents: [] },
  routing: [mediumRule], closedSince: [],
});
const only = (source, records) => ({ identityRiskEvents: [], endpointAndMailAlerts: [], githubAlerts: [], cloudflareAuditEvents: [], [source]: records });

test('sample input returns the checked-in expected output', () => {
  const output = brief(sample());
  assert.deepEqual(output, JSON.parse(file(`n8n/${slug}/expected-output.json`)));
  assert.equal(output[0].json.status, 'needs_review');
  assert.deepEqual(output[0].json.counts, { total: 11, whatChanged: 1, needsDecision: 3, unknown: 4, closed: 3, bySeverity: { critical: 2, high: 2, medium: 4, low: 0, unassigned: 3 } });
});

test('empty, blank, and null packets are invalid input, never a brief', () => {
  for (const rows of [[{}], [], [null]]) {
    const output = brief(rows);
    assert.equal(output[0].json.status, 'invalid_input');
    assert.ok(output[0].json.issues.length > 0);
  }
});

test('incomplete snapshot and blank evidence both surface as issues', () => {
  const result = brief([packet({ snapshotComplete: false, evidenceRef: '' })])[0].json;
  assert.equal(result.status, 'needs_review');
  assert.ok(result.issues.some(issue => issue.includes('incomplete')));
  assert.ok(result.issues.some(issue => issue.includes('evidence reference')));
  assert.equal(result.evidenceRef, null);
});

test('unknowns stay unknown: no rule, blank subject, missing timestamp', () => {
  const input = clean();
  input.sources.identityRiskEvents = [
    identity({ id: 'idr-a', riskLevel: 'low' }),
    identity({ id: 'idr-b', user: '' }),
    identity({ id: 'idr-c', detectedAt: null }),
  ];
  const result = brief([input])[0].json;
  assert.equal(result.status, 'needs_review');
  assert.equal(result.counts.unknown, 3);
  const [noRule, noSubject, noTime] = result.brief.unknown;
  assert.equal(noRule.severity, null);
  assert.equal(noRule.ownerRole, null);
  assert.deepEqual(noRule.findings, ['owner_unknown']);
  assert.deepEqual(noSubject.findings, ['subject_missing:user']);
  assert.equal(noSubject.subject, null);
  assert.deepEqual(noTime.findings, ['observed_at_missing:detectedAt']);
  assert.equal(noTime.observedAt, null);
  assert.equal(noTime.ageDays, null);
});

test('a routed, dated, open, non-urgent packet is review_ready even with whatChanged rows', () => {
  const result = brief([clean()])[0].json;
  assert.equal(result.status, 'review_ready');
  assert.deepEqual(result.issues, []);
  assert.equal(result.counts.whatChanged, 1);
  assert.equal(result.brief.whatChanged[0].signalId, 'identityRiskEvents:idr-9001');
  assert.equal(result.brief.whatChanged[0].routedBy, 'r-test-medium');
  assert.deepEqual(result.brief.decisionRequested, []);
});

test('first matching routing rule wins and severity is never defaulted', () => {
  const result = brief(sample())[0].json;
  const compromised = result.brief.needsDecision.find(row => row.signalId === 'identityRiskEvents:idr-1001');
  assert.equal(compromised.routedBy, 'r-idp-compromised');
  assert.equal(compromised.severity, 'critical');
  const member = result.brief.unknown.find(row => row.signalId === 'cloudflareAuditEvents:cf-4002');
  assert.equal(member.severity, null);
  assert.deepEqual(member.findings, ['owner_unknown']);
});

test('duplicate ids, garbage timestamps, and a missing decision threshold are invalid input', () => {
  const duplicate = clean();
  duplicate.sources.identityRiskEvents = [identity(), identity()];
  const garbage = clean();
  garbage.sources.identityRiskEvents = [identity({ detectedAt: 'yesterday' })];
  const noThreshold = clean();
  delete noThreshold.decisionAfterDays;
  const badRule = clean();
  badRule.routing = [{ ...mediumRule, severity: 'urgent' }];
  for (const [input, fragment] of [[duplicate, 'duplicate ids'], [garbage, 'ISO 8601'], [noThreshold, 'decisionAfterDays'], [badRule, 'severity']]) {
    const result = brief([input])[0].json;
    assert.equal(result.status, 'invalid_input');
    assert.ok(result.issues.some(issue => issue.includes(fragment)), fragment);
  }
});

test('age beyond decisionAfterDays forces a decision; exactly at the threshold does not', () => {
  const input = clean();
  input.sources.identityRiskEvents = [identity({ id: 'idr-old', detectedAt: '2026-09-16T23:59:00Z' }), identity({ id: 'idr-edge', detectedAt: '2026-09-17T00:01:00Z' })];
  const result = brief([input])[0].json;
  assert.deepEqual(result.brief.needsDecision.map(row => [row.signalId, row.ageDays]), [['identityRiskEvents:idr-old', 4]]);
  assert.deepEqual(result.brief.whatChanged.map(row => [row.signalId, row.ageDays]), [['identityRiskEvents:idr-edge', 3]]);
  assert.equal(result.status, 'needs_review');
  assert.ok(result.brief.decisionRequested[0].startsWith('Identity owner: decide treatment for identityRiskEvents:idr-old'));
});

test('closed comes from source state or closedSince; unmatched closedSince ids become unknown rows', () => {
  const input = clean();
  input.sources.identityRiskEvents = [identity({ id: 'idr-done', riskState: 'dismissed' }), identity({ id: 'idr-team', riskState: 'atRisk' }), identity({ id: 'idr-odd', riskState: 'pending' })];
  input.closedSince = ['identityRiskEvents:idr-team', 'identityRiskEvents:idr-none'];
  const result = brief([input])[0].json;
  assert.deepEqual(result.brief.closed.map(row => [row.signalId, row.closedVia]), [['identityRiskEvents:idr-done', 'source_state'], ['identityRiskEvents:idr-team', 'closedSince']]);
  const [odd, ghost] = result.brief.unknown;
  assert.deepEqual(odd.findings, ['state_unknown:riskState']);
  assert.equal(ghost.signalId, 'identityRiskEvents:idr-none');
  assert.deepEqual(ghost.findings, ['closed_id_not_found']);
  assert.equal(ghost.source, 'identityRiskEvents');
  assert.equal(result.counts.total, 4);
});

test('same subject, topic, and UTC day across sources marks relatedTo both ways', () => {
  const input = clean();
  input.sources = only('identityRiskEvents', [identity({ id: 'idr-r', detectionType: 'waf.rule.disable', user: 'tol-waf-rule-0042' })]);
  input.sources.cloudflareAuditEvents = [{ id: 'cf-r', when: '2026-09-20T23:30:00Z', actorEmail: 'edge-admin@northwind-ledger.example', action: 'waf.rule.disable', resourceType: 'waf_rule', resourceId: 'tol-waf-rule-0042', interface: 'API' }];
  input.routing = [mediumRule, { ruleId: 'r-cf', source: 'cloudflareAuditEvents', match: { field: 'action', equals: 'waf.rule.disable' }, severity: 'high', ownerRole: 'Edge and DNS owner' }];
  const result = brief([input])[0].json;
  const rows = [...result.brief.whatChanged, ...result.brief.needsDecision];
  assert.deepEqual(rows.find(row => row.signalId === 'identityRiskEvents:idr-r').relatedTo, ['cloudflareAuditEvents:cf-r']);
  assert.deepEqual(rows.find(row => row.signalId === 'cloudflareAuditEvents:cf-r').relatedTo, ['identityRiskEvents:idr-r']);
});

test('drafting aid is disabled by default; when enabled the prompt names every signal id', () => {
  const disabled = brief(sample())[0].json.narrativeDraftingAid;
  assert.equal(disabled.enabled, false);
  assert.equal(disabled.status, 'disabled');
  assert.equal(disabled.prompt, null);
  const enabled = brief([packet({ aiDrafting: { enabled: true } })])[0].json;
  assert.equal(enabled.narrativeDraftingAid.status, 'prompt_ready');
  assert.equal(typeof enabled.narrativeDraftingAid.prompt, 'string');
  const ids = ['whatChanged', 'needsDecision', 'unknown', 'closed'].flatMap(name => enabled.brief[name].map(row => row.signalId));
  assert.equal(ids.length, 11);
  for (const id of ids) assert.ok(enabled.narrativeDraftingAid.prompt.includes(id), id);
  assert.ok(enabled.narrativeDraftingAid.label.startsWith('Drafting aid only.'));
});

test('blank prior brief reference is an issue, not invalid input; items keep their pairing', () => {
  const output = brief([packet({ previousBriefRef: '' }), clean()]);
  assert.equal(output[0].json.status, 'needs_review');
  assert.ok(output[0].json.issues.includes('prior brief reference missing; newness cannot be checked against an earlier brief.'));
  assert.equal(output[0].json.previousBriefRef, null);
  assert.deepEqual(output[1].pairedItem, { item: 1 });
  assert.equal(output[1].json.status, 'review_ready');
});
}

// ---- secret-exposure-response ----
{
const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const evaluate = (slug, rows) => {
  const code = file(`n8n/${slug}/evaluate.js`);
  // Execute our own checked-in Code-node source with n8n's input interface.
  return new Function('$input', code)({ all: () => rows.map(json => ({ json })) });
};
const slug = 'secret-exposure-response';
const run = rows => evaluate(slug, rows);
const sample = () => JSON.parse(file(`n8n/${slug}/sample-input.json`));
const alert = overrides => ({
  alertNumber: 1, repository: 'northwind-ledger/ledger-api', secretType: 'aws_access_key_id', secretTypeDisplayName: 'Cloud Access Key ID',
  state: 'resolved', resolution: 'revoked', createdAt: '2026-09-19T08:00:00Z', resolvedAt: '2026-09-19T09:00:00Z', pushProtectionBypassed: false, validity: 'inactive',
  locations: [{ type: 'commit', ref: 'config/app.env' }], htmlUrl: 'https://github.example/northwind-ledger/ledger-api/security/secret-scanning/1', ...overrides
});
const packet = overrides => ({
  reviewId: 'tol-test-review', asOf: '2026-09-20', snapshotComplete: true, evidenceRef: 'fixture://test-export',
  alerts: [alert({})],
  serviceCatalog: [{ repository: 'northwind-ledger/ledger-api', service: 'Ledger API', ownerRole: 'Platform lead', escalationRole: 'Security lead', environment: 'production', rotationRunbookRef: '' }],
  secretTypePolicy: [
    { secretType: 'aws_access_key_id', class: 'cloud_credential', revokeWithinHours: 4, rotationSteps: ['Replace key', 'Redeploy'] },
    { secretType: 'slack_webhook_url', class: 'messaging_webhook', revokeWithinHours: 24, rotationSteps: ['Regenerate webhook'] }
  ],
  ...overrides
});

test('sample input produces the checked-in expected output', () => {
  assert.deepEqual(run(sample()), JSON.parse(file(`n8n/${slug}/expected-output.json`)));
});

test('empty, null, and blank packets are invalid input', () => {
  for (const rows of [[{}], [null]]) {
    const result = run(rows)[0].json;
    assert.equal(result.status, 'invalid_input');
    assert.ok(result.issues.length > 0);
  }
  assert.equal(run([])[0].json.status, 'invalid_input');
});

test('incomplete snapshot and blank evidence both stay visible', () => {
  const [{ json }] = run([{ ...sample()[0], snapshotComplete: false, evidenceRef: '' }]);
  assert.equal(json.status, 'needs_review');
  assert.ok(json.issues.some(issue => /incomplete/i.test(issue)));
  assert.ok(json.issues.some(issue => /evidence reference/i.test(issue)));
  assert.equal(json.evidenceRef, null);
});

test('unknown owner and unclassified secret type stay unknown without defaults', () => {
  const [{ json }] = run([packet({ alerts: [
    alert({ alertNumber: 1, repository: 'northwind-ledger/not-in-catalog', state: 'open', resolution: null, resolvedAt: null }),
    alert({ alertNumber: 2, secretType: 'mystery_token', state: 'open', resolution: null, resolvedAt: null, validity: 'active' })
  ] })]);
  const [ownerless, unclassified] = json.rows;
  assert.equal(json.status, 'needs_review');
  assert.equal(ownerless.ownerRole, null);
  assert.equal(ownerless.service, null);
  assert.ok(ownerless.findings.includes('owner_unknown'));
  assert.equal(ownerless.ticket.assignee, null);
  assert.match(ownerless.ticket.body, /UNASSIGNED: owner unknown/);
  assert.equal(unclassified.class, null);
  assert.equal(unclassified.revokeWithinHours, null);
  assert.equal(unclassified.revokeDeadline, null);
  assert.equal(unclassified.timeToRevokeStatus, 'unknown');
  assert.equal(unclassified.ticket.priority, null);
  assert.match(unclassified.ticket.title, /^\[Unclassified\] Exposed unclassified secret in /);
  assert.ok(unclassified.findings.includes('secret_type_unclassified'));
  assert.equal(json.counts.unknown, 2);
  assert.equal(json.counts.ownerUnknown, 1);
  assert.deepEqual(json.unknownRows.map(row => row.alertNumber), [1, 2]);
});

test('a packet where every alert was revoked within target, classified, and owned is review ready', () => {
  const [{ json }] = run([packet({})]);
  assert.equal(json.status, 'review_ready');
  assert.deepEqual(json.issues, []);
  assert.deepEqual(json.counts, { total: 1, open: 0, overdue: 0, due: 0, revokedWithinTarget: 1, revokedAfterTarget: 0, unknown: 0, ownerUnknown: 0 });
  assert.deepEqual(json.unknownRows, []);
  assert.equal(json.rows[0].checklist.find(step => step.step === 'revoke_or_disable').state, 'complete');
  assert.ok(json.rows[0].checklist.filter(step => step.step !== 'revoke_or_disable').every(step => step.state === 'pending'));
});

test('duplicate alert keys, bad timestamps, and bad states are invalid input', () => {
  const invalid = [
    packet({ alerts: [alert({}), alert({})] }),
    packet({ alerts: [alert({ createdAt: '2026-09-19 08:00:00' })] }),
    packet({ alerts: [alert({ createdAt: '2026-02-30T08:00:00Z' })] }),
    packet({ alerts: [alert({ state: 'dismissed' })] }),
    packet({ alerts: [alert({ resolution: 'ignored' })] }),
    packet({ alerts: [alert({ state: 'open', resolution: null, resolvedAt: null, createdAt: '2026-09-21T00:00:00Z' })] }),
    packet({ serviceCatalog: [packet({}).serviceCatalog[0], packet({}).serviceCatalog[0]] })
  ];
  for (const input of invalid) assert.equal(run([input])[0].json.status, 'invalid_input');
  const sameNumberDifferentRepo = run([packet({ alerts: [alert({}), alert({ repository: 'northwind-ledger/billing-sync' })] })])[0].json;
  assert.notEqual(sameNumberDifferentRepo.status, 'invalid_input');
});

test('time-to-revoke boundaries are exact', () => {
  const rows = run([packet({ alerts: [
    alert({ alertNumber: 1, resolvedAt: '2026-09-19T12:00:00Z' }),
    alert({ alertNumber: 2, resolvedAt: '2026-09-19T12:00:01Z' }),
    alert({ alertNumber: 3, state: 'open', resolution: null, resolvedAt: null, createdAt: '2026-09-20T19:59:59Z' }),
    alert({ alertNumber: 4, state: 'open', resolution: null, resolvedAt: null, createdAt: '2026-09-20T19:59:58Z' })
  ] })])[0].json.rows;
  assert.equal(rows[0].timeToRevokeStatus, 'revoked_within_target');
  assert.equal(rows[1].timeToRevokeStatus, 'revoked_after_target');
  assert.equal(rows[2].timeToRevokeStatus, 'due');
  assert.equal(rows[3].timeToRevokeStatus, 'overdue');
  assert.ok(rows[3].findings.includes('revocation_overdue'));
  assert.equal(rows[2].ageHours, 4);
  assert.equal(rows[0].revokeDeadline, '2026-09-19T12:00:00Z');
});

test('non-revocation resolutions on active secrets are flagged and never marked complete', () => {
  const [{ json }] = run([packet({ alerts: [
    alert({ alertNumber: 1, resolution: 'false_positive', validity: 'active' }),
    alert({ alertNumber: 2, resolution: 'used_in_tests', validity: 'inactive' }),
    alert({ alertNumber: 3, resolution: 'revoked', resolvedAt: null })
  ] })]);
  const [active, inactive, undated] = json.rows;
  assert.equal(json.status, 'needs_review');
  assert.equal(active.timeToRevokeStatus, 'not_applicable_resolution');
  assert.deepEqual(active.findings, ['non_revocation_resolution_needs_review', 'active_secret_not_revoked']);
  assert.deepEqual(inactive.findings, ['non_revocation_resolution_needs_review']);
  assert.ok(active.checklist.every(step => step.state === 'pending'));
  assert.equal(undated.timeToRevokeStatus, 'unknown');
  assert.ok(undated.findings.includes('revocation_time_unknown'));
  assert.equal(undated.checklist.find(step => step.step === 'revoke_or_disable').state, 'pending');
  assert.equal(json.counts.unknown, 1);
});

test('ticket priority follows class and validity and pairedItem tracks each packet', () => {
  const results = run([
    packet({ alerts: [alert({ state: 'open', resolution: null, resolvedAt: null, validity: 'active' })] }),
    packet({ alerts: [alert({ secretType: 'slack_webhook_url', state: 'open', resolution: null, resolvedAt: null, validity: 'unknown' })] }),
    packet({ alerts: [alert({ validity: 'inactive' })] })
  ]);
  assert.equal(results[0].json.rows[0].ticket.priority, 'p1');
  assert.match(results[0].json.rows[0].ticket.title, /^\[Critical\] Exposed cloud credential in northwind-ledger\/ledger-api$/);
  assert.equal(results[1].json.rows[0].ticket.priority, 'p2');
  assert.equal(results[2].json.rows[0].ticket.priority, 'p3');
  assert.deepEqual(results.map(result => result.pairedItem), [{ item: 0 }, { item: 1 }, { item: 2 }]);
});
}

// ---- baseline-evidence-freshness ----
{
const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const evaluate = (slug, rows) => {
  const code = file(`n8n/${slug}/evaluate.js`);
  // Execute our own checked-in Code-node source with n8n's input interface.
  return new Function('$input', code)({ all: () => rows.map(json => ({ json })) });
};
const slug = 'baseline-evidence-freshness';
const run = rows => evaluate(slug, rows);
const fixture = () => JSON.parse(file(`n8n/${slug}/sample-input.json`));
const packet = () => fixture()[0];
const row = (result, id) => result.rows.find(entry => entry.controlId === id);
// A packet where every control is fresh, referenced, owned, and free of expiring exceptions.
const clean = () => {
  const input = packet();
  input.observations.observations = input.baseline.controls.map(control => ({
    id: control.id, applicable: true, value: true, implementation: 'native', scope_complete: true,
    reviewer: 'Fictional assessor', observed_at: '2026-09-19T12:00:00Z', evidence_ref: `fixture://clean/${control.id}`,
  }));
  input.controlOwners = input.baseline.controls.map(control => ({ controlId: control.id, ownerRole: 'Platform lead' }));
  return input;
};

test('sample input produces the checked-in expected output', () => {
  assert.deepEqual(run(fixture()), JSON.parse(file(`n8n/${slug}/expected-output.json`)));
  const result = run(fixture())[0].json;
  assert.equal(result.status, 'needs_review');
  assert.equal(result.counts.controls, 20);
  assert.equal(result.counts.stale, 1);
  assert.equal(result.counts.exceptionsExpiringSoon, 1);
  assert.equal(result.counts.ownerUnassigned, 5);
});

test('malformed packets return invalid_input without inventing a result', () => {
  for (const rows of [[{}], [null]]) {
    const result = run(rows)[0].json;
    assert.equal(result.status, 'invalid_input');
    assert.ok(result.issues.length > 0);
  }
  assert.equal(run([])[0].json.status, 'invalid_input');
});

test('incomplete snapshot and blank evidence reference both stay visible', () => {
  const input = { ...packet(), snapshotComplete: false, evidenceRef: '' };
  const result = run([input])[0].json;
  assert.equal(result.status, 'needs_review');
  assert.equal(result.evidenceRef, null);
  assert.ok(result.issues.some(issue => /snapshot is incomplete/i.test(issue)));
  assert.ok(result.issues.some(issue => /evidence reference/i.test(issue)));
});

test('a control without an owner row is grouped under null, never a default owner', () => {
  const result = run(fixture())[0].json;
  const unowned = row(result, 'CF-08');
  assert.equal(unowned.ownerRole, null);
  assert.ok(unowned.reminders.includes('owner_unassigned'));
  const groups = result.remindersByOwner;
  assert.equal(groups[groups.length - 1].ownerRole, null);
  assert.ok(groups.slice(0, -1).every(group => typeof group.ownerRole === 'string'));
  const missingDate = row(result, 'CF-18');
  assert.equal(missingDate.freshness, 'missing_observation_date');
  assert.equal(missingDate.evidenceAgeDays, null);
  assert.equal(missingDate.assessStatusHint, 'would_be_unknown');
});

test('a clean packet returns review_ready', () => {
  const result = run([clean()])[0].json;
  assert.equal(result.status, 'review_ready');
  assert.deepEqual(result.issues, []);
  assert.equal(result.counts.remindersTotal, 0);
  assert.equal(result.counts.fresh, 20);
  assert.deepEqual(result.remindersByOwner, []);
});

test('stale evidence uses the assess.mjs window arithmetic on whole UTC days', () => {
  const input = clean();
  const target = input.observations.observations.find(entry => entry.id === 'CF-01');
  // 90 days before asOf midnight is exactly at the window edge and still accepted.
  target.observed_at = '2026-06-22T00:00:00Z';
  assert.equal(row(run([input])[0].json, 'CF-01').freshness, 'fresh');
  target.observed_at = '2026-06-21T23:59:59Z';
  const stale = row(run([input])[0].json, 'CF-01');
  assert.equal(stale.freshness, 'stale');
  assert.equal(stale.evidenceAgeDays, 90);
  assert.ok(stale.reminders.includes('evidence_stale'));
});

test('future-dated evidence and missing observations are separate reminders', () => {
  const input = clean();
  input.observations.observations[0].observed_at = '2026-09-21T00:00:00Z';
  input.observations.observations.splice(1, 1);
  const result = run([input])[0].json;
  assert.equal(result.status, 'needs_review');
  assert.equal(row(result, 'CF-01').freshness, 'future_dated');
  assert.deepEqual(row(result, 'CF-01').reminders, ['evidence_future_dated']);
  assert.equal(row(result, 'CF-02').freshness, 'missing_observation');
  assert.equal(row(result, 'CF-02').evidenceReference, 'missing');
  assert.deepEqual(row(result, 'CF-02').reminders, ['observation_missing']);
  assert.equal(result.counts.observed, 19);
  assert.equal(result.counts.missingEvidenceReference, 0);
});

test('exceptions report active, expiring soon, or expired with the due date carried into reminders', () => {
  const input = clean();
  const [first, second, third] = input.observations.observations;
  const exception = { owner: 'Identity owner', reason: 'Fictional reason.', compensating_control: 'Fictional compensating control.' };
  first.exception = { ...exception, expires_on: '2026-10-05' };
  second.exception = { ...exception, expires_on: '2026-09-19' };
  third.exception = { ...exception, expires_on: '2026-12-01' };
  const result = run([input])[0].json;
  assert.deepEqual(row(result, 'CF-01').exception, { owner: 'Identity owner', expires_on: '2026-10-05', state: 'active', daysToExpiry: 15, expiringSoon: true });
  assert.deepEqual(row(result, 'CF-02').exception.state, 'expired');
  assert.deepEqual(row(result, 'CF-02').reminders, ['exception_expired']);
  assert.deepEqual(row(result, 'CF-03').reminders, []);
  assert.equal(result.counts.exceptionsActive, 2);
  assert.equal(result.counts.exceptionsExpiringSoon, 1);
  assert.equal(result.counts.exceptionsExpired, 1);
  const group = result.remindersByOwner[0];
  assert.equal(group.controls.find(control => control.controlId === 'CF-01').dueBy, '2026-10-05');
  assert.equal(group.controls.find(control => control.controlId === 'CF-02').dueBy, '2026-09-20');
});

test('observation contract violations are invalid_input with specific issues', () => {
  const cases = [
    [input => { input.observations.observations.push({ ...input.observations.observations[0] }); }, /Duplicate observation ids/],
    [input => { input.observations.observations[0].id = 'CF-99'; }, /unknown control CF-99/],
    [input => { input.observations.observations[0].observed_at = '2026-09-19 12:00:00'; }, /observed_at must be a real UTC timestamp/],
    [input => { input.observations.observations[0].implementation = 'partial'; }, /implementation must be/],
    [input => { input.observations.baseline_version = '9.9.9'; }, /must match the embedded baseline/],
    [input => { input.observations.observations[0].exception = { owner: 'x', reason: 'y', compensating_control: 'z', expires_on: '2026-02-30' }; }, /expires_on must be a real/],
    [input => { input.controlOwners.push({ controlId: 'CF-01', ownerRole: 'Second owner' }); }, /Duplicate controlOwners/],
    [input => { input.asOf = '20-09-2026'; }, /asOf must be a real/],
  ];
  for (const [mutate, pattern] of cases) {
    const input = packet();
    mutate(input);
    const result = run([input])[0].json;
    assert.equal(result.status, 'invalid_input');
    assert.ok(result.issues.some(issue => pattern.test(issue)), `expected ${pattern} in ${JSON.stringify(result.issues)}`);
  }
});

test('every would_be_unknown hint is reported unknown by assess.mjs for the same asOf', () => {
  const input = packet();
  const desired = JSON.parse(file('baselines/cloudflare/desired-state.json'));
  const report = assess(desired, input.observations, { asOf: input.asOf });
  const statuses = new Map(report.results.map(result => [result.id, result.status]));
  const result = run([input])[0].json;
  const hinted = result.rows.filter(entry => entry.assessStatusHint === 'would_be_unknown');
  assert.ok(hinted.length > 0);
  for (const entry of hinted) assert.equal(statuses.get(entry.controlId), 'unknown', `${entry.controlId} hinted unknown but assess.mjs said ${statuses.get(entry.controlId)}`);
  // The hint is a lower bound: assess.mjs may add unknowns this workflow does not model (missing reviewer, unsupported mode).
  assert.equal(result.rows.filter(entry => entry.assessStatusHint === 'evaluable' && statuses.get(entry.controlId) === 'aligned').length > 0, true);
});
}

// ---- phishing-report-triage ----
{
const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const evaluate = (slug, rows) => {
  const code = file(`n8n/${slug}/evaluate.js`);
  // Execute our own checked-in Code-node source with n8n's input interface.
  return new Function('$input', code)({ all: () => rows.map(json => ({ json })) });
};
const slug = 'phishing-report-triage';
const triage = rows => evaluate(slug, rows);
const sample = () => JSON.parse(file(`n8n/${slug}/sample-input.json`));
const expected = () => JSON.parse(file(`n8n/${slug}/expected-output.json`));
const packet = (reports, overrides = {}) => ({ ...sample()[0], reports, ...overrides });
const legitimate = () => sample()[0].reports[1];
const report = overrides => ({ ...legitimate(), reportId: 'tol-phish-test', ...overrides });
const run = (reports, overrides) => triage([packet(reports, overrides)])[0].json;

test('sample input reproduces the checked-in expected output exactly', () => {
  assert.deepEqual(triage(sample()), expected());
  const result = triage(sample())[0].json;
  assert.equal(result.status, 'needs_review');
  assert.deepEqual(result.rows.map(row => row.verdict), ['malicious_likely', 'likely_legitimate', 'suspicious', 'undetermined']);
  assert.deepEqual(result.rows.map(row => row.ownerRole), ['Security owner', 'Service desk', 'Service desk', 'Service desk']);
});

test('malformed packets return invalid_input without inventing a verdict', () => {
  assert.equal(triage([{}])[0].json.status, 'invalid_input');
  assert.equal(triage([null])[0].json.status, 'invalid_input');
  assert.equal(triage([])[0].json.status, 'invalid_input');
  const base = sample()[0];
  const duplicate = { ...base, reports: [base.reports[1], { ...base.reports[1] }] };
  const noRouting = { ...base };
  delete noRouting.routing;
  for (const input of [duplicate, noRouting, packet([report({ reportId: '' })]), packet([report({ fromHeader: '' })]), packet([report({ urls: 'https://payroll-portal.example' })]), packet([report({ urls: [42] })])]) {
    const result = triage([input])[0].json;
    assert.equal(result.status, 'invalid_input');
    assert.ok(result.issues.length > 0);
  }
});

test('incomplete snapshot and missing evidence stay visible as issues', () => {
  const result = run([legitimate()], { snapshotComplete: false, evidenceRef: '' });
  assert.equal(result.status, 'needs_review');
  assert.equal(result.evidenceRef, null);
  assert.ok(result.issues.some(issue => issue.includes('incomplete')));
  assert.ok(result.issues.some(issue => issue.includes('evidence reference')));
});

test('blank Authentication-Results and blank reporter role remain unknown, never pass', () => {
  const result = run([report({ reporterRole: '', authenticationResultsHeader: '' })]);
  const row = result.rows[0];
  assert.equal(row.reporterRole, null);
  assert.deepEqual([row.authentication.spf, row.authentication.dkim, row.authentication.dmarc], ['unknown', 'unknown', 'unknown']);
  assert.equal(row.authentication.present, false);
  assert.equal(row.authentication.dkimAligned, false);
  assert.ok(row.findings.includes('authentication_results_missing'));
  assert.ok(row.findings.includes('reporter_unknown'));
  assert.equal(row.verdict, 'undetermined');
  assert.equal(result.status, 'needs_review');
});

test('a clean allowlisted report with aligned authentication is review_ready', () => {
  const result = run([legitimate()]);
  assert.equal(result.status, 'review_ready');
  assert.deepEqual(result.issues, []);
  assert.equal(result.rows[0].verdict, 'likely_legitimate');
  assert.deepEqual(result.rows[0].recommendedActions, ['no_action']);
  assert.equal(result.counts.likelyLegitimate, 1);
});

test('percent-encoded redirect parameter is decoded and its target evaluated once', () => {
  const url = 'https://go.example/r?u=https%253A%252F%252Fnorthwlnd-ledger.example%252Flogin%3Fnext%3Dhttps%253A%252F%252Fgo.example%252Fx';
  const row = run([report({ urls: [url] })]).rows[0].urls[0];
  assert.equal(row.query[0].key, 'u');
  assert.equal(row.query[0].decodeRounds, 2);
  assert.equal(row.query[0].decodedValue, 'https://northwlnd-ledger.example/login?next=https://go.example/x');
  assert.ok(row.findings.includes('url_redirect_parameter'));
  assert.ok(row.findings.includes('url_lookalike_host'));
  assert.equal(row.redirectTarget.host, 'northwlnd-ledger.example');
  assert.equal(row.redirectTarget.redirectTarget, null);
  assert.equal(row.classification, 'suspicious');
});

test('base64 query values decode with the built-in decoder and record the truncated text', () => {
  const row = run([report({ urls: ['https://supplier-billing.example/view?doc=aHR0cHM6Ly9ldmlsLmV4YW1wbGUvbG9naW4='] })]).rows[0].urls[0];
  assert.ok(row.findings.includes('url_base64_parameter'));
  assert.equal(row.base64Decoded, 'https://evil.example/login');
  const plain = run([report({ urls: ['https://payroll-portal.example/view?doc=statement-september-2026'] })]).rows[0].urls[0];
  assert.ok(!plain.findings.includes('url_base64_parameter'));
  assert.equal(plain.base64Decoded, null);
});

test('defanged URLs are normalized before parsing', () => {
  const row = run([report({ urls: ['hxxps://short[.]example/a1b2'] })]).rows[0].urls[0];
  assert.equal(row.normalized, 'https://short.example/a1b2');
  assert.equal(row.scheme, 'https');
  assert.equal(row.host, 'short.example');
  assert.ok(row.findings.includes('url_shortener'));
  assert.ok(!row.findings.includes('url_non_https'));
  const http = run([report({ urls: ['hxxp[:]//203.0.113.10/login'] })]).rows[0].urls[0];
  assert.equal(http.host, '203.0.113.10');
  assert.ok(http.findings.includes('url_host_is_ip'));
  assert.ok(http.findings.includes('url_non_https'));
});

test('lookalike sender domains are flagged by edit distance and by digit substitution', () => {
  const distance = run([report({ fromHeader: 'Payroll <notices@northwlnd-ledger.example>', authenticationResultsHeader: 'mx.northwind-ledger.example; spf=pass smtp.mailfrom=northwlnd-ledger.example; dkim=pass header.d=northwlnd-ledger.example; dmarc=pass header.from=northwlnd-ledger.example' })]).rows[0];
  assert.ok(distance.findings.includes('lookalike_domain'));
  assert.deepEqual(distance.sender.lookalikeMatches, [{ reference: 'northwind-ledger.example', rule: 'edit_distance_1_or_2' }]);
  assert.equal(distance.verdict, 'malicious_likely');
  const digits = run([report({ fromHeader: 'Notices <notices@payr011-p0rta1.example>' })]).rows[0];
  assert.deepEqual(digits.sender.lookalikeMatches, [{ reference: 'payroll-portal.example', rule: 'digit_or_glyph_substitution' }]);
  assert.equal(digits.verdict, 'malicious_likely');
  const exact = run([report({ fromHeader: 'Notices <notices@mail.northwind-ledger.example>' })]).rows[0];
  assert.ok(!exact.findings.includes('lookalike_domain'));
});

test('display-name impersonation only applies when the address domain is external', () => {
  const internal = run([report({ fromHeader: 'IT Support <helpdesk@northwind-ledger.example>' })]).rows[0];
  assert.ok(!internal.findings.includes('display_name_impersonates_internal'));
  const external = run([report({ fromHeader: 'IT Support <helpdesk@support-desk.example>' })]).rows[0];
  assert.ok(external.findings.includes('display_name_impersonates_internal'));
  assert.equal(external.verdict, 'suspicious');
  const executable = run([report({ attachments: [{ name: 'invoice.docm', extension: 'docm' }] })]).rows[0];
  assert.ok(executable.findings.includes('attachment_executable_or_macro'));
  assert.equal(executable.verdict, 'malicious_likely');
});
}

// ---- mfa-coverage-reconciliation ----
{
const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const slug = 'mfa-coverage-reconciliation';
const evaluate = rows => {
  const code = file(`n8n/${slug}/evaluate.js`);
  // Execute our own checked-in Code-node source with n8n's input interface.
  return new Function('$input', code)({ all: () => rows.map(json => ({ json })) });
};
const sample = () => JSON.parse(file(`n8n/${slug}/sample-input.json`));
const run = packet => evaluate([packet])[0].json;
const note = 'Counts, not a percentage; unknown accounts are listed, not excluded.';

const policy = { phishingResistant: ['fido2SecurityKey', 'passkeyDeviceBound'], acceptable: ['microsoftAuthenticatorPush', 'softwareOath'], weak: ['sms'] };
const user = overrides => ({ userId: 'tol-usr-100', userPrincipalName: 'platform.lead@northwind-ledger.example', accountEnabled: true, userType: 'member', lastSignInAt: '2026-09-19T08:00:00Z', registeredMethods: ['fido2SecurityKey'], mfaCapable: true, employeeId: 'tol-emp-100', ...overrides });
const worker = overrides => ({ employeeId: 'tol-emp-100', workerStatus: 'active', managerRole: 'Technology director', department: 'Platform', ...overrides });
const clean = () => ({
  reviewId: 'tol-mfa-test', asOf: '2026-09-20', snapshotComplete: true, evidenceRef: 'fixture://identity-test', dormantAfterDays: 45,
  matching: { key: 'employeeId' }, methodPolicy: policy, identityUsers: [user()], hrRoster: [worker()],
  privilegedRoles: [{ roleId: 'tol-role-admin', roleName: 'Administrator (fictional)', memberUserIds: ['tol-usr-100'] }]
});

test('sample input produces the checked-in expected output', () => {
  assert.deepEqual(evaluate(sample()), JSON.parse(file(`n8n/${slug}/expected-output.json`)));
});

test('sample is needs_review with the documented queue order and counts', () => {
  const result = run(sample()[0]);
  assert.equal(result.status, 'needs_review');
  assert.deepEqual(result.queue.map(row => row.userId ?? row.employeeId), ['tol-usr-001', 'tol-usr-007', 'tol-usr-006', 'tol-usr-003', 'tol-usr-004', 'tol-usr-005', 'tol-usr-990', 'tol-emp-1006', 'tol-usr-008']);
  assert.equal(result.counts.privilegedWithoutPhishingResistant, 1);
  assert.equal(result.counts.unknown, 2);
  assert.deepEqual(result.coverage.privileged, { inScope: 3, phishingResistant: 1, unknown: 1, note });
  assert.ok(result.queue.every(row => row.decision === 'pending_human_review'));
});

test('malformed packets return invalid_input as data', () => {
  for (const rows of [[{}], [null]]) {
    const [result] = evaluate(rows);
    assert.equal(result.json.status, 'invalid_input');
    assert.ok(result.json.issues.length > 0);
    assert.deepEqual(result.pairedItem, { item: 0 });
  }
  assert.equal(evaluate([])[0].json.status, 'invalid_input');
});

test('duplicates, bad timestamps, non-boolean flags, and overlapping tiers are invalid', () => {
  const base = clean();
  const variants = [
    { identityUsers: [user(), user()] },
    { hrRoster: [worker(), worker()] },
    { privilegedRoles: [...base.privilegedRoles, ...base.privilegedRoles] },
    { identityUsers: [user({ lastSignInAt: '2026-02-30T00:00:00Z' })] },
    { identityUsers: [user({ lastSignInAt: '2026-09-19 08:00:00' })] },
    { identityUsers: [user({ lastSignInAt: '2026-09-21T00:00:00Z' })] },
    { identityUsers: [user({ accountEnabled: 'true' })] },
    { identityUsers: [user({ registeredMethods: ['sms', 'sms'] })] },
    { identityUsers: [user({ employeeId: null })] },
    { methodPolicy: { ...policy, weak: ['sms', 'softwareOath'] } },
    { methodPolicy: { ...policy, acceptable: ['softwareOath', ''] } },
    { matching: { key: 'userPrincipalName' } },
    { dormantAfterDays: 0 }
  ];
  for (const variant of variants) assert.equal(run({ ...base, ...variant }).status, 'invalid_input', JSON.stringify(variant));
});

test('incomplete snapshot and blank evidence stay needs_review with both issues listed', () => {
  const result = run({ ...clean(), snapshotComplete: false, evidenceRef: '' });
  assert.equal(result.status, 'needs_review');
  assert.equal(result.issues.length, 2);
  assert.ok(result.issues.some(issue => /incomplete/i.test(issue)));
  assert.ok(result.issues.some(issue => /evidence/i.test(issue)));
  assert.equal(result.evidenceRef, null);
  assert.deepEqual(result.queue, []);
});

test('unknowns stay unknown instead of becoming a default', () => {
  const packet = clean();
  packet.identityUsers = [
    user({ userId: 'tol-usr-201', employeeId: '' }),
    user({ userId: 'tol-usr-202', employeeId: 'tol-emp-202', registeredMethods: ['legacyHardwareToken'] }),
    user({ userId: 'tol-usr-203', employeeId: 'tol-emp-203', registeredMethods: [], mfaCapable: null }),
    user({ userId: 'tol-usr-204', employeeId: 'tol-emp-204', lastSignInAt: null })
  ];
  packet.hrRoster = [worker({ employeeId: 'tol-emp-202' }), worker({ employeeId: 'tol-emp-203' }), worker({ employeeId: 'tol-emp-204' })];
  packet.privilegedRoles = [{ roleId: 'tol-role-admin', roleName: 'Administrator (fictional)', memberUserIds: ['tol-usr-202', 'tol-usr-999'] }];
  const result = run(packet);
  const byId = Object.fromEntries(result.queue.map(row => [row.userId, row]));
  assert.equal(byId['tol-usr-201'].rosterMatch, 'employee_id_missing');
  assert.deepEqual(byId['tol-usr-201'].queues, ['unknown']);
  assert.deepEqual(byId['tol-usr-201'].findings, ['employee_id_missing']);
  assert.equal(byId['tol-usr-202'].enrollment, 'unknown');
  assert.deepEqual(byId['tol-usr-202'].queues, ['privileged_without_phishing_resistant', 'unknown']);
  assert.ok(byId['tol-usr-202'].findings.includes('method_unrecognized'));
  assert.equal(byId['tol-usr-203'].enrollment, 'unknown');
  assert.deepEqual(byId['tol-usr-203'].findings, ['enrollment_unknown']);
  assert.deepEqual(byId['tol-usr-204'].findings, ['last_sign_in_unknown']);
  assert.equal(byId['tol-usr-204'].dormant, false);
  assert.deepEqual(byId['tol-usr-999'].findings, ['privileged_member_not_found']);
  assert.equal(byId['tol-usr-999'].userPrincipalName, null);
  assert.equal(result.counts.enrollmentUnknown, 2);
  assert.equal(result.counts.notEnrolled, 0);
  assert.equal(result.coverage.privileged.unknown, 2);
  assert.equal(result.counts.unknown, 5);
});

test('a clean packet returns review_ready with an empty queue and count-based coverage', () => {
  const result = run(clean());
  assert.equal(result.status, 'review_ready');
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.queue, []);
  assert.equal(result.counts.enrolledPhishingResistant, 1);
  assert.deepEqual(result.coverage.allEnabledMembers, { inScope: 1, enrolledAnyRecognizedMethod: 1, notEnrolled: 0, unknown: 0 });
  assert.ok(!JSON.stringify(result.coverage).includes('%'));
});

test('privileged accounts need a phishing-resistant method; acceptable is not enough', () => {
  const packet = clean();
  packet.identityUsers = [user(), user({ userId: 'tol-usr-101', employeeId: 'tol-emp-101', registeredMethods: ['microsoftAuthenticatorPush'] })];
  packet.hrRoster = [worker(), worker({ employeeId: 'tol-emp-101' })];
  packet.privilegedRoles[0].memberUserIds = ['tol-usr-100', 'tol-usr-101'];
  const result = run(packet);
  assert.deepEqual(result.queue.map(row => row.userId), ['tol-usr-101']);
  assert.deepEqual(result.queue[0].queues, ['privileged_without_phishing_resistant']);
  assert.equal(result.queue[0].enrollment, 'acceptable');
  assert.deepEqual(result.coverage.privileged, { inScope: 2, phishingResistant: 1, unknown: 0, note });
});

test('an unrecognized method beside a recognized one keeps the tier and adds a finding', () => {
  const packet = clean();
  packet.privilegedRoles = [];
  packet.identityUsers = [user({ registeredMethods: ['softwareOath', 'legacyHardwareToken'] })];
  const [row] = run(packet).queue;
  assert.equal(row.enrollment, 'acceptable');
  assert.deepEqual(row.unrecognizedMethods, ['legacyHardwareToken']);
  assert.deepEqual(row.findings, ['method_unrecognized']);
  assert.deepEqual(row.queues, ['unknown']);
});

test('weak-only, not enrolled, dormant, and terminated members are queued; guests are reported separately', () => {
  const packet = clean();
  packet.privilegedRoles = [];
  packet.identityUsers = [
    user({ userId: 'tol-usr-301', employeeId: 'tol-emp-301', registeredMethods: ['sms'] }),
    user({ userId: 'tol-usr-302', employeeId: 'tol-emp-302', registeredMethods: [], mfaCapable: false }),
    user({ userId: 'tol-usr-303', employeeId: 'tol-emp-303', lastSignInAt: '2026-08-06T23:59:59Z' }),
    user({ userId: 'tol-usr-304', employeeId: 'tol-emp-304', lastSignInAt: '2026-08-07T00:00:00Z' }),
    user({ userId: 'tol-usr-305', employeeId: 'tol-emp-305', accountEnabled: false, registeredMethods: [], mfaCapable: false }),
    user({ userId: 'tol-usr-306', employeeId: '', userType: 'guest', registeredMethods: [], mfaCapable: false }),
    user({ userId: 'tol-usr-307', employeeId: 'tol-emp-307' })
  ];
  packet.hrRoster = ['301', '302', '303', '304', '305'].map(n => worker({ employeeId: `tol-emp-${n}` }))
    .concat(worker({ employeeId: 'tol-emp-307', workerStatus: 'terminated' }), worker({ employeeId: 'tol-emp-308', workerStatus: 'leave' }));
  const result = run(packet);
  const byId = Object.fromEntries(result.queue.map(row => [row.userId, row]));
  assert.deepEqual(byId['tol-usr-301'].findings, ['weak_methods_only']);
  assert.deepEqual(byId['tol-usr-301'].queues, ['not_enrolled']);
  assert.deepEqual(byId['tol-usr-302'].findings, ['not_enrolled']);
  assert.equal(byId['tol-usr-303'].daysSinceSignIn, 45);
  assert.equal(byId['tol-usr-303'].dormant, true);
  assert.equal(byId['tol-usr-304'], undefined);
  assert.equal(byId['tol-usr-305'], undefined);
  assert.deepEqual(byId['tol-usr-306'].queues, ['non_member_account_review']);
  assert.deepEqual(byId['tol-usr-307'].queues, ['active_account_terminated_in_roster']);
  assert.equal(result.counts.notEnrolled, 3);
  assert.equal(result.counts.rosterNoAccount, 0);
  assert.deepEqual(result.queue.map(row => row.userId), ['tol-usr-307', 'tol-usr-301', 'tol-usr-302', 'tol-usr-303', 'tol-usr-306']);
});

test('active roster members without an account are queued; UPN is never used for matching', () => {
  const packet = clean();
  packet.privilegedRoles = [];
  packet.identityUsers = [user({ userPrincipalName: 'tol-emp-400@northwind-ledger.example', employeeId: 'tol-emp-401' })];
  packet.hrRoster = [worker({ employeeId: 'tol-emp-400' }), worker({ employeeId: 'tol-emp-401' })];
  const result = run(packet);
  assert.deepEqual(result.queue.map(row => [row.userId, row.employeeId, row.queues]), [[null, 'tol-emp-400', ['roster_member_no_account']]]);
  assert.equal(result.counts.rosterNoAccount, 1);
});

test('multiple packets keep their pairedItem linkage', () => {
  const results = evaluate([clean(), { ...clean(), reviewId: '' }]);
  assert.equal(results[0].json.status, 'review_ready');
  assert.equal(results[1].json.status, 'invalid_input');
  assert.deepEqual(results[1].pairedItem, { item: 1 });
});
}
