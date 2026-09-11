# Аудит — ln-api-connector

2026-09-11 · Опсег: `src/ln-api-connector.js` (454), `src/connector-core.js` (97), `README.md` (281), schema · Итерација 34/50

## Вердикт

Транспортниот слој со најчиста форма на грешка во библиотеката — една функција
произведува `err.status` + `err.data` за сите пет глагола, и `ln-ajax`-овото README
изречно го именува како образецот што нов код треба да го следи. Но три работи што
README-то ги изнесува како договор не постојат во изворот: заглавјето `X-LN-Response`,
името на idempotency заглавјето, и стратегијата на debounce.

## Што е добро

**Една форма на грешка за сите пет глагола.** `_resolve` (`:13-21`):

```js
function _resolve(res) {
	if (res.ok) return res.status === 204 ? null : res.json();
	return res.json().catch(() => null).then(body => {
		const err = new Error('HTTP ' + res.status + ': ' + res.statusText);
		err.status = res.status;
		err.data = body;
		throw err;
	});
}
```

Секој non-2xx одговор го носи парсираното тело — значи валидациски пораки од 422
преживуваат исто како конфликт од 409. `ln-ajax/README.md:160` го цитира однадвор:

> `ln-api-connector`, the data-layer transport tier, emits a single unified error
> shape — `{ action, error, status, data }` — and is **the pattern to prefer for new
> data-flow code**.

Компонента што друга компонента ја посочува како еталон.

**Секој ракувач го филтрира `AbortError` пред да испрати грешка** — `:221`, `:253`,
`:298`, `:322`, `:347`, `:371`. Шест места, ниту едно испуштено. Тоа е точно
едната линија што `ln-ajax` (AJ2) ја нема, и разликата е видлива: тука прекинатото
барање е тивко, таму станува `ln-ajax:error` со `status: 0`.

**Идентитетска проверка при чистење на `_inflight`** (`:127`, `:153`) — истата
дисциплина како `ln-http:103`, и од истата причина.

**`destroy()` е целосен.** Ги прекинува сите контролери за читање, ги брише сите
тајмери, ги симнува **сите осум** слушачи, испраќа `:destroyed` и ги брише обете
својства (`:394-428`). Ниту еден испуштен слушач.

**Семантиката на `url` во `update()` е образложена на местото на одлуката** (`:175-177`):

```js
// An explicit `url` is the COMPLETE resource URL — it already carries the
// id (e.g. the form's resolved action `/documents/42`). Do NOT re-append
// id, symmetric with create(). Only the path fallback needs id appended.
```

И README:30-45 го повторува со истиот аргумент. Двете се точни наспроти `:178`.

**`queryGen` кружи само низ клиентот.** `buildQueryParams` (`connector-core.js:36-71`)
не го испраќа на серверот, а `_doQuery` (`:248`) го враќа во `fetched` detail-от.
Точно однесување за генерациски бројач — и единствената компонента што прави таква
разлика меѓу „параметар на барањето" и „придружна ознака".

**`connector-core.js` е чист и тестиран.** Пет извоза; четири увезени од компонентата
(`:2`), а `DEFAULT_PARAM_KEYS` го консумира `tests/network-layer.test.js:17,78`.
Нула `window`/`document`.

**Схемата е целосна** — десет атрибута, сите десет прочитани во `refreshConfig`
(`:44-64`) и сите девет променливи наведени во `extraAttributes` (`:441-451`).

## Наоди

### 🔴 AC1 — `X-LN-Response: data` не постои во изворот

**Каде:** `README.md:9-21` наспроти `:76-88`

README-то му дава сопствена секција од прво ниво, со катанец:

> ## 🔒 Forced `X-LN-Response: data` Header
>
> Every request (`fetchDelta`, `create`, `update`, `delete`, `bulkDelete`) sends
> `X-LN-Response: data` … This header is **forced** — it rides on all five verbs via a
> single internal helper and **cannot be removed or overridden** by consumer-supplied
> headers. The backend uses it to select a JSON "data" response mode; **it doubles as
> a CSRF guard.**

