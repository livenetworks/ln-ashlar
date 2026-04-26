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
│   │   ├── _btn.scss        ← btn, btn-sm, btn-lg, btn-group
│   │   ├── _table.scss      ← table-base, table-responsive, table-striped, ...
│   │   ├── _card.scss       ← card, card-accent-*, card-bg, card-stacked, panel-header, section-card
│   │   ├── _footer.scss     ← shared shell-footer chrome (app-footer + sidebar > footer)
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
npm run build        # Build library into demo/dist/ + compile demo pages
npm run dev          # Watch mode (library only)
```

`npm run build` bundles the library into `demo/dist/` via Vite, then
compiles the demo pages (index, admin, docuflow). `npm run dev`
watches the library only; demos are rebuilt on the next full build.

Output (demo-only — not a public consumption path):
- `demo/dist/ln-acme.css` — everything included
- `demo/dist/ln-acme.js` — ES module
- `demo/dist/ln-acme.iife.js` — for `<script>` tag

---

## Project Integration

ln-acme is a **source-only** package. Consumers import SCSS and JS
source files directly and run their own bundler (Vite, Webpack, etc).
The `demo/dist/` artefact exists for the demo site only — do not point
projects at it.

### npm
```js
// SCSS — import from source
@use 'ln-acme/scss/ln-acme.scss';

// JS — import from source
import 'ln-acme/js/index.js';
```

### Git submodule
```bash
git submodule add .../ln-acme.git resources/ln-acme
```

Then `@use 'resources/ln-acme/scss/ln-acme.scss'` and
`import 'resources/ln-acme/js/index.js'` from the project.

---

## Button Architecture

### Core Principle

Structure is **global**. Color is **semantic** (`type="submit"`) or **explicit** (`@include btn`).

```
scss/config/mixins/_btn.scss    →  @mixin btn { ... }           ← recipe
scss/components/_button.scss    →  .btn { @include btn; }       ← default applied
```

The `.btn` class is available for prototyping and inspector experimentation.
In production, projects use semantic selectors instead.

### Global `<button>` — Structure + Neutral (Out of the Box)

Every `<button>` gets full structure and neutral colors from `scss/base/_global.scss` — inline-flex layout, consistent padding, hover and focus states. Cancel, close, toggle, and icon buttons all look usable **without any class or mixin**. See `scss/base/_global.scss` for the implementation and `@mixin btn` in `scss/config/mixins/_btn.scss` for the reusable structure recipe.

### `<button type="submit">` — Color Only (Structure Inherited)

Submit buttons automatically get primary color on top of the global structure — color change only, no transform. No class needed.

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

Size variants available via `btn-sm` and `btn-lg` mixins (see `scss/config/mixins/_btn.scss`).

### Icon / Close Buttons

Icon-only close/dismiss buttons inherit the global `<button>` base styles. Re-bind `--padding-y` and `--padding-x` on the parent scope's descendant `button` selector to tighten the tap area:

```scss
.my-component {
    button.close { --padding-y: var(--size-2xs); --padding-x: var(--size-2xs); }
}
```

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
- Size variants: `modal-sm`, `modal-md`, `modal-lg`, `modal-xl` — see `scss/config/mixins/_modal.scss` for values.
- **Entry animation** — modal panel slides in on open via the `ln-modal-slideIn` keyframe, gated through `motion-safe` so reduced-motion users see an instant state change. Keyframe and duration live in `scss/components/_modal.scss` and `scss/config/mixins/_modal.scss`.
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
- **Prototype class** — `.btn-group` is shipped as a CSS class for prototyping and inspector experimentation (parallels `.btn`). Production HTML uses semantic selectors with `@include btn-group`, not the class.

## SCSS Architecture — Two Layers

Every visual style has **two layers**: a mixin (recipe) and a component (application).

```
scss/config/mixins/_table.scss      →  @mixin table-base { ... }         ← recipe
scss/components/_table.scss         →  table { @include table-base; }    ← applied
```

**Mixins** (`scss/config/mixins/`) — define HOW something looks. Never generate CSS by themselves.
**Components** (`scss/components/`) — apply mixins to default selectors. Generate CSS.

| Situation | Mixin | Component |
|---|---|---|
| Universal element (`label`, `table`, `input`) | yes | yes — applied to element selector |
| Page-level singleton | yes | yes — applied to `.class` (prototype-tier) |
| Structural class (`.form-element`, `.form-actions`, `.collapsible`) | yes | yes — applied to class |
| Data-attr JS component (`[data-ln-tabs]`) | not needed | yes — selector is the attribute |

Projects apply the mixin to their own semantic selector (`#my-breadcrumbs { @include breadcrumbs; }`).

