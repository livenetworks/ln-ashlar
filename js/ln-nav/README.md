# ln-nav

Active link highlighter — automatically marks the active link in navigation based on the current URL.
Works with `pushState` (ln-ajax) and `popstate` (browser back/forward).

## Integration

### In-Bundle (Standard Integration)
To load `ln-nav` as part of the unified `ln-ashlar` bundle, include the main script:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

### Standalone (Zero-Dependency IIFE)
If you only need the active link highlighter component, load the compiled zero-dependency IIFE directly:
```html
<script src="js/ln-nav/ln-nav.js" defer></script>
```

### Source Files & Development
- **Active Development Source**: [js/ln-nav/src/ln-nav.js](file:///c:/laragon/www/ln-ashlar/js/ln-nav/src/ln-nav.js) — The source of truth for component logic.
- **Compiled Standalone**: [js/ln-nav/ln-nav.js](file:///c:/laragon/www/ln-ashlar/js/ln-nav/ln-nav.js) — The compiled, ready-to-use standalone bundle.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-nav="className"` | `<nav>` element | CSS class to apply to the active link (any class name) |
| `data-ln-nav-exact` | `<nav>` element | Opt out of parent-prefix matching — only exact URL matches activate a link. Read at init; adding it after initialization requires re-init. |

## Behavior

- Compares each `<a href>` inside the nav against `window.location.pathname`.
- **Match rule (default)**: exact match (`/users` == `/users`) OR parent-prefix match (`/users` matches `/users/42`). Root (`/`) is exact-only — it never matches as a parent. Trailing slashes are normalized (`/users/` == `/users`).
- **Exact-only mode** (`data-ln-nav-exact`): only strict URL equality activates a link. Parent-prefix matching is disabled.
- Active links receive both the CSS class AND `aria-current="page"` (accessibility). Inactive links have `aria-current` removed.
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

---

## ⚡ DOM Events

All events bubble from the `<nav>` element.

| Event | Cancelable | Payload (`detail`) | Description |
|---|---|---|---|
| `ln-nav:before-update` | Yes | `{ target }` | Fires at the start of every `update()` pass. Call `e.preventDefault()` to skip the highlight recalculation. |
| `ln-nav:update` | No | `{ target }` | Fires after active classes / `aria-current` have been applied to matching links. |
| `ln-nav:destroyed` | No | `{ target }` | Fires inside `destroy()`, after listeners/observer are torn down. |

---

## 🔧 Internals

Source: `js/ln-nav/ln-nav.js`. Registered via `registerComponent` with `extraAttributes: ['data-ln-nav-exact']` and an `onAttributeChange` bridge — the shared core handles instantiation, body-guarding, and teardown.

### Singleton `pushState` patch

`history.pushState` is monkey-patched once per page, guarded by `history._lnNavPatched`. Every `[data-ln-nav]` instance pushes its `updateHandler` onto a shared `_pushStateCallbacks` array; the patched `pushState` calls the original, then invokes every registered handler. This is the only mechanism that catches URL changes from `pushState`-based navigation (e.g. `ln-ajax`); `popstate` is wired separately for back/forward.

### Per-instance MutationObserver

Each instance also watches its own container (`childList`/`subtree`) so dynamically inserted/removed anchors (e.g. an AJAX-rendered menu) trigger `update()` without waiting for a URL change.

### URL normalization & matching

Both `link.href` and `location.pathname` go through `new URL(href, location.href)` then a trailing-slash strip (root falls back to `/`). Hash-only links, `mailto:`/`tel:`/`javascript:`, and cross-host links are excluded outright. Match rule: exact equality, or (unless `data-ln-nav-exact`) parent-prefix — `normalizedCurrent.startsWith(normalizedHref + '/')`, with `/` excluded from the parent rule so root doesn't match everything.

### `update()` sequence

Dispatches cancelable `ln-nav:before-update` (a listener calling `preventDefault()` aborts) → adds `activeClass` + `aria-current="page"` to matching links, removes both from non-matching ones → dispatches bubbling `ln-nav:update`.

### Attribute bridge

`_syncAttribute(el, attrName)` runs on `data-ln-nav`/`data-ln-nav-exact` mutation: a class-name change clears the old class from every anchor before caching the new one and re-running `update()`; an exact-mode change updates the flag and re-runs `update()`.

### Teardown

`destroy()` disconnects the local observer, removes the `popstate` listener, splices `updateHandler` out of the global `_pushStateCallbacks` array, and dispatches `ln-nav:destroyed`.
