# ln-filter

Generic filter component. `[data-ln-filter="targetId"]` defines the trigger group; `data-ln-filter-key` / `-value` checkboxes inside it directly drive visibility — children of the target element are hidden by data attribute, or `<table>` rows by column text.

## Philosophy

State lives where the user already controls it: on the `<input>` checkboxes themselves. There is no JS state layer mediating between user interaction and the DOM, and therefore no public state-change API — drive the filter by toggling checkboxes (or dispatching a synthetic `change` event on them). The "All" sentinel uses `data-ln-filter-reset`. Multiple non-reset checkboxes can be checked simultaneously (OR within a column). Events fire on both the filter element and the target element (dual dispatch), so `ln-table` and other listening components can hear filter changes on themselves without knowing which filter triggered them.

For internal mechanics — state model, render pipeline, multi-column WeakMap registry, persistence flow — see [`docs/js/filter.md`](../../docs/js/filter.md).

## HTML contract

```html
<!-- Filter nav — data-ln-filter points to the target's id. -->
<nav data-ln-filter="my-list">
    <ul>
        <!-- Reset checkbox: data-ln-filter-reset marks the "All" sentinel. -->
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-reset checked> All</label></li>
        <!-- Value checkboxes: data-ln-filter-key + data-ln-filter-value pair drives filtering. -->
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="a"> Category A</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="b"> Category B</label></li>
    </ul>
</nav>

<!-- Target list — children carry the data attribute being filtered. -->
<ul id="my-list">
    <li data-category="a">Element from category A</li>
    <li data-category="b">Element from category B</li>
    <li data-category="a">Another element A</li>
</ul>
```

What each piece does:

- `data-ln-filter="targetId"` — creates the instance; value is the id of the element whose children are filtered.
- `data-ln-filter-key="field"` — name of the data attribute to compare on target children (e.g. `data-category`).
- `data-ln-filter-value="val"` — value to match.
- `data-ln-filter-reset` — marks the "All" (reset) checkbox.
- `data-ln-filter-hide` — set by JS on target children that don't match any active value.

## JS API

`ln-filter` has no public state-change API. Filter state is driven by the `<input>` checkboxes — toggle them in the UI, or dispatch a synthetic `change` event from script. The component listens for the native `change` event on every checkbox inside `[data-ln-filter]` and re-renders.

```javascript
const nav  = document.querySelector('[data-ln-filter]');
const high = nav.querySelector('[data-ln-filter-value="high"]');

high.checked = true;
high.dispatchEvent(new Event('change', { bubbles: true }));
```

To clear the filter, set the sentinel `[data-ln-filter-reset]` checkbox to `checked = true` and dispatch `change` (or, in the UI, click "All"). The sentinel handles uncheck-everything-else as a side effect.

For teardown only, each `[data-ln-filter]` element exposes `element.lnFilter.destroy()` — removes change listeners, table-filter registry entry, and the instance reference.

`window.lnFilter(root)` upgrades a custom root (Shadow DOM, iframe). Ordinary AJAX inserts are handled automatically by the document-level MutationObserver.

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-filter:changed` | yes | no | `{ key: string, values: string[] }` |
| `ln-filter:reset` | yes | no | `{}` |

Both events dispatch on the filter element AND the target element (dual dispatch).

```javascript
document.addEventListener('ln-filter:changed', function (e) {
    console.log('Filter:', e.detail.key, '=', e.detail.values.join(', '));
});
```

## Attribute reference

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-filter="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-filter-key="field"` | `<input type="checkbox">` inside | Name of data attribute for comparison on target children |
| `data-ln-filter-value="val"` | `<input type="checkbox">` inside | Value for comparison |
| `data-ln-filter-reset` | `<input type="checkbox">` inside | Marks the "All" (reset) checkbox |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match any active value |
| `data-ln-filter-col="N"` | component root | 0-based column index for table row filtering |

## Behavior

- Multiple checkboxes can be checked simultaneously (multi-select)
- "All" (`data-ln-filter-reset`) unchecks all filter checkboxes and resets to show-all state
- Any filter checkbox being checked unchecks "All"
- When the last filter checkbox is unchecked, "All" auto-checks (auto-reset)
- Filtering uses OR logic: items matching ANY active value are shown
- Items without the filtered data attribute are left visible
- When the target is `[data-ln-table]`, ln-filter does nothing — ln-table owns its row filtering
- When children are added to the target after init, ln-filter does not re-filter automatically. To re-apply, dispatch `change` on any active filter checkbox — the next render visits the new children.

## Table column filtering

Use `data-ln-filter-col="N"` (0-based) on the filter root to filter plain `<table>` rows by the text content of a specific column. No `data-*` attributes are needed on `<tr>` elements. Only works on plain `<table>` elements — not `[data-ln-table]` targets.

### Hardcoded values

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

When a `<template>` is present inside the filter root and `data-ln-filter-col` is set, ln-filter populates checkboxes from the column's unique sorted values on init:

```html
<nav data-ln-filter="my-table" data-ln-filter-col="2">
    <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All</label>
    <template>
        <label><input type="checkbox"> {{ text }}</label>
    </template>
</nav>
```

### Multi-column AND filtering

Multiple `[data-ln-filter]` elements can target the same table with different `data-ln-filter-col` values. Filters combine with AND logic across columns, OR logic within a single column. Each filter must use a unique `data-ln-filter-key`.

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

## Persistence

Add `data-ln-persist` to the `[data-ln-filter]` element to remember selected filter values across page loads. The element must have an `id` (or a `data-ln-persist="custom-key"` value); without one a warning is emitted and persistence is silently skipped.

Persisted state overrides DOM-checked attributes; if no persisted state exists, pre-checked inputs trigger an initial `ln-filter:changed` (browser back/forward restore or server-rendered HTML). Reset clears storage.

```html
<nav id="status-filter" data-ln-filter="my-list" data-ln-persist>
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="active"> Active</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="pending"> Pending</label></li>
    </ul>
</nav>
```

Select "Active", refresh — "Active" is still checked and the list is filtered. Reset ("All"), refresh — no filter active. See [`docs/js/core.md`](../../docs/js/core.md) for storage-key format.

## CSS

The hide rule for `[data-ln-filter-hide]` is bundled in ln-ashlar. Pill active state (checked highlight) is handled automatically via `label:has(> input:checked)`. When combining with `ln-search`, both hide rules must be present in your project's CSS:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

`ln-filter` and `ln-search` work independently on the same target — each manages its own hide attribute.

## What it does NOT do

The component is intentionally narrow. These are NOT filter concerns:

- **Auto-create checkboxes from data** when `data-ln-filter-col` is absent. Without both a `<template>` and `data-ln-filter-col`, the consumer provides checkbox markup.
- **Re-filter automatically when target children mutate.** ln-filter does not observe the target for new children. Dispatch `change` on an active filter checkbox to force a re-pass.
- **Filter `[data-ln-table]` targets.** ln-table owns its row filtering. ln-filter's row-hide logic is skipped when the target has `data-ln-table`.
- **Pagination, virtualisation, sorting.** These belong to `ln-table` / `ln-data-table`.

## See also

- `js/ln-search/README.md` — independent text-search filter on the same target; shares the hide-attribute pattern.
- `js/ln-table/README.md` — table consumer with built-in column filters.
- `js/ln-data-table/README.md` — virtualised data table.
- `docs/js/filter.md` — internal architecture for library maintainers.
