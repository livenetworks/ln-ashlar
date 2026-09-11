# Аудит — ln-editor

2026-09-11 · Опсег: `src/ln-editor.js` (659), `README.md` (274), schema · Итерација 27/50

## Вердикт

Најголемата компонента досега, со најдобро документиран внатрешен тек и најсериозниот
наод во кампањата: **чистачот на paste пропушта сè што е вгнездено во недозволен таг.**
`<span>` — најчестата обвивка во копиран текст од Word и веб — го отвора патот, а
README-то ја опишува токму инваријантата што кодот ја нема.

## Што е добро

**Ловот на двојно испраќање е завршен и запишан.** Пет одделни коментари
(`:262-264`, `:591-592`, `:601-602`, `:608-609`, `:616`) објаснуваат за секој пат
**зошто** таму се диспечира или не се диспечира `ln-editor:changed`:

```js
// execCommand-driven edits fire a native input → _onInput dispatches
// 'changed'. Do NOT dispatch here (was A1 double-fire).
```

```js
// rel lands after _onInput already captured innerHTML —
// silently re-sync the textarea, no second dispatch.
```

Ниту еден друг фајл во репото не носи такво расудување за настанската сметка.
Разликата меѓу „execCommand патот пали нативен `input`" и „голиот `setAttribute` не
пали" е точно она што следниот читател би го промашил.

**Popover-от е клониран од авторски `<template>`, не создаден.** `:547`
`cloneTemplateScoped(instance.dom, 'ln-editor-link-popover', 'ln-editor')`, а
`:548-550` излегуваат тивко ако го нема. README:266 го изнесува како договор —
*„the editor never generates this markup"* — и README:109-125 бара од консументот да
го напише. Тоа е `mindset.md:25` испочитуван буквално.

**`cloneTemplateScoped` со локален приоритет** значи дека две различни форми на иста
страница можат да имаат различни popover-и, со различен јазик, без ниту еден атрибут
за конфигурација.

**ARIA-та е комплетна и жива.** `role="textbox"` + `aria-multiline` (`:71-72`),
`aria-labelledby` пренесен од `<label for>` со создавање на id ако недостасува
(`:78-85`), `aria-controls` од toolbar кон surface (`:106`), и `aria-pressed`
засеан на `false` при init (`:110`) па ажуриран на секоја промена на селекција
(`:305-307`). `_isToggleAction` (`:44-47`) изречно ги исклучува еднократните
дејства — `unlink` и `clear` не добиваат `aria-pressed`, што е точното читање на
спецификацијата.

**`mousedown` → `preventDefault()` пред `click`** (`:123-127`). Без тоа кликот на
toolbar-от ја краде фокусот од surface-от и селекцијата исчезнува пред командата да
се изврши. README:254 ја кажува причината со зборови.

**`destroy()` е null-безбеден низ целата должина.** Конструкторот излегува рано
кога нема `<textarea>` (`:56-59`), но `this.dom = dom` е на `:51` — пред bail-от —
па SYS-1 не важи. И секоја гранка во `destroy()` (`:335`, `:345`, `:353`, `:359`,
`:367`) проверува пред да допре. Тоа е втората компонента што bail-от го прави
правилно, по `ln-include`.

**Двонасочниот sync нема јамка.** `_syncToTextarea` (`:225`) поставува
`textarea.value` програмски, што **не** пали нативен `input`, па
`_onTextareaInput` (`:163`) не се буди. А кога `ln-form` испраќа синтетички `input`
врз textarea-та, `:164` споредува пред да пишува. Двојна заштита, ниту една излишна.

**`_onFormReset` со `setTimeout(…, 0)`** (`:206-214`) — единствениот начин да се
прочита вредноста **по** нативниот reset. Точна техника.

## Наоди

### 🔴 E1 — Чистачот на paste не ги проверува децата на отстранетите тагови

**Каде:** `:460-505`, конкретно снимката на `:461`

```js
function _walkAndSanitize(node) {
	const children = Array.from(node.childNodes);        // ← снимка
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		…
		if (!ALLOWED_TAGS[child.tagName]) {
			while (child.firstChild) {
				node.insertBefore(child.firstChild, child);   // ← децата се
			}                                                  //   промовираат
			node.removeChild(child);
		} else {
			…строгање на атрибути…
			_walkAndSanitize(child);                       // ← рекурзија САМО
		}                                                  //   во дозволени
	}
}
```

`children` е снимена **пред** јамката. Кога недозволен таг се одвиткува, неговите
деца влегуваат во `node` — но не се во снимката, па јамката никогаш не стигнува до
нив. Не се проверуваат, не им се строгаат атрибутите, и не се рекурзира во нив.

Резултат од верна симулација на алгоритамот (`node -e`, идентична контрола на текот):

