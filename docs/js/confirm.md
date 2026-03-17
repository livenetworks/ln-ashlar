# Confirm

Confirmation prompt for destructive actions. File: `js/ln-confirm/ln-confirm.js`.

## HTML

```html
<button data-ln-confirm="Are you sure?">Delete</button>

<!-- Inside a form -->
<form method="POST" action="/delete">
    <button type="submit" data-ln-confirm="Confirm delete?">Delete</button>
</form>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-confirm="text"` | button | Confirmation text shown on first click (default: "Confirm?") |
| `data-confirming` | button (auto) | Set automatically while awaiting confirmation |

## Behavior

- First click: prevents action, shows confirmation text, sets `data-confirming`
- Second click: allows action through, resets button
- Auto-reverts after 3 seconds if not confirmed
- MutationObserver auto-initializes dynamically added elements

## Events

| Event | When | `detail` |
|-------|------|----------|
| `ln-confirm:waiting` | Entering confirmation state | `{ target }` |

## Dynamic Update

```js
// Manual initialization
window.lnConfirm(document.body);

// Destroy instance
const btn = document.querySelector('[data-ln-confirm]');
btn.lnConfirm.destroy();
```
