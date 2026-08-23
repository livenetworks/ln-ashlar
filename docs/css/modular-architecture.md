# Модуларна CSS Архитектура (Core Functional vs. Theme Design System)

Овој документ ја дефинира 2-слојната модуларна CSS архитектура на `ln-ashlar` и дава упатства за користење на библиотеката во **Headless режим (со Tailwind CSS, Bootstrap или сопствен дизајн систем)** и во **Тематски режим (со комплетниот Ashlar Design System)**.

---

## 1. Архитектонски Слоеви

Библиотеката `ln-ashlar` го дели CSS-от на два независни слоја:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  СЛОЈ 1: Функционален CSS (Core / Headless)                            │
│  - @livenetworks/ashlar/core.css (или dist/ln-ashlar-core.css)         │
│  - data-ln-* механички состојби, ARIA видливост, дијалог центрирање    │
│  - CSS Grid колапс (акордеон/тогл), тост stacking, loading оверлеи     │
│  - НУЛА бои, НУЛА сенки, НУЛА типографија, НУЛА декоративни бордери    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌──────────────────────────────────────┐     ┌───────────────────────────────────┐
│  СЛОЈ 2: Ashlar Design System        │     │  СЛОЈ 3: Надворешен CSS           │
│  - @livenetworks/ashlar/theme.css    │     │  - Tailwind CSS                   │
│  - Design Tokens (CSS Variables)     │     │  - Bootstrap                      │
│  - Reset & Global Typography         │     │  - Custom корпоративна тема       │
│  - Ashlar Skin (копчиња, картички...)│     │  - Utility класи директно во HTML │
│  - Light / Dark / Density режими     │     │                                   │
└──────────────────────────────────────┘     └───────────────────────────────────┘
```

---

## 2. Пакети и Дистрибуција (`package.json`)

| Извоз (Export) | Опис | Големина (compressed) |
|---|---|---|
| `@livenetworks/ashlar` | Чист Vanilla JS бандл со сите регистрирани компоненти | ~300 KB (iife) / ~390 KB (esm) |
| `@livenetworks/ashlar/core.css` | **Слој 1**: Чист функционален CSS без визуелни мислења | **~4 KB** |
| `@livenetworks/ashlar/theme.css` | **Слој 2**: Комплетниот Ashlar Design System (без core механика) | ~179 KB |
| `@livenetworks/ashlar/full.css` | Комплетен пакет (Core + Ashlar Theme) | ~183 KB |
| `@livenetworks/ashlar/dev.css` | Дијагностички алатки и A11y валидатори за развој | ~8 KB |

---

## 3. Користење со Tailwind CSS (Headless Режим)

Кога се користи Tailwind CSS, Ashlar нуди целосна JS интерактивност (отворање, затворање, тастатурна навигација, ARIA синхронизација, филтрирање, сортирање, валидација) без **никакви конфликти** со Tailwind Preflight или боите:

### Пример: Модал со чист Tailwind CSS

```html
<!DOCTYPE html>
<html lang="mk">
<head>
    <meta charset="UTF-8">
    <title>Ashlar + Tailwind CSS</title>
    <!-- 1. Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- 2. Ashlar Core Functional CSS (само 4KB - нула визуелни конфликти) -->
    <link rel="stylesheet" href="node_modules/@livenetworks/ashlar/dist/ln-ashlar-core.css">
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-6">

    <!-- Тригер копче стилизирано со Tailwind -->
    <button data-ln-modal-for="user-modal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition">
        Отвори Кориснички Модал
    </button>

    <!-- Ashlar Modal структуриран со семантички HTML и Tailwind класи -->
    <dialog data-ln-modal id="user-modal">
        <form class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800">
            <header class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-xl font-bold text-slate-800 dark:text-white">Нов Корисник</h3>
                <button type="button" data-ln-modal-close class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    ✕
                </button>
            </header>
            
            <main class="py-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Име</label>
                    <input type="text" name="name" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                </div>
            </main>

            <footer class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" data-ln-modal-close class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    Откажи
                </button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
                    Зачувај
                </button>
            </footer>
        </form>
    </dialog>

    <!-- Ashlar JS скрипта -->
    <script type="module" src="node_modules/@livenetworks/ashlar/dist/ln-ashlar.js"></script>
</body>
</html>
```

---

## 4. Креирање на Нов Сопствен Дизајн Систем (Custom Theme)

Доколку развивате нов бренд/тема за вашата организација:

1. Вклучете го `ln-ashlar-core.css` за да ја добиете целата функционалност.
2. Дефинирајте ваш SCSS фајл `my-theme.scss` каде се стилизираат семантичките селектори:

```scss
@use '@livenetworks/ashlar/core.css';

// Нов корпоративен стил на модалот
[data-ln-modal] {
    &::backdrop {
        background-color: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(8px);
    }

    > form {
        background: #ffffff;
        border-radius: 1.5rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        padding: 2rem;
        max-width: 36rem;
    }
}
```

Нема потреба од пишување или модифицирање на ниту една линија JavaScript!
