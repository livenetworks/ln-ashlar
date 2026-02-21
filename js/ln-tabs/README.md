# ln-tabs

Hash-aware tab навигација — tabs со панели, синхронизирани со URL hash.
Клик на tab го менува `location.hash`, а `hashchange` го активира соодветниот панел.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-tabs` | wrapper елемент | Креира tab инстанца |
| `data-ln-tabs-default="key"` | wrapper | Default активен tab (default: првиот) |
| `data-ln-tabs-focus="false"` | wrapper | Исклучи auto-focus на прв input во панел (default: true) |
| `data-ln-tab="key"` | tab копче | Го означува табот со клуч |
| `data-ln-panel="key"` | панел елемент | Го поврзува панелот со tab по клуч |

## API

```javascript
// Instance API (на DOM елементот)
var tabs = document.getElementById('my-tabs');
tabs.lnTabs.activate('settings');

// Constructor (рачна иницијализација)
window.lnTabs(document.body);
```

## Однесување

- URL hash синхронизација: клик на tab → `location.hash = key` → `hashchange` → панелот се прикажува
- Ако hash-от не одговара на ниеден tab, се активира default
- Auto-focus: по активирање на панел, првиот focusable елемент (input, button, select, textarea) добива focus
- ARIA: `aria-selected` на tabs, `aria-hidden` на панели
- Активен tab добива `data-active` атрибут (за CSS стилизирање)
- Неактивни панели добиваат `.hidden` класа

## HTML структура

```html
<div data-ln-tabs data-ln-tabs-default="general">
    <!-- Tab навигација -->
    <nav>
        <a data-ln-tab="general" href="#general">Општо</a>
        <a data-ln-tab="settings" href="#settings">Поставки</a>
        <a data-ln-tab="logs" href="#logs">Логови</a>
    </nav>

    <!-- Панели -->
    <div data-ln-panel="general">
        <p>Општа содржина...</p>
    </div>
    <div data-ln-panel="settings">
        <p>Поставки содржина...</p>
    </div>
    <div data-ln-panel="logs">
        <p>Логови содржина...</p>
    </div>
</div>
```

## CSS стилизирање

Активниот tab има `data-active` атрибут:

```scss
[data-ln-tab] {
    @include text-secondary;
    &[data-active] {
        @include text-primary;
        @include font-bold;
        border-bottom: 2px solid var(--color-primary);
    }
}
```

## Програмски

```javascript
// Активирај tab програмски
document.getElementById('my-tabs').lnTabs.activate('settings');

// Или преку hash
location.hash = 'settings';
```
