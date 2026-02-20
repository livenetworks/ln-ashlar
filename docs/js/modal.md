# Modal

Modal dialog component. File: `js/ln-modal/ln-modal.js`.

## HTML

```html
<!-- Trigger -->
<button data-ln-modal="my-modal">Open</button>

<!-- Modal -->
<div class="ln-modal" id="my-modal">
    <div class="ln-modal__content">
        <header>
            <h3>Title</h3>
            <button data-ln-modal-close>&times;</button>
        </header>
        <main>Content</main>
        <footer>
            <button data-ln-modal-close class="btn-secondary">Cancel</button>
            <button>Save</button>
        </footer>
    </div>
</div>
```

## Sizes

```html
<div class="ln-modal__content ln-modal__content--sm">  <!-- 28rem -->
<div class="ln-modal__content ln-modal__content--md">  <!-- 32rem -->
<div class="ln-modal__content ln-modal__content--lg">  <!-- 42rem -->
<div class="ln-modal__content ln-modal__content--xl">  <!-- 48rem -->
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
