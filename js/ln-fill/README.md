# ln-fill

> Declarative click-triggered form/display fill. A document-level delegated
> click listener — not a per-element component. Composes with `data-ln-modal-for`
> on the same button.

---

## 1. Philosophy

`ln-fill` is the declarative trigger layer for filling forms and display
regions from a click. It converts flat `data-ln-fill-*` attributes on any
clickable element into a fan-out `lnFill()` call — no JS coordinator required
for the common case.

The underlying primitive is `window.lnCore.lnFill(container, record)`, which
dispatches `ln-fill` at every `[data-ln-form]` and `[data-ln-fillable]`
descendant. `ln-fill` is the module that wraps a click listener around that
primitive so you can drive it entirely from HTML.

### Why a dispatcher function, not a document broadcast

`ln-fill` events are addressed by **dispatch target**, not by payload
filtering. The DOM has no multicast — an event must be born at one node — so
there are two possible addressing models:

1. **Broadcast**: dispatch once at `document` with the target id in `detail`,
   and every consumer subscribes globally and filters "is this for me?".
2. **Targeted dispatch** (ours): dispatch the event directly at the addressed
   element — the DOM tree is the routing infrastructure, `e.target` IS the
   address.

Targeted dispatch wins on three counts. Scaling cost is inverted: with
broadcast every fillable on the page pays a global filter on every fill
anywhere; with targeted dispatch only the addressed element's listener runs,
and its "digest only if addressed to me" guard is an identity check
(`e.target === self.dom` in ln-form), not a string comparison. Containment
addressing: `lnFill(modalEl, record)` fills everything *inside* the modal —
form plus display fillables — without the producer knowing a single id, which
a flat id-addressed broadcast cannot express. Single payload contract: the
`record ?? null` normalization (null = reset) and `bubbles: true` are defined
in one place, shared by every producer (the declarative click trigger,
`ln-modal-fill`, store-sync coordinators).

So `lnFill()` is not an imperative bypass of the event model — it IS the
event dispatcher. The targeted fan-out loop and the payload contract have to
live somewhere; the helper is that single canonical place.

---

## 2. Minimal Blueprint

```html
<!-- Trigger: data-ln-fill-form points to the form id.
     data-ln-fill-<key> attributes become the record. -->
<button
    data-ln-fill-form="event-form"
    data-ln-fill-event-id="42"
    data-ln-fill-title="Annual Conference"
>Edit</button>

<!-- Target form -->
<form id="event-form" data-ln-form>
    <input name="eventId" type="hidden">
    <input name="title">
    <button type="submit">Save</button>
</form>
```

When the button is clicked:
1. `ln-fill` reads `dataset.lnFillForm` → locates `#event-form`.
2. Builds record `{ eventId: "42", title: "Annual Conference" }` from all
   `data-ln-fill-*` keys (excluding the reserved `form` and `store` suffixes).
3. Calls `window.lnCore.lnFill(form, record)`.
4. `ln-form` receives `ln-fill` → calls `this.fill(record)`.

No payload attributes → `lnFill(form, null)` → form resets (calls `this.reset()`).

---

## 3. Attribute Reference

| Attribute | Placement | Description |
|---|---|---|
| `data-ln-fill-form="<id>"` | Any clickable element | Required. ID of the target `<form>`. |
| `data-ln-fill-<key>="<value>"` | Same element | Becomes `record[camelKey]`. Kebab-case is camelCased by the browser dataset API: `data-ln-fill-event-id` → key `eventId`. |

**Reserved suffixes** (ignored, never put in the record):
- `form` (`data-ln-fill-form`) — the target form id
- `store` (`data-ln-fill-store`) — reserved for a future store-source seam

---

## 4. Composing with `data-ln-modal-for`

`ln-fill` intentionally does NOT call `e.preventDefault()`. A trigger may
carry both `data-ln-fill-form` and `data-ln-modal-for` — both document
listeners fire on the same click independently.

```html
<!-- One button fills the form AND opens the modal -->
<button
    data-ln-modal-for="event-modal"
    data-ln-fill-form="event-form"
    data-ln-fill-event-id="42"
    data-ln-fill-title="Annual Conference"
>Edit</button>
```

Order of side-effects per click (both listeners are on `document`):
1. `ln-modal` click listener → opens modal, sets `data-ln-modal-mode`.
2. `ln-fill` click listener → fills form via `lnFill(form, record)`.

### Double-Fill Prevention for Hash-Bound triggers
If a clickable trigger is an anchor link that points to a hash segment (i.e., its `href` attribute contains `#`, such as `<a href="#event-modal:42" ...>`), `ln-fill`'s click listener will **ignore** the click. The fill process is instead delegated entirely to the `ln-modal-fill` coordinator, which will map the resulting hash change and `ln-modal:open` event to an `ln-fill:request` event. This prevents redundant, parallel form-filling operations.

---

## 5. Composing with ln-table row templates

Because `fillTemplate()` now interpolates `{{ key }}` in **element attribute
values** (not only text nodes), per-row trigger data stamps cleanly into
`data-ln-fill-*` attributes at clone time:

```html
<template data-ln-template="events-row">
    <tr data-ln-table-row>
        <td>{{ title }}</td>
        <td>
            <ul>
                <li>
                    <button
                        data-ln-modal-for="event-modal"
                        data-ln-fill-form="event-form"
                        data-ln-fill-event-id="{{ id }}"
                        data-ln-fill-title="{{ title }}"
                        aria-label="Edit"
                    >
                        <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
                    </button>
                </li>
            </ul>
        </td>
    </tr>
</template>
```

`{{ id }}` and `{{ title }}` are replaced by `fillTemplate()` when `ln-table`
clones the row. The resulting static attributes are then read by `ln-fill` on
click — no coordinator needed. This is the canonical pattern for table rows
that open a modal with pre-filled data.

---

## 6. When NOT to use `ln-fill` (use the coordinator instead)

`ln-fill` is click-triggered. Use `window.lnCore.lnFill(container, record)`
directly in a coordinator when the fill is programmatic and not driven by a
user click — for example, when a conflict-resolution handler writes a remote
record into the form:

```js
// Coordinator — store-driven fill after sync conflict
storeEl.addEventListener('ln-data-store:sync-conflict', function (e) {
    window.lnCore.lnFill(modalEl, e.detail.serverRecord);
    modalEl.dataset.lnModalMode = 'edit';
    modalEl.setAttribute('data-ln-modal', 'open');
});
```

Decision rule:

| Trigger | Use |
|---|---|
| User clicks a button or table row action | `data-ln-fill-form` + `data-ln-fill-*` (declarative) |
| Programmatic / store-event-driven | `window.lnCore.lnFill(container, record)` in coordinator |

---

## 7. Integration & Source Files

- **Unified Bundle** — loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE** — for lightweight pages:
  ```html
  <script src="js/ln-fill/ln-fill.js" defer></script>
  ```
- **Active Source (ESM)**: `js/ln-fill/src/ln-fill.js`

---

## Related

- **[`ln-form`](../ln-form/README.md)** — the fill target; `data-ln-fill-as` decoupled key.
- **[`ln-modal`](../ln-modal/README.md)** — `data-ln-modal-*` display namespace fill.
- **[`docs/architecture/data-flow.md §5.7`](../../docs/architecture/data-flow.md)** — `lnFill` primitive reference.
- **[`docs/js/core.md`](../../docs/js/core.md)** — `lnFill`, `fillTemplate`, `populateForm` helpers.
