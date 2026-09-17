import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const [slug, title] of [
  ['automation-result-review', 'Automation result review'],
  ['operations-brief', 'Operations brief'],
]) {
  const folder = join(root, 'n8n', slug);
  const sample = JSON.parse(readFileSync(join(folder, 'sample-input.json'), 'utf8'));
  const code = readFileSync(join(folder, 'evaluate.js'), 'utf8');
  const workflow = {
    name: `VCPEIT — ${title} (fictional example)`,
    nodes: [
      { parameters: {}, id: 'manual-trigger', name: 'Run example', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0] },
      { parameters: { mode: 'runOnceForAllItems', language: 'javaScript', jsCode: `return ${JSON.stringify(sample, null, 2)}.map(json => ({ json }));` }, id: 'sample-data', name: 'Fictional sample data', type: 'n8n-nodes-base.code', typeVersion: 2, position: [250, 0], notesInFlow: true, notes: 'Fictional local input. Replace only after checking the input contract in the resource README.' },
      { parameters: { mode: 'runOnceForAllItems', language: 'javaScript', jsCode: code }, id: 'evaluate', name: title, type: 'n8n-nodes-base.code', typeVersion: 2, position: [500, 0], notesInFlow: true, notes: 'Inspect the returned status. This node has no external action and does not verify referenced evidence.' },
    ],
    connections: {
      'Run example': { main: [[{ node: 'Fictional sample data', type: 'main', index: 0 }]] },
      'Fictional sample data': { main: [[{ node: title, type: 'main', index: 0 }]] },
    },
    settings: { executionOrder: 'v1' },
    active: false,
    pinData: {},
    tags: [],
  };
  writeFileSync(join(folder, 'workflow.json'), `${JSON.stringify(workflow, null, 2)}\n`);
}
