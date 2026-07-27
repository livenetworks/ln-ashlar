---
name: ln-table-coordinator
classification: coordinator
status: stable
domain: frontend
summary: A wrapper coordinator component that encapsulates and coordinates child search, filter popovers, and table primitives on the page without requiring named scopes or explicit target IDs.
source: js/ln-table-coordinator/src/ln-table-coordinator.js
tags: [table, coordinator, search, filter, keyboard-shortcuts]
---

# 🧭 ln-table-coordinator

> **Classification:** 🟡 Coordinator Component

---

## 1. Core Behavior & Responsibility

The `ln-table-coordinator` component is a Layer 2 mediator attached to a wrapper container (`<div data-ln-table-coordinator>`). It encapsulates and coordinates its child [`ln-search`](./ln-search.md), [`ln-filter`](./ln-filter.md), clear buttons, and target [`ln-table`](./ln-table.md) primitives without requiring named scopes or explicit target IDs.

The JavaScript source is located at [ln-table-coordinator.js](../../js/ln-table-coordinator/src/ln-table-coordinator.js).

Key responsibilities include:
- **Child Component Coordination:** Coordinating child search inputs, filter popovers, and table primitives enclosed within the wrapper container.
- **Multiple Coordinators Per Page:** Allowing multiple `data-ln-table-coordinator` wrappers to coexist independently on the exact same page without ID collisions or cross-table interference.
- **Search Wire Mediation:** Catching `ln-search:change` events within the wrapper, value-mirroring search inputs, and dispatching `ln-table:set-search` to the child table.
- **Filter Wire Mediation:** Catching `ln-filter:changed` events within the wrapper, toggling `.ln-filter-active` visual indicator classes on header filter buttons (`<th>`), and dispatching `ln-table:set-filter` to the child table.
- **Clear Actions Handler:** Intercepting clicks on `[data-ln-table-clear]` and `[data-ln-table-clear-all]` inside the wrapper, resetting search inputs and filter checkboxes to `checked`, removing `.ln-filter-active` indicator classes, and dispatching `ln-table:request-clear-filters` to the child table.
- **Keyboard Shortcut:** Capturing keydown `'/'` to focus the search input inside the active wrapper container.

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **Internal Table Rendering:** It does not render table rows or calculate virtual scrolling (handled entirely by [`ln-table`](./ln-table.md)).
> - **Backend Data Fetching:** It does not initiate HTTP requests directly (table data queries route through `ln-table` and [`ln-data-coordinator`](./ln-data-coordinator.md)).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Wrapper Coordinator Pattern)

Below is the canonical production pattern where `data-ln-table-coordinator` wraps the search bar, table primitive, and filter popovers as a single cohesive unit:

```html
<!-- Table Coordinator Wrapper -->
<section class="section-card" data-ln-table-coordinator>

    <!-- Header Toolbar with Search & Reset -->
    <header class="page-header">
        <label class="search">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg>
            <input type="search" placeholder="Search employees... (Press '/')" data-ln-search data-ln-search-debounce="0">
            <button type="button" data-ln-search-clear aria-label="Clear search">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </label>
        <button type="button" class="btn" data-ln-table-clear>
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter-off"></use></svg>
            <span>Reset Filters</span>
        </button>
    </header>

    <!-- Table Primitive -->
    <div data-ln-table>
        <!-- Empty State Template -->
        <template data-ln-table-empty>
            <article class="ln-table__empty-state">
                <svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-filter"></use></svg>
                <h3>No employees found</h3>
                <p>Try adjusting your search terms or filters.</p>
                <button type="button" class="btn" data-ln-table-clear>Clear all</button>
            </article>
        </template>

        <!-- Table Element -->
        <table>
            <thead>
                <tr>
                    <th data-ln-table-sort="string">
                        Name
                        <button type="button" class="table-sort" data-ln-table-col-sort aria-label="Sort by name">
                            <svg class="ln-icon" data-ln-table-col-sort-icon="none" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                            <svg class="ln-icon" data-ln-table-col-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                            <svg class="ln-icon" data-ln-table-col-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                        </button>
                    </th>
                    <th data-ln-table-sort="string" data-ln-table-filter-col="dept">
                        Department
                        <button type="button" class="table-filter" data-ln-table-col-filter data-ln-popover-for="filter-dept-popover" aria-label="Filter department">
                            <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
                        </button>
                        <button type="button" class="table-sort" data-ln-table-col-sort aria-label="Sort by department">
                            <svg class="ln-icon" data-ln-table-col-sort-icon="none" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                            <svg class="ln-icon" data-ln-table-col-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                            <svg class="ln-icon" data-ln-table-col-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                        </button>
                    </th>
                    <th data-ln-table-sort="string" data-ln-table-filter-col="status">
                        Status
                        <button type="button" class="table-filter" data-ln-table-col-filter data-ln-popover-for="filter-status-popover" aria-label="Filter status">
                            <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-label="Name">Ana Petrova</td>
                    <td data-label="Department">Engineering</td>
                    <td data-label="Status"><span class="pass">Active</span></td>
                </tr>
                <tr>
                    <td data-label="Name">Marko Nikolov</td>
                    <td data-label="Department">Design</td>
                    <td data-label="Status"><span class="warn">On Leave</span></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Filter Popovers nested inside the coordinator wrapper -->
    <div data-ln-popover id="filter-dept-popover">
        <ul data-ln-filter>
            <li><label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All Departments</label></li>
            <li><label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Design"> Design</label></li>
            <li><label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Engineering"> Engineering</label></li>
        </ul>
    </div>

    <div data-ln-popover id="filter-status-popover">
        <ul data-ln-filter>
            <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-reset checked> All Statuses</label></li>
            <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Active"> Active</label></li>
            <li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="On Leave"> On Leave</label></li>
        </ul>
    </div>
</section>
```

