# Filter

Generic filter component — filters children of a target element by `data-*` attribute. File: `js/ln-filter/ln-filter.js`.

## HTML

```html
<!-- Filter buttons -->
<nav data-ln-filter="my-list">
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="">All</button>
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="a">Category A</button>
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="b">Category B</button>
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
| `data-ln-filter-key="field"` | `<button>` inside | Data attribute name to compare on target children |
| `data-ln-filter-value="val"` | `<button>` inside | Value to match (empty = show all) |
| `data-ln-filter-hide` | target children | Set by JS when element doesn't match |
| `data-active` | active button | Set by JS on the currently selected button |

## Events

| Event | Bubbles | `detail` |
|-------|---------|----------|
| `ln-filter:changed` | yes | `{ key: string, value: string }` |
| `ln-filter:reset` | yes | `{}` |

## API

```js
const el = document.querySelector('[data-ln-filter]');
el.lnFilter.filter('genre', 'rock');  // filter programmatically
el.lnFilter.reset();                   // clear filter, show all
el.lnFilter.getActive();               // { key, value } or null
```

## CSS (consumer provides)

```css
[data-ln-filter-hide] { display: none; }

[data-ln-filter-key][data-active] {
    background: var(--accent);
    color: var(--bg);
}
```

## Behavior

- Button with `data-ln-filter-value=""` = "Show all" (reset). Gets `data-active` on init.
- Works independently alongside `ln-search` on the same target — each with its own hide attribute.
- MutationObserver auto-re-filters dynamically added children.
