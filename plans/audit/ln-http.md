# Аудит — ln-http

2026-09-11 · Опсег: `src/ln-http.js` (233), `src/http-core.js` (51), `README.md` (129), schema · Итерација 32/50

## Вердикт

README-от е најтемелниот во репото — единствениот со секција **Risk surface**, и
единствениот што ја објаснува одбиената функција (зошто PUT/DELETE намерно **не** се
де-дуплираат). Токму тоа образложение го прави главниот наод остар: правилото го штити
мутирачкото барање, а не го штити **читањето од кое таа мутација зависи** — и во
`ln-couchdb-connector` тоа читање е GET кон истиот URL, значи де-дуплирано.

## Што е добро

**Единствената секција „Risk surface" во библиотеката.** `README.md:127-129`:

> Wrapping `window.fetch` is a global mutation — third-party scripts (analytics, A/B
> SDKs) get wrapped too … A `fetch` polyfill installed *after* ln-http loads will
> overwrite the wrapper and bypass it; one installed before is captured as `_origFetch`
> and composes fine.

Компонента што прави глобална мутација на `window`, и го пишува тоа со зборови,
вклучувајќи ги обата редоследа на вчитување. Ниту еден друг README не именува сопствена
опасност.

**Одбиената функција е образложена.** `README.md:107`:

> **GET/HEAD only** — DELETE/PUT are RFC-idempotent but dropping an in-flight one
> because a newer one landed silently discards user intent, so auto-dedup is
> deliberately conservative

Тоа е ретка форма: документиран **не**-избор, со причината. `isIdempotentMethod`
(`http-core.js:48-51`) го спроведува буквално.

**Идентитетската проверка при чистење, на трите места каде треба.** `:103`, `:153`,
`:164`:

```js
if (_inflight.get(key) === controller) _inflight.delete(key);
```

Без неа, доцното разрешување на **прекинатото** барање би го избришало записот на
неговиот наследник, и следниот повик кон истиот URL не би нашол што да прекине.
README:107 ја именува како *„an identity check that prevents a newer same-key call's
fresher entry from being wiped by an older call's cleanup"*.

**Композицијата со корисничкиот `AbortSignal` не протекува.** `{ once: true }` при
врзувањето (`:89`, `:136`) **и** изречен `removeEventListener` во `.finally` /
`.then` / `.catch` (`:100`, `:150`, `:161`). Двоен појас; ниту еден друг слушач во
библиотеката не се симнува со таква грижа.

**Редоследот во `.catch` е спротивен од интуитивниот, и тоа е точно.** `:164-165`:
чистењето со идентитетска проверка се извршува **пред** раниот излез на `AbortError`.
README:117 објаснува зошто — самата идентитетска проверка ја разликува „заменето" од
„навистина падна", па нема потреба од втора гранка.

**`_origFetch = window.fetch.bind(window)`** (`:59`). Без `bind`, деструктурирано
`const { fetch } = window` би фрлило `Illegal invocation`.

**`_wrappedFetch.toString` е пренапишан** (`:107`) — во конзолата функцијата се
претставува како `function fetch() { [ln-http wrapped] }` наместо да го покаже
телото. Мала работа што го штеди следниот дебаг.

**`e.detail.body !== undefined`** (`:143`) — строга проверка, па намерно лажни тела
(`0`, `''`, `false`) поминуваат. README:113 го именува.

**Празна схема, и тоа е точно.** `"attributes": {}` — компонентата нема ниту еден
`data-ln-*`. Единствената празна схема во репото, и е чесна.

**`http-core.js` е чист и цел.** Четири извоза, сите четири увезени (`:54`) и
повикани (`:68`, `:69`, `:70`, `:73`). Нула `window`/`document`.

## Наоди

### 🔴 H1 — Де-дупликацијата го убива претходното читање од кое зависи запишувањето

**Каде:** `:73-76` во спрега со `ln-couchdb-connector/src/ln-couchdb-connector.js:135` и `:179`

Path A го гради клучот само од метод и URL (`http-core.js:39-41`) и за GET го
**прекинува претходникот**:

```js
if (isIdempotentMethod(method) && _inflight.has(key)) {
	_inflight.get(key).abort();
	_inflight.delete(key);
}
```

`ln-couchdb-connector` има read-before-write образец на две места. `_rawUpdate`
(`:130-137`):

