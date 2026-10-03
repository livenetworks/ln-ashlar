# ln-ui-coordinator

> Applied to a container element (`<main data-ln-ui-coordinator>`). It listens for clicks on `a[href^="#"]` hash anchors and window `hashchange` events to synchronize `[data-ln-modal]` dialogs with the URL hash, intercepts bubbling `ln-ajax:success`/`ln-ajax:error` and `ln-upload:error` events to dispatch `ln-toast:enqueue` notifications from server response envelopes, and clears the modal URL hash and closes active modals upon successful AJAX submit. Button triggers (`data-ln-modal-for`) are handled autonomously by `ln-modal`.

A minimal **Layer 2 Coordinator** that mediates URL hash navigation, modal lifecycle, and server toast notifications.

---

## 1. Responsibilities

1. **Hash Navigation & URL Synchronization:** Listens for clicks on `a[href^="#"]` hash anchors and window `hashchange` events, dispatching `ln-modal:request-open` to matching dialogs. Listens to `ln-modal:close` to clean up the URL hash segment.
2. **AJAX Submit Mediation:** Catches `ln-ajax:success` events:
   - Dispatches `ln-toast:enqueue` notifications when the server returns `{ message: ... }`.
   - Closes the active modal (if submit originated inside a modal) and cleans URL hash (`hashSet(modal.id, null)`).
3. **Server Error Feedback:** Catches `ln-ajax:error` and `ln-upload:error`:
   - Dispatches error toasts when the server returns an error message.
   - Keeps modals open on error so form validation messages remain visible.

---

## 2. HTML Markup

```html
<main data-ln-ui-coordinator>
    <!-- Triggers (button opens autonomously; hash anchor deep-links) -->
    <button type="button" data-ln-modal-for="user-modal">New User</button>
    <a href="#user-modal">Open User Modal</a>

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
| `data-ln-ui-coordinator` | Container | Activates UI coordination for hash-routing, modal closing on AJAX success, and server toast dispatching. |

---

## 4. DOM Events

| Event | Direction | Target | Description |
|:---|:---|:---|:---|
| `ln-modal:request-open` | Emits | `<dialog>` | Requests panel opening on target `ln-modal` from URL hash routes. |
| `ln-modal:request-close` | Emits | `<dialog>` | Requests panel closing on target `ln-modal` upon AJAX success. |
| `ln-toast:enqueue` | Emits | `window` | Dispatched with server `{ type, title, message }` from response envelopes. |
| `click` | Listens | `document` | Intercepts `a[href^="#"]` hash navigation links. |
| `hashchange` | Listens | `window` | Synchronizes URL hash and active modals. |
| `ln-modal:close` | Listens | `document` | Cleans up modal hash segment when modal closes. |
| `ln-ajax:success` | Listens | `document` | Relays server message to toast, cleans modal URL hash, and closes parent modal. |
| `ln-ajax:error` | Listens | `document` | Relays server error message to toast while keeping modal open. |
| `ln-upload:error` | Listens | `document` | Relays server error message to toast. |
