# UI/Architecture Skills Redesign — Session Handoff

> Context document for continuing this work in Claude Code (VS Code).
> Created from Claude.ai conversation on 2026-04-02.

---

## What Was Done

Redesigned the `ui-designer` skill from scratch and created a complete vertical slice for the Data Table component — from design principles down to ln-acme component specs.

---

## Files Created (Ready to Place)

All files are in this conversation's outputs. Download them and place as follows:

### claude-skills repo (`livenetworks/claude-skills`)

| File | Destination | Action |
|------|-------------|--------|
| `SKILL.md` (UI) | `ui/SKILL.md` | **REPLACE** existing |
| `data-table.md` | `ui/components/data-table.md` | NEW (create `components/` dir) |
| `form.md` | `ui/components/form.md` | NEW |
| `modal.md` | `ui/components/modal.md` | NEW |
| `tabs.md` | `ui/components/tabs.md` | NEW |
| `search.md` | `ui/components/search.md` | NEW |
| `status-badge.md` | `ui/components/status-badge.md` | NEW |
| `empty-state.md` | `ui/components/empty-state.md` | NEW |
| `loading-state.md` | `ui/components/loading-state.md` | NEW |
| `data-layer.md` | `architecture/data-layer.md` | NEW (companion to existing SKILL.md) |

### ln-acme repo (`livenetworks/ln-acme`)

| File | Destination | Action |
|------|-------------|--------|
| `ln-store.md` | `docs/js/ln-store.md` | NEW (create `docs/js/` dir) |
| `ln-data-table.md` | `docs/js/ln-data-table.md` | NEW |

### NOT placing yet (deferred)

- `tokens-reference.md` → `ln-acme/docs/tokens-reference.md` (later, when working on SCSS docs)
- `visual-recipes.md` → `ln-acme/docs/visual-recipes.md` (later)

---

## Key Architectural Decisions Made

### 1. UI Skill Structure
- Main `SKILL.md` contains principles, layouts, component selection, page checklists (~380 lines)
- Each component has a detailed spec in `components/*.md`
- Motion section REMOVED from UI skill (will be resolved when reworking CSS/UX skills)

### 2. Data Table — No Pagination
- Virtual scroll instead of pagination — users work with continuous data, not "pages"
- Sticky header with two separate controls per column:
  - **Sort toggle** (dedicated button, right side): click cycles ⇅ → ↑ → ↓ → ⇅. One click, no dropdown.
  - **Filter dropdown** (click column name or filter icon): checkbox list of unique values
- Active filter indicator: dot (●) on filter icon when column has active filter
- Sticky footer: total count, filtered count, active filter pills, column aggregates, bulk actions

### 3. Data Layer — IndexedDB-First
- All data cached in IndexedDB, sort/filter/search are client-side (instant)
- Stale-while-revalidate: show cached data instantly, delta sync in background
- Delta sync: `GET /api/{resource}?since={timestamp}` returns only changed/deleted records
- Server requires: `updated_at` column, soft deletes (`deleted_at`), `?since=` endpoint support
- Optimistic mutations: update local immediately, server confirms async, revert on error
- Conflict detection: `updated_at` comparison, 409 response on stale update
- Cache versioning: schema_version in IndexedDB metadata, clear on mismatch
- Sync triggers: on mount (if stale), on visibility change, after CRUD
- Blade renders table SHELL only (toolbar, header, footer, skeleton rows). JS renders data rows.

### 4. ln-acme Components — Two Separate IIFEs
- **ln-store**: generic data layer (IndexedDB CRUD, sync, optimistic mutations). Not UI-aware.
- **ln-data-table**: pure UI (virtual scroll, rendering, sort/filter controls). Not data-aware.
- Connected via coordinator pattern (project-specific JS, CustomEvent communication)
- ln-store is reusable by any component (autocomplete, dashboard KPIs, etc.)
- WebSocket can be added to ln-store later without touching ln-data-table

### 5. Form Validation
- Validate on **keyup** (not blur, not submit-only)
- Clear errors immediately when input becomes valid
- Untouched required fields are NOT in error state until first interaction
- Server-side validation errors mapped inline to specific fields

### 6. Modal Scroll
- Modals CAN have scroll for complex content (drag-and-drop, multi-panel configurations)
- Three types: confirm (small), task (medium form), content (large, scroll expected)
- Slide panel as alternative for quick view/edit

### 7. Component Specs Created
- Data Table, Form, Modal, Tabs, Search, Status Badge, Empty State, Loading State
- Each spec covers: anatomy, behavior, states, responsive, anti-patterns
- Empty State has TWO distinct types: "no data exists" vs "filter returned zero"

---

## What's Left To Do

### Next Priority
1. **UX skill rewrite** — interaction patterns for sort/filter/search, fix validation strategy (keyup), deduplicate motion
2. **UX companion: `interaction-patterns.md`** — search, sort, filter, pagination, bulk actions, inline editing, keyboard navigation

### After That
3. **CSS skill** — remove motion duplication, add reference to ln-acme tokens
4. **HTML skill** — fix cross-references (`SKILL-CSS.md` → correct path)
5. **JS skill** — fix cross-references, add ln-store/ln-data-table integration patterns

### Architecture
6. Add brief cross-reference in `architecture/SKILL.md` § 5 pointing to `data-layer.md`

### ln-acme Implementation
7. Actually build `ln-store.js` and `ln-data-table.js` following the specs

---

## Development Order Principle (From This Session)

When creating development plans (phases, prompts, steps), always follow user-facing process order:

1. First what the user sees and uses (login, layout, dashboard)
2. Then features by usage priority
3. Technical dependencies (tables, middleware) created alongside the first feature that needs them, not as a separate upfront step
4. Every step must be visually testable by the user

Wrong: Setup → DB tables → Middleware → Auth → UI
Right: Setup → Layout shell → Login → Dashboard → (tables created when needed)
