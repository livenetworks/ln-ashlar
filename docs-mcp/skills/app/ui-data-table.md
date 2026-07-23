---
name: ui-data-table
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for data tables — viewport principles, sticky header/footer, virtual scroll, row selection, optimistic mutations, and anti-patterns.
tags: [ui, data-table, table, virtual-scroll, selection, optimistic-updates]
---

# 📊 Data Table Rules

## Summary

This skill governs the specification and completeness requirements for Data Tables in business applications. Consult it whenever designing or implementing tabular data views. A data table is a viewport into a dataset, not a paginated slice.

> For component selection (Table vs Card Grid) → [`./ui.md`](./ui.md)  
> For search, sort, and filter flows → [`./ux-interaction-patterns.md`](./ux-interaction-patterns.md)

---

## 1. Core Principle

A data table is a **VIEWPORT into a dataset** — not a paginated slice. Users work with their entire dataset through a scrollable window. Data resides in a client-side cache, sort/filter/search operate synchronously, and the system syncs with the server in the background.

---

## 2. Standard Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search...]                                     [+ Create]   │ ← Toolbar
├────┬──────────────────┬────────────┬──────────┬────────┬───────┤
│ ☐  │ Name          ⇅  │ Status ▾●⇅ │ Category │ Date ↑ │       │ ← Sticky header
├────┼──────────────────┼────────────┼──────────┼────────┼───────┤
│ ☐  │ ISO 27001 Policy │ ● Approved │ Policy   │ Jan 15 │ ⋯    │
│    │                  │            │          │        │       │
│    │  (virtual scroll — renders visible rows from local cache) │
│    │                  │            │          │        │       │
├────┴──────────────────┴────────────┴──────────┴────────┴───────┤
│ 1,247 items · 45 filtered · 5 selected  [Delete]   Σ €24,500  │ ← Sticky footer
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Mandatory Requirements

### Data Layer Separation
- Table is **pure UI** — receives data, renders rows, emits events.
- Data storage, synchronization, and mutations are handled by the data layer/store.
- Communication between table UI and data layer is 100% event-driven.

### Loading Strategy
- **SSR Mode (default):** Server renders complete table rows on initial HTML delivery — no initial loading wait.
- **Client-Cache Mode:** Server renders table shell; a scoped loader covers the shell until hydration completes. No fake placeholder rows.
- First visit: fetch full dataset → store in client cache → render.
- Subsequent visits: read cache (<50ms) → render immediately → background delta sync.

### Toolbar & Headers
- **Toolbar:** Contains search input and primary action button (e.g., Create) only. Filters MUST NOT be placed in the toolbar.
- **Sticky Header:** Column headers remain fixed during scroll. Per-column sort toggles (unsorted → ascending → descending → unsorted) and per-column filter dropdowns live directly in headers.
- **Sticky Footer:** Displays total count, filtered count, column aggregates (sums/averages), and bulk action controls when rows are selected.

### Virtual Scroll & Row Selection
- **Virtual Scroll:** Renders only visible rows plus a small buffer from client cache. Fixed row heights ensure smooth, predictable scrolling.
- **Selection:** Checkbox column on the far left. Header checkbox selects all currently filtered rows. A floating or sticky bulk action bar appears upon selection.

### Row Actions & Keyboard Navigation
- **Row Click:** Navigates to detail view (primary action).
- **Action Column:** Action buttons sit in the last column. Multi-action rows (3+ actions) use an overflow menu.
- **Keyboard Navigation:** Up/Down arrows move row focus, Enter opens detail, Space toggles row selection.

---

## 4. Visual States

| State | What the User Sees |
|---|---|
| **SSR / Hydrated** | Full rows rendered on first paint. |
| **Client-Cache Loading** | Loader overlay covers table shell until store hydrates. |
| **Active Data** | Rows rendered with active sort/filter indicators. |
| **Empty (No Data)** | Guidance message ("No items yet") + Create CTA button. |
| **Empty (Zero Results)** | Guidance message ("No matching items") + Clear Filters CTA button. |
| **Error** | Error message overlay with retry action. |

---

## 5. Anti-Patterns — NEVER Do These

- Using traditional pagination buttons (Page 1, 2, 3) instead of virtual scrolling.
- Placing global filter dropdowns in the top toolbar instead of column headers.
- Rendering animated placeholder/shimmer rows for non-existent data.
- Hiding row action buttons behind hover states (breaks touch accessibility).
- Showing the same empty state for "no data exists" and "search returned zero results".
