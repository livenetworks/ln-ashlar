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