| влез | излез од чистачот |
|---|---|
| `<span><img src=x onerror=alert(1)></span>` | `<img src="x" onerror="alert(1)">` |
| `<span><script>alert(1)</script></span>` | `<script>alert(1)</script>` |
| `<span style="…"><b style="color:red">Word text</b></span>` | `<b style="color:red">Word text</b>` |
| `<p><b style="color:red">ok</b></p>` *(контрола)* | `<p><b>ok</b></p>` ✅ |

Контролниот ред покажува дека чистачот работи — **сè додека нема ниту еден
недозволен таг во патеката**. Една обвивка е доволна.

**README-то ја тврди спротивната инваријанта.** `README.md:262`:

> disallowed tags are unwrapped (replaced by their children) **and recursion continues**

Рекурзијата не продолжува. Тоа е најсилниот доказ дека однесувањето е ненамерно —
документот го опишува алгоритамот што е замислен, а снимката на `:461` го спречува.

**Достижност — секој paste од богат извор.** `<span>` не е во `ALLOWED_TAGS`
(`:10-15`) и е најчестата обвивка што ја произведуваат Word, Google Docs и секоја
веб страница. Значи:

- **секојдневната манифестација:** `style`, `class` и `lang` преживуваат на сè што
  било вгнездено во `<span>`/`<font>`/`<o:p>`. Тоа е точно она што чистачот постои
  да го спречи, и е inline стил што `CLAUDE.md` го забранува.
- **безбедносната:** `<a>` со `javascript:` href вгнезден во `<span>` ја заобиколува
  проверката на `:488` целосно — таа гранка воопшто не се извршува за него.
- **извршната:** `<span><img src=x onerror=…>` го задржува ракувачот, а
  `execCommand('insertHTML')` (`:446`) го вметнува во жив документ.

README:190 му ветува на консументот:

> Content pasted from external sources (Word, web pages) is sanitized to a safe HTML
> subset — unsafe tags and attributes are stripped

Тагот се строга, атрибутите на неговите деца не.

### 🔴 E2 — Недовереното HTML се парсира во жив DOM пред да се исчисти

**Каде:** `:453-458`

```js
function _sanitizeHTML(html) {
	const container = document.createElement('div');
	container.innerHTML = html;          // ← парсирање во жив документ
	_walkAndSanitize(container);
	return container.innerHTML;
}
```

`innerHTML` врз `<div>` — дури и откачен — е парсирање во **живиот** документ.
`<script>` не се извршува по спецификација, но медиумските ракувачи да:
`<img src=x onerror=…>`, `<video onerror>`, `<source onerror>` палат веднаш штом
парсерот го создаде јазолот, пред `_walkAndSanitize` да го погледне. Истото важи и
за мрежните барања — секој `src` во залепениот HTML праќа барање кон адреса што ја
контролира изворот на копирањето.

Значи товарот се извршува на `:455`, **една линија пред** чистачот воопшто да
почне. E1 го одредува што преживува во документот; E2 одредува што се извршува веднаш.

Инертната алтернатива (`DOMParser.parseFromString(html, 'text/html')`) постои и не
бара зависност, но изборот е твој — аудитот не поправа.

**Достижност:** истата — секој `paste` во surface-от. `_handlePaste` (`:420`) е врзан
безусловно на `:175`.

### 🟠 E3 — Површината за уредување се создава од JS, не се клонира

**Каде:** `:68-102`

```js
this._surface = document.createElement('div');
this._surface.className = 'ln-editor__surface';
this._surface.setAttribute('contenteditable', 'true');
this._surface.setAttribute('role', 'textbox');
…
dom.insertBefore(this._surface, toolbar.nextSibling);
```

`mindset.md:25`:

> **Ashlar way:** HTML is authored, complete, and semantic. **JS never creates UI
> chrome** — buttons, labels, option lists, popover content. `<template>` exists for
> data-driven row repetition only, not for UI structure.

Површината за уредување е UI школка — таа е видливото поле во кое корисникот пишува,
таа ја носи ARIA-та и таа е стилизирана.

Особеното овде е дека **истата компонента го знае правилото**: popover-от се клонира
од `<template>` (`:547`), а README:266 тоа го изнесува како принцип. Значи два
елемента од иста компонента, две спротивни одлуки, без запишана причина за разликата.

Две последици:

- **`ln-editor__surface` е BEM компаунд создаден од JS**, а README:232 му кажува на
  консументот да пишува `> .ln-editor__surface` во сопствениот SCSS. Значи класа што
  JS ја измислува е документиран API за стилизирање. SYS-11, и втора појава во оваа
  компонента заедно со `.ln-editor__link-popover` (`:370`).
