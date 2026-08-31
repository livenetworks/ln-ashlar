---
name: app-shell
classification: css
status: draft
domain: frontend
summary: Application shell scaffolding with fixed header, collapsible sidebar drawer, scrim backdrop, and scroll boundaries.
source: theme/config/mixins/_app-shell.scss
tags: [app-shell, layout, header, sidebar, navigation, drawer]
---

# 🖥️ app-shell

---

## 1. Core Behavior & Responsibility

The `app-shell` mixin set (`theme/config/mixins/_app-shell.scss` and `theme/components/_app-shell.scss`) coordinates the responsive application scaffolding:
- **Bounded Viewport:** `.app-wrapper` locks to `100dvh` (`overflow: hidden`), while `.app-main` acts as the inner viewport.
- **Fixed Header:** Fixed top navigation bar (`@include app-header` / `.app-header`).
- **Collapsible Sidebar Drawer:** Desktop persistent sidebar shifting to a slide-out drawer below `$bp-md` (768px).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="app-wrapper">
    <header class="app-header">
        <button type="button" class="btn btn-ghost" data-ln-toggle-for="main-sidebar" aria-label="Toggle Navigation">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-menu-2"></use></svg>
        </button>
        <strong>DocuFlow</strong>
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

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `app-wrapper` | mixin | — | Root viewport wrapper (100dvh, overflow: hidden) |
| `app-header` | mixin | — | Fixed header bar with resting shadow and border |
| `app-main` | mixin | — | Inner scrollable viewport with sidebar / content flexbox |
| `sidebar-drawer` | mixin | — | Responsive drawer transform below $bp-md (768px) |
| `app-scrim` | mixin | — | Semi-transparent backdrop for mobile drawer |
| `app-footer` | mixin | — | Application footer layout |
| `--app-header-height` | token | `3.25rem` – `4.5rem` | Fixed header height across density tiers |
| `--app-sidebar-width` | token | `14.5rem` – `18rem` | Sidebar width across density tiers |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Put Scroll on `<body>`:** In an app shell, the outer viewport is locked (`overflow: hidden`), and scrolling occurs inside `.app-content-wrapper`.
> 2. **Mobile Drawer Scrim Wiring:** Always ensure the `.app-scrim` element is wired with `data-ln-toggle-for` to dismiss the drawer when clicked outside on mobile devices.

---

## 5. Related Documents

- [`navigation`](./navigation.md) — Navigation links and sidebar menus.
- [`density`](./density.md) — Header and sidebar dimensions across density tiers.
- [`breakpoints`](./breakpoints.md) — Media query thresholds.
