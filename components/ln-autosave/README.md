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

Access the persistence instance directly via the `lnAutosave` property on the form element:

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
- **Excluded Inputs:** `ln-autosave` automatically ignores disabled inputs, button elements, `type="file"`, `type="password"`, inputs missing a `name` attribute, and any element matching `[data-ln-autosave-exclude]`.

---

## 🔧 Internals

Source: `components/ln-autosave/ln-autosave.js` (~150 lines). No `.scss` file — the component has no visual surface, no class it sets, no CSS-driving attribute.

### State

Per-form instance (`form.lnAutosave`): `dom`, `key` (resolved once at construction — `ln-autosave:{pathname}:{identifier}`; mutating the attribute, `form.id`, or navigating via the History API afterwards does NOT re-key — destroy and re-mount to switch), and the bound handlers (`_onFocusout`, `_onChange`, `_onSubmit`, `_onReset`, `_onClearClick`, plus `_onInput` only when debounce is opted in) held so `destroy()` can pass matching references to `removeEventListener`.

### Storage key

`_getStorageKey` resolves `identifier` from the attribute value if non-empty, else `form.id`. Empty attribute (`data-ln-autosave=""`) falls through to `form.id`; missing both returns `null` and construction aborts with a console warning — `form.lnAutosave` is never set.

### Save / restore / clear

- **Save** (`focusout`, `change`, optional debounced `input`): `serializeForm` → `localStorage.setItem`, wrapped in a silent `try/catch` (`QuotaExceededError`, storage disabled). A failed write fires no event — there is no `:save-failed`.
- **Restore** (construction-time only): read + parse (silent try/catch) → cancelable `:before-restore` → `populateForm` → dispatch synthetic `input` **and** `change` on every restored field (covers both signal types regardless of field kind: text/textarea react to `input`, checkbox/radio/select to `change`) → `:restored`. Events fire after all fields are written, so cross-field validation sees the fully-restored form.
- **Clear**: `localStorage.removeItem` (idempotent) → `:cleared`. Triggered by native `submit` (not by `form.submit()` — that call bypasses the event; use `requestSubmit()`), native `reset`, or a click on `[data-ln-autosave-clear]`. Touches only the storage entry, never field values.

### Debounce is input-only, opt-in

`focusout`/`change` are naturally rate-limited by user behaviour (one event per field visit) — no debounce needed. `input` fires per keystroke, so `data-ln-autosave-debounce-input` exists as an explicit opt-in for compose-style fields the user never blurs. Default off. The interval is read once at construction (`_resolveDebounceMs`); mutating the attribute afterwards has no effect on a live instance.

### MutationObserver

`registerComponent` watches `childList` (new `[data-ln-autosave]` forms) and `attributes` (filtered to `data-ln-autosave` only — NOT `-clear` or `-debounce-input`). The clear-button delegate uses `closest()` per click, so `data-ln-autosave-clear` works even if added after construction; the debounce attribute does not, since it's read once.

### Destroy

Removes all five listeners (plus `input` and its pending timer if debounce was active), dispatches `:destroyed`, deletes the instance. Does **not** call `_clear()` — the draft persists after destroy; destroy means "stop autosaving," not "discard the draft."
