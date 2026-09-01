---
name: breakpoints
classification: css
status: active
domain: frontend
summary: Viewport media query and container query breakpoint scales, mixin helpers (mq-up/mq-down/cq-up/cq-down), and tokens.
source: theme/config/_breakpoints.scss
tags: [breakpoints, media-queries, container-queries, responsive, layout]
---

# 📱 breakpoints

---

## 1. Core Behavior & Responsibility

The `breakpoints` system (`theme/config/_breakpoints.scss`) defines two distinct and independent responsive scales:

1. **App-Shell Media Breakpoints (`@media`):** Governs macro viewport layout (app-shell, header, desktop vs mobile sidebar drawer).
2. **Container Query Breakpoints (`@container`):** Governs component-level responsive styling based on the width of the parent container rather than the screen viewport.

All breakpoint values are exposed via Sass variables, CSS custom properties at `:root`, and dedicated mixins (`mq-up`, `mq-down`, `cq-up`, `cq-down`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Container-Queried Component)

```html
<section id="folders-view">
    <ul class="folders-grid">
        <li>Folder A</li>
        <li>Folder B</li>
    </ul>
</section>
```

```scss
// SCSS Usage:
#folders-view {
    @include container(folders);
}

.folders-grid {
    display: grid;
    grid-template-columns: 1fr;

    @include cq-up(compact, folders) {
        grid-template-columns: repeat(2, 1fr);
    }
    @include cq-up(medium, folders) {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### Variant 1: App Shell Media Query

```scss
.app-sidebar {
    @include mq-down(md) {
        position: fixed;
        transform: translateX(-100%);
    }
    @include mq-up(md) {
        position: static;
        transform: none;
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `mq-up` | mixin | `$bp: sm\|md\|lg\|xl\|2xl\|3xl` | Media query `(min-width: ...)` block |
| `mq-down` | mixin | `$bp: sm\|md\|lg\|xl\|2xl\|3xl` | Media query `(max-width: ... - 1px)` block |
| `cq-up` | mixin | `$cq: narrow\|compact\|medium\|wide, $name: null` | Container query `(min-width: ...)` block |
| `cq-down` | mixin | `$cq: narrow\|compact\|medium\|wide, $name: null` | Container query `(max-width: ... - 1px)` block |
| `--bp-sm` | token | `480px` | Small mobile-to-phablet viewport threshold |
| `--bp-md` | token | `768px` | Tablet / mobile-drawer viewport threshold |
| `--bp-lg` | token | `1024px` | Desktop viewport threshold |
| `--bp-xl` | token | `1280px` | Large desktop viewport threshold |
| `--bp-2xl` | token | `1536px` | Wide desktop viewport threshold |
| `--bp-3xl` | token | `1920px` | Ultra-wide viewport threshold |
| `--cq-narrow` | token | `480px` | Tight component container threshold |
| `--cq-compact` | token | `580px` | Standard 2-column component container threshold |
| `--cq-medium` | token | `880px` | Standard 3-column component container threshold |
| `--cq-wide` | token | `1120px` | Wide 4-column component container threshold |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Never Use `@media` for Portable Components:** Components should never rely on viewport media queries because their rendering width depends on the parent column or drawer layout. Always use `@container`. Media queries are reserved strictly for the app shell.
> 2. **Avoid `overflow: hidden` on Container Elements:** Do not combine `container-type: inline-size` with `overflow: hidden` or non-standard positioning on the same element, as it can cause clipping and unexpected layout containment issues.
> 3. **Never Hardcode Breakpoint Pixels:** Always reference breakpoint tokens (`$bp-md`, `$cq-medium`, or mixins `mq-up`/`cq-up`) so breakpoint definitions remain unified across CSS and JavaScript.

---

## 5. Related Documents

- [`layout`](./layout.md) — Grid systems, stack/row flexbox, and container registration.
- [`app-shell`](./app-shell.md) — Application shell layout and responsive sidebar drawer.
- [`page-header`](./page-header.md) — Container query page header grid.
- [`scss-architecture`](../doctrine/scss-architecture.md) — Governing responsive architecture strategy.
