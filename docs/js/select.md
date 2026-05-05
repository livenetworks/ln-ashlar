# select — architecture

> The 152-line wrapper that turns TomSelect into a `data-*` attribute.
> Auto-init via the document-level `MutationObserver` rolled by hand
> (not via `registerComponent`, deliberately), per-instance state in a
> module-scoped `WeakMap` keyed by the `<select>` element, form-reset
> hookup that calls `clear` + `clearOptions` + `sync` on the next tick,
> and a graceful-degradation path that installs a no-op API when
> `window.TomSelect` is missing. This document covers the internals —
> why a hand-rolled observer instead of `registerComponent`, why the
> `WeakMap` instead of `el.lnSelect`, why the `setTimeout(0)` in the
> reset handler, and the design decisions that produced this 152-line
> shape. For consumer-facing usage see
> [`js/ln-select/README.md`](../../js/ln-select/README.md).

## Position in the architecture

`ln-select` sits at the **field level of the Submit layer** in the
four-layer architecture described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It
is not one of the four named layers (Data, Submit, Render, Validate);
it is an enhancement attached to a specific kind of submit-layer field
— `<select>` — that the form layer does not need to know about.

The architectural decision worth understanding: ln-select wraps a
**peer dependency** (TomSelect) rather than reimplementing its
behavior in vanilla JS. Every other component in the library is
zero-dependency; ln-select is the single exception. The trade-off is
deliberate. Searchable / multi-select / tagging UIs are large surface
areas (keyboard navigation, ARIA tablist semantics, mobile touch
handling, drag-to-reorder, virtual scrolling for thousands of options)
and TomSelect already solves them with proven shipping code. Writing
`ln-searchable-select` from scratch would be a multi-thousand-line
project competing with a library the rest of the world has already
agreed on. Wrapping it costs 152 lines and gives the form layer a
clean attribute-driven entry point.

The wrapper preserves the library's invariants:

- **Markup-driven activation.** `data-ln-select` on a `<select>`
  is the contract. Adding the attribute upgrades; removing the
  element destroys. No imperative `init()` step is required by
  consumers.
- **Auto-init via `MutationObserver`.** The wrapper rolls its own
  observer (not via `registerComponent` — see "Why hand-rolled"
  below). AJAX-injected forms, attribute additions, and dynamic
  DOM rebuilds all upgrade automatically.
- **Graceful degradation.** Missing TomSelect = no-op API + native
  `<select>` rendering. The page does not crash, the attribute
  becomes a noop marker.
- **No cross-component imports.** ln-select does not import
  ln-form, ln-validate, ln-autosave, or any other library
  component. Composition with the rest of the form layer happens
  through the platform's own `change` event.

The component imports a single helper from `ln-core`:

- `guardBody` — defers the observer setup until `document.body`
  exists, in case the script ran before `<body>` parsed.

There are no other imports. ln-select does not know about `ln-form`,
`ln-validate`, `ln-autosave`, or any other component.

## Internal state — the WeakMap

The single source of truth for "which `<select>` elements are
upgraded" is a module-scoped `WeakMap`:

```javascript
const instances = new WeakMap();   // line 22
```

Keys are `<select>` DOM elements. Values are the corresponding
TomSelect instances. The `WeakMap` is exposed indirectly through
three exported methods on `window.lnSelect`:

```javascript
window.lnSelect = {
    initialize: initializeSelect,                        // upgrade an element
    destroy: destroySelect,                              // tear down + remove from map
    getInstance: function (element) {                    // read access
        return instances.get(element);
    },
};
```

### Why a `WeakMap` and not `el.lnSelect`?

Most ln-ashlar components store their instance directly on the host
element — `el.lnToggle`, `el.lnTabs`, `el.lnAutosave`. ln-select
deliberately does not. Three reasons:

