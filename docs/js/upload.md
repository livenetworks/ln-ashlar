# Upload

File upload component — drag-and-drop zone with XHR progress, validation, and server communication. File: `js/ln-upload/ln-upload.js`.

## HTML

```html
<div data-ln-upload="/api/upload" data-ln-upload-accept=".pdf,.doc,.docx">
    <div class="ln-upload__zone">
        <p>Drop files here or click to browse</p>
        <small>Allowed: PDF, DOC</small>
    </div>
    <ul class="ln-upload__list"></ul>

    <!-- Optional dictionary for i18n -->
    <ul hidden>
        <li data-ln-upload-dict="remove">Remove</li>
        <li data-ln-upload-dict="error">Error</li>
        <li data-ln-upload-dict="invalid-type">File type not allowed</li>
    </ul>
</div>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-upload="url"` | Upload endpoint URL |
| `data-ln-upload-accept=".ext,.ext"` | Allowed extensions (comma-separated) |
| `data-ln-upload-context="value"` | Context string sent with upload |
| `data-ln-upload-dict="key"` | I18n text override for built-in messages |

## JS API (on container element)

```js
const el = document.querySelector('[data-ln-upload]');
el.lnUploadAPI.getFileIds();   // returns array of server IDs
el.lnUploadAPI.getFiles();     // returns [{serverId, name, size}, ...]
el.lnUploadAPI.clear();        // DELETE all from server, clear list
el.lnUploadAPI.destroy();      // remove all listeners, clear list, remove instance
```

## Events

| Event | Bubbles | `detail` |
|-------|---------|----------|
| `ln-upload:uploaded` | yes | `{ localId, serverId, name }` |
| `ln-upload:removed` | yes | `{ localId, serverId }` |
| `ln-upload:error` | yes | `{ file, message }` |
| `ln-upload:invalid` | yes | `{ file, message }` |
| `ln-upload:cleared` | yes | `{}` |

---

## Internal Architecture

### State

Each upload container has a closure-scoped `uploadedFiles` Map: `localId → { serverId, name, size }`. State is not reactive — DOM is mutated directly when XHR events fire.

`fileIdCounter` is a local integer counter for generating unique `localId` values (`'file-1'`, `'file-2'`, ...).

### Lifecycle

1. **Init**: `_initUpload(container)` — called by MutationObserver or `DOMContentLoaded`
2. **Guard**: `data-ln-upload-initialized` attribute prevents double-init
3. **Default template**: `_ensureDefaultItemTemplate()` runs once per init — if no `[data-ln-template="ln-upload-item"]` exists anywhere in the document, a default `<template>` is injected into `<body>` from an inline constant
4. **Input**: creates hidden `<input type="file" multiple>` if none found inside container
5. **Steady state**: file selected/dropped → `addFile()` → `cloneTemplateScoped` + `fill()` → XHR → DOM update via further `fill()` calls

### `addFile(file)` Flow

1. Validate extension against `data-ln-upload-accept` via `_isValidFile()`. If invalid: dispatch `ln-upload:invalid`, enqueue error toast (title + body from dict with English fallback), return.
2. `cloneTemplateScoped(container, 'ln-upload-item', 'ln-upload')` — looks for a scoped template inside the container first, then the global one, then the auto-injected default.
3. `fill(li, { name, sizeText: '0%', iconHref: '#' + iconId, removeLabel: dict.remove, uploading: true, error: false, deleting: false })` — populates text, icon `<use href>`, aria-label and state classes in one pass. The `ln-icons` observer picks up the `<use href>` swap and fetches the sprite.
4. Set `data-file-id` attribute (structural, not a `fill` slot). Disable the remove button (`btn.disabled = true`) until upload completes.
5. Append `<li>` to `.ln-upload__list`.
6. Open XHR POST to upload URL with `FormData`.
7. On progress: `progressBar.style.width = percent + '%'` + `fill(li, { sizeText: percent + '%' })`.
8. On 2xx: `fill(li, { sizeText: formatSize, uploading: false })`, enable remove button, store in `uploadedFiles` Map, update hidden inputs, dispatch `ln-upload:uploaded`.
9. On non-2xx or XHR error: `handleError(msg)` — sets progress bar to 100%, `fill(li, { sizeText: dict.error, uploading: false, error: true })`, dispatches `ln-upload:error`, enqueues error toast.

### Template slots

The component reads these slot attributes in the cloned `<li>`:

- `data-ln-field="name"` — file name text
- `data-ln-field="sizeText"` — status/size text, reused across states
- `data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"` — state class toggles
- `data-ln-attr="href:iconHref"` on a `<use>` element — file-type icon reference
- `data-ln-attr="aria-label:removeLabel, title:removeLabel"` on the remove button
- `data-ln-upload-action="remove"` — behavioral hook for delegated click
- `.ln-upload__progress-bar` class — selected directly for `style.width` animation

The remove button listener is delegated on `.ln-upload__list` and resolved via `e.target.closest('[data-ln-upload-action="remove"]')`, so clicks on nested `<svg>`/`<use>` elements work correctly.

### File Icons

Icons are created via SVG `<use>` (loaded by icon loader):
- `#lnc-file-pdf`, `#lnc-file-doc`, `#lnc-file-epub` — custom CDN icons
- `#ln-file` — generic Tabler icon for all other types

### Hidden Inputs

After each upload, `updateHiddenInput()` rebuilds all `<input type="hidden" name="file_ids[]">` from the `uploadedFiles` Map. This ensures form submit sends only current (uploaded, not deleted) file IDs.

### Delete Flow

`removeFile(localId)`:
1. Look up `uploadedFiles.get(localId)` for `serverId`
2. If no `serverId` (still uploading) — just remove from DOM + Map
3. If `serverId` exists: `fill(item, { deleting: true })`, send `DELETE /files/{serverId}`
   - On success: remove from DOM + Map, dispatch `ln-upload:removed`
   - On non-200: `fill(item, { deleting: false })`, enqueue error toast (title + body from dict)
   - On network failure (catch): `fill(item, { deleting: false })`, enqueue error toast

### Auto-toast

The component dispatches `ln-toast:enqueue` on `window` for errors (invalid file type, upload error, delete error). This integrates automatically if `ln-toast` is present — no direct dependency.

### `destroy()`

Part of `container.lnUploadAPI`. Removes all event listeners (zone, input, list), clears `uploadedFiles`, empties `<ul>`, removes init guard attribute, and deletes the `lnUploadAPI` reference.

### MutationObserver

Global observer on `document.body`. Detects `[data-ln-upload]` elements added to the DOM and calls `_initUpload()` on them.
