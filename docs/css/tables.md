# Tables

File: `scss/config/mixins/_table.scss`. Applied: `scss/components/_table.scss`.

---

## Auto-applied

`@include table-base` is applied globally to all `<table>` elements. No class or mixin needed for a standard table.

`<table>` also inherits `margin-bottom: 1rem` from base typography, so adjacent content (paragraphs, `<pre>` blocks, headings) keeps a consistent vertical rhythm. The margin is reset to `0` when the table is the only child of `.section-card > main` (auto-flush mode — see below).

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
| `.numeric` | Right-aligned, `tabular-nums` — for numbers |
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

Wrap in `.table-container` — provides horizontal scroll and stacks rows below 640px container width:

```html
<div class="table-container">
    <table>
        <tbody>
            <tr>
                <td data-label="Name">Marko</td>
                <td data-label="Status">Active</td>
            </tr>
        </tbody>
    </table>
</div>
```

`data-label` on each `<td>` is required for the stacked layout — it renders as the row label via `::before`.

For project-level control of the stacked breakpoint:

```scss
// Project SCSS — custom breakpoint
#users-table { @include table-responsive; }  // always stacked, or:

@container table (max-width: 480px) {
    #users-table { @include table-responsive; }
}
```

---

## Container-aware, not viewport-aware

The stacked layout is triggered by a **container query**, not a media
query. `.table-container` declares a container context; the `<table>`
inside queries its own available width and switches to the responsive
stacked layout when the container — not the viewport — is narrow
enough.

This is a deliberate architectural choice that applies to all ln-ashlar
components: **a component adapts to the space it was given, not to the
size of the browser window.** The same table dropped into a wide page
main, a narrow modal, or a sidebar panel behaves correctly in each
context with zero consuming-project overrides.

Media queries are reserved for the app shell (header, sidebar, page
columns). See `breakpoints.md` for the `@media` vs `@container` split
and `ln-ashlar-container-queries.md` for the full rationale.

The table's specific threshold (above which it is tabular, below which
it stacks) is defined in `scss/components/_table.scss`. Projects
override by applying `@include table-responsive` inside their own
`@container` rule on a scoped selector — see the example above.

---

## section-card integration

When `main` contains a `<table>` (or `.table-container`) **as its only child**, `.section-card` auto-flushes padding to `0` and strips the table's own `border-radius`, `box-shadow`, and `margin-bottom`. The card's `overflow: hidden` handles the rounded corners. No extra classes needed.

Mixed-content cards (intro `<p>` + table + more) keep their `main` padding and the table flows in the content area with its own chrome intact, separated from surrounding content by its default `margin-bottom: 1rem`. See [sections.md](sections.md#auto-flush-for-tables) for HTML examples.
