# A reproducible n8n runtime lab

Import the library's ten workflow exports into a disposable n8n instance, run their fictional inputs, and inspect both execution state and review output. This closes the gap between testing JavaScript locally and observing the exported graph inside n8n.

The lab pins **n8n 2.39.8 by image digest**, uses CLI import/execution, and leaves every workflow inactive. It publishes no ports, has no external network, mounts only staged fictional workflows and lab code, and stores the database in temporary memory. It never connects to an existing n8n instance or uses tenant credentials.

## Run the lab

Requirements: Node.js 22 or later on the host and a running Docker Engine or Docker Desktop. No npm packages are required. From the repository root:

```sh
docker pull docker.n8n.io/n8nio/n8n@sha256:b73045abaddb40cb4024e86eea1b1f69093501a7339f685a4cd486b7743d23ae
node labs/n8n-runtime/run.mjs
```

The pull downloads the official image. Execution then runs with Docker networking disabled, two CPUs, and a 2 GiB memory limit. The image's manifest digest supports platform-specific images; the report records the actual architecture and local image ID. [image.json](image.json) records the version and digest.

The command prints each case result and writes a dated directory under ignored `local-results/n8n-runtime/` containing:

- `report.json`: source and harness hashes, version, architecture, inactive import count, individual results, warnings, and timestamps.
- `runner.log`: the lab's diagnostic output, including the structured report.
- `cleanup.json`: whether the named lab container and staged input were removed.

A failed assertion, missing report, incomplete run, or unverified cleanup exits nonzero. The runner attempts cleanup on completion, failure, and interruption. If Docker is unavailable during cleanup, it reports the exact container name and retains staged input for investigation. After an abrupt host crash, inspect containers named `vcpeit-n8n-lab-*`; do not remove unrelated containers.

## What the 32 cases establish

| Cases | Check |
|---|---|
| Ten canonical fixtures | The imported three-node graph executes and its JSON payload matches the local evaluator reference. |
| Ten malformed inputs | Invalid business input produces the documented review status instead of an invented valid result. |
| Ten incomplete-evidence inputs | Missing evidence or ownership stays explicit; the eight packet-based reviews also retain incomplete-snapshot findings. |
| One zero-item source | n8n completes the execution without running the review node. This is recorded as `evaluator_not_executed`, with no business review result. |
| One deliberate technical failure | The final node and execution must report the exact expected error; a CLI exit code alone cannot establish success. |

The last two cases use derived copies of `automation-result-review`. Each case receives a lab-only ID and name. Fixture cases retain the exported input/evaluator code and connections; variants replace only the sample input or, for the deliberate error, the evaluator. Source workflow files are never changed by the lab. Import is independently checked by exporting all staged workflows and verifying their IDs, inactive state, nodes, and connections before execution.

The reference comparison runs the same evaluator outside n8n, **inside the isolated container**. It checks integration parity, not an independent proof of business correctness. The existing evaluator unit tests remain necessary. Additional declared status/evidence checks prevent reference parity from being the only assertion.

`PASS` means the observed behavior matches that case's expectation. A `needs_review` business result is expected for most fixtures. An expected technical failure is a passing negative test, not a successful business execution. Missing review output is accepted only in the explicitly labeled zero-item case.

## Observed validation

The September 19, 2026 local run completed **32/32 cases across ten source workflows**, using n8n 2.39.8 on Linux arm64 in Docker. See the [dated machine-readable result](validation-2026-09-19.json) and [repository validation record](../../VALIDATION.md). The result identifies source hashes and the exact harness used; it does not imply that every later revision has been tested.

The image reported Node.js v26.7.0. Its unavailable Python runner and experimental localStorage warning were recorded. Every workflow in this collection uses JavaScript Code nodes, and those cases passed. Python nodes are not covered.

This lab uses the **internal JavaScript task runner for a disposable test**. It is not a production n8n deployment template. It does not test editor/UI import, n8n Cloud, other versions, external task runners, real collectors, authorization, pagination, retries against providers, credential storage, production retention, or downstream actions. The repository's mocked incomplete-input cases do not establish that a real collector will detect incompleteness.

## Checks and maintenance

```sh
node --test labs/n8n-runtime/tests/*.test.mjs
node --test tests/*.test.mjs
```

The harness tests check missing/ambiguous execution output, skipped nodes, mismatched payloads, and the distinction between expected and unexpected errors. GitHub Actions also runs the container lab on the pinned image. Inspect the actual run for the commit being reviewed; a prior result is historical evidence.

To update n8n, choose an official release and verify its tag/version and immutable image digest. Update `image.json`, the pull command above, and CI together; run the entire lab and review warnings and changed outcomes before updating validation claims. Preserve evidence from the previous edition when it still explains a limitation. If a workflow changes, rerun its local tests and the lab; do not edit an observed report to make new code appear tested.

The CLI commands used here are confirmed through the pinned image's `import:workflow --help`, `export:workflow --help`, and actual `execute --id=… --rawOutput` runs. The upstream [execute command implementation](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/commands/execute.ts) explains why the lab imports first and inspects structured execution data. This source link can change; the runtime pin and recorded checks are the reproducibility boundary.

[Browse the workflows](../../n8n/README.md) · [Change-readiness walkthrough](../../showcase/change-readiness-review.md)
