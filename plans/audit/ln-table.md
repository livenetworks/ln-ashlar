# Аудит — ln-table

**Датум:** 2026-09-11 · **Итерација:** 42/50 · **Слој 5 — рендерери и упит**
**Опсег:** `src/ln-table.js` (1348), `src/table-model.js` (98), `README.md` (282), `ln-table.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Data-driven и windowed патеките се најзрелиот код во кампањата — единствениот вистински
искористен `*-model.js`, `queryGen` дисциплина, LRU кеш со жив toggle — но SSR режимот,
кој README-то го опишува како рамноправен прв режим и го документира на **пет** одделни
места до ниво на имиња на функции и увози, не филтрира, не сортира и не пребарува ништо:
`_applyFilterAndSort` е една `slice()` линија.

---

## Што е добро

**`table-model.js` е единствениот целосно усвоен модел во кампањата.** Четири извози,
**сите четири** увезени и повикани во компонентата (`:650`, `:759`, `:1080`, `:1117`,
`:1159`, `:1181`, `:1210`) **и** покриени во `tests/ln-table.test.js:5-9`. Нула
`window`/`document`/`localStorage` — чист по `component-coding-standards.md` §1. Спореди:
`ln-list` нема модел воопшто, `ln-sort` извезува `SORT_DIRECTIONS` што никој не го чита.

**Етикетата на select-all е направена точно по санкционираниот синџир.**

```js
// :1137-1139
const dictEl = self.dom.querySelector('[data-ln-table-dict="select-all"]');
const label = self.dom.getAttribute('data-ln-table-select-all-label')
	|| (dictEl ? dictEl.textContent.trim() : null)
	|| 'Select all';
cb.setAttribute('aria-label', label);
```

Атрибут → речник → резервна вредност. Тоа е точно образецот што `DOCTRINE.md:73-74` го
бара, и е поисправно од која било друга етикета што ја видовме досега.

**`destroy()` ги враќа сопствените DOM мутации.** `:1298-1302` — го вади инјектираниот
`<colgroup>` и го враќа `table.style.tableLayout`. Ниту една друга компонента во
кампањата не го враќа она што го запишала во layout.

**`_kickWindowInitial` има втор извор за вкупниот број.** `:1029-1033` — ако
`data-ln-table-count` недостига, го чита бројот од `[data-ln-table-total]` спанот и го
чисти од форматирање. Прагматично, и е единствениот случај во кампањата каде компонента
свесно чита назад сопствен форматиран излез со образложена причина.

**Трите вида одговор на `set-data` во windowed режим се разликувани** (`:183-190`), со
коментар што кажува зошто, не што — идентично со `ln-list`, и таму и овде точно.

**Заклучувањето на ширините на колоните пред re-render.** `_lockColumnWidths` (`:474-487`)
го снима `offsetWidth` на секој `<th>` во `<colgroup>` и префрла на `table-layout: fixed`
пред првиот виртуелен рендер. Без тоа секое прецртување на редови би ги прескокнало
колоните. Проблемот е фатен; начинот е одделно прашање (P5).

---

## Наоди

### 🔴 T1 — SSR режимот не филтрира, не сортира и не пребарува ништо

**Каде:** `_applyFilterAndSort` (`:467-470`)

```js
_component.prototype._applyFilterAndSort = function () {
	this._filteredData = this._data ? this._data.slice() : [];
	this.visibleCount = (this.isDataDriven && this._lastFiltered != null) ? this._lastFiltered : this._filteredData.length;
};
```

Копира и излегува. Нема пребарување, нема филтрирање по колона, нема сортирање.
Целата состојба што SSR гранката ја собира е мртва — потврдено со grep низ фајлот:

| состојба | се запишува | се чита за упит |
|---|---|---|
| `_searchTerm` | `:104`, `:132` | **никогаш** — само како boolean на `:521`, и во event detail |
| `_columnFilters` | `:364`, `:370` | **никогаш** — само `Object.keys(…).length` на `:521` |
| `_sortCol` | `:341` | **нула читања во целиот фајл** |
| `_sortDir` | `:342` | **нула читања во целиот фајл** |
| `_collator` (`:18`) | модул | **нула читања** |
| `row.values[]` (`readValue` по ќелија, `:409`) | `:436` | **никогаш** |
| `row.rawTexts[]` (`:410`) | `:437` | **никогаш** |
| `row.searchText` (`:439`) | `:439` | **никогаш** |

**Последицата е полоша од „нема функција".** SSR гранката го **откажува** настанот пред
да не направи ништо:

```js
this._onSearchChange = function (e) { e.preventDefault(); self._onSetSearch(e); };   // :119-123
this._onSort        = function (e) { e.preventDefault(); … };                        // :338-339
this._onFilterChange = function (e) { e.preventDefault(); … };                       // :356-357
```

- `ln-search` би ги скрил неподударните редови преку `data-ln-search-hide` — `preventDefault`
  го запира тоа (`ln-search.js:131`).
- `ln-sort._defaultSort` би ги пренаредил редовите сам — `preventDefault` го запира
  (`ln-sort.js:209-211`).
- `ln-filter` би ги скрил своите цели — исто запрено.

Значи **ставањето `data-ln-table` врз SSR табела ги гаси сортирањето, филтрирањето и
пребарувањето што би работеле и без неа.**

**README го тврди спротивното на пет места:**

| линија | тврдење |
|---|---|
| `:10` | *„layers **sorting, filtering, text searches**, and scroll virtualization on top of pre-rendered markup"* |
| `:99` | *„`data-ln-value` … **sorting/filtering operate on this**, not the displayed text"* |
| `:145` | *„SSR Mode … updates its in-memory `_columnFilters[key]`, **runs `_applyFilterAndSort()`**"* — ја именува функцијата |
| `:231` | *„**SSR**: … caches them as static HTML strings in `_data`, and **re-sorts/filters that in-memory cache** on `ln-search:change`, `ln-sort:change`, and `ln-filter:change`"* |
| `:249-251` | *„**SSR** — `e.preventDefault()`, **re-sorts the in-memory `_data` cache using `row.values[colIndex]`** (raw `readValue` per cell, type inferred once via `ln-core.detectValueType`)"* |

Последното е точното опишување на имплементација што ја **нема**. И тоа се потврдува од
самото README:226, кое ги наведува увозите:

> *„Imports from `ln-core`: `cloneTemplateScoped`, `dispatch`, `fill`, `fillTemplate`,
> `registerComponent`, `createWindowCache`, `readValue`, **`detectValueType`,
> `compareValues`**."*

Изворот, `:1`:

```js
import { cloneTemplateScoped, createBatcher, createWindowCache, dispatch, fill,
         fillTemplate, getLocale, readValue, registerComponent, requestData } from '../../ln-core';
