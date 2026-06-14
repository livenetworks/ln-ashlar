# Router — architecture

> Contract, attributes, events, examples → [`js/ln-router/README.md`](../../js/ln-router/README.md). This file documents internals: registry representation, path matching, navigation pipeline, teardown lifecycle, and hydration.
>
> Source: `js/ln-router/src/ln-router.js`.

## Navigation pipeline

Steps performed on each navigation request (both click-interception and programmatic API), in order:

1. **Path Resolution** — strip hash and query parameters. Parse query parameters into a flat `query` object. Collapse trailing slashes (e.g. `/users/` ≡ `/users`, empty ≡ `/`).
2. **Per-Region Match** — the router iterates every region in `regionRegistry` and runs `_matchRouteInRegion` against that region's sorted route list. The primary region (`__primary__`) match is authoritative. If the primary region is registered and has no match (and no catch-all `*` exists), dispatch `ln-router:not-found` on `document.body` and stop. Pages with no primary region (auxiliary-only pages) do not fire `not-found` and proceed to paint their auxiliary regions.
3. **Cancelable Intercept** — resolve the primary outlet element. Dispatch cancelable `ln-router:before-navigate` **once** on the primary outlet with `{ from, to, params, query }` payload. If `preventDefault()` is called, abort entire navigation (no region swaps, no history update). Skipped if no primary match exists.
4. **Compute Swap Plans** — for each region with a match, resolve its target element. If the target has `data-ln-route-keep` and the matched template node is identical to the currently-mounted template (`mountedTemplates.get(targetEl) === match.route.templateNode`), skip this region. Keep-skip is ONLY applied to auxiliary regions — the primary region (`__primary__`) is always active. Regions that will swap form the `swapPlans` list.
5. **History update** — push/replace once.
6. **Atomic swap** — a single `document.startViewTransition` callback runs ALL region swaps in `swapPlans` sequentially. For each: teardown, clone, `replaceChildren`, record in `mountedTemplates`. Focus/scroll/title apply to primary region only.
7. **`ln-router:navigated`** — fired per swapped region via `_dispatchMaybeDeferred`. Detail includes `region` key (`'__primary__'` or the target element id). On boot, all `navigated` dispatches are deferred one microtask.

## Registry & Specificity matching rules

Discovered route templates register themselves at boot or on insertion via the `registerComponent` lifecycle.

### Registry shape

```js
// Map<regionKey, { routes: Map<pattern, routeMetadata>, sorted: routeMetadata[] }>
const regionRegistry = new Map();
```

`regionKey` is `data-ln-route-target` id, or `'__primary__'` for the default outlet. Each region maintains its own `routes` Map and `sorted` array. The specificity comparator runs per-region. Duplicate guard is per `(pattern, regionKey)` pair — same pattern targeting different regions is legal.

### Specificity Comparator

To ensure the most specific route matches first, route patterns are sorted descending:

1. **Static segment** (highest priority) — any segment matching a string literal (e.g. `users` in `/users/:id`).
2. **Param segment** (medium priority) — any dynamic segment starting with `:` (e.g. `:id` in `/users/:id`).
3. **Wildcard segment** (lowest priority) — the `*` character matching any remainder.

Within identical specificity scores, the first declared route wins. If exact duplicate patterns are discovered for the same region, the router logs a `console.warn` and ignores the duplicate registration.

## Outgoing View Teardown & Teleport Cleanup

Teardown runs only for regions in the `swapPlans` list — a keep-region that skips a swap is never torn down.

When swapping children inside an outlet via `replaceChildren()`, plain DOM nodes are garbage-collected. However, active components with window/document event listeners or teleported overlay trees (like open popovers in `<body>`) will leak memory.

To prevent leaks:
1. Before clearing the outlet, we locate all descendants inside the target outlet containing component properties (properties on the element starting with `ln` that have a `destroy()` function) and call `destroy()` on them.
2. For open teleported popovers (`data-ln-popover="open"`), we check if the element that triggered them is a descendant of the outlet being swapped. If so, we call `destroy()` on the popover to restore the teleport and tear it down cleanly.

