# Patching and vulnerability remediation SOP

> Proposed procedure, version 0.1. The operating decisions below are original examples for local adoption, not a universal standard or a live deployment instruction. Completed records and evidence belong in a restricted system. No production actions were performed.

## Outcome and boundary

The outcome is an owned disposition for every affected or unresolved asset: a verified remediation, supported non-applicability, verified removal from the affected scope, or an explicitly open risk with its next decision. Patching does not establish that a suspected compromise has been eradicated; use [security alert triage](../../sops/security-alert-triage.md) in parallel when incident indicators exist.

NIST treats patch management as preventive maintenance spanning identification through verification, with business and technology stakeholders involved. This pack turns that broad planning principle into proposed working records and review gates. [NIST SP 800-40 Rev. 4](https://csrc.nist.gov/pubs/sp/800/40/r4/final).

Scope can include firm-managed endpoints, infrastructure, software dependencies, and supplier-managed services. Record the legal entity and actual operating authority. A portfolio company, fund administrator, or SaaS supplier may require a separate handoff; firm administrator access is not authority to alter another organization's systems. Supplier-managed fixes still need an accountable internal owner and scoped confirmation.

## Authority and preconditions

| Responsibility | Required record |
|---|---|
| Recommend | Analyst states applicability, exposure, intelligence, uncertainty, and a proposed response. |
| Approve priority and residual risk | Designated security/risk and service owners resolve urgency, business impact, due dates, and exceptions within delegated authority. |
| Approve the change | Change authority authorizes the scope, method, timing, success criteria, and recovery/stop conditions through the [change pack](../change-management/sop.md). Existing emergency or standard-change authority may be cited where it applies. |
| Execute | Authorized operator verifies targets and performs only the approved action. A scanner account does not imply change permission. |
| Verify | Reviewer checks independent current evidence and service results; document when staffing requires the same person to execute and verify. |

Before a campaign, confirm an inventory owner, trusted update/advisory sources, change route, recovery capability, monitoring, user communication, and staffed escalation. A missing prerequisite is a decision for the accountable owner, not an unrecorded reason to defer indefinitely. Record evidence locations without embedding credentials, recovery keys, personal data, or exploitable internal detail in a general-purpose register.

## 1. Establish coverage before counting fixes

Reconcile the asset inventory with management enrollment, endpoint/security reporting, software inventory, network or cloud inventory, and the responsible supplier's scope. Establish which populations each source can and cannot see. Include remote, powered-off, rarely used, shared, newly acquired, and retiring assets; also include third-party applications, browser components, firmware, and appliances where managed by your organization.

For each asset, record a stable identity, service/owner, operating system and relevant product/build, management method, support entitlement/lifecycle, exposure, last contact, and discovery time. Mark unknown ownership, unmanaged assets, absent telemetry, duplicates, and unsupported versions explicitly. Retire an asset from the denominator only with verified retirement/ownership-transfer evidence; disappearance from a tool is not retirement. Confirm source health before interpreting a sudden reduction in findings.

## 2. Establish finding applicability

Link the finding to the original detection and vendor advisory. Check affected product, version/build, component, configuration, platform, and prerequisites. Distinguish an operating-system update from a separate application, firmware, driver, or service-side fix. Check supersedence and the vendor's stated fixed versions; a newer-looking string alone is insufficient.

A successful authenticated assessment provides different coverage from an unauthenticated scan. Record authentication success, relevant checks/signature version, scan errors, exclusions, time, and asset matching. Do not run intrusive validation or exploitation without separate authorization. Resolve a suspected false positive using vendor and scoped technical evidence; preserve the original result and reviewer rationale.

If applicability remains unknown, assign an investigation action and checkpoint. Maintain a protective response appropriate to plausible exposure while evidence is gathered. Do not classify uncertainty as low risk simply to keep it off a dashboard.

## 3. Decide local priority and targets

Check current vendor advisories and credible exploitation intelligence, including the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog). Record the source, lookup time, finding match, and what is actually asserted. No KEV match is not evidence that exploitation is impossible. BOD 22-01's binding deadlines apply to Federal Civilian Executive Branch agencies; they are not automatically private VC/PE deadlines. Determine separately whether any applicable obligation or contract adopts a target. [CISA explanation of BOD scope](https://www.cisa.gov/news-events/alerts/2022/05/11/cisa-adds-one-known-exploited-vulnerability-catalog).

