# Cyber controls that can be tested

Start with the business failure: a payment is redirected, a former collaborator can still open diligence materials, a critical SaaS service cannot be recovered, or an AI workflow acts outside its authority. Then decide what should prevent or limit that failure and what evidence would show that the protection works.

This library contains **36 original control proposals** for VC/PE technology operations. They are starting points for a scoped operating program, not a complete security standard, audit opinion, certification, or claim of regulatory compliance. The scenarios and test procedures are authored examples; the primary references provide supporting context rather than prescribing every implementation detail.

## Files

| File | Use |
| --- | --- |
| [control-library.csv](control-library.csv) | Select outcomes, owners, implementation checks, operating tests, evidence, review triggers, and failure actions. |
| [assessment-template.csv](assessment-template.csv) | Blank assessment rows for all 36 control IDs. Empty cells mean no assessment has been recorded. |
| [assessment.example.csv](assessment.example.csv) | Six entirely fictional records illustrating different conclusions. Evidence references are invented labels, not links to real evidence. |
| [Validation record](VALIDATION.md) | Structural checks and limits of this resource. |

Use one assessment row per **control, service scope, and review period**. A management firm's test does not establish coverage for a fund administrator, portfolio company, or other legal entity. Name those boundaries separately. Store completed assessments and real evidence in an access-controlled location outside this example repository.

## Keep five things separate

1. **Intended state:** what an authorized owner decided should happen, for which systems and people. A proposed CSV row is not an approved policy.
2. **Implementation:** evidence that a setting, workflow, owner, contract condition, or recovery capability exists in the specified scope.
3. **Operating effectiveness:** a bounded test or observation that the intended behavior actually occurred. A saved configuration is not a successful enforcement test. A backup job is not a successful business restore.
4. **Unknown:** evidence is absent, inaccessible, stale for the decision, contradictory, or too narrow. Unknown is neither a pass nor proof of failure; assign a way to resolve it.
5. **Exception:** a separate decision accepting a defined deviation for a limited scope and period. Approval does not make the implementation complete or a failed test effective.

Recommended worksheet vocabulary:

| Field | Values |
| --- | --- |
| `intended_state_status` | `draft`, `approved`, `not_defined`, `unknown` |
| `implementation_status` | `present`, `partial`, `absent`, `unknown`, `not_applicable` |
| `operating_effectiveness_status` | `effective_for_tested_scope`, `partially_effective`, `ineffective`, `not_tested`, `unknown`, `not_applicable` |
| `exception_status` | `none`, `proposed`, `approved`, `expired` |

`not_applicable` needs a documented scope rationale. For example, action authorization may be inapplicable to an assistant that has no action-capable tools. An unavailable product license, incomplete inventory, or absent evidence does not establish inapplicability. An approved exception needs an accountable risk owner, scope, compensating measures, expiry, and a review or removal action. A proposed exception has no approval authority.

The fictional worksheet deliberately includes a present policy with no operating test (`EX-001`), an ineffective sharing test despite an approved exception (`EX-002`), unavailable logging evidence (`EX-003`), a successful but narrow lab restore (`EX-004`), an unapproved AI proposal (`EX-005`), and a justified no-action scope (`EX-006`). None establishes the condition of an actual organization.

## A repeatable test method

**Define the decision.** Choose the scenario, service, entities, data classes, account types, and intended audience. Record who owns the business consequence, who operates the protection, who may authorize a change, and who can verify it. Small teams may combine roles, but should document independent review or another compensating measure where separation matters.

**Approve the environment choices.** Each library row includes `environment_decisions`: boundaries, licenses, recovery objectives, retention needs, permitted exceptions, or other choices that cannot be safely universalized. Cadences are suggestions, not legal deadlines or promises of risk reduction. Decide the review period and evidence freshness requirement based on change rate, impact, availability, and past failures. Reassess after a material change even if the calendar review is not due.

