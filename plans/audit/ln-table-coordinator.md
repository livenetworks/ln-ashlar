# Аудит — ln-table-coordinator

**Датум:** 2026-09-11 · **Итерација:** 44/50 · **Слој 6 — координатори и навигација**
**Опсег:** `src/ln-table-coordinator.js` (179), `README.md` (59), `ln-table-coordinator.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Компонента што направила вистинска архитектонска миграција — престанала да ја преведува
состојбата на упитот и се свела на две работи: индикаторот во заглавјето и копчето за
чистење — но миграцијата е запишана само во еден изворен коментар, додека три README-а
сè уште опишуваат преведувачки слој што не постои и што ниту еден испраќач во целата
библиотека не го напојува.

---

## Што е добро

**Ова е вистински per-instance координатор, не document-слушач.** `_bindEvents(self)`
(`:67`) ги качува двата слушачи на `self.dom` (`:160-161`), не на `document`. Тоа е точно
она што пресудата за parent-scope доктрината бара — *компонентата работи само на свој DOM;
координатор = само child компоненти, нула document листенери*. Од сите четири координатори
во библиотеката, овој е единствениот што ја носи ознаката „real component" во својот README
(`:43`) и ја заслужува.

**Изолацијата меѓу повеќе координатори е решена со конструкција, не со регистар.**
README:57-59 го именува механизмот точно: `addEventListener` на конкретен јазол фаќа само
настани чија патека поминува низ него. Нема споделена состојба, нема id мапа, нема
можност за протекување. Најевтиното можно решение за проблем што други компоненти го
решаваат со регистри.

**Отфрлањето на fallback-от е образложено во изворот, со причината.**

```js
// Point-to-point only: the event either landed on the table itself, or it
// names the source that table is bound to. No "first table in the host"
// fallback — ln-filter fires ln-filter:change on its own <ul>
// root AND on the target, so a fallback makes the coordinator act twice
// for one user change and emit two identical fetches.        // :70-74
```

`_resolveTable` (`:75-82`) нема `querySelector('[data-ln-table]')` гранка — само директен
погодок или разрешување по `targetId`. Тоа е дисциплина што `ln-list` и `ln-table` ја
немаат.

**Исклучокот за `/` е декларативно означен како исклучок.** `:9-15` — единствениот
document слушач во фајлот носи четириреден коментар што кажува дека е свесен, одобрен, и
**зошто** не може да е per-instance (би пукал еднаш по координатор). Тоа е точно обликот
во кој отстапувањата треба да се запишуваат.

**Чистењето разликува data-driven од SSR табела и објаснува зошто.**

```js
// A data-driven table is refreshed by its source: the control resets
// above already emit the query change. Only an SSR table, which holds
// its own rows, still needs to be told directly.
if (!table.hasAttribute('data-ln-table-source')) {
	dispatch(table, 'ln-table:request-clear-filters', { table: name });     // :151-156
}
```

Еден `if`, три реда образложение, нула дупли барања.

---

## Наоди

### 🟠 TC1 — Двете помошни функции бараат низ цел документ, спротивно на централното ветување на README-то

**Каде:** `_findSearchInput:47` · `_findFilterElements:58`, `:62`

```js
function _findSearchInput(dom, sourceId) {
	const sel = sourceId ? '[data-ln-search-for="' + sourceId + '"]' : '[data-ln-search-for]';
	const host = dom.querySelector(sel) || document.querySelector(sel);          // :47
	…
}

