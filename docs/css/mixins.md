# SCSS Reference — ln-acme

Complete reference for all `@include` mixins, design tokens, and the icon system.

**Source files:** `scss/config/_mixins.scss`, `scss/config/_tokens.scss`

> For full token values and theming, see [tokens.md](tokens.md).

## How to Use

Every SCSS file starts with:
```scss
@use '../config/mixins' as *;
```

Then use `@include` instead of hardcoded CSS. Classes exist for prototyping, but project SCSS should use `@include` on semantic selectors:
```scss
// Project SCSS — semantic selectors + @include
#user-profile { @include card; }
#stats ul     { @include grid-4; list-style: none; padding: 0; margin: 0; }
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
| `font-size: 0.75rem` | `@include text-xs` |
| `font-size: 0.875rem` | `@include text-sm` |
| `font-size: 1rem` | `@include text-base` |
| `font-size: 1.125rem` | `@include text-lg` |
| `font-size: 1.25rem` | `@include text-xl` |
| `font-size: 1.5rem` | `@include text-2xl` |
| `font-weight: 400` | `@include font-normal` |
| `font-weight: 500` | `@include font-medium` |
| `font-weight: 600` | `@include font-semibold` |
| `font-weight: 700` | `@include font-bold` |
| `text-align: left/center/right` | `@include text-left/center/right` |
| `text-transform: uppercase` | `@include uppercase` |
| `letter-spacing: 0.025em` | `@include tracking-wide` |
| `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` | `@include truncate` |
| `white-space: nowrap` | `@include whitespace-nowrap` |
| `font-family: monospace` | `@include font-mono` |
| `font-family: sans-serif` | `@include font-sans` |

### Colors

| Instead of writing... | Use |
|---|---|
| `color: var(--color-text-primary)` | `@include text-primary` |
| `color: var(--color-text-secondary)` | `@include text-secondary` |
| `color: var(--color-text-muted)` | `@include text-muted` |
| `color: white` | `@include text-white` |
| `color: var(--color-error)` | `@include text-error` |
| `color: var(--color-success)` | `@include text-success` |
| `color: var(--color-warning)` | `@include text-warning` |
| `background-color: var(--color-bg-primary)` | `@include bg-primary` |
| `background-color: var(--color-bg-secondary)` | `@include bg-secondary` |
| `background-color: var(--color-bg-body)` | `@include bg-body` |

### Borders & Radius

| Instead of writing... | Use |
|---|---|
| `border: 1px solid var(--color-border)` | `@include border` |
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
| `box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)` | `@include shadow-xs` |
| `box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1)…` | `@include shadow-sm` |
| `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)…` | `@include shadow-md` |
| `box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)…` | `@include shadow-lg` |
| `box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)…` | `@include shadow-xl` |

### Transitions

| Instead of writing... | Use |
|---|---|
| `transition: all 0.2s ease` | `@include transition` |
| `transition: all 0.15s ease` | `@include transition-fast` |
| `transition: color, background-color, border-color 0.2s` | `@include transition-colors` |

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
| `overflow-x: auto` | `@include overflow-x-auto` |

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
| `z-index: 10` (sticky elements) | `@include z-sticky` |
| `z-index: 20` (dropdowns) | `@include z-dropdown` |
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
| Horizontal flex row, items-center | `@include row` or `@include row(1rem)` |
| Horizontal flex row, justify-between | `@include row-between` |
| Horizontal flex row, justify-center | `@include row-center` |
| Card container (bg + border + shadow + rounded) | `@include card` |
| Full structured card (header + main + footer) | `@include section-card` |
| Panel header bar (flex + bg-secondary + border-b) | `@include panel-header` |
| Primary action button | `@include btn` |
| Small button | `@include btn-sm` alongside `@include btn` |
| Large button | `@include btn-lg` alongside `@include btn` |
| Action button group (toolbar, table actions) | `@include btn-group` |
| Close/dismiss button | `@include close-button` |
| Inline alert (contextual feedback) | `@include alert` |
| Full-width page banner (system status) | `@include banner` |
| Expand/collapse parent | `@include collapsible` |
| Expand/collapse child | `@include collapsible-content` |
| Accordion list (styled + chevron) | `@include accordion` |
| Modal size: small (28rem) | `@include modal-sm` |
| Modal size: medium (32rem) | `@include modal-md` |
| Modal size: large (42rem) | `@include modal-lg` |
| Modal size: extra large (48rem) | `@include modal-xl` |
| Pill labels: bordered + visible input | `@include pill-outline` (on parent) |
| Focus — outer glow ring (default) | `@include focus-ring` |
| Focus — border thickens to 2px | `@include focus-border-thicken` |
| Focus — border color + ring | `@include focus-combination` |
| Focus — very light primary bg tint | `@include focus-background-shift` |
| Focus — bottom border only changes | `@include focus-accent-line` |
| Focus — inner shadow, field sinks | `@include focus-inset-shadow` |
| Tab navigation container | `@include tabs-nav` |
| Tab button | `@include tabs-tab` |
| Active tab | `@include tabs-tab-active` |
| Disabled tab | `@include tabs-tab-disabled` |
| Tab content panel | `@include tabs-panel` |
| Container query setup | `@include container` or `@include container(name)` |
| Status badge (dot + text + tinted pill) | `@include badge` |
| Live / pulsing badge | `@include badge-live` |

---

## Focus Indicator Presets

Six presets for `:focus-visible` styling. All accept an optional `$color` parameter (default: `var(--color-primary)`). Apply one consistently across the entire interface — mixing types within the same project fragments the visual grammar.

For design guidance on which type to use in which context, see `docs/css/tokens.md`.

### `@include focus-ring` — outer glow (default)

A soft `box-shadow` ring outside the element. Border and layout are unchanged. No layout shift.

```scss
// Applied automatically in _global.scss — no action needed for standard inputs.

