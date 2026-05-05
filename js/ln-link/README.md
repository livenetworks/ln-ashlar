# ln-link

> Turns any container — a `<table>`, a list of cards, a generic
> `<article>` — into a click-navigable surface by triggering `.click()`
> on the first inner `<a>`. Hover shows the URL in a bottom-left status
> bar that mimics the browser's native preview. ~196 lines of JS that
> exist so tables stop requiring an anchor spanning the entire first
> cell just to make the row feel like a link.

## Philosophy

### The first `<a>` rule

The component's contract is simple: `row.querySelector('a')` — always
the first `<a>` in document order. Every feature, every edge case,
every cross-component implication flows from that single rule.

It is enough for the most common shapes: a table where the first cell
holds the record's name as a link, a card list where each card has one
`<a>` at the top, a generic article with a leading headline link. You
do not need to mark which anchor is "the primary one" — position in
the DOM is the contract. If you have two anchors in the same row, put
the one that should receive the row click first.

### Augmentation, not replacement

The component does NOT intercept the platform's link click. When a
user clicks the row chrome (cells, padding, dead zones), the component
resolves the first `<a>`, builds a synthetic click, and calls
`link.click()`. The platform then handles everything from that point
on — `target="_blank"` opens a new tab, `download` triggers a
download, `href="/path"` navigates, `[data-ln-ajax]` on an ancestor
lets `ln-ajax` intercept the resulting click via its own body
delegation. Nothing special is wired. The platform is the router.

This means you pay nothing to compose `ln-link` with other components.
`ln-ajax`, `target="_blank"`, middleware headers, browser
extensions — all of them see a real `click` event on a real `<a>` and
behave exactly as if the user had clicked the anchor directly.

### Interactive children stay interactive

Buttons, inputs, selects, textareas, and nested anchors inside the row
are skipped entirely. The click handler checks
`e.target.closest('a, button, input, select, textarea')` at line 33
and returns early if the click originated from or inside any of those
elements. The row click only fires when the user clicks on "the row
chrome" — the cells, padding, or empty space the row provides around
its interactive children.

A table row can hold a Delete button, a dropdown, and a checkbox
alongside the record link. All three remain independently interactive.
Clicking them does their own thing; clicking the row navigates.

### Status bar = native browser feel

When the user hovers a link-enabled row, the component shows the
resolved `href` in a fixed `<div class="ln-link-status">` at the
bottom-left of the screen — the same position and visual shape as the
browser's own URL preview bar. This is cosmetic but meaningful: it
sets the user's expectation that the row IS a link before they click.
The element is created once at page init (`_createStatusBar`) and
lives for the page lifetime.

Styling lives in `@mixin link-status` in
`scss/config/mixins/_link.scss`, applied by `scss/components/_link.scss`
to `.ln-link-status`. Override that mixin on a project-scope selector
to restyle.

### Three modes, one component

The container's `tagName` at init time determines how rows are found:

- **`TABLE`** — the component finds the `<tbody>` (or falls back to
  the table itself if no `<tbody>` exists), iterates its `<tr>`
  elements, and initializes each row individually.
- **`TBODY`** — the same row iteration, but you placed the attribute
  on the `<tbody>` directly rather than the `<table>`.
- **Anything else** — the element itself becomes the single clickable
  row. `data-ln-link` on a `<li>`, `<article>`, or `<div>` means that
  whole element is the click target.

All three modes share the same per-row listener attachment
(`_initRow`), the same interactive-child skip-list, and the same
status bar.

## HTML contract

### Table — all tbody rows become clickable

```html
<table data-ln-link>
	<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>Status</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><a href="/users/1">Marko Petrovski</a></td>
			<td>marko@example.com</td>
			<td><span class="badge success">Active</span></td>
			<td>
				<!-- This button is skipped — clicking it does NOT navigate -->
				<button>Delete</button>
			</td>
		</tr>
		<tr>
			<td><a href="/users/2">Ana Stojanova</a></td>
			<td>ana@example.com</td>
			<td><span class="badge error">Inactive</span></td>
			<td>
				<button>Delete</button>
			</td>
		</tr>
	</tbody>
</table>
```

Apply `link-row` mixin to the rows for `cursor: pointer` and
`user-select: none`:

```scss
// project SCSS
#users-table tr { @include link-row; }
```

### List of cards

```html
<ul data-ln-link>
	<li>
		<a href="/projects/1"><h3>Project Alpha</h3></a>
		<p>Launched 2025. Click anywhere on this card to open.</p>
	</li>
	<li>
		<a href="/projects/2"><h3>Project Beta</h3></a>
		<p>In progress. Buttons inside cards are still independently clickable.</p>
		<button>Archive</button>
	</li>
</ul>
```

