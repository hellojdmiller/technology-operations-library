// n8n Code node: Run Once for All Items. Produces a draft, never sends it.
const items = $input.all();
const allowed = new Set(["healthy", "watch", "action", "unknown"]);
const nonblank = value => typeof value === "string" && value.trim().length > 0;
const observations = items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  if (!nonblank(input.service)) issues.push("Service name is missing.");
  if (!allowed.has(input.status)) issues.push("Status must be healthy, watch, action, or unknown.");
  if (!nonblank(input.summary)) issues.push("Observation is missing.");
  if (!nonblank(input.owner)) issues.push("Owner is unassigned.");
  if (!nonblank(input.evidenceRef)) issues.push("Evidence reference is missing.");
  return {
    inputIndex: index,
    service: nonblank(input.service) ? input.service : `Unnamed service (input ${index + 1})`,
    status: issues.length ? "unknown" : input.status,
    reportedStatus: allowed.has(input.status) ? input.status : null,
    summary: nonblank(input.summary) ? input.summary : "No observation supplied.",
    owner: nonblank(input.owner) ? input.owner : "Unassigned",
    evidenceRef: nonblank(input.evidenceRef) ? input.evidenceRef : null,
    issues
  };
});
const counts = { healthy: 0, watch: 0, action: 0, unknown: 0 };
for (const observation of observations) counts[observation.status] += 1;
const hasGaps = observations.length === 0 || counts.unknown > 0;
const attention = observations.filter(item => item.status !== "healthy");
return [{
  json: {
    status: hasGaps ? "needs_input" : "draft_ready",
    total: observations.length,
    counts,
    attention,
    observations,
    note: observations.length === 0
      ? "No observations supplied. This is not evidence of healthy services."
      : "A draft from supplied observations. References and service health have not been independently verified."
  }
}];
