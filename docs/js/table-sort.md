# Table Sort

Sort header handler for tables. Companion to `ln-table` — detects `th[data-ln-sort]` headers and dispatches sort events on click. File: `js/ln-table/ln-table-sort.js`.

## HTML

```html
<table data-ln-table>
    <thead>
        <tr>
            <th data-ln-sort="string">
                Name
                <svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                <svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                <svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
            </th>
            <th data-ln-sort="number">
                Age
                <svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                <svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                <svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
            </th>
            <th data-ln-sort="date">
                Created
                <svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                <svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                <svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
            </th>
            <th>Actions</th> <!-- not sortable -->
        </tr>
    </thead>
    <tbody>...</tbody>
</table>
```

No separate attribute needed — any `<table>` containing `th[data-ln-sort]` is auto-initialized.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-sort="type"` | `<th>` | Enables sorting. Type: `string`, `number`, or `date` |
| `data-ln-sort-active="asc\|desc"` | `<th>` | Set by JS — indicates the currently active sort column and direction |
| `data-ln-sort-icon` | `<svg>` inside `<th>` | Sort direction indicator. No value = neutral, `"asc"` = ascending, `"desc"` = descending |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-table:sort` | yes | no | `{ column, sortType, direction }` |

- `column`: zero-based column index
- `sortType`: the `data-ln-sort` value (`string`, `number`, `date`)
- `direction`: `'asc'`, `'desc'`, or `null` (unsorted)

## Click Cycle

Each click on a sortable header cycles through three states:

```
(none) → asc → desc → (none) → asc → ...
```

Clicking a different column resets the previous column and starts at `asc`.

## Behavior

- Sets `data-ln-sort-active="asc"` or `"desc"` on the active `<th>` — use this for CSS arrows
- Clears `data-ln-sort-active` from all other headers when a new column is clicked
- Toggles `.hidden` class on `[data-ln-sort-icon]` elements to show/hide the correct direction icon
- The event is consumed by `ln-table` (if present) which performs the actual sort on its in-memory data
- Can also be used standalone — listen for `ln-table:sort` on the table and implement your own sorting

## CSS Styling

```scss
th[data-ln-sort] {
    cursor: pointer;
    user-select: none;
}

// Icons are in markup — styled via [data-ln-sort-icon] selector.
// .hidden class toggles visibility. Opacity transitions on hover/active.
```

---

## Internal Architecture

### State

Each table gets a `_component` instance stored at `table.lnTableSort`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `table` | Element | The table element |
| `ths` | Element[] | All sortable `<th>` elements |
| `_col` | number | Currently sorted column index (-1 = none) |
| `_dir` | string or null | Current direction (`'asc'`, `'desc'`, `null`) |

### Click Handler

```
click on th[data-ln-sort]
    |
    v
_handleClick(colIndex, th):
    1. Determine new direction:
       - Different column → 'asc'
       - Same column, was 'asc' → 'desc'
       - Same column, was 'desc' → null (clear)
    2. Clear data-ln-sort-active from all <th>
    3. Call _setSortIcon(th, null) on all <th> — resets icons to neutral state
    4. If newDir is not null → set data-ln-sort-active on clicked <th>
    5. Call _setSortIcon(th, newDir) — toggles .hidden on [data-ln-sort-icon] elements
    6. Update _col and _dir
    7. dispatch 'ln-table:sort' on the table
```

`_setSortIcon(th, dir)` queries all `[data-ln-sort-icon]` inside `th` and toggles
`.hidden` so only the matching direction icon is visible. If no icons are present
in markup, the function is a no-op — sort still works without visual indicators.

### Persistence

Table sort supports opt-in `localStorage` persistence via `data-ln-persist` on the `[data-ln-table]` **wrapper** (not on the `<table>` element).

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-persist` | `[data-ln-table]` wrapper | Uses wrapper `id` as storage key |
| `data-ln-persist="custom-key"` | `[data-ln-table]` wrapper | Uses the given string as storage key |

**Storage key format:** `ln:table-sort:{pagePath}:{wrapperId}`

**Stored value:** `{ col: number, dir: 'asc'|'desc' }` or `null` (unsorted)

**Restore timing:** In `_component` constructor, after click handlers are bound. Uses `table.closest('[data-ln-table][data-ln-persist]')` to locate the wrapper. If a saved value exists and `saved.col < ths.length` (stale column index check), `_handleClick` is called to replay the sort: once for `'asc'`, twice for `'desc'` (matching the click cycle from no-sort state).

**Save timing:** In `_handleClick`, after `dispatch('ln-table:sort')`. Saves `null` when sort is cleared (third click).

**Stale column index:** If the saved column index is out of range (column removed from DOM), the guard `saved.col < ths.length` silently skips restore with no error.

### Guard

Each `<th>` gets a `lnTableSortBound = true` property to prevent duplicate click listeners when MutationObserver re-fires.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → scan for tables with sortable headers
- **`attributes`** (`data-ln-sort`): attribute added to existing `<th>` → re-scan parent table
