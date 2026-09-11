# Аудит — ln-router

**Датум:** 2026-09-11 · **Итерација:** 47/50 · **Слој 6 — координатори и навигација**
**Опсег:** `src/ln-router.js` (570), `src/router-model.js` (50), `README.md` (443), `ln-router.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Единствената компонента во библиотеката што ја нема IIFE обвивката и двојната заштита при
вчитување, со чист модел за одлуки што е вреден за углед — а нејзиниот teardown посега
надвор од сопственото поддрво и вика `destroy()` таму каде постои request-настан за
затворање.

---

## Што е добро

**`router-model.js` е најчистото раздвојување одлука/извршување во кампањата.**
`planRegions` (`:16-49`) добива описи прочитани од DOM-от и враќа `{ notFound, clears,
swaps, owner }` — **без ниту еден DOM допир**. И извршувањето го почитува тоа буквално:

```js
// 8. Atomic swap — one view transition wraps every region clear/mount.
//    executeSwaps only executes the plan; it never re-judges it.          // :330-331
```

Нема втора проверка, нема „ако сепак". Тоа е раздвојувањето што `component-refactoring-blueprint`
го бара, и е единствениот случај каде моделот донесува **структурна** одлука, не само
пресметка.

**`shouldInterceptLink` се увезува, не се препишува.** `:2` и `:417`. Заедно со
`ln-ajax:31`, тоа се двете компоненти што го користат примитивот како што треба —
наспроти шесте што го препишуваат послабо (SYS-18).

**Guard за резервиран збор, со причина.**

```js
// Reserved-word guard: '__primary__' is the internal sentinel for the
// default outlet. A template targeting an element with this id would
// collide and silently render into the default outlet. Reject + warn.     // :497-499
```

Внатрешен сентинел што може да се судри со авторски `id` — фатено и одбиено гласно, не
маскирано.

**Fragment-only popstate заштитата е прецизно образложена.** `_onPopState:441-461` — кога
Back/Forward менува **само** hash, навигацијата се прескокнува за да не се урне и
пре-клонира примарниот outlet, а hash-врзаните компоненти (`ln-modal`) реагираат преку
`hashchange`. Коментарот на `:448-451` изречно вели кое поле е авторитативно и зошто
`cur.path` **не смее** да се пре-парсира. Тоа е ниво на прецизност што ретко се среќава.

**Fragment-от преживува boot.** `:483` — `pathname + search + hash`, со шестреден коментар
зошто: без hash-от `_navigate`-овиот `replaceState` тивко го брише фрагментот при секое
подигање, и `ln-modal` deep-link во edit режим никогаш не се отвора. Тоа е грешка што се
открива само со тестирање.

**View transitions се условни на hydration.** `:406` — `document.startViewTransition &&
!opts.isHydration`. Почетниот рендер не добива анимација, што е точно.

**Насловот се интерполира од авторски атрибут, не од зашиен текст.** `:356-363` —
`data-ln-route-title` со `{{ param }}` замена. `DOCTRINE.md:73` почитуван целосно.

---

## Наоди

### 🟠 R1 — Единствената компонента без IIFE и без двојна заштита при вчитување

**Каде:** `:1-31` — фајлот почнува со `import`, продолжува со `export const router` и
модулна состојба, без обвивка.

Сите останати 49 компоненти го носат истиот образец:

```js
(function () {
	const DOM_ATTRIBUTE = 'lnX';
	if (window[DOM_ATTRIBUTE] !== undefined) return;
	…
})();
```

`ln-router` го нема ниту едното. Наместо тоа:

```js
export const router = { navigate, replace, current };      // :7-24
const DOM_SELECTOR = 'data-ln-route';
const DOM_ATTRIBUTE = 'lnRoute';

if (typeof window !== 'undefined') {
	window.lnRouter = router;                              // :30 — безусловно
}

