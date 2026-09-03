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
  <script src="components/ln-toggle/ln-toggle.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [components/ln-toggle/src/ln-toggle.js](file:///c:/laragon/www/ln-ashlar/components/ln-toggle/src/ln-toggle.js).

---

## Related
- **[`ln-accordion`](../ln-accordion/README.md)** — Single-open coordinator for toggle panels.
- **[`ln-dropdown`](../ln-dropdown/README.md)** — Menu wrapper adding click-outside/top-layer promotion.

---

## 🔧 Internals

Source: `components/ln-toggle/ln-toggle.js`. Imports `registerComponent`, `dispatch`, `dispatchCancelable` from `ln-core/helpers.js` and `persistGet`/`persistSet` from `ln-core/persist.js` — no other library component.

### Instance state

| Field | Description |
|---|---|
| `dom` | The panel element |
| `isOpen` | Cache of the attribute, kept current by `_syncAttribute`; used only to skip no-op transitions and as a read-only convenience getter |

No cached trigger list, no saved previous-value for revert, no timer/queue — every attribute change runs the pipeline immediately. Triggers are re-queried document-wide on each state change; cheap because the matching set is typically 1-3 elements.

### Init

`registerComponent` scans for `[data-ln-toggle]`, watches `data-ln-toggle` mutations, and instantiates panels. Triggers are handled document-wide by a single delegated click listener. `_component(dom)`:
1. **Persistence restore** — if `data-ln-persist` is present, `persistGet('toggle', dom)`; a saved value is applied via `setAttribute` *inside the constructor*. The observer does fire for that write, but `el[DOM_ATTRIBUTE]` is still `undefined` at that point (assigned only after the constructor returns), so `_syncAttribute`'s instance guard catches it and the pipeline does not run — no spurious `:before-open`/`:open` during restore.
2. Reads the (possibly restored) attribute into `isOpen`, adds `.open` if true, calls `_syncTriggerAria` for the initial ARIA state.

No `:open`/`:close` event fires at init — the attribute is already in its final state; there's been no transition.

### Delegated trigger handling

A module-level `instances` Set tracks all initialized toggle panels. A single delegated `document` click listener (`_ensureClickListener`) intercepts clicks on `[data-ln-toggle-for]`: ignores modifier-key clicks, ignores disabled targets (`isTargetDisabled`), calls `preventDefault()`, resolves the target panel by ID, and writes `data-ln-toggle` — `"open"`/`"close"` for an explicit `data-ln-toggle-action`, or the inverse of the current value for the default toggle action. There are no per-trigger event listeners or stashed handlers.

### `_syncAttribute` — the transition pipeline

Runs only when the mutated element already has an `lnToggle` instance (a brand-new element getting the attribute takes the init/upgrade path instead, via `findElements`, not a transition). Order, for the "open" direction (close mirrors it):

1. `dispatchCancelable('ln-toggle:before-open')` — listeners see `isOpen` at its **pre-transition** value.
2. If canceled: revert the attribute to `'close'` and return. The revert re-fires the observer, but `isOpen` was never changed, so the second pass is a no-op — no loop, no duplicate event.
3. `isOpen = true`, `.open` class added.
4. `_syncTriggerAria(el, true)` — before the post-event, so `:open` listeners see settled ARIA.
5. `dispatch('ln-toggle:open')`.
6. If `data-ln-persist`: `persistSet('toggle', el, 'open')` — last, so a listener that removes `data-ln-persist` synchronously during `:open` skips the write.

This ordering (cancelable → class → aria → event → persist) is the same shape for every transition in the library that follows the attribute-as-contract pattern.

### `_syncTriggerAria`

Document-scoped `querySelectorAll('[data-ln-toggle-for="<id>"]')`, sets `aria-expanded` on each match — document-scoped because triggers can live anywhere relative to their panel. Drives both screen-reader state and the CSS chevron rotation rule in `theme/components/_toggle.scss`. Called from init and every transition.

### Persistence

Key: `ln:toggle:{pagePath}:{id}` (`_resolveKey` in `ln-core/persist.js`); path-scoped and non-overrideable, so the same panel `id` on two routes stores independently. `persistGet`/`persistSet` wrap `localStorage` in `try/catch` and swallow failures silently (private browsing, quota, disabled storage) — toggle keeps working without persistence, no error surfaces.

### Destroy

Guards double-destroy, removes request listeners (`ln-toggle:request-open/close/toggle`), removes the instance from the module-level `instances` Set, unbinds the delegated `document` click listener if no instances remain (`_maybeRemoveClickListener`), deletes `el.lnToggle`, and dispatches `ln-toggle:destroyed`. Does **not** remove `data-ln-toggle` or the `.open` class — only the JS coupling is severed; the consumer removes markup state separately if a full teardown is wanted.

### What it deliberately does not do

No keyboard handling (ESC, Space/Enter on the panel), no outside-click, no focus management, no resize listener. Each is a separate concern owned by a wrapping component: `ln-dropdown` (outside-click/resize), `ln-modal` (focus trap), or project code.

### Cross-component contract

`ln-accordion` and `ln-dropdown` both reach in only through the public contract — listening for `ln-toggle:open`/`:close`, and writing `data-ln-toggle="..."` directly (never an instance method). `ln-accordion` writes `'close'` on siblings from its wrapper listener; `ln-dropdown` listens on its inner toggle and wires outside-click on `:open`, reverses on `:close`. Because the attribute is the only mutation path, cancelable events and persistence fire identically regardless of which caller changed the state — there is no private mutator to bypass the pipeline.