**Projects override** by using the same mixin on their own selector:
```scss
// project — different table styling for a specific table
#audit-log { @include table-base; @include table-striped; }
#audit-log thead { display: none; } // no header for this one
```

### Co-located JS SCSS (`js/ln-*/`)

Co-located SCSS in JS component folders is ONLY for JS-state-driven CSS that
cannot exist without the JS component:
- Hide/show attributes: `[data-ln-*-hide] { display: none !important; }`
- State transitions that JS controls directly

Visual styling (padding, border, colors, layout, typography, shadows, z-index)
ALWAYS belongs in the two-layer architecture:
- Mixin: `scss/config/mixins/_component.scss`
- Component: `scss/components/_component.scss`

If a JS component needs visual styling, extract it into a mixin + component.
The co-located SCSS should be minimal or empty.

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

## Using Existing JS Components

Before using any `data-ln-*` attribute in HTML:
1. Read `js/ln-{name}/README.md` — check the Attributes table for correct element placement
2. Check Examples section for correct HTML structure
3. Before creating a new data attribute → verify no existing component provides the functionality

## Explain Approach Before Implementing

For new or substantial work (new mixin, new component, new pattern, architectural change),
present the implementation approach **before writing any code**:

- **SCSS**: "Create `@mixin X` in `scss/config/mixins/`, apply in `scss/components/` on `[selector]`, project uses `@include X` on `#element`"
- **JS**: "Component uses `data-ln-X` on `<element>`, dispatches event Y, project wires via Z"
- **HTML**: "Structure is `<parent> > <child>`, component X on `<element>`, styled via mixin Y"

Cover all layers touched. Wait for confirmation before executing.
This does NOT apply to trivial fixes or established patterns — only new/substantial work.

## Override Architecture

ln-acme ships two layers: **mixins** (recipes) + **components** (defaults applied to selectors).
Projects can override at any level:

1. **Use the default** → do nothing, library CSS works out of the box
2. **Color change** → override CSS variable: `.my-section { --color-primary: var(--color-error); }`
3. **Structure tweak** → re-apply mixin with modifications on a project selector
4. **Full replace** → exclude the component, use only the mixin on a custom selector
5. **Project selectors never change** — they describe WHAT, not HOW

## Theme Architecture

Themes (e.g. `[data-theme="glass"]`) are a **palette layer**, not a structural
layer. They override colors via token rebinds at the theme `:root` scope.
They do NOT redeclare component structure (`background`, `color`,
`border-color`, hover/active blocks).

### Rule — themes rebind at theme `:root`, never via descendant selectors

```scss
// RIGHT — palette rebind at theme :root only
[data-theme="glass"] {
	--color-bg-raised:    hsl(var(--color-neutral-950));
	--color-accent-bg:    hsl(var(--color-primary) / 0.5);
	--color-accent-bg-fg: hsl(var(--color-primary));
	// ...
}

// WRONG — descendant selector at higher specificity, structural override
[data-theme="glass"] .btn {
	background: hsl(var(--color-primary-lighter));
	color: hsl(var(--color-primary));
	border-color: hsl(var(--color-primary));
	&:hover:not(:disabled) { ... }
	&:active:not(:disabled) { ... }
}
```

**Why:** the WRONG form wins via 0,2,0 specificity over the library's
`.btn` (0,1,0) — that is a specificity hack, not a token rebind. It
locks the theme into redeclaring everything the library already does,
and any library change to button structure needs a parallel theme
change. The RIGHT form lets the library own structure; the theme just
shifts the palette through tokens the library is already designed to
consume.

