---
name: mixins
classification: css
status: active
domain: frontend
summary: Master index and reference for SCSS mixins covering spacing, typography, layout primitives, surfaces, and component recipes.
source: theme/config/_mixins.scss
tags: [mixins, scss, layout, primitives, components, recipes]
---

# 🛠️ mixins

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` mixin architecture powers the **Visual Theme Layer** (`ln-ashlar-theme.css`), dividing styles into two primary categories:

1. **Primitives (`theme/config/mixins/_*.scss`):** Atomic recipes for layout, spacing, sizing, display, borders, shadows, typography, and focus rings. They contain zero selectors and emit only CSS properties.
2. **Composites (Component Recipes):** Full semantic component recipes (cards, tables, forms, modals, app-shell, toasts, navigation).

### Import Syntax:
```scss
// In component or project stylesheets:
@use 'theme/config/mixins' as *;
```

### Consumption Rules:
- **Semantic Binding:** Mixins are applied to semantic elements or stable selectors (e.g. `#profile-panel { @include card; }`), avoiding utility class bloat in HTML.
- **Delta-Only Inheritance:** Variant mixins inherit base styles and specify only delta overrides.
- **Primitive Rebinding:** When overriding dimensions or surfaces, rebind primitives (`--color-bg`, `--padding-x`) on the element scope rather than writing ad-hoc CSS property overrides.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Card & Typography)

```html
<article id="user-profile">
    <header>
        <h2>User Profile</h2>
    </header>
    <main>
        <p>Profile details and account activity.</p>
    </main>
</article>
```

```scss
#user-profile {
    @include card;
    @include p(var(--padding-x));

    header {
        @include typography(title-md);
        @include pb(var(--size-xs-up));
    }
}
```

### Variant 1: Layout Primitives (Stack & Row)

```html
<div class="filter-toolbar">
    <div class="filter-controls">
        <input type="search" placeholder="Search accounts...">
        <select><option>Active</option></select>
    </div>
    <button type="submit">Filter</button>
</div>
```

```scss
.filter-toolbar {
    @include row-between(var(--gap));
    @include items-center;

    .filter-controls {
        @include row(var(--size-xs-up));
    }
}
```

### Variant 2: Form Composites

```html
<form class="user-form">
    <div class="field col-span-3">
        <label for="fname">First Name</label>
        <input id="fname" type="text" required>
    </div>
</form>
```

