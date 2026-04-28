# ln-ashlar

Unified frontend library for LiveNetworks projects — SCSS CSS framework + vanilla JS components, zero dependencies.

> **v1.1 in flight** — design system refresh in progress. Roadmap:
> [plans/design-system-v1.1-roadmap.md](plans/design-system-v1.1-roadmap.md).
> Phase checklist: [todo.md](todo.md) § "Design System v1.1".

---

## Philosophy

Four principles drive every decision in this library:

1. **HTML describes WHAT, not HOW** — semantic elements only. No presentational classes in markup (`grid-4`, `text-secondary`, `flex`). Visual changes happen in SCSS, never in HTML.
2. **Style via `@include` on semantic selectors** — projects write `#user-table { @include table-base; }`, not `<table class="table table-striped">`. The selector describes the element; the mixin describes how it looks.
3. **Every color is a CSS variable** — `hsl(var(--color-primary))`, never `#2737a1`. This makes the entire color system overridable at any scope via `--color-primary: var(--color-error)`.
4. **JS is attribute-driven, zero init** — `data-ln-modal`, `data-ln-filter`, `data-ln-toggle`. MutationObserver discovers and initializes components automatically. No `new Component()`, no `init()` calls.

---

## Quick Start

ln-ashlar is a source-only package. Import SCSS and JS directly and let
your project's bundler compile them.

### npm
```js
// SCSS
@use 'ln-ashlar/scss/ln-ashlar.scss';

// JS
import 'ln-ashlar/js/index.js';
```

### Git submodule
```bash
git submodule add .../ln-ashlar.git resources/ln-ashlar
```

Then `@use 'resources/ln-ashlar/scss/ln-ashlar.scss'` and
`import 'resources/ln-ashlar/js/index.js'` from the project.

### Build (for the demo site only)
```bash
npm run build   # Produces demo/dist/ln-ashlar.{css,js,iife.js} + compiles demo pages
npm run dev     # Watch mode (library only)
```

The `demo/dist/` artefact exists for the demo site. Consumers bundle
from source — don't point projects at it.

---

## Architecture

### CSS — Two Layers

```
scss/config/_tokens.scss     ← :root CSS variables (colors, spacing, radius, z-index)
scss/config/mixins/          ← @mixin definitions (recipes, no CSS output)
scss/components/             ← mixins applied to default selectors (CSS output)
scss/base/                   ← Reset, global element defaults
```

**Mixins** define how something looks. **Components** apply mixins to default selectors. Projects override by re-applying mixins on their own semantic selectors:

```scss
// ln-ashlar ships: table { @include table-base; }
// Project overrides one specific table:
#audit-log { @include table-base; @include table-striped; }
```

Color changes need only a variable override — all states (hover, active, focus) adapt automatically:

```scss
#delete-user { --color-primary: var(--color-error); }
```

### JS — Attribute-Driven

All components use `data-ln-{name}` attributes. Place the attribute in HTML — the component initializes itself.

```html
<div data-ln-modal id="edit-user">...</div>       <!-- Modal -->
<nav data-ln-filter="my-list">...</nav>            <!-- Filter -->
<input data-ln-search="my-list" type="search">    <!-- Search -->
```

Components expose a JS API on the element (`el.lnModal.open()`) and fire namespaced events (`ln-modal:open`). See individual component docs for details.

---

## Documentation

### CSS

| Document | Contents |
|----------|----------|
| [docs/css/tokens.md](docs/css/tokens.md) | All CSS custom properties — colors, spacing, radius, z-index, typography |
| [docs/css/mixins.md](docs/css/mixins.md) | Full `@include` mixin reference |
| [docs/css/forms.md](docs/css/forms.md) | Form layout pattern, grid, validation |
| [docs/css/cards.md](docs/css/cards.md) | Card and section-card mixins |
| [docs/css/tables.md](docs/css/tables.md) | Table mixins and responsive layout |
| [docs/css/navigation.md](docs/css/navigation.md) | Nav mixin, sidebar structure |
| [docs/css/layout.md](docs/css/layout.md) | Grid, container queries, collapsible |
| [docs/css/sections.md](docs/css/sections.md) | Section mixins |
| [docs/css/breadcrumbs.md](docs/css/breadcrumbs.md) | Breadcrumb mixin |

### JS

| Document | Contents |
|----------|----------|
| [docs/js/component-guide.md](docs/js/component-guide.md) | IIFE pattern, MutationObserver, events, reactive state |
| [docs/js/core.md](docs/js/core.md) | ln-core helpers: dispatch, fill, renderList, reactiveState |

### Full index

[docs/README.md](docs/README.md) — complete table of all CSS and JS docs, with links to both usage guides (`js/ln-*/README.md`) and architecture references (`docs/js/*.md`). Also hosts the v1.1 roadmap index.

### Icons

| Document | Contents |
|----------|----------|
| [js/ln-icons/README.md](js/ln-icons/README.md) | SVG sprite system — HTML patterns, available icons, adding new icons |
| [docs/js/icons.md](docs/js/icons.md) | Architecture — on-demand CDN loading, runtime sprite injection, #ln- vs #lnc- routing |

---

## Demo

Interactive demos in `demo/admin/` — each JS and CSS component has its own page. The demo is itself a project consuming ln-ashlar, showing how to write project-level SCSS using mixins and tokens.

```
demo/admin/index.html       ← Dashboard
demo/admin/mixins.html      ← Full mixin reference (visual)
demo/admin/icons.html       ← All icons with search + filter
demo/admin/{component}.html ← Per-component demos
```
