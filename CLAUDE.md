# CLAUDE.md — ln-acme Project

## Working Mode

When I share plans, specs, or ask architectural questions — DON'T immediately
execute. Instead:

1. **Think first** — analyze what I'm proposing. Look for gaps, contradictions,
   missing edge cases, better alternatives.
2. **Push back** — if something is wrong or suboptimal, say so directly.
   Don't agree just because I said it. Challenge mainstream patterns if
   they don't fit our architecture.
3. **Reference existing decisions** — check the skills and specs before
   answering. If we already decided "no pagination, virtual scroll" in
   data-table.md, don't suggest pagination.
4. **Ask before building** — if the request is ambiguous or has multiple
   valid approaches, discuss first. Don't pick one silently.
5. **Proactive feedback** — if you notice something I didn't ask about
   but should have (missing state, edge case, contradiction with another
   spec), bring it up.

This applies to architecture discussions, spec reviews, and planning.
For implementation tasks ("create this file", "fix this bug"), execute directly.

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
│   │   ├── _card.scss       ← card, card-accent-*, card-bg, card-stacked, panel-header, section-card
│   │   ├── _modal.scss      ← modal-sm, modal-md, modal-lg, modal-xl
│   │   ├── _nav.scss        ← nav (general navigation reset)
│   │   ├── _tabs.scss       ← tabs-nav, tabs-tab, tabs-tab-active, tabs-panel
│   │   ├── _breadcrumbs.scss← breadcrumbs
│   │   ├── _focus.scss      ← focus-ring (consistent focus indicator)
│   │   ├── _loader.scss     ← loader
│   │   ├── _avatar.scss     ← avatar (profile button with image + name/role)
│   │   └── ...              ← other primitive/composite mixins
│   ├── _theme.scss          ← Color palette extensions
│   └── _icons.scss          ← SVG data-URI icon variables
├── base/                    ← Reset, global defaults, typography
├── components/              ← Default application of mixins to selectors
└── utilities/               ← Helper classes (.hidden, etc.)

js/
├── index.js                 ← Barrel import (all components)
├── ln-core/
│   ├── index.js             ← Barrel re-export
│   ├── helpers.js           ← cloneTemplate, dispatch, dispatchCancelable, fill, renderList
│   └── reactive.js          ← reactiveState, deepReactive, createBatcher
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

### Core Principle

Structure is **global**. Color is **semantic** (`type="submit"`) or **explicit** (`@include btn`).

```
scss/config/mixins/_btn.scss    →  @mixin btn { ... }           ← recipe
scss/components/_buttons.scss   →  .btn { @include btn; }       ← default applied
```

The `.btn` class is available for prototyping and inspector experimentation.
In production, projects use semantic selectors instead.

### Global `<button>` — Structure + Neutral (Out of the Box)

Every `<button>` gets **full structure + neutral colors** from `scss/base/_global.scss`:

- Structure: inline-flex, centered, `px(1.25rem) py(0.625rem)`, text-sm, font-medium, rounded-md
- Default: transparent background, muted text color
- Hover: light gray background (`bg-secondary`), primary text
- Active: border-color background
- Focus-visible: focus ring
- Disabled: 50% opacity

Cancel, close, toggle, icon buttons all look usable **without any class or mixin**.

### `<button type="submit">` — Color Only (Structure Inherited)

Submit buttons automatically get primary color on top of the global structure:

- Background: solid `hsl(var(--color-primary))`, white text
- Hover: `hsl(var(--color-primary-hover))` — color change only, no transform
- Active: same primary-hover color

```html
<!-- Cancel: neutral from global (no class needed) -->
<button type="button">Cancel</button>

<!-- Save: primary from type="submit" (no class needed) -->
<button type="submit">Save</button>
```

### `@mixin btn` — Explicit Action Button

For non-submit action buttons that need primary styling. Includes full structure + colors:

```scss
// Project SCSS — non-submit action buttons
#add-user            { @include btn; }
#export-data         { @include btn; }

// Color variant — override token on element or parent
#delete-user         { @include btn; --color-primary: var(--color-error); }
#confirm-delete      { --color-primary: var(--color-error); }  // affects submit too
```

### Size Variants

```scss
#compact-action { @include btn; @include btn-sm; }
#hero-cta       { @include btn; @include btn-lg; }
```

### Icon / Close Buttons

`@include close-button` resets padding to 0 and sets a fixed 2rem size — overrides the global structure padding. Use for any icon-only button.

### Rules

- **No `btn--*` variant classes** in ln-acme — use `--color-primary` override
- **No `translateY` or `box-shadow` on hover** — color change only
- **ZERO hardcoded colors** — every color reads `var(--token)`
- Production HTML uses semantic selectors, not `.btn` class
- `.btn` class exists for prototyping/inspector use only

## Modal Architecture

`<form>` is always the content root — no wrapper `<div>`, no BEM classes. Styled via `.ln-modal > form`.
`data-ln-modal` attribute is the single source of truth for open/closed state.

```html
<button data-ln-modal-for="my-modal">Open</button>

<div class="ln-modal" data-ln-modal id="my-modal">
    <form>
        <header><h3>Title</h3><button type="button" aria-label="Close" data-ln-modal-close><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button></header>
        <main>...</main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save</button>
        </footer>
    </form>
</div>
```

