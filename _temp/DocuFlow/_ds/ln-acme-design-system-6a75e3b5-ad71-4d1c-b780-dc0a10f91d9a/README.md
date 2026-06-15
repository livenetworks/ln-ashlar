# ln-acme Design System

Design system extracted from the **ln-acme** unified frontend library — a zero-dependency SCSS + vanilla-JS framework used across LiveNetworks projects (Laravel admin UIs, internal tools, and product dashboards like DocuFlow). Authored by LiveNetworks; currently mid-way through a v1.1 design refresh with a v1.2 density/interaction pass queued.

---

## What ln-acme is

A small, opinionated, **HTML-first** framework:

- **Semantic HTML + SCSS mixins** — markup never carries presentational classes (`grid-4`, `text-primary`). Projects apply `@include` mixins to their own semantic selectors (`#audit-log { @include table-base; }`).
- **Every color is a CSS variable**, stored as a bare HSL triplet (`232 75% 52%`) so components can be re-skinned by re-assigning a single token.
- **Attribute-driven JS** — components self-register via `data-ln-*` attributes, no `init()` calls, MutationObserver picks up new DOM automatically.
- **Two-layer CSS architecture** — `scss/config/mixins/*` defines HOW something looks; `scss/components/*` applies the mixin to a default selector. Projects override by re-applying on a semantic selector.

> The system is intentionally "invisible": a plain `<button>` or `<table>` already looks right with zero classes. That bias runs through every token and component here.

---

## Products represented

This design system powers LiveNetworks' internal product line. The codebase ships one canonical demo + two consumer shells:

| Surface | Lives in | Role |
|---|---|---|
| **acme-admin** — generic admin/dashboard shell | `demo/admin/` | Reference implementation for every CSS + JS component. What consumer Laravel apps look like when they adopt ln-acme. |
| **DocuFlow** — document management product | `demo/docuflow/` | Consumer of ln-acme. Tenant/package/document CRUD screens with their own palette layer (`_palette.scss`) layered on top of the core tokens. |
| **Library core** — mixins, tokens, JS components | `scss/`, `js/` | The primitives both shells consume. |

Corresponding UI kits in this project:
- [`ui_kits/admin/`](ui_kits/admin/) — dashboard shell, sidebar, data table, form cluster, toast, modal.
- [`ui_kits/docuflow/`](ui_kits/docuflow/) — document-management product shell (packages + tenants).

---

## Sources used

- **GitHub repo:** `livenetworks/ln-acme` (default branch `main`, commit at time of extraction: `7d3917b96`)
  - `scss/config/_tokens.scss` — canonical token source.
  - `scss/config/_theme.scss` — dark-mode overrides.
  - `scss/config/mixins/` — 45+ mixins (buttons, cards, tables, modal, nav, typography…).
  - `scss/base/_typography.scss` + `_global.scss` — element defaults.
  - `docs/css/*.md`, `docs/js/*.md` — authored architecture references.
  - `demo/admin/*.html` — reference implementation of every component.
  - `demo/docuflow/*.html` + `demo/docuflow/scss/_palette.scss` — consumer example.
  - `plans/design-system-v1.1-roadmap.md` — in-flight refresh roadmap.
  - `CLAUDE.md` — button architecture, modal architecture, override rules.
- **Icons:** Tabler Icons v3.31.0 loaded on-demand by `ln-icons.js` from jsDelivr; custom product icons (`lnc-*`) from a separate CDN.
- **Typeface:** **Inter** (Google Fonts, full variable). Mono fallback: `ui-monospace`.

---

## Index (files in this project)

Root:
- [`README.md`](README.md) — this file.
- [`SKILL.md`](SKILL.md) — lets Claude Code pick up this skill.
- [`colors_and_type.css`](colors_and_type.css) — portable CSS with every token from `_tokens.scss` + `_theme.scss`, plus the element-level defaults from `_typography.scss` / `_global.scss`. Drop into any static HTML.
- [`fonts/`](fonts/) — *(empty; Inter is loaded from Google Fonts via CSS `@import`. See "Font substitution" note below.)*
- [`assets/`](assets/) — logos, illustrations, icon set reference.
- [`preview/`](preview/) — design-system tab cards (see `preview/index.md` for the full list).
- [`ui_kits/admin/`](ui_kits/admin/) — dashboard UI kit.
- [`ui_kits/docuflow/`](ui_kits/docuflow/) — DocuFlow product UI kit.

