import assert from 'node:assert/strict';
import { createHarness } from './harness.mjs';
import { START, writeProposal } from './fixtures.mjs';

const approved = (h, overrides = {}, session = 'a1') => {
  const p = writeProposal(overrides);
  p.approvalId = h.operator.approve(session, p, START + 60_000);
  return p;
};
const denied = (out, reason) => { assert.equal(out.status, 'denied'); assert.equal(out.reason, reason); };
export const cases = [
  { id: 'scoped-retrieval', question: 'Can the operator read their source without retrieving another user’s note?', run(h) {
    const agent = h.connect('a1');
    assert.equal(agent.propose({ kind: 'read-document', target: 'doc-a' }).status, 'read');
    denied(agent.propose({ kind: 'read-document', target: 'doc-b' }), 'read_not_authorized');
    assert.ok(!JSON.stringify(h.snapshot().outputs).includes('SYNTHETIC-CANARY-47'));
  } },
  { id: 'untrusted-instructions', question: 'Can retrieved content or a tool result manufacture permission?', run(h) {
    const agent = h.connect('a1');
    for (const target of ['injected-doc', 'tool-result']) {
      assert.equal(agent.propose({ kind: 'read-document', target }).trust, 'untrusted_data_not_authority');
      denied(agent.propose(writeProposal()), 'approval_missing_mismatched_or_expired');
      denied(agent.propose({ ...writeProposal(), approved: true }), 'malformed_proposal');
      denied(agent.propose({ kind: 'read-document', target: 'doc-b' }), 'read_not_authorized');
    }
    const p = approved(h);
    assert.equal(agent.propose(p).status, 'acknowledged_unverified');
    assert.equal(h.operator.reconcile(p.operationId).status, 'verified_effect');
  } },
  { id: 'approval-binding', question: 'Does changing the target or text require a new approval?', run(h) {
    const agent = h.connect('a1'), p = approved(h);
    denied(agent.propose({ ...p, target: 'mock://drafts/b' }), 'approval_missing_mismatched_or_expired');
    denied(agent.propose({ ...p, payload: { text: 'Changed after approval.' } }), 'approval_missing_mismatched_or_expired');
    assert.equal(agent.propose(p).status, 'acknowledged_unverified');
    assert.equal(h.operator.reconcile(p.operationId).status, 'verified_effect');
  } },
  { id: 'memory-boundaries', question: 'Are user, session, review and integrity checked before memory is returned?', run(h) {
    const agent = h.connect('a1');
    assert.equal(agent.propose({ kind: 'read-memory', target: 'memory-a' }).status, 'read');
    denied(agent.propose({ kind: 'read-memory', target: 'memory-b' }), 'read_not_authorized');
    denied(h.connect('a2').propose({ kind: 'read-memory', target: 'memory-a' }), 'read_not_authorized');
    for (const target of ['memory-poisoned', 'memory-unreviewed']) denied(agent.propose({ kind: 'read-memory', target }), 'memory_integrity_or_review_missing');
    denied(agent.propose(writeProposal()), 'approval_missing_mismatched_or_expired');
  } },
  { id: 'timeout-after-effect', question: 'Does retry wait for reconciliation and avoid a second effect?', setup: { fault: 'timeout-after-effect' }, run(h) {
    const agent = h.connect('a1'), p = approved(h);
    assert.equal(agent.propose(p).status, 'unknown');
    denied(agent.propose(p), 'destination_reconciliation_required');
    assert.equal(h.operator.reconcile(p.operationId).status, 'verified_effect');
    assert.equal(agent.propose(p).status, 'verified_previous_effect');
    assert.equal(h.snapshot().destinationEffects.length, 1);
  } },
  { id: 'unknown-destination', question: 'Does an unavailable destination remain unknown even when the tool may have written?', setup: { fault: 'timeout-after-effect', destinationAvailable: false }, run(h) {
    const agent = h.connect('a1'), p = approved(h);
    assert.equal(agent.propose(p).status, 'unknown');
    assert.equal(h.operator.reconcile(p.operationId).status, 'unknown');
    denied(agent.propose(p), 'destination_reconciliation_required');
    h.operator.setDestinationAvailable(true);
    assert.equal(h.operator.reconcile(p.operationId).status, 'verified_effect');
    assert.equal(h.snapshot().destinationEffects.length, 1);
  } },
  { id: 'verified-absent-retry', question: 'Can a legitimate retry proceed after an independent check finds no effect?', setup: { fault: 'timeout-before-effect' }, run(h) {
    const agent = h.connect('a1'), p = approved(h);
    assert.equal(agent.propose(p).status, 'unknown');
    assert.equal(h.operator.reconcile(p.operationId).status, 'verified_absent');
    h.operator.setFault('none');
    assert.equal(agent.propose(p).status, 'acknowledged_unverified');
    assert.equal(h.operator.reconcile(p.operationId).status, 'verified_effect');
    assert.equal(h.snapshot().destinationEffects.length, 1);
  } },
  { id: 'stop-queued-actions', question: 'Does stop prevent queued work while preserving completed effects?', run(h) {
    const agent = h.connect('a1'), first = approved(h), second = approved(h, { operationId: 'op-2' });
    assert.equal(agent.propose(first).status, 'acknowledged_unverified');
    agent.enqueue(second);
    h.operator.stop();
    denied(h.operator.drainOne(), 'stopped');
    denied(agent.propose(second), 'stopped');
    assert.equal(h.operator.reconcile(first.operationId).status, 'verified_effect');
    assert.equal(h.snapshot().destinationEffects.length, 1);
  } },
];
export function runCase(id) {
  const entry = cases.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown case: ${id}`);
  const h = createHarness(entry.setup);
  entry.run(h);
  return { id, question: entry.question, result: 'passed', scope: 'deterministic mock boundary checks; no model run', ...h.snapshot() };
}
