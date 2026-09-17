# Using the skills across AI tools

The same instruction body can be reused, but each host has its own discovery, permissions, and packaging rules. These are setup instructions, not a record of installations performed. **Official documentation reviewed September 17, 2026.** Verify the feature in your installed version and account before relying on it.

## Native loaders

Copy one chosen skill folder, including its `SKILL.md`, into a supported location. Keep the folder name identical to the frontmatter `name`. Do not copy the catalog README or evaluation file into a directory as if either were a skill.

| Host | Project-scoped destination | Explicit use |
|---|---|---|
| Claude Code | `.claude/skills/<skill-name>/SKILL.md` | `/risk-review`, for example |
| Codex CLI / IDE extension | `.agents/skills/<skill-name>/SKILL.md` | Mention `$risk-review` or use `/skills` |
| Cursor Agent | `.agents/skills/<skill-name>/SKILL.md` or `.cursor/skills/<skill-name>/SKILL.md` | Type `/` and select the skill |

Claude Code also supports personal skills under `~/.claude/skills`. Local personal skills are not automatically the same as account-enabled skills in Cowork/cloud sessions. Use the actual session’s supported route. [Claude Code skill documentation](https://code.claude.com/docs/en/skills).

Codex also supports user skills under `~/.agents/skills`. OpenAI documents standalone skills for its desktop app, Codex CLI, and IDE extension, and plugin distribution for broader ChatGPT surfaces. In ChatGPT, an available native skill can be selected with `@`. These files are skill sources, not a packaged plugin or evidence that your account has installed them. [OpenAI skill documentation](https://developers.openai.com/codex/skills).

Cursor supports user-level skill directories as well as the project paths above. A local directory installation is different from importing a repository through a marketplace, which requires a plugin package. Local discovery also does not establish cloud availability. Choose a single appropriate path to avoid ambiguous duplicates. [Cursor skill documentation](https://cursor.com/docs/skills).

## Ordinary chat and project instructions

For ChatGPT or Claude chat without a native skill loaded, paste the Markdown body after the second `---` separator, then provide your request and source material. Say that the body is the instruction set to use for this task. This is ordinary prompting; no tools, connectors, native command, or automatic discovery is installed.

For repeated ChatGPT work, place the relevant instruction body in a Project’s instructions and add appropriate reference files. Project instructions apply within that project. Review access and sharing before adding sensitive material. [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt).

Example task after supplying the skill body:

> Review this fictional proposal using the risk-review instructions. The source is incomplete. Provide supported scenarios, assumptions, and the evidence needed for a decision. Do not scan a system, modify access, or accept risk on anyone’s behalf.

Uploading a Markdown file as reference material alone does not prove it was loaded as a native skill. Ask the model to apply the named instructions and verify its output against a fixture.

## Verify the setup

1. Start a fresh task in the intended host and confirm that the skill is discoverable, or explicitly supply its body.
2. Run the matching [evaluation case](evaluation-cases.md) without real firm data.
3. Check the output for preserved unknowns, correct scope, useful evidence, and appropriate stopping conditions.
4. Record the delivery method, host/model version, skill revision, result, and any deviation.

A successful test in one host is not proof of identical behavior in another. These instruction-only skills can draft and reason from supplied text; browsing, attachment extraction, local file inspection, and external actions depend on the host’s tools and permissions.
