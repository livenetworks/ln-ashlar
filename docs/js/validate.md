# validate — architecture

> Field-level validity primitive. Wraps the browser's `ValidityState`,
> defers rendering until first interaction (`_touched`), and exposes
> a stable event surface (`ln-validate:valid` / `:invalid`) plus a
> custom-error escape hatch (`set-custom` / `clear-custom`).

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
- Server-side error injection (the application subscribes to whatever
  event its consumer code dispatches after a 4xx, then dispatches
  `ln-validate:set-custom`). `ln-form` only dispatches `ln-form:submit`;
  consumers dispatch their own success/error events.
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
| `_touched` | `Boolean` | constructor (line 27) initial `false`; `_onInput` (line 36); `_onChange` (line 41); `_onSetCustom` (line 49); `reset` (line 129) sets back to `false` | `ln-form._updateSubmitButton`; referenced by consumer code via `instance._touched` for "should I force-validate this?" gating |
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

The constructor reads `tagName` and `type` to decide which events to
listen for — change-based for SELECT, checkbox, and radio; `input`
plus `change` for everything else. This is the `isChangeBased`
discriminator (see `ln-validate.js:33`).

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

- `ln-form.fill()` — dispatches `change` for SELECT / checkbox / radio,
  `input` for everything else.
- `ln-form.reset()` — same pattern.
- `ln-autosave` restore path — same pattern.

The mirroring is not enforced by code (no shared helper); it is a
documented invariant that has to stay in sync across files. If a
future commit changes the discriminator on one side, every other
side must change with it — see the `ln-form.fill()` inline comment.

Both `_onInput` and `_onChange` have the same body: set
`_touched = true` and call `validate()`. Two separate handlers exist
(rather than one shared function) so that `destroy()` can pass
distinct references to `removeEventListener`. Behaviorally identical.

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
wrapper and checks each key against `ERROR_MAP` (defined at the
top of `ln-validate.js`, lines 11-19):

| `data-ln-validate-error` key | `ValidityState` property |
|---|---|
| `required` | `valueMissing` |
| `typeMismatch` | `typeMismatch` |
| `tooShort` | `tooShort` |
| `tooLong` | `tooLong` |
| `patternMismatch` | `patternMismatch` |
| `rangeUnderflow` | `rangeUnderflow` |
| `rangeOverflow` | `rangeOverflow` |

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
silent.

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

`_touched` does not gate what `validate()` writes — `validate()`
writes unconditionally. `_touched` gates **whether the listener
handlers call `validate()` in the first place**. The flag flips on
the field's first `input` or `change` (or first `set-custom`).
After that, every keystroke calls `validate()`, which renders
errors. Until then, the field is silent.

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
errors immediately. That is intentional — on submit, `ln-form`
dispatches the `ln-validate:request-validate` event on the form.
This catches untouched required fields, triggers their validation,
adds them to the invalid fields list, and blocks invalid form submission.

The flag is read during the `ln-validate:request-validate` event handler
to set `_touched = true`, ensuring that subsequent inputs on previously
untouched fields will continue to validate on keyup/change.

The submit button stays active, and any invalid submit is intercepted to
surface inline errors and focus the first invalid field.

To prevent browser bubbles from preempting the custom validation logic,
`ln-validate` injects `novalidate` on `field.form` the first time a
field initializes — one field is enough to own the whole form's gate.
Authors never write `novalidate` by hand. A form with zero
`data-ln-validate` fields keeps native browser validation as the
default, and the attribute is never removed on field `destroy()`
(other fields on the same form may still own the gate).

## The `isValid` getter

A pure read: `dom.checkValidity() && _customErrors.size === 0`.
No side effects — no class toggles, no `<li>` updates, no event
dispatches, no `_touched` mutation. Defined as a prototype getter
via `Object.defineProperty` (see `ln-validate.js:142`). Reads live
state through `checkValidity()` (which itself is a pure read) and
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
  each — see `ln-form`'s reset implementation.

The order in `ln-form.reset()` matters — see the inline comment in
`ln-form.reset()`:

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
"reset, no errors."

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

## Listener attachment

The constructor attaches four listeners on the field element directly:
`input` (text/textarea only — gated by `isChangeBased`), `change`,
`ln-validate:set-custom`, `ln-validate:clear-custom`. All four
target the field, not the form or document — there are no global
listeners.

The `set-custom` / `clear-custom` events bubble (CustomEvent default),
but the listener is on the field, so dispatching from a parent will
NOT reach the listener — bubbling goes up, not down. Dispatch must
target the field element (or any descendant; the event bubbles up
through the field on its way out). The README's examples always
show `input.dispatchEvent(...)` — that is the contract.

`ln-validate` does not listen for `ln-form:error` or any sibling-
component event. The translation of server errors to `set-custom`
dispatches is consumer-side wiring.

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

## Cross-component contract

`ln-form` listens for `ln-validate:valid` / `:invalid` bubbling from
the form's descendants and re-evaluates submit-button state on each
event. `ln-form.fill()` and `ln-form.reset()` dispatch synthetic
`input` / `change` events on every field; ln-validate reacts via
its own platform listeners. `ln-autosave` does the same on restore.
None of these components import each other — the wiring IS the
platform event flow.

The cross-cutting invariant is the listener discriminator:

```
ln-validate.js (init)        ln-form.js (fill/reset)    ln-autosave.js (restore)
const isChangeBased         const isChangeBased        const isChangeBased
  = tag === 'SELECT'          = tag === 'SELECT'         = tag === 'SELECT'
  || type === 'checkbox'      || type === 'checkbox'     || type === 'checkbox'
  || type === 'radio';        || type === 'radio';       || type === 'radio';
```

If `ln-validate` ever stopped listening for `input` on text fields,
synthetic `input` events from `ln-form.fill()` would not trigger
validation. If `ln-form.fill()` ever dispatched `change` instead of
`input` for text fields, `ln-validate` would still validate (it
listens for both on text fields), but `ln-autoresize` would not
resize. The cluster works because all three sides agree on the
discriminator. A change to one is a change to all.

## Design decisions worth flagging

**Why no `aria-invalid`?** The component owns one visual signal
(class-driven CSS) and downstream concerns (ARIA, high-contrast
modes, project decoration) hook into the same class. Adding
`aria-invalid` writes would create a second contract surface. If
your accessibility audit needs it, wire it on the consumer side
via the `ln-validate:invalid` event.

**Why does `_onSetCustom` skip the dispatch?** `set-custom` is
fired by code that already knows the field is invalid; dispatching
`:invalid` would be redundant. `clear-custom` cannot pre-determine
the new state (other custom errors might still be active, or
native errors), so it calls `validate()` if `_touched`. Cost:
`ln-form`'s submit-button gate doesn't learn about server-side
errors via `set-custom` alone — a coordinator must call
`instance.validate()` after `set-custom` if it wants the gate to
react. Documented in README §What it does NOT do.

**Why is `field` in the event detail?** `detail.target` is the
element. `detail.field` is `dom.name`, exposed for consumer-side
keying without re-querying the DOM. A field without `name` dispatches
`field: ""` — name your fields. `ln-form` itself does not consume
`detail.field`; its submit gate re-queries `[data-ln-validate]`
on every event.

**Why does `validate()` always render, including on untouched
fields?** `validate()` is the force-validate gate that
`ln-form.submit()` uses to catch untouched required fields. Gating
it on `_touched` would defeat that use case. The component instead
gates the listener handlers (which set `_touched = true` first),
so user interaction triggers the render and programmatic force-
validate also works.
