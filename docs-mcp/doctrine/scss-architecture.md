---
name: scss-architecture
classification: doctrine
status: draft
domain: frontend
summary: Two-layer SCSS design system, tokens, mixins vs components, theming strategy, and z-index stacking layers in ln-ashlar.
source: docs/architecture/reference.md, docs-mcp/css/theming.md, docs-mcp/css/tokens.md
tags: [doctrine, scss, css, theming, design-tokens]
---

# 🎨 SCSS Architecture and Styling Doctrine

## Summary

This document explains the styling architecture of `ln-ashlar`. It covers the 3-tier stylesheet distribution (Core Functional, Visual Theme, Full Bundle), the two-layer SCSS design system (mixins vs. components), design token structures, the CSS/JS hook boundary rules, how dark mode and custom tenant themes are compiled, and the z-index stacking context strategies.

---

## 1. The Three-Tier Stylesheet Distribution

To support headless usage, custom brand themes, and standard turnkey applications, `ln-ashlar` compiles into three distinct stylesheet artifacts:

```
┌────────────────────────────────────────────────────────┐
│ 1. Core Functional CSS (ln-ashlar-core.css)            │
│ (State-only, behavioral, ZERO tokens, ZERO theme skin) │
│ Aggregates co-located: components/ln-*/src/*.scss      │
└──────────────────────────┬─────────────────────────────┘
                           │ + (Combine for turnkey)
┌──────────────────────────▼─────────────────────────────┐
│ 2. Visual Theme CSS (ln-ashlar-theme.css)              │
│ (Design tokens, resets, typography, mixins, visual skin)│
│ Source: theme/config/, theme/base/, theme/components/  │
└──────────────────────────┬─────────────────────────────┘
                           │ =
┌──────────────────────────▼─────────────────────────────┐
│ 3. Master Full Bundle (ln-ashlar.css)                  │
│ (Core Functional CSS + Visual Theme CSS)               │
└────────────────────────────────────────────────────────┘
```

### A. Core Functional Stylesheet (`dist/ln-ashlar-core.css` / `./core.css`)
- Master aggregator of all component-specific behavioral/state SCSS modules located in `components/ln-{name}/src/ln-{name}.scss`.
- **Zero design tokens, zero theme colors, zero typography, zero decorative borders.**
- Manages purely functional mechanics: `[data-ln-toggle-hide] { display: none !important; }`, top-layer promotion (`popover="manual"`), dialog cancel behavior, absolute positioning anchors, and scroll containers.
- **Headless Mode:** Consumers building with external frameworks (Tailwind, Bootstrap, or custom CSS) can import `./core.css` alone to get full JS component functionality with zero visual styling interference.

### B. Visual Theme Stylesheet (`dist/ln-ashlar-theme.css` / `./theme.css`)
- Contains the complete design system: design tokens (`theme/config/_tokens.scss`), resets (`theme/base/`), typography, and visual chrome (`theme/config/mixins/` and `theme/components/`).
- Governs all decorative presentation: cards, tables, buttons, colors, borders, elevation shadows, density modes, and dark-mode theming.

### C. Master Full Bundle (`dist/ln-ashlar.css` / `./full.css`)
- Turnkey bundle combining `@use 'ln-ashlar-core'` and `@use 'ln-ashlar-theme'`.

---

## 2. The Two-Layer SCSS Design System (Inside `theme/`)

Within the visual theme layer (`theme/`), styling is divided into two distinct layers:

```
Mixin Layer (Recipe)        ->  theme/config/mixins/_table.scss   → @mixin table-base { ... }
Component Layer (Binding)   ->  theme/components/_table.scss      → table { @include table-base; }
```

### A. The Mixin Layer (`theme/config/mixins/`)
- Contains pure style recipes.
- Does **not** output CSS classes or rules directly when compiled on its own.
- Defines variables and structures but does not bind them to specific HTML tags or classes.

### B. The Component Layer (`theme/components/`)
- Applies mixins to default tags or standard utility classes.
- Generates the final compiled CSS output.
- Custom consumer components apply these mixins directly in their local selectors (e.g., `#audit-log-table { @include table-base; }`) rather than copy-pasting styling rules.

### One Component, One Definition
A recipe is applied to ONE shared selector; markup consumes that class. Never re-apply `@include badge` across bespoke selectors — parallel definitions drift apart over time. Duplication is earned only by a real semantic boundary.

