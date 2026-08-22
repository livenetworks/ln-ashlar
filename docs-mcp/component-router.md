# ln-ashlar — Component Router

> **Purpose:** pick the right component. Nothing else.
> This file contains **no markup**. Do not write HTML from it.

**Routing rule — always:**
1. Pick the component from the tables below.
2. `get_markup` → canonical HTML. Never invent it.
3. `get_events` / `who_handles` → wiring between components.
4. `get_attribute` → attribute contract, allowed values, who writes it (author vs runtime).
5. Not in this file? → `list_components` or `search_docs` before assuming it doesn't exist.

---

## Overlays

| Component | Use for | Don't use for |
|---|---|---|
| `ln-modal` | Create/edit forms, confirmations, detail views — anything requiring attention before continuing | Inline confirmations → `ln-confirm`; non-blocking notices → `ln-toast` |
| `ln-popover` | Rich overlays: column filters, tool panels, dropdowns needing more than a `<ul>` | Simple link menus → `ln-dropdown`; blocking dialogs → `ln-modal` |
| `ln-tooltip` | Icon-only buttons, abbreviations, passive extra context | Rich content → `ln-popover`; mobile primary interactions |
| `ln-confirm` | Two-click destructive actions (delete) where a modal is overkill | Anything needing user input |

## Data Display

| Component | Use for | Don't use for |
|---|---|---|
| `ln-table` | Any tabular data. Sorting, filtering, search, selection, virtual scrolling. SSR **or** data-driven mode | Static tables with no interactivity → plain `<table>`; card grids |
| `ln-progress` / `ln-circular-progress` | Known-percentage progress: uploads, wizards, form completion | Indeterminate loading → skeletons / `ln-toast` |

## Forms & Input

| Component | Use for | Don't use for |
|---|---|---|
| `ln-form` | Forms needing prefill (edit mode) or RESTful create/update routing | Static forms with no prefill → plain `<form>` |
| `ln-validate` | Field-level constraint validation with visual errors | Server-side validation feedback |
| `ln-upload` | Drag-and-drop file intake | Single trivial file input; camera capture |
| `ln-autosave` | Long forms, comment boxes — draft persistence to localStorage | Sensitive data (unencrypted) |
| `ln-autoresize` | Textareas with unpredictable content length | Fixed-height inputs |

## Navigation

| Component | Use for | Don't use for |
|---|---|---|
| `ln-nav` | Primary navigation: navbars, sidebars | Breadcrumbs; panel switching → `ln-tabs` |
| `ln-tabs` | Mutually exclusive panels. Hash deep-linking or localStorage persistence | Independent collapsibles → `ln-accordion` / `ln-toggle` |
| `ln-breadcrumbs` | Location trail in deep hierarchies. **Not a JS component** — semantic HTML + SCSS only | Primary navigation → `ln-nav` |
| `ln-link` | Links needing special behaviour: external, download, route hints | Standard internal navigation → plain `<a>` |
| `ln-external-links` | Content pages where authors won't add security attrs manually | Apps with only internal navigation |

## Feedback

| Component | Use for | Don't use for |
|---|---|---|
| `ln-toast` | Non-blocking success/error/warning/info stack. Triggered by window event, not attributes | Blocking confirmation → `ln-modal` / `ln-confirm`; field errors → `ln-validate` |

## State Primitives

| Component | Use for | Don't use for |
|---|---|---|
| `ln-toggle` | **The base binary primitive.** Collapsible panels, show/hide | Exclusive selection → `ln-tabs` / `ln-accordion` |
| `ln-accordion` | Coordinator enforcing single-open across `ln-toggle` panels | Independent collapsibles → bare `ln-toggle` instances |
| `ln-dropdown` | Menu-grade coordinator: click-outside, top-layer, auto-positioning. Any `<ul>` of links/actions | Rich panels → `ln-popover` |
| `ln-sortable` | Drag-to-reorder lists, builder canvases | Paginated data; tree structures (unsupported) |

## Interaction Primitives

| Component | Use for | Don't use for |
|---|---|---|
| `ln-key` | Application keyboard shortcuts or grouped retrofit maps that activate/focus existing semantic targets | Replacing native button/link keyboard behavior; arbitrary command execution |

## Data Flow & AJAX

| Component | Use for | Don't use for |
|---|---|---|
| `ln-ajax` | Progressive enhancement: form submit / link load without reload | File uploads; forms claimed by a coordinator |
| `ln-data-store` | Local-first cache: offline survival, optimistic writes, encryption at rest | Always-fresh read-only data → fetch on demand |
| `ln-data-coordinator` | Parent that wires store ↔ connector ↔ mappers ↔ form writes | Read-only views with no local state |
| `ln-api-connector` / `ln-couchdb-connector` | Network gateway from store to REST / CouchDB backend | Static sites without a backend |
| `ln-filter` | Checkbox filter groups feeding `ln-table` | Text search → `ln-search`; ranges |
| `ln-search` | Real-time text filtering of a table or popover list | Global site search; autocomplete |

## Utilities

| Component | Use for | Don't use for |
|---|---|---|
| `ln-time` | Auto-updating relative timestamps | Precise absolute dates → plain `<time>` |
| `ln-translations` | Static text swapping by language key | User-generated content; RTL layout (CSS concern) |
| `ln-dictionary` | *TODO — confirm scope via `get_component`* | |
| `ln-icons` | Sprite-based icons, localStorage-cached | Inline one-off SVGs |

---

## Capability signals

Only the flags that change a decision. Everything else → `get_attribute`.

- `ln-table` + `data-ln-table-window` → server-side sliding-window virtualization exists; don't hand-roll paging.
- `ln-form` + `data-ln-form-scope` → local-first write path; the coordinator claims submit, so **do not** also add `ln-ajax`.
- `data-ln-persist` → available on `ln-toggle` and `ln-tabs` for localStorage state.
- `ln-accordion` → removing the wrapper attribute turns panels multi-open. No config needed.
- `ln-toast` → server can render items directly for SSR flash messages; JS only hydrates timers.
- `ln-modal`, `ln-popover`, `ln-dropdown`, `ln-accordion` are all built **on top of** `ln-toggle`.

---

## Golden Rules

1. HTML describes **what**, not how. No layout classes in markup.
2. State lives in `data-ln-*` attributes, never JS variables.
3. Zero initialization — `MutationObserver` handles everything. Never `new LnX()`.
4. Semantic elements only: `<dialog>`, `<nav>`, `<form>`, `<section>`, `<article>`.
5. SCSS mixins on IDs/selectors, not utility classes.
6. JS is transport-agnostic — `ln-form` never submits; `ln-ajax`, the coordinator, or native HTML does.
7. Icons come from `ln-icons`.

**Known exception:** inactive `ln-tabs` panels carry `class="hidden"`. This is the one sanctioned functional class — it does not license utility classes anywhere else.

---

*ln-ashlar DOM-First UI Library — Live Networks. Selection only; markup lives in MCP.*
