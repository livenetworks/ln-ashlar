# ln-confirm

> A two-click confirmation gate for destructive actions, applied as an
> attribute on the same button that performs the action. First click is
> silently swallowed and the button morphs into a "Confirm?" prompt;
> second click within the timeout passes through to whatever the
> button was already going to do — submit a form, follow a link, run an
> existing click handler. 109 lines of JS that exist because
> `window.confirm()` is banned.

## Philosophy

The browser ships `window.confirm()`, and it is banned in this project.
The project bans it because it is synchronous (freezes the page until
the user answers), unstyleable (looks like a system dialog from 1998),
unkeyboard-friendly in some browsers, sometimes blocked by popup
blockers, and untranslatable to project chrome. The first thing every
serious project does is build its own confirmation prompt — and that
component lands almost always as a *separate dialog*: open a modal,
ask "are you sure?", wire an Accept callback to the actual destructive
action. That works, but it's heavy.

`ln-confirm` is the lighter answer to the same problem. The
confirmation lives **on the button itself** — the destructive button
becomes its own gate. First click swaps the button label to the
prompt text, sets `data-confirming`, swaps the primary color to error
red, and starts a 3-second auto-revert timer. Second click within
that window does *nothing special* — the component lets the click
proceed naturally, and whatever the button was going to do (form
submit, `<a>` navigation, an existing click handler) runs unmodified.
No second event channel, no `:accept` callback, no rewiring of the
caller's logic. The two-click pattern fits inside the platform's own
event model.

This shape has consequences worth understanding before you reach for
it.

The component does NOT dispatch an "accept" event. There is one
event in the file — `ln-confirm:waiting`, fired when the button arms
on first click — and it is a notification, not a hook. If you need
to run code "on accept," put it in the same place you would have put
it without `ln-confirm`: a form's `submit` handler, a button's
`click` handler, a link's `href`. The component does not get in the
way of any of those on the second click; it simply lets the platform
run its course.

The component does NOT block the second click via JavaScript. It
removes its own intercept (`confirming = false`) and lets the click
event continue to its real default action. That is why
`<button type="submit">` works — the second click triggers the
form's submit because nothing prevents it. That is why
`<a data-ln-confirm="...">` would work too (the second click
navigates).

The component does NOT support a "real" confirm dialog. If you need a
modal "Are you sure? Type DELETE to confirm" with an input field and
a typed verification, use `ln-modal` for the dialog and wire the
submit. `ln-confirm` is the one-handed version: a click → a
confirmation prompt on the button itself → a click. There is no
"Cancel" button — the user cancels by waiting (auto-revert), pressing
ESC (no — there is no ESC handler; just wait), or clicking elsewhere
(no — clicks elsewhere do nothing; the timer is the only cancel
path). If those tradeoffs are wrong for the action, use a modal
instead.

### What `ln-confirm` does NOT do

- **Does NOT cancel on outside click.** The button stays armed for
  the full timeout regardless of where the user clicks. The only way
  to cancel is to let the timer run out (default: 3 seconds).
- **Does NOT cancel on ESC.** There is no keyboard listener at all.
  Every interaction is a click on the button itself.
- **Does NOT block the second click in JavaScript.** The component
  *removes* its intercept and the platform's default action runs.
  This is why form submits and links work without rewiring.
- **Does NOT dispatch an "accept" event.** There is one event,
  `ln-confirm:waiting`, fired on the FIRST click. The second click
  has no custom event — it's just the platform's `click`.
- **Does NOT support a Cancel button or any UI other than the morphed
  button itself.** If you want a Cancel option, use `ln-modal`.
