# ln-ashlar Operational Mindset

> Complements `docs/architecture/philosophy.md` — that document covers the strategic *why* (historical cycles, SPA vs SSR, security, longevity). This document is the operational doctrine for contributors and AI agents: eleven concrete principles that explain how the library behaves and why decisions are made the way they are.

---

## 1. Markup Is the Application

**Mainstream way:** JS frameworks build UI chrome at runtime. React renders nav, modals, dropdown options from component state. If you inspect the initial HTML, it is an empty shell.

**Ashlar way:** HTML is authored, complete, and semantic. JS never creates UI chrome — buttons, labels, option lists, popover content. `<template>` exists for data-driven row repetition only, not for UI structure.

**Why:** Server-renderable, inspectable, accessible by default. Zero FOUC on UI chrome. Developers can read the full interface from source without running JS.

**Concrete example:**
- `demo/admin/src/pages/table-filter.html` — filter popovers are complete HTML, authored once, no JS generation.
- `<template data-ln-template="documents-row">` in `demo/admin/src/pages/table-sync.html` — row templates are the *sole* `<template>` use case.

---

## 2. SSR and SPA Share Identical Markup

**Mainstream way:** SSR renders HTML; hydration replaces it with JS-rendered equivalents. The structure differs between server output and client component tree.

**Ashlar way:** The same HTML is authored whether using Blade, a JS page, or a data layer. Only the data source differs; structure is identical.

**Why:** No hydration cost, no structure mismatch, progressive enhancement is free.

**Concrete example:**
`demo/admin/src/pages/table-filter.html` (SSR pattern) and `demo/admin/src/pages/table-sync.html` (data-driven) share the same `<th>`, `[data-ln-popover]`, `[data-ln-filter]` markup. The table body is the only difference.

---

## 3. Behavior Is Attached, Not Owned

**Mainstream way:** Components own their behavior — a `<Modal>` renders its own close button, manages its own state, knows its own children. Components import each other.

**Ashlar way:** Autonomous IIFE components bind via `data-ln-*` attributes, auto-init via MutationObserver, communicate via CustomEvents addressed by element `id`. No parent-child coupling, no props, no imports between components. DOM position is irrelevant to wiring — teleport-safe by design.

**Why:** A filter inside a popover teleported to `<body>` still dispatches `ln-filter:changed` on `getElementById(tableId)`. The components have no idea they were moved.

**Concrete example:**
- `js/ln-popover/src/ln-popover.js:91` — teleports the entire popover block to `<body>` on open.
- `js/ln-filter/src/ln-filter.js:293` — `_dispatchOnBoth` dispatches on `getElementById(this.targetId)`. Works regardless of DOM position.

---

## 4. CSS Owns All Presentation Including States

**Mainstream way:** JS toggles `style=""` for show/hide, inline transforms for animation, class names encode visual variants (`.btn--danger`, `.modal--large`).

**Ashlar way:** JS only toggles `.ln-*` state classes or semantic attributes. CSS translates those to visual output. Zero inline styles. `data-ln-*` hooks are behavior wiring — never CSS styling selectors.

**Why:** Single source of truth for appearance. Design token changes propagate automatically. Inspector shows clean semantic markup. Changing a color means editing one token, not hunting JS files.

**Concrete example:**
`.ln-filter-active` on the filter button → `@mixin table-filter-active` in `scss/config/mixins/_table.scss` renders the accent dot and color change. JS does `btn.classList.toggle('ln-filter-active', ...)`. SCSS owns what that looks like. The `[data-ln-table-col-filter]` attribute is a JS id hook for finding the button — it is never a CSS selector.

---

## 5. Composition Over Features

**Mainstream way:** A "filterable table" is a monolithic table component with built-in filter UI — dropdowns, chips, clear button, all owned by one component.

**Ashlar way:** A "table filter" is `ln-popover` + `ln-search` + `ln-filter` composing together, with `ln-table` merely consuming one event (`ln-filter:changed`). Big components do not grow features; they expose events.

**Why:** Each component is independently testable and reusable. `ln-filter` works for card grids. `ln-popover` works for any overlay. Neither knows about the other.

**Concrete example:**
The column filter unification deleted ~145 lines from `ln-table` — the feature still exists via composition. Zero new code in `ln-table`.

---

## 6. Domain Truth Lives at the Source

**Mainstream way:** Filter options are derived from the visible dataset: `[...new Set(rows.map(r => r.category))]`.

**Ashlar way:** Options come from the domain owner — a backend enum, a lookup table — rendered into markup. An option with zero matching records must be expressible.

**Why:** "What is possible" ≠ "What currently exists in the visible window." Dataset derivation breaks under pagination (only page 1 values are visible), creates filter circularity (filtering changes which options appear), and hides valid domain states.

**Concrete example:**
`demo/admin/src/pages/table-filter.html` — the "Legal" department option exists even if no current employee has that department. The backend enum owns the truth, not the data window.

---

## 7. Raw vs Formatted — Never Sort or Filter Displayed Text

**Mainstream way:** Filter and sort read `td.textContent` — whatever the display layer rendered.

**Ashlar way:** `data-ln-value` on cells and `data-ln-filter-value` on checkboxes carry machine values. `td.textContent` is presentation only. Sorting and filtering never read formatted text.

**Why:** Formatted numbers (`"$1,234.56"`), dates (`"Apr 12, 2026"`), and status badges (`"● Active"`) are not correctly sortable or matchable as text. The raw value is the truth.

**Concrete example:**
A salary cell carries `data-ln-value="120000"` while displaying `"$120,000"`. A filter checkbox carries `data-ln-filter-value="active"` while the badge displays `"● Active"`.