---

## Content fundamentals

ln-acme is a framework, not a brand, so its "voice" lives in its **docs, CLAUDE.md, and demo copy** rather than in marketing surfaces. Tone is sharp, technical, and quietly opinionated.

**Voice characteristics**

- **Imperative + terse.** Docs tell you what to do, not what's possible. Sample line: *"No `btn--*` variant classes in ln-acme — use `--color-primary` override."* Rules over suggestions.
- **Second-person, but rarely.** Docs mostly address the reader as a role ("Projects apply…", "Consumers override…") rather than "you". When "you" appears, it is instructional ("Before using any `data-ln-*` attribute…").
- **First-person "we" only appears in CLAUDE.md** (team-internal agent instructions). Public docs stay in third-person.
- **No hype adjectives.** Never "beautiful", "powerful", "delightful". Features described by behaviour: *"Hide/show attributes, state transitions that JS controls directly."*
- **Code-first examples.** Every concept is shown as SCSS/HTML before it is described in prose.

**Casing & typographic conventions**

- **Sentence case** for headings (`Design tokens`, `Button architecture`). Never Title Case.
- `ln-` prefix is lowercase and hyphenated everywhere — components (`ln-modal`), tokens (`--color-primary`), attributes (`data-ln-toggle`). Never PascalCase.
- **Code inline:** wrap tokens, attrs, selectors in backticks (`` `--color-primary` ``, `` `<button type="submit">` ``).
- **Em dash** for inline qualification (`— recipe`, `— applied`). Curly quotes and em dashes, not straight hyphens.
- **Numbers spelled out 0–9** in prose; digits thereafter.

**Vibe: opinionated plumbing**

Copy reads like the author is impatient with ambiguity. Examples:
- *"HTML describes WHAT, not HOW — semantic elements only."*
- *"Every color is a CSS variable."*
- *"ZERO hardcoded colors."*
- Section endings like *"Wait for confirmation before executing."*

**Emoji: no.** Not in docs, not in UI copy, not in commit messages. The library ships zero emoji. Unicode glyphs appear only inside box-drawing in ASCII diagrams (`←`, `→`, `─`).

**Product-copy samples (from `demo/admin/index.html` / `demo/docuflow/index.html`)**

- Headings: *"Dashboard"*, *"Modal"*, *"Quick Integration"*.
- Helpers: *"Press ESC or click close."*, *"Drag files here or click to select"*.
- Errors: *"Name is required"*, *"Email format is invalid"*, *"Password is too short"*.
- Stats: *"Components 18"*, *"JS Modules 10"*.
- Toasts: *"Success · The record has been saved."* / *"Error · Something went wrong."*
- Empty states and labels default to one short noun phrase; no exclamation marks.

---

## Visual foundations

### Colors

- **Primary (brand indigo)** `232 75% 52%` — a deep cobalt-indigo blue, moderately saturated. Used for links, primary buttons, focus rings, selected nav state.
- **Secondary (brand green)** `160 76% 40%` — jade-ish emerald. Used as a *surface* accent (success tint, money/positive bars, some badges). **Not the same as `--color-text-secondary`**, which is grey. The codebase is explicit about this distinction.
- **Status** — success `142` green, error `0` red, warning `32` orange, info `217` cerulean. All follow the same family pattern (base / hover / focus / light / lighter) so overriding `--color-primary: var(--color-error)` on an element automatically cascades through every state.
- **Neutral scale** — eleven stops (`50` through `900`), slightly cool (~220° hue) so they read as "professional daylight" not warm paper.
- **Alpha via triplets** — colors are stored as bare HSL numbers (`232 75% 52%`), consumed as `hsl(var(--color-primary))` or `hsl(var(--color-primary) / 0.5)` for transparency. Alpha ramps: `/ 0.04` to `/ 0.72` are the actual values used in shadows.
- **Dark mode** is a neutral-scale inversion + explicit surface-ladder retune (`body < primary < secondary`, each ~4% lighter). Primary/status tint layers (`-light`, `-lighter`) are re-tuned, not mechanically flipped.

