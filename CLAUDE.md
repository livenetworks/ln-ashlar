# CLAUDE.md — ln-acme Project

## What is this?

`ln-acme` is a unified frontend library for LiveNetworks projects.
Contains **SCSS CSS framework** + **vanilla JS components**, zero dependencies.
Used in Laravel projects and other web applications.

> **Coding standards** → see global SKILL files (senior-css-developer, senior-js-developer). This file covers project-specific details only.

---

## File Structure

```
scss/
├── config/
│   ├── _tokens.scss     ← :root CSS variables (DO NOT change without reason)
│   ├── _mixins.scss     ← @include helpers (add new ones as needed)
│   ├── _theme.scss      ← Color palette extensions
│   └── _icons.scss      ← SVG data-URI icon variables
├── base/                ← Reset, global defaults, typography
├── layout/              ← App layout, grid, header
├── components/          ← Card, forms, tables, navigation, etc.
└── utilities/           ← Helper classes (.hidden, etc.)

js/
├── index.js             ← Barrel import (all components)
└── ln-{name}/
    ├── ln-{name}.js     ← IIFE component
    └── ln-{name}.scss   ← Co-located CSS (if needed)
```

---

## Build

```bash
npm run build        # Produce dist/
npm run dev          # Watch mode
```

Output:
- `dist/ln-acme.css` — everything included
- `dist/ln-acme.js` — ES module
- `dist/ln-acme.iife.js` — for `<script>` tag

---

## Project Integration

### npm
```js
import 'ln-acme';                        // JS
import 'ln-acme/dist/ln-acme.css';       // CSS
```

### Git submodule
```bash
git submodule add .../ln-acme.git resources/ln-acme
```

### Plain HTML
```html
<link rel="stylesheet" href="dist/ln-acme.css">
<script src="dist/ln-acme.iife.js"></script>
```

---

## Button Architecture

Every `<button>` gets hover/active/focus/disabled effects **out of the box** from `scss/base/_global.scss` via `@include btn-colors`.
All states read from `--color-primary`. No classes needed.

- **`@include btn-colors`** — color states (default 0.15, hover 0.7, active 1.0). Applied globally to all `<button>` elements
- **`@include btn`** — structure only (inline-flex, padding, font). Use when you need a styled button
- **Color change** — override `--color-primary` on the element or parent:
  ```scss
  #delete-user { --color-primary: var(--color-error); }
  .admin-panel { --color-primary: var(--color-secondary); }
  ```
- **ZERO hardcoded colors** in mixins — every color reads from `var(--token)`
- **No `btn--*` variant classes** in ln-acme — projects define their own via `--color-primary` override
- Full docs: `demo/admin/mixins.html`

## Adding a New SCSS Component

1. Create `scss/components/_new-component.scss`
2. Start with `@use '../config/mixins' as *;`
3. Use semantic selectors (`.component element {}`)
4. Use `@include` mixins for properties
5. Use `var(--token)` for values — **NEVER** hardcoded colors
6. Add `@use 'components/new-component'` to `scss/ln-acme.scss`

## Adding a New JS Component

1. Create `js/ln-{name}/ln-{name}.js`
2. Follow the IIFE pattern (see senior-js-developer skill)
3. Add `data-ln-{name}` data attribute
4. If CSS needed, create `js/ln-{name}/ln-{name}.scss`
5. Add `import './ln-{name}/ln-{name}.js'` to `js/index.js`
6. DOM structure → `<template>` elements in HTML
7. Detailed architecture: [js/COMPONENTS.md](js/COMPONENTS.md)

## Override Architecture

ln-acme defines default mixins → projects use them on semantic selectors → projects override `--color-primary` (for colors) or redefine the mixin (for structure).

1. **Color change** → override CSS variable on parent: `.my-section { --color-primary: var(--color-error); }`
2. **Structure change** → redefine the mixin in project `_overrides.scss`
3. **Project selectors never change** — they describe WHAT, not HOW

## Changing Design Tokens

1. Edit `scss/config/_tokens.scss`
2. Verify that referencing mixins are updated
3. Confirm build passes: `npm run build`

---

## Icons

Icons use `mask-image` + `currentColor` — they automatically inherit the text color from their parent.
No color variant classes (`--white`, `--red`, etc.) — change color via CSS `color` property.

```html
<span class="ln-icon-plus"></span>           <!-- inherits parent color -->
<button><span class="ln-icon-plus"></span> Add</button>  <!-- follows button text color -->
```

Available: `ln-icon-close`, `ln-icon-menu`, `ln-icon-home`, `ln-icon-users`,
`ln-icon-delete`, `ln-icon-view`, `ln-icon-check`, `ln-icon-plus`, `ln-icon-settings`,
`ln-icon-books`, `ln-icon-lodges`, `ln-icon-logout`, `ln-icon-chart`, `ln-icon-clock`,
`ln-icon-envelope`, `ln-icon-arrow-up`, `ln-icon-arrow-down`, `ln-icon-book`,
`ln-icon-edit`, `ln-icon-save`, `ln-icon-download`, `ln-icon-upload`,
`ln-icon-copy`, `ln-icon-link`, `ln-icon-calendar`, `ln-icon-filter`,
`ln-icon-refresh`, `ln-icon-print`, `ln-icon-lock`, `ln-icon-star`,
`ln-icon-info-circle`, `ln-icon-error-circle`, `ln-icon-check-circle`,
`ln-icon-warning`, `ln-icon-globe`, `ln-icon-search`, `ln-icon-list`,
`ln-icon-box`, `ln-icon-building`, `ln-icon-badge`.

Sizes: `ln-icon--sm` (1rem), default (1.25rem), `ln-icon--lg` (1.5rem), `ln-icon--xl` (4rem).

---

## Known Backlog

- **ln-modal** — missing CustomEvent dispatching (ln-modal:open/close), event listeners not removed
- **ln-ajax** — missing CustomEvent dispatching for AJAX lifecycle
- **ln-select** — depends on TomSelect (peer dependency)
- **Form attributes** — renamed to `data-ln-*` convention, Laravel projects need HTML template updates