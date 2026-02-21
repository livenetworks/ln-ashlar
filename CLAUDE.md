# CLAUDE.md — AI Agent Instructions for ln-acme

## Што е ова репозитори?

`ln-acme` е унифициран frontend library за LiveNetworks проекти.
Содржи **SCSS CSS framework** + **vanilla JS компоненти**, без зависности.
Се користи во Laravel проекти и други веб апликации.

---

## Архитектура — 3 слоја

```
scss/config/_tokens.scss    → CSS custom properties (:root)
scss/config/_mixins.scss    → SCSS @include utility mixins
scss/components/*.scss      → Компоненти кои ги користат горните два
js/ln-*/                    → Vanilla JS компоненти (IIFE pattern)
```

---

## CSS Методологија — ЗАДОЛЖИТЕЛНИ правила

### 1. Семантички BEM (НЕ класичен BEM)

Користиме HTML елементи како селектори внатре во block context.

```scss
// ТОЧНО — семантички селектори
.card header { ... }
.card main { ... }
.card footer { ... }
table thead { ... }
table th { ... }
table td { ... }
.form label { ... }
.form input { ... }

// ПОГРЕШНО — класичен BEM
.card__header { ... }
.card__body { ... }
.table__row { ... }
.form__label { ... }
.form__input { ... }
```

**BEM модификатори** се единствениот случај кога користиме double-dash:
```scss
.card--flat { ... }
.card--compact { ... }
```

### 2. Mixins наместо hardcoded вредности

СЕКОГАШ користи `@include` mixins од `_mixins.scss`. НИКОГАШ не hardcode-ирај CSS properties директно.

```scss
// ТОЧНО
.card header {
    @include px(var(--spacing-lg));
    @include py(var(--spacing-md));
    @include font-semibold;
    @include border-b;
}

// ПОГРЕШНО
.card header {
    padding: 0 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
}
```

### 3. CSS Custom Properties за сите дизајн вредности

Сите бои, spacing, радиуси, сенки се дефинирани во `_tokens.scss`.
Никогаш не hardcode-ирај hex бои или px вредности.

```scss
// ТОЧНО
color: var(--color-primary);
background: var(--color-bg-secondary);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-sm);

// ПОГРЕШНО
color: #2737a1;
background: #f9fafb;
border-radius: 0.75rem;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
```

### 4. Иконки = `.ln-icon-*` класи (CSS pseudo-elements)

Сите иконки се дефинирани во `_icons.scss` како CSS custom properties + класи.

**НИКОГАШ** не користи HTML ентитети (`&times;`, `&#9660;`, `&#10005;`) или Unicode карактери за иконки.
**СЕКОГАШ** користи `.ln-icon-*` класа.

```html
<!-- ТОЧНО -->
<button class="ln-icon-close" data-ln-modal-close></button>
<button class="ln-icon-menu" data-ln-toggle-for="sidebar"></button>
<span class="ln-icon-home"></span>

<!-- ПОГРЕШНО -->
<button data-ln-modal-close>&times;</button>
<button>✕</button>
<span>🏠</span>
```

Достапни иконки: `ln-icon-close`, `ln-icon-menu`, `ln-icon-home`, `ln-icon-users`,
`ln-icon-delete`, `ln-icon-view`, `ln-icon-check`, `ln-icon-plus`, `ln-icon-settings`,
`ln-icon-books`, `ln-icon-lodges`, `ln-icon-logout`, `ln-icon-chart`, `ln-icon-clock`,
`ln-icon-envelope`, `ln-icon-arrow-up`, `ln-icon-book`.

Големински варијанти: `.ln-icon--sm` (1rem), `.ln-icon--lg` (1.5rem), `.ln-icon--xl` (4rem).

