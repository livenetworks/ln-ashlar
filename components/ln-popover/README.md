# ln-popover

> Viewport-aware click-triggered rich-content overlays, managed reactively via the DOM.

---

## 1. Philosophy & Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating a heavy component that bundles state, positioning algorithms, LIFO click stacks, and styles, `ln-popover` splits them cleanly:

1. **State & Positioning (JavaScript + native Popover API)**: The `ln-popover` script handles binary `open` / `closed` states in the DOM, bridged to the native Popover API (`popover="manual"`, `showPopover()`/`hidePopover()`) purely for top-layer rendering — no ancestor `overflow`/`z-index` can clip or bury it. Because `manual` mode has no native light-dismiss, the script still owns 100% of the behavior: viewport-boundary flip placement, keyboard focus save/restore, and the LIFO (Last-In, First-Out) ESC dismissal stack.
2. **Visual Presentation (CSS)**: Visual layouts, background shadows, and borders are handled in Vanilla CSS. The library ships a premium `@mixin popover` to style popover cards.
3. **Trigger decoupling (HTML)**: Triggers (`data-ln-popover-for="popoverId"`) and popover containers (`id="popoverId"`) are bound purely by ID, allowing the trigger button and the popup card to live anywhere in the document.

---

## 2. Minimal Blueprint

Triggers and popovers are paired by ID. Wrap content in a `div` carrying the `data-ln-popover` attribute.

```html
<!-- Trigger anywhere -->
<button data-ln-popover-for="account-menu">Account</button>

<!-- Popover anywhere — role="dialog", tabindex="-1", and popover="manual" are injected automatically -->
<div data-ln-popover id="account-menu">
    <p><strong>user@example.com</strong></p>
    <nav>
        <a href="/settings">Settings</a>
        <a href="/logout">Sign out</a>
    </nav>
</div>
```

### Key Anatomy Rules
- **The Popover wrapper (`data-ln-popover`)**: Driven by the value `"open"` (open) and `"closed"` or empty (closed).
- **The Trigger (`data-ln-popover-for="id"`)**: Sets `aria-expanded` and manages focus automatically.
- **Visual styling**: Re-apply `@mixin popover` in your SCSS on the popover element.

---

## 3. Declarative API & State Contract

The initialized instance is exposed as `dom.lnPopover`, with `open(trigger)`, `close()`, `toggle(trigger)`, and `destroy()` methods, plus `isOpen` and `trigger` properties. **The HTML attribute remains the primary contract** — the instance methods are thin wrappers that ultimately write the same attribute.

Triggers, LIFO click outside handlers, viewport edge flips, and custom scripts all change state by writing the active attribute on the popover element:

```js
const popover = document.getElementById('account-menu');

// Open the popover
popover.setAttribute('data-ln-popover', 'open');

// Close the popover
popover.setAttribute('data-ln-popover', 'closed');

// Equivalent imperative calls via the instance
popover.lnPopover.open();
popover.lnPopover.close();

// Read-only state query
popover.lnPopover.isOpen; // Returns true/false
```

### Attributes
- `data-ln-popover`: Placed on the popover card. Value `"open"` = open; `"closed"` = closed.
- `data-ln-popover-for="id"`: Placed on triggers referencing the popover ID.
- `data-ln-popover-position="top|bottom|left|right"`: Preferred placement side. Default: `bottom`.
- `data-ln-popover-placement`: Set automatically by JS to indicate the *actual* active side after auto-flip is resolved.

---

## 4. Transition Events

All events bubble. The dispatch target is the popover element itself.

| Event | Cancelable | `detail` | Dispatched When |
|---|---|---|---|
| **`ln-popover:before-open`** | **Yes** | `{ popoverId, target, trigger }` | Before opening. `event.preventDefault()` cancels the transition and reverts the attribute. |
| **`ln-popover:open`** | No | `{ popoverId, target, trigger }` | After popover is positioned, classes added, and focus moved. |
| **`ln-popover:before-close`** | **Yes** | `{ popoverId, target, trigger }` | Before closing. `event.preventDefault()` cancels the close and reverts the attribute. |
| **`ln-popover:close`** | No | `{ popoverId, target, trigger }` | After popover is closed and focus restored back to the trigger. |