// Override color for error state:
input.error:focus-visible { @include focus-ring(var(--color-error)); }

// Wider ring:
input:focus-visible { @include focus-ring($width: 4px); }
```

**When:** Default choice. Universally readable. Tailwind / Vercel / shadcn convention.

---

### `@include focus-border-thicken` — structural border

Uses `outline` (not `border`) to grow to 2px in primary color. No layout shift. No glow.

```scss
// Project SCSS — switch entire form to structural focus style:
#settings-form input:focus-visible,
#settings-form select:focus-visible,
#settings-form textarea:focus-visible {
    @include focus-border-thicken;
}

// Error variant:
input.error:focus-visible { @include focus-border-thicken(var(--color-error)); }
```

**When:** Enterprise / business UI. Dense forms where softness (glow) would add visual noise. Material Design style.

---

### `@include focus-combination` — border + ring

Border color shifts to primary AND outer ring appears simultaneously. The strongest possible focus signal.

```scss
// Accessibility-first form:
#public-form input:focus-visible { @include focus-combination; }
```

**When:** Accessibility-first interfaces. Forms used by keyboard-only users or where WCAG AAA focus visibility is required.

---

### `@include focus-background-shift` — inner tint

The field receives a very light primary tint. No border change whatsoever. Focus is felt, not announced.

```scss
// Minimalist / consumer-facing form inside a bordered card:
.search-panel input:focus-visible { @include focus-background-shift; }
```

**When:** Minimalist or consumer UI. The surrounding container already has a visible border — adding a border-based focus signal would be visually crowded. Works inside cards with strong borders.

---

### `@include focus-accent-line` — bottom border only

Only the bottom border changes to primary. The three other sides stay at their default color.

```scss
// Inside a section-card with visible border — full-border focus would double up:
.filter-panel input:focus-visible { @include focus-accent-line; }
```

**When:** Inside bordered containers (cards, panels) where a full border change would compete with the container's own border. Subtle, directional.

---

### `@include focus-inset-shadow` — inner shadow

An inner `box-shadow` makes the field appear to sink slightly. Tactile, three-dimensional.

```scss
// Custom UI with tactile character throughout:
#kiosk-form input:focus-visible { @include focus-inset-shadow; }
```

**When:** Rarely appropriate. Use only if the overall UI has a consistent tactile / depth language — inset shadows on buttons, card depths, etc. Never mix with flat elements in the same interface.

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
#stats ul {
    @include grid-4;
    list-style: none;
    padding: 0;
    margin: 0;
}
```

