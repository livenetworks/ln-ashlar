# ln-search

Generic search component — filters children of a target element by `textContent`.
Elements that don't match receive a `data-ln-search-hide` attribute.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-search="targetId"` | component root | Target element by ID whose children are filtered |
| `data-ln-search-input` | `<input>` inside | Search input (listens to `input` event) |
| `data-ln-search-debounce="300"` | component root | Optional debounce in ms (default: 0) |
| `data-ln-search-hide` | children of target | Set by JS when the element doesn't match |

## API

```javascript
// Instance API (on the DOM element)
var el = document.querySelector('[data-ln-search]');
el.lnSearch.search('query');   // programmatic search
el.lnSearch.clear();           // clear search, show all
el.lnSearch.getQuery();        // current query string

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM: MutationObserver auto-initializes
window.lnSearch(container);
```

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-search:input` | yes | `{ query: string, count: number, total: number }` |
| `ln-search:clear` | yes | `{ count: number, total: number }` |

```javascript
// Listen for search
document.addEventListener('ln-search:input', function (e) {
    console.log('Search:', e.detail.query, '— Results:', e.detail.count + '/' + e.detail.total);
});

// Listen for clear
document.addEventListener('ln-search:clear', function (e) {
    console.log('Search cleared, total:', e.detail.total);
});
```

## Example

```html
<!-- Search component -->
<fieldset data-ln-search="my-list">
    <legend class="sr-only">Search</legend>
    <span class="ln-icon-search ln-icon--sm"></span>
    <input type="search" placeholder="Search..." data-ln-search-input />
</fieldset>

<!-- Target list (ID = value from data-ln-search) -->
<ul id="my-list">
    <li>First element</li>
    <li>Second element</li>
    <li>Third element</li>
</ul>
```

### With debounce

```html
<fieldset data-ln-search="results" data-ln-search-debounce="300">
    <input type="search" data-ln-search-input placeholder="Search..." />
</fieldset>
```

## CSS

The consumer must provide a CSS rule for hiding:

```css
[data-ln-search-hide] {
    display: none;
}
```

## Combination with ln-filter

`ln-search` and `ln-filter` work **independently** on the same target — each with its own hide attribute. An element is visible only when **no** hide attribute is present:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

## Dynamic elements

When children are added to the target list (AJAX, populate), `ln-search` automatically re-filters them if there is an active query. A MutationObserver on the target element ensures this.
