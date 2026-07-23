# mcp-todo — Чеклиста за авторирање на docs-mcp/ корпусот

> Работен фајл — НЕ се индексира (стои надвор од петте индексирани фолдери).
> Се брише кога сè ќе биде `stable`.

## Правила на работа (за секој документ)

1. **Извори:** draft фајл (`architecture_docs_draft/`) + `js/ln-x/README.md` + изворниот код. Draft-от е суровина, НЕ вистина — секој атрибут/настан/вредност се проверува наспроти кодот пред да влезе.
2. **Калап:** точниот темплејт од `docs-mcp/_templates/` — насловите се parsing contract, не се менуваат.
3. **Frontmatter:** `name` == име на фајлот, `classification` според фолдерот, се раѓа со `status: draft`.
4. **Валидација:** `validate_docs` на MCP серверот пред commit.
5. **Stable:** `status: stable` дури откако атрибути, вредности, настани и markup се спроверени наспроти изворниот код.
6. По v2 write-pipeline (2026-07-09): секој документ што допира форми/податочен слој се проверува за `{message,content}` envelope, `data-ln-form-scope`, native-submit intake (no custom event) — draft-овите се постари од овие одлуки.
7. **Јазик:** содржината на документот е на АНГЛИСКИ (проза, наслови, табели) — насловите се англиски и се parsing contract. Meta/работните фајлови остануваат на македонски.

---

## Фаза 1 — doctrine/ (прво: заедничкиот mindset)

- [x] **mindset** — извори: `docs/architecture/mindset.md`, `docs/architecture/philosophy.md`
- [x] **html-markup-rules** — семантички HTML, ul/li правило, без гол `<div>`, кликабилни = `<button>`/`<a>` — извори: `docs/architecture/reference.md`, skills
- [x] **scss-architecture** — двослојна архитектура (mixin layer / binding), override & theming, токени — извори: `docs/architecture/reference.md`, `docs/css/theming.md`, `docs/css/tokens.md`
- [x] **js-component-model** — `data-ln-*` binding, настани како јазик, ортогоналност, без стилови во JS — извори: `docs/js/component-guide.md`, `docs/js/core.md`, `js/COMPONENTS.md`
- [x] **data-flow** — `{{ }}` vs `data-ln-field` матрица на одлука — извор: `docs/architecture/data-flow.md`
- [x] **data-layer** — store / coordinator / конектори, паралелен fan-out (v2) — извори: `docs/architecture/data-store-architecture.md`, `docs/architecture/coordinator.md`

## Фаза 2 — guides/

- [x] **getting-started** — инсталација, dist/, прв markup — ⚠ нема извор, се пишува одново — ✔ dist/-не-се-шипува-преку-npm наодот РЕШЕН на doc-слој (2026-07-17): §1 сега документира сите 4 патишта (A CDN преку jsDelivr@gh/demo/dist, B npm=извор+сопствен build, C precompiled self-host clone, D git submodule); npm-патот повеќе не праќа на непостоечки node_modules/dist. Отворено (packaging одлука кај корисникот, НЕ doc): дали воопшто да се шипува вистински `dist/` на npm
- [x] **write-workflow** — форма → scope → coordinator → конектор → toast — извори: `architecture_docs_draft/write-workflow-guide.md`, `architecture_docs_draft/form-write-workflow.md` ⚠ двата draft-а се пред v2 rulings — задолжителна проверка наспроти кодот — ⚠ критични наоди (pre-v2 `_pending`/reverts/`field_diffs`) → `refactor-todo.md` §4.1
- [x] **spa-routing** — hash state + router — извори: `docs/architecture/hash-state.md`, `docs/js/router.md`
- [x] **component-authoring** — како се прави СВОЈА компонента: IIFE, attribute bridge (setAttribute = single source of truth), MutationObserver (childList + attributes), lifecycle events (`before-*` cancelable + post), template систем (`cloneTemplate`/`cloneTemplateScoped` + `fill`), dict pattern (i18n), co-located SCSS, API export патерни — извори: `js/COMPONENTS.md` (главна библија, интерна, англиски), `docs/js/component-guide.md`, `docs/architecture/reference.md#adding-a-new-js-component`
- [x] **coordinator-authoring** — како се пишува проект-координатор (Mediator): четирите работи (UI trigger → request event, обработка на форми, notification → UI feedback, мост A→B), commands = request events / queries = директен API, изолациски правила — извори: `js/COMPONENTS.md` (§Coordinator — Full Example, §Mediator pattern), `docs/architecture/coordinator.md` ⚠ v2 проверка — ⚠ критичен наод (`ln-toggle:request-open` не постои) → `refactor-todo.md` §4.3

