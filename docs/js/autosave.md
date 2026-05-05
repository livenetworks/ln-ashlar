# Autosave — architecture reference

> Implementation notes for `ln-autosave`. The user-facing contract
> lives in [`js/ln-autosave/README.md`](../../js/ln-autosave/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-autosave/ln-autosave.js` (141 lines).

## Position in the architecture

`ln-autosave` is an **orthogonal persistence layer** that attaches to
the Submit layer's `<form>` boundary in the four-layer architecture
described in [`docs/architecture/data-flow.md`](../architecture/data-flow.md).
It is NOT one of the four named layers (Data, Submit, Render,
Validate). Drafts are not records; localStorage is not the cache. The
data-flow document defines how committed records move through the
system; ln-autosave is concerned with state that has not yet committed
— "what the user has typed but not submitted."

The architectural decision worth understanding: ln-autosave uses
**localStorage**, not IndexedDB (which would route through `ln-store`),
not a server endpoint (which would route through `ln-http`). The
choice is deliberate. localStorage is synchronous (saves and restores
have no race window), origin-isolated, persists across tab close, and
is universally available in browsers older than the IndexedDB-stable
era. The synchronicity is the load-bearing property: when
`focusout` fires and the component calls `localStorage.setItem`, the
write completes before the next tick — there is no scenario where a
user could click "Submit" between the save and the platform's submit
event. Async storage (IndexedDB) would force ln-autosave to manage
in-flight save promises, queue saves while previous saves resolve,
and reason about the case where a save is still pending when the
form submits and clears.

The contrast with `ln-store` is instructive. `ln-store` uses
IndexedDB because it stores **records** — server-authoritative data
that needs to survive across forms, pages, sessions; that is queried
and aggregated; that has a sync state and a pending-write pipeline;
that may exceed localStorage's 5MB cap. Drafts are different:
ephemeral, single-form-scoped, throwaway-on-submit, naturally tiny.
They want a tiny tool with no ceremony. localStorage is exactly that.

The component composes with `ln-form`, `ln-validate`, and
`ln-autoresize` transparently — by emitting synthetic `input` and
`change` events on every restored field, not by importing or
listening for any sibling component's custom events. The platform's
event-propagation model is the connector. ln-autosave does not know
that ln-validate or ln-autoresize exist.

## State

Each `[data-ln-autosave]` form gets a `_component` instance stored at
`element.lnAutosave`. Instance state is small:

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLFormElement` | Whole instance | Reference to the form — the constructor's argument |
| `key` | `string` | Captured at construction | The fully-resolved storage key, format `ln-autosave:{pathname}:{identifier}`. Computed once by `_getStorageKey` (line 126) and never re-read. |
| `_onFocusout` | `Function` | Whole instance | Bound handler for the form's `focusout` listener. Held as a reference so `destroy()` can call `removeEventListener` symmetrically. |
| `_onChange` | `Function` | Whole instance | Bound handler for the form's `change` listener. Same reason. |
| `_onSubmit` | `Function` | Whole instance | Bound handler for the form's `submit` event. Calls `clear()`. |
| `_onReset` | `Function` | Whole instance | Bound handler for the form's `reset` event. Calls `clear()`. |
| `_onClearClick` | `Function` | Whole instance | Bound delegated handler for clicks on `[data-ln-autosave-clear]` descendants. Uses `closest()` to find the marker. |

There is no in-memory cached draft, no debounce timer, no in-flight
save promise. Every save is a one-shot synchronous write, every
restore is a one-shot synchronous read. The instance is essentially a
listener bundle.

Note that `key` is captured at **construction time** from the
attribute value, the form's `id`, and `window.location.pathname`. None
of those three inputs is observed for changes — mutating the
attribute mid-life, changing the form's id, or pushing a new
History API URL does NOT re-key the instance. To switch keys, destroy
and re-mount.

## Construction flow

`registerComponent('data-ln-autosave', 'lnAutosave', _component, 'ln-autosave')`
at line 140 wires the standard scaffolding from
`js/ln-core/helpers.js`:

1. **Selector + attribute** registers the form type with ln-core's
   shared `MutationObserver`.
2. The shared observer watches `document.body` for new
   `[data-ln-autosave]` forms (childList) and for the attribute
   landing on existing forms (attribute filter). New matches run
   `new _component(form)`.
3. The constructor calls `_getStorageKey(form)` (line 14). If it
   returns `null` (neither attribute value nor `form.id` resolves),
   the constructor logs a `console.warn` and returns without
   instantiating — the `el.lnAutosave` back-reference is never set,
   so subsequent observer ticks will keep retrying the same form
   each time the attribute changes. (Practical: this is fine,
   because re-trying does no work past the warning.)
4. With `key` resolved, the constructor stores `this.dom = form` and
   `this.key = key` (lines 20-21), then constructs five bound event
   handlers as closures over `self = this` (lines 25-50).
5. The five handlers are attached to the form (lines 52-56):
   `focusout`, `change`, `submit`, `reset`, `click`.
6. `this.restore()` runs immediately (line 58) — this is the
   construction-time restore.
7. The constructor returns `this`, which `registerComponent`'s
   wiring assigns to `form.lnAutosave`.

The construction-time restore is the trickiest moment in the
component's lifecycle. It runs synchronously before
`registerComponent` has assigned `form.lnAutosave` — meaning the
listener for `:before-restore` cannot yet read `e.detail.target.lnAutosave`
to call methods on it (the back-reference is not set until the
constructor returns). In practice this is rarely an issue because
the listener typically only inspects `e.detail.data` and decides
whether to `preventDefault()`; if it needs to call `clear()`, the
form is `e.detail.target` and the back-reference is set by the time
the listener runs (because the synchronous chain — construct →
restore → dispatch → listener — has the constructor mid-call, but
the listener's body is reached after `registerComponent` returns
the assignment to `el.lnAutosave`).

Wait — re-read. The construction sequence is:

```
new _component(form)
  → constructor body runs
    → form.lnAutosave is NOT yet set (constructor hasn't returned)
    → this.restore() called synchronously
      → dispatchCancelable('ln-autosave:before-restore')
        → listener fires; e.detail.target = form; form.lnAutosave === undefined
```

So a `:before-restore` listener that wants to call
`form.lnAutosave.clear()` cannot, because `form.lnAutosave` is
undefined at that moment. The workaround is to dispatch from a
microtask:

```js
document.addEventListener('ln-autosave:before-restore', function (e) {
    if (shouldDiscard(e.detail.data)) {
        e.preventDefault();
        queueMicrotask(function () {
            e.detail.target.lnAutosave.clear();   // back-reference is set by now
        });
    }
});
```

This is a real wrinkle in the lifecycle. The README's "Cancel restore
when the form has server data" example glosses over it because the
common case (the `data-has-server-data` flag is set in markup) is
handled inline without needing the back-reference — the listener
just calls `preventDefault()` and the constructor's `restore()`
returns at line 90. The rare case (also wanting to wipe the
localStorage entry) needs the microtask defer.

A future refactor could move the construction-time `restore()` call
to a `queueMicrotask` inside the constructor itself, so the
back-reference is always set by the time `:before-restore` listeners
run. Not done today; flagged here.

## Save flow

`_component.prototype.save` (lines 63-71):

```
1. data = serializeForm(this.dom)
2. try { localStorage.setItem(this.key, JSON.stringify(data)) }
   catch { return }
3. dispatch('ln-autosave:saved', { target: this.dom, data: data })
```

Three points worth noting.

**The `try/catch` swallows everything.** A `QuotaExceededError`,
a localStorage-disabled-by-user error, an unexpected
`SecurityError` — all silently caught, and the function returns
without dispatching the `:saved` event. There is no
`ln-autosave:save-failed` event. The user's perception is "draft
saved" when in fact nothing was written. Compare `ln-store`'s
`_checkQuota` helper which dispatches `ln-store:quota-exceeded` on
the same condition — ln-autosave does not have an analogue.

**`serializeForm` runs synchronously through `form.elements`.** The
form's elements collection includes every form-associated control:
`<input>`, `<textarea>`, `<select>`, `<button>`, `<output>`,
`<fieldset>`, `<object>`. The serialiser filters out those without
`name`, those with `disabled`, and the types `file`, `submit`, and
`button`. See `js/ln-core/helpers.js:226-250` for the exact rules.

**The `:saved` event fires AFTER the write succeeds, not before.**
There is no cancelable `:before-save` event, no way to inspect or
filter the data before it lands in localStorage. If a consumer
needs pre-save filtering (e.g., to strip a sensitive field), the
only path is to listen for `:saved` and re-write localStorage in
the listener. The README's "Saving sensitive data" common-mistake
section shows the workaround.

## Restore flow

`_component.prototype.restore` (lines 73-102):

```
1. raw = localStorage.getItem(this.key)              [try/catch — silent]
2. if (!raw) return
3. data = JSON.parse(raw)                            [try/catch — silent]
4. before = dispatchCancelable('ln-autosave:before-restore')
5. if (before.defaultPrevented) return
6. restored = populateForm(this.dom, data)
7. for each restored field:
     a. dispatchEvent(new Event('input', { bubbles: true }))
     b. dispatchEvent(new Event('change', { bubbles: true }))
     c. if (field.lnSelect && field.lnSelect.setValue)        ← DEAD BRANCH
          field.lnSelect.setValue(data[field.name])             see "Surprises"
8. dispatch('ln-autosave:restored', { target, data })
```

The synthetic-event dispatch at step 7 is the integration point with
ln-validate, ln-autoresize, and any other component that listens for
the platform's `input` or `change` event. A pure value-write
(`el.value = '...'`) does not fire those events; the explicit
`dispatchEvent` is what makes downstream components see the change.
Both `input` and `change` are dispatched on every field, even though
some types only need one — the cost is a few extra event handler
runs, the benefit is "every relevant listener fires regardless of
field type."

The `bubbles: true` flag is load-bearing. Form-level listeners (e.g.,
`form.addEventListener('input', ...)`) only see the events because
they bubble from the field up to the form. Without it, only listeners
attached directly to each field would fire.

**`populateForm`'s skip-list is asymmetric with `serializeForm`'s.**
Both skip files, submits, buttons, and unnamed/disabled fields. But
`populateForm` ALSO skips fields whose name is not in `data` (line
258: `if (!el.name || !(el.name in data) || ...)`). So if the form
has a field that was added after the draft was saved, the field
stays empty after restore — populated correctly only the next save
cycle. This is the right behaviour; flagged here for readers
debugging "why is my new field empty after restore."

## Clear flow

`_component.prototype.clear` (lines 104-111):

```
1. try { localStorage.removeItem(this.key) }
   catch { return }
2. dispatch('ln-autosave:cleared', { target: this.dom })
```

Idempotent — calling `clear()` on a key that does not exist in
localStorage simply removes nothing and dispatches the event anyway.
The `try/catch` is defensive (localStorage operations rarely throw
on `removeItem`, but the symmetry with `save` is worth keeping).

`clear()` is invoked by three triggers:

1. **`form.submit` event** — the platform's submit (whether
   triggered by a button click, Enter on an input, or
   `form.submit()` programmatically). Note that calling
   `form.submit()` programmatically does NOT fire the `submit`
   event (it bypasses event handlers entirely), so a programmatic
   submit does NOT clear the draft. Use `form.requestSubmit()` if
   you want both the platform validation AND the autosave clear.
