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
- **The Menu (`data-ln-toggle`)**: Standard `ln-toggle` element. Value `open` represents open; anything else is closed. Role `menu` is auto-injected on `<ul>`, `role="none"` on `<li>`, and `role="menuitem"` with roving `tabindex` on interactive child buttons/anchors.

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
- `data-ln-dropdown-position`: Placed on the wrapper element to configure target placement (e.g. `"bottom-start"`, `"bottom-end"`, default: `"bottom-end"`).
- `data-ln-dropdown-placement`: Dynamically set on the menu element by JS with the computed winning placement.
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

## 5. Behavior, Positioning & Keyboard Navigation

- **Top-Layer Promotion**: On open, the menu is shown via the native Popover API (`showPopover()`), which renders it in the browser's top layer — escaping ancestor `overflow: hidden` clipping and stacking contexts without moving it in the DOM. `popover="manual"` keeps dismissal entirely under `ln-dropdown`'s own control (no native light-dismiss).
- **Positioning**: Reads `data-ln-dropdown-position` (default: `"bottom-end"`). It opens aligned to the trigger, automatically flips if space is constrained, and reflects the winning placement in `data-ln-dropdown-placement`.
- **Scroll & Resize Tracking**: Repositions automatically on every scroll to track the trigger. A window viewport resize closes the menu to prevent layout misalignments.
- **ARIA Semantics & Structure**: `role="menu"` is set on the `<ul>`, `role="none"` on each `<li>` to strip list semantics, and `role="menuitem"` with roving `tabindex` (`0` on active/first, `-1` on siblings) on inner `<button>` and `<a href>` elements. All of this is injected and managed dynamically by JS — authors do not need to annotate children manually.
- **ARIA APG Keyboard Navigation**:
  - `ArrowDown` / `ArrowUp` on the trigger opens the menu and focuses the first/last menu item.
  - Inside the menu, `ArrowDown` and `ArrowUp` rove focus cyclically across interactive items (`<button>`, `<a href>`).
  - `Home` / `End` immediately jump to the first / last menu item.
  - `Escape` closes the menu (`data-ln-toggle="close"`), stops propagation, and returns focus to the trigger button.
  - `Tab` returns focus to the trigger button and closes the menu, allowing the native Tab flow to advance to the next page element seamlessly.

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="components/ln-dropdown/ln-dropdown.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [components/ln-dropdown/src/ln-dropdown.js](file:///c:/laragon/www/ln-ashlar/components/ln-dropdown/src/ln-dropdown.js).

---

## Related
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary disclosure state primitive.
- **[`ln-popover`](../ln-popover/README.md)** — Viewport-aware click-triggered rich-content overlays.

---

## 🔧 Internals

Source: `components/ln-dropdown/ln-dropdown.js`. Each `[data-ln-dropdown]` gets a `_component` instance at `element.lnDropdown` (`dom` the wrapper, `toggleEl` the menu, `triggerBtn`, plus the bound outside-click / scroll-reposition / resize-close / keydown handles, cleared on close and destroy).

### Dependency on ln-toggle

Dropdown does not manage open/close state itself — it listens for `ln-toggle:open`/`ln-toggle:close` on the inner `[data-ln-toggle]` menu and runs top-layer/positioning/listener-lifecycle steps in response. This is the library's **Presentation Coordinator** pattern layered on a state primitive; see [Coordinator Doctrine Reference](../../docs/architecture/coordinator.md).

### Top-layer + placement

The menu carries `popover="manual"` (set at construction). On `ln-toggle:open`: `showPopover()` promotes it to the browser's top layer — escaping ancestor `overflow: hidden` clips and stacking contexts without moving it in the DOM — then `_reposition()` measures and places it. On `ln-toggle:close`: the inline `top`/`left` and `data-ln-dropdown-placement` are cleared and `hidePopover()` retracts it (guarded by `:popover-open`, since a menu opened at boot via persisted/static state was never shown through `showPopover()`).

`_reposition()` reads the trigger's bounding rect, measures the menu via `measureHidden` (ln-core's hidden-safe dimension read), and calls `computePlacement(rect, size, position, gap)` — `gap` from the `--size-xs` token, `position` from `data-ln-dropdown-position` (default `'bottom-end'`). `computePlacement` flips if there's no room (alignment preserved through the flip) and clamps to the viewport.

### Listener lifecycle

`ln-toggle:open`/`ln-toggle:close` and `keydown` are bound at construction and removed at `destroy()`. On open only: an outside-click listener on `document` (deferred one tick via `setTimeout(0)` so the opening click itself doesn't immediately close the menu), a `scroll` listener on `window` (reposition), and a `resize` listener on `window` (close — resize makes fixed-position coordinates stale). All three are removed on close.

### MutationObserver

One global observer on `document.body`: `childList` (subtree) auto-initializes new `[data-ln-dropdown]` wrappers; `attributes` on `data-ln-dropdown` initializes on attribute addition.
