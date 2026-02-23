# SCSS Reference — ln-acme

Complete reference for all `@include` mixins, design tokens, and the icon system.

**Source files:** `scss/config/_mixins.scss`, `scss/config/_tokens.scss`, `scss/config/_icons.scss`

## How to Use

Every SCSS file starts with:
```scss
@use '../config/mixins' as *;
```

Then use `@include` instead of hardcoded CSS. Classes exist for prototyping, but project SCSS should use `@include` on semantic selectors:
```scss
// Project SCSS — semantic selectors + @include
#korisnik { @include card; }
.demo-links { @include grid-2; }
```

---

## Quick-Reference Lookup

> **"Instead of X, use Y"** — scan this table before writing any CSS.

### Spacing

| Instead of writing... | Use |
|---|---|
| `padding: 1rem` | `@include p(1rem)` |
| `padding-left: X; padding-right: X` | `@include px(X)` |
| `padding-top: X; padding-bottom: X` | `@include py(X)` |
| `padding-top: X` | `@include pt(X)` |
| `padding-bottom: X` | `@include pb(X)` |
| `padding-left: X` | `@include pl(X)` |
| `padding-right: X` | `@include pr(X)` |
| `margin: X` | `@include m(X)` |
| `margin-left: X; margin-right: X` | `@include mx(X)` |
| `margin-top: X; margin-bottom: X` | `@include my(X)` |
| `margin-top: X` | `@include mt(X)` |
| `margin-bottom: X` | `@include mb(X)` |
| `margin-left: X` | `@include ml(X)` |
| `margin-right: X` | `@include mr(X)` |
| `gap: X` | `@include gap(X)` |

### Display & Layout

| Instead of writing... | Use |
|---|---|
| `display: flex` | `@include flex` |
| `display: inline-flex` | `@include inline-flex` |
| `display: block` | `@include block` |
| `display: inline-block` | `@include inline-block` |
| `display: none` | `@include hidden` |
| `display: flex; flex-direction: column` | `@include flex-col` |
| `display: flex; flex-direction: row` | `@include flex-row` |
| `flex-wrap: wrap` | `@include flex-wrap` |
| `flex: 1` | `@include flex-1` |
| `flex-shrink: 0` | `@include flex-shrink-0` |
| `align-items: center` | `@include items-center` |
| `align-items: flex-start` | `@include items-start` |
| `align-items: flex-end` | `@include items-end` |
| `justify-content: center` | `@include justify-center` |
| `justify-content: space-between` | `@include justify-between` |
| `justify-content: flex-end` | `@include justify-end` |
| `display: flex; align-items: center; justify-content: center` | `@include flex-center` |

### Sizing

| Instead of writing... | Use |
|---|---|
| `width: 100%` | `@include w-full` |
| `height: 100%` | `@include h-full` |
| `min-height: 100vh` | `@include min-h-screen` |
| `width: X` | `@include w(X)` |
| `height: X` | `@include h(X)` |
| `width: X; height: X` | `@include size(X)` |

### Typography

| Instead of writing... | Use |
|---|---|
| `font-size: 0.75rem; line-height: 1rem` | `@include text-xs` |
| `font-size: 0.875rem; line-height: 1.25rem` | `@include text-sm` |
| `font-size: 1rem; line-height: 1.5rem` | `@include text-base` |
| `font-size: 1.125rem; line-height: 1.75rem` | `@include text-lg` |
| `font-size: 1.25rem; line-height: 1.75rem` | `@include text-xl` |
| `font-size: 1.5rem; line-height: 2rem` | `@include text-2xl` |
| `font-weight: 400` | `@include font-normal` |
| `font-weight: 500` | `@include font-medium` |
| `font-weight: 600` | `@include font-semibold` |
| `font-weight: 700` | `@include font-bold` |
| `text-align: left` | `@include text-left` |
| `text-align: center` | `@include text-center` |
| `text-align: right` | `@include text-right` |
| `text-transform: uppercase` | `@include uppercase` |
| `text-transform: lowercase` | `@include lowercase` |
| `text-transform: capitalize` | `@include capitalize` |
| `text-transform: none` | `@include normal-case` |
| `letter-spacing: 0.025em` | `@include tracking-wide` |
| `letter-spacing: 0.05em` | `@include tracking-wider` |
| `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` | `@include truncate` |
| `white-space: nowrap` | `@include whitespace-nowrap` |
| `font-family: monospace` | `@include font-mono` |
| `font-family: sans-serif` | `@include font-sans` |

