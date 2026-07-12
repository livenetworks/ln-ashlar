# ln-toggle

> The smallest reactive primitive in `ln-ashlar` — a highly-specialized binary state machine. 

---

## 1. Philosophy & The Primitive Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating heavy components that mix state, visual presentation, and layout, we separate them into isolated concerns:

1. **The State Machine (JavaScript)**: The `ln-toggle` component (145 lines) only manages binary `open` / `close` state in the DOM and synchronizes ARIA accessibility. It does not own animations or visual geometries.
2. **The Visual Presentation (CSS)**: Visual transitions are handled in Vanilla CSS. The component simply toggles the `.open` class on the panel. CSS reads this class and runs transitions (e.g. height collapse or sliding drawers).
3. **Decoupled Binding (HTML)**: Triggers and panels are matched purely by ID. They can live anywhere in the DOM. Multiple triggers pointing to a single panel are supported natively, and all triggers stay perfectly synchronized.

---

## 2. Minimal Blueprint

Triggers and panels are bound via ID. A panel must have a unique `id` and the `data-ln-toggle` attribute.

```html
<!-- Trigger anywhere -->
<button data-ln-toggle-for="example-panel">Toggle Options</button>

<!-- Panel anywhere -->
<section id="example-panel" data-ln-toggle class="collapsible">
    <article class="collapsible-body">
        <p>This is smooth collapsible content.</p>
    </article>
</section>
```

### Key Anatomy Rules
- **The Panel (`data-ln-toggle`)**: The value `open` represents open; anything else (empty or `close`) represents closed.
- **The Trigger (`data-ln-toggle-for="id"`)**: Automatically intercepts clicks to toggle the panel. 
- **The Close Trigger (`data-ln-toggle-action="close"`)**: Forces the trigger to only close the panel (e.g. an "X" button inside a sidebar drawer).
- **The Body (`.collapsible-body`)**: Holds all padding and margins. The parent `.collapsible` container must have zero padding so it can transition to exactly `0px` height cleanly.

---

## 3. The Declarative API & State Contract

There are no imperative JavaScript methods (like `open()` or `close()`) on the component instance. **The HTML attribute is the sole contract.** 

Triggers, sibling components, external scripts, and manual DevTools edits all change state by writing the attribute:

```js
const panel = document.getElementById('example-panel');

// Open the panel
panel.setAttribute('data-ln-toggle', 'open');

// Close the panel
panel.setAttribute('data-ln-toggle', 'close');

// Read-only state query
panel.lnToggle.isOpen; // Returns true/false
```

### Attributes
- `data-ln-toggle`: Placed on the panel to create the toggle instance.
- `data-ln-toggle-for`: Placed on triggers referencing the panel ID.
- `data-ln-toggle-action="open|close"`: Forces a trigger button to only open or only close the target.
- `data-ln-persist`: Saves the panel state individually in `localStorage`. 
  - storage key: `ln:toggle:{pagePath}:{id}`. Same IDs on different pages store separately.

---

## 4. Transition Events

All events bubble. `event.detail.target` is always the panel element.

| Event | Cancelable | Dispatched When |
|---|---|---|
| **`ln-toggle:before-open`** | **Yes** | After attribute flips to `"open"`, before transition starts. Calling `event.preventDefault()` cancels the transition and reverts the attribute. |
| **`ln-toggle:open`** | No | After panel is fully open, classes added, and ARIA synced. |
| **`ln-toggle:before-close`** | **Yes** | After attribute flips to `"close"`, before transition starts. Calling `event.preventDefault()` cancels the close and reverts the attribute. |
| **`ln-toggle:close`** | No | After panel is fully closed, classes removed, and ARIA synced. |

```js
// Example: Cancel open transition for unauthorized users
document.addEventListener('ln-toggle:before-open', (e) => {
    if (e.detail.target.id === 'secure-panel' && !currentUser.isAdmin) {
        e.preventDefault(); // Reverts attribute back to "close"
    }
});
```

---

## 5. Integration Patterns

### A. Sidebar Drawer
Combine the panel with the library's `@mixin sidebar-drawer` and add a close button inside the sidebar:
```html
<aside id="menu" data-ln-toggle data-ln-persist class="sidebar">
    <button data-ln-toggle-for="menu" data-ln-toggle-action="close">×</button>
</aside>
```

### B. Smooth Height Collapsible
Combine the panel with the library's `@mixin collapsible` and `.collapsible-body` wrapper to animate height cleanly:
```html
<section id="panel" data-ln-toggle class="collapsible">
    <div class="collapsible-body">Content goes here...</div>
</section>
```

### C. Dismissible Alert
Combine the alert card with `data-ln-persist` so that once the user closes the alert, it stays closed across page reloads:
```html
<div class="alert" id="promo-banner" data-ln-toggle="open" data-ln-persist>
    <p>Promo code active!</p>
    <button data-ln-toggle-for="promo-banner" data-ln-toggle-action="close">×</button>
</div>
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="js/ln-toggle/ln-toggle.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-toggle/src/ln-toggle.js](file:///c:/laragon/www/ln-ashlar/js/ln-toggle/src/ln-toggle.js).

---

## Related
- **[`ln-accordion`](../ln-accordion/README.md)** — Single-open coordinator for toggle panels.
- **[`ln-dropdown`](../ln-dropdown/README.md)** — Menu wrapper adding click-outside/top-layer promotion.
- **Architecture deep-dive** — [`docs/js/toggle.md`](../../docs/js/toggle.md).
