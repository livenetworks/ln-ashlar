# Аудит — ln-core

2026-09-10 · Опсег: `components/ln-core/*.js` (14 фајла, 2246 линии), `README.md` (1099 линии), `ln-core.schema.json` · Ревизор: Opus 5
Итерација 1/50 · Checklist: [`_checklist.md`](_checklist.md)

---

## Вердикт

Супстратот е внимателно мислен таму каде некој седнал да го мисли — `defineAttrs`,
споделениот атрибутен обсервер и `compare.js` се меѓу најдобриот код во репото — но
носи **три структурни долга**: втора конзолна порта што ја дуплира онаа на ln-debug,
childList половина од обсерверот што остана неунифицирана (43 обсервера на
`document.body`), и еден природен јазик зашиен во библиотеката.

---

## Што е добро

Ова не се комплименти — ова се обрасци што вредат да се пресадат.

**`attrs.js` е примерен фајл.** `defineAttrs` дефинира getter **без setter**, па
присвојувањето фрла во strict mode. Тоа не е стил — тоа структурно ја прави
дрифтувачката копија невозможна, наместо да се потпира на дисциплина. Коментарот на
врвот (`attrs.js:3-8`) го именува точниот комит што предизвикал испад (`3495690`) и
зошто конкатенирано име на атрибут е невидливо за скенерот. Тоа е коментар што
одговара на „зошто", не на „што".

**`compare.js` ја заклучува типот еднаш по сорт-операција, не по пар**, и во
коментарот стои причината — компараторот губи транзитивност ако типот се менува
меѓу парови. Точно, суптилно, и објаснето.

**`_handleAttrMutation` редоследот е load-bearing и тоа е запишано** (`helpers.js:731-737`):
реактивниот пат оди прв за да не се пријави иницијализацијата на свеж елемент како
промена врз постоечка инстанца. Ова е класа грешка што обично се открива дури во
продукција.

**`resolveFormMethod`** (`helpers.js:425`) е учебнички пример за 2-Consumer Lifting:
постои затоа што submit-портата на `ln-form` и native-submit claim-от на
`ln-data-coordinator` мораат да ја читаат **идентичната** DOM состојба. Причината е
напишана над функцијата.

**Асиметријата `serializeForm` / `populateForm` е намерна и образложена**
(`helpers.js:496-498`): serialize ги прескокнува disabled полињата, populate ги полни —
и бројачот на checkbox групи мора да ги вклучи disabled членовите, инаку група со
еден disabled бокс паѓа назад на single-checkbox коерција.

**Idempotency образецот за inline-ирани бандли** (`_fillBound`, `_localeObserverBound`,
`_attrObserverBound`) е конзистентен и точен — регистарот живее на `window.lnCore`, не
во module scope, зашто секој standalone бандл носи своја копија од фајлот. Тоа е
вистинскиот одговор на вистински проблем.

**Единствениот жив консумент на `attrList` низ `defineAttrs` го почитува
предупредувањето** — `ln-data-store.js:601` го крева getter-от во локална
променлива пред употреба, наместо да го чита во јамка.

---

## Наоди

### 🔴 R1 — README примерот за boot-портата предизвикува тивка смрт на страницата

**Каде:** `README.md:468-478`

Документираниот пример за `holdInit()` / `releaseInit()` гласи:

```js
holdInit();
fetch('/tpl.html').then(html => {
    // populate DOM
    releaseInit();
});
```

**Нема `.catch()`.** Одбиен `fetch` (мрежна грешка, DNS, CORS) значи `releaseInit()`
никогаш не се повикува → `window.lnCore._bootHolds` останува > 0 засекогаш →
`queueBoot`-нати конструктори **никогаш не се извршуваат** → ниту една компонента
на страницата не се иницијализира. Без грешка, без предупредување.

**Достижност:** директна. Секој што го копира примерот од README го добива ова.

