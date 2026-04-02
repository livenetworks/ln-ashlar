# Plan: ln-data-table Component

## Context

ln-data-table is a pure UI component — renders table rows via virtual scroll, handles sort/filter/search controls, row selection, and emits events. It does NOT fetch or cache data. It receives data from ln-store through a coordinator (CustomEvent communication).

**Depends on:** ln-store (must be built first), ln-core helpers (cloneTemplate, fill, dispatch, findElements)

Full spec: `docs/js/ln-data-table.md`
Visual spec: `.claude/skills/ui/components/data-table.md`
Interaction flows: `.claude/skills/ux/interaction-patterns.md`

## Implementation Phases

### Phase 1: Shell + Row Rendering

**Goal:** Render rows from data into a `<tbody>`, using `<template>` + cloneTemplate + fill.

What to build:
- IIFE skeleton: `DOM_SELECTOR = 'data-ln-data-table'`, `DOM_ATTRIBUTE = 'lnDataTable'`
- Import from ln-core: `cloneTemplate`, `fill`, `dispatch`, `findElements`
- Listen for `ln-data-table:set-data` event → receive `{ data, total, filtered }`
- Clone row template (`data-ln-template="{name}-row"`), fill with `data-ln-cell` fields
- Replace skeleton rows with real rows
- Show empty state template when data is empty:
  - `{name}-empty` template when total === 0 (no data exists)
  - `{name}-empty-filtered` template when total > 0 but filtered === 0 (query returned zero)
- Footer count: update `data-ln-data-table-count` with "X items" or "X of Y"
- `ln-data-table:set-loading` event → show/hide skeleton state
- MutationObserver for dynamic `data-ln-data-table` elements
- Instance state: `.isLoaded`, `.totalCount`, `.visibleCount`

**Verify:** Dispatch `ln-data-table:set-data` with mock array, confirm rows render from template. Dispatch empty array, confirm empty state template shows. Dispatch with total > 0, filtered === 0, confirm filtered empty state.

### Phase 2: Sort

**Goal:** 3-state sort toggle per column.

What to build:
- Click handler on `[data-ln-col-sort]` buttons
- 3-state cycle: unsorted (⇅) → ascending (↑) → descending (↓) → unsorted
- Visual state via CSS classes on `<th>`: `ln-sort-asc`, `ln-sort-desc`, or none
- Single-column sort — clicking a new column resets the previous
- Emit `ln-data-table:sort` event: `{ table, field, direction }`
- Emit `ln-data-table:request-data` with current sort/filters/search after sort change
- Instance state: `.currentSort` → `{ field, direction } | null`

**Verify:** Click sort button, confirm class toggles and event fires. Click different column, confirm previous resets. Third click on same column returns to unsorted.

### Phase 3: Filter Dropdowns

**Goal:** Per-column checkbox filter dropdown.

What to build:
- Click handler on `[data-ln-col-filter]` buttons
- Clone `column-filter` template, position below header cell
- Populate with unique values from current data (extracted from last `set-data` payload)
- If >8 values: show search input at top of dropdown (`data-ln-filter-search`)
- Checkbox toggle → emit `ln-data-table:filter`: `{ table, field, values }`
- Emit `ln-data-table:request-data` with current sort/filters/search
- Active filter indicator: add dot class on `[data-ln-col-filter]` button when column has active filter
- Footer filter pills: show active filters as dismissible pills
- "Clear filter" button inside dropdown (`data-ln-filter-clear`)
- `data-ln-data-table-clear-all` button → clear all filters, emit `ln-data-table:clear-filters`
- Close dropdown on outside click
- Cascading filters: unique values reflect already-filtered data from OTHER columns
- Instance state: `.currentFilters` → `{ field: [values] }`

**Verify:** Click filter icon, confirm dropdown opens with unique values. Check values, confirm event fires and dot indicator appears. Click clear, confirm filter removed. Outside click closes dropdown.

### Phase 4: Search

**Goal:** Instant search on keyup (client-side data).

What to build:
- `input` event listener on `[data-ln-data-table-search]`
- On keyup → emit `ln-data-table:search`: `{ table, query }`
- Emit `ln-data-table:request-data` with current sort/filters/search
- Clear button (✕) in search input when text present
- Keyboard shortcut: `Ctrl+K` focuses search input
- Instance state: `.currentSearch` → String

**Note:** No debounce needed — data is client-side (IndexedDB), filtering is synchronous. Instant on every keystroke.

**Verify:** Type in search, confirm event fires on each keystroke. Clear input, confirm empty search event fires. Ctrl+K focuses input.

### Phase 5: Row Selection + Bulk Actions

**Goal:** Checkbox selection, header select-all, sticky bulk action bar.

What to build:
- Click handler on `[data-ln-row-select]` checkboxes
- Header checkbox `[data-ln-col-select]` → select/deselect all visible rows
- Emit `ln-data-table:select`: `{ table, selectedIds, count }`
- Emit `ln-data-table:select-all`: `{ table, selected: Boolean }`
- Track selection: Set of IDs (survives sort/filter changes)
- Row highlight class when selected
- Instance state: `.selectedIds` (Set), `.selectedCount`

Bulk actions are coordinator-managed (not in the table component). Table emits selection events, coordinator shows action bar.

**Verify:** Click row checkbox, confirm selection event. Click header checkbox, confirm all visible selected. Sort/filter, confirm selection persists for already-selected IDs.

