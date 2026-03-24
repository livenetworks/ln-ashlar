# ln-table

Data table component — in-memory filter, sort, virtual scroll.
Two independent components that communicate via CustomEvents.

| Component | `window.*` | Responsibility |
|-----------|-----------|-------------|
| `ln-table-sort` | `lnTableSort` | Click on `th` → cycling asc/desc/null → dispatch `ln-table:sort` |
| `ln-table` | `lnTable` | Parse rows, listen to events, filter + sort in memory, render |

Search is provided by **`ln-search`** (generic component) — `data-ln-search="tableId"` on the input.

---

## Basic Usage

```html
<div id="employees" data-ln-table>
    <header class="ln-table__toolbar">
        <h3>Employees</h3>
        <aside>
            <label class="ln-table__search">
                <span class="ln-icon-filter ln-icon--sm"></span>
                <input type="search" placeholder="Search..." data-ln-search="employees">
            </label>
            <span class="ln-table__count"></span>
            <span class="ln-table__timing"></span>
        </aside>
    </header>

    <table>
        <thead>
            <tr>
                <th data-ln-sort="number">#</th>
                <th data-ln-sort="string">Name</th>
                <th data-ln-sort="date">Date</th>
                <th data-ln-sort="number">Salary</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>John Smith</td>
                <td data-ln-value="1700000000">15.11.2023</td>
                <td data-ln-value="55000">55,000</td>
                <td><button>...</button></td>
            </tr>
        </tbody>
    </table>

    <footer class="ln-table__footer">
        <span>Total: <strong></strong></span>
    </footer>
</div>
```

---

## Attributes

### `[data-ln-table]`

On the wrapper element. Must have an `id` if connected to a search input.

### `[data-ln-search="tableId"]`

On `<input>` (or wrapper) — standard `ln-search` attribute.
`ln-table` intercepts the `ln-search:change` event and calls `preventDefault()`,
so `ln-search` skips its own DOM show/hide and `ln-table` handles
filtering in memory.

### `[data-ln-table-clear]`

On a button — clears the connected search input value.
Resolved via: `btn → closest [data-ln-table] → id → [data-ln-search="id"]`.

### `th[data-ln-sort]`

On `<th>` elements — makes columns sortable.
The value determines the comparison type:

| Value | Comparison |
|----------|-------------|
| `string` | Lexicographic (Intl.Collator — locale-aware, reads from `<html lang>`) |
| `number` | Numeric |
| `date` | Numeric (timestamp in `data-ln-value`) |
| _(no value)_ | Column is not sortable |

### `td[data-ln-value]`

On `<td>` — raw value for sort/filter when display text differs (formatted numbers, dates).

```html
<!-- Without data-ln-value: sorts by "55,000" (string) -->
<td>55,000</td>

<!-- With data-ln-value: sorts by 55000 (number), displays "55,000" -->
<td data-ln-value="55000">55,000</td>

<!-- Date: sorts by Unix timestamp, displays formatted date -->
<td data-ln-value="1700000000">15.11.2023</td>
```

---

## Empty state

`ln-table` contains no hardcoded markup or text.
When search returns 0 results, the content of `<template data-ln-table-empty>` is shown (if present) and `ln-table:empty` event is always dispatched.

```html
<div id="employees" data-ln-table>
    <template data-ln-table-empty>
        <article class="ln-table__empty-state">
            <span class="ln-icon-filter ln-icon--xl"></span>
            <h3>No results found</h3>
            <p>Try a different search term.</p>
            <button class="btn btn--secondary" data-ln-table-clear>Clear</button>
        </article>
    </template>

    <table>...</table>
</div>
```

Without `<template>` — listen to the event and show your own UI:

```javascript
document.getElementById('employees').addEventListener('ln-table:empty', function (e) {
    console.log('No results for:', e.detail.term);
});
```

---

## CSS Classes

| Class | Description |
|-------|------|
| `.ln-table__toolbar` | Sticky header (pinned below `.header`) |
| `.ln-table__search` | Wrapper for search input with icon |
| `.ln-table__count` | Badge with record count (populated by JS) |
| `.ln-table__timing` | Monospace badge with ms (populated by JS) |
| `.ln-table__footer` | Footer with total count |
| `.ln-table__empty-state` | Style for empty state article |

---

## Events

All events are dispatched on the `[data-ln-table]` element and bubble up.

The component dispatches only raw numbers — formatting is the page's responsibility.

| Event | Dispatched by | `detail` |
|-------|-------------|----------|
| `ln-table:ready` | `ln-table` — after row parsing | `{ total }` |
| `ln-table:filter` | `ln-table` — after filter render | `{ term, matched, total }` |
| `ln-table:sort` | `ln-table-sort` — after `th` click | `{ column, sortType, direction }` |
| `ln-table:sorted` | `ln-table` — after sort render | `{ column, direction, matched, total }` |
| `ln-table:empty` | `ln-table` — when filter returns 0 results | `{ term, total }` |

```javascript
var table = document.getElementById('employees');

// Initial count after parsing
table.addEventListener('ln-table:ready', function (e) {
    countEl.textContent = e.detail.total.toLocaleString();
});

// After search — update count
table.addEventListener('ln-table:filter', function (e) {
    countEl.textContent = e.detail.matched < e.detail.total
        ? e.detail.matched.toLocaleString() + ' / ' + e.detail.total.toLocaleString()
        : e.detail.total.toLocaleString();
});

// No results
table.addEventListener('ln-table:empty', function (e) {
    console.log('No match for:', e.detail.term);
});
```

---

## Virtual scroll

Automatically activates when the number of (filtered) rows exceeds 200.
Renders only visible rows + 15 buffer rows above/below the viewport.
Deactivates automatically when rows drop below the threshold.

Column widths are locked on first parse to prevent width jumps.

---

## Dynamic rows

If `<tbody>` is empty at init (rows arrive via AJAX), the component waits — MutationObserver detects when rows are added and parses them automatically.

```javascript
// After AJAX — set innerHTML directly, ln-table will detect it
document.querySelector('#employees tbody').innerHTML = generatedHtml;
```

---

## Colspan — last column

The last column (actions/buttons) is excluded from the search index — JS takes only `cells[0..n-2]` for `searchText`.

---

## Intl.Collator usage

The collator for string sort is created once at init:

```javascript
new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
```

If `<html lang="en">` — locale-aware sort.
If `lang` is empty — browser default locale.
