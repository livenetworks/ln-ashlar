# Theming

File: `scss/config/_theme.scss`. Added in v1.1.

## Philosophy

ln-acme v1.1 supports a single dark-mode variant plus any number of
consumer-defined themes. Dark mode is built by **inverting the
neutral scale** — every semantic token references
`var(--color-neutral-*)`, so flipping the scale flips every downstream
token automatically.

Consumer projects can re-theme at any scope:

```scss
// Tenant-specific primary color
.tenant-acme { --color-primary: 340 75% 52%; }

// Section-specific neutral override
.print-preview { --color-bg-body: var(--color-neutral-100); }
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
ln-acme automatically applies dark tokens via
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

- **Neutral scale:** all 11 steps (`50` → `900`), inverted.
- **Surface elevation:** `--color-bg-body`, `--color-bg-primary`,
  `--color-bg-secondary`, `--color-border-light`. These are
  re-stated explicitly (not cascaded) because light-mode
  elevation uses `--color-white` as the top layer, and the
  light-to-dark ladder direction cannot be expressed by a
  single neutral-scale inversion. Dark mode encodes its own
  elevation ladder: `bg-body` (9%) < `bg-primary` (13%) <
  `bg-secondary` (17%).
- **Primary tint layers:** `--color-primary-light`, `--color-primary-lighter`.
- **Error background:** `--color-bg-error`.
- **Shadows:** solid black, higher alpha.

All other semantic tokens (`--color-text-primary`, `--color-border`,
etc.) reference the neutral scale and flip automatically.

## What dark mode does NOT override

- **Primary hue** — stays the same brand color.
- **Status hues** (success, error, warning, info) — stay the same.
- **Typography** — same scale.
- **Spacing / layout** — identical.

## Per-component dark tuning

**You should not need it.** If a component looks wrong in dark mode,
the bug is almost always a hardcoded color somewhere in the
component — it should reference a token instead. Only fall back to
per-component dark overrides for genuinely unique cases (e.g., a
hero illustration with baked-in shadows).

## Extending

Custom theme:

```scss
[data-theme="high-contrast"] {
	--color-neutral-900: 0 0% 100%;
	--color-neutral-50:  0 0% 0%;
	--color-border:      var(--color-neutral-900);
}
```

Or tenant branding:

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

The default neutral-900/50 flip clears all three. Custom themes must
re-verify with a contrast checker.
