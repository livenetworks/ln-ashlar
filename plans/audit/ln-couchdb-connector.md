# Аудит — ln-couchdb-connector

2026-09-11 · Опсег: `src/ln-couchdb-connector.js` (398), `README.md` (177), schema · Итерација 36/50

## Вердикт

Единствената компонента што предупредува за сопствената безбедносна поставеност, со
конкретна препорака што да се направи наместо тоа. Но формата на грешка што ја
произведува нема `status`, а координаторот што ја троши гранка токму по `status` — па
секој 401, 404 и 403 од CouchDB се третира како преодна мрежна грешка и влегува во
целата ретри скала.

## Што е добро

**Компонентата се пријавува себеси.** `:47-52`:

```js
if (this.auth) {
	console.warn('[ln-couchdb-connector] Security Warning: Sensitive authorization
	credentials detected in data-ln-couchdb-auth attribute. … Please use HttpOnly
	session cookies or a Backend Proxy Gateway instead.');
}
if (rawHeaders.toLowerCase().includes('authorization')) { … }
```

Две проверки, обете со конкретна алтернатива, не само со забрана. Ниту една друга
компонента не му кажува на консументот дека начинот на кој ја користи е погрешен.

**Акредитивите не влегуваат во payload-от на настанот.** `:57`:

```js
auth: this.auth ? '[REDACTED]' : '',
```

`config-changed` носи `url`, `db` и заглавја, а лозинката е заменета. Тоа е важно
зашто `ln-debug`-овиот sink ги печати сите `detail` објекти — без оваа линија,
вклучувањето на дебагирање би ги излеало акредитивите во конзолата.

**Нула-триење `_rev`.** `_rawUpdate:134-139` и `_rawDelete:178-183` — кога
повикувачот нема ревизија, конекторот ја носи сам. CouchDB бара `_rev` за секоја
мутација; тоа е точката каде интеграциите обично се распаѓаат, и е решена еднаш, на
две места, со ист облик.

**`If-Match` заедно со `_rev` во телото** (`:145`). CouchDB ја прифаќа ревизијата и од
двете места; праќањето на обете значи дека посредник што го чита само заглавјето исто
детектира конфликт.

**Преводот на промените во нормализираната форма е точен.** `fetchDelta:86-91`:

```js
data: results.filter(r => !r.deleted && r.doc).map(r => Object.assign({}, r.doc, { id: r.doc._id })),
deleted: results.filter(r => r.deleted).map(r => r.id),
synced_at: data.last_seq || since || ''
```

Три различни облици во CouchDB фидот — измени, бришења и секвенца — сведени на
`{ data, deleted, synced_at }`. И `_id` → `id` нормализацијата (`:88`) е точно
конвенцијата што `ln-form` P4 ја означи како незапишана; овде е имплементирана.

**`bulkDelete` со празна низа не праќа барање** (`:208`) — враќа
`{ ok: true, deletedCount: 0 }` синхроно.

**`destroy()` ги симнува сите дванаесет слушачи** (шест настани × два именски
простора) и обете својства (`:356-377`).

**README-овата секција „Mutation Response Envelope"** (`:110-120`) е прецизна за
случајот кога плик нема: *„Raw CouchDB never sends this envelope — `content` falls back
to the bare body, `message` is always `null`, so a direct CouchDB backend never
produces a toast."* Документирано е и однесувањето и неговото отсуство.

## Наоди

### 🔴 CD1 — Грешките немаат `status`, па координаторовата тројна политика колабира во „преодна"

**Каде:** `:82`, `:110`, `:164`, `:189`, `:217`, `:235` наспроти `ln-data-coordinator/src/ln-data-coordinator.js:646-648`

Секој неуспешен одговор освен еден се претвора во гол `Error`:

```js
if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
```

Статусот влегува во **текстот**, не во својство. Единствениот исклучок е 409 во
`_rawUpdate` (`:158-163`), кој поставува `err.status = 409` и `err.data`.

Затоа сите пет ракувача испраќаат `status: err.status || 0` (`:263`, `:279`, `:302`,
`:320`, `:336`) и добиваат **0** за сè што не е конфликт при измена.

