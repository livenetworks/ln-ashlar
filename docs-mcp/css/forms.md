---
name: forms
classification: css
status: active
domain: frontend
summary: Form grid layout, token-driven input sizing scales (sm, md, lg), search widgets, custom checkbox and radio indicators, focus presets, and button variants.
source: theme/config/mixins/_form.scss
tags: [forms, inputs, buttons, search, checkboxes, radio, focus-ring, validation, controls]
---

# 📝 forms

> **Mental Model & Architectural Contract:**
> Form controls attach directly to semantic HTML5 elements (`<input>`, `<select>`, `<textarea>`, `<search>`), inheriting standardized padding and typography driven by design tokens in `rem`. Sizing scales (`input-sm`, `input-md`, `input-lg`) and custom checkbox/radio indicators rebind internal geometry tokens without modifying native DOM behavior or introducing synthetic state mirrors.

---

## 1. Core Behavior & Responsibility

The `forms` styling system (`theme/config/mixins/_form.scss` and `theme/components/_form.scss`) handles input controls, responsive form grid layouts, validation states, and action buttons:

- **Global Baseline:** Inputs, textareas, selects, and buttons receive standardized padding (`var(--padding-y)` / `var(--padding-x)` in `rem`), typography (`var(--font-size)` / `var(--line-height)`), focus rings, and border radii out of the box. Default control height is `~2.375rem`.
- **Token-Driven Size Modifiers:** Dedicated mixins (`input-sm`, `input-md`, `input-lg`), classes (`.input-sm`, `.input-lg`), and attributes (`[data-size="sm"]`, `[data-size="lg"]`) scale padding, typography, and accompanying icon dimensions between compact (`~1.75rem`), default (`~2.375rem`), and large (`~2.875rem`) using strict `rem` tokens.
- **Icon Groups & Search:** A `<label>` (or `<search>` for the dedicated search field) wrapping an SVG icon and an input combines them into a seamless single control (`form-input-icon-group` and `search`). Default `<search>` matches standard input height (`~2.375rem`), with opt-in compact variants (`search-sm`, `[data-size="sm"]`).
- **Custom Checkbox & Radio Indicators:** Native `<input type="checkbox">` and `<input type="radio">` are styled via `@mixin form-checkbox` (`1.125rem`, `var(--radius-xs)` 0.25rem radius, resting shadow, idle hover glow, checked accent fill with SVG checkmark, and indeterminate support) without extra DOM wrappers. Checkbox labels (`label:has(> input[type="checkbox"])`) enforce `display: inline-flex`, `align-items: center`, `gap: var(--size-xs)`, `cursor: pointer`, and `user-select: none`.
- **Responsive 6-Column Form Grid (`form-grid`):** A CSS Grid layout with column spanning utilities (`.col-span-1` through `.col-span-6`) collapsing smoothly on small viewports.
- **Required Indicator via CSS `:has()`:** Mandatory inputs with the HTML `required` attribute automatically display an indicator without manual asterisk characters.
- **Button Variants:** Primary fill defaults automatically on `<button type="submit">`, while `.btn-ghost` and `.btn-soft` provide secondary actions.
- **Pills & Segmented Controls:** `.pills`, `.pills-outline`, and `.pills-segmented` style checkbox/radio lists with connected border radii, driving checked states with optimized CSS `:has(> input:checked)` cascades.

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

### Variant 1: Search Field (Default & Sizes)

```html
<!-- Default (~2.375rem) -->
<search aria-label="Filter records">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <input type="search" placeholder="Filter records…">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</search>

<!-- Small Compact Search (~1.75rem) -->
<search data-size="sm" aria-label="Filter records">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <input type="search" placeholder="Filter records…">
</search>
```

### Variant 2: Input Size Modifiers (Small, Default, Large)

```html
<!-- Small (~1.75rem) — tables, dense toolbars -->
<input type="text" class="input-sm" placeholder="Small input…">

<!-- Default (~2.375rem) — standard forms -->
<input type="text" placeholder="Standard input…">

<!-- Large (~2.875rem) — landing pages, hero search -->
<input type="text" class="input-lg" placeholder="Large input…">
```

### Variant 3: Checkbox & Radio Controls

```html
<!-- Checkbox with accessible label -->
<label>
    <input type="checkbox" name="agree" required>
    <span>I agree to the terms of service</span>
</label>

<!-- Radio options list -->
<fieldset class="form-element">
    <legend>Notification Preference</legend>
    <label>
        <input type="radio" name="notify" value="email" checked>
        <span>Email notifications</span>
    </label>
    <label>
        <input type="radio" name="notify" value="sms">
        <span>SMS notifications</span>
    </label>
</fieldset>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `form-grid` | mixin | — | 6-column responsive CSS Grid form layout |
| `form-input` | mixin | — | Base control styling for inputs, selects, textareas (~2.375rem) |
| `input-sm` / `form-input-sm` | mixin | — | Compact input size modifier (`0.25rem` / `0.5rem`, `var(--text-xs)`) ~1.75rem |
| `input-md` / `form-input-md` | mixin | — | Standard input size modifier (`0.4375rem` / `0.75rem`, `var(--text-sm)`) ~2.375rem |
| `input-lg` / `form-input-lg` | mixin | — | Large input size modifier (`0.625rem` / `1rem`, `var(--text-base)`) ~2.875rem |
| `search` | mixin | — | Search field styling with recessed fill and clear button (defaults to ~2.375rem) |
| `search-sm` / `search-lg` | mixin | — | Compact (~1.75rem) and large (~2.875rem) search field modifiers |
| `form-checkbox` | mixin | — | Modernized custom indicator (`1.125rem`, `0.25rem` radius, hover glow, checked SVG checkmark) |
| `form-check` | mixin | — | Label/wrapper recipe for inline checkbox and radio control containers |
| `form-label` | mixin | — | Form field label typography (`label-md`) and spacing |
| `form-element` | mixin | — | Vertical container stacking label, input, and error list |
| `form-actions` | mixin | — | Horizontal row container for form submit and cancel buttons |
| `form-input-icon-group` | mixin | — | Composite wrapper for inline icon + input control |
| `btn` | mixin | — | Base button recipe (solid primary fill on `type="submit"`) |
| `btn-soft` | mixin | — | Soft accent-tinted secondary button |
| `btn-ghost` | mixin | — | Transparent ghost button with subtle hover background |
| `.input-sm`, `.input-lg` | class | — | Direct class-based input size modifiers |
| `[data-size="sm"]`, `[data-size="lg"]` | attribute | — | Declarative data-attribute input size modifiers |
| `.form-grid`, `.form-element`, `.form-actions` | class | — | Prototyping classes for form layouts |
| `--input-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) | Vertical input padding |
| `--btn-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) | Vertical button padding |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Explicit Label-Input Association:** Always associate labels with inputs using matching `for` and `id` attributes or by nesting the input inside the `<label>`.
> 2. **Never Author Asterisks for Required Fields:** Do not write `<label>Email *</label>` in HTML. CSS handles the required marker automatically from `[required]` using `:has()`.

---

## 5. Related Documents

- [`density`](./density.md) — Sizing and height scaling of buttons and inputs across density modes.
- [`tokens`](./tokens.md) — Focus tokens, border widths, and semantic status colors.
- [`ln-validate`](../components/ln-validate.md) — Client-side form constraint validation.
- [`ln-form`](../components/ln-form.md) — RESTful form prefill and submission handling.