**1. TomSelect mutates the host `<select>` heavily.** It hides the
original element with inline `display: none`, inserts a sibling
`.ts-wrapper` DOM, intercepts every option / change / click. Storing
a wrapper instance as a property on the `<select>` would create a
property surface that any TomSelect-internal query
(`select.options`, `select.querySelectorAll('option')`, jQuery-style
patterns in third-party code) would have to skip past. The `WeakMap`
keeps the instance findable for the wrapper's API while leaving the
element's own attribute / property surface untouched.

**2. The `WeakMap` allows GC of detached elements automatically.**
When a `<select>` is removed from the DOM and there are no other
references to it, the `WeakMap` entry becomes eligible for garbage
collection along with the element. There is no leak from the wrapper
holding strong references to dead nodes. (The TomSelect instance
itself holds a reference to the `<select>`, but `destroy()` breaks
that — see "Lifecycle" below.)

**3. The pattern matches the wrapper's intent.** The element is a
TomSelect-controlled object; the wrapper is the registry that says
"this element is upgraded, here is its instance." A `Map`-style
external registry is the right shape; a property-on-element pattern
suggests "this element OWNS this state," which it doesn't.

The trade-off is that `el.lnSelect` is `undefined` — consumers must
go through `window.lnSelect.getInstance(el)`. This is documented in
the README and is the load-bearing detail that makes the dead-code
branch in `ln-autosave.js:97-99` never execute (`restored[k].lnSelect`
is always falsy, so the explicit setValue path is skipped, and the
implicit synthetic-`change` path takes over).

## Why hand-rolled instead of `registerComponent`

Most ln-ashlar components use `registerComponent` from `ln-core` —
a shared scaffold that handles `findElements`, the document-level
`MutationObserver`, the `attributeFilter` for re-init on attribute
addition, and standard `el[ATTRIBUTE]` instance storage. ln-select
does not.

The reason is in `registerComponent`'s assumptions:

- It assumes the instance lives on `el[ATTRIBUTE]`. ln-select needs
  a `WeakMap` (see above).
- It assumes the upgrade is idempotent on `el[ATTRIBUTE]` truthiness.
  ln-select's idempotency check is `instances.has(element)` — a
  WeakMap lookup, not a property check.
- It assumes a uniform constructor signature
  (`new ComponentFn(el)`). ln-select needs to read the JSON config
  from the attribute, parse it, merge with defaults, then call
  `new TomSelect(el, finalConfig)` — the constructor signature is
  TomSelect's, not the wrapper's.
- It assumes destroy logic lives on `el[ATTRIBUTE].destroy`.
  ln-select's destroy logic is in `destroySelect(element)` and
  manipulates the `WeakMap`.

Forcing all four into `registerComponent`'s shape would mean either
extending the helper with `WeakMap` mode + custom-constructor mode
(adding complexity to a shared primitive used by 15+ components) or
forking it inside ln-select. The hand-rolled observer is simpler,
contained to the wrapper, and lets the wrapper's lifecycle match
TomSelect's expectations exactly.

The downside is duplicated boilerplate — the observer setup at
lines 89-134 mirrors the pattern `registerComponent` provides. The
duplication is small (40 lines) and the divergent requirements
justify it.

## Construction flow

### 1. Script load (lines 12-21)

The IIFE runs. It checks `window.TomSelect`. If missing, log a
`console.warn` and install a no-op API:

```javascript
if (!TomSelect) {
    console.warn('[ln-select] TomSelect not found. Load TomSelect before ln-ashlar.');
    window.lnSelect = {
        initialize: function () {},
        destroy: function () {},
        getInstance: function () { return null; },
    };
    return;
}
```

The `return` exits the IIFE before the observer is registered, before
the WeakMap is created, before `initializeAll()` is called.
`<select data-ln-select>` elements remain native; the page works.

### 2. WeakMap creation (line 22)

`const instances = new WeakMap()`. Module-scoped, captured by every
function below via closure. There is no global escape hatch; only
the three methods on `window.lnSelect` (lines 147-151) read or
write the map.

### 3. DOM-ready scheduling (lines 137-145)

If the document is still loading, defer to `DOMContentLoaded`;
otherwise run immediately:

```javascript
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initializeAll();
        observeDOM();
    });
} else {
    initializeAll();
    observeDOM();
}
```

The order is fixed: scan first (upgrade everything that already
exists), then start the observer (catch everything that arrives
later).

### 4. `initializeAll()` (lines 83-87)

Walks `document.querySelectorAll('select[data-ln-select]')` and
calls `initializeSelect(el)` for each. Idempotent at the
`instances.has(element)` guard (line 25), so a duplicate call is
a no-op.

### 5. `observeDOM()` (lines 89-135)

Sets up the document-level `MutationObserver`. Wrapped in
`guardBody(...)` so the call defers if `<body>` is not yet parsed.
The observer watches:

```javascript
{
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-ln-select'],
}
```

Three mutation paths are handled (lines 92-124):

- **`mutation.type === 'attributes'`** — `data-ln-select` was
  added to or removed from an existing element. If the element
  matches `select[data-ln-select]`, call `initializeSelect`
  (idempotent). The wrapper does NOT explicitly handle attribute
  removal — the observer fires, but the matcher fails (the
  element no longer has the attribute), and nothing happens.
  Stale instances stay alive until DOM removal. This is a
  potential gap; see "What's not handled" below.
- **`addedNodes`** — new elements (or subtrees containing them)
  added to the DOM. Walk the added node and its descendants, find
  every `select[data-ln-select]`, call `initializeSelect` for each.
- **`removedNodes`** — elements removed from the DOM. Same walk,
  call `destroySelect` for each. This is the auto-cleanup path
  that prevents leaks for AJAX-replaced subtrees.

## `initializeSelect` — the upgrade pipeline

Lines 24-70:

1. **Guard** — `if (instances.has(element)) return;`. Idempotent
   for repeated calls.
2. **Read JSON config** — `element.getAttribute('data-ln-select')`,
   parse with try/catch. Invalid JSON logs `[ln-select] Invalid JSON
   in data-ln-select attribute:` and falls back to `{}` — degraded,
   not crashed.
3. **Merge defaults** — the wrapper's seven defaults
   (`allowEmptyOption`, `controlInput`, `create`, `highlight`,
   `closeAfterSelect`, `placeholder`, `loadThrottle`), then the
   user's config on top. The placeholder default reads
   `element.getAttribute('placeholder')` first, falling back to
   `'Select...'`.
4. **`new TomSelect(element, finalConfig)`** — wrapped in a
   try/catch (lines 50-69). On success, store the instance in the
   WeakMap (`instances.set(element, tomSelect)`). On failure, log
   `[ln-select] Failed to initialize Tom Select:` and exit — the
   element stays native, the WeakMap entry is not created, the
   form-reset hookup is not wired.
5. **Form-reset hookup** — if the element has a `<form>` ancestor
   (`element.closest('form')`), attach a `reset` listener that
   defers `clear` + `clearOptions` + `sync` to the next tick:

   ```javascript
   const resetHandler = () => {
       setTimeout(() => {
           tomSelect.clear();
           tomSelect.clearOptions();
           tomSelect.sync();
       }, 0);
   };
   form.addEventListener('reset', resetHandler);
   tomSelect._lnResetHandler = resetHandler;
   tomSelect._lnResetForm = form;
   ```

The `setTimeout(0)` defers TomSelect's reset action until AFTER the
platform's native `form.reset()` has restored the underlying
`<select>` to its server-rendered defaults. Without the defer,
TomSelect would call `sync()` while `<select>` was still in its
mid-reset state and re-read whatever was there — typically the
just-cleared (or worse, half-cleared) value. The next-tick defer
gives the platform's reset a chance to finish.

The two underscore-prefixed properties stored on the TomSelect
instance (`_lnResetHandler`, `_lnResetForm`) are bookkeeping for
`destroySelect` so it can call `removeEventListener` symmetrically.
They are wrapper-internal; consumers must not read or write them.

## `destroySelect` — the teardown pipeline

Lines 72-81:

```javascript
function destroySelect(element) {
    const instance = instances.get(element);
    if (instance) {
        if (instance._lnResetForm && instance._lnResetHandler) {
            instance._lnResetForm.removeEventListener('reset', instance._lnResetHandler);
        }
        instance.destroy();
        instances.delete(element);
    }
}
```

Three steps:

1. **Unwire the reset listener** — using the bookkeeping
   properties stored at init.
2. **Call `tomSelect.destroy()`** — TomSelect's own teardown,
   which removes the `.ts-wrapper` DOM, restores the original
   `<select>`'s `display`, and detaches every TomSelect-internal
   listener.
3. **Delete the WeakMap entry** — so a subsequent
   `initializeSelect` on the same element will succeed (no longer
   a no-op).

The function is idempotent for already-destroyed elements (the
`if (instance)` guard short-circuits if the WeakMap has no entry).

## What's not handled

Three edge cases the wrapper does NOT address:

### Attribute removal does not auto-destroy

```javascript
select.removeAttribute('data-ln-select');
// → observer fires (attributeFilter matches)
// → matcher select[data-ln-select] fails (attribute is gone)
// → no branch matches; the existing instance stays alive
```

The instance keeps its TomSelect DOM, keeps the form-reset
listener, keeps the WeakMap entry. The user-perceived effect is
that the `<select>` looks the same as before — the `.ts-wrapper`
is still rendered and TomSelect is still managing it.

The clean teardown for "stop using ln-select on this element" is:

```javascript
window.lnSelect.destroy(element);
element.removeAttribute('data-ln-select');
```

The wrapper does not enforce this — the documented assumption is
that DOM removal (which DOES auto-destroy via `removedNodes`) is
the canonical lifecycle, not attribute removal.

### Mid-life config change does not re-init

```javascript
select.setAttribute('data-ln-select', '{"create":true}');
// (was previously '{}' or boolean)
// → observer fires
// → initializeSelect called
// → instances.has(element) is true
// → returns early; new config is ignored
```

The WeakMap-presence guard is "have we initialized this element?",
not "has the config changed?" Mutating the attribute value does
NOT reconfigure TomSelect. To switch configs:

```javascript
window.lnSelect.destroy(select);
select.setAttribute('data-ln-select', '{"create":true}');
window.lnSelect.initialize(select);
```

Or in one mutation that re-triggers the observer cleanly:

```javascript
window.lnSelect.destroy(select);
// observer-friendly: remove + re-add the attribute
select.removeAttribute('data-ln-select');
select.setAttribute('data-ln-select', '{"create":true}');
// initializeSelect runs at the second observer tick (the one for
// the attribute addition), reads the new config, upgrades fresh
```

### TomSelect-load timing race (script-injection scenario)

If a project injects the TomSelect script tag dynamically AFTER
ln-ashlar has already loaded, the `if (!TomSelect) return;` at
line 17 has already fired and installed the no-op API. The
observer was never registered. Loading TomSelect afterwards does
nothing.

The fix is to load TomSelect with a regular `<script>` tag in
document order, before ln-ashlar. There is no retry path inside
the wrapper because the cost (reading `window.TomSelect` on every
init scan) would penalize the common case for an edge case.

## The form-reset `setTimeout(0)`

Lines 56-62:

```javascript
const resetHandler = () => {
    setTimeout(() => {
        tomSelect.clear();
        tomSelect.clearOptions();
        tomSelect.sync();
    }, 0);
};
form.addEventListener('reset', resetHandler);
```

The reset event fires on the form BEFORE the platform actually
clears field values. (Per the HTML spec, `reset` fires synchronously
during form reset; field values are reset as part of the same
event-dispatch sequence, so the order is: reset event fires →
listeners run → field values are reset.)

If TomSelect ran `clear` + `clearOptions` + `sync` synchronously
inside the listener, two things would go wrong:

1. **`clear()`** would set `<select>.value = ''`, but the platform's
   subsequent reset would re-write whatever the server-rendered
   default was — partially undoing the clear.
