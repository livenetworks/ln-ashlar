# Plan: Table Filter Popover Unification

**Date:** 2026-06-12
**Status:** Ready for execution
**Scope:** js/ln-table, demo pages, docs, CLAUDE.md

---

## Decision Record Summary

Three divergent column-filter implementations are unified onto static authored
popover markup. The internal `_openFilterDropdown` / `_closeFilterDropdown` / 
`_getUniqueValues` / `_applyFilterMutualExclusion` / `_onFilterChange` / 
`_onFilterClick` machinery in ln-table is deleted entirely. ln-filter and 
ln-popover handle UI; ln-table only consumes `ln-filter:changed`.

The indicator convention is unified on `.ln-filter-active` on the funnel `<button>`
(not on the `<th>`). The existing `@mixin table-filter-active` in
`scss/config/mixins/_table.scss` already styles exactly this: it applies
`color: var(--color-accent)` and renders the dot via `::after` on the element
it is applied to. The element it is applied to is `.table-filter` (i.e., the
`<button class="table-filter">`). The dot and color are already implemented; we
only need JS to toggle `.ln-filter-active` on the button (not `data-ln-table-filter-active`
on the `<th>`).

---

## Exact Code Investigation Results

### Data-driven mode — no `ln-filter:changed` listener today

Lines 100–484 of `js/ln-table/src/ln-table.js`:
- Data-driven branch (if `isDataDriven`, starts ~line 107): sets up `_onSetData`,
  `_onSortClick`, `_onFilterClick` (the dropdown builder). **No `ln-filter:changed` 
  listener in this branch.**
- SSR branch (else, starts ~line 356): sets up `_onSearch`, `_onSort`,
  `_onColumnFilter` → `dom.addEventListener('ln-filter:changed', this._onColumnFilter)`,
  and `_onClear`.

**Consequence:** After deletion of the dropdown machinery, the data-driven branch must
also wire `ln-filter:changed` → a unified `_onColumnFilter`. The two branches differ in
render method: SSR calls `_render()` directly; data-driven calls `_requestData()`. The
unified handler must branch on `this.isDataDriven`.

### `_onColumnFilter` — current SSR implementation (lines 405-446)

Uses `th.setAttribute('data-ln-table-filter-active', '')` / `th.removeAttribute(...)` 
for indicators. Must be changed to toggle `.ln-filter-active` on the `<button>` found
via `th.querySelector('[data-ln-table-col-filter]')`.

### `_updateFilterIndicators` — data-driven path (lines 1097-1108)

Already uses `btn.classList.toggle('ln-filter-active', !!hasFilter)` correctly.
This method is called from the data-driven rendering pipeline. It stays untouched,
and becomes the model for what `_onColumnFilter` must also do.

### `_onClear` — SSR path (lines 448-482)

Removes `data-ln-table-filter-active` from all `ths` (line 461).
Must be updated to instead remove `.ln-filter-active` from all filter buttons.
The document-wide `[data-ln-filter="..."]` query at line 464 is already teleport-safe.

### Destroy cleanup

- Data-driven branch destroy (lines 1473-1491): removes `_onFilterClick`, 
  `_onDocClick`, closes dropdown.
- SSR branch destroy (lines 1493-1500): removes `_onColumnFilter`, `_onClear`.

After the change: data-driven destroy must add `_onColumnFilter` removal (shared),
and must drop `_onFilterClick`, `_onDocClick`, `_closeFilterDropdown()`.

### `_filterOptions` / `_updateFilterOptions`

These live in the data-driven path and support the old derivation path 
(`data-ln-table-filter-options` attribute on the th button). They are only used
by `_getUniqueValues` which feeds `_openFilterDropdown`. Once `_openFilterDropdown`
is deleted, `_filterOptions` and `_updateFilterOptions` become dead code. Delete them.

### Indicator element: the `<button>` not the `<th>`

`@mixin table-filter-active` in `scss/config/mixins/_table.scss` (lines 316-330)
places the dot via `::after` with `position: relative` on the element — it must
be applied to the `<button>`, which already has `position: relative` from
`@mixin table-filter`. The `<th>` does not have the positioning context.
The `[data-ln-table-col-filter]` attribute stays as a JS identification hook
(finding the button); it must never be used as a CSS selector.

### SCSS filter-popover content styling

The `table-filter.html` reference page uses `<nav data-ln-filter="...">` with
bare `<label><input>` children directly inside the `[data-ln-popover]` container.
The `gls` consumer had a local `_tables.scss` patch for this layout (evidenced by
the decision record noting gls patched what core was missing). Core must now own
the layout: checkbox option list spacing, optional search input spacing above the
list, all inside a popover context. The `[data-ln-popover]` mixin/component context
must provide these. The canonical HTML to style against is in `table-filter.html`
(lines 228-265): `[data-ln-popover]` > optional `input[type="search"]` + 
`nav[data-ln-filter]` > `label > input[type="checkbox"]` + text.

**Constraint:** The plan must enforce `<ul>/<li>` for checkbox option lists (doctrine).
The existing `table-filter.html` reference page uses bare `<label>` children of `<nav>`,
not `<ul>/<li>`. The refactored demo pages must use `<ul>/<li>` inside the filter
containers. The SCSS must style `ul > li > label` inside popovers, not bare `label`.

### Demo pages inventory (old path affected)

Source pages using `data-ln-template="column-filter"` or `data-ln-table-col-filter`:

