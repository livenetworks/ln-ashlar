# ln-confirm

A confirmation prompt for destructive actions. First click changes the button text to a confirmation message; second click allows the action through. Automatically reverts after a configurable timeout (default 3 seconds).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-confirm="Confirm?"` | button | Enables confirm behavior; value is the confirmation text (default: "Confirm?") |
| `data-ln-confirm-timeout="5"` | button | Timeout in seconds before auto-revert (default: 3). Observable — changing it while confirming restarts the timer. |
| `data-confirming` | button (auto) | Added automatically while awaiting confirmation — use for CSS styling |

## Behavior

1. **First click** — `preventDefault` + `stopImmediatePropagation`, button changes to confirm state, `data-confirming` attribute is set
2. **Second click** — action proceeds normally (form submit, etc.), button resets
3. **Auto-revert** — if no second click within the timeout, the button reverts to its original state

**Text buttons** — text content is swapped to the confirm message.

**Icon-only buttons** — if the button contains only `<svg class="ln-icon">` with no text, the icon `href` swaps to `#ln-check` and a tooltip shows the confirm text via `data-tooltip-text` (requires `.ln-confirm-tooltip` CSS).

## Timeout

Default timeout is 3 seconds. Override per-button via attribute:

```html
<!-- Reverts after 5 seconds -->
<button data-ln-confirm="Are you sure?" data-ln-confirm-timeout="5">Delete</button>

<!-- Reverts after 1.5 seconds -->
<button data-ln-confirm="Confirm?" data-ln-confirm-timeout="1.5">Remove</button>
```

The `data-ln-confirm-timeout` attribute is observed — changing it dynamically while the button is in confirming state restarts the timer with the new value.

## HTML Structure

```html
<!-- Simple confirm button -->
<button data-ln-confirm="Are you sure?">Delete</button>

<!-- Custom timeout -->
<button data-ln-confirm="Confirm delete?" data-ln-confirm-timeout="5">Delete</button>

<!-- Inside a form -->
<form method="POST" action="/delete">
    <button type="submit" data-ln-confirm="Confirm delete?">Delete</button>
</form>
```

## Events

Events are dispatched on the button element and bubble up.

| Event | Bubbles | Cancelable | When | `detail` |
|-------|---------|------------|------|----------|
| `ln-confirm:waiting` | yes | no | Entering confirmation state (first click) | `{ target }` |

```javascript
document.addEventListener('ln-confirm:waiting', function(e) {
    console.log('Awaiting confirmation:', e.detail.target);
});
```

## CSS Styling

Style the confirming state using the `data-confirming` attribute:

```css
[data-confirming] {
    background-color: var(--color-error);
    color: white;
}
```

## API

```javascript
// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnConfirm(document.body);

// Access instance
const btn = document.querySelector('[data-ln-confirm]');
btn.lnConfirm.destroy(); // Remove confirm behavior
```
