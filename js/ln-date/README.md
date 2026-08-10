# ln-date

Locale-aware date formatting with native browser picker.

## Usage

```html
<input type="date" name="birthday" data-ln-date>
```

On initialization, the component wraps the original input in a `<span data-ln-date-field>` container and injects a visible text input, a hidden native date picker, a hidden form-submit input, and a calendar button:

```html
<span data-ln-date-field>
    <input type="text" data-ln-date>
    <input type="date" tabindex="-1" style="position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none">
    <input type="hidden" name="birthday" value="2026-04-19">
    <button type="button" aria-label="Open date picker">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>
    </button>
</span>
```

## Styling

Apply the `form-field-group` mixin to the wrapper element:

```scss
[data-ln-date-field] {
    @include form-field-group;
}
```

## Typing Support

The visible input accepts typed dates. On blur, the component parses the
input and reformats it according to the configured display format.

### Supported Input Formats

| Separator | Assumed Format | Example |
|-----------|---------------|---------|
| `.` (dot) | dd.MM.yyyy (European) | `30.12.1979` or `30.12.79` |
| `/` (slash) | MM/dd/yyyy (US) | `12/30/1979` or `12/30/79` |
| `-` (dash) | yyyy-MM-dd if 4-digit first part (ISO), else dd-MM-yyyy | `1979-12-30` or `30-12-1979` |

Two-digit years: 00–49 → 2000–2049, 50–99 → 1950–1999.

### Blur Behavior

- **Empty input**: clears the date value and dispatches `ln-date:change`
- **Unchanged text**: no action (user clicked in and out without editing)
- **Valid date**: updates the value, reformats display, dispatches `ln-date:change`
- **Invalid input**: reverts to the previous formatted display

The hidden input holds the ISO date string (YYYY-MM-DD) for form submission.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-date` | `<input>` | Enables date formatting. Value = format (keyword or pattern). Default: `medium` |
| `data-ln-date-label` | `<input>` | Optional. Translated `aria-label` for the injected calendar button. Default: `Open date picker` (dev fallback only). |

### Format Keywords (locale-aware via Intl.DateTimeFormat)

| Value | Example (mk) | Example (en) |
|-------|-------------|-------------|
| (empty) | 19 апр 2026 | Apr 19, 2026 |
| `short` | 19.4.2026 | 4/19/2026 |
| `medium` | 19 апр 2026 | Apr 19, 2026 |
| `medium datetime` | 19 апр 2026, 14:30 | Apr 19, 2026, 2:30 PM |
| `long` | 19 април 2026 | April 19, 2026 |
| `short datetime` | 19.4.2026 14:30 | 4/19/26, 2:30 PM |
| `long datetime` | 19 април 2026, 14:30 | April 19, 2026, 2:30 PM |

### Custom Pattern Tokens

| Token | Meaning | Example |
|-------|---------|---------|
| `dd` | Day 2-digit | 05 |
| `d` | Day | 5 |
| `MM` | Month 2-digit | 04 |
| `M` | Month | 4 |
| `MMM` | Month short name (locale) | апр |
| `MMMM` | Month full name (locale) | април |
| `yyyy` | Year 4-digit | 2026 |
| `yy` | Year 2-digit | 26 |
| `HH` | Hours 24h | 14 |
| `mm` | Minutes | 30 |

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-date:change` | yes | no | `{ value: String (ISO), formatted: String, date: Date }` |
| `ln-date:destroyed` | yes | no | `{ target: Element }` |

## API

```javascript
const el = document.querySelector('[data-ln-date]');

el.lnDate.value;               // get ISO date string (YYYY-MM-DD) or empty string
el.lnDate.value = '2026-04-19'; // set value programmatically — formats display
el.lnDate.date;                // get Date object or null
el.lnDate.date = new Date();   // set via Date object
el.lnDate.formatted;           // get formatted display string

el.lnDate.destroy();           // remove component, restore original input
```

## Locale Detection

Locale is detected by walking up the DOM tree to find the nearest `[lang]` attribute (e.g. `<html lang="mk">` → `mk`, `<html lang="en-US">` → `en-US`). Fallback: `navigator.language`. Changes to the `lang` attribute on `<html>` automatically re-format all instances.

