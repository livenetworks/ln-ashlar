# Аудит — ln-debug

**Датум:** 2026-09-11 · **Итерација:** 50/50 · **Слој 7 — алат** · **последна**
**Опсег:** `src/ln-debug.js` (54), `src/gate.js` (102), `src/console-sink.js` (19), `src/debug-verifier.js` (331), `src/generated-attributes.js` (275), `README.md` (132), `ln-debug.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Алатот што ја проверува исправноста на сите други компоненти е и најдобро образложениот
код во кампањата — со коментари што објаснуваат зошто одбранбен guard **не** е ставен,
цитирајќи го правилото на проектот — но три од неговите проверки се потпираат на нешта
што не постојат: повлечен атрибут, API метод што никаде не е дефиниран, и сопственост врз
филтер што живее во `ln-core`.

---

## Што е добро

**`gate.js` е најдобро образложениот фајл во целата кампања.** Сто и два реда, од кои
околу четириесет се коментар — и ниту еден не кажува *што* прави кодот. Секој кажува
**зошто**:

```js
// No `document.body &&` guard: this function is only ever reached from
// inside the guardBody callback below … document.body is guaranteed to
// exist on every call path this file has. Guarding for a call path that
// doesn't exist is exactly the defensive coding this project forbids.   // :34-40
```

Тоа е единственото место во 50 компоненти каде **отсуството** на guard е документирано со
причина, и тоа со цитирање на сопственото правило на проектот. Истото важи за `:26-32`
(зошто скенирањето не е document-wide) и `:91-97` (зошто `_debugGateBound` се поставува
синхроно пред `guardBody`).

**Host containment е испорачан, не само планиран.** `_isContained` (`:46-51`) + `_scopedSink`
(`:53-67`) — настан се логира само ако некој активен host го `.contains()` целта. Значи
слојот што ја набљудува библиотеката самиот се држи до правилото „компонентата работи само
на свој DOM". Заедно со тоа, `:53-63` ја носи и единствената исклучена гранка (`window` /
`document` цели) со образложение зошто не може да биде поинаку.

**Манифестот е точен во обете насоки — проверено.** Споредба на `generated-attributes.js`
(272 записи) со сите 50 компонентни схеми (264 записи):

| насока | резултат |
|---|---|
| во схемите, недостига во манифестот | 2 — и обете се **схема-грешки**, не пропусти на манифестот |
| во манифестот, не во схема | 10 — и сите десет **постојат** во `theme/` за CSS-only компоненти |

Двете „недостасувачки" се `data-ln-rest-connector` (`sources: []` ghost од
`ln-data-coordinator` DC2) и `data-ln-tabs-for` (схема-ghost од `ln-tabs`, нула појави
било каде). Генераторот правилно ги прескокнал. Десетте „вишок" се `data-ln-stepper`,
`data-ln-stat-card`, `data-ln-empty-state`, `data-ln-filter-options`/`-search` и роднини —
сите живи во `theme/components/*.scss` и `theme/config/mixins/_filter.scss`. Значи
манифестот е **надмножество по дизајн**: покрива и чисто-CSS речник што нема JS компонента.

Тоа е добар исход за последната итерација — единствениот алат што ги валидира другите е
самиот точен.

**`console-sink.js` е 19 линии и нема ниту една одлука.** Коментарот на `:1-5` вели дека
целата одлука припаѓа на gate-от — *„no `data-ln-debug` check of its own (the gate owns
that decision exactly once)"*. Чисто раздвојување одлука/дејство, исто како
`router-model.js` во слој 6.

**Единствената компонента што ја користи повратната вредност на `registerComponent`.**

```js
// registerComponent assigns window[DOM_ATTRIBUTE] = constructor, so the
// static API has to hang off that constructor. Assigning a separate
// object to window.lnDebug beforehand is silently overwritten.          // :42-44
const _ctor = registerComponent(…);
_ctor.verify = …;
```

Проверено — `helpers.js:924` навистина прави `return constructor`. И коментарот го
објаснува капанот што `ln-link` (K3) го решил поинаку и полошо.

**README §6 ја документира разликата меѓу двата gate-а изречно** (`:125-128`), заклучувајќи
со *„The two checks are independent and are not required to agree."*

---

## Наоди

### 🟠 D1 — README-то припишува сопственост врз филтер што живее во `ln-core`

**Каде:** `README.md:11-12`

> *„The `ln-debug` component solves this by providing:
> 1. **Console Warning Filter**: Gates library warnings (`[ln-` / `[lnCore`) so they only
> print when debug mode is enabled."*

Затечено — филтерот е **првото нешто во `ln-core/helpers.js`**, линии 1-19:

```js
// ─── Global Console Warning Interceptor (Production Mode) ──
if (typeof window !== 'undefined') {
	const originalWarn = console.warn;
	console.warn = function (...args) {
		const isLibraryWarning = typeof args[0] === 'string' &&
			(args[0].startsWith('[ln-') || args[0].startsWith('[lnCore'));
		if (isLibraryWarning) {
			const isDebug =
				document.documentElement.hasAttribute('data-ln-debug') ||
				(document.body && document.body.hasAttribute('data-ln-debug'));
			if (!isDebug) return;
		}
		originalWarn.apply(console, args);
	};
}
```

Grep низ целиот авторски извор за пре-доделување на `console.warn` враќа **точно еден
погодок** — тој. Нула во `components/ln-debug/src/`.

Последицата: филтерот работи на секоја страница што вчитува кој било ln-ashlar бандл,
**без `ln-debug` воопшто да е вчитан**. Компонентата што README-то ја прогласува за
носител не учествува во него.

**SYS-28, трет потврден случај** — по `overview.md:103` (тврди дека `ln-search` пригушува)
и `data-flow.md:669-671` (тврди дека `ln-modal` го отвора модалот). Разликата овде е што
README-то на самата компонента го прави тоа, а истиот документ подоцна (`:125-128`)
правилно го третира филтерот како **независна** проверка. §1 и §6 не се согласни за тоа
чиј е.

**Плус две работи што произлегуваат:**

1. Тој филтер е **глобален патч при вчитување што никогаш не се враќа** — истото
   семејство како `ln-nav` N1 (SYS-31) и `ln-link` K1, само во `ln-core`.
2. Тој чита `<html>` **или** `<body>` (`:10-11`), додека `gate.js:18-22` изречно вели
   *„`<html>` is outside that subtree and is not a supported host for this layer"*, а
   `:32` предупредува дека document-wide скен би го *„silently reviving `<html>` support D3
   removed"*. Значи `<html data-ln-debug>` е валиден за едниот gate и невалиден за другиот
   — што README:125-128 чесно го документира, но §1 го замаглува тврдејќи дека обете се
   „the `ln-debug` component".

---

### 🟠 D2 — Повлечен атрибут е жив во верификаторот, и преку него влегува во схемата

**Каде:** `src/debug-verifier.js:160`

```js
const storeEl = doc.querySelector(`[data-ln-data-store="${escaped}"], [data-ln-store="${escaped}"]`);
```

`data-ln-store` е **избришан** — пресудата за отсуство на алијаси го укина целото
`data-ln-store-*` семејство (07-22), заедно со преименувањето `ln-store:*` →
`ln-data-store:*` (07-23).

Grep потврдува: ниту една компонента не го чита, ниту едно демо не го пишува. Единствената
жива појава е оваа.

И таа појава има последица понатаму: `sync-ln-schemas` го скенира изворот, го наоѓа
литералот, и го запишува во `ln-debug.schema.json`:

```json
"data-ln-store": { "direction": "author", "sources": ["src/debug-verifier.js"] }
```

Значи **алатот чија работа е да фаќа непостоечки и погрешно напишани атрибути сам оживува
повлечен атрибут во схемата** — која е CI портата и изворот за доковите. Тоа е истиот
механизам како `ln-table` T7 (`data-ln-table-sort` влегува преку dev SCSS што предупредува
да не се користи), само еден слој поиронично.

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code, плус пресудата за отсуство
на алијаси.

---

### 🟠 D3 — Гранката за програмски регистрирани store-ови проверува API што не постои

**Каде:** `src/debug-verifier.js:161-163`

```js
const isGlobalRegistered = typeof window !== 'undefined' &&
	window.lnDataStore && typeof window.lnDataStore.getStore === 'function' &&
	window.lnDataStore.getStore(storeName);

if (!storeEl && !isGlobalRegistered) {
	issues.push({ type: 'store-unresolved', … });
}
```

Grep за `getStore` низ `components/*/src/` и `components/ln-core/*.js`:

```
components/ln-debug/src/debug-verifier.js:162
components/ln-debug/src/debug-verifier.js:163
```

**Две појави, обете овде.** Нема дефиниција никаде. `window.lnDataStore` е она што
`registerComponent` го доделува — конструкторска функција (`helpers.js:908`) — а
конструкторска функција нема `getStore` метод.

Значи `typeof window.lnDataStore.getStore === 'function'` е **трајно `false`**, и
`isGlobalRegistered` е секогаш falsy. Гранката постои за да го потисне лажното
`store-unresolved` предупредување кога store е регистриран програмски — способност што
библиотеката ја нема.

Ист облик како `ln-data-coordinator` DC2 (`data-ln-websocket-connector` се бара, компонента
не постои): проверка напишана за иднина што не пристигнала, на топла патека.

**Достижност на последицата:** нула — `ln-data-store` е DOM-воден, секој store има елемент,
па `storeEl` секогаш фаќа. Наодот е против мртвата гранка, не против паднат случај.

---

### 🟡 D4 — `destroy()` без заштита од двојно повикување; нема `:destroyed`

```js
_component.prototype.destroy = function () {
	delete this.dom[DOM_ATTRIBUTE];
	refreshDebugHosts();
};                                                        // src/ln-debug.js:24-27
```

Втор случај во кампањата без `if (!this.dom[DOM_ATTRIBUTE]) return;`, по `ln-router` R4.
Практично безопасно — вториот `delete` е no-op, вториот `refreshDebugHosts()` само
пресметува ист резултат. Заведено против отсуството на образецот што другите 48 го носат.

Нема `ln-debug:destroyed` — **SYS-23**. Овде е најмалку важно: компонентата не испраќа
ниту еден настан (таа само ги **набљудува** туѓите).

---

### 🟡 D5 — Нема `## 🔧 Internals`, за компонента од пет фајла

README има шест нумерирани секции и завршува на `:132`. **SYS-22**, деветти од девет.

Тоа е најостро токму овде: компонентата има **пет** изворни фајла со три различни улоги
(gate, sink, verifier, манифест, обвивка), и односот меѓу нив е нетривијален — кој ја
носи одлуката, зошто манифестот е генериран, зошто `_ctor` се користи наместо посебен
објект. Сето тоа **е** објаснето — во коментарите на изворот, не во README-то.

Иронијата: `gate.js` (`:1-22`, `:26-40`, `:91-97`) содржи готов текст за Internals секција.

---

### 🟡 D6 — Схемата носи туѓи атрибути (оправдано), но без ознака

`data-ln-data-store` и `data-ln-store` се заведени како `author` со извор
`src/debug-verifier.js`. Првиот е вистински, но припаѓа на `ln-data-store`; вториот е
повлечен (D2).

Овој случај е **најоправданиот** SYS-15 во кампањата: верификаторот по природа мора да
чита туѓи атрибути — тоа е неговата работа. Но схемата нема начин да ја изрази разликата
помеѓу „поседувам" и „проверувам", истото ограничување што се појави кај
`ln-table-coordinator` TC6 (шест туѓи), `ln-search` S8, `ln-chart` CH6 и
`ln-ui-coordinator` UC7.

Ако `ln-debug` некогаш добие полн попис на туѓи атрибути што ги проверува, неговата схема
ќе стане огледало на сите 264.

---

### 🔵 P1 — Манифестот е надмножество на компонентните схеми, недокументирано

272 записи наспроти 264 во схемите. Десетте вишок се theme-only (`_stepper.scss`,
`_stat-card.scss`, `_empty-state.scss`, `_filter.scss`), значи покриеноста е поширока од
JS компонентите — што е **точно**, зашто чисто-CSS компонента исто може да добие
погрешно напишан атрибут.

Ниту README-то ниту заглавјето на `generated-attributes.js` го кажуваат тоа. README:17
вели *„against the schema-generated attribute manifest"*, што сугерира еден-кон-еден
пресликување со схемите.

---

### 🔵 P2 — `data-ln-tabs-for` би бил пријавен како печатна грешка

Атрибутот постои во `ln-tabs.schema.json` (влегол преку ко-лоциран SCSS, заведен како
SYS-15 на итерација 19), нема ниту една појава во кодот или markup-от, и **не е** во
манифестот.

Значи авторот што ќе го напише — верувајќи ѝ на схемата или на документите што од неа се
генерираат — ќе добие *„Unknown attribute `data-ln-tabs-for`. Did you mean …?"*.
Правилното однесување од страна на `ln-debug`; проблемот е во схемата на `ln-tabs`. Тука
само како затворање на кругот: схема-ghost од итерација 19 се појавува како лажно
предупредување во итерација 50.

---

### 🔵 P3 — `levenshtein` без должински прекин

`debug-verifier.js:10-33` — полна матрица `O(a×b)` за секој непознат атрибут наспроти
секој од 272-та валидни. Нема раниот излез *„ако разликата во должина > праг, прескокни"*,
кој е стандардниот трик и би ги отсекол повеќето споредби веднаш.

Се извршува само во debug режим и само за атрибути што веќе не се препознаени — значи
цената е реална само на страница со многу типографски грешки. Заведено како можност, не
како проблем.

---

### 🔵 P4 — Sink-от не поминува низ филтерот на `ln-core`

`console-sink.js` користи `console.groupCollapsed`, `console.log`, `console.groupEnd` —
ниту еден не е `console.warn`, па филтерот од D1 не ги допира. Тоа е **намерно** и
документирано на `README:130-132`: *„Nothing is logged via `console.warn` or
`console.debug` — `console.warn` is reserved for markup-error diagnostics … and Chrome
hides `console.debug` below its Verbose log level by default."*

Заведено само за да се затвори кругот околу **SYS-8**: филтерот покрива точно `console.warn`
со `[ln-`/`[lnCore` префикс. Сите `console.error` во библиотеката (`ln-core` ×4,
`ln-include:70`, `ln-icon:126`, `ln-editor`, `ln-upload`, `ln-api-queue`,
`ln-data-coordinator` ×2, `ln-router` ×2) го заобиколуваат — а сега е потврдено и **каде**
живее тој филтер: `ln-core/helpers.js:4-18`, не во `ln-debug`.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-debug` | `ln-debug.js:6`, `gate.js:42` | ✅ `:25`, `:103` | ✅ `author` |
| `data-ln-data-store` | `debug-verifier.js:160` (се чита) | ✅ `:15`, `:56` | ⚠️ туѓ, оправдан (D6) |
| `data-ln-store` | `debug-verifier.js:160` — **повлечен** | ❌ неспомнат | ⚠️ оживеан (D2) |
| Console Warning Filter | **`ln-core/helpers.js:1-19`** | ⚠️ `:11-12` тврди сопственост (D1); `:125-128` го третира точно | n/a |
| `<html data-ln-debug>` | warn филтер: ✅ · observation gate: ❌ | ✅ `:43-46`, `:125-128` — **чесно документирана разлика** | n/a |
| host containment | `gate.js:46-67` | ✅ `:103-115` | n/a |
| page-wide исклучок (`window`/`document`) | `gate.js:53-63` | ✅ `:111-115`, со имињата на настаните | n/a |
| `window.lnDebug.verify` / `.schedule` | `ln-debug.js:45`, `:49` | ✅ `:61-78` | n/a |
| `window.lnDataStore.getStore` | `debug-verifier.js:162` — **не постои** | ❌ (D3) | n/a |
| `VALID_ATTRIBUTES` манифест | 272 записи | ⚠️ `:17` сугерира 1:1 со схемите (P1) | n/a |
| `ln-debug:destroyed` | ❌ не постои | ❌ | n/a |
| `## 🔧 Internals` | — | ❌ отсутна (D5) | n/a |

---

## Затечена состојба

### Двата „gate"-а се различни работи со слични имиња

Тоа беше најголемата нејаснотија при читањето, и вреди да се запише:

| | Console Warning Filter | Console Observation Gate |
|---|---|---|
| каде | `ln-core/helpers.js:1-19` | `ln-debug/src/gate.js` |
| што прави | заменува `console.warn`, филтрира по `[ln-`/`[lnCore` префикс | инсталира sink во `ln-core` преку `setDebugSink` |
| активен без `ln-debug` | **да** | не |
| чита `data-ln-debug` од | `<html>` **или** `<body>` | само `document.body`-евото поддрво |
| се враќа при `destroy` | никогаш | да — `setDebugSink(null)` кога нема host |

README:125-128 ја признава разликата изречно. README:11-12 ја замаглува (D1).

### Манифестот е проверен и точен

Единствената проверка во оваа кампања што можеше да ја провери исправноста на алатот
наспроти сите 50 схеми — и помина. Двете отстапувања надолу се схема-ghost-ови
(`data-ln-rest-connector`, `data-ln-tabs-for`), десетте нагоре се theme-only речник.
Ниту едно не е дефект на манифестот.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија |
| SYS-2, SYS-7, SYS-11, SYS-24 | ✅ нема бројки, класи, компаунди |
| SYS-3 (Internals → компајлиран bundle) | n/a — нема Internals (D5) |
| SYS-8 (сиров `console.error`) | ✅ нула — `console.warn` за дијагностика, `group/log` за sink, обете намерни |
| SYS-13 (зашиен кориснички текст) | ⚠️ пораките на верификаторот се англиски, но тие се **developer** дијагностика, не UI — надвор од `DOCTRINE.md:73` |
| SYS-18 (препишан `shouldIgnoreClick`) | ✅ нема клик слушачи |
| SYS-30 (без IIFE / двојна заштита) | ✅ обете ги има (`ln-debug.js:5`, `:9`) |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| сопствен `MutationObserver` | ✅ нула — користи `observeAttributes` + `onSubtreeChange` |

---

## Отворени прашања за тебе

1. **D1 — кој го поседува Console Warning Filter-от?** Ако останува во `ln-core` (има
   смисла — мора да работи без `ln-debug`), README §1 треба да престане да го брои меѓу
   „what `ln-debug` provides", или да каже изречно *„shipped by `ln-core`, documented here
   because it reads the same attribute"*.

2. **D2 — `data-ln-store` се брише од `debug-verifier.js:160`?** Тоа е една стрелка во
   селектор, и го чисти и записот во схемата. Освен ако намерно се чува како премостување
   за консумери што не мигрирале — во кој случај README треба да го каже.

3. **D3 — `window.lnDataStore.getStore`.** Или се имплементира (програмска регистрација на
   store без DOM елемент), или гранката се брише. Сега е трето место во библиотеката што
   проверува способност што не постои, по `ln-data-coordinator` DC2 (×2).

4. **D5 — Internals секција.** Текстот веќе постои во коментарите на `gate.js`; прашањето
   е дали се преселува или се дуплира.

5. **P1 — заглавјето на манифестот.** Вреди ли да каже дека покрива и theme-only
   атрибути? Инаку следниот што ќе ја направи оваа споредба ќе помисли дека е застаран.

---

**Наоди:** 🔴 0 · 🟠 3 · 🟡 3 · 🔵 4

---

## Затворање на кампањата

Педесет компоненти, педесет извештаи. `ln-debug` е соодветна последна: единствената
компонента чија работа е да ги проверува другите, и која — освен во трите наоди погоре —
го прави тоа точно.

Финални бројки и сите системски обрасци: [`_tracker.md`](_tracker.md).
