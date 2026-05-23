# ln-autosave

A zero-dependency, localStorage-backed **Draft Buffer Primitive** that prevents data loss by capturing form states. It automatically saves drafts on field boundaries, restores values on load, and clears them cleanly on submit, reset, or custom cancellations.

---

## 🧭 Philosophy & Architecture

1. **Synchronous local storage:** Unlike async network databases, `ln-autosave` uses browser `localStorage`. This ensures drafts are written instantly on field blur/leave (`focusout` / `change`), eliminating race conditions during page changes.
2. **Zero-Keystroke flood:** By default, writing only triggers on field blur. For continuous typing fields (like editors), an opt-in debounced input listener can be configured.
3. **Decoupled Event Restoration:** restored values are applied by dispatching standard synthetic `input` and `change` events. This ensures sibling primitives (such as `ln-validate` and `ln-autoresize`) re-evaluate automatically.

---

## 📦 Minimal Blueprint

```html
<form id="profile-edit" data-ln-autosave>
  <div class="form-element">
    <label for="bio">Biography</label>
    <textarea id="bio" name="bio" data-ln-autoresize rows="1"></textarea>
  </div>
  
  <ul class="form-actions">
    <li><button type="button" data-ln-autosave-clear>Cancel (clear draft)</button></li>
    <li><button type="submit">Save</button></li>
  </ul>
</form>
```

> [!IMPORTANT]
> The form **must** have a unique `id` or you must specify a custom identifier in `data-ln-autosave="identifier"`. The final storage key is scoped uniquely as `ln-autosave:{pathname}:{identifier}`.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-autosave` | `<form>` | Persistence marker. Value overrides the form ID lookup. |
| `data-ln-autosave-clear` | `<button>` | Click delegate. Instantly purges the localStorage entry. |
| `data-ln-autosave-debounce-input="ms"` | `<form>` | Opt-in. Saves on idle keystrokes (defaults to 1000ms if empty). |

### JS API

Access the persistence instance directly via the `lnAutoresize` property on the form element:

```javascript
const form = document.getElementById('profile-edit');

// 1. Back-reference properties
const storageKey = form.lnAutosave.key; // "ln-autosave:/path:profile-edit"

// 2. Clean up listeners and pending timers
form.lnAutosave.destroy();
```

---

## ⚡ DOM Events

### Emitted

| Event | Bubbles | Payload | Description |
| :--- | :--- | :--- | :--- |
| `ln-autosave:before-restore` | Yes (Cancelable) | `{ target, data }` | Fires before applying draft. Call `e.preventDefault()` to abort. |
| `ln-autosave:restored` | Yes | `{ target, data }` | Dispatched after populated values and synthetic events are sent. |
| `ln-autosave:saved` | Yes | `{ target, data }` | Dispatched on successful localStorage save. |
| `ln-autosave:cleared` | Yes | `{ target }` | Dispatched after localStorage item removal. |

---

## ⚠️ Common Pitfalls

- **Stale Drafts Overwriting Server Data:** On pages where the database has rendered new state, draft restores must be aborted:
  ```javascript
  document.addEventListener('ln-autosave:before-restore', function (e) {
      if (e.target.dataset.hasServerData === 'true') {
          e.preventDefault();
          localStorage.removeItem(e.target.lnAutosave.key);
      }
  });
  ```
- **ESC Modal Dismissals:** If a user closes a modal using the ESC key, no click triggers on cancel buttons. Wire draft cleanup to the modal's closed event manually:
  ```javascript
  modal.addEventListener('ln-modal:closed', () => {
      localStorage.removeItem(form.lnAutosave.key);
  });
  ```
- **Nameless & File Inputs:** `ln-autosave` ignores disabled inputs, button elements, `type="file"`, and inputs missing a `name` attribute.
