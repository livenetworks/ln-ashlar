# validate — architecture

> The 160-line primitive that defines the form layer's validity
> contract. Wraps the browser's native `ValidityState` API with three
> additions: a `_touched` boolean that defers rendering until first
> interaction, a custom-error escape hatch for failures the platform
> can't express, and a stable event surface (`ln-validate:valid` /
> `:invalid`) that `ln-form`, projects, and analytics can all consume
> without ever calling validation logic directly.

The implementation lives in
[`js/ln-validate/ln-validate.js`](../../js/ln-validate/ln-validate.js).
This document covers internals — instance state, the listener
discriminator, the `validate()` flow, the custom-error path, and the
design decisions that produced this particular 160-line shape. For
consumer-facing usage see
[`js/ln-validate/README.md`](../../js/ln-validate/README.md).

## Where this sits in the layered architecture

`ln-validate` is the validate layer of the form pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md) §3.4.
Its scope is field-level: one instance per `[data-ln-validate]`
input, owning that field's `_touched` flag, its custom-error set, and
the rendering of error messages inside the field's `.form-element`
wrapper. It does NOT own:

- The form-level submit gate (`ln-form` consumes the bubbling events).
- Form serialization (`ln-core/serializeForm`).
- Server-side error injection (the application or a future
  form-coordinator subscribes to `ln-form:error` and dispatches
  `ln-validate:set-custom`).
- Visual styling (library SCSS reads the classes the component sets;
  the component itself never inlines styles).

The component imports two helpers from `ln-core`:

- `dispatch` — for the `:valid` / `:invalid` / `:destroyed` events.
- `registerComponent` — for the shared MutationObserver upgrade
  path (auto-init on AJAX inserts, attribute additions).

There are no other imports. `ln-validate` does not know about
`ln-form`, `ln-autosave`, or any other component.

## Internal state

Each instance is the object created by `_component(dom)` and stored
as `dom.lnValidate`. The state surface is three fields:

| Field | Type | Set by | Read by |
|---|---|---|---|
| `dom` | `HTMLElement` | constructor (line 26) | every prototype method (`validate`, `reset`, `destroy`, `isValid` getter), every event handler closure |
| `_touched` | `Boolean` | constructor (line 27) initial `false`; `_onInput` (line 36); `_onChange` (line 41); `_onSetCustom` (line 49); `reset` (line 129) sets back to `false` | `ln-form._updateSubmitButton` (`js/ln-form/ln-form.js:91`); referenced by consumer code via `instance._touched` for "should I force-validate this?" gating |
| `_customErrors` | `Set<String>` | constructor (line 28) initial empty; `_onSetCustom` adds (line 48); `_onClearCustom` deletes (line 63) or clears (line 76); `reset` clears (line 130) | `validate()` (line 96 — `isValid` computation); `isValid` getter (line 143); read by `_onClearCustom` to decide which `<li>`s to hide when clearing all (line 70) |

That is the entirety of the per-instance state. There is no:

- Cached array of error `<li>` elements (re-queried on every
  `validate()` call via `parent.querySelectorAll`)
- Cached `.form-element` ancestor reference (re-queried on every
  `validate()` / `_onSetCustom` / `_onClearCustom` / `reset`)
- Cached previous validity result (each `validate()` call recomputes
  from `dom.checkValidity()`)
- Internal debounce or throttle (every input / change runs `validate()`
  immediately)

Re-querying on every call is acceptable because (a) the queries are
scoped to the field's `.form-element` parent, which is small,
(b) `checkValidity()` is microsecond-fast, and (c) state changes are
user-driven keystrokes, not high-frequency programmatic loops. A
caching layer would add complexity without measurable benefit.

The bound event handlers (`_onInput`, `_onChange`, `_onSetCustom`,
`_onClearCustom`) are stored on the instance so that `destroy()` can
pass them back to `removeEventListener` — closures referencing
`self` would otherwise be unreachable for unwiring.

## The listener discriminator

The constructor reads two properties of the field to decide which
events to listen for:

```javascript
const tag = dom.tagName;
const type = dom.type;
const isChangeBased = tag === 'SELECT' || type === 'checkbox' || type === 'radio';
```