### Delta-Only Inheritance
Derived mixins add only what differs from the base. Test: if the base changes a color, does the variant get it automatically? If not, you're duplicating instead of inheriting. Container/layout mixins handle structure only — element styling lives on the element's own mixin.

---

## 3. Co-located Component SCSS vs. Global Theme Styles

Each functional JavaScript component folder (e.g., `components/ln-toggle/`, see [`ln-toggle`](../components/ln-toggle.md)) contains a co-located `.scss` file:

- **Co-located SCSS (State only):** Used *only* to govern active functional state styling controlled by JS (e.g., `[data-ln-toggle-hide] { display: none !important; }` or timing transitions). These are compiled into `ln-ashlar-core.css`.
- **Global Mixins/Components (Visual chrome):** All visual design details (padding, font sizes, borders, colors, shadow values) must live under the main SCSS directories (`theme/config/mixins/` or `theme/components/`), compiled into `ln-ashlar-theme.css`.

### Helper-Class Convention
Unprefixed helper classes are thin mixin bindings (`.search { @include search; }`) — visual, static presentation. The `ln-` prefix is reserved for JS-state classes exclusively; never mix the two roles on the same class.

---

## 4. CSS/JS Hook Boundary

To avoid selector collisions and specificity bugs, follow these selector rules:

1. **Presence Decoration is Forbidden:** Do **not** style components using the bare functional JS identifier (e.g., `[data-ln-modal] { padding: 16px; }` is prohibited). The attribute acts as an initialization selector for JS, not a style hook.
2. **State Value Styling is Allowed:** Styling is allowed when selecting specific values of functional attributes representing a runtime state (e.g., `[data-ln-modal="open"] { display: flex; }` or `[data-ln-popover="open"] { opacity: 1; }`).
3. **Use Semantic Classes for Visual Variants:** Apply standard visual classes (e.g., `.search`, `.collapsible`, `.btn`) for static visual presentation, decoupled from functional JS logic.

---

## 5. Design Tokens, Primitives, and the Layer Model

Design values are declared as CSS custom properties in `theme/config/_tokens.scss`, `_palette.scss`, and `_theme.scss`.

### A. The Four Token Layers
Styling values flow through four strictly defined layers. A brand token, a scale token, a vocabulary token, and a primitive are **not interchangeable**, even though they all ultimately resolve to CSS values.

```
1. Brand Tokens          ->  --brand-primary: 221 83% 48%; --brand-secondary: 160 84% 36%;
                             (Bare HSL numbers; allows variable alpha opacity composition)
            ↓
2. Scale Tokens          ->  --size-md: 1rem; --color-neutral-100: 220 14% 96%; --color-success: 142 76% 36%;
                             (Back-end scale plumbing; NEVER read directly inside mixin bodies)
            ↓ wired at theme scope (ln-values-light / ln-values-dark)
3. Vocabulary Tokens     ->  --bg-base, --bg-elevated, --bg-sunken, --bg-recessed,
                             --fg-default, --fg-muted, --border-subtle, --shadow-resting,
                             --text-title-md, --lh-title-md
                             (Named semantic design intent; rebound at theme :root, [data-skin], [data-mode], or [data-theme])
            ↓ primitives declared in the base-defaults block at
            ↓ :root, [data-mode], [data-theme], [data-skin]
            ↓ (ln-color-chain separately derives --color-primary/-secondary
            ↓  and the colour-aware shadows at :root, [data-mode], [data-theme])
4. Primitive Tokens      ->  re-derived at every axis (base-defaults block, _palette.scss):
                               --color-bg, --color-fg, --color-border, --shadow, --radius
                             root-only, substituted once at <html> (_tokens.scss :root):
                               --padding-x, --padding-y, --gap, --font-size, --line-height
                               (also rebound by [data-density] scopes and :root media queries)
                             (The ONLY tokens mixin bodies read and consume)
```

