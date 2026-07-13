---
name: ui
classification: skill
status: draft
domain: frontend
summary: Decision rules for visual layout and information presentation — what to show, where to place it, which component to pick, and what makes a component or page complete.
tags: [ui, layout, components, density, hierarchy, completeness]
---

# 🧩 UI Layout Rules

## Summary

This skill governs WHAT to show and WHERE to place it, before any code is written. Consult it when planning a dashboard, list, detail, or form page; when choosing between a table and a card grid; or when checking whether a component/page is complete. It designs data-dense, functional interfaces for business applications, not marketing pages.

> For interaction flows (how things behave) → [`./ux.md`](./ux.md)
> For visual-system rules (radius, shadow, color, motion, typography) → [`./ui-visual-language.md`](./ui-visual-language.md)

---

**Design COMPLETE interfaces.** A table without sorting, filtering, search, and virtual scroll is not a table — it's a prototype. A form without validation feedback, loading states, and error handling is not a form — it's a sketch. When a component is specified, everything that makes it production-ready must be specified with it.

---

## 1. The Design-First Process

When asked to build any interface, follow this sequence:

```
1. PURPOSE     → What is the user trying to do or learn on this page?
2. DATA        → What data answers that question? Rank by importance.
3. LAYOUT      → What arrangement makes the most important data most visible?
4. COMPONENTS  → Which component type best serves each piece of data?
5. COMPLETENESS→ Does each component have all its required features?
6. STATES      → What does the page look like in loading, empty, error, and success?
7. FLOW        → Where does the user go next? What actions are available?
```

Never jump to code. Never pick a component before understanding the data. Never ship a component without all its features.

---

## 2. Data Priority

### The Importance Hierarchy

Every interface answers a question. The answer should be the most prominent element.

```
User opens Document Dashboard:
  Question: "What's the state of my documents?"
  Answer hierarchy:
    1. Key numbers (total docs, pending review, overdue) → KPI cards
    2. Documents needing action (pending, draft) → primary table
    3. Recent activity (last approved, last edited) → secondary list
    4. Quick actions (new document, start review) → action buttons
```

### Rules

- **Lead with the answer** — the most important data is the largest, highest element
- **Group related data** — things that are compared together must be visually adjacent
- **Progressive disclosure** — summary first, details on demand (click/expand/navigate)
- **One primary metric per card** — a stat card shows ONE number prominently, with label and optional trend
- **Reduce, don't cram** — if a page feels overloaded, the problem is information architecture, not layout

---

## 3. Layout Decisions

### Page Types

| User Intent | Page Type | Layout |
|-------------|-----------|--------|
| "Give me an overview" | Dashboard | KPI row + 2-column sections |
| "Show me a list of things" | List / Index | Filters + table (or card grid for visual items) |
| "Show me details about one thing" | Detail | Header with key info + tabbed/stacked sections |
| "Let me create or edit" | Form | Single-column or 2-column form inside a card |
| "Let me configure" | Settings | Grouped sections with forms |

### Dashboard Layout

```
┌─────────────────────────────────────────┐
│ KPI Stats (3-5 key numbers)             │  ← Answers the main question
├───────────────────┬─────────────────────┤
│ Primary content   │ Secondary content   │  ← Most important on left
│ (table/list)      │ (activity/chart)    │
└───────────────────┴─────────────────────┘
```

- **KPI row** = the dashboard's headline — 3-5 numbers max, each with label and trend
- **Primary section** (left, wider) = the most actionable content
- **Secondary section** (right, narrower) = supporting information
- No more than 3 vertical sections — if there's more, the dashboard scope is too broad

### List Page Layout