- **SSR граница.** Без JS textarea-та работи (README:3 го тврди тоа за прогресивното
  подобрување ✅), но не постои начин консументот да ја авторира површината — за
  разлика од сите останати делови на компонентата.

### 🟠 E4 — `data-placeholder` е библиотечна состојба надвор од `data-ln-*`

**Каде:** `:73-75`, консумирано во `theme/config/mixins/_editor.scss:101`

```js
if (placeholder) {
	this._surface.setAttribute('data-placeholder', placeholder);
}
```

```scss
content: attr(data-placeholder);
```

Тоа е вистински договор меѓу два фајла — JS пишува, SCSS чита — во имениот простор
што `sync-ln-schemas` не го скенира. Затоа `ln-editor.schema.json` декларира четири
атрибута, ниту еден од нив `data-placeholder`, и CI портата за drift не може да го
види.

Четврто појавување на SYS-14, по `ln-confirm` (`data-confirming`, `data-tooltip-text`)
и `ln-tabs` (`data-active`).

### 🟡 E5 — Чистачот важи само за paste, а договорот не го кажува тоа

**Каде:** `:91-94`, `:189-200`, `:320-329` наспроти `README.md:190`

Три патеки внесуваат HTML во површината **без** да поминат низ `_sanitizeHTML`:

| патека | извор | ред |
|---|---|---|
| почетна содржина | `textarea.value` (server-rendered) | `:91-93` |
| `ln-editor:set-content` | `e.detail.html` од координатор | `:193` |
| `setHTML(html)` | јавен API | `:323` |

Сите три се `innerHTML =` директно. Тоа е бранлива одлука — серверот е доверлив извор,
а Ashlar доктрината за SSR hydration оди во таа насока. Но README:190 е единственото
место што зборува за чистење, и го зборува така како да е својство на компонентата, не
на еден влез. Табелата на настани (`:135`) и API блокот (`:141-152`) немаат ниту еден
ред за тоа што влегува неисчистено.

Компонента што испорачува чистач ја носи обврската да каже каде тој **не** важи.

### 🟡 E6 — README Internals покажува на компајлираниот bundle

**Каде:** `README.md:242`

> Source: `components/ln-editor/ln-editor.js`

20 965 бајти, build артефакт. Рачно пишаниот извор е `src/ln-editor.js` (659 линии).
Седмо појавување на SYS-3.

### 🟡 E7 — `clear` испраќа непредвидлив број настани

**Каде:** `:257-260` наспроти `README.md:131`

```js
} else if (action === 'clear') {
	document.execCommand('removeFormat', false, null);
	document.execCommand('formatBlock', false, '<p>');
}
```

Двете команди се независни; секоја што навистина менува пали нативен `input`, а
`_onInput` (`:115-121`) диспечира `ln-editor:changed`. Значи еден клик на `clear`
дава **нула, еден или два** `changed` настана, зависно од тоа дали селекцијата веќе
била неформатирана и дали блокот веќе бил `<p>`.

README:131 вели:

> Fires **exactly once** per content mutation

По буквата е точно — две мутации, два настана. Но за секоја друга акција еден клик
значи еден настан, и петте коментари во кодот покажуваат дека токму таа гаранција е
целта. `clear` е единствената акција што не ја исполнува, и е единствената што
испраќа настан чиј број зависи од претходната состојба — што слушач со debounce или
броење не може да предвиди.

### 🟡 E8 — `link` испраќа `before-change` пред popover-от, а вистинската мутација нема порта

**Каде:** `:231-235`, `:253-254` наспроти `:582-619`

`_execAction('link')` испраќа cancelable `ln-editor:before-change` и **потоа** отвора
popover. Popover-от не менува ништо. Вистинската мутација се случува во `_apply`
(`:589-618`) — `setAttribute('href')`, `createLink` или `unlink` — и таму **нема**
`before-change`.

Значи за `link`:
- откажувањето на `before-change` го спречува **отворањето на popover-от**, не
  промената;
- откако popover-от е отворен, промената е неоткажлива.