### B. The Rebind Contract (Read vs. Write Boundaries)
- **Mixins:** Mixin bodies read **primitives only** (`--color-bg`, `--color-fg`, `--color-border`, `--shadow`, `--padding-x`, `--padding-y`, `--gap`, `--radius`, `--font-size`, `--line-height`). They NEVER read vocabulary tokens or raw scale tokens directly. Note the two groups differ in where they compute — see the layer diagram above.
- **Components:** Component instances and custom selectors write/rebind **primitives** on their local scope to select a vocabulary role (e.g. `.sunken-card { --color-bg: var(--bg-sunken); }`). Components NEVER rebind `--bg-*` vocabulary tokens.
- **Themes, Modes, and Skins:** These axes rebind **vocabulary tokens** at the theme root scope (`:root`, `[data-mode]`, `[data-theme]`, `[data-skin]`). They change global polarity, palette, and structure without rewriting component mixins.
- **Density Tiers:** Density modes (`[data-density="compact"]`) rebind geometric primitives and vocabulary (`--padding-y`, `--gap`, `--text-{role}`, `--lh-{role}`), never color semantics.

### C. Architectural Invariants
1. **Primitives Invariant:** Mixins read primitives only, never vocabulary (`--bg-*`, `--fg-*`) and never raw scales (`--size-*`, `--color-neutral-*`).
2. **Rebind Scoping Invariant:** Vocabulary is rebound at theme `:root`, `[data-mode]`, `[data-theme]`, and `[data-skin]` scopes; primitives are rebound on component-local scopes.
3. **Semantic Role Invariant:** A theme may change absolute color/shadow values but must preserve semantic relationships across roles.
4. **Density Invariant:** Density modifies spatial and typographic geometry, never color or surface semantics.
5. **Visibility Invariant:** `hidden` (attribute or `.hidden` in tabs) is the sole hiding mechanism; there is no `.ln-hidden` or ad-hoc display override class.
6. **Freeze Rule Invariant:** Accent-derived interaction states are tokenised strictly as ratio percentages (`--tint-hover: 7%`, `--tint-selected: 12%`, `--tint-active: 14%`) rather than pre-resolved `:root` colors. `color-mix()` executes at the local declaration site so `--color-accent` and `--color-bg` resolve dynamically on the component cascade.
7. **Root-Resolvability Invariant:** A `var()` inside a custom-property value declared at a `[data-skin]` / `[data-theme]` / `[data-mode]` root may reference only tokens declared by `_tokens.scss :root`, `ln-values-light` / `ln-values-dark`, `ln-color-chain`, or the base-defaults block — never a token that exists only inside a component mixin or on a narrow element selector. If the value must derive from a component-local token, the rebind belongs in a nested consuming-element block.
8. **Declaration-Site Invariant:** A token whose value is a **literal** and identical
   across both polarities carries no polarity opinion — declare it in a
   `:where(:root)`-only block, never inside `ln-values-light` / `ln-values-dark`.
   Declaring it in the mixins re-declares it on every nested `[data-mode]` island,
   and a declaration beats inheritance at any specificity, so it clobbers whatever an
   ancestor `[data-theme]` or `[data-skin]` set. Example: `--brand-primary: 221 83%
   48%` sits in the `:where(:root)` brand block in `_palette.scss`, so
   `<section data-theme="sunset">` can rebind it and a nested `[data-mode="light"]`
   card keeps the sunset hue. Conversely, a token whose value is an **indirection**
   (`var(--other)`) must be declared in the four-axis base-defaults block, never at
   `:root` alone — at `:root` it substitutes once at `<html>` and inherits as a
   frozen literal, so no island rebind of its target can reach it. Example:
   `--radius: var(--radius-md)` sits in the base-defaults block, so
   `[data-skin="glass"]`'s `--radius-md: 0` reaches a scoped skin island; at `:root`
   alone it did not.

### D. Anti-Patterns & Pitfalls
> [!CAUTION]
> 1. **Do Not Introduce Surface Aliases:** Never introduce `surface-1`, `surface-2`, or `surface-3` elevation ladders. Use the semantic vocabulary (`--bg-base`, `--bg-elevated`, `--bg-sunken`, `--bg-recessed`).
> 2. **Do Not Read Neutral Scale for Backgrounds:** Never use `--color-neutral-*` directly for backgrounds or text in mixins. The neutral scale inverts in dark mode, which will turn light surfaces pitch black or vice-versa.
> 3. **Do Not Infer Tonal Direction from Names:** `--bg-sunken` is darker than `--bg-base` in light mode (96% vs 100%) but **lighter** than `--bg-base` in dark mode (20% vs 13%). This is intentional so sunken wells do not punch through the 9% app-shell ground.
> 4. **Do Not Rebind Vocabulary on Components:** Never write `.card { --bg-base: ... }`. Always write `.card { --color-bg: var(--bg-elevated); }`.
> 5. **Own-the-pair:** Any element that rebinds `--color-bg` and paints `background-color` must also paint `color: var(--color-fg)` in the same rule. A background without a foreground inherits its text colour from an arbitrary ancestor and cannot guarantee contrast against a surface it chose itself.

