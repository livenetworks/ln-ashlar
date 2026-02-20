# Navigation

Sidebar navigation component. File: `scss/components/_navigation.scss`.

## Usage

```html
<nav class="nav" data-ln-nav="active">
    <div class="nav-section">Section Title</div>
    <ul>
        <li><a href="/users">
            <span class="nav-icon ln-icon-users"></span>
            <span class="nav-label">Users</span>
        </a></li>
    </ul>
    <div class="nav-divider"></div>
</nav>
```

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
