# Prompt for research that supports a decision

Define the decision before searching. “Research AI security” can produce a broad summary. “What controls should a small firm require before allowing an assistant to search an approved internal knowledge base?” focuses the evidence and the resulting recommendation.

## Set a research boundary

Specify the question, relevant date, geography or environment when material, source preference, and how the findings will be used. If current product behavior or standards matter, ask for primary sources. State whether browsing is available. An assistant without retrieval should not claim that it verified a current feature.

```text
Research the controls needed for a read-only AI knowledge assistant at a
fictional investment firm. Use current official standards and product or
protocol documentation. State the review date and label draft guidance.
Separate documented capability from my proposed operating choices.
Return: key requirements, unresolved implementation questions, a bounded
synthetic pilot, and links supporting material factual claims.
Do not assume access to a tenant or that a subscription includes a feature.
```

“Current” does not mean the newest search result automatically wins. Ask the assistant to compare the publication date, effective or release date, version, and the date of the described event. A final standard and a later draft can both be relevant while carrying different authority.

## Make evidence traceable

For each material claim, retain source title, direct link or document location, version/date, supported claim, and limitation. Open the source during review. A citation is useful only if its content supports the adjacent statement. Search snippets, vendor marketing summaries, and repeated claims from several articles can all point back to the same unverified assertion.

Ask for the contrary case: under what conditions would the recommendation be wrong, or a simpler approach be preferable? Require material tradeoffs, such as staffing, edition limits, integration burden, exit cost, and dependencies. Avoid a forced ranking when options serve different purposes or evidence is insufficient.

## Convert findings into options

Use three layers: facts established by evidence, interpretations drawn from them, and proposed choices. A source may establish that a product supports audit export; it does not establish that your tenant has it configured, that retention meets your need, or that an operator can retrieve an event during an incident.

For build versus buy, ask for the work that remains after purchase or development: maintenance, review, response, model or API changes, and offboarding. Give the assistant known costs and mark unknown amounts. Do not let a precise-looking spreadsheet create false confidence in invented prices.

## Review the output

Check the few claims that drive the decision first. Confirm that an unavailable source stayed unavailable, uncertainty did not disappear in the conclusion, and a proposed trial did not become an assertion of success. If evidence conflicts, preserve the disagreement and explain what would resolve it.

For risk-related research, use [the risk-review skill](../skills/risk-review/SKILL.md). For adoption, connect the recommendation to [the AI use-case review](../cyber-risk/ai/ai-use-case-review.md). The prompts here are original research workflows; they do not establish legal duties, investment suitability, or production assurance.
