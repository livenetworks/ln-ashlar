# Аудит — ln-api-queue

2026-09-12 · Опсег: `src/ln-api-queue.js` (336) · `src/queue-storage.js` (459) · `README.md` (221) · `ln-api-queue.schema.json` (25) · **нема** `ln-api-queue.scss`, нема `ln-api-queue-dev.scss` · Доктрина: `_doctrine.md`

## Вердикт

Најтешкото не е доктринарно, туку корисничко: кога IndexedDB го нема, `enqueue`
враќа `null` и компонентата **молчи** — ни настан, ни грешка — а README изречно
ветува спротивно. Веднаш зад тоа README рекламира програмски API што во кодот не
постои: сите методи се `_`-префиксирани, `.lnApiQueue.enqueue()` фрла TypeError.
Потоа доаѓа тркање во `_drain()` што ја испушта штотуку запишаната ставка (авторот
го знае проблемот — го решил само на рачната патека), и `destroy()` што не откажува
ниту една започната операција — 23 од 24 испраќања седат во promise-callback без
destroyed-стража. На доктринарна страна компонентата е чиста по §2/§3 (нула
записи во DOM), но токму затоа паѓа по §1: ниту една статусна состојба — паузиран,
pending count — не се гледа во DOM.

## Што е добро

- **Нула записи во DOM.** `grep` за `setAttribute|classList|.style.|removeAttribute|
  textContent|createElement|.hidden` во `src/*.js` враќа **нула** погодоци. §2 и §2.1
  се исполнети по целосно отсуство, не по внимателност.
- **Живо читање на атрибут, без огледало.** `_isOnline()` (`src/ln-api-queue.js:72-75`)
  го зема `data-ln-api-queue-online` во моментот на употреба и паѓа на `navigator.onLine`.
  Точно духот на §1.
- **Декларирана реактивност.** `extraAttributes` + `onAttributeChange`
  (`src/ln-api-queue.js:333-334`); нема сопствен `MutationObserver` врз host-от.
- **Вистински чист логички слој.** `claimQueueHeads` (`src/queue-storage.js:32-64`) и
  `remapQueueEntries` (`:66-88`) се експортирани чисти функции — нула `document`,
  нула `window`, `now` влегува како аргумент. `QueueStorage` ги инјектира
  `indexedDB` / `IDBKeyRange` / `now` / `uuid` (`:93-97`), што е појака форма на §0
  од самиот бенчмарк.
- **Транзакциска алокација на `seq`.** Мета-бројачот и ставката се пишуваат во една
  `readwrite` транзакција врз двата стора (`src/queue-storage.js:174, 200-201`) — тврдењето
  на `README.md:56-58` е вистинито, што е поретко од што звучи.
- **`destroy()` ги симнува сите слушачи.** Сите девет DOM слушачи (`:308-316`),
  `window` `online` (`:317`) и сите тајмери (`:319-320`).

## Наоди

### 🔴 T1 — Кога IndexedDB го нема, мутацијата тивко исчезнува — а README вети дека нема

**Каде:** `src/ln-api-queue.js:46-51, 148-150` · `src/queue-storage.js:104, 170-171` ·
`README.md:106`

`QueueStorage.open()` враќа `Promise.resolve(null)` кога `indexedDB` или `IDBKeyRange`
недостига (`src/queue-storage.js:104`). `enqueue()` тогаш враќа `null`
(`src/queue-storage.js:170-171`), а `_onEnqueue` го проголтува со гол ранен излез:

```js
.then(entry => {
    if (!entry) return;        // src/ln-api-queue.js:150
```

Нема `ln-api-queue:error`, нема `ln-api-queue:failed`, нема ништо. Координаторот
(`ln-data-coordinator.js:249, 268, 287, 304` праќа `request-enqueue`) не добива никаков
сигнал дека записот не е зачуван. Единствената трага е `console.warn` еднаш при boot
(`src/ln-api-queue.js:49`), што кај консумент со исклучен `data-ln-debug` е и погушено
од core-от.

