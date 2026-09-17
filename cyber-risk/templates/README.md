# Cyber-risk working records

Copy these empty templates into the approved internal record system. Keep completed records, system identifiers, weakness details, approvals, and raw evidence outside this repository.

- [Control test record](control-test-record.md): scope, expected result, observed result, and conclusion.
- [Evidence register](evidence-register.csv): metadata for evidence references, access owner, scope, dates, and freshness decisions.
- [Exception register](exception-register.csv): decision authority, compensating measures, expiry, and reconsideration.
- [Existing risk register example](../../library/templates/risk-register.csv): fictional risk scenarios and treatment structure.
- [AI use-case record](../ai/templates/ai-use-case-record.md): data, actions, approval boundaries, and evaluation.

The registers are separate working schemas, not direct input files for a command-line tool. If using the evidence-review work sample, use its documented JSON schema and preserve these fields during an intentional conversion.

An empty field means unresolved. Do not interpret a blank result as a pass, invent an approver, or enter sensitive content merely to make the sheet complete. Establish retention, access, and evidence integrity rules for the actual organization. A file hash can help detect later changes to an artifact; it does not prove that the artifact is truthful or complete.
