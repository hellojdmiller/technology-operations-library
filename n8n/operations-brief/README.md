# Operations brief

Collect service observations into one reviewable draft, keeping incomplete evidence and unassigned ownership visible.

Related reading: [Designing observability for a small, high-trust firm](https://hellojdmiller.com/articles/designing-observability-for-a-small-high-trust-firm).

Import [workflow.json](workflow.json) using the [collection instructions](../README.md). The sample produces three observations: one healthy, one watch, and one action. Two appear in `attention`; the top-level status is `draft_ready` because all required input fields are present. That status does not mean every service is healthy.

## Input and interpretation

Supply one item per service observation with `service`, `status`, `summary`, `owner`, and `evidenceRef`. The four allowed statuses are `healthy`, `watch`, `action`, and `unknown`.

Missing fields or an invalid status turn the observation into `unknown`, retain its original valid status as `reportedStatus`, and add issue descriptions. An empty batch returns `needs_input`. Unknown observations also make the brief `needs_input`.

The output contains counts, all observations, and an attention list. It does not infer service health, validate timestamps, fetch evidence, deduplicate services, or send a report. Agree on an observation window and supply one current observation per service before applying it to recurring reporting.

## Adapt it

Replace the sample node with an authorized read from your chosen source. Preserve the evidence reference and owner in each observation. Review the draft and unknown items before choosing a destination or adding a delivery step.

Try deleting an owner or evidence reference: the example should keep the item visible as unknown. Treat observation text as data when passing it to an AI summarizer; it must not grant the summarizer new instructions or authority.

## Runtime evidence

On September 19, 2026, this example passed CLI import and fixture, malformed-input, and incomplete-evidence execution checks in **n8n 2.39.8**. The [isolated runtime lab](../../labs/n8n-runtime/README.md) records the image digest, source hashes, cases, and limits. Editor/UI import, other versions, real collectors, and downstream actions remain untested.