**`@mixin close-button`** — стандарден стил за close копчиња (sidebar, modal, toast):
```scss
// Дефиниран во _mixins.scss — СЕКОГАШ користи го, не пишувај свој close стил
@mixin close-button {
    background: transparent;
    @include border-none;
    @include size(2rem);
    @include flex-center;
    @include transition-fast;
    &:hover { @include text-error; }
}

// Употреба — комбинирај со ln-icon-close класа на HTML:
.ln-modal header button[data-ln-modal-close] { @include close-button; }
.sidebar-header [data-ln-toggle-action="close"] { @include close-button; }
```

Имплементацијата на иконките:
```scss
// Во _icons.scss — auto-applied на сите ln-icon-* класи
[class*="ln-icon-"]::before {
    content: '';
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    background-size: contain;
    background-repeat: no-repeat;
}

.ln-icon-close::before { background-image: var(--icon-close); }
.ln-icon-home::before  { background-image: var(--icon-home); }
// итн.
```

### 5. Data attributes за JS, класи за CSS

```html
<!-- JS однесување — data attributes -->
<section data-ln-modal="my-modal">
<button data-ln-toggle-for="sidebar">

<!-- CSS стилизирање — компонентна класа (опишува ШТО е) -->
<section class="section-card">
<button class="btn btn--secondary">

<!-- CSS стилизирање — семантички селектор + @include (во проект SCSS) -->
<section id="korisnici">  <!-- #korisnici { @include card; } -->
```

### 6. Забрането користење на `<div>` без причина

`<div>` е последна опција — користи го САМО кога нема семантички подобар елемент (`<section>`, `<article>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<main>`, `<figure>`, `<ul>/<li>` итн.).

Во секој случај, `<div>` МОРА да има барем една класа која го опишува неговото постоење.

```html
<!-- ТОЧНО — семантички елемент -->
<section class="section-card">
<nav class="sidebar-content">
<header>...</header>

<!-- ТОЧНО — div со класа кога нема подобар елемент -->
<div class="collapsible-content">...</div>

<!-- ПОГРЕШНО — гол div без класа и без семантика -->
<div>
    <p>Содржина</p>
</div>
```

### 7. Класификација на CSS класи во HTML

Не сите класи се еднакви. Класите паѓаат во 3 категории:

**Компонентни класи (ОСТАНУВААТ во HTML)** — опишуваат ШТО е елементот:
- `.btn`, `.btn--secondary`, `.btn--danger` — типови на копчиња
- `.section-card` — тип на секција (компонент)
- `.collapsible`, `.collapsible-body` — однесување (collapse/expand)
- `.form-group`, `.form-row`, `.form-actions` — form структура
- `.pass`, `.fail`, `.warn` — статусни индикатори
- `.ln-icon-*` — иконки
- `.ln-modal`, `.ln-upload__*` — JS компонентни класи
- `.nav`, `.nav-section`, `.nav-label`, `.nav-icon` — навигациски компоненти
- `.hidden` — JS state класа

**Презентациски класи (ЗАБРАНЕТИ во HTML)** — опишуваат КАКО изгледа:
- `.grid-2`, `.grid-4`, `.stack`, `.stack-lg` — layout (користи `@include grid-2` во SCSS)
- `.card` на голи `<div>` — визуелен стил (користи `@include card` на `<li>`, `<article>`)
- `.row`, `.row-between`, `.row-center` — flex layout
- `.text-secondary`, `.text-muted`, `.text-sm` — типографија
- `.flex`, `.gap-3`, `.items-center` — utility
- `.bg-secondary`, `.shadow-md`, `.rounded-lg` — визуелни

**Inline styles (`style="..."`) — ЗАБРАНЕТИ** без исклучок. Секогаш во SCSS.

```html
<!-- ПОГРЕШНО — презентациски класи + inline стил -->
<div class="grid-4">
    <div class="card">
        <small class="text-secondary">Вработени</small>
        <h2 style="margin:0;">42</h2>
    </div>
</div>

<!-- ТОЧНО — семантички HTML + стилирање во SCSS -->
<section id="stats">
    <ul>
        <li>
            <h3>Вработени</h3>
            <strong>42</strong>
        </li>
    </ul>
</section>
```

