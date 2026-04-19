# Number

Locale-aware number formatting for input fields. File: `js/ln-number/ln-number.js`.

## HTML

```html
<input type="number" name="amount" data-ln-number>
```

After initialization, the DOM becomes:

```html
<input type="text" inputmode="decimal" data-ln-number>
<input type="hidden" name="amount" value="1234567">
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-number` | `<input>` | Creates instance |
| `data-ln-number-decimals` | `<input>` | Max decimal places |
| `data-ln-number-min` | `<input>` | Minimum value |
| `data-ln-number-max` | `<input>` | Maximum value |

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-number:input` | yes | no | `{ value: Number, formatted: String }` |
| `ln-number:destroyed` | yes | no | `{ target: Element }` |

## API

```js
const el = document.querySelector('[data-ln-number]');
el.lnNumber.value;           // Number or NaN
el.lnNumber.value = 42000;   // set + format + dispatch event
el.lnNumber.formatted;       // "42.000" (mk) or "42,000" (en)
el.lnNumber.destroy();       // restore original input
```

## Behavior

- On every `input` event: parses, formats with `Intl.NumberFormat`, restores cursor
- Cursor restoration: counts digits-left-of-cursor before/after formatting
- Edge cases skip formatting: bare `-`, trailing decimal separator, trailing zeros after decimal
- Paste: strips non-numeric characters, normalizes decimal, formats
- Pre-filled values formatted on initialization

---

## Internal Architecture

### State

Each `[data-ln-number]` input gets a `_component` instance stored at `element.lnNumber`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the visible input |
| `_hidden` | Element | Reference to the hidden input |
| `_localeInfo` | Object | Cached `{ fmt, groupSep, decimalSep }` |
| `_onInput` | Function | Bound input handler |
| `_onPaste` | Function | Bound paste handler |

### Formatter Cache

```
_formatters[locale] = {
    fmt: Intl.NumberFormat,     // reused for formatting
    groupSep: ".",              // extracted from formatToParts()
    decimalSep: ","             // extracted from formatToParts()
}
```

One entry per unique locale. Pattern matches ln-time's `_formatters` cache.

### Input Flow

```
User types character
    |
    v
'input' event → _handleInput()
    |
    ├── empty? → clear hidden, dispatch, return
    ├── bare "-"? → return (user starting negative)
    |
    v
Save cursor: count digits left of selectionStart
    |
    v
Parse: strip groupSep, replace decimalSep with "."
    |
    ├── trailing decimal? → update hidden only, return
    ├── trailing zeros after decimal? → update hidden only, return
    |
    v
Enforce decimal limit (truncate, not round)
    |
    v
Format via Intl.NumberFormat
    |
    v
Set dom.value = formatted
    |
    v
Restore cursor: walk formatted counting digits
    |
    v
Set hidden.value = raw number string
    |
    v
Dispatch 'ln-number:input' { value, formatted }
```

### Hidden Input Value Interceptor

The hidden input's `.value` property is wrapped via `Object.defineProperty`
to catch programmatic sets (e.g., from `populateForm()`):

```
populateForm() → hidden.value = "1234"
    |
    v
Custom setter intercepts
    |
    v
parseFloat("1234") → 1234
    |
    v
_displayFormatted(1234) → visible shows "1.234"
```

Internal updates use `_setHiddenRaw()` which calls the prototype's original
setter to avoid infinite loops.

### MutationObserver

Watches `document.body` for:
- **`childList`** (subtree): new elements → `findElements` auto-initializes
- **`attributes`** (`data-ln-number`): attribute added → initializes
