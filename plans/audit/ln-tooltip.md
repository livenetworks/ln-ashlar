# Аудит — ln-tooltip

2026-09-11 · Опсег: `src/ln-tooltip.js` (207), `README.md` (95), schema · Итерација 16/50

## Вердикт

Единствената компонента со вистински двослоен деградационен план — CSS баш работи
без JS, а JS слојот се вклучува само по опт-ин, со статички CSS суперсор што спречува
трепкање. Двата наода се обата околу `destroy()`: не се задржува, и README-то
погрешно тврди дека автоматскиот пат не постои.

## Што е добро

**Деградацијата е решена во CSS, пред JS воопшто да се појави.** Суперсорот

```scss
[data-ln-tooltip][data-ln-tooltip-enhance]::after,
[data-ln-tooltip][title]::after { content: none; }
```

е **статички**, значи важи пред извршување — нема блик на базниот `::after` пред
иницијализација. Тоа е сценарио што повеќето progressive-enhancement слоеви го
промашуваат, и README-то ја кажува причината.

**Auto-enhance по `[data-ln-tooltip][title]` е мислено, не случајно.** Причината е
запишана: CSS базата не може да го спречи нативниот `title` тултип да протече, па
присуството на `title` само по себе го повикува JS слојот што го краде.

**`title` се складира и се враќа.** `:74-77` го вади, `:137-139` го враќа — па
нативниот тултип не се појавува покрај сопствениот по ~1s задржување.

**Инваријантата „еден видлив" е образложена, не само имплементирана.** README:89:
*„This is also why the `title` stash can live in a single module-level variable rather
than a per-trigger map."* Модуларната состојба е последица од инваријантата, не
кратенка.

**Capture фаза за `focus`/`blur` со причина** (`:178-179`) — тие настани не буклаат,
па capture е начинот фокус од фокусабилен потомок да стигне до тригерот.

**Заемните гардови меѓу тригери.** `_onLeave` (`:168-170`) и `_onBlur` (`:172-174`)
проверуваат `activeTrigger === el` пред да кријат — еден тригер не може да го
затвори тултипот на друг.

**Гардот на `hidePopover`** (`:149`) со коментар што ја именува причината:
`InvalidStateError` ако се вика кога не е прикажан.

## Наоди

### 🟠 TT1 — `destroy()` веднаш се поништува сам, токму во документираниот случај

**Каде:** `:184-197`

README:95 го опишува наменетиот случај:

> `destroy()` exists for the rarer case of **unwiring without removing the element**

Тоа е точно сценариото што не работи. Редоследот во `destroy()`:

```js
if (this._addedEnhancedAttr) {
    el.removeAttribute('data-ln-tooltip-enhanced');   // :192
}
delete el[DOM_ATTRIBUTE];                              // :194
```

`data-ln-tooltip-enhanced` е **набљудуван** атрибут: `registerComponent` ги вади
имињата од селекторот со `/\[([\w-]+)/g`, а селекторот (`:202`) е

```
[data-ln-tooltip-enhance], [data-ln-tooltip-enhanced], [data-ln-tooltip][title]
```

Значи бришењето на `:192` создава MutationRecord. Споделениот обсервер го обработува
како микротаск — **по** `delete` на `:194`. Во `_handleAttrMutation`, ln-tooltip нема
`handler` ниту `onAttributeChange` (регистрацијата е без `options`), па се оди на
наследната гранка:

```js
findElements(el, entry.selector, entry.attribute, entry.ComponentFn);
```

Елементот сè уште го носи авторскиот `data-ln-tooltip-enhance` (или
`[data-ln-tooltip][title]`), значи **се совпаѓа**; `el[attribute]` е избришан, значи
`!el[attribute]` е точно → **`new _component(el)`**.

Резултат: четирите слушачи се враќаат, `data-ln-tooltip-enhanced` се запишува
одново, а `ln-tooltip:destroyed` е веќе испратен. Компонентата ја објавила
сопствената смрт и продолжила да работи.

**Достижност:** само за елемент што **останува во документот** — токму употребата
што README-то ја именува. Кога елементот се вади од DOM, мутацијата не е под
`document.body` и обсерверот не ја гледа, па автоматскиот пат не воскреснува.

### 🟡 TT2 — README тврди дека нема автоматски `destroy()`

**Каде:** `README.md:95`

> The component **never auto-destroys on element removal** — listeners are
> garbage-collected with the element.

