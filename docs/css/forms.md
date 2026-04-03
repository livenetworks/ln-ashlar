# Forms & Buttons

File: `scss/components/_forms.scss`.

## Inputs

All `input`, `textarea`, `select` are styled globally with border, rounded-md, focus ring. Full width by default.

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
| **Filled** (default) | Automatic | Gray bg, colored bg on checked, input hidden |
| **Outline** | `@include pill-outline` on parent | Bordered, visible input indicator |

```scss
// Switch to outline on a parent container
#my-form fieldset { @include pill-outline; }

// Color per context
#role-field { --color-primary: var(--color-secondary); }
```

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
