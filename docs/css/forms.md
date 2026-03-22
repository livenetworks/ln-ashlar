# Forms & Buttons

File: `scss/components/_forms.scss`.

## Inputs

All `input`, `textarea`, `select` are styled globally with border, rounded-md, focus ring. Full width by default.

```html
<p class="form-element">
  <label for="name">Name</label>
  <input type="text" id="name" name="name">
</p>
```

## Form Layout

Forms use CSS Grid + `<p class="form-element">` with explicit `<label for>` / `<input id>`.

```html
<form id="my-form">
  <p class="form-element">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
  </p>
  <p class="form-element" id="field-notes">
    <label for="notes">Notes</label>
    <textarea id="notes" name="notes"></textarea>
  </p>
  <div class="form-actions">
    <button type="button">Cancel</button>
    <button type="submit">Save</button>
  </div>
</form>
```

```scss
#my-form {
  @include form-grid;

  .form-element { grid-column: span 3; }
  #field-notes { grid-column: span 6; }
  .form-actions { grid-column: span 6; }
}
```

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

Every `<button>` gets hover/active/focus/disabled effects automatically via `--color-primary`. No class needed.

```html
<button>Default</button>
<button disabled>Disabled</button>
```

- Color change: override `--color-primary` on element or parent
- Structure: `@include btn` adds padding, font, border-radius
- `.form-actions` — right-aligned button container, `grid-column: span 6` in form grid
