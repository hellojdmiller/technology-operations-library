# Lost or stolen device response procedure

> Adapted example for a fictional investment firm. Version 0.1. This procedure contains no live device identifiers, locations, contact details, or management configuration. Validate platform actions before adoption.

Use this procedure when a managed phone, tablet, or laptop is reported missing. The priorities are personal safety, protection of information and access, evidence preservation, and restoring the person's ability to work.

The incident lead coordinates the response. An authorized device operator executes supported actions. The security reviewer assesses exposure and evidence needs. The designated business owner approves destructive actions within the organization's incident authority.

## 1 Confirm and record the report

Verify the reporter through a known channel. Record the device type, managed asset reference, ownership model, last known possession, report time and time zone, and whether the device was locked. Ask about suspected theft, sensitive local data, authenticators, and any unusual account activity.

Retrieve the device record and preserve the relevant enrollment, encryption, last check-in, compliance, and access information in the protected incident record. A stale management status does not establish the device's present condition.

## 2 Assess exposure and contain access

Review the operating system, enrollment mode, supported remote actions, current reachability, and scope of management before issuing commands. Do not assume every platform supports lock, location, lost mode, or selective wipe in the same way. For example, Microsoft publishes platform-specific [device action support](https://learn.microsoft.com/en-us/intune/device-management/actions/) and [remote lock prerequisites](https://learn.microsoft.com/en-us/intune/device-management/actions/remote-lock).

Choose supported containment actions based on the risk. Record the operator, authorization, target, intended effect, command time, and returned state. Revoke affected access or sessions using the identity and application platforms' supported controls. Removing a device's authenticator must not leave the account without required MFA; arrange verified replacement authentication.

Understand whether revocation affects one application, one device, or all sessions. Record any remaining access window or unsupported control and escalate it. Do not claim that a submitted revocation immediately invalidates every token everywhere.

## 3 Distinguish submission from completion

| Observed state | Record and response |
|---|---|
| Action submitted or queued | Request exists; execution remains unconfirmed |
| Device acknowledged the action | Record the acknowledgment and what it establishes |
| Platform reports completion | Capture the supported completion evidence and relevant verification |
| Failed, unsupported, or offline | Record the limitation and continue other containment measures |

Never close the incident solely because a lock or wipe request was accepted by a console. Location information may be unavailable or stale; it is not proof of current possession.

## 4 Handle recovery safely

Use authorized recovery channels. Do not ask employees to confront a suspected thief or visit an unsafe location. Share sensitive location data only with authorized responders for the permitted purpose. Let the incident lead coordinate any law-enforcement or insurance contact under the organization's process.

## 5 Decide whether to erase data

The decision considers exposure, encryption evidence, ownership, management scope, recovery likelihood, investigative preservation, and any applicable hold. Record the reason, approver, expected data loss, and action selected.

Confirm the effect of full-device erase, retirement, and application-data removal for the actual platform and enrollment mode. They are not interchangeable. Do not erase personal data outside the Firm's authority.

After an authorized action, record the result and continue monitoring if it is pending. Retain the management and asset records needed to track commands, preserve evidence, and support recovery. Prematurely releasing a device from management or enrollment can impair that work.

## 6 Replace and close

Provision a compliant replacement and verify sign-in, authentication, required applications, and restored access. Mark the missing asset appropriately in the inventory. A replacement device does not resolve the original exposure.

Close or transfer the incident only when containment, exposure assessment, communication decisions, and pending actions have an accountable owner. Record any unconfirmed wipe as an unresolved condition. Review what would improve reporting, encryption assurance, and response capability.

## Practice before relying on the procedure

Use a test device to demonstrate a supported lock, an offline pending action, an unsupported action, and verified recovery. Record platform versions and enrollment modes in the internal runbook. This repository does not contain results from such a test.

Related: [identity and access](../policies/identity-and-access.md), [incident record](../cyber-risk/incident-response-record.md), [adaptation guide](../ADAPTATION.md).
