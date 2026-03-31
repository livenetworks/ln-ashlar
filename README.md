# ln-acme

Unified frontend library for LiveNetworks projects.
SCSS CSS framework + vanilla JS components, zero dependencies.

---

## Quick Start

### npm
```js
import 'ln-acme';                        // JS components
import 'ln-acme/dist/ln-acme.css';       // CSS
```

### Git submodule
```bash
git submodule add .../ln-acme.git resources/ln-acme
```

### Plain HTML
```html
<link rel="stylesheet" href="dist/ln-acme.css">
<script src="dist/ln-acme.iife.js" defer></script>
```

### Build
```bash
npm run build        # dist/ln-acme.css + dist/ln-acme.js + dist/ln-acme.iife.js
npm run dev          # Watch mode
```

---

## Core Architecture

### Principle: Semantic HTML + CSS Variables + Mixins

1. **HTML describes WHAT** — semantic elements, no presentational classes
2. **Mixins describe HOW** — `@include` in SCSS on semantic selectors
3. **CSS variables provide values** — `var(--color-primary)`, never hardcoded colors
4. **Colors cascade through inheritance** — override `--color-primary` on any parent

```scss
// Project SCSS — semantic selector, mixin for style, token for value
#user-profile {
  @include section-card;
}

#delete-user {
  --color-primary: var(--color-error);  // button turns red via inheritance
}
```

### Override Architecture

ln-acme defines default mixins. Projects use them. When customization is needed:

| Need | Approach | Example |
|------|----------|---------|
| Different **color** | Override CSS variable on parent | `.admin { --color-primary: var(--color-secondary); }` |
| Different **structure** | Redefine the mixin in project `_overrides.scss` | `@mixin btn { @include rounded-full; ... }` |
| Both | Mixin override + CSS variable | Combine both approaches |

**Project selectors never change** — they describe WHAT the element is, not HOW it looks. Visual changes happen only in mixin definitions or CSS variable overrides.

---

## File Structure

```
scss/
├── config/
│   ├── _tokens.scss          ← :root CSS custom properties
│   ├── _mixins.scss          ← Entry point → forwards mixins/
│   ├── mixins/
│   │   ├── _spacing.scss     ← p, px, py, m, mx, my, gap
│   │   ├── _display.scss     ← flex, block, hidden, items-*, justify-*
│   │   ├── _sizing.scss      ← w, h, size
│   │   ├── _typography.scss  ← text-*, font-*, truncate
│   │   ├── _colors.scss      ← text-primary, bg-primary
│   │   ├── _borders.scss     ← border, rounded-*
│   │   ├── _shadows.scss     ← shadow-*
│   │   ├── _transitions.scss ← transition, transition-fast
│   │   ├── _position.scss    ← relative, absolute, overflow-*
│   │   ├── _interaction.scss ← cursor-*, z-*
│   │   ├── _layout.scss      ← grid, form-grid, stack, container
│   │   ├── _collapsible.scss ← collapsible, collapsible-content
│   │   ├── _card.scss        ← card, card-accent-*, card-bg, card-stacked, panel-header, section, section-card
│   │   ├── _nav.scss         ← nav
│   │   ├── _btn.scss         ← btn, btn-colors, close-button
│   │   ├── _avatar.scss      ← avatar
│   │   └── _modal.scss       ← modal-sm, modal-md, modal-lg, modal-xl
│   ├── _theme.scss           ← Color palette extensions
│   └── _icons.scss           ← SVG mask-image icon system
├── base/                     ← Reset, global defaults (button, a), typography
├── components/               ← Forms, tables, tabs, toggle, etc.
└── utilities/                ← Helper classes (.hidden, .sr-only, etc.)

js/
├── index.js                  ← Barrel import
└── ln-{name}/
    ├── ln-{name}.js          ← IIFE component
    └── ln-{name}.scss        ← Co-located CSS (if needed)
```

---

## Design Tokens

All values are CSS custom properties in `scss/config/_tokens.scss`. Colors are stored as bare HSL triplets for alpha transparency support:

```scss
// Solid color
background-color: hsl(var(--color-primary));

// With transparency
background-color: hsl(var(--color-primary) / 0.5);

// Theming — override at any scope
.dark-theme { --color-bg-primary: 240 14% 15%; }
```

### Available Tokens

#### Colors
| Token | Default | Usage |
|-------|---------|-------|
| `--color-primary` | `233 60% 42%` | Primary brand color, buttons, links |
| `--color-primary-hover` | `233 61% 31%` | Primary hover state |
| `--color-primary-light` | `228 73% 94%` | Light primary (active nav, focus rings) |
| `--color-secondary` | `160 76% 40%` | Secondary brand color |
| `--color-success` | `142 76% 36%` | Success states |
| `--color-error` | `0 84% 50%` | Error states |
| `--color-warning` | `32 95% 44%` | Warning states |
| `--color-info` | `217 91% 60%` | Info states |
| `--color-white` | `0 0% 100%` | White (used in btn hover text) |
| `--color-text-primary` | `221 39% 11%` | Primary text |
| `--color-text-secondary` | `220 9% 46%` | Secondary text |
| `--color-text-muted` | `218 11% 65%` | Muted text |
| `--color-bg-primary` | `0 0% 100%` | Primary background (white) |
| `--color-bg-secondary` | `220 14% 96%` | Secondary background (light gray) |
| `--color-bg-body` | `240 5% 96%` | Body background |
| `--color-border` | `220 13% 91%` | Default border color |

#### Spacing
| Token | Value |
|-------|-------|
| `--spacing-xs` | `0.25rem` (4px) |
| `--spacing-sm` | `0.5rem` (8px) |
| `--spacing-md` | `1rem` (16px) |
| `--spacing-lg` | `1.5rem` (24px) |
| `--spacing-xl` | `2rem` (32px) |
| `--spacing-2xl` | `3rem` (48px) |

#### Border Radius
| Token | Value |
|-------|-------|
| `--radius-sm` | `0.125rem` (2px) |
| `--radius-md` | `0.375rem` (6px) |
| `--radius-lg` | `0.5rem` (8px) |
| `--radius-xl` | `0.75rem` (12px) |
| `--radius-full` | `9999px` |

#### Typography
| Token | Value |
|-------|-------|
| `--text-xs` | `0.75rem` (12px) |
| `--text-sm` | `0.875rem` (14px) |
| `--text-base` | `1rem` (16px) |
| `--text-lg` | `1.125rem` (18px) |
| `--text-xl` | `1.25rem` (20px) |
| `--text-2xl` | `1.5rem` (24px) |
| `--font-normal` / `--font-medium` / `--font-semibold` / `--font-bold` | 400 / 500 / 600 / 700 |

#### Z-Index Scale
| Token | Value |
|-------|-------|
| `--z-sticky` | 10 |
| `--z-dropdown` | 20 |
| `--z-overlay` | 30 |
| `--z-modal` | 40 |
| `--z-toast` | 50 |

---

## Mixins Reference

Import in any SCSS file:
```scss
@use 'path/to/ln-acme/scss/config/mixins' as *;
```

### Spacing

| Mixin | Output |
|-------|--------|
| `@include p($val)` | `padding` |
| `@include px($val)` | `padding-left` + `padding-right` |
| `@include py($val)` | `padding-top` + `padding-bottom` |
| `@include pt($val)`, `pb`, `pl`, `pr` | Individual padding sides |
| `@include m($val)` | `margin` |
| `@include mx($val)` | `margin-left` + `margin-right` |
| `@include my($val)` | `margin-top` + `margin-bottom` |
| `@include mt($val)`, `mb`, `ml`, `mr` | Individual margin sides |
| `@include gap($val)` | `gap` |

### Display & Flex

| Mixin | Output |
|-------|--------|
| `@include flex` | `display: flex` |
| `@include inline-flex` | `display: inline-flex` |
| `@include block` | `display: block` |
| `@include hidden` | `display: none` |
| `@include flex-col` | `display: flex; flex-direction: column` |
| `@include flex-row` | `display: flex; flex-direction: row` |
| `@include flex-wrap` | `flex-wrap: wrap` |
| `@include flex-1` | `flex: 1` |
| `@include flex-shrink-0` | `flex-shrink: 0` |
| `@include items-center` | `align-items: center` |
| `@include items-start` | `align-items: flex-start` |
| `@include items-end` | `align-items: flex-end` |
| `@include justify-center` | `justify-content: center` |
| `@include justify-between` | `justify-content: space-between` |
| `@include justify-end` | `justify-content: flex-end` |
| `@include flex-center` | `display: flex` + center both axes |

