# ln-tabs

Hash-aware tab навигација — tabs со панели, синхронизирани со URL hash.
Поддржува повеќе независни tab секции на иста страна преку namespace (`id`).

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `id="key"` | wrapper | Namespace за hash (задолжително за hash sync) |
| `data-ln-tabs-key="key"` | wrapper | Алтернативен namespace (ако `id` не е погоден) |
| `data-ln-tabs` | wrapper | Креира tab инстанца |
| `data-ln-tabs-default="key"` | wrapper | Default активен tab (default: првиот) |
| `data-ln-tabs-focus="false"` | wrapper | Исклучи auto-focus на прв input во панел (default: true) |
| `data-ln-tab="key"` | tab копче | Го означува табот со клуч |
| `data-ln-panel="key"` | панел елемент | Го поврзува панелот со tab по клуч |

## Hash формат

```
#namespace:tabkey
```

Повеќе секции на иста страна — секоја ги чува своите стејтови:

```
#user-tabs:settings&project-tabs:members
```

- Без `id` / `data-ln-tabs-key` → нема hash sync, активира само `defaultKey`
- Клик во една секција ги зачувува стејтовите на сите останати секции
- Рефреш → сите секции ги враќаат своите табови

## HTML структура

```html
<!-- Секција 1 — namespace преку id -->
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <button data-ln-tab="info">Информации</button>
        <button data-ln-tab="settings">Поставки</button>
    </nav>

    <section data-ln-panel="info">...</section>
    <section data-ln-panel="settings" class="hidden">...</section>
</section>

<!-- Секција 2 — независна, иста страна -->
<section id="project-tabs" data-ln-tabs data-ln-tabs-default="overview">
    <nav>
        <button data-ln-tab="overview">Преглед</button>
        <button data-ln-tab="members">Членови</button>
    </nav>

    <section data-ln-panel="overview">...</section>
    <section data-ln-panel="members" class="hidden">...</section>
</section>
```

## API

```javascript
// Instance API (на DOM елементот)
document.getElementById('user-tabs').lnTabs.activate('settings');

// Преку hash
location.hash = 'user-tabs:settings';

// Повеќе секции преку hash
location.hash = 'user-tabs:settings&project-tabs:members';

// Constructor (рачна иницијализација)
window.lnTabs(document.body);
```

## Однесување

- URL hash синхронизација: `#namespace:tabkey` → активирај соодветен таб
- Повеќе секции: `#ns1:tab&ns2:tab` — секоја секција чита само свој namespace
- Ако клучот не одговара на ниеден таб, се активира default
- Auto-focus: по активирање на панел, првиот focusable елемент добива focus
- ARIA: `aria-selected` на tabs, `aria-hidden` на панели
- Активен tab добива `data-active` атрибут (за CSS стилизирање)
- Неактивни панели добиваат `.hidden` класа

## Events

Настанот се dispatch-ува на wrapper елементот (`[data-ln-tabs]`) и bubble-ира нагоре.

| Настан | Кога | `detail` |
|--------|------|----------|
| `ln-tabs:change` | По активирање на нов таб | `{ key, tab, panel }` |

```javascript
document.getElementById('user-tabs').addEventListener('ln-tabs:change', function(e) {
    console.log('Активен таб:', e.detail.key);
    console.log('Tab копче:', e.detail.tab);    // DOM елемент
    console.log('Панел:', e.detail.panel);      // DOM елемент
});

// Или глобално (за сите tab секции)
document.addEventListener('ln-tabs:change', function(e) {
    analytics.track('tab_change', { tab: e.detail.key });
});
```

## CSS стилизирање

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
