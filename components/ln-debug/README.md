# ln-debug

> The diagnostic and contract verification component of `ln-ashlar` that provides intelligent developer warnings, cross-reference validation, and typo detection in development mode.

---

## 1. Philosophy & Purpose

In production, libraries should remain completely silent and zero-overhead. In development, however, missing templates, broken target IDs (`data-ln-toggle-for`), unresolved data stores (`data-ln-table-source`), and attribute spelling typos (`data-ln-tabl-source`) lead to silent failures and wasted debugging time.

The `ln-debug` component solves this by providing:
1. **Console Warning Filter**: Gates library warnings (`[ln-` / `[lnCore`) so they only print when debug mode is enabled.
2. **Generic Cross-Reference Contract Verifier**:
   - Validates that `data-ln-*-for` target IDs resolve to existing DOM elements.
   - Validates that `data-ln-*-source` and `data-ln-*-store` consumers resolve to declared `[data-ln-data-store]` providers.
   - Flags duplicate `[data-ln-data-store]` instances across the document.
   - Detects misspelled `data-ln-*` attributes against the schema-generated attribute manifest.
3. **Zero Production Overhead**: Runs strictly in dev mode (`data-ln-debug` attribute or `dist/ln-ashlar-dev.js`).

---

## 2. Minimal Blueprint

Add the `data-ln-debug` attribute to either the `<html>` or `<body>` element:

```html
<!DOCTYPE html>
<html lang="en" data-ln-debug>
<head>
    <!-- Core library and Dev Verifier -->
    <script src="dist/ln-ashlar.iife.js" defer></script>
</head>
<body>
    <!-- Broken references or typos will be reported clearly in the console -->
    <button data-ln-toggle-for="sidebar-menu">Toggle</button>
    <div id="sidebar-menu">Sidebar Content</div>
</body>
</html>
```

---

## 3. Generic Resolvers & Diagnostic Rules

| Rule | Pattern | Description | Example Warning |
|---|---|---|---|
| **ID References** | `data-ln-*-for="id"` | Verifies target `#id` exists in the document | `[ln-debug] Unresolved ID reference: <button data-ln-toggle-for="menu"> targets "#menu", but no element with id="menu" exists in the document.` |
| **Store References** | `data-ln-*-source="store"` | Verifies `[data-ln-data-store="store"]` exists in the DOM | `[ln-debug] Unresolved store reference: <table data-ln-table-source="users"> targets store "users", but no [data-ln-data-store="users"] exists in the document.` |
| **Store Uniqueness** | `[data-ln-data-store]` | Ensures store names are globally unique | `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="users". Store names must be unique across the document.` |
| **Attribute Spelling** | `data-ln-*` | Checks against generated attribute manifest and suggests typos | `[ln-debug] Unknown attribute "data-ln-table-sorce" on <table>. Did you mean "data-ln-table-source"?` |

---

## 4. Programmatic API

When debug mode is loaded, `window.lnDebug` is available for on-demand verification and testing:

```javascript
// Perform a synchronous scan of the document (or a specific subtree)
const report = window.lnDebug.verify(document.body, { silent: false });

console.log(`Found ${report.total} issue(s):`);
console.log(report.idIssues);
console.log(report.storeIssues);
console.log(report.uniquenessIssues);
console.log(report.spellingIssues);

// Schedule a debounced verification that waits for lifecycle boot queue to settle
window.lnDebug.schedule(document.body, 50, (report) => {
    console.log('DOM verification completed:', report);
});
```

---

## 5. Lifecycle Coordination & False-Alarm Prevention

The verifier hooks into `lnCore`'s `queueBoot` and `pendingCount()`:
- If asynchronous initialization is in progress (`holdInit` > 0 from `ln-include` or router), verification is queued and executes only after boot holds are released.
- Rapid DOM mutations are debounced to ensure sibling elements (e.g. stores and consumers) have fully settled before invariants are asserted.
