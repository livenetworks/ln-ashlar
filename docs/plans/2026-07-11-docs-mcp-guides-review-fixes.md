# Plan: guides ревју — средни/ситни поправки + критични во refactor-todo

**Датум:** 2026-07-11
**Контекст:** Ревјуто на Фаза 2 (5 guides во `docs-mcp/guides/`) најде 5 критични, 4 средни и 3 ситни наоди. Одлука на корисникот: средните и ситните се поправаат ВЕДНАШ; критичните САМО се документираат во `docs-mcp/refactor-todo.md` (за посебна сесија) — содржината на критичните места во guides НЕ СЕ ДОПИРА.

## Ограничувања (ЗАДОЛЖИТЕЛНО)

- Смееш да менуваш САМО: `docs-mcp/guides/*.md` (5 фајла), `docs-mcp/refactor-todo.md`, `docs-mcp/mcp-todo.md`.
- Содржината на петте guides е на АНГЛИСКИ — не внесувај македонски текст во нив. Meta-фајловите (refactor-todo, mcp-todo) се македонски.
- КРИТИЧНИТЕ места НЕ се поправаат: `_pending` (4 места + mermaid во write-workflow.md), „reverts" (write-workflow ~43), `field_diffs` (write-workflow ~83), Option B/dist (getting-started ~28-31), `ln-toggle:request-open` (coordinator-authoring ~41) — остануваат КАКО ШТО СЕ.
- Нема build, нема тестови — чист markdown.
- Линиските броеви подолу се ориентациски (од ревјуто) — најди го точниот текст, не сметај слепо на бројот.

## А. `docs-mcp/guides/write-workflow.md`

**А1 (средно, ~линија 78):** Реченицата тврди „the coordinator stitches the URL with the record's ID". Погрешна атрибуција — URL-от го гради конекторот, не координаторот. Вистина: `js/ln-api-connector/src/ln-api-connector.js` → `update(id, payload, expectedVersion, url)` повикува `buildUrl(self.baseUrl, url || self.path, id)`; координаторот само го проследува `resourceUrl` (form action) непроменет. Преформулирај ја реченицата така да каже дека **the connector** builds the final URL via its `buildUrl()` helper (`baseUrl` + form `action` path + record `id`), while the coordinator passes the form's `action` URL through unmodified. Прилагоди ја граматички на околниот контекст.

**А2 (ситно, ~линија 157):** „console warning warning" → „console warning" (дупликат збор).

## Б. `docs-mcp/guides/spa-routing.md`

**Б1 (ситно, ~линија 96):** „scans `<body>` for open popovers" — непрецизно. Реалноста: `_teardownOutlet` прави `document.querySelectorAll('[data-ln-popover="open"]')` — цел документ, не `<body>` scope. Преформулирај: queries the document for `[data-ln-popover="open"]` elements (или еквивалентна прецизна формулација).

## В. `docs-mcp/guides/coordinator-authoring.md`

**В1 (средно, ~линија 95):** `this.steps = Array.from(dom.querySelectorAll('.wizard-step'));` — JS binding на CSS класа е забранет анти-патерн (правилото: JS се врзува САМО за `data-*` атрибути). Замени `.wizard-step` со `[data-acme-wizard-step]` (конзистентно со `data-acme-wizard-action` што веќе се користи во истиот пример). ЗАДОЛЖИТЕЛНО: grep-ни го целиот фајл за `wizard-step` и усогласи ги СИТЕ појави во примерот (markup ако има, коментари, проза) — примерот мора да остане внатрешно конзистентен.

## Г. `docs-mcp/guides/getting-started.md`

**Г1 (ситно):** `npm install --save-dev @livenetworks/ashlar` → `npm install @livenetworks/ashlar` (runtime библиотека, не dev dependency). Ако околната проза каже „as a dev dependency" или слично — усогласи ја.

## Д. Крос-линкови во сите 5 guides (средно, batch)

