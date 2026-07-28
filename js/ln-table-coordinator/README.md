# ln-table-coordinator

A zero-dependency, document-level coordinator component that wires external search hosts (`ln-search`), column filter popovers (`ln-filter`), header filter indicators, clear button triggers, and keyboard focus shortcuts across every `ln-table` on the page.

`ln-table` itself is a Layer 1 primitive: it manages internal data state, virtual scroll rendering, pagination/windowing cache, row template cloning, cell formatting, and selection DOM state. `ln-table-coordinator` is the Layer 2 policy and mediator that wires external UI controls to `ln-table`.

---

## 🧭 Philosophy & Architecture

1. **Layer Separation.** `ln-table` manages its own internal table state and DOM subtree only — no external DOM querying, no external input mirroring, and no visual indicator class toggles on header buttons. `ln-table-coordinator` handles all project UI wiring on top.
2. **Document-Level Delegation.** The coordinator attaches document-level event listeners once per page load. There is no per-table initialization required.
3. **Event-Driven Communication.** Communication with `ln-table` occurs strictly via CustomEvents (`ln-table:set-search`, `ln-table:set-filter`, `ln-table:request-clear-filters`, `ln-table:request-data`).

---

## 🛠️ Declarative API & Wire Contract

| Target / Trigger | Event / Trigger | Behavior |
| :--- | :--- | :--- |
| `[data-ln-search="tableId"]` | `ln-search:change` | Resolves target table, mirrors input value, dispatches `ln-table:set-search`. |
| `th[data-ln-table-filter-col="key"]` | `ln-filter:changed` | Resolves target table, toggles `.ln-filter-active` indicator on filter button, dispatches `ln-table:set-filter`. |
| `[data-ln-table-clear]`, `[data-ln-table-clear-all]` | `click` | Clears search input and filter form reset checkboxes, removes `.ln-filter-active` visual classes, dispatches `ln-table:request-clear-filters`. |
| Document | `keydown` (`'/'`) | Focuses search input for the active table on page. |

---

## ⚡ Consumed & Dispatched Events

### Consumed Events
- `ln-search:change` (`document`)
- `ln-filter:changed` (`document`)
- `click` (`document` — targets `[data-ln-table-clear]` and `[data-ln-table-clear-all]`)
- `keydown` (`document` — key `'/'`)

### Dispatched Events
- `ln-table:set-search` (Target: `[data-ln-table]`, Payload: `{ query, term, table }`)
- `ln-table:set-filter` (Target: `[data-ln-table]`, Payload: `{ key, values, table }`)
- `ln-table:request-clear-filters` (Target: `[data-ln-table]`, Payload: `{ table }`)

---

## 🔧 Internals

Source: `js/ln-table-coordinator/src/ln-table-coordinator.js`. This is not a per-table instance — the four handlers below are document-level listeners attached once at module load. `registerComponent` gives it a lifecycle hook (a near-empty `_component` whose `destroy()` only clears the instance ref) plus the `window.lnTableCoordinator` double-load guard; the actual coordination is delegation, not instance state.

### Target-table resolution

Every handler routes through `_findTargetTable(trigger, explicitId)`, which tries, in order:

1. `explicitId` → `getElementById`, accepted only if it carries `data-ln-table`.
2. the trigger's own `data-ln-search` / `data-ln-filter` value → as an `id` or `[data-ln-table="…"]`.
3. the nearest `[data-ln-table-coordinator]` wrapper's descendant `[data-ln-table]`.
4. the trigger's `closest('[data-ln-table]')`.
5. fallback: the first `[data-ln-table]` in the document.

Every handler then bails unless the resolved table has a live `table.lnTable` instance — an uninitialized table is skipped, never forced.

### Search

On `ln-search:change` it value-mirrors `e.detail.term` into the host's input (when the host is or contains one) so the field display stays in sync even for programmatic terms, then dispatches `ln-table:set-search`.

### Column-filter indicator

On `ln-filter:changed` it finds the `th[data-ln-table-filter-col="key"]` and toggles `.ln-filter-active` on that header's `[data-ln-table-col-filter]` button based on `values.length > 0`, then dispatches `ln-table:set-filter`. This header-indicator class is Layer-2 policy — which is exactly why `ln-table` itself never sets it.

### Clear

A `click` on `[data-ln-table-clear]` / `[data-ln-table-clear-all]` runs four steps: (1) strip `.ln-filter-active` off every filter button in the table, (2) blank the linked search input (scoped to the coordinator wrapper, else document), (3) check each linked filter popover's `[data-ln-filter-reset]` and fire a bubbling `change`, (4) dispatch `ln-table:request-clear-filters`.

### `/` focus shortcut

A document `keydown` for `/` focuses the search input of the active coordinator wrapper (or the first `[data-ln-search]`). Ignored when focus is already in an `INPUT`/`TEXTAREA`, or when the event was already `defaultPrevented`.
