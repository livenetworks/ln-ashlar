---
name: html-markup-rules
classification: doctrine
status: draft
domain: frontend
summary: Semantic HTML requirements, the dictionary pattern, interactive element rules, and DOM structure standards in ln-ashlar.
source: docs/architecture/reference.md, .agents/AGENTS.md
tags: [doctrine, html, semantic, markup, accessibility]
---

# 🌐 HTML Markup Rules and Structure Guidelines

## Summary

This guide details the mandatory HTML conventions and structure doctrines within `ln-ashlar`. It defines semantic markup expectations, the `ul`/`li` dictionary pattern for internationalization (i18n), the requirements for interactive triggers, search input debouncing, and rules regarding DOM encapsulation and styling separation.

---

## 1. Semantic HTML and the "No Bare Div" Doctrine

`ln-ashlar` is designed to be server-renderable, accessible by default, and easy to inspect. To maintain clean DOM trees, developers must prioritize native semantic HTML5 tags over generic `div` elements.

### Rules:
- **No wrapper `<div>` chains:** Do not wrap components in multiple layers of visual chrome.
- **Form is the Content Root:** In modals ([`ln-modal`](../components/ln-modal.md)), panels, and sheets, the `<form>` element acts as the root container. Visual wrappers like `.modal-content` or `.modal-dialog` are prohibited. Structure is selected directly as `.ln-modal > form`.
- **Semantic Compartments:** Use `<header>`, `<main>`, and `<footer>` tags inside layouts and components.
- **Form controls:** Always associate labels with inputs using the `for` attribute and unique input `id`s.
- **Lists for Repeating Siblings:** Whenever presenting multiple elements of the same logical "type" (such as navigation menus, action button clusters, tablists, or database/connector coordinator child configs), always structure them inside a `<ul>` / `<li>` (unordered list) or `<ol>` / `<li>` (ordered list) structure, depending on whether their sequential order is semantically relevant. Do not group them using adjacent divs or spans.

#### Correct Modal Markup:
```html
<div class="ln-modal" data-ln-modal id="user-modal">
    <form>
        <header>
            <h3>Edit User</h3>
            <button type="button" aria-label="Close" data-ln-modal-close>
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        <main>
            <label for="username">Username</label>
            <input type="text" id="username" name="username">
        </main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="submit">Save Changes</button>
        </footer>
    </form>
</div>
```

---

## 2. Interactive Elements (Clickables)

Every element that performs an action upon interaction must use the correct interactive HTML tag.

### Rules:
- **Buttons for Page-Local Actions:** Any action that updates page state, triggers overlays, or mutates data must use `<button type="button">` or `<button type="submit">`.
- **Anchors for Navigation:** Only use `<a>` (with a valid `href`) for actions that navigate to another page or route.
- **No Div/Span Click Handlers:** Never bind click listeners to `<div>`, `<span>`, `<li>`, or `<td>` elements. This bypasses native keyboard navigation, breaks screen readers (ARIA), and requires custom focus management.
- **Explicit Button Types:** Always specify `type="button"` on non-submit buttons (such as cancel or close triggers) inside form scopes. If omitted, the browser defaults to `type="submit"`, causing unintended form submissions.

---

## 3. The `ul`/`li` Dictionary Pattern (I18n)

Hardcoding user-facing strings or labels inside JavaScript files is strictly forbidden. All translation and display text must be declared in the HTML template.

For static translation strings, use the **Dictionary Pattern** read by `buildDict`:

### How it works:
1. Declare a `<ul hidden>` block inside the component markup.
2. Put each translation string in an `<li>` element with a `data-ln-{component}-dict="{key}"` attribute.
3. At initialization, JavaScript reads these keys, builds a local configuration object, and removes the list from the DOM to keep it clean.

