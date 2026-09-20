# ln-picklist

> Applied to a container (`data-ln-picklist`) wrapping `<ul data-ln-picklist-list="available">` and `<ul data-ln-picklist-list="selected">`.
> It listens for native `change` events on child `<input type="checkbox">`: when `checked` is true, it moves the parent `<li>` via
> `appendChild` into the `selected` list; when unchecked, it returns it to `available`. Native checkboxes drive both DOM placement
> and form submission (`name`/`value`) with zero hidden inputs or state mirrors.

---

## 🧭 Philosophy & Architecture

One parent element (the root) carries the component. It listens for `change`;
checking an item moves it to the other list, unchecking returns it. That is the
entire mechanism — there is no second act.

Why it is worth having at all: `<select multiple>` is hostile: ctrl-clicking,
no room to see what you picked, and a scroll position that eats your selection.
A picklist puts the pool on the left and the choices on the right, both fully
visible.

The component itself is deliberately tiny. **The checkbox is the state.** Its
`checked` property and the list the `<li>` currently sits in are the same fact,
and `name` / `value` carry the selection to the server natively — unchecked
boxes are simply not submitted. So there are no hidden inputs, no state
attribute and no JS mirror to keep in sync.

Everything else composes:

| Want | Use |
|---|---|
| Filtering a long list | [`ln-search`](../ln-search/README.md) on each `<ul>` |
| Counts, empty states, "select all" | Your page or a project coordinator |
| Drag-and-drop ordering | [`ln-sortable`](../ln-sortable/README.md) |

---

## 📦 Minimal Blueprint

```html
<section data-ln-picklist>
	<ul data-ln-picklist-list="available">
		<li>
			<label>
				<input type="checkbox" name="countries[]" value="de">
				Germany
			</label>
		</li>
		<li>
			<label>
				<input type="checkbox" name="countries[]" value="fr">
				France
			</label>
		</li>
	</ul>

	<ul data-ln-picklist-list="selected"></ul>
</section>
```

On initialization, `ln-picklist` automatically scans all items and transfers any checked
checkbox (`<input type="checkbox" checked>`) into the `selected` list. All items can be
authored in the `available` pool from backend templates, leaving `selected` initially
empty. On form reset, both lists are automatically re-synchronized with `defaultChecked`.

### With search on both lists

`ln-picklist` has no search of its own. Point an `ln-search` control at each
list's `id` and it hides non-matching `<li>` children for free:

```html
<section data-ln-picklist>
	<section>
		<h3 id="pool-h">Available</h3>

		<search aria-label="Search available">
			<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
			<input type="search" data-ln-search-for="pool" placeholder="Search…">
			<button type="button" data-ln-search-clear aria-label="Clear search">
				<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
			</button>
		</search>

		<ul data-ln-picklist-list="available" id="pool" data-ln-search="" aria-labelledby="pool-h">
			…
		</ul>
	</section>

	<section>
		<h3 id="picked-h">Selected</h3>
		<search aria-label="Search selected">
			<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
			<input type="search" data-ln-search-for="picked" placeholder="Search…">
			<button type="button" data-ln-search-clear aria-label="Clear search">
				<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
			</button>
		</search>

		<ul data-ln-picklist-list="selected" id="picked" data-ln-search="" aria-labelledby="picked-h">
			…
		</ul>
	</section>
</section>
```

The `change` event of that search input bubbles to the picklist root; the
component ignores it, because it only acts on checkboxes that live inside one
of its two lists.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Element | Values | Description |
|---|---|---|---|
| `data-ln-picklist` | Root | `""` \| `"disabled"` | Initializes the component. `"disabled"` blocks moving. |
| `data-ln-picklist-max` | Root | integer (e.g. `"5"`) | Maximum selection limit. Blocks further additions to `selected` and dispatches `ln-picklist:max-reached`. |
| `data-ln-picklist-list` | `<ul>` / `<ol>` | `available` \| `selected` | Marks which list is which. Both are required. |

There is no attribute on the item. It is found from the checkbox that changed.

### JS API

Accessed via `element.lnPicklist`:

| Helper | Signature | Description |
|---|---|---|
| `enable` | `()` | Allows moving (sets `data-ln-picklist=""`). |
| `disable` | `()` | Blocks moving (sets `data-ln-picklist="disabled"`). |
| `sync` | `()` | Synchronizes items between available/selected according to checkbox state. |
| `destroy` | `()` | Detaches listeners and cleans up the instance property. |

---

## ⚡ DOM Events

All events bubble from the root.

### `ln-picklist:max-reached`

Fires when an item move to `selected` is blocked because the `data-ln-picklist-max` limit has been reached. The checkbox is automatically reverted.

`detail`: `{ max, item, checkbox, count }`

### `ln-picklist:before-move`

Cancelable. Fires before the item moves. Calling `preventDefault()` aborts the
move **and reverts the checkbox**, so the DOM never contradicts itself.

`detail`: `{ item, from, to, checkbox }`

### `ln-picklist:move`

Fires after the item has been re-parented.

`detail`: `{ item, from, to, checkbox }`

### `ln-picklist:enabled` / `ln-picklist:disabled`

Fire when the root attribute crosses the `disabled` boundary.

`detail`: `{ target }`

### `ln-picklist:destroyed`

`detail`: `{ target }`

---

## ⚠️ Common Pitfalls

> [!CAUTION]
> 1. **Rendering a checked item on the left (or an unchecked item on the
>    right).** The component treats `checked` and list membership as one fact.
>    Mismatched markup stays mismatched until the user touches that checkbox.
> 2. **Omitting one of the two lists.** The component logs a warning and does
>    not attach its listener, rather than failing on the first click. With
>    `data-ln-debug` on `<body>` the diagnostic is drawn in place.
> 3. **Expecting a name on the item.** The submitted value is the checkbox's
>    own `name`/`value`. Give every checkbox the same array-style `name`
>    (`countries[]`) and a distinct `value`.
> 4. **Expecting the left list to keep its order.** An unchecked item is
>    appended to the end of the available list, not returned to its original
>    position.

---

## 🔧 Internals

### Target filtering

`change` bubbles, so anything composed inside the root reaches the listener.
It acts only when `e.target` resolves to a checkbox whose `<li>` sits directly
in one of the two known lists.

### Disabled

The browser toggles the checkbox before any listener runs, so when disabled the
component *reverts* the toggle rather than merely returning — otherwise the box
would read checked while the item stayed put.

### Focus

Re-parenting a node that holds focus blurs it to `<body>` in Chromium, so focus
is restored to the checkbox after the move — but only when it genuinely had
focus, so a synthetic `change` from a script cannot steal it.

### Attribute-driven enable/disable

`data-ln-picklist` is observed by the shared attribute observer; flipping it to
`"disabled"` and back emits the paired events. No re-initialization.

### Form reset

Resetting a form restores the controls **silently** — the spec fires no
`change` and no `input` for them, only `reset` on the form. So the change
handler never hears about it, and without help the items would sit in whichever
list the user left them while their boxes flipped back.

The component snapshots the authored placement at boot and re-appends each item
to the list it came from. The work is deferred with `setTimeout(…, 0)`, because
`reset` fires *before* the controls are restored, and skipped if another
listener cancelled the reset. Items the page has since removed are not
resurrected.

---

## 🎨 Styling

`@mixin picklist` lays the two lists out side by side and applies
`check-list-outline` to each — checkbox pills with a **visible, focusable**
input. `check-list` is deliberately not used: `@mixin pill` hides the input with
`display: none`, which would drop the control out of the tab order.
