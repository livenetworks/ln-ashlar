---
name: getting-started
classification: guide
status: draft
domain: frontend
summary: Quickstart guide covering every way to install ln-ashlar — CDN, npm, self-hosted build, and git submodule — then building your first progressive DOM-First interface.
source:
tags: [installation, setup, quickstart, cdn, npm, submodule, html]
---

# 🚀 Getting Started

## Summary

This guide walks you through the four supported ways to bring `ln-ashlar` into any project — from a zero-build static HTML page to a bundler-driven application — then building your first fully-functional, progressive DOM-First interface with zero application JavaScript. Pick the installation path that matches your project's needs; they all end at the same two assets referenced from your HTML shell.

---

## 1. Installation

`ln-ashlar` distributes two forms of the library:

- **Compiled drop-in assets** — `ln-ashlar.css` and `ln-ashlar.iife.js` (zero-dependency, self-initializing). Just link them; no build needed.
- **SCSS / JS source** — `scss/` partials and `js/` ES modules, for projects that compile ashlar inside their own build pipeline.

Choose the path that fits your project. Every path finishes at the same two references in your HTML shell (§2).

| Your project | Use path |
|---|---|
| Static HTML, prototype, no build step | **A — CDN** |
| App with a bundler (Vite, webpack, Laravel Mix, …) | **B — npm + your build** |
| Self-hosted compiled assets, no runtime build | **C — Precompiled, self-hosted** |
| Monorepo / vendored dependency pinned to a commit | **D — Git submodule** |

### Path A: CDN (no build, fastest)

Reference the precompiled bundle straight from jsDelivr, pinned to a published release tag. Nothing to install:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/livenetworks/ln-ashlar@1.5.3/demo/dist/ln-ashlar.css">
<script src="https://cdn.jsdelivr.net/gh/livenetworks/ln-ashlar@1.5.3/demo/dist/ln-ashlar.iife.js" defer></script>
```

Always pin to a released tag (e.g. `@1.5.3`) — never a moving branch — so production builds stay reproducible.

### Path B: npm (you have a build pipeline)

Add the package as a runtime dependency:

```bash
npm install @livenetworks/ashlar
```

The npm package ships **source, not a prebuilt bundle** — `scss/` partials and `js/` ES modules. Import them into your own build so your bundler compiles ashlar alongside your application code:

```scss
// your app's main stylesheet
@use "@livenetworks/ashlar/scss/ln-ashlar";
```

```js
// your app's main script — the library self-initializes on import
import "@livenetworks/ashlar/js/index.js";
```

There is no `dist/` folder inside `node_modules`. If you want ready-made compiled files instead of building them yourself, use Path A, C, or D.

### Path C: Precompiled, self-hosted

For consumers who want the compiled files on their own server with no runtime build step. The compiled bundle is committed in the repository under `demo/dist/`, so a clone gives you working assets immediately:

```bash
git clone https://github.com/livenetworks/ln-ashlar.git
cd ln-ashlar
npm install && npm run build   # optional — demo/dist/ is already committed; rebuild only to pick up latest source
```

Copy these two files into your project's public assets folder and reference them with local paths in §2:

- `demo/dist/ln-ashlar.css` — all layout grid, typography, tokens, variables, and component styles.
- `demo/dist/ln-ashlar.iife.js` — the compiled, zero-dependency, self-initializing component library.

### Path D: Git submodule

For monorepos or projects that vendor dependencies pinned to an exact commit:

```bash
git submodule add https://github.com/livenetworks/ln-ashlar.git vendor/ln-ashlar
```

Because the compiled bundle is committed, reference `vendor/ln-ashlar/demo/dist/ln-ashlar.css` and `vendor/ln-ashlar/demo/dist/ln-ashlar.iife.js` directly — no build required. Run `npm install && npm run build` inside `vendor/ln-ashlar/` only if you modify the source and need to recompile.

---

## 2. Setting Up the HTML Shell

Reference the stylesheet in the `<head>` and load the JavaScript bundle at the bottom of your HTML document. Point both at wherever your chosen Path (§1) placed the assets — the example below uses a self-hosted `/dist/` location; for **Path A** paste the jsDelivr URLs directly.

Make sure to set the `lang` attribute on the `<html>` element so that number, date, and time components auto-localize to the correct language using browser `Intl` APIs.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Ashlar App</title>

    <!-- Link the base design system & components style -->
    <link rel="stylesheet" href="/dist/ln-ashlar.css">
</head>
<body>

    <!-- Main Content Area -->
    <main>
        <h1>Hello World</h1>
    </main>

    <!-- Load the progressive self-initializing component bundle -->
    <script src="/dist/ln-ashlar.iife.js" defer></script>
</body>
</html>
```

---

## 3. Creating Your First Component

Let's build a simple, responsive collapsable sidebar menu. In `ln-ashlar`, interactive states are handled declaratively in HTML attributes rather than writing custom JS event click listeners.

### The Markup Recipe:
Add the following markup inside the `<body>` of your shell:

```html
<!-- Trigger Button: declares it controls "my-sidebar" -->
<button type="button" data-ln-toggle-for="my-sidebar">
    Toggle Menu
</button>

<!-- Target Panel: starts closed ("close") and owns the ID -->
<aside id="my-sidebar" data-ln-toggle="close" class="sidebar-panel">
    <header>
        <h3>Navigation</h3>
        <!-- Close button: tells the sidebar to close -->
        <button type="button" data-ln-toggle-for="my-sidebar">
            &times; Close
        </button>
    </header>
    <nav>
        <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/settings">Settings</a></li>
        </ul>
    </nav>
</aside>
```

### How it behaves:
1. On page load, the `ln-ashlar` global `MutationObserver` scans the DOM, discovers the `data-ln-toggle` attribute on `aside#my-sidebar`, and automatically instantiates the `lnToggle` component on it.
2. Clicking the trigger button writes `data-ln-toggle="open"` to the sidebar element.
3. The sidebar's local `MutationObserver` detects this attribute change, slides the menu into view, updates screen reader attributes (`aria-expanded="true"`), and dispatches lifecycle events.
4. Clicking the trigger again toggles the state back to `"close"`.

---

## 4. Verification

To verify that your installation is working correctly:
1. Open your page in a web browser.
2. Open **Developer Tools** (F12) and inspect the target element (`aside#my-sidebar`).
3. Click the "Toggle Menu" button. You should see the `data-ln-toggle` attribute value synchronously swap from `"close"` to `"open"` in the element tree.
4. Verify that no console errors or warnings are shown.

> [!TIP]
> **Try Inspector Initialization:** Because of `ln-ashlar`'s reactive `MutationObserver` architecture, you can dynamically add `data-ln-toggle="close"` directly to *any* HTML element in the browser's developer console or elements inspector, and it will immediately start working as a toggle component without requiring a page reload or manual initialization scripts!

---

## Related Documents

- [Mindset doctrine](../doctrine/mindset.md)
- [HTML Markup Rules doctrine](../doctrine/html-markup-rules.md)
- [Component Authoring Guide](./component-authoring.md)
