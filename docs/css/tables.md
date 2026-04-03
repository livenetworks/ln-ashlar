# Tables

File: `scss/config/mixins/_table.scss`. Applied: `scss/components/_tables.scss`.

---

## Auto-applied

`@include table-base` is applied globally to all `<table>` elements. No class or mixin needed for a standard table.

---

## HTML

```html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Status</th>
            <th class="numeric">Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Marko</td>
            <td><span class="pass">OK</span></td>
            <td class="numeric">95</td>
        </tr>
        <tr class="section-header">
            <td colspan="3">Section</td>
        </tr>
    </tbody>
</table>
```

---

## Mixins

| Mixin | Description |
|-------|-------------|
| `@include table-base` | Base styling — header bg, row hover, first column bold, border |
| `@include table-responsive` | Mobile stacked layout using `data-label` attributes on `<td>` |
| `@include table-striped` | Alternating row backgrounds |
| `@include table-section-header` | Section divider row styling |

```scss
// Override on a specific table
#audit-log {
    @include table-base;
    @include table-striped;
    thead { display: none; }
}

// Responsive with stacked mobile
#users-table {
    @include table-base;
    @include table-responsive;
}
```

---

## Structural classes

These describe the **role** of a cell or row — acceptable in HTML:

| Class | Description |
|-------|-------------|
| `.numeric` | Right-aligned, monospace — for numbers |
| `.center` | Center-aligned |
| `.nowrap` | Prevent text wrapping |
| `.section-header` | Section divider row |

---

## Status classes

Inline status indicators — apply to a `<span>` inside `<td>`:

| Class | Color |
|-------|-------|
| `.pass` | Green (`--color-success`) |
| `.fail` | Red (`--color-error`) |
| `.warn` | Yellow (`--color-warning`) |

```html
<td><span class="pass">Active</span></td>
<td><span class="fail">Blocked</span></td>
```

---

## Actions column

Action buttons use `@include btn-group` on a `<ul>`. Color change via `--color-primary` override — no `danger` or `primary` classes:

```html
<td>
    <ul>
        <li><button type="button">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
        </button></li>
        <li><button type="button">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
        </button></li>
    </ul>
</td>
```

```scss
// Project SCSS
#users td:last-child ul { @include btn-group; }
#users td:last-child li:last-child button { --color-primary: var(--color-error); }
```

---

## Responsive

Wrap in `.table-container` for horizontal scroll on mobile:

```html
<div class="table-container">
    <table>...</table>
</div>
```

Or use `@include table-responsive` + `data-label` on each `<td>` for stacked mobile layout:

```html
<tr>
    <td data-label="Name">Marko</td>
    <td data-label="Status">Active</td>
</tr>
```

---

## section-card integration

When a `<table>` is a direct child of `.section-card > main`, padding is removed automatically and rounded corners are handled by the card's `overflow: hidden`. No extra classes needed — `:has()` detects the table.
