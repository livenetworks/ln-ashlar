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
            <button type="button" aria-label="Close" data-ln-modal-close><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>
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
| `ln-modal:destroyed` | yes | no | `{ modalId, target }` |

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

---

## Internal Architecture

This section explains how the component works internally. A developer or AI reading this should fully understand the data flow, state model, and event pipeline without reading the source.

### State

Each `[data-ln-modal]` element gets a `_component` instance stored at `element.lnModal`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the modal element |
| `isOpen` | boolean | Current open/closed state |
| `_onEscape` | Function | Bound ESC keydown handler (attached/detached per open/close) |
| `_onFocusTrap` | Function | Bound Tab keydown handler (attached/detached per open/close) |
| `_onClose` | Function | Bound click handler shared by all close buttons |

### Attribute-Driven Flow

Same pattern as ln-toggle — `data-ln-modal` attribute is the single source of truth:

```
API call, trigger click, or close button click
    |
    v
open() / close() / toggle()
    |
    v
setAttribute('data-ln-modal', 'open' | 'close')
    |
    v
MutationObserver fires
    |
    v
_syncAttribute(el):
    1. Read attribute value, compare to instance.isOpen
    2. If no change → return
    3. Dispatch cancelable before-event
    4. If preventDefault() → revert attribute, return
    5. Update instance.isOpen
    6. Apply or remove open/close state (see below)
    7. Dispatch post-event
```

### Open State Application

When opening (after before-event passes):

1. Set `aria-modal="true"` and `role="dialog"` on the modal element
2. Add `ln-modal-open` class to `document.body` (locks scroll)
3. Attach `_onEscape` and `_onFocusTrap` keydown listeners to `document`
4. Focus management (see below)
5. Dispatch `ln-modal:open`

### Focus Management

On open, focus is applied in this priority order:

1. **`[autofocus]` element** — if any element inside the modal has the `autofocus` attribute, it receives focus first
2. **First input** — first non-disabled, non-hidden `input`, `textarea`, or `select`
3. **First focusable** — first `a[href]` or `button:not([disabled])`

The `autofocus` attribute allows the caller to override the default input-first behavior. Primary use case: destructive confirm dialogs, where Cancel should be pre-focused so that pressing Enter dismisses the dialog rather than confirming the destructive action.

```html
<footer>
    <button type="button" data-ln-modal-close autofocus>Cancel</button>
    <button type="submit">Delete</button>
</footer>
```

### Close State Application

When closing (after before-event passes):

1. Remove `aria-modal` attribute
2. Detach `_onEscape` and `_onFocusTrap` keydown listeners from `document`
3. Dispatch `ln-modal:close`
4. Check if any other modal is still open (`querySelector('[data-ln-modal="open"]')`). Only if none → remove `ln-modal-open` from body. This prevents scroll unlock when stacked modals are in use.

### ESC Listener Lifecycle

The ESC handler is **not always-on**. It is attached to `document` on open and detached on close. When all modals are closed, zero keydown listeners are active. This avoids unnecessary event processing on every keypress across the page.

### Focus Trap

The focus trap handler runs on every `Tab` keypress while the modal is open:

1. Query all focusable elements inside the modal: `a[href]`, `button:not([disabled])`, `input:not([disabled]):not([type="hidden"])`, `select:not([disabled])`, `textarea:not([disabled])`, `[tabindex]:not([tabindex="-1"])`
2. If `Shift+Tab` on the first focusable → wrap to last
3. If `Tab` on the last focusable → wrap to first

The query runs on every Tab press (not cached) — this handles dynamically added/removed form fields inside the modal.

### Body Scroll Lock

`document.body.classList.add('ln-modal-open')` is the scroll lock mechanism. CSS handles the actual `overflow: hidden`. The class is added on first modal open and removed only when the **last** open modal closes — checked via `querySelector('[data-ln-modal="open"]')`.

### Trigger Buttons

Buttons with `data-ln-modal-for="id"` work identically to ln-toggle triggers:

- Click handler finds modal by ID, calls `toggle()`
- Guard: `btn[lnModalTrigger] = true` prevents duplicate listeners
- Modifier keys (ctrl/meta) and middle-click pass through

### Close Buttons

Buttons with `data-ln-modal-close` inside the modal call `instance.close()` on click. Wired up by `_attachCloseButtons()` during construction. Guard: `btn[lnModalClose]` stores the handler reference (also used for cleanup in `destroy()`).

### Detail Wrapping

Every event includes `{ modalId: el.id, target: el }` in its `detail`. This is done manually in each `dispatch()` / `dispatchCancelable()` call because ln-core's `dispatch` helper doesn't auto-inject component metadata. This is consistent across all four events (before-open, open, before-close, close) and the destroyed event.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `_findModals` + `_attachTriggers`
- **`attributes`** (`data-ln-modal`, `data-ln-modal-for`): attribute changes → `_syncAttribute` or re-init
