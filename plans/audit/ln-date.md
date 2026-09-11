# Аудит — ln-date

2026-09-11 · Опсег: `src/ln-date.js` (440), `src/date-model.js` (186), `README.md` (199), schema · Итерација 23/50

## Вердикт

Најагресивната DOM хирургија во библиотеката — конструкторот го завиткува полето,
создава два скриени input-а и копче, и го менува типот — и `destroy()` речиси сето
тоа го одмотува. Речиси: текстуалната гранка излегува пред чистењето и остава траен
`document` слушач по секој уништен елемент.

## Што е добро

**Конструкторот се самододелува пред `findElements`** (`:66-67`):

```js
if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
dom[DOM_ATTRIBUTE] = this;
```

Тоа не е стил — тоа е нужност. Конструкторот го **преместува** `dom` во нов
`<span>` (`:118-119`), што е childList мутација; `registerComponent`-овиот обсервер
го гледа јазолот како додаден и вика `findElements`, кој проверува
`if (!el[attribute])`. Без самододелувањето на `:67`, секоја иницијализација би
создавала нова инстанца во бесконечност. Единствената компонента што го решава овој
проблем — и единствената што го има.

**`_isFormatting` знаменцето** (`:44-46`, `:178-181`, `:332-334`) го разликува
сопственото форматирање од туѓо програмско пишување, па пресретнатиот `value` setter
не се врти во круг.

**`destroy()` ја одмотува хирургијата** (`:396-423`) — ги вади скриениот input,
пикерот и копчето, го враќа `dom` пред обвивката и ја брише, го брише
пресретнатиот `value` дескриптор (`delete this.dom.value` враќа на прототипниот
getter), го враќа `name`-от и типот. Тоа е најдолгиот teardown во репото и најголем
дел од него е точен.

**Го користи `interceptValueProperty` од `ln-core`** (`:173`) наместо да го препише —
еден од само двата вистински консумента.

**Двонасочното врзување е низ двата скриени input-а**, не низ паралелна состојба:
видливиот носи форматиран текст, скриениот носи ISO за submit, пикерот носи ISO за
нативниот календар. Ниту еден од трите не е огледало на друг — секој има улога.

**Inline `cssText` на пикерот** (`:140`) е **признат исклучок** за оваа компонента
(скриениот нативен пикер), не наод.

## Наоди

### 🔴 DT1 — Текстуалниот `destroy()` остава траен `document` слушач

**Каде:** `:73-82` наспроти `:398-402`

Конструкторот го регистрира слушачот **пред** гранката за тип (`:84`), значи го
добиваат и текстуалните елементи:

```js
this._onLocaleChange = function () { … };
ensureLocaleObserver();
document.addEventListener('ln-core:locale-change', this._onLocaleChange);   // :82

if (dom.tagName !== 'INPUT') {
    this.isTextElement = true;
    this._initTextElement();
    return this;                                                            // :87
}
```

`destroy()` излегува рано за истата гранка — **пред** чистењето:

```js
_component.prototype.destroy = function () {
    if (!this.dom[DOM_ATTRIBUTE]) return;
    if (this.isTextElement) {
        dispatch(this.dom, 'ln-date:destroyed', { target: this.dom });
        delete this.dom[DOM_ATTRIBUTE];
        return;                       // ← :401, излез
    }
    …
    if (this._onLocaleChange) {
        document.removeEventListener('ln-core:locale-change', this._onLocaleChange);   // :419 — недостижно за текст
    }
```

**Последица:** секој уништен текстуален `ln-date` остава слушач на `document` што
држи затворач врз `self`, значи врз елементот. Елементот **никогаш не се ослободува**,
а на секоја промена на локале `_formatTextContent()` се пушта врз откачен јазол.

**Достижност — висока.** Текстуалниот режим е основниот случај за прикажување
(`<time data-ln-date>` во ред од табела). `ln-table` и `ln-list` ги пре-рендерираат
редовите, а `registerComponent`-овата removedNodes гранка вика `destroy()` за секој
отстранет елемент. Табела што прелистува 1000 записи насобира 1000 трајни слушачи и
1000 задржани DOM јазли.

