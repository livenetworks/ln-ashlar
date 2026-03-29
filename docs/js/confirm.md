# Confirm

Confirmation prompt for destructive actions. File: `js/ln-confirm/ln-confirm.js`.

## HTML

```html
<button data-ln-confirm="Are you sure?">Delete</button>

<!-- Custom timeout (seconds) -->
<button data-ln-confirm="Confirm?" data-ln-confirm-timeout="5">Delete</button>

<!-- Inside a form -->
<form method="POST" action="/delete">
    <button type="submit" data-ln-confirm="Confirm delete?">Delete</button>
</form>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-confirm="text"` | button | Confirmation text shown on first click (default: "Confirm?") |
| `data-ln-confirm-timeout="3"` | button | Timeout in seconds before auto-revert (default: 3). Observable. |
| `data-confirming` | button (auto) | Set automatically while awaiting confirmation |

## Behavior

- First click: prevents action, shows confirmation text, sets `data-confirming`
- Second click: allows action through, resets button
- Auto-reverts after timeout (default 3 seconds, configurable via `data-ln-confirm-timeout`)
- Changing `data-ln-confirm-timeout` while confirming restarts the timer
- MutationObserver auto-initializes dynamically added elements

## Events

| Event | When | `detail` |
|-------|------|----------|
| `ln-confirm:waiting` | Entering confirmation state | `{ target }` |

## API

```js
// Manual initialization
window.lnConfirm(document.body);

// Destroy instance
const btn = document.querySelector('[data-ln-confirm]');
btn.lnConfirm.destroy();
```
