// n8n Code node: Run Once for All Items. No external calls.
const items = $input.all();
if (items.length === 0) {
  return [{ json: { status: "invalid_input", issues: ["No run records supplied."] } }];
}

return items.map((item, index) => {
  const input = item.json ?? {};
  const issues = [];
  const text = value => typeof value === "string" && value.trim().length > 0;
  if (!text(input.runId)) issues.push("A runId is required.");
  for (const field of ["expectedIds", "observedIds"]) {
    if (!Array.isArray(input[field]) || input[field].some(id => !text(id))) {
      issues.push(`${field} must be an array of nonblank strings.`);
    }
  }
  if (issues.length > 0) {
    return { json: { runId: text(input.runId) ? input.runId : null, status: "invalid_input", issues }, pairedItem: { item: index } };
  }

  const duplicates = values => {
    const seen = new Set();
    const repeated = new Set();
    for (const value of values) {
      if (seen.has(value)) repeated.add(value);
      seen.add(value);
    }
    return [...repeated];
  };
  const expected = new Set(input.expectedIds);
  const observed = new Set(input.observedIds);
  const missingIds = [...expected].filter(id => !observed.has(id));
  const unexpectedIds = [...observed].filter(id => !expected.has(id));
  const duplicateExpectedIds = duplicates(input.expectedIds);
  const duplicateObservedIds = duplicates(input.observedIds);
  if (expected.size === 0) issues.push("Expected scope is empty; establish the intended result.");
  if (!text(input.evidenceRef)) issues.push("An evidence reference is required for review.");
  if (missingIds.length) issues.push("Expected records are missing.");
  if (unexpectedIds.length) issues.push("Observed records fall outside the expected scope.");
  if (duplicateExpectedIds.length || duplicateObservedIds.length) issues.push("Duplicate IDs require review.");

  return {
    json: {
      runId: input.runId,
      status: issues.length ? "needs_review" : "matched",
      expectedCount: input.expectedIds.length,
      observedCount: input.observedIds.length,
      missingIds, unexpectedIds, duplicateExpectedIds, duplicateObservedIds,
      evidenceRef: text(input.evidenceRef) ? input.evidenceRef : null,
      issues,
      limitation: "Compares supplied IDs only. Evidence is referenced, not independently verified; permissions, field values, and workflow usability still need review."
    },
    pairedItem: { item: index }
  };
});