- **`data-ln-modal`** on modal element = creates instance, value = state ("open"/"close")
- **`data-ln-modal-for="id"`** on trigger button = references modal by ID
- **`<form>` is the root** — footer buttons (Cancel, Submit) are inside the form
- **Cancel** (`type="button"`) gets neutral style from global — no class needed
- **Save** (`type="submit"`) gets primary filled style from global — no class needed
- **Non-submit buttons** need `type="button"` (close, cancel) to prevent form submission
- **No `.ln-modal__content` class** — select semantically: `.ln-modal > form`
- **Sizes** via mixins: `#my-modal > form { @include modal-lg; }` — not CSS classes
- Available: `modal-sm` (28rem), `modal-md` (32rem), `modal-lg` (42rem), `modal-xl` (48rem)
- **API** — `modal.lnModal.open()` / `.close()` just set the attribute, observer applies state
- **Direct attribute** — `modal.setAttribute('data-ln-modal', 'open')` — identical result
- **ESC listener** active only while modal is open (zero listeners when all closed)

## Button Groups vs Pill Groups

Two distinct grouping patterns:

- **`@include btn-group`** — action buttons with small gap (toolbars, table actions)
- **`@include pill-group`** — joined pills without gap, border-radius on first/last only (radio/checkbox)

```html
<!-- Action buttons -->
<ul>
  <li><button aria-label="Edit"><svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg></button></li>
  <li><button aria-label="Delete"><svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg></button></li>
</ul>

<!-- Pill radio -->
<ul>
  <li><label><input type="radio" name="role" value="admin"> Admin</label></li>
  <li><label><input type="radio" name="role" value="editor"> Editor</label></li>
</ul>
```

```scss
// Project SCSS — apply grouping via semantic selector
#users td:last-child ul { @include btn-group; }
#role-filter ul          { @include pill-group; }
```

- **Filled** (default) — gray bg, colored bg on checked, input hidden
- **Outline** — `@include pill-outline` on parent → bordered, visible input indicator
- **Color** — override `--color-primary` on parent for different colors

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
| Structural class (`.form-element`, `.form-actions`, `.collapsible`) | yes | yes — applied to class |
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
2. Follow the IIFE pattern — import helpers from `ln-core`:
   ```js
   import { dispatch, dispatchCancelable } from '../ln-core';
   ```
3. Add `data-ln-{name}` data attribute
4. If CSS needed, create `js/ln-{name}/ln-{name}.scss`
5. Add `import './ln-{name}/ln-{name}.js'` to `js/index.js`
6. DOM structure → `<template>` elements in HTML
7. Create `js/ln-{name}/README.md` — usage guide (attributes, events, API, HTML examples)
8. Create `docs/js/{name}.md` — architecture reference (internal state, render flow, event lifecycle)
9. Create `demo/admin/{name}.html` — interactive demo page
10. Detailed architecture: [js/COMPONENTS.md](js/COMPONENTS.md)

## Updating an Existing JS Component

When modifying component behavior (attributes, events, API, HTML structure):

1. Update `js/ln-{name}/README.md` — reflect new/changed usage
2. Update `docs/js/{name}.md` — reflect architectural changes
3. Update `demo/admin/{name}.html` — add/update interactive examples

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

Icons use SVG sprite injection — `ln-icons.js` builds a hidden `<svg>` sprite from `js/ln-icons/icons/*.svg`
and inserts it into `<body>` at init. Icons render via `<use href="#ln-{name}">` and inherit `currentColor`.

```html
<!-- Standalone icon -->
<svg class="ln-icon" aria-hidden="true"><use href="#ln-plus"></use></svg>

<!-- Icon in button with text -->
<button>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-plus"></use></svg>
    Add
</button>

<!-- Icon-only button — aria-label required -->
<button aria-label="Close">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
</button>

<!-- Accordion chevron (CSS rotates it on open) -->
<header data-ln-toggle-for="panel1">
    Title
    <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
</header>
```

Any icon from [Tabler Icons](https://tabler.io/icons) works — use the Tabler name after `ln-`:
`home` `x` `menu` `users` `settings` `logout` `books`
`plus` `edit` `trash` `eye` `device-floppy` `search` `check` `copy` `link` `filter` `calendar`
`upload` `download` `refresh` `printer` `lock` `star` `arrow-up` `arrow-down` `arrows-sort`
`chart-bar` `clock` `mail` `book` `world` `list` `box` `building` `alert-triangle`
`info-circle` `circle-x` `circle-check` `user` `phone` `square-compass`
`file`

Full name list: `scss/tabler-icons.txt`

Custom icons (not in Tabler) use `#lnc-` prefix and are served from `window.LN_ICONS_CUSTOM_CDN`:
`lnc-file-pdf` `lnc-file-doc` `lnc-file-epub`

Sizes: `ln-icon--sm` (1rem), default (1.25rem), `ln-icon--lg` (1.5rem), `ln-icon--xl` (4rem).

Color: icons follow the parent's `color` property automatically. Exception: `lnc-file-pdf`, `lnc-file-doc`,
`lnc-file-epub` have embedded semantic stroke colors.

To add a custom icon: add SVG to `js/ln-icons/icons/{name}.svg`, run `npm run build`,
upload `dist/icons/{name}.svg` to custom CDN, use as `#lnc-{name}`.

---

## Reactive Architecture

See [docs/js/core.md](docs/js/core.md) for the reactive rendering layer: ln-core shared helpers, Proxy-based state, fill/renderList, attribute bridge pattern.

---

## Known Backlog

- **ln-select** — depends on TomSelect (peer dependency)