### Sizing

| Mixin | Output |
|-------|--------|
| `@include w-full` | `width: 100%` |
| `@include h-full` | `height: 100%` |
| `@include min-h-screen` | `min-height: 100vh` |
| `@include w($val)` | `width: $val` |
| `@include h($val)` | `height: $val` |
| `@include size($val)` | `width` + `height` |

### Typography

| Mixin | Output |
|-------|--------|
| `@include text-xs` .. `text-2xl` | Font size + line-height |
| `@include font-normal` .. `font-bold` | Font weight |
| `@include text-left`, `text-center`, `text-right` | Text alignment |
| `@include uppercase`, `lowercase`, `capitalize` | Text transform |
| `@include tracking-wide`, `tracking-wider` | Letter spacing |
| `@include truncate` | Overflow ellipsis (single line) |
| `@include font-mono`, `font-sans` | Font family |

### Colors

| Mixin | Output |
|-------|--------|
| `@include text-primary` | `color: hsl(var(--color-text-primary))` |
| `@include text-secondary` | `color: hsl(var(--color-text-secondary))` |
| `@include text-muted` | `color: hsl(var(--color-text-muted))` |
| `@include text-white` | `color: hsl(var(--color-white))` |
| `@include text-error` | `color: hsl(var(--color-error))` |
| `@include text-success` | `color: hsl(var(--color-success))` |
| `@include text-warning` | `color: hsl(var(--color-warning))` |
| `@include bg-primary` | `background-color: hsl(var(--color-bg-primary))` |
| `@include bg-secondary` | `background-color: hsl(var(--color-bg-secondary))` |
| `@include bg-body` | `background-color: hsl(var(--color-bg-body))` |

### Borders & Radius

| Mixin | Output |
|-------|--------|
| `@include border` | `border: 1px solid hsl(var(--color-border))` |
| `@include border-light` | `border: 1px solid hsl(var(--color-border-light))` — softer variant |
| `@include border-t`, `border-b`, `border-l`, `border-r` | Individual sides |
| `@include border-t-light`, `border-b-light` | Light individual sides |
| `@include border-none` | `border: none` |
| `@include rounded-sm` .. `rounded-full` | Border radius from tokens |

### Shadows

| Mixin | Output |
|-------|--------|
| `@include shadow-xs` | Very subtle depth (`0 1px 2px`) |
| `@include shadow-sm` .. `shadow-xl` | Multi-layer box shadows from tokens |

### Transitions

| Mixin | Output |
|-------|--------|
| `@include transition` | `transition: all var(--transition-base)` (0.2s) |
| `@include transition-fast` | `transition: all var(--transition-fast)` (0.15s) |
| `@include transition-slow` | `transition: all var(--transition-slow)` (0.3s) |
| `@include transition-colors` | Transitions only color, background-color, border-color |

### Position & Overflow

| Mixin | Output |
|-------|--------|
| `@include relative`, `absolute`, `fixed`, `sticky` | Position |
| `@include inset-0` | `top/right/bottom/left: 0` |
| `@include overflow-hidden`, `overflow-auto`, `overflow-x-auto` | Overflow |

### Interaction

| Mixin | Output |
|-------|--------|
| `@include cursor-pointer` | `cursor: pointer` |
| `@include cursor-not-allowed` | `cursor: not-allowed` |
| `@include select-none` | `user-select: none` |
| `@include opacity-50` | `opacity: 0.5` |
| `@include z-dropdown` .. `z-toast` | Z-index from tokens |
| `@include z($val)` | `z-index: $val` |

### Layout

