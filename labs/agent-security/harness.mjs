/** Offline educational broker. All operator methods/configuration are trusted host code. */
import { fixtures, sha256, START } from './fixtures.mjs';

const copy = (value) => structuredClone(value);
const plain = (value) => value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
function exact(value, fields) {
  if (!plain(value)) return false;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  return Reflect.ownKeys(descriptors).length === fields.length && fields.every((key) =>
    Object.hasOwn(descriptors, key) && Object.hasOwn(descriptors[key], 'value'));
}
const token = (value) => typeof value === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(value);
function validProposal(p) {
  if (!plain(p) || !Object.hasOwn(Object.getOwnPropertyDescriptors(p).kind ?? {}, 'value')) return false;
  if (p.kind === 'read-document' || p.kind === 'read-memory') return exact(p, ['kind', 'target']) && token(p.target);
  return exact(p, ['kind', 'target', 'payload', 'operationId', 'approvalId']) && p.kind === 'write-note' &&
    typeof p.target === 'string' && /^mock:\/\/drafts\/[a-z-]+$/.test(p.target) &&
    exact(p.payload, ['text']) && typeof p.payload.text === 'string' && p.payload.text.trim().length > 0 &&
    p.payload.text.length <= 4000 && token(p.operationId) && token(p.approvalId);
}
function binding(principal, p) {
  return sha256(JSON.stringify([principal.actor, principal.session, p.kind, p.target, p.payload.text, p.operationId]));
}

