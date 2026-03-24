# Breadcrumbs

Navigation trail. File: `scss/components/_breadcrumbs.scss`.

## Usage

```html
<nav aria-label="breadcrumb">
    <ol class="breadcrumbs">
        <li><a href="/">Home</a></li>
        <li><a href="/users">Users</a></li>
        <li class="current" aria-current="page">Edit</li>
    </ol>
</nav>
```

Separator `>>` is auto-generated via `::before` pseudo-element.

> **Semantics:** Breadcrumbs are an ordered list → `<ol>`, not bare `<li>` inside `<nav>`.
> `aria-label="breadcrumb"` and `aria-current="page"` for accessibility.
