# Filter

Generic filter component — filters children of a target element by `data-*` attribute. Multiple checkboxes can be active simultaneously (OR logic). Also supports direct `<table>` row filtering by column text content. File: `js/ln-filter/ln-filter.js`.

## HTML

```html
<!-- Filter checkboxes -->
<nav data-ln-filter="my-list">
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-reset checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="a"> Category A</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="b"> Category B</label></li>
    </ul>
</nav>

<!-- Target list -->
<ul id="my-list">
    <li data-category="a">Item from category A</li>
    <li data-category="b">Item from category B</li>
</ul>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-filter="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-filter-key="field"` | `<input type="checkbox">` inside | Data attribute name to compare on target children |
| `data-ln-filter-value="val"` | `<input type="checkbox">` inside | Value to match |
| `data-ln-filter-reset` | `<input type="checkbox">` inside | Marks the "All" (reset) checkbox — canonical replacement for `data-ln-filter-value=""` |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match any active value |
| `data-ln-filter-initialized` | component root | Set by JS after init. Prevents double-init |
| `data-ln-filter-col="N"` | component root | 0-based column index for table row filtering. When present, reads `<td>` text instead of `data-*` attributes. |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-filter:changed` | yes | no | `{ key: string, values: string[] }` |
| `ln-filter:reset` | yes | no | `{}` |

Both events dispatch on the filter nav element AND the target element (dual dispatch).

## API

```js
const el = document.querySelector('[data-ln-filter]');
el.lnFilter.filter('genre', 'rock');           // set single active value
el.lnFilter.filter('genre', ['rock', 'jazz']); // set multiple active values
el.lnFilter.reset();                            // clear all, show all
el.lnFilter.getActive();                        // { key, values: [] } or null
el.lnFilter.destroy();                          // remove listeners, clean up
```

## CSS (consumer provides for ln-search combination)

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

The hide rule for `[data-ln-filter-hide]` is bundled in ln-ashlar. Pill active state is handled automatically via `label:has(> input:checked)` in the library defaults.

## Behavior

- Multiple checkboxes can be checked simultaneously (multi-select)
- "All" (`data-ln-filter-reset`) unchecks all filter checkboxes and resets to show-all state
- Any filter checkbox being checked unchecks "All"
- When the last filter checkbox is unchecked, "All" auto-checks (auto-reset)
- Filtering uses OR logic: items matching ANY active value are shown
- Works independently alongside `ln-search` on the same target — each with its own hide attribute.
- MutationObserver auto-initializes new `[data-ln-filter]` components but does NOT auto-re-filter when children are added to the target — call `el.lnFilter.filter()` manually after adding items.
- **Browser form restore:** If no `data-ln-persist` state exists, the component reads initial checkbox states on init. Pre-checked inputs (browser back/forward restore or server-rendered) are detected and `ln-filter:changed` is dispatched so connected components (e.g. `ln-table`) receive the initial filter state.

---

## Internal Architecture

This section explains how the component works internally. A developer or AI reading this should fully understand the data flow, state model, and render pipeline without reading the source.

### Reactive State

Filter state lives in a `deepReactive` proxy to support array mutations (`push`, `splice`) on the `values` property:

```
this.state = deepReactive({
    key:    null,    // active filter key (e.g., 'category')
    values: []       // active filter values (e.g., ['design', 'qa'])
}, queueRender);
```

- `key = null, values = []` — reset state, all items visible, "All" input is checked
- `key = 'category', values = ['design', 'qa']` — multi-select active, matching inputs are checked

Any assignment to `state.key`, `state.values`, or mutation of `state.values` (via `push`/`splice`) triggers `queueRender`.

### Why `deepReactive` (not `reactiveState`)

`values` is an array. When the handler calls `state.values.push(value)` or `state.values.splice(idx, 1)`, these are mutations on a nested object — a shallow proxy (`reactiveState`) would not detect them. `deepReactive` wraps nested objects/arrays recursively so all mutations trigger `onChange`. Compare with the old single-select model which used flat scalars (`key`, `value`) where shallow proxy was sufficient.

### Render Pipeline

```
state mutation (key, values assignment, or values.push/splice)
    |
    v
createBatcher schedules via queueMicrotask (deduplicates within same tick)
    |
    v
renderFn:
    1. _render()               — update input checked states + filter target children or table rows
    |
    v
afterRender:
    2. _afterRender()          — dispatch pending CustomEvents