In `<ul>` mode, each `<li>` is a row. The component iterates them
exactly as it iterates `<tr>` elements in table mode.

### Generic article

```html
<article data-ln-link>
	<h4><a href="/posts/42">Dashboard overview</a></h4>
	<p>The entire article is clickable — not just the link text.</p>
</article>
```

In generic mode the `<article>` itself is the row. No children are
iterated; a single set of listeners attaches to the element.

### Direct `<tr>` — one row only

```html
<table>
	<tbody>
		<tr data-ln-link>
			<!-- Only this row is navigable; the others are plain rows -->
			<td><a href="/users/99">Special row</a></td>
		</tr>
		<tr>
			<td>Plain row — not navigable</td>
		</tr>
	</tbody>
</table>
```

Placing `data-ln-link` on a `<tr>` directly puts it in generic mode
(the `TR` branch in `_initContainer`) so the row itself becomes the
single clickable element. Useful when only a subset of rows should be
navigable.

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-link` | `<table>`, `<tbody>`, `<tr>`, or any element | Activates clickable-row behavior. On `<table>` or `<tbody>`, every `<tr>` in the `<tbody>` becomes individually navigable. On any other element, the element itself is the row. |

## Events

| Event | Bubbles | Cancelable | `detail` | Dispatched on |
|---|---|---|---|---|
| `ln-link:navigate` | yes | yes | `{ target, href, link }` | The row element |

The event is dispatched at line 46, BEFORE `link.click()` is called.
`detail.target` is the row element, `detail.href` is the resolved
href string, and `detail.link` is the `<a>` element. Calling
`e.preventDefault()` in your listener stops navigation entirely.

The event does NOT fire on the modifier-key path (Ctrl+click,
Cmd+click, middle-click). That path calls `window.open(href, '_blank')`
directly and returns (line 41–44), bypassing the event dispatch
entirely.

```js
// Log navigation
document.querySelector('table[data-ln-link]').addEventListener('ln-link:navigate', function (e) {
	analytics.track('row_click', { href: e.detail.href });
	// Don't call e.preventDefault() — navigation continues normally.
});

// Conditional cancel — e.g. prevent navigation while a form is dirty
document.addEventListener('ln-link:navigate', function (e) {
	if (formIsDirty) {
		e.preventDefault();
		showUnsavedWarning(e.detail.href);
	}
});

// Workaround for ln-confirm composition — see Cross-component section
document.addEventListener('ln-link:navigate', function (e) {
	e.preventDefault();
	openConfirmDialog(e.detail.href);
});
```

## JS API

```js
// Re-scan root for [data-ln-link] containers and initialize them.
// The MutationObserver handles most dynamic insertion automatically;
// call this manually only for Shadow DOM roots or other contexts
// the observer cannot see.
window.lnLink.init(root);

