# ln-nav

Active link highlighter — automatically marks the active link in navigation based on the current URL.
Works with `pushState` (ln-ajax) and `popstate` (browser back/forward).

For internal mechanics — singleton `history.pushState` patch, per-instance MutationObserver, URL normalization — see [`docs/js/nav.md`](../../docs/js/nav.md).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-nav="className"` | `<nav>` element | CSS class to apply to the active link (any class name) |

## Behavior

- Compares each `<a href>` inside the nav against `window.location.pathname`.
- **Match rule**: exact match (`/users` == `/users`) OR parent-prefix match (`/users` matches `/users/42`). Root (`/`) is exact-only — it never matches as a parent. Trailing slashes are normalized (`/users/` == `/users`).
- Re-runs on `popstate` (browser back/forward) and on `history.pushState` (ln-ajax navigation) automatically — no configuration.
- New `<a>` elements added under the nav after init are scored immediately (per-instance MutationObserver).

## HTML Structure

```html
<nav data-ln-nav="active">
	<ul>
		<li><a href="/dashboard">Dashboard</a></li>
		<li><a href="/users">Users</a></li>
		<li><a href="/settings">Settings</a></li>
	</ul>
</nav>
```

If the URL is `/users/42`, the `/users` link will get the `active` class.

## CSS

```scss
nav a {
	--color-fg: var(--fg-muted);
	color: var(--color-fg);
	&.active {
		@include text-primary;
		@include font-bold;
		--color-bg: var(--bg-sunken);
		background: var(--color-bg);
	}
}
```

## API

`data-ln-nav` is the contract — setting the attribute on a connected `<nav>` is sufficient (the document-level MutationObserver picks it up). For custom roots that the observer does not watch (Shadow DOM, iframe), call `window.lnNav(rootElement)` to upgrade manually. Each `[data-ln-nav]` element exposes `element.lnNav.destroy()` for teardown.
