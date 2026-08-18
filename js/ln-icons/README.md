# ln-icons

A zero-dependency, local-first **On-Demand SVG Sprite Generator** that dynamically monitors, fetches, and compiles SVG icons at runtime.

Instead of bundling thousands of heavy vector paths or requiring complex manual build steps, it intercepts standard DOM `<use>` tags, fetches vector definitions from a remote CDN, caches them in `localStorage`, and injects them into a single unified hidden SVG sprite sheet.

---

## 🧭 Philosophy & Architecture

1. **Declarative On-Demand Rendering:** Icons are declared directly in HTML. The component monitors the DOM via `MutationObserver` for `<use>` references with `#ln-` and `#lnc-` prefixes. It only fetches and compiles icons that are actively present on the page.
2. **Dual-Prefix Routing:**
   - **`#ln-{name}`**: Automatically routes to the [Tabler Icons](https://tabler.io/icons) library fetched from a public CDN. No configuration required.
   - **`#lnc-{name}`**: Routes to a custom corporate CDN defined via global window settings.
3. **Local Caching Layer:** Fetched SVG path structures are instantly cached in `localStorage` under `lni:{id}`. Subsequent visits render icons instantly with zero network roundtrips.

---

## 📦 Minimal Blueprint

### Native Tabler Icon
```html
<svg class="ln-icon" aria-hidden="true">
  <use href="#ln-home"></use>
</svg>
```

### Custom Asset Icon
Define your custom CDN endpoint before importing the library:
```html
<script>
  window.LN_ICONS_CUSTOM_CDN = "https://cdn.mycompany.com/assets/icons";
</script>
<script src="dist/ln-ashlar.iife.js" defer></script>

<!-- Renders icon from your custom CDN -->
<svg class="ln-icon" aria-hidden="true">
  <use href="#lnc-corporate-logo"></use>
</svg>
```

---

## 🛠️ Declarative API Contract

### CSS Utility Classes

Configure icon sizes and alignments using standard CSS classes:

| Class | Size | Description |
| :--- | :--- | :--- |
| `ln-icon` | `1.25rem` | Base styles, sets `fill: none`, `stroke: currentColor`, inherits color. |
| `ln-icon--sm` | `1rem` | Small icon, designed for inline text badges or buttons. |
| `ln-icon--lg` | `1.5rem` | Large icon, designed for toolbar buttons. |
| `ln-icon--xl` | `4rem` | Extra-large icon, designed for empty state illustrations. |
| `ln-chevron` | — | Automatically rotates `90deg` when an ancestor `.is-active` class is toggled. |

### Global Configuration (`window`)

Configure these properties before script initialization:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `LN_ICONS_CDN` | `https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline` | Base CDN URL for Tabler Icons. |
| `LN_ICONS_CUSTOM_CDN` | `null` | Base CDN URL for custom `#lnc-` prefixed SVG resources. |

---

## ⚡ Dynamic Interaction Flow

### Automated Mutation Observability
The loader observes the DOM continuously. When new content is injected (e.g. by `ln-ajax` or `ln-store`), any new icon `<use>` tag is intercepted, resolved, and rendered.

### Dynamic Attribute Swaps
Modifying the `href` attribute of a `<use>` element dynamically via JavaScript triggers automatic resolution of the new target icon:
```javascript
const useElement = document.querySelector('use');
// Dynamically fetches and switches the icon to a checkmark
useElement.setAttribute('href', '#ln-check');
```

---

## ⚠️ Common Pitfalls

- **Forgetting `ln-icon` Class:** Standard SVGs default to `100%` width/height. Failing to include the `ln-icon` class will cause the icon to blow up to full viewport size.
- **Incorrect Prefix Configuration:** Forgetting to define `window.LN_ICONS_CUSTOM_CDN` when using `#lnc-` will cause the loader to fail silently with undefined endpoint errors.
- **Omitting `aria-hidden="true"`:** Screen readers attempt to read SVG nodes. Always decorate decorative icons with `aria-hidden="true"`, or include an `aria-label` on their parent button.

---

## 🔧 Internals

Source: `js/ln-icons/ln-icons.js`. Routing is purely prefix-based — no config lists, no runtime mapping. Symbol IDs in the generated sprite mirror the full `href` value minus `#` (e.g. `#lnc-file-pdf` → `<symbol id="lnc-file-pdf">`).

### Scan

`_scan(root)` runs on init (`document`) and on every MutationObserver batch (each added node), matching `use[href^="#ln-"], use[href^="#lnc-"]` — the root node itself is also checked via `matches()` to cover single-node mutations. Each match calls `_load(href)`.

### Dedup + caching

Two in-memory `Set`s (`loaded`, `pending`), keyed by full `href`, prevent duplicate fetches within a page load — `_load` bails immediately if either contains the href. Beyond that, fetched SVG content persists in `localStorage` under `lni:{id}` (plus a `lni:v` version key); `_load` checks the cache before `fetch()`, and a cache hit injects the symbol synchronously with zero network round-trip. Bumping the internal `CACHE_VERSION` clears all `lni:*` keys on next load, forcing a re-fetch. All `localStorage` access is wrapped in `try/catch` for private-browsing/storage-full environments.

### Fetch + symbol injection

On a cache miss: resolve the CDN URL (`lnc-` → `LN_ICONS_CUSTOM_CDN`, `ln-` → `LN_ICONS_CDN`; `lnc-` bails silently if the custom CDN isn't configured), `fetch()`, then parse the raw SVG string — extract `viewBox` (fallback `'0 0 24 24'`), the inner content between the `<svg>` tags, and root presentation attributes (`fill`, `stroke`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`). A `<symbol>` is built from these and appended to the sprite's `<defs>`; the raw SVG is also written back to `localStorage`. Errors delete the `pending` entry silently — the icon stays blank, no retry.

### Sprite element

Created lazily on first icon load, inserted as `document.body`'s first child: `<svg id="ln-icons-sprite" hidden aria-hidden="true"><defs>...</defs></svg>`.

### MutationObserver

Observes `document.body` with `{ childList: true, subtree: true }`, firing `_scan(node)` per added element — covers modals, dynamic lists, and any JS-rendered content (e.g. `ln-ajax`/`ln-store` swaps).

### Color inheritance

Tabler SVGs use `stroke="currentColor"`, so rendered icons inherit the nearest ancestor's CSS `color`. The custom multi-color icons (`lnc-file-pdf`, `lnc-file-doc`, `lnc-file-epub`) embed explicit stroke colors in their source and intentionally do not follow `currentColor`.

### Checkbox exception

`<input type="checkbox">` is a replaced element and cannot contain children, so its checkmark cannot use the sprite — it's a `background-image` data URI in `_form.scss`, the only remaining data URI in the codebase.

### Cross-component icon injection

Several components inject `<use>` elements dynamically rather than authoring them in HTML: `ln-toast` (`#ln-x` dismiss button), `ln-upload` (`#lnc-file[-pdf|-doc|-epub]` per item, `#ln-x` remove button), `ln-confirm` (swaps an existing `<use href>` to `#ln-check` during confirm, restores on reset), `ln-table-sort` (`#ln-arrows-sort` per sortable `th`). All route through the same scan/fetch pipeline — no special-casing needed since detection is attribute-based, not author-time.

### Offline behavior

Uncached icons fail silently (`.catch()`) if the page loads offline — the icon stays blank. For offline-first deployments, self-host the SVG set and point `window.LN_ICONS_CDN` at a local server before the library initializes; `vite.config.js` copies `js/ln-icons/icons/*.svg` → `dist/icons/` at build for this purpose.

### Security & Trust Boundary

`ln-icons` dynamically fetches SVG markup from CDNs and injects it via `innerHTML` into `<symbol>` definitions without client-side sanitization. For threat modeling, `localStorage` persistence implications, strict CSP directives (`connect-src`), and self-hosting / offline SVG sprite guidance, see the [Dynamic SVG Icon Trust Boundary](../../docs/architecture/security.md#7-dynamic-svg-icon-trust-boundary-ln-icons) documentation in `docs/architecture/security.md`.

