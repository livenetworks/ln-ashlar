# Аудит — ln-data-store

2026-09-11 · Опсег: `src/ln-data-store.js` (954), `src/data-store-model.js` (155), `src/window-index.js` (119), `README.md` (266), schema · Итерација 37/50

## Вердикт

Единствената компонента во библиотеката што ги користи **и** `defineAttrs` **и**
`effects` — референтната имплементација на инверзијата на атрибутната реактивност, и
затворањето на таа пренесена ставка. Но целиот потсистем околу
`data-ln-data-store-indexes` — откривање, надградба на верзија, замрзнување, дев
предупредување, запис во схемата — постои околу индекси што ниту едно читање не ги
користи.

## Што е добро

**Инверзијата на атрибутната реактивност е применета целосно, и само овде.**
`:220-226`:

```js
defineAttrs(this, dom, {
	_staleThreshold: [_readStale, 'data-ln-data-store-stale', 300],
	_searchFields:   [attrList,   'data-ln-data-store-search-fields'],
	noLocalQuery:    [attrBool,   NO_LOCAL_QUERY_ATTR],
	_windowSize:     [attrInt,    'data-ln-data-store-window', 1000],
	_windowPageSize: [attrInt,    'data-ln-data-store-window-page', 200]
});
```

Пет живи getter-и наместо пет копии. Плус `effects` при регистрација (`:932-940`) —
обликот што `component-guide.md:150-153` го пропишува и што ниту една друга
компонента не го усвоила (`ln-time` и `ln-number` сè уште се на наследната
`onAttributeChange` патека).

**`_readStale` е сопствен читач со три семантики** (`:208-213`):

```js
if (raw === 'never' || raw === '-1') return -1;
const parsed = parseInt(raw, 10);
return isNaN(parsed) ? fallback : parsed;
```

`'never'`, број, и нечитливо → три различни исходи. Истата дисциплина како
`parseAutosaveDebounce`, и спротивна од SYS-2 идиомот.

**„Прикажи, не применувај" за атрибути што навистина не смеат да се менуваат.**
`:912-922`:

```js
// The IndexedDB schema and the store's registered name are fixed at open
// time: createIndex is only legal inside a versionchange transaction
// (see onupgradeneeded, :85-94). A post-init edit is recorded on the host
// for the dev stylesheet to surface; nothing is applied.
function _markFrozen(el, attrName) {
	el.setAttribute(FROZEN_ATTR, attrName);
}
```

И `ln-data-store-dev.scss` правило 2 го покажува, и `data-ln-data-store-frozen` е во
схемата. Значи: причината е во кодот, сигналот е во CSS, атрибутот е во договорот.
Тоа е најдобро решениот случај на непроменлив атрибут во целото репо — и е точно
патеката на `mindset.md:133`.

**Дев афордансот ги покрива обата вистински авторски промашаја** — стор без `id`
(правило 1) и измена на замрзнат атрибут (правило 2).

**Раздвојувањето на две прашања што делеле едно знаменце, со запишана причина**
(`:231-234`):

> `isLoaded`: a full sync has landed, so the cache is authoritative … `canServe`:
> records are held that can answer a read. A page fetch grants the second without
> granting the first.

**`_mutationChain`** (`:272`, `:339`) ги серијализира мутациите — create, update,
delete и bulk-delete не можат да се преплетат врз ист IndexedDB стор.

**`_canScanEarly` ги знае сопствените граници** (`:594-596`):

```js
return !options.sort && !getCryptoKey();
```

Кога има клуч за шифрирање, брзиот курсорски пат е исклучен, зашто скенот не може да
чита низ шифрирани полиња. Компонента што сама го гаси својот брз пат кога знае дека
е невалиден.

**Моделите се живи.** Сите пет увоза (`:2-3`) имаат повикувач; `window-index.js` и
`data-store-model.js` се без `window`/`document`, а `tests/ln-data-store.test.js`
постои.

**`destroy()` го чисти прозорецот, обете множества слушачи, и глобалниот регистар**
(`:843-866`).

## Наоди

### 🔴 DS1 — Декларираните IndexedDB индекси се создаваат, надградуваат и замрзнуваат, а никогаш не се читаат

**Каде:** `:28-40`, `onupgradeneeded` (`:85-94`), `:912-922` наспроти `:608`

Целиот потсистем постои:

| дел | каде |
|---|---|
| откривање од маркапот | `_getRequiredStores:33-37` |
| создавање во `onupgradeneeded` | `:85-94` |
| зголемување на верзија + повторно отворање | README:44 |
| замрзнување по init | `_markFrozen:917-919` |
| дев предупредување | `ln-data-store-dev.scss` правило 2 |
| запис во схемата | `data-ln-data-store-indexes` |
| документација | README:39-45, сопствена секција |

Grep за `.index(` низ целиот `src/ln-data-store.js`: **нула**.

Единственото читање од IndexedDB во локалната патека е `_scanLocal` (`:598-623`):

```js
const request = store.openCursor();
```

Гол курсор врз објект-сторот — без индекс, без `IDBKeyRange`. Филтрирањето и
пребарувањето се прават **во JavaScript** врз секој прочитан запис
(`_matchesFilters`, `_matchesTokens`), со ран излез кога ќе се соберат доволно
(`found.length >= need`).

Значи авторот што ќе напише `data-ln-data-store-indexes="status,owner_id,created_at"`
плаќа: скок на верзијата на базата, затворање и повторно отворање на врската
(README:44), и одржување на три индекси при **секој** запис — за нула корист при
читање.

README:54 го тврди спротивното во делот за шифрирање:

> The record's primary identifier `id` is preserved in plain text **to allow
> IndexedDB index lookups and queries.**

Нема index lookups. (`id` навистина мора да остане чист — тој е `keyPath` — но
наведената причина не е таа.)

Втора појава на истиот образец во ист слој: `ln-api-queue` QU3
(`by_scope_chain` создаден, никогаш прочитан). Таму беше еден индекс без документација;
овде е author-facing атрибут со сопствена README секција и сопствена машинерија за
заштита.

`DOCTRINE.md` §2, **No Speculative Code**: *„Uncalled or dead functions are strictly
forbidden."*

### 🟠 DS2 — Шифрирањето ги брише сите полиња освен `id`, што ги прави индексите структурно невозможни

**Каде:** `:128-145`

```js
async function _encryptRecord(record) {
	if (!getCryptoKey() || !record) return record;
	const plainRecord = { ...record };
	const recordId = plainRecord.id;
	const encryptedPayload = await encryptData(plainRecord);
	if (!encryptedPayload || !encryptedPayload.encrypted) return record;

	return {
		id: recordId,
		encrypted: true,
		iv: encryptedPayload.iv,
		data: encryptedPayload.data
	};
}
```

Зачуваниот објект има точно четири својства. Секој декларирани индекс врз `status`,
`owner_id` или `created_at` покажува кон поле што повеќе не постои — значи индексот е
празен за секој шифриран запис.

Тоа не е нов дефект туку **втор слој врз DS1**: дури и индексите да се користеа за
читање, вклученото шифрирање би ги испразнило. И кодот го знае тоа — `_canScanEarly`
(`:595`) го исклучува курсорскиот пат кога има клуч, па `getAll` мора да го вчита и
дешифрира **целиот** стор за секое читање.

README:53-54 ја продава спротивната слика:

> **Indexable Payload:** Only the data properties of the record are encrypted … The
> record's primary identifier `id` is preserved in plain text to allow IndexedDB index
> lookups and queries.

„Indexable Payload" како наслов на постапка што го прави payload-от неиндексибилен.

Изведбената последица не е документирана никаде: со клуч, секое `getAll` е целосно
вчитување плус дешифрирање по запис, наместо курсор со ран излез.

### 🟠 DS3 — `clearAll()` ја брише базата и не кажува никому

**Каде:** `:870-891`

```js
function _clearAll() {
	return _getDb().then(db => {
		…tx.objectStore(name).clear() за секој стор…
	}).then(() => {
		Object.values(_stores).forEach(inst => {
			inst.isLoaded = false;
			inst.canServe = false;
			…
			inst.totalCount = 0;
		});
	});
}
```

Осум знаменца се ресетираат на секоја инстанца. Што **не** се случува:

| работа | `fullReload()` (`:828`) | `clearAll()` |
|---|---|---|
| се чисти IndexedDB | ✅ еден стор | ✅ сите |
| се ресетираат знаменцата | ✅ | ✅ |
| се ресетира `_windowIndex` | ❌ | ❌ |
| се бара нова синхронизација | ✅ `_triggerRemoteSync` | ❌ |
| се испраќа настан | ✅ преку sync патеката | ❌ **ниту еден** |

