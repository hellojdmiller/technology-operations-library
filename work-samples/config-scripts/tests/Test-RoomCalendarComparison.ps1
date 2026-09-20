#Requires -Version 7.0
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'Compare-RoomCalendarSettings.ps1'
$samplePath = Join-Path (Split-Path $PSScriptRoot -Parent) 'rooms.example.json'
$script:passed = 0
function Assert-That([bool]$Condition, [string]$Message) { if (-not $Condition) { throw $Message } }
function Test-Case([string]$Name, [scriptblock]$Action) {
    & $Action
    $script:passed++
    Write-Host "PASS $Name"
}
function Test-Fails([scriptblock]$Action, [string]$Pattern) {
    $failed = $false
    try { & $Action | Out-Null }
    catch { $failed = $true; Assert-That ($_.Exception.Message -match $Pattern) "Unexpected error: $($_.Exception.Message)" }
    Assert-That $failed 'Expected an error.'
}
function With-Snapshot([scriptblock]$Edit, [scriptblock]$Check) {
    $snapshot = Get-Content -LiteralPath $samplePath -Raw | ConvertFrom-Json -AsHashtable
    & $Edit $snapshot
    $temporaryPath = [IO.Path]::GetTempFileName()
    try {
        $snapshot | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $temporaryPath
        & $Check $temporaryPath
    }
    finally { Remove-Item -LiteralPath $temporaryPath -Force }
}

Test-Case 'PowerShell parser accepts the script' {
    $parseTokens = $null; $parseErrors = $null
    $null = [System.Management.Automation.Language.Parser]::ParseFile($scriptPath, [ref]$parseTokens, [ref]$parseErrors)
    Assert-That ($parseErrors.Count -eq 0) 'Parse errors found.'
}
Test-Case 'offline sample preserves differences and failed retrievals' {
    $result = & $scriptPath -ReferenceRoom 'cedar@example.invalid'
    Assert-That ($result.fictional -eq $true) 'Sample must remain fictional.'
    Assert-That ($result.counts.matches_reference -eq 8 -and $result.counts.differs -eq 2 -and $result.counts.unknown -eq 10) 'Unexpected counts.'
    Assert-That ($result.retrieval_errors.Count -eq 1) 'Failed retrieval must remain visible.'
}
Test-Case 'false is an observed value, not a missing one' {
    $result = & $scriptPath -ReferenceRoom 'cedar@example.invalid'
    $row = $result.comparisons | Where-Object { $_.room -eq 'oak@example.invalid' -and $_.setting -eq 'ProcessExternalMeetingMessages' }
    Assert-That ($row.status -eq 'matches_reference' -and $row.observed_value -eq $false) 'False value lost.'
}
Test-Case 'a missing property is unknown' {
    With-Snapshot { param($s) $s.rooms[1].settings.Remove('DeleteComments') } {
        param($p)
        $r = & $scriptPath -InputPath $p -ReferenceRoom 'cedar@example.invalid'
        Assert-That ($r.counts.unknown -eq 11) 'Missing property was treated as known.'
    }
}
Test-Case 'failed reference makes every comparison unknown' {
    With-Snapshot { param($s) $s.rooms[0].retrieval_status = 'error'; $s.rooms[0].settings = $null } {
        param($p)
        $r = & $scriptPath -InputPath $p -ReferenceRoom 'cedar@example.invalid'
        Assert-That ($r.counts.unknown -eq 20) 'Failed reference did not propagate unknown state.'
    }
}
Test-Case 'duplicate identities are rejected' {
    With-Snapshot { param($s) $s.rooms[1].identity = $s.rooms[0].identity } {
        param($p) Test-Fails { & $scriptPath -InputPath $p -ReferenceRoom 'cedar@example.invalid' } 'Duplicate'
    }
}
Test-Case 'boolean-like strings are rejected' {
    With-Snapshot { param($s) $s.rooms[1].settings.DeleteSubject = 'false' } {
        param($p) Test-Fails { & $scriptPath -InputPath $p -ReferenceRoom 'cedar@example.invalid' } 'boolean'
    }
}
Test-Case 'absent reference and wildcard identities are rejected' {
    Test-Fails { & $scriptPath -ReferenceRoom 'missing@example.invalid' } 'absent'
    Test-Fails { & $scriptPath -ReferenceRoom '*@example.invalid' } 'explicit'
}
Test-Case 'JSON output parses and keeps sample timestamp' {
    $r = & $scriptPath -ReferenceRoom 'cedar@example.invalid' -Json | ConvertFrom-Json
    Assert-That ($r.comparisons.Count -eq 20 -and $r.fictional) 'Malformed JSON result.'
}
Test-Case 'script contains only the three scoped Exchange getter commands' {
    $source = Get-Content -LiteralPath $scriptPath -Raw
    Assert-That ($source -notmatch '\b(Connect-ExchangeOnline|Disconnect-ExchangeOnline|Install-Module|Set-CalendarProcessing|Get-DistributionGroup|Get-MailboxFolderPermission)\b') 'Unexpected live operation.'
}

