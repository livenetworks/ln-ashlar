# Аудит — ln-sort

2026-09-11 · Опсег: `src/ln-sort.js` (302), `src/sort-model.js` (66), `README.md` (176), schema · Итерација 39/50

## Вердикт

Директниот пар на `ln-filter`, и спротивен по секоја точка каде таа отстапи: чита
`readValue`, реагира на пет атрибути наместо на еден, и испраќа cancelable настан
**еднаш**. Наодите се сите во истата тесна зона — каскадата за обновување при
подигање поставува `restored = true` на места каде ништо не е обновено, па авторскиот
почетен сорт тивко не се применува.

## Што е добро

**Ја чита машинската вредност, не прикажаниот текст.** `:18-24`:

```js
function _readItemValue(item, field) {
	if (field) {
		const el = item.querySelector('[data-ln-field="' + field + '"]');
		if (el) return readValue(el);
	}
	return readValue(item);
}
```

`readValue` (`ln-core`) враќа `data-ln-value` ако постои, инаку исечен текст. Тоа е
точно правилото на `mindset.md:105` — и точно она што `ln-filter` во режимот за
табели не го прави (FL3). Иста задача, ист слој, спротивна одлука; оваа е точната.

**Реагира на пет атрибута.** `_syncAttribute` (`:268-294`) покрива `-field`,
`-items`, `-state`, самиот `data-ln-sort` (целниот id) и `data-ln-hash`. За споредба,
`ln-filter` обработува само `data-ln-hash` и тивко ги игнорира останатите (FL5).

**Еден cancelable настан, кон целта.** `:208`:

```js
const evt = dispatchCancelable(target, 'ln-sort:change', detail);
if (evt.defaultPrevented) return;
this._defaultSort(target, normalized);
```

Едно испраќање. `ln-filter` испраќа двапати под исто име и обата буклаат (FL4); тука
тој проблем не постои.

**Меѓусебното исклучување работи без регистар.** `:53-83` — секоја инстанца слуша
`ln-sort:change` на `document` и **сама** се ресетира кога победил друг клуч:

```js
// Mutual exclusion: reset losing instances without re-dispatching
```

Нема координатор, нема листа на живи контроли, нема циклус на настани. Контролите се
јавуваат; никој не ги води.

**`skipStorage` ја прекинува повратната спрега.** `_apply(direction, true)` (`:137`,
`:149`, `:160`) при обновување не пишува назад во hash ниту во `localStorage`, па
вратената состојба не се пре-запишува. Параметарот постои само за таа гранка и е
искористен на сите три места каде треба.

**Враќањето на изворниот редослед е точно.** `_targetInitialOrders` (`:16`, `:223-225`)
ја снима почетната низа при првиот сорт, а `:230-232` ја филтрира на јазли што сè
уште се под истиот родител — значи ред што е обришан во меѓувреме не се враќа во DOM.

**`destroy()` изречно одбива да го врати редоследот, со образложение** (README:174-176):

> Does not restore the DOM to its pre-sort order — that's a **rendering side effect,
> not the component's own teardown responsibility** (same doctrine as
> `ln-search.destroy()`).

Донесена одлука со позиција, и со посочен преседан.

**`Intl.Collator` со `getLocale(this.dom)`** (`:237-239`) — стринговите се сортираат по
јазикот на страницата, не по кодна точка.

**`compareValues` / `detectValueType` доаѓаат од `ln-core`** (`:1`), делени со
`ln-table`. 2-Consumer правилото испочитувано.

## Наоди

### 🟠 SO1 — `data-ln-persist` без зачувана состојба го гаси авторскиот почетен сорт

**Каде:** `:144-153`

