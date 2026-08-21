# ln-modal

> Focus-gated viewport-blocking dialog overlays, managed reactively via the DOM.

---

## 1. Philosophy & The Modal Mindset

In `ln-ashlar`, the core design principle is **Three-Layer Architecture** and **Component Isolation**. 

`ln-modal` is a **Layer 1 Simple Component**. It manages ONLY the overlay panel state and dialog accessibility. It is completely isolated and unaware of sibling components, form logic, or data-fetching pipelines.

1. **State & Accessibility (JavaScript + native `<dialog>`)**: The `ln-modal` script manages the binary `open` / `close` attribute contract (`data-ln-modal="open|close"`) and suppresses `<body>` scrolling (toggling the `.ln-modal-open` class on `<body>`). Focus placement, native focus trapping, ESC dismissal, and focus restoration are delegated to the native `<dialog>` element via `showModal()`/`close()`.
2. **The Content Root (HTML)**: The modal content root is structured in standard semantic HTML (such as `<dialog class="ln-modal" data-ln-modal>`).
3. **Visual Presentation & Sizing (CSS)**: Overlay backdrops, sticky headers/footers, and scrollable body areas are styled using Vanilla CSS. Sizing variants (`modal-sm|md|lg|xl`) are applied via SCSS mixins on `> form`, keeping markup clean.
4. **Layer Separation (Coordinators)**: `ln-modal` does NOT handle form submissions, auto-closing on AJAX success, validation error inspection, or DOM data population. Those responsibilities belong strictly to **Layer 2 Coordinators** (e.g. `ln-ui-coordinator` or `ln-data-coordinator`).

---

## 2. Minimal Blueprint

Triggers and modals are paired by ID. The overlay has `class="ln-modal"` and `data-ln-modal`.

```html
<!-- Trigger button -->
<button data-ln-modal-for="user-modal">Add User</button>

<!-- Modal overlay -->
<dialog class="ln-modal" data-ln-modal id="user-modal">
    <form>
        <!-- Header -->
        <header>
            <h3>Add User</h3>
            <button type="button" data-ln-modal-close aria-label="Close">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
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
</dialog>
```

### Key Anatomy Rules
- **The Overlay (`data-ln-modal`)**: Driven by the value `"open"` (open) and `"close"` (closed).
- **The Trigger (`data-ln-modal-for="id"`)**: Placed on buttons/links to request toggling modal display.
- **The Dismiss button (`data-ln-modal-close`)**: Placed on cancel or close buttons to request close.
- **Focus Override (`autofocus`)**: Place on any form field to override default focus placement on open.

---

## 3. Declarative API & State Contract

There are no imperative JavaScript mutation methods on the component instance. **The HTML attribute is the sole source of truth.**

Coordinators and external scripts request state changes by dispatching request events or writing the attribute on the modal element:

```js
const modal = document.getElementById('user-modal');

// Request open via event
modal.dispatchEvent(new CustomEvent('ln-modal:request-open', { bubbles: true }));

// Or set attribute directly
modal.setAttribute('data-ln-modal', 'open');

// Request close via event
modal.dispatchEvent(new CustomEvent('ln-modal:request-close', { bubbles: true }));

// Read-only state query
const isOpen = modal.lnModal.isOpen; // Returns true/false
```

### Attributes
- `data-ln-modal`: Placed on the overlay element. Value `"open"` = open; `"close"` = closed.
- `data-ln-modal-for="id"`: Placed on trigger elements referencing the modal ID.
- `data-ln-modal-close`: Placed on any close trigger inside the modal.

---

## 4. Transition & Command Events

All events bubble (`bubbles: true`). The dispatch target is the overlay element. Every event's `detail` carries `{ modalId, target }`.

