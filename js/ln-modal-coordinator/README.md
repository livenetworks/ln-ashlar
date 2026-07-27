# ln-modal-coordinator

A zero-instance, document-level singleton that wires `[data-ln-modal-for]` triggers, hash navigation, native-submit resume, and form-completion auto-close across every `ln-modal` on the page. `ln-modal` itself only knows `open`/`close`; this coordinator is the Layer-2 policy that decides *when* and *with what data*.

---

## 🧭 Philosophy & Architecture

1. **Layer separation.** `ln-modal` is a Layer 1 primitive: it manages the `data-ln-modal="open|close"` attribute and native `<dialog>` mechanics only — no trigger resolution, no record filling, no submit handling. `ln-modal-coordinator` is the Layer 2 coordinator that adds all of that on top, without `ln-modal` ever being aware it exists.
2. **No per-element instance.** There is nothing to construct per modal. The whole file is one IIFE guarded by `window.lnModalCoordinator`, attaching a handful of document-level listeners once per page load.
3. **Command events, not direct calls.** The coordinator never flips `data-ln-modal` itself — it dispatches `ln-modal:request-open` / `ln-modal:request-close` and lets `ln-modal`'s own attribute-sync logic own the transition (and any cancellation via `ln-modal:before-open`/`before-close`).

---

## 📦 Minimal Blueprint

No markup is required to opt in — the coordinator listens on `document` and activates for any `[data-ln-modal-for]` trigger or `[data-ln-modal]` panel already on the page.

```html
<!-- Trigger carries the record as a dataset — becomes the fill payload -->
<button data-ln-modal-for="user-modal" data-ln-modal-id="42" data-ln-modal-name="Jane Doe">
  Edit Jane Doe
</button>

<dialog class="ln-modal" data-ln-modal id="user-modal">
  <form data-ln-field="name">
    <!-- ... -->
  </form>
</dialog>
```

