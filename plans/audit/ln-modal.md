# Аудит — ln-modal

2026-09-10 · Опсег: `src/ln-modal.js` (150), `README.md` (187), schema · Итерација 13/50

## Вердикт

Миграцијата на нативен `<dialog>` е направена како што треба — focus trap, ESC,
top-layer и враќање фокус се препуштени на платформата наместо да се имитираат. Двата
наода се дека README-то си противречи себеси на две места, и дека затворањето
испраќа `:close` пред модалот навистина да се затвори.

## Што е добро

**Платформата ја врши тешката работа.** Нема сопствен focus trap, нема keydown
слушач за ESC, нема ракување со z-index или backdrop. `showModal()` (`:110`) и
`close()` (`:137`) го носат сето тоа. ESC се фаќа преку нативниот `cancel` настан
(`:27-30`), му се прави `preventDefault()`, и се пренасочува низ **истиот** атрибутен
пат како секое друго затворање — па откажувањето преку `before-close` важи и за ESC.

**Dev афордансот е направен по доктрината.** `ln-modal-dev.scss:15-17`:

```scss
[data-ln-modal]:not(dialog) {
    @include dev-inline-error("data-ln-modal must be on a <dialog> element");
}
```

Тоа е точно механизмот што `mindset.md` #9 го бара — CSS `::after` под
`[data-ln-debug]`, без `console.warn`. Плус проверка за модал без `id` и за празен
`data-ln-modal-for`. Ова е компонентата што ја покажува „чистата" страна на
конзолната виљушка.

**Приоритетот на фокусот е мислен** (`:112-125`): `[autofocus]` → прво овозможено
поле → прв линк/копче, и **секој кандидат филтриран низ `isVisible`**. Скриено поле
не го краде фокусот.

**Body класата е ref-counted правилно.** И `destroy()` (`:78-84`) и патот на
затворање (`:139`) проверуваат дали останал друг отворен модал пред да го тргнат
`ln-modal-open`. Вгнездени/паралелни модали не се гаснат меѓусебно.

**Границата е повлечена и запишана.** Internals `:165` изречно кажува дека
делегацијата на тригери, hash-адресирањето и полнењето форма **не** се тука туку во
`ln-ui-coordinator` — и тоа е точно: `ln-ui-coordinator.js:99-121` ги држи.

## Наоди

### 🟠 M1 — README §3 ги документира методите, Internals вели дека не постојат

**Каде:** `README.md:77-79` наспроти `README.md:169`, изворот `:55-66`

§3 ги дава со пример код и им дава име:

> ```js
> // Or via instance attribute-bridge methods
> modal.lnModal.open();
> modal.lnModal.close();
> modal.lnModal.toggle();
> ```

Internals, 90 линии подолу, вели спротивно:

> `_syncAttribute(el)` … is the sole place open/close side effects happen — **there
> is no imperative `open()`/`close()` method on the instance**.

Изворот ги има сите три (`:55`, `:59`, `:63`). Внатрешно се точни — само пишуваат
атрибут, значи „attribute-bridge" е точниот опис од §3 — но еден README не смее и да
ги учи и да ги негира.

Ист облик како `ln-toggle` T1, со разлика што таму README-то само негира; тука прво
учи, па негира.

### 🟠 M2 — `:close` се испраќа додека модалот е сè уште отворен

**Каде:** `:134-141`

Редоследот во изворот:

```js
instance.isOpen = false;
dispatch(el, 'ln-modal:close', …);        // :135
if (typeof el.close === 'function') el.close();   // :137
if (!document.querySelector('[data-ln-modal="open"]')) {
    document.body.classList.remove('ln-modal-open');   // :140
}
```

README §4 ја опишува истата ќелија вака:

> **`ln-modal:close`** … Dispatched **after** modal is closed, scroll locks
> released, and focus restored.

Сите три тврдења се неточни во моментот на испраќање:

| тврдење | состојба на `:135` |
|---|---|
| „modal is closed" | `<dialog>` е сè уште отворен во top layer, backdrop-от се гледа |
| „scroll locks released" | `body.ln-modal-open` е сè уште поставена (се тргa на `:140`) |
| „focus restored" | нативниот `close()` уште не е повикан (`:137`) |

Гранката за **отворање** е обратна и точна: `showModal()` (`:110`) доаѓа **пред**
`dispatch(:open)` (`:127`), па за `:open` README-то е во право. Значи асиметријата е
вистинска во кодот, а README §4 ги опишува двата настана како симетрични.

