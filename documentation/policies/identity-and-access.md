# Identity and access management policy

> Adapted example for a fictional investment firm. Version 0.1. No effective date or organizational approval is implied. Roles and review frequencies are illustrative.

This policy governs who may access the Firm's systems, how that access is approved, and how it is removed. It covers employees, contractors, administrators, service identities, and third parties.

Access should have a business purpose, an owner, an approval, and a way to verify that it has ended. Seniority alone does not justify broad access or administrator privileges.

## Responsibilities

| Role | Accountability |
|---|---|
| Manager or sponsor | Requests access, confirms the business purpose, and reports changes or departures |
| Data or system owner | Approves the requested scope and duration |
| IT operator | Implements the approved change and records the result |
| Security reviewer | Reviews elevated access, exceptions, and suspicious activity |
| Business risk owner | Accepts a documented residual risk within delegated authority |

For sensitive access, the requester and approver must be different people. Where staffing prevents independent execution and verification, document the limitation and arrange a second-person review.

## Joiners, role changes, and departures

Before activation, confirm the request through an authoritative personnel or sponsor record. Assign a unique identity, the approved role, a manager or sponsor, and an expiry for temporary access. Enroll the required authenticators using a verified delivery and identity-checking process. Record an access test without retaining passwords or recovery codes in the ticket.

For a role change, compare existing access with the new role. Remove access that is no longer needed and record any approved overlap with an expiry. Adding the new role is only part of the change.

For a departure, schedule revocation for the authorized departure time and coordinate urgent cases with the personnel and security owners. Check the identity provider, direct application accounts, active sessions, delegated access, service ownership, authenticators, remote access, and shared secrets the person could access. Preserve required records and apply holds before deleting data. Confirm revocation in each relevant system; closing a ticket is not evidence of removal.

## Authentication

Use centrally managed sign-in where supported, require MFA, and prefer phishing-resistant methods. Provide a recovery method that does not depend solely on the lost device or unavailable account. Review exceptions with an owner, expiry, and compensating controls.

Where passwords remain necessary, this example adopts a 15-character minimum, support for long passphrases, screening against common or compromised values, and password-manager use. Do not impose routine expiry or character-mixture rules; require a change when compromise is suspected or confirmed. These choices draw on [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html). Confirm that the actual platform can enforce the selected standard and document gaps.

Set session and reauthentication controls according to application sensitivity, device trust, and supported features. Keep actual configurations in a restricted implementation standard.

## Authorization and privileged access

Grant the minimum rights needed for the approved purpose. Review both direct and inherited access, including external guests, shared links, delegated permissions, and application permissions.

Use separate administrative identities for privileged work. Prefer time-bounded elevation with recorded approval and audit events. Keep emergency access available through a tested procedure, restrict its use, alert on use, and review it afterward. Do not assume an emergency account can bypass an outage of the platform that must authenticate it.

## Service identities and integrations

Every service identity needs a business owner, technical owner, purpose, permissions inventory, environment, and retirement condition. Prefer supported workload identity or short-lived credentials over a shared human account. Store necessary secrets in the approved secrets manager and define rotation and revocation according to exposure, platform capability, and risk.

Record downstream access separately from sign-in. Disabling one identity may not revoke every application's existing sessions, tokens, or independently managed account.

## Access reviews

In this fictional program, system owners review privileged, third-party, and service access quarterly, and all access annually. Departures, incidents, and material role changes trigger additional reviews.

Each review records the population examined, evidence date, reviewer, retain/remove decision, implementation result, and unresolved exceptions. A nonresponse is an unresolved decision. Escalate it; do not silently certify access.

## Adoption check

Walk through one joiner, one role change, one departure, one service identity, and one emergency-access exercise. Confirm that another operator can find the approval and verify the final state. Keep the evidence and actual account details in the protected internal system.

Related: [data handling](data-classification-and-handling.md), [lost device response](../procedures/lost-device-response.md), [adaptation guide](../ADAPTATION.md).
