---
name: navigation
classification: css
status: active
domain: frontend
summary: Semantic sidebar navigation, nav-link presets (rounded pills, left-border, growing-bar), and section headings.
source: theme/config/mixins/_nav.scss
tags: [navigation, nav, sidebar, links, presets, active-state]
---

# 🧭 navigation

---

## 1. Core Behavior & Responsibility

The `navigation` module (`theme/config/mixins/_nav.scss` and `theme/components/_nav.scss`) coordinates sidebar and header navigation:

- **Semantic HTML Hierarchy:** Navigation lists use `<nav>`, `<ul>`, `<li>`, and `<a>` with `<h6>` group section headers and `<hr>` separators.
- **Link Visual Presets:**
  - `nav-links-rounded` (Default): Floating pill-shaped navigation links with margins.
  - `nav-links-border-left`: Full-width links with an inset left indicator border.
  - `nav-links-border-grow`: Full-width links with an animated pseudo-element growing indicator bar.
  - `nav-links-border-top`: Top indicator bar for horizontal navbars.
- **Active State:** Automatically highlighted via `data-ln-nav` or matching `aria-current="page"` / `.active`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Sidebar Navigation)

```html
<nav class="nav" data-ln-nav="active">
    <h6 class="nav-section">Main Menu</h6>
    <ul>
        <li>
            <a href="/dashboard" aria-current="page">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-home"></use></svg>
                <span class="nav-label">Dashboard</span>
            </a>
        </li>
        <li>
            <a href="/documents">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-file-text"></use></svg>
                <span class="nav-label">Documents</span>
            </a>
        </li>
    </ul>
    <hr class="nav-divider">
</nav>
```

### Variant 1: Border-Left Indicator Preset

```scss
.sidebar-nav {
    @include nav;
    @include nav-links-border-left;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `nav` | mixin | — | Base navigation container and list structure |
| `nav-links-rounded` | mixin | — | Default floating rounded pill links |
| `nav-links-border-left` | mixin | — | Full-width flush links with left indicator line |
| `nav-links-border-grow` | mixin | — | Full-width links with spring-animated growing indicator |
| `nav-links-border-top` | mixin | — | Horizontal navbar links with top indicator line |
| `.nav` | class | — | Prototyping class for `nav` |
| `.nav-section` | class | — | Section heading styling for `<h6>` |
| `.nav-label` | class | — | Truncated link label container |
| `.nav-divider` | class | — | Semantic divider `<hr>` in navigation |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Semantic Section Elements:** Use `<h6>` for group headers (`.nav-section`) and `<hr>` for dividers (`.nav-divider`), never generic `<div>` elements.
> 2. **Current Page Semantics:** Ensure the active link carries `aria-current="page"` to inform screen readers of the user's current location.
> 3. **Icon Accessibility:** SVG icons inside navigation links should always carry `aria-hidden="true"`, with the link purpose conveyed by `.nav-label` text.

---

## 5. Related Documents

- [`app-shell`](./app-shell.md) — Application shell layout and sidebar drawer.
- [`ln-nav`](../components/ln-nav.md) — JavaScript active link routing and state management.
- [`tokens`](./tokens.md) — Spacing tokens and interaction wash percentages.
