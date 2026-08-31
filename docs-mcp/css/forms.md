---
name: forms
classification: css
status: draft
domain: frontend
summary: Form layouts, 6-column container-query form grid, input field groups with icons, and focus rings.
source: theme/config/mixins/_form.scss
tags: [form, form-grid, inputs, field-group, focus, accessibility]
---

# 📝 forms

---

## 1. Core Behavior & Responsibility

The `forms` mixin module (`theme/components/_form.scss` and `theme/config/mixins/_form.scss`) coordinates form structures and input components:
- **`@include form-grid`:** Responsive 6-column CSS grid that collapses to 1 column below `md` width via container queries.
- **`@include form-field-group`:** Single-border wrapper for icon-decorated inputs (`svg.ln-icon + input`) handling focus via `:focus-within`.
- **`@include form-label`:** Standardized label typography with automatic red asterisk (`*`) injection for required inputs.
- **`@include form-input`:** Automatically applied to standard `<input>`, `<select>`, and `<textarea>` elements in the theme.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<form class="user-form">
    <div class="form-element" style="grid-column: span 3;">
        <label for="user-first">First Name</label>
        <input type="text" id="user-first" name="first_name" required>
    </div>
    <div class="form-element" style="grid-column: span 3;">
        <label for="user-last">Last Name</label>
        <input type="text" id="user-last" name="last_name" required>
    </div>
    <div class="form-element" style="grid-column: span 6;">
        <label for="user-email">Email Address</label>
        <label>
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-mail"></use></svg>
            <input type="email" id="user-email" name="email" required>
        </label>
    </div>
    <div class="form-actions" style="grid-column: span 6;">
        <button type="button" class="btn btn-ghost">Cancel</button>
        <button type="submit" class="btn">Save</button>
    </div>
</form>
```

```scss
.user-form {
    @include form-grid;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `form-grid` | mixin | — | 6-column container-query responsive form grid |
| `form-label` | mixin | — | Label styling with automatic required indicator |
| `form-input` | mixin | — | Standard input styling with recessed background and focus ring |
| `form-field-group` | mixin | — | Bordered flex wrapper for input + icon with :focus-within |
| `form-actions` | mixin | — | Right-aligned action footer with top border |
| `.form-actions` | class | — | Default component class applying @include form-actions |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Associate Labels with Inputs:** Always pair `<label for="id">` with matching `<input id="id">` for accessibility.
> 2. **Avoid Double Focus Rings:** In a `form-field-group`, the focus ring is applied to the outer container via `:focus-within`; inner inputs must not render separate browser outlines.

---

## 5. Related Documents

- [`toggles-and-pills`](./toggles-and-pills.md) — Radio and checkbox controls.
- [`breakpoints`](./breakpoints.md) — Container queries in form grids.
