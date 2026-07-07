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

## The template is authored markup

`ln-toast` ships no runtime default template and injects nothing. The page
provides `<template data-ln-template="ln-toast-item">` as real authored
markup, same as every other `<template>` consumer in this library
(`js/ln-core/helpers.js:286-292` — `cloneTemplateScoped` resolves a
container-local template first, then falls back to the first matching
`<template>` anywhere in the document). Two valid placements:

- **Nested inside `[data-ln-toast]`** — the recommended placement; scoped
  lookup finds it without touching global document state.
- **Anywhere else in the page markup** (e.g. bottom of `<body>`) — resolved
  via the document-global fallback.

`js/ln-toast/template.html` is a copyable developer example, not a runtime
artifact — nothing imports it. If no matching `<template>` exists anywhere,
`cloneTemplateScoped` returns `null` and `_buildItem` fails loudly:
`console.warn('[ln-toast] Template "ln-toast-item" not found')`. There is no
silent fallback.

## Type → class (filled on the fragment root)

The type is a domain status consumed only by CSS, so it is the `<li>` class,
not a data attribute (status-class doctrine). The dynamic template root
carries `data-ln-attr="class:type"` and NO static class. Because fill() only
matches descendants of the node it's given, `_buildItem` calls
`fill(fragment, data)` on the raw DocumentFragment (whose child is the `<li>`)
before extracting `firstElementChild`; fill's setAttribute('class', type)
then lands on the `<li>`. `classList.add('ln-enter')` must run AFTER this,
since setAttribute clobbers the whole class attribute.

## Render pipeline

enqueue listener flow:

1. Resolve container — explicit `detail.container` | first `[data-ln-toast]`
2. Get or create `_Component` for the container
3. `cloneTemplateScoped(container, 'ln-toast-item', 'ln-toast')` —
   resolves in order: per-container `<template>` → document-global
   `<template>` (both project-authored — see "The template is authored
   markup" above). If nothing is found anywhere → `console.warn` + return.
4. `fill(fragment, { type, title, message })` — run on the DocumentFragment
   BEFORE extracting the `<li>`. Sets `class="{type}"` on the root `<li>` (via
   data-ln-attr="class:type"), and fills the title/message descendants.
   fill()'s querySelectorAll excludes its own root, so filling the fragment
   (whose child is the `<li>`) is what makes the class binding land. `message`
   is only passed through fill() when it is a string — arrays / data.errors
   render in step 6. Omitted title/message stay empty, collapsed via `:empty`.
5. Extract `li = fragment.firstElementChild`, then `li.classList.add('ln-enter')`
   — AFTER fill, because fill's setAttribute('class', …) clobbers the whole
   class attribute and would wipe a pre-added enter flag.
6. `_renderBody(.body, detail)` — array `message` → `<ul>`; `data.errors` → `<ul>`.
7. Attach click handler on `[data-ln-toast-close]` → `_dismiss(li)`
8. `_append(cmp, li)` — enforce max via shift, animate in
9. If `timeout > 0` → `setTimeout(_dismiss, timeout)` → `li._timer`

clear listener flow:

1. `detail.container` → resolve element → dismiss items matched by `[data-ln-toast-item]` (not raw children — the nested `<template>` is excluded)
2. No `detail` → for each `[data-ln-toast]` → dismiss items matched by `[data-ln-toast-item]`

## SSR hydration

On `_Component` construction, each `[data-ln-toast-item]` child present in the container is hydrated in place by `_hydrateLI(li, cmp)` — behavior-only, no template clone, no DOM replacement:

1. Bind the close button found at `[data-ln-toast-close]` inside the `<li>` → `_dismiss(li)`
2. Read the per-item `data-ln-toast-timeout` override, falling back to the container's `timeoutDefault` if absent
3. If the resolved timeout is `> 0`, start the auto-dismiss `setTimeout` → `li._timer`

If the number of authored items exceeds `data-ln-toast-max`, the oldest excess is removed (`removeChild`, no exit animation) before hydration runs.

`_hydrateLI` and `_buildItem` are two genuinely separate code paths: `_buildItem` builds dynamic items from the template + `fill()` for the `ln-toast:enqueue` path; `_hydrateLI` never touches the authored `<li>`'s markup — it only queries inside it and attaches behavior.

## Dismiss flow

`_dismiss(li)`:

1. `clearTimeout(li._timer)`
2. `classList.remove('ln-enter')` (defensive, in case dismissed before the enter animation's `requestAnimationFrame` fired) + `classList.add('ln-out')`
3. `setTimeout(200ms)` → `parentNode.removeChild(li)`

`.ln-enter` is only ever present on JS-created items (`_buildItem` adds it immediately after cloning; `_append` removes it one `requestAnimationFrame` later). SSR-authored `<li>` elements never receive `.ln-enter` — they render in their final visible state on first paint.

## Lifecycle

| Event | Trigger |
|-------|---------|
| `ln-toast:enqueue` (window) | Project code; ln-toast listens |
| `ln-toast:clear` (window) | Project code; ln-toast listens |

`destroy()` (per `_Component`) dismisses all current toasts and removes the instance reference. Not exposed via event — internal cleanup only.

## ARIA

Live-region semantics live on the container (`aria-live="polite"
aria-atomic="false"`, authored once by the consumer/backend), not on
individual items. Neither `_buildItem` (dynamic path) nor `_hydrateLI` (SSR
path) ever sets `role` or `aria-live` — JS carries zero ARIA logic. This is
deliberate: ln-toast is a non-blocking surface by design; an
`aria-live="assertive"`/`role="alert"` interruption on error toasts would
contradict that, and a nested independent live region inside an already-live
container risks double-announcement in screen readers.

## Icon selection (pure CSS, no JS map)

The dynamic `<template>` authors all 4 icon variants
(`success`/`error`/`warn`/`info`) as a `<ul>/<li data-ln-toast-when="...">`
list, all hidden by default. CSS shows the `<li>` whose `data-ln-toast-when`
matches the card's type class (see `scss/components/_toast.scss`). This is
the same when-toggle primitive as `data-ln-modal-when`. JS never writes an
icon `href` and holds no type→icon lookup table.

## Why no JS API

Consistent with the campaign that landed event-only contracts on ln-modal, ln-tabs, ln-filter, ln-toggle. One way to mutate state per component. Pure event dispatch is portable across iframes, web components, and Blade `@push` blocks without import resolution.
