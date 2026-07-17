# Core

Shared helper module imported by all components — re-exported from
`js/ln-core/index.js`. No DOM attribute, no constructor, no
MutationObserver. Source: `js/ln-core/`.

## Helpers

ln-core exposes helpers in these categories:

- **Templates** — clone and populate `<template>` fragments
- **Events** — dispatch standard and cancelable CustomEvents; shared data-request cycle for collection components (`requestData`)
- **DOM binding** — declarative data-attribute-driven rendering (`fill`, `renderList`, `fillTemplate`)
- **Forms** — serialize/populate by field `name`
- **Dictionaries** — extract i18n strings from hidden elements
- **Discovery** — `registerComponent` for MutationObserver-backed auto-init
- **Reactivity** — `reactiveState`, `deepReactive`, `createBatcher`
- **Layout** — viewport-aware positioning, teleport, measurement
- **Persistence** — localStorage wrappers with `ln:` prefix
- **Hash codec** — namespaced URL fragment state (`hashParse`, `hashGet`, `hashSet`)
- **Cryptography** — high-performance Web Crypto helpers for encryption at rest (`crypto.js`)

Source of truth: `js/ln-core/helpers.js`, `js/ln-core/reactive.js`, and `js/ln-core/crypto.js`. Import from `'../ln-core'` (barrel).

---

## helpers.js

### cloneTemplate(name, componentTag)

Clone a `<template data-ln-template="name">` element. Cached after first lookup.

```js
const frag = cloneTemplate('track-item', 'ln-playlist');
const li = frag.querySelector('[data-ln-track]');
```

- Returns `DocumentFragment` (result of `tmpl.content.cloneNode(true)`)
- Returns `null` + console warning if template not found
- `componentTag` is used only in the warning message

### dispatch(element, eventName, detail)

Fire a non-cancelable `CustomEvent` that bubbles.

```js
dispatch(this.dom, 'ln-toggle:open', { target: this.dom });
```

- `bubbles: true`, `cancelable: false`
- `detail` defaults to `{}` if omitted

### dispatchCancelable(element, eventName, detail)

Fire a cancelable `CustomEvent` that bubbles. Returns the event object so the caller can check `defaultPrevented`.

```js
const before = dispatchCancelable(this.dom, 'ln-toggle:before-open', { target: this.dom });
if (before.defaultPrevented) return;
```

- `bubbles: true`, `cancelable: true`
- `detail` defaults to `{}` if omitted

### requestData(component, eventName, keyName)

Shared data-request cycle for collection components (`ln-table`, `ln-list`). Runs the local render pass over the hydrated rows, then dispatches a `*:request-data` event so the coordinator can fetch the authoritative dataset.

```js
requestData(this, 'ln-list:request-data', 'list');    // inside ln-list
requestData(this, 'ln-table:request-data', 'table');  // inside ln-table
```

- Render order: `_applyFilterAndSort()` → reset `_vStart`/`_vEnd` to `-1` → `_render()` → `_updateFooter()` → `dispatch`.
- `eventName` — the `*:request-data` event the component emits.
- `keyName` — the payload property carrying the component name (`'list'` / `'table'`). The dispatched `detail` is always `{ sort, filters, search, [keyName]: component.name }` — same shape, only the identifier key varies per component.
- **Instance contract:** `component` must expose `_applyFilterAndSort()`, `_render()`, `_updateFooter()`, `_vStart`, `_vEnd`, `dom`, `name`, `currentSort`, `currentFilters`, `currentSearch`. Both `ln-table` and `ln-list` satisfy it; each defines its own one-line `_requestData` wrapper around this helper.
- Dispatches via `dispatch` — the emitted event bubbles and is non-cancelable.

### fill(root, data)

Declarative DOM binding. Reads `data-ln-*` attributes on descendants and applies values from the `data` object.

```js
fill(li, { number: 1, title: 'Track', artist: 'Artist', isPlaying: true });
```