**Иронијата:** сопствената референтна имплементација на библиотеката го прави
правилно. `ln-include` има `.catch()` што ослободува (`ln-include.js:76-79`) плус
трето ослободување во `destroy()` (`ln-include.js:91-94`). README учи строго
поопасен образец од кодот што го документира.

---

### 🔴 R2 — `parseDateInput` ги отфрла сите датуми пред 1970

**Каде:** `date.js:14` — `if (!isNaN(num) && num > 0)`

Условот е `num > 0`. Unix timestamp за секој датум пред 1970-01-01 е негативен, па:

- негативен број → преминува во string гранката → `typeof raw === 'string'` е `false` → `return null`
- негативен **string** (`"-157766400"`) → `new Date("-157766400")` → Invalid Date → `null`
- точно `0` (самата епоха) → `num > 0` е `false` → `null`

**Достижност:** висока и обична. Проектната доктрина вели дека датумите патуваат
како Unix timestamp, никогаш ISO (`data-ln-value` sort primitive). Датум на раѓање
на кој било роден пред 1970 е негативен timestamp. Консументи: `ln-date` (14
повикувања), `ln-time` (`ln-time.js:115`).

**Последица:** полето се рендерира празно. Без грешка.

---

### 🟠 R3 — 43 childList обсервера на `document.body`

**Каде:** `helpers.js:846-899` (внатре во `registerComponent`)

Атрибутната половина од обсерверот е унифицирана — еден `MutationObserver` на
`document.body` за целата страница, со коментар што тоа го слави
(`helpers.js:706-711`). **childList половината не е.** Секој повик на
`registerComponent` создава сопствен `MutationObserver` со
`{ childList: true, subtree: true }` врз `document.body`.

`grep -rl "registerComponent(" components/*/src/*.js | wc -l` → **43**.

**Последица:** секое вметнување во DOM каде било на страницата буди 43 callback-а,
секој од кои прави `querySelectorAll(query)` врз додадениот јазол, плус
`closest()`/`matches()` работа за `onSubtreeChange`. Рендер на 100 реда во
`ln-table` ја плаќа таа цена по batch.

**Достижност:** тривијална — секоја страница со повеќе компоненти.

**Забелешка:** ова е недовршена половина од инверзијата на атрибутната реактивност
(`3628e7d`), не нов регрес. Атрибутите се средени; childList остана.

---

### 🟠 R4 — `ln-core` зависи од theme CSS класа што ја нема во core бандлот

**Каде:** `helpers.js:145` — `el.classList.toggle('hidden', !data[prop])`

`fill()`-овиот `data-ln-show` пат крие преку **класата** `hidden`. Таа класа е
дефинирана точно на едно место:

- `theme/utilities/_utilities.scss:16` → `.hidden { @include hidden; }`
- вклучена само преку `theme/ln-ashlar-theme.scss:61` (`@use 'utilities/utilities'`)

`theme/ln-ashlar-core.scss` повлекува **само** 17-те ко-лоцирани компонентни SCSS
фајла — нула utilities. Значи консумент што испорачува `ln-ashlar-core.css`
(tokenless JS substrate) плус core JS-от добива `data-ln-show` што **тивко не крие
ништо**.

**Плус неконзистентност низ библиотеката:** `ln-translations.js:126` крие преку
нативниот атрибут (`triggerBtn.hidden = ...`), додека `ln-table`, `ln-list` и
`ln-validate` користат `classList.add('hidden')`. Две механики за иста работа.

---

### 🟠 R5 — Втора конзолна порта во ln-core, недокументирана

**Каде:** `helpers.js:1-19`

ln-core го **преобложува глобалниот `console.warn` на страницата** при вчитување на
модулот и ги проголтува сите пораки што почнуваат со `[ln-` или `[lnCore` освен ако
`data-ln-debug` е присутен.

Точно истата проверка постои во `components/ln-debug/src/gate.js:13-14`:

