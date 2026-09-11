# Аудит — ln-data-coordinator

**Датум:** 2026-09-11 · **Итерација:** 46/50 · **Слој 6 — координатори и навигација**
**Опсег:** `src/ln-data-coordinator.js` (1089), `src/data-read-policy.js` (33), `src/mutation-receipts.js` (41), `README.md` (531), `ln-data-coordinator.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Најдобро раскинатата компонента во целата кампања — `destroy()` што не пропушта ниту еден
од своите триесет слушачи, затвора чекачки промиси со причина и го деинсталира глобалниот
singleton — и во исто време местото каде се собираат сите остатоци од 3-tier стекот:
четири алијаси, три мртви резервни читања, еден транспорт што се бара а не постои, и еден
атрибут што е оневозможен но сè уште се скенира за да испише грешка.

---

## Што е добро

**`destroy()` е моделот што SYS-25 го бара.** `:1011-1068` — триесет `removeEventListener`
повици (вклучувајќи ги **шесте `document`-нивоа**), `MutationReceipts.close()` со
конкретна причина (`:1060`), `_coordinators.delete(this)` (`:1063`), и
`_uninstallGlobalSync()` (`:1064`) што сам проверува дали останал друг координатор
(`:54`). Плус бришење и на атрибутот и на алијасот (`:1066-1067`).

Спореди со `ln-list` L3 и `ln-table` T3, каде истиот автор во истата недела заборавил
четири линии. Овде нема ниту една дупка — а фајлот е трипати поголем.

**Глобалниот singleton се монтира и демонтира со бројач, не со знаменце.**
`_installGlobalSync` / `_uninstallGlobalSync` (`:21-64`) — трите слушачи (`online`,
`offline`, `visibilitychange`) се качуваат еднаш за сите координатори и се симнуваат
**дури кога последниот ќе си отиде**. Тоа е единствениот правилно раководен
модул-синглтон во кампањата.

**Класификацијата на грешки е три категории со образложение по секоја.**

```js
const isAuth      = status === 401 || status === 419;
const isTransient = status === 0 || status >= 500;
const isConflict  = status === 409 || status === 412;      // :646-648
```

И трите гранки носат коментар што кажува **политика**, не механика: *„Transient (5xx /
network / 0): NEVER delete local"* (`:659`), *„No queue: single attempt spent; record
stays local, surface now"* (`:665`), *„Deterministic (4xx / 3xx): never retry"* (`:671`).
Тоа е единственото место во библиотеката каде се пишува зошто локален запис преживува
серверска грешка.

**`MutationReceipts` е чиста, мала и има `close()`.** `mutation-receipts.js` — 41 линии,
нула DOM, нула глобали, и `close(error)` што ги отфрла сите чекачи со причина. Повикана
е од `destroy()`. Тоа е `DOCTRINE.md:105`-от **Destroyed Component Invariant** извршен до
крај, не само за слушачи туку и за промиси.

**`data-read-policy.js` ја носи политиката за читање како чист модул со образложение.**
`selectDataSource:13-23` — шест линии код, шест линии коментар што објаснува зошто
прозорчен store сепак смее да послужи иако е кажано да не прави локални упити. Нула
`window`/`document`. Двата модула (`data-read-policy`, `mutation-receipts`) се и двата
целосно усвоени — сите шест извози живи.

**`_serveData` го компонира упитот од изворот, не од погледот, и го кажува зошто.**
`:809-812` — *„The source owns search/filter/sort even when it holds no rows yet — the
view only contributes the page window."* Тоа е една реченица што ја објаснува целата
`shared-query` архитектура.

---

## Наоди

### 🟠 DC1 — `findChildren` носи три мртви резервни читања

**Каде:** `:200-213`

```js
store:     storeEl ? (storeEl.lnDataStore || storeEl.lnStore) : null,
connector: connectorEl ? (connectorEl.lnConnector || connectorEl.lnApiConnector || connectorEl.lnCouchDbConnector) : null,
```

Затечено со grep низ `components/*/src/`:

| читање | кој го поставува |
|---|---|
| `storeEl.lnDataStore` | `ln-data-store.js:7` ✅ |
| `storeEl.lnStore` | **никој** — повлечено име (`ln-store:*` → `ln-data-store:*`, 07-23) |
| `connectorEl.lnConnector` | `ln-api-connector.js:7,28` **и** `ln-couchdb-connector.js:6,25` ✅ |
| `connectorEl.lnApiConnector` | `ln-api-connector.js:6` — но `lnConnector` веќе фатил |
| `connectorEl.lnCouchDbConnector` | `ln-couchdb-connector.js:5` — исто |

Значи **три од петте читања се недостижни**: `lnStore` затоа што никој не го поставува,
а другите две затоа што првата гранка на `||` секогаш фаќа — обата конектора поставуваат
`lnConnector` во конструкторот и го бришат во `destroy()`.

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code; плус стоечката наредба
дека не се пишува одбранбена логика за недостижни сценарија.

**Ова истовремено го затвора пренесеното прашање** дали треба да постои заеднички
„connector interface": **тој веќе постои и се вика `lnConnector`.** Обата конектора го
поставуваат, координаторот прв го чита. Она што недостига не е интерфејсот — туку негово
запишување како договор, за да престанат `||` синџирите што го маскираат.

---

### 🟠 DC2 — Се бара транспорт што не постои; схемата носи втор

**Каде:** `:202` · `ln-data-coordinator.schema.json`

```js
const connectorEl = this.dom.querySelector('[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]');
```

```
ls components/ln-websocket-connector  → No such file or directory
ls components/ln-rest-connector       → No such file or directory
```

Ниту еден од двата не постои во `components/`. И двата се документирани во
`docs/architecture/data-store-architecture.md` — `:33`, `:122`, `:238` за
`data-ln-rest-connector`, `:139` и `:252` за `data-ln-websocket-connector`, со целосни
markup примери.

Двете се појавуваат различно:

| | `data-ln-websocket-connector` | `data-ln-rest-connector` |
|---|---|---|
| во изворот | ✅ `:202` — се бара | ❌ никогаш |
| во схемата | `author`, извор `src/…` | **`"sources": []`** |

Вториот е **трет случај** на рачно внесен запис со празни извори, по `ln-table`
(`data-ln-table-filter-col`) и `ln-ui-coordinator` (`data-ln-validate-error`).

**Дополнително:** дури и ако `[data-ln-websocket-connector]` елемент постоеше, `:210`
чита само `lnConnector || lnApiConnector || lnCouchDbConnector` — нема
`lnWebsocketConnector`. Значи гранката на `:202` може да го **најде** елементот, но
`children.connector` би останал `null`. Селекторот и читањето не се согласни.

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code.

---

### 🟠 DC3 — Оневозможен атрибут што сè уште се скенира, и се води како жив во схемата

**Каде:** `:172-176`

```js
// 1. Check for deprecated/insecure inline script mapper
const inlineScript = this.dom.querySelector('script[data-ln-mapper]');
if (inlineScript) {
	console.error('[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.');
}
```

Три работи наеднаш:

1. **`data-ln-mapper` е оневозможен** — единственото што го прави присуството е една
   конзолна грешка. Мапирањето се игнорира.
2. **Схемата го носи како `"direction": "author"`** со извор `src/ln-data-coordinator.js`
   — значи CI портата и доковите го објавуваат како дел од живиот договор на
   компонентата. Ист облик како `ln-table`-овите `data-ln-table-sort` / `-col-sort`
   (повлечени, влегуваат преку dev SCSS); овде влегува преку жив JS.
3. **Скенирањето се повторува на секој `refreshMapper()`** — девет повикувачи (P3), од кои
   осум на топли патеки. Значи `querySelector('script[data-ln-mapper]')` се извршува при
   секој запис, секоја синхронизација и секој одговор од конекторот, за атрибут што не
   работи.

`README:111` („Dynamic Child & Mapper Discovery") го опишува мапер механизмот, но не го
наведува `data-ln-mapper` како оневозможен во табелата на атрибути (`:101`).

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code (мртва гранка на топла
патека), и `DOCTRINE.md:73` за должината на конзолната порака (види DC5).

---

### 🟠 DC4 — Четири алијаси во 3-tier стекот

**Каде:** `:8`, `:90`, `:1067` · плус `ln-api-connector.js:7`, `ln-couchdb-connector.js:6`
· плус `:209` `lnStore`

```js
const DOM_ALIAS = 'lnCoordinator';        // :8
…
dom[DOM_ATTRIBUTE] = this;
dom[DOM_ALIAS] = this;                    // :90
```

**Извор на правилото:** пресудата за отсуство на алијаси — *атрибут и настан носат полно
име на компонентата; алијас никогаш*. Формално таа е за атрибути и настани; ова се JS
својства. Ама последицата е иста: два начина да се адресира истото, и двата мора да се
одржуваат.

Пописот во стекот:

| алијас | поставен во | читан од |
|---|---|---|
| `lnCoordinator` | `ln-data-coordinator.js:90` | **никој** (grep: нула читања) |
| `lnConnector` | `ln-api-connector.js:28`, `ln-couchdb-connector.js:25` | `ln-data-coordinator.js:210` ✅ |
| `lnApiConnector` / `lnCouchDbConnector` | канонските имиња | недостижни како резерва (DC1) |
| `lnStore` | **никој** | `ln-data-coordinator.js:209` — мртво читање |

`lnCoordinator` е особен: се пишува (`:90`), се брише (`:1067`), и **никогаш не се чита**
— ниту во оваа компонента, ниту во која било друга, ниту во демото. Коментарите кај
конекторите го именуваат мотивот — *„Set alias for compatibility"*, *„Alias for 3-tier
compatibility"* — но со што е компатибилноста не е запишано никаде.

---

### 🟡 DC5 — Два `console.error` бегаат од портата

**Каде:** `:175` и `:629`

**SYS-8.** Портата во `ln-debug/src/gate.js` закрпува само `console.warn` и филтрира по
`[ln-` / `[lnCore` префикс. `console.error` поминува неприкосновено.

Истиот фајл користи `console.warn` **четирипати** (`:88`, `:220`, `:357`, `:442`) — значи
разликата не е стилска одлука туку случајност. Двете `error` линии се токму оние што
најмногу би имале корист од портата: `:175` е долга безбедносна порака што се повторува
на секој `refreshMapper()`, а `:629` носи серверски објект во конзолата при секој неуспех
на синхронизација.

---

### 🟡 DC6 — Две прочитани атрибути не постојат во README-то

`_refreshAll` (`:941-947`) чита `data-ln-table-window` и `data-ln-list-window` за да
одлучи дали прозорчен поглед да добие `:request-invalidate` или `:request-revalidate`:

```js
const windowAttr = kind === 'table' ? 'data-ln-table-window' : 'data-ln-list-window';
if (el.hasAttribute(windowAttr)) {
	dispatch(el, 'ln-' + kind + (isQueryChange ? ':request-invalidate' : ':request-revalidate'), {});
	continue;
}
```

Обата се во схемата (со `direction: null`), обата се читаат од изворот, и ниту еден не се
спомнува во README-то на **531 линија** — единствените два атрибута што ги чита оваа
компонента а не ги документира. А гранката е носечка: таа одлучува дали прозорецот се
рестартира од страница 0 или се освежува на место по мутација.

---

### 🟡 DC7 — Надгробен натпис во договорен документ

**Каде:** `README.md:529` — цела `###` секција насловена
*„`data-ln-table-filter-options` — removed"*.

Пресудата за timeless докови вели дека доковите се пишуваат во **финална состојба**, без
временско скеле и без референци кон она што било. Секција чиј наслов е името на укинат
атрибут е точно тоа — и е единствената таква во кампањата.

Истиот README носи и `data-ln-mapper` како жив (DC3) и не носи два атрибута што ги чита
(DC6), па чистењето на трите оди заедно.

---

### 🔵 P1 — `MutationReceipts.wait()` нема временско ограничување

`mutation-receipts.js:6-10` — `wait(requestId)` враќа промис што се решава **само** ако
пристигне `resolve`/`reject` со истиот `requestId`. Ако одговорот никогаш не дојде,
чекачот останува во `_pending` до `close()`.

Тоа е безбедно: `destroy()` (`:1060`) ги затвора сите. Заведено затоа што значи дека
неодговорена мутација држи промис жив колку што живее координаторот — и затоа што
`_settle` (`:26-39`) тивко враќа `false` за непознат `requestId`, па истечен одговор нема
никаква трага.

---

### 🔵 P2 — `_serveData` враќа промис што никој не го чека

`:789` враќа `ready.then(…)`, но повикувачот (`:715-717`) го фрла:

```js
reqTableData: function (e) { self._serveData(e, 'table'); },
```

Внатрешниот `.catch` (`:840-849`) ги фаќа сите грешки и испраќа
`ln-data-coordinator:error`, па ништо не се губи тивко. Но враќањето на промисот сугерира
договор што не постои — три од петте „serve" функции го прават истото.

---

### 🔵 P3 — `refreshMapper()` се повикува девет пати, осум на топли патеки

`:101` (конструктор), `:243`, `:263`, `:282`, `:298` (четирите fan-out), `:354` (sync),
`:406` (queue send), `:479` (connector fetched), `:1077` (промена на атрибут).

Секој повик прави `querySelector('script[data-ln-mapper]')` низ поддрвото (DC3), еден
`getDataMapper` пребарок, и пресоздава два function објекта за `ingress`/`egress`
(`:190-195`). Мапер регистарот е глобален и се менува само преку
`registerDataMapper` — значи освежувањето на `:1077` (кога `data-ln-data-mapper` ќе се
смени) е доволно.

---

### 🔵 P4 — `composeQuery` ги гази трите полиња дури и кога store-от ги нема

`data-read-policy.js:25-32`:

```js
if (storeQuery) {
	q.filters = storeQuery.filters;
	q.search  = storeQuery.search;
	q.sort    = storeQuery.sort;
}
```

Ако `storeQuery` постои но некое од трите полиња е `undefined`, соодветното поле на
погледот се брише. Тоа е согласно со политиката („изворот го поседува упитот", `:810-812`),
и е свесно — само не разликува „изворот вели празно" од „изворот не кажал ништо".

---

### 🔵 P5 — `isConflict` се пресметува, а важи само во една гранка

`:648` — `const isConflict = status === 409 || status === 412;` се користи само на `:673`,
и тоа спарено со `op === 'update'`. Значи 409 на `create` паѓа во `:679` (брише локален
temp + `rejected` toast), а 409 на `delete` во `:682` (остава локално). Обете се бранливи
одлуки, но конфликтот престанува да биде категорија штом не е `update` — додека другите
две (`isAuth`, `isTransient`) се категории низ сите операции.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-data-coordinator` | `:6`, `:87` | ✅ `:101` | ✅ `author` |
| `data-ln-data-coordinator-dict` | `:97` | ✅ `:405` | ✅ (`null`) |
| `data-ln-data-coordinator-stale` / `-no-autosync` | `:114-127` | ✅ `:101` | ✅ `author` |
| `data-ln-data-store` / `-stale` / `-no-autosync` | `:201`, `:114-127` | ✅ | ✅ `author` (туѓи, читани) |
| `data-ln-api-connector` / `-couchdb-connector` / `-api-queue` | `:202`, `:203` | ✅ `:78-100` | ✅ `author` (туѓи, читани) |
| `data-ln-websocket-connector` | `:202` — **компонентата не постои** | ❌ | ⚠️ `author` (DC2) |
| `data-ln-rest-connector` | ❌ **нула појави** | ❌ | ⚠️ **`sources: []`** (DC2) |
| `data-ln-data-mapper` | `:179`, `:1076` | ✅ `:111` | ✅ `author` |
| `data-ln-mapper` | `:173` — **оневозможен** | ⚠️ неозначен како мртов (DC3) | ⚠️ `author` |
| `data-ln-form-scope` | `:9` | ✅ `:151` | ✅ `author` |
| `data-ln-table-source` / `-list-source` / `-chart-source` | `:791-792` | ✅ `:505` | ✅ `author` |
| `data-ln-options` / `-stat` / `-stat-filter` | `:854`, `:880` | ✅ `:505` | ✅ `author` |
| `data-ln-table-window` / `-list-window` | `:941-942` | ❌ **недокументирани** (DC6) | ✅ (`null`) |
| `data-ln-table-filter-options` | ❌ укинат | ⚠️ `:529` — цела секција „removed" (DC7) | ❌ |
| `lnCoordinator` алијас | `:8`, `:90`, `:1067` | ⚠️ `:482` „JS API" | n/a (DC4) |
| `storeEl.lnStore` | `:209` — **никој не го поставува** | ❌ | n/a (DC1) |
| `connectorEl.lnApiConnector/lnCouchDbConnector` | `:210` — недостижни | ❌ | n/a (DC1) |
| `ln-data-coordinator:error` | `:842` | ✅ `:380` | n/a |
| `ln-data-coordinator:destroyed` | ❌ не постои | ❌ | n/a |
| Internals извор | `src/ln-data-coordinator.js` | ✅ `:503` — **точен** | n/a |

---

## Затечена состојба

### Пренесеното прашање за „connector interface" — одговорено

Прашањето беше дали треба да постои заеднички интерфејс наспроти трите расцепи
(idempotency заглавје, потписи на методи, облик на грешка).

**Затечено: интерфејсот веќе постои и се вика `lnConnector`.** Обата конектора го
поставуваат во конструкторот и го бришат во `destroy()`:

```
ln-api-connector.js:7,28,427        DOM_ALIAS = 'lnConnector'
ln-couchdb-connector.js:6,25,376    DOM_ALIAS = 'lnConnector'
```

Координаторот го чита прв (`:210`), па двете резервни имиња се мртви (DC1). А
`CONNECTOR_RESPONSE_NAMESPACES` (`:81`) го прави истото за настаните — единствената
жица што ги обединува двата конектора е таа низа од два стринга, со коментар
*„generalized so writes work whether the paired connector is ln-api-connector or
ln-couchdb-connector"*.

Значи одговорот не е „треба да се создаде интерфејс" туку **„интерфејсот постои во кодот
и не постои во документацијата"**. Ниту едно README не го именува `lnConnector` како
договорот што трета страна би го имплементирала, и ниту едно не кажува кои методи мора да
ги носи. Расцепите (различно idempotency заглавје — `X-Idempotency-Key` наспроти
`Idempotency-Key`) преживуваат токму затоа. **Ставката се затвора со препорака за
пресуда, не како наод.**

### Пренесеното прашање за `defaultPrevented` — одговорено целосно

Кој го чита `defaultPrevented` по `ln-search:change` / `ln-filter:change` /
`ln-sort:change`:

| компонента | улога |
|---|---|
| `ln-search.js:131` | го чита од **сопственото** испраќање; ако е откажан, прескокнува сопствен DOM hide/show |
| `ln-filter.js:229/232/261` | го собира од испраќањето кон целта; `:261` `if (defaultPrevented) return;` пред сопственото криење |
| `ln-sort.js:209-211` | исто — го прескокнува `_defaultSort` |
| `ln-table`, `ln-list`, `ln-data-store` | го **повикуваат** `preventDefault()`, безусловно, на првата линија од слушачот |
| **`ln-data-coordinator`** | **не слуша ниту еден од трите настани.** Чита `defaultPrevented` точно еднаш — `:449`, на нативен `submit`, за портата на `ln-validate` |

Значи договорот е: **`preventDefault()` врз настан за упит значи „јас го преземам
одговорот; не прави свој DOM fallback"** — еднонасочен сигнал од консументот кон
примитивот, никогаш кон координатор. Работи конзистентно во сите шест компоненти.
Запишан е — никаде. **Ставката се затвора.**

### `parseSearchFields` — потврдено мртво и од оваа страна

`normalizeDataQuery` (`data-read-policy.js:1-11`) зема `sort, filters, search, offset,
limit, queryGen` — **нема `fields`**. Значи `detail.fields` што `ln-search:124` го
пресметува и го проследува нема читател ни овде. Пописот е целосен: нула читатели во
целата библиотека. **Ставката се затвора.**

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:86`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ |
| SYS-3 (Internals → компајлиран bundle) | ✅ **точен** — `:503` покажува на `src/` |
| SYS-7 (`.hidden` / `.sr-only`) | ✅ не пишува класи |
| SYS-9 (`destroy()` остава состојба) | ✅ **единствената компонента без ниту еден остаток** |
| SYS-11 (BEM `__`) | ✅ нула |
| SYS-13 (зашиен кориснички текст) | ✅ — сите пораки одат преку `_toastFromDict` / `_toastFromMessage` |
| SYS-22 (README без Internals) | ✅ има (`:501`) |
| SYS-24 (state класа без CSS) | ✅ нула класи |
| SYS-25 (`destroy()` не го гаси windowed) | ✅ **контрапримерот** — овој фајл го прави точно |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| модел фајлови | ✅ **два, обата чисти и целосно усвоени** (6/6 извози живи) |

### Трите координатора досега

| | `ln-table-coordinator` | `ln-ui-coordinator` | `ln-data-coordinator` |
|---|---|---|---|
| слушачи на `self.dom` | 2 | 0 | **~24** |
| на `document`/`window` | 1 | 10 | 6 + 3 синглтон |
| `destroy()` | ги трга обата | празни речник | **трга сè, затвора промиси, демонтира синглтон** |
| модел фајлови | 0 | 0 | **2** |
| наоди 🔴 | 0 | 0 | 0 |

Трите носат иста ознака во името и се во ист слој, но се три различни архитектури.

---

## Отворени прашања за тебе

1. **DC1/DC4 — `lnConnector` се прогласува за договор?** Ако да, треба запишано: кои
   методи и кои настани мора да ги носи имплементацијата, и тогаш `lnApiConnector` /
   `lnCouchDbConnector` / `lnStore` резервните читања се бришат. Ако не — тогаш трите
   расцепи (idempotency заглавје, потписи, облик на грешка) остануваат по дизајн.

2. **DC2 — `data-ln-websocket-connector` и `data-ln-rest-connector`.** Планирани или
   напуштени? `docs/architecture/data-store-architecture.md` ги документира со целосни
   примери за двата. Ако се напуштени, се бришат од селекторот (`:202`), од схемата и од
   тој документ; ако не, недостига `lnWebsocketConnector` во читањето на `:210`.

3. **DC3 — `data-ln-mapper`.** Ако е оневозможен трајно, дали проверката воопшто треба да
   остане — а ако да, зошто на секој `refreshMapper()` наместо еднаш при конструкција?

4. **DC5 — двата `console.error`.** Истиот фајл користи `console.warn` четирипати.
   Портата закрпува само `warn`. Свесна разлика (грешките треба да бегаат), или превид?

5. **Трите `sources: []` записи** (`ln-table`, `ln-ui-coordinator`, овде). Треба ли
   `sync:ln-schemas:check` да паѓа на празни извори, наместо да ги носи низ CI портата?

6. **Пресуда за `lnCoordinator`** (`:90`) — алијас што никој не го чита. Се брише, или
   е дел од јавното API што README:482 го најавува?

---

**Наоди:** 🔴 0 · 🟠 4 · 🟡 3 · 🔵 5
