# Forms — CSS Grid Layout Pattern

Форм layout без `<div>` wrapper-и. Секое поле е `<label>` кој ги обвиткува текстот и input-от. Grid-от го контролира распоредот — не HTML структурата.

> **Стариот pattern** (`<div class="form-group">`, `<div class="form-row">`) е **obsolete**. Не го користи.

---

## CSS основа

`@mixin form-grid` во `scss/config/_mixins.scss`:

```scss
@mixin form-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--spacing-md);

    @media (max-width: 767px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}
```

| Column span | Ширина |
|-------------|--------|
| `span 3` | ½ (2 полиња во ред) |
| `span 2` | ⅓ (3 полиња во ред) |
| `span 4` | ⅔ |
| `span 6` / `1 / -1` | full-width |

---

## HTML структура

```html
<form id="my-form">

  <!-- Стандардно поле — span контролиран од SCSS -->
  <label>
    Ime <span class="text-error">*</span>
    <input type="text" name="fname" required placeholder="...">
    <small class="text-error">Задолжително поле</small>
  </label>

  <!-- Select — ист pattern -->
  <label>
    Kategorija
    <select name="category">
      <option value="a">Опција А</option>
    </select>
  </label>

  <!-- Checkbox — текстот ПОСЛЕ input-от -->
  <label>
    <input type="checkbox" name="confirmed" value="1">
    Ги потврдувам податоците
  </label>

  <!-- .form-actions е компонентна класа — останува во HTML -->
  <div class="form-actions">
    <button type="button" class="btn btn--secondary">Откажи</button>
    <button type="submit" class="btn">Зачувај</button>
  </div>

</form>
```

---

## SCSS структура (app-specific)

```scss
#my-form {
  @include form-grid;          // 6 cols, gap, responsive

  > label {
    grid-column: span 3;       // default: половина
  }

  // Spacing меѓу label текст и input
  > label input,
  > label select,
  > label textarea {
    display: block;
    margin-top: 0.25rem;
  }

  // Специфични spans
  > label:nth-child(3) { grid-column: span 4; }   // 2/3
  > label:nth-child(4) { grid-column: span 2; }   // 1/3

  // Три во ред
  > label:nth-child(5),
  > label:nth-child(6),
  > label:nth-child(7) { grid-column: span 2; }

  // Full-width
  > label:nth-child(8),
  > label:nth-child(10),
  > .form-actions { grid-column: span 6; }

  // Checkbox/radio fix — ln-acme: input { width: 100% } глобално
  input[type="checkbox"],
  input[type="radio"] { width: auto; margin-top: 0; }

  // Error display
  small { display: block; }
}
```

---

## Правила

| Елемент | Правило |
|---------|---------|
| Root | `<form id="...">` — styled со `@include form-grid` во SCSS |
| Деца | Директно `<label>` — без `<div class="form-group">` или `<div class="form-row">` |
| Label | Го обвиткува текстот + input (implicit association — не треба `for`/`id`) |
| Checkbox/radio | Текстот оди **после** input-от внатре во `<label>` |
| Grid spans | Во SCSS преку `> label:nth-child(N)` — **НИКОГАШ** inline `style=""` |
| Грешки | `<small class="text-error">` внатре во `<label>` + `small { display: block }` во SCSS |
| Checkbox/radio fix | `input[type="checkbox"] { width: auto }` — задолжително |
| `<fieldset>` | САМО за семантички поврзани полиња (адреса, датум-период) — НЕ за визуелни редици |
| `.form-actions` | Компонентна класа — останува во HTML, `grid-column: span 6` во SCSS |

---

## Погрешно (стар pattern)

```html
<!-- ПОГРЕШНО — div wrapper-и, explicit for/id -->
<div class="form-group">
  <label for="name">Ime</label>
  <input type="text" id="name">
</div>

<div class="form-row">
  <div class="form-group">...</div>
  <div class="form-group">...</div>
</div>
```

---

## Demo

Live пример: `demo/forms.html` → `#demo-form-grid`
SCSS: `demo/demo.scss` → `#demo-form-grid { ... }`