Полошо — состојбата активно лаже. `_emitPendingCount()` (`:78-87`) читa празна листа и
испраќа `ln-api-queue:pending-count {count: 0}` **плус** `ln-api-queue:drained`. UI-то
покажува „сè е испратено".

`README.md:106` го тврди обратното со толку зборови:

> `ln-api-queue:error` | `{ operation, entryId?, error }` | IndexedDB or queue
> orchestration failed **without silently discarding the entry**.

Достижно е: приватен режим во дел од прелистувачите, sandbox-иран iframe без
`allow-same-origin`, одбиена квота. Тоа е точно сценариото за кое offline outbox
постои.

---

### 🔴 T2 — README рекламира програмски API што не постои

**Каде:** `README.md:62-74` · `src/ln-api-queue.js:71-324`

README има целосна секција **„JavaScript API Methods"** (`README.md:62`) што вели
„Access the instance directly on the element via the `.lnApiQueue` property"
(`:64`) и потоа, во кодниот блок:

> `// Programmatic equivalents of the DOM commands below also exist,` (`README.md:70`)
> `// ... whether it is reacting to a DOM event or calling a method directly.` (`:73`)

Во изворот, целиот прототип е приватен: `_isOnline` (`:71`), `_emitPendingCount` (`:78`),
`_clearTimer` (`:89`), `_scheduleTimer` (`:97`), `_drain` (`:110`), `_onEnqueue` (`:146`),
`_onAck` (`:165`), `_onNack` (`:176`), `_onRemap` (`:211`), `_onResolveCreate` (`:220`),
`_onResume` (`:235`), `_onPause` (`:246`), `_onDrain` (`:256`), `_onClear` (`:266`),
`_bindEvents` (`:279`). Единствениот јавен член е `destroy` (`:304`).

Консумент што го следи README пишува `el.lnApiQueue.enqueue(...)` и добива
`TypeError: ... is not a function`. Ова е точно дефиницијата на 🔴 — документиран
договор што е невистинит на начин што го заведува консументот.

---

### 🟠 T3 — Спојувањето на `_drain()` ја испушта штотуку запишаната ставка

**Каде:** `src/ln-api-queue.js:113, 157` наспроти `:259-260`

`_drain()` се де-дуплицира со врaќање на тековното ветување:

```js
if (self._drainPromise) return self._drainPromise;   // :113
```

`_onEnqueue` вика `_drain()` **откако** нејзината IDB транзакција веќе завршила (`:157`).
Ако во тој момент трае претходен drain чијшто `claimReady` `getAll`
(`src/queue-storage.js:237`) веќе прочитал, новата ставка **не е** во тој снимок, а
`_onEnqueue` добива токму тоа старо ветување и не покренува нов циклус. Синџирот на
новата ставка останува `pending` без закажан тајмер — `_scheduleTimer` се повикува само
за `wakeups` што ги вратил `claimReady` (`:117-119`), а новиот синџир го нема таму.

Дека ова е познат ризик се гледа од `_onDrain`, кадешто истиот случај е **рачно**
покриен:

```js
const activeDrain = self._drainPromise;                                     // :259
return activeDrain ? activeDrain.then(() => self._drain()) : self._drain(); // :260
```

Тој образец е применет само на `request-drain`. `_onEnqueue` (`:157`), `_onAck` (`:170`)
и `_onResolveCreate` (`:225`) го немаат.

Последица: запис што чека, не тргнува. Се опоравува дури на следен независен
поттик (нов ack, `online` настан, друг тајмер, рачен `request-drain`) — не се губи
трајно, но тивко доцни неопределено.

---

### 🟠 T4 — Секоја in-flight операција го преживува `destroy()` и испраќа настани од уништена инстанца

**Каде:** `src/ln-api-queue.js:304-324` наспроти сите 23 dispatch места во promise-callback