| `isChangeBased` | Field types | Listeners attached |
|---|---|---|
| `false` | `<input>` (text, email, tel, url, password, number, search, date, time, etc.), `<textarea>` | `input` and `change` |
| `true` | `<select>`, `<input type="checkbox">`, `<input type="radio">` | `change` only |

The fork exists because `input` does not fire on SELECT, checkbox,
or radio elements — the platform's contract for those is "value
commits on change." Wiring `input` would be dead code; firing it
synthetically (as `ln-form.fill()` and `ln-form.reset()` do) would
fire it twice with `change`. The discriminator funnels through one
listener per field.

This same fork is mirrored exactly in:

- `ln-form.fill()` (`js/ln-form/ln-form.js:108-112`) — dispatches
  `change` for SELECT / checkbox / radio, `input` for everything
  else.
- `ln-form.reset()` (`js/ln-form/ln-form.js:147-152`) — same
  pattern.
- `ln-autosave` restore path (`js/ln-autosave/ln-autosave.js:94-95`)
  — same pattern.

The mirroring is not enforced by code (no shared helper); it is a
documented invariant that has to stay in sync across files. If a
future commit changes the discriminator on one side, every other
side must change with it — see the inline comment in `ln-form.js:106-107`.

Both `_onInput` and `_onChange` have the same body:

```javascript
this._onInput = function () { self._touched = true; self.validate(); };
this._onChange = function () { self._touched = true; self.validate(); };
```

Two separate handlers exist (rather than one shared) so that
`destroy()` can pass distinct references to `removeEventListener`.
Behaviorally identical.

## The `validate()` flow

The prototype method (`ln-validate.js:92-126`) is the central
render path. Every keystroke, every change, every force-validate
from `ln-form.submit()`, every `clear-custom` from a coordinator
ends up here.

```
1. nativeValid = dom.checkValidity()                          // browser API
2. isValid = nativeValid && _customErrors.size === 0          // AND with custom-error gate
3. parent = dom.closest('.form-element')                      // null-safe
4. if parent:
     errorList = parent.querySelector('[data-ln-validate-errors]')
     if errorList:
       items = errorList.querySelectorAll('[data-ln-validate-error]')
       for each item:
         errorKey = item.getAttribute('data-ln-validate-error')
         validityProp = ERROR_MAP[errorKey]
         if !validityProp: continue                           // custom error — skip
         toggle item.hidden based on validity[validityProp]   // SHOW if true, HIDE if false
5. dom.classList.toggle(CSS_VALID, isValid)                   // .ln-validate-valid
6. dom.classList.toggle(CSS_INVALID, !isValid)                // .ln-validate-invalid
7. dispatch(dom, isValid ? 'ln-validate:valid' : 'ln-validate:invalid', { target: dom, field: dom.name })
8. return isValid
```

Step 4 is the key integration point. The component iterates every
`<li data-ln-validate-error>` in the field's `.form-element`
wrapper and checks each key against `ERROR_MAP`:

```javascript
const ERROR_MAP = {
    required: 'valueMissing',
    typeMismatch: 'typeMismatch',
    tooShort: 'tooShort',
    tooLong: 'tooLong',
    patternMismatch: 'patternMismatch',
    rangeUnderflow: 'rangeUnderflow',
    rangeOverflow: 'rangeOverflow'
};
```

Keys IN the map → toggle based on `validity[mappedProperty]`.
Keys NOT in the map → skipped entirely (`continue`). This is the
mechanism that lets native errors and custom errors share the same
`<ul>` without conflict: native errors are managed by the loop;
custom errors are managed only by `_onSetCustom` / `_onClearCustom`.

Note step 4's parent-lookup short-circuit. If the field is not
inside a `.form-element` wrapper, `parent` is `null`, the entire
error-rendering block is skipped, but the CSS class toggle (steps
5–6) and the event dispatch (step 7) still run. The field gets the
red border and the event fires; only the message rendering is
silent. This is the README's "Common mistakes" item 1.

## The custom-error path

Two events feed into the component (`ln-validate.js:86-87`):

