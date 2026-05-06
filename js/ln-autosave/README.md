# ln-autosave

> A localStorage-backed draft buffer for HTML forms. Saves the
> serialised form state on every `focusout` and `change`, restores it
> on construction, and clears it on `submit`, `reset`, or any click on
> a `[data-ln-autosave-clear]` button. 141 lines of JS that exist so
> users do not lose half-typed work to an accidental tab close, a
> back-button slip, or a router-driven re-render. The saved value is
> the form's `serializeForm()` output keyed by URL pathname plus form
> identifier.

## Philosophy

Long forms are user-hostile under the default browser contract. The
contract says: type for ten minutes, hit the wrong link, the form is
blank when you come back. Every serious admin panel solves this twice
— once badly with a "Save draft" button users forget to press, once
correctly with an autosave layer that runs invisibly in the
background. ln-autosave is the second one. There is no button to
forget. The save happens on field-blur and field-change; the restore
happens on construction; the clear happens on whatever signal means
"this draft is no longer relevant" (submit, reset, explicit cancel).
The user never sees it work and never sees it not work; they just
notice that their form is still filled in when they come back.

That framing dictates a sequence of small architectural choices. Each
is visible in the source and worth understanding before you reach for
the component.

The storage is **localStorage**, not IndexedDB, not a server endpoint,
not `sessionStorage`. localStorage is synchronous (so the save on
`focusout` is a single-tick write — no race window where a user could
click "Submit" before the save lands), origin-scoped (so a draft
written on `/users/42/edit` cannot be read by another origin), and
persisted across tab close (so the draft survives the user closing
the laptop and walking to lunch). `sessionStorage` would lose the
draft on tab close, which is the headline scenario; IndexedDB would
make every save async and force the component to think about race
conditions; a server endpoint would couple "save the draft" to "the
network is up," which is exactly the resilience guarantee autosave is
supposed to provide. localStorage's ~5MB-per-origin cap is the price,
and it is the right price for forms (verify that no consumer crams
file uploads into the draft — see "What ln-autosave does NOT do").

The save trigger is **`focusout` plus `change`**, not `input`, not a
debounced timer, not on submit. `focusout` fires when the user leaves
a field, which is the natural "I'm done with this one" boundary;
`change` covers checkbox, radio, and `<select>` (where `focusout`
either does not fire or fires too late to capture the new value). A
debounced `input` listener would save on every keystroke and burn
unnecessary `JSON.stringify` cycles on every form mutation; the
field-boundary trigger writes once per field-touch, which is good
enough for "the user lost their tab" but cheaper than per-keystroke.
A timer-based save would write even when nothing changed; the
event-driven save only writes on actual field activity. (The
trade-off: if the user types continuously into one field for 10
minutes without ever blurring it, no save happens until they tab
away. For typical multi-field forms this is fine; for one-field
"compose" textareas it can lose work — see "Common mistakes" item 5.)

The clear trigger is **submit + reset + explicit clear**. Submit means
"the draft has become a real record" — keeping the localStorage entry
would re-fill the form on the next visit with stale data after the
record is already in the database. Reset (the native form `reset`
event) means "user explicitly threw the draft away." The
`[data-ln-autosave-clear]` attribute is for buttons that are NOT
`type="submit"` or `type="reset"` but should still discard the draft
— the most common case being "Cancel" inside a modal that closes the
form without submitting. Three signals, one effect; the consumer
chooses whichever matches their button's semantics.

