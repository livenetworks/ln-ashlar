# ln-filter

Generic filter component — filters children of a target element by `data-*` attribute.
Checkbox controls with `data-ln-filter-key` + `data-ln-filter-value` control the filters. Multiple checkboxes can be active simultaneously (OR logic). The "All" (reset) checkbox uses `data-ln-filter-reset` instead of a value.
Elements that don't match any active value receive a `data-ln-filter-hide` attribute.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-filter="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-filter-key="field"` | `<input type="checkbox">` inside | Name of data attribute for comparison on target children |
| `data-ln-filter-value="val"` | `<input type="checkbox">` inside | Value for comparison |
| `data-ln-filter-reset` | `<input type="checkbox">` inside | Marks the "All" (reset) checkbox — replaces `data-ln-filter-value=""` (which still works as fallback) |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match any active value |

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

## CSS

The hide rule is bundled in ln-acme. Pill styling (active state highlight via primary color) is automatic for `label:has(> input[type="checkbox"])` via the library defaults. The consumer only needs the hide rule when combining with `ln-search`:

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
