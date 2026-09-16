# ln-persist

A registry-driven, no-instance component that restores and saves a single
state attribute to `localStorage` for the components that opt in — attribute
declared, not function called.

`data-ln-persist` only has an effect on an element owned by a component that
declares `options.persist` — currently `ln-toggle`, `ln-tabs`, `ln-sort`,
`ln-search`, `ln-filter`. On any other element the attribute is a silent
no-op.

---

## 🧭 Philosophy

Persistence used to be five components hand-calling `persistGet`/`persistSet`
from `ln-core/persist.js` inside their own constructors and attribute-sync
handlers — coupling every persistence-aware component to that module's exact
function signatures and JSON-value shape. `ln-persist` inverts this: each
owning component declares a `persist: { attr, hashActive }` block when it
calls `registerComponent(...)`, and `ln-persist` does the restoring and
saving from the outside, through the same shared `findElements` funnel every
component instance is already constructed through. No owning component
imports anything from `ln-persist`, and `ln-persist` never imports any
owning component.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-persist` | Any element owned by a persist-declaring component | Opt-in. Bare = use `el.id` as the storage key. `data-ln-persist="key"` = explicit key override. |
| `data-ln-persist-scope` | Same as `data-ln-persist` | Opt-in, independent attribute. `"page"` scopes the stored key to the current URL pathname. Absent = global (same key on every page). |

There is no Programmatic JS API — `persistGet`/`persistSet`/`persistRemove`/
`persistClear` do not exist. The attribute is the sole contract.

### Storage key format

Global by default:

```
ln:{id}:{attr}
```

Page-scoped, via `data-ln-persist-scope="page"`:

```
ln:{id}:{pagePath}:{attr}
```

- `id` — the `data-ln-persist="key"` value if non-empty, else `el.id`. Missing
  both → `console.warn('[ln-persist] Element requires id or data-ln-persist="key"', el)`, persistence skipped.
- `attr` — the owning component's declared `persist.attr` (e.g.
  `data-ln-toggle`, `data-ln-tabs-active`, `data-ln-sort-state`,
  `data-ln-search`, `data-ln-filter-values`).
- `pagePath` — `location.pathname`, lowercase, trailing slash stripped, or
  `/` for root.

This orphans every key written under the previous
`ln:{component}:{pathname}:{id}` format — harmless leftover localStorage,
never read again.

Persisted values are raw attribute strings — no `JSON.stringify`/`parse`.
The restore/save unit is always "one DOM attribute's string value," not the
old composite objects (`{field,column,direction,targetId}` for sort,
`{key,values}` for filter).

### Hash wins

When the owning component's `persist.hashActive(el)` returns `true`,
`ln-persist` skips both restore and save for that element entirely — the URL
hash is authoritative, never double-written to both hash and `localStorage`.
This is a behaviour change for `ln-search`/`ln-filter`, which previously
wrote both; `ln-tabs` was already fully hash-gated on save, `ln-sort` only on
restore.

---

## ⚠️ Common Pitfalls

- **Persisting without a stable key.** `data-ln-persist` with no value falls
  back to `el.id`; an element with neither silently skips persistence
  (`console.warn`s once).
- **Expecting `data-ln-persist-scope="page"` alone to persist anything.**
  It only changes the key shape of an element that already has
  `data-ln-persist` — it's not a standalone opt-in.
- **Expecting a composite persisted value.** Every owner persists exactly one
  attribute's string value now, not an object.

---

## 🔧 Internals

Source: `components/ln-persist/src/ln-persist.js`. No `DOM_SELECTOR`,
`DOM_ATTRIBUTE`, or instance — registry-driven, sink-filling module.
Structurally closest existing precedent: `components/ln-debug/src/gate.js`
(nullable sink, single module-level idempotency guard, no instance).

### The sink

`ln-core/helpers.js` exposes a nullable `setPersistSink(sink)`, mirroring
`setDebugSink` exactly. `findElements` — the single funnel every component
instance in the library is constructed through (boot sweep, each
component's own `childList` observer, and the shared observer's legacy
upgrade path) — calls `window.lnCore._persistSink(el, selector)` for any
element carrying `data-ln-persist`, immediately before constructing that
element's owning component instance. `ln-persist` fills the slot with
`_persistSink`, which looks up the matching entry in `registry.persist`
(populated by `registerComponent`'s `persist:` option) by `selector`, and —
unless `persist.hashActive(el)` is true — writes the stored value onto `el`
with `setAttribute`, synchronously, before the owner's constructor runs.

### Ordering — no boot gate

`_registerAttrEntry(...)` always runs before that same component's own
`boot()` — see `helpers.js`'s `registerComponent`. So by the time any
owner's `findElements` call reaches the sink, that owner's own `persist:`
declaration is already in `registry.persist`, regardless of what order the
other four owners import in. `ln-persist` only needs to precede the *first*
owner's import so `setPersistSink(...)` has already run — a plain
import-order invariant (`components/index.js` imports `ln-persist` before
`ln-tabs`, the earliest of the five owners), not a gate on anything else's
boot timing.

### Path 3 — elements inserted after initial boot

A node inserted later by `ln-include`, `ln-router`, or an `ln-table` render
hits the same owning component's `childList` observer, which calls the same
`findElements`, which runs the same sink check. Restores correctly for
free — no separate mechanism, no gap.

### Save-path wiring

Wired lazily, the first time the sink is invoked for a given `persist.attr`
— not at `ln-persist`'s own module evaluation, since no owner has
registered yet at that point. `observeAttributes([persist.attr], ...)` is
called once per `persist.attr`, guarded by a module-level `_wiredAttrs` Set.
The save handler re-derives the key, checks `hashActive`, and writes or
removes the `localStorage` entry on every subsequent mutation of that
attribute.

### Destroy

None — no per-element instance to tear down. This module installs a
document-level sink for the life of the page, same category as `ln-debug`'s
gate.