| Attribute | Behavior | Example |
|-----------|----------|---------|
| `data-ln-field="prop"` | `el.textContent = data[prop]` | `<span data-ln-field="title"></span>` |
| `data-ln-attr="attr:prop, attr:prop"` | `el.setAttribute(attr, data[prop])` | `<input data-ln-attr="value:name, placeholder:hint">` |
| `data-ln-show="prop"` | `el.classList.toggle('hidden', !data[prop])` | `<span data-ln-show="hasError">` |
| `data-ln-class="cls:prop"` | `el.classList.toggle(cls, !!data[prop])` | `<li data-ln-class="active:isPlaying">` |

> [!IMPORTANT]
> These four are `fill()` **binding attributes, not components** — there is no `ln-field`, `ln-attr`, `ln-show`, or `ln-class` element. They apply only where a component calls `fill()`.

- Returns `root` for chaining
- Skips `null`/`undefined` values (existing content preserved)
- Nothing calls `fill()` automatically — a component must call it explicitly, and re-call it to update. Renderer pipelines that clone templates (`ln-table` rows, `renderList`'s clone pass) do not call `fill()`; inside those templates use `{{ field }}` instead. `fill()` does not process `{{ }}` placeholders.

### lnFill(container, record)

Fan-out helper — dispatches `ln-fill` at every `[data-ln-form]` and
`[data-ln-fillable]` descendant. Each fillable self-handles: a form fills
or resets; a display region fills or clears its `[data-ln-field]` elements.
`record = null` triggers a reset/clear on all targets.

```js
// At the modal open boundary — form fills, title heading fills, one call
window.lnCore.lnFill(modalEl, record);   // record → fill; null → reset/clear
```

- Also dispatches `ln-fill` at `container` itself when it matches
  `[data-ln-form]` or `[data-ln-fillable]` — so `lnFill(formEl, record)` works
  when called directly on a form element. Source: `js/ln-core/helpers.js` L164–165.
- `container` — any element; scans its entire subtree.
- `record` — plain object or `null`.
- Dispatches `ln-fill` (`bubbles: true`, `detail = record ?? null`) at each target.
- Returns `container` for chaining.
- Exported from `js/ln-core/index.js`; available at `window.lnCore.lnFill`.
- Back-compat: `ln-form` also still accepts `ln-form:fill` / `ln-form:reset` (aliases).

### fillTemplate(clone, data)

Replace `{{ key }}` text-node placeholders in a cloned template fragment with values from `data`. Flat keys only (no nested `{{ item.text }}`).

```js
const frag = cloneTemplate('filter-item', 'ln-filter');
fillTemplate(frag, { text: 'Engineering' });
```

```html
<template data-ln-template="filter-item">
    <label><input type="checkbox"> {{ text }}</label>
</template>
```

- Walks text nodes via `TreeWalker(clone, NodeFilter.SHOW_TEXT)` (pass 1)
- In pass 1: replaces `{{ key }}` with `data[key]` (whitespace inside braces is flexible)
- **Pass 2: element attributes** — iterates every element in the clone (including the
  root element itself when it is an `Element`, since `querySelectorAll` does not include
  root). For each attribute whose value contains `{{`, replaces tokens via
  `el.setAttribute(attr.name, resolved)`. Uses `setAttribute` — never `innerHTML` —
  so injection risk is the same as `data-ln-attr`. Source: `js/ln-core/helpers.js` L197–233.
- Missing keys produce empty string in both passes
- No-op in either pass when no `{{` is present
- Returns `clone` for chaining
- **Different system from `fill()` — not interchangeable.** `fillTemplate` consumes `{{ key }}` placeholders once, at clone time (in both text nodes and element attribute values); after that the content is plain and never updates. `data-ln-field` is read only by `fill()`, and `fill()` runs only where a component explicitly calls it. Neither function processes the other's syntax.
- Called automatically by `renderList` on freshly cloned elements only — on keyed re-renders the placeholders are already consumed, so `{{ key }}` values never update. Values that must update on re-render belong in your `fillFn` (e.g. `fill()` + `data-ln-field`).
- **`ln-table` row templates never call `fill()`** — rows support `{{ field }}` and `data-ln-table-cell-attr` only; a `data-ln-field` inside a row template is silently ignored. Decision matrix: `docs/architecture/data-flow.md` §5.

### renderList(container, items, templateName, keyFn, fillFn, componentTag)

Keyed list rendering with DOM reuse. Existing children matched by `data-ln-key` attribute.

```js
renderList(
    this.listEl,
    state.tracks,
    'track-item',
    function (track) { return track.id; },
    function (el, track, i) { fill(el, { number: i + 1, title: track.title }); },
    'ln-playlist'
);
```

- `keyFn(item)` returns a unique string key for each item
- `fillFn(el, item, index)` updates the DOM element with item data
- Reuses existing elements with matching `data-ln-key` (avoids re-clone)
- Replaces all container children atomically (`textContent = '' + appendChild(frag)`)
- Calls `fillTemplate(clone, item)` automatically for newly-cloned elements — `{{ key }}` placeholders in the template resolve from the item data without extra wiring.

### guardBody(setupFn, componentTag)

Guard against script loading before `<body>` exists. If `document.body` is `null`, defers `setupFn` to `DOMContentLoaded`.

```js
guardBody(function () {
    observer.observe(document.body, { ... });
}, 'ln-toggle');
```

- Logs a warning suggesting the `defer` attribute on the `<script>` tag
- Used by every component's `_domObserver()` function

### findElements(root, selector, attribute, ComponentClass)

Find all elements with `[selector]` inside `root` (including root itself) and instantiate `ComponentClass` on each one that doesn't already have an instance.

```js
findElements(node, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
```

- Checks `el[attribute]` to prevent double-initialization
- Sets `el[attribute] = new ComponentClass(el)`
- Used in constructors and MutationObserver callbacks

### cloneTemplateScoped(root, name, componentTag)

Clone a `<template>` with scoped lookup — searches inside `root` first, falls back to global `cloneTemplate`.

```js
const frag = cloneTemplateScoped(this.dom, 'column-filter', 'ln-table');
```

- First searches for `<template data-ln-template="name">` inside `root`
- If not found inside `root`, falls back to global `cloneTemplate(name, componentTag)`
- Returns `DocumentFragment` (same as `cloneTemplate`)
- Use when a component supports locally-scoped templates that can be overridden per-instance

### buildDict(root, selector)

Build a plain object from hidden dictionary elements. Reads all `[selector]` elements once at init, extracts `key → textContent`, removes them from DOM. Returns a plain object for O(1) lookups.

```html
<ul hidden>
    <li data-ln-upload-dict="remove">{{ __('Remove') }}</li>
    <li data-ln-upload-dict="error">{{ __('Error') }}</li>
</ul>
```

```js
const dict = buildDict(container, 'data-ln-upload-dict');
dict['remove']  // 'Remove'
dict['error']   // 'Error'
```

- One-shot: reads once, removes elements, returns object
- Missing keys return `undefined` — caller provides fallback: `dict['key'] || 'default text'`
- Convention: `data-{component}-dict="key"` on `<li>` elements inside a single `<ul hidden>`
- Server (Blade, Twig, etc.) translates the text — JS never contains display strings

### isVisible(el)

Boolean — true if the element has non-zero layout box (any of
`offsetWidth`, `offsetHeight`, or `getClientRects().length`).

```js
if (!isVisible(panel)) return;
```

- Cheap layout-time check — does NOT compute styles.
- Returns `false` for elements with `display: none`, detached nodes,
  and zero-sized elements.

### serializeForm(form, opts?)

Walk `form.elements`, return a plain object keyed by element `name`.

```js
const data = serializeForm(this.dom);
// { username: 'alice', roles: ['admin', 'editor'], country: 'mk' }

// Opt-in typed coercion:
const typed = serializeForm(this.dom, { typed: true });
// { active: true, count: 5, range: null }
```

- Skips disabled fields, file inputs, submit / button inputs, and
  unnamed elements.
- Checkboxes collect as `string[]` under the shared `name`.
- Radios collect as a single `string` (winning value).
- `<select multiple>` collects as `string[]`.
- Everything else collects as the raw `el.value`.

**`opts.typed = true` — typed coercion rules:**

| Input type | Default (no opts) | With `typed: true` |
|---|---|---|
| Single checkbox (unique name in form) | `[]` / `['on']` | `true` / `false` |
| Checkbox group (multiple same name) | array of checked values | array of checked values |
| `type="number"` / `type="range"` | `"42"` (string) | `42` (Number), or `null` if empty / NaN |
| `type="hidden"` | string | string — **never coerced** |
| Everything else | string | string (unchanged) |

The `hidden` branch is explicit to protect `ln-number`'s raw-value
contract: `ln-number` writes the numeric string to a hidden input, and
typed mode must not convert it silently.

### populateForm(form, data)

Inverse of `serializeForm`. Walks `form.elements`, assigns from `data`
keyed by `name`. Returns the array of populated elements (caller can
re-validate them).

```js
const populated = populateForm(this.dom, { username: 'alice', roles: ['admin'] });
populated.forEach(function (el) { dispatch(el, 'input'); });
```

- Skips elements not present as keys in `data`, file inputs, submit /
  button inputs.
- **Decoupled fill key (`data-ln-fill-as`)** — match key for the fill direction is
  `el.getAttribute('data-ln-fill-as') || el.name`. When `data-ln-fill-as` is set,
  the record key is the fill-as value and `name` stays as the form submission key.
  Source: `populateForm` in `js/ln-core/helpers.js`.
- **Checkbox string coercion** — a single checkbox (one element with that `name` in
  the form) whose fill value is a string is coerced via `_coerceBool`: `"false"`,
  `"0"`, `""`, `"off"`, `"no"` (case-insensitive, trimmed) → unchecked; anything
  else → checked. This handles `data-ln-fill-*` values which always arrive as
  strings. Source: `_coerceBool` + `populateForm` in `js/ln-core/helpers.js`.
- Checkbox + array → `checked` if `el.value` is in the array.
- Checkbox group (same `name`, 2+ elements) + scalar → treated as comma-separated list (`"admin,editor"` → membership check).
- Single checkbox + scalar → boolean coercion: `"false"/"0"/"off"/"no"/""` → unchecked; anything else → checked.
- Radio → `checked` if value matches.
- `<select multiple>` + array → marks matching options selected.

### getLocale(el)

Resolve the active locale for an element. Walks ancestors for `[lang]`,
falls back to `navigator.language`.

```js
const locale = getLocale(this.dom); // 'mk', 'en-US', ...
```

- Used by date / number / collator-driven components.
- Walks via `el.closest('[lang]')` — first ancestor with a `lang`
  attribute wins.

### readValue(el)

Read the raw machine value behind a formatted cell/item display. The single
read path for value-based sort/filter across components.

```js
const raw = readValue(td); // '1250.50' from data-ln-value, else trimmed text
```

- Returns `data-ln-value` attribute value if the element has it.
- Otherwise returns `el.textContent.trim()`.
- Used by `ln-table` for sort/filter; future collection components
  (`ln-list`) read the same attribute through this helper.

### registerComponent(selector, attribute, ComponentFn, componentTag, options)

End-to-end component registration. Replaces the hand-rolled IIFE
boilerplate of `findElements` + `MutationObserver` + `guardBody` +
DOMContentLoaded + `window[attribute] =` registration with one call.

```js
import { registerComponent } from '../ln-core';

function _component(dom) { this.dom = dom; /* ... */ }

registerComponent('data-ln-example', 'lnExample', _component, 'ln-example', {
    extraAttributes: ['data-ln-example-state'],
    onAttributeChange: function (target, name) { /* attribute → state bridge */ },
    onInit: function (root) { /* post-init hook, per added subtree */ }
});
```

- `selector` — attribute name (`'data-ln-foo'`) OR a full CSS selector
  if it contains `[`, `.`, or `#` (e.g. `'[data-ln-foo]:not([disabled])'`).
- `attribute` — JS-side key used both as `window[attribute]` (the
  constructor function) and `el[attribute]` (the per-element instance).
- `options.extraAttributes` — additional attribute names to include in
  the MutationObserver's `attributeFilter` (e.g. state attributes set
  by coordinator).
