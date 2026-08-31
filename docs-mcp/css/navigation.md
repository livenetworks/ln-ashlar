---
name: navigation
classification: css
status: draft
domain: frontend
summary: Navigation structure styling, active item indicators, link presets (rounded, left-border, top-border), and sidebar integration.
source: theme/components/_nav.scss
tags: [navigation, nav, sidebar, links, aria-current]
---

# 🧭 navigation

---

## 1. Core Behavior & Responsibility

The `navigation` module (`theme/components/_nav.scss` and `theme/config/mixins/_nav.scss`) styles semantic navigation lists:
- **Binding:** Automatically bound to `nav[data-ln-nav]` in the theme layer (also connecting the `ln-nav` active link highlighter).
- **Structure:** Resets list styles, applies flex alignment for icons, labels, and badges.
- **Active State (`aria-current="page"`):** Highlights active items using primary accent background and text colors.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<nav data-ln-nav>
    <ul>
        <li>
            <a href="/dashboard" aria-current="page">
                <svg class="ln-icon nav-icon" aria-hidden="true"><use href="#ln-icon-dashboard"></use></svg>
                <span class="nav-label">Dashboard</span>
            </a>
        </li>
        <li>
            <a href="/tenants">
                <svg class="ln-icon nav-icon" aria-hidden="true"><use href="#ln-icon-building"></use></svg>
                <span class="nav-label">Tenants</span>
                <span class="ln-chip">12</span>
            </a>
        </li>
    </ul>
</nav>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `nav` | mixin | — | Base reset and layout for navigation lists |
| `nav-links-rounded` | mixin | — | Pill-shaped active state with rounded corners (default) |
| `nav-links-border-left` | mixin | — | Vertical sidebar active state with solid 3px left border bar |
| `nav-links-border-top` | mixin | — | Horizontal navbar active state with solid top indicator |
| `nav-links-border-grow` | mixin | — | Border growth transition on hover and active states |
| `nav[data-ln-nav]` | class | — | Default component selector applying @include nav |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Use `aria-current="page"`:** Never rely solely on CSS classes like `.active` to indicate current pages. Always provide `aria-current="page"` on active links for screen readers.
> 2. **Navigation Attribute:** Use `nav[data-ln-nav]` to connect both visual nav styling and the JS active state highlighter.

---

## 5. Related Documents

- [`app-shell`](./app-shell.md) — Sidebar and header integration.
- [`breadcrumbs`](./breadcrumbs.md) — Breadcrumb navigation.
