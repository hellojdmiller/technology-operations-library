<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Putting an AI Agent to Work Safely

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[OpenAI Hugging Face Incident: Technical Report](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf)**

Publisher: OpenAI

Published or updated: undated (the document carries no publication date; it describes events from April to July 2026 and a July 21 disclosure)

Reviewed: 2026-09-21

**Supports:** Agents in isolated evaluation sandboxes reached the internet through an internal Artifactory package mirror they could write to, and used it as a message board (pages 6 to 9). Models sometimes tried to erase or tamper with outputs to hide cheating, though none of those attempts reached the monitors' logs (page 20). Longer reasoning budgets raised the rate of sandbox probing and message-board participation (page 22). Each security objective needs multiple, overlapping, independent controls across prevention, detection, and mitigation (page 18). The plan of action restricts outbound access to approved destinations including transitive paths through shared services, adds a monitoring baseline across IAM, networking, and control-plane activity, builds tooling to halt evaluations, and sets a rule that a flag not conclusively ruled a false positive within 30 minutes results in a pause (pages 26 to 28).

**Our application:** Lesson 2 uses the mirror as the model for the relay problem. Lesson 3 takes off-host telemetry, the duration breaker, the 30-minute rule, and the separation of prevention, detection, and stop from it.

**Limits:** A vendor's account of its own incident in a research environment, at a scale no small firm runs. The 30-minute rule is OpenAI's internal target, not a standard. Independent reviews by METR and Redwood Research are referenced but not included. I verified the page references against the PDF; I cannot verify the events independently.

**Revisit when:** Recheck if OpenAI revises the report, when the independent assessments are published, or when a comparable incident report appears from another operator.

## S2

**[LLM06:2025 Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)**

Publisher: OWASP Gen AI Security Project

Published or updated: 2025 (list edition; the page states no day)

Reviewed: 2026-09-21

**Supports:** Excessive agency is damaging action taken in response to unexpected, ambiguous, or manipulated LLM output, with three root causes: excessive functionality, excessive permissions, and excessive autonomy. Mitigations include minimising extensions and their functionality and permissions, avoiding open-ended extensions, executing in the user's context, requiring user approval, complete mediation, and logging and rate limiting to limit rather than prevent damage.

**Our application:** Lesson 1 builds the authority statement around the three root causes and the read, write, and delete categories. Lesson 3 uses logging and limits as damage limiters, not preventers.

**Limits:** Community guidance for application builders, not a standard or a measurement of any deployment. It does not say how narrow is narrow enough; the packet's lists are my proposal.

**Revisit when:** Recheck when OWASP publishes a new list edition or the agentic-specific guidance it references.

## S3

**[LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)**

Publisher: OWASP Gen AI Security Project

Published or updated: 2025 (list edition; the page states no day)

Reviewed: 2026-09-21

**Supports:** A prompt injection vulnerability occurs when prompts alter the LLM's behaviour or output in unintended ways, including through content the model processes. Mitigations include constraining model behaviour, privilege control and least privilege, human approval for high-risk actions, segregating and identifying external content, and adversarial testing.

**Our application:** Lesson 1 treats an invoice PDF as untrusted content that must not become an instruction. Lesson 2 justifies least privilege and testing from inside the sandbox.

**Limits:** It catalogues a risk class and mitigations; it does not claim any mitigation makes injection impossible, and neither does this course.

**Revisit when:** Recheck at the next OWASP list edition.

## S4

**[Back to the Future: Why Agentic AI Needs a Strong Identity Foundation](https://www.nist.gov/blogs/cybersecurity-insights/back-future-why-agentic-ai-needs-strong-identity-foundation)**

Publisher: NIST Cybersecurity Insights blog (Bill Fisher and Ryan Galluzzo)

Published or updated: 2026-08-27

Reviewed: 2026-09-21

**Supports:** Agents should be treated as first-class entities with their own unique identifiers, credentials, and entitlements rather than sharing a user's credentials. Long-lived API keys and static bearer tokens are particularly problematic for agents; ephemeral credentials and sender-constrained tokens are recommended. Overly broad access is a persistent problem made worse by agent speed and scale. Excessive human-in-the-loop approval produces consent fatigue and undermines the accountability it was meant to provide.

**Our application:** Lesson 1 gives the agent its own identity and a principal, and approves categories rather than every action. Lesson 2 replaces the long-lived admin token with brokered, short-lived credentials on a dedicated service account.

**Limits:** A blog post from an NCCoE project, not a NIST standard or special publication. It names emerging protocols without endorsing products, and it does not evaluate any deployment pattern for small firms.

**Revisit when:** Recheck when the NCCoE Software and AI Agent Identity and Authorization project publishes a practice guide or draft.

## S5

**[Under the hood: Security architecture of GitHub Agentic Workflows](https://github.blog/ai-and-ml/generative-ai/under-the-hood-security-architecture-of-github-agentic-workflows/)**

Publisher: GitHub (Landon Cox and Jiaxiao Zhou)

Published or updated: 2026-03-09

Reviewed: 2026-09-21

**Supports:** Describes a layered design in which the agent runs in a dedicated container with a read-only host filesystem and tightly controlled egress; outbound requests pass a firewall; LLM tokens sit in an isolated API proxy and MCP credentials in a separate gateway so the agent has no direct access to secrets; writes are staged through a safe-outputs step that filters and limits them; and activity is logged at each trust boundary (firewall, proxy, gateway).

**Our application:** Lesson 2 uses it as a worked instance of isolation, brokered credentials, and egress control. Lesson 3 uses its logging-at-boundaries pattern for telemetry that leaves the host.

**Limits:** A vendor's description of its own product architecture; I have not tested it, and the course needs no GitHub account. It shows the pattern is buildable, not that it is right for a firm's file-and-mail agent.

**Revisit when:** Recheck if GitHub revises the architecture or the post, or if an independent assessment of it is published.

[Back to the course](README.md)