### Companion logical tokens for theme-shift-able properties

When a property must differ between themes but no logical token
currently exposes it, ADD the missing token with a fallback pattern
in the consumer mixin. Do not escalate specificity.

```scss
// @mixin btn — reads via fallback so default theme stays solid
--btn-bg:           var(--color-accent-bg,    var(--color-accent));
--btn-fg:           var(--color-accent-bg-fg, var(--color-accent-fg));
--btn-bg-hover:     var(--color-accent-bg-hover, var(--color-accent-hover));
--btn-fg-hover:     var(--color-accent-bg-fg, var(--color-accent-fg));

// Default theme — no companion override; mixin falls back to --color-accent / --color-accent-fg (= solid + white)

// Glass theme — rebind companions at theme :root
[data-theme="glass"] {
	--color-accent-bg:       hsl(var(--color-primary) / 0.5);
	--color-accent-bg-hover: hsl(var(--color-primary-hover) / 0.6);
	--color-accent-bg-fg:    hsl(var(--color-primary));
	// --color-accent-fg stays at :root default (white) — solid-accent
	// surfaces (toast-side, pill-checked, stepper-active) keep white
	// text on solid primary fill.
}
```

**Solid vs translucent accent surface — separate fg tokens.** The
`--color-accent-*` family distinguishes two flavors of accent surface:

- **Solid** (`--color-accent` + `--color-accent-fg`) — used by
  `@mixin toast-side`, `@mixin pill` (checked state), stepper active /
  complete, and `@mixin btn` under default theme. fg = white.
- **Translucent** (`--color-accent-bg` + `--color-accent-bg-fg`) — only
  used by `@mixin btn` under themes that opt in (Glass). fg flips to
  match accent (`--color-primary`) for legibility on the translucent
  fill.

Themes that introduce the translucent variant rebind the `-bg-*`
companions ONLY. They leave `--color-accent-fg` alone so solid-accent
surfaces are unaffected. Conflating them (e.g. Glass setting
`--color-accent-fg: hsl(var(--color-primary))` at :root) collapses
toast/pill/stepper text to invisible primary-on-primary.

The fallback pattern makes theme overrides transparent: default theme
has no companion → mixin reads `var(--color-accent)` (solid). Glass
rebinds → mixin reads the translucent value. The cascade through
`.success`/`.error`/`.warning`/`.info` still works because `var()`
resolves at the consumer element, and `--color-primary` re-resolves
there.

Companion tokens live in the cross-cutting `--color-accent-*` family
in the logical token surface. They are NOT `--btn-accent-*`
per-component-surface tokens (those would freeze at `:root` and break
the semantic-color cascade — see `scss/config/mixins/_btn.scss` header).

### What NOT to do (themes)

- Do not write `[data-theme="..."] .selector { background: ... }`. Rebind tokens at theme `:root` instead.
- Do not duplicate `&:hover`/`&:active` blocks in theme overrides — the library's base mixin handles them via `*-hover` companion tokens.
- Do not introduce `--btn-accent-*` or any other per-component-surface companion at `:root`. Use cross-cutting `--color-accent-*` companions read via fallback inside the mixin.

## Changing Design Tokens

1. Edit `scss/config/_tokens.scss`
2. Verify that referencing mixins are updated
3. Confirm build passes: `npm run build`

---

## Size Tokens — Single Source of Truth

All spacing values (padding, margin, gap, inset, positional offsets used
for layout) reference `--size-*` CSS variables defined in
`scss/config/_tokens.scss`. No raw `rem` / `px` literals in spacing
contexts. No per-component token families (no `--btn-py`, `--card-gap`,
no private mixin-scoped `--_*`).

**Why.** Change one token, every consumer reacts. Raw literals are
silent divergence — updating `--size-md` does not cascade into `1rem`
written directly into a mixin. Per-component tokens (`--btn-py`,
`--modal-pad`) defeat the same purpose in reverse: touching one
component forces touching its private tokens, not the scale.

