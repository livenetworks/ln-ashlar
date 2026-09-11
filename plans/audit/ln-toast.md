# Аудит — ln-toast

2026-09-11 · Опсег: `src/ln-toast.js` (223), `template.html` (18), `README.md` (194), schema · Итерација 17/50

## Вердикт

Најдобрите објаснувачки коментари во библиотеката и единствената компонента што
навистина ја имплементира SSR хидратацијата. Но README-то документира функција што
не постои во кодот — паузирање на тајмерот при hover — и еден пар API-и е несовпаднат
на начин што фрла ако маркапот се вгнезди.

## Што е добро

**Коментарот за редоследот на `fill()`** (`:83-88`, `:101-103`) е најкорисниот во
репото:

> `data-ln-attr="class:type"` sits on the template root `<li>`; `fill()`'s
> `querySelectorAll` never matches its own root, and here the fragment is the root,
> so the `<li>` (its child) is a matched descendant …
>
> ORDERING: `classList.add` MUST follow `fill()`. `fill` set class via
> `setAttribute('class', type)`, which clobbers the whole attribute — a pre-added
> `.ln-enter` would be wiped.

Две недофатливи однесувања објаснети со причина, не со „не менувај".

**SSR хидратација, вистинска.** `_hydrateLI` (`:170-179`) го зема авторскиот `<li>`,
му го врзува копчето и го стартува тајмерот — **без клонирање и без замена на DOM**.
`_lnToastHydrated` знаменцето (`:171-172`) го прави идемпотентно. README §5A го
документира како прв случај, не како фуснота.

**Поларитетот на транзицијата е точен.** `.ln-enter` се додава при градење (`:104`)
и се вади на следниот `requestAnimationFrame` (`:144`) — значи класата е **преодна**,
а елементот е видлив без JS. Спротивен поларитет (`.ln-visible`) би значел невидливи
toast-и кога JS нема да се изврши.

**Евикцијата е по `[data-ln-toast-item]`, не по сурови деца**, со запишана причина
(`:139`): суровите деца го вклучуваат вгнездениот `<template>`.

**`ln-modal:open` слушачот** (`:212-219`) ги ре-промовира контејнерите со toast-и во
top layer кога ќе се отвори модал — инаку `showModal()` би ги закопал. Тоа е реален
проблем на Popover/dialog интеракцијата што ретко се предвидува.

**`template.html` е обележан како не-runtime артефакт** (`:1`) и ништо не го увезува
— точно по правилото дека `template.html` е само копи-пејст пример.

**Top layer се напушта кога контејнерот е празен** (`_demoteTopLayerIfEmpty`,
`:24-32`), па празниот контејнер не јаде клика.

## Наоди

### 🔴 TS1 — README документира паузирање на тајмер при hover; во кодот го нема

**Каде:** `README.md:12`

> A single viewport container (`[data-ln-toast]`) listens for these window-level
> events, builds card elements dynamically from templates, coordinates automatic
> 6-second exit timers, **pauses timers on mouse hover**, and destroys elements after
> animations.

Во `src/ln-toast.js` нема ниту еден `mouseenter`, `mouseover`, `mouseleave` или
`pointerenter` слушач. Целата листа слушачи во фајлот е:

| ред | слушач |
|---|---|
| `:110` | `closeBtn` → `click` |
| `:175` | `closeBtn` (хидриран) → `click` |
| `:210` | `window` → `ln-toast:enqueue` |
| `:211` | `window` → `ln-toast:clear` |
| `:212` | `window` → `ln-modal:open` |

Тајмерите се обични `setTimeout(() => _dismiss(li), timeout)` (`:56`, `:178`) без
пат за пауза, ресетирање или продолжување.

**Последица:** долга error порака исчезнува по 6 секунди додека корисникот ја чита со
покажувач врз неа. Тоа е стандардна очекувана функција кај toast компоненти, е
ветена во договорот, и не постои.

