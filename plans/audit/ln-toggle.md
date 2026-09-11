# Аудит — ln-toggle

2026-09-10 · Опсег: `src/ln-toggle.js` (172), `src/toggle-model.js` (49), `README.md` (196), `ln-toggle.schema.json` · Ревизор: Opus 5
Итерација 2/50 · Checklist: [`_checklist.md`](_checklist.md)

---

## Вердикт

Најдисциплинираниот животен циклус што го видов досега — еден делегиран слушач со
бројач на референци, докажано беспетелен cancel пат, и Internals што ја објаснува
причината за секој чекор во редоследот. Долговите се на друго место: **README §3
изречно го негира јавното API што компонентата го има**, а `toggle-model.js` е
сенка-имплементација што ја тестира само тест-сoftверот.

---

## Што е добро

**Нула слушачи по тригер.** `_ensureClickListener` инсталира **еден** делегиран
`click` на `document`, а `_maybeRemoveClickListener` го симнува кога последната
инстанца ќе умре (`ln-toggle.js:43-47`). Тоа значи дека A5 од checklist-от —
re-init guard за да не се удвојат слушачите — **воопшто не се применува овде**.
Проблемот е дизајниран надвор од постоење наместо да се чува со знаменце. Спротивно
од 43-те никогаш-неотстранети обсервери во `ln-core`.

**Cancel патот е докажано беспетелен, и причината е запишана.** При
`preventDefault()` на `before-open`, редот 141 го враќа атрибутот, што повторно го
буди обсерверот — но `isOpen` никогаш не се сменил, па вториот премин излегува на
редот 136. Internals-от го објаснува тоа со зборови, не само во код.

**Редоследот cancelable → класа → aria → настан → persist е намерен.**
`persistSet` оди **последен** за да може слушач што го отстранува `data-ln-persist`
синхроно за време на `:open` да го прескокне запишувањето. Тоа е одлука што некој
ја мислел.

**`destroy()` е комплетен и чесен.** Ги симнува сите три request слушачи, ја вади
инстанцата од Set-от, го одврзува делегираниот слушач ако е последна, брише
`el.lnToggle` — и README изречно кажува што намерно **не** чисти
(`data-ln-toggle`, `.open`), наместо да остави читателот да претпоставува.

**`schema.json` е чист.** 5 атрибути, сите присутни во изворот, нула сирачиња. Сите
имиња се `const` врзани за литерали — точно формата што `attrs.js:3-8` ја бара за
скенерот.

---

## Наоди

### 🟠 T1 — README §3 го негира јавното API што компонентата го има

**Каде:** `README.md:43` наспроти `src/ln-toggle.js:101-112`

README-от, во секцијата насловена *The Declarative API & State Contract*, вели:

> There are no imperative JavaScript methods (like `open()` or `close()`) on the
> component instance. **The HTML attribute is the sole contract.**

Изворот има сите три:

```js
_component.prototype.open   = function () { … };   // :101
_component.prototype.close  = function () { … };   // :105
_component.prototype.toggle = function () { … };   // :109
```

Работат, се врзани на прототипот, и се повикуваат од сопствените request слушачи
(`:65-73`). Никаде на друго место во README не се документирани — grep за
`open()` / `close()` / `toggle()` / `prototype` / `Programmatic` враќа само таа
една линија што вели дека не постојат.

Ова не е обичен doc-drift. README-от прави **нормативно архитектонско тврдење** —
„атрибутот е единствениот договор" — што изворот го побива. Едно од двете е
неточно: или методите се вестигијални, или тврдењето е.

---

### 🟠 T2 — `toggle-model.js` е сенка-имплементација: тестирана, никогаш испорачана

**Каде:** `src/toggle-model.js` (цел фајл)

Ниту еден производствен фајл не го увезува. Единствениот увоз во целото репо:

```
tests/ln-toggle.test.js:9:  } from '../components/ln-toggle/src/toggle-model.js';
```

`src/ln-toggle.js:1` ги зема `isTargetDisabled` и `shouldIgnoreClick` **од
`../../ln-core`**, не од моделот. А тие две функции во моделот се потврдено
**байт-идентични** со оние во `ln-core/helpers.js` (`diff` враќа празно за двете).

| симбол во моделот | статус |
|---|---|
| `shouldIgnoreClick` | идентичен дупликат на `helpers.js:365`; компонентата ја користи core верзијата |
| `isTargetDisabled` | идентичен дупликат на `helpers.js:395`; компонентата ја користи core верзијата |
| `getNextToggleState` | компонентата има сопствен `_getNextState` (`:15-19`) што го дуплира без нормализацијата |
| `normalizeToggleState` | никаде не се вика |

**Последица:** `tests/ln-toggle.test.js` дава зелено на код што прелистувачот
никогаш не го извршува. Кревањето во `ln-core` (2-Consumer Lifting) се случило —
но старата копија не е избришана, а тестовите останале закачени на неа.

---

### 🟠 T3 — `.open` е гола JS-state класа

**Каде:** `src/ln-toggle.js:90, 145, 158`

`mindset.md:66` вели: *„JS only toggles `.ln-*` state classes or semantic
attributes."*

Куќниот образец низ репото го потврдува тоа — попис на `classList.add/remove/toggle`
низ сите компоненти:

```
6  ln-table--loading      4  ln-modal-open       2  ln-filter-active
6  ln-row-selected        3  ln-sortable--*      2  ln-ajax--loading
6  ln-list--loading       3  open   ← ln-toggle  2  ln-editor-active
```

`ln-modal` веќе го користи префиксираното `ln-modal-open` за **истиот концепт**.
Единствените неврзани исклучоци се `hidden` (theme utility, види `ln-core` R4),
`is-loading` (1), и `open` (3, сите три овде).

**Плус:** JS-от одржува **два канала за иста состојба** — атрибутот
`data-ln-toggle="open"` и класата `.open`. Едната е доволна; `reference.md:179`
изречно дозволува ко-лоциран SCSS да стилизира по сопствен `data-ln-*`.

---

### 🟠 T4 — `ln-toggle:destroyed` се испраќа само кога никој не може да го чуе

**Каде:** `src/ln-toggle.js:124`

`destroy()` испраќа буклачки `ln-toggle:destroyed` на `this.dom`. Автоматскиот пат
до `destroy()` е единствен — `ln-core/helpers.js` removedNodes гранката, која вика
`inst.destroy()` **само** кога `!document.contains(item)`.

Елемент што не е во документот нема пат нагоре до `document`. Буклачки настан на
откачен јазол не стигнува до ниту еден document-level слушач.

Grep низ репото: **никој не го слуша** `ln-toggle:destroyed`. Постои само во
изворот и во описите на доковите.

---

## 🟡 Doc-drift

| # | Наод | Каде |
|---|---|---|
| T5 | **Internals ја документира погрешната механика.** Тврди дека при persist-restore *„`el[DOM_ATTRIBUTE]` is still `undefined` at that point … so `_syncAttribute`'s instance guard catches it"*. Не е така: `MutationObserver` е асинхрон, а `findElements` (`helpers.js:349`) ја доделува инстанцата **синхроно** штом конструкторот врати — многу пред микротаскот. Кога `_syncAttribute` навистина се повикува, инстанцата **постои**. Вистинската заштита е `shouldBeOpen === instance.isOpen` на `:136`. Точен исход, погрешна причина — а ова README е бенчмаркот што другите го копираат. | `README.md` Internals §Init |
| T6 | `ln-toggle:request-open` / `:request-close` / `:request-toggle` се слушаат на `:75-77`, но ги **нема во табелата на настани §4**. Спомнати се само внатре во параграфот за `destroy()`. Цел влезен канал надвор од договорот. | `README.md:41-90` |
| T7 | `ln-toggle:destroyed` исто така го нема во табелата §4 (која вели дека ги наведува сите). | `README.md` §4 |
| T8 | Internals вели *„Source: `components/ln-toggle/ln-toggle.js`"* — тоа е **компајлираниот bundle**, не `src/ln-toggle.js`. И листата на увози ги испушта `isTargetDisabled` и `shouldIgnoreClick`, кои се на `:1`. | `README.md` Internals |

---

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Internals го опишува `isOpen` како *„read-only convenience getter"* — тоа е обично записливо својство, не getter. `panel.lnToggle.isOpen = true` тивко го расинхронизира од атрибутот. (Спореди со `defineAttrs`, кој токму тоа го прави невозможно.) | `:87` |
| P2 | `destroy()` остава `aria-expanded="true"` на тригерите. README изречно кажува дека намерно не ги чисти `data-ln-toggle` и `.open` — но тригерската ARIA е состојба на **туѓи** елементи што остануваат во документот. | `:114-125` |
| P3 | `_getNextState` не нормализира, за разлика од неупотребениот `getNextToggleState`. Секоја вредност освен точно `'open'` брои како затворено — `data-ln-toggle="OPEN"` е затворен панел. | `:15-19` |

---

## Затечена состојба — без пресуда

- **`isOpen` е приватно огледало на атрибутот** (`:87`, менувано на `:144`, `:157`),
  а компонентата регистрира `onAttributeChange` (наследниот пат), не
  `onAttrChange`/`effects`. Тоа е состојбата на **48 од 49** компоненти —
  `defineAttrs` е усвоен само во `ln-data-store`. Се брои, не се суди.
- **Конзолен механизам:** ln-toggle не пишува на конзола воопшто. Виљушката не се
  однесува на неа.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-toggle` | `:4` | ✅ §3 | ✅ `both` |
| `data-ln-toggle-for` | `:6` | ✅ §3 | ✅ `author` |
| `data-ln-toggle-action` | `:7` | ✅ §3 | ✅ `author` |
| `data-ln-persist` | `:8` | ✅ §3 + клуч | ✅ `author` |
| `data-ln-debug` | само `-dev.scss` | — | ✅ |
| `open()` / `close()` / `toggle()` | `:101-112` | ❌ **изречно негирани** | н/п |
| `isOpen` | `:87` | ✅ | н/п |
| `:before-open` / `:open` / `:before-close` / `:close` | ✅ | ✅ §4 | н/п |
| `:destroyed` | `:124` | само во Internals | н/п |
| `:request-open` / `-close` / `-toggle` | `:75-77` | само во Internals | н/п |
| `toggle-model.js` (4 извози) | нула производствени консументи | не се спомнува | н/п |
