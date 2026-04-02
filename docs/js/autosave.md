# Autosave

Auto-save form data to `localStorage` on blur/change, restore on page load. File: `js/ln-autosave/ln-autosave.js`.

## HTML

```html
<form id="edit-user" data-ln-autosave>
    <input name="first_name" type="text">
    <input name="last_name" type="text">
    <textarea name="bio"></textarea>
    <button type="submit">Save</button>
    <button type="button" data-ln-autosave-clear>Discard Draft</button>
</form>

<!-- Or with explicit key (when form has no id) -->
<form data-ln-autosave="user-profile-form">
    ...
</form>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-autosave` | `<form>` | Creates instance. Value = storage key (falls back to form `id`) |
| `data-ln-autosave-clear` | `<button>` inside form | Click clears saved data |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-autosave:saved` | yes | no | `{ target, data }` |
| `ln-autosave:before-restore` | yes | **yes** | `{ target, data }` |
| `ln-autosave:restored` | yes | no | `{ target, data }` |
| `ln-autosave:cleared` | yes | no | `{ target }` |
| `ln-autosave:destroyed` | yes | no | `{ target }` |

If `before-restore` is canceled (`preventDefault()`), saved data is not applied to the form.

## API

```js
const form = document.getElementById('edit-user');
form.lnAutosave.save();        // serialize form → localStorage
form.lnAutosave.restore();     // localStorage → populate form
form.lnAutosave.clear();       // remove from localStorage
form.lnAutosave.destroy();     // remove all listeners, dispatch destroyed

// Manual init (Shadow DOM, iframe only)
window.lnAutosave(container);
```

## Behavior

- **Auto-save triggers**: `focusout` and `change` events on form fields (`<input>`, `<textarea>`, `<select>`)
- **Auto-clear triggers**: form `submit` and `reset` events
- **Restore on init**: calls `restore()` immediately on construction
- **Storage key**: `ln-autosave:{pathname}:{id}` — scoped to the current page path
- **Ignored fields**: `type="file"`, `type="submit"`, `type="button"`, disabled fields, unnamed fields

---

## Internal Architecture

### State

Each `[data-ln-autosave]` form gets a `_component` instance stored at `element.lnAutosave`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the form |
| `key` | string | localStorage key (`ln-autosave:{path}:{id}`) |

### Storage Key

```
ln-autosave:/users/42/edit:edit-user
             ↑ pathname      ↑ form id or attribute value
```

The pathname prefix ensures the same form ID on different pages doesn't collide.

### Serialization

`_serialize(form)` iterates `form.elements` and builds a plain object:

| Field type | Serialized as |
|-----------|---------------|
| text, textarea, select | `data[name] = value` |
| checkbox | `data[name] = [checkedValues]` (array) |
| radio | `data[name] = checkedValue` (string) |
| select-multiple | `data[name] = [selectedValues]` (array) |
| file, submit, button | skipped |
| disabled, unnamed | skipped |

### Restoration

`_populateForm(form, data)` iterates `form.elements` and applies saved values. After setting each field's value, dispatches `input` and `change` events on the element to trigger dependent logic (validation, autoresize, etc.).

Special handling: if a field has `lnSelect` (Tom Select integration), calls `lnSelect.setValue()` to sync the enhanced select.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `findElements` auto-initializes forms
- **`attributes`** (`data-ln-autosave`): attribute added to existing form → initializes
