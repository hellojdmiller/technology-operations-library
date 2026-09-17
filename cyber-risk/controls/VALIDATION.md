# Validation record

Checked locally on 2026-09-17. These are resource-quality checks, not tests of a live organization's controls.

- Parsed all three CSV files with Python's standard CSV reader.
- Confirmed 36 unique, sequential control IDs (`VCIT-001` through `VCIT-036`), 20 populated columns per library row, HTTPS primary references on official source domains, and coverage across all six NIST CSF functions.
- Confirmed the assessment template has one row per control and no invented assessment values.
- Confirmed six worked assessment records use the documented state vocabulary, reference valid controls, are explicitly fictional, preserve evidence limitations, and require an owner and expiry for an approved exception.
- Resolved all 36 `related_resource` paths against the local repository.
- Checked this directory for workplace identity strings, personal email patterns, and tenant-like UUIDs; none found.

Primary-function distribution: Govern 6, Identify 4, Protect 15, Detect 4, Respond 3, Recover 4. This reflects the selected examples, not a prescribed allocation of resources or an official framework crosswalk.

Official reference pages were reviewed during drafting; CISA CPG 2.0 release status was verified against CISA's December 2025 announcement. No vendor configuration, security test, financial transaction, tenant query, or operational evidence collection was performed. The scenarios, evidence labels, sample scopes, and suggested cadences are original fictional examples requiring adaptation.
