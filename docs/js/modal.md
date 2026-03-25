# Modal

Modal dialog component. File: `js/ln-modal/ln-modal.js`.

## HTML

`<form>` is always the content root. Footer buttons get `@include btn` automatically. Non-submit buttons need `type="button"`.

```html
<!-- Trigger -->
<button data-ln-modal="my-modal">Open</button>

<!-- Modal -->
<div class="ln-modal" id="my-modal">
    <form>
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
#my-modal > form { @include modal-sm; }  // 28rem
#my-modal > form { @include modal-md; }  // 32rem
#my-modal > form { @include modal-lg; }  // 42rem
#my-modal > form { @include modal-xl; }  // 48rem
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-modal="id"` | trigger | Modal ID to toggle |
| `data-ln-modal-close` | button | Closes parent modal |

## JS API

Instance-based — each `.ln-modal` gets an instance at `element.lnModal`.

```js
const modal = document.getElementById('my-modal');
modal.lnModal.open();
modal.lnModal.close();
modal.lnModal.toggle();
modal.lnModal.destroy();  // removes all listeners, cleans up
```

## Behavior

- ESC closes the open modal (listener active only while open)
- Body scroll locked when modal open (`body.ln-modal-open`)
- Backdrop blur + 50% opacity
- Slide-in animation
- MutationObserver watches for dynamically added modals/triggers
