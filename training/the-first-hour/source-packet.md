<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# A Monday morning at Tarrow Lane Partners

You are helping the team at Tarrow Lane Partners, a fictional 28-person investment advisory firm, through the first hour after a phished password. Everyone and everything in this packet is fictional: the firm, its people, the bank, the insurer, the law firm, and the provider. The exercise reference date is Monday 21 September 2026; times are the firm's local time. The people: Dana Okafor, Director of Technology (the firm has no Chief Technology Officer); Marcus Ellery, Chief Operating Officer; Ingrid Solano, Managing Partner; Theo Baptiste, office manager, who answers the main line and the help channel; Rowan Whitlock, associate, traveling today. D1 is a system alert and D2 a colleague's message. D3 is the firm's current plan and is deliberately incomplete; you will mark its gaps in Lesson 1. D4 is a blank template. Nothing in this exercise is sent, reset, or disabled; you draft the decisions.

## D1: Identity provider alert: unusual sign-in followed by new inbox rule

Date: 2026-09-21 · Automated alert, plain text, as received in the technology mailbox

Subject: [Alert, medium] Unusual sign-in followed by new inbox rule for rowan.whitlock@tarrowlane.example.com. Detected 2026-09-21 07:42 firm local time. Status: no automatic action taken. The user's session remains active.

Event 1, 07:31: successful sign-in to the account from a location and device not seen for this user in the previous 30 days. The multi-factor prompt was approved from the user's registered app 40 seconds after the password was accepted.

Event 2, 07:38: new inbox rule created through web mail. Rule name: '.' (a single period). Condition: all incoming messages. Actions: mark as read, move to the folder 'RSS Subscriptions', forward a copy to archive.sync.4471@mail.example.net.

Event 3, 07:40: three mailbox searches from the same session for the terms 'wire', 'invoice', and 'capital call'.

Recommended actions: review the sign-in with the user through a channel other than this mailbox; consider revoking active sessions; review inbox rules and forwarding settings. This alert was generated automatically.

## D2: Message from Rowan Whitlock to the help channel

Date: 2026-09-21 · Chat message, 08:05, read by Theo Baptiste

Theo, weird thing this morning and I want to flag it before I board. Around 07:25 I got an email saying my mailbox was almost full and I had to sign in to keep receiving messages. The link opened a page that looked exactly like our sign-in, same logo and everything.

I typed my password, got the phone prompt, approved it, and then the page just went blank. I deleted the email straight after because it looked like spam once I thought about it. Nothing else seemed off, mail is still coming in.

I am at the gate now, flight lands 14:10 and I will be on hotel wifi tonight. Should I change my password when I land? I have the 15:00 call with the Quarry Street Bank team about the capital call wire, so I need my mail working for that.

The page address was something like tarrowlane-signin.example.net, I think. Sorry if this is nothing.

## D3: Excerpt from the firm's cyber incident response plan, version 1.2

Date: 2025-03-10 · Policy excerpt: sections 2 to 6 and Appendix B, as currently approved

2. Roles. The Incident Response Committee comprises the Chief Technology Officer, the Chief Operating Officer, the General Counsel (external), and a Managing Partner. The Committee will convene within four hours of a suspected incident being reported and will determine the response.

3. Reporting. Staff should report suspected incidents to the IT function or to their manager as soon as possible. The IT function will assess the report and inform the Committee where appropriate.

4. Containment. The IT function will take steps to contain the incident as soon as practical, having regard to the impact on business operations. Significant actions, including the shutdown of any system used by clients, require Committee approval.

5. Communication. The Committee will determine what is communicated, to whom, and when. Staff must not discuss incidents outside the firm.

6. Review. This plan is reviewed annually by the Chief Technology Officer.

Appendix B, contacts. Cyber insurer: Orrery Insurance Group, policy TL-CY-4471, claims line (number held in the finance vault). Outside counsel: Corwin Larkin LLP, main switchboard. Bank: Quarry Street Bank, relationship manager (see finance contacts). Managed IT provider: Bluefold Managed Services, 24-hour line (fictional). Appendix last updated 2023-11-02.

## D4: Incident timeline and decision record

Date: 2026-01-15 · Blank template with field definitions, kept in the shared incident folder

Header: incident reference; incident lead; scribe; status (alert, incident, or closed); declared as an incident by whom, at what time, and under which criterion.

Timeline rows. Each row records: time with time zone; what was observed or done; source (alert, person, log, screenshot); who recorded it; and whether the entry is a fact, an assumption, or a decision. Facts come from a log or a screenshot. Everything else is an assumption until it does.

Decision rows also record: the decision; the owner; the authority used (a plan section or a named person); what it pauses or changes (accounts, sessions, devices, automations, data); and how we will know it worked.

Evidence log: item; where it is kept; who captured it; when; and whether the original still exists.

Communication log: recipient; time; channel; who spoke; the first sentence they heard; what they were asked to do; when the next update is due.

Open questions: what we do not know yet; who is finding out; by when.

[Back to the course](README.md)
