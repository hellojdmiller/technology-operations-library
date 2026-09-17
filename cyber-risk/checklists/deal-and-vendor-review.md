# Cyber questions for a deal or critical vendor

Use a bounded evidence request to understand a dependency before accepting it. Vendor selection and investment diligence have different decision owners and access rights. This checklist supports either conversation; it does not authorize an intrusive assessment or decide an investment.

First identify the review type: a service the firm will use, a fund administrator or operating partner, or a portfolio-company diligence request. Record the requesting party, authorized scope, confidentiality terms, intended recipient, and decision the review informs. A portfolio team must authorize its own testing and remediation.

## Ask in proportion to the exposure

| Question | Useful evidence | Follow-up when incomplete |
|---|---|---|
| What business process and data depend on the service? | Data-flow and dependency summary covering subprocessors and integrations | Limit initial use to an approved scope until the boundary is clear |
| Who owns security and who answers during an incident? | Role, escalation coverage, independent contact route, responsibility matrix | Identify the decision owner and actual support hours |
| How is privileged and external access controlled? | A current scoped description plus representative operation evidence | Distinguish documented design from enforcement and exceptions |
| What happens after an employee or provider leaves? | A redacted lifecycle test covering apps, tokens, delegated access, and records | Ask which downstream systems were excluded |
| How are material vulnerabilities prioritized and resolved? | Method, representative aging/remediation evidence, and exception governance | Clarify exposed assets and business consequences rather than demanding a universal patch deadline |
| Can incidents be detected and investigated? | Coverage, retention, triage ownership, and a safe sample of retrieval | Determine whether unavailable history limits assurance |
| What can actually be restored? | Recent scoped recovery results, data freshness, permissions, and dependency limitations | Separate recovery targets from achieved results and ask about provider outage continuity |
| What is known about recent material incidents? | Authorized disclosure, remediation evidence, and remaining limits | Route contractual and disclosure questions to the responsible reviewer; do not assume silence proves no incident |
| What assurance reports are available? | Applicable report scope, period, exceptions, and customer responsibilities | A logo or certificate alone does not prove the intended service and controls are covered |
| Where does AI enter the service? | Actual use case, provider chain, data handling, enabled actions, and evaluation record | Restrict the proposed use until material data or action questions are resolved |
| Can the firm leave without losing records or control? | Export and deletion process, ownership, timing, formats, and tested usable export | Test a synthetic exit sample before depending on the advertised export feature |

## Use clear decisions

**Proceed within defined scope:** evidence supports the specific use and required approvals exist. **Proceed with conditions:** a bounded pilot and named restrictions address unresolved items, with an expiry and reviewer. **Hold:** a material gap cannot be contained or decision authority is absent. **Decline or redesign:** the dependency is incompatible with the business boundary or practical operating capacity.

These are proposed review outcomes, not assurances of safety. Record why a gap matters and what evidence could change the decision. The firm cannot accept a vendor's unresolved risk on behalf of unrelated clients or portfolio companies.

## Keep the request useful

Request the minimum relevant evidence through an approved protected channel. Do not ask a supplier to send credentials, full customer lists, raw incident artifacts, or unrelated penetration-test details into a broad shared workspace. Use a reviewer with appropriate access for sensitive evidence and keep a limited conclusion in the decision record.

Related: [vendor lifecycle](../../library/vendor-lifecycle.md), [AI use-case review](../ai/ai-use-case-review.md), [build/buy skill](../../skills/build-buy-review/SKILL.md). Reference: NIST's [cybersecurity supply-chain quick-start resources](https://www.nist.gov/cyberframework/quick-start-guides). This checklist is original operating guidance, not a complete NIST mapping. Reviewed September 17, 2026.