// Clean up event listeners on a single container.
// Operates on the PASSED container only — does NOT traverse descendants.
// To destroy multiple containers, loop them yourself.
window.lnLink.destroy(container);
```

**Asymmetry note.** `init(root)` traverses all descendants of `root`
looking for `[data-ln-link]` containers and initializes each one.
`destroy(container)` is the inverse of `_initContainer` — it cleans
up the single passed container and all its current rows. It does NOT
look for nested `[data-ln-link]` inside the container. If you have
nested link containers, call `destroy` on each separately.

The `window.lnLink` registration uses the legacy direct-assignment
form (`window[DOM_ATTRIBUTE] = { init, destroy }`). See
`docs/js/link.md` for context on the registration pattern and the
migration backlog.

## What it does NOT do

- **Does NOT intercept clicks on the `<a>` itself.** Clicks directly
  on the anchor follow the platform default without going through
  `_handleClick`. The row click is an additional surface; it does not
  replace the link.
- **Does NOT fire `ln-link:navigate` on the modifier-key path.**
  Ctrl+click / Cmd+click / middle-click call `window.open` and return
  immediately (line 41–44). The event is not dispatched; the consumer
  cannot cancel modifier-key navigation via the event.
- **Does NOT re-check anchor-less rows on subsequent `init()` calls.**
  Rows without an `<a>` at init time are silently skipped — but the
  `lnLinkRow` flag IS set on them at the start of `_initRow` (before
  the anchor lookup). They will NOT be re-checked on a subsequent
  `init()` call. To wire a row after adding its anchor dynamically,
  call `destroy(container)` then `init(container)`.
- **Does NOT update the status bar if `href` is empty.** Line 57–58
  guards `_showStatus` — if `link.getAttribute('href')` returns an
  empty string, the status bar stays hidden. Same guard in
  `_handleClick` at line 38–39 prevents navigation from firing.
- **Does NOT wire keyboard navigation.** The row element is not made
  focusable. Keyboard users tab to the inner `<a>` directly and
  activate it with Enter or Space as normal. If you need keyboard
  users to interact with the whole row, add `tabindex="0"` and a
  `keydown` handler yourself (not in scope for this component).
- **Does NOT set `cursor: pointer` or `user-select: none`.** That is
  the `link-row` SCSS mixin (`scss/config/mixins/_link.scss`) applied
  via `scss/components/_link.scss`. JS owns behavior; SCSS owns
  appearance.
- **Does NOT respect `aria-disabled` on the row or the `<a>`.**
  A disabled-looking link is still triggered by the row click if
  `href` is non-empty. Gate via the `ln-link:navigate` event and
  `e.preventDefault()` if conditional navigation is needed.
- **Does NOT track a "first vs subsequent" `<a>`.** The component
  always calls `row.querySelector('a')` at click time, which returns
  the first anchor in document order. Multiple anchors in one row
  means only the first is reachable via the row click; the rest are
  reachable only by clicking them directly.

## Cross-component composition

### With ln-ajax

`ln-link` and `ln-ajax` compose without any wiring. `ln-link`
triggers `link.click()` on the inner `<a>`; `ln-ajax` listens for
`click` events at the body via event delegation and intercepts
qualifying anchor clicks. The `link.click()` call produces a real
`click` event on a real `<a>`, so `ln-ajax` sees it exactly as if the
user had clicked the link directly.

```html
<!-- ln-ajax wraps the table; ln-link is on the table itself -->
<section data-ln-ajax>
	<table data-ln-link>
		<thead>
			<tr><th>Name</th><th>Email</th></tr>
		</thead>
		<tbody>
			<tr>
				<td><a href="/users/1" data-ln-ajax-target="main">Marko</a></td>
				<td>marko@example.com</td>
			</tr>
		</tbody>
	</table>
</section>
```

No special configuration. The `data-ln-ajax-target` attribute on the
`<a>` is respected because `ln-ajax` is processing the click on the
real anchor, not on the row.

### With ln-confirm

`ln-confirm` does NOT compose cleanly with `ln-link`. `ln-confirm`
attaches to a `<button>` and intercepts its clicks; `ln-link` triggers
a `.click()` on an `<a>`. There is no shared click event for
`ln-confirm` to intercept.

If you need a confirmation step before row navigation, the workaround
is to intercept `ln-link:navigate`, call `e.preventDefault()`, and
then run your own confirm flow (an `ln-modal` or a custom dialog):

```js
document.querySelector('#users-table').addEventListener('ln-link:navigate', function (e) {
	e.preventDefault();
	const href = e.detail.href;

	// Open a confirmation modal, then navigate programmatically on accept.
	openConfirmModal('Go to this record?', function () {
		window.location.href = href;
	});
});
```

### With ln-data-table

`ln-data-table` renders rows into a `<tbody>` from a `<template>`
using `renderList` — rows that did not exist at page load appear
later as the component populates. Adding `data-ln-link` on the
`<table>` works because `ln-link`'s MutationObserver watches for
added `<tr>` nodes (line 154–157): when a new `<tr>` is inserted whose
closest `[data-ln-link]` ancestor is the table, `_initRow` is called
on that node immediately.

```html
<table data-ln-link data-ln-table>
	<thead>...</thead>
	<tbody>
		<!-- ln-data-table inserts <tr> elements here dynamically;
		     ln-link's MutationObserver picks them up automatically. -->
	</tbody>
