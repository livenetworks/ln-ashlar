# Confirm — architecture reference

> Implementation notes for `ln-confirm`. The user-facing contract
> lives in [`js/ln-confirm/README.md`](../../js/ln-confirm/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-confirm/ln-confirm.js` (131 lines post-a11y).

## Position in the architecture

`ln-confirm` lives in the **Submit layer** of the four-layer data
flow described in [`docs/architecture/data-flow.md`](../architecture/data-flow.md)
— it is named there alongside `ln-form` and `ln-http` as the
destructive-action gate. But its coordination model is unique among
the three: `ln-form` and `ln-http` exchange events (`ln-form:submit`,
`ln-http:request`); `ln-confirm` exchanges *clicks*. It does not emit
an "accept" event for any consumer to listen for, and it does not
listen for any input from any other component. Its entire contract
is the platform `click` event sequence on its own button.

The reason for that design is in the README — duplicate it briefly
here for readers who arrived at the architecture document first.
A separate-dialog confirmation (modal "Are you sure? [Cancel] [OK]")
forces destructive code into a callback hung off "OK," and makes
`type="submit"` and `href` semantics inert for the gating click. The
in-place gate keeps the platform's native event flow intact: first
click is preventDefault'd, second click is silently allowed through,
and whatever the button was already going to do (form submit, link
navigation, existing `click` handler) runs unmodified. Architectural
elegance: the consumer adds one attribute and changes nothing else.

The component composes with two others, transparently, by way of DOM
attributes — it does not import or reference them in code:

- **`ln-icons`** — the icon-only mode swaps the inner `<use href>` at
  runtime. `ln-icons` watches for `href` mutations on `<use>` elements
  via its own MutationObserver, fetches the new icon if not already in
  the sprite, and the icon swap is invisible to the consumer. See
  `js/ln-icons/ln-icons.js:148`.
- **`@mixin tooltip-bubble`** — the icon-only mode's tooltip
  rendering reuses `tooltip-bubble` from `scss/config/mixins/_tooltip.scss`
  so the bubble chrome matches `ln-tooltip`. The mixin
  `@mixin confirm-tooltip` is a thin wrapper that adds positioning and
  the `attr(data-tooltip-text)` content read.

## State

Each `[data-ln-confirm]` button gets a `_component` instance stored at
`element.lnConfirm`. Instance state, all populated at construction or
during the confirm cycle:

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLElement` | Whole instance | Reference to the button — the constructor's argument |
| `confirming` | `boolean` | Whole instance | `true` between first click and either second click or timer fire. Branches the click handler. |
| `originalText` | `string` | Captured at construction | `dom.textContent.trim()` at construct time. Empty string detected as "icon-only" branch. Restored on every revert. |
| `confirmText` | `string` | Captured at construction | Value of `data-ln-confirm` at construct time, defaults to `"Confirm?"` if empty. Used to fill the button on first click. |
| `revertTimer` | `number \| null` | Set in `_startTimer`, cleared in `_reset` | The `setTimeout` handle for auto-revert. Cleared (and overwritten) on any new arm. |
| `_submitted` | `boolean` | Cycle-scoped | Set `true` on second click before `_reset` runs, blocks re-entry if a synthetic click somehow fires within the same handler. Reset to `false` by `_reset`. |
| `isIconButton` | `boolean` | Set in `_enterConfirm` (icon path) | `true` if the constructor saw `originalText === ''` AND a `svg.ln-icon use` was present at confirm time. Used by `_reset` to choose the revert path. Reset to `false` by `_reset`. |
| `originalIconHref` | `string \| null` | Set in `_enterConfirm` (icon path) | Captured `<use href>` value before the swap to `#ln-check`. Used by `_reset` to restore. Cleared by `_reset`. |
| `originalAriaLabel` | `string \| null` | Set in `_enterConfirm` (icon path) | Captured `aria-label` value before the swap to the prompt text. `null` if the button had no `aria-label`. Used by `_reset` to restore (or remove the attribute if originally absent). Cleared by `_reset`. |
| `alertNode` | `HTMLSpanElement \| null` | Set in `_enterConfirm` (icon path) | The `<span class="sr-only" role="alert">` announcer appended to the button on arm. AT announces its content (the prompt text) on insertion. Removed and nulled by `_reset`. |
| `_onClick` | `Function` | Whole instance | Bound handler for the click listener. Held as a reference so `destroy()` can call `removeEventListener` symmetrically. |

Note that `originalText` and `confirmText` are captured at
**construction time**, not at confirm time. Mutating the button's
text content or its `data-ln-confirm` attribute value AFTER
construction does not propagate to the live instance — the
component is "snapshot the contract once, run it on every click."
This is intentional: the alternative (re-read on every confirm)
would race against AJAX-driven content updates and produce confusing
UX where the button changes text mid-confirm.

The icon detection (`isIconButton` / `originalIconHref`), by
contrast, is captured at **confirm time** (inside `_enterConfirm`).
The branch is gated on `originalText === ''` (a property captured at
construction), but the actual `svg.ln-icon use` lookup happens fresh
on first click. This handles the common case where an icon is
async-rendered into the button after construction (e.g., a Lit/Vue
slot that fills late, or `ln-icons` finishing its sprite injection).

## Two-click flow — the canonical sequence

The component intercepts every click on its button. The `_onClick`
handler branches on `this.confirming`:

```
First click (confirming = false):
    1. e.preventDefault()                      ◀── blocks the platform default action
    2. e.stopImmediatePropagation()            ◀── prevents subsequent click listeners
                                                   on the same element from running
    3. _enterConfirm():
       a. confirming = true
       b. dom.setAttribute('data-confirming', 'true')      ◀── public CSS hook
       c. icon-only branch (if originalText === ''):
          - Find svg.ln-icon use; if present:
            - isIconButton = true
            - originalIconHref = use.getAttribute('href')
            - use.setAttribute('href', '#ln-check')
            - dom.classList.add('ln-confirm-tooltip')
            - dom.setAttribute('data-tooltip-text', confirmText)
            - originalAriaLabel = dom.getAttribute('aria-label')
            - dom.setAttribute('aria-label', confirmText)
            - alertNode = <span class="sr-only" role="alert">confirmText</span>
            - dom.appendChild(alertNode)        ◀── AT announces on insert
       d. text branch (if originalText !== ''):
          - dom.textContent = confirmText
       e. _startTimer():
          - clearTimeout(revertTimer) if set
          - revertTimer = setTimeout(_reset, _getTimeout() * 1000)
       f. dispatch('ln-confirm:waiting', { target: dom })

Second click (confirming = true):
    1. NO preventDefault                       ◀── click runs its default action
    2. NO stopImmediatePropagation             ◀── other handlers on this element
                                                   ALSO run
    3. if _submitted is already true → return early (re-entrancy guard)
    4. _submitted = true
    5. _reset():
       - _submitted = false (gets reset before the click really fires)
       - confirming = false
       - dom.removeAttribute('data-confirming')
       - icon path (if isIconButton):
         - Restore svg.ln-icon use href to originalIconHref
         - dom.classList.remove('ln-confirm-tooltip')
         - dom.removeAttribute('data-tooltip-text')
         - Restore aria-label from originalAriaLabel
           (or removeAttribute if it was null)
         - dom.removeChild(alertNode); alertNode = null
         - isIconButton = false; originalIconHref = null
         - originalAriaLabel = null
       - text path:
         - dom.textContent = originalText
       - clearTimeout(revertTimer); revertTimer = null
    6. Click handler returns; the click event continues
       through any remaining listeners and reaches the
       browser's default-action processor. Form submits,
       link navigates, existing onclick fires.
```

The key timing detail: `_reset` runs **synchronously inside the
click handler** before the function returns, so by the time the
browser processes the platform default action, the button has
already reverted visually. The user sees one frame: button armed →
click → button reverted → action proceeds. There is no flash of
"armed" state on the second click; the synchronous reset covers it.

### Why `stopImmediatePropagation` on the first click

`preventDefault` alone would block the platform default action
(form submit, link navigation) — that's the headline behavior. But
some buttons also have *additional click listeners* attached by
project code (analytics, validation, side effects). Without
`stopImmediatePropagation`, those listeners would fire on the first
click as well as the second — the user clicks "Delete," sees the
"Are you sure?" prompt, but their analytics already logged a
"delete-clicked" event for the first click. That's surprising and
wrong.

`stopImmediatePropagation` prevents that by stopping the click
event's propagation among same-element listeners that have not yet
run. Listeners that ran *before* ln-confirm's listener are not
affected (the event already passed them).

This means **listener attachment order matters**. `ln-confirm`
attaches its listener inside its constructor, which is called by the
shared `MutationObserver` / `findElements` machinery in
`registerComponent`. Construction time is roughly:

- For static markup at page load: `DOMContentLoaded` (or earlier if
  the document was already loaded when the script ran).
- For dynamically-added markup: shortly after the MutationObserver's
  microtask sees the new element.

If a project's hand-rolled click listener attaches *before*
ln-confirm's listener (e.g., a `<script>` block in `<head>` that
runs before the ln-ashlar bundle), that earlier listener fires on
the first click. ln-confirm's `stopImmediatePropagation` only
affects later listeners.

