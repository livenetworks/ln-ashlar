# Modal — internal architecture

Source: `js/ln-modal/src/ln-modal.js`. This document is for library
maintainers — for usage, see `js/ln-modal/README.md`.

## Single source of truth

`data-ln-modal` is THE state. Every consumer (trigger click, close
button, ESC key, external script) writes the attribute. The
MutationObserver fires, `_syncAttribute(el)` runs, and that's where
the actual work happens (aria, body class, listener attachment, focus,
dispatched events).

External code mutates the modal by writing the attribute. There is
no second path. Cancellation is implemented as **observer-driven
attribute revert** (see `_syncAttribute` flow below) — there is no
imperative branch that aborts the open early.

## Lifecycle

### Init (`_component(dom)`)

1. Store `dom` reference, read initial `isOpen` from attribute.
2. Bind `_onEscape` and `_onFocusTrap` handlers (closures capturing
   `self`).
3. If `isOpen` (boot-time `data-ln-modal="open"`), apply open-state
   side effects: set `aria-modal`, `role="dialog"`, add
   `body.ln-modal-open`, attach ESC + focus-trap listeners. Note: this
   path **does not dispatch `ln-modal:before-open` or `ln-modal:open`**
   — it is the boot-time-already-open shortcut, not a state transition.
4. Return `this`.

### Open (`_syncAttribute` with `shouldBeOpen === true`)

Triggered by attribute change observed on `data-ln-modal`:

1. Read attribute, compute `shouldBeOpen`.
2. If `shouldBeOpen === instance.isOpen` → no-op return. (Guards
   against redundant attribute writes.)
3. Dispatch `ln-modal:before-open` (cancelable, bubbles).
4. If `e.defaultPrevented` → `setAttribute(DOM_SELECTOR, 'close')`
   and return. The attribute revert fires another mutation, which
   no-ops in step 2.
5. Update `instance.isOpen = true`.
6. Set `aria-modal="true"` and `role="dialog"` on the modal.
7. Add `ln-modal-open` class to `document.body` (CSS scroll lock).
8. Attach `_onEscape` and `_onFocusTrap` to `document` keydown.
9. Run focus priority: `[autofocus]` → first input/select/textarea →
   first focusable button/link.
10. Dispatch `ln-modal:open` (non-cancelable, bubbles).

### Close (`_syncAttribute` with `shouldBeOpen === false`)

Same trigger:

1. Read, compute, no-op-guard.
2. Dispatch `ln-modal:before-close` (cancelable).
3. If `e.defaultPrevented` → `setAttribute(DOM_SELECTOR, 'open')`
   and return.
4. Update `instance.isOpen = false`.
5. Remove `aria-modal` from the modal. (`role="dialog"` is left in
   place — set on first open, never removed.)
6. Detach `_onEscape` and `_onFocusTrap` from `document`.
7. Dispatch `ln-modal:close`.
8. Body scroll lock cleanup: `if (!document.querySelector('[data-ln-modal="open"]'))`,
   remove `body.ln-modal-open`. The check ensures other open modals
   keep the lock.

### Destroy (`prototype.destroy`)

1. Bail if no instance.
2. If currently open: remove `aria-modal`, detach ESC + focus-trap
   listeners, null `_returnFocusEl`, remove body scroll-lock class
   (gated on no other open modal — the check is self-excluding, so a
   still-attached modal whose attribute still reads `"open"` does not
   keep the lock alive during its own destroy).
3. Dispatch `ln-modal:destroyed`.
4. `delete this.dom.lnModal`.

No click handlers are removed — trigger and close-button clicks go
through a single permanent document-level delegated listener (see
§Trigger and close button wiring) that survives destroy.

There is no `ln-modal:before-destroy` event. Destroy is teardown,
not a state transition.

## State

Each `[data-ln-modal]` element gets an instance at `element.lnModal`:

| Property        | Type     | Description                                                                  |
|-----------------|----------|------------------------------------------------------------------------------|
| `dom`           | Element  | Modal element reference.                                                     |
| `isOpen`        | boolean  | Mirrors `data-ln-modal === "open"`. Updated by `_syncAttribute` only.        |
| `_onEscape`     | Function | Bound ESC keydown handler. Attached on open, detached on close.              |
| `_onFocusTrap`  | Function | Bound Tab keydown handler. Attached on open, detached on close.              |
| `_returnFocusEl`| Element/null | Set on open: `document.activeElement` before auto-focus runs (if not `<body>`). Read on close: re-focused if still in DOM. Nulled after restore. |

The instance has **no observable callbacks**. State sync is driven
entirely by the MutationObserver (set up by `registerComponent` in
`ln-core/helpers.js`). Mutations to `data-ln-modal` route through
`_syncAttribute`. Trigger and close-button clicks never touch the
instance — they go through the document-level click delegation.

## MutationObserver

A single global observer is set up by `registerComponent` (in
`ln-core/helpers.js`). It watches `document.body` with:

- `childList: true, subtree: true` → new `[data-ln-modal]` elements
  get instances via `findElements`.
- `attributes: true, attributeFilter: ['data-ln-modal']` → narrow
  filter, no fan-out on unrelated attribute changes.
  `data-ln-modal-for` is NOT observed — triggers need no per-element
  wiring (see §Trigger and close button wiring).

When the changed attribute is `data-ln-modal` and the target has
an instance (`mutation.target[DOM_ATTRIBUTE]`), `_syncAttribute`
fires. Otherwise (`data-ln-modal` added to a fresh element), the
observer routes through `findElements` to construct the instance.

## ESC listener lifecycle

Each open modal attaches its own `_onEscape` handler to
`document.keydown`. There is no global open-stack; one ESC press fires
every open modal's handler concurrently, each setting
`data-ln-modal="close"` on its own modal via `setAttribute`. This is
intentional — the library does not recommend stacking modals.

## Focus management

### On open

Priority order, first match wins:

1. `[autofocus]` element (any element type) inside the modal,
   filtered through `isVisible`.
2. First non-disabled, non-hidden `input` / `select` / `textarea`,
   filtered through `isVisible`.
3. First `a[href]` or `button:not([disabled])`, filtered through
   `isVisible`.

`isVisible` is imported from `ln-core` and excludes elements with
no layout (display:none, visibility:hidden, no offsetParent).

If no element matches any tier, the browser keeps focus wherever
it was. The component does not force-focus the modal element
itself.

### Focus trap (Tab key)

`_onFocusTrap` runs on every `Tab` keydown while the modal is
open. The query is **not cached** — it runs fresh per Tab, which
handles dynamically added/removed inputs inside the modal.

Selector: `a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`,
filtered through `isVisible`.

- Focusable list empty → no-op (no preventDefault).
- `Shift+Tab` on the first focusable → wrap to last.
- `Tab` on the last focusable → wrap to first.
- Anywhere else → browser-default Tab behaviour.

Positive `tabindex` is intentionally NOT supported (WCAG anti-pattern).

### On close

Focus is **restored to the element that was active before the
modal opened**. The previously focused element is captured from
`document.activeElement` at the start of the open transition (in
`_syncAttribute`, before the auto-focus priority chain runs) and
stored on the instance as `_returnFocusEl`. On close, after the
ESC and focus-trap listeners detach, the stored element is
re-focused if it is still in the DOM. The reference is then
nulled out.

Skip conditions: previous focus was `<body>` (no real focus
before open — typical of boot-time-open or programmatic open with
no preceding interaction); the stored element was removed from
the DOM during the modal's lifetime
(`document.contains(instance._returnFocusEl) === false`); the
stored reference does not have a `.focus` method.

## Body scroll lock

`document.body.classList.add('ln-modal-open')` is the lock
mechanism. CSS handles `overflow: hidden` (in the co-located
`ln-modal.scss`).

Removal is gated: when a modal closes, the cleanup checks
`document.querySelector('[data-ln-modal="open"]')` first. If any
other open modal exists, the body class stays. Only the **last**
close removes it. This means stacked modals (anti-pattern but
permitted) preserve scroll lock until all close.