### E. Mixin Inclusion Grouping and Overrides
When styling custom, project-specific components (e.g. by unique IDs like `#user-edit-modal` and `#packages-filter-drawer`), follow these grouping and overriding guidelines:
1. **Group shared mixins:** Group selectors sharing the exact same base mixin using comma-separated rules to keep the compiled CSS clean and unified.
2. **Rebind primitives for overrides:** Rather than writing direct custom styling overrides (like `padding: 2rem` or `border: 1px solid red`) which break layout architectures, rebind the component's internal design primitives (like `--padding-x`, `--padding-y`, `--color-bg`, or `--color-border`) in a separate block underneath.

#### Correct SCSS Binding and Overriding:
```scss
// In theme/components/_modal.scss

// Group shared base mixin inclusions together
#user-edit-modal,
#packages-filter-drawer {
    @include modal-panel;
}

// Instance-specific token re-bindings and overrides
#packages-filter-drawer {
    --color-bg: var(--bg-recessed);           // Changes background to recessed base
    --color-border: hsl(var(--color-danger));  // Overrides border to danger red
    --padding-x: 2rem;                         // Overrides horizontal padding primitive
    --padding-y: 2rem;                         // Overrides vertical padding primitive
}
```

---

## 6. Theming and Dark Mode Strategy

`ln-ashlar` supports dark mode and custom consumer themes through a **vocabulary re-binding layer**.

### A. Non-Destructive Dark Mode
Dark mode is activated via:
1. Explicit HTML attribute: `<html data-mode="dark">`
2. System media query: `@media (prefers-color-scheme: dark)` when no explicit `data-mode` is provided.
3. Forcing light: `<html data-mode="light">`

To apply themes, **rebind vocabulary tokens at the theme root scope**. Never use nested descendant selectors with higher specificity (e.g., `[data-mode="dark"] .card { background: black; }` is forbidden).

#### Correct Theme Declaration:
```css
[data-mode="dark"] {
    --bg-base:     hsl(var(--color-neutral-100));
    --bg-elevated: hsl(var(--color-neutral-150));
    --fg-default:  hsl(var(--color-neutral-900));
    --fg-muted:    hsl(var(--color-neutral-500));
}
```
Because component mixins read primitives like `--color-bg` (which default to `--bg-base`), re-binding `--bg-base` automatically shifts styling across all components.

Bind the vocabulary to the neutral ramp rather than to literals, in both polarities. The ramp is the single source of truth for greys, so a consumer who rebinds `--color-neutral-*` moves light and dark together; a hand-tuned literal silently opts that polarity out.

---

## 7. Z-Index and Stacking Contexts

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

---

## 8. Visual Defaults

Certain visual behaviors are fixed library-wide defaults, not per-component choices:

- **Buttons:** Every `<button>` is styled globally; `type="submit"` gets primary fill automatically. Color variants are token overrides on the local scope (e.g. `#delete-user { --color-primary: var(--color-error); }`), never variant classes.
- **Hover:** Subtle color change only — no transforms, no appearing shadows, no `::before` bars.
- **Collapse animation:** `grid-template-rows: 0fr/1fr`, never `max-height`.
- **Required indicator:** CSS-driven from `[required]` via `:has()` — never a manual `*` character authored in HTML.
- **Lists vs. Prose:** Structural lists (`<ul>`, `<ol>`) are unstyled by default (`list-style: none`, `margin: 0`, `padding: 0`) to serve as clean UI primitives (button groups, tabs, chips, accordions, menus). Editorial/content lists with bullet discs, decimal numbers, and vertical rhythm are opt-in and live strictly within `.prose` (`@include prose`).

---

## 9. Responsive Strategy

`@container` queries style components (the parent declares `container-type`, the child queries it — never the same element); `@media` is reserved for the layout shell only. Container breakpoints are content-driven, not predetermined by viewport size.

