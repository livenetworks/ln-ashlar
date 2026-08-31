---
name: layout
classification: css
status: draft
domain: frontend
summary: Structural layout mixins providing flexbox rows, stacks, CSS grid presets, and container query wrappers.
source: theme/config/mixins/_layout.scss
tags: [layout, grid, flexbox, stack, row, container]
---

# 📐 layout

---

## 1. Core Behavior & Responsibility

The `layout` mixin module (`theme/config/mixins/_layout.scss`) provides atomic structural helpers for content flow:
- **Rows & Stacks:** `@include stack($gap)` for vertical flex columns, and `@include row($gap)`, `@include row-between($gap)`, `@include row-center($gap)` for horizontal flex alignment.
- **Grid Presets:** Responsive column layouts (`@include grid`, `@include grid-2`, `@include grid-4`) shifting at media breakpoints `$bp-md` (768px) and `$bp-lg` (1024px).
- **Containers:** `@include container($name)` for container query contexts.
- **Flat Stack:** `@include flat-stack` for flush vertical joined-panel borders.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<main>
    <div class="user-grid">
        <article class="card">
            <h3>Card 1</h3>
        </article>
        <article class="card">
            <h3>Card 2</h3>
        </article>
    </div>
</main>
```

```scss
.user-grid {
    @include grid-2;
}
```

### Variant 1: Stack & Row Alignment

```html
<section class="action-panel">
    <div class="header-row">
        <h2>Users</h2>
        <button type="button" class="btn">Add User</button>
    </div>
    <div class="list-stack">
        <article class="card">User A</article>
        <article class="card">User B</article>
    </div>
</section>
```

```scss
.header-row {
    @include row-between;
}
.list-stack {
    @include stack(var(--size-md));
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `grid` | mixin | — | 1-col mobile, 2-col at md (768px), 3-col at lg (1024px) |
| `grid-2` | mixin | — | 1-col mobile, 2-col at md (768px) |
| `grid-4` | mixin | — | 1-col mobile, 2-col at md (768px), 4-col at lg (1024px) |
| `stack` | mixin | `$gap: var(--gap)` | Vertical flex column with gap spacing |
| `row` | mixin | `$gap: var(--gap)` | Horizontal flex row aligned items-center |
| `row-between` | mixin | `$gap: var(--gap)` | Horizontal flex row with justify-content: space-between |
| `row-center` | mixin | `$gap: var(--gap)` | Horizontal flex row with justify-content: center |
| `container` | mixin | `$name: null` | Declares container-type: inline-size with optional container-name |
| `flat-stack` | mixin | — | Joins vertical child panels flush with shared 1px borders |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Combine Container-Type with Overflow-Hidden:** Never set `container-type: inline-size` on an element that also has `overflow: hidden`, as it breaks container-query resolution in multiple browser engines.
> 2. **Avoid Margin Collapse Bugs:** Use `@include stack` and flex `gap` instead of vertical margin stacking.

---

## 5. Related Documents

- [`breakpoints`](./breakpoints.md) — Media and container query breakpoints.
- [`sections`](./sections.md) — Card and section structures.
- [`app-shell`](./app-shell.md) — Application shell layout scaffolding.
