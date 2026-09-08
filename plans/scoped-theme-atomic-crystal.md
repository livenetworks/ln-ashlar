# Scoped theme — поправки по дијагностиката (2026-09-07)

## Context

Корисникот пријави дека `demo/scoped-theme.html` не изгледа како што очекува.
**Визуелните симптоми беа бразурски кеш** — по hard-refresh страницата рендерира
исправно. `dist` е свеж; трите нови правила (`[data-mode]{color:…}`, background
паинтот, проширениот `:where()` селектор) постојат во работното дрво и ги нема
во последниот комит, што и го произведе half-themed изгледот од кешираниот CSS.

Дијагностиката потоа откри **пет вистински структурни проблема** плус еден баг
најден патем. Ниту еден не е причина за оригиналниот screenshot — сите се
латентни. Овој план ги затвора.

Заднина што ги ограничува одлуките (прочитај ги пред извршување):
`.claude/plans/css-theme-scope-refactor.md` (рулинзи R1-R8) и
`.claude/plans/theme-3-axis-decoupling.md` (3-оскен модел).

### Одлуки на корисникот

1. **Темниот речник се врзува за најблискиот чекор од рампата.** Рампата
   останува рамномерна; темната тема смее да се помести 1-3 поени светлина.
   Отфрлени: задржување литерали, преместување на рампата за да се зачуваат
   точните бои.
2. **Трите видливи dark измени — одлуката е префрлена назад на извршителот.**
   Резолуција, со образложение (види §Одлуки-со-коментар).

---

## Одлуки-со-коментар

Корисникот не сакаше да ги адјудицира овие три. Пресудени вака:

| измена | пресуда | зошто |
|---|---|---|
| `--app-scrim-bg` бело во темно | **ВКЛУЧЕНО** | Дефект, не вкус. Мобилниот drawer scrim ја светли страницата наместо да ја затемни. |
| `--input-bg` во темно | **ВКЛУЧЕНО** | Тоа беше првичната забелешка на корисникот. Ремапирањето го шири јазот од 8 на 10 поени — да се затвори во истиот пас, не после. |
| `--btn-shadow` за soft скин | **ОТФРЛЕНО** — само бриши ја мртвата линија | Имплементирањето на намерата додава нова визуелна одлика на скин што не е предмет на разговор, плус една декларација на секое копче во бандлот. Бришењето е загарантиран pixel no-op и ја тргa доктринарната повреда. Ако soft копчињата треба да лебдат — своја задача. |

---

## WP0 — Reformat gate (без измена на извор)

`scripts/build.mjs:72-84` компилира `demo/dist/` со `style: 'expanded'`, а
трекуваните фајлови се компресирани и байт-идентични со gitignore-аниот root
`dist/`. Следниот билд ги раздува во ~10-13k линии и го закопува секој вистински
diff.

1. Реши го валканото дрво прво (моментално 10 изменети фајла, вклучувајќи ги
   `_palette.scss`, `_theme.scss`, `_layout.scss`, `demo/scoped-theme.html`).
   Инаку WP0 ги собира внатре.
2. На чисто дрво, **нула измени на извор**, изврши `npm run build`.
3. Комитирај само `demo/dist/`:
   `chore(build): re-emit demo/dist expanded to match build.mjs style`

`demo/admin/dist/`, `demo/docuflow/dist/`, `demo/spa/dist/` се компилираат со
свои `--style=compressed` скрипти и остануваат минифицирани — не ги пипај.

**Accept:** `git diff --stat demo/dist/` покажува четири `.css` фајла и ништо
друго; `wc -l demo/dist/ln-ashlar.css` > 10000.

---

## WP1 — Skin freeze баг + доктрина

**Наод:** `var()` во вредност на кастом-проперти се супституира на елементот што
го носи селекторот. `data-skin` е на `<html>`. Инвентарот на сите ~20
`var()`-базирани декларации во skin/theme корени најде **точно една скршена**:

`theme/config/_theme.scss:141` — `--btn-border-hover: var(--color-accent-hover)`.
`--color-accent-hover` е декларирана само на `_global.scss:30` (на `a`),
`_btn.scss:73` и `_form.scss:461` (во mixin тела) — сите под `<html>`.
Резултат: IACVT, `border-color` паѓа на `currentcolor`. Погодени се само
неутралните `<button>`; accent копчињата се здрави затоа што `@mixin btn` си го
ре-декларира токенот на самото копче.

**Поправка** — изведи inline наспрема токен што стигнува до `<html>`:

