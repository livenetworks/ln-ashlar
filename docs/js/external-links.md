# External Links

Auto-processes external links for security. File: `js/ln-external-links/ln-external-links.js`.

## Behavior

Automatically applied to all links. No HTML attributes needed.

- External links get `target="_blank"` and `rel="noopener noreferrer"`
- Processed links marked with `data-ln-external-link="processed"`
- MutationObserver catches dynamically added links

## JS API

```js
// Manually process links in a container
window.lnExternalLinks.process(container);
```

## Events

| Event | Detail |
|-------|--------|
| `ln-external-links:processed` | `{link, href}` -- When a link is processed |
| `ln-external-links:clicked` | `{link, href, text}` -- When external link clicked |
