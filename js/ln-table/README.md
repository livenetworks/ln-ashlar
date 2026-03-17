# ln-table

Data table компонента — in-memory filter, sort, virtual scroll.
Три независни компоненти кои комуницираат преку CustomEvents.

| Компонента | `window.*` | Одговорност |
|-----------|-----------|-------------|
| `ln-table-search` | `lnTableSearch` | Input debounce → dispatch `ln-table:search` |
| `ln-table-sort` | `lnTableSort` | Click на `th` → cycling asc/desc/null → dispatch `ln-table:sort` |
| `ln-table` | `lnTable` | Parse rows, слуша events, filter + sort во меморија, render |

---

## Основна употреба

```html
<div id="employees" data-ln-table>
    <header class="ln-table__toolbar">
        <h3>Вработени</h3>
        <aside>
            <label class="ln-table__search">
                <span class="ln-icon-filter ln-icon--sm"></span>
                <input type="search" placeholder="Пребарај..." data-ln-table-search="employees">
            </label>
            <span class="ln-table__count"></span>
            <span class="ln-table__timing"></span>
        </aside>
    </header>

    <table>
        <thead>
            <tr>
                <th data-ln-sort="number">#</th>
                <th data-ln-sort="string">Ime</th>
                <th data-ln-sort="date">Datum</th>
                <th data-ln-sort="number">Plata</th>
                <th>Akcii</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Marko Petrovski</td>
                <td data-ln-value="1700000000">15.11.2023</td>
                <td data-ln-value="55000">55.000</td>
                <td><button>...</button></td>
            </tr>
        </tbody>
    </table>

    <footer class="ln-table__footer">
        <span>Вкупно: <strong></strong></span>
    </footer>
</div>
```

---

## Атрибути

### `[data-ln-table]`

На wrapper елементот. Мора да има `id` ако се поврзува со search input.

### `[data-ln-table-search="tableId"]`

На `<input>` надвор (или внатре) во wrapper-от. Вредноста е `id` на `[data-ln-table]`.
Може да биде во toolbar-от или на друго место на страницата.

### `[data-ln-table-clear]`

На копче — ја чисти вредноста на поврзаниот search input.
Се резолвира преку: `btn → closest [data-ln-table] → id → [data-ln-table-search="id"]`.

### `th[data-ln-sort]`

На `<th>` елементи — ги прави колоните sortable.
Вредноста го одредува типот на споредување:

| Вредност | Споредување |
|----------|-------------|
| `string` | Lexicographic (Intl.Collator — Cyrillic-aware, се чита од `<html lang>`) |
| `number` | Нумеричко |
| `date` | Нумеричко (timestamp во `data-ln-value`) |
| _(без вредност)_ | Колоната не е sortable |

### `td[data-ln-value]`

На `<td>` — raw вредност за sort/filter кога display текстот се разликува (форматирани броеви, датуми).

```html
<!-- Без data-ln-value: sort по "55.000" (string) -->
<td>55.000</td>

<!-- Со data-ln-value: sort по 55000 (number), display "55.000" -->
<td data-ln-value="55000">55.000</td>

<!-- Датум: sort по Unix timestamp, display по форматиран датум -->
<td data-ln-value="1700000000">15.11.2023</td>
```

---

## Empty state

`ln-table` не содржи hardcoded markup или текст.
Кога пребарувањето враќа 0 резултати, се прикажува содржината на `<template data-ln-table-empty>` (ако постои) и секогаш се dispatch-ува `ln-table:empty` event.

```html
<div id="employees" data-ln-table>
    <template data-ln-table-empty>
        <article class="ln-table__empty-state">
            <span class="ln-icon-filter ln-icon--xl"></span>
            <h3>No results found</h3>
            <p>Try a different search term.</p>
            <button class="btn btn--secondary" data-ln-table-clear>Clear</button>
        </article>
    </template>

    <table>...</table>
</div>
```

Без `<template>` — слушај го евентот и прикажи свое UI:

```javascript
document.getElementById('employees').addEventListener('ln-table:empty', function (e) {
    console.log('No results for:', e.detail.term);
    // прикажи своја порака
});
```

---

## CSS класи

| Класа | Опис |
|-------|------|
| `.ln-table__toolbar` | Sticky header (закачен под `.header`) |
| `.ln-table__search` | Wrapper за search input со икона |
| `.ln-table__count` | Badge со број на записи (пополнува JS) |
| `.ln-table__timing` | Monospace badge со ms (пополнува JS) |
| `.ln-table__footer` | Footer со вкупен count |
| `.ln-table__empty-state` | Стил за empty state article |

---

## Events

Сите events се dispatch-уваат на `[data-ln-table]` елементот и bubble-аат нагоре.

Компонентата dispatch-ува само сурови броеви — форматирањето е одговорност на страницата.

| Event | Dispatch-ува | `detail` |
|-------|-------------|----------|
| `ln-table:ready` | `ln-table` — по парсирање на rows | `{ total }` |
| `ln-table:search` | `ln-table-search` — по debounce | `{ term }` |
| `ln-table:filter` | `ln-table` — по filter render | `{ term, matched, total }` |
| `ln-table:sort` | `ln-table-sort` — по click на `th` | `{ column, sortType, direction }` |
| `ln-table:sorted` | `ln-table` — по sort render | `{ column, direction, matched, total }` |
| `ln-table:empty` | `ln-table` — кога filter врати 0 резултати | `{ term, total }` |

```javascript
var table = document.getElementById('employees');
var countEl = document.getElementById('count');
var timingEl = document.getElementById('timing');

// Почетен count по парсирање
table.addEventListener('ln-table:ready', function (e) {
    countEl.textContent = e.detail.total.toLocaleString();
});

// По пребарување — ажурирај count
table.addEventListener('ln-table:filter', function (e) {
    countEl.textContent = e.detail.matched < e.detail.total
        ? e.detail.matched.toLocaleString() + ' / ' + e.detail.total.toLocaleString()
        : e.detail.total.toLocaleString();
});

// Нема резултати
table.addEventListener('ln-table:empty', function (e) {
    console.log('No match for:', e.detail.term);
});
```

---

## Virtual scroll

Автоматски се активира кога бројот на (филтрирани) редови надминува 200.
Рендерира само видливите редови + 15 buffer редови над/под viewport.
Деактивира се автоматски кога редовите паднат под прагот.

Колонските ширини се заклучуваат при прв parse за да спречат width jumps.

---

## Динамички редови

Ако `<tbody>` е празен при init (редовите доаѓаат via AJAX), компонентата чека — MutationObserver детектира кога редовите се додадат и тогаш ги парсира.

```javascript
// По AJAX — директно постави innerHTML, ln-table ќе го забележи
document.querySelector('#employees tbody').innerHTML = generatedHtml;
```

---

## Colspan — последна колона

Последната колона (actions/buttons) е исклучена од search index — JS ги зема само `cells[0..n-2]` за `searchText`.

---

## Употреба на Intl.Collator

Collator-от за string sort се создава еднаш при init:

```javascript
new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
```

Ако `<html lang="mk">` — Cyrillic-aware sort.
Ако `lang` е празен — browser default locale.