```scss
	--btn-border-hover: hsl(from var(--color-accent) h s calc(l - 8));
```

Ја репродуцира авторската намера точно (`l - 8` е идентично на сите три вистински
декларациски места), седи на иста висина како соседот `:140`
(`--btn-border: var(--color-accent)`), и не воведува нова browser-support
површина — `hsl(from …)` веќе е носечка во три фајла. Ова е поправка на баг,
не промена на боја: авторската вредност никогаш не се рендерирала.

Отфрлени алтернативи: декларирање на `--color-accent-hover` во base-defaults
(контрира на снимената одлука во `_colors.scss:26-30`); fallback на
`--color-accent` (тивко го губи затемнувањето); преместување во вгнезден блок
(на `(0,2,1)` би го прегазило `@mixin btn`-овото `l - 6` на submit копчињата).

**Плус во истиот WP:**

- `_theme.scss:166` и `:194` — коментирај ги двата валидни-но-замрзнати случаи:
  `--nav-list-bleed` се врзува за root `--padding-x`, outline-овиот
  `--border-subtle` за root поларитетот. Документирај, не поправај.
- `docs/architecture/reference.md:302-306` и `:342-351` — **двата го учат
  токму овој баг.** Го прикажуваат како ТОЧЕН пример skin корен што прави
  `--color-accent-bg: hsl(var(--color-primary) / 0.2)`. Пренапиши ги во
  вгнездена `button[type="submit"], .btn { }` форма, како што стварно прави
  `_theme.scss:150-156`.
- Нов инваријант во `docs/architecture/reference.md` §Theme Architecture и
  `docs-mcp/doctrine/scss-architecture.md` §C:

  > **Root-Resolvability Invariant.** `var()` во вредност на кастом-проперти
  > декларирана на `[data-skin]` / `[data-theme]` / `[data-mode]` корен смее да
  > реферира **само** токени декларирани од `_tokens.scss :root`,
  > `ln-values-light` / `ln-values-dark`, `ln-color-chain`, или base-defaults
  > блокот. Никогаш токен што постои само во component mixin или на тесен
  > елемент-селектор. Ако вредноста мора да се изведе од component-локален
  > токен, рибиндот припаѓа во вгнезден блок на консумирачкиот елемент.

**Accept — позитивно:** `grep -n 'btn-border-hover: hsl(from var(--color-accent)' theme/config/_theme.scss` → 1.
`grep -c 'Root-Resolvability' docs-mcp/doctrine/scss-architecture.md docs/architecture/reference.md` → ≥1 секој.
**Accept — негативно:** `grep -n 'var(--color-accent-hover)' theme/config/_theme.scss` → 0.
По билд: `grep -c 'btn-border-hover: var(--color-accent-hover)' demo/dist/ln-ashlar-theme.css` → 0.

---

## WP2 — Симетрија на паинтот

`theme/config/_theme.scss:56-62` — `color` е на `(0,1,0)`, `background-color` во
`:where()` на `(0,0,0)`.

**Потврден прекршок:** `_global.scss:24` бои `a { color: var(--color-accent) }`
на `(0,0,1)`. Легален `<a data-mode="dark">` ја губи акцент бојата на
`[data-mode]`-овото `(0,1,0)` и рендерира како обичен текст. Позадинската
половина од истата намера попушта правилно; текстуалната не.

**Поправка** — спушти го `color` на нула специфичност:

```scss
:where([data-mode]) {
	color: var(--color-fg);
}
```

Паинтот е fallback, не тврдење: единствената му работа е гол
`<section data-mode="dark">` без компонентна класа да си го покаже поларитетот
наместо да го наследи родителскиот. Секоја декларирана вредност — и `(0,0,0)` —
победува наследување, па fallback-от сè уште пали. `_reset.scss` не декларира
`color` воопшто, значи нема `(0,0,0)` трка. Плус усогласено со R3: ashlar-овите
сопствени мислења одат на нула специфичност.

**Не** кревај го background-от на `(0,1,0)` — `button-base` бои
`background: var(--btn-bg)` на `(0,0,1)` и секое `<button data-mode>` би било
прегазено. Guard-от `:not(html):not(body)` е носечки —
`_global.scss:3-14` бои `html, body { background-color: var(--bg-recessed) }`.

Дериватниот селектор на `:50-54` **останува** на нормална специфичност — тоа е
деривација, не паинт (R2/R3).

