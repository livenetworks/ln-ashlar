---
name: ui-empty-state
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for empty states — distinguishing "no data exists" from "query returned zero", call-to-action requirements, and visual hierarchy.
tags: [ui, empty-state, onboarding, search-zero, feedback]
---

# 📭 Empty State Rules

## Summary

This skill governs the presentation of Empty States when views contain no data items. Consult it whenever designing lists, tables, dashboards, or search results.

> For state machine definitions → [`./ux.md`](./ux.md)  
> For data table empty states → [`./ui-data-table.md`](./ui-data-table.md)

---

## 1. Two Mandatory Empty State Types

An interface MUST distinguish between two fundamentally different empty state scenarios:

```
┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
│ TYPE 1: NO DATA EXISTS                  │   │ TYPE 2: QUERY RETURNED ZERO             │
│                                         │   │                                         │
│ 📁 No documents created yet             │   │ 🔍 No results found for "acme"          │
│ Add your first document to get started. │   │ Try adjusting your search or filters.   │
│                                         │   │                                         │
│ [ + Create Document ]                   │   │ [ Clear Search ]                        │
└─────────────────────────────────────────┘   └─────────────────────────────────────────┘
```

### Type 1: No Data Exists (Resource Onboarding)
- **Context:** The resource dataset has 0 records total.
- **Goal:** Onboard user and guide initial creation.
- **Content:** Heading ("No documents yet") + explanatory text + Primary Create CTA (`[+ Add Document]`).

### Type 2: Query Returned Zero (Search / Filter Zero)
- **Context:** Data exists in backend, but active filter/search returns 0 rows.
- **Goal:** Help user reset scope.
- **Content:** Heading ("No matching results") + explanatory text + Reset CTA (`[Clear Filters]` / `[Clear Search]`).

---

## 2. Mandatory Rules

- **Never Render Blank Containers:** Data containers (tables, card grids, lists) MUST NEVER present a blank void without an empty state.
- **CTA Action Alignment:** CTA button action MUST match the underlying cause (Type 1 → Create action; Type 2 → Reset/Clear filters action).
- **Visual Weight:** Empty states MUST NOT carry heavier visual weight than populated data states (keep illustrations minimal, avoid huge hero graphics in business tools).

---

## 3. Anti-Patterns — NEVER Do These

- Showing the same generic empty state message for both initial onboarding and search zero-results.
- Omitting actionable CTA buttons from empty state displays.
- Leaving blank, empty table shells with no explanation when zero records match a filter query.
