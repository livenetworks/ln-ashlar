# Аудит checklist — ln-ashlar компоненти

Овој фајл се пишува еднаш и се цитира во секоја од 50-те итерации.
Секое правило носи **извор**. Правило без извор не е правило — тоа е предлог (🔵).

**Опсег на еден пас:** `components/ln-{name}/src/**/*.js` + `README.md` +
`ln-{name}.schema.json`. Компајлираниот bundle, `*.scss`, `demo/**` и
`docs-mcp/**` се надвор.

**Аудитот не поправа.** Наод се запишува, не се решава.

---

## A. Структура на компонентата

| # | Проверка | Извор |
|---|---|---|
| A1 | Скриптата има guard `window[DOM_ATTRIBUTE] !== undefined` пред дефиниција | component-guide.md |
| A2 | Auto-init преку `registerComponent` / `findElements` од ln-core, не сопствен MutationObserver за откривање | component-guide.md |
| A3 | Инстанцата живее на `el[DOM_ATTRIBUTE]`; конструкторот на `window[DOM_ATTRIBUTE]`; нема глобален регистар | component-guide.md „Four Conventions" |
| A4 | `destroy()` постои и чисти: сите слушачи додадени во било која фаза, сите тајмери, сите observer-и, плус `delete this.dom[DOM_ATTRIBUTE]` | component-guide.md · coding-standards §4.4 · DOCTRINE §5 |
| A5 | Trigger елементите имаат re-init guard пред `addEventListener` (двојни слушачи при повторно палење на observer-от) | component-guide.md |
| A6 | Нула sibling import-и — компонента не увезува друга компонента; само `ln-core` | DOCTRINE §2 |
| A7 | Алгоритам потребен на 2+ компоненти е кренат во `ln-core` (2-Consumer Lifting), не копиран | DOCTRINE §2 · coding-standards §1 |
| A8 | Нула шпекулативен код — функција постои само ако денес ја вика DOM школката | DOCTRINE §2 „Definition of Done" |
| A9 | `*-model.js` е чист: нула `window`, `document`, `localStorage` | coding-standards §1 |

---

## B. Атрибути и реактивност