```
document.documentElement.hasAttribute('data-ln-debug') ||
    (document.body && document.body.hasAttribute('data-ln-debug'))
```

Две независни порти читаат ист атрибут на две места. Договорот беше дека портата
живее **само** во `ln-debug/src/gate.js`.

Дополнително:
- **Не е документирана никаде.** Grep за `interceptor` / `console.warn` низ
  `ln-core/README.md` враќа 4 линии, ниту една не ја опишува.
- **Нема idempotency guard.** Истиот фајл го чува `_fillBound` два блока подолу
  токму затоа што секој standalone бандл inline-ира своја копија — но конзолната
  закрпа нема таков guard, па со N бандли `console.warn` се обвиткува N пати.
- Го закрпува само `console.warn`. `console.error` поминува непречистено — види R8.
- Ова е **трет** механизам, покрај двата во суспендираната виљушка #1: ни
  „CSS `::after`, без console.warn" (mindset.md), ни „console.warn секогаш"
  (component-guide.md), туку „console.warn тивок освен во debug".

---

### 🟠 R6 — Еден природен јазик зашиен во супстратот

**Каде:** `helpers.js:1010-1035`

При вчитување на модулот, ln-core самиот се регистрира:

```js
registerLocaleFallback('mk', { monthsLong: [...], monthsShort: [...],
                               daysLong: [...], daysShort: [...] })
```

Полн македонски речник за месеци и денови, зашиен во библиотеката, испорачан на
секој консумент.

**Против:** DOCTRINE §4 — нула зашиен кориснички текст во JS; сè од `<template>`,
`buildDict()` или `Intl`. Исклучокот во доктрината е тесен и се однесува на мерни
единици, не на имиња на месеци.

**Плус:** механизмот `registerLocaleFallback` постои **токму за да** консументот си
регистрира свој речник. Супстратот го користи сопствениот extension point за да
привилегира еден јазик.

---

### 🟠 R7 — `fill()` има две несогласни семантики за отсутна вредност

**Каде:** `helpers.js:110-166`

Во истата функција, четирите јамки не се согласуваат што значи „вредноста ја нема":

| пат | услов | семантика |
|---|---|---|
| `data-ln-field` | `if (data[prop] != null)` | отсутно → **остави го старото** |
| `data-ln-attr` | `if (data[prop] != null)` | отсутно → **остави го старото** |
| `data-ln-show` | `if (prop in data)` | отсутно → прескокни |
| `data-ln-class` | `if (prop in data)` | отсутно → прескокни |

Тоа не е козметика — двата консумента ја користат функцијата на **спротивни** начини:

- `ln-upload.js:341` — `fill(item, { sizeText: percent + '%' })` е намерен
  **partial update**; преживувањето на неспоменатите полиња е load-bearing.
- `ln-list.js:962` — `fill(el, item)` полни **цел запис** во реискористен елемент.

Во вториот случај, поле што стана `null` во новиот запис го **задржува текстот од
претходниот запис** во тој исти DOM јазол. Прикажување на вредност од запис А врз
запис Б.

**Достижност:** зависи од тоа дали `ln-list` реискористува јазли по клуч. Тоа се
затвора на итерација 41 (`ln-list`) — овде наодот е дека **примитивот носи два
неспоиви договора без да каже кој важи**.

---

### 🟠 R8 — `parseHeaders` пишува сиров `console.error`

**Каде:** `helpers.js:980`

```js
catch (e) { return console.error(`[${componentName}] Invalid headers JSON:`, e), {}; }
```

Заобиколува и debug sink-от и warn-портата од R5 (која го закрпува само `warn`).
Според ln-debug sink доктрината, конзолниот излез оди низ sink-от.

---

### 🟠 R9 — `ensureLocaleObserver` набљудува `subtree: true`

**Каде:** `helpers.js:602-606`

```js
observer.observe(document.documentElement, {
    attributes: true, attributeFilter: ['lang'], subtree: true
});
```

