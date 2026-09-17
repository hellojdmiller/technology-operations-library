# Data classification and handling policy

> Adapted example for a fictional investment firm. Version 0.1. No effective date or organizational approval is implied. Read the [adaptation guide](../ADAPTATION.md) before reuse.

This policy defines how the Firm classifies, stores, shares, and disposes of information. It applies to employees, contractors, service providers, and information in electronic, printed, or spoken form.

The practical question is what someone may do with a piece of information. A label is useful only when it changes storage, access, sharing, or retention decisions.

## Classification levels

| Level | Meaning | Fictional examples |
|---|---|---|
| Confidential | Unauthorized disclosure, alteration, or loss could materially harm people, the Firm, or another party | Investor records, nonpublic investment materials, personnel files, credentials, sensitive configurations |
| Internal | Intended for a defined internal audience; not approved for publication | Routine project updates, general training notes, ordinary internal procedures |
| Public | Approved for public release or obtained from a lawful public source without a conflicting restriction | Published articles, approved announcements, public product documentation |

The content determines the classification. A vendor contract, meeting note, or system diagram may be Confidential even when a similar document is usually Internal. A public announcement does not make supporting diligence files public. Combined public records may also create a sensitive dataset.

## Handling requirements

| Activity | Confidential | Internal | Public |
|---|---|---|---|
| Store | Approved managed repository with restricted access and encryption | Approved managed workspace with an appropriate audience | Approved workspace or publishing system |
| Share | Named recipients with a documented purpose; verify external recipients and use an approved protected transfer method | Relevant colleagues or explicitly authorized external recipients | Approved channels, respecting source rights |
| Grant access | Data owner approves the minimum necessary access and any expiry | Workspace owner confirms the intended audience | Reading may be unrestricted; editing and publication remain controlled |
| Label | Apply the approved classification label and preserve it when exporting | Label where the audience or handling could be misunderstood | Identify the approved published version |
| Use with AI | Prohibited in this example policy; use a separately reviewed synthetic substitute | Only for an approved use case and workspace under the AI policy | Approved AI tools within their authorized scope |
| Print | Limit copies, collect immediately, store securely, use approved destruction | Prevent unattended disclosure and dispose appropriately | Normal disposal unless another requirement applies |
| Retain or delete | Follow the approved retention schedule and applicable holds; record authorized destruction | Follow the retention schedule and applicable holds | Follow the publication and records schedule |

Credentials belong in an approved secrets manager, not in documents carrying a Confidential label. A label does not make an unsuitable repository safe.

## Ownership and responsibilities

The **data owner** determines classification, approves access and sharing, and resolves retention questions with the records owner. **IT** implements the technical controls and verifies their operation. **Legal or Compliance** determines applicable disclosure, contractual, retention, and hold requirements. **Users** classify new material, protect it in transit and at rest, and report suspected mishandling.

Ownership must be assigned to a role with an accountable person in the internal record. The author of a document is not automatically authorized to publish all information it contains.

## When the classification is uncertain

Treat the material as Confidential while the owner resolves the question. Record what is uncertain and pause the proposed sharing or processing. Do not lower a classification merely to make a tool usable.

De-identification requires a content review. Removing names alone can leave an organization identifiable through dates, locations, system combinations, incident descriptions, financial figures, or relationships.

## Exceptions and incidents

An exception record must identify the data, proposed use, business reason, approver, compensating controls, expiry, and review date. It cannot override an applicable legal hold or disclosure restriction. The Confidential-data AI restriction requires an approved policy revision, not an informal exception.

If information is sent to the wrong audience, stop further sharing, preserve relevant evidence, and notify the incident response owner through the approved channel. Record what is known and what remains unconfirmed.

## Evidence and review

Keep classification decisions, access approvals, external-sharing reviews, exception records, and disposal evidence in the protected records system. Review the policy at least annually in this example, and after a material change in data use, tooling, or obligations.

Before adoption, test whether a colleague can correctly classify a sample document, identify its permitted destination, obtain access approval, and demonstrate that a removed recipient has lost access.

Related examples: [AI acceptable use](ai-acceptable-use.md), [identity and access](identity-and-access.md), [software approval](../procedures/software-request-and-approval.md).