```scss
// Во проект SCSS — @include на семантички селектори
#stats {
    ul { @include grid-4; list-style: none; padding: 0; margin: 0; }
    li { @include card; @include p(1rem); }
    h3 { @include text-sm; @include text-secondary; margin: 0; }
    strong { @include text-2xl; @include font-bold; @include block; }
}
```

### 8. Избор на HTML елемент — водич

| Содржина | Користи | НЕ користи |
|----------|---------|------------|
| Листа на ставки | `<ul>/<li>` или `<ol>/<li>` | `<div>` за секоја ставка |
| Картичка/ставка | `<article>` или `<li>` | `<div class="card">` |
| Група содржина | `<section>` | `<div class="stack">` |
| Навигациски копчиња | `<nav>` | `<div class="row">` |
| Код пример | `<figure><pre><code>` | `<div class="card"><main><pre>` |
| Празно state | `<article class="section-empty">` | `<div class="section-empty">` |
| Наслов/label | `<h1>`-`<h6>`, `<strong>`, `<label>` | `<small class="text-secondary">` |
| Вредност/број | `<strong>`, `<output>`, `<data>` | `<h2>` (бројот НЕ е наслов) |
| Затвори/dismiss | `<button class="ln-icon-close">` | `<button>&times;</button>` |
| Nav section header | `<h6 class="nav-section">` | `<div class="nav-section">` |
| Разделувач | `<hr>` | `<div class="nav-divider">` |
| Breadcrumbs | `<nav><ol class="breadcrumbs">` | `<nav class="breadcrumbs"><li>` (без `<ol>`) |

**Правило за наслови (h1-h6):**
Насловот е она што **ИМЕНУВА** содржината, не она што е визуелно најголемо.

```html
<!-- ПОГРЕШНО — бројката е h2 затоа што е голема визуелно -->
<small class="text-secondary">Вработени</small>
<h2>42</h2>

<!-- ТОЧНО — „Вработени" е насловот, 42 е вредноста -->
<h3>Вработени</h3>
<strong>42</strong>
```

---

## JS Components — Конвенции

### IIFE Pattern (задолжителен за сите нови компоненти)

```javascript
(function() {
    const DOM_SELECTOR = 'data-ln-component';
    const DOM_ATTRIBUTE = 'lnComponent';

    // Заштита од двојно вчитување
    if (window[DOM_ATTRIBUTE] !== undefined) return;

    function _helperFunction() { /* ... */ }
    function _initComponent(container) { /* ... */ }
    function _initializeAll() { /* ... */ }
    function _domObserver() { /* ... */ }

    // Global API
    window[DOM_ATTRIBUTE] = { init: _initComponent };

    // Auto-init
    _domObserver();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initializeAll);
    } else {
        _initializeAll();
    }
})();
```

### Именување

| Елемент | Конвенција | Пример |
|---------|-----------|--------|
| Data attribute | `data-ln-{component}` | `data-ln-modal` |
| Window API | `window.ln{Component}` | `window.lnModal` |
| CSS клас | `.ln-{component}__{element}` | `.ln-modal__content` |
| Custom event | `ln-{component}:{action}` | `ln-modal:open` |
| Приватна функција | `_functionName` | `_initComponent` |
| Dictionary | `data-ln-{component}-dict` | `data-ln-toast-dict` |
| Initialized flag | `data-ln-{component}-initialized` | `data-ln-modal-initialized` |

### Комуникација меѓу компоненти

- Компонентите НЕ знаат едни за други
- Комуникација САМО преку `CustomEvent` на DOM
- Никогаш не import-ирај друга компонента

```javascript
// Испрати
_dispatch(container, 'ln-upload:uploaded', { id: 123 });

// Слушај (во интеграцискиот код на проектот)
document.addEventListener('ln-upload:uploaded', function(e) {
    lnToast.enqueue({ type: 'success', message: 'Uploaded!' });
});
```