2. **`form.reset` event** — the platform's reset event, fired by
   `<button type="reset">`, `<input type="reset">`, or
   `form.reset()`. (`form.reset()` DOES fire the event, unlike
   `form.submit()`.)
3. **Click on `[data-ln-autosave-clear]`** — delegated through
   `_onClearClick` at line 47. The listener walks `closest()` from
   `e.target`, so the attribute can be on any descendant.

`clear()` does NOT remove the form's field values — it only removes
the localStorage entry. The README's "Mistake 2 — Expecting clear()
to reset the form" covers this.

## MutationObserver

The shared observer registered by `registerComponent` watches:

- **`childList`** (`subtree: true`): new `[data-ln-autosave]` forms
  added to the DOM (e.g., AJAX-injected modals, dynamically-created
  forms). New matches initialise.
- **`attributes`** (`attributeFilter: ['data-ln-autosave']`):
  attribute added to an existing form. Initialises.

`extraAttributes` is empty in the `registerComponent` call (line
140), so `data-ln-autosave-clear` is NOT in the attributeFilter. The
observer does not react when this attribute is added or removed at
runtime. The clear-button click delegate (`_onClearClick`) uses
`closest()` to find the marker on each click, so adding the attribute
to a button after construction DOES make the button clear-on-click —
the observer's blindness is just "the component does not get a
notification."

