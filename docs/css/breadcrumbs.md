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

> **Семантика:** Breadcrumbs се подредена листа → `<ol>`, не голи `<li>` во `<nav>`.
> `aria-label="breadcrumb"` и `aria-current="page"` за accessibility.
