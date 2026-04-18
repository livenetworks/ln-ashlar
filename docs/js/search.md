# Search

Generic search component — filters children of a target element by `textContent`. File: `js/ln-search/ln-search.js`.

## HTML

```html
<!-- Search on wrapper (input auto-detected inside) -->
<fieldset data-ln-search="my-list">
    <legend class="sr-only">Search</legend>
    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
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
| `data-ln-search-items="selector"` | same element as `data-ln-search` | CSS selector for `querySelectorAll` on the target — enables filtering nested elements instead of direct children. When omitted, `target.children` is used. |
| `data-ln-search-hide` | target children | Set by JS when element doesn't match |
| `data-ln-search-clear` | `<button>` inside wrapper | Clear button — clears value, resets search, refocuses input. Hidden via CSS when input is empty. |

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

- Input is debounced by 150ms — rapid keystrokes are coalesced into a single filter pass
- Filters by `textContent` of items (case-insensitive, whitespace normalized)
- Default: iterates `target.children` (direct children)
- With `data-ln-search-items`: iterates `target.querySelectorAll(selector)` — supports nested structures
- Works independently alongside `ln-filter` on the same target
- MutationObserver auto-initializes new `[data-ln-search]` elements — it does NOT re-filter when new children are added to the target
- **Browser form restore:** If the input has a pre-filled value on init (browser back/forward, server-rendered), the search is applied automatically via deferred `queueMicrotask` — all target components finish initialization before the event dispatches
- Clear button (`data-ln-search-clear`): on click, sets `input.value = ''`, calls `_search('')` to reset filtering, and refocuses the input. Visibility is CSS-only via `:placeholder-shown ~ [data-ln-search-clear]` in the `form-input-icon-group` mixin — no JS toggle needed.
