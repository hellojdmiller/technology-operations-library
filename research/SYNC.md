# Source and sync notes

## Pinned edition

- **Author:** JD Miller.
- **Source repository:** [hellojdmiller/hellojdmiller](https://github.com/hellojdmiller/hellojdmiller), private.
- **Source commit:** [`19ac6589ca1e7e926c0c40a968e44a79ee25710b`](https://github.com/hellojdmiller/hellojdmiller/tree/19ac6589ca1e7e926c0c40a968e44a79ee25710b).
- **Branch at sync:** `research/beyond-model-frontier-revamp`.
- **Edition and sync date:** expanded review edition, September 18, 2026.
- **Publication state at sync:** website review preview. This copy makes no assertion that the expanded paper or companions are live on the production website. The sync does not deploy or promote the website.
- **Research freshness:** the source records a September 18 evidence review. Copying the documents does not constitute another literature review, external-link availability check, or confirmation of current vendor availability.

The website Markdown remains the editorial source for these 21 copied files. [SOURCE_MANIFEST.json](SOURCE_MANIFEST.json) records the pinned upstream path and SHA-256 plus each local path, SHA-256, and intentional adaptation. Source permalinks require access to the private website repository. The GitHub-relative reading links work within this repository.

## Source mapping

| Pinned website source | Private-library copy |
| --- | --- |
| `src/content/perspectives/beyond-the-model-frontier.md` | [Paper](beyond-the-model-frontier.md) |
| `src/content/perspectives/ai-acceptance.md` | [Concept companion](ai-acceptance.md) |
| `src/content/perspectives/acceptance-review.md` | [Practical review guide](acceptance-review.md) |
| `src/content/perspectives/building-capability-with-ai.md` | [User progression guide](building-capability-with-ai.md) |
| All 17 files in `src/content/companions/ai-research/` | [Editable companions](companions/README.md) |

The companion set contains its README, nine numbered worksheets, six CSVs, and one text checklist. All CSV and text files are byte-identical to the pinned source. Generated HTML/JSON, website layouts, ZIP archives, and production deployment metadata are not copied.

## Intentional adaptations

1. Website routes and download links become repository-relative Markdown links. The ZIP link opens the editable companion index; the guide's “Download” label becomes “Browse.”
2. A short provenance note appears after the title of each of the four readings.
3. Website-preview navigation instructions in the companion README and development plan become local navigation instructions. They no longer send the reader to an unrelated production revision.
4. Research claims, primary external citations, fictional examples, numbers, templates, and uncertainty/approval states remain unchanged. The external citations are preserved in the same order.

The collection README, this sync note, manifest, and local verifier are additions for this repository. They are not part of the 21-file website copy.

## Verify without network access

From the VCPEIT repository root:

```sh
python3 research/verify_sync.py
```

This validates the exact 25-file collection inventory, 21 local copy hashes, repository-relative link targets, six CSV schemas, four headers-only templates, and two four-row fictional logs. It does not claim to validate study findings or the worksheets' effectiveness.

For pinned upstream hashes, exact permitted text transformations, and unchanged external citation links:

```sh
python3 research/verify_sync.py --source-repo /path/to/hellojdmiller
```

The verifier uses `git show` for the pinned commit. It does not depend on the source checkout's current branch or working files, fetch from GitHub, modify either repository, or publish anything. If the source commit is absent, the check fails rather than silently accepting an unverified copy. Python 3.9 or newer is sufficient; no packages are required.

## Updating the collection

1. Choose a reviewed source commit explicitly. Do not synchronize from a floating branch name or generated download directory. Read the changed sources and assess whether the research date, limitations, or publication status changed.
2. Copy the four source Markdown readings and the complete reviewed companion inventory from that commit. Preserve raw source bytes before applying only the adaptations above. If the inventory changes, update both this note and the verifier's explicit file list.
3. Change substantive content in the website editorial source first, or retain a clearly labeled local proposal until it is reconciled. Do not present a diverging library draft as a faithful copy.
4. Rewrite links against the repository layout, preserving all external research citations. Keep fictional examples separate from blank templates. Never add actual participant observations, credentials, tenant exports, private contracts, or completed operational assessments to make an example look realistic.
5. Regenerate each manifest entry from the pinned upstream bytes and adapted local bytes using SHA-256. Record the full source commit, real sync date, evidence-review date, actual publication state, and adjustments. A hash update alone does not approve a content change.
6. Run both verifier modes, inspect the content diff, and review fictional labels, unknown/pending observations, and approval boundaries. Report unavailable upstream or external-source checks explicitly. Update the root resource catalog through its normal process.
7. Keep the repository private. A new source commit or preview does not itself authorize a production deployment or public release.

Any deployment, empirical pilot, learning outcome, or external source availability remains unverified by this sync unless separately recorded with evidence.