#### Dictionary Markup Example:
```html
<div data-ln-upload id="file-uploader">
    <!-- Hidden dictionary declaration -->
    <ul hidden>
        <li data-ln-upload-dict="remove">Remove File</li>
        <li data-ln-upload-dict="error">Upload Failed</li>
        <li data-ln-upload-dict="success">Complete</li>
    </ul>
    
    <input type="file" name="attachment">
</div>
```

#### JS Translation Consumption:
```js
import { buildDict } from '../ln-core';

// Inside component initialization
const dict = buildDict(dom, 'data-ln-upload-dict');

// Safe translation access with fallbacks
const removeLabel = dict['remove'] || 'Remove';
```

For numbers, dates, times, and currencies, always leverage native browser `Intl` APIs (`Intl.DateTimeFormat`, `Intl.NumberFormat`) instead of dictionary entries.

---

## 4. Separation of Visual Layer and Functional triggers

To prevent styling side-effects and maintain clean component configurations, visual styling selectors must be kept separate from behavioral selectors:

- **Functional Triggers (`data-ln-*`):** Used strictly for JavaScript binding and behavior configurations (e.g., `data-ln-modal`, `data-ln-search-debounce`). Never style elements using these attributes as bare selectors (e.g., `[data-ln-modal] { padding: 12px; }` is forbidden).
- **Visual Styles (CSS Classes):** CSS/SCSS selectors and classes define visual presentation (e.g., `.search`, `.collapsible`, `.btn`).
- **State Selection:** State attributes with explicit values (`data-ln-modal="open"`) are allowed in CSS to handle display states (e.g., toggling `display: flex` or animations).

---

## 5. Semantic Class Naming and ID-Based Styling

Class names in `ln-ashlar` must represent the semantic purpose of the element, not its physical design implementation.

### Prohibited Class Structures:
- **No Utility Lists (Tailwind style):** Chains of styling utility classes (e.g., `class="flex flex-col p-4 bg-white shadow-md border-red-500"`) are strictly forbidden. Layouts and styles are compiled and maintained in SCSS files, not utility-hacked in HTML.
- **No BEM Structure:** BEM naming conventions (e.g., `class="modal__content--active"` or `class="sidebar__item-link"`) are forbidden. Keep selectors simple and readable.

### Naming Conventions:
- **General Elements:** Use clean, generic semantic class names (e.g., `class="modal"`, `class="toggle"`, `class="nav"`, `class="sidebar"`, `class="dropdown"`).
- **Specific Components / IDs:** For distinct page components, you do not need to use classes at all; you may style elements directly by their HTML `id` (e.g., `id="user-edit-modal"`, `id="packages-filter-drawer"`, `id="main-navigation"`).

### SCSS Mixin Binding Pattern:
Instead of defining reusable visual layout classes, bind generic SCSS mixin recipes directly to your semantic class or ID selectors. Grouping shared mixins and overriding padding or color styles must be handled strictly in your SCSS files. For the complete grouping, token re-binding, and primitive overriding guidelines, see [SCSS Architecture](./scss-architecture.md#c-mixin-inclusion-grouping-and-overrides).

---

## 6. Forbidden Visual Configurations

### Forbidden: Reusable Visual Utility Classes
Creating global, visual-heavy custom utility classes in CSS to copy-paste layouts in HTML:

```html
<!-- FORBIDDEN: Copy-pasting a custom utility layout class across elements -->
<div class="my-custom-modal-layout shadow-lg padding-large bg-white border-red" data-ln-modal>
    ...
</div>
```

### Allowed: Semantic Identifiers
Use clean, semantic selectors, and bind styles using SCSS mixin recipes:

```html
<!-- ALLOWED: Clean selector, styled directly in SCSS via mixins -->
<dialog id="user-edit-modal" data-ln-modal>
    ...
</dialog>
```

---

## 7. Forbidden Toggles (No "Checkbox Hack")

Using hidden `<input type="checkbox">` elements to toggle CSS visual state (the "checkbox hack") is strictly forbidden in `ln-ashlar`. See [js-component-model](./js-component-model.md) for the full anti-pattern rationale.