**Mixins read logical tokens, not scale tokens.** Mixin bodies use
`--padding-x`, `--padding-y`, `--gap`, `--radius`, `--color-bg`,
`--color-fg`, `--color-border`, `--color-accent`, `--shadow-default`,
etc. — the semantic public contract. The `--size-*` scale is back-end
plumbing read only by `:root`, `.density-compact`, and region scopes
that re-bind the logical tokens. See
`.claude/plans/refactor-logical-tokens-architecture.md` for the full
contract.

**When you need a new spacing value — extend, don't silo.** Extend
`--size-*`. Never create a component-scoped token. Use the t-shirt
naming convention with `-up` / `-down` suffixes for intermediate steps:

`0 < 2xs < xs < xs-up < sm < sm-up < md < md-up < lg < xl < 2xl < 3xl`

(12 canonical steps.)

**Monotonic ordering in compact mode.** Every addition to `--size-*`
MUST be mirrored in `scss/config/_density.scss` under `.density-compact`
with a value that preserves ascending order across the whole scale. A
compact value that inverts ordering (e.g. `md-up=20` while `lg=16`)
breaks any component that uses both.

**Exceptions (allowed literals).**

- `0` as unitless zero (or use `var(--size-0)` for clarity).
- `1px` / `2px` borders go through `--border-width` /
  `--border-width-strong`.
- Intrinsic values: `100%`, `100vh`, `auto`, fractions (`1fr`, `50%`),
  `9999px` for full radius.
- Genuinely component-intrinsic dimensions — icon sizes, avatar sizes,
  toggle-switch geometry, stepper-node, timeline-bullet, modal
  max-widths, toast widths, popover/dropdown/tooltip min-/max-widths,
  loader width/height. These are component design, not spacing rhythm.
- Font sizes / line heights / letter spacing use their own scales
  (`--text-*`, `--lh-*`, `--tracking-*`).

**Logical color + shadow tokens (Phase 5 additions).** Beyond
`--color-bg`, `--color-fg`, `--color-border`, `--color-accent`, the
library also exposes:

- `--color-border-strong` / `-hover` — stronger neutral edge for button
  borders and outlined controls.
- `--color-bg-recessed` — sunken surface for code blocks, progress
  tracks, chip fills.
- `--color-scrim` — modal overlay.
- `--color-accent-tint` / `-strong` — subtle accent washes (upload
  hover, active nav background).
- `--shadow-default` (resting), `--shadow-raised` (floating),
  `--shadow-overlay` (modal).

Every mixin read must go through the logical layer, not a scale token
directly. Consumers override logical tokens at `:root` or at a region
scope.

---

## Logical Token Surface — Component Contract

Mixin bodies read ONLY the logical tokens listed below. The
back-end scales (`--size-*`, `--color-neutral-*`, `--color-primary*`,
`--color-bg-*`, `--shadow-xs`…`2xl`, `--text-body-*`, `--lh-body-*`)
are plumbing — they live in `_tokens.scss` and are re-bound by
density / theme / region scopes. Mixins never touch them directly.

### The logical tokens (public contract)

Structure and rhythm:

- `--padding-x`, `--padding-y` — default horizontal / vertical chrome
- `--gap` — flex/grid gap between siblings
- `--radius` — default corner radius
- `--border-width` — default border stroke (also
  `--border-width-strong`)

Surface colors:

- `--color-bg` — element surface
- `--color-bg-raised` — elevated surface (dropdowns, popovers,
  floating panels)
- `--color-bg-sunken` — recessed surface (body behind cards, `thead`)
- `--color-bg-recessed` — sunken fill (code blocks, progress tracks,
  chip fills)
- `--color-fg` — primary text
- `--color-fg-muted` — secondary text
- `--color-fg-subtle` — disabled / helper text
- `--color-border-subtle` — dividers, floating-panel edges
- `--color-border-strong`, `--color-border-strong-hover` — button
  borders, outlined controls
- `--color-scrim` — modal overlay

Accent:

- `--color-accent`, `--color-accent-hover`, `--color-accent-fg`
- `--color-accent-tint`, `--color-accent-tint-strong` — subtle accent
  washes (upload hover, active nav background)

