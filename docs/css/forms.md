# Forms & Buttons

File: `scss/components/_forms.scss`.

## Inputs

```html
<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Enter name...">
</div>
```

All `input`, `textarea`, `select` are styled globally with border, rounded-md, focus ring.

## Floating Labels

```html
<div data-ln-input>
    <input type="text" placeholder=" " required>
    <label>Name</label>
</div>
<div data-ln-input-errors>Error message</div>
```

## Buttons

```html
<button>Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-danger">Danger</button>
<button disabled>Disabled</button>
```

Default button is primary color with white text.

## Form Layout

```html
<div class="form-row">
    <div class="form-group">...</div>
    <div class="form-group">...</div>
</div>
<div class="form-actions">
    <button class="btn-secondary">Cancel</button>
    <button>Save</button>
</div>
```

- `.form-group` -- margin bottom
- `.form-row` -- horizontal flex with gap
- `.form-actions` -- right-aligned buttons with top border
