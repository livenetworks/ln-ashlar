# Breadcrumbs

Navigation trail. File: `scss/components/_breadcrumbs.scss`.

## Usage

```html
<nav class="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/users">Users</a></li>
    <li class="current">Edit</li>
</nav>
```

Separator `>>` is auto-generated via `::before` pseudo-element.
