# ln-validate

> Per-field validity primitive. Wraps native `ValidityState`, gates
> rendering on first interaction (`_touched`), and surfaces the
> result via two CSS classes plus `ln-validate:valid` / `:invalid`
> events for `ln-form` to consume.

## Philosophy

The browser already validates. Every `<input>`, `<select>`, and
`<textarea>` ships a `ValidityState` object populated from native
constraints (`required`, `type="email"`, `minlength`, `pattern`,
`min`, `max`). What the platform does NOT ship is a UX — by default
an invalid field is silent until submit, at which point it pops a
system tooltip in OS chrome that cannot be styled, translated, or
kept on screen. ln-validate is the layer that decides **when to
listen, when to render, and how to surface the result** so the
form layer (`ln-form`'s submit gate, projects' visual styling,
analytics) can compose without ever calling validation logic
directly.

The component holds two pieces of state: `_touched` (a Boolean,
initially `false`, flipped on the field's first `input` or `change`)
and `_customErrors` (a `Set<String>` of active custom-error keys).
Native validity comes from `dom.checkValidity()` — the component
caches nothing. On every input/change, `_touched` flips and
`validate()` runs: it toggles `.ln-validate-valid` / `.ln-validate-invalid`
on the field, toggles `.hidden` on each `<li data-ln-validate-error>`
inside the field's `.form-element` wrapper, and dispatches
`ln-validate:valid` or `ln-validate:invalid`. Custom errors —
failures the platform cannot express (`emailTaken`, cross-field
mismatches, domain rules) — flow through the
`ln-validate:set-custom` / `ln-validate:clear-custom` event pair
and share the same `<ul>` as native errors without conflict. The
full mechanism (the discriminator, the asymmetric custom-error
path, the listener attachment) is in
[`docs/js/validate.md`](../../docs/js/validate.md).

## What state goes where

| Concern | Lives on | Owned by |
|---|---|---|
| Has the field been interacted with yet? | `_touched` (instance Boolean) | `ln-validate` |
| Native validity (required, email, pattern, range) | `dom.validity` / `dom.checkValidity()` | the browser |
| Active custom-error keys | `_customErrors` (instance `Set<String>`) | `ln-validate` |
| Currently valid? | `ln-validate-valid` class on input + `dom.checkValidity() && _customErrors.size === 0` | `ln-validate` |
| Currently invalid? | `ln-validate-invalid` class on input | `ln-validate` |
| Which error message is shown? | `.hidden` toggled on each `<li data-ln-validate-error>` inside `.form-element` | `ln-validate` |
| Submit-button enabled? | nothing on the validate instance — coordinated by `ln-form` | `ln-form` (consumes `:valid` / `:invalid`) |
| Server-side error attached to a field? | dispatched as `ln-validate:set-custom` by application code | application code (consumed by `ln-validate`) |
| Visual styling for invalid border / focus ring | `@mixin form-validate-invalid` reads the class | library SCSS (`scss/components/_form.scss`) |

The instance state is two fields total: `_touched` and
`_customErrors`. The DOM is the source of truth for the value; the
browser is the source of truth for validity; the component just
caches "have we started rendering yet?" and "which custom errors
are currently attached?"

## What `ln-validate` does NOT do

- **Does NOT define validation rules.** Required-ness, email-ness,
  pattern matching, range bounds — all of it comes from native HTML
  attributes. `data-ln-validate` is a participation marker, not a
  rule definition. If you want a field to require a value, write
  `required`. The component surfaces the platform's result.
- **Does NOT submit anything.** No `fetch`, no form submission, no
  network. Validation is purely local to the field. The submit
  gate lives in `ln-form` and consumes `ln-validate:valid` /
  `:invalid` to decide whether the submit button is enabled.
- **Does NOT show the browser's native bubble.** The library default
  CSS uses `.ln-validate-invalid`, not the `:invalid` pseudo-class,
  so untouched fields don't render errors. `lnForm.submit()`
  bypasses the native submit path entirely (it calls
  `instance.validate()` per field and dispatches `ln-form:submit`
  if all pass) — the OS tooltip path is not reachable through the
  documented flow.
- **Does NOT validate fields without `data-ln-validate`.** An
  unmarked field with `required` will have its native constraint
  honored if anything ever calls `checkValidity()` on it, but no
  class is added, no event fires, and `ln-form`'s submit gate
  ignores the field (the gate iterates `[data-ln-validate]` only).
  Mark the field if you want it surfaced. (Disabled and `display:
  none` fields receive listeners; per HTML spec, disabled fields
  are valid for `checkValidity()` purposes — remove `data-ln-validate`
  if you need a hidden field exempt.)
- **Does NOT consume server-side errors.** `ln-validate` provides
  the injection point — `ln-validate:set-custom` — for any code
  that detects a field-level failure (a 4xx response, a cross-field
  rule, a domain check). The translation from
  `{ field: [msg, ...] }` to a `set-custom` dispatch is consumer-
  side wiring; `ln-validate` does not subscribe to any outcome
  event from `ln-form` or `ln-store`. (Per project convention,
  `ln-form` only dispatches `ln-form:submit`; consumers dispatch
  their own success/error events.)
- **Does NOT dispatch on `set-custom` directly.** When a custom
  error arrives, `_onSetCustom` unhides the matching `<li>`,
  flips the CSS classes, and bumps `_touched` — but it does NOT
  call `validate()` and does NOT dispatch `:invalid`. If you need
  `ln-form`'s submit-button gate to re-evaluate after a custom
  error, call `instance.validate()` after dispatching
  `set-custom`. (`isValid` does account for `_customErrors.size`,
  so the manual call re-runs the dispatch path correctly.)
- **Does NOT set `aria-invalid`.** The component manages classes
  and `.hidden` toggles, not ARIA. If your accessibility audit
  requires `aria-invalid`, wire it on the consumer side via the
  `ln-validate:invalid` event.

### Cross-component coordination

`ln-validate` is the field-level primitive. Two sibling components
in the form layer compose with it via the platform event flow —
no imports, no direct method calls.

| Component | Coordination |
|---|---|
| `ln-form` | Listens for `ln-validate:valid` / `:invalid` bubbling from form descendants and re-evaluates submit-button state. On `lnForm.submit()`, force-validates every `[data-ln-validate]` field. On `lnForm.fill()` and `lnForm.reset()`, dispatches synthetic `input` / `change` on every field — ln-validate's own listeners catch them and mark each field touched. The `isChangeBased` discriminator (SELECT / checkbox / radio → `change`; everything else → `input`) is mirrored exactly across both files; a change to one is a change to all. |
| `ln-autosave` | None at the JS level — no imports, no event listeners between them. ln-autosave restores draft values via `populateForm()` and dispatches synthetic `input` (or `change` for SELECT/checkbox/radio) on every restored field. ln-validate's own listeners catch the bubbling events and run `validate()`. The user-perceived effect is "after restore, every restored field has correct validation state." Verify by grep: `js/ln-autosave/ln-autosave.js` has zero references to `ln-validate` or `lnValidate`. |

> **Note:** `ln-validate` does not subscribe to outcome events from
> any other component. The injection point for server-side errors
> is `ln-validate:set-custom`, dispatched by whatever consumer code
> detects the failure.

The pattern is consistent: `ln-validate` writes to the platform
(classes, `.hidden` toggles, custom events) and reads from the
platform (`input`, `change`, browser `validity`). Components that
compose with it do the same. None import each other.

## Markup anatomy

The minimum invocation is `data-ln-validate` on a field plus a
sibling error list:

```html
<div class="form-element">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required minlength="5" data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Email is required</li>
        <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
        <li class="hidden" data-ln-validate-error="tooShort">Must be at least 5 characters</li>
    </ul>
</div>
```

The validation rules — `required`, `type="email"`, `minlength="5"`
— are native HTML attributes. The `data-ln-validate` attribute
participates the field in the rendering and event system; it does
not encode rules. The `<ul data-ln-validate-errors>` is the error
list; each `<li>` carries `data-ln-validate-error="<key>"` matching
a `ValidityState` property name and starts hidden (via the
`.hidden` utility class). When the field fails the matching native
constraint, `validate()` removes the `.hidden` class on the
specific `<li>`; when it passes (or the field is valid overall),
the `.hidden` is re-applied.

### The field — `[data-ln-validate]`

The element with `data-ln-validate` is the field. The component
upgrades any `<input>`, `<select>`, or `<textarea>` carrying the
attribute. The presence of the attribute creates the instance; the
value is ignored.

```html
<!-- Text input — listens on 'input' and 'change' -->
<input type="text" name="title" required data-ln-validate>

<!-- Select — listens on 'change' only -->
<select name="role" required data-ln-validate>...</select>

<!-- Textarea — listens on 'input' and 'change' -->
<textarea name="bio" maxlength="500" data-ln-validate></textarea>

<!-- Checkbox / radio — listens on 'change' only -->
<input type="checkbox" name="agree" required data-ln-validate>
<input type="radio" name="role" value="admin" required data-ln-validate>
```

The discriminator is in the constructor:

```javascript
const isChangeBased = tag === 'SELECT' || type === 'checkbox' || type === 'radio';
```

For `isChangeBased` fields, only `change` is listened to. For
everything else, both `input` and `change` are wired so keystrokes
and paste events both fire validation. This same fork is mirrored
by `ln-form.fill()` and `ln-form.reset()` so programmatic value
writes route through the same listener — the `isChangeBased`
discriminator is mirrored in `ln-form` (fill/reset) and
`ln-autosave` (restore).

### The error list — `[data-ln-validate-errors]`

A sibling `<ul>` inside the same `.form-element` wrapper holds the
error messages. The component finds it via
`dom.closest('.form-element').querySelector('[data-ln-validate-errors]')`,
so the wrapper class **must be `.form-element`** — that string is
hardcoded in `ln-validate.js`.

Each `<li>` inside carries `data-ln-validate-error="<key>"` and
starts with `class="hidden"`. The component reads the key, looks
it up in the error map (see Error key mapping below), and toggles
`.hidden` based on whether the matching `validity` property is
true.

```html
<ul data-ln-validate-errors>
    <li class="hidden" data-ln-validate-error="required">Email is required</li>
    <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
    <li class="hidden" data-ln-validate-error="tooShort">Must be at least 5 characters</li>
    <li class="hidden" data-ln-validate-error="emailTaken">This email is already registered</li>
</ul>
```

The first three are native errors mapped from `ValidityState`. The
fourth (`emailTaken`) is a custom error — its key is NOT in the
`ERROR_MAP`, so `validate()` skips it. Custom errors are only
shown / hidden by the `_onSetCustom` / `_onClearCustom` paths, not
by the native validation loop. This separation is the architectural
hinge: native errors and custom errors live in the same `<ul>`
visually but flow through completely different code paths.

### The wrapper — `.form-element`

The component finds the error list relative to the closest
`.form-element` ancestor of the field. This is the structural
class (NOT a visual class — see HTML skill). The default form
SCSS targets `.form-element` for grid-column placement, label-input
spacing, and validation-error positioning.

```html
<div class="form-element">
    <label for="email">Email</label>
    <input id="email" name="email" data-ln-validate ...>
    <ul data-ln-validate-errors>...</ul>
</div>
```

If the field is not inside a `.form-element`, `dom.closest('.form-element')`
returns `null`, the error-list lookup short-circuits, and no errors
are ever rendered. The CSS classes on the input still toggle —
those are global on the input itself, not scoped to the wrapper —
so the field gets the red border but no message. This is a graceful
degradation, not a crash, but it almost certainly indicates a
missing wrapper.

## Error key mapping

The component ships with one map (`ln-validate.js:11-19`):

| `data-ln-validate-error` value | HTML constraint that triggers it | `ValidityState` property |
|---|---|---|
| `required` | `required` attribute on the field | `valueMissing` |
| `typeMismatch` | `type="email"`, `type="url"`, `type="number"`, `type="date"`, etc. — value doesn't match the type | `typeMismatch` |
| `tooShort` | `minlength="N"` — value is shorter than N characters | `tooShort` |
| `tooLong` | `maxlength="N"` — value is longer than N characters | `tooLong` |
| `patternMismatch` | `pattern="^...$"` — value doesn't match the regex | `patternMismatch` |
| `rangeUnderflow` | `min="N"` (numeric / date inputs) — value is below the min | `rangeUnderflow` |
| `rangeOverflow` | `max="N"` (numeric / date inputs) — value is above the max | `rangeOverflow` |

**Keys not in this map are treated as custom errors.** `validate()`
sees an unknown key, skips the toggle (`if (!validityProp) continue`),
and leaves the `<li>` in whatever state `_onSetCustom` /
`_onClearCustom` last set. This is what enables the dual-channel
pattern: one `<ul>` can hold both native errors (managed by the
validation loop) and custom errors (managed by the event handlers)
without conflict.

The native browser API has more `ValidityState` properties than
this map covers — `stepMismatch` (for `step="N"` violations) and
`badInput` (for malformed numeric input that the user typed) are
notable omissions. If you need them, extend the map in your project
fork or treat them as custom errors. The current map covers the
constraints used in production today.

## Visual feedback

Two CSS classes on the field, plus `.hidden` toggling on each
`<li data-ln-validate-error>`. The library default visual styling is applied to `.ln-validate-invalid`
and `.ln-validate-valid` by `@mixin form-validate-invalid` and
`@mixin form-validate-valid` (in `scss/config/mixins/_form.scss`,
applied via `scss/components/_form.scss`).

Project SCSS hooks the same classes for any project-specific
styling — the contract is the class names, not the default visuals.
A red border on `.ln-validate-invalid` is the library default; a
project that wants a left-edge accent or an icon prefix overrides
the mixin or applies its own selector.

The valid-state class (`ln-validate-valid`) is added to *every*
field that passes validation, including untouched ones if their
validation is forced (e.g. by `lnForm.submit()` calling
`instance.validate()` on every field). This is sometimes too
aggressive — a fresh form with optional fields will show green
borders on every empty optional field after the first user
interaction. If your project wants "show valid only on touched
fields," scope the mixin:

```scss
.form-element:has([data-ln-validate].ln-validate-valid:not(:placeholder-shown)) input {
    @include form-validate-valid;
}
```

…or override the default to render only the invalid state. The
component itself does not gate the valid-class application — that
is a CSS choice.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-validate` | `<input>`, `<select>`, `<textarea>` | Marks the field as participating in the validation system. Creates the instance, attaches `input` / `change` listeners. The value is ignored. | Presence creates the component. The validation rules come from native HTML attributes (`required`, `type`, `pattern`, etc.); this attribute is just the participation marker. |
| `data-ln-validate-errors` | `<ul>` | Identifies the error-message list. Must live inside the same `.form-element` wrapper as the field. | The component uses `closest('.form-element').querySelector('[data-ln-validate-errors]')` to find it. The marker decouples the error list from any specific selector. |
| `data-ln-validate-error="key"` | `<li>` inside `[data-ln-validate-errors]` | Identifies a specific error message. Key is either a `ValidityState` property name (mapped in `ERROR_MAP`) or a custom error name (managed by `set-custom` / `clear-custom`). | The dual-channel pattern: native and custom errors share the same list, distinguished only by whether the key is in the map. |

The `.hidden` class on each `<li>` is the toggle target — set by
default on every error item, removed by `validate()` (or
`_onSetCustom`) when the matching error is active, re-applied when
the error clears. The class definition lives in
`scss/utilities/_visibility.scss` (`.hidden { display: none; }`).

That is the entire attribute surface. `id`, `class`, `aria-*` on
the field are all standard HTML and not interpreted by the
component. The component does not write any attributes — only
classes (`ln-validate-valid` / `ln-validate-invalid` on the field,
`.hidden` on each error item).

## API

### Instance API — on the field element

After `[data-ln-validate]` initializes, the field carries an
`lnValidate` property pointing to its component instance.

```js
const input = document.getElementById('email');

input.lnValidate.validate();   // Force validate now — returns Boolean
input.lnValidate.reset();      // Clear _touched, hide all errors, remove classes
input.lnValidate.isValid;      // Boolean getter — checkValidity() && _customErrors.size === 0
input.lnValidate.destroy();    // Detach listeners, dispatch :destroyed, delete instance reference
```

| Method / property | Type | Description |
|---|---|---|
| `validate()` | method, returns Boolean | Force-runs the validation loop. Reads `dom.checkValidity()` and `_customErrors.size`. Toggles classes and error `<li>` visibility. Dispatches `ln-validate:valid` or `ln-validate:invalid`. Does NOT set `_touched` — call this on an untouched field and it renders errors immediately. |
| `reset()` | method | Sets `_touched = false`, clears `_customErrors`, removes both CSS classes from the field, hides every `<li data-ln-validate-error>` inside the wrapper. Does NOT dispatch `:valid` / `:invalid` — the field is "back to untouched," not "newly valid." |
| `isValid` | getter, Boolean | Reads `dom.checkValidity() && _customErrors.size === 0` live. Does NOT trigger a render or dispatch. Use this for "is this field currently valid?" outside of the event-driven flow. |
| `destroy()` | method | Removes input/change/set-custom/clear-custom listeners, removes both CSS classes, dispatches `ln-validate:destroyed`, deletes `dom.lnValidate`. Does NOT hide error `<li>` elements — those stay in their current state. The next time the field is upgraded (e.g. a fresh `data-ln-validate` attribute), a new instance starts clean. |
| `dom` | property | Back-reference to the field element. |
| `_touched` | property (Boolean) | Internal, but read by `ln-form._updateSubmitButton`. Underscore-prefixed by convention, not enforcement; do not write to it from consumer code. |
| `_customErrors` | property (Set) | Internal. Holds active custom-error keys. Do not write to directly — use `set-custom` / `clear-custom` events. |

### Programmatic value writes — dispatch the matching event

Setting `el.value = '...'` does NOT fire `input` or `change`, so
neither `ln-validate` nor `ln-form` reacts. After a programmatic
write, dispatch the matching event:

```js
input.value = 'hello@example.com';
const isChangeBased = input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'radio';
input.dispatchEvent(new Event(isChangeBased ? 'change' : 'input', { bubbles: true }));
```

Or use `lnForm.fill(data)` — it does the dispatch loop for you.

### Constructor — `window.lnValidate(root)`

Re-runs the upgrade scan over `root`. The shared
`MutationObserver` registered by `registerComponent` already covers
AJAX inserts (`innerHTML`, `appendChild`, `replaceChildren`) and
runtime `data-ln-validate` attribute additions, so call this
manually only when injecting markup into a Shadow DOM root or
another document context the observer cannot see.

```js
window.lnValidate(myShadowRoot);
window.lnValidate(myIframeDocument.body);
```

For ordinary AJAX inserts, the observer auto-initializes new fields
and you do not need this.

## Events

All events bubble. `ln-form` listens at the form level via
delegation; project code can listen at any level above the field.

### Events — emitted

| Event | Cancelable | `detail` | Dispatched when |
|---|---|---|---|
| `ln-validate:valid` | no | `{ target: HTMLElement, field: String }` | After `validate()` determines the field is valid (native check passes AND no custom errors active). Fires every time `validate()` is called and the field is valid — including on every keystroke that keeps the field valid. |
| `ln-validate:invalid` | no | `{ target: HTMLElement, field: String }` | After `validate()` determines the field is invalid. Fires every time `validate()` is called and the field is invalid — including on every keystroke that keeps it invalid. |
| `ln-validate:destroyed` | no | `{ target: HTMLElement }` | After `destroy()` detaches listeners and removes the instance reference. |

`detail.target` is the field element. `detail.field` is
`dom.name` — the value of the `name` attribute, exposed for
consumers that want to key per-field state (server errors,
progress indicators) without re-querying the DOM. A field
without `name` dispatches `field: ""`; consumers that key by
field name will collapse every nameless field into a single
bucket — name your fields.

The events are NOT throttled. A user typing into a `tooShort`
field will receive `:invalid` on every keystroke until the length
threshold is met. This is intentional — the events are cheap and
consumers (notably `ln-form._updateSubmitButton`) need to react in
real time.

### Events — received

| Event | `detail` | Behavior |
|---|---|---|
| `ln-validate:set-custom` | `{ error: String }` | Adds `error` to `_customErrors`, sets `_touched = true`, unhides the matching `<li data-ln-validate-error="<error>">` inside `.form-element`, adds `ln-validate-invalid` and removes `ln-validate-valid` on the field. Does NOT call `validate()`, does NOT dispatch `:invalid`. The field's "I have errors" state is internal-only until something else calls `validate()`. |
| `ln-validate:clear-custom` | `{ error: String }` (clear one) or `{}` (clear all) | If `error` is provided: removes it from `_customErrors`, hides the matching `<li>`. If no `error`: clears every key from `_customErrors`, hides every custom `<li>` (the ones whose keys are NOT in `ERROR_MAP`). After clearing, if `_touched`, calls `validate()` to re-render the native-error state and dispatch `:valid` / `:invalid` accordingly. |

The asymmetry is intentional. `set-custom` is opportunistic — the
caller already knows the field is invalid (they detected the
problem and dispatched the event), so re-running `validate()` and
dispatching `:invalid` would be redundant noise. `clear-custom`
must call `validate()` because removing one custom error might
leave other custom errors active, native errors active, or none of
the above — only a fresh `validate()` can determine the new
state and emit the right event.

```js
// Dispatch from anywhere — application code that detected the failure
const input = document.getElementById('email');
input.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
    bubbles: true,
    detail: { error: 'emailTaken' }
}));

