# Toggle

Generic toggle component — adds/removes `open` class on an element. CSS defines the animation. Works for sidebar, collapsible sections, dropdowns — anything. File: `js/ln-toggle/ln-toggle.js`.

## Single Source of Truth

The `data-ln-toggle` attribute is the single source of truth. All state changes flow through it — the JS API, trigger buttons, and external code all set the attribute, and the MutationObserver reacts by applying the `.open` class and dispatching events.

## HTML

```html
<!-- Sidebar -->
<aside id="sidebar" class="sidebar open" data-ln-toggle="open">
    <button aria-label="Close" data-ln-toggle-for="sidebar" data-ln-toggle-action="close"></button>
    <nav>...</nav>
</aside>
<button aria-label="Open menu" data-ln-toggle-for="sidebar"></button>

<!-- Collapsible section -->
<header data-ln-toggle-for="section1">Title</header>
<section id="section1" data-ln-toggle="open" class="collapsible">
    <article class="collapsible-body">Content here</article>
</section>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-toggle` | target element | Creates instance, starts closed |
| `data-ln-toggle="open"` | target element | Starts open (gets `.open` class) |
| `data-ln-toggle-for="id"` | button | References target element by ID |
| `data-ln-toggle-action="open\|close"` | button | Explicit action (default: toggle) |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-toggle:before-open` | yes | **yes** | `{ target }` |
| `ln-toggle:open` | yes | no | `{ target }` |
| `ln-toggle:before-close` | yes | **yes** | `{ target }` |
| `ln-toggle:close` | yes | no | `{ target }` |
| `ln-toggle:destroyed` | yes | no | `{ target }` |

If `before-open`/`before-close` is canceled (`preventDefault()`), the observer reverts the attribute.

## API

```js
const el = document.getElementById('sidebar');
el.lnToggle.open();       // sets attribute → observer applies state
el.lnToggle.close();      // sets attribute → observer applies state
el.lnToggle.toggle();     // toggles based on current state
el.lnToggle.isOpen;       // boolean
el.lnToggle.destroy();    // removes instance, dispatches ln-toggle:destroyed

// Direct attribute change — identical result
el.setAttribute('data-ln-toggle', 'open');
el.setAttribute('data-ln-toggle', 'close');

// Manual initialization (Shadow DOM, iframe only)
window.lnToggle(container);
```

## Persistence

Toggle supports opt-in `localStorage` persistence via the `data-ln-persist` attribute.

| Attribute | Description |
|-----------|-------------|
| `data-ln-persist` | Boolean — uses element `id` as storage key |
| `data-ln-persist="custom-key"` | Uses the given string as storage key |

**Storage key format:** `ln:toggle:{pagePath}:{id}`

- `pagePath` = `location.pathname` lowercased, trailing slash stripped, or `/` for root
- `id` = explicit `data-ln-persist` value, or element's `id` attribute
- Example: `ln:toggle:/admin/users:sidebar`

**Restore timing:** In `_component` constructor, before `this.isOpen` is read. If a saved value exists, `dom.setAttribute(DOM_SELECTOR, saved)` is called first — the existing `this.isOpen` line then picks up the restored value naturally. No special branching required.

**Save timing:** In `_syncAttribute`, after each successful state change — after `dispatch('ln-toggle:open')` or `dispatch('ln-toggle:close')`. Saves only if `el.hasAttribute('data-ln-persist')`.

**Graceful degradation:** All `localStorage` calls are wrapped in `try/catch`. If storage is unavailable or full, the error is silently swallowed and the toggle continues working without persistence.

**Missing key warning:** If `data-ln-persist` is present but no `id` or explicit value exists, `console.warn` is emitted and persistence is skipped — the toggle still functions normally.

---

## Internal Architecture

This section explains how the component works internally. A developer or AI reading this should fully understand the data flow, state model, and event pipeline without reading the source.

### State

Each `[data-ln-toggle]` element gets a `_component` instance stored at `element.lnToggle`. Instance state is minimal:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the host element |
| `isOpen` | boolean | Current open/closed state |

There is no reactive proxy — state is a single boolean, and the attribute is the source of truth.

### Attribute-Driven Flow

This is the canonical pattern that other ln-ashlar components (ln-modal, ln-accordion) are built on:

```
API call or trigger click
    |
    v