- `ln-validate:set-custom` → `_onSetCustom` (lines 45-57)
- `ln-validate:clear-custom` → `_onClearCustom` (lines 59-80)

The two handlers are deliberately asymmetric.

### `_onSetCustom`

```
1. Read e.detail.error                         // bail if missing
2. _customErrors.add(error)                    // track in Set
3. _touched = true                             // future user input is now "touched"
4. parent = dom.closest('.form-element')
   if parent:
     el = parent.querySelector('[data-ln-validate-error="<error>"]')
     if el: el.classList.remove('hidden')      // unhide the matching <li>
5. dom.classList.remove(CSS_VALID)
6. dom.classList.add(CSS_INVALID)
```

Notably absent: a call to `validate()` and a dispatch of
`ln-validate:invalid`. The component sets the visible state (class
flip, `<li>` unhide) but does not emit the standard event. The
README documents the consequence: `ln-form`'s submit-button gate
does not learn about server-side errors set via `set-custom` alone.
A coordinator must also call `instance.validate()` afterwards so
the field's bubbled `:invalid` event triggers `ln-form` to
re-evaluate the submit-button state.

The reasoning: the caller already knows the field is invalid (they
detected the failure and dispatched the event). Re-running
`validate()` and dispatching `:invalid` would produce a redundant
event that the caller doesn't care about. The asymmetry is a
deliberate optimization for the common case (fire-and-forget custom
error injection), at the cost of requiring an explicit
`validate()` call when consumers DO need the event.

### `_onClearCustom`

```
1. Read e.detail.error (may be undefined)
2. parent = dom.closest('.form-element')
3. if error provided:
     _customErrors.delete(error)
     if parent:
       el = parent.querySelector('[data-ln-validate-error="<error>"]')
       if el: el.classList.add('hidden')
   else:
     for each err in _customErrors:
       if parent:
         el = parent.querySelector('[data-ln-validate-error="<err>"]')
         if el: el.classList.add('hidden')
     _customErrors.clear()
4. if _touched: validate()                    // re-render native state
```

Two sub-paths: clear-one (`detail.error` provided) and clear-all
(no error). The clear-all path iterates `_customErrors` and hides
each matching `<li>` BEFORE clearing the Set, so the lookup keys
are still available.

Step 4 — the conditional `validate()` call — is the architectural
counterweight to `_onSetCustom`'s silence. Removing a custom error
might:

- Leave other custom errors active (`_customErrors.size > 0` still).
- Leave native errors active (`dom.checkValidity()` still false).
- Leave the field fully valid (both empty / true).

Only `validate()` can recompute the new state, re-render the native
errors, dispatch the right event, and toggle the CSS class
correctly. It runs only `if (self._touched)` — clearing custom
errors on an untouched field doesn't render anything (the field is
still "fresh," and `validate()` would render native errors that the
user hasn't earned the right to see yet).

## The `_touched` lifecycle

`_touched` is the single most consequential UX decision in the
file. It gates whether `validate()` writes anything visible to the
DOM... actually, no — `validate()` writes unconditionally; what
`_touched` actually gates is whether the listener handlers call
`validate()` in the first place. Re-reading the source:

| Path | `_touched` set to `true`? | `validate()` called? |
|---|---|---|
| `_onInput` (text input event) | yes | yes |
| `_onChange` (change event) | yes | yes |
| `_onSetCustom` (custom error injected) | yes | no |
| `_onClearCustom` (custom error cleared) | no | conditional on existing `_touched` |
| `validate()` direct call (e.g. `lnForm.submit()`) | no | (this IS the call) |
| `reset()` | sets back to `false` | no |

The flag is forward-only during normal user flow — once `true`,
stays `true` until `reset()`. The `validate()` method does not
read `_touched`; force-validating an untouched field renders
errors immediately. That is intentional — `lnForm.submit()`
needs to catch untouched required fields, and the natural way is
to call `validate()` on every `[data-ln-validate]` field
regardless of touched state.