| # | Проверка | Извор |
|---|---|---|
| B1 | `data-ln-*` е единствен извор на вистина — нема приватно огледало на вредност што и така се чита од атрибут | DOCTRINE §3 |
| B2 | Нема сопствен MutationObserver за атрибути на сопствениот host — реакцијата се декларира преку `effects` / `onAttrChange` во `registerComponent`, или `observeAttributes` | component-guide.md „Attribute Reactions" |
| B3 | Вредностите се читаат живо преку `defineAttrs`, не се парсираат еднаш во instance state и се оставаат да дрифтуваат | component-guide.md · memory: attribute-reactivity-inversion |
| B4 | Debounce за атрибутна реакција живее во самата реакција, не кај пишувачот на влезот | DOCTRINE §3 |
| B5 | `data-ln-{name}` ↔ `ln{Name}` — исто име во два случаја | component-guide.md |
| B6 | Нема атрибутни алијаси — префиксот на атрибутот и на настанот е полното име на компонентата | пресуда 2026-07-22/23 |
| B7 | `input type=checkbox` никогаш не носи toggle состојба („Checkbox Hack") | DOCTRINE §3 |
| B8 | Секој литерален `data-ln-*` во изворот се појавува во `schema.json`; конкатениран атрибут е невидлив за скенерот → потенцијален ghost | memory: schema-scanner-literal-only |

---

## C. Настани

| # | Проверка | Извор |
|---|---|---|
| C1 | Имињата се `ln-{name}:{action}` / `:request-{action}` / `:before-{action}` | component-guide.md Naming |
| C2 | Каде промената на состојба е логички откажлива: cancelable `before-` пред + non-cancelable после | DOCTRINE §5 · coding-standards §4.1 |
| C3 | Не се измислува cancelable pre-настан таму каде прелистувачот мора безусловно да продолжи | coding-standards §4.1 |
| C4 | Cross-component настаните буклаат (`bubbles: true`) — адресирањето е по `id`, не по DOM позиција | DOCTRINE §2 · mindset #3 |
| C5 | Detail Guard пред употреба на туѓ `e.detail` | DOCTRINE §5 |
| C6 | Async компонента при `destroy()` прекинува во-лет работа, чисти тајмери, отфрла pending promises; `queryGen`/`requestId` за отфрлање застарени одговори | DOCTRINE §5 „Destroyed Component Invariant" |
| C7 | Слушање само во bubble фаза — нема capture-фаза command-bus на `document` | data-flow.md §4.2 |
| C8 | Координатор не вика прототипни методи директно — праќа request настан | DOCTRINE §2 CQS |
| C9 | Компонентата работи само на сопствен DOM; нула `document`-level слушачи освен ако е тоа нејзината природа | memory: coordinator-parent-scope-doctrine |

---

## D. Markup што JS-от го создава или го бара

| # | Проверка | Извор |
|---|---|---|
| D1 | Структурата се клонира од `template[data-ln-template]` преку `cloneTemplate()` / `cloneTemplateScoped()`, не се гради со синџир `createElement` | DOCTRINE §4 · mindset #1, #12 |
| D2 | Нула зашиен кориснички текст во JS — сè од `<template>`, `buildDict()` или `Intl` | DOCTRINE §4 · coding-standards §4.3 |
| D3 | `<template>` никогаш не се испорачува како скриен library-side default (`?raw` + `innerHTML`); тој што фали паѓа гласно | mindset #12 |
| D4 | Кликливото е `<button>` / `<a>`, никогаш `<div>`/`<span>` со слушач | DOCTRINE §4 |
| D5 | Сортирање/филтрирање чита `data-ln-value`, никогаш `.textContent` | mindset #7 · memory: data-ln-value-sort-primitive |
| D6 | Датум/време во `<time datetime>`; броеви во `<strong>`/`<b>`/`<data value>` | DOCTRINE §4 |
| D7 | Групи од исти работи се `<ul>/<li>`, не браќа `<div>` | DOCTRINE §4 · CLAUDE.md |
| D8 | Иконско копче има `aria-label`; декоративна икона има `aria-hidden` | CLAUDE.md pre-flight |

---

## E. Граници

| # | Проверка | Извор |
|---|---|---|
| E1 | JS никогаш не поставува inline стил — само `.ln-*` класи или семантички атрибути | mindset #4 · component-guide.md |
| E2 | `data-ln-*` никогаш не е CSS селектор освен во сопствениот co-located SCSS на самата компонента | mindset #4 · memory: css-js-hook-boundary |
| E3 | Рендерер никогаш не вика `fetch` — транспортот е на конектор/координатор | data-flow.md §1, §4.4 |
| E4 | Нула `alert()` / `confirm()` / `prompt()` | component-guide.md |
| E5 | Не се фрлаат исклучоци што ја кршат страницата | component-guide.md |
| E6 | Конзолниот излез оди низ ln-debug sink-от, не сиров `console.*` | memory: ln-debug-console-sink-layer |
| E7 | Rate-limiting (debounce/throttle) живее кај влезниот слој, никогаш во структура на податоци | memory: rate-limiting-belongs-to-input-layer |
| E8 | Нема одбранбени guard-ови за недостижни сценарија; компонентата претпоставува исправен markup | memory: reuse-event-not-invent-sibling |

---

## F. README ↔ извор ↔ schema

| # | Проверка |
|---|---|
| F1 | Секој атрибут документиран во README **постои** во изворот |
| F2 | Секој `data-ln-*` во изворот е **документиран** во README |
| F3 | Секој испратен настан е документиран; секој документиран настан се испраќа |
| F4 | Секој јавен метод во README постои на прототипот |
| F5 | `## 🔧 Internals` го одразува вистинскиот тек, не застарен |
| F6 | Нема временски референци („иден", „planned") — доковите се пишуваат во финална состојба · memory: timeless-docs |
| F7 | Празни секции се експлицитно декларирани, не тивко испуштени · memory: docs-mcp-none-declaration |
| F8 | Примерите во README се валиден markup по правилата од D |

---

## СУСПЕНДИРАНО — не се релитигира

### Нерешени доктринарни виљушки
Овие се **отворени прашања кај корисникот**, не наоди против компонентата.
Компонента не се казнува за која било страна од виљушката.

1. **`console.warn` против CSS `::after`.** `mindset.md` #9 бара развојната грешка
   да се сигнализира со CSS афорданс, „без console.warn, без throw".
   `component-guide.md` Error Handling пропишува `console.warn('[ln-{name}] …')`
   за истата класа проблем. Двата документа се во сила.
2. **Чистота на моделот.** `component-refactoring-blueprint.md` Pillar 1 дозволува
   „прости проверки на облик"; `coding-standards.md` §1 вели рамно нула DOM
   пристап. Различна строгост.
3. **`schema.json` не е доктринарно дефиниран.** Grep за `schema.json` низ целиот
   `docs/architecture/` = нула. Постои како 50/50 универзален фајл и CI порта, но
   ниту еден документ не кажува што е договорот.
4. **README скелетот не е униформен.** Нумериран (`ln-toggle`, `ln-modal`,
   `ln-accordion`) против emoji-тематски (`ln-table`, `ln-http`) против
   по-фајл (`ln-core`). Одлука, не нужно грешка.

### Познати и одложени ставки
Се означуваат како **познати**, не се броја како нови наоди.

| Ставка | Компонента | Состојба |
|---|---|---|
| `encryptData` тивко враќа plaintext; слаб KDF (SHA-256 без salt) | ln-core/crypto.js | одложено од корисникот 2026-08-31 |
| единствен отпадник од cancelable-кон-целта договорот | ln-filter | отворено |
| мртов SCSS по бришењето на `ln-table-sort.js` | ln-sort | отворено (SCSS = надвор од опсег) |
| SSR re-render губи checked selection | ln-table / ln-list | `_restoreSelection` отворено |
| `docs/css/timeline.md` учи `data-ln-timeline`, библиотеката врзува `.timeline` | docs | отворено |
| демо HTML сè уште `div` таму каде доковите велат `ul/li` | demo | надвор од опсег |
| замрзнати од attribute-reactivity инверзијата: IDB indexes, store идентитет | ln-data-store | намерно замрзнато |

---

## Забелешка за `ln-core`

`ln-core` **не е компонента**. Нема `DOM_ATTRIBUTE`, нема конструктор, нема
auto-init, нема `destroy()`. Секцијата A се применува само во делот „нула
шпекулативен код" и „чистота". Наместо тоа, `ln-core` се суди по:

- дали функцијата е **чиста** таму каде тврди дека е,
- дали има **точно еден** сопственик на дадена одговорност (нема две функции што
  го прават истото),
- дали е **навистина споделена** (2+ консументи) или е една компонента што си го
  паркирала кодот во супстратот,
- дали sink/gate слоевите не се заобиколуваат.