The shared observer's child-list scan also catches forms whose
`data-ln-autosave` attribute is set BEFORE the form lands in the
DOM (e.g., a server-rendered form arriving via `innerHTML`
replacement). In that case the `attributes` mutation never fires, but
the `childList` mutation does, and the observer's `findElements` walk
catches the new form.

## Storage key mechanics

`_getStorageKey(form)` (lines 126-131):

```js
function _getStorageKey(form) {
    const value = form.getAttribute(DOM_SELECTOR);
    const identifier = value || form.id;
    if (!identifier) return null;
    return STORAGE_PREFIX + window.location.pathname + ':' + identifier;
}
```

The resolution rule is `attribute value OR form.id`. Empty attribute
value (`data-ln-autosave=""`) is falsy, so it falls through to
`form.id`. Missing both → `null`, which the constructor logs and
exits on.

The `window.location.pathname` is captured at the moment
`_getStorageKey` runs, which is once at construction. The pathname
is NOT re-read on save or restore — the `key` field captured at
construction is used verbatim in every subsequent operation.
Implication: if the page navigates client-side via History API
without re-mounting the form, the form keeps writing to the original
URL's key. For SPA-style apps where the same form is re-purposed
across URLs, this is wrong; either re-mount the form or use a
URL-independent key (`data-ln-autosave="user-form"` instead of
relying on `id`-plus-pathname).

