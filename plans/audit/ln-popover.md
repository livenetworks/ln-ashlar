# Аудит — ln-popover

2026-09-10 · Опсег: `src/ln-popover.js` (315), `README.md` (162), schema · Итерација 14/50

## Вердикт

Најпотполниот teardown во библиотеката досега и README што го опишува точно, ред по
ред. Еден вистински наод: репозиционирањето се врти на **секој** scroll настан без
throttle, а тоа е точно местото каде доктрината бара rate-limiting.

## Што е добро

**LIFO стек за Escape** (`:13-32`). Не „затвори сè", туку затвори го **врвот** на
стекот — со слушач што се додава при првото отворање и се симнува кога стекот ќе
се испразни. Вгнездени попоувери се однесуваат како што корисникот очекува.

**`_applyClose` не остава ништо.** Тајмер (`:181-184`), outside-click (`:185-188`),
scroll/resize (`:189-193`), inline координати (`:196-197`), placement атрибут
(`:198`), `aria-expanded` (`:200-202`), излез од top layer со `:popover-open` гард
(`:205`), splice од стекот (`:210-211`). Тоа е листа што повеќето имплементации ја
намалуваат на половина.

**Опцијата `capture` се совпаѓа при отстранувањето.** `:165` додава
`{ passive: true, capture: true }`, `:190` отстранува со `{ capture: true }`.
Класична грешка — слушач додаден со capture што се отстранува без него и останува
засекогаш — е избегната.

**Проблемот со тригерите е решен структурно, не со знаменце.** Два одделни
`registerComponent` повици (`:277`, `:313`) — попоуверот на `lnPopover`, тригерот на
`lnPopoverTrigger`. Затоа A5 (re-init guard пред `addEventListener`) не се
применува: `findElements` веќе гарантира една инстанца по елемент.

**Редоследот при затворање е точен** — `hidePopover()` (`:206`) и враќањето фокус
(`:216-221`) доаѓаат **пред** `dispatch(:close)` (`:224`). Спореди со `ln-modal` M2,
каде истиот настан се испраќа додека дијалогот е сè уште отворен. Иста фамилија,
спротивен исход.

**Фокусот е дисклоужр, не модал, и тоа е запишано.** Internals: *„A disclosure
pattern, not a modal — no Tab trap … it remains in its authored DOM position, so Tab
order follows the markup"*. Тоа е причината зошто `popover="manual"` е избран наместо
`auto`.

**README-от ги документира двете гранки на враќање фокус** (`:148`) — вклучувајќи го
случајот „outside-click што слета на друг фокусабилен елемент го задржува тој фокус".
Ретко се пишува таа нијанса.

## Наоди

### 🟠 PO1 — Репозиционирањето нема throttle

**Каде:** `:155-166`

```js
this._boundReposition = function () {
    if (!self.trigger) return;
    const r = self.trigger.getBoundingClientRect();
    const sz = measureHidden(self.dom);          // ← принудува layout
    const p = computePlacement(r, sz, preferred, 8);
    self.dom.style.top = p.top + 'px';           // ← пишува стил
    self.dom.style.left = p.left + 'px';
    self.dom.setAttribute('data-ln-popover-placement', p.placement);
};
window.addEventListener('scroll', this._boundReposition, { passive: true, capture: true });
window.addEventListener('resize', this._boundReposition);
```

Нема `requestAnimationFrame`, нема throttle, нема debounce. `capture: true` значи
дека scroll од **кој било** скролабилен предок пали — не само од прозорецот. Секој
настан прави read-измери-пиши циклус.

`passive: true` спречува блокирање на скролот, но не ја избегнува принудената
рефлоу од `measureHidden` + `getBoundingClientRect`.