In practice this is rarely an issue because ln-ashlar loads early
and project code typically waits for `DOMContentLoaded` or later.
Document this in your project's coordinator setup if you have
unusual ordering.

### Why the second click does NOT call `preventDefault`

Symmetric: the second click is the "accept" semantic, and the user's
existing markup describes what should happen on accept (`type="submit"`
→ submit, `href` → navigate, `onclick` → run). ln-confirm's job is
to *insert a checkpoint* in the click sequence — once cleared, the
component steps out and lets the platform run its course.

If ln-confirm called `preventDefault` on the second click, the
component would have to host the destructive action callback itself
(the modal-dialog model). That's strictly more complexity for the
consumer (callback registration), strictly less power (the platform's
native form-submit semantics, link navigation, and event-listener
model are all bypassed), and harder to compose with `ln-form`,
`ln-http`, and existing project code.

The cost is that the consumer cannot add a `:cancel` event for "user
clicked second time." That semantic is just "the click happened" —
attach to the form's `submit`, the link's navigation, or the
button's `click` listener.

### The `_submitted` re-entrancy guard

The `_submitted` flag is a re-entrancy guard against synthetic clicks
dispatching back into the same handler. It exists for an unusual edge
case: a click handler that synthesizes ANOTHER click on the same
element synchronously. For
instance, a project that does `btn.click()` from inside a click
handler attached to the same button. Without the guard, the second
synthetic click would run the second-click branch, then the
synthetic click would run *again*, etc.

