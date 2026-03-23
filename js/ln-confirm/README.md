# ln-confirm

A confirmation prompt for destructive actions. First click changes the button text to a confirmation message; second click allows the action through. Automatically reverts after 3 seconds if not confirmed.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-confirm="Confirm?"` | button | Enables confirm behavior; value is the confirmation text (default: "Confirm?") |
| `data-confirming` | button (auto) | Added automatically while awaiting confirmation — use for CSS styling |

## Behavior

1. **First click** — `preventDefault` + `stopImmediatePropagation`, button text changes to the confirm message, `data-confirming` attribute is set
2. **Second click** — action proceeds normally (form submit, etc.), button resets
3. **Auto-revert** — if no second click within 3 seconds, the button reverts to its original text

## HTML Structure

```html
<!-- Simple confirm button -->
<button data-ln-confirm="Are you sure?">Delete</button>

<!-- Inside a form -->
<form method="POST" action="/delete">
    <button type="submit" data-ln-confirm="Confirm delete?">Delete</button>
</form>
```

## Events

Events are dispatched on the button element and bubble up.

| Event | When | `detail` |
|-------|------|----------|
| `ln-confirm:waiting` | When entering confirmation state (first click) | `{ target }` |

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
