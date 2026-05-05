# ln-search

> Debounced text-search input. Dispatches one cancelable `ln-search:change`
> event on the target; the default fallback hides non-matching items via
> `data-ln-search-hide`. Active consumers call `preventDefault()` and run
> their own filter pipeline.

## Philosophy

`ln-search` debounces `input` events (150ms trailing-edge) and dispatches
`ln-search:change` on the **target** element. Two consumer paths share the
same event: a passive consumer (no listener) gets the default DOM walk —
`target.children` filtered by textContent, non-matching items get
`data-ln-search-hide="true"`; an active consumer (`ln-table`, custom code)
calls `preventDefault()` and takes over entirely.

Pre-filled inputs (browser form-restore, server render) trigger an initial
dispatch via `queueMicrotask` so all components finish init first.

For internal mechanics see [`docs/js/search.md`](../../docs/js/search.md).

## HTML contract

### Minimal — `data-ln-search` directly on the input

```html
<input type="search" placeholder="Search..." data-ln-search="my-list">

<ul id="my-list">
    <li>Argentina</li>
    <li>Brazil</li>
    <li>Canada</li>
</ul>
```

- `data-ln-search="my-list"` — creates the instance; value is the target's `id`.
- Default walk hides non-matching `target.children` via `data-ln-search-hide` (`display: none !important` — ships in `ln-search.scss`).

### Wrapper — icon + clear button

```html
<label data-ln-search="my-list">
    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
    <input type="search" placeholder="Search...">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</label>
```

Input found by priority: `[name="search"]` → `input[type="search"]` →
`input[type="text"]`. Chrome comes from `@mixin form-input-icon-group`
automatically via `<label>:has(input[type="search"])` — no class needed.

For deep-descendant filtering, add `data-ln-search-items`:

```html
<input type="search" data-ln-search="icon-grid" data-ln-search-items=".icon-cell">

<div id="icon-grid">
    <section>
        <div class="icon-cell">home — go home</div>
        <div class="icon-cell">arrow-left — back</div>
    </section>
    <section>
        <div class="icon-cell">plus — add</div>
        <div class="icon-cell">trash — delete</div>
    </section>
</div>
```

`target.querySelectorAll('.icon-cell')` runs on every search; the `<section>`
wrappers are not touched.

## JS API

Each `[data-ln-search]` element carries `el.lnSearch`:

```js
el.lnSearch.destroy();   // clears debounce timer, removes listeners,
                          // removes data-ln-search-initialized, deletes el.lnSearch
                          // does NOT clear data-ln-search-hide from target items
```

Read-only fields (captured at construction): `dom`, `targetId`, `input`,
`itemsSelector`. Mutating them does nothing — instance state is fixed at init.

`window.lnSearch(root)` upgrades a custom root (Shadow DOM, foreign documents)
the shared MutationObserver cannot see.

## Events

| Event | Bubbles | Cancelable | `detail` | Dispatched on |
|---|---|---|---|---|
| `ln-search:change` | yes | **yes** | `{ term, targetId }` | The target element |

`term` is already lowercased and trimmed. Event dispatches on the **target**
(not the input). `preventDefault()` from any listener skips the default DOM walk.

## Attribute reference

| Attribute | On | Description |
|---|---|---|
| `data-ln-search="targetId"` | search element (input or wrapper) | Marks the search element; value is the target's `id`. |
| `data-ln-search-items="selector"` | same element | Opts into `target.querySelectorAll(selector)` instead of `target.children`. |
| `data-ln-search-hide="true"` | items inside the target (auto) | Set/cleared by the default walk; the public CSS hook. |
| `data-ln-search-clear` | `<button>` inside the wrapper | Clear-button hook; click empties input and re-runs search synchronously. |

## Behavior

- Pre-filled input (browser form-restore, server render) triggers an initial
  `ln-search:change` via `queueMicrotask` after the current tick.
- Debounce is 150ms trailing-edge with cancellation. Rapid typing produces one
  search call.
- Clear-button click bypasses the debounce (synchronous reset).
- `destroy()` does NOT clear `data-ln-search-hide` from items in the target.
- `targetId` and `itemsSelector` are captured at construction; mid-life mutation does not re-bind. Switch by destroy + re-init.
- The default DOM walk runs unless a listener calls `preventDefault()`. No per-input opt-out attribute.

## What it does NOT do

- Does NOT make HTTP calls. Listen to `ln-search:change`, `preventDefault()`, dispatch your own request.
- Does NOT highlight matched substrings. No `<mark>`, no class toggle.
- Does NOT dispatch separate `:clear` or `:submit` events. Clearing fires `ln-search:change` with `term: ''`. Enter is a platform event the component does not see.
- Does NOT support a configurable debounce delay. `DEBOUNCE_MS` is a module constant. If you need different timing, listen on the input directly.
- Does NOT filter `[data-ln-table]` targets via the default walk. `ln-table` calls `preventDefault()` and runs its own pipeline.

## Examples

### Minimal — filter a list

```html
<input type="search" placeholder="Search countries..." data-ln-search="countries">

<ul id="countries">
    <li>Argentina</li>
    <li>Brazil</li>
    <li>Canada</li>
    <li>Denmark</li>
</ul>
```

Type "ar" — Argentina stays; the rest get `data-ln-search-hide`. Clear — every
attribute is removed. Zero JavaScript on the consumer side.

### Wrapper with icon and clear button

```html
<label data-ln-search="employees">
    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
    <input type="search" placeholder="Search employees...">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</label>

<table id="employees" data-ln-table>
    <!-- table markup -->
</table>
```

Chrome from `@mixin form-input-icon-group` automatically — no class on the label.
Clear button hides itself via `:placeholder-shown` CSS while the input is empty.

### Filter a table

```html
<input type="search" placeholder="Search users..."
       data-ln-search="users"
       data-ln-search-items="tbody tr">

<table id="users">
    <thead>
        <tr><th>Name</th><th>Role</th></tr>
    </thead>
    <tbody>
        <tr><td>Alice Cooper</td><td>Admin</td></tr>
        <tr><td>Bob Smith</td><td>Editor</td></tr>
        <tr><td>Carol Adams</td><td>Viewer</td></tr>
    </tbody>
</table>
```

Without `data-ln-search-items`, ln-search walks `target.children` — which on a
`<table>` iterates over `<thead>` and `<tbody>`, not rows. The selector lets
you target row-level elements regardless of nesting depth. Matched rows stay;
the rest get `data-ln-search-hide` on the `<tr>`.

## See also

- `js/ln-table/README.md` — canonical `preventDefault` consumer; in-memory filter.
- `js/ln-filter/README.md` — independent filter on the same target via `data-ln-filter-hide`.
- `js/ln-data-table/README.md` — server-coordinated table; uses its own search input (`data-ln-data-table-search`), NOT ln-search.
- `@mixin form-input-icon-group` (`scss/config/mixins/_form.scss`) — chrome for the wrapper variant.
- `docs/js/search.md` — internal architecture for library maintainers.
