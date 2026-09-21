<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# One reused password, three days later

You work at Harrowvale Advisory, a small fictional firm. Everyone and everything in this packet is fictional, including the firm, the people, the services, and the domains. The exercise reference date is 21 September 2026. D1, D2, and D3 are the evidence. D4 is an impersonation attempt: the sender is not the technology team, whatever the display name says. Use the packet to practise deciding; do not change any real account during the exercise.

## D1: Breach notification from a personal service, forwarded to the technology team

Date: 2026-09-16 · Email: a forwarded notice with the recipient's own note on top

Forwarded by Priya Raman (praman@harrowvale.example.com) to Lena Okafor, technology lead, on 16 September 2026 at 07:52.

Lena, I got this on my personal email last night. I am fairly sure the Pantry Box password is the same one I use for my work email and for the file-sharing site. I have not changed anything yet. What should I do first? Priya

From: Pantry Box Security (security@pantrybox.example.com). To: priya.r@mail.example.com. Sent: 15 September 2026, 22:14. Subject: Important notice about your Pantry Box account.

We are writing to tell you about a security incident that affects your account. On 11 September 2026 we found that an unauthorised party had accessed a database containing customer names, email addresses, delivery postcodes, and hashed passwords. We have no evidence that payment card details were affected.

As a precaution we have signed out all sessions on your account. We recommend that you change your Pantry Box password now, and that you also change the password on any other account where you used the same or a similar password.

Please be alert to emails or calls that claim to be from Pantry Box and ask for your password, a code, or payment details. We will never ask for these. We are sorry for the concern this may cause.

## D2: Sign-in report: unexpected authenticator prompts overnight

Date: 2026-09-18 · Log extract: plain-text export from the firm's sign-in report

Sign-in report for praman@harrowvale.example.com, exported by Lena Okafor on 18 September 2026 at 09:10 after Priya mentioned at the morning stand-up that her phone had been buzzing all night. Times are local. The account's registered method is the authenticator app with number matching.

01:12. Password verified from an unrecognised device (Android, mobile browser) in a city the user has never signed in from. Push prompt sent, number 47. Result: expired, no number entered.

01:14. Password verified, same device and location. Push prompt sent, number 82. Result: expired, no number entered.

01:19. Password verified, same device. Push prompt sent, number 15. Result: user tapped Deny.

01:23. Password verified, same device. Push prompt sent, number 91. Result: user tapped Deny.

01:31. Password verified, same device. Push prompt sent, number 60. Result: expired, no number entered.

01:40. Password verified, same device. Push prompt sent, number 28. Result: user tapped Deny.

01:47. Password verified, same device. Push prompt sent, number 74. Result: expired, no number entered.

01:58. Password verified, same device. Push prompt sent, number 33. Result: user tapped Deny.

02:06. Password verified, same device. Push prompt sent, number 09. Result: expired, no number entered. No further activity from this device.

No sign-in was completed. The password had not been changed at the time of export. No report other than the stand-up remark had been made to the technology team.

## D3: Excerpt from the firm's sign-in standard

Date: 2026-06-01 · Policy excerpt: sections 3 to 6 of a fictional internal standard

Harrowvale Advisory Sign-in Standard, version 2.1, approved 1 June 2026. Sections 1 and 2 (scope and definitions) are omitted from this excerpt.

3.1 Every member of staff uses the firm-provided password manager. Every work account has its own generated password of at least 16 characters, never reused and never recorded anywhere except the manager. The manager's own passphrase is the one password you memorise.

3.2 A password is changed when there is evidence it may be known to someone else: a breach notice for any service where it was reused, unexpected sign-in prompts, or a request from the technology team. Routine scheduled changes are not required.

4.1 Multi-factor authentication is required on every work account. Staff use the authenticator app with number matching or a passkey. Text-message codes are not an approved method for work accounts; the technology team may allow one as a temporary fallback for no more than seven days.

4.2 Administrators (anyone who can change other people's access, including the technology team and the finance systems owner) use phishing-resistant methods only: a security key or a passkey, with a second key registered as backup.

4.3 Never approve a sign-in prompt you did not start, and never enter a number for a prompt you did not start. Deny it and report it to the technology team the same day.

5.1 Recovery codes for work accounts are stored in the password manager as secure notes. They are not kept in email, chat, photos, or on paper at your desk. The manager's own printed emergency kit is kept at home, away from the devices it unlocks.

6.1 The technology team will never ask you for a password, a one-time code, or to approve a prompt. Anyone who does is not the technology team. Verify any support request by calling the team on the extension listed on the internal directory page (4400), never on a number given to you in the message itself.

6.2 Report a suspected compromise as early as you can, even if you are unsure. There is no penalty for a false alarm. Late reports are the ones that cost the firm.

## D4: Chat transcript: a request for a code from "IT Support"

Date: 2026-09-18 · Chat transcript: direct messages exported from the firm's chat app

Direct-message conversation exported by Lena Okafor on 18 September 2026 at 09:15. Sender display name: IT Support (Harrowvale). Sender account: hv-helpdesk@harrowvale-support.example.net, an external guest account, not a firm account. Recipient: Priya Raman.

08:42 IT Support: Hi Priya, this is IT Support. We picked up several suspicious sign-in attempts on your account overnight from an unrecognised device. We need to secure the account before 09:00 or it will be locked for 48 hours.

08:43 Priya: Yes, my phone was buzzing all night. I mentioned it at stand-up just now.

08:43 IT Support: That matches what we see. To cancel the attacker's sessions I need to verify the account. You will get a 6-digit code by text in a moment. Please paste it here.

08:44 IT Support: You will also see one more prompt in your authenticator app. Approve that one, it is from us, so we can push the fix through.

08:45 Priya: Should I check with Lena first? She is already looking at it.

08:45 IT Support: Lena is in a meeting and asked us to handle it. We are against the clock here, 15 minutes left. The code should have arrived by now.

08:46 Priya: Hang on.

Transcript ends. Priya sent nothing further on this channel before the export.

[Back to the course](README.md)
