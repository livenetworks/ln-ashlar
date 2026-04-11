# Core

Shared helper module imported by all components. File: `js/ln-core/`.

No DOM attribute, no constructor, no MutationObserver. Pure utility functions re-exported from `js/ln-core/index.js`.

## Exports

```js
import {
    cloneTemplate, cloneTemplateScoped, dispatch, dispatchCancelable,
    fill, renderList, buildDict, guardBody, findElements,
    reactiveState, deepReactive, createBatcher
} from '../ln-core';
```

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
const frag = cloneTemplateScoped(this.dom, 'column-filter', 'ln-data-table');
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
- Used by `ln-toast`, `ln-upload`, `ln-table` for complex state

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

### Supported components

| Component | `data-ln-persist` on | What's persisted | Stored value |
|-----------|---------------------|-----------------|--------------|
| ln-toggle | `[data-ln-toggle]` element | open/close state | `"open"` or `"close"` |
| ln-accordion | each `[data-ln-toggle]` inside | per-panel open/close | `"open"` or `"close"` |
| ln-tabs | `[data-ln-tabs]` wrapper (non-hash only) | active tab key | `"tab-key"` string |
| ln-table-sort | `[data-ln-table]` wrapper | sort column + direction | `{ col: number, dir: string }` |
| ln-filter | `[data-ln-filter]` element | selected filter values | `{ key: string, values: string[] }` |

### Graceful degradation

- localStorage disabled (private browsing) → silent no-op, components work normally without persistence
- localStorage full → silent no-op on write, existing data preserved
- Stale data (panel removed from DOM, column index out of range) → orphan key ignored gracefully
- Missing `id` + no explicit key → `console.warn` once, persistence skipped for that element

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
