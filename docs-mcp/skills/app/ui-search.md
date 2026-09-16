---
name: ui-search
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for search interactions — client-side versus server-side modes, where rate limiting lives, clear triggers, and query state preservation.
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

| Search Mode | Data Source | Execution Behavior | Rate Limiting |
|---|---|---|---|
| **Client-Side Search** | Data cached in local memory / DOM | Filters instantly on every `input` | **None.** Nothing leaves the page, so there is nothing to rate-limit |
| **Server-Side Search** | Backend API endpoint | Emits a query event; the connector fetches | **Owned by `ln-api-connector`** — never by the search input |

### Debounce belongs to the API layer

`ln-search` never debounces. In both modes it writes the term to the target's state
attribute on every `input` event and dispatches `ln-search:change` immediately. That
is its whole job.

Rate limiting lives one layer down, on `ln-api-connector`:

| Attribute | Default | Behavior |
|---|---|---|
| `data-ln-api-connector-query-debounce="<ms>"` | `300` | Debounces `ln-api-connector:request-query` per key. `0` disables it. |

The strategy is leading-edge-then-coalesce: the first query in a window fires
immediately, and rapid follow-ups for the same key are coalesced so only the latest
one fires when the window closes. Mutations (`create`, `update`, `delete`,
`bulk-delete`) are never debounced.

Putting a delay on the input instead would starve client-side filtering — which needs
every keystroke — and duplicate work the connector already does for the remote case.

---

## 2. Mandatory Functional Rules

- **Clear Button (`✕`):** Displayed inside input right-aligned whenever input contains text. Clicking clears input and instantly resets filter.
- **Query Preservation:** Search query parameters MUST be preserved when navigating back from detail views.
- **Keyboard Focus:** Pressing `/` (when no other input/textarea is focused) automatically focuses the search input.
- **Scope Indicator:** If search queries specific columns or attributes, placeholder text or help text MUST state the scope (e.g., *"Search by name or email..."*).
- **Dual Empty States:** Search MUST clearly distinguish between "no data exists in resource" and "search returned zero results".

---

## 3. Anti-Patterns — NEVER Do These

- Debouncing the search input itself, in either mode. Rate limiting belongs to `ln-api-connector`.
- Omitting the `✕` clear button when text is present.
- Showing a blank empty screen without guidance or a "Clear Search" CTA when zero items match a search query.
