# Plan: Template syntax docs — eliminate `{{ }}` vs `data-ln-field` ambiguity

## Context (why)

AI agents (and humans) keep using `data-ln-field="title"` inside `ln-table` row
templates, where it is a **silent no-op**. Verified ground truth:

- `{{ field }}` → processed by `fillTemplate()` (`js/ln-core/helpers.js:155`).
  Text nodes only, **one-shot at clone time, placeholder consumed**, never
  re-runs. Called by `renderList` on fresh clones only (helpers.js:194) and by
  `ln-table` `_fillRow` (`js/ln-table/src/ln-table.js:977`).
- `data-ln-field` → processed **only** by `fill(root, data)`
  (`js/ln-core/helpers.js:95`). Re-runnable, but **nothing calls `fill()`
  automatically** — a component must call it explicitly (e.g. inside a
  `renderList` `fillFn`).
- `ln-table`'s row pipeline (`_fillRow`) calls `fillTemplate()` + the
  `data-ln-table-cell-attr` handler and **never** `fill()` → `data-ln-field`
  inside a row template is inert: present in DOM, read by nobody, no warning.
- `fill()` never processes `{{ }}`; `fillTemplate()` never processes
  `data-ln-field`. Two separate systems.

The docs currently distinguish the two by *location* ("inline text" vs
"element content") — a rule both options satisfy for any text cell — and
`docs/js/core.md:117-118` even claims they "can be mixed in the same template
… without extra code", which is false for `ln-table`. This plan replaces the
location-based framing with the ownership/lifecycle rule:

> **Who fills this element, and when?** Renderer fills it once at clone time
> → `{{ field }}` / `data-ln-table-cell-attr`. Your own code calls `fill()`
> on it (initial + every update) → `data-ln-field` & friends.

## Hard scope limits

- Edit ONLY the 6 files listed below. Do NOT touch `.claude/**`, `js/**/src/`,
  `scss/`, `demo/`, `dist/`.
- Markdown only — **no `npm run build`, no tests, no git**.
- Match each file's existing formatting conventions (callout style, list
  markers, heading levels). Use **tabs** for indentation inside HTML code
  fences.
- Where an anchor string below differs trivially from the file (whitespace,
  punctuation), adapt the anchor — but the inserted/replacement text stays as
  written here.

---

## Edit 1 — `docs/js/core.md` (fillTemplate section)

**1a.** Find these two bullets (currently lines 117-118, verified verbatim):

```
- Coexists with `fill()` — `{{ key }}` for inline text, `data-ln-field` for element content. Both patterns are valid and can be mixed in the same template
- Called automatically by `renderList` after cloning — templates can use `{{ key }}` text nodes alongside `data-ln-field` elements without extra code
```

Replace them with:

```
- **Different system from `fill()` — not interchangeable.** `fillTemplate` consumes `{{ key }}` placeholders once, at clone time; after that the text is plain and never updates. `data-ln-field` is read only by `fill()`, and `fill()` runs only where a component explicitly calls it. Neither function processes the other's syntax.
- Called automatically by `renderList` on freshly cloned elements only — on keyed re-renders the placeholders are already consumed, so `{{ key }}` values never update. Values that must update on re-render belong in your `fillFn` (e.g. `fill()` + `data-ln-field`).
- **`ln-table` row templates never call `fill()`** — rows support `{{ field }}` and `data-ln-table-cell-attr` only; a `data-ln-field` inside a row template is silently ignored. Decision matrix: `docs/architecture/data-flow.md` §5.
```

**1b.** In the `fill(root, data)` section of the same file (heading around line
81, "Declarative DOM Binding"), append ONE bullet to that section's existing
rules/notes list (or, if it has no list, add as a short standalone paragraph at
the end of the section):

```
- Nothing calls `fill()` automatically — a component must call it explicitly, and re-call it to update. Renderer pipelines that clone templates (`ln-table` rows, `renderList`'s clone pass) do not call `fill()`; inside those templates use `{{ field }}` instead. `fill()` does not process `{{ }}` placeholders.
```

---

## Edit 2 — `docs/architecture/data-flow.md` (rewrite §5)

Replace the ENTIRE section starting at the heading
`## 5. Template syntax — `{{ }}` vs `data-ln-table-cell-attr`` (around line
324) down to — but NOT including — the next `## ` heading, with the block
below. Do not carry over any of the old §5 text (including the old renderer
list in the intro).

````markdown
## 5. Template syntax — `{{ }}` vs `data-ln-table-cell-attr` vs `data-ln-field`

ln-ashlar has three data-to-DOM mechanisms. They look similar in markup but
belong to **two different systems with different owners and lifecycles** —
mixing them up produces silent no-ops, not errors. The deciding question is
never *"text or element?"* — it is:

> **Who fills this element, and when?**

- **A renderer fills it once, at clone time** (`ln-table` rows, `renderList`'s
  clone pass) → `{{ field }}` for text, `data-ln-table-cell-attr` for
  attributes.
- **Your component code fills it, on every update** (an explicit
  `fill(root, data)` call) → `data-ln-field` / `data-ln-attr` /
  `data-ln-show` / `data-ln-class`.

### 5.1 `{{ field }}` — one-shot text stamp at clone time

Processed by `fillTemplate(clone, data)` (`ln-core/helpers.js`). Walks text
nodes, replaces `{{ field }}` with `record[field]`, and **consumes the
placeholder** — the element can never re-update from data afterwards. Runs at
clone time inside renderer pipelines (`ln-table` rows, `renderList`'s clone
pass); never runs on live DOM updates.

Use for all static text content inside cloned templates.

### 5.2 `data-ln-table-cell-attr="field:attr"` — one-shot attribute stamp