Buttons:

- `--btn-bg`, `--btn-fg`, `--btn-border` — default (neutral) button
  surface read by `@mixin button-base`.
- `--btn-bg-hover`, `--btn-fg-hover`, `--btn-border-hover` — hover /
  active states for the neutral surface.

The accent variant (`button[type="submit"]` + `@mixin btn`) is also
fully token-driven through the same `--btn-*` surface — the variant
rebinds `--btn-*` on the consumer element (not at `:root`):

```scss
@mixin btn {
    --color-accent:       hsl(var(--color-primary));
    --color-accent-hover: hsl(var(--color-primary-hover));
    --color-accent-fg:    hsl(var(--color-white));

    --btn-bg:           var(--color-accent);
    --btn-fg:           var(--color-accent-fg);
    --btn-border:       var(--color-accent);
    --btn-bg-hover:     var(--color-accent-hover);
    --btn-fg-hover:     var(--color-accent-fg);
    --btn-border-hover: var(--color-accent-hover);
}
```

Why this preserves the semantic-color cascade: `var()` resolves at the
**declaration site**. When `.success { --color-primary: ...; }` is on
the button element, `@mixin btn`'s rebinds resolve `var(--color-primary)`
→ `--color-accent` → `--btn-*` all at the same element scope. A
companion `--btn-accent-*` surface AT `:root` would freeze
`--color-accent` at `:root` and break `.success`/`.error`/`.warning`/`.info`
— the fix is consumer-scoped rebinding (inside a mixin body), not a
parallel `:root` surface.

Override targets:

- Whole-theme accent shift → rebind `--color-primary` at theme scope.
- Single button color variant → rebind `--color-primary` on the
  element or parent (e.g. `.delete-action { --color-primary: var(--color-error); }`).
- Theme-specific button palette (e.g. Glass translucent fill) → rebind
  `--color-accent-bg` / `--color-accent-bg-hover` / `--color-accent-bg-fg`
  at the theme `:root`
  scope (`[data-theme="glass"] { ... }`). Never on a descendant
  selector — see `## Theme Architecture` for the full rule.

See `scss/config/mixins/_btn.scss` header for the full cascade
rationale.

Typography:

- `--font-size`, `--line-height`

Motion and depth:

- `--shadow-default` (resting: cards, tables, stat-cards)
- `--shadow-raised` (floating: tooltips, dropdowns, popovers)
- `--shadow-overlay` (modal)
- `--transition`

Per-side borders (soft — NO `:root` default):

- `--border-block-start` — replaces `border-top` for joinable surfaces
- `--border-block-end` — replaces `border-bottom`
- `--border-inline-start` — replaces `border-left` (LTR)
- `--border-inline-end` — replaces `border-right` (LTR)

These four tokens have NO default in `:root`. Mixins read them with
a per-mixin fallback (`var(--border-block-end, <fallback>)`), so a
scope that does NOT re-bind them inherits exactly the mixin's
existing border. A scope that re-binds e.g. `--border-block-start: none`
on `.joined-stack > * + *` flattens the top edge of every joined
sibling so they share a single rule.

Migrated mixins (read soft tokens): `border`, `border-t/-b/-l/-r`,
`border-light`, `border-t-light`, `border-b-light`, `card`,
`section-card`, `floating-panel`, `panel-header`, `panel-footer`,
`section`, `stat-card`, `page-header`, `app-header`, `app-footer`,
`accordion` (items), `dropdown-menu` (hr separator), `table-base`
(thead, td), `data-table` (tfoot, filter-dropdown), `sidebar`
(header, footer, right edge — via `border-r/-b/-t`), `tabs-nav` (via
`border-b`).

NOT migrated (intentional — accent personality or non-joinable):
`btn` / `button-base`, `pill-outline`, `form-check`, `alert` (left
accent + banner variant — both tinted), `tabs-tab` (underline
indicator),
`kbd`, `upload-zone` (dashed), `upload-item`, `card-stacked`
(decorative ::after), `card-accent-top/-bottom/-left`.

### Rule — mixins read the logical layer

