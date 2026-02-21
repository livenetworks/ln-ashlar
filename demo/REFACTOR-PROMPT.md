# Prompt: Рефактор на demo страниците — Семантички HTML

Прочитај го CLAUDE.md (целиот). Тоа е твојот главен извор на правила.

## Задача

Рефакторирај ги сите HTML фајлови во `demo/` директоријата за да следат семантички HTML принципи. Стилизирањето се преместува во `demo/demo.scss` преку `@include` mixins на семантички селектори.

**Правило:** HTML опишува ШТО е содржината. CSS (во SCSS) опишува КАКО изгледа.

## Фаза 1: Споделен Shell (сите ~20 фајлови)

Овие промени се идентични на секоја demo страница.

### 1.1 Sidebar close button

Во секој фајл, најди:
```html
<button data-ln-toggle-for="demo-sidebar" data-ln-toggle-action="close" style="position: absolute; top: 0.5rem; right: 0.5rem; width: 2rem; height: 2rem; padding: 0; border: none; background: transparent; cursor: pointer; font-size: 1.5rem; color: var(--color-text);">&times;</button>
```

Замени со:
```html
<button class="ln-icon-close" data-ln-toggle-for="demo-sidebar" data-ln-toggle-action="close"></button>
```

### 1.2 Logo inline style

Во секој фајл, најди `<img class="logo" ... style="width: 2rem; height: 2rem; border-radius: var(--radius-sm);">` и отстрани го `style` атрибутот.

### 1.3 `<div class="stack-lg">` wrapper

Во секој фајл, отстрани го `<div class="stack-lg">` wrapper и неговиот closing `</div>`. Содржината останува директно во `<div class="content">`.

### 1.4 Footer `text-muted`

```html
<!-- ПРЕД -->
<span class="text-muted">ln-acme v1.0.0</span>
<!-- ПОСЛЕ -->
<span>ln-acme v1.0.0</span>
```

### 1.5 Sidebar footer `text-muted`

```html
<!-- ПРЕД -->
<small class="text-muted">acme-gui v1.0.0</small>
<!-- ПОСЛЕ -->
<small>acme-gui v1.0.0</small>
```

### 1.6 Nav section divs → h6

```html
<!-- ПРЕД -->
<div class="nav-section">CSS компоненти</div>
<!-- ПОСЛЕ -->
<h6 class="nav-section">CSS компоненти</h6>
```

### 1.7 demo/demo.scss — додај нови правила

На почетокот на фајлот (после `@use`), додај:

```scss
// ==========================================================================
// Demo Shell — shared across all pages
// ==========================================================================

.sidebar-header [data-ln-toggle-action="close"] {
	@include close-button;
	@include absolute;
	top: 0.5rem;
	right: 0.5rem;
}

.sidebar-header .logo {
	@include size(2rem);
	@include rounded-sm;
}

.sidebar-footer small {
	@include text-muted;
}

.content {
	@include stack(1.5rem);
}

.footer span:last-child {
	@include text-muted;
}

// Button groups (replaces <div class="row" style="flex-wrap:wrap">)
.demo-actions {
	@include flex;
	@include items-center;
	@include gap(1rem);
	@include flex-wrap;
}
```

---

## Фаза 2: demo/index.html — Целосен рефактор

### 2.1 Stats секција (линии ~89-127)

ПРЕД:
```html
<div class="grid-4">
    <div class="card">
        <main>
            <small class="text-secondary">Компоненти</small>
            <h2 style="margin:0;">18</h2>
            <div data-ln-progress style="margin-top: 0.5rem;">
                <div data-ln-progress="18" data-ln-progress-max="20" class="green"></div>
            </div>
        </main>
    </div>
    <!-- уште 3 карти -->
</div>
```

