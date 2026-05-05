# ln-modal

Modal dialog. The component owns one thing: **the open/closed state of an
overlay element**. Everything else — content, validation, submission, focus
choreography you might want beyond the basics — is consumer-side or another
component's job.

## Philosophy

### `<form>` is the content root, not a wrapper div

The DOM contract is brutally simple: the modal is the overlay (`<div
class="ln-modal" data-ln-modal>`), and its only direct child is a
`<form>`. There is no `.ln-modal__content`, no inner panel wrapper, no
BEM. The `<form>` is structurally a `section-card` (header / main /
footer chrome reused via `@include section-card`), so the modal panel
inherits the same chrome the rest of the library's cards use, plus
modal-specific behaviour layered on top: fixed envelope, scrollable
body, sticky footer, slide-in animation, deep shadow.

This is not a stylistic preference — it is the mechanism for cheap
form modals. Because the form IS the panel, footer buttons (Cancel,
Save) are inside the form by default. `type="submit"` triggers
submission directly. `type="button"` with `data-ln-modal-close`
dismisses without submitting. There is no separate "modal action area"
to wire into form behaviour; the modal IS the form.

If your modal isn't a form (a notification, a preview, a content
display), you still use `<form>` as the root — just leave it without
inputs and use a single `<button type="button" data-ln-modal-close>`
to dismiss. The cost is one tag; the gain is structural consistency.

### `data-ln-modal` is the state machine

`data-ln-modal="open"` means open. `data-ln-modal="close"` (or no
value) means closed. That attribute is the **single source of truth**
— there is no internal `isOpen` flag the component trusts independent
of the attribute, and the JS API methods do not directly mutate the
DOM. `open()`, `close()`, and `toggle()` set the attribute. A
MutationObserver fires, reads the new value, and applies the actual
work: aria, body scroll lock, ESC listener, focus, before/after
events.

This means **external code can drive the modal by setting the
attribute directly** with no API call:

```js
modal.setAttribute('data-ln-modal', 'open');   // identical to modal.lnModal.open()
modal.setAttribute('data-ln-modal', 'close');  // identical to modal.lnModal.close()
```

It also means cancellation works the same way for both paths: when
`ln-modal:before-open` is canceled by a listener, the observer
**reverts the attribute back to `close`**, which fires another
mutation, which does nothing because the new state matches the
instance's state. The revert is the cancellation. There is no
imperative branch.

### Cancel = `type="button"`, Save = `type="submit"` — color comes from globals

The library does not use `.btn-primary` / `.btn-secondary` classes.
Every `<button>` gets neutral chrome from `scss/base/_global.scss`,
and `<button type="submit">` automatically gets primary fill — color
only, no transform. So a footer with one cancel and one save reads:

```html
<footer>
    <button type="button" data-ln-modal-close>Cancel</button>
    <button type="submit">Save</button>
</footer>
```

No classes, no mixins on the buttons themselves. The cancel button
needs `type="button"` explicitly because the default for buttons
inside `<form>` is submit — forgetting it is a real bug, not a style
issue, because clicking Cancel would submit the form.

### ESC listener is **active only while open**

Most "modal" libraries register a global ESC handler at boot. This
component doesn't. When all modals are closed, **zero keydown
listeners are attached to `document`**. Open a modal: a fresh
`keydown` listener is attached. Close it: the listener is removed. If
nothing is mounted, nothing listens.

The same pattern applies to the focus-trap handler — attached on
open, detached on close. The only always-on cost of having `ln-modal`
in the page is the MutationObserver that auto-initializes new modals,
which is shared across the whole library and has minimal overhead.

### Focus is restored on close

When the modal opens, the component captures
`document.activeElement` (typically the trigger button) before
moving focus into the modal. When the modal closes, focus is
restored to that captured element. Skipped if the previous
active element was `<body>` (no real focus before open) or if
the captured element was removed from the DOM during the
modal's lifetime. No new attribute or event — purely internal.

There is **no global open-stack coordinator** (unlike `ln-popover`,
which maintains an `openStack[]` so ESC closes the topmost popover).
Each open modal attaches its own ESC handler. With a stack of two
modals open simultaneously, both ESC handlers fire on a single ESC
key — both call their own `close()`, which sets their own attribute.
This is **not the recommended pattern** (see "What it does NOT do"
below), but it is the literal behaviour.

### Slide-in animation is gated through `motion-safe`

