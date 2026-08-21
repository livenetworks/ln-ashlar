# ln-table-coordinator

A zero-dependency, per-instance, host-scoped coordinator component that wires external search hosts (`ln-search`), column filter popovers (`ln-filter`), header filter indicators, and clear button triggers to a single `ln-table`.

`ln-table` itself is a Layer 1 primitive: it manages internal data state, virtual scroll rendering, pagination/windowing cache, row template cloning, cell formatting, and selection DOM state. `ln-table-coordinator` is the Layer 2 policy and mediator that wires external UI controls to `ln-table`.

---

## 🧭 Philosophy & Architecture

1. **Layer Separation.** `ln-table` manages its own internal table state and DOM subtree only — no external DOM querying, no external input mirroring, and no visual indicator class toggles on header buttons. `ln-table-coordinator` handles all project UI wiring on top.
2. **Host-Scoped, Per-Instance.** The coordinator is a real component: `[data-ln-table-coordinator]` is a **required wrapper**. Its handlers are bound to its own host element (`self.dom`), not `document`. The table, its `[data-ln-filter]` popovers, and its clear button(s) must all be descendants of the same coordinator host — outside its own subtree, the coordinator does not exist and does not look.
3. **Event-Driven Communication.** Communication with `ln-table` occurs strictly via CustomEvents (`ln-table:set-search`, `ln-table:set-filter`, `ln-table:request-clear-filters`).

**Breaking change:** a data-driven table's search/filter/clear-all only works when wrapped in `[data-ln-table-coordinator]`. There is no page-wide fallback — the coordinator does not resolve a table by scanning the whole document.

---

## 🛠️ Declarative API & Wire Contract

| Target / Trigger | Event / Trigger | Behavior |
| :--- | :--- | :--- |
| `[data-ln-filter="tableId"]` (delivered by `ln-filter`) | `ln-filter:change` | Resolves target table in host, toggles `.ln-filter-active` indicator on header filter button. |
| `[data-ln-table-clear]`, `[data-ln-table-clear-all]` | `click` | Resolves the table structurally within this host, symmetrically clears the linked search input and `data-ln-search` source attribute, checks filter reset checkboxes, removes `.ln-filter-active` visual classes, and dispatches `ln-table:request-clear-filters` to SSR tables. |
| Document | `keydown` (`'/'`) | Focuses the search input inside the active coordinator wrapper on the page (or the first `[data-ln-search-for]` if none). Safely ignored when focus is in an input, textarea, or `isContentEditable` surface. |

---

## ⚡ Consumed & Dispatched Events

### Consumed Events
- `ln-filter:change` (on `self.dom`)
- `click` (on `self.dom` — targets `[data-ln-table-clear]` and `[data-ln-table-clear-all]`)
- `keydown` (`document` — key `'/'`, the sole document-level exception, see below)

### Dispatched Events
- `ln-table:request-clear-filters` (Target: the SSR table inside this host, Payload: `{ table }`)

---

## 🔧 Internals

Source: `js/ln-table-coordinator/src/ln-table-coordinator.js`. This is a real per-instance component: `_component(dom)` calls `_bindEvents(self)`, which attaches listeners to `self.dom` and cleans them up symmetrically on `destroy()`.

### Column-filter indicator

`ln-filter` dispatches `ln-filter:change` on both its own `<ul data-ln-filter>` root and on the target element. The coordinator catches the event within its host, finds the `th[data-ln-table-filter-col="key"]`, and toggles `.ln-filter-active` on that header's `[data-ln-table-col-filter]` button based on `values.length > 0`. This header-indicator class is Layer-2 policy — which is why `ln-table` itself never sets it.

### Clear

A `click` on `[data-ln-table-clear]` / `[data-ln-table-clear-all]` resolves the table structurally: `clearBtn.closest('[data-ln-table]')`, falling back to `dom.querySelector('[data-ln-table]')` — always scoped to this host. It then runs: (1) strip `.ln-filter-active` off every filter button in the table, (2) blank the linked search input and set `data-ln-search=""` on the source host, (3) check each linked filter popover's `[data-ln-filter-reset]` and fire a bubbling `change`, (4) dispatch `ln-table:request-clear-filters` if the table is an SSR table.

### `/` focus shortcut

The sole deliberate exception to host-scoping. It remains a single `document`-level `keydown` listener registered once at module scope (outside `_component`/`_bindEvents`) — a page-level keyboard affordance, not coordination between a host and its children. Registering it per-instance would fire it once per coordinator on the page. It focuses the search input inside the active `[data-ln-table-coordinator]` wrapper, or the first `[data-ln-search]` on the page if none. Ignored when focus is already in an `INPUT`/`TEXTAREA`, `isContentEditable` surface (e.g. `ln-editor`), or when the event was already `defaultPrevented`.

### Multi-coordinator isolation

Each `_component(dom)` instance closures its handlers over its own `dom`; `addEventListener` on a specific host node only fires for events whose bubble path passes through that node. Two coordinator hosts on the same page cannot see each other's descendants' events — no shared/global state exists to leak. The `/` shortcut is the sole intentional exception to this isolation — it is document-scoped by design.