In practice this never happens — the guard is defensive. It is
reset to `false` inside `_reset`, which is called immediately after
the guard is set, so the live state of `_submitted` is `false` for
all observable purposes. It is present in the source as a belt for
the suspenders.

## Auto-revert timer mechanics

`_startTimer` uses the standard clear-then-schedule pattern: it
calls `clearTimeout(this.revertTimer)` if set, then schedules a new
`setTimeout` based on `_getTimeout() * 1000`. `_getTimeout` reads
`data-ln-confirm-timeout` fresh and applies validation:

- `parseFloat` parses a leading number (so `"1.5"` → `1.5`,
  `"abc"` → `NaN`).
- `isNaN(val)` catches the invalid-string and missing-attribute
  cases.
- `val <= 0` catches the explicitly-zero and negative-number cases.
- Either failing falls back to `DEFAULT_TIMEOUT = 3` seconds.

The timeout value is read **only when `_startTimer` runs**, which is
**only at first-click time**, which is **only inside `_enterConfirm`**.
There is no observer that re-reads the attribute, no
`onAttributeChange` callback, and no per-tick re-check. The shared
MutationObserver watches `data-ln-confirm` (the main attribute of
the selector) but NOT `data-ln-confirm-timeout` — see
`js/ln-core/helpers.js:332-341` for how `observedAttributes` is
extracted from the selector, and verify that `extraAttributes` is
empty for ln-confirm in the `registerComponent` call at
`ln-confirm.js:108`.

Practical implication: changing `data-ln-confirm-timeout` while the
button is armed does NOT extend or shorten the running timer. The
attribute is observed at first-click time only, and the timer is
already scheduled by then. To change the timeout dynamically,
change the attribute *before* the user arms — for example, in
markup, or in coordinator code that updates the attribute when the
form's destructiveness changes.

This corrects a previously-documented (and wrong) claim in earlier
versions of this doc and the README. The documentation drift had
no bug consequences because no consumer code in ln-ashlar relied on
mid-confirm timeout changes; it was just incorrect prose.

## Icon-only branch — detection and rendering