**Секоја** промена на `lang` врз **кој било** елемент на страницата испраќа
страничен `ln-core:locale-change`. Не само `<html lang>`, што коментарот
(`helpers.js:586`) го тврди: *„One `<html lang>` observer for the whole page."*

Тоа не е теоретско: `getLocale(el)` (`helpers.js:572`) експлицитно поддржува
вгнездени `lang` преку `el.closest('[lang]')`, значи per-element `lang` е
поддржан образец → обсерверот ќе прегорува. Секој re-render што поставува
`lang` на ќелија тера сите locale-осетливи инстанци да се преформатираат.

---

### 🟠 R10 — `calculateProgress` го враќа идиомот што `attrInt` го укина

**Каде:** `progress.js:9-11`

```js
const val = parseFloat(String(rawValue)) || 0;
const max = parseFloat(String(rawMax)) || 100;
```

`attrs.js:15` изречно го именува овој идиом како тоа што го **заменува**:
*„`0` стои `0` — за разлика од `parseInt(...) || 1000` идиомот што го заменува."*
Два фајла подалеку, истиот идиом е жив.

**Последица:** `max="0"` тивко станува `100`. Достижно преку
`ln-progress.js:54` (го предава `max` директно). `ln-circular-progress.js:87`
става **втор** `|| 100` врз истото (`rawMax || 100`) — двојно подразбирање врз ист
пат.

---

### 🟠 R11 — Boot-портата нема watchdog

**Каде:** `helpers.js:660-704`

`holdInit()` инкрементира бројач без тајмер, без граница, без предупредување.
Ако држачот никогаш не ослободи — не поради грешка во кодот туку затоа што `fetch`
**никогаш не се решава** (сервер што виси; `ln-include.js:37` нема ни `AbortController`
ни timeout) — целиот boot ред на страницата виси трајно. Нема дијагностика што би
му кажала на developer-от зошто ништо не се иницијализирало.

Ова е системската страна на R1: R1 е README што учи да не се ослободи, R11 е тоа
дека портата нема одбрана ни кога кодот е точен.

---

## 🟡 Doc-drift

| # | Наод | Каде |
|---|---|---|
| D1 | JSDoc-от на `requestData` вели *„Used by ln-table. `ln-list` does not"* — но `ln-list.js:1085` буквално го повикува `requestData(this, 'ln-list:request-data', 'list')`. Коментарот е фактички неточен. | `helpers.js:77-78` |
| D2 | Глобалниот `console.warn` interceptor не е документиран во README воопшто. | `helpers.js:1-19` |
| D3 | README:463 вели *„Never `console.warn` for this case — it is a CSS-only dev affordance"*, додека README:44, :697 и :774 документираат `console.warn` како очекувано однесување на самиот ln-core. Виљушката #1 живее внатре во еден README. | `README.md` |
| D4 | Коментарот на `ensureLocaleObserver` вели „One `<html lang>` observer" — но `subtree: true` го прави документо-широк (R9). | `helpers.js:586` |
| D5 | `requestData` бара приватен договор од консументот (`_applyFilterAndSort`, `_render`, `_updateFooter`, `_vStart`, `_vEnd`) — супстратот зависи од приватното `_` API на компонента, што ја врти насоката на зависност. Документирано во JSDoc, но не е адресирано како архитектонски избор. | `helpers.js:79-86` |
| D6 | **20 од 81 извоз немаат посветена секција** во README — дел се само спомнати во прегледните точки без параметри и однесување: `resolveFormMethod`, `shouldInterceptLink`, `buildUrl`, `getHeaders`, `parseHeaders`, `registerDataMapper`, `getDataMapper`, `interceptValueProperty`, `registerLocaleFallback`, `getLocaleFallback`, `ensureLocaleObserver`, `setDebugSink`, `hashLinkClick`, `resolveHashNamespace`, `hashSortEncode/Decode`, `hashFilterEncode/Decode`, `parseSearchFields`, `collapseSearchParts`. Обратната насока е чиста: **ниту еден документиран симбол не фали во изворот.** | `README.md` |
| D7 | Нула временски референци во README (F6 поминува). Трите „currently" се описни, не roadmap. | — |

