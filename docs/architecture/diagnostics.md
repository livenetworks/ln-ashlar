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
    th[data-ln-sort]:not(:has([data-ln-table-sort])) {
        @include dev-inline-error("missing sort button");
    }
    ```

---

## Active Diagnostic Rules

Below is the list of active validation rules implemented in the framework, grouped by component.

### 1. Tables (`ln-table` / `ln-data-table`)

#### A. Missing Sort Buttons
A sortable table header `th[data-ln-sort]` expects a `<button data-ln-table-sort>` inside it to capture sort clicks correctly.
*   **Trigger:** A `<th>` has `data-ln-sort` but is missing a child button with the `data-ln-table-sort` attribute.
*   **Result:** A red warning label is rendered dynamically on screen: `⚠ missing sort button`.
*   **Target SCSS Usage:**
    ```scss
    th[data-ln-sort]:not(:has([data-ln-table-sort])) {
        @include dev-inline-error("missing sort button");
    }
    ```

#### B. Missing Table Identifiers (IDs)
Interactive table wrappers `[data-ln-table]` require a unique `id` attribute to match them to search forms and column filter dropdowns/popovers.
*   **Trigger:** A `[data-ln-table]` container has no `id` attribute.
*   **Result:** The entire table wrapper gets an immediate red dashed border and a prominent red diagnostic block at the top:
    ```
    ⚠ [data-ln-table] is missing a required 'id' attribute for filter mapping.
    ```
*   **Target CSS Selector:** `[data-ln-table]:not([id])`

---

## Future Component Diagnostics (Planned)

As the framework evolves, visual linter rules will be added for other complex components. This document acts as the central reference for those rules.

### 2. Forms & Validation (`ln-validate`)
*   **Missing Form Elements:** A container marked with validation hooks but missing the actual `<form>` wrapper or submit controls.
*   **Unbound Inputs:** `[data-ln-validate]` elements with inputs that are missing their `name` attributes (which prevents them from being serialized).

### 3. Popovers & Tooltips (`ln-popover` / `ln-tooltip`)
*   **Broken Popover Targets:** Buttons carrying `data-ln-popover-for="target-id"` where the corresponding `#target-id` popover element does not exist in the DOM.

### 4. Language Translations (`ln-translations`)
*   **Missing Active Badges:** Containers carrying `data-ln-translations` but missing the `<ul data-ln-translations-active>` badges container needed to render the active language pills.

---

## Integration in Local Environments

To load diagnostics safely in development while excluding them from production, wrap the stylesheet link in a environment check on your server-side templates (e.g. PHP/Blade, Twig, or Go templates):

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
