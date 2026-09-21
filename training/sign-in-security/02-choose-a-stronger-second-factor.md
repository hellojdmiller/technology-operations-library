<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 2. Choose a stronger second factor

A ladder from text codes to passkeys: strongest rung on the accounts with the longest reach.

Suggested time: 15–20 minutes. Work on paper or in a document.

**Outcome:** An annotated decision about which factor to use for which account, and what to do with an unexpected prompt.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

Second factors are not equal. CISA ranks them strongest to weakest: passkeys and security keys built on FIDO, then authenticator codes or number-matched prompts, then plain push prompts, then text or voice codes, a last resort. [S2](sources.md#s2) The lower the rung, the more ways round it.

The gap is phishing. A code you read can be typed into a fake page, so NIST does not count typed codes as phishing-resistant and restricts text-message delivery. [S1](sources.md#s1) A passkey, unlocked like your phone and synced or held on a security key, will not answer a site it was not registered with. [S3](sources.md#s3)

Push prompts fail differently. An attacker with your password sends prompt after prompt until you tap approve; CISA calls this push bombing. Number matching blocks it: you must type a number from a sign-in screen you cannot see. Microsoft applies it to every Authenticator push. Never approve a prompt you did not start. [S2](sources.md#s2), [S4](sources.md#s4)

## Worked example: From making it stop to deciding per account

**Before**

Priya, 01:40: "If I approve one, the buzzing will probably stop. Text codes were fine for years."

**After**

Priya, next morning: "Passkeys for work email and the password manager; they reach everything. Number-matched authenticator elsewhere until passkeys arrive. No text codes at work. Prompts: deny, type nothing, change the password from my laptop, message Lena at 08:00."

**Why:** Strongest factor on the longest reach; text codes off work accounts (D3 4.1); the unexpected prompt treated as proof the password is known, not noise.

## Your turn

Using D2 and D3, write an annotated decision for Priya's work email, password manager, and file-sharing account: the factor for each and one reason. Then write two lines on what she does with the D2 prompts and one on what she does not do.

**Deliverable:** A three-row decision (account, factor, reason) and a three-line response to D2.

- [ ] The two accounts with the longest reach get a passkey or security key.
- [ ] No work account stays on text-message codes.
- [ ] The D2 response includes deny, no number, change the password, and report.
- [ ] Says why approving even once is wrong here.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Read the 01:12 line of D2. What had to be true for a prompt to be sent at all?

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Work email: passkey; the mailbox resets every other account and a fake page cannot phish a passkey. Password manager: passkey or security key; it holds every other password. File sharing: number-matched authenticator; that service offers no passkeys yet and D3 4.1 permits it. Text codes: nowhere at work.

Each D2 prompt followed a verified password from a device Priya has never used, so the password is known. Deny every prompt and type no number. Change the password in the manager on waking and tell Lena before stand-up (D3 4.3). Do not approve one to stop the noise.

</details>

## Explain your choice

Which account got your strongest factor, and what would the next rung down have cost?

## Try a changed case

Tomasz, a systems administrator, uses only the number-matched authenticator app. Under D3, is that enough?

<details>
<summary>Changed-case answer</summary>

No. D3 4.2 requires administrators to use phishing-resistant methods only: a security key or passkey, with a second key as backup. Number matching stops push bombing but not a fake page collecting a code. Tomasz registers a key with the technology team and drops the app once it works.

</details>

## Check one decision

At 01:58 in D2 a prompt with number 33 arrives after another verified password. What should Priya do?

- **A.** Approve once so the prompts stop, then sort it out in the morning.
- **B.** Deny, enter no number, change the password from her laptop, and report it the same day.
- **C.** Ignore them: number matching means nothing can be approved by mistake.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** Every D2 prompt followed a verified password from an unrecognised device in an unfamiliar city. Approving hands that device her session; D3 4.3 forbids it, and one approval is all the attacker needs.

**B:** This fits D2 and D3: the prompts prove the password is known, so it changes; typing nothing keeps the attacker out; the same-day report is D3 4.3.

**C:** Number matching stops an accidental tap, but D2 shows the attacker has the password and D4 shows the next move: asking Priya for a code and an approval. D3 4.3 requires a same-day report, and the password must change.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: One password per account](01-one-password-per-account.md) · [Next: Recover safely](03-recover-safely.md) · [Research and limits](sources.md)
