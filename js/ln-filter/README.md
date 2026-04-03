# ln-filter

Generic filter component — filters children of a target element by `data-*` attribute.
Buttons with `data-ln-filter-key` + `data-ln-filter-value` control the filters.
Elements that don't match receive a `data-ln-filter-hide` attribute.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-filter="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-filter-key="field"` | `<button>` inside | Name of data attribute for comparison on target children |
| `data-ln-filter-value="val"` | `<button>` inside | Value for comparison (empty = show all) |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match |
| `data-active` | active button | Set by JS on the currently selected button |

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
<!-- Filter buttons -->
<nav data-ln-filter="my-list">
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="">All</button>
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="a">Category A</button>
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="b">Category B</button>
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
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="">All</button>
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="0">Phase 0</button>
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="1">Phase 1</button>
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="2">Phase 2</button>
</nav>
```

> **Button with `data-ln-filter-value=""`** = "Show all" (reset). On initialization it automatically receives `data-active`.

## CSS

The consumer must provide CSS rules for hiding and for the active button:

```css
[data-ln-filter-hide] {
    display: none;
}

/* Style for active filter button */
[data-ln-filter-key][data-active] {
    background: var(--accent);
    color: var(--bg);
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

Uses `reactiveState` + `createBatcher` from `ln-core`. State is `{ key, value }` — all DOM updates (button active state, target hide attributes) derive from state in a batched `_render()` cycle. Events dispatch after render via `_afterRender()`.

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