Дополнително: `ln-core` R9 покажа дека `ensureLocaleObserver` набљудува со
`subtree: true`, па **секоја** промена на `lang` каде било пали
`ln-core:locale-change` — значи насобраните слушачи не се само меморија, тие и
работат.

### 🟠 DT2 — Второто поле за датум го брише речникот на првото

**Каде:** `:97-113`

```js
const container = dom.closest('.form-element, form') || dom.parentNode;
const dictEls = container.querySelectorAll('[data-ln-date-dict]');
for (…) {
    const dictData = buildDict(dictEls[i], 'data-ln-date-dict-key');
    …
    registerLocaleFallback(lang, dictData);
}
```

`buildDict` (`ln-core/helpers.js:324-332`) е **деструктивно читање** — по извлекување
на текстот прави `els[i].remove()` за секој `[data-ln-date-dict-key]`.

Кога две полиња за датум го делат истиот контејнер (форма без `.form-element`
обвивки, што `closest` го решава на `form`):

| ред | што се случува |
|---|---|
| 1. init на првото поле | `buildDict` го чита речникот и **ги брише** ставките; `registerLocaleFallback('mk', {monthsLong: […], …})` ✅ |
| 2. init на второто поле | истиот `[data-ln-date-dict]` е сега празен → `buildDict` враќа `{}` |
| 3. | `registerLocaleFallback('mk', {})` — `ln-core/helpers.js:999-1003` бара само `typeof dictionary === 'object'`; `{}` поминува |
| 4. | **Регистрираниот речник е пребришан со празен објект** |

Од тој момент `getLocaleFallback('mk')` враќа `{}`, па сите месеци и денови паѓаат
назад на `Intl` — што за јазици каде токму затоа е воведен fallback-от значи
погрешни имиња.

**Достижност:** форма со почетен и краен датум и еден речник на ниво на форма —
обичен распоред. Двете полиња мора да го делат контејнерот што `closest` го наоѓа.

### 🟠 DT3 — Нативен `change` се испраќа при конструкција

**Каде:** `:36`, `:50`, `:255-258`

`_notifyChange` секогаш испраќа **два** настана:

```js
dispatch(self.dom, 'ln-date:change', { … });
self.dom.dispatchEvent(new Event('change', { bubbles: true }));    // :36
```

а `_updateState` секогаш го вика (`:50`). Конструкторот го вика `_updateState` за
претходно пополнета вредност:

```js
if (initialValue && initialValue !== '') {
    const date = parseDateInput(initialValue);
    if (date) _updateState(self, initialValue, date);              // :257
}
```

Значи server-rendered форма со пополнет датум испраќа **нативен `change`** при
вчитување на страницата, пред каква било корисничка интеракција.

Кој слуша: `ln-validate` (`:75` — `change` → `validate()`), `ln-autosave`,
`ln-form`-овите реактивни консументи. Комбинирано со `ln-validate` V1 (touch gate-от
се заобиколува при init), пополнета edit форма со поле за датум се валидира двапати
при boot и потенцијално активира автоснимање.

### 🟠 DT4 — Зашиени англиски ARIA етикети

**Каде:** `:139`, `:150`

```js
picker.setAttribute('aria-label', dom.getAttribute('data-ln-date-label') || 'Date picker');
btn.setAttribute('aria-label', dom.getAttribute('data-ln-date-label') || 'Open date picker');
```

Два различни англиски стринга, обата изговорени од екранскиот читач. DOCTRINE §4
бара нула зашиен кориснички текст во JS.

`data-ln-date-label` постои како override, но е **еден** атрибут за **две** различни
етикети — па консумент што го поставува ги добива обете исти („Отвори календар" и за
скриениот пикер и за копчето).

Четврто појавување на SYS-13 (`ln-external-links`, `ln-confirm`, `ln-core` mk
речник, ова).

### 🟠 DT5 — Markup од библиотеката преку `innerHTML`

**Каде:** `:151`

```js
btn.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>';
```

`mindset.md` #12 вели дека `<template>` никогаш не се испорачува како скриен
library-side default, а DOCTRINE §4 бара структурата да се клонира од
`<template data-ln-template>`. Ова е буквално зашиен markup стринг во JS, вметнат со
`innerHTML`.

