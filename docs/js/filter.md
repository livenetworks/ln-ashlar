# Filter — internal architecture

Companion to [`js/ln-filter/README.md`](../../js/ln-filter/README.md). Covers
state model, render pipeline, multi-column WeakMap registry, persistence flow.
Source: `js/ln-filter/ln-filter.js`.

## State model

`ln-filter` has no JS-side state object. The active filter is the set of checked
non-reset checkboxes inside `[data-ln-filter]`, derived on demand:

```javascript
function _deriveActive(self) {
    // Walk self.inputs. Collect (key, values[]) where input.checked
    // and !_isReset(input). Return { key: null, values: [] } if none.
}
```

The DOM is canonical. Render reads from inputs; persistence reads from inputs;
event payloads are read from inputs. The change handler applies one synchronous
DOM rule (mutual exclusion between the reset sentinel and the value checkboxes),
then schedules a render.

An instance field `_lastSnapshot` caches the previous derived snapshot for
diffing in `_afterRender` — used only to decide whether to fire
`ln-filter:changed`. It is a cache, not a source of truth; throwing it away
mid-flight would over-fire events but never produce incorrect visibility.

## Render pipeline

```
change event   → handler enforces mutual exclusion → queueRender()
persistence    → write input.checked on rehydrated values → queueRender()
init scan      → if any non-reset input is pre-checked → queueRender()
    |
    v
createBatcher schedules via queueMicrotask (deduplicates within the
same tick — multiple calls inside one sync block produce one render)
    |
    v
renderFn:
    1. _render() — _deriveActive() + apply visibility to target
       children or table rows
    |
    v
afterRender:
    2. _afterRender() — _deriveActive() again, diff vs _lastSnapshot,
       dispatch ln-filter:changed (and ln-filter:reset on transition
       into reset state), persist
```

**Why two `_deriveActive` calls per cycle.** `_render` derives once to apply
visibility; `_afterRender` derives again to dispatch and persist. Splitting them
keeps render free of side-effects (no event dispatch mid-render) and keeps
`_afterRender` reading the post-render DOM. Both calls walk the same
`this.inputs` array, both are O(n) over a small array, both happen in the same
microtask — the cost is negligible.

## Render logic (`_render`)

Two paths driven by `colIndex`:

**Standard path** (`colIndex === null`): look up `document.getElementById(targetId)`,
iterate children. Reset state: remove `data-ln-filter-hide` from all. Active
state: read each child's `data-{key}` attribute; if its value is not in
`active.values` (case-insensitive), set `data-ln-filter-hide="true"` (OR logic —
visible if it matches ANY active value). Children without the data attribute are
left visible.

**Table column path** (`colIndex !== null`): delegate to `_filterTableRows(active)`.
See below.

## Table-column filtering: shared WeakMap registry

When `data-ln-filter-col` is set, `_render()` calls `_filterTableRows(active)`
instead of the standard path.

**Guard conditions:**
- Target element must exist
- Target or its child must be a `<table>` element
- Target must NOT have `data-ln-table` (ln-table handles its own filtering)

**Shared state via `_tableFilters` WeakMap:**

A module-level `WeakMap<tableElement, Object>` tracks all active column filters
for a given table:

```
_tableFilters: WeakMap {
    tableElement → {
        'dept':   { col: 2, values: ['engineering', 'design'] },
        'status': { col: 3, values: ['active'] }
    }
}
```

Using WeakMap ensures no memory leak when tables are removed from the DOM — the
garbage collector reclaims the entry automatically.

Each `_filterTableRows(active)` call:
1. Gets or creates the filter map for the table
2. Updates (or deletes) this filter's entry using `active.key` as the map key
3. Iterates all `tBodies` and all rows within them
4. For each row: checks ALL active filters (AND across columns). For each filter,
   checks if the cell text appears in the filter's values array (OR within column,
   case-insensitive)
5. Sets or removes `data-ln-filter-hide="true"` on each `<tr>`

**AND/OR logic summary:**
- Multiple values within one column filter → OR (row matches if cell matches ANY value)
- Multiple filters on different columns → AND (row must satisfy ALL column filters)

## Auto-populate from column (`_populateFromColumn`)

Called at the end of the constructor when `colIndex !== null` and a `<template>`
element exists inside the filter root.

Flow:
1. Find the target table (guard: must exist, must not be ln-table)
2. Iterate all `tBodies` rows, collect cell text at `colIndex`
3. De-duplicate, sort alphabetically
4. Determine `filterKey`: use key from existing `[data-ln-filter-key]` input, or
   `data-ln-filter-key` attribute on the nav root, or fallback `'col{N}'`
5. For each unique value: clone template, set `data-ln-filter-key` and
   `data-ln-filter-value` on the `<input>`, call `fillTemplate(clone, { text: value })`
   to replace `{{ text }}` placeholder, append to the filter nav root
6. Return — the constructor then re-collects `this.inputs` to include the new inputs

**Constructor ordering:** `_populateFromColumn` runs BEFORE `this.inputs` is
collected. This is critical — the inputs array must include auto-populated
checkboxes.

## Event flow

Events dispatch in `_afterRender()` against a cached previous snapshot:

```
input change (user click or synthetic):
    1. handler enforces sentinel ↔ value mutual exclusion (DOM ops)
    2. queueRender()
    ─── microtask boundary ───
    3. _render() — derive active, apply visibility
    4. _afterRender() — derive active again, compare to _lastSnapshot:
       - if changed → dispatch ln-filter:changed
       - if was-active && now-reset → dispatch ln-filter:reset
       - update _lastSnapshot
       - persist
```