Единствениот внатрешен помошник е `_reqHeaders` (`:76-88`), и тој поставува три
работи:

```js
if (!headers['Accept'] && !headers['accept']) headers['Accept'] = 'application/json';
if (!headers['Content-Type'] && !headers['content-type']) headers['Content-Type'] = 'application/json';
if (idempotencyKey) headers['X-Idempotency-Key'] = idempotencyKey;
```

Grep за `X-LN-Response` низ `components/*/src/**`: **едно совпаѓање**, и тоа е
насловот на секцијата во кодот (`:74`):

```js
// ─── Request Headers (forces X-LN-Response) ─────────────
```

Коментарот го именува истото фантомско заглавје. Значи и документот и кодот го
опишуваат — само никој не го испраќа.

Двете последици не се еднакви по тежина:

- **Режимот на одговор.** Бекенд напишан по README-то ќе го бара заглавјето за да
  избере „data" формат; кога не стигне, враќа друг облик, и `unwrapEnvelope`
  (`connector-core.js:93-97`) молчешкум го третира целото тело како запис.
- **Безбедносното тврдење.** *„it doubles as a CSRF guard"* — заштитата што README-то
  ја ветува не постои. Ниту едно од другите две заглавја (`Accept`,
  `Content-Type: application/json`) не е custom header во смисла што би предизвикал
  preflight за едноставно вкрстено барање, па не носи CSRF вредност.

Двете тврдења се приложени на **сите пет** глагола, вклучувајќи ги трите мутациски.

### 🔴 AC2 — Двата транспорта праќаат различно idempotency заглавје, а README-то го документира она на другиот

**Каде:** `:85` наспроти `ln-couchdb-connector/src/ln-couchdb-connector.js:70` и `README.md:17-19`

```js
// ln-api-connector:85
headers['X-Idempotency-Key'] = idempotencyKey;
```

```js
// ln-couchdb-connector:70
if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
```

README-то на `ln-api-connector` (`:17-19`):

> The connector forwards it as **`Idempotency-Key`**; direct/non-queued calls omit it.
> Servers should persist the first result for a key so **lease recovery can safely
> retry a request after a client crash**.

Документираното име е она на CouchDB конекторот. Сервер конфигуриран по ова README не
го гледа клучот што `ln-api-connector` го праќа — значи **повторениот обид по пад на
клиентот се извршува како ново барање**. За `create` тоа е дупликат запис.

Двата конектора се наменски заменливи — `ln-data-coordinator:210` ги бара под ист
псевдоним (AC5) — па преминот од еден на друг тивко го менува името на заглавјето и со
тоа целата idempotency гаранција.

`IETF draft-ietf-httpapi-idempotency-key-header` го стандардизира името
`Idempotency-Key` без префикс; `X-` формата е застарената конвенција. Која од двете е
точната е твоја одлука — наодот е дека постојат две.

### 🔴 AC3 — Опишаната debounce стратегија не е имплементираната

**Каде:** `README.md:121-129` и коментарот на `:31` наспроти `:264-278`

README-то дава име на стратегијата и три тврдења:

> Remote query requests … are debounced per key using a
> **leading-edge-then-coalesce** strategy:
> - The **first** query for an idle key fires **immediately** (no waiting).
> - Rapid follow-up queries for the same key within the window are coalesced …
> - An isolated query (e.g. **initial page load**, a single filter change) is **always
>   instant**.

Изворот:

```js
if (delay === 0) { _doQuery(detail, queryParams, targetEl); return; }

if (self._queryTimers.has(key)) {
	clearTimeout(self._queryTimers.get(key));
}

const timer = setTimeout(function () {
	self._queryTimers.delete(key);
	_doQuery(detail, queryParams, targetEl);
}, delay);

self._queryTimers.set(key, timer);
```

