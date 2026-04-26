# Icons

On-demand SVG icon loader. Scans the DOM for `<use href="#ln-*">` and `<use href="#lnc-*">` elements, fetches each referenced icon individually from CDN, and injects them as `<symbol>` elements into a hidden sprite. Fetched SVGs are cached in `localStorage` — subsequent page loads resolve from cache with zero network requests. File: `js/ln-icons/ln-icons.js`.

## Two Prefixes

Routing is determined entirely by the `href` prefix — no config lists, no runtime mapping:

| Prefix | CDN | Config required |
|--------|-----|----------------|
| `#ln-` | Tabler via jsDelivr | no (default) |
| `#lnc-` | Custom CDN | `window.LN_ICONS_CUSTOM_CDN` |

```
#ln-trash     →  BASE_CDN/trash.svg
#lnc-file-pdf →  CUSTOM_CDN/file-pdf.svg
```

Symbol IDs in the sprite mirror the full `href` value minus `#`:

```html
<symbol id="ln-trash" ...>
<symbol id="lnc-file-pdf" ...>
```

## Architecture Shift: Bundle → On-Demand

| | Old | New |
|---|---|---|
| Source | `import.meta.glob` inlined all SVGs at build time | Fetched at runtime, one per unique icon |
| Custom routing | `window.LN_ICONS_CUSTOM` array | `lnc-` prefix in HTML |
| Bundle size | grows with icon count | zero SVG content |
| Vite dependency | `import.meta.glob` | none |

## Config

Read from `window` at init (before DOMContentLoaded):

```javascript
var BASE_CDN   = window.LN_ICONS_CDN        || 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline';
var CUSTOM_CDN = window.LN_ICONS_CUSTOM_CDN || '';
```

`lnc-` icons silently skip if `CUSTOM_CDN` is not set.

## DOM Scan — `_scan(root)`

Called on init with `document` and on every MutationObserver batch with each added node.

```
selector: 'use[href^="#ln-"], use[href^="#lnc-"]'

For each matched <use>:
  href = use.getAttribute('href')  →  e.g. '#lnc-file-pdf'
  _load(href)
```

Root element itself is also checked with `matches()` — covers single-node mutations.

## Deduplication & Caching

Two `Set` instances keyed by full `href` value (e.g. `'#lnc-file-pdf'`) prevent duplicate requests within a single page load:

```javascript
var loaded  = new Set();  // successfully added to sprite
var pending = new Set();  // fetch in flight
```

`_load(href)` bails immediately if `loaded.has(href) || pending.has(href)`.

### localStorage Cache (cross-navigation)

Fetched SVG content is persisted in `localStorage` with prefix `lni:` (e.g. `lni:ln-home`). On each `_load(href)` call, localStorage is checked before `fetch()`. Cache hits inject the symbol synchronously — no network request.

```javascript
var CACHE_PREFIX  = 'lni:';
var CACHE_VER_KEY = 'lni:v';
var CACHE_VERSION = '1';
```

Cache invalidation: bumping `CACHE_VERSION` clears all `lni:*` keys on next page load, forcing a re-fetch. All `localStorage` access is wrapped in `try/catch` to handle private browsing and storage-full scenarios gracefully.

## Fetch + Symbol Injection — `_load(href)` → `_addSymbol(id, raw)`

```
1. Bail if loaded or pending
2. Bail if lnc- prefix and CUSTOM_CDN is empty
3. Check localStorage for cached SVG:
   a. If found → _addSymbol(id, cached), loaded.add(href), return
4. pending.add(href)
5. Resolve URL:
     lnc- → CUSTOM_CDN + '/' + name + '.svg'
     ln-  → BASE_CDN   + '/' + name + '.svg'
6. fetch(url)
7. On success: parse raw SVG string
   a. Extract viewBox (fallback: '0 0 24 24')
   b. Extract inner content between <svg> tags
   c. Extract root SVG presentation attrs: fill, stroke, stroke-width, stroke-linecap, stroke-linejoin
   d. Create <symbol id="{href minus #}" viewBox="..." {attrs}>
   e. symbol.innerHTML = inner
   f. Append to <defs> in sprite
   g. Store raw SVG in localStorage
8. loaded.add(href), pending.delete(href)
9. On error: pending.delete(href) — silent fail, icon stays blank
```

## Sprite Element

Created lazily on first icon load, inserted as `document.body.firstChild`:

```html
<svg id="ln-icons-sprite" hidden aria-hidden="true">
    <defs>
        <symbol id="ln-home" viewBox="0 0 24 24">...</symbol>
        <symbol id="lnc-file-pdf" viewBox="0 0 24 24">...</symbol>
    </defs>
</svg>
```

## MutationObserver

Observes `document.body` with `{ childList: true, subtree: true }`. Fires `_scan(node)` on every added element — covers modals, dynamic lists, JS-rendered content.

## Color Inheritance

Tabler SVGs use `stroke="currentColor"`. When rendered via `<use>`, the icon inherits the CSS `color` property of its nearest ancestor.

**Custom multi-color icons** (`lnc-file-pdf`, `lnc-file-doc`, `lnc-file-epub`) have specific stroke colors embedded in their SVG source. They intentionally do not follow `currentColor`.

## Icon Name Reference

Full list of available Tabler icon names: `scss/tabler-icons.txt`

## CSS — `scss/config/_icons.scss`

```scss
svg.ln-icon {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    vertical-align: middle;
}

svg.ln-icon.ln-icon--sm { width: 1rem;   height: 1rem;   }
svg.ln-icon.ln-icon--lg { width: 1.5rem; height: 1.5rem; }
svg.ln-icon.ln-icon--xl { width: 4rem;   height: 4rem;   }
```

## Build Output

`vite.config.js` copies `js/ln-icons/icons/*.svg` → `dist/icons/` on build. Upload these to `window.LN_ICONS_CUSTOM_CDN`.

## Accordion Chevron

`@mixin accordion` in `_collapsible.scss` rotates `.ln-chevron` on open state:

```scss
[data-ln-accordion] li > [data-ln-toggle-for] .ln-chevron {
    transition: transform var(--transition-base);
}
[data-ln-accordion] li:has(> .collapsible.open) > [data-ln-toggle-for] .ln-chevron {
    transform: rotate(180deg);
}
```

## JS Components That Inject Icons

| Component | What it injects |
|-----------|----------------|
| `ln-toast.js` | `<use href="#ln-x">` in dismiss button |
| `ln-upload.js` | `<use href="#lnc-file[-pdf|-doc|-epub]">` per file item; `#ln-x` in remove button |
| `ln-confirm.js` | Swaps `<use href>` on existing SVG: `#ln-check` during confirm, restores original on reset |
| `ln-table-sort.js` | `<use href="#ln-arrows-sort">` in each `th[data-ln-sort]` |

## Checkbox Exception

`<input type="checkbox">` is a replaced element — cannot contain children. The checkmark uses a `background-image` data URI in `_form.scss`. This is the only remaining data URI in the codebase, confined to one property in one mixin.

## Dependencies

None. No `import.meta.glob`. Works in any environment that supports `fetch` and `MutationObserver`.
