---
name: app-shell
classification: css
status: active
domain: frontend
summary: Application shell scaffolding with fixed header, collapsible sidebar drawer, scrim backdrop, and scroll boundaries.
source: theme/config/mixins/_app-shell.scss
tags: [app-shell, layout, header, sidebar, navigation, drawer]
---

# 🖥️ app-shell

---

## 1. Core Behavior & Responsibility

The `app-shell` mixin set (`theme/config/mixins/_app-shell.scss` and `theme/components/_app-shell.scss`) coordinates the responsive application scaffolding:
- **Bounded Viewport:** `.app-wrapper` locks the viewport to `100dvh` (`overflow: hidden`), while `.app-main` acts as the inner scrolling container.
- **Fixed Header (`app-header`):** Fixed top bar with resting elevation shadow, height set via `--app-header-height`, and default ghost button styling.
- **Responsive Sidebar Drawer (`sidebar` + `sidebar-drawer`):** Persistent desktop sidebar shifting to a slide-out overlay drawer below `$bp-md` (768px).
- **Zero-JS Scrim Activation (`app-scrim`):** The scrim overlay activates via CSS sibling combinator (`aside[data-ln-toggle="open"] ~ &`) without requiring dedicated JS scripts.
- **Desktop Content Shift:** On desktop (`mq-up(md)`), `.app-main` uses `:has(.app-sidebar[data-ln-toggle="open"])` to pad the content column and footer by `--app-sidebar-width` without viewport overflow.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="app-wrapper">
    <header class="app-header">
        <div class="header-left">
            <button type="button" class="menu-toggle" data-ln-toggle-for="main-sidebar" aria-label="Toggle Navigation">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-menu-2"></use></svg>
            </button>
            <strong>DocuFlow</strong>
        </div>
        <div class="header-right">
            <ul class="header-actions">
                <li><button type="button"><span>Settings</span></button></li>
            </ul>
        </div>
    </header>
    <main class="app-main">
        <aside class="app-sidebar" id="main-sidebar" data-ln-toggle="open">
            <nav data-ln-nav>
                <ul>
                    <li><a href="/dashboard" aria-current="page"><span class="nav-label">Dashboard</span></a></li>
                    <li><a href="/documents"><span class="nav-label">Documents</span></a></li>
                </ul>
            </nav>
        </aside>
        <section class="app-content-wrapper">
            <!-- Main page content -->
        </section>
        <div class="app-scrim" data-ln-toggle-for="main-sidebar"></div>
    </main>
</div>
```

### Variant 1: Semantic SCSS Mixin Binding

```scss
#app-root          { @include app-wrapper; }
#app-root > header { @include app-header; }
#app-root > main   { @include app-main; }
#main-sidebar      { @include sidebar; @include sidebar-drawer; }
#app-scrim         { @include app-scrim; }
#app-footer        { @include app-footer; }
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `app-wrapper` | mixin | — | Root viewport wrapper (`100dvh`, `overflow: hidden`, `bg-recessed`) |
| `app-header` | mixin | — | Fixed header bar with resting shadow, border, and ghost button defaults |
| `app-header-left` | mixin | — | Flex row with logo/title and `.menu-toggle` button |
| `app-header-right` | mixin | — | Flex row container for search, actions, and user menu |
| `app-header-actions` | mixin | — | Action button group hiding labels below `$bp-sm` |
| `header-avatar` | mixin | — | 2rem circular image thumbnail popover trigger |
| `app-main` | mixin | — | Inner scrollable viewport with sidebar / content flexbox |
| `sidebar-drawer` | mixin | — | Responsive drawer positioning & transform below `$bp-md` (768px) |
| `app-scrim` | mixin | — | Semi-transparent backdrop for mobile drawer (activates via sibling CSS) |
| `app-footer` | mixin | — | Bottom metadata chrome bar with two-span pattern |
| `.app-wrapper` | class | — | Prototyping class for `app-wrapper` |
| `.app-header` | class | — | Prototyping class for `app-header` |
| `.app-main` | class | — | Prototyping class for `app-main` |
| `.app-sidebar` | class | — | Prototyping class for `sidebar` + `sidebar-drawer` |
| `.app-scrim` | class | — | Prototyping class for `app-scrim` |
| `--app-header-height` | token | `3.25rem` | Intrinsic header height |
| `--app-sidebar-width` | token | `14.5rem` | Intrinsic sidebar width and desktop content shift |
| `--app-scrim-bg` | token | `hsl(var(--color-neutral-900) / 0.4)` | Scrim backdrop color |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Put Page Scroll on `<body>`:** In an application shell, the outer viewport is locked (`overflow: hidden`), and scrolling occurs inside `.app-content-wrapper` or direct `<section>` children of `.app-main`.
> 2. **Mobile Drawer Scrim Wiring:** Always ensure the `.app-scrim` element is wired with `data-ln-toggle-for` so clicking outside dismisses the mobile drawer.
> 3. **App Shell Breakpoints Use `@media`:** App shell is the explicit exception to container queries; it queries `@media` directly because it governs the root viewport.

---

## 5. Related Documents

- [`navigation`](./navigation.md) — Navigation menus, links, and sidebar lists.
- [`density`](./density.md) — Header and sidebar dimensions across density tiers.
- [`breakpoints`](./breakpoints.md) — Viewport breakpoint media query thresholds.
- [`scss-architecture`](../doctrine/scss-architecture.md) — Two-layer design system and mixin architecture.
