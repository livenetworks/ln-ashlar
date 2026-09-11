# Аудит — ln-circular-progress

2026-09-10 · Опсег: `src/ln-circular-progress.js` (120), `README.md` (175), schema · Итерација 11/50

## Вердикт

Чист passive renderer со точно нула кеширана состојба — но README-то тврди две
работи што кодот не ги прави: `max="0"` **не** дава 0%, и `aria-hidden` **никогаш**
не се поставува на SVG-то.

## Што е добро

**Нула кеширана вредност.** `_render` (`:84-108`) ги чита сите три атрибути свежо на
секој повик. Нема `this._value`, нема invalidation, нема sync чекор — состојбата
живее само во DOM-от.

**Раздвојување clamped наспроти raw во payload-от.** `detail.value` е нестегната
сурова вредност, `detail.percentage` е стегната 0–100 (`:103-108`). Тоа му дава на
консументот начин да го разликува пречекорувањето од видливиот лак — и README-то
токму така го објаснува.

**Користи го споделениот обсервер правилно.** `onAttributeChange` во
`registerComponent` (`:115-118`) наместо приватен `MutationObserver`, плус
`extraAttributes` за `-max` и `-label` (`:114`). Точно по `component-guide.md`.

**Геометријата е објаснета со броеви.** Internals ја дава причината за
`rotate(-90 18 18)` (лакот да почне на 12 часот наместо на 3) и за
`stroke-dasharray = CIRCUMFERENCE`.

**README изречно кажува што компонентата НЕ прави** — нема indeterminate режим,
нема debounce, нема `setValue()`. Секцијата „What it does NOT do" вреди да се
пресели.

## Наоди

### 🔴 CP1 — `max="0"` дава сосема друг резултат од документираниот

**Каде:** `README.md` §Attributes наспроти `:87`

README тврди:

> `data-ln-circular-progress-max="N"` … `max="0"` **forces 0%** (avoids
> divide-by-zero).

Кодот прави спротивно. Пресметката, чекор по чекор, за
`data-ln-circular-progress="50"` и `-max="0"`:

| чекор | израз | резултат |
|---|---|---|
| `:86` | `getAttribute('…-max')` | `"0"` (стринг) |
| `:87` | `rawMax \|\| 100` | `"0"` е **truthy** → поминува `"0"` |
| `progress.js:10` | `parseFloat("0") \|\| 100` | `0` е falsy → **`100`** |
| `progress.js:18` | `((50 - 0) / 100) × 100` | **50%** |

Документирано: **0%**. Стварно: **50%**.

Двојното подразбирање е и суштината — `:87` додава сопствен `|| 100` врз оној што
`calculateProgress` веќе го има (`ln-core` R10). Ниту еден од двата не ја зачувува
нулата, а `attrs.js:15` изречно го именува тој идиом како тоа што `attrInt` го
**заменува**: *„`0` стои `0` — за разлика од `parseInt(...) || 1000` идиомот што го
заменува."*

README-то си противречи и внатрешно: Internals §Render choices го документира
идиомот (`parseFloat('') || 0` / `|| 100`) точно, додека табелата на атрибути тврди
0%.

### 🔴 CP2 — `aria-hidden` на SVG-то никогаш не се поставува

**Каде:** `README.md` §Accessibility наспроти `:44-82`

README тврди:

> The component sets `aria-hidden="true"` on the constructed `<svg>` — screen
> readers skip the SVG element.

`_buildSvg` го гради SVG-то со точно три атрибути (`:45-49`): `viewBox`, `width`,
`height`, плус една класа (`:50`). **`aria-hidden` не се појавува никаде во
фајлот.** `_render` пишува ARIA само на host-от (`:97-101`), не на SVG-то.

**Последица:** host-от носи `role="progressbar"`, а внатре има неозначено SVG со
две `<circle>` деца и `<strong>` со текст. Screen reader-от чита и progressbar
најавата и содржината на етикетата.

Спореди со `ln-icon`, кое сопствениот sprite го означува правилно
(`ln-icon.js:57` — `setAttribute('aria-hidden', 'true')`).

### 🟠 CP3 — `destroy()` го остава host-от да се претставува како progressbar

**Каде:** `:25-34`

`destroy()` ги вади SVG-то и етикетата, но **не** ги брише петте ARIA атрибути што
`_render` ги напиша на host-от (`:97-101`): `role="progressbar"`, `aria-valuemin`,
`aria-valuemax`, `aria-valuenow`, `aria-valuetext`.

Останува празен `<div role="progressbar" aria-valuenow="50">` што асистивната
технологија го најавува како прогрес што повеќе не постои.

README §API го документира она што остава — *„Leaves the value attribute, colour
class, and size class in place"* — но ARIA атрибутите не ги спомнува.

### 🟡 CP4 — Изворниот пат во Internals покажува на bundle

Internals: *„Source: `components/ln-circular-progress/ln-circular-progress.js`"* —
компајлиран излез. Истиот README во §Integration **правилно** ги разликува двата
(src наспроти compiled), па Internals линијата е застарената.

Ист образец: `ln-toggle` T8, `ln-accordion` A3, `ln-autoresize` AR5.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `:change` се испраќа и при иницијалниот рендер во конструкторот (`:21` → `:103`), па document-level слушач добива по еден настан за секој прстен при boot. README-то го признава. Спореди со `ln-toggle`, кое намерно **не** испраќа `:open`/`:close` при init — двете компоненти имаат спротивна семантика за истото прашање. | `:21` |
| P2 | Целиот SVG се гради со `createElementNS` синџир (`:36-82`) наместо од `<template>`. DOCTRINE §4 бара клонирање; санкционираните исклучоци што ги најдов се `ln-confirm` (доктрина) и `ln-options`/`ln-table` select-all (README на `ln-options`). Овој не е на ниту една листа — но SVG namespace преживува во `<template>`, па аргументот „не може поинаку" тука е послаб отколку кај `<option>`. | `:36-82` |
| P3 | `ln-circular-progress__svg` / `__track` / `__fill` / `__label` се BEM element компаунди. Не е локална појава — истиот образец постои во `ln-editor`, `ln-list`, `ln-table` (11 класи вкупно). Системска работа, не наод против оваа компонента. | `:50,59,72,78` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-circular-progress` | `:4,85` | ✅ | ✅ |
| `data-ln-circular-progress-max` | `:86,114` | ✅, но **однесувањето погрешно** | ✅ |
| `data-ln-circular-progress-label` | `:92,114` | ✅ | ✅ |
| `ln-circular-progress:change` | `:103` | ✅ полн payload | н/п |
| `dom`, `svg`, `trackCircle`, `progressCircle`, `labelEl` | `:15-19` | ✅ сите пет | н/п |
| `destroy()` | `:25` | ✅, но ARIA остатокот неспомнат | н/п |
| `window.lnCircularProgress(root)` | преку `registerComponent` | ✅ | н/п |
| `aria-hidden` на SVG | **не постои** | ❌ тврди дека постои | н/п |
| `max="0"` → 0% | **не** (→ 100) | ❌ тврди 0% | н/п |

## Затечена состојба

Нула парсирани атрибути во instance state — сè се чита свежо во `_render`. Ова е
компонентата најблиску до `defineAttrs` духот без да го користи.
Нула конзолен излез.
