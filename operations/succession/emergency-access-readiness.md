# Prepare and demonstrate emergency administrative access

**Status:** Vendor-neutral planning and exercise guide. It contains no credentials and is not an executable production recovery runbook. Product configuration, account roles, authentication treatment, licensing, and recovery methods require a reviewed procedure for the actual environment.

The question is whether an authorized alternate can obtain the capability needed for an approved recovery without relying on the unavailable person. A second account, a custody receipt, and a successful sign-in each establish something narrower than that outcome.

## Define the failure to survive

Start from the business capability and its dependencies. Distinguish an absent administrator from an identity outage, an unavailable password store, lost authentication material, provider unavailability, and suspected compromise. One emergency access path may not address all of them.

| Failure assumption | Question to resolve |
|---|---|
| Normal operator cannot assist | Can the alternate find the procedure, establish authority, and complete the required task without private knowledge? |
| Ordinary identity is unavailable | Does the recovery path depend on that identity for sign-in, approval, documentation, or notification? |
| Credential store is unavailable | Can authorized responders obtain the recovery procedure and necessary material without first opening that store? |
| A custodian or provider is unavailable | Is the alternate genuinely available and authorized, with a usable method and support route? |
| Normal messaging is impaired | Can approval, coordination, and accountable logging occur through the approved alternate? |
| Compromise is suspected | Does the incident process change the trusted device, account, evidence handling, or recovery destination? |

Draw the approval, retrieval, authentication, and operating dependencies separately. Two paths using the same unavailable device, identity, location, provider, or person may share the very failure they are supposed to survive. Do not call them independent merely because the account names differ.

## Specify the operating boundary

The protected [continuity control record](ownership-and-escalation.md#keep-changing-facts-in-one-controlled-record) should resolve the service, approved emergency task, approver or standing authority, operator, required witness or reviewer, custody method, alternate, capability limits, evidence location, notification route, closure requirements, and last test.

Use supported, reviewed authentication and recovery methods. This guide does not prescribe splitting a password into pieces, disabling authentication requirements, creating permanent broad privileges, or assuming all platforms support the same emergency-account design. An approval requirement and the technical mechanism that enforces it are different parts of the design.

Keep the record limited to references and nonsecret metadata. Store recovery material through the approved custody system. Do not embed credentials in runbooks, screenshots, recordings, support tickets, or this repository. If the recovery material protects the credential store itself, ensure its availability does not depend solely on that store.

Record the actual human operator and the identity used for the action. A correspondence address, a privileged identity, an application identity, and a physical custodian may serve different purposes. Avoid assuming that receipt of an approval in one channel grants every capability held by the recipient.

## Separate preparation, exercise, and real use

**Preparation** verifies assignments, procedure availability, supported recovery design, prerequisites, and evidence handling. It does not establish that recovery works.

**Exercise** uses an approved isolated environment with synthetic records by default. A paper walkthrough can assess decisions and missing prerequisites. Actual sign-in, capability, audit, and alert claims require a configured lab and observed results. Lab success does not prove a live tenant has the same configuration.

**Real emergency use** follows the current approved service and incident procedures. The operator acts only within the actual authority. A real incident may require immediate action already authorized by those procedures; a missing succession document must not delay it. If no approved access path exists, escalate and apply the approved continuity alternative rather than inventing one during the outage.

## Prepare a bounded test

Choose a harmless capability check: for example, read a synthetic configuration record that a normal user cannot read. Define the required permission, expected denial for an excluded test identity, relevant audit observation, expected alert route if the design includes one, and closure evidence.

The test plan must identify its environment, accounts, synthetic objects, allowed actions, timing objective, known limitations, recovery procedure, and stop authority. Obtain a reviewed product-specific procedure before touching configuration. Do not deliberately lock out production users, remove their authentication methods, or disable production identity to simulate the failure. Represent destructive or disruptive steps as paper injects unless a separate isolated test has been authorized and engineered.

Confirm that the participant evaluating documentation sufficiency is not dependent on coaching from the author. If a small team cannot provide independent review, disclose that limitation and arrange later corroboration for material results.

## Run and observe

1. **Confirm the test boundary.** Read the exact environment, scope, procedure revision, and authority. Verify that the evidence destination is approved and does not expose secrets.
2. **Find and obtain access.** The alternate follows the documented approval and custody path. Record missing information, rejected requests, elapsed time, and assistance. Do not substitute the absent operator's account.
3. **Prove the intended capability.** Complete the agreed harmless task. Record the actual permission and result; sign-in alone is insufficient. Run the approved negative case with the excluded test identity.
4. **Check the observation path.** Correlate the action with available audit records and verify any promised notification reached its intended recipient. A sent alert and an acknowledged alert are different observations.
5. **Close access.** Follow the approved session, temporary-permission, credential, and custody closure steps. Rotation, replacement, revocation, or re-enrollment must follow the actual supported method; do not assume every authenticator should be handled identically.
6. **Verify closure.** Confirm temporary capabilities ended as designed, approved material is returned or secured, relevant monitoring is functioning, and normal operation remains available. A logout screen alone does not establish token or role expiry.
7. **Record the outcome.** Save expected and actual results, evidence references, limits, and follow-up owners. Repeat through the required alternate paths where the adopted design relies on them.

## Stop and recover when the boundary changes

Stop the exercise if the target is ambiguous, production becomes involved, the procedure requires an unapproved action, a secret enters evidence, unexpected access is granted, or closure cannot be verified. Secure the session and material using the approved procedure, preserve a restricted record, and notify the exercise owner. If a real incident is discovered, transfer to the incident process.

Do not keep trying unknown recovery methods or repeat state-changing requests after an ambiguous response. Establish what actually happened before another attempt. If cleanup is incomplete, leave an explicit owner and restricted operating condition rather than marking the exercise finished.

## Decide what the evidence supports

| Observation | Supported conclusion | Conclusion it does not support |
|---|---|---|
| Recipient acknowledges custody | That receipt was reported or recorded through the identified method | Material is valid, authorized, or sufficient for recovery |
| Alternate signs in | That identity completed that sign-in under the tested conditions | It can perform the required administration or survive another failure mode |
| Harmless privileged task succeeds | The tested capability worked in the stated environment | Every critical service is recoverable |
| Excluded test identity is denied | The tested request was blocked in that context | Every unauthorized route has been tested |
| Logs and notification are observed | The specific action was recorded and routed as observed | Continuous coverage or guaranteed future detection |
| Temporary permission is independently observed to end | The tested closure condition occurred | All sessions or unrelated access paths were removed |

A statement by the operator remains useful evidence with an identified source and limit. Prefer independently observable corroboration for consequential capability and closure claims. Mark a missing prerequisite **blocked**, an observed mismatch **failed**, and an unperformed step **not run**; none is a pass. Risk acceptance records a business decision and does not change these observations.

Use the [readiness test record](../templates/readiness-test-record.csv) and [field dictionary](../templates/README.md), or the same fields in the protected test system. In that CSV, the prose “pass for the tested scope” maps to `supported_for_tested_scope`, and “not run” maps to `not_run`; `blocked` and `failed` retain their meanings. Record an inconclusive observation as `inconclusive`, not as a pass. One canonical test attempt can supply the different review views without duplicate result records.

Retest affected paths after material changes to identities, custodians, procedures, permission policy, provider scope, or dependencies. Set the recurring cadence according to exposure and business needs. Use the [recovery playbook](../../documentation/continuity/disaster-recovery-playbook.md), [control test record](../../cyber-risk/templates/control-test-record.md), and [readiness exercise](readiness-exercise.md) to connect access proof to broader continuity.
