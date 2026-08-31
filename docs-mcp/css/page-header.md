---
name: page-header
classification: css
status: draft
domain: frontend
summary: Structured page header container query grid aligning breadcrumbs, title, subtitle, and primary action buttons.
source: theme/config/mixins/_page-header.scss
tags: [page-header, layout, typography, breadcrumbs, actions]
---

# 🏷️ page-header

---

## 1. Core Behavior & Responsibility

The `page-header` component (`theme/components/_page-header.scss` and `theme/config/mixins/_page-header.scss`) formats top-level page headers into a self-contained container query grid (`container-name: page-header`):
- **Stacked Mode (Narrow / Mobile):** Breadcrumbs on top, title/subtitle in the middle, action buttons stacked below.
- **Split Mode (`cq-up(medium)` ≥ 880px):** Title and subtitle aligned left, action buttons aligned right along the baseline, breadcrumbs above.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<header class="page-header">
    <nav aria-label="Breadcrumb">
        <ol>
            <li><a href="/admin">Admin</a></li>
            <li><a href="/admin/packages" aria-current="page">Packages</a></li>
        </ol>
    </nav>
    <div>
        <h1>Subscription Packages</h1>
        <p>Manage pricing tiers and tenant feature access.</p>
    </div>
    <div class="actions">
        <button type="button" class="btn btn-soft">Export CSV</button>
        <button type="button" class="btn" data-ln-modal-for="create-modal">New Package</button>
    </div>
</header>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `page-header` | mixin | — | Applies responsive container-query grid layout to `<header>` |
| `.page-header` | class | — | Default component class applying @include page-header |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Add Margin to `<h1>`:** The page header grid manages vertical rhythm through CSS `gap`. Adding arbitrary bottom margins to `<h1>` disrupts baseline alignment with the action buttons.
> 2. **Breadcrumb `<nav>`:** Always provide `aria-label="Breadcrumb"` on the navigation container to distinguish it from primary application menus.

---

## 5. Related Documents

- [`breadcrumbs`](./breadcrumbs.md) — Breadcrumb navigation.
- [`typography`](./typography.md) — Typography semantic roles.
- [`app-shell`](./app-shell.md) — App shell layout integration.
