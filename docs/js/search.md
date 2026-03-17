# Search

Generic search component — filters children of a target element by `textContent`. File: `js/ln-search/ln-search.js`.

## HTML

```html
<!-- Search component -->
<fieldset data-ln-search="my-list">
    <legend class="sr-only">Search</legend>
    <span class="ln-icon-search ln-icon--sm"></span>
    <input type="search" placeholder="Search..." data-ln-search-input />
</fieldset>

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
| `data-ln-search="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-search-input` | `<input>` inside | Search input (listens to `input` event) |
| `data-ln-search-debounce="300"` | component root | Optional debounce in ms (default: 0) |
| `data-ln-search-hide` | target children | Set by JS when element doesn't match |

## Events

| Event | Bubbles | `detail` |
|-------|---------|----------|
| `ln-search:input` | yes | `{ query: string, count: number, total: number }` |
| `ln-search:clear` | yes | `{ count: number, total: number }` |

## API

```js
const el = document.querySelector('[data-ln-search]');
el.lnSearch.search('query');   // search programmatically
el.lnSearch.clear();           // clear search, show all
el.lnSearch.getQuery();        // current query string
```

## CSS (consumer provides)

```css
[data-ln-search-hide] { display: none; }
```

## Behavior

- Filters by `textContent` of target children (case-insensitive)
- Works independently alongside `ln-filter` on the same target
- MutationObserver auto-re-filters dynamically added children
