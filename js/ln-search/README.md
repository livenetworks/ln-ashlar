# ln-search

Generic search component — filters children of a target element by `textContent`.
Works on lists and on `[data-ln-table]` components.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-search="targetId"` | wrapper element **or** directly on `<input>` | Target element by ID |
| `data-ln-search-hide` | children of target | Set by JS when the element doesn't match |

When placed on a wrapper, the component finds the first `input[type="search"]`, `input[type="text"]`, or `[name="search"]` inside it.
When placed directly on an `<input>`, that input is used.

## Events

| Event | On | Cancelable | `detail` |
|-------|-----|-----------|--------|
| `ln-search:change` | target element | **yes** | `{ term, targetId }` |

The event fires on the **target** element (not the input) before any DOM manipulation.
If `preventDefault()` is called, `ln-search` skips its default show/hide behavior — the consumer handles filtering itself (e.g. `ln-table`).

```javascript
document.getElementById('my-list').addEventListener('ln-search:change', function (e) {
    console.log('Search term:', e.detail.term);
});
```

## Default behaviour (lists)

When the target is a plain list, `ln-search` adds `data-ln-search-hide="true"` to children that don't match, and removes it from those that do.

```css
/* Required CSS */
[data-ln-search-hide] {
    display: none;
}
```

## Table integration

When `data-ln-search` points to a `[data-ln-table]` element, `ln-table` intercepts the `ln-search:change` event and calls `preventDefault()`. This tells `ln-search` to skip DOM manipulation. `ln-table` then handles filtering in-memory (with sort and virtual scroll preserved).

```html
<input type="search" placeholder="Search..." data-ln-search="my-table">

<div id="my-table" data-ln-table>
    <table>...</table>
</div>
```

No extra configuration needed — the integration is automatic.

## Examples

### On a wrapper element

```html
<label data-ln-search="my-list">
    <span class="ln-icon-filter ln-icon--sm"></span>
    <input type="search" placeholder="Search...">
</label>

<ul id="my-list">
    <li>First element</li>
    <li>Second element</li>
</ul>
```

### Directly on an input

```html
<input type="search" placeholder="Search..." data-ln-search="my-list">

<ul id="my-list">
    <li>First element</li>
    <li>Second element</li>
</ul>
```

## Combination with ln-filter

`ln-search` and `ln-filter` work **independently** on the same target — each with its own hide attribute. An element is visible only when **no** hide attribute is present:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```
