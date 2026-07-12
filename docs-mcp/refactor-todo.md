# refactor-todo — одложени поправки по ревјуто на Фаза 1 (2026-07-11)

> Работен фајл — НЕ се индексира (надвор од петте индексирани фолдери).
> За посебна сесија. Се брише кога сè е решено.

## 1. MCP парсер (Проект 2) — синхронизација со англискиот контракт

Нормативните наслови се сега англиски (одлука 2026-07-11):

- `## Summary` (guides/doctrine, прва секција)
- `### Attributes Table`, `### Events API` (§3, компоненти)
- `### Base HTML Markup`, `### Variant N: <name>` (§2)
- табели: `| Attribute | Element | Type / Values | Default | Description |`,
  `| Event | Direction | Cancelable | Description | detail Object |` (Direction: `Emits` | `Listens`),
  `| Name | Kind | Parameters / Values | Description |` (Kind: `mixin` | `class` | `token` | `attribute`),
  `| Component | Role in the Pattern |`

Целосниот контракт: `docs-mcp/README.md` + `docs-mcp/_templates/`.

Дополнување (2026-07-11) — проширувања за кои парсерот треба да смета:

- **`skills/` фолдер + `classification: skill`** — нова индексирана категорија (дизајнерски одлучувачки правила, порт од `.claude/skills/ux|ui`); темплејт: `_templates/skill.md`. Персона-промптот („ти си сениор дизајнер...") е серверски слој при сервирање — НЕ е во документите.
- **`domain:` frontmatter поле** (`frontend` | `backend` | `process`) — филтрирање по домен; отсутно поле = `frontend` (правилото останува во контрактот за идни корени; постоечкиот ashlar корпус е експлицитно дотагиран 2026-07-11).
- **`context:` frontmatter поле** (`app` | `web` | `wordpress`; отсутно = `app`, засега само skills) — втора оска покрај `domain:`. ТВРДО правило при сервирање: НИКОГАШ два context-а во еден сет — правилата им се спротивни по дизајн (density/motion/декорација), mix = контрадикторна доктрина кај агентот.
- **Повеќе корпус-корени** — федериран модел (mcp-todo „Идни корпуси"): серверот чита N корени (`ln-ashlar/docs-mcp/`, идно `ln-starter/docs-mcp/`, централен process корпус) од config-низа, без динамична композиција.
- **Еден сервер, N корпуси (одлука 2026-07-11):** НЕ се прават одвоени MCP сервери по стек (ashlar / laravel / node / wordpress) — сепарацијата ја носат `domain:`/`context:` оските и config-низата корени. Кога ќе се појави потреба (тим што работи само еден стек), сервирањето добива per-client/per-project профили (scoping по domain/context). Профилот НЕ го укинува тврдото правило: никогаш два context-а во еден сервиран сет.
- **Отворено (серверска одлука):** политика за колизија на `name:` меѓу корени/фолдери (пр. две `getting-started` во frontend и backend корпус) — клучирање по патека+domain или глобална уникатност.

## 2. Native `<dialog>` миграција за `ln-modal` (архитектурска одлука 2026-07-11)

**Одлука (корисник):** `<dialog>` е семантичкиот таргет — кодот се крева до markup-от, не обратно. `doctrine/html-markup-rules.md` §6 (~линија 149) веќе го учи `<dialog id="..." data-ln-modal>` примерот; тој е aspirational додека овој рефактор не слета.

Опсег (сето во ИСТ commit — код + demos + docs):

- **JS (`js/ln-modal/src/ln-modal.js`):** отворање/затворање преку native `showModal()` / `close()`. Рачниот `role="dialog"` setAttribute (:59, :131) станува непотребен. ESC, focus-trap и inert позадина се native со `showModal()` — да се попише што од тоа е рачно имплементирано сега и да се исчисти. ВНИМАНИЕ: отворањето е рутирано преку hash state (`hashSet`, :243) — URL-от е извор на вистина за отворен модал; native API повиците мора да останат подредени на hash текот, не паралелен пат. Одлука при дизајн: односот меѓу native `open` атрибутот и нашиот `data-ln-modal="open"` state (CSS surface + `[data-ln-modal-when]`/mode toggle композицијата).
- **SCSS (`scss/config/mixins/_modal.scss`, `scss/components/_modal.scss`):** mixin препишување за dialog UA стилови (auto margins, border, padding, fit-content димензии, `dialog:not([open]) { display: none }`); overlay-от се заменува со native `::backdrop`.
- **Top-layer каскада (КЛУЧНОТО прашање):** `showModal()` = top layer → z-index елевацијата за телепортирани dropdown/popover (`body:has(.ln-modal[data-ln-modal="open"]) > &` — `_dropdown.scss:16`, `_popover.scss:7`) престанува да работи: телепортиран елемент на `body` НЕ МОЖЕ да се рендерира над top layer со никаков z-index. Придружен рефактор: dropdown/popover (и tooltip?) на native Popover API (`popover` атрибут — исто top layer, стекување по редослед на отворање). Насоката е „сè во top layer" — кохерентна, но го заменува целиот teleport+елевација механизам. Half-миграција (само модалот во top layer) е СКРШЕНА состојба — не се пушта одделно.
- **`.ln-modal` класниот договор:** `:has()` елевациските селектори се бришат кога popover-ите ќе се преселат во top layer; `.ln-modal` останува чист SCSS binding за изглед.
- **Компатибилност:** библиотеката веќе користи `:has()` — `<dialog>` (baseline 2022) и Popover API (baseline 2024) не се поголем скок.
- **Преодна недоследност во doctrine:** `html-markup-rules.md` ~линија 29-31 („Correct Modal Markup") сè уште учи `<div class="ln-modal" data-ln-modal>` а ~149 учи `<dialog>` — двата канона во ист документ; се синхронизираат најдоцна со овој рефактор.
