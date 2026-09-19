# Import and inspect the change-review workflow in n8n

A green execution indicator tells me the graph ran. I still need to read the output to know whether the change packet is ready for a human decision. This walkthrough keeps those two checks separate.

**Prepared September 19, 2026.** The library's [pinned CLI lab](../labs/n8n-runtime/README.md) has already exercised the fictional graph in n8n 2.39.8. This editor walkthrough is ready to perform in an authorized disposable instance. The observed editor check reached owner setup; **UI import and manual UI execution have not been completed**.

## Before opening the editor

Use a separate test instance with no live credentials, data, or integrations. Finish its owner setup yourself. This guide does not require a paid plan, a publicly reachable instance, a course registration, or access to a firm tenant. Vendor Academy exercises may have different requirements.

Use the [official Docker installation guide](https://docs.n8n.io/deploy/host-n8n/install-options/install-with-docker) if you need an instance. Record its actual version. The existing [runtime lab](../labs/n8n-runtime/README.md#run-the-lab) provides the image digest tested here; a newer version is a new trial. Bind a local instance to loopback, choose an unused port, and use disposable storage. Disabling diagnostics is not proof of network isolation. Keep setup credentials and screenshots containing account details outside this repository.

Download the repository's [workflow.json](../n8n/change-readiness-review/workflow.json), then inspect it before importing. It should contain exactly these nodes:

1. `Run example`: Manual Trigger.
2. `Fictional sample data`: JavaScript Code, supplying one fictional packet.
3. `Change readiness review`: JavaScript Code, evaluating that packet.

It has no credentials, network request, scheduled trigger, notification, deployment, or other downstream action. It is exported inactive. Compare it with the readable [input](../n8n/change-readiness-review/sample-input.json) and [evaluator](../n8n/change-readiness-review/evaluate.js); do not substitute unreviewed third-party code.

## Import, predict, execute, inspect

1. Open a new workflow in your disposable instance. In the upper-right workflow menu choose **Import from File**, then select the reviewed JSON. This route is documented in the current [official import instructions](https://docs.n8n.io/build/manage-workflows/export-and-import).
2. Confirm all three node names, connections and Code-node contents. Record the workflow name/version and that it is inactive or unpublished. Do not publish or attach a production trigger.
3. Before executing, write your prediction: three rows, two needing attention, and no approved change. Explain why the complete normal-change packet still needs a decision.
4. Run the workflow manually. Check that the trigger and both Code nodes actually ran, rather than inferring execution from saved or pinned output. Record the execution reference/time.
5. Open `Change readiness review` and inspect its JSON output. Compare the packet and every row with the table below. A successful execution with `needs_review` is the intended fixture outcome.
6. Preserve the actual output and compare it with the [local demonstration](change-readiness-review.md#run-the-local-demonstration). Label a mismatch unresolved; do not alter the expected result to make the trial pass.

| Check | Expected output from the canonical fixture |
|---|---|
| Packet | `status: needs_review`, `totalRows: 3`, `attentionCount: 2` |
| `EX-CHG-001` | `packet_complete_for_review`; no detected metadata gaps |
| `EX-CHG-002` | `needs_review`; `standard_model_not_matched` and `standard_model_expired` |
| `EX-CHG-003` | `manual_emergency_review`; `pilotEvidenceRef_missing` and `manual_emergency_review` |
| Every row | `decision: pending_human_review` |

## One failure exercise at a time

Work in a copy and restore the canonical fictional input between trials. Edit only the `Fictional sample data` node, preserving its return/item wrapper.

| Change to the first request, `EX-CHG-001` | Prediction to check |
|---|---|
| Set `authorizationEvidenceRef` to `null` while `authorizationVerified` remains `true` | The first row now needs review and reports the missing pointer. An unsupported true assertion cannot clear the gap. |
| Replace boolean `scopeConfirmed: true` with the string `"true"` | The packet is `invalid_input`; do not treat malformed data as a partial success. |
| Restore valid input, then set `changeType` to `emergency` | The first row is routed to `manual_emergency_review`; the evaluator cannot authorize an emergency. |

Inspect actual output, not only a toast. Record a result only after running that particular variant. These are proposed UI exercises, not records of completed runs. The existing CLI lab separately covers canonical, malformed and incomplete-evidence cases; it does not certify this sequence of UI interactions.

## Record and explain the result

Use the [training record](../training/training-record-template.md). Capture source revision/hash, runtime, delivery method (`editor file import`), predictions, actual execution reference, exact output differences, and what remains unknown. Have another person answer:

- Why can `packet_complete_for_review` never trigger deployment automatically?
- What does a referenced approval document establish when this evaluator never fetches it?
- What would a real collector need to establish before setting `snapshotComplete: true`?

Correct explanation, observed graph execution, vendor course completion, and permission to change a live system are separate outcomes.

When finished, remove only your disposable instance and its test storage. Keep the sanitized trial record; do not remove unrelated containers or environments.

## Observed editor boundary and sources

On September 19, a fresh container using the pinned n8n 2.39.8 image served `http://localhost:15678/setup`. Browser inspection showed the owner email/name/password setup form. The check stopped there without entering a new credential or completing account setup. No workflow was imported or run through the UI. The named test container and in-memory storage were removed, and removal was verified. See the [dated observation](n8n-editor-observation-2026-09-19.json).

Official [Docker installation](https://docs.n8n.io/deploy/host-n8n/install-options/install-with-docker), [workflow import](https://docs.n8n.io/build/manage-workflows/export-and-import), and [server-contact configuration](https://docs.n8n.io/deploy/host-n8n/configure-n8n/basic-configuration/configuration-examples/isolate-n8n) were read September 19, 2026. Their publication dates were not supplied. Earlier `/hosting/installation/docker` and `/workflows/export-import` paths returned not-found pages, so this edition uses the paths in the current official documentation index. The proposed exercise and expected outputs are original library material; no vendor course or video content is reproduced.

[Return to the walkthroughs](README.md) · [Vendor learning paths](../training/README.md)
