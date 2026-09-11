# Аудит — ln-tabs

2026-09-11 · Опсег: `src/ln-tabs.js` (191), `src/tabs-model.js` (82), `README.md` (237), schema · Итерација 19/50

## Вердикт

Најсложената логика за режим досега — тип на тригер го одредува начинот на
персистенција, со експлицитни предупредувања за мешани случаи — и моделот е чист и
жив. Наодите: видливоста на панелите зависи од theme-only класа што README-то ја
бара во маркапот, а атрибутот што е „единствен извор на вистина" останува со
невалидна вредност по fallback.

## Што е добро

**Режимот се изведува од маркапот, не од конфигурација.** `determineTabsMode`
(`tabs-model.js:235-258`) гледа што се тригерите: сите `<a href="#…">` → hash режим,
`<button>` → persist режим, мешано → експлицитен fallback со предупредување.
README:78 го кажува тоа јасно, вклучувајќи го поправеното однесување дека `id` на
button-група **повеќе не** го форсира hash режимот.

**`tabs-model.js` е чист и жив.** Три извоза, сите три увезени (`:3`) и повикани
(`:22`, `:34`, `:57`, `:111`). Нула `window`/`document`. Тоа е двослојната структура
како што треба — за разлика од `toggle-model.js` (`ln-toggle` T2).

**Откажувањето го враќа и hash-от, не само атрибутот.** `:123-131`:

```js
if (before.defaultPrevented) {
    if (prevKey in this.mapPanels) {
        this.dom.setAttribute('data-ln-tabs-active', prevKey);
        if (this.hashEnabled && hashGet(this.nsKey) !== prevKey) {
            hashSet(this.nsKey, prevKey);
        }
    }
    return;
}
```

Кај hash режим URL-от е дел од состојбата, па враќањето мора да ги фати двете.
Повеќето имплементации го враќаат само внатрешното.

**Персистираната вредност се валидира пред употреба** (`:91`) —
`saved !== null && saved in this.mapPanels`. Избришан панел во localStorage не ја
руши иницијализацијата.

**Нема настан при првата активација.** `:115` — `if (prevKey !== null)` го прескокнува
`before-change` на boot. Иста семантика како `ln-toggle`, спротивна од двете
progress компоненти (SYS-10).

**Hash кодекот е споделен**, не локален — `hashGet`/`hashSet`/`hashLinkClick` од
`ln-core`, па namespace-ирањето (`#user-tabs:settings&project-tabs:members`) работи
меѓу независни tabset-ови.

## Наоди

### 🟠 TB1 — Видливоста на панелите зависи од класа што ја нема во core бандлот

**Каде:** `:149` и `README.md:22`, `:45`

```js
panel.classList.toggle("hidden", !show);
```

README-то го издига тоа во **барање за авторот**:

> Inactive panels **must carry `class="hidden"`** to prevent a layout flash before
> initialization.

`.hidden` е дефинирана точно еднаш — `theme/utilities/_utilities.scss:16` — и се
вклучува само преку `theme/ln-ashlar-theme.scss`. `theme/ln-ashlar-core.scss`
повлекува само 17 ко-лоцирани компонентни SCSS фајла, без utilities.

Значи за консумент што испорачува `ln-ashlar-core.css`:

- сите панели се видливи **пред** init (авторската `class="hidden"` не прави ништо)
- сите панели остануваат видливи **по** init (`classList.toggle` менува класа без
  правило)
- `aria-hidden` (`:150`) е точен, па екранскиот читач добива правилна слика додека
  видливиот интерфејс е скршен

Ова е SYS-7, но со најтешка последица досега: кај `ln-core` R4 `data-ln-show` тивко
не крие; тука цел tablist се исцртува како натрупани панели.

### 🟠 TB2 — Атрибутот останува со невалидна вредност по fallback

**Каде:** `:110-111` наспроти `:95` / `:81`

```js
_component.prototype._applyActive = function (key) {
    key = resolveActiveTabKey(key, Object.keys(this.mapPanels), this.defaultKey);
```

`resolveActiveTabKey` (`tabs-model.js:267-273`) враќа `defaultKey` кога бараниот клуч
не е меѓу панелите. Компонентата потоа рендерира по резолвираниот клуч и го запишува
во `this.activeKey` (`:134`) — но **не го препишува `data-ln-tabs-active`**.

Резултат: атрибутот вели `removed-panel`, компонентата покажува `general`.

| извор на невалиден клуч | достижност |
|---|---|
| стар bookmark `#user-tabs:removed-panel` | висока |
| `data-ln-tabs-default` што сочи непостоечки панел | средна |
| координатор што испраќа `ln-tabs:request-select` со стар клуч | средна |

DOCTRINE §3 вели дека `data-ln-*` е единствениот извор на вистина. Овде компонентата
го отфрла она што атрибутот го кажува и не го поправа — па секој што го чита
атрибутот (координатор, друга компонента, DevTools) добива вредност што не одговара
на прикажаното.

### 🟠 TB3 — Авто-фокусот се пали и при вчитување на страницата

**Каде:** `:48`, `:152-155`

```js
this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
…
if (this.autoFocus) {
    const first = this.mapPanels[key]?.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 0);
}
```

`_applyActive` не се вика само при клик — `_init` го активира преку запишување на
`data-ln-tabs-active` и на двата пата (`:95` persist, `:81` преку `_hashHandler`
повикан на `:86`). Обсерверот пали, `_applyActive` тргнува, и фокусот скока во
првото поле на активниот панел **при секое вчитување на страницата**.

