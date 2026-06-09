# Table Sort

Sort header handler for tables. Companion to `ln-table` — detects `th[data-ln-table-sort]` headers and dispatches sort events on click. File: `js/ln-table/ln-table-sort.js`.

## HTML

Each sortable `<th>` **must** contain a `<button data-ln-table-col-sort>` — the JS click handler binds to the button, not the `<th>`. Without the button, sort silently no-ops (a CSS dev affordance flags the omission).

```html
<table data-ln-table>
    <thead>
        <tr>
            <th data-ln-table-sort="string">
                Name
                <button type="button" class="table-sort" data-ln-table-col-sort aria-label="Sort">
                    <svg class="ln-icon" data-ln-table-col-sort-icon="none" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                    <svg class="ln-icon" data-ln-table-col-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                    <svg class="ln-icon" data-ln-table-col-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                </button>
            </th>
            <th data-ln-table-sort="number">
                Age
                <button type="button" class="table-sort" data-ln-table-col-sort aria-label="Sort">
                    <svg class="ln-icon" data-ln-table-col-sort-icon="none" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                    <svg class="ln-icon" data-ln-table-col-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                    <svg class="ln-icon" data-ln-table-col-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                </button>
            </th>
            <th data-ln-table-sort="date">
                Created
                <button type="button" class="table-sort" data-ln-table-col-sort aria-label="Sort">
                    <svg class="ln-icon" data-ln-table-col-sort-icon="none" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                    <svg class="ln-icon" data-ln-table-col-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                    <svg class="ln-icon" data-ln-table-col-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                </button>
            </th>
            <th>Actions</th> <!-- not sortable -->
        </tr>
    </thead>
    <tbody>...</tbody>
</table>
```

Auto-initialized for any `<table>` containing `th[data-ln-table-sort]` headers. Each sortable `<th>` **requires** a `<button data-ln-table-col-sort>` child — the sort button is the JS click target.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-table-sort="type"` | `<th>` | Enables sorting. Type: `string`, `number`, or `date` |
| `data-ln-table-col-sort` | `<button>` inside `<th>` | Click target for sort. Required — JS binds to this button. |
| `data-ln-table-col-sort-icon="none\|asc\|desc"` | `<svg>` inside the button | Sort direction indicator. CSS controls visibility via `.ln-sort-asc` / `.ln-sort-desc` on the `<th>`. |

## Sort Value Source

`data-ln-table-sort` declares the column's sort *type*; the *value* sorted is
read by `ln-core.readValue` from each cell's `data-ln-value`
(see [Core → The `data-ln-value` Primitive](core.md#the-data-ln-value-primitive)).
Formatted display text is never sorted directly.

```html
<!-- number column: raw amount, dot decimal, no grouping -->
<th data-ln-table-sort="number">Salary <button data-ln-table-col-sort ...></button></th>
...
<td data-ln-value="120000">$120,000.00</td>

<!-- date column: raw Unix timestamp -->
<th data-ln-table-sort="date">Created <button data-ln-table-col-sort ...></button></th>
...
<td data-ln-value="1700000000">15 Nov 2023</td>
```

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-table:sort` | yes | no | `{ column, sortType, direction }` |

- `column`: zero-based column index
- `sortType`: the `data-ln-table-sort` value (`string`, `number`, `date`)
- `direction`: `'asc'`, `'desc'`, or `null` (unsorted)

## Click Cycle

Each click on a sort button cycles through three states:

```
(none) → asc → desc → (none) → asc → ...
```

Clicking a different column resets the previous column and starts at `asc`.

## Behavior

- Adds `.ln-sort-asc` or `.ln-sort-desc` class to the active `<th>` — use these for CSS arrows
- Removes `.ln-sort-asc` / `.ln-sort-desc` from all other headers when a new column is clicked
- Toggles visibility of `[data-ln-table-col-sort-icon]` elements inside the sort button to show the correct direction icon (CSS owns visibility via the `.ln-sort-asc` / `.ln-sort-desc` state classes)
- The event is consumed by `ln-table` (if present) which performs the actual sort on its in-memory data
- Can also be used standalone — listen for `ln-table:sort` on the table and implement your own sorting

## CSS Styling

```scss
th[data-ln-table-sort] {
    cursor: pointer;
    user-select: none;
}

// Icons controlled via state classes on the th — CSS owns visibility.
// .ln-sort-asc / .ln-sort-desc on <th> selects the matching [data-ln-table-col-sort-icon] svg.
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
click on button[data-ln-table-col-sort] inside th[data-ln-table-sort]
    |
    v
_handleClick(colIndex, th):
    1. Determine new direction:
       - Different column → 'asc'
       - Same column, was 'asc' → 'desc'
       - Same column, was 'desc' → null (clear)
    2. Remove .ln-sort-asc / .ln-sort-desc from all <th>
    3. If newDir is not null → add .ln-sort-asc or .ln-sort-desc to clicked <th> (CSS handles icon visibility)
    4. Update _col and _dir
    5. dispatch 'ln-table:sort' on the table
```

CSS states handle all icon visibility. The JS simply toggles `.ln-sort-asc` and `.ln-sort-desc` on the `<th>`. If no icons are present in markup, the sort still works programmatically without visual indicators.

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
- **`attributes`** (`data-ln-table-sort`): attribute added to existing `<th>` → re-scan parent table

---

## Development Diagnostics (DOM Linter)

To prevent silent failures during local integration (such as designating a column sortable but forgetting the required sort button), `ln-ashlar` ships with a dedicated development validation stylesheet: `demo/dist/ln-ashlar-dev.css`.

### Missing Sort Button Detection
If a `<th>` is marked sortable (`data-ln-table-sort`) but does not contain a `<button data-ln-table-col-sort>`, `ln-ashlar-dev.css` will automatically render a warning text adjacent to the header:
```
⚠ missing sort button
```

> [!IMPORTANT]
> The diagnostic styles are intentionally excluded from the production stylesheet `ln-ashlar.css`. Only link `ln-ashlar-dev.css` in local development and staging environments.

