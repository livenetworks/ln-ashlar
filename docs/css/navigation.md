# Navigation

Sidebar navigation component. File: `scss/components/_nav.scss`.

## Usage

```html
<nav data-ln-nav="active">
    <h6 class="nav-section">Section Title</h6>
    <ul>
        <li><a href="/users">
            <span class="nav-icon ln-icon-users"></span>
            <span class="nav-label">Users</span>
        </a></li>
    </ul>
    <hr class="nav-divider">
</nav>
```

> **Semantics:** `.nav-section` is a group heading → use `<h6>`, not `<div>`.
> `.nav-divider` is a separator → use `<hr>`, not `<div>`.

## Elements

| Element | Description |
|---------|-------------|
| `<nav>` | Container -- full height, flex column |
| `.nav-section` | Section header -- xs uppercase muted text |
| `.nav-icon` | Icon slot -- 1.25rem flex-shrink-0 |
| `.nav-label` | Link text -- flex-1 with truncate |
| `.nav-divider` | Horizontal border separator |
| `a.active` | Active link -- primary color background + text |

## Responsive

Uses CSS container queries. When sidebar collapses below 80px, labels and sections hide, icons center.