`destroy()` симнува слушачи и тајмери, но **не следи и не откажува ниту една започната
операција**, а на ниту едно место на испраќање нема destroyed-стража. Единствената
проверка, `if (!this.dom[DOM_ATTRIBUTE]) return;` (`:305`), го штити само повторниот
влез во самиот `destroy()`.

Од 24-те `dispatch(self.dom, …)` повици, **23 се во `.then`/`.catch`** што затвораат врз
`self.dom` — единствен синхрон е самиот `:322`. Дупката е на секоја патека, не само на
drain-от:

| Операција | Испраќа по разрешување |
|---|---|
| init ланец (`:46-66`) | `paused` (`:58`), `error` (`:65`) |
| `_emitPendingCount` (`:78`) | `pending-count` (`:81`), `drained` (`:83`) |
| `_drain` (`:110`) | `send` (`:123`), `error` (`:137`) |
| `_onEnqueue` (`:146`) | `enqueued` (`:152`), `error` (`:161`) |
| `_onAck` (`:165`) | `error` (`:172`) |
| `_onNack` (`:176`) | `failed` (`:187`), `paused` (`:196`), `auth-required` (`:197`), `error` (`:207`) |
| `_onRemap` (`:211`) · `_onResolveCreate` (`:220`) | `error` (`:216`, `:227`) |
| `_onResume` (`:235`) · `_onPause` (`:246`) · `_onDrain` (`:256`) | `resumed` (`:239`), `paused` (`:250`), `error` (`:242`, `:252`, `:262`) |
| `_onClear` (`:266`) | `pending-count` (`:272`), `drained` (`:273`), `error` (`:275`) |

Симнувањето на слушачите спречува **нова** операција да почне, но команда испратена
еден tick пред уривање сè уште емитува врз мртов јазол. Најостро е кај `_drain`:
`self._drainPromise` (`:115`) се разрешува и испраќа `ln-api-queue:send` за секоја
заробена ставка (`:123-132`) кон координатор што ќе изврши транспорт за компонента што
веќе не постои.

Доктрина §5 бара `destroy()` да ги симне и **in-flight барањата**;
`DOCTRINE.md:106` — „A destroyed component MUST NOT mutate the DOM, MUST NOT dispatch
state updates or CustomEvents, and MUST NOT commit asynchronous results" — плус
`:107-108`, што бара експлицитна рачка за откажување на teardown. Ниедното не е
исполнето.

Дополнително: заробените ставки остануваат `inflight` со 60-секунден лиз
(`src/queue-storage.js:56-59`, `LEASE_MS = 60000` на `src/ln-api-queue.js:9`) што никој
нема да ack-не — синџирот е блокиран до истек.

---

### 🟠 T5 — Испраќа `ln-api-queue:destroyed` (П2)

**Каде:** `src/ln-api-queue.js:322` · документиран на `README.md:107`

```js
dispatch(self.dom, 'ln-api-queue:destroyed', { scope: self.scope });
```

П2 го брише настанот од сите компоненти што го испраќаат. Потврдено со grep низ
`components/`, `demo/admin`, `demo/spa`, `demo/docuflow`: **нула** слушачи —
единствените други појави се компилираниот бандл, `README.md:107` и
`.claude/plans/docs-mcp-events-inventory.md:31`.

---

### 🟠 T6 — Целата статусна состојба е невидлива во DOM (§1 · П5)

**Каде:** `src/ln-api-queue.js:37` (`this._paused`), `:195`, `:238`, `:249`, `:271` · нула
`setAttribute` во целиот фајл

Компонентата **има** host елемент и пишува точно **нула** атрибути. Паузираноста живее
само во приватното поле `this._paused` (иницијализација `:37`; се менува на `:55`,
`:195`, `:238`, `:249`, `:271`) и во IndexedDB мета-стор
(`src/queue-storage.js:292, 404`). Бројот на чекачки записи се испраќа само како
настан (`:81`).