### Colors

| Instead of writing... | Use |
|---|---|
| `color: var(--color-text-primary)` / `color: #111827` | `@include text-primary` |
| `color: var(--color-text-secondary)` / `color: #6b7280` | `@include text-secondary` |
| `color: var(--color-text-muted)` / `color: #9ca3af` | `@include text-muted` |
| `color: #ffffff` / `color: white` | `@include text-white` |
| `color: var(--color-error)` / `color: #dc2626` | `@include text-error` |
| `color: var(--color-success)` / `color: #16a34a` | `@include text-success` |
| `color: var(--color-warning)` / `color: #d97706` | `@include text-warning` |
| `background-color: var(--color-bg-primary)` / `background: #ffffff` | `@include bg-primary` |
| `background-color: var(--color-bg-secondary)` / `background: #f3f4f6` | `@include bg-secondary` |
| `background-color: var(--color-bg-body)` / `background: #f4f4f5` | `@include bg-body` |

### Borders & Radius

| Instead of writing... | Use |
|---|---|
| `border: 1px solid var(--color-border)` / `border: 1px solid #e5e7eb` | `@include border` |
| `border-top: 1px solid var(--color-border)` | `@include border-t` |
| `border-bottom: 1px solid var(--color-border)` | `@include border-b` |
| `border-left: 1px solid var(--color-border)` | `@include border-l` |
| `border-right: 1px solid var(--color-border)` | `@include border-r` |
| `border: none` | `@include border-none` |
| `border-radius: 0.25rem` (4px) | `@include rounded-sm` |
| `border-radius: 0.5rem` (8px) | `@include rounded-md` |
| `border-radius: 0.75rem` (12px) | `@include rounded-lg` |
| `border-radius: 1rem` (16px) | `@include rounded-xl` |
| `border-radius: 9999px` | `@include rounded-full` |

### Shadows

| Instead of writing... | Use |
|---|---|
| `box-shadow: none` | `@include shadow-none` |
| `box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)` | `@include shadow-sm` |
| `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)` | `@include shadow-md` |
| `box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)` | `@include shadow-lg` |
| `box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)` | `@include shadow-xl` |

### Transitions

| Instead of writing... | Use |
|---|---|
| `transition: all 0.3s ease` | `@include transition` |
| `transition: all 0.15s ease` | `@include transition-fast` |
| `transition: color, background-color, border-color 0.3s` | `@include transition-colors` |

### Position

| Instead of writing... | Use |
|---|---|
| `position: relative` | `@include relative` |
| `position: absolute` | `@include absolute` |
| `position: fixed` | `@include fixed` |
| `position: sticky` | `@include sticky` |
| `top: 0; right: 0; bottom: 0; left: 0` | `@include inset-0` |

### Overflow

| Instead of writing... | Use |
|---|---|
| `overflow: hidden` | `@include overflow-hidden` |
| `overflow: auto` | `@include overflow-auto` |
| `overflow-x: auto; -webkit-overflow-scrolling: touch` | `@include overflow-x-auto` |

### Cursor & Interaction

| Instead of writing... | Use |
|---|---|
| `cursor: pointer` | `@include cursor-pointer` |
| `cursor: not-allowed` | `@include cursor-not-allowed` |
| `user-select: none` | `@include select-none` |
| `opacity: 0.5` | `@include opacity-50` |

### Z-Index

| Instead of writing... | Use |
|---|---|
| `z-index: 10` (dropdowns) | `@include z-dropdown` |
| `z-index: 20` (sticky elements) | `@include z-sticky` |
| `z-index: 30` (overlays) | `@include z-overlay` |
| `z-index: 40` (modals) | `@include z-modal` |
| `z-index: 50` (toasts) | `@include z-toast` |
| `z-index: N` (custom) | `@include z(N)` |

### Components

| Instead of building from scratch... | Use |
|---|---|
| Responsive 1→2→3 column grid | `@include grid` |
| Responsive 1→2 column grid | `@include grid-2` |
| Responsive 1→2→4 column grid | `@include grid-4` |
| 6-column form layout | `@include form-grid` |
| Vertical flex with gap | `@include stack` or `@include stack(0.5rem)` |
| Card container (bg + border + shadow + rounded) | `@include card` |
| Panel header bar (flex + bg-secondary + border-b) | `@include panel-header` |
| Primary button with states | `@include btn` |
| Close/dismiss button | `@include close-button` |
| Expand/collapse parent | `@include collapsible` |
| Expand/collapse child | `@include collapsible-content` |

