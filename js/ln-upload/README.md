# ln-upload

File upload component — drag & drop zone with progress bar, validation, and server communication.
Automatic upload on file select/drop, with progress tracking via XHR. File deletion from server.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-upload="/files/upload"` | container | Upload URL (default: `/files/upload`) |
| `data-ln-upload-accept=".pdf,.doc,.docx"` | container | Allowed extensions (comma-separated) |
| `data-ln-upload-context="documents"` | container | Context string sent with upload (FormData `context` field) |
| `data-ln-upload-dict="key"` | hidden element | I18n dictionary for messages (see below) |

## Dictionary (i18n)

All keys are optional. If a key is missing, the component falls back to the English value shown below. Dict entries are read once at init via `buildDict()` and then removed from the DOM.

| Key | Used for | Fallback |
|-----|----------|----------|
| `remove` | Remove button aria-label and tooltip | `Remove` |
| `error` | Size slot text when upload fails | `Error` |
| `invalid-type` | Toast body — wrong extension | `This file type is not allowed` |
| `upload-failed` | Toast body — upload error | `Upload failed` |
| `delete-error` | Toast body — delete error | `Failed to delete file` |
| `network-error` | XHR network error + toast title for delete | `Network error` |
| `invalid-title` | Toast title — invalid file | `Invalid File` |
| `error-title` | Toast title — upload error | `Upload Error` |
| `delete-title` | Toast title — delete error | `Error` |
| `connection-error` | Toast body — delete fetch network failure | `Could not connect to server` |

Example (full override):

```html
<ul hidden>
	<li data-ln-upload-dict="remove">Ukloni</li>
	<li data-ln-upload-dict="error">Greška</li>
	<li data-ln-upload-dict="invalid-type">Tip fajla nije dozvoljen</li>
	<li data-ln-upload-dict="invalid-title">Neispravan fajl</li>
	<!-- ... other keys as needed -->
</ul>
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.ln-upload__zone` | Drag & drop zone (clickable) |
| `.ln-upload__zone--dragover` | When a file is dragged over the zone |
| `.ln-upload__list` | List of uploaded files |
| `.ln-upload__item` | Individual file |
| `.ln-upload__item--uploading` | File currently uploading |
| `.ln-upload__item--error` | Failed upload |
| `.ln-upload__item--deleting` | File being deleted from server |
| `.ln-upload__name` | File name |
| `.ln-upload__size` | Size / percentage |
| `.ln-upload__remove` | Delete button |
| `.ln-upload__progress` | Progress bar container |
| `.ln-upload__progress-bar` | Progress bar (width %) |

## Customization — item template

The component clones a `<template data-ln-template="ln-upload-item">` for every file row. Lookup order:

1. **Scoped** — a `<template>` inside the `[data-ln-upload]` container (per-instance override)
2. **Global** — a `<template>` anywhere at document root
3. **Auto-injected default** — the component inserts a default template into `<body>` on first init if none is present, so zero-config usage keeps working

### Required slots

Your template MUST include these elements for the component to function:

| Element | Attribute | Purpose |
|---------|-----------|---------|
| `<li>` root | `data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"` | State classes toggled via `fill()` |
| File name target | `data-ln-field="name"` | File name text |
| Size/status target | `data-ln-field="sizeText"` | `"0%"` → `"45%"` → `"12.3 KB"` → `"Error"` |
| File icon `<use>` | `data-ln-attr="href:iconHref"` | Auto-swapped to `#ln-file` / `#lnc-file-pdf` / `#lnc-file-doc` / `#lnc-file-epub` based on extension |
| Remove button | `data-ln-upload-action="remove"` and `data-ln-attr="aria-label:removeLabel, title:removeLabel"` | Click target (attribute-based, not class-based) |
| Progress bar | `class="ln-upload__progress-bar"` | Width is animated imperatively via inline style |

### Example — override with a two-line article layout

```html
<div data-ln-upload="/files/upload">
	<template data-ln-template="ln-upload-item">
		<li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting">
			<svg class="ln-icon ln-icon--lg" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg>
			<article>
				<p class="ln-upload__name" data-ln-field="name"></p>
				<small class="ln-upload__size" data-ln-field="sizeText"></small>
			</article>
			<button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel">
				<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
			</button>
			<div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div>
		</li>
	</template>
	<div class="ln-upload__zone"><p>Drop files</p></div>
	<ul class="ln-upload__list"></ul>
</div>
```

## API

```javascript
// Instance API (on container element)
const uploader = document.getElementById('my-upload');

uploader.lnUploadAPI.getFileIds();   // [1, 2, 3] — server IDs
uploader.lnUploadAPI.getFiles();     // [{serverId, name, size}, ...]
uploader.lnUploadAPI.clear();        // Deletes everything (from server too)

// Global API — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnUpload.init(containerElement);  // Manual initialization
window.lnUpload.initAll();               // Initialize all
```

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-upload:uploaded` | yes | `{ localId, serverId, name }` |
| `ln-upload:error` | yes | `{ file, message }` |
| `ln-upload:invalid` | yes | `{ file, message }` |
| `ln-upload:removed` | yes | `{ localId, serverId }` |
| `ln-upload:cleared` | yes | `{}` |

## Server API

### Upload (POST)

Request: `multipart/form-data` with `file` and `context` fields.
Headers: `X-CSRF-TOKEN`, `Accept: application/json`

Expected response:
```json
{ "id": 123, "name": "document.pdf", "size": 45678 }
```

### Delete (DELETE `/files/{id}`)

Headers: `X-CSRF-TOKEN`, `Accept: application/json`
Expected status: `200`

## HTML Structure

```html
<div data-ln-upload="/files/upload" data-ln-upload-accept=".pdf,.doc,.docx" data-ln-upload-context="documents">
    <!-- Optional: scoped item template override (see "Customization" section) -->
    <!-- <template data-ln-template="ln-upload-item"> ... </template> -->

    <div class="ln-upload__zone">
        <p>Drag files here or click to browse</p>
    </div>
    <ul class="ln-upload__list"></ul>

    <!-- Dictionary (optional, for i18n) -->
    <ul hidden>
        <li data-ln-upload-dict="remove">Remove</li>
        <li data-ln-upload-dict="error">Error</li>
        <li data-ln-upload-dict="invalid-type">This file type is not allowed</li>
    </ul>
</div>
```

## Programmatic

```javascript
// Listen for successful upload
document.addEventListener('ln-upload:uploaded', function(e) {
    console.log('Uploaded:', e.detail.name, 'Server ID:', e.detail.serverId);
});

// Get all uploaded IDs before form submit
const ids = document.getElementById('my-upload').lnUploadAPI.getFileIds();
```

## File Icons

The component automatically adds an SVG icon per file type using the icon loader:
- `#lnc-file-pdf` — PDF (custom CDN)
- `#lnc-file-doc` — DOC/DOCX (custom CDN)
- `#lnc-file-epub` — EPUB (custom CDN)
- `#ln-file` — all other types (Tabler CDN)

Custom icons require `window.LN_ICONS_CUSTOM_CDN` to be set. See `js/ln-icons/README.md`.

## Hidden Inputs

After each successful upload, the component automatically creates `<input type="hidden" name="file_ids[]" value="serverId">` for each file. On form submit, the server receives the IDs directly.
