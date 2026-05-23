# ln-modal

> Focus-gated viewport-blocking dialog overlays, managed reactively via the DOM.

---

## 1. Philosophy & The Modal Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating a heavy component that bundles form handlers, visual layouts, focus traps, backdrop styling, and dimensions, `ln-modal` splits them cleanly:

1. **State & Accessibility (JavaScript)**: The `ln-modal` script (145 lines) only manages binary `open` / `close` state, suppresses parent `<body>` scrolling, intercepts tab navigation to trap focus inside the modal, closes topmost modals on ESC key, and restores focus back to the trigger on close.
2. **The Content Root (HTML)**: The modal content root is ALWAYS a `<form>`. The form IS the panel — there are no redundant BEM wrappers like `.ln-modal__content`. Cancel and submit buttons live directly inside the form.
3. **Visual Presentation & Sizing (CSS)**: Overlay backdrops, Sticky headers/footers, and scrollable body areas are styled using Vanilla CSS. Sizing variants (`modal-sm|md|lg|xl`) are applied via SCSS mixins on `> form`, keeping markup completely clean.

---

## 2. Minimal Blueprint

Triggers and modals are paired by ID. The overlay has `class="ln-modal"` and `data-ln-modal`. The direct child must always be a `<form>`.

```html
<!-- Trigger button -->
<button data-ln-modal-for="user-modal">Add User</button>

<!-- Modal overlay -->
<div class="ln-modal" data-ln-modal id="user-modal">
    <form>
        <!-- Header -->
        <header>
            <h3>Add User</h3>
            <button type="button" data-ln-modal-close aria-label="Close">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        
        <!-- Scrollable content -->
        <main>
            <label>Name <input type="text" name="name" autofocus></label>
        </main>
        
        <!-- Sticky footer -->
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

### Key Anatomy Rules
- **The Overlay (`data-ln-modal`)**: Driven by the value `"open"` (open) and `"close"` or empty (closed).
- **The Trigger (`data-ln-modal-for="id"`)**: Placed on buttons/links to toggle modal display.
- **The Dismiss button (`data-ln-modal-close`)**: Placed on cancel or close buttons. Always needs `type="button"` inside a form.
- **Focus Override (`autofocus`)**: Place on any form field to override the default behavior of focusing the first input on open.

---

## 3. Declarative API & State Contract

There are no imperative JavaScript methods (like `open()` or `close()`) on the component instance. **The HTML attribute is the sole contract.** 

Triggers, backdrop dismissals, ESC handlers, and custom scripts all change state by writing the active attribute on the modal element:

```js
const modal = document.getElementById('user-modal');

// Open the modal
modal.setAttribute('data-ln-modal', 'open');

// Close the modal
modal.setAttribute('data-ln-modal', 'close');

// Read-only state query
modal.lnModal.isOpen; // Returns true/false
```

### Attributes
- `data-ln-modal`: Placed on the overlay element. Value `"open"` = open; `"close"` = closed.
- `data-ln-modal-for="id"`: Placed on trigger elements referencing the modal ID.
- `data-ln-modal-close`: Placed on any close trigger inside the modal.

---

## 4. Transition Events

All events bubble. The dispatch target is the overlay element. Every event's `detail` carries `{ modalId, target }`.

| Event | Cancelable | Dispatched When |
|---|:---:|---|
| **`ln-modal:before-open`** | **Yes** | Before opening. Calling `event.preventDefault()` cancels the transition and reverts the attribute. |
| **`ln-modal:open`** | No | After modal is active, body scroll locked, and focus trapped. |
| **`ln-modal:before-close`** | **Yes** | Before closing. Calling `event.preventDefault()` cancels the close and reverts the attribute. |
| **`ln-modal:close`** | No | After modal is closed, scroll locks released, and focus restored. |

```js
// Example: Block close transition if form is dirty (unsaved changes)
const modal = document.getElementById('user-modal');
modal.addEventListener('ln-modal:before-close', (e) => {
    if (formIsDirty()) {
        e.preventDefault(); // Reverts attribute back to "open"
    }
});
```

---

## 5. Visual Sizing & SCSS Mixins

Do not use visual layout utility classes in your markup. Apply structural sizing variants inside your SCSS to the modal form element:

| Mixin | `max-width` | Ideal For |
|---|---|---|
| `@include modal-sm;` | `28rem` | Simple confirms, single-field inputs |
| `@include modal-md;` | `32rem` | Standard 2-4 field forms (Default) |
| `@include modal-lg;` | `42rem` | Wide multi-column forms, data lists |
| `@include modal-xl;` | `48rem` | Detail previews, large forms |

```scss
// Apply in project SCSS
.ln-modal {
    @include modal-overlay;

    > form {
        @include modal-panel;
        @include modal-md; // default
    }
    
    &#user-modal > form {
        @include modal-lg; // Override specific modal width
    }
}
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="js/ln-modal/ln-modal.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-modal/src/ln-modal.js](file:///c:/laragon/www/ln-ashlar/js/ln-modal/src/ln-modal.js).

---

## Related
- **[`ln-confirm`](../ln-confirm/README.md)** — Two-click inline confirm actions (lightweight alternative to modals).
- **[`ln-form`](../ln-form/README.md)** — Form serialization and success/error cascades.
- **[`ln-validate`](../ln-validate/README.md)** — Declarative field-level constraints and visual errors.
- **Architecture deep-dive** — [`docs/js/modal.md`](../../docs/js/modal.md).