export function createHarness({ packet = fixtures(), clock = () => START, fault = 'none', destinationAvailable = true } = {}) {
  if (!['none', 'timeout-before-effect', 'timeout-after-effect'].includes(fault)) throw new Error('Invalid mock fault');
  packet = copy(packet);
  const approvals = new Map(), operations = new Map(), queue = [];
  const log = { proposals: [], policyDecisions: [], toolAttempts: [], destinationEffects: [], reconciliations: [], outputs: [], stopEvents: [] };
  let stopped = false, sequence = 0;
  const now = () => { const n = clock(); if (!Number.isSafeInteger(n) || n < 0) throw new Error('Invalid trusted clock'); return n; };
  const principalFor = (key) => {
    const principal = packet.sessions[key];
    if (!principal || !token(principal.actor) || !token(principal.session) || !Array.isArray(principal.writeTargets)) throw new Error('Unknown trusted session');
    return principal;
  };
  const finish = (id, result) => { log.outputs.push({ proposalId: id, ...copy(result) }); return copy(result); };
  function decide(id, p, principal) {
    const at = now();
    const deny = (reason) => { log.policyDecisions.push({ proposalId: id, at, actor: principal.actor, decision: 'deny', reason }); return finish(id, { status: 'denied', reason }); };
    if (stopped) return deny('stopped');
    if (!p) return deny('malformed_proposal');
    if (p.kind === 'read-document' || p.kind === 'read-memory') {
      const memory = p.kind === 'read-memory';
      const store = memory ? packet.memories : packet.documents;
      const record = Object.hasOwn(store, p.target) ? store[p.target] : null;
      if (!record || (memory ? record.actor !== principal.actor || record.session !== principal.session : !record.readers.includes(principal.actor))) return deny('read_not_authorized');
      if (memory && (record.reviewed !== true || record.expectedHash !== sha256(record.text))) return deny('memory_integrity_or_review_missing');
      log.policyDecisions.push({ proposalId: id, at, actor: principal.actor, decision: 'allow', reason: 'scoped_read' });
      log.toolAttempts.push({ proposalId: id, kind: p.kind, target: p.target, acknowledgement: 'read_completed' });
      return finish(id, { status: 'read', content: record.text, trust: 'untrusted_data_not_authority' });
    }
    if (!principal.writeTargets.includes(p.target)) return deny('target_not_authorized');
    const digest = binding(principal, p);
    const prior = operations.get(p.operationId);
    if (prior && prior.binding !== digest) return deny('operation_id_conflict');
    const approval = approvals.get(p.approvalId);
    if (!approval || approval.binding !== digest || approval.expiresAt <= at) return deny('approval_missing_mismatched_or_expired');
    if (prior && ['unknown', 'pending', 'conflicting'].includes(prior.status)) return deny('destination_reconciliation_required');
    log.policyDecisions.push({ proposalId: id, at, actor: principal.actor, decision: 'allow', reason: prior?.status === 'verified_effect' ? 'verified_previous_effect' : 'scoped_approved_write' });
    if (prior?.status === 'verified_effect') return finish(id, { status: 'verified_previous_effect', operationId: p.operationId });
    const operation = { binding: digest, status: 'pending', actor: principal.actor, target: p.target, payload: copy(p.payload) };
    operations.set(p.operationId, operation);
    // Tool acknowledgement and destination truth are deliberately separate observations.
    if (fault !== 'timeout-before-effect') log.destinationEffects.push({ operationId: p.operationId, binding: digest, actor: principal.actor, target: p.target, payload: copy(p.payload) });
    const timedOut = fault !== 'none';
    log.toolAttempts.push({ proposalId: id, operationId: p.operationId, acknowledgement: timedOut ? 'timeout' : 'accepted' });
    // Even an accepted acknowledgement requires an independent destination read before retry.
    operation.status = 'unknown';
    return finish(id, { status: timedOut ? 'unknown' : 'acknowledged_unverified', operationId: p.operationId });
  }
  function capture(key, proposed) {
    const principal = principalFor(key);
    const id = `proposal-${++sequence}`;
    const p = validProposal(proposed) ? copy(proposed) : null;
    log.proposals.push({ id, source: 'scripted_tool_proposal', actor: principal.actor, session: principal.session, proposal: p, malformed: p === null });
    return { id, p, principal: copy(principal) };
  }
  return {
    // The host selects this session after authentication. Session selection is not a model tool.
    connect(key) {
      principalFor(key);
      return Object.freeze({
        propose(proposed) { const captured = capture(key, proposed); return decide(captured.id, captured.p, captured.principal); },
        enqueue(proposed) { const captured = capture(key, proposed); queue.push(captured); return { status: 'queued', proposalId: captured.id }; },
      });
    },
    operator: Object.freeze({
      approve(key, proposed, expiresAt) {
        const principal = principalFor(key);
        if (!validProposal(proposed) || proposed.kind !== 'write-note' || !principal.writeTargets.includes(proposed.target) || !Number.isSafeInteger(expiresAt) || expiresAt <= now()) throw new Error('Invalid approval');
        const id = `approval-${approvals.size + 1}`;
        approvals.set(id, { binding: binding(principal, proposed), expiresAt });
        return id;
      },
      drainOne() { const item = queue.shift(); return item ? decide(item.id, item.p, item.principal) : { status: 'queue_empty' }; },
      stop() { stopped = true; log.stopEvents.push({ at: now(), queued: queue.length, earlierEffects: log.destinationEffects.length }); },
      reconcile(operationId) {
        const operation = operations.get(operationId);
        if (!operation) throw new Error('Unknown operation');
        let status = 'unknown';
        if (destinationAvailable) {
          const effects = log.destinationEffects.filter((effect) => effect.operationId === operationId);
          status = effects.length === 0 ? 'verified_absent' : effects.length === 1 && effects[0].binding === operation.binding ? 'verified_effect' : 'conflicting';
        }
        operation.status = status;
        const observation = { operationId, at: now(), source: 'independent_mock_destination_read', status };
        log.reconciliations.push(observation);
        return copy(observation);
      },
      setDestinationAvailable(available) { if (typeof available !== 'boolean') throw new Error('Expected boolean'); destinationAvailable = available; },
      setFault(next) { if (!['none', 'timeout-before-effect', 'timeout-after-effect'].includes(next)) throw new Error('Invalid fault'); fault = next; },
    }),
    snapshot() { return copy(log); },
  };
}
