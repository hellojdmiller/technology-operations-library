<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Where AI Helps a Small Security Team: facilitator guide

A colleague can run this course as one session of about 27–40 minutes, or as 1 short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.

## Before the session

- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).
- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.
- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.

## Ground rules

- Try the task before opening the example answer. The example is a comparison, not a mark scheme.
- Explaining a choice matters more than matching the wording.
- A first attempt with honest gaps is more useful than a polished copy of the example.

## Lesson 1: Assistant, not analyst of record (12–15 minutes)

**Outcome:** D1's eight uses sorted into assist, assist then verify, and not the tool's decision, with a verification step for each middle-column item.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Pick one middle-column use. What goes wrong if you skip verification, and who finds out first?

**Changed case:** The firm signs a data agreement with a second vendor whose tool can also disable accounts. Which uses move columns?

<details>
<summary>Changed-case answer</summary>

None move left. The agreement widens what data may enter, so use 4 could take fuller log lines, still redacted. The connector is an agent under D3 3.5: approval, a tested stop, and logs it cannot alter come first; disabling an account stays a person's decision.

</details>

**Check:** The assistant's summary of D2 adds 'consistent with the user's travel'. What do you do with that sentence? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** D2 says nothing about travel; the tool invented it. SMS MFA from an unfamiliar country on an unmanaged device is exactly what the alert flags.

**C:** Another answer from the tool is not verification; it cannot see the calendar or the user, and closing the alert is not its decision under D3.

</details>

## After the session

- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.
- Record attendance and the date in your own training record, not in this repository.
- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.

[Back to the course](README.md)
