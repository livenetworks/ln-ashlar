# 🚀 ln-ashlar

> **Unified frontend library for LiveNetworks projects.** Delivering a high-performance harmony between server-rendered HTML, semantic SCSS mixins, and attribute-driven, zero-initialization vanilla JS components. Built with **zero dependencies** for maximum speed, longevity, and security.

---

## 🏛️ The DOM-First Paradigm (Why `ln-ashlar`?)

Modern web development has fallen into a trap of excessive complexity. **`ln-ashlar` is an architectural statement: the browser works with HTML, not a Virtual DOM.**

Instead of downloading megabytes of JavaScript, compiling in runtime, and displaying empty "skeleton screens" while waiting for cascading API waterfalls, `ln-ashlar` champions a **DOM-First, progressive, and local-first** approach:

1. **Server-Rendered HTML**: Your backend (Laravel, Go, Rails, etc.) delivers complete, semantic, indexable HTML. Fast to paint, SEO-friendly, and accessible in milliseconds.
2. **Zero-Initialization JS**: Modular interactivity is driven by standard HTML attributes (`data-ln-modal`, `data-ln-filter`, `data-ln-store`). A native `MutationObserver` registers and activates components automatically. No `new Component()` or `init()` boilerplate required.
3. **Pure SCSS Styling via `@include`**: HTML remains semantic, describing *what* the element is. SCSS mixins describe *how* it looks. Visual styling is fully decoupled from markup.
4. **Zero Dependencies**: 100% immune to npm supply chain attacks and package obsolescence. Built exclusively on eternal, backward-compatible W3C web standards (see note below on runtime icon CDN caching).

> [!NOTE]
> **Runtime Icon CDN Dependency:** While `ln-ashlar` has zero runtime npm package dependencies, the `ln-icons` component fetches SVG icons dynamically from jsDelivr (Tabler Icons) or a custom CDN URL. Once fetched, they are stored in `localStorage` so subsequent page views load instantly and work offline. If the client is offline and `localStorage` is empty, icon requests will fail silently and not display.

> [!TIP]
> 📖 **Read the complete engineering manifesto!**  
> For a detailed historical analysis of processing cycles, performance (Skeleton Screens vs. IndexedDB cache), the obsolescence issues of SPA frameworks, and security CVE risks with npm, read our complete [Architectural Philosophy](docs/architecture/philosophy.md).

---

### JS-First (React / Vue / Angular) vs. DOM-First with `ln-ashlar`

| Architectural Challenge | Mainstream JS-First (SPA) | DOM-First with `ln-ashlar` |
| :--- | :--- | :--- |
| **Primary Rendering** | Client-side via heavy Virtual DOM compilation. | Server-side via standard HTML. |
| **Binding & Config** | Inside JS files via imports, props, and states. | Directly in HTML via semantic `data-ln` attributes. |
| **Network Overhead** | Megabytes of JS, hundreds of transitive `npm` packages. | **Zero-Dependency (0 npm packages at runtime)**. |
| **Security Risks** | High (transitive dependency supply chain vulnerability). | Zero. Native vanilla JS communicating directly with Web APIs. |
| **Longevity & Support** | EOL cycles every 6-18 months (breaking framework upgrades). | **100% Stable (backed by permanent W3C web standards)**. |
| **Progressive Adoption** | All-or-nothing SPA deployment. | Progressive: drop a single `ln-table` onto any layout. |

---

## 🧭 Four Core Philosophy Principles

Four strict principles drive every technical decision in this library:

1. **HTML describes WHAT, not HOW** — Use semantic elements only. No presentational or utility classes in markup (avoid `grid-4`, `text-secondary`, `flex`). Visual changes happen in SCSS, never in HTML.
2. **Style via `@include` on semantic selectors** — Projects write `#user-table { @include table-base; }`, not `<table class="table table-striped">`. The selector describes the element; the mixin describes how it looks.
3. **Every color is a CSS variable** — Always use `hsl(var(--color-primary))`, never hardcoded hex codes like `#2737a1`. This makes the entire design system fully customizable at any scope via simple variable overrides.
4. **JS is attribute-driven, zero init** — Interactivity is declared via attributes (`data-ln-modal`, `data-ln-filter`, `data-ln-toggle`). A single `MutationObserver` registers, binds, and cleans up instances automatically.

---

## ⚡ Quick Start

`ln-ashlar` is a source-only package. Import SCSS and JS directly and let your project's bundler compile them.

### 1. Install via npm
```bash
npm install @livenetworks/ashlar
```

Import source files into your main entries:
```js
// main.scss - Import SCSS tokens, mixins, and defaults
@use '@livenetworks/ashlar/scss/ln-ashlar.scss';

// main.js - Import and auto-initialize JS components
import '@livenetworks/ashlar/js/index.js';
```

### 2. Install as a Git Submodule (Alternative)
```bash
git submodule add .../ln-ashlar.git resources/ln-ashlar
```

Then reference the submodule paths:
```scss
@use 'resources/ln-ashlar/scss/ln-ashlar.scss';
```
```js
import 'resources/ln-ashlar/js/index.js';
```