Clicking the trigger sets `data-ln-modal-mode="edit"` (a record was harvested), fills the modal via `lnCore.fill`, and dispatches `ln-modal:request-open`.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-modal-for="modalId"` | Trigger (`<button>`, `<a>`) | Opens/closes the `[data-ln-modal][id="modalId"]` panel on click. |
| `data-ln-modal-mode="edit\|new"` | Trigger (optional) | Forces the mode instead of letting it be inferred from whether a record was harvested. |
| `data-ln-modal-{field}` | Trigger | Record fields harvested off the trigger's dataset (excluding `data-ln-modal-for`/`-close`/`-mode`) and passed to `lnCore.fill`. |
| `<a href="#modalId">` / `<a href="#modalId:param">` | Anchor | Opens the modal by hash; `param` (if present) is passed as the fill id via `ln-fill:request`. |

Cross-link: see [`js/ln-modal/README.md`](../ln-modal/README.md) for the primitive's own `data-ln-modal`/`data-ln-modal-close` contract.

---

## ⚡ DOM Events

### Consumed

| Event | Source | Behavior |
| :--- | :--- | :--- |
| `click` | `document` | Resolves `[data-ln-modal-for]` triggers and `<a href="#modalId">` hash anchors. |
| `submit` | `document` | Inside a modal, stores a `sessionStorage` pending-flag and clears the hash so a native (non-AJAX) submit + reload can resume. |
| `hashchange` | `window` | Re-syncs every `[data-ln-modal][id]`'s open/close state against the URL hash. |
| `ln-modal:before-open` | `document` | Mode `new` → resets the modal's forms before it opens. |
| `ln-modal:open` | `document` | Reads the hash param for the modal's id and either dispatches `ln-fill:request` (`edit`) or resets the form (`new`, empty param). |
| `ln-modal:close` | `document` | Clears the pending flag and hash; mode `new` → resets the modal's forms. |
| `ln-form:success` / `ln-ajax:success` | `document` | Closes the modal and resets its forms. |

### Dispatched

| Event | Target | Payload (`detail`) | Description |
| :--- | :--- | :--- | :--- |
| `ln-modal:request-open` | The modal | `{}` | Sent after trigger/hash resolution to open the modal. |
| `ln-modal:request-close` | The modal | `{}` | Sent to close the modal (trigger toggle, form success, pending-resume with no errors). |
| `ln-fill:request` | The modal | `{ id }` | Sent when a hash param (or a live hash change while open) identifies the record to fill. |

---

## 🔧 Internals

Source: `js/ln-modal-coordinator/src/ln-modal-coordinator.js`. One IIFE, no `_component` constructor, no `MutationObserver` — every mechanism below is a single document/window-level listener bound once at load, guarded by `window.lnModalCoordinator`.

### Trigger delegation

The `click` listener resolves `e.target.closest('[data-ln-modal-for]')`, looks up the target modal by id, and bails if it isn't an initialized `ln-modal` (`target.lnModal` missing). It harvests a record from the trigger's `dataset`, walking every `lnModal*` key, skipping the reserved `lnModalFor`/`lnModalClose`/`lnModalMode`, and lower-casing the first letter of the remaining suffix (`data-ln-modal-name` → `record.name`). Mode resolution: an explicit `data-ln-modal-mode` on the trigger wins; otherwise a non-empty harvested record implies `edit`, an empty one implies `new`. `edit` fills via `window.lnCore.fill(target, record)`; `new` resets the modal's forms via `_resetModalForm`. Finally it toggles based on the modal's current `data-ln-modal` value: `open` → dispatch `request-close`, anything else → dispatch `request-open`.

### Hash navigation

A click on `a[href^="#"]` is parsed with `hashParse` into a `{ namespace: param }` map; if any namespace matches an initialized modal's `id`, `hashLinkClick(e)` gates the default navigation and `hashSet(ns, param)` writes the hash — the actual open/close is driven by the `hashchange` listener below, not the click handler itself.

`_syncHashModals` (bound to `hashchange`, and run once on load after `DOMContentLoaded`/`setTimeout(0)`) walks every `[data-ln-modal][id]`. It first resolves any pending native-submit resume (see below), then compares `hashGet(hashNs)` against the modal's current open state: hash present + closed → `request-open` (mode `edit` if the param is non-empty, else `new`); hash present + already open with a changed param → re-dispatch `ln-fill:request` (or reset if the param went empty); hash absent + open → `request-close`. A re-entrancy guard (`_inSync`) prevents the listener from recursing on the `hashSet` calls it triggers indirectly through `ln-modal`'s own attribute sync.

### Native-submit resume

On `submit` inside a `[data-ln-modal]` with an `id`, the coordinator writes `sessionStorage['ln-modal-pending:{id}'] = 'true'` and clears the hash (`hashSet(modal.id, null)`) *before* the native submit/reload happens, so the browser reloads on a clean URL. On the next load, `_syncHashModals` checks the pending flag first: if cleared and no error markers are found (`.has-error`, `[data-ln-validate-error]`, `.form-error`, `.alert-danger` — checked both document-wide and inside the modal) it removes the flag, clears the hash, dispatches `request-close`, and resets the form; if error markers are present, it reopens in `edit` mode instead so the user sees their errors in-context.

### Form-completion auto-close

`ln-form:success` and `ln-ajax:success` share one handler: resolve the closest `[data-ln-modal]` ancestor of the event target, clear the pending flag and hash, dispatch `request-close`, and reset the form. `ln-modal:close` performs the same pending/hash cleanup and additionally resets forms when the mode is `new` (an `edit` close leaves the just-submitted data visible rather than blanking it).

### `_resetModalForm`

Shared by every reset path above: clears `textContent` on every `[data-ln-field]` descendant, then for every `<form>` in the modal calls `window.lnCore.lnFill(form, null)` if available, falling back to the native `form.reset()` otherwise.