```scss
.user-form {
    @include form-grid;

    input[type="text"] {
        @include form-input;
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| **Layout & Spacing Primitives** | | | |
| `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr` | mixin | `$val: CSS length` | Padding shorthand recipes |
| `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr` | mixin | `$val: CSS length` | Margin shorthand recipes |
| `gap` | mixin | `$val: CSS length` | Flexbox / CSS Grid gap |
| `stack` | mixin | `$gap: var(--gap)` | Vertical flex column with gap |
| `row` | mixin | `$gap: var(--gap)` | Horizontal flex row with gap |
| `row-between` | mixin | `$gap: var(--gap)` | Flex row with `justify-content: space-between` |
| `row-center` | mixin | `$gap: var(--gap)` | Flex row with `align-items: center` |
| `flex`, `flex-col`, `flex-row`, `flex-wrap` | mixin | — | Display flex and direction primitives |
| `flex-center` | mixin | — | Shorthand for flex with centered alignment and justification |
| `flex-1`, `flex-shrink-0` | mixin | — | Flex grow/shrink controls |
| `items-center`, `items-start`, `items-end` | mixin | — | Cross-axis alignment (`align-items`) |
| `justify-center`, `justify-between`, `justify-end` | mixin | — | Main-axis alignment (`justify-content`) |
| `grid`, `grid-2`, `grid-3`, `grid-4` | mixin | — | Responsive CSS Grid column presets |
| `container` | mixin | `$name: null` | Declares container query context (`container-type: inline-size`) |
| `size` | mixin | `$width, $height: $width` | Equal width and height dimension shorthand |
| `w-full`, `h-full`, `min-h-screen` | mixin | — | Dimensional extent shorthands |
| **Typography & Focus Primitives** | | | |
| `typography` | mixin | `$role: keyword` | Semantic typography role rebind (`title-md`, `body-md`, `heading-lg`, etc.) |
| `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` | mixin | — | Direct typography font-size steps |
| `font-normal`, `font-medium`, `font-semibold`, `font-bold` | mixin | — | Font-weight presets (400, 500, 600, 700) |
| `focus-ring` | mixin | — | Accessible focus outline with offset and theme-primary hue |
| `focus-visible` | mixin | — | Applies focus-ring specifically to `:focus-visible` |
| `truncate` | mixin | — | Single-line ellipsis overflow clipping |
| **Borders, Depth & Transitions** | | | |
| `border`, `border-t`, `border-b`, `border-l`, `border-r` | mixin | — | 1px border using `--color-border` |
| `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` | mixin | — | Border-radius presets matching design tokens |
| `shadow-none`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-inner` | mixin | — | Box-shadow depth elevation presets |
| `transition` | mixin | `$prop: all, $duration: var(--transition-base)` | Standardized transition animation timing |
| **Component Recipes (Composites)** | | | |
| `card` | mixin | — | Standard container card with border, resting shadow, and `--color-bg` |
| `card-header`, `card-body`, `card-footer` | mixin | — | Internal card structural regions with standard padding |
| `section` | mixin | — | Page section vertical rhythm and container constraints |
| `table-base`, `table-striped` | mixin | `$sticky: false` | Full table styling with sunken header and interactive hover |
| `form-grid`, `form-input`, `form-label` | mixin | — | Responsive 6-column form grid and input styling |
| `btn`, `btn-soft`, `btn-ghost` | mixin | — | Turnkey button variants with interaction states |
| `chip` | mixin | — | Dismissible pill badge with delete action |
| `badge`, `status-badge` | mixin | — | Status indicator badge with semantic status colors |
| `modal-backdrop`, `modal-panel` | mixin | — | Modal overlay backdrop and centered dialog panel |
| `popover-panel`, `tooltip-bubble` | mixin | — | Floating overlays with elevation shadows |
| `toast-container`, `toast-card` | mixin | — | Fixed toast notification stack and toast item card |
| `app-wrapper`, `app-header`, `app-main`, `app-scrim`, `app-footer` | mixin | — | Full viewport application shell scaffolding |
| `sidebar`, `sidebar-drawer` | mixin | — | Desktop sidebar and responsive mobile drawer |
| `breadcrumbs`, `stepper`, `timeline` | mixin | — | Navigation trails and sequential step indicators |
| `stat-card` | mixin | — | Key performance indicator (KPI) metric card |
| `prose` | mixin | — | Editorial typography rhythm with styled lists and quotes |
| `loader`, `progress-track`, `progress-fill`, `circular-progress` | mixin | — | Progress and activity loading indicators |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Re-implement Focus Indicators:** Always use `@include focus-ring` or `@include focus-visible` on interactive elements to ensure high-contrast, theme-aware keyboard focus accessibility.
> 2. **Never Emit Selectors Inside Pure Mixins:** Mixins in `theme/config/mixins/` must remain pure recipes and emit only properties. Tag and class bindings belong in `theme/components/` or consuming stylesheets.
> 3. **Avoid Hardcoded Dimensions:** When adjusting spacing or borders, pass design tokens (e.g. `@include p(var(--size-md));`) rather than hardcoded pixel/rem units to preserve density responsiveness.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 4-layer design token system and scale primitives.
- [`theming`](./theming.md) — Dark mode and scoped theme islands.
- [`density`](./density.md) — Density modes (`compact`, `spacious`) and runtime scaling.
- [`layout`](./layout.md) — Layout grid and flexbox recipes.
- [`cards`](./cards.md) — Card container styling.
- [`forms`](./forms.md) — Form layout, input controls, and validation states.
- [`tables`](./tables.md) — Table layouts and responsive overflow.
- [`scss-architecture`](../doctrine/scss-architecture.md) — Governing SCSS architecture and two-layer design doctrine.
