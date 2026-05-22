# ln-popover

> `data-ln-popover` on the popover element is the single source of truth for open/closed state. The JS API (`open()`, `close()`, `toggle()`) is a thin convenience layer over `setAttribute`.

For internal mechanics — focus-restore behavior, observer flow, openStack, viewport-aware positioning — see [`docs/js/popover.md`](../../docs/js/popover.md).

## Integration

### In-Bundle (Standard Integration)
To load `ln-popover` as part of the unified `ln-ashlar` bundle, include the main script:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

### Standalone (Zero-Dependency IIFE)
If you only need the popover component, load the compiled zero-dependency IIFE directly:
```html
<script src="js/ln-popover/ln-popover.js" defer></script>
```

### Source Files & Development
- **Active Development Source**: [js/ln-popover/src/ln-popover.js](file:///c:/laragon/www/ln-ashlar/js/ln-popover/src/ln-popover.js) — The source of truth for component logic.
- **Compiled Standalone**: [js/ln-popover/ln-popover.js](file:///c:/laragon/www/ln-ashlar/js/ln-popover/ln-popover.js) — The compiled, ready-to-use standalone bundle.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-popover` | popover element | Creates instance and drives state. `"open"` = open; `"closed"` (or no value) = closed. |
| `data-ln-popover-for="popoverId"` | trigger button/link | Click toggles the popover with that ID |
| `data-ln-popover-position` | popover element | Preferred placement side: `top`, `bottom` (default), `left`, `right` |
| `data-ln-popover-placement` | popover element | Set by JS — actual winning side after auto-flip |

## API

Popovers are auto-initialized by MutationObserver. Each `[data-ln-popover]` element gets an instance at `element.lnPopover`.

```javascript
const popover = document.getElementById('my-popover');

popover.setAttribute('data-ln-popover', 'open');    // open the popover
popover.setAttribute('data-ln-popover', 'closed');  // close it
popover.lnPopover.isOpen;                           // boolean — read-only
popover.lnPopover.destroy();                        // detach listeners, dispatch :destroyed
```

`open(trigger)`, `close()`, and `toggle(trigger)` exist as thin shortcuts that call `setAttribute` under the hood. They are equivalent to the attribute writes above. Pass the `trigger` element to `open()` / `toggle()` so positioning, `aria-expanded` sync, and the `trigger` field on emitted events are populated; otherwise `trigger` is `null`.

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

- Click outside the popover and its trigger closes it.
- Escape closes the most recently opened popover (LIFO). Each subsequent Escape closes the next one.
- On open, focus moves into the popover; Tab is not trapped — it moves through the page in document order, and the popover stays open.
- Nested popovers stay open: opening B from inside A leaves A open.
- If the preferred side does not fit in the viewport, the popover flips to the opposite side.
- `aria-expanded` on the trigger is synced; `tabindex="-1"`, `role="dialog"`, `aria-haspopup="dialog"`, and `aria-controls` are set automatically on attach.

## HTML Structure

### Basic trigger + popover

```html
<!-- Trigger button -->
<button data-ln-popover-for="user-menu">Account</button>

<!-- Popover — role="dialog" and tabindex="-1" are set automatically -->
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