- **Does NOT throttle rapid-fire double clicks AFTER the second.**
  Once the second click passes through, the form submits / link
  navigates — but if your destructive action is itself idempotent
  problems (an inline AJAX call that doesn't disable the button), a
  user clicking three times in quick succession can trigger two
  destroys. Disable the button on the form's `submit` handler if you
  care.
- **Does NOT modify the second click's default behavior.** Whatever
  was going to happen, happens. The component has no opinion on it.
- **Does NOT dynamically respond to `data-ln-confirm-timeout` changes
  while armed.** The timeout attribute is read fresh each time
  `_startTimer` is invoked (only at first click). Changing the
  attribute MID-confirming does NOT restart the timer with a new
  value. Both prior versions of this README claimed otherwise — that
  was a documentation bug. The attribute is NOT in the
  MutationObserver's `attributeFilter`, so the observer cannot react
  to it at all (verify in `js/ln-core/helpers.js` and the
  `registerComponent` call at the end of `ln-confirm.js`).

### Why "second click passes through" is the architectural choice

A separate-dialog confirmation has to solve a coordination problem the
in-place version doesn't. With a modal, "destruction happens on
Accept" means *the modal* must hold a callback the consumer wired up,
and the consumer can no longer use the button's native `type="submit"`
or `href` semantics — those are inert because the click that opened
the modal was preventDefault'd. Every destructive action becomes
async-coordinated through a JS callback.

In-place transformation flips that. The button's native semantics
(`type="submit"`, `href`, existing onclick) are intact, and the
component's job is purely to *insert a checkpoint* in the click
handling sequence. First click → checkpoint armed (preventDefault'd,
stopImmediatePropagation'd). Second click within timeout → checkpoint
cleared (component returns silently, no preventDefault). The form
submits; the link navigates; the onclick fires. The consumer does
not change a single line.

The cost is that the confirmation UI is constrained to "what fits
inside a button label." For text buttons that is exactly the
confirm prompt ("Are you sure?", "Confirm delete?"). For icon-only
buttons, the prompt cannot fit inside the icon, so the component
falls back to a different rendering — see "Markup anatomy" below.

## Markup anatomy

The minimum invocation is one attribute on the destructive button:

```html
<button data-ln-confirm="Are you sure?">Delete record</button>
```

That's it. The button text becomes "Are you sure?" on first click;
second click reverts the text and lets the click proceed. There is
no wrapper element, no accept handler, no init call.

### Two render modes — text button and icon-only button

The component branches at confirm time on whether the button has any
text content at construction. The branch is detected from
`dom.textContent.trim()` captured by the constructor:

- **Text button** (constructor saw `originalText !== ''`) — the
  confirm-state rendering replaces `dom.textContent` with the value
  of `data-ln-confirm`. The button visually says "Are you sure?" on
  first click and reverts to "Delete record" on the second click or
  on auto-revert.
- **Icon-only button** (constructor saw `originalText === ''`) — the
  confirm-state rendering finds the inner `svg.ln-icon use`, swaps
  its `href` to `#ln-check`, adds the `ln-confirm-tooltip` class to
  the button, and writes the prompt text into a `data-tooltip-text`
  attribute. CSS reads the attribute and renders an `::after` tooltip
  bubble above the button (see `@mixin confirm-tooltip` in
  `scss/config/mixins/_confirm.scss`).

The branch is determined ONCE at construction, not on each first
click. If you mount `data-ln-confirm` on an icon-only button and
later add text content to it, the next confirm cycle still treats it
as an icon button (because `this.originalText` was captured empty on
construction). Re-init by destroying and re-creating the instance,
or set the text *before* the attribute lands.

```html
<!-- Text button — "Delete record" → "Are you sure?" → "Delete record" -->
<button data-ln-confirm="Are you sure?">Delete record</button>

<!-- Icon-only button — trash icon → check icon + tooltip "Delete?" -->
<button aria-label="Delete" data-ln-confirm="Delete?">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
</button>
```

### What state goes where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this button confirm before action? | `data-ln-confirm` (presence) | ln-confirm (instance creation) |
| Confirmation prompt text | value of `data-ln-confirm` | author |
| Auto-revert timeout (seconds) | `data-ln-confirm-timeout="3"` | author (read fresh on each `_startTimer` call) |
| Currently armed? | `data-confirming="true"` on the button | ln-confirm (sets / removes) |
| Icon-only branch active? | `.ln-confirm-tooltip` class on the button + `data-tooltip-text` attribute | ln-confirm (icon path only) |
| Original button text | `originalText` on the JS instance (captured at construction) | ln-confirm |
| Original icon `href` | `originalIconHref` on the JS instance (captured on first confirm) | ln-confirm |
| Underlying destructive action | `type="submit"` / `href` / existing `click` listener | author (untouched by ln-confirm) |

`data-confirming` is the public CSS hook. `_ln-confirm.scss` rebinds
`--color-primary` to `--color-error` while it's set, which colours
the button red without re-declaring the button's structure (the
`@mixin btn` reads `--color-primary` for its accent — see
`CLAUDE.md` § Override Architecture). Project SCSS can hook into
this attribute too.

The `ln-confirm-tooltip` class is the icon-only mode marker. Project
SCSS can hook into it. The default chrome is provided by
`@mixin confirm-tooltip` in `scss/config/mixins/_confirm.scss`,
applied at `scss/components/_confirm.scss` to the `.ln-confirm-tooltip`
selector. The mixin uses `@mixin tooltip-bubble` from
`scss/config/mixins/_tooltip.scss` so the bubble chrome matches
`ln-tooltip`.

## States & visual feedback

There are exactly two button states: **idle** and **confirming**.
Transitions are click- or timer-driven; nothing else moves them.

| Trigger | What JS sets | What the user sees |
|---|---|---|
| First click on idle button | `confirming = true`; `data-confirming="true"` on button; text-mode swaps `textContent` to prompt OR icon-mode swaps `<use href>` to `#ln-check`, adds `.ln-confirm-tooltip` + `data-tooltip-text`, swaps `aria-label` to the prompt, appends a `<span class="sr-only" role="alert">` announcer; `_startTimer` schedules `_reset` after `data-ln-confirm-timeout` seconds (default 3); `ln-confirm:waiting` dispatched | Button label changes to prompt (or icon flips to a check with tooltip); `--color-primary` rebinds to `--color-error` so the button turns red |
| Second click within timeout | `confirming` was already `true`; the click handler returns *without* preventDefault, then calls `_reset()` synchronously; the click continues to its real default action | Button reverts visually (text / icon restored, red gone); the form submits / link navigates / existing click handler runs |
| Timer fires (no second click) | `_reset()` runs from `setTimeout`: clears `data-confirming`, restores text or icon, removes `.ln-confirm-tooltip` and `data-tooltip-text`, restores `aria-label` and removes the sr-only announcer in icon mode, clears the timer reference | Button reverts to idle visually; nothing else happens (the destructive action does NOT run) |
| `destroy()` called | `_reset()` is invoked first (so a destroy mid-confirm cleans up); the click listener is removed; instance reference deleted | Button stops gating clicks. If destroy is called while confirming, the button visually reverts. The next click, if any, runs whatever native handlers it has, immediately. |

The confirming state is purely DOM-attribute-driven, so any project
CSS that targets `[data-confirming]` (whatever shape) wins. The
library default repaints the button red. Override or extend at will.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-confirm="text"` | `<button>` | Marks the button as confirm-gated. The value is the prompt text shown on first click. If empty, defaults to `"Confirm?"`. | Presence creates the instance and attaches the click listener. The value is consumed only at confirm time (read by `_enterConfirm`); changing it later in markup does NOT propagate to the live instance — `confirmText` is captured once at construction. |
| `data-ln-confirm-timeout="3"` | `<button>` | Auto-revert delay in seconds. Default `3`. Accepts decimals (`"1.5"`). | Read fresh at each `_startTimer` call (which only happens on first click). Mutating mid-confirm does NOT restart the timer. The attribute is NOT in the MutationObserver's `attributeFilter`, so the observer does not react to it at all. |
| `data-confirming="true"` | `<button>` (auto) | Set by JS while the button is armed. Removed on second click, on timer fire, or on `destroy()`. | The public CSS hook for the confirming state. The library default rebinds `--color-primary` to `--color-error` while it's set, but this is opt-in via `_ln-confirm.scss`. Pure JS state with a public CSS surface. |
| `.ln-confirm-tooltip` (class) | `<button>` (auto) | Added in icon-only mode while armed. Removed on revert. | Marker for the icon-only branch's tooltip CSS. Paired with `data-tooltip-text`. While armed, the button's `aria-label` is also temporarily replaced with the prompt text and a transient `<span class="sr-only" role="alert">` announcer is inserted, so screen-reader users hear the prompt on first click. |
| `data-tooltip-text="text"` | `<button>` (auto) | Set in icon-only mode while armed. Carries the prompt text for the CSS-driven `::after` tooltip bubble. | Removed on revert. The tooltip bubble is rendered by `@mixin confirm-tooltip` reading `attr(data-tooltip-text)`. Distinct from `ln-tooltip`'s `data-ln-tooltip`. |

`disabled` on the button works as expected — a disabled button gets
no click events at all, so neither first-click nor second-click run.
ln-confirm has no special handling for `disabled`; the platform takes
care of it.

## Events

One event is dispatched. Bubbles, not cancelable.

| Event | Bubbles | Cancelable | `detail` | Dispatched when | Common consumer |
|---|---|---|---|---|---|
| `ln-confirm:waiting` | yes | no | `{ target: HTMLElement }` | First click finishes arming (after attribute / text / icon swaps and timer start) | Analytics ("user almost-deleted"); page-level state ("show a Cancel All button while any confirm is armed") |

There is no `ln-confirm:accept`, no `ln-confirm:cancel`, no
`ln-confirm:reset`, no `ln-confirm:destroyed`. Specifically:

- The **second click** is the platform `click` event running its
  default action (form submit / link navigate / existing click
  handler). If you need to run code on accept, attach to that path —
  the form's `submit`, the link's navigation, the button's native
  click — exactly as you would without `ln-confirm`.
- The **auto-revert timer firing** is silent. There is no event for
  "user did not confirm in time."
- The **timer-cancel from second click** is silent. There is no
  event for "user clicked through."
- **`destroy()`** is silent. No `:destroyed` event.

If you need richer notification (analytics for both arm and accept,
say), wire it on the consumer side — `:waiting` plus the form's
`submit` covers the normal flow.

`detail.target` is the button element that armed. The event
dispatches *on* the button and bubbles, so `document.addEventListener`
catches every confirm on the page; listening on a parent scope
catches confirms within that subtree.

## API (component instance)

`window.lnConfirm(root)` re-runs the init scan over `root`. The
shared `MutationObserver` registered by `registerComponent` already
covers AJAX inserts and `data-ln-confirm` attribute additions; call
this manually only when you inject markup into a Shadow DOM root or
another document context the observer cannot see.

`el.lnConfirm` on a DOM element exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLElement` | Back-reference to the button |
| `confirming` | `boolean` | Current state. `true` between first and second click (or first click and timer fire). |
| `originalText` | `string` | The button's `textContent.trim()` captured at construction. Restored on every revert. |
| `confirmText` | `string` | The prompt text from `data-ln-confirm` at construction. Defaults to `"Confirm?"` if attribute is empty. |
| `revertTimer` | `number \| null` | The current `setTimeout` handle for auto-revert; `null` while idle. |
| `isIconButton` | `boolean` | Set during confirm if the button was empty-text at construction. Used by `_reset` to choose the revert path. |
| `originalIconHref` | `string \| null` | Captured icon `<use href>` for icon-only buttons. Restored on revert. |
| `destroy()` | method | Calls `_reset` first (cleans up if armed), then removes the click listener and deletes the instance reference. The button's `data-ln-confirm` attribute is left in place. |

There is no `arm()`, `accept()`, or `cancel()` method. The component
shape is "click is the only input." Programmatic open/close would
contradict the in-place model — what would "accept" even do without
a click to pass through?

If you want to revert a confirming button programmatically (cancel
without waiting for the timer), there is no public API; the closest
escape is `el.lnConfirm.destroy()` which forces a `_reset` call as
its first step, then re-creating the instance. This is rare in
practice and a sign the workflow probably wants `ln-modal` instead.

## Examples

### Minimal — text button

```html
<button data-ln-confirm="Delete this record?">Delete record</button>
```

First click swaps the label to "Delete this record?" and arms the
button. Second click within 3 seconds — nothing — the button has no
form to submit and no `onclick` handler, so the second click reverts
visually and does nothing else. This is a shape worth seeing in
isolation: the component does not *cause* an action; it gates an
existing one.

### Form submit — the canonical use case

```html
<form action="/users/42/delete" method="POST">
    <button type="submit" data-ln-confirm="Delete user?">Delete</button>
</form>
```

First click swaps the label and stops `submit`. Second click within
3 seconds — `_reset` runs synchronously, the click continues, the
form submits via the platform's native POST. No JS rewiring; the
form's `action` and `method` are the contract.

If you have an `ln-form:submit` listener attached for AJAX submission,
the same flow works — `ln-form` listens to the form's `submit` event,
which fires only on the second click. ln-confirm is invisible to
ln-form.

### Icon-only button — trash → check + tooltip

```html
<button aria-label="Delete" data-ln-confirm="Delete?">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
</button>
```

First click swaps the icon to `#ln-check`, adds `.ln-confirm-tooltip`,
and writes `data-tooltip-text="Delete?"`. The `@mixin confirm-tooltip`
default chrome shows a tooltip bubble above the button reading
"Delete?" while armed. The button colour shifts to error red because
the mixin sets `color: hsl(var(--color-error)) !important`. Second
click within timeout reverts everything.

On first click, the icon-only branch also handles screen-reader
output: it captures the original `aria-label`, swaps it to the
prompt text (`"Delete?"` in this example), and appends a transient
`<span class="sr-only" role="alert">` inside the button carrying the
prompt. AT announces the alert immediately — works even if the user
tapped on mobile and focus is no longer on the button. On revert,
the announcer span is removed and the original `aria-label` is
restored. The CSS tooltip bubble itself is sighted-only by design;
the AT announcement is the parallel channel.

### Custom timeout

```html
<!-- Auto-revert after 1.5 seconds -->
<button data-ln-confirm="Confirm?" data-ln-confirm-timeout="1.5">Remove</button>

<!-- Auto-revert after 6 seconds — for slower destructive actions -->
<button data-ln-confirm="Confirm?" data-ln-confirm-timeout="6">Delete</button>
```

`data-ln-confirm-timeout` accepts any positive number (seconds). The
default if missing or invalid is `3`. The attribute is read at first
click, NOT continuously — see "Common mistakes" item 4 for what this
means in practice.

### Inside a `<form data-ln-form>`

```html
<form data-ln-form action="/api/posts/12" method="DELETE">
    <button type="submit" data-ln-confirm="Delete post?">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
        Delete
    </button>
</form>
```

ln-confirm gates the FIRST click; the second click triggers the
form's native `submit` event, which `ln-form` then catches and
dispatches `ln-form:submit` on. No coordinator needed. ln-confirm and
ln-form do not know about each other; they sit on the same button
and form respectively, and the click event flow naturally walks
through ln-confirm's checkpoint first.

This is the canonical "delete via Path B" pattern when paired with
ln-http: the form's `submit` is the natural integration point, not
ln-confirm's `:waiting` event.

### Non-form destructive action with explicit AJAX

When the destructive action is an AJAX call that does NOT go through
a form, the second click is a plain `click` event on the button.
Attach the destructive code to the button's `click` listener as you
normally would; ln-confirm gates the first click and lets the second
through to your handler:

```html
<button id="delete-cache" data-ln-confirm="Clear cache?">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
    Clear server cache
</button>
```

```js
document.getElementById('delete-cache').addEventListener('click', async function () {
    // Runs only on the SECOND click — first click is preventDefault'd
    // and stopImmediatePropagation'd by ln-confirm before reaching here.
    const res = await fetch('/api/cache', { method: 'DELETE' });
    if (res.ok) showToast('Cache cleared.');
});
```

Two important bits of detail:

1. **`stopImmediatePropagation` on the first click is what makes
   this work.** ln-confirm's listener attaches at construction time,
   which is typically *before* your project's listener attaches. On
   the first click, ln-confirm runs first, calls
   `e.stopImmediatePropagation()`, and your listener never sees the
   event. On the second click, ln-confirm returns silently *without*
   `preventDefault` or `stopImmediatePropagation`, so your listener
   runs normally. The order of listener attachment matters here — if
   your listener somehow attaches BEFORE ln-confirm (e.g., you ship
   a hand-rolled `addEventListener` in a `<script>` block above the
   ln-ashlar bundle), the first click would fire your handler too
   because `stopImmediatePropagation` only stops listeners that have
   not yet run on this event.
2. **The fetch call is awaited inside the click handler.** Nothing
   in ln-confirm forces this to be async-safe — the second click
   passes through synchronously, your `await` sets up the promise,
   the function returns, and the user can click again. If your
   handler is racy under double-click, disable the button at the top
   of the handler.

### Button group with multiple confirms

```html
<ul>
    <li>
        <button aria-label="Edit"><svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg></button>
    </li>
    <li>
        <button aria-label="Delete" data-ln-confirm="Delete?">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
        </button>
    </li>
</ul>
```

Each `[data-ln-confirm]` button is its own instance with its own
arm-state. Arming one does NOT arm the others; arming one does NOT
reset other already-armed siblings. If two delete buttons in
adjacent rows are both armed, both are armed independently and each
will auto-revert on its own timer.

### Inside `[data-ln-table]` — overflow escape for the tooltip

`ln-data-table` and other table-style containers use
`overflow: clip` on `[data-ln-table]`, which would clip the icon-only
mode's `::after` tooltip outside the row. The `_ln-confirm.scss`
rule:

```scss
[data-ln-table]:has([data-confirming]) {
    overflow: visible;
}
```

reverts the table to `overflow: visible` while *any* descendant
button is confirming. This is automatic — no consumer wiring. The
moment the button reverts, `[data-confirming]` is removed and the
`:has()` selector unmatches, restoring the table's overflow clipping.

If your project uses a different scrollable container with the same
clip, replicate the rule: `.my-scroll-container:has([data-confirming])
{ overflow: visible; }`.

### Listening for arm events

```js
document.addEventListener('ln-confirm:waiting', function (e) {
    const btn = e.detail.target;
    console.log('User armed:', btn.textContent || btn.getAttribute('aria-label'));
});
```

Note that `btn.textContent` at this point is the PROMPT text
("Are you sure?") because the swap has already happened by the time
the event dispatches. If you want the original label (e.g., to log
which button was almost-clicked), read `btn.lnConfirm.originalText`
or attach a more specific listener that knows the button identity:

```js
document.getElementById('delete-record').addEventListener('ln-confirm:waiting', function () {
    analytics.track('almost-deleted-record');
});
```

There is no `:accept` event because there is nothing for ln-confirm
to dispatch — the second click runs as a plain DOM event and the
"accept" semantic lives on whatever handler the button already had.

## Common mistakes

### Mistake 1 — Listening for an `:accept` event that does not exist

```js
// WRONG — no such event
document.getElementById('delete-btn').addEventListener('ln-confirm:accept', async function () {
    await fetch('/api/items/' + id, { method: 'DELETE' });
});
```

There is no `ln-confirm:accept` event. Look at the source —
`ln-confirm.js` dispatches exactly one event (`ln-confirm:waiting`)
and that one is on the FIRST click, not the second. The accept
semantic is the platform `click` itself: ln-confirm releases its
intercept on the second click and lets the click run.

The right wiring depends on what the button does:

```js
// RIGHT — form submit
document.getElementById('delete-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    await fetch('/api/items/' + id, { method: 'DELETE' });
});

// RIGHT — non-form button click (handler runs on the second click only)
document.getElementById('delete-btn').addEventListener('click', async function () {
    await fetch('/api/items/' + id, { method: 'DELETE' });
});
```

### Mistake 2 — Both an `onclick` and a `<form action>`

```html
<!-- AMBIGUOUS — what runs on the second click? -->
<form action="/items/12" method="POST">
    <button type="submit" onclick="alert('clicked')" data-ln-confirm="Delete?">Delete</button>
</form>
```

Both run, in order: the button's `click` listener (the `onclick`)
fires first, then the form's `submit` event fires (because nothing
called `preventDefault`). This is platform behavior, not an ln-confirm
quirk — but it's worth flagging because the in-place pattern makes it
easy to forget that the second click triggers EVERY default action
the button has.

