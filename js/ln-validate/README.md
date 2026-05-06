# ln-validate

> Per-field validation primitive for the form layer. 160 lines of JS
> that wrap the native `ValidityState` API, expose its state through
> two CSS classes and a pair of events, and add one strictly-typed
> escape hatch (`set-custom` / `clear-custom`) for errors the
> browser cannot express. The component does not run validation
> rules; the browser already does that. The component decides **when
> to listen, when to render, and how to surface the result** so the
> rest of the form layer (`ln-form`'s submit gate, `ln-autosave`'s
> restore flow, `ln-form.reset()`'s cleanup loop) can compose without
> ever calling validation logic directly.

## Philosophy

A field's validity is not something `ln-validate` invents. The
browser ships a `ValidityState` object on every `<input>`,
`<select>`, and `<textarea>`, populated from the element's native
constraints — `required`, `type="email"`, `minlength`, `maxlength`,
`pattern`, `min`, `max`. `dom.checkValidity()` returns the boolean.
`dom.validity.valueMissing`, `.typeMismatch`, `.tooShort`, etc.
expose the individual reasons. This is not a polyfill or a parallel
universe; it is the platform's first-class validation API and it
has been on every modern browser for a decade.

What the platform does NOT ship is a UX. By default, an invalid
field is silent until the form is submitted, at which point the
browser pops a system tooltip in OS chrome ("Please fill in this
field") that cannot be styled, translated to project tone, or kept
on screen. That tooltip is the reason every serious project ends up
writing its own validation layer.

`ln-validate` is that layer, kept small. Its job is three things:

1. **Decide when to listen.** Text inputs validate on `input` (every
   keystroke) so errors appear and clear in real time. SELECT,
   checkbox, and radio fields validate on `change` (selection
   commit). The discriminator is one line —
   `tag === 'SELECT' || type === 'checkbox' || type === 'radio'` —
   and it is mirrored exactly in `ln-form.fill()` and
   `ln-form.reset()` so programmatic value writes go through the
   same fork.
2. **Decide when to render.** The component holds a `_touched`
   boolean, initially `false`. Until the field has fired its first
   `input` or `change`, validation runs silently and renders nothing
   — no error pills, no red border, no aria flag. This is the
   single most consequential UX decision in the file. Without it,
   every page load would render a wall of "this field is required"
   messages on every empty form. With it, errors appear only after
   the user has actually engaged with the field.
3. **Surface the result through a fixed contract.** Two CSS classes
   on the input (`ln-validate-valid`, `ln-validate-invalid`), one
   `.hidden` class toggled on each `<li data-ln-validate-error>`
   inside the field's `.form-element` wrapper, and one event per
   transition (`ln-validate:valid` or `ln-validate:invalid`). That
   surface is what `ln-form` consumes for its submit-button gate
   and what project CSS hooks into for visual feedback. Nothing
   else leaks.

The custom-error escape hatch — `ln-validate:set-custom` /
`ln-validate:clear-custom` — exists because some failures are not
expressible as native constraints. "Username already taken" is a
server check. "Passwords do not match" is a cross-field check. "API
quota exceeded for this category" is a domain rule. All three need
to render a red field with a specific error message, and none of
them have an HTML attribute. The custom-error path attaches a
named error to the field's instance, marks it touched and invalid,
and unhides the matching `<li data-ln-validate-error="<name>">`.
The visible result is identical to a native error; the architectural
result is that the application code that detects the failure
dispatches one event and walks away. No DOM digging, no class
juggling.

That is the whole component. Read on for the contracts the rest of
the form layer relies on.

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
| Visual styling for invalid border / focus ring | `@mixin form-validate-invalid` reads the class | library SCSS (`scss/components/_form.scss:71`) |

The instance state is two fields total: `_touched` and
`_customErrors`. The DOM is the source of truth for the value; the
browser is the source of truth for validity; the component just
caches "have we started rendering yet?" and "which custom errors
are currently attached?"

## What `ln-validate` does NOT do

- **Does NOT define validation rules.** Required-ness, email-ness,
  pattern matching, range bounds — all of it comes from native HTML
  attributes. `data-ln-validate` is a *participation marker*, not a
  rule definition. If you want a field to require a value, write
  `required`. If you want it to be an email, write `type="email"`.
  The component does not invent rules; it surfaces the platform's
  result.
- **Does NOT submit anything.** No `fetch`, no form submission, no
  network. Validation is purely local to the field. The submit gate
  lives in `ln-form` and consumes `ln-validate:valid` / `:invalid`
  events to decide whether the submit button is enabled — see
  Cross-component coordination below.
- **Does NOT normalize values.** No trimming, no lowercase, no date
  parsing. The value the user typed is the value the browser
  validates. If your business logic needs a normalized form, do it
  on serialize (after `ln-form:submit`) or on the server.
- **Does NOT auto-fix.** When a field becomes invalid, the user
  sees the error; they fix it. No auto-pad, no auto-format, no
  silent value rewrite.
- **Does NOT show the browser's native bubble.** The library's
  global form CSS sets `:invalid` styling and the component's
  `.ln-validate-invalid` class adds the red border, but the native
  OS tooltip from `<input required>` would still pop on
  `form.submit()`. `ln-form.submit()` does NOT call the form's
  native submit — it calls `instance.validate()` on every field
  itself, then dispatches `ln-form:submit` if all return true. The
  native bubble path is bypassed entirely. (If you call
  `form.submit()` directly without going through `lnForm.submit()`,
  the native bubble appears. Don't.)
- **Does NOT validate fields without `data-ln-validate`.** An
  unmarked field with `required` will have its native constraint
  honored by `dom.checkValidity()` if anything ever calls it, but
  no `ln-validate-invalid` class is added, no error `<li>` is
  toggled, no event is dispatched, and `ln-form`'s submit gate
  ignores the field entirely (the gate iterates
  `[data-ln-validate]` only). Mark the field if you want it
  surfaced.
- **Does NOT skip disabled or hidden fields explicitly.** The
  component adds `input` / `change` listeners regardless of the
  field's disabled or visibility state. The platform handles
  disabled gracefully — `dom.checkValidity()` returns `true` for
  disabled fields per the HTML spec, so a disabled `[required]`
  field is "valid" for native purposes and never surfaces errors.
  A field hidden via `display: none` still receives synthetic
  events (e.g. from `ln-form.fill()`) and validates as normal —
  `display: none` does NOT exempt the field from
  `checkValidity()`. If you need a hidden field to be exempt,
  remove its `required` attribute or do not mark it with
  `data-ln-validate`.
- **Does NOT consume `ln-form:error`.** Server-side validation
  errors (the 4xx response from a POST / PUT) are a coordination
  point between the data layer and the form layer — `ln-store`
  dispatches `ln-form:error` on the form element, and the wiring
  that translates each `{ field: [msg, ...] }` entry into a
  `ln-validate:set-custom` dispatch is the application's
  responsibility today (or, in Phase A of the architecture
  roadmap, the form's coordinator). `ln-validate` provides the
  injection point — `set-custom` — but does not subscribe to
  `ln-form:error` directly. See
  [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  §6.2 for the contract.
- **Does NOT dispatch on `set-custom` directly.** When a custom
  error arrives, `_onSetCustom` unhides the matching `<li>`,
  flips the CSS classes, and bumps `_touched` — but it does NOT
  call `validate()` and does NOT dispatch `ln-validate:invalid`.
  The custom flag is purely visible-state. `ln-form`'s submit-
  button gate listens for the bubbled `:invalid` event to
  re-evaluate and therefore does not learn about a custom error
  attached out-of-band; the consumer that dispatched
  `set-custom` is responsible for deciding whether to also block
  submission. (`isValid` does account for `_customErrors.size`,
  so a manual call to `instance.validate()` afterwards re-runs
  the dispatch path and `ln-form` picks it up.)
- **Does NOT debounce.** Every keystroke triggers `validate()`
  for non-change-based fields. The work is local — `checkValidity()`
  is microsecond-fast, the DOM operations touch only the field's
  own `.form-element` subtree. Debouncing would only delay the
  user's feedback and is not warranted.
- **Does NOT set `aria-invalid`.** The component manages classes
  and `.hidden` toggles, not ARIA. The browser's native
  `:invalid` pseudo-class is also not consumed — see "Common
  mistakes" item 6. If your accessibility audit requires
  `aria-invalid`, wire it on the consumer side via the
  `ln-validate:invalid` event.

### Cross-component coordination

`ln-validate` is the field-level primitive. Three sibling
components in the form layer all interact with it via the
platform's event flow — no imports, no direct method calls.

| Component | Coordination | Verified at |
|---|---|---|
| `ln-form` | `ln-form` listens for `ln-validate:valid` / `:invalid` bubbling from the form's descendants. Each event triggers `_updateSubmitButton()`, which re-queries every `[data-ln-validate]` field and reads `instance._touched` + `field.checkValidity()` to compute `anyInvalid \|\| !anyTouched`, then toggles `disabled` on every submit button. The bubbled events are the trigger; `checkValidity()` is the source of truth — ln-form holds no internal index of invalid fields. On `lnForm.submit()`, it iterates every `[data-ln-validate]` field and calls `instance.validate()` directly — this is the force-validate gate that catches untouched required fields. On `lnForm.reset()`, it dispatches synthetic `input` / `change` on every form field FIRST (which `ln-validate` interprets as a real interaction and validates, transiently marking default-empty required fields as invalid), THEN calls `instance.reset()` on every validate instance to clear the transient state. Order matters and is documented in `ln-form.js:142-146`. | `js/ln-form/ln-form.js:49-50` (event listeners), `:78-100` (`_updateSubmitButton` reads `instance._touched`), `:115-131` (`submit` calls `instance.validate()`), `:133-160` (`reset` dispatches input/change before `_resetValidation`) |
| `ln-autosave` | None at the JS level — no imports, no event listeners between them. ln-autosave restores draft values via `populateForm()` and dispatches synthetic `input` (or `change` for SELECT/checkbox/radio) on every restored field. Those bubbling events are caught by `ln-validate`'s own `input` / `change` listeners, which set `_touched = true` and run `validate()`. The user-perceived effect is "after restore, every restored field has correct validation state" — but the wiring is the platform event flow, not custom integration. Verify by grep: `js/ln-autosave/ln-autosave.js` has zero references to `ln-validate` or `lnValidate`. | `js/ln-validate/ln-validate.js:82-85` (input/change listeners); `js/ln-autosave/ln-autosave.js:94-95` (synthetic dispatch — same fork as ln-validate's `isChangeBased`) |
| `ln-confirm` | Independent. ln-confirm gates the first click on a destructive button (form submit or non-form click); ln-validate operates on form fields. There is no overlap in the elements they touch, no event channel they share. A `<form data-ln-form>` with a `<button type="submit" data-ln-confirm="...">` and `<input data-ln-validate>` works because the click flow is sequential: ln-confirm first (gate the click), then native `submit` event (only on second click), then ln-form's submit handler (which iterates and validates fields). | grep — zero cross-references between `js/ln-confirm/` and `js/ln-validate/`; `js/ln-form/README.md` Examples section |
| `ln-toggle` / `ln-toggle-switch` | Independent. Toggle owns open/close; toggle-switch owns a checkbox's checked state for the form layer. A `<input type="checkbox" data-ln-toggle-switch data-ln-validate required>` would validate as normal — the validate component's `change` listener catches the toggle-switch's commit. | grep — zero cross-references |
| `ln-store` (data layer) | None directly. ln-store's pipeline dispatches `ln-form:error` on the form element when the server returns a 4xx during initial submit. ln-validate does NOT subscribe to that event. The wiring that translates `{ errors: { field: [msg, ...] } }` into `ln-validate:set-custom` dispatches is the consumer's responsibility (Phase A roadmap moves it to a coordinator hook). The injection point — `ln-validate:set-custom` — is the contract; the producer is whatever code knows about server-side validation. | `docs/architecture/data-flow.md` §6.2; `js/ln-validate/ln-validate.js:86-87` (set-custom listener) |
| `ln-autoresize` | Indirectly. Both are field-level primitives that listen to the platform `input` event. They do not coordinate — they happen to react to the same trigger. A `<textarea data-ln-validate data-ln-autoresize required>` resizes and validates on every keystroke, in whichever order their listeners were attached (typically autoresize first because it registers earlier in `js/index.js`'s import order, but neither relies on order). | grep — zero cross-references |

The pattern is consistent: `ln-validate` writes to the platform
(classes, `.hidden` toggles, custom events) and reads from the
platform (`input`, `change`, browser `validity`). Other components
that compose with it do the same. None of them import each other.

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
writes route through the same listener — see
`js/ln-form/ln-form.js:108-112` and `:147-152`.

### The error list — `[data-ln-validate-errors]`

A sibling `<ul>` inside the same `.form-element` wrapper holds the
error messages. The component finds it via
`dom.closest('.form-element').querySelector('[data-ln-validate-errors]')`,
so the wrapper class **must be `.form-element`** — that string is
hardcoded in `ln-validate.js:50, 99`. (See "Common mistakes" item
1 for what happens if you skip the wrapper.)

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
`ERROR_MAP`, so `validate()` skips it (the `if (!validityProp)
continue` guard at `ln-validate.js:107`). Custom errors are only
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
`<li data-ln-validate-error>`. The library default styling lives
in `scss/components/_form.scss:71-77`, hooked via mixins in
`scss/config/mixins/_form.scss:450-475`:

```scss
@mixin form-validate-invalid {
    border-color: hsl(var(--color-error));
    &:focus-visible {
        border-color: hsl(var(--color-error));
        box-shadow: 0 0 0 3px hsl(var(--color-error) / 0.15);
    }
}

@mixin form-validate-valid {
    border-color: hsl(var(--color-success));
    &:focus-visible {
        border-color: hsl(var(--color-success));
        box-shadow: 0 0 0 3px hsl(var(--color-success) / 0.15);
    }
}

@mixin form-validate-errors {
    --margin-block: var(--size-xs);
    margin-top: var(--margin-block);
    font-size: var(--text-caption);
    line-height: var(--lh-caption);
    color: hsl(var(--color-error));
}
```

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

There is a parallel path for custom errors. `set-custom` writes
the visible state directly (unhide `<li>`, add invalid class,
mark touched) without going through `validate()`. `clear-custom`
hides the `<li>` directly, then re-runs `validate()` if
`_touched` is true. The two paths interleave in the same DOM
without conflict because they target different `<li>` elements
(native keys vs custom keys), and the CSS class on the field is
a single state — whichever path last set it, wins, until the next
`validate()` recomputes from `dom.checkValidity() && _customErrors.size`.

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

The browser only flips ONE `validity` flag at a time — typically
the most specific failure. An empty `required` field shows
`valueMissing`; a non-empty malformed input shows `typeMismatch`;
a short malformed input shows `tooShort`. Each `<li>` toggles
independently based on its mapped property, so multiple can be
visible at once if multiple flags are set. In practice, browsers
return one flag per call.

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

### Server-side errors via the form layer — Phase A pattern

```js
// In the form's coordinator, listen for ln-form:error from ln-store:
form.addEventListener('ln-form:error', function (e) {
    const errors = e.detail.errors;  // { fieldName: ['msg', 'msg'], ... }
    Object.keys(errors).forEach(function (fieldName) {
        const field = form.querySelector('[name="' + fieldName + '"]');
        if (!field) return;
        // Use the first message as the custom-error key (or a stable name like 'server')
        // and ensure the corresponding <li data-ln-validate-error> exists in the field's wrapper.
        field.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
            bubbles: true, detail: { error: 'server' }
        }));
    });
});
```

The `<li data-ln-validate-error="server">` `<li>` should exist in
each field's wrapper, with the message text either pre-rendered or
filled in by the same coordinator (e.g. setting
`li.textContent = errors[fieldName].join('. ')`). The architecture
roadmap (`docs/architecture/data-flow.md` §6.2) anticipates moving
this wiring into a stable form-coordinator hook — until then, the
consumer wires it.

### Programmatic — force-validate on demand

```js
// Force-validate every field in a form (skip the native bubble path)
document.querySelectorAll('#my-form [data-ln-validate]').forEach(function (input) {
    input.lnValidate.validate();
});
```

This is what `ln-form.submit()` does internally — see
`js/ln-form/ln-form.js:115-131`. It iterates every
`[data-ln-validate]` field, calls `instance.validate()`, and
dispatches `ln-form:submit` only if every call returned `true`.
Untouched fields render errors after the force-validate.

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

What happens — entirely via the platform event flow:

1. **Page load** — `ln-form`, `ln-autosave`, `ln-validate` all
   upgrade. ln-autosave restores any draft from `localStorage` by
   calling `populateForm()` and dispatching synthetic `input` /
   `change` on every restored field. Each `ln-validate` instance's
   `_onInput` / `_onChange` fires, `_touched = true`, `validate()`
   runs, errors and CSS classes appear on whatever fields the
   restored draft left invalid. ln-form's `_updateSubmitButton`
   (registered as a listener on `:valid` / `:invalid`) re-runs and
   sets the Save button's `disabled` based on the restored state.
2. **User edits** — every keystroke fires `input`,
   `ln-validate.validate()` runs and dispatches `:valid` /
   `:invalid` (bubbles), `ln-form._updateSubmitButton()` re-runs
   and re-evaluates the submit-button state from the live
   `checkValidity()` of each field. `ln-autosave` writes the
   draft on `focusout`.
3. **User clicks Save** — form `submit` fires, `ln-form` catches
   it, calls `lnForm.submit()`, force-validates every field,
   dispatches `ln-form:submit` if all pass. Application code
   handles the dispatch, fetches, on success dispatches
   `ln-autosave:clear` to drop the draft, `lnForm.reset()` to
   clear field state.
4. **`lnForm.reset()`** — dispatches synthetic `input` /
   `change` on every field (so `ln-autoresize` shrinks back, etc.),
   then calls `instance.reset()` on every `[data-ln-validate]`
   field. The intermediate state where empty `required` fields
   are transiently invalid is real but invisible — `_resetValidation`
   runs immediately after the dispatch loop and clears it.

Zero glue code. The components share no imports, no listeners.
The DOM is the wiring.

## Common mistakes

### Mistake 1 — Skipping the `.form-element` wrapper

```html
<!-- WRONG — no .form-element ancestor; error list is invisible to validate() -->
<label for="email">Email</label>
<input id="email" name="email" required data-ln-validate>
<ul data-ln-validate-errors>
    <li class="hidden" data-ln-validate-error="required">Email is required</li>
</ul>
```

`validate()` does `dom.closest('.form-element')`, which returns
`null` if the field isn't inside one. The error-list lookup
short-circuits, no `<li>` ever unhides. The CSS class on the input
still toggles (the field gets the red border), but the user sees
no message — just a red box with no explanation.

```html
<!-- RIGHT — wrapper present, errors render -->
<div class="form-element">
    <label for="email">Email</label>
    <input id="email" name="email" required data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Email is required</li>
    </ul>
</div>
```

### Mistake 2 — Putting `data-ln-validate` on a non-form element

```html
<!-- WRONG — div has no .validity, no .checkValidity() -->
<div data-ln-validate>...</div>
```

The constructor reads `dom.tagName` and `dom.type` to decide
`isChangeBased`; it does not check that the element is actually a
form control. `validate()` then calls `dom.checkValidity()`, which
on a `<div>` is `undefined` — calling `undefined()` throws
`TypeError: dom.checkValidity is not a function`. The first
`input` / `change` event (or first `instance.validate()` call)
crashes.

The component does not validate the upgrade preconditions.
`data-ln-validate` belongs only on `<input>`, `<select>`, or
`<textarea>`.

### Mistake 3 — Programmatic `el.value = '...'` writes don't validate

```js
// WRONG — assignment does NOT fire 'input' or 'change'
document.getElementById('email').value = 'hello@example.com';
// → ln-validate has no idea the value changed
// → _touched stays false (or whatever it was)
// → submit-button gating in ln-form doesn't update
```

Setting `.value` is a silent platform write. Neither `input` nor
`change` fires, so neither `ln-validate` nor `ln-form` reacts.
The field's value is now what you wrote, but every component that
listens for the value to change is unaware.

```js
// RIGHT — dispatch the matching event after the assignment
const input = document.getElementById('email');
input.value = 'hello@example.com';
const isChangeBased = input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'radio';
input.dispatchEvent(new Event(isChangeBased ? 'change' : 'input', { bubbles: true }));
```

This is the same fork that `ln-form.fill()`, `ln-form.reset()`,
and ln-autosave's construction-time restore use internally. Mirror it
from project code.

If you are setting many fields at once, use `lnForm.fill(data)`
instead — it does the dispatch loop for you (`js/ln-form/ln-form.js:102-113`).

### Mistake 4 — Listening for `ln-validate:invalid` after `set-custom`

```js
// WRONG — set-custom does NOT dispatch :invalid
document.addEventListener('ln-validate:invalid', function (e) {
    if (e.detail.field === 'email') log('email is invalid');
});

// Fires set-custom — log handler does NOT run
document.getElementById('email').dispatchEvent(new CustomEvent('ln-validate:set-custom', {
    bubbles: true, detail: { error: 'emailTaken' }
}));
```

`_onSetCustom` is intentionally silent at the event level — see
the asymmetry note above. The visible-state changes (class flip,
`<li>` unhide), but no `:invalid` event fires. Listeners that
key off the event miss the state change.

The fix depends on intent. If you want to know whenever the field
becomes invalid by *any* path, also call `validate()` after the
`set-custom`:

```js
const input = document.getElementById('email');
input.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
    bubbles: true, detail: { error: 'emailTaken' }
}));
input.lnValidate.validate();   // forces :invalid dispatch (since _customErrors.size > 0)
```

Or watch a different signal — e.g. a class mutation observer on
`.ln-validate-invalid`. `ln-form`'s submit-button gate has the
same blind spot, since it re-evaluates on bubbled `:valid` /
`:invalid` events and `set-custom` doesn't dispatch one — if you
need server-side errors to gate the submit button, force-validate
after `set-custom`.

### Mistake 5 — Server validation race

```js
// WRONG — race between server response and user typing
form.addEventListener('ln-form:submit', async function (e) {
    const res = await fetch('/api/users', { method: 'POST', body: JSON.stringify(e.detail.data) });
    if (res.status === 422) {
        const { errors } = await res.json();
        // Apply errors via set-custom
        Object.keys(errors).forEach(function (field) {
            form.querySelector('[name="' + field + '"]').dispatchEvent(new CustomEvent('ln-validate:set-custom', {
                bubbles: true, detail: { error: 'server' }
            }));
        });
    }
});
```

Between the user clicking Save and the server returning 422, the
user might already have started typing in the email field. By the
time the response arrives and `set-custom` fires, the user's
keystroke has already triggered `validate()`, which (let's say)
just dispatched `:valid` — then `set-custom` fires and unhides the
server `<li>` and adds the invalid class, BUT does not re-evaluate
the now-newly-typed value against the server.

The user sees a red border on a value they're actively editing,
with the server's stale rejection still attached. Dispatching
`:set-custom` always adds the error; clearing it requires the user
to either retype the same value (no-op for the server check) or
the application to detect "the user typed in this field, drop the
stale server error":

```js
// RIGHT — clear server error on user input after server response arrives
input.addEventListener('input', function () {
    if (input.lnValidate._customErrors.has('server')) {
        input.dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
            bubbles: true, detail: { error: 'server' }
        }));
    }
});
```

This is a pattern, not a fix shipped in `ln-validate` — the
component has no opinion on staleness because it has no model of
where the custom error came from.

### Mistake 6 — Relying on the browser's `:invalid` pseudo-class

```scss
/* WRONG — fires on every empty required field, including untouched ones */
input:invalid { border-color: red; }
```

The CSS `:invalid` pseudo-class is set by the browser the moment
the field's constraints are evaluated, regardless of user
interaction. A fresh form with three empty `required` fields
renders three red boxes on page load — exactly the UX `_touched`
exists to avoid.

`ln-validate-invalid` is the right hook because it is added by
the component only after the field has been touched (or
explicitly force-validated):

```scss
/* RIGHT — only fields that have been interacted with */
input.ln-validate-invalid { border-color: hsl(var(--color-error)); }
```

The library default mixins follow this — `@mixin form-validate-invalid`
is applied to `.ln-validate-invalid`, not to `:invalid`.

### Mistake 7 — Multiple `<li data-ln-validate-error="X">` for the same key

```html
<!-- AMBIGUOUS — two <li>s with the same key -->
<ul data-ln-validate-errors>
    <li class="hidden" data-ln-validate-error="required">Required (first)</li>
    <li class="hidden" data-ln-validate-error="required">Required (second)</li>
</ul>
```

`validate()` iterates every `<li>` in the wrapper and toggles
`.hidden` based on the mapped validity property. Both `<li>`s
unhide simultaneously — the user sees two duplicate "Required"
messages. There is no first-match logic.

This is rarely intentional. If you need conditional messages
(e.g. "Required" vs "Required for premium accounts"), pick one and
make it dynamic via a custom error:

```html
<ul data-ln-validate-errors>
    <li class="hidden" data-ln-validate-error="required">Required</li>
    <li class="hidden" data-ln-validate-error="requiredPremium">Required for premium accounts</li>
</ul>
```

```js
// In the coordinator, choose which to attach based on context
input.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
    bubbles: true, detail: { error: 'requiredPremium' }
}));
```

### Mistake 8 — Expecting `validate()` to skip untouched fields

```js
input.lnValidate.validate();   // renders errors immediately on an untouched field
```

`validate()` does NOT check `_touched` before rendering. Calling
it on a fresh field renders errors right then — that is the whole
point: it's the force-validate gate that `ln-form.submit()` uses
to catch untouched required fields.

If you want to validate only if touched (e.g., for an "is the form
clean enough to autosave?" check), read `instance._touched` and
short-circuit:

```js
if (input.lnValidate._touched) {
    input.lnValidate.validate();
}
```

Or use `instance.isValid` — the getter does not render or dispatch.

### Mistake 9 — Removing `data-ln-validate` and expecting clean teardown

```js
// Probably not what you want
input.removeAttribute('data-ln-validate');
```

The shared MutationObserver fires on the attribute removal, but
`registerComponent`'s default behavior is to call `findElements`
on the mutation target, which would re-instantiate if the
attribute were present and skip otherwise. The existing
`input.lnValidate` instance is NOT torn down — its listeners
remain attached, the CSS classes stay where they are, the error
`<li>`s keep their visibility state.

The cleaner pattern for "stop validating this field":

```js
input.lnValidate.destroy();        // detach listeners, dispatch :destroyed, delete instance
input.removeAttribute('data-ln-validate');
input.classList.remove('ln-validate-valid', 'ln-validate-invalid');  // destroy() removes these too, but be defensive
```

`destroy()` does NOT hide error `<li>`s. If you need a clean
visual state, also iterate the wrapper's `[data-ln-validate-error]`
items and re-add `.hidden` — or call `instance.reset()` first.

### Mistake 10 — Putting `data-ln-validate` on a `<fieldset>`

```html
<!-- WRONG — fieldset is not a form control -->
<fieldset data-ln-validate>
    <legend>Role</legend>
    <input type="radio" name="role" value="admin" required>
    <input type="radio" name="role" value="editor">
</fieldset>
```

Same shape as Mistake 2 — `<fieldset>` has no `validity` and no
`checkValidity()` (well, it has `checkValidity()` since HTML5 but
it traverses children, and the component is not designed for that
flow). The first `change` event crashes.

For a radio group, put `data-ln-validate` on each radio (or on the
first one — only that instance dispatches errors). Native browser
behavior treats `required` on any single radio in a `name` group
as "the group is required":

```html
<fieldset>
    <legend>Role</legend>
    <ul>
        <li><label><input type="radio" name="role" value="admin" required data-ln-validate>Admin</label></li>
        <li><label><input type="radio" name="role" value="editor">Editor</label></li>
    </ul>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Please choose a role</li>
    </ul>
</fieldset>
```

The wrapper here is the `<fieldset>`, which also serves as the
`.form-element` equivalent for grouped radios — but the validation
component finds the error list via `dom.closest('.form-element')`,
not via `closest('fieldset')`. If you keep the radios inside a
`.form-element` wrapper, the lookup works. If the `<fieldset>` IS
the `.form-element`, add `class="form-element"` to it.

## Related

- **[`ln-form`](../ln-form/README.md)** — the form-level coordinator
  that consumes `ln-validate:valid` / `:invalid` for submit-button
  gating, force-validates every field on `lnForm.submit()`, and
  dispatches synthetic `input` / `change` from `lnForm.fill()` and
  `lnForm.reset()` so `ln-validate` re-runs on programmatic value
  changes. The two components together make up the form layer's
  contract — read both READMEs together.
- **[`ln-autosave`](../ln-autosave/README.md)** — restores draft
  values via `populateForm()` and dispatches synthetic `input` /
  `change` on every restored field. `ln-validate` reacts via the
  platform event flow with no direct integration. Indirect, but
  reliable — see the Cross-component coordination section above.
- **[`ln-confirm`](../ln-confirm/README.md)** — gates the first
  click on a destructive button. Independent of `ln-validate`; the
  click flow is sequential (confirm gate → form submit → validate
  gate). They sit on different elements and don't share any event
  channel.
- **`@mixin form-validate-invalid`** (`scss/config/mixins/_form.scss:450`)
  — red border + focus ring for `.ln-validate-invalid`.
- **`@mixin form-validate-valid`** (`scss/config/mixins/_form.scss:459`)
  — green border + focus ring for `.ln-validate-valid`.
- **`@mixin form-validate-errors`** (`scss/config/mixins/_form.scss:468`)
  — error-list typography (caption size, error color).
- **Architecture deep-dive:** [`docs/js/validate.md`](../../docs/js/validate.md)
  for component internals, the `_touched` lifecycle, the
  custom-error path, and the validate-vs-set-custom dispatch
  asymmetry.
- **Form-layer architecture:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — `ln-validate` is the validate layer (§3.4); the form-layer
  contract for server-side errors (`ln-form:error` →
  `ln-validate:set-custom`) lives in §6.2.
- **Native ValidityState API:** [MDN — ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
  for the full list of validity properties (including `stepMismatch`
  and `badInput`, which are NOT in `ERROR_MAP` — extend it if
  needed).
