// n8n Code node: Run Once for All Items. Calendar triage, not contract interpretation.
const items = $input.all();
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const valueMs = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value ? valueMs : null;
};
if (!items.length) return [{ json: { status: 'invalid_input', issues: ['No renewal packets supplied.'] } }];

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const asOf = date(input.asOf);
  if (!text(input.reviewId)) issues.push('reviewId must be a nonblank string.');
  if (asOf === null) issues.push('asOf must be a real YYYY-MM-DD date.');
  if (!Number.isInteger(input.planningWindowDays) || input.planningWindowDays < 1) issues.push('planningWindowDays must be a positive integer.');
  if (typeof input.registerComplete !== 'boolean') issues.push('registerComplete must be a boolean.');
  if (!Array.isArray(input.vendors)) issues.push('vendors must be an array.');
  else {
    const seen = new Set();
    for (const [row, vendor] of input.vendors.entries()) {
      if (!vendor || !text(vendor.vendorId) || !text(vendor.service)) { issues.push(`vendors[${row}] needs vendorId and service.`); continue; }
      if (seen.has(vendor.vendorId)) issues.push(`Duplicate vendorId: ${vendor.vendorId}.`);
      seen.add(vendor.vendorId);
      if (date(vendor.renewalOn) === null) issues.push(`vendors[${row}].renewalOn must be a real date.`);
      if (vendor.noticeDeliveredOn !== null && (date(vendor.noticeDeliveredOn) === null || date(vendor.noticeDeliveredOn) > asOf)) issues.push(`vendors[${row}].noticeDeliveredOn must be null or a real date no later than asOf.`);
      if (!Number.isInteger(vendor.noticeDays) || vendor.noticeDays < 0 || vendor.noticeDays > 3650) issues.push(`vendors[${row}].noticeDays must be an integer from 0 to 3650.`);
      if (typeof vendor.autoRenews !== 'boolean' || typeof vendor.exitPlanReady !== 'boolean' || typeof vendor.noticeSent !== 'boolean') issues.push(`vendors[${row}] needs boolean autoRenews, exitPlanReady, and noticeSent.`);
      if (!['critical', 'standard'].includes(vendor.criticality)) issues.push(`vendors[${row}].criticality must be critical or standard.`);
      if (!['undecided', 'renew', 'exit'].includes(vendor.decision)) issues.push(`vendors[${row}].decision must be undecided, renew, or exit.`);
      if (typeof vendor.annualCost !== 'number' || !Number.isFinite(vendor.annualCost) || vendor.annualCost < 0) issues.push(`vendors[${row}].annualCost must be a finite nonnegative number.`);
      if (typeof vendor.currency !== 'string' || !/^[A-Z]{3}$/.test(vendor.currency)) issues.push(`vendors[${row}].currency must be a three-letter uppercase code.`);
    }
  }
  if (issues.length) return { json: { reviewId: input.reviewId ?? null, status: 'invalid_input', issues }, pairedItem: { item: index } };

  if (!input.registerComplete) issues.push('Register is incomplete; missing vendors may hide renewal exposure.');
  if (!text(input.evidenceRef)) issues.push('Missing register evidence reference.');
  if (!input.vendors.length) issues.push('Empty vendor scope requires confirmation.');
  const rows = input.vendors.map(vendor => {
    const deadlineMs = date(vendor.renewalOn) - vendor.noticeDays * 86400000;
    const daysToDeadline = Math.round((deadlineMs - asOf) / 86400000);
    const findings = [];
    const decisionRecorded = vendor.decision !== 'undecided' && text(vendor.decisionEvidenceRef);
    const exitNoticeUnverified = vendor.decision === 'exit' && (!vendor.noticeSent || !text(vendor.noticeEvidenceRef) || vendor.noticeDeliveredOn === null);
    if (!text(vendor.ownerRole)) findings.push('owner_missing');
    if (vendor.decision !== 'undecided' && !text(vendor.decisionEvidenceRef)) findings.push('decision_evidence_missing');
    if (vendor.decision === 'exit' && !vendor.exitPlanReady) findings.push('exit_plan_missing');
    if (exitNoticeUnverified) findings.push('exit_notice_unverified');
    if (vendor.decision === 'exit' && vendor.noticeDeliveredOn !== null && date(vendor.noticeDeliveredOn) > deadlineMs) findings.push('notice_delivery_after_deadline');
    if (date(vendor.renewalOn) < asOf) findings.push('renewal_date_in_past_confirm_current_term');
    let queue = 'monitor';
    if ((!decisionRecorded || exitNoticeUnverified) && daysToDeadline < 0) { queue = 'deadline_passed'; findings.push('decision_or_notice_deadline_passed'); }
    else if ((!decisionRecorded || exitNoticeUnverified) && daysToDeadline <= input.planningWindowDays) { queue = 'decision_due'; findings.push('decision_or_notice_needed_in_planning_window'); }
    else if (decisionRecorded) queue = 'decision_recorded';
    if (vendor.autoRenews && (!decisionRecorded || exitNoticeUnverified) && daysToDeadline <= input.planningWindowDays) findings.push('automatic_renewal_exposure');
    if (vendor.criticality === 'critical' && queue !== 'monitor') findings.push('business_dependency_review');
    return {
      vendorId: vendor.vendorId, service: vendor.service, ownerRole: text(vendor.ownerRole) ? vendor.ownerRole : null,
      renewalOn: vendor.renewalOn, decisionDeadline: new Date(deadlineMs).toISOString().slice(0, 10), daysToDeadline,
      queue, annualCost: vendor.annualCost, currency: vendor.currency, decision: vendor.decision,
      decisionEvidenceRef: text(vendor.decisionEvidenceRef) ? vendor.decisionEvidenceRef : null,
      noticeEvidenceRef: text(vendor.noticeEvidenceRef) ? vendor.noticeEvidenceRef : null,
      noticeDeliveredOn: vendor.noticeDeliveredOn, findings
    };
  }).sort((a, b) => a.daysToDeadline - b.daysToDeadline || a.vendorId.localeCompare(b.vendorId));
  const attentionCount = rows.filter(row => row.findings.length).length;
  return {
    json: {
      reviewId: input.reviewId, asOf: input.asOf, status: issues.length || attentionCount ? 'needs_review' : 'review_ready',
      totalVendors: rows.length, attentionCount, issues, rows, evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      limitation: 'Dates use supplied calendar-day notice periods. Verify contract definitions, delivery requirements, time zones, and current term. Costs are displayed by currency, not summed. No renewal, cancellation, or vendor contact occurs.'
    }, pairedItem: { item: index }
  };
});
