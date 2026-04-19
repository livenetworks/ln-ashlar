# Date

Locale-aware date formatting with native browser picker. File: `js/ln-date/ln-date.js`.

## HTML

```html
<input type="date" name="birthday" data-ln-date>
```

After initialization, the DOM becomes:

```html
<input type="text" data-ln-date>
<input type="date" tabindex="-1" style="position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none">
<input type="hidden" name="birthday" value="2026-04-19">
<button type="button" aria-label="Open date picker">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>
</button>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-date` | `<input>` | Creates instance. Value = format keyword or custom pattern |

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-date:change` | yes | no | `{ value: String, formatted: String, date: Date }` |
| `ln-date:destroyed` | yes | no | `{ target: Element }` |

## API

```js
const el = document.querySelector('[data-ln-date]');
el.lnDate.value;               // ISO string or ''
el.lnDate.value = '2026-04-19'; // set + format + dispatch event
el.lnDate.date;                // Date object or null
el.lnDate.date = new Date();   // set via Date object
el.lnDate.formatted;           // "19 апр 2026" (mk) or "Apr 19, 2026" (en)
el.lnDate.destroy();           // restore original input
```

## Behavior

- On picker `change` event: reads ISO value, formats display, dispatches `ln-date:change`
- Display input accepts typed dates — on blur, parses and reformats (see Typed Input Flow)
- Calendar button opens native picker via `showPicker()`
- `showPicker()` wrapped in try/catch (throws if not triggered by user gesture)
- Fallback: `picker.click()` for browsers without `showPicker()`
- Pre-filled values formatted on initialization
- Locale changes on `<html lang>` automatically re-format all instances

## Format Resolution

1. Read `data-ln-date` attribute value
2. Empty or keyword match (`short`, `medium`, `long`, `short datetime`, `long datetime`) -> Intl.DateTimeFormat
3. Otherwise -> custom ICU token pattern with locale-aware month names via Intl

---

## Internal Architecture

### State

Each `[data-ln-date]` input gets a `_component` instance stored at `element.lnDate`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the visible display input |
| `_hidden` | Element | Reference to the hidden form input |
| `_picker` | Element | Reference to the hidden date input (for showPicker) |
| `_btn` | Element | Reference to the calendar button |
| `_onPickerChange` | Function | Bound change handler for picker |
| `_onBlur` | Function | Bound blur handler for typed input parsing |
| `_onBtnClick` | Function | Bound click handler for calendar button |
| `_lastISO` | String | Last known valid ISO value (for revert on invalid input) |

### Formatter Cache

```
_formatters[locale + '|' + JSON.stringify(options)] = Intl.DateTimeFormat
```

One entry per unique locale + options combo. Pattern matches ln-number/ln-time caches.

### Value Flow

```
User clicks calendar button
    |
    v
showPicker() on hidden date input
    |
    v
User selects date in native picker
    |
    v
'change' event on hidden date input
    |
    v
Read picker.value (ISO YYYY-MM-DD)
    |
    v
Set hidden form input value (bypassing interceptor)
    |
    v
Format date via Intl or custom pattern
    |
    v
Set display input value = formatted string
    |
    v
Dispatch 'ln-date:change' { value, formatted, date }
```

### Programmatic Set Flow

```
populateForm() → hidden.value = "2026-04-19"
    |
    v
Custom setter intercepts
    |
    v
_parseISO("2026-04-19") → Date object
    |
    v
_displayFormatted(date) → visible shows "19 апр 2026"
    |
    v
picker.value = "2026-04-19" (sync picker state)
```

### Typed Input Flow

```
User types in display input → blur fires
    |
    v
Read typed text, trim whitespace
    |
    v
Empty? → clear value, dispatch change
    |
    v
Unchanged from current formatted display? → no action
    |
    v
_parseTyped(text) — separator-based detection
    . → dd.MM.yyyy    / → MM/dd/yyyy    - → yyyy-MM-dd or dd-MM-yyyy
    |
    v
Valid Date? → build ISO, update hidden + picker + display, dispatch change
Invalid?   → revert display to previous formatted value
```

### MutationObserver

Watches `document.body` for:
- **`childList`** (subtree): new elements -> `findElements` auto-initializes
- **`attributes`** (`data-ln-date`): attribute added -> initializes

### Locale Observer

Watches `document.documentElement` for `lang` attribute changes. Re-formats all
active instances with the new locale.
