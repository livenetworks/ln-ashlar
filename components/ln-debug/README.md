# ln-debug

> The diagnostic component of `ln-ashlar` that enables verbose developer warnings in console logs during development.

---

## 1. Philosophy

In production, libraries should remain silent and not pollute the browser console with developer-oriented warnings (such as template mismatch warnings or missing configuration parameters). 

The `ln-debug` component solves this by acting as a global switch:
- When active, all core validation warnings (prefixed with `[ln-` or `[lnCore`) are enabled.
- When inactive, these developer warnings are safely suppressed, maintaining a clean production log.

---

## 2. Minimal Blueprint

Add the `data-ln-debug` attribute to either the `<html>` or `<body>` element (or any element in the document) to enable debug logs:

```html
<!DOCTYPE html>
<html lang="en" data-ln-debug>
<head>
    <script src="dist/ln-ashlar.iife.js" defer></script>
</head>
<body>
    <!-- Warnings will be visible in the developer console -->
</body>
</html>
```

---

## 3. DOM & State Management

This component lives entirely at the level of the DOM. The single source of truth is the presence of the `data-ln-debug` attribute on `<html>` or `<body>`.

### Checking the State via JS

To check if debug mode is active in your scripts, query the DOM directly:

```javascript
const isDebug = document.documentElement.hasAttribute('data-ln-debug') || 
                (document.body && document.body.hasAttribute('data-ln-debug'));
```

### Toggling the State

To toggle debug mode at runtime, add or remove the attribute from the DOM:

```javascript
// Enable
document.documentElement.setAttribute('data-ln-debug', '');

// Disable
document.documentElement.removeAttribute('data-ln-debug');
```