| File | Tables using old path |
|---|---|
| `demo/admin/src/pages/table-sync.html` | `hybrid-table` — 2 filtered cols (department, status) |
| `demo/admin/src/pages/coordinator.html` | `demo-docs-table` — 2 filtered cols (department, status) |
| `demo/admin/src/pages/store-usecase.html` | two tables — each has 2 filtered cols (department, status) |
| `demo/spa/index.html` | two SPA tables — packages (active), tenants (has second table) |

`demo/admin/src/pages/table-filter.html` already uses the new pattern (popovers +
ln-filter). It is the reference. It also mixes ln-dropdown (for "Status") — after
unification all columns should use ln-popover only (clipping is the exact problem
being fixed).

The `table-filter.html` status column currently uses ln-dropdown (inline in `<th>`) 
as a second pattern example. The plan owner's decision is to unify all on ln-popover.
The existing `table-filter.html` demo page must be updated to convert the Status
dropdown column to a popover as well (removes the ln-dropdown pattern from filter docs).

`demo/admin/src/pages/table-sync.html` is the protected canonical data-driven showcase.
Only the filter wiring changes; everything else stays as-is.

---

## Files Touched

### MODIFY
1. `js/ln-table/src/ln-table.js`
2. `js/ln-table/ln-table.scss`
3. `scss/config/mixins/_ln-popover.scss` (add filter content layout)
4. `scss/config/mixins/_table.scss` (verify/add `.ln-filter-active` application note)
5. `demo/admin/src/pages/table-filter.html`
6. `demo/admin/src/pages/table-sync.html`
7. `demo/admin/src/pages/coordinator.html`
8. `demo/admin/src/pages/store-usecase.html`
9. `demo/spa/index.html`
10. `js/ln-table/README.md`
11. `js/ln-filter/README.md`
12. `docs/architecture/reference.md`
13. `CLAUDE.md`

### CREATE
14. `docs/architecture/mindset.md`

---

## Phase 1 — JS: Delete Internal Filter Machinery, Unify `ln-filter:changed`

### File: `js/ln-table/src/ln-table.js`

**Step 1.1 — Delete `_onFilterClick` registration and handler (data-driven init)**

Lines ~159-178 and ~180-184 (`_onDocClick`). Remove:
- `this._activeDropdown = null;`
- The entire `this._onFilterClick = function(e) { ... };` block (~161-175)
- `this.thead.addEventListener('click', this._onFilterClick);` (~176-178)
- `this._onDocClick = function() { ... };` (~180-182)
- `document.addEventListener('click', this._onDocClick);` (~183)

**Step 1.2 — Add `ln-filter:changed` listener in data-driven init**

After the sort click listener registration (after `this.thead.addEventListener('click', this._onSortClick);`), add:

```js
dom.addEventListener('ln-filter:changed', this._onColumnFilter);
```

Note: `_onColumnFilter` is defined as a shared prototype method (Step 1.6). It
must be bound before registration. Replace the inline closure with a bound ref:
`this._onColumnFilter = this._onColumnFilter.bind(this);` in the constructor init,
then register on both branches.

Actually: the simpler approach matching the existing code style (all handlers are
closures over `self`) — define `_onColumnFilter` as a closure in the constructor
shared setup (before the `if (isDataDriven)` branch), then register it in both branches.

**Step 1.3 — Rewrite `_onColumnFilter` as a shared constructor closure**

Replace the current SSR-only `_onColumnFilter` (lines 405-446) with a unified version
that handles both modes. Place it in the constructor before the `if (isDataDriven)` 
branch so both branches can reference it:

```js
this._onColumnFilter = function (e) {
    const key = e.detail.key;
    let matchedTh = null;
    for (let i = 0; i < self.ths.length; i++) {
        if (self.ths[i].getAttribute('data-ln-table-filter-col') === key) {
            matchedTh = self.ths[i];
            break;
        }
    }
    if (!matchedTh) return;

    const values = e.detail.values;
    if (!values || values.length === 0) {
        delete self._columnFilters[key];
    } else {
        const lower = [];
        for (let i = 0; i < values.length; i++) {
            lower.push(values[i].toLowerCase());
        }
        self._columnFilters[key] = lower;
    }

    // Indicator: toggle .ln-filter-active on the funnel <button>
    const btn = matchedTh.querySelector('[data-ln-table-col-filter]');
    if (btn) {
        btn.classList.toggle('ln-filter-active', !!(values && values.length > 0));
    }

    dispatch(dom, 'ln-table:filter', {
        term: self._searchTerm,
        matched: 0,   // updated below
        total: self._data ? self._data.length : 0
    });

    if (self.isDataDriven) {
        self._requestData();
    } else {
        self._applyFilterAndSort();
        self._vStart = -1;
        self._vEnd = -1;
        self._render();
        // Re-dispatch with correct counts
        dispatch(dom, 'ln-table:filter', {
            term: self._searchTerm,
            matched: self._filteredData.length,
            total: self._data.length
        });
    }
};
```

Note: For data-driven, `_requestData()` triggers a full refresh cycle (coordinator
handles actual filtering); `_filteredData` counts aren't meaningful before the data
arrives, so the dispatch with real counts is omitted for that branch (the `ln-table:rendered`
event after `_onSetData` carries the authoritative counts). This matches the existing
data-driven event contract.

**Step 1.4 — Register `_onColumnFilter` in both branches**

- Data-driven branch (after sort listener): `dom.addEventListener('ln-filter:changed', this._onColumnFilter);`
- SSR branch (where it currently is): keep existing registration line, but the old
  inline closure is now replaced by the shared one from Step 1.3.

