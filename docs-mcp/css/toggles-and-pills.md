---
name: toggles-and-pills
classification: css
status: draft
domain: frontend
summary: Selection pills, joined-group pills, segmented track controls, and toggle switches for forms.
source: theme/config/mixins/_form.scss
tags: [pills, toggles, switches, radio, checkbox, controls, form]
---

# 🔘 toggles-and-pills

---

## 1. Core Behavior & Responsibility

The `toggles-and-pills` module (`theme/config/mixins/_form.scss` and `theme/components/_form.scss`) converts standard radio buttons and checkboxes into styled interactive selection controls:
- **Joined Pills (`@include pills` / `.pills`):** Horizontal list of mutually exclusive option pills with connected rounded corners.
- **Segmented Controls (`@include pills-segmented` / `.pills-segmented`):** Recessed track control where active items pop to an elevated white surface.
- **Toggle Switches (`@include toggle-switch` / `.pill-switch` / `.pills-switch`):** Binary on/off sliding switch decorators on checkboxes.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<ul class="pills">
    <li>
        <label>
            <input type="radio" name="billing" value="monthly" checked>
            <span>Monthly</span>
        </label>
    </li>
    <li>
        <label>
            <input type="radio" name="billing" value="annual">
            <span>Annual</span>
        </label>
    </li>
</ul>
```

### Variant 1: Toggle Switch

```html
<label class="pill-switch">
    <input type="checkbox" name="notifications" value="1" checked>
    <span>Email Notifications</span>
</label>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `pills` | mixin | — | Joined-corner pill group on a `<ul>` of radio/checkbox labels |
| `pills-segmented` | mixin | — | Segmented recessed track control with elevated active pill |
| `toggle-switch` | mixin | — | Slider switch styling on native checkbox input |
| `pill-switch` | mixin | — | Label row wrapping toggle-switch checkbox and label text |
| `pills-switch` | mixin | — | Vertical list of pill switches |
| `.pills` | class | — | Default component class applying @include pills |
| `.pills-segmented` | class | — | Default component class applying @include pills-segmented |
| `.pill-switch` | class | — | Default component class applying @include pill-switch |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Keep Native Input in DOM:** Never delete or detach the native `<input type="radio">` or `<input type="checkbox">` from the markup. Keep it inside the `<label>` for keyboard and screen reader accessibility.
> 2. **Never Use Checkboxes for JS Toggles:** JS UI toggles (e.g. accordion, drawer) must use `<button>` and `data-ln-toggle`, not checkbox hacks.

---

## 5. Related Documents

- [`chip`](./chip.md) — Dismissible filter tokens vs selection pills.
- [`forms`](./forms.md) — Form controls and layouts.
