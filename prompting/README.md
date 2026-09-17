# A practical AI prompting guide for VC IT

The goal is useful work that someone can review, repeat, and improve. I start by defining the result, giving the relevant context, and deciding what evidence would make the result trustworthy. The wording matters, but so do the source material, available tools, permissions, and the way the output is checked.

This guide covers everyday chat, reusable instructions, and tool-assisted work across Claude, ChatGPT, and AI-enabled IDEs. The examples are original and use fictional information. They are proposed patterns, not claims of measured performance across products. Sources reviewed **September 17, 2026**; product features and model behavior require a check in the intended account and version.

## Choose a starting point

| Your job | Read |
|---|---|
| Turn a vague request into a useful assignment | [1. Define the result](01-define-the-result.md) |
| Supply files, examples, and context without overwhelming the task | [2. Build the context](02-build-the-context.md) |
| Research current information and support a decision | [3. Research and decisions](03-research-and-decisions.md) |
| Draft in a consistent first-person voice | [4. Writing and voice](04-writing-and-voice.md) |
| Work with documents, tables, screenshots, and numbers | [5. Documents and data](05-documents-and-data.md) |
| Build code, configuration, and n8n workflows | [6. Code and automation](06-code-and-automation.md) |
| Use agents, tools, project instructions, and skills | [7. Agents and reusable instructions](07-agents-and-skills.md) |
| Check whether a prompt is reliable enough for its use | [8. Evaluation](08-evaluate-and-improve.md) |
| Diagnose a bad result | [9. Troubleshooting](09-troubleshooting.md) |
| Copy and adapt a complete task prompt | [10. Prompt patterns](10-prompt-patterns.md) |
| Practice the whole process | [11. Guided exercises](11-guided-exercises.md) |

## A useful first prompt

```text
Draft a one-page recovery exercise plan for a fictional 30-person investment firm.
The audience is its technology lead and a business reviewer.
Use only the synthetic service notes I provide. Identify missing prerequisites
instead of inventing them. Include scope, owner roles, expected evidence,
permission checks, failure handling, and acceptance criteria.
Draft only; do not connect to systems or run the exercise.
Finish with the unresolved decisions that materially affect the plan.

Service notes: [approved synthetic notes]
```

Start with the smallest prompt that describes the work. Add an example or a constraint when an observed failure shows why it matters. A long prompt with contradictory rules can be harder to use than a short clear assignment.

## Use the right delivery method

A chat message applies instructions to the current task. Project instructions or repository guidance preserve recurring context where supported. A skill packages a reusable procedure for a host that can load it. A tool connection enables capabilities; a prompt alone does not create those capabilities or grant access. See the existing [platform guide](../skills/platform-guide.md) for Claude, ChatGPT, Codex, and Cursor setup routes.

Use the [prompt card](templates/prompt-card.md) to version a reusable prompt and the [evaluation cases](templates/evaluation-cases.csv) to record trials. Keep actual sensitive inputs and outputs in approved storage. The example [AI policy](../documentation/policies/ai-acceptable-use.md) prohibits Confidential data; a better prompt does not override that boundary.

## Primary reading

The guide's workflows and VC IT examples are original proposals. Official sources support the general principles and product-specific distinctions: [OpenAI prompting](https://developers.openai.com/api/docs/guides/prompt-engineering), [Claude prompting overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview), and [Google prompt design](https://ai.google.dev/gemini-api/docs/prompting-strategies). Use each provider's current model guidance for settings or behavior that do not transfer across tools.
