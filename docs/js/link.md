# Link

Turns containers into click-navigable surfaces by triggering `.click()` on
the first inner `<a>`. Hover shows a bottom-left status bar mirroring the
browser's native URL preview. File: `js/ln-link/ln-link.js` (~196 lines).

## Imports

The component imports only `dispatchCancelable` and `guardBody` from `../ln-core`.
It does not use `dispatch`, `findElements`, `cloneTemplate`, `renderList`, or any
template helper from `js/ln-core/helpers.js`. See `js/ln-core/helpers.js` for
source definitions.

- `dispatchCancelable` — dispatches `ln-link:navigate` as a cancelable
  `CustomEvent` and returns the event object so the caller can check
  `defaultPrevented`.
- `guardBody` — defers observer registration until `document.body` is
  available, regardless of script-load order.

## State surface

### Module-level

`_statusEl` (line 11) — a single `HTMLElement` reference to the
`<div class="ln-link-status">` appended to `document.body` at first
`_initializeAll` call. Shared across all `[data-ln-link]` containers on the
page. Never destroyed. `null` until `_createStatusBar` runs.

No Proxy. No reactive batcher. No internal store. This is a
listener-attachment component.

### Per-container DOM flags

`container.lnLinkInit` (boolean) — set at line 115 once
`_initContainer` completes its row iteration. Prevents double-init on
the same container (early return at line 114). Deleted by
`_destroyContainer` (line 108) so re-init after destroy works.

### Per-row DOM flags

Each row that passes `_initRow` receives:

- `row.lnLinkRow` (boolean, line 69) — marks the row as wired. Guards
  the early return at line 68 so re-running `_initRow` on an already-
  initialized row is a no-op.
- `row._lnLinkClick` (function ref, line 73) — the per-row closure over
  `_handleClick(row, e)`. Stored so `removeEventListener` receives the
  exact same reference at destroy time.
- `row._lnLinkEnter` (function ref, line 76) — the per-row closure over
  `_handleMouseEnter(row)`. Same cleanup contract.

`_handleMouseLeave` is a module-level function with no closure, so it is
passed directly to both `addEventListener` and `removeEventListener` without
needing to be stored per-row.

## Init topology

`_initContainer(container)` (line 113) branches on `container.tagName`:

- **`TABLE`** (line 119) — finds `container.querySelector('tbody')`. If no
  `<tbody>` exists, falls back to the table element itself (line 120).
  Iterates all `<tr>` elements inside that element via `querySelectorAll('tr')`,
  calls `_initRow` on each.
- **`TBODY`** (line 119) — the container IS the tbody. Same `querySelectorAll('tr')`
  iteration → `_initRow` on each.
- **Anything else** (line 125) — `_initRow(container)`. The element
  itself is treated as the single navigable row.

`_initRow(row)` (line 67):

1. Early return if `row.lnLinkRow` is already set (line 68).
2. Set `row.lnLinkRow = true` immediately (line 69). The flag is set at
   `ln-link.js:69` — line 69 BEFORE the anchor check at line 71. A row
   with no `<a>` still receives `lnLinkRow = true`, so `_initRow` will
   not re-process it even if an anchor is added later. Re-wiring requires
   `destroy(container)` + `init(container)`.
3. If `row.querySelector('a')` returns null (line 71), return early
   — no listeners attached.
4. Create and store the per-row closures (lines 73–78).
5. Attach three listeners: `click` → `_lnLinkClick`, `mouseenter` →
   `_lnLinkEnter`, `mouseleave` → `_handleMouseLeave` (lines 80–82).

## Local `findElements`

`findElements(root)` (line 132) is a local function, NOT the `findElements`
helper from `ln-core`. The inline code comment at line 131 says explicitly:

> Local findElements — intentional divergence from ln-core helper: invokes
> `_initContainer` (function, flag-based) and processes child rows.

The ln-core `findElements` helper expects a simple init function that takes
one element. `ln-link`'s equivalent must:

1. Check if `root` itself carries the attribute (line 133–135) and call
   `_initContainer` on it.
2. Also iterate `root.querySelectorAll('[data-ln-link]')` (line 137) to
   find nested containers.

Both steps call `_initContainer`, not a simple per-element callback.
The ln-core helper's signature does not accommodate this dual-path
pattern, so the function lives inline.

## MutationObserver

The observer (line 147) is registered inside `guardBody` to ensure
`document.body` exists. It watches `document.body` with `childList: true,
subtree: true, attributes: true, attributeFilter: ['data-ln-link']`.

Two mutation branches:

### `childList` branch (line 149)

For each added element node (`nodeType === 1`), run `findElements(node)`.
This handles: a new `[data-ln-link]` table injected via AJAX, a new
`<li>` added to a `[data-ln-link]` list, etc.

**Special case for `<tr>` (lines 154–157):** if the added node's tagName
is `'TR'`, walk up to the nearest `[data-ln-link]` ancestor via
`node.closest('[data-ln-link]')`. If found, call `_initRow(node)` on
the newly added row directly. This handles the `ln-data-table` / `ln-ajax`
append-row case where `ln-data-table` inserts `<tr>` elements into an
existing `[data-ln-link]` table — `findElements(node)` alone would not
catch it because a `<tr>` is not a `[data-ln-link]` container.

### `attributes` branch (line 160)