---

## 🔵 Предлози — не се правила, слободно одбиј

| # | Забелешка | Каде |
|---|---|---|
| P1 | `shouldInterceptLink` споредува `hostname`, не origin. Различен порт (`site.com:8443`) или протокол се третираат како ист origin и се пресретнуваат. | `helpers.js:949` |
| P2 | `buildDict` е деструктивно читање (`els[i].remove()`). Втор повик враќа `{}`. Компонента што се реиницијализира го губи речникот. | `helpers.js:329` |
| P3 | `cloneTemplate` кешира сам **елемент**. Во SPA каде рутата го заменува DOM-от, кешот држи откачен јазол и клонира од застарен template. | `helpers.js:29-32` |
| P4 | `findElements` нема заштита од конструктор што фрла — една исклучок ја прекинува јамката и сите преостанати елементи остануваат неиницијализирани. | `helpers.js:347-351` |
| P5 | `compareValues` во нумерички режим мапира празно/NaN во `0`, па празните ќелии слетуваат во **средината** на нумеричкиот опсег, меѓу негативните и позитивните. | `compare.js:34` |
| P6 | `interceptValueProperty` нема пат за враќање на оригиналниот descriptor — по `destroy()` пресретнувањето останува на елементот. | `helpers.js:634` |
| P7 | `deepReactive` го мутира објектот на повикувачот на место (`target[keys[i]] = wrap(val)`). Плус `push` врз обвиткана низа пали `onChange` двапати (index, потоа length). | `reactive.js:26-31, 44` |
| P8 | Дупликат банер-коментар. | `helpers.js:623` и `:625` |

---

## Отворено прашање што го надминува ln-core

**`window.lnCore` е втор јавен API без доктрина.**

Блокот на `helpers.js:1037-1047` изложува 9 симболи на глобалниот објект:
`registerDataMapper`, `getDataMapper`, `registerLocaleFallback`, `getLocaleFallback`,
`fillTemplate`, `fill`, `lnFill`, `renderList`, `ensureLocaleObserver`.

Ова **не е мртов код** — тоа е консументскиот договор на SPA-та:
- `spa-starter/README.md:157` го документира `lnCore.renderList(...)` во табела на API
- `demo/spa/src/dashboard/dashboard.js:37` го повикува
- `docs/reactive.md:3` ги нарекува „четирите примитиви извезени од ln-core"

Но членството е необјаснето. Зошто `ensureLocaleObserver` (внатрешна лења
инсталација) е таму, а `cloneTemplate` — што `renderList` го бара за да работи —
не е? Зошто `dispatch` не е?

Тоа е истата дупка како суспендирана ставка #3 (`schema.json` без доктрина): постои
универзално, се користи вистински, а ниту еден документ не кажува што е договорот.

**Последица за оваа кампања:** consumer census што брои само `components/*/src/`
систематски ќе означи такви симболи како „нула консументи". За ln-core, census-от
мора да го вклучи и SPA слојот.

---

## Отворени прашања за тебе

**Процедурално, блокира слој 1:**

1. **`defineAttrs` на 1/49.** Кога на итерација 2 (`ln-toggle`) најдам парсиран
   атрибут во instance state — тоа е **наод против ln-toggle**, или е **очекувана
   состојба** додека не помине следниот migration pass? Одговорот важи за сите 49.
