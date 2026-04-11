# Filter

Generic filter component — filters children of a target element by `data-*` attribute. Multiple checkboxes can be active simultaneously (OR logic). File: `js/ln-filter/ln-filter.js`.

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

The hide rule for `[data-ln-filter-hide]` is bundled in ln-acme. Pill active state is handled automatically via `label:has(> input:checked)` in the library defaults.

## Behavior

- Multiple checkboxes can be checked simultaneously (multi-select)
- "All" (`data-ln-filter-reset`) unchecks all filter checkboxes and resets to show-all state
- Any filter checkbox being checked unchecks "All"
- When the last filter checkbox is unchecked, "All" auto-checks (auto-reset)
- Filtering uses OR logic: items matching ANY active value are shown
- Works independently alongside `ln-search` on the same target — each with its own hide attribute.
- MutationObserver auto-initializes new `[data-ln-filter]` components but does NOT auto-re-filter when children are added to the target — call `el.lnFilter.filter()` manually after adding items.

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
    1. _render()               — update input checked states + filter target children
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

**2. Target children**: look up `document.getElementById(targetId)`, iterate children:

- Reset state: remove `data-ln-filter-hide` from all children
- Active state: read each child's `data-{key}` attribute. Build a lowercase array of active values. If the child's attribute value does not appear in the lowercase array, set `data-ln-filter-hide="true"` (OR logic — visible if it matches ANY active value)
- Children without the data attribute are left visible (not filtered)

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
| `destroy()` | — | Remove all change listeners, the init guard attribute, and the instance reference |

All methods go through the same state → batcher → render → event pipeline.

### Why NOT `fill()` / `renderList()`

- Inputs are server-rendered, not from templates. `_render()` toggles `input.checked` on existing inputs.
- Target items are external DOM (a separate container by ID). ln-filter doesn't own or create them — it only sets/removes `data-ln-filter-hide`.
- There is no template cloning or list building. All DOM elements exist at page load.

### Lifecycle

1. **Init**: MutationObserver or DOMContentLoaded → `_findElements` → `new _component(dom)`
2. **Guard**: `data-ln-filter-initialized` attribute prevents double-init on the same element
3. **Steady state**: change event or API call → set state → batcher → render → dispatch events
4. **Destroy**: `destroy()` removes all change listeners, the init guard attribute, and the instance reference.