Санкционираните исклучоци (доктрина: `ln-confirm`; README на `ln-options`: себеси +
`ln-table` select-all) не го покриваат. И за разлика од `<option>` случајот, тука
станува збор за икона со структура — точно она за што шаблоните постојат.

### 🟠 DT6 — Датумите пред 1970 не се парсираат (наследено од `ln-core` R2)

`parseDateInput` (`ln-core/date.js:14`) бара `num > 0`, па секој негативен Unix
timestamp враќа `null`. `ln-date` го вика на **13 места**: `:77`, `:164`, `:188`,
`:208`, `:225`, `:240`, `:256`, `:280`, `:295`, `:354`, `:366`, `:376`, `:435`.

Најдостижниот пат е `:255-258` — претходно пополнета вредност. Поле за датум на
раѓање за некој роден пред 1970 добива `null`, ниту една состојба не се поставува,
и полето изгледа **празно** и покрај тоа што записот носи вредност.

Текстуалниот режим (`:265-280`) чита `data-ln-value`, кој по проектната доктрина
носи Unix timestamp — значи истата патека.

Ублажување: `parseTypedDate` (`date-model.js`) се користи како втор обид на `:188`,
`:280`, `:354`, па напишан или ISO стринг сè уште може да помине. Патеката што паѓа
е нумеричкиот негативен timestamp.

## 🟡 Doc-drift и помали

| # | Наод | Каде |
|---|---|---|
| DT7 | `dom.closest('.form-element, form')` (`:97`) — врзување за **CSS класа** како структурен хук. `CLAUDE.md` §3: *„NEVER bind JS behaviors to CSS classes"*. Втора компонента со истиот образец по `ln-validate` V5. | `:97` |
| DT8 | `destroy()` секогаш враќа `this.dom.type = 'date'` (`:416`), но конструкторот не го снима оригиналниот тип пред `dom.type = 'text'` (`:145`). `<input type="text" data-ln-date>` по уништување станува `type="date"`. | `:145`, `:416` |
| DT9 | Локале промената се обработува **двапати**: преку `ln-core:locale-change` слушачот (`:82`) и преку `extraAttributes: [… 'lang']` во `onAttributeChange` (`:428-437`). Кога `lang` е на самиот host, обете патеки форматираат. | `:82`, `:428` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-date` (формат/маркер) | `:21,191,300` | ✅ | ✅ |
| `data-ln-date-format` | `:297,428` | ✅ | ✅ |
| `data-ln-date-locale` | `:428` | ✅ | ✅ |
| `data-ln-date-label` | `:139,150` | ✅ | ✅ |
| `data-ln-date-dict` / `-dict-key` | `:99,103` | ✅ | ✅ |
| `data-ln-date-field` (пишува JS) | `:117` | ✅ | ✅ |
| `data-ln-value` (чита + пишува) | `:265,285,358` | ✅ | ✅ |
| `data-ln-fill-as` (пренесува) | `:127-129` | ✅ | ✅ |
| `ln-date:change` | `:31` | ✅ | н/п |
| `ln-date:destroyed` | `:399,421` | ✅ | н/п |
| нативен `change` при init | `:36,257` | ❌ неспомнато | н/п |
| `value` / `date` / `formatted` | `:339,372,387` | ✅ | н/п |
| **locale слушач по текст-destroy** | не се чисти | ❌ | н/п |
| **`buildDict` деструктивност** | `:103` | ❌ | н/п |

## Затечена состојба

Сите формати и локали се читаат **свежо** на секое форматирање (`:191-194`,
`:227-229`, `:297-306`, `:329-331`) — нема парсирани копии во instance state. Заедно
со `extraAttributes` што покрива пет атрибути (`:428`), ова е меѓу најреактивните
компоненти во репото и покрај тоа што не користи `defineAttrs`.

Вистинската instance состојба (`_lastISO`, `_isFormatting`, `_rawValue`, референците
кон создадените јазли) не огледа ниту еден атрибут.

Конзолен излез: нула.
