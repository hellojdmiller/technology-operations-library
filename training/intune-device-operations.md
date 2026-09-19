# Intune device operations: understand a compliance result

**Audience:** endpoint operators supporting a small investment firm.

**Mode:** tabletop first; optional isolated tenant and disposable Windows device.

**Source review:** September 17, 2026. No device configuration was executed while preparing this lesson.

Use [Investigate an Intune compliance result](vendor-walkthroughs/intune-compliance-evidence.md) for official demonstration chapters and a fictional evidence-chain exercise before the full lab below.

## What you will learn

- Distinguish enrollment, policy assignment, evaluation, and access decisions.
- Use a pilot device population with a known expected count.
- Interpret stale, pending, conflicting, and noncompliant observations.
- Recover a test rule without assuming removal instantly reverses its effects.

## Prerequisites

The tabletop needs the [training record](training-record-template.md). A hands-on lab needs a separate Intune test tenant, an appropriately licensed test user, a supported disposable Windows device or supported test VM, and an operator with the permissions needed to create and read the chosen compliance policy. Record the OS edition/build and Intune entitlement. Follow [Intune licensing](https://learn.microsoft.com/en-us/intune/fundamentals/licensing) and Microsoft’s [test-environment sequence](https://learn.microsoft.com/en-us/intune/fundamentals/try-overview).

Enrollment is a real management action. Arrange it before the lesson using the vendor’s supported procedure; do not enroll a personal or production computer for convenience. The lab must have no enforced Conditional Access policy, downstream automation, or notification workflow that reacts to the test device’s compliance status. Otherwise use the tabletop. Do not change tenant-wide compliance defaults for this exercise.

## Scenario

A fictional firm wants to understand which devices fall below its agreed OS floor before designing a rollout. In this lesson, the OS floor is a lab input derived from the test device, not a recommended production build number.

| Fictional asset | Assignment | Baseline observation |
|---|---|---|
| `LAB-WIN-01` | Member of assigned group `LAB-Device-Pilot` | Enrolled; record the actual current build and last check-in |
| `LAB-WIN-CONTROL` | Outside the pilot, if a second device is available | Optional control; otherwise mark this check untested |
| `LAB-OS-Floor` | Proposed Windows compliance policy | Only the minimum OS version is configured |

## Exercise

1. Capture the test device’s identifier, OS version, last check-in, existing assignments, and starting compliance state. Use fictional aliases in any shared record. A matching display name is insufficient to establish that you selected the right device.
2. Write the expected device count and confirm the pilot group’s membership. Decide how to demonstrate that no other device receives the policy.
3. In the lab, create a Windows compliance policy with a minimum OS version that the test device satisfies. Leave unrelated settings unconfigured. Assign only the pilot device group. Use the ordinary mark-noncompliant action; add no email, lock, retirement, or other response. Reopen and verify the saved assignment and actions.
4. Use the supported device sync/check-status path, then inspect the policy and device reports. Record the time requested and the time observed. Do not repeatedly change settings just because reporting has not refreshed.
5. Explain separately: which device is enrolled, which policy targets it, which rule was evaluated, and whether any access control consumes that result. Microsoft describes compliance rules and their relationship to Conditional Access in [Create a compliance policy](https://learn.microsoft.com/en-us/intune/device-security/compliance/create-policy).

## Failure and recovery exercise

On paper, set the minimum OS version above the test device’s observed version. Predict noncompliance without an OS change. In the isolated lab, the instructor may apply a valid test threshold confirmed to exceed that one device’s version, after rechecking that no dependent access or response controls are active. Record the rule-level result, not just the aggregate device status. Restore the original threshold and observe a new evaluation. Leave the restored policy and its final state documented.

Use these supplied records for a second tabletop:

| Observation | Required reasoning |
|---|---|
| Device last checked in before the policy was created | There is no evidence it evaluated this version yet |
| Configuration report says Pending | Investigate check-in and delivery before assuming a settings error |
| Two configuration policies specify different values for one setting | Inspect the conflicting setting and both assignments; do not assume last-save wins |
| Device is compliant but the target app rejects sign-in | Trace the access decision separately; compliance is one possible input |

Microsoft documents device configuration reporting and per-setting conflicts in [Monitor device profiles](https://learn.microsoft.com/en-us/intune/device-configuration/monitor-device-profile) and [Troubleshoot policies and profiles](https://learn.microsoft.com/en-us/intune/device-configuration/troubleshoot-device-profiles). Configuration reports and compliance reports describe different objects; label your evidence accurately.

Do not erase, retire, reset, or unenroll a device to create a failure. Those are paper recovery scenarios only. Policy removal is not a universal rollback mechanism: the operator must check the specific setting’s behavior and actual device state.

## Expected evidence

Provide the device baseline, exact pilot count, saved policy/action record, successful rule-level evaluation, deliberately failing rule-level evaluation, restored evaluation, and dependency check. If the device did not refresh during the session, mark recovery pending and record the next observation needed. Do not claim completion from a saved policy alone.

## Assessment and answer guide

| Question | Full-credit answer |
|---|---|
| 1. How do you prove the intended device was targeted? **Scope criterion** | Verify its identity and group membership, inspect saved assignments, and match the device in policy reporting. |
| 2. Does enrollment prove compliance? | No. Enrollment establishes management; assigned rules need evaluation and their results need interpretation. |
| 3. What should you do with a stale last-check-in time? | Treat freshness as unresolved, investigate connectivity/check-in, and avoid declaring the new policy successful. |
| 4. What completes recovery from the test OS threshold? **Recovery criterion** | Restore the captured rule, obtain a subsequent device evaluation, and verify the result and any dependencies. |
| 5. Does compliance itself prove application access? | No. Confirm the actual access outcome and relevant Conditional Access or other application controls separately. |

## Limits

This is a compliance-interpretation lesson, not a production endpoint baseline. It does not validate encryption recovery, Defender onboarding, Autopilot, update-ring deployment, application packaging, mobile app protection, or Apple/Android behavior. Follow the [collection rubric](README.md) and record missing prerequisites rather than substituting live equipment.
