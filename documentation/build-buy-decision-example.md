# Decision memo: tracking vendor renewals

**Status:** Fictional example; proposed decision, not approved or implemented.

## Question

How should a 12-person operations team keep renewal dates, decisions, and ownership visible without creating a custom application that nobody is prepared to support?

## Required outcome

Each active vendor has an owner, a renewal date, and a recorded decision. Reminders reach that owner before the notice deadline. A second operator can find the current state and export the records without the original builder.

## Options

| Option | Why it could fit | Responsibility or gap |
|---|---|---|
| Configure the existing workflow platform | The team already uses it; the required records are simple | Verify reminders, access, export, and any incremental cost |
| Buy a dedicated tool | May reduce configuration and add useful renewal controls | Evaluate an additional vendor and migration; current requirements may not justify it |
| Build a small application | Full control over the workflow | Maintenance, authentication, recovery, and handover need owners |
| Keep the spreadsheet with a simpler review routine | Lowest transition effort | Manual reminders remain a dependency; test whether the routine is reliable enough |

## Proposed decision

Pilot configuration of the existing platform for two weeks. This is the smallest change that may satisfy the outcome. The recommendation depends on its reminder behavior and portable export meeting the team's needs.

Assign an operations owner for the data and a technology owner for configuration before the pilot starts. These are proposed roles, not recorded assignments.

## Pilot

Use ten fictional vendor records and two test users with different roles. Set short test deadlines so the full reminder sequence can be observed during the pilot.

Accept the pilot only if:

1. Each expected reminder reaches the intended test user once, with a visible record of delivery or failure.
2. The restricted user cannot read fields excluded from their role.
3. An exported record retains the required fields and can be read outside the platform.
4. A second operator can change an owner, inspect a failed reminder, and describe recovery using the handover notes.

Record observed results separately. No result has been produced by this example.

## Reconsideration

Reopen the decision if reminders cannot be verified, export loses required history, a named operator cannot sustain the configuration, or a new requirement changes the capability being evaluated. A successful pilot supports a rollout decision; it does not authorize one.
