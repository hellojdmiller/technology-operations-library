<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Where AI Helps a Small Security Team

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[AI and cyber security: what you need to know](https://www.ncsc.gov.uk/guidance/ai-and-cyber-security-what-you-need-to-know)**

Publisher: UK National Cyber Security Centre

Published or updated: Published 13 February 2024; page states it was reviewed 31 July 2026

Reviewed: 2026-09-21

**Supports:** Written for non-technical managers and executives across large organisations, the public sector, and small and medium businesses. Says AI tools can get things wrong and present incorrect statements as facts, can be biased and gullible when asked leading questions, and are exposed to prompt injection (an input crafted to make the model behave in an unintended way, including revealing confidential information) and data poisoning. Warns that risk grows as these tools pass data to third-party applications, and asks leaders to treat security as a business priority, plan for incidents, and address data governance.

**Our application:** Grounds the verification duty (check every claim about the environment against the environment) and the point that a tool reading an alert or email can be steered by text inside it.

**Limits:** A short explainer, not a control standard or an evaluation of any product. It does not measure how often assistants err on security tasks or address the specific tool in the packet.

**Revisit when:** When NCSC updates the page or publishes fuller guidance on using AI tools in security operations.

## S2

**[2025 Top 10 Risk and Mitigations for LLMs and Gen AI Apps](https://genai.owasp.org/llm-top-10/)**

Publisher: OWASP Gen AI Security Project

Published or updated: 2025 edition; the page shows translation releases dated 12 March 2025 and 22 July 2025

Reviewed: 2026-09-21

**Supports:** Lists ten risks: prompt injection, sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation, and unbounded consumption. The linked entries say sensitive information includes PII, financial details, confidential business data, security credentials, and legal documents, and recommend educating users not to enter it; describe excessive agency as arising from excessive functionality, permissions, or autonomy and recommend human approval of high-impact actions and least privilege; and define misinformation and overreliance, recommending that outputs be cross-checked against trusted sources with human oversight for critical decisions.

**Our application:** The 'not the tool's decision' column follows the excessive agency entry, the data rules follow the sensitive information disclosure entry, and the middle column's verification step follows the misinformation entry.

**Limits:** Written for people building LLM applications, so much of it addresses developers rather than a team using a hosted assistant. It is a consensus list of risks, not evidence about any product's error rate.

**Revisit when:** When OWASP publishes the next edition of the list.

## S3

**[AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)**

Publisher: National Institute of Standards and Technology

Published or updated: AI RMF 1.0 released 26 January 2023; Generative AI Profile (NIST AI 600-1) released 26 July 2024; page notes the framework is being revised

Reviewed: 2026-09-21

**Supports:** Describes a voluntary framework for managing risks in the design, development, use, and evaluation of AI systems, organised around Govern, Map, Measure, and Manage. Says the Generative AI Profile helps organisations identify unique risks posed by generative AI and proposes actions for managing them, and notes that AI RMF 1.0 is being revised as part of the White House AI Action Plan.

**Our application:** Named as a reference for the point where an assistant gains tools that act, when the firm's questions become governance questions rather than a single setting.

**Limits:** A landing page for a voluntary framework, not a control checklist, and it is written for organisations of every size and sector. It does not evaluate assistants on security tasks or tell a small firm what to do on Monday.

**Revisit when:** When NIST publishes the revised AI RMF or updates the Generative AI Profile.

## S4

**[Joint Guidance on Deploying AI Systems Securely](https://www.cisa.gov/news-events/alerts/2024/04/15/joint-guidance-deploying-ai-systems-securely)**

Publisher: Cybersecurity and Infrastructure Security Agency, with NSA, FBI, and partner agencies

Published or updated: 2024-04-15

Reviewed: 2026-09-21

**Supports:** Announces guidance from NSA's AI Security Center with CISA, the FBI, and partner agencies in Australia, Canada, New Zealand, and the United Kingdom, for organisations deploying and operating externally developed AI systems. It aims to improve the confidentiality, integrity, and availability of AI systems, ensure known vulnerabilities are mitigated, and provide methodologies and controls to protect, detect, and respond to malicious activity against AI systems and related data and services.

**Our application:** Named alongside the NIST framework as a reference for the step where an assistant is connected to tools that act on firm systems.

**Limits:** An alert page that summarises and links the full guidance; the full PDF is hosted elsewhere and was not the page reviewed. Written for deployers of AI systems generally rather than for small security teams using a hosted assistant.

**Revisit when:** When the agencies update the guidance or CISA publishes AI security guidance aimed at small organisations.

## S5

**[Observing Agents After the OpenAI Hugging Face Incident](https://hellojdmiller.com/articles/observing-agents-after-the-openai-hugging-face-incident)**

Publisher: JD Miller, hellojdmiller.com

Published or updated: 2026-09-21

Reviewed: 2026-09-21

**Supports:** The author's reading of OpenAI's technical report on an incident in which evaluation agents, trying to finish tasks rather than attack anyone, used a shared package mirror as a message board, forged administrator tokens, and reached third-party infrastructure. It argues that detection must be automatic and live where the agent cannot reach, that the signal worth engineering is a task-boundary crossing, and it lists tests a small firm can apply: map relays, pair credentials with network paths, plant decoys, separate prevention, detection, and mitigation, time the kill switch, and hold a 30-minute rule.

**Our application:** The lesson's short pointer to the risk of agents acting on their own, and the transfer case's requirements for an account-disabling connector, follow this article and the packet's D3 section 3.5.

**Limits:** One operator's analysis of one vendor report, not independent research or guidance. The incident involved research workloads at a large AI developer; the article says its operational details do not transfer to a small firm, only the threat model.

**Revisit when:** When the author revises the article, or when the underlying report is corrected or independently assessed.

[Back to the course](README.md)
