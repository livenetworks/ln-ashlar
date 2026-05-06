# ln-autosave

> A localStorage-backed draft buffer for HTML forms. Auto-saves on field-boundary
> events, restores on construction, and clears on submit, reset, or an explicit
> cancel button.

## How it behaves

- **Auto-save** — writes the serialised form to localStorage on every `focusout`
  and `change`. One write per field-leave; no per-keystroke flood.
- **Auto-restore** — reads localStorage on construction and populates the form
  immediately. The cancelable `ln-autosave:before-restore` event is the only
  intervention point.
- **Auto-clear** — removes the localStorage entry on `submit`, `reset`, or any
  click on a `[data-ln-autosave-clear]` descendant button.
- **Opt-in debounced input** — set `data-ln-autosave-debounce-input` on the form
  to also save on `input`, debounced by the attribute value in milliseconds
  (default 1000). Useful for compose-style textareas where the user never blurs.

## Markup anatomy

```html
<form id="edit-user" data-ln-autosave>
    <div class="form-element">
        <label for="name">Name</label>
        <input id="name" name="name" type="text">
    </div>
    <ul class="form-actions">
        <li><button type="button" data-ln-autosave-clear>Cancel</button></li>
        <li><button type="submit">Save</button></li>
    </ul>
</form>
```

The storage key is `ln-autosave:{pathname}:{identifier}`, scoped per URL and
form. The identifier is the value of `data-ln-autosave` if non-empty, otherwise
`form.id`. Missing both → `console.warn` and no instance.

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-autosave` | `<form>` | Marks the form as autosaved. Empty value uses `form.id` as the storage identifier; non-empty value uses that string instead. |
| `data-ln-autosave-clear` | Any descendant button | Click-delegate marker. Removes the localStorage entry on click. Does NOT reset form values — only wipes the draft. |
| `data-ln-autosave-debounce-input` | `<form>` | Opt-in. Attaches a debounced `input` listener. Value is milliseconds; empty or omitted value defaults to 1000. Useful when users type continuously without blurring. |

## Events

All events bubble. Only `before-restore` is cancelable.

| Event | Cancelable | `detail` | When |
|---|---|---|---|
| `ln-autosave:before-restore` | **yes** | `{ target, data }` | Inside restore, after parsing localStorage, BEFORE applying values. `preventDefault()` skips the apply step; `:restored` does not fire afterwards. |
| `ln-autosave:restored` | no | `{ target, data }` | After `populateForm()` and after synthetic `input` + `change` on every restored field. |
| `ln-autosave:saved` | no | `{ target, data }` | After `localStorage.setItem` succeeds. If the write throws, the catch swallows silently — no `:save-failed` event. |
| `ln-autosave:cleared` | no | `{ target }` | After `localStorage.removeItem`. Fires even if nothing was there to remove. |
| `ln-autosave:destroyed` | no | `{ target }` | Last action of `destroy()`, after listeners are removed but before `el.lnAutosave` is deleted. |

## Properties

`el.lnAutosave` on the form element:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLFormElement` | Back-reference to the form. |
| `key` | `string` | Fully-resolved storage key (`ln-autosave:/path:identifier`), captured at construction. |
| `destroy()` | method | Removes all listeners, clears any pending debounce timer, dispatches `:destroyed`, deletes the back-reference. Does NOT clear localStorage — call `localStorage.removeItem(form.lnAutosave.key)` first if both are wanted. |

`window.lnAutosave(root)` re-runs the init scan over `root`. The shared
`MutationObserver` covers everything in `document.body`; call this only for
Shadow DOM or other contexts the observer cannot see.

## Cancel restore via `:before-restore`

The canonical edit-page pattern — the server has rendered the form with current
record values; a stale draft should not override them.

```html
<form id="edit-user" data-ln-autosave data-has-server-data="true" action="/users/42" method="POST">
    <input name="name" type="text" value="Maria"> <!-- server-rendered -->
    <input name="email" type="email" value="maria@example.com">
</form>
```

```js
document.addEventListener('ln-autosave:before-restore', function (e) {
    const form = e.detail.target;
    if (form.dataset.hasServerData === 'true') {
        e.preventDefault();                              // do not apply the draft
        localStorage.removeItem(form.lnAutosave.key);   // discard it permanently
    }
});
```

`data-has-server-data` is a project convention. The listener can inspect any
signal — `form.dataset.recordId`, a hidden input, a non-empty value field.

## Modal forms — close-and-discard

Combine `data-ln-modal-close` with `data-ln-autosave-clear` on the same button:

