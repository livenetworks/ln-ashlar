# CLAUDE.md — ln-ashlar Project (AI Core Rules)

## Working Mode

When I share plans, specs, or ask architectural questions — DON'T immediately execute. Instead:
1. **Think first** — analyze what I'm proposing. Look for gaps, contradictions, missing edge cases.
2. **Push back** — if something is wrong or suboptimal, say so directly. Challenge mainstream patterns if they don't fit our architecture.
3. **Reference existing decisions** — check the skills and specs before answering.
4. **Ask before building** — if the request is ambiguous or has multiple valid approaches, discuss first.
5. **Proactive feedback** — bring up missing states, edge cases, or contradictions with other specs.

This applies to architecture discussions, spec reviews, and planning. For trivial implementation tasks ("create this file", "fix this bug"), execute directly.

---

## Pre-Code Standards Verification (CRITICAL CHECKLIST)

To completely avoid refactoring and off-doctrine mistakes, **BEFORE writing or modifying any HTML, SCSS, or JS code**, you MUST perform a pre-flight check. In your thought process, explicitly verify your code against these strict rules:

1. **HTML Architecture**:
   - **No bare `<div>`**: Does every `<div>` have a structural class? Can a semantic element (`<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`, `<main>`) be used instead?
   - **The `ul/li` Grouping Rule**: Are there groups/lists of elements, actions, or options of the same type? (e.g. lists, tags, chips, buttons, radio/checkbox groups). If yes, they **MUST** be wrapped in `<ul>/<li>` or `<ol>/<li>`. **NEVER** use sibling `<div>`s or `<span>`s.
   - **Clickable Elements**: Are all interactive/clickable elements using `<button>` or `<a>`? **NEVER** bind click events to `<div>` or `<span>`.
   - **Accessible Icons**: Do icon-only buttons have an explicit `aria-label`? Do decorative icons have `aria-hidden="true"`?

2. **CSS & Styling Separation**:
   - **No inline styles**: Are there decorative `style="..."` attributes? (Strictly forbidden).
   - **No presentational classes in HTML**: Are there classes like `flex`, `grid`, `text-red`, or component utilities in HTML? (Visual styles must live in SCSS).
   - **Semantic SCSS Selectors**: In production, are styles/mixins applied via semantic selectors (e.g., `#my-element { @include card; }`) instead of utility classes in markup?

3. **JS & Component Behavior**:
   - **JS Data Attributes**: Are all JS behavior bindings linked via `data-ln-*` or `data-*` attributes? **NEVER** bind JS behaviors to CSS classes (like `.js-toggle`).
   - **No style-setting in JS**: Is JS setting CSS properties directly (e.g., `el.style.display = 'block'`)? (Must toggle CSS classes/attributes instead, styling states in SCSS).

---

## Grep before claiming (non-negotiable)

Before recommending an architecture, refactor, or claiming that a behavior/method/event exists, run a cross-component `grep` first. Trust the code, not your mental model.
**claim → grep → propose**. Never claim → propose → discover-too-late.

---

## Quick Navigation / Reference Directory

| Concern | Source / Documentation |
|---|---|
| **Library Mindset / Doctrine (READ FIRST)** | [docs/architecture/mindset.md](docs/architecture/mindset.md) |
| **Buttons / Mixins** | [docs/architecture/reference.md#button-architecture](docs/architecture/reference.md#button-architecture) |
| **Modals** | [docs/architecture/reference.md#modal-architecture](docs/architecture/reference.md#modal-architecture) |
| **Pills / Button Groups** | [docs/architecture/reference.md#button-groups-vs-pill-groups](docs/architecture/reference.md#button-groups-vs-pill-groups) |
| **SCSS Architecture / Layers** | [docs/architecture/reference.md#scss-architecture-two-layers](docs/architecture/reference.md#scss-architecture-two-layers) |
| **Template syntax: `{{ }}` vs `data-ln-field` (decision matrix)** | [docs/architecture/data-flow.md](docs/architecture/data-flow.md) §5 |
| **Adding SCSS Mixins / Components** | [docs/architecture/reference.md#adding-a-new-scss-mixin-component](docs/architecture/reference.md#adding-a-new-scss-mixin-component) |
| **Adding JS Components** | [docs/architecture/reference.md#adding-a-new-js-component](docs/architecture/reference.md#adding-a-new-js-component) |
| **Override & Theme Architecture** | [docs/architecture/reference.md#override-architecture](docs/architecture/reference.md#override-architecture) |
| **Spacing & Size Tokens** | [docs/architecture/reference.md#size-tokens-single-source-of-truth](docs/architecture/reference.md#size-tokens-single-source-of-truth) |
| **Primitives vs Vocabulary** | [docs/architecture/reference.md#token-surface-primitives-vocabulary](docs/architecture/reference.md#token-surface-primitives-vocabulary) |
| **Breakpoints** | [docs/architecture/reference.md#breakpoint-tokens-use-the-mixin-not-the-literal](docs/architecture/reference.md#breakpoint-tokens-use-the-mixin-not-the-literal) |
| **Icons (Tabler CDN)** | [docs/architecture/reference.md#icons](docs/architecture/reference.md#icons) |
| **Reactive / core.md** | [docs/js/core.md](docs/js/core.md) & [docs/js/component-guide.md](docs/js/component-guide.md) |
| **Global Standards** | `.claude/skills/` (html, css, js files) |

---

## Build Commands

```bash
npm run build        # Build library into demo/dist/ + compile demo pages
npm run dev          # Watch mode (library only)
```