- `options.onAttributeChange(target, attrName)` — called when a
  filtered attribute changes on an already-initialized element. The
  attribute → state bridge hook.
- `options.onInit(root)` — called after `findElements` per subtree
  (initial DOM, added childList nodes, attribute-mutated subtrees).
- Returns the constructor function (also stored at `window[attribute]`).

---

## reactive.js

### reactiveState(initial, onChange)

Shallow `Proxy` — fires `onChange(prop, value, old)` on every property set. No-op if value hasn't changed.

```js
const state = reactiveState({ searchTerm: '', sortCol: -1 }, function (prop, value, old) {
    batchRender();
});
```

- Returns a Proxy wrapping a shallow copy of `initial`
- Only tracks direct property assignments (not nested objects)
- Used by `ln-filter` for flat state

### deepReactive(obj, onChange)

Deep `Proxy` — recursively wraps nested objects and arrays. Fires `onChange()` (no args) on any nested mutation.

```js
const state = deepReactive({ toasts: [], files: [] }, function () {
    batchRender();
});
state.toasts.push({ title: 'Hello' }); // triggers onChange
```

- Wraps existing nested objects on creation
- Auto-wraps newly assigned objects/arrays
- `deleteProperty` also triggers `onChange`
- Internal `Symbol('deepReactive')` flag prevents double-wrapping
- Used by `ln-toast`, `ln-upload` for complex state

