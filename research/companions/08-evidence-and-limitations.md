# Evidence and limitations

Research initially reviewed September 18, 2026; agent-security guidance added and reviewed September 19, 2026. This ledger accompanies *Beyond the model frontier* and its working companions. It records what each source supports and where I would stop the inference. The addendum does not change the original review dates of the other entries.

These worksheets are proposed operating methods. The fictional example demonstrates recordkeeping and arithmetic; it does not validate the framework or report a real experiment. The paper is a focused conceptual review, not a systematic review.

## How I would use the evidence

- Treat vendor releases as evidence of what a vendor reports. Independently test the service and configuration available to the firm before making a workflow decision.
- Keep availability stages separate: announced, benchmarked, accessible for trial, and available in the required production environment.
- Preserve study design, population, task, revision, and uncertainty when translating a finding into a local question. A result for one task does not establish a universal productivity effect.
- Separate human learning, inference-time context problems, and training-data degradation. The exercises here observe workflow behavior and retained understanding; they do not test model-weight collapse or diagnose cognitive decline.
- Record contrary results and missing observations. The proposed tests can weaken the paper's propositions as well as support them.

Refresh market availability and document versions before a consequential decision. The review date is a snapshot, not a promise that a product or claim remains unchanged.

## Source and claim ledger

| Source | Date / evidence | Supported use and limit |
| --- | --- | --- |
| [Claude Fable/Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) | September 1, 2026; vendor release | Access/safeguard distinctions and cache-read pricing direction. No independent productivity comparison. |
| [Gemini 3.8 Flash/Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) | September 2, 2026; vendor release | General and specialized offerings. Reported benchmarks are not a common test with other rows. |
| [GPT-6 Astra system card](https://deploymentsafety.openai.com/gpt-6-astra) | September 3; revised September 9, 2026 | Capability and safety reporting also identifies limits to monitoring and generalization. No claim of universal reliability. |
| [DeepSeek change log](https://api-docs.deepseek.com/updates/) | September 10, 2026 entry | V4.1 Flash release and legacy API-name rerouting. Do not assume an unchanged alias identifies an unchanged model. |
| [Anthropic AI-development measurements](https://www.anthropic.com/institute/measuring-pace-of-ai-development) | September 17, 2026; internal August measurements | Vendor self-assessment; supervised work and evaluator dependence remain explicit. |
| [Rubin architecture](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/) | July 21, 2026; vendor technical account | Memory, communication, and inference design. Not an end-user productivity measurement. |
| [Rubin production ramp](https://nvidianews.nvidia.com/news/vera-rubin-full-production-agentic-ai-factory) | May 31, 2026; vendor announcement | Production status as reported then. Does not establish a buyer's allocation or service availability. |
| [TPU 8t/8i architecture](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive) | April 22, 2026; vendor technical account | Specialized architecture directions. Customer availability is not asserted. |
| [AMD/Cerebras](https://investors.cerebras.ai/news-releases/news-release-details/amd-and-cerebras-announce-industry-leading-ultra-low-latency-and) | July 23, 2026; announced partnership | Division of prompt processing and token generation. Headline efficiency claim omitted; no claim that deployment is complete. |
| [Jalapeño first results](https://openai.com/index/jalapeno-first-results/) | August 25, 2026; vendor benchmark account | Working hardware and measured results, with deployment still described as planned. No direct conversion to firm productivity. |
| [Photonic on-chip backpropagation](https://www.nature.com/articles/s41586-026-10262-8) | March 18, 2026; Nature paper, publisher abstract inspected | Two nonlinear classification tasks. Full-text access was unreliable; no frontier-model scale, commercial readiness, or efficiency extrapolation. |
| [Million-token context](https://claude.com/blog/1m-context-ga) | March 13, 2026; vendor announcement | Historical capacity milestone for named models, not a claim about the current leading model. |
| [Context rot](https://arxiv.org/html/2606.29718v2) | June 29; revised August 4, 2026; preprint | Four open models in deep-search settings. Closed-model and other-domain generalization remains unestablished. |
| [Critical thinking and confidence](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) | CHI 2025; observational survey | Reported effort and associations. Not a longitudinal cognitive assessment. |
| [Coding-skill formation](https://www.anthropic.com/research/AI-assistance-coding-skills) | January 2026; randomized experiment | Immediate learning, 52 participants, unfamiliar library. The 50% versus 67% difference is 17 percentage points. |
| [Generative AI at Work](https://arxiv.org/abs/2304.11771) | November 2024 revision; workplace field study | Positive support-work effects and heterogeneity. Do not apply the average to all knowledge work. |
| [LLMs Can Get Brain Rot](https://arxiv.org/html/2510.13928v2) | April 22, 2026 revised preprint | Controlled continual pre-training, four small models, corrected data. Ordinary chat is not the studied training intervention. |
| [Recursive-data collapse](https://www.nature.com/articles/s41586-024-07566-y) | July 2024; Nature paper, subsequently corrected | Training feedback mechanism; not a claim that every use of synthetic data inevitably degrades a model. |
| [Real and synthetic data accumulation](https://arxiv.org/abs/2404.01413) | April 2024; research paper | Counterevidence under tested accumulation conditions. Not a universal protection guarantee. |
| [Task substitution and uplift](https://metr.org/blog/2026-05-08-task-substitution-and-uplift/) | May 8, 2026; analytical note | Separates old-task performance, changed task mix, and value. Does not supply this paper's productivity estimates. |
| [Developer study-design update](https://metr.org/blog/2026-02-24-uplift-update/) | February 24, 2026; methodological update | Selection effects complicate a current causal estimate. Neither the older slowdown nor current perceived gains settle all tasks. |

## Agent-security addendum

The agent-security addendum uses ISACA's [Cybersecurity Recommendations for Securing AI Agents](https://www.isaca.org/resources/white-papers/2026/cybersecurity-recommendations-for-securing-ai-agents), published September 15, 2026 and reviewed September 19, 2026. The controls in Figure 3 recommend external policy enforcement, scoped identity and memory, untrusted-content handling, and safe recovery. The changed-target, cross-session, timeout, and stop exercises in the paper and acceptance record are my proposed applications. This guidance is not an empirical productivity study, proof of control effectiveness, or a validation of those exercises.

## Additional evidence for user progression

The third companion's stages, coaching prompts, and development log are proposed applications. These studies do not validate that framework or establish a standard timetable for workplace mastery. Reviewed September 18, 2026.

| Source | Evidence used | Limit carried into the guide |
| --- | --- | --- |
| [Kestin and colleagues](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/) | 2025 randomized undergraduate physics study: a specifically designed tutor improved immediate learning relative to its classroom comparison. | Two lessons in one course; no claim of durable workplace transfer or equivalent results from an ordinary chatbot. |
| [Bastani and colleagues](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/) | 2025 randomized high-school mathematics study: tool design changed the relation between assisted practice and subsequent unassisted performance. | Tutor safeguards largely avoided the observed harm; they did not establish an unassisted advantage over control. The [August 2025 correction](https://pmc.ncbi.nlm.nih.gov/articles/PMC12403119/) concerns an author affiliation. |
| [Anthropic coding-skill study](https://www.anthropic.com/research/AI-assistance-coding-skills) | January 2026 experiment already listed above, plus analysis of interaction patterns. | Patterns associated with learning were not independently randomized coaching methods. They motivate local tests, not a causal guarantee. |

## Limits of the local exercises

Small pilots are sensitive to task selection, prior experience, repeated-task learning, model updates, and changes to instructions or sources. Record these conditions rather than attributing every difference to the model or chip. State whether a result is exploratory or supports a predefined local threshold.

Use an announced learning exercise with an agreed purpose and handling of participant results. A missed follow-up is unmeasured. A participant's explanation can reveal a training need without establishing a lasting loss of ability.

The [proposition test plan](06-proposition-test-plan.md) turns the paper into bounded comparisons. The [productivity pilot](04-productivity-pilot.md) defines denominators and missing-data handling. Together they support a reviewable decision; neither grants approval to execute it.
