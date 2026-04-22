# Breakpoints

File: `scss/config/_breakpoints.scss`. Added in v1.1.

ln-acme uses two independent breakpoint vocabularies: **app-shell
media breakpoints** (for `@media`) and **container-query breakpoints**
(for `@container`). See `ln-acme-container-queries.md` for when to
use which.

## Mixin API (preferred)

Use the mixins — they resolve from the breakpoint tokens, no px
literals in components or utilities.

```scss
@use 'ln-acme/scss/config/mixins' as *;

// Media queries (app shell)
@include mq-up(md)    { ... }   // min-width: 768px
@include mq-down(lg)  { ... }   // max-width: 1023px

// Container queries (components)
@include cq-up(medium, page-header)   { ... }   // @container page-header (min-width: 880px)
@include cq-down(medium, page-header) { ... }   // @container page-header (max-width: 879px)
@include cq-up(compact)               { ... }   // anonymous — targets nearest container
```

Names resolve against a unified `$breakpoints` map covering both
scales. Keys: `sm md lg xl 2xl 3xl` (media), `narrow compact medium
wide` (container). Unknown keys raise `@error`.

**Anonymous container queries** — omit the container name to target
the nearest containerized ancestor. Useful when the consumer owns
the container registration.

Direct Sass variables (`$bp-md`, `$cq-medium`) and CSS custom
properties (`--bp-md`, `--cq-medium`) remain available. Prefer the
mixins inside components.

---

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