> Двата authoring водичи се раскажувачкиот слој над 3Б — секој линка кон
> позадинските API документи (`ln-core`, `ln-http`, `positioning`...).
> Доктрината „зошто" останува во `doctrine/js-component-model`; овде е „како".

---

## Фаза 3 — components/ (51)

### 3А. Употребливи компоненти — декларативен `data-ln-*` API (42)

Публика: секој што гради страници со библиотеката. `classification: simple | coordinator`.

#### Калибрација (прв документ — го тестира темплејтот и MCP парсерот)

- [x] **ln-toggle** — најзрел draft; со него се калибрира целиот pipeline

#### Табели и листи

- [x] **ln-table**
- [x] **ln-sortable**
- [x] **ln-filter**
- [x] **ln-search**
- [x] **ln-list**
- [x] **ln-stat**

#### Форми и внес

- [x] **ln-form** — ⚠ v2 проверка (scope, native-submit intake)
- [x] **ln-validate**
- [x] **ln-options**
- [x] **ln-date**
- [x] **ln-time**
- [x] **ln-number**
- [ ] **ln-upload**
- [x] **ln-editor**
- [x] **ln-slug**
- [x] **ln-autoresize**
- [x] **ln-autosave**
- [x] **ln-fill**
- [x] **ln-modal-fill**
- [x] **ln-confirm**

#### Overlay и интеракција

- [x] **ln-modal**
- [x] **ln-popover**
- [x] **ln-dropdown**
- [x] **ln-tooltip**
- [x] **ln-accordion**
- [x] **ln-tabs**
- [x] **ln-toast**

#### Податочен слој (декларативно wiring — store/coordinator/конектори)

- [x] **ln-data-store**
- [x] **ln-data-coordinator** — ⚠ v2 проверка (паралелен fan-out, без pending)
- [x] **ln-couchdb-connector** — ⚠ draft-от е ДОКАЖАНО застарен (нема `{message,content}` envelope, уште `{record, tempId}`) — `docs/js/couchdb-connector.md` е поточен
- [x] **ln-api-connector**
- [x] **ln-api-queue**

#### Навигација

- [x] **ln-nav**
- [x] **ln-router**
- [x] **ln-link**
- [x] **ln-external-links**
- [x] **ln-ajax** — AJAX навигација (`data-ln-ajax`)

#### Сервиси со markup контакт

- [x] **ln-icons** — се врзува за `<use href>`, не за `data-ln-*` — API-то е markup конвенција
- [x] **ln-translations**
- [x] **ln-progress**
- [x] **ln-circular-progress**

### 3Б. Позадински API — за развивачи на свои компоненти/координатори (9)

Публика: некој што гради СВОја компонента/координатор врз библиотеката.
`classification: service`. Овие немаат markup темплејти — §2 покажува JS употреба
(import + повик), §3 е API табела. Сите линкаат назад кон `guides/component-authoring`.

- [ ] **ln-core** — прегледен документ на споделениот модул: `findElements`, `dispatch`/`dispatchCancelable`, `cloneTemplate`/`cloneTemplateScoped`, `fill`/`fillTemplate`, `buildDict`, `renderList`, `reactiveState`/`deepReactive`/`createBatcher` + мапа кон модулските документи подолу — извори: `js/ln-core/index.js`, `js/ln-core/helpers.js`, `js/COMPONENTS.md` (⚠ нов документ, нема draft)
- [ ] **ln-helpers** — извор: `js/ln-core/helpers.js` — ⚠ отворена одлука при пишување: дали се спојува во **ln-core** (преклоп)
- [ ] **ln-reactive** — `reactiveState`/`deepReactive`/`createBatcher` — извори: `js/ln-core/reactive.js`, `docs/js/core.md`
- [x] **positioning** — споделено viewport-aware позиционирање (dropdown/popover/tooltip) — извор: `js/ln-core/positioning.js`
- [x] **ln-hash** — hash state примитив — извор: `js/ln-core/hash.js` (го користат ln-router, ln-tabs)
- [ ] **ln-persist** — localStorage persistence примитив — извор: `js/ln-core/persist.js` (го користат ln-tabs, ln-filter, ln-toggle, ln-table-sort)
- [x] **ln-crypto** — извор: `js/ln-core/crypto.js`
- [x] **ln-http** — event-driven JSON fetch со abort — извори: `js/ln-http/`, `docs/js/http.md`
- [ ] **ln-debug** — dev дијагностика (не е за production употреба) — извор: `js/ln-debug/`