2. **`sync()`** would re-read the `<select>`'s state at the
   point the listener runs (mid-reset), capturing transient
   values rather than the final post-reset state.

The `setTimeout(0)` schedules the operation as a macrotask, after
the synchronous platform reset has fully completed. By the time
the timer fires, `<select>` is in its reset state, and TomSelect
can read it cleanly.

This is one of those "the platform's order makes you do an extra
tick" cases. The cost is negligible (one macrotask hop); the
correctness gain is total.

## Cross-component coordination — the platform-event protocol

`ln-select` does not import or listen for any other library
component. Composition with the form layer happens through the
platform's `change` event on the underlying `<select>`. The
contract:

| Event | Source | Listener | Effect |
|---|---|---|---|
| `change` on `<select>` | TomSelect commits a user selection | ln-validate's change listener (`ln-validate.js:82-85`) | `_touched = true`, `validate()` runs, `:valid` / `:invalid` event fires, ln-form's submit gate updates |
| `change` on `<select>` | TomSelect commits a user selection | ln-autosave's change listener (`ln-autosave.js`) | `save()` runs, form serialized to localStorage |
| `change` on `<select>` | Synthetic dispatch from `ln-form.fill()` after `populateForm()` | TomSelect's internal change listener | TomSelect re-syncs its visible UI to the new `<select>.value` |
| `change` on `<select>` | Synthetic dispatch from `ln-form.reset()` | TomSelect's internal change listener | TomSelect re-syncs to the post-reset `<select>.value` (after the form-reset hookup has also fired) |
| `change` on `<select>` | Synthetic dispatch from `ln-autosave` after `populateForm()` on restore | TomSelect's internal change listener | TomSelect re-syncs to the restored value |
| `reset` on `<form>` | User clicks a `type="reset"` button | ln-select's form-reset hookup (line 63) | `setTimeout(0)` → `clear` + `clearOptions` + `sync` |
| `reset` on `<form>` | User clicks a `type="reset"` button | ln-autosave's reset listener | localStorage entry cleared |

Every coordination point is the platform's own event surface. No
custom CustomEvents, no imports, no instance lookups.

The dead-code branch in `ln-autosave.js:97-99`
(`if (restored[k].lnSelect && restored[k].lnSelect.setValue)`)
**never executes** because the `WeakMap` keeps the instance off
`element.lnSelect`. The author of ln-autosave (in an earlier pass)
appears to have assumed the property-on-element pattern; the
WeakMap broke that assumption silently. The code reaches the same
end state via the synthetic-`change` dispatch one line above
(line 94-95), so the bug does not manifest as a missing-feature —
it manifests as redundant code that can be deleted in a future
cleanup pass.

## API surface (window.lnSelect)

```javascript
window.lnSelect = {
    initialize: initializeSelect,   // (element) => void
    destroy: destroySelect,         // (element) => void
    getInstance: function (element) {  // (element) => TomSelect | undefined
        return instances.get(element);
    },
};
```

