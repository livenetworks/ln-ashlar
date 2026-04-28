# Theming

File: `scss/config/_theme.scss`. Added in v1.1.

## Philosophy

ln-ashlar supports a dark-mode variant plus any number of consumer-defined
themes. Themes are a **palette layer** — they rebind vocabulary tokens at
theme `:root`. They never override component structure via descendant
selectors at higher specificity.

Consumer projects can re-theme at any scope by rebinding primitives or
vocabulary:

```scss
// Tenant-specific primary color
.tenant-acme { --color-primary: 340 75% 52%; }

// Section-specific surface override (rebind primitive on scope)
.print-preview { --color-bg: var(--bg-base); }
```

## Dark mode activation

Three activation paths; any of them enables dark:

### 1. Explicit attribute (always wins)

```html
<html data-theme="dark">
```

User preference stored client-side (`localStorage`, cookie, etc.).
Library does not persist preference; consumer does.

### 2. System preference (auto)

```html
<html>
```

When the OS is in dark mode and no `data-theme` attribute is set,
ln-ashlar automatically applies dark tokens via
`@media (prefers-color-scheme: dark)`.

### 3. Opt-out of auto

```html
<html data-theme="light">
```

Forces light mode even on a dark-system device. Use when the user
has explicitly chosen light.

## Consumer toggle example

See `demo/admin/index.html` for a minimal vanilla JS toggle. Key
points:

```javascript
// Read current effective theme
const current = document.documentElement.getAttribute('data-theme') ||
	(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Force a specific theme
document.documentElement.setAttribute('data-theme', 'dark');

// Clear override (return to system preference)
document.documentElement.removeAttribute('data-theme');
```

## What dark mode overrides

Dark mode rebinds **vocabulary** tokens at theme `:root`. Primitives
wire to vocabulary, so every consumer mixin adapts automatically without
any per-component dark declarations.

```scss
[data-theme="dark"] {
	// Background vocabulary
	--bg-base:     hsl(220 16% 13%);
	--bg-elevated: hsl(220 16% 17%);
	--bg-sunken:   hsl(220 16% 20%);
	--bg-recessed: hsl(220 16%  9%);

	// Foreground vocabulary
	--fg-default: hsl(0 0% 95%);
	--fg-muted:   hsl(220  9% 60%);
	--fg-subtle:  hsl(218 11% 52%);

	// Border vocabulary
	--border-subtle:       hsl(220 14% 20%);
	--border-strong:       hsl(220 13% 36%);
	--border-strong-hover: hsl(218 11% 52%);

	// Shadows — solid black, higher alpha
	--shadow-resting:  var(--shadow-sm);
	--shadow-floating: var(--shadow-md);
	--shadow-overlay:  var(--shadow-xl);

	// Primary tints
	--color-primary-light:   232 60% 22%;
	--color-primary-lighter: 232 50% 15%;
}
```

Primitives (`--color-bg`, `--color-fg`, `--color-border`, `--shadow`)
wire to vocabulary at `:root`. A dark rebind of `--bg-base` shifts
`--color-bg` for every mixin that reads it — no further changes needed.

## Theming via vocabulary rebind

For consumer themes (tenant brand, contrast variant, marketing landing),
rebind vocabulary tokens at the theme `:root` scope:

```scss
[data-theme="contrast"] {
	// Background vocabulary
	--bg-base:       hsl(0 0% 100%);
	--bg-elevated:   hsl(0 0% 100%);
	--bg-sunken:     hsl(0 0% 92%);
	--bg-recessed:   hsl(0 0% 85%);

	// Foreground vocabulary
	--fg-default:    hsl(0 0% 0%);
	--fg-muted:      hsl(0 0% 20%);

	// Border vocabulary
	--border-strong: hsl(0 0% 0%);
}
```

Why rebind vocabulary, not primitives: vocabulary is the palette layer.
When a theme rebinds `--bg-recessed`, every component that reads
`--color-bg` (after rebinding it to `--bg-recessed` on its own scope)
adapts — no per-component override needed.

**Never use descendant selectors at higher specificity:**

```scss
// WRONG — specificity hack, locks theme into redeclaring library structure
[data-theme="contrast"] .card {
	background: hsl(0 0% 100%);
	border-color: hsl(0 0% 0%);
}

// RIGHT — rebind vocabulary at theme :root; library reads it
[data-theme="contrast"] {
	--bg-base:       hsl(0 0% 100%);
	--border-strong: hsl(0 0% 0%);
}
```

## What dark mode does NOT override

- **Primary hue** — stays the same brand color.
- **Status hues** (success, error, warning, info) — stay the same.
- **Typography** — same scale.
- **Spacing / layout** — identical.

## Per-component dark tuning

**You should not need it.** If a component looks wrong in dark mode,
the bug is almost always a hardcoded color somewhere — it should
reference a vocabulary token via the primitive. Only fall back to
per-component dark overrides for genuinely unique cases (e.g., a hero
illustration with baked-in shadows).

## Extending

Custom theme — rebind vocabulary at theme `:root`:

```scss
[data-theme="high-contrast"] {
	--fg-default: hsl(0 0% 100%);
	--bg-base:    hsl(0 0% 0%);
	--border-strong: hsl(0 0% 100%);
}
```

Or tenant branding (rebind the semantic primitive):

```scss
.tenant-acme {
	--color-primary: 340 75% 52%;
	--color-primary-hover: 340 75% 42%;
}
```

## Accessibility

- Body text ≥ 7:1 (AAA)
- Secondary text ≥ 4.5:1 (AA)
- Focus ring ≥ 3:1 non-text (WCAG 1.4.11)

The default dark vocabulary rebind clears all three. Custom themes must
re-verify with a contrast checker.