If the click handler is supposed to *replace* the form submission,
add `e.preventDefault()` inside the click handler. If both should
run, this is fine. If only the form submission should run, drop the
`onclick`.

### Mistake 3 — Double-click protection is the consumer's job

```html
<form action="/api/items/12" method="DELETE">
    <button type="submit" data-ln-confirm="Delete?">Delete</button>
</form>
```

User hits "Delete," sees "Are you sure?", hits "Are you sure?" —
form starts submitting. User panics and hits "Are you sure?" AGAIN
during the network round-trip — the button is already in idle state
(the timer-and-arm cycle is over) but it's not disabled, so the
click runs through to the form, which submits AGAIN.

ln-confirm does not own button-disabling. The form (or the click
handler) is responsible for blocking re-submission while a request
is in flight. The simplest fix:

```js
form.addEventListener('submit', function () {
    form.querySelector('button[type="submit"]').disabled = true;
});
```

If you have `ln-form` wired up, it already handles this via
`aria-busy` and the disabled state of the submit button — see
[`ln-form` README](../ln-form/README.md). Without `ln-form`, this is
on you.

### Mistake 4 — Expecting `data-ln-confirm-timeout` mutations to take effect mid-confirm

```js
// WRONG — does NOT extend the running timer
const btn = document.querySelector('[data-ln-confirm]');
btn.click();                                          // arm: 3-second timer running
btn.setAttribute('data-ln-confirm-timeout', '10');    // hoping to extend to 10s
// → timer still expires at 3s; the attribute change is invisible to the running timer
```