### Typography

- **Family:** Inter (variable, opsz 14–32, weights 400/500/600/700, italic 400). That's it. Mono is `ui-monospace` with `Cascadia Code`/`Source Code Pro` fallbacks.
- **Two layers:**
  1. **Primitives** — `text-xs` through `text-2xl` (12–24px). Use when the intent is literally "make this 14px".
  2. **Semantic roles (v1.1)** — `display-lg/md/sm`, `heading-lg/md/sm`, `title-md/sm`, `body-lg/md/sm`, `label-md/sm`, `caption`. Each role pairs a size with a specific line-height (display: 1.1, body: 1.6). **Prefer roles.**
- **Tracking:** display + heading sizes use `tracking-tight` (−0.025em). Body is 0. Uppercase labels/badges get `tracking-wide` (+0.025em).
- **Weights:** 400 body, 500 UI medium, 600 headings + strong, 700 display.
- **Tabular numerals** on table cells (`font-variant-numeric: tabular-nums`) so columns of numbers line up.

### Spacing

- Ten-stop scale, 2px → 128px. Strict rem-based. `xs/sm/md/lg/xl/2xl` cover most component-scale work; `3xl/4xl/5xl` are page-level / hero only.
- No arbitrary pixel values in mixins — always `--spacing-*` tokens.

### Borders & radii

- **Borders:** `1px` default, `2px` strong (active pill, focus inner ring). Color always a token (`--color-border`, `--color-border-light`).
- **Radii:** `sm 4px / md 8px / lg 12px / xl 16px / full`. Most components use `md` (buttons, inputs) or `lg` (cards, modals). Pills use `full`.

### Shadows

