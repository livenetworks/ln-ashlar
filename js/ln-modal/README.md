# ln-modal

> Modal dialog with `<form>` as the content root. `data-ln-modal` on the
> overlay is the single source of truth for open/closed; the JS API is a
> thin convenience layer over `setAttribute`.

## Philosophy

The DOM contract is small and fixed: the modal is the overlay
(`<div class="ln-modal" data-ln-modal>`), and its only direct child is
a `<form>`. The form IS the panel — there is no `.ln-modal__content`
wrapper, no inner BEM, no separate "modal action area". Footer buttons
live inside the form: `<button type="submit">` triggers submission and
gets primary fill from globals; `<button type="button"
data-ln-modal-close>` dismisses. Sizing is per-modal via mixins on
`> form`, not classes (see §Sizing variants).

`data-ln-modal="open"` means open. `data-ln-modal="close"` (or any
other value, or no value) means closed. The attribute is the only
mutator — trigger clicks, ESC, close buttons, sibling components,
external scripts, and DevTools all write `data-ln-modal`, and a
MutationObserver applies the actual side effects — aria, body scroll
lock, ESC and focus-trap listeners, focus movement, before/after
events. A listener that calls `preventDefault()` on
`ln-modal:before-open` causes the observer to revert the attribute
back to `"close"`. Focus is captured before auto-focus runs and
restored on close. ESC and focus-trap listeners are attached on open
and detached on close — when no modals are open, no listeners exist.
Slide-in animation is gated through `motion-safe` (CSS-only;
reduced-motion users see an instant state change).

For internal mechanics — focus tier priority, attribute observer
flow, body scroll-lock gating, boot-time-already-open shortcut — see
[`docs/js/modal.md`](../../docs/js/modal.md).

## HTML contract

The full annotated example. Every required attribute and ARIA piece is
called out.

```html
<!-- Trigger — anywhere in the page. data-ln-modal-for points to the modal id. -->
<button data-ln-modal-for="my-modal">Open</button>

<!-- Modal — the .ln-modal class supplies the overlay chrome. -->
<div class="ln-modal" data-ln-modal id="my-modal">
    <!-- Form is ALWAYS the direct child. No wrapper div. -->
    <form>
        <!-- Header — title + close button. -->
        <header>
            <h3>Title</h3>
            <!-- Close button: type="button" so it doesn't submit; aria-label
                 because it is icon-only; data-ln-modal-close so the
                 component wires the click handler. -->
            <button type="button" data-ln-modal-close aria-label="Close">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>

        <!-- Main — scrollable region. -->
        <main>
            <label>Name <input type="text" name="name"></label>
        </main>

        <!-- Footer — sticky to the bottom. -->
        <footer>
            <!-- Cancel: type="button" prevents accidental submit. -->
            <button type="button" data-ln-modal-close>Cancel</button>
            <!-- Save: type="submit" gets primary fill from globals. -->
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

What each piece does:

- `class="ln-modal"` — applies the overlay chrome (fixed, full-viewport, scrim, blur, centered, hidden by default).
- `data-ln-modal` — creates the component instance, default closed. `data-ln-modal="open"` boots the modal already open.
- `id="my-modal"` — the trigger reference. Every modal needs a stable id.
- `data-ln-modal-for="my-modal"` on a trigger — clicking it sets `data-ln-modal` to the opposite state on the matching modal. Ctrl/Cmd+click and middle-click pass through (open in new tab still works on `<a>` triggers).
- `data-ln-modal-close` on a button — clicking it sets `data-ln-modal="close"` on the parent modal. Works on any button in any depth inside the modal.
- `type="button"` on Cancel and Close — non-negotiable. Forms default buttons to submit.
- `aria-label="Close"` on the icon-only close button — required because the SVG has `aria-hidden="true"`.

## JS API

Each `[data-ln-modal]` element gets a per-element instance at
`element.lnModal`. The constructor is registered globally as
`window.lnModal` (call it on a DOM subtree to initialize new modals
inside it).

```js
const modal = document.getElementById('my-modal');