// Clear one specific custom error
input.dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
    bubbles: true,
    detail: { error: 'emailTaken' }
}));

// Clear ALL custom errors at once
input.dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
    bubbles: true,
    detail: {}
}));
```

## Validation lifecycle

The state graph for one field, end to end:

```
                 ┌────────────────────────────────────────────┐
                 │                                            │
   user types  ──┤  fires 'input' (or 'change' for SELECT/    │
                 │  checkbox/radio)                           │
   ln-form.fill ─┤  fires synthetic 'input' / 'change'         │
   ln-form.reset ┤  fires synthetic 'input' / 'change'         │
   ln-autosave ──┤  fires synthetic 'input' / 'change'         │
                 │                                            │
                 └─────────────────┬──────────────────────────┘
                                   │
                                   ▼
                  _onInput / _onChange:
                    _touched = true
                    validate()
                                   │
                                   ▼
                  validate():
                    nativeValid = dom.checkValidity()
                    isValid = nativeValid && _customErrors.size === 0
                                   │
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
       isValid = true                     isValid = false
                  │                                 │
                  ▼                                 ▼
       ┌─────────────────────────┐  ┌──────────────────────────────┐
       │ For each [data-ln-      │  │ For each [data-ln-           │
       │   validate-error] in    │  │   validate-error] in         │
       │   .form-element:        │  │   .form-element:             │
       │   if key in ERROR_MAP:  │  │   if key in ERROR_MAP:       │
       │     hide (validity[k]   │  │     show / hide based on     │
       │     is false)           │  │     validity[mapped key]     │
       │   else: skip (custom)   │  │   else: skip (custom — left  │
       │                         │  │     in current state)        │
       │ Add .ln-validate-valid  │  │ Add .ln-validate-invalid     │
       │ Remove .ln-validate-    │  │ Remove .ln-validate-valid    │
       │   invalid               │  │                              │
       │ Dispatch :valid         │  │ Dispatch :invalid            │
       └─────────────────────────┘  └──────────────────────────────┘
