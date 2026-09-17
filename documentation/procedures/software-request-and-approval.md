# Software request and approval procedure

> Adapted example for a fictional investment firm. Version 0.1. All sample products, requests, timing, and decisions are fictional. This is a procedure to adapt, not an approval to use a product.

Use this procedure for a new subscription, desktop application, browser extension, AI tool, connector, or material expansion of an existing tool. The outcome is a documented decision with a defined scope, followed by verified provisioning or a recorded decline.

## Roles and handoffs

| Role | Produces |
|---|---|
| Requester and business sponsor | Problem statement, intended users, and success measure |
| Service desk | Complete intake record and existing-tool check |
| Technical reviewer | Security and integration assessment, trial results, and recommendation |
| Business approver | Decision, budget authority, conditions, and accountable owner |
| Legal or Compliance reviewer | Resolution of applicable contract, records, and data-use questions |
| IT operator | Provisioning evidence, register update, and end-of-trial action |

## 1 Capture the request

Create a record in the approved request system even when the request arrives through chat. Capture the problem, proposed product, vendor, requester, sponsor, user group, trial or production intent, data classes, requested integrations, permissions, expected cost, and deadline.

Check whether an existing approved tool solves the problem. An urgent deadline changes the review priority; it does not supply missing approval.

## 2 Assess the proposal

Record the evidence and date for each relevant area:

- Vendor security information, its scope, and unresolved exceptions.
- Sign-in, MFA, provisioning, access removal, administrator separation, and audit capabilities.
- Data collected, destinations, subprocessors, retention, deletion, export, and proposed permissions.
- Compatibility, deployment method, support model, continuity dependencies, and exit costs.
- Contract, renewal terms, budget, and records requirements requiring specialist review.

A certification or trust-page logo is supporting evidence, not a complete assessment. A free trial can still have broad permissions or sensitive data access.

For AI, also review prompt and output handling, contract and account-specific training terms, connectors, model providers, actions the system can take, and human review controls. Apply the [AI policy](../policies/ai-acceptable-use.md).

## 3 Run a bounded trial

Define the trial group, synthetic dataset, environment, duration, success measures, cost limit, prohibited actions, and exit plan before provisioning. Isolate it from production information unless the review explicitly authorizes a particular data scope.

Record test inputs and expected results. Check permissions, access removal, export, failure behavior, and any action requiring human approval. Record a failed or incomplete test as such.

## 4 Make a reviewable recommendation

Recommend **approve**, **approve with conditions**, **defer pending evidence**, or **decline**. Include the problem, alternatives, trial evidence, costs, unresolved risks, conditions, owner, and reassessment trigger.

The approver records the decision and authority in the request. Separate a recommendation from its approval, and separate a trial decision from production authorization.

### Fictional decision example

**Request EX-REQ-014:** Try an example document comparison service with three operations users and synthetic agreements for 21 days. Success means the reviewer can locate every deliberately inserted clause change and export the comparison for independent review.

**Recommendation:** Approve the bounded trial if the reviewer verifies account controls and export behavior first. Permit no mailbox connector, production agreements, or automatic sending. Pricing and deletion behavior remain questions to resolve before a production decision.

**Decision status:** Proposed; approval and execution are not recorded. No trial has occurred in this example.

## 5 Provision and verify

After approval, provision only the approved users and permissions. Configure account controls, secure necessary credentials, record ownership and renewal dates, update the application register, and give the requester usage instructions.

Verify the intended access and a denied-access case. Confirm the tool cannot access an unapproved data source. Record the implementation result and any deviation for review.

## 6 Close the trial or transition to production

At expiry, record **stop**, **extend with approval**, or **request production review**. For a stop, remove integrations and access, cancel renewal where applicable, obtain the available deletion confirmation, and record remaining retention limits. For production, resolve open conditions and assign ongoing support, access review, recovery, and exit ownership.

Completion requires a recorded decision and verified final state. Silence from the requester does not authorize a subscription to continue indefinitely.

Related: [build versus buy example](../build-buy-decision-example.md), [adaptation guide](../ADAPTATION.md).
