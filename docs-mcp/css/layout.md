---
name: layout
classification: css
status: active
domain: frontend
summary: Grid systems, flexbox stack and row primitives, flat-stack joined panels, and container query contexts.
source: theme/config/mixins/_layout.scss
tags: [layout, grid, flexbox, stack, row, container-queries, flat-stack]
---

# 📐 layout

---

## 1. Core Behavior & Responsibility

The `layout` mixin module (`theme/config/mixins/_layout.scss`) provides foundational layout primitives for both macro and micro component structure:

- **Flexbox Primitives:** `stack` (vertical column with gap) and `row` / `row-between` / `row-center` (horizontal rows).
- **Responsive Grids:** `grid`, `grid-2`, and `grid-4` generating responsive CSS Grid column structures with standard gaps.
- **Flat Stack (`flat-stack`):** Joins vertical sibling cards/panels into a seamless flush list with a shared horizontal divider rule, flattening inner radii and elevation shadows.
- **Container Query Contexts (`container`):** Declares `container-type: inline-size` on parents so child components adapt responsive styling to their immediate available width.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Semantic Grid List)

```html
<section id="metrics-overview">
    <ul>
        <li><div class="stat-card"><strong>$48.2k</strong><span>Revenue</span></div></li>
        <li><div class="stat-card"><strong>1,240</strong><span>Users</span></div></li>
        <li><div class="stat-card"><strong>99.8%</strong><span>Uptime</span></div></li>
        <li><div class="stat-card"><strong>4.9★</strong><span>Rating</span></div></li>
    </ul>
</section>
```

```scss
#metrics-overview > ul {
    @include grid-4;
    list-style: none;
    padding: 0;
    margin: 0;

    li > .stat-card {
        @include stat-card;
    }
}
```

### Variant 1: Flat Stack Joined Panels

```html
<ul class="notification-feed">
    <li><article class="card"><p>First notification</p></article></li>
    <li><article class="card"><p>Second notification</p></article></li>
</ul>
```

```scss
.notification-feed {
    @include flat-stack;
    list-style: none;
    padding: 0;
    margin: 0;

    > li > .card {
        @include card;
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `stack` | mixin | `$gap: var(--gap)` | Vertical flex container with configurable gap |
| `row` | mixin | `$gap: var(--gap)` | Horizontal flex container with centered vertical alignment |
| `row-between` | mixin | `$gap: var(--gap)` | Horizontal flex row with `justify-content: space-between` |
| `row-center` | mixin | `$gap: var(--gap)` | Horizontal flex row centered on both axes |
| `grid` | mixin | — | Responsive 1→2→3 column CSS Grid |
| `grid-2` | mixin | — | Responsive 1→2 column CSS Grid |
| `grid-4` | mixin | — | Responsive 1→2→4 column CSS Grid |
| `flat-stack` | mixin | — | Parent-scope rebind joining card children flush with shared divider rule |
| `container` | mixin | `$name: null` | Declares container query context (`container-type: inline-size`) |
| `.grid`, `.grid-2`, `.grid-4` | class | — | Prototyping classes for grid layouts |
| `.stack`, `.row` | class | — | Prototyping classes for flex layouts |
| `.flat-stack` | class | — | Prototyping class for joined flush list |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Put Presentational Grid Classes in Markup:** Avoid `<div class="grid-4">` in production code. Apply `@include grid-4` in SCSS to semantic HTML lists (`<ul>`, `<ol>`) or semantic containers.
> 2. **Parent vs. Child Container Rule:** Always declare `@include container` on the parent wrapper element, and query it using native `@container` inside the child selector. Never declare container context on the element being queried.
> 3. **Block Axis Only for Flat-Stack:** `flat-stack` is designed strictly for block-axis lists. For horizontal button joining, use `btn-group` or `pill-group`.

---

## 5. Related Documents

- [`breakpoints`](./breakpoints.md) — Viewport media queries and container query threshold tokens.
- [`cards`](./cards.md) — Card components and joined panel styling.
- [`mixins`](./mixins.md) — General SCSS mixin index.
- [`scss-architecture`](../doctrine/scss-architecture.md) — Responsive layout and SCSS doctrine.
