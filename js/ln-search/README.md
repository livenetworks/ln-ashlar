# ln-search

Генеричка search компонента — филтрира деца на целен елемент по `textContent`.
Елементите што не одговараат добиваат `data-ln-search-hide` атрибут.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-search="targetId"` | component root | Целен елемент по ID чии деца се филтрираат |
| `data-ln-search-input` | `<input>` внатре | Search input (слуша `input` event) |
| `data-ln-search-debounce="300"` | component root | Optional debounce во ms (default: 0) |
| `data-ln-search-hide` | деца на target | Поставен од JS кога елементот не одговара |

## API

```javascript
// Instance API (на DOM елементот)
var el = document.querySelector('[data-ln-search]');
el.lnSearch.search('query');   // програмски пребарување
el.lnSearch.clear();           // исчисти search, покажи сe
el.lnSearch.getQuery();        // тековен query string

// Constructor — само за нестандардни случаи (Shadow DOM, iframe)
// За AJAX/динамички DOM: MutationObserver автоматски иницијализира
window.lnSearch(container);
```

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-search:input` | да | `{ query: string, count: number, total: number }` |
| `ln-search:clear` | да | `{ count: number, total: number }` |

```javascript
// Слушај пребарување
document.addEventListener('ln-search:input', function (e) {
    console.log('Пребарување:', e.detail.query, '— Резултати:', e.detail.count + '/' + e.detail.total);
});

// Слушај кога се чисти
document.addEventListener('ln-search:clear', function (e) {
    console.log('Search исчистен, вкупно:', e.detail.total);
});
```

## Пример

```html
<!-- Search компонента -->
<fieldset data-ln-search="my-list">
    <legend class="sr-only">Пребарај</legend>
    <span class="ln-icon-search ln-icon--sm"></span>
    <input type="search" placeholder="Пребарај..." data-ln-search-input />
</fieldset>

<!-- Целна листа (ID = вредноста од data-ln-search) -->
<ul id="my-list">
    <li>Прв елемент</li>
    <li>Втор елемент</li>
    <li>Трет елемент</li>
</ul>
```

### Со debounce

```html
<fieldset data-ln-search="results" data-ln-search-debounce="300">
    <input type="search" data-ln-search-input placeholder="Барај..." />
</fieldset>
```

## CSS

Потрошувачот мора да обезбеди CSS правило за криење:

```css
[data-ln-search-hide] {
    display: none;
}
```

## Комбинација со ln-filter

`ln-search` и `ln-filter` работат **независно** на ист target — секој со свој hide атрибут. Елемент е видлив само кога **ниеден** hide атрибут не е присутен:

```css
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none;
}
```

## Динамички елементи

Кога деца се додаваат во целната листа (AJAX, populate), `ln-search` автоматски ги ре-филтрира ако има активен query. MutationObserver на целниот елемент го обезбедува ова.