The previous documentation claimed this worked. It does NOT. Two
reasons, both visible in the source:

1. The `registerComponent` call (`ln-confirm.js:108`) does not
   declare `data-ln-confirm-timeout` in `extraAttributes`. The shared
   MutationObserver's `attributeFilter` is built from the selector
   plus `extraAttributes`, so the observer does NOT fire when this
   attribute changes.
2. There is no `_syncTimeout` or equivalent method on the component.
   The timeout is read fresh each time `_startTimer` is invoked,
   which is only at first-click time inside `_enterConfirm`.

If you genuinely need to change the timeout dynamically, change the
attribute *before* the user clicks, not while armed. For example,
if your form determines the destructiveness at render time:

```html
<button data-ln-confirm="Are you sure?" data-ln-confirm-timeout="3">Save draft</button>

<!-- vs more destructive -->
<button data-ln-confirm="Permanently delete?" data-ln-confirm-timeout="6">Delete</button>
```

### Mistake 5 — Using `<a data-ln-confirm>`

```html
<!-- WRONG-ish — the constructor only attaches a click listener, but
     the icon-mode branch queries for svg.ln-icon use which works on
     any element. The attribute filter targets data-ln-confirm so
     registerComponent will instantiate. The COMPONENT works on <a>
     — but the second-click default action is link navigation, which
     means ln-confirm gates the link. That's a real use case. -->
<a href="/users/42/destroy" data-ln-confirm="Destroy account?">Destroy account</a>
```

