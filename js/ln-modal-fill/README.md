# ln-modal-fill

> Fills a hash-bound modal's form on open from a `[data-ln-fill-id]` source.
> The deep-link / Back-Forward counterpart to `ln-fill`'s click-driven fill.

---

## Philosophy

`ln-modal-fill` is a zero-config coordinator. It listens for `ln-modal:open`
events on `document` and dispatches an `ln-fill:request` event on the target modal,
delegating the search and form filling to the `ln-fill` global behavior.
There is no markup attribute of its own — a single global document listener
serves every hash-bound modal on the page.

The coordinator pattern: knows two contracts (the `ln-modal:open` event and
the `ln-fill:request` event) but imports no component source.

---

## How it works

1. A hash-bound modal opens (via anchor `#id:param`, deep-link, or
   Back-Forward) and bubbles `ln-modal:open` with `{ target, param }`.
2. `ln-modal-fill` catches it on `document`. Hash modals always carry a
   `param` key (null → new mode, a value → edit mode). Plain non-hash
   modals omit the key entirely — these opt out with no request dispatched.
3. The coordinator dispatches an `ln-fill:request` CustomEvent directly on the
   target modal with `{ id: param }` in `e.detail`.
4. `ln-fill` catches `ln-fill:request` on `document`:
   - **New mode** (`param === null`): dispatches `window.lnCore.lnFill(modal, null)`,
     which drives `ln-form`'s `reset()` and `_applyActionMode(null)` (RESTful action routing:
     restores the base action URL and clears `_method`), and clears
     `[data-ln-fillable]` display elements.
   - **Edit mode** (`param` truthy): searches the DOM for `[data-ln-fill-id="<param>"]`
     (preferring a source whose `data-ln-fill-form` is inside the modal), builds the fill
     record from the source's `data-ln-fill-*` dataset attributes, and dispatches the fill
     via `window.lnCore.lnFill(modal, record)`.

---

## Why it exists (vs `ln-fill`)

| Trigger path | Handler |
|---|---|
| User **clicks** an `<a href="#id:42" data-ln-fill-*>` source | `ln-fill` fills the form immediately on click |
| **Reload / deep-link / Back-Forward** to `#id:42` — no click | `ln-modal-fill` fills the form on `ln-modal:open` |
| Programmatic `hashSet` (no click, no link) | `ln-modal-fill` fills the form on `ln-modal:open` |

On a click of an `<a href="#id:42" data-ln-fill-*>` anchor, `ln-fill` already
fills the form and `ln-modal-fill` also fires (double-fill is idempotent). On
a reload or Back-Forward there is no click — only `ln-modal-fill` fills.

---

## No re-open guarantee

`ln-modal-fill` drives the fill via `window.lnCore.lnFill` **only** — it
never calls `.click()` on the source, never writes `setAttribute`, and never
calls `hashSet`. `lnFill` only dispatches `ln-fill` CustomEvents; it writes
no attributes and no hash. The already-open modal stays open and the URL
is untouched — re-open is impossible by construction.

---

## Blueprint

```html
<!-- Source = the hash anchor trigger; doubles as the fill source -->
<a href="#user-modal:42"
   data-ln-fill-id="42"
   data-ln-fill-form="user-form"
   data-ln-fill-name="Ada Lovelace">Edit Ada</a>

<dialog class="ln-modal" data-ln-modal data-ln-modal-mode="new" id="user-modal">
    <form id="user-form" data-ln-form>
        <input name="name">
        …
    </form>
</dialog>
```

- The `<a>` anchor is both the trigger and the fill source.
- Clicking it sets the hash natively; `ln-fill` fills on click; `ln-modal-fill`
  fills on reload or Back-Forward.
- `data-ln-fill-form="user-form"` resolves to the form inside the modal, so
  the coordinator prefers this source when disambiguation is needed.
- `data-ln-fill-id="42"` becomes `record.id = "42"` (fills a hidden id field
  or any `[data-ln-fillable]` that maps the `id` key).
- `data-ln-fill-name="Ada Lovelace"` becomes `record.name = "Ada Lovelace"`.

### New mode (no param)

```html
<a href="#user-modal" data-ln-fill-form="user-form">New record</a>
```

- Bare `#user-modal` → `param` is `null` (the `param` key is still present,
  because it is a hash modal) → `ln-modal-fill` dispatches
  `window.lnCore.lnFill(modal, null)`, which drives `ln-form`'s
  `reset()` and `_applyActionMode(null)` (RESTful action routing: restores
  the base action URL and clears the hidden `_method` field), and clears any
  `[data-ln-fillable]` display elements.
- `ln-fill` also resets the form on click (because `data-ln-fill-form` is set
  but no other fill keys exist, the record is empty and `lnFill(form, null)`
  resets). The two are idempotent — whichever fires first, the result is a
  clean empty form in new mode.

---

## Integration

| Format | Path |
|---|---|
| Unified bundle (IIFE) | `demo/dist/ln-ashlar.iife.js` |
| Standalone bundle | `js/ln-modal-fill/ln-modal-fill.js` |
| ESM source | `js/ln-modal-fill/src/ln-modal-fill.js` |

`ln-modal-fill` must load **after** `ln-modal` and `ln-fill`/`ln-form`. The
unified bundle (`js/index.js`) guarantees this order. When loading standalones,
ensure the same load order.

No HTML attributes, no wrapper element — drop the script and it auto-activates.

---

## Related

- **[`ln-modal`](../ln-modal/README.md)** — hash addressing (universal by `id`),
  emits `ln-modal:open { target, param }`.
- **[`ln-fill`](../ln-fill/README.md)** — click-driven fill from `data-ln-fill-*`
  sources (complement, not replacement).
- **[`ln-form`](../ln-form/README.md)** — fill target (`data-ln-form`); receives
  `ln-fill` events and calls `this.fill(record)`. A null `ln-fill` (new mode)
  triggers `reset()` + `_applyActionMode(null)` — RESTful action routing:
  restores the base action URL and clears the hidden `_method` field.
- **Architecture doc** — [`docs/js/modal-fill.md`](../../docs/js/modal-fill.md).
- **Coordinator doctrine** — [`docs/architecture/coordinator.md`](../../docs/architecture/coordinator.md).
