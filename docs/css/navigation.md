# Navigation

Sidebar navigation component. File: `scss/components/_navigation.scss`.

## Usage

```html
<nav class="nav" data-ln-nav="active">
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

> **Семантика:** `.nav-section` е наслов на група → користи `<h6>`, не `<div>`.
> `.nav-divider` е разделувач → користи `<hr>`, не `<div>`.

## Elements

| Element | Description |
|---------|-------------|
| `.nav` | Container -- full height, flex column |
| `.nav-section` | Section header -- xs uppercase muted text |
| `.nav-icon` | Icon slot -- 1.25rem flex-shrink-0 |
| `.nav-label` | Link text -- flex-1 with truncate |
| `.nav-divider` | Horizontal border separator |
| `a.active` | Active link -- primary color background + text |

## Responsive

Uses CSS container queries. When sidebar collapses below 80px, labels and sections hide, icons center.
