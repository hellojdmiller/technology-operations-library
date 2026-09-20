# Technology Operations Library

Practical resources for technology leaders and operators across organizations.

This is the public resource companion to [hellojdmiller.com](https://hellojdmiller.com). I’m collecting the guidance, workflows, reusable AI instructions, and implementation examples that help turn an operating idea into something another person can use and verify.

The library is organized around reusable operating work across industries and team structures. Some fictional examples use investment operations; adapt their business roles, data boundaries, and obligations to the intended setting.

## Start with the work you want to do

| Your next task | Start here | What you can try |
|---|---|---|
| Run an automation | [Change-readiness walkthrough](showcase/change-readiness-review.md) | A fictional change packet, its review result, and the checks behind it |
| Review your controls | [Control-evidence walkthrough](showcase/control-evidence-review.md) | A local report that keeps missing, stale, and conflicting evidence visible |
| Learn with AI | [AI at Work](training/ai-at-work/README.md), [prompting guide](prompting/README.md), and [portable skills](skills/README.md) | Three everyday employee lessons, followed by deeper prompting and reusable instructions |
| Assess a platform | [Platform security baselines](baselines/README.md) | Control catalogs and risk-assessment templates for Google Workspace, Microsoft 365, Cloudflare, AWS, and GitHub, with a local comparison tool and fictional examples |


The [100-site training directory](training/free-training-directory/README.md) helps teams find public, free-account and customer-included learning, with access limits, official sources and a CSV for an internal catalog. The [vendor video task cards](training/vendor-walkthroughs/README.md) pair official lessons with original practice, evidence checks, and teach-back prompts. Use the [training delivery pack](training/delivery/README.md) to run a proposed 60-minute first session and plan follow-up checks over 30 days.

The [showcase walkthroughs](showcase/README.md) connect three operating problems to runnable examples: a read-only MCP service catalog, a control-evidence review, and a change-readiness workflow. Each explains the input, expected output, checks, and remaining limitations. Start there to understand how I approach the work, then use the collections below for related procedures and templates.

For the AI research, start with [Beyond the model frontier and its companions](research/README.md). Follow the argument from chips, models, context, and learning to a practical pilot, acceptance review, and user-development plan. This is a pinned copy of a published website revision; the research directory records its source and sync process.

For a sensitive reporting workflow, use the [investor-reporting pack](operations/packs/investor-reporting/README.md) and its offline reconciliation sample. The fictional cases cover wrong recipients, versions, uncertain retries, and interrupted batches.

## Browse by the work you need to do

| Collection | Included | Start here |
|---|---|---|
| [Technology operations field guide](library/README.md) | 6 guides and working-record CSVs | Operating model, first 90 days, employee lifecycle, fund operations, portfolio support, vendors |
| [IT operations and service desk](operations/README.md) | 22 guides and procedures; 4 operating packs; 17 CSV aids | Change management, assets, patching, investor reporting, service desk, and succession |
| [n8n workflows](n8n/README.md) | 10 workflow exports with sample data and local tests | Change readiness, asset reconciliation, patch exceptions, access, renewals, lifecycle, recovery, licenses, results, and briefs |
| [Platform security baselines](baselines/README.md) | 109 control assertions and 5 risk-assessment templates across Google Workspace, Microsoft 365, Cloudflare, AWS, and GitHub | Desired-state catalogs built from current vendor documentation, evidence worksheets, risk scenarios, fictional observations, and a local assessment tool |
| [Cyber-risk operating pack](cyber-risk/README.md) | 12 guides and packs; 36 control proposals | Four checklists, AI controls, tabletop scenarios, a 45-minute workshop, leadership reporting, and evidence records |
| [AI prompting guide](prompting/README.md) | 11 chapters, 16 copyable patterns, and practice records | Task design, context, research, writing, documents, code, agents, evaluation, and troubleshooting |
| [Portable skills](skills/README.md) | 4 self-contained skills and 1 linked Claude Code workflow system | Build/buy review, notes to runbook, risk review, document sanitization, and [Aloha](https://github.com/hellojdmiller/aloha) |
| [Documentation examples](documentation/README.md) | 12 examples, including 9 adapted documents | Policies, procedures, BCP, disaster recovery, cyber risk, incidents, and decisions |
| [Workplace and vendor training](training/README.md) | 3 AI at Work lessons, 100-site learning directory, 6 modules, 8 video-based task cards, 3 operating exercises, and a session delivery pack | Everyday AI use, free learning discovery, Microsoft 365/Entra, Google Workspace, Intune, Jamf, n8n, and SaaS handover |
| [Implementation work samples](work-samples/README.md) | 6 sample collections | MCP design and server, Azure Bicep, configuration scripts, control-evidence review, and investor-reporting reconciliation |
| Verification labs | [n8n runtime](labs/n8n-runtime/README.md) and [agent security](labs/agent-security/README.md) | Reproduce n8n cases and inspect offline agent-control decisions with fictional inputs |
| [AI research and companions](research/README.md) | Research paper, three companion readings, and 17 working files | Chips, model progress, context, human learning, accepted productivity, and user progression |
| [Showcase walkthroughs](showcase/README.md) | 3 guided examples, an editor walkthrough, and observed assistant trials | Run a sample, inspect its evidence, and understand what it establishes |

For search and collection filters, open [catalog/index.html](catalog/index.html) locally after downloading or cloning this repository. GitHub displays its source rather than hosting the page. The catalog links back to the public repository. Its machine-readable index is [resources.json](catalog/resources.json).

## What is ready to use

The guidance and examples are available for review and adaptation. The code has local checks described in [VALIDATION.md](VALIDATION.md). The [n8n runtime lab](labs/n8n-runtime/README.md) passed 32 isolated CLI cases on its pinned version. A bounded [Claude MCP and pasted-skill trial](showcase/host-trials/README.md) now adds host observations and review findings. Cloud deployment, real-tenant checks, vendor training exercises, native skill loading, and wider cross-client trials remain pending.

The n8n examples use manual triggers and fictional input. The baseline tool evaluates supplied assertions; it does not inspect a tenant. Infrastructure examples require application code and environment-specific review. Each resource explains its input, intended result, and limits.

The skills share provider-neutral instructions. Use the [platform guide](skills/platform-guide.md) for supported Claude, ChatGPT, Codex, and Cursor delivery methods; native installation and pasting instructions into chat are different routes. The [full prompting guide](prompting/README.md) explains how to frame the work and evaluate the result.

## Local checks

With Node.js 22 or later, no package installation is needed for the JavaScript checks:

```sh
node scripts/build-workflows.mjs
node --test tests/*.test.mjs baselines/tests/*.test.mjs work-samples/control-evidence-review/tests/*.test.mjs work-samples/investor-reporting-reconciliation/tests/*.test.mjs labs/n8n-runtime/tests/*.test.mjs labs/agent-security/tests/*.test.mjs
node scripts/build-catalog.mjs
node training/free-training-directory/build.mjs --check
node training/ai-at-work/build.mjs --check
```

The workflow build regenerates exports from readable JavaScript and sample inputs. Keep both together. The catalog build indexes the reviewed resource collections. The separate [runtime lab](labs/n8n-runtime/README.md) requires Docker and the pinned n8n image.

With Python 3.9 or later, `python3 research/verify_sync.py` checks the research copy's hashes, file inventory, local navigation, and CSV structure without network access or extra packages. The [sync guide](research/SYNC.md) also explains how to compare it against the pinned website source commit.

The [GitHub Actions workflow](.github/workflows/validate.yml) runs these checks on pushes to `main` and pull requests, checks for generated-file drift, and separately installs the locked MCP sample dependencies to run its protocol tests and deterministic answer keys. It uses no tenant credentials and performs no deployment. This automation covers local examples; the environment-specific trials in [VALIDATION.md](VALIDATION.md) remain separate.

## Contributing

Every addition begins with current research. Follow the [contribution guidelines](CONTRIBUTING.md) to connect sources to the operating problem, proposed approach, testable behavior, and remaining limits.

This public collection contains reusable examples, not organization-specific operating records. The adapted documents use fictional circumstances and omit original identities, architecture, incident history, and source containers. Read the [adaptation guide](documentation/ADAPTATION.md).

Keep credentials, original work documents, actual tenant exports, completed assessments, private deployment parameters, and operational evidence outside this repository. Review additions for rights, disclosure risk, and accurate validation claims before committing them.

## Naming and compatibility

The repository's current name is **Technology Operations Library**, with the slug `technology-operations-library`. MCP tool names, baseline identifiers, lab identifiers, and package names use the `tol_*` and `tol-*` prefixes, and clients, fixtures, and recorded results agree on them. Pinned research provenance retains its original bytes. A new local clone may use the new slug; an existing checkout does not need to move.

GitHub redirects repository web and Git operations after a rename, but recommends updating local remotes. GitHub Pages project URLs and calls to a published action have separate limitations. Do not reuse the previous repository name, because doing so breaks its redirect. [GitHub's repository rename guidance](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository), reviewed September 19, 2026.

The existing [GPL-3.0 license](LICENSE) is retained.
