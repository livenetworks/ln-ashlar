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