| Method | Description | Common use |
|---|---|---|
| `initialize(element)` | Upgrade the element. Idempotent. Used internally by the observer; also exposed for manual calls (Shadow DOM, iframe, manual race against the observer's tick). | Rare. Most consumers do not need this. |
| `destroy(element)` | Tear down the TomSelect instance, unwire the form-reset listener, delete the WeakMap entry. Used internally by the observer's `removedNodes` path. | Rare; only for SPA flows where a parent component manages the lifecycle and unmounts before DOM removal. |
| `getInstance(element)` | Return the TomSelect instance, or `undefined` if not upgraded. The single source of truth for finding the wrapper. | Common. Any project code that needs the TomSelect API goes through this. |

There is no `reinit()`, no `getAll()`, no `forEach()`, no event
emitter on `window.lnSelect`. The API is intentionally narrow.
Project code that needs the TomSelect instance reaches for it via
`getInstance(el)` and uses TomSelect's own API from there.

## Configuration merge — defaults vs user

Lines 38-48:

```javascript
const defaultConfig = {
    allowEmptyOption: true,
    controlInput: null,
    create: false,
    highlight: true,
    closeAfterSelect: true,
    placeholder: element.getAttribute('placeholder') || 'Select...',
    loadThrottle: 300,
};

const finalConfig = { ...defaultConfig, ...config };
```

The merge is shallow object spread — user-provided keys overwrite
default keys. There is no deep merge. For nested options
(`render: { option: ..., item: ... }`), the entire `render` object
is replaced, not merged.

The default choices are tuned for admin-form contexts:

| Default | Why |
|---|---|
| `allowEmptyOption: true` | Honor `<option value="">Select…</option>` as a real selectable choice. Without this, TomSelect filters empty options out of the dropdown — surprising for forms where "no selection" is intentional. |
| `controlInput: null` | Hide the type-to-search input on single-select (it appears as a thin underline in TomSelect's default UI). For most admin selects with <50 options, the dropdown click + arrow-key navigation is enough; the type-ahead adds visual noise. Multi-select implicitly has the input visible inline with the chip pills. Set `controlInput: '<input>'` to re-enable. |
| `create: false` | The default is "fixed list of options" — typical for status/role/category dropdowns. Override to `true` for tag inputs. |
| `highlight: true` | Bold the matched substring in the dropdown. Cheap UX win; on by default. |
| `closeAfterSelect: true` | Single-pick: close the dropdown after the user picks. Multi-pick: also close after each pick (not the TomSelect default — which is to stay open until the user clicks elsewhere — but easier to discover for users who don't realize they can keep clicking). Override to `false` for power-user multi-select flows. |
| `placeholder: <element placeholder> \|\| 'Select...'` | Honor the `placeholder` attribute on the `<select>` if set; otherwise generic fallback. The string `'Select...'` is intentionally English and untranslated — projects with `ln-translations` should pass an explicit `placeholder` in the JSON config or via the element attribute. |
| `loadThrottle: 300` | Async load callback throttle in ms. 300ms is a good default for "user has stopped typing" detection. |

Every other TomSelect option is reachable. The merge is shallow,
so callers can pass `{ render: { option: ..., item: ... } }` to
fully replace the rendering pipeline, or `{ plugins: ['remove_button', 'drag_drop'] }`
to enable plugins.

## Lifecycle summary — sequence of operations

```
Script load
    ↓
Check window.TomSelect
    ↓ (missing) → install no-op API → return
    ↓ (present)
Create WeakMap
    ↓
Wait for DOMContentLoaded (or run immediately if already loaded)
    ↓
initializeAll()
    ↓ for each <select[data-ln-select]>:
        ↓ initializeSelect(el):
            ↓ guard: instances.has(el) → return
            ↓ parse JSON config (try/catch)
            ↓ merge with defaults
            ↓ new TomSelect(el, finalConfig) (try/catch)
            ↓ instances.set(el, tomSelect)
            ↓ wire form-reset listener if form ancestor exists
    ↓
observeDOM():
    ↓ guardBody(...):
        ↓ MutationObserver on document.body:
            ↓ attribute mutation on data-ln-select → initializeSelect (idempotent)
            ↓ addedNode → walk + initializeSelect for matches
            ↓ removedNode → walk + destroySelect for matches

User picks option:
    ↓ TomSelect commits internally
    ↓ writes <select>.value
    ↓ dispatches change on <select>
    ↓ ln-validate, ln-autosave, project listeners react

User clicks reset button:
    ↓ form fires reset event
    ↓ ln-select's reset listener runs
    ↓ setTimeout(0) defers TomSelect operations
    ↓ platform completes form reset (fields → defaults)
    ↓ next macrotask: tomSelect.clear() + clearOptions() + sync()

DOM remove:
    ↓ MutationObserver removedNodes path
    ↓ destroySelect(el):
        ↓ removeEventListener('reset')
        ↓ tomSelect.destroy()
        ↓ instances.delete(el)
```

The flow is linear, not graph-shaped. There are no loops, no
re-entry paths, no second sources of truth. Every state change
funnels through the WeakMap.

## Design decisions worth understanding

### Why no `data-ln-select-*` companion attributes?

Other components in ln-ashlar have multi-attribute surfaces
(`data-ln-toggle` + `data-ln-toggle-for` + `data-ln-persist`,
`data-ln-tabs` + `data-ln-tabs-active` + `data-ln-tabs-default`).
ln-select has only `data-ln-select` (with optional JSON value).

The reason: TomSelect's configuration surface is large (50+ options).
Translating each into a `data-ln-select-*` attribute would either
duplicate TomSelect's docs or pick a subset arbitrarily. The JSON-
in-attribute pattern hands the entire surface to the consumer and
keeps the wrapper's attribute API tiny.

The downside is JSON's lack of function values — `load`, `render`,
`onChange`, `score`, `sortField` (when sortField is a function) all
require an imperative path. The wrapper accepts this limitation:
the JSON path covers 90% of admin-form use cases; the imperative
path (via `getInstance(el)`) covers the rest.

### Why no events emitted by the wrapper?

ln-select does not dispatch `ln-select:initialized`,
`ln-select:destroyed`, or any other custom event. Two reasons:

**1. TomSelect already emits its own events.** `change`, `dropdown_open`,
`dropdown_close`, `item_add`, `item_remove`, `option_add`,
`option_remove`, `type`, `load`. Consumers reach them via
`ts.on('event', handler)`. Re-emitting them with an `ln-select:`
prefix would be lossy proxy duplication.

**2. The platform's `change` event on the underlying `<select>` is
the contract every other component already listens for.**
ln-validate, ln-autosave, ln-form — none of them care about a
TomSelect-specific event. Adding one would create a parallel
contract that the rest of the form layer would have to opt into.

The result: the wrapper is event-quiet, project code listens to
TomSelect directly via `ts.on(...)`, and the form layer listens
to the platform `change`. Three audiences, three event surfaces,
no overlap.

### Why no `el.lnSelect` even for back-compat?

The README and earlier pilots flagged that `ln-autosave.js:97-99`
attempts to read `restored[k].lnSelect`, which is always falsy.
Adding `el.lnSelect = tomSelect` to the constructor would "fix"
that branch and let it execute the explicit `setValue` path.

The wrapper deliberately does not do this. The reason is the
property-collision concern outlined under "Why a WeakMap" — adding
`el.lnSelect` would let third-party code that does
`for (const key in select)` or `Object.keys(select)` see the
TomSelect instance, which is the wrong shape for both directions
(consumer code shouldn't reach for it that way; TomSelect-internal
queries shouldn't trip over it).

The `ln-autosave.js:97-99` branch is dead code; the practical
integration goes through the synthetic-`change` dispatch one line
above. Both reach the same end state. The right fix is to delete
the dead branch in a future cleanup pass, not to add a property
that introduces collisions.

## Summary

ln-select is a 152-line lifecycle wrapper. It does not invent any
behavior; it composes:

- TomSelect's API (everything visual)
- The platform's `change` event (cross-component coordination)
- A `WeakMap` (instance registry, GC-friendly, off-element)
- A `MutationObserver` (auto-init, auto-destroy)
- A `setTimeout(0)` (post-reset re-sync)
- A `try/catch` (graceful degradation on missing TomSelect or
  malformed JSON)

The design is "be invisible to the rest of the library." Every
form-layer component composes through the platform `change` event;
ln-select neither imports nor exports any custom event channel.
The `<select>` element looks like a normal `<select>` to
`serializeForm`, to `populateForm`, to `dom.checkValidity()`. The
TomSelect-driven UI is a pure visual / interaction enhancement
that runs on top.

That invisibility is what makes the wrapper composable. Drop
`data-ln-select` on a `<select>`, drop `data-ln-validate` on the
same element, drop `data-ln-autosave` on the parent form — three
attributes, one cohesive UX, zero coordinator wiring.
</content>
</invoke>
