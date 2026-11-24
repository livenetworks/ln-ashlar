# ln-repeater

> Applied to a container (`data-ln-repeater="name"`) wrapping a list (`[data-ln-repeater-list]`), an add trigger (`[data-ln-repeater-add]` or external `[data-ln-repeater-add-for]`), and a `<template>` defining one row.
> It clones rows from the `<template>` on add, removes rows on per-row `[data-ln-repeater-remove]` clicks, enforces `min`/`max` bounds via native `disabled` state on triggers, substitutes `{index}`/`{index1}` placeholders, and hydrates from `ln-fill` payloads.
> Native form controls inside each row carry all field values and form submission directly — zero hidden inputs, zero JS row data mirrors, and zero coupling to sibling components (`ln-translations`, `ln-sortable`, `ln-validate`).

---

## Philosophy & Architecture

`ln-repeater` is a generic, DOM-first repeating row primitive for forms. It knows nothing about what inputs live inside a row — whether a row holds a single text input (e.g., select field options), a translatable field group (`data-ln-translatable`), or a multi-column parcel/line-item fieldset (`type`, `weight`, `quantity`).

Everything composes orthogonally:

| Need | Compose With |
|---|---|
| Multi-language fields per row | [`ln-translations`](../ln-translations/README.md) on the enclosing `<form>` + `data-ln-translatable` inside the template row |
| Drag-and-drop row ordering | [`ln-sortable`](../ln-sortable/README.md) on `[data-ln-repeater-list]` + `[data-ln-sortable-handle]` inside the row |
| Edit modal population / Create reset | [`ln-fill`](../ln-fill/README.md) + [`ln-form`](../ln-form/README.md) |
| Field validation | [`ln-validate`](../ln-validate/README.md) + native HTML5 `required` / `pattern` |

---

## Minimal Blueprint

### Single-Field Options (with `min="1"` auto-seed)

```html
<div data-ln-repeater="options" data-ln-repeater-min="1" data-ln-repeater-max="20">
	<ul data-ln-repeater-list></ul>

	<button type="button" data-ln-repeater-add>Add option</button>

	<template data-ln-template="options">
		<li data-ln-repeater-item>
			<input type="text" name="options[]" required aria-label="Option {index1}">
			<button type="button" data-ln-repeater-remove aria-label="Remove option">×</button>
		</li>
	</template>
</div>
```

### Translatable + Sortable Multi-Language Options

```html
<form data-ln-form data-ln-translations data-ln-translations-default="mk" data-ln-translations-locales='{"mk":"Македонски","en":"English","de":"Deutsch"}'>
	<!-- ln-translations header with active badges + dropdown -->

	<div data-ln-repeater="options" data-ln-repeater-min="1">
		<ul data-ln-repeater-list data-ln-sortable></ul>

		<button type="button" data-ln-repeater-add>Add option</button>

		<template data-ln-template="options">
			<li data-ln-repeater-item>
				<span data-ln-sortable-handle aria-hidden="true">⋮⋮</span>
				<div data-ln-translatable="label" data-ln-translations-prefix="options[{index}]">
					<input type="text" name="options[{index}][label]" required>
				</div>
				<button type="button" data-ln-repeater-remove aria-label="Remove option">×</button>
			</li>
		</template>
	</div>
</form>
```

### Multi-Field Indexed Rows (e.g., Line Items / Sacks)

```html
<div data-ln-repeater="sacks" data-ln-repeater-min="1" data-ln-repeater-reindex>
	<ul data-ln-repeater-list data-ln-sortable></ul>

	<button type="button" data-ln-repeater-add>Add sack</button>

	<template data-ln-template="sacks">
		<li data-ln-repeater-item>
			<span data-ln-sortable-handle aria-hidden="true">⋮⋮</span>
			<select name="sacks[{index}][type]" required>
				<option value="standard">Standard</option>
				<option value="window">Window</option>
			</select>
			<input type="number" name="sacks[{index}][weight]" step="0.1" min="0" required>
			<input type="number" name="sacks[{index}][qty]" min="1" value="1" required>
			<button type="button" data-ln-repeater-remove aria-label="Remove row">×</button>
		</li>
	</template>
</div>
```

---

## Declarative API Contract

### HTML Attributes

| Attribute | Element | Type | Default | Description |
|---|---|---|---|---|
| `data-ln-repeater` | Root | `string` | `""` | Mounts the repeater. Optional value names the `<template data-ln-template="...">` and the `ln-fill` array key. |
| `data-ln-repeater-min` | Root | `integer` (`>= 0`) | `0` | Minimum rows. Auto-seeds rows on init when empty and disables remove triggers when `count <= min`. |
| `data-ln-repeater-max` | Root | `integer` (`>= 1`) | `Infinity` | Maximum rows. Disables add triggers and emits `ln-repeater:max-reached` once reached. |
| `data-ln-repeater-reindex` | Root | `boolean` | `false` | Re-numbers `{index}`/`{index1}` attributes sequentially (`0..n-1`) after remove or `ln-sortable:reordered`. Default is monotonic. |
| `data-ln-repeater-list` | `<ul>` / `<ol>` / container | marker | — | Target container where repeated items live. Falls back to root if omitted. |
| `data-ln-repeater-item` | Row element | marker | — | Marks each repeated row (automatically added on cloned rows if absent). |
| `data-ln-repeater-add` | `<button type="button">` | trigger | — | Internal button inside root that appends a new row and focuses its first control. |
| `data-ln-repeater-add-for` | `<button type="button">` | `string` (ID) | — | External trigger referencing a repeater root by `id`. Syncs `disabled` state automatically. |
| `data-ln-repeater-remove` | `<button type="button">` | trigger | — | Per-row button inside an item that removes its owning row. |

### JS API (`element.lnRepeater`)

| Member | Signature | Returns | Description |
|---|---|---|---|
| `items` | getter | `HTMLElement[]` | Live array of current row elements. |
| `count` | getter | `number` | Current row count. |
| `add` | `(values?, options?)` | `HTMLElement \| null` | Clones and appends a new row, optionally populating controls from `values`. |
| `remove` | `(itemOrIndex, options?)` | `boolean` | Removes a row by element or 0-based position unless blocked by `min` or canceled. |
| `clear` | `(options?)` | `void` | Removes rows down to `min` (or all rows with `{ force: true }`). |
| `destroy` | `()` | `void` | Detaches listeners, resets trigger `disabled` attributes, and deletes `element.lnRepeater`. |

---

## DOM Events

All emitted events bubble from the repeater root (`{ bubbles: true }`):

| Event | Direction | Cancelable | `detail` |
|---|---|---|---|
| `ln-repeater:request-add` | Listens | No | `{ values?, focus? }` |
| `ln-repeater:request-remove` | Listens | No | `{ item? \| index?, focusNeighbor? }` |
| `ln-fill` | Listens | No | `Object` (reads `detail[templateName]`) \| `null` (clears and re-seeds `min`) |
| `ln-repeater:before-add` | Emits | Yes | `{ target, index, count }` |
| `ln-repeater:added` | Emits | No | `{ target, item, index, count }` |
| `ln-repeater:before-remove` | Emits | Yes | `{ target, item, index, count }` |
| `ln-repeater:removed` | Emits | No | `{ target, item, index, count }` |
| `ln-repeater:reindexed` | Emits | No | `{ target, count }` |
| `ln-repeater:max-reached` | Emits | No | `{ target, max, count }` |
| `ln-repeater:min-reached` | Emits | No | `{ target, min, count }` |