```

The custom-error path runs in parallel — see
[`docs/js/validate.md` § The custom-error path](../../docs/js/validate.md#the-custom-error-path).

## Examples

### Basic — text input with native rules

```html
<div class="form-element">
    <label for="name">Full Name</label>
    <input type="text" id="name" name="name" required minlength="3" data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Name is required</li>
        <li class="hidden" data-ln-validate-error="tooShort">Must be at least 3 characters</li>
    </ul>
</div>
```

Untouched: silent. First keystroke: `_touched = true`, `validate()`
runs, the `required` `<li>` unhides if empty / the `tooShort` `<li>`
unhides if shorter than 3 chars / both hide once valid. Field
border: red while invalid, green while valid (per library default
mixins).

### Email + minlength — multiple native errors

```html
<div class="form-element">
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" required minlength="5" data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Email is required</li>
        <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
        <li class="hidden" data-ln-validate-error="tooShort">Must be at least 5 characters</li>
    </ul>
</div>
```

The browser only flips ONE `validity` flag at a time — typically the most specific failure. Each `<li>` toggles independently; in practice browsers return one flag per call.

### Select — change-based listener only

```html
<div class="form-element">
    <label for="role">Role</label>
    <select id="role" name="role" required data-ln-validate>
        <option value="">Select...</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
    </select>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Please select a role</li>
    </ul>
