---
name: document-sanitization
description: Adapt authorized internal documents into reusable examples by removing direct identifiers and sensitive operational detail, labeling fictional substitutions, and recording review limits. Use for a sanitized derivative, not to alter originals or certify that reidentification is impossible.
---

# Document sanitization

Establish the intended audience, permitted source material, output format, and destination from the user’s request. Preserve the original. Create a clean derivative in the authorized destination; do not overwrite source files or expand sharing permissions. Work only with capabilities actually available in the host. No provider-specific tool is required for text adaptation.

Read enough of the source to preserve its useful reasoning, procedure, decision structure, and verification steps. Distinguish an author’s work from third-party templates, embedded vendor documents, and confidential attachments. Preserve draft or uncertain status; a folder named approved does not establish approval.

Identify both direct identifiers and combinations that could expose the organization or its operations. Review names, affiliations, branding, domains, email addresses, office locations, phone numbers, usernames, tenant and asset IDs, addresses, network ranges, internal paths, links, screenshots, exact incident dates, unique architecture, contract figures, legal matters, and specific weaknesses. A company-name replacement alone is insufficient.

Choose the least revealing treatment that keeps the example useful:

- Replace people with generic roles and systems with functional descriptions.
- Generalize distinctive chronology, locations, scale, vendors, and dependency details when they are not necessary to teach the method.
- Use reserved example domains and visibly fictional identifiers where a worked example needs values. Do not invent an operational history or imply fictional measurements were observed.
- Remove secrets, recovery material, live access links, exploitable specifics, and irrelevant personal data entirely. Never preserve a secret in a redaction ledger or quote it back to demonstrate removal.
- Omit an appendix, image, table, or passage if its instructional value cannot be preserved without exposing the original.

Use a fresh text or Markdown document when formatting is not necessary. If the deliverable retains a document container such as DOCX or PDF, check comments, tracked changes, headers, footers, document properties, embedded objects, hidden text, images, annotations, attachments, and recoverable text layers with appropriate tools. Black rectangles over visible text are not sufficient redaction. If those surfaces cannot be inspected, provide the clean text derivative and mark the original container unreviewed; do not call it sanitized.

Keep any source-to-example mapping outside the shareable derivative, in an authorized protected location. A shared change note should name transformation categories, not reveal removed values. Where the host only supports chat, omit sensitive mapping details from the response rather than pretending to store them securely elsewhere.

Review the derivative twice: first for remaining identifiers and hidden surfaces, then for whether the generalized content still makes sense and could identify the source through combined details. Search is a supporting check, not proof of anonymity. Do not weaken a useful security recommendation merely because its implementation specifics were removed.

Deliver the adapted example with an explicit label such as “Adapted training example; fictional roles and values; not an approved policy or evidence of implementation.” Include a short transformation summary, checks actually performed, excluded material, and unresolved review limits. Distinguish direct-identifier removal from a guarantee against reidentification. Do not publish, commit source material, or assert a broader release approval that the user has not granted.
