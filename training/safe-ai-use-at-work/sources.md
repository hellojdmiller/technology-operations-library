<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Using AI Without Leaking

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)**

Publisher: OWASP GenAI Security Project (OWASP Top 10 for LLM Applications)

Published or updated: undated (page carries the 2025 list edition in its title)

Reviewed: 2026-09-21

**Supports:** Defines prompt injection as user prompts or processed content altering the model's behavior in unintended ways, and separates direct injection (in the user's own input) from indirect injection (hidden instructions in websites, files, or other external sources the model reads). Its attack scenarios include hidden instructions that cause data exfiltration. Mitigations include constraining model behavior, least-privilege access, human approval for high-risk actions, and segregating untrusted external content; the page says fool-proof prevention is unclear given how generative models work.

**Our application:** Lesson 2 uses the direct/indirect distinction, the exfiltration example, and the emphasis on limiting what the system may do and keeping human approval for high-risk actions.

**Limits:** A community-maintained risk list for people building LLM applications, not a study of how often office users are affected or a test of this course. It is written for developers; the lesson translates it for readers who only use assistants. The page gives no publication or update date.

**Revisit when:** Recheck when OWASP publishes a new edition of the list or renumbers the entry.

## S2

**[Prompt injection is not SQL injection (it may be worse)](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)**

Publisher: UK National Cyber Security Centre (NCSC)

Published or updated: 2025-12-08

Reviewed: 2026-09-21

**Supports:** Argues that prompt injection cannot be fully fixed the way SQL injection can, because an LLM makes no distinction between data and instructions: 'there is only ever next token'. It describes LLMs as inherently confusable deputies, treats prompt injection as a residual risk, and recommends deterministic safeguards that constrain what the system can do, dropping the system's privileges to those of the party whose content it is processing, avoiding deny-lists of attack phrases, and logging inputs, outputs, and actions.

**Our application:** Lesson 2 uses the data-versus-instructions point, the idea that a connected assistant acts with the user's privileges, and the recommendation to limit actions rather than try to spot every bad sentence.

**Limits:** A blog post aimed at developers and security teams, not formal guidance for end users, and not evidence about any particular product. Its design recommendations are for people building systems; the lesson draws out the consequences for someone using one.

**Revisit when:** Recheck if NCSC publishes formal guidance on the topic or updates the post.

## S3

**[Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)**

Publisher: National Institute of Standards and Technology (NIST), U.S. Department of Commerce

Published or updated: 2024-07 (month only; approved by the NIST Editorial Review Board 2024-07-25)

Reviewed: 2026-09-21

**Supports:** Defines confabulation as confidently presented erroneous or false content, notes that outputs may include confabulated logic or citations that mislead people into trusting them, and says the risk matters most when users act on false content. Its information security section describes direct and indirect prompt injection, including injecting prompts into data likely to be retrieved and the demonstrated theft of proprietary data. Suggested actions include deploying fact-checking to verify generated information (MP-2.3-003) and reviewing and verifying sources and citations in outputs (MS-2.5-003). Its data privacy section covers leakage of sensitive information.

**Our application:** Lesson 3 uses the confabulation definition, the warning about confabulated citations, and the two verification actions. Lesson 2 uses the direct and indirect prompt injection description.

**Limits:** A voluntary framework profile written for organizations deploying generative AI, not a user manual and not a measurement of error rates in office tasks. Its suggested actions are addressed to organizations; the lessons apply them at the level of one person checking one draft. NIST has since indicated that the AI RMF is under revision.

**Revisit when:** Recheck when NIST publishes a revised AI RMF or an updated generative AI profile.

## S4

**[Data, Privacy, and Security for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy)**

Publisher: Microsoft Learn

Published or updated: 2026-07-09 (article date)

Reviewed: 2026-09-21

**Supports:** States that prompts, responses, and data accessed through Microsoft Graph are not used to train foundation models; that Copilot surfaces only organizational data the individual user has at least view permission to; that responses are not guaranteed to be factual and users should use their judgment when reviewing output before sending it to others; that classifiers to block prompt injection exist but may not be available in all scenarios; and that agents connected to Copilot carry their own privacy statements and terms.

**Our application:** Lesson 1 uses the training and permissions statements to explain what an approved organizational tool changes. Lesson 2 uses the permissions model to explain acting on the user's behalf. Lesson 3 uses the review-before-sending statement.

**Limits:** Vendor documentation describing one product's commitments to commercial customers. It does not cover consumer Copilot, other vendors, or the fictional tools in the packet, and the statements depend on the organization's license and configuration. It is not independent evidence that the protections work.

**Revisit when:** Recheck when the article date changes, when the product is renamed again, or when the firm's actual tool or license changes.

## S5

**[Generative AI in Google Workspace Privacy Hub](https://knowledge.workspace.google.com/admin/gemini/generative-ai-in-google-workspace-privacy-hub)**

Publisher: Google Workspace Knowledge Center

Published or updated: 2026-08-14 (last updated)

Reviewed: 2026-09-21

**Supports:** States that user prompts are customer data under the Cloud Data Processing Addendum, that Workspace does not use customer data to train models without the customer's prior permission, that content is not human-reviewed or used for model training outside the customer's domain without permission, that Gemini retrieves only Workspace content the user already has access to, and that existing data loss prevention and rights management controls apply. It distinguishes the Workspace product from the consumer Gemini app, which runs under different terms.

**Our application:** Lesson 1 uses it alongside S4 to show that the organizational product and the personal account are different arrangements, and that the assistant sees only what the user can already open.

**Limits:** Vendor documentation for one product family, subject to the customer's agreement and admin settings. It is not independent evidence, does not describe other vendors, and does not cover the fictional tools in the packet. The page was reached by a redirect from an older support.google.com address.

**Revisit when:** Recheck when the page's last-updated date changes or when the firm's actual tool or license changes.

[Back to the course](README.md)
