# ln-filter

Генеричка filter компонента — филтрира деца на целен елемент по `data-*` атрибут.
Копчиња со `data-ln-filter-key` + `data-ln-filter-value` ги контролираат филтрите.
Елементите што не одговараат добиваат `data-ln-filter-hide` атрибут.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-filter="targetId"` | component root | Целен елемент по ID чии деца се филтрираат |
| `data-ln-filter-key="field"` | `<button>` внатре | Име на data атрибут за споредба на целните деца |
| `data-ln-filter-value="val"` | `<button>` внатре | Вредност за споредба (празно = покажи сe) |
| `data-ln-filter-hide` | деца на target | Поставен од JS кога елементот не одговара |
| `data-active` | активно копче | Поставен од JS на тековно селектираното копче |

## API

```javascript
// Instance API (на DOM елементот)
var el = document.querySelector('[data-ln-filter]');
el.lnFilter.filter('genre', 'rock');  // програмски филтрирај
el.lnFilter.reset();                   // исчисти филтер, покажи сe
el.lnFilter.getActive();               // { key: 'genre', value: 'rock' } или null

// Constructor — само за нестандардни случаи (Shadow DOM, iframe)
// За AJAX/динамички DOM: MutationObserver автоматски иницијализира
window.lnFilter(container);
```

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-filter:changed` | да | `{ key: string, value: string }` |
| `ln-filter:reset` | да | `{}` |

```javascript
// Слушај промена на филтер
document.addEventListener('ln-filter:changed', function (e) {
    console.log('Филтер:', e.detail.key, '=', e.detail.value);
});

// Слушај ресет
document.addEventListener('ln-filter:reset', function (e) {
    console.log('Филтер ресетиран');
});
```

## Пример

### Основна употреба

```html
<!-- Filter копчиња -->
<nav data-ln-filter="my-list">
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="">Сите</button>
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="a">Категорија A</button>
    <button type="button" data-ln-filter-key="category" data-ln-filter-value="b">Категорија B</button>
</nav>

<!-- Целна листа (деца имаат data-category атрибут) -->
<ul id="my-list">
    <li data-category="a">Елемент од категорија A</li>
    <li data-category="b">Елемент од категорија B</li>
    <li data-category="a">Друг елемент A</li>
</ul>
```

### Повеќе филтер групи

```html
<!-- Филтер по фаза -->
<nav data-ln-filter="documents">
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="">Сите</button>
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="0">Фаза 0</button>
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="1">Фаза 1</button>
    <button type="button" data-ln-filter-key="phase" data-ln-filter-value="2">Фаза 2</button>
</nav>
```

> **Копче со `data-ln-filter-value=""`** = „Покажи сe" (reset). При иницијализација автоматски добива `data-active`.

## CSS

Потрошувачот мора да обезбеди CSS правила за криење и за активно копче:

```css
[data-ln-filter-hide] {
    display: none;
}

/* Стил за активно filter копче */
[data-ln-filter-key][data-active] {
    background: var(--accent);
    color: var(--bg);
}
```

## Комбинација со ln-search

`ln-filter` и `ln-search` работат **независно** на ист target — секој со свој hide атрибут. Елемент е видлив само кога **ниеден** hide атрибут не е присутен:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

## Динамички елементи

Кога деца се додаваат во целната листа (AJAX, populate), `ln-filter` автоматски ги ре-филтрира ако има активен филтер. MutationObserver на целниот елемент го обезбедува ова.

## Програмски

```javascript
// Филтрирај по жанр
document.querySelector('[data-ln-filter]').lnFilter.filter('genre', 'rock');

// Ресетирај
document.querySelector('[data-ln-filter]').lnFilter.reset();

// Провери тековен филтер
var active = document.querySelector('[data-ln-filter]').lnFilter.getActive();
if (active) {
    console.log('Активен филтер:', active.key, '=', active.value);
}
```
