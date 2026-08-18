# ln-include

External partial loader for `<template>` elements.

`ln-include` lets the *content* of an existing `<template>` be loaded from an external file asynchronously, while the template keeps its own identity. Because only the content moves, no consuming component changes: `cloneTemplate` and router view cloning continue to function seamlessly.

---

## 🧭 Philosophy

- **Zero JS View Logic:** Pages that don't need a build step can share templates, empty states, or route views across files without copy-pasting.
- **Boot Gating (No race conditions):** Automatically delays page-wide component initialization (e.g., `ln-table` data fetches) until all synchronous initial template fetches are complete.
- **Deduplication:** Multiple host elements pointing to the same external URL share a single fetch promise, avoiding duplicate network requests.
- **Orthogonality:** The component only populates its host `<template>`. It does not parse or initialize nested components; the central MutationObserver handles subtree additions as they enter the document.

---

## 📦 Minimal Blueprint

```html
<template data-ln-template="documents-row" data-ln-include="/tpl/documents-row.html"></template>
```

When compiled/loaded, the contents of `/tpl/documents-row.html` are fetched and injected into the template's `.content` fragment.

---

## 🛠️ Declarative API Contract

### Attributes

| Attribute | Value | Description |
|---|---|---|
| `data-ln-include` | `URL` | The external URL to fetch HTML content from. Only valid on `<template>` elements. |

---

## ⚡ DOM Events

The component dispatches bubbling events from the host `<template>` element:

| Event | `detail` Object | Description |
|---|---|---|
| `ln-include:loaded` | `{ target, url }` | Dispatched when the HTML content is successfully fetched, parsed, and injected. |
| `ln-include:error` | `{ target, url, error }` | Dispatched when the fetch fails. |

---

## ⚠️ Common Pitfalls

- **Content vs. Registry:** The partial file must contain the *content* of the template itself (e.g. `<tr>...</tr>`), NOT a registry of named `<template>` wrappers. (Nested templates at any depth inside the partial are supported, but wrapping the partial itself in `<template data-ln-template="...">` inside the file will lead to redundant nesting).
- **Template Hosts Only:** Placing `data-ln-include` on non-`<template>` elements (e.g. `<div>`) is not supported. Such hosts are never matched by the component's selector, so they are silently ignored and no fetch is attempted.
- **Late-entering Hosts are Ungated:** Hosts created and inserted into the DOM *after* the initial page boot are processed by the MutationObserver, but they do not gate the page (they load asynchronously while other components run).
- **Standalone Bundle Script Order:** If you load individual component files (e.g. `js/ln-table/ln-table.js`) instead of using the master bundle (`js/index.js`), you **must** ensure that `ln-include.js` executes before all other components. Use plain script tags or `defer` (never `async`), otherwise other components will run their DOMContentLoaded sweeps and bypass the gate.

---

## 🔧 Internals

During page loading, `ln-include` hooks into `holdInit()` and `releaseInit()`. When the page boots:
1. `ln-include` discovers all initial `template[data-ln-include]` hosts.
2. It calls `holdInit()` for each valid host, raising the global pending boot counter.
3. Other components check the counter during their boot phase and queue their initialization functions if the counter is above zero.
4. Each fetch fetches and caches the request promise to deduplicate network requests. A rejected promise is evicted from the cache the moment it rejects, so a host created later (e.g. via the MutationObserver) retries the fetch rather than failing instantly against a stale rejection.
5. The HTML is parsed using a dummy `<template>` element (which preserves table-specific nodes like `<tr>`, `<td>`, `<option>`) and appended to `this.dom.content`.
6. Once a load succeeds or fails, the host calls `releaseInit()`.
7. Once the counter reaches zero, the boot queue is drained in push order.
