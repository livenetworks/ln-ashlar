# refactor-todo — одложени поправки по ревјуто на Фаза 1 (2026-07-11)

> Работен фајл — НЕ се индексира (надвор од петте индексирани фолдери).
> За посебна сесија. Се брише кога сè е решено.

## 1. `doctrine/data-flow.md` — препишување на §2 „The Write Loop" (pre-v2 → v2)

Погрешно сега / вистина во кодот:

- `ln-form:submit` → реалниот настан е **`ln-form:submit-record`** (`js/ln-form/src/ln-form.js:64`); формата бара claim преку `data-ln-form-scope`, инаку `console.warn`
- `_pending: true/false` — НЕ постои; v2 нема pending machinery (ruling 2026-07-09)
- настан `ln-store:change` (+ source `reconcile`/`revert`) — НЕ постои; реални настани: `ln-store:created` / `updated` / `deleted` / `loaded` / `synced` / `ready` / `initialized`
- „revert на pre-submit снимка" — реалната error-политика е диференцирана по HTTP статус (`js/ln-data-coordinator/src/ln-data-coordinator.js`, `connError` handler): 401/419 → auth-pause; 5xx/network → retry/queue; 409 update → замена со remote; 4xx create → бришење на локалниот запис; други 4xx → остава локално

Извор на вистина: `js/ln-data-coordinator/src/`, `js/ln-form/src/`, `js/ln-couchdb-connector/src/` —
НЕ `docs/architecture/data-flow.md` (тој е застарен, самиот го носи pre-v2 наративот).

## 2. `doctrine/data-layer.md` — препишување на §3.A „Direct Pipeline" + v2 котви

- истите pre-v2 грешки како точка 1, плус: tempId форматот е **`_temp_<uuid>`**, не `tmp_<uuid>` (`ln-data-coordinator.js`, `_uuid()`)
- недостасуваат мандаторните v2 котви:
  - toast envelope **`{message, content}`** (`ln-couchdb-connector.js` + `_toastFromMessage` во координаторот)
  - **`data-ln-form-scope`** write intake
  - **паралелен fan-out** (`_fanOutCreate` / `_fanOutUpdate` / `_fanOutDelete` — двоен dispatch кон store + connector/queue, без snapshot/pending книговодство)

## 3. MCP парсер (Проект 2) — синхронизација со англискиот контракт

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

## 4. guides/ — критични наоди од ревјуто на Фаза 2 (2026-07-11)

Средните/ситните наоди се поправени истиот ден; овде се само критичните.

### 4.1 `guides/write-workflow.md` — иста pre-v2 нарација како точки 1-2 (да се работат ЗАЕДНО)

- линии ~54, 59, 110, 123 (+ mermaid дијаграмот): `_pending: true` машинерија — НЕ постои; store директно запишува (`js/ln-data-store/src/ln-data-store.js:233-257`; README на store-от: „нема `_pending`, нема rollback"). Rekey = id-swap без флег.
- линија ~43: „reverts" — revert не постои; вистинската error-политика е во точка 1 (диференцирана по HTTP статус).
- линија ~83: `field_diffs` — нула појави во `js/`; 409 враќа само `remote` (`ln-data-coordinator.js:534`). Да се избрише, или експлицитно да се означи како хипотетичко серверско поле, не системско однесување.
- Остатокот од документот е проверен и ТОЧЕН (submit-record, scope, `_temp_`, fan-out, `{message,content}` envelope) — поправката е хируршка, не препишување.

### 4.2 `guides/getting-started.md` — Option B ветува `dist/` од npm пакетот

`package.json` → `"files": ["scss/", "js/"]` — објавениот пакет НЕ содржи `dist/` (потврдено со `npm pack --dry-run`); `dist/` е build излез (`vite.config.js` → `outDir: 'demo/dist'`). Option B да се препише: dist артефактите се добиваат со `npm run build` локално (или иден Release/CDN артефакт ако се воведе).

### 4.3 `guides/coordinator-authoring.md` (~линија 41) — халуциниран настан `ln-toggle:request-open`

Нула појави во `js/`. `ln-toggle` е канонски attribute-bridge-only — НЕМА request-event површина (`js/COMPONENTS.md`). Да се замени примерот: или компонента со реална request-event површина, или да остане само `setAttribute` варијантата.

### 4.4 Успатен наод — stale демо документација за `ln-store:conflict`

`demo/admin/store.html:353` и `demo/admin/src/pages/store.html:146` документираат настан `ln-store:conflict` со `field_diffs` — настанот НЕ постои во `js/`. Да се исчисти во истата сесија (изворот е `src/pages/store.html`; компајлираната се регенерира со build).

## 5. Native `<dialog>` миграција за `ln-modal` (архитектурска одлука 2026-07-11)

**Одлука (корисник):** `<dialog>` е семантичкиот таргет — кодот се крева до markup-от, не обратно. `doctrine/html-markup-rules.md` §6 (~линија 149) веќе го учи `<dialog id="..." data-ln-modal>` примерот; тој е aspirational додека овој рефактор не слета.

Опсег (сето во ИСТ commit — код + demos + docs):

- **JS (`js/ln-modal/src/ln-modal.js`):** отворање/затворање преку native `showModal()` / `close()`. Рачниот `role="dialog"` setAttribute (:59, :131) станува непотребен. ESC, focus-trap и inert позадина се native со `showModal()` — да се попише што од тоа е рачно имплементирано сега и да се исчисти. ВНИМАНИЕ: отворањето е рутирано преку hash state (`hashSet`, :243) — URL-от е извор на вистина за отворен модал; native API повиците мора да останат подредени на hash текот, не паралелен пат. Одлука при дизајн: односот меѓу native `open` атрибутот и нашиот `data-ln-modal="open"` state (CSS surface + `[data-ln-modal-when]`/mode toggle композицијата).
- **SCSS (`scss/config/mixins/_modal.scss`, `scss/components/_modal.scss`):** mixin препишување за dialog UA стилови (auto margins, border, padding, fit-content димензии, `dialog:not([open]) { display: none }`); overlay-от се заменува со native `::backdrop`.
- **Top-layer каскада (КЛУЧНОТО прашање):** `showModal()` = top layer → z-index елевацијата за телепортирани dropdown/popover (`body:has(.ln-modal[data-ln-modal="open"]) > &` — `_dropdown.scss:16`, `_popover.scss:7`) престанува да работи: телепортиран елемент на `body` НЕ МОЖЕ да се рендерира над top layer со никаков z-index. Придружен рефактор: dropdown/popover (и tooltip?) на native Popover API (`popover` атрибут — исто top layer, стекување по редослед на отворање). Насоката е „сè во top layer" — кохерентна, но го заменува целиот teleport+елевација механизам. Half-миграција (само модалот во top layer) е СКРШЕНА состојба — не се пушта одделно.
- **`.ln-modal` класниот договор:** `:has()` елевациските селектори се бришат кога popover-ите ќе се преселат во top layer; `.ln-modal` останува чист SCSS binding за изглед.
- **Компатибилност:** библиотеката веќе користи `:has()` — `<dialog>` (baseline 2022) и Popover API (baseline 2024) не се поголем скок.
- **Преодна недоследност во doctrine:** `html-markup-rules.md` ~линија 29-31 („Correct Modal Markup") сè уште учи `<div class="ln-modal" data-ln-modal>` а ~149 учи `<dialog>` — двата канона во ист документ; се синхронизираат најдоцна со овој рефактор.
