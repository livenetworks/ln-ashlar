# Typography

Files:
- `scss/config/_tokens.scss` — role and tracking tokens
- `scss/config/mixins/_typography.scss` — `text-*` primitives + `typography($role)` mixin
- `scss/base/_typography.scss` — default heading and paragraph styling

## Two layers

ln-acme typography has two layers:

1. **Primitives** — `text-xs`, `text-sm`, `text-base`, `text-lg`,
   `text-xl`, `text-2xl`. Plain font-size + line-height mixins. Use
   when the intent is literally "make this 14px".

2. **Semantic roles (v1.1)** — `typography(<role>)`. Use when the
   intent is "this is a page title" or "this is a form label". The
   role determines the size; the size is a design decision, not a
   caller decision.

**Projects should prefer roles.** Primitives stay as escape hatches.

## Role selection guide

| Context | Role |
|---|---|
| Hero / marketing headline | `display-lg`, `display-md` |
| Page title (`h1`) | `display-sm` |
| Section headline (`h2`) | `heading-md` |
| Subsection (`h3`) | `heading-sm` |
| Card title (`h4`) | `title-md` |
| Strong body lead (`h5`) | `title-sm` |
| Form label (`h6`, `<label>`) | `label-md` |
| Standard body copy | `body-md` |
| Helper text / hints | `body-sm` |
| Meta / timestamps | `caption` |

## Usage

```scss
@use 'ln-acme/scss/config/mixins' as *;

.document-title { @include typography(display-sm); @include font-bold; }
.meta           { @include typography(caption); @include text-muted; }
.form-field label { @include typography(label-md); }
```

## Letter spacing

| Token | Value | Use |
|---|---|---|
| `--tracking-tight` | -0.025em | Display / heading sizes |
| `--tracking-normal` | 0 | Body |
| `--tracking-wide` | 0.025em | Uppercase labels, badges |

## Tabular numerals

As of v1.1, `table-base` sets `font-variant-numeric: tabular-nums` so
numeric columns align vertically by default. Apply manually elsewhere:

```scss
.kpi-value { font-variant-numeric: tabular-nums; }
```

## Defaults

`scss/base/_typography.scss` maps `h1`–`h6` to role tokens so
unstyled HTML is correct out of the box. Consuming projects can
override per-page with their own `@include typography(...)` calls.