```
┌─────────────────────────────────────────┐
│ [🔍 Search...]              [+ Create]  │ ← Toolbar (search + primary action)
├─────────────────────────────────────────┤
│ Name ⇅  │ Status ▾ ⇅ │ Date ↑ │       │ ← Sticky header (sort + filter per column)
├─────────────────────────────────────────┤
│ Table rows (virtual scroll)             │
│                                         │
├─────────────────────────────────────────┤
│ 1,247 items · 45 filtered              │ ← Sticky footer
└─────────────────────────────────────────┘
```

- Primary action (Create) = top-right, always visible
- Search = toolbar, above the table
- Filters = per-column dropdowns in header (not toolbar)
- Sort = per-column toggle button in header (one click, no dropdown)
- Virtual scroll = all data cached client-side, sort/filter/search client-side (see § 6 Data Table row)
- Sticky footer = total count, filtered count

### Detail Page Layout

```
┌─────────────────────────────────────────┐
│ ← Back    Entity Name      [Edit][Del] │  ← Identity + actions
├─────────────────────────────────────────┤
│ Key attributes (inline or mini cards)   │  ← The most important facts
├─────────────────────────────────────────┤
│ [Tab 1] [Tab 2] [Tab 3]                │
│ ┌─────────────────────────────────────┐ │
│ │ Tab content (table, list, form)     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

- Entity identity (name, status, key attribute) = always visible at top
- Tabs for related data sets — never stuff everything on one scrollable page
- Actions = top-right, matching the entity scope

---

## 4. Component Selection

### Decision Tree

```
Is it a single value?
  → Stat card (number + label + optional trend)

Is it a list of similar items with multiple attributes?
  → Is the data naturally tabular (rows × columns)?
    → Yes → Data Table (with search, sort, filter, virtual scroll)
    → No, items are visual/card-like → Card grid

Is it a list of actions or links?
  → Navigation list or button group

Is it a timeline of events?
  → Activity feed (chronological list)

Is it a form?
  → Form (with validation, states, field grouping)

Is it a long text document?
  → Prose section with headings

Does the user need to choose between related views of the same entity?
  → Tabs