| Mixin | Columns | Responsive |
|-------|---------|------------|
| `@include grid` | 1 → 2 → 3 | 768px → 2col, 1024px → 3col |
| `@include grid-2` | 1 → 2 | 768px → 2col |
| `@include grid-4` | 1 → 2 → 4 | 768px → 2col, 1024px → 4col |
| `@include form-grid` | 6-column grid | <768px → 1col |
| `@include stack($gap)` | Flex column | Default gap: 1rem |
| `@include container($name)` | Container query context | See Container Queries below |

### Collapsible

| Mixin | Role |
|-------|------|
| `@include collapsible` | Parent — grid with 0fr/1fr transition, toggled by `.open` |
| `@include collapsible-content` | Child — `overflow: hidden` |

```scss
.my-panel          { @include collapsible; }
.my-panel > section { @include collapsible-content; }
```

### Card & Section

| Mixin | Description |
|-------|-------------|
| `@include card` | White bg, light border, shadow-sm, rounded, hover shadow-md |
| `@include card-accent-top` | 3px colored `border-top` (reads `--color-primary`) |
| `@include card-accent-bottom` | 3px colored `border-bottom` |
| `@include card-accent-left` | 3px colored `border-left` (side status) |
| `@include card-bg` | Soft tinted background from `--color-primary` |
| `@include card-stacked` | Pseudo-element "stacked cards" depth illusion |
| `@include panel-header` | Flex header bar with border-bottom, styles `h3` |
| `@include section` | Margin-bottom + header with border-bottom, styles `h2` |
| `@include section-card` | Complete card: `header` (panel-header), `main` (padding), `footer` (border-top) |

```scss
#user-profile { @include section-card; }
#alerts  { @include card; @include card-accent-top; --color-primary: var(--color-error); }
#status  { @include card; @include card-accent-left; --color-primary: var(--color-success); }
#welcome { @include card; @include card-bg; }
```

### Navigation

| Mixin | Description |
|-------|-------------|
| `@include nav` | Full sidebar navigation with `ul`, `li`, `a` (hover/active), `.nav-icon`, `.nav-label`, `.nav-section`, `.nav-divider` |

### Modal

| Mixin | Max-width |
|-------|-----------|
| `@include modal-sm` | 28rem |
| `@include modal-md` | 32rem |
| `@include modal-lg` | 42rem |
| `@include modal-xl` | 48rem |

Applied via semantic selectors:
```scss
#edit-user > form { @include modal-lg; }
```

### Pill Labels

| Mixin | Description |
|-------|-------------|
| `@include pill` | Filled — gray bg, colored on checked, input hidden |
| `@include pill-group` | Container for pill labels (flex, shared border-radius) |
| `@include pill-outline` | Outlined — bordered, visible input, apply on parent |

### Buttons

Every `<button>` gets hover/active/focus/disabled effects **automatically** from ln-acme. All states read from `--color-primary`.

| Mixin | Description |
|-------|-------------|
| `@include btn-colors` | Color states only. Already applied globally to all `<button>` |
| `@include btn` | Structure: inline-flex, padding, font-size, font-weight |
| `@include btn-sm` | Small button: less padding, `text-xs` |
| `@include btn-lg` | Large button: more padding, `text-base` |
| `@include btn-group` | Container for grouped buttons (flex, gap, shared border-radius) |
| `@include close-button` | Transparent close button with red hover |

#### States (automatic on every button)

| State | Background | Text |
|-------|-----------|------|
| Default | `hsl(--color-primary / 0.1)` | `hsl(--color-primary)` |
| Hover | `hsl(--color-primary)` + shadow + translateY(-1px) | `hsl(--color-white)` |
| Active | `hsl(--color-primary-hover)` | `hsl(--color-white)` |
| Focus-visible | `@include focus-ring` (keyboard only) | unchanged |
| Disabled | 50% opacity | cursor: not-allowed |

#### Changing button color

Override `--color-primary` on the element or any parent:

```scss
// Semantic selector
#delete-user { --color-primary: var(--color-error); }

// Parent context — all buttons inside
.admin-panel { --color-primary: var(--color-secondary); }

// Project variant class (defined in project SCSS, NOT in ln-acme)
.btn--danger { --color-primary: var(--color-error); }
```

