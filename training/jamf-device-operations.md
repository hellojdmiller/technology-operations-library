# Jamf device operations: prove scope and execution

**Audience:** a Mac operator responsible for Jamf Pro policies and inventory.

**Mode:** tabletop first; optional isolated Jamf Pro lab with a disposable Mac.

**Source review:** September 17, 2026, against Jamf Pro documentation labeled 11.32.0. This lesson has not been executed.

Use [Prove a Jamf inventory result](vendor-walkthroughs/jamf-inventory-policy.md) to connect the official Jamf 100 videos and written lessons to a short scope/execution/freshness exercise before the full lab below.

## What you will learn

- Read a policy as content, trigger, frequency, and scope.
- Distinguish an inventory observation from current device reality.
- Explain how targets, limitations, and exclusions affect the recipient population.
- Verify policy execution and describe recovery appropriate to the payload.

## Prerequisites

Use the [training record](training-record-template.md). The lab needs a separately provisioned Jamf Pro instance with a valid subscription or authorized evaluation, a supported test Mac enrolled only in that instance, working management communication, and rights to read inventory and manage the test policy and group. Record the Jamf and macOS versions. Enrollment and certificate setup must already be complete; this lesson does not provide entitlement to a free lab.

Use a device containing only synthetic data. Do not connect a production Apple Business enrollment assignment or live identity integration to the lab. If no isolated instance exists, complete the tabletop and use the official [Jamf 100 policy overview](https://learn.jamf.com/r/en-US/jamf-100-course-current/Lesson_21) as supplemental study. This independent lesson is not Jamf 100 certification training.

## Scenario

The fictional firm needs a dependable inventory check before a software rollout. It should prove that one test Mac can submit fresh inventory without installing software or running a custom script.

| Object | Intended state |
|---|---|
| `LAB-MAC-01` | One disposable managed Mac |
| `LAB-Inventory-Pilot` | Static group with exactly that Mac |
| `LAB-Refresh-Inventory` | Maintenance payload: Update Inventory only |
| Trigger/frequency | Available through Self Service; once per computer |

Jamf policies define tasks, triggers, execution frequency, and scope. Removing a device from policy scope does not undo tasks already applied. See [Jamf Pro policies](https://learn.jamf.com/r/en-US/jamf-pro-documentation-current/Policies).

## Exercise

1. Capture the device’s current inventory timestamp and identity. In the protected record, use enough information to disambiguate the device; use an alias in a shared copy.
2. Create the static pilot group in the isolated instance and verify its single member. Write the expected target count and the reason for using a fixed group for this first exercise.
3. Create the lab policy. Configure only **Update Inventory** in Maintenance, no scripts, packages, account changes, cache-clearing, or other payloads. Configure Self Service availability and once-per-computer frequency; do not add a recurring trigger. Scope it to the static pilot group. Have a second person review the saved content, frequency, and scope.
4. Open Self Service on the test Mac and run the lab item once. Record the observed time and user-facing result. Inspect the policy log and the device inventory timestamp; neither is replaced by the other.
5. Compare the before/after inventory and confirm that the record belongs to the intended Mac. If the timestamp did not advance, record the discrepancy and investigate; do not simply re-run repeatedly.

Jamf describes the Maintenance payload’s inventory function in [Policy payload reference](https://learn.jamf.com/r/en-US/jamf-pro-documentation-current/Policy_Payload_Reference). The [policy deployment lesson](https://learn.jamf.com/r/en-US/jamf-100-course-current/Lesson_22) also cautions that frequent inventory collection consumes resources. This lab calls for a single controlled run.

## Failure and recovery exercise

Before the first execution, add `LAB-MAC-01` to the policy’s exclusions in the isolated lab. Verify that the item is no longer available to that device. Remove that test exclusion, reopen scope, and confirm it becomes eligible. If you already executed the once-per-computer policy, use the tabletop for this scenario; execution frequency could otherwise obscure the scope test.

In Jamf, exclusions override targets and limitations. Use [Jamf’s device scope lesson](https://learn.jamf.com/r/en-US/jamf-100-course-current/Lesson_17) to explain the result. Record the final policy state and disable this test policy after evidence is complete. Disabling stops future execution; it does not reverse previously applied payloads.

For an additional tabletop, a smart group identifies outdated Macs, but one computer’s inventory is three weeks old. Explain why its membership is based on reported attributes and why refreshing evidence matters. Jamf [smart groups](https://learn.jamf.com/r/en-US/jamf-pro-documentation-current/Smart_Groups) calculate membership from inventory criteria. Use an advanced search for a reporting-only question when appropriate; do not make every report another deployment group.

Do not create a destructive failure by erasing a Mac, deleting accounts, removing management, or changing encryption. Those scenarios require a paper walkthrough describing dependencies, recovery access, and authorization.

## Expected evidence

Provide the initial inventory timestamp, static-group membership, saved policy configuration, exclusion result, restored scope, policy log observation, fresh inventory observation, and disabled final policy. An unavailable Self Service item is an observation to diagnose, not immediate proof of a server problem.

## Assessment and answer guide

| Question | Full-credit answer |
|---|---|
| 1. Why can a targeted device still be excluded? **Scope criterion** | Scope includes optional limitations and exclusions; an exclusion takes precedence over a target. |
| 2. Why compare the policy log and inventory timestamp? | The log describes policy execution; the inventory record substantiates the refreshed data. They support different conclusions. |
| 3. Why might a smart group give a misleading picture of current state? | It evaluates reported inventory, which may be stale or incomplete; the learner checks freshness and criteria. |
| 4. Does removing a device from scope reverse an installed package? **Recovery criterion** | No. A prior action needs its own tested reversal; changing scope affects eligibility for future execution. |
| 5. Why keep this first policy to one payload? | It bounds the effect and makes the expected outcome and failure diagnosis easier to attribute. |

## Limits

This lesson does not validate application packaging, patch management, FileVault escrow, configuration-profile removal, platform SSO, or Jamf Connect. UI labels and supported versions can change. Use the [collection rubric](README.md), and record each unavailable hands-on check explicitly.
