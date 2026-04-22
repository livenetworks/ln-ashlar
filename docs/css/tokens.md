# Design Tokens

> **Theming:** see `docs/css/theming.md` for dark mode and
> consumer theme extensions.

CSS custom properties defined in `scss/config/_tokens.scss`. Single source of truth for all design values.

## How to use

Colors are stored as **bare HSL triplets** — this enables alpha transparency:

```css
/* Solid color */
background-color: hsl(var(--color-primary));

/* With transparency */
background-color: hsl(var(--color-primary) / 0.5);

/* Theming — override at any scope */
.dark-section { --color-bg-primary: 240 14% 15%; }
#alert-panel   { --color-primary: var(--color-error); }
```

---

## Colors

### Primary
```css
--color-primary:        232 75% 52%;   /* Brand blue */
--color-primary-hover:  232 75% 42%;
--color-primary-focus:  232 75% 60%;
--color-primary-light:  232 75% 93%;   /* Active nav, focus rings */
--color-primary-lighter: 232 75% 97%;
```

### Secondary
```css
--color-secondary:       160 76% 40%;  /* Green */
--color-secondary-hover: 162 93% 31%;
```

### Status
```css
--color-success:         142 76% 36%;
--color-success-hover:   142 76% 26%;
--color-success-focus:   142 76% 44%;
--color-success-light:   142 76% 93%;
--color-success-lighter: 142 76% 97%;

--color-error:           0 84% 50%;
--color-error-hover:     0 74% 42%;
--color-error-focus:     0 84% 58%;
--color-error-light:     0 84% 93%;
--color-error-lighter:   0 84% 97%;

--color-warning:         32 95% 44%;
--color-warning-hover:   32 95% 34%;
--color-warning-focus:   32 95% 52%;
--color-warning-light:   32 95% 93%;
--color-warning-lighter: 32 95% 97%;

--color-info:            217 91% 60%;
--color-info-hover:      217 91% 50%;
--color-info-focus:      217 91% 68%;
--color-info-light:      217 91% 93%;
--color-info-lighter:    217 91% 97%;
```

### Status color overrides

To change a component's status color, prefer the library helper classes (`.success`, `.warning`, `.error`, `.info`) which cascade all sibling tokens (`-hover`, `-focus`, `-light`, `-lighter`). If you override `--color-primary` directly on a selector, remember to also override its siblings to keep hover/focus/tint states in the variant color family.

### Neutral scale (v1.1)

The canonical grey layer. All semantic colors (text, background,
border, table) reference this scale. Dark mode inverts the scale
in-place (Phase 6).

| Token | Value | Maps to |
|---|---|---|
| `--color-neutral-50` | `220 20% 98%` | `bg-secondary` (lightest surface) |
| `--color-neutral-100` | `220 16% 96%` | `bg-body`, `border-light` |
| `--color-neutral-150` | `220 14% 93%` | `table-section-bg` (intermediate) |
| `--color-neutral-200` | `220 13% 91%` | `border`, `table-header-bg` |
| `--color-neutral-300` | `220 13% 83%` | disabled field borders |
| `--color-neutral-400` | `218 11% 65%` | `text-muted`, placeholder |
| `--color-neutral-500` | `220  9% 46%` | `text-secondary`, helper text |
| `--color-neutral-600` | `220 11% 34%` | strong secondary text |
| `--color-neutral-700` | `220 14% 24%` | strong body text |
| `--color-neutral-800` | `220 20% 15%` | heading text (dark-on-light) |
| `--color-neutral-900` | `221 39% 11%` | `text-primary` (maximum contrast) |

**Why stored as bare HSL triplets:** enables alpha transparency via
`hsl(var(--color-neutral-900) / 0.5)`.

### Text
```css
--color-text-primary:   var(--color-neutral-900);  /* Main text */
--color-text-secondary: var(--color-neutral-500);  /* Secondary text */
--color-text-muted:     var(--color-neutral-400);  /* Muted / disabled */
```

### Backgrounds
```css
--color-white:        0 0% 100%;
--color-bg-primary:   var(--color-white);          /* Cards, panels */
--color-bg-secondary: var(--color-neutral-50);     /* Headers, footers, alternating rows */
--color-bg-body:      var(--color-neutral-100);    /* Page background */
--color-bg-error:     0 86% 97%;                   /* Error state background */
```

### Borders
```css
--color-border:       var(--color-neutral-200);
--color-border-light: var(--color-neutral-100);    /* Softer variant */
```

### Table-specific
```css
--color-table-header-bg:   var(--color-neutral-200);
--color-table-header-text: var(--color-neutral-900);
--color-table-section-bg:  var(--color-neutral-150);
```

---

## Spacing

| Token | Value | px |
|-------|-------|----|
| `--size-0` | 0 | 0px |
| `--size-2xs` | 0.125rem | 2px |
| `--size-xs` | 0.25rem | 4px |
| `--size-xs-up` | 0.375rem | 6px |
| `--size-sm` | 0.5rem | 8px |
| `--size-sm-up` | 0.625rem | 10px |
| `--size-md` | 1rem | 16px |
| `--size-md-up` | 1.25rem | 20px |
| `--size-lg` | 1.5rem | 24px |
| `--size-xl` | 2rem | 32px |
| `--size-2xl` | 3rem | 48px |
| `--size-3xl` | 4rem | 64px |

---

## Border

```css
--border-width: 1px;
```

| Token | Value | px |
|-------|-------|----|
| `--radius-sm` | 0.25rem | 4px |
| `--radius-md` | 0.5rem | 8px |
| `--radius-lg` | 0.75rem | 12px |
| `--radius-xl` | 1rem | 16px |
| `--radius-full` | 9999px | circle |

