---
name: ln-debug
classification: simple
status: stable
domain: frontend
summary: Development diagnostics component providing console log suppression control, DOM element inspection seams, and CSS visual linter integration.
source: js/ln-debug/src/ln-debug.js
tags: [debug, diagnostics, linter, dev-tooling]
---

# 🛠️ ln-debug

> **Classification:** 🟢 Simple Component / Service (Layer 1 - Developer Tooling)

---

## 1. Core Behavior & Responsibility

`ln-debug` provides lightweight runtime developer diagnostics and visual HTML linting for the `ln-ashlar` design system. It fulfills three primary functions:

1. **Global Warning Suppressor / Filter:** Intercepts console warnings prefixed with `[ln-` or `[lnCore`. By default, these warnings are muted to keep production browser logs clean. When `data-ln-debug` is placed on `<html>` or `<body>`, warnings are unmuted and printed to the console.
2. **Developer Inspection Seam:** When applied to individual DOM elements, registers the component instance on `element.lnDebug` for inspection in browser developer tools.
3. **Visual HTML Linter (Dev CSS):** In conjunction with `ln-ashlar-dev.css`, visually flags HTML structural errors, invalid attribute usages, missing required `id`s, and un-semantic markup directly in the browser UI.

The JavaScript source is located at [ln-debug.js](../../js/ln-debug/src/ln-debug.js).

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **No Production DOM Mutations:** Does not alter element structure or behavior in production builds.
> - **No Network Activity:** Does not issue HTTP/AJAX requests or telemetry.
> - **No Production CSS Impact:** Diagnostic SCSS files (`*-dev.scss`) are strictly compiled into `ln-ashlar-dev.css` and are excluded from `ln-ashlar.css`.
> - **No App Crash Generation:** Never throws unhandled runtime exceptions that disrupt app execution.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

Place `data-ln-debug` on `<html>` or `<body>` and load `ln-ashlar-dev.css`:

```html
<!DOCTYPE html>
<html lang="en" data-ln-debug>
<head>
  <!-- Include dev stylesheet containing diagnostic visual lint rules -->
  <link rel="stylesheet" href="dist/ln-ashlar-dev.css" />
  <script src="dist/ln-ashlar.iife.js" defer></script>
</head>
<body>
  <!-- HTML markup issues (e.g. input without id) will be visually highlighted -->
</body>
</html>
```

---

### Component Seam Inspection

Place `data-ln-debug` on a target element to attach the debug seam instance:

```html
<table data-ln-table="users" data-ln-debug id="users-debug-table">
  <!-- Table content -->
</table>
```

Inspect via browser DevTools console:
```javascript
// Access the table component instance via its debug seam
const tableInstance = document.getElementById('users-debug-table').lnTable;
console.log(tableInstance);
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-debug` | `html` / `body` | `Flag` | — | Unmutes `[ln-` console warnings globally and activates the visual CSS linter. |
| `data-ln-debug` | Any element | `Flag` | — | Attaches component debug instance to `dom.lnDebug`. |

### Events API

This component emits and listens to no custom ln-* events.

---

## 4. CSS Diagnostics & Behavioral Concept

Visual lint rules are isolated from production builds to avoid performance degradation or visual pollution.

### Diagnostic SCSS Architecture
1. **Modular Rule Files:** Components maintain individual diagnostic rules in `*-dev.scss` files (e.g. [ln-date-dev.scss](../../js/ln-date/ln-date-dev.scss), [ln-number-dev.scss](../../js/ln-number/ln-number-dev.scss)).
2. **Dev Bundle Aggregator:** All modular diagnostic files are imported into [ln-ashlar-dev.scss](../../scss/ln-ashlar-dev.scss) and compiled to `ln-ashlar-dev.css`.
3. **Runtime Scoping:** All CSS diagnostic rules are scoped under `[data-ln-debug]`, ensuring rules remain inactive unless `data-ln-debug` is present on the page root.

### Visual Error Styles
- **Structural Errors:** Rendered with dashed red borders and top alert banners (e.g. `[data-ln-validate]` outside a `.form-element` wrapper).
- **Inline Warnings:** Displayed as red warning labels with `⚠` icons immediately following the target element (e.g. `<time data-ln-date>` misuse or empty `data-ln-search`).

---

## 5. Accessibility (ARIA) & Common Pitfalls

- **ARIA Verification:** Helps catch missing `id` attributes on trigger targets (`data-ln-toggle`, `data-ln-tabs`) required for keyboard and screen reader accessibility.
- **Common Pitfalls:**
  - **Deploying `ln-ashlar-dev.css` to Production:** Contains heavy `:not()` selectors intended only for local developer testing. Do not bundle in production deployments.
  - **Expecting Visual Errors without `data-ln-debug`:** Diagnostic CSS rules remain dormant unless `data-ln-debug` is present on `<html>` or `<body>`.

---

## 6. Sequence & Lifecycle Diagram

```mermaid
sequenceDiagram
    participant WebApp as Web Application
    participant Console as console.warn Interceptor
    participant DOM as Element [data-ln-debug]
    participant DebugJS as ln-debug.js

    Note over Console: On Script Load
    DebugJS->>Console: Intercepts global console.warn
    
    rect rgb(240, 240, 240)
        Note over WebApp, Console: Warning Test
        WebApp->>Console: console.warn("[ln-table] Missing source")
        alt No data-ln-debug on html/body
            Console-->>WebApp: Warning Muted (Suppressed)
        else data-ln-debug present on html/body
            Console-->>WebApp: Warning Logged to Console
        end
    end

    rect rgb(230, 245, 230)
        Note over DOM, DebugJS: Inspection Seam Lifecycle
        DOM->>DebugJS: Mount element with data-ln-debug
        DebugJS->>DOM: Set property: element.lnDebug = instance
        Note over DOM: Unmount (Component Destroy)
        DOM->>DebugJS: Element removed from DOM
        DebugJS->>DOM: Delete element.lnDebug
    end
```

---

## 7. Related Components

- **Source Code:** [`ln-debug.js` (Source)](../../js/ln-debug/src/ln-debug.js) | [`ln-debug.js` (Dist)](../../js/ln-debug/ln-debug.js) | [Aggregator SCSS](../../scss/ln-ashlar-dev.scss)
- **Modular Component Dev Styles:**
  - [ln-toggle-dev.scss](../../js/ln-toggle/ln-toggle-dev.scss)
  - [ln-table-dev.scss](../../js/ln-table/ln-table-dev.scss)
  - [ln-modal-dev.scss](../../js/ln-modal/ln-modal-dev.scss)
  - [ln-validate-dev.scss](../../js/ln-validate/ln-validate-dev.scss)
  - [ln-date-dev.scss](../../js/ln-date/ln-date-dev.scss)
  - [ln-number-dev.scss](../../js/ln-number/ln-number-dev.scss)
  - [ln-tabs-dev.scss](../../js/ln-tabs/ln-tabs-dev.scss)
  - [ln-search-dev.scss](../../js/ln-search/ln-search-dev.scss)
  - [ln-filter-dev.scss](../../js/ln-filter/ln-filter-dev.scss)
  - [ln-tooltip-dev.scss](../../js/ln-tooltip/ln-tooltip-dev.scss)