**Accept — позитивно:** компилирано `grep -c ':where(\[data-mode\]){color:var(--color-fg)}' demo/dist/ln-ashlar-theme.css` → 1.
**Accept — негативно:** `grep -nE '^\[data-mode\] \{' theme/config/_theme.scss` → 0.
`grep -n '\[data-mode\],' theme/config/_theme.scss` → сè уште 1 (линија 52,
дериватниот — **не** смее да се завитка).

---

## WP3 — `code` и `pre` си ја поседуваат бојата

`theme/base/_typography.scss` — `code` (`:80-87`) и `pre` (`:89-104`) двата
рибиндуваат `--color-bg` и бојат `background-color`, а никогаш не бојат `color`.
`small` (`:74-78`), `blockquote` (`:114-124`), `kbd` и `.prose code` сите се
исправни.

Додај по една линија во секој, по `background-color`:

```scss
	color: var(--color-fg);
```

**Строго no-op во нормален контекст** — `--color-fg` се наследува, па
насликаната вредност е онаа што елементот и онака ја наследуваше. Се разидува
само во скршениот случај: предок што бои `color` директно **без** да го рибиндува
`--color-fg` (`button-base`-овото `color: var(--btn-fg)`, nav hover
`_nav.scss:99`). Токму тоа се поправа.

**НЕ** пиши `--color-fg: var(--fg-default); color: var(--color-fg);` — тоа би
променило боја (`code` во `blockquote` би скокнал од muted во default).

Нов инваријант во `docs-mcp/doctrine/scss-architecture.md` §D:

> **Own-the-pair.** Елемент што рибиндува `--color-bg` и бои `background-color`
> мора во истото правило да бои и `color: var(--color-fg)`. Позадина без
> предница ја наследува бојата на текстот од произволен предок и не може да
> гарантира контраст наспрема површина што сама ја избрала.

**Accept — негативно:** `grep -n -- '--color-fg: var(--fg-default)' theme/base/_typography.scss` → 0.

---

## WP4 — Ситни поправки

- **`theme/config/_theme.scss:241`** — избриши ја голата
  `box-shadow: var(--shadow-sm);`. Седи директно во `[data-skin="soft"]`, значи
  бои сенка на `<html>`. Практично инертна (надворешната сенка се црта вон
  екранот), доктринарно повреда: скин бои својство наместо да рибиндува токен.
  **Само бришење** — види §Одлуки-со-коментар.
- **`theme/config/_palette.scss:96` и `:134`** — избриши `--border-strong-hover`.
  Байт-идентичен на `--border-strong` во двата режима, **нула читачи** во целото
  некомпилирано дрво, отсутен од `sync-css-tokens.mjs`.
- **`theme/config/_tokens.scss:187-210`** — додај `--input-bg` во SOFT-slot
  коментар блокот. Читан е точно еднаш како `var(--input-bg, var(--bg-recessed))`
  (`_form.scss:99`) и не е декларирал никаде. Тоа е веќе воспоставената куќна
  шема (`--color-accent-bg`, `--nav-link-border-color-*`, `--border-block-start`)
  — само недокументирана. Задржи ја индирекцијата: WP5 ја користи како лост.
- **`theme/config/_theme.scss:98-101`** — коментирај зошто `[data-theme="glass"]`
  нема `&[data-mode="dark"]` лифт: базата `218 95% 62%` е веќе на или над секоја
  лифтувана вредност кај другите три, бидејќи glass е авторизиран dark-first.
  Додавање лифт би го фрлило над 70% и би пукнало.

**Accept — негативно:** `grep -rn -- '--border-strong-hover' theme/ docs/ docs-mcp/` → 0.
`grep -nE '^\tbox-shadow:' theme/config/_theme.scss` → 0.
`npm run sync:css-tokens:check` поминува.

---

## WP5 — Врзи го темниот речник за рампата

### Проблемот со чекорите

Темни чекори во површинскиот опсег: **8, 12, 18, 24, 36**.
Темни површински литерали: **9, 13, 17, 20, 20, 24**.
Шест токени, четири употребливи чекори. `--bg-elevated` (17), `--bg-sunken` (20),
`--bg-hover` (20) и `--border-subtle` (20) се борат за еден слободен чекор.

Колапс на сите четири на 18 е блокер: `--bg-sunken` е површината **внатре**
`--bg-elevated` картички на 22 места (table headers, card footers, `kbd`,
`.prose code`, blockquote, avatar, upload drop-zone, editor toolbar, accordion) —
би исчезнале. `--bg-hover` е неутралниот hover фидбек — би исчезнал.

### Решение — еден нов чекор, `--color-neutral-175`

