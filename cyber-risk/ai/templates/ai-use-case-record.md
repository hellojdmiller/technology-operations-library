# AI use-case review and decision record

> Blank example template. Completion does not imply approval, testing, or implementation. Template reviewed September 17, 2026. Use with the [review guide](../ai-use-case-review.md).

## Request and boundary

| Field | Record |
|---|---|
| Use-case ID / revision / date | |
| Business problem and intended outcome | |
| Users and business sponsor | |
| Technical operator / backup / incident owner | |
| Output reviewer and decision authority | |
| Existing-tool or non-AI alternative considered | |
| Exact provider, product, workspace, account tier, model | |
| Host/client, connector/MCP, skill and application revisions | |
| Allowed input sources and fields | |
| Permitted data classification | |
| Allowed outputs, recipients, and destinations | |
| Allowed tool operations and resource scope | |
| Explicitly prohibited effects | |

The current [AI policy](../../../documentation/policies/ai-acceptable-use.md) prohibits Confidential data. Confirm that this request fits that boundary. An exception cannot authorize Confidential data; an approved revision to that policy and the companion data policy is required first. Do not attach actual prohibited material as review evidence.

## Data and provider evidence

| Topic | Evidence reference / date / applicable account | Finding | Unknown / owner |
|---|---|---|---|
| Contract and permitted use | | | |
| Training / improvement use of inputs, outputs, feedback | | | |
| Prompt, file, index, history and diagnostic retention | | | |
| Deletion scope, timing, backups and exclusions | | | |
| Subprocessors, hosting and connector operators | | | |
| Roles, support access, sharing and audit capability | | | |
| Export, continuity, revocation and exit | | | |

Attach a protected data-flow reference showing each service that receives content. Record legal/contractual determinations by the responsible owner, without inventing requirements or placing raw contracts and secrets into a shared example.

## Risk and controls

| Scenario / consequence | Existing control and observed evidence | Proposed treatment | Owner | Completion condition |
|---|---|---|---|---|
| | | | | |

- Identity and source authorization boundary:
- Tool and destination restrictions:
- Exact action approval mechanism, if any:
- Retry, duplicate, runtime and cost limits:
- Memory/index/update controls:
- Stop method, expected bound, and operator:
- Recovery and destination reconciliation:

## Evaluation evidence

Use applicable cases from the [evaluation playbook](../evaluation-playbook.md). Record simulated, executed, verified, failed, and not-tested states accurately.

| Test ID / fixture revision | Host/model/configuration | Expected result | Actual result | Tool/service evidence | Reviewer / decision |
|---|---|---|---|---|---|
| | | | | | |

- Quality rubric and threshold set before the test:
- Boundary failures or required controls not tested:
- Number of repetitions and variation coverage:
- Changes made after failures and retest references:
- Generalization limits and unverified provider claims:

## Decision and continuing operation

- Outcome: declined / synthetic pilot only / approved within recorded scope / paused pending evidence:
- Decision-maker and recorded date:
- Conditions that must be complete before launch:
- Exact approved data, capabilities, destinations, and duration:
- Residual uncertainty accepted within that scope:
- Reviewer capacity and sampling method:
- Monitoring owner, signals, review window, and limits:
- Stop criteria and protected incident route:
- Expiry and material-change review triggers:
- Export/exit and backup-operator handover reference:

For a shared copy, substitute fictional identifiers and protected evidence references. Do not include credentials, operational tokens, raw sensitive payloads, or an unsupported claim that the workflow is secure or compliant.
