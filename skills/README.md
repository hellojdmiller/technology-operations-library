# ChatGPT and agent skills

Reusable instructions for two recurring operating tasks:

- [Build-versus-buy review](build-buy-review/SKILL.md): compare ownership and operating responsibility, then propose a decision and a bounded test.
- [Notes to runbook](notes-to-runbook/SKILL.md): turn rough notes into a procedure someone else can execute and verify.

## Use in ChatGPT

For a single task, paste the instruction body from `SKILL.md` into a chat, followed by your context and request. The instruction body begins after the second `---` line; the first block is metadata for skill-aware agents.

For repeated work, create a ChatGPT Project and paste that instruction body into its project instructions. Add the relevant example or reference material as project files. Use only the materials appropriate for that project’s access and sharing settings. See [OpenAI’s Projects instructions](https://help.openai.com/en/articles/10169521-projects-in-chatgpt).

These files do not install tools or connectors in ChatGPT. A `.md` upload alone is not a promise of automatic skill discovery. The instructions work with the evidence and tools available in the conversation.

## Use with a skill-aware agent

Keep the entire skill folder, including `SKILL.md`, when copying it into an agent’s documented skill directory. The skill names are `build-buy-review` and `notes-to-runbook`. No scripts or external services are required by either skill.

## Try the examples

Use the fictional prompts in [evaluation-cases.md](evaluation-cases.md) to review output quality before relying on a skill for your work. The checks focus on preserving unknowns, choosing useful evidence, and avoiding unsupported completion claims. Structural validation is not a substitute for trying the prompts in your chosen model.
