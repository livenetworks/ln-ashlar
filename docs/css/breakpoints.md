# Breakpoints

File: `scss/config/_breakpoints.scss`. Added in v1.1.

ln-acme uses two independent breakpoint vocabularies: **app-shell
media breakpoints** (for `@media`) and **container-query breakpoints**
(for `@container`). See `ln-acme-container-queries.md` for when to
use which.

## App-shell media breakpoints

Use for global layout structure only — header, sidebar, page columns.
Never for components.

| Sass variable | CSS variable | Value |
|---|---|---|
| `$bp-sm` | `--bp-sm` | 480px |
| `$bp-md` | `--bp-md` | 768px |
| `$bp-lg` | `--bp-lg` | 1024px |
| `$bp-xl` | `--bp-xl` | 1280px |
| `$bp-2xl` | `--bp-2xl` | 1536px |
| `$bp-3xl` | `--bp-3xl` | 1920px |

```scss
@use 'ln-acme/scss/config/breakpoints' as *;

.app-shell {
	display: grid;
	grid-template-columns: 1fr;

	@media (min-width: $bp-md) {
		grid-template-columns: 16rem 1fr;
	}
}
```

## Container-query breakpoints

Use for components. The component declares a container context on its
parent; children query their own width via `@container`.

| Sass variable | CSS variable | Value | Typical use |
|---|---|---|---|
| `$cq-narrow` | `--cq-narrow` | 480px | 1→2 columns in tight containers |
| `$cq-compact` | `--cq-compact` | 580px | 1→2 columns (standard) |
| `$cq-medium` | `--cq-medium` | 880px | 2→3 columns |
| `$cq-wide` | `--cq-wide` | 1120px | 3→4 columns |

```scss
@use 'ln-acme/scss/config/breakpoints' as *;

#folders { @include container(foldersgrid); }

#folders > ul {
	display: grid;
	grid-template-columns: 1fr;

	@container foldersgrid (min-width: $cq-compact) {
		grid-template-columns: repeat(2, 1fr);
	}
	@container foldersgrid (min-width: $cq-medium) {
		grid-template-columns: repeat(3, 1fr);
	}
}
```

## JS consumption

All breakpoints are also exposed as CSS custom properties at `:root`
so JavaScript can read them without hardcoding numbers:

```javascript
const bpMd = parseInt(
	getComputedStyle(document.documentElement)
		.getPropertyValue('--bp-md')
);
```

## Rules

- **Never hardcode breakpoint pixel values** in components. Use the
  variables.
- **Never use `@media` for components.** Components are portable — use
  `@container`. Media queries are reserved for the app shell.
- **Do not combine `container-type: inline-size` with `overflow:
  hidden`** — they break containment.
