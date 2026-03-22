# Modal

Modal dialog component. File: `js/ln-modal/ln-modal.js`.

## HTML

```html
<!-- Trigger -->
<button data-ln-modal="my-modal">Open</button>

<!-- Basic Modal -->
<div class="ln-modal" id="my-modal">
    <div class="ln-modal__content">
        <header>
            <h3>Title</h3>
            <button class="ln-icon-close" data-ln-modal-close></button>
        </header>
        <main>Content</main>
        <footer>
            <button data-ln-modal-close>Close</button>
        </footer>
    </div>
</div>

<!-- Form Modal — <form> is the content root -->
<div class="ln-modal" id="my-form-modal">
    <form class="ln-modal__content">
        <header>
            <h3>Title</h3>
            <button type="button" class="ln-icon-close" data-ln-modal-close></button>
        </header>
        <main>
            <label>Name <input type="text"></label>
        </main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

## Sizes

Sizes via SCSS mixins (not CSS classes):

```scss
#my-modal .ln-modal__content { @include modal-sm; }  // 28rem
#my-modal .ln-modal__content { @include modal-md; }  // 32rem
#my-modal .ln-modal__content { @include modal-lg; }  // 42rem
#my-modal .ln-modal__content { @include modal-xl; }  // 48rem
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-modal="id"` | trigger | Modal ID to toggle |
| `data-ln-modal-close` | button | Closes parent modal |

## JS API

```js
window.lnModal.open('my-modal');
window.lnModal.close('my-modal');
window.lnModal.toggle('my-modal');
```

## Behavior

- ESC closes all open modals
- Body scroll locked when modal open (`body.ln-modal-open`)
- Backdrop blur + 50% opacity
- Slide-in animation
- MutationObserver watches for dynamically added modals/triggers
