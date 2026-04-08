# Filter

Generic filter component — filters children of a target element by `data-*` attribute. File: `js/ln-filter/ln-filter.js`.

## HTML

```html
<!-- Filter checkboxes -->
<nav data-ln-filter="my-list">
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="" checked> All</label></li>
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
| `data-ln-filter-value="val"` | `<input type="checkbox">` inside | Value to match (empty = show all) |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match |
| `data-ln-filter-initialized` | component root | Set by JS after init. Prevents double-init |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-filter:changed` | yes | no | `{ key: string, value: string }` |
| `ln-filter:reset` | yes | no | `{}` |

Both events dispatch on the filter nav element AND the target element (dual dispatch).

## API

```js
const el = document.querySelector('[data-ln-filter]');
el.lnFilter.filter('genre', 'rock');  // filter programmatically
el.lnFilter.reset();                   // clear filter, show all
el.lnFilter.getActive();               // { key, value } or null
el.lnFilter.destroy();                 // remove listeners, clean up
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

- Checkbox with `data-ln-filter-value=""` = "Show all" (reset). The "All" checkbox is checked on init.
- Clicking an active filter unchecks it and resets to "All".
- Works independently alongside `ln-search` on the same target — each with its own hide attribute.
- MutationObserver auto-re-filters dynamically added children.

---

## Internal Architecture

This section explains how the component works internally. A developer or AI reading this should fully understand the data flow, state model, and render pipeline without reading the source.

### Reactive State

Filter state lives in a `reactiveState` proxy (shallow — no nested objects):

```
this.state = reactiveState({
    key:   null,    // active filter key (e.g., 'category')
    value: null     // active filter value (e.g., 'rock')
}, queueRender);
```

- `key = null, value = null` — reset state, all items visible, "All" input is checked
- `key = 'category', value = 'design'` — filter active, matching input is checked

Any assignment to `state.key` or `state.value` triggers `queueRender`.

### Render Pipeline

```
state mutation (key or value)
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

**Batching matters for reset**: `reset()` sets both `state.key = null` and `state.value = null` synchronously. Each triggers `queueRender`, but `createBatcher` deduplicates — only one render fires after both are set.

### Render Logic (`_render`)

`_render()` derives all DOM from two values (`state.key`, `state.value`). Two operations:

**1. Input states**: iterate all inputs, compare each input's `data-ln-filter-key` / `data-ln-filter-value` against active state. Set `input.checked = true/false`.

- Reset state (`key = null, value = null`): the input with `value=""` gets `checked = true`
- Active state: the input matching both key and value gets `checked = true`

**2. Target children**: look up `document.getElementById(targetId)`, iterate children:

- Reset state: remove `data-ln-filter-hide` from all children
- Active state: read each child's `data-{key}` attribute. If value doesn't match (case-insensitive), set `data-ln-filter-hide="true"`
- Children without the data attribute are left visible (not filtered)

### Event Flow

Events dispatch **after** render via `_pendingEvents` + `_afterRender()`:

```
input change:
    1. push { name: 'ln-filter:changed', detail: { key, value } } to _pendingEvents
    2. set state.key and state.value          → triggers batcher
    ─── microtask boundary ───
    3. batcher fires: _render() → _afterRender()
    4. _afterRender dispatches pending events
```

This guarantees event listeners see the DOM in its post-render state.

### Dual Dispatch

Every event dispatches on **two** elements via `_dispatchOnBoth()`:

1. The filter nav element (`this.dom`) — for local listeners
2. The target element (`document.getElementById(targetId)`) — for components listening on the target (e.g., `ln-table` listens for `ln-filter:changed` on itself)

This is how per-column table filters work: `ln-filter` inside a `<th>` dispatches `ln-filter:changed` on the `[data-ln-table]` wrapper, and ln-table's handler picks it up.

### Init from Existing DOM

On construction, inputs are scanned for an existing `checked` attribute. If found (and value is not empty), `state.key` and `state.value` are set directly on the proxy target — this initializes state without triggering a render (the DOM is already correct from the server).

### Change Handlers

`_attachHandlers()` adds `change` listeners to all `[data-ln-filter-key]` inputs. Guard: `input[DOM_ATTRIBUTE + 'Bound'] = true` prevents duplicate listeners when MutationObserver re-fires.

Change behavior:
- Input with `value=""` (reset/All input): pushes `ln-filter:changed` event with empty value, then calls `this.reset()` which pushes `ln-filter:reset` and sets state to null/null
- Input with a value that matches current active state (toggle off): pushes `ln-filter:changed` event with empty value, then calls `this.reset()`
- Input with a new value: pushes `ln-filter:changed` event, then sets `state.key` and `state.value`

### Public API Methods

| Method | Action |
|--------|--------|
| `filter(key, value)` | Push `ln-filter:changed` event, set `state.key` and `state.value` |
| `reset()` | Push `ln-filter:reset` event, set state to `null`/`null` |
| `getActive()` | Return `{ key, value }` or `null` if in reset state |

All methods go through the same state → batcher → render → event pipeline.

### Why `reactiveState` (not `deepReactive`)

State is flat — two scalar values (`key`, `value`). No nested objects or arrays. `reactiveState` (shallow proxy) is sufficient and lighter than `deepReactive`. Compare with ln-table which uses `deepReactive` because `columnFilters` is a nested object with dynamic keys.

### Why NOT `fill()` / `renderList()`

- Inputs are server-rendered, not from templates. `_render()` toggles `input.checked` on existing inputs.
- Target items are external DOM (a separate container by ID). ln-filter doesn't own or create them — it only sets/removes `data-ln-filter-hide`.
- There is no template cloning or list building. All DOM elements exist at page load.

### Lifecycle

1. **Init**: MutationObserver or DOMContentLoaded → `_findElements` → `new _component(dom)`
2. **Guard**: `data-ln-filter-initialized` attribute prevents double-init on the same element
3. **Steady state**: change event or API call → set state → batcher → render → dispatch events
4. **Destroy**: `destroy()` removes all change listeners, the init guard attribute, and the instance reference.