Точно каде е притисокот, меѓу 150 и 200. Чинам: две декларации.
**Светло останува pixel-identical** — ништо не чита 175 во светло.

- светло `--color-neutral-175: 220 13% 91%;` — по `_palette.scss:37`
- темно  `--color-neutral-175: 220 13% 21%;` — по `_palette.scss:109`

### Мапата

| токен | сега (темно) | чекор | нова вредност | ΔL | индекс во светло |
|---|---|---|---|---|---|
| `--bg-recessed` | `220 16% 9%` | `neutral-50` | `220 20% 8%` | −1 | `neutral-50` ✓ ист |
| `--bg-base` | `220 16% 13%` | `neutral-100` | `220 16% 12%` | −1 | `--color-white` |
| `--bg-elevated` | `220 16% 17%` | `neutral-150` | `220 14% 18%` | +1 | `= --bg-base` |
| `--bg-sunken` | `220 16% 20%` | `neutral-175` нов | `220 13% 21%` | +1 | `neutral-100` |
| `--bg-hover` | `220 16% 20%` | `neutral-175` нов | `220 13% 21%` | +1 | `neutral-100` ✓ исто како sunken |
| `--bg-active` | `220 16% 24%` | `neutral-200` | `220 13% 24%` | 0 | `neutral-150` |
| `--border-subtle` | `220 14% 20%` | `neutral-175` нов | `220 13% 21%` | +1 | `neutral-200` |
| `--border-strong` | `220 13% 36%` | `neutral-300` | `220 13% 36%` | 0 | `neutral-300` ✓ ист |
| `--fg-subtle` | `218 11% 55%` | `neutral-400` | `218 11% 52%` | −3 | `neutral-400` ✓ ист |
| `--fg-muted` | `220 10% 68%` | `neutral-500` | `220 10% 68%` | 0 | `neutral-500` ✓ ист |
| `--fg-default` | `0 0% 95%` | `neutral-900` | `221 30% 97%` | +2 | `neutral-900` ✓ ист |

**Инверзијата elevated/sunken преживува:** recessed 8 < base 12 < elevated 18 <
sunken/hover 21 < active 24. Документираната темна поларност (elevated **потемен**
од sunken, спротивно од светло) е зачувана.

Сите ΔL се во буџетот 1-3. `--fg-muted` и `--border-strong` се веќе точни чекори
напишани долго — директен доказ дека врзувањето било првичната намера.
`--fg-default` е единствениот ред каде се менува карактерот, не само нивото
(ахроматско → ладно 30% заситено). Светлото `--fg-default` е `222 47% 11%`, веќе
силно ладно — значи тинтот е симетричен, не нов.

### Не се врзуваат — со коментар во кодот

- **`--color-white` останува недекларирана во темно.** `:where(:root)` сепак
  матчира на `<html data-mode="dark">` и дава `0 0% 100%`. Тоа е носечко:
  `_palette.scss:216` го чита за `--color-accent-fg` (бел текст на полн акцент).
  По WP5 темниот mixin нема ниту еден друг bg литерал, па отсуството ќе изгледа
  како превид — коментирај зошто.
- **`--color-scrim` останува литерал.** Scrim е усидрен во „црно", не во
  рампата; врзувањето бара флипување на индекс (темниот `neutral-900` е
  скоро бел).

### Плус — двете вклучени dark измени

**`--app-scrim-bg` (баг).** `_palette.scss:189`, внатре во `ln-color-chain`:
`hsl(var(--color-neutral-900) / 0.4)`. Chain-от се пре-евалуира на `[data-mode]`,
па во темно се резолвира наспрема темниот `neutral-900` = `221 30% 97%` — **скоро
бело 40% перење**. Читан на `_app-shell.scss:282`; мобилниот drawer во темно ја
светли страницата. Тоа е вредност, не деривација — извади го од `ln-color-chain`
во **двата** value mixin-а:

```scss
// ln-values-light — байт-еквивалент на денешното, pixel-identical
--app-scrim-bg: hsl(222 47% 11% / 0.4);
// ln-values-dark
--app-scrim-bg: hsl(0 0% 0% / 0.4);
```

**`--input-bg` во темно.** Ремапирањето го шири јазот: денес recessed 9 /
elevated 17 = 8 поени, потоа 8 / 18 = **10 поени**. Во `ln-values-dark`:

```scss
--input-bg: var(--bg-sunken);   // 21% во 18% картички наместо 8%
```

Светлото не го добива — таму `--bg-recessed` (98% во 100%) е точно намерата.

