# ln-filter

Generic filter component — filters children of a target element by `data-*` attribute.
Checkbox controls with `data-ln-filter-key` + `data-ln-filter-value` control the filters. Multiple checkboxes can be active simultaneously (OR logic). The "All" (reset) checkbox uses `data-ln-filter-reset` instead of a value.
Elements that don't match any active value receive a `data-ln-filter-hide` attribute.

Also supports direct `<table>` row filtering by column text content — no `data-*` attributes needed on rows.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-filter="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-filter-key="field"` | `<input type="checkbox">` inside | Name of data attribute for comparison on target children |
| `data-ln-filter-value="val"` | `<input type="checkbox">` inside | Value for comparison |
| `data-ln-filter-reset` | `<input type="checkbox">` inside | Marks the "All" (reset) checkbox — replaces `data-ln-filter-value=""` (which still works as fallback) |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match any active value |
| `data-ln-filter-col="N"` | component root | Column index (0-based) for table row filtering. When set, ln-filter reads `<td>` text at column N instead of `data-*` attributes on children. |

## API

```javascript
// Instance API (on the DOM element)
var el = document.querySelector('[data-ln-filter]');
el.lnFilter.filter('genre', 'rock');           // set single filter
el.lnFilter.filter('genre', ['rock', 'jazz']); // set multiple filters
el.lnFilter.reset();                            // clear all, show all
el.lnFilter.getActive();                        // { key: 'genre', values: ['rock', 'jazz'] } or null
el.lnFilter.destroy();                          // remove listeners, clean up

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver automatically initializes
window.lnFilter(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-filter:changed` | yes | no | `{ key: string, values: string[] }` |
| `ln-filter:reset` | yes | no | `{}` |

```javascript
// Listen for filter change
document.addEventListener('ln-filter:changed', function (e) {
    console.log('Filter:', e.detail.key, '=', e.detail.values.join(', '));
});

// Listen for reset
document.addEventListener('ln-filter:reset', function (e) {
    console.log('Filter reset');
});
```

## Behavior

- Multiple checkboxes can be checked simultaneously
- "All" (`data-ln-filter-reset`) unchecks all filter checkboxes and resets to show-all state
- Any filter checkbox being checked unchecks "All"
- When the last filter checkbox is unchecked, "All" auto-checks (auto-reset)
- Filtering uses OR logic: items matching ANY active value are shown
- Items without the filtered data attribute are left visible

## Example

### Basic usage

```html
<!-- Filter checkboxes -->
<nav data-ln-filter="my-list">
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="a"> Category A</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="b"> Category B</label></li>
    </ul>
</nav>

<!-- Target list (children have data-category attribute) -->
<ul id="my-list">
    <li data-category="a">Element from category A</li>
    <li data-category="b">Element from category B</li>
    <li data-category="a">Another element A</li>
</ul>
```

### Multiple filter groups

```html
<!-- Filter by phase -->
<nav data-ln-filter="documents">
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="0"> Phase 0</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="1"> Phase 1</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="2"> Phase 2</label></li>
    </ul>
</nav>
```

> **Checkbox with `data-ln-filter-reset`** = "Show all" (reset). On initialization the "All" checkbox is checked by default. The legacy `data-ln-filter-value=""` still works as a fallback.

> **Multi-select**: Multiple filter checkboxes can be checked at the same time. Items matching any of the active values are shown (OR logic).

## Table Column Filtering

Use `data-ln-filter-col="N"` (0-based column index) on the filter root to filter plain `<table>` rows by the text content of a specific column. No `data-*` attributes are needed on `<tr>` elements.

**Only works on plain `<table>` elements.** If the target has `data-ln-table` (an ln-table instance), ln-table handles filtering itself and ln-filter's row filtering is skipped.

### Hardcoded filter values

```html
<nav data-ln-filter="my-table" data-ln-filter-col="2">
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All</label>
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Engineering"> Engineering</label>
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Design"> Design</label>
</nav>

<table id="my-table">
    <thead><tr><th>#</th><th>Name</th><th>Department</th></tr></thead>
    <tbody>
        <tr><td>1</td><td>Alice</td><td>Engineering</td></tr>
        <tr><td>2</td><td>Bob</td><td>Design</td></tr>
    </tbody>
</table>
```

### Auto-populate from column data

When a `<template>` is present inside the filter root and `data-ln-filter-col` is set, filter values are automatically extracted from the column on init:

```html
<nav data-ln-filter="my-table" data-ln-filter-col="2">
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All</label>
    <template>
        <label><input type="checkbox"> {{ text }}</label>
    </template>
</nav>

<table id="my-table">
    ...
</table>
```

Unique non-empty text values from the column are collected, sorted alphabetically, and cloned from the template. Each cloned input receives `data-ln-filter-key` and `data-ln-filter-value` attributes automatically. The `{{ text }}` placeholder is replaced with the column value via `fillTemplate` from ln-core.

### Multi-column AND filtering

Multiple `[data-ln-filter]` elements can target the same table with different `data-ln-filter-col` values. Filters combine with AND logic across columns, OR logic within a single column:

```html
<!-- Filter by department (column 2) -->
<span data-ln-filter="my-table" data-ln-filter-col="2">
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All</label>
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Engineering"> Engineering</label>
</span>

<!-- Filter by status (column 3) -->
<span data-ln-filter="my-table" data-ln-filter-col="3">
    <label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-reset checked> All</label>
    <label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Active"> Active</label>
</span>
```

Each filter must use a unique `data-ln-filter-key`. Row visibility is determined by all active filters combined.

### Edge cases

| Case | Behavior |
|------|----------|
| Column index out of range | Treats as empty string — rows with short row lengths are unaffected by that filter |
| Empty `<td>` text | Treated as `""`. A filter value of `""` matches empty cells. |
| Multiple `<tbody>` elements | All `<tbody>` rows are filtered |
| Rows added dynamically | MutationObserver does NOT auto-re-filter. Call `el.lnFilter.filter(key, value)` manually after adding rows. |
| Target is ln-table | ln-filter skips row filtering entirely — ln-table handles its own. |

## CSS

The hide rule is bundled in ln-ashlar. Pill styling (active state highlight via primary color) is automatic for `label:has(> input[type="checkbox"])` via the library defaults. The consumer only needs the hide rule when combining with `ln-search`:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

## Combination with ln-search

`ln-filter` and `ln-search` work **independently** on the same target — each with its own hide attribute. An element is visible only when **no** hide attribute is present:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

## Internals

Uses `deepReactive` + `createBatcher` from `ln-core`. State is `{ key, values: [] }` — all DOM updates (`input.checked` on filter controls, `data-ln-filter-hide` on target children) derive from state in a batched `_render()` cycle. Events dispatch after render via `_afterRender()`. Listens to `change` events on `<input type="checkbox">` elements. Reset inputs are detected via `_isReset()` helper which checks `data-ln-filter-reset` attribute with `data-ln-filter-value=""` fallback. Filtering uses OR logic: a target child is hidden only if its data attribute value does not appear in the active `values` array.

## Persistence

Add `data-ln-persist` to the `[data-ln-filter]` element to remember selected filter values across page loads.

**Requirements:**
- Element must have an `id` attribute, OR a non-empty `data-ln-persist="key"` value
- If neither is present, a `console.warn` is emitted and persistence is silently skipped — the filter still works normally

**What is persisted:** Active filter key + selected values array. Reset state is stored as `null`.

**Persisted state overrides DOM:** If localStorage has a saved filter, any `checked` attributes on inputs in the HTML are ignored.

**Browser form restore:** If no persisted state exists, the component reads initial checkbox states on init. Pre-checked inputs (from browser back/forward restore or server-rendered HTML) are detected and a `ln-filter:changed` event is dispatched so connected components (e.g. `ln-table`) receive the initial filter state.

```html
<nav id="status-filter" data-ln-filter="my-list" data-ln-persist>
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="active"> Active</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="pending"> Pending</label></li>
    </ul>
</nav>
```

Select "Active", refresh — "Active" is still checked and the list is filtered. Reset ("All"), refresh — no filter active.

## Dynamic elements

MutationObserver auto-initializes new `[data-ln-filter]` elements added to the DOM. It does NOT automatically re-filter when new children are added to the target — call `el.lnFilter.filter(key, value)` manually after populating the target with new items.

## Programmatic

```javascript
// Filter by single value
document.querySelector('[data-ln-filter]').lnFilter.filter('genre', 'rock');

// Filter by multiple values (OR logic)
document.querySelector('[data-ln-filter]').lnFilter.filter('genre', ['rock', 'jazz']);

// Reset
document.querySelector('[data-ln-filter]').lnFilter.reset();

// Check current filter
var active = document.querySelector('[data-ln-filter]').lnFilter.getActive();
if (active) {
    console.log('Active filter:', active.key, '=', active.values.join(', '));
}
```