ПОСЛЕ:
```html
<section id="stats">
    <ul>
        <li>
            <h3>Компоненти</h3>
            <strong>18</strong>
            <div data-ln-progress>
                <div data-ln-progress="18" data-ln-progress-max="20" class="green"></div>
            </div>
        </li>
        <li>
            <h3>JS модули</h3>
            <strong>10</strong>
            <div data-ln-progress>
                <div data-ln-progress="10" data-ln-progress-max="12" class="green"></div>
            </div>
        </li>
        <li>
            <h3>SCSS фајлови</h3>
            <strong>22</strong>
            <div data-ln-progress>
                <div data-ln-progress="22" data-ln-progress-max="25" class="yellow"></div>
            </div>
        </li>
        <li>
            <h3>Демо страници</h3>
            <strong>14</strong>
            <div data-ln-progress>
                <div data-ln-progress="14" data-ln-progress-max="14" class="green"></div>
            </div>
        </li>
    </ul>
</section>
```

SCSS (додај во demo.scss):
```scss
// ==========================================================================
// Page: Dashboard (index.html)
// ==========================================================================

#stats {
	ul {
		@include grid-4;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		@include card;
		@include p(1rem);
	}

	h3 {
		@include text-sm;
		@include text-secondary;
		@include font-normal;
		margin: 0;
	}

	strong {
		@include text-2xl;
		@include font-bold;
		@include block;
	}

	[data-ln-progress] {
		@include mt(0.5rem);
	}
}
```

### 2.2 Modal demo секција

```html
<!-- ПРЕД -->
<div class="row" style="flex-wrap:wrap;">
    <button data-ln-modal="demo-basic" class="btn">Basic Modal</button>
    <button data-ln-modal="demo-form" class="btn btn--secondary">Form Modal</button>
</div>

<!-- ПОСЛЕ -->
<nav class="demo-actions">
    <button data-ln-modal="demo-basic" class="btn">Basic Modal</button>
    <button data-ln-modal="demo-form" class="btn btn--secondary">Form Modal</button>
</nav>
```

### 2.3 Tabs секција

```html
<!-- ПРЕД -->
<p class="text-sm text-secondary">Промени го URL hash на...</p>
<!-- ПОСЛЕ -->
<p>Промени го URL hash на...</p>
```

SCSS:
```scss
#demo-tabs .demo-panel > p:last-child {
	@include text-sm;
	@include text-secondary;
}
```

Додај `id="demo-tabs"` на tabs section-card.

### 2.4 Toggle + Progress grid

```html
<!-- ПРЕД -->
<div class="grid-2">
    <section class="section-card">...</section>
    <section class="section-card">...</section>
</div>

<!-- ПОСЛЕ -->
<section id="demo-panels">
    <section class="section-card" id="demo-toggle">...</section>
    <section class="section-card" id="demo-progress">...</section>
</section>
```

SCSS:
```scss
#demo-panels {
	@include grid-2;
}
```

#### Server status header — отстрани inline styles

ПРЕД:
```html
<div>
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border);">
        <strong>Серверски статус</strong>
        <button type="button" data-ln-toggle-for="server-status" class="btn btn--secondary" style="padding:0.25rem 0.5rem; font-size: 0.75rem;">▼</button>
    </header>
    <main id="server-status" data-ln-toggle="open">
```

ПОСЛЕ:
```html
<article>
    <header>
        <strong>Серверски статус</strong>
        <button type="button" data-ln-toggle-for="server-status" class="btn btn--secondary">▼</button>
    </header>
    <section id="server-status" data-ln-toggle="open" class="collapsible">
        <section class="collapsible-body">
            <table>...</table>
        </section>
    </section>
</article>
```

SCSS:
```scss
#demo-toggle article > header {
	@include flex;
	@include justify-between;
	@include items-center;
	@include pb(0.75rem);
	@include mb(0.75rem);
	@include border-b;

	button {
		@include px(0.5rem);
		@include py(0.25rem);
		@include text-xs;
	}
}
```

**Важно:** Избриши го стариот `#server-status` правило во demo.scss (max-height hack, линии 79-90).

#### Progress листа

ПРЕД:
```html
<div class="stack">
    <div>
        <small class="text-secondary">CPU — 72%</small>
        <div data-ln-progress>
            <div data-ln-progress="72" class="yellow"></div>
        </div>
    </div>
    <!-- уште 2 -->
</div>
```