CISA SSVC offers a decision-tree approach that considers organizational consequences and exploitation, rather than treating technical severity as the complete decision. The local labels below are this pack's proposed workflow, not an implementation or scoring of SSVC. [CISA SSVC guide](https://www.cisa.gov/sites/default/files/publications/cisa-ssvc-guide%20508c.pdf).

Record CVSS and its version/source if useful, but weigh it with reachable attack paths, privileges, data, credible exploitation, available safeguards, business dependency, unsupported software, patch availability, and change/recovery risk. A high score on an inapplicable component and a lower-scored exposed access service are different decisions. If incident evidence exists, start the incident route without waiting for patch scheduling.

| Proposed lane | Typical decision trigger | Local target to approve and record |
|---|---|---|
| `urgent_review` | Credible exploitation or severe reachable exposure; suspected compromise goes to the incident process too | A named decision owner and explicit immediate-review checkpoint; separately approve interim protection and a remediation/verification due time. Do not wait for routine maintenance solely because it is scheduled later. |
| `expedited` | Applicable exposure warrants action sooner than the established maintenance cycle | A staffed pilot/change window, verification deadline, and escalation time if that window cannot be met. |
| `scheduled` | Evidence supports treatment in the agreed maintenance cycle | A specific campaign due time and verification window; reassess when exposure or intelligence changes. |
| `undetermined` | Identity, applicability, ownership, or current evidence is missing | An investigation due time, interim risk decision, and next review. This is an active queue, not a low-priority bucket. |

Adopt these lanes only after owners agree what can be staffed. The policy decision must define the starting event, calendar/time zone, escalation route, and who can revise a target. There are **no universal 24-hour, seven-day, or 30-day deadlines in this pack**. The fictional case dates are case-specific local decisions. Keep the original and revised target with the reason and approver; a missed target stays visible. A supplier response promise and a [service-desk response target](../../service-level-management.md) are not a remediation commitment.

## 4. Plan the change, dependencies, and recovery

Create or link the approved change. Identify affected business processes, authentication and remote-access dependencies, integrations, device prerequisites, license/edition coverage, vendor support, and any sequencing between components. Confirm update provenance using the vendor-supported distribution route and integrity checks. A downloaded package is not an approved package.

Choose a small, representative pilot across relevant models, builds, applications, user workflows, and connectivity patterns. State what the pilot cannot represent. Define successive rings by risk and dependency, with an accountable release decision for each. Select observation time and measurable acceptance checks locally; “no complaints” is insufficient. Avoid placing every recovery path or redundant service member in the same change batch.

Agree restart expectations, user notices, saved-work requirements, power/storage/connectivity prerequisites, maintenance timing, emergency contact, and what happens when an asset misses its window. Confirm backup currency and an actually usable recovery route where the change requires it. A backup, snapshot, restore point, or console button does not by itself prove that this update is reversible. Define alternate service, rebuild, replacement, or failover options when a supported rollback is unavailable.

