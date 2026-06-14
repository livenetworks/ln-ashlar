# ln-modal

> Focus-gated viewport-blocking dialog overlays, managed reactively via the DOM.

---

## 1. Philosophy & The Modal Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating a heavy component that bundles form handlers, visual layouts, focus traps, backdrop styling, and dimensions, `ln-modal` splits them cleanly:

1. **State & Accessibility (JavaScript)**: The `ln-modal` script only manages binary `open` / `close` state, suppresses `<body>` scrolling (the `ln-modal-open` class on `<body>` — style or detect the lock via that class), intercepts tab navigation to trap focus inside the modal, closes open modals on ESC key, and restores focus on close to the element that was focused before opening (usually the trigger).
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
- **Focus Override (`autofocus`)**: Place on any form field to override the default behavior of focusing the first input (or, when the modal has no inputs, the first link or enabled button) on open.

---

## 3. Declarative API & State Contract

There are no imperative JavaScript methods (like `open()` or `close()`) on the component instance. **The HTML attribute is the sole contract.** 

Triggers, close buttons, ESC handlers, and custom scripts all change state by writing the active attribute on the modal element:

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
| **`ln-modal:destroyed`** | No | After `destroy()` teardown — instance removed from the element. |

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

## 7. New / Edit Mode Toggle

An opt-in convention for modals that serve both create and edit flows without duplicating markup. Modals without these attributes are unaffected.

### How it works

`data-ln-modal-mode="new|edit"` is an app/coordinator-written state attribute on the modal element. The co-located `js/ln-modal/ln-modal.scss` primitive toggles descendants:

```css
[data-ln-modal-when]               { display: none; }
[data-ln-modal-mode="new"]  [data-ln-modal-when="new"]  { display: inline; }
[data-ln-modal-mode="edit"] [data-ln-modal-when="edit"] { display: inline; }
```

Set `data-ln-modal-mode="new"` as the HTML default so the correct title renders on first paint without JS.

### Markup

```html
<div class="ln-modal" data-ln-modal data-ln-modal-mode="new" id="package-modal" aria-labelledby="package-modal-title">
	<form>
		<header>
			<h3 id="package-modal-title" data-ln-fillable>
				<span data-ln-modal-when="new">New package</span>
				<span data-ln-modal-when="edit">Edit package — <span data-ln-field="name"></span></span>
			</h3>
		</header>
	</form>
</div>
```

`data-ln-field="name"` inside the edit span is filled by `lnCore.fill(h3, record)` — NOT `{{ name }}`, which is inert in live DOM (only `fillTemplate()` at clone time processes `{{ }}`). See [`docs/architecture/data-flow.md §5`](../../docs/architecture/data-flow.md).

### Coordinator pattern

```js
let pendingRecord = null; // consume-once var scoped to this entity view

modalEl.addEventListener('ln-modal:before-open', () => {
	const record = pendingRecord;
	pendingRecord = null; // consume immediately

	// lnFill fans out: null → form resets + fillables clear; record → fill all.
	window.lnCore.lnFill(modalEl, record);
	modalEl.dataset.lnModalMode = record ? 'edit' : 'new';
});
```

`lnFill` with `null` is the reset — `ln-form`'s handler calls `this.reset()` when
`detail` is `null`, preventing field-leak from prior records. With a record it calls
`this.fill(record)`; `[data-ln-fillable]` elements fill via the delegated document
listener. Mode is DOM state on `dataset.lnModalMode`; the record is data-in-flight
with consume-once semantics. No `editMode` boolean — the record's presence is the mode.

---

## 8. Declarative trigger namespace (`data-ln-modal-*`)

When a trigger carries `data-ln-modal-for`, `ln-modal`'s click listener also
reads `data-ln-modal-<key>` attributes and fills the modal's `[data-ln-field]`
display elements. This is the **modal display namespace** — separate from the
`data-ln-fill-*` form-fill namespace.

### How it works

The trigger click handler (source: `js/ln-modal/src/ln-modal.js` L146–203):

1. Builds a display record from all `data-ln-modal-<key>` attributes on the
   trigger's `dataset`, stripping the reserved suffixes `for`, `close`, `mode`.
   Kebab-case is camelCased by the dataset API: `data-ln-modal-user-name` →
   key `userName`.
2. If the record is non-empty: calls `window.lnCore.fill(target, record)` —
   fills `[data-ln-field]` elements inside the modal.
3. If no payload: clears all `[data-ln-field]` elements (`textContent = ''`).
4. Sets `data-ln-modal-mode`:
   - Explicit `data-ln-modal-mode` on the trigger → wins.
   - Otherwise: `"edit"` if record is non-empty, `"new"` if empty.

### Markup example

```html
<!-- Trigger — display namespace fills modal header; fill namespace fills form -->
<button
    data-ln-modal-for="event-modal"
    data-ln-modal-title="Annual Conference"
    data-ln-fill-form="event-form"
    data-ln-fill-event-id="42"
    data-ln-fill-title="Annual Conference"
>Edit</button>

<!-- Modal -->
<div class="ln-modal" data-ln-modal data-ln-modal-mode="new"
     id="event-modal" aria-labelledby="event-modal-title">
    <form id="event-form" data-ln-form>
        <header>
            <h3 id="event-modal-title" data-ln-fillable>
                <span data-ln-modal-when="new">New event</span>
                <span data-ln-modal-when="edit">Edit — <span data-ln-field="title"></span></span>
            </h3>
        </header>
        <!-- … fields … -->
    </form>
</div>
```

### Two namespaces, two targets

| Namespace | Attribute prefix | Filled by | Target |
|---|---|---|---|
| Modal display | `data-ln-modal-*` | `window.lnCore.fill(modal, record)` | `[data-ln-field]` inside the modal |
| Form fill | `data-ln-fill-*` | `window.lnCore.lnFill(form, record)` | `[data-ln-form]` (fills fields) + `[data-ln-fillable]` |

Both can appear on the same trigger — they fire independently from their
respective document click listeners. A plain trigger with no `data-ln-modal-*`
payload clears modal `[data-ln-field]` elements and sets mode `"new"`.

### In ln-table row templates

Because `fillTemplate()` now stamps `{{ key }}` in attribute values at clone
time, both namespaces work in row templates:

```html
<template data-ln-template="events-row">
    <tr data-ln-table-row>
        <td>{{ title }}</td>
        <td>
            <ul>
                <li>
                    <button
                        data-ln-modal-for="event-modal"
                        data-ln-modal-title="{{ title }}"
                        data-ln-fill-form="event-form"
                        data-ln-fill-event-id="{{ id }}"
                        data-ln-fill-title="{{ title }}"
                        aria-label="Edit"
                    >
                        <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
                    </button>
                </li>
            </ul>
        </td>
    </tr>
</template>
```

---

## Related
- **[`ln-confirm`](../ln-confirm/README.md)** — Two-click inline confirm actions (lightweight alternative to modals).
- **[`ln-form`](../ln-form/README.md)** — Form serialization and success/error cascades.
- **[`ln-validate`](../ln-validate/README.md)** — Declarative field-level constraints and visual errors.
- **Architecture deep-dive** — [`docs/js/modal.md`](../../docs/js/modal.md).
