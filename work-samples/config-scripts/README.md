# Resource-calendar configuration comparison

This sample adapts the practical question behind a working administration script: **why does this room behave differently from the others?** It compares a selected reference room with explicit peers and keeps failed retrievals visible.

The reusable version is a fresh, parameterized implementation. It removes embedded organization, location, room and administrator identities, automatic sign-in, tenant-wide enumeration, and unrelated permission/group discovery. The supplied snapshot is entirely fictional. Source provenance is retained privately outside this repository.

## Try it offline

With PowerShell 7 or later, from the repository root:

```powershell
pwsh -NoLogo -NoProfile -File work-samples/config-scripts/Compare-RoomCalendarSettings.ps1 -ReferenceRoom cedar@example.invalid -Json
```

This uses [rooms.example.json](rooms.example.json). It does not load Exchange modules, sign in, or contact a tenant. The [expected output](expected-output.example.json) contains:

| Comparison result | Count | Why |
|---|---:|---|
| `matches_reference` | 8 | Eight observed Oak settings equal Cedar's values |
| `differs` | 2 | Oak's booking window and subject handling differ |
| `unknown` | 10 | Willow's retrieval failed; its settings cannot be compared |

An explicit `false` remains a value. A missing field or failed reference produces `unknown`. Duplicate identities, malformed types, missing references, and wildcard inputs are rejected.

## What the settings tell you

| Group | Fields | Review question |
|---|---|---|
| Booking automation | `AutomateProcessing`, `AllBookInPolicy` | Should eligible requests book automatically, require a delegate, or follow another process? |
| Scheduling | `BookingWindowInDays`, `MaximumDurationInMinutes`, `AllowRecurringMeetings` | Do these limits fit the room's intended use? |
| External requests | `ProcessExternalMeetingMessages` | Does the room need to process requests arriving from outside the firm? |
| Meeting details | `DeleteSubject`, `AddOrganizerToSubject`, `DeleteComments`, `RemovePrivateProperty` | What should survive resource processing, and who could see those details through downstream calendars or displays? |

The fictional values are **not a recommended room policy**. Matching a popular setting does not prove it is appropriate. For example, a boardroom, shared training room, and external-facing meeting space can have different booking and privacy needs. Review the [official property definitions](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-calendarprocessing?view=exchange-ps) before deciding whether a difference needs a change. This script never invokes the setter.

## Optional scoped collection

Connected mode has not been run against a tenant. It requires an already-established, unprefixed Exchange Online session in a dedicated PowerShell process, the expected tenant ID, and 2–50 exact primary resource-mailbox addresses including the reference. The existing session must have permission to read the selected objects. No installation, connection, disconnection, or settings change is performed.

After establishing and independently checking that session, an operator can adapt this example **inside that same PowerShell process**:

```powershell
# Replace these fictional identifiers in a private operational copy.
./work-samples/config-scripts/Compare-RoomCalendarSettings.ps1 `
  -UseExistingConnection `
  -ExpectedTenantId '00000000-0000-4000-8000-000000000001' `
  -RoomIdentity 'cedar@example.invalid','oak@example.invalid' `
  -ReferenceRoom 'cedar@example.invalid' `
  -Json
```

The script checks the active tenant before querying resources, verifies each primary address resolves to one room/equipment mailbox, then reads only the selected calendar properties. Retrieval errors remain errors in the result; exception payloads are omitted to avoid copying unrelated identifiers into a report. Inspect the failure privately before deciding whether data is absent or access was denied.

Microsoft documents [connection inspection](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-connectioninformation?view=exchange-ps) in ExchangeOnlineManagement 3.0.0+, [mailbox reads](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-exomailbox?view=exchange-ps), and [resource-calendar reads](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-calendarprocessing?view=exchange-ps). These references were checked on **2026-09-17**. Actual output types, permissions, and module behavior still need acceptance testing in the intended environment.

## Evidence and limitations

The output compares a snapshot, not historical drift or effective end-to-end booking behavior. It does not inspect delegates, calendar permissions, group membership, room-panel configuration, transport rules, or time-zone/work-hours settings. The reference may itself be wrong. Test the relevant booking/privacy workflow with synthetic meetings before proposing changes.

Actual collected output contains resource addresses and configuration details. Store it in the firm's approved evidence location; do not add it to this example repository. Raw source scripts, session data, tenant identifiers, and real room configuration were not included in this adaptation.

## Validation

```powershell
pwsh -NoLogo -NoProfile -File work-samples/config-scripts/tests/Test-RoomCalendarComparison.ps1
```

**13 local checks passed on PowerShell 7.6.4**, including parser validation, offline output, false/missing values, failed reference, duplicate/malformed inputs, JSON output, wrong-tenant rejection, and scoped mocked collection. The mocked tests call no external service. No tenant connection or configuration change was made; actual Exchange module integration remains untested.
