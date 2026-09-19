# Revising a runbook skill against actual drafts

The operating question is simple: can an assistant turn incomplete notes into a useful procedure without making the evidence look stronger than it is? The [first observed draft](../claude-runbook-draft.md) exposed gaps in attribution, evidence handling, permissions and recovery verification. This comparison preserves the subsequent drafts so the changes can be judged against their actual results.

**Observed September 19, 2026.** Two fictional cases, three instruction versions and six fresh Claude Code sessions. These are drafting observations, not recovery tests, a security benchmark or evidence of general skill reliability. The final review appears below; unresolved findings stay visible even when a rubric score is high.

## What was compared

The [fixtures](fixtures.json) contain the original recovery case and a new migration handover. Their review checks were written before the four baseline/initial-revision answers. The migration case changes the evidence conditions: a reported copy count, source-only attachment count, two named role requirements, a documented but unrehearsed rollback and no retention policy.

| Instruction version | Origin | Evaluation role |
|---|---|---|
| [Baseline](inputs/baseline-skill.md) | Repository commit `48e05972bb05ace3bd02f798dfdc7b8e152098c6` | New comparison calls using the earlier instruction body; not the original historical output |
| [Initial revision](inputs/revised-skill.md) | Five corrections explained in the [research note](../../../skills/notes-to-runbook/revision-notes-2026-09-19.md) | Evaluated once on each case before the implementer saw those outputs |
| [Refinement](inputs/refined-skill.md) | Narrow follow-up to observed attribution, content-check, role-scope and evidence-handling gaps | Evaluated again on both cases after the first review; these are reused cases, not an unseen holdout |

The implementer received generic defect descriptions rather than the new case's details. The first four answers went to a separate agent as labels A–D, with fixture text and no candidate mapping. Candidate identity was revealed after its five-criterion review. Later refinement review knew that a further revision had been made. The coordinating agent also inspected the outputs. Agent review is useful evidence about these drafts; it is not independent human operator acceptance.

## Actual results

| Case / instruction version | Score | What the review found |
|---|---|---|
| [Recovery / baseline](outputs/recovery-notes-baseline.md) | 8/10 | Reported application opening became confirmed acceptance; destination and log-handling directions were incomplete. |
| [Recovery / initial revision](outputs/recovery-notes-revised.md) | 9/10 | Attribution, destination and access checks improved in this answer; unconditional retain-as-is wording remained. |
| [Migration / baseline](outputs/migration-handover-baseline.md) | 7/10 | Added unsupported functional/lifecycle facts and source-decommission scope; attachment checks relied on counts. |
| [Migration / initial revision](outputs/migration-handover-revised.md) | 8/10 | Treated a copied count as a source total, inferred a privilege ceiling and omitted destination content checks. |
| [Recovery / refinement](outputs/recovery-notes-refined.md) | 8/10 | Added protected evidence references and content checks, but turned undocumented rollback into nonexistent rollback and job completion into success wording. |
| [Migration / refinement](outputs/migration-handover-refined.md) | 7/10 | Preserved named role requirements, but still blurred reported counts, omitted explicit attachment content checks, added cutover scope and invented an overbroad no-storage rule. |

**All six answers still need correction before operator use.** No automatic-failure event under the existing rubric was observed, but the material drafting defects remain. The refinement did not improve the scores on these two calls. This is a useful maintenance result: clearer instructions alone did not consistently produce a sound procedure. Review the exact wording, keep unresolved facts visible, and test new cases before drawing wider conclusions.

All six sessions completed with exit zero and host-reported `claude-sonnet-5`. Their traces reported no available tools, no MCP connections and no tool calls. None acted on the quoted log instruction. Because tools were unavailable and a separate system prompt also constrained behavior, this does not isolate the skill's effect or establish prompt-injection resistance when tools are enabled.

The unchanged [five-criterion practice rubric](../../../skills/evaluation-cases.md) scores evidence fidelity, scope control, unknowns, usefulness and the case-specific failure check from 0–2. Its suggested numerical threshold never overrides a concrete defect. A draft can be useful while still requiring correction and missing the environment facts needed for execution.

## Read or repeat the comparison

The [sanitized observation record](observed-2026-09-19.json) links every exact user prompt, unchanged answer and instruction snapshot, with SHA-256 hashes and reviewer findings. The original trial JSON and draft remain unchanged in the parent folder. Local host startup traces were not published because they can include account and machine metadata.

All calls used Claude Code **2.1.267**, the `sonnet` alias, low effort, two-turn and $1.50-per-call caps, and a 115-second process timeout. Each used a fresh temporary directory, empty invocation-only MCP configuration, restricted mode, no built-in tools, disabled native skills/hooks/plugins, no Chrome, no session persistence and denied unapproved actions. The exact bounded system prompt is in the observation record. The [existing invocation helper](../run-trial.py), pinned by hash there, supplied these flags; a private recording wrapper substituted each frozen fictional prompt and captured results.

For a later comparison, check the installed host's flags first, use the published prompt and instruction hashes, and save a new observation. Do not overwrite these outputs or describe a changed model, prompt or instruction body as the same trial. The parent runner's normal skill command uses the **current** skill and original recovery fixture; it does not automatically reproduce all six frozen prompts here. Sending a fictional prompt to a hosted model still uses that provider and may incur usage charges.

## Research and interpretation

Primary guidance reviewed **September 19, 2026**:

- [Claude Code skills](https://code.claude.com/docs/en/skills) distinguishes native discovery/invocation from ordinary prompt delivery and discusses testing instructions. This comparison supplies the body as text with native skills disabled; it does not test installation or discovery.
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-reference), together with installed `--help`, informed the bounded invocation and evidence capture. Page publication/update dates were not established; the tested CLI version is explicit. Host flags and logs do not certify operating-system isolation or provider retention behavior.
- The [revision research note](../../../skills/notes-to-runbook/revision-notes-2026-09-19.md) connects NIST SP 800-61 Rev. 3 and CISA recovery guidance to the instruction changes. Those sources motivate the proposed checks; they do not validate this skill.

The practical lesson from these observations is to inspect what a draft accepts as proof. Matching counts can conceal wrong objects, a copied-record report is not a measured source total, and a role table must not be expanded by assumption. Retain the source, proposed check, actual observation and acceptance decision separately.

One output per case/version cannot measure a success rate or attribute every difference to the revision. Model sampling, the shared system prompt, the 650-word request and reviewer judgment also affect the results. No native loader, other model or host, Codex retry, live migration/recovery, learner session or durable productivity outcome was tested. Revisit after an instruction, model, host, evidence requirement or intended operating task changes, and use new cases before making broader claims.
