# modal-fill — architecture

> Bridges hash-param modal opens to form fills: one document listener, zero instances, no state.

The implementation lives in
[`js/ln-modal-fill/src/ln-modal-fill.js`](../../js/ln-modal-fill/src/ln-modal-fill.js).
For consumer-facing usage see
[`js/ln-modal-fill/README.md`](../../js/ln-modal-fill/README.md).

## Where this sits in the layered architecture

> See also: [Hash-state doctrine](../architecture/hash-state.md) §3 Rule 4 — explains why cross-component wiring (like this coordinator) must live outside the components it bridges, and why `ln-modal` emits a generic `ln-modal:open` event rather than filling the form itself.

`ln-modal-fill` is a UI-coordination component (a coordinator), not part
of the data-flow pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It is
markup/event-driven and completely headless — it generates no DOM, injects
no styles, and stores no state.

It operates at the intersection of two contracts:

1. The **`ln-modal:open` event contract** (emitted by `ln-modal` when a
   hash-bound modal opens with a param).
2. The **`data-ln-fill-*` attribute contract** (the same attribute set
   that `ln-fill` uses for click-driven fills).

Like `ln-accordion`, it "knows both contracts" but **imports neither
component's source**. The coupling is at the consumer side (loading order
via `js/index.js`), not in the source file.

## Internal state

None. `ln-modal-fill` is a stateless global document listener.

| Property | Description |
|---|---|
| `window.lnModalFill` | Boolean `true` — double-load sentinel (mirrors `ln-fill`). Set once after the listener is registered. |

There are:

- No instances
- No wrapper element
- No MutationObserver
- No caches or queued records
- No per-modal bookkeeping

Every `ln-modal:open` event is handled fresh from the event's own `detail`.

## Flow

```
ln-modal:open fires (bubbles to document)
  → 'param' key absent?  → no-op (plain non-hash modal — opt out, no fill)
  → detail.target null?  → no-op (guard)
  → dispatches ln-fill:request CustomEvent on the modal with detail { id: param }
       ↳ ln-fill global document listener catches it
            → param === null?
                 → window.lnCore.lnFill(modal, null)
                      · dispatches ln-fill CustomEvent with null detail to [data-ln-form]/[data-ln-fillable]
                      · ln-form _onLnFill: e.detail falsy → reset() + _applyActionMode(null)
                           → action restored to base URL, _method cleared, fields empty
                      · [data-ln-fillable] display elements cleared
                      · NO attribute write, NO hash write, NO click
            → param truthy (edit mode)?
                 → _findSource(modal, param)
                      · querySelectorAll('[data-ln-fill-id="<param>"]')
                      · none found? → no-op (deep-link to record not in DOM)
                      · prefer source whose data-ln-fill-form → form inside modal
                      · fallback: candidates[0]
                 → _recordFrom(source)
                      · iterate source.dataset
                      · keep keys starting with 'lnFill', skip RESERVED {lnFillForm, lnFillStore}
                      · strip 'lnFill' prefix, lowercase first char → record key
                 → window.lnCore.lnFill(modal, record)
                      · dispatches ln-fill CustomEvent to modal itself (if [data-ln-form]/[data-ln-fillable])
                        AND every such descendant
                      · ln-form's listener calls this.fill(record)
                      · [data-ln-fillable] elements updated by the delegated document handler
                      · NO attribute write, NO hash write, NO click
```

### Source disambiguation

`_findSource(modal, param)` (now residing in `ln-fill.js`) scans `[data-ln-fill-id="<param>"]` candidates
and prefers one whose `data-ln-fill-form` attribute resolves to a `<form>`
that is INSIDE the opened modal (`modal.contains(form)`). This lets several
modals and data tables coexist on one page without cross-filling. The fallback
is `candidates[0]` — correct for single-modal pages and for sources whose
`data-ln-fill-form` is not modal-scoped.

## Event lifecycle

### Inbound — what the coordinator listens to

| Event | Listener | Source |
|---|---|---|
| `ln-modal:open` | `document` (bubble) | Any `[data-ln-modal]` with an `id` |

### Outbound — what the coordinator causes

The coordinator dispatches `ln-fill:request` CustomEvent on the target modal, carrying `{ id: detail.param }`.

`ln-fill`'s listener on `document` catches this event and dispatches `ln-fill` CustomEvents via `window.lnCore.lnFill(modal, record)` (edit mode) or `window.lnCore.lnFill(modal, null)` (new mode).

## Coordinator / cross-component contract

| Side | Contract |
|---|---|
| **Input** | `ln-modal:open` with `detail = { target, param, hashNs, modalId }` from `ln-modal` (hash modals carry `param` key; plain non-hash modals omit it) |
| **Output** | `ln-fill:request` with `detail = { id }` dispatched on the target modal |

This is the coordinator pattern from
[`docs/architecture/coordinator.md`](../architecture/coordinator.md): the
coordinator maps the emitting component's event contract (`ln-modal:open`) to the target component's request event (`ln-fill:request`) — but imports neither component's source.

## Why a global singleton, not `registerComponent`

`ln-modal:open` bubbles to `document`. There is no wrapper element to scope
the listener to; adding a `data-ln-modal-fill` wrapper attribute would
require per-element activation for no benefit. `ln-fill` is already exactly
this shape: a boolean `window.lnFill` sentinel and a single `document`-level
click listener — `ln-modal-fill` mirrors it identically.

## Why programmatic `lnFill`, not a synthetic click

A synthetic click on the `<a href="#id:param" data-ln-fill-*>` source would:

1. Re-set the hash (`href="#id:param"`) → re-fire `hashchange` → re-trigger
   `_onHashChange` → attempt to re-open the already-open modal.
2. Potentially re-fire `ln-modal:open` → re-enter `ln-modal-fill` itself.
3. Navigate if the anchor resolves to a live target.

`window.lnCore.lnFill(modal, record)` dispatches `ln-fill` CustomEvents only,
touching no attributes and no hash. The no-re-open guarantee is therefore
**by construction**: the coordinator contains no `setAttribute(`, no `hashSet`,
and no `.click(`.

## No-op cases

| Condition | Result |
|---|---|
| `'param'` key absent in detail (plain non-hash modal) | No-op — opt out; no fill dispatched |
| `detail.target` is absent | No-op — guard |
| No `[data-ln-fill-id="<param>"]` found in DOM | Graceful no-op — deep-link to a record not currently rendered |
| Modal without an `id` (no `hashNs`) | No-op — `'param' in detail` guard catches it (no key in detail) |

**Note:** hash new-mode (`param === null`, key present) is **not** a no-op. It
dispatches `lnFill(modal, null)`, which drives `ln-form`'s `reset()` +
`_applyActionMode(null)` (RESTful action routing) and clears display fillables.