```scss
// RIGHT — mixin body reads logical tokens
@mixin card {
	padding: var(--padding-y) var(--padding-x);
	background: var(--color-bg);
	color: var(--color-fg);
	border: var(--border-width) solid var(--color-border-subtle);
	border-radius: var(--radius);
	box-shadow: var(--shadow-default);
	transition: var(--transition);
}

// WRONG — mixin body reaches through to the scale
@mixin card {
	padding: var(--size-xs-up) var(--size-md-up);                // scale
	background: hsl(var(--color-bg-primary));                     // scale
	border: 1px solid hsl(var(--color-neutral-200));              // scale + literal
	box-shadow: var(--shadow-sm);                                  // scale
}
```

### Rule — context overrides re-bind the logical token

A region that needs tighter vertical rhythm re-binds
`--padding-y` on the region root; every descendant that reads
`--padding-y` (inputs, buttons, cells, panel headers) adapts via
the cascade:

```scss
.dense-region {
	--padding-y:  var(--size-xs);
	--gap:        var(--size-xs-up);
	--font-size:  var(--text-body-sm);
}
```

Same mechanism as `.density-compact`, theme overrides, and status
re-binds (`.alert-warn { --color-accent: hsl(var(--color-warning)); }`).

### Rule — `:root` wires logical → scale

The `:root` block in `_tokens.scss` is the only place outside
density/theme scopes that wires a logical token to a back-end
scale token. That wiring lives at the bottom of `_tokens.scss`
under `// Logical tokens — the public contract mixins read`.
Editing the wiring changes every mixin's default reading in one
edit.

### Rule — variants rebind the surface, don't redeclare properties

When a base mixin reads from a `--component-*` token surface (e.g.
`@mixin button-base` reads `--btn-bg` / `--btn-fg` / `--btn-border`
plus `-hover` companions), a VARIANT of that base rebinds those
tokens — it does NOT declare `background:` / `color:` /
`border-color:` directly, and does NOT duplicate the
`&:hover` / `&:active` blocks the base already provides.

```scss
// RIGHT — variant rebinds the --btn-* surface
@mixin btn {
	--color-accent:       hsl(var(--color-primary));
	--color-accent-hover: hsl(var(--color-primary-hover));
	--color-accent-fg:    hsl(var(--color-white));

	--btn-bg:           var(--color-accent);
	--btn-fg:           var(--color-accent-fg);
	--btn-border:       var(--color-accent);
	--btn-bg-hover:     var(--color-accent-hover);
	--btn-fg-hover:     var(--color-accent-fg);
	--btn-border-hover: var(--color-accent-hover);
}

// WRONG — variant bypasses the surface, duplicates base behavior
@mixin btn {
	background: var(--color-accent);
	color: var(--color-accent-fg);
	border-color: var(--color-accent);

	&:hover:not(:disabled) {
		background: var(--color-accent-hover);
		color: var(--color-accent-fg);
		border-color: var(--color-accent-hover);
	}
	&:active:not(:disabled) { /* duplicate */ }
}
```

**Why.** Two reasons stack on top of each other:

1. **No duplication of base behavior.** The base mixin already
   declares `background` / `color` / `border-color` and
   `&:hover` / `&:active`. A variant that re-declares those
   properties duplicates the contract — every future change to the
   base (a new state, a transition tweak, a focus rule) has to be
   mirrored manually into the variant. Rebinding the surface tokens
   inherits all of that automatically.

2. **The semantic-color cascade still works.** A natural worry with
   token indirection is "won't the intermediate token freeze the
   value?" The answer: no, as long as the rebind happens INSIDE THE
   VARIANT MIXIN BODY (consumer scope), not at `:root`. `var()`
   resolves at the **declaration site**. When the variant rebind
   lands on the consumer element (the same element where the base
   reads), descendant overrides (`.success { --color-primary: ...; }`)
   re-resolve through the variant's rebind chain cleanly. The freeze
   only happens when the intermediate token is declared at `:root` —
   which is why `--component-accent-*` companion surfaces at `:root`
   are the wrong fix.

**Concrete cascade for `<button class="btn success">`:**

