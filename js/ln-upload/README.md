# ln-upload

File upload component — drag-and-drop zone with XHR progress, client-side validation, and auto-rendered hidden inputs for form submit.

## Rationale & Mindset

Historically, the component used custom attributes like `data-ln-upload-context` to pass extra parameters (such as the context category `lecture`, `email_logo`, etc.) to the upload endpoint. This created a **tight coupling** between the generic frontend library component and specific project-level backend parameter names.

To make the component truly generic and declarative, it follows a **native-HTML form design mindset**:
* **Inputs as Parameters**: Any parameter or metadata that needs to be sent alongside the uploaded file is defined using standard HTML form inputs (e.g. `<input type="hidden">`, `<select>`, `<textarea>`) nested directly inside the `.ln-upload` container.
* **Dynamic Gathering**: When a file is dropped or selected, the component dynamically serializes all nested inputs and appends them to the `FormData` request.
* **Separation of Concerns**: The frontend library does not need to know about specific keys (like `context` or `entity_id`). It simply forwards whatever form inputs you declare.

### Benefits
1. **Zero Configuration for Backend Keys**: No need to rewrite the JS component if the backend changes a parameter name from `context` to `type` or requires extra fields.
2. **Dynamic Values**: If an input's value is modified by other scripts on the page prior to upload (e.g., dynamically setting an `entity_id` based on selection), the upload request will automatically receive the latest value at the moment of file dispatch.
3. **Decoupled Delete Routes**: The component derives the `DELETE` endpoint dynamically by replacing `/upload` in the upload URL with the file ID, or you can specify a custom delete pattern using `data-ln-upload-delete="/my-api/{id}"`.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-upload="/files/upload"` | container | Upload URL (default: `/files/upload`) |
| `data-ln-upload-accept=".pdf,.doc,.docx"` | container | Allowed extensions (comma-separated) |
| `data-ln-upload-delete="/files/{id}"` | container | Optional custom delete URL pattern containing `{id}` (default: derived dynamically by replacing `/upload` with the file ID) |
| `data-ln-upload-context="documents"` | container | **[DEPRECATED]** Legacy context string sent as `context` fallback if no `<input name="context">` is nested. |
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
				<span class="ln-upload__name" data-ln-field="name"></span>
				<span class="ln-upload__size" data-ln-field="sizeText"></span>
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
uploader.lnUploadAPI.destroy();      // Cleanup — remove listeners and clear state

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

### Recommended (New Declarative Approach)

Place nested hidden inputs (or any form fields) representing your upload metadata inside the container:

```html
<div class="ln-upload" data-ln-upload="/files/upload" data-ln-upload-accept=".pdf,.doc,.docx">
    <!-- Extra parameters sent dynamically to the POST endpoint -->
    <input type="hidden" name="context" value="documents">
    <input type="hidden" name="entity_id" value="123">

    <div class="ln-upload__zone">
        <p>Drag files here or click to browse</p>
    </div>
    <ul class="ln-upload__list"></ul>

    <!-- Dictionary (optional) — see "Dictionary (i18n)" section above -->
</div>
```

### Legacy (Attribute-Based Approach)

```html
<div class="ln-upload" data-ln-upload="/files/upload" data-ln-upload-accept=".pdf,.doc,.docx" data-ln-upload-context="documents">
    <div class="ln-upload__zone">
        <p>Drag files here or click to browse</p>
    </div>
    <ul class="ln-upload__list"></ul>
</div>
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

## Integration & Source Files

### Loading the Component

The `ln-upload` component can be integrated into your project using one of the following methods:

#### 1. In-Bundle (Standard Integration)
Include the main unified `ln-ashlar` bundle to load all component observers together, which is standard for full application environments:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### 2. Standalone (Zero-Dependency IIFE)
If you only need file upload capability without the rest of the bundle, load the standalone, self-registering IIFE version of the component directly:
```html
<script src="js/ln-upload/ln-upload.js" defer></script>
```

### Source Files

For reference, active development, or customization, the component's codebase is structured into two main files:

* **Active Development Source (ESM)**: The primary development file where all component features, drag-and-drop mechanics, validation, and XHR progress logic are implemented is [js/ln-upload/src/ln-upload.js](file:///c:/laragon/www/ln-ashlar/js/ln-upload/src/ln-upload.js).
* **Compiled Standalone (IIFE)**: The built zero-dependency distribution version compiled for browser execution is [js/ln-upload/ln-upload.js](file:///c:/laragon/www/ln-ashlar/js/ln-upload/ln-upload.js).
