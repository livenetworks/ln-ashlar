# ln-modal

Modal dialog component — overlay with content (header/main/footer).
Instance-based: each `.ln-modal` gets its own instance. ESC closes the focused modal. Body scroll is blocked when a modal is open.

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
| `.ln-modal > form` | Content container (always `<form>`) |

## Size Mixins

Sizes are applied via SCSS mixins on semantic selectors, not CSS classes:

```scss
#user-form-modal > form { @include modal-sm; }  // 28rem
#settings-modal > form  { @include modal-md; }  // 32rem
#report-modal > form    { @include modal-lg; }  // 42rem
#preview-modal > form   { @include modal-xl; }  // 48rem
```

## API

Modals are auto-initialized by MutationObserver. Each `.ln-modal` element gets an instance at `element.lnModal`.

```javascript
const modal = document.getElementById('my-modal');
modal.lnModal.open();
modal.lnModal.close();
modal.lnModal.toggle();
modal.lnModal.destroy();  // removes all listeners, cleans up instance
```

## Events

All events are dispatched on the modal element itself and bubble up.

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-modal:before-open` | yes | Before opening (can be cancelled) | `{ modalId, target }` |
| `ln-modal:open` | no | Modal opened | `{ modalId, target }` |
| `ln-modal:before-close` | yes | Before closing (can be cancelled) | `{ modalId, target }` |
| `ln-modal:close` | no | Modal closed | `{ modalId, target }` |
| `ln-modal:destroyed` | no | Instance destroyed | `{ modalId, target }` |

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

- ESC key closes the open modal (listener active only while modal is open)
- `body.ln-modal-open` is added when at least one modal is open (prevents scroll)
- Backdrop: semi-transparent dark overlay with blur
- Animation: slideIn from top (0.3s ease)
- Ctrl/Cmd+Click and middle-click on trigger don't open the modal (allows open in new tab)

## HTML Structure

`<form>` is always the content root — footer buttons are part of the form.
Footer buttons get `@include btn` automatically — no `.btn` class needed.
Non-submit buttons need `type="button"`.

```html
<!-- Trigger button -->
<button data-ln-modal="my-modal">Open</button>

<!-- Modal -->
<div id="my-modal" class="ln-modal">
    <form>
        <header>
            <h3>Title</h3>
            <button type="button" class="ln-icon-close" data-ln-modal-close></button>
        </header>
        <main>
            <label>Name <input type="text" name="name"></label>
        </main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

> **Icons:** The close button uses the `.ln-icon-close` class — NEVER use `&times;` character.
> `@include close-button` is already applied on `button[data-ln-modal-close]` in `ln-modal.scss`.
>
> **Non-submit buttons** inside `<form>` need `type="button"` (close, cancel) to prevent form submission.
