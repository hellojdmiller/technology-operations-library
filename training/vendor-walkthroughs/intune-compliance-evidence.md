# Investigate an Intune compliance result

**Task card:** 3 of 8 · **Suggested practice:** 25 minutes, excluding vendor study · **Mode:** tabletop; optional existing isolated endpoint lab.

**Research reviewed:** September 19, 2026. Original, unexecuted exercise. Use [Intune device operations](../intune-device-operations.md) for the full lab prerequisites and recovery procedure.

## Watch or read

Microsoft's [device and Conditional Access demonstration](https://learn.microsoft.com/en-us/shows/secure-future-initiative-tech-tips/managing-devices-with-intune-and-implementing-conditional-access-protect-tenants-and-isolate-production-systems), March 10, 2025, lists a compliance-policy chapter at **03:58** and access-policy chapter at **12:40**. The chapter list was inspected; playback, captions and a full transcript were not verified.

Reading alternative: [Protect data and control access with Intune and Conditional Access](https://learn.microsoft.com/en-us/training/modules/protect-data-control-access-intune-conditional-access/). Its public outline connects compliance and access controls; publication date was not displayed. The linked parent lesson supplies current reporting references. [Intune licensing](https://learn.microsoft.com/en-us/intune/fundamentals/licensing), updated August 6, 2026, distinguishes user/device entitlement from administrator access. Free Learn content does not provide a device or licensed lab. Use the existing lesson's standalone compliance lab with no dependent access/notification action.

## Predict before studying

A device is enrolled and its dashboard says compliant. Does that establish it evaluated the policy you saved five minutes ago?

## Practice: build an evidence chain

These are fictional records, not live exports. All times are **exercise UTC** on the same day. `LAB-OS-Floor` was saved at 10:00; its exact test threshold is already recorded by the lab owner.

| Device | Saved assignment | Last check-in | Rule observation | Application observation |
|---|---|---|---|---|
| LAB-WIN-01 | In pilot | 09:40 | Aggregate compliant, observed 09:45 | Not tested |
| LAB-WIN-02 | In pilot | 10:07 | New policy pending at 10:09 | Not tested |
| LAB-WIN-03 | In pilot | 10:12 | Minimum OS rule noncompliant at 10:14 | App opens at 10:16 |
| LAB-WIN-CONTROL | Outside pilot | 10:13 | No result for this policy | Not tested |

1. Draw five boxes: device identity → enrollment → assignment → rule evaluation → access decision. Place each supplied fact in the correct box.
2. Give each device a scoped finding and next evidence request. Preserve pending and stale states; do not count them as passing.
3. For LAB-WIN-03, propose how to investigate the access result without changing the compliance rule or enabling an access policy.
4. Use the parent lesson's recovery record to state what would prove a test threshold was restored and newly evaluated. Do not claim recovery from a saved edit alone.

## Verify your answer

| Device / question | Answer guidance |
|---|---|
| LAB-WIN-01 | Its observation predates policy creation. It cannot prove evaluation of this policy version. |
| LAB-WIN-02 | Delivery/evaluation remains pending. Request a later rule-level observation and check device communication before changing settings repeatedly. |
| LAB-WIN-03 | Noncompliance and application access describe different stages. Determine whether a relevant access policy consumes this result and inspect its scope/decision. |
| LAB-WIN-CONTROL | Consistent with the stated exclusion, but one absent result is not universal proof that no policy ever targeted it. Correlate saved assignments and identity. |
| Recovery | Capture restored configuration plus a subsequent evaluation and any dependent business outcome. If reporting has not refreshed, record recovery pending. |

## Teach back and transfer

Explain why a policy save, sync request and compliant device are different observations. Then a screenshot uses the same display name for two devices: name the stable identifier evidence needed before diagnosing either one.

Use the [training record](../training-record-template.md). Revisit after reporting, enrollment, licensing or policy changes. This card changes no policy, enrolls no device and establishes no production compliance.
