# Forms & Buttons

File: `scss/components/_form.scss`.

## Inputs

All `input`, `textarea`, `select` are styled globally with border, rounded-md, focus ring. Full width by default.

## Icon Groups

A `<label>` wrapping one or more `<svg class="ln-icon">` plus an
`<input>` — the icon(s) sit inline with the field (search magnifier,
clear button, leading or trailing affordances). The `<label>` becomes
the visual container; the nested `<input>` strips its own chrome so the
wrapper owns border, padding, and focus ring.

```html
<label>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg>
    <input type="search" placeholder="Search…">
</label>
```

Applied via `@include form-input-icon-group` on a semantic selector — no
class needed on the `<label>`.

### Vertical rhythm decision

Icon-group inputs use a tighter line-height than a standalone
`form-input`. This is deliberate: `form-input` inherits the body leading
tuned for prose readability, which leaves visible leading above and
below the glyph inside a single-line control and makes the icon-group
feel airy once combined with the wrapper's padding. Icon groups are
inline composition, not prose — they are tuned for density.

The trade-off: icon groups look compact and sit closer to the
surrounding label/value rhythm; standalone inputs stay comfortable for
long-form typing. Concrete values live in the mixin at
`scss/config/mixins/_form.scss`.

## Focus Indicators

The default focus style is `@include focus-ring` — a soft outer glow applied automatically in `_global.scss`. No action needed for standard forms.

To switch the focus style for a form or section, override `:focus-visible` in project SCSS:

```scss
// Switch to structural border for a settings panel:
#settings-form input:focus-visible,
#settings-form select:focus-visible,
#settings-form textarea:focus-visible {
    @include focus-border-thicken;
}

// Error state always uses error color, regardless of active preset:
#settings-form input.error:focus-visible {
    @include focus-border-thicken(var(--color-error));
}
```

| Preset | Signal | Use when |
|--------|--------|----------|
| `focus-ring` | Outer glow (default) | General purpose, agnostic |
| `focus-border-thicken` | 2px outline, no glow | Dense / enterprise UI |
| `focus-combination` | Border + ring | Accessibility-first |
| `focus-background-shift` | Light primary tint | Minimalist, inside bordered containers |
| `focus-accent-line` | Bottom border only | Inside cards / panels with their own border |
| `focus-inset-shadow` | Inner shadow | Tactile UI with consistent depth language |

> See `docs/css/mixins.md` for full per-preset examples .

## Form Layout

Forms use CSS Grid + `<div class="form-element">` with explicit `for`/`id` association.

```html
<form id="my-form">
  <div class="form-element">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
    <ul data-ln-validate-errors></ul>
  </div>
  <div class="form-element">
    <label for="notes">Notes</label>
    <textarea id="notes" name="notes"></textarea>
  </div>
  <ul class="form-actions">
    <li><button type="button">Cancel</button></li>
    <li><button type="submit">Save</button></li>
  </ul>
</form>
```

```scss
#my-form {
  @include form-grid;

  .form-element:nth-child(1) { grid-column: span 3; }
  .form-element:nth-child(2) { grid-column: span 6; }
  .form-actions { grid-column: span 6; }
}
```

### Rules

- Root: `<form id="...">` styled with `@include form-grid` (6 cols, 1 col on mobile)
- Children: `<div class="form-element">` wrapping `<label for="...">` + `<input id="...">`
- Explicit association: `for`/`id` on label/input (NOT wrapping label)
- **Use `<div>`, NOT `<p>`** — `<ul data-ln-validate-errors>` inside `<p>` is invalid HTML; browser ejects the `<ul>` as a stray grid item, breaking the layout
- Grid spans: `.form-element { grid-column: span 3; }` in SCSS
- Errors: `<ul data-ln-validate-errors>` inside `.form-element` (valid only with `<div>`)
- `.form-actions` is a `<ul>` component class — stays in HTML, gets `grid-column: span 6` in SCSS; `@include form-actions` resets `list-style: none; padding: 0`

## Pill Labels (Checkbox / Radio)

Checkbox/radio pills use `<ul> > <li> > <label>` — grouped, border-radius on first/last.

```html
<ul>
  <li><label><input type="radio" name="role" value="admin"> Admin</label></li>
  <li><label><input type="radio" name="role" value="editor" checked> Editor</label></li>
  <li><label><input type="radio" name="role" value="external"> External</label></li>
</ul>
```

### Two Styles

| Style | How | Description |
|-------|-----|-------------|
| **Filled** (default) | `@include pill` on label (standalone) | Gray bg, colored bg on checked, input hidden |
| **Outline** | `@include pill-outline` on label (standalone) | Bordered, visible input indicator |

```scss
// Outline: standalone on label
#my-form label { @include pill-outline; }

// Color per context
#role-field { --color-primary: var(--color-secondary); }
```

## Check List (Vertical)

The vertical sibling of pill groups. Same `<ul> > <li> > <label> > <input>`
markup, but stacked instead of joined horizontally — each label stands
on its own row. Use for filter panels, settings lists, or any
multi-select that reads top-to-bottom rather than as a horizontal
segmented control.

```html
<ul>
  <li><label><input type="checkbox" name="dept" value="sales"> Sales</label></li>
  <li><label><input type="checkbox" name="dept" value="eng"> Engineering</label></li>
  <li><label><input type="checkbox" name="dept" value="support"> Support</label></li>
</ul>
```

### Two styles

| Style | Mixin | Description |
|-------|-------|-------------|
| **Filled** | `@include check-list` | Gray bg, colored bg on checked, input hidden |
| **Outline** | `@include check-list-outline` | Bordered, visible input indicator |

```scss
// Project SCSS — apply on the <ul>
#dept-filter { @include check-list-outline; }
```

`check-list` extends `check-list-outline` with filled backgrounds, in
the same layered way `pill` extends `pill-outline`. Color overrides and
input-visibility rules match the pill variants — the only difference is
layout direction.

## Buttons

Three tiers — all structure is inherited globally, no class needed for tiers 1 and 2.

| Tier | Element | How | When |
|------|---------|-----|------|
| **1 — Neutral** | `<button type="button">` | Global `_global.scss` | Cancel, close, toggle, icon |
| **2 — Primary** | `<button type="submit">` | Global `_global.scss` | Save, confirm |
| **3 — Action** | any button | `@include btn` on semantic selector | Non-submit action buttons |

```html
<!-- Tier 1 — neutral, no class needed -->
<button type="button">Cancel</button>

<!-- Tier 2 — primary, no class needed -->
<button type="submit">Save</button>

<!-- Tier 3 — non-submit action via project SCSS -->
<button id="add-user">Add</button>
```

```scss
// Project SCSS — Tier 3
#add-user   { @include btn; }
#delete-user { @include btn; --color-primary: var(--color-error); }
```

- **Color change**: override `--color-primary` on element or parent; ALL states (hover, active, focus) adapt automatically
- **No `btn--*` variant classes** — projects define their own via `--color-primary` override
- **No `translateY` or `box-shadow` on hover** — color change only
- **Size modifiers**: `@include btn-sm` / `@include btn-lg` alongside `@include btn`
- `.form-actions` — right-aligned button container, `grid-column: span 6` in form grid
