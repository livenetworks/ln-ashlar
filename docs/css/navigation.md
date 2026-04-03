# Navigation

Sidebar navigation component. File: `scss/config/mixins/_nav.scss`.

## HTML

```html
<nav class="nav" data-ln-nav="active">
    <ul>
        <li><a href="/dashboard">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-home"></use></svg>
            <span class="nav-label">Dashboard</span>
        </a></li>
    </ul>

    <h6 class="nav-section">Section Title</h6>
    <ul>
        <li><a href="/users">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-users"></use></svg>
            <span class="nav-label">Users</span>
        </a></li>
        <li><a href="/settings">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-settings"></use></svg>
            <span class="nav-label">Settings</span>
        </a></li>
    </ul>

    <hr class="nav-divider">
</nav>
```

> **Semantics:** `.nav-section` is a group heading → `<h6>`, not `<div>`.
> `.nav-divider` is a separator → `<hr>`, not `<div>`.

## Elements

| Element | Description |
|---------|-------------|
| `<nav>` | Container — full height, flex column |
| `.nav-section` | Section header — xs uppercase muted text |
| `.nav-label` | Link text — flex-1 with truncate |
| `.nav-divider` | Horizontal border separator |
| `a.active` | Active link — styled by the active link preset |

## Active state

`data-ln-nav="active"` on the `<nav>` element tells `ln-nav` to mark the current page link as `.active` automatically based on `window.location`. No manual class needed.

---

## Link Style Presets

`@include nav` applies structure only. The visual appearance of links — hover, active, indicator — is controlled by a separate preset mixin applied after.

**Default:** `nav-links-rounded` is included inside `@include nav`. Override by applying a different preset after.

```scss
// Default — rounded floating links (applied automatically inside @include nav)
.nav { @include nav; }

// Override with a different preset — 1 line
.nav { @include nav; @include nav-links-border-left; }
.nav { @include nav; @include nav-links-border-grow; }
.nav { @include nav; @include nav-links-border-top; }
```

### Preset: `nav-links-rounded` (default)

Links float as pills inside the sidebar. `mx(0.5rem)` is required so the rounded corners do not touch the container wall (see visual-language.md §1).

- Hover: very faint primary tint (7% opacity bg)
- Active: `primary-lighter` bg + primary text + semibold

```
|  ╭── Dashboard ──╮  |
|  ╭── Users ──────╮  |   ← active: primary-lighter bg
|  ╰───────────────╯  |
```

### Preset: `nav-links-border-left`

Full-width flush links with an inset `box-shadow` as the left border. No pseudo-elements, no layout shift.

- Hover: 2px bar at 30% opacity + very faint bg
- Active: 3px solid bar + slightly stronger bg

```
| ▏ Dashboard          |
| ▌ Users              |   ← active: 3px solid bar
|   Settings           |
```

### Preset: `nav-links-border-grow`

Full-width flush links. `li::before` bar animates via `scaleY` with a spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

- Hover: bar scales to 45% height, 40% opacity
- Active: bar scales to 100%, full opacity + faint bg

The spring easing produces a slight overshoot on activation — organic feel without being distracting.

### Preset: `nav-links-border-top`

For **horizontal navigation** (top nav bars, tab rows). A top border grows from the center outward via `left`/`right` transition.

- Hover: bar at 20–80% width, 45% opacity
- Active: bar full width, full opacity

```
  Dashboard   Users   Settings
  ──────────
  (active: full-width top bar)
```

---

## Hover vs Active — the rule

Every preset maintains this visual hierarchy:

| State | Signal |
|-------|--------|
| Default | Quiet — no indicator, muted text |
| Hover | Soft indicator (partial bar or faint bg) — "I can click here" |
| Active | Full indicator + primary text + semibold — "I am here" |

Hover is always visually weaker than active. Never invert this.

---

## Custom selector (project SCSS)

```scss
// Apply nav to a custom element + choose a preset
#main-nav { @include nav; @include nav-links-border-grow; }
```

## Responsive

Uses CSS container queries. When the sidebar collapses below 80px width, `.nav-label` and `.nav-section` hide — only icons remain, centered.
