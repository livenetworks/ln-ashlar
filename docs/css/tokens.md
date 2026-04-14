# Design Tokens

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
--color-success:      142 76% 36%;
--color-error:        0 84% 50%;
--color-error-hover:  0 74% 42%;
--color-warning:      32 95% 44%;
--color-info:         217 91% 60%;
```

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
--color-text-primary:   221 39% 11%;   /* Main text */
--color-text-secondary: 220 9%  46%;   /* Secondary text */
--color-text-muted:     218 11% 65%;   /* Muted / disabled */
```

### Backgrounds
```css
--color-white:        0 0% 100%;
--color-bg-primary:   0 0% 100%;       /* Cards, panels */
--color-bg-secondary: 220 20% 97%;     /* Headers, footers, alternating rows */
--color-bg-body:      220 27% 96%;     /* Page background */
--color-bg-error:     0 86% 97%;       /* Error state background */
```

### Borders
```css
--color-border:       220 13% 91%;
--color-border-light: 220 14% 95%;     /* Softer variant */
```

### Table-specific
```css
--color-table-header-bg:   220 14% 91%;
--color-table-header-text: 221 39% 11%;
--color-table-section-bg:  216 22% 88%;
```

---

## Spacing

| Token | Value | px |
|-------|-------|----|
| `--spacing-xs` | 0.25rem | 4px |
| `--spacing-sm` | 0.5rem | 8px |
| `--spacing-md` | 1rem | 16px |
| `--spacing-lg` | 1.5rem | 24px |
| `--spacing-xl` | 2rem | 32px |
| `--spacing-2xl` | 3rem | 48px |

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
| `--spacing-2xs` | 2px | Tight gaps inside compound components (icon-next-to-text) |
| `--spacing-3xl` | 4rem | Section separators on large dashboards |
| `--spacing-4xl` | 6rem | Hero layouts |
| `--spacing-5xl` | 8rem | Page-level hero spacing |

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
