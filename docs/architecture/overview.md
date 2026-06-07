# Architect Overview Guide

Welcome to the `ln-ashlar` Architect Overview Guide. This is the master "read-this-first" document designed to introduce developers and system architects to the technical core of the framework. It explains our DOM-First doctrine, provides inventories of our mixins and components, outlines the override architecture, and walks through integrating the library into a new project.

---

## 🏛️ The DOM-First Doctrine

`ln-ashlar` is built on a simple technical reality: **the browser works natively with the DOM, not a Virtual DOM.** 

Modern frameworks often force developers to download megabytes of client-side JavaScript, compile it in runtime, and display blank skeleton loaders while waiting for cascading API request waterfalls. `ln-ashlar` takes the opposite approach:

1. **Server-Rendered structure, client-rendered behavior:** The server (Laravel, Go, Rails, etc.) generates the complete, semantic HTML. The browser paints it immediately. A lightweight, native `MutationObserver` registers and binds vanilla JS components dynamically.
2. **HTML describes WHAT, not HOW:** HTML markup should only consist of semantic tags and structural elements. Visual details belong exclusively in SCSS.
3. **Pure SCSS Styling via `@include`:** We strictly forbid Tailwind-style utility classes in markup (avoid classes like `flex`, `grid-cols-4`, `text-red-500`). Markup is styled by applying SCSS mixins to semantic selectors (e.g., `#user-table { @include table-base; }`).
4. **Zero Dependencies:** To ensure decades of stability and complete immunity to npm supply chain attacks, `ln-ashlar` contains zero transitive dependencies at runtime.

---

## 🎨 Design Decisions & Rationale

### 1. The Ban on Utility Classes
Utility classes couple your HTML structure directly to a specific visual layout. If you want to change a grid from 3 columns to 4, or alter a card's padding, you have to rewrite your HTML templates. 

In `ln-ashlar`, the visual styling contract is fully decoupled from your markup:
* **HTML** describes the **concept** (e.g., `<article id="news-item">`).
* **SCSS** describes the **presentation** (e.g., `#news-item { @include card; }`).
This keeps your templates clean, readable, and highly maintainable.

### 2. The Two-Layer SCSS Design
Every visual style in `ln-ashlar` is split into two layers:
* **Mixins (Recipes):** Located in `scss/config/mixins/`. These contain raw visual declarations (padding, borders, layouts) but generate no CSS output on their own.
* **Components (Applications):** Located in `scss/components/`. These apply the mixin recipes to default selectors (like `table`, `input`, or `.btn` class) for easy prototyping.

In production, you should rely on mixins applied to your project's semantic selectors, bypassing generic component classes.

---

## 📐 Spacing & Token Architecture

We enforce a strict separation of concerns in our styling values. Spacing is governed by three distinct layers:

```
1. Spacing Scale (Back-end Plumbing)
   --size-xs, --size-sm, --size-md, --size-lg
         │
         ▼
2. Vocabulary Choice (Contextual Tokens)
   --bg-base, --border-subtle, --shadow-resting
         │
         ▼
3. Primitive Layer (What Mixin Bodies Read)
   --color-bg, --color-border, --padding-x, --radius
```

### The Rules of the Token Cascade
* **Mixins read primitives, never scale tokens:** Mixin bodies only use primitives (like `var(--padding-x)`, `var(--color-bg)`). This keeps the mixin generic and reactive.
* **Components rebind primitives:** Components map primitives to specific vocabulary choices locally (e.g., `@mixin chip { --color-bg: var(--bg-recessed); }`).
* **Themes rebind vocabulary at `:root`:** Themes (like Dark or Glass mode) override vocabulary tokens at the `:root` level. Primitives are wired to vocabulary, so all components adapt instantly without specificity hacks.

---

## 🎛️ CSS Mixin Inventory

Here are the core SCSS mixins available in `ln-ashlar` and guidance on when to use them:

| Mixin | Location | When to Use |
| :--- | :--- | :--- |
| `btn` | `_btn.scss` | Apply to buttons or anchor links that act as primary call-to-actions. |
| `btn-group` | `_btn.scss` | Wrap lists of related actions (like toolbars or table actions) to establish spacing. |
| `pill-group` | `_form.scss` | Use for connected, gapless pill filters (radio/checkbox layouts) where only first/last have radius. |
| `card` | `_card.scss` | Use for content wrappers, dashboard panels, and modular sections. |
| `modal` | `_modal.scss` | Apply to dialog boxes and overlay panels. Includes animation scales. |
| `table-base` | `_table.scss` | Apply to tabular data layouts. Options include striping and density overrides. |
| `breadcrumbs` | `_breadcrumbs.scss` | Apply to path trail indicators to layout page hierarchies. |
| `alert` | `_alert.scss` | Use for status messages (success, warning, error, info banner blocks). |
| `chip` | `_chip.scss` | Apply to inline tags, labels, or active filter tokens. |
| `loader` | `_loader.scss` | Apply to loading indicators, circular spinners, and activity overlays. |
| `nav` | `_nav.scss` | Apply to top navigation bars and sidebar menus. |
| `page-header` | `_page-header.scss` | Establish padding and title-actions layout at the top of a view. |
| `prose` | `_prose.scss` | Apply to rich-text blocks (like blog posts or help articles) to style raw nested HTML. |
| `timeline` | `_timeline.scss` | Apply to lists of historical events or log entries. |
| `density-compact` | `_density.scss` | Apply to tables, forms, or regions to shrink spacing and font sizes globally. |

---

## ⚡ JS Component Inventory

Here is the inventory of our zero-dependency vanilla JS components:

| Component | Selector Attribute | Purpose & When to Use |
| :--- | :--- | :--- |
| **ln-toggle** | `data-ln-toggle` | Simple show/hide toggler for collapsibles, sidebars, or dropdowns. |
| **ln-accordion** | `data-ln-accordion` | Multi-panel accordion. Manages exclusive single-panel opening. |
| **ln-modal** | `data-ln-modal` | Accessible dialog backdrop and panel overlay. Auto-manages ESC keys and focus. |
| **ln-tabs** | `data-ln-tabs` | Swappable tab interfaces. Handles aria attributes and active states. |
| **ln-toast** | `data-ln-toast` | Ephemeral notification banners. Supports timer auto-dismiss. |
| **ln-dropdown** | `data-ln-dropdown` | Context menus and action dropdown lists. Handles click-outside closing. |
| **ln-popover** | `data-ln-popover` | Rich hover/click cards positioned next to an anchor element. |
| **ln-tooltip** | `data-ln-tooltip-enhance` | Lightweight mouse-over context tooltips. |
| **ln-nav** | `data-ln-nav` | Collapsible mobile-navigation menus and drawer systems. |
| **ln-filter** | `data-ln-filter` | Binds UI filters (like checkbox list dropdowns) to data streams. |
| **ln-search** | `data-ln-search` | Captures input keystrokes, debounces them, and dispatches search queries. |
| **ln-table** | `data-ln-table` | Base table features (sticky headers, simple client-side cell sorting). Supports data-driven virtual-scroll mode: clones rows from a template dynamically. |
| **ln-sortable** | `data-ln-sortable` | Drag-and-drop ordering for lists and table rows. |
| **ln-progress** | `data-ln-progress` | Responsive progress bar indicator. |
| **ln-circular-progress**| `data-ln-circular-progress`| SVG circular progress spinner. |
| **ln-link** | `data-ln-link` | Dynamic navigation links that intercept routing for single-page style feel. |
| **ln-confirm** | `data-ln-confirm` | Gated confirmation triggers (two-click arm/execute for dangerous acts). |
| **ln-upload** | `data-ln-upload` | File dropzones and uploader widgets with progress telemetry. |
| **ln-ajax** | `data-ln-ajax` | Fragment injection. Fetches HTML snippets, sanitizes, and renders. |
| **ln-http** | *(Service-style)* | CustomEvent-driven gateway for standard fetch requests. |
| **ln-data-coordinator**| `data-ln-data-coordinator`| Decouples storage (`ln-data-store`) and gateways (`ln-*-connector`). |
| **ln-data-store** | `data-ln-data-store` | IndexedDB database cache. Pure, blind local query and write pipeline. |
| **ln-api-connector** | `data-ln-api-connector` | Decoupled transport gateway for REST APIs. Manages base URLs, paths, credentials, and headers; isolates cache stores from networking. |
| **ln-couchdb-connector**| `data-ln-couchdb-connector`| Decoupled transport gateway for CouchDB / Sync Gateway. Implements delta synchronization protocols over the Changes Feed. |
| **ln-form** | `data-ln-form` | Form life-cycle wrapper. Serializes and blocks submit on invalid inputs. |
| **ln-validate** | `data-ln-validate` | Standard field validation. Interfaces with the browser Validation API. |
| **ln-time** | `data-ln-time` | Dynamic relative time text elements (e.g. "3 minutes ago"). |
| **ln-autosave** | `data-ln-autosave` | Auto-posts form inputs on change, caching drafts locally. |
| **ln-autoresize** | `data-ln-autoresize` | Dynamically resizes textareas to fit user content typing. |
| **ln-translations** | `data-ln-translations` | Front-end locale switching and reactive key translations. |
| **ln-external-links** | *(Automatic)* | Automatically flags non-project links with `target="_blank"` and safety headers. |

