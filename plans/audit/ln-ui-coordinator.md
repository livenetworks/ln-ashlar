# Аудит — ln-ui-coordinator

**Датум:** 2026-09-11 · **Итерација:** 45/50 · **Слој 6 — координатори и навигација**
**Опсег:** `src/ln-ui-coordinator.js` (395), `README.md` (99), `ln-ui-coordinator.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Најшироко распослан фајл во библиотеката — десет слушачи на `document`/`window`, сите на
модулно ниво, сите активни од вчитување на бандлот — во кој „компонентата" е сведена на
држач на речник; и токму тука се открива дека `docs/architecture/data-flow.md` ја
припишува целата оваа работа на `ln-modal`, кој нема ниту еден `document` слушач.

---

## Што е добро

**Наследувањето на речникот низ вгнездени координатори е точно имплементирано.**

```js
while (current) {
	const host = current.closest('[' + DOM_SELECTOR + ']');
	if (!host) break;
	if (host[DOM_ATTRIBUTE] && host[DOM_ATTRIBUTE].dict) hosts.unshift(host[DOM_ATTRIBUTE].dict);
	current = host.parentElement;
}
for (const hDict of hosts) Object.assign(dict, hDict);          // :18-29
```

`unshift` го гради низата од најдлабокиот кон коренот, па `Object.assign` тече корен →
лист и внатрешниот навистина го надјавува надворешниот. Коментарот на `:11-12` го тврди
токму тоа, и е точен. Проверив го поминувањето рачно — единствениот вгнезден-речник
механизам во кампањата што работи како што е опишан.

**Hash сегментот за `edit` носи вистински id кога постои, и обраложение зошто мора да е
truthy.** `_hashParamForOpen` (`:63-75`) — четириреден коментар што објаснува дека
празниот параметар би го пратил модалот низ reset гранката при туѓ `hashchange` и би го
избришал пополнувањето. Тоа е точниот вид коментар: зошто, не што.

**`_adoptOpenModals` решава проблем што лесно се пропушта.** SSR модал со
`data-ln-modal="open"` нема URL сегмент, па првиот `_syncHashModals` би го затворил како
фантомска навигација наназад. `:243-251` го посвојува **пред** првата синхронизација.
Тоа е точно SSR-hydration полноста што `project_ssr-authored-markup-hydration` ја бара.

**`_inSync` реентранс-заштитата е на вистинското место.** `:201-236` — `hashSet` внатре
во синхронизација пали `hashchange`, кој повторно би ја повикал. Еден boolean со
`try/finally`, не знаменце распослано низ пет функции.

**Грешката не го затвора модалот, и тоа е запишано.** `:326` — *„We deliberately do NOT
close the modal on error so form validation feedback remains visible."* Една реченица што
спречува иден „поправка" што би ја скршила валидацијата.

**Речникот во README-то е точен до последниот клуч.** Десетте клучеви на `README:70-81` и
нивните резервни вредности се совпаѓаат збор-за-збор со `:314-351`. Ретко во кампањата.

---

## Наоди

### 🟠 UC1 — Доктрината ја припишува оваа работа на `ln-modal`, кој ништо од неа не прави

**Каде:** `docs/architecture/data-flow.md:669-671`

> *„**No coordinator JS needed.** The button click is handled by two independent document
> listeners: **`ln-modal` opens the modal and sets `data-ln-modal-mode`**; `ln-fill` fills
> the form."*

Затечено во `components/ln-modal/src/ln-modal.js` — сите слушачи, без исклучок:

```
:41  this.dom.addEventListener('ln-modal:request-open',  this._onRequestOpen);
:42  this.dom.addEventListener('ln-modal:request-close', this._onRequestClose);
:43  this.dom.addEventListener('cancel',                 this._onCancel);
:44  this.dom.addEventListener('click',                  this._onClickClose);
```

Четири, сите на `this.dom`. **Нула `document` слушачи.** И grep за
`data-ln-modal-mode` / `lnModalMode` низ `components/*/src/`:

```
→ components/ln-ui-coordinator/src/ln-ui-coordinator.js   (13 погодоци)
```

Ниту еден во `ln-modal`. Значи двете половини од реченицата се неточни:

1. `ln-modal` **не** слуша на `document` и **не** го поставува `data-ln-modal-mode` —
   тоа го прави `ln-ui-coordinator` на `:121`, `:123`, `:191`, `:194`, `:218`.
2. „No coordinator JS needed" е обратно од вистината: **координаторската JS е токму она
   што го прави примерот да работи**. Извадете го `ln-ui-coordinator` од бандлот и
   `[data-ln-modal-for]` копчето престанува да прави било што.

Ова е втор случај во кампањата каде доктринарен документ опишува имплементација што не
постои (по `overview.md:103` кај `ln-search`). Разликата е што овде документот не само
што греши за механизмот — тој ја именува **погрешната компонента** како носител, што
значи дека читател што бара „кој го отвора модалот" ќе го отвори погрешниот фајл.

**Достижност:** документирана патека, седум живи консументи во
`demo/admin/src/pages/modal.html`.

---

### 🟠 UC2 — Осум зашиени англиски реченици, најголемата концентрација во кампањата

**Каде:** `:315`, `:322`, `:337` (×3), `:338`, `:350`, `:351`

```js
message: dict['network-error']      || 'Network error'                      // :315
message: dict['server-error']       || 'Server error'                       // :322
dict['upload-max-size']             || 'File is too large'                  // :337
dict['upload-max-files']            || 'Maximum file count exceeded'        // :337
dict['upload-invalid-type']         || 'This file type is not allowed'      // :337
title:   dict['upload-invalid-title'] || 'Invalid File'                     // :338
message: dict['upload-failed']      || 'Failed to upload file'              // :350
title:   dict['upload-error-title'] || 'Upload Error'                       // :351
```

**Извор на правилото:** `DOCTRINE.md:73` — *„**Zero Display Text in JS:** Hardcoded UI
text/labels in JS are strictly forbidden."*

Исклучокот на `:74` е изречно ограничен: *„Standardized, universal technical/**measurement
unit symbols** (e.g. byte units `'B'`, `'KB'`, `'MB'`, `'GB'`, time units `'ms'`, `'s'`)"*.
Целосни англиски реченици не се мерни единици.

Речник-прво редоследот **е** почитуван во сите осум — тоа е половината што доктрината ја
бара. Втората половина не е: резервната вредност е англиски текст, не празнина.

**Внатрешната асиметрија го прави очигледно дека одлуката не е свесна:**

| поле | резерва |
|---|---|
| `dict['network-error-title']` (`:314`) | `''` |
| `dict['server-error-title']` (`:321`) | `''` |
| `dict['upload-invalid-title']` (`:338`) | **`'Invalid File'`** |
| `dict['upload-error-title']` (`:351`) | **`'Upload Error'`** |

Четири наслови, две празни и две на англиски — во истиот фајл, за иста намена.

**Достижност:** висока. `_getCoordinatorDict(e.target)` (`:300`, `:336`, `:349`) враќа
`{}` кога настанот не потекнува од поддрво на координатор. Во демото координаторот стои на
самиот `<dialog>` (`modal.html:52` и уште шест), па `ln-upload:invalid` од форма надвор од
дијалог не наоѓа речник — и сите осум англиски реченици се тоа што корисникот го гледа.

---

### 🟠 UC3 — Достигање до глобал наместо увоз, со два секогаш-вистинити guard-а и една недостижна гранка

**Каде:** `:86-90` и `:126`

```js
const forms = modal.querySelectorAll('form');
for (let i = 0; i < forms.length; i++) {
	if (window.lnCore && typeof window.lnCore.lnFill === 'function') {
		window.lnCore.lnFill(forms[i], null);
	} else {
		forms[i].reset();                                      // :89 — недостижна
	}
}
```

Три факти:

1. **`lnFill` е редовен извоз.** `components/ln-core/index.js:1` го наведува меѓу
   `cloneTemplate, … , fill, lnFill`. Овој фајл веќе увезува **осум** работи од
   `'../../ln-core'` на `:1` — деветтата не чини ништо.
2. **Глобалот се поставува безусловно.** `components/ln-core/helpers.js:1028-1037` —
   `if (typeof window !== 'undefined') { … window.lnCore.lnFill = lnFill; }`. Во
   прелистувач е секогаш поставен, и е поставен **пред** овој фајл да се извршил, зашто
   овој фајл го увезува ln-core.
3. Значи `window.lnCore && typeof window.lnCore.lnFill === 'function'` е **секогаш
   вистинито**, и `forms[i].reset()` на `:89` **никогаш не се извршува**.

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code; и стоечката наредба дека
не се пишуваат одбранбени guard-ови за недостижни сценарија.

Истиот guard е повторен на `:126` (`hasRecord && window.lnCore && typeof … === 'function'`),
каде исто така е мртов товар.

Ова не е козметика: `:89` и `:126`-`else` даваат **две различни однесувања** за
ресетирање на форма — `lnFill(form, null)` наспроти `form.reset()` — од кои втората е
недостижна, па никој нема да забележи ако се разидат.

---

### 🟠 UC4 — `_findTargetModal` има шест нивоа, последното отвора прв модал на страницата

**Каде:** `:35-61`

| # | линија | стратегија |
|---|---|---|
| 1 | `:40` | `wrapper.id === modalId` и `wrapper` е модал |
| 2 | `:41` | во координаторскиот host, по id или по `data-ln-modal="id"` |
| 3 | `:45` | `document.getElementById(modalId)` |
| 4 | `:45` | `document.querySelector('[data-ln-modal="' + modalId + '"]')` |
| 5 | `:52-57` | без id: wrapper сам, прв модал во wrapper, или `triggerEl.closest` |
| 6 | `:60` | **`document.querySelector('[data-ln-modal]')`** — прв модал на страницата |

Последното ниво е дефект, не резерва. Trigger со печатна грешка во
`data-ln-modal-for="user-modl"` не паѓа тивко и не пали dev-афорданс — **отвора друг,
случаен модал**, со `data-ln-modal-mode` поставен од неговиот `dataset` и со
`hashSet(target.id, …)` што го запишува туѓиот id во URL-то.

**Извор на правилото:** `DOCTRINE.md` §2 — No Speculative Code; плус пресудата дека
ID-врзувањето е point-to-point. `ln-table-coordinator` го одбива токму истиот облик, со
образложение во изворот (`ln-table-coordinator.js:70-74`); овој фајл го има шест пати.

**Првите две нивоа се мртви во единствената реална употреба.** Демото го става
координаторот **на самиот `<dialog>`** — `modal.html:52`, `:68`, `:103`, `:129`, `:207`,
`:275`, `:355`, сите седум како `<dialog data-ln-modal data-ln-ui-coordinator>`. Копчето
што го отвора стои **надвор** од дијалогот, па `triggerEl.closest('[data-ln-ui-coordinator]')`
(`:38`, `:50`) враќа `null` и нивоата 1, 2 и 5 никогаш не се достигаат. Сè оди преку
`document` гранките — што директно противречи на README:62 („its subtree").

---

### 🟡 UC5 — Атрибутот не активира ништо; „компонентата" е само држач на речник

**Каде:** `_component` (`:382-386`) наспроти `README.md:62`

```js
function _component(dom) {
	this.dom = dom;
	this.dict = buildDict(dom, DICT_SELECTOR);
	return this;
}
```

Тоа е целата инстанца. Сè друго — **десет** слушачи — живее на модулно ниво и се качува
при вчитување на бандлот:

| # | линија | цел | настан |
|---|---|---|---|
| 1 | `:96` | `document` | `click` |
| 2 | `:164` | `document` | `ln-modal:before-open` |
| 3 | `:176` | `document` | `ln-modal:open` |
| 4 | `:253` | `window` | `hashchange` |
| 5 | `:261` | `document` | `DOMContentLoaded` |
| 6 | `:329` | `document` | `ln-ajax:success` |
| 7 | `:330` | `document` | `ln-ajax:error` |
| 8 | `:360` | `document` | `ln-upload:invalid` |
| 9 | `:361` | `document` | `ln-upload:error` |
| 10 | `:365` | `document` | `ln-modal:close` |

README:62 вели дека `data-ln-ui-coordinator` *„**Activates** UI orchestration on the
element and its subtree"*. Не активира: оркестрацијата е веќе активна, низ цела страница,
и без ниту еден такав атрибут. Единственото што атрибутот прави е да понуди речник за
резервните пораки (UC2).

**Забелешка што НЕ е наод:** самите `document` слушачи. `docs/architecture/data-flow.md:344-345`
изречно го санкционира обликот — *„The scoped form is the canonical write trigger —
`ln-data-coordinator` listens on `document` at the **bubble** phase only"* — а отфрленото
(`:335`) е capture-фаза и store командна магистрала, што овде ги нема. Значи распослувањето
е дозволено; неточен е README-от што тврди дека атрибутот го пали.

**Последица за `destroy()`:** `:388-392` го празни само речникот. Тоа е **точно** за
модулни слушачи (тргањето би ги скршило другите инстанци) — но значи дека `destroy()` на
оваа компонента нема никакво набљудливо дејство надвор од резервните пораки.

---

### 🟡 UC6 — README документира слушач што не постои, и премолчува три што постојат

**Документиран, не постои:** `README.md:94`

> | `submit` | Listens | `document` | Tracks native submissions in modals for clean hash/reload lifecycle. |

Нема `submit` слушач. Пописот погоре (UC5) е целосен — десет `addEventListener` повици,
ниту еден за `submit`.

**Постојат, недокументирани:**

| настан | линија |
|---|---|
| `ln-modal:before-open` | `:164` |
| `ln-modal:open` | `:176` |
| `ln-modal:close` | `:365` |

Трите се носечки за целиот reset/fill/hash циклус — `ln-modal:open` е местото каде
`ln-fill:request` се испраќа (`:192`), а `ln-modal:close` е местото каде hash сегментот се
брише (`:371`). Табелата на `README:87-99` наведува седум слушани настани и ги пропушта
токму овие три.

---

### 🟡 UC7 — Схемата носи туѓ атрибут со празни извори, и едно крос-компонентно право на пишување

| атрибут | `direction` | `sources` | забелешка |
|---|---|---|---|
| `data-ln-validate-error` | `null` | **`[]`** | сопственик е `ln-validate` (`src/ln-validate.js:8`); овој фајл **никогаш не го чита** — празните извори се доказ дека генераторот нашол нула појави |
| `data-ln-modal-mode` | **`both`** | `src/…` | сопственик е `ln-modal`; координаторот го **пишува** на пет места |
| `data-ln-modal` / `-modal-for` | `author` | `src/…` | туѓи, но навистина читани |
| `data-ln-field` / `-fill-id` | `author` | `src/…` | туѓи (`ln-fill`, `ln-list`), навистина читани |

`data-ln-validate-error` со `"sources": []` е **вториот таков случај** по
`ln-table`-овиот `data-ln-table-filter-col` — рачно внесен запис што преживува секоја
регенерација, зашто `sync-ln-schemas` не брише туѓи клучеви.

`data-ln-modal-mode` со `both` е истиот образец како `ln-table-coordinator` TC6: две схеми
тврдат право на пишување врз ист атрибут, и CI портата не го разликува „читам туѓ" од
„поседувам".

**Плус:** README нема `## 🔧 Internals` — четири нумерирани секции и крај. **SYS-22**,
една од девет. За фајл со десет модулни слушачи, реентранс-заштита, посвојување на SSR
модали и наследување на речници, отсуството е поостро отколку кај другите осум.

---

### 🔵 P1 — Уште една послаба копија на `shouldIgnoreClick`

`:97` — `if (e.ctrlKey || e.metaKey || e.button === 1) return;`

Наспроти `ln-core`-овиот примитив: нема `shiftKey`, нема `altKey`, и `button !== 0` е
стеснето на `button === 1`. Значи shift-клик и десен клик врз `[data-ln-modal-for]` го
отвораат модалот и прават `preventDefault` (`:105`).

**SYS-18**, шести случај.

---

### 🔵 P2 — `CSS.escape` на едно место од три

`:41` — `wrapper.querySelector('#' + CSS.escape(modalId) + '[data-ln-modal], …')` — заштитен.
`:45` — `document.querySelector('[data-ln-modal="' + modalId + '"]')` — не.
`:60` — без id воопшто.

Истиот `modalId` поминува низ трите. Ако заштитата е потребна на првото место, потребна е
и на второто.

---

### 🔵 P3 — Dev SCSS е празен блок со коментар

```scss
[data-ln-debug] {
	// Dev diagnostics for ln-ui-coordinator
	[data-ln-ui-coordinator] {
		// Valid anywhere (dialog, section, main, body, container)
	}
}
```

Осум линии, нула правила. Единствената функција што ја врши е да го внесе `data-ln-debug`
во схемата на компонентата. Спореди со `ln-chart-dev.scss` (четири вистински проверки) или
`ln-sortable-dev.scss` (две).

---

### 🔵 P4 — `_inSync` е модулна состојба споделена меѓу сите координатори

`:201` — `let _inSync = false;` на модулно ниво. Тоа е конзистентно со тоа дека
`_syncHashModals` е модулна функција што скенира `document.querySelectorAll('[data-ln-modal][id]')`
(`:206`) — значи синхронизацијата е глобална по дизајн, не по инстанца. Заведено само
за да се знае дека овде „нема изолација меѓу host-ови" е намерно, за разлика од
`ln-table-coordinator` каде изолацијата е ветување.

---

### 🔵 P5 — Нема `ln-ui-coordinator:destroyed`

**SYS-23.** Овде е помалку значајно отколку кај другите: `destroy()` (`:388`) и онака
нема набљудливо дејство (UC5).

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-ui-coordinator` | `:4`, `:384` | ⚠️ `:62` — „Activates" е неточно (UC5) | ✅ `author` |
| `data-ln-ui-coordinator-dict` | `:6`, `:384` | ✅ `:63`, `:70-81` | ✅ (`direction: null`) |
| `data-ln-modal-for` | `:100`, `:102` | ✅ `:64` | ✅ `author` |
| `data-ln-modal-mode` | `:120-123`, `:191`, `:194`, `:218` | ✅ `:65` | ⚠️ туѓ, `both` (UC7) |
| `data-ln-modal` | `:40`, `:45`, `:52`, `:60`, `:132` | ⚠️ само во примерот `:46` | ⚠️ туѓ |
| `data-ln-fill-id` | `:71` | ⚠️ `:66` како `data-ln-fill-*` | ⚠️ туѓ |
| `data-ln-field` | `:80` | ❌ неспомнат | ⚠️ туѓ |
| `data-ln-validate-error` | ❌ **нула појави** | ❌ | ⚠️ `sources: []` (UC7) |
| `data-ln-modal-*` (trigger dataset) | `:109-116` | ⚠️ само како `data-ln-fill-*` на `:66` — различен префикс | ❌ невидлив за скенерот |
| `click` слушан | `:96` | ✅ `:93` | n/a |
| `submit` слушан | ❌ **не постои** | ✅ `:94` (UC6) | n/a |
| `hashchange` слушан | `:253` | ✅ `:95` | n/a |
| `ln-ajax:success` / `:error` | `:329`, `:330` | ✅ `:96-97` | n/a |
| `ln-upload:invalid` / `:error` | `:360`, `:361` | ✅ `:98-99` | n/a |
| `ln-modal:before-open` | `:164` | ❌ недокументиран (UC6) | n/a |
| `ln-modal:open` | `:176` | ❌ недокументиран (UC6) | n/a |
| `ln-modal:close` | `:365` | ❌ недокументиран (UC6) | n/a |
| `DOMContentLoaded` | `:261` | ❌ недокументиран | n/a |
| `ln-modal:request-open/-close` | `:141`, `:134`, `:220`, `:230`, `:291` | ✅ `:89-90` | n/a |
| `ln-fill:request` | `:192`, `:224` | ✅ `:91` | n/a |
| `ln-toast:enqueue` | `:277`, `:305`, `:312`, `:319`, `:340`, `:353` | ✅ `:92` | n/a |
| `ln-ui-coordinator:destroyed` | ❌ | ❌ | n/a |
| `## 🔧 Internals` | — | ❌ отсутна (UC7) | n/a |

---

## Затечена состојба

### Ова е сервис со компонентна обвивка, не координатор

Спореди ги двата координатора аудитирани досега:

| | `ln-table-coordinator` | `ln-ui-coordinator` |
|---|---|---|
| слушачи на `self.dom` | 2 | **0** |
| слушачи на `document`/`window` | 1 (со образложение) | **10** (без ниту едно) |
| што држи инстанцата | `_handlers` | само `dict` |
| `destroy()` | ги трга обата слушачи | празни речник |
| изолација меѓу host-ови | ветена и одржана | нема, и е намерно |

Обете носат „coordinator" во името и обете се во истиот слој. Тоа не е наод против овој
фајл — `data-flow.md:344-345` го дозволува bubble-фазниот `document` облик — туку
затечена разлика што вреди да се именува пред слојот да се суди како целина.

### Речникот е испорачан, резервните вредности не

Десетте клуча во `README:28-39` даваат целосен превод. Значи авторот што го препишува
блупринтот нема проблем. Проблемот (UC2) го погодува кодот што работи **без** координаторски
host — што е точно она што демото го прави за сите седум модали.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:383`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ нема нумерички атрибут |
| SYS-3 (Internals → компајлиран bundle) | n/a — нема Internals (UC7) |
| SYS-7 (`.hidden` / `.sr-only`) | ✅ не пишува класи |
| SYS-8 (сиров `console.error`) | ✅ нула `console.*` |
| SYS-11 (BEM `__`) | ✅ нула |
| SYS-24 (state класа без CSS) | ✅ не пали ниту една класа |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| сопствен `MutationObserver` | ✅ нула |
| сите увози употребени | ✅ осум увоза, осум употребени |

---

## Отворени прашања за тебе

1. **UC1 — `data-flow.md:669-671` се поправа како?** Реченицата ја именува погрешната
   компонента и тврди „no coordinator JS needed" за нешто што без координатор не работи.
   Ако одговорноста треба да се врати во `ln-modal` (како што документот вели), тоа е
   преселба на ~60 линии; ако документот се поправа, треба да каже дека
   `ln-ui-coordinator` е задолжителен за `[data-ln-modal-for]`.

2. **UC2 — осумте резервни реченици.** Трите опции: празен стринг (како што веќе е за
   два од четирите наслови), клуч-име како видлив недостаток, или речникот станува
   задолжителен и компонентата тивко не испраќа toast без него.

3. **UC3 — `window.lnCore.lnFill` се заменува со увоз?** Тоа ја брише и недостижната
   `form.reset()` гранка — освен ако таа е наменета како вистинска алтернатива, во кој
   случај треба достижен услов.

4. **UC4 — последното ниво на `_findTargetModal`.** Отворање случаен модал при печатна
   грешка е полошо од ништо. И: дали нивоата 1, 2 и 5 воопшто треба да постојат, ако
   демото ги прави недостижни со тоа што го става координаторот на самиот дијалог?

5. **UC5 — што значи `data-ln-ui-coordinator`?** Ако е само речник-host, README:62 и самото
   име се погрешни. Ако треба да е порта за оркестрацијата, тогаш десетте модулни слушачи
   треба да проверуваат дали настанот потекнува од координаторско поддрво.

6. **UC7 — двата `sources: []` записи** (`ln-table` и овде). Треба ли
   `sync-ln-schemas:check` да паѓа кога атрибут има празни извори, наместо да го носи
   низ CI портата?

---

**Наоди:** 🔴 0 · 🟠 4 · 🟡 3 · 🔵 5