function _findFilterElements(dom, sourceId) {
	if (sourceId) {
		const scoped = dom.querySelectorAll('[data-ln-filter="' + sourceId + '"]');
		if (scoped.length > 0) return scoped;
		const global = document.querySelectorAll('[data-ln-filter="' + sourceId + '"]');   // :58
		if (global.length > 0) return global;
	}
	const fallbackScoped = dom.querySelectorAll('[data-ln-filter]');
	return fallbackScoped.length > 0 ? fallbackScoped : document.querySelectorAll('[data-ln-filter]');   // :62
}
```

**Извор на правилото:** сопственото README, `:12` — *„Its handlers are bound to its own
host element (`self.dom`), not `document`. The table, its `[data-ln-filter]` popovers, and
its clear button(s) **must all be descendants of the same coordinator host** — outside its
own subtree, **the coordinator does not exist and does not look**."* Плус `:15` —
*„**There is no page-wide fallback**."*

Три `document.querySelector*` повици, во две функции. Значи при чистење, координаторот
**гледа** надвор од својот host: ако во неговото поддрво нема совпаѓање, го зема првото на
страницата.

Нијансата вреди да се именува точно: README:15 вели дека координаторот *„does not resolve
**a table** by scanning the whole document"* — и **тоа е вистина**, `_resolveTable:80-81`
користи само `dom.querySelector`. Но README:12 е поширок и се однесува на сè, вклучувајќи
ги филтер-поповерите што изречно ги наведува. За нив ветувањето не важи.

**Последица во страница со два координатори:** координаторот А, чиј host нема филтри,
ќе ги ресетира филтрите на координаторот Б — токму изолацијата што README:57-59 ја
прогласува за невозможна.

**Достижност:** `demo/admin/src/pages/store-usecase.html` има **два** координатор-host-а
(`:83` и `:399`). Првиот ги има своите филтри во поддрвото, па фаќа на `:56` и никогаш не
паѓа на `:58`. Достижно по конструкција, немаскирано во репото.

---

### 🟠 TC2 — README именува три комуникациски настани; еден постои, еден нема испраќач, еден не постои

**Каде:** `README.md:13`

> **3. Event-Driven Communication.** Communication with `ln-table` occurs strictly via
> CustomEvents (`ln-table:set-search`, `ln-table:set-filter`, `ln-table:request-clear-filters`).

| настан | состојба |
|---|---|
| `ln-table:request-clear-filters` | ✅ се испраќа на `:155` |
| `ln-table:set-search` | ⚠️ `ln-table` го **слуша** (`ln-table.js:117`), **никој не го испраќа** — grep низ `components/*/src/`, `demo/admin/src/`, `spa-starter/`: само `addEventListener` и `removeEventListener` |
| `ln-table:set-filter` | ❌ **не постои никаде** — нула појави во целиот репозиториум |

Истото README си противречи на `:36-37`, каде „Dispatched Events" наведува **само**
`ln-table:request-clear-filters` — што е точно.

**Изворот кажува дека тоа е намерно, и само тој го кажува:**

```js
// Query state is not forwarded here. The source owns search/filter/sort
// (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
// every view bound to it — a second forwarder would fetch twice for one
// user change. What is left is the header indicator, which is Layer 2
// policy: ln-table never sets this class itself.                    // :85-89
```

Значи преведувачкиот слој е свесно отстранет. Но **трите документи не го знаат тоа**:

| документ | тврди |
|---|---|
| `ln-table-coordinator/README.md:13` | комуникацијата оди преку `set-search` / `set-filter` |
| `ln-table/README.md:20` | `ln-table:set-search` е меѓу командните настани што ги прима |
| `ln-table/README.md:97` | *„data-driven mode **relies on `ln-table-coordinator` to translate it into `ln-table:set-search`**"* |

Последното е најдиректно: именува работа што оваа компонента изречно одбила да ја прави.

**Последица во кодот:** регистрацијата на слушачот во `ln-table:117` и во `ln-list:131`
(истиот образец, `ln-list:set-search`) нема ниту еден испраќач. Самите функции
(`_onSetSearch`) остануваат живи преку `ln-search:change`, но документираната командна
патека е мртва во обете компоненти.

**Достижност:** доказот е самата отсутност — потврдена со grep.

---

### 🟠 TC3 — Филтрите се бараат по `sourceId`, а `data-ln-filter` таргетира id на табелата

**Каде:** `:127` наспроти `:140`, `:56`

```js
const sourceId = table.getAttribute('data-ln-table-source') || table.id;    // :127
…
const filterEls = _findFilterElements(dom, sourceId);                        // :140
	// → dom.querySelectorAll('[data-ln-filter="' + sourceId + '"]')          // :56
```

`data-ln-filter` го носи **id-то на целта** — `ln-filter.js` го разрешува преку
`document.getElementById(self.targetId)` (`ln-filter.js:218`), и `ln-table`-овото README
го учи така: `<ul data-ln-filter="my-table">` (`ln-table/README.md:175`). Тоа е id на
табелата.

`sourceId` пак е **името на store-от** (`data-ln-table-source`), кое нема причина да се
совпаѓа со id-то на табелата.

**Зошто никогаш не пукало:**

```
demo/admin/src/pages/coordinator.html:115   data-ln-table="demo-docs"      data-ln-table-source="demo-docs"
demo/admin/src/pages/include.html:32        data-ln-table="documents"      data-ln-table-source="documents"
demo/admin/src/pages/store-usecase.html:87  data-ln-table="documents"      data-ln-table-source="documents"
demo/admin/src/pages/store-usecase.html:434 data-ln-table="people"         data-ln-table-source="people"
demo/admin/src/pages/table-sync.html:64     data-ln-table="hybrid-docs"    data-ln-table-source="hybrid-docs"
demo/admin/src/pages/write-workflow.html:37 data-ln-table="wwf-documents"  data-ln-table-source="wwf-documents"
```

**Сите шест ги прават идентични.** Истото важи и за блупринтот во `ln-table/README.md:61`.
Значи разликата е маскирана насекаде.

А и кога не би биле идентични, нема да пукне гласно: `_findFilterElements` има четири
нивоа (`:55-62`) и последните две ја игнорираат идентичноста целосно — ги враќа **сите**
`[data-ln-filter]` во host-от, а ако ги нема — сите на страницата (TC1). Значи погрешниот
клуч тивко деградира во „ресетирај сè што најдеш".

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code (четирите нивоа постојат
за да го маскираат несовпаѓањето) и пресудата за point-to-point врзување —
*ID-врзувањето е point-to-point*.

---

### 🟡 TC4 — „Активниот координатор" не постои, и README-то го именува погрешниот атрибут

**Каде:** `:23-24` наспроти `README.md:25` и `:55`

```js
const searchHost = document.querySelector('[' + DOM_SELECTOR + '] [data-ln-search-for]')
	|| document.querySelector('[data-ln-search-for]');
```

`document.querySelector` го враќа **првиот во редослед на документот**, не активниот.
Нема поим за „активен координатор" во кодот — нема фокус проверка, нема `:hover`, нема
видливост, ништо.

README:25 — *„Focuses the search input inside **the active coordinator wrapper** on the
page"*; README:55 го повторува — *„It focuses the search input inside **the active**
`[data-ln-table-coordinator]` wrapper"*.

**И двете README линии не се согласни меѓусебно за резервниот случај:**

| линија | резервна вредност |
|---|---|
| `:25` | *„or the first `[data-ln-search-for]` if none"* — **точно** |
| `:55` | *„or the first `[data-ln-search]` on the page if none"* — **погрешен атрибут** |

`data-ln-search` е state host-от (`<ul>`, `<table>`), `data-ln-search-for` е контролата
(`<input>`). Кодот го користи вториот. Истиот документ дава два различни одговори.

---

### 🟡 TC5 — `destroy()` ги остава индикаторските класи; нема `:destroyed`

`destroy()` (`:166-176`) ги трга обата слушачи и го нулира `_handlers` — чисто. Она што
останува е `.ln-filter-active` на секое копче што координаторот го запалил (`:102`).
Значи по уништување, заглавието трајно покажува активен филтер, а компонентата што го
поставила ја нема.

**SYS-9.** Тоа е единствената класа што оваа компонента воопшто ја пишува, што го прави
пропуштањето поочигледно отколку кај компоненти со десетина остатоци.

Нема `ln-table-coordinator:destroyed` — **SYS-23**.

---

### 🟡 TC6 — Схемата декларира шест туѓи атрибута, вклучувајќи еден со право на пишување

Единаесет записи, сите **навистина читани** од овој фајл — тоа е точно. Проблемот е што
шест од нив се договор на друга компонента:

| атрибут | сопственик | `direction` овде |
|---|---|---|
| `data-ln-table` | `ln-table` | `author` |
| `data-ln-table-source` | `ln-table` | `author` |
| `data-ln-search` | `ln-search` | **`both`** |
| `data-ln-search-for` | `ln-search` | `author` |
| `data-ln-filter` | `ln-filter` | `author` |
| `data-ln-filter-reset` | `ln-filter` | `author` |

`data-ln-search` со `direction: "both"` е најостриот: генераторот го запишал така зашто
координаторот **го пишува** (`:131`, `sourceEl.setAttribute('data-ln-search', '')`). Значи
схемата тврди дека две различни компоненти имаат право на пишување врз истиот атрибут —
`ln-search`-овата схема исто го носи како `both`.

Тоа не е дефект во оваа компонента: схемата нема поим за „читам" наспроти „поседувам", и
самиот формат не е документиран во ниту еден доктринарен документ (забележано при
подготовката на кампањата). Заведено овде затоа што ова е првиот случај каде **крос-
компонентно пишување** поминува низ CI портата без ниту еден сигнал.

---

### 🔵 P1 — Индикаторот се пресметува двапати по секоја промена, и коментарот го образложува спротивното

`ln-filter` испраќа `ln-filter:change` **двапати** — на сопствениот `<ul>` корен и на
целта (`ln-filter.js:226`, `:232`). Обата поминуваат низ host-от на координаторот, па
`_handlers.filter` (`:90`) се извршува двапати:

| поминување | `e.target` | патека во `_resolveTable` |
|---|---|---|
| 1 | `<ul data-ln-filter>` | `:78` `detail.targetId` → `:80` `querySelector` |
| 2 | целта (табелата) | `:77` директен погодок |

Обете завршуваат со истиот `btn.classList.toggle('ln-filter-active', values.length > 0)`
— идемпотентно, без видлива последица.

Коментарот на `:70-74` вели дека point-to-point дизајнот постои затоа што fallback би
направил *„the coordinator act twice for one user change and emit two identical fetches"*.
Двојното извршување сепак се случува; она што point-to-point го спречува е **разрешување
на погрешна табела**. А „two identical fetches" повеќе не е можно воопшто — оваа
компонента не испраќа барања за податоци од TC2 наваму. Образложението е од претходна
верзија.

---

### 🔵 P2 — Чистењето тивко излегува ако `ln-table` сè уште не е иницијализирана

`:115` — `if (!table || !table.lnTable) return;`

`table.lnTable` постои само откако `findElements` ја создала инстанцата. Редоследот на
регистрација во `components/index.js` го одредува тоа. Ако копчето за чистење се кликне
пред иницијализацијата — или ако табелата е внесена подоцна и координаторот се кликне
меѓувремено — нема ништо: ни грешка, ни dev-афорданс. А `lnTable` се користи само за
`name` (`:117`), кој веднаш има резерва `table.id`.

---

### 🔵 P3 — Резервното разрешување на табелата зема прва во host-от

`:114` — `clearBtn.closest('[data-ln-table]') || dom.querySelector('[data-ln-table]')`.

Документирано (README:51), но е точно обликот што `_resolveTable:70-74` изречно го
одбива за филтрите. Две различни политики за иста работа во истиот фајл: филтрите се
point-to-point, чистењето има „прва во host-от". Со два табели во еден координатор,
копче за чистење надвор од која било од нив чисти погрешна.

---

### 🔵 P4 — Два синтетички настана за да се возат сестрински компоненти

`:136` — `input.dispatchEvent(new Event('input', { bubbles: true }))`
`:147` — `resetInput.dispatchEvent(new Event('change', { bubbles: true }))`

Обата се симулација на кориснички влез за да се активира туѓ слушач. Работат, и
README:24 го именува ефектот. Заведено затоа што е истиот образец што се појави кај
`ln-autosave` → `ln-autoresize`, и затоа што првиот има подиректна алтернатива: гранката
погоре (`:131`) веќе го прави точно тоа преку атрибут (`setAttribute('data-ln-search', '')`),
без синтетички настан.

---

### 🔵 P5 — `/` слушачот се качува дури и кога на страницата нема ниту еден координатор

`document.addEventListener` на `:17` е на модулно ниво — се извршува при вчитување на
бандлот, независно од тоа дали постои `[data-ln-table-coordinator]`. А резервата на `:24`
(`document.querySelector('[data-ln-search-for]')`) фаќа **која било** пребарувалка на
страницата.

Значи страница што користи `ln-search` без координатор сепак го добива `/` однесувањето
од компонента што ја нема. Документирано на README:25, и самиот исклучок е свесен и
одобрен (`:10-15`) — па не е наод, туку последица што вреди да се знае.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-table-coordinator` | `:4` | ✅ `:12` | ✅ `author` |
| `data-ln-table-clear` / `-clear-all` | `:111` | ✅ `:24` | ✅ `author` |
| `data-ln-table-filter-col` | `:100` | ✅ `:47` | ✅ `author` |
| `data-ln-table-col-filter` | `:101`, `:121` | ✅ `:47` | ✅ `author` |
| `data-ln-table` / `-source` | `:77`, `:127`, `:154` | ✅ `:23`, `:51` | ⚠️ туѓи (TC6) |
| `data-ln-search` | `:129`, **`:131` пишува** | ⚠️ `:24`, `:55` погрешно именуван (TC4) | ⚠️ туѓ, `both` (TC6) |
| `data-ln-search-for` | `:23`, `:46` | ✅ `:25` | ⚠️ туѓ (TC6) |
| `data-ln-filter` / `-filter-reset` | `:56`, `:142` | ✅ `:23`, `:51` | ⚠️ туѓи (TC6) |
| `.ln-filter-active` | `:102`, `:122` | ✅ `:23`, `:47` | n/a — преживува `destroy()` (TC5) |
| `ln-filter:change` слушан | `:160` | ✅ `:32` | n/a |
| `click` слушан | `:161` | ✅ `:33` | n/a |
| `keydown` `/` слушан | `:17` | ✅ `:34`, `:53-55` | n/a |
| `ln-table:request-clear-filters` | `:155` | ✅ `:37` | n/a |
| `ln-table:set-search` | ❌ не се испраќа (никаде во библиотеката) | ✅ `:13` (TC2) | n/a |
| `ln-table:set-filter` | ❌ не постои | ✅ `:13` (TC2) | n/a |
| `ln-table-coordinator:destroyed` | ❌ | ❌ | n/a |
| host-scoped ветување | ⚠️ 3× `document.querySelector*` (TC1) | ✅ `:12`, `:15` | n/a |
| Internals извор | `src/…` | ✅ `:43` — **точен**, покажува на `src/` | n/a |

---

## Затечена состојба

### Пренесената ставка `filterOptions` — затворена, и е поширока отколку што изгледаше

Барана беше проверка дали координаторот го консумира `filterOptions` од
`ln-table:set-data` (документиран со цела под-секција во `ln-table/README.md:276-278`).

```
grep -rn "filterOptions" --include=*.js components/
→ (празно)
```

Ниту `ln-table`, ниту координаторот, ниту која било друга компонента. И тоа не е
случајност — README:151-153 на оваа компонента изречно вели дека `ln-table` *„Does not
generate filter dropdown markup"* и *„Does not track which options exist in the dataset"*,
што е согласно со пресудата дека опциите доаѓаат од доменот, никогаш изведени од
податоците. Значи `filterOptions` е остаток од укината идеја, документиран во
**погрешната** компонента. **Ставката се затвора.**

### Пренесената ставка за `defaultPrevented` — половина одговор

Прашањето беше кој го чита `defaultPrevented` по `ln-search:change` / `ln-filter:change` /
`ln-sort:change`. Одговорот од оваа страна: **координаторот не го чита воопшто.** Неговиот
`ln-filter:change` слушач (`:90`) не проверува ништо и не откажува ништо — тој е чист
набљудувач за индикаторот.

Единствениот што го чита е самиот `ln-filter` (`ln-filter.js:233-235`), кој го собира од
целта. Што прави со него — останува за #46 `ln-data-coordinator`, каде се среќаваат сите
три откажувачи (`ln-table`, `ln-list`, `ln-data-store`).

### Компонентата е добро извртена

Пет координатор-host-а во `demo/admin/src/pages/` (`coordinator.html:110`,
`include.html:24`, `store-usecase.html:83` и `:399`, `table-sync.html:45`), сите со
вистински табели, филтри и копчиња за чистење. По `ln-chart` (нула консументи) и SSR
режимите на `ln-list`/`ln-table` (нула), ова е освежување — секоја патека овде има
барем еден жив консумент, освен `_findSearchInput`/`_findFilterElements` document
гранките (TC1).

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:40`) |
| SYS-2, SYS-8, SYS-13, SYS-14 | ✅ нема бројки, нема `console.*`, нема текст, нема сопствена состојба |
| SYS-3 (Internals → компајлиран bundle) | ✅ **точен** — `:43` покажува на `src/` |
| SYS-7 (`.hidden` / `.sr-only`) | ✅ не пишува класи за криење |
| SYS-11 (BEM `__`) | ✅ нула |
| SYS-18 (препишан `shouldIgnoreClick`) | ✅ — `click` слушачот не филтрира модификатори, но ниту треба: целта е копче |
| SYS-22 (README без Internals) | ✅ има, со четири под-секции |
| SYS-24 (state класа без CSS) | ✅ — `.ln-filter-active` е стилизирана (`mindset.md:71` го дава како пример) |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| сопствен `MutationObserver` | ✅ нула |

---

## Отворени прашања за тебе

1. **TC2 — трите README-а се поправаат, или преведувачкиот слој се враќа?** Ако останува
   како е (изворниот коментар `:85-89` образложува зошто треба), тогаш:
   `ln-table-coordinator/README.md:13`, `ln-table/README.md:20` и `ln-table/README.md:97`
   се менуваат, а `ln-table:set-search` / `ln-list:set-search` слушачите (24 линии секој)
   стануваат прашање: остануваат како јавен командн влез без испраќач, или се бришат?

2. **TC1 — `document` гранките се тргаат?** Ако host-scoping е ветувањето, трите повици
   на `:47`, `:58` и `:62` го кршат. Ако не е апсолутно, README:12 треба да каже што точно
   излегува надвор од host-от.

3. **TC3 — `data-ln-filter` таргетира табела, `sourceId` е store.** Кој од двата треба да
   се користи на `:140`? И ако се поправи, дали четирите нивоа на `_findFilterElements`
   се сведуваат на едно?

4. **TC6 — схемата и крос-компонентното пишување.** `data-ln-search` е `both` во две схеми.
   Треба ли форматот да разликува „читам туѓ атрибут" од „поседувам", за CI портата да
   може да ја види разликата?

5. **P3 — две политики за разрешување во еден фајл.** Филтрите се point-to-point,
   чистењето има „прва во host-от". Свесно, или остаток?

---

**Наоди:** 🔴 0 · 🟠 3 · 🟡 3 · 🔵 5