---

## Фаза 4 — css/ (извор: `docs/css/*.md` + scss изворите; draft нема css документи)

### Темели

- [ ] **tokens**
- [ ] **mixins**
- [ ] **breakpoints**
- [ ] **density**
- [ ] **theming**
- [ ] **typography**
- [ ] **motion**

### Layout

- [ ] **layout**
- [ ] **app-shell**
- [ ] **sections**
- [ ] **page-header**
- [ ] **navigation**

### Визуелни компоненти

- [ ] **cards**
- [ ] **tables**
- [ ] **forms**
- [ ] **toggles-and-pills**
- [ ] **alert**
- [ ] **avatar**
- [ ] **breadcrumbs**
- [ ] **chip**
- [ ] **empty-state**
- [ ] **kbd**
- [ ] **loader**
- [ ] **prose**
- [ ] **stat-card**
- [ ] **status-badge**
- [ ] **stepper**
- [ ] **timeline** — ⚠ `docs/css/timeline.md` учи `data-ln-timeline`, а библиотеката врзува `.timeline` класа — да се исправи при пишување
- [ ] **tooltip** (css слојот; JS-делот е во components/ln-tooltip)

---

## Фаза 5 — patterns/ (композитни рецепти — листата се дополнува)

- [ ] **data-table-sync** — табела + store + coordinator + sort/filter/search — извор: `demo/admin/table-sync.html` (канонски showcase)
- [ ] **table-filter-popover** — статичен авториран filter markup (popover + search + filter, опции од домен-извор)
- [ ] **modal-crud** — modal-fill + form + confirm + toast (create/edit/delete тек) — извор: docuflow/admin демоа
- [ ] **search-filter-list** — пребарување и филтрирање врз листи (без табела)
- [ ] **dashboard-stats** — stat + circular-progress + page-header композиција

---

## Фаза 6 — skills/ (порт од `.claude/skills/` — дизајнерски одлучувачки правила)

Публика: дизајнер-агенти (UI/UX) преку MCP серверот. `classification: skill`, `domain: frontend`, темплејт `_templates/skill.md`.

**Одлука 2026-07-13 — skills се standalone:** фолдер = context (`skills/app/` сега, `web/`/`wordpress/` идни); `context:`/`source:` излегуваат надвор од frontmatter (context се изведува од патеката); правилата се библиотечно-неутрални — без grounding линкови/ознаки (`grounded`/`dangling`/`aspirational`) кон компоненти, миксини или изворни патеки. Порт = селекција + адаптација, БЕЗ grounding-верификација наспроти кодот.