Тоа не е точно. `registerComponent`-овиот childList обсервер
(`ln-core/helpers.js`, removedNodes гранка) го прави следново за секој отстранет
подстеблен јазол:

```js
const items = Array.from(node.querySelectorAll(query));
if (node.matches && node.matches(query)) items.push(node);
for (…) if (!document.contains(item)) {
    const inst = item[attribute];
    if (inst && typeof inst.destroy === 'function') inst.destroy();
}
```

`query` овде е целиот tooltip селектор (содржи `[`, значи `isComplex`). Отстранет
тригер се совпаѓа, инстанцата постои, `destroy` е на прототипот → **се вика**.

Последицата е безопасна (елементот е откачен, па `ln-tooltip:destroyed` не стигнува
никаде — SYS-12), но описот на животниот циклус е погрешен.

### 🟡 TT3 — Единствениот `destroy()` без гард за идемпотентност

**Каде:** `:184`

```js
_component.prototype.destroy = function () {
    const el = this.dom;          // ← нема `if (!this.dom[DOM_ATTRIBUTE]) return;`
```

Секоја друга компонента ревидирана досега почнува со тој гард — `ln-toggle:115`,
`ln-modal:69`, `ln-popover:233`, `ln-dropdown:262`, `ln-accordion:32`,
`ln-include:88`, `ln-stat:35`, `ln-options:66`.

Втор рачен повик повторно ги вика `removeEventListener` (безопасно), повторно го
брише атрибутот, и **повторно испраќа `ln-tooltip:destroyed`**.

(`ln-popover._triggerComponent.destroy` `:270` го има истиот пропуст — двата се
единствените.)

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Портал `<div>` (`:24`) и балон `<div>` (`:87`) се градат со `document.createElement` наместо од `<template>`. DOCTRINE §4 бара клонирање; санкционираните исклучоци се `ln-confirm` (доктрина) и `ln-options`/`ln-table` select-all (README на `ln-options`). Ниту еден не го покрива ова — иако станува збор за текстуален јазол без структура. | `:24`, `:87` |
| P2 | Inline `style.top`/`style.left` (`:109-110`) со коментар *„Coordinate-only inline styles — same exception as ln-popover."* Четврта компонента со inline стил; конвенцијата се пренесува преку коментари меѓу фајлови, не преку доктрина. | `:109-110` |
| P3 | Порталот се создава лениво и **никогаш не се брише** (README го потврдува). Конзистентно со глобалните singleton-и во `ln-core`, но значи дека `#ln-tooltip-portal` останува во `<body>` и по последниот `destroy()`. | `:20-36` |
| P4 | `uidCounter` (`:12`) е модуларен, а id-то се кешира на елементот како `lnTooltipEnhanceUid` (`:92-96`). `destroy()` го брише (`:195`), па повторна иницијализација доделува **нов** број — старите `aria-describedby` референци во асистивна технологија не се проблем, но броевите растат монотоно без реупотреба. | `:92-96` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-tooltip` | `:5` | ✅ | ✅ |
| `data-ln-tooltip-enhance` | `:4,202` | ✅ opt-in | ✅ |
| `data-ln-tooltip-enhanced` (пишува JS) | `:163` | ✅ како state | ✅ |
| `data-ln-tooltip-position` | `:6,105` | ✅ со default `top` | ✅ |
| `data-ln-tooltip-placement` (пишува JS) | `:111` | ✅ | ✅ |
| `aria-describedby` (пишува JS) | `:113-117` | ✅ | н/п |
| `ln-tooltip:destroyed` | `:196` | ✅ „the only event dispatched" | н/п |
| auto-enhance по `[data-ln-tooltip][title]` | `:202` | ✅ со причина | н/п |
| ESC затворање | `:38-44` | ✅ во flow описот | н/п |
| `destroy()` се задржува | **не** — се воскреснува | ❌ имплицира дека работи | н/п |
| автоматски `destroy()` при отстранување | **постои** | ❌ вели дека не постои | н/п |
| гард за двоен `destroy()` | **нема** | ❌ неспомнато | н/п |

## Затечена состојба

Нула instance полиња што огледаат атрибут — `_show` ги чита `data-ln-tooltip`,
`title` и `-position` свежо на секое прикажување (`:58`, `:105`). Прашањето
`defineAttrs` овде не се поставува.

Состојбата е **модуларна, не по инстанца** (`:12-18`), што е свесна последица од
инваријантата „еден видлив тултип" и е образложено во README.

Конзолен излез: нула.