П5 ја повлекува границата изречно: податочната содржина (`outbox` редовите) е **вон
опсег**, но „животна/статусна состојба — `isSyncing`, `isLoaded`, `totalCount`" е
**внатре, без исклучок**. `_paused` е иста форма како `isSyncing`; `count` е иста форма
како `totalCount`, и README сам (`:100`) го нарекува „the primary UI-facing signal
(badge, banner)".

Последица: не постои `[data-ln-api-queue-paused]` за CSS да закачи банер, ниту
`data-ln-api-queue-pending` за значка. Секој консумент мора да напише JS што слуша
настан и сам да огледа состојба во DOM — токму работата што §1 ја сместува во
компонентата.

---

## 🟡 Doc-drift

| # | Наод | Каде |
|---|---|---|
| 1 | `by_scope_chain` индексот е опишан како „used to find the head entry per chain" — во изворот се **создава** и **никогаш не се прашува**. Сите шест читања одат преку `by_scope_seq` | `README.md:51` наспроти `src/queue-storage.js:117-118` (создавање) и `:161, 215, 237, 336, 359, 418` (сите читања) |
| 2 | `ln-api-queue:destroyed` е документиран како дел од договорот; П2 го укинува | `README.md:107` |
| 3 | Секцијата „JavaScript API Methods" описно (T2) — и кога ќе се тргне тврдењето, останува празна секција со само `.lnApiQueue` пристапот | `README.md:62-74` |
| 4 | `data-ln-data-coordinator` постои во шемата (скенерот го фаќа од `closest()`), но не и во табелата со атрибути во README | `ln-api-queue.schema.json:18-23` наспроти `src/ln-api-queue.js:33` и `README.md:37-42` |

## 🔵 Предлози

| # | Набљудување | Каде |
|---|---|---|
| 1 | `_storage` е **модулски синглетон** — сите инстанци делат една IDB врска. `destroy()` не ја затвора и не смее (би ги искинала сестрите). Врската не би постоела да компонентата не се извршела, што е П3 тестот; но затворањето бара бројач на референци. Одлука за чекор 5, не поправка сега. `onversionchange` (`:131`) барем спречува блокирање на надградба | `src/ln-api-queue.js:23-27` · `src/queue-storage.js:98, 131, 139-143` |
| 2 | `this.scope` се чита **еднаш** во конструкторот од `dom.id`/координаторскиот `id`. Ова е клуч за перзистенција, не состојба, па живо читање би било полошо — но вреди да се знае дека промена на `id` по boot ги остава записите заглавени под стариот scope | `src/ln-api-queue.js:33-34` |
| 3 | `_onClear` го спушта `_paused` на `false` и ја брише перзистираната пауза, но не испраќа `ln-api-queue:resumed`. Консумент што видел `paused` никогаш не дознава дека е кренато | `src/ln-api-queue.js:271-273` · `src/queue-storage.js:427` |
| 4 | `nack` со непознат `reason` (ни `drop`, ни `auth`, ни `retry`) го повикува `clearLease(entry)` врз **само во меморија** копија и никогаш не прави `outbox.put` — записот останува `inflight` во базата, синџирот блокиран до истек на лизот. README документира точно три вредности, па достижноста зависи од дисциплина на консументот | `src/queue-storage.js:286-312` |
| 5 | Компонентата нема ни `ln-api-queue.scss` ни `ln-api-queue-dev.scss`. Тоа е одбранливо (нема авторска структура за изнудување), но §3 бара „тоа што фали да падне гласно (dev-scss порака)" — а единствената порака за недостапна IndexedDB е `console.warn` (`:49`). Ако T1 се поправи со dev-scss афордaнс, host-от ќе треба атрибут — што се поклопува со T6 | `src/ln-api-queue.js:49` |
| 6 | `window.addEventListener('online', …)` е `window`-нивоен слушач, што §4 формално не го покрива (правилото зборува за `document`). Постои преседан на `ln-data-coordinator.js:47`, `destroy()` уредно го симнува (`:317`), и не постои DOM еквивалент на овој сигнал. **Не го сметам за наод** — го наведувам за да не се појави како таков во хоризонталниот премин | `src/ln-api-queue.js:43, 317` |
| 7 | `ln-api-queue:send` е **излезна команда кон родителот** — README сам го нарекува „Command to the coordinator" (`:98`). §4 забранува координаторот да вика прототипни методи; инверзниот правец (дете командува родител преку настан) не е пресуден никаде. Функционира и е чесно наречен, но е единствениот таков правец во библиотеката | `src/ln-api-queue.js:123-132` · `README.md:98` |