Ниту еден guide нема релативни markdown линкови — а темплејтот ги пропишува како задолжителни (MCP го гради крос-референтниот граф од нив). Додај ги следните МИНИМАЛНИ сетови. Правила:

- Формат: `[text](../doctrine/name.md)`, `[text](../components/ln-name.md)`, `[text](./guide-name.md)` — релативно од `guides/`.
- Пласман: вткај го линкот на ПРВОТО природно спомнување во прозата (пр. кога текстот кажува "ln-form" или "the data layer doctrine"). Ако за некој мандатен таргет нема природно место, додај кратка `## Related Documents` секција на крајот од фајлот со bullet листа.
- Линкови кон сè уште ненапишани компоненти (`../components/ln-*.md`) се ДОЗВОЛЕНИ (dangling кон планирани документи е ОК по контрактот).
- Не менувај друга содржина при вткајувањето — само обвиткај постоечки текст во линк или додај Related Documents секција.

| Фајл | Задолжителни линк-таргети (минимум) |
|---|---|
| getting-started.md | `../doctrine/mindset.md`, `../doctrine/html-markup-rules.md`, `./component-authoring.md` |
| write-workflow.md | `../doctrine/data-layer.md`, `../doctrine/data-flow.md`, `../components/ln-form.md`, `../components/ln-data-coordinator.md`, `./coordinator-authoring.md` |
| spa-routing.md | `../components/ln-router.md`, `../doctrine/js-component-model.md`, `./getting-started.md` |
| component-authoring.md | `../doctrine/js-component-model.md`, `../doctrine/html-markup-rules.md`, `../doctrine/scss-architecture.md`, `./coordinator-authoring.md`, `../components/ln-core.md` |
| coordinator-authoring.md | `../doctrine/js-component-model.md`, `../doctrine/data-layer.md`, `./component-authoring.md`, `../components/ln-data-coordinator.md` |

## Е. `docs-mcp/refactor-todo.md` — додади §4 (verbatim)

На крајот од фајлот (по §3) додади ТОЧНО:

```markdown

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
```

## Ж. `docs-mcp/mcp-todo.md` — анотирај 3 ставки во Фаза 2

На постоечките линии за трите документи ДОДАДИ на крајот од линијата (не менувај го остатокот):

- `getting-started` ставката: ` — ⚠ критичен наод (dist/ не се шипува преку npm) → \`refactor-todo.md\` §4.2`
- `write-workflow` ставката: ` — ⚠ критични наоди (pre-v2 \`_pending\`/reverts/\`field_diffs\`) → \`refactor-todo.md\` §4.1`
- `coordinator-authoring` ставката: ` — ⚠ критичен наод (\`ln-toggle:request-open\` не постои) → \`refactor-todo.md\` §4.3`

## Критериуми за прифаќање (пушти ги grep-овите и пријави ги)

1. `_pending` во `docs-mcp/guides/write-workflow.md` — сè уште ТОЧНО 4 појави (критичното недопрено).
2. `field_diffs` сè уште присутно во write-workflow.md; `request-open` сè уште присутно во coordinator-authoring.md (недопрени).
3. `warning warning` — 0 појави во `docs-mcp/guides/`.
4. „scans `<body>`" — 0 појави во spa-routing.md; `data-ln-popover` се споменува во преформулираната реченица.
5. `wizard-step` во coordinator-authoring.md — сите појави се `data-acme-wizard-step` (атрибут), НУЛА `.wizard-step` класни селектори.
6. `--save-dev` — 0 појави во getting-started.md.
7. „coordinator stitches" — 0 појави; новата формулација содржи `buildUrl`.
8. Секој мандатен линк-таргет од табелата во Д постои во соодветниот фајл (grep по патеката).
9. `refactor-todo.md` завршува со §4 (4 подсекции: 4.1-4.4).
10. `mcp-todo.md` — трите ставки анотирани со упатување кон §4.x.
11. Ниту еден фајл надвор од наведените 7 не е менуван.
12. Во петте guides нема воведено кирилица (провери со grep за кирилични карактери).
