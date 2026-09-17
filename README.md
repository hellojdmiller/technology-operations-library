# VCPEIT

Practical resources for technology operations in venture capital and private equity.

This is the private working companion to [hellojdmiller.com](https://hellojdmiller.com). I’m using it to develop workflows, reusable AI instructions, and documentation that make an idea easier to put into practice.

## Start here

| Collection | First resources | Use it for |
|---|---|---|
| [n8n workflows](n8n/README.md) | Automation result review; operations brief | See what happened, what is missing, and what needs attention |
| [ChatGPT and agent skills](skills/README.md) | Build-versus-buy review; notes to runbook | Turn a question or working notes into a useful decision or document |
| [Documentation examples](documentation/README.md) | Decision memo; recovery exercise runbook | Adapt a complete example with its assumptions and acceptance criteria visible |

The examples use fictional data. The n8n workflows run manually and do not connect to live services or send messages. Their JavaScript is tested locally; importing and executing them in n8n is the next validation step.

## How to use this collection

Start with the resource’s README or instructions. Each resource explains the input it expects, what it produces, and what still needs to be checked. Follow the related article for the reasoning behind the example.

For the local workflow checks, use Node.js 22 or later. No package installation is needed:

```sh
node scripts/build-workflows.mjs
node --test tests/workflows.test.mjs
```

The build command regenerates the workflow JSON from its readable JavaScript and sample data. Commit both together.

## Developing privately

Keep this repository private while the examples are being tried and refined. The website can link to published resources after a separate publication decision. Current readiness and the next checks are recorded in [VALIDATION.md](VALIDATION.md).

New resources should include a clear use case, fictional sample input, expected output, setup instructions, and a meaningful validation step. Keep credentials, private operational data, and environment-specific exports out of examples.

The existing [GPL-3.0 license](LICENSE) is retained.