Координаторот гранка токму по тој број (`ln-data-coordinator.js:646-648`):

```js
const isAuth      = status === 401 || status === 419;
const isTransient = status === 0 || status >= 500;
const isConflict  = status === 409 || status === 412;
```

Со `status` секогаш `0`:

| случај | што треба | што се случува |
|---|---|---|
| `401` / `419` истечена сесија | пауза на редицата + `auth-required` | **никогаш** — `isAuth` е неточно |
| `5xx` / мрежа | ретри низ скалата | ✅ точно, но случајно |
| `404` документот го нема | еднаш, потоа `drop` | 8 обиди низ 2s→5min, па `failed` |
| `403` забрането | еднаш, потоа `drop` | 8 обиди |
| `400` невалидно тело | еднаш, потоа `drop` | 8 обиди |

`isTransient` е **безусловно точно**, па детерминистичката гранка (`:671` натаму) —
онаа што ги брише локалните оптимистички записи за одбиен `create` и покажува тост —
е недостижна за овој транспорт. Записот останува во кешот, редицата го повторува
осум пати кон сервер што нема да го прифати, и дури тогаш паѓа во `failed`.

Истиот координатор со `ln-api-connector` работи точно, зашто таму `_resolve`
(`ln-api-connector.js:15-20`) го качува `err.status` и `err.data` на **секој** non-2xx.
Ист координатор, два транспорта, спротивно однесување.

README-то на самиот конектор (`:150`) упатува кон таа политика по име:

> See `components/ln-data-coordinator/README.md` for the full fan-out + error
> reconciliation policy (**auth/transient/deterministic**) that ships with the
> coordinator

Трите имиња се точно трите гранки што оваа форма на грешка не може да ги нахрани.

**Достижност:** секој CouchDB одговор што не е 2xx и не е 409 при измена. Истечена
сесија е најобичниот.

### 🔴 CD2 — Двата конектора делат псевдоним, а потписите им се некомпатибилни

**Каде:** `:6`, `:121`, `:169`, `:199`, `:245` наспроти `ln-api-connector/src/ln-api-connector.js:159`, `:170`, `:188`, `:198`

Обата поставуваат `dom['lnConnector'] = this` (`:25`; `ln-api-connector:28`), и
`ln-data-coordinator:210` ги разрешува под тоа име. Значи договорот е дека се
заменливи. Потписите не се:

| метод | `ln-api-connector` | `ln-couchdb-connector` |
|---|---|---|
| `create` | `(payload, url, idempotencyKey)` | `(payload, idempotencyKey)` |
| `update` | `(id, payload, expectedVersion, url, idempotencyKey)` | `(id, payload, idempotencyKey)` |
| `delete` | `(id, **url**, idempotencyKey)` | `(id, **rev**, idempotencyKey)` |
| `bulkDelete` | `(ids, url, idempotencyKey)` | `(ids, idempotencyKey)` |
| `query` | ✅ постои | ❌ не постои |

Двата најостри случаи:

**`delete` — иста позиција, спротивно значење.** Втор аргумент е URL кај едниот и
CouchDB ревизија кај другиот. Повик `connector.delete(id, url)` кон CouchDB конекторот
завршува како `?rev=` + URL-енкодирана патека → 400 или конфликт.

**`update` — третиот аргумент.** Kaj `ln-api-connector` тоа е `expectedVersion` и се
спојува во телото како `expected_version`. Kaj CouchDB тоа е `idempotencyKey` и оди во
заглавје. Полиморфниот повик во **README-то на трета компонента**
(`ln-api-queue/README.md:189-191`) го покажува токму тоа:

```js
const call = op === 'create' ? connectorEl.lnConnector.create(payload)
    : op === 'update' ? connectorEl.lnConnector.update(targetId, payload, expectedVersion)
    : op === 'delete' ? connectorEl.lnConnector.delete(targetId)
```

Документираниот интеграциски образец праќа број на верзија на местото каде CouchDB
конекторот очекува idempotency клуч.

