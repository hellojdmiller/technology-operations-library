#!/usr/bin/env node
import { cases, runCase } from './cases.mjs';

if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22 or later required');
const args = process.argv.slice(2);
const json = args.includes('--json');
const names = args.filter((arg) => arg !== '--json');
if (names.length > 1 || args.filter((arg) => arg === '--json').length > 1) throw new Error('Usage: node run.mjs [all|list|case-id] [--json]');
const name = names[0] ?? 'all';
if (name === 'list') {
  for (const entry of cases) console.log(`${entry.id}: ${entry.question}`);
} else {
  const selected = name === 'all' ? cases.map((entry) => entry.id) : [name];
  const results = selected.map(runCase);
  if (json) console.log(JSON.stringify({ scope: 'offline mock control exercise; proposals are scripted, not model output', results }, null, 2));
  else {
    for (const result of results) console.log(`PASS ${result.id}: ${result.policyDecisions.length} policy decisions; ${result.destinationEffects.length} mock effects; ${result.reconciliations.length} destination checks`);
    console.log('No model, provider, tenant, real document, or network tool was used. Use --json to inspect the separate ledgers.');
  }
}
