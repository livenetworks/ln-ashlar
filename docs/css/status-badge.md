# Status Badge

Inline semantic indicator with a colored dot. Files: `scss/config/mixins/_status-badge.scss`, `scss/components/_status-badge.scss`.

## HTML

```html
<!-- Semantic levels -->
<span class="badge">Default</span>
<span class="badge success">Active</span>
<span class="badge warning">Pending</span>
<span class="badge error">Blocked</span>
<span class="badge info">Draft</span>
<span class="badge neutral">Archived</span>

<!-- Live pulse — add .live for animated dot -->
<span class="badge success live">Syncing</span>

<!-- On a button — clickable badge -->
<button class="badge error">Blocked</button>
```

## Variants

| Class | Color token | Use |
|-------|-------------|-----|
| *(none)* | `--color-info` (default) | General / neutral |
| `.success` | `--color-success` | Active, confirmed, complete |
| `.warning` | `--color-warning` | Pending, expiring, attention |
| `.error` | `--color-error` | Failed, blocked, critical |
| `.info` | `--color-info` | Draft, informational |
| `.neutral` | `--fg-muted` | Archived, inactive, disabled |

## Live pulse

`.badge.live` adds a pulsing animation to the dot — signals an ongoing or real-time state.

```html
<span class="badge success live">Connected</span>
<span class="badge warning live">Syncing</span>
```

## Button badge

When placed on a `<button>`, the badge is clickable — hover and active states are applied automatically. Use for filterable status labels or togglable states.

```html
<button class="badge error">Blocked</button>
```

## Color override

Override `--color-primary` on the element or a parent to use a custom color. All parts (dot, text, background) adapt automatically.

```scss
// Project SCSS — custom status color
.badge.premium { --color-primary: var(--color-gold); }
```

## Project SCSS

Use `@mixin badge` on a semantic selector instead of the `.badge` class:

```scss
#status-cell span { @include badge; }
#status-cell span.active { --color-primary: var(--color-success); }
```