### createBatcher(renderFn, afterRender)

Coalesce multiple synchronous state changes into a single `renderFn` call via `queueMicrotask`.

```js
const batchRender = createBatcher(
    function () { _render(); },
    function () { dispatch(dom, 'ln-component:rendered'); }
);
```

- Multiple calls to `schedule()` within the same microtask result in one `renderFn` call
- Optional `afterRender` callback fires after each render
- Pattern: `deepReactive(state, batchRender)` — every state mutation schedules a batched render

---

## Reactive Rendering Pattern

The three reactive primitives (`reactiveState` / `deepReactive` +
`createBatcher` + `fill`) are designed to be used together. They are
the canonical ln-ashlar render loop:

1. **State mutation.** Component code assigns to a property on a
   reactive proxy (`this.state.value = 'x'`). The proxy fires its
   onChange callback.
2. **Microtask queue.** The onChange is wired to a `createBatcher`
   schedule function. Any number of synchronous assignments in the
   same sync block schedule a single microtask.
3. **One render.** When the microtask fires, the batcher calls
   `renderFn` exactly once. `renderFn` typically calls `fill(this.dom,
   this.state)` (or `renderList` for keyed collections) to project
   state into the DOM, then the optional `afterRender` callback fires
   (commonly used to dispatch a `ln-{component}:rendered` event).

