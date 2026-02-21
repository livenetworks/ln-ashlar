# ln-select

TomSelect wrapper — го подобрува стандардниот `<select>` со search, tagging и create функционалност.
Зависи од [TomSelect](https://tom-select.js.org/) (peer dependency, мора да е вчитан пред ln-acme).

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-select` | `<select>` | Активира TomSelect со default конфигурација |
| `data-ln-select='{"create":true}'` | `<select>` | JSON конфигурација (се мерџира со defaults) |

## Default конфигурација

```json
{
    "allowEmptyOption": true,
    "controlInput": null,
    "create": false,
    "highlight": true,
    "closeAfterSelect": true,
    "placeholder": "Select...",
    "loadThrottle": 300
}
```

Атрибутот `placeholder` на `<select>` се користи ако е поставен.

## API

```javascript
// Рачна иницијализација
window.lnSelect.initialize(selectElement);

// Уништи инстанца
window.lnSelect.destroy(selectElement);

// Земи TomSelect инстанца (за директен пристап до TomSelect API)
var ts = window.lnSelect.getInstance(selectElement);
ts.addOption({ value: 'new', text: 'Нова опција' });
ts.setValue('new');
```

## Однесување

- Ако `window.TomSelect` не постои, компонентата тивко не прави ништо (graceful degradation)
- При DOM remove, инстанцата автоматски се уништува (cleanup)
- При form reset, selection се чисти автоматски

## HTML примери

```html
<!-- Основен -->
<select data-ln-select name="country">
    <option value="">Избери земја...</option>
    <option value="mk">Македонија</option>
    <option value="rs">Србија</option>
</select>

<!-- Со create (tagging) -->
<select data-ln-select='{"create": true}' name="tags" multiple>
    <option value="php">PHP</option>
    <option value="js">JavaScript</option>
</select>

<!-- Повеќе избори со лимит -->
<select data-ln-select='{"maxItems": 3}' name="colors[]" multiple>
    <option value="red">Црвена</option>
    <option value="blue">Сина</option>
    <option value="green">Зелена</option>
</select>
```

## Peer dependency

TomSelect мора да се вчита пред ln-acme:

```html
<link rel="stylesheet" href="tom-select/dist/css/tom-select.css">
<script src="tom-select/dist/js/tom-select.complete.min.js"></script>
<script src="dist/ln-acme.iife.js" defer></script>
```