---

## Component Mixins — Detailed

### `@include grid` / `@include grid-2` / `@include grid-4`

Responsive grid layouts with `gap: 1.5rem`.

| Mixin | Mobile (<768px) | Tablet (768px+) | Desktop (1024px+) |
|-------|-----------------|-----------------|-------------------|
| `grid` | 1 column | 2 columns | 3 columns |
| `grid-2` | 1 column | 2 columns | — |
| `grid-4` | 1 column | 2 columns | 4 columns |

```scss
// Usage on semantic selector
#stats ul {
    @include grid-4;
    list-style: none;
    padding: 0;
    margin: 0;
}
```

### `@include form-grid`

6-column grid for forms. Collapses to 1 column on mobile (<768px). Use `grid-column: span N` on children.

```scss
#my-form {
    @include form-grid;

    .form-group:nth-child(1),
    .form-group:nth-child(2) { grid-column: span 3; } // Half width each
    .form-group:nth-child(3) { grid-column: span 6; } // Full width
    .form-actions { grid-column: span 6; }
}
```

### `@include stack($gap: 1rem)`

Vertical flex layout with configurable gap (default 1rem).

```scss
.my-section main { @include stack(1.5rem); }   // 1.5rem gap
.my-sidebar       { @include stack(0.5rem); }   // tight gap
.my-content       { @include stack; }            // default 1rem gap
```

**Expands to:** `display: flex; flex-direction: column; gap: $gap;`

### `@include card`

Data container component — the standard "card" appearance.

**Expands to:**
```css
background-color: var(--color-bg-primary);     /* white */
border: 1px solid var(--color-border);
width: 100%;
display: flex;
flex-direction: column;
box-shadow: var(--shadow-sm);
border-radius: var(--radius-md);               /* 0.5rem */
overflow: hidden;
transition: all var(--transition-base);        /* 0.3s ease */
```

**Typical hover pattern:**
```scss
article {
    @include card;
    &:hover { border-color: var(--color-primary); @include shadow-md; }
}
```

### `@include panel-header`

Unified header bar used by `.card header`, `.section-card header`, and `.ln-modal header`.

**Expands to:**
```css
display: flex;
align-items: center;
justify-content: space-between;
padding-left: 1rem;
padding-right: 1rem;
padding-top: 0.625rem;
padding-bottom: 0.625rem;
background-color: var(--color-bg-secondary);   /* #f3f4f6 */
border-bottom: 1px solid var(--color-border);

/* Nested h3 styling included: */
h3 {
    font-size: var(--text-base);               /* 1rem */
    font-weight: var(--font-semibold);         /* 600 */
    color: var(--color-text-primary);
    margin: 0;
}
```

```scss
.my-section header { @include panel-header; }
```

### `@include btn`

Primary button with hover, focus, and disabled states.

**Expands to:**
```css
display: flex;
align-items: center;
justify-content: center;
padding: 0.5rem 1rem;
font-size: var(--text-sm);                    /* 0.875rem */
font-weight: var(--font-medium);              /* 500 */
border-radius: var(--radius-md);              /* 0.5rem */
cursor: pointer;
transition: all var(--transition-base);
border: none;
outline: none;
background-color: var(--color-primary);       /* #2737a1 */
color: #ffffff;
white-space: nowrap;
```