`originalText` is captured at construction time as
`dom.textContent.trim()`. Then in `_enterConfirm`, the icon branch
fires only if BOTH:

1. `originalText === ''` — the constructor saw an empty button (no
   text node descendants, just whitespace or icon).
2. A `svg.ln-icon use` exists at confirm time — the icon swap target
   is present.

If only one of those is true, the text branch runs:

- `originalText === ''` but no `svg.ln-icon use` → text branch
  applies, `dom.textContent = confirmText`. The previously-empty
  button now has just the prompt text. On revert, `originalText` is
  restored (empty), so the button visually returns to empty.
  Probably not what the author wanted; usually means the markup
  was wrong.
- `originalText !== ''` (button has text) but a `svg.ln-icon use`
  also exists → text branch applies. The icon stays as-is
  (`<use href="#ln-trash">` for example), and the surrounding text
  swaps to the prompt. Visually the icon doesn't communicate
  arming. If the project wants the icon to also flip, swap the
  inner `<use>` manually in a `ln-confirm:waiting` listener — the
  component does not.

The icon swap target `#ln-check` is hard-coded. There is no way to
configure a different icon for the armed state without modifying
the source. If a project wants `#ln-alert-triangle` instead, they
would override the swap inside their own `ln-confirm:waiting`
listener:

```js
document.addEventListener('ln-confirm:waiting', function (e) {
    const btn = e.detail.target;
    const useEl = btn.querySelector('svg.ln-icon use');
    if (useEl && useEl.getAttribute('href') === '#ln-check') {
        useEl.setAttribute('href', '#ln-alert-triangle');
    }
});
```

Note that this re-mutates the `<use href>`, so `ln-icons`'s
MutationObserver will fetch the new icon if not already in the
sprite. The revert path restores the original (`originalIconHref`),
so the project doesn't need to handle reset.

The `data-tooltip-text` attribute is the tooltip's content. It is
distinct from `data-ln-tooltip` (the `ln-tooltip` component's
attribute) — different namespace, different CSS. The `confirm-tooltip`
mixin reads `attr(data-tooltip-text)` to position the bubble; the
mixin uses `tooltip-bubble` (shared chrome) so the bubble matches
`ln-tooltip`'s look. The duplication of "tooltip" attribute names is
unfortunate but harmless — `ln-tooltip` does not query for
`data-tooltip-text`, and `ln-confirm` does not query for
`data-ln-tooltip`. They share chrome but not data attributes.

### Accessibility — aria-label swap + transient `role="alert"` announcer

The icon-only branch is a sighted-only signal in CSS terms (the
tooltip bubble is rendered via `::after`, which screen readers
ignore). To give AT users parity, `_enterConfirm` does two things on
top of the visual swap:

1. **Captures and replaces `aria-label`.** `originalAriaLabel = dom.getAttribute('aria-label')`,
   then `dom.setAttribute('aria-label', confirmText)`. The button's
   accessible name is now the prompt while armed. On `_reset`, the
   original is restored (or the attribute removed if originally
   absent).
2. **Appends a transient `<span class="sr-only" role="alert">`.**
   `aria-label` mutation alone is not announced by most AT — they
   read the accessible name on focus entry, not on attribute change
   while focus is already inside. A `role="alert"` region IS announced
   automatically when the node enters the accessibility tree, so the
   span carries the prompt text and is appended to the button on
   arm. On `_reset`, the span is removed.

The span uses the `.sr-only` utility (`scss/utilities/_utilities.scss`)
so it is invisible visually but readable by AT. It is appended to the
button itself — a `<button>` accepts phrasing content including
`<span>`, and the existing `svg.ln-icon` is also a child, so adding
the announcer span as a sibling is structurally fine.

Text-mode (when `originalText !== ''`) does NOT need this treatment
because `dom.textContent = confirmText` IS the accessible name change
— the button's accessible name updates naturally and AT picks it up
on next focus. The `aria-label` swap pattern is icon-mode-only.

The capture-and-restore pattern matches `originalIconHref` exactly:
saved on arm, restored on reset, nulled out so the next arm starts
clean. Same lifetime, same method boundaries.

## CSS — the public hooks

ln-confirm's co-located SCSS is two short rules:

