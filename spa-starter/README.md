# ln-ashlar SPA starter

A module-per-folder authoring scaffold for building complex SPAs on
`ln-ashlar` + `ln-router`. You write small, co-located modules; the build
concatenates them back into a single deployable `index.html`, `app.js`, and
`app.css`. No framework, no per-file bundling, no central `app.js` to edit by
hand when you add a feature.

> **Why this exists.** The reference SPA at `demo/spa/` is one ~700-line
> `index.html` and one ~430-line `app.js`. That is fine to ship but hard to
> split across a team. This scaffold keeps the *exact same runtime* and only
> changes the *authoring unit*: **one folder = one module = one developer.**

---

## 1. Layout

```
spa-starter/
  build.mjs                 ← concat JS · assemble HTML · compile SCSS
  package.json              ← `npm run build` / `npm run dev`
  src/
    index.template.html     ← the shell skeleton with @inject markers
    app.scss                ← framework + generated module styles
    _core/
      runtime.js            ← window.App (defineModule / defineView) — loaded first
    shell/
      shell.html            ← header, sidebar, outlet (+ persistent toast host)
      shell.js              ← persistent chrome behaviour
      shell.scss
    home/                   ← a view module (template + coordinator + styles)
      home.html  home.js  home.scss
    greet/                  ← a parameterised view ( /hello/:name )
      greet.html  greet.js
    about/                  ← a static view — no .js needed
      about.html
    not-found/              ← catch-all route
      not-found.html
  index.html  dist/app.js  dist/app.css   ← GENERATED (git-ignored)
```

A module folder holds **up to three files that share the folder name**: a
`.html` snippet, a `.js` coordinator, and an optional `.scss` partial. Any of
them can be omitted (see `about/`).

---

## 2. Build

```bash
# 1) Build the library once from the repo root (produces demo/dist/ln-ashlar.iife.js)
npm run build

# 2) Build the starter
cd spa-starter
npm run build        # one-off
npm run dev          # rebuild on change (watches src/)
```

What `build.mjs` does:

| Output | How |
|---|---|
| `dist/app.js` | Concatenates every `src/<module>/*.js`, `_core` first. Files are plain scripts — no import resolution needed. |
| `index.html` | Buckets each HTML snippet by its `<!-- @zone -->` markers and injects them into `index.template.html`. |
| `dist/app.css` | Generates a `@use` list of all module `.scss`, then compiles `app.scss` (framework + modules) with Dart Sass. |

Serve the repo over a server with an SPA fallback (an `.htaccess` is included
for Apache) and open `/spa-starter`.

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

## 4. The JS module API (`window.App`)

`_core/runtime.js` exposes two registrars. They are built only on the public
globals the ln-ashlar bundle exposes (`window.lnRouter` and the
`ln-router:navigated` event), so every module file stays a plain,
concatenation-friendly script.

### Persistent module

```js
App.defineModule(function () {
  // runs once when the DOM is ready — wire session-long behaviour here
});
```

### View module

```js
App.defineView('/spa-starter/hello/:name', {
  mount: function (ctx) {
    // ctx = { target, params, query, path }
    // `target` is the freshly-mounted view root inside the outlet
  },
  unmount: function () {
    // tear down timers / global listeners you added in mount
  }
});
```

> **Teardown is not optional.** Listeners you attach to `ctx.target` die with
> the view (the router discards it on navigation). But anything global —
> `setInterval`, `document`/`window` listeners, store subscriptions — leaks
> across navigations unless you remove it in `unmount`. The monolithic
> `app.js` hides this because it is always alive; split modules must be tidy.
> See `home/home.js` for the canonical example.

### Persistent vs. view — pick by lifetime, not by file

Feedback that reacts to **store events** (success/error toasts, an offline
banner, rollback notices) must live in a **persistent module**, because those
events often arrive *after* you have navigated away from the view that
triggered them. Put them in `shell/` (or a dedicated persistent module), never
in a view's `mount`.

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

> Note: `ln-core`'s `registerComponent` (true DOM-mount lifecycle via a
> MutationObserver) is an **ESM export, not a window global**. This starter
> deliberately avoids it so files can be plainly concatenated. If you later
> want that lifecycle, switch the build to an ESM bundle (Vite/esbuild) and
> `import` from `ln-core` instead of relying on `window.App`.

---

## 6. Add a module

1. `mkdir src/reports`
2. `src/reports/reports.html`

   ```html
   <!-- @zone routes -->
   <template data-ln-route="/spa-starter/reports" data-ln-route-title="Reports">
     <section id="reports"><h1>Reports</h1><ul data-list></ul></section>
   </template>
   ```
3. `src/reports/reports.js`

   ```js
   (function () {
     'use strict';
     App.defineView('/spa-starter/reports', {
       mount: function (ctx) { /* fetch + lnCore.renderList(...) */ }
     });
   })();
   ```
4. (optional) `src/reports/reports.scss`
5. Add a sidebar link in `shell/shell.html`, rebuild. Nothing else is touched —
   no central registry, no `app.js` switch statement.
