# Tables

File: `scss/components/_tables.scss`.

## Usage

```html
<table>
    <thead>
        <tr><th>Name</th><th>Status</th><th class="numeric">Score</th></tr>
    </thead>
    <tbody>
        <tr><td>Marko</td><td><span class="pass">OK</span></td><td class="numeric">95</td></tr>
        <tr class="section-header"><td colspan="3">Section</td></tr>
    </tbody>
</table>
```

## Features

- Dark header (`--color-table-header-bg`)
- Hover accent on rows (`bg-secondary`)
- First column bold + `bg-secondary`
- Responsive: stacks on mobile with `data-label` attributes

## Utility Classes

| Class | Description |
|-------|-------------|
| `.numeric` | Right-aligned, monospace |
| `.center` | Center-aligned |
| `.nowrap` | No text wrapping |
| `.pass` | Green text |
| `.fail` | Red text |
| `.warn` | Yellow text |
| `.striped` | Alternating row backgrounds |
| `.section-header` | Section divider row |

## Actions Column

```html
<td>
    <div class="actions">
        <a class="action primary" href="#">View</a>
        <button class="action danger">Delete</button>
    </div>
</td>
```

## Responsive

Wrap in `.table-container` for horizontal scroll, or use `data-label` on `<td>` for stacked mobile layout.
