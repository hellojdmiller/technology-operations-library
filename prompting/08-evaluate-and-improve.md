# Evaluate the prompt against the work

Choose the failure conditions before refining the wording. A response can sound convincing and still omit an important record, invent a source, or confuse a recommendation with an approved action.

## Build a small representative set

Start with ordinary cases and the boundaries that matter: incomplete input, conflicting sources, an ambiguous owner, a duplicate identifier, a hostile instruction inside source material, and a question the evidence cannot answer. Use synthetic or properly approved data. Keep some cases separate from the examples used to tune the prompt so the evaluation does not merely reward memorizing those examples.

Use the [starter cases](templates/evaluation-cases.csv) as a proposed exercise set. They have not been executed against any model. For higher-consequence uses, expand coverage based on real failure modes and obtain appropriate review; passing a small set is not a statistical guarantee.

## Score observable behavior

| Criterion | What the reviewer checks |
|---|---|
| Task completion | The requested deliverable and all material input records are represented |
| Evidence | Important factual claims link to supporting supplied or retrieved sources |
| Uncertainty | Missing information, conflicts, and untested results remain visible |
| Scope | The assistant stays within the allowed data and action boundary |
| Usability | The intended reader can understand and act on the result |
| Structure | Required fields, formats, units, and dates are valid |

A practical proposed rubric is 0 for absent or incorrect, 1 for partial, and 2 for meeting the criterion. Report each criterion, not just a total. Define critical failures separately: fabricated approval, prohibited disclosure, unauthorized action, or a material unsupported claim may block adoption regardless of the average score.

## Compare changes fairly

Record the prompt revision, source packet, host, model/version when visible, enabled tools, settings, date, and output. Keep these stable when comparing two prompt versions. Repeat selected cases to observe variability; a single good result can be luck. If the product changes its underlying model without exposing a fixed version, record the visible product details and the limitation.

Change one material factor at a time where practical. A shorter prompt, a better source packet, or a different retrieval method can each improve the outcome, but changing all three prevents a clear conclusion about which helped. Assess quality, elapsed time, and operating effort; a slightly more polished answer may not justify a much more complex workflow.

## Use reviewers thoughtfully

Automated checks are useful for schema, exact IDs, counts, and prohibited destinations. Human review is important for source support, consequences, and practical usefulness. A model can help flag issues, but a model grading its own output is not independent verification. Compare model judgments with human judgments on representative cases before relying on them.

Do not ask the model for a confidence percentage and treat it as a calibrated probability. Ask what evidence supports the conclusion, what is missing, and which condition would change it.

## Version and retest

Keep the winning prompt, the evaluation evidence, and known limitations together using the [prompt card](templates/prompt-card.md). Retest when the model, source corpus, retrieval, tool permission, schema, or intended use changes. For agents, also inspect actual tool attempts and destination behavior rather than only the final response.

Provider guidance supports defining success criteria and testing prompt changes: [Claude overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) and [OpenAI evaluation principles](https://developers.openai.com/api/docs/guides/evaluation-best-practices). This guide uses an offline review method and does not depend on a particular hosted evaluation product. For security tests, use [the AI evaluation playbook](../cyber-risk/ai/evaluation-playbook.md).