### 3. Build & Watch (For Library Demos Only)
If you are developing inside this repository, compile the static demo assets:
```bash
npm run build   # Produces demo/dist/ln-ashlar.{css,js,iife.js} + compiles HTML demo pages
npm run dev     # Watch mode (automatic compilation on SCSS or JS changes)
```
*Note: The `demo/dist/` artifact exists solely for the demo pages. Product consumers should always bundle from source.*

---

## 📐 Core Architecture Specifications

Deep architectural blueprints detailing the engine driving `ln-ashlar`.

| Specification | Contents |
|:---|:---|
| 📖 **[Architecture Philosophy](docs/architecture/philosophy.md)** | The DOM-First engineering manifesto detailing computing cycles, framework EOL risks, and performance. |
| 🔄 **[Data Flow Architecture](docs/architecture/data-flow.md)** | Rules governing how data moves. Splits responsibilities into **four isolated concerns**: Data (`ln-store`), Render (`ln-table`), Submit (`ln-form`), and Validate (`ln-validate`). Details the **optimistic and offline write pipeline** with a comprehensive Mermaid flow diagram. |
| 🧭 **[3-Tier Local-First Storage Specs](docs/architecture/data-store-architecture.md)** | Technical reference for decoupling storage caches (`ln-data-store`), network gateways (`ln-*-connector`), and data transformations (`ln-mapper`) under a single parent **Data Coordinator** (`ln-data-coordinator`). |
| ⚡ **[Reactive Architecture Reference](docs/v2-reactive.md)** | Blueprint on how components manage internal state using Proxy traps (`reactiveState` and `deepReactive`), batched microtask rendering, DOM bindings (`fill`, `renderList`), and attribute-to-state bridges. |
| 📐 **[Design System Specifications](docs/architecture/reference.md)** | Complete styling specs covering CSS Custom Properties, layout grids, buttons, responsive breakpoints, typography hierarchies, dark mode theming, and icons. |
| 🛡️ **[Security & Threat Mitigation](docs/architecture/security.md)** | Deep architectural security analysis covering Web Crypto API encryption-at-rest, strict CSP compliance (no dynamic eval), sensitive DOM attribute protections, and AJAX XSS sanitization filters. |
| 🧠 **[Architect Overview Guide](docs/architecture/overview.md)** | The master developer guide introducing the DOM-First doctrine, component inventories, override architectures, and new project integration pipelines. |

---

## 📚 General Documentation Index

For detailed manual instructions, properties, attributes, and events of individual components:

* 📚 **[Complete Documentation Index](docs/README.md)** — The master roadmap containing direct links to usage guides (`js/ln-*/README.md`) and internal architecture sheets (`docs/js/*.md`) for every module.

### CSS Layer Reference

| Guide | Scope |
|---|---|
| 🎨 **[Design Tokens](docs/css/tokens.md)** | All CSS custom properties: colors, spacing, borders, typography scale, z-index. |
| 🎛️ **[Mixins Reference](docs/css/mixins.md)** | Extensive list of all SCSS `@include` recipes available for semantic styling. |
| 📑 **[Forms](docs/css/forms.md)** | Declarative layout patterns, spacing, grids, and input validation states. |
| 📇 **[Cards](docs/css/cards.md)** | Custom properties and mixins for basic card structures and section headers. |
| 📊 **[Tables](docs/css/tables.md)** | Tabular layout patterns, striped themes, and responsive screen-overflow. |
| 🗺️ **[Navigation](docs/css/navigation.md)** | Semantic navigation bar mixins, sidebar layouts, and collapsible drawer states. |
| 📏 **[Layout](docs/css/layout.md)** | Flexbox, grid utilities, container query states, and collapsible selectors. |
| 📁 **[Sections](docs/css/sections.md)** | Visual separation blocks and responsive layout containers. |
| 🧭 **[Breadcrumbs](docs/css/breadcrumbs.md)** | Horizontal navigation trail styling mixins. |
| 📦 **[Container Queries](docs/ln-ashlar-container-queries.md)** | Mobile-first component layouts reacting to the width of their parent container. |

### JS Components Reference

