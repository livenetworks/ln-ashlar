---
name: getting-started
classification: guide
status: draft
domain: frontend
summary: Quickstart guide to install ln-ashlar, link precompiled assets, and build your first progressive interface.
source:
tags: [installation, setup, quickstart, html]
---

# 🚀 Getting Started

## Summary

This guide walks you through installing `ln-ashlar` in your project, referencing the precompiled distribution assets (`dist/`), and building your first fully-functional, progressive DOM-First interface with zero application JavaScript.

---

## 1. Installation

`ln-ashlar` is designed to be easily integrated into any web application framework (such as Laravel, Go, Rails, or Node) or dropped directly into static HTML files.

### Option A: Install via NPM (For build pipelines)
Add the package as a runtime dependency:
```bash
npm install @livenetworks/ashlar
```

### Option B: Precompiled Assets (For direct script inclusion)
If you prefer not to use a build system, copy the production-ready assets directly from the package's `dist/` directory into your project's public assets folder:
- `dist/ln-ashlar.css` — contains all layout grid, typography, tokens, variables, and component styles.
- `dist/ln-ashlar.js` — contains the compiled, zero-dependency, self-initializing JavaScript component library.

---

## 2. Setting Up the HTML Shell

To begin using the library, reference the stylesheet in the `<head>` and load the JavaScript bundle at the bottom of your HTML document. 

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
    <script src="/dist/ln-ashlar.js" defer></script>
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
