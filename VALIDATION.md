# Validation and release readiness

This collection is being developed privately. The checks below describe the resource examples, not a production environment. Review date: **September 17, 2026**.

## Current evidence

| Resource | Completed checks | Remaining validation |
|---|---|---|
| Seven n8n examples | 43 local tests cover evaluators, failure cases, exact ID matching, evidence gaps, duplicate records, date boundaries, exported graphs, and embedded-source consistency | Import and execute in an identified n8n version; validate real collectors, permissions, pagination, retention, retries, and downstream actions |
| Google and Microsoft baselines | 40 control assertions; fictional observations; local schema/evidence assessment; 16 tests pass | Collect environment-specific evidence and review any proposed tenant changes |
| Four portable skills | All four SKILL.md files pass the structural validator; host setup instructions and fictional evaluation rubrics supplied | Install or supply instructions in the intended host, then run behavioral trials in Claude, ChatGPT, Codex, or Cursor |
| Documentation and field guides | Nine source documents adapted into clean Markdown; direct identifiers and operational details removed or generalized; fictional findings and targets labeled | User review for remaining contextual identification, suitability, and internal adoption; no approved-policy or legal-compliance claim |
| Six training modules | Current official references, prerequisites, tabletop scenarios, optional isolated labs, expected evidence, and scored answer guides reviewed | Execute and review the chosen lab; no completion or certification is claimed |
| Azure Bicep | Both top-level templates compile with Bicep 0.42.1; the registry schema warning was resolved by using the supported 2025-04-01 schema | Azure validation/what-if, application code and authentication, image build, deployment, and runtime verification |
| MCP design template | Contract, design brief, permission boundaries, and verification cases reviewed | Implement the service and test client/protocol compatibility and authorization |
| Configuration scripts | 13 PowerShell 7.6.4 checks pass: parsing, offline comparison, missing/false values, invalid inputs, wrong-tenant rejection, and scoped mocked reads | Actual Exchange Online module integration remains untested; no live tenant execution or change |
| Searchable catalog | 40 resources indexed; browser search and collection filters checked | GitHub authorization is required to open private resource links |

The JavaScript check command passes **59 tests** in total. Its success does not establish n8n runtime compatibility or real-tenant security. Structural skill validation does not prove that every host will follow the instructions correctly.

## Privacy review

Original document containers, source extracts, provenance notes, and raw operating evidence are kept outside the repository. The adapted examples omit employer identity, people and contact details, actual architecture and asset identifiers, commercial terms, and incident history. A repository text scan supports the manual content review; it cannot guarantee that contextual identification is impossible.

The work-sample code uses generic names, placeholders, and public Azure role identifiers. No original repository history, deployment secrets, private tenant parameters, or original CI configuration is included.

## Before using a resource operationally

Record the intended environment, versions and editions, authorized scope, input source, expected result, actual result, reviewer, and unresolved limitations. Keep private evidence in its approved location. Apply changes only through the relevant reviewed operating process.

For n8n, record the imported workflow version, fixture result, failure-case result, and execution reference. For a skill, record the host/model, delivery method, skill revision, fixture, output, and rubric result. For a cloud baseline, distinguish a desired-state assertion from evidence observed in a tenant.

## Before public release

Choose the specific resources and versions to share. Review disclosure risk and rights, confirm source references and validation claims, and retain material limitations. Publishing a resource or changing repository visibility is a separate decision. This work keeps the collection private.
