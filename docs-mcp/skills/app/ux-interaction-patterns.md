---
name: ux-interaction-patterns
classification: skill
status: draft
domain: frontend
summary: Concrete interaction flows for data-driven views — search, sort, filter, virtual scroll, row selection/bulk actions, inline editing, keyboard navigation, empty states, and row actions.
tags: [ux, interaction-patterns, search, sort, filter, virtual-scroll, bulk-actions, keyboard]
---

# 🔁 Interaction Patterns

## Summary

This skill defines the FLOW (what happens when) for the recurring data-driven interactions of a business UI: search, sort, filter, virtual scroll, selection, inline edit, keyboard navigation, empty states, and row actions. Consult it when wiring any of these behaviors.

> Companion to [`./ux.md`](./ux.md) — the general action-feedback and state-machine rules apply to every pattern below.

---

## 1. Search

### Flow

```
User focuses search input (/ keyboard shortcut when no input is active)
  → Placeholder text: "Search..." (or contextual: "Search employees...")
User types
  → Filter data instantly on every keystroke (client-side from client-side cache/DOM)
  → Update result count ("Showing 12 of 1,247")
  → Show results or empty state
User clears (✕ button or Backspace to empty)
  → Instant reset — show all data, update count
```

### Rules

- **Instant on keyup** — when data is client-side (client-side cache/DOM), filter on every keystroke. No debounce needed — `Array.filter()` on cached data is synchronous and instant
- **Debounce only for server search** — if search hits an API endpoint (data too large to cache), debounce to avoid request spam. This is the exception, not the default
- **Clear button** (✕) — visible when input has text, clears on click
- **Preserve on back-navigation** — returning from a detail page restores the search term and results
- **Keyboard shortcut** — `/` to focus search (when no input is active)
- **Scope indicator** — if search covers specific columns, say so ("Searches name and email")

### Empty State

Two distinct situations:

| Situation | Message | CTA |
|-----------|---------|-----|
| No data exists | "No employees yet" | [+ Add Employee] |
| Search returned zero | "No results for 'xyz'" | [Clear Search] |

Never show a blank area. Always guide to the next action.

---

## 2. Sort

### Flow

```
Click column header (or sort button)
  → 1st click: sort ascending (A→Z, 0→9, oldest→newest)
  → 2nd click: sort descending
  → 3rd click: return to default order (unsorted)
```

### Three-State Cycle

```
⇅ (unsorted, dim) → ↑ (ascending) → ↓ (descending) → ⇅ (unsorted)
```

### Rules