Two assignments on the same tick produce one DOM update. External
callers that need to set several properties at once do not need a
`batch()` helper — the batcher handles it.

The pattern is: **state mutation → microtask queue → one render**.
Never wire a reactive onChange directly to `_render()` without a
batcher between them — you will get one render per assignment, and
the DOM will thrash.

For the full decision matrix (`reactiveState` vs `deepReactive`, when
to use this pattern at all, anti-patterns), see
[Reactive Rendering Pattern in js/COMPONENTS.md](../../js/COMPONENTS.md#reactive-rendering-pattern).

---

## positioning.js

### computePlacement(anchorRect, floatingSize, preferred, offset)

Compute viewport coordinates for a floating element (popover, tooltip,
dropdown) relative to an anchor rectangle.

```js
import { computePlacement } from '../ln-core';

const rect = trigger.getBoundingClientRect();
const size = measureHidden(panel);
const { top, left, placement } = computePlacement(rect, size, 'bottom-end', 8);
panel.style.top  = top  + 'px';
panel.style.left = left + 'px';
panel.setAttribute('data-ln-placement', placement);
```

- `anchorRect` — `DOMRect` or any rect-shaped object.
- `floatingSize` — `{ width, height }`. Use `measureHidden` when the
  panel is currently hidden.
- `preferred` — `'top' | 'bottom' | 'left' | 'right'` with optional
  `-start` / `-end` alignment (floating-ui-style). Default `'bottom'`.
- `offset` — gap in pixels between anchor and floating element.
  Default `4`.
- Returns `{ top, left, placement }`. `placement` is the side that
  won (alignment suffix is preserved internally but not reported in
  the return value).
- Fallback chain: tries preferred side → opposite side → perpendicular
  pair → clamps to viewport edge if nothing fits.
- Pure function. No DOM side effects.

### teleportToBody(el)

Move an element into `<body>`, leaving a comment placeholder so it can
be restored to its original parent.

```js
const restore = teleportToBody(panel);
// ... later
restore();
```

- Returns a cleanup function that restores the element to its origin.
- No-op + no-op cleanup if the element is already in `<body>` or
  parent is missing.
- Used for floating UI that needs to escape `overflow: hidden`
  ancestors (popovers, dropdowns).
- Does NOT set inline styles — the caller's CSS rule (e.g.
  `[data-ln-popover] { position: fixed }`) is responsible for
  positioning context.