`preventScroll: true` спречува скролање, но фокусот сепак се одзема од таму каде
корисникот бил (адресна лента, претходен елемент), а екранскиот читач го најавува
полето.

README:84 го документира опт-аутот и default-от („Default: enabled"), но не кажува
дека однесувањето важи и на иницијалниот рендер, не само на кориснички клик.

### 🟡 TB4 — Погрешен број линии во README

README:11: *„The `ln-tabs` component (**145 lines**)"* — `src/ln-tabs.js` е **191**
линии. Ист облик како `ln-accordion` A3 („38 lines", реално 41).

### 🟡 TB5 — Две дијагностички машинерии, делумно преклопени

Компонентата има и `console.warn` и CSS dev афорданси, без правило кој случај каде
оди:

| случај | `console.warn` | `ln-tabs-dev.scss` |
|---|---|---|
| anchor тригери без namespace | ✅ `:28` | ✅ правило 1 |
| празен `data-ln-tab` клуч | ✅ `:38` | ✅ правило 2 |
| **мешани `<a>` + `<button>`** | ✅ `:26` | ❌ нема |
| `button[data-ln-tab]` во форма без `type="button"` | ❌ | ✅ правило 3 |
| `[data-ln-tab]` надвор од `[data-ln-tabs]` | ❌ | ✅ правило 4 |

Трите `console.warn` носат `[ln-` префикс, значи ги голта портата во
`ln-core/helpers.js:1-19` — невидливи се без `data-ln-debug`. Мешаните тригери,
случајот што README-то изречно го наведува како „logs a console warning" (README:78),
немаат CSS двојник, па во продукција тивко се деградира во persist режим без ниту
еден сигнал.

Ова е конкретна манифестација на нерешената виљушка `console.warn` наспроти
CSS `::after`: истата компонента користи и двете, за преклопувачки случаи.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `btn.setAttribute("data-active", "")` (`:139`) е голо `data-*`, надвор од `data-ln-*` просторот што сите други компоненти го користат за состојба — значи невидливо за `sync-ln-schemas` и за CI портата. Ист облик како `ln-confirm` C4. | `:139` |
| P2 | `this.tabs` / `this.panels` се снимаат еднаш при init (`:14-15`). Динамички додаден таб или панел не се регистрира. `registerComponent` нуди `onSubtreeChange` токму за тоа и не се користи. | `:14-15` |
| P3 | Двојниот `if (window[DOM_ATTRIBUTE] !== undefined && window[DOM_ATTRIBUTE] !== null)` (`:9`) — сите други компоненти проверуваат само `!== undefined`. | `:9` |
| P4 | Две различни политики за модификатор во ист обработувач: `:56` проверува `ctrlKey/metaKey/button===1` за копчиња, `:59` го делегира на `hashLinkClick` за anchor-и (кој проверува и `shiftKey`, но не `altKey`). `shouldIgnoreClick` од `ln-core` ги покрива сите четири. | `:56,59` |
| P5 | Схемата декларира `data-ln-tabs-for` — не се појавува во `src/**`. Доаѓа од ко-лоцираниот SCSS. Ист облик како `ln-progress` PR4, `ln-modal` M6, `ln-confirm` P2. | schema |
| P6 | Двојно книговодство за тригер-слушачите: `t[DOM_ATTRIBUTE + 'Trigger'] = handler` (`:68`) и низата `_clickHandlers` (`:69`). `destroy()` ги користи обете (`:171-174`). | `:51-70` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-tabs` | `:6` | ✅ | ✅ |
| `data-ln-tab` | `:14,34` | ✅ | ✅ |
| `data-ln-panel` | `:15,42` | ✅ | ✅ |
| `data-ln-tabs-active` (пишува JS) | `:61,64,81,95` | ✅ | ✅ |
| `data-ln-tabs-default` | `:46` | ✅ | ✅ |
| `data-ln-tabs-focus` | `:48` | ✅ со default | ✅ |
| `data-ln-tabs-key` | `:21` | ✅ | ✅ |
| `data-ln-persist` | `:89,163` | ✅ обете форми | ✅ |
| `data-active` (пишува JS) | `:139` | §CSS hooks | ❌ надвор од скенерот |
| `data-ln-tabs-for` | **не постои** | не се спомнува | ⚠️ во schema |
| `ln-tabs:request-select` | `:76` | ✅ | н/п |
| `:before-change` / `:change` / `:destroyed` | `:116,156,178` | ✅ payload точен | н/п |
| `select(key)` | `:99` | ✅ | н/п |
| авто-фокус при boot | `:152` | ❌ само default-от е документиран | н/п |
| атрибут по fallback | не се препишува | ❌ неспомнато | н/п |
| број линии | 191 | ❌ вели 145 | н/п |

## Затечена состојба

`nsKey`, `defaultKey`, `autoFocus`, `hashEnabled` се парсираат еднаш во `_init`
(`:21`, `:46-48`) — состојбата на 48/49. Овде последицата е реална: промена на
`data-ln-tabs-focus` или `-default` по init не важи, а ниту еден од двата не е во
`extraAttributes` (`:185`, кој наведува само `data-ln-tabs-active`).

Конзолен механизам: **и двата** — три `console.warn` (`:26`, `:28`, `:38`, сите зад
портата) плус четири CSS dev афорданси во `ln-tabs-dev.scss`. Прва компонента што
ги користи двата механизма истовремено.