One render = at most one `ln-filter:changed` and at most one `ln-filter:reset`.
There is no event queue; the diff is the queue.

## Dual dispatch

Every event dispatches on **two** elements via `_dispatchOnBoth()`:

1. The filter nav element (`this.dom`) — for local listeners
2. The target element (`document.getElementById(targetId)`) — for components
   listening on the target (e.g., `ln-table` listens for `ln-filter:changed` on
   itself)

This is how per-column table filters work: `ln-filter` inside a `<th>` dispatches
`ln-filter:changed` on the `[data-ln-table]` wrapper, and ln-table's handler picks
it up.

## Persistence

Filter supports opt-in `localStorage` persistence via `data-ln-persist` on the
`[data-ln-filter]` element.

**Storage key format:** `ln:filter:{pagePath}:{filterId}`

**Stored value:** `{ key: string, values: string[] }` or `null` (reset state)

**Restore timing:** In `_component` constructor, after `_attachHandlers()`. If
`data-ln-persist` is present, `persistGet` is called. If the saved object has a
non-empty `key` and non-empty `values` array, the constructor writes
`input.checked` on matching inputs (and unchecks the reset sentinel), then calls
`queueRender()` once.

**DOM init precedence:** Persisted state overrides any `checked` attributes in
the HTML. If `_persistRestored` is true, the DOM init scan is skipped entirely.

**Save timing:** In `_afterRender()`, after events dispatch. Saves
`{ key, values: [...] }` from `_deriveActive()` when a filter is active, saves
`null` when filter is in reset state.

**Reset clears storage:** When the sentinel change fires, all value inputs are
unchecked and `_deriveActive` returns empty values. The next `_afterRender` call
saves `null`, explicitly clearing the stored filter.

**Graceful degradation:** All `localStorage` calls are in `persist.js` with
`try/catch`. Storage errors are silently swallowed.

## Init from existing DOM

The DOM is the source of truth, so server-rendered `checked` attributes ARE the
initial state — no copying needed. The constructor calls `queueRender()` once if
any non-reset input is pre-checked, so visibility is applied to the target on
first paint and the initial `ln-filter:changed` fires (consumers like ln-table
hear about server-rendered state). If nothing is pre-checked, no render is
scheduled and no event fires.

Persisted state (`data-ln-persist`) takes precedence: when present, it overwrites
the DOM-checked state by mutating `input.checked` on the rehydrated values before
the render call.

## Change handlers

`_attachHandlers()` adds `change` listeners to all `[data-ln-filter-key]` inputs.
The listener guards against double-bind via `input[DOM_ATTRIBUTE + 'Bound']`. Each
listener applies one synchronous mutual-exclusion rule to the inputs and schedules
a render.

- Reset sentinel changed (regardless of direction): force the sentinel to
  `checked = true`, force every non-reset input to `checked = false`.
- Non-reset input checked: force every reset sentinel to `checked = false`.
- Non-reset input unchecked: if no other non-reset input is still checked, force
  every reset sentinel to `checked = true`.

The handler does not dispatch events directly. It schedules a render;
`_afterRender` is the single dispatch site.

## Destroy cleanup

`destroy()` performs two cleanup steps:

1. **Table filter registry**: if `colIndex !== null`, removes this filter's key
   entry from `_tableFilters` using `this._filterKey` (stable from constructor).
   If the table's filter map becomes empty, removes the table entry from the
   WeakMap entirely.
2. **Checkbox listeners**: removes all `change` listeners and the `Bound` guard
   property from each input.

## Why NOT `fill()` / `renderList()`

- Inputs are server-rendered, not from templates. The change handler and
  persistence rehydration toggle `input.checked` on existing inputs directly.
- Target items are external DOM (a separate container by ID). ln-filter doesn't
  own or create them — it only sets/removes `data-ln-filter-hide`.
- Auto-populate uses direct template cloning (`template.content.cloneNode(true)`)
  + `fillTemplate()` for `{{ text }}` placeholder replacement. Uses `fillTemplate`
  (not `fill`) because the label text is inline within the `<label>` element, not
  in a separate `[data-ln-field]` element.

## Lifecycle

1. **Init**: MutationObserver or DOMContentLoaded → `_findElements` → `new _component(dom)`
2. **Guard**: `data-ln-filter-initialized` attribute prevents double-init on the same element
3. **Auto-populate**: if `data-ln-filter-col` + `<template>` present, populate checkboxes from column data before collecting inputs
4. **Steady state**: change event → handler enforces mutual exclusion → batcher → render (derives) → afterRender (derives + diffs + dispatches)
5. **Destroy**: `destroy()` removes all change listeners, table filter registry entry, init guard attribute, and instance reference.

## See also

- [`../../js/ln-filter/README.md`](../../js/ln-filter/README.md) — consumer doc (attributes, events, API, HTML examples).
- [`./table.md`](./table.md) — `ln-table` architecture; see also "Why NOT fill / renderList" above for ln-filter's relationship to ln-table's self-filtering.
- [`./search.md`](./search.md) — sibling component that shares the hide-attribute pattern (`data-ln-search-hide`).
- [`./core.md`](./core.md) — `dispatch`, `createBatcher`, `persistGet`/`persistSet`.
