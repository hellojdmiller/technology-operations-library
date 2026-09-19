# Portable operating skills

Reusable instructions for recurring technology operating tasks. Each folder contains a self-contained `SKILL.md` with standard `name` and `description` metadata. No connector, script, API key, provider-specific tool name, or other skill is required.

- [Build-versus-buy review](build-buy-review/SKILL.md): compare ownership and operating responsibility, then propose a decision and a bounded test.
- [Notes to runbook](notes-to-runbook/SKILL.md): turn rough notes into a procedure someone else can execute and verify.
- [Risk review](risk-review/SKILL.md): turn a proposed change or service into evidence-based risk scenarios, treatment choices, and a reviewable decision.
- [Document sanitization](document-sanitization/SKILL.md): adapt an authorized source document into a reusable example while removing identifying and operationally sensitive detail.

## Choose how to use them

Use the [platform guide](platform-guide.md) for Claude Code, Claude chat, ChatGPT, Codex, and Cursor. Native skill loading and ordinary chat instructions are different delivery methods. Host permissions, model behavior, available tools, and account features still apply.

The lowest-dependency route is to paste the instruction body after the second `---` line into a chat, followed by the request and appropriate source material. Treat this as a prompt, not an installation. If the task requires inspecting file internals or verifying live evidence, use an environment that actually provides those capabilities or leave those checks explicitly unresolved.

Do not paste confidential firm records into an environment that is not approved for them. Document sanitization can remove information from a derivative document; it does not undo sending the original material to a model or connector.

## A useful first request

> Use the notes-to-runbook instructions with the fictional recovery notes below. Produce a draft only. Keep missing destinations and untested recovery steps visible; do not execute the procedure.

For native loaders, copy the complete chosen skill folder into the host’s documented directory. This repository’s `skills/` collection is a source catalog; cloning it alone does not register it in every host. The guide avoids changing global settings or creating duplicate installations.

## Try the examples

The [full prompting guide](../prompting/README.md) explains task design, context, research, writing, coding, agents, and evaluation, with 16 copyable patterns and guided exercises.

Use the fictional prompts and scoring rubric in [evaluation-cases.md](evaluation-cases.md) before relying on a skill. Record the host, model, delivery method, repository revision, output, and result. Frontmatter validation establishes file structure only; it does not establish cross-platform behavior, reliable redaction, or a sound recommendation.

## Observed host trials

The [September 19 assistant trial](../showcase/host-trials/README.md) records one Claude notes-to-runbook trial using pasted instructions, its review findings, and a Codex attempt blocked before model output. This is limited behavioral evidence; native loading and the broader cross-host suite remain untested.

The [runbook revision comparison](../showcase/host-trials/runbook-revision/README.md) adds six fresh drafts across two fictional cases and three instruction versions. It retains exact inputs, unchanged outputs, scores and remaining defects. Read the findings before relying on the revised [notes-to-runbook skill](notes-to-runbook/SKILL.md); a revised instruction body does not remove the need to check the actual draft.
