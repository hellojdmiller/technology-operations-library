# From baseline gap to controlled change

This is an original planning template. All bracketed fields are environment-specific. The service owner sets the acceptance thresholds before implementation.

## Change record

| Field | Fill in |
|---|---|
| Baseline control and version | [Control ID / version] |
| Current evidence | [Private evidence reference, date, exact scope] |
| Intended behavior | [Who can do what, from which device, using which method] |
| Business dependency | [Deal team / finance / investor relations / service desk / external collaborator] |
| Effective assignments | [Include and exclude groups, inherited rules, overlapping policies] |
| Entitlement and prerequisites | [Verified edition, licensed population, roles, enrolled methods/devices] |
| Change owner / approver / verifier | [Named people in the private operational copy] |
| Pilot population | [Representative platforms, travel, external collaboration, accessibility needs] |
| Stop conditions | [Named critical workflow fails / unexpected lockout / recovery route unavailable] |
| Rollback operator and access | [Separate tested access path and saved previous configuration] |
| Implementation window | [Date, time zone, support coverage] |

## Four review gates

**1. Understand the current state.** Record both the configured intent and effective behavior. Identify legacy clients, service integrations, external users, shared mailboxes, delegated access, and inherited exceptions. If any result is unknown, say what observation would resolve it. Preserve the pre-change configuration in an approved location.

**2. Prove recovery.** Test the relevant recovery path before making access more restrictive. Do not remove protections to make an emergency-account test convenient. Use the vendor-specific emergency-access design in the platform guide, confirm who can operate it, and verify that a test appears in monitoring.

**3. Pilot and validate.** Use a narrow group or organizational unit. Use report-only/evaluation capabilities where the product supports them; do not assume every setting has a simulation mode. Exercise the business workflow, a denied scenario, the exception path, and recovery. Include an external collaborator and a newly provisioned account when relevant. Record results and support tickets; a saved setting is not acceptance evidence.

**4. Expand and recheck.** Increase scope only after the agreed checks pass. Watch sign-in and collaboration failures during the rollout. Recheck assignments after the change has propagated, then collect a fresh observation against the baseline assertion. Assign a review date and an owner for any residual gap.

## Rollback is specific to the change

| Change | Prepared rollback | What rollback cannot undo |
|---|---|---|
| Access policy | Restore the reviewed previous assignment/state using tested admin access | A missed meeting, lost time, or previously exposed data |
| Sharing restriction | Restore only the approved scope after inspecting existing permissions | Copies already downloaded; broad re-enablement may restore old access |
| Email authentication | Restore the saved DNS policy while investigating legitimate senders | Already rejected messages; DNS propagation delay |
| Retention/deletion rule | Stop before rollout unless recovery and hold impacts are understood | Data already purged may be unrecoverable |
| Application permission removal | Reauthorize the minimum reviewed permissions if justified | Failed jobs or deleted/changed data from earlier executions |

Do not treat broad disabling of identity protections as a standard rollback. Select the smallest affected policy/scope and preserve a documented protective alternative.

## Exception record

```json
{
  "owner": "[Accountable service owner]",
  "reason": "[Business need and evidence for the temporary gap]",
  "compensating_control": "[Specific protection, how it is tested, and by whom]",
  "expires_on": "2026-10-17"
}
```

The date above is an example. An exception needs a real expiry and review action in the private operational copy. Record the affected identities/resources there, not in a reusable public example. Missing entitlement may justify a budget decision or compensating process; it does not establish that the underlying risk is absent.

## Evidence to keep

Keep the approved intent, configuration before/after, exact population, effective behavior tests, negative test, recovery/rollback test, verifier, timestamps, and unresolved limitations. Store credentials and recovery secrets separately. A useful monthly review asks: what changed, which evidence aged out, which exceptions expire next, and which business workflow still needs proof?
