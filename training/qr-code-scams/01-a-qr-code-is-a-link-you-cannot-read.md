<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 1. A QR code is a link you cannot read

Preview the destination, match it to the sender, and know which requests never arrive by code.

Suggested time: 8–10 minutes. Work on paper or in a document.

**Outcome:** A decision for each of D1 and D2 (scan, preview then decide, or report) with one reason each.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

A QR code is a web address drawn as a picture. Nobody can read it by eye, and email security tools may not scan the image, so it slips past filters that would catch the same link as text, then opens on a phone, often personal. [S3](sources.md#s3)

The tricks are simple. A sticker covers the real code on a parking meter or menu. An email gives an urgent reason to scan: a missed delivery, a suspended account, a password to change. The page at the end is a sign-in or payment screen. [S1](sources.md#s1), [S2](sources.md#s2)

Your phone gives you a moment to look. Hold the camera over the code without tapping and read the address; the domain should match whoever claims to have sent it. Two requests skip that step: a multi-factor reset and a bank-details update never arrive by code. Report those. [S1](sources.md#s1), [S2](sources.md#s2)

## Worked example: Reading the preview instead of the notice

**Before**

The notice looks official, hangs beside the building's own signs, and has a deadline. I scan it, tap through, and a page asks for my name, plate, and a card for a small 'permit fee'.

**After**

I hold the camera over the code and read the banner: permits-renewal-portal.example.net. The building manager writes from ternbridge-house.example.com, and reception knows nothing about it. I do not open it. I photograph the notice for IT and ask reception to check.

**Why:** The preview gave me the one fact the notice could not fake: where the code goes. A domain that does not match the building, plus a notice nobody can vouch for, is enough to stop.

## Your turn

Read D1 to D3. For D1 and D2, write one decision each: scan, preview then decide, or report without scanning. Give one reason each, pointing to something in the document.

**Deliverable:** Two decisions with two reasons, ready to send to IT.

- [ ] Each decision is scan, preview then decide, or report.
- [ ] Each reason names something in the document, not a general feeling.
- [ ] D2 is checked against D3's never-by-code list.
- [ ] Neither decision opens the page to see what happens.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Ask two questions of each code: what does the preview say, and what does the page want? A request on D3's never-by-code list settles it before you even preview.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

D1: preview then decide, and the preview decides it. permits-renewal-portal.example.net does not match the building's ternbridge-house.example.com, and nobody at reception knows about the notice. Report it with a photo, ask reception to check, and do not open the page.

D2: report without scanning. It asks me to sign in with my work account and confirm bank details, both on D3's never-by-code list, from fgadvisors-hr.example.net, which is not the firm's domain. 'We are not sending links, for security' is the tell: the code is the link.

</details>

## Explain your choice

D2 says the code replaces a link 'to keep this secure'. Why does that make the message less trustworthy, not more?

## Try a changed case

Change one thing: the D1 code is printed into the building's own laminated parking sign, not a separate notice, and the preview shows ternbridge-house.example.com/parking. Your decision now?

<details>
<summary>Changed-case answer</summary>

Preview then decide, and it passes: the code is part of the original sign, not a sticker or loose notice, and the preview matches the building's domain. Scan it, enter only what a permit form needs, and stop if a surprise fee appears.

</details>

## Check one decision

D2 uses a code instead of a link 'to keep this secure'. Which response fits D3?

- **A.** Scan it on your personal phone rather than the work laptop, as the email suggests.
- **B.** Preview the code, and if the address looks like a payroll provider, sign in and confirm.
- **C.** Do not scan. Forward the email to IT and ask finance whether a migration is happening.

<details>
<summary>Answer and feedback</summary>

The supported choice is **C**.

**A:** A personal phone is where the sender wants this page: a device without the firm's filters. And confirming bank details by code is on D3's never-by-code list, whatever the device.

**B:** Previewing is right for most codes, but D3 rules this one out first: bank details and work sign-in never arrive by code. A plausible provider domain is cheap to register and proves nothing.

**C:** This fits D3. The request is on the never-by-code list, the sender domain is not the firm's, and finance can confirm or deny a migration in one conversation. Nothing is entered.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Course overview](README.md) · [Course overview](README.md) · [Research and limits](sources.md)