The flag is read by exactly one external consumer:
`ln-form._updateSubmitButton` (`js/ln-form/ln-form.js:91`). It
iterates every `[data-ln-validate]` field, reads
`fields[i][VALIDATE_ATTRIBUTE]._touched`, and disables the submit
button if NO field has been touched (in addition to the standard
"any field invalid" check). This implements "you can't submit a
form you haven't started yet."

## The `isValid` getter

```javascript
Object.defineProperty(_component.prototype, 'isValid', {
    get: function () {
        return this.dom.checkValidity() && this._customErrors.size === 0;
    }
});
```

A pure read. No side effects: no class toggles, no `<li>` updates,
no event dispatches, no `_touched` mutation. Reads live state
through `checkValidity()` (which itself is a pure read) and
`_customErrors.size`.

This is what consumer code reaches for when it wants to know "is
this field currently valid?" without triggering the rendering
pipeline. Use cases:

- An "is the form clean enough to autosave a draft?" predicate
  iterating fields.
- A "should I show the helper hint or hide it?" decision based on
  current validity.
- An analytics event keyed off "user has now made the form valid
  for the first time" — read `isValid` post-input and compare to a
  previous snapshot.

The getter is NOT used by `ln-form.isValid` (which has its own
implementation that iterates and calls `checkValidity()` directly,
without consulting custom errors — `js/ln-form/ln-form.js:174-182`).
This is a minor inconsistency: `ln-form.isValid` returns `true`
even if a field has active `_customErrors`. Flag for a future
audit: should `ln-form.isValid` also account for custom errors?
Probably yes; the README documents the current behavior either way.

## The `reset()` flow

```
1. _touched = false
2. _customErrors.clear()
3. dom.classList.remove(CSS_VALID, CSS_INVALID)
4. parent = dom.closest('.form-element')
   if parent:
     items = parent.querySelectorAll('[data-ln-validate-error]')   // ALL of them — native + custom
     for each item: item.classList.add('hidden')
```

Resets the field to its pre-interaction state. Notably:

- Does NOT dispatch `:valid` or `:invalid`. The field is "back to
  untouched," not "newly valid" — `ln-form._updateSubmitButton`
  reads `_touched` directly and recomputes; no event is needed.
- Hides EVERY `<li data-ln-validate-error>` in the wrapper, native
  and custom alike. Step 4's `querySelectorAll` returns all error
  items; the loop hides them all.
- Does NOT reset `dom.value`. The component does not own the
  value — the form element does. `ln-form.reset()` calls
  `this.dom.reset()` (the native form reset) before iterating
  `[data-ln-validate]` fields and calling `instance.reset()` on
  each — see `js/ln-form/ln-form.js:133-160`.

The order in `ln-form.reset()` matters and is documented inline:

```
1. dom.reset()                          // native — clears values
2. for each field: dispatch 'input' or 'change'
   → ln-validate fires _onInput / _onChange
   → _touched = true
   → validate() → renders required errors on now-empty fields
3. for each field: instance.reset()
   → _touched = false
   → hides every error item
   → removes CSS classes
4. dispatch 'ln-form:reset-complete'
```

Step 2 is what makes `ln-autoresize` shrink back, `ln-validate`
re-evaluate, and any custom listener react. Without step 2,
`ln-autoresize` would keep its previous height. With step 2, every
field is transiently "touched + invalid" — step 3 then immediately
clears that transient state. The user perceives the form as
"reset, no errors." Reordering would leave fields visibly invalid
after reset. See `js/ln-form/ln-form.js:142-146` for the inline
comment.

## The `destroy()` flow

```
1. if !dom[DOM_ATTRIBUTE]: bail
2. dom.removeEventListener('input', _onInput)
3. dom.removeEventListener('change', _onChange)
4. dom.removeEventListener('ln-validate:set-custom', _onSetCustom)
5. dom.removeEventListener('ln-validate:clear-custom', _onClearCustom)
6. dom.classList.remove(CSS_VALID, CSS_INVALID)
7. dispatch('ln-validate:destroyed', { target: dom })
8. delete dom[DOM_ATTRIBUTE]
```

Step 1's guard is the `if (!this.dom[DOM_ATTRIBUTE]) return;`
double-destroy protection — a second `destroy()` call after the
instance reference has been deleted is silent.

