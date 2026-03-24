# CLAUDE.md — ln-acme Project

## What is this?

`ln-acme` is a unified frontend library for LiveNetworks projects.
Contains **SCSS CSS framework** + **vanilla JS components**, zero dependencies.
Used in Laravel projects and other web applications.

> **Coding standards** → see global SKILL files (css, html, js). This file covers project-specific details only.

---

## File Structure

```
scss/
├── config/
│   ├── _tokens.scss         ← :root CSS variables (DO NOT change without reason)
│   ├── _mixins.scss         ← @forward index of all mixins
│   ├── mixins/
│   │   ├── _index.scss      ← @forward all mixin files
│   │   ├── _spacing.scss    ← p, px, py, m, mx, my, gap (primitives)
│   │   ├── _display.scss    ← flex, block, hidden, items-*, justify-*
│   │   ├── _typography.scss ← text-*, font-*, truncate
│   │   ├── _colors.scss     ← text-primary, bg-primary
│   │   ├── _borders.scss    ← border, rounded-*
│   │   ├── _form.scss       ← form-input, form-select, form-checkbox, pill, ...
│   │   ├── _btn.scss        ← btn, btn-colors, close-button
│   │   ├── _table.scss      ← table-base, table-responsive, table-striped, ...
│   │   ├── _card.scss       ← card, panel-header, section, section-card
│   │   ├── _modal.scss      ← modal-sm, modal-md, modal-lg, modal-xl
│   │   ├── _breadcrumbs.scss← breadcrumbs
│   │   ├── _loader.scss     ← loader
│   │   └── ...              ← other primitive/composite mixins
│   ├── _theme.scss          ← Color palette extensions
│   └── _icons.scss          ← SVG data-URI icon variables
├── base/                    ← Reset, global defaults, typography
├── layout/                  ← App layout, grid, header
├── components/              ← Default application of mixins to selectors
└── utilities/               ← Helper classes (.hidden, etc.)

js/
├── index.js                 ← Barrel import (all components)
└── ln-{name}/
    ├── ln-{name}.js         ← IIFE component
    └── ln-{name}.scss       ← Co-located CSS (if needed)
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

## Modal Architecture

`<form>` is always the content root — no wrapper `<div>`, no BEM classes. Styled via `.ln-modal > form`.

```html
<div class="ln-modal" id="my-modal">
    <form>
        <header><h3>Title</h3><button type="button" class="ln-icon-close" data-ln-modal-close></button></header>
        <main>...</main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

- **`<form>` is the root** — footer buttons (Cancel, Submit) are inside the form
- **Footer buttons** get `@include btn` automatically — no `.btn` class needed
- **Non-submit buttons** need `type="button"` (close, cancel) to prevent form submission
- **No `.ln-modal__content` class** — select semantically: `.ln-modal > form`
- **Sizes** via mixins: `#my-modal > form { @include modal-lg; }` — not CSS classes
- Available: `modal-sm` (28rem), `modal-md` (32rem), `modal-lg` (42rem), `modal-xl` (48rem)
- **Instance-based API** — `modal.lnModal.open()`, `.close()`, `.toggle()`, `.destroy()`
- **ESC listener** active only while modal is open (zero listeners when all closed)

## Pill Labels (Checkbox / Radio)

Checkbox/radio pills use `<ul class="btn-group"> > <li> > <label>` — grouped, border-radius on first/last.

- **Filled** (default) — gray bg, colored bg on checked, input hidden
- **Outline** — `@include pill-outline` on parent → bordered, visible input indicator
- **Color** — override `--color-primary` on parent for different colors

```html
<ul class="btn-group">
  <li><label><input type="radio" name="role" value="admin"> Admin</label></li>
  <li><label><input type="radio" name="role" value="editor"> Editor</label></li>
</ul>
```
```scss
#my-form fieldset { @include pill-outline; }
```

## SCSS Architecture — Two Layers

Every visual style has **two layers**: a mixin (recipe) and a component (application).

```
scss/config/mixins/_table.scss      →  @mixin table-base { ... }         ← recipe
scss/components/_tables.scss        →  table { @include table-base; }    ← applied
```

**Mixins** (`scss/config/mixins/`) — define HOW something looks. Never generate CSS by themselves.
**Components** (`scss/components/`) — apply mixins to default selectors. Generate CSS.

| Situation | Mixin | Component |
|---|---|---|
| Universal element (`label`, `table`, `input`) | yes | yes — applied to element selector |
| Singleton (`#breadcrumbs`) | yes | yes — applied to `#id` selector |
| Component-identifying class (`.btn`, `.btn-group`, `.collapsible`) | yes | yes — applied to class |
| Data-attr JS component (`[data-ln-tabs]`) | not needed | yes — selector is the attribute |

**Projects override** by using the same mixin on their own selector:
```scss
// project — different table styling for a specific table
#audit-log { @include table-base; @include table-striped; }
#audit-log thead { display: none; } // no header for this one
```

## Adding a New SCSS Mixin + Component

1. Create `scss/config/mixins/_new-component.scss` with `@mixin new-component { ... }`
2. Register in `scss/config/mixins/_index.scss` with `@forward 'new-component'`
3. Update `scss/config/_mixins.scss` header comment
4. Create `scss/components/_new-component.scss` that applies the mixin:
   ```scss
   @use '../config/mixins' as *;
   #new-component { @include new-component; }
   ```
5. Add `@use 'components/new-component'` to `scss/ln-acme.scss`
6. Use `@include` mixins for properties, `var(--token)` for values — **NEVER** hardcoded colors

## Adding a New JS Component

1. Create `js/ln-{name}/ln-{name}.js`
2. Follow the IIFE pattern (see senior-js-developer skill)
3. Add `data-ln-{name}` data attribute
4. If CSS needed, create `js/ln-{name}/ln-{name}.scss`
5. Add `import './ln-{name}/ln-{name}.js'` to `js/index.js`
6. DOM structure → `<template>` elements in HTML
7. Detailed architecture: [js/COMPONENTS.md](js/COMPONENTS.md)

## Override Architecture

ln-acme ships two layers: **mixins** (recipes) + **components** (defaults applied to selectors).
Projects can override at any level:

1. **Use the default** → do nothing, library CSS works out of the box
2. **Color change** → override CSS variable: `.my-section { --color-primary: var(--color-error); }`
3. **Structure tweak** → re-apply mixin with modifications on a project selector
4. **Full replace** → exclude the component, use only the mixin on a custom selector
5. **Project selectors never change** — they describe WHAT, not HOW

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

- **ln-ajax** — missing CustomEvent dispatching for AJAX lifecycle
- **ln-select** — depends on TomSelect (peer dependency)
- **Form attributes** — renamed to `data-ln-*` convention, Laravel projects need HTML template updates