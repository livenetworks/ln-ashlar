# ln-link

Clickable rows компонента — прави цели редови (или други елементи) клик-навигабилни врз основа на `<a>` линк внатре.
Поддржува табели, листи и генерички контејнери. Покажува URL preview (status bar) при hover.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-link` | `<table>`, `<tbody>`, `<tr>`, или друг елемент | Активира clickable row однесување |

## Однесување

- Клик на ред (надвор од `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`) → навигира до `href` на prviot `<a>` во редот
- Ctrl/Cmd+Click и middle-click → отвора во нов таб (`window.open`)
- Hover → покажува URL во status bar (долу-лево, browser-стил)
- `<table>` / `<tbody>` режим: секој `<tr>` со `<a>` внатре станува клик-навигабилен
- `<tr>` режим: директно на конкретен ред
- Генерички режим: самиот елемент е клик-навигабилен

## HTML структура

```html
<!-- Табела — сите редови стануваат clickable -->
<table data-ln-link>
    <thead>
        <tr><th>Корисник</th><th>Улога</th><th>Акции</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><a href="/users/1">Марко</a></td>
            <td>Admin</td>
            <td>
                <!-- Копчиња внатре во ред НЕ го активираат row click -->
                <button class="btn btn--sm">Уреди</button>
            </td>
        </tr>
    </tbody>
</table>

<!-- Листа на картички -->
<ul data-ln-link>
    <li>
        <a href="/projects/1"><h3>Проект 1</h3></a>
        <p>Опис на проектот</p>
    </li>
    <li>
        <a href="/projects/2"><h3>Проект 2</h3></a>
        <p>Опис на проектот</p>
    </li>
</ul>
```

## Events

Настанот се dispatch-ува на редот (row/element) и bubble-ира нагоре.

| Настан | Cancelable | Кога | `detail` |
|--------|-----------|------|----------|
| `ln-link:navigate` | ✅ | Пред навигација (може да се откаже) | `{ target, href, link }` |

```javascript
// Откажи навигација условно
document.addEventListener('ln-link:navigate', function(e) {
    if (!confirm('Сигурно сакате да одите на: ' + e.detail.href + '?')) {
        e.preventDefault();
    }
});

// Логирај навигација
document.querySelector('table[data-ln-link]').addEventListener('ln-link:navigate', function(e) {
    analytics.track('row_click', { href: e.detail.href });
    // не викај e.preventDefault() — навигацијата продолжува нормално
});
```

## CSS стилизирање

```scss
// Clickable ред — cursor pointer + hover
table[data-ln-link] tbody tr {
    cursor: pointer;
    @include transition;

    &:hover {
        @include bg-secondary;
    }
}
```

## API

```javascript
// Рачна иницијализација
window.lnLink.init(document.getElementById('my-table'));
```
