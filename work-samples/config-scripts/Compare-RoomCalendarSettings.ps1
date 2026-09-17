#Requires -Version 7.0
<#
.SYNOPSIS
Compare selected resource mailbox calendar settings without changing them.
.DESCRIPTION
Defaults to fictional offline data. Optional connected mode uses a previously
established, single-tenant Exchange Online session and explicit room addresses.
The script does not connect, install modules, disconnect, or change settings.
Matching a reference is a comparison result, not a security recommendation.
#>
[CmdletBinding(DefaultParameterSetName = 'Offline')]
param(
    [Parameter(ParameterSetName = 'Offline')]
    [string]$InputPath = (Join-Path $PSScriptRoot 'rooms.example.json'),

    [Parameter(Mandatory, ParameterSetName = 'Connected')]
    [switch]$UseExistingConnection,

    [Parameter(Mandatory, ParameterSetName = 'Connected')]
    [ValidateNotNullOrEmpty()]
    [string[]]$RoomIdentity,

    [Parameter(Mandatory, ParameterSetName = 'Connected')]
    [guid]$ExpectedTenantId,

    [Parameter(Mandatory)]
    [ValidateNotNullOrEmpty()]
    [string]$ReferenceRoom,

    [switch]$Json
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$fields = [ordered]@{
    AutomateProcessing = 'string'
    BookingWindowInDays = 'integer'
    MaximumDurationInMinutes = 'integer'
    AllowRecurringMeetings = 'boolean'
    AllBookInPolicy = 'boolean'
    ProcessExternalMeetingMessages = 'boolean'
    DeleteSubject = 'boolean'
    AddOrganizerToSubject = 'boolean'
    DeleteComments = 'boolean'
    RemovePrivateProperty = 'boolean'
}

function Confirm-ExplicitAddress {
    param([string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value) -or $Value -match '[\s*?<>]') {
        throw 'Use an explicit resource email address, without display names or wildcards.'
    }
    try { $parsed = [System.Net.Mail.MailAddress]::new($Value) }
    catch { throw 'Invalid resource email address.' }
    if ($parsed.Address -ine $Value -or $Value -notmatch '@[^@]+\.[^@]+$') {
        throw 'Use a complete resource email address.'
    }
}

Confirm-ExplicitAddress $ReferenceRoom
if ($PSCmdlet.ParameterSetName -eq 'Connected') {
    if (-not $UseExistingConnection -or $ExpectedTenantId -eq [guid]::Empty) {
        throw 'Connected mode requires an explicit switch and a nonempty expected tenant ID.'
    }
    if ($RoomIdentity.Count -lt 2 -or $RoomIdentity.Count -gt 50) {
        throw 'Specify between 2 and 50 resource addresses, including the reference.'
    }
    $seenInput = @{}
    foreach ($room in $RoomIdentity) {
        Confirm-ExplicitAddress $room
        if ($seenInput.ContainsKey($room)) { throw 'Duplicate resource address.' }
        $seenInput[$room] = $true
    }
    if (-not $seenInput.ContainsKey($ReferenceRoom)) { throw 'The reference must be in RoomIdentity.' }
    foreach ($command in @('Get-ConnectionInformation', 'Get-EXOMailbox', 'Get-CalendarProcessing')) {
        if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
            throw 'Required Exchange Online commands are unavailable. No installation or connection was attempted.'
        }
    }
    $connections = @(Get-ConnectionInformation -ErrorAction Stop | Where-Object { $_.State -eq 'Connected' })
    if ($connections.Count -ne 1) { throw 'Use a dedicated PowerShell process with exactly one connected Exchange Online session.' }
    $connection = $connections[0]
    if ([guid]$connection.TenantID -ne $ExpectedTenantId -or $connection.IsEopSession -eq $true -or -not [string]::IsNullOrEmpty([string]$connection.ModulePrefix)) {
        throw 'The active session is not the expected unprefixed Exchange Online tenant session.'
    }
    $rooms = @(
        foreach ($room in $RoomIdentity) {
            try {
                $mailbox = @(Get-EXOMailbox -PrimarySmtpAddress $room -Properties Guid,RecipientTypeDetails,PrimarySmtpAddress -ErrorAction Stop)
                if ($mailbox.Count -ne 1 -or [string]$mailbox[0].PrimarySmtpAddress -ine $room -or [string]$mailbox[0].RecipientTypeDetails -notin @('RoomMailbox', 'EquipmentMailbox')) {
                    throw 'The selected address did not resolve to exactly one resource mailbox.'
                }
                $resolvedId = [guid]$mailbox[0].Guid
                if ($resolvedId -eq [guid]::Empty) { throw 'Resolved mailbox has no valid GUID.' }
                $processing = @(Get-CalendarProcessing -Identity $resolvedId.ToString() -ResultSize 2 -ErrorAction Stop)
                if ($processing.Count -ne 1) { throw 'Calendar processing returned an unexpected number of records.' }
                $settings = [ordered]@{}
                foreach ($field in $fields.Keys) {
                    $property = $processing[0].PSObject.Properties[$field]
                    $settings[$field] = if ($null -eq $property) { $null } else { $property.Value }
                }
                [ordered]@{ identity = $room; retrieval_status = 'complete'; settings = $settings }
            }
            catch {
                # Do not copy exception payloads or session identifiers into the result.
                [ordered]@{ identity = $room; retrieval_status = 'error'; settings = $null }
            }
        }
    )
    $data = @{
        schema_version = 1
        fictional = $false
        captured_at = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
        rooms = $rooms
    }
}
else {
    $data = Get-Content -LiteralPath $InputPath -Raw | ConvertFrom-Json -AsHashtable
}

