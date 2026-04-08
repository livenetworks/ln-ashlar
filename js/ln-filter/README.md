# ln-filter

Generic filter component — filters children of a target element by `data-*` attribute.
Checkbox controls with `data-ln-filter-key` + `data-ln-filter-value` control the filters.
Elements that don't match receive a `data-ln-filter-hide` attribute.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-filter="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-filter-key="field"` | `<input type="checkbox">` inside | Name of data attribute for comparison on target children |
| `data-ln-filter-value="val"` | `<input type="checkbox">` inside | Value for comparison (empty = show all) |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match |

## API

```javascript
// Instance API (on the DOM element)
var el = document.querySelector('[data-ln-filter]');
el.lnFilter.filter('genre', 'rock');  // programmatically filter
el.lnFilter.reset();                   // clear filter, show all
el.lnFilter.getActive();               // { key: 'genre', value: 'rock' } or null
el.lnFilter.destroy();                 // remove listeners, clean up

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver automatically initializes
window.lnFilter(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-filter:changed` | yes | no | `{ key: string, value: string }` |
| `ln-filter:reset` | yes | no | `{}` |

```javascript
// Listen for filter change
document.addEventListener('ln-filter:changed', function (e) {
    console.log('Filter:', e.detail.key, '=', e.detail.value);
});

// Listen for reset
document.addEventListener('ln-filter:reset', function (e) {
    console.log('Filter reset');
});
```

## Example

### Basic usage

```html
<!-- Filter checkboxes -->
<nav data-ln-filter="my-list">
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="" checked> All</label></li>
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
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="" checked> All</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="0"> Phase 0</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="1"> Phase 1</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="phase" data-ln-filter-value="2"> Phase 2</label></li>
    </ul>
</nav>
```

> **Checkbox with `data-ln-filter-value=""`** = "Show all" (reset). On initialization the "All" checkbox is checked by default.

> **Toggle behavior**: Clicking an active filter unchecks it and resets to "All".

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

Uses `reactiveState` + `createBatcher` from `ln-core`. State is `{ key, value }` — all DOM updates (`input.checked` on filter controls, `data-ln-filter-hide` on target children) derive from state in a batched `_render()` cycle. Events dispatch after render via `_afterRender()`. Listens to `change` events on `<input type="checkbox">` elements.

## Dynamic elements

MutationObserver auto-initializes new `[data-ln-filter]` elements added to the DOM. It does NOT automatically re-filter when new children are added to the target — call `el.lnFilter.filter(key, value)` manually after populating the target with new items.

## Programmatic

```javascript
// Filter by genre
document.querySelector('[data-ln-filter]').lnFilter.filter('genre', 'rock');

// Reset
document.querySelector('[data-ln-filter]').lnFilter.reset();

// Check current filter
var active = document.querySelector('[data-ln-filter]').lnFilter.getActive();
if (active) {
    console.log('Active filter:', active.key, '=', active.value);
}
```