ПОСЛЕ:
```html
<ul>
    <li>
        <h4>CPU — 72%</h4>
        <div data-ln-progress>
            <div data-ln-progress="72" class="yellow"></div>
        </div>
    </li>
    <li>
        <h4>RAM — 45%</h4>
        <div data-ln-progress>
            <div data-ln-progress="45" class="green"></div>
        </div>
    </li>
    <li>
        <h4>Disk — 89%</h4>
        <div data-ln-progress>
            <div data-ln-progress="89" class="red"></div>
        </div>
    </li>
</ul>
```

SCSS:
```scss
#demo-progress {
	ul {
		@include stack;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	h4 {
		@include text-sm;
		@include text-secondary;
		@include font-normal;
		margin: 0;
	}
}
```

### 2.5 Toast секција

```html
<!-- ПРЕД -->
<div class="row" style="flex-wrap:wrap;">
<!-- ПОСЛЕ -->
<nav class="demo-actions">
```

(И затвори со `</nav>` наместо `</div>`)

### 2.6 AJAX секција

ПРЕД:
```html
<div class="stack-sm">
    <div class="card">
        <main>
            <pre><code>...</code></pre>
        </main>
    </div>
    <table>...</table>
    <p class="text-sm text-secondary">CSRF token автоматски...</p>
</div>
```

ПОСЛЕ:
```html
<article id="demo-ajax-info">
    <figure>
        <pre><code>...</code></pre>
    </figure>
    <table>...</table>
    <p>CSRF token автоматски...</p>
</article>
```

SCSS:
```scss
#demo-ajax-info {
	@include stack(0.5rem);

	figure {
		@include card;
		@include p(1rem);
		margin: 0;
	}

	> p {
		@include text-sm;
		@include text-secondary;
	}
}
```

### 2.7 Modal close buttons

```html
<!-- ПРЕД -->
<button data-ln-modal-close>&times;</button>
<!-- ПОСЛЕ -->
<button class="ln-icon-close" data-ln-modal-close></button>
```

Примени на СИТЕ `data-ln-modal-close` копчиња во header-ите на модалите (НЕ на footer cancel копчињата).

---

## Фаза 3: Останати demo страници

Примени ги истите принципи на останатите демо страниците:

### Општи замени (сите страници):
- `<div class="row" style="flex-wrap:wrap;">` → `<nav class="demo-actions">`
- `<div class="flex gap-3" style="flex-wrap: wrap;">` → `<nav class="demo-actions">`
- `<p class="text-sm text-secondary">` → `<p>` (стилирај преку parent контекст во SCSS)
- `<small class="text-secondary">` → семантички елемент (`<h4>`, `<label>`, `<strong>`) стилиран во SCSS
- `<div class="grid-2">` → `<section id="meaningful-name">` со `@include grid-2` во SCSS
- `<div class="card">` → `<article>` со `@include card` во SCSS
- `<div class="stack">` → `<ul>` или `<article>` со `@include stack` во SCSS
- `<button data-ln-modal-close>&times;</button>` → `<button class="ln-icon-close" data-ln-modal-close></button>`

### Специјални случаи (НЕ ги менувај demo содржините):
- **layout.html** — `.grid-2`, `.stack`, `.row` класите СЕ демо содржината, остануваат
- **utilities.html** — utility класите СЕ демо содржината, остануваат
- **typography.html** — text-size класите СЕ демо содржината, остануваат
- **icons.html** — icon класите СЕ демо содржината, остануваат

### За секоја страница:
1. Примени ги shell промените (Фаза 1)
2. Замени ги презентациските класи со семантички HTML
3. Додај соодветни SCSS правила во `demo/demo.scss` (по секции)
4. Сите inline `style=""` атрибути → премести во SCSS

---

## Верификација

После секоја страница:
1. `npm run build` — мора да помине
2. Отвори ја страницата во browser — мора да изгледа идентично
3. Тестирај JS интеракции (toggle, accordion, modal, tabs, toast)

## Референци

- `scss/config/_mixins.scss` — сите достапни mixins
- `scss/config/_icons.scss` — сите достапни иконки
- `scss/components/_toggle.scss` — collapsible pattern
- `js/ln-modal/ln-modal.scss` — modal SCSS (веќе има `@include close-button`)
