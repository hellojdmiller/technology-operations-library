<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Research behind Ransomware: What Everyone Can Do

Research reviewed: 2026-09-21. The lessons, fictional packet, hints, answer keys, and timing are original proposals. No learner trial has been performed for this course.

## S1

**[#StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)**

Publisher: CISA, with MS-ISAC, NSA, and FBI

Published or updated: 2023-09 (month only)

Reviewed: 2026-09-21

**Supports:** Names the common initial access routes: internet-facing vulnerabilities and misconfigurations, compromised credentials, phishing, precursor malware, social engineering, and third parties. Recommends offline, encrypted backups tested regularly. For response: isolate affected systems, take the network offline at the switch level if several systems are hit, power down only if disconnecting is not possible, use out-of-band communication, and notify CISA, the FBI, and management.

**Our application:** The arrival routes, the disconnect-first rule, the leave-it-on rule, and the tested-backups line draw on it. D3 mirrors its order.

**Limits:** Written for organizations and their responders, not the individual at a desk; it does not say who inside a firm should be told first. On payment it only advises consulting law enforcement about possible decryptors.

**Revisit when:** When CISA issues a new edition of the guide or changes the response order.

## S2

**[I've Been Hit By Ransomware!](https://www.cisa.gov/stopransomware/ive-been-hit-ransomware)**

Publisher: CISA (#StopRansomware)

Published or updated: 2023-05 (month only)

Reviewed: 2026-09-21

**Supports:** A response checklist: isolate affected systems first; physically disconnect from Ethernet and Wi-Fi if the network cannot be taken offline; power down only as a last resort because it destroys volatile evidence; disable remote access during containment; report to CISA, the local FBI field office, IC3, or the Secret Service.

**Our application:** Supports the worked example and the check: disconnect, leave on, call. D3's 'unless the technology lead tells you to' reflects its last-resort framing of powering down.

**Limits:** A responder's checklist that assumes a plan and technical staff. It does not address a colleague's instinct to restart or the pressure of a ransom deadline.

**Revisit when:** When the page's checklist order or reporting contacts change.

## S3

**[Mitigating malware and ransomware attacks](https://www.ncsc.gov.uk/guidance/mitigating-malware-and-ransomware-attacks)**

Publisher: UK National Cyber Security Centre (NCSC)

Published or updated: Published 2020-02-13; version 3.0 updated 2021-09-09

Reviewed: 2026-09-21

**Supports:** Lists entry routes including malicious attachments, compromised websites, exposed remote services such as RDP, and phishing. Calls up-to-date backups the most effective way to recover, kept separate from the network and regularly tested. States that law enforcement do not encourage, endorse, or condone paying, that payment gives no guarantee, and that the computer stays infected.

**Our application:** The arrival paragraph, the tested-backups line, and the 'paying is a leadership decision' paragraph lean on it.

**Limits:** Last updated in 2021. It points to separate NCSC guidance for the response itself rather than giving step-by-step actions, and its reporting routes are UK-specific.

**Revisit when:** When NCSC publishes a new version or merges it with its response guidance.

## S4

**[Ransomware](https://www.ic3.gov/CrimeInfo/Ransomware)**

Publisher: FBI Internet Crime Complaint Center (IC3)

Published or updated: undated

Reviewed: 2026-09-21

**Supports:** Ransomware can arrive by opening an email attachment, clicking an ad, following a link, or visiting an infected website. 'The FBI does not support paying a ransom': payment does not guarantee data back and encourages more attacks. Recommends reporting to IC3 with details of the variant, file extensions, and demand, and keeping backups stored separately from the network.

**Our application:** Supports the paragraph on paying and the arrival examples. Reporting to IC3 is an action for the partners and technology lead, not the reader.

**Limits:** Aimed at the US public and undated. It gives no step-by-step response for a person at a desk.

**Revisit when:** If the FBI's stated position on payment or the reporting route changes.

## S5

**[Ransomware Risk Management: A Cybersecurity Framework 2.0 Community Profile (NIST IR 8374 Rev. 1)](https://csrc.nist.gov/pubs/ir/8374/r1/final)**

Publisher: National Institute of Standards and Technology (NIST)

Published or updated: 2026-06 (month only); supersedes the February 2022 edition

Reviewed: 2026-09-21

**Supports:** Defines ransomware as an attack that encrypts data and demands payment to restore access, noting attackers may also steal data and demand a further payment not to disclose it. Maps Cybersecurity Framework 2.0 outcomes across govern, identify, protect, detect, respond, and recover so an organization can gauge its readiness.

**Our application:** Supports placing ransomware readiness, including any payment decision, at the governance level rather than with the person who first notices.

**Limits:** Only the abstract page was reviewed, not the full profile. It is a planning framework and gives no individual response steps.

**Revisit when:** If NIST revises the profile again or the Cybersecurity Framework changes.

[Back to the course](README.md)
