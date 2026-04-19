# ln-date

Locale-aware date formatting with native browser picker.

## Usage

```html
<input type="date" name="birthday" data-ln-date>
```

On initialization, the component:
1. Creates a hidden input with the original `name` attribute for form submission
2. Creates a hidden date input for the native picker (`showPicker()`)
3. Changes visible input to `type="text" readonly` for formatted display
4. Adds a calendar icon button that triggers the native picker
5. Formats the display value with locale-aware date formatting

The hidden input holds the ISO date string (YYYY-MM-DD) for form submission.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-date` | `<input>` | Enables date formatting. Value = format (keyword or pattern). Default: `medium` |

### Format Keywords (locale-aware via Intl.DateTimeFormat)

| Value | Example (mk) | Example (en) |
|-------|-------------|-------------|
| (empty) | 19 апр 2026 | Apr 19, 2026 |
| `short` | 19.4.2026 | 4/19/2026 |
| `medium` | 19 апр 2026 | Apr 19, 2026 |
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

The locale is detected by walking up the DOM tree to find the nearest
`[lang]` attribute:

```html
<html lang="mk">        <!-- mk locale: 19 апр 2026 -->
<html lang="en-US">      <!-- en-US locale: Apr 19, 2026 -->
```

Fallback: `navigator.language`.

Changes to the `lang` attribute on `<html>` automatically re-format all instances.

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

Works automatically. `serializeForm()` reads the hidden input (which has the
`name`). `populateForm()` sets the hidden input's value, which triggers the
display update via the value interceptor.
