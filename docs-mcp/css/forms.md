---
name: forms
classification: css
status: active
domain: frontend
summary: Form grid layout, form-element groups, input controls, icon groups, search inputs, focus indicator presets, and button variants.
source: theme/config/mixins/_form.scss
tags: [forms, inputs, buttons, search, focus-ring, validation, controls]
---

# 📝 forms

---

## 1. Core Behavior & Responsibility

The `forms` styling system (`theme/config/mixins/_form.scss` and `theme/components/_form.scss`) handles input controls, responsive form grid layouts, validation states, and action buttons:

- **Global Baseline:** Inputs, textareas, selects, and buttons receive standardized padding, typography (`var(--font-size)` / `var(--line-height)`), focus rings, and border radii out of the box.
- **Icon Groups & Search:** A `<label>` wrapping an SVG icon and an input combines them into a seamless single control (`form-input-icon-group` and `.search`).
- **Responsive 6-Column Form Grid (`form-grid`):** A CSS Grid layout with column spanning utilities (`.col-span-1` through `.col-span-6`) collapsing smoothly on small viewports.
- **Required Indicator via CSS `:has()`:** Mandatory inputs with the HTML `required` attribute automatically display an indicator without manual asterisk characters.
- **Button Variants:** Primary fill defaults automatically on `<button type="submit">`, while `.btn-ghost` and `.btn-soft` provide secondary actions.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Form Grid with Actions)

```html
<form class="form-grid">
    <div class="form-element col-span-3">
        <label for="user-email">Email Address</label>
        <input type="email" id="user-email" name="email" required>
        <ul data-ln-validate-errors></ul>
    </div>
    <div class="form-element col-span-3">
        <label for="user-role">Account Role</label>
        <select id="user-role" name="role">
            <option value="member">Member</option>
            <option value="admin">Administrator</option>
        </select>
    </div>
    <ul class="form-actions col-span-6">
        <li><button type="button" class="btn btn-ghost">Cancel</button></li>
        <li><button type="submit" class="btn">Save User</button></li>
    </ul>
</form>
```

### Variant 1: Compact Search Field

```html
<label class="search">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <input type="search" placeholder="Filter records…" data-ln-search-debounce="0">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</label>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `form-grid` | mixin | — | 6-column responsive CSS Grid form layout |
| `form-input` | mixin | — | Base control styling for inputs, selects, textareas |
| `form-label` | mixin | — | Form field label typography (`label-md`) and spacing |
| `form-element` | mixin | — | Vertical container stacking label, input, and error list |
| `form-actions` | mixin | — | Horizontal row container for form submit and cancel buttons |
| `form-input-icon-group` | mixin | — | Composite wrapper for inline icon + input control |
| `search` | mixin | — | Compact search field with recessed fill and clear button |
| `btn` | mixin | — | Base button recipe (solid primary fill on `type="submit"`) |
| `btn-soft` | mixin | — | Soft accent-tinted secondary button |
| `btn-ghost` | mixin | — | Transparent ghost button with subtle hover background |
| `.form-grid`, `.form-element`, `.form-actions` | class | — | Prototyping classes for form layouts |
| `.search` | class | — | Prototyping class for search input wrapper |
| `--input-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) | Vertical input padding |
| `--btn-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) | Vertical button padding |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Explicit Label-Input Association:** Always associate labels with inputs using matching `for` and `id` attributes or by nesting the input inside the `<label>`.
> 2. **Never Author Asterisks for Required Fields:** Do not write `<label>Email *</label>` in HTML. CSS handles the required marker automatically from `[required]` using `:has()`.
> 3. **Search Debounce Distinction:** For local DOM filtering, set `data-ln-search-debounce="0"`. For API / remote searches, use `500` ms debounce to protect backend performance.

---

## 5. Related Documents

- [`density`](./density.md) — Sizing and height scaling of buttons and inputs across density modes.
- [`tokens`](./tokens.md) — Focus tokens, border widths, and semantic status colors.
- [`ln-validate`](../components/ln-validate.md) — Client-side form constraint validation.
- [`ln-form`](../components/ln-form.md) — RESTful form prefill and submission handling.