### 🟠 TS2 — `querySelectorAll` (потомци) спарен со `removeChild` (само деца)

**Каде:** `:39-40` и `:140-141`

```js
const items = Array.from(dom.querySelectorAll("[data-ln-toast-item]"));
while (items.length > this.max) dom.removeChild(items.shift());
```

`querySelectorAll` бара низ **целото подстебло**; `removeChild` бара **директно
дете** и фрла `NotFoundError` ако јазолот не е.

Во нормалниот тек тоа не се судира — `_append` (`:142`) го качува `<li>` директно
на контејнерот. Но конструкторот (`:39`) работи врз **авторски маркап**, а
хидратацијата е првокласен документиран случај (README §5A). Секој SSR шаблон што ги
завиткува ставките во меѓу-елемент дава исклучок во конструкторот — и тоа во
`registerComponent`-овиот `findElements` циклус, каде фрлен конструктор ја прекинува
јамката за **сите преостанати** елементи (`ln-core` P4).

Истата двојка се повторува во `_append` (`:141`), каде евикцијата работи врз
резултат од `querySelectorAll`.

### 🟠 TS3 — 200 ms е зашиен во JS и одвоен од CSS

**Каде:** `:153-158`

```js
li.classList.add("ln-out");
setTimeout(() => { … removeChild(li) … }, 200);
```

Времетраењето на излезната анимација живее на две места — во ко-лоцираниот SCSS и
како литерал во JS — без ниту еден механизам што ги држи усогласени. Нема
`transitionend` слушач, нема читање на CSS custom property.

Последици:
- Промена на transition времетраењето во темата тивко го расинхронизира: пократко →
  јазолот виси видлив по завршување; подолго → се брише среде анимација.
- Корисник со `prefers-reduced-motion` добива CSS транзиција од 0 ms, но сепак чека
  цели 200 ms пред јазолот да си оди.

### 🟠 TS4 — Рачно парсирање атрибути наместо `attrInt`

**Каде:** `:36-37`, `:177`

```js
this.timeoutDefault = +(dom.getAttribute("data-ln-toast-timeout") ?? 6000);
this.max            = +(dom.getAttribute("data-ln-toast-max") ?? 5);
```

`??` фаќа само `null`/`undefined`. Празен или невалиден атрибут поминува:

| маркап | `getAttribute` | по `+` | ефект |
|---|---|---|---|
| атрибутот отсуствува | `null` | `6000` | ✅ default |
| `data-ln-toast-timeout=""` | `""` | **`0`** | траен toast |
| `data-ln-toast-timeout="abc"` | `"abc"` | **`NaN`** | `NaN > 0` е `false` → траен toast |
| `data-ln-toast-max=""` | `""` | **`0`** | `_append` евиктира сè, ниту еден toast не се појавува |

`0` е документиран sentinel за „траен" (README:28), па првите два случаја слетуваат
во валидна состојба — но по несакан пат. `data-ln-toast-max=""` е потежок: `:141`
`while (items.length >= 0 && items.length > 0)` ги вади сите, па новиот се додава и
следниот повик пак го вади.

`ln-core` го носи токму примитивот за ова — `attrInt(el, name, fallback)`
(`attrs.js:16`) враќа `fallback` на `isNaN`, со коментар што вели дека **го заменува
токму овој идиом**. Има еден консумент (`ln-data-store`); овде не се користи.

### 🟡 TS5 — Едно откажување, две идентични предупредувања

**Каде:** `:77-80`

```js
const fragment = cloneTemplateScoped(container, TEMPLATE_NAME, 'ln-toast');
if (!fragment) {
    console.warn('[ln-toast] Template "' + TEMPLATE_NAME + '" not found');
```

`cloneTemplateScoped` (`ln-core/helpers.js:303-309`) паѓа назад на `cloneTemplate`,
кој веќе предупредува со **истата** порака (`helpers.js:34`) пред да врати `null`.
Значи еден недостасувачки шаблон печати две идентични линии.

