# Prompt for documents, tables, and verifiable numbers

Decide whether the task is extraction, calculation, interpretation, or presentation. Combining them without explicit checks makes it easy for a missing row or guessed field to become a polished conclusion.

## Extract before interpreting

Ask for a fixed set of fields, source locations, and explicit missing values. Preserve identifiers as text where leading zeros matter. Define dates, units, currencies, and time zones. If a source is a scan or screenshot, require the assistant to mark unreadable cells rather than infer them from nearby rows.

```text
From this synthetic renewal table, extract vendor ID, renewal date, notice
period, owner role, currency, and annual amount. Preserve one row per source
record, including duplicates. Use null for absent fields and report the source
row. Do not guess dates or exchange rates. Then identify records that cannot
be evaluated and explain which missing field prevents the calculation.
```

For PDFs, clarify whether the task includes tables, appendices, images, and footnotes. For spreadsheets, distinguish stored values, formulas, displayed formatting, and hidden or filtered records. Ask for the sheet and range used. A screenshot of visible rows does not prove the workbook's full population.

## Define calculations

State the formula and edge behavior. For a notice deadline, specify calendar days or business days and the source of any holiday calendar. For counts, define the population, duplicates, missing records, and whether the result counts users, accounts, licenses, or assignments. These may not be interchangeable.

Use a calculation tool when available and ask for enough method detail to reproduce the result. Reconcile input row counts, output row counts, excluded records, and totals. A second calculation performed independently is more informative than asking the same model whether its first answer “looks right.”

## Use structure where another system consumes the output

A chat prompt can ask for JSON or a table, but downstream software should validate the structure and values before acting. Where an API supports schema-constrained output, use that feature and handle its errors or refusals. Valid JSON can still contain incorrect facts or unauthorized instructions. Validate required fields, enums, date validity, identifiers, and business rules separately.

Example result contract:

```json
{
  "record_id": "EX-RENEWAL-01",
  "notice_deadline": null,
  "status": "needs_review",
  "reason": "notice period missing",
  "source_ref": "synthetic-sheet:row-2"
}
```

This is an illustrative data shape, not a provider-specific API request.

## Treat visual inputs as bounded observations

For a screenshot, ask what is visible and what remains off-screen or ambiguous. For an architecture diagram, ask the model to distinguish drawn connections from inferred ones. For audio or meeting notes, separate a proposed action from an agreed action and an assigned owner from a person merely mentioned. Obtain the relevant authority before recording or sharing real conversations.

## Review the artifact, not just its description

Reopen the generated document or spreadsheet. Check that tables fit, formulas work, dates retain meaning, links resolve, and omitted data is disclosed. Confirm the output file exists and contains the intended result. “Created a workbook” and “verified its contents” are different claims.

Source context: [Google prompt design](https://ai.google.dev/gemini-api/docs/prompting-strategies) discusses output format and structured-output support. The checks above are proposed operating practices; specific file capabilities depend on the host.
