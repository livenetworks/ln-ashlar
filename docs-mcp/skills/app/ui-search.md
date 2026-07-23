---
name: ui-search
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for search interactions — client-side instant keyup vs server-side debounced search, clear triggers, and query state preservation.
tags: [ui, search, filtering, keyup, debounce]
---

# 🔍 Search Rules

## Summary

This skill governs search interaction patterns and implementation requirements across application interfaces. Consult it when designing search inputs for data tables, lists, or global search surfaces.

> For concrete search interaction flows → [`./ux-interaction-patterns.md`](./ux-interaction-patterns.md)  
> For data table search integration → [`./ui-data-table.md`](./ui-data-table.md)

---

## 1. Two Distinct Search Modes

Search MUST be classified into one of two modes — mixing rules between them is forbidden:

| Search Mode | Data Source | Execution Behavior | Debounce Rule |
|---|---|---|---|
| **Client-Side Search** | Data cached in local memory / DOM | Filters instantly on every `keyup` | **Debounce = 0ms** (synchronous filter) |
| **Server-Side Search** | Backend API endpoint | Submits query via AJAX | **Debounce ≥ 150ms** (throttles API requests) |

---

## 2. Mandatory Functional Rules

- **Clear Button (`✕`):** Displayed inside input right-aligned whenever input contains text. Clicking clears input and instantly resets filter.
- **Query Preservation:** Search query parameters MUST be preserved when navigating back from detail views.
- **Keyboard Focus:** Pressing `/` (when no other input/textarea is focused) automatically focuses the search input.
- **Scope Indicator:** If search queries specific columns or attributes, placeholder text or help text MUST state the scope (e.g., *"Search by name or email..."*).
- **Dual Empty States:** Search MUST clearly distinguish between "no data exists in resource" and "search returned zero results".

---

## 3. Anti-Patterns — NEVER Do These

- Adding Artificial debounce (e.g. 300ms sleep) to client-side DOM searches where data is already cached locally.
- Omitting the `✕` clear button when text is present.
- Showing a blank empty screen without guidance or a "Clear Search" CTA when zero items match a search query.
