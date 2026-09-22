<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# Putting an AI Agent to Work Safely: worksheet

Keep your first attempt separate from any revision, and write down what you would still need to check. Everything in the [packet](source-packet.md) is fictional.

**Name (optional):** 

**Date:** 

## Lesson 1: Scope the task and the authority

**Outcome:** Write a one-page authority statement for the partner's request: reads, writes, sends, human steps, identity, expiry.

**Task:** Write a one-page authority statement for D1 in 120 to 180 words: purpose, principal, identity, reads, writes, sends, human steps, expiry, who signs. Write it for Helena to sign, not for an engineer.

**Deliverable:** A statement Helena could sign and Jonah could configure from, with nothing 'as needed'.

- [ ] Name Helena as principal and state the one purpose.
- [ ] List reads, writes, and sends by exact folder and recipient.
- [ ] Say what needs a human, including any unreadable file.
- [ ] Give the agent its own identity and an expiry date.

**First attempt**



**Revision after comparing with the example**



**What I would still check, and with whom**



**Changed case (see lesson):** 


## Lesson 2: Isolate, broker, and allowlist

**Outcome:** Produce a deployment sketch with each control named and the test that proves it.

**Task:** Write a deployment sketch for the pilot in D1 and D2. For each of five areas (isolation, identity, credentials, egress, relays), say what you would deploy and the test from inside the sandbox that proves it.

**Deliverable:** A one-page sketch: five named controls, five tests, and the D2 sentence each replaces.

- [ ] Move the agent off the laptop; say what is mounted where.
- [ ] Replace the admin token with a service account and a brokered, short-lived token.
- [ ] Name each egress destination and purpose; deny the rest; log attempts.
- [ ] Treat docconvert as a relay: constrain its fetching or remove it.

**First attempt**



**Revision after comparing with the example**



**What I would still check, and with whom**



**Changed case (see lesson):** 


## Lesson 3: Observe and stop

**Outcome:** Write an observation and stop plan with the kill-switch drill as steps and a place for the time.

**Task:** Write an observation and stop plan: telemetry and where it lands, the alerts D3 should have raised, a duration budget, D4's 30-minute rule and people, and the kill-switch drill as numbered steps with a blank for the time.

**Deliverable:** A one-page plan a colleague could run at 06:11 without calling you.

- [ ] Telemetry includes denied actions and destinations attempted, and leaves the host.
- [ ] Alerts name the D3 events that cross the D1 boundary.
- [ ] A duration budget, and who pauses and resumes under D4.
- [ ] Drill ends with execution, tools, credentials, network, and new jobs stopped, logs kept, time recorded.

**First attempt**



**Revision after comparing with the example**



**What I would still check, and with whom**



**Changed case (see lesson):** 


[Back to the course](README.md)