- **Dual-layer, cool-tinted.** Base shadow color is `hsl(220 40% 15% / α)` — a faint cool cast that reads as "modern / expensive" on daylight backgrounds, not pure black.
- Six elevation stops (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`) + `inner` (depressed/active) + `primary`/`success`/`error` (colored glows for CTAs and focus halos).
- **Buttons do not cast shadow on hover.** Color change only. No translate, no grow. Stated explicitly in CLAUDE.md.
- **Dark mode** swaps the cool tint for solid black at boosted alpha — cool tint disappears on dark surfaces.

### Focus ring

Three-layer halo (6px total), consistent across every interactive element:
1. 2px inner ring in `--color-bg-primary` (visual separator from the element).
2. 2px middle ring in the focus color at 60% alpha (main signal).
3. 2px outer glow in the focus color at 15% alpha (soft halo).

Error variant swaps the color. No variant for thickness — the system is deliberately one-size.

### Motion

- **Durations:** `fast 150ms`, `base 200ms`, `slow 300ms`. Nothing is slower than 300ms.
- **Curves:**
  - `standard` `cubic-bezier(0.4, 0, 0.2, 1)` — default UI motion.
  - `decelerate` — enter animations (modal open).
  - `accelerate` — exit animations (modal close).
  - `spring` `cubic-bezier(0.34, 1.56, 0.64, 1)` — emphasis (nav underline, success check). Rare.
- **No bounces on buttons.** Only color transitions on hover/active. Transform animations are reserved for entering/exiting modals and toasts.
- **`prefers-reduced-motion`** is honored (Phase 5, motion-safe).

### Hover / press states

- **Buttons (neutral):** hover = `bg-secondary` fill + `text-primary`. Active = `border` color fill. No translation, no scale, no shadow.
- **Buttons (submit/primary):** hover = `--color-primary-hover` (same hue, 10% darker L). Active = same as hover (no extra darken).
- **Links:** hover = `--color-primary-hover`.
- **Disabled:** 50% opacity + `cursor: not-allowed`. Applied via global rule, not a class.
- **Selected/active nav item:** `--color-primary-light` tint background + primary text.

### Backgrounds

- **No gradients** anywhere in the core library. No brand gradients, no product gradients.
- **No background images, no photography, no illustrations** bundled with the library. Surfaces are flat neutral colors.
- **Three surface tiers:**
  - `bg-body` (`neutral-100`) — page canvas.
  - `bg-primary` (white / `#fff`) — cards, panels, the "document" surface.
  - `bg-secondary` (`neutral-50`) — headers, footers, alternating rows, secondary surfaces.
- **Error surface:** `--color-bg-error` — a very pale pink (`0 86% 97%`).

### Cards & layout rules

- **Cards:** `bg-primary` + `radius-lg` (12px) + `border 1px` + `shadow-sm`. No ornament.
- **Section cards** (the recurring dashboard pattern): card with a `<header>` + `<main>` that picks up inner spacing from the mixin, no extra class chrome.
- **Layout:** max content widths are tokenized (`--max-w-prose: 65ch`, `--max-w-form: 32rem`, `--max-w-content: 48rem`, `--max-w-container: 80rem`). Sidebars are fixed-width, main panel scrolls. Container queries available via `@include cq-*`.
- **Transparency / blur:** used sparingly. Modal backdrops dim at ~40–60% black; no `backdrop-filter: blur()` in the base library (keeps rendering cheap on low-end devices).

### Imagery

The library ships **no decorative imagery**. Assets are functional only: logos, the flag SVG set (250 country flags for locale pickers), and three custom file-type icons (`lnc-file-pdf`, `lnc-file-doc`, `lnc-file-epub`). Product illustrations, if any, live in the consumer app — ln-acme itself is deliberately dry.

---

## Iconography

- **System:** [Tabler Icons](https://tabler.io/icons) (outline style, 24×24, 1.5px stroke, `currentColor`). Pinned to `@3.31.0`, loaded on-demand from jsDelivr by `js/ln-icons/ln-icons.js`.
- **Usage pattern:** `<svg class="ln-icon" aria-hidden="true"><use href="#ln-{name}"></use></svg>`. No icon font. Icons inherit `color` from their ancestor.
- **Prefixes:**
  - `#ln-*` — Tabler icons, routed to jsDelivr automatically.
  - `#lnc-*` — custom icons, routed to `window.LN_ICONS_CUSTOM_CDN`. Used for semantic file types (`lnc-file-pdf`, `lnc-file-doc`, `lnc-file-epub`) which have embedded stroke colors and do NOT follow currentColor.
- **Caching:** first fetch hits CDN, subsequent loads resolve from `localStorage` (prefix `lni:`).
- **Sizes:** `ln-icon--sm` (1rem), default (1.25rem), `ln-icon--lg` (1.5rem), `ln-icon--xl` (4rem).
- **Emoji:** never used. Not in UI, not in docs, not in commits.
- **Unicode glyphs:** only inside ASCII diagrams in docs (`←`, `→`, `─`).
- **Country flags:** `assets/flags/*.svg` — 250 ISO country flags, solid colors, no dropshadows. Used in locale/translation pickers.

### Full Tabler icon list
`scss/tabler-icons.txt` enumerates every Tabler icon name in use. Common picks: `home`, `x`, `menu`, `users`, `settings`, `logout`, `books`, `plus`, `edit`, `trash`, `eye`, `device-floppy`, `search`, `check`, `copy`, `link`, `filter`, `calendar`, `upload`, `download`, `refresh`, `printer`, `lock`, `star`, `arrow-up/down`, `arrows-sort`, `chart-bar`, `clock`, `mail`, `book`, `world`, `list`, `box`, `building`, `alert-triangle`, `info-circle`, `circle-x`, `circle-check`, `user`, `phone`, `certificate`, `compass`, `file`.

In preview cards and UI kits here, icons are loaded directly from the same jsDelivr URL pattern — no SDK, no bundle.

### Font substitution note

**Inter** is loaded from Google Fonts (same source the demo uses). The source repo does not bundle a `fonts/*.ttf` — it relies on the CDN. If you need offline-safe font files, drop them in `fonts/` and swap the `@import` at the top of `colors_and_type.css`.

---

## How to use this design system

- **Prototyping from HTML:** link `colors_and_type.css`. Tokens + element defaults are immediately available.
- **Building product mockups:** open one of the UI kits in `ui_kits/` and copy the JSX components; they are cosmetic recreations of the real ln-acme output and compose via standard React.
- **Slides / static assets:** pull swatches + type specimens from `preview/` cards or reference the tokens directly.
- **Production code:** read the full ln-acme repo (`livenetworks/ln-acme`) and import the SCSS source; this project is the *design* side, the repo is the *code* side.