## Затечена состојба — без пресуда

- **ПОВЛЕЧЕН НАОД (бивш T7) · пресуда 2026-09-12 (§4.1).** Аудитот ги
  пријавуваше `ln-api-queue:ack` (`:294`), `:nack` (`:295`) и `:resolve-create` (`:297`)
  како прекршок затоа што се влезни без `:request-` префикс.

  §4.1 ги именува точно тие два од трите како **исходен влез** — третата
  легитимна форма, заедно со `page-failed`. Тоа не е команда туку известување
  за исход на работа завршена на друго место: нема што да се „бара", работата
  е веќе сторена. `request-ack` би лажело на истиот начин како `request-set-data`.

  Шестте `request-*` настани во истата компонента остануваат исправни —
  расцепот што аудитот го опишуваше како „внатре во една компонента" е
  всушност две различни насоки што легитимно се именуваат различно.
  Координаторските испраќања (`ln-data-coordinator.js:564, 586, 601, 611, 654, 663, 689`)
  се соодветно исто така исправни.

Единствената отворена виљушка (§8 — BEM компаунди) **не се допира**: компонентата
нема SCSS фајлови и не пишува ниту една класа во DOM (проверено со grep за
`classList` низ `src/*.js` — нула погодоци).

Немам забелешка кон самата доктрина по повод оваа компонента.

## Drift табела

| Нешто | Извор | README | schema.json |
|---|---|---|---|
| `data-ln-api-queue` | `src/ln-api-queue.js:5` | `:40` ✔ | `:6-11` ✔ (`direction: null`) |
| `data-ln-api-queue-online` | `src/ln-api-queue.js:72`, `:333` | `:41` ✔ | `:12-17` ✔ (`author`) |
| `data-ln-data-coordinator` (читан со `closest`) | `src/ln-api-queue.js:33` | ✘ отсутен во табелата | `:18-23` ✔ |
| scope извор (`id` → координаторски `id` → `'default'`) | `src/ln-api-queue.js:34` | `:39` ✔ | — |
| Влезни настани: `request-enqueue`, `request-remap`, `request-resume/pause/drain/clear` | `:293, 296, 298-301` | `:84, 87, 89-92` ✔ | — |
| Влезни настани без `request-`: `ack`, `nack`, `resolve-create` | `:294, 295, 297` | `:85, 86, 88` ✔ (документирани како што се) | — |
| Излезни настани: `send`, `enqueued`, `pending-count`, `auth-required`, `paused`, `resumed`, `failed`, `drained`, `error` | `:123, 152, 81, 197, 58/196/250, 239, 187, 83/273, 65/137/…` | `:98-106` ✔ | — |
| `ln-api-queue:destroyed` | `:322` | `:107` ✔ (но П2 го укинува) | — |
| `by_scope_chain` индекс | создаден `src/queue-storage.js:118`, **некористен** | `:51` тврди дека се користи ✘ | — |
| Backoff `2s/5s/15s/60s/5min`, 8 обиди | `src/ln-api-queue.js:7-8` | `:145` ✔ | — |
| Лиз 60s | `src/ln-api-queue.js:9` | `:117-121` ✔ | — |
| DB `ln_api_queue`, стори `outbox` + `_queue_meta` | `src/queue-storage.js:1, 3-4` | `:47, 49-52` ✔ | — |
| Програмски API методи | **не постојат** (сите `_`-префиксирани; јавен е само `destroy`) | `:62-74` тврди дека постојат ✘ | — |