```

`detectValueType` и `compareValues` **не се увезени.** Grep ги наоѓа во `ln-list`,
`ln-sort` и `ln-data-store` — никогаш во `ln-table`. Тоа е доказот дека SSR сортот
постоел или бил планиран, а README-то останало.

**Достижност:**

```
grep -rn 'data-ln-table="' --include=*.html demo/admin/src/ spa-starter/
→ шест домаќини, СИТЕ шест носат data-ln-table-source
```

Нула SSR консументи во репото — идентично со `ln-list`. Значи: недостижно по репо,
достижно по документираниот договор, а договорот е потврден со пет цитати и еден
блупринт (README:29-57).

---

### 🟠 T2 — `destroy()` во data-driven режим го остава `ln-search:change` слушачот

**Каде:** регистрација `:123` (безусловна) наспроти `destroy()` `:1270-1293`

```js
dom.addEventListener('ln-search:change', this._onSearchChange);   // :123 — надвор од двете гранки
```

```js
if (this.isDataDriven) {
	…                                                              // :1273-1284 — нема removeEventListener за ln-search:change
} else {
	…
	this.dom.removeEventListener('ln-search:change', this._onSearchChange);   // :1291 — само SSR
}
```

**Извор на правилото:** `DOCTRINE.md:105` — **Zero Post-Destroy Side Effects.**

По `destroy()` на data-driven табела, `ln-search:change` што ќе стигне до тој елемент сè
уште поминува низ `_onSearchChange` → `preventDefault()` → `_onSetSearch` → `dispatch(dom,
'ln-table:search')` → `_requestData()`. Уништена компонента која испраќа настан и бара
податоци.

Асиметријата во истиот `destroy()` — SSR гранката го трга, data-driven не — е доказ дека
е пропуст, не одлука.

**Достижност:** кога `destroy()` доаѓа од вадење на јазолот, откачениот елемент не прима
насочен настан (`ln-search.js:125` испраќа на самата цел). Реално е при експлицитен
`el.lnTable.destroy()` додека елементот останува. Сите шест табели во репото се
data-driven, значи сите шест ја носат оваа половина.

---

### 🟠 T3 — `destroy()` не го неутрализира windowed режимот; `_exitWindowedMode` го прави

**Каде:** `destroy()` `:1284` наспроти `_exitWindowedMode` `:1053-1057`

| чекор | `_exitWindowedMode` | `destroy()` |
|---|---|---|
| `_cache.destroy()` | ✅ `:1053` | ✅ `:1284` |
| `this._cache = null` | ✅ `:1054` | ❌ |
| `this._windowed = false` | ✅ `:1055` | ❌ |
| `this._renderBatch = null` | ✅ `:1056` | ❌ |
| `this._onCacheChange = null` | ✅ `:1057` | ❌ |

`_renderBatch` е `createBatcher(this._onCacheChange)` (`:995`), а `createBatcher`
(`ln-core/reactive.js:62-74`) закажува преку `queueMicrotask` **без откажување**.
`_onCacheChange:980` излегува само ако `!_windowed || !_cache` — обете остануваат
вистинити по `destroy()` — па продолжува до `_render()` → `_renderWindowed()` и
`dispatch(dom, 'ln-table:rendered')`.

**Ова е буквално истиот пропуст како `ln-list` L3**, до имињата на полињата. Двете
компоненти, ист код, ист превид — затоа е заведен и како системски образец.

**Достижност:** прозорец широк еден микротаск. Пријавено заради изречното правило и
заради тоа што чекорите се напишани 230 реда погоре. **Не предлагам guard.**

---

### 🟠 T4 — `_onSort` нема Detail Guard во ниту еден од двата режима

**Каде:** `:249-251` (data-driven) и `:338-341` (SSR)

```js
this._onSort = function (e) {
	e.preventDefault();
	self.currentSort = e.detail.direction === 'none' ? … ;    // :251 — e.detail непроверен
};
```

```js
this._onSort = function (e) {
	e.preventDefault();
	const direction = e.detail.direction === 'none' ? null : e.detail.direction;   // :340
```

**Извор на правилото:** `DOCTRINE.md:96` — *„**Detail Guard Pattern:** Always check
`e.detail && e.detail.prop` when listening to external events."*

Полошо од `ln-list`, каде барем SSR близнакот проверува (`ln-list.js:376`). Овде ниту
едната. `_onFilterChange:358` **го има** (`if (!e.detail) return;`), значи во истиот фајл
постои и правилната форма.

`ln-sort` секогаш испраќа детаљ (`ln-sort.js:193`), па нема потврден паднат случај;
наодот е против несогласната строгост во истиот фајл.

---

### 🟠 T5 — `_buildRow` измислува редови, со зашиен англиски текст

**Каде:** `:909-937`

```js
tr = document.createElement('tr');
tr.setAttribute('data-ln-table-row', '');
for (let j = 0; j < ths.length; j++) {
	const td = document.createElement('td');
	if (isSelectCol) {
		const cb = document.createElement('input');
		cb.type = 'checkbox';
		cb.setAttribute('data-ln-table-row-select', '');
		cb.setAttribute('aria-label', 'Select row');          // ← :927
		td.appendChild(cb);
	} else { … td.textContent = String(record[colName]); }
	tr.appendChild(td);
}
```

**Извори:** `DOCTRINE.md:70` — *„Never build DOM trees via `createElement` chains in JS"*;
`docs/architecture/mindset.md:25` — *„JS never creates UI chrome"*; `DOCTRINE.md:73` —
*„Zero Display Text in JS."*

Гранката се достигнува кога data-driven табела нема ниту `<template
data-ln-template="{name}-row">` ниту `<template data-ln-table-row>`. Тоа е авторска
грешка (README:73-79 го бара шаблонот) што добива измислена табела наместо dev-афорданс.

**Внатрешниот контрапример е 200 линии подолу.** `_enableSelection:1137-1139` ја гради
етикетата на **истиот вид** чекбокс преку `data-ln-table-select-all-label` → речник →
резервна вредност. `_buildRow:927` пишува `'Select row'` без атрибут, без речник, без
ништо — иако `data-ln-table-dict` веќе постои во договорот на компонентата.

**SYS-13.**

---

### 🟠 T6 — `_disableSelection` е 34 линии без ниту еден повикувач

**Каде:** `:1190-1223`

```
grep -n "_disableSelection" src/ln-table.js
→ 1190:	_component.prototype._disableSelection = function () {
```

Една појава — самата дефиниција. Функцијата ги трга слушачите, го вади инјектираниот
`<input>` од `<th>`, ја празни селекцијата и ги чисти `.ln-row-selected` класите — сè за
жив прекинувач што никогаш не е врзан: **`data-ln-table-selectable` не е во
`extraAttributes`** (`:1311-1316`), па неговата промена не се набљудува.

**Извор на правилото:** `DOCTRINE.md` §2 — **No Speculative Code.**

Спореди со `data-ln-table-window`, кој **е** во `extraAttributes` и има целосна
`enter`/`exit` двојка. Значи обликот на жив toggle постои во истиот фајл и е применет
таму каде бил потребен — овде е напишана само половината.

**Последица:** `destroy()` (кој не го вика) го остава инјектираниот `<input
type="checkbox">` од `:1135-1140` трајно во `<th>`-то.

---

### 🟠 T7 — Схемата присвојува пет туѓи или мртви атрибути

**Каде:** `ln-table.schema.json` — 28 атрибути, од кои:

| атрибут | `sources` | вистински сопственик |
|---|---|---|
| `data-ln-table-filter-col` | **`[]`** | `ln-table-coordinator` (`src/ln-table-coordinator.js:100`) |
| `data-ln-sort` | `ln-table-dev.scss`, `ln-table.scss` | `ln-sort` |
| `data-ln-sort-icon` | `ln-table.scss` | `ln-sort` |
| `data-ln-table-sort` | `ln-table-dev.scss` | **никој** — повлечениот `ln-table-sort.js` |
| `data-ln-table-col-sort` | `ln-table-dev.scss` | **никој** — исто |

Првиот е најчист случај: **`"sources": []`** значи дека генераторот не нашол ниту една
појава во ни `src/` ни во ко-лоцираниот SCSS. Записот е рачно внесен и преживува секоја
регенерација, зашто `sync-ln-schemas` не брише туѓи клучеви. `ln-table` никогаш не го
чита тој атрибут; `ln-table-coordinator.schema.json:60` **исто** го декларира, и таму е
точно.

Последните два доаѓаат од `ln-table-dev.scss:12-16`, каде се **изречно означени како
мртви**:

```scss
// These hooks are read only by the retired ln-table-sort.js — ln-table.js ignores them
th[data-ln-table-sort],
th:has([data-ln-table-col-sort]) {
	@include dev-inline-error("LEGACY SORT MARKUP — use [data-ln-sort]");
}
```

Дев-проверката што предупредува *„не користи го ова"* го внесува токму тоа име во
схемата — која е CI портата и изворот за доковите. **SYS-15**, нов облик: течење преку
негативен dev селектор.

---

### 🟡 T8 — README документира три атрибута на координаторот и еден непостоечки клуч

| ставка | README | каде навистина живее |
|---|---|---|
| `data-ln-table-clear` | `:35` (во SSR блупринтот), `:186` | `ln-table-coordinator/src/ln-table-coordinator.js` |
| `data-ln-table-clear-all` | `:188` | исто |
| `data-ln-table-col-filter` | `:101`, `:162` | исто |
| `filterOptions` | `:128`, и цела под-секција `:276-278` | **нигде** — нула појави во `components/**` |

Најостро е `data-ln-table-clear`. README:186 вели: *„**SSR mode:** `data-ln-table-clear`
on a button inside the table wrapper. Clears search term and all `[data-ln-filter]`
containers targeting this table."* Но:

1. `ln-table` не го чита (нула појави во `src/`).
2. Го чита `ln-table-coordinator`.
3. Истото README, на `:261`, забранува координатор врз SSR табела: *„**do not wrap an SSR
   table in `[data-ln-table-coordinator]`**, it will double-process search."*

Значи во SSR режим тоа копче нема ниту еден можен обработувач — по инструкција на самото
README, три реда подолу.

`filterOptions` е фикција со три реда детали за `{value, label}` обликот и една целосна
насловена под-секција. Ниту `ln-table`, ниту координаторот, ниту која било друга
компонента не чита таков клуч.

---

### 🟡 T9 — Пет испратени настани недокументирани, еден документиран не постои

Испратени во изворот, отсутни од README-то:

`ln-table:clear-filters` (`:129`) · `ln-table:empty` (`:871`) · `ln-table:search` (`:98`) ·
`ln-table:select-all` (`:1161`) · `ln-table:request-invalidate` (примен, `:246`)

Документиран, не постои во изворот: **`ln-table:set-filter`** (`:20`) — наведен меѓу
командните настани што компонентата ги прима. Grep: нула.

Секцијата „Emitted Events" (`:111-124`) наведува пет; изворот испраќа единаесет.

---

### 🟡 T10 — Мртов увоз, и увози наведени во README што ги нема

`fill` е увезен на `:1` и **никогаш не се вика** — единствениот повик е `fillTemplate`
(`:880`). README:82-85 го објаснува тоа коректно (*„the row pipeline never calls
`fill()`"*), значи одлуката е свесна, а увозот е остаток.

Обратно: README:226 ги наведува `detectValueType` и `compareValues` како увози на
`ln-table` — не се. Тоа е истиот остаток што го документира T1.

---

### 🟡 T11 — SYS-3, плус коментар што именува непостоечка компонента

**README:226** — `Source: components/ln-table/ln-table.js` → компајлираниот бандл (41.8 KB)
наместо `src/ln-table.js` (44.8 KB). **SYS-3**, тринаесетти потврден случај.

**`src/ln-table.js:8`:**

```js
// Tuning constant — duplicated in ln-data-table for component independence
const VIRTUAL_THRESHOLD = 200;
```

`ln-data-table` не постои — нема таква папка во `components/`. Дупликатот е во
`ln-list.js:7`. Коментарот покажува на име од порано.

---

### 🟡 T12 — `.hidden` на пет места, и остатоци по `destroy()`

`.hidden` се пали/гаси од JS на `:258`, `:1020`, `:1059`, `:1250`, `:1257` — **SYS-7**.
Класата живее само во `theme/utilities/_utilities.scss`, кој `ln-ashlar-core.scss` не го
повлекува: со core-only бандлот select-all копчето останува видливо во windowed режим, а
бројачите за филтрирано и избрано стојат како празни елементи.

`destroy()` (`:1266-1306`) остава: `.ln-table--loading` на домаќинот, `.ln-row-selected`
на редовите, `data-ln-table-row-id` запишани од `_buildRow:944`, и инјектираниот
`<input type="checkbox">` од `:1135-1140` (зашто `_disableSelection` никогаш не се вика —
T6).

Нема `ln-table:destroyed` — **SYS-23**.

---

### 🔵 P1 — `_collator` е замрзнат при вчитување на модулот и не се чита

```js
const _collator = typeof Intl !== 'undefined'
	? new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
	: null;                                                                      // :18-20
```

Коментарот вели *„Singleton — same lang for all table instances on the page"*. Две работи:
нула читања во фајлот (последица на T1), и — да се читаше — `lang` е снимен еднаш при
вчитување, додека `_formatNum:25` користи `getLocale(dom)` по елемент и на живо. Значи
`ln-core:locale-change` би ги преформатирал броевите, а не и редоследот.

`ln-list.js:514-516` го прави спротивното: нов колатор **по секое сортирање**, со
`getLocale(this.dom)`. Двата близнака се разидени.

---

### 🔵 P2 — Истото криење на select-all е напишано двапати

`:257-259` во конструкторот и `:1019-1021` во `_enterWindowedMode`. Конструкторската
копија се извршува откако `_enterWindowedMode` веќе поминал (`:170`), значи е мртво
повторување. `ln-list` го има само во `_enterWindowedMode`.

---

### 🔵 P3 — `selectedCount` има setter што ништо не прави, а се присвојува четирипати

```js
Object.defineProperty(_component.prototype, 'selectedCount', {
	get: function () { return this.selectedIds.size; },
	set: function () { /* computed from selectedIds */ }      // :1101
});
```

Присвојувања: `:1120`, `:1160`, `:1185`, `:1211`. Сите четири се празен ход. Тивко
голтнат запис — `table.selectedCount = 5` не фрла и не прави ништо.

---

### 🔵 P4 — Скрол-контејнерот се бара поинаку отколку кај близнакот

`_findScrollContainer` (`:32`) почнува од `el.parentElement`; `ln-list.js:25` почнува од
`el` самиот. Значи табела во `overflow-y:auto` **самата** не се препознава, список да.

И `:589-591` во SSR режим присилно поставува `_scrollContainer = null` (само прозорец),
без коментар зошто. Во мртва гранка (T1), па 🔵.

---

### 🔵 P5 — Inline стилови и `createElement` синџири за скелето на виртуелниот скрол

`:671`, `:687`, `:722`, `:775`, `:795` — `td.style.height = …px`; `:480` —
`col.style.width = …px`; `:485` — `table.style.tableLayout = 'fixed'`.
SSR гранката ги гради истите како HTML низа со три inline својства:

```js
html += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' +
	colSpan + '" style="height:' + topH + 'px;padding:0;border:none"></td></tr>';   // :699-700