---

## 8. Out of the Box — Core Owns All Standard Compositions

**Mainstream way:** Each project patches its own CSS to fix framework gaps for common compositions.

**Ashlar way:** Core must cover all standard compositions. If a consumer project had to write a local SCSS patch for a layout that core should provide, that is a doctrine violation — the fix belongs in core.

**Why:** Per-project patches scatter fixes, diverge over time, and become tech debt. The library is only complete when consumers can compose standard patterns without patching.

**Concrete example:**
The column filter unification added filter popover content styling (checkbox list layout, optional search input spacing) to `scss/config/mixins/_popover.scss`. No consumer project needs a local patch for this layout.

---

## 9. Lean JS — Misuse Is a CSS Affordance, Not a Console Warning

**Mainstream way:** Developer misuse triggers `console.warn()`. Behavior errors throw exceptions. JS files grow with defensive runtime checks.

**Ashlar way:** Zero dependencies, minimal abstractions. JS is thin. Developer misuse surfaces via CSS `::after` affordances in dev mode — a visual signal on the page, not noise in the console. Exceptions never break the page.

**Why:** Console warnings disappear unnoticed. A red `::after` label on the broken element is impossible to miss during development, requires zero JS, and costs nothing in production when the pattern is used correctly.

**Concrete example:**
A component that requires an `id` on its target and does not find one:

```scss
/* In component stylesheet — dev-only affordance */
[data-ln-filter]:not([data-ln-filter=""]):not([id]) {
	&::after {
		content: "⚠ data-ln-filter target id missing";
		color: red;
		display: block;
	}
}
```

No `console.warn`. No thrown error. The developer sees the warning on the page.

---

## 10. Declarative Wiring Over Coordinators

**Mainstream way:** "Edit this row → open a modal → fill the form" is hand-wired in JS — a click handler stashes the record in a variable, opens the modal, a second handler copies fields into inputs. What a button does is invisible in the markup; you must read the JS to know.

**Ashlar way:** The trigger *declares* the whole flow in attributes — `data-ln-modal-for` opens, `data-ln-fill-form` + `data-ln-fill-*` fill the form, `data-ln-modal-*` set the title. No coordinator. The record rides in the DOM, visible in DevTools. JS is reserved for what the platform genuinely cannot express — submit-to-store, conflict resolution, programmatic fills.

**Why:** Declared behavior has nothing to maintain, is inspectable, and is teleport-safe. A coordinator for the common case is code you read, test, and keep in sync. Deleting it is not losing a feature — it is the feature done right.

**Concrete example:**

```js
// BEFORE — coordinator JS, re-written on every CRUD page
let pendingRecord = null;
table.addEventListener('ln-table:row-action', e => {
	if (e.detail.action !== 'edit') return;
	pendingRecord = e.detail.record;
	modal.setAttribute('data-ln-modal', 'open');
});
modal.addEventListener('ln-modal:before-open', () => {
	window.lnCore.lnFill(modal, pendingRecord);
	modal.dataset.lnModalMode = pendingRecord ? 'edit' : 'new';
	pendingRecord = null;
});
```
```html
<!-- AFTER — zero coordinator JS. The row template stamps per-row values. -->
<button data-ln-table-row-action="edit"
		data-ln-modal-for="pkg-modal" data-ln-modal-name="{{ name }}"
		data-ln-fill-form="pkg-form"
		data-ln-fill-id="{{ id }}" data-ln-fill-name="{{ name }}">Edit</button>
```

The four CRUD demos shed ~60 lines of identical coordinator JS this way (see `js/ln-fill/README.md`). A field whose `name` is the backend column (`max_users`) carries `data-ln-fill-as="maxUsers"` to match the camelCased trigger key — `name` stays the wire, the fill key is decoupled.

**Where the coordinator still earns its place:** when the fill is *not* a user click — store conflict resolution, an import workflow, a deep-link pre-fill. Then `window.lnCore.lnFill(el, record)` dispatched from an event handler is correct. The rule: **click-triggered → declarative; programmatic → coordinator.**

**Corollary — reach for the platform first.** This layer invents nothing: `data-*` read via `dataset` (camelCased for free), attribute writes via `setAttribute`, native `form.reset()`. Before building a bespoke mechanism, check whether the browser already is one. "Don't reinvent hot water."

---

## 11. Case Study — The Filter-Clipping Saga

### Symptom

Per-column filter dropdowns clipped by `overflow: clip` in the `table-base` mixin (`scss/config/mixins/_table.scss`) and `overflow-x: auto` on `[data-ln-table]` (`scss/config/mixins/_ln-table.scss`).

### Disease

Three divergent implementations existed (SSR popover, data-driven dropdown builder, SPA options-attribute path). The "fix" kept being re-applied in different ways because the root cause was never addressed. JS was generating UI chrome (the dropdown markup). Any in-tree mounting position clips against the overflow stacking context.

### Cure

Static authored popover markup (`ln-popover`) placed outside the clipping container and teleported to `<body>` on open. `ln-filter` handles mutual exclusion and dispatches to the table by `id`. `ln-table` consumes one event. The table has no filter UI code.

The three divergent code paths collapsed into one authored HTML pattern. ~145 lines removed from `ln-table`. The feature became more capable (no clipping, teleport-safe, domain-driven options) by having *less* code.

### Lesson

When a feature requires fighting the DOM (overflow hacks, `z-index` wars, `position: fixed` workarounds), question whether the feature belongs where it is. The DOM is not an obstacle — the architecture is wrong.
