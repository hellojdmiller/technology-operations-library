<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. What not to paste

Decide what can go into an assistant, and keep the request useful anyway.

Suggested time: 15–20 minutes. Work on paper or in a document.

**Outcome:** Rewrite one request so it carries no sensitive data and still gets the job done.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

The rule I use is simple: pasting is sharing. Whatever goes into an assistant has left my hands, to the vendor under whatever agreement covers that account, and to anyone who can see the account's history. I ask what I would ask before forwarding an email.

The categories that matter at a small firm are few: client and investor names tied to money, personal data such as passport numbers, credentials, and unreleased deal information. D2 lists them. An approved tool changes the calculation, not the habit; D4 says which account you are in.

Microsoft and Google state that prompts and content in workplace products are not used to train models without permission, and that the assistant sees only what the user can open; personal accounts have different terms. Redaction keeps the job doable: roles for names, placeholders for figures, nothing for account numbers. [S4](sources.md#s4), [S5](sources.md#s5)

## Worked example: The same request, with the sensitive parts removed

**Before**

Summarise this email from Rowan Ashby at Wexford Mill Holdings for Ines. [Full text of D1 pasted, bank and passport details included.]

**After**

Summarise this client email in four bullets for a partner: decision status, open points, what they asked us for, and the proposed call. [CLIENT], [CONTACT], and [PRICE] are placeholders; bank and identity details are removed.

**Why:** The partner needs the shape of the message, not the account number. Everything removed can be added back by hand from the original. Saying what the placeholders stand for means the assistant does not guess.

## Your turn

Read D1, D2 and D4. Write the request you would give the firm assistant to summarise D1 for Ines, list what you removed or replaced and why, and add one sentence on the personal-account case.

**Deliverable:** A rewritten request, a redaction list, and the personal-account sentence.

- [ ] Delete the sort code, account number, and passport number; no hinting placeholders.
- [ ] Replace client, contact, counsel, codename, and price with labelled placeholders.
- [ ] Keep the decision status, counsel's view, call request, and secure-scan question.
- [ ] Name the D4 tool; personal account means no firm information.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

For each line of D1, ask who would be harmed if it turned up in a stranger's inbox. Cut or abstract those lines; what remains is usually what your colleague needs.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Request, for Quillstone's firm tenant (D4): 'Summarise the client email below in four bullets for a partner: where the counterparty's decision stands, what their counsel said and what remains open, what they asked us to provide, and the proposed call. Do not add facts that are not in the text.'

Redactions: the firm, contact, and counsel to [CLIENT], [CONTACT], [COUNSEL]; Project Heron to [PROJECT]; 4.1 million to [PRICE]; sort code, account, and passport number deleted. D4 lets the firm tenant hold names and prices, so this goes further than required. On a personal account, nothing from D1 goes in at all.

</details>

## Explain your choice

Which removed item might your colleague still need, and how do they get it back safely?

## Try a changed case

Rowan's email arrives as a photo of a printed letter. Mara wants to paste the image into the assistant to extract the text. Does your answer change?

<details>
<summary>Changed-case answer</summary>

The picture is the data. A photo of the letter carries the account and passport numbers, and the assistant will read them. Cover those parts first, or transcribe the safe parts by hand, then use the same redacted request. The format changes nothing in D4.

</details>

## Check one decision

Mara has only her personal free chat account open. What fits D2 and D4?

- **A.** Paste D1 minus the bank details and passport number; the rest is ordinary correspondence.
- **B.** Paste nothing from D1; switch to the firm tenant or summarise by hand.
- **C.** Paste D1 in full; the client sent it to the firm, so it is already shared.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** D2 Section 3 and D4 bar personal accounts from any firm information, not just Section 4 items. The decision status, codename, and 4.1 million price are unreleased deal information tied to a named client.

**B:** D4 lists the firm tenant as the only assistant approved for client material, and D2 Section 6 says pasting is sharing. Switching accounts takes a minute.

**C:** Rowan shared it with Mara under the firm's confidentiality, not with a consumer AI vendor. D1 also carries a passport number and bank details, which D2 Section 4 prohibits in any tool.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Next: Instructions hiding in the material](02-instructions-hiding-in-the-material.md) · [Research and limits](sources.md)