| Component | Usage Guide (HTML Attributes / Events) | Technical Architecture (State / Render Loops) |
|---|---|---|
| **Core Utilities** | — | 🛠️ **[Core helpers reference](docs/js/core.md)** |
| **Component Pattern** | — | 🧠 **[JS Component Design Guide](docs/js/component-guide.md)** |
| **SVG Icons** | 🏷️ **[Icon SVG Sprite Reference](js/ln-icons/README.md)** | 🌐 **[On-Demand CDN routing & injection](docs/js/icons.md)** |
| **Toggle** | 🎚️ **[ln-toggle docs](js/ln-toggle/README.md)** | 📄 **[toggle architecture](docs/js/toggle.md)** |
| **Accordion** | 📂 **[ln-accordion docs](js/ln-accordion/README.md)** | 📄 **[accordion architecture](docs/js/accordion.md)** |
| **Modal** | 🪟 **[ln-modal docs](js/ln-modal/README.md)** | 📄 **[modal architecture](docs/js/modal.md)** |
| **Tabs** | 🔖 **[ln-tabs docs](js/ln-tabs/README.md)** | 📄 **[tabs architecture](docs/js/tabs.md)** |
| **Toast** | 🔔 **[ln-toast docs](js/ln-toast/README.md)** | 📄 **[toast architecture](docs/js/toast.md)** |
| **Dropdown** | 🔽 **[ln-dropdown docs](js/ln-dropdown/README.md)** | 📄 **[dropdown architecture](docs/js/dropdown.md)** |
| **Popover** | 💬 **[ln-popover docs](js/ln-popover/README.md)** | 📄 **[popover architecture](docs/js/popover.md)** |
| **Tooltip (JS)** | 💬 **[ln-tooltip docs](js/ln-tooltip/README.md)** | 📄 **[tooltip architecture](docs/js/tooltip.md)** |
| **Navigation** | 🗺️ **[ln-nav docs](js/ln-nav/README.md)** | 📄 **[nav architecture](docs/js/nav.md)** |
| **Filter** | 🔍 **[ln-filter docs](js/ln-filter/README.md)** | 📄 **[filter architecture](docs/js/filter.md)** |
| **Search** | 🔎 **[ln-search docs](js/ln-search/README.md)** | 📄 **[search architecture](docs/js/search.md)** |
| **Table** | 📊 **[ln-table docs](js/ln-table/README.md)** | 📄 **[table architecture](docs/js/table.md)** |
| **Table Sort** | 📊 **[ln-table docs (Sort)](js/ln-table/README.md)** | 📄 **[table-sort architecture](docs/js/table-sort.md)** |
| **Sortable** | 🔃 **[ln-sortable docs](js/ln-sortable/README.md)** | 📄 **[sortable architecture](docs/js/sortable.md)** |
| **Progress** | 📈 **[ln-progress docs](js/ln-progress/README.md)** | 📄 **[progress architecture](docs/js/progress.md)** |
| **Circular Progress** | 📈 **[ln-circular-progress docs](js/ln-circular-progress/README.md)** | 📄 **[circular-progress architecture](docs/js/circular-progress.md)** |
| **Link** | 🔗 **[ln-link docs](js/ln-link/README.md)** | 📄 **[link architecture](docs/js/link.md)** |
| **Confirm** | ⚠️ **[ln-confirm docs](js/ln-confirm/README.md)** | 📄 **[confirm architecture](docs/js/confirm.md)** |
| **Upload** | 📤 **[ln-upload docs](js/ln-upload/README.md)** | 📄 **[upload architecture](docs/js/upload.md)** |
| **AJAX** | 🔄 **[ln-ajax docs](js/ln-ajax/README.md)** | 📄 **[ajax architecture](docs/js/ajax.md)** |
| **HTTP** | — | 📄 **[http service architecture](docs/js/http.md)** |
| **Store** | 🗄️ **[ln-store docs](js/ln-store/README.md)** | 📄 **[store cache architecture](docs/js/store.md)** |
| **API Connector** | 🔌 **[ln-api-connector docs](js/ln-api-connector/README.md)** | — |
| **CouchDB Connector** | 🔌 **[ln-couchdb-connector docs](js/ln-couchdb-connector/README.md)** | 📄 **[couchdb-connector architecture](docs/js/couchdb-connector.md)** |
| **Form** | 📝 **[ln-form docs](js/ln-form/README.md)** | 📄 **[form lifecycle architecture](docs/js/form.md)** |
| **Validate** | ⚠️ **[ln-validate docs](js/ln-validate/README.md)** | 📄 **[validate architecture](docs/js/validate.md)** |
| **Time** | 🕒 **[ln-time docs](js/ln-time/README.md)** | 📄 **[time architecture](docs/js/time.md)** |
| **Autosave** | 💾 **[ln-autosave docs](js/ln-autosave/README.md)** | 📄 **[autosave architecture](docs/js/autosave.md)** |
| **Autoresize** | ↕️ **[ln-autoresize docs](js/ln-autoresize/README.md)** | 📄 **[autoresize architecture](docs/js/autoresize.md)** |
| **Translations** | 🗣️ **[ln-translations docs](js/ln-translations/README.md)** | 📄 **[translations architecture](docs/js/translations.md)** |
| **External Links** | 🌐 **[ln-external-links docs](js/ln-external-links/README.md)** | 📄 **[external-links architecture](docs/js/external-links.md)** |

---

## 🖥️ Interactive Demo Site

`ln-ashlar` ships with a complete local dashboard environment inside `demo/admin/`. The demo is itself a project consuming `ln-ashlar`, showing real-world layout structures, component setups, and customized semantic SCSS:

```
demo/admin/index.html       ← Dashboard Overview (cards, navigation, timelines)
demo/admin/mixins.html      ← Interactive visual catalog of all SCSS mixins
demo/admin/icons.html       ← Live SVG sprite icons browser (with live search/filter)
demo/admin/{component}.html ← Standalone interactive playground pages for JS components
```
