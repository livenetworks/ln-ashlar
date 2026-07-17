---
name: ln-link
classification: simple
status: stable
domain: frontend
summary: A navigation helper component that turns entire DOM blocks into clickable areas while preserving HTML link semantics and accessibility.
source: js/ln-link/src/ln-link.js
tags: [link, click, helper, navigation]
---

# 🔗 ln-link

> **Classification:** 🟢 Simple component (Layer 1 - Navigation Helper)

---

## 1. Core Behavior & Responsibility

The `ln-link` component transforms whole block-level DOM elements (such as cards, panels, or table rows) into clickable link targets without corrupting native document semantics or screen reader navigability. It is defined in [ln-link.js](../../js/ln-link/src/ln-link.js).

*   **Delegated Navigation:** Finds the first `<a>` descendant element within its boundary and routes container click interactions directly to that anchor's `href`.
*   **Interaction Exclusions:** Prevents card-wide clicks if the user clicks directly on other nested interactive components (buttons, links, inputs, selects, or textareas), ensuring nested widgets operate without parent route interference.
*   **Modifier Click Support:** Natively supports middle-clicks, Ctrl-clicks (Windows), and Cmd-clicks (macOS) to open the target destination in a new browser tab (`_blank`).
*   **Custom Status Bar:** Appends a status bar (`.ln-link-status`) dynamically at the bottom of the viewport when hovering over a clickable container, replicating the browser's native link status preview.
*   **Navigation Interception:** Dispatches the cancelable `ln-link:navigate` event prior to executing target navigation. Calling `e.preventDefault()` halts redirection, facilitating SPA routing hooks.

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **No Visual Styles:** Does not apply hover decorations, border colors, or visual feedback to the container itself (styling is the responsibility of the visual layout CSS/SCSS).
> - **No Direct URL Definitions:** Does not accept a raw URL config parameter; it requires a semantic `<a>` tag with a valid `href` within its structure.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup: Clickable Card

An anchor link determines the target destination, but the entire card area responds to click triggers.

```html
<div class="card" data-ln-link>
    <img src="avatar.jpg" alt="Thumbnail" />
    <h3>
        <!-- The primary anchor determines the URL target -->
        <a href="/profile/johndoe">John Doe</a>
    </h3>
    <p>Short bio text...</p>
    
    <!-- Secondary action (Clicking here does NOT trigger card navigation) -->
    <button type="button" class="btn-action">Follow</button>
</div>
```

### Variant 1: Clickable Table Row

Used inside grids to navigate to a record detail view when clicking anywhere on a table row.

#### HTML Markup
```html
<table data-ln-link>
    <thead>
        <tr><th>Name</th><th>Role</th><th>Actions</th></tr>
    </thead>
    <tbody>
        <!-- Clicking the row navigates to the first anchor link href -->
        <tr>
            <td><a href="/users/142">Peter Smith</a></td>
            <td>Developer</td>
            <td><button type="button">Edit</button></td>
        </tr>
    </tbody>
</table>
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-link` | Container | `Flag` | — | Activates link behavior on containers (`<div>`, `<article>`, `<table>`, `<tbody>`, etc.). |

### Events API

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-link:navigate` | Emits | Yes | Fires on the host element before initiating redirection. | `{ target: HTMLElement, href: String, link: HTMLAnchorElement }` |

### Programmatic JS API (via `window.lnLink`)

| Helper | Signature | Returns | Description |
|---|---|---|---|
| `window.lnLink.init` | `(domRoot: HTMLElement)` | `void` | Scans and initializes `data-ln-link` behaviors inside a container. |
| `window.lnLink.destroy` | `(container: HTMLElement)` | `void` | Deconstructs handlers and unregisters listeners for a given container. |

---

## 4. CSS Styling & Behavioral Concept

The component sets `cursor: pointer` on containers to signal interactivity, and requires styles for the viewport status bar.

```scss
[data-ln-link] {
    cursor: pointer;
}

// Global status bar appended to the body
.ln-link-status {
    position: fixed;
    bottom: 0;
    left: 0;
    max-width: 30%;
    padding: 0.25rem 0.5rem;
    background-color: var(--color-gray-darkest, #1e293b);
    color: #fff;
    font-size: 0.75rem;
    font-family: monospace;
    border-top-right-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition: opacity 0.15s ease, transform 0.15s ease;
    z-index: 9999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    
    &.ln-link-status--visible {
        opacity: 0.95;
        transform: translateY(0);
    }
}
```

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Keyboard

- **Keyboard navigation:** Focus remains native. The user can navigate using `Tab` to reach the semantic `<a>` link within the block. Screen readers announce the card naturally as a link.
- Developers should ensure parent blocks reflect visual focus when the inner link receives focus:
  ```scss
  .card:focus-within {
      outline: 2px solid var(--color-primary);
  }
  ```

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **No Anchor Element in Container:** If a container has `data-ln-link` but does not contain a child `<a>` element, clicking the block has no effect as no target `href` is resolved.
> 2. **Double Event Handling:** Do not attach custom JS click listeners directly to the container to manage navigation, as this will conflict with `ln-link`'s internal delegation logic. Use the `ln-link:navigate` event instead.

---

## 6. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Card as div[data-ln-link]
    participant Link as a Element
    participant LinkJS as ln-link JS
    participant Status as .ln-link-status

    Card->>LinkJS: Component Mount
    LinkJS->>LinkJS: Scan for first <a> tag
    LinkJS->>Card: Bind click, mouseenter, mouseleave

    alt User hovers container
        User->>Card: Hover (mouseenter)
        Card->>LinkJS: Trigger hover handler
        LinkJS->>Status: Show and populate textContent with link href
        User->>Card: Leave (mouseleave)
        Card->>LinkJS: Trigger leave handler
        LinkJS->>Status: Hide status bar
    else User clicks container
        User->>Card: Click on card
        Card->>LinkJS: Intercept click
        alt Click on target is 'a, button, input, select, textarea'
            LinkJS->>LinkJS: Ignore (allow native bubble)
        else Click on empty container space
            LinkJS->>Card: dispatch ln-link:navigate { href }
            alt defaultPrevented is false
                alt Modifier key or middle click
                    LinkJS->>User: Open URL in new window/tab
                else Standard left click
                    LinkJS->>Link: Trigger native click()
                end
            end
        end
    end
```

---

## 7. Related Components

- [`ln-table`](./ln-table.md) — Uses `data-ln-link` on `<tr>` tags to make rows navigable.
- [`ln-external-links`](./ln-external-links.md) — Integrates with `ln-link` elements to enforce security guidelines if the inner link target is external.
