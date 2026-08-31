# Development Diagnostics & DOM Validation (DOM Linter)

To maintain a zero-overhead footprint in production, `ln-ashlar` strictly isolates all developer warnings, structural validation checks, and HTML diagnostics from the production stylesheet `ln-ashlar.css`. 

Instead, they are compiled into a dedicated development validation stylesheet:

📂 **Path:** `demo/dist/ln-ashlar-dev.css`  
🔧 **Build command:** `npm run build:dev-css` (or automatically via `npm run build`)

---

## Core Concept: CSS-Only DOM Linter

During local development, linking `ln-ashlar-dev.css` turns the browser into an active **visual DOM Linter**. Instead of relying on heavy runtime JS validators or browser console warnings that are easily missed, CSS is used to inject alerts directly into the layout where integration mistakes occur.

### Why this architecture?
1. **Zero Production Overhead:** Production bundles remain 100% clean and optimized.
2. **Instant Developer Feedback:** Layout errors are flagged immediately on screen where the developer is looking, rather than hidden in the developer console.
3. **No Performance Penalty:** Using native CSS selectors for validation introduces zero CPU/JS execution overhead.

---

## Reusable Linter Mixins (The DRY Pipeline)

To make it as simple as possible for developers and QA engineers to write new DOM diagnostic rules without repeating styles, the framework exposes two clean-room SCSS mixins under `config/mixins`. 

When writing diagnostic checks, a developer only needs to write the CSS selector and `@include` one of these helpers with the warning message.

### 1. `@include dev-dom-error($message)`
Best for block elements or component wrappers. It applies a prominent red dashed border around the element and injects a warning banner at the top.
*   **SCSS Usage:**
    ```scss
    [data-ln-table]:not([id]) {
        @include dev-dom-error("[data-ln-table] is missing an id attribute");
    }
    ```

### 2. `@include dev-inline-error($message)`
Best for inline elements, labels, or inline warnings. It appends a clean red text label with a warning icon adjacent to the target element.
*   **SCSS Usage:**
    ```scss
    [data-ln-search-for=""] {
        @include dev-inline-error("data-ln-search-for target ID cannot be empty");
    }
    ```

---

## Active Diagnostic Rules & Modular Coverage

The framework implements domain-specific visual validation rules for all interactive components via dedicated modular stylesheets (`components/<component>/<component>-dev.scss`). All rules are aggregated in [`theme/ln-ashlar-dev.scss`](../../theme/ln-ashlar-dev.scss) and activated under `[data-ln-debug]`.

### 1. Tables (`ln-table`)
* **Missing Table ID:** `[data-ln-table]:not([id])` — Flags interactive table wrappers missing a unique `id` required for search and filter bridging.

### 2. Forms & Validation (`ln-validate`, `ln-form`)
* **Unidentified Validated Inputs:** `input[data-ln-validate]:not([id])` — Flags validated inputs missing an `id`.
* **Improper Nesting:** `[data-ln-validate]` outside a `.form-element` or `[data-ln-form]` wrapper.
* **Empty Form Target:** `[data-ln-form-for=""]` — Flags trigger buttons with empty target form references.

### 3. Popovers & Dropdowns (`ln-popover`, `ln-dropdown`)
* **Missing Container ID:** `[data-ln-popover]:not([id])`, `[data-ln-dropdown]:not([id])` — Flags menus missing IDs for trigger binding.
* **Empty Trigger Reference:** `[data-ln-popover-for=""]`, `[data-ln-dropdown-for=""]` — Flags trigger buttons targeting empty IDs.

### 4. Toggles & Modals (`ln-toggle`, `ln-modal`)
* **Missing Modal/Toggle Target:** `[data-ln-toggle-for=""]`, `[data-ln-modal-for=""]` — Flags controls that lack target IDs.
* **Missing Dialog ID:** `dialog[data-ln-modal]:not([id])` — Flags modal dialogs missing IDs for coordinator/URL hash routing.

### 5. Search & Filter (`ln-search`, `ln-filter`)
* **Empty Search Target:** `[data-ln-search-for=""]` — Flags search inputs without a target container ID.
* **Empty Filter Keys:** `[data-ln-filter-key=""]` — Flags filter inputs with missing filter keys.

### 6. Localization & Translations (`ln-translations`, `ln-date`, `ln-number`, `ln-time`)
* **Missing Active Badges List:** `[data-ln-translations]:not(:has([data-ln-translations-active]))` — Flags translation containers lacking the active pills container.
* **Empty Translatable Field:** `[data-ln-translatable=""]` — Flags elements with empty translation keys.
* **Malformed Date/Time Targets:** Flags misuse of `data-ln-date` or `data-ln-time` without required values or target structures.

### 7. Other Components & Coordinators
Dedicated modular diagnostics are also active for `ln-accordion`, `ln-ajax`, `ln-autoresize`, `ln-autosave`, `ln-circular-progress`, `ln-confirm`, `ln-data-coordinator`, `ln-data-store`, `ln-editor`, `ln-include`, `ln-key`, `ln-link`, `ln-list`, `ln-options`, `ln-progress`, `ln-router`, `ln-slug`, `ln-sort`, `ln-sortable`, `ln-stat`, `ln-tabs`, `ln-toast`, `ln-tooltip`, and `ln-upload`.

---

## Integration in Local Environments

To load diagnostics safely in development while excluding them from production, wrap the stylesheet link in an environment check on your server-side templates (e.g. PHP/Blade, Twig, or Go templates):

### Blade Example (Laravel)
```html
<!-- Main Production Stylesheet -->
<link rel="stylesheet" href="{{ asset('dist/css/ln-ashlar.css') }}">

<!-- Visual Linter loaded only locally or in staging -->
@if(app()->environment('local', 'testing'))
    <link rel="stylesheet" href="{{ asset('dist/css/ln-ashlar-dev.css') }}">
@endif
```

### Raw HTML / Local Development
Simply link both in your test files:
```html
<link rel="stylesheet" href="dist/ln-ashlar.css">
<link rel="stylesheet" href="dist/ln-ashlar-dev.css">
```
