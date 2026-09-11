# Аудит — ln-translations

2026-09-11 · Опсег: `src/ln-translations.js` (280), `README.md` (118), schema · Итерација 30/50

## Вердикт

Координатор што ги почитува сите правила за комуникација — води туѓа компонента само
преку нејзин атрибут, клонира само од авторски `<template>`, и има откажлива порта пред
секоја мутација. Но клоновите што ги создава завршуваат **внатре во `<label>`-от на
оригиналот**, го наследуваат неговиот `value` атрибут, и ниту еден од петте јавни
методи не е документиран.

## Што е добро

**Води туѓа компонента исклучиво преку атрибут.** `:114-115`:

```js
if (self.menuEl.getAttribute('data-ln-toggle') === 'open') {
	self.menuEl.setAttribute('data-ln-toggle', 'close');
}
```

Нема `menuEl.lnToggle.close()`, нема увоз на `ln-dropdown`. `DOCTRINE.md` §2:

> Coordinators … orchestrate state across components strictly via `setAttribute` or
> request events. … Components **NEVER** import or reference sibling components.

Проверено: нула увози на браќа (`:1` зема само од `ln-core`). И `data-ln-toggle` е
точниот атрибут — `ln-dropdown/README.md:40` го изнесува како свој јавен договор, и по
миграцијата на Popover API тој договор е непроменет (`ln-dropdown.js:39-47`).

**Двата шаблона се авторски, ниту еден јазол не се создава.** `cloneTemplate` на
`:104` и `:139`, со целосни примери во README:46-56. Нула `createElement` во 280 линии
— и тоа во компонента чија единствена работа е да произведува DOM.

**Откажлива порта пред двете мутации**, со симетричен пар:
`:before-add`/`:added` (`:168`, `:222`) и `:before-remove`/`:removed` (`:230`, `:245`).
Плус влезни команди за обете (`:50-51`). Целосна CQS површина во двата правца.

**`getActiveLanguages()` враќа копија** (`:251`):

```js
return new Set(this.activeLanguages);
```

Внатрешната состојба не може да се измени однадвор. Единствената компонента досега
што го прави тоа кај колекциски getter.

**README:110 објаснува ЗОШТО, не што:**

> Original (default-language) inputs are tagged `data-ln-translatable-lang="{defaultLang}"`
> at init **specifically so `removeLanguage` never matches and removes them**.

Тоа е точно прашањето што читателот ќе го постави гледајќи го `_applyDefaultLang`, и е
одговорено на местото каде се поставува.

**Двете кориснички ознаки се атрибути со `{lang}` токен** (`:23-24`,
`data-ln-translations-placeholder` / `-remove-label`), точно како што бара конвенцијата
за единечна UI низа. Обете се документирани со стандардната вредност (README:72-73).

**`hasOwnProperty` гард во `for…in`** (`:100`) — единствениот `for…in` во ревидираниот
код, и единствениот што го носи гардот.

**`this.dom = dom` е првиот исказ** (`:20`). SYS-1 не важи.

## Наоди

### 🟠 TR1 — Клонираните полиња се вметнуваат во `<label>`-от на оригиналот

**Каде:** `:214-216` во спрега со `README.md:39-42`

```js
const insertAfter = existing.length > 0 ? existing[existing.length - 1] : original;
insertAfter.parentNode.insertBefore(clone, insertAfter.nextSibling);
```

Точката на вметнување е **родителот на оригиналното поле**. Минималниот пример на
самото README го прави тој родител `<label>`:

```html
<div data-ln-translatable="description">
  <label>Description <textarea name="description">Acme scope...</textarea></label>
</div>
```

Значи првиот клон влегува внатре во тој `<label>`, вториот по него, и така натаму.

По HTML спецификацијата, `<label>` без `for` се врзува за **првиот** контрола-потомок.
Сите клонови остануваат неозначени — единственото нешто што ги опишува е
`placeholder`-от (`:206-208`), а placeholder не е достапно име за помошна технологија.