This is documented in the strict reading of "any element with
`data-ln-confirm` becomes an instance." Setting `data-ln-confirm` on
an `<a>` does work — ln-confirm intercepts the first click and the
second click navigates to the href.

That said, **destructive actions over GET are an antipattern** —
browser pre-fetchers, link-preview crawlers, and shared-link
unfurlers can fire GET requests at the URL without any user
interaction, which is the whole reason `<form method="POST">` is the
right vehicle for destructive actions. ln-confirm working on `<a>`
elements is incidental, not a feature; prefer a form-submit button
for any actually-destructive action.

### Mistake 6 — Calling `.click()` programmatically and expecting two-clicks behavior

```js
// First click — arm
btn.click();
// Second call — ?
btn.click();
```

Both `.click()` calls run synchronously inside the same JS tick. The
first arms (`confirming = true`, timer scheduled). The second sees
`confirming === true` and falls into the second-click branch — it
calls `_reset()` and lets the (synthetic) click event run its
default action. So yes, programmatic double-click does pass through
the gate.

Whether that is the right thing to do is a design question. The
component cannot tell programmatic from user clicks (`isTrusted` is
not checked), so a script can effectively bypass the confirmation
gate. ln-confirm is a UX gate, not a security gate — it protects
against accidental destruction by the user, not against malicious
JS. If your security model needs to defend against programmatic
clicks, that's a server-side check (CSRF token, second-factor
re-auth, etc.), not a client-side concern at all.