⚠ При порт се ЗАЧУВУВААТ scope-квалификаторите („never **in data tools**" останува scoped, не се генерализира во „never") — идните `web/`/`wordpress/` фолдери носат спротивни правила по дизајн.
Персоната („ти си сениор дизајнер...") живее во промптот на MCP серверот — документите носат САМО нормативни правила; `## Identity` секциите од изворите СЕ ОТСТРАНУВААТ при порт.

### Јадро (прво — претежно код-агностични, брза добивка)

- [x] **ux** — извор: `.claude/skills/ux/SKILL.md` (action-feedback loop, четирите состојби, feedback стратегија, destructive flows, multi-step, error recovery, edge cases, motion)
- [x] **ux-interaction-patterns** — извор: `.claude/skills/ux/interaction-patterns.md` — ⚠ непрегледан извор, оди со ревју
- [x] **ui** — извор: `.claude/skills/ui/SKILL.md` (design-first процес, data priority, layout одлуки, component selection, completeness, density, page checklists)
- [x] **ui-visual-language** — извор: `.claude/skills/ui/visual-language.md`

### Component-completeness спецификации (инкрементално, СПАРЕНИ со Фаза 3/4)

9-те completeness skills се пишуваат standalone во `skills/app/`, без спарување/верификација со компонентните докови (изворите од `.claude/skills/ui/components/` остануваат каменолом).

- [ ] **ui-data-table** — извор: `ui/components/data-table.md` — со **ln-table** (3А)
- [ ] **ui-form** — извор: `ui/components/form.md` — со **ln-form** (3А) — ⚠ „reserved error space": да се провери дали form микс-ините резервираат простор; ако не → aspirational ознака
- [ ] **ui-modal** — извор: `ui/components/modal.md` — со **ln-modal** (3А) — ⚠ усогласување со native `<dialog>` одлуката (`refactor-todo.md` §5)
- [ ] **ui-search** — извор: `ui/components/search.md` — со **ln-search** (3А)
- [ ] **ui-tabs** — извор: `ui/components/tabs.md` — со **ln-tabs** (3А)
- [ ] **ui-empty-state** — извор: `ui/components/empty-state.md` — со **empty-state** (Фаза 4)
- [ ] **ui-loading-state** — извор: `ui/components/loading-state.md` — со **loader** (Фаза 4)
- [ ] **ui-kpi-card** — извор: `ui/components/kpi-card.md` — со **ln-stat** (3А) / **stat-card** (Фаза 4)
- [ ] **ui-status-badge** — извор: `ui/components/status-badge.md` — со **status-badge** (Фаза 4)

### НЕ се портира (одлука 2026-07-11)

- `.claude/skills/ln-ashlar/**` — имплементациска референца; components/css/guides веќе го покриваат теренот (порт = дупликат + дрифт)
- `html/`, `css/`, `js/`, `architecture/**` — покриено со doctrine/
- `frontend-design/` — Anthropic artifact-естетика; противречи на дизајн-јазикот за data tools (scroll-triggered анимации, „bold" фонтови)
- `laravel/`, `database/`, `ln-starter/` — каменолом за ИДНИОТ backend корпус (види „Идни корпуси")
- `iso-ai-assistant/`, `doc-discipline/` — каменолом за ИДНИОТ process корпус

По завршен порт: `.claude/skills/ux|ui` стануваат тенки покажувачи кон `docs-mcp/skills/` (анти-дрифт).

---

## Идни корпуси (визија 2026-07-11 — MCP = Live Networks развоен процес, не само ashlar)

Федериран модел: **дрифтува ли од код → живее со кодот; нема код → централно.** Серверот (Проект 2) индексира повеќе корпус-корени (config-низа); селекцијата е декларирана припадност преку `domain:` во frontmatter, НЕ динамична композиција. Парсер-импликации: `refactor-todo.md` §3.

- **frontend** — овој корпус (`ln-ashlar/docs-mcp/`); сите постоечки документи носат експлицитно `domain: frontend` (batch дотагирано 2026-07-11).
- **backend** — иден корпус во ln-starter репото (`ln-starter/docs-mcp/`, ист контракт и темплејти, ист commit-принцип); каменолом: `.claude/skills/laravel/`, `database/`, `ln-starter/`.
- **process** — код-неврзани процедури (git конвенции, code-review правила, ISO); централен — „само документација" репо е безбедно САМО овде, зашто нема код од кој да дрифтува; каменолом: `.claude/skills/iso-ai-assistant/`, `doc-discipline/`.

**Context оска (одлука 2026-07-11):** сегашните ux/ui skills се `context: app` (апликациски, data-dense дизајн). Доаѓаат посебни сетови: **web (презентациски)** — спротивни правила (density/motion/декорација се флипуваат; `frontend-design/` изворот станува делумен каменолом тука) и **WordPress** — локација по федерираното правило (со кодот ако има LN theme/plugin репо, инаку централно). Серверот НИКОГАШ не меша два context-а во еден сервиран сет.

Реализирано 2026-07-13 преку subfolders (`skills/app/`); context се изведува од патека, не од frontmatter.

**Крајна насока:** Lovable-тип платформа за генерирање апликации/сајтови со LN стил — корпусот е style-engine-от: skills = КОГА/ШТО, patterns = готов верификуван markup, doctrine = ограничувања, components = API вистина. За генерација patterns/ станува најносечката категорија — идно проширување кон page-level patterns (цела CRUD страница, dashboard, login, settings...).

**Еден сервер, N корпуси (одлука 2026-07-11):** федерацијата е на корпусите, не на серверите — НЕ се прават одвоени MCP сервери по стек (ashlar / laravel / node / wordpress). Еден сервер чита N корени; сепарацијата е преку `domain:`/`context:`. Идна потреба: per-client/per-project serving профили (тим што работи само еден стек) — профилот никогаш не меша два context-а во еден сет.

---

## Прогрес

| Фаза | Вкупно | Готово |
|---|---|---|
| doctrine | 6 | 6 |
| guides | 5 | 5 |
| components — употребливи (3А) | 42 | 41 |
| components — позадински (3Б) | 9 | 4 |
| css | 28 | 0 |
| patterns | 5 | 0 |
| skills | 13 | 4 |
| **Вкупно** | **108** | **60** |