`DOCTRINE.md:78`:

> **Controls & Actions:** MUST use `<button type="button">` / `<button type="submit">`,
> **`<label>`**, `<fieldset>`, `<legend>`.

README:97 изречно ја пропишува структурата што го предизвикува ова:

> `data-ln-translatable` must sit on the parent container … wrapping the default
> `<input>`/**`<label>`**, not on the input itself.

Значи обвивката го обвиткува label-от, а вметнувањето е релативно на **полето**, не на
обвивката. Двете одлуки се документирани; нивниот производ не е.

**Достижност:** секоја форма што го следи блупринтот. Имплицитниот `<label>` што
обвиткува контрола е препорачаниот образец во README-то.

### 🟠 TR2 — Клонот го наследува `value` атрибутот, па `reset()` ги полни преводите со изворниот текст

**Каде:** `:190-203`

```js
const clone = original.cloneNode(original.tagName === 'SELECT');
…
clone.value = (values[field] !== undefined) ? values[field] : '';
…
clone.removeAttribute('id');
```

`cloneNode` ги копира **сите атрибути**. За серверски испечатено
`<input name="title" value="Наслов">` клонот го носи `value="Наслов"`, а `:200` ја
поставува само IDL вредноста (`.value = ''`). Тие се две различни работи: атрибутот е
`defaultValue`, својството е тековната вредност.

Резултат: `form.reset()` го брише dirty знаменцето и секое поле се враќа на својот
`defaultValue`. За клонот тоа е **текстот на изворниот јазик**. Корисник што додал
превод, потоа притиснал Reset, добива форма каде секое преводно поле го содржи
англискиот оригинал — и ако не забележи, го снима како превод.

Истиот механизам носи и втора последица: `required` се копира. `<input required>` значи
дека **секој додаден јазик станува задолжителен**, па формата не може да се прати додека
сите преводи не се пополнети. Ниту README-то ниту `data-ln-translations-*` не нудат
начин да се исклучи.

README:108 го опишува чекорот точно како што кодот го прави — *„clone the original
input …, rename …, **strip `id`**, apply the placeholder template, tag …"* — и го
набројува единствениот атрибут што се симнува. Пописот е точен; она што недостасува е
последицата од атрибутите што остануваат.

**Достижност:** серверски испечатена edit форма со `value` е основниот случај на
библиотеката (`ln-form._applyActionMode`, `lnFill`). `<button type="reset">` е во
`ln-autosave`-овиот договор како прворедна патека (`:138`).

### 🟠 TR3 — Ниту еден од петте јавни методи не е документиран

**Каде:** `:164`, `:227`, `:250`, `:254`, `:258` наспроти цел `README.md`

Компонентата изнесува:

| метод | линија |
|---|---|
| `addLanguage(lang, values)` | `:164` |
| `removeLanguage(lang)` | `:227` |
| `getActiveLanguages()` | `:250` |
| `hasLanguage(lang)` | `:254` |
| `destroy()` | `:258` |

README-то нема секција за JS API. Има табела на атрибути (`:65-76`), попис на настани
(`:80-90`) и Common Pitfalls (`:94-98`) — ниту еден ред за инстанцата. Секоја друга
компонента во слојот за форми (`ln-form`, `ln-validate`, `ln-number`, `ln-editor`,
`ln-upload`, `ln-autosave`) има таква секција.

Најскапото испуштено е **вториот параметар на `addLanguage`**:

```js
_component.prototype.addLanguage = function (lang, values) {
	…
	clone.value = (values[field] !== undefined) ? values[field] : '';
```

`values` е единствениот начин преводно поле да се создаде со содржина — точно она што
треба кога преводите пристигнуваат од API. И **не е достапен преку настан**: влезната
команда (`:44-46`) чита само `e.detail.lang` и го испушта остатокот од `detail`.

Значи полнење преку настан е невозможно, полнење преку метод е недокументирано, а
`README.md:5` ја продава компонентата токму со *„handles pre-rendered server payloads
automatically"*.

### 🟠 TR4 — Три јазични имиња зашиени во JS

**Каде:** `:11-15`

```js
const DEFAULT_LOCALES = {
	en: 'English',
	sq: 'Shqip',
	sr: 'Srpski'
};
```

`DOCTRINE.md:73`:

> **Zero Display Text in JS:** Hardcoded UI text/labels in JS are strictly forbidden.

Тие низи излегуваат директно на екран — `:108` (`btn.textContent = this.locales[lang]`)
и `:145` (етикета на беџ).

Разликата од другите две зашиени низи во истиот фајл е суштинска.
`'{lang} translation'` (`:23`) и `'Remove {lang}'` (`:24`) се **резерви** зад
атрибут — истиот образец што `component-guide.md:131` го дозволува
(*„fallback only for dev, Blade always provides"*). `DEFAULT_LOCALES` не е резерва за
текст: тој го одредува **кои јазици воопшто постојат** во менито. Консумент што не го
постави `data-ln-translations-locales` не добива непреведена етикета — добива продуктна
одлука: три јазици, избрани во библиотеката.

`DOCTRINE.md:74` го носи единствениот исклучок и тој е за симболи на мерни единици.

Петто појавување на SYS-13, и прво каде зашиената низа е податок, не етикета.

### 🟠 TR5 — Менито се бара со построг селектор од оној на компонентата што го поседува

**Каде:** `:26` наспроти `ln-dropdown/src/ln-dropdown.js:16`

```js
// ln-translations:26
this.menuEl = dom.querySelector('[data-ln-dropdown] > [data-ln-toggle]');
```

```js
// ln-dropdown:16  — сопственикот на договорот
this.toggleEl = dom.querySelector('[data-ln-toggle]');
```

Сопственикот бара **потомок**; консументот бара **директно дете**. Денес обете наоѓаат
исто, зашто блупринтот на `ln-dropdown` (README:23-28) го става менито како директно
дете. Но секоја обвивка меѓу нив — `<div class="menu-scroll">`, обичен `<nav>` —
го задржува `ln-dropdown` функционален и го гаси `ln-translations`.

Отказот е тивок: `_updateDropdown` излегува на првиот ред (`:93`,
`if (!this.menuEl) return;`). Нема предупредување, нема dev афорданс. Резултатот е
копче што отвора празно мени — и ниту едно од двете правила во
`ln-translations-dev.scss` не го покрива тој случај.

Пошироката забелешка: компонентата ја пре-изведува структурата на `ln-dropdown` наместо
да бара сопствен атрибут за монтирање. `data-ln-translations-active` (`:25`) е точно
таквиот атрибут за беџовите; менито го нема својот еквивалент.

### 🟡 TR6 — `destroy()` ги остава живи контролите што создаваат клонови

**Каде:** `:258-275`

```js
_component.prototype.destroy = function () {
	if (!this.dom[DOM_ATTRIBUTE]) return;
	// ги брише клоновите
	// ги симнува двата слушача за команди
	delete this.dom[DOM_ATTRIBUTE];
};
```

Што останува:

| работа | состојба по `destroy()` |
|---|---|
| копчиња во менито (`:110-118` со `click` слушач) | остануваат во DOM, слушачот ја држи `self` |
| беџови (`:151-156` со `click` слушач) | остануваат |
| `this.activeLanguages` | непразна |
| `data-ln-translatable-lang` на **авторските** полиња (`:68`) | останува |
| `triggerBtn.hidden` (`:126`) | останува како што било |
| `ln-translations:destroyed` | **не се испраќа** |

Клик на останато копче во менито вика `self.addLanguage(lang)` врз уништената инстанца
— која сè уште ја има состојбата и сè уште клонира полиња. А бидејќи
`dom[DOM_ATTRIBUTE]` е избришан, `findElements` може да создаде **втора** инстанца врз
истата форма; двете потоа пишуваат во ист DOM.

Достижноста е ниска — `destroy()` не е документиран (TR3), па единствениот пат е
removedNodes гранката, каде формата е веќе откачена. Но отсуството на
`ln-translations:destroyed` е безусловно: секоја друга компонента во слојот го
испраќа, и координатор што слуша за расчистување тука не добива ништо.

### 🟡 TR7 — SYS-3, SYS-4 и глобален наместо scoped шаблон

**Каде:** `README.md:104`, `:118`, и `:104`/`:139` во изворот

> Source: `components/ln-translations/ln-translations.js`

Компајлиран бандл (16 502 бајти). Изворот е `src/ln-translations.js` (280 линии).
Деветто појавување на SYS-3.

> A single shared observer … watches `childList` … and **`attributes`** for the
> attribute landing on an existing element

По `3628e7d` нема `attributeFilter`. Заклучокот останува точен, механизмот не. Шесто
појавување на SYS-4.

`cloneTemplate(name, tag)` (`:104`, `:139`) бара **глобален** `<template>`.
`ln-editor:547` и `ln-upload:285` користат `cloneTemplateScoped(root, …)`, кој прво
бара локален и паѓа на глобалниот — строго поширок, без цена. Тука тоа би значело две
форми на иста страница да можат да имаат различно преведени беџови.

### 🟡 TR8 — `:added` носи поле што README-то не го наведува

**Каде:** `:222-224` наспроти `README.md:85-86`

```js
dispatch(this.dom, 'ln-translations:added', {
	target: this.dom, lang: lang, langName: langName
});
```

README:

> **`ln-translations:added`** / **`ln-translations:removed`**
>   - Detail: `{ target, lang }`

`langName` — разрешеното прикажно име — постои во `:added` и го нема во `:removed`
(`:245-247`). README-то ги спојува двата настана во еден ред со еден `detail`, па ниту
присуството во едниот ниту отсуството во другиот не се видливи. Консумент што пишува
известување „Додаден {јазик}" мора да го открие полето со читање на изворот.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `if (e.ctrlKey \|\| e.metaKey \|\| e.button === 1) return;` двапати (`:111`, `:152`), без `shiftKey`, `altKey` и другите копчиња — `shouldIgnoreClick` (`helpers.js:365`) ги покрива сите четири. Петта и шеста појава на SYS-18. Дополнително: обете се на `<button>`, каде модифициран клик нема нативно значење — гардот е пренесен од контекст на врски во контекст каде не значи ништо. | `:111,152` |
| P2 | `if (!frag) return;` (`:105`) е внатре во јамката што го гради менито. Недостасувачки шаблон го прекинува целото градење на половина, но `availableCount` веќе е зголемен (`:102`), па `triggerBtn.hidden` (`:126`) никогаш не се доиспишува — копчето останува во претходната состојба. `_updateBadges` (`:140`) го прави истото со `return` од `forEach` callback, што таму прескокнува **еден** беџ наместо да прекине — две различни семантики за иста проверка. | `:105`, `:140` |
| P3 | `this.locales = DEFAULT_LOCALES;` (`:30`) го доделува модулскиот објект по референца. Денес ништо не го мутира, но секоја инстанца без сопствен `data-ln-translations-locales` го дели истиот објект. | `:30` |
| P4 | `_applyDefaultLang` (`:61-71`) пишува `data-ln-translatable-lang` врз **авторските** полиња, а `destroy()` (`:265`) изречно ги прескокнува при чистењето. Тоа е намерно (README:110 објаснува зошто атрибутот е потребен), но значи дека `destroy()` не ја враќа почетната состојба на маркапот. | `:68`, `:265` |
| P5 | `existing[existing.length - 1]` (`:215`) го бара последниот клон со `querySelectorAll` низ **целата форма** (`this.dom.querySelectorAll` на `:214` е всушност `wrapper.querySelectorAll` — опсегот е точен), но селекторот интерполира `this.defaultLang` без екранирање. Празен `defaultLang` дава `[data-ln-translatable-lang]:not([data-ln-translatable-lang=""])`, што е валидно; вредност со наводник би фрлила. `ln-fill:27` е единствената компонента што користи `CSS.escape`. | `:214` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-translations` | `:4` | ✅ | ✅ |
| `data-ln-translations-default` | `:22` | ✅ | ✅ |
| `data-ln-translations-locales` | `:29` | ✅ со пример JSON | ✅ |
| `data-ln-translations-placeholder` | `:23,207` | ✅ со стандардна вредност | ✅ |
| `data-ln-translations-remove-label` | `:24,149` | ✅ со стандардна вредност | ✅ |
| `data-ln-translations-active` | `:25` | ✅ | ✅ |
| `data-ln-translations-add` | `:124` | ✅ | ✅ |
| `data-ln-translations-lang` | `:106,141` | ⚠️ само во шаблоните | ✅ `both` |
| `data-ln-translations-prefix` | `:180` | ✅ со пример за вгнездување | ✅ |
| `data-ln-translatable` | `:64,177` | ✅ + Pitfall за поставеност | ✅ |
| `data-ln-translatable-lang` | `:68,211` | ✅ | ✅ `both` |
| `data-ln-dropdown` (туѓ) | `:26` | ✅ во блупринтот | ✅ (туѓ префикс) |
| `data-ln-toggle` (туѓ, се пишува) | `:26,114-115` | ✅ во блупринтот | ✅ `both` |
| `data-ln-debug` | само `-dev.scss` | ❌ | ✅ |
| `ln-translations:before-add` / `:before-remove` | `:168,230` | ✅ cancelable | н/п |
| `ln-translations:added` | `:222` `{target,lang,langName}` | ❌ наведено `{target,lang}` | н/п |
| `ln-translations:removed` | `:245` `{target,lang}` | ✅ | н/п |
| `ln-translations:request-add` / `-remove` | `:50-51` | ✅ | н/п |
| `ln-translations:destroyed` | **не се испраќа** | — | н/п |
| `addLanguage` / `removeLanguage` / `getActiveLanguages` / `hasLanguage` / `destroy` | сите јавни | ❌ нема секција за API | н/п |
| `addLanguage(lang, **values**)` | `:164,200` | ❌ | н/п |
| име `trans[lang][field]` | `:194,196` | ✅ со обете форми | н/п |
| `<template data-ln-template="ln-translations-badge">` | `:139` | ✅ целосен | н/п |
| `<template data-ln-template="ln-translations-menu-item">` | `:104` | ✅ целосен | н/п |
| Internals извор | `src/ln-translations.js` | ❌ покажува на bundle | н/п |

## Затечена состојба

**Схемата декларира два туѓи атрибута, и тоа е точно.** `data-ln-dropdown` и
`data-ln-toggle` се во `ln-translations.schema.json` затоа што изворот навистина ги
чита и пишува (`:26`, `:114-115`). За разлика од SYS-15 случаите — каде атрибутот
доаѓа само од ко-лоциран SCSS — овде декларацијата го одразува вистинскиот договор:
координатор што води соседна компонента преку нејзиниот јавен атрибут. Тоа е она што
схемата треба да го фаќа.

**Нема `*-model.js`.** `_updateDropdown`, `_updateBadges` и делот од `addLanguage` што
го составува името (`:193-197`) се чиста логика над стрингови. Втора компонента по
`ln-editor` со нетривијална чиста логика оставена внатре во IIFE-от, и нема тест во
`tests/`.

**Стандардниот сет јазици е `en, sq, sr`** — англиски, албански, српски. Библиотеката
испорачува вграден `mk` резервен речник во `ln-core` (`helpers.js:1012`), но
македонскиот не е во стандардното мени. Не е наод — е производна одлука што случајно
живее во JS (TR4).

Конзолен излез: еден `console.warn` (`:33`), со `[ln-translations]` префикс, значи зад
гејтот. Inline стил: нула. `createElement`: нула.
