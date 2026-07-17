# MCP Parser Change Spec — Explicit None-Declaration for §3 Sub-sections

> **Audience:** maintainer of the `ln-ashlar` MCP server parser
> (`validate_docs` tool / `tools/ashlar/lint-cli.js`), which lives in the
> **server package** (`/home/mcp/server/...`), NOT in the ln-ashlar repo.
> This file is co-located with the docs corpus (underscore prefix → not
> indexed) purely as the change brief. Apply the two rule changes below to
> the server-side parser so the corpus convention validates.

## Why

The corpus convention now requires that, in `simple` and `coordinator`
documents, §3 ("3. Declarative API Contract (Attributes & Events)") always
contains BOTH `### Attributes Table` and `### Events API`. When a component
has no configuration attributes (or no custom events), the sub-section holds
an explicit one-sentence none-declaration **instead of** a table. The current
parser rejects that with `"Section '<X>' is missing its expected table"`.

## Rule 1 — RELAXATION (required)

For each of the sub-headings `### Attributes Table` and `### Events API`:

1. Delimit the **section body**: from the sub-heading line to the next `###`
   or `##` heading (or EOF).
2. Detect a **pipe-table**: a header row `| … |` immediately followed by a
   separator row `|---|…|`.
3. **If a table is present** → validate its columns exactly as today:
   - Attributes: `[Attribute, Element, Type / Values, Default, Description]`
   - Events: `[Event, Direction, Cancelable, Description, `detail` Object]`,
     with every `Direction` cell ∈ `{Emits, Listens}`.
4. **If NO table is present** → the section is valid **iff** its body contains
   at least one non-empty, non-whitespace line (the none-declaration).
   - Body empty (only blank lines before the next heading) → error:
     `"<Heading> present but empty — add the normative table or an explicit none-declaration sentence."`
5. This **replaces** the current unconditional
   `"Section '<Heading>' is missing its expected table"`.

The none-declaration is free prose (one sentence recommended); no
column/format validation beyond "non-empty".

## Rule 2 — ENFORCEMENT (required for this rollout)

For documents with `classification: simple` or `coordinator`:

- §3 MUST contain BOTH `### Attributes Table` and `### Events API`.
- Missing either → error:
  `"Section 3 must contain both '### Attributes Table' and '### Events API' (simple/coordinator)."`

`service` documents are **exempt** from both rules — their §3 is a functions
API of a different shape. Do not apply the table/none logic to a `service`
doc's §3.

## Sequencing (important)

Rule 2 makes any currently-valid simple/coordinator doc that omits a
sub-section newly-INVALID. The docs-mcp corpus sweep that adds the missing
sub-sections must be committed and re-pulled by the server **before or
together with** enabling Rule 2, otherwise those docs will fail. Rule 1 is
safe to enable at any time.

## Canonical none-declaration sentences (authoring convention, NOT parser-enforced)

- Attributes: `This component reads no data-ln-* configuration attributes.`
- Events: `This component emits and listens to no custom ln-* events.`

## Test cases (input → expected)

| §3 sub-section content | Before | After |
|---|---|---|
| `### Attributes Table` + valid normative table | PASS | PASS |
| `### Attributes Table` + none-sentence, no table | FAIL ("missing table") | **PASS** |
| `### Attributes Table` + empty body | FAIL ("missing table") | FAIL ("present but empty") |
| simple doc missing `### Events API` entirely | PASS | **FAIL** (Rule 2) |
| `service` doc (e.g. positioning) §3 = functions table, no Attr/Events headings | PASS | PASS (exempt) |