README:132 го опишува настанот како *„Before a formatting command"*, што за секоја
друга акција е точно и за оваа не е. Коментарот на `:264` го признава дека
*„The 'link' action opens a popover and mutates nothing until _apply"* — но заклучокот
за договорот на настанот не е повлечен.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Секоја инстанца врзува свој `selectionchange` слушач на `document` (`:186`). `_updateActiveStates` прво прави `this.dom.querySelector('[role="toolbar"]')` (`:270`) и **дури потоа** проверува дали селекцијата е во површината (`:277`). Куцањето поместува каре, значи selectionchange на секој знак — па секој притисок прави барем еден `querySelectorAll` по редактор на страницата, вклучувајќи ги и оние во кои никој не пишува. README:258 го опишува обратниот редослед (*„bail if the selection isn't inside the surface, **then** per toggle button check"*). | `:269-279` |
| P2 | Коментарот на `:145-148` го брани случајот „површината е отстранета без `destroy()` (SPA subtree swap)". `registerComponent`-овата removedNodes гранка вика `destroy()` за секој отстранет `[data-ln-editor]` што повеќе не е во документот, па за да се достигне тој случај треба **површината** да се отстрани додека контејнерот останува — што ниту едно место во репото не го прави. | `:144-151` |
| P3 | Проверката на `href` (`:488`) е `/^(https?:\|mailto:\|\/\|#)/` без `i` знаменце. `HTTP://example.com` — валидна врска — не се совпаѓа, па `href`-от се брише. Пресериозно, не небезбедно; но грешката е тивка. | `:488` |
| P4 | `rel="noopener noreferrer"` се додава на секое `<a>` при чистење (`:498`) и при создавање (`:594`, `:610`), а `target` никогаш не се поставува. Без `target="_blank"`, `noopener` е без ефект. | `:498,594,610` |
| P5 | 659 линии без ниту еден `src/*-model.js`. `ALLOWED_TAGS`, `_sanitizeHTML` и `_walkAndSanitize` (`:10-15`, `:453-505`) се чиста логика над стринг — точно обликот што секоја друга компонента го изнесува во модел. И `tests/` нема `ln-editor.test.js`. Дефектот E1 е точно оној што тест над извлечен чистач би го фатил на прв случај. | `:453-505` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-editor` | `:4` | ✅ | ✅ |
| `data-ln-editor-action` | `:107,125,130` | ✅ + целосна табела на 15 дејства | ✅ |
| `data-ln-editor-source` | `:65,363` | ✅ „auto-set … Removed on destroy()" | ✅ `runtime` |
| `data-placeholder` | `:74` | ❌ | ❌ (не е `data-ln-*`) |
| `data-ln-template="ln-editor-link-popover"` | `:547` | ✅ со целосен пример | ❌ (динамички) |
| `data-ln-debug` | само `-dev.scss` | ❌ | ✅ |
| `ln-editor:changed` | 6 места | ✅ „exactly once" | н/п |
| `ln-editor:before-change` (cancelable) | `:231` | ✅ (но види E8) | н/п |
| `ln-editor:focus` / `:blur` | `:154,160` | ✅ | н/п |
| `ln-editor:set-content` | `:201` | ✅ | н/п |
| `ln-editor:destroyed` | `:374` | ✅ | н/п |
| `getHTML()` / `setHTML()` / `destroy()` | `:316,320,331` | ✅ сите три | н/п |
| `.ln-editor__surface` (JS-создадена класа) | `:69` | ✅ како SCSS цел (`:232`) | н/п |
| `.ln-editor-active` (JS state класа) | `:309` | ❌ неспомната | н/п |
| чистач: рекурзија во одвиткани | **не се случува** | ❌ тврди „recursion continues" | н/п |
| чистач важи за `set-content`/`setHTML`/почетна | **не важи** | ❌ неспомнато | н/п |
| Internals извор | `src/ln-editor.js` | ❌ покажува на bundle | н/п |
| редослед на `_updateActiveStates` | toolbar прво, bail второ | ❌ обратно опишан | н/п |

## Затечена состојба

**`document.execCommand` е признаено мртво API, и тоа е запишано.** README:272-274
носи секција **Permanent constraints**: *„`execCommand` is deprecated but functional
across current browsers; no custom undo/redo stack (relies on native); no table or
media embedding support."* Тоа е единствената компонента во репото што има таква
секција. Не е наод — е одлука, изнесена како одлука, и е причината зошто и
`queryCommandState` (`:287`, `:296`) е обвиткан во `try/catch` без порака.

**`.ln-editor-active` е класа што JS ја пишува** (`:309-311`) паралелно со
`aria-pressed`. Префиксирана со `ln-` ✅ значи SYS-6 не важи. Но не е документирана
никаде, а е единствената куката што CSS може да ја користи за визуелно активно
копче — `aria-pressed` би било доволно (`[aria-pressed="true"]`), што би ја сведело
состојбата на едно место наместо две.

**Компонентата нема `*-model.js` и нема тест.** Најголемата компонента ревидирана
досега (659 линии) е и единствената со нетривијална чиста логика оставена внатре во
IIFE-от. `tests/` содржи 33 фајла, ниту еден за `ln-editor`.

Конзолен излез: еден `console.warn` (`:57`), со `[ln-editor]` префикс, значи зад
гејтот. Inline стил: нула. Зашиен кориснички текст: нула — сите ознаки доаѓаат од
авторскиот toolbar и од `<template>`-от, што е точната последица на
`DOCTRINE.md:73`.
