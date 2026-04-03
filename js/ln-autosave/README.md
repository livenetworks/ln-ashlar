# ln-autosave

Auto-saves form data to `localStorage` on field blur/change.
Restores data on next visit if the form wasn't submitted. Clears storage on submit.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-autosave` | `<form>` | Enables autosave, uses `form.id` as storage key |
| `data-ln-autosave="key"` | `<form>` | Explicit storage key (overrides `form.id`) |
| `data-ln-autosave-clear` | button inside form | Click clears saved draft (for cancel/discard buttons) |

Storage key format: `ln-autosave:{pathname}:{identifier}` — unique per URL + form.

## API

```javascript
// Instance API (on DOM element)
const form = document.getElementById('edit-user');
form.lnAutosave.save();     // manually save to localStorage
form.lnAutosave.restore();  // manually restore from localStorage
form.lnAutosave.clear();    // remove saved data
form.lnAutosave.destroy();  // cleanup listeners

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnAutosave(container);
```

## Events

All events are dispatched on the `<form>` element and bubble up.

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-autosave:before-restore` | **yes** | Before restoring saved data | `{ target, data }` |
| `ln-autosave:restored` | no | Data restored to form | `{ target, data }` |
| `ln-autosave:saved` | no | Data saved to localStorage | `{ target, data }` |
| `ln-autosave:cleared` | no | localStorage entry removed (submit) | `{ target }` |
| `ln-autosave:destroyed` | no | Instance destroyed | `{ target }` |

```javascript
// Cancel restore (e.g. form already has server data)
document.addEventListener('ln-autosave:before-restore', function (e) {
    if (e.detail.target.id === 'edit-user' && formHasServerData()) {
        e.preventDefault(); // saved data won't be restored
    }
});

// React to restore (e.g. show notification)
document.addEventListener('ln-autosave:restored', function (e) {
    console.log('Restored draft for:', e.detail.target.id);
});
```

## Behavior

- **Blur** (`focusout`) on any input/textarea/select → saves entire form
- **Change** on checkbox/radio/select → saves entire form (blur doesn't always fire on these)
- **Submit** → clears localStorage entry (form completed successfully)
- **Reset** (`type="reset"`) → clears localStorage entry (form reset to defaults)
- **Clear button** (`data-ln-autosave-clear`) → clears localStorage entry (cancel/discard)
- **Page load** → restores saved data if present, dispatches `input` + `change` events on each field
- File inputs are skipped (can't be stored in localStorage)
- Fields without `name` are skipped
- Form must have `id` or explicit `data-ln-autosave="key"` — otherwise `console.warn` and skip

## Supported Field Types

| Field Type | Save | Restore |
|------------|------|---------|
| `input[type=text\|email\|tel\|url\|number\|date\|...]` | `.value` | `.value` |
| `textarea` | `.value` | `.value` |
| `select` | `.value` | `.value` |
| `select[multiple]` | selected values array | sets `.selected` on matching options |
| `input[type=checkbox]` | checked values array | sets `.checked` |
| `input[type=radio]` | selected value | sets `.checked` on matching |
| `input[type=file]` | — skipped — | — skipped — |

## Examples

### Basic form

```html
<form id="edit-user" data-ln-autosave>
    <div class="form-element">
        <label for="name">Name</label>
        <input id="name" name="name" type="text">
    </div>
    <div class="form-element">
        <label for="email">Email</label>
        <input id="email" name="email" type="email">
    </div>
    <footer class="form-actions">
        <button type="submit">Save</button>
    </footer>
</form>
```

No JS needed — MutationObserver auto-initializes.

### Modal form

```html
<div id="new-invoice" class="ln-modal" data-ln-modal>
    <form id="invoice-form" data-ln-autosave>
        <header><h3>New Invoice</h3><button type="button" aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg> data-ln-modal-close></button></header>
        <main>
            <div class="form-element">
                <label for="client">Client</label>
                <input id="client" name="client" type="text">
            </div>
            <div class="form-element">
                <label for="amount">Amount</label>
                <input id="amount" name="amount" type="number">
            </div>
        </main>
        <footer>
            <button type="button" data-ln-modal-close data-ln-autosave-clear>Cancel</button>
            <button type="submit">Create</button>
        </footer>
    </form>
</div>
```

### Custom key

```html
<form data-ln-autosave="contact-draft">
    <!-- no id needed — uses "contact-draft" as key -->
</form>
```

### Prevent restore on edit pages with server data

```javascript
document.addEventListener('ln-autosave:before-restore', function (e) {
    var form = e.detail.target;
    if (form.dataset.hasServerData === 'true') {
        e.preventDefault();
        form.lnAutosave.clear(); // discard stale draft
    }
});
```

### TomSelect integration

After restore, `input` and `change` events are dispatched on each field.
For `ln-select` (TomSelect) fields, the component also calls `el.lnSelect.setValue()` if available.