## Related

- **`@mixin confirm-tooltip`** (`scss/config/mixins/_confirm.scss`)
  — the icon-only mode tooltip chrome. Reads `attr(data-tooltip-text)`
  for the bubble content. Composes `@mixin tooltip-bubble` from
  `_tooltip.scss` so the chrome matches `ln-tooltip`'s bubble.
- **`@mixin tooltip-bubble`** (`scss/config/mixins/_tooltip.scss`)
  — shared dark-bubble chrome reused by `confirm-tooltip` and
  `ln-tooltip`. The bubble inherits theme tokens; in dark mode it
  flips automatically.
- **[`ln-icons`](../ln-icons/README.md)** — the SVG sprite injector.
  ln-confirm's icon-mode swaps `<use href="#ln-trash">` to
  `<use href="#ln-check">` at runtime. ln-icons watches for
  runtime `href` mutations on `<use>` elements and fetches the new
  icon if it's not already in the sprite, so swapping to any Tabler
  icon name works automatically. See `ln-icons` README "Runtime icon
  swapping."
- **[`ln-form`](../ln-form/README.md)** — the canonical destructive
  flow is a form's `<button type="submit" data-ln-confirm="...">`
  inside a `<form data-ln-form action="/...">`. ln-form handles the
  submit; ln-confirm gates the first click; nothing else needs to be
  wired.
- **[`ln-http`](../ln-http/README.md)** — for AJAX deletes that go
  through Path B (drag-reorder, supersedable POSTs), the consumer's
  `click` handler on the second click dispatches `ln-http:request`.
  ln-confirm and ln-http are independent; the link is the second
  click of the destructive button.
- **[`ln-modal`](../ln-modal/README.md)** — the heavier alternative.
  Use `ln-modal` instead when the confirmation needs more than a
  prompt-on-button: typed verification ("Type DELETE to confirm"),
  multi-step warnings, contextual previews of what's about to be
  deleted, or a separate Cancel button.
- **Architecture deep-dive:** [`docs/js/confirm.md`](../../docs/js/confirm.md)
  for component internals, the click-flow timing, and the
  `stopImmediatePropagation` rationale.
- **Cross-component principles:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — `ln-confirm` is the Submit-layer's UX-gate; it sits beside
  `ln-form` and `ln-http` but coordinates with neither. Its only
  contract is "the second click is yours."
