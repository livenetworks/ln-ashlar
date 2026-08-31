---
name: breadcrumbs
classification: css
status: draft
domain: frontend
summary: Semantic breadcrumb trails using ordered lists, automatic slash separators, and aria-current="page".
source: theme/config/mixins/_breadcrumbs.scss
tags: [breadcrumbs, navigation, nav, path, hierarchy]
---

# 🍞 breadcrumbs

---

## 1. Core Behavior & Responsibility

The `breadcrumbs` module (`theme/components/_breadcrumbs.scss` and `theme/config/mixins/_breadcrumbs.scss`) styles hierarchical trail navigation:
- **Semantic Structure:** Wrapped in `<nav aria-label="Breadcrumb">` containing an ordered list (`<ol>`).
- **Separators:** Forward slashes (`/`) are automatically generated via CSS `::after` pseudo-elements.
- **Active Current Page:** Marked with `aria-current="page"`, stripping the link pointer and applying bold, high-contrast text.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/admin">Admin</a></li>
        <li><a href="/admin/tenants">Tenants</a></li>
        <li><a href="/admin/tenants/42" aria-current="page">Acme Corp</a></li>
    </ol>
</nav>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `breadcrumbs` | mixin | — | Renders horizontal breadcrumb trail with automated slash separators |
| `nav[aria-label="Breadcrumb"]` | class | — | Default component selector applying @include breadcrumbs |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Hardcode Separators in HTML:** Never author literal `/` or `>` characters in your HTML. CSS `::after` handles separators so screen readers only read meaningful page links.
> 2. **Ordered List:** Always use `<ol>` rather than `<ul>` because breadcrumbs represent a sequential hierarchy.

---

## 5. Related Documents

- [`page-header`](./page-header.md) — Breadcrumbs in page headers.
- [`navigation`](./navigation.md) — Main application navigation.