Значи по `window.lnDataStore.clearAll()` — објавен глобален API (`:944`,
README:206-213) — секој `ln-table` и `ln-list` на страницата продолжува да ги
прикажува старите редови. Нема `:ready`, нема `:loaded`, нема `:destroyed`, нема
`query-changed`. Ниту еден консумент нема од што да дознае дека кешот е празен.

И `_windowIndex` ги задржува своите позиции, па прозорчеста табела и понатаму бара
страници по индекси чии записи веќе ги нема.

### 🟠 DS4 — Единствениот `destroy()` во библиотеката без гард за идемпотентност

**Каде:** `:843`

```js
_component.prototype.destroy = function () {
	if (this._windowIndex) { … }
```

Секоја друга ревидирана компонента почнува со
`if (!this.dom[DOM_ATTRIBUTE]) return;` — `ln-key:110`, `ln-number:355`,
`ln-upload:606`, `ln-editor:332`, `ln-autosave:161`, `ln-translations:259`,
`ln-api-connector:395`, `ln-api-queue:305`, `ln-couchdb-connector:357`. Овде го нема.

Внатрешните чекори се идемпотентни (`_windowIndex`, `_handlers`, `_queryHandlers` се
поставуваат на `null`; `delete` врз непостоечки клуч е no-op), па втор повик не фрла.
Но `:865` се извршува секој пат:

```js
dispatch(this.dom, 'ln-data-store:destroyed', { store: this._name });
```

Двоен `destroy()` дава два `:destroyed` настана за ист стор. Координатор што брои
живи сторови или расчистува врзувања на тој настан го обработува двапати.

### 🟠 DS5 — Два псевдонима на глобалниот API, едниот во туѓ именски простор

**Каде:** `:944-951`

```js
window[DOM_ATTRIBUTE].clearAll = _clearAll;
window[DOM_ATTRIBUTE].init = window[DOM_ATTRIBUTE];      // ← само-псевдоним
window[DOM_ATTRIBUTE].setStorageKey = setCryptoKey;

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.setStorageKey = setCryptoKey;           // ← туѓ простор
}
```

**`lnDataStore.init === lnDataStore`.** Полето покажува на самиот објект што го носи.
Не е документирано во README-овата секција за глобален API (`:206-213`), нема
консумент во репото, и е точно она што пресудата за псевдоними (07-22/07-23) го
именува: *„alias никогаш"*.

**`window.lnCore.setStorageKey`** — компонента што пишува во именскиот простор на
`ln-core`. Досега тој објект го полнеше само `ln-core/helpers.js` (`:1033-1039`).
README:52 ги документира обете форми како рамноправни:

> Set a storage key by calling `window.lnCore.setStorageKey(key)` **or**
> `window.lnDataStore.setStorageKey(key)`.

Практичната последица: консумент што вчитал само `ln-core` гледа
`lnCore.setStorageKey` како достапен само ако `ln-data-store` е вчитан — примитив што
постои или не постои зависно од туѓ бандл.

### 🟡 DS6 — `console.error` го заобиколува гејтот

**Каде:** `:922`

```js
_deleteBulk(inst._name, evicted).catch(err => {
	console.error('[ln-data-store] window shrink eviction failed:', err);
});
```

Гејтот во `ln-core/helpers.js:2-7` го закрпува само `console.warn`. SYS-8.

