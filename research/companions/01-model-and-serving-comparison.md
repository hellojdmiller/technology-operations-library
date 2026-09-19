# Model and serving comparison

Purpose: determine whether an accessible configuration improves an actual workflow. This is a proposed evaluation, not a hardware benchmark.

**Decision / owner / date:** [fill in]

**Task / permitted use / quality criteria / consequence of failure:** [fill in]

**Baseline / task selection / participant experience / comparison method:** [fill in]

## Configuration record

Use `model-service-comparison.csv`. Keep these details with every run:

| Field | Record |
| --- | --- |
| Provider and product | Service, plan, endpoint, region where known, and date checked. |
| Availability | Announced / benchmarked / trial access / accessible production service / unknown. Include evidence. |
| Model identity | Requested alias and resolved version if available. Record unknown rather than assume they are identical. |
| Serving platform | Hardware/platform if disclosed, evidence date, and whether it is a claim or observed configuration. |
| Inference settings | Reasoning budget, output limit, sampling settings, cache condition, concurrency, and tool configuration. |
| Evidence and context | Source versions, supplied/retrieved material, context method, and approximate input size. |
| Access | Permitted data, tools, identities, actions, and customer access restrictions. |
| Commercial conditions | Currency, date, included usage, billable items, minimum commitments, and quote/invoice source. |

Do not assume that a provider's chip announcement describes the hardware serving your request. A product comparison that also changes the model cannot isolate the chip's contribution.

## Run the comparison

1. Specify expected results and material errors before comparing output.
2. Select matched ordinary and difficult tasks. Randomize order where practical and record learning effects if participants repeat work.
3. Hold the evidence, permissions, and acceptance standard constant. List unavoidable differences.
4. Record time to first response if useful, but also time to a verified usable result. Include prompt preparation, tool waits, retries, queue time, and review.
5. Test realistic input sizes and concurrency. State whether caches are cold, warm, or unknown.
6. Preserve failed, blocked, abandoned, and inconclusive attempts. Use the productivity log for measurements.

**Quality result / sample size / uncertainty:** [fill in]

**Latency and cost observations / measurement coverage:** [fill in]

**Differences that prevent causal attribution:** [fill in]

## Decision

**Recommendation:** keep baseline / larger trial / revise / gather evidence / stop

**Evidence supporting the recommendation:** [fill in]

**Approval status / approved scope / owner / review trigger:** [fill in]

A faster service may be useful even without a better model. A stronger model may save review time despite slower generation. Decide against the complete task and disclose any quality tradeoff. Do not convert vendor performance ratios into a firm-wide productivity forecast.
