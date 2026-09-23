# AI research and working companions

I want this collection to help operators connect the AI landscape to decisions they can test: which system to use, what evidence to provide, when to accept its work, and how the person using it continues to develop.

This is a **public copy of the September 19, 2026 published edition**, pinned to website source commit [`4b212df`](https://github.com/hellojdmiller/hellojdmiller/commit/4b212df10337348163213fcac1f3b07400a39256). Read it here or start with the [published paper](https://hellojdmiller.com/work/beyond-the-model-frontier). The full manuscript, *Beyond the Model Frontier: Acceptance Boundaries and Organizational Scaling in the AI Race* (44 pages, dated August 21, 2026), is published on the website as a [PDF](https://hellojdmiller.com/downloads/ai-research/beyond-the-model-frontier-manuscript.pdf); this collection carries the web essay and its editable companions, not the manuscript itself. This edition includes the September 18 research and learning companions plus the September 19 agent-security addendum; original evidence-review dates remain visible. The source repository is private, but every reading and worksheet below is available here. Read the [source and sync notes](SYNC.md) before updating the collection.

## Read the argument, then choose a test

| Reading | What it develops |
| --- | --- |
| [Beyond the model frontier: chips, context, and human judgment](beyond-the-model-frontier.md) | A conceptual review of hardware, model progress, context, human learning, training-data degradation, and useful productivity. Nine propositions to examine locally. |
| [What makes AI-generated work safe to accept?](ai-acceptance.md) | Vocabulary for separating model capability, serving performance, effective context, understanding, and acceptance. |
| [A practical acceptance review for enterprise AI](acceptance-review.md) | A bounded pilot with evidence, costs, failure and recovery records, and separate recommendation, approval, execution, and verification. |
| [Helping people build capability with AI](building-capability-with-ai.md) | A proposed progression from understanding through practice, transfer, and helping others, with observable learning checks. |

## Work with the editable resources

Open the [companion index](companions/README.md) for nine worksheets, six CSV files, and a text checklist. The CSVs contain four blank templates and two explicitly fictional examples. These are editable source documents; this repository copy does not duplicate a ZIP download.

Start with one concrete question:

- **Selecting a model or service:** [model and serving comparison](companions/01-model-and-serving-comparison.md), then the [productivity pilot](companions/04-productivity-pilot.md).
- **Improving answer quality:** [context and evidence review](companions/02-context-and-evidence-review.md).
- **Helping users progress:** [user development plan](companions/09-user-development-plan.md) and [learning and oversight exercise](companions/03-learning-and-oversight-exercise.md).
- **Accepting or recovering work:** [acceptance and recovery record](companions/05-acceptance-and-recovery-record.md), with the [fictional example](companions/07-fictional-worked-example.md).
- **Testing the paper:** [proposition test plan](companions/06-proposition-test-plan.md) and [evidence and limitations](companions/08-evidence-and-limitations.md).

For surrounding practices, see the [prompting guide](../prompting/README.md), [AI risk and agent controls](../cyber-risk/ai/agent-and-mcp-controls.md), [portable skills](../skills/README.md), and [workplace and technology training](../training/README.md).

## Evidence and privacy boundaries

The paper is a conceptual review, not a systematic review or a validated productivity model. Its dated sources and limitations are preserved. This library sync checks the copies and their navigation. The ISACA guidance supporting the new agent-security addendum was rechecked on September 19; the rest of the literature was not reviewed again for this sync. Recheck availability, release details, and study revisions before relying on time-sensitive claims.

The examples are fictional and the worksheets propose practices to test. Missing, stale, conflicting, partial, and inaccessible evidence remains visible. Unknown numeric values are not zero. Learning progress does not grant production authority; recommendation, approval, execution, verification, and final acceptance remain distinct.

Keep real employee observations, client or portfolio data, credentials, tenant exports, private contracts, completed assessments, and operational evidence outside this repository in an approved system. Use synthetic or explicitly approved material for exercises. Agree on access, purpose, and retention before collecting learning observations. Review new material for public disclosure before adding it to this collection.

## Verify this copy

From the repository root, run:

```sh
python3 research/verify_sync.py
```

This checks the complete collection inventory, copied-file hashes, local link targets, and CSV structure. To verify the pinned upstream bytes and permitted adaptations as well, provide a local checkout containing the source commit:

```sh
python3 research/verify_sync.py --source-repo /path/to/hellojdmiller
```

See [SYNC.md](SYNC.md) for the source mapping, provenance, and update procedure.