```js
const getRevPromise = rev ? Promise.resolve(rev) :
	window.fetch(buildUrl(self.url, self.db, null, id), { method: 'GET', … })
		.then(res => { … return res.json().then(d => d._rev); });
```

и `_rawDelete` (`:177-183`) — **идентичен URL, идентичен метод**. Значи обата даваат
ист Path A клуч: `"GET <couch>/<db>/<id>"`.

Последица кога две мутации без `_rev` се преклопат врз истиот документ:

1. Прв `update(id, payload)` → GET за `_rev` тргнува, се запишува во `_inflight`.
2. Втор `update(id, payload)` (двоен клик на Save, или два координатора) → истиот
   клуч → **првиот GET се прекинува**.
3. Ветувањето на првиот `_rawUpdate` се одбива со `AbortError` **пред неговиот PUT
   воопшто да се состави**.
4. Првото запишување е тивко изгубено.

Истото важи и за update + delete врз ист документ, зашто двата патишта го користат
истиот URL за читање на ревизијата.

**Тоа е точно сценариото што README:107 го одбива да го дозволи за PUT:**

> dropping an in-flight one because a newer one landed **silently discards user
> intent**, so auto-dedup is deliberately conservative

Резервираноста е применета врз мутацијата, но не и врз нејзиниот предуслов. GET-от
на `:135` не е независно читање — тој е првиот чекор од едно запишување, и го носи
истиот кориснички налог.

Ироничноста е во првата реченица на README-то: компонентата постои за да спречи
*„duplicate submission side-effects"*, а овде создава спротивен ефект —
**испуштено** запишување.

**Достижност:** бара (а) `update()` / `delete()` без `_rev` во payload-от — што е
документираниот пат за погодност (*„automatic revision fetching if rev is missing"*,
`ln-couchdb-connector.js:128`), и (б) две такви повици да се преклопат врз ист `id`.
Двоен клик на Save е обичниот случај.

**Проверени и симнати од обвинение:** `ln-include` (`:32-46`) држи сопствен
`_fetchCache` по URL, па два исти include-а делат едно ветување — нема втор fetch за
да прекине. `ln-icon._load` (`:93`) излегува на `loaded.has(href) || pending.has(href)`
пред да повика fetch. Обете компоненти се заштитени од сопствената кеш логика, не од
ln-http.

### 🟠 H2 — `cancelAll()` не ги гледа XHR барањата, а договорот тврди дека ги гледа

**Каде:** `:208-213` наспроти `README.md:65`

> `cancelAll()` | `() => void` | Aborts **all active in-flight requests** (both paths).

„Both paths" е точно; „all active in-flight requests" не е. `ln-http` ја обвиткува
само `window.fetch`. `ln-upload` го користи `XMLHttpRequest` (`ln-upload.js:327`) —
нужно, зашто `fetch` нема прогрес за качување — па качувањата се целосно надвор од
двете мапи.

Значи страница што качува фајл од 200 MB и вика `lnHttp.cancelAll()` (или испраќа
`ln-http:cancel` со `all: true`) добива порака дека сè е прекинато, а качувањето
продолжува. `window.lnHttp.inflight` (`:214-224`) исто така не го прикажува — а
README:66 го опишува како *„snapshot of active requests"*.

Секцијата **Risk surface** (`:127-129`) го покрива случајот со туѓ `fetch` polyfill и
не го спомнува XHR-от во сопствената библиотека.

### 🟠 H3 — Пописот на „parasitic" консументи е погрешен во двата правца

**Каде:** `README.md:103`

> Other library components (`ln-form`, `ln-ajax`, `ln-store`, `ln-table`, `ln-icon`)
> call `fetch()` directly with no reference to ln-http.

Grep низ `components/*/src/**` за `fetch(` и `XMLHttpRequest`:

| README тврди | реалност |
|---|---|
| `ln-form` | ❌ нула мрежни повици — тоа е **насловниот принцип** на компонентата (`data-flow.md §4.5`, потврдено во итерација 20) |
| `ln-ajax` | ✅ `:146` |
| `ln-store` | ❌ не постои компонента со тоа име — преименувана во `ln-data-store` на 07-23, и ниту таа не вика `fetch` директно |
| `ln-table` | ❌ нула мрежни повици |
| `ln-icon` | ✅ `:114` |

