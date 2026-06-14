# ln-ashlar Architectural Reference

This document contains the detailed architectural patterns, specifications, and design guidelines for the `ln-ashlar` library components, styles, themes, tokens, and reactive systems.

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

Icon-only close/dismiss and toggle buttons inherit the global `<button>` base styles. Rebind `--btn-padding-y` and `--btn-padding-x` directly on the button selectors inside specific containers (like card/panel headers) to tighten the tap area:

```scss
.my-component-header {
	button.close {
		--btn-padding-y: var(--size-2xs);
		--btn-padding-x: var(--size-2xs);
	}
}
```

Redefining the customization hooks (`--btn-padding-x` and `--btn-padding-y`) locally ensures that the button's internal mapping resolves dynamically without needing parent-selector-driven layout overrides on generic `button` elements, preserving the standard cascade behavior.

### Rules

- **No `btn--*` variant classes** in ln-ashlar — use `--color-primary` override
- **No `translateY` or `box-shadow` on hover** — color change only
- **ZERO hardcoded colors** — every color reads `var(--token)`
- Production HTML uses semantic selectors, not `.btn` class
- `.btn` class exists for prototyping/inspector use only

---

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
- **Attribute is the contract** — write `data-ln-modal="open"` or `"close"` on the modal element. Observer applies state, dispatches events.
- **ESC listener** active only while modal is open (zero listeners when all closed)

---

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

---

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

### CSS/JS Hook Boundary

Three tiers:

1. **Decorating via a hook's bare presence is forbidden.**
   `[data-ln-modal] { padding: ... }` — the attribute is a JS init target, not a CSS selector.

2. **A component styling its OWN state expressed as `data-ln-x="value"` in its OWN co-located `js/ln-x/ln-x.scss` is sanctioned** — the dominant library pattern. The component owns both sides of the contract. Examples: `[data-ln-modal="open"] { display: flex }`, `[data-ln-popover="open"] { display: block }`, `[data-ln-filter-hide="true"] { display: none }`. These are attribute-value selectors (state encoded in the value), not presence selectors.

3. **Consumer/app/cross-component CSS reaching through a foreign `data-ln-*` hook is forbidden.** Use a `.ln-*` state class (JS toggles, SCSS styles) or a plain app-owned `data-*`. App state must not enter the `data-ln-*` namespace.

Practical test: *who owns this state, and where does the rule live?* Component's own state → `data-ln-x="value"` styled in co-located SCSS. App/coordinator state → app-owned `data-*` or `.ln-*` class, styled in app SCSS.

---

## Adding a New SCSS Mixin + Component

1. Create `scss/config/mixins/_new-component.scss` with `@mixin new-component { ... }`
2. Register in `scss/config/mixins/_index.scss` with `@forward 'new-component'`
3. Update `scss/config/_mixins.scss` header comment
4. Create `scss/components/_new-component.scss` that applies the mixin:
   ```scss
   @use '../config/mixins' as *;
   #new-component { @include new-component; }
   ```
5. Add `@use 'components/new-component'` to `scss/ln-ashlar.scss`
6. Use `@include` mixins for properties, `var(--token)` for values — **NEVER** hardcoded colors

---

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
10. Detailed architecture: [docs/js/component-guide.md](../js/component-guide.md)

---

## Updating an Existing JS Component

When modifying component behavior (attributes, events, API, HTML structure):

1. Update `js/ln-{name}/README.md` — reflect new/changed usage
2. Update `docs/js/{name}.md` — reflect architectural changes
3. Update `demo/admin/{name}.html` — add/update interactive examples

---

## Using Existing JS Components

Before using any `data-ln-*` attribute in HTML:
1. Read `js/ln-{name}/README.md` — check the Attributes table for correct element placement
2. Check Examples section for correct HTML structure
3. Before creating a new data attribute → verify no existing component provides the functionality

---

## Explain Approach Before Implementing

For new or substantial work (new mixin, new component, new pattern, architectural change),
present the implementation approach **before writing any code**:

- **SCSS**: "Create `@mixin X` in `scss/config/mixins/`, apply in `scss/components/` on `[selector]`, project uses `@include X` on `#element`"
- **JS**: "Component uses `data-ln-X` on `<element>`, dispatches event Y, project wires via Z"
- **HTML**: "Structure is `<parent> > <child>`, component X on `<element>`, styled via mixin Y"

Cover all layers touched. Wait for confirmation before executing.
This does NOT apply to trivial fixes or established patterns — only new/substantial work.

