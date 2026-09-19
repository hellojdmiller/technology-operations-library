# Write in a consistent voice without inventing experience

Give the assistant both a point of view and factual boundaries. “Write in my voice” works better with a few approved examples and a description of what should remain constant: directness, sentence length, technical depth, audience, and how the writer handles uncertainty.

## Use a compact voice brief

```text
Write for technology leaders and operators in [audience or operating context]. Use clear, direct prose
and practical operating examples. Frame the piece as how I think through a
problem: the question, the tradeoff, the evidence I would want, and a proposed
way forward. Use first person for the viewpoint, not for invented history.
Do not claim I deployed, measured, led, or achieved something unless the
supplied facts establish it. Keep employer identities and private situations
out of the piece. Preserve uncertainty and cite current technical claims.
```

Add two short approved writing samples if available. Explain what to borrow from each, such as the opening style or the amount of detail. Remove unrelated names and facts; style examples are not evidence for the new article.

## Turn a biography into a thought process

Original fictional sentence:

> JD transformed an investment firm's security program by deploying a comprehensive AI governance solution.

Possible revision:

> I would start by listing what the assistant can read and what it can change. That makes the first decision concrete: which use cases fit the firm's data boundary, and which need a narrower design?

The revision offers a perspective without claiming an implementation happened. If the source actually establishes a past outcome and it is appropriate to publish, keep it accurate and explicitly supported. Do not replace missing evidence with confident storytelling.

## Draft in useful stages

Begin with the thesis and the reader's problem. Then ask for an outline that identifies the evidence needed for each substantive point. Research the unstable claims, draft the argument, and review the facts and voice separately. A polished paragraph can still contain an unsupported assertion.

For a revision, name what may change: “Reorganize the argument and simplify the wording; preserve the facts and numerical claims.” If the original contains a factual mistake, ask for a flagged correction rather than silently preserving it for stylistic consistency.

## Give observable feedback

Replace “make it better” with the specific failure: “The opening takes three paragraphs to reach the decision,” “This sounds like a biography,” or “The recommendation does not explain who operates it.” Ask for one revision focused on that problem. Keep the strongest passages and avoid repeatedly rewriting the whole piece without a reason.

## Finish with two reviews

The factual review checks names, numbers, quotations, source support, and historical claims. The editorial review checks the thesis, audience, transitions, useful examples, and ending. For a public article, inspect the final rendered page, title, links, and any publication or update date. Backdated presentation should not imply that later research or a later product feature existed earlier.

Use the [document-sanitization skill](../skills/document-sanitization/SKILL.md) for authorized derivative material, followed by human review for contextual identification. A voice prompt is not a privacy control.