Недостасуваат тројцата вистински тешки консументи:

| не е наведен | повици |
|---|---|
| `ln-api-connector` | 6 × `window.fetch` (`:119,145,161,179,190,200`) |
| `ln-couchdb-connector` | 8 × `window.fetch` (`:80,103,135,146,179,187,210,228`) |
| `ln-include` | `:35` |

Тоа не е козметика. Секцијата е насловена **Parasitic design** и е единственото место
каде читателот може да види **што** поминува низ обвивката — значи и единственото
место каде H1 би бил видлив. Списокот што ги изоставува обата connector-а е списокот
што ја крие целата мутациска патека на библиотеката.

(`ln-upload` е четврти пропуст, но со друга причина — тој користи XHR, значи
**не** поминува низ обвивката. Тоа е H2.)

### 🟠 H4 — Path B не проследува ни заглавја ни `credentials`

**Каде:** `:142-143`

```js
const fetchOptions = { method: method, signal: controller.signal };
if (e.detail.body !== undefined) fetchOptions.body = e.detail.body;
```

Договорот (`README.md:51-57`) наведува пет полиња — `url`, `method`, `body`, `key`,
`signal`. Нема `headers`, нема `credentials`, нема `mode`.

Тоа значи дека сопствениот пример на README-то (`:34-42`):

```js
detail: {
  url: '/api/items/reorder',
  method: 'POST',
  body: JSON.stringify({ ids }),
  key: 'items-reorder'
}
```

праќа JSON тело **без `Content-Type: application/json`**. Прелистувачот става
`text/plain;charset=UTF-8` за стринг тело, па Laravel-овиот `$request->json()` не го
парсира, а `X-CSRF-TOKEN` не може да се додаде воопшто — што значи 419 на секој
консумент што има вклучена CSRF заштита.

README:13 го изнесува како принцип:

> **Composition, Not Modification:** … It does not inject headers, manipulate bodies,
> or parse responses.

„Не инјектира" и „не проследува" се две различни работи. Path A не ги допира —
консументот ги дава на `fetch` и обвивката ги копира преку `Object.assign` (`:93`).
Path B нема од каде да ги земе, зашто договорот на настанот не ги прима.

Резултат: Path B е употреблив само за тела без тип и за API-ја без CSRF — што ја
исклучува мутациската патека за која е направен.

### 🟡 H5 — `destroy()` ја враќа `window.fetch` безусловно

**Каде:** `:225-232` наспроти `README.md:129`

```js
destroy: function () {
	…
	window.fetch = _origFetch;
	delete window.lnHttp;
}
```

Risk surface секцијата го покрива **вчитувањето**: polyfill пред ln-http се фаќа како
`_origFetch` ✅, polyfill после ја препишува обвивката ✅ — обете опишани точно.

Не е покриено симнувањето: ако некој друг обвитка `window.fetch` **по** ln-http,
`destroy()` ја враќа сопствената снимка и таа туѓа обвивка исчезнува. README:121 го
ограничува `destroy()` на *„hot-reload/test teardown, not production use"*, што ја
намалува достижноста — но истата асиметрија што Risk surface ја документира за
вчитување постои и за симнување, и таму не е спомената.

### 🟡 H6 — SYS-3

**Каде:** `README.md:99`

> Source: `components/ln-http/ln-http.js`

Компајлиран бандл (10 019 бајти). Рачно пишаниот извор е `src/ln-http.js` (233) плус
`src/http-core.js` (51) — а вториот воопшто не се спомнува во README-то, иако ги носи
сите четири чисти функции што Internals секцијата ги објаснува по име (`extractUrl`,
`extractMethod`, клучот, `isIdempotentMethod`).

