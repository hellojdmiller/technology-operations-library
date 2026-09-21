<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Working Securely Anywhere

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[Keeping devices and software up to date](https://www.ncsc.gov.uk/collection/device-security-guidance/managing-deployed-devices/keeping-devices-and-software-up-to-date)**

Publisher: UK National Cyber Security Centre (NCSC), Device Security Guidance

Published or updated: Published 2021-06-29; reviewed 2025-05-13 (version 2.1)

Reviewed: 2026-09-21

**Supports:** Patches fix known flaws that attackers use to compromise devices. Install updates promptly when notified, ideally within a few days, and turn on automatic updates for all software where possible. Where staff use their own devices, restrict access to corporate data from devices that are not kept current, since the organization may not be able to force updates. Replace out-of-support devices as soon as you are able.

**Our application:** Lesson 1 sets D1's seven-day rule against this guidance and uses the personal-device point to explain why an unpatched personal laptop that reads firm mail is the firm's problem, not only the owner's.

**Limits:** Guidance for organizations managing devices, not a measurement of how quickly attacks follow a patch. 'Within a few days' is advice rather than a legal or contractual standard; D1's seven days is the fictional firm's own choice.

**Revisit when:** Recheck when the NCSC issues a new version of the Device Security Guidance or when the firm changes its update window.

## S2

**[Protect data on your Mac with FileVault](https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac)**

Publisher: Apple, macOS User Guide

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** FileVault encrypts the startup disk so that no one can decrypt or access the data without the login password. On Macs with Apple silicon or the T2 chip the data is encrypted automatically; on older models FileVault must be turned on. Setup needs an administrator account and either an iCloud account or a recovery key kept away from the Mac. Forgetting both the password and the recovery key means the files are lost.

**Our application:** Lessons 1 and 2 use FileVault as the reason a lost, locked MacBook is a lost asset rather than a data breach, and the self-check asks whether it is confirmed on rather than assumed.

**Limits:** Product documentation for one platform. It does not cover phones or Windows, does not address a Mac left unlocked, and says nothing about how quickly a thief could act on an unencrypted disk.

**Revisit when:** Recheck when Apple revises the guide for a new macOS version.

## S3

**[Device Encryption in Windows](https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df)**

Publisher: Microsoft Support

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** Device Encryption enables BitLocker encryption automatically for the operating system drive and fixed drives. It turns on, with a recovery key attached to the account, when a device is set up with a Microsoft account or a work or school account; with a local account it is not turned on automatically. Status is checked under Settings, Privacy and security, Device encryption. It may be unavailable without a TPM, Secure Boot, or a configured recovery environment.

**Our application:** Lesson 1's self-check and changed case turn on the local-account detail: a personal Windows laptop can be unencrypted even though the feature exists, so the learner checks rather than assumes.

**Limits:** Windows-only product documentation. Availability depends on hardware, and BitLocker Drive Encryption on Pro, Enterprise, or Education editions has management options this course does not cover.

**Revisit when:** Recheck when Microsoft changes Device Encryption defaults or the settings path.

## S4

**[Are Public Wi-Fi Networks Safe? What You Need To Know](https://consumer.ftc.gov/articles/are-public-wi-fi-networks-safe-what-you-need-know)**

Publisher: US Federal Trade Commission, Consumer Advice

Published or updated: 2023-02 (month only)

Reviewed: 2026-09-21

**Supports:** Most websites now use encryption, so connecting through a public Wi-Fi network is usually safe; look for a lock symbol or https in the address bar. Scammers also build encrypted fake sites, so encryption in transit does not protect you from the site's operator. General advice on strong passwords, two-factor authentication, and recognising phishing.

**Our application:** Lesson 2 uses this to move the worry away from the network itself and toward the sign-in portal, lookalike network names, and shoulder surfing.

**Limits:** Consumer guidance. It does not discuss VPNs, phone hotspots, captive portals, or lookalike network names; those points in the lesson are the author's operating practice, not FTC claims.

**Revisit when:** Recheck if the FTC revises the article or if browsers change how they signal an encrypted connection.

## S5

**[Bring your own device (BYOD)](https://www.ncsc.gov.uk/collection/device-security-guidance/bring-your-own-device)**

Publisher: UK National Cyber Security Centre (NCSC), Device Security Guidance

Published or updated: Reviewed 2025-05-13 (version 2.1); no separate published date shown

Reviewed: 2026-09-21

**Supports:** The security challenges of BYOD should not be played down. The organization owns the corporate data on a personal device but cannot fully control the device; protection depends on how much management the owner allows. Overly restrictive controls can lead staff to find other ways to do their job using shadow IT, which is likely to increase risk. Start by determining objectives and risk appetite.

**Our application:** Lesson 3 uses the ownership-without-control point to explain why an unapproved notes app matters, and the shadow IT warning to insist that a refusal comes with an alternative and a request route.

**Limits:** Guidance for organizations designing a BYOD approach, not a rule about any particular app. It does not evaluate note-taking tools, set retention requirements, or define what counts as client information.

**Revisit when:** Recheck when the NCSC updates the Device Security Guidance or the firm changes what personal devices may carry.

[Back to the course](README.md)