Тоа е **чист trailing-edge** debounce. Нема гранка за водечки раб. Првиот упит за
мирен клуч чека полни 300 ms; изолираниот упит — точно оној што README-то го нарекува
*„always instant"* — е оној што чека најдолго во однос на својата вредност. Секое
првично вчитување на табела низ конектор има 300 ms мртво време.

Третиот сведок е коментарот на `:31`:

```js
this._queryTimers = new Map(); // per-key: { timer, pendingDetail, pendingParams, pendingTarget }
```

Мапата чува **гол timer id** (`:278`), не објект. Но опишаната структура е токму онаа
што leading-edge-then-coalesce ја бара — мора да ги задржиш аргументите на
одложениот повик додека водечкиот е во лет. Значи коментарот, README-то и кодот се
три записи од иста напуштена имплементација: документот и коментарот го опишуваат
дизајнот, кодот е поедноставената верзија.

`destroy()` (`:406-408`) го третира како timer id (`clearTimeout(timer)`) — усогласен
со кодот, неусогласен со коментарот три реда над него.

### 🟠 AC4 — Мутациите немаат патека за прекин, а договорот не го ограничува тоа

**Каде:** `:159-207` наспроти `:92-100`, `:145`

`fetchDelta` и `query` создаваат `AbortController`, го запишуваат во `_inflight` и го
предаваат како `signal` (`:116-123`, `:142-149`). `create`, `update`, `delete` и
`bulkDelete` не прават ниту едно од тоа — нема контролер, нема `signal`, нема запис во
мапата.

Значи:

| механизам | читања | мутации |
|---|---|---|
| `connector.cancel(key)` (`:92`) | ✅ | ❌ невидливи |
| `ln-api-connector:request-cancel` (`:280`) | ✅ | ❌ |
| `destroy()` (`:398-403`) | ✅ прекинува | ❌ продолжуваат |

`README.md:145` го опишува `request-cancel` како *„Aborts active in-flight request for
target element or key"* — без ограничување на читања.

Практичната последица е кај `destroy()`: координатор што ја симнува страницата додека
`create` е во лет го остава барањето да заврши, а неговиот `.then` (`:288-296`)
испраќа `ln-api-connector:created` на **откачен** јазол. Записот е создаден на
серверот и никој не дознава.

Дополнително: четирите `err.name === 'AbortError'` проверки во мутациските ракувачи
(`:298`, `:322`, `:347`, `:371`) немаат како да се активираат преку сопствениот API на
компонентата. Единствената достижна патека е `window.lnHttp.cancelAll()`
(`ln-http.js:208-213`), кој ги прекинува **сите** записи во својот `_inflight`,
вклучувајќи POST/PUT/DELETE. Значи проверките се живи, но само преку друга компонента.

### 🟠 AC5 — Псевдонимот `lnConnector` е спротивен на пресудата за псевдоними

**Каде:** `:7`, `:28`, `:427`

```js
const DOM_ALIAS = 'lnConnector';
…
dom[DOM_ALIAS] = this; // Set alias for compatibility
```

`ln-couchdb-connector:6` го прави истото со истиот псевдоним. А
`ln-data-coordinator:210` пробува три имиња по ред:

```js
connector: connectorEl ? (connectorEl.lnConnector || connectorEl.lnApiConnector || connectorEl.lnCouchDbConnector) : null
```

Пресудата за псевдоними (07-22/07-23) вели: **„alias никогаш"** — префиксот на
атрибутот и на настанот е полното име на компонентата. Тогаш `data-ln-store-*` беа
избришани и `ln-store:*` преименуван во `ln-data-store:*` по истата логика.

Разликата овде е дека псевдонимот служи вистинска потреба: двата конектора се
заменливи транспорти и координаторот му треба **едно** име. Тоа е полиморфизам без
декларирана апстракција — библиотеката нема поим „connector interface", па улогата ја
презема заедничко име на својство.

Два дополнителни симптоми дека уредувањето е обратно:

- `docs/architecture/data-store-architecture.md:276,293,318` го користи **исклучиво**
  `transportEl.lnConnector.*` како канонски API. Значи псевдонимот е документираното
  име, а вистинските се резервните.
