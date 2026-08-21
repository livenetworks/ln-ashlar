# ln-upload

File upload component — drag-and-drop zone with progress tracking, client-side validation, SSR hydration, and automatic hidden input sync for form submissions.

## Rationale & Mindset

The `ln-upload` component follows an **HTML-first declarative design mindset**:
* **Inputs as Parameters**: Any metadata sent alongside uploaded files is defined via standard form fields (`<input type="hidden">`, `<select>`, etc.) inside the `[data-ln-upload]` container and dynamically serialized into `FormData`.
* **Zero JS UI Strings**: Localized messages and unit labels live in `<ul hidden><li data-ln-upload-dict="..."></li></ul>` (read once via `buildDict`), with number formatting resolved via `Intl.NumberFormat` with `getLocale(dom)`.
* **Pure Data Attributes (No BEM in JS)**: All JS behaviors bind strictly to declarative attributes (`[data-ln-upload-zone]`, `[data-ln-upload-list]`, `[data-ln-upload-item]`, `[data-ln-upload-progress]`, `[data-ln-progress]`, `[data-ln-upload-action="remove"]`).
* **SSR Hydration**: Pre-rendered server files inside `[data-ln-upload-list]` carrying `data-ln-upload-id="123"` are automatically hydrated into internal state on mount.