The lock does **not** save and restore `window.scrollY`. On
platforms where `overflow: hidden` resets scroll position, the
page jumps. Fixing this would require a `getComputedStyle` /
`scrollY` snapshot pair, which the component does not implement.

## Trigger and close button wiring

A single module-scope click listener on `document`, registered once at
script load (outside the component), delegates all trigger and close
clicks. It is permanent — never detached, not removed by `destroy()`.

Handler flow:

- Bails on `ctrlKey || metaKey || button === 1` so middle-click and
  Ctrl/Cmd+click pass through.
- `e.target.closest('[data-ln-modal-for]')` → trigger path. Looks up
  `document.getElementById(modalId)` at click time; if the modal
  exists AND has an instance, `preventDefault()` then toggles:
  `target.setAttribute('data-ln-modal', current === 'open' ? 'close' : 'open')`.
  Missing modal or missing instance → bails silently (legitimate race
  during async DOM init). The trigger
  branch returns either way, so the close path below is not evaluated
  when a trigger ancestor matched.
- Otherwise `e.target.closest('[data-ln-modal-close]')` → close path.
  Resolves the enclosing `[data-ln-modal]` via `closest()`; if it has
  an instance, `preventDefault()` then sets `data-ln-modal="close"`.

Because lookup happens at click time, modals loaded after the trigger
still wire correctly, and dynamically added triggers / close buttons
need no attachment step. There are no per-button handlers, no guard
flags, and nothing for `destroy()` to unwire.

## Event detail wrapping

Every dispatched event carries `{ modalId: el.id, target: el }` in
`detail`. This is built manually in each `dispatch` /
`dispatchCancelable` call — `ln-core`'s `dispatch` helper does not
auto-inject component metadata.

`target` duplicates `event.target`; it is kept for listener-code
readability in nested-component scenarios.

## DOM mutations performed

Side effects the component performs on DOM, in addition to its own
attribute (`data-ln-modal`):

| Mutation                                      | When                | Reverted on close? |
|-----------------------------------------------|---------------------|--------------------|
| `aria-modal="true"` on modal                  | Open                | Yes (removed)      |
| `role="dialog"` on modal                      | First open          | No (sticks)        |
| `body.ln-modal-open` class                    | Any open            | Yes if last close  |
| `document.keydown` ESC listener               | Open                | Yes                |
| `document.keydown` focus-trap listener        | Open                | Yes                |
| `document.click` delegated listener (module-scope) | Script load | No (permanent — survives close and destroy) |
| `[autofocus]` or first-input element focused  | Open                | Yes — focus restored to pre-open `document.activeElement` |

The component does **not**:

- Add `aria-hidden` or `inert` to elements outside the modal.
- Save or restore `window.scrollY`.
- Mutate the trigger button (no `aria-expanded`).

## Z-index stack

From `scss/config/_tokens.scss`:

```
--z-sticky:    10
--z-dropdown:  20
--z-overlay:   30
--z-modal:     40
--z-toast:     50
```

The modal sits between overlay and toast — toasts intentionally
appear on top of modals (so a "Saved" confirmation is visible
even if the user is still looking at the form).

## Hash addressing (universal, by `id`)

> See also: [Hash-state doctrine](../architecture/hash-state.md) — cross-cutting rules for namespace ownership, foreign-segment preservation, and anchor interception that this feature implements.

An automatic feature that binds a modal's open/close state to a URL fragment
segment using the shared ln-core hash codec. Any modal **with an `id`** is
hash-bound; modals without an `id` are completely unaffected.

### Component state additions

The constructor stores two additional properties for hash-bound modals
(those with a non-empty `dom.id`):

| Property | Type | Description |
|---|---|---|
| `_hashNs` | `string \| null` | The modal's `id`, or `null` if the modal has no `id` |
| `_onHashChange` | Function | `hashchange` listener (registered on window at init, removed at destroy) |

