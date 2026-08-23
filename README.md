# 🚀 ln-ashlar

> **AI-Native, DOM-First Web Application Architecture for Long-Lived Systems.**  
> Unlike mainstream JS frameworks that treat the DOM as a passive output projection of an in-memory JavaScript state tree, `ln-ashlar` leverages the native W3C DOM as an **authoritative runtime state surface**. Built with **zero runtime npm dependencies** for maximum speed, longevity, AI-agent efficiency, and security.

🌐 **Live Interactive Demo:** [ashlar.live.net.mk](https://ashlar.live.net.mk)

---

## 🏛️ The Paradigm: DOM as the Runtime State Surface

`ln-ashlar` rejects the mainstream premise that applications must build a secondary UI tree in JavaScript memory (Virtual DOM, Signals, or fine-grained reactivity trees). Instead, it establishes **DOM-First Architecture**:

1. 🔍 **Zero Hidden State in JS Memory:** Application state is never trapped inside private JavaScript closures, reactivity signals, or hidden memory trees. The true state lives openly and visibly on the DOM element's attributes (`data-ln-*`).
2. 🎛️ **DevTools Inspector as the Control Plane:** Modifying any attribute directly in browser DevTools immediately activates the component's behavior in real-time. Native `MutationObserver` instantly synchronizes the internal engine, updates the DOM, and dispatches lifecycle events.
3. 🤖 **AI-Native & Contract-Driven:** AI agents (via MCP, `.agents/`, and `docs-mcp/`) generate declarative, schema-validated HTML contracts rather than complex JavaScript program trees.

---

## 📊 Architectural Positioning & Trade-offs

| Dimension | Component-Tree Frameworks (React / Vue / Angular) | DOM-First Architecture (`ln-ashlar`) |
| :--- | :--- | :--- |
| **Primary State Surface** | In-memory JS component tree & reactive state. | **Direct W3C DOM** (`data-ln-*` attribute surface). |
| **Primary Code Artifact** | JavaScript program (JSX, hooks, signals, state closures). | **Declarative Semantic HTML Contract**. |
| **AI Agent Suitability** | Must generate full program logic, state handlers & reactivity trees. | Resolves intent directly to **declarative markup contracts** (⭐⭐⭐⭐⭐). |
| **Runtime Dependencies** | Framework core + extensive npm package ecosystem. | **Zero runtime npm dependencies** (pure native Web APIs). |
| **Observability & Inspection** | Requires specialized DevTools extensions to inspect hidden memory state. | **100% Inspectable**: DevTools HTML Inspector is the native Control Plane. |
| **Long-Term Longevity** | Managed via framework LTS cycles and automated refactoring (`ng update`). | Built directly on **permanent W3C browser standards** (`<dialog>`, Popover API, CustomEvent). |
| **Server & Client Harmony** | Primarily JSON/SPA focused; SSR requires complex hydration pipelines. | **Dual-Core**: Native SSR progressive enhancement (Laravel, Go, Django) & SPA (`ln-router`). |
| **Optimal Use Cases** | High-frequency continuous client state (collaborative editors, games, canvas). | Enterprise CRUD, Admin Panels, ERPs, long-lived apps with strong backend integration. |

### 🎯 Application Suitability & Workload Breakdown

| Application Workload | **Ashlar Suitability** | Why Ashlar Wins |
| :--- | :---: | :--- |
| **AI-Generated Applications & Workflows** | ⭐⭐⭐⭐⭐ | Machine-readable HTML contracts (`docs-mcp/`), zero build requirements. |
| **Admin Panels, CRUD & Form Systems** | ⭐⭐⭐⭐⭐ | DOM-first state, native browser validation, instant IndexedDB caching. |
| **Classic Web & Landing Pages** | ⭐⭐⭐⭐⭐ | Instant FCP, native SEO, zero bundle bloat. |
| **Documentation & Content Systems** | ⭐⭐⭐⭐⭐ | HTML-centric structure, clean semantic mixins, zero JS overhead. |
| **Enterprise Portals & Internal Tools** | ⭐⭐⭐⭐⭐ | 15+ year browser stability, zero supply-chain security liability. |
| **Real-Time Dashboards & High-Freq Canvas** | ⭐⭐⭐ | Optimal with `ln-data-store` local caches; VDOM better for Figma-like canvas apps. |

*For the complete 17-category breakdown and CTO decision matrix, see our [Architecture Philosophy](docs/architecture/philosophy.md#4-comprehensive-architectural-comparison-matrix-ashlar-vs-mainstream).*

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
> - `<use href="#ln-*">` fetches SVG icons on-demand from CDN and caches them in `localStorage` (`ln-icon`).
> - `data-ln-validate` intercepts the form submit gate, validates native browser `ValidityState`, and toggles `.hidden` on corresponding error messages without external validation libraries (`ln-validate`).
> - `data-ln-modal-close` safely dismisses the modal and restores focus (`ln-modal`).

---

## 🛡️ The Three Core Pillars

### 1. 🏛️ Dual-Core Architecture (SSR + Client-Side SPA)
- **Backend-First Progressive HTML Enhancement (SSR):** Your backend (Laravel, Go, Django, Rails) delivers indexable, semantic HTML. Elements auto-activate via attributes (`data-ln-modal`, `data-ln-filter`, `data-ln-table`).
- **Client-Side Single-Page Applications (SPA / JSON Mode):** Built-in client router (`ln-router`), compound hash-state codec (`hash.js`), 3-tier local storage (`ln-data-store`), and microtask-batched Proxy reactivity (`deepReactive`, `renderList`) when client JSON APIs are required.

### 2. 🤖 AI-Native & MCP Surface
- **Machine-Readable Component Corpus (`docs-mcp/`):** Schema-validated documentation served directly to AI agent workflows via Model Context Protocol (MCP).
- **MCP Component Router:** Decision matrix resolving user intent into declarative components before generating markup.
- **In-Repo Agent Protocols (`.agents/`, `CLAUDE.md`, `DOCTRINE.md`):** Strict architectural rules, component templates, and lifecycle constraints loaded automatically into AI coding sessions.

### 3. 🔒 Longevity & Zero Supply-Chain Risk
- **Zero Runtime npm Dependencies:** Eliminates supply-chain vulnerabilities, breaking transitive updates, and framework EOL cycles.
- **W3C Web Standards First:** Relies on native browser primitives (`<dialog>`, Popover API, `:has()`, `@container`, `CustomEvent`, Web Crypto API).

---

## ⚡ Quick Start

`ln-ashlar` is a source-only package. Import SCSS and JS directly into your project bundler.

### 1. Install via npm
```bash
npm install @livenetworks/ashlar
```

Import source files into your main entries:
```js
// main.scss - Import SCSS tokens, mixins, and defaults
@use '@livenetworks/ashlar/theme/ln-ashlar.scss';

// main.js - Import and auto-initialize JS components
import '@livenetworks/ashlar/components/index.js';
```

### 2. Install as a Git Submodule (Alternative)
```bash
git submodule add .../ln-ashlar.git resources/ln-ashlar
```

Then reference the submodule paths:
```scss
@use 'resources/ln-ashlar/theme/ln-ashlar.scss';
```
```js
import 'resources/ln-ashlar/components/index.js';
```

### 3. Build & Watch (For Library Demos Only)
If you are developing inside this repository, compile the static demo assets:
```bash
npm run build   # Produces demo/dist/ln-ashlar.{css,js,iife.js} + compiles HTML demo pages
npm run dev     # Watch mode (automatic compilation on SCSS or JS changes)
```
*Note: The `demo/dist/` artifact exists solely for the demo pages. Product consumers should always bundle from source.*

---

## 🌐 Browser Support

`ln-ashlar` targets evergreen browsers with native support for the **Popover API**, since `ln-modal`, `ln-dropdown`, `ln-tooltip`, `ln-toast`, `ln-popover`, and `ln-router` rely on it (via `dialog.showModal()` and `popover`) for top-layer rendering.

| Browser | Minimum Version |
|---|---|
| Chrome / Edge | 114+ |
| Safari | 17.4+ |
| Firefox | 125+ |

---

## 📐 Core Architecture Specifications

Deep architectural blueprints detailing the engine driving `ln-ashlar`.

| Specification | Contents |
|:---|:---|
| 📜 **[Ashlar Engineering Doctrines](DOCTRINE.md)** | Mandatory 3-Layer architecture, component authoring doctrines, CQS event conventions, and state observability rules. |
| 📖 **[Architecture Philosophy](docs/architecture/philosophy.md)** | The DOM-First engineering manifesto detailing computing cycles, framework EOL risks, performance, security, **and full 17-category comparison tables**. |
| 🔄 **[Data Flow Architecture](docs/architecture/data-flow.md)** | Rules governing how data moves. Splits responsibilities into **four isolated concerns**: Data (`ln-data-store` + `ln-data-coordinator`), Render (`ln-table`), Submit (`ln-form`), and Validate (`ln-validate`). Details the **parallel fan-out write pipeline** with Mermaid sequence diagrams. |
| 🧭 **[3-Tier Local-First Storage Specs](docs/architecture/data-store-architecture.md)** | Technical reference for decoupling storage caches (`ln-data-store`), network gateways (`ln-*-connector`), and data transformations (`ln-mapper`). |
| ⚡ **[Reactive Architecture Reference](docs/reactive.md)** | Blueprint on how components manage internal state using Proxy traps (`reactiveState` and `deepReactive`), batched microtask rendering, DOM bindings (`fill`, `renderList`), and attribute-to-state bridges. |
| 📐 **[Design System Specifications](docs/architecture/reference.md)** | Complete styling specs covering CSS Custom Properties, layout grids, buttons, responsive breakpoints, typography hierarchies, dark mode theming, and icons. |
| 🛡️ **[Security & Threat Mitigation](docs/architecture/security.md)** | Deep architectural security analysis covering Web Crypto API encryption-at-rest, strict CSP compliance (no dynamic eval), sensitive DOM attribute protections, and the same-origin AJAX fragment trust boundary. |
| 🧠 **[Architect Overview Guide](docs/architecture/overview.md)** | Master developer guide introducing the DOM-First doctrine, component inventories, override architectures, and new project integration pipelines. |

---

## 📚 General Documentation Index

For detailed manual instructions, properties, attributes, and events of individual components:

* 📚 **[Complete Documentation Index](docs/README.md)** — Master roadmap containing direct links to each module's usage guide and architecture reference.

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
| **Core Utilities** | — | 🛠️ **[Core helpers reference](components/ln-core/README.md)** |
| **Component Pattern** | — | 🧠 **[JS Component Design Guide](docs/architecture/component-guide.md)** |
| **SVG Icons** | 🏷️ **[Icon SVG Sprite Reference](components/ln-icon/README.md)** | 🌐 **[On-Demand CDN routing & injection](components/ln-icon/README.md)** |
| **Toggle** | 🎚️ **[ln-toggle docs](components/ln-toggle/README.md)** | 📄 **[toggle architecture](components/ln-toggle/README.md)** |
| **Accordion** | 📂 **[ln-accordion docs](components/ln-accordion/README.md)** | 📄 **[accordion architecture](components/ln-accordion/README.md)** |
| **Modal** | 🪟 **[ln-modal docs](components/ln-modal/README.md)** | 📄 **[modal architecture](components/ln-modal/README.md)** |
| **UI Coordinator** | 🎛️ **[ln-ui-coordinator docs](components/ln-ui-coordinator/README.md)** | 📄 **[ui-coordinator architecture](components/ln-ui-coordinator/README.md)** |
| **Tabs** | 🔖 **[ln-tabs docs](components/ln-tabs/README.md)** | 📄 **[tabs architecture](components/ln-tabs/README.md)** |
| **Toast** | 🔔 **[ln-toast docs](components/ln-toast/README.md)** | 📄 **[toast architecture](components/ln-toast/README.md)** |
| **Dropdown** | 🔽 **[ln-dropdown docs](components/ln-dropdown/README.md)** | 📄 **[dropdown architecture](components/ln-dropdown/README.md)** |
| **Popover** | 💬 **[ln-popover docs](components/ln-popover/README.md)** | 📄 **[popover architecture](components/ln-popover/README.md)** |
| **Tooltip (JS)** | 💬 **[ln-tooltip docs](components/ln-tooltip/README.md)** | 📄 **[tooltip architecture](components/ln-tooltip/README.md)** |
| **Navigation** | 🗺️ **[ln-nav docs](components/ln-nav/README.md)** | 📄 **[nav architecture](components/ln-nav/README.md)** |
| **Router** | 🧭 **[ln-router docs](components/ln-router/README.md)** | 📄 **[router architecture](components/ln-router/README.md)** |
| **Filter** | 🔍 **[ln-filter docs](components/ln-filter/README.md)** | 📄 **[filter architecture](components/ln-filter/README.md)** |
| **Search** | 🔎 **[ln-search docs](components/ln-search/README.md)** | 📄 **[search architecture](components/ln-search/README.md)** |
| **Table** | 📊 **[ln-table docs](components/ln-table/README.md)** | 📄 **[table architecture](components/ln-table/README.md)** |
| **Table Coordinator** | 🎛️ **[ln-table-coordinator docs](components/ln-table-coordinator/README.md)** | 📄 **[table-coordinator architecture](components/ln-table-coordinator/README.md)** |
| **Sort** | ⇅ **[ln-sort docs](components/ln-sort/README.md)** | 📄 **[sort architecture](components/ln-sort/README.md)** |
| **Sortable** | 🔃 **[ln-sortable docs](components/ln-sortable/README.md)** | 📄 **[sortable architecture](components/ln-sortable/README.md)** |
| **List** | 📋 **[ln-list docs](components/ln-list/README.md)** | 📄 **[list architecture](components/ln-list/README.md)** |
| **Progress** | 📈 **[ln-progress docs](components/ln-progress/README.md)** | 📄 **[progress architecture](components/ln-progress/README.md)** |
| **Circular Progress** | 📈 **[ln-circular-progress docs](components/ln-circular-progress/README.md)** | 📄 **[circular-progress architecture](components/ln-circular-progress/README.md)** |
| **Stat** | 📈 **[ln-stat docs](components/ln-stat/README.md)** | 📄 **[stat architecture](components/ln-stat/README.md)** |
| **Chart** | 📊 **[ln-chart docs](components/ln-chart/README.md)** | 📄 **[chart architecture](components/ln-chart/README.md)** |
| **Link** | 🔗 **[ln-link docs](components/ln-link/README.md)** | 📄 **[link architecture](components/ln-link/README.md)** |
| **Confirm** | ⚠️ **[ln-confirm docs](components/ln-confirm/README.md)** | 📄 **[confirm architecture](components/ln-confirm/README.md)** |
| **Upload** | 📤 **[ln-upload docs](components/ln-upload/README.md)** | 📄 **[upload architecture](components/ln-upload/README.md)** |
| **AJAX** | 🔄 **[ln-ajax docs](components/ln-ajax/README.md)** | 📄 **[ajax architecture](components/ln-ajax/README.md)** |
| **Include** | 📥 **[ln-include docs](components/ln-include/README.md)** | 📄 **[include architecture](components/ln-include/README.md)** |
| **HTTP** | — | 📄 **[http service architecture](components/ln-http/README.md)** |
| **API Queue** | 🚦 **[ln-api-queue docs](components/ln-api-queue/README.md)** | 📄 **[api-queue architecture](components/ln-api-queue/README.md)** |
| **Store** | 🗄️ **[ln-data-store docs](components/ln-data-store/README.md)** | 📄 **[store cache architecture](components/ln-data-store/README.md)** |
| **Data Coordinator** | 🎛️ **[ln-data-coordinator docs](components/ln-data-coordinator/README.md)** | 📄 **[data-coordinator architecture](components/ln-data-coordinator/README.md)** |
| **API Connector** | 🔌 **[ln-api-connector docs](components/ln-api-connector/README.md)** | — |
| **CouchDB Connector** | 🔌 **[ln-couchdb-connector docs](components/ln-couchdb-connector/README.md)** | 📄 **[couchdb-connector architecture](components/ln-couchdb-connector/README.md)** |
| **Form** | 📝 **[ln-form docs](components/ln-form/README.md)** | 📄 **[form lifecycle architecture](components/ln-form/README.md)** |
| **Validate** | ⚠️ **[ln-validate docs](components/ln-validate/README.md)** | 📄 **[validate architecture](components/ln-validate/README.md)** |
| **Fill** | 🧩 **[ln-fill docs](components/ln-fill/README.md)** | 📄 **[fill architecture](components/ln-fill/README.md)** |
| **Options** | ⚙️ **[ln-options docs](components/ln-options/README.md)** | 📄 **[options architecture](components/ln-options/README.md)** |
| **Slug** | 🏷️ **[ln-slug docs](components/ln-slug/README.md)** | 📄 **[slug architecture](components/ln-slug/README.md)** |
| **Date** | 📅 **[ln-date docs](components/ln-date/README.md)** | 📄 **[date architecture](components/ln-date/README.md)** |
| **Time** | 🕒 **[ln-time docs](components/ln-time/README.md)** | 📄 **[time architecture](components/ln-time/README.md)** |
| **Number** | 🔢 **[ln-number docs](components/ln-number/README.md)** | 📄 **[number architecture](components/ln-number/README.md)** |
| **Editor** | ✍️ **[ln-editor docs](components/ln-editor/README.md)** | 📄 **[editor architecture](components/ln-editor/README.md)** |
| **Autosave** | 💾 **[ln-autosave docs](components/ln-autosave/README.md)** | 📄 **[autosave architecture](components/ln-autosave/README.md)** |
| **Autoresize** | ↕️ **[ln-autoresize docs](components/ln-autoresize/README.md)** | 📄 **[autoresize architecture](components/ln-autoresize/README.md)** |
| **Translations** | 🗣️ **[ln-translations docs](components/ln-translations/README.md)** | 📄 **[translations architecture](components/ln-translations/README.md)** |
| **External Links** | 🌐 **[ln-external-links docs](components/ln-external-links/README.md)** | 📄 **[external-links architecture](components/ln-external-links/README.md)** |
| **Debug** | 🐞 **[ln-debug docs](components/ln-debug/README.md)** | 📄 **[debug architecture](components/ln-debug/README.md)** |

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
