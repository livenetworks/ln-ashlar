# ln-link

> Turns a container into a click-navigable surface by triggering
> `.click()` on the first inner `<a>`. Hover surfaces the URL in a
> bottom-left status bar that mirrors the browser's native preview.

## Philosophy

### The first `<a>` rule

The contract is `row.querySelector('a')` — the first `<a>` in document
order. A table row whose primary action is "View" puts the View link
in cell 1. The component does not consult a `data-primary` attribute
or any other hint; position IS the contract.

### Augmentation, not replacement

The component does not intercept the platform's link click. When the
row chrome is clicked, the component resolves the first `<a>` and
calls `link.click()` — the platform handles everything from there:
`target="_blank"`, `download`, `[data-ln-ajax]` body delegation,
browser extensions. Composing with other components costs nothing.

### Interactive children stay interactive

Buttons, inputs, selects, textareas, and nested anchors inside a
row are skipped — clicks originating from those elements never
trigger row navigation. A row can carry a Delete button, a
dropdown, and a checkbox alongside the record link without
collision.

### Three modes, one component

The container's `tagName` decides how rows are found:

- **`<table>`** — the component finds the `<tbody>` (or falls back
  to the table itself if no `<tbody>` exists), iterates each `<tr>`,
  wires each row.
- **`<tbody>`** — same row iteration; you placed the attribute one
  level lower.
- **Anything else** (`<li>`, `<article>`, `<tr>`, `<div>`) — the
  element itself is the single clickable row.

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

The event is dispatched BEFORE `link.click()` is called.
`detail.target` is the row element, `detail.href` is the resolved
href string, `detail.link` is the `<a>` element. Calling
`e.preventDefault()` stops navigation entirely.

The event does NOT fire on the modifier-key path (Ctrl+click,
Cmd+click, middle-click). That path calls `window.open(href, '_blank')`
directly and bypasses the event dispatch.

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
```

## JS API

```js
// Re-scan a root for [data-ln-link] containers and initialize them.
// Called automatically on DOMContentLoaded and by the MutationObserver.
// Call manually only for Shadow DOM roots the observer cannot see.
window.lnLink.init(root);

// Clean up listeners on a single container.
// Operates on the PASSED container only — does NOT traverse descendants.
// To destroy multiple containers, call destroy on each separately.
window.lnLink.destroy(container);
```

`init` traverses descendants; `destroy` does not. See
[`docs/js/link.md`](../../docs/js/link.md) for the full mechanics
behind this asymmetry.

## What it does NOT do

- **Does not intercept clicks on the `<a>` itself.** Direct anchor
  clicks follow the platform default. The row click is an additional
  surface, not a replacement.
- **Does not fire `ln-link:navigate` on the modifier-key path.**
  Ctrl/Cmd+click and middle-click call `window.open` directly; the
  event is not dispatched and cannot be cancelled.
- **Does not re-check anchor-less rows on subsequent `init()`
  calls.** A row without an `<a>` at init time still receives the
  per-row guard flag, so re-init is a no-op. To wire a row after
  adding its anchor dynamically, call `destroy(container)` then
  `init(container)`.
- **Does not wire keyboard navigation.** The row element is not
  made focusable. Keyboard users tab to the inner `<a>` and
  activate it normally.
- **Does not own appearance.** `cursor: pointer` and
  `user-select: none` come from `@mixin link-row`
  (`scss/config/mixins/_link.scss`); the status bar styling comes
  from `@mixin link-status`. JS owns behavior; SCSS owns
  appearance.

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

`ln-confirm` attaches to a `<button>` and intercepts that button's
click; `ln-link` triggers `.click()` on an `<a>`. There is no shared
click event for `ln-confirm` to intercept.

For confirmation flows on row navigation, use `ln-link:navigate`
with `e.preventDefault()` instead — see §Events.

### With ln-table

`ln-table` inserts `<tr>` elements into a `<tbody>` from a
template. `ln-link`'s MutationObserver wires each new row as it
arrives — no manual re-init is needed after `ln-table`
populates the body.

```html
<table data-ln-link data-ln-table>
	<thead>...</thead>
	<tbody>
		<!-- ln-table inserts <tr> elements here dynamically;
		     ln-link wires them automatically. -->
	</tbody>
</table>
```

## Integration & Development

### Integration

To integrate `ln-link` into your application, you can choose between loading the unified bundle or importing the component standalone.

#### In-Bundle (Standard Integration)
This is the recommended approach for standard integration, loading the component as part of the main `ln-ashlar` bundle:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### Standalone (Zero-Dependency IIFE)
If you only need this component and want to avoid loading the full bundle, you can load it standalone using its zero-dependency compiled IIFE:
```html
<script src="js/ln-link/ln-link.js" defer></script>
```

### Source Files

- **Active Development (Source of Truth)**: [js/ln-link/src/ln-link.js](file:///c:/laragon/www/ln-ashlar/js/ln-link/src/ln-link.js)
- **Compiled Standalone Distribution**: [js/ln-link/ln-link.js](file:///c:/laragon/www/ln-ashlar/js/ln-link/ln-link.js)

## See also

- [`../../docs/js/link.md`](../../docs/js/link.md) — architecture mirror (internal state, observer topology, click-flow, registration pattern)
- [`../../docs/js/ajax.md`](../../docs/js/ajax.md) — ln-ajax interop details
- [`../../scss/config/mixins/_link.scss`](../../scss/config/mixins/_link.scss) — `link-row` and `link-status` mixins
- [`../../demo/admin/src/pages/link.html`](../../demo/admin/src/pages/link.html) — interactive demo
