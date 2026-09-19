# Explain an Entra Conditional Access decision

**Task card:** 2 of 8 · **Suggested practice:** 25 minutes, excluding vendor study · **Mode:** tabletop; optional existing isolated identity lab.

**Research reviewed:** September 19, 2026. Original, unexecuted practice. The [Microsoft 365 and Entra module](../microsoft-365-entra-operator.md) supplies the full prerequisites and report-only lab boundary.

## Watch or read

Microsoft's [device and Conditional Access demonstration](https://learn.microsoft.com/en-us/shows/secure-future-initiative-tech-tips/managing-devices-with-intune-and-implementing-conditional-access-protect-tenants-and-isolate-production-systems), published March 10, 2025, lists chapters at **12:40** for Conditional Access and **15:40** for emergency access. These are verified chapter labels; end-to-end playback and captions were not checked. The demonstration includes enforcement; our exercise stays within the existing report-only lesson.

Reading alternative: [Plan, implement, and administer Conditional Access](https://learn.microsoft.com/en-us/training/modules/plan-implement-administer-conditional-access/), particularly controls/assignments and testing/troubleshooting. The current module was available publicly; its publication date was not displayed. Learn reading is [free](https://learn.microsoft.com/en-us/training/support/faq); [Conditional Access licensing](https://learn.microsoft.com/en-us/entra/fundamentals/licensing) and lab permissions are separate. Preserve the parent lesson's P1, emergency-access and isolated-tenant requirements. Do not change security defaults to make a demonstration match.

## Predict before studying

Does “report-only success” prove that this policy forced a new MFA challenge? Write your answer and the evidence you would need.

## Practice with these fictional observations

Policy proposal: `LAB-M365-MFA-Observe`, report-only, assigned to the existing lesson's one-member `LAB-Operations-Pilot` group. The approved question is how that policy would evaluate; enforcement is not authorized.

| Observation | Supplied result |
|---|---|
| A | `operator-a` is a confirmed group member; report-only success; app opens; no fresh MFA prompt recorded |
| B | `operator-b` is outside the group; this policy not applied; app opens |
| C | A group member has report-only: user action required; the app still opens |
| D | A screenshot shows policy success, but the user, application and observation time are missing |

1. For each row, record what the specific policy evaluated, what the user experienced, and what remains unknown. Do not infer tenant-wide protection from one policy.
2. Write a proposed evidence request for D. Include user alias, resource, timestamp and corresponding sign-in record in a protected lab record.
3. Draft an enforcement-readiness decision with unresolved dependencies and an owner. The correct answer may be “not ready.”
4. If the separate lab prerequisites already exist, follow the parent module to compare an included and an excluded test user. Record actual results separately from the supplied observations; never overwrite fictional rows with real identifiers.

## Verify your answer

| Check | Answer guidance |
|---|---|
| A is not called proof of a new challenge | Existing authentication context may satisfy a requirement; the record does not establish a fresh prompt or enforcement. |
| B retains limited scope | This policy did not apply; other policies and access conditions still need investigation. |
| C distinguishes evaluation from blocking | The result identifies a required interactive action; this report-only policy does not enforce it. Successful app access does not prove that a fresh challenge occurred or that enforcement is ready. |
| D stays unresolved | Missing identity, resource and time prevent a defensible correlation. A favorable screenshot is insufficient. |

## Teach back and transfer

Explain the difference between group assignment, policy evaluation, authentication and application access without replaying the video. Then the group gains a second member: identify what must be rechecked before relying on the first observation.

Record study and demonstrated reasoning independently in the [training record](../training-record-template.md). Revisit when policy semantics, licensing, targeting or the interface changes. This card proves no production policy and runs no enforcement change.
