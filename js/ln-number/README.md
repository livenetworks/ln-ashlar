# ln-number

Real-time locale-aware number formatting for input fields.

## Usage

```html
<input type="number" name="amount" data-ln-number>
```

The component creates a hidden input that holds the raw numeric value for form submission and formats the visible input with locale-aware thousand separators. See [`docs/js/number.md`](../../docs/js/number.md#html) for the resulting DOM.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-number` | `<input>` | Enables number formatting |
| `data-ln-number-decimals` | `<input>` | Max decimal places (default: unlimited) |
| `data-ln-number-min` | `<input>` | Minimum allowed value |
| `data-ln-number-max` | `<input>` | Maximum allowed value |

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-number:input` | yes | no | `{ value: Number, formatted: String }` |
| `ln-number:destroyed` | yes | no | `{ target: Element }` |

## API

```javascript
const el = document.querySelector('[data-ln-number]');

el.lnNumber.value;           // get raw number (Number or NaN if empty)
el.lnNumber.value = 1234.56; // set value programmatically — formats display
el.lnNumber.formatted;       // get formatted display string

el.lnNumber.destroy();       // remove component, restore original input
```

## Locale

The component reads the nearest ancestor `[lang]` attribute (typically `<html lang>`); falls back to `navigator.language`. Locale changes propagate live — re-formatting all instances when `<html lang>` changes.

| `lang` | Display |
|---|---|
| `mk` | `1.234.567` |
| `en-US` | `1,234,567` |

## Examples

```html
<!-- Basic -->
<div class="form-element">
    <label for="amount">Amount</label>
    <input type="number" id="amount" name="amount" data-ln-number>
</div>

<!-- With decimal limit -->
<div class="form-element">
    <label for="price">Price</label>
    <input type="number" id="price" name="price"
           data-ln-number data-ln-number-decimals="2">
</div>

<!-- With min/max -->
<div class="form-element">
    <label for="quantity">Quantity</label>
    <input type="number" id="quantity" name="quantity"
           data-ln-number data-ln-number-min="0" data-ln-number-max="999999">
</div>

<!-- Pre-filled value -->
<div class="form-element">
    <label for="budget">Budget</label>
    <input type="number" id="budget" name="budget" value="1500000"
           data-ln-number>
</div>
```

## Integration with ln-validate

Place `data-ln-validate` on the same input. The `required` attribute stays
on the visible input and works as expected:

```html
<div class="form-element">
    <label for="salary">Salary</label>
    <input type="number" id="salary" name="salary"
           required data-ln-validate data-ln-number>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Required field</li>
    </ul>
</div>
```

## Integration with ln-form

Works automatically. `serializeForm()` reads the hidden input (which has the
`name`). `populateForm()` sets the hidden input's value, which triggers the
display update.
