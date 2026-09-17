# Google Workspace operator: scope, verify, and recover

**Audience:** an operator responsible for Google Workspace identity and administrative changes.

**Mode:** tabletop first; optional isolated Workspace lab.

**Source review:** September 17, 2026. This is an unexecuted training lesson.

## What you will learn

- Explain inherited settings and the target population before changing a control.
- Distinguish 2-Step Verification enrollment, enforcement, and actual sign-in behavior.
- Use an administrative audit record to substantiate who changed what.
- Recover a test assignment without weakening the organization’s overall policy.

## Prerequisites

Use the [training record](training-record-template.md). For hands-on work, provision a separate Workspace test subscription and domain under the lab owner’s control. Use synthetic accounts, one stable administrator outside the test organizational unit, and a separately tested recovery route. The reserved `example.com` label used in written scenarios is not a domain you can enroll or verify.

The lab needs rights to create organizational units and test users, appropriate reporting privileges, and a super administrator for the 2SV settings described in Google’s guide. Confirm the actual subscription and available reports before starting. The advanced security investigation tool is edition-dependent; it is not a prerequisite for this lesson. The basic Admin log events view and the advanced investigation tool are described separately in [Google’s Admin log documentation](https://knowledge.workspace.google.com/admin/reports/admin-log-events).

If you cannot provide a separate tenant and recovery access, complete the tabletop. Do not put live administrators into an experimental unit or disable Google’s administrator 2SV requirements.

## Scenario

A fictional firm wants to onboard three new operations staff with a clear enrollment process. Two dummy users exist in the lab: `ops-learner` and `control-user`. Only the learner should receive the proposed pilot setting.

| Item | Intended state |
|---|---|
| `Training` organizational unit | Newly created, with its parent identified |
| `Training-Pilot` child unit | Contains only `ops-learner` |
| `control-user` | Remains outside the pilot |
| Configuration-group memberships | Recorded before interpreting the effective setting |
| Enrollment deadline and support route | Written proposal only |

Child units inherit parent settings unless overridden. Google’s [organizational-unit instructions](https://knowledge.workspace.google.com/admin/users/advanced/add-an-organizational-unit) explain how to create them and the required privileges. Some settings can also be applied through configuration groups; check the effective setting rather than relying on the organizational chart.

## Exercise

1. Draw the parent and child structure, list the two users’ locations and group memberships, and record the inherited 2SV setting. Write an enrollment message with a deadline, support route, and method guidance; keep it as a draft rather than sending it.
2. In the isolated lab, create the two training units and place only the learner in the pilot. Reopen the learner record to verify the assignment. Record the administrator and the time of the change.
3. Review the pilot’s 2SV setting. The lab goal is to allow enrollment and observe readiness; do not turn enforcement on or weaken an inherited enforced setting. If the test tenant already enforces 2SV, retain that state and document it. When a new permissive test setting is needed, change only the pilot unit after recording the prior value.
4. As the learner, complete enrollment using a supported method and return to the administrator’s user-security view to check status. Store any recovery material only in the lab’s protected location. A classroom record should say that recovery was established, not contain the codes.
5. Compare user-security information with the available enrollment report. Record both observation times. Do not equate a report’s absence with proof that enrollment failed.
6. Locate the administrative event for the unit or setting change using the actor and time window. Record what it supports and what it does not: an admin event proves a recorded action, not successful user authentication.

Google’s [2SV deployment guide](https://knowledge.workspace.google.com/admin/security/deploy-2-step-verification) covers allowance, enrollment tracking, and enforcement. It also explains configuration-group precedence and reporting delays. Follow its current method and recovery details when designing a rollout; this lesson does not switch enforcement on.

## Failure and recovery exercise

Use this fictional record in the tabletop:

| Observation | Interpretation to test |
|---|---|
| Pilot unit has the intended value, but the learner behaves differently | Check configuration-group settings and inherited scope before changing the parent |
| Admin event shows a save; user-security view is unchanged | A saved setting and a user’s enrollment are different facts |
| Enrollment report was generated before the learner enrolled | The report cannot verify the later action |
| Proposed deployment would include the only administrator | Stop; redesign the pilot and establish separate recovery access |

For an optional lab failure, move only the dummy learner to the wrong training unit, observe the scope mismatch, then return it to the intended unit and verify the effective setting. Restore any explicitly changed pilot setting from the captured value and confirm the final membership. Do not delete users, remove recovery methods, or deliberately lock anyone out. Account-lockout recovery is a paper exercise.

## Expected evidence

Provide the scope drawing, account/unit/group inventory, enrollment draft, captured effective setting, user-security observation, timestamped report comparison, administrative event reference, and corrected assignment. Mark simulated entries clearly. Shared records must omit real domains, account addresses, recovery data, and full log exports.

## Assessment and answer guide

| Question | Full-credit answer |
|---|---|
| 1. Why is the organizational unit alone insufficient? **Scope criterion** | Parent inheritance and applicable configuration groups can affect the setting; the learner checks the user’s effective configuration. |
| 2. What separates enrollment from enforcement? | Enrollment establishes a user’s method; enforcement is a policy requirement. Neither should be inferred from the other. |
| 3. Does an admin log entry prove the learner can sign in? | No; correlate a user outcome separately and retain the event as evidence of the administrative change. |
| 4. How do you recover from an incorrect pilot assignment? **Recovery criterion** | Restore only the dummy user’s intended unit, verify effective settings and sign-in behavior, and leave broader controls intact. |
| 5. What must precede an enforced rollout? | Verified method readiness, effective-scope inventory, communication, tested recovery, support capacity, and an approved rollout plan. |

## Limits

This lesson does not cover email authentication, external sharing, Vault retention, third-party OAuth access, endpoint management, Context-Aware Access, or domain-wide delegation. A 2SV lab is one part of operating Workspace; it is not a declaration that the tenant is secure. Use the [collection rubric](README.md) and record any unavailable edition features as untested.
