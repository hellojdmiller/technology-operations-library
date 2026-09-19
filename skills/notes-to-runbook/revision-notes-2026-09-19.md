# Notes-to-runbook revision review — September 19, 2026

This is a maintenance note for the [skill](SKILL.md), not additional instructions that a host must load. It records a narrow revision prompted by the [September 19 observed draft](../../showcase/host-trials/observed-2026-09-19.json). The earlier trial and its output remain unchanged.

**Status at refinement handoff:** the initial revision was tested against the original skill across two fictional cases, producing four outputs for blind review. All four still required corrections before operator use; none acted on the instruction embedded in a supplied log. The final refinement below awaits two fresh model checks. A later trial must record its own input hash, delivery method and result. This note does not claim that the changes eliminate the observed problems.

**Subsequent observation:** the [six-output comparison](../../showcase/host-trials/runbook-revision/README.md) now includes both refinement calls. They completed without tools, but still contain drafting defects. The outputs and remaining findings are preserved; this follow-up does not turn the earlier handoff status or the latest instruction body into an operational pass.

The tested initial revision's SHA-256 was `18213c1cda1b87a5ff6e056a9bda711f9a536d18a0547564df6abf5894dff20e`. Its structural validation passed; that result did not establish behavioral reliability. The current skill body differs from that tested version.

## What changed and why

| Observed drafting problem | Reusable decision rule |
| --- | --- |
| Saying no steps were run could obscure the restore activity already reported in the source notes. | Distinguish source-reported history, independent verification, and activity performed during the drafting task. |
| The generated draft prescribed retaining an unredacted log internally without a supplied handling policy. | Keep necessary excerpts or protected references in the reusable document; derive original-evidence preservation, access and retention handling from supplied requirements. Missing policy remains a gap. |
| Permission checks suggested eliminating elevated accounts without distinguishing necessary roles. | Compare actual permissions with the approved access baseline; preserve uncertainty if that baseline is absent. |
| Attachment verification referred to the source application without identifying the restored result. | Verify the intended destination and user workflow, including applicable ordinary-user access. |
| A reviewed rollback document was offered as an alternative to a demonstrated recovery test. | Track documented, reviewed, exercised and observed-result states separately; preserve untested coverage. |

The skill remains provider-neutral and self-contained. It adds no mandatory tools, installation, universal evidence-retention schedule, or new approval step. The revisions apply to drafting other operational procedures as well as the original recovery example.

## Refinement after the first comparison

The first revised outputs exposed four remaining ambiguities. This refinement makes the existing rules more explicit:

- Preserve what a reported number measures; a transfer job's copied count cannot become an independently collected source or destination total.
- Verify actual destination content and the scoped ordinary-user permitted and denied workflows. Counts and successful launches alone do not demonstrate usable content.
- An incomplete role table does not establish whether every unlisted role is allowed or forbidden. Flag supported deviations and retain unresolved expectations.
- Without supplied evidence-handling requirements, use a protected reference and mark the policy gap. Do not substitute an unconditional instruction to retain an original "as-is."

These are generic clarifications derived from observed drafting failures, not fixture-specific acceptance answers. The distinction between a documented recovery plan and an exercised recovery remains unchanged. The refinement author did not inspect the new fixtures or generated answers; the trial coordinator supplied the defect descriptions above.

## Research basis

Primary guidance reviewed **September 19, 2026**:

| Source / edition and relevant section | Support and application | Limits |
| --- | --- | --- |
| [NIST SP 800-61 Rev. 3](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf), final April 3, 2025; RS.AN-06/07, printed p. 29 | Preserve record provenance, protect access, and handle evidence under organizational preservation and retention procedures. Informs attribution and protected references. | Incident-response guidance; does not prescribe one retention rule for every runbook. |
| Same publication, PR.AA-05, printed p. 21; RC.RP-03/04/05, printed p. 34 | Policy-based permissions and least privilege; distinguish restoration assets from restored systems and confirm restoration adequacy. Informs baseline comparison and destination checks. | Ordinary-user verification is our practical application, not a quoted universal test requirement. |
| [CISA, FBI, NSA and MS-ISAC #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide), official HTML linking the September 2023 edition; “Preparing for Ransomware and Data Extortion Incidents” and “General Best Practices and Hardening Guidance” | Recommends exercising response plans, testing backup availability/integrity, and restricting access to what roles need. Supports keeping plan review separate from tested recovery and retaining legitimate administration. | Ransomware guidance provides relevant principles; it does not validate this skill or make every procedure an incident response. HTML update date was not established. |

The NIST final publication and relevant PDF sections were read directly. CISA's official HTML was retrieved successfully after the browser fetch returned an access error. These sources informed the decision rules; the wording and proposed model evaluation are this library's adaptations.

## Follow-up verification

The two fresh checks used the frozen final-refinement hash recorded in the comparison. Review their actual attribution, destination verification, permission scope, evidence handling and recovery-test status. Before making broader claims, use new cases with the intended host and an operator reviewer; do not keep tuning only against the same examples. Preserve remaining defects rather than replacing an observation with a passing score. A structural skill check cannot establish behavioral reliability, cross-host portability or operational acceptance.

Revisit the instructions when another observed result exposes an ambiguity, when applicable evidence/access rules change, or when source guidance is revised. Keep account data, real incident artifacts and completed operational evidence outside the public skill.
