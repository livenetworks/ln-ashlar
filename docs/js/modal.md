# Modal

Modal dialog component. File: `js/ln-modal/ln-modal.js`.

## Single Source of Truth

The `data-ln-modal` attribute is the single source of truth. All state changes flow through it — the JS API, trigger buttons, and external code all set the attribute, and the MutationObserver reacts by applying visibility, aria, ESC listener, and dispatching events.

## HTML

`<form>` is always the content root. Footer buttons get `@include btn` automatically. Non-submit buttons need `type="button"`.

```html
<!-- Trigger -->
<button data-ln-modal-for="my-modal">Open</button>

<!-- Modal -->
<div class="ln-modal" data-ln-modal id="my-modal">
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
| `data-ln-modal` | modal element | Creates instance, starts closed |
| `data-ln-modal="open"` | modal element | Starts open |
| `data-ln-modal-for="id"` | trigger | Modal ID to toggle |
| `data-ln-modal-close` | button | Closes parent modal |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-modal:before-open` | yes | **yes** | `{ modalId, target }` |
| `ln-modal:open` | yes | no | `{ modalId, target }` |
| `ln-modal:before-close` | yes | **yes** | `{ modalId, target }` |
| `ln-modal:close` | yes | no | `{ modalId, target }` |

If `before-open`/`before-close` is canceled (`preventDefault()`), the observer reverts the attribute.

## JS API

Instance-based — each `[data-ln-modal]` gets an instance at `element.lnModal`.

```js
const modal = document.getElementById('my-modal');
modal.lnModal.open();       // sets attribute → observer applies state
modal.lnModal.close();      // sets attribute → observer applies state
modal.lnModal.toggle();     // toggles based on current state
modal.lnModal.destroy();    // removes all listeners, cleans up

// Direct attribute change — identical result
modal.setAttribute('data-ln-modal', 'open');
modal.setAttribute('data-ln-modal', 'close');
```

## Behavior

- ESC closes the open modal (listener active only while open)
- Body scroll locked when modal open (`body.ln-modal-open`)
- Backdrop blur + 50% opacity
- Slide-in animation
- MutationObserver watches for dynamically added modals/triggers