---

## Override Architecture

ln-ashlar ships two layers: **mixins** (recipes) + **components** (defaults applied to selectors).
Projects can override at any level:

1. **Use the default** → do nothing, library CSS works out of the box
2. **Color change** → override CSS variable: `.my-section { --color-primary: var(--color-error); }`
3. **Structure tweak** → re-apply mixin with modifications on a project selector
4. **Full replace** → exclude the component, use only the mixin on a custom selector
5. **Project selectors never change** — they describe WHAT, not HOW

---

## Theme Architecture

Themes (e.g. `[data-theme="glass"]`) are a **palette layer**, not a structural
layer. They override colors via token rebinds at the theme `:root` scope.
They do NOT redeclare component structure (`background`, `color`,
`border-color`, hover/active blocks).

### Rule — themes rebind at theme `:root`, never via descendant selectors

```scss
// RIGHT — vocabulary rebind at theme :root only
[data-theme="glass"] {
	--bg-elevated:        hsl(var(--color-neutral-950));
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

// Glass theme — rebind vocabulary + accent companions at theme :root
[data-theme="glass"] {
	--bg-elevated:           hsl(220 16% 17%);
	--bg-sunken:             hsl(220 16% 20%);
	--color-accent-bg:       hsl(var(--color-primary) / 0.2);
	--color-accent-bg-hover: hsl(var(--color-primary) / 0.3);
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

**Mixins read primitives, not scale tokens.** Mixin bodies use
`--padding-x`, `--padding-y`, `--gap`, `--radius`, `--color-bg`,
`--color-fg`, `--color-border`, `--color-accent`, `--shadow`,
etc. — the public contract. The `--size-*` scale is back-end
plumbing read only by `:root`, `.density-compact`, and region scopes
that re-bind the primitives.

**When you need a new spacing value — extend, don't silo.** Extend
`--size-*`. Never create a component-scoped token. Use the t-shirt
naming convention with `-up` suffixes for intermediate steps:

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
- **`--size-*` direct reads in geometric component math.** When
  `--size-*` is the length input to a positional / dimensional
  calculation (connector-line endpoints, bullet alignment to a
  text baseline, ::before label width inside a flex cell, shadow
  decoration offsets), it is component-intrinsic geometry, not
  spacing rhythm. Each occurrence needs a code comment explaining
  the intent (`// Geometric — <intent>, not spacing rhythm.`).
- **`--size-*` direct reads in `background-position` /
  `background-size`** for intrinsic icon decoration. Component
  design, not rhythm. Comment required.
- **Viewport-edge offsets** (toast container `right` / `bottom`,
  similar shell-positioning use cases). Single use site each;
  no shell-edge primitive warranted. Comment required.
- **`--size-*` direct reads inside `width` / `height` `calc()`** that
  compute intrinsic component dimensions (track thickness,
  label-width inside a stacked cell). Component design, not
  rhythm. Comment required.

For the complete list of color, shadow, typography, border, and spacing primitives, see the [Design Tokens](../css/tokens.md) documentation.

Every mixin read must go through the primitive layer, not a scale token directly. Components rebind primitives on their own scope; themes rebind vocabulary at theme `:root`.

---

## Token Surface — Primitives + Vocabulary

The styling system enforces a clean separation between scale values (the scale tokens), named design choices (the vocabulary), and what components actually read (the primitives).

For a complete, exhaustive catalog of all CSS spacing scales, background/foreground vocabularies, border custom properties, and full tables of Primitives and Vocabulary, see [Design Tokens](../css/tokens.md).

The following rules govern how these tokens are applied and overridden within the codebase:


### Rule — mixins read primitives, never scale tokens

```scss
// RIGHT — mixin body reads primitives
@mixin card {
	padding: var(--padding-y) var(--padding-x);
	background: var(--color-bg);
	color: var(--color-fg);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	transition: var(--transition);
}

// WRONG — mixin body reaches through to scale or old logical tokens
@mixin card {
	padding: var(--size-xs-up) var(--size-md-up);                // scale
	background: hsl(var(--color-bg-primary));                     // scale
	border: 1px solid hsl(var(--color-neutral-200));              // scale + literal
	box-shadow: var(--shadow-sm);                                  // scale
}
```

### Rule — context overrides rebind the primitive

A region that needs tighter rhythm rebinds the primitive on the region root:

```scss
.dense-region {
	--padding-y:  var(--size-xs);
	--gap:        var(--size-xs-up);
	--font-size:  var(--text-body-sm);
}
```