Дополнително: тоа е единствената пријава за неуспешно исфрлање при смалување на
прозорецот — нема `ln-data-store:error` настан во таа гранка, па координаторот не
дознава дека записи што прозорецот ги отпишал сè уште се во IndexedDB.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Стор без `id` дава `this._name = undefined` (`:218`), па `_stores[undefined] = this` (`:264`) и IndexedDB стор со име `"undefined"`. Дев правило 1 го покрива авторски ✅ и `_getRequiredStores:32` го прескокнува при откривање ✅ — но два стора без `id` на иста страница тивко се препишуваат во `_stores`, а предупредувањето (`:219`) е зад гејтот. | `:218-219`, `:264` |
| P2 | `_canScanEarly` (`:594-596`) го гаси курсорскиот пат кога има клуч за шифрирање, значи секое читање под шифрирање е целосно вчитување + дешифрирање по запис. Точна одлука, никаде документирана — README-овата секција за шифрирање (`:49-57`) зборува само за активирање и автоматско дешифрирање. | `:594-596` |
| P3 | Сторот вика `e.preventDefault()` на `ln-search:change`, `ln-filter:change` и `ln-sort:change` (`:295`, `:300`, `:320`) — настани што ги поседуваат други компоненти. Механизмот е разумен (сторот сигнализира дека упитот е негов), но договорот „кој гледа `defaultPrevented` и што прави тогаш" не е запишан во ниту едно README. Поврзано со познатото отстапување на `ln-filter` од cancelable-кон-целта договорот. | `:295,300,320` |
| P4 | `data-store-model.js` извезува шест функции; компонентата увезува четири (`:3`). `sortRecords` и `searchRecords` се користат внатре во `queryRecords`, значи не се мртви — но извезени се како јавна површина без надворешен консумент во `components/**`. | `data-store-model.js:11,55` |
| P5 | `_scanLocal` застанува на `found.length >= need` (`:611`), што е точно за страничење и значи дека истиот пат не може да даде вкупен број на филтрирани записи. `count(filters)` (`:725`) оди по друга патека — вреди да се провери дали двете даваат ист резултат под ист филтер. | `:611`, `:725` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-data-store` (id = име на стор) | `:6`, `:218` | ✅ | ✅ |
| `data-ln-data-store-stale` (`never` / `-1` / број) | `_readStale:208` | ✅ | ✅ |
| `data-ln-data-store-search-fields` | `:222` | ✅ | ✅ |
| `data-ln-data-store-no-local-query` | `:223` | ✅ | ✅ |
| `data-ln-data-store-window` / `-window-page` | `:224-225`, `effects` | ✅ секција 4 | ✅ |
| `data-ln-data-store-indexes` | `_getRequiredStores:33` | ✅ сопствена секција | ✅ |
| `data-ln-data-store-frozen` (runtime) | `_markFrozen:918` | ⚠️ во Internals | ✅ |
| `data-ln-debug` | `-dev.scss` | ❌ | ✅ |
| индексите се користат при читање | **никогаш** | ❌ `:54` тврди „index lookups" | н/п |
| шифрираниот запис задржува индексибилни полиња | **не** | ❌ `:53` „Indexable Payload" | н/п |
| `defineAttrs` + `effects` | `:220`, `:932` | ⚠️ Internals ги спомнува | н/п |
| `request-create/update/delete/bulk-delete/sync-failed` | `:275-289` | ✅ | н/п |
| `ln-search:change` / `ln-filter:change` / `ln-sort:change` (се слушаат + `preventDefault`) | `:294-322` | ✅ слушањето; ❌ откажувањето | н/п |
| `:created` / `:updated` / `:deleted` / `:ready` / `:loaded` / `:synced` / `:initialized` / `:query-changed` / `:request-page` / `:request-remote-sync` / `:mutation-error` / `:sync-error` / `:initialization-error` / `:quota-exceeded` / `:destroyed` | сите испратени | ✅ | н/п |
| `clearAll()` испраќа настан | **не** | ❌ неспомнато | н/п |
| `lnDataStore.init` | само-псевдоним | ❌ | н/п |
| `window.lnCore.setStorageKey` | `:950` | ✅ документиран | н/п |
| `destroy()` гард за идемпотентност | **нема** | — | н/п |

## Затечена состојба

**Пренесената ставка за `defineAttrs` е затворена.** Пописот стои: **1 од 49**
компоненти го користи, и тоа е оваа. Истото важи и за `effects` — `ln-data-store` е
единствениот консумент на реактивната патека (гранка А во
`helpers.js:757-766`); сите останати регистрации одат по наследната гранка (В).
Значи инверзијата од `3628e7d` е изградена целосно и усвоена на едно место. Тоа не е
наод против ниту една компонента — тоа е состојбата на миграцијата, пас 1.

**Крипто fail-open останува одложен.** `_encryptRecord:137-138` враќа
**обичен текст** кога `encryptData` не успее, а `_decryptRecord:148` пропушта секој
запис без `encrypted` знаменце — значи неуспешното шифрирање е недетектибилно
надолу. Тоа е ставката што ја одложи за посебен пас; **не се брои како нов наод**.
Новото што излезе овде е нејзината спрега со индексите (DS2), која е независна од
fail-open прашањето.

**Втора појава на „индекс создаден, никогаш прочитан" во ист слој.**
`ln-api-queue` QU3 (`by_scope_chain`) и `ln-data-store` DS1. Двете IndexedDB
компоненти во библиотеката ја имаат истата навика; ниту една не чита низ индекс.

Конзолен излез: еден `console.warn` (гејтиран, `:219`) и еден `console.error`
(негејтиран, `:922`). Inline стил: нула. `createElement`: нула. Зашиен кориснички
текст: нула.
