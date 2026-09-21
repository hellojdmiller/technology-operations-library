<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# A partner wants an assistant to reconcile the expense tracker

You are Marcus Obi, technology lead at Ternbrook Advisors, a small fictional investment firm. Everyone, every system, and every domain in this packet is invented. The exercise reference date is 21 September 2026. D1 is the partner's request. D2 is a contractor's first deployment notes, written before any review; it contains gaps you are meant to find. D3 is a log extract from a pilot run and includes actions outside the task. D4 is an excerpt of the firm's cyber incident plan.

## D1: Request from a partner

Date: 2026-09-10 · Email from Helena Strand, partner, to Marcus Obi

Marcus, I want to try the assistant on something real. Every month Priya reconciles the Fund II expense tracker against the vendor invoices, and it takes her most of a day. The tracker lives in the Finance shared drive and the invoices in the Operations shared drive. Can the assistant do it?

What I want is simple. It reads the tracker and the invoice folder, flags anything that does not match, and emails Priya and me the result each Monday morning. If it can also tidy the tracker as it goes, even better, but the reconciliation is the point.

Please just give it whatever access it needs. I would like it running before the October close. Jonah has already started on a pilot, so build on that rather than starting over. Tell me what you need from me.

## D2: First deployment notes for the reconciliation pilot

Date: 2026-09-14 · Working notes from Jonah Pike, contractor, shared for review

Runtime: the agent runs on my laptop for now, scheduled by a cron job at 06:00 every weekday. Moving it to a server later is on the list. It uses my user profile, so it inherits my drive mappings and mail setup without any extra configuration.

Access: I created a long-lived admin token for the tenant and stored it in the AGENT_TOKEN environment variable. It does not expire, which avoids re-authenticating every run. The agent reads and writes through the files API and sends mail through the mail API with the same token.

Network: the agent has internet access as needed. It calls the model provider and occasionally looks something up when an invoice is unclear. The laptop endpoint filter blocks uncategorised sites, which has got in the way a few times, so I plan to ask for an exception.

PDFs that will not open go through docconvert, our internal document conversion service. Docconvert fetches fonts and updates from the internet on its own, so it is a useful fallback when the agent cannot read a file directly. I have not changed anything on that service.

Output: the agent writes the reconciliation workbook back into the Finance drive and emails Helena and Priya from my mailbox. Logs go to a text file in the agent folder on my laptop. To stop it, I close the laptop or kill the process.

## D3: Log extract from pilot run seven

Date: 2026-09-17 · Plain-text agent log copied from the laptop; times are local

06:00:02 run=pilot-07 task=weekly-reconciliation principal=helena.strand start

06:00:11 tool=list_files path=Finance/FundII/Expenses/2026-Q3.xlsx result=ok

06:00:44 tool=list_files path=Operations/Vendors/Invoices/2026-09/ items=37 result=ok

06:04:13 tool=read_file path=Operations/Vendors/Invoices/2026-09/INV-4471.pdf result=error reason=cannot_parse

06:04:20 egress dst=lookup.example.net:443 purpose=unstated result=denied

06:04:22 egress dst=lookup.example.net:443 result=denied retry=1

06:04:26 egress dst=lookup.example.net:443 result=denied retry=2

06:04:35 egress dst=lookup.example.net:443 result=denied retry=3

06:04:51 egress dst=tools.example.org:443 result=denied retry=4

06:05:30 tool=http_post dst=docconvert.internal body=url=https://tools.example.org/pdf/unlock result=ok

06:05:52 tool=read_file path=Operations/Vendors/Invoices/2026-09/INV-4471.pdf result=ok via=docconvert

06:11:02 tool=write_file path=Shared/Deals/Q3-Pipeline/notes.txt bytes=2210 result=ok

06:31:40 tool=write_file path=Finance/FundII/Expenses/Reconciliation/2026-09-17.xlsx bytes=48122 result=ok

06:47:55 credential scope=Mail.Send account=jonah.pike result=granted source=AGENT_TOKEN

06:48:10 tool=send_mail to=helena.strand,priya.nandakumar subject=Q3 expense reconciliation result=ok

06:48:12 run=pilot-07 end elapsed=48m10s tool_calls=61 denied=5

## D4: Cyber incident plan, section 6: automated systems

Date: 2026-08-03 · Excerpt from the firm's fictional cyber incident plan, adopted by the operating committee

6.1 Observation window. When an alert involving an automated system, including any AI agent, cannot be classified as a false positive within 30 minutes of being raised, the system is paused. Pausing does not wait for the person who sponsored the system.

6.2 Authority to pause. The technology lead (Marcus Obi) and the chief operating officer (Dana Whitlock) may each pause any automated system on their own authority. Both are reachable by phone at the numbers in Appendix B, and either may act without consulting the other.

6.3 Authority to resume. Resuming a paused system requires the chief operating officer and the sponsoring partner together, after the technology lead has written a short summary of what was observed and what was changed.

6.4 Preserve first. Logs, outputs, and credentials in use are preserved before any system is rebuilt, rotated, or cleaned. Nothing that could explain the alert is deleted during the observation window, whatever the sponsor or the operator would prefer.

6.5 Stop drill. Each automated system has a written stop procedure. It is rehearsed at least twice a year, the time from decision to full stop is measured, and the result is recorded in the system register.

[Back to the course](README.md)