**States:**
- `:hover` → `background-color: var(--color-primary-hover)` (#1e2b82)
- `:focus` → `box-shadow: 0 0 0 3px var(--color-primary-light)` (#e6eafa)
- `:disabled` → `opacity: 0.5; cursor: not-allowed`

**Variants** (defined in `_forms.scss`):
- `.btn--secondary` — light background, primary text
- `.btn--danger` — red background

### `@include close-button`

Standard dismiss button. Always pair with `class="ln-icon-close"` in HTML.

**Expands to:**
```css
background: transparent;
border: none;
font-size: var(--text-lg);
color: var(--color-text-muted);               /* #9ca3af */
cursor: pointer;
width: 2rem;
height: 2rem;
display: flex;
align-items: center;
justify-content: center;
border-radius: var(--radius-sm);              /* 0.25rem */
transition: all var(--transition-fast);       /* 0.15s ease */
```

**States:**
- `:hover` → `color: var(--color-error)` (#dc2626)
- `:active` → `color: var(--color-error-hover)` (#b91c1c), `background: var(--color-bg-body)`
- `:focus-visible` → `outline: 2px solid var(--color-primary)`

```html
<button class="ln-icon-close" data-ln-modal-close></button>
```
```scss
.ln-modal header button[data-ln-modal-close] { @include close-button; }
```

### `@include collapsible` + `@include collapsible-content`

Grid-based expand/collapse animation. **NEVER use `max-height` hack.**

- `collapsible` → parent container (grid with 0fr→1fr transition)
- `collapsible-content` → direct child (overflow: hidden)

**Expands to:**
```css
/* @include collapsible */
display: grid;
grid-template-rows: 0fr;
transition: grid-template-rows var(--transition-base);  /* 0.3s ease */

/* When .open class is added: */
&.open { grid-template-rows: 1fr; }

/* @include collapsible-content */
overflow: hidden;
```

**Full pattern:**
```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Title</header>
        <main id="panel1" data-ln-toggle class="collapsible">
            <section class="collapsible-body">
                <p>Content with padding goes here.</p>
            </section>
        </main>
    </li>
</ul>
```

**Rules:**
- `.collapsible` parent = no padding (it collapses to 0)
- `.collapsible-body` child = put all padding/margins here
- Child must be semantic element (`<section>`, `<article>`) with a class, NOT bare `<div>`
- `data-ln-toggle` = JS behavior, `class="collapsible"` = CSS animation

---

## Icon System

All icons use CSS pseudo-elements (`::before`) with inline SVG data-URIs. Defined in `scss/config/_icons.scss`.

### Usage

```html
<span class="ln-icon-home"></span>
<button class="ln-icon-close" data-ln-modal-close></button>
<span class="ln-icon-check-circle--green ln-icon--lg"></span>
```

**NEVER** use HTML entities (`&times;`, `&#9660;`), Unicode, or emoji for icons. **ALWAYS** use `ln-icon-*` classes.

### Size Variants

| Class | Size |
|-------|------|
| *(default)* | 1.25rem (20px) |
| `ln-icon--sm` | 1rem (16px) |
| `ln-icon--lg` | 1.5rem (24px) |
| `ln-icon--xl` | 4rem (64px) |

### Available Icons

**Navigation:**
`ln-icon-home`, `ln-icon-users`, `ln-icon-books`, `ln-icon-lodges`, `ln-icon-logout`, `ln-icon-settings`

**Actions:**
`ln-icon-close`, `ln-icon-menu`, `ln-icon-delete`, `ln-icon-view`, `ln-icon-edit`, `ln-icon-save`

**Transfer:**
`ln-icon-download`, `ln-icon-upload`, `ln-icon-copy`, `ln-icon-link`

**Indicators:**
`ln-icon-check`, `ln-icon-plus`, `ln-icon-arrow-up`, `ln-icon-arrow-down`

**Date & Filter:**
`ln-icon-calendar`, `ln-icon-filter`

**Utility:**
`ln-icon-chart`, `ln-icon-clock`, `ln-icon-envelope`, `ln-icon-book`, `ln-icon-refresh`, `ln-icon-print`, `ln-icon-lock`, `ln-icon-star`

**Status:**
`ln-icon-check-circle`, `ln-icon-error-circle`, `ln-icon-info-circle`, `ln-icon-warning`

### Color Variants

| Default (gray) | White variant | Colored variant |
|---|---|---|
| `ln-icon-check` | `ln-icon-check--white` | — |
| `ln-icon-plus` | `ln-icon-plus--white` | — |
| `ln-icon-arrow-up` | `ln-icon-arrow-up--white` | — |
| `ln-icon-arrow-down` | `ln-icon-arrow-down--white` | — |
| `ln-icon-book` | `ln-icon-book--white` | — |
| `ln-icon-delete` | — | `ln-icon-delete--red` |
| `ln-icon-check-circle` | — | `ln-icon-check-circle--green` |
| `ln-icon-error-circle` | — | `ln-icon-error-circle--red` |
| `ln-icon-info-circle` | — | `ln-icon-info-circle--blue` |
| `ln-icon-warning` | — | `ln-icon-warning--yellow` |

### Legacy Icons (without `ln-` prefix)

`icon-user`, `icon-mail`, `icon-phone`, `icon-badge`

---

## Design Tokens

All values from `scss/config/_tokens.scss`. Mixins reference these — never hardcode values.

### Colors

```
Primary:     --color-primary: #2737a1
             --color-primary-hover: #1e2b82
             --color-primary-focus: #3246c8
             --color-primary-light: #e6eafa
             --color-primary-lighter: #f5f6fc

Secondary:   --color-secondary: #10b981
             --color-secondary-hover: #059669

Status:      --color-success: #16a34a
             --color-error: #dc2626
             --color-error-hover: #b91c1c
             --color-warning: #d97706
             --color-info: #3b82f6

Text:        --color-text-primary: #111827
             --color-text-secondary: #6b7280
             --color-text-muted: #9ca3af

Backgrounds: --color-bg-primary: #ffffff      (cards, panels)
             --color-bg-secondary: #f3f4f6    (headers, footers)
             --color-bg-body: #f4f4f5         (page background)
             --color-bg-error: #fef2f2

Borders:     --color-border: #e5e7eb
             --color-border-light: #e5e7eb

Table:       --color-table-header-bg: #1a1a2e
             --color-table-header-text: #ffffff
             --color-table-section-bg: #e8ecf1
```

### Spacing

| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-xs` | 0.25rem | 4px |
| `--spacing-sm` | 0.5rem | 8px |
| `--spacing-md` | 1rem | 16px |
| `--spacing-lg` | 1.5rem | 24px |
| `--spacing-xl` | 2rem | 32px |
| `--spacing-2xl` | 3rem | 48px |

### Typography

| Token | Value | Pixels |
|-------|-------|--------|
| `--text-xs` | 0.75rem | 12px |
| `--text-sm` | 0.875rem | 14px |
| `--text-base` | 1rem | 16px |
| `--text-lg` | 1.125rem | 18px |
| `--text-xl` | 1.25rem | 20px |
| `--text-2xl` | 1.5rem | 24px |

| Token | Value |
|-------|-------|
| `--font-normal` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |
| `--font-sans` | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif |
| `--font-mono` | ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace |

### Border Radius

| Token | Value | Pixels |
|-------|-------|--------|
| `--radius-sm` | 0.25rem | 4px |
| `--radius-md` | 0.5rem | 8px |
| `--radius-lg` | 0.75rem | 12px |
| `--radius-xl` | 1rem | 16px |
| `--radius-full` | 9999px | circle |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-none` | none |
| `--shadow-sm` | 0 1px 2px 0 rgba(0,0,0,0.05) |
| `--shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) |
| `--shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1) |
| `--shadow-primary` | 0 0 20px rgba(39,55,161,0.2) |

### Transitions

| Token | Value |
|-------|-------|
| `--transition-base` | 0.3s ease |
| `--transition-fast` | 0.15s ease |

### Z-Index Scale

```
toast (50) > modal (40) > overlay (30) > sticky (20) > dropdown (10)
```

| Token | Value |
|-------|-------|
| `--z-dropdown` | 10 |
| `--z-sticky` | 20 |
| `--z-overlay` | 30 |
| `--z-modal` | 40 |
| `--z-toast` | 50 |

---

## Anti-Patterns

### Hardcoded values → Use tokens

```scss
// WRONG
color: #2737a1;
padding: 1rem 1.5rem;
font-weight: 600;
border: 1px solid #e5e7eb;
border-radius: 0.5rem;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
z-index: 40;

// CORRECT
@include text-primary;          // or color: var(--color-primary)
@include px(1.5rem); @include py(1rem);
@include font-semibold;
@include border;
@include rounded-md;
@include shadow-sm;
@include z-modal;
```

### HTML entity icons → Use `.ln-icon-*`

```html
<!-- WRONG -->
<button>&times;</button>
<span>&#9660;</span>

<!-- CORRECT -->
<button class="ln-icon-close"></button>
<span class="ln-icon-arrow-down"></span>
```

### `max-height` collapse → Use `@include collapsible`

```scss
// WRONG
.panel { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
.panel.open { max-height: 500px; }

// CORRECT
.panel { @include collapsible; }
.panel > .inner { @include collapsible-content; }
```

### Manual panel header → Use `@include panel-header`

```scss
// WRONG — writing your own header layout
.my-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1rem;
    background: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
}

// CORRECT
.my-card header { @include panel-header; }
```

### Manual close button → Use `@include close-button`

```scss
// WRONG
.dismiss-btn {
    background: transparent;
    border: none;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
}

// CORRECT
.dismiss-btn { @include close-button; }
```

### Presentational classes in HTML → Use `@include` in SCSS

```html
<!-- WRONG -->
<div class="grid-4">
    <div class="card">
        <small class="text-secondary">Label</small>
        <h2 style="margin:0;">42</h2>
    </div>
</div>

<!-- CORRECT -->
<section id="stats">
    <ul>
        <li>
            <h3>Label</h3>
            <strong>42</strong>
        </li>
    </ul>
</section>
```
```scss
#stats {
    ul { @include grid-4; list-style: none; padding: 0; margin: 0; }
    li { @include card; @include p(1rem); }
    h3 { @include text-sm; @include text-secondary; @include font-normal; margin: 0; }
    strong { @include text-2xl; @include font-bold; @include block; }
}
```

---

## Real-World Examples

### Stats Dashboard

```html
<section id="stats">
    <ul>
        <li><h3>Employees</h3><strong>42</strong></li>
        <li><h3>Projects</h3><strong>12</strong></li>
        <li><h3>Revenue</h3><strong>$1.2M</strong></li>
        <li><h3>Tasks</h3><strong>89</strong></li>
    </ul>
</section>
```
```scss
#stats {
    ul { @include grid-4; list-style: none; padding: 0; margin: 0; }
    li { @include card; @include p(1rem); }
    h3 { @include text-sm; @include text-secondary; @include font-normal; margin: 0; }
    strong { @include text-2xl; @include font-bold; @include block; }
}
```

### Modal

```html
<section data-ln-modal="edit-user" class="ln-modal">
    <article>
        <header>
            <h3>Edit User</h3>
            <button class="ln-icon-close" data-ln-modal-close></button>
        </header>
        <main>...</main>
        <footer>
            <button class="btn btn--secondary" data-ln-modal-close>Cancel</button>
            <button class="btn">Save</button>
        </footer>
    </article>
</section>
```
```scss
.ln-modal header { @include panel-header; }
.ln-modal header button[data-ln-modal-close] { @include close-button; }
.ln-modal main { @include p(var(--spacing-lg)); }
.ln-modal footer {
    @include border-t;
    @include bg-secondary;
    @include flex;
    @include justify-end;
    @include gap(0.5rem);
    @include p(var(--spacing-md));
}
```

### Collapsible Accordion

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="faq1">What is ln-acme?</header>
        <main id="faq1" data-ln-toggle class="collapsible">
            <section class="collapsible-body">
                <p>A unified frontend library for LiveNetworks projects.</p>
            </section>
        </main>
    </li>
</ul>
```
```scss
// Collapsible classes are already defined in _toggle.scss
// For custom semantic selectors:
.my-accordion > li > main { @include collapsible; }
.my-accordion > li > main > section { @include collapsible-content; }
```

### Form Layout

```html
<form id="user-form">
    <div class="form-group"><label>First Name</label><input></div>
    <div class="form-group"><label>Last Name</label><input></div>
    <div class="form-group"><label>Email</label><input type="email"></div>
    <div class="form-actions">
        <button class="btn" type="submit">Save</button>
    </div>
</form>
```
```scss
#user-form {
    @include form-grid;
    .form-group:nth-child(1),
    .form-group:nth-child(2) { grid-column: span 3; }
    .form-group:nth-child(3) { grid-column: span 6; }
    .form-actions { grid-column: span 6; }
}
```

---

## File Map

| File | Contents |
|------|----------|
| `scss/config/_tokens.scss` | All CSS custom properties (`:root`) |
| `scss/config/_mixins.scss` | All `@include` mixins (91 total) |
| `scss/config/_icons.scss` | SVG icon system |
| `scss/config/_theme.scss` | Color palette extensions |
| `scss/components/` | Component SCSS (card, forms, tables, etc.) |
| `scss/base/` | Reset, global defaults, typography |
| `scss/layout/` | App layout, grid, header |
