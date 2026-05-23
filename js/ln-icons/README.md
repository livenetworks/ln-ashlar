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
