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

```html
<span data-ln-upload-dict="remove" hidden>Remove</span>
<span data-ln-upload-dict="error" hidden>Error</span>
<span data-ln-upload-dict="invalid-type" hidden>This file type is not allowed</span>
<span data-ln-upload-dict="upload-failed" hidden>Upload failed</span>
<span data-ln-upload-dict="delete-error" hidden>Delete failed</span>
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

## API

```javascript
// Instance API (on container element)
const uploader = document.getElementById('my-upload');

uploader.lnUploadAPI.getFileIds();   // [1, 2, 3] — server IDs
uploader.lnUploadAPI.getFiles();     // [{serverId, name, size}, ...]
uploader.lnUploadAPI.clear();        // Deletes everything (from server too)

// Global API
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
    <div class="ln-upload__zone">
        <p>Drag files here or click to browse</p>
    </div>
    <ul class="ln-upload__list"></ul>

    <!-- Dictionary (optional, for i18n) -->
    <span data-ln-upload-dict="remove" hidden>Remove</span>
    <span data-ln-upload-dict="error" hidden>Error</span>
    <span data-ln-upload-dict="invalid-type" hidden>This file type is not allowed</span>
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

The component automatically adds a CSS class for the file icon:
- `.ln-icon-file-pdf` — PDF
- `.ln-icon-file-doc` — DOC/DOCX
- `.ln-icon-file-epub` — EPUB
- `.ln-icon-file` — other

## Hidden Inputs

After each successful upload, the component automatically creates `<input type="hidden" name="file_ids[]" value="serverId">` for each file. On form submit, the server receives the IDs directly.