</div>
```

Selects are `isChangeBased = true`, so only `change` is listened
to. The user clicks the select, picks an option, `change` fires,
`_touched = true`, `validate()` runs. If the empty option is
selected, `required` triggers; otherwise valid.

### Custom error — server-side validation

```html
<div class="form-element">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Email is required</li>
        <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
        <li class="hidden" data-ln-validate-error="emailTaken">This email is already registered</li>
    </ul>
</div>
```

```js
// After a server response indicates the email is already taken:
document.getElementById('email').dispatchEvent(new CustomEvent('ln-validate:set-custom', {
    bubbles: true,
    detail: { error: 'emailTaken' }
}));

// When the user types a new value (or you re-validate against the server):
document.getElementById('email').dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
    bubbles: true,
    detail: { error: 'emailTaken' }
}));
```

The `emailTaken` `<li>` is invisible to the native validation loop
(its key is not in `ERROR_MAP`). It only appears when `set-custom`
unhides it; it only disappears when `clear-custom` hides it.

### Cross-field custom — password confirmation

```html
<form id="register-form" data-ln-form>
    <div class="form-element">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="8" data-ln-validate>
        <ul data-ln-validate-errors>
            <li class="hidden" data-ln-validate-error="required">Password is required</li>
            <li class="hidden" data-ln-validate-error="tooShort">Must be at least 8 characters</li>
        </ul>
    </div>
    <div class="form-element">
        <label for="password-confirm">Confirm Password</label>
        <input type="password" id="password-confirm" name="password_confirmation" required data-ln-validate>
        <ul data-ln-validate-errors>
            <li class="hidden" data-ln-validate-error="required">Confirmation is required</li>
            <li class="hidden" data-ln-validate-error="passwordMismatch">Passwords do not match</li>
        </ul>
    </div>