**ln-acme does NOT ship `btn--*` variant classes.** Each project defines its own.

### Form

| Mixin | Description |
|-------|-------------|
| `@include form-label` | Label styling (font-weight, spacing). Auto `*` on required via `:has([required])` |
| `@include form-grid` | 6-column CSS grid with responsive fallback |
| `@include form-actions` | Flex end-justified with border-top |
| `@include form-input` | Text input styling (border, padding, focus ring) |
| `@include form-textarea` | Textarea with min-height |
| `@include form-select` | Select with custom dropdown icon |
| `@include form-checkbox` | Checkbox styling |
| `@include form-radio` | Radio styling |

### Table

| Mixin | Description |
|-------|-------------|
| `@include table-base` | Base table styling (borders, padding, alignment) |
| `@include table-responsive` | Stacked mobile layout with `data-label` |
| `@include table-striped` | Alternating row background colors |
| `@include table-section-header` | Section header row styling |
| `@include table-action` | Action button styling in table cells |

### Tabs

| Mixin | Description |
|-------|-------------|
| `@include tabs-nav` | Tab navigation container (flex, border-bottom) |
| `@include tabs-tab` | Tab button (full reset, padding, text, hover tint + underline) |
| `@include tabs-tab-active` | Active tab state (primary color, bottom border) |
| `@include tabs-tab-disabled` | Disabled tab (muted, opacity-50, cursor-not-allowed) |
| `@include tabs-panel` | Tab content panel (padding) |

### Focus

| Mixin | Description |
|-------|-------------|
| `@include focus-ring` | Consistent focus indicator (box-shadow, primary-light, 3px) |
| `@include focus-ring($color, $width)` | Custom color and width |

Used internally by `btn-colors`, `form-input`, `form-check`, `close-button`. Use directly when building custom interactive elements.

### Avatar

| Mixin | Description |
|-------|-------------|
| `@include avatar` | Profile button/link with square-ish image (rounded-md) + name/role text. Hover bg, focus ring. |

```scss
// Default selector: .avatar
// HTML:
// <button class="avatar">
//   <img src="avatar.jpg" alt="">
//   <span>Sojic<small>Administrator</small></span>
// </button>
```

### Other

| Mixin | Description |
|-------|-------------|
| `@include loader` | Animated spinner |
| `@include breadcrumbs` | Flex breadcrumb navigation with separators |

---

## Auto-Applied Styles

ln-acme automatically styles bare HTML elements via its component layer. You get these styles for free — no classes or mixins needed. Use the corresponding mixin when you need to re-apply or override on a custom selector.

### Global (`base/_global.scss`)

| Element | Styles applied |
|---------|---------------|
| `html`, `body` | Full width/height, `bg-body`, `font-sans` |
| `body` | `text-base`, `text-primary` |
| `a` | Color from tokens, no underline, hover color transition |
| `button`, `input[type="submit"]`, `input[type="reset"]`, `input[type="button"]` | `rounded-md`, `cursor-pointer`, `transition`, `btn-colors` (hover/active/focus/disabled) |
| `img` | `max-width: 100%`, `height: auto`, `display: block` |

### Forms (`components/_forms.scss`)

| Element | Mixin applied |
|---------|--------------|
| `input`, `textarea`, `select` | `form-input` |
| `textarea` | `form-textarea` |
| `select` | `form-select` |
| `input[type="checkbox"]` | `form-checkbox` |
| `input[type="radio"]` | `form-radio` |
| `label` | `form-label` |
| `label:has(> input[type="checkbox/radio"])` | `pill` |
| `ul:has(> li > label > input[type="checkbox/radio"])` | `pill-group` |
| `.form-actions` | `form-actions` |

### Other components

| Selector | Mixin applied | Source |
|----------|--------------|--------|
| `.btn` | `btn` | `components/_buttons.scss` |
| `.btn-group` | `btn-group` | `components/_buttons.scss` |
| `.avatar` | `avatar` | `components/_avatar.scss` |
| `table` | `table-base` + responsive | `components/_tables.scss` |
| `.collapsible` | `collapsible` | `components/_toggle.scss` |
| `#breadcrumbs` | `breadcrumbs` | `components/_breadcrumbs.scss` |

