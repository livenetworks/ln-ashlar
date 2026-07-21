# Handoff — docs-mcp Contract-Compliance Pass (2026-07-21)

> За колега што продолжува во нова сесија. Овој фајл е самодоволен — не ти
> треба претходната разговорна историја. Underscore-префиксот значи дека
> MCP индексерот НЕ го чита овој фајл (не е дел од корпусот), но git го следи.

---

## 1. Цел на задачата

`validate_docs` (ln-ashlar MCP, конектор „Live Networks") пријавуваше **14
component докови** што паѓаа на parser-контрактот. Задачата: да се поправат
контракт-прекршувањата, БЕЗ да се пипаат изворните `js/` и `demo/` фајлови —
само `docs-mcp/`.

Контрактот е дефиниран во `docs-mcp/README.md` + `docs-mcp/_templates/*.md`.

---

## 2. КЛУЧНО: каде живее валидаторот

Parser-от/валидаторот (логиката на `validate_docs`) **НЕ е во ова репо** — тој
е во **MCP серверскиот пакет** (`/home/mcp/server`). Во работното дрво НЕМА
`tools/ashlar/lint-cli.js` ниту `npm run lint:docs` (потврдено со grep; постојат
само `scripts/build.mjs` и `scripts/consolidate-admin-demos.mjs`).

Последици:
- **Локална реверификација = само grep.** Нема runnable linter локално.
- **Целосна реверификација = `validate_docs`**, кој чита од серверската копија
  `/home/mcp/server/resources/ln-ashlar` — ја одразува измената дури откако
  серверот **re-pull-ира** (по push), не од работното дрво.
- Секоја промена на parser **ПОНАШАЊЕ** мора да ја примени корисникот на
  серверот; репото менува само докови, `_templates/` и `README.md`.

---

## 3. Што е СРЕДЕНО и НА GIT

Двата commit-а се веќе на `origin/main`:

### `c57f685` — contract-compliance pass + none-declaration convention (12 фајлови)
- `docs-mcp/README.md` — ново правило „none-declaration" во §Normative Tables
- `docs-mcp/_templates/component.md` — none-sentence fallback коментари под §3
- `docs-mcp/_parser-none-declaration-spec.md` — **спец за серверски parser change** (види §5)
- `docs-mcp/components/ln-ajax.md` — додадена `Default` колона
- `docs-mcp/components/ln-link.md` — додадена `Default` колона
- `docs-mcp/components/ln-validate.md` — split на комбиниран Direction ред (Emits + Listens)
- `docs-mcp/components/ln-table.md` — §2 Variant heading + нормативна Events табела (18 реда) + `### Configuration Attributes` → `### Attributes Table` (+ `Type` → `Type / Values`)
- `docs-mcp/components/ln-modal-fill.md` — none-sentence за атрибути
- `docs-mcp/components/ln-autoresize.md` — none-sentence за евенти
- `docs-mcp/components/ln-time.md` — none-sentence за евенти
- `docs-mcp/components/ln-slug.md` — none-sentence за евенти
- `docs-mcp/components/ln-filter.md` — вистински Attributes + Events табели (од изворот) + `[!NOTE]` за `data-ln-filter-hide` (state marker, не config)

### `cf01dcd` — service-docs fold (2 фајлови)
- `docs-mcp/components/ln-http.md` — §3 Events API преструктуиран во нормативна табела (`ln-http:request`=Listens, `response`/`error`=Emits); `detail` полиња како bullet-листа (намерно НЕ втора табела)
- `docs-mcp/components/positioning.md` — §2/§3 преименувани во пропишаните наслови (service го задржува JS-usage блокот + functions табелата; exempt од html-block правилото)

---

## 4. Статус по оригиналните 14 (10 средени, 4 остануваат)

| Фајл | Статус по push |
|---|---|
| ln-ajax, ln-link, ln-validate, ln-table, ln-http, positioning | ✅ ЗЕЛЕНО веднаш штом серверот re-pull-ира (табеларни, конформни) |
| ln-modal-fill, ln-autoresize, ln-time, ln-slug | 🟡 ЦРВЕНО додека серверот не добие **Rule 1** (држат реченица, не табела) — ОЧЕКУВАНО, не регресија |
| **ln-api-queue, ln-autosave, ln-data-store, ln-toggle** | ⛔ НЕ Е ПИПНАТО — **§4 група, одлуката ЈА НОСИ КОРИСНИКОТ** (види §6) |

(`ln-filter` не беше во 14-те, но доби вистински табели како дел од конвенцијата.)

---

## 5. none-declaration конвенција + PENDING серверски parser change

**Конвенција (веќе применета во докови):** во `simple`/`coordinator` докови §3
СЕКОГАШ има и `### Attributes Table` и `### Events API`; празна секција држи
експлицитна реченица наместо да се изостави:
- Атрибути: `This component reads no data-ln-* configuration attributes.`
- Евенти: `This component emits and listens to no custom ln-* events.`
  (Комбинираната AND реченица е исцрпна — секој евент во било кој правец дава
  ред во табелата преку `Direction` колоната, па none-реченица значи само
  нула-евенти. Нема асиметричен случај.)

**Спец за серверот:** `docs-mcp/_parser-none-declaration-spec.md` (на git):
- **Rule 1 (relaxation):** под `### Attributes Table`/`### Events API`, ако нема
  pipe-табела → прифати непразна проза (none-declaration); празно тело → грешка.
- **Rule 2 (enforcement):** за simple/coordinator, §3 мора да има ОБА
  под-наслова; `service` е exempt.
- **Redослед:** примени го sweep-от (веќе на git) ПРЕД да го вклучиш Rule 2,
  инаку тие докови паѓаат.

⚠️ **Додека корисникот не ги примени Rule 1+2 на серверот и не re-pull-ира,
4-те none-sentence докови ОСТАНУВААТ ЦРВЕНИ. Тоа е очекувано.**

---

## 6. ШТО ОСТАНУВА (следни чекори)

### (A) §4 група — единствената преостаната репо-работа, ОДЛУКА НА КОРИСНИКОТ
`ln-toggle`, `ln-autosave`, `ln-data-store`, `ln-api-queue` имаат легитимна
`## 4. State & Persistence` → 8 нумерирани секции. Шаблонот дозволува
опционален §4, но валидаторот бара ТОЧНО 7. Вистинска template↔validator
контрадикција. Две опции:
- **(a) Конформирај докови** — спушти §4 во `###` под-секција, ренумерирај 5-8→4-7 (само репо, може веднаш).
- **(b) Олабави го валидаторот** — дозволи опционален §4 (7-или-8) + синхронизирај шаблон (допира серверски parser).

💡 **Синергија:** ако корисникот и онака го менува parser-от за Rule 1+2,
опција (b) е речиси бесплатна во ИСТАТА серверска сесија. НЕ РЕШАВАЈ САМ — тоа е
архитектонска одлука на корисникот.

### (B) Серверски parser change (на корисникот)
Примени Rule 1 + Rule 2 (+ можеби §4 опција b) на MCP серверот, redeploy/re-pull.

### (C) Реверификација
По re-pull, пушти `validate_docs` пак → потврди дека 10-те средени станале
зелени и види ги вистинските преостанати падови. (Забелешка: конекторот „Live
Networks" беше повремено disconnected — треба да е активен за да работи.)

---

## 7. Дисциплина за следната сесија (задолжително)

- **git-push scope:** „пушти на гит" = експлицитна листа фајлови ОД СЕСИЈАТА.
  Работното дрво има многу претходно-валкани фајлови што НЕ се наши
  (`_temp/**`, `docs/**`, `plans/**`, root `README.md`, `ln-fill.md`) — НЕ ги
  собирај. Секогаш `git add <path>` експлицитно, никогаш `git add -A`.
  Верификувај со `git show --name-only`.
- **Изворот е вистина:** defaults/events/attributes се читаат од `js/ln-*/src`,
  не се погодуваат. Не пипај `js/` и `demo/`.
- **Timeless docs:** без „иден/planned/previously" фрази.
- **plan-фајлови** (`.claude/plans/*.md`) се **gitignored** (submodule) → НЕ се
  споделуваат преку git. Целата потребна спецификација е во овој handoff +
  `_parser-none-declaration-spec.md` (двата се на репо-git патека, но handoff-от
  сè уште не е commit-нат — види долу).

---

## 8. Git состојба на овој handoff

Овој фајл (`docs-mcp/_handoff-contract-pass.md`) е **сè уште НЕ commit-нат** во
моментот на пишување. Ако сакаш колегата да го добие преку `git pull`, треба да
се commit-не/push-не (само тој фајл, по scope-дисциплината од §7).