```

### Table vs Card Grid

| Choose Table When | Choose Card Grid When |
|-------------------|-----------------------|
| Data has 4+ comparable attributes | Items have 1-2 key attributes |
| Users need to sort/filter/compare | Items are visually distinct |
| Rows are similar in structure | Each item is a self-contained unit |
| Data density matters | Visual scanning matters |
| Actions per row | Actions per card |

Default to **table** for business data. Cards are for entity summaries, not data rows.

---

## 5. Component Completeness

**A component is not done until it has all its standard features.** This is not optional — an incomplete component is a broken component.

**Every feature in the right column is mandatory** — anatomy, behavior, states, and responsive rules must all be designed before the component is built.

| Component | Key Features That Must Be Present |
|-----------|----------------------------------|
| Data Table | Client-side cache, virtual scroll, sticky header/footer, sort toggle per column, filter dropdown per column, search, row selection, delta sync |
| Form | per-field validation (keyup), reserved error space, submit stays enabled — invalid submit is blocked with inline errors, fill for edit mode, auto-submit for search/filter forms |
| Modal | Four sizes (sm/md/lg/xl), `<form>` root, focus trap, ESC close, backdrop does NOT close, no nested modals |
| Tabs | URL hash sync, multiple groups per page via namespace, badge counts, content in DOM from start (no lazy load) |
| Search | Client-side = instant keyup DOM filtering. Server-side = form auto-submit + AJAX |
| Status Badge | Dot + text + tinted background, never color-only, 5 semantic categories, actionable variant via confirm/dropdown |
| Empty State | Two distinct types: "no data exists" (onboarding) vs "filter returned zero" (adjust) |
| Loading State | Button spinner for actions, shimmer for content areas, always scoped — never full-page |
| KPI Card | One metric per card, clickable to list/detail, trend indicator, 3-5 per dashboard max |

### Visual States — Every Component Must Address

Beyond functional features, every component must have all applicable visual states designed:

| State | What it communicates | Implementation |
|-------|---------------------|----------------|
| **Default** | At rest, available | Normal appearance |
| **Hover** | "I can interact here" | Color change only — no transform, no shadow |
| **Focus** | "I am interacting here" | Consistent indicator (ring, border, or accent) |
| **Active/Pressed** | "Action registered" | Slightly darker than hover |
| **Disabled** | "Not available" | 50% opacity, `cursor-not-allowed` |
| **Loading** | "Working on it" | Button spinner or shimmer, scoped — never full-page |
| **Empty** | "Nothing here yet" | Guidance + CTA (two types: no data vs zero results) |
| **Error** | "Something went wrong" | Three signals required: color + icon + text |

If a component plan doesn't address all applicable states, the plan is incomplete.

---

## 6. Information Density

### Principle: Dense but Readable

Business interfaces should show as much relevant data as possible without visual noise.

### Density Rules

- **No empty decoration** — no large hero images, no excessive whitespace, no decorative illustrations
- **Compact spacing** — component-appropriate spacing, not generous padding everywhere
- **Information per fold** — the user should see useful data without scrolling
- **Small text is OK** — secondary info in small text is better than hiding it entirely
- **Abbreviate intelligently** — "Jan 15" not "January 15, 2025" in tables, full date in detail views
- **Numeric alignment** — numbers right-aligned for scanning and comparison
- **Truncate with access** — truncate long text in tables, show full on hover or in detail view

### What to Show Where

| Data | In List/Table | In Detail View |
|------|---------------|----------------|
| Name/title | Full | Full |
| Status | Badge (colored dot + text) | Badge + explanation |
| Date | Relative ("3d ago") or short ("Jan 15") | Full ("January 15, 2025 at 14:30") |
| Long text | Truncated (50 chars) | Full |
| Count/number | Number only | Number + breakdown |
| Related entity | Name as link | Name + key attributes |

---

## 7. Visual Weight and Hierarchy

### Weight Distribution

```
HEAVIEST ─────────────────────── LIGHTEST
Page title  Section heads  Body text  Metadata
KPI numbers  Table headers  Table cells  Timestamps
CTA button   Secondary btn  Links       Hints
```

### Rules

- **One focal point per section** — the eye should know where to land first
- **Primary action stands alone** — visually separated from secondary actions
- **Headers frame content** — section headers are heavier than content, lighter than page title
- **Numbers that matter are bold and large** — KPIs, totals, counts
- **Labels are lighter than values** — "Employees" in small/muted, "42" in large/bold
- **Actions are visually quiet until needed** — buttons in table rows don't compete with data

### Color Meaning (Not Decoration)

| Meaning | When to Apply |
|---------|---------------|
| Primary (brand) | Call-to-action, active state, links |
| Success (green) | Positive status, pass, approved, active |
| Error (red) | Negative status, fail, rejected, destructive action |
| Warning (amber) | Pending, attention needed, approaching limit |
| Muted (grey) | Disabled, de-emphasized, metadata |
| No color | Default state — most elements should be neutral |

---

## 8. Designing for Context

### Admin/Internal Tool

- Maximum information density
- Tables preferred over cards
- Minimal chrome (small headers, no hero sections)
- Function over form — useful beats beautiful
- Power user features: keyboard shortcuts, bulk actions, quick filters

### Client-Facing Portal

- Moderate density — more breathing room
- Cards acceptable for entity summaries
- Cleaner chrome — clear navigation, branded header
- Guided flows — don't assume the user knows the domain

### Public-Facing Dashboard

- Focused density — fewer elements, each well-explained
- Charts and visualizations over raw tables
- Contextual help — labels, tooltips, explanations
- Mobile-first consideration

---

## 9. Page Completeness

A page is not done until all these are addressed.

### Every Page Must Have:

- **Page title** — one clear heading naming what this page is
- **Primary action** — the most important thing the user can do (top-right)
- **All four states** — loading, empty, data, error (see [`./ux.md`](./ux.md) for state behavior)
- **Responsive layout** — usable on tablet (1024px) at minimum
- **Breadcrumbs** — on any page deeper than top-level navigation

### Dashboard Checklist:

- [ ] 3-5 KPI cards answering the main question (not more)
- [ ] Each KPI card: label + number + optional trend
- [ ] Primary content section (table or list) with the most actionable data
- [ ] Secondary content section (activity feed, chart, or summary)
- [ ] Quick action buttons for the most common tasks

### List Page Checklist:

- [ ] Toolbar: search input + primary create action (top-right)
- [ ] Data table with virtual scroll, client-cache-first loading
- [ ] Sticky header: sort toggle + filter dropdown per column
- [ ] Sticky footer: total count, filtered count
- [ ] Empty state: "no data" with create CTA + "filter zero" with clear filters
- [ ] Row click navigates to detail (if detail page exists)

### Detail Page Checklist:

- [ ] Back navigation (link or breadcrumbs)
- [ ] Entity identity (name, status, key attribute) always visible at top
- [ ] Actions (edit, delete) top-right
- [ ] Tabs for related data sections (not one long scroll)
- [ ] Each tab has its own loading/empty/error states

### Form Page Checklist:

- [ ] All fields have visible labels (`<label for>` + `<input id>`)
- [ ] Required fields marked (CSS-driven, not manual asterisks)
- [ ] Related fields grouped (visual sections via grid spans)
- [ ] Validation wired on inputs, reserved error space below each field
- [ ] Submit button stays enabled — invalid submit shows inline errors and focuses the first invalid field; disable only while processing (loading state on submit)
- [ ] Cancel button that navigates back
- [ ] Sensible defaults pre-filled

### Settings Page Checklist:

- [ ] Grouped by category (sections or tabs)
- [ ] Each section independently saveable (or clear save scope)
- [ ] Current values visible before editing
- [ ] Dangerous settings visually separated (e.g., delete account at bottom, red zone)

---

## 10. Visual Language Rules

Before implementing any styled component, follow these system-wide rules — full spec → [`./ui-visual-language.md`](./ui-visual-language.md):

- **Radius + spacing** — rounded elements must float (have `mx`), flush elements must be sharp
- **Shadow vs border** — pick one as the primary signal; don't stack both
- **Icon consistency** — one icon set, one weight, no mixing
- **Spacing scale** — token values only, never invent custom values
- **Color = state** — never decorative, only semantic
- **Hover = color change only** — no transforms, no shadow appearance
- **Radius scale** — one standard radius throughout, full rounding for pills only

---

## 11. Anti-Patterns — NEVER Do These

### Components
- Data table without search, sort, or virtual scroll — that's a raw `<table>`, not a data table
- Dashboard with more than 5 KPI cards (if everything is key, nothing is)
- Table with 2 columns (use a simple list)
- Card grid for tabular data (tables exist for a reason)
- "View" button on table rows when the row itself could be clickable
- Modal for content that could be a page (modals are for decisions and short forms)
- Tabs with only one tab (just show the content)

### Layout
- Hiding important data behind clicks when there's screen space
- Decorative elements in business tools (illustrations, large icons, hero images)
- Same visual weight for all elements (flat hierarchy = no hierarchy)
- Centering everything (data interfaces are left-aligned for scanning)
- Sidebar filters on list pages (filters go above the data)
- Detail page as one long scroll instead of tabbed sections
- Empty space that could show useful information

### Completeness
- Only designing the happy path (data exists, no errors)
- Skipping empty state ("we'll add it later" = never)
- Skipping loading state (users see a flash of nothing)
- Same empty state for "no data exists" and "filter returned zero"
- Form without visible validation feedback
- Pagination instead of virtual scroll (users work with data, not "pages")
- Search without a "no results" state
- Picking components before understanding data priority
</content>