</table>
```

No manual re-init call needed after `ln-data-table` populates the
body.

## Common mistakes

1. **Placing `data-ln-link` on `<thead>` or a header `<tr>` and
   wondering why nothing happens.** Table mode (line 120) always
   operates on the `<tbody>`. The `<thead>` is never iterated; header
   rows never receive listeners. If you place the attribute on a `<tr>`
   that is inside a `<thead>`, it will be treated as generic mode (the
   `<tr>` is the container and the row simultaneously), but that is
   almost never the intended shape.

2. **Forgetting the "first `<a>`" contract when multiple links share a
   row.** An "Edit" link in cell 1 and a "View" link in cell 2 means
   the row click goes to "Edit," not "View." Reorder the cells if the
   intended primary action is "View."

3. **Wrapping the row in `<div data-ln-link>` outside a table and
   expecting table behavior.** A `<div>` with `data-ln-link` uses
   generic mode — the `<div>` is the row. This is correct if the
   `<div>` is your card container. It is unexpected if you assumed the
   component would find all child `<div>` elements and treat each as a
   row. Generic mode: element = row. Table mode: tbody `<tr>` = row.

4. **Calling `window.lnLink.destroy(table)` after the table's
   `<tbody>` innerHTML was replaced.** Destroy iterates the container's
   current rows to detach listeners. If you have already replaced
   `innerHTML`, the original row elements — still holding the listeners
   — are gone from the DOM but have not been cleaned up. Call
   `destroy(table)` BEFORE replacing the inner HTML, then re-init
   after.

5. **Expecting the hover status bar to suppress on touch devices.**
   There is no touch-detection guard. On touch browsers,
   `mouseenter`/`mouseleave` still fire on tap-and-hold, and the
   status bar can flash briefly. This is an acceptable trade-off; no
   touch shim is shipped.

6. **Trying to override the status bar element via JS.** There is no
   API to replace the `<div class="ln-link-status">` element created
   at init. It is created once and reused. To restyle it, override
   `@mixin link-status` on a project-scope selector, or add CSS rules
   targeting `.ln-link-status` directly.

7. **Nesting two `data-ln-link` elements where one is inside the
   other.** Both initialize independently. A row click on the inner
   container also bubbles up to the outer container's rows. Use one
   `data-ln-link` per logical navigable scope; do not nest them.

8. **Expecting `init(container)` to wire rows you added an anchor to
   AFTER the original init pass.** Anchor-less rows still received
   `lnLinkRow = true` at line 69 of `_initRow` — before the line 71
   anchor check. The early-return at line 68 fires on every subsequent
   `_initRow` call for those rows. Re-init is a no-op for them. To
   re-wire, call `destroy(container)` then `init(container)` so the
   flag is cleared and the row is re-evaluated.

## Edge cases

- **Empty `<tbody>` at page load.** No rows are initialized because
  there are none to iterate. The MutationObserver watches for new
  `<tr>` additions and initializes each as it arrives. No manual
  re-init is needed if rows arrive via AJAX or `ln-data-table`.

- **`<a href="">` (empty href).** Line 38–39 in `_handleClick` reads
  `link.getAttribute('href')` and returns early if the value is empty.
  Line 57–58 in `_handleMouseEnter` also guards the status bar display.
  An anchor with an empty href is silently ignored — no navigation, no
  status bar.

- **`<a href="#section">` (fragment link).** Fragment navigation works
  identically. `link.click()` runs the platform's anchor scroll.
  `ln-link:navigate` fires with `href="#section"` so consumers can
  intercept or log it.

- **Detached then re-attached element.** The `lnLinkInit` and
  `lnLinkRow` flags are DOM properties on the element objects — they
  persist across detach/re-attach cycles because the same element
  object is re-inserted. Listeners do NOT get re-bound on
  re-attachment. If you need fresh wiring after re-insertion (e.g.,
  you cloned the element), call `window.lnLink.destroy(root)` first,
  then `window.lnLink.init(root)`.

- **Form inside the row.** Clicks on `<input>`, `<select>`, and
  `<textarea>` inside a row are excluded by the `closest(...)` skip
  list at line 33. `<button>` elements (including `type="submit"`)
  are also in the skip list. Typing, selecting, or submitting a form
  embedded in a row does not trigger row navigation.

- **Nested `<table data-ln-link>` inside another `<table data-ln-link>`.** Both
  tables initialize independently. Each inner row's click handler is
  attached directly to the `<tr>` via `addEventListener` — the event
  does NOT bubble up to the outer table's rows in a way that triggers
  a second navigation. (Clicking an inner row dispatches `ln-link:navigate`
  on the inner row; the outer table's rows only receive clicks from
  their own click handlers, not from inner-row bubbling.)

## See also

- [`../../docs/js/link.md`](../../docs/js/link.md) — architecture mirror (internal state, observer topology, click-flow, registration pattern)
- [`../../docs/js/ajax.md`](../../docs/js/ajax.md) — ln-ajax interop details
- [`../../scss/config/mixins/_link.scss`](../../scss/config/mixins/_link.scss) — `link-row` and `link-status` mixins
- [`../../demo/admin/src/pages/link.html`](../../demo/admin/src/pages/link.html) — interactive demo
