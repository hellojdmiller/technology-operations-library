# Define the result before the prompt

A useful prompt gives the assistant a job it can finish and gives the reviewer a way to tell whether it did. “Help with cybersecurity” leaves the audience, decision, evidence, and deliverable unresolved. “Draft a risk decision memo from these three fictional findings for an operating partner” creates a concrete task.

## Build an assignment with six parts

| Part | What to specify | VC IT example |
|---|---|---|
| Outcome | The useful result or decision | A recommendation on whether a synthetic recovery pilot is ready to expand |
| Audience | Who will read or use it | An operating partner with limited time for technical detail |
| Context | Relevant facts, source material, and constraints | Scope, evidence dates, untested permissions, and available staffing |
| Authority | What actions are permitted | Draft from supplied material; no system access or external communication |
| Output | Form, length, and required fields | One-page memo with decision, rationale, unresolved risks, and owners |
| Acceptance | How the result will be judged | Every finding supported; unknowns preserved; no invented approval or completion |

Not every small request needs six headings. “Shorten this paragraph to 100 words, preserve every number, and keep the meaning” can be enough. Use the fuller structure when a task has several boundaries or a recurring failure.

## Before and after

Weak request:

```text
Act as a world-class CISO and make this better.
```

More useful request:

```text
Turn the three fictional observations below into a decision memo for an
operating partner. Explain the business consequence of each observation.
Separate observed facts from proposed treatment and unresolved questions.
Use the supplied qualitative rating definitions; do not invent probabilities.
Keep it under 600 words and end with the decisions the sponsor needs to make.
This is a draft, and none of the proposed treatments has been implemented.
[observations and rating definitions]
```

The second version defines the work without relying on a persona to create expertise. A role can help set perspective, such as “write for an operator taking over this service.” It does not provide evidence, credentials, or access the assistant does not have.

## Specify judgment, not every mental step

Ask for a concise rationale, alternatives, assumptions, calculations when useful, and evidence. There is no need to request private internal reasoning or a transcript of every thought. The reviewer needs the basis of the answer and checks that can be repeated.

For an exact procedure, specify required steps because sequence affects the outcome. For analysis, state the decision criteria and allow an efficient method. For example, “compare operating ownership, failure handling, and exit cost” is more useful than prescribing an arbitrary sequence of ten thinking stages.

## Decide how ambiguity should be handled

Name the missing facts that require a question, and where a labeled assumption is acceptable. A draft can use an unassigned owner role; an action affecting a tenant needs a known scope. Ask for the smallest missing piece that changes the result. Do not encourage the assistant to invent dates, approvals, access rights, or unavailable source material to avoid asking.

Finish the assignment with a clear stopping point: “Return the draft and remaining decisions,” or “Make the scoped local change, run the relevant checks, and report the result.” This prevents a request for a document from silently becoming a request to deploy it.

The provider documentation describes variability across models and the need to test prompts: [OpenAI prompting](https://developers.openai.com/api/docs/guides/prompt-engineering). The six-part brief above is a suggested working template, not a required vendor format.
