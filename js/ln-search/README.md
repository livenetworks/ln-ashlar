# ln-search

A zero-dependency, event-driven **Debounced Search Primitive** that intercepts text input, debounces keystrokes, and coordinates list-filtering states.

It acts as an intent announcer. It does not own data filtering directly; instead, it announces a normalized search query on the target element via a cancelable event, allowing tables, lists, or custom server integrations to intercept and handle the query or fall back to a built-in DOM-walking filter.

---

## 🧭 Philosophy & Architecture

1. **Decoupled Search Intent:** The component does not manipulate collections directly. It debounces keystrokes (150ms trailing-edge) and dispatches a cancelable `ln-search:change` custom event on the **target** element (not the input).
2. **The Default DOM-Walk Fallback:** If no listener calls `e.preventDefault()`, the component automatically runs a fast DOM-walk on the target's children, applying `data-ln-search-hide="true"` to non-matching elements.
3. **Reactive Form-Restore Hook:** During page reloads or back-button navigation, browsers auto-fill input fields before scripts initialize. `ln-search` detects this pre-filled state at construction and schedules an initial search dispatch via `queueMicrotask` to ensure all listener components have fully initialized first.

---

## 📦 Minimal Blueprint

### Standard List Filtering (Zero-JS Fallback)
Bind the search input to a list `id` via `data-ln-search`.
```html
<input type="search" placeholder="Search..." data-ln-search="countries-list">

<ul id="countries-list">
  <li>Argentina</li>
  <li>Brazil</li>
  <li>Canada</li>
</ul>
```

### Premium Icon Wrapper with Clear Button
When placed on a wrapper container, the component automatically resolves the nested input.
```html
<label data-ln-search="countries-list">
  <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
  <input type="search" placeholder="Search countries...">
  <button type="button" data-ln-search-clear aria-label="Clear search">
    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
  </button>
</label>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-search` | `<input>`, `<label>` | Component root and namespace. Value is the `id` of the target to filter. |
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

- **Confusing with `ln-table` Search:** `ln-table` manages its own internal search input via `data-ln-table-search` to join sorting and pagination into unified API request arrays. Do not place `ln-search` in front of `ln-table`.
- **Bypassing Debounce via Native Input Listeners:** Listening to native `input` events directly will bypass the 150ms debounce and execute expensive logic on every single keystroke. Always listen to `ln-search:change`.
- **Programmatic Value Mutations:** Assigning `input.value = "text"` programmatically does not trigger search. You must manually dispatch an `input` event:
  ```javascript
  input.value = 'Argentina';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  ```
