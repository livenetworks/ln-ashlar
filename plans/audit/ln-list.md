# Аудит — ln-list

**Датум:** 2026-09-11 · **Итерација:** 41/50 · **Слој 5 — рендерери и упит**
**Опсег:** `src/ln-list.js` (1291), `README.md` (149), `ln-list.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Двата режима на `ln-list` не се рамноправни: data-driven + windowed патеката е добро
изградена, со чесна `queryGen` дисциплина, batcher и жив toggle на прозорецот — додека
SSR режимот, кој README-то го води како **прва** документирана поставка, нема ниту еден
консумент во целиот репозиториум и содржи три дефекти што ниту еднаш не биле извртени.

---

## Што е добро

**Windowed режимот се вклучува и исклучува во живо, целосно.** `_enterWindowedMode`
(`:1090`) и `_exitWindowedMode` (`:1164`) се вистински пар — вториот го уништува кешот,
го нулира `_renderBatch` и `_onCacheChange`, го враќа select-all копчето, ги празни
податоците и бара свежи. Малку компоненти во кампањата имаат толку комплетен обратен пат.

**`queryGen` дисциплината е спроведена на вистинското место.** `requestPage`
(`:1120-1130`) го носи `self._cache.queryGen`, а seed-от при подигање изречно **не** го
носи (`:1141-1153`, со коментар зошто — „it must never be dropped as stale"). Тоа е
разликата меѓу „страница за тековниот упит" и „она што серверот веќе го отпечатил во
markup", и е фатена точно.

**Трите вида одговор на `set-data` во windowed режим се разликувани.** `:198-205` —
прифатена авторитативна страница го гаси `--loading`; одбиена значи дека изворот сè уште
не го разрешил новиот упит; provisional е одговор на самата store додека серверскиот
упит е во лет. Три состојби, три однесувања, еден ред код.

**Заштитата на SSR семето е експлицитна.** `:194-196` — празен payload пред првиот
API одговор не ги гази пред-рендерираните ставки. Коментарот кажува зошто, не што.

**Скролот се зачувува околу секој re-render.** `_saveScroll`/`_restoreScroll`
(`:35-49`) се викаат околу сите четири мутациски точки (`:582`, `:768`, `:785`, `:872`).
Ниту една не е пропуштена.

**Отсуството на early-return во `_renderWindowed` е образложено, не заборавено.**
`:842-843` — *„No `start===_vStart` early-return: windowed must re-render when a page
splices in even if the range is unchanged."* Спротивното (`_renderVirtual:736`) го **има**
early-return-от, и таму е точно. Две различни одлуки, обете свесни.

---

## Наоди

### 🟠 L1 — SSR режимот: над 170 линии код, нула консументи, прво место во README

**Каде:** конструкторскиот `else` (`:329-393`), `_applyFilterAndSort` SSR гранка
(`:478-529`), `_renderAll` else (`:587-597`), `_renderVirtual` else (`:773-790`),
`_showEmptyState` else (`:902-909`), `_measureItemHeight` else (`:634-639`),
`_restoreSelection` (`:980-991`)

**Извор на правилото:** `DOCTRINE.md` §2 — **No Speculative Code.**

README:9-25 го носи насловот **„1. Simple SSR List"** како прва поставка. Grep низ
целиот авторски markup:

```
grep -rn 'data-ln-list="' --include=*.html demo/ spa-starter/  (без dist)
→ demo/admin/list.html:280            data-ln-list="hybrid-docs"
→ demo/admin/src/pages/list.html:63   (истиот фајл, изворна верзија)
```

**Еден домаќин во целиот репозиториум** — и тој носи `data-ln-list-source`,
`data-ln-list-window`, `data-ln-list-selectable`, `data-ln-list-count`. Значи SSR режимот
(`data-ln-list` **без** `-source`) има нула консументи, никогаш.

Дека навистина не е вртен се гледа по три работи што би паднале на прв обид:

**(а) Празен SSR список никогаш не го прикажува своето празно шаблонче.**
Конструкторот (`:333-343`): ако `tbody` нема деца, се поставува `_emptyObserver` и се
чека; `_render()` **не се вика**. Ако деца има, `_parseChildren` → `_render`. А
`_render` SSR гранката (`:556-568`):

```js
const isFiltered = count === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0);
if (isFiltered) { … this._showEmptyState(); }
```

`_showEmptyState` се достигнува **само** ако има активен термин или филтер. Список што е
празен од серверот не поминува ниту низ едната ниту низ другата патека. README:97
документира `data-ln-list-empty` како *„Empty state template in SSR mode"* — тој шаблон
може да се прикаже само откако корисникот пребарал нешто што не постои. Grep за
`data-ln-list-empty` во авторски markup: **нула**.

**(б) `_measureItemHeight` го мери spacer-от наместо ставка.**

```js
} else {                                   // :634 — SSR
	const children = this.tbody.children;
	if (children.length > 0) {
		this._itemHeight = _getOuterHeight(children[0]) || 50;
	}
}
```

`_parseChildren:402` изречно ги филтрира spacer-ите; ова не. Сценариото:
SSR список над 200 ставки (`VIRTUAL_THRESHOLD`, `:7`) → `_renderVirtual` SSR гранка
(`:774-786`) впишува `topSpacer + ставки + bottomSpacer` преку `innerHTML` → корисникот
скрола надолу така што `firstRow > BUFFER_ROWS` → `topSpacerHeight > 0` → **`children[0]`
е spacer-от** → корисникот менува големина на прозорецот → `_resizeHandler` (`:665-671`)
прави `_itemHeight = 0; _measureItemHeight()` → `_itemHeight` станува висината на
spacer-от (стотици пиксели) → `rowHeight` огромен → `firstRow` паѓа на 0 → списокот
скока на врв и прикажува погрешен опсег.

**(в) Секој SSR re-render поминува низ `outerHTML` → `innerHTML`.**
`_parseChildren:444` снима `html: el.outerHTML`; `_renderAll:593` прави
`this.tbody.innerHTML = html.join('')`. Значи:
- снимката е замрзната во моментот на монтирање — сè што некоја друга компонента запишала
  **потоа** (состојбен атрибут, форматиран текст) не е во неа;
- секое пребарување/филтрирање/сортирање ги **уништува и пресоздава сите** елементи, па
  слушач што консумер го закачил на `<li>` исчезнува трајно;
- фокусот внатре во ставка се губи при секој притиснат тастер во пребарувалката.

**Достижност на самите три:** нула, по репо. Достижни по документираниот договор —
README:9-25 е првото нешто што авторот ќе го препише.

**Што НЕ е наод овде:** дека SSR re-render ја губи селекцијата. Тоа е познатата ставка
(`_restoreSelection`, `fa78af0`/`731f4d0`) и е заведена како таква.

---

### 🟠 L2 — `_onSort` во data-driven режим нема Detail Guard; SSR близнакот го има

**Каде:** `:263-268` наспроти `:375-380`

```js
// data-driven (:264)
this._onSort = function (e) {
	if (e.detail.field == null) return;        // ← e.detail не е проверен
	…
};

