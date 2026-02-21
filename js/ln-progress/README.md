# ln-progress

Progress bar компонента — визуелен индикатор за напредок.
Реактивен: автоматски се ажурира кога `data-ln-progress` атрибутот се менува (MutationObserver на атрибути).

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-progress` | track (надворешен) | Го означува progress track контејнерот (празна вредност) |
| `data-ln-progress="50"` | bar (внатрешен) | Тековна вредност на progress bar |
| `data-ln-progress-max="100"` | bar | Максимална вредност (default: 100) |

## CSS класи (боја)

| Класа | Боја |
|-------|------|
| `.green` | Success (зелена) |
| `.red` | Error (црвена) |
| `.yellow` | Warning (жолта) |
| (без класа) | Default background |

## Однесување

- `width` на bar елементот се пресметува како `(value / max) * 100%`
- При промена на `data-ln-progress` или `data-ln-progress-max` атрибутот, bar-от реактивно се ажурира
- Поддржува повеќе bar-ови во еден track (stacked progress)
- Последниот bar има заоблен десен агол

## HTML структура

```html
<!-- Единечен progress bar -->
<div data-ln-progress role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
    <div data-ln-progress="75" class="green"></div>
</div>

<!-- Со максимална вредност -->
<div data-ln-progress role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="50">
    <div data-ln-progress="30" data-ln-progress-max="50" class="green"></div>
</div>

<!-- Stacked (повеќе сегменти) -->
<div data-ln-progress role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
    <div data-ln-progress="40" class="green"></div>
    <div data-ln-progress="20" class="yellow"></div>
    <div data-ln-progress="10" class="red"></div>
</div>
```

> **Accessibility:** Додади `role="progressbar"` и ARIA атрибути (`aria-valuenow`,
> `aria-valuemin`, `aria-valuemax`) на track елементот за screen readers.

## API

```javascript
// Рачна иницијализација
window.lnProgress(document.body);
```

## Реактивно ажурирање

```javascript
// Промени ја вредноста — bar автоматски се ажурира
var bar = document.querySelector('[data-ln-progress="75"]');
bar.setAttribute('data-ln-progress', '90');
```

## Програмски пример

```javascript
// Progress bar за upload
var bar = document.getElementById('upload-bar');

xhr.upload.addEventListener('progress', function(e) {
    if (e.lengthComputable) {
        var percent = Math.round((e.loaded / e.total) * 100);
        bar.setAttribute('data-ln-progress', percent);
    }
});
```
