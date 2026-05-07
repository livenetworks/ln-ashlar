# ln-date

Locale-aware date formatting with native browser picker.

## Usage

```html
<input type="date" name="birthday" data-ln-date>
```

On initialization, the component transforms the input into a text-display element with a paired calendar button and a hidden form-submit input. See [`docs/js/date.md`](../../docs/js/date.md) for the full transform.

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
