# A practical cyber-risk operating pack

Use this collection to turn a concern into a scoped review, a testable control, and a decision with an owner. It covers identity and SaaS operations, restricted information, external service dependencies, payment verification, recovery, and AI-enabled workflows. Some fictional exercises use investment operations to make those boundaries concrete.

The pack includes **36 control proposals, four operational checklists, three AI-risk guides, four tabletop scenarios, a leadership brief, and working records**. All examples are generic or fictional. These resources describe proposed practices; they do not establish a real firm's control effectiveness or regulatory compliance. Reference review: **September 17, 2026**.

## Start with the decision

| Need | Resource |
|---|---|
| Establish ownership and the review process | [Cyber-risk operating model](operating-model.md) |
| Assess an unfamiliar environment | [First 30 days](checklists/first-30-days.md) |
| Keep reviews and evidence current | [Recurring review](checklists/recurring-review.md) |
| Review a vendor or diligence dependency | [Deal and vendor review](checklists/deal-and-vendor-review.md) |
| Check response preparedness | [Incident readiness](checklists/incident-readiness.md) |
| Select and assess controls | [Control library and worksheets](controls/README.md) |
| Evaluate an AI proposal | [AI use-case review](ai/ai-use-case-review.md) |
| Bound agents, tools, connectors, and skills | [Agent and MCP controls](ai/agent-and-mcp-controls.md) |
| Test AI behavior and enforced boundaries | [AI evaluation playbook](ai/evaluation-playbook.md) |
| Rehearse decisions under pressure | [Four tabletop exercises](scenarios/tabletop-exercises.md) |
| Ask leadership for a risk decision | [Leadership risk brief](reporting/leadership-risk-brief.md) |
| Record evidence, exceptions, and test results | [Working templates](templates/README.md) |

## A first working session

Pick one business scenario and the systems and entities it actually involves. Assign the accountable business and technical roles. Select the relevant controls, record what is already known, and identify the next evidence that would change the decision. Run an authorized bounded test or keep the result unknown. Present the remaining tradeoff with a concrete owner and next action.

A small firm does not need to start by filling every field in every sheet. It does need to avoid implying that unreviewed services are covered. Keep missing populations, untested controls, and expired exceptions visible.

## Connect to the rest of the library

- [Platform baselines](../baselines/README.md) provide desired-state assertions and edition questions for Google and Microsoft.
- [Risk assessment example](../documentation/cyber-risk/risk-assessment-and-treatment.md), [incident record](../documentation/cyber-risk/incident-response-record.md), and [continuity plan](../documentation/continuity/business-continuity-plan.md) provide document structures.
- [AI acceptable-use policy](../documentation/policies/ai-acceptable-use.md) defines the current example data boundary, including the prohibition on Confidential input.
- [Prompting guide](../prompting/README.md) helps operators prepare and review AI-assisted work.
- [Control-evidence review sample](../work-samples/control-evidence-review/README.md) demonstrates a local review queue using synthetic records.

Keep completed assessments, actual weaknesses, contacts, tenant details, and evidence in the protected internal system. Preserve the distinction between a planned control, implemented configuration, tested behavior, and an authorized risk decision.