```js
if (!restored && dom.hasAttribute('data-ln-persist')) {
	const saved = persistGet('sort', dom);
	if (saved && saved.direction && saved.direction !== 'none') {
		queueBoot(function () { … self._apply(saved.direction, true); });
	}
	restored = true;            // ← надвор од `if (saved …)`
}

if (!restored) {
	const initialDir = normalizeSortDirection(dom.getAttribute(STATE_ATTR));
	if (initialDir && initialDir !== 'none') {
		queueBoot(function () { … self._apply(initialDir, true); });
	}
}
```

`restored = true` се извршува само поради присуството на атрибутот, без оглед дали
нешто е вратено. Значи:

```html
<button data-ln-sort="list" data-ln-sort-field="name" data-ln-sort-state="asc" data-ln-persist>
```

при прва посета — кога `localStorage` е празен — **никогаш** не го применува `asc`.
Листата останува во авторскиот DOM редослед, а контролата покажува `asc` преку
`data-ln-sort-state`, зашто атрибутот е таму каде авторот го напишал. Состојбата и
приказот се разидени од првиот рендер.

По првото кликање состојбата се зачувува и следната посета работи — значи дефектот
се самоскрива по еден циклус.

README:168-170 ги наведува обете како важечки, без услов:

> `data-ln-persist` on the root, restored in the constructor via `persistGet('sort', dom)`
> and applied via `_apply(saved.direction, true)` through `queueBoot`. **Authoring
> `data-ln-sort-state="asc"|"desc"` is also applied safely at boot via `queueBoot`.**

„Also" е точно она што кодот не го дозволува кога обете се присутни.

**Достижност:** секој `[data-ln-sort]` што носи и `data-ln-persist` и авторски
`data-ln-sort-state`, при прва посета или по чистење на складот.

### 🟠 SO2 — Hash за туѓа колона го гаси и persist и авторскиот дефолт

**Каде:** `:128-142`

```js
if (this.hashEnabled) {
	const hashVal = hashGet(this.nsKey);
	const decoded = hashSortDecode(hashVal);
	if (decoded) {
		const matches = (self.field !== null && decoded.fieldOrColumn === self.field)
			|| (self.column !== null && String(self.column) === decoded.fieldOrColumn);
		if (matches) {
			queueBoot(function () { … self._apply(decoded.direction, true); });
		}
		restored = true;        // ← надвор од `if (matches)`
	}
}
```

Истиот облик како SO1, со поширок дофат. Сите контроли за сортирање на една табела
делат еден hash простор (`resolveHashNamespace(dom, 'sort')`), па `decoded` е
непразно за **секоја** од нив штом која било колона е сортирана преку URL.

За контролите што **не** се победничката колона, `matches` е неточно, ништо не се
применува — но `restored` станува `true`, па нивниот `data-ln-persist` и нивниот
авторски `data-ln-sort-state` се прескокнуваат.