Source (constructor, `js/ln-modal/src/ln-modal.js`):
```js
this._hashNs = dom.id || null;
```

### Init for hash-bound modals

After the standard init, if `_hashNs` is non-null:

1. `window.addEventListener('hashchange', this._onHashChange)`.
2. If `hashGet(id) !== null` (segment already in the URL), immediately
   set `data-ln-modal="open"` — the standard `_syncAttribute` open path runs.
   This is the deep-link bootstrap.

### `_onHashChange` handler

```
hashchange fires
  → _onHashChange reads present = (hashGet(id) !== null)
  → if (present && !self.isOpen)  → setAttribute('open')   → _syncAttribute opens
  → if (!present && self.isOpen)  → setAttribute('close')  → _syncAttribute closes
  → otherwise: no-op
```

### Triggers (hash anchors)

Canonical triggers are plain hash anchors:

```html
<!-- New mode (bare #id) -->
<a href="#modal-id">New record</a>

<!-- Edit mode (param in fragment) -->
<a href="#modal-id:42" data-ln-fill-id="42" data-ln-fill-form="my-form">Edit #42</a>
```

Anchor clicks are intercepted by ln-modal's document-level click delegation:
when the fragment namespace resolves to a `[data-ln-modal]` id, it calls
`e.preventDefault()` (via the shared `lnCore.hashLinkClick` guard, also used by
ln-tabs) and writes with `hashSet(id, param)`, so the modal segment MERGES and
foreign hash segments (e.g. an `ln-tabs` segment) are preserved — native anchor
navigation would replace the whole fragment and wipe them. `_onHashChange` then
reacts to the resulting `hashchange`. Modifier / middle / shift-clicks fall
through to native navigation (open-in-new-tab). `data-ln-modal-for` buttons
remain a programmatic opener (they write a bare `#id`, always new mode). The
param lives in the hash segment, read by the OPEN branch — not on the trigger
element. `data-ln-modal-param` no longer exists.

### Open path additions (hash-bound modals)

After the standard open steps (aria, body class, focus), the `shouldBeOpen`
branch additionally:

1. Writes `hashSet(id, '')` if the segment is absent (a programmatic
   `setAttribute('open')`, e.g. from `data-ln-modal-for`, would not have set
   the hash — this ensures the URL always reflects open state).
2. Reads `rawParam = hashGet(id)`. `''` (new mode, bare `#id`) → `null`.
3. Sets `el.dataset.lnModalMode = param ? 'edit' : 'new'`.
4. Dispatches `ln-modal:open` with enriched detail
   `{ modalId, target, hashNs, param }`.

Form fill on open is handled by the `ln-modal-fill` coordinator
(`docs/js/modal-fill.md`), not by ln-modal itself.

### Close path additions (hash-bound modals)

After the standard close steps, calls `hashSet(id, null)` to remove the
segment. If Back-button navigation already removed the segment before the
close path runs, `hashSet(id, null)` is a no-op (identical value → no write).

### Prevented-open cleanup

If `ln-modal:before-open` is prevented, the `before.defaultPrevented` branch
calls `if (instance._hashNs) hashSet(instance._hashNs, null)` before
resetting the attribute to `close`. This prevents a stale segment from
blocking re-triggering.

### Echo-safety

`hashSet(id, null)` when the segment is present removes it → fires one
`hashchange` → `_onHashChange` reads `present = false`, `isOpen = false` →
neither branch triggers → no-op. No loop. The attribute revert to `close`
likewise lands in the `shouldBeOpen === isOpen` (both `false`) early-return.

## Boot-time-already-open shortcut

If the modal mounts with `data-ln-modal="open"` already set, the
constructor applies open-state side effects directly — `aria-modal`,
`role="dialog"`, body class, ESC and focus-trap listeners — without
going through `_syncAttribute`. `ln-modal:before-open` and
`ln-modal:open` are NOT dispatched. Boot-time-open is therefore not
cancelable; if cancelable boot-time semantics are needed, mount the
modal closed and set `data-ln-modal="open"` after the listeners are
attached.
