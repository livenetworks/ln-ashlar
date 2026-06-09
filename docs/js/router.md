# Router — architecture

> Contract, attributes, events, examples → [`js/ln-router/README.md`](../../js/ln-router/README.md). This file documents internals: registry representation, path matching, navigation pipeline, teardown lifecycle, and hydration.
>
> Source: `js/ln-router/ln-router.js`.

## Navigation pipeline

Steps performed on each navigation request (both click-interception and programmatic API), in order:

1. **Path Resolution** — strip hash and query parameters. Parse query parameters into a flat `query` object. Collapse trailing slashes (e.g. `/users/` ≡ `/users`, empty ≡ `/`).
2. **Route Matcher** — match path against registered routes in specificity order. If no route matches and no catch-all `*` exists, dispatch `ln-router:not-found` event on `document.body` and stop.
3. **Cancelable Intercept** — resolve target outlet element (explicit `data-ln-route-target` or default outlet fallback). Dispatch cancelable `ln-router:before-navigate` on the target element with `{ from, to, params, query }` payload. If `preventDefault()` is called, abort navigation.
4. **History update** — update URL via `history.pushState` (for link clicks/`navigate`) or `history.replaceState` (for `replace`/initial render). Skip for `popstate` triggers.
5. **Teardown outgoing view** — traverse descendants of the target outlet and call `.destroy()` on any active component instances (`el.ln*`). Additionally, locate any open popovers teleported to `<body>` whose triggers are inside the outlet, and call `destroy()` on them.
6. **DOM Swap** — if not hydrating, clone the matched template content (`templateNode.content.cloneNode(true)`) and perform atomic swap on target via `replaceChildren(clone)`.
7. **Document Title** — apply `data-ln-route-title` value to `document.title` if present on the matched template.
8. **Accessibility & UX** — shift focus to the target outlet (with `tabindex="-1"`) or its first heading element for screen-reader continuity. Scroll the target element into view (`scrollIntoView` at start).
9. **Component Auto-init** — the browser triggers MutationObserver callbacks registered via `registerComponent`. Component descendants inside the newly mounted view auto-initialize themselves; the router does not perform manual constructor calls.
10. **`ln-router:navigated` dispatch** — dispatch non-cancelable event on target element with `{ path, params, query, route, target }` detail.

## Registry & Specificity matching rules

Discovered route templates register themselves at boot or on insertion via the `registerComponent` lifecycle. They are stored in a module-level singleton `Map`.

### Specificity Comparator

To ensure the most specific route matches first, route patterns are sorted descending:

1. **Static segment** (highest priority) — any segment matching a string literal (e.g. `users` in `/users/:id`).
2. **Param segment** (medium priority) — any dynamic segment starting with `:` (e.g. `:id` in `/users/:id`).
3. **Wildcard segment** (lowest priority) — the `*` character matching any remainder.

Within identical specificity scores, the first declared route wins. If exact duplicate patterns are discovered, the router logs a `console.warn` and ignores the duplicate registration.

## Outgoing View Teardown & Teleport Cleanup

When swapping children inside an outlet via `replaceChildren()`, plain DOM nodes are garbage-collected. However, active components with window/document event listeners or teleported overlay trees (like open popovers in `<body>`) will leak memory.

To prevent leaks:
1. Before clearing the outlet, we locate all descendants inside the target outlet containing component properties (properties on the element starting with `ln` that have a `destroy()` function) and call `destroy()` on them.
2. For open teleported popovers (`data-ln-popover="open"`), we check if the element that triggered them is a descendant of the outlet being swapped. If so, we call `destroy()` on the popover to restore the teleport and tear it down cleanly.

## Dynamic SSR Hydration

To prevent layout flashes on first load of server-rendered pages:
1. On initial boot, the router checks if the target outlet has the `data-ln-router-hydrate` attribute and contains pre-rendered child elements.
2. If present, the router skips the initial clone swap (`replaceChildren`) to preserve SSR markup.
3. It registers all link click and popstate listeners.
4. It sets the active routing state and dispatches `ln-router:navigated` so the page coordinator can immediately bind/fill the SSR'd content.

## progressive enhancement

If supported by the browser, the DOM swap and focus shifts are wrapped inside `document.startViewTransition(...)` to allow smooth CSS-driven view transitions. If unsupported, the swap is executed synchronously.
