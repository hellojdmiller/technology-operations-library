# Prompt for code and automation someone can operate

Describe the behavior, operating boundary, and verification method before asking for code. A script that produces output on one sample can still mishandle missing data, change the wrong account, or report success before an external system finishes the work.

## Give the assistant a bounded implementation task

```text
Build an offline Node.js tool that reads the supplied synthetic renewal JSON
and lists records requiring review. Use the repository's existing patterns.
Do not add external services or packages unless necessary and explained.
Never invent a missing renewal date or owner. Reject malformed dates and
duplicate record IDs. Keep unknown records visible in the output.
Add meaningful tests for the ordinary case and the identified failure cases.
Run the relevant checks and report what was actually verified.
Do not connect to accounts, send messages, or change subscriptions.
```

For an existing codebase, ask the agent to inspect its instructions, architecture, current changes, and nearest relevant implementation. Name the exact bug or feature, expected behavior, scope of edits, and acceptance checks. Preserve unrelated user changes. A repository-aware agent can make local edits only if the host supplies that capability and permission.

## Make failure behavior part of the request

For an integration, specify pagination, identity matching, empty results, rate limits, retries, timeouts, and partial failure where relevant. Define what makes a retry safe. If an action can be submitted twice, require a design for duplicate prevention or reconciliation. An ambiguous response should not trigger an unlimited repeat of a consequential action.

Separate credentials from code and examples. Ask for placeholders and a supported secret-injection method. Do not paste a credential so the assistant can “make the example realistic.” Define the destination tenant or subscription outside the sample, then require explicit verification before real execution.

## Prompt for a useful n8n workflow

Specify the input contract, trigger, sources, transformation, review point, allowed action, and final evidence. For a library sample, a manual trigger with fictional input is often easier to review than a live schedule. Ask for readable evaluation logic, sample input, expected results, version assumptions, and instructions to import into an isolated instance.

Ask which errors should fail execution and which business exceptions should become review records. A missing owner may be a review item while unreadable input is a processing failure. An export that parses as JSON is not proof that its nodes import and run in the intended n8n version. See [the workflow library](../n8n/README.md).

## Require a practical handover

The output should state what changed, how to run the local sample, what evidence the checks produced, how failure appears, and what remains untested. Include operating ownership, inputs and outputs, dependencies, and recovery or rollback boundaries. A brief explanation of a meaningful design tradeoff is more useful than a line-by-line narration.

Ask for tests that challenge behavior: missing records, future dates, incorrect scope, unsupported fields, and permission failures. Do not ask for large test suites that merely repeat implementation details. Verify only the relevant layers, then broaden when a failure or unresolved concern justifies it.

## Distinguish validation stages

Syntax checks show that a file can be parsed. Unit tests show selected local behavior. Integration tests show interaction between identified components. A deployment preview shows proposed changes under particular permissions. A production result needs independent observation in the system of record. Report the stage reached explicitly.

Try the [work samples](../work-samples/README.md) and [automation handover](../documentation/automation-handover-template.md). Their local test evidence does not establish readiness for a real tenant.
