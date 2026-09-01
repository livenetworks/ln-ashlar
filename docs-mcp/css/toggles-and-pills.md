---
name: toggles-and-pills
classification: css
status: active
domain: frontend
summary: Accessible form pill selectors, outline checkboxes, segmented radio controls, and sliding switch toggles with symmetric HTML.
source: theme/config/mixins/_form.scss
tags: [pills, switches, toggles, checkboxes, radio-buttons, form-controls]
---

# 🔘 toggles-and-pills

---

## 1. Core Behavior & Responsibility

The `toggles-and-pills` styling module (`theme/config/mixins/_form.scss` and `theme/components/_form.scss`) provides 4 visual treatments for native `<input type="checkbox">` and `<input type="radio">` controls:

1. **Filled Pills (`pills` / `@include pills`):** Joined horizontal pill group for mutually exclusive radio options or multi-select filters.
2. **Outline Pills (`pills-outline` / `@include pills-outline`):** Bordered options maintaining visible check indicators.
3. **Segmented Pills (`pills-segmented` / `@include pills-segmented`):** Sunken track container with floating active selection pills.
4. **Switch Pills (`pills-switch` / `@include pills-switch`):** Sliding iOS/macOS-style switches for binary preference toggles.

All four variants share the exact same clean, symmetric `<ul> > <li> > <label> > <input>` HTML structure.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Sliding Switches)

```html
<ul class="pills-switch">
    <li>
        <label>
            <input type="checkbox" name="notifications" checked>
            Enable email notifications
        </label>
    </li>
    <li>
        <label>
            <input type="checkbox" name="dark_mode">
            Dark theme preference
        </label>
    </li>
</ul>
```

### Variant 1: Segmented Radio Control

```html
<ul class="pills-segmented">
    <li>
        <label>
            <input type="radio" name="billing_period" value="monthly" checked>
            Monthly
        </label>
    </li>
    <li>
        <label>
            <input type="radio" name="billing_period" value="annual">
            Annual (Save 20%)
        </label>
    </li>
</ul>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `pills` | mixin | — | Joined horizontal filled pill button group |
| `pills-outline` | mixin | — | Joined horizontal outline control |
| `pills-segmented` | mixin | — | Sunken track container with floating selection indicator |
| `pills-switch` | mixin | — | iOS-style sliding switch toggle control |
| `.pills`, `.pills-outline`, `.pills-segmented`, `.pills-switch` | class | — | Prototyping classes for outer `<ul>` containers |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Maintain Native Checkbox / Radio Semantics:** Never replace native `<input type="checkbox">` or `<input type="radio">` with custom div click handlers. Native inputs ensure standard keyboard navigation (Space/Arrow keys) and assistive technology compatibility.
> 2. **Symmetric HTML Invariant:** Always place the `<input>` as a direct child inside `<label>`. This avoids requiring explicit `id`/`for` attributes for every option.
> 3. **Avoid Checkbox Hack for Disclosure Widgets:** Using `<input type="checkbox">` to control panel collapse is strictly forbidden in `ln-ashlar` (use `ln-toggle` and `data-ln-toggle` instead).

---

## 5. Related Documents

- [`forms`](./forms.md) — Form inputs and grid layout.
- [`ln-toggle`](../components/ln-toggle.md) — JavaScript binary state primitive for collapsibles.
