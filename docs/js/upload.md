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
    <span data-ln-upload-dict="remove" hidden>Remove</span>
    <span data-ln-upload-dict="error" hidden>Error</span>
    <span data-ln-upload-dict="invalid-type" hidden>File type not allowed</span>
</div>
```

No `<template>` element needed — the component creates DOM imperatively via `createElement`.

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
3. **Input**: creates hidden `<input type="file" multiple>` if none found inside container
4. **Steady state**: file selected/dropped → `addFile()` → XHR → DOM update

### `addFile(file)` Flow

1. Validate extension against `data-ln-upload-accept` via `_isValidFile()`. If invalid: dispatch `ln-upload:invalid`, enqueue error toast, return.
2. Create `<li>` with icon, name, size/progress text, remove button, progress bar — appended to `.ln-upload__list`
3. Open XHR POST to upload URL with `FormData`
4. On progress: update progress bar width + `sizeSpan.textContent` as percent
5. On load success: remove `--uploading` class, show formatted file size, enable remove button, store in `uploadedFiles` Map, update hidden inputs, dispatch `ln-upload:uploaded`
6. On error: add `--error` class, dispatch `ln-upload:error`, enqueue error toast

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
3. If `serverId` exists: add `--deleting` class, send `DELETE /files/{serverId}`, on success: remove from DOM + Map, dispatch `ln-upload:removed`

### Auto-toast

The component dispatches `ln-toast:enqueue` on `window` for errors (invalid file type, upload error, delete error). This integrates automatically if `ln-toast` is present — no direct dependency.

### `destroy()`

Part of `container.lnUploadAPI`. Removes all event listeners (zone, input, list), clears `uploadedFiles`, empties `<ul>`, removes init guard attribute, and deletes the `lnUploadAPI` reference.

### MutationObserver

Global observer on `document.body`. Detects `[data-ln-upload]` elements added to the DOM and calls `_initUpload()` on them.