# Stub the external command boundary. These tests never load or contact Exchange.
$global:tolGetterCalls = 0
$global:tolTestTenant = '00000000-0000-4000-8000-000000000001'
function Get-ConnectionInformation {
    [CmdletBinding()]param()
    [pscustomobject]@{ State = 'Connected'; TenantID = $global:tolTestTenant; IsEopSession = $false; ModulePrefix = '' }
}
function Get-EXOMailbox {
    [CmdletBinding()]param([string]$PrimarySmtpAddress, [string[]]$Properties)
    $global:tolGetterCalls++
    [pscustomobject]@{ PrimarySmtpAddress = $PrimarySmtpAddress; RecipientTypeDetails = 'RoomMailbox'; Guid = '00000000-0000-4000-8000-000000000002' }
}
function Get-CalendarProcessing {
    [CmdletBinding()]param([string]$Identity, [int]$ResultSize)
    $global:tolGetterCalls++
    [pscustomobject]@{ AutomateProcessing = 'AutoAccept'; BookingWindowInDays = 180; MaximumDurationInMinutes = 120; AllowRecurringMeetings = $true; AllBookInPolicy = $true; ProcessExternalMeetingMessages = $false; DeleteSubject = $true; AddOrganizerToSubject = $true; DeleteComments = $true; RemovePrivateProperty = $false }
}
Test-Case 'wrong tenant fails before resource getters' {
    Test-Fails {
        & $scriptPath -UseExistingConnection -RoomIdentity 'cedar@example.invalid','oak@example.invalid' -ExpectedTenantId '00000000-0000-4000-8000-000000000009' -ReferenceRoom 'cedar@example.invalid'
    } 'expected'
    Assert-That ($global:tolGetterCalls -eq 0) 'Wrong tenant allowed a query.'
}
Test-Case 'connected mode queries only explicit resources through mocked getters' {
    $r = & $scriptPath -UseExistingConnection -RoomIdentity 'cedar@example.invalid','oak@example.invalid' -ExpectedTenantId $global:tolTestTenant -ReferenceRoom 'cedar@example.invalid'
    Assert-That ($global:tolGetterCalls -eq 4) 'Unexpected getter count.'
    Assert-That ($r.counts.matches_reference -eq 10 -and $r.counts.unknown -eq 0 -and -not $r.fictional) 'Unexpected mock comparison.'
}
Test-Case 'offline mode never invokes the available mocked getters' {
    $before = $global:tolGetterCalls
    $null = & $scriptPath -ReferenceRoom 'cedar@example.invalid'
    Assert-That ($before -eq $global:tolGetterCalls) 'Offline mode made a getter call.'
}
Write-Host "$script:passed checks passed. No tenant connection was made."
