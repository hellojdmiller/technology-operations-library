# Validation and release readiness

This collection is being developed privately. It is a starting set of examples, not a claim that a production integration has been accepted.

## Current checks

| Resource | Validation | Remaining check |
|---|---|---|
| Automation result review | Local JavaScript tests for matching, missing, extra, duplicate, empty, and malformed inputs | Import and manually execute in an identified n8n version |
| Operations brief | Local JavaScript tests for normal, unknown, incomplete, invalid, and empty observations | Import and manually execute in an identified n8n version |
| Workflow exports | JSON graph, node configuration, and embedded-source consistency checks | Confirm runtime behavior in the target n8n workspace |
| Reusable skills | Frontmatter and instruction review; fictional evaluation prompts provided | Run the evaluation prompts in the intended ChatGPT/agent environment |
| Documentation | Reviewed for fictional status, visible assumptions, acceptance checks, and missing environment details | Adapt and review in the intended operating environment |

## Before publishing a resource

Choose the specific resource and version to share. Confirm it contains only publishable examples, record what was tested, and leave limitations visible. Check article and resource links together. Changing the repository's visibility is a separate decision; this work does not change it.

## Recording an n8n trial

Record the n8n version, import date, workflow name, sample result, failure-case result, and any changes required. Add an execution reference without copying private payloads or credentials into this repository.