```

`CLAUDE.md` §2 забранува поставување CSS својства од JS; `DOCTRINE.md:70` забранува
`createElement` синџири. Вредностите се вистински пресметани и не можат да бидат класа —
истото важи за `ln-list` (L5). Ова е спарената ставка од #41 и заслужува една пресуда за
обете, не два одделни исклучока.

---

### 🔵 P6 — `.ln-table__spacer` е дефиниран трипати, со два различни mixin-а

| фајл | правило |
|---|---|
| `components/ln-table/ln-table.scss:13` | директни `!important` декларации |
| `theme/components/_ln-table.scss:56` | `@include ln-table-spacer-row` |
| `theme/components/_table.scss:84` | `@include table-spacer-row` |

Два различни mixin-а за истата класа плус една рачна копија. `.ln-table__placeholder`
пак постои **само** во theme слојот (`_ln-table.scss:60`) — значи со core-only бандлот
placeholder редовите добиваат нормален `td` padding и рабови, а висината им е поставена
inline од `_rowHeight`; збирот се разидува со пресметката на виртуелниот прозорец.
`ln-list` го има својот `.ln-list__placeholder` во ко-лоцираниот `ln-list.scss:20`.

---

### 🔵 P7 — Двата близнака читаат различен клуч од истиот настан

`ln-table` SSR чита `e.detail.column` (индекс на колона, `:341`, `:348`);
`ln-list` SSR чита `e.detail.field` (име на поле, `ln-list.js:379`). `ln-sort` испраќа
**обете** (`ln-sort.js:193` — `column`, и `field`), па ниту едното не паѓа — но два
сестрински рендерера го читаат истиот договор поинаку, без запишана причина.

---

### 🔵 P8 — Приватен `MutationObserver` во SSR гранката

`:328-335` — `_emptyTbodyObserver` чека првиот ред. `component-guide.md:169-175`
санкционира точно два трајни приватни набљудувачи (`ln-progress`, `ln-icon`), ниту еден
од нив овој случај; `registerComponent` нуди `onSubtreeChange`. Уништувањето е коректно
(`:1286-1289`). Истиот образец како `ln-list` P6.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-table` | `:5`, `:69` | ✅ `:93` | ✅ `author` |
| `data-ln-table-source` | `:68`, `:70` | ✅ `:94` | ✅ `author` |
| `data-ln-table-body` | `:47` | ❌ отсутен од табелата (само во примерот `:69`) | ✅ `author` |
| `data-ln-table-selectable` | `:149` | ✅ `:95` — без забелешка дека не е observable (T6) | ✅ `author` |
| `data-ln-table-window` | `:170`, `:974` | ✅ `:96`, `:192-220` | ✅ `author` |
| `data-ln-table-window-page/-threshold` | `:975`, `:976` | ✅ `:206` | ✅ `author` |
| `data-ln-table-count` | `:1029` | ✅ `:206` | ✅ `author` |
| `data-ln-table-col` | `:424`, `:930` | ✅ `:98` | ✅ `author` |
| `data-ln-table-col-select` | `:920`, `:1132` | ✅ `:102` | ✅ `author` |
| `data-ln-table-row` | `:268`, `:907` | ✅ `:103` | ✅ `both` |
| `data-ln-table-row-id` | `:271`, `:944` | ❌ отсутен од табелата | ✅ `both` |
| `data-ln-table-row-select` | `:263`, `:926` | ✅ `:104` | ✅ `both` |
| `data-ln-table-row-action` | `:264`, `:283` | ✅ `:105` | ✅ `author` |
| `data-ln-table-cell-attr` | `:882` | ✅ `:83` (во забелешка) | ✅ `author` |
| `data-ln-table-dict="select-all"` | `:1137` | ❌ неспомнат | ✅ `author` |
| `data-ln-table-select-all-label` | `:1138` | ❌ неспомнат | ✅ `author` |
| `data-ln-table-empty` / `-when` | `:7`, `:829`, `:832` | ⚠️ само во блупринтот `:32` | ✅ `author` |
| `data-ln-table-total/filtered/selected` | `:54`, `:55`, `:61` | ⚠️ само во проза `:240` | ✅ `author` |
| `data-ln-table-clear` / `-clear-all` | ❌ **нула** | ✅ `:35`, `:186`, `:188` (T8) | ❌ отсутни |
| `data-ln-table-col-filter` | ❌ **нула** | ✅ `:101`, `:162` (T8) | ❌ отсутен |
| `data-ln-table-filter-col` | ❌ **нула** | ✅ `:147`, `:159` | ⚠️ `sources: []` (T7) |
| `data-ln-table-sort` / `-col-sort` | ❌ повлечени | ❌ | ⚠️ од негативен dev селектор (T7) |
| `data-ln-sort` / `-sort-icon` | ❌ туѓи | ✅ `:100` (како упат кон `ln-sort`) | ⚠️ присвоени (T7) |
| `filterOptions` (клуч во `set-data`) | ❌ **нула во `components/**`** | ✅ `:128`, `:276-278` (T8) | n/a |
| `ln-table:set-filter` | ❌ не постои | ✅ `:20` (T9) | n/a |
| `ln-table:empty` / `:search` / `:select-all` / `:clear-filters` | `:871`, `:98`, `:1161`, `:129` | ❌ недокументирани (T9) | n/a |
| `ln-table:destroyed` | ❌ не постои | ❌ | n/a |
| SSR сорт/филтер/пребарување | ❌ **`_applyFilterAndSort` е `slice()`** | ✅ `:10`, `:99`, `:145`, `:231`, `:249` (T1) | n/a |
| увози `detectValueType`/`compareValues` | ❌ не се увезени | ✅ `:226` (T10) | n/a |
| увоз `fill` | ⚠️ увезен, неповикан | ✅ `:82-85` правилно вели дека не се вика | n/a |
| Internals извор | `src/ln-table.js` | ❌ `:226` → бандл (T11) | n/a |