if ($data.schema_version -ne 1 -or $data.fictional -isnot [bool] -or $data.rooms -isnot [array]) {
    throw 'Invalid snapshot: schema_version 1, explicit fictional flag, and rooms array are required.'
}
if ($data.rooms.Count -lt 2 -or $data.rooms.Count -gt 50) { throw 'Snapshot must contain between 2 and 50 rooms.' }
$captureDate = [datetime]::MinValue
$captureText = if ($data.captured_at -is [datetime]) { $data.captured_at.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ') } else { [string]$data.captured_at }
if (-not [datetime]::TryParseExact($captureText, 'yyyy-MM-ddTHH:mm:ssZ', [cultureinfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::AssumeUniversal, [ref]$captureDate)) {
    throw 'captured_at must be a valid UTC timestamp with seconds.'
}
$byIdentity = @{}
foreach ($room in $data.rooms) {
    Confirm-ExplicitAddress $room.identity
    if ($byIdentity.ContainsKey($room.identity)) { throw 'Duplicate resource identity in snapshot.' }
    if ($room.retrieval_status -notin @('complete', 'error')) { throw 'Invalid retrieval_status.' }
    if ($room.retrieval_status -eq 'complete') {
        if ($room.settings -isnot [System.Collections.IDictionary]) { throw 'A complete retrieval needs a settings object.' }
        foreach ($field in $fields.Keys) {
            $value = $room.settings[$field]
            if ($null -eq $value) { continue }
            switch ($fields[$field]) {
                'boolean' { if ($value -isnot [bool]) { throw "Invalid boolean setting: $field" } }
                'integer' { if (($value -isnot [int] -and $value -isnot [long]) -or $value -lt 0) { throw "Invalid nonnegative integer setting: $field" } }
                'string' { if ($value -notin @('None', 'AutoUpdate', 'AutoAccept')) { throw 'Invalid AutomateProcessing value.' } }
            }
        }
    }
    $byIdentity[$room.identity] = $room
}
if (-not $byIdentity.ContainsKey($ReferenceRoom)) { throw 'Reference room is absent from the snapshot.' }
$reference = $byIdentity[$ReferenceRoom]
$counts = [ordered]@{ matches_reference = 0; differs = 0; unknown = 0 }
$comparisons = @(
    foreach ($room in $data.rooms) {
        if ($room.identity -ieq $ReferenceRoom) { continue }
        foreach ($field in $fields.Keys) {
            $referenceValue = if ($reference.retrieval_status -eq 'complete') { $reference.settings[$field] } else { $null }
            $roomValue = if ($room.retrieval_status -eq 'complete') { $room.settings[$field] } else { $null }
            $status = if ($null -eq $referenceValue -or $null -eq $roomValue) { 'unknown' }
                elseif ($referenceValue -ceq $roomValue) { 'matches_reference' }
                else { 'differs' }
            $counts[$status]++
            [pscustomobject]@{
                room = $room.identity
                setting = $field
                reference_value = $referenceValue
                observed_value = $roomValue
                status = $status
            }
        }
    }
)
$result = [pscustomobject]@{
    schema_version = 1
    fictional = $data.fictional
    captured_at = $captureText
    reference_room = $ReferenceRoom
    method = 'Read-only comparison to a selected reference; matching is not a policy recommendation.'
    counts = $counts
    retrieval_errors = @($data.rooms | Where-Object { $_.retrieval_status -eq 'error' } | ForEach-Object { $_.identity })
    comparisons = $comparisons
}
if ($Json) { $result | ConvertTo-Json -Depth 8 } else { $result }