To override any auto-applied style, re-apply the mixin on your own selector or use a more specific selector in your project SCSS.

---

## Icons

Icons use `mask-image` + `currentColor` — they automatically inherit the text color from their parent element. No color variant classes needed.

```html
<!-- Inherits parent color -->
<span class="ln-icon-home"></span>

<!-- In a button — icon follows button text color (white on hover) -->
<button><span class="ln-icon-plus"></span> Add</button>

<!-- Color via CSS -->
<span class="ln-icon-delete" style="color: red"></span>
<!-- Better: .action.danger { color: hsl(var(--color-error)); } -->
```

### Available Icons

`ln-icon-close`, `ln-icon-menu`, `ln-icon-home`, `ln-icon-users`,
`ln-icon-delete`, `ln-icon-view`, `ln-icon-check`, `ln-icon-plus`,
`ln-icon-settings`, `ln-icon-books`, `ln-icon-lodges`, `ln-icon-logout`,
`ln-icon-chart`, `ln-icon-clock`, `ln-icon-envelope`, `ln-icon-book`,
`ln-icon-arrow-up`, `ln-icon-arrow-down`, `ln-icon-edit`, `ln-icon-save`,
`ln-icon-download`, `ln-icon-upload`, `ln-icon-copy`, `ln-icon-link`,
`ln-icon-calendar`, `ln-icon-filter`, `ln-icon-refresh`, `ln-icon-print`,
`ln-icon-lock`, `ln-icon-star`, `ln-icon-info-circle`, `ln-icon-error-circle`,
`ln-icon-check-circle`, `ln-icon-warning`, `ln-icon-globe`, `ln-icon-search`,
`ln-icon-list`, `ln-icon-box`, `ln-icon-building`, `ln-icon-badge`.

### Sizes

| Class | Size |
|-------|------|
| `ln-icon--sm` | 1rem |
| *(default)* | 1.25rem |
| `ln-icon--lg` | 1.5rem |
| `ln-icon--xl` | 4rem |

---

## Form Layout

Forms use CSS Grid + wrapping `<label>` (implicit association, no `for`/`id` needed). No `<div>` wrappers.

### HTML

```html
<form id="my-form">
  <label>
    Name <span class="text-error">*</span>
    <input type="text" name="name" required>
    <small class="text-error">Required field</small>
  </label>

  <label>
    Category
    <select name="category">
      <option>Option A</option>
    </select>
  </label>

  <label>
    Notes
    <textarea name="notes"></textarea>
  </label>

  <div class="form-actions">
    <button type="button">Cancel</button>
    <button type="submit">Save</button>
  </div>
</form>
```

### SCSS

```scss
#my-form {
  @include form-grid;

  > label:nth-child(1),
  > label:nth-child(2) { grid-column: span 3; } // half width
  > label:nth-child(3) { grid-column: span 6; } // full width
  .form-actions { grid-column: span 6; }

  small { display: block; }
}
```

### Rules

| Element | Rule |
|---------|------|
| Root | `<form id="...">` — styled with `@include form-grid` (6 cols, 1 col on mobile) |
| Children | Direct `<label>` elements wrapping both text and input |
| Column spans | Via `> label:nth-child(N)` in SCSS — NEVER inline style or width classes |
| Errors | `<small class="text-error">` inside `<label>` + `small { display: block; }` in SCSS |
| Checkbox/radio | Needs `input[type="checkbox"] { width: auto; }` |
| `.form-actions` | Component class — stays in HTML, `grid-column: span 6` |

---

## Pill Labels (Checkbox / Radio)

Checkbox and radio inputs in `<ul> > <li> > <label>` become grouped pill buttons. Border-radius on first/last only.

```html
<ul>
  <li><label><input type="radio" name="role" value="admin"> Admin</label></li>
  <li><label><input type="radio" name="role" value="editor" checked> Editor</label></li>
  <li><label><input type="radio" name="role" value="external"> External</label></li>
</ul>
```

### Two Styles