- **Single-column sort** — only one column sorted at a time (simplicity over power)
- **Visual indicator always visible** — dim ⇅ on unsorted columns, bold ↑/↓ on active
- **Sort is instant** — client-side on cached data, no loading indicator needed
- **Preserve sort on back-navigation** — returning from a detail page keeps the sort
- **Default sort** — tables should have a sensible default (e.g., newest first, alphabetical)
- **Sortable columns are declared** — not every column needs sort (e.g., "Actions" column doesn't)

---

## 3. Filter

### Flow

```
User clicks column name or filter icon in header
  → Dropdown opens with checkbox list of unique values for that column
  → User checks/unchecks values
  → Rows filter instantly (client-side)
  → Active filter indicator: dot (●) on the filter icon
  → Filter pill appears in sticky footer
User clicks ✕ on a filter pill
  → That filter removed, rows update
User clicks "Clear all filters"
  → All filters removed, full dataset restored
```

### Rules

- **Filters are intersection** — multiple column filters AND together (Status=Active AND Department=Sales)
- **Filters AND search combine** — search within filtered results (not OR)
- **Active filter visibility** — user must always see which filters are active:
  - Dot indicator on column header filter icon
  - Filter pills in the sticky footer showing "Column: Value"
- **"Clear all"** — always available when any filter is active
- **Preserve on back-navigation** — returning from a detail page keeps filters active
- **Count update** — footer shows "45 of 1,247" when filters are active

Filter options come from the domain source, never derived from the visible page dataset.

### Empty State

When filters produce zero results:

| Message | CTA |
|---------|-----|
| "No matching employees" | [Clear Filters] |

---

## 4. Virtual Scroll

### Why Not Pagination

- Users work with **data**, not "pages" — pagination forces artificial boundaries
- Sorting and filtering work on the **full dataset**, not one page at a time
- Virtual scroll gives the user the feeling of having all data available while rendering only what's visible

### Flow

```
Table renders
  → Sticky header (column names always visible)
  → Visible rows rendered (viewport + buffer above/below)
  → User scrolls freely — rows render/recycle as needed
  → Sticky footer (total count, filtered count, aggregates)
```

### Rules

- **Sticky header** — column names, sort controls, and filter controls always visible
- **Sticky footer** — total count, filtered count, column aggregates (sum, avg), bulk action bar
- **Count display** — "1,247 items" (unfiltered) or "45 of 1,247" (filtered)
- **Scroll position preserved** — returning from a detail page restores scroll position
- **Shimmer on initial load** — show shimmer placeholder while data loads on first visit, never a blank table
- **Smooth scrolling** — no jank, consistent row heights for predictable scroll behavior

---

## 5. Row Selection + Bulk Actions

### Selection Flow

```
User clicks row checkbox
  → Row visually selected (background highlight)
  → Bulk action bar appears (sticky bottom)
  → Bar shows: selected count + available actions + "Clear selection"
User clicks header checkbox
  → Selects all VISIBLE rows (respects current filter/search)
  → If dataset is large: banner appears "Select all 1,247 items?"
User unchecks all (or clicks "Clear selection")
  → Bulk bar disappears
```

### Bulk Action Flow

```
User selects rows → picks action from bulk bar
  → Non-destructive (e.g., export, assign): execute immediately
  → Destructive (e.g., delete): modal confirm with count ("Delete 5 employees?")
  → Execute → toast with count ("5 employees deleted") → clear selection
```

### Rules

- **Header checkbox scope** — selects current visible rows only, not the entire dataset
- **"Select all N"** — optional banner after header checkbox, for operating on full dataset
- **Bulk bar is sticky** — always visible at bottom when selection is active
- **Destructive bulk actions always confirm** — modal with count and consequences
- **Partial failure** — if 3 of 5 fail, show "2 deleted, 3 failed" with details
- **Clear selection** — always available in the bulk bar

---

## 6. Inline Editing

### Flow

```
User clicks editable cell (or pencil icon)
  → Cell transforms to input (text, select, etc.)
  → Original value pre-filled
  → Focus set to input
User edits and presses Enter or Tab
  → Validate → save (optimistic) → show saved state
  → Tab moves to next editable cell
User presses Escape
  → Revert to original value, exit edit mode
```

### Rules

- **Visual edit indicator** — editable cells show a subtle hover hint (pencil icon or border change)
- **Optimistic save** — update UI immediately, confirm with server async, revert on error
- **Single-cell edit** — only one cell in edit mode at a time
- **Keyboard flow** — Enter saves, Escape cancels, Tab saves and moves to next editable cell
- **Validation** — same rules as form fields (validate on keyup, errors inline)
- **No "Edit mode" for the whole row** — individual cells are independently editable

### When to Use Inline Editing

| Use Inline | Use Form/Modal |
|------------|---------------|
| Changing one field at a time | Editing multiple related fields together |
| Quick corrections (name, status) | Complex input (rich text, file upload) |
| Frequent edits across many rows | Rare, deliberate edits |
| Simple field types (text, select, date) | Dependent fields (country → region) |

---

## 7. Keyboard Navigation

### Global Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search input (when no input is active) |
| `Escape` | Close modal/dropdown/panel, cancel edit |

### Table Navigation

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move row focus |
| `Enter` | Open focused row (navigate to detail) |
| `Space` | Toggle row checkbox |
| `Home` / `End` | Jump to first/last row |

### Form Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move to next field |
| `Shift+Tab` | Move to previous field |
| `Enter` | Submit form (when on submit button or single-field forms) |
| `Escape` | Cancel / close modal |

### Rules

- **Focus must be visible** — every focused element has a clear focus ring
- **Focus trap in modals** — Tab cycles within the modal, not behind it
- **Skip navigation** — "Skip to content" link for keyboard users
- **No keyboard traps** — user can always Tab/Escape out of any component
- **Arrow keys in components** — dropdowns, pill groups, tab bars use arrow keys for internal navigation

Modals trap focus: `Tab`/`Shift+Tab` cycle within the modal and never reach the page behind it. `Escape` closes.

---

## 8. Empty States

Two distinct types — using the wrong one confuses users:

### Type 1: No Data Exists

The resource has never been created. This is an onboarding moment.

| Element | Content |
|---------|---------|
| Heading | "No employees yet" |
| Message | "Add your first employee to get started" |
| CTA | [+ Add Employee] (primary action) |

### Type 2: Query Returned Zero

Data exists, but the current search/filter/view shows nothing. Guide the user to adjust.

| Element | Content |
|---------|---------|
| Heading | "No results" or "No matching employees" |
| Message | "Try different search terms" or "No employees match the selected filters" |
| CTA | [Clear Search] or [Clear Filters] |

### Rules

- **Never show a blank area** — always show one of these two types
- **CTA matches the cause** — search empty → clear search button, filter empty → clear filters button
- **Type 1 appears only once** — after the user creates the first item, they never see it again
- **Type 2 appears whenever the query is empty** — search, filter, or combination

---

## 9. Row Actions

### Click Zones

| Area | Action |
|------|--------|
| Anywhere on row (except action buttons) | Navigate to detail page |
| Action button (edit, delete) | Execute that action |
| Checkbox | Toggle row selection |

### Rules

- **Row click = most common action** — navigating to detail is the default
- **Action buttons stop propagation** — clicking Edit doesn't also navigate to detail
- **Always-visible actions** — don't hide actions behind hover (inaccessible on touch devices)
- **Overflow menu (three dots)** for 3+ actions per row — keeps the row clean
- **Conditional actions** — only show actions the user can perform (e.g., no Delete if no permission)

Row/action click wiring should be declarative data-attributes, not JS click handlers.

### Mobile Adaptation

- Row click navigates to detail (same as desktop)
- Actions column: always visible (icon-only to save space)
- Alternatively: swipe to reveal actions (if the pattern is established in the app)
</content>