```

**Batching matters for reset**: `reset()` sets both `state.key = null` and `state.values = []` synchronously. Each triggers `queueRender`, but `createBatcher` deduplicates — only one render fires after both are set.

### Render Logic (`_render`)

`_render()` derives all DOM from two values (`state.key`, `state.values`). Two operations:

**1. Input states**: iterate all inputs, derive checked state from active values array:

- Reset state (`key = null` or `values.length === 0`): the input with `data-ln-filter-reset` (or `value=""` fallback) gets `checked = true`, all others `false`
- Active state: the "All" input gets `checked = false`; each non-reset input gets `checked = true` if its `data-ln-filter-value` appears in `state.values`

**2. Target filtering — two paths based on `colIndex`:**

**Standard path** (`colIndex === null`): look up `document.getElementById(targetId)`, iterate children:

- Reset state: remove `data-ln-filter-hide` from all children
- Active state: read each child's `data-{key}` attribute. Build a lowercase array of active values. If the child's attribute value does not appear in the lowercase array, set `data-ln-filter-hide="true"` (OR logic — visible if it matches ANY active value)
- Children without the data attribute are left visible (not filtered)

**Table column path** (`colIndex !== null`): delegate to `_filterTableRows()`. See below.

### Table Column Filtering (`_filterTableRows`)

When `data-ln-filter-col` is set, `_render()` calls `_filterTableRows()` instead of the standard path.

**Guard conditions:**
- Target element must exist
- Target or its child must be a `<table>` element
- Target must NOT have `data-ln-table` (ln-table handles its own filtering)

**Shared state via `_tableFilters` WeakMap:**

A module-level `WeakMap<tableElement, Object>` tracks all active column filters for a given table:

```
_tableFilters: WeakMap {
    tableElement → {
        'dept':   { col: 2, values: ['engineering', 'design'] },
        'status': { col: 3, values: ['active'] }
    }
}
```

Using WeakMap ensures no memory leak when tables are removed from the DOM — the garbage collector reclaims the entry automatically.

Each `_filterTableRows()` call:
1. Gets or creates the filter map for the table
2. Updates (or deletes) this filter's entry using `this.state.key` as the map key
3. Iterates all `tBodies` and all rows within them
4. For each row: checks ALL active filters (AND across columns). For each filter, checks if the cell text appears in the filter's values array (OR within column, case-insensitive)
5. Sets or removes `data-ln-filter-hide="true"` on each `<tr>`

**AND/OR logic summary:**
- Multiple values within one column filter → OR (row matches if cell matches ANY value)
- Multiple filters on different columns → AND (row must satisfy ALL column filters)

### Auto-Populate from Column (`_populateFromColumn`)

Called at the end of the constructor when `colIndex !== null` and a `<template>` element exists inside the filter root.

Flow:
1. Find the target table (guard: must exist, must not be ln-table)
2. Iterate all `tBodies` rows, collect cell text at `colIndex`
3. De-duplicate, sort alphabetically
4. Determine `filterKey`: use key from existing `[data-ln-filter-key]` input, or `data-ln-filter-key` attribute on the nav root, or fallback `'col{N}'`
5. For each unique value: clone template, set `data-ln-filter-key` and `data-ln-filter-value` on the `<input>`, call `fillTemplate(clone, { text: value })` to replace `{{ text }}` placeholder, append to the filter nav root
6. Return — the constructor then re-collects `this.inputs` to include the new inputs

**Constructor ordering:** `_populateFromColumn` runs BEFORE `this.inputs` is collected. This is critical — the inputs array must include auto-populated checkboxes.

### Event Flow

Events dispatch **after** render via `_pendingEvents` + `_afterRender()`:

```
input change (check):
    1. push { name: 'ln-filter:changed', detail: { key, values: [...] } } to _pendingEvents
    2. state.values.push(value)            → triggers batcher
    ─── microtask boundary ───
    3. batcher fires: _render() → _afterRender()
    4. _afterRender dispatches pending events

input change (uncheck — last value):
    1. state.values.splice(idx, 1)         → values now empty
    2. push { name: 'ln-filter:changed', detail: { key, values: [] } } to _pendingEvents
    3. reset() → push 'ln-filter:reset' + set state.key=null, state.values=[]
    ─── microtask boundary ───
    4. batcher fires: _render() → _afterRender()
    5. _afterRender dispatches both pending events
```

This guarantees event listeners see the DOM in its post-render state.

### Dual Dispatch

Every event dispatches on **two** elements via `_dispatchOnBoth()`:

1. The filter nav element (`this.dom`) — for local listeners
2. The target element (`document.getElementById(targetId)`) — for components listening on the target (e.g., `ln-table` listens for `ln-filter:changed` on itself)

This is how per-column table filters work: `ln-filter` inside a `<th>` dispatches `ln-filter:changed` on the `[data-ln-table]` wrapper, and ln-table's handler picks it up.

### Persistence

Filter supports opt-in `localStorage` persistence via `data-ln-persist` on the `[data-ln-filter]` element.

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-persist` | `[data-ln-filter]` | Boolean — uses element `id` as storage key |
| `data-ln-persist="custom-key"` | `[data-ln-filter]` | Uses the given string as storage key |

