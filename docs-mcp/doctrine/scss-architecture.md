---
name: scss-architecture
classification: doctrine
status: draft
domain: frontend
summary: Two-layer SCSS design system, tokens, mixins vs components, theming strategy, and z-index stacking layers in ln-ashlar.
source: docs/architecture/reference.md, docs/css/theming.md, docs/css/tokens.md
tags: [doctrine, scss, css, theming, design-tokens]
---

# 🎨 SCSS Architecture and Styling Doctrine

## Summary

This document explains the styling architecture of `ln-ashlar`. It covers the two-layer SCSS system (mixins vs. components), design token structures, the CSS/JS hook boundary rules, how dark mode and custom tenant themes are compiled, and the z-index stacking context strategies.

---

## 1. The Two-Layer SCSS System

To separate styling recipes from DOM applications, `ln-ashlar` divides SCSS files into two distinct layers:

```
Mixin Layer (Recipe)        ->  scss/config/mixins/_table.scss   → @mixin table-base { ... }
Component Layer (Binding)   ->  scss/components/_table.scss      → table { @include table-base; }
```

### A. The Mixin Layer (`scss/config/mixins/`)
- Contains pure style recipes.
- Does **not** output CSS classes or rules directly when compiled on its own.
- Defines variables and structures but does not bind them to specific HTML tags or classes.

### B. The Component Layer (`scss/components/`)
- Applies mixins to default tags or standard utility classes.
- Generates the final compiled CSS output.
- Custom consumer components apply these mixins directly in their local selectors (e.g., `#audit-log-table { @include table-base; }`) rather than copy-pasting styling rules.

---

## 2. Co-located JS Styles vs. Global Styles

Each functional JavaScript component folder (e.g., `js/ln-toggle/`, see [`ln-toggle`](../components/ln-toggle.md)) may contain a local `.scss` file. However, this is strictly constrained:

- **Co-located SCSS (State only):** Used *only* to govern active functional state styling controlled by JS (e.g., `[data-ln-toggle-hide] { display: none !important; }` or timing transitions).
- **Global Mixins/Components (Visual chrome):** All visual design details (padding, font sizes, borders, colors, shadow values) must live under the main SCSS directories (`scss/config/mixins/` or `scss/components/`).

---

## 3. CSS/JS Hook Boundary

To avoid selector collisions and specificity bugs, follow these selector rules:

1. **Presence Decoration is Forbidden:** Do **not** style components using the bare functional JS identifier (e.g., `[data-ln-modal] { padding: 16px; }` is prohibited). The attribute acts as an initialization selector for JS, not a style hook.
2. **State Value Styling is Allowed:** Styling is allowed when selecting specific values of functional attributes representing a runtime state (e.g., `[data-ln-modal="open"] { display: flex; }` or `[data-ln-popover="open"] { opacity: 1; }`).
3. **Use Semantic Classes for Visual Variants:** Apply standard visual classes (e.g., `.search`, `.collapsible`, `.btn`) for static visual presentation, decoupled from functional JS logic.

---

## 4. Design Tokens and Primitives

Design values are declared as CSS custom properties in `scss/config/_tokens.scss`.

### A. Bare HSL Triplets
To allow variable alpha opacity, colors (brand, secondary, and status values) are declared as raw HSL numeric values:
```css
--color-primary: 216 95% 42%; /* Bare triplet */

/* Composed at use site */
background-color: hsl(var(--color-primary) / 0.5); /* 50% opacity */
```

### B. Vocabulary and Primitives
- **Vocabulary Tokens:** Pre-composed colors and shadows representing semantic choices (e.g., `--bg-base`, `--bg-elevated`, `--fg-muted`, `--border-subtle`, `--shadow-resting`).
- **Primitives:** Single CSS variables that SCSS mixins read directly (e.g., `--color-bg`, `--color-fg`, `--color-border`, `--shadow`, `--card-padding-x`, `--card-padding-y`). These map by default to vocabulary tokens and theme dimensions.
- **Scope Re-binding:** To change the appearance of a component, rebind the primitive on the local component scope instead of writing static overrides:
```css
.card-dark-mode {
    --color-bg: var(--bg-recessed);
    --color-fg: var(--fg-muted);
}
```

### C. Mixin Inclusion Grouping and Overrides
When styling custom, project-specific components (e.g. by unique IDs like `#user-edit-modal` and `#packages-filter-drawer`), follow these grouping and overriding guidelines:
1. **Group shared mixins:** Group selectors sharing the exact same base mixin using comma-separated rules to keep the compiled CSS clean and unified.
2. **Rebind primitives for overrides:** Rather than writing direct custom styling overrides (like `padding: 2rem` or `border: 1px solid red`) which break layout architectures, rebind the component's internal design primitives (like `--card-padding-x`, `--card-padding-y`, `--color-bg`, or `--color-border`) in a separate block underneath.

#### Correct SCSS Binding and Overriding:
```scss
// In scss/components/_modal.scss

// Group shared base mixin inclusions together
#user-edit-modal,
#packages-filter-drawer {
    @include modal-panel;
}

// Instance-specific token re-bindings and overrides
#packages-filter-drawer {
    --color-bg: var(--bg-recessed);           // Changes background to recessed base
    --color-border: hsl(var(--color-danger));  // Overrides border to danger red
    --card-padding-x: 2rem;                    // Overrides horizontal padding primitive
    --card-padding-y: 2rem;                    // Overrides vertical padding primitive
}
```

---

## 5. Theming and Dark Mode Strategy

`ln-ashlar` supports dark mode and custom consumer themes through a **vocabulary re-binding layer**.

### A. Non-Destructive Dark Mode
Dark mode is activated via:
1. Explicit HTML attribute: `<html data-theme="dark">`
2. System media query: `@media (prefers-color-scheme: dark)` when no explicit `data-theme` is provided.
3. Forcing light: `<html data-theme="light">`

To apply themes, **rebind vocabulary tokens at the theme root scope**. Never use nested descendant selectors with higher specificity (e.g., `[data-theme="dark"] .card { background: black; }` is forbidden).

#### Correct Theme Declaration:
```css
[data-theme="dark"] {
    --bg-base:     hsl(220 16% 13%);
    --bg-elevated: hsl(220 16% 17%);
    --fg-default:  hsl(0 0% 95%);
    --fg-muted:    hsl(220 9% 60%);
}
```
Because component mixins read primitives like `--color-bg` (which default to `--bg-base`), re-binding `--bg-base` automatically shifts styling across all components.

---

## 6. Z-Index and Stacking Contexts

Z-indices are defined globally using semantic z-index variables, for ordinary (non-top-layer) elements:
```
toast (50) > modal (40) > overlay (30) > dropdown (20) > sticky (10)
```

### Top-Layer Stacking
Modals (`<dialog>` + `showModal()`), dropdown menus, popovers, and JS-enhanced tooltips (Popover
API, `popover="manual"` + `showPopover()`/`hidePopover()`) are promoted to the browser's top layer —
a rendering layer above the entire document, immune to any ancestor `overflow`/`z-index`/`transform`
stacking context. Top-layer elements stack in most-recently-shown order, not by the `z-index`
property — opening a dropdown from inside an open modal always renders the dropdown above the modal,
with no CSS coordination required. The `--z-*` token scale above governs only elements that never
enter the top layer (sticky headers, toasts).
