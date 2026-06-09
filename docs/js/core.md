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

- Returns `root` for chaining
- Skips `null`/`undefined` values (existing content preserved)

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

- Walks text nodes via `TreeWalker(clone, NodeFilter.SHOW_TEXT)`
- Replaces `{{ key }}` with `data[key]` (whitespace inside braces is flexible)
- Missing keys produce empty string
- No-op when no `{{` found in any text node
- Returns `clone` for chaining
- Coexists with `fill()` — `{{ key }}` for inline text, `data-ln-field` for element content. Both patterns are valid and can be mixed in the same template
- Called automatically by `renderList` after cloning — templates can use `{{ key }}` text nodes alongside `data-ln-field` elements without extra code

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

### serializeForm(form)

Walk `form.elements`, return a plain object keyed by element `name`.

```js
const data = serializeForm(this.dom);
// { username: 'alice', roles: ['admin', 'editor'], country: 'mk' }
```

- Skips disabled fields, file inputs, submit / button inputs, and
  unnamed elements.
- Checkboxes collect as `string[]` under the shared `name`.
- Radios collect as a single `string` (winning value).
- `<select multiple>` collects as `string[]`.
- Everything else collects as the raw `el.value`.

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
- Checkbox + array value → `checked` if value is in the array.
- Checkbox + scalar value → `checked = !!value`.
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
