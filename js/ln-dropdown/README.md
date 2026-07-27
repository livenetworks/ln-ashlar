# ln-dropdown

> A menu-grade coordinator that adds click-outside, top-layer promotion, and automatic positioning on top of `ln-toggle`.

---

## 1. Philosophy & The Dropdown Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating a heavy component that bundles state, LIFO click stacks, top-layer contexts, and styles, `ln-dropdown` splits them cleanly:

1. **State Primitive (`ln-toggle`)**: Open/close state lives entirely on the inner `data-ln-toggle` attribute on the menu. `ln-dropdown` does not re-implement state; it is a thin behavior layer on top.
2. **Behavior & Positioning (JavaScript)**: The `ln-dropdown` coordinator handles click-outside detection, viewport resize closures (which makes absolute positioning unreliable), top-layer promotion via the native Popover API (`popover="manual"`) to escape parent `overflow: hidden` clips and stacking contexts, and scroll position tracking.
3. **Visual Presentation (CSS)**: Visual layouts, background shadows, and borders are handled in Vanilla CSS. The library ships mixins like `@include dropdown` and `@include dropdown-menu` to style the wrapper and popup elements.

---

## 2. Minimal Blueprint

Triggers and dropdown menus are paired by ID inside a wrapper container. Inactive menus are hidden via `ln-toggle` default rules.

```html
<!-- The Wrapper -->
<div data-ln-dropdown>
    <!-- The Trigger -->
    <button type="button" data-ln-toggle-for="options-menu">Options</button>
    
    <!-- The Menu (State Primitive) -->
    <ul id="options-menu" data-ln-toggle>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><hr></li>
        <li><a href="/logout">Log out</a></li>
    </ul>
</div>
```

### Key Anatomy Rules
- **The Wrapper (`data-ln-dropdown`)**: Creates the dropdown coordinator instance.
- **The Trigger (`data-ln-toggle-for="id"`)**: Standard `ln-toggle` button. ARIA attributes `aria-haspopup="menu"` and `aria-expanded` are synced automatically.
- **The Menu (`data-ln-toggle`)**: Standard `ln-toggle` element. Value `open` represents open; anything else is closed. Role `menu` is auto-injected.

---

## 3. Declarative API & State Contract

There are no imperative JavaScript methods (like `open()` or `close()`) on the coordinator instance. **The HTML attribute is the sole contract.** 

Outside clicks, window resizes, triggers, and custom scripts all change state by writing the active attribute on the inner menu element:

```js
const wrapper = document.querySelector('[data-ln-dropdown]');
const menu = wrapper.querySelector('[data-ln-toggle]');

// Open the menu (dropdown promotes it to the top layer and positions it automatically)
menu.setAttribute('data-ln-toggle', 'open');

// Close the menu
menu.setAttribute('data-ln-toggle', 'close');

// Cleanup the coordinator instance
wrapper.lnDropdown.destroy();
```

### Attributes
- `data-ln-dropdown`: Placed on the wrapper element to create the coordinator.
- `data-ln-toggle-for="id"`: Placed on trigger referencing the menu ID.
- `data-ln-toggle`: Placed on the menu element. Value `"open"` = open; anything else = closed.

---

## 4. Transition Events

All events bubble. The dispatch target is the inner menu element (except `:destroyed` which dispatches on the wrapper).

| Event | Bubbles | Detail | Dispatched When |
|---|---|---|---|
| **`ln-dropdown:open`** | Yes | `{ target: menuElement }` | After top-layer promotion and positioning are complete. |
| **`ln-dropdown:close`** | Yes | `{ target: menuElement }` | After menu is closed, exits the top layer, and outside listeners removed. |
| **`ln-dropdown:destroyed`** | Yes | `{ target: wrapperElement }` | Inside `destroy()`, after removing listeners. |

*Note*: Open/close state is managed by `ln-toggle`. Use `ln-toggle:before-open` / `ln-toggle:before-close` to cancel transitions.

```js
// Example: React to dropdown open
document.addEventListener('ln-dropdown:open', (e) => {
    console.log('Active dropdown:', e.detail.target.id);
});
```

---

## 5. Behavior & Integration

- **Top-Layer Promotion**: On open, the menu is shown via the native Popover API (`showPopover()`), which renders it in the browser's top layer — escaping ancestor `overflow: hidden` clipping and stacking contexts without moving it in the DOM. `popover="manual"` keeps dismissal entirely under `ln-dropdown`'s own control (no native light-dismiss).
- **Positioning**: The menu opens below the trigger, right-aligned to it. It automatically flips above if there is no vertical space below, and left-aligned if there is no horizontal space on the right.
- **Scroll & Resize Tracking**: Repositions automatically on every scroll to track the trigger. A window viewport resize closes the menu to prevent layout misalignments.

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="js/ln-dropdown/ln-dropdown.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-dropdown/src/ln-dropdown.js](file:///c:/laragon/www/ln-ashlar/js/ln-dropdown/src/ln-dropdown.js).

---

## Related
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary disclosure state primitive.
- **[`ln-popover`](../ln-popover/README.md)** — Viewport-aware click-triggered rich-content overlays.

---

## 🔧 Internals

Source: `js/ln-dropdown/ln-dropdown.js`. Each `[data-ln-dropdown]` gets a `_component` instance at `element.lnDropdown` (`dom` the wrapper, `toggleEl` the menu, `triggerBtn`, and `_teleportRestore` — the cleanup closure from `teleportToBody()`, or `null` when closed).

### Dependency on ln-toggle

Dropdown does not manage open/close state itself — it listens for `ln-toggle:open`/`ln-toggle:close` on the inner `[data-ln-toggle]` menu and runs teleport/positioning/listener-lifecycle steps in response. This is the library's **Presentation Coordinator** pattern layered on a state primitive; see [Coordinator Doctrine Reference](../../docs/architecture/coordinator.md).

### Teleport + placement (delegated to ln-core)

On `ln-toggle:open`: `teleportToBody(toggleEl)` moves the menu to `<body>` (saving the restore closure), `position: fixed` is applied, then `_reposition()` measures and places it. On `ln-toggle:close`: inline position styles are cleared and `_teleportRestore()` returns the menu to its original DOM position.

`_reposition()` reads the trigger's bounding rect, measures the menu via `measureHidden` (ln-core's hidden-safe dimension read), and calls `computePlacement(rect, size, 'bottom-end', gap)` — `gap` from the `--size-xs` token. `'bottom-end'` means below the trigger, right-aligned; `computePlacement` flips to `'top-end'` if there's no room below (alignment preserved through the flip) and clamps to the viewport.

### Listener lifecycle

`ln-toggle:open`/`ln-toggle:close` are bound at construction and removed at `destroy()`. On open only: an outside-click listener on `document` (deferred one tick via `setTimeout(0)` so the opening click itself doesn't immediately close the menu), a `scroll` listener on `window` (reposition), and a `resize` listener on `window` (close — resize makes fixed-position coordinates stale). All three are removed on close.

### MutationObserver

One global observer on `document.body`: `childList` (subtree) auto-initializes new `[data-ln-dropdown]` wrappers; `attributes` on `data-ln-dropdown` initializes on attribute addition.
