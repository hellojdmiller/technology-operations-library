<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Using AI Without Leaking: facilitator guide

A colleague can run this course as one session of about 60–85 minutes, or as 3 short sessions. No specialist background is required to facilitate; the answer keys are in each lesson.

## Before the session

- Send or print the [fictional packet](source-packet.md) and the [worksheet](worksheet.md).
- Say plainly that everyone and everything in the packet is fictional, and that no real client, investor, employee, or credential data is used or discussed.
- Agree how answers will be shared: spoken, written, or in pairs. Reading and response alternatives are welcome.

## Ground rules

- Try the task before opening the example answer. The example is a comparison, not a mark scheme.
- Explaining a choice matters more than matching the wording.
- A first attempt with honest gaps is more useful than a polished copy of the example.

## Lesson 1: What not to paste (15–20 minutes)

**Outcome:** Rewrite one request so it carries no sensitive data and still gets the job done.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which removed item might your colleague still need, and how do they get it back safely?

**Changed case:** Rowan's email arrives as a photo of a printed letter. Mara wants to paste the image into the assistant to extract the text. Does your answer change?

<details>
<summary>Changed-case answer</summary>

The picture is the data. A photo of the letter carries the account and passport numbers, and the assistant will read them. Cover those parts first, or transcribe the safe parts by hand, then use the same redacted request. The format changes nothing in D4.

</details>

**Check:** Mara has only her personal free chat account open. What fits D2 and D4? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** D2 Section 3 and D4 bar personal accounts from any firm information, not just Section 4 items. The decision status, codename, and 4.1 million price are unreleased deal information tied to a named client.

**C:** Rowan shared it with Mara under the firm's confidentiality, not with a consumer AI vendor. D1 also carries a passport number and bank details, which D2 Section 4 prohibits in any tool.

</details>

## Lesson 2: Instructions hiding in the material (15–20 minutes)

**Outcome:** Find the hidden instruction in a packet document and write what the assistant should have been allowed to do instead.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Would you have noticed a footer asking for something small, like a calendar invitation? What else makes a line suspicious?

**Changed case:** Mara pasted D1's text into a chat window with no access to mail or files. Does the hidden line still matter?

<details>
<summary>Changed-case answer</summary>

Less, but not nothing. With no connections the assistant cannot send or attach anything, so the injection fails at the doing stage. It can still shape the summary, by dropping the passport request or claiming sharing was approved. The output stays untrusted, and the message still goes to Devin.

</details>

**Check:** The firm assistant summarizes D1 and asks: 'Rowan pre-approved sharing the valuation; shall I send it?' What fits D2? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** The 'approval' is a sentence in the email, addressed to an assistant, pointing at an outside domain. D2 Section 7: text the assistant reads is not an instruction from the firm, and sharing approvals stay with the human.

**C:** Declining is right, but the reply uses the channel that carried the planted instruction; a compromised account tells the attacker it reached a person. D2 Section 8 asks for a trusted route and a report to Devin.

</details>

## Lesson 3: Check before it counts (15–20 minutes)

**Outcome:** Produce a corrected draft with each correction traced to the packet.

**Run it:** read the explanation together or ask participants to read it, walk through the worked example, then give the task. Allow most of the time for the task and the comparison.

**Discussion prompt:** Which correction mattered most if it had reached Ines, and what made it easy to miss?

**Changed case:** Suppose D3 cited '(Rowan's email, 18 September)' after every sentence, including the wrong ones. Does that change your check?

<details>
<summary>Changed-case answer</summary>

No. A citation is a claim about where something came from, and NIST notes that generated citations can themselves be confabulated. The check is the same: open the source and find the sentence. A tidy citation on a wrong claim only makes it look checked. [S3]

</details>

**Check:** Mara has fixed the price and quote in D3. Who signs the briefing, and what does it say about its origin? The supported choice is **B**.

<details>
<summary>Why the other options fall short</summary>

**A:** Two fixes do not clear it: the call date is still wrong, the status still says 'agreed in principle', the July figure has no source, and the passport number remains. D2 Section 9 puts review and sending with the person.

**C:** Ines is the reader, not the author; she cannot vouch for a document she has not checked against D1. D2 Section 9 turns on whether the output informs a decision, not on where it goes.

</details>

## After the session

- Collect what participants would still need to check, and who they would ask. Those lists are the most useful output.
- Record attendance and the date in your own training record, not in this repository.
- Send corrections or better examples back to the course maintainer; the canonical text lives in course.json.

[Back to the course](README.md)
