# Аудит — ln-progress

2026-09-10 · Опсег: `src/ln-progress.js` (83), `src/progress-model.js` (20), `README.md` (411), schema · Итерација 12/50

## Вердикт

Единствената компонента досега што **си го исклучува сопствениот обсервер** при
`destroy()`. README-то е 5 пати подолго од кодот и на едно место си противречи за
`max="0"` — а доктринарниот исклучок што ја покрива е образложен со причина што по
`3628e7d` веќе не важи.

## Што е добро

**`destroy()` го исклучува обсерверот.** `:20-22` — `this._parentObserver.disconnect()`.
Ниту еден од трите обсервери во `ln-core` нема `.disconnect()` никаде; овде има.

**`resolveProgressMax` е чист и експлицитен** (`progress-model.js:8-19`). Не користи
`||` синџир — проверува `!== null && !== undefined && !== ''`, потоа
`!isNaN(parsed) && parsed > 0`. Тоа е точно спротивното од идиомот во
`ln-core/progress.js`, и е поточно.

**README-то ја документира приоритетната верига со причината.** Родителот победува
над елементот — што е спротивно од интуицијата (поспецифичното обично победува) —
и README §Max priority resolution објаснува зошто: споделен track каде
„4 done + 2 in progress + 1" сегменти делат ист именител. Плус ги наведува **двете**
последици, вклучувајќи ја тивко игнорираната сопствена max декларација.

**Моделот е жив.** `:2` увезува, `:53` вика. Чист — нула `window`/`document`.

## Наоди

### 🟠 PR1 — Inline стил од JS

**Каде:** `:56` — `this.dom.style.width = result.percentage + '%'`

`mindset.md:66`: *„JS only toggles `.ln-*` state classes or semantic attributes.
CSS translates those to visual output. **Zero inline styles.**"*

Ова е втората компонента во слој 1 што пишува inline стил (`ln-autoresize` AR2 е
првата). Разликата: `ln-autoresize` мери и мора да пишува пиксели; тука вредноста е
**процент што компонентата веќе го пресметала** и го има во `aria-valuenow`. Ко-лоциран
SCSS би можел да го чита преку custom property наместо преку `style.width`.

README-то го документира однесувањето (*„writes the new `width` as a…"*, `:5`) и
дури кажува дека `destroy()` го **остава** inline стилот (`:116`) — значи е свесна
одлука. Наодот е дека доктрината и понатаму чита апсолутно, а сега две компоненти
отстапуваат без запишан исклучок.

### 🟡 PR2 — README тврди дека сопствен `max="0"` дава 0%

**Каде:** `README.md:66` наспроти `progress-model.js:14-17`

Табелата на атрибути тврди:

> `data-ln-progress-max="N"` | bar element | … Setting `max="0"` **collapses to 0%**.

`resolveProgressMax` со `elementMax = "0"`:

```
parentMax е null           → прескокни
elementMax "0" !== ''      → parsed = parseFloat("0") = 0
!isNaN(0) && 0 > 0         → false → прескокни
                           → return fallback = 100
```

Значи max = **100**, не 0. Бар со `data-ln-progress="50"` и сопствен `max="0"`
рендерира **50%**, не 0%.

Истиот README подолу (`:137-139`) го објаснува механизмот **точно** — за
родителот: *„A parent declaring `data-ln-progress-max="0"` falls through to the
bar's own max, because `0` is falsy in JS."* Логиката е идентична за сопствениот
max; само табелата на врвот тврди друго.

Ист корен како `ln-circular-progress` CP1 и `ln-core` R10.

### 🟡 PR3 — Доктринарниот исклучок има застарено образложение

**Каде:** `component-guide.md:170-172`

Доктрината го санкционира приватниот обсервер:

> Two narrow, permanent exceptions … a component that must read an attribute on its
> **parent** (`ln-progress`, **outside the host-only boundary the shared observer
> covers**).

**Исклучокот важи; причината повеќе не.** По `3628e7d`, споделениот обсервер
(`ln-core/helpers.js:795-799`) набљудува:

```js
observer.observe(document.body, {
    attributes: true, subtree: true, attributeOldValue: true
});
```

`subtree: true`, **без** `attributeFilter` — значи ги гледа и мутациите на
родителот. Host-only е **испораката**, не набљудувањето: реактивниот и наследниот
пат гејтираат на `el[entry.attribute]`, но `observeAttributes(names, handler)`
сировиот пат (пат Б) нема instance гејт воопшто — `helpers.js` изречно вели
*„no instance gate, no `data-ln-` prefix gate"*.

Значи `ln-progress` **би можел** да користи
`observeAttributes(['data-ln-progress-max'], …)` и да ги добие родителските
мутации. Кодот не е погрешен — образложението во доктрината е застарено.

### 🟡 PR4 — Schema носи туѓ атрибут

`ln-progress.schema.json:25` декларира `data-ln-upload-progress`. Тој атрибут
припаѓа на `ln-upload`. Изворот е `ln-progress-dev.scss:5`:

```scss
[data-ln-progress]:not(.progress [data-ln-progress]):not([data-ln-upload-progress] [data-ln-progress])
```

Скенерот го фаќа литералот и го запишува како атрибут **на ln-progress**. Не е
грешка во скенерот — тоа е неговиот договор (`schema-scanner` е literal-only) — но
резултатот е дека schema-та тврди сопственост врз атрибут на друга компонента.

(Самото SCSS правило е надвор од опсег на овој пас.)

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Двоен guard за max: `resolveProgressMax` веќе го отфрла `0` (`parsed > 0`) и враќа 100; потоа `calculateProgress` пак прави `parseFloat(String(max)) \|\| 100`. Вториот е недостижен, бидејќи првиот никогаш не враќа 0 или NaN. | `:53-54` |
| P2 | `_listenParent` bail-ира ако нема `parentElement` (`:29`) — но тогаш `_parentObserver` останува `null` и `destroy()` тоа го покрива (`:20`). Точно; забелешката е дека бар без родител тивко го губи shared-max однесувањето без сигнал. | `:26-29` |
| P3 | `:change` се испраќа при секој рендер вклучувајќи го конструкторскиот (`:13` → `:63`). Ист однос како `ln-circular-progress` P1 и спротивен од `ln-toggle`. | `:13` |
| P4 | `destroy()` ги остава `role="progressbar"` и трите `aria-value*` на елементот, како `ln-circular-progress` CP3. README-то овде **го кажува** тоа за `style.width` и класата, но не за ARIA. | `:18-24` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-progress` (бар) | `:5,48` | ✅ | ✅ |
| `data-ln-progress-max` (бар) | `:51` | ✅, но `max="0"` погрешно | ✅ |
| `data-ln-progress-max` (track) | `:50` | ✅ со приоритет и причина | ✅ |
| `ln-progress:change` | `:63` | ✅ полн payload + кога се пали | н/п |
| `_parentObserver` | `:12,44` | ✅ во API табела | н/п |
| `destroy()` дисконектира | `:21` | ✅ | н/п |
| ARIA остаток по destroy | `:58-61` | ❌ неспомнат | н/п |
| `data-ln-upload-progress` | само `-dev.scss` | — | ⚠️ туѓ атрибут |

## Затечена состојба

Нула парсирани атрибути во instance state — `_render` чита свежо. Единственото поле
е `_parentObserver`.
Нула конзолен излез.
