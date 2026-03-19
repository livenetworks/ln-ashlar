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

## Adding a New SCSS Component

1. Create `scss/components/_new-component.scss`
2. Start with `@use '../config/mixins' as *;`
3. Use semantic selectors (`.component element {}`)
4. Use `@include` mixins for properties
5. Use `var(--token)` for values
6. Add `@use 'components/new-component'` to `scss/ln-acme.scss`

## Adding a New JS Component

1. Create `js/ln-{name}/ln-{name}.js`
2. Follow the IIFE pattern (see senior-js-developer skill)
3. Add `data-ln-{name}` data attribute
4. If CSS needed, create `js/ln-{name}/ln-{name}.scss`
5. Add `import './ln-{name}/ln-{name}.js'` to `js/index.js`
6. DOM structure → `<template>` elements in HTML
7. Detailed architecture: [js/COMPONENTS.md](js/COMPONENTS.md)

## Changing Design Tokens

1. Edit `scss/config/_tokens.scss`
2. Verify that referencing mixins are updated
3. Confirm build passes: `npm run build`

---

## Available Icons

`ln-icon-close`, `ln-icon-menu`, `ln-icon-home`, `ln-icon-users`,
`ln-icon-delete`, `ln-icon-view`, `ln-icon-check`, `ln-icon-plus`, `ln-icon-settings`,
`ln-icon-books`, `ln-icon-lodges`, `ln-icon-logout`, `ln-icon-chart`, `ln-icon-clock`,
`ln-icon-envelope`, `ln-icon-arrow-up`, `ln-icon-arrow-down`, `ln-icon-book`,
`ln-icon-edit`, `ln-icon-save`, `ln-icon-download`, `ln-icon-upload`,
`ln-icon-copy`, `ln-icon-link`, `ln-icon-calendar`, `ln-icon-filter`,
`ln-icon-refresh`, `ln-icon-print`, `ln-icon-lock`, `ln-icon-star`,
`ln-icon-info-circle`, `ln-icon-warning`, `ln-icon-globe`,
`ln-icon-search`, `ln-icon-list`, `ln-icon-box`, `ln-icon-building`.

---

## Known Backlog

- **ln-modal** — missing CustomEvent dispatching (ln-modal:open/close), event listeners not removed
- **ln-ajax** — missing CustomEvent dispatching for AJAX lifecycle
- **ln-select** — depends on TomSelect (peer dependency)
- **Form attributes** — renamed to `data-ln-*` convention, Laravel projects need HTML template updates