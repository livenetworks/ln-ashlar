# Design Tokens

CSS custom properties defined in `scss/config/_tokens.scss`. All design values are semantic.

## Colors
```css
--color-primary          /* Brand primary */
--color-primary-hover    /* Primary hover state */
--color-primary-light    /* Primary light (focus rings) */
--color-error            /* Error / danger */
--color-error-hover
--color-success          /* Success / green */
--color-warning          /* Warning / yellow */
--color-text-primary     /* Main text */
--color-text-secondary   /* Secondary text */
--color-text-muted       /* Muted/disabled text */
--color-bg-primary       /* Card/panel background */
--color-bg-secondary     /* Header/footer background */
--color-bg-body          /* Page background */
--color-border           /* Default border */
```

## Spacing
```css
--spacing-xs    /* 0.5rem */
--spacing-sm    /* 0.75rem */
--spacing-md    /* 1rem */
--spacing-lg    /* 1.5rem */
--spacing-xl    /* 2rem */
```

## Typography
```css
--text-xs / --text-sm / --text-base / --text-lg / --text-xl / --text-2xl
--font-normal / --font-medium / --font-semibold / --font-bold
--font-sans / --font-mono
```

## Border Radius
```css
--radius-sm / --radius-md / --radius-lg / --radius-xl / --radius-full
```

## Shadows
```css
--shadow-none / --shadow-sm / --shadow-md / --shadow-lg / --shadow-xl
```

## Z-Index
```css
--z-dropdown / --z-sticky / --z-overlay / --z-modal / --z-toast
```

## Transitions
```css
--transition-base    /* Default timing */
--transition-fast    /* Fast timing */
```

## Naming Convention

Token names are always semantic (by function), never by color:
```css
/* Correct */
--color-primary: #2737a1;
--color-error: #dc2626;

/* Wrong */
--color-blue: #2737a1;
--color-red: #dc2626;
```
