# Аудит — ln-upload

2026-09-11 · Опсег: `src/ln-upload.js` (642), `src/upload-model.js` (78), `README.md` (131), schema · Итерација 28/50

## Вердикт

Најцелосната CQS површина во библиотеката — три команди, три откажливи `before-`
настани, седум известувања, сите документирани — и единствената компонента што го
имплементира изречниот исклучок на `DOCTRINE.md:74` точно како што е напишан. Но
`clear()` и `remove()` ја прават истата серверска операција со **две различни
политики за грешки**, и едната од нив ја брише состојбата на клиентот додека
фајловите остануваат на серверот.

## Што е добро

**Единствената точна имплементација на исклучокот за мерни единици.**
`DOCTRINE.md:74`:

> *Measurement Units Fallback Exception:* Standardized, universal technical/measurement
> unit symbols … are permissible as built-in runtime fallback defaults when a custom
> translation dictionary entry is absent, **provided that dictionary lookup
> (`dict['unit-kb']`) is always attempted first.**

`upload-model.js:64-67`:

```js
dict['unit-b'] || 'B',
dict['unit-kb'] || 'KB',
dict['unit-mb'] || 'MB',
dict['unit-gb'] || 'GB'
```

Речникот прв, симболот како резерва. Доктрината дури го користи `dict['unit-kb']` како
свој пример — и ова е кодот што го оправдува тој пример.

**README-то покажува на вистинскиот извор.** `README.md:107`:
*„Source: `components/ln-upload/src/ln-upload.js`"* — `src/`, не компајлираниот бандл.
Трета компонента во кампањата што го прави тоа, по `ln-key` и `ln-options`.

**Целосна CQS површина.** Три влезни команди (`request-upload`, `request-remove`,
`request-clear`, `:229-231`), три откажливи порти (`before-upload` `:271`,
`before-remove` `:465`, `before-clear` `:554`), седум известувања. Секој од 13-те
настани е во табелата на README:87-101, со точен `detail`. Ниту една друга компонента
нема толку целосно затворен протокол.

**`_dragDepth` бројачот** (`:55`, `:157`, `:170-174`) е точниот лек за
`dragleave` што се пали при преминување врз дете. Наивната имплементација трепка на
секоја внатрешна граница; оваа не.

**`data-ln-upload-state` е единствениот визуелен извор**, и ко-лоцираниот SCSS го
чита (`ln-upload.scss:9`, `:13`, `:17`). Тоа е точно она што пресудата за
CSS/JS границата дозволува — компонентата го стилизира сопственото
`data-ln-x="state"`, без класи.

**XHR се прекинува на трите места каде треба** — `remove()` (`:474-476`),
`clear()` (`:558-560`) и `destroy()` (`:609-613`).

**SSR хидратацијата ги фаќа и сирачињата.** `_hydrate` (`:65-109`) не се задоволува
со `[data-ln-upload-item]` — таа поминува и низ веќе постоечките скриени `input`-и
(`:90-106`) и регистрира секој `serverId` што нема соодветна ставка во листата. Тоа
е случајот кога серверот испратил id-а без видлив ред, и ниту една друга компонента
не мисли на таа асиметрија.

**`this.dom = dom` е првиот исказ** (`:31`), а предупредувањето за отсутен
`input[type="file"]` (`:40`) **не** излегува од конструкторот — сите последователни
употреби се заштитени (`:142`, `:148`, `:217`, `:616`). SYS-1 не важи, а компонентата
работи и без input (само drag-and-drop).

**`remove()` има вистинска патека за грешка** (`:526-536`): при `!response.ok` ја
враќа ставката во претходната состојба и испраќа `ln-upload:error`. Тоа е точното
однесување — и е причината зошто `clear()` под неа паѓа во очи.

## Наоди

### 🟠 U1 — `clear()` ја брише состојбата на клиентот и ја прогласува успешна, што и да врати серверот

**Каде:** `:552-585`, конкретно `:576` и `:581-584`

