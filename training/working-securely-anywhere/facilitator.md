<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Working Securely Anywhere: facilitator guide

A colleague can run this course as one session of about 60–85 minutes, or as 3 short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.

## Before the session

- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).
- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.
- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.

## Ground rules

- Try the task before opening the example answer. The example is a comparison, not a mark scheme.
- Explaining a choice matters more than matching the wording.
- A first attempt with honest gaps is more useful than a polished copy of the example.

## Lesson 1: Keep the device trustworthy (15–20 minutes)

**Outcome:** Complete a five-point self-check for one described device and name what must change first.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which point was hardest to verify on a real device, and what would the technology team need to give you?

**Changed case:** Same laptop, but now firm-managed and enrollled, with the local account replaced by a work account. Which lines change?

<details>
<summary>Changed-case answer</summary>

Encryption very likely passes: a work account turns Device Encryption on and attaches the recovery key to it, though I would still confirm in Settings. Management passes, so client files are allowed. The missed updates and four-digit PIN still fail until fixed. [S3]

</details>

**Check:** A colleague's personal laptop, two months behind on updates, only opens firm mail in a browser. Under D1, what is the right reading? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Mail is firm information and D1 covers any device that opens it. Two months is far past seven days, and the NCSC advises keeping corporate data off devices that are not current. [S1]

**C:** D1 asks for updates within seven days, or removal from firm information if unsupported; it never asks for a wipe or a purchase. Install the updates, then re-check the other four points.

</details>

## Lesson 2: Work away from the office (15–20 minutes)

**Outcome:** Write a travel plan for one trip and a lost-device message that puts the report first.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** In D2, what makes waiting feel reasonable to Ines, and which sentence in D1 answers it?

**Changed case:** Same trip, but the firm has issued a VPN and says to use it on any network. What changes, and what stays?

<details>
<summary>Changed-case answer</summary>

The VPN goes on before mail or files open, on either network. The rest stays: join only Corrigan_Guest, give the portal only room and name, refuse the email-password page. A VPN protects the connection, not a password typed into a fake portal or a screen read over your shoulder.

</details>

**Check:** Ines has 20 minutes until boarding and the lounge desk is searching. What is the right next step under D1? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** D1 puts the report before anything else. The Hartwell folder and mail were open, and at 8 percent battery a delayed report may not happen for hours; no wipe can start until it does.

**C:** D1 says not to attempt recovery yourself and puts the report first. Chasing the laptop on a dying phone risks the flight and leaves the team unaware; finding a device does not protect its data.

</details>

## Lesson 3: Personal devices and unsanctioned apps (15–20 minutes)

**Outcome:** Write a decision on Marcus's request in D3, with the reason, the alternative, and the proper request route.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which part of your decision would persuade Marcus, and which part only satisfies the standard?

**Changed case:** Marcus comes back: no recording, just typed notes in Notewren on his personal phone, syncing to its cloud. Does your decision change?

<details>
<summary>Changed-case answer</summary>

The recording problem is gone but the core one remains: typed client notes still sync to a vendor cloud under a personal account, outside the firm's retention and deletion. Same answer, warmer tone: use the enrollled notes app now and submit the request for a proper review.

</details>

**Check:** Marcus says the filed summary is all the firm needs, so the Notewren recording does not matter. What is the right reading under D1? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Under D1 a recorded client conversation is firm information wherever it sits. In a vendor's cloud under a personal account the firm cannot retain or delete it; a filed summary does not bring it back.

**C:** D1's request form and five-day answer are the review route; there is no 'approve now, review later'. A complaint would reveal the retention failure after the fact, with three more recordings by then.

</details>

## After the session

- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.
- Record attendance and the date in your own training record, not in this repository.
- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.

[Back to the course](README.md)
