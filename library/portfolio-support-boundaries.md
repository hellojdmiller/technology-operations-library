# Defining portfolio company support

Firm IT and portfolio-company IT can collaborate without sharing the same authority or environment. Before offering support, define what is being provided, who owns the decision, and where the resulting information belongs.

## Choose a service model

| Model | Firm-side contribution | Boundary to record |
|---|---|---|
| Advice | Templates, introductions, design review, or office hours | Portfolio management owns adoption and implementation |
| Assessment | Review against an agreed scope and evidence set | Findings describe the reviewed scope, not an assurance about everything |
| Project assistance | A defined migration, setup, or recovery task | Written authority, temporary access, change approval, and handover |
| Managed operation | Continuing support under an agreed service arrangement | Service hours, access, accountability, escalation, fees, and exit responsibilities |

Do not let a helpful introduction silently become an ongoing support commitment. Document the point at which a request changes the agreed model.

## Keep identity and data boundaries explicit

Use named identities and the portfolio company's approved access process. Avoid shared administrator credentials, copied investor documents, or an integration that joins unrelated company data into one broad search surface.

Agree where assessment evidence, support records, and sensitive configurations are stored. Use redacted or synthetic material for shared learning resources. A common template does not require a common tenant or unrestricted cross-company access.

## Assessments that lead to action

Begin with business priorities, system ownership, access control, recovery needs, provider dependencies, and known risks. Record evidence limits and unverified assertions. For each finding, identify the portfolio-side owner, recommended action, acceptance test, and decision needed.

Use the [risk assessment example](../documentation/cyber-risk/risk-assessment-and-treatment.md). Keep recommendations distinct from approval and execution. A lack of evidence is an unresolved question, not automatic proof of failure or success.

## Handover and exit

At project end, transfer the runbook, verify the receiving operator's access, remove temporary rights, transfer service and billing ownership where agreed, and record unresolved work. Confirm which party handles the next incident.

## A useful first conversation

Ask which business outcome is at risk, who owns the affected service, what help is requested, who can authorize it, what data or access is necessary, and how completion will be demonstrated. Use those answers to create a bounded support record before touching an environment.

Related: [operating model](operating-model.md), [vendor lifecycle](vendor-lifecycle.md), [training resources](../training/README.md).
