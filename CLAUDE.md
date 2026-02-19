# CLAUDE.md — AI Agent Instructions for ln-frontend

## Што е ова репозитори?

`ln-frontend` е унифициран frontend library за LiveNetworks проекти.
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

### 4. Иконки = CSS pseudo-elements

```scss
.ln-icon-home::before {
    background-image: var(--icon-home);
}
```

### 5. Data attributes за JS, класи за CSS

```html
<!-- JS однесување -->
<div data-ln-modal="my-modal">

<!-- CSS стилизирање -->
<div class="card card--flat">
```

---

## JS Components — Конвенции

### IIFE Pattern (задолжителен за сите нови компоненти)

```javascript
(function() {
    const DOM_SELECTOR = 'data-ln-component';
    const DOM_ATTRIBUTE = 'lnComponent';

    // Заштита од двојно вчитување
    if (window[DOM_ATTRIBUTE] != undefined) return;

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
- `dist/ln-frontend.css` — сè вклучено
- `dist/ln-frontend.js` — ES module
- `dist/ln-frontend.iife.js` — за `<script>` tag

---

## Интеграција во проект

### npm
```js
import 'ln-frontend';                           // JS
import 'ln-frontend/dist/ln-frontend.css';       // CSS
```

### Git submodule
```bash
git submodule add .../ln-frontend.git resources/ln-frontend
```

### Plain HTML
```html
<link rel="stylesheet" href="dist/ln-frontend.css">
<script src="dist/ln-frontend.iife.js"></script>
```

---

## Кога додаваш нов SCSS компонент

1. Креирај `scss/components/_new-component.scss`
2. Започни со `@use '../config/mixins' as *;`
3. Користи семантички селектори (`.component element {}`)
4. Користи `@include` mixins за properties
5. Користи `var(--token)` за вредности
6. Додај го `@use 'components/new-component'` во `scss/ln-frontend.scss`

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