2. **Виљушката за `console.warn`** (суспендирана #1) сега има трета страна — R5.
   Без пресуда, 49 компоненти се судат по правило што не постои.

**Архитектонски:**

3. **R3 (43 обсервера)** — дали childList унификацијата беше свесно одложена при
   `3628e7d`, или е испуштена половина?
4. **R6 (`mk` речник)** — останува ли во библиотеката, или се сели кај консументот?
5. **R7 (`fill` семантика)** — кој од двата договора е вистинскиот: replace или patch?
6. **R11** — сака ли boot-портата watchdog, или држачот е одговорен и точка?
7. **34-те еден-консумент извози** — сакаш ли одделен премин низ таа листа, или
   секој се разгледува на итерацијата на својот консумент?
8. **`reactiveState` / `deepReactive`** — документирани во `docs/reactive.md`, нула
   консументи, не се на `window.lnCore`. Се бришат, се изложуваат, или се усвојуваат?

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| извезени симболи | 78 (`index.js`) | по фајл, не по симбол | н/п |
| `requestData` консументи | ln-table, ln-list | JSDoc вели само ln-table | н/п |
| глобален `console.warn` interceptor | `helpers.js:1-19` | **отсутен** | н/п |
| `window.lnCore` површина | 9 симболи | **отсутна** во ln-core README; документирана во `spa-starter/README.md` | н/п |
| `data-ln-debug` | чита се во `helpers.js:10-11` | спомнат | декларирано |

---

## Механички попис

81 извезен симбол. Консументи броени од `import { … } from '…ln-core…'` плус
`window.lnCore.X(...)` пристапи низ `components/*/src/**`, компајлирани бандли
исклучени.

> **Корекција на пописот.** Механичкиот пас брои само `components/*/src/` и затоа
> го означи `renderList` како „никогаш повикан било каде". Тоа е неточно —
> `demo/spa/src/dashboard/dashboard.js:37` го повикува преку
> `window.lnCore.renderList(...)`, а `spa-starter/README.md:157` го документира како
> јавно API. Долунаведените нули значат **нула консументи меѓу компонентите**,
> што за симбол изложен на `window.lnCore` не значи неупотребен.

### Нула консументи меѓу компонентите

| симбол | на `window.lnCore`? | документиран? | пресуда |
|---|---|---|---|
| `renderList` | ✅ | `spa-starter/README.md:157`, `docs/reactive.md` | **не е мртов** — SPA консументско API |
| `reactiveState` | ❌ | `docs/reactive.md:201` со `import` пример | документиран примитив **без консумент и без пат за испорака** |
| `deepReactive` | ❌ | `docs/reactive.md:221` со `import` пример | исто |
| `attrStr` | ❌ | само во gitignored `.claude/plans/` | кандидат за мртов код |
| `persistRemove` | ❌ | нигде | кандидат за мртов код |
| `persistClear` | ❌ | нигде | кандидат за мртов код |

`docs/reactive.md:3` ги нарекува *„четирите примитиви извезени од ln-core (`fill`,
`renderList`, `reactiveState`, `deepReactive`)"*. Од тие четири, две немаат ниту
еден консумент, а `window.lnCore` блокот (`helpers.js:1031-1039`) изложува точно 9
симболи — `reactiveState` и `deepReactive` **не се меѓу нив**. Консумент што ги
вчитува standalone бандлите нема начин да ги добие.

### 34 извози со точно еден консумент

Правилото за 2-Consumer Lifting вели дека алгоритам живее во супстратот кога го
бараат 2+ компоненти. **34 од 81 извоз имаат точно еден.**

| единствен консумент | симболи |
|---|---|
| ln-data-store | `setCryptoKey`, `getCryptoKey`, `encryptData`, `decryptData`, `attrInt`, `attrBool`, `attrList`, `defineAttrs` |
| ln-number | `getSeparators`, `cleanNumericString`, `parseNumber` |
| ln-search | `normalizeSearchTerm`, `parseSearchFields`, `collapseSearchParts` |
| ln-data-coordinator | `resolveFormMethod`, `registerDataMapper`, `getDataMapper` |
| ln-key | `isUsableTarget`, `isEditableTarget` |
| ln-sort | `hashSortEncode`, `hashSortDecode` |
| ln-filter | `hashFilterEncode`, `hashFilterDecode` |
| ln-include | `holdInit`, `releaseInit` |
| ln-debug | `pendingCount`, `setDebugSink` |
| ln-date | `registerLocaleFallback`, `formatDateToISO` |
| ln-translations | `cloneTemplate` |
| ln-router | `findElements` |
| ln-toggle | `isTargetDisabled` |
| ln-couchdb-connector | `buildUrl` |
| ln-ui-coordinator | `hashParse` |

Ова **не е листа за преселба.** Некои се очигледно намерни — `resolveFormMethod`
постои токму за да го читаат двајца (вториот, `ln-form`, го добива преку submit
портата), `setDebugSink` е слот по дизајн. Но прашањето никогаш не е поставено ниту
за еден од 34-те. Тоа е систематска дупка, не поединечна грешка.

### Здрава страна на пописот

- **`schema.json` е чист.** 17 декларирани `data-ln-*` атрибути, сите 17 потврдени
  присутни во нивниот декариран изворен фајл. Нула сирачиња.
- **Нула `.style.` присвојувања, нула `alert/confirm/prompt`, нула `throw`** низ
  целиот супстрат.
- **Чисти фајлови потврдени** (нула `document.` / `window.`): `attrs.js`,
  `compare.js`, `date.js`, `matching.js`, `number.js`, `progress.js`, `reactive.js`,
  `persist.js`, `crypto.js`.
- **`window-cache.js` debounce-от се чисти правилно** — `clearTimeout` на 4 места
  наспроти еден `setTimeout`.

### Дополнува претходни наоди

- **R8 е поширок од `parseHeaders`.** 9 `console.` погодоци во супстратот, ниту еден
  низ sink-от: `crypto.js:20,53,80`, `helpers.js:34,297,982`, `persist.js:42`
  (плус двете линии на самиот interceptor). Од нив 4 се `console.error` — а
  портата од R5 закрпува само `console.warn`, па тие **секогаш** печатат.
- **R3 се потврдува.** Нула `.disconnect(` низ цел ln-core. Сите 3 типа обсервери
  се трајни за животот на страницата, вклучувајќи ги и 43-те childList.
- **Нула `removeEventListener`** — трите `addEventListener` се singleton, чувани со
  boolean знаменца наместо со отстранување.

---

## 🔴 R12 — README-от за `compareValues` фрла ако го следиш

**Каде:** `README.md:930` наспроти `compare.js:30`

| | потпис | четврти аргумент |
|---|---|---|
| README | `compareValues(a, b, type, locale)` | **locale стринг**; се тврди дека внатре гради `Intl.Collator(locale, {...})` |
| извор | `compareValues(a, b, type, collator)` | **готова `Intl.Collator` инстанца** |

Изворот прави `if (collator) return collator.compare(strA, strB);` (`compare.js:38`).
Предаден стринг `'en-US'` е truthy → `'en-US'.compare` е `undefined` → **TypeError**.

Следењето на документираниот потпис не дава погрешен резултат — дава исклучок.

---

## 📌 Статус што ги засега сите наредни 49 итерации

**`defineAttrs` е усвоен во 1 од 49 компоненти.**

`grep -rln "defineAttrs" components/*/src/` враќа точно еден резултат:
`ln-data-store`. Два појавувања вкупно — еден import, еден повик.

Инверзијата на атрибутната реактивност (`3628e7d`) го изгради механизмот правилно —
core секогаш известува, компонентата декларира само реакција, вредностите се живи
getter-и наместо копии. Тоа не е дефект во `ln-core`; тоа е **недовршена миграција**
(`.claude/plans/attr-reactivity-pass1.md` самиот се нарекува „pass 1").

Останатите 48 компоненти сè уште парсираат атрибути во instance state.

**Ова бара процедурална одлука пред слој 1** (види Отворени прашања).
