# Forms & Buttons

File: `scss/components/_forms.scss`.

## Inputs

All `input`, `textarea`, `select` are styled globally with border, rounded-md, focus ring. Full width by default.

## Form Layout

Forms use CSS Grid + wrapping `<label>` (implicit association, no `for`/`id` needed).

```html
<form id="my-form">
  <label>Name <input type="text" name="name" required></label>
  <label>Notes <textarea name="notes"></textarea></label>
  <div class="form-actions">
    <button type="button">Cancel</button>
    <button type="submit">Save</button>
  </div>
</form>
```

```scss
#my-form {
  @include form-grid;

  > label:nth-child(1) { grid-column: span 3; }
  > label:nth-child(2) { grid-column: span 6; }
  .form-actions { grid-column: span 6; }
}
```

### Rules

- Root: `<form id="...">` styled with `@include form-grid` (6 cols, 1 col on mobile)
- Children: direct `<label>` elements wrapping both text and input
- Grid spans: `> label:nth-child(N) { grid-column: span N; }` in SCSS
- Errors: `<small class="text-error">` inside `<label>`
- Checkbox/radio: needs `input[type="checkbox"] { width: auto; }` (ln-acme sets `input { width: 100% }` globally)
- `.form-actions` stays in HTML, gets `grid-column: span 6` in SCSS

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

Every `<button>` gets hover/active/focus/disabled effects automatically via `@include btn-colors` (applied globally in `scss/base/_global.scss`). No class needed.

```html
<button>Default</button>
<button disabled>Disabled</button>
```

- **Color change**: override `--color-primary` on element or parent
- **Structure**: `@include btn` adds padding, font, inline-flex alignment (structure only, no colors)
- **Colors**: `@include btn-colors` provides background opacity states (0.15 default, 0.7 hover, 1.0 active)
- **Focus ring**: consistent `@include focus-ring` across all interactive elements
- `.form-actions` — right-aligned button container, `grid-column: span 6` in form grid