Десетто појавување на SYS-3, и прво каде цел изворен фајл останува неименуван.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `cancel(url)` (`:191-201`) споредува со `key.endsWith(' ' + url)` — чисто текстуално. Fetch испратен со релативен URL (`/api/x`) не може да се прекине со апсолутниот (`https://host/api/x`) и обратно; `extractUrl` (`http-core.js:10-17`) не нормализира. Истото важи и за Path A клучот: две GET барања кон `?a=1&b=2` и `?b=2&a=1` се различни клучеви. | `:194`, `http-core.js:39` |
| P2 | Path B нема откажлив `before-` настан. Секоја друга мутациска патека во библиотеката (`ln-upload:before-upload`, `ln-translations:before-add`, `ln-editor:before-change`, `ln-key:before-trigger`) има порта пред дејството; `ln-http:request` оди директно во мрежа. | `:112-172` |
| P3 | `isIdempotentMethod` (`http-core.js:48-51`) го исклучува `OPTIONS`, кој по RFC е безбеден и идемпотентен исто како GET/HEAD. Веројатно намерно — CORS preflight-ите не минуваат низ `fetch` — но коментарот именува само GET/HEAD. | `http-core.js:48` |
| P4 | `_inflight.set(key, controller)` (`:95`) се извршува за **секој** метод, иако само GET/HEAD некогаш се читаат од таа мапа за де-дупликација. POST записите служат само за `cancel(url)` и за `inflight` getter-от — што е корисно, но коментарот на `:58-59` („Tracks in-flight requests in `_inflight`") не ја кажува таа двојна намена. | `:95` |
| P5 | `window.lnHttp.inflight` (`:214-224`) ги враќа Path B записите како `{ key }` без `url` и `method`, иако тие податоци се познати во `_onRequest`. README:66 го документира токму така, значи е свесно — но дебаг приказ што го кажува клучот и не го кажува URL-то е половичен. | `:220-222` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-*` | **нула** | ✅ изречно во Internals | ✅ `{}` |
| `window.fetch` обвивка | `:108` | ✅ Path A, со причина | н/п |
| GET/HEAD де-дупликација | `http-core.js:48` | ✅ + образложение за исклучените | н/п |
| композиција на `AbortSignal` | `:82-91`, `:129-138` | ✅ со `{ once: true }` | н/п |
| идентитетска проверка при чистење | `:103`, `:153`, `:164` | ✅ објаснета | н/п |
| `ln-http:request` (Path B) | `:112`, `:185` | ✅ со табела на `detail` | н/п |
| `ln-http:cancel` | `:174`, `:186` | ✅ | н/п |
| `ln-http:response` / `:error` | `:154`, `:166` | ✅ | н/п |
| `ln-http:before-*` | **не постои** | — | н/п |
| `detail.headers` / `credentials` | **не се проследуваат** | ⚠️ не се ни наведени | н/п |
| `lnHttp.cancel` / `cancelByKey` / `cancelAll` / `inflight` / `destroy` | `:191-232` | ✅ сите пет | н/п |
| `cancelAll()` опфаќа XHR | **не** | ❌ тврди „all active in-flight" | н/п |
| попис на fetch консументи | 5 вистински | ❌ 3 погрешни, 3 испуштени | н/п |
| `src/http-core.js` | 4 чисти функции | ❌ фајлот не се спомнува | н/п |
| Internals извор | `src/ln-http.js` | ❌ покажува на bundle | н/п |
| Risk surface (глобална мутација) | — | ✅ единствена во репото | н/п |

## Затечена состојба

**Трета сервисна компонента без инстанца**, по `ln-fill` и `ln-external-links`. Сите
три користат различен облик на `window[NAME]`: `ln-fill` пишува boolean sentinel,
`ln-external-links` објект со методи, `ln-http` објект со методи **и** getter
(`:214`). Забелешката P1 од аудитот на `ln-fill` останува отворена — `window.lnX`
нема униформен договор, а сега има три различни семантики.

**Двојниот гард е `if (window.lnHttp) return;`** (`:57`), не
`window[DOM_ATTRIBUTE] !== undefined`. Функционално еквивалентен, и тука е
неопходен од друга причина — двојно вчитување би ја обвиткало `fetch` двапати, што
README:121 изречно го именува.

**`ln-http` нема консумент во самата библиотека.** Path A е паразитски по дизајн и
не бара ниту еден. Path B — `ln-http:request` — има точно еден консумент во целото
репо: `demo/admin/src/pages/http.html`, демо страницата на самата компонента. Ниту
една компонента од библиотеката не го користи. Не е наод под
`DOCTRINE.md` §2 („No Speculative Code" се однесува на функции во модел, а ова е
јавен договор кон консументот), но вреди да се знае дека клучното де-дуплирање за
мутации е неизвежбано надвор од демото.

Конзолен излез: нула. Inline стил: нула. `createElement`: нула. Зашиен кориснички
текст: нула.