### Phase 6: Row Click + Row Actions

**Goal:** Click row to navigate, action buttons for edit/delete.

What to build:
- Click handler on `[data-ln-row]` → emit `ln-data-table:row-click`: `{ table, id, record }`
- Allow ctrl/meta/middle-click to pass through (new tab)
- Stop propagation from `[data-ln-row-action]` buttons (don't trigger row click)
- `[data-ln-row-action]` click → emit `ln-data-table:row-action`: `{ table, id, action, record }`
- URL pattern from `data-ln-data-table-row-click` attribute (coordinator can use this or handle event)

**Verify:** Click row, confirm event fires with record data. Click action button, confirm action event fires but row-click doesn't. Ctrl+click row, confirm browser default (new tab) not prevented.

### Phase 7: Virtual Scroll

**Goal:** Render only visible rows + buffer, recycle on scroll.

What to build:
- Calculate row height from first rendered batch
- Scroll container with computed height: `totalRows × rowHeight`
- Determine visible window: `scrollTop / rowHeight` → first visible index
- Render visible rows + buffer (e.g., 10 rows above/below viewport)
- On scroll: recycle rows (reuse DOM nodes, fill with new data)
- Scroll position preservation:
  - Sort/filter change → scroll to top
  - Delta sync (store data update) → maintain current position
  - Return from detail page → restore from sessionStorage
- Wire into `set-data` event — re-render visible window from new data

**Verify:** Load 1000+ records, confirm only ~30-50 DOM rows exist. Scroll smoothly through all records. Confirm no jank. Sort/filter resets scroll. Navigate away and back, confirm scroll restored.

### Phase 8: Keyboard Navigation

**Goal:** Arrow keys, Enter, Space, Escape.

What to build:
- `↑`/`↓` → move row focus (visual focus ring)
- `Enter` → trigger row click (navigate to detail)
- `Space` → toggle row checkbox
- `Home`/`End` → jump to first/last row
- `Escape` → close open filter dropdown
- Focus management: table receives focus, arrow keys move within

**Verify:** Tab into table, arrow down through rows. Enter opens detail. Space toggles checkbox. Escape closes filter dropdown.

### Phase 9: Documentation & Demo

#### Component README
Create `js/ln-data-table/README.md` — quick-reference.

Sections (follow existing README pattern):
- Overview (pure UI, no data fetching)
- Attributes (container + column + cell attributes)
- Events emitted / Events received
- API (instance state properties)
- Dependencies (ln-store, ln-core)
- Example (minimal shell + template + coordinator wiring)

#### Detailed Documentation
Update `docs/js/ln-data-table.md` — already exists as spec. After implementation, extend with:
- Internal Architecture (virtual scroll calculations, row recycling, filter dropdown lifecycle)
- Code flow diagrams
- Follow depth of `docs/js/sortable.md`

#### Demo Page
Create `demo/admin/datatable.html` — follow existing demo template.

Sections:
- **Basics** — attributes table
- **Example — Basic** — simple table with sort, 50 mock records
- **Example — Complex** — full table: sort + filter + search + selection + virtual scroll, 1000+ mock records, coordinator wiring with mock ln-store
- **API & Events** — all events, instance properties
- **HTML Structure** — Blade template markup
- **Dependencies** — ln-store, ln-core

Mock data via inline `<script>` intercepting fetch (self-contained, no server).

## Key Patterns

### Import from ln-core
```javascript
import { cloneTemplate, fill, dispatch, findElements } from '../ln-core';
```

### Zero display text in JS
All text (empty states, button labels, filter UI text) comes from `<template>` elements in HTML. Blade translates. JS only clones and fills.

### Communication with ln-store is through coordinator
Table emits `ln-data-table:request-data` → coordinator queries store → coordinator dispatches `ln-data-table:set-data` back. Table never imports or references ln-store directly.

### Search is instant (no debounce)
Data is client-side (IndexedDB). `Array.filter()` on cached data is synchronous. Fire on every keyup.

## Reference Files

- `docs/js/ln-data-table.md` — full API spec (read BEFORE implementing)
- `.claude/skills/ui/components/data-table.md` — visual anatomy, layout spec
- `.claude/skills/ux/interaction-patterns.md` — sort/filter/search/selection flows
- `docs/js/ln-store.md` — store API (table depends on store events)
- `js/COMPONENTS.md` — IIFE pattern, template system, zero display text rule
- `js/ln-core/helpers.js` — cloneTemplate, fill, dispatch, findElements

## After Implementation

Update `todo.md` — mark `ln-data-table.js` as done in "ln-acme Implementation" section.

## Verification (End-to-End)

1. Blade shell renders: toolbar + sticky header + skeleton rows + footer
2. Store loads → coordinator feeds data → table renders rows from template
3. Sort: click column → 3-state cycle → instant re-render
4. Filter: click filter icon → dropdown with checkboxes → instant filter → dot indicator + pills
5. Search: type in search → instant filter on every keyup → clear button works
6. Selection: checkbox per row, header select-all, selection survives sort/filter
7. Row click → event fires (coordinator navigates). Ctrl+click → new tab
8. Row actions → event fires (coordinator delegates to store)
9. Virtual scroll: 1000+ records, ~30-50 DOM rows, smooth scroll
10. Keyboard: arrows, Enter, Space, Escape all work
11. Empty states: correct template for "no data" vs "no results"
12. Back navigation: scroll position, search, filters all restored