Processed by the renderer (`ln-table` `_fillRow`) once per cloned row. Sets
`el.setAttribute(attr, record[field])`. The attribute-mapping twin of `{{ }}`
— same owner, same lifecycle.

### 5.3 `data-ln-field` — re-runnable binding, requires an explicit `fill()` caller

**Not a template syntax.** `data-ln-field` (with `data-ln-attr`,
`data-ln-show`, `data-ln-class`) is processed only by `fill(root, data)` —
and nothing calls `fill()` automatically. It works exactly where component
code explicitly calls `fill()` and re-calls it on updates (e.g. `ln-filter`,
`ln-options`, a `renderList` `fillFn`, modal prefill).

The render pipelines that process `{{ }}` **never call `fill()`**: a
`data-ln-field` inside an `ln-table` row template is inert — present in the
DOM, read by nobody, silently ignored.

### 5.4 Decision matrix

| Need | Use | Processed by | Lifecycle |
| --- | --- | --- | --- |
| Text content inside a cloned template (table row, list item) | `{{ field }}` | `fillTemplate()` | once, at clone |
| Attribute on an element inside a cloned row | `data-ln-table-cell-attr="field:attr"` | renderer (`_fillRow`) | once, at clone |
| Text / attribute / visibility on an element your code re-fills on updates | `data-ln-field` (+ `data-ln-attr` / `data-ln-show` / `data-ln-class`) with an explicit `fill()` call | `fill()` | every `fill()` call |

### 5.5 The trap — `data-ln-field` inside a row template

```html
<!-- ❌ WRONG — inert. ln-table runs fillTemplate() + cell-attr only;
     fill() never runs here, so data-ln-field is read by nobody. -->
<template data-ln-template="products-row">
	<tr data-ln-table-row>
		<td data-ln-field="title"></td>   <!-- stays empty, no error -->
	</tr>
</template>

<!-- ✅ RIGHT -->
<template data-ln-template="products-row">
	<tr data-ln-table-row>
		<td>{{ title }}</td>
		<td><a data-ln-table-cell-attr="url:href">{{ name }}</a></td>
	</tr>
</template>
```

Litmus test: *is this element born from a `<template>` clone filled by a
renderer?* → `{{ }}` / `data-ln-table-cell-attr`. *Does my own code call
`fill()` on it?* → `data-ln-field`.
````

---

## Edit 3 — `docs/v2-reactive.md` (data-ln-field section)

In the `data-ln-field` binding section (around lines 83-95) there is an
existing `> [!IMPORTANT]` callout titled "**`data-ln-field` is NOT a Custom
Component**". Insert a new callout IMMEDIATELY AFTER that IMPORTANT callout:

```markdown
> [!WARNING]
> **`data-ln-field` works only where `fill()` runs — and nothing calls `fill()` automatically.**
> A component must call `fill(root, data)` explicitly, and re-call it to update. Template
> render pipelines never do: `ln-table` row templates and `renderList`'s clone pass process
> `{{ field }}` text placeholders instead, so a `data-ln-field` inside such a `<template>`
> is silently ignored. Decision matrix: `docs/architecture/data-flow.md` §5.
```

---

## Edit 4 — `docs/js/table.md`

Near the top of the file, the row-template rendering is described and
`fillTemplate` / `{{ field }}` is mentioned (around lines 20-22). Insert this
paragraph immediately AFTER the paragraph/block that mentions `fillTemplate`:

```markdown
Row templates support exactly two substitution syntaxes: `{{ field }}` (text,
one-shot at clone) and `data-ln-table-cell-attr="field:attr"` (attributes,
one-shot at clone). The row pipeline never calls `fill()`, so `data-ln-field`
inside a row template is silently ignored — that binding is for explicitly
`fill()`-driven regions, not for rows. See `docs/architecture/data-flow.md` §5.
```

---

## Edit 5 — `js/ln-table/README.md`

In the row-template section (the `<template data-ln-template="products-row">`
blueprint example, around lines 58-66), insert immediately AFTER that example
block (match the README's existing callout/note style; if none, use a `>`
blockquote):

```markdown
> Row templates support `{{ field }}` (text) and
> `data-ln-table-cell-attr="field:attr"` (attributes) only — both stamped once
> at clone time. `data-ln-field` is **not** processed in rows (the row
> pipeline never calls `fill()`); it would sit inert in the DOM.
```

---

## Edit 6 — `CLAUDE.md` (project root — Quick Navigation table)

In the "Quick Navigation / Reference Directory" table, add one row after the
"SCSS Architecture / Layers" row (or in a sensible adjacent position):

```markdown
| **Template syntax: `{{ }}` vs `data-ln-field` (decision matrix)** | [docs/architecture/data-flow.md](docs/architecture/data-flow.md) §5 |
```

---

## Acceptance criteria

1. `docs/js/core.md` contains NEITHER "can be mixed in the same template" NOR
   "without extra code".
2. The phrase "silently ignored" appears in: `docs/js/core.md`,
   `docs/architecture/data-flow.md`, `docs/v2-reactive.md`,
   `docs/js/table.md`. (README.md uses "inert" — also fine there.)
3. `docs/architecture/data-flow.md` §5 has the three-way heading, a
   `### 5.4 Decision matrix` table containing a `data-ln-field` row, and a
   `### 5.5` block containing `❌ WRONG`.
4. `docs/v2-reactive.md` contains a `[!WARNING]` callout in the
   `data-ln-field` section.
5. Root `CLAUDE.md` quick-nav table has the new Template syntax row.
6. No other files modified; no build run.

Report PASS/FAIL per edit with file:line of each change.
