# Network and service reachability triage

> Adapted operational example, version 0.1. Topology, users, devices, and events in the illustration are fictional. This SOP proposes a diagnostic process, not permission to change network or security settings. No live network checks were performed for this example.

## Trigger and scope

Start when an approved website or service is unavailable, slow, intermittently reachable, or visibly blocked. Cover the initial separation of application, identity, browser, endpoint, policy, local-network, and upstream-service causes. The outcome is an evidenced explanation, an approved repair with verification, or a handoff that identifies the next diagnostic owner.

Do not assume the security agent, Wi-Fi, firewall, or provider is the cause before collecting evidence. A symptom can have multiple contributing causes. A security block may be working correctly and require business review rather than technical repair.

## Preconditions and decision boundaries

Use an approved case, a known service owner, verified device and user references, and authorized read-only diagnostic tools. Know which networks and systems the operator may inspect. Confirm whether the user is in a managed location, remote location, or traveling without collecting unnecessary personal location data. Preserve a communications path before any change that may interrupt remote support.

| Boundary | Responsible role and output |
|---|---|
| Recommendation | Service desk proposes the next diagnostic step or scoped repair based on observations. |
| Approval | Network or security owner approves configuration changes; business owner accepts service interruption and any temporary workaround. |
| Execution | Operator with authority for the affected layer makes the approved change. Endpoint support access does not confer firewall, DNS, or security-policy authority. |
| Verification | Reviewer compares the original failing operation and control state before/after; user confirms business functionality. |

## Procedure

1. **Describe the failed operation.** Record service name, a sanitized destination, exact error or block category, first observed time and zone, intermittent versus consistent behavior, affected population, device/OS/client versions, and business impact. Keep sensitive paths, query tokens, and internal addresses in protected evidence only. Record a screenshot that excludes unrelated content.
2. **Check service and incident context.** Review the approved provider status source and internal incident/change records. A public status page without an incident does not prove the tenant or region is healthy. Link correlated reports to one case while retaining their distinct observations. Escalate widespread or critical-function impact using the local incident process.
3. **Observe endpoint and connection state.** Check the expected connection, signal/link state, address assignment, system time, current VPN/proxy/filter status, and management health through authorized tools. Compare with the intended baseline; do not change settings to match a guess. Note recent changes and whether the device has reported current telemetry.
4. **Distinguish failure layers.** Use the table below to select the next read-only observation. Keep tests bounded to the requested service and approved comparison destinations. A blocked probe or failed ping alone does not establish service failure; different protocols can be treated differently.
5. **Inspect policy evidence.** Where an explicit block exists, have the authorized reviewer correlate timestamp, destination, device/user reference, policy identifier, and verdict. Confirm the specific rule that applied and why. Do not repeatedly access a suspected malicious destination or change its spelling to evade the block. If the destination is legitimate but policy review is needed, provide evidence and a proposed narrow exception to the security owner.
6. **Compare safely, one variable at a time.** With authorization, compare the same harmless operation in another supported browser, on another managed device, or from another approved connection. Keep required controls active. Record what changed and what remained constant. An alternate network may alter DNS, policy, routing, and authentication at once; a changed result narrows possibilities but does not prove which component is at fault.
7. **Prepare a repair or escalation package.** State confirmed observations, competing explanations, excluded causes and their limits, business impact, and the next action. For a proposed change include scope, expected effect, owner, approval, rollback, and how to check protection afterward. Use vendor instructions matching the exact version and model.
8. **Verify the original task after an approved change.** Re-run the agreed harmless operation and check adjacent required behavior, current policy state, and monitoring. Record the user result separately from the technical result. Remove or track temporary exceptions and diagnostic access. If nothing was changed, record the basis for the supported explanation or accepted handoff.

| Observed symptom | Next observation; avoid this inference |
|---|---|
| Cannot join the expected network | Check connection/authentication and available diagnostics; do not infer an upstream internet outage. |
| Joined but no usable address or route | Compare intended address assignment and network state; do not assign an arbitrary static address. |
| Name resolution failure | Capture approved resolver results and policy context; do not replace managed DNS with a public resolver. |
| TLS/certificate error | Check time, destination, and trust-chain evidence; do not bypass the warning or install an unverified certificate. |
| Sign-in or access-denied response | Review identity and resource authorization context; reachability may already be working. |
| Explicit block page or filtering event | Review rule and destination classification; a policy decision is not automatically a malfunction. |
| One service fails while others work | Compare service-specific health and dependencies; do not assume the local network is healthy in every respect. |

## Stop conditions and partial failure

Stop for suspected interception, credential compromise, malware, an unsafe destination, unknown network ownership, or a request to bypass controls. Transfer security concerns to [security alert triage](security-alert-triage.md). Do not uninstall managed security/VPN software, reset network settings, reboot shared equipment, or collect packet payloads under this initial-triage scope. Those require a specific reviewed plan.

If remote access drops after a change, use the prearranged local contact or alternate route; do not send repeated configuration commands without knowing current state. Reconcile pending jobs before retrying. If an exception restores access, verification must also establish its intended scope and expiry. A broad bypass is not an acceptable permanent repair. If a provider has not acknowledged escalation, ownership remains with the internal case owner.

## Expected evidence and closure

Retain the symptom, scope, sanitized test matrix, timestamps, exact observations, policy or service-health references, approved change, before/after state, user acceptance, and outstanding uncertainty. Close as restored and verified, explained policy outcome with accepted next action, or acknowledged escalation. Keep unresolved service loss visibly open under a named owner; ticket reassignment alone is not a handoff.

## Synthetic example

EX-NET-027 records an approved portal timing out on two managed devices. Another approved connection works while security controls remain active. The analyst records a connection-dependent symptom and asks the network owner to inspect resolver and upstream paths. The ticket does not claim that the office firewall is the root cause or authorize a DNS change.

## Reviewed vendor guidance

Apple describes both VPN/security software and other possible causes, and advises consulting the organization before changing a managed device. [Network connectivity and security software](https://support.apple.com/en-us/102281). Its Wireless Diagnostics tool provides a supported way to analyze Wi-Fi; diagnostic archives may include identifying information and should remain protected. [Wireless Diagnostics](https://support.apple.com/guide/mac-help/use-wireless-diagnostics-mchlf4de377f/mac). Both sources were reviewed on 2026-09-17. They inform the diagnostic choices; they do not establish an environment's actual topology or authorize changes.