---

## Shadows

| Token | Value |
|-------|-------|
| `--shadow-none` | none |
| `--shadow-xs` | `0 1px 2px 0 rgba(0,0,0,0.05)` |
| `--shadow-sm` | `0 1px 3px 0 …, 0 1px 2px -1px …` |
| `--shadow-md` | `0 4px 6px -1px …, 0 2px 4px -2px …` |
| `--shadow-lg` | `0 10px 15px -3px …, 0 4px 6px -4px …` |
| `--shadow-xl` | `0 20px 25px -5px …, 0 8px 10px -6px …` |
| `--shadow-primary` | `0 0 20px hsl(var(--color-primary) / 0.2)` |

### Shadow scale (v1.1)

All shadows use `hsl(220 40% 15% / alpha)` as the base — gives a faint
cool tint that reads as modern/expensive on daylight backgrounds.

| Token | Layers | Use |
|---|---|---|
| `--shadow-none` | — | Reset |
| `--shadow-xs` | 1 | Hairline lift (subtle cards) |
| `--shadow-sm` | 2 | Cards, dropdowns |
| `--shadow-md` | 2 | Floating panels, popovers |
| `--shadow-lg` | 2 | Modals, toast |
| `--shadow-xl` | 2 | Full-screen overlays |
| `--shadow-2xl` | 2 | Hero elevation |
| `--shadow-inner` | 1 | Depressed state (active, selected) |
| `--shadow-primary` | 1 | Primary-tinted glow (CTA emphasis, focus halo) |
| `--shadow-success` | 1 | Success-tinted glow |
| `--shadow-error` | 1 | Error-tinted glow |

**Do not use hover shadows on buttons.** Buttons change colour only
(`CLAUDE.md` § Button Architecture).

### Focus ring (v1.1)

`@include focus-ring($color: var(--color-primary))` produces a
three-layer halo:

1. 2px inner ring in `--color-bg-primary` — visual separator
2. 2px middle ring in `$color` at 60% alpha — main signal
3. 2px outer glow in `$color` at 15% alpha — soft halo

Error variant: `@include focus-ring(var(--color-error))`.

The v1.0 `$width` argument has been removed — the three-layer halo is
always 6px total. Projects that need a different thickness can use
`focus-combination`, `focus-inset-shadow`, or write a custom mixin.

---

## Transitions

| Token | Value |
|-------|-------|
| `--transition-fast` | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-base` | `0.2s cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-slow` | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
```

| Token | Value | px |
|-------|-------|----|
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

---

## Z-Index

```
toast (50) > modal (40) > overlay (30) > dropdown (20) > sticky (10)
```

| Token | Value |
|-------|-------|
| `--z-sticky` | 10 |
| `--z-dropdown` | 20 |
| `--z-overlay` | 30 |
| `--z-modal` | 40 |
| `--z-toast` | 50 |

---

## Naming convention

Token names are always **semantic** (by function), never by color:

```css
/* Correct */
--color-primary: 232 75% 52%;
--color-error:   0 84% 50%;

/* Wrong */
--color-blue: 232 75% 52%;
--color-red:  0 84% 50%;
```

---

## v1.1 Additions

### Spacing (extended)

| Token | Value | Use |
|---|---|---|
| `--size-2xs` | 2px | Tight gaps inside compound components (icon-next-to-text) |
| `--size-3xl` | 4rem | Section separators on large dashboards |

### Content widths

| Token | Value | Use |
|---|---|---|
| `--max-w-prose` | 65ch | Rich-text article / TipTap output |
| `--max-w-form` | 32rem | Auth forms, short settings panels |
| `--max-w-content` | 48rem | Standard content column |
| `--max-w-container` | 80rem | Outer page container |

### Easings (curves only)

| Token | Curve | Use |
|---|---|---|
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default UI motion |
| `--easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations (modal open) |
| `--easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations (modal close) |
| `--easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Springy emphasis (nav underline, success check) |

### Border widths

| Token | Value | Use |
|---|---|---|
| `--border-width-strong` | 2px | Emphasis borders (active pill, focus inner ring) |

### Breakpoints

See `docs/css/breakpoints.md`.

### Motion safety

See `docs/css/motion.md` (added in v1.1 Phase 5).

### Typography roles (v1.1)

Semantic layer on top of the existing `text-*` primitives. Use when
the intent is "this is a page title" or "this is a helper label",
not "this is 14px text".

| Role | Size | Line-height | Use |
|---|---|---|---|
| `display-lg` | 3.75rem | 1.1 | Hero page headline |
| `display-md` | 3rem | 1.1 | Large page headline |
| `display-sm` | 2.25rem | 1.15 | `h1` default |
| `heading-lg` | 1.875rem | 1.2 | Section headline |
| `heading-md` | 1.5rem | 1.25 | `h2` default |
| `heading-sm` | 1.25rem | 1.3 | `h3` default |
| `title-md` | 1.125rem | 1.4 | `h4` default, card title |
| `title-sm` | 1rem | 1.4 | `h5` default, strong body lead |
| `body-lg` | 1.125rem | 1.6 | Emphasis paragraph |
| `body-md` | 1rem | 1.6 | Standard body (default `p`) |
| `body-sm` | 0.875rem | 1.5 | Secondary body, helper text |
| `label-md` | 0.875rem | 1.4 | `h6`, form label |
| `label-sm` | 0.75rem | 1.4 | Small label, meta |
| `caption` | 0.75rem | 1.4 | Captions, timestamps |

**Mixin:** `@include typography(<role>)`

See `typography.md` for full usage and role-selection guide.
