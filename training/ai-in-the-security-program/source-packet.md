<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Eight things the technology lead wants the assistant to do

You are advising Halvorsen Bay Advisors, a fictional investment firm of about twenty people, on how its technology lead may use the firm's approved AI assistant for security work. Everyone and everything in this packet is fictional: the firm, the people, the vendors, the domain, and the alert. The exercise reference date is 21 September 2026. D1 is the lead's proposal, and several items in it are deliberately unsafe. D2 is a realiztic alert that says nothing about the user's whereabouts. D3 is the policy you judge D1 against.

## D1: Proposal: eight uses for the assistant

Date: 2026-09-17 · Note from Ines Marchetti, technology lead, to Owen Adeyemi, compliance

Owen, before I start using the assistant for security work, here is everything I want to do with it. Tell me which items need a conversation first.

1. Each morning, paste the overnight identity-provider alerts and have it summarize them and tell me which ones I can ignore.

2. Draft an access-control policy from the NIST small business guide, so we have something to show investors that is better than our current page.

3. Turn the 60-question security questionnaire from Wrenfield Fund Services into a checklist with an owner and a due date per item.

4. Explain firewall and audit log lines I do not recognize, by pasting the line and asking what it means.

5. When staff forward a suspicious email, paste it in, ask whether it is phishing, and send the staff member the answer.

6. Paste the timeline and evidence from last month's incident into it to draft the post-incident report while counsel is still reviewing the matter.

7. Let it work the access-request queue: read each ticket and approve or deny based on the requester's role.

8. Paste our firewall configuration, including the management API keys, and ask for hardening recommendations.

## D2: Identity-provider alert to be summarized

Date: 2026-09-18 · Plain-text alert email from the firm's identity provider admin console, as received

ALERT: Risky sign-in detected. Severity: medium. Detected: 2026-09-18 03:12 UTC.

User: r.castellanos@halvorsenbay.example.com (Rafael Castellanos, Associate). Application: email and files.

Signal: sign-in from unfamiliar location. Location: Lisbon, Portugal. IP: 203.0.113.42. Previous sign-in: 2026-09-17 17:40 UTC from the office network.

Device: unmanaged. Browser: Chrome on Windows. MFA: satisfied by SMS code. Conditional access result: allowed, not blocked.

Recommended actions: review the sign-in, confirm with the user, consider requiring a password reset and revoking active sessions.

## D3: AI use policy, section 3: security data and decisions

Date: 2026-03-02 · Excerpt from the firm's AI use policy (fictional)

3.1 Approved tool. Internal data may be entered only into the firm's enterprise assistant, which is covered by the data processing agreement signed 2 March 2026. No other assistant may receive internal data.

3.2 Never entered into any tool: passwords, keys, tokens, and other credentials; logs or exports that carry client, investor, or employee identifiers, unless redacted; material under legal hold or under review by counsel, without counsel's written agreement.

3.3 Decisions. An assistant may summarize, draft, explain, and propose. The decision to grant or change access, to close an alert or incident, or to notify anyone is made and recorded by a named person.

3.4 Verification. Any statement an assistant makes about the firm's systems, users, or devices is checked against the system before it is relied on or repeated.

3.5 Agents. No assistant may be connected to tools that act on firm systems without approval from the technology lead and compliance, a tested way to stop it, and logs kept where it cannot alter them.

[Back to the course](README.md)
