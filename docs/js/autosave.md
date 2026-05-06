# Autosave — architecture reference

> Implementation notes for `ln-autosave`. The user-facing contract
> lives in [`js/ln-autosave/README.md`](../../js/ln-autosave/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-autosave/ln-autosave.js` (~130 lines).

## Position in the architecture

`ln-autosave` is an **orthogonal persistence layer** that attaches to
the Submit layer's `<form>` boundary in the four-layer architecture
described in [`docs/architecture/data-flow.md`](../architecture/data-flow.md).
It is NOT one of the four named layers (Data, Submit, Render, Validate).
Drafts are not records; localStorage is not the cache.

localStorage is the right storage for this use case: synchronous (no race
window on submit), origin-isolated, persisted across tab close. Async
storage (IndexedDB, `ln-store`) would force the component to manage
in-flight save promises and reason about the case where a save is still
pending when the form submits. The synchronicity is the load-bearing
property. The 5MB cap is the price; for typical forms it is generous.

The component composes with `ln-form`, `ln-validate`, and `ln-autoresize`
transparently — by emitting synthetic `input` and `change` events on every
restored field, not by importing or listening for any sibling component's
custom events.

## State

Each `[data-ln-autosave]` form gets a `_component` instance stored at
`element.lnAutosave`. Instance state:

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLFormElement` | Whole instance | The form — the constructor's argument. |
| `key` | `string` | Captured at construction | Fully-resolved storage key (`ln-autosave:{pathname}:{identifier}`), computed once by `_getStorageKey` and never re-read. |
| `_onFocusout` | `Function` | Whole instance | Bound handler for `focusout`. Held for symmetric `removeEventListener` in `destroy()`. |
| `_onChange` | `Function` | Whole instance | Bound handler for `change`. Same reason. |
| `_onSubmit` | `Function` | Whole instance | Bound handler for `submit`. Calls closure-scoped `_clear()`. |
| `_onReset` | `Function` | Whole instance | Bound handler for `reset`. Calls `_clear()`. |
| `_onClearClick` | `Function` | Whole instance | Delegated handler for clicks on `[data-ln-autosave-clear]` descendants. |
| `_onInput` | `Function \| undefined` | Whole instance | Present only when `data-ln-autosave-debounce-input` is set on the form. Debounced handler for `input`. |
| `inputTimer` | `number \| null` | Closure-scoped | Active `setTimeout` handle for the debounced input save. Null when no timer is pending. Accessed via `_getInputTimer()` thunk in `destroy()`. |

`key` is captured once at construction. Mutating `data-ln-autosave`, the
form's `id`, or the History API URL does NOT re-key the instance. Destroy
and re-mount to switch.

## Construction flow

`registerComponent('data-ln-autosave', 'lnAutosave', _component, 'ln-autosave')`
wires the standard scaffolding from `js/ln-core/helpers.js`:

1. Registers `[data-ln-autosave]` with the shared `MutationObserver`.
2. The observer watches `document.body` for new forms (childList) and for
   the attribute landing on existing forms (attribute filter). Matches run
   `new _component(form)`.
3. `_getStorageKey(form)` resolves the key. If it returns `null` (neither
   attribute value nor `form.id` resolves), the constructor logs a warning
   and returns — `el.lnAutosave` is never set.
4. With `key` resolved, the constructor sets `this.dom` and `this.key`, then
   defines five closure-scoped helpers (`_save`, `_restore`, `_clear`) and
   five bound handlers (`_onFocusout`, `_onChange`, `_onSubmit`, `_onReset`,
   `_onClearClick`). The handlers call the closure helpers — they are not
   on the prototype and cannot be called from outside the instance.
5. The five handlers are attached to the form (`focusout`, `change`,
   `submit`, `reset`, `click`).
6. If `data-ln-autosave-debounce-input` is set, `_resolveDebounceMs(form)`
   returns the debounce interval; `_onInput` is constructed and attached.
7. `_restore()` runs immediately — the construction-time restore.
8. The constructor returns `this`; `registerComponent` assigns it to
   `form.lnAutosave`.

Note: the `:before-restore` event dispatches synchronously inside the
constructor, before `form.lnAutosave` is set by `registerComponent`. A
listener that needs to call methods on the instance should defer via
`queueMicrotask` — by the time the microtask runs, the back-reference
is set.

## Save flow

The closure-scoped `_save()` helper (defined inside the constructor):

```
1. data = serializeForm(form)
2. try { localStorage.setItem(key, JSON.stringify(data)) }
   catch { return }
3. dispatch('ln-autosave:saved', { target: form, data: data })
```

The `try/catch` swallows all errors silently — `QuotaExceededError`,
localStorage-disabled, `SecurityError`. If the write fails, no event fires.
There is no `:save-failed` event (unlike `ln-store:quota-exceeded`).

`:saved` fires AFTER the write succeeds. There is no cancelable `:before-save`.

## Restore flow

The closure-scoped `_restore()` helper:

```
1. raw = localStorage.getItem(key)              [try/catch — silent]
2. if (!raw) return
3. data = JSON.parse(raw)                       [try/catch — silent]
4. before = dispatchCancelable('ln-autosave:before-restore')
5. if (before.defaultPrevented) return
6. restored = populateForm(form, data)
7. for each restored field:
     a. dispatchEvent(new Event('input', { bubbles: true }))
     b. dispatchEvent(new Event('change', { bubbles: true }))
        // ln-select integration is via this dispatched 'change' event;
        // TomSelect listens on the underlying <select> and re-syncs its UI.
8. dispatch('ln-autosave:restored', { target, data })
```

The dead `lnSelect.setValue` branch from the previous version is removed.
TomSelect integration continues to work via the dispatched `change` event.

Both `input` and `change` are dispatched on every field so every listener
fires regardless of field type — `input` for text/textarea, `change` for
checkbox/radio/select. Some listeners may run twice; the cost is microseconds.

## Clear flow

The closure-scoped `_clear()` helper:

```
1. try { localStorage.removeItem(key) }
   catch { return }
2. dispatch('ln-autosave:cleared', { target: form })
```

Idempotent — removing a non-existent key dispatches the event anyway.

Three triggers invoke `_clear()`:

1. **`form.submit` event** — native submit (button click, Enter, `form.requestSubmit()`).
   Note: `form.submit()` programmatically does NOT fire the `submit` event — use
   `form.requestSubmit()` if you need both platform validation and autosave clear.
2. **`form.reset` event** — fired by `<button type="reset">` or `form.reset()`.
3. **Click on `[data-ln-autosave-clear]`** — delegated through `_onClearClick`.

`_clear()` does NOT touch field values — only the localStorage entry.

## MutationObserver

The shared observer registered by `registerComponent` watches:

- **`childList` (`subtree: true`)** — new `[data-ln-autosave]` forms added to
  the DOM. AJAX-injected modals and dynamically-created forms initialise.
- **`attributes` (`attributeFilter: ['data-ln-autosave']`)** — attribute added
  to an existing form.

`extraAttributes` is empty in the `registerComponent` call, so
`data-ln-autosave-clear` and `data-ln-autosave-debounce-input` are NOT in the
attributeFilter. The clear-button delegate uses `closest()` on every click, so
adding `data-ln-autosave-clear` to a button after construction does work. The
debounce attribute is read once at construction; mutating it later has no effect.

## Storage key mechanics

`_getStorageKey(form)` resolves the key as
`STORAGE_PREFIX + window.location.pathname + ':' + identifier`, where
`identifier` is the attribute value (if non-empty) or `form.id`. Empty attribute
(`data-ln-autosave=""`) is falsy, so it falls through to `form.id`. Missing both
returns `null`.

The pathname is captured once at construction. If the page navigates via History
API without re-mounting the form, the key stays tied to the construction pathname.
For SPA flows, re-mount the form on navigation or use a URL-independent key
(`data-ln-autosave="form-name"`).

## Synthetic event dispatch on restore

Both `input` and `change` are dispatched on every restored field. Different
field types rely on different events:

- Text / textarea — `input` is the reliable signal (ln-validate, ln-autoresize).
- Checkbox / radio / select — `change` is the reliable signal.

Dispatching both ensures every listener fires regardless of which event it
cares about. The cost is a few extra handler runs per field.

Events are dispatched AFTER `populateForm` has written all fields, so
cross-field validation listeners see the fully-restored form.

## Why debounce is opt-in only on `input`

The `focusout` and `change` listeners do not need debouncing — field-boundary
events are naturally rate-limited by user behaviour. A user who blurs a field
triggers one `focusout`; there is no flood to debounce.

The `input` event is different: it fires on every keystroke. For multi-field
forms the `focusout`/`change` pair is sufficient and cheaper. For compose-style
editors where the user never blurs, `input` is the only live signal — hence
`data-ln-autosave-debounce-input` as an opt-in attribute. Default off; one
explicit attribute to enable; the debounce interval is configurable.

## Destroy flow

`_component.prototype.destroy`:

```
1. if (!this.dom[DOM_ATTRIBUTE]) return    [idempotency guard]
2. removeEventListener × 5 (focusout, change, submit, reset, click)
3. if _onInput exists: removeEventListener('input') + clearTimeout(pending timer)
4. dispatch('ln-autosave:destroyed', { target: this.dom })
5. delete this.dom[DOM_ATTRIBUTE]
```

`destroy()` does NOT call `_clear()`. The localStorage entry persists after
destroy. Destroy is "stop auto-saving this form," not "discard the draft."

## Co-located SCSS

There is no `js/ln-autosave/ln-autosave.scss`. The component has no visual
surface — no chrome, no class on the form, no attribute that drives CSS.

## Public window registration

`window.lnAutosave` is the constructor function assigned by `registerComponent`.
`window.lnAutosave(rootElement)` runs a fresh init scan over `rootElement` —
used for Shadow DOM contexts the shared observer cannot see.

## Future work

- **No quota-exceeded event** — silent failure on writes past ~5MB. Add
  `ln-autosave:quota-exceeded` paralleling `ln-store:quota-exceeded`.
- **No before-save cancelable event** — consumers cannot filter the data before
  it lands in localStorage. The workaround (rewrite in `:saved` listener) is
  wasteful.
- **No cross-tab sync** — `storage` event is not observed. Collaborative editing
  needs `ln-store`, not autosave.
- **No expiration / TTL** — drafts persist forever. Consumers that care implement
  schema-versioning via the attribute key.
- **`data-ln-autosave-debounce-input` is per-form, not per-field** — one debounce
  cadence per form. Projects that need different cadences per field need separate
  forms or project-side listeners.