```html
<div id="invoice-modal" class="ln-modal" data-ln-modal>
    <form id="invoice" data-ln-autosave action="/invoices" method="POST">
        <header>
            <h3>New Invoice</h3>
            <button type="button" aria-label="Close"
                    data-ln-modal-close data-ln-autosave-clear>
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        <main>
            <input name="client" type="text" required>
            <input name="amount" type="number" required>
        </main>
        <footer>
            <button type="button" data-ln-modal-close data-ln-autosave-clear>Cancel</button>
            <button type="submit">Create</button>
        </footer>
    </form>
</div>
```

Three exit paths are wired: X icon (closes + discards), Cancel (closes + discards),
Create (submit clears via the native event).

If the user dismisses via ESC without clicking any button, the draft is NOT
cleared — ESC does not fire `submit`, `reset`, or click a clear button. To wire
ESC-discard, listen for the modal's close event and remove the entry directly:

```js
modalEl.addEventListener('ln-modal:closed', function () {
    localStorage.removeItem(formEl.lnAutosave.key);
});
```

## Long textareas — debounced input

For compose-style editors where users type continuously without blurring:

```html
<form id="post-editor" data-ln-autosave data-ln-autosave-debounce-input="500">
    <div class="form-element">
        <label for="body">Post body</label>
        <textarea id="body" name="body" required></textarea>
    </div>
    <ul class="form-actions">
        <li><button type="submit">Publish</button></li>
    </ul>
</form>
```

The attribute is read once at construction. Mutating it later does NOT change
the debounce cadence — destroy and re-mount to switch. The focusout/change
listeners remain; debounced input is additive.

## Custom serialisation for files

`type="file"` is skipped by `serializeForm()` — files cannot be stored in
localStorage. To remember the filename and hint the user on restore:

```html
<form id="upload-form" data-ln-autosave>
    <input type="file" id="report" name="report">
    <input type="hidden" name="report_filename"> <!-- ln-autosave saves this -->
    <small id="report-hint"></small>
    <button type="submit">Submit</button>
</form>
```

```js
const file = document.getElementById('report');
const filenameField = document.querySelector('[name="report_filename"]');

file.addEventListener('change', function () {
    filenameField.value = file.files[0] ? file.files[0].name : '';
});

document.getElementById('upload-form').addEventListener('ln-autosave:restored', function (e) {
    const name = e.detail.data.report_filename;
    if (name) document.getElementById('report-hint').textContent =
        'Previously selected: ' + name + ' — please re-attach.';
});
```

## What it does NOT do

- Does not save `type="file"` inputs, `type="submit"` / `type="button"` inputs,
  disabled fields, or unnamed fields.
- Does not encrypt or filter fields — everything serialisable goes into plaintext
  localStorage. Do not autosave sensitive forms.
- Does not deduplicate across forms that share the same storage key.
- Does not sync across tabs — the `storage` event is not observed.

## Migration from imperative API

Earlier versions exposed `.save()`, `.restore()`, and `.clear()` on the form's
autosave instance. They are gone. The auto-listeners cover every standard case.
For periodic saves on long textareas, use `data-ln-autosave-debounce-input`.
For ESC-discard-on-modal, use `data-ln-autosave-clear` on a button, dispatch a
synthetic `reset` event on the form (`form.dispatchEvent(new Event('reset'))`),
or remove the localStorage entry directly (`localStorage.removeItem(form.lnAutosave.key)`).

## Related

- **`ln-form`** ([README](../ln-form/README.md)) — AJAX-submit layer. Composes
  via the platform's `submit` event; no direct imports.
- **`ln-validate`** ([README](../ln-validate/README.md)) — field validity. The
  synthetic `input` / `change` dispatched on restore trigger validation without
  coordinator wiring.
- **`ln-autoresize`** ([README](../ln-autoresize/README.md)) — textarea height.
  Restored textareas grow because the synthetic `input` reaches the autoresize
  listener.
- **`ln-modal`** ([README](../ln-modal/README.md)) — composes trivially via
  declarative attributes (`data-ln-modal-close` + `data-ln-autosave-clear`).
- **`ln-store`** ([README](../ln-store/README.md)) — IndexedDB record cache.
  Different layer; does not coordinate with ln-autosave.
- **`ln-toast`** — autosave is silent by default. To surface a "Draft saved"
  indicator, listen for `ln-autosave:saved` and dispatch `ln-toast:enqueue`
  or update an `aria-live` element.
- **`serializeForm` / `populateForm`** (`js/ln-core/helpers.js`) — shared
  serialisation primitives used by ln-autosave and ln-form.
- **Architecture reference:** [`docs/js/autosave.md`](../../docs/js/autosave.md)