```scss
[data-confirming]:not(.ln-confirm-tooltip) {
    --color-primary: var(--color-error);
}

[data-ln-table]:has([data-confirming]) {
    overflow: visible;
}
```

Both are JS-state-driven CSS — they exist to express the visual
consequence of the JS state, which fits the co-located SCSS
exception in CLAUDE.md ("ONLY for JS-state-driven CSS that cannot
exist without the JS component"). Visual styling (the actual button
chrome, the tooltip bubble) lives in the two-layer architecture —
`@mixin btn` + `@mixin confirm-tooltip` in `scss/config/mixins/`,
applied in `scss/components/`.

The first rule rebinds `--color-primary` to `--color-error` while
the button is armed. This works because `@mixin btn` reads
`--color-primary` for its accent (see CLAUDE.md § Override
Architecture and `scss/config/mixins/_btn.scss`). The button's red
fill is not declared anywhere as `background: red` — it falls out
of the cascade through the primary token. Themes that override
`--color-error` get the override automatically.

The `:not(.ln-confirm-tooltip)` exclusion is for icon-only mode,
where the button is rendered with the tooltip and the foreground
color comes from `@mixin confirm-tooltip` (which sets `color:
hsl(var(--color-error)) !important`) instead of from the button's
own `--color-primary` rebind. Excluding the tooltip mode prevents
double-application — the tooltip mixin owns the icon's red color.

The second rule (`overflow: visible` on `[data-ln-table]`) is the
table-clip escape hatch. `ln-data-table` and similar containers use
`overflow: clip` on `[data-ln-table]` to enforce row alignment, but
this clips the icon-only mode's `::after` tooltip bubble outside
the row's visual frame. The `:has()` selector keys on any
descendant `[data-confirming]` and lifts the clip while ANY confirm
in the table is armed. Once the button reverts, the descendant
attribute is removed, the `:has()` selector unmatches, and the
clip is restored.

If a project uses a different scrollable container (e.g., a custom
sidebar with `overflow: hidden` for clipping), it should add a
parallel rule. The library only ships the rule for `[data-ln-table]`.

## MutationObserver via `registerComponent`

Initialization is delegated to `registerComponent` with `'ln-confirm'`
tag, no `extraAttributes`, no `onAttributeChange`, no `onInit`
(see `ln-confirm.js:108`). The helper sets up a single global
`MutationObserver` on `document.body` configured with:

- `childList: true, subtree: true` — fires on any descendant
  insertion. New `[data-ln-confirm]` buttons anywhere in the document
  are caught.
- `attributes: true, attributeFilter: ['data-ln-confirm']` — fires
  ONLY when `data-ln-confirm` is added to or removed from an existing
  element. The filter is built from the selector by scanning for
  `[attr]` patterns or, since the selector here has no brackets,
  using the selector string itself. `data-ln-confirm-timeout` is
  NOT in the filter, so timeout mutations do not fire the observer.

There is no `onAttributeChange` callback, so attribute *value*
changes on `data-ln-confirm` re-run `findElements` against the
target — which, for an already-initialized element, short-circuits
in `findElements` (`if (!el[attribute])`). So changing the prompt
text via `setAttribute('data-ln-confirm', 'New prompt?')` does NOT
update the live instance's `confirmText` either.

This is consistent with the construction-time-snapshot model: the
contract is captured once, applied per click. Observer-driven
re-snapshotting would be needed only if dynamic prompt rewording is
a real use case — it isn't, at least not for any consumer in this
codebase.

## Destroy lifecycle

Three steps (see `ln-confirm.js:99-104`):

1. **Idempotency guard.** If the instance is already destroyed,
   exit silently. Standard pattern.
2. **`_reset` first.** Critical — if `destroy` is called while the
   button is armed, `_reset` cleans up the visual state (text /
   icon / class / attribute) AND clears the running `setTimeout`
   handle so it does not fire later against a destroyed instance.
   Without this, a destroyed-while-armed button would later have
   its timer fire and try to call `_reset` on `this`, which is the
   detached instance — `dom.removeAttribute('data-confirming')`
   etc. would still run on the detached element, but the JS
   instance reference is gone. No actual bug ensues because the
   methods don't reference deleted properties, but the cleanup is
   sloppy without `_reset` first. Calling it explicitly avoids the
   sloppiness.