**Step 1.5 — Update `_onClear` indicator removal**

In `_onClear` (lines 459-461), replace:
```js
self.ths[i].removeAttribute('data-ln-table-filter-active');
```
with:
```js
const filterBtn = self.ths[i].querySelector('[data-ln-table-col-filter]');
if (filterBtn) filterBtn.classList.remove('ln-filter-active');
```

**Step 1.6 — Delete internal filter machinery (prototype methods)**

Delete these complete prototype method blocks:
- `_component.prototype._getUniqueValues` (~1093-1095)
- `_component.prototype._applyFilterMutualExclusion` (~1110-1127)
- `_component.prototype._onFilterChange` (~1129-1154)
- `_component.prototype._openFilterDropdown` (~1156-1225)
- `_component.prototype._closeFilterDropdown` (~1227-1233)

Also delete `_component.prototype._updateFilterIndicators` (~1097-1108) — replaced
by the inline toggle in the unified `_onColumnFilter`. Verify nothing else calls
`_updateFilterIndicators` before deleting (grep: only called from `_onFilterChange`
which is also deleted).

**Step 1.7 — Delete `_filterOptions` / `_updateFilterOptions`**

Search for `_filterOptions` and `_updateFilterOptions` — these feed `_getUniqueValues`.
Once the latter is gone, both are dead code. Delete them (method definitions +
the single call site in `_onSetData` which calls `self._updateFilterOptions(detail.filterOptions)`).

Also check and remove `data-ln-table-filter-options` attribute reading logic (in the
old filter button options attribute) from anywhere in the constructor or init.

**Step 1.8 — Clean up destroy()**

Data-driven destroy (lines ~1473-1491):
- Remove `this.thead.removeEventListener('click', this._onFilterClick);`
- Remove `document.removeEventListener('click', this._onDocClick);`
- Remove `this._closeFilterDropdown();`
- Add: `this.dom.removeEventListener('ln-filter:changed', this._onColumnFilter);`

SSR destroy (lines ~1493-1500):
- Keep `this.dom.removeEventListener('ln-filter:changed', this._onColumnFilter);`
- Keep `this.dom.removeEventListener('click', this._onClear);`

**Step 1.9 — Update the Escape key handler**

In `_onKeydown` (around line 335):
```js
case 'Escape':
    if (self._activeDropdown) {
        self._closeFilterDropdown();
    }
    break;
```
Delete this entire `case 'Escape':` block — `_activeDropdown` and `_closeFilterDropdown`
no longer exist. Escape on a popover is handled by ln-popover natively.

**Step 1.10 — Remove `_activeDropdown` initialization**

Remove `this._activeDropdown = null;` from the constructor (currently in Step 1.1 area).

**Step 1.11 — `currentFilters` vs `_columnFilters` alignment**

The current code uses both `self._columnFilters` (SSR branch `_onColumnFilter`) and
`this.currentFilters` (data-driven `_updateFilterIndicators`). After the unification,
the shared handler uses `_columnFilters`. The `_applyFilterAndSort` method uses
`_columnFilters` in the SSR path. Verify `_requestData` sends `this.currentFilters`
or `this._columnFilters` — grep to confirm which the coordinator reads. 

Actually: in the data-driven path, `_requestData()` dispatches `ln-table:request-data`
with `filters: this.currentFilters`. But `_onColumnFilter` writes to `_columnFilters`.
These appear to be the same object — verify by searching `currentFilters` initialization.
If they are separate, the unified handler must write to both. This is the one ambiguity
the executor must resolve by grepping: `grep -n "currentFilters\|_columnFilters" js/ln-table/src/ln-table.js`.

If `currentFilters` is a public alias and `_columnFilters` is a private store that
both point to the same object reference, only one write is needed. If they are separate,
the unified handler must sync both.

---

## Phase 2 — SCSS: Filter Popover Content Styling

### File: `scss/config/mixins/_ln-popover.scss`

Read this file first. Add a mixin (or extend an existing one) for filter content
inside a popover. The canonical HTML pattern to style:

```html
<div data-ln-popover id="filter-dept">
    <input type="search" placeholder="Search..." data-ln-search="filter-dept-list" data-ln-search-items="label">
    <ul id="filter-dept-list" data-ln-filter="my-table">
        <li><label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Engineering"> Engineering</label></li>
        <!-- Option with zero records in dataset: -->
        <li><label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Legal"> Legal</label></li>
    </ul>
</div>
```

The styling needed (owned by core, not project overrides):
- Optional `input[type="search"]` inside `[data-ln-popover]`: full-width, bottom spacing
  to separate it from the list. Use existing form input tokens — `@include form-field`
  or the search bar mixin if one exists, check first.
- `ul` inside `[data-ln-popover]`: `list-style: none; padding: 0; margin: 0;`
  max-height with `overflow-y: auto` for long lists (token-driven, e.g. 15rem or
  `var(--filter-options-max-height, 15rem)`).
- `li` inside that `ul`: no extra spacing needed (label provides it).
- `label` inside `li` inside `[data-ln-popover]`: `display: flex; align-items: center;
  gap: var(--size-xs); padding: var(--size-2xs) var(--size-sm); cursor: pointer;`
  hover: subtle bg. Use tokens, no hardcoded values.
- `input[type="checkbox"]` inside those labels: flex-shrink: 0.