---

## 🛠️ Override Architecture Guide

When you need to adjust styles, you should operate through the **Override Architecture**. This ensures you do not break standard cascades:

### 1. The Color Palette Change (The Token Level)
Never rewrite component files for simple color modifications. Rebind vocabulary tokens locally:
```scss
// Change a specific panel's primary focus to warning yellow
#billing-card {
  --color-primary: var(--color-warning);
}
```

### 2. The Structure Customization (The Mixin Level)
Re-apply base mixins and extend them inside your project selectors:
```scss
// Re-apply and strip borders on a specific card
#clean-panel {
  @include card;
  --color-border: transparent;
  --shadow: none;
}
```

### 3. The Full Component Bypass
If a component's default style doesn't fit your layout, exclude it from your bundle and apply only the mixin to a customized, unique class:
```scss
// Apply the breadcrumb spacing, but write custom inline bullets
#custom-crumbs {
  @include breadcrumbs;
  li + li::before {
    content: "→";
  }
}
```

---

## 🚀 New Project Integration Guide

Setting up a new project with `ln-ashlar` is simple. Follow this folder structure to maintain the two-layer cascade:

### 1. Folder Layout
```
resources/
├── scss/
│   ├── config/
│   │   ├── _tokens.scss     <-- Your brand color & spacing overrides
│   │   └── _mixins.scss     <-- Your project's custom utility recipes
│   └── main.scss            <-- Your application compiler entry-point
└── js/
    ├── domain/
    │   └── mappers/         <-- Data schema ingress/egress mapper registries
    └── app.js               <-- Your script compiler entry-point
```

### 2. Structuring `main.scss`
Import `ln-ashlar` configuration first, apply overrides, and import components:
```scss
// 1. Import ln-ashlar SCSS tokens, mixins, and defaults
@use 'ln-ashlar/scss/config/tokens' as *;
@use 'ln-ashlar/scss/config/mixins' as *;

// 2. Load your brand-specific variables (rebind vocabulary tokens)
@use 'config/tokens';

// 3. Load core components
@use 'ln-ashlar/scss/ln-ashlar';

// 4. Style your application views using semantic selectors
@use 'config/mixins';

#app-sidebar {
  @include nav;
  --color-bg: var(--bg-sunken);
}

.dashboard-card {
  @include card;
}
```

### 3. Structuring `app.js`
Import the library bundle and configure your data layer:
```javascript
// 1. Import and auto-initialize JS components
import 'ln-ashlar/js/index.js';

// 2. Register a Domain Data Mapper
import { registerDataMapper, setStorageKey } from 'ln-ashlar/js/ln-core';

registerDataMapper('tasks', {
  ingress(serverRaw) {
    return {
      id: serverRaw.id,
      title: serverRaw.name,
      due_at: Date.parse(serverRaw.due_date) / 1000,
      priority: serverRaw.priority_level
    };
  },
  egress(localDb) {
    return {
      name: localDb.title,
      due_date: new Date(localDb.due_at * 1000).toISOString(),
      priority_level: localDb.priority
    };
  }
});

// 3. Initialize secure storage session
setStorageKey("secure-user-session-token");
```
