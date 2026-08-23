# 🛠️ ln-ashlar Demo Infrastructure

This directory contains the codebase, assets, and templates for demonstrating the `ln-ashlar` UI library components.

---

## 📂 Directory Structure

* **`admin/`** — The main admin dashboard template.
  * **`src/`** — Source templates and styles.
    * **`pages/`** — Individual HTML page contents (e.g. `tables.html`, `density.html`).
    * **`shell.html`** — The global master layout containing the sidebar, header, and script wrappers.
    * **`scss/`** — Custom styling for the admin theme.
    * **`build-pages.mjs`** — Node.js script that merges page templates with the master shell.
  * **`dist/`** — Compiled assets (compiled CSS, JavaScript, and mock scripts).
* **`docuflow/`** — Spacing/layout demo representing document flow styles.
* **`spa/`** — Single-page application integration demo.

---

## 🔍 Code Inspector Engine (`demo.js`)

In the admin demo, each component's documentation page displays interactive card sections. The javascript in `admin/dist/demo.js` automatically parses these cards and renders tabs with code snippets.

To enable this, the engine looks for specific HTML attributes:

### 1. `data-demo-html`
Applied to a `.section-card` container. 
When present, the engine automatically extracts the raw HTML contents inside the `<main>` tag, formats and cleans the indentation, escapes HTML characters, and injects a collapsable code panel containing the **HTML Source** tab.

```html
<section class="section-card" data-demo-html>
    <header><h3>Basic Example</h3></header>
    <main>
        <!-- The HTML here is extracted dynamically to show the source code -->
        <button type="button">Click me</button>
    </main>
</section>
```

### 2. `data-demo-scss`
Applied to a `<script type="text/plain" data-demo-scss>` inside a `.section-card`.
When present, the engine extracts the SCSS content inside the script tag, cleans the indentation, and adds a **SCSS** tab to the code inspector next to the HTML tab. Using `type="text/plain"` prevents the browser from executing the script block.

```html
<section class="section-card" data-demo-html>
    <header><h3>Custom Styled Example</h3></header>
    <main>
        <div class="custom-card">Content</div>
    </main>
    
    <!-- This block is extracted dynamically for the SCSS code viewer tab -->
    <script type="text/plain" data-demo-scss>
    .custom-card {
        @include border;
        padding: var(--size-md);
    }
    </script>
</section>
```

---

## 🚀 Build System

The pages in `demo/admin/` are generated dynamically by merging the page templates under `demo/admin/src/pages/` into the global `demo/admin/src/shell.html`.

### Run Compilation

To compile stylesheets and rebuild all demo page templates:

```bash
# Rebuild only the admin demo (Windows compatible PowerShell command):
npx sass demo/admin/src/admin.scss demo/admin/dist/admin.css --no-source-map --style=compressed; Copy-Item demo/admin/src/demo.js demo/admin/dist/demo.js; node demo/admin/src/build-pages.mjs

# Or rebuild all demos via package.json scripts:
npm run build:demos
```