```js
fetch(deleteUrl, { method: 'DELETE', headers: { … } }).catch(function () {});
…
self.uploadedFiles.clear();
if (self.list) self.list.innerHTML = '';
self._syncHiddenInputs();
dispatch(self.dom, 'ln-upload:cleared', {});
```

Три работи истовремено:

1. **`.catch(function () {})`** — празен catch. Мрежен отказ е проголтан.
2. **Одговорот воопшто не се чита.** Нема `.then`, значи `response.status` 403, 404,
   409 или 500 се неразликуваат од 204.
3. **Состојбата се брише синхроно**, пред кој било од тие одговори да пристигне.
   `uploadedFiles.clear()` (`:581`) и `list.innerHTML = ''` (`:582`) се извршуваат
   веднаш по циклусот што ги испраќа барањата.

Резултат: `ln-upload:cleared` секогаш значи „готово", а фајловите можат да останат на
серверот. Клиентот повеќе нема ни `serverId` — `uploadedFiles` е празна и скриените
`input`-и се симнати — па нема ни што да се повтори, ни што да се пријави.

**Асиметријата е внатре во истиот фајл.** `remove()` ја прави **истата** DELETE
операција со целосна политика за грешки:

| | `remove()` | `clear()` |
|---|---|---|
| се чита `response.ok` | ✅ `:518` | ❌ |
| враќање на состојбата при отказ | ✅ `:527-530` | ❌ |
| `ln-upload:error` при отказ | ✅ `:531-535` | ❌ |
| `.catch` со дејство | ✅ `:538-548` | ❌ празен `:576` |
| состојбата се брише | само по `response.ok` | секогаш, веднаш |

README:128 го опишува однесувањето неутрално — *„issues background DELETE requests …
and **immediately** emits `ln-upload:cleared`"* — значи е свесна одлука, не пропуст.
Она што договорот не го кажува е дека `cleared` не носи никаква информација за
серверот, а `clear()` е единствената операција по која повратот е невозможен.

