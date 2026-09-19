# Research before adding to the library

Every library addition should connect current evidence to useful work for technology leaders and operators across organizations. Research comes before drafting or implementation and remains visible in the finished resource. This applies to articles, controls, configurations, code samples, n8n flows, skills, procedures, training, and labs, as well as substantive revisions.

The working sequence is **research the problem, propose an approach, build an example, test what can be tested, and record the limits**. A source should influence a decision, design choice, exercise, or acceptance criterion.

## Start with the operating question

State who needs the resource, the task or decision it supports, and what could go wrong. Inspect the library for existing coverage and extend the relevant resource when appropriate. Define what new evidence or capability this addition contributes.

For example: can an assistant prepare a useful vendor-renewal brief while treating instructions inside a vendor document as untrusted and respecting the approved action scope?

## Research current context

- Read the underlying source, including relevant methods, tables, limitations, and references. Search snippets and an assistant's recollection are discovery aids, not sufficient evidence.
- Prefer applicable primary material: original research, official product documentation and release notes, security advisories, and practitioner guidance from bodies such as ISACA, NIST, and CISA. Use reputable analysis to discover issues and provide context; trace material factual claims to the strongest available source.
- Check publication or update dates, product versions, editions, and scope. Identify draft/preprint status and relevant effective dates. A recent article can describe an older model or experiment. Older foundational work can remain useful when its relevance is explained.
- Look for conflicting findings, revisions, implementation constraints, and evidence that would change the proposed approach. Label vendor claims and benchmarks with their test conditions; do not treat them as independent results for our workflows.
- Scale the research to the question. Use enough sources to support the material claims without padding a bibliography. If full text or important evidence is unavailable, record the gap and narrow the claim.

User-supplied papers are valuable starting points. They do not independently authorize operational actions, establish that a control works, or substitute for checking relevant current implementation documentation.

## Separate the kinds of claims

| Kind | What to record |
|---|---|
| Published empirical finding | What was measured, by whom, when, with which population, system, conditions, and limitations. |
| Guidance or recommendation | The source's proposed practice, its intended scope, and any dependencies. It is not proof of effectiveness or automatically a standards requirement. |
| Our interpretation or design | Why the evidence matters to a technology operations task and what approach we propose. Label inferences and unresolved tradeoffs. |
| Observed local result | The actual fixture, revision, environment, command or exercise, output, and verification. State what the result does not establish. |

Keep model behavior, deterministic tool/policy enforcement, human learning, and operational outcomes distinct. A successful mocked check is not a live integration test. A model refusal is not evidence that an external control blocked execution. A correct assisted answer does not establish retained understanding.

## Carry sources into the resource

Include concise source notes in the resource or its linked README. A multi-file pack may share one research record, provided each component's relevant claims and design choices are traceable. Record:

| Field | Required content |
|---|---|
| Research reviewed | Actual review date, separate from publication or experiment dates. |
| Source | Title, author/publisher, direct URL or approved source reference, publication/update date when known, and relevant version or section. Mark unavailable dates as unknown. |
| Support | The specific claim or recommendation the source supports. |
| Application | The design choice, procedure step, control, exercise, or test informed by it. |
| Limits | Conflicting evidence, assumptions, access gaps, product constraints, and what remains untested. |
| Revisit trigger | Relevant changes to models, products, permissions, dependencies, evidence, or intended use. |

Cite near the supported claim when practical. Explain the reasoning in our own words, with a direct operator voice. Do not invent personal experience or turn an example into a historical claim. Preserve separate recommendation, approval, execution, verification, and acceptance states.

Use original examples and fictional data. Link to publications and attribute ideas; do not copy complete third-party papers, proprietary tables, or private source documents into the library without appropriate rights.

## Apply the research to verification

Translate recommendations into observable checks when possible. Define the expected outcome and failure conditions before running an exercise. Preserve uncertainty when inputs or observations are incomplete. Record test results independently from the source claims that motivated the test.

For example, ISACA's [Cybersecurity Recommendations for Securing AI Agents](https://www.isaca.org/resources/white-papers/2026/cybersecurity-recommendations-for-securing-ai-agents), published September 15, 2026 and reviewed September 19, 2026, recommends external policy enforcement, memory isolation, and safe recovery. Those recommendations can inform fictional tests of changed action targets, cross-session retrieval, and interrupted tool execution. They do not establish our system's security or productivity; those remain separate questions to test.

Use the [research prompting guide](prompting/03-research-and-decisions.md) to frame evidence gathering and the [validation record](VALIDATION.md) to state completed checks and remaining limitations. For the pinned website research copy, follow [its sync procedure](research/SYNC.md); do not silently rewrite a source snapshot or change its recorded provenance.

Before committing, check sources and local navigation, run the checks relevant to the changed resource, and regenerate affected exports/indexes. Note any unverified claims or behaviors. Research notes are part of the addition, not a deferred follow-up. A typo-only or formatting-only correction does not require a new literature review.