**How to apply:** Per the helper-class-vs-mixin convention, use a mixin applied to
`[data-ln-popover]` selectors (or a scoped descendant selector within the existing
`[data-ln-popover]` component stylesheet). Do NOT add presentational classes to HTML.

The filter popover content styles belong in the popover component's SCSS file since
they are a composition pattern that the popover must support out of the box.

### File: `js/ln-table/ln-table.scss`

The `data-ln-table-filter-active` attribute was used as a CSS hook (violation detected
in `_onClear` and `_onColumnFilter`). After the JS changes, that attribute is no longer
set. Verify no CSS in `ln-table.scss` or `_ln-table.scss` styles via
`[data-ln-table-filter-active]`. If found, delete those rules — the indicator is now
purely via `.ln-filter-active` on the button, already handled by `@mixin table-filter-active`.

The `[data-ln-table] { overflow-x: auto }` rule in `_ln-table.scss:38` stays (needed
for horizontal scroll). Add a terse deprecation comment on the `.content:has([data-ln-table]) { overflow: visible }` rule in `ln-table.scss:4`:

```scss
// gls compat — remove when gls migrates to ln-popover filter pattern
.content:has([data-ln-table]) {
    overflow: visible;
}
```

---

## Phase 3 — Demo Pages: Replace Old Pattern with Static Popover Markup

**Template for the new popover markup pattern** (use this for all demo page updates):

```html
<!-- In <th>: data-ln-table-filter-col on the th, data-ln-popover-for on the button -->
<th data-ln-table-sort="string" data-ln-table-filter-col="department">
    Department
    <button class="table-filter" type="button" data-ln-popover-for="filter-{table-id}-dept" aria-label="Filter department">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
    </button>
</th>

<!-- Popover block outside the table wrapper (sibling to the data-ln-table element) -->
<div data-ln-popover id="filter-{table-id}-dept">
    <input type="search" placeholder="Search..." data-ln-search="filter-{table-id}-dept-list" data-ln-search-items="label">
    <ul id="filter-{table-id}-dept-list" data-ln-filter="{table-id}">
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
        <!-- ... domain options from the backend enum, including any zero-match options ... -->
    </ul>
</div>
```

**Note on `<ul>/<li>` requirement:** All demo pages updated in this plan must use
`<ul>/<li>` for checkbox option lists, matching doctrine. The existing `table-filter.html`
reference page (the one we are migrating FROM in terms of pattern documentation) uses
bare `<label>` children — this must also be updated to `<ul>/<li>`.

