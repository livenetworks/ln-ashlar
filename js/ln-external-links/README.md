# ln-external-links

Utility компонента — автоматски ги обработува надворешните линкови за безбедност и tracking.
Нема data attribute за активирање — работи автоматски на сите `<a>` и `<area>` елементи.

## Однесување

Секој линк чиј `hostname` се разликува од `window.location.hostname`:
1. Добива `target="_blank"` (отвара во нов tab)
2. Добива `rel="noopener noreferrer"` (безбедност)
3. Се означува со `data-ln-external-link="processed"` (за да не се обработи повторно)

## API

```javascript
// Рачно обработи линкови во контејнер (по динамичко додавање)
window.lnExternalLinks.process(document.getElementById('new-content'));

// Обработи цела страница
window.lnExternalLinks.process();
```

## Events

| Event | Bubbles | Detail | Кога |
|-------|---------|--------|------|
| `ln-external-links:processed` | да | `{ link, href }` | Кога линкот е обработен |
| `ln-external-links:clicked` | да | `{ link, href, text }` | Кога корисникот кликне надворешен линк |

## Tracking пример

```javascript
// Analytics tracking за надворешни линкови
document.addEventListener('ln-external-links:clicked', function(e) {
    console.log('External link clicked:', e.detail.href, e.detail.text);
    // analytics.track('external_link', { url: e.detail.href });
});
```

## HTML пример

```html
<!-- Пред обработка -->
<a href="https://example.com">Надворешен</a>

<!-- По обработка (автоматски) -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer" data-ln-external-link="processed">Надворешен</a>

<!-- Внатрешни линкови не се менуваат -->
<a href="/dashboard">Dashboard</a>
```

## Забелешки

- Работи автоматски — не треба data attribute или рачна иницијализација
- MutationObserver следи динамички додадени линкови
- Click tracking користи event delegation на `document.body` (еден listener)
