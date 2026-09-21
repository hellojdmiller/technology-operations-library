<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind The First Hour

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF 2.0 Community Profile (NIST SP 800-61 Rev. 3)](https://csrc.nist.gov/pubs/sp/800/61/r3/final)**

Publisher: National Institute of Standards and Technology

Published or updated: 2025-04 (month only; the CSRC page and the PDF cover both say April 2025)

Reviewed: 2026-09-21

**Supports:** Organizes incident response around CSF 2.0. Policy should set roles, responsibilities, and authorities, including who may disconnect or shut down assets (Section 2.3). Incidents are declared against defined criteria (DE.AE-08). Response strategy balances quick recovery against observing the attacker (RS.MA-03). Records and evidence are preserved (RS.AN-06, RS.AN-07). Notification follows procedures for what is reported to whom and when, with regulators and law enforcement per plan criteria (RS.CO-02). Restoration assets are verified before use, and an after-action report closes recovery (RC.RP-03, RC.RP-06).

**Our application:** Lesson 1 takes roles, authorities, and the observation trade-off from it; Lesson 2 the declaration criteria and evidence handling; Lesson 3 the notification categories, status cadence, verified recovery, and after-action note.

**Limits:** A profile of outcomes and considerations, not a procedure. It sets no time limits, names no observation window length, and does not say who a small firm's pause authority should be; those are this course's proposals. Written for organizations of any size, so small-firm specifics are inferred.

**Revisit when:** When NIST revises SP 800-61 or CSF 2.0, or the SP 800-61 project page adds small-organization guidance.

## S2

**[Cybersecurity Incident & Vulnerability Response Playbooks](https://www.cisa.gov/resources-tools/resources/federal-government-cybersecurity-incident-and-vulnerability-response-playbooks)**

Publisher: Cybersecurity and Infrastructure Security Agency (CISA)

Published or updated: undated on the page; the PDF cover says Publication: November 2021, and the file is hosted at a 2024-08 path

Reviewed: 2026-09-21

**Supports:** The incident response playbook covers preparation, detection and analysis, containment, eradication and recovery, post-incident activity, and coordination. Preparation includes designating a coordination lead and out-of-band channels. The checklist says to log how, when, and by whom each item of evidence was acquired and to keep a timeline with time zones. Containment weighs service impact, duration, and evidence; recovery resets passwords on compromised accounts; the hotwash reviews roles, responsibilities, and authority.

**Our application:** Lesson 2 uses the evidence-log fields, the timeline habit, and the containment trade-offs; D4's fields mirror the checklist's timeline and evidence rows.

**Limits:** Written for US federal civilian agencies, with reporting duties to CISA that do not apply to a private firm; CISA says only that future iterations may be useful outside government. Its phases follow the older SP 800-61 Rev. 2 model that Rev. 3 has since reorganized.

**Revisit when:** When CISA issues a revised edition or a version aimed at non-federal organizations.

## S3

**[Small Business Guide: Response & Recovery](https://www.ncsc.gov.uk/collection/small-business-guidance--response-and-recovery)**

Publisher: UK National Cyber Security Centre (NCSC)

Published or updated: Published 12 June 2019, reviewed 8 October 2020 (page); the PDF says information correct at October 2020, with references to Action Fraud removed April 2026

Reviewed: 2026-09-21

**Supports:** Five steps: prepare, identify, resolve, report, learn. Prepare: assign roles, document who owns each responsibility and how to contact them, document trigger points where a decision transfers between people (who decides to shut down the website, when senior management is involved), keep a contact list of partners including bank and insurer, check contact details every couple of months, and exercise. Identify: ten questions starting with what was reported and by whom. Report: legal obligations, law enforcement, keep staff and customers informed proportionately, consider legal advice. Learn: review actions taken and update the plan.

**Our application:** Lesson 1 builds the one-page skeleton on its prepare step; Lesson 2 opens with its identification questions; Lesson 3 uses its report and learn steps.

**Limits:** UK-specific reporting routes (the ICO, police) do not transfer. The guide predates SP 800-61 Rev. 3 and is aimed at very small organizations, so it says little about identity-provider alerts or session revocation.

**Revisit when:** When NCSC re-reviews the guide or replaces the Small Business Guide collection.

## S4

**[Data Breach Response: A Guide for Business](https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business)**

Publisher: US Federal Trade Commission

Published or updated: August 2023 (as stated on the page)

Reviewed: 2026-09-21

**Supports:** Secure operations: mobilize a response team, take affected equipment offline without powering it down before forensics arrive, do not destroy forensic evidence, and change stolen credentials because the system stays vulnerable until you do. Communications: do not make misleading statements or withhold what people need to protect themselves. Notify law enforcement, affected businesses, and individuals; US states require notification for breaches of personal information.

**Our application:** Lesson 2 uses the evidence and credential points; Lesson 3 uses the communication guidance and the general shape of notification duties.

**Limits:** US consumer-protection guidance about personal data breaches. It does not cover mailbox compromise specifically, and its notification rules are US state law, not a universal duty; the course states regulatory obligations generally and leaves specifics to counsel.

**Revisit when:** When the FTC updates the guide or when the firm's jurisdictions change their notification laws.

[Back to the course](README.md)
