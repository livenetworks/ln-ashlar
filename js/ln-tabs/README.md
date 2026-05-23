# ln-tabs

> N-way exclusive panel selection on a single container, managed reactively via the DOM.

---

## 1. Philosophy & The Tabs Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating heavy components that mix state, visual presentation, and layout, `ln-tabs` separates them into isolated concerns:

1. **State & ARIA (JavaScript)**: The `ln-tabs` component (145 lines) only manages the active tab key in the DOM, maps namespace URL hashes, handles optional `localStorage` persistence, and synchronizes ARIA accessibility. It possesses zero visual styles.
2. **Visual Presentation (CSS)**: Visual layouts, borders, alignments, and active indicator designs are handled in Vanilla CSS. The library ships mixins like `@mixin tabs-nav`, `@mixin tabs-tab`, and `@mixin tabs-panel` to handle this elegantly.
3. **Decoupled Binding (HTML)**: Tab triggers and panels are paired purely by string keys (`data-ln-tab="key"` and `data-ln-panel="key"`), decoupled from their relative DOM positions.

### Why not built on `ln-toggle`?
While similar on the surface, their contracts diverge. `ln-toggle` is a binary disclosure primitive (using `aria-expanded`). `ln-tabs` is an N-way exclusive tablist (using `aria-selected` and `aria-hidden`) that supports advanced, namespace-scoped URL deep-linking out of the box.

---

## 2. Minimal Blueprint

Triggers and panels are bound via matching keys inside a wrapper. Inactive panels must carry `class="hidden"` to prevent a layout flash before initialization.

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <!-- Tab list (triggers) -->
    <nav>
        <button type="button" data-ln-tab="info">Information</button>
        <button type="button" data-ln-tab="settings">Settings</button>
    </nav>

    <!-- Tab panels -->
    <section data-ln-panel="info">
        <p>This is the info panel.</p>
    </section>
    <section data-ln-panel="settings" class="hidden">
        <p>This is the settings panel.</p>
    </section>
</section>
```

### Key Anatomy Rules
- **The Wrapper (`data-ln-tabs`)**: Creates the tabs root instance.
- **The Trigger (`data-ln-tab="key"`)**: Marks the element as a click target. Must be a `<button>` (with `type="button"` inside forms) or an `<a>` anchor.
- **The Panel (`data-ln-panel="key"`)**: Matches the trigger by key. Inactive panels must carry `class="hidden"`.

---

## 3. The Declarative API & State Contract

There are no imperative JavaScript methods (like `activate()` or `open()`) on the component instance. **The HTML attribute is the sole contract.** 

Clicks, URL hash changes, localStorage restorations, and external scripts all change state by writing the active attribute on the wrapper:

```js
const tabs = document.getElementById('user-tabs');

// Canonical write — switches the active tab
tabs.setAttribute('data-ln-tabs-active', 'settings');

// Read-only state query
tabs.getAttribute('data-ln-tabs-active'); // Returns currently active key
```

### Attributes
- `data-ln-tabs`: Placed on the wrapper to create the instance.
- `data-ln-tabs-active`: Currently active key (written by the component, watched by the observer).
- `data-ln-tabs-default="key"`: Default key selected on load. Falls back to the first tab trigger if omitted.
- `data-ln-tabs-focus="false"`: Opt out of auto-focusing the first focusable element inside the active panel. Default: enabled.
- `data-ln-tabs-key="name"`: Hash namespace. Falls back to wrapper `id` if omitted.
- `id="name"`: Enables hash sync. The wrapper `id` acts as the URL namespace key.
- `data-ln-persist`: Saves the active tab key in `localStorage` (effective only when hash sync is OFF).

---

## 4. Transition Events

All events bubble. The dispatch target is the wrapper element.

| Event | Cancelable | `detail` | Dispatched When |
|---|---|---|---|
| **`ln-tabs:change`** | No | `{ key, tab, panel }` | After the active panel is swapped, ARIA synced, focus moved (if enabled), and localStorage updated. |
| **`ln-tabs:destroyed`** | No | `{ target }` | Inside `destroy()`, after removing click and hashchange listeners. |

```js
// Example: Listen for tab changes
document.addEventListener('ln-tabs:change', (e) => {
    console.log(`Active tab in ${e.target.id} changed to: ${e.detail.key}`);
});
```

---

## 5. Integration Patterns

### A. Hash-Deep-Linkable Tabs (URL-as-State)
Add an `id` to the wrapper. Clicking tabs automatically writes to the URL hash (e.g. `#user-tabs:settings`). Sharing, bookmarking, or using back/forward buttons restores the active tab on load.
```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">...</section>
```

### B. Anchor Triggers (Deep Links)
Use `<a>` triggers with matching `href` format and boolean `data-ln-tab` attributes. Right-click copy link and middle-click "open in new tab" work out of the box.
```html
<a href="#user-tabs:info" data-ln-tab>Information</a>
<a href="#user-tabs:settings" data-ln-tab>Settings</a>
```

### C. Multiple Independent Tabsets
Multiple independent tabsets on the same page will coexist cleanly in the URL hash, namespaced by their respective wrapper `id`s (e.g., `#user-tabs:settings&project-tabs:members`).

### D. Persistent Tabs (Without URL Hash)
Omit the wrapper `id` and add `data-ln-persist="key"` to remember the active tab in `localStorage` without changing the URL hash.
```html
<section data-ln-tabs data-ln-persist="settings-tabs" data-ln-tabs-default="general">...</section>
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="js/ln-tabs/ln-tabs.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-tabs/src/ln-tabs.js](file:///c:/laragon/www/ln-ashlar/js/ln-tabs/src/ln-tabs.js).

---

## Related
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary disclosure state primitive.
- **[`ln-accordion`](../ln-accordion/README.md)** — Single-open coordinator built on `ln-toggle`.
- **Architecture deep-dive** — [`docs/js/tabs.md`](../../docs/js/tabs.md).
