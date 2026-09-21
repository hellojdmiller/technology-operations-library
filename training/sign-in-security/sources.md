<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Passwords, Passkeys, and MFA

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[NIST SP 800-63B: Digital Identity Guidelines, Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html)**

Publisher: National Institute of Standards and Technology

Published or updated: 2025-08-26 (publication date shown on the page for SP 800-63-4)

Reviewed: 2026-09-21

**Supports:** Verifiers shall not require periodic password changes but shall force a change when there is evidence of compromise; shall compare new passwords against a blocklist of known compromised passwords; shall not impose composition rules; single-factor passwords need at least 15 characters. Out-of-band delivery over the telephone network is a restricted authenticator. Manually entered one-time codes are not considered phishing-resistant.

**Our application:** Lesson 1 uses the evidence-of-compromise rule and the end of forced rotation. Lesson 2 uses the restricted status of text-message delivery and the rule that typed codes are not phishing-resistant.

**Limits:** Written for organisations that run sign-in systems, not for individual staff. It does not tell a person which factor to pick for a given account and does not measure how often reuse leads to takeover.

**Revisit when:** When NIST publishes a new revision, or changes the restricted status of telephone-based delivery, which the document says it may do as the threat landscape evolves.

## S2

**[Implementing Phishing-Resistant MFA (fact sheet)](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf)**

Publisher: Cybersecurity and Infrastructure Security Agency (CISA)

Published or updated: October 2022 (month only, as printed on the fact sheet)

Reviewed: 2026-09-21

**Supports:** Table 1 ranks MFA forms strongest to weakest: FIDO/WebAuthn and PKI-based (phishing-resistant); app-based one-time codes and push with number matching; push without number matching (vulnerable to push bombing); SMS or voice (vulnerable to phishing, SS7, and SIM swap, and to be used only as a last resort). Defines push bombing and SIM swap, and says app codes or number-matched push are the best options for small and medium businesses that cannot yet deploy phishing-resistant MFA.

**Our application:** Lesson 2 turns Table 1 into a plain-words ladder and uses the push bombing description. Lesson 3 uses its SIM swap definition alongside the FBI announcement.

**Limits:** Dated October 2022, before passkeys were widely offered by consumer services, and addressed to IT leaders rather than staff. It gives no incident rates and does not say how long a migration takes.

**Revisit when:** If CISA replaces the fact sheet or issues newer MFA guidance. Confirm the PDF still resolves: on review the resource landing page returned a 404 while the PDF itself remained available, and CISA's older MFA web pages carried an archived-content banner.

## S3

**[Passkeys: Passwordless Authentication](https://fidoalliance.org/passkeys/)**

Publisher: FIDO Alliance

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** A passkey is an authentication credential based on FIDO standards, stored on a phone, computer, or hardware security key, and used with the same unlock as the device (biometric, PIN, or pattern). Synced passkeys move between a user's devices through a cloud service; device-bound passkeys never leave one device. Passkeys use public key cryptography, are described as always strong and phishing-resistant, and are built on the FIDO2 specifications (WebAuthn and CTAP).

**Our application:** Lesson 2 uses it for what a passkey is, how it is unlocked, the synced versus security-key distinction, and why it will not answer a site it was not registered with.

**Limits:** Published by the industry body that promotes the standard, so it describes benefits rather than trade-offs. It does not cover recovery when every device holding a passkey is lost, and availability depends on each service.

**Revisit when:** When the page changes, or when a service the firm relies on adds or removes passkey support.

## S4

**[How number matching works in MFA push notifications for Authenticator](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match)**

Publisher: Microsoft Learn (Microsoft Entra ID documentation)

Published or updated: 2025-11-06 (article date shown on the page)

Reviewed: 2026-09-21

**Supports:** Number matching is enabled for all Authenticator push notifications: the user sees a number on the sign-in screen and must enter it in the app to approve. Users cannot opt out. When the sign-in starts on the same device that runs Authenticator, Microsoft mobile apps may show a Yes/No prompt instead, because the prompt only appears on the device that initiated the sign-in.

**Our application:** Lesson 2 uses it to explain why an unexpected prompt cannot be approved without the number shown on the sign-in screen, which is why the D4 impersonator had to talk Priya into approving rather than simply sending more prompts.

**Limits:** Describes one vendor's product. Other authenticator apps behave differently, and number matching does not protect against a fake sign-in page that relays the number to the victim.

**Revisit when:** When Microsoft changes the article or Authenticator's behaviour. The page carried an article date of November 2025 on review.

## S5

**[Criminals Increasing SIM Swap Schemes to Steal Millions of Dollars from US Public](https://www.ic3.gov/PSA/2022/PSA220208)**

Publisher: FBI Internet Crime Complaint Center (IC3), public service announcement

Published or updated: 2022-02-08

Reviewed: 2026-09-21

**Supports:** Criminals take over a phone number by impersonating the victim to the carrier, bribing carrier staff, or phishing staff. They then receive SMS-based two-factor codes, reset passwords, and take over accounts. Advice includes unique passwords for online accounts, never giving account details over the phone, watching for loss of SMS connectivity, and using stronger MFA such as biometrics, physical security tokens, or standalone authentication apps.

**Our application:** Lesson 3 uses the SIM swap pattern and the no-service warning sign. Lesson 1 cites its unique-password advice.

**Limits:** A 2022 US public announcement with loss figures for 2021. It does not describe carrier protections added since, and its advice is aimed at consumers rather than firms.

**Revisit when:** If the FBI or FCC publishes newer SIM swap guidance, or if the firm's mobile carrier changes its port-out protections.

[Back to the course](README.md)