### `@include stack($gap: 1rem)`

Vertical flex layout with configurable gap (default 1rem).

```scss
.my-section main { @include stack(1.5rem); }
.my-sidebar       { @include stack(0.5rem); }
.my-content       { @include stack; }           // default 1rem
```

**Expands to:** `display: flex; flex-direction: column; gap: $gap;`

### `@include form-grid`

6-column grid for forms. Collapses to 1 column on mobile (<768px). Children are `.form-element` divs with explicit `for`/`id` association.

```scss
#user-form {
    @include form-grid;

    .form-element:nth-child(1),
    .form-element:nth-child(2) { grid-column: span 3; }
    .form-element:nth-child(3) { grid-column: span 6; }
    .form-actions               { grid-column: span 6; }
}
```

### `@include card`

Base card container — bg, border, shadow, rounded corners. No built-in header/footer.

**Expands to:**
```css
background-color: hsl(var(--color-bg-primary));
border: 1px solid hsl(var(--color-border));
width: 100%;
display: flex;
flex-direction: column;
border-radius: var(--radius-md);        /* 8px */
overflow: hidden;
box-shadow: var(--shadow-xs);
transition: all var(--transition-base);

&:hover {
    border-color: hsl(var(--color-primary) / 0.25);
    box-shadow: var(--shadow-sm);
}
```

See [cards.md](cards.md) for accent variants (`card-accent-top/left/bottom`), `card-bg`, `card-stacked`.

### `@include section-card`

Composed card with structured header + main + footer regions. See [cards.md](cards.md).

### `@include panel-header`

Header bar used by `section-card`, `ln-modal`, and any custom panel.

**Expands to:**
```css
display: flex;
align-items: center;
justify-content: space-between;
padding: 0.75rem 1rem;
background-color: hsl(var(--color-bg-secondary));
border-bottom: 1px solid hsl(var(--color-border));

h3 {
    font-size: var(--text-base);        /* 1rem */
    font-weight: var(--font-semibold);  /* 600 */
    color: hsl(var(--color-text-primary));
    margin: 0;
}
```

### `@include btn`

Complete primary action button — structure + filled primary colors. Use for non-submit action buttons.

**Expands to:**
```css
display: inline-flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
padding: 0.5rem 1.25rem;        /* py(0.5rem) after global button reduction */
font-size: var(--text-sm);
font-weight: var(--font-medium);
border-radius: var(--radius-md);
white-space: nowrap;
background-color: hsl(var(--color-primary));
color: white;

&:hover { background-color: hsl(var(--color-primary-hover)); }
```

> `<button type="submit">` gets primary colors automatically from `_global.scss` — no `@include btn` needed.
> `<button type="button">` gets neutral (transparent + gray hover) automatically.
> Use `@include btn` only for non-submit buttons that need primary styling.

**Color change** — override `--color-primary` on element or parent:
```scss
#delete-btn { @include btn; --color-primary: var(--color-error); }
```

**Size modifiers:**
```scss
#compact-btn { @include btn; @include btn-sm; }   // toolbar, table actions
#hero-cta    { @include btn; @include btn-lg; }
```

### `@include close-button`

Icon-only dismiss button. Resets padding to zero, fixed 2rem size.

**Expands to:**
```css
padding: 0;
width: 2rem;
height: 2rem;
display: flex;
align-items: center;
justify-content: center;
border-radius: var(--radius-sm);
transition: all var(--transition-fast);
color: hsl(var(--color-text-muted));

&:hover  { color: hsl(var(--color-error)); background: hsl(var(--color-bg-secondary)); }
&:active { color: hsl(var(--color-error-hover)); background: hsl(var(--color-bg-body)); }
```

```html
<!-- In HTML — SVG icon inside the button -->
<button type="button" aria-label="Close" data-ln-modal-close>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
</button>
```