## Examples

```html
<!-- Default (medium) -->
<div class="form-element">
    <label for="birthday">Birthday</label>
    <input type="date" id="birthday" name="birthday" data-ln-date>
</div>

<!-- Short format -->
<div class="form-element">
    <label for="due">Due Date</label>
    <input type="date" id="due" name="due" data-ln-date="short">
</div>

<!-- Long format -->
<div class="form-element">
    <label for="event">Event Date</label>
    <input type="date" id="event" name="event" data-ln-date="long">
</div>

<!-- Custom pattern -->
<div class="form-element">
    <label for="start">Start Date</label>
    <input type="date" id="start" name="start" data-ln-date="dd.MM.yyyy">
</div>

<!-- Pre-filled value -->
<div class="form-element">
    <label for="hired">Hire Date</label>
    <input type="date" id="hired" name="hired" value="2024-03-15" data-ln-date>
</div>
```

## Integration with ln-form

Works automatically. The hidden input carries the `name` attribute, so form serialization and population go through it transparently.

## Integration and Source Files

This component can be loaded either as part of the unified Ashlar bundle or as a standalone zero-dependency script.

### 1. In-Bundle (Standard Integration)
Include the main Ashlar bundle in your HTML. This bundle registers all Ashlar components, including `ln-date`:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

### 2. Standalone (Zero-Dependency IIFE)
If you only need date-formatting functionality without the rest of the Ashlar library, load the component's standalone IIFE script:
```html
<script src="js/ln-date/ln-date.js" defer></script>
```

### 3. Source & Reference
* **Active Development Source**: [js/ln-date/src/ln-date.js](file:///c:/laragon/www/ln-ashlar/js/ln-date/src/ln-date.js) — The source of truth containing the ES module implementation.
* **Compiled Standalone Release**: [js/ln-date/ln-date.js](file:///c:/laragon/www/ln-ashlar/js/ln-date/ln-date.js) — The compiled IIFE distribution file.

---

## 🔧 Internals

Source: `js/ln-date/ln-date.js`. Each `[data-ln-date]` gets a `_component` instance at `element.lnDate` (`dom` visible input, `_wrapper`, `_hidden` form input, `_picker` hidden native date input, `_btn` calendar button, `_lastISO` — the last known valid ISO value, used to revert on invalid typed input).

### Format resolution

`data-ln-date`'s value is read once: empty or a keyword match (`short`, `medium`, `long`, and the `datetime` variants) resolves to `Intl.DateTimeFormat`; anything else is treated as a custom ICU-style token pattern with locale-aware month names. Formatters are cached at `_formatters[locale + '|' + JSON.stringify(options)]` — one entry per unique locale+options combo, same caching pattern as `ln-number`/`ln-time`.

### Value flow (picker)

Calendar button click → `picker.showPicker()` (falls back to `picker.click()` if `showPicker()` throws — it requires a user gesture — or isn't supported) → user selects in the native picker → `change` fires on the hidden date input → `picker.value` (ISO) is read, written to the hidden form input directly (bypassing the interceptor, see below), formatted via `Intl`/custom pattern, and the display input + `ln-date:change` follow.

### Programmatic set (interceptor)

`hidden.value` is wrapped via `Object.defineProperty`, same pattern as `ln-number`: a `populateForm()`-style set parses the ISO string, updates the display formatting, and syncs `picker.value` to keep the native picker's own state consistent with a script-driven change.

### Typed input flow

On blur: empty → clear + dispatch; unchanged from the current formatted display → no-op; otherwise `_parseTyped(text)` branches on the separator (`.` → `dd.MM.yyyy`, `/` → `MM/dd/yyyy`, `-` → ISO or `dd-MM-yyyy` depending on which part is 4 digits) and two-digit years resolve 00–49→2000s, 50–99→1900s. A valid parse updates hidden + picker + display and dispatches `ln-date:change`; an invalid parse reverts the display to `_lastISO`'s formatted value.

### Observers

A shared `document.body` `MutationObserver` auto-initializes new `[data-ln-date]` elements (`childList`) and re-initializes on `data-ln-date` attribute addition (`attributes`). A separate observer on `document.documentElement` watches `lang` and re-formats every active instance when it changes.
