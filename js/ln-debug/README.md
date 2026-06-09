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

## 3. The JS State API

You can programmatically query or set the debug state:

```javascript
// Query if debug mode is active
const isDebugActive = window.lnDebug; // true/false

// Enable debug mode programmatically
window.lnDebug = true;
```