**Note on `data-ln-filter-col` vs `data-ln-table-filter-col`:** The `<th>` attribute
that ln-table reads for mapping a filter key to a column is `data-ln-table-filter-col`
(confirmed in `_onColumnFilter` line 409). Do not confuse with `data-ln-filter-col`
(ln-filter's own column-index attribute for plain table column filtering).

### 3.1 — `demo/admin/src/pages/table-filter.html`

This is the reference page for the new pattern. It currently has:
- Department + Role columns: already using ln-popover correctly. Update to `<ul>/<li>`
  inside the popovers, and add `data-ln-table-filter-col` to those `<th>` elements
  if missing (verify — they appear present at line 41, 52).
- Status column: currently uses ln-dropdown (inline in `<th>`). Convert to ln-popover
  pattern: move the filter options outside the table, create a `[data-ln-popover]`
  block with `<ul>/<li>` options.
- Add one option with demonstrably zero records in the dataset to one popover 
  (e.g., add "Product" to Department options — no employee has that department).
  This makes the domain-not-derived principle visible.
- Remove the "Dropdown Pattern" code example section (~lines 323-346) from the 
  documentation below the demo — replace with a note that only the popover pattern
  is canonical (ln-dropdown inside `<th>` is deprecated for filter use).
- Update "How It Works" prose to reflect the unified popover-only approach.
- Keep the "Popover Pattern" and "Search Integration" sections; update markup
  examples to use `<ul>/<li>`.

### 3.2 — `demo/admin/src/pages/table-sync.html`

Protected canonical page — **surgical changes only**.

Current state: lines ~91-99 show `<th>` elements with `data-ln-table-col-filter`
buttons (no `data-ln-table-filter-col` on the `<th>` itself for department).
Lines 256-276: `<template data-ln-template="column-filter">` block.

Changes:
1. On the Department `<th>` (line ~91): add `data-ln-table-filter-col="department"`.
   Change `data-ln-table-col-filter` button to `data-ln-popover-for="filter-hybrid-dept"`.
   Remove the old `data-ln-table-col-filter` attribute.
2. On the Status `<th>` (line ~96-98): add `data-ln-table-filter-col="status"`.
   Change `data-ln-table-col-filter` button to `data-ln-popover-for="filter-hybrid-status"`.
3. Delete the `<template data-ln-template="column-filter">` block (lines 256-276).
4. Add two `[data-ln-popover]` blocks after the `</section>` that wraps the table.
   Department options: Engineering, Finance, HR, IT, Legal, Marketing, Operations
   (domain enum — include "Legal" as a zero-records option to demonstrate the
   domain-not-derived doctrine).
   Status options: Approved, Draft, Pending, Archived.
5. Add `data-ln-search` input in each popover for the options list.

### 3.3 — `demo/admin/src/pages/coordinator.html`

Current state: line 134 has `data-ln-table-col-filter` on department and status buttons.
Lines 190-210: `<template data-ln-template="column-filter">` block.

The table id for this page: grep to find — likely `demo-docs-table` or similar (check
the `data-ln-table` wrapper id in the file around line 115-120).

Changes (same pattern as 3.2):
1. Add `data-ln-table-filter-col="department"` to Department `<th>`.
   Replace `data-ln-table-col-filter` button attribute with `data-ln-popover-for="filter-{id}-dept"`.
2. Add `data-ln-table-filter-col="status"` to Status `<th>`.
   Replace `data-ln-table-col-filter` button attribute with `data-ln-popover-for="filter-{id}-status"`.
3. Delete the `<template data-ln-template="column-filter">` block.
4. Add popover blocks after the table section.
   Department options: same domain list as table-sync.
   Status options: Draft, Pending, Approved, Archived.

### 3.4 — `demo/admin/src/pages/store-usecase.html`

Two tables on this page. Both have `data-ln-table-col-filter` on department and status.
Two `<template data-ln-template="column-filter">` blocks.

Apply the same changes as 3.3 for each table independently, using distinct popover IDs
keyed to each table's id. Include the "Legal" zero-record option in at least one table.

### 3.5 — `demo/spa/index.html`

Two tables: packages table (line 376: `data-ln-table-col="active"` with `data-ln-table-col-filter`
and `data-ln-table-filter-options` attribute) and tenants table (line ~498-499 with similar).

For SPA tables, the filter options must come from the domain enum (same principle).
The `data-ln-table-filter-options` attribute approach is part of the old derivation path
(feeds `_updateFilterOptions` / `_getUniqueValues`) — remove it.

Changes:
1. Packages table — `active` column:
   - Remove `data-ln-table-filter-options` from the `<th>`.
   - Add `data-ln-table-filter-col="active"` to the `<th>` (verify if already present).
   - Change the `data-ln-table-col-filter` button to `data-ln-popover-for="filter-packages-active"`.
   - Add static popover block after the table section:
     ```html
     <div data-ln-popover id="filter-packages-active">
         <ul data-ln-filter="packages-table-id">
             <li><label><input type="checkbox" data-ln-filter-key="active" data-ln-filter-reset checked> All</label></li>
             <li><label><input type="checkbox" data-ln-filter-key="active" data-ln-filter-value="true"> Active</label></li>
             <li><label><input type="checkbox" data-ln-filter-key="active" data-ln-filter-value="false"> Inactive</label></li>
         </ul>
     </div>
     ```
   - (No search input needed for 2-option lists — but include for consistency if preferred.)
2. Repeat for any other filtered column on the tenants table (~line 498-499 has `auth_method` and `active`).
3. Delete both `<template data-ln-template="column-filter">` blocks (~lines 425-445, ~lines 550-562).

---

## Phase 4 — Documentation

### 4.1 — CREATE `docs/architecture/mindset.md`

Write the library philosophy as a "180° opposite of mainstream" document.
Structure: for each principle: Mainstream way → Ashlar way → Why → Concrete repo example.

Principles to cover (exact wording may be refined; substance must be preserved):

**1. Markup is the application**
- Mainstream: JS frameworks build UI chrome at runtime (React renders nav, modals, dropdown options from component state).
- Ashlar: HTML is authored, complete, semantic. JS never creates UI chrome.
  `<template>` exists ONLY for data-driven row repetition, not for UI structure.
- Why: Server-renderable, inspectable, accessible by default. Zero FOUC on UI chrome.
- Example: `demo/admin/src/pages/table-filter.html` — filter popovers are complete HTML,
  authored once, no JS generation. `<template data-ln-template="documents-row">` in
  table-sync.html — rows are the sole `<template>` use case.

**2. SSR and SPA share identical markup**
- Mainstream: SSR renders HTML, hydration replaces it with JS-rendered equivalents.
- Ashlar: Author writes the same HTML whether using Blade or a JS page + data layer.
  Only the author differs; the structure is identical.
- Why: No hydration cost, no structure mismatch, progressive enhancement is free.
- Example: `table-filter.html` (SSR pattern) and `table-sync.html` (data-driven)
  share the same `<th>`, `[data-ln-popover]`, `[data-ln-filter]` markup. The table
  body is the only difference.

**3. Behavior is attached, not owned**
- Mainstream: Components own their behavior — a `<Modal>` component renders its own
  close button, manages its own state, knows its own children.
- Ashlar: Autonomous IIFE components bind via `data-ln-*`, auto-init via
  MutationObserver, communicate via CustomEvents addressed by ID. No parent-child
  coupling, no props, no imports between components. DOM position is irrelevant to
  wiring — teleport-safe by design.
- Why: A filter inside a popover teleported to `<body>` still dispatches
  `ln-filter:changed` on `getElementById(tableId)`. The components have no idea
  they were moved.
- Example: `js/ln-popover/src/ln-popover.js` teleports whole popover to body.
  `js/ln-filter/src/ln-filter.js:293–299` dispatches on getElementById — works
  regardless of DOM position.

**4. CSS owns ALL presentation including states**
- Mainstream: JS toggles `style=""` for show/hide, inline transforms for animation,
  class names encode visual variants (`.btn--danger`, `.modal--large`).
- Ashlar: JS only toggles `.ln-*` classes or attributes. CSS translates those to
  visual output. Zero inline styles. CSS hooks (data-ln-*) are never styling selectors.
- Why: Single source of truth for appearance. Design token changes propagate
  automatically. Inspector shows clean semantic markup.
- Example: `.ln-filter-active` on the filter button → `@mixin table-filter-active`
  renders the accent dot and color change. JS does `btn.classList.toggle('ln-filter-active', ...)`;
  SCSS owns what that looks like.

**5. Composition over features**
- Mainstream: A "filterable table" is a monolithic table component with built-in
  filter UI (dropdowns, chips, clear button all owned by one component).
- Ashlar: A "table filter" is ln-popover + ln-search + ln-filter composing, with
  ln-table merely consuming one event (`ln-filter:changed`). Big components don't
  grow features.
- Why: Each component is independently testable and reusable. ln-filter works for
  card grids too. ln-popover works for any overlay. Neither knows about the other.
- Example: This plan — 145 lines deleted from ln-table; the feature still exists via
  composition.

**6. Domain truth lives at the source**
- Mainstream: Filter options are derived from the visible dataset
  (`[...new Set(rows.map(r => r.category))]`).
- Ashlar: Options come from the domain owner — backend enum or lookup — rendered into
  markup. An option with zero matching records MUST be expressible.
- Why: "What is possible" ≠ "What currently exists in the visible window." Derivation
  breaks under pagination (you only see page 1 values), creates filter circularity
  (filtering changes what options you see), and hides valid states.
- Example: `table-filter.html` — the "Legal" department option exists even if no
  current employee has that department. The backend enum owns the truth.

**7. Raw vs formatted**
- Mainstream: Filter/sort reads `td.textContent` — whatever the display layer rendered.
- Ashlar: `data-ln-value` on cells and `data-ln-filter-value` on checkboxes carry
  machine values. `td.textContent` is presentation. Sorting and filtering never read
  formatted text.
- Why: Formatted numbers ("$1,234.56"), dates ("Apr 12, 2026"), and status badges
  ("● Active") are not sortable as text. The raw value is the truth.
- Example: `data-ln-value="120000"` on a salary cell; filter checkbox has
  `data-ln-filter-value="active"` while the badge displays "● Active".

**8. Out of the box**
- Mainstream: Each project patches its own CSS to fix framework gaps.
- Ashlar: Core must cover all standard compositions. If gls had to patch
  `_tables.scss` for filter popover layout, that is a doctrine violation — the fix
  belongs in core.
- Why: Per-project patches scatter fixes, diverge over time, and become tech debt.
- Example: This plan adds filter popover content styling to `_ln-popover.scss` so
  no consumer needs it.

**9. Lean JS**
- Mainstream: Warnings go to `console.warn`; behavior errors are exceptions.
- Ashlar: Zero dependencies, minimal abstractions. Developer misuse is surfaced via
  CSS `::after` affordances, not console noise. Exceptions never break the page.
- Example: Skill file `.claude/skills/feedback_lean-js-css-dev-affordance.md`.

**10. Case study: The filter-clipping saga**
Symptom: Per-column filter dropdowns clipped by `overflow: hidden` on `.section-card`
(scss/config/mixins/_table.scss:292) and `overflow-x: auto` on `[data-ln-table]`
(scss/config/mixins/_ln-table.scss:38).

Disease: Three divergent implementations (SSR popover, data-driven dropdown builder,
SPA options-attribute path) meant the "fix" kept being re-applied in different ways.
JS was generating UI chrome (the dropdown markup). Overflow stacking context made
any in-tree mounting clip.

Cure: Static authored popover markup (ln-popover) positioned outside the clipping
container and teleported to body on open. ln-filter handles mutual exclusion and
dispatches to the table by ID. ln-table consumes one event. The table has no filter
UI code.

Lesson: When a feature requires fighting the DOM, question whether the feature
belongs where it is.

### 4.2 — MODIFY `CLAUDE.md`

In the Quick Navigation table, add a row at the top:

```
| **Library Mindset / Doctrine (READ FIRST)** | [docs/architecture/mindset.md](docs/architecture/mindset.md) |
```

### 4.3 — MODIFY `docs/architecture/reference.md`

Add a new section "Column Filter Architecture" after the existing sections.
Content:

**Canonical Markup Schema (annotated)**

```html
<!-- th: data-ln-table-filter-col maps the filter key to this column -->
<!-- button: data-ln-popover-for opens the popover; data-ln-table-col-filter is the JS id hook -->
<!-- .ln-filter-active on button = filter is active (JS-toggled; SCSS renders dot) -->
<th data-ln-table-sort="string" data-ln-table-filter-col="department">
    Department
    <button class="table-filter" type="button"
            data-ln-table-col-filter
            data-ln-popover-for="filter-my-table-dept"
            aria-label="Filter department">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
    </button>
</th>

<!-- Popover: placed as sibling to [data-ln-table], NOT inside it -->
<!-- ln-popover teleports this to body on open → escapes any overflow clipping -->
<div data-ln-popover id="filter-my-table-dept">
    <!-- Optional: search input targets the OPTIONS UL id, NOT the table id -->
    <!-- data-ln-search on an input whose target is the table id would trigger whole-table search -->
    <input type="search" placeholder="Search..." 
           data-ln-search="filter-my-table-dept-list"
           data-ln-search-items="label">
    <ul id="filter-my-table-dept-list" data-ln-filter="my-table">
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
        <!-- Domain enum options — include zero-record options -->
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Legal"> Legal</label></li>
    </ul>
</div>
```

**Event flow diagram (text)**

```
User checks a checkbox
  → ln-filter handles mutual exclusion (all ↔ values)
  → ln-filter dispatches ln-filter:changed on the [data-ln-filter] container
  → ln-filter._dispatchOnBoth: also dispatches on getElementById(tableId)
  → ln-table._onColumnFilter receives the event
  → updates _columnFilters, toggles .ln-filter-active on the button
  → SSR: _applyFilterAndSort() + _render()
  → data-driven: _requestData() → coordinator handles data fetch
  → ln-table dispatches ln-table:filter
```

**Teleport safety**

ln-popover teleports the entire popover block to `<body>` on open
(`js/ln-popover/src/ln-popover.js:91`). The search input and options ul travel
together, so all `id` references remain valid. ln-filter binds `change` directly
on inputs at init time, so post-teleport DOM position does not affect event wiring.
ln-filter dispatches on `getElementById(targetId)` — a document-global lookup,
not a relative DOM traversal. Teleport is transparent to the event flow.

**The two distinct ln-search targets**

- `data-ln-search="my-table-id"` on a global search input → triggers whole-table
  text search via `ln-table._onSearch` (or `_onSearchChange` in data-driven mode).
  This is intentional.
- `data-ln-search="filter-options-ul-id"` on the options search input inside a
  popover → filters which checkboxes are visible in the option list. Targets the
  `<ul>` of options, NOT the table. These must never share the same target id.

**Indicator convention**

`.ln-filter-active` class on the filter `<button>` (the element with `data-ln-table-col-filter`).
`@mixin table-filter-active` in `scss/config/mixins/_table.scss` styles the button:
accent color + `::after` dot. JS toggles the class; SCSS owns the visual.

`[data-ln-table-col-filter]` may remain as a JS identification hook for finding the button.
It must never be used as a CSS styling selector (hook boundary doctrine).

**Deprecated (gls-era)**

- `data-ln-table-filter-active` attribute on `<th>` — replaced by `.ln-filter-active` on button.
- `data-ln-table-col-filter` as internal dropdown trigger — now only an id hook.
- `data-ln-table-filter-options` attribute — removed; options come from authored HTML.
- `<template data-ln-template="column-filter">` — removed; markup is static.
- `.content:has([data-ln-table]) { overflow: visible }` in `ln-table.scss` — kept
  with deprecation comment until gls migrates.

### 4.4 — MODIFY `js/ln-table/README.md`

Find the "Column Filters" section. Replace entirely with:

```markdown
## Column Filters

Column filters use static authored markup — a `[data-ln-popover]` block containing
`[data-ln-filter]` checkboxes. ln-table consumes one event: `ln-filter:changed`.

### What ln-table does

1. Receives `ln-filter:changed` on the table element.
2. Maps `e.detail.key` to a column via `data-ln-table-filter-col` on `<th>`.
3. Stores active filter values in `_columnFilters`.
4. **SSR mode**: runs `_applyFilterAndSort()` + `_render()` in-memory.
5. **Data-driven mode**: calls `_requestData()` — the coordinator handles fetching.
6. Toggles `.ln-filter-active` on the funnel `<button>` (the dot indicator).
7. Dispatches `ln-table:filter`.

### What ln-table does NOT do

- Does not generate filter dropdown markup.
- Does not track which options exist in the dataset.
- Does not handle mutual exclusion of checkboxes (ln-filter owns that).

### Markup contract

```html
<!-- th attribute maps filter key → column -->
<th data-ln-table-filter-col="department">
    Department
    <button class="table-filter" type="button"
            data-ln-table-col-filter
            data-ln-popover-for="filter-dept"
            aria-label="Filter department">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
    </button>
</th>

<!-- Popover: sibling to [data-ln-table], not inside it -->
<div data-ln-popover id="filter-dept">
    <input type="search" data-ln-search="filter-dept-list" data-ln-search-items="label" placeholder="Search...">
    <ul id="filter-dept-list" data-ln-filter="my-table">
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
    </ul>
</div>
```

Options come from the domain (backend enum/lookup), never derived from the dataset.
Include options that may have zero matches — they represent valid domain states.

### Clear-all

`data-ln-table-clear` or `data-ln-table-clear-all` on a button (document-wide query
inside the table's click listener). Clears search term, resets all `[data-ln-filter]`
containers targeting this table by checking their reset sentinels.
```

### 4.5 — MODIFY `js/ln-filter/README.md`

Add a "Table Column Filter with Popover" section after the existing examples.
Content: the canonical markup from 4.3, with notes on:
- `data-ln-filter-key` = the column field name (matches `data-ln-table-filter-col` on `<th>`)
- `data-ln-filter-value` = raw machine value (matches `data-ln-value` in cells)
- `data-ln-filter-reset` = the "All" sentinel
- The popover ID and filter container ID are separate; the `data-ln-filter` attribute
  targets the TABLE wrapper id, not the popover id
- ln-filter dispatches `ln-filter:changed` on the filter container AND on
  `getElementById(tableId)` — ln-table receives it directly

### 4.6 — Check companion docs

Check `docs/js/` for any companion `.md` files for ln-table, ln-filter, ln-popover,
ln-search. If they exist and contain filter-related content, update to match the new
pattern. If they contain `_openFilterDropdown`, `column-filter template`, or
`data-ln-table-filter-options` references, remove them.

---

## Phase 5 — Build Verification

Run `npm run build` and verify:
- All demo pages compile without errors.
- Report the final line count of `js/ln-table/src/ln-table.js`
  (baseline: 1516 lines; expected after deletion: ~1370 or fewer, ≥12% reduction ≈ 181 lines).

---

## Acceptance Criteria

### Positive checks (must exist after execution)

```
grep -n "_onColumnFilter" js/ln-table/src/ln-table.js
# → should appear: closure definition + registration in both branches + destroy removal
```

```
grep -n "ln-filter:changed" js/ln-table/src/ln-table.js
# → should appear in 3 places: data-driven addEventListener, SSR addEventListener, 
#   data-driven removeEventListener (destroy)
```

```
grep -rn "data-ln-popover-for" demo/admin/src/pages/table-sync.html
# → should appear 2 times (department, status popovers)
```

```
grep -n "ln-filter-active" js/ln-table/src/ln-table.js
# → should appear in _onColumnFilter (toggle) and _onClear (remove)
```

```
ls docs/architecture/mindset.md
# → file must exist
```

```
grep -n "mindset.md" CLAUDE.md
# → must appear in Quick Navigation table
```

```
grep -n "Column Filter Architecture" docs/architecture/reference.md
# → section must exist
```

### Negative checks (must be absent after execution)

```
grep -n "_openFilterDropdown\|_closeFilterDropdown" js/ln-table/src/ln-table.js
# → 0 results
```

```
grep -rn 'data-ln-template="column-filter' demo/admin/src/pages/
# → 0 results
```

```
grep -rn 'data-ln-template="column-filter' demo/spa/index.html
# → 0 results
```

```
grep -n "_applyFilterMutualExclusion\|_onFilterChange\|_getUniqueValues" js/ln-table/src/ln-table.js
# → 0 results
```

```
grep -n "data-ln-table-filter-active" js/ln-table/src/ln-table.js
# → 0 results
```

```
grep -n "_activeDropdown" js/ln-table/src/ln-table.js
# → 0 results
```

```
grep -rn "data-ln-filter-options\|data-ln-filter-search" demo/admin/src/pages/
# → 0 results (old data-attr names for the dropdown pattern)
```

```
grep -rn "data-ln-table-filter-options" demo/
# → 0 results
```

---

## Boundaries — What NOT to Touch

- `js/ln-filter/src/ln-filter.js` — do not modify (except confirming line references)
- `js/ln-popover/src/ln-popover.js` — do not modify
- `js/ln-search/` — do not modify
- `demo/admin/src/pages/table-sync.html` — modify ONLY the filter wiring (th attributes,
  button attributes, template removal, popover block addition); no other changes
- `demo/admin/table-sync.html` (compiled) — regenerated by `npm run build`; do not
  hand-edit
- `gls` repo — do not touch
- `.claude/**` — write-blocked for subagents
- Any `demo/admin/*.html` compiled output — regenerated by `npm run build`

---

## Amendments (chief architect, pre-execution)

**A1 — `ln-table:filter` dispatch contract.** The Step 1.3 sketch double-dispatches
(first with bogus `matched: 0`, then corrected) and invents a merged detail shape.
Grep-verified: the documented public contract is `{ term, matched, total }` dispatched
ONCE "after filter render" (see demo/admin/src/pages/table.html:200, consumers at
:213 and :286). The old data-driven shape `{table, field, values}` (ln-table.js:1147,
deleted path) has zero consumers in the repo. Therefore the unified `_onColumnFilter`:
- SSR branch: dispatch `ln-table:filter` exactly once, AFTER `_applyFilterAndSort()`
  + `_render()`, with real `{ term, matched, total }` — identical to current lines 440–444.
- Data-driven branch: dispatch nothing here — just `_requestData()`; authoritative
  counts flow via the existing post-data render events. Do NOT emit an event with
  fake counts.

**A2 — mindset.md must not reference `.claude/**` paths.** Principle 9's example in
the plan cites a `.claude` memory file — that path is not part of the public repo
surface for consumers. State the lean-JS / CSS-dev-affordance principle in prose with
a code example instead (e.g., a CSS `::after` misuse warning pattern from the SCSS).

**A3 — Clear-all attribute name.** The README sketch mentions `data-ln-table-clear`
"or `data-ln-table-clear-all`". Document only what exists in code — grep ln-table.js
(`_onClear`, ~line 449) and use the actual attribute name(s); do not document variants
that don't exist.

---

## Executor Prompt

```
You are implementing the plan at:
C:\laragon\www\ln-ashlar\docs\plans\2026-06-12-table-filter-popover-unification.md

Read the plan fully before starting. Execute all phases in order (1 through 5).
After Phase 5, report:
1. PASS or FAIL for each acceptance criterion grep (copy the command and its output)
2. Final line count of js/ln-table/src/ln-table.js
3. Any deviation from the plan (and why)

Key constraints:
- Tabs for indentation everywhere (SCSS, JS, HTML)
- No inline styles; no presentational classes in HTML
- ul/li for all checkbox option lists in demo pages
- data-ln-table-col-filter stays as an attribute on the button (JS id hook only —
  never used as a CSS selector)
- The filter popover placement: sibling to [data-ln-table], NOT inside it
- The ln-search target inside a popover MUST be the options <ul> id,
  NEVER the table id
- All JS handler changes use closure-over-self pattern (const self = this),
  matching the existing ln-table.js style
- Before Phase 1.11 changes, grep for currentFilters vs _columnFilters to resolve
  the ambiguity described in that step
- Run npm run build after all source changes; fix any compilation errors before reporting

Do NOT touch:
- js/ln-filter/src/ln-filter.js
- js/ln-popover/src/ln-popover.js
- demo/admin/table-sync.html (compiled output — regenerated by build)
- .claude/** directory
- gls repo
```
