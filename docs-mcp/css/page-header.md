---
name: page-header
classification: css
status: active
domain: frontend
summary: Standard responsive page header combining top breadcrumb nav, title, subtitle, and right-aligned actions using :has() slotting.
source: theme/config/mixins/_page-header.scss
tags: [page-header, header, breadcrumbs, actions, layout, title]
---

# 📑 page-header

---

## 1. Core Behavior & Responsibility

The `page-header` module (`theme/config/mixins/_page-header.scss` and `theme/components/_page-header.scss`) provides the canonical layout for top-of-page headers:

- **CSS-Only Layout:** Fully declarative layout using CSS Grid and `:has()` slot selection without JavaScript.
- **Slot Composition:**
  - `> nav`: Top-row breadcrumbs (auto-styled without extra classes).
  - `> div:has(> h1)`: Title (`display-sm`) and subtitle (`p`).
  - `> div:has(> button, > a)`: Action button group.
- **Responsive Stacking:** Below 880px, stacks breadcrumbs → title → actions vertically; at 880px and above, expands to full-width breadcrumbs above a title-left and actions-right grid row.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<header class="page-header">
    <nav aria-label="Breadcrumb">
        <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Documents</li>
        </ol>
    </nav>
    <div>
        <h1>Quality Manual</h1>
        <p>Version 2.3 — Approved 2026-03-15</p>
    </div>
    <div>
        <button type="button" class="btn btn-ghost">Edit</button>
        <button type="submit" class="btn">Publish</button>
    </div>
</header>
```

### Variant 1: Semantic SCSS Mixin Binding

```scss
#document-view > header {
    @include page-header;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `page-header` | mixin | — | Responsive page header CSS Grid layout with `:has()` slot detection |
| `.page-header` | class | — | Prototyping class for `page-header` |
| `--text-display-sm` | token | `1.875rem` / `1.1` | Page header title size |
| `--margin-block` | token | `var(--size-xl)` | Bottom separation margin |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Breadcrumb `<nav>` Labeling:** Always include `aria-label="Breadcrumb"` on the inner breadcrumb `<nav>` element.
> 2. **Heading Level Invariant:** The page header title should always be an `<h1>` element, representing the primary heading for the page.
> 3. **Action Button Elements:** Ensure all interactive triggers use `<button>` or `<a>` with descriptive text or accessible labels.

---

## 5. Related Documents

- [`breadcrumbs`](./breadcrumbs.md) — Breadcrumb navigation trails.
- [`typography`](./typography.md) — Semantic display and heading roles.
- [`app-shell`](./app-shell.md) — Main content container and page column wrapper.