**Storage key format:** `ln:filter:{pagePath}:{filterId}`

**Stored value:** `{ key: string, values: string[] }` or `null` (reset state)

**Restore timing:** In `_component` constructor, after `_attachHandlers()` but before DOM init. If `data-ln-persist` is present, `persistGet` is called. If the saved object has a non-empty `key` and non-empty `values` array, they are applied to `state` directly (`_persistRestored = true`). This triggers `queueRender` via `deepReactive`, which schedules a render cycle to update checkboxes and filter targets.

**DOM init precedence:** Persisted state overrides any `checked` attributes in the HTML. If `_persistRestored` is true, the DOM init scan is skipped entirely.

**Save timing:** In `_afterRender()`, after all pending events dispatch. Saves `{ key, values: [...] }` when a filter is active, saves `null` when filter is in reset state.

**Reset clears storage:** When `reset()` is called, `state.key = null` and `state.values = []`. The next `_afterRender` call saves `null`, explicitly clearing the stored filter.

**Graceful degradation:** All `localStorage` calls are in `persist.js` with `try/catch`. Storage errors are silently swallowed.

### Init from Existing DOM

On construction, all inputs are scanned for existing `checked` attributes. All checked non-reset inputs (per `_isReset()`) have their values collected into `initValues[]`. If any are found, `state.key` and `state.values` are set directly — this initializes state without triggering a render (the DOM is already correct from the server). Single pre-checked input still works (array of one value).

### Change Handlers

`_attachHandlers()` adds `change` listeners to all `[data-ln-filter-key]` inputs. Guard: `input[DOM_ATTRIBUTE + 'Bound'] = true` prevents duplicate listeners when MutationObserver re-fires.

Change behavior:
- Input with `data-ln-filter-reset`: pushes `ln-filter:changed` event with empty values array, then calls `this.reset()` which pushes `ln-filter:reset` and sets state to null/[]
- Non-reset input checked: adds value to `state.values` via `push` (if not already present), pushes `ln-filter:changed` event with updated values array
- Non-reset input unchecked: removes value from `state.values` via `splice`. If `values` is now empty, pushes `ln-filter:changed` event with empty values, then calls `this.reset()`

### Public API Methods

| Method | Signature | Action |
|--------|-----------|--------|
| `filter(key, value)` | `value`: string or string[] | Push `ln-filter:changed`, set `state.key` and `state.values` (single string wrapped in array; empty array or falsy resets) |
| `reset()` | — | Push `ln-filter:reset` event, set state to `null`/`[]` |
| `getActive()` | — | Return `{ key, values: [...] }` or `null` if in reset state; returns defensive copy of values |
| `destroy()` | — | Remove all change listeners, table filter registry entry, the init guard attribute, and the instance reference |

All methods go through the same state → batcher → render → event pipeline.

### Destroy Cleanup

`destroy()` performs two cleanup steps:

1. **Table filter registry**: if `colIndex !== null`, removes this filter's key entry from `_tableFilters`. If the table's filter map becomes empty, removes the table entry from the WeakMap entirely.
2. **Checkbox listeners**: removes all `change` listeners and the `Bound` guard property from each input.

### Why NOT `fill()` / `renderList()`

- Inputs are server-rendered, not from templates. `_render()` toggles `input.checked` on existing inputs.
- Target items are external DOM (a separate container by ID). ln-filter doesn't own or create them — it only sets/removes `data-ln-filter-hide`.
- Auto-populate uses direct template cloning (`template.content.cloneNode(true)`) + `fillTemplate()` for `{{ text }}` placeholder replacement. Uses `fillTemplate` (not `fill`) because the label text is inline within the `<label>` element, not in a separate `[data-ln-field]` element.

### Lifecycle

1. **Init**: MutationObserver or DOMContentLoaded → `_findElements` → `new _component(dom)`
2. **Guard**: `data-ln-filter-initialized` attribute prevents double-init on the same element
3. **Auto-populate**: if `data-ln-filter-col` + `<template>` present, populate checkboxes from column data before collecting inputs
4. **Steady state**: change event or API call → set state → batcher → render → dispatch events
5. **Destroy**: `destroy()` removes all change listeners, table filter registry entry, init guard attribute, and instance reference.