Fired when `data-ln-link` is added or changed on any element (the
`attributeFilter` limits this to only that attribute). Re-runs
`findElements(mutation.target)` so dynamically setting
`element.setAttribute('data-ln-link', '')` initializes the element
without a manual `window.lnLink.init` call.

## Click handler decision tree

`_handleClick(row, e)` (line 32):

1. **Interactive-child check** (line 33): if `e.target.closest('a, button, input, select, textarea')` returns truthy, return immediately. The click originated from inside an interactive element; do not intercept.
2. **Anchor resolution** (line 35): `row.querySelector('a')`. If null, return.
3. **Href check** (line 38–39): `link.getAttribute('href')`. If empty string or null, return.
4. **Modifier-key / middle-click check** (line 41–43): if `e.ctrlKey || e.metaKey || e.button === 1`, call `window.open(href, '_blank')` and return. No event is dispatched on this path.
5. **Dispatch** (line 46): `dispatchCancelable(row, 'ln-link:navigate', { target: row, href, link })`. The event fires on the row and bubbles.
6. **Cancel check** (line 47): if `before.defaultPrevented`, return. Consumer called `e.preventDefault()`.
7. **Navigate** (line 48): `link.click()`. The platform handles everything from here — `ln-ajax`, `target="_blank"`, native navigation.

## Status bar lifecycle

`_createStatusBar()` (line 13) runs once inside `_initializeAll` (line 186),
before `_domObserver()` and `constructor(document.body)`. It creates a single
`<div class="ln-link-status">` and appends it to `document.body`. The element
lives for the page lifetime; it is never removed, even if all `[data-ln-link]`
containers are destroyed.

`_showStatus(url)` (line 19): called on `mouseenter`. Sets `_statusEl.textContent`
to the href string and adds the `ln-link-status--visible` class. CSS handles
the fade-in via `transition: opacity` in `@mixin link-status`.

`_hideStatus()` (line 25): called on `mouseleave`. Removes the visible class.
The text content is left as-is (overwritten on the next `_showStatus`).

The empty-href guard at line 57–58 means `_showStatus` is only called when
`href` is non-empty. No status bar flash for anchor-less rows.

## Cleanup contract

`_destroyContainer(container)` (line 95):

1. Early return if `container.lnLinkInit` is not set (line 96). Prevents
   double-destroy.
2. Branches on `tagName` identically to `_initContainer`: `TABLE`/`TBODY`
   → iterate `<tr>` in the tbody, call `_destroyRow` on each; else →
   `_destroyRow(container)`.
3. Deletes `container.lnLinkInit` (line 108).

`_destroyRow(row)` (line 85): removes the three event listeners using the
stored refs, deletes all three properties from the row, deletes `lnLinkRow`.

**Asymmetry:** `window.lnLink.init(root)` traverses all descendants of
`root` looking for `[data-ln-link]` containers. `window.lnLink.destroy(container)`
operates on ONE container — the exact element passed. It does not traverse
descendants. To destroy multiple containers, call `destroy` on each
separately.

**Destroy before innerHTML swap.** If you replace a container's `innerHTML`
before calling `destroy`, the original `<tr>` elements (which hold the
listeners) are detached from the DOM and the destroy loop iterates the NEW
rows, which have no listeners. The old listeners leak. Always call
`destroy(container)` first, then replace innerHTML, then re-init.

## Registration pattern (legacy)

`ln-link` uses the pre-`registerComponent` direct assignment pattern:
`window.lnLink = { init: constructor, destroy: _destroyContainer }`.

This is the pre-`registerComponent` pattern. At the time of writing,
`ln-link` is on the migration backlog alongside:
`ln-ajax`, `ln-external-links`, `ln-nav`, `ln-progress`, `ln-toast`,
`ln-table-sort`, `ln-upload` (the 8-component legacy cohort).

Commit `2ae1a37 refactor(js): migrate 4 legacy components to registerComponent`
migrated four of that cohort but not `ln-link`. The behavior is equivalent
— `registerComponent` is a de-duplication of the boilerplate: double-load
guard, `window[name]` assignment, MutationObserver registration, and
DOMContentLoaded handling. `ln-link` implements all of these manually and
correctly; the migration is purely a code-hygiene improvement.

## What re-binds vs what stays static

**Static (created or set once, never re-created):**

- `_statusEl` — created once in `_createStatusBar`, lives for the page.
- The `MutationObserver` instance — created once in `_domObserver`.
- The double-load guard (`window[DOM_ATTRIBUTE] !== undefined` at line 7).
- `window.lnLink` — assigned once at line 183.

**Per-init pass (set or cleared for each container/row):**

- `container.lnLinkInit` — set on init, deleted on destroy.
- `row.lnLinkRow` — set on `_initRow`, deleted on `_destroyRow`.
- `row._lnLinkClick` — created as a closure on `_initRow`, deleted on
  `_destroyRow`.
- `row._lnLinkEnter` — same.
- Three `addEventListener` calls per row — detached symmetrically by
  `_destroyRow`.

## See also

- [`js/ln-link/README.md`](../../js/ln-link/README.md) — usage guide (attributes, events, API, HTML examples, common mistakes)
- [`docs/js/ajax.md`](ajax.md) — ln-ajax interop architecture
- [`scss/config/mixins/_link.scss`](../../scss/config/mixins/_link.scss) — `link-row` and `link-status` mixins
- [`demo/admin/src/pages/link.html`](../../demo/admin/src/pages/link.html) — interactive demo