modal.setAttribute('data-ln-modal', 'open');   // open the modal
modal.setAttribute('data-ln-modal', 'close');  // close the modal
modal.lnModal.isOpen;                          // boolean — read-only
modal.lnModal.destroy();                       // detach listeners, dispatch :destroyed
```

The attribute is the only mutator. There is no `open()` / `close()` /
`toggle()` method — every consumer (trigger click, close button, ESC
key, sibling component, external script, DevTools) writes
`data-ln-modal` and the observer runs the pipeline (cancelable
before-events, aria, body scroll lock, focus capture/restore, focus
trap). `destroy()` is the only public method, and it does real
cleanup work the attribute alone cannot.

`window.lnModal(root)` upgrades a custom root (Shadow DOM, iframe).
Ordinary AJAX inserts and `setAttribute` on existing elements are
handled automatically by the document-level observer.

## Events

All events are dispatched on the modal element and bubble. Every
event's `detail` carries `{ modalId, target }`.

| Event                  | Cancelable | When                                                  |
|------------------------|:----------:|-------------------------------------------------------|
| `ln-modal:before-open` |    yes     | Before opening. `preventDefault()` reverts attribute. |
| `ln-modal:open`        |    no      | Modal opened (state applied, focus moved).            |
| `ln-modal:before-close`|    yes     | Before closing. `preventDefault()` reverts attribute. |
| `ln-modal:close`       |    no      | Modal closed (listeners detached).                    |
| `ln-modal:destroyed`   |    no      | Instance destroyed, listeners removed.                |

Cancellation pattern:

```js
// Conditionally block opening
document.addEventListener('ln-modal:before-open', (e) => {
    if (e.detail.modalId === 'edit-modal' && !userIsEditor()) {
        e.preventDefault();   // observer reverts data-ln-modal="open" → "close"
    }
});

// Confirm before closing on unsaved changes
document.getElementById('edit-modal').addEventListener('ln-modal:before-close', (e) => {
    if (hasUnsavedChanges()) {
        e.preventDefault();   // observer reverts data-ln-modal="close" → "open"
    }
});
```

There is no `ln-modal:before-destroy` event — destruction is a teardown
operation, not a state change.

## Attribute reference

| Attribute              | On                          | Purpose                                                      |
|------------------------|-----------------------------|--------------------------------------------------------------|
| `data-ln-modal`        | overlay element             | Creates instance. Value `"open"` or `"close"` is the state.  |
| `data-ln-modal-for`    | trigger button (anywhere)   | Click toggles the modal whose `id` matches the value.        |
| `data-ln-modal-close`  | any button inside the modal | Click closes the parent modal.                               |
| `id`                   | overlay element             | Required. Used by triggers and external API.                 |
| `autofocus`            | any element inside modal    | Receives focus on open, overriding the default first-input.  |

Standard attributes the component sets/removes (do not set these manually):

| Attribute       | When                  |
|-----------------|-----------------------|
| `aria-modal`    | `true` while open     |
| `role`          | `dialog` while open (set on first open; never removed) |

## What it does NOT do

The component is intentionally narrow. These are NOT modal concerns:

- **Form submission.** The `<form>` is yours. `type="submit"` fires
  the form's `submit` event; whatever handler you attach (vanilla,
  `ln-form`, `ln-validate`, `ln-http`) runs as it would for a form
  outside a modal. The modal does not intercept submit.
- **Validation.** That's `ln-validate` (per-field) and `ln-form`
  (form-level). They work inside a modal because the form is just a
  form.
- **Backdrop click to close.** Clicking the dark area outside the
  panel does nothing. Closing happens via ESC, the close button, the
  close API, or a cancelable before-event. If you want
  backdrop-click-to-close, wire it yourself in a coordinator.
- **Stacked-modal coordination.** Each open modal attaches its own
  ESC listener; one ESC press closes them all. There is no z-index
  bumping or topmost tracking. Don't stack modals — refactor to a
  single multi-step flow.

## Sizing variants

| Mixin       | `max-width` | When to use                                          |
|-------------|-------------|------------------------------------------------------|
| `modal-sm`  | `28rem`     | Single-field forms, simple confirms with copy.       |
| `modal-md`  | `32rem`     | Standard 2–4 field forms.                            |
| `modal-lg`  | `42rem`     | Wider forms, side-by-side fields, short tables.      |
| `modal-xl`  | `48rem`     | Detail panes, previews, multi-section forms.         |

Default panel: `width: 90%`, capped at `600px`. Apply a mixin to
override:

```scss
#user-modal > form { @include modal-lg; }
```

The cap is on `max-width` — on small viewports the panel is `90%` of
the viewport regardless of mixin.

## See also

- `js/ln-form/README.md` — form submission, autosave, reset.
- `js/ln-validate/README.md` — per-field validation.
- `js/ln-confirm/README.md` — single-button confirm pattern; the
  lightweight alternative to a modal.
- `docs/js/modal.md` — internal architecture for library maintainers.