---

## Структура на фајлови

```
scss/
├── config/
│   ├── _tokens.scss     ← :root CSS variables (НЕ МЕНУВАЈ без причина)
│   ├── _mixins.scss     ← @include helpers (додавај нови по потреба)
│   ├── _theme.scss      ← Color palette extensions
│   └── _icons.scss      ← SVG data-URI icon variables
├── base/                ← Reset, global defaults, typography
├── layout/              ← App layout, grid, header
├── components/          ← Card, forms, tables, navigation, etc.
└── utilities/           ← Helper classes (.hidden, etc.)

js/
├── index.js             ← Barrel import (сите компоненти)
└── ln-{name}/
    ├── ln-{name}.js     ← IIFE component
    └── ln-{name}.scss   ← Co-located CSS (ако треба)
```

---

## Build

```bash
npm run build        # Produce dist/
npm run dev          # Watch mode
```

Output:
- `dist/ln-acme.css` — сè вклучено
- `dist/ln-acme.js` — ES module
- `dist/ln-acme.iife.js` — за `<script>` tag

---

## Интеграција во проект

### npm
```js
import 'ln-acme';                           // JS
import 'ln-acme/dist/ln-acme.css';       // CSS
```

### Git submodule
```bash
git submodule add .../ln-acme.git resources/ln-acme
```

### Plain HTML
```html
<link rel="stylesheet" href="dist/ln-acme.css">
<script src="dist/ln-acme.iife.js"></script>
```

---

## Кога додаваш нов SCSS компонент

1. Креирај `scss/components/_new-component.scss`
2. Започни со `@use '../config/mixins' as *;`
3. Користи семантички селектори (`.component element {}`)
4. Користи `@include` mixins за properties
5. Користи `var(--token)` за вредности
6. Додај го `@use 'components/new-component'` во `scss/ln-acme.scss`

## Кога додаваш нов JS компонент

1. Креирај `js/ln-{name}/ln-{name}.js`
2. Следи го IIFE pattern-от одозгора
3. Додај `data-ln-{name}` data attribute
4. Ако треба CSS, креирај `js/ln-{name}/ln-{name}.scss`
5. Додај `import './ln-{name}/ln-{name}.js'` во `js/index.js`

## Кога менуваш дизајн токени

1. Промени ги во `scss/config/_tokens.scss`
2. Провери дали mixins кои ги референцираат се ажурирани
3. Провери дека build-от поминува: `npm run build`

---

## Дизајн принципи — ЗАПАМТИ

### Токени = логички/семантички имиња

Имињата на CSS custom properties СЕКОГАШ се семантички (по функција), НИКОГАШ по боја.

```scss
// ТОЧНО — семантички
--color-primary: #2737a1;
--color-error-hover: #b91c1c;
--color-bg-error: #fef2f2;
--color-text-muted: #9ca3af;

// ПОГРЕШНО — именувано по боја
--color-white: #ffffff;
--color-red: #dc2626;
--color-blue: #2737a1;
```

Вредностите може да бидат RGB/HSL за composability:
```scss
--color-primary: 39 55 161;  // потоа: hsl(var(--color-primary) / .5)
```

Utility mixins (како `text-white`) може да користат директни вредности — тие се utility, не токени.

### Двоен пристап: класи + mixins

Framework-от нуди **и класи и mixins** за истите компоненти:
- **Класи** (`.card`, `.grid-2`) → за брзо прототипирање директно во HTML
- **Mixins** (`@include card`, `@include grid-2`) → за семантичка употреба во проект SCSS

```scss
// Во _mixins.scss — component mixins
@mixin card { ... }
@mixin grid-2 { ... }

// Во _card.scss — класата го користи миксинот
.card { @include card; }

// Во проект-специфичен SCSS — семантичка употреба
#korisnik { @include card; }
.demo-links { @include grid-2; }
```