---

## Затечена состојба

### Пренесената именска стапица е разрешена

Двата атрибута со скоро исто име се **вистински различни** и обата постојат:

| атрибут | сопственик | значење | употребен во |
|---|---|---|---|
| `data-ln-filter-col` | `ln-filter` (`src/ln-filter.js:11`, `COL_ATTR`) | **0-базиран индекс** на колона во обична `<table>` | `demo/admin/src/pages/filter.html` ×4 |
| `data-ln-table-filter-col` | `ln-table-coordinator` (`src/ln-table-coordinator.js:100`) | **име на клуч** што се мапира на `<th>` за индикаторот | 6 демо страници + `docs/architecture/reference.md:793` |

Значи не е алијас и не е грешка — две функции со несреќно слични имиња. `ln-filter`
README:128 веќе носи Pitfall за тоа. Единственото што е дефект е дека `ln-table`
схемата го присвојува вториот (T7). **Ставката се затвора.**

### `fill()` двојната семантика — затворена и за `ln-table`

`_buildRow:899` секогаш почнува со `cloneTemplateScoped` (свеж клон), `:903` со
`importNode` (свеж), `:912` со `innerHTML` во свеж `<tbody>`, `:915` со `createElement`.
Ниту една патека не реискористува постоечки ред. И `_fillRow:880` вика **само**
`fillTemplate`, никогаш `fill()` — за разлика од `ln-list.js:961-962` кој вика обете.

