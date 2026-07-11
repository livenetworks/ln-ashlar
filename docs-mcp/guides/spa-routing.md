---
name: spa-routing
classification: guide
status: draft
domain: frontend
summary: Client-side routing and hash-state architecture in ln-ashlar - compound URL fragments, navigation lifecycles, and view teardowns.
source: docs/architecture/hash-state.md, docs/js/router.md
tags: [router, navigation, hash-state, spa, history]
---

# 🗺️ SPA Routing and Hash-State Guide

## Summary

This guide explains how `ln-ashlar` coordinates client-side routing with page-level UI state representation. It covers the difference between URL path navigation ([`ln-router`](../components/ln-router.md)) and fragment states (`hash-state`), details the compound hash grammar and codec, outlines the five core hash rules, and walks through the client-side navigation pipeline.

---

## 1. Navigation Path vs. Component Hash State

To provide a seamless browser history experience, `ln-ashlar` divides URL tracking into two distinct concerns:

| State Type | URL Layer | Component / Handler | Behavior |
|---|---|---|---|
| **Route / View** | Path + Query String (`/users?status=active`) | `ln-router` | Decides which page view, panel template, or layout structure is loaded. Triggers view transitions, scroll resets, and focus resets. |
| **Component UI State** | Fragment / Hash (`#user-tabs:settings&user-modal:42`) | Hash Codec (`hash.js`) | Controls page-local overlays that should be bookmarkable or dismissible via the Back button (e.g. which tab is active, which modal is open). |

---

## 2. The Compound Hash Grammar and Codec

When multiple overlays co-exist on a single page, they share the URL fragment using a serialized grammar:

```
#namespaceA:valueA&namespaceB:valueB
```

- **Separators:** Segments are separated by the `&` symbol.
- **Key-Value:** Segments are structured as `namespace:value`, where the namespace typically corresponds to the component's HTML element `id` or a custom key.
- **Bare Namespaces:** A namespace without a colon (e.g. `#user-modal`) represents a bare presence indicator (interpreted as an empty string value `''`).
- **Encoding:** Values are URL-encoded (`encodeURIComponent`).

### The Hash Codec API (`window.lnCore.*`)
- **`hashParse(str)`:** Parses a fragment string into a flat dictionary of key-value pairs.
- **`hashGet(ns)`:** Retrieves the value of a specific namespace segment.
- **`hashSet(ns, value)`:** Updates only the specified namespace, preserves all other segments, and assigns the resulting string back to `location.hash`. If the value resolves to `null`, the segment is removed.
- **`hashLinkClick(e)`:** Inspects anchor clicks. Prevents default behavior on left-clicks but allows middle-clicks and modifier clicks to open links in new tabs natively.

---

## 3. The Five Rules of Hash-State

To prevent components from clobbering each other's URL parameters, all hash operations must adhere to these five rules:

### Rule 1: Namespace Ownership
Each component owns exactly one namespace (e.g. the element's `id`). A component must only read and write to its own segment; it must remain completely unaware of other namespaces in the hash.

### Rule 2: Foreign-Segment Preservation
Direct literal strings must **never** be assigned directly to `location.hash` (e.g., `location.hash = '#tab:settings'` is forbidden). All writes must go through `hashSet`, which preserves foreign segments.

### Rule 3: Intercept Anchors
Clicking a native `<a href="#modal:12">` anchor would replace the entire hash string, breaking Rule 2. Components must intercept clicks on their own anchors, invoke `hashLinkClick(e)`, and redirect the write through `hashSet(ns, value)`.

### Rule 4: Decouple Form Fills (Coordinator Pattern)
Components must remain generic. A modal component handles open/close states in the hash and dispatches events, but it does **not** fetch data or populate forms. Cross-component wiring belongs inside a coordinator (such as `ln-modal-fill`), which catches `ln-modal:open` and fills the nested form.

### Rule 5: Router Fragment Guard
The router ignores `popstate` history transitions where the new URL differs from the old URL **only in the fragment** (path and query remain identical). This allows the browser's Back button to dismiss open modals without reloading or tearing down the under-modal page view.

---

## 4. The `ln-router` Navigation Pipeline

When a user navigates to a new client-side path (via clicking a link or calling `router.navigate()`), the router executes the following pipeline:

```
Resolve Path ──> Match Regions ──> Intercept ──> Swap Views ──> Focus & Announce
```

1. **Path Resolution:** Strips query strings and hashes. Parses query strings into a flat `query` object, and collapses trailing slashes.
2. **Per-Region Match:** Matches the path against the sorted template patterns for each registered outlet region (e.g. `__primary__` or auxiliary regions).
3. **Cancelable Intercept:** Dispatches `ln-router:before-navigate` on the primary outlet. Calling `e.preventDefault()` halts navigation completely.
4. **Compute Swap Plans:** Identifies which regions must be updated. Auxiliary regions marked with `data-ln-route-keep` are skipped if the incoming template matches the currently mounted template.
5. **History Update:** Executes `history.pushState` or `replaceState`.
6. **View transition & Atomic Swap:** Executes the swap. Old elements are torn down, and the new template is cloned and inserted using `replaceChildren()`.
7. **Accessibility Focus Shift:** Programmatically shifts keyboard focus to the target outlet container or its first heading (`h1`-`h6`) with `tabindex="-1"`. This triggers screen readers to announce the new page title.
8. **Navigation Completion:** Dispatches `ln-router:navigated` per swapped region.

---

## 5. View Teardown and Teleport Cleanup

When a region is swapped out, simply throwing away elements would leave active event listeners and orphaned teleported elements (such as open popover panels inside `<body>`) floating in memory.

To prevent memory leaks:
1. **Component Teardown:** The router queries the exiting DOM tree for any elements carrying active component instances (objects on the element starting with the `ln` prefix) and calls `destroy()` on them.
2. **Teleport Cleanup:** The router queries the document for open popovers (`[data-ln-popover="open"]`). If a popover's trigger button is inside the exiting region, the router destroys the popover, restoring the element to its origin and tearing it down cleanly.

---

## 6. Route Pattern Specificity Matching

Route patterns are matched in order of descending specificity to ensure the most explicit route is resolved first:
1. **Static Segment (Highest):** Match exact strings (e.g., `/users` in `/users/:id`).
2. **Dynamic Parameter (Medium):** Match dynamic variables starting with a colon (e.g., `:id` in `/users/:id`).
3. **Wildcard (Lowest):** Match catch-all paths (`*`).

If duplicate identical patterns are registered for the same outlet region, the router logs a console warning and ignores the subsequent registration.

---

## Related Documents

- [JS Component Model doctrine](../doctrine/js-component-model.md)
- [Getting Started Guide](./getting-started.md)