**Windows deployment check.** Intune update rings control update and restart behavior; check edition, licensing, and overlapping management policies. A pause may reach a device after installation has begun. Uninstall eligibility depends on the update and device state; feature-update removal has a limited window and enablement-package exclusions. An uninstall request can cause removal and restart outside maintenance scheduling. Verify the exact supported path and consequences before approval. [Microsoft update ring documentation](https://learn.microsoft.com/en-us/intune/device-updates/windows/manage-update-rings).

**Apple deployment check.** Confirm supported OS, enrollment/management capabilities, authorization prerequisites, and reported installation status. Apple's documented enforcement time uses the device's local time zone; preserve that local setting and its UTC interpretation in the change record. Enforcement can close open apps and restart macOS. An offline or unready device can miss enforcement and retry later. A declared target is therefore not evidence of installation. [Apple installation and enforcement documentation](https://support.apple.com/guide/deployment/install-and-enforce-software-updates-depd30715cbb/web).

Do not copy Windows uninstall assumptions into an Apple, firmware, appliance, or application plan. Establish recovery using the exact vendor's current documentation and test scope. An operating-system rollback may also reintroduce the vulnerability or fail to restore application/data compatibility; assess both exposure and business recovery.

## 5. Execute the approved pilot and rings

Reconfirm the asset list, approval, current intelligence, support status, and stop conditions at the start. Capture pre-change evidence, actual package/build and targeting, operator, job/action reference, timestamps, and required restart. Keep queued, downloading, installing, reported success, reboot pending, failed, and unreachable outcomes distinct.

Check the pilot's technical and business results before expanding. Stop expansion when the agreed criteria fail, critical workflows break, asset identity is uncertain, or observed behavior exceeds the approved scope. Escalate to the change owner with the remaining exposure and a concrete decision: troubleshoot, constrain rollout, use a supported recovery plan, or approve an alternate mitigation. An emergency process can compress gates under recorded authority; it does not make unverified recovery safe.

## 6. Work the failures and exceptions

For failure, inspect current state and action history before retrying. A timeout may hide a successful installation; repeated submission can worsen an outage. Check the actual error and prerequisites, policy conflicts, supersedence, restart state, and vendor advisories. Record failures per asset and assign the repair action.

For offline devices, retain the last credible observation and its age. Contact the owner through an approved route and decide a safe reconnection/assessment path; do not instruct a suspected compromised device to reconnect broadly. An access restriction is a separate authorized, verified action, not a presumed side effect of an overdue record. Unknown state must remain in coverage and risk reporting.

For unsupported software or hardware, do not invent a patch or infer coverage from a successful scan. Confirm lifecycle/support facts; assign upgrade, replacement, retirement, or containment decisions. A renewal promise or purchase order does not establish current support or mitigation.

When remediation must be deferred, use the [exception record](../../templates/exception-register.csv): affected scope and finding, rationale, business risk owner, approval decision, safeguards and their evidence, explicit expiry, earlier review triggers, retest owner/date, and planned exit. Proposed, missing, rejected, expired, or out-of-scope approval does not create a valid exception. A valid exception keeps the finding open as residual risk. Expiry triggers a new decision and escalation; it neither renews itself nor authorizes an unsafe forced deployment.

## 7. Verify the result and close the correct claim

After the required restart and stabilization, reconcile the same asset's current product/build and management status with the vendor's fix applicability. Reassess the original finding using an authorized, functioning check that covers the affected component. Confirm scan identity, authentication/coverage, collection time, and tool health. Check the affected business workflow and dependencies, including remote administration needed for recovery.

If a check cannot run, record `incomplete` and a next action. If installation succeeded but the finding persists, investigate supersedence, component coverage, delayed restart, failed remediation, or a supported false-positive explanation. Preserve conflicting observations. A disappearing result, stale report, closed ticket, or future-dated observation cannot support current remediation by itself.

| Disposition | Evidence and remaining work |
|---|---|
| `remediated_supported` | Asset-specific current fixed state, required restart, relevant finding reassessment, service acceptance, reviewer, and timestamps. Close only the tested scope. |
| `not_applicable_supported` | Current product/configuration evidence and vendor applicability rationale, reviewer, and a reassessment trigger. |
| `mitigated_only` | Evidence of the safeguard and its scope; underlying vulnerability remains open with an exception/exit decision where required. |
| `incomplete` or `failed` | Missing, stale, conflicting, or adverse evidence; retain an owner, next action, and target. |

Removal of an affected service or asset can support a separately stated closure when retirement and loss of the relevant exposure are verified. Never label that outcome “patched.” Capture operator results, verification evidence, decision authority, residual limitations, and closure reviewer in the linked records.

## 8. Review coverage and improve the next campaign

Report the declared campaign population and additions/removals with reasons. Separate verified fixed, supported non-applicable, mitigated/open, exception-approved/open, overdue, failed, unsupported, and unknown/unreachable counts; these categories may overlap, so state the denominator for each. Keep the original due-date result alongside approved revisions. Do not improve success percentages by excluding missing devices or redefining installed as verified.

Review recurring failures, time waiting for ownership/approval, pilot regressions, restart blockers, supplier delays, expiring exceptions, and evidence gaps. Update the next campaign's inventory and tests. Review the procedure on material changes to tooling, platform support, threat information, or business dependencies. The cited sources were checked on 2026-09-17; recheck vendor behavior and authoritative intelligence when operating this process.