### measureHidden(el)

Read `offsetWidth` / `offsetHeight` of an element that may currently
be hidden via `display: none`.

```js
const { width, height } = measureHidden(panel);
```

- Temporarily applies `visibility: hidden; display: block; position:
  fixed` to force layout, reads dimensions, then restores the inline
  style values.
- Returns `{ width: 0, height: 0 }` for a falsy element.
- Brief inline-style mutation is restored before the function returns
  — the visible DOM never reflects the temporary state.

---

## persist.js

### persistGet(component, el)

Read persisted value for an element. Returns the parsed JSON value or `null` (not found, or storage unavailable).

- `component` — component name string (e.g. `'toggle'`, `'tabs'`, `'filter'`)
- `el` — DOM element with `data-ln-persist` attribute

Storage key resolved from `el`: uses `data-ln-persist` value if non-empty, otherwise element's `id`. If neither exists, emits `console.warn` and returns `null`.

```js
import { persistGet } from '../ln-core';
const saved = persistGet('toggle', el); // null | 'open' | 'close'
```

### persistSet(component, el, value)

Write a value to localStorage. Value is JSON-serialized. Silently no-ops if localStorage is unavailable or full.

```js
import { persistSet } from '../ln-core';
persistSet('toggle', el, 'open');
persistSet('table-sort', el, { col: 2, dir: 'desc' });
persistSet('filter', el, null);  // explicitly clears
```

### persistRemove(component, el)

Remove a single persisted value for a specific element.

```js
import { persistRemove } from '../ln-core';
persistRemove('tabs', el);
```

### persistClear(component)

Remove ALL persisted values for a given component type. Scans all localStorage keys matching `ln:{component}:*`.

```js
import { persistClear } from '../ln-core';
persistClear('toggle');     // removes all ln:toggle:* keys
persistClear('table-sort'); // removes all ln:table-sort:* keys
```

Useful for "reset to defaults" functionality.

### Storage key format

```
ln:{component}:{pagePath}:{id}
```

- `pagePath` — `location.pathname`, lowercase, trailing slash stripped, or `/` for root
- `id` — element's `id` attribute, or the explicit `data-ln-persist="custom-key"` value

Examples:
```
ln:toggle:/admin/users:sidebar
ln:tabs:/settings:settings-tabs
ln:table-sort:/admin/orders:orders-table
ln:filter:/admin/users:status-filter
```

### Opt-in HTML attribute