Step 6 removes the CSS classes but does NOT hide error `<li>` items
— those stay in their current visibility state. This is mildly
asymmetric vs `reset()` (which hides them) and intentional:
`destroy()` is for "stop validating this field," which is a
different intent than "clean visual state." If a consumer wants
both, they can call `instance.reset()` before `instance.destroy()`.

The `ln-validate:destroyed` event lets external listeners (analytics,
debug overlays) react. It carries `{ target: dom }` and bubbles.

## Listener attachment timeline

The constructor wires four listeners on the field element
(`ln-validate.js:82-87`):

```javascript
if (!isChangeBased) {
    dom.addEventListener('input', this._onInput);
}
dom.addEventListener('change', this._onChange);
dom.addEventListener('ln-validate:set-custom', this._onSetCustom);
dom.addEventListener('ln-validate:clear-custom', this._onClearCustom);
```

All four target the field directly, not the form or document. This
matters for two reasons:

1. **Event delegation for `:set-custom` / `:clear-custom`.** The
   events bubble (CustomEvent default), but the listener is on the
   field. A coordinator dispatching from the form level
   (`form.dispatchEvent(...)`) would NOT reach the field —
   bubbling goes UP, not DOWN. Dispatching must target the field
   element directly (or any descendant; the event bubbles up
   through the field on its way out). The README examples always
   show `input.dispatchEvent(...)` — that is the contract.
2. **No global pollution.** Each field instance has four listeners
   on itself; there are no document-level listeners. A page with
   100 validated fields has 400 listeners total, all scoped. No
   capture-phase delegation, no `event.target` filtering — every
   listener knows the exact element it cares about.

The component does NOT listen for `ln-form:error` directly. That
wiring (translate `{ field: [msg] }` errors to `set-custom`
dispatches) belongs to a coordinator — see
`docs/architecture/data-flow.md` §6.2 for the contract and the
Phase A roadmap note.

## MutationObserver wiring

`registerComponent('data-ln-validate', 'lnValidate', _component, 'ln-validate')`
at line 159 hands off to the shared upgrade observer. The observer:

- **`childList`** — when an element with `data-ln-validate` is
  added to the DOM (AJAX insert, `appendChild`, `replaceChildren`),
  the observer scans the added subtree and calls
  `findElements(...)` which calls `new _component(el)` for any
  match without an existing `lnValidate` instance.
- **`attributes`** — when `data-ln-validate` is added to an existing
  element via `setAttribute`, the observer scans the target and
  upgrades it. The `attributeFilter` is `['data-ln-validate']`,
  derived automatically from the selector.

Removal is NOT observed — `ln-validate` does not auto-destroy when
the attribute is removed or the element is detached. The README
documents the cleaner pattern (`instance.destroy()` before removal).

The observer also does NOT react to changes in `data-ln-validate-error`
or `data-ln-validate-errors` because those attributes are not in the
selector. Re-rendering after error-list HTML changes requires a
manual `instance.validate()` call — but this is rare; error-list
HTML is typically server-rendered and static.

## Cross-component contract — the form layer

The form layer is the cluster of components whose contract centers
on `<form>` and its descendants:

```
            ┌──────────────────────────────────────────────────────┐
            │                  ln-form                             │
            │   (form-level coordinator)                            │
            │                                                      │
            │   Listens (on form):                                 │
            │     ln-validate:valid    ─┐  Re-evaluates submit-    │
            │     ln-validate:invalid  ─┘  button state            │
            │                                                      │
            │   On submit() (force-validate gate):                 │
            │     for each [data-ln-validate]:                     │
            │       instance.validate()  ──→ may dispatch :invalid │
            │                                                      │
            │   On fill(data) / reset():                           │
            │     dispatch input/change on every field             │
            │       ──→ ln-validate _onInput/_onChange fires       │
            │       ──→ validate() runs, errors render             │
            └──────────────────────────────────────────────────────┘
                                   ▲
                                   │ events bubble up
                                   │
            ┌──────────────────────────────────────────────────────┐
            │                ln-validate                           │
            │   (per-field instance — one per [data-ln-validate])  │
            │                                                      │
            │   On 'input' / 'change':                             │
            │     _touched = true                                  │
            │     validate() ──→ dispatch :valid / :invalid        │
            │                                                      │
            │   On 'ln-validate:set-custom' / ':clear-custom':     │
            │     manage _customErrors set                         │
            │     toggle <li data-ln-validate-error="..."> .hidden │
            └──────────────────────────────────────────────────────┘
                                   ▲
                                   │ synthetic input/change
                                   │ from restore / fill / reset
                                   │
            ┌──────────────────────────────────────────────────────┐
            │   ln-autosave           ln-form.fill()               │
            │   (independent)         ln-form.reset()              │
            │                         (form-internal)              │
            └──────────────────────────────────────────────────────┘
```