The modal panel slides down on open via the `ln-modal-slideIn`
keyframe (`transform: translateY(-50px)` → `0`, `opacity: 0` → `1`).
It is wrapped in `@include motion-safe` so users with
`prefers-reduced-motion: reduce` get an instant state change with no
slide. The library does not run the animation in JS — it is pure CSS
gated by media query. There is no `transitionend` listener, no
animation-completion event.

### Sizing via mixins on `> form`, not classes

The library ships four size mixins — `modal-sm` (28rem), `modal-md`
(32rem), `modal-lg` (42rem), `modal-xl` (48rem). They live in
`scss/config/mixins/_modal.scss` and apply to **the `<form>`, not the
overlay**. Default panel width is `90%` capped at `600px`; mixins
override the cap.

```scss
#user-form-modal > form { @include modal-sm; }
#settings-modal  > form { @include modal-md; }
#report-modal    > form { @include modal-lg; }
#preview-modal   > form { @include modal-xl; }
```

There is no `.modal-lg` CSS class — sizing is a project-level decision
made on a project-level selector (the modal's `id`), not a library
default.

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
- `data-ln-modal-for="my-modal"` on a trigger — clicking it calls `toggle()` on the matching modal. Ctrl/Cmd+click and middle-click pass through (open in new tab still works on `<a>` triggers).
- `data-ln-modal-close` on a button — clicking it calls `close()` on the parent modal. Works on any button in any depth inside the modal.
- `type="button"` on Cancel and Close — non-negotiable. Forms default buttons to submit.
- `aria-label="Close"` on the icon-only close button — required because the SVG has `aria-hidden="true"`.

## JS API

Each `[data-ln-modal]` element gets a per-element instance at
`element.lnModal`. The constructor is registered globally as
`window.lnModal` (call it on a DOM subtree to initialize new modals
inside it).

```js
const modal = document.getElementById('my-modal');

modal.lnModal.open();      // sets data-ln-modal="open"; observer applies state
modal.lnModal.close();     // sets data-ln-modal="close"; observer applies state
modal.lnModal.toggle();    // open ↔ close based on instance.isOpen
modal.lnModal.destroy();   // detach all listeners, drop instance reference

// Equivalent to .open() / .close() — same observer path:
modal.setAttribute('data-ln-modal', 'open');
modal.setAttribute('data-ln-modal', 'close');

// Read current state (queries are direct API):
const isOpen = modal.lnModal.isOpen;
```

**Mutations through requests, queries through API.** Reading
`instance.isOpen` is fine. Writing it directly is not — it bypasses
the observer and produces incoherent state. Always go through
`open()` / `close()` / the attribute.

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
- **POSTing to the server.** That's `ln-http`, `ln-store`, or a
  manual `fetch()` in your submit handler.
- **Confirm dialogs.** That's `ln-confirm`, which is a button-state
  state machine, NOT a modal. (Use `ln-confirm` for one-button
  "press twice" patterns; use `ln-modal` when you genuinely need a
  Cancel option, descriptive copy, or typed verification.)
- **Backdrop click to close.** Clicking the dark area outside the
  panel does **nothing**. There is no backdrop click handler in JS.
  Closing happens via ESC, the close button, the close API, or a
  cancelable before-event. (If you want backdrop-click-to-close, wire
  it yourself in a coordinator — but ask first whether your modal
  should really be that easy to dismiss.)
- **`aria-hidden` / `inert` on the background.** The page behind the
  modal is technically still in the accessibility tree. Screen
  readers may announce content outside the dialog if the user
  navigates there. The modal sets `aria-modal="true"` on itself
  (which is the correct WAI-ARIA signal), but does not toggle
  attributes on `<main>` or sibling content.
- **Scroll position preservation.** `body.ln-modal-open` applies
  `overflow: hidden`. On platforms where this resets the scroll
  position, the page jumps. The component does not save and restore
  `window.scrollY`.
- **Stacked-modal coordination.** Multiple modals open at once is
  technically possible, but each attaches its own ESC listener
  (one ESC fires every open modal's handler). There is no z-index
  bumping, no "topmost" tracking, no auto-stacking. Don't stack
  modals; if you need a confirm-inside-modal pattern, refactor to a
  single multi-step flow.

## Cross-component composition

### ln-modal hosts ln-form

Because `<form>` is the modal's content root, attaching `ln-form` is
trivial — you mount it on the same `<form>`:

```html
<div class="ln-modal" data-ln-modal id="user-modal">
    <form data-ln-form action="/users" method="post">
        <main>...</main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

`ln-form` and `ln-modal` are independent components on the same DOM
subtree — neither imports the other. They coexist by being separate
data-attribute components attached to different elements (modal on
the overlay, form on the form).

### ln-modal hosts ln-validate

Same pattern. `ln-validate` attaches to inputs:

```html
<form>
    <main>
        <label>Email <input type="email" data-ln-validate required></label>
    </main>
</form>
```

The modal opening/closing has no effect on `ln-validate`'s state.
On reopen, the field still shows whatever validation state it had
last — clear it explicitly in your `ln-modal:open` handler if you
need a fresh start.

### ln-confirm is NOT a modal

`ln-confirm` is a single-button state machine ("click once, button
shows confirmation copy; click again, action proceeds"). It is the
**lighter** alternative to a modal for destructive actions. Use
`ln-modal` when you need:

- A descriptive paragraph beyond a button label
- A typed verification (e.g. type the project name to confirm)
- A genuine Cancel button (not just "click somewhere else to abort")
- A multi-field input

Use `ln-confirm` when the entire question fits in the button itself.

## Common mistakes

- **Wrapping the form in a `<div class="ln-modal__content">`.**
  There is no such class. The form IS the content. Inserting a
  wrapper breaks the `> form` selector and removes the modal panel
  styling.
- **Forgetting `type="button"` on Cancel.** Browsers default form
  buttons to `type="submit"`. Without explicit `type="button"`,
  clicking Cancel submits the form.
- **Adding `.btn` or `.btn-primary` classes to footer buttons.** Not
  needed. The library's global button styling plus
  `<button type="submit">` give you neutral + primary automatically.
- **Stacking two modals open at once.** Technically possible, but
  z-index, focus, and ESC are not coordinated for it. Refactor to a
  single multi-step modal.
- **Using `&times;` for the close icon.** Always use `<svg
  class="ln-icon"><use href="#ln-x"></use></svg>`.
- **Setting `data-ln-modal="true"` instead of `"open"`.** The
  observer compares against the literal string `"open"`. Anything
  else is treated as closed.
- **Calling `lnModal.open()` while the modal is in the middle of
  closing.** The component guards against re-entry (no-op if
  already in target state), so this is safe — but if a
  `before-close` handler reverts the close, your `open()` call
  triggered before the revert is also a no-op (the attribute was
  already `"open"`).
- **Putting trigger buttons inside the modal they open.** If
  `data-ln-modal-for="my-modal"` lives inside `#my-modal`, clicking
  it toggles the modal you're already in — useful for "expand to
  full size" only if you're sure that's what you want.

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

## Edge cases

- **Modal opened twice.** `open()` no-ops if already open
  (`if (this.isOpen) return`). Setting the attribute to `"open"`
  while already open triggers a mutation, but `_syncAttribute`
  no-ops because `shouldBeOpen === instance.isOpen`.
- **Attribute set externally to a value other than `"open"`/`"close"`.**
  Treated as closed (the comparison is `value === 'open'`, anything
  else is falsy).
- **Trigger removed mid-open.** No effect — the open modal's state
  is owned by the modal element, not the trigger. The trigger going
  away just means there's no button to close it (use ESC or a
  close-button inside).
- **`prefers-reduced-motion`.** The slide-in animation is gated by
  `@include motion-safe`. Reduced-motion users see the modal appear
  instantly with no transition.
- **Nested modal subtree mounted lazily (AJAX, innerHTML).** The
  shared MutationObserver picks up the new `data-ln-modal` element
  on `childList` mutations and initializes it.
- **`data-ln-modal-for` trigger pointing to a non-existent id.**
  Click handler emits a `console.warn`
  (`[ln-modal] No modal found for data-ln-modal-for="<id>"`)
  and bails. If the element exists but has no instance yet
  (legitimate race during async DOM init), the handler bails
  silently.
- **Modal has no focusable elements at all.** The focus block falls
  through every selector and ends with no focus moved. Browser
  keeps focus wherever it was. The focus trap also no-ops on Tab
  (`if (focusable.length === 0) return`).

## See also

- `js/ln-form/README.md` — form submission, autosave, reset.
- `js/ln-validate/README.md` — per-field validation.
- `js/ln-confirm/README.md` — single-button confirm pattern; the
  lightweight alternative to a modal.
- `docs/js/modal.md` — internal architecture for library maintainers.