3. **Listener unbind + instance delete.** Symmetric to construction.
   The `_onClick` reference is the same closure held by
   `addEventListener`, so `removeEventListener` matches and the
   listener detaches cleanly.

The `data-ln-confirm` attribute is **not** removed by destroy. The
caller controls the attribute; destroy only tears down the JS
instance. If the attribute is still present after destroy, a future
`registerComponent` rescan (e.g., from a `MutationObserver` mutation
on a sibling) will re-create the instance.

`destroy` does not dispatch any event. There is no
`ln-confirm:destroyed` for consumers to listen to. This is
deliberate — `ln-confirm` does not own state worth notifying about
on teardown (no rendered DOM beyond what the button already has;
no in-flight network calls; no subscriptions to clean up). If a
project wants destroy notifications, wrap the call:

```js
function destroyConfirm(btn) {
    const wasConfirming = btn.lnConfirm.confirming;
    btn.lnConfirm.destroy();
    if (wasConfirming) console.log('Destroyed mid-confirm:', btn);
}
```

## Cross-component coordination

`ln-confirm` does not import any other ln-* component. It does not
listen for any `ln-*` event. It does not emit any event the rest of
the library listens for. Its only outward signal is
`ln-confirm:waiting`, intended for analytics consumers — no library
component subscribes.

That said, three components share DOM with ln-confirm and the
interactions are worth documenting:

- **`ln-icons`** — when the icon-only branch swaps `<use href>` to
  `#ln-check`, ln-icons' MutationObserver picks up the change and
  ensures the `#ln-check` symbol is present in the sprite. If
  `#ln-check` was not previously used on the page, ln-icons fetches
  it on demand from the Tabler CDN; the swap is invisible to
  consumers (the icon appears as soon as the fetch completes,
  typically within milliseconds). The `originalIconHref` capture
  lets revert restore the original icon without re-fetching (it
  was already in the sprite, by definition, since it rendered
  initially).
- **`ln-form`** — `<form data-ln-form>` with a
  `<button type="submit" data-ln-confirm>` inside is the canonical
  destructive form pattern. The two components do not coordinate;
  ln-confirm gates the first click via `preventDefault`, ln-form's
  `submit` listener fires only on the second click, which then
  dispatches `ln-form:submit` for AJAX submission. The order of
  listener invocation is: ln-confirm's click handler runs (because
  the click event happens on the button element first, where
  ln-confirm listens), then the platform's default form submission
  triggers a `submit` event on the form, which ln-form's listener
  on the form catches. The two listeners are on different elements
  and different events; there is no race.
- **`ln-http`** — the typical "Delete via Path B" wiring is a
  consumer's `click` handler on the destructive button that
  dispatches `ln-http:request`. ln-confirm gates the first click;
  the second click reaches the consumer's handler; the handler
  dispatches the request. Path B's `key` parameter is independent
  of ln-confirm. Same-element, different listener, second click
  only.
- **`ln-data-table`** — destructive icon buttons inside a row
  (delete row, delete cell) are a common pattern. The
  `[data-ln-table]:has([data-confirming]) { overflow: visible; }`
  rule in ln-confirm's co-located SCSS handles the table's
  overflow clipping while a button is armed.

There are no negative cross-component interactions documented to
date. The component's narrow scope — one attribute, one button, one
click event — keeps it out of the way of everything else.

## Performance notes

- **Per-instance footprint.** One `addEventListener('click', ...)`
  on the button. One JS object on the element (`el.lnConfirm`). Five
  to seven instance properties. Negligible.
- **Per-arm cost.** One `setAttribute`, one `removeAttribute` (on
  revert), one `textContent` write OR one `setAttribute('href')` +
  `classList.add` + `setAttribute('data-tooltip-text')`. One
  `setTimeout` schedule. One `dispatch`. Sub-millisecond on every
  reasonable browser.
- **No repaint storms.** The DOM mutations are batched naturally by
  the browser: the click handler runs synchronously, makes its
  changes, returns; the browser does one paint at the end of the
  microtask. No `requestAnimationFrame`, no force-flushed layout
  reads.
- **No memory leaks.** `_reset` clears `revertTimer` on every
  revert, so an armed-then-reverted button has no zombie timers.
  `destroy` cleans up the listener and the instance reference.
  Even without `destroy`, removing the button from the DOM lets the
  browser GC the instance (the only strong reference is from the
  element itself).