- `||` синџирот во координаторот е мртов на двете гранки по првата — обата конектора
  го поставуваат `lnConnector`, па `lnApiConnector` и `lnCouchDbConnector` никогаш не
  се читаат.

Плус `// Set alias for compatibility` (`:28`) — „compatibility" со што не е кажано,
што е временско скеле во кодот од истиот вид што доктрината за доковите го забранува.

### 🟠 AC6 — Rate-limitingот е во транспортот, а влезниот слој нема ниту еден

**Каде:** `:63-64`, `:264-278`

Пресудата од 08-20 (`fetchDebounce` тргнат од window-index) го именува слојот:
**debounce/throttle кај search input и scroll handler, никогаш во структура на
податоци/транспорт.**

Тука debounce-от е на конекторот, со стандардни 300 ms за **секој** `request-query`,
без оглед од каде доаѓа — филтер, сортирање, пагинација, или пребарување.

Grep низ `components/ln-search/src/*.js` за `debounce` или `setTimeout`: **нула**.
Значи влезниот слој — местото каде пресудата го сместува ограничувањето — го нема, а
транспортниот го има за сите повикувачи.

Тоа не е само прекршување на слојот. Тоа значи дека сортирање по колона и промена на
страница, кои се дискретни настани без flood, плаќаат иста цена како куцање.
Заедно со AC3 (нема водечки раб), секое од нив чека 300 ms.

`data-ln-api-connector-query-debounce` нема ниту еден консумент во репото — grep низ
`demo/**/src`, `spa-starter/**` и `components/*/src` враќа само дефиницијата и
генерираниот манифест на `ln-debug`. Значи стандардните 300 ms се она што сите
добиваат.

### 🟡 AC7 — Невалиден `data-ln-api-headers` логира негејтирано и под погрешно име

**Каде:** `:48` наспроти `ln-core/helpers.js:980-983`

```js
this.headers = parseHeaders(this.rawHeaders);
```

```js
export function parseHeaders(str, componentName = 'ln-core') {
	try { return str ? JSON.parse(str) : {}; }
	catch (e) { return console.error(`[${componentName}] Invalid headers JSON:`, e), {}; }
}
```

Две работи:

- **`console.error`, не `console.warn`.** Гејтот во `helpers.js:2-3` го закрпува само
  `console.warn`, па пораката се печати во продукција без `data-ln-debug`. SYS-8.
- **`componentName` не се проследува.** Функцијата го прима токму за да ја именува
  компонентата; `ln-api-connector` вика со еден аргумент, па пораката гласи
  `[ln-core] Invalid headers JSON` за грешка во `data-ln-api-headers` на конекторот.

И тивката последица: враќа `{}`, значи конектор со скршен JSON во заглавјата молчешкум
праќа барања **без** авторизациските заглавја што авторот ги напишал.

### 🟡 AC8 — `config-changed` се испраќа при конструкција и по атрибут, не по промена

**Каде:** `:32`, `:66-71`, `:432-436`

`refreshConfig()` секогаш завршува со `dispatch(… 'ln-api-connector:config-changed' …)`,
а конструкторот ја вика (`:32`). Значи првиот настан за „променета конфигурација"
пристига кога ништо не е променето — истиот образец како SYS-10 кај progress
компонентите.