</form>
```

```js
const pass = document.getElementById('password');
const confirm = document.getElementById('password-confirm');

const evaluate = function () {
    if (pass.value !== '' && confirm.value !== '' && pass.value !== confirm.value) {
        confirm.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
            bubbles: true, detail: { error: 'passwordMismatch' }
        }));
    } else {
        confirm.dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
            bubbles: true, detail: { error: 'passwordMismatch' }
        }));
    }
};

pass.addEventListener('input', evaluate);
confirm.addEventListener('input', evaluate);
```

`passwordMismatch` is not in `ERROR_MAP` — it is a custom error
toggled by the cross-field comparator. `ln-validate` treats the
`<li>` exactly like any other custom-error item.

### Server-side errors via the form layer

```js
// The consumer's submit handler — fire the request and translate
// 4xx field errors into ln-validate:set-custom dispatches.
form.addEventListener('ln-form:submit', async function (e) {
    const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(e.detail.data)
    });
    if (res.status === 422) {
        const { errors } = await res.json();   // { fieldName: ['msg', ...], ... }
        Object.keys(errors).forEach(function (fieldName) {
            const field = form.querySelector('[name="' + fieldName + '"]');
            if (!field) return;
            field.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
                bubbles: true,
                detail: { error: 'server' }
            }));
        });
    }
});
```

Each field carries an `<li data-ln-validate-error="server">`
with the message text either pre-rendered or filled in by the
same handler (e.g. `li.textContent = errors[fieldName].join('. ')`).
`ln-form` dispatches `ln-form:submit` with serialized data — it
does NOT dispatch outcome events. The translation of the server
response into per-field errors is consumer-side wiring.

### Composing with `ln-form` and `ln-autosave`

```html
<form id="edit-user" data-ln-form data-ln-autosave action="/api/users/42" method="PUT">
    <div class="form-element">
        <label for="name">Name</label>
        <input id="name" name="name" required minlength="2" data-ln-validate>
        <ul data-ln-validate-errors>
            <li class="hidden" data-ln-validate-error="required">Name is required</li>
            <li class="hidden" data-ln-validate-error="tooShort">Must be at least 2 characters</li>
        </ul>
    </div>
    <div class="form-element">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required data-ln-validate>
        <ul data-ln-validate-errors>
            <li class="hidden" data-ln-validate-error="required">Email is required</li>
            <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
        </ul>
    </div>
    <div class="form-actions">
        <button type="submit">Save</button>
    </div>
