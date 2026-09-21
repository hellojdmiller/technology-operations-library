<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Phishing and Social Engineering: facilitator guide

A colleague can run this course as one session of about 60–85 minutes, or as 3 short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.

## Before the session

- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).
- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.
- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.

## Ground rules

- Try the task before opening the example answer. The example is a comparison, not a mark scheme.
- Explaining a choice matters more than matching the wording.
- A first attempt with honest gaps is more useful than a polished copy of the example.

## Lesson 1: Spot the pressure (15–20 minutes)

**Outcome:** Mark up two messages with their specific signals and say what each wants the reader to do.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which signal in D2 would still worry you if the text had come from Priya's real number, and why?

**Changed case:** D1 arrives again a week later, word for word, but now from dana.whitfield@harbourline.example.com, our real domain. What changes?

<details>
<summary>Changed-case answer</summary>

The address check passes; nothing else does. The link still resolves to docs-view.example.net, the ask is still my password, and the expiry pressure is unchanged. A real account can be compromised, so I mark it suspicious, report it under D4, and ask Dana in person.

</details>

**Check:** Which reading of D2 is best supported by the packet? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Knowing a deal and a colleague's name is not identity; D2 offers nothing verifiable. The unknown number, secrecy, deadline, and new account are all present, and D4 says a text never authorises a payment.

**C:** Replying tells the sender the number is live and opens the channel for the account details; the payment ask is already in the message. D4 says never reply.

</details>

## Lesson 2: Verify out of band (15–20 minutes)

**Outcome:** Write a verification plan for one message that a colleague could follow unaided.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Why does reporting come before verifying, when verifying might show the message was genuine after all?

**Changed case:** A calendar invite titled 'Q3 investor call' arrives from an organiser you do not recognise, with a join link and a note that attendance is mandatory. Your plan?

<details>
<summary>Changed-case answer</summary>

Do not accept, decline, or click join: accepting and declining both reply, and the link is the ask. Report it by the D4 route. Ask whoever normally arranges investor calls, in person or by extension. Leave the invite for the technology team to remove.

</details>

**Check:** Sam wants to check D1 quickly. Which action fits D4? The supported choice is **C**.

<details>
<summary>Why the other options fall short</summary>

**A:** Clicking is the ask, and a page can capture a session or run code without a password. The link's registered domain is docs-view.example.net, not the firm's; D4 says never click.

**B:** The reply goes to share@harbourline-docs.example.net, a lookalike domain, and tells the sender the address is live. D4 says never reply; the question belongs to Priya at her desk.

</details>

## Lesson 3: After the click (15–20 minutes)

**Outcome:** Write a short incident note the technology team could act on without seeing your screen.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which single detail in your note most changes what the technology team does first, and why?

**Changed case:** Same events, but at 22:30 on a Friday, on your personal phone over home Wi-Fi, and nobody answers extension 220. What changes?

<details>
<summary>Changed-case answer</summary>

Report tonight: email techhelp@harbourline.example.com and call the Technology on-call number in the directory. Keep the phone on and the message intact. If nobody responds within 30 minutes, D4 allows one exception: change the password from a different trusted device, not the phone, and say what you did.

</details>

**Check:** Sam has entered his password on the D1 page. Which first step fits D4? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Deleting removes the sender, link, and headers the team needs, and the account is at risk now, not Monday. D4 says do not delete and report immediately.

**C:** Changing the password on the same machine may hand the new one over, and powering off destroys what the team can inspect. D4 says shut down nothing and wait for the device instruction.

</details>

## After the session

- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.
- Record attendance and the date in your own training record, not in this repository.
- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.

[Back to the course](README.md)