Значи `ln-core` R7 сценариото не може да се манифестира ниту овде. **Ставката се затвора
целосно** (беше половина затворена на #41).

### Санкционирани `createElement` исклучоци — трите множества

Пренесената ставка од `ln-options` O2 бараше попис. Затечено:

| извор | што наведува како исклучок |
|---|---|
| `DOCTRINE.md:71` | *Micro-Component Exception* — бихејвиорални декоратори на копчиња, именува `ln-confirm` |
| `ln-options` README | себеси + `ln-table` select-all |
| стварност | `ln-table`: colgroup/col (`:477-481`), spacer `tr`/`td` (×4), placeholder (`:717-723`), empty-state `tr`/`td` (`:844-849`), select-all `input` (`:1135`), цел ред (`:915-936`). `ln-list`: spacer, placeholder, empty-state обвивка, цел ред |

Трите множества не се преклопуваат ни на едно место освен `ln-confirm`. Ниту еден
документ не го именува виртуелниот скрол, кој е најголемиот консумент. **Ставката
останува отворена — бара пресуда, не наод.**

### SSR наспроти data-driven — истата асиметрија како кај `ln-list`

Обете компоненти документираат два рамноправни режима, обете имаат нула SSR консументи,
и кај обете SSR половината носи дефекти што никогаш не биле извртени. Разликата: `ln-list`
SSR **има** имплементација (`ln-list.js:478-529`) со дефекти; `ln-table` SSR **нема**
имплементација воопшто.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:45`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ — `winAttr > 0`, `threshAttr >= 0` (`:998-1000`) |
| SYS-8 (сиров `console.error`) | ✅ нула `console.*` |
| SYS-11 (BEM `__` компаунди) | ⚠️ три — `__spacer`, `__placeholder`, `__empty` (+ `__empty-state` во README:33) |
| SYS-14 (состојба надвор од `data-ln-*`) | ✅ — `tr._lnRecord` е JS expando |
| SYS-22 (README без Internals) | ✅ има, најдеталниот во кампањата |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| модел фајл | ✅ **најдобро усвоен во кампањата** — 4/4 извози живи, покриени со тестови |

---

## Отворени прашања за тебе

1. **T1 — што со SSR режимот?** Три излеза: (а) се имплементира — `ln-list.js:478-529`
   веќе го има целиот филтер/сорт код што може да се пренесе, плус `row.values`/`rawTexts`
   што `_parseRows` веќе ги собира; (б) се брише заедно со README:29-57 и петте тврдења,
   и `_onSearchChange`/`_onSort`/`_onFilterChange` престануваат да го откажуваат настанот
   за да им се врати контролата на `ln-search`/`ln-sort`/`ln-filter`; (в) се задржува
   како е и README-то се коригира. Опција (б) е единствената што веднаш ја враќа
   изгубената функционалност без нов код.

2. **T7/T8 — кој ја чисти схемата и README-то од туѓите атрибути?** Пет во схемата, три
   во README, плус `filterOptions`. Дел од нив (`data-ln-table-sort`, `-col-sort`) влегуваат
   преку **негативен** dev селектор — истиот механизам што го затворивме кај
   `ln-progress`. Треба ли `sync-ln-schemas` да ги игнорира имињата што се појавуваат само
   внатре во `dev-inline-error` блок?

3. **T6 — `_disableSelection` останува или си оди?** Ако останува, `data-ln-table-selectable`
   треба во `extraAttributes` и добива жив toggle како `data-ln-table-window`. Ако си оди,
   `destroy()` треба сам да го извади инјектираниот `<input>`.

4. **T3 — `destroy()` наспроти `_exitWindowedMode`.** Идентично прашање како `ln-list` L3.
   Една пресуда покрива две компоненти.

5. **P5 — виртуелното скеле и inline стилот.** Исто како кај `ln-list`. Дали
   spacer/placeholder висината добива запишан исклучок (како `ln-date` inline picker-от),
   или постои друг механизам што не сме го разгледале?

6. **P1/P7 — двата близнака се разидени на три места** (колатор, скрол-контејнер, клуч од
   `ln-sort:change`). Дали `ln-table` и `ln-list` треба да конвергираат, или разликите се
   намерни?

---

**Наоди:** 🔴 1 · 🟠 6 · 🟡 5 · 🔵 8
