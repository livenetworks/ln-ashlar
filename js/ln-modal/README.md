# ln-modal

Modal dialog component — overlay with content (header/main/footer).
Opens/closes a modal by ID. ESC closes all open modals. Body scroll is blocked when a modal is open.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-modal="modalId"` | trigger button/link | Click toggles the modal with that ID |
| `data-ln-modal-close` | button inside modal | Closes the parent modal |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.ln-modal` | Overlay container (must have `id`) |
| `.ln-modal--open` | Open modal (added by JS) |
| `.ln-modal__content` | Inner content container |
| `.ln-modal__content--sm` | Small modal (max-width: 28rem) |
| `.ln-modal__content--md` | Medium modal (max-width: 32rem) |
| `.ln-modal__content--lg` | Large modal (max-width: 42rem) |
| `.ln-modal__content--xl` | Extra large modal (max-width: 48rem) |

## API

```javascript
window.lnModal.open('my-modal');
window.lnModal.close('my-modal');
window.lnModal.toggle('my-modal');
```

## Events

All events are dispatched on the modal element itself and bubble up.

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-modal:before-open` | yes | Before opening (can be cancelled) | `{ modalId, target }` |
| `ln-modal:open` | no | Modal opened | `{ modalId, target }` |
| `ln-modal:before-close` | yes | Before closing (can be cancelled) | `{ modalId, target }` |
| `ln-modal:close` | no | Modal closed | `{ modalId, target }` |

```javascript
// Cancel opening conditionally
document.addEventListener('ln-modal:before-open', function(e) {
    if (e.detail.modalId === 'confirm-dialog' && !formIsValid()) {
        e.preventDefault(); // modal won't open
    }
});

// Prevent closing (unsaved changes)
document.getElementById('edit-modal').addEventListener('ln-modal:before-close', function(e) {
    if (hasUnsavedChanges()) {
        e.preventDefault();
        showConfirmation();
    }
});

document.addEventListener('ln-modal:open', function(e) {
    console.log('Modal opened:', e.detail.modalId);
});

document.addEventListener('ln-modal:close', function(e) {
    if (e.detail.modalId === 'confirm-dialog') {
        // reset form, clear state, etc.
    }
});
```

## Behavior

- ESC key closes all open modals
- `body.ln-modal-open` is added when at least one modal is open (prevents scroll)
- Backdrop: semi-transparent dark overlay with blur
- Animation: slideIn from top (0.3s ease)
- Ctrl/Cmd+Click and middle-click on trigger don't open the modal (allows open in new tab)

## HTML Structure

```html
<!-- Trigger button -->
<button data-ln-modal="my-modal">Open</button>

<!-- Modal -->
<div id="my-modal" class="ln-modal">
    <div class="ln-modal__content">
        <header>
            <h3>Title</h3>
            <button class="ln-icon-close" data-ln-modal-close></button>
        </header>
        <main>
            <p>Modal content...</p>
        </main>
        <footer>
            <button data-ln-modal-close>Cancel</button>
            <button class="btn-primary">Save</button>
        </footer>
    </div>
</div>
```

> **Icons:** The close button uses the `.ln-icon-close` class — NEVER use `&times;` character.
> `@include close-button` is already applied on `button[data-ln-modal-close]` in `ln-modal.scss`.

## Sizes

```html
<div class="ln-modal__content ln-modal__content--sm">...</div>
<div class="ln-modal__content ln-modal__content--lg">...</div>
```