### 🟡 TS6 — „Fails loudly" е тивко во продукција

README §5C:

> If neither exists, the template fails loudly — `console.warn('[ln-toast] Template
> "ln-toast-item" …')`

Тоа е `console.warn` со `[ln-` префикс, значи го фаќа портата во
`ln-core/helpers.js:1-19` и се проголтува **освен ако** е присутен `data-ln-debug`.
Истото важи и за `'[ln-toast] No toast container found'` (`:185`).

Во продукција обете откажувања се целосно нечујни. „Loudly" важи само во debug режим,
што README-то не го кажува.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Слушачите се на `window` (`:210-212`); секоја друга ревидирана компонента слуша на `document` (`ln-toggle`, `ln-popover`, `ln-tooltip`, `ln-core`). README го издигнува тоа во договор („The window event is the sole contract"), значи е свесно — но е единствениот таков случај. | `:210-212` |
| P2 | README §3 вели *„The window event is the **sole** contract"*, а §Programmatic Instance Control веднаш го документира `toastContainer.lnToast.enqueue(...)`. Иста форма како `ln-modal` M1 и `ln-toggle` T1, послаба по последица. | `README:36` наспроти `:65-78` |
| P3 | `_renderBody` гради `<ul>`/`<li>` со `document.createElement` (`:119-123`, `:128-132`). Коментарот го оправдува како „runtime DATA rendering only" — но тоа сепак е структура, и не е на ниту една санкционирана листа исклучоци. | `:117-136` |
| P4 | `_dismiss` може да се повика повеќепати за иста ставка (тајмер, копче, `clear()`, `destroy()`), при што секој повик закажува нов 200 ms `setTimeout`. Проверката `if (li.parentNode)` го чува бришењето, но `_demoteTopLayerIfEmpty` се пушта по еднаш за секој. | `:147-159` |
| P5 | `try/catch` со празно тело на четири места (`:18`, `:20`, `:29`) го голта секој `showPopover`/`hidePopover` исклучок. Гардот `:popover-open` веќе го покрива очекуваниот случај, па catch-от крие непознати. | `:16-31` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-toast` | `:5` | ✅ | ✅ |
| `data-ln-toast-timeout` (контејнер + ставка) | `:36`, `:177` | ✅ обете нивоа | ✅ |
| `data-ln-toast-max` | `:37` | ✅ | ✅ |
| `data-ln-toast-item` (стампа JS ако фали) | `:99` | ✅ „stamps it defensively" | ✅ |
| `data-ln-toast-close` | `:109`, `:174` | ✅ | ✅ |
| `data-ln-toast-when` | само `template.html` + CSS | ✅ §4 | ✅ |
| `ln-toast:enqueue` / `:clear` (на `window`) | `:210-211` | ✅ полн опции-попис | н/п |
| `ln-toast:destroyed` | `:71` | не се спомнува | н/п |
| `.enqueue()` / `.clear()` | `:50`, `:59` | ✅ | н/п |
| SSR хидратација | `:39-45`, `:170-179` | ✅ §5A | н/п |
| **пауза на тајмер при hover** | **не постои** | ❌ тврди дека постои | н/п |
| „fails loudly" | зад debug портата | ❌ имплицира видливо | н/п |

## Затечена состојба

`timeoutDefault` и `max` се парсираат еднаш во конструкторот (`:36-37`) — состојбата
на 48/49. Последицата тука е реална: промена на `data-ln-toast-max` по init не важи
за постоечката инстанца, бидејќи `_append` чита од `cmp.max` (`:141`), не од DOM-от.

Конзолен механизам: два `console.warn` со `[ln-` префикс, обата зад портата на
`ln-core` (невидливи без `data-ln-debug`). Нула `console.error`.

`:destroyed` пак се испраќа од `destroy()` (SYS-12).
