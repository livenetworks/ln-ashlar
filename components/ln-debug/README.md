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
3. **Console Observation Layer**: Logs every `ln-*` CustomEvent dispatched through `ln-core`, and every library attribute mutation, to the console — the library's whole runtime life, visible on demand.
4. **Zero Production Overhead**: Runs strictly in dev mode (`data-ln-debug` attribute or `dist/ln-ashlar-dev.js`).

---

## 2. Minimal Blueprint

Add the `data-ln-debug` attribute to `<body>`, or to any element whose
subtree should be observed:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Core library and Dev Verifier -->
    <script src="dist/ln-ashlar.iife.js" defer></script>
</head>
<body data-ln-debug>
    <!-- Broken references or typos will be reported clearly in the console -->
    <button data-ln-toggle-for="sidebar-menu">Toggle</button>
    <div id="sidebar-menu">Sidebar Content</div>
</body>
</html>
```

The console warning filter (§1) reads `data-ln-debug` from `<html>` or
`<body>`. The cross-reference verifier (§3) and the console observation
layer (§6) activate only on elements inside `<body>`'s subtree — see §6 for
the observation layer's host-containment rule.

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

---

## 6. Console Observation Layer

While a host is active, `ln-core`'s `dispatch()`, `dispatchCancelable()`, and
`lnFill()` log every `ln-*` CustomEvent they emit — event name, target
element, and detail payload — to the console via `console.groupCollapsed`.
The shared attribute observer likewise logs every mutation of a
`data-ln-*` attribute, and of any attribute the library's reactive
registry already observes (`lang`, `href`, `datetime`), as an `old →
new` pair. Page attributes the library has no opinion on (`class`,
`style`, `aria-*`) are never logged — this is the library's runtime life,
not the page's.

**Host containment.** A host is any element carrying `data-ln-debug`.
Multiple hosts may be active at once. An event or attribute mutation is
logged only when some active host `.contains()` the target element — this
layer observes its own subtree, exactly like every other component in the
library. Placing `data-ln-debug` on `<body>` observes the whole page;
placing it on a smaller container scopes logging to that container's
descendants only.

**Page-wide exception.** A handful of `dispatch()` calls target `window` or
`document` directly — `ln-toast:enqueue`, `ln-data-store:online` /
`offline` / `quota-exceeded`, `ln-core:locale-change` — because no element
subtree can contain a target that isn't an element. These log only when
`document.body` itself is a host.

**Scope.** `data-ln-debug` is read from elements inside `document.body`'s
subtree via the shared attribute observer, and is re-evaluated on every
mutation of that attribute — adding or removing it on any descendant of
`<body>` (including `<body>` itself) takes effect immediately, without a
reload, whether added, removed, or toggled in the DOM inspector. An element
that already carries `data-ln-debug` at the moment it is inserted into the
document — via `innerHTML`, `appendChild`, `ln-include`, or a router view
swap — becomes an active host immediately on insertion, and stops being one
the moment it is removed. `<html>` is not a supported host for this layer —
unlike the console warning filter in §1, which still reads `data-ln-debug`
from `<html>` or `<body>`. The two checks are independent and are not
required to agree.

Nothing is logged via `console.warn` or `console.debug` — `console.warn`
is reserved for markup-error diagnostics (see above), and Chrome hides
`console.debug` below its Verbose log level by default.