Тоа е бранливо како правило („hash победува целосно"), но не е запишано никаде, и не
е она што SO1 го прави — таму `restored` се поставува без ниту еден услов. Двете
гранки користат иста променлива со различна намера.

### 🟠 SO3 — `_defaultSort` ги преселува сите ставки под родителот на првата

**Каде:** `:217-250`

```js
const items = this.itemsSelector
	? Array.from(target.querySelectorAll(this.itemsSelector))
	: Array.from(target.children);
if (!items.length) return;
const parent = items[0].parentNode;
…
const frag = document.createDocumentFragment();
for (let i = 0; i < ordered.length; i++) frag.appendChild(ordered[i]);
parent.appendChild(frag);
```

`target.children` секогаш дели еден родител ✅. `querySelectorAll(itemsSelector)` не
мора — селекторот е слободен и се применува низ целото поддрво на целта.

Кога совпаѓањата се под повеќе родители, сите завршуваат под родителот на **првото**.
За табела со `data-ln-sort-items="tr"` тоа значи дека редовите од `<thead>` и од
`<tbody>` се спојуваат под првиот од нив — структурна промена, не преуредување.

README:158-160 го опишува механизмот точно, вклучувајќи ја придобивката:

> Reorders `target.children` (or `data-ln-sort-items` matches) by moving nodes into a
> `DocumentFragment` and re-appending — a single reflow, not N individual moves.

Она што не е кажано е претпоставката: селекторот мора да совпаѓа јазли под **еден**
родител. А README:78 и `:91` го промовираат како *„deep CSS selector for deep
targeting"*, што ја поканува спротивната употреба.

**Достижност:** ниту еден маркап во репото не го покажува тоа — `data-ln-sort-items`
нема консумент во `demo/**` ниту во `spa-starter/**`. Заведено како достижно преку
документираната намена, не преку постоечка употреба.

### 🟡 SO4 — README вели дека слушачот е на целта; тој е на `document`

**Каде:** `:83`, `:259` наспроти `README.md:174`

```js
document.addEventListener('ln-sort:change', this._onSortChange);   // :83
document.removeEventListener('ln-sort:change', this._onSortChange); // :259
```

> Removes the click listener (root) and the `ln-sort:change` listener (**target, if
> resolved**).

Слушачот никогаш не бил на целта. Разликата не е терминолошка: слушач на `document`
по инстанца значи дека табела со осум сортабилни колони држи осум document слушачи, и
дека **секој** сорт ги буди сите осум (`_onSortChange` потоа филтрира со
`isOurTarget` и `isSameSortTarget`).

Тоа е свесниот механизам за меѓусебно исклучување и работи ✅ — но неговиот трошок е
опишан како да е локализиран.

### 🟡 SO5 — `destroy()` го остава `data-ln-sort-state` и `aria-sort`

**Каде:** `:255-264`

Teardown-от симнува три слушача и ја брише инстанцата. На хостот остануваат
`data-ln-sort-state` (пишуван на `:69`, `:78`, `:98`, `:105`, `:183`) и `aria-sort` на
`<th>` (`:175`).

Значи уништена контрола и понатаму му соопштува на екранскиот читач дека колоната е
сортирана растечки, а ништо повеќе не го одржува тоа тврдење.

README:174-176 ја образложува **едната** одлука (редоследот во DOM останува) и не ја
спомнува другата. Двете се „рендерирачки страничен ефект" по истиот аргумент — но
`aria-sort` не е приказ, туку изјава за состојба. SYS-9, четврто појавување.

### 🟡 SO6 — Internals покажува на компајлираниот bundle

**Каде:** `README.md:140`

> Source: `components/ln-sort/ln-sort.js`

18 109 бајти, build артефакт. Изворите се `src/ln-sort.js` (302) и `src/sort-model.js`
(66) — вториот не се спомнува никаде во README-то, иако ги носи сите четири чисти
функции. Единаесетто појавување на SYS-3.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `SORT_DIRECTIONS` (`sort-model.js:3`) е извезен и нема консумент — ниту компонентата (`:2` зема четири други), ниту `tests/ln-sort.test.js`. Извезена површина без повикувач; `DOCTRINE.md` §2. | `sort-model.js:3` |
| P2 | `this.column = th.cellIndex` (`:34`) е снимка. `_syncAttribute` го пре-чита само кога `data-ln-sort-field` ќе се смени (`:271-274`). Вметната или отстранета колона ги поместува индексите на сите десно од неа, а контролите продолжуваат да го носат стариот `column` во `detail` — кој README:161-164 го опишува како единствената причина за неговото постоење (payload за SSR консументи). | `:34`, `:274` |
| P3 | Дев афордансот има едно правило (празна цел). Не покрива `data-ln-sort-field` што покажува кон непостоечки `[data-ln-field]`, ниту `[data-ln-sort-dir]` копче надвор од `[data-ln-sort]` — а второто е тивко мртво копче. Спореди `ln-editor-dev.scss`, кое токму таа проверка за осиротен елемент ја има. | `ln-sort-dev.scss` |
| P4 | `_apply` од `_syncAttribute` (`:280`) се вика **без** `skipStorage`, па надворешна промена на `data-ln-sort-state` пишува во hash и во `localStorage`. Тоа е разумно за програмска команда, но значи дека координатор што ја синхронизира состојбата на контролите неизбежно ја менува и адресата на страницата. | `:280` |
| P5 | `detectValueType(values)` (`:236`) се пресметува при **секој** `_defaultSort`, врз сите вредности на колоната. Резултатот е точен и се предава еднаш во компараторот ✅ (не по споредба), но за голем список типот се пре-открива на секое кликање. | `:235-236` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-sort` (id на целта) | `:5,30` | ✅ | ✅ |
| `data-ln-sort-field` | `:7,31` | ✅ + „Field is optional" | ✅ |
| `data-ln-sort-dir` (на копчиња) | `:9,46` | ✅ трите копчиња | ✅ |
| `data-ln-sort-state` (runtime + authored) | `:8,183` | ✅ обете улоги | ✅ |
| `data-ln-sort-items` | `:10,217` | ✅ | ✅ |
| `data-ln-field` (туѓ, се чита) | `:20` | ✅ | ✅ |
| `data-ln-hash` / `data-ln-persist` (туѓи) | `:11,40,144` | ✅ + Pitfall за клучот | ✅ |
| `data-ln-debug` | `-dev.scss` | ❌ | ✅ |
| `ln-sort:change` (cancelable, кон целта) | `:208` | ✅ | н/п |
| `ln-sort:destroyed` | **не постои** | — | н/п |
| `aria-sort` на `<th>` | `:172-176` | ✅ | н/п |
| `readValue` за вредноста | `:21,23` | ✅ изречно | н/п |
| `column` не се чита при сортирање | `:234-243` | ✅ „never consulted here" | н/п |
| меѓусебно исклучување преку `document` слушач | `:83` | ❌ тврди „target, if resolved" | н/п |
| authored `-state` + `data-ln-persist` | **се исклучуваат** | ❌ тврди „also applied" | н/п |
| hash за туѓа колона гаси дефолти | `:140` | ❌ неспомнато | н/п |
| `destroy()` го враќа редоследот | не | ✅ изречно, со причина | н/п |
| `destroy()` го чисти `-state` / `aria-sort` | **не** | ❌ неспомнато | н/п |
| Internals извор | `src/ln-sort.js` + `src/sort-model.js` | ❌ покажува на bundle | н/п |

## Затечена состојба

**Мртвиот SCSS од избришаниот `ln-table-sort.js` е позната ставка** и е надвор од
опсегот на оваа кампања (SCSS не се ревидира). Не се брои како наод.

**`ln-sort` и `ln-filter` ја решаваат истата класа проблеми спротивно.** Четири
точки, сите проверени во двата извора:

| прашање | `ln-sort` | `ln-filter` |
|---|---|---|
| извор на вредност | `readValue` (`:21`) | `textContent` (`ln-filter.js:313`) |
| реактивни атрибути | пет (`:299`) | еден (`ln-filter.js:377`) |
| испраќања по промена | едно (`:208`) | две, под исто име (`ln-filter.js:226,231`) |
| чистење на состојбата при `destroy` | образложено одбиено | пропуштено (FL1, FL2) |

Тоа не е наод против ниту една од двете — е состојба што ја затекнав, и е
најдиректната споредба во кампањата досега за тоа како изгледа истата задача решена
двапати.

**`data-ln-sort-items` нема консумент** во `demo/**` ниту во `spa-starter/**` — целата
гранка со длабок селектор (`:217-219`) е неизвежбана, вклучувајќи ја претпоставката од
SO3.

Конзолен излез: **нула** — втора компонента по ред без ниту еден `console.*`
(`ln-filter` беше првата). Inline стил: нула. `createElement`: еден
(`DocumentFragment`, `:248`) — не е UI школка. Зашиен кориснички текст: нула.
