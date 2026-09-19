# What makes AI-generated work safe to accept?

> Private-library copy of the September 18, 2026 review edition. See [source and sync notes](SYNC.md); this copy does not assert live publication.

I would begin with the work someone intends to rely on. A fast answer, a convincing explanation, and a completed task are different observations. An acceptance decision needs to connect them to evidence, authority, and an outcome that can be checked.

This is the concept companion to [Beyond the model frontier: chips, context, and human judgment](beyond-the-model-frontier.md). The paper examines the market and research. Here, I translate its questions into a vocabulary for a local experiment. The [practical guide](acceptance-review.md) and [editable companion pack](companions/README.md) provide the records to use.

## Separate the kinds of progress

| Concept | What changes | What I would measure locally |
| --- | --- | --- |
| Model capability | Which tasks the configured model can perform at an acceptable quality. | Representative tasks, difficult cases, and familiar failure modes. |
| Serving performance | The latency, capacity, and cost of making that capability available. | Time to a usable result, concurrency, reliability, and total service cost. |
| Effective context | How well the system uses evidence supplied or retrieved. | Correct source selection, contradictions found, and unsupported claims. |
| Persistent memory | What information is saved and brought into later work. | Provenance, freshness, correction, and retirement of outdated facts. |
| Human understanding | What the operator can explain, check, and recover. | An announced explanation exercise and a later unfamiliar exception. |
| Acceptance capacity | How much work the team can responsibly evaluate and put to use. | Review effort, unresolved queues, verified outcomes, and later defects. |

These are working distinctions, not a maturity score. One may improve while another becomes the constraint. I would investigate that before adding more generation capacity or another review step.

## Explain the chip question through the task

Prompt processing prepares a model to use its input. Token generation produces the response. Hardware and serving software can optimize these stages differently. The paper's examples include coordinated GPU systems, specialized TPUs, disaggregated inference, and custom inference chips. Its photonic example remains an experimental direction with a much narrower demonstrated task.

For a small firm, I would usually compare accessible services first. Record the model, version, context, reasoning settings, concurrency, and tools with the measurements. If several of these change together, the result is a system comparison. It cannot isolate the effect of a chip.

A useful speed measure ends at a verified result. Faster token delivery might leave source review unchanged. It might also make additional checking practical. The [model and serving worksheet](companions/01-model-and-serving-comparison.md) is designed to expose that difference.

## Distinguish three concerns called brain rot

**Human learning** concerns how assistance changes practice and understanding. The paper includes both weaker immediate learning in one coding experiment and workplace evidence of gains and learning. Those findings justify testing the particular task and style of assistance. They do not establish permanent cognitive damage from ordinary AI use.

**Training-data degradation** concerns changes caused by training. The revised [brain-rot pilot study](https://arxiv.org/html/2510.13928v2) tests continual pre-training on selected social-media data. That intervention is different from supplying poor material to an ordinary chat. Research on recursive synthetic data also depends on the training arrangement; it does not justify treating every generated example as harmful.

**Context problems** concern the material available during a task. An overloaded conversation, obsolete policy, or unsupported summary may lead to an unreliable result without any change to model weights. The [context-rot study](https://arxiv.org/html/2606.29718v2) examines particular open models and search tasks, with explicit limits on generalization.

For an operator, the distinction determines the response: preserve learning opportunities, ask providers about evaluation and change management, or repair the evidence and context strategy. A generic instruction to use AI less cannot identify which problem is present.

## Keep five acceptance questions together

1. **Quality:** Does the work meet agreed requirements, including how it handles uncertainty?
2. **Authority:** Who may authorize this use, and what may the acting identity do?
3. **Path:** Were the data, tools, recipients, and actions within the permitted scope?
4. **Evidence:** Can a reviewer inspect support for the claims and observed effects?
5. **Final state:** Is the intended result present in the authoritative destination?

Recovery surrounds these checks. Before accepting work, I want to know how an error will be contained, corrected, and communicated, including effects that cannot be undone.

For a draft, the final state might be a versioned internal document with visible uncertainties. Accepting that draft does not approve its recommendation or permit it to be sent. For a system change, approval, execution, and independent verification require separate records. A success message from the acting tool is insufficient by itself.

## Treat understanding as something to examine

I would distinguish producing work with assistance from explaining a decision and handling an unfamiliar exception. Both can matter. Neither is captured by counting prompts or completed documents.

A learning exercise can ask someone to predict a change's effect, explain the key choice, and diagnose a new failure later. Make the purpose and conditions clear in advance. The [learning worksheet](companions/03-learning-and-oversight-exercise.md) is a proposal for testing work design, not a validated assessment of intelligence or an employee ranking.

The third companion, [Helping people build capability with AI](building-capability-with-ai.md), turns that question into an ongoing development plan: adapt the help, practice varied cases, and observe what the person can explain and carry into new work.

## Use the concepts to make a decision

Suppose an assistant drafts a vendor renewal brief quickly, but the reviewer spends longer tracing its claims than writing the old brief. I would test a different evidence packet before concluding that the model or hardware is the constraint. If the reviewer can check the brief but cannot explain why a critical claim matters, I would also examine understanding and handoff.

The record should say what was checked, what use is permitted, what remains unknown, and what would trigger another review. Preserve rejected, blocked, and partially verified work as those states. A missing source does not become a passing check.

The [guide](acceptance-review.md) follows that sequence through a bounded pilot. The [evidence notes](companions/08-evidence-and-limitations.md) identify the paper's sources and limitations. The proposed measurements and operating records remain hypotheses to improve through use.
