import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const markdown = (folder) => fs.readdirSync(path.join(root, folder), { withFileTypes: true })
  .filter((item) => item.isFile() && item.name.endsWith('.md') && !['README.md', 'VALIDATION.md', 'training-record-template.md'].includes(item.name))
  .map((item) => `${folder}/${item.name}`);
const folders = (folder, file) => fs.readdirSync(path.join(root, folder), { withFileTypes: true })
  .filter((item) => item.isDirectory() && fs.existsSync(path.join(root, folder, item.name, file)))
  .map((item) => `${folder}/${item.name}/${file}`);
const entries = [];
const descriptions = {
  'training/free-training-directory/README.md': 'Find 100 learning sites for staff, operators, developers and managers. Includes free scope, customer/account conditions, official evidence, proposed starter tasks and a CSV for an internal training catalog.',
  'training/delivery/README.md': 'Deliver a proposed 60-minute vendor task-card session, then plan 30-day follow-up with a coach rubric, blank learner log and fictional example. Keep assisted practice, independent reasoning and work authority separate.',
  'cyber-risk/workshops/incident-readiness/README.md': 'Run a 45-minute decision rehearsal using the existing destructive-outage scenario. Includes facilitator and participant sheets, decision log, observer rubric, holding update and improvement plan; no live incident actions.',
  'labs/agent-security/README.md': 'Run fictional agent-control exercises for scoped retrieval, approval binding, memory, retries, and stopping actions. Inspect proposed calls, policy decisions, and mock destination effects separately; no model behavior claim.',
  'labs/n8n-runtime/README.md': 'Reproduce 32 isolated CLI import and execution cases across ten workflows using a pinned n8n image. Check fictional outputs, incomplete evidence, zero-item input, technical failure, and cleanup.',
  'work-samples/investor-reporting-reconciliation/README.md': 'Run an offline reconciliation of expected deliveries, version approval, recipient entitlements, retries, and completion observations. Includes a fictional fixture, expected reports, and 33 tests.',
  'operations/packs/investor-reporting/README.md': 'Reconcile investor-report distribution using exact versions and recipients, interrupted-batch procedures, a blank decision record, a fictional exercise, and an offline review tool.',
  'research/beyond-the-model-frontier.md': 'Connect chip architecture, model progress, effective context, human learning, and training-data quality to accepted productivity. Includes nine propositions to test in a bounded workflow.',
  'research/companions/09-user-development-plan.md': 'Plan coaching, guided practice, transfer tasks, and delayed learning checks. Record observable progress separately from task output and production authority.',
  'operations/packs/change-management/README.md': 'Standard, normal, and emergency change procedures with approval, pilot, rollback, verification, a record template, fictional examples, exercises, and an n8n review flow.',
  'operations/packs/asset-lifecycle/README.md': 'Manage IT assets from purchase and custody through inventory reconciliation, return, sanitization, and disposal, with templates, exercises, and an n8n review flow.',
  'operations/packs/patching/README.md': 'Prioritize vulnerabilities and patches, plan rollout rings, verify remediation, and review exceptions using an SOP, records, exercises, and an n8n review flow.',
  'operations/service-level-management.md': 'Define SLA, SLO, OLA, response, updates, restoration, and reporting. Includes fictional P1–P4 targets and six worked timing cases for calendars, pauses, reassignment, and reopen.',
  'operations/checklists/README.md': 'Six working aids for onboarding, offboarding, software requests, ticket handoffs, SLA targets, and clock calculations. Includes field definitions and blank execution evidence.',

  'documentation/automation-handover-template.md': 'Record ownership, inputs, expected results, failure handling, and the checks another operator needs to support an automation.',
  'skills/build-buy-review/SKILL.md': 'Compare building, buying, and combining tools through ownership, operating costs, risk, and a bounded trial.',
  'skills/notes-to-runbook/SKILL.md': 'Draft a runbook that preserves reported evidence, checks destination results and access, and keeps missing prerequisites and untested recovery visible.',
  'skills/risk-review/SKILL.md': 'Turn a proposed change into supported risk scenarios, treatment choices, and a decision with clear evidence requirements.',
  'skills/document-sanitization/SKILL.md': 'Create a useful derivative of authorized documents while removing direct identifiers, contextual clues, and sensitive operational detail.',
  'training/google-workspace-operator.md': 'Practice settings inheritance, test populations, authentication evidence, and recovery in Google Workspace.',
  'training/microsoft-365-entra-operator.md': 'Practice identity policy scope, report-only interpretation, sign-in evidence, and recovery planning.',
  'training/intune-device-operations.md': 'Distinguish enrollment, assignment, compliance evaluation, and access outcomes using a bounded device exercise.',
  'training/jamf-device-operations.md': 'Practice policy scope, inventory freshness, execution evidence, and recovery for managed Apple devices.',
  'training/n8n-workflow-operator.md': 'Import an example, compare expected records, distinguish business exceptions from execution failures, and record recovery.',
  'training/saas-ownership-and-handover.md': 'Rehearse service ownership, administrator transfer, billing, integrations, vendor dependencies, and handover acceptance.'
};
function add(collection, files, readiness) {
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const title = text.match(/^# (.+)$/m)?.[1];
    if (!title) throw new Error(`Missing title: ${file}`);
    const paragraph = text.split('\n\n').find((p) => p && !/^(#|>|---|\||\*\*|```)/.test(p) && !p.includes('name:')) || readiness;
    let description = descriptions[file] || paragraph.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '').replace(/\n/g, ' ');
    if (description.length > 245) description = description.slice(0, 245).replace(/\s+\S*$/, '') + '…';
    entries.push({ title, collection, path: file, readiness, description });
  }
}
add('Field guides', markdown('library'), 'Proposed operating guidance');
add('IT operations', [...markdown('operations'), ...markdown('operations/succession'), ...markdown('operations/sops'), 'operations/templates/README.md', 'operations/checklists/README.md', ...folders('operations/packs', 'README.md')], 'Adapted or proposed guidance; operational exercises not run');
add('n8n workflows', folders('n8n', 'README.md'), 'n8n 2.39.8 CLI import/execution checked; real integrations untested');
add('Runtime labs', ['labs/n8n-runtime/README.md'], 'Pinned n8n CLI runtime checked with fictional inputs; production integrations untested');
add('Runtime labs', ['labs/agent-security/README.md'], 'Offline mock-tool controls; actual model behavior and live integrations untested');
add('Cloud baselines', ['baselines/google-workspace/README.md', 'baselines/microsoft-365/README.md'], 'Local assessment checked; tenant configuration not applied');
add('Cyber risk', ['cyber-risk/operating-model.md', 'cyber-risk/controls/README.md', ...markdown('cyber-risk/checklists'), ...markdown('cyber-risk/ai'), ...markdown('cyber-risk/scenarios'), ...markdown('cyber-risk/reporting')], 'Proposed controls and exercises; real-world effectiveness unverified');
add('Cyber risk', ['cyber-risk/workshops/incident-readiness/README.md'], 'Original 45-minute facilitation pack; workshop and technical recovery unexecuted');
add('AI prompting', markdown('prompting'), 'Provider-neutral guidance and synthetic exercises; model trials pending');
add('Portable skills', folders('skills', 'SKILL.md'), 'Instructions reviewed; cross-client trials pending');
add('Documentation', ['documentation/build-buy-decision-example.md', 'documentation/recovery-exercise-example.md', 'documentation/automation-handover-template.md', ...markdown('documentation/policies'), ...markdown('documentation/procedures'), ...markdown('documentation/continuity'), ...markdown('documentation/cyber-risk')], 'Fictional or adapted example; requires internal adoption');
add('Training', markdown('training'), 'Practice module; labs not executed');
add('Training', markdown('training/vendor-walkthroughs'), 'Official video and reading paths with original exercises; participant practice unexecuted');
add('Training', ['training/delivery/README.md'], 'Proposed session and follow-up plan; no learner sessions or measured outcomes');
add('Training', ['training/free-training-directory/README.md'], 'Official sources reviewed; enrollment, playback, customer entitlement and learner outcomes untested');
add('Work samples', folders('work-samples', 'README.md'), 'See sample validation and deployment limits');
add('AI research', [
  'research/beyond-the-model-frontier.md',
  'research/ai-acceptance.md',
  'research/acceptance-review.md',
  'research/building-capability-with-ai.md',
  ...markdown('research/companions'),
], 'Pinned published research; proposed methods and fictional exercises');
add('Showcase', [
  'showcase/mcp-service-catalog.md',
  'showcase/control-evidence-review.md',
  'showcase/change-readiness-review.md',
  'showcase/n8n-editor-trial.md',
  'showcase/host-trials/README.md',
], 'Guided local example; see measured checks and remaining limits');
entries.sort((a, b) => a.collection.localeCompare(b.collection) || a.title.localeCompare(b.title));
const catalog = { version: 1, reviewed_on: '2026-09-19', repository: 'https://github.com/hellojdmiller/technology-operations-library', visibility: 'Public resource collection', entries };
const destination = path.join(root, 'catalog');
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'resources.json'), JSON.stringify(catalog, null, 2) + '\n');
const data = JSON.stringify(catalog).replace(/</g, '\\u003c');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Technology Operations Library</title>
<style>
:root{color-scheme:light;--ink:#132a35;--muted:#53666d;--line:#d4dfe0;--paper:#f4f7f5;--accent:#176459}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,sans-serif}main{max-width:1180px;margin:auto;padding:54px 28px}header{max-width:840px;margin-bottom:30px}.eyebrow{font-size:12px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;color:var(--accent)}h1{font-size:clamp(34px,5vw,60px);letter-spacing:-.05em;line-height:1.07;margin:15px 0 20px}p{margin:0 0 14px;color:var(--muted)}a{color:var(--accent)}.controls{display:flex;gap:14px;flex-wrap:wrap;background:white;padding:20px;border:1px solid var(--line);border-radius:12px}label{display:block;font-size:13px;font-weight:650}.search{flex:1;min-width:220px}input,select{font:inherit;display:block;padding:10px 12px;margin-top:5px;border:1px solid #aabfc1;border-radius:6px;background:white;color:var(--ink);width:100%}input:focus,select:focus,a:focus{outline:3px solid #91cabe;outline-offset:2px}.count{margin:22px 0 14px;font-size:14px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}article{display:flex;flex-direction:column;gap:10px;border:1px solid var(--line);border-radius:12px;background:white;padding:22px}article h2{font-size:20px;line-height:1.3;letter-spacing:-.02em;margin:0}article p{font-size:14px;margin:0}article .type{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--accent);font-weight:700}.status{margin-top:auto!important;padding-top:14px;border-top:1px solid #e6ecea;font-size:12px!important}footer{margin-top:30px;color:var(--muted);font-size:13px}.empty{padding:20px}noscript{display:block;padding:20px}
</style></head><body><main><header><div class="eyebrow">JD Miller · Public resource library</div><h1>Technology<br>Operations Library.</h1><p>Operating guidance, AI research, workflows, baseline reviews, portable skills, documentation, training, and guided implementation samples. Start with the job you need to do.</p><p><a href="https://github.com/hellojdmiller/technology-operations-library">Open the public repository</a>.</p></header>
<section class="controls" aria-label="Filter resources"><label class="search">Search the library<input id="search" type="search" placeholder="Try recovery, access, vendor, AI…"></label><label>Collection<select id="collection"><option value="">All collections</option></select></label></section><p class="count" id="count" role="status" aria-live="polite"></p><section class="grid" id="resources" aria-label="Resources"></section><noscript>Enable JavaScript for filtering, or use the repository README to browse.</noscript><footer>Examples use fictional data. Review each resource's validation limits before use. Nothing here has been applied to a production environment. Catalog reviewed September 19, 2026.</footer></main>
<script type="application/json" id="catalog">${data}</script><script>
const data=JSON.parse(document.getElementById('catalog').textContent);const filter=document.getElementById('collection');const search=document.getElementById('search');const list=document.getElementById('resources');
for(const category of [...new Set(data.entries.map(x=>x.collection))]){const option=document.createElement('option');option.value=category;option.textContent=category;filter.append(option)}
function render(){const q=search.value.trim().toLowerCase();const items=data.entries.filter(x=>(!filter.value||x.collection===filter.value)&&(!q||[x.title,x.collection,x.description,x.readiness,x.path].join(' ').toLowerCase().includes(q)));list.replaceChildren();document.getElementById('count').textContent=items.length+' of '+data.entries.length+' resources';for(const item of items){const card=document.createElement('article');const type=document.createElement('div');type.className='type';type.textContent=item.collection;const heading=document.createElement('h2');const link=document.createElement('a');link.href=data.repository+'/blob/main/'+item.path.split('/').map(encodeURIComponent).join('/');link.textContent=item.title;heading.append(link);const description=document.createElement('p');description.textContent=item.description;const state=document.createElement('p');state.className='status';state.textContent=item.readiness;card.append(type,heading,description,state);list.append(card)}if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='No matching resources. Try another term or collection.';list.append(empty)}}search.addEventListener('input',render);filter.addEventListener('change',render);render();
</script></body></html>`;
fs.writeFileSync(path.join(destination, 'index.html'), html);
console.log(JSON.stringify({ resources: entries.length, collections: Object.fromEntries([...new Set(entries.map(e=>e.collection))].map(c=>[c,entries.filter(e=>e.collection===c).length])) }, null, 2));
