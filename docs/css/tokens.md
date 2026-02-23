# Design Tokens

CSS custom properties defined in `scss/config/_tokens.scss`. All design values are semantic.

For the full SCSS mixin reference, see [mixins.md](mixins.md).

## Colors

### Primary
```css
--color-primary: #2737a1;
--color-primary-hover: #1e2b82;
--color-primary-focus: #3246c8;
--color-primary-light: #e6eafa;
--color-primary-lighter: #f5f6fc;
```

### Secondary
```css
--color-secondary: #10b981;
--color-secondary-hover: #059669;
```

### Status
```css
--color-success: #16a34a;
--color-error: #dc2626;
--color-error-hover: #b91c1c;
--color-warning: #d97706;
--color-info: #3b82f6;
```

### Text
```css
--color-text-primary: #111827;     /* Main text */
--color-text-secondary: #6b7280;   /* Secondary text */
--color-text-muted: #9ca3af;       /* Muted/disabled text */
```

### Backgrounds
```css
--color-bg-primary: #ffffff;       /* Cards, panels */
--color-bg-secondary: #f3f4f6;    /* Headers, footers, alternating */
--color-bg-body: #f4f4f5;         /* Page background */
--color-bg-error: #fef2f2;        /* Error state background */
```

### Borders
```css
--color-border: #e5e7eb;
--color-border-light: #e5e7eb;
```

### Table
```css
--color-table-header-bg: #1a1a2e;
--color-table-header-text: #ffffff;
--color-table-section-bg: #e8ecf1;
```

## Spacing

| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-xs` | 0.25rem | 4px |
| `--spacing-sm` | 0.5rem | 8px |
| `--spacing-md` | 1rem | 16px |
| `--spacing-lg` | 1.5rem | 24px |
| `--spacing-xl` | 2rem | 32px |
| `--spacing-2xl` | 3rem | 48px |

## Typography

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

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
```

## Border Radius

| Token | Value | Pixels |
|-------|-------|--------|
| `--radius-sm` | 0.25rem | 4px |
| `--radius-md` | 0.5rem | 8px |
| `--radius-lg` | 0.75rem | 12px |
| `--radius-xl` | 1rem | 16px |
| `--radius-full` | 9999px | circle |

## Shadows

| Token | Value |
|-------|-------|
| `--shadow-none` | none |
| `--shadow-sm` | 0 1px 2px 0 rgba(0,0,0,0.05) |
| `--shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) |
| `--shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1) |
| `--shadow-primary` | 0 0 20px rgba(39,55,161,0.2) |

## Z-Index

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

## Transitions

| Token | Value |
|-------|-------|
| `--transition-base` | 0.3s ease |
| `--transition-fast` | 0.15s ease |

## Naming Convention

Token names are always **semantic** (by function), never by color:
```css
/* Correct */
--color-primary: #2737a1;
--color-error: #dc2626;

/* Wrong */
--color-blue: #2737a1;
--color-red: #dc2626;
```