```scss
/* In SCSS */
.ln-modal header button[data-ln-modal-close] { @include close-button; }
```

### `@include collapsible` + `@include collapsible-content`

Grid-based expand/collapse animation. **NEVER use `max-height` hack.**

- `collapsible` → wrapper (grid-template-rows: 0fr → 1fr)
- `collapsible-content` → direct child with `overflow: hidden`

**Pattern:**
```html
<main id="panel1" data-ln-toggle class="collapsible">
    <div class="collapsible-body">
        <p>Content — padding goes here, not on .collapsible-body</p>
    </div>
</main>
```

**Rules:**
- `.collapsible` wrapper = no padding (it collapses to 0)
- Put all padding on children of `.collapsible-body`, not on `.collapsible-body` itself — `overflow: hidden` on the wrapper means padding contributes to minimum height even at `grid-template-rows: 0fr`
- `data-ln-toggle` = JS behavior, `class="collapsible"` = CSS animation

### `@include accordion`

Styled accordion list — contained card with chevron rotation. Applied automatically to `[data-ln-accordion]`.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Section Title</header>
        <main id="panel1" data-ln-toggle class="collapsible">
            <div class="collapsible-body">
                <p>Content goes here.</p>
            </div>
        </main>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">Another Section</header>
        <main id="panel2" data-ln-toggle class="collapsible">
            <div class="collapsible-body">
                <p>More content.</p>
            </div>
        </main>
    </li>
</ul>
```

> Chevron is CSS `::after` — no SVG element needed in HTML.
> For custom accordion selectors: `#my-list { @include accordion; }`

---

## Icon System

SVG sprite injected into `<body>` at init by `ln-icons.js`. No init call required.

### Usage

```html
<!-- Standalone icon -->
<svg class="ln-icon" aria-hidden="true"><use href="#ln-home"></use></svg>

<!-- Icon in button with text -->
<button>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-plus"></use></svg>
    Add User
</button>

<!-- Icon-only button — aria-label required -->
<button type="button" aria-label="Close">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
</button>

<!-- Accordion chevron — rotates on open/close via CSS -->
<svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
```

### Size Variants

| Class | Size |
|-------|------|
| `ln-icon--sm` | 1rem (16px) |
| *(default)* | 1.25rem (20px) |
| `ln-icon--lg` | 1.5rem (24px) |
| `ln-icon--xl` | 4rem (64px) |

### Color

Icons inherit `currentColor` from the parent element's `color` property. No color variant classes.

**Exception:** `file-pdf`, `file-doc`, `file-epub` have embedded semantic stroke colors and do not follow `currentColor`.

### Available Icons

| Category | IDs |
|----------|-----|
| Navigation | `home` `users` `books` `settings` `logout` |
| Actions | `x` `menu` `plus` `edit` `trash` `eye` `device-floppy` `search` `check` `copy` `link` `upload` `download` `refresh` `printer` `lock` `star` `filter` `calendar` |
| Arrows | `arrow-up` `arrow-down` `arrows-sort` |
| Status | `circle-check` `circle-x` `info-circle` `alert-triangle` |
| Data/Content | `chart-bar` `clock` `mail` `book` `world` `list` `box` `building` |
| People/Contact | `user` `phone` `square-compass` |
| File Types | `file` |
| File Types (custom CDN) | `file-pdf` `file-doc` `file-epub` — use `#lnc-{id}`, requires `window.LN_ICONS_CUSTOM_CDN` |

Tabler icons: `#ln-{id}` — e.g. `<use href="#ln-home">`.
Custom CDN icons: `#lnc-{id}` — e.g. `<use href="#lnc-file-pdf">`.

### Adding a New Icon

All ~4000 Tabler icons are available in `js/ln-icons/tabler/` (source library, not bundled).

```bash
# Copy from source library to bundled set, then rebuild
cp js/ln-icons/tabler/{name}.svg js/ln-icons/icons/{name}.svg
npm run build
```

---

## Anti-Patterns

### Hardcoded values → Use tokens

