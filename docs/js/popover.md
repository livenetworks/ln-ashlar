# Popover

> Implementation notes for `ln-popover`. The user-facing contract lives in [`js/ln-popover/README.md`](../../js/ln-popover/README.md); this document explains how the attribute observer, focus management, openStack, and viewport-aware positioning work internally.

File: `js/ln-popover/ln-popover.js`

## Internal Lifecycle

### Open-stack

A module-level `openStack` array tracks all currently-open popover instances. It drives two behaviors:

1. **Escape handling**: a single `keydown` listener is registered on `document` whenever the stack is non-empty. It pops the top of the stack and calls `.close()` on it. The listener is removed automatically when the stack empties (`_maybeRemoveEscListener`).
2. **Nested popovers**: each popover independently manages its own outside-click listener. A click inside popover A is never treated as "outside" by A, so A stays open when the user interacts with content inside it (including opening B).

### `_applyOpen(trigger)`

Called by `_syncAttribute` after the cancelable `before-open` event passes. Steps:

1. Set `isOpen = true`, store the active `trigger` (`null` when opened via direct attribute mutation with no known trigger element).
2. Store `document.activeElement` in `_previousFocus` for focus restoration.
3. Call `teleportToBody(dom)` — moves the element to `<body>` end; returns a restore function stored in `_teleportRestore`. This ensures `position: fixed` coordinates are reliable regardless of any ancestor `transform` or `contain` property.
4. Call `measureHidden(dom)` to get dimensions even if the element was `display: none`.
5. Call `computePlacement(triggerRect, size, preferred, 8)` — returns `{ top, left, placement }`. Writes `top` and `left` as inline styles (inline coordinates are unavoidable for floating UI; `position: fixed` is supplied by the component stylesheet). Sets `data-ln-popover-placement` attribute.
6. Set `aria-expanded="true"` on trigger.
7. Focus the first focusable element inside the popover, or the popover container itself.
8. Register the outside-click listener (delayed by one tick via `setTimeout` so the opening click doesn't immediately trigger close).
9. Register scroll and resize listeners for repositioning while open.
10. Push `this` onto `openStack`; ensure ESC listener is active.
11. Dispatch `ln-popover:open`.

### `_applyClose()`

Reverse of `_applyOpen`:

1. Set `isOpen = false`.
2. Remove outside-click, scroll, and resize listeners.
3. Clear inline `top`/`left` and remove `data-ln-popover-placement`.
4. Set `aria-expanded="false"` on trigger.
5. Call the `_teleportRestore` function to move the element back to its original DOM position.
6. Splice `this` from `openStack`; call `_maybeRemoveEscListener`.
7. Restore focus to the trigger when either (a) the trigger was the focused element before opening (matches click-then-Escape, click-then-programmatic-close), or (b) `activeElement === document.body` (matches Escape from inside the popover, and outside-clicks landing on inert page whitespace). On outside-click landing on another focusable element, that element keeps focus.
8. Dispatch `ln-popover:close`.

### Observer

Observes `document.body` with `subtree: true`, `childList: true`, `attributes: true`, and `attributeFilter: ['data-ln-popover', 'data-ln-popover-for']`. On childList additions, calls `_findPopovers` and `_attachTriggers`. On attribute mutations, dispatches to `_syncAttribute` (if the element already has an instance) or re-runs `_findPopovers`/`_attachTriggers` (new elements).

## Focus Management

Popover is a "Disclosure" pattern, not a modal dialog. Rules:

- **No Tab trap.** Tab cycles through the page in document order. Because the popover is teleported to `<body>` end, Tab will exit the popover into whatever comes after in body — acceptable.
- **On open:** focus moves to the first focusable child (input, button, link, etc.) or to the popover container itself (`tabindex="-1"` and `role="dialog"` are set automatically on construction).
- **On close:** see `_applyClose` step 7 above for the two-branch focus-restore logic.

## Nested Popovers

- Outside-click listener tests `self.dom.contains(e.target)` — clicks inside A's DOM subtree do not trigger A's close path, so opening B from a button inside A leaves A open.
- Both popovers appear on `openStack`; LIFO Escape closes B first (top of stack), then A on the next Escape.
- There is no "close all" — each popover is independently dismissible.

## Registration & teardown

Two `registerComponent` calls initialize the component:

- **Popover elements** (`[data-ln-popover]`) — instance stored at `el.lnPopover`. The observer attribute filter includes `data-ln-popover`; adding the attribute to an existing element initializes it on the next observer tick.
- **Trigger elements** (`[data-ln-popover-for]`) — instance stored at `el.lnPopoverTrigger`. Adding `data-ln-popover-for` to an existing element wires a click handler on the next observer tick.

Trigger init sets `aria-haspopup="dialog"`, `aria-expanded="false"`, and `aria-controls="<popoverId>"` once on attach. `aria-expanded` is updated to `"true"` / `"false"` on each open/close cycle.

`destroy()` on the popover instance: closes the popover if open, removes outside-click / scroll / resize listeners, splices itself from `openStack`, and dispatches `ln-popover:destroyed`. Trigger destroy is registered independently — it removes only the click handler on the trigger element.