**Достижност:** секој отказ на DELETE — истечена сесија, 403 од политика, мрежен
прекин. README:81 го изнесува `clear()` како јавен API (*„Clear and delete all files"*).

### 🟠 U2 — Нечитлив `max-size` / `max-files` тивко ги гаси ограничувањата

**Каде:** `:47-48`

```js
this.maxSize  = +dom.getAttribute(MAX_SIZE_ATTR)  || 0;
this.maxFiles = +dom.getAttribute(MAX_FILES_ATTR) || 0;
```

Проверките подолу се `if (self.maxSize > 0 …)` (`:262`) и
`if (self.maxFiles > 0 …)` (`:244`), значи `0` значи **без ограничување**. Тоа е
конзистентна семантика за отсутен атрибут (`+null` = `0`).

Но `+` врз нечитлив стринг дава `NaN`, а `NaN || 0` дава `0`. Значи:

```html
<div data-ln-upload="/files" data-ln-upload-max-size="10MB">
<div data-ln-upload="/files" data-ln-upload-max-size="10 485 760">
<div data-ln-upload="/files" data-ln-upload-max-files="five">
```

сите три го **отклучуваат** ограничувањето наместо да го применат. Атрибутот е
напишан, изгледа применет, и не прави ништо.

`attrs.js:15` во `ln-core` изречно го именува овој идиом како укинат:

> `0` stays `0` — unlike the `parseInt(...) || 1000` idiom this replaces.

Овде последицата е потешка од стандардниот SYS-2 случај, зашто атрибутот е
**ограничување**: неговиот отказ не дава погрешен приказ, туку прифаќање на фајлови
што политиката ги забранува. `ln-upload-dev.scss` покрива три структурни случаи и
ниту еден за форматот на овие два.

Трето појавување на SYS-2, по обете progress компоненти.

### 🟠 U3 — Хидрираната големина е форматираниот текст, не број

**Каде:** `:79-86` наспроти `README.md:78`

```js
const rawSize = item.getAttribute('data-ln-upload-size');
const parsedSize = rawSize ? parseInt(rawSize, 10) : null;

self.uploadedFiles.set(localId, {
	…
	size: (parsedSize !== null && !isNaN(parsedSize))
		? parsedSize
		: (sizeEl ? sizeEl.textContent.trim() : '')      // ← „1.2 MB"
});
```

Кога `data-ln-upload-size` недостасува, `size` станува **прикажаниот текст** —
`"1.2 MB"`, локализиран, со единица. Тоа поле потоа излегува низ јавниот API:

```js
_component.prototype.getFiles = function () {
	return … .map(f => ({ serverId: f.serverId, name: f.name, size: f.size }));
};
```

README:78 го документира како број:

```js
el.lnUpload.getFiles();  // [{ serverId: '42', name: 'contract.pdf', size: 1200000 }]
```

Значи `getFiles()` враќа `1200000` за качен фајл и `"1.2 MB"` за хидриран фајл без
`data-ln-upload-size`. Иста низа, две различни типови, зависно од историјата на
елементот. Секој консумент што сумира големини добива
`0 + 1200000 + "1.2 MB"` → `"12000001.2 MB"`.

`mindset.md:103-105`:

> **Mainstream way:** Filter and sort read `td.textContent` — whatever the display
> layer rendered.
> **Ashlar way:** … `td.textContent` is **presentation only**.

Тука `textContent` е резервниот извор на машинска вредност, што е точно образецот
што доктрината го именува како мејнстрим. README:115 го опишува како фича
(*„reads … `size` from `data-ln-upload-size` or `[data-ln-field="sizeText"]`"*) без да
каже дека вториот извор дава друг тип.

### 🟠 U4 — CSRF барањето е дуплирано, а `ln-core` веќе ги гради заглавјата

**Каде:** `:23-26` и `ln-ajax/src/ln-ajax.js:120`

```js
// ln-upload:24
const meta = document.querySelector('meta[name="csrf-token"]');
```

```js
// ln-ajax:120
const csrfToken = document.querySelector('meta[name="csrf-token"]');
```

Два консументи, две копии, нула примитив. `DOCTRINE.md` §2:

> **The 2-Consumer Lifting Rule:** If a pure algorithm, parsing logic, or math formula
> is needed by 2 or more distinct components … it **MUST** be lifted centrally into
> `ln-core` sub-modules.

(Формулацијата зборува за чисти алгоритми; ова е DOM читање. Појасниот аргумент е
дека `ln-core` **веќе** го поседува градењето заглавја — `getHeaders`
(`helpers.js:970-975`) — и токму таа функција не знае за CSRF, па двете компоненти ја
заобиколуваат.)

Двете имплементации веќе се разидоа: `ln-ajax:136` го поставува заглавјето **само**
ако токенот постои; `ln-upload:431` го поставува секогаш, па праќа
`X-CSRF-TOKEN: ` (празно) кога `meta`-та ја нема. Laravel го отфрла празниот токен со
419, значи качувањето паѓа со порака што не покажува кон причината.

Плус: `meta[name="csrf-token"]` е Laravel конвенција зашиена во библиотека што се
претставува како zero-dependency vanilla. Никаде во `README.md` на `ln-upload` не се
спомнува CSRF.

### 🟡 U5 — Трите знаменца што `fill()` ги добива немаат ниту еден консумент

**Каде:** `:298-300`, `:372`, `:414-415`, `:506`, `:529`, `:541`

На секоја промена на состојба компонентата праќа во `fill()`:

```js
fill(item, { …, uploading: true, error: false, deleting: false });
```

`fill` (`ln-core/helpers.js:110-160`) ги троши клучевите преку четири хука:
`data-ln-field`, `data-ln-attr`, `data-ln-show`, `data-ln-class`.

Документираниот шаблон (`README.md:43-55`) содржи `data-ln-field="name"`,
`data-ln-field="sizeText"` и `data-ln-attr="aria-label:removeLabel, title:removeLabel"`
— и **ниту еден** `data-ln-show` или `data-ln-class`. Значи `uploading`, `error` и
`deleting` не влијаат на ништо во маркапот што README-то го пропишува.

И не се потребни: `data-ln-upload-state` веќе ја носи истата состојба на самата
ставка (`:292`, `:368`, `:411`, `:505`, `:528`), а `ln-upload.scss:9-19` стилизира
токму од неа. Двоен канал за иста информација, од кој едниот нема приемник.

`DOCTRINE.md` §2, **No Speculative Code (Definition of Done)**:

> Functions enter a model **only if the DOM shell or system already actively calls
> them** … Uncalled or dead functions are strictly forbidden.

Ако знаменцата се наменети, README-овиот шаблон ги нема хуковите што ги читаат — тоа е
испуштен договор. Ако не се наменети, се мртов payload на седум места.

(Ако се додадат хукови: `data-ln-show` користи `.hidden`, што `ln-ashlar-core.scss`
не го носи — SYS-7.)

### 🟡 U6 — README тврди врзување за `[data-ln-upload-progress]` што JS го нема

**Каде:** `README.md:10`

> **Pure Data Attributes (No BEM in JS)**: All JS behaviors bind strictly to
> declarative attributes (`[data-ln-upload-zone]`, `[data-ln-upload-list]`,
> `[data-ln-upload-item]`, **`[data-ln-upload-progress]`**, `[data-ln-progress]`,
> `[data-ln-upload-action="remove"]`).

`src/ln-upload.js` никогаш не го бара `[data-ln-upload-progress]`. Прогресот се пишува
на `[data-ln-progress]` (`:306`, `:339`) — атрибутот на `ln-progress`. Единствениот
консумент на `data-ln-upload-progress` е `ln-upload.scss:9,13`, како чиста CSS кука.

Схемата го потврдува: `"direction": null`, `"sources": ["ln-upload.scss"]`.

Шесто појавување на SYS-19.

### 🟡 U7 — `fetch` DELETE-ите преживуваат `destroy()`

**Каде:** `:509`, `:569` наспроти `:605-637`

`destroy()` ги прекинува сите XHR-и (`:609-613`), но `fetch` барањата немаат
`AbortController` и не се прекинуваат. Нивните `.then` затворачи го држат `self` и
`item`:

```js
.then(function (response) {
	if (response.ok) {
		if (item) item.remove();
		self.uploadedFiles.delete(targetLocalId);
		self._syncHiddenInputs();        // ← пишува во откачен контејнер
		dispatch(self.dom, 'ln-upload:removed', …);   // ← на јазол без слушачи
	}
```

Штетата е мала — записите се на веќе откачен јазол. Но правилото за teardown е
исто за обата транспорта, а е применето само на едниот. Иста компонента, две
политики — истата форма како U1.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `_syncHiddenInputs` ги додава `input[type="hidden"]` на `self.dom` (`:128`). Ако `[data-ln-upload]` не е внатре во `<form>` — или ако формата се поврзува преку `form="id"` — тие јазли не се праќаат. `ln-validate:79` изречно го решава истиот случај преку `dom.form`. Плус `destroy()` не ги отстранува. | `:113-131`, `:605-637` |
| P2 | `getFileExtension('archive.tar.gz')` враќа `'gz'`, а `parseAcceptExtensions('.tar.gz')` враќа `'tar.gz'` (се симнува само водечката точка). Значи `accept=".tar.gz"` не се совпаѓа со ниту еден фајл. | `upload-model.js:12,23` |
| P3 | FormData серијализацијата (`:319-325`) користи `el.value`, што за `<select multiple>` враќа само првата избрана опција. README:8 изречно ги промовира вгнездените полиња како начин за придружни метаподатоци. | `:324` |
| P4 | `_onZoneClick` (`:138-145`) ја чува заштитата за копчиња и врски **само** кога зоната е самиот контејнер (`:139`). Со посветен `[data-ln-upload-zone]`, секој клик во него — вклучувајќи копче внатре — го отвора дијалогот за фајлови. | `:138-145` |
| P5 | `remove()` и `clear()` ја повторуваат идентичната резолуција на `deleteUrl` (`:488-493` и `:562-567`), вклучувајќи го fallback-от кон `uploadUrl` со `{id}`. Шест линии дуплирани во ист прототип. | `:488-493`, `:562-567` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-upload` (URL) | `:43` | ✅ | ✅ |
| `data-ln-upload-accept` | `:50` | ✅ со трите форми | ✅ |
| `data-ln-upload-delete` | `:44,490` | ✅ | ✅ |
| `data-ln-upload-max-size` | `:47,262` | ✅ (но види U2) | ✅ |
| `data-ln-upload-max-files` | `:48,244` | ✅ (но види U2) | ✅ |
| `data-ln-upload-file-field` | `:45,316` | ✅ default `file` | ✅ |
| `data-ln-upload-ids-field` | `:46,126` | ✅ default `file_ids[]` | ✅ |
| `data-ln-upload-dict` | `:32` | ✅ со целосна табела на клучеви | ✅ |
| `data-ln-upload-zone` | `:35` | ✅ во структурата | ✅ |
| `data-ln-upload-list` | `:36` | ✅ | ✅ |
| `data-ln-upload-item` | `:69,289` | ✅ | ✅ |
| `data-ln-upload-id` | `:72,369` | ✅ | ✅ `both` |
| `data-ln-upload-local-id` | `:75,290` | ⚠️ само во Internals | ✅ |
| `data-ln-upload-ext` | `:291` | ⚠️ само во Internals + пример | ✅ `runtime` |
| `data-ln-upload-size` | `:79` | ⚠️ само во примерот | ✅ |
| `data-ln-upload-state` | `:158,292,411,505` | ❌ недокументиран | ✅ `runtime` |
| `data-ln-upload-action="remove"` | `:188,303` | ✅ | ✅ |
| `data-ln-upload-progress` | **само SCSS** | ❌ тврди JS врзување | ✅ `direction: null` |
| `data-ln-progress` (туѓ) | `:307,340` | ✅ во шаблонот | ✅ `both` |
| `data-ln-field` / `data-ln-attr` (туѓи) | преку `fill` | ✅ во шаблонот | `data-ln-field` ✅ |
| `meta[name="csrf-token"]` | `:24` | ❌ нула спомнувања | н/п |
| `uploading` / `error` / `deleting` во `fill` | 7 места | ❌ шаблонот нема хук | н/п |
| 13 настани | сите испратени | ✅ сите 13 со detail | н/п |
| `getFiles().size` тип | број **или** стринг | ❌ тврди број | н/п |
| Internals извор | `src/ln-upload.js` | ✅ точен | н/п |

## Затечена состојба

**Пренесената ставка од `ln-progress` е разрешена — не е дефект.**
`ln-progress.schema.json` декларира `data-ln-upload-progress` затоа што
`ln-progress-dev.scss:5` го користи како **негативен** селектор:

```scss
[data-ln-progress]:not(.progress [data-ln-progress]):not([data-ln-upload-progress] [data-ln-progress]) {
```

Дев афордансот за „`data-ln-progress` без контејнер" ги исклучува прогрес-лентите на
`ln-upload`. Скенерот е literal-only и нема поим за „спомнат, но не поседуван", па го
запишува како атрибут на `ln-progress`. Тоа е ограничување на
`sync-ln-schemas`, не наод против ниту една од двете компоненти. Истиот механизам ги
објаснува и другите SYS-15 случаи.

**Три транспортни патеки, ниту една низ `ln-http`.** `XMLHttpRequest` за качување
(`:327`) — нужно, зашто `fetch` нема прогрес за upload; и два директни `fetch`-а за
бришење (`:509`, `:569`), каде прогрес не е потребен. README-то не ја објаснува
поделбата, ниту зошто транспортниот слој на библиотеката е заобиколен.

**`data-ln-upload-state` е недокументиран, а е центарот на визуелниот договор.**
Три вредности (`dragover`, `uploading`, `deleting`) плус `error`, сите пишувани од JS
и сите читани од `ln-upload.scss`. Схемата ги фаќа; README-то нема ред за нив.

Конзолен излез: два `console.warn`, обата со `[ln-upload]` префикс, значи зад гејтот.
Inline стил: нула. Зашиен кориснички текст: два fallback-а (`'Remove'` `:297`,
`'Error'` `:362,413`) — обата зад `dict[…] ||`, што `component-guide.md:131` изречно
го дозволува како развојна резерва.
