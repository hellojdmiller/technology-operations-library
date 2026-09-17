# Diagnose the failure before adding more prompt text

Save the input and output that failed, then identify the layer responsible. Prompt wording, missing evidence, retrieval, tools, permissions, model capability, and integration code can fail differently. Repeating “be accurate” will not repair an unreadable attachment or a broken API call.

| Symptom | Likely check | A useful adjustment |
|---|---|---|
| Generic answer | Is the decision and audience clear? | Specify the deliverable and the practical question it must answer |
| Invented facts | Was the needed evidence supplied or retrieved? | Require source locations and an explicit unavailable-evidence outcome |
| Too much text | Are format and audience needs defined? | Set a useful length and the required sections; remove redundant rules |
| Missing records | Was the full input population available? | Reconcile record counts and exact IDs before synthesis |
| Wrong voice | Are the style examples clear and consistent? | Provide two approved excerpts and concrete editorial feedback |
| Unsafe action attempt | Do tools grant broader authority than the task needs? | Restrict permissions and destinations in the host; revise the action contract |
| Repeated questions | Is a consequential decision genuinely missing? | Supply it, or define where a labeled assumption is acceptable |
| Stops at a plan | Does the task authorize implementation and define completion? | State the permitted work and the evidence required to finish |
| Endless work | Is there a stopping rule? | Define sufficient evidence, attempt limits, and escalation conditions |
| Correct prose, invalid JSON | Is the receiving application validating output? | Use supported structured output and schema/business-rule validation |
| Works in one model only | Does it depend on host tools, settings, or hidden context? | Test a portable core and keep host setup instructions separate |
| Still fails after several revisions | Is prompting the right intervention? | Improve the data, retrieval, tool design, or operating scope; consider another model using the same evaluation |

## A focused repair prompt

```text
The draft below incorrectly says the restore was verified. The source only
shows that files were retrieved; permission checks were not performed.
Revise that conclusion and any dependent recommendation. Preserve the useful
structure. Identify the evidence still needed, and do not introduce new facts.
```

This feedback identifies an observable defect and the affected scope. It is more actionable than asking for a “more rigorous” answer without explaining what failed.

## Know when to stop tuning

Stop when the result meets the agreed use, the material failures are resolved, and remaining limitations are accepted for that scope. If the assistant cannot access evidence, cannot reliably follow an essential boundary, or needs tools the host does not provide, narrow the task or change the design. Repeatedly expanding the prompt can increase cost and contradictions without solving the problem.

Avoid magic phrases, reward offers, threats, or a permanent “expert” persona as substitutes for a clear task. Do not assume a universal temperature, context length, or reasoning setting works across products. Use current model-specific guidance and measured results for settings that are actually exposed.

Return to the [evaluation chapter](08-evaluate-and-improve.md) after a meaningful change, preserving the failed case as a regression example.