The pathname is not URL-encoded. A path with special characters like
`/users/some name/edit` would produce a key like
`ln-autosave:/users/some name/edit:my-form` — which localStorage
accepts (keys are arbitrary strings) but is unusual. In practice
admin URLs use ASCII slugs and this is fine.

## Synthetic event dispatch on restore

The choice to dispatch BOTH `input` and `change` on every restored
field (lines 94-95) is intentional. Different field types use
different events:

- `<input type="text">` — `input` fires on every keystroke, `change`
  fires on blur after a value change. ln-validate listens for `input`
  on text inputs.
- `<input type="checkbox">` / `<input type="radio">` / `<select>` —
  `input` is sometimes implementation-defined; `change` is the
  reliable signal. ln-validate listens for `change` on these.
- `<textarea>` — like text inputs; `input` is the right signal.
  ln-autoresize listens for `input`.

Dispatching both means every listener fires regardless of which
event type it cares about. Some listeners (e.g., a project-level
debounced auto-save coordinator) might count both as separate
triggers and double-process — for now, ln-autosave's restore is the
only common producer of synthetic events on form fields, and
double-processing is rare. The cost of the second `dispatchEvent`
call per field is microseconds.

The events are dispatched AFTER `populateForm` has written all
fields. This matters for cross-field validation: the listener sees
the post-restore form, not a partially-restored intermediate state.

## Surprises in the source

The 141-line component is mostly straightforward. Three points worth
flagging.

### 1. Dead `lnSelect.setValue` branch

Lines 97-99:

```js
if (restored[k].lnSelect && restored[k].lnSelect.setValue) {
    restored[k].lnSelect.setValue(data[restored[k].name]);
}
```