1. `.success { --color-primary: ...; }` rebinds at consumer.
2. `@mixin btn` body declares `--color-accent: hsl(var(--color-primary))`
   at consumer — resolves through `.success`.
3. `@mixin btn` body declares `--btn-bg: var(--color-accent)` at
   consumer — resolves through step 2.
4. `@mixin button-base` reads `background: var(--btn-bg)` at consumer
   — resolves through step 3.

Every step resolves at the consumer element, so the cascade lands.

**Applies to any base/variant pair using a token surface.** Today this
is `button-base` ↔ `btn`. As more components grow `--component-*`
surfaces, the same rule applies — a future `card-accent` variant
rebinds `--card-bg` / `--card-fg`, not declares them directly.

### What NOT to do

- Do not read `--size-*` inside a mixin body. Read `--padding-*`,
  `--gap`, or `--radius` instead.
- Do not read `--color-neutral-*` inside a mixin body. Read
  `--color-bg`, `--color-fg`, `--color-border-*`, or
  `--color-bg-recessed` instead.
- Do not read `--color-primary*` inside a mixin body. Read
  `--color-accent`, `--color-accent-hover`, `--color-accent-fg`,
  or `--color-accent-tint*` instead.
- Do not read `--shadow-xs…2xl` inside a mixin body. Read
  `--shadow-default`, `--shadow-raised`, or `--shadow-overlay`.
- Do not introduce a per-component logical token
  (`--card-padding-y`, `--btn-gap`). Re-bind the shared logical
  token on the component's root selector instead.
- Do not declare `background:`, `color:`, or `border-color:`
  directly inside a variant mixin when the base mixin reads from a
  `--component-*` token surface (e.g. `@mixin button-base` reads
  `--btn-*`). Rebind the surface tokens instead — `--btn-bg:
  var(--color-accent);` not `background: var(--color-accent);`.
  Direct property declarations duplicate what the base already does
  and bypass the surface that themes/variants override. See the
  "Rule — variants rebind the surface, don't redeclare properties"
  subsection above.

---

## Breakpoint Tokens — Use the Mixin, Not the Literal

All responsive breakpoints resolve through `@mixin mq-up / mq-down /
cq-up / cq-down` (defined in `scss/config/mixins/_breakpoints.scss`).
Never hardcode px values inside `@media` or `@container` in library
code.

```scss
// RIGHT — token-driven
@include mq-up(md)                        { ... }
@include cq-up(medium, page-header)       { ... }
@include cq-down(compact)                 { ... }   // anonymous container

// WRONG — orphan literal
@media (min-width: 768px)                 { ... }
@container page-header (min-width: 880px) { ... }
```

**Media vs container — when to use which:**

- **`mq-*` (viewport)** — app-shell patterns only: `.container`
  utility, sidebar-drawer, page columns, modal backdrop sizing.
  Anything directly coupled to viewport geometry.
- **`cq-*` (container)** — reusable components: grids, form-grid,
  page-header, cards, any mixin a project might drop into a
  sidebar / main / card / modal.

**Container registration is the mixin's job.** A mixin that uses
`cq-*` internally must declare `container-type: inline-size` (and
`container-name: <name>` if not anonymous) on the selector it styles
— the consumer should not have to register containers manually.

**Exceptions (allowed raw `@media`).**

- `prefers-color-scheme` in `_theme.scss` — OS-level, not a breakpoint.
- `prefers-reduced-motion` in `_motion.scss` / `_translations.scss`
  — OS-level, not a breakpoint.

**When you need a new breakpoint — extend the map, don't silo.**
Add to `$breakpoints` in `scss/config/_breakpoints.scss`. Never
hardcode a value in a component.

---

## Icons

Icons use SVG sprite injection — `ln-icons.js` fetches icons on demand from Tabler CDN (pinned to `@3.31.0`),
builds a hidden `<svg>` sprite, and inserts it into `<body>` at init. Fetched SVGs are cached in `localStorage`
(prefix `lni:`) — subsequent page loads resolve from cache with zero network requests. Icons render via
`<use href="#ln-{name}">` and inherit `currentColor`.

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

