# ln-modal

Modal dialog component — overlay with content (header/main/footer).
Instance-based: each `[data-ln-modal]` gets its own instance. ESC closes the focused modal. Body scroll is blocked when a modal is open.

## Single Source of Truth

The `data-ln-modal` attribute is the single source of truth for open/closed state:
- `data-ln-modal="open"` — modal is open
- `data-ln-modal` or `data-ln-modal="close"` — modal is closed

All state changes flow through the attribute. The JS API methods (`open()`, `close()`, `toggle()`) simply set the attribute — the MutationObserver detects the change and applies the actual state (visibility, aria, ESC listener, events). External code can set the attribute directly with the same result.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-modal` | modal element | Creates instance, starts closed |
| `data-ln-modal="open"` | modal element | Starts open |
| `data-ln-modal-for="modalId"` | trigger button/link | Click toggles the modal with that ID |
| `data-ln-modal-close` | button inside modal | Closes the parent modal |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.ln-modal` | Overlay container (styling) |
| `[data-ln-modal="open"]` | Open modal (set by JS) |
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

Modals are auto-initialized by MutationObserver. Each `[data-ln-modal]` element gets an instance at `element.lnModal`.

```javascript
const modal = document.getElementById('my-modal');
modal.lnModal.open();       // sets data-ln-modal="open" → observer applies state
modal.lnModal.close();      // sets data-ln-modal="close" → observer applies state
modal.lnModal.toggle();     // toggles based on current state
modal.lnModal.destroy();    // removes all listeners, cleans up instance

// Direct attribute change — identical result
modal.setAttribute('data-ln-modal', 'open');
modal.setAttribute('data-ln-modal', 'close');
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

If `before-open`/`before-close` is canceled (`preventDefault()`), the observer reverts the attribute.

```javascript
// Cancel opening conditionally
document.addEventListener('ln-modal:before-open', function(e) {
    if (e.detail.modalId === 'confirm-dialog' && !formIsValid()) {
        e.preventDefault(); // observer reverts attribute back to "close"
    }
});

// Prevent closing (unsaved changes)
document.getElementById('edit-modal').addEventListener('ln-modal:before-close', function(e) {
    if (hasUnsavedChanges()) {
        e.preventDefault();
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

Any element with `autofocus` inside the modal will receive focus when the modal opens. If no `autofocus` is present, the first non-disabled input/textarea/select is focused, then the first focusable button or link.

Use case: destructive confirm dialogs — place `autofocus` on the Cancel button so pressing Enter dismisses rather than confirms.

```html
<!-- Trigger button -->
<button data-ln-modal-for="my-modal">Open</button>

<!-- Modal -->
<div class="ln-modal" data-ln-modal id="my-modal">
    <form>
        <header>
            <h3>Title</h3>
            <button type="button" data-ln-modal-close aria-label="Close">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
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

<!-- Destructive confirm — Cancel pre-focused via autofocus -->
<div class="ln-modal" data-ln-modal id="confirm-delete">
    <form>
        <header>
            <h3>Delete record</h3>
            <button type="button" data-ln-modal-close aria-label="Close">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        <main>
            <p>This action cannot be undone.</p>
        </main>
        <footer>
            <button type="button" data-ln-modal-close autofocus>Cancel</button>
            <button type="submit">Delete</button>
        </footer>
    </form>
</div>
```

> **Icons:** The close button uses `<svg class="ln-icon"><use href="#ln-x">` — NEVER use `&times;` character.
> `@include close-button` is already applied on `button[data-ln-modal-close]` in `ln-modal.scss`.
>
> **Non-submit buttons** inside `<form>` need `type="button"` (close, cancel) to prevent form submission.
