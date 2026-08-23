# ln-ui-coordinator

A general-purpose **Layer 2 Coordinator** that mediates UI triggers, modals (`ln-modal`), AJAX (`ln-ajax`), uploads (`ln-upload`), record filling (`ln-fill`), and toast notifications (`ln-toast`).

---

## 1. Responsibilities

1. **Modal Triggers & Hash Navigation:** Listens for clicks on `[data-ln-modal-for]` triggers and `a[href^="#"]` hash anchors, synchronizing the active modal state with the URL hash and handling `new` / `edit` modes.
2. **Dynamic Form & Record Population:** Bridges trigger payloads (`data-ln-fill-*`) and emits `ln-fill:request` on modal open.
3. **AJAX Submit Mediation:** Catches `ln-ajax:success` events:
   - Dispatches `ln-toast:enqueue` notifications when the server returns `{ message: { body, title?, type? } }` (where `body` is required).
   - Closes the active modal (if submit originated inside a modal), cleans URL hash, and resets the form.
4. **Error Feedback & Resilience:** Catches `ln-ajax:error`:
   - Dispatches error toasts on server error envelopes or network failures (with fallback support via `data-ln-ui-coordinator-dict`).
   - Climbs parent coordinator containers to inherit and merge dictionary translations hierarchically.
   - Keeps modals open on error so form validation messages remain visible.
5. **Upload Feedback Mediation:** Catches `ln-upload:invalid` and `ln-upload:error`:
   - Dispatches error toasts with translated messages (`upload-invalid-title`, `upload-invalid-type`, `upload-max-size`, `upload-max-files`, `upload-error-title`, `upload-failed`).

---

## 2. HTML Markup

```html
<!-- Wrapper container or dialog with localized fallback messages -->
<main data-ln-ui-coordinator>
    <ul hidden>
        <li data-ln-ui-coordinator-dict="network-error">Network connection failed.</li>
        <li data-ln-ui-coordinator-dict="network-error-title">Connection Error</li>
        <li data-ln-ui-coordinator-dict="server-error">The server encountered an error.</li>
        <li data-ln-ui-coordinator-dict="server-error-title">Server Error</li>
        <li data-ln-ui-coordinator-dict="upload-invalid-title">Invalid File</li>
        <li data-ln-ui-coordinator-dict="upload-invalid-type">This file type is not allowed.</li>
        <li data-ln-ui-coordinator-dict="upload-max-size">File size exceeds maximum allowed limit.</li>
        <li data-ln-ui-coordinator-dict="upload-max-files">Maximum number of uploaded files exceeded.</li>
        <li data-ln-ui-coordinator-dict="upload-error-title">Upload Error</li>
        <li data-ln-ui-coordinator-dict="upload-failed">Failed to upload file.</li>
    </ul>

    <!-- Triggers -->
    <button type="button" data-ln-modal-for="user-modal">New User</button>
    <a href="#user-modal:42" data-ln-fill-id="42" data-ln-fill-name="Ada Lovelace">Edit #42</a>

    <!-- Modal Dialog -->
    <dialog class="ln-modal" data-ln-modal id="user-modal">
        <form action="/api/users" method="POST" data-ln-ajax id="user-form">
            <input type="text" name="name" required />
            <button type="submit">Save</button>
            <button type="button" data-ln-modal-close>Cancel</button>
        </form>
    </dialog>
</main>
```

---

## 3. Declarative Attributes

| Attribute | Element | Description |
|:---|:---|:---|
| `data-ln-ui-coordinator` | Container / Dialog | Activates UI orchestration on the element and its subtree, acting as dictionary host. |
| `data-ln-ui-coordinator-dict` | `<li>` element | Translatable fallback toast messages (see Dictionary Keys below). |
| `data-ln-modal-for="id"` | Trigger `<button>` | Opens the target `ln-modal` by id. |
| `data-ln-modal-mode="new\|edit"` | Trigger / `<dialog>` | Forces explicit modal creation or edit mode. |
| `data-ln-fill-*` | Trigger `<a>` | Passes record values to form controls inside the opened modal. |

### Dictionary Keys

| Key | Used For | Fallback |
|:---|:---|:---|
| `network-error` | Network disconnection error message | `Network error` |
| `network-error-title` | Network error toast title | `""` |
| `server-error` | HTTP server error message | `Server error` |
| `server-error-title` | HTTP server error toast title | `""` |
| `upload-invalid-title` | Invalid file toast title | `Invalid File` |
| `upload-invalid-type` | Invalid file extension / MIME message | `This file type is not allowed` |
| `upload-max-size` | Exceeded max size message | `File is too large` |
| `upload-max-files` | Exceeded max file count message | `Maximum file count exceeded` |
| `upload-error-title` | Upload failure toast title | `Upload Error` |
| `upload-failed` | Upload failure message | `Failed to upload file` |

---

## 4. DOM Events

| Event | Direction | Target | Description |
|:---|:---|:---|:---|
| `ln-modal:request-open` | Emits | `<dialog>` | Requests panel opening on target `ln-modal`. |
| `ln-modal:request-close` | Emits | `<dialog>` | Requests panel closing on target `ln-modal`. |
| `ln-fill:request` | Emits | `<dialog>` | Requests form data population for the opened modal. |
| `ln-toast:enqueue` | Emits | `window` | Dispatched with `{ type, title, message }` on AJAX responses or error fallbacks. |
| `click` | Listens | `document` | Intercepts modal triggers and hash links. |
| `submit` | Listens | `document` | Tracks native submissions in modals for clean hash/reload lifecycle. |
| `hashchange` | Listens | `window` | Synchronizes URL hash and active modals. |
| `ln-ajax:success` | Listens | `document` | Enqueues success toast, closes modal, and resets forms. |
| `ln-ajax:error` | Listens | `document` | Enqueues error toast while keeping modals open. |
| `ln-upload:invalid` | Listens | `document` | Enqueues error toast on file validation failure. |
| `ln-upload:error` | Listens | `document` | Enqueues error toast on upload failure. |
