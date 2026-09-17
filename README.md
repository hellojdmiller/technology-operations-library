# VCPEIT

Practical resources for technology leaders and operators in venture capital and private equity.

This is the private working companion to [hellojdmiller.com](https://hellojdmiller.com). I’m collecting the guidance, workflows, reusable AI instructions, and implementation examples that help turn an operating idea into something another person can use and verify.

## Browse by the work you need to do

| Collection | Included | Start here |
|---|---|---|
| [VC IT field guide](library/README.md) | 6 guides and working-record CSVs | Operating model, first 90 days, employee lifecycle, fund operations, portfolio support, vendors |
| [IT operations and service desk](operations/README.md) | 22 guides and procedures; 11 working-record CSVs | Onboarding, offboarding, software requests, ticket escalation, service levels, quality review, and succession |
| [n8n workflows](n8n/README.md) | 7 workflow exports with sample data and local tests | Access reviews, renewals, lifecycle completeness, backup evidence, licenses, results, and briefs |
| [Google and Microsoft baselines](baselines/README.md) | 40 control assertions across 2 platforms | Desired-state catalogs, evidence worksheets, fictional observations, and a local assessment tool |
| [Cyber-risk operating pack](cyber-risk/README.md) | 11 guides and packs; 36 control proposals | Four checklists, AI risk and agent controls, tabletop exercises, leadership reporting, and evidence records |
| [AI prompting guide](prompting/README.md) | 11 chapters, 16 copyable patterns, and practice records | Task design, context, research, writing, documents, code, agents, evaluation, and troubleshooting |
| [Portable skills](skills/README.md) | 4 self-contained skills | Build/buy review, notes to runbook, risk review, and document sanitization |
| [Documentation examples](documentation/README.md) | 12 examples, including 9 adapted documents | Policies, procedures, BCP, disaster recovery, cyber risk, incidents, and decisions |
| [Vendor training](training/README.md) | 6 modules and a training-record template | Microsoft 365/Entra, Google Workspace, Intune, Jamf, n8n, and SaaS handover |
| [Implementation work samples](work-samples/README.md) | 5 sample collections | MCP design and a runnable local server, Azure Bicep, configuration scripts, and control-evidence review |

For search and collection filters, open [catalog/index.html](catalog/index.html) locally after downloading or cloning this repository. GitHub displays its source rather than hosting the page. The catalog links back to the private repository and requires access to open resources. Its machine-readable index is [resources.json](catalog/resources.json).

## What is ready to use

The guidance and examples are ready for private review and adaptation. The code has local checks described in [VALIDATION.md](VALIDATION.md). n8n runtime trials, cloud deployment, real-tenant checks, vendor labs, and cross-client skill trials have not been completed.

The n8n examples use manual triggers and fictional input. The baseline tool evaluates supplied assertions; it does not inspect a tenant. Infrastructure examples require application code and environment-specific review. Each resource explains its input, intended result, and limits.

The skills share provider-neutral instructions. Use the [platform guide](skills/platform-guide.md) for supported Claude, ChatGPT, Codex, and Cursor delivery methods; native installation and pasting instructions into chat are different routes. The [full prompting guide](prompting/README.md) explains how to frame the work and evaluate the result.

## Local checks

With Node.js 22 or later, no package installation is needed for the JavaScript checks:

```sh
node scripts/build-workflows.mjs
node --test tests/*.test.mjs baselines/tests/*.test.mjs
node scripts/build-catalog.mjs
```

The workflow build regenerates exports from readable JavaScript and sample inputs. Keep both together. The catalog build indexes the reviewed resource collections.

## Developing privately

Keep this repository private while resources are tried and refined. The adapted documents use fictional circumstances and omit original identities, architecture, incident history, and source containers. Read the [adaptation guide](documentation/ADAPTATION.md).

Keep credentials, original work documents, actual tenant exports, completed assessments, private deployment parameters, and operational evidence outside this repository. Public release is a separate decision about specific resources and their rights, disclosure risk, and validation.

The existing [GPL-3.0 license](LICENSE) is retained.