| Event | Direction | Cancelable | Dispatched / Handled When |
|---|:---:|:---:|---|
| **`ln-modal:request-open`** | Listens | No | Command event sent by coordinators/triggers to open the modal. |
| **`ln-modal:request-close`** | Listens | No | Command event sent by coordinators/triggers to close the modal. |
| **`ln-modal:before-open`** | Emits | **Yes** | Dispatched before opening. Calling `event.preventDefault()` cancels the transition. |
| **`ln-modal:open`** | Emits | No | Dispatched after modal is active, body scroll locked, and initial focus set. |
| **`ln-modal:before-close`** | Emits | **Yes** | Dispatched before closing. Calling `event.preventDefault()` cancels the close transition. |
| **`ln-modal:close`** | Emits | No | Dispatched after modal is closed, scroll locks released, and focus restored. |
| **`ln-modal:destroyed`** | Emits | No | Dispatched when the component instance is destroyed. |

```js
// Example: Block close transition if form has unsaved changes
const modal = document.getElementById('user-modal');
modal.addEventListener('ln-modal:before-close', (e) => {
    if (formIsDirty()) {
        e.preventDefault(); // Cancels transition and reverts attribute to "open"
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

## 6. Hash Addressing & Deep-Linking

Any modal with an `id` is hash-addressable (e.g. `#user-modal` or `#user-modal:42`).
When an `id` modal opens, `ln-modal` emits `ln-modal:open` containing `{ hashNs, param }` in `e.detail`.

Coordinators (such as `ln-ui-coordinator`) intercept hash changes and coordinate data fetching / form populating via `ln-fill`.

---

## 7. Related
- **[`ln-confirm`](../ln-confirm/README.md)** — Two-click inline confirm actions (lightweight alternative for single-element actions).
- **[`ln-form`](../ln-form/README.md)** — Form serialization and submission pipeline.
- **[`ln-validate`](../ln-validate/README.md)** — Declarative field-level constraints and visual errors.

---

## 🔧 Internals

Source: `js/ln-modal/src/ln-modal.js` (~137 lines, native `<dialog>`-backed). Trigger delegation (`data-ln-modal-for`), hash-addressing, and form-fill on open are NOT implemented here — they live in `js/ln-ui-coordinator/src/ln-ui-coordinator.js` (a Layer 2 coordinator per §1.4). This section covers `ln-modal.js` only.

### Single source of truth

`data-ln-modal` is the only state. `_syncAttribute(el)` (wired via `registerComponent`'s `onAttributeChange`) is the sole place open/close side effects happen — there is no imperative `open()`/`close()` method on the instance. Cancellation is attribute-revert: if `ln-modal:before-open`/`before-close` is prevented, the handler writes the attribute back to its prior value, which the same no-op guard (`shouldBeOpen === instance.isOpen`) swallows on the resulting mutation.

### Open / close

Open: cancelable `:before-open` → `instance.isOpen = true` → `body.ln-modal-open` class → `el.showModal()` (native `<dialog>` — top-layer stacking and backdrop are the platform's) → focus priority `[autofocus]` → first non-disabled input/select/textarea → first link/button, each filtered through `isVisible` → `:open`.

Close: cancelable `:before-close` → `instance.isOpen = false` → `:close` → `el.close()` (native — restores focus to the pre-open `document.activeElement` automatically) → if no other `[data-ln-modal="open"]` remains, remove `body.ln-modal-open`.

### ESC handling

Not a custom keydown listener — the native `<dialog>` fires its own `cancel` event on ESC. `_onCancel` calls `preventDefault()` (so the dialog doesn't close ahead of the attribute-driven flow) and writes `data-ln-modal="close"`, routing ESC through the same single attribute path as every other close trigger.

### Trigger/close wiring

The instance listens for `ln-modal:request-open`/`request-close` on the modal element itself (writes the attribute) and a `click` listener on the modal for `[data-ln-modal-close]` descendants. `data-ln-modal-for` trigger buttons are resolved by the coordinator's document-level delegated click listener, which looks up the modal by id and dispatches the request event — this file never sees the trigger element.

### Destroy

Removes the four listeners (`request-open`, `request-close`, `cancel`, `click`), releases the body scroll-lock class if this was the last open modal, dispatches `:destroyed`, deletes the instance.