const regionRegistry = new Map();                          // :35 — модулна состојба
const mountedTemplates = new WeakMap();                    // :38
let booted = false;                                        // :43
let currentPath = null;                                    // :44
```

**Извор на правилото:** `_checklist.md` A група — `window[DOM_ATTRIBUTE]` guard како прва
структурна проверка; и коментарот во `ln-core/helpers.js:709-711`: *„every standalone
bundle inlines its own copy of this file — same reason and same shape as the `_fillBound`
/ `_localeObserverBound` flags"*.

**Што се случува при двојно вчитување** (два бандла што го носат `ln-router` во истата
страница, што е точно сценариото поради кое guard-от постои):

1. Втората копија создава **нов** `regionRegistry`, **нов** `mountedTemplates`, нови
   `currentPath` / `booted`.
2. `:30` го пре-насочува `window.lnRouter` кон вториот.
3. Првиот веќе ги качил `document` click и `window` popstate слушачите (`:470-471`) и **тие
   остануваат** — `booted` на првата копија е `true`, но тоа е друга променлива.
4. Резултат: две навигации по клик, две `pushState` повикувања, и `router.current()`
   одговара од регистар што не е оној што ги држи слушачите.

**Достижност:** не се случува во репото — но guard-от постои во 49 фајла токму за тоа, и
овој е единствениот што го нема.

---

### 🟠 R2 — Teardown-от посега надвор од сопственото поддрво и вика `destroy()` наместо да побара затворање

**Каде:** `_teardownOutlet:225-239`

```js
// 2. Close open popovers whose trigger lived inside the torn-down target.
const popovers = document.querySelectorAll('[data-ln-popover="open"]');
for (const popover of popovers) {
	const inst = popover.lnPopover;
	if (inst && inst.trigger && target.contains(inst.trigger)) {
		try {
			inst.destroy();                              // :234
		} catch (e) { … }
	}
}
```

**Извор на правилото:** `DOCTRINE.md:42` — *„Coordinators **MUST NOT** call prototype
mutation methods directly (e.g. `el.lnProfile.create()`). They **ALWAYS** dispatch request
events (e.g. `ln-profile:request-create`)."* И `docs/architecture/philosophy.md:80` —
*„Commands are `ln-{component}:request-{action}` events or attribute writes."*

Настанот постои: `ln-popover.js:59` — `ln-popover:request-close`.

Две работи го разликуваат ова од чекор 1 (`:213-223`), кој **не е** наод:

| | чекор 1 | чекор 2 |
|---|---|---|
| опсег | `target` и неговите потомци — DOM што роутерот го уништува | `document.querySelectorAll` — **надвор** од регионот |
| намера | уништи, зашто јазлите исчезнуваат | *„Close open popovers"* — по сопствениот коментар |
| алтернатива | нема — јазлите заминуваат | `ln-popover:request-close` постои |

Чекор 1 го повторува она што `ln-core` и онака го прави при вадење на јазол, врз DOM што
роутерот го поседува. Чекор 2 уништува жива компонента што останува во DOM-от — заради
затворање.

**Последицата е конкретна:** `ln-popover.destroy():237` навистина повикува `_applyClose()`
ако е отворен, па визуелно се затвора. Но инстанцата исчезнува — сите три
`request-open`/`-close`/`-toggle` слушачи се тргнати (`:234-236`). Тој popover престанува
да работи додека споделениот обсервер не го пре-иницијализира, што бара мутација врз
неговиот елемент. Shell-ниво popover (точно случајот што коментарот го именува) не добива
таква мутација од навигацијата — значи останува мртов до следната промена врз себе.

**Забелешка за исправност:** `destroy()` е животноциклусен, не мутациски метод, и правилото
именува `create()` како пример. Тежината е во тоа што **намерата е затворање**, request-
настанот постои, и целта е надвор од поседуваното поддрво.

---

### 🟠 R3 — `document.title` и `history.pushState` имаат два сопственика, со различни state објекти што никој не ги чита

| операција | `ln-router` | `ln-ajax` |
|---|---|---|
| `pushState` | `:325` — `pushState(null, '', fullPath)` | `:185`, `:188` — `pushState({ ajax: true }, '', …)` |
| `replaceState` | `:327` | — |
| `document.title` | `:363` — од `data-ln-route-title`, со `{{param}}` интерполација | `:170` — од `data.title` во серверскиот одговор |
| `popstate` слушач | `:471` — `_onPopState` | **нема** |

Двата пишуваат во истата историја. State објектите се **различни** — `null` наспроти
`{ajax: true}` — што значи дека дискриминатор постои. `_onPopState` (`:441`) го **игнорира
целосно**: не прима аргумент, чита само `window.location.pathname + search`.

Последица во страница со обете: Back преку запис што `ln-ajax` го турнал стигнува до
роутеровиот `_onPopState`, кој наоѓа совпаѓање со рута и **го пре-клонира примарниот
outlet** врз содржината што `ln-ajax` ја вметнал. И насловот: кој од двата победил зависи
од редоследот на последната операција, не од сопственост.

**Достижност — проверена и негативна:**

```
14 страници со data-ln-route (demo/, spa-starter/) → сите со data-ln-ajax = 0
```

Ниту една страница во репото не ги користи обете. Значи достижно по документираниот
договор, немаскирано но и нетестирано. Ниту `ln-router/README.md` ниту `ln-ajax/README.md`
не го спомнуваат другиот како сосопственик на историјата или насловот.

**Ова го затвора пренесеното прашање** за сосопственоста: **нема поделба.** Двата пишуваат
во обете, ниту еден не знае за другиот, и разликата во `state` објектот — единствената
основа за поделба што веќе постои во кодот — не се чита никаде.

---

### 🟡 R4 — Единствениот `destroy()` без заштита од двојно повикување

```js
_component.prototype.destroy = function () {
	_unregisterRoute(this.dom);
	delete this.dom[DOM_ATTRIBUTE];
};                                                          // :561-564
```

Сите останати 49 почнуваат со `if (!this.dom[DOM_ATTRIBUTE]) return;`.

**Практично е безопасно:** `_unregisterRoute` е идемпотентен — `:7` `if (!region) return;`,
а `Map.delete` на непостоечки клуч е no-op. Значи вториот повик тивко не прави ништо.

Заведено како 🟡, не 🟠, токму заради тоа: наодот е против отсуството на образецот што
целата библиотека го носи, не против последица.

---

### 🟡 R5 — `destroy()` ги остава инјектираните `tabindex` атрибути

`executeSwaps:365-375` инјектира `tabindex="-1"` на две места:

```js
if (!d.targetEl.hasAttribute('tabindex')) {
	d.targetEl.setAttribute('tabindex', '-1');              // :367 — на регионот
}
const firstHeading = d.targetEl.querySelector('h1, h2, h3, h4, h5, h6');
if (firstHeading) {
	firstHeading.setAttribute('tabindex', '-1');            // :371 — на АВТОРСКИ наслов
	firstHeading.focus();
}
```

Вториот е потежок: `firstHeading` е авторски елемент внатре во склонираниот шаблон.
`:371` го запишува безусловно — **без** `hasAttribute` проверката што `:366` ја има за
регионот. Значи авторски `<h1 tabindex="0">` се прегазува на `-1` и се вади од tab
редоследот.

`destroy()` (`:561`) не враќа ништо од двете. **SYS-9** — иако овде поголемиот дел од
штетата исчезнува со самиот склониран јазол при следниот swap; она што останува е
`tabindex="-1"` на **регионскиот** елемент (`:367`), кој е дел од школката и преживува.

---

### 🟡 R6 — Два `console.error`, и нема `ln-router:destroyed`

`:219` — `console.error('[ln-router] Error destroying component ${key} on element:', el, e)`
`:236` — `console.error('[ln-router] Error destroying open popover:', e)`

**SYS-8.** Портата во `ln-debug/src/gate.js` закрпува само `console.warn`. Истиот фајл
користи `console.warn` **четирипати** (`:195`, `:199`, `:344`, и во `_registerRoute`), што
значи разликата повторно не е одлука туку случајност — идентично со `ln-data-coordinator`
DC5.

Нема `ln-router:destroyed` — **SYS-23**. Компонентата испраќа `ln-router:before-navigate`
(`:315`), `ln-router:navigated` (`:382`) и not-found, но ништо при уништување на рута.

---

### 🔵 P1 — При aux-only навигација, произволен регион го добива насловот

`router-model.js:46-47`:

```js
const primarySwap = swaps.find(d => d.regionKey === '__primary__');
const owner = primarySwap || swaps[0] || null;
```

Кога примарниот outlet не се менува (навигација што погодува само помошни региони),
сопственикот е `swaps[0]` — **првиот по редослед на дескрипторите**, што значи по редослед
на регистрација на шаблоните во DOM-от. Тој регион го добива `document.title`, фокусот и
(ако е примарен) скролот.

Тоа е детерминистички, но не е избор — и `README` не кажува по што се одредува. Со два
помошни региона што обата се менуваат, насловот го одредува редоследот на `<template>`
елементите во markup-от.

---

### 🔵 P2 — `_onPopState` не го чита `event.state`, иако постои дискриминатор

`:441` — `function _onPopState() {` — без аргумент. Историјата веќе носи разлика:
роутерот пишува `null` (`:325`), `ln-ajax` пишува `{ ajax: true }` (`:185`). Еден
`if (e.state && e.state.ajax) return;` би ја решил R3 сосопственоста во една линија — но
тоа е одлука за тебе, не препорака од мене.

---

### 🔵 P3 — Teardown-от прелистува сите сопствени клучеви на секој елемент

`_teardownOutlet:210-223`:

```js
const descendants = Array.from(target.querySelectorAll('*'));
const allElements = [target].concat(descendants);
for (const el of allElements) {
	for (const key of Object.keys(el)) {
		if (key.startsWith('ln') && el[key] && typeof el[key].destroy === 'function') { … }
	}
}
```

`Object.keys(el)` врз DOM елемент враќа сите сопствени enumerable својства — вклучувајќи
ги и сите `_ln*` expando-и што компонентите ги закачиле (`_lnRecord`, `_lnSearchText`,
`_lnFillBound`…). За регион со илјада јазли тоа се илјада `Object.keys` повикувања при
секоја навигација.

Работи коректно и е генерично по дизајн (не бара регистар на имиња). Заведено како цена.

---

### 🔵 P4 — `booted` никогаш не се ресетира

`_boot` (`:465-487`) се заштитува со `booted` и се повикува од `onInit` само кога
`regionRegistry.size > 0` (`:569`). Ако **сите** рути се уништат, регистарот се празни
(`_unregisterRoute:10-12`), но `booted` останува `true` и двата слушачи остануваат качени.
Ново регистрирање подоцна нема да го повика `_boot` повторно — што е точно, зашто
слушачите се таму. Benign, но значи дека `booted` всушност значи „слушачите се качени",
не „подигнат е".

---

### 🔵 P5 — `data-ln-popover` во схемата

Заведен како `author` со извор `src/ln-router.js`, зашто `:229` содржи литерален
`'[data-ln-popover="open"]'`. Атрибутот му припаѓа на `ln-popover`. Ист облик како
`ln-chart` CH6 и `ln-search` S8 — течење преку селектор-стринг.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-route` | `:26`, `:492` | ✅ | ✅ `author` |
| `data-ln-route-target` | `:495`, `:568` | ✅ | ✅ `author` |
| `data-ln-route-title` | `:518`, `:568` | ✅ | ✅ `author` |
| `data-ln-route-keep` | (`planRegions` `hasKeep`) | ✅ | ✅ `author` |
| `data-ln-router-hydrate` | (`hasHydrate`) | ✅ | ✅ `author` |
| `data-ln-outlet` | `:198` | ✅ | ✅ `author` |
| `data-ln-popover` | `:229` (само се чита) | ⚠️ неспомнат | ⚠️ туѓ (P5) |
| `window.lnRouter` | `:30` | ✅ | n/a |
| `export const router` | `:7` | ✅ | n/a — **единствената компонента што извезува runtime објект** |
| `ln-router:before-navigate` | `:315` | ✅ | n/a |
| `ln-router:navigated` | `:382` | ✅ | n/a |
| `ln-router:destroyed` | ❌ не постои | ❌ | n/a |
| IIFE + `window[DOM_ATTRIBUTE]` guard | ❌ **отсутни** (R1) | ❌ неспомнато | n/a |
| `destroy()` idempotency guard | ❌ отсутен (R4) | ❌ | n/a |
| `document.title` сосопственост | `:363` и `ln-ajax:170` | ❌ ниту едно README не го спомнува другото (R3) | n/a |
| `pushState` сосопственост | `:325` и `ln-ajax:185` | ❌ исто | n/a |
| инјектиран `tabindex="-1"` | `:367`, `:371` | ⚠️ фокусот е документиран, атрибутот не | n/a |
| Internals извор | `src/ln-router.js` | ✅ `:413` — **точен** | n/a |

---

## Затечена состојба

### Пренесената ставка за `shouldInterceptLink` — затворена позитивно

Прашањето беше дали `ln-router` го дуплира примитивот како `ln-external-links._isExternalLink`
(EL2), со `hostname` споредба без порт.

**Не го дуплира.** `:2` го увезува, `:417` го користи директно:

```js
if (!anchor || !shouldInterceptLink(e, anchor)) return;
```

Заедно со `ln-ajax:31`, тоа се **двете** компоненти во библиотеката што го консумираат
примитивот како што е замислен. Останатите шест го препишуваат послабо (SYS-18:
`ln-popover`, `ln-external-links`, `ln-tabs`, `ln-fill`, `ln-list`, `ln-table`,
`ln-ui-coordinator`). **Ставката се затвора** — остатокот е `_isExternalLink` во
`ln-external-links`, веќе заведен како EL2.

### Пренесената ставка за `document.title` / `pushState` — затворена како договорна дупка

Види R3. Кратко: **нема поделба на сопственост.** Обете компоненти пишуваат во обете,
со различни `state` објекти што `_onPopState` не ги чита, и ниту едно README не го
спомнува другото. Недостижно во репото (нула страници со обете), достижно по договор.

### Единствената компонента со сопствен runtime API објект

`export const router` (`:7-24`) плус `window.lnRouter` (`:30`). `navigate`, `replace`,
`current` — императивен API што ниту една друга компонента не го нуди. Тоа е свесна
одлука за навигација (која по природа е програмска), но вреди да се знае дека е
единствена: сите останати се адресираат преку `element.lnX` инстанца или преку настани.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ конструкторот доделува прво (`:556`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ |
| SYS-3 (Internals → компајлиран bundle) | ✅ **точен** — `:413` покажува на `src/` |
| SYS-7 (`.hidden` / `.sr-only`) | ✅ не пишува класи за криење |
| SYS-11 (BEM `__`) | ✅ нула |
| SYS-13 (зашиен кориснички текст) | ✅ насловот доаѓа од `data-ln-route-title` |
| SYS-18 (препишан `shouldIgnoreClick`) | ✅ **го увезува** |
| SYS-22 (README без Internals) | ✅ има |
| SYS-24 (state класа без CSS) | ✅ нула класи |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| модел фајл | ✅ чист, еден извоз, жив, покриен со `tests/ln-router.test.js` |

---

## Отворени прашања за тебе

1. **R1 — IIFE и двојната заштита.** Свесен исклучок (модулна состојба што мора да е
   споделена, па обвивката нема смисла), или превид? Ако е свесен, `window.lnRouter = router`
   на `:30` сепак треба да провери дали веќе постои — инаку вториот вчитан бандл го краде
   регистарот.

2. **R2 — popover teardown-от.** `ln-popover:request-close` наместо `inst.destroy()`?
   Тоа го затвора popover-от и **го остава жив**, што е и она што коментарот го тврди дека
   сака („Close open popovers").

3. **R3 — кој ја поседува историјата и насловот?** Две опции: (а) `_onPopState` го чита
   `e.state` и се откажува на `{ajax: true}` записи — една линија, дискриминаторот веќе
   постои; (б) се прогласува дека `ln-router` и `ln-ajax` се меѓусебно исклучиви и тоа се
   запишува во обете README-а.

4. **R5 — `tabindex="-1"` врз авторски наслов** (`:371`), без `hasAttribute` проверката
   што регионот ја има (`:366`). Намерно, или треба истата ограда?

5. **P1 — кој регион го добива насловот при aux-only навигација?** Сега е првиот по
   редослед на markup. Треба ли изречен избор (на пр. `data-ln-route-title` присутен само
   на еден), или редоследот е доволен договор?

---

**Наоди:** 🔴 0 · 🟠 3 · 🟡 3 · 🔵 5
