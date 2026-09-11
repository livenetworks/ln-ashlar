# Аудит — ln-autoresize

2026-09-10 · Опсег: `src/ln-autoresize.js` (47), `README.md` (127), schema · Итерација 4/50

## Вердикт

Механиката е точна и одлично објаснета — но конструкторот има bail пат што прави
инстанца без `this.dom`, а `destroy()` на таква инстанца **фрла**. README-то го
пропишува токму тој повик како чекор за опоравување.

## Што е добро

**Објаснето е зошто `height = 'auto'` мора да претходи на читањето.** Internals-от:
*„`scrollHeight` reports the explicit `height` when content fits inside it, so
without the reset every measurement would ratchet upward only."* Тоа е причината
поради која наивните имплементации само растат и никогаш не се собираат.

**Нула кеширана висина** — `_resize` секогаш чита свежо, па надворешна CSS промена
(`max-height`, `font-size`, padding) се фаќа на следниот притисок.

**`destroy()` го враќа `style.height = ''`** наместо да остави зашиена вредност.

**Ограничувањата се признаени, не сокриени** — скриен родител мери `scrollHeight`
како `0`, и README-то го кажува тоа заедно со рачниот излез.

## Наоди

### 🔴 AR1 — `destroy()` фрла на инстанца создадена преку bail патот

**Каде:** `:12-15` наспроти `:37-38`

```js
function _component(dom) {
    if (dom.tagName !== 'TEXTAREA') {
        console.warn('[ln-autoresize] Can only be applied to <textarea>, got:', dom.tagName);
        return this;                      // ← this.dom НИКОГАШ не е поставено
    }
    this.dom = dom;
    …
}

_component.prototype.destroy = function () {
    if (!this.dom[DOM_ATTRIBUTE]) return;   // ← TypeError: this.dom е undefined
```

**Патот до пукање, цел:**

1. `<div data-ln-autoresize>` — не е textarea → bail, инстанца без `dom`.
2. `findElements` (`ln-core/helpers.js:349`) сепак ја запишува: `el[attribute] = инстанца`.
3. Елементот се вади од DOM.
4. `registerComponent`-овата removedNodes гранка најдува `[data-ln-autoresize]`,
   зема `inst = item[attribute]` (вистинито), гледа `typeof inst.destroy === 'function'`
   (прототипен, значи да) → **`inst.destroy()`**.
5. `this.dom[DOM_ATTRIBUTE]` каде `this.dom === undefined` → **TypeError**.

**Влошувачка околност:** README §Tag validation го пропишува токму тоа:

> The element is still marked initialized, so re-attaching the attribute after
> swapping in a real `<textarea>` needs `destroy()` first.

Документираниот чекор за опоравување е повикот што фрла.

**Истиот образец во `ln-slug`** — таму со **четири** bail патишта. Не е локална
грешка, туку класа.

### 🟠 AR2 — Inline стил од JS без доктринарен исклучок

**Каде:** `:33-34` — `this.dom.style.height = 'auto'` / `= scrollHeight + 'px'`

`mindset.md:66`: *„JS only toggles `.ln-*` state classes or semantic attributes.
CSS translates those to visual output. **Zero inline styles.**"*

Ова е единствената работа што компонентата ја прави, и таа е мерење-па-пишување
висина — нешто што CSS не можеше да го изрази кога ова е пишувано. Исклучокот е
реален и образложен **во README-то на компонентата**, но доктрината и понатаму
чита апсолутно. Спореди: `ln-date` носи признат исклучок за inline `cssText`; за
`ln-autoresize` нема таков запис.

### 🟡 AR3 — README тврди слушач што не постои

README §⚡ DOM Events:

> - **Listens to `change`:** Triggers `_resize()` on value commits.

Изворот врзува само `input` (`:24`). Нема `change` слушач никаде во фајлот.
Сопствената Internals табела го потврдува тоа — наведува само `_onInput`. README-то
си противречи себеси и на изворот.

### 🟡 AR4 — Internals опишува филтриран атрибутен обсервер што повеќе не постои

README §MutationObserver via `registerComponent`:

> `attributes` (filtered to the one attribute) catches late `setAttribute` addition

Не е точно по `3628e7d`. `ln-core/helpers.js:795-799` набљудува
`{ attributes: true, subtree: true, attributeOldValue: true }` — **без**
`attributeFilter`. Сопствениот коментар на `registerComponent` го кажува тоа:
*„the MutationObserver options below, which no longer filter attributes at all."*

Веројатно системски низ READMEs напишани пред инверзијата.

### 🟡 AR5 — Изворниот пат покажува на bundle

Internals: *„Source: `components/ln-autoresize/ln-autoresize.js`"* — компајлиран
излез. Истото кај `ln-toggle`, `ln-accordion`. `ln-options` го прави правилно.

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-autoresize` | `:4` | ✅ | ✅ |
| `_resize()` јавен | `:32` | ✅ документиран како API | н/п |
| `destroy()` | `:37` | ✅ | н/п |
| слушач `input` | `:24` | ✅ | н/п |
| слушач `change` | **не постои** | ❌ тврди дека постои | н/п |
| custom настани | нула | ✅ точно кажува нула | н/п |

## Затечена состојба

Нула атрибути за парсирање. Конзола: еден `console.warn` со `[ln-` префикс (`:13`)
— поминува низ ln-core портата од R5, значи невидлив без `data-ln-debug`.
