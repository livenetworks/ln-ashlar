# ln-sort

A zero-dependency, event-driven **Sort Trigger Primitive** that turns a click into a normalized `{ field, direction }` sort request, dispatched at a `ln-data-store` (or any element listening for it).

It owns no sort data itself. It announces intent on click, then paints its own `asc`/`desc` classes from the store's echo — so every `ln-sort` control bound to the same store, table, or list agrees on the active sort regardless of which one triggered the change.

---

## 🧭 Philosophy & Architecture

1. **Click Cycles, Store Decides:** Clicking a trigger cycles `null → asc → desc → null` for that trigger's field. The component dispatches the *request*; it does not apply the sort itself.
2. **Echo-Driven Painting:** Visual state (`ln-sort-asc` / `ln-sort-desc` classes) is never set directly from the click handler. It is set from `ln-data-store:query-changed`, the store's echo of the query it actually applied. This is what keeps multiple sort controls bound to one source in agreement — a table header sort and a sidebar sort on the same store both repaint from the same echo.
3. **Dual Dispatch:** `ln-sort:changed` fires on both the control itself and the target element (resolved by id) — same dual-dispatch shape as `ln-filter` and `ln-search`, so a target listening on its own root catches the event regardless of where the control lives in the DOM.

---

## 📦 Minimal Blueprint

```html
<nav data-ln-sort="employees-store">
	<button type="button" data-ln-sort-field="name">Name</button>
	<button type="button" data-ln-sort-field="department">Department</button>
</nav>

<div data-ln-data-store="employees-store" data-ln-data-store-source="/api/employees"></div>
```

Clicking "Name" dispatches `ln-sort:changed` with `{ field: 'name', direction: 'asc' }` at both the nav and `#employees-store`. A second click cycles to `desc`, a third clears back to `null`.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-sort` | Container root | Component root. Value is the `id` of the target (typically a `ln-data-store`) that consumes the sort request. |
| `data-ln-sort-field` | The element that carries the state class — `<th>` in a table, the trigger itself elsewhere | The field name to sort by. Click cycles this trigger's direction; clicks on descendants resolve to this element via `closest`. |
| `ln-sort-asc` | Trigger | *State*. Painted from the store's query echo when this field is the active ascending sort. |
| `ln-sort-desc` | Trigger | *State*. Painted from the store's query echo when this field is the active descending sort. |

---

## ⚡ DOM Events

Events are dispatched on **both** the sort control and the target element (dual dispatch, resolved via `getElementById`).

### `ln-sort:changed`
Fired on click, only when the resulting `{ field, direction }` differs from the last dispatched snapshot.
- **Payload (`detail`)**: `{ field: string|null, direction: 'asc'|'desc'|null }` (`null` field/direction means sort was cleared).

### Listens for `ln-data-store:query-changed` (on `document`)
Not fired by `ln-sort` — consumed to repaint trigger classes. Ignored unless `detail.store` matches this control's target id.

---

## ⚠️ Common Pitfalls

- **Expecting the click to sort locally:** `ln-sort` never touches any data or DOM rows itself. If nothing is listening for `ln-sort:changed` at the target, clicking does nothing visible beyond the class repaint driven by the next echo.
- **Multiple controls disagreeing:** If a second `ln-sort` control targets the same store id, both repaint from the same `ln-data-store:query-changed` echo — they cannot drift apart because neither owns the sort state locally.
- **`data-ln-sort-field` on the button inside a `<th>`:** The state class lands on whatever element carries the attribute. Table sort styling reads `.ln-sort-asc .table-sort` — a descendant combinator — so the attribute belongs on the `<th>` and the icon button stays inside it:

```html
<th data-ln-sort-field="name">
	<button type="button" data-ln-table-col-sort class="table-sort">Name</button>
</th>
```

  Put it on the button and the class and the icons collapse onto the same element, the combinator never matches, and the indicator stays silent while the sort itself works.

---

## 🔧 Internals

Source: `js/ln-sort/src/ln-sort.js`. No sort data ownership — `_current` is a local best-guess used only to drive the click-cycle direction (`_nextDirection`); the class painting on triggers is driven entirely by the store's echo, never by `_current` directly except as a seed after `_paint` re-syncs it.

### Click → emit

`_onClick` resolves the clicked trigger's field, computes the next direction via `_nextDirection` (`null`/mismatched field → `asc`, `asc` → `desc`, `desc` → `null`), and calls `_emit`.

### Emit — diff cache

`_emit` compares the new `_current` against `_lastSnapshot` (the last dispatched value) and returns early if unchanged, avoiding redundant dispatches on repeated clicks that resolve to the same state. Only on a real change does it dispatch `ln-sort:changed` via `_dispatchOnBoth`.

### Paint — echo-driven, not local state

`_paint(sort)` is called from `_onQueryChanged`, filtered to `detail.store === this.targetId`. It clears `ASC_CLASS`/`DESC_CLASS` from every trigger, then re-applies the matching class to the trigger whose field matches `sort.field`, and re-seeds `_current` from the echoed sort — so the click-cycle always resumes from the store's actual state, not a locally guessed one.

### Destroy

Removes the click listener and the `document`-level `ln-data-store:query-changed` listener.
