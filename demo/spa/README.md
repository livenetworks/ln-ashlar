# DocuFlow SPA Demo

A module-per-folder refactored implementation of the DocuFlow SPA Demo on `ln-ashlar` + `ln-router`. You write small, co-located modules; the build concatenates them back into a single deployable `index.html`, `dist/app.js`, and `dist/app.css`. No framework, no per-file bundling, no central `app.js` to edit by hand when you add a feature.

> **Architecture:** This demo uses the modular design where **one folder = one module = one developer.**

---

## 1. Layout

```
demo/spa/
  build.mjs                 ← concat JS · assemble HTML · compile SCSS
  package.json              ← `npm run build` / `npm run dev`
  src/
    index.template.html     ← the shell skeleton with @inject markers
    app.scss                ← framework + generated module styles
    shell/
      shell.html            ← layout frame, header, sidebar (+ toast host, offline banner)
      shell.js              ← persistent chrome behavior, reset triggers, banners
      shell.scss            ← layout framework overrides
    data/
      data.html             ← persistent packages & tenants stores + api connectors
      data.js               ← computed presenters & store listeners
    dashboard/
      dashboard.html        ← dashboard route template, widgets
      dashboard.js          ← dashboard statistics loader & live triggers
      dashboard.scss        ← stat cards & layout styles
    packages/
      packages.html         ← packages list & edit modal template
      packages.js           ← packages form submits, confirms/reverted toasts
      packages.scss         ← packages table/modal styles
    tenants/
      tenants.html          ← tenants list & create modal template
      tenants.js            ← tenants create submissions, bulk actions, edit transitions
      tenants.scss          ← tenants table styles
    tenant-editor/
      tenant-editor.html    ← edit tenant route template
      tenant-editor.js      ← edit tenant fill logic, repair listeners
      tenant-editor.scss    ← custom color picker & form layout styles
    not-found/
      not-found.html        ← 404 route template
      not-found.scss        ← 404 empty state styles
  index.html  dist/app.js  dist/app.css   ← GENERATED (git-ignored)
```

A module folder holds **up to three files that share the folder name**: a
`.html` snippet, a `.js` coordinator, and an optional `.scss` partial. Any of
them can be omitted (see `not-found/`).

---

## 2. Build

```bash
# 1) Build the library once from the repo root (produces demo/dist/ln-ashlar.iife.js)
npm run build

# 2) Build the SPA demo
npm run build:demo-spa
```

What `build.mjs` does:

| Output | How |
|---|---|
| `dist/app.js` | Concatenates every `src/<module>/*.js` in alphabetical order. Files are plain, self-contained scripts — no import resolution needed. |
| `index.html` | Buckets each HTML snippet by its `<!-- @zone -->` markers and injects them into `index.template.html`. |
| `dist/app.css` | Generates a `@use` list of all module `.scss`, then compiles `app.scss` (framework + modules) with Dart Sass. |

Serve the repo over a server with an SPA fallback (an `.htaccess` is included
for Apache) and open `/demo/spa`.

---

## 3. The three HTML zones

A snippet declares where its markup belongs using `<!-- @zone X -->` comments.
Everything before the first marker defaults to `routes`.

| Zone | Lands in `<body>` as | Use for |
|---|---|---|
| `shell` | persistent chrome | header, sidebar, the `data-ln-outlet` |
| `persistent` | persistent, outside the outlet | modals, data stores, toast host, banners |
| `routes` | the `<template data-ln-route>` list | views swapped into the outlet |

This is the key correction over a naïve "route / modal / partial" taxonomy:
**a modal or a data store is not a route.** It must exist in the DOM for the
whole session (e.g. `data-ln-modal-for` triggers and focus-restore need the
modal present *before* the click). So a feature folder may contribute markup
to *two* zones — its route to `routes`, its modal/store to `persistent`.

---

## 4. Layer 2 Coordinators (Event-Driven JS)

Every JS module file is a standard **Layer 2 Coordinator** (an IIFE) that interacts strictly through public DOM and Ashlar events (`ln-router:navigated`, `ln-data-store:*`, etc.). There is no custom runtime registry or `window.App`.

### Persistent chrome & session-long behaviour

For behaviour that lives the whole session (e.g. closing mobile sidebar drawers, offline banners, store reactions), wire event listeners on `DOMContentLoaded`:

```js
(function () {
  'use strict';

  function init() {
    // runs once when the DOM is ready — wire session-long behaviour here
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

### Route-specific view behaviour

When `ln-router` navigates to a new route, it clones the `<template data-ln-route>` into the outlet and emits `ln-router:navigated` on the document with details: `{ target, params, query, route, path }`.

A route coordinator listens to `ln-router:navigated`, checks the matched pattern, and activates its logic:

```js
(function () {
  'use strict';

  document.addEventListener('ln-router:navigated', function (e) {
    var pattern = e.detail && e.detail.route && e.detail.route.pattern;
    if (pattern !== '/spa/hello/:name') return;

    // View logic: populate data, bind controls
    window.lnCore.fillTemplate(e.detail.target, { name: e.detail.params.name });
  });
})();
```

> **Lifecycle & Teardown:**
> DOM event listeners attached to elements inside `e.detail.target` are discarded automatically when `ln-router` clears the outlet.
> For global intervals or timers (e.g. `setInterval`), stop the timer on every `ln-router:navigated` before conditionally re-starting it for the active route.

### Persistent vs. view — pick by lifetime, not by file

Feedback that reacts to **store events** (success/error toasts, an offline
banner, rollback notices) must live in a **persistent coordinator**, because those
events often arrive *after* you have navigated away from the view that
triggered them. Put them in `shell/` (or a dedicated persistent module), never
in a view route listener.

---

## 5. Data binding helpers (public globals)

`window.lnCore` exposes the safe binders — never use `innerHTML` for
URL/user data:

| Helper | Purpose |
|---|---|
| `lnCore.fill(root, data)` | Bind onto existing nodes via `data-ln-field` / `data-ln-attr` / `data-ln-show` / `data-ln-class`. |
| `lnCore.fillTemplate(clone, data)` | Replace `{{ key }}` text placeholders (XSS-safe). |
| `lnCore.renderList(container, items, tmplName, keyFn, fillFn, tag)` | Keyed list reconciliation from a `<template data-ln-template>`. |

`window.lnRouter` exposes `navigate(path)`, `replace(path)`, `current()`.

---

## 6. Add a module

1. `mkdir src/reports`
2. `src/reports/reports.html`

   ```html
   <!-- @zone routes -->
   <template data-ln-route="/spa/reports" data-ln-route-title="Reports">
     <section id="reports"><h1>Reports</h1><ul data-list></ul></section>
   </template>
   ```
3. `src/reports/reports.js`

   ```js
   (function () {
     'use strict';

     document.addEventListener('ln-router:navigated', function (e) {
       var pattern = e.detail && e.detail.route && e.detail.route.pattern;
       if (pattern !== '/spa/reports') return;

       // fetch data + lnCore.renderList(...)
     });
   })();
   ```
4. (optional) `src/reports/reports.scss`
5. Add a sidebar link in `shell/shell.html`, rebuild. Nothing else is touched —
   no central registry, no `app.js` switch statement.