## Per-Region Persistence (Keep Regions)

A keep region is a target element with `data-ln-route-keep`. The router tracks the currently-mounted template per target element using a `WeakMap<Element, HTMLTemplateElement>` (`mountedTemplates`).

**Skip algorithm (auxiliary regions only — the primary region is never a keep region):**

```
if regionKey !== '__primary__' AND targetEl.hasAttribute('data-ln-route-keep'):
    if mountedTemplates.get(targetEl) === match.route.templateNode:
        → skip (no teardown, no swap, no navigated event)
    else:
        → normal swap
else:
    → always swap (even if template is the same node)
```

`mountedTemplates` is updated after every actual swap (and after a hydrated boot paint, to establish the keep-diff baseline).

## Dynamic SSR Hydration

On boot, each region independently checks its own target for `data-ln-router-hydrate` and child elements. A region whose target has the attribute and has children skips its clone swap for the boot navigation only.

1. On initial boot (`isHydration: true`), each region checks if the resolved target has `data-ln-router-hydrate` AND contains pre-rendered child elements.
2. If present for a given region, the router skips the initial clone swap (`replaceChildren`) for that region only to preserve SSR markup.
3. It registers all link click and popstate listeners.
4. It sets the active routing state and dispatches `ln-router:navigated` so the page coordinator can immediately bind/fill the SSR'd content.

## Boot timing — `_booting` flag & `_dispatchMaybeDeferred`

The module-level `_booting` flag is set to `true` immediately before the initial `_navigate` call inside `_boot()` and reset to `false` immediately after. During this window, any call to `_dispatchMaybeDeferred` queues the underlying `dispatch()` call through `queueMicrotask` instead of invoking it synchronously.

This guarantees that `ln-router:navigated` (matched boot route) and `ln-router:not-found` (unmatched boot route) are always delivered **after** the current synchronous task completes — including all `DOMContentLoaded` callbacks that register listeners in the same script-loading burst. Subsequent navigations set `_booting = false` and call `_dispatchMaybeDeferred` with it false, so their dispatches remain synchronous.

## Accessibility & Focus Shifting

For screen readers, client-side route changes do not automatically trigger a page reload announcement. To resolve this, `ln-router` implements programmatic focus shifting (primary region only):
1. The target outlet container or its first heading element (`h1` through `h6`) is marked with `tabindex="-1"`.
2. The router programmatically focuses this heading element immediately after mounting the DOM clone.
3. This triggers screen readers to announce the title/heading of the new page, establishing screen-reader continuity.

## Server Integration Requirements (Deep Linking)

When deploying client-side routing, the web server must be configured to handle page refreshes and direct access to deep paths.
- **Laravel Catch-All Fallback**: The Laravel server must return the main layout view for any routes not handled by the backend routing system. Use the `Route::fallback()` method at the end of `routes/web.php`:
  ```php
  Route::fallback(function () {
      return view('app');
  });
  ```
- **Base Tag**: To ensure assets are loaded correctly from any path depth, `<base href="/">` should be included in the `<head>` of the main HTML layout, or all asset URLs must be defined absolutely.

## Limitations — Parallel Regions, Not Nesting

**Parallel Regions, Not Nesting**

Multi-region routing is PARALLEL/sibling: two regions are peers at the page layout level. Neither is a child of the other's outlet. The "No Nested Routing" doctrine stands: there is no concept of a route inside another route's outlet. `ln-router` is a lightweight, flat client-side router — all routes must be declared flat and will occupy their designated targets completely.

## Progressive Enhancement

If supported by the browser, the DOM swap and focus shifts are wrapped inside `document.startViewTransition(...)` to allow smooth CSS-driven view transitions. If unsupported, the swap is executed synchronously. One `startViewTransition` call wraps ALL region swaps for a single navigation atomically.
