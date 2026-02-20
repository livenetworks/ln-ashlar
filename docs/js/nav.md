# Nav

Active link tracking for navigation. File: `js/ln-nav/ln-nav.js`.

## HTML

```html
<nav class="nav" data-ln-nav="active">
    <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/users">Users</a></li>
    </ul>
</nav>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-nav="className"` | Active CSS class to apply (e.g. "active") |

## Behavior

- Compares each `<a>` href against `window.location.pathname`
- Exact match or parent path match (e.g. `/users` matches `/users/edit`)
- Updates on `popstate` and `history.pushState` (works with ln-ajax)
- MutationObserver watches for dynamically added links
- Trailing slashes normalized
