# ln-search

A zero-dependency, event-driven **Debounced Search Primitive** that intercepts text input, debounces keystrokes, and coordinates list-filtering states.

It acts as an intent announcer. It does not own data filtering directly; instead, it announces a normalized search query on the target element via a cancelable event, allowing tables, lists, or custom server integrations to intercept and handle the query or fall back to a built-in DOM-walking filter.

---

## ✅ Canonical Markup — Copy This (REQUIRED)

**Hard rule — non-negotiable.** Every search or filter text input MUST use the
full `.search` chrome below: the leading magnifier icon **and** the clear
("x") button. This applies everywhere — toolbars, table headers, **and
popovers/dropdowns**. The previously-accepted "lightweight" bare
`<input data-ln-search>` (no icon, no clear button) is **no longer acceptable
for authoring**.

Copy this block. Change only the `placeholder`, the
`data-ln-search="<targetId>"`, and the `aria-label`. If a field needs a
page-specific tweak, add one extra class beside `search`
(`class="search my-extra"`) — never alter the structure, the icons, or the
clear button.

```html
<label class="search">
	<svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg>
	<input type="search" placeholder="Search …" data-ln-search="<targetId>">
	<button type="button" data-ln-search-clear aria-label="Clear search">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
	</button>
</label>
```

For deep targeting (e.g. checkbox lists inside a popover) add
`data-ln-search-items="<selector>"` to the **same `<input>`** — the chrome is
identical:

```html
<input type="search" placeholder="Search …" data-ln-search="<targetId>" data-ln-search-items="label">
```

---

## 🧭 Philosophy & Architecture

1. **Decoupled Search Intent:** The component does not manipulate collections directly. It debounces keystrokes (150ms trailing-edge) and dispatches a cancelable `ln-search:change` custom event on the **target** element (not the input).
2. **The Default DOM-Walk Fallback:** If no listener calls `e.preventDefault()`, the component automatically runs a fast DOM-walk on the target's children, applying `data-ln-search-hide="true"` to non-matching elements.
3. **Reactive Form-Restore Hook:** During page reloads or back-button navigation, browsers auto-fill input fields before scripts initialize. `ln-search` detects this pre-filled state at construction and schedules an initial search dispatch via `queueMicrotask` to ensure all listener components have fully initialized first.

---

## 📦 Minimal Blueprint

### Standard List Filtering (Zero-JS Fallback)
Bind the search input to a list `id` via `data-ln-search`.

> ⚠️ **Not an authoring pattern.** The component still *accepts* a bare input
> (backward-compat / JS-internal fallback), but you must always author the full
> `.search` chrome shown in [Canonical Markup](#-canonical-markup--copy-this-required).

```html
<input type="search" placeholder="Search..." data-ln-search="countries-list">

<ul id="countries-list">
  <li>Argentina</li>
  <li>Brazil</li>
  <li>Canada</li>
</ul>
```

### Premium Icon Wrapper with Clear Button
The canonical input-host form places `data-ln-search` directly on the `<input>`
and uses `class="search"` for the compact icon-group chrome (leading magnifier,
recessed fill, clear button):
```html
<label class="search">
	<svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg>
	<input type="search" placeholder="Search countries..." data-ln-search="countries-list">
	<button type="button" data-ln-search-clear aria-label="Clear search">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
	</button>
</label>
```
`class="search"` binds `@include search` (library `scss/components/_form.scss`).
Wrapper-host (`data-ln-search` on the `<label>`) is retained only so existing
markup keeps working — input-host is **required** for all new code.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-search` | `<input>` (canonical); `<label>`/wrapper (backward-compat) | Component root and namespace. Value is the `id` of the target to filter. |
| `data-ln-search-items` | Same as root | Opt-in. Deep CSS selector (e.g. `tbody tr`) to query deep matching elements instead of direct children. |
| `data-ln-search-clear` | `<button>` | Identifies the clear button. Click clears input and triggers synchronous search reset. |
| `data-ln-search-hide` | Children of target | *State*. Automatically toggled on non-matching elements (`display: none !important`). |

### JavaScript API (`el.lnSearch`)

| Member | Type | Description |
| :--- | :--- | :--- |
| `targetId` | `string` | The ID of the target element. |
| `input` | `HTMLInputElement` | The resolved input element driving the search. |
| `destroy()` | `() => void` | Removes listeners, cancels debounces, and tears down the instance. |

---

## ⚡ DOM Events

### `ln-search:change`
Dispatched on the **target** element whenever the search term changes.
- **Cancelable**: Yes. Calling `e.preventDefault()` disables the default DOM-walk.
- **Payload (`detail`)**: `{ term: string, targetId: string }` (where `term` is lowercased and trimmed).

---

## ⚠️ Common Pitfalls

- **Driving an `ln-table` search box:** `ln-table` **does** consume `ln-search:change` in both SSR and data-driven modes — placing `data-ln-search="<tableId>"` on the search input (or its label wrapper) is the sole supported pattern. The search term is joined with sort and column filters into the `ln-table:request-data` payload. Note: `data-ln-table-search` has been removed — use `data-ln-search="<tableId>"` instead.
- **Bypassing Debounce via Native Input Listeners:** Listening to native `input` events directly will bypass the 150ms debounce and execute expensive logic on every single keystroke. Always listen to `ln-search:change`.
- **Programmatic Value Mutations:** Assigning `input.value = "text"` programmatically does not trigger search. You must manually dispatch an `input` event:
  ```javascript
  input.value = 'Argentina';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  ```
