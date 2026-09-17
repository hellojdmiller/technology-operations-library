# Microsoft 365 and Entra operator: prove an identity change

**Audience:** a firm IT operator or outside administrator responsible for workforce access.

**Mode:** tabletop first; optional isolated tenant lab.

**Source review:** September 17, 2026. No tenant exercise has been performed as part of writing this lesson.

## What you will learn

- Translate a business request into an explicit user and application scope.
- Separate policy coverage, authentication success, and the application outcome.
- Interpret report-only evidence without claiming a control is enforced.
- Prepare recovery and a handover that a second operator can follow.

## Prerequisites

The tabletop needs only this document and the [training record](training-record-template.md). The lab needs a separate Microsoft 365 test tenant, two ordinary test users, two established emergency-access accounts, and an administrator able to manage Conditional Access. Give affected test users the applicable Entra ID P1 entitlement; risk-based policies require P2 and are outside this lab. Confirm licensing against [Microsoft Entra licensing](https://learn.microsoft.com/en-us/entra/fundamentals/licensing).

A lab administrator must establish and independently test the emergency-access arrangement before the exercise. Microsoft recommends at least two such accounts; their authentication and recovery design deserve separate treatment. Use [Microsoft’s emergency-access guidance](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access), not a password recorded in the lesson. Do not change an existing tenant’s Security Defaults or other identity controls to make this lesson work; record incompatibility and remain in tabletop mode.

## Scenario

The fictional firm has an investment team and an operations team. Operations wants a pilot to require multifactor authentication when its two test users access Microsoft 365. The request does not authorize changes to administrators, partner accounts, guests, service identities, or other applications.

| Fictional object | Intended role |
|---|---|
| `LAB-Operations-Pilot` | Assigned-membership group containing `operator-a` only |
| `operator-a` | In-scope ordinary test user |
| `operator-b` | Out-of-scope control user |
| `LAB-M365-MFA-Observe` | Proposed report-only policy |

The group starts with one member so a reviewer can reason about the entire scope. A one-user lab demonstrates a method; it does not establish firm-wide readiness.

## Exercise

1. Write a change card: business purpose, application, included group, excluded accounts, current controls, owner, and recovery method. Capture group membership before starting. In the tabletop, draw the proposed policy rather than creating it.
2. In the isolated lab, create the proposed policy under Conditional Access. Select the pilot group and the Microsoft 365 target resource displayed in your tenant; require multifactor authentication; set the policy to **Report-only**. Record the actual resource display name and identifier in the protected lab record. Do not select all users or all resources.
3. Reopen the saved policy and verify scope, grant requirement, and report-only state. Have a reviewer compare these with the change card. Do not infer configuration from the policy’s name.
4. Sign in to the target application as each ordinary test user. Record the time, user alias, application, and whether the application actually opened. Inspect the corresponding sign-in entry and the report-only policy result. Existing authentication claims can affect the result; do not promise an MFA prompt.
5. Classify each observation below. Explain what further evidence is needed before proposing enforcement.

| Supplied fictional observation | Question |
|---|---|
| `operator-a`: report-only success; app opens | Which conditions were evaluated, and what has not been proven? |
| `operator-b`: report-only not applied; app opens | Is this expected or a coverage gap? |
| A later `operator-a` sign-in is blocked by a different policy | Did this report-only policy block access? |
| No recent entry for the chosen app appears | Is the evidence missing, delayed, or for the wrong resource? |

Report-only policies are evaluated without enforcing their controls, and their results appear in sign-in details. A compliant-device requirement has additional prompt behavior on some platforms; this lab deliberately uses only the MFA grant. See [Microsoft’s report-only explanation](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/concept-conditional-access-report-only).

## Failure and recovery exercise

On paper, replace the include group with a similarly named empty group. Predict the result: sign-in might succeed while the intended policy never applies. The recovery is to restore the intended assignment, verify membership, and collect a new correlated sign-in. A successful sign-in alone would miss this error.

In the isolated lab, reproduce only this scoping error while the policy remains report-only, then correct it and verify the new result. Stop if an unexpected user or resource appears. Restore the captured policy configuration or set this lab policy to Off; record the end state. Do not delete accounts or weaken unrelated controls. Treat an accidental enforced lockout as a paper walkthrough using the established emergency-access process.

## Expected evidence

A complete record contains the change card; before/after membership; saved policy scope and state; two correlated sign-in observations; the wrong-group result; the recovery observation; and the final lab-policy state. Never include authentication secrets, actual recovery codes, or raw sign-in exports in a shared example.

## Assessment and answer guide

| Question | Full-credit answer |
|---|---|
| 1. Why does the control user matter? **Scope criterion** | It checks that the policy does not apply outside the intended group; the learner verifies membership and actual policy evaluation. |
| 2. Does report-only success prove enforcement? | No. It supports an evaluation result for that sign-in, not enforcement or coverage of other users and apps. |
| 3. Why might the pilot user see no new MFA prompt? | A valid MFA claim may already satisfy the requirement, and report-only does not itself enforce a challenge; inspect the sign-in evidence. |
| 4. How would you recover from the wrong-group assignment? **Recovery criterion** | Restore the captured assignment, recheck the target population, obtain a new sign-in observation, and verify the end state. |
| 5. What is needed before expanding the pilot? | Representative scenarios, account and app inventory, tested exclusions and recovery, user communication, named approval, and an observed rollout plan. |

Score with the [collection rubric](README.md). For rollout planning beyond this lesson, use [Microsoft’s Conditional Access deployment plan](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/plan-conditional-access).

## Limits

This lesson does not establish a complete identity baseline. It does not test phishing-resistant authentication strengths, legacy protocols, external identities, workload identities, federation, device compliance, session revocation, or emergency-access resilience. Tenant defaults and other policies can change the observed result. Record what was actually tested.