// SSR (:376)
this._onSort = function (e) {
	if (e.detail && e.detail.field == null) return;   // ← проверен
	…
};
```

**Извор на правилото:** `DOCTRINE.md:96` — *„**Detail Guard Pattern:** Always check
`e.detail && e.detail.prop` when listening to external events"*, со пример токму за
`ln-search:change`.

Истиот фајл, истата операција, две различни строгости — што значи дека едната е случајна.
`ln-sort` секогаш испраќа детаљ (`ln-sort.js:208`), па нема потврден достижен повикувач
што би фрлил; ама `ln-sort:change` е јавно име и правилото постои токму за да не зависи од
тоа кој го испраќа.

**Достижност:** нема потврден испраќач без детаљ во репото. Наодот е против несогласната
строгост, не против паднат случај.

---

### 🟠 L3 — `destroy()` не го неутрализира windowed режимот; `_exitWindowedMode` го прави

**Каде:** `destroy` (`:1210-1250`) наспроти `_exitWindowedMode` (`:1164-1181`)

**Извор на правилото:** `DOCTRINE.md:105` — *„**Zero Post-Destroy Side Effects:** A
destroyed component MUST NOT mutate the DOM, MUST NOT dispatch state updates or
CustomEvents, and MUST NOT commit asynchronous results."*

| чекор | `_exitWindowedMode` | `destroy()` |
|---|---|---|
| `_cache.destroy()` | ✅ `:1166` | ✅ `:1219` |
| `this._cache = null` | ✅ `:1167` | ❌ |
| `this._windowed = false` | ✅ `:1168` | ❌ |
| `this._renderBatch = null` | ✅ `:1169` | ❌ |
| `this._onCacheChange = null` | ✅ `:1170` | ❌ |

`_renderBatch` е `createBatcher(this._onCacheChange)` (`:1113`), а `createBatcher`
(`ln-core/reactive.js:62-74`) закажува преку `queueMicrotask` и **нема откажување**:

```js
return function schedule() {
	if (pending) return;
	pending = true;
	queueMicrotask(function () { pending = false; renderFn(); … });
};
```

Значи ако кешот се сменил, а `destroy()` се повика во истиот task, закажаниот микротаск
сепак се извршува: `_onCacheChange` (`:1097`) проверува `if (!self._windowed || !self._cache) return;` —
обете сè уште вистинити после `destroy()` — па продолжува до `self._render()` →
`_renderWindowed()` → `this._cache.logicalTotal` на уништен кеш, `replaceChildren` врз
DOM, и `dispatch(dom, 'ln-list:rendered')`.

Постоењето на точно тие четири линии во `_exitWindowedMode` е доказот дека се знае што
треба — само не е повторено во `destroy()`.

**Достижност:** прозорец широк еден микротаск. Го пријавувам заради изречното правило и
заради тоа што чекорите се веќе напишани десет реда погоре — **не предлагам нов guard**.

---

### 🟠 L4 — `.hidden` се пали од JS на четири места

**Каде:** `:1137`, `:1172`, `:1199`, `:1205`

```js
this._selectAllCheckbox.classList.add('hidden');                     // :1137
this._filteredWrap.classList.toggle('hidden', !hasActiveFilter);     // :1199
this._selectedWrap.classList.toggle('hidden', selected === 0);       // :1205
```

**SYS-7.** `.hidden` живее само во `theme/utilities/_utilities.scss`, кој
`ln-ashlar-core.scss` не го повлекува. Со core-only бандлот класата не постои, па:
select-all копчето останува видливо во windowed режим (иако `_renderWindowed:876`
изречно не го ажурира), а бројачите за филтрирано и избрано се прикажуваат со празен
`textContent` — визуелна дупка наместо скриен елемент.

Ова исто се судира со пресудата од `project_core-theme-scss-split` дека криењето оди преку
нативниот `hidden` атрибут.

**Достижност:** единствениот жив консумент (`demo/admin/list.html:280`) е windowed и
selectable, значи `:1137` се извршува при секое подигање.

---

### 🟠 L5 — `_buildItem` измислува UI кога шаблон недостига

**Каде:** `:941-959`

```js
if (!el) {
	if (item && item.html) { … }             // SSR снимка — во ред
	else {
		el = document.createElement(this.isUl ? 'li' : 'div');
		el.setAttribute('data-ln-item', '');
		for (const prop in item) {
			if (prop !== 'html' && item[prop] != null) {
				const span = document.createElement('span');
				span.setAttribute('data-ln-field', prop);
				span.textContent = String(item[prop]);
				el.appendChild(span);
			}
		}
	}
}
```

**Извор на правилото:** `DOCTRINE.md:70` — *„Never build DOM trees via `createElement`
chains in JS"* и `docs/architecture/mindset.md:25` — *„JS never creates UI chrome."*

Гранката се достигнува кога data-driven список нема ниту `<template data-ln-template="{name}-row">`
ниту `<template data-ln-item>`. Тоа е авторска грешка што README:51 изречно ја именува
(*„Must contain an element with `data-ln-item`"*). Наместо dev-афорданс, компонентата
синтетизира еден `<span data-ln-field>` по поле — украс што никој не го побарал, што
изгледа речиси исправно и затоа го крие вистинскиот проблем. `ln-list-dev.scss` (8 линии)
проверува само дали домаќинот има `id`.

**Истиот доктринарен ред го прекршуваат уште три места, без иста тежина:**
spacer-ите (`:748-752`, `:761-765`, `:850-854`, `:865-869`), placeholder-от (`:793-798`),
и обвивката на празната состојба (`:916-918`) — сите `createElement` синџири со
`el.style.height = …px` (inline стил од JS, забрането со `CLAUDE.md` §2). За spacer-ите
висината е вистински пресметана вредност што не може да биде класа; за `ln-table` важи
истото, па тоа се води како затечена состојба за #42, не како наод овде.

---

### 🟠 L6 — `data-ln-item*` не го носат името на компонентата, а `.ln-item-selected` нема CSS

**Каде:** `data-ln-item`, `data-ln-item-id`, `data-ln-item-select`, `data-ln-item-action` ·
`.ln-item-selected` на `:969`, `:986`, `:1011`, `:1014`, `:1040`, `:1043`

**Извор на правилото:** пресудата за отсуство на алијаси — *атрибут и настан носат **полно
име** на компонентата*. Тука се `ln-item-*`, не `ln-list-item-*`.

Проверив дали е споделен речник со `ln-table`:

```
grep -rn "data-ln-item" --include=*.js components/*/src/  (без ln-list)
→ само components/ln-debug/src/generated-attributes.js (авто-генериран попис)
```

`ln-table` користи сопствени `data-ln-table-*`. Значи **не е споделен речник** — четири
атрибута и една класа во приватниот простор на `ln-list` што не го носат неговото име.
Настаните, за разлика од нив, се правилни: `ln-list:item-click`, `ln-list:item-action`.

**Плус:** `.ln-item-selected` се пали на шест места и **нема ниту едно CSS правило** во
целиот авторски SCSS (`ln-list.scss` покрива само `--loading`, `__spacer`, `__placeholder`).
Втор случај во кампањата на JS state класа што никој не ја чита, по `ln-sortable` SB2 —
таму четири класи, овде една. README-то нема табела на CSS класи, па не е ни документирана.

---

### 🟡 L7 — `item-click` и `item-action` постојат само во data-driven режим

**Каде:** `:290` и `:310` — обете внатре во `if (this.isDataDriven)` блокот што почнува на `:171`

README:126-127 ги наведува без ниту една ознака за режим, додека соседните ставки во
истата листа **имаат** такви ознаки (`ln-list:filter` — *„Fired in SSR mode"*;
`ln-list:search` — *„Fired in Data-Driven mode"*). Значи отсуството се чита како „во
обата режима".

Во SSR режим клик врз ставка не испраќа ништо. SSR блупринтот на README:21-24 дава
`<li data-ln-item-id="1">` — ставки со идентитет, што директно сугерира дека се кликливи.

---

### 🟡 L8 — Селекцијата бара `data-ln-item` на секоја SSR ставка; README го документира како шаблонски

**Каде:** `_onSelectionChange:1003` (`cb.closest('[data-ln-item]')`),
`_restoreSelection:982`, `_updateSelectAll:1063`, `_onSelectAll:1032` — сите бараат
`[data-ln-item]`

`_enableSelection` се повикува во **обата** режима (`:167`), за разлика од item-click.
Ама README:88 го опишува `data-ln-item` како *„**Template element** — Identifies an item
root inside a template or hydrated markup"*, а SSR блупринтот (`:21-24`) го нема на
ставките. Значи `data-ln-list-selectable` врз тој блупринт не прави ништо: секој
`closest('[data-ln-item]')` враќа `null` и сите четири патеки тивко излегуваат.

---

### 🟡 L9 — Недокументирана жетва на сите `data-*` атрибути

**Каде:** `:435-441`

```js
for (let j = 0; j < el.attributes.length; j++) {
	const attr = el.attributes[j];
	if (attr.name.startsWith('data-') && !attr.name.startsWith('data-ln-')) {
		const key = attr.name.slice(5);
		if (key) fields[key] = attr.value;
	}
}
```

Секој не-`ln` `data-*` атрибут на ставката станува филтрирачко/сортирачко поле, со клучот
како што е напишан (`data-dept` → `dept`, `data-foo-bar` → `foo-bar`). Демото се потпира
на тоа (`list.html:293`, `data-dept="Operations"`).

README:93 документира само `data-ln-list-field`. Единствената трага за оваа патека е
полуреченица во листата на настани — README:115, *„filters in-memory records by field /
**data attributes**"*. Тоа е јавна површина без договор: нема ограничување на имиња, нема
приоритет кога истото име доаѓа и од `data-ln-list-field` и од `data-*` (`:433` пишува
прво, `:439` пребришува).

---

### 🟡 L10 — Записот во payload-от носи серијализиран HTML

**Каде:** `:443-449` (градење), `:965` (`el._lnRecord = item`), `:282`/`:301` (читање)

```js
this._data.push({
	html: el.outerHTML,        // ← целиот елемент како стринг
	id: id,
	searchText: text,
	fields: fields,
	...(record || {})
});
```

Тој објект оди директно во `detail.record` на `ln-list:item-click` и `ln-list:item-action`.
За SSR-семената ставка тоа значи дека консументот добива `record.html` со целиот
`outerHTML`, плус `record.searchText` (мали букви, исечен) и `record.fields` — три
внатрешни клуча измешани со вистинските полиња на записот. Демото логира `e.detail.record`
(`list.html:1478`).

Не е и опасно: `fill(el, item)` (`:962`) поминува низ истиот објект, па шаблон со
`data-ln-field="html"` би добил серијализиран HTML како текст.

---

### 🟡 L11 — `destroy()` остава класи на DOM-от и не испраќа ништо

`destroy()` (`:1210-1250`) ги трга сите слушачи коректно — но ги остава
`ln-list--loading` на домаќинот, `ln-item-selected` на ставките, `.hidden` на
`_filteredWrap`/`_selectedWrap`/`_selectAllCheckbox`, и `data-ln-item-id` што
`_buildItem:967` ги запишал.

Нема `ln-list:destroyed` — **SYS-23**, во групата од 27 што не испраќаат.

---

### 🔵 P1 — `_onItemClick` е пета послаба копија на `shouldIgnoreClick`

`:272-276` наспроти `ln-core/helpers.js` `shouldIgnoreClick`:

| проверка | core | `ln-list` |
|---|---|---|
| `ctrlKey` / `metaKey` | ✅ | ✅ |
| `shiftKey` / `altKey` | ✅ | ❌ |
| `button !== 0` | ✅ | само `button === 1` |

Значи shift-клик и десен клик минуваат како обичен избор на ставка. **SYS-18**, петти
случај по `ln-popover`, `ln-external-links`, `ln-tabs`, `ln-fill`.

Плус, README:126 вели *„excluding buttons, anchors, **inputs**"* — кодот исклучува
`[data-ln-item-select]`, `[data-ln-item-action]`, `a` и `button`, но **не** `input`
воопшто. Текстуално поле внатре во ставка испраќа `item-click`. `isEditableTarget` во
`ln-core` го покрива токму тоа и не се користи.

---

### 🔵 P2 — Мерењето на висината на placeholder-от е кружно

`_measureItemHeight` windowed гранка (`:615-623`) кога кешот е празен гради
`_buildPlaceholderItem()`, кој на `:797` прави `el.style.height = this._itemHeight + 'px'`
— а потоа `:621` чита `this._itemHeight = _getOuterHeight(el)`. Мери го она што штотуку
го запишал. Безопасно кога `_itemHeight` веќе е точен (SSR seed патеката го поставува на
`:405`); ако е `0`, placeholder-от добива `height: 0px`, `_itemHeight` останува `0`, и
`_renderWindowed:810` излегува без да нацрта ништо.

---

### 🔵 P3 — SSR боењето при подигање се брише пред да се врати

Редоследот во конструкторот: `_enterWindowedMode` (`:185`) → `_parseChildren` (`:314`) →
`_render` (`:465`) → `_renderWindowed` → `_enableVirtualScroll` → `_measureItemHeight` →
**`this.tbody.textContent = ''`** (`:619`, `:622`) → кешот е сè уште празен, па
`replaceChildren` со празен фрагмент (`:873`) → дури потоа `_kickWindowInitial` (`:319`)
го внесува семето и микротаск подоцна се прецртува.

Мрежно нема разлика и нема треперење (микротаск пред боење), но „Instant SSR paint" што
демото го рекламира (`list.html:11`) фактички се фрла и се преправа од шаблонот. Ако
шаблонот и SSR markup-от се разидат, она што серверот го отпечатил не е она што останува.

---

### 🔵 P4 — `_readGridLayout` и `getBoundingClientRect` по кадар при скрол

`_renderVirtual`/`_renderWindowed` викаат `_readGridLayout` (`:602`, `getComputedStyle`)
плус два `getBoundingClientRect` во секое поминување, а поминувањето е врзано за
`requestAnimationFrame` (`:656-663`). rAF-от е точниот механизам; `getComputedStyle` по
кадар е read-after-write врз истиот `tbody` што штотуку го запишал.

---

### 🔵 P5 — `_showEmptyState` проверува за `TR`

`:913` — `if (el.tagName === 'LI' || el.tagName === 'TR')`. `ln-list` нема табеларен
режим; `TR` е остаток од `ln-table`.

---

### 🔵 P6 — Приватен `MutationObserver` во SSR гранката

`:336-343` — `_emptyObserver` чека првото дете на `tbody`. `component-guide.md:169-175`
санкционира точно **две** трајни приватни набљудувачи (`ln-progress` — атрибут на
родител; `ln-icon` — под нула увози) и ниту еден од двата не е овој случај.
`registerComponent` нуди `onSubtreeChange` што покрива точно ова. Уништувањето е коректно
(`:1232-1235`). Во мртва гранка (L1), па 🔵.

---

### 🔵 P7 — Двојно `fill`, и сувишен услов

`_buildItem:961-962` вика и `fillTemplate(el, item)` и `fill(el, item)` едно по друго, без
коментар зошто обете се потребни. И `_applyFilterAndSort:477` проверува
`this.isDataDriven` внатре во `if (this.isDataDriven)` блокот.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-list` | `:4`, `:66` | ✅ `:80` | ✅ `author` |
| `data-ln-list-source` | `:65`, `:67` | ✅ `:81` | ✅ `author` |
| `data-ln-list-body` | `:64` | ✅ `:87` | ✅ `author` |
| `data-ln-list-selectable` | `:165` | ✅ `:82` — без забелешка дека бара `data-ln-item` (L8) | ✅ `author` |
| `data-ln-list-window` | `:185`, `:1093` | ✅ `:83` | ✅ `author` |
| `data-ln-list-window-page` | `:1094` | ✅ `:84` | ✅ `author` |
| `data-ln-list-window-threshold` | `:1095` | ✅ `:85` | ✅ `author` |
| `data-ln-list-count` | `:1146` | ✅ `:86` | ✅ `author` |
| `data-ln-list-field` | `:417`, `:429` | ✅ `:93` | ✅ `author` |
| `data-ln-list-total/filtered/selected` | `:70`, `:71`, `:77` | ✅ `:94-96` | ✅ `author` |
| `data-ln-list-select-all` | `:1028` | ✅ `:92` | ✅ `author` |
| `data-ln-list-empty` | `:6`, `:903` | ⚠️ `:97` — недостижно во пракса (L1а) | ✅ `author` |
| `data-ln-empty` / `-when` | `:895`, `:898` | ✅ `:98-99` | ✅ `author` |
| `data-ln-item` | `:278`, `:982`, `:1003` | ⚠️ `:88` — опишан како шаблонски (L8) | ✅ `both` |
| `data-ln-item-id` | `:281`, `:967` | ✅ `:89` | ✅ `both` |
| `data-ln-item-select` | `:273`, `:970` | ✅ `:90` | ✅ `author` |
| `data-ln-item-action` | `:274`, `:293` | ✅ `:91` | ✅ `author` |
| `data-ln-field` | `:429`, `:953` | ❌ неспомнат во табелата (само во примерот `:56`) | ✅ `both` |
| произволни `data-*` | `:435-441` | ⚠️ полуреченица на `:115` (L9) | — невидливи за скенерот |
| `.ln-list--loading` | `:203`, `:234`… | ✅ `:109` | n/a — стилизирана `ln-list.scss:5` |
| `.ln-list__spacer` / `__placeholder` | `:749`, `:795` | ✅ `:141` / `:145` | n/a — стилизирани |
| `.ln-item-selected` | шест места | ❌ недокументирана, **без CSS** (L6) | n/a |
| `ln-list:item-click` / `:item-action` | `:284`, `:303` | ⚠️ `:126-127` — без ознака за режим (L7) | n/a |
| `ln-list:destroyed` | ❌ не постои | ❌ | n/a |
| Internals извор | `src/ln-list.js` | ✅ `:137` — **точен**, покажува на `src/` | n/a |

---

## Затечена состојба

### Карго-прашањето е затворено: `ln-list` никогаш не реискористува јазли

Пренесената ставка од `ln-core` R7 — *„реискористува ли `ln-list` јазли по клуч, па `null`
поле го задржува текстот од претходниот запис"* — има јасен одговор: **не.**

| патека | механизам |
|---|---|
| `_renderAll` data-driven (`:583`) | `replaceChildren(frag)` — фрагмент од свежи `_buildItem` клонови |
| `_renderAll` SSR (`:593`) | `innerHTML = html.join('')` — целосна замена од снимки |
| `_renderVirtual` data-driven (`:769`) | `replaceChildren(frag)` |
| `_renderVirtual` SSR (`:786`) | `innerHTML = html` |
| `_renderWindowed` (`:873`) | `replaceChildren(frag)` |
| `_showEmptyState` (`:914`, `:918`, `:921`) | `replaceChildren` |

`_buildItem:931` секогаш почнува со `cloneTemplateScoped(...)` — чист клон. Значи
`fill(el, item)` на `:962` никогаш не среќава остаток од претходен запис, и двојната
семантика на `fill()` не може да се манифестира овде. **Ставката се затвора.**
(За `ln-table` останува отворена до #42 — таа има сопствена патека.)

### SYS-11 — два `__` компаунда, обата стилизирани

`ln-list__spacer` и `ln-list__placeholder`, обата со правило во `ln-list.scss:10` и `:20`.
Тоа се точно двата што трекерот ги брои за `ln-list`. `ln-list--loading` е модификатор,
не компаунд, и не се брои (види ограда кај SYS-11).

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:63`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ — `winAttr > 0`, `pageAttr > 0`, `threshAttr >= 0` (`:1116-1118`), правилно разликуван `0` |
| SYS-3 (Internals → компајлиран bundle) | ✅ **точен** — `:137` покажува на `src/` |
| SYS-8 (сиров `console.error`) | ✅ нула `console.*` |
| SYS-13 (зашиен кориснички текст) | ✅ нула стрингови за приказ; бројките одат преку `Intl.NumberFormat` (`:18`) |
| SYS-14 (состојба надвор од `data-ln-*`) | ⚠️ `el._lnRecord` (`:965`) е JS expando, не атрибут — не се брои |
| SYS-15 (схема декларира туѓ атрибут) | ✅ сите 22 постојат и се нејзини |
| SYS-22 (README без Internals) | ✅ има, со три вистински под-секции |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |

### Замрзнат идентитет на изворот

`isDataDriven` (`:65`) и `source` (`:67`) се снимаат еднаш. `onAttributeChange`
(`:1259-1288`) реагира само на четирите windowed атрибути; додавање на
`data-ln-list-source` во тек на работа не прави ништо. Тоа е согласно со замрзнувањата
именувани во пресудата за инверзија на атрибутната реактивност (`3628e7d`) — **не е наод**.

---

## Отворени прашања за тебе

1. **L1 — што со SSR режимот?** Три опции: (а) се брише заедно со README:9-25 и ~170
   линии, (б) се задржува и се поправаат трите дефекти, (в) се задржува но README-то
   престанува да го води прв и добива ознака „not exercised". Изборот менува дали
   поднаодите (а), (б), (в) воопшто се задачи.

2. **L6 — преименување на `data-ln-item*`?** Четири атрибута и една класа. Ако одат на
   `data-ln-list-item-*`, тоа е кршечка промена за единствениот демо консумент и за
   `ln-debug/src/generated-attributes.js`. Ако остануваат, пресудата за отсуство на
   алијаси добива запишан исклучок.

3. **L6 подточка — `.ln-item-selected` без CSS.** Ист облик како `ln-sortable` SB2. Ако и
   двете се решат исто, ова е едно правило на две места; ако не, треба да се знае зошто.

4. **L9 — жетвата на `data-*` е договор или случајност?** Ако е договор, треба ред во
   табелата со атрибути и правило за приоритет спрема `data-ln-list-field`. Ако е
   случајност, демото зависи од неа (`data-dept`).

5. **L10 — што влегува во `detail.record`?** `html`, `searchText` и `fields` се внатрешни.
   Дали payload-от треба да носи само вистинските полиња на записот?

6. **L3 — `destroy()` да ги повтори четирите линии од `_exitWindowedMode`, или
   `destroy()` да го вика `_exitWindowedMode`?** Второто повлекува и `_requestData()` на
   умирачка компонента, што е полошо. Прашањето е кој од двата е канонскиот teardown.

---

**Наоди:** 🔴 0 · 🟠 6 · 🟡 5 · 🔵 7