```js
// Example: Cancel open transition for unauthorized zones
document.addEventListener('ln-popover:before-open', (e) => {
    if (e.detail.popoverId === 'admin-zone' && !currentUser.isAdmin) {
        e.preventDefault(); // Reverts attribute back to "closed"
    }
});
```

---

## 5. Integration Patterns

### A. Position Preferences & Auto-Flip
Preferred placement is easily configured. If there isn't enough room in the viewport, the positioning engine flips the popover to the opposite side:
```html
<div data-ln-popover data-ln-popover-position="right" id="help-menu">...</div>
```

### B. Nested Popovers (A stays open when B opens)
Opening B from inside A leaves A open. Pressing `ESC` once closes B first, and then A:
```html
<div data-ln-popover id="popover-a">
    <button data-ln-popover-for="popover-b">Open B</button>
</div>
<div data-ln-popover id="popover-b">...</div>
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="components/ln-popover/ln-popover.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [components/ln-popover/src/ln-popover.js](file:///c:/laragon/www/ln-ashlar/components/ln-popover/src/ln-popover.js).

---

## Related
- **[`ln-dropdown`](../ln-dropdown/README.md)** — Menu wrapper adding click-outside/top-layer promotion.
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary disclosure state primitive.

---

## 🔧 Internals

Source: `components/ln-popover/ln-popover.js`.

### Open-stack

A module-level `openStack` array tracks all currently-open instances. It drives two behaviors: a single `document` `keydown` listener, registered only while the stack is non-empty, pops the top entry and calls `.close()` on it (LIFO Escape); and nested popovers stay independent because each owns its own outside-click listener scoped to its own subtree.

### `_applyOpen(trigger)` — after the cancelable `before-open` passes

Set `isOpen = true`, store `trigger` (`null` if opened via direct attribute mutation) and `document.activeElement` (for focus restore) → `teleportToBody(dom)` (moves the element to end of `<body>`, storing a restore function, so `position: fixed` coordinates are reliable regardless of ancestor `transform`/`contain`) → `measureHidden(dom)` for dimensions even if `display: none` → `computePlacement(triggerRect, size, preferred, 8)` writes `top`/`left` inline (unavoidable for floating UI) and `data-ln-popover-placement` → `aria-expanded="true"` on trigger → focus the first focusable child, or the container itself → outside-click listener registered one tick later via `setTimeout` (so the opening click itself doesn't immediately close it) → scroll/resize listeners for repositioning while open → push onto `openStack`, ensure ESC listener → dispatch `ln-popover:open`.

### `_applyClose()` — mirror of `_applyOpen`

Clears `isOpen`, removes the outside-click/scroll/resize listeners, clears inline `top`/`left` and the placement attribute, sets `aria-expanded="false"`, runs the teleport-restore function, splices itself from `openStack` (removing the ESC listener if the stack is now empty), then restores focus to the trigger **only if** the trigger was the previously-focused element (click→Escape, click→programmatic close) or `activeElement === document.body` (Escape from inside the popover, outside-click on inert whitespace) — an outside-click landing on another focusable element keeps that element's focus. Dispatches `ln-popover:close`.

### Focus management

A disclosure pattern, not a modal — no Tab trap. Because the popover is teleported to the end of `<body>`, Tab exits it into whatever follows in body order. `tabindex="-1"` and `role="dialog"` are set automatically at construction so the container itself is a valid focus target when there's no focusable child.

### Nested popovers

Outside-click tests `self.dom.contains(e.target)`, so a click inside A's subtree (including a button that opens B) never triggers A's close path. Both popovers land on `openStack`; LIFO Escape closes B first, then A on the next press. There is no "close all."

### Observer & registration

Single observer on `document.body` (`subtree`/`childList`/`attributes`, filtered to `data-ln-popover`/`data-ln-popover-for`): childList additions re-run `_findPopovers`/`_attachTriggers`; attribute mutations dispatch to `_syncAttribute` for existing instances or re-run discovery for new ones. Two separate `registerComponent` calls wire popover elements (`el.lnPopover`) and trigger elements (`el.lnPopoverTrigger`) independently — trigger init sets `aria-haspopup="dialog"`, `aria-expanded="false"`, `aria-controls`, once, on attach.

`destroy()` on a popover instance closes it if open, removes its listeners, splices it from `openStack`, and dispatches `ln-popover:destroyed`. Trigger `destroy` is independent and only removes the trigger's click handler.