Доктрината за rate-limiting изречно го именува scroll handler-от како влезен слој
каде throttle-от припаѓа. README-то ги документира слушачите (*„scroll/resize
listeners for repositioning while open"*) без да го спомне трошокот.

**Достижност:** тривијална — отвори попоувер и скролај.

### 🟠 PO2 — Трета, послаба имплементација на „игнорирај го овој клик"

**Каде:** `:256`

```js
if (e.ctrlKey || e.metaKey || e.button === 1) return;
e.preventDefault();
```

`ln-core/helpers.js:365` (`shouldIgnoreClick`) ја има истата проверка, поцелосна:

| проверка | `shouldIgnoreClick` | `ln-popover:256` |
|---|:---:|:---:|
| `ctrlKey` | ✅ | ✅ |
| `metaKey` | ✅ | ✅ |
| `shiftKey` | ✅ | ❌ |
| `altKey` | ✅ | ❌ |
| не-примарно копче | `button !== 0` | само `button === 1` |

Последица: shift-клик или alt-клик врз `<a data-ln-popover-for>` добива
`preventDefault()` (`:257`) и го превртува попоуверот, наместо да го отвори во нов
прозорец. Десен клик (`button === 2`) исто поминува.

`shouldIgnoreClick` има два консумента (`ln-confirm`, `ln-toggle`); ова е трето
место со истата логика, напишана рачно и послабо.

### 🟡 PO3 — Markup-отворен попоувер испраќа `:open` без `:before-open`

**Каде:** `:77-79`

```js
if (this.isOpen) {
    this._applyOpen(null);
}
```

Конструкторот го вика `_applyOpen` директно, заобиколувајќи го
`onAttributeChange` патот што ја држи cancelable проверката. `_applyOpen` испраќа
`ln-popover:open` (`:171`), значи при boot се појавува `:open` **без** претходен
`:before-open`.

README §Internals го насловува методот *„`_applyOpen(trigger)` — after the cancelable
`before-open` passes"*, што за boot патот не важи.

Трите оверлеи имаат три различни init семантики:

| компонента | при markup-отворена состојба |
|---|---|
| `ln-toggle` | не испраќа ниту еден настан (документирано) |
| `ln-modal` | вика `showModal()`, не испраќа ниту еден настан |
| `ln-popover` | испраќа `:open`, не испраќа `:before-open` |

### 🟡 PO4 — Речникот на состојбата се разидува меѓу оверлеите

`ln-popover` затвора со `'closed'` (`:92`, `:264`, `:294`).
`ln-toggle` и `ln-modal` затвораат со `'close'`.

Секој README го документира својот правилно, значи не е грешка — но три компоненти
од иста фамилија бараат три различни зборови за иста бинарна состојба.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Конструкторот инјектира `tabindex="-1"`, `role="dialog"`, `popover="manual"` (`:64-74`) без знаменце што памети дали ги додал; `destroy()` (`:232-243`) не ги враќа. `ln-tooltip` истиот проблем го решава со `_addedEnhancedAttr` — иста фамилија, различен пристап. | `:64-74` |
| P2 | `_triggerComponent.prototype.destroy` (`:270`) нема `if (!this.dom[…]) return;` гард. Секој друг `destroy` во библиотеката го има. | `:270` |
| P3 | `open(trigger)` рано излегува ако веќе е отворен (`:85`), па повторен повик со **друг** тригер не го репозиционира. Тригерот се менува само преку `_triggerComponent` што пишува директно во `instance.trigger` (`:261`). | `:84-88` |
| P4 | `:destroyed` се испраќа по `delete this.dom[DOM_ATTRIBUTE]` (`:238-242`) — SYS-12: автоматскиот пат до `destroy()` важи само за откачени јазли, каде настанот не стигнува никаде. | `:239` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-popover` (`open`/`closed`) | `:4` | ✅ со двете вредности | ✅ |
| `data-ln-popover-for` | `:6` | ✅ | ✅ |
| `data-ln-popover-position` | `:7,121` | ✅ §5A auto-flip | ✅ |
| `data-ln-popover-placement` (пишува JS) | `:128,163` | ✅ | ✅ |
| `ln-popover:request-open` / `-close` / `-toggle` | `:58-60` | ✅ | н/п |
| `:before-open` / `:before-close` | `:288,299` | ✅ cancelable | н/п |
| `:open` / `:close` | `:171,224` | ✅ payload точен | н/п |
| `:destroyed` | `:239` | не се спомнува во табелата | н/п |
| `open()` / `close()` / `toggle()` | `:84-101` | ✅ (без негирање, за разлика од `ln-modal`) | н/п |
| инјектирани `tabindex`/`role`/`popover` | `:64-74` | ✅ „injected automatically" | н/п |
| `_applyOpen` секогаш по `before-open` | **не при boot** | ❌ Internals тврди дека да | н/п |
| throttle на scroll | **нема** | ❌ неспомнато | н/п |

## Затечена состојба

`instance.isOpen` е приватно огледало (`:38`, менувано на `:106`, `:179`),
искористено како no-op гард на `:285`. Состојбата на 48/49.

Inline стилови: `style.top`/`style.left` (`:126-127`, `:161-162`) со коментар што ја
именува конвенцијата — *„unavoidable for floating UI … consistent with ln-dropdown"*.
Трета компонента со inline стил, прва што го поврзува со друга како конвенција.

Конзолен излез: нула.
