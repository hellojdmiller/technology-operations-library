import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const fixture = slug => JSON.parse(read(`n8n/${slug}/sample-input.json`))[0];
const runAll = (slug, packets) => new Function('$input', read(`n8n/${slug}/evaluate.js`))({ all: () => packets.map(json => ({ json })) });
const run = (slug, packet) => runAll(slug, [packet])[0].json;
const C = 'change-readiness-review', A = 'asset-reconciliation-review', P = 'patch-exception-review';
const single = (slug, list) => { const p = fixture(slug); p[list] = [p[list][0]]; if (slug === A) p.observations = [p.observations[0]]; return p; };
for (const [slug, list, id] of [[C,'changes','requestId'],[A,'inventory','assetId'],[P,'findings','findingId']]) {
  test(`${slug}: malformed packet dates, omitted fields and duplicate IDs cannot pass`, () => {
    for (const p of [null, {}, {...fixture(slug), asOf:'2026-02-30T12:00:00Z'}, {...fixture(slug), asOf:'2026-09-17'}, {...fixture(slug), evidenceRef:42}]) assert.equal(run(slug,p).status,'invalid_input');
    const p = fixture(slug);p[list].push({...p[list][0]});assert.equal(run(slug,p).status,'invalid_input');
    assert.equal(runAll(slug,[])[0].json.status,'invalid_input');
    assert.deepEqual(runAll(slug,[fixture(slug),fixture(slug)])[1].pairedItem,{item:1});
  });
  test(`${slug}: missing scope or source evidence remains unresolved`, () => {
    const p = fixture(slug);p.snapshotComplete=false;p.evidenceRef=null;p[list]=[];
    const r=run(slug,p);assert.equal(r.status,'needs_review');
    assert.ok(r.issues.some(x=>/incomplete/i.test(x)));assert.ok(r.issues.some(x=>/evidence/i.test(x)));assert.ok(r.issues.some(x=>/empty/i.test(x)));
  });
  test(`${slug}: complete supplied metadata is only review-ready and input is not mutated`, () => {
    const p=single(slug,list), before=structuredClone(p);const r=run(slug,p);
    assert.equal(r.status,'review_ready');assert.deepEqual(p,before);assert.equal(r.rows[0].decision,'pending_human_review');
  });
}
test('change: emergency always routes to manual review even with all metadata', () => {
  const p=single(C,'changes');p.changes[0].changeType='emergency';
  assert.equal(run(C,p).rows[0].status,'manual_emergency_review');
});
test('change: false, null, and missing evidence do not become authorization', () => {
  for (const v of [false,null]) {const p=single(C,'changes');p.changes[0].authorizationVerified=v;assert.ok(run(C,p).rows[0].findings.includes('authorizationVerified_not_confirmed'));}
  const p=single(C,'changes');p.changes[0].authorizationEvidenceRef=' ';assert.equal(run(C,p).status,'needs_review');
  p.changes[0].authorizationVerified='true';assert.equal(run(C,p).status,'invalid_input');
});
test('change: exact expiry blocks a standard model; later valid model still does not authorize execution', () => {
  const p=single(C,'changes');Object.assign(p.changes[0],{changeType:'standard',standardModelMatch:true,standardModelRef:'fixture://model',standardModelValidUntil:p.asOf});
  assert.ok(run(C,p).rows[0].findings.includes('standard_model_expired'));
  p.changes[0].standardModelValidUntil='2026-09-18T12:00:00Z';assert.equal(run(C,p).rows[0].status,'packet_complete_for_review');
  p.changes[0].standardModelMatch=false;assert.equal(run(C,p).status,'needs_review');
});
test('asset: equal totals do not hide missing or unexpected assets, exact ID mapping required', () => {
  const p=single(A,'inventory');p.observations[0].assetId='ex-asset-001';const r=run(A,p);
  assert.equal(r.totalRows,2);assert.ok(r.rows[0].findings.includes('observation_missing'));assert.ok(r.rows[1].findings.includes('observation_not_in_inventory'));
});
test('asset: new custody evidence cannot refresh stale management evidence', () => {
  const p=single(A,'inventory');p.observations[0].managementObservedAt='2026-09-01T12:00:00Z';p.observations[0].custodyObservedAt=p.asOf;
  const r=run(A,p);assert.ok(r.rows[0].findings.includes('management_observation_stale'));assert.equal(r.rows[0].custodyAgeDays,0);
});
test('asset: duplicate observations and future timestamps are invalid', () => {
  const p=single(A,'inventory');p.observations.push({...p.observations[0]});assert.equal(run(A,p).status,'invalid_input');p.observations.pop();p.observations[0].custodyObservedAt='2026-09-18T12:00:00Z';assert.equal(run(A,p).status,'invalid_input');
});
test('asset: unknown custody and management, retired observations, and exact age boundary remain explicit', () => {
  const p=single(A,'inventory');p.observations[0].managementObservedAt='2026-09-10T12:00:00Z';assert.equal(run(A,p).status,'review_ready');
  Object.assign(p.observations[0],{managed:null,custodianId:null,custodyObservedAt:null});let r=run(A,p);assert.ok(r.rows[0].findings.includes('required_management_unconfirmed'));assert.ok(r.rows[0].findings.includes('observed_custodian_unknown'));
  p.inventory[0].lifecycle='retired';assert.ok(run(A,p).rows[0].findings.includes('retired_asset_has_observation'));
});
test('patch: active documented exception does not erase overdue remediation', () => {
  const p=fixture(P);p.findings=[p.findings[1]];p.findings[0].exception.expiresAt='2026-09-18T12:00:00Z';const r=run(P,p);
  assert.equal(r.status,'needs_review');assert.equal(r.rows[0].exceptionState,'documented_exception_for_review');assert.ok(r.rows[0].findings.includes('remediation_overdue'));
});
test('patch: exception expiry is exclusive and missing approval or scope is unsupported', () => {
  const p=fixture(P);p.findings=[p.findings[1]];assert.equal(run(P,p).rows[0].exceptionState,'unsupported_or_expired_exception');
  p.findings[0].exception.expiresAt='2026-09-18T12:00:00Z';p.findings[0].exception.scopeConfirmed=null;assert.equal(run(P,p).rows[0].exceptionState,'unsupported_or_expired_exception');
  p.findings[0].exception.scopeConfirmed=true;p.findings[0].exception.effectiveAt='2026-09-18T13:00:00Z';assert.equal(run(P,p).status,'invalid_input');
});
test('patch: claimed fixed without current evidence stays open; no observation never means fixed', () => {
  const p=single(P,'findings');p.findings[0].observation.observedAt='2026-09-01T12:00:00Z';p.findings[0].dueAt='2026-09-15T12:00:00Z';let r=run(P,p);assert.ok(r.rows[0].findings.includes('remediation_overdue'));
  p.findings[0].observation.observedAt=null;assert.ok(run(P,p).rows[0].findings.includes('observation_time_unknown'));
});
test('patch: applicability contradiction and exploitation assessment cannot disappear after fixed status', () => {
  const p=single(P,'findings');p.findings[0].applicability='not_affected';p.findings[0].observation.state='vulnerable';assert.ok(run(P,p).rows[0].findings.includes('contradictory_applicability_and_observation'));
  p.findings[0].observation.state='fixed';p.findings[0].exploited=true;assert.ok(run(P,p).rows[0].findings.includes('exploitation_assessment_required'));
});
test('patch: due-at equality is due now; a passed target date does not assert a historical breach', () => {
  const p=single(P,'findings');p.findings[0].dueAt=p.asOf;p.findings[0].observation.state='vulnerable';assert.ok(run(P,p).rows[0].findings.includes('remediation_due_now'));
  p.findings[0].dueAt='2026-09-16T12:00:00Z';p.findings[0].observation.state='fixed';const r=run(P,p);assert.equal(r.rows[0].targetDatePassed,true);assert.equal(r.status,'review_ready');assert.ok(!r.rows[0].findings.includes('remediation_overdue'));
});