Three components compose without importing each other. The wiring
is the platform's event flow. A change in any one component's
public contract (event names, listener targets, the `isChangeBased`
discriminator) requires a parallel change in the others — the
mirroring is documented but not enforced.

The contract that matters most is the **listener discriminator
mirroring**:

```
ln-validate.js:33      ln-form.js:110       ln-autosave.js (synthetic)
const isChangeBased   const isChangeBased  const isChangeBased
  = tag === 'SELECT'    = tag === 'SELECT'   = tag === 'SELECT'
  || type === 'checkbox'|| type === 'checkbox'|| type === 'checkbox'
  || type === 'radio';  || type === 'radio'; || type === 'radio';
```

If `ln-validate` ever stopped listening for `input` on text fields,
the synthetic `input` events from `ln-form.fill()` would not
trigger validation — the form fill would silently leave fields
unvalidated.

If `ln-form.fill()` ever dispatched `change` instead of `input` for
text fields, `ln-validate` would still validate (it listens for
both on text fields), but `ln-autoresize` would not resize (it
listens only for `input` — see `js/ln-autoresize/ln-autoresize.js`).

The cluster works because all three sides agree on the
discriminator. A change to one is a change to all.

## Public APIs at a glance

### Instance — `el.lnValidate`

| Method / property | Description |
|---|---|
| `validate()` | Force-validate now. Reads `dom.checkValidity()`, recomputes `isValid`, toggles classes, toggles error `<li>` visibility, dispatches `:valid` or `:invalid`, returns Boolean. Does NOT set `_touched`. |
| `reset()` | `_touched = false`, `_customErrors.clear()`, remove both CSS classes, hide every error `<li>` in the wrapper. Does NOT dispatch any event. |
| `isValid` (getter) | Live `Boolean`: `dom.checkValidity() && _customErrors.size === 0`. No side effects. |
| `destroy()` | Detach all four listeners, remove CSS classes, dispatch `:destroyed`, delete `dom.lnValidate`. Does NOT hide error `<li>` items. |
| `dom` | Back-reference. |
| `_touched` | Internal Boolean — read by `ln-form._updateSubmitButton`. |
| `_customErrors` | Internal `Set<String>` — do not mutate directly. |

### Constructor — `window.lnValidate(root)`

Re-runs the upgrade scan over `root`. Used only for Shadow DOM /
iframe injection; the document-level observer covers normal cases.

### Events — emitted

| Event | Cancelable | `detail` |
|---|---|---|
| `ln-validate:valid` | no | `{ target, field }` |
| `ln-validate:invalid` | no | `{ target, field }` |
| `ln-validate:destroyed` | no | `{ target }` |

### Events — received

| Event | `detail` |
|---|---|
| `ln-validate:set-custom` | `{ error: String }` |
| `ln-validate:clear-custom` | `{ error: String }` (clear one) or `{}` (clear all) |

## Design decisions worth flagging

### Why no `aria-invalid`?

The component manages classes and `.hidden` toggles, not ARIA. The
browser's native `:invalid` pseudo-class is not consumed either.
This is a consistency choice: the component owns one visual signal
(class + class-driven CSS), and downstream concerns (ARIA,
high-contrast modes, project-specific decoration) hook into the
same class. Adding `aria-invalid` writes would create a second
contract surface.

If a project's accessibility audit requires `aria-invalid="true"`
on invalid fields, wire it on the consumer side via the
`ln-validate:invalid` event:

```js
document.addEventListener('ln-validate:invalid', function (e) {
    e.detail.target.setAttribute('aria-invalid', 'true');
});
document.addEventListener('ln-validate:valid', function (e) {
    e.detail.target.removeAttribute('aria-invalid');
});
```

This kind of hook is what the event surface is for.

### Why does `_onSetCustom` skip the dispatch?

The asymmetry between `set-custom` (silent) and `clear-custom`
(dispatches via `validate()` if touched) is documented in the
README and the source comments. Reasoning recap:

- `set-custom` is fired by code that already knows the field is
  invalid. Dispatching `:invalid` is redundant — the caller has
  the information that triggered the dispatch.
- `clear-custom` cannot pre-determine the new state. Removing one
  custom error might leave the field fully valid, partially
  invalid (other customs still active), or natively invalid.
  `validate()` is the only path that resolves this.

The cost: `ln-form`'s submit-button gate does not learn about
server-side errors via `set-custom` alone. The gate re-evaluates
on bubbled `ln-validate:valid` / `:invalid` events, and
`set-custom` does not dispatch one. A coordinator wiring
server-side errors must also call `instance.validate()` after
`set-custom` if it wants the form's submit-button gate to react.
The README's "Mistake 4" documents this; the architecture flag is
whether to make `set-custom` always dispatch or always silent —
current behavior is silent, and changing it would propagate
redundant events to every existing consumer.

### Why is `field` in the event detail?

`detail.target` is the element. `detail.field` is `dom.name`. The
duplication exists for consumer-side keying — coordinators that
want to track per-field state (e.g. a server-error display
keyed by field name, an inline-progress indicator) can read the
name directly off the event without re-querying the DOM.
`ln-form` itself does not consume `detail.field` — its submit-
button gate re-queries `[data-ln-validate]` and reads each
field's `checkValidity()` and `_touched` flag on every event,
ignoring the detail entirely.

A field without `name` dispatches `field: ""` — README
documents "name your fields" as the workaround. Consumers that
key by name will collapse nameless fields into one bucket;
those that key by `detail.target` (the element reference) will
not.

### Why does `validate()` always render, including on untouched fields?

`validate()` is the force-validate gate that `ln-form.submit()`
uses to catch untouched required fields. Gating it on `_touched`
would defeat that use case. The component instead gates the
listener handlers (which set `_touched = true` first), so user
interaction triggers the render, but programmatic force-validate
also works.

The cost: a coordinator that wants "validate but don't render if
untouched" has to read `instance._touched` itself and short-circuit:

```js
if (input.lnValidate._touched) input.lnValidate.validate();
```

This is rare in practice. Most consumers want either "force-validate
now" (`lnForm.submit()`'s pattern) or "react to user input"
(automatic via the listeners).

## Where this code could change

Things flagged for future audits:

- **`ln-form.isValid` does not check custom errors.** The form's
  getter reads `field.checkValidity()` directly, not
  `field.lnValidate.isValid`. A field with `_customErrors.size > 0`
  but native-valid would report as valid at the form level.
  Probably worth aligning — see "The `isValid` getter" section.
- **`set-custom` + form-level submit gate.** As above, custom
  errors do not trigger ln-form's submit-button re-evaluation
  because `_onSetCustom` does not dispatch `:invalid`. A
  coordinator must call `instance.validate()` after `set-custom`
  to push the bubbled event through. A future change could make
  `_onSetCustom` dispatch `:invalid` always, at the cost of
  redundant events for callers who don't need the bubbling path.
- **`ERROR_MAP` coverage.** `stepMismatch` and `badInput` are
  native `ValidityState` properties not in the map. Add them if a
  consumer needs them, or document the pattern for treating them
  as custom errors.
- **`ln-form:error` consumer.** Currently the application or a
  page-level coordinator translates server errors into
  `set-custom` dispatches. The Phase A roadmap moves this to a
  stable coordinator hook in `ln-form` or a new helper. Until
  then, projects wire it manually (README "Examples" §
  "Server-side errors via the form layer").

These are open items, not bugs. The current shape works; the flags
are for the maintainer's audit list.
