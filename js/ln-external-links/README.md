# ln-external-links

Utility component — automatically processes external links for security and tracking.
No data attribute for activation — works automatically on all `<a>` and `<area>` elements.

## Behavior

Every link whose `hostname` differs from `window.location.hostname`:
1. Gets `target="_blank"` (opens in new tab)
2. Gets `rel="noopener noreferrer"` (security)
3. Is marked with `data-ln-external-link="processed"` (to avoid re-processing)

## API

```javascript
// Manually process links in a container (after dynamic addition)
window.lnExternalLinks.process(document.getElementById('new-content'));

// Process entire page
window.lnExternalLinks.process();
```

## Events

| Event | Bubbles | Detail | When |
|-------|---------|--------|------|
| `ln-external-links:processed` | yes | `{ link, href }` | When a link is processed |
| `ln-external-links:clicked` | yes | `{ link, href, text }` | When the user clicks an external link |

## Tracking example

```javascript
// Analytics tracking for external links
document.addEventListener('ln-external-links:clicked', function(e) {
    console.log('External link clicked:', e.detail.href, e.detail.text);
    // analytics.track('external_link', { url: e.detail.href });
});
```

## HTML example

```html
<!-- Before processing -->
<a href="https://example.com">External</a>

<!-- After processing (automatic) -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer" data-ln-external-link="processed">External</a>

<!-- Internal links are not changed -->
<a href="/dashboard">Dashboard</a>
```

## Notes

- Works automatically — no data attribute or manual initialization needed
- MutationObserver watches dynamically added links
- Click tracking uses event delegation on `document.body` (one listener)
