# Toast — architecture reference

Notification component. File: `js/ln-toast/ln-toast.js`.

## Contract

ln-toast is event-driven. Two window events:

- `ln-toast:enqueue` — show a toast
- `ln-toast:clear` — dismiss toasts

No JS API. No imperative singleton. The only public mutators are these two events. Project code dispatches; ln-toast listens.

## Internal model

One `_Component` instance per `[data-ln-toast]` container element. No reactive proxy — direct DOM manipulation.

| Property | Type | From |
|----------|------|------|
| `dom` | HTMLElement | the `<ul>` |
| `timeoutDefault` | number | `data-ln-toast-timeout` (default 6000) |
| `max` | number | `data-ln-toast-max` (default 5) |

## Default template injection

ln-toast ships a built-in `<template data-ln-template="ln-toast-item">`
as a raw HTML file (`js/ln-toast/template.html`) imported via `?raw` and
resolved to a string constant at build time. On `guardBody` setup —
before any listener is attached — `_ensureTemplate()` checks if a
template with that name already exists anywhere in the document:

- **Exists** (project supplied it) → no-op.
- **Doesn't exist** → create a `<template>` element, set
  `data-ln-template="ln-toast-item"`, set `innerHTML` to the raw
  string, append to `document.body`.

Idempotency is delegated to the existence check; no boolean flag.
Eager injection (at setup, not at first enqueue) ensures any subsequent
`cloneTemplateScoped` call is guaranteed to find a template at
some level — the only way a "Template not found" warning fires now
is if the project explicitly removed both the auto-injected template
and any custom one.

## Render pipeline

enqueue listener flow:

1. Resolve container — explicit `detail.container` | first `[data-ln-toast]`
2. Get or create `_Component` for the container
3. `cloneTemplateScoped(container, 'ln-toast-item', 'ln-toast')` —
   resolves in order: per-container `<template>` → document-global
   `<template>` (project-supplied OR auto-injected default). If
   nothing is found anywhere → `console.warn` + return. Under normal
   conditions this can't happen because `_ensureTemplate` ran at
   setup; the warn path covers projects that removed the default
   after init.
4. `fill(li, { title, role, ariaLive, hasBody })` — declarative bind
5. `classList.add(STATUS_CLASS[type])` on `.ln-toast__card`
6. Set `href` on `<use>` inside `.ln-toast__side` to `#ln-{icon}` via `TYPE_ICON[type]`
7. `_renderBody(.ln-toast__body, detail)` — string → `<p>`; array → `<ul>`; `data.errors` → `<ul>`
8. Attach click handler on `.ln-toast__close` → `_dismiss(li)`
9. `_append(cmp, li)` — enforce max via shift, animate in
10. If `timeout > 0` → `setTimeout(_dismiss, timeout)` → `li._timer`

clear listener flow:

1. `detail.container` → resolve element → dismiss its children
2. No `detail` → for each `[data-ln-toast]` → dismiss its children

## SSR hydration

On `_Component` construction, all `[data-ln-toast-item]` children of the container are processed by `_hydrateLI(li, container)`:

1. Read `data-type`, `data-title`, `textContent`
2. Build a fresh `<li>` from the template (same `_buildItem` path)
3. Replace the original SSR `<li>` with the built one

Single render pipeline — no separate code path for SSR.

## Dismiss flow

`_dismiss(li)`:

1. `clearTimeout(li._timer)`
2. `classList.remove('ln-toast__item--in')` + `classList.add('ln-toast__item--out')`
3. `setTimeout(200ms)` → `parentNode.removeChild(li)`

## Lifecycle

| Event | Trigger |
|-------|---------|
| `ln-toast:enqueue` (window) | Project code; ln-toast listens |
| `ln-toast:clear` (window) | Project code; ln-toast listens |

`destroy()` (per `_Component`) dismisses all current toasts and removes the instance reference. Not exposed via event — internal cleanup only.

## TYPE_ICON map (internal)

`TYPE_ICON` maps `success | error | warn | info` to Tabler icon names (`circle-check`, `circle-x`, `alert-triangle`, `info-circle`). After cloning the template, JS finds the `<use>` inside `.ln-toast__side` and sets `href` to `#ln-{name}`. Icons are rendered via the ln-icons sprite — no inline SVG strings in JS.

## Why no JS API

Consistent with the campaign that landed event-only contracts on ln-modal, ln-tabs, ln-filter, ln-toggle. One way to mutate state per component. Pure event dispatch is portable across iframes, web components, and Blade `@push` blocks without import resolution.
