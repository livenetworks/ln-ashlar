# ln-key

`ln-key` binds one or more keyboard shortcuts to the natural DOM interaction of an existing target. It is a behavior primitive: it does not know about `ln-modal`, `ln-router`, `ln-toggle`, or any other Ashlar component.

## Basic usage

```html
<button type="button" data-ln-key="Ctrl+S">
	Save
</button>

<input
	type="search"
	name="search"
	data-ln-key="Ctrl+K Meta+K"
>
```

- A `<button>` or `<a href>` is activated with `click()`.
- An `<input>`, `<textarea>`, `<select>`, or editable element is activated with `focus()`.
- Other elements have no inferred action.

The target can be separate from the shortcut declaration:

```html
<span
	hidden
	data-ln-key="Ctrl+K, Meta+K"
	data-ln-key-target="#global-search"
></span>

<input id="global-search" type="search" name="search">
```

`data-ln-key-target` accepts a document-level CSS selector. The first matching element is used each time the shortcut is pressed, so a dynamically replaced target is resolved correctly.

## Grouped external shortcut map

An external map can add shortcuts to an existing application without modifying its controls:

```html
<ul data-ln-key-modifier="Ctrl">
	<li data-ln-key-for="#save">S</li>
	<li data-ln-key-for="#search">K</li>
	<li data-ln-key-for="#print">P</li>
</ul>

<ul data-ln-key-modifier="Alt">
	<li data-ln-key-for="#home">H</li>
	<li data-ln-key-for="#users">U</li>
</ul>
```

The nearest `data-ln-key-modifier` ancestor supplies the modifier context. Each `data-ln-key-for` item supplies exactly one key through its trimmed text content and points to the target with a document-level CSS selector.

For example, `Ctrl` + `S` becomes `Ctrl+S`, resolves `#save`, and then uses the same `click()`/`focus()` inference as host mode. A modifier-less map is also valid for keys such as `Escape` or `Enter`.

## Shortcut syntax

Shortcut names are case-insensitive and modifier order is normalized:

```html
<button type="button" data-ln-key="ctrl+s">Save</button>
<button type="button" data-ln-key="Shift+Ctrl+P">Commands</button>
<button type="button" data-ln-key="Escape Enter Space">Action</button>
```

Multiple shortcuts may be separated by whitespace or commas. Supported modifiers are `Ctrl`, `Alt`, `Shift`, and `Meta`. `Ctrl` is not automatically mapped to `Meta`; cross-platform shortcuts must declare both explicitly.

Common aliases such as `Esc`, `Return`, `Command`, `Cmd`, `Option`, and `Spacebar` are normalized.

## Editing protection

Shortcuts are ignored when the keyboard event starts inside an `input`, `textarea`, `select`, or editable element. This protects normal text editing and browser behavior.

Use the presence attribute only when a shortcut must remain active while editing:

```html
<button
	type="button"
	data-ln-key="Ctrl+S Meta+S"
	data-ln-key-allow-input
>
	Save
</button>
```

For an external map, the override can be placed on one item or inherited from the modifier container:

```html
<ul data-ln-key-modifier="Ctrl" data-ln-key-allow-input>
	<li data-ln-key-for="#save">S</li>
</ul>
```

## Attributes

| Attribute | Type | Description |
|---|---|---|
| `data-ln-key` | Shortcut list | Required. One or more keyboard combinations. |
| `data-ln-key-target` | CSS selector | Optional target; defaults to the declaration host. |
| `data-ln-key-modifier` | Modifier combination | Optional external-map context such as `Ctrl` or `Ctrl+Shift`. |
| `data-ln-key-for` | CSS selector | External-map item target; the item's text content supplies the key. |
| `data-ln-key-allow-input` | Presence | Allows the shortcut while the event originates in an editing control. |

## Events

| Event | Cancelable | Timing | Detail |
|---|---:|---|---|
| `ln-key:before-trigger` | Yes | After a usable target is resolved, before browser behavior is prevented | `{ source, target, action, key, event }` |
| `ln-key:trigger` | No | After `click()` or `focus()` | `{ source, target, action, key, event }` |
| `ln-key:destroyed` | No | When a declaration or its registration attribute is removed | `{ target }` |

Canceling `ln-key:before-trigger` leaves the original keyboard event untouched.

## Runtime rules

- `preventDefault()` runs only after a usable shortcut wins and the before-event is not canceled.
- Already-prevented, composing, and repeated keyboard events are ignored.
- Hidden, disabled, `aria-disabled="true"`, inert, missing, and non-interactive targets are skipped.
- Host declarations and external-map items share one DOM-order collision queue and one event contract.
- External-map modifier attributes and item text are resolved live, so markup updates do not require reinitialization.
- If multiple usable declarations match, the first one in DOM order wins. Debug mode emits a duplicate warning.
- Native `Enter`/`Space` activation is left to the browser when the matching button or link is already the keyboard event target.
- One shared document listener serves all instances and is removed when the final instance is destroyed.

## Build

The source is `src/ln-key.js`. The standard Ashlar build produces the standalone `ln-key.js` bundle automatically and includes the component in the master bundle through `js/index.js`.
