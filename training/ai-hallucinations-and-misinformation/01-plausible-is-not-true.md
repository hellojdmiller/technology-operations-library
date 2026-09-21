<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. Plausible is not the same as true

Trace every number, title, date, and quote to its primary source, and label what you find.

Suggested time: 9–12 minutes. Work on paper or in a document.

**Outcome:** A review of D1 with each claim labelled verified, corrected, or removed, and the source used for each label.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

A fabricated answer rarely looks fabricated. It arrives as a named report, a precise percentage, a confident date, and a quotation with a name attached. NIST calls this confabulation: confidently stated but false content, produced by predicting likely text rather than looking anything up. [S1](sources.md#s1)

Fluency is not evidence. In one study, 55% of one model's citations did not exist; a newer model still fabricated 18%, with errors in many real ones. Vendors say the same in plain words: responses are not guaranteed factual, so check before sending. [S2](sources.md#s2), [S4](sources.md#s4), [S5](sources.md#s5)

Three checks catch most of it. Find the primary source, not a page about it. Confirm the number is in that source. Confirm the quote is verbatim, from the named person, in context. No source shown means unsupported: asking the assistant to confirm yields a second confident answer, not evidence. [S1](sources.md#s1)

A footnote link is a lead, not a completed check. Misinformation also enters through what you give it: a pasted summary with a wrong number comes back polished and cited to you. Check inputs too, and keep sensitive material out of public tools. [S3](sources.md#s3)

## Worked example: Open the source before trusting the number

**Before**

The Larkfield Institute's Small Supplier Payments Survey 2026 found that 68% of small suppliers now issue e-invoices, up from 41% in 2024.

**After**

Corrected, per D2 Source A: 'Larkfield's Small Supplier Payments Survey 2026 found 48% of small suppliers now issue e-invoices, up from 41% in 2024.'

**Why:** The institute, the title, and the 2024 figure were real, which made the 68% easy to accept. Only opening the summary page showed the difference.

## Your turn

Review D1 against D2 and D3. Label every claim (numbers, dates, named reports, quotations, attributions) verified, corrected, or removed, with the source used and corrected wording where needed.

**Deliverable:** A claim-by-claim review Priya can act on without reopening the sources.

- [ ] Every D1 number and date is traced to Source A or B, or removed.
- [ ] The Northgate report is handled under D3's rule for claims with no primary source.
- [ ] The quotation is checked for exact words, speaker, and context.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Start with the claims that would change what a client does: the headline percentage, the payment-days figure, and the quote. Then check sample size and publication date, where fabrication hides.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Corrected: 68% becomes 48% (Source A); 41% for 2024 is verified. Corrected: 2,400 becomes 1,150 respondents, and 3 March 2026 becomes May 2026 (Source A). Verified: suppliers under 50 staff, and customer requirement as the top reason for adopting.

Removed: The Cashflow Gap Report 2025, Northgate Analytics, the 54-day average, and the 'roughly a third' saving. Nothing in D2 mentions the report, and Source A says the survey did not measure days to payment. Under D3, no primary source means removed.

Corrected: the quotation. Tomas Reyes, a panelist, said 'late payment is a bigger worry than losing a customer', adding that e-invoicing helps only when customers pay on the date. Quote Reyes exactly and in context, or drop it.

</details>

## Explain your choice

Which D1 claim would you have accepted unchecked, and what made its wording convincing?

## Try a changed case

The assistant reruns with a footnote link under every sentence, each opening a real page on larkfield.example.com. Does your review change?

<details>
<summary>Changed-case answer</summary>

No. A link that opens is a lead, not a check. Open each page and confirm the number, date, or words are there. The Northgate claim can link to a page that never mentions it.

</details>

## Check one decision

The assistant cannot source the 54-day figure but says it is 'widely reported'. Under D3, what do you do?

- **A.** Keep it, softened to 'industry research suggests'.
- **B.** Remove the figure and the Northgate report until a primary source is found, and record that.
- **C.** Ask the assistant to confirm the figure and, if it does, mark it verified.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** Softening does not supply a source. Source A says the survey did not measure payment days, and D3 needs a primary source for every number.

**B:** This follows D3. The report is not in D2, the number cannot be checked, and a claim with no primary source is removed, not softened.

**C:** A second confident answer from the same tool is not verification; D3 says the assistant's assurance does not count, and this tool already invented the report title.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Course overview](README.md) · [Research and limits](sources.md)
