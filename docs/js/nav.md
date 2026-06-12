# Nav

Active link tracking for navigation. File: `js/ln-nav/ln-nav.js`.

## Singleton pushState patch

`history.pushState` is monkey-patched once per page, guarded by `history._lnNavPatched`. Every `[data-ln-nav]` instance pushes its update handler onto a shared `_pushStateCallbacks` array; the patched `pushState` invokes them all after delegating to the original. There is no `popstate`-via-`pushState` synthesis — both events are wired explicitly. This is the only mechanism that catches URL changes performed by ln-ajax (or any other library calling `pushState`).

## Per-instance MutationObserver

Each instance caches its `<a>` collection in a closed-over `links` array. A per-nav `MutationObserver` watches `childList` on the nav subtree and reconciles the array as nodes appear or disappear:

- Added node is `<a>` → push, score against current path immediately.
- Added subtree → collect descendant `<a>`, push, score.
- Removed node is `<a>` → splice from `links`.
- Removed subtree → splice every descendant `<a>` that was in `links`.

Re-scoring on add is what guarantees AJAX-inserted partials get the active class without waiting for the next URL change.

## Global DOM observer

A separate `MutationObserver` on `document.body` (set up via `guardBody` from `ln-core`) auto-inits new `[data-ln-nav]` elements and reacts to `data-ln-nav` attribute mutations via `attributeFilter`. The constructor's WeakMap guard prevents double-init when both the per-nav and global observers fire on the same node.

## URL normalization

Both `link.href` and `window.location.pathname` go through the same normalization: `new URL(href, location.href)`, then strip a trailing slash, falling back to `/` for root. The match rule then is:

- **Exact**: `normalizedHref === normalizedCurrent`
- **Parent** (default): `!exact && normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/')`

Root (`/`) is excluded from the parent rule so it does not match every URL. A trailing-slash-only `href` is treated identically to the slash-less form.

## Active state

When a link matches (exact or parent), `_updateActiveState` applies:
1. `link.classList.add(activeClass)` — the configured CSS class.
2. `link.setAttribute('aria-current', 'page')` — accessibility marker.

When a link does not match: class is removed and `link.removeAttribute('aria-current')` is called explicitly (clearing any stale value from a previous navigation).

## Exact opt-out (`data-ln-nav-exact`)

`_initializeNav` reads `navElement.hasAttribute('data-ln-nav-exact')` once at construction and closes over the boolean `exact`. Every `_updateActiveState` call receives `exact`; when true, the `isParent` branch is bypassed (only `isExact` matches). The attribute is read once — changing it after init has no effect until the nav element is destroyed and re-initialized.

## Destroy

`element.lnNav.destroy()` performs:

1. `observer.disconnect()` — stop watching the nav subtree.
2. Remove the per-instance `popstate` listener.
3. Splice the instance's update callback out of the shared `_pushStateCallbacks` array (other instances on the page keep working).
4. Delete the WeakMap registry entry.
5. `delete element[DOM_ATTRIBUTE]`.

The singleton `history.pushState` patch is NOT reverted by destroy — it is idempotent and harmless once no callbacks remain.
