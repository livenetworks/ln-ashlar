# Аудит — ln-slug

2026-09-10 · Опсег: `src/ln-slug.js` (73), `src/slug-model.js` (21), `README.md` (111), schema · Итерација 5/50

## Вердикт

Најдобро документираната мала компонента досега — pristine логиката е дадена како
табела на состојби и echo guard-от е објаснет. Но носи **четири** копии од
crash-от што `ln-autoresize` го има еднаш, а „ASCII-only" ограничувањето значи
дека во проект што испорачува македонски речник во `ln-core`, македонски наслов
дава **празен slug**.

## Што е добро

**`slug-model.js` е жив модел, за разлика од `toggle-model.js`.** `:2` го увезува
`generateSlug`, `:60` го вика. Чист — нула `window`, `document`, `localStorage`.
Тоа е како треба да изгледа двослојната структура.

**Pristine правилата се дадени како табела на шест состојби**, вклучувајќи ги и
двата синтетички случаи (`lnForm.fill`, form reset). Ретко некој ги пишува тие
редови.

**Echo guard-от е сведен на едно правило и објаснет зошто е доволно:**
*„Both trusted and untrusted inputs follow the same rule once the component's own
mirror echo is guarded by the `_mirroring` flag."* Компонентата не се обидува да
разликува `isTrusted` — таа го знае сопственото ехо по знаменце.

**Синтетичкиот `input` буклае намерно**, за да ги разбуди `ln-validate` и
auto-submit-от на `ln-form` — и тоа е запишано, не случајно.

## Наоди

### 🔴 S1 — `destroy()` фрла на секој од четирите bail патишта

**Каде:** `:11-29` наспроти `:65-66`

Конструкторот излегува рано на четири места, сите **пред** `this.dom = dom` (`:31`):

| ред | услов |
|---|---|
| `:11` | `dom.tagName !== 'INPUT'` |
| `:16` | `dom.form` е null |
| `:22` | `form.elements[sourceName]` не постои |
| `:26` | source е `RadioNodeList` |

Сите четири прават `return this` со `this.dom === undefined`. Потоа:

```js
_component.prototype.destroy = function () {
    if (!this.dom[DOM_ATTRIBUTE]) return;   // TypeError
```

Патот до пукање е идентичен со `ln-autoresize` AR1: `findElements` ја запишува
инстанцата и покрај bail-от, а removedNodes гранката на `registerComponent` вика
`destroy()` кога елементот се вади.

**Достижноста тука е повисока од `ln-autoresize`.** Случајот „source полето не
постои" (`:22`) не бара погрешен markup — доволно е slug input во форма чие
изворно поле се вчитува подоцна. README-то тоа го наведува како **очекувано**:

> **Source read at init:** … If the source field is added dynamically after init,
> the component will not find it (warn + bail). Re-initialize the slug input after
> DOM changes.

„Re-initialize" значи вадење и враќање на елементот — што поминува низ `destroy()`.

### 🔴 S2 — Кирилски наслов дава празен slug

**Каде:** `slug-model.js:18` — `.replace(/[^a-z0-9]+/g, sep)`

По NFD и симнување дијакритици, сè што не е `a-z0-9` станува сепаратор. Кирилицата
нема NFD разложување до ASCII, па секој знак паѓа во замената:

```
generateSlug('Насловна страница')
  → NFD/дијакритици: непроменето
  → toLowerCase: непроменето
  → [^a-z0-9]+ → '-'
  → collapse → '-'
  → trim водечки/завршни → ''
```

**Празен стринг.**

**Достижност:** директна и секојдневна во овој проект. `ln-core/helpers.js:1010`
испорачува целосен **македонски** речник за месеци и денови (види `ln-core` R6) —
библиотеката е градена за македонски содржини. Наслов на македонски е основниот
случај, не работ.

**README-то го признава** како „ASCII-only (v1)" ограничување, значи е знајно.
Наодот е дека последицата е тивко празно поле, не warn или fallback — а slug полето
најчесто е задолжително во формата.

### 🟡 S3 — README го потценува сопствениот код за акцентиран латиница

README §Limitations:

> non-ASCII characters (Cyrillic, Macedonian, **accented Latin**, CJK) are stripped
> entirely

Акцентираната латиница **работи**. `slug-model.js:15-16` прави
`.normalize('NFD').replace(/[̀-ͯ]/g, '')`:

```
generateSlug('Café Münchén') → 'cafe-munchen'
```

Кирилица и CJK навистина отпаѓаат; акцентираната латиница не. README-то ја
опишува компонентата послаба отколку што е.

### 🟡 S4 — Временска ознака „v1" во договорот

`README.md` §Limitations: *„ASCII-only (**v1**)"*, и *„No transliteration in v1."*

Доковите се пишуваат во финална состојба — без временско скеле што имплицира
идна верзија. Истата ознака се појавува во `ln-stat` (*„Multi-field filters are out
of scope for v1"*) и `ln-options`, значи е системска.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `generateSlug` прима `separator` параметар со regex-escape (`:12`), но `ln-slug.js:60` секогаш го вика со еден аргумент. Вториот параметар и неговиот escape код немаат жив консумент. | `slug-model.js:8-12` |
| P2 | `_mirror()` не проверува дали `generateSlug` вратил празно — при кирилски влез го брише постоечкото ехо и го држи полето празно. | `:58-63` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-slug-from` | `:5` | ✅ | ✅ |
| `_pristine` / `_mirroring` | `:33-34` | ✅ табела | н/п |
| синтетички `input` | `:61` | ✅ | н/п |
| четирите bail услови | `:11-29` | ✅ сите четири | н/п |
| `destroy()` однесување по bail | фрла | ❌ имплицира дека работи | н/п |
| `generateSlug(value, separator)` | 2 параметри | документирани правила, не потпис | н/п |
| custom `ln-slug:*` настани | нула | ✅ точно кажува нула | н/п |

## Затечена состојба

Нема парсирани атрибути во instance state освен `sourceName` прочитан еднаш (`:20`)
— што е свесно, README-то го именува како „Source read at init".
Конзола: четири `console.warn` со `[ln-` префикс, сите зад ln-core портата.