`@extend .card` исто работи (ако е во иста compilation unit).

### Table hover = минимален

Само суптилна промена на позадина. Без outline, без ::before ленти.
```scss
table tbody tr {
    @include transition;
    &:hover { @include bg-secondary; }
}
```

### Картички и секции = компактни data containers

Картичките се **податочни контејнери**, не флеши UI елементи. Стилот е инспириран од табелите.

**`@mixin panel-header`** — унифициран header за сите панели (card, section-card, modal):
```scss
// Дефиниран во _mixins.scss
@mixin panel-header {
    @include flex;
    @include items-center;
    @include justify-between;
    @include px(1rem);
    @include py(0.625rem);
    @include bg-secondary;
    @include border-b;

    h3 {
        @include text-base;
        @include font-semibold;
        @include text-primary;
        margin: 0;
    }
}

// Употреба — сите компоненти го користат истиот mixin:
.card header          { @include panel-header; }
.section-card header  { @include panel-header; }
.ln-modal header      { @include panel-header; }
```

**Hover** — суптилен, без анимации/translateY/::before ленти:
```scss
.card:hover {
    border-color: var(--color-primary);
    @include shadow-md;
}
```

### Collapsible = grid-template-rows (НЕ max-height)

За expand/collapse анимации, СЕКОГАШ користи го `collapsible` pattern-от. НИКОГАШ `max-height` hack.

**Single point of truth:** `@mixin collapsible` + `@mixin collapsible-content` во `_mixins.scss`.

```html
<!-- HTML pattern — accordion = ul/li, header = trigger -->
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Наслов</header>
        <main id="panel1" data-ln-toggle class="collapsible">
            <section class="collapsible-body">
                <p>Содржина со padding, margins итн.</p>
            </section>
        </main>
    </li>
</ul>
```

```scss
// Класа (за HTML) — веќе дефинирана во _toggle.scss
.collapsible { @include collapsible; }
.collapsible > * { @include collapsible-content; }

// Mixin (за проект SCSS) — семантичка употреба
.my-panel          { @include collapsible; }
.my-panel > .inner { @include collapsible-content; }
```

**Правила:**
- `.collapsible` (парент) = padding:0, се затвора до 0
- `.collapsible-body` (child) = padding/margins одат тука
- Child елементот е семантички (`<section>`, `<article>`) со класа, НЕ гол `<div>`
- Accordion = `<ul>/<li>`, header = целосен trigger (`data-ln-toggle-for` на `<header>`)
- `data-ln-toggle` = JS (додава `.open`), `class="collapsible"` = CSS (grid анимација)

### HTML = семантички, CSS = одвоен

Никогаш не користи CSS компоненти (`.card`, `.grid-2`) како замена за семантички HTML.

```html
<!-- ПОГРЕШНО — презентациски HTML -->
<div class="grid-2">
    <a href="page.html" class="card">
        <main><h3>Наслов</h3></main>
    </a>
</div>

<!-- ТОЧНО — семантички HTML -->
<ul class="demo-links">
    <li><a href="page.html"><h3>Наслов</h3><p>Опис</p></a></li>
</ul>
```

Стилот се дефинира на семантичкиот селектор користејќи framework mixins:
```scss
// Во проект SCSS — НЕ хардкодирај, користи @include
.demo-links {
    @include grid-2;
    list-style: none;

    a {
        @include block;
        @include px(1.5rem);
        @include py(1.25rem);
        @include bg-primary;
        @include border;
        @include rounded-md;
        @include transition;
    }
}
```

---

## Познати заостанати работи

- **ln-modal** — нема CustomEvent dispatching (ln-modal:open/close), event listeners не се отстрануваат
- **ln-ajax** — нема CustomEvent dispatching за AJAX lifecycle
- **ln-select** — зависи од TomSelect (peer dependency)
- **Form атрибути** — ренамирани во `data-ln-*` конвенција, Laravel проекти треба да ги ажурираат HTML templates