### Variant 1: Multiple Table Coordinators on One Page

Multiple `data-ln-table-coordinator` wrappers can safely exist on the same page. Each wrapper isolates its child search and filters from other tables:

```html
<!-- Table 1 Coordinator: Active Employees -->
<section class="section-card" data-ln-table-coordinator>
    <header class="page-header">
        <h2>Active Employees</h2>
        <label class="search">
            <input type="search" placeholder="Search active..." data-ln-search>
        </label>
    </header>
    <div data-ln-table>
        <!-- Table 1 content -->
    </div>
</section>

<!-- Table 2 Coordinator: Archived Records -->
<section class="section-card" data-ln-table-coordinator>
    <header class="page-header">
        <h2>Archived Records</h2>
        <label class="search">
            <input type="search" placeholder="Search archive..." data-ln-search>
        </label>
    </header>
    <div data-ln-table>
        <!-- Table 2 content -->
    </div>
</section>
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-table-coordinator` | Wrapper | Flag | Required | Declares the wrapper container that coordinates child search, filter, and table elements. |
| `data-ln-search` | Input / Host | Flag / Table ID | — | Search input coordinated by the parent wrapper (or targeted to explicit table ID). |
| `data-ln-filter` | `<ul>` / Form | Flag / Table ID | — | Filter popover/form coordinated by the parent wrapper (or targeted to explicit table ID). |
| `data-ln-table-clear` | Button | Flag | — | Button trigger that resets search and filters for the child table inside the wrapper. |
| `data-ln-table-clear-all` | Button | Flag | — | Button trigger that resets search and filters globally across all tables. |
| `data-ln-table-filter-col` | `<th>` | Key String | Required | Identifies the table header column matching a filter key string. |
| `data-ln-table-col-filter` | Button | Flag | — | Filter button inside `<th>` that receives `.ln-filter-active` when active. |
| `data-ln-filter-key` | Checkbox | Key String | Required | Specifies the filter field key for checkbox inputs inside `[data-ln-filter]`. |
| `data-ln-filter-value` | Checkbox | Value String | Required | Specifies the filter field value matched against table dataset rows. |
| `data-ln-filter-reset` | Checkbox | Flag | — | Checkbox marked `checked` when all filter options for a column are cleared. |

### Events API

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-search:change` | Listens | No | Caught on `data-ln-search` inside the wrapper container. | `{ term: String }` |
| `ln-filter:changed` | Listens | No | Caught on `data-ln-filter` inside the wrapper container. | `{ key: String, values: Array }` |
| `click` | Listens | No | Caught on `[data-ln-table-clear]` inside wrapper. | Native MouseEvent |
| `keydown` | Listens | No | Caught on `document` to focus search inside active wrapper on `'/'`. | Native KeyboardEvent |
| `ln-table:set-search` | Emits | No | Dispatched to child `[data-ln-table]` element. | `{ query: String, term: String, table: String }` |
| `ln-table:set-filter` | Emits | No | Dispatched to child `[data-ln-table]` element. | `{ key: String, values: Array, table: String }` |
| `ln-table:request-clear-filters` | Emits | No | Dispatched to child `[data-ln-table]` element. | `{ table: String }` |

---

## 4. CSS Styling & Behavioral Concept

The `ln-table-coordinator` component is completely unstyled and contains no layout CSS. It dynamically toggles the visual CSS class `.ln-filter-active` on `[data-ln-table-col-filter]` buttons inside `<th>` headers when a column filter carries non-empty selection values.

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Keyboard

- **Search Shortcut:** Pressing `/` anywhere on the page automatically moves focus to `[data-ln-search]` inputs inside the active wrapper container.
- **Icon Labels:** Filter and sort buttons in `<th>` carry explicit `aria-label` attributes.

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **Omitting Wrapper Container:** Always place `data-ln-table-coordinator` on the parent container wrapping your `data-ln-search`, `data-ln-table`, and `data-ln-filter` popovers so child components are coordinated automatically without ID conflicts.
> 2. **Missing `ul/li` Wrap:** Filter options inside popovers MUST be wrapped in `<ul>/<li>` containers according to project DOM rules (`<ul data-ln-filter><li><label><input type="checkbox"...></label></li></ul>`).

---

## 6. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Search as Child Search [data-ln-search]
    participant FilterPopover as Child Filter Popover [data-ln-filter]
    participant Coord as ln-table-coordinator [data-ln-table-coordinator]
    participant Table as Child Table [data-ln-table]

    User->>Search: Type query (or press '/')
    Search->>Coord: Emit ln-search:change
    Coord->>Table: Dispatch ln-table:set-search { query, table }
    Table->>Table: Re-filter dataset & re-render view

    User->>FilterPopover: Select Checkbox
    FilterPopover->>Coord: Emit ln-filter:changed { key, values }
    Coord->>Table: Toggle .ln-filter-active on th [data-ln-table-col-filter]
    Coord->>Table: Dispatch ln-table:set-filter { key, values, table }
    Table->>Table: Re-filter dataset & re-render view
```

---

## 7. Related Components

- [`ln-table`](./ln-table.md) — Table primitive receiving search and filter events.
- [`ln-search`](./ln-search.md) — Search bar input.
- [`ln-filter`](./ln-filter.md) — Column filter popover component.
- [`ln-popover`](./ln-popover.md) — Floating popover container holding filter lists.
- [`ln-data-coordinator`](./ln-data-coordinator.md) — Data store & form write coordinator.
