<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Passwords, Passkeys, and MFA: facilitator guide

A colleague can run this course as one session of about 60–85 minutes, or as 3 short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.

## Before the session

- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).
- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.
- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.

## Ground rules

- Try the task before opening the example answer. The example is a comparison, not a mark scheme.
- Explaining a choice matters more than matching the wording.
- A first attempt with honest gaps is more useful than a polished copy of the example.

## Lesson 1: One password per account (15–20 minutes)

**Outcome:** A personal plan for moving three accounts to unique, managed passwords, in order of risk.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which account did you put first, and what does it reach that the other two do not?

**Changed case:** Suppose D1 said the database held names and email addresses only, no passwords. Does Priya's plan change?

<details>
<summary>Changed-case answer</summary>

The order stays; the urgency drops. Priya still replaces the reused password everywhere, because reuse is the fault and she cannot verify the service's claim. She expects targeted phishing now that her name and address are out, still tells Lena, and spreads the changes over a few days.

</details>

**Check:** Priya's Pantry Box password is also her work email password. Which first step fits D1 and D3? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** The leaked password already opens Priya's work mailbox, and D3 3.2 treats a breach notice for a reused password as evidence to change it. Pantry Box has the least reach, so it moves last.

**C:** D1 gives no timeline, and D3 3.2 needs only evidence the password may be known, not proof of cracking. Waiting leaves the mailbox open; D2 shows attempts on Priya's work account by the 18th.

</details>

## Lesson 2: Choose a stronger second factor (15–20 minutes)

**Outcome:** An annotated decision about which factor to use for which account, and what to do with an unexpected prompt.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which account got your strongest factor, and what would the next rung down have cost?

**Changed case:** Tomasz, a systems administrator, uses only the number-matched authenticator app. Under D3, is that enough?

<details>
<summary>Changed-case answer</summary>

No. D3 4.2 requires administrators to use phishing-resistant methods only: a security key or passkey, with a second key as backup. Number matching stops push bombing but not a fake page collecting a code. Tomasz registers a key with the technology team and drops the app once it works.

</details>

**Check:** At 01:58 in D2 a prompt with number 33 arrives after another verified password. What should Priya do? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Every D2 prompt followed a verified password from an unrecognised device in an unfamiliar city. Approving hands that device her session; D3 4.3 forbids it, and one approval is all the attacker needs.

**C:** Number matching stops an accidental tap, but D2 shows the attacker has the password and D4 shows the next move: asking Priya for a code and an approval. D3 4.3 requires a same-day report, and the password must change.

</details>

## Lesson 3: Recover safely (15–20 minutes)

**Outcome:** A short recovery note for one scenario, including who to call and what not to do.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which line of your note would be hardest to follow at 08:45 with D4's clock running?

**Changed case:** The D4 message instead shows Lena's display name, while Lena is on leave. Does your note change?

<details>
<summary>Changed-case answer</summary>

No. D3 6.1 is about the request, not the requester: the team never asks for a code or an approval, so a message that does is not from the team. Display names can be set by anyone. Priya still calls 4400 and tells whoever answers.

</details>

**Check:** D4 says the account locks for 48 hours unless Priya pastes the code now. Which response fits D3? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Knowing about the prompts proves nothing; D2 shows the attacker caused them. D3 6.1 says the team never asks for a code, and D4's sender is an external guest account.

**C:** An ID image can be copied or invented, and replying keeps Priya on the attacker's channel and clock. D3 6.1 gives one method: call the published extension. D4's deadline is the pressure tactic.

</details>

## After the session

- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.
- Record attendance and the date in your own training record, not in this repository.
- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.

[Back to the course](README.md)