The restore trigger is **construction time**, period. There is no
"restore on focus," no "restore button," no API to ask "do you have a
draft for this form?" without restoring it. If the localStorage entry
exists when the component initialises, it gets applied; if not, the
form stays empty. The cancelable `ln-autosave:before-restore` event
is the only intervention point — listen for it, decide whether the
draft is still relevant (e.g. server data should win), and call
`preventDefault()` to skip the application. After restore, the
component dispatches synthetic `input` and `change` events on every
populated field so downstream components (`ln-validate`,
`ln-autoresize`, `ln-form`'s submit-button enable logic) see the
filled values as if the user had typed them.

The storage key is **`ln-autosave:{pathname}:{identifier}`**. The
pathname prefix scopes drafts to a URL — a form with `id="user-form"`
on `/users/42/edit` does not collide with a form of the same id on
`/users/43/edit`. The identifier is `data-ln-autosave="..."` if
provided, falling back to `form.id`. If neither is present, the
component logs a `console.warn` and exits without instantiating —
there is no anonymous draft mode. (See `_getStorageKey` at line 126.)

### What `ln-autosave` does NOT do

- **Does NOT debounce or rate-limit saves.** Every `focusout` and
  every `change` writes the entire serialised form synchronously.
  For a 50-field form that is roughly 50 writes per fill-in, each
  costing one `JSON.stringify` of the whole form. Modern browsers
  handle this in microseconds; if your form is genuinely huge or
  contains objects that serialise expensively, profile before
  worrying. There is no `data-ln-autosave-debounce` attribute.
- **Does NOT validate before saving.** The draft is saved exactly
  as serialised, including invalid email addresses, partial dates,
  out-of-range numbers, and required fields left blank. This is by
  design: the whole point of autosave is to catch the user's
  half-finished state, and "half-finished" by definition means "not
  yet valid." Validation runs on submit, not on draft-save.
- **Does NOT save file inputs.** `serializeForm()` skips
  `type="file"` (verify in `js/ln-core/helpers.js:232`). Files
  cannot be serialised into JSON, and even if they could,
  re-attaching a `File` object to an `<input type="file">` is a
  permission-restricted browser operation. If the user uploads a
  PDF, refreshes, and comes back, the file input will be empty even
  though the rest of the form restores. Communicate that to the
  user explicitly if your form is file-driven.
- **Does NOT save buttons or submit inputs.** `serializeForm()`
  skips `type="submit"` and `type="button"`. Disabled fields are
  also skipped. Unnamed fields (`<input>` without a `name`) are
  skipped. The exclusion list is in `helpers.js:232`.
- **Does NOT deduplicate across forms with colliding keys.** If you
  have two forms with `id="my-form"` on the same page (which is
  invalid HTML but happens during template generation), both
  initialise and both write to the same localStorage key. The last
  write wins; the next restore applies the same data to both forms.
  Give each form a distinct id, or use `data-ln-autosave="..."` to
  disambiguate.
- **Does NOT handle the storage quota gracefully.** localStorage
  caps at ~5MB per origin. A `try/catch` around every `setItem`
  swallows the `QuotaExceededError` silently — the save fails, no
  event fires, no toast appears, no console warning. If your draft
  pushes past 5MB (huge `<textarea>` content, base64-encoded
  binary, dozens of large arrays), the autosave silently stops
  working. There is no quota-exceeded event. ln-store has one
  (`ln-store:quota-exceeded`); ln-autosave does not.
- **Does NOT sync across tabs.** localStorage's `storage` event
  fires on OTHER tabs when one tab writes — but ln-autosave does
  not listen for it. If the user opens the same form in two tabs,
  edits in tab A, then switches to tab B, tab B will not see the
  new draft. On a hard refresh of tab B the latest draft wins (it
  is read on construction). For most consumer-facing flows this is
  fine; for collaborative-editing scenarios autosave is the wrong
  tool entirely (use `ln-store` with optimistic writes).
- **Does NOT expire stale drafts.** A draft written six months ago
  on `/users/42/edit` is still in localStorage today, and it will
  restore the next time someone visits that URL. There is no TTL,
  no `data-ln-autosave-expire`, no garbage collection. If staleness
  is a concern (e.g. records change schema between releases),
  listen for `ln-autosave:before-restore`, inspect the data shape,
  call `preventDefault()` and `form.lnAutosave.clear()` to discard
  the stale draft.
- **Does NOT encrypt or filter sensitive fields.** Everything that
  is not file/submit/button/disabled/unnamed gets serialised. If
  your form contains personal information, security questions, or
  any field whose visibility is not safe in the user's browser
  storage, that field WILL be written to localStorage. There is no
  per-field opt-out. The right answer is to design those fields out
  of forms that get autosaved — autosave belongs on long, drafty,
  user-content forms (blog posts, descriptions, address blocks),
  not on sensitive ones.
- **Does NOT detect form-schema changes between save and restore.**
  If you save with `name="email_address"`, then redeploy and
  rename the field to `name="email"`, the next restore will write
  the saved `email_address` value into a field that no longer
  exists (silently — `populateForm` skips fields not in the form)
  and leave the new `email` field empty. The data is still in
  localStorage but stranded. See "Common mistakes" item 6 for
  mitigation.
- **Does NOT integrate with `el.lnSelect.setValue()` despite what
  the source appears to claim.** Lines 97–99 of `ln-autosave.js`
  read `if (restored[k].lnSelect && restored[k].lnSelect.setValue)`
  and call `setValue(...)`. This branch never executes. `ln-select`
  stores its TomSelect instances in a module-scoped `WeakMap`
  accessed via `window.lnSelect.getInstance(element)`, NOT as
  `element.lnSelect` (verify in `js/ln-select/ln-select.js:22, 147`).
  The branch is dead code; the practical TomSelect integration
  happens via the `change` event that ln-autosave dispatches on
  every restored field — TomSelect listens for `change` on the
  underlying `<select>` and re-syncs its visible UI. This is fine,
  just not for the reason the source seems to suggest. (Flag for a
  future cleanup pass.)

### Cross-component coordination

| Component | Coordination | Verified at |
|---|---|---|
| `ln-form` | None at the JS level — they share `serializeForm` / `populateForm` helpers from `ln-core` but do not import or listen for each other's events. ln-form's `ln-form:fill` does NOT trigger an autosave write; ln-autosave's `ln-autosave:restored` does NOT trigger ln-form's submit-button enable logic. The two compose because the synthetic `input` / `change` events ln-autosave dispatches on every restored field bubble up to ln-form, ln-validate, and ln-autoresize, which all listen for native input events. | grep against `js/ln-autosave/`, `js/ln-form/`, `js/ln-store/` — zero cross-references; `ln-autosave.js:94-95` dispatches the bubbling events |
| `ln-validate` | None directly. ln-autosave restores values, dispatches `input` / `change`, ln-validate's input listener catches them and validates. The user-perceived effect is "after restore, validation state is correct" — but the wiring is the platform event flow, not custom integration. | `js/ln-validate/ln-validate.js` listens for input/change; `ln-autosave.js:94-95` dispatches them |
| `ln-autoresize` | None directly. Same as ln-validate — the dispatched `input` event on a restored `<textarea>` triggers ln-autoresize's listener and the textarea grows to fit the restored content. | grep — zero cross-references; relies on event propagation |
| `ln-select` (TomSelect) | None directly. The dead `lnSelect.setValue` branch (see "What it does NOT do" above) was an attempted explicit integration that never wires. The actual integration is via the dispatched `change` event on the underlying `<select>`, which TomSelect listens to internally. | `js/ln-autosave/ln-autosave.js:97-99` (dead branch); `js/ln-select/ln-select.js:22, 147` (instances are in WeakMap) |
| `ln-store` | **None.** ln-store is IndexedDB-backed for record cache; ln-autosave is localStorage-backed for form drafts. Different storage, different lifecycle, different keys (`ln-autosave:` vs `ln_app_cache` IndexedDB database). They serve completely different concerns; do not confuse them. See "Common mistakes" item 7. | `js/ln-store/ln-store.js:9` (`DB_NAME = 'ln_app_cache'`); `js/ln-autosave/ln-autosave.js:7` (`STORAGE_PREFIX = 'ln-autosave:'`) |
| `ln-toast` | None. The component does NOT surface any toast on save / restore / clear. If you want "Draft saved" toasts, listen for `ln-autosave:saved` and dispatch a toast yourself. The default chrome is silent — autosave that announces itself defeats its own UX goal. | grep — zero references |
| `ln-modal` | None. A `<form data-ln-autosave>` inside a modal works without coordination — the modal's open/close has no bearing on autosave's lifecycle. The "Cancel" button inside the modal that should also discard the draft uses `data-ln-autosave-clear` (often combined with `data-ln-modal-close`). | `js/ln-modal/`; `js/ln-autosave/README.md` examples below |
| `ln-core/persist.js` | **Independent.** ln-core's `persistGet/Set/Remove` use the prefix `ln:` (e.g., `ln:filter:/path:my-filter`). ln-autosave uses `ln-autosave:` (e.g., `ln-autosave:/path:my-form`). The two prefixes cannot collide. ln-core/persist.js explicitly notes this in its header comment. | `js/ln-core/persist.js:10-11` |

The deliberate non-coordination is the architectural point. ln-form
owns the submit pipeline; ln-validate owns the field-validity
contract; ln-autosave owns draft persistence. Each layer cares about
the form for a different reason, observes different events, writes to
different stores, and never asks the other layers what they think.
The user perceives them as one cohesive form experience because
HTML's native event flow (`input`, `change`, `submit`, `reset`) is
the connecting tissue. None of the components need to know about each
other; the platform tells each one what it needs to know.

## Markup anatomy

The minimum invocation is `data-ln-autosave` on a `<form>` with an
`id`:

```html
<form id="edit-user" data-ln-autosave>
    <div class="form-element">
        <label for="name">Name</label>
        <input id="name" name="name" type="text">
    </div>
    <div class="form-element">
        <label for="email">Email</label>
        <input id="email" name="email" type="email">
    </div>
    <ul class="form-actions">
        <li><button type="submit">Save</button></li>
    </ul>
</form>
```

That is the entire setup. The form's storage key is
`ln-autosave:{pathname}:edit-user`; every `focusout` writes; every
construction restores; the `submit` clears.

The form does NOT need `data-ln-form` for autosave to work. ln-form
adds AJAX submission, validation gating, and submit-button enable
logic — it composes with ln-autosave but is not required by it.
Plain `<form action="/users/42/save" method="POST" data-ln-autosave>`
works.

### Identifier resolution

```html
<!-- Storage key uses form.id (most common) -->
<form id="edit-user" data-ln-autosave>...</form>

<!-- Storage key uses the attribute value (form has no id) -->
<form data-ln-autosave="contact-draft">...</form>

<!-- Storage key uses the attribute value (overrides form.id) -->
<form id="x" data-ln-autosave="contact-draft">...</form>
```

The resolution is `getAttribute('data-ln-autosave') || form.id`
(`_getStorageKey`, line 128). Empty attribute (`data-ln-autosave=""`)
falls back to `form.id`. Missing both → console.warn + return.

Two reasons to use the explicit attribute over `form.id`:

1. **The form has no id.** Forms inside a Blade `@include` partial
   sometimes ship without ids (the consumer is expected to add them
   per usage). The attribute lets you give autosave an identity
   without inventing an id that has no other purpose.
2. **You want autosave-grouped drafts that span multiple forms.**
   Two `<form data-ln-autosave="user-draft">` instances on the same
   URL share a storage key. Edit either, both restore the same
   content. (Useful in some multi-step wizards; usually a
   smell — see "Common mistakes" item 4.)

### Clear-button anatomy

```html
<form id="invoice" data-ln-autosave>
    <!-- ... fields ... -->
    <ul class="form-actions">
        <li><button type="button" data-ln-autosave-clear>Cancel</button></li>
        <li><button type="reset">Reset</button></li>
        <li><button type="submit">Create</button></li>
    </ul>
</form>
```

Three buttons, three different effects:

- **`type="submit"`** — submits the form, fires the `submit` event,
  ln-autosave clears the draft.
- **`type="reset"`** — resets the form to defaults, fires the
  `reset` event, ln-autosave clears the draft.
- **`type="button" data-ln-autosave-clear`** — does NOT reset the
  form values, does NOT submit; click handler in ln-autosave fires
  `clear()`. The form's visible state is left as-is; only the
  draft is discarded. Typical use: a "Cancel" button inside a modal
  that closes the modal AND discards the draft (often combined
  with `data-ln-modal-close`).

The clear-button click handler uses event delegation (`form.click`
listener at line 56) and `closest('[data-ln-autosave-clear]')` (line
48), so the attribute can be on any descendant of the form — a
button inside a footer, a button inside a fieldset, etc. Putting it
on a button outside the form does not work; the listener is on the
form itself.

### What state lives where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this form autosave? | `data-ln-autosave` (presence) on the `<form>` | author |
| Storage key identifier | Value of `data-ln-autosave`, falling back to `form.id` | author |
| Page-scope of the draft | `window.location.pathname` (read once at construction) | the platform |
| Currently saved draft | `localStorage[ 'ln-autosave:{path}:{id}' ]` | ln-autosave |
| Should this button discard? | `data-ln-autosave-clear` on a descendant button | author |
| Restore-bypass for this load | `e.preventDefault()` on `ln-autosave:before-restore` | consumer listener |
| Field types saved | Hard-coded in `serializeForm` (`ln-core/helpers.js`) | ln-core (not configurable) |

The pathname is captured lazily inside `_getStorageKey` (which runs
once, at construction). If the page navigates client-side via
History API and the same form remains in the DOM, the storage key
does NOT update — the captured key is still tied to the construction
pathname. For SPA-driven flows this is rarely correct; either
re-mount the form on navigation, or let the form's id encode the
record-specific identity (e.g. `id="user-42-form"`).

## States & visual feedback

The component has no visual surface — no chrome, no class on the form,
no attribute that drives CSS. Every visible effect is a side-effect of
serialising-then-applying form values, which the form's existing
styling renders.

| Trigger | What JS does | What the user sees |
|---|---|---|
| Constructor runs with a saved draft in localStorage | `restore()` runs immediately at line 58. Dispatches cancelable `ln-autosave:before-restore`; if not prevented, `populateForm()` writes values, then dispatches synthetic `input` + `change` on every restored field, then dispatches `ln-autosave:restored` | The form appears pre-filled. ln-validate (if present) re-validates each field; ln-autoresize (if present) re-sizes textareas; submit-button enable logic in ln-form recomputes |
| Constructor runs with no saved draft | `restore()` reads `null` from localStorage, returns early at line 80 | The form stays empty (its server-rendered or default state) |
| User blurs a field (`focusout`) | If the field is `INPUT`/`TEXTAREA`/`SELECT` with a `name`, `save()` runs: serialises the entire form, writes to localStorage, dispatches `ln-autosave:saved` | Nothing visible. Open DevTools → Application → Local Storage to inspect |
| User changes a checkbox/radio/select (`change`) | Same as `focusout` — `save()` runs | Nothing visible |
| User clicks submit | The form's `submit` event fires; ln-autosave's listener calls `clear()`; localStorage entry is removed; `ln-autosave:cleared` dispatches; the platform's submit proceeds | The form submits as normal. On the next visit, no draft is restored |
| User clicks reset | `reset` event fires; `clear()` runs identically to submit | The form resets to defaults; on next visit, no draft restored |
| User clicks `[data-ln-autosave-clear]` | Click handler walks `closest()`, finds the marker, calls `clear()` | Form values are NOT reset (clear button does not touch field values); the localStorage entry is removed; on next visit, no draft restored |
| `destroy()` called | All listeners removed (focusout, change, submit, reset, click), `ln-autosave:destroyed` dispatched, `delete this.dom.lnAutosave` | The form stops auto-saving. The localStorage entry is left in place — destroy does NOT clear; on next mount, the draft is still there |

The "destroy does NOT clear" rule is deliberate. Destroying the
component is a JS-side operation that says "stop auto-saving"; it is
NOT a user-facing action that says "discard the draft." The two
concerns are separate: if you want both, call
`form.lnAutosave.clear()` before `form.lnAutosave.destroy()`.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-autosave` | `<form>` | Marks the form as autosaved. Empty value (`data-ln-autosave`) means "use `form.id` as the storage identifier"; non-empty value (`data-ln-autosave="custom-key"`) means "use this string as the identifier instead." If neither the attribute value nor `form.id` resolves, the constructor logs a warning and returns without instantiating. | Presence creates the instance and binds the five form-level listeners. The value is read once at construction (`_getStorageKey`, line 128) and then captured in `this.key`. Mutating the value mid-life does NOT re-key the instance — destroy and re-create. |
| `data-ln-autosave-clear` | Any descendant of the form (typically a `<button type="button">`) | Marks a button that, when clicked, calls `clear()` on the form's autosave instance. The button itself does not need `id`, `name`, or any other attribute; the click delegate finds it via `closest()`. | Decouples "discard the draft" from `type="submit"` and `type="reset"` so a "Cancel" button can leave form values intact while wiping the draft. The listener is delegated on the form, not on the button — adding the attribute later (after construction) DOES work, because the form's click listener runs `closest()` fresh each time. |

There are no other attributes. No `data-ln-autosave-debounce`, no
`-trigger`, no `-expire`, no `-key-strategy`. The contract is
intentionally narrow.

`form.id` is read at construction and only as a fallback for the
storage identifier. The component does not observe `id` mutations; if
you change the form's id at runtime, the existing instance keeps the
old key. Re-mount to switch.

## Events

All events bubble. Only `before-restore` is cancelable.

| Event | Bubbles | Cancelable | `detail` | Dispatched on | Dispatched when |
|---|---|---|---|---|---|
| `ln-autosave:before-restore` | yes | **yes** | `{ target: HTMLFormElement, data: object }` | The `<form>` | Inside `restore()`, after parsing the localStorage entry, BEFORE applying values. Calling `preventDefault()` skips the apply step entirely — the form stays in its pre-restore state and the `:restored` event does NOT fire afterwards. |
| `ln-autosave:restored` | yes | no | `{ target: HTMLFormElement, data: object }` | The `<form>` | After `populateForm()` has written values and after synthetic `input` + `change` have been dispatched on every restored field. Listeners that need to re-react to filled state attach here. |
| `ln-autosave:saved` | yes | no | `{ target: HTMLFormElement, data: object }` | The `<form>` | After `localStorage.setItem` succeeds (or fails silently — if the write throws, no event fires). The `data` is the just-written serialised form. |
| `ln-autosave:cleared` | yes | no | `{ target: HTMLFormElement }` | The `<form>` | After `localStorage.removeItem` runs (regardless of whether anything was actually there to remove). |
| `ln-autosave:destroyed` | yes | no | `{ target: HTMLFormElement }` | The `<form>` | Last action of `destroy()`, after all listeners are removed but before `delete this.dom.lnAutosave`. |

`detail.target` is always the form element. Listening on `document`
catches every autosave event on the page; listening on the form
itself catches its own events only.

`detail.data` on `:saved`, `:before-restore`, and `:restored` is the
plain object produced by `serializeForm()`. The shape is
`{ fieldName: value }` where value is a string (text/textarea/select
single), an array of strings (checkbox group, select-multiple), or a
single string (radio). See `js/ln-core/helpers.js:226-250` for the
exact serialisation rules.

The cancelable `before-restore` is the only intervention point. Three
canonical reasons to call `preventDefault()` from a listener:

1. **Server data has priority** — the form is rendering a record
   from the database; the saved draft is older than the server
   value. Skip the restore and clear the stale entry.
2. **Schema mismatch** — the saved data has an old field name that
   no longer exists in the form. Skip and clear (or attempt
   migration in the listener).
3. **User permission changed** — the form has fewer fields than
   when the draft was saved (e.g., the user lost edit access to
   some columns). Skip the restore so disallowed fields stay
   server-controlled.

For all three, the conventional follow-up is `form.lnAutosave.clear()`
to discard the now-irrelevant draft. See "Examples" below.

## API (component instance)

`window.lnAutosave(root)` re-runs the init scan over `root`. The
shared `MutationObserver` registered by `registerComponent` already
covers AJAX inserts and `data-ln-autosave` attribute additions; call
this manually only when you inject markup into a Shadow DOM root or
another document context the observer cannot see.

`el.lnAutosave` on a form exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLFormElement` | Back-reference to the form. |
| `key` | `string` | The fully-resolved storage key (`ln-autosave:/path:identifier`), captured at construction. |
| `save()` | method | Serialise the form and write to localStorage. Dispatches `ln-autosave:saved`. Used internally by the `focusout` and `change` listeners; can be called manually if you need to force a save (e.g., right before a programmatic navigation). |
| `restore()` | method | Read localStorage, parse JSON, dispatch cancelable `:before-restore`, apply values via `populateForm`, dispatch synthetic input/change on each restored field, dispatch `:restored`. Called internally during construction; can be called manually if you've cleared the form via `form.reset()` and want to re-fill from the (still-present) draft. |
| `clear()` | method | Remove the localStorage entry. Dispatches `ln-autosave:cleared`. Used internally by submit / reset / clear-button click. Call manually for "discard draft without resetting form." |
| `destroy()` | method | Remove all five form-level listeners (focusout, change, submit, reset, click), dispatch `ln-autosave:destroyed`, delete the back-reference. Does NOT clear localStorage — call `clear()` first if both are wanted. |

There is no `getDraft()`, `hasDraft()`, or `setKey()`. Reading the
draft without applying it is — read `localStorage` directly:

```js
const key = form.lnAutosave.key;
const raw = localStorage.getItem(key);
const draft = raw ? JSON.parse(raw) : null;
```

This is the right shape for "show a 'You have a draft from
yesterday — restore it?' banner" — instead of letting `restore()`
auto-apply, listen for `:before-restore`, call `preventDefault()`,
read the data from `e.detail.data`, render the banner, and only call
`form.lnAutosave.restore()` again if the user accepts. (`restore()`
reads localStorage afresh on each call.)

## Examples

### Minimal — drop in and forget

```html
<form id="contact" data-ln-autosave action="/contact" method="POST">
    <div class="form-element">
        <label for="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" required>
    </div>
    <div class="form-element">
        <label for="contact-message">Message</label>
        <textarea id="contact-message" name="message" required></textarea>
    </div>
    <ul class="form-actions">
        <li><button type="submit">Send</button></li>
    </ul>
</form>
```

User types "Hello, I have a quest…" then closes the tab. They come
back, the form is filled in. They submit, the localStorage entry
clears. Zero JS, zero coordinator wiring.

### Modal form with explicit cancel

```html
<button data-ln-modal-for="invoice-modal">New Invoice</button>

<div id="invoice-modal" class="ln-modal" data-ln-modal>
    <form id="invoice" data-ln-autosave action="/invoices" method="POST">
        <header>
            <h3>New Invoice</h3>
            <button type="button" aria-label="Close" data-ln-modal-close data-ln-autosave-clear>
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        <main>
            <div class="form-element">
                <label for="inv-client">Client</label>
                <input id="inv-client" name="client" type="text" required>
            </div>
            <div class="form-element">
                <label for="inv-amount">Amount</label>
                <input id="inv-amount" name="amount" type="number" required>
            </div>
        </main>
        <footer>
            <button type="button" data-ln-modal-close data-ln-autosave-clear>Cancel</button>
            <button type="submit">Create</button>
        </footer>
    </form>
</div>
```

Three exit paths, all wired:

- **X (close icon)** — closes modal, discards draft (both attributes).
- **Cancel button** — closes modal, discards draft (both attributes).
- **Create (submit)** — submits, native `submit` event clears draft.

If the user dismisses the modal via ESC (which `ln-modal` handles)
without clicking any of the above, the draft is NOT cleared — the
ESC-close path does not fire `submit`, `reset`, or click any
`[data-ln-autosave-clear]` button. The next time they open the
modal, the form will restore. Whether that is the right UX for "ESC
discards" depends on the project; if you want it, listen for the
modal's close event:

```js
modalEl.addEventListener('ln-modal:closed', function () {
    formEl.lnAutosave.clear();
});
```

### Cancel restore when the form has server data

The canonical edit-page pattern. The user opens
`/users/42/edit`; the server has rendered the form with the user's
current name, email, etc. If a stale autosave draft from a previous
session restores over the server values, the user sees inconsistent
state.

```html
<form id="edit-user" data-ln-autosave data-has-server-data="true" action="/users/42" method="POST">
    <input name="name" type="text" value="Maria"> <!-- server-rendered -->
    <input name="email" type="email" value="maria@example.com">
    <!-- ... -->
</form>
```

```js
document.addEventListener('ln-autosave:before-restore', function (e) {
    const form = e.detail.target;
    if (form.dataset.hasServerData === 'true') {
        e.preventDefault();              // do not apply the draft
        form.lnAutosave.clear();         // and discard it permanently
    }
});
```

The `data-has-server-data` attribute is a project convention, not an
ln-autosave feature. The listener inspects whatever signal the form
carries — could be `form.dataset.recordId`, could be a hidden input,
could be a `:has()` query for a non-empty value field — and decides
case-by-case.

A more nuanced version: the server data is the user's saved record,
but the user was actively editing in another tab and might want
their draft. Show a "Restore your unsaved changes?" banner instead of
silently picking one:

```js
document.addEventListener('ln-autosave:before-restore', function (e) {
    const form = e.detail.target;
    if (form.dataset.hasServerData !== 'true') return;

    e.preventDefault();
    showBanner({
        text: 'You have unsaved changes from a previous session.',
        accept: function () { form.lnAutosave.restore(); }, // re-runs, will not re-fire :before-restore? — see below
        discard: function () { form.lnAutosave.clear(); }
    });
});
```

Note that calling `form.lnAutosave.restore()` from inside the banner's
accept handler DOES re-fire the `:before-restore` listener, which
would loop forever if the listener's `if` always matches. Two ways
out: (1) remove the `data-has-server-data` flag before calling
`restore()`; (2) flip a flag on the form (`form.dataset.bannerAccepted = 'true'`)
and check it in the listener. The first is cleaner.

### Surface a "Draft saved" indicator

```html
<form id="long-post" data-ln-autosave>
    <!-- ... lots of fields ... -->
    <small id="autosave-status" aria-live="polite"></small>
    <ul class="form-actions">
        <li><button type="submit">Publish</button></li>
    </ul>
</form>
```

```js
const status = document.getElementById('autosave-status');
const form = document.getElementById('long-post');

form.addEventListener('ln-autosave:saved', function () {
    status.textContent = 'Draft saved at ' + new Date().toLocaleTimeString();
});

form.addEventListener('ln-autosave:cleared', function () {
    status.textContent = '';
});
```

`aria-live="polite"` means the announcement is non-interruptive — a
screen reader will announce "Draft saved at 14:32:11" at the next
quiet moment. This is the right setting for autosave (urgent
announcements would be `aria-live="assertive"` and would be wrong
here — saving is not interruption-worthy).

If you prefer a toast over an inline indicator:

```js
form.addEventListener('ln-autosave:saved', function () {
    window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
        detail: { type: 'info', message: 'Draft saved.', timeout: 1500 }
    }));
});
```

But this is noisy — a toast on every blur is more interruptive than
the silent default. The `aria-live` indicator is usually the right
choice; the toast is a sign you should reconsider.

### Wizard step that saves on Next

```html
<form id="wizard-step-1" data-ln-autosave="wizard">
    <fieldset>
        <legend>Step 1 — Basics</legend>
        <input name="company" type="text" required>
        <input name="contact" type="text" required>
    </fieldset>
    <button type="button" id="next-step">Next →</button>
</form>

<form id="wizard-step-2" data-ln-autosave="wizard" hidden>
    <fieldset>
        <legend>Step 2 — Address</legend>
        <input name="address" type="text">
        <input name="city" type="text">
    </fieldset>
    <button type="button" id="prev-step">← Back</button>
    <button type="submit">Submit</button>
</form>
```

Both forms share the storage key `ln-autosave:{path}:wizard`. Step 1
saves on `focusout`; step 2 reads the same key and pre-fills its own
fields (any field name not present in step 2 is silently ignored by
`populateForm`).

Note: this composition is fragile. If step 1 has a `name="address"`
input that step 2 also has, the two would overwrite each other when
the user backtracks. The right pattern for genuine multi-step
wizards is a single `<form>` with progressive disclosure (hide
sections, do not unmount), with per-step navigation that does not
unmount/remount the form. Use the shared-key trick only when the
form is genuinely the same form rendered in two places — see "Common
mistakes" item 4.

### Programmatic save before a custom navigation

```html
<form id="big-form" data-ln-autosave>
    <!-- ... -->
    <a href="/help/big-form-fields" id="help-link">Field reference</a>
    <button type="submit">Save</button>
</form>
```

The user is mid-typing and clicks the help link. The platform's
`focusout` will fire when focus leaves the input — most of the time
this is sufficient. But if the link is reached via keyboard (Tab to
link, Enter), the timing of `focusout` versus `click` versus link
navigation can race. Force a save explicitly:

```js
document.getElementById('help-link').addEventListener('click', function () {
    document.getElementById('big-form').lnAutosave.save();
});
```

The save is synchronous (localStorage), so by the time the click
handler returns and the browser navigates, the draft is on disk.

This is rarely necessary in practice — the `focusout` event fires
before navigation in every browser. It is documented here because
the question "do I need to call save() manually before navigation?"
comes up; the answer is "no, almost never."

### Custom serialisation for fields ln-autosave skips

`type="file"` is hard-skipped (you cannot put a file in
localStorage). But you might want to remember the *filename* a user
selected, so on restore you can show "Previously selected: report.pdf
— please re-attach":

```html
<form id="upload-form" data-ln-autosave>
    <input type="file" id="report" name="report">
    <input type="hidden" name="report_filename"> <!-- ln-autosave saves this -->
    <small id="report-hint"></small>
    <button type="submit">Submit</button>
</form>
```

```js
const form = document.getElementById('upload-form');
const file = document.getElementById('report');
const filenameField = form.querySelector('[name="report_filename"]');
const hint = document.getElementById('report-hint');

file.addEventListener('change', function () {
    filenameField.value = file.files[0] ? file.files[0].name : '';
});

form.addEventListener('ln-autosave:restored', function (e) {
    const name = e.detail.data.report_filename;
    if (name) hint.textContent = 'Previously selected: ' + name + ' — please re-attach.';
});
```

The hidden field is the part that ln-autosave saves and restores; the
real file input stays empty after restore (browser security
restriction). The hint tells the user what they had selected.

## Common mistakes

### Mistake 1 — Putting `data-ln-autosave` on a wrapper, not on the form

```html
<!-- WRONG — autosave does nothing here -->
<div data-ln-autosave="my-form">
    <form>
        <input name="name" type="text">
        <button type="submit">Save</button>
    </form>
</div>
```

The component's listeners are attached to the *autosaved element*,
not to a descendant form. The constructor calls
`form.addEventListener('focusout', ...)` (line 52), where `form` is
the element the attribute is on. If that element is a `<div>`,
`focusout` works fine (it bubbles), but `submit` and `reset` events
do NOT fire on divs — so the draft is never cleared on submit. The
serialisation also fails, because `serializeForm()` reads
`form.elements`, which is a collection only present on actual
`<form>` elements.

Always put `data-ln-autosave` on the `<form>` itself. The component
does not enforce this in the constructor (no `if (form.tagName !== 'FORM')`
check), but the platform contract requires it.

### Mistake 2 — Expecting `clear()` to reset the form

```js
// WRONG — clear() does NOT reset the form's visible values
form.lnAutosave.clear();
// Form fields still show their current values; only localStorage was wiped
```

`clear()` removes the localStorage entry, period. The form's `<input
value="...">`, `.checked`, etc. are untouched. If you want both:

```js
// RIGHT — clear localStorage AND reset the form
form.lnAutosave.clear();
form.reset();   // native form reset; also fires `reset` event
```

The order matters: calling `form.reset()` first triggers ln-autosave's
own `_onReset` listener, which calls `clear()` itself — so the
explicit `clear()` is redundant. The redundancy is fine (idempotent),
but the call order shown is the cleanest if you want to be explicit.

If you only want to wipe the draft without resetting the form (the
case the `[data-ln-autosave-clear]` attribute is designed for),
`clear()` alone is correct.

### Mistake 3 — Saving sensitive data and assuming localStorage is private

```html
<!-- WRONG — these fields will end up in plaintext localStorage -->
<form id="kyc" data-ln-autosave>
    <input name="ssn" type="text">
    <input name="account_number" type="text">
    <input name="passport_number" type="text">
    <button type="submit">Submit</button>
</form>
```

localStorage is plaintext, accessible to any script running on the
origin (XSS risk surface), persisted to disk, and visible in DevTools
to anyone with physical access to the machine. Saving sensitive
fields makes the user worse off than no autosave at all — they would
have re-typed the data, but now an XSS leak would expose it for as
long as it sat in the draft.

The right answer is to design these forms NOT to be autosaved. Drop
the `data-ln-autosave` attribute. If part of the form is safe and
part is sensitive, split into two forms (one autosaved, one not), or
filter sensitive fields before they hit localStorage:

```js
// Strip sensitive fields from the saved draft just before save
form.addEventListener('ln-autosave:saved', function (e) {
    const data = e.detail.data;
    delete data.ssn;
    delete data.passport_number;
    localStorage.setItem(form.lnAutosave.key, JSON.stringify(data));
});
```

The listener fires AFTER `setItem` has already run — so this rewrites
localStorage on every save. Slightly wasteful, but correct. A better
shape would be a "before-save" cancelable event; ln-autosave does not
ship one. If you need pre-save filtering, the cleanest workaround is
to put sensitive fields in a separate non-autosaved form.

### Mistake 4 — Two forms with the same key on the same page

```html
<!-- Two forms, same key — they share the draft -->
<form data-ln-autosave="user-data">
    <input name="email" type="email">
</form>

<form data-ln-autosave="user-data">
    <input name="email" type="email">
</form>
```

The storage key is `ln-autosave:{path}:user-data` for both. Each form
saves on its own `focusout` (the entire form, not just the changed
field), overwriting the other form's last-saved data. On restore,
both forms apply the same data — fine if the field schemas match
exactly; subtly broken if they diverge.

This is occasionally a real wizard pattern (two forms representing
the same record) but more often a copy-paste mistake. The fix is
either:

- **Distinct keys** — `data-ln-autosave="step1"` and
  `data-ln-autosave="step2"` so each step has its own draft.
- **One form** — collapse the two into a single form with
  show/hide for the per-step UI.

If you genuinely want shared state, the better tool is to manage the
draft in a coordinator that owns the form-shared state and writes
once per change, not in two ln-autosave instances racing each other.

### Mistake 5 — Long single-field forms (compose textareas) and the no-blur problem

```html
<form id="post" data-ln-autosave>
    <textarea name="body" required style="min-height: 600px;"></textarea>
    <button type="submit">Publish</button>
</form>
```

User types continuously into the textarea for 30 minutes. They never
blur the field (no Tab, no click outside). The browser crashes. The
draft was last saved... never — the constructor's restore ran on a
non-existent draft, the field has never `focusout`'d.

This is the genuine weak spot of the field-boundary save trigger.
For predominantly multi-field forms it is the right design; for
single-textarea editors it is the wrong design. Three options:

1. **Add a periodic save** — wire a `setInterval` that calls
   `form.lnAutosave.save()` every minute while the form has focus.
   ln-autosave does not ship this, but it is one line:

   ```js
   setInterval(function () {
       if (form.contains(document.activeElement)) form.lnAutosave.save();
   }, 60000);
   ```

2. **Save on `input` directly** — bypass ln-autosave's debounce-free
   save by listening for `input` and calling `save()`:

   ```js
   form.addEventListener('input', function () {
       form.lnAutosave.save();
   });
   ```

   Note: this writes localStorage on every keystroke, which is fine
   in modern browsers but wasteful. Prefer option 1 unless your
   "every keystroke" rate is expected to be low.

3. **Use a different tool entirely** — for compose-style editors,
   the right shape is usually a backend-side draft endpoint with
   conflict resolution; ln-autosave is a "your laptop closed" net,
   not a "rich-text editor backbone."

### Mistake 6 — Form schema changes between save and restore

You ship a form on Monday with `<input name="email_address">`. On
Wednesday you rename it to `<input name="email">` because the
backend changed. On Wednesday afternoon, every user who had a draft
from Monday opens the form. ln-autosave restores; `populateForm()`
walks the form's elements, finds `name="email"`, looks up
`data["email"]` — undefined (the saved key was `email_address`) —
skips the field. The user sees their other fields restored, but
"Email" is empty. The saved `email_address` value is stranded in
localStorage forever.

Two mitigations:

- **Migrate at restore time** — listen for `:before-restore`,
  rewrite known old key names to new ones in the data, then call
  `restore()` again with the patched data. There is no clean public
  API for "restore THIS data instead of localStorage's data," so
  the mitigation is to mutate `e.detail.data` in place (which
  ln-autosave then applies, because the restore continues after the
  listener returns):

  ```js
  document.addEventListener('ln-autosave:before-restore', function (e) {
      const data = e.detail.data;
      if (data.email_address && !data.email) {
          data.email = data.email_address;
          delete data.email_address;
      }
  });
  ```

  This works because `populateForm` is called AFTER the listener
  returns, on the same `data` reference. Mutating it has effect.

- **Schema-version the key** — bump the form's
  `data-ln-autosave="user-form-v2"` value when the schema changes.
  Old drafts under `user-form-v1` are no longer matched on restore;
  they sit in localStorage but never apply. This loses the user's
  work on the migration cycle, but produces no wrong-state.

### Mistake 7 — Confusing `ln-autosave` with `ln-store`

```html
<!-- WRONG — ln-store is for record cache, not form drafts -->
<form data-ln-store="users">
    <input name="email" type="email">
    <button type="submit">Save</button>
</form>
```

`ln-store` declares an IndexedDB-backed local cache for a record set
(see `js/ln-store/README.md`). It expects a record schema, sync
endpoints, and is consumed by renderers (`ln-data-table`). It has
nothing to do with form drafts. Putting `data-ln-store` on a form
does not save the form's draft anywhere; it tries to register a
store named after... whatever you put as the value, which fails
silently or breaks.

Form drafts → `ln-autosave` (localStorage, per-form, per-URL).
Record cache → `ln-store` (IndexedDB, per-table, application-wide).
Different layers, different lifecycles, different storage. See
`docs/architecture/data-flow.md` for the four-layer architecture.

### Mistake 8 — Expecting cross-tab sync

```
Tab A: types "Hello world" into a textarea, blurs the field
Tab B: same form, same URL, refreshes the page
```

Tab B reads localStorage on construction and applies "Hello world"
— this works. But:

```
Tab A: types more, blurs (saves "Hello world. More text.")
Tab B: already constructed; sitting on the form with "Hello world"
```

Tab B does NOT update. ln-autosave does not listen for the platform's
`storage` event (which fires on OTHER tabs when one tab writes). The
two tabs diverge until tab B refreshes.

If your application genuinely supports the same form open in two
tabs (collaborative editing? unlikely with autosave), the right
tool is `ln-store` with optimistic-write reconciliation. ln-autosave
is for the single-tab "my laptop closed" case.

If you want to add cross-tab sync to ln-autosave specifically:

```js
window.addEventListener('storage', function (e) {
    if (e.key === form.lnAutosave.key && e.newValue !== null) {
        form.lnAutosave.restore();
    }
});
```

This re-runs restore whenever another tab writes. Note that the
`:before-restore` listener fires on every cross-tab update, so wire
the restore-bypass logic carefully if you also have server-data
priority.

### Mistake 9 — Calling `restore()` and expecting it to be idempotent

```js
form.lnAutosave.restore();
form.lnAutosave.restore();   // re-applies the same data
```

Both calls run; both apply the same values; both dispatch
`:before-restore` and `:restored`. Validation listeners fire twice;
autoresize listeners fire twice. Nothing breaks (the values are the
same), but the events are not deduplicated.

This rarely matters in practice because `restore()` is only called
from the constructor (once per construction) and rarely manually.
If you do call it manually (e.g., the "show banner, ask, then
restore" pattern from earlier), be aware that the constructor
already ran `restore()` — your manual call is the second one.

To suppress the first restore (so you can apply your banner gate
first), wire your `:before-restore` listener BEFORE the bundle
loads, or set a flag on the form (`data-has-server-data`) before
construction.

## Related

- **`ln-form`** ([README](../ln-form/README.md)) — the AJAX-submit
  layer. Composes with ln-autosave via the platform's `submit` event:
  ln-form catches the submit, dispatches `ln-form:submit`; ln-autosave
  catches the same `submit` and clears the draft. Neither component
  references the other; the form's native event is the connector.
- **`ln-validate`** ([README](../ln-validate/README.md)) — field
  validity. The synthetic `input` / `change` events that ln-autosave
  dispatches on every restored field trigger ln-validate's input
  listener, so post-restore validation is correct without coordinator
  wiring.
- **`ln-autoresize`** ([README](../ln-autoresize/README.md)) —
  textarea height. Same propagation path as ln-validate; restored
  textareas grow to fit because the synthetic `input` event reaches
  the autoresize listener.
- **`ln-select`** (TomSelect wrapper) — the dead `lnSelect.setValue`
  branch in ln-autosave (line 97-99) is a non-functional vestige; the
  practical TomSelect integration is via the dispatched `change`
  event on the underlying `<select>`. See "What ln-autosave does NOT
  do" item about TomSelect.
- **`ln-store`** ([README](../ln-store/README.md)) — the IndexedDB
  record cache. Different layer entirely; does not coordinate with
  ln-autosave. See "Common mistakes" item 7.
- **`ln-modal`** ([README](../ln-modal/README.md)) — composes
  trivially: a `<form data-ln-autosave>` inside a modal works without
  wiring. The Cancel button typically combines `data-ln-modal-close`
  with `data-ln-autosave-clear` to close-and-discard.
- **`ln-toast`** — autosave events fire silently by default. To
  surface a "Draft saved" toast, listen for `ln-autosave:saved` and
  dispatch `ln-toast:enqueue` yourself. (Usually noisier than an
  inline `aria-live` indicator — see "Examples" → "Surface a 'Draft
  saved' indicator.")
- **`ln-core/persist.js`** — the localStorage helper used by
  `ln-filter`, `ln-tabs`, `ln-toggle` for UI state persistence. Uses
  the `ln:` prefix; ln-autosave uses `ln-autosave:` — the two cannot
  collide. See `js/ln-core/persist.js:10-11`.
- **`serializeForm` / `populateForm`** (`js/ln-core/helpers.js:226-282`)
  — the shared serialisation primitives. Used by ln-autosave AND
  ln-form; the consistent serialisation rules (skip files / submits /
  buttons / disabled / unnamed) come from here, not from each
  component independently.
- **Architecture deep-dive:** [`docs/js/autosave.md`](../../docs/js/autosave.md)
  for the construction flow, restore-event sequence, and the
  storage-key resolution mechanics.
- **Data-flow context:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — ln-autosave is NOT one of the four named layers (Data, Submit,
  Render, Validate). It is an orthogonal persistence layer that
  attaches to the Submit layer's `<form>` boundary. Drafts are NOT
  records; the four-layer model intentionally excludes them.
</content>
</invoke>