## Attributes

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-ln-upload="URL"` | Container | Upload POST endpoint URL |
| `data-ln-upload-accept=".pdf,.doc"` | Container / Input | Allowed extensions or MIME patterns (e.g. `pdf,doc`, `.pdf,.docx`, `image/*`) |
| `data-ln-upload-delete="URL/{id}"` | Container | Optional delete URL pattern containing `{id}` |
| `data-ln-upload-max-size="10485760"` | Container | Maximum allowed file size in bytes |
| `data-ln-upload-max-files="5"` | Container | Maximum total uploaded files limit |
| `data-ln-upload-file-field="file"` | Container | Name of the file field in `FormData` (default: `file`) |
| `data-ln-upload-ids-field="file_ids[]"` | Container | Name of the synced hidden inputs (default: `file_ids[]`) |
| `data-ln-upload-dict="key"` | Hidden `<li>` | Dictionary entries for translations |

## Dictionary (i18n)

All keys are optional. Dict entries are read once at init via `buildDict()` and removed from the DOM:

| Key | Purpose | Fallback |
|-----|---------|----------|
| `remove` | Remove button aria-label and tooltip | `Remove` |
| `error` | Status text when upload fails | `Error` |
| `unit-b`, `unit-kb`, `unit-mb`, `unit-gb` | Localized byte units | `B`, `KB`, `MB`, `GB` |

## HTML Structure

```html
<div data-ln-upload="/files/upload" data-ln-upload-accept="pdf,doc,docx" data-ln-upload-delete="/files/{id}">
    <input type="file" multiple hidden>

    <!-- Scoped Template -->
    <template data-ln-template="ln-upload-item">
        <li data-ln-upload-item>
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-file"></use></svg>
            <span data-ln-field="name"></span>
            <span data-ln-field="sizeText"></span>
            <button type="button" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
            </button>
            <div data-ln-upload-progress>
                <div data-ln-progress="0"></div>
            </div>
        </li>
    </template>

    <div data-ln-upload-zone>
        <p>Drop files here or click to browse</p>
    </div>

    <ul data-ln-upload-list>
        <!-- SSR Pre-rendered files are hydrated automatically on mount -->
        <li data-ln-upload-item data-ln-upload-id="42" data-ln-upload-ext="pdf" data-ln-upload-size="1200000">
            <span data-ln-field="name">contract.pdf</span>
            <span data-ln-field="sizeText">1.2 MB</span>
            <button type="button" data-ln-upload-action="remove"><svg class="ln-icon"><use href="#ln-icon-x"></use></svg></button>
        </li>
    </ul>
</div>
```

## Programmatic API

```javascript
const el = document.querySelector('[data-ln-upload]');

el.lnUpload.getFileIds();   // ['42', '43']
el.lnUpload.getFiles();     // [{ serverId: '42', name: 'contract.pdf', size: 1200000 }]
el.lnUpload.upload(files);  // Upload FileList or Array of File objects
el.lnUpload.remove(id);     // Remove by localId or serverId
el.lnUpload.clear();        // Clear and delete all files
el.lnUpload.destroy();      // Clean up listeners and abort in-flight uploads
```

## Custom Events

| Event | Type | Detail |
|-------|------|--------|
| `ln-upload:request-upload` | Command | `{ files: FileList \| File[] }` |
| `ln-upload:request-remove` | Command | `{ localId?: string, serverId?: string\|number }` |
| `ln-upload:request-clear` | Command | `{}` |
| `ln-upload:before-upload` | Cancelable | `{ file: File }` |
| `ln-upload:before-remove` | Cancelable | `{ localId: string, serverId: string\|number }` |
| `ln-upload:before-clear` | Cancelable | `{}` |
| `ln-upload:uploaded` | Notification | `{ localId, serverId, name, size, response }` |
| `ln-upload:progress` | Notification | `{ localId, file, percent, loaded, total }` |
| `ln-upload:removed` | Notification | `{ localId, serverId }` |
| `ln-upload:invalid` | Notification | `{ file, reason }` |
| `ln-upload:error` | Notification | `{ file, message, status, error }` |
| `ln-upload:cleared` | Notification | `{}` |
| `ln-upload:destroyed` | Notification | `{ target }` |

---

## 🔧 Internals

Source: `js/ln-upload/src/ln-upload.js`. Registered via `registerComponent('data-ln-upload', 'lnUpload', _component, 'ln-upload')`.

### State & Storage
Each container holds an internal `uploadedFiles` Map (`localId -> { serverId, name, size, xhr? }`). Unique local IDs (`file-1`, `file-2`, ...) identify in-DOM items across their lifecycle.

### SSR Hydration Flow
During `_hydrate()`, `ln-upload` scans `[data-ln-upload-list] [data-ln-upload-item]` and pre-rendered hidden inputs:
1. Resolves `serverId` from `data-ln-upload-id` and assigns a local identifier (`data-ln-upload-local-id`).
2. Reads `name` from `[data-ln-field="name"]` and `size` from `data-ln-upload-size` or `[data-ln-field="sizeText"]`.
3. Registers existing files into `uploadedFiles` and ensures hidden `<input type="hidden" name="file_ids[]">` elements match without duplicates.

### Upload Flow
1. Files dropped or picked pass through client validation (`accept`, `maxSize`, `maxFiles`). If invalid, `ln-upload:invalid` is emitted.
2. `dispatchCancelable('ln-upload:before-upload', { file })` is checked.
3. The scoped template `ln-upload-item` is cloned and mounted into `[data-ln-upload-list]`, stamped with `data-ln-upload-local-id` and `data-ln-upload-ext`.
4. `FormData` is built by appending the file under `fileFieldName` and serializing any nested inputs (skipping `idsFieldName`).
5. Real-time progress updates `[data-ln-progress]` attribute and emits `ln-upload:progress`.
6. On success, `data-ln-upload-id` is assigned, size is formatted via `Intl.NumberFormat`, hidden inputs are synced via `_syncHiddenInputs()`, and `ln-upload:uploaded` is dispatched.

### Removal & Clear Flows
- **`remove(id)`**: Cancels in-flight XHR if active. If `serverId` exists and a delete URL pattern is configured, sends a `DELETE` request. On success, removes the item from DOM, deletes from `uploadedFiles`, syncs hidden inputs, and emits `ln-upload:removed`.
- **`clear()`**: Checks `ln-upload:before-clear` once. Aborts all active uploads, issues background DELETE requests for existing server files, clears `uploadedFiles`, empties the list container, syncs hidden inputs, and immediately emits `ln-upload:cleared`.

### Teardown
`destroy()` aborts all pending XHRs, removes event listeners (drag/drop, input change, removal clicks, command listeners), clears internal state and dictionary, and emits `ln-upload:destroyed`.