- **Per-page cost.** N instances per page, where N is the count of
  `[data-ln-confirm]`. Each is independent. No central registry
  beyond the shared MutationObserver from `registerComponent`.

## Source map

| Lines | Concern |
|---|---|
| 1 | `registerComponent`, `dispatch` import |
| 3-9 | IIFE wrapper + double-load guard via `window[DOM_ATTRIBUTE]` (`'lnConfirm'`) |
| 11-37 | Constructor: assign `dom`, capture `originalText` and `confirmText`, init flags, define `_onClick` (the click branch on `confirming`), attach listener |
| 39-42 | `_getTimeout` — read `data-ln-confirm-timeout`, validate, fall back to default (3 seconds) |
| 44-72 | `_enterConfirm` — set `confirming = true`, write `data-confirming`, branch on icon-only vs text mode for the visual swap (icon-mode also captures `originalAriaLabel`, swaps `aria-label` to the prompt, and appends a `<span class="sr-only" role="alert">` announcer), schedule timer, dispatch `ln-confirm:waiting` |
| 75-85 | `_startTimer` — clear existing, schedule new `setTimeout` based on `_getTimeout` |
| 86-120 | `_reset` — symmetric to `_enterConfirm`: restore visual state (icon-mode also restores `aria-label` and removes the sr-only announcer), clear flags, clear timer |
| 99-104 | `destroy` — idempotency guard, `_reset` first, listener unbind, instance reference delete |
| 108 | `registerComponent` registration — selector, attribute, constructor, tag |

~131 lines total (post-a11y). The file is symmetric: every state
mutation in `_enterConfirm` has a matching restore in `_reset` —
including the icon-mode `aria-label` swap and the sr-only announcer
node. There are no half-cleanups.

## Known gaps and future work

These are documented behaviors that may want revision:

1. **No `ln-confirm:accept` event.** Documented as architectural
   choice — the second click IS the accept and runs through native
   semantics. But "no accept event" can be surprising to consumers
   coming from modal-style confirms. A future revision could add
   `ln-confirm:accept` (notification only, fired on second click
   AFTER `_reset` runs) for analytics consumers who want one signal
   per cycle. It would NOT be cancelable — the second click's
   default action runs regardless, by design.
2. **No keyboard cancel.** Pressing ESC while armed does nothing.
   ln-modal handles ESC for modals; ln-confirm does not because the
   intent was minimalism. A future revision could attach a
   document-level keydown listener while ANY ln-confirm is armed
   (gated on a global counter) and call `_reset` on Escape. Cost is
   one document listener; benefit is keyboard parity with
   ln-modal's UX.
3. **No outside-click cancel.** Clicking elsewhere does nothing —
   only the timer cancels. A future revision could attach a
   document-level click listener while armed (similar mechanism)
   that calls `_reset` if the click is outside the armed button.
   Same cost-benefit calculus as ESC.
4. **`data-ln-confirm-timeout` is observed-only-at-arm-time.** This
   is documented and probably correct (the value is consumed once,
   per cycle, at the moment of arming), but earlier versions of the
   doc claimed it was reactive to mutation. If a use case for
   mid-arm timeout extension emerges, a future revision could add
   `extraAttributes: ['data-ln-confirm-timeout']` and an
   `onAttributeChange` callback that calls `_startTimer` if
   `confirming` is true.
5. **No way to programmatically arm or revert.** There is no public
   `arm()` or `cancel()` method. A `destroy()` then re-init is the
   only escape. Probably fine; programmatic arming would contradict
   the "click is the only input" model. If a real use case emerges
   (e.g., undo banner that arms a delete), expose a thin API:
   `instance.arm()` calls `_enterConfirm`; `instance.cancel()`
   calls `_reset`.
6. **`isIconButton` flag set conditionally inside `_enterConfirm`.**
   Outside `_enterConfirm`, `this.isIconButton` is `undefined` (not
   `false`). The first call to `_enterConfirm` populates it; the
   first call to `_reset` reads it (via `if (this.isIconButton)`)
   and then sets it to `false`. The "undefined for the first arm"
   state is benign because `_reset` is never called before
   `_enterConfirm`. Cleaner would be initializing `isIconButton =
   false` and `originalIconHref = null` in the constructor — minor
   cosmetic improvement.