```scss
// WRONG
color: #111827;
padding: 1rem 1.5rem;
font-weight: 600;
border: 1px solid #e5e7eb;
border-radius: 0.5rem;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
z-index: 40;

// CORRECT
@include text-primary;
@include px(1.5rem); @include py(1rem);
@include font-semibold;
@include border;
@include rounded-md;
@include shadow-xs;
@include z-modal;
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

### Padding on collapsible wrapper → Put padding on children

```scss
// WRONG — padding leaks through overflow:hidden at 0fr
.collapsible-body { @include p(1rem); }

// CORRECT — padding on children, not the overflow:hidden wrapper
.collapsible-body > * { @include px(1rem); @include py(0.75rem); margin: 0; }
```

### Manual panel header → Use `@include panel-header`

```scss
// WRONG
.my-card header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 1rem; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;
}

// CORRECT
.my-card header { @include panel-header; }
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
        <li><h3>Label</h3><strong>42</strong></li>
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

`<form>` is always the content root. Cancel (`type="button"`) → neutral. Save (`type="submit"`) → primary. Both styled automatically from `_global.scss`.

```html
<div class="ln-modal" data-ln-modal id="edit-user">
    <form>
        <header>
            <h3>Edit User</h3>
            <button type="button" aria-label="Close" data-ln-modal-close>
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        <main>
            <div class="form-element">
                <label for="name">Name</label>
                <input type="text" id="name" name="name">
            </div>
        </main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```
```scss
#edit-user > form { @include modal-lg; }
#edit-user header button[data-ln-modal-close] { @include close-button; }
#edit-user main { @include form-grid; }
```

### Form Layout

Forms use CSS Grid + `<div class="form-element">` with explicit `for`/`id`. **Use `<div>`, not `<p>`** — `<ul data-ln-validate-errors>` inside `<p>` is invalid HTML.

```html
<form id="user-form">
    <div class="form-element">
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" name="first_name" required>
        <ul data-ln-validate-errors></ul>
    </div>
    <div class="form-element">
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" name="last_name" required>
    </div>
    <div class="form-element">
        <label for="email">Email</label>
        <input type="email" id="email" name="email">
    </div>
    <ul class="form-actions">
        <li><button type="button">Cancel</button></li>
        <li><button type="submit">Save</button></li>
    </ul>
</form>
```
```scss
#user-form {
    @include form-grid;
    .form-element:nth-child(1),
    .form-element:nth-child(2) { grid-column: span 3; }
    .form-element:nth-child(3) { grid-column: span 6; }
    .form-actions               { grid-column: span 6; }
}
```

### Pill Labels (Checkbox / Radio)

```html
<ul>
    <li><label><input type="radio" name="role" value="admin"> Admin</label></li>
    <li><label><input type="radio" name="role" value="editor" checked> Editor</label></li>
    <li><label><input type="radio" name="role" value="external"> External</label></li>
</ul>
```
```scss
// Default: filled (input hidden, colored bg on checked)
#role-filter ul { @include pill-group; }
#role-filter label { @include pill; }

// Outline variant: standalone on label (visible input indicator)
#role-filter label { @include pill-outline; }

// Vertical list — outline labels
#dept-filter { @include check-list-outline; }

// Vertical list — filled labels
#dept-filter { @include check-list; }

// Color override
#status-filter { --color-primary: var(--color-success); }
```

---

## File Map

| File | Contents |
|------|----------|
| `scss/config/_tokens.scss` | All CSS custom properties (`:root`) |
| `scss/config/_mixins.scss` | `@forward` index for all mixin files |
| `scss/config/mixins/` | Individual mixin files (spacing, display, typography, card, btn, form, …) |
| `scss/base/_reset.scss` | `* { margin: 0; padding: 0; box-sizing: border-box }` |
| `scss/base/_global.scss` | Global element styles — all buttons, links, images, `::selection` |
| `scss/base/_typography.scss` | h1–h6, p, code, pre, blockquote, lists |
| `scss/components/` | Apply mixins to default selectors (CSS output) |
| `js/ln-icons/icons/` | Bundled SVG icons (~47, Tabler-based) |
| `js/ln-icons/tabler/` | Full Tabler icon source library (~4000, not bundled) |
