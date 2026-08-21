# 🚀 ln-ashlar

> **Unified, zero-dependency frontend framework for both Server-Rendered (SSR) & Client-Side SPA applications.** Delivering a high-performance harmony between server-rendered HTML or REST/JSON APIs, semantic SCSS mixins, client-side routing, and attribute-driven, zero-initialization vanilla JS components. Built with **zero runtime dependencies** for maximum speed, longevity, and security.

🌐 **Live Interactive Demo:** [ashlar.live.net.mk](https://ashlar.live.net.mk)

---

## 🏛️ The Dual-Core DOM-First Paradigm (SSR + Client-Side SPA)

`ln-ashlar` is built on a **DOM-First** architecture. The browser works directly with native DOM standards; there is no in-memory component tree to build. 

Whether your architecture relies on **Server-Rendered HTML** (Laravel, Go, Django, Rails) or **Client-Side SPAs consuming REST/JSON APIs**, `ln-ashlar` provides first-class support for both paradigms:

### 1. 🌐 Backend-First Progressive HTML Enhancement (SSR)
* **Progressive HTML Enhancement:** Your backend delivers complete, semantic, indexable HTML.
* **Instant First Paint:** Fast to render, SEO-friendly, and accessible in milliseconds.
* **Zero Boilerplate:** HTML elements auto-activate via attributes (`data-ln-modal`, `data-ln-filter`, `data-ln-data-store`) backed by a native `MutationObserver`.

### 2. ⚡ Client-Side Single-Page Applications (SPA / JSON Mode)
* **Built-in SPA Router (`ln-router`):** Full client-side routing with dynamic parameters (`/users/:id`), catch-all paths (`*`), atomic region swapping (`replaceChildren`), and cancelable navigation intercepts (`ln-router:before-navigate`).
* **Compound Hash-State Codec (`hash.js`):** Deep linking and overlay state tracking (`#tab:settings&modal:42`) that preserves browser Back/Forward navigation without page reloads.
* **JSON API Data Layer (`ln-http`, `ln-api-connector`, `ln-data-store`):** Native async JSON client with abort control, queueing, and 3-Tier local storage (Memory + IndexedDB/localStorage).
* **Client-Side Reactive Rendering (`lnCore.renderList`, `deepReactive` & `createBatcher`):** Declaratively render and bind JSON API payloads into `<template>` nodes with keyed node reuse (`data-ln-key`), deep Proxy mutation traps, and microtask render batching (`queueMicrotask`) without Virtual DOM overhead.
* **Modular Authoring (`spa-starter/`):** Out-of-the-box SPA scaffold supporting co-located view modules (`App.defineView()`) and session-long modules (`App.defineModule()`).

> [!NOTE]
> **Runtime Icon CDN Dependency:** While `ln-ashlar` has zero runtime npm package dependencies, the `ln-icon` component fetches SVG icons dynamically from jsDelivr (Tabler Icons) or a custom CDN URL. Once fetched, they are stored in `localStorage` so subsequent page views load instantly and work offline. If the client is offline and `localStorage` is empty, icon requests will fail silently and not display.

> [!TIP]
> 📖 **Read the complete engineering manifesto!**  
> For a detailed historical analysis of processing cycles, performance (Skeleton Screens vs. IndexedDB cache), framework EOL risks, and security CVE risks with npm, read our complete [Architectural Philosophy](docs/architecture/philosophy.md).

---

### Architectural Comparison & Trade-offs

| Dimension | Component-Tree Frameworks (React / Vue / Angular) | DOM-First Architecture (`ln-ashlar`) |
| :--- | :--- | :--- |
| **UI & Rendering Model** | In-memory component tree & reconciliation (Virtual DOM / Ivy / Signals) with hydration. | Direct W3C DOM enhancement via `MutationObserver` and custom `data-ln-*` attributes. Zero hydration cost. |
| **Runtime Dependencies** | Framework runtime dependencies + npm package ecosystem. | **Zero runtime dependencies** (0 npm packages at runtime, pure native Web APIs). |
| **Server & Client Harmony** | Primarily JSON/client-state oriented; SSR requires dedicated hydration / server-rendering pipelines. | **Dual Mode**: Direct progressive enhancement over server-rendered HTML (Laravel, Go, Django) or client SPA (`ln-router`). |
| **Data & State Flow** | Fine-grained reactivity, unidirectional props/state, centralized stores. | Local-first store (IndexedDB/Memory) with FIFO sync queue, event-driven inter-component messaging. |
| **Best Suited For** | High-frequency continuous client state (collaborative editors, real-time dashboards, complex canvas). | Admin panels, CRUD systems, enterprise portals, long-lived apps with strong backend integration. |
| **Key Architectural Cost** | Dependency maintenance, hydration overhead, framework-specific abstractions. | Manual bookkeeping for derived state (no auto-signals), runtime-only event tracing, no JSX compile-time markup types. |
| **Long-Term Longevity** | Managed via framework LTS releases and automated migration tools (`ng update`, codemods). | Built directly on permanent W3C browser standards (`<dialog>`, Popover API, `CustomEvent`). |

---

### The Three Core Assertions of DOM-First Architecture

1. 🔍 **Zero Hidden State in JS Memory:** State is never trapped inside private JavaScript closures, component instances, or hidden memory trees. The true state lives openly and visibly on the DOM element's attributes (`data-ln-*`).
2. 🧪 **100% Declarative, Testable & Reproducible:** Any given UI state (searching a term, opening a modal, toggling an accordion, deep-linking) can be authored, inspected, automated, restored, or server-rendered purely via HTML attributes without orchestration scripts.
3. 🎛️ **DevTools Inspector as the Control Plane:** Editing any attribute in the browser's DevTools Inspector immediately activates the component's functionality in real-time. The underlying `MutationObserver` instantly synchronizes the internal engine, updates the DOM, syncs matching controls (`[data-ln-*-for]`), and dispatches lifecycle events.

---

## 💡 Declarative HTML at a Glance

Combine autonomous components directly in semantic HTML — **zero initialization scripts**, full accessibility, and automatic `MutationObserver` binding:

```html
<!-- Trigger Button with Tooltip and Icon -->
<button type="button" data-ln-modal-for="user-modal" data-ln-tooltip="Add new user">
  <svg class="ln-icon" aria-hidden="true"><use href="#ln-user-plus"></use></svg> Create User
</button>

<!-- Native Modal Dialog with Form Validation -->
<dialog class="ln-modal" data-ln-modal id="user-modal">
  <form method="dialog">
    <header>
      <h3>Create User</h3>
      <button type="button" data-ln-modal-close aria-label="Close">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
      </button>
    </header>

    <main>
      <div class="form-element">
        <label for="email">Email Address</label>
        <input id="email" name="email" type="email" required minlength="5" data-ln-validate>
        <ul data-ln-validate-errors>
          <li class="hidden" data-ln-validate-error="required">Email is required</li>
          <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
        </ul>
      </div>
    </main>

    <footer>
      <button type="button" data-ln-modal-close>Cancel</button>
      <button type="submit">Submit</button>
    </footer>
  </form>
</dialog>
```

> **What happens automatically under the hood:**
> - `data-ln-modal-for="user-modal"` binds the trigger button to toggle the native `<dialog>` without writing JS listeners (`ln-modal`).
> - `data-ln-tooltip` mounts an accessible top-layer tooltip on hover and focus (`ln-tooltip`).
> - `<use href="#ln-*">` fetches SVG icons on-demand from CDN and caches them in `localStorage` (`ln-icons`).
> - `data-ln-validate` intercepts the form submit gate, validates native browser `ValidityState`, and toggles `.hidden` on corresponding error messages without external validation libraries (`ln-validate`).
> - `data-ln-modal-close` safely dismisses the modal and restores focus (`ln-modal`).

---

## 🧭 Four Core Philosophy Principles

Four strict principles drive every technical decision in this library:

1. **HTML describes WHAT, not HOW** — Use semantic elements only. No presentational or utility classes in markup (avoid `grid-4`, `text-secondary`, `flex`). Visual changes happen in SCSS, never in HTML.
2. **Style via `@include` on semantic selectors** — Projects write `#user-table { @include table-base; }`, not `<table class="table table-striped">`. The selector describes the element; the mixin describes how it looks.
3. **Every color is a CSS variable** — Always use `hsl(var(--color-primary))`, never hardcoded hex codes like `#2737a1`. This makes the entire design system fully customizable at any scope via simple variable overrides.
4. **JS is attribute-driven, zero init** — Interactivity is declared via attributes (`data-ln-modal`, `data-ln-filter`, `data-ln-toggle`). A single `MutationObserver` registers, binds, and cleans up instances automatically.

---

## 🤖 AI-Native & MCP Surface

`ln-ashlar` is designed from the ground up to be inspectable, routable, and generatable by AI agents:

* **Machine-Readable Component Corpus (`docs-mcp/`):** Unified, schema-validated documentation served directly to AI agent workflows via Model Context Protocol (MCP).
* **MCP Component Router:** Decision matrix and routing layer that resolves user intent to specific declarative components before generating markup.
* **In-Repo Agent Protocols (`.agents/`, `.cursorrules`, `CLAUDE.md`):** Strict architectural rules, component templates, and lifecycle constraints loaded automatically into AI pairing sessions.
* **Agent Skills Submodule (`.claude/`):** Bundled domain skills and workflows (`livenetworks/claude-skills`).

Because `ln-ashlar` relies on semantic HTML, explicit `data-ln-*` attribute contracts, and native W3C events, AI coding agents can resolve user intent directly to a declarative component and emit markup that is verifiable against the attribute contract, with no compilation step between the source and the DOM.

---

## 🌐 Browser Support

`ln-ashlar` targets evergreen browsers with native support for the **Popover API**, since `ln-modal`, `ln-dropdown`, `ln-tooltip`, `ln-toast`, `ln-popover`, and `ln-router` rely on it (via `dialog.showModal()` and `popover`) for top-layer rendering. This is the floor — every other CSS/JS feature the library uses (`:has()`, `color-mix()`, `@container`) is supported earlier in all three engines.

| Browser | Minimum Version |
|---|---|
| Chrome / Edge | 114+ |
| Safari | 17.4+ |
| Firefox | 125+ |

Below this floor, CSS features degrade visually (a rule simply doesn't apply), but the Popover/`<dialog>` JS APIs break functionality outright — the affected components silently fail to open rather than falling back.

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
| **SVG Icons** | 🏷️ **[Icon SVG Sprite Reference](js/ln-icon/README.md)** | 🌐 **[On-Demand CDN routing & injection](js/ln-icon/README.md)** |
| **Toggle** | 🎚️ **[ln-toggle docs](js/ln-toggle/README.md)** | 📄 **[toggle architecture](js/ln-toggle/README.md)** |
| **Accordion** | 📂 **[ln-accordion docs](js/ln-accordion/README.md)** | 📄 **[accordion architecture](js/ln-accordion/README.md)** |
| **Modal** | 🪟 **[ln-modal docs](js/ln-modal/README.md)** | 📄 **[modal architecture](js/ln-modal/README.md)** |
| **UI Coordinator** | 🎛️ **[ln-ui-coordinator docs](js/ln-ui-coordinator/README.md)** | 📄 **[ui-coordinator architecture](js/ln-ui-coordinator/README.md)** |
| **Tabs** | 🔖 **[ln-tabs docs](js/ln-tabs/README.md)** | 📄 **[tabs architecture](js/ln-tabs/README.md)** |
| **Toast** | 🔔 **[ln-toast docs](js/ln-toast/README.md)** | 📄 **[toast architecture](js/ln-toast/README.md)** |
| **Dropdown** | 🔽 **[ln-dropdown docs](js/ln-dropdown/README.md)** | 📄 **[dropdown architecture](js/ln-dropdown/README.md)** |
| **Popover** | 💬 **[ln-popover docs](js/ln-popover/README.md)** | 📄 **[popover architecture](js/ln-popover/README.md)** |
| **Tooltip (JS)** | 💬 **[ln-tooltip docs](js/ln-tooltip/README.md)** | 📄 **[tooltip architecture](js/ln-tooltip/README.md)** |
| **Navigation** | 🗺️ **[ln-nav docs](js/ln-nav/README.md)** | 📄 **[nav architecture](js/ln-nav/README.md)** |
| **Router** | 🧭 **[ln-router docs](js/ln-router/README.md)** | 📄 **[router architecture](js/ln-router/README.md)** |
| **Filter** | 🔍 **[ln-filter docs](js/ln-filter/README.md)** | 📄 **[filter architecture](js/ln-filter/README.md)** |
| **Search** | 🔎 **[ln-search docs](js/ln-search/README.md)** | 📄 **[search architecture](js/ln-search/README.md)** |
| **Table** | 📊 **[ln-table docs](js/ln-table/README.md)** | 📄 **[table architecture](js/ln-table/README.md)** |
| **Table Coordinator** | 🎛️ **[ln-table-coordinator docs](js/ln-table-coordinator/README.md)** | 📄 **[table-coordinator architecture](js/ln-table-coordinator/README.md)** |
| **Sort** | ⇅ **[ln-sort docs](js/ln-sort/README.md)** | 📄 **[sort architecture](js/ln-sort/README.md)** |
| **Sortable** | 🔃 **[ln-sortable docs](js/ln-sortable/README.md)** | 📄 **[sortable architecture](js/ln-sortable/README.md)** |
| **List** | 📋 **[ln-list docs](js/ln-list/README.md)** | 📄 **[list architecture](js/ln-list/README.md)** |
| **Progress** | 📈 **[ln-progress docs](js/ln-progress/README.md)** | 📄 **[progress architecture](js/ln-progress/README.md)** |
| **Circular Progress** | 📈 **[ln-circular-progress docs](js/ln-circular-progress/README.md)** | 📄 **[circular-progress architecture](js/ln-circular-progress/README.md)** |
| **Stat** | 📈 **[ln-stat docs](js/ln-stat/README.md)** | 📄 **[stat architecture](js/ln-stat/README.md)** |
| **Chart** | 📊 **[ln-chart docs](js/ln-chart/README.md)** | 📄 **[chart architecture](js/ln-chart/README.md)** |
| **Link** | 🔗 **[ln-link docs](js/ln-link/README.md)** | 📄 **[link architecture](js/ln-link/README.md)** |
| **Confirm** | ⚠️ **[ln-confirm docs](js/ln-confirm/README.md)** | 📄 **[confirm architecture](js/ln-confirm/README.md)** |
| **Upload** | 📤 **[ln-upload docs](js/ln-upload/README.md)** | 📄 **[upload architecture](js/ln-upload/README.md)** |
| **AJAX** | 🔄 **[ln-ajax docs](js/ln-ajax/README.md)** | 📄 **[ajax architecture](js/ln-ajax/README.md)** |
| **Include** | 📥 **[ln-include docs](js/ln-include/README.md)** | 📄 **[include architecture](js/ln-include/README.md)** |
| **HTTP** | — | 📄 **[http service architecture](js/ln-http/README.md)** |
| **API Queue** | 🚦 **[ln-api-queue docs](js/ln-api-queue/README.md)** | 📄 **[api-queue architecture](js/ln-api-queue/README.md)** |
| **Store** | 🗄️ **[ln-data-store docs](js/ln-data-store/README.md)** | 📄 **[store cache architecture](js/ln-data-store/README.md)** |
| **Data Coordinator** | 🎛️ **[ln-data-coordinator docs](js/ln-data-coordinator/README.md)** | 📄 **[data-coordinator architecture](js/ln-data-coordinator/README.md)** |
| **API Connector** | 🔌 **[ln-api-connector docs](js/ln-api-connector/README.md)** | — |
| **CouchDB Connector** | 🔌 **[ln-couchdb-connector docs](js/ln-couchdb-connector/README.md)** | 📄 **[couchdb-connector architecture](js/ln-couchdb-connector/README.md)** |
| **Form** | 📝 **[ln-form docs](js/ln-form/README.md)** | 📄 **[form lifecycle architecture](js/ln-form/README.md)** |
| **Validate** | ⚠️ **[ln-validate docs](js/ln-validate/README.md)** | 📄 **[validate architecture](js/ln-validate/README.md)** |
| **Fill** | 🧩 **[ln-fill docs](js/ln-fill/README.md)** | 📄 **[fill architecture](js/ln-fill/README.md)** |
| **Options** | ⚙️ **[ln-options docs](js/ln-options/README.md)** | 📄 **[options architecture](js/ln-options/README.md)** |
| **Slug** | 🏷️ **[ln-slug docs](js/ln-slug/README.md)** | 📄 **[slug architecture](js/ln-slug/README.md)** |
| **Date** | 📅 **[ln-date docs](js/ln-date/README.md)** | 📄 **[date architecture](js/ln-date/README.md)** |
| **Time** | 🕒 **[ln-time docs](js/ln-time/README.md)** | 📄 **[time architecture](js/ln-time/README.md)** |
| **Number** | 🔢 **[ln-number docs](js/ln-number/README.md)** | 📄 **[number architecture](js/ln-number/README.md)** |
| **Editor** | ✍️ **[ln-editor docs](js/ln-editor/README.md)** | 📄 **[editor architecture](js/ln-editor/README.md)** |
| **Autosave** | 💾 **[ln-autosave docs](js/ln-autosave/README.md)** | 📄 **[autosave architecture](js/ln-autosave/README.md)** |
| **Autoresize** | ↕️ **[ln-autoresize docs](js/ln-autoresize/README.md)** | 📄 **[autoresize architecture](js/ln-autoresize/README.md)** |
| **Translations** | 🗣️ **[ln-translations docs](js/ln-translations/README.md)** | 📄 **[translations architecture](js/ln-translations/README.md)** |
| **External Links** | 🌐 **[ln-external-links docs](js/ln-external-links/README.md)** | 📄 **[external-links architecture](js/ln-external-links/README.md)** |
| **Debug** | 🐞 **[ln-debug docs](js/ln-debug/README.md)** | 📄 **[debug architecture](js/ln-debug/README.md)** |

---

## 🖥️ Interactive Demo Site

`ln-ashlar` ships with a complete local dashboard environment inside `demo/admin/`. The demo is itself a project consuming `ln-ashlar`, showing real-world layout structures, component setups, and customized semantic SCSS:

```
demo/admin/index.html       ← Dashboard Overview (cards, navigation, timelines)
demo/admin/mixins.html      ← Interactive visual catalog of all SCSS mixins
demo/admin/icons.html       ← Live SVG sprite icons browser (with live search/filter)
demo/admin/{component}.html ← Standalone interactive playground pages for JS components
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
