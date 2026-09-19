import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const slugs = [
  'automation-result-review', 'operations-brief', 'access-review-preparation',
  'vendor-renewal-triage', 'joiner-mover-leaver-review', 'backup-evidence-review',
  'saas-license-reconciliation', 'change-readiness-review',
  'asset-reconciliation-review', 'patch-exception-review',
];
export const failureMessage = 'VCPEIT_EXPECTED_TECHNICAL_FAILURE';
const sampleCode = inputs => `return ${JSON.stringify(inputs, null, 2)}.map(json => ({ json }));`;
export const sha256 = value => createHash('sha256').update(value).digest('hex');

export function buildCases(root) {
  const cases = [];
  const sources = [];
  for (const slug of slugs) {
    const folder = join(root, 'n8n', slug);
    const source = readFileSync(join(folder, 'workflow.json'), 'utf8');
    const workflow = JSON.parse(source);
    const inputText = readFileSync(join(folder, 'sample-input.json'), 'utf8');
    const inputs = JSON.parse(inputText);
    const evaluator = readFileSync(join(folder, 'evaluate.js'), 'utf8');
    assert.equal(workflow.active, false, `${slug}: only inactive examples are allowed`);
    assert.equal(workflow.nodes.length, 3);
    assert.deepEqual(workflow.nodes.map(n => n.type), ['n8n-nodes-base.manualTrigger', 'n8n-nodes-base.code', 'n8n-nodes-base.code']);
    assert.ok(workflow.nodes.every(n => !n.credentials));
    assert.equal(workflow.nodes[1].parameters.jsCode, sampleCode(inputs));
    assert.equal(workflow.nodes[2].parameters.jsCode, evaluator);
    assert.ok(Array.isArray(inputs) && inputs.length > 0);
    sources.push({ slug, workflow_sha256: sha256(source), input_sha256: sha256(inputText), evaluator_sha256: sha256(evaluator) });
    const incomplete = structuredClone(inputs);
    if (slug === 'operations-brief') incomplete[0].owner = '';
    else if (slug === 'automation-result-review') incomplete[0].evidenceRef = '';
    else {
      incomplete[0][slug === 'vendor-renewal-triage' ? 'registerComplete' : 'snapshotComplete'] = false;
      incomplete[0].evidenceRef = '';
    }
    const variants = [
      ['fixture', inputs, slug === 'operations-brief' ? 'draft_ready' : 'needs_review'],
      ['malformed', [{}], slug === 'operations-brief' ? 'needs_input' : 'invalid_input'],
      ['incomplete', incomplete, slug === 'operations-brief' ? 'needs_input' : 'needs_review'],
    ];
    if (slug === slugs[0]) variants.push(['zero-items', [], null], ['technical-failure', inputs, null]);
    for (const [kind, input, status] of variants) {
      const copy = structuredClone(workflow);
      copy.id = `VCPEITLab${String(cases.length + 1).padStart(7, '0')}`;
      copy.name = `VCPEIT lab: ${slug} / ${kind}`;
      copy.nodes[1].parameters.jsCode = sampleCode(input);
      if (kind === 'technical-failure') copy.nodes[2].parameters.jsCode = `throw new Error('${failureMessage}');`;
      cases.push({ id: copy.id, slug, kind, expectedStatus: status, input, workflow: copy, finalNode: copy.nodes[2].name });
    }
  }
  return { sources, cases };
}
