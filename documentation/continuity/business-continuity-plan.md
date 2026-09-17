# Business continuity plan

> Adapted example for a fictional investment firm. Version 0.1. Business functions, recovery targets, roles, and scenarios below are illustrative. They are not a description of an actual firm's capabilities or commitments.

This plan explains how the Firm maintains essential work during a disruption and decides when to resume normal operations. The companion [recovery playbook](disaster-recovery-playbook.md) covers technical recovery. Business continuity also covers unavailable people, offices, suppliers, communications, and decision-makers.

## Ownership and activation

The executive sponsor authorizes activation and business priorities. The continuity coordinator maintains the plan and decision log. Technology, operations, and communications leads execute their assigned work. Legal or Compliance determines applicable notification and records obligations. Each role needs a named primary and alternate in a protected contact register.

Activate when an essential function cannot operate safely, a disruption threatens its tolerable limit, a key dependency is unavailable, or the incident lead requests coordinated continuity support. Record the declaration time, available facts, scope, decision-maker, and next review time.

People's safety takes priority. Use the relevant emergency response procedure for immediate physical danger.

## Business impact analysis

For each function, the owner identifies deadlines, required people, upstream services, critical records, minimum workable capacity, and the effect of an interruption. Assess normal periods and deadline-sensitive periods separately.

**RTO** is the target time to restore the defined capability. **RPO** is the tolerable age of recovered data, expressed as a time interval. **Maximum tolerable disruption** is the point beyond which the business impact becomes unacceptable. A target is not proof that the organization can meet it.

### Fictional planning assumptions

| Function | Minimum viable operation | RTO | RPO | Maximum tolerable disruption |
|---|---|---|---|---|
| Staff coordination | Incident leads can contact critical staff through a tested alternate channel | 2 hours | Not applicable to the live contact channel | 4 hours |
| Time-sensitive investment work | Authorized team can read the approved current decision pack | 6 hours | 2 hours | 12 hours during a deadline |
| Investor reporting support | Operations can retrieve the approved reporting pack and reconcile pending changes | 12 hours | 8 hours | 24 hours near a reporting deadline |
| Routine internal administration | Staff can record pending requests for later reconciliation | 2 business days | 1 business day | 4 business days |

These numbers were invented for the example. Replace them using an approved impact analysis, vendor capability review, and timed tests. Identity, connectivity, and access to recovery records may need to recover before any dependent function.

## Continuity strategies

For **office loss**, move essential work to an approved alternate location or remote arrangement, verify secure access, and account for staff availability. Do not assume every employee has a safe workspace and usable connection.

For **service outage**, determine whether the problem is the provider, connectivity, identity, configuration, or data. Use a preapproved alternate process only if its permissions, records, and reconciliation method have been tested. A backup of data is not automatically a replacement application.

For **data corruption or suspected compromise**, coordinate containment and evidence preservation before restoration. Recover a bounded sample into a safe destination, verify it, and expand only after authorization.

For **key-person unavailability**, use documented alternates with established authority and accessible procedures. Contact details and delegated authority must be usable without the unavailable person's account.

## Response sequence

1. Confirm immediate safety and establish an incident record.
2. Identify affected functions, deadlines, dependencies, and known limits.
3. Assign the incident lead, business owners, alternates, and communication owner.
4. Select approved continuity measures and record any accepted temporary risk.
5. Give staff a clear operating instruction, current limitations, and next update time.
6. Recover and validate the minimum viable capability before declaring broader availability.
7. Reconcile work performed during disruption and obtain business-owner acceptance.
8. Retire temporary access and workarounds after a controlled return to normal.

## Communications

Keep a verified contact register in a protected location with a tested alternate access path. Set an update cadence suitable for the incident. Each update states confirmed impact, available workarounds, owner, and next update time. Identify estimates as estimates.

The communications lead coordinates internal and external messages. Legal or Compliance determines who must be notified, on what trigger, through which channel, and by which deadline. This example sets no regulatory notification deadline.

## Testing and maintenance

The fictional program uses a quarterly contact and access check, a semiannual bounded recovery exercise, and an annual business continuity tabletop. Review the plan after material changes or exercises as well as annually.

Record the scenario, participants, expected result, observed timeline, evidence, gaps, owners, and due dates. A tabletop validates decisions and coordination; it does not prove a technical restore. A backup success report does not prove application usability.

## Acceptance before adoption

Business owners approve the impact analysis. Technology owners demonstrate dependencies and feasible recovery paths. Alternates demonstrate access to the plan. A timed exercise measures recovery and reconciliation against the agreed targets. Unmet targets remain visible in the risk register.

Related: [recovery exercise](../recovery-exercise-example.md), [cyber-risk assessment](../cyber-risk/risk-assessment-and-treatment.md), [adaptation guide](../ADAPTATION.md).
