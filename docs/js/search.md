# Search

Generic search component — filters children of a target element by `textContent`. File: `js/ln-search/ln-search.js`.

## HTML

```html
<!-- Search on wrapper (input auto-detected inside) -->
<fieldset data-ln-search="my-list">
    <legend class="sr-only">Search</legend>
    <span class="ln-icon-search ln-icon--sm"></span>
    <input type="search" placeholder="Search..." />
</fieldset>

<!-- Search directly on input -->
<input type="search" data-ln-search="my-list" placeholder="Search..." />

<!-- Target list -->
<ul id="my-list">
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-search="targetId"` | component root or `<input>` | Target element by ID whose children are filtered. Can be placed directly on an `<input>` or on a wrapper element. |
| `data-ln-search-hide` | target children | Set by JS when element doesn't match |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-search:change` | yes | **yes** | `{ term: string, targetId: string }` |

Dispatched on the **target element** (not the search component) via `dispatchCancelable()`. If a listener calls `preventDefault()`, the default DOM show/hide behavior is skipped — this is how `ln-table` intercepts search to apply its own filtering.

## API

```js
const el = document.querySelector('[data-ln-search]');
el.lnSearch.destroy();    // remove listeners, clean up
```

## CSS (consumer provides)

```css
[data-ln-search-hide] { display: none; }
```

## Behavior

- Filters by `textContent` of target children (case-insensitive)
- Works independently alongside `ln-filter` on the same target
- MutationObserver auto-re-filters dynamically added children