</form>
```

What happens, all via the platform event flow: ln-autosave
restores any draft on init by dispatching synthetic input/change;
ln-validate's listeners react and validate the restored values;
`ln-form._updateSubmitButton` re-evaluates from the bubbled
events. Every keystroke runs the same path. `lnForm.submit()`
force-validates and dispatches `ln-form:submit`; `lnForm.reset()`
clears values then resets validation state per field.

Zero glue code. The components share no imports. The DOM is the
wiring.

## Installation & Loading

The component can be integrated in one of two ways:

### 1. In-Bundle (Standard Integration)
To use `ln-validate` as part of the unified `ln-ashlar` library, load the main compiled IIFE bundle in your document:

```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

### 2. Standalone (Zero-Dependency IIFE)
If you only need validation capabilities without loading the entire library, import the standalone compiled script directly:

```html
<script src="js/ln-validate/ln-validate.js" defer></script>
```

### Source Files
For development, extending rules, or troubleshooting, refer to these local files:
- **Active Development (Source Code)**: [js/ln-validate/src/ln-validate.js](file:///c:/laragon/www/ln-ashlar/js/ln-validate/src/ln-validate.js)
- **Compiled Standalone (Distribution)**: [js/ln-validate/ln-validate.js](file:///c:/laragon/www/ln-ashlar/js/ln-validate/ln-validate.js)

## Related

- **[`ln-form`](../ln-form/README.md)** — the form-level coordinator
  that consumes `ln-validate:valid` / `:invalid` for submit-button
  gating and force-validates every field on `lnForm.submit()`.
- **[`ln-autosave`](../ln-autosave/README.md)** — restores draft
  values and dispatches synthetic input/change; ln-validate reacts
  via the platform event flow with no direct integration.
- **[`ln-confirm`](../ln-confirm/README.md)** — gates destructive
  button clicks; independent of ln-validate.
- **`@mixin form-validate-invalid`** (`scss/config/mixins/_form.scss`)
  — red border + focus ring for `.ln-validate-invalid`.
- **`@mixin form-validate-valid`** (`scss/config/mixins/_form.scss`)
  — green border + focus ring for `.ln-validate-valid`.
- **`@mixin form-validate-errors`** (`scss/config/mixins/_form.scss`)
  — error-list typography (caption size, error color).
- **Architecture deep-dive:** [`docs/js/validate.md`](../../docs/js/validate.md)
  for component internals, the `_touched` lifecycle, the
  custom-error path, and the validate-vs-set-custom dispatch
  asymmetry.
- **Form-layer architecture:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — `ln-validate` is the validate layer (§3.4).
- **Native ValidityState API:** [MDN — ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
  for the full list of validity properties (including `stepMismatch`
  and `badInput`, which are NOT in `ERROR_MAP` — extend it if
  needed).
