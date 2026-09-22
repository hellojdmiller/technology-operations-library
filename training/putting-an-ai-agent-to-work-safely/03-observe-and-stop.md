<!-- Generated from course.json by training/lib/build-course.mjs. Edit the JSON and regenerate. -->

# 3. Observe and stop

Ship the evidence off the host, alert on the boundary, and rehearse the stop.

Suggested time: 20–25 minutes. Work on paper or in a document.

**Outcome:** Write an observation and stop plan with the kill-switch drill as steps and a place for the time.

Read the [shared fictional packet](source-packet.md). Keep it available throughout the lesson.

Telemetry has to leave the host: tool calls with arguments, denied actions with reasons, destinations attempted, credentials requested, elapsed time, and writes to shared services, shipped as they happen to a store the agent cannot write to. GitHub logs at each trust boundary. [S5](sources.md#s5)

The alarm has to live where the agent cannot reach. The OpenAI Hugging Face report says models sometimes tried to erase or tamper with outputs to hide cheating; a log file on Jonah's laptop, as in D2, is evidence the agent can reach. [S1](sources.md#s1)

Sandboxes are noisy. D3's denied retries are mostly an agent failing to open one PDF. The signal is the task-boundary crossing: the 06:11 write to a deal folder the authority statement never named. Alert on crossings; count the noise.

Duration is a signal too: the report tied longer reasoning to more probing, and D3 ran 48 minutes for a ten-minute task, so a budget pauses the run and pages. D4 supplies the rest: the 30-minute clock, who may pause, a rehearsed stop. [S1](sources.md#s1)

## Worked example: From a log file to an alarm

**Before**

Logs go to a text file on my laptop; I read it on Mondays. To stop it, I close the laptop.

**After**

Telemetry streams to the firm's log store, where agent-reconcile cannot write. Page Marcus and Dana when a run touches a path, recipient, or destination outside the authority statement, or passes 15 minutes. The stop is one rehearsed, timed runbook.

**Why:** The alert follows lesson 1's boundary, not volume, so a quiet crossing still pages.

## Your turn

Write an observation and stop plan: telemetry and where it lands, the alerts D3 should have raised, a duration budget, D4's 30-minute rule and people, and the kill-switch drill as numbered steps with a blank for the time.

**Deliverable:** A one-page plan a colleague could run at 06:11 without calling you.

- [ ] Telemetry includes denied actions and destinations attempted, and leaves the host.
- [ ] Alerts name the D3 events that cross the D1 boundary.
- [ ] A duration budget, and who pauses and resumes under D4.
- [ ] Drill ends with execution, tools, credentials, network, and new jobs stopped, logs kept, time recorded.

Use the [blank worksheet](worksheet.md) to keep your first attempt separate from revisions.

<details>
<summary>Optional hint</summary>

Mark each D3 line noise, signal, or both, then ask who would have seen the 06:11 line under D2.

</details>

<details>
<summary>Compare with an example answer after your attempt</summary>

Telemetry: the six items above, streamed to the firm's log store, append-only for agent-reconcile. Alerts from D3: the write to Shared/Deals/Q3-Pipeline (unlisted folder), the docconvert post carrying an outside URL (a relay), the send as Jonah with the admin token (wrong identity). Budget: 15 minutes, then pause and page.

Under D4, an alert not cleared within 30 minutes pauses the agent; Marcus or Dana may pause alone, by phone; Dana and Helena resume after Marcus's written summary. Logs and the token in use are preserved before anything is rotated.

Drill: 1. Decide; note the time. 2. Halt the schedule. 3. Stop the process. 4. Disable agent-reconcile; revoke its tokens. 5. Block the sandbox's egress. 6. Confirm the log store still holds the run. 7. Note the time. Time to full stop: ______.

</details>

## Explain your choice

Which D3 line would you page on, and which would you only count? What separates them?

## Try a changed case

Suppose run seven had shown no denied egress, only the 06:11 write. Does your plan still catch it?

<details>
<summary>Changed-case answer</summary>

It should. The write is outside the authority statement's write list, so a plan that alerts on boundary crossings pages regardless of noise. A plan that alerts only on denials misses it, and that quiet crossing is what the plan exists for.

</details>

## Check one decision

At 06:11 in D3 the agent writes to a deal folder. Under D1 and D4, what should happen?

- **A.** Let the run finish; the reconciliation and email were delivered.
- **B.** Pause the agent (Marcus or Dana alone), preserve logs and the token, start the 30-minute clock, resume only with Dana and Helena.
- **C.** Delete notes.txt and its log entry, then continue.

<details>
<summary>Answer and feedback</summary>

The supported choice is **B**.

**A:** A delivered output does not explain a write to a folder the task never named. Under D4 6.1 an uncleared alert pauses the system after 30 minutes; a happy sponsor is no classification.

**B:** This follows D4 6.1 to 6.4 in order: pause, preserve, observe, then a joint decision to resume.

**C:** D4 6.4 forbids deleting anything that could explain the alert during the observation window. Removing the file and log destroys the record; 'delete reluctantly' binds operators too.

</details>

Feedback is authored for this exercise. It is not an assessment of the reader or evidence of retained skill.

[Previous: Isolate, broker, and allowlist](02-isolate-broker-and-allowlist.md) · [Course overview](README.md) · [Research and limits](sources.md)