open() / close() / toggle()
    |
    v
setAttribute('data-ln-toggle', 'open' | 'close')
    |
    v
MutationObserver fires
    |
    v
_syncAttribute(el):
    1. Read attribute value, compare to instance.isOpen
    2. If no change → return (no-op)
    3. Dispatch cancelable before-event (ln-toggle:before-open or ln-toggle:before-close)
    4. If preventDefault() called → revert attribute to previous value, return
    5. Update instance.isOpen
    6. Add or remove .open class
    7. Dispatch post-event (ln-toggle:open or ln-toggle:close)
```

**Key insight**: API methods (`open`, `close`, `toggle`) never apply state directly. They only set the attribute. The MutationObserver is the single codepath that applies `.open` class and dispatches events. This means `el.setAttribute('data-ln-toggle', 'open')` from external code produces identical behavior to `el.lnToggle.open()`.

### Cancelable Before-Events

Before-events use `dispatchCancelable()` from ln-core. If a listener calls `preventDefault()`, the observer **reverts the attribute** to its previous value (`open` → `close` or vice versa). This revert does not re-trigger the observer because `_syncAttribute` compares the new value against `instance.isOpen` — since state was never updated, the comparison shows no change and returns immediately.

### Trigger Buttons

Buttons with `data-ln-toggle-for="id"` are wired up by `_attachTriggers()`:

1. Click handler reads `data-ln-toggle-for` to find the target element by ID
2. Reads optional `data-ln-toggle-action` (`open`, `close`, or default `toggle`)
3. Calls the corresponding API method on the target's instance
4. Guard: `btn[lnToggleTrigger] = true` prevents duplicate listeners when MutationObserver re-fires on existing triggers
5. Modifier keys (ctrl/meta) and middle-click are allowed through without `preventDefault()` — this preserves native browser behavior (open in new tab, etc.)

### Trigger A11y Sync

Whenever a panel's state changes, `_syncTriggerAria(panelEl, isOpen)` runs
and sets `aria-expanded` on every `[data-ln-toggle-for="<panel.id>"]` in
the document. Called from three places:

1. `_component(dom)` — on init, so server-rendered open panels start with
   `aria-expanded="true"` on their triggers (no flash of `false`).
2. `_syncAttribute(el)` — before each open/close event fires, so all DOM
   state (panel `.open` class + trigger `aria-expanded`) is settled before
   any listener runs.
3. `_attachTriggers(root)` — when a trigger is attached to the DOM after
   its target was already initialized, the new trigger inherits the
   current state.

The CSS chevron-rotation rule
(`[data-ln-toggle-for][aria-expanded="true"] .ln-chevron { transform: rotate(180deg); }`)
is driven by this attribute, so chevron rotation works for any toggle —
not just inside an accordion.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements added to DOM → `findElements` + `_attachTriggers` auto-initializes them
- **`attributes`** (`data-ln-toggle`, `data-ln-toggle-for`): attribute changes on existing elements → either `_syncAttribute` (state change) or `findElements` + `_attachTriggers` (new component/trigger)

### Why This Matters

This attribute-driven reactive pattern is the foundation of ln-ashlar's component model:

- **ln-accordion** coordinates multiple ln-toggle instances — it listens for toggle events and closes siblings
- **External code** can drive state purely through `setAttribute` without importing anything
- **Server-rendered state** works automatically — `data-ln-toggle="open"` in HTML applies `.open` class on init
- **ln-ashlar v2** generalizes this pattern with Proxy-based reactivity, but the attribute-as-source-of-truth principle remains