```html
<!-- Uses element id as storage key -->
<section id="sidebar" data-ln-toggle="close" data-ln-persist>

<!-- Explicit key (no id needed) -->
<section data-ln-toggle="close" data-ln-persist="sidebar-section">
```

Persistence is always opt-in. Elements without `data-ln-persist` are never touched.

Components that support `data-ln-persist` document the stored value
shape in their own READMEs (ln-toggle, ln-accordion, ln-tabs,
ln-table-sort, ln-filter).

### Graceful degradation

- localStorage disabled (private browsing) → silent no-op, components work normally without persistence
- localStorage full → silent no-op on write, existing data preserved
- Stale data (panel removed from DOM, column index out of range) → orphan key ignored gracefully
- Missing `id` + no explicit key → `console.warn` once, persistence skipped for that element

---

## hash.js

Shared URL-fragment codec imported by ln-tabs and ln-modal. All three
functions are exposed at `window.lnCore.{hashParse, hashGet, hashSet}` for
coordinators.

### Grammar

Fragments use the format `#nsA:valA&nsB:valB` — one namespace per component
instance, `&`-separated. Foreign segments (belonging to other components) are
preserved on every write. A bare `#ns` (no `:`) encodes an empty value.

### hashParse(str = location.hash) → { ns: value }

Parse a hash string into a plain object of `{ namespace: value }` pairs.

- Strips the leading `#` before processing.
- Tolerates empty or malformed input (returns `{}`).
- Each value is `decodeURIComponent`-decoded.
- Bare `#ns` (no `:`) → `{ ns: '' }` (empty string, not `null`).

### hashGet(ns) → string | null

Read the current value for a namespace from `location.hash`. Returns the
decoded string value if the segment is present (including `''` for bare `#ns`),
or `null` if the namespace is absent.

### hashSet(ns, value)

Read-modify-write `location.hash`, updating ONLY `ns` and preserving all other
segments. Uses `location.hash =` (not `pushState`) so the browser adds a history
entry and fires `hashchange`.

THREE-STATE write:

| `value` | Effect |
|---|---|
| `null` | Removes the `ns` segment entirely |
| `''` (empty string) | Writes a bare `#ns` (no `:`) |
| any other string | Writes `#ns:encodeURIComponent(value)` |

**Identical value is a no-op** — if the resulting hash string equals the
current `location.hash`, the assignment is skipped. This prevents spurious
`hashchange` events and the loops they could cause.

### Usage note

Both ln-tabs (anchor-trigger groups) and ln-modal (hash-bound modals) use this
codec. Because `hashSet` is a read-modify-write that preserves foreign segments,
switching a tab never clobbers an open modal's hash segment and vice versa —
codec isolation is guaranteed by design.

See also: [Hash-state doctrine](../architecture/hash-state.md) — the five rules governing namespace ownership, foreign-segment preservation, anchor interception, coordinator wiring, and the router fragment guard.

---

## crypto.js

Built-in cryptographic utilities using the native browser **Web Crypto API** (AES-GCM 256-bit envelope encryption). These are transparently integrated into the data store for encryption at rest.

### setCryptoKey(secretString)

Derive a 256-bit cryptographically strong key from a password or token and activate it framework-wide.

```js
import { setCryptoKey } from '../ln-core';

// Typically called on user login or application bootstrap
await setCryptoKey('my-super-secret-user-passphrase-or-session-token');
```

- **`secretString`** — raw string value. Passing `null`, `undefined`, or an empty string deactivates encryption.
- **Returns** `Promise<void>`. Resolves when the key is successfully derived and imported.

### getCryptoKey()

Retrieve the currently active `CryptoKey` object instance.

```js
import { getCryptoKey } from '../ln-core';

const key = getCryptoKey(); // null or CryptoKey
```

- **Returns** `CryptoKey` or `null` if no key has been derived yet.

### encryptData(plainData, key = null)

Encrypt any serializable value (objects/arrays are converted to JSON strings).

```js
import { encryptData } from '../ln-core';

const result = await encryptData({ text: 'Sensitive message' });
// {
//   encrypted: true,
//   iv: 'base64-iv-string...',
//   data: 'base64-ciphertext...'
// }
```

