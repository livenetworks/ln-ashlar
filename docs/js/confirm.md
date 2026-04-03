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

---

## Internal Architecture

This section explains how the component works internally. A developer or AI reading this should fully understand the data flow, state model, and event pipeline without reading the source.

### State

Each `[data-ln-confirm]` button gets a `_component` instance stored at `element.lnConfirm`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the button element |
| `confirming` | boolean | Whether the button is in confirmation state |
| `originalText` | string | Button's `textContent` at init (restored on reset) |
| `confirmText` | string | Text from `data-ln-confirm` attribute (default: "Confirm?") |
| `revertTimer` | number or null | `setTimeout` handle for auto-revert |
| `isIconButton` | boolean | Set during confirm if button is icon-only (no text) |
| `originalIconHref` | string | Original `<use href>` value on the SVG icon (stored for icon buttons) |
| `_onClick` | Function | Bound click handler |

### Two-Click Flow

The component intercepts the button's click event with a single handler that branches on `this.confirming`:

```
First click (confirming = false):
    1. e.preventDefault() + e.stopImmediatePropagation()
       — blocks form submit, href navigation, and any other click listeners
    2. _enterConfirm():
       a. Set confirming = true
       b. Set data-confirming="true" on the button (visual state for CSS)
       c. Swap button content (text or icon — see below)
       d. Start auto-revert timer
       e. Dispatch ln-confirm:waiting event

Second click (confirming = true):
    1. NO preventDefault — the click passes through to the browser
    2. _reset() — restore original text/icon, clear timer, remove data-confirming
    3. Form submit, link navigation, or other click listeners proceed normally
```

### Icon Button Detection

On first click, `_enterConfirm()` checks if the button contains an `svg.ln-icon use` element. If so, it's treated as an icon button:

1. Store the original `href` from `svg.ln-icon use` (e.g., `#ln-trash`)
2. Swap `href` to `#ln-check`, add `text-success` + `ln-confirm-tooltip`
3. Set `data-tooltip-text` to the confirm text (shown as tooltip since there's no text content)
4. On reset: restore original `href`, remove `text-success` + `ln-confirm-tooltip`

For text buttons, the swap is simpler: `dom.textContent = confirmText` on enter, `dom.textContent = originalText` on reset.

### Timeout Mechanism

`_startTimer()` creates a `setTimeout` that calls `_reset()` after N seconds:

1. Clear any existing timer (`clearTimeout`)
2. Read timeout from `data-ln-confirm-timeout` attribute (default: 3 seconds)
3. Set new timer

The timeout auto-reverts the button to its original state if the user doesn't click again.

### Observable Timeout

The MutationObserver watches `data-ln-confirm-timeout` attribute changes. If the attribute changes while the button is in confirming state, `_syncTimeout()` calls `_startTimer()` — which clears the old timer and starts a new one with the updated value. This allows external code to dynamically extend or shorten the confirmation window.

### Form Integration

The two-click pattern works naturally with form submit buttons:

- First click: `preventDefault()` + `stopImmediatePropagation()` blocks the form's `submit` event entirely
- Second click: no `preventDefault()`, so the browser's default form submission proceeds
- `_reset()` runs synchronously before the submit propagates, so the button is restored to its original state

There is no explicit form `submit` event interception — the pattern works purely through click event handling.

### Event Dispatch

Only one event is dispatched: `ln-confirm:waiting` when entering confirmation state. It is **not cancelable** — the component uses `dispatch()` (not `dispatchCancelable()`). There is no event for the second click or auto-revert.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `_findElements` auto-initializes confirm buttons
- **`attributes`** (`data-ln-confirm`, `data-ln-confirm-timeout`): `data-ln-confirm` → re-init check; `data-ln-confirm-timeout` → `_syncTimeout` restarts timer if confirming
