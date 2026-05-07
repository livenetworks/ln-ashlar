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

## Internal Architecture

Consumer-facing reference (attributes, events, API, examples, integration) lives in [`js/ln-number/README.md`](../../js/ln-number/README.md).

### State

Each `[data-ln-number]` input gets a `_component` instance stored at `element.lnNumber`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the visible input |
| `_hidden` | Element | Reference to the hidden input |
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

One cache entry per unique locale (a second internal key shape — `locale + '|d' + max` and `locale + '|u' + n` — exists for decimal-fixed and user-decimal-preserving formatters; both also live on the module-level `_formatters` map).

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
