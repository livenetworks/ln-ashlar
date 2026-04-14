# ln-popover

Click-triggered rich-content panel component. Instance-based: each `[data-ln-popover]` gets its own instance. Supports smart viewport-aware positioning, nested popovers, and full keyboard/ARIA wiring.

## Single Source of Truth

The `data-ln-popover` attribute is the single source of truth for open/closed state:
- `data-ln-popover="open"` — popover is open
- `data-ln-popover="closed"` or `data-ln-popover` (no value) — popover is closed

All state changes flow through the attribute. The JS API methods (`open()`, `close()`, `toggle()`) simply set the attribute — the MutationObserver detects the change and applies the actual state (visibility, positioning, aria, focus, events). External code can set the attribute directly with the same result.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-popover` | popover element | Creates instance, starts closed |
| `data-ln-popover="open"` | popover element | Starts open |
| `data-ln-popover-for="popoverId"` | trigger button/link | Click toggles the popover with that ID |
| `data-ln-popover-position` | popover element | Preferred placement side: `top`, `bottom` (default), `left`, `right` |
| `data-ln-popover-placement` | popover element | Set by JS — actual winning side after auto-flip |

## API

Popovers are auto-initialized by MutationObserver. Each `[data-ln-popover]` element gets an instance at `element.lnPopover`.

```javascript
const popover = document.getElementById('my-popover');
popover.lnPopover.open(triggerEl);  // sets data-ln-popover="open" → observer applies state
popover.lnPopover.close();          // sets data-ln-popover="closed" → observer applies state
popover.lnPopover.toggle(triggerEl);// toggles based on current state
popover.lnPopover.destroy();        // removes all listeners, cleans up instance

// Direct attribute change — identical result
popover.setAttribute('data-ln-popover', 'open');
popover.setAttribute('data-ln-popover', 'closed');
```

## Events

All events are dispatched on the popover element itself and bubble up.

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-popover:before-open` | yes | Before opening (can be cancelled) | `{ popoverId, target, trigger }` |
| `ln-popover:open` | no | Popover opened | `{ popoverId, target, trigger }` |
| `ln-popover:before-close` | yes | Before closing (can be cancelled) | `{ popoverId, target, trigger }` |
| `ln-popover:close` | no | Popover closed | `{ popoverId, target, trigger }` |
| `ln-popover:destroyed` | no | Instance destroyed | `{ popoverId, target }` |

`trigger` is the element that opened the popover. It is `null` when opened by direct attribute mutation with no known trigger.

If `before-open`/`before-close` is canceled (`preventDefault()`), the observer reverts the attribute.

```javascript
// Cancel opening conditionally
document.addEventListener('ln-popover:before-open', function(e) {
    if (!userIsAllowed()) {
        e.preventDefault();
    }
});

// React to close
document.getElementById('user-menu').addEventListener('ln-popover:close', function(e) {
    console.log('Popover closed', e.detail.popoverId);
});
```

## Behavior

- Click outside the popover and its trigger closes it. Focus is NOT yanked back to the trigger — the user's new focus target is respected.
- Escape closes the most recently opened popover only (LIFO stack). Each subsequent Escape closes the next one.
- On open: focus moves to the first focusable element inside the popover. If there are no focusable children, the popover container itself receives focus (it has `tabindex="-1"` set automatically).
- Tab key is NOT trapped. Tab moves to the next focusable element in document order; the popover stays open.
- Nested popovers stay open: if popover A is open and a trigger inside A opens popover B, A stays open. The click that opened B originated inside A's DOM subtree, so it is not an "outside click" relative to A.
- Position auto-flip: the preferred side is tried first. If it doesn't fit in the viewport, the opposite side is tried, then the perpendicular pair. The element is always clamped to stay inside the viewport.
- Popover teleports to `<body>` on open so `position: fixed` coordinates are reliable (avoids stacking context issues from ancestor `transform`/`contain`). It is restored to its original DOM position on close.
- `aria-expanded` on the trigger is synced with open/closed state. `aria-haspopup="dialog"` and `aria-controls` are set once on trigger attach.

## HTML Structure

### Basic trigger + popover

```html
<!-- Trigger button -->
<button data-ln-popover-for="user-menu">Account</button>

<!-- Popover -->
<div data-ln-popover id="user-menu">
    <p>user@example.com</p>
    <nav>
        <a href="/settings">Settings</a>
        <a href="/logout">Sign out</a>
    </nav>
</div>
```

### With position preference

```html
<button data-ln-popover-for="help-panel">Help</button>

<div data-ln-popover data-ln-popover-position="right" id="help-panel">
    <p>Contextual help content here.</p>
</div>
```

### Nested popovers (A stays open when B opens)

```html
<!-- Trigger for A -->
<button data-ln-popover-for="popover-a">Open A</button>

<!-- Popover A — contains a trigger for B -->
<div data-ln-popover id="popover-a">
    <p>This is popover A.</p>
    <button data-ln-popover-for="popover-b">Open B inside A</button>
</div>

<!-- Popover B -->
<div data-ln-popover id="popover-b">
    <p>This is popover B. A is still open behind it.</p>
</div>
```
