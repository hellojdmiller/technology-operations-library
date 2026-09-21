<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Assistant, not analyst of record

Where an assistant helps with security work, and what it never decides.

Suggested time: 12–15 minutes. Work on paper or in a document.

**Outcome:** D1's eight uses sorted into assist, assist then verify, and not the tool's decision, with a verification step for each middle-column item.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

An assistant is good at the reading and writing parts of security work: summarising an alert, drafting a policy from a standard, turning a vendor questionnaire into a checklist, explaining an unfamiliar log line, giving a first opinion on a phishing report.

It is not the decider. Declaring an alert a false positive, closing an incident, or granting access are decisions a person answers for. It can be steered by text inside what it reads and can state error as fact; OWASP lists prompt injection, excessive agency, and misinformation as top-ten risks. [S2](sources.md#s2)

Credentials never enter any tool. Logs with client identifiers, and incident material under counsel's review, enter only a tool covered by a data agreement, redacted, with counsel's say-so. Every claim the tool makes about your environment is checked against the environment; NCSC warns these tools present incorrect statements as facts. [S1](sources.md#s1)

The line moves again when an assistant gets tools that act on systems; CISA's deployment guidance and NIST's AI risk framework cover that step. I wrote about agents working around controls after one incident report: detection has to live where the agent cannot reach. [S3](sources.md#s3), [S4](sources.md#s4), [S5](sources.md#s5)

## Worked example: Summarise the alert, do not close it

**Before**

Assistant: routine sign-in by a travelling user, MFA satisfied. Safe to dismiss.

**After**

Summary: medium-risk sign-in for r.castellanos from an unfamiliar country on an unmanaged device, MFA by SMS, not blocked. Verify: travel calendar, phone the user, device record, sign-in log. Decision: Ines Marchetti.

**Why:** 'Travelling user' was invented; D2 says nothing about travel. 'Safe to dismiss' is a decision D3 reserves for a person.

## Your turn

Read D1 to D3. Sort the eight uses into assist, assist then verify, or not the tool's decision. For each middle-column item name the system or record you would check, and flag anything D3 3.2 forbids.

**Deliverable:** Three columns covering all eight uses, plus data flags.

- [ ] Each middle-column item names a system or record, not 'double-check'.
- [ ] Grant, close, and dismiss decisions stay with a named person (D3 3.3).
- [ ] Credentials, unredacted logs, and counsel-held material are flagged (D3 3.2).

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Ask two questions of each use. Does the output become an action or a verdict? Does the input contain anything D3 3.2 names? The first sets the column, the second the flag.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Assist: use 2, a policy draft from the NIST small business guide, and use 3, the questionnaire turned into a checklist with owners. Neither claims anything about our own systems; a human edit is enough.

Assist then verify: use 1's summary, checked by opening each alert in the identity console before anything is dismissed; use 4, identifiers redacted, checked against the vendor's event documentation; use 5, checked by examining sender domain and links in a sandbox, a person sending the reply.

Not the tool's decision: the 'which to ignore' half of use 1, a verdict under D3 3.3; use 7, approving access; use 6, also barred by 3.2 while counsel holds the material; use 8, since keys never enter any tool (a redacted configuration is a separate request).

</details>

## Explain your choice

Pick one middle-column use. What goes wrong if you skip verification, and who finds out first?

## Try a changed case

The firm signs a data agreement with a second vendor whose tool can also disable accounts. Which uses move columns?

<details>
<summary>Changed-case answer</summary>

None move left. The agreement widens what data may enter, so use 4 could take fuller log lines, still redacted. The connector is an agent under D3 3.5: approval, a tested stop, and logs it cannot alter come first; disabling an account stays a person's decision.

</details>

## Check one decision

The assistant's summary of D2 adds 'consistent with the user's travel'. What do you do with that sentence?

- **A.** Accept it; MFA was satisfied.
- **B.** Delete it, check the travel calendar, and phone Rafael before Ines decides.
- **C.** Ask the assistant to explain itself; if it does, close the alert.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** D2 says nothing about travel; the tool invented it. SMS MFA from an unfamiliar country on an unmanaged device is exactly what the alert flags.

**B:** Supported. A claim about the environment is checked against the environment, and dismiss or escalate stays with the named person under D3 3.3.

**C:** Another answer from the tool is not verification; it cannot see the calendar or the user, and closing the alert is not its decision under D3.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Course overview](README.md) · [Research and limits](sources.md)
