# 🚀 ln-ashlar

> **Unified, zero-dependency frontend framework for both Server-Rendered (SSR) & Client-Side SPA applications.** Delivering a high-performance harmony between server-rendered HTML or REST/JSON APIs, semantic SCSS mixins, client-side routing, and attribute-driven, zero-initialization vanilla JS components. Built with **zero runtime dependencies** for maximum speed, longevity, and security.

🌐 **Live Interactive Demo:** [ashlar.live.net.mk](https://ashlar.live.net.mk)

---

## 🏛️ The Dual-Core DOM-First Paradigm (SSR + Client-Side SPA)

`ln-ashlar` is built on a **DOM-First** architecture. The browser works directly with native DOM standards, not a heavy Virtual DOM compilation layer. 

Whether your architecture relies on **Server-Rendered HTML** (Laravel, Go, Django, Rails) or **Client-Side SPAs consuming REST/JSON APIs**, `ln-ashlar` provides first-class support for both paradigms:

### 1. 🌐 Server-Rendered HTML (SSR Mode)
* **Progressive HTML Enhancement:** Your backend delivers complete, semantic, indexable HTML.
* **Instant First Paint:** Fast to render, SEO-friendly, and accessible in milliseconds.
* **Zero Boilerplate:** HTML elements auto-activate via attributes (`data-ln-modal`, `data-ln-filter`, `data-ln-data-store`) backed by a native `MutationObserver`.

### 2. ⚡ Client-Side Single-Page Applications (SPA / JSON Mode)
* **Built-in SPA Router (`ln-router`):** Full client-side routing with dynamic parameters (`/users/:id`), catch-all paths (`*`), atomic region swapping (`replaceChildren`), and cancelable navigation intercepts (`ln-router:before-navigate`).
* **Compound Hash-State Codec (`hash.js`):** Deep linking and overlay state tracking (`#tab:settings&modal:42`) that preserves browser Back/Forward navigation without page reloads.
* **JSON API Data Layer (`ln-http`, `ln-api-connector`, `ln-store`):** Native async JSON client with abort control, queueing, and 3-Tier local storage (Memory + IndexedDB/localStorage).
* **Client-Side Reactive Rendering (`lnCore.renderList` & `reactiveState`):** Declaratively render and bind JSON API payloads into `<template>` nodes with Proxy-backed reactive state updates without Virtual DOM overhead.
* **Modular Authoring (`spa-starter/`):** Out-of-the-box SPA scaffold supporting co-located view modules (`App.defineView()`) and session-long modules (`App.defineModule()`).

> [!NOTE]
> **Runtime Icon CDN Dependency:** While `ln-ashlar` has zero runtime npm package dependencies, the `ln-icons` component fetches SVG icons dynamically from jsDelivr (Tabler Icons) or a custom CDN URL. Once fetched, they are stored in `localStorage` so subsequent page views load instantly and work offline. If the client is offline and `localStorage` is empty, icon requests will fail silently and not display.

> [!TIP]
> 📖 **Read the complete engineering manifesto!**  
> For a detailed historical analysis of processing cycles, performance (Skeleton Screens vs. IndexedDB cache), framework EOL risks, and security CVE risks with npm, read our complete [Architectural Philosophy](docs/architecture/philosophy.md).

---

### Heavy Virtual-DOM (React / Vue / Angular) vs. DOM-First `ln-ashlar`

| Architectural Dimension | Heavy Virtual-DOM (React / Vue / Angular) | DOM-First `ln-ashlar` (SSR or SPA) |
| :--- | :--- | :--- |
| **Execution Paradigm** | Heavy Virtual DOM compilation layer in memory. | Native W3C DOM APIs (`MutationObserver`, Custom Attributes). |
| **Application Architecture** | SPA only (requires Next.js/Nuxt for SSR). | **Dual Mode**: Built-in **Client-Side SPA** (`ln-router` + `spa-starter`) AND **SSR Mode**. |
| **Data Sources** | REST / GraphQL JSON APIs. | **Both REST / JSON APIs** (`ln-http`, `renderList`) AND **Server HTML**. |
| **Dependencies** | Megabytes of JS, hundreds of npm packages. | **Zero Dependencies** (0 npm packages at runtime). |
| **Security Risks** | High (transitive dependency supply chain risks). | Zero supply-chain vulnerabilities. |
| **Longevity & Support** | EOL breaking upgrades every 6-18 months. | **100% Stable** (built on eternal W3C browser standards). |
| **Progressive Adoption** | All-or-nothing SPA deployment. | Progressive: drop a single `ln-table` or `ln-router` onto any page. |

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
| 🔄 **[Data Flow Architecture](docs/architecture/data-flow.md)** | Rules governing how data moves. Splits responsibilities into **four isolated concerns**: Data (`ln-data-store` + `ln-data-coordinator`), Render (`ln-table`), Submit (`ln-form`), and Validate (`ln-validate`). Details the **parallel fan-out write pipeline** (optimistic cache write + offline queue) with a comprehensive Mermaid flow diagram. |
| 🧭 **[3-Tier Local-First Storage Specs](docs/architecture/data-store-architecture.md)** | Technical reference for decoupling storage caches (`ln-data-store`), network gateways (`ln-*-connector`), and data transformations (`ln-mapper`) under a single parent **Data Coordinator** (`ln-data-coordinator`). |
| ⚡ **[Reactive Architecture Reference](docs/reactive.md)** | Blueprint on how components manage internal state using Proxy traps (`reactiveState` and `deepReactive`), batched microtask rendering, DOM bindings (`fill`, `renderList`), and attribute-to-state bridges. |
| 📐 **[Design System Specifications](docs/architecture/reference.md)** | Complete styling specs covering CSS Custom Properties, layout grids, buttons, responsive breakpoints, typography hierarchies, dark mode theming, and icons. |
| 🛡️ **[Security & Threat Mitigation](docs/architecture/security.md)** | Deep architectural security analysis covering Web Crypto API encryption-at-rest, strict CSP compliance (no dynamic eval), sensitive DOM attribute protections, and the same-origin AJAX fragment trust boundary. |
| 🧠 **[Architect Overview Guide](docs/architecture/overview.md)** | The master developer guide introducing the DOM-First doctrine, component inventories, override architectures, and new project integration pipelines. |

---

## 📚 General Documentation Index

For detailed manual instructions, properties, attributes, and events of individual components:

* 📚 **[Complete Documentation Index](docs/README.md)** — The master roadmap containing direct links to each module's usage guide and architecture reference, both in `js/ln-*/README.md`.

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
| **Core Utilities** | — | 🛠️ **[Core helpers reference](js/ln-core/README.md)** |
| **Component Pattern** | — | 🧠 **[JS Component Design Guide](docs/architecture/component-guide.md)** |
| **SVG Icons** | 🏷️ **[Icon SVG Sprite Reference](js/ln-icons/README.md)** | 🌐 **[On-Demand CDN routing & injection](js/ln-icons/README.md)** |
| **Toggle** | 🎚️ **[ln-toggle docs](js/ln-toggle/README.md)** | 📄 **[toggle architecture](js/ln-toggle/README.md)** |
| **Accordion** | 📂 **[ln-accordion docs](js/ln-accordion/README.md)** | 📄 **[accordion architecture](js/ln-accordion/README.md)** |
| **Modal** | 🪟 **[ln-modal docs](js/ln-modal/README.md)** | 📄 **[modal architecture](js/ln-modal/README.md)** |
| **Tabs** | 🔖 **[ln-tabs docs](js/ln-tabs/README.md)** | 📄 **[tabs architecture](js/ln-tabs/README.md)** |
| **Toast** | 🔔 **[ln-toast docs](js/ln-toast/README.md)** | 📄 **[toast architecture](js/ln-toast/README.md)** |
| **Dropdown** | 🔽 **[ln-dropdown docs](js/ln-dropdown/README.md)** | 📄 **[dropdown architecture](js/ln-dropdown/README.md)** |
| **Popover** | 💬 **[ln-popover docs](js/ln-popover/README.md)** | 📄 **[popover architecture](js/ln-popover/README.md)** |
| **Tooltip (JS)** | 💬 **[ln-tooltip docs](js/ln-tooltip/README.md)** | 📄 **[tooltip architecture](js/ln-tooltip/README.md)** |
| **Keyboard Shortcuts** | ⌨️ **[ln-key docs](js/ln-key/README.md)** | 📄 **[key architecture](js/ln-key/README.md)** |
| **Navigation** | 🗺️ **[ln-nav docs](js/ln-nav/README.md)** | 📄 **[nav architecture](js/ln-nav/README.md)** |
| **Filter** | 🔍 **[ln-filter docs](js/ln-filter/README.md)** | 📄 **[filter architecture](js/ln-filter/README.md)** |
| **Search** | 🔎 **[ln-search docs](js/ln-search/README.md)** | 📄 **[search architecture](js/ln-search/README.md)** |
| **Table** | 📊 **[ln-table docs](js/ln-table/README.md)** | 📄 **[table architecture](js/ln-table/README.md)** |
| **Table Sort** | 📊 **[ln-table docs (Sort)](js/ln-table/README.md)** | 📄 **[table-sort architecture](js/ln-table/README.md)** |
| **Sortable** | 🔃 **[ln-sortable docs](js/ln-sortable/README.md)** | 📄 **[sortable architecture](js/ln-sortable/README.md)** |
| **Progress** | 📈 **[ln-progress docs](js/ln-progress/README.md)** | 📄 **[progress architecture](js/ln-progress/README.md)** |
| **Circular Progress** | 📈 **[ln-circular-progress docs](js/ln-circular-progress/README.md)** | 📄 **[circular-progress architecture](js/ln-circular-progress/README.md)** |
| **Link** | 🔗 **[ln-link docs](js/ln-link/README.md)** | 📄 **[link architecture](js/ln-link/README.md)** |
| **Confirm** | ⚠️ **[ln-confirm docs](js/ln-confirm/README.md)** | 📄 **[confirm architecture](js/ln-confirm/README.md)** |
| **Upload** | 📤 **[ln-upload docs](js/ln-upload/README.md)** | 📄 **[upload architecture](js/ln-upload/README.md)** |
| **AJAX** | 🔄 **[ln-ajax docs](js/ln-ajax/README.md)** | 📄 **[ajax architecture](js/ln-ajax/README.md)** |
| **HTTP** | — | 📄 **[http service architecture](js/ln-http/README.md)** |
| **Store** | 🗄️ **[ln-data-store docs](js/ln-data-store/README.md)** | 📄 **[store cache architecture](js/ln-data-store/README.md)** |
| **API Connector** | 🔌 **[ln-api-connector docs](js/ln-api-connector/README.md)** | — |
| **CouchDB Connector** | 🔌 **[ln-couchdb-connector docs](js/ln-couchdb-connector/README.md)** | 📄 **[couchdb-connector architecture](js/ln-couchdb-connector/README.md)** |
| **Form** | 📝 **[ln-form docs](js/ln-form/README.md)** | 📄 **[form lifecycle architecture](js/ln-form/README.md)** |
| **Validate** | ⚠️ **[ln-validate docs](js/ln-validate/README.md)** | 📄 **[validate architecture](js/ln-validate/README.md)** |
| **Time** | 🕒 **[ln-time docs](js/ln-time/README.md)** | 📄 **[time architecture](js/ln-time/README.md)** |
| **Autosave** | 💾 **[ln-autosave docs](js/ln-autosave/README.md)** | 📄 **[autosave architecture](js/ln-autosave/README.md)** |
| **Autoresize** | ↕️ **[ln-autoresize docs](js/ln-autoresize/README.md)** | 📄 **[autoresize architecture](js/ln-autoresize/README.md)** |
| **Translations** | 🗣️ **[ln-translations docs](js/ln-translations/README.md)** | 📄 **[translations architecture](js/ln-translations/README.md)** |
| **External Links** | 🌐 **[ln-external-links docs](js/ln-external-links/README.md)** | 📄 **[external-links architecture](js/ln-external-links/README.md)** |

---

## 🖥️ Interactive Demo Site

`ln-ashlar` ships with a complete local dashboard environment inside `demo/admin/`. The demo is itself a project consuming `ln-ashlar`, showing real-world layout structures, component setups, and customized semantic SCSS:

```
demo/admin/index.html       ← Dashboard Overview (cards, navigation, timelines)
demo/admin/mixins.html      ← Interactive visual catalog of all SCSS mixins
demo/admin/icons.html       ← Live SVG sprite icons browser (with live search/filter)
demo/admin/{component}.html ← Standalone interactive playground pages for JS components
```