| Style | How | Description |
|-------|-----|-------------|
| **Filled** (default) | Automatic | Gray bg, colored bg on checked, input hidden |
| **Outline** | `@include pill-outline` on parent | Bordered, visible input indicator |

```scss
// Outline style — apply on parent container
#my-form fieldset { @include pill-outline; }

// Color override per context
#role-field { --color-primary: var(--color-secondary); }
```

---

## Container Queries

Use `@include container(name)` on parent; `@container` on child — never same element.

```scss
#sidebar { @include container(sidebar); }

#sidebar nav {
  @container sidebar (min-width: 580px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**Never** combine `container-type` with `overflow: hidden` on the same element.

### Standard Breakpoints

| Width | Use |
|-------|-----|
| 480px | 1 → 2 columns (narrow) |
| 580px | 1 → 2 columns (standard) |
| 880px | 2 → 3 columns |
| 1120px | 3 → 4 columns |

Container names: noun, singular, lowercase, no hyphens (`sidebar`, `cardgrid`, not `card-grid`).

---

## JS Components

All components use `data-ln-*` attributes. No initialization needed — auto-discovered via MutationObserver.

| Component | Attribute | Description |
|-----------|-----------|-------------|
| Accordion | `data-ln-accordion` | Collapsible panels, only one open at a time |
| HTTP | — (global service) | Event-driven JSON fetch with abort support |
| AJAX | `data-ln-ajax` | AJAX navigation and form submission |
| Circular Progress | `data-ln-circular-progress` | SVG circular progress indicator |
| Confirm | `data-ln-confirm` | Destructive action confirmation dialog |
| Dropdown | `data-ln-dropdown` | Dropdown menu with outside-click closing |
| External Links | `data-ln-external` | External link handler |
| Filter | `data-ln-filter` | Attribute-based filtering |
| Link | `data-ln-link` | Clickable row/element as link |
| Modal | `data-ln-modal` | Modal dialog |
| Nav | `data-ln-nav` | Active link marker |
| Progress | `data-ln-progress` | Progress bar |
| Search | `data-ln-search` | Search component |
| Select | `data-ln-select` | Enhanced select (TomSelect wrapper) |
| Sortable | `data-ln-sortable` | Drag & drop reorder |
| Table | `data-ln-table` | Data table with sort, filter, virtual scroll |
| Tabs | `data-ln-tabs` | Tab panels with URL hash sync |
| Toast | `data-ln-toast` | Toast notifications |
| Toggle | `data-ln-toggle` | Show/hide toggle |
| Translations | `data-ln-translations` | Inline translation system |
| Upload | `data-ln-upload` | File upload with drag & drop |

See [js/COMPONENTS.md](js/COMPONENTS.md) for detailed JS architecture and patterns.

---

## Adding New Components

### New SCSS Component

1. Create `scss/components/_new-component.scss`
2. Start with `@use '../config/mixins' as *;`
3. Use semantic selectors — never hardcoded colors
4. Use `@include` mixins for properties, `var(--token)` for values
5. Add `@use 'components/new-component'` to `scss/ln-acme.scss`

### New JS Component

1. Create `js/ln-{name}/ln-{name}.js`
2. Follow the IIFE pattern
3. Use `data-ln-{name}` attribute for auto-discovery
4. If CSS needed, create `js/ln-{name}/ln-{name}.scss`
5. Add `import './ln-{name}/ln-{name}.js'` to `js/index.js`

---

## Demo

Live demos available in `demo/`:

- **Admin Dashboard** — `demo/admin/index.html`
- **DocuFlow** — `demo/docuflow/index.html`

The demo is itself a project that consumes ln-acme — it demonstrates how to define project-level SCSS using ln-acme mixins and tokens.

---

## Zero Hardcoded Colors Rule

Mixins **NEVER** contain concrete color values (`#fff`, `rgb()`, `hsl(0 0% 100%)`). Every color reads from a CSS custom property: `var(--color-*)`.

This is what makes the entire system work — colors cascade through CSS inheritance, not baked into mixin definitions.

```scss
// WRONG
color: #fff;
background-color: hsl(0 0% 100%);

// CORRECT
color: hsl(var(--color-white));
background-color: hsl(var(--color-bg-primary));
```
