# Аудит — ln-stat

2026-09-10 · Опсег: `src/ln-stat.js` (43), `src/stat-model.js` (28), `README.md` (55), schema · Итерација 6/50

## Вердикт

Чиста event-клиент компонента без ниту еден наод во кодот. Единствените забелешки
се на границата: JS-от манипулира класа што не е негова, а README-то ги опишува
внатрешностите на **друга** компонента.

## Што е добро

**Вистински pure event client.** Нула увоз од `ln-data-store`, нула
`document.querySelector` надвор од сопствениот host, нула кеширан count. Компонентата
не памти ништо меѓу испораки — README-то го кажува тоа изречно.

**Delivery race-от е решен по дизајн, не со guard.** `ln-stat:request-count` се
испраќа во конструкторот (`:26`), што може да го промаши координаторот ако тој
booth-ира подоцна — но координаторовиот `_refreshAll()` повторно сервира на секоја
мутација на store-от, вклучувајќи `ready`. Пропуштениот прв повик се надополнува
сам. Нема `holdInit`, нема retry, нема тајмер.

**`e.detail && e.detail.count`** (`:20`) — Detail Guard е присутен, и деградацијата
е благородна: `formatStatValue(undefined)` враќа `''`, не `"undefined"`.

**`stat-model.js` е чист и жив** — двата извоза се увезени и повикани.

## Наоди

### 🟠 ST1 — JS манипулира не-`ln-` класа што не ја поседува

**Каде:** `:21` — `dom.classList.remove('is-loading')`

`mindset.md:66`: *„JS only toggles `.ln-*` state classes or semantic attributes."*

Ова е единствената појава на `is-loading` во целата библиотека — пописот на
`classList` повици низ сите компоненти дава `ln-table--loading`, `ln-list--loading`,
`ln-ajax--loading`, `ln-chart--loading`, и **едно** `is-loading` (тука).

Двојна нестандардност: класата е и **непрефиксирана**, и **авторска** — README-то
вели *„add it to show a loading placeholder"*, значи консументот ја пишува, а
компонентата ја брише. Компонентата пишува во именски простор што не е нејзин.

Спореди со `ln-toggle` T3 (`.open`): истиот шаблон, друга компонента.

### 🟡 ST2 — README ги документира внатрешностите на координаторот

`README.md` §🔧 Internals целосно опишува `_serveStat` — метод на
**`ln-data-coordinator`**, не на `ln-stat`:

> The coordinator's `_serveStat` method handles `ln-stat:request-count`: reads
> `data-ln-stat` … guards with `_ownsStore(name)` … calls `store.count(filters)`

За компонентата чиј Internals ова е, останува нула редови. Ако координаторот се
преименува или преработи, овој README тивко застарува без ниту една измена во
`ln-stat`.

### 🟡 ST3 — Временска ознака „v1"

`README.md` §Attributes: *„Multi-field filters are out of scope for **v1**."*
Истото во `ln-slug` и `ln-options` — системски образец, доковите се пишуваат во
финална состојба.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `dom.textContent = …` (`:20`) го брише сето внатрешно markup на host-от. За `<strong data-ln-stat>` тоа е точно, но ништо не спречува host со деца. | `:20` |
| P2 | `parseStatFilter` дели по **првиот** `:` (`:8`), па вредност што содржи двоеточие (`status:in:review`) дава `{status: ['in:review']}`. Веројатно намерно, но недокументирано. | `stat-model.js:8-12` |
| P3 | `destroy()` не испраќа `ln-stat:destroyed`, за разлика од `ln-toggle` и `ln-accordion`. Не е правило — но трите примитиви се разликуваат меѓусебно. | `:34` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-stat` | `:5` | ✅ | ✅ |
| `data-ln-stat-filter` | `:15` | ✅ со формат | ✅ |
| `ln-stat:request-count` | `:26` | ✅ Dispatched | н/п |
| `ln-stat:set-count` | `:23` | ✅ Received | н/п |
| `is-loading` | `:21` remove | ✅ документирана | н/п |
| прототипни методи | само `destroy` | не се спомнува | н/п |

## Затечена состојба

`_storeName` и `_filters` се парсираат еднаш во конструкторот (`:14-15`) — состојбата
на 48/49 компоненти пред `defineAttrs`. Последица тука е реална, но покриена:
промена на `data-ln-stat-filter` по init не се чита од инстанцата — сепак
координаторовиот `_refreshAll()` го **пре-парсира атрибутот од елементот**, па
живата вредност победува. README-то го кажува тоа.

Нула конзолен излез.
