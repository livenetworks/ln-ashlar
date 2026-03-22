# Forms & Buttons

File: `scss/components/_forms.scss`.

## Inputs

All `input`, `textarea`, `select` are styled globally with border, rounded-md, focus ring. Full width by default.

```html
<form id="my-form">
  <label>
    Name <span class="text-error">*</span>
    <input type="text" name="name" required>
  </label>
  <label>
    Category
    <select name="category">
      <option>Option A</option>
    </select>
  </label>
</form>
```

## Form Layout

Forms use CSS Grid + wrapping `<label>`. No `<div class="form-group">` or `<div class="form-row">`.

```scss
#my-form {
  @include form-grid;            // 6 cols, gap, responsive

  > label { grid-column: span 3; }  // half width
  > label:nth-child(3) { grid-column: span 6; }  // full width
  > .form-actions { grid-column: span 6; }

  input[type="checkbox"],
  input[type="radio"] { width: auto; }
}
```

## Pill Labels (Checkbox / Radio)

Checkbox and radio inputs inside `<label>` become pill buttons automatically.

```html
<label><input type="radio" name="role" value="admin"> Admin</label>
<label><input type="radio" name="role" value="editor" checked> Editor</label>
<label><input type="checkbox" name="api" value="1"> API</label>
```

### Two Styles

| Style | How | Description |
|-------|-----|-------------|
| **Filled** (default) | Automatic | Gray bg, colored bg on checked, input hidden |
| **Outline** | `@include pill-outline` on parent | Bordered, visible input indicator |

```scss
// Switch to outline on a parent container
#my-form .auth-group { @include pill-outline; }

// Color per context
#role-field { --color-primary: var(--color-secondary); }
```

## Buttons

Every `<button>` gets hover/active/focus/disabled effects automatically via `--color-primary`. No class needed.

```html
<button>Default</button>
<button disabled>Disabled</button>
```

- Color change: override `--color-primary` on element or parent
- Structure: `@include btn` adds padding, font, border-radius
- `.form-actions` — right-aligned button container, `grid-column: span 6` in form grid