Same mechanism as `.density-compact`, theme overrides, and status rebinds.

### Rule — `:root` wires primitives → vocabulary

The `:root` block in `_tokens.scss` wires each primitive to its vocabulary default. That wiring is the only place outside density/theme scopes where primitives get their value:

```scss
:root {
	--color-bg:     var(--bg-base);
	--color-fg:     var(--fg-default);
	--color-border: var(--border-subtle);
	--shadow:       var(--shadow-resting);
}
```

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
	// Hover derived from accent at THIS scope via CSS relative
	// color syntax. Number form `calc(l - 8)`, NOT `calc(l - 8%)`
	// — channels evaluate to <number>, percentage is a type error
	// that falls back to `transparent`.
	--color-accent-hover: hsl(from var(--color-accent) h s calc(l - 8));

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
   re-resolve through the variant's rebind chain cleanly.

**Concrete cascade for `<button class="btn success">`:**

1. `.success { --color-primary: ...; }` rebinds at consumer.
2. `@mixin btn` body declares `--color-accent: hsl(var(--color-primary))`
   at consumer — resolves through `.success`.
3. `@mixin btn` body declares `--btn-bg: var(--color-accent)` at
   consumer — resolves through step 2.
4. `@mixin button-base` reads `background: var(--btn-bg)` at consumer
   — resolves through step 3.

See `scss/config/mixins/_btn.scss` header for the full cascade rationale.

### What NOT to do

- Do not read `--size-*` inside a mixin body. Read `--padding-*`,
  `--gap`, or `--radius` instead.
- Do not read `--color-neutral-*` inside a mixin body. Read
  `--color-bg`, `--color-fg`, or `--color-border` instead.
- Do not read `--color-primary*` inside a mixin body. Read
  `--color-accent`, `--color-accent-hover`, `--color-accent-fg`,
  or `--color-accent-tint*` instead.
- Do not read `--shadow-xs…2xl` inside a mixin body. Read `--shadow`.
  (Floating panels rebind `--shadow: var(--shadow-floating)` on
  their own scope.)
- Do not introduce a per-component logical token
  (`--card-padding-y`, `--btn-gap`). Rebind the shared primitive
  on the component's root selector instead.
- Do not introduce specific sub-tokens for different component size variations (e.g., `--btn-padding-x-sm`, `--btn-padding-y-lg`) at the root level. Instead, apply the **Redefinition Mindset**: redefine the base logical hooks/primitives (e.g. `--btn-padding-x`, `--btn-padding-y`) directly on the element/container scope to the desired standard primitive size token (e.g., `--btn-padding-x: var(--size-2xs)`).
- Do not declare `background:`, `color:`, or `border-color:`
  directly inside a variant mixin when the base mixin reads from a
  `--component-*` token surface. Rebind the surface tokens instead.
- Do not use the old `--color-bg-raised`, `--color-bg-sunken`,
  `--color-bg-recessed`, `--color-fg-muted`, `--color-fg-subtle`,
  `--color-border-subtle`, `--color-border-strong`, `--shadow-default`,
  `--shadow-raised` aliases — these were renamed. Use the current
  vocabulary: `--bg-base`, `--bg-sunken`, `--bg-recessed`, `--fg-muted`,
  `--fg-subtle`, `--border-subtle`, `--border-strong`,
  `--shadow-resting`, `--shadow-floating`.
- Do not introduce a per-component-surface margin token
  (`--card-margin`, `--toast-margin`). Use the cross-cutting
  `--margin-block` / `--margin-inline` primitives instead.

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

<!-- Toggle chevron (CSS rotates it on open — works inside accordion or standalone) -->
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

To host custom icons in production:
1. Save the custom SVG icon files in a directory on your production asset server or public CDN (e.g., `/public/assets/icons/` or `https://cdn.mycompany.com/assets/icons/`).
2. Before the library initializes, define the CDN URL globally using `window.LN_ICONS_CUSTOM_CDN = "https://cdn.mycompany.com/assets/icons";`.
3. In HTML, reference the icon as `#lnc-{name}` (e.g., `<use href="#lnc-corporate-logo"></use>`). The on-demand sprite generator will fetch, cache, and inject the SVG automatically from your custom CDN.

---

## Reactive Architecture

See [docs/js/core.md](docs/js/core.md) for the reactive rendering layer: ln-core shared helpers, Proxy-based state, fill/renderList, attribute bridge pattern.