### Docs што носат стари литерали

Регенерирај со `npm run sync:css-tokens` (**никогаш рачно внатре во fence-овите**),
па рачно надвор од нив:
- `scripts/sync-css-tokens.mjs:248-250` — описите `"flat in light, +4% in dark"`
  и `"darker in light, +7% in dark"` стануваат `+6%` и `+9%`
- `docs-mcp/css/tokens.md:46-49`, `docs-mcp/css/theming.md:20`,
  `docs-mcp/doctrine/scss-architecture.md` §D анти-шема 3 и примерот на `:191-196`

**Accept — позитивно:** `grep -c 'color-neutral-175' theme/config/_palette.scss` → 2.
**Accept — негативно:** `grep -nE '^\s*--(bg|fg|border)-[a-z-]+:\s*hsl\([0-9]' theme/config/_palette.scss` → **0**
(ниту еден суров HSL литерал во речникот на ниту еден mixin).
`git diff theme/config/_palette.scss` не покажува измена во `ln-values-light`
освен вметнатиот `--color-neutral-175`, избришаниот `--border-strong-hover` и
преместениот `--app-scrim-bg` — тоа е доказот дека светлото е pixel-identical.

---

## WP6 — Билд и верификација

`npm run build`, потоа `npm test`. `demo/dist/` диффот треба да е мал — WP0 го
апсорбирал реформатот.

**Мануелен smoke:** отвори `demo/scoped-theme.html` со **исчистен кеш**
(DevTools → Network → Disable cache). Провери: темниот остров, вгнездениот светол
остров, четирите бренд картички, влезните полиња во темно (сега `--bg-sunken`,
не црна дупка), и `<a data-mode="dark">` ако постои во демото.

---

## Тестови

`tests/brand-theme-cascade.test.js` — **ниту еден WP не го крши.** Test 1
регексите сè уште матчираат по WP2; Test 2 чита `theme/brand.css` (недопрен);
Test 4 проверува `--brand-primary` и `--size-md` (недопрени).

Прошири со два regression guard-а, по еден за секој структурен наод:

1. **Root-Resolvability guard.** Извади ги сите `[data-skin=…]` / `[data-theme=…]`
   корен блокови од `_theme.scss`, собери го секој `var(--x)` што се јавува во
   вредност на кастом-проперти, и тврди дека секој `--x` е во унијата
   `tokensVars ∪ lightVars ∪ darkVars ∪ colorChainVars` (сите четири веќе ги
   експортира `parseTokenSources`). Вгнездените блокови (селектор со descendant
   комбинатор) се изземени. Ова е извршната форма на WP1-овиот инваријант и би
   ја фатило линијата 141.
2. **Ramp-binding guard.** Тврди дека `extractMixinBody(paletteRaw, 'ln-values-dark')`
   не содржи декларација што матчира `/--(bg|fg|border)-[a-z-]+:\s*hsl\(\s*\d/`.

---

## Одложено — пријавено, не решено

- **C2 — бренд лифтот пропушта еден случај.** `&[data-mode="dark"]` и
  `:where([data-mode="dark"]) &` не матчираат темен остров **внатре** во темиран
  елемент: `<html data-theme="ocean"><aside data-mode="dark">` го добива
  нелифтуваниот светол ocean бренд. Треба трет селектор,
  `& :where([data-mode="dark"])`.
- **C3 — cross-axis freeze на skin корени.** `_theme.scss:194` и `:230-231` се
  резолвираат еднаш на `<html>`; вгнезден `[data-mode]` остров под скин го добива
  root поларитетот за тие токени. Иста класа како R6-овиот прифатен `--radius-*`
  лимит. WP1 го документира; поправката бара структурна измена.
- **C4 — `_form.scss:676`** бои `hsl(var(--color-white))` на toggle копчето →
  чисто бело на темна патека. Веројатно намерно, можеби прежешко.
- **D8 — glass на светла подлога.** `218 95% 62%` дава ~3:1 наспрема бело.
  Симетричната поправка е спуштање во светло, што е забранета промена на боја во
  овој пас. Документирај го caveat-от во `docs-mcp/css/theming.md`.
- **`--btn-shadow` за soft** — види §Одлуки-со-коментар.

---

## Делегација

Домен: чист SCSS + docs. По одобрување → `scss-architect` за извршен план по WP,
па `review_plan` (`async: true`, `plan_type: implementation`), па `@executor`.
WP5 да оди последен и сам — единствениот што менува бои.
