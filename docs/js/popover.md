# Popover

Click-triggered rich-content panel. File: `js/ln-popover/ln-popover.js`.

## Single Source of Truth

The `data-ln-popover` attribute drives all state. Setting `data-ln-popover="open"` opens the popover; setting it to `"closed"` (or any non-`"open"` value) closes it. The MutationObserver fires on every change and delegates to `_syncAttribute`, which applies the actual DOM work. JS API methods (`open`, `close`, `toggle`) simply set the attribute — they never apply state directly.

## HTML

```html
<button data-ln-popover-for="my-popover">Open</button>

<div data-ln-popover id="my-popover">
    <p>Popover content.</p>
</div>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-popover` | popover element | Creates instance |
| `data-ln-popover="open"` | popover element | Open state |
| `data-ln-popover="closed"` | popover element | Closed state |
| `data-ln-popover-for="id"` | trigger | Click to toggle the popover |
| `data-ln-popover-position` | popover element | Preferred side: top, bottom (default), left, right |
| `data-ln-popover-placement` | popover element | Actual side after auto-flip (set by JS) |

## Events

| Event | Cancelable | `detail` |
|-------|-----------|----------|
| `ln-popover:before-open` | yes | `{ popoverId, target, trigger }` |
| `ln-popover:open` | no | `{ popoverId, target, trigger }` |
| `ln-popover:before-close` | yes | `{ popoverId, target, trigger }` |
| `ln-popover:close` | no | `{ popoverId, target, trigger }` |
| `ln-popover:destroyed` | no | `{ popoverId, target }` |

`trigger` is `null` when opened via direct attribute mutation with no known trigger element.

## Internal Lifecycle

### Open-stack

A module-level `openStack` array tracks all currently-open popover instances. It drives two behaviors:

1. **Escape handling**: a single `keydown` listener is registered on `document` whenever the stack is non-empty. It pops the top of the stack and calls `.close()` on it. The listener is removed automatically when the stack empties (`_maybeRemoveEscListener`).
2. **Nested popovers**: each popover independently manages its own outside-click listener. A click inside popover A is never treated as "outside" by A, so A stays open when the user interacts with content inside it (including opening B).

### `_applyOpen(trigger)`

Called by `_syncAttribute` after the cancelable `before-open` event passes. Steps:

1. Set `isOpen = true`, store the active `trigger`.
2. Store `document.activeElement` in `_previousFocus` for focus restoration.
3. Call `teleportToBody(dom)` — moves the element to `<body>` end; returns a restore function stored in `_teleportRestore`. This ensures `position: fixed` coordinates are reliable regardless of any ancestor `transform` or `contain` property.
4. Call `measureHidden(dom)` to get dimensions even if the element was `display: none`.
5. Call `computePlacement(triggerRect, size, preferred, 8)` — returns `{ top, left, placement }`. Writes `top` and `left` as inline styles (unavoidable for floating coordinates; CSS supplies `position: fixed` via the co-located SCSS). Sets `data-ln-popover-placement` attribute.
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
7. Restore focus to trigger (only when closed via Escape or programmatically — not on outside-click).
8. Dispatch `ln-popover:close`.

### Observer

Observes `document.body` with `subtree: true`, `childList: true`, `attributes: true`, and `attributeFilter: ['data-ln-popover', 'data-ln-popover-for']`. On childList additions, calls `_findPopovers` and `_attachTriggers`. On attribute mutations, dispatches to `_syncAttribute` (if the element already has an instance) or re-runs `_findPopovers`/`_attachTriggers` (new elements).

## Focus Management

Popover is a "Disclosure" pattern, not a modal dialog. Rules (per D2 decision):

- **No Tab trap.** Tab cycles through the page in document order. Because the popover is teleported to `<body>` end, Tab will exit the popover into whatever comes after in body — acceptable.
- **On open:** focus moves to the first focusable child (input, button, link, etc.) or to the popover container itself (`tabindex="-1"` set automatically).
- **On close via Escape:** focus is returned to the trigger. On outside-click, focus is NOT returned (the click already established a new focus target and yanking it would be disruptive).

## Nested Popovers

When popover A is open and the user clicks a trigger inside A that opens popover B:

- A stays open. The click originated inside A's DOM subtree, so A's outside-click listener ignores it (`self.dom.contains(e.target)` is true).
- B opens independently with its own outside-click listener.
- Both A and B appear in `openStack`. Escape closes B first (top of stack), then A on the next Escape.
- There is no "close all" behavior — each popover is independently dismissible.
