# ln-nav

Active link highlighter — automatically marks the active link in navigation based on the current URL.
Works with `pushState` (ln-ajax) and `popstate` (browser back/forward).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-nav="active"` | `<nav>` element | Activates the nav highlighter; the value is the CSS class for the active link |

## Behavior

- On init, scans all `<a>` elements inside the navigation
- Compares the `href` of each link with `window.location.pathname`
- Adds the CSS class (defined in `data-ln-nav`) to matching links
- **Exact match**: `/users` matches `/users`
- **Parent match**: `/users` also matches `/users/123` (prefix match)
- **Root (`/`)**: not treated as a parent — exact match only
- Trailing slash is normalized (`/users/` == `/users`)
- On `pushState` (ln-ajax navigation) automatically updates active links
- On `popstate` (browser back/forward) also updates
- Dynamically added links (MutationObserver) are automatically processed

## HTML Structure

```html
<nav data-ln-nav="active">
    <a href="/dashboard">Dashboard</a>
    <a href="/users">Users</a>
    <a href="/settings">Settings</a>
</nav>
```

If the URL is `/users/42`, the `/users` link will get the `active` class.

## CSS Styling

```scss
nav a {
    @include text-secondary;
    &.active {
        @include text-primary;
        @include font-bold;
        @include bg-secondary;
    }
}
```

## API

```javascript
// Manual initialization
window.lnNav(document.getElementById('sidebar-nav'));
```

## Integration with ln-ajax

`ln-nav` hooks into `history.pushState` to detect URL changes from ln-ajax. The override is a **singleton** — set only once, regardless of how many `[data-ln-nav]` elements exist on the page. No additional configuration is needed — the active link updates after every AJAX navigation.
