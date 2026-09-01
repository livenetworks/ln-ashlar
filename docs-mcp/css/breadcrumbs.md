---
name: breadcrumbs
classification: css
status: active
domain: frontend
summary: Semantic CSS-only breadcrumb navigation trail with automatic separator generation and current-page highlights.
source: theme/config/mixins/_breadcrumbs.scss
tags: [breadcrumbs, navigation, trail, a11y, semantic-nav]
---

# 🧭 breadcrumbs

---

## 1. Core Behavior & Responsibility

The `breadcrumbs` module (`theme/config/mixins/_breadcrumbs.scss` and `theme/components/_breadcrumbs.scss`) formats navigational hierarchy trails:

- **CSS-Only:** Fully static styling with zero JavaScript runtime requirement.
- **Semantic Structure:** Wrapped in `<nav aria-label="Breadcrumb">` enclosing an ordered `<ol>` list of trail links.
- **Auto-Generated Separators:** Pseudo-elements (`li + li::before`) insert separators automatically without polluting HTML markup.
- **Page-Header Auto-Styling:** Any `<nav>` inside a `.page-header` receives breadcrumb styling automatically without requiring `class="breadcrumbs"`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/settings">Settings</a></li>
        <li aria-current="page">Security</li>
    </ol>
</nav>
```

### Variant 1: Within Page Header

```html
<header class="page-header">
    <nav aria-label="Breadcrumb">
        <ol>
            <li><a href="/">Dashboard</a></li>
            <li aria-current="page">Audit Log</li>
        </ol>
    </nav>
    <div><h1>Audit Log</h1></div>
</header>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `breadcrumbs` | mixin | — | Base breadcrumb trail layout with automatic `::before` separators |
| `.breadcrumbs` | class | — | Prototyping class for `breadcrumbs` |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **ARIA Landmark Labeling:** Always include `aria-label="Breadcrumb"` (singular) on the wrapping `<nav>` container for WAI-ARIA compliance.
> 2. **Current Item Semantics:** The final, active crumb must not be a link and should carry `aria-current="page"`.
> 3. **Never Author Hardcoded Separator Slashes in HTML:** Slashes or chevrons in HTML text are read aloud by screen readers; rely on CSS pseudo-elements for separators.

---

## 5. Related Documents

- [`page-header`](./page-header.md) — Top page header incorporating breadcrumbs.
- [`navigation`](./navigation.md) — Sidebar navigation.