---

## Column Filter Architecture

### Canonical Markup Schema

```html
<!-- th: data-ln-table-filter-col maps the filter key to this column         -->
<!-- button: data-ln-popover-for opens the popover                           -->
<!--         data-ln-table-col-filter is a JS id hook — never a CSS selector -->
<!-- .ln-filter-active on button = filter is active (JS-toggled; SCSS dot)   -->
<th data-ln-table-sort="string" data-ln-table-filter-col="department">
	Department
	<button class="table-filter" type="button"
	        data-ln-table-col-filter
	        data-ln-popover-for="filter-my-table-dept"
	        aria-label="Filter department">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
	</button>
</th>

<!-- Popover: placed as a sibling to [data-ln-table], NOT inside it          -->
<!-- ln-popover teleports this to <body> on open — escapes overflow clipping -->
<div data-ln-popover id="filter-my-table-dept">
	<!-- Optional: search input targets the OPTIONS UL id, NOT the table id  -->
	<!-- A data-ln-search targeting the table id triggers whole-table search  -->
	<input type="search" placeholder="Search..."
	       data-ln-search="filter-my-table-dept-list"
	       data-ln-search-items="label">
	<ul id="filter-my-table-dept-list" data-ln-filter="my-table">
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
		<!-- Domain enum options — include zero-record options -->
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Legal"> Legal</label></li>
	</ul>
</div>
```

### Event Flow

```
User checks a checkbox
  → ln-filter handles mutual exclusion (all ↔ values)
  → ln-filter dispatches ln-filter:changed on the [data-ln-filter] container
  → ln-filter._dispatchOnBoth (js/ln-filter/src/ln-filter.js:293):
      also dispatches on getElementById(tableId)
  → ln-table._onColumnFilter receives the event
  → updates _columnFilters, toggles .ln-filter-active on the button
  → SSR: _applyFilterAndSort() + _render()
  → data-driven: _requestData() → coordinator handles data fetch
  → ln-table dispatches ln-table:filter
```

### Teleport Safety

`ln-popover` teleports the entire popover block to `<body>` on open (`js/ln-popover/src/ln-popover.js:91`). The search input and options `<ul>` travel together, so all `id` references remain valid. `ln-filter` binds `change` directly on inputs at init time — post-teleport DOM position does not affect event wiring. `ln-filter` dispatches on `getElementById(targetId)`, a document-global lookup, not a relative DOM traversal. Teleport is transparent to the event flow.

### The Two Distinct `ln-search` Targets

These must never share the same target id:

- `data-ln-search="my-table-id"` on a global search input → triggers whole-table text search via `ln-table._onSearch`. Intentional table-wide behavior.
- `data-ln-search="filter-options-ul-id"` on the search input inside a filter popover → filters which checkboxes are visible in the option list. Targets the `<ul>` of options, not the table.

### Indicator Convention

`.ln-filter-active` class on the filter `<button>` (the element with `data-ln-table-col-filter`). `@mixin table-filter-active` in `scss/config/mixins/_table.scss` styles the button: accent color + `::after` dot. JS toggles the class; SCSS owns the visual output.

`[data-ln-table-col-filter]` may remain as a JS identification hook for finding the button. It must never be used as a CSS styling selector (CSS/JS hook boundary doctrine).

**Option rendering:** Filter options inside `[data-ln-popover]` render as filled accent pills via `@mixin pill` scoped to popover `> ul li label`. The checkbox input is visually hidden (clip-path pattern) but remains keyboard-focusable; `label:has(> input:checked)` delivers the accent fill; `label:has(> input:focus-visible)` delivers the focus ring.

**Sentinel auto-collapse:** When all available value checkboxes are checked, `ln-filter` automatically collapses the selection to the reset sentinel (unchecks all values, checks All). This only fires when the list contains a reset sentinel; lists without one are unaffected.

### Deprecated (gls-era)

| Attribute / Pattern | Replacement |
|---|---|
| `data-ln-table-filter-active` on `<th>` | `.ln-filter-active` on the `<button>` |
| `data-ln-table-col-filter` as dropdown trigger | JS id hook only — pairs with `data-ln-popover-for` |
| `data-ln-table-filter-options` JSON attribute | Removed — options are authored static HTML |
| `<template data-ln-template="column-filter">` | Removed — markup is static |
| `.content:has([data-ln-table]) { overflow: visible }` in `ln-table.scss` | Kept with deprecation comment until gls migrates to ln-popover pattern |
