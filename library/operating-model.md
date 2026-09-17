# Running the VC IT function

The first job is to make ownership visible. A small firm may outsource support, security monitoring, fund administration, and application delivery to different providers. Someone inside the firm still needs to decide priorities, accept risk, and verify that the work meets the business need.

This guide is an example operating model to adapt. It makes no assumptions about a particular firm's staffing or obligations.

## Define the services people depend on

Start with capabilities: people can join and leave safely; investment teams can collaborate on restricted material; finance can complete approved workflows; investor relations can distribute the correct information; and the firm can operate during a disruption.

For each capability, identify its business owner, technology owner, provider, data class, dependencies, service hours, recovery needs, and acceptance evidence. Use the [service catalog worksheet](templates/service-catalog.csv). A software list alone will miss the person who decides whether the service is working.

## Separate the four decisions

| Responsibility | Example question |
|---|---|
| Recommendation | What should change, and what alternatives or risks were considered? |
| Approval | Who has authority to authorize the scope, cost, or risk? |
| Execution | Who will make the change and handle a partial failure? |
| Verification | What evidence shows the intended result, and who accepts it? |

One person may hold more than one responsibility in a small team. Record that explicitly and arrange independent review for sensitive decisions. A provider's technical recommendation does not automatically transfer business approval authority to that provider.

## A practical cadence

Use a short weekly operations review for incidents, unresolved service requests, changes, and decisions requiring an owner. Review vendor renewals, spending, recurring failure patterns, and automation exceptions monthly. Review access, risks, recovery evidence, and service ownership on a defined periodic schedule appropriate to the firm.

Every agenda item should lead to a decision, an action, or a documented reason to defer. Keep owner, due date, evidence, and unresolved dependency visible. Avoid measuring success only by ticket volume.

## Provider handover

The receiving operator should demonstrate access to the right environment, find the approved procedure, explain escalation boundaries, and complete a bounded test. Record what they can operate independently and where approval remains with the firm.

Use the [automation handover](../documentation/automation-handover-template.md) and [vendor training path](../training/README.md) as starting points. Handover is incomplete when knowledge is delivered but required access, authority, or acceptance remains unresolved.

The [operations and succession pack](../operations/README.md) supplies the detailed emergency and planned-handover paths, readiness exercises, daily procedures, and working records. Use the [operating cadence](../operations/operating-cadence.md) to keep ownership and unresolved work visible between reviews.

## Evidence worth keeping

Keep a current service catalog, access review record, change decision, incident record, renewal decision, risk treatment record, and recovery-test result. Store actual identities and technical evidence in protected internal systems. The resource library contains only fictional examples.

Start with [identity policy](../documentation/policies/identity-and-access.md), [risk assessment](../documentation/cyber-risk/risk-assessment-and-treatment.md), and the [first 90 days](first-90-days.md).
