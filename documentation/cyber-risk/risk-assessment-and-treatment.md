# Cyber risk assessment and treatment report

> Adapted example. Version 0.1. All findings, ratings, evidence references, statuses, and dates in the worked example are fictional. No actual organization, product assessment, or remediation result is described.

This report helps a decision-maker understand a risk, choose a treatment, and determine whether the treatment worked. Its structure separates an observed condition from a proposed fix, implementation evidence, and residual risk.

## Executive decision

**Fictional scenario:** A small investment firm is preparing a new operations workspace. Before broad rollout, the sponsor needs to resolve incomplete access certification and prove that a restored workspace preserves its permissions.

**Proposed decision:** Keep the pilot restricted to synthetic information while the two unresolved items below are addressed. Assign accountable owners and require independent verification before production use. This is an example recommendation; no approval or deployment has occurred.

## Scope and method

The illustrative assessment covers access ownership, recovery usability, and the support handover for a fictional operations workspace. It excludes penetration testing, legal compliance conclusions, financial systems, and provider infrastructure.

For a real assessment, list the systems, versions, environment, review period, evidence inspected, sampling limits, methods, and unavailable information. Configuration review, code inspection, interviews, and execution tests provide different evidence. Do not describe one as another.

Use the six [NIST CSF 2.0 functions](https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework)—Govern, Identify, Protect, Detect, Respond, and Recover—as a coverage prompt. This example is not a framework certification or complete control mapping.

## Illustrative rating method

| Dimension | 1 | 2 | 3 |
|---|---|---|---|
| Likelihood | Unusual preconditions; limited exposure | Plausible under ordinary conditions | Likely given the demonstrated exposure |
| Impact | Local disruption with limited consequences | Material disruption or limited sensitive-data exposure | Serious business interruption or significant sensitive-data exposure |

Multiply likelihood by impact: 1–2 Low, 3–4 Moderate, 6 High, 9 Critical. These are example prioritization bands, not a statistical loss model. Explain the rating and confidence. An unknown should remain unknown until evidence supports a rating.

**Inherent risk** describes the scenario before relevant controls. **Residual risk** describes the remaining scenario after controls whose operation is supported by evidence. A planned fix does not reduce the verified residual rating.

## Fictional risk register

| ID | Scenario and business consequence | Inherent | Current residual | Status | Owner | Next action |
|---|---|---|---|---|---|---|
| EX-RISK-A | Former pilot members retain access because the owner has not completed certification | 2 × 3 = 6 High | 2 × 3 = 6 High | Open | Workspace owner | Review the full access population and verify removal decisions before widening the pilot |
| EX-RISK-B | Restored files are readable, but permissions are not tested; an incorrect audience may receive access | 2 × 3 = 6 High | 2 × 3 = 6 High | Partially implemented | Recovery owner | Test authorized and denied access before accepting recovery |
| EX-RISK-C | An alternate operator cannot find the service procedure during an outage | 2 × 2 = 4 Moderate | 1 × 2 = 2 Low | Verified closed in the fictional scenario | Service owner | Retest after changes and maintain alternate ownership |

## Detailed worked finding

**EX-RISK-B — Recovery permissions remain unverified**

**Observation:** In the fictional test record, a reviewer opened restored files as an administrator. No result shows that a business user has the correct access or that an excluded user is denied.

**Risk:** Restoration could expose restricted records or leave the intended team unable to work. Successful file recovery does not establish correct authorization.

**Evidence:** EX-EVIDENCE-B1, a fictional sample restore summary. It demonstrates file retrieval only. No underlying record is included or claimed to exist.

**Recommendation:** Restore a bounded synthetic sample to an isolated destination. Compare permissions against the approved baseline, test allowed and denied identities, and capture any inherited or external-sharing differences.

**Acceptance criteria:** The agreed content is usable; intended users have the approved rights; excluded users cannot access it; unexpected sharing is absent; the business owner accepts the result; exceptions have owners.

**Verification:** Pending in this example. The residual rating remains High until the relevant control has been demonstrated and reviewed.

## Status definitions and scorecard

- **Open:** Treatment is not implemented or evidence is insufficient.
- **Partially implemented:** Some actions are complete, but a material gap remains.
- **Mitigated:** A compensating control demonstrably reduces risk; the original condition remains.
- **Verified closed:** The specific acceptance criteria have passed for the recorded scope and version.
- **Accepted:** An authorized risk owner has accepted a stated residual risk through an expiry or review date. This is not closure.

The fictional register contains **3 findings: 1 Open, 1 Partially implemented, and 1 Verified closed**. None is recorded as Mitigated or Accepted. Two require action before the proposed rollout. Report severity and status separately so a partly treated serious risk remains visible.

## Treatment and verification record

For each item, record the treatment choice, accountable owner, approver, target date, implementation reference, verifier, test scope, expected result, observed result, evidence date, residual rating, and next review. Where a deadline is unresolved, label it unassigned and escalate it rather than inventing one.

Retest the actual failure condition and a relevant negative case. A changed setting, added library, or code diff may establish implementation but not effectiveness. If evidence is unavailable, say what was not verified.

## Before reuse

Replace every fictional finding. Agree the scoring method and risk appetite with the responsible sponsor. Keep actual weaknesses, system paths, evidence, and risk acceptance decisions in the protected internal record. Use [this sanitized CSV](../../library/templates/risk-register.csv) as a starter schema.
