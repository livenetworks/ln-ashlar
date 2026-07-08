# Nav

Active link tracking for navigation. File: `js/ln-nav/src/ln-nav.js`.

## Integration with ln-core

`ln-nav` is implemented as a standard component registered via `registerComponent` from `ln-core`:

```javascript
registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-nav', {
	extraAttributes: ['data-ln-nav-exact'],
	onAttributeChange: _syncAttribute
});
```

The core framework handles DOM instantiation, body guarding, lifecycle teardown, and attribute change observations.

## Singleton pushState patch

`history.pushState` is monkey-patched once per page, guarded by `history._lnNavPatched`. Every `[data-ln-nav]` instance pushes its update handler (`this.updateHandler`) onto a shared `_pushStateCallbacks` array; the patched `pushState` invokes them all after delegating to the original. There is no `popstate`-via-`pushState` synthesis — both events are wired explicitly. This is the only mechanism that catches URL changes performed by ln-ajax (or any other library calling `pushState`).

## MutationObserver childList tracking

Each instance sets up a local `MutationObserver` watching for `childList` and `subtree` changes on its own container DOM node. If elements are inserted or removed (e.g. dynamic menus rendered via AJAX), the observer triggers `this.update()` to refresh the active state of all anchor elements. 

## URL normalization

Both `link.href` and `window.location.pathname` go through the same normalization: `new URL(href, location.href)`, then strip a trailing slash, falling back to `/` for root.

### URL Filtering & Exclusions
To prevent false-positive active states, the following links are explicitly ignored:
- Hash-only links or anchor links (`href="#"`, `href="#section"`)
- Non-routable protocol links (`mailto:`, `tel:`, `javascript:`)
- External links targeting different hosts (`link.hostname !== window.location.hostname`)

### Matching Rules
The matching rules are:
- **Exact**: `normalizedHref === normalizedCurrent`
- **Parent** (default, bypassed if `data-ln-nav-exact` is present): `normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/')`

Root (`/`) is excluded from the parent rule so it does not match every URL.

## Active state & Custom Events

When `this.update()` runs, it performs the following sequence:

1. **Before Action**: Dispatches a cancelable `ln-nav:before-update` event. If `preventDefault()` is called on the event, the update is aborted.
2. **Apply state**: Updates the anchors:
   - Matching links: add `this.activeClass` CSS class, set `aria-current="page"`.
   - Non-matching links: remove `this.activeClass` CSS class, remove `aria-current`.
3. **After Action**: Dispatches a bubbling `ln-nav:update` event.

## Attribute Syncing (Attribute Bridge)

When attributes on the `<nav>` element are modified, the global observer invokes `_syncAttribute(el, attrName)`:
- `data-ln-nav` change: Clears the old active class from all anchor elements, updates the cached `activeClass` value, and calls `this.update()`.
- `data-ln-nav-exact` change: Updates the `exact` match flag and calls `this.update()`.

## Teardown

Upon element removal, the framework triggers `instance.destroy()` which:
1. Disconnects the local `MutationObserver` instance.
2. Removes the `popstate` event listener.
3. Splicing `this.updateHandler` out of the global `_pushStateCallbacks` array.
4. Dispatches the `ln-nav:destroyed` event.