`ln-select`'s implementation (`js/ln-select/ln-select.js:22, 147`)
stores TomSelect instances in a module-scoped `WeakMap` accessed via
`window.lnSelect.getInstance(element)`. The instances are NEVER
exposed as `element.lnSelect`. The condition
`restored[k].lnSelect` always evaluates to `undefined` (= falsy), so
the branch is dead code.

This is not a bug today because TomSelect listens for the underlying
`<select>`'s native `change` event, which ln-autosave dispatches at
line 95. The integration works, just not through the path the source
implies. Possible explanations: (1) an older version of ln-select did
expose `el.lnSelect`; (2) the author conflated the WeakMap-keyed
lookup with the convention used by other ln-* components.

A future cleanup pass should either:

- Delete the branch (it does nothing),
- Replace with `window.lnSelect.getInstance(restored[k])` (functional
  equivalent of the apparent intent — but probably also unnecessary,
  given the `change` event already syncs TomSelect),
- Leave it documented as dead code.

For now, documented as dead code. Do not rely on the branch.

### 2. Silent quota-exceeded handling

The `try/catch` around `localStorage.setItem` (lines 65-69) swallows
all errors silently. There is no `ln-autosave:save-failed` event, no
console warning, no toast. A user filling in a 6MB form will quietly
stop having their work saved — and they have no way to know.

This is asymmetric with `ln-store`, which dispatches
`ln-store:quota-exceeded` on the same `QuotaExceededError`. A future
enhancement could add a parallel event:

```js
} catch (e) {
    if (e.name === 'QuotaExceededError') {
        dispatch(this.dom, 'ln-autosave:quota-exceeded', { error: e });
    }
    return;
}
```

Not done today. Flagged.

### 3. Construction-time `restore()` runs before back-reference is set

As discussed in "Construction flow," the `:before-restore` event
dispatches synchronously inside the constructor, BEFORE
`registerComponent` has assigned `form.lnAutosave`. Listeners that
need to call `form.lnAutosave.clear()` must defer via
`queueMicrotask`.

A future refactor could wrap the construction-time restore in a
`queueMicrotask`:

```js
queueMicrotask(function () {
    self.restore();
});
```

The trade-off: the restore would no longer be synchronous from
construction's point of view, so a consumer expecting
`form.lnAutosave` to have already-restored values immediately after
construction (rare, but possible) would break. The current behaviour
is the "synchronous on construction" contract; the proposed refactor
is a "microtask-deferred restore" contract. They are not equivalent;
the right choice depends on how consumers actually use the timing.

For now, the current shape is what the source does. The README and
this doc call out the workaround.

## Destroy flow

`_component.prototype.destroy` (lines 113-122):

```
1. if (!this.dom[DOM_ATTRIBUTE]) return    [idempotency guard]
2. removeEventListener × 5 (focusout, change, submit, reset, click)
3. dispatch('ln-autosave:destroyed', { target: this.dom })
4. delete this.dom[DOM_ATTRIBUTE]
```

The idempotency guard (line 114) is the standard pattern for ln-*
components: if `el.lnAutosave` was already deleted, `destroy()` was
already called, return without doing anything. This makes
`destroy()` safe to call from a node-removal MutationObserver
handler that might fire multiple times for the same element.

`destroy()` does NOT call `clear()`. The localStorage entry persists
after destroy. This is intentional — destroy is a JS-side
"stop auto-saving this form" operation, NOT a user-facing "discard
the draft" operation. If both are wanted, `clear()` first.

The order — listeners removed BEFORE the `:destroyed` event — means
the form's own listeners would not catch the `:destroyed` event if
they were attached via the same five removed handlers. They were
not (the dispatched event uses a different bubbling path), but it
is worth noting if you write a `form.addEventListener('ln-autosave:destroyed', ...)`
that expects to also see `submit` events on the same form
afterwards — the submit listener was removed before the destroyed
event fired.

## Why no `data-ln-autosave-debounce`

A repeating question is "why doesn't ln-autosave debounce, and can
we add it?" The answer:

The save trigger is `focusout` and `change`, not `input`. Field-level
boundary events are naturally rate-limited by user behaviour — a
user types into one field, then tabs to the next; the `focusout`
fires once per field-leave. There is no "stream of events" to
debounce. A user who types continuously into a single field for
five minutes triggers ZERO saves until they blur, which is the
opposite problem from "too many saves."

A `data-ln-autosave-debounce` attribute would only matter if we
moved the trigger to `input`. That is a separate architectural
decision (do we save per-keystroke?) — the answer today is "no, save
on field boundaries." If your form is a single-textarea editor where
field boundaries do not happen, see the README's "Mistake 5 — Long
single-field forms" for the right fixes (periodic save, or
input-listener save in project code).

## Comparison with `ln-core/persist.js`

Both ln-autosave and ln-core/persist.js write to localStorage. The
prefixes are deliberately different (`ln-autosave:` vs `ln:`) so the
two cannot collide.

| Concern | `ln-core/persist.js` | `ln-autosave` |
|---|---|---|
| What it stores | UI state (filter selections, toggle open/closed, current tab, sort direction) | Form drafts (full serialised form data) |
| Key prefix | `ln:` | `ln-autosave:` |
| Key shape | `ln:{component}:{path}:{id}` | `ln-autosave:{path}:{identifier}` |
| API | `persistGet`, `persistSet`, `persistRemove`, `persistClear` (functions) | `el.lnAutosave.save / restore / clear` (methods) |
| Scope | Per-component, per-page, per-element-id | Per-form, per-page |
| Cleared by | `persistClear(component)` (manually, e.g., on logout) | `submit`, `reset`, click on `[data-ln-autosave-clear]` |

The two coexist because they solve different problems. `persist.js`
stores "the state of a UI control" — a checkbox in a filter panel,
the active tab in a tabset, the current sort direction of a table.
`ln-autosave` stores "the values the user typed into a form."
Different lifecycles, different ownership, different cleanup
triggers.

Component authors who need to persist UI state pull
`persistGet/Set/Remove` from `ln-core`. Form authors who need draft
persistence add `data-ln-autosave` to the form. The two never overlap
in practice.

## Co-located SCSS

There is no `js/ln-autosave/ln-autosave.scss`. The component has no
visual surface — no chrome, no class on the form, no attribute that
drives CSS. The "Draft saved" indicator pattern is project SCSS
applied to a project element (typically a `<small>` with `aria-live`
inside the form), not part of ln-autosave's contract.

## Public window registration

`window.lnAutosave` is the constructor function (assigned by
`registerComponent`). Calling `window.lnAutosave(rootElement)` runs a
fresh init scan over `rootElement` — used for Shadow DOM contexts
that the shared observer cannot see. The shared observer covers
everything inside `document.body`.

There is no `window.lnAutosave.destroyAll`, no global API for "clear
every draft on the page" — that would need a `localStorage` walk
filtering keys by the `ln-autosave:` prefix. If a project needs that
(e.g., on logout):

```js
const prefix = 'ln-autosave:';
const toRemove = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) toRemove.push(key);
}
toRemove.forEach(function (key) { localStorage.removeItem(key); });
```

Direct localStorage access. ln-autosave does not provide a wrapper.

## Future work / known limitations

- **No quota-exceeded event** — silent failure on writes that exceed
  ~5MB. Add `ln-autosave:quota-exceeded` paralleling
  `ln-store:quota-exceeded`.
- **No before-save cancelable event** — consumers cannot filter the
  data before it lands in localStorage. The workaround (rewrite in
  `:saved` listener) is wasteful.
- **Construction-time restore runs before back-reference is set** —
  documented above; refactor to `queueMicrotask` would make
  `:before-restore` listeners cleaner.
- **No cross-tab sync** — `storage` event is not observed. A
  collaborative-editing setup needs `ln-store`, not autosave.
- **No expiration / TTL** — drafts persist forever. Consumers that
  care implement schema-versioning via the attribute key.
- **Dead `lnSelect.setValue` branch** — vestigial; cleanup pass.
</content>
</invoke>