Плус `onAttributeChange` (`:452`) е врзан за сите девет атрибути и повикува целосен
`refreshConfig`. Координатор што ги поставува `base-url`, `path` и трите param клуча
во едно поминување произведува **пет** `config-changed` настана, од кои првите четири
опишуваат полу-применета конфигурација.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `this.credentials = 'same-origin'` (`:46`) е зашиено и е веќе стандардната вредност на `fetch` — значи линијата не менува ништо, а изгледа како конфигурација. Компонентата чиј насловен атрибут е `data-ln-api-base-url` (значи вкрстено потекло) не може да испрати колачиња кон друг домен, и README-то не го спомнува зборот `credentials` ниту еднаш. | `:46` |
| P2 | Филтрите се спојуваат со запирка (`connector-core.js:65`): `searchParams.append(key, vals.join(','))`. Вредност што содржи запирка е неразличива од две вредности на серверот. | `connector-core.js:65` |
| P3 | `res.status === 204 ? null : res.json()` (`:14`) — одговор `200` со празно тело го одбива `res.json()`, а грешката нема `.status`, па ракувачот испраќа `status: 0` (`:225` и слични). Празен 200 станува неразличив од мрежен отказ. | `:14` |
| P4 | `this.queryDebounce = qd !== null ? +qd : 300;` (`:64`) — гол атрибут дава `+''` = `0`, што е точно „исклучено" ✅. Но нечитлива вредност (`"300ms"`) дава `NaN`, `delay === 0` е неточно, и `setTimeout(fn, NaN)` се однесува како `0` — значи debounce-от се гаси тивко, по друг пат од документираниот. | `:64` |
| P5 | `update(id, payload, expectedVersion, url, idempotencyKey)` — пет позициски параметри, од кои три опционални во низа. Повик што сака само `idempotencyKey` мора да напише три `null`-а. `create` и `delete` имаат по три. | `:159`, `:170`, `:188` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-api-connector` | `:5` | ✅ | ✅ |
| `data-ln-api-base-url` / `-path` | `:44-45` | ✅ | ✅ |
| `data-ln-api-headers` | `:47` | ✅ | ✅ |
| `data-ln-api-param-*` (5) | `:51-60` | ✅ сите пет | ✅ |
| `data-ln-api-connector-query-debounce` | `:63` | ✅ (но види AC3/AC6) | ✅ |
| 8 `request-*` настани | `:384-391` | ✅ сите | н/п |
| `:fetched` / `:created` / `:updated` / `:deleted` / `:bulk-deleted` / `:error` / `:destroyed` | сите испратени | ✅ | н/п |
| `ln-api-connector:config-changed` | `:66` | ⚠️ во табелата, без забелешка за init | н/п |
| единствена форма на грешка `{status, data}` | `:15-20` | ✅ со сопствена секција | н/п |
| `update(…, url)` = целосен URL | `:178` | ✅ со образложение | н/п |
| `.lnApiConnector` / `.lnConnector` | `:27-28` | ✅ обете наведени | н/п |
| **`X-LN-Response: data`** | **не се испраќа** | ❌ цела секција тврди „forced" + CSRF | н/п |
| **idempotency заглавје** | `X-Idempotency-Key` | ❌ тврди `Idempotency-Key` | н/п |
| **debounce стратегија** | trailing-edge | ❌ тврди leading-edge-then-coalesce | н/п |
| `_queryTimers` содржина | гол timer id | ❌ коментар `:31` тврди објект од 4 полиња | н/п |
| прекин на мутации | не постои | ❌ `:145` не го ограничува на читања | н/п |
| `credentials` | зашиено `same-origin` | ❌ неспомнато | н/п |

## Затечена состојба

**Три компоненти сега бараат `lnConnector`, `lnApiConnector` или
`lnCouchDbConnector`.** Полната интеракција — вклучувајќи го прашањето дали
координаторот треба да ја знае идентитетот на транспортот воопшто — се затвора во
**#46 ln-data-coordinator**.

**`unwrapEnvelope` го дефинира договорот `{ content, message }`** и обата конектора го
делат (`connector-core.js:93-97`; `ln-couchdb-connector` има сопствена копија
`_unwrapEnvelope`). Тоа е втор случај каде два транспорта имплементираат иста
семантика одвоено — првиот е idempotency заглавјето (AC2). Целосната споредба оди во
**#36 ln-couchdb-connector**.

**`tests/network-layer.test.js` го покрива `connector-core.js`** — една од петте
компоненти досега со жив тест над сопствениот модел.

Конзолен излез: нула директни повици; еден индиректен преку `parseHeaders`
(`console.error`, негејтиран — AC7). Inline стил: нула. `createElement`: нула. Зашиен
кориснички текст: нула.