(Во истата насока: idempotency заглавјето е `Idempotency-Key` овде (`:70`) и
`X-Idempotency-Key` кај другиот — наод AC2 од итерација 34. Трета разлика меѓу два
„заменливи" транспорта.)

**Достижност:** испорачаниот `ln-data-coordinator` мутира преку **настани**, не преку
методи, што го заобиколува проблемот. Достижен е секој консумент што го следи
документираниот образец од README-то на `ln-api-queue`.

### 🟠 CD3 — Го слуша туѓиот именски простор на настани

**Каде:** `:344-353`

```js
// Bind events for CouchDB namespaces and also API connector namespaces for 3-tier compatibility
const namespaces = ['ln-couchdb-connector', 'ln-api-connector'];
namespaces.forEach(function (ns) {
	self.dom.addEventListener(ns + ':request-sync', self._handlers.sync);
	…
});
```

Пресудата за псевдоними (07-22/07-23) го именува точно ова: **атрибут И event префикс =
полно име на компонентата; alias никогаш.** Тогаш `ln-store:*` беше преименуван во
`ln-data-store:*` по истата логика.

Тука не е преименување туку **преклопување**: компонентата одговара на команди
адресирани до друга компонента.

Двата конкретни ризика:

- **Двојна мутација при вгнездување.** Настаните буклаат. `ln-api-connector` поставен
  како потомок на `[data-ln-couchdb-connector]` значи дека
  `ln-api-connector:request-create` испратен на него ќе го обработат **обата** —
  внатрешниот по цел, надворешниот по буклање. Два POST-а, два `:created` настана.
- **Испратените настани не се симетрични.** Компонентата **слуша** на двата именски
  простора, а **испраќа** само на `ln-couchdb-connector:*` (`:257`, `:273`, `:296`,
  `:314`, `:330`, `:373`). Консумент што праќа `ln-api-connector:request-create` и чека
  `ln-api-connector:created` не добива ништо.

README-то не го спомнува второто врзување ниту еднаш — табелата на команди (`:82-93`)
наведува само `ln-couchdb-connector:*`.

### 🟠 CD4 — `_unwrapEnvelope` е приватна копија со друго име на полето

**Каде:** `:10-18` наспроти `ln-api-connector/src/connector-core.js:93-97`

```js
// ln-couchdb-connector:14-18
function _unwrapEnvelope(body) {
	const content = (body && body.content !== undefined) ? body.content : body;
	const message = (body && body.message) ? body.message : null;
	return { content: content, message: message };
}
```

```js
// connector-core.js:93-97
export function unwrapEnvelope(body) {
	const record = (body && body.content !== undefined) ? body.content : body;
	const message = (body && body.message) ? body.message : null;
	return { record, message };
}
```

Идентична логика, различно име на излезното поле — `content` наспроти `record`.

`DOCTRINE.md` §2, **The 2-Consumer Lifting Rule**:

> If a pure algorithm, parsing logic, or math formula is needed by **2 or more distinct
> components** … it **MUST** be lifted centrally into `ln-core` sub-modules … rather
> than cross-imported between components.

Ова е буквално чиста функција потребна на точно две компоненти. Таа веќе е извлечена —
во `connector-core.js`, кој е тестиран (`tests/network-layer.test.js`) — само не во
`ln-core`, па втората компонента направила копија.

Коментарот на `:13` го признава: *„Mirrors ln-api-connector.js's unwrap."* Огледалото
веќе се разликува во името на полето; секое следно менување ќе ги оддалечи уште.

### 🟠 CD5 — Безбедносните предупредувања се зад дебаг гејтот и се повторуваат

**Каде:** `:48`, `:51`

Обете почнуваат со `[ln-couchdb-connector]`, што значи дека
`ln-core/helpers.js:2-7` ги фаќа и ги **крие** освен ако страницата носи
`data-ln-debug`.

Тоа е единствената компонента чија единствена безбедносна сигнализација зависи од
режим за развој. Консументот што ги става акредитивите во `data-ln-couchdb-auth` на
продукциска страница — точно оној што треба да ја прочита пораката — нема да ја види.

Второ: обете живеат во `refreshConfig()`, која се вика при конструкција (`:27`) **и**
при секоја промена на четирите набљудувани атрибути (`:396`). Координатор што ги
поставува `url`, `db` и `auth` одделно ја печати истата порака до три пати.

(Изборот е бранлив — `mindset.md:133` вели дека развојните грешки одат во CSS
афорданс, не во конзола. Но оваа компонента **нема** `-dev.scss`, па не постои ни
другиот канал.)

### 🟠 CD6 — Нема `query()`, и `fetchDelta` нема ограничување

**Каде:** `:74-93`

```js
const params = ['include_docs=true', 'feed=normal'];
if (since) params.push('since=' + encodeURIComponent(since));
```

Нема `limit`, нема пагинација. Првата синхронизација (`since` празно) го влече
**целиот** фид на промени со сите документи, во еден одговор.

И `query(queryParams, targetEl)` — методот преку кој `ln-api-connector` ги носи
`offset`, `limit`, `search`, `sort` и филтрите (`ln-api-connector.js:133-157`) — тука
не постои воопшто. Значи `ln-table`-овиот прозорчест режим и серверското пребарување
не можат да работат врз CouchDB транспорт.

Тоа не е наод против CouchDB протоколот — `_changes` навистина нема иста форма како
REST листа. Наодот е дека двата конектора се изнесени како заменливи (CD2) додека
едниот нема половина од читачката површина на другиот, и ниту едно README не го
кажува тоа.

### 🟡 CD7 — `bulkDelete` пријавува делумен успех како успех

**Каде:** `:220-241`

```js
const docsToDelete = rows
	.filter(r => !r.error && r.value && r.value.rev)
	.map(r => ({ _id: r.id, _rev: r.value.rev, _deleted: true }));
…
return { response: { ok: true, results: unwrapped.content, deletedCount: docsToDelete.length }, message: … };
```

Редовите со грешка при `_all_docs` — непостоечки документ, конфликт — тивко се
испуштаат од множеството. Барање за 10 бришења каде 3 не постојат враќа
`{ ok: true, deletedCount: 7 }` без ниту еден податок за кои три биле испуштени.

И второ: `_bulk_docs` во CouchDB враќа **низа со по еден резултат по документ**, во
која поединечни ставки можат да имаат `error: 'conflict'`. Таа низа се проследува како
`results`, но `ok: true` и `deletedCount` се пресметуваат од **испратеното**, не од
успеаното.

### 🟡 CD8 — Нула прекинување, нула филтрирање на `AbortError`

**Каде:** целиот фајл

Ниту еден `AbortController`. `destroy()` (`:356-377`) симнува слушачи и ништо повеќе —
барање во лет продолжува и неговиот `.then` испраќа на откачен јазол.

И ниту еден од петте ракувача не проверува `err.name === 'AbortError'` пред да испрати
`:error`. `ln-api-connector` го прави тоа на **шест** места.

Тоа не е симетрично: `ln-http`-овиот Path A **го прекинува** GET-от за читање
ревизија (`:135`, `:179`) кога два се преклопат врз ист документ — наод H1 од
итерација 32. Прекинот потоа излегува како `ln-couchdb-connector:error` со
`status: 0`, што координаторот (CD1) го чита како преодна грешка и го ставa во ретри.

**Ја затвора пренесената ставка H1**: достижниот крај на де-дупликацијата во
`ln-http` е токму овој конектор, и последицата е повторен обид наместо изгубено
запишување — полоша во друга насока отколку што H1 претпоставуваше.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `this.credentials = 'same-origin'` (`:42`) е зашиено и е веќе стандардот на `fetch`. Кај `ln-api-connector` тоа е иста забелешка (P1 таму); тука е поостра, зашто CouchDB речиси секогаш е на друго потекло или порт, а `same-origin` значи дека сесиското колаче не патува — што е точно алтернативата што `:48` ја препорачува. | `:42` |
| P2 | README-овите примери за JS API (`:49-76`) покажуваат по еден или два аргумента и никаде не ги спомнуваат `idempotencyKey` ни `rev`. Значи разликата од `ln-api-connector` (CD2) не е видлива во ниту едно од двете README-а. | `README.md:45-76` |
| P3 | `_rawCreate` (`:100-101`) гради `{ _id: payload.id, ...payload }`, па документот во CouchDB носи и `_id` и `id`. Тоа е конзистентно со `fetchDelta:88`, но значи дека привремениот идентификатор од редицата станува **трајниот** `_id` — CouchDB `_id` е непроменлив. `ln-api-connector.create` го препушта доделувањето на серверот. Уште една разлика во семантиката на идентификаторите меѓу двата транспорта. | `:99-101` |
| P4 | Нема `-dev.scss`. Втора компонента во слој 4 без дев афорданс (по `ln-api-queue`), и единствената чија најверојатна грешка — акредитиви во атрибут — има само конзолен канал, при тоа гејтиран (CD5). | — |
| P5 | `fetchDelta` не испраќа `Content-Type` (`getHeaders` секогаш го поставува на `application/json`, `helpers.js:971-974`) за GET барање — безопасно, но значи дека секој GET носи заглавје што предизвикува CORS preflight кон вкрстено потекло. За CouchDB на друг порт тоа е дополнително OPTIONS барање пред секој sync. | `:80` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-couchdb-connector` | `:4` | ✅ | ✅ |
| `data-ln-couchdb-url` / `-db` | `:39-40` | ✅ | ✅ |
| `data-ln-couchdb-auth` | `:41` | ✅ со безбедносна забелешка | ✅ |
| `data-ln-couchdb-headers` | `:44` | ✅ | ✅ |
| `data-ln-debug` | — | — | ❌ (нема `-dev.scss`) |
| `ln-couchdb-connector:request-*` (6) | `:347-352` | ✅ сите | н/п |
| **`ln-api-connector:request-*` (6)** | `:345-353` | ❌ неспомнати | н/п |
| `:fetched` / `:created` / `:updated` / `:deleted` / `:bulk-deleted` / `:error` / `:destroyed` | сите | ✅ | н/п |
| `ln-couchdb-connector:config-changed` | `:54` | ⚠️ во табелата | н/п |
| `fetchDelta` → `{data, deleted, synced_at}` | `:86-91` | ✅ со пример | н/п |
| плик `{message, content}` | `:14-18` | ✅ цела секција, точна | н/п |
| `create/update/delete/bulkDelete` | `:121,169,199,245` | ✅ сите четири | н/п |
| `idempotencyKey` параметар | `:121,169,199,245` | ❌ ниту еден пример | н/п |
| `rev` параметар на `delete` | `:199` | ❌ | н/п |
| `query()` | **не постои** | ✅ не се тврди | н/п |
| `err.status` за non-2xx | **само 409 во update** | ❌ `:150` упатува на политика што бара статус | н/п |
| `.lnCouchDbConnector` / `.lnConnector` | `:24-25` | ✅ обете | н/п |
| Internals извор | `src/ln-couchdb-connector.js` | ✅ (README:152 нема патека на bundle) | н/п |

## Затечена состојба

**Трите разлики меѓу „заменливите" транспорти се затвораат заедно.** Idempotency
заглавјето (AC2, итерација 34), потписите на методите (CD2) и формата на грешка (CD1)
се три независни расцепи под еден псевдоним `lnConnector`. Одлуката дали воопшто треба
да постои заеднички интерфејс — и што влегува во него — оди во **#46
ln-data-coordinator**, кој е единствениот вистински консумент.

**`unwrapEnvelope` постои извлечено и тестирано**, во `connector-core.js` под
`ln-api-connector`. Ако се крене во `ln-core` по 2-Consumer правилото, копијата овде
паѓа заедно со разликата во името на полето.

**`ln-http` H1 е затворен со поинаков исход отколку што беше претпоставено.**
Читањето ревизија пред запишување (`:135`, `:179`) навистина е де-дуплирано од Path A,
но прекинот не води до тивко изгубено запишување — води до `:error` со `status: 0`,
кој координаторот го класифицира како преодна грешка и го праќа во ретри скалата.
Значи двојната измена на ист документ произведува дополнителни осум мрежни обиди
наместо еден изгубен запис.

Конзолен излез: два `console.warn`, обете гејтирани, обете безбедносни (CD5); плус
еден индиректен `console.error` преку `parseHeaders` — но овде **со** проследено име
на компонентата (`:45`), за разлика од `ln-api-connector:48`. Inline стил: нула.
`createElement`: нула. Зашиен кориснички текст: нула.