**Establish the population.** Record where the list of in-scope accounts, devices, apps, documents, vendors, or transactions came from and what it may omit. Choose representative samples deliberately, including privileged users, unusual clients, direct sign-in paths, external identities, and failure cases where relevant. Record the numerator and denominator when known; do not turn an unknown population into a coverage percentage.

**Check design and implementation first.** Capture the approved requirement and dated configuration or workflow evidence. A screenshot should identify the relevant scope without leaking identities or secrets. A vendor assurance report can inform a dependency review, but does not prove customer-side settings or a particular local workflow are correct.

**Exercise behavior safely.** Use an approved test environment or an authorized, bounded production test. Prefer synthetic accounts, documents, messages, and transactions. Include a permitted case, a denied case, and an end-of-access or recovery case when they matter. Never move money or run a disruptive security test merely to complete a checklist. Record expected result, actual result, execution time, evidence location, tester, and verifier. Preserve relevant failures rather than replacing them with the latest passing screenshot.

**Conclude only within the evidence.** State the tested population, period, limitations, freshness, and unresolved contradictions. `effective_for_tested_scope` means that particular test supported the behavior; it does not guarantee every object or future operation. A broader claim requires broader evidence. Use the [control test record](../templates/control-test-record.md) for the detailed narrative.

**Close the loop.** Assign a named action owner and next review date for gaps and unknowns. Apply the row's failure action with normal change authority. Re-test after remediation and keep both before/after evidence. Track exceptions separately, and escalate expiry or failed compensating measures to the risk owner. A completed implementation task alone does not close the operating question.

## Choose a first working set

| Business concern | Useful starting controls |
| --- | --- |
| Compromised identity or departing staff | VCIT-005–009, VCIT-026–028 |
| Diligence and LP material shared too widely | VCIT-013, VCIT-015–018, VCIT-020 |
| Redirected payments or urgent impersonation | VCIT-022–025, with finance owning the workflow decisions |
| Lost laptop, exploited application, or absent endpoint telemetry | VCIT-010–012, VCIT-025–028 |
| Critical provider outage or failed recovery | VCIT-002, VCIT-019–021, VCIT-029–031 |
| AI retrieval, advice, or actions outside their approved scope | VCIT-032–036, supported by identity and data controls |

Use [Google Workspace](../../baselines/google-workspace/README.md) and [Microsoft 365](../../baselines/microsoft-365/README.md) for platform-specific desired-state planning and edition limitations. Their configuration assessments do not replace the operating tests here. The [AI use-case review](../ai/ai-use-case-review.md), [agent and MCP controls](../ai/agent-and-mcp-controls.md), and [AI acceptable-use policy](../../documentation/policies/ai-acceptable-use.md) add workflow-specific review details. The [risk assessment method](../../documentation/cyber-risk/risk-assessment-and-treatment.md) connects observed control limits to business decisions.

## References and interpretation

Sources reviewed on **2026-09-17**. Each CSV row links its primary reference. These are context links, not assertions that our control fully satisfies a numbered safeguard or requirement.

- [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20) organizes cybersecurity outcomes. `coverage_function` and `secondary_functions` are our broad thematic tags across its six functions, not an official crosswalk. We do not assign CSF Tiers or a maturity score from checklist completion.
- [CISA's CPG 2.0 release announcement](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/3ff7850) confirms the December 2025 update and its focus on foundational outcomes and governance. This library uses CISA's practical guidance as context; it does not reproduce a CPG assessment or imply that VC firms have critical-infrastructure obligations.
- [CIS Controls v8.1](https://www.cisecurity.org/controls/v8-1) and its official control-topic pages help identify common operational areas. Our 36 rows are not the CIS safeguard catalog, an Implementation Group completion list, or a licensed benchmark.
- [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) informs incident preparation and response; [FBI business email compromise guidance](https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise) supports independent verification of payment changes. The detailed test workflows here are our proposed operating practices.
- [NIST's Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) informs the AI risk topics. It does not certify a particular model, prompt, tool, or implementation.

Validate current vendor behavior and service capabilities when adapting a control. Legal, records, contractual, insurance, and regulatory obligations require an organization-specific determination rather than a deadline inferred from this library.