Сопствениот Internals `:175` го дава редоследот **точно**
(`:before-close → isOpen=false → :close → el.close() → remove body class`) —
значи §4 е застарената половина, не Internals.

**Последица:** слушач на `ln-modal:close` што чита `dialog.open` добива `true`, а
што чита `body.classList.contains('ln-modal-open')` добива `true`.

### 🟠 M3 — Feature-detect-от го чува само повикот, не и последиците

**Каде:** `:47-50` и `:102-127`

```js
if (typeof el.showModal === 'function') el.showModal();
```

Ако host-от не е `<dialog>` — на пр. `<div data-ln-modal>` — `showModal` не постои,
повикот се прескокнува, но сè друго продолжува:

- `instance.isOpen = true` (`:108`)
- `document.body.classList.add('ln-modal-open')` (`:109`) — **скролот се заклучува**
- фокусот се преместува во елемент што не е видлив (`:112-125`)
- `ln-modal:open` се испраќа (`:127`) како да успеало

Резултат во продукција: заклучена страница без видлив модал и изгубен фокус.

Dev афордансот (`ln-modal-dev.scss:15`) го фаќа случајот — но само под
`data-ln-debug`. Наодот не е дека нема сигнал, туку дека гардот стои околу еден ред
додека четирите странични ефекти поминуваат безусловно.

### 🔵 M4 — `destroy()` не го затвора отворен модал

`:68-89` ги симнува слушачите, ја чисти body класата и испраќа `:destroyed` — но
никогаш не вика `el.close()`. Отворен `<dialog>` уништен додека е сè уште во
документот останува во top layer без компонента што го води.

Автоматскиот пат до `destroy()` (removedNodes во `ln-core`) важи само за откачени
елементи, каде тоа не е важно — значи е достижно само преку рачен повик.

### 🔵 M5 — Излишен `contains` гард

`:35` — `if (closeBtn && self.dom.contains(closeBtn))`. Слушачот е закачен на
`this.dom` (`:44`), па сè што бубла до него веќе е внатре. Гардот покрива само
екзотичен случај каде самиот `<dialog>` е потомок на елемент со
`data-ln-modal-close`.

### 🔵 M6 — Schema декларира три атрибути што JS-от не ги допира

`data-ln-modal-for`, `data-ln-modal-mode`, `data-ln-modal-when` доаѓаат од
ко-лоцираниот SCSS, не од `src/ln-modal.js`:

| атрибут | извор во schema | кој навистина го пишува |
|---|---|---|
| `data-ln-modal-for` | `ln-modal-dev.scss:10` | авторот; се чита во `ln-ui-coordinator:100` |
| `data-ln-modal-mode` | `ln-modal.scss:48-49` | **`ln-ui-coordinator:121`** |
| `data-ln-modal-when` | `ln-modal.scss:44` | авторот; чисто CSS |

Ко-лоцираноста го оправдува стилот, но schema-та изгледа како да ln-modal ги
поседува. Ист облик како `ln-progress` PR4.

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-modal` | `:4` | ✅ | ✅ |
| `data-ln-modal-close` | `:34` | ✅ | ✅ |
| `data-ln-modal-for` | не во JS | ✅ (насочува кон координатор) | ✅ (од SCSS) |
| `data-ln-modal-mode` / `-when` | не во JS | не се спомнуваат | ✅ (од SCSS) |
| `ln-modal:request-open` / `-close` | `:41-42` | ✅ Listens | н/п |
| `:before-open` / `:open` | `:103,127` | ✅, редослед точен | н/п |
| `:before-close` / `:close` | `:129,135` | ⚠️ §4 редослед погрешен, Internals точен | н/п |
| `:destroyed` | `:87` | ✅ | н/п |
| `open()` / `close()` / `toggle()` | `:55-66` | ⚠️ §3 ги учи, Internals ги негира | н/п |
| `isOpen` | `:13` | ✅ read-only query | н/п |
| нативен `cancel` (ESC) | `:27` | ✅ Internals §ESC | н/п |

## Затечена состојба

`instance.isOpen` е приватно огледало на атрибутот (`:13`, менувано на `:108`,
`:134`), користено како no-op гард на `:100`. Состојбата на 48/49 компоненти пред
`defineAttrs`.

Конзолен механизам: **нула конзолни повици** — целата дијагностика оди преку
`-dev.scss` CSS афордансот. Единствената компонента досега што е целосно на таа
страна од виљушката.

`:destroyed` пак се испраќа од `destroy()`, чиј автоматски пат важи само за откачени
јазли (SYS-12).