- **`plainData`** — any primitive value, array, or object.
- **`key`** — optional custom `CryptoKey`. Defaults to the active global key.
- **Returns** `Promise<Object>` containing `encrypted: true`, base64 `iv`, and base64 `data`. Returns raw `plainData` if no active key is available.

### decryptData(encryptedObject, key = null)

Decrypt an encrypted object back into its original form (automatically parsing JSON strings back to objects).

```js
import { decryptData } from '../ln-core';

const decrypted = await decryptData(result);
console.log(decrypted.text); // 'Sensitive message'
```

- **`encryptedObject`** — an object generated by `encryptData`.
- **`key`** — optional custom `CryptoKey`. Defaults to the active global key.
- **Returns** `Promise<any>`. The original plain data, or `{ ...encryptedObject, decryptionError: true }` if decryption failed (e.g., incorrect key).

---

## Typical Usage Pattern

```js
import { dispatch, dispatchCancelable, guardBody, findElements, deepReactive, createBatcher, fill, renderList } from '../ln-core';

(function () {
    const DOM_SELECTOR = 'data-ln-example';
    const DOM_ATTRIBUTE = 'lnExample';
    if (window[DOM_ATTRIBUTE] !== undefined) return;

    function constructor(domRoot) {
        findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
    }

    function _component(dom) {
        this.dom = dom;
        const self = this;

        // Reactive state + batched rendering
        const batchRender = createBatcher(function () { self._render(); });
        this.state = deepReactive({ items: [] }, batchRender);

        return this;
    }

    _component.prototype._render = function () {
        renderList(this.dom, this.state.items, 'example-item',
            function (item) { return item.id; },
            function (el, item) { fill(el, item); },
            'ln-example'
        );
    };

    // ... observer, init ...
    window[DOM_ATTRIBUTE] = constructor;
})();
```

---

## The `data-ln-value` Primitive

A locale-formatted cell/item shows a human-readable string; the raw machine
value lives in `data-ln-value`. Sort and filter operate on the raw value —
**never** on the formatted text.

```html
<td data-ln-value="1250.50">$1,250.50</td>
<td data-ln-value="1700000000">15 Nov 2023</td>
```

### Raw format

- **Amounts** — plain number, dot decimal, NO thousands grouping: `1250.50`.
- **Dates** — numeric Unix timestamp, consistent per column (demo uses seconds,
  e.g. `1700000000`).

### Why (the gotcha)

Sort coerces with `parseFloat(raw) || 0`. Formatted display text breaks it:

| Formatted text | `parseFloat` sees | Correct raw |
|----------------|-------------------|-------------|
| `1.250` (EU grouping) | `1.25` ❌ | `1250` |
| `15.11.2023` | `15.11` ❌ | `1700000000` (timestamp) |
| `2026-04-12` | `2026` ❌ | timestamp |

### The split

- `data-ln-value` — the VALUE. Universal. Read by `ln-core.readValue`.
- `data-ln-table-sort` — the BEHAVIOR/type (`string|number|date`).
  Component-scoped (lives on `<th>`). A future `data-ln-list-sort` would be its
  list-scoped sibling. Never universalize behavior; never scope the value.

### The reader

`ln-core.readValue(el)` is the single extraction path — that is what makes the
attribute cross-component. `ln-table` reads through it today; `ln-list` and any
future value-sorting component go through the same helper.

### Formatting responsibility

The client never re-formats — it only reorders/filters by raw. Formatting is
the server's job: Blade/PHP in SSR mode, or the API payload in data-driven mode.
`<html lang>` drives `Intl.Collator` for string sort.

### Per mode

- **SSR** — the raw value lives in `data-ln-value` on the element. `readValue`
  pulls it during `_parseRows`.
- **Data-driven** — the raw value lives in the record field (API payload); the
  rendered element may also carry `data-ln-value`. Sorting runs on the record
  field. Never sort formatted text.
