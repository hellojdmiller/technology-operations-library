<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Email Habits That Hold

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[Teach Employees to Avoid Phishing](https://www.cisa.gov/secure-our-world/teach-employees-avoid-phishing)**

Publisher: US Cybersecurity and Infrastructure Security Agency (CISA)

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** Signs include strange requests, urgent language, suspicious links, and messages from known contacts whose accounts are compromised. Advises hovering over a link without clicking to see where it leads, using a known contact method to verify, and making sure employees know to whom and how to report; in its words, 'always report and delete the phishing message'.

**Our application:** Habits one, two, and five, and the worked example's phone call to a known number.

**Limits:** General small-business guidance with no date shown. It does not address inbox rules, forwarding, or personal accounts, and it does not single out unexpected attachments. CISA's older 'Recognize and Report Phishing' page carries an archive notice, so I have not cited it.

**Revisit when:** If CISA revises Secure Our World or dates the page.

## S2

**[Phishing attacks: defending your organisation](https://www.ncsc.gov.uk/guidance/phishing)**

Publisher: UK National Cyber Security Centre

Published or updated: Published 5 February 2018, updated 13 February 2024

Reviewed: 2026-09-21

**Supports:** A four-layer defense: make it hard for messages to arrive, help users identify and report, protect against the effects of undetected messages, respond quickly. Calls for a simple reporting process and a culture where people report without fear of reprimand, and cautions against punitive phishing simulations.

**Our application:** Habit five's 'report, not delete' and the tone of the whole lesson: habits, not blame.

**Limits:** Written for security staff in medium and large organizations; smaller firms are pointed to other NCSC material. It does not describe client buttons or personal-account rules.

**Revisit when:** If the NCSC updates the guidance or replaces the layered model.

## S3

**[How to spot a scam email, text message or call](https://www.ncsc.gov.uk/collection/phishing-scams/spot-scams)**

Publisher: UK National Cyber Security Centre

Published or updated: Published 26 November 2021, last reviewed 5 September 2022

Reviewed: 2026-09-21

**Supports:** Five signs: authority, urgency, emotion, scarcity, and current events. Advises against using the numbers or address in the message and for using details from the official website instead; genuine organizations do not ask for personal information by email.

**Our application:** The 'pressure is not proof' point and the directory-number call in the worked example.

**Limits:** Aimed at individuals and consumer scams; it does not cover workplace reporting tools or mailbox rules.

**Revisit when:** If the NCSC revises the collection.

## S4

**[Report phishing and suspicious emails in Outlook for admins](https://learn.microsoft.com/en-us/defender-office-365/submissions-outlook-report-messages)**

Publisher: Microsoft Learn (Microsoft Defender for Office 365)

Published or updated: Page dated 3 July 2026

Reviewed: 2026-09-21

**Supports:** Users report junk or phishing with the built-in Report button in current Outlook for Windows, Mac, iOS, Android, the new Outlook, and Outlook on the web, when the organization has user reporting turned on. Messages reported as phishing are deleted; reported junk moves to Junk Email and blocks the sender; reports go to a reporting mailbox, to Microsoft, or both.

**Our application:** Habit five: what the button does and why it beats deleting.

**Limits:** Describes Microsoft 365 with Exchange Online mailboxes. Availability depends on admin settings and client version; a firm without the button needs another reporting route, which D3 leaves to IT.

**Revisit when:** If Microsoft changes the Report button's behavior or supported versions.

## S5

**[Manage email messages by using rules in Outlook](https://support.microsoft.com/en-us/office/manage-email-messages-by-using-rules-in-outlook-c24f5dea-9465-4df4-ad17-a50704d66c59)**

Publisher: Microsoft Support

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** Rules live under Settings, Mail, Rules in current Outlook clients. A rule has a name, a condition, and an action; actions include forwarding and redirecting, and rules can be edited, disabled, or deleted from the same list.

**Our application:** Where to look when checking your own rules under habit six, and how Rosa finds the rule in D2.

**Limits:** A how-to page for users; it does not discuss malicious rules or account compromise. Menu names differ between Outlook versions.

**Revisit when:** If Outlook moves or renames the rules settings.

## S6

**[Detect and remediate Outlook rules and custom forms injection attacks](https://learn.microsoft.com/en-us/defender-office-365/detect-and-remediate-outlook-rules-forms-attack)**

Publisher: Microsoft Learn (Microsoft Defender for Office 365)

Published or updated: Page dated 3 July 2026

Reviewed: 2026-09-21

**Supports:** After stealing credentials, an attacker signs in to the mailbox and creates inbox rules as a persistence mechanism; users are unlikely to notice. Investigators should look for rules the user did not create, unexpected rules, or rules with suspicious names, remove them, then reset the password and turn on multifactor authentication.

**Our application:** Habit six and the D2 check: an unfamiliar rule is a sign of takeover, and remediation is IT's job.

**Limits:** Written for administrators and focused on rules that launch applications; simple forwarding rules like Rosa's are a related pattern rather than the one described. It does not set the order of password change versus investigation for users; D3 supplies that.

**Revisit when:** If Microsoft revises the article or Outlook's rule protections change.

## S7

**[Avoid and report phishing emails](https://support.google.com/mail/answer/8253)**

Publisher: Google (Gmail Help)

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** Report phishing from the More menu next to Reply on a computer. Warns about urgent-sounding messages, advises checking that the email address matches the sender name and that the message is authenticated, and hovering over links to see whether the destination matches; do not click links or download files from untrustworthy sources even without a warning.

**Our application:** Habits one, two, three, and five for Gmail users.

**Limits:** Consumer Gmail help. Google Workspace organizations may have different reporting routes and admin settings.

**Revisit when:** If Google changes the reporting menu or the page.

## S8

**[Automatically forward Gmail messages to another account](https://support.google.com/mail/answer/10957)**

Publisher: Google (Gmail Help)

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** Forwarding lives under Settings, Forwarding and POP/IMAP. Adding a forwarding address requires clicking a verification link sent to that address; once on, all new mail except spam is forwarded, and filters can forward only matching messages. Forwarding is turned off from the same tab, and a notice shows in the inbox while it is on.

**Our application:** Habit six for Gmail users: where to check for forwards you did not create, and why the inbox notice matters.

**Limits:** Consumer Gmail help; Workspace admins may restrict forwarding. It does not discuss account compromise.

**Revisit when:** If Google changes the forwarding settings or the page.

[Back to the course](README.